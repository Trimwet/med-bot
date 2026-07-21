// Deploy Atlas Vector Search index on the knowledge_collection.
// Run with: npx tsx scripts/deploy-vector-index.ts
//
// Prerequisites:
//   1. A working MongoDB Atlas connection (M10+ cluster or free tier with vector search add-on)
//   2. Embeddings populated in knowledge_collection (run npm run ingest first)
//   3. Atlas admin credentials (the connection string user needs the Atlas Admin role)
//
// Once deployed, the index name is "vector_index" and $vectorSearch queries
// will work. Until then, the keyword fallback handles matching.

import { getDb, closeDb } from "@/db/client";
import { env } from "@/config/env";

async function main() {
  const db = await getDb();
  const collection = db.collection("knowledge_collection");

  // Check if index already exists
  const existing = await collection.listSearchIndexes().toArray();
  if (existing.some((idx: any) => idx.name === "vector_index")) {
    // Keep deployed indexes aligned with the configured embedding model.
    // Atlas applies this asynchronously; re-running is safe.
    await collection.updateSearchIndex("vector_index", {
      definition: {
        fields: [
          { type: "vector", path: "embedding", numDimensions: env.embeddingDimension, similarity: "cosine" },
          { type: "filter", path: "category" },
          { type: "filter", path: "isLatest" },
          { type: "filter", path: "protocolId" },
        ],
      },
    });
    console.log("✓ vector_index already exists");
    await closeDb();
    return;
  }

  // Create the vector search index
  // This requires Atlas M10+ or the Vector Search add-on on free tier.
  try {
    await collection.createSearchIndex({
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: env.embeddingDimension,
            similarity: "cosine",
          },
          {
            type: "filter",
            path: "category",
          },
          {
            type: "filter",
            path: "isLatest",
          },
          {
            type: "filter",
            path: "protocolId",
          },
        ],
      },
    });
    console.log("✓ vector_index deployment started (takes a few minutes)");
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("index already exists")) {
      console.log("✓ vector_index already exists");
    } else if (msg.includes("not supported") || msg.includes("not allowed")) {
      console.log(
        "⚠ Vector Search is not available on your Atlas tier.\n" +
        "  Upgrade to M10 or add the Vector Search add-on in Atlas.\n" +
        "  The keyword fallback will continue to work in the meantime."
      );
    } else {
      console.error("Failed to create vector index:", msg);
    }
  }

  await closeDb();
}

main().catch((err) => {
  console.error("deploy failed:", err);
  process.exit(1);
});
