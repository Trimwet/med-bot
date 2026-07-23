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
    const sent = await sendOtpEmail(email, result.otp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] tenant signup for ${email}: ${result.otp}`);
    }

    if (!sent) {
      res.json({
        message: result.message,
        emailSent: false,
      });
      return;
    }

    res.json({ message: result.message, emailSent: true });
  } catch (err) {
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
    const sent = await sendOtpEmail(email, result.otp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] tenant login for ${email}: ${result.otp}`);
    }

    if (!sent) {
      res.json({
        message: "Credentials verified, but we couldn't send the OTP email.",
        emailSent: false,
      });
      return;
    }

    res.json({ message: result.message });
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
    const { primaryColor, accentColor, welcomeMessage, theme } = req.body;
    await updateTenantBranding(req.params.id, {
      ...(primaryColor !== undefined && { primaryColor }),
      ...(accentColor !== undefined && { accentColor }),
      ...(welcomeMessage !== undefined && { welcomeMessage }),
      ...(theme !== undefined && { theme }),
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
