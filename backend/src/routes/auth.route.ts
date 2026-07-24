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
  loginNoOtp,
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
  setPassword,
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
  if (!cookie || !state) { console.log("[google-auth] validOAuthState: missing cookie or state", { hasCookie: !!cookie, hasState: !!state }); return false; }
  const [value, signature] = cookie.split(".");
  if (!value || !signature || value !== state) { console.log("[google-auth] validOAuthState: value mismatch", { cookieValue: value, stateParam: state }); return false; }
  const expected = signOAuthState(value);
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) console.log("[google-auth] validOAuthState: signature mismatch", { cookieSigLen: signature.length, expectedSigLen: expected.length });
  return valid;
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

// Login: verify email + password, return token directly (no OTP).
authRoute.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginNoOtp({ email, password });
    res.json({ message: "Login successful", token: result.token, user: result.user });
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
  });
  if (from) {
    res.cookie("oauth_from", from, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      maxAge: 10 * 60 * 1000,
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
  const cookieState = getCookie(req, "oauth_state");
  console.log("[google-auth] Callback received:", { hasCode: !!code, hasState: !!state, hasCookie: !!cookieState, stateMatch: state === cookieState?.split(".")[0] });
  if (!code || !validOAuthState(req, state)) {
    console.error("[google-auth] State validation failed or code missing:", { hasCode: !!code, hasState: !!state, hasCookie: !!cookieState });
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
    return;
  }

  try {
    res.clearCookie("oauth_state");
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

    const fromParam = getCookie(req, "oauth_from") || "";
    res.clearCookie("oauth_state");
    res.clearCookie("oauth_from");

    // For new B2B Google signups, auto-create a tenant
    if (fromParam === "business" && !user.tenantId) {
      const now = new Date().toISOString();
      const db = await getDb();
      const tenantDoc: TenantDocument = {
        name: user.name || "My Organization",
        slug: `${(user.name || "organization").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "organization"}-${user._id!.toString().slice(-6)}`,
        status: "trial",
        plan: "starter",
        tier: "growth",
        tokenBalance: 1000000,
        subscriptionStartDate: now,
        subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        entitlements: { monthlyAssessmentLimit: 500, assessmentsUsed: 0, overagePriceNgn: 200, enabledChannels: ["web", "embed"], apiEnabled: false },
        webhookConfig: { events: [] },
        whitelabelConfig: {},
        contactEmail: user.email,
        billingEmail: user.email,
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
    } else if (user.profile && user.profile.age && user.profile.gender) {
      res.redirect(`${env.clientUrl}/dashboard#token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`${env.clientUrl}/health-profile#token=${encodeURIComponent(token)}`);
    }
  } catch (err: any) {
    console.error("[google-auth] Callback error:", err?.message || err);
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

authRoute.post("/api/auth/set-password", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { newPassword } = req.body;
    const result = await setPassword(userId, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── Two-Factor Authentication ──────────────────────────────────────

authRoute.get("/api/auth/2fa/status", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) });
    res.json({ enabled: user?.twoFactorEnabled ?? false, email: user?.email });
  } catch (err) {
    next(err);
  }
});

// Step 1: send OTP to verify identity before enabling
authRoute.post("/api/auth/2fa/enable", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    if (user.twoFactorEnabled) throw new AppError("2FA is already enabled", 400, "ALREADY_ENABLED");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await db.collection<UserDocument>(COLLECTIONS.users).updateOne({ _id: new ObjectId(userId) }, { $set: { otp, otpExpires } });
    await sendOtpEmail(user.email, otp);
    if (env.nodeEnv === "development") logger.info(`[DEV 2FA] enable OTP for ${user.email}: ${otp}`);
    res.json({ message: `Verification code sent to ${user.email}` });
  } catch (err) {
    next(err);
  }
});

// Step 2: verify OTP and enable 2FA
authRoute.post("/api/auth/2fa/verify-enable", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    const { otp } = req.body;
    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    if (!user.otp || !user.otpExpires) throw new AppError("No verification code found. Please request a new one.", 400, "NO_OTP");
    if (new Date() > user.otpExpires) throw new AppError("Verification code has expired.", 400, "OTP_EXPIRED");
    if (user.otp !== otp) throw new AppError("Invalid verification code.", 400, "INVALID_OTP");
    await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { twoFactorEnabled: true }, $unset: { otp: "", otpExpires: "" } }
    );
    res.json({ message: "Two-factor authentication enabled successfully." });
  } catch (err) {
    next(err);
  }
});

// Step 1: send OTP to verify identity before disabling
authRoute.post("/api/auth/2fa/disable", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    if (!user.twoFactorEnabled) throw new AppError("2FA is not currently enabled", 400, "NOT_ENABLED");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await db.collection<UserDocument>(COLLECTIONS.users).updateOne({ _id: new ObjectId(userId) }, { $set: { otp, otpExpires } });
    await sendOtpEmail(user.email, otp);
    if (env.nodeEnv === "development") logger.info(`[DEV 2FA] disable OTP for ${user.email}: ${otp}`);
    res.json({ message: `Verification code sent to ${user.email}` });
  } catch (err) {
    next(err);
  }
});

// Step 2: verify OTP and disable 2FA
authRoute.post("/api/auth/2fa/verify-disable", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    const { otp } = req.body;
    const db = await getDb();
    const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");
    if (!user.otp || !user.otpExpires) throw new AppError("No verification code found. Please request a new one.", 400, "NO_OTP");
    if (new Date() > user.otpExpires) throw new AppError("Verification code has expired.", 400, "OTP_EXPIRED");
    if (user.otp !== otp) throw new AppError("Invalid verification code.", 400, "INVALID_OTP");
    await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { twoFactorEnabled: false }, $unset: { otp: "", otpExpires: "" } }
    );
    res.json({ message: "Two-factor authentication disabled." });
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
