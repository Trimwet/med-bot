import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { getDb, COLLECTIONS } from "@/db/client";
import { env } from "@/config/env";
import type { UserDocument } from "@/db/schema";
import { AppError, ValidationError } from "@/lib/errors";

export interface SignupInput {
  name?: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  name?: string;
  email: string;
  googleId?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id?.toString() ?? "",
    name: user.name,
    email: user.email,
    googleId: user.googleId,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const memoryUsers: UserDocument[] = [];

async function getUserStore() {
  if (!env.mongodbUri) {
    return { mode: "memory" as const, users: null };
  }

  try {
    const db = await getDb();
    return { mode: "mongo" as const, users: db.collection<UserDocument>(COLLECTIONS.users) };
  } catch {
    return { mode: "memory" as const, users: null };
  }
}

function findMemoryUser(query: Partial<UserDocument>) {
  return memoryUsers.find((user) => {
    if (query._id && user._id?.toString() !== query._id.toString()) return false;
    if (query.email && user.email !== query.email) return false;
    if (query.googleId && user.googleId !== query.googleId) return false;
    return true;
  });
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function comparePassword(password: string, storedHash?: string) {
  if (!storedHash) return false;

  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const derivedKey = scryptSync(password, salt, 64);
  const actualHash = Buffer.from(expectedHash, "hex");
  return timingSafeEqual(derivedKey, actualHash);
}

export function signJwtToken(userId: string | ObjectId) {
  return jwt.sign({ id: userId.toString() }, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string) {
  const payload = jwt.verify(token, env.jwtSecret) as { id?: string };
  if (!payload.id) {
    throw new AppError("Invalid token payload", 401, "INVALID_TOKEN");
  }
  return payload.id;
}

export async function getUserByEmail(email: string) {
  const store = await getUserStore();
  if (store.mode === "memory") {
    return findMemoryUser({ email: normalizeEmail(email) });
  }

  return store.users.findOne({ email: normalizeEmail(email) });
}

export async function getUserById(userId: string | ObjectId) {
  const store = await getUserStore();
  const queryId = typeof userId === "string" ? new ObjectId(userId) : userId;

  if (store.mode === "memory") {
    return findMemoryUser({ _id: queryId });
  }

  return store.users.findOne({ _id: queryId });
}

export async function signupUser(input: SignupInput) {
  const email = normalizeEmail(input.email);
  const password = input.password?.trim();

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser?.isVerified) {
    throw new AppError("An account with this email already exists", 409, "USER_EXISTS");
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  const hashedPassword = hashPassword(password);

  const store = await getUserStore();

  if (store.mode === "memory") {
    if (existingUser) {
      existingUser.name = input.name?.trim() || existingUser.name;
      existingUser.email = email;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.isVerified = true;
      existingUser.updatedAt = new Date().toISOString();
    } else {
      memoryUsers.push({
        _id: new ObjectId(),
        name: input.name?.trim(),
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { otp, message: "Signup successful. You can sign in now." };
  }

  const users = store.users;

  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          name: input.name?.trim() || existingUser.name,
          email,
          password: hashedPassword,
          otp,
          otpExpires,
          isVerified: true,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  } else {
    await users.insertOne({
      name: input.name?.trim(),
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return { otp, message: "Signup successful. You can sign in now." };
}

export async function loginUser(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const password = input.password?.trim();

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isVerified && env.nodeEnv === "production") {
    throw new AppError("Please verify your email before logging in", 403, "UNVERIFIED_USER");
  }

  const isMatch = comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const token = signJwtToken(user._id!);
  return {
    token,
    user: toPublicUser(user),
  };
}

export async function getAuthenticatedUser(userId: string | ObjectId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  return toPublicUser(user);
}

export async function upsertGoogleUser(profile: { id: string; displayName?: string; email?: string }) {
  const store = await getUserStore();
  const email = profile.email ? normalizeEmail(profile.email) : undefined;

  if (store.mode === "memory") {
    let user = findMemoryUser({ googleId: profile.id });

    if (!user && email) {
      user = findMemoryUser({ email });
    }

    if (user) {
      user.googleId = profile.id;
      user.isVerified = true;
      user.updatedAt = new Date().toISOString();

      if (!user.name && profile.displayName) {
        user.name = profile.displayName;
      }

      if (email && !user.email) {
        user.email = email;
      }

      return user;
    }

    const created = {
      _id: new ObjectId(),
      name: profile.displayName,
      email: email ?? "",
      googleId: profile.id,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserDocument;

    memoryUsers.push(created);
    return created;
  }

  const users = store.users;
  let user = await users.findOne({ googleId: profile.id });

  if (!user && email) {
    user = await users.findOne({ email });
  }

  if (user) {
    const update: Partial<UserDocument> = {
      googleId: profile.id,
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };

    if (!user.name && profile.displayName) {
      update.name = profile.displayName;
    }

    if (email && !user.email) {
      update.email = email;
    }

    await users.updateOne({ _id: user._id }, { $set: update });
    return { ...(user as UserDocument), ...update } as UserDocument;
  }

  const created = await users.insertOne({
    name: profile.displayName,
    email: email ?? "",
    googleId: profile.id,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    _id: created.insertedId,
    name: profile.displayName,
    email: email ?? "",
    googleId: profile.id,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as UserDocument;
}

function generateOtp() {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}
