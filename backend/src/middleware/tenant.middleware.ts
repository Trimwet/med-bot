import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import { verifyJwtToken, getUserById } from "@/services/auth.service";
import { validateApiKey } from "@/services/apiKey.service";
import { getTenantById } from "@/services/tenant.service";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface TenantContext {
  tenantId: string;
  source: "jwt" | "api_key" | "widget_token";
  userId?: string;
  channel?: "web" | "whatsapp" | "api" | "embed";
}

declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

export async function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    // Try API key first (x-api-key header)
    const apiKey = req.headers["x-api-key"] as string | undefined;
    if (apiKey) {
      const tenantId = await validateApiKey(apiKey);
      if (!tenantId) {
        next(new UnauthorizedError("Invalid or expired API key"));
        return;
      }
      req.tenantContext = { tenantId, source: "api_key", channel: "api" };
      next();
      return;
    }

    // Try JWT token (Authorization header)
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      let userId: string;
      try {
        userId = verifyJwtToken(token);
      } catch {
        next(new UnauthorizedError("Invalid or expired token"));
        return;
      }

      const user = await getUserById(userId);
      if (!user) {
        next(new UnauthorizedError("User not found"));
        return;
      }

      if (!user.tenantId) {
        next(new ForbiddenError("User is not associated with a tenant"));
        return;
      }

      req.tenantContext = { tenantId: user.tenantId, source: "jwt", userId: user._id!.toString(), channel: "web" };
      req.user = {
        id: user._id!.toString(),
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        tenantId: user.tenantId,
      };
      next();
      return;
    }

    // Try widget token (x-widget-token header)
    const widgetToken = req.headers["x-widget-token"] as string | undefined;
    if (widgetToken) {
      try {
        const payload = jwt.verify(widgetToken, env.jwtSecret) as { tenantId?: string; sessionId?: string; channel?: string };
        if (!payload.tenantId || !payload.sessionId || payload.channel !== "embed") {
          next(new UnauthorizedError("Invalid widget token"));
          return;
        }
        req.tenantContext = { tenantId: payload.tenantId, source: "widget_token", channel: "embed" };
        next();
        return;
      } catch {
        next(new UnauthorizedError("Invalid widget token"));
        return;
      }
    }

    next(new UnauthorizedError("Authentication required"));
  } catch (err) {
    next(err);
  }
}

export async function requireEntitlement(req: Request, _res: Response, next: NextFunction) {
  if (!req.tenantContext) {
    next(new UnauthorizedError("Tenant context required"));
    return;
  }

  const tenant = await getTenantById(req.tenantContext.tenantId);
  if (!tenant) {
    next(new ForbiddenError("Tenant not found"));
    return;
  }

  if (tenant.status === "suspended" || tenant.status === "cancelled") {
    next(new ForbiddenError("Tenant account is not active"));
    return;
  }

  if (tenant.status === "trial" && new Date(tenant.subscriptionEndDate) < new Date()) {
    next(new ForbiddenError("Trial period has expired"));
    return;
  }

  if (!tenant.entitlements) {
    next(new ForbiddenError("Tenant plan has not been configured"));
    return;
  }
  const { monthlyAssessmentLimit, assessmentsUsed, enabledChannels, apiEnabled } = tenant.entitlements;
  const channel = req.tenantContext.channel || (req.tenantContext.source === "api_key" ? "api" : "web");
  if (!enabledChannels.includes(channel) || (channel === "api" && !apiEnabled)) {
    next(new ForbiddenError("This channel is not enabled for the tenant plan"));
    return;
  }
  if (assessmentsUsed >= monthlyAssessmentLimit) {
    next(new ForbiddenError("Monthly assessment limit reached"));
    return;
  }

  next();
}
