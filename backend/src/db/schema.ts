// Shared TypeScript types for Mongo documents.

import type { ObjectId } from "mongodb";

export type TriageSeverity = "self_care" | "consult" | "emergency";

export interface SessionMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string; // ISO 8601
}

export interface SessionDocument {
  _id?: ObjectId;
  sessionId: string;
  userProfile: {
    ageRange?: string;
    location?: string;
    language?: string;
  };
  state: {
    currentProtocol?: string;
    currentStep?: string;
    severityScore?: number;
    severity?: TriageSeverity;
  };
  messages: SessionMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeChunkMetadata {
  protocolName: string; // e.g. "Chest Pain Protocol"
  step: string; // e.g. "Step 1"
  triageQuestions?: string[];
  severityScale?: Record<string, string>;
  redFlags?: string[];
  sourceFile: string;
}

export interface KnowledgeDocument {
  _id?: ObjectId;
  text: string; // the markdown chunk
  embedding: number[]; // vector embedding
  metadata: KnowledgeChunkMetadata;
  createdAt: string;
}
export interface UserProfile {
  age?: number;
  gender?: "male" | "female" | "other";
  heightCm?: number;
  weightKg?: number;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies?: string;
  conditions?: string;
  medications?: string;
  emergencyContact?: string;
}

export interface UserDocument {
  _id?: ObjectId;
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  profile?: UserProfile;
  createdAt?: string;
  updatedAt?: string;
}