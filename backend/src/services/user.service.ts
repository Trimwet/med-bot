import { ObjectId } from "mongodb";
import { COLLECTIONS } from "@/db/client";
import type { UserDocument, UserProfile } from "@/db/schema";
import { AppError, ValidationError } from "@/lib/errors";
import { getUserStore, memoryUsers } from "@/services/auth.service";

const GENDERS = ["male", "female", "other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MAX_TEXT_LENGTH = 100;

export interface UpdateProfileInput {
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  medications?: string;
  emergencyContact?: string;
}

function validateProfileInput(input: UpdateProfileInput): UserProfile {
  const profile: UserProfile = {};

  if (input.age !== undefined) {
    const age = Number(input.age);
    if (!Number.isFinite(age) || age < 0 || age > 130) {
      throw new ValidationError("Age must be a number between 0 and 130");
    }
    profile.age = age;
  }

  if (input.gender !== undefined) {
    if (!GENDERS.includes(input.gender)) {
      throw new ValidationError(`Gender must be one of: ${GENDERS.join(", ")}`);
    }
    profile.gender = input.gender as UserProfile["gender"];
  }

  if (input.heightCm !== undefined) {
    const height = Number(input.heightCm);
    if (!Number.isFinite(height) || height <= 0 || height > 300) {
      throw new ValidationError("Height must be a positive number (cm)");
    }
    profile.heightCm = height;
  }

  if (input.weightKg !== undefined) {
    const weight = Number(input.weightKg);
    if (!Number.isFinite(weight) || weight <= 0 || weight > 500) {
      throw new ValidationError("Weight must be a positive number (kg)");
    }
    profile.weightKg = weight;
  }

  if (input.bloodGroup !== undefined) {
    if (!BLOOD_GROUPS.includes(input.bloodGroup)) {
      throw new ValidationError(`Blood group must be one of: ${BLOOD_GROUPS.join(", ")}`);
    }
    profile.bloodGroup = input.bloodGroup as UserProfile["bloodGroup"];
  }

  if (input.allergies !== undefined) {
    if (input.allergies.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(`Allergies must be ${MAX_TEXT_LENGTH} characters or fewer`);
    }
    profile.allergies = input.allergies.trim();
  }

  if (input.conditions !== undefined) {
    if (input.conditions.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(`Existing conditions must be ${MAX_TEXT_LENGTH} characters or fewer`);
    }
    profile.conditions = input.conditions.trim();
  }

  if (input.medications !== undefined) {
    if (input.medications.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(`Medications must be ${MAX_TEXT_LENGTH} characters or fewer`);
    }
    profile.medications = input.medications.trim();
  }

  if (input.emergencyContact !== undefined) {
    if (input.emergencyContact.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(`Emergency contact must be ${MAX_TEXT_LENGTH} characters or fewer`);
    }
    profile.emergencyContact = input.emergencyContact.trim();
  }

  return profile;
}

function findUserInMemory(userId: string) {
  return memoryUsers.find((u) => u._id?.toString() === userId);
}

export async function getUserProfile(userId: string) {
  const store = await getUserStore();

  if (store.mode === "memory") {
    const user = findUserInMemory(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    return user.profile ?? {};
  }

  const user = await store.users!.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  return user.profile ?? {};
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  const profile = validateProfileInput(input);
  const store = await getUserStore();

  if (store.mode === "memory") {
    const user = findUserInMemory(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    user.profile = { ...(user.profile || {}), ...profile };
    user.updatedAt = new Date().toISOString();
    return user.profile;
  }

  const users = store.users!;
  const setFields: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(profile)) {
    setFields[`profile.${key}`] = value;
  }

  const existing = await users.findOne({ _id: new ObjectId(userId) });
  if (!existing) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await users.updateOne({ _id: new ObjectId(userId) }, { $set: setFields });

  const updated = await users.findOne({ _id: new ObjectId(userId) });
  return updated?.profile ?? {};
}
