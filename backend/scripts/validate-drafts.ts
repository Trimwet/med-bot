import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DRAFTS_DIR = join(__dirname, "..", "knowledge-drafts");
const LIVE_DIR = join(__dirname, "..", "knowledge");

// Fixed category enum from knowledge/_TEMPLATE.md — keep in sync manually.
const VALID_CATEGORIES = new Set([
  "infectious",
  "respiratory",
  "cardiac",
  "gi",
  "neurological",
  "maternal",
  "trauma",
  "skin",
  "mental",
  "general",
]);

const AI_DRAFT_PLACEHOLDER = "ai-draft-pending-clinical-review";
const REQUIRED_BODY_SECTIONS_ENTRY = [
  "## Overview",
  "## Self-Care Guidance",
  "## When to See a Doctor",
];
const REQUIRED_BODY_SECTIONS_SEVERE_LEAF = [
  "## Overview",
  "## When to Seek Emergency Care",
];

interface Frontmatter {
  nodeId?: string;
  protocolId?: string;
  protocolVersion?: string;
  category?: string;
  subcategory?: string;
  title?: string;
  activationThreshold?: number;
  triageQuestions?: string[];
  severityScale?: Record<string, string>;
  redFlags?: string[];
  edges?: { toNodeId: string; label: string }[];
  updatedBy?: string;
}

interface CheckResult {
  file: string;
  errors: string[];
  warnings: string[];
}

function isEntryNode(nodeId: string): boolean {
  return nodeId.endsWith(".step_1");
}

function isSevereLeaf(nodeId: string): boolean {
  return nodeId.includes("severe");
}

function isMildLeaf(nodeId: string): boolean {
  return nodeId.includes("mild");
}

async function checkFile(fileName: string, allNodeIds: Set<string>): Promise<CheckResult> {
  const filePath = join(DRAFTS_DIR, fileName);
  const raw = await readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;
  const body = content.trim();

  const errors: string[] = [];
  const warnings: string[] = [];

  // --- Required frontmatter fields ---
  for (const field of ["nodeId", "protocolId", "protocolVersion", "category", "title", "activationThreshold", "updatedBy"] as const) {
    if (fm[field] === undefined || fm[field] === "") {
      errors.push(`missing required field '${field}'`);
    }
  }

  if (fm.category && !VALID_CATEGORIES.has(fm.category)) {
    errors.push(`invalid category '${fm.category}' — must be one of: ${[...VALID_CATEGORIES].join(", ")}`);
  }

  if (fm.nodeId && fm.protocolId && !fm.nodeId.startsWith(fm.protocolId + ".")) {
    errors.push(`nodeId '${fm.nodeId}' does not start with protocolId '${fm.protocolId}.'`);
  }

  if (typeof fm.activationThreshold === "number") {
    if (fm.activationThreshold < 0 || fm.activationThreshold > 1) {
      errors.push(`activationThreshold ${fm.activationThreshold} out of expected 0-1 range`);
    }
    if (fm.activationThreshold === 0.7 || fm.activationThreshold === 0.65 || fm.activationThreshold === 0.6) {
      warnings.push(`activationThreshold (${fm.activationThreshold}) looks like an unreviewed default — clinician should sanity-check this`);
    }
  }

  // --- Clinical review markers ---
  if (fm.updatedBy === AI_DRAFT_PLACEHOLDER) {
    errors.push(`updatedBy still set to AI placeholder — no clinician has signed off yet`);
  }

  // --- Entry-node specific checks ---
  if (fm.nodeId && isEntryNode(fm.nodeId)) {
    if (!fm.redFlags || fm.redFlags.length === 0) {
      errors.push(`entry node has no redFlags defined`);
    }
    if (!fm.triageQuestions || fm.triageQuestions.length === 0) {
      warnings.push(`entry node has no triageQuestions — is that intentional?`);
    }
    if (!fm.edges || fm.edges.length === 0) {
      errors.push(`entry node has no edges — patient can't route anywhere`);
    } else {
      for (const edge of fm.edges) {
        if (!allNodeIds.has(edge.toNodeId)) {
          errors.push(`edge points to '${edge.toNodeId}' which doesn't exist among draft nodeIds in this batch`);
        }
      }
    }
    for (const section of REQUIRED_BODY_SECTIONS_ENTRY) {
      if (!body.includes(section)) {
        warnings.push(`body missing expected section '${section}'`);
      }
    }
  }

  // --- Severe leaf checks ---
  if (fm.nodeId && isSevereLeaf(fm.nodeId)) {
    if (!fm.redFlags || fm.redFlags.length === 0) {
      warnings.push(`severe leaf has no redFlags listed in frontmatter (may be inherited from entry node — verify intentional)`);
    }
    for (const section of REQUIRED_BODY_SECTIONS_SEVERE_LEAF) {
      if (!body.includes(section)) {
        errors.push(`severe leaf missing required section '${section}'`);
      }
    }
  }

  // --- Mild leaf checks ---
  if (fm.nodeId && isMildLeaf(fm.nodeId)) {
    if (!body.includes("## Self-Care Guidance")) {
      errors.push(`mild leaf missing '## Self-Care Guidance' section`);
    }
  }

  // --- Body sanity ---
  if (body.length < 200) {
    errors.push(`body content suspiciously short (${body.length} chars)`);
  }
  if (!body.includes("## Notes for the Phrasing LLM")) {
    warnings.push(`body missing '## Notes for the Phrasing LLM' section`);
  }

  // --- Nigeria-context nudge (soft check, not a hard fail) ---
  const nigeriaTerms = ["malaria", "sickle cell", "cholera", "TB", "tuberculosis", "ORS", "Nigeria"];
  if (fm.nodeId && isEntryNode(fm.nodeId) && !nigeriaTerms.some((t) => body.includes(t) || (fm.redFlags ?? []).some((r) => r.includes(t)))) {
    warnings.push(`no obvious Nigeria/local-context term found — confirm this protocol was localized, not just generic Western guidance`);
  }

  return { file: fileName, errors, warnings };
}

