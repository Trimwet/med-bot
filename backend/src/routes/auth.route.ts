import { Elysia, t } from "elysia";
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

export const authRoute = new Elysia({ prefix: "/api/auth" })
  .post(
    "/signup",
    async ({ body }) => {
      const result = await signupUser(body);
      const sent = await sendOtpEmail(body.email, result.otp);
      if (!sent) {
        throw new AppError("Account created but failed to send OTP email", 500, "OTP_EMAIL_FAILED");
      }
      return { message: result.message };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body }) => {
      const result = await loginUser(body);
      return {
        message: "Login successful",
        token: result.token,
        user: result.user,
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .use(authMiddleware)
  .get("/me", async ({ user }) => {
    const userId = user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    return { user: await getAuthenticatedUser(userId) };
  })
  .get("/google", async ({ request }) => {
    const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", env.googleClientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl.toString(),
      },
    });
  })
  .get("/google/callback", async ({ query, set }) => {
    const code = typeof query.code === "string" ? query.code : undefined;
    if (!code) {
      set.redirect = `${env.clientUrl}/login?error=google_auth_failed`;
      return;
    }

    try {
      const redirectUri = new URL("/api/auth/google/callback", env.clientUrl).toString();
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
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
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
        },
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
      set.redirect = `${env.clientUrl}/auth/success?token=${token}`;
      return;
    } catch {
      set.redirect = `${env.clientUrl}/login?error=google_auth_failed`;
      return;
    }
  });
