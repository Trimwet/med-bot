// Ingestion script — chunks markdown protocols, embeds, and upserts
// into knowledge_collection. Run via: bun run ingest

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { getDb, COLLECTIONS, closeDb } from "@/db/client";
import { embedText } from "@/services/embeddings.service";
import type { KnowledgeDocument } from "@/db/schema";

const KNOWLEDGE_DIR = join(import.meta.dir, "..", "knowledge");

async function ingestFile(fileName: string) {
  const filePath = join(KNOWLEDGE_DIR, fileName);
  const raw = await readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const embedding = await embedText(content);

  const doc: KnowledgeDocument = {
    text: content.trim(),
    embedding,
    metadata: {
      protocolName: data.protocolName,
      step: data.step,
      triageQuestions: data.triageQuestions ?? [],
      severityScale: data.severityScale ?? {},
      redFlags: data.redFlags ?? [],
      sourceFile: fileName,
    },
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  const collection = db.collection<KnowledgeDocument>(COLLECTIONS.knowledge);

  await collection.updateOne(
    { "metadata.sourceFile": fileName },
    { $set: doc },
    { upsert: true }
  );

  console.log(`Ingested ${fileName} -> ${data.protocolName} (${data.step})`);
}

async function main() {
  const files = (await readdir(KNOWLEDGE_DIR)).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log(`No markdown files found in ${KNOWLEDGE_DIR}`);
    return;
  }

  for (const file of files) {
    await ingestFile(file);
  }

  await closeDb();
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
