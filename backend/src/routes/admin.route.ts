// Admin routes for the protocol-authoring dashboard. Not patient-facing —
// gated by adminMiddleware. This is what turns "a developer manually
// writes a markdown file and runs a script" into "a doctor fills out a
// form and clicks save."

import { Router } from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { logger } from "@/lib/logger";
import {
  upsertProtocolNode,
  listProtocolNodes,
  getProtocolNode,
  deleteProtocolNode,
  listCategories,
  type ProtocolNodeInput,
} from "@/services/protocolAdmin.service";

export const adminRoute = Router();

adminRoute.use("/api/admin", adminMiddleware);

// Categories the dashboard's dropdown should offer.
adminRoute.get("/api/admin/protocol-categories", (_req, res) => {
  res.json({ categories: listCategories() });
});

// List all protocol nodes (table view).
adminRoute.get("/api/admin/protocols", async (_req, res, next) => {
  try {
    const nodes = await listProtocolNodes();
    res.json({ nodes });
  } catch (err) {
    next(err);
  }
});

// Fetch one node for editing.
adminRoute.get("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    const node = await getProtocolNode(req.params.nodeId);
    res.json({ node });
  } catch (err) {
    next(err);
  }
});

// Create or fully update a node. Embeddings are generated server-side —
// the doctor only ever submits plain text.
adminRoute.post("/api/admin/protocols", async (req, res, next) => {
  try {
    const input = req.body as ProtocolNodeInput;
    const updatedBy = input.updatedBy || (req.headers["x-admin-name"] as string) || "medbot-admin";
    const saved = await upsertProtocolNode({ ...input, updatedBy });
    logger.info("protocol saved via admin API", { nodeId: saved.nodeId });
    res.status(201).json({ node: saved });
  } catch (err) {
    next(err);
  }
});

// Same as POST — kept for clients that prefer PUT semantics on a known nodeId.
adminRoute.put("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    const input = req.body as ProtocolNodeInput;
    const updatedBy = input.updatedBy || (req.headers["x-admin-name"] as string) || "medbot-admin";
    const saved = await upsertProtocolNode({ ...input, nodeId: req.params.nodeId, updatedBy });
    res.json({ node: saved });
  } catch (err) {
    next(err);
  }
});

adminRoute.delete("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    await deleteProtocolNode(req.params.nodeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
