import { Router } from "express";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  getAuthenticatedUser,
  loginUser,
  signJwtToken,
  signupUser,
  upsertGoogleUser,
  verifyJwtToken,
} from "@/services/auth.service";
import { sendOtpEmail } from "@/services/otp.service";

export const authRoute = Router();

authRoute.post("/api/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await signupUser({ name, email, password });
    const sent = await sendOtpEmail(email, result.otp);

    res.json({
      message: sent ? result.message : "Signup successful. You can sign in now.",
      emailSent: sent,
    });
  } catch (err) {
    next(err);
  }
});

authRoute.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
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

authRoute.get("/api/auth/google", (_req, res) => {
  const redirectUri = `${env.clientUrl}/api/auth/google/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.googleClientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  res.redirect(authUrl.toString());
});

authRoute.get("/api/auth/google/callback", async (req, res) => {
  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  if (!code) {
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
    return;
  }

  try {
    const redirectUri = `${env.clientUrl}/api/auth/google/callback`;
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
    res.redirect(`${env.clientUrl}/auth/success?token=${token}`);
  } catch {
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
  }
});
