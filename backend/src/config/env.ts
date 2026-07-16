import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type EnvVar = { key: string; required: boolean; default?: string };

const ENV_SPEC: EnvVar[] = [
  { key: "PORT", required: false, default: "5001" },
  { key: "NODE_ENV", required: false, default: "development" },
  { key: "CORE_SECRET", required: false, default: "dev-core-secret" },
  { key: "JWT_SECRET", required: false, default: "dev-jwt-secret" },
  { key: "MONGODB_URI", required: false, default: "" },
  { key: "MONGODB_DB_NAME", required: false, default: "medbot" },
  { key: "DEEPSEEK_API_KEY", required: false, default: "" },
  { key: "DEEPSEEK_BASE_URL", required: false, default: "https://api.deepseek.com" },
  { key: "DEEPSEEK_CHAT_MODEL", required: false, default: "deepseek-chat" },
  { key: "DEEPSEEK_EMBEDDING_MODEL", required: false, default: "text-embedding-3-small" },
  { key: "EMBEDDING_DIMENSION", required: false, default: "1536" },
  // OpenAI is used for embeddings — DeepSeek has no embeddings endpoint.
  // OPENAI_API_KEY is required for real vector search; without it the system
  // falls back to keyword search (still functional after the routing fix).
  { key: "OPENAI_API_KEY", required: false, default: "" },
  { key: "OPENAI_BASE_URL", required: false, default: "https://api.openai.com/v1" },
  { key: "BREVO_API_KEY", required: false, default: "dev-brevo-key" },
  { key: "SENDER_EMAIL", required: false, default: "dev@example.com" },
  { key: "GOOGLE_CLIENT_ID", required: false, default: "" },
  { key: "GOOGLE_CLIENT_SECRET", required: false, default: "" },
  { key: "GOOGLE_CALLBACK_URL", required: false, default: "http://localhost:5001/api/auth/google/callback" },
  { key: "CLIENT_URL", required: false, default: "http://localhost:5173" },
  { key: "PAYSTACK_SECRET_KEY", required: false, default: "" },
  { key: "PAYSTACK_PUBLIC_KEY", required: false, default: "" },
  { key: "REDIS_URL", required: false, default: "" },
  { key: "ERROR_WEBHOOK_URL", required: false, default: "" },
  { key: "FISH_AUDIO_API_KEY", required: false, default: "" },
  { key: "OPENROUTER_API_KEY", required: false, default: "" },
];

function parseDotEnv(content: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sep = trimmed.indexOf("=");
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    let value = trimmed.slice(sep + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function loadDotEnvFile(): Record<string, string> {
  const currentFile = fileURLToPath(import.meta.url);

  // 1. Render Secret Files path
  const renderSecretPath = "/etc/secrets/.env";
  if (existsSync(renderSecretPath)) {
    console.log("[env] loading from Render Secret Files:", renderSecretPath);
    return parseDotEnv(readFileSync(renderSecretPath, "utf8"));
  }
  console.log("[env] Render Secret Files not found at:", renderSecretPath);

  // 2. Local development fallback (relative to config file)
  const localEnvPath = resolve(dirname(currentFile), "../../.env");
  if (existsSync(localEnvPath)) {
    console.log("[env] loading from local .env:", localEnvPath);
    return parseDotEnv(readFileSync(localEnvPath, "utf8"));
  }

  console.log("[env] no .env file found, using defaults only");
  return {};
}

function loadEnv() {
  const fileValues = loadDotEnvFile();
  const values: Record<string, string> = {};
  for (const spec of ENV_SPEC) {
    const raw = process.env[spec.key] ?? fileValues[spec.key];
    values[spec.key] = raw === undefined || raw === "" ? (spec.default ?? "") : raw;
  }
  return values;
}

const raw = loadEnv();

export const env = {
  port: Number(raw.PORT),
  nodeEnv: raw.NODE_ENV,
  isProduction: raw.NODE_ENV === "production",
  coreSecret: raw.CORE_SECRET,
  jwtSecret: raw.JWT_SECRET,
  mongodbUri: raw.MONGODB_URI,
  mongodbDbName: raw.MONGODB_DB_NAME,
  deepseekApiKey: raw.DEEPSEEK_API_KEY,
  deepseekBaseUrl: raw.DEEPSEEK_BASE_URL,
  deepseekChatModel: raw.DEEPSEEK_CHAT_MODEL,
  deepseekEmbeddingModel: raw.DEEPSEEK_EMBEDDING_MODEL,
  embeddingDimension: Number(raw.EMBEDDING_DIMENSION),
  openaiApiKey: raw.OPENAI_API_KEY,
  openaiBaseUrl: raw.OPENAI_BASE_URL,
  brevoApiKey: raw.BREVO_API_KEY,
  senderEmail: raw.SENDER_EMAIL,
  googleClientId: raw.GOOGLE_CLIENT_ID,
  googleClientSecret: raw.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: raw.GOOGLE_CALLBACK_URL,
  clientUrl: raw.CLIENT_URL,
  paystackSecretKey: raw.PAYSTACK_SECRET_KEY,
  paystackPublicKey: raw.PAYSTACK_PUBLIC_KEY,
  redisUrl: raw.REDIS_URL,
  errorWebhookUrl: raw.ERROR_WEBHOOK_URL,
  fishAudioApiKey: raw.FISH_AUDIO_API_KEY,
  openrouterApiKey: raw.OPENROUTER_API_KEY,
} as const;
