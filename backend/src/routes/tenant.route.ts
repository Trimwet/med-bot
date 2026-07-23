import { Router } from "express";
import { AppError } from "@/lib/errors";
import { sendOtpEmail } from "@/services/otp.service";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  getTenantById,
  updateTenantBranding,
  signupTenant,
  verifyTenantOtp,
  requestTenantLoginOtp,
  verifyTenantLoginOtp,
} from "@/services/tenant.service";
import { getUserById } from "@/services/auth.service";
import type { TenantDocument } from "@/db/schema";
import { ObjectId } from "mongodb";

export const tenantRoute = Router();

tenantRoute.post("/api/tenants/signup", async (req, res, next) => {
  try {
    const { orgName, orgType, country, email, phone, orgSize, password } = req.body;
    const result = await signupTenant({ orgName, orgType, country, email, phone, orgSize, password });
    res.json({ message: result.message, token: result.token, tenant: result.tenant, emailSent: false });
  } catch (err) {
    console.error("[tenant-signup]", err);
    next(err);
  }
});

tenantRoute.post("/api/tenants/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyTenantOtp({ email, otp });
    res.json({
      message: "Email verified successfully",
      token: result.token,
      tenant: result.tenant,
    });
  } catch (err) {
    next(err);
  }
});

tenantRoute.post("/api/tenants/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await requestTenantLoginOtp({ email, password });
    res.json({ message: result.message, token: result.token, tenant: result.tenant });
  } catch (err) {
    next(err);
  }
});

tenantRoute.post("/api/tenants/verify-login-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyTenantLoginOtp({ email, otp });
    res.json({
      message: "Login successful",
      token: result.token,
      tenant: result.tenant,
    });
  } catch (err) {
    next(err);
  }
});

tenantRoute.get("/api/tenants/me", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);
    if (!user?.tenantId) {
      res.status(404).json({ error: "No tenant linked to this account" });
      return;
    }
    const tenant = await getTenantById(user.tenantId);
    if (!tenant) {
      res.status(404).json({ error: "Tenant not found" });
      return;
    }
    res.json({
      _id: tenant._id?.toString(),
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      status: tenant.status,
      entitlements: tenant.entitlements,
      whitelabelConfig: tenant.whitelabelConfig,
      webhookConfig: tenant.webhookConfig,
      contactEmail: tenant.contactEmail || user.email,
      contactPhone: tenant.contactPhone || (user as any).phone || '',
      address: tenant.address || '',
      website: tenant.website || '',
      createdAt: tenant.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

tenantRoute.put("/api/tenants/:id/branding", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);
    if (!user?.tenantId || user.tenantId !== req.params.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }
    const { primaryColor, accentColor, welcomeMessage, theme, logoUrl, clinicName } = req.body;
    await updateTenantBranding(req.params.id, {
      ...(primaryColor !== undefined && { primaryColor }),
      ...(accentColor !== undefined && { accentColor }),
      ...(welcomeMessage !== undefined && { welcomeMessage }),
      ...(theme !== undefined && { theme }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(clinicName !== undefined && { clinicName }),
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

tenantRoute.put("/api/tenants/:id/profile", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);
    if (!user?.tenantId || user.tenantId !== req.params.id) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }
    const { name, contactPhone, address, website } = req.body;
    const db = await import("@/db/client").then((m) => m.getDb());
    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields.name = name;
    if (contactPhone !== undefined) updateFields.contactPhone = contactPhone;
    if (address !== undefined) updateFields.address = address;
    if (website !== undefined) updateFields.website = website;
    if (Object.keys(updateFields).length > 0) {
      await db.collection("tenants").updateOne(
        { _id: new (await import("mongodb")).ObjectId(req.params.id) },
        { $set: updateFields }
      );
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
