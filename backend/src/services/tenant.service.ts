import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/db/client";
import { env } from "@/config/env";
import type { TenantDocument, UserDocument } from "@/db/schema";
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
  tier: string;
  email: string;
  createdAt: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateOtp() {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}

function toPublicTenant(user: UserDocument, tenant: TenantDocument): Tenant {
  return {
    id: user._id?.toString() ?? "",
    name: tenant.name,
    tier: tenant.tier,
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
  if (existingUser?.isVerified) {
    throw new AppError("An account with this email already exists", 409, "USER_EXISTS");
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  const hashedPassword = hashPassword(input.password);
  const now = new Date().toISOString();

  // Create tenant
  const tenantDoc: TenantDocument = {
    name: input.orgName,
    tier: "growth",
    tokenBalance: 1000000,
    subscriptionStartDate: now,
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    whitelabelConfig: {},
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
          otp,
          otpExpires,
          isVerified: false,
          tenantId,
          updatedAt: now,
        },
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
      otp,
      otpExpires,
      isVerified: false,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    } as any);
  }

  return { otp, message: "Organization created. Check your email for the verification code." };
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