async function main() {
  const draftFiles = (await readdir(DRAFTS_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  if (draftFiles.length === 0) {
    console.log(`No draft files found in ${DRAFTS_DIR}`);
    return;
  }

  // Collect all nodeIds across drafts so edge-target checks work even across files
  const allNodeIds = new Set<string>();
  const parsed: { file: string; fm: Frontmatter }[] = [];
  for (const file of draftFiles) {
    const raw = await readFile(join(DRAFTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const fm = data as Frontmatter;
    if (fm.nodeId) allNodeIds.add(fm.nodeId);
    parsed.push({ file, fm });
  }

  // Also check for live knowledge/ nodeId collisions, and fold live nodeIds
  // into the edge-target set — a draft revising an existing protocol (e.g.
  // fever.step_1) may legitimately route to sibling nodes that already live
  // in knowledge/ and aren't being touched in this batch.
  let liveNodeIds = new Set<string>();
  try {
    const liveFiles = (await readdir(LIVE_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    for (const file of liveFiles) {
      const raw = await readFile(join(LIVE_DIR, file), "utf-8");
      const { data } = matter(raw);
      const fm = data as Frontmatter;
      if (fm.nodeId) {
        liveNodeIds.add(fm.nodeId);
        allNodeIds.add(fm.nodeId);
      }
    }
  } catch {
    // no live dir or unreadable — skip collision check
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  let cleanCount = 0;

  console.log(`\nValidating ${draftFiles.length} draft file(s) in knowledge-drafts/\n`);

  for (const { file, fm } of parsed) {
    const result = await checkFile(file, allNodeIds);

    if (fm.nodeId && liveNodeIds.has(fm.nodeId)) {
      result.warnings.push(`nodeId '${fm.nodeId}' already exists in live knowledge/ — promoting will overwrite on ingest`);
    }

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    const status = result.errors.length > 0 ? "FAIL" : result.warnings.length > 0 ? "WARN" : "OK";
    if (status === "OK") cleanCount++;

    console.log(`[${status}] ${file}`);
    for (const e of result.errors) console.log(`   ERROR:   ${e}`);
    for (const w of result.warnings) console.log(`   warning: ${w}`);
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`   (no issues)`);
    }
    console.log("");
  }

  console.log("---");
  console.log(`${draftFiles.length} file(s) checked | ${cleanCount} clean | ${totalErrors} error(s) | ${totalWarnings} warning(s)`);
  console.log(
    totalErrors > 0
      ? `\nFix errors before promoting any file with ERROR-level issues. Warnings should be reviewed by a clinician but don't block promotion.`
      : `\nNo structural errors. This does NOT mean clinically approved — see _README.md checklist before promoting.`
  );

  if (totalErrors > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Validation failed:", err);
  process.exit(1);
});
