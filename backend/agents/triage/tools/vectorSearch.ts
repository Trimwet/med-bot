// Tool: vectorSearch — queries the knowledge graph and returns a matched node.
//
// Called by Eve during each turn to find or traverse the clinical
// protocol graph. First turn does a global search; subsequent turns
// search only within the current node's edges.

import { findEntryNode, traverseGraph } from "@/services/knowledgeGraph.service";
import { findNodeById } from "@/services/vectorSearch.service";

export interface VectorSearchInput {
  patientMessage: string;
  activeNodeId?: string;
}

export interface VectorSearchResult {
  nodeId: string;
  title: string;
  confidence: "high" | "moderate" | "low";
  score: number;
}

export async function vectorSearch(input: VectorSearchInput): Promise<VectorSearchResult> {
  if (input.activeNodeId) {
    const result = await traverseGraph(input.activeNodeId, input.patientMessage);
    return {
      nodeId: result.newNodeId,
      title: result.label,
      confidence: result.confidence,
      score: result.score,
    };
  }

  const result = await findEntryNode(input.patientMessage);
  return {
    nodeId: result.newNodeId,
    title: result.label,
    confidence: result.confidence,
    score: result.score,
  };
}

export async function getProtocolQuestions(nodeId: string): Promise<string[]> {
  const node = await findNodeById(nodeId);
  return node?.metadata.triageQuestions ?? [];
}
