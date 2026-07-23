import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/db/client";
import { env } from "@/config/env";
import type { TenantDocument, UserDocument, TenantPlan, TenantStatus, TenantWebhookConfig } from "@/db/schema";
import { AppError, ValidationError } from "@/lib/errors";
import { hashPassword, comparePassword, signJwtToken } from "@/services/auth.service";

export interface TenantSignupInput {
  orgName: string;
  orgType: string;
  country: string;
  email: string;
  phone: string;
  orgSize: string;
  password: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tier: string;
  plan: TenantPlan;
  status: TenantStatus;
  email: string;
  createdAt: string;
}

const PLAN_ENTITLEMENTS: Record<TenantPlan, { monthlyAssessmentLimit: number; overagePriceNgn: number; enabledChannels: TenantDocument["entitlements"]["enabledChannels"]; apiEnabled: boolean }> = {
  starter: {
    monthlyAssessmentLimit: 500,
    overagePriceNgn: 200,
    enabledChannels: ["web", "embed"],
    apiEnabled: false,
  },
  growth: {
    monthlyAssessmentLimit: 2000,
    overagePriceNgn: 150,
    enabledChannels: ["web", "embed", "whatsapp"],
    apiEnabled: false,
  },
  enterprise: {
    monthlyAssessmentLimit: 10000,
    overagePriceNgn: 100,
    enabledChannels: ["web", "embed", "whatsapp", "api"],
    apiEnabled: true,
  },
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateOtp() {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function toPublicTenant(user: UserDocument, tenant: TenantDocument): Tenant {
  return {
    id: user._id?.toString() ?? "",
    name: tenant.name,
    slug: tenant.slug,
    tier: tenant.tier,
    plan: tenant.plan,
    status: tenant.status,
    email: user.email,
    createdAt: tenant.createdAt,
  };
}

export async function signupTenant(input: TenantSignupInput) {
  const email = normalizeEmail(input.email);

  if (!email || !input.password) {
    throw new ValidationError("Email and password are required");
  }

  const db = await getDb();
  const users = db.collection<UserDocument>(COLLECTIONS.users);
  const tenants = db.collection<TenantDocument>(COLLECTIONS.tenants);

  const existingUser = await users.findOne({ email });
  if (existingUser?.isVerified && existingUser?.tenantId) {
    throw new AppError("This email is already registered as a business account. Please log in instead.", 409, "USER_EXISTS");
  }

  // NOTE: To re-enable OTP verification, uncomment the lines below and
  // set isVerified to false. Then restore the OTP step in business-signup.tsx
  // and the sendOtpEmail/verifyTenantOtp flow in tenant.route.ts / tenant.service.ts.
  //
  // const otp = generateOtp();
  // const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  //
  const hashedPassword = hashPassword(input.password);
  const now = new Date().toISOString();

  // Create tenant — ensure slug is unique
  const baseSlug = generateSlug(input.orgName);
  const suffix = Math.random().toString(36).slice(2, 8);
  const slug = `${baseSlug}-${suffix}`;
  const name = input.orgName;

  const plan: TenantPlan = "starter";
  const entitlements = PLAN_ENTITLEMENTS[plan];
  
  const tenantDoc: TenantDocument = {
    name,
    slug,
    status: "trial",
    plan,
    tier: "growth",
    tokenBalance: 1000000,
    subscriptionStartDate: now,
    subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    entitlements: {
      ...entitlements,
      assessmentsUsed: 0,
    },
    webhookConfig: { events: [] },
    whitelabelConfig: {},
    contactEmail: email,
    billingEmail: email,
    createdAt: now,
  };

  const tenantResult = await tenants.insertOne(tenantDoc);
  const tenantId = tenantResult.insertedId.toString();

  // Create or update admin user
  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          name: input.orgName,
          email,
          password: hashedPassword,
          isVerified: true,
          tenantId,
          updatedAt: now,
        },
        $unset: { otp: "", otpExpires: "" },
      }
    );
  } else {
    await users.insertOne({
      name: input.orgName,
      email,
      password: hashedPassword,
      phone: input.phone,
      orgType: input.orgType,
      country: input.country,
      orgSize: input.orgSize,
      tenantId,
      isVerified: true,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    } as any);
  }

  const user = await users.findOne({ email });
  const token = signJwtToken(user!._id!);
  return { token, tenant: toPublicTenant(user!, tenantDoc as TenantDocument), message: "Organization created successfully." };
}

export async function verifyTenantOtp(input: { email: string; otp: string }) {
  const email = normalizeEmail(input.email);

  if (!email || !input.otp) {
    throw new ValidationError("Email and OTP are required");
  }

  const db = await getDb();
  const users = db.collection<UserDocument>(COLLECTIONS.users);

  const user = await users.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (user.isVerified) {
    throw new AppError("User already verified", 409, "ALREADY_VERIFIED");
  }

  if (!user.otp || !user.otpExpires) {
    throw new AppError("No OTP pending for this user", 400, "NO_OTP_PENDING");
  }

  if (user.otp !== input.otp) {
    throw new AppError("Invalid OTP", 400, "INVALID_OTP");
  }

  if (new Date(user.otpExpires) < new Date()) {
    throw new AppError("OTP has expired", 400, "OTP_EXPIRED");
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: { isVerified: true, updatedAt: new Date().toISOString() },
      $unset: { otp: "", otpExpires: "" },
    }
  );

  const db2 = await getDb();
  const tenant = await db2.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ _id: new ObjectId(user.tenantId!) });

  const token = signJwtToken(user._id!);
  return {
    token,
    tenant: toPublicTenant({ ...user, isVerified: true }, tenant!),
  };
}

