import { readFile, writeFile, unlink, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DRAFTS_DIR = join(__dirname, "..", "knowledge-drafts");
const LIVE_DIR = join(__dirname, "..", "knowledge");

const AI_DRAFT_PLACEHOLDER = "ai-draft-pending-clinical-review";

/**
 * Promote one or more reviewed draft files from knowledge-drafts/ into knowledge/.
 *
 * Usage:
 *   tsx scripts/promote-draft.ts <file1.md> [file2.md ...]
 *   tsx scripts/promote-draft.ts --protocol headache        (promotes all headache-*.md files)
 *   tsx scripts/promote-draft.ts --all                       (promotes every draft — use with care)
 *
 * Refuses to promote a file if updatedBy is still the AI placeholder, i.e. a
 * clinician has not signed off. Use --force to override (not recommended).
 */

function usage(): never {
  console.log(`
Usage:
  tsx scripts/promote-draft.ts <file1.md> [file2.md ...]
  tsx scripts/promote-draft.ts --protocol <protocolId>
  tsx scripts/promote-draft.ts --all
  add --force to skip the clinician-signoff check (not recommended)
`);
  process.exit(1);
}

async function resolveTargets(args: string[]): Promise<string[]> {
  if (args.includes("--all")) {
    return (await readdir(DRAFTS_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  }
  const protocolIdx = args.indexOf("--protocol");
  if (protocolIdx !== -1) {
    const protocolId = args[protocolIdx + 1];
    if (!protocolId) usage();
    const all = (await readdir(DRAFTS_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    return all.filter((f) => f.startsWith(protocolId + "-"));
  }
  return args.filter((a) => a.endsWith(".md"));
}

async function promoteFile(fileName: string, force: boolean): Promise<{ ok: boolean; message: string }> {
  const srcPath = join(DRAFTS_DIR, fileName);
  let raw: string;
  try {
    raw = await readFile(srcPath, "utf-8");
  } catch {
    return { ok: false, message: `not found in knowledge-drafts/` };
  }

  const { data, content } = matter(raw);
  const fm = data as { updatedBy?: string; nodeId?: string };

  if (fm.updatedBy === AI_DRAFT_PLACEHOLDER && !force) {
    return {
      ok: false,
      message: `blocked — updatedBy is still the AI placeholder. A clinician must review this file and change 'updatedBy' to their name before promotion. Re-run with --force to override (not recommended).`,
    };
  }

  const destPath = join(LIVE_DIR, fileName);
  await writeFile(destPath, raw, "utf-8");
  await unlink(srcPath);

  return { ok: true, message: `promoted -> knowledge/${fileName} (nodeId: ${fm.nodeId ?? "unknown"})` };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  const force = args.includes("--force");
  const targets = await resolveTargets(args);

  if (targets.length === 0) {
    console.log("No matching draft files found.");
    return;
  }

  console.log(`\nPromoting ${targets.length} file(s) from knowledge-drafts/ to knowledge/...\n`);

  let succeeded = 0;
  let failed = 0;

  for (const file of targets) {
    const result = await promoteFile(file, force);
    console.log(`[${result.ok ? "OK" : "SKIP"}] ${file} — ${result.message}`);
    if (result.ok) succeeded++;
    else failed++;
  }

  console.log("---");
  console.log(`${succeeded} promoted, ${failed} skipped/blocked`);

  if (succeeded > 0) {
    console.log(`\nRun 'npm run ingest' now to load the promoted file(s) into the live database.`);
  }
  if (failed > 0) {
    console.log(`Skipped files still need clinician review (see backend/knowledge-drafts/_README.md checklist).`);
  }
}

main().catch((err) => {
  console.error("Promotion failed:", err);
  process.exit(1);
});
