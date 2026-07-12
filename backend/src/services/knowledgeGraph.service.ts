import type { KnowledgeDocument } from "@/db/schema";
import { globalVectorSearch, edgeConstrainedSearch, findNodeById } from "@/services/vectorSearch.service";

export type ActivationConfidence = "high" | "moderate" | "low";

export interface TraversalResult {
  newNodeId: string;
  confidence: ActivationConfidence;
  score: number;
  label: string;
}

const HIGH_THRESHOLD = 0.7;
const MODERATE_THRESHOLD = 0.4;

function classifyConfidence(score: number): ActivationConfidence {
  if (score >= HIGH_THRESHOLD) return "high";
  if (score >= MODERATE_THRESHOLD) return "moderate";
  return "low";
}

export async function findEntryNode(query: string): Promise<TraversalResult> {
  const results = await globalVectorSearch(query, 3);
  if (results.length === 0) {
    return { newNodeId: "", confidence: "low", score: 0, label: "No matching protocol found" };
  }
  const best = results[0];
  return {
    newNodeId: best.node.nodeId,
    confidence: classifyConfidence(best.score),
    score: best.score,
    label: best.node.title,
  };
}

export async function traverseGraph(
  currentNodeId: string,
  patientMessage: string
): Promise<TraversalResult> {
  const node = await findNodeById(currentNodeId);
  if (!node) {
    return findEntryNode(patientMessage);
  }

  if (node.edges.length === 0) {
    return { newNodeId: currentNodeId, confidence: "high", score: 1, label: node.title };
  }

  const scoredEdges = await edgeConstrainedSearch(patientMessage, node.edges);

  if (scoredEdges.length > 0 && scoredEdges[0].score >= MODERATE_THRESHOLD) {
    const best = scoredEdges[0];
    return {
      newNodeId: best.toNodeId,
      confidence: classifyConfidence(best.score),
      score: best.score,
      label: best.label,
    };
  }

  const reRoot = await findEntryNode(patientMessage);
  if (reRoot.confidence !== "low") {
    return reRoot;
  }

  return { newNodeId: currentNodeId, confidence: "low", score: 0, label: "Could not determine next step" };
}
