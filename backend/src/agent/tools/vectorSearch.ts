import { defineTool } from "eve/tools";
import { z } from "zod";
import { findEntryNode, traverseGraph } from "@/services/knowledgeGraph.service";

export default defineTool({
  description: "Search the medical knowledge graph for a protocol matching the patient's symptoms. On the first turn (no activeNodeId), performs a global search. On subsequent turns, traverses from the current node.",
  inputSchema: z.object({
    patientMessage: z.string().describe("The patient's description of their symptoms"),
    activeNodeId: z.string().optional().describe("The current graph node ID for context-aware traversal"),
  }),
  async execute({ patientMessage, activeNodeId }) {
    if (activeNodeId) {
      const result = await traverseGraph(activeNodeId, patientMessage);
      return {
        nodeId: result.newNodeId,
        title: result.label,
        confidence: result.confidence,
        score: result.score,
      };
    }

    const result = await findEntryNode(patientMessage);
    return {
      nodeId: result.newNodeId,
      title: result.label,
      confidence: result.confidence,
      score: result.score,
    };
  },
});
