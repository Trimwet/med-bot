import { getDb, COLLECTIONS } from "@/db/client";
import type { KnowledgeDocument } from "@/db/schema";
import { embedText } from "@/services/embeddings.service";

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

export async function globalVectorSearch(query: string, limit = 5): Promise<{ node: KnowledgeDocument; score: number }[]> {
  const queryEmbedding = await embedText(query);
  const db = await getDb();
  const nodes = await db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).find({}).toArray();

  const scored = nodes.map((node) => ({
    node,
    score: cosineSimilarity(queryEmbedding, node.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export async function edgeConstrainedSearch(
  query: string,
  edges: KnowledgeDocument["edges"]
): Promise<{ toNodeId: string; label: string; score: number }[]> {
  if (edges.length === 0) return [];
  const queryEmbedding = await embedText(query);

  const scored = edges.map((edge) => ({
    toNodeId: edge.toNodeId,
    label: edge.label,
    score: cosineSimilarity(queryEmbedding, edge.triggerEmbedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export async function findNodeById(nodeId: string): Promise<KnowledgeDocument | null> {
  const db = await getDb();
  return db.collection<KnowledgeDocument>(COLLECTIONS.knowledge).findOne({ nodeId });
}
