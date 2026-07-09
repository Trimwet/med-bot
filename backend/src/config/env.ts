// Centralized env loader with validation.
// Fails fast on boot if a required variable is missing, instead of
// surfacing confusing errors deep inside a request handler.

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type EnvVar = {
  key: string;
  required: boolean;
  default?: string;
};

const ENV_SPEC: EnvVar[] = [
  { key: "PORT", required: false, default: "5000" },
  { key: "NODE_ENV", required: false, default: "development" },
  { key: "CORE_SECRET", required: false, default: "dev-core-secret" },
  { key: "MONGODB_URI", required: false, default: "" },
  { key: "MONGODB_DB_NAME", required: false, default: "medbot" },
  { key: "OPENAI_API_KEY", required: false, default: "dev-openai-key" },
  { key: "EMBEDDING_MODEL", required: false, default: "text-embedding-3-small" },
  { key: "LLM_MODEL", required: false, default: "gpt-4o-mini" },
  { key: "JWT_SECRET", required: false, default: "dev-jwt-secret" },
  { key: "BREVO_API_KEY", required: false, default: "dev-brevo-key" },
  { key: "SENDER_EMAIL", required: false, default: "dev@example.com" },
  { key: "GOOGLE_CLIENT_ID", required: false, default: "" },
  { key: "GOOGLE_CLIENT_SECRET", required: false, default: "" },
  { key: "CLIENT_URL", required: false, default: "http://localhost:5173" },
];

function loadDotEnvFile() {
  const currentFile = fileURLToPath(import.meta.url);
  const envPath = resolve(dirname(currentFile), "../../.env");

  if (!existsSync(envPath)) {
    return {} as Record<string, string>;
  }

  const values: Record<string, string> = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function loadEnv() {
  const fileValues = loadDotEnvFile();
  const values: Record<string, string> = {};

  for (const spec of ENV_SPEC) {
    const raw = process.env[spec.key] ?? fileValues[spec.key];
    if (raw === undefined || raw === "") {
      values[spec.key] = spec.default ?? "";
    } else {
      values[spec.key] = raw;
    }
  }

  return values;
}

const raw = loadEnv();

export const env = {
  port: Number(raw.PORT),
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === "production",
  coreSecret: raw.CORE_SECRET,
  mongodbUri: raw.MONGODB_URI,
  mongodbDbName: raw.MONGODB_DB_NAME,
  openaiApiKey: raw.OPENAI_API_KEY,
  embeddingModel: raw.EMBEDDING_MODEL,
  llmModel: raw.LLM_MODEL,
  jwtSecret: raw.JWT_SECRET,
  brevoApiKey: raw.BREVO_API_KEY,
  senderEmail: raw.SENDER_EMAIL,
  googleClientId: raw.GOOGLE_CLIENT_ID,
  googleClientSecret: raw.GOOGLE_CLIENT_SECRET,
  clientUrl: raw.CLIENT_URL,
} as const;
