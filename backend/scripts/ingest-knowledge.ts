import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import matter from "gray-matter";
import { getDb, COLLECTIONS, closeDb } from "@/db/client";
import { embedText, embedBatch } from "@/services/embeddings.service";
import { logger } from "@/lib/logger";
import type { KnowledgeDocument } from "@/db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const KNOWLEDGE_DIR = join(__dirname, "..", "knowledge");

interface Frontmatter {
  nodeId: string;
  protocolId: string;
  protocolVersion: string;
  title: string;
  activationThreshold: number;
  triageQuestions?: string[];
  severityScale?: Record<string, string>;
  redFlags?: string[];
  edges?: { toNodeId: string; label: string }[];
  updatedBy: string;
}

async function ingestFile(fileName: string) {
  const filePath = join(KNOWLEDGE_DIR, fileName);
  const raw = await readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as unknown as Frontmatter;

  // Try to generate embeddings; fall back to empty arrays on failure
  let nodeEmbedding: number[] = [];
  try {
    nodeEmbedding = await embedText(content.trim());
  } catch (err) {
    logger.warn(`embedding unavailable for ${fileName}, using keyword fallback`);
  }

  const edges = (fm.edges ?? []).map((e) => ({ ...e, triggerEmbedding: [] as number[] }));

  const edgeTexts = edges.map((e) => e.label);
  if (edgeTexts.length > 0) {
    try {
      const edgeEmbeddings = await embedBatch(edgeTexts);
      for (let i = 0; i < edges.length; i++) {
        edges[i].triggerEmbedding = edgeEmbeddings[i];
      }
    } catch {
      logger.warn(`edge embeddings unavailable for ${fileName}, using keyword fallback`);
    }
  }

  const doc: KnowledgeDocument = {
    nodeId: fm.nodeId,
    protocolId: fm.protocolId,
    protocolVersion: fm.protocolVersion,
    title: fm.title,
    content: content.trim(),
    embedding: nodeEmbedding,
    activationThreshold: fm.activationThreshold,
    edges,
    metadata: {
      triageQuestions: fm.triageQuestions ?? [],
      severityScale: fm.severityScale ?? {},
      redFlags: fm.redFlags ?? [],
      sourceFile: fileName,
    },
    updatedAt: new Date().toISOString(),
    updatedBy: fm.updatedBy,
  };

  const db = await getDb();
  const collection = db.collection<KnowledgeDocument>(COLLECTIONS.knowledge);

  await collection.updateOne(
    { nodeId: fm.nodeId },
    { $set: doc },
    { upsert: true }
  );

  console.log(`Ingested ${fileName} -> ${fm.title} (${fm.nodeId}) [${edges.length} edges]`);
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
