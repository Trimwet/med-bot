import { Router } from "express";
import { AppError } from "@/lib/errors";
import { sendOtpEmail } from "@/services/otp.service";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";
import {
  signupTenant,
  verifyTenantOtp,
  requestTenantLoginOtp,
  verifyTenantLoginOtp,
} from "@/services/tenant.service";

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
