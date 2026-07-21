import { getDb, COLLECTIONS } from "@/db/client";
import type { KnowledgeDocument, ProtocolCategory } from "@/db/schema";
import { embedText } from "@/services/embeddings.service";
import { classifyMessage } from "@/services/categoryClassifier.service";
import { logger } from "@/lib/logger";

function cosineSimilarity(a: number[], b: number[]): number {
  // Mixed embedding models/dimensions must never produce NaN scores. A zero
  // score lets callers fall back predictably while old documents are re-ingested.
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Keyword fallback token helpers ───────────────────────────────

function tokenize(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function keywordScore(query: string, doc: KnowledgeDocument): number {
  const queryTokens = new Set(tokenize(query));
  const docTokens = new Set([
    ...tokenize(doc.title),
    ...tokenize(doc.content),
    ...(doc.metadata.triageQuestions ?? []).flatMap(tokenize),
    ...(doc.metadata.redFlags ?? []).flatMap(tokenize),
  ]);
  if (queryTokens.size === 0) return 0;
  let matches = 0;
  for (const qt of queryTokens) {
    for (const dt of docTokens) {
      if (dt.includes(qt) || qt.includes(dt)) { matches++; break; }
    }
  }
  return matches / queryTokens.size;
}

function keywordEdgeScore(query: string, label: string): number {
  const queryTokens = new Set(tokenize(query));
  const edgeTokens = new Set(tokenize(label));
  if (queryTokens.size === 0 || edgeTokens.size === 0) return 0;
  let matches = 0;
  for (const qt of queryTokens) {
    for (const et of edgeTokens) {
      if (et.includes(qt) || qt.includes(et)) { matches++; break; }
    }
  }
  return matches / queryTokens.size;
}

// ── Layer 1: coarse category classification lives in categoryClassifier.service ──

// ── Layer 2: search within a category ────────────────────────────

const VECTOR_INDEX_NAME = "vector_index";

// In-memory cache of knowledge documents for the fallback path.
// Reloaded periodically so the system eventually picks up new protocols
// without a restart.
let cachedDocs: KnowledgeDocument[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // refresh every 60 seconds

async function getCachedDocs(): Promise<KnowledgeDocument[]> {
  const now = Date.now();
  if (cachedDocs && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedDocs;
  }
  const db = await getDb();
  cachedDocs = await db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).find({}).toArray();
  cacheTimestamp = now;
  return cachedDocs;
}

// Retry $vectorSearch after this many milliseconds if it previously failed.
const VECTOR_RETRY_MS = 300_000; // 5 minutes
let lastVectorFailure = 0;

async function tryAtlasVectorSearch(
  queryEmbedding: number[],
  category: ProtocolCategory,
  limit: number
): Promise<{ node: KnowledgeDocument; score: number }[] | null> {
  // If $vectorSearch recently failed, skip retry until the cooldown expires
  // so we don't pay the latency penalty on every request.
  if (lastVectorFailure > 0 && Date.now() - lastVectorFailure < VECTOR_RETRY_MS) {
    return null;
  }

  try {
    const db = await getDb();
    const collection = db.collection<KnowledgeDocument>(COLLECTIONS.knowledge);

    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: VECTOR_INDEX_NAME,
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 150,
            limit,
            filter: {
              category: { $in: [category, "general"] },
              isLatest: { $ne: false },
            },
          },
        },
        {
          $project: {
            nodeId: 1, protocolId: 1, protocolVersion: 1, category: 1, subcategory: 1,
            title: 1, content: 1, embedding: 1, activationThreshold: 1, edges: 1,
            metadata: 1, updatedAt: 1, updatedBy: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    // Success — reset failure timestamp
    lastVectorFailure = 0;
    if (results.length > 0) {
      logger.info("Atlas $vectorSearch succeeded", { count: results.length });
    }

    return results.map((r) => {
      const { score, ...node } = r as unknown as KnowledgeDocument & { score: number };
      return { node: node as KnowledgeDocument, score };
    });
  } catch (err) {
    lastVectorFailure = Date.now();
    const message = (err as Error).message;
    const isMissingIndex = message.includes("not found") || message.includes("does not exist") || message.includes("index not found");
    logger.warn("Atlas $vectorSearch unavailable, falling back to in-memory search", {
      message,
      reason: isMissingIndex ? "vector_index_not_deployed" : "transient_error",
      willRetryInMs: VECTOR_RETRY_MS,
    });
    return null;
  }
}

export async function globalVectorSearch(
  query: string,
  limit = 5
): Promise<{ node: KnowledgeDocument; score: number }[]> {
  // Layer 1: classify the message into a broad category
  const { category } = classifyMessage(query);

  // Try to embed the query once; reused for both the Atlas path and the
  // in-memory fallback path.
  let useEmbeddings = false;
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(query);
    useEmbeddings = true;
  } catch {
    logger.warn("embedding API unavailable, using keyword search");
  }

  // Fast path: MongoDB Atlas $vectorSearch (real vector index, scales to
  // thousands of nodes without loading everything into memory).
  if (useEmbeddings) {
    const atlasResults = await tryAtlasVectorSearch(queryEmbedding, category, limit);
    if (atlasResults && atlasResults.length > 0) {
      return atlasResults;
    }
  }

  // Fallback path: in-memory search using cached documents.
  // Used when the Atlas index isn't deployed (M0 cluster) or embeddings are down.
  const allNodes = await getCachedDocs();

  let candidates = allNodes.filter((n) => n.isLatest !== false && (n.category === category || n.category === "general"));
  if (candidates.length < 2) {
    candidates = allNodes;
  }

  const scored = candidates.map((node) => ({
    node,
    score: useEmbeddings
      ? cosineSimilarity(queryEmbedding, node.embedding)
      : keywordScore(query, node),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export async function edgeConstrainedSearch(
  query: string,
  edges: KnowledgeDocument["edges"]
): Promise<{ toNodeId: string; label: string; score: number }[]> {
  if (edges.length === 0) return [];

  let useEmbeddings = false;
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(query);
    useEmbeddings = true;
  } catch {
    // fall back to keyword
  }

  const scored = edges.map((edge) => ({
    toNodeId: edge.toNodeId,
    label: edge.label,
    score: useEmbeddings
      ? cosineSimilarity(queryEmbedding, edge.triggerEmbedding)
      : keywordEdgeScore(query, edge.label),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export async function findNodeById(nodeId: string): Promise<KnowledgeDocument | null> {
  const db = await getDb();
  return db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).findOne({ nodeId });
}
