// Protocol admin service — the backend half of the "doctor dashboard".
//
// This is the CRUD + auto-embedding layer that lets a clinician submit a
// protocol (via an admin UI form, or any HTTP client) without ever touching
// MongoDB, the embeddings API, or running a script by hand. It mirrors the
// same shape as scripts/ingest-knowledge.ts (markdown bulk import) but is
// callable per-protocol from an HTTP route.

import { getDb, COLLECTIONS } from "@/db/client";
import { embedText, embedBatch } from "@/services/embeddings.service";
import { logger } from "@/lib/logger";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { CATEGORIES, type KnowledgeDocument, type ProtocolCategory } from "@/db/schema";

export interface ProtocolNodeInput {
  nodeId: string;
  protocolId: string;
  protocolVersion?: string;
  category: string;
  subcategory?: string;
  title: string;
  content: string;
  activationThreshold?: number;
  triageQuestions?: string[];
  severityScale?: Record<string, string>;
  redFlags?: string[];
  edges?: { toNodeId: string; label: string }[];
  updatedBy: string;
}

export interface ProtocolNodeSummary {
  nodeId: string;
  protocolId: string;
  category: ProtocolCategory;
  title: string;
  edgeCount: number;
  hasEmbedding: boolean;
  updatedAt: string;
  updatedBy: string;
}

function assertValidInput(input: ProtocolNodeInput) {
  const required: (keyof ProtocolNodeInput)[] = ["nodeId", "protocolId", "category", "title", "content", "updatedBy"];
  for (const field of required) {
    if (!input[field] || (typeof input[field] === "string" && (input[field] as string).trim() === "")) {
      throw new ValidationError(`"${field}" is required`);
    }
  }
  if (!/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(input.nodeId)) {
    throw new ValidationError(`"nodeId" must look like "protocol_id.step_name" (e.g. "malaria.step_1")`);
  }
  if (!CATEGORIES.includes(input.category as ProtocolCategory)) {
    throw new ValidationError(`"category" must be one of: ${CATEGORIES.join(", ")}`);
  }
  for (const edge of input.edges ?? []) {
    if (!edge.toNodeId || !edge.label) {
      throw new ValidationError(`each edge needs "toNodeId" and "label"`);
    }
  }
}

// Generates the node embedding + per-edge trigger embeddings. Falls back to
// empty arrays (keyword-search mode) if the embeddings API is unreachable,
// exactly like the bulk markdown ingestion script does — a protocol should
// never fail to save just because DeepSeek is briefly down.
async function embedProtocol(input: ProtocolNodeInput) {
  let nodeEmbedding: number[] = [];
  try {
    nodeEmbedding = await embedText(input.content.trim());
  } catch (err) {
    logger.warn(`embedding unavailable for ${input.nodeId}, saving without it (keyword fallback will be used)`);
  }

  const edges = (input.edges ?? []).map((e) => ({ ...e, triggerEmbedding: [] as number[] }));
  const edgeLabels = edges.map((e) => e.label);
  if (edgeLabels.length > 0) {
    try {
      const edgeEmbeddings = await embedBatch(edgeLabels);
      edges.forEach((e, i) => { e.triggerEmbedding = edgeEmbeddings[i]; });
    } catch {
      logger.warn(`edge embeddings unavailable for ${input.nodeId}, using keyword fallback`);
    }
  }

  return { nodeEmbedding, edges };
}

// Create or fully replace a protocol node. Re-embeds every time (cheap at
// this scale, and guarantees the embedding always matches the latest text).
export async function upsertProtocolNode(input: ProtocolNodeInput): Promise<KnowledgeDocument> {
  assertValidInput(input);

  const { nodeEmbedding, edges } = await embedProtocol(input);

  const db = await getDb();
  const collection = db.collection<KnowledgeDocument>(COLLECTIONS.knowledge);

  // Mark all existing nodes for this protocol as not latest (versioning support)
  await collection.updateMany(
    { protocolId: input.protocolId },
    { $set: { isLatest: false } },
  );

  const doc: KnowledgeDocument = {
    nodeId: input.nodeId,
    protocolId: input.protocolId,
    protocolVersion: input.protocolVersion ?? "1.0",
    category: input.category as ProtocolCategory,
    subcategory: input.subcategory,
    title: input.title,
    content: input.content.trim(),
    embedding: nodeEmbedding,
    activationThreshold: input.activationThreshold ?? 0.7,
    edges,
    isLatest: true,
    metadata: {
      triageQuestions: input.triageQuestions ?? [],
      severityScale: input.severityScale ?? {},
      redFlags: input.redFlags ?? [],
      sourceFile: "admin-dashboard",
    },
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedBy,
  };

  await collection.updateOne(
    { nodeId: input.nodeId },
    { $set: doc },
    { upsert: true }
  );

  logger.info("protocol node saved via admin dashboard", { nodeId: input.nodeId, updatedBy: input.updatedBy });
  return doc;
}

// Lightweight list for the dashboard table — doesn't ship embeddings or
// full content over the wire.
export async function listProtocolNodes(): Promise<ProtocolNodeSummary[]> {
  const db = await getDb();
  const docs = await db
    .collection<KnowledgeDocument>(COLLECTIONS.knowledge)
    .find({}, { projection: { nodeId: 1, protocolId: 1, category: 1, title: 1, edges: 1, embedding: 1, updatedAt: 1, updatedBy: 1 } })
    .sort({ protocolId: 1, nodeId: 1 })
    .toArray();

  return docs.map((d) => ({
    nodeId: d.nodeId,
    protocolId: d.protocolId,
    category: d.category,
    title: d.title,
    edgeCount: d.edges?.length ?? 0,
    hasEmbedding: Array.isArray(d.embedding) && d.embedding.length > 0,
    updatedAt: d.updatedAt,
    updatedBy: d.updatedBy,
  }));
}

export async function getProtocolNode(nodeId: string): Promise<KnowledgeDocument> {
  const db = await getDb();
  const doc = await db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).findOne({ nodeId });
  if (!doc) throw new NotFoundError(`No protocol node with nodeId "${nodeId}"`);
  return doc;
}

export async function deleteProtocolNode(nodeId: string): Promise<void> {
  const db = await getDb();
  const result = await db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).deleteOne({ nodeId });
  if (result.deletedCount === 0) throw new NotFoundError(`No protocol node with nodeId "${nodeId}"`);
  logger.info("protocol node deleted via admin dashboard", { nodeId });
}

export function listCategories(): readonly string[] {
  return CATEGORIES;
}