export async function requestTenantLoginOtp(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);

  if (!email || !input.password) {
    throw new ValidationError("Email and password are required");
  }

  const db = await getDb();
  const users = db.collection<UserDocument>(COLLECTIONS.users);

  const user = await users.findOne({ email, tenantId: { $exists: true } });
  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 403, "UNVERIFIED_USER");
  }

  const isMatch = comparePassword(input.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await users.updateOne(
    { _id: user._id },
    { $set: { otp, otpExpires, updatedAt: new Date().toISOString() } }
  );

  return { otp, message: "OTP sent to email." };
}

export async function verifyTenantLoginOtp(input: { email: string; otp: string }) {
  const email = normalizeEmail(input.email);

  if (!email || !input.otp) {
    throw new ValidationError("Email and OTP are required");
  }

  const db = await getDb();
  const users = db.collection<UserDocument>(COLLECTIONS.users);

  const user = await users.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (!user.tenantId) {
    throw new AppError("This account is not a business account", 403, "NOT_BUSINESS_ACCOUNT");
  }

  if (!user.otp || !user.otpExpires) {
    throw new AppError("No OTP pending for this user", 400, "NO_OTP_PENDING");
  }

  if (user.otp !== input.otp) {
    throw new AppError("Invalid OTP", 400, "INVALID_OTP");
  }

  if (new Date(user.otpExpires) < new Date()) {
    throw new AppError("OTP has expired", 400, "OTP_EXPIRED");
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: { updatedAt: new Date().toISOString() },
      $unset: { otp: "", otpExpires: "" },
    }
  );

  const tenant = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ _id: new ObjectId(user.tenantId) });

  const token = signJwtToken(user._id!);
  return {
    token,
    tenant: toPublicTenant(user, tenant!),
  };
}

export async function listTenants() {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).find().toArray();
}

export async function getEffectiveMultiplier(tenantId: string) {
  const db = await getDb();
  const tenant = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ _id: new ObjectId(tenantId) });
  const baseMultiplier = tenant?.tier === "enterprise" ? 0.7 : tenant?.tier === "growth" ? 1.0 : 1.5;
  return { multiplier: baseMultiplier };
}

export function computeTokenCost(promptTokens: number, completionTokens: number, multiplier: number) {
  const ratePerToken = 0.05;
  return (promptTokens + completionTokens) * ratePerToken * multiplier;
}

export async function deductTokens(tenantId: string, cost: number) {
  const db = await getDb();
  await db.collection<TenantDocument>(COLLECTIONS.tenants).updateOne(
    { _id: new ObjectId(tenantId) },
    { $inc: { tokenBalance: -cost } }
  );
}

export async function getTenantById(tenantId: string): Promise<TenantDocument | null> {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ _id: new ObjectId(tenantId) });
}

export async function getTenantBySlug(slug: string): Promise<TenantDocument | null> {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ slug });
}

export async function checkEntitlement(tenantId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return { allowed: false, remaining: 0, limit: 0 };
  
  if (!tenant.entitlements) return { allowed: false, remaining: 0, limit: 0 };
  const { monthlyAssessmentLimit, assessmentsUsed } = tenant.entitlements;
  const remaining = monthlyAssessmentLimit - assessmentsUsed;
  
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: monthlyAssessmentLimit,
  };
}

export async function recordAssessment(tenantId: string): Promise<{ success: boolean; overage: number }> {
  const db = await getDb();
  const result = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOneAndUpdate(
    {
      _id: new ObjectId(tenantId),
      $expr: { $lt: ["$entitlements.assessmentsUsed", "$entitlements.monthlyAssessmentLimit"] },
    },
    { $inc: { "entitlements.assessmentsUsed": 1 } }
  );
  if (!result) return { success: false, overage: 0 };
  return { success: true, overage: 0 };
}

export async function updateTenantBranding(tenantId: string, config: TenantDocument["whitelabelConfig"]): Promise<void> {
  const db = await getDb();
  await db.collection<TenantDocument>(COLLECTIONS.tenants).updateOne(
    { _id: new ObjectId(tenantId) },
    { $set: { whitelabelConfig: config } }
  );
}

export async function updateTenantWebhook(tenantId: string, config: TenantWebhookConfig): Promise<void> {
  const db = await getDb();
  await db.collection<TenantDocument>(COLLECTIONS.tenants).updateOne(
    { _id: new ObjectId(tenantId) },
    { $set: { webhookConfig: config } }
  );
}
