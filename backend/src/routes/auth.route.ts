import { Router } from "express";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { authMiddleware } from "@/middleware/auth.middleware";
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
} from "@/services/auth.service";
import { sendOtpEmail } from "@/services/otp.service";

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

    res.json({
      message: sent
        ? result.message
        : "Signup successful, but we couldn't send the verification email. Please try resending the code.",
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

    if (!sent) {
      throw new AppError("Failed to send OTP email", 500, "OTP_EMAIL_FAILED");
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

    if (!sent) {
      throw new AppError("Failed to send OTP email", 500, "OTP_EMAIL_FAILED");
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

    if (!sent) {
      throw new AppError("Failed to send OTP email", 500, "OTP_EMAIL_FAILED");
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

authRoute.get("/api/auth/google", (_req, res) => {
  const redirectUri = env.googleCallbackUrl;
  const state = randomBytes(32).toString("base64url");
  const cookieValue = `${state}.${signOAuthState(state)}`;
  res.cookie("oauth_state", cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 10 * 60 * 1000,
    path: "/api/auth/google/callback",
  });
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
    res.redirect(`${env.clientUrl}/${hasProfile ? "dashboard" : "health-profile"}#token=${encodeURIComponent(token)}`);
  } catch {
    res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
  }
});
