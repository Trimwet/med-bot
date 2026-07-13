import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { adminMiddleware } from "@/middleware/admin.middleware";
import {
  createTenant,
  getTenantById,
  listTenants,
  updateTenant,
  getTenantBalance,
  addTokens,
  findPackageById,
  TOKEN_PACKAGES,
} from "@/services/tenant.service";
import {
  recordTokenUsage,
  getTokenUsageByTenant,
  getDailyTokenUsage,
} from "@/services/tokenLedger.service";
import { initializePayment, verifyPayment } from "@/services/paystack.service";
import { logger } from "@/lib/logger";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { getDb, COLLECTIONS } from "@/db/client";

export const tenantRoute = Router();
tenantRoute.use("/api/v1/tenants", authMiddleware);

tenantRoute.get("/api/v1/tenants/packages", (_req, res) => {
  res.json({ packages: TOKEN_PACKAGES });
});

tenantRoute.post("/api/v1/tenants", async (req, res, next) => {
  try {
    const { name, tier } = req.body;
    if (!name || !tier) throw new ValidationError("name and tier are required");
    if (!["growth", "enterprise"].includes(tier)) throw new ValidationError("tier must be growth or enterprise");

    const tenant = await createTenant(name, tier);
    res.status(201).json(tenant);
  } catch (err) {
    next(err);
  }
});

tenantRoute.get("/api/v1/tenants", async (_req, res, next) => {
  try {
    const tenants = await listTenants();
    res.json({ tenants });
  } catch (err) {
    next(err);
  }
});

tenantRoute.get("/api/v1/tenants/:tenantId", async (req, res, next) => {
  try {
    const tenant = await getTenantById(req.params.tenantId);
    if (!tenant) throw new NotFoundError("Tenant not found");
    res.json(tenant);
  } catch (err) {
    next(err);
  }
});

tenantRoute.put("/api/v1/tenants/:tenantId", async (req, res, next) => {
  try {
    const { name, tier, whitelabelConfig } = req.body;
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (tier) {
      if (!["growth", "enterprise"].includes(tier)) throw new ValidationError("tier must be growth or enterprise");
      updates.tier = tier;
    }
    if (whitelabelConfig) updates.whitelabelConfig = whitelabelConfig;
    const tenant = await updateTenant(req.params.tenantId, updates);
    res.json(tenant);
  } catch (err) {
    next(err);
  }
});

tenantRoute.get("/api/v1/tenants/:tenantId/balance", async (req, res, next) => {
  try {
    const balance = await getTenantBalance(req.params.tenantId);
    res.json(balance);
  } catch (err) {
    next(err);
  }
});

tenantRoute.post("/api/v1/tenants/topup", async (req, res, next) => {
  try {
    const { tenantId, packageId, email } = req.body;
    if (!tenantId || !packageId || !email) throw new ValidationError("tenantId, packageId, and email are required");

    const pkg = findPackageById(packageId);
    if (!pkg) throw new ValidationError("Invalid package");

    const result = await initializePayment(email, pkg.amountNgn, {
      tenantId,
      packageId,
      tokens: pkg.tokens,
      purpose: "token_topup",
    });

    res.json({
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
      package: pkg,
    });
  } catch (err) {
    next(err);
  }
});

tenantRoute.post("/api/v1/tenants/topup/verify", async (req, res, next) => {
  try {
    const { reference } = req.body;
    if (!reference) throw new ValidationError("reference is required");

    const verification = await verifyPayment(reference);

    if (verification.status !== "success") {
      res.json({ status: "failed", message: "Payment was not successful" });
      return;
    }

    const { tenantId, tokens } = verification.metadata as Record<string, unknown>;
    if (!tenantId || !tokens) {
      throw new ValidationError("Invalid payment metadata");
    }

    const newBalance = await addTokens(tenantId as string, tokens as number);
    logger.info("tokens credited", { tenantId, tokens, newBalance, reference });

    res.json({ status: "success", balance: newBalance, reference });
  } catch (err) {
    next(err);
  }
});

tenantRoute.get("/api/v1/tenants/:tenantId/usage", async (req, res, next) => {
  try {
    const { startDate, endDate, days } = req.query;
    const tenantId = req.params.tenantId;

    if (days) {
      const data = await getDailyTokenUsage(tenantId, Number(days));
      res.json({ daily: data });
    } else {
      const data = await getTokenUsageByTenant(
        tenantId,
        startDate as string | undefined,
        endDate as string | undefined,
      );
      res.json(data);
    }
  } catch (err) {
    next(err);
  }
});

tenantRoute.post("/api/v1/paystack/webhook", async (req, res, next) => {
  try {
    const signature = req.headers["x-paystack-signature"] as string | undefined;
    const body = JSON.stringify(req.body);

    const crypto = await import("node:crypto");
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "").update(body).digest("hex");

    if (signature && hash !== signature) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const event = req.body;
    if (event.event === "charge.success") {
      const { metadata, reference, amount } = event.data;
      if (metadata?.purpose === "token_topup" && metadata.tenantId && metadata.tokens) {
        await addTokens(metadata.tenantId, metadata.tokens);
        logger.info("webhook: tokens credited", {
          tenantId: metadata.tenantId,
          tokens: metadata.tokens,
          reference,
          amount,
        });
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    logger.error("webhook error", { error: (err as Error).message });
    res.status(200).json({ status: "ok" });
  }
});
