import { Router } from "express";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { getDb, COLLECTIONS } from "@/db/client";
import type { TenantDocument, UserDocument } from "@/db/schema";
import {
  getAuthenticatedUser,
  requestLoginOtp,
  resendLoginOtp,
  resendOtp,
  signJwtToken,
  signupUser,
  upsertGoogleUser,
  verifyJwtToken,
  verifyLoginOtp,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
  deleteUserAccount,
} from "@/services/auth.service";
import { sendOtpEmail } from "@/services/otp.service";
import { listUserSessions, deleteSession } from "@/services/session.service";

export const authRoute = Router();

function signOAuthState(value: string) {
  return createHmac("sha256", env.jwtSecret).update(value).digest("base64url");
}

function getCookie(req: { headers: { cookie?: string } }, name: string) {
  return req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function validOAuthState(req: { headers: { cookie?: string } }, state: string | undefined) {
  const cookie = getCookie(req, "oauth_state");
  if (!cookie || !state) return false;
  const [value, signature] = cookie.split(".");
  if (!value || !signature || value !== state) return false;
  const expected = signOAuthState(value);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

authRoute.post("/api/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await signupUser({ name, email, password });
    const sent = await sendOtpEmail(email, result.otp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] signup for ${email}: ${result.otp}`);
    }

    if (!sent) {
      res.json({
        message: "Signup successful, but we couldn't send the verification email. Please try resending the code.",
        emailSent: false,

      });
      return;
    }

    res.json({
      message: result.message,
      emailSent: sent,
    });
  } catch (err) {
    next(err);
  }
});

authRoute.post("/api/auth/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp({ email, otp });
    res.json({
      message: "Email verified successfully",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
});

authRoute.post("/api/auth/resend-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    const newOtp = await resendOtp(email);
    const sent = await sendOtpEmail(email, newOtp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] resend signup for ${email}: ${newOtp}`);
    }

    if (!sent) {
      res.json({
        message: "OTP could not be sent via email. Please try again.",
        emailSent: false,

      });
      return;
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    next(err);
  }
});

// Step 1 of login: verify email + password, then send an OTP.
// No token is issued here.
authRoute.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await requestLoginOtp({ email, password });
    const sent = await sendOtpEmail(email, result.otp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] login for ${email}: ${result.otp}`);
    }

    if (!sent) {
      res.json({
        message: "Credentials verified, but we couldn't send the OTP email. Please try resending the code.",
        emailSent: false,

      });
      return;
    }

    res.json({ message: result.message });
  } catch (err) {
    next(err);
  }
});

// Step 2 of login: verify the OTP, then issue the token.
authRoute.post("/api/auth/verify-login-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyLoginOtp({ email, otp });
    res.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
});

authRoute.post("/api/auth/resend-login-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    const newOtp = await resendLoginOtp(email);
    const sent = await sendOtpEmail(email, newOtp);

    if (env.nodeEnv === "development") {
      logger.info(`[DEV OTP] resend login for ${email}: ${newOtp}`);
    }

    if (!sent) {
      res.json({
        message: "OTP could not be sent via email. Please try again.",
        emailSent: false,

      });
      return;
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    next(err);
  }
});

authRoute.get("/api/auth/me", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    res.json({ user: await getAuthenticatedUser(userId) });
  } catch (err) {
    next(err);
  }
});

authRoute.get("/api/auth/google", (req, res) => {
  const redirectUri = env.googleCallbackUrl;
  const from = typeof req.query.from === "string" ? req.query.from : "";
  const state = randomBytes(32).toString("base64url");
  const cookieValue = `${state}.${signOAuthState(state)}`;
  res.cookie("oauth_state", cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 10 * 60 * 1000,
    path: "/api/auth/google/callback",
  });
  if (from) {
    res.cookie("oauth_from", from, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      maxAge: 10 * 60 * 1000,
      path: "/api/auth/google/callback",
    });
  }
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.googleClientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  res.redirect(authUrl.toString());
});

authRoute.get("/api/auth/google/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : undefined;
  if (!code || !validOAuthState(req, state)) {
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
    return;
  }

  try {
    res.clearCookie("oauth_state", { path: "/api/auth/google/callback" });
    const redirectUri = env.googleCallbackUrl;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Google token exchange failed");
    }

    const tokenPayload = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenPayload.access_token) {
      throw new Error("Google access token missing");
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new Error("Google user lookup failed");
    }

    const profile = (await profileResponse.json()) as {
      id?: string;
      name?: string;
      email?: string;
    };

    if (!profile.id) {
      throw new Error("Google profile missing");
    }

    const user = await upsertGoogleUser({
      id: profile.id,
      displayName: profile.name,
      email: profile.email,
    });

    const token = signJwtToken(user._id!);
    const hasProfile = user.profile && Object.keys(user.profile).length > 0;

    const fromParam = getCookie(req, "oauth_from") || "";
    res.clearCookie("oauth_state", { path: "/api/auth/google/callback" });
    res.clearCookie("oauth_from", { path: "/api/auth/google/callback" });

    // For new B2B Google signups, auto-create a tenant
    if (fromParam === "business" && !user.tenantId) {
      const now = new Date().toISOString();
      const db = await getDb();
      const tenantDoc: TenantDocument = {
        name: user.name || "My Organization",
        tier: "growth",
        tokenBalance: 1000000,
        subscriptionStartDate: now,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        whitelabelConfig: {},
        createdAt: now,
      };
      const tenantResult = await db.collection<TenantDocument>(COLLECTIONS.tenants).insertOne(tenantDoc);
      const tenantId = tenantResult.insertedId.toString();
      await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { tenantId, role: "admin", updatedAt: now } }
      );
      (user as any).tenantId = tenantId;
    }

    if (fromParam === "business" || (user as any).tenantId) {
      res.redirect(`${env.clientUrl}/business/dashboard#token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`${env.clientUrl}/${hasProfile ? "dashboard" : "health-profile"}#token=${encodeURIComponent(token)}`);
    }
  } catch {
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
  }
});

// ── Forgot / Reset Password ─────────────────────────────────────────

authRoute.post("/api/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Email is required", 400, "VALIDATION_ERROR");
    }
    const result = await requestPasswordReset(email);
    let sent = false;
    if (result.otp) {
      sent = await sendOtpEmail(email, result.otp);
    }
    res.json({ message: result.message, emailSent: sent });
  } catch (err) {
    next(err);
  }
});

authRoute.post("/api/auth/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPassword({ email, otp, newPassword });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── Change Password (authenticated) ────────────────────────────────

authRoute.post("/api/auth/change-password", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const result = await changePassword(userId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── Account Deletion (NDPR compliance) ──────────────────────────────

authRoute.delete("/api/users/me", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const result = await deleteUserAccount(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── Session Listing & Deletion ──────────────────────────────────────

authRoute.get("/api/sessions", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const result = await listUserSessions(userId, { status, limit, offset });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRoute.delete("/api/sessions/:sessionId", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    await deleteSession(req.params.sessionId, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
