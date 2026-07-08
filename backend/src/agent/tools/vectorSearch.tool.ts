// Vector search tool — runs $vectorSearch against knowledge_collection
// to find the matching clinical protocol node for a patient's complaint.

import { getDb, COLLECTIONS } from "@/db/client";
import { embedText } from "@/services/embeddings.service";
import type { KnowledgeDocument } from "@/db/schema";

const VECTOR_INDEX_NAME = "knowledge_vector_index";

export interface VectorSearchResult {
  text: string;
  metadata: KnowledgeDocument["metadata"];
  score: number;
}

export async function searchKnowledge(
  query: string,
  limit = 1
): Promise<VectorSearchResult[]> {
  const db = await getDb();
  const collection = db.collection<KnowledgeDocument>(COLLECTIONS.knowledge);

  const queryEmbedding = await embedText(query);

  const results = await collection
    .aggregate<KnowledgeDocument & { score: number }>([
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
        },
      },
      {
        $project: {
          text: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  return results.map((r) => ({
    text: r.text,
    metadata: r.metadata,
    score: r.score,
  }));
}
