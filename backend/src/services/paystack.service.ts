import { env } from "@/config/env";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const PAYSTACK_API = "https://api.paystack.co";

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    metadata?: Record<string, unknown>;
  };
}

function getHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env.paystackSecretKey}`,
    "Content-Type": "application/json",
  };
}

export async function initializePayment(
  email: string,
  amountNgn: number,
  metadata: Record<string, unknown>,
): Promise<{ authorizationUrl: string; reference: string; accessCode: string }> {
  if (!env.paystackSecretKey) {
    throw new AppError("Paystack not configured", 500, "PAYSTACK_NOT_CONFIGURED");
  }

  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      amount: Math.round(amountNgn * 100),
      metadata,
      callback_url: `${env.clientUrl}/dashboard/settings?tab=billing`,
    }),
  });

  const result: PaystackInitResponse = await response.json() as PaystackInitResponse;

  if (!result.status || !result.data) {
    logger.error("paystack init failed", { message: result.message });
    throw new AppError("Payment initialization failed", 502, "PAYSTACK_ERROR");
  }

  return {
    authorizationUrl: result.data.authorization_url,
    reference: result.data.reference,
    accessCode: result.data.access_code,
  };
}

export async function verifyPayment(reference: string): Promise<{
  status: string;
  amountPaidNgn: number;
  metadata: Record<string, unknown>;
}> {
  if (!env.paystackSecretKey) {
    throw new AppError("Paystack not configured", 500, "PAYSTACK_NOT_CONFIGURED");
  }

  const response = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: getHeaders(),
  });

  const result: PaystackVerifyResponse = await response.json() as PaystackVerifyResponse;

  if (!result.status || !result.data) {
    logger.error("paystack verify failed", { reference, message: result.message });
    throw new AppError("Payment verification failed", 502, "PAYSTACK_ERROR");
  }

  return {
    status: result.data.status,
    amountPaidNgn: result.data.amount / 100,
    metadata: result.data.metadata ?? {},
  };
}

export async function verifyWebhookSignature(
  signature: string | undefined,
  body: string,
): Promise<boolean> {
  if (!signature || !env.paystackSecretKey) return false;
  const crypto = await import("node:crypto");
  const hash = crypto.createHmac("sha512", env.paystackSecretKey).update(body).digest("hex");
  return hash === signature;
}
