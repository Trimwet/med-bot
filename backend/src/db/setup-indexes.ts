// One-time script to create the MongoDB Atlas vector search index on
// knowledge_collection. Run via: bun run db:setup-indexes
//
// Note: creating a $vectorSearch index requires an Atlas cluster (M10+
// or a Search-enabled shared tier); it cannot be done on a local
// community mongod instance.

import { getDb, COLLECTIONS, closeDb } from "./client";

const VECTOR_INDEX_NAME = "knowledge_vector_index";
const EMBEDDING_DIMENSIONS = 1536; // text-embedding-3-small

async function main() {
  const db = await getDb();
  const collection = db.collection(COLLECTIONS.knowledge);

  const existing = await collection.listSearchIndexes().toArray();
  if (existing.some((idx) => idx.name === VECTOR_INDEX_NAME)) {
    console.log(`Index "${VECTOR_INDEX_NAME}" already exists. Skipping.`);
    await closeDb();
    return;
  }

  await collection.createSearchIndex({
    name: VECTOR_INDEX_NAME,
    type: "vectorSearch",
    definition: {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: EMBEDDING_DIMENSIONS,
          similarity: "cosine",
        },
        { type: "filter", path: "metadata.protocolName" },
      ],
    },
  });

  console.log(`Created vector search index "${VECTOR_INDEX_NAME}".`);
  await closeDb();
}

main().catch((err) => {
  console.error("Failed to set up indexes:", err);
  process.exit(1);
});
