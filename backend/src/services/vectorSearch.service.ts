import { getDb, COLLECTIONS } from "@/db/client";
import type { KnowledgeDocument } from "@/db/schema";
import { embedText } from "@/services/embeddings.service";
import { logger } from "@/lib/logger";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Keyword fallback ─────────────────────────────────────────────
// Used when embedding API is unavailable. Matches query words against
// document title, content, and triage question keywords.

function tokenize(text: string): string[] {
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
      if (dt.includes(qt) || qt.includes(dt)) {
        matches++;
        break;
      }
    }
  }

  return matches / queryTokens.size;
}

function keywordEdgeScore(query: string, edge: KnowledgeDocument["edges"][0]): number {
  const queryTokens = new Set(tokenize(query));
  const edgeTokens = new Set(tokenize(edge.label));

  if (queryTokens.size === 0 || edgeTokens.size === 0) return 0;

  let matches = 0;
  for (const qt of queryTokens) {
    for (const et of edgeTokens) {
      if (et.includes(qt) || qt.includes(et)) {
        matches++;
        break;
      }
    }
  }

  return matches / queryTokens.size;
}

// ── Main search functions ────────────────────────────────────────

export async function globalVectorSearch(query: string, limit = 5): Promise<{ node: KnowledgeDocument; score: number }[]> {
  const db = await getDb();
  const nodes = await db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).find({}).toArray();

  // Try embedding-based search first
  let useEmbeddings = false;
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(query);
    useEmbeddings = true;
  } catch (err) {
    logger.warn("embedding API unavailable, falling back to keyword search", {
      error: (err as Error).message,
    });
  }

  const scored = nodes.map((node) => ({
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

  // Try embedding-based search first
  let useEmbeddings = false;
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(query);
    useEmbeddings = true;
  } catch (err) {
    // Silently fall back to keyword search
  }

  const scored = edges.map((edge) => ({
    toNodeId: edge.toNodeId,
    label: edge.label,
    score: useEmbeddings
      ? cosineSimilarity(queryEmbedding, edge.triggerEmbedding)
      : keywordEdgeScore(query, edge),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export async function findNodeById(nodeId: string): Promise<KnowledgeDocument | null> {
  const db = await getDb();
  return db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).findOne({ nodeId });
}
