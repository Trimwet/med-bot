import type { ObjectId } from "mongodb";

export type TriageSeverity = "self_care" | "consult" | "emergency";
export type SessionStatus = "in_progress" | "closed";
export type FollowupStatus = "pending" | "sent" | "failed";

export interface SessionMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface KnowledgeEdge {
  toNodeId: string;
  triggerEmbedding: number[];
  label: string;
}

export const CATEGORIES = [
  "infectious",    // malaria, typhoid, fever, Lassa, meningitis
  "respiratory",   // cough, TB, pneumonia, breathing difficulty, asthma
  "cardiac",       // chest pain, hypertension, palpitations
  "gi",            // diarrhoea, vomiting, dehydration, cholera, abdominal pain
  "neurological",  // headache, stroke, seizure, confusion, sickle cell crisis
  "maternal",      // pregnancy complications, postpartum
  "trauma",        // injuries, burns, fractures, snake bites
  "skin",          // rashes, wounds, cellulitis, abscess
  "mental",        // anxiety, depression, suicidal thoughts, panic
  "general",       // non-specific, default fallback
] as const;

export type ProtocolCategory = (typeof CATEGORIES)[number];

export interface KnowledgeDocument {
  _id?: ObjectId;
  nodeId: string;
  protocolId: string;
  protocolVersion: string;
  category: ProtocolCategory;
  subcategory?: string;
  title: string;
  content: string;
  embedding: number[];
  activationThreshold: number;
  edges: KnowledgeEdge[];
  isLatest?: boolean;
  metadata: {
    triageQuestions?: string[];
    severityScale?: Record<string, string>;
    redFlags?: string[];
    sourceFile: string;
  };
  updatedAt: string;
  updatedBy: string;
}

export interface ClinicalRuleDocument {
  _id?: ObjectId;
  nodeId: string;
  protocolId: string;
  protocolVersion: string;
  emergencyThreshold: number;
  seeDoctorThreshold: number;
  watchPeriodHours: number;
  redFlags: string[];
  selfCareGuidance: string;
  updatedAt: string;
  updatedBy: string;
}

export interface TenantDocument {
  _id?: ObjectId;
  name: string;
  tier: "growth" | "enterprise" | "b2c";
  tokenBalance: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  whitelabelConfig: {
    logoUrl?: string;
    primaryColor?: string;
  };
  createdAt: string;
}

export interface PatientDocument {
  _id?: ObjectId;
  patientId: string;
  tenantId: string;
  phone: string;
  name: string;
  consentGivenAt?: string;
  dataRetentionPolicy?: string;
  retainUntil?: string;
  createdAt: string;
}

export interface SessionDocument {
  _id?: ObjectId;
  sessionId: string;
  userId: string;
  tenantId?: string;
  patientId?: string;
  channel: "web" | "whatsapp" | "mobile";
  activeNodeId?: string;
  lastFiringScore?: number;
  protocolVersion?: string;
  verdict?: TriageSeverity;
  status: SessionStatus;
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
  extractedAnswers?: {
    severityScore: number;
    durationHours: number;
    reportedSymptoms: string[];
  };
  messages: SessionMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummaryDocument {
  _id?: ObjectId;
  sessionId: string;
  patientId: string;
  tenantId?: string;
  summaryText: string;
  embedding: number[];
  createdAt: string;
}

export interface TokenLedgerDocument {
  _id?: ObjectId;
  tenantId: string;
  sessionId: string;
  promptTokens: number;
  completionTokens: number;
  multiplierApplied: number;
  costNgn: number;
  timestamp: string;
}

export interface FollowupJobDocument {
  _id?: ObjectId;
  sessionId: string;
  tenantId: string;
  patientId: string;
  scheduledFor: string;
  sentAt?: string;
  dedupeKey: string;
  status: FollowupStatus;
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
  tenantId?: string;
  consentGivenAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalInput {
  severityScale: number;
  durationHours: number;
  associatedSymptoms: string[];
  redFlags: string[];
}

export interface ClinicalResult {
  score: number;
  severity: TriageSeverity;
  matchedRedFlags: string[];
  nextStep: string;
  guidanceText?: string;
}

export interface ApiKeyDocument {
  _id?: ObjectId;
  tenantId: string;
  label: string;
  keyPrefix: string;
  keyHash: string;
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}
