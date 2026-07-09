// Centralized env loader with validation.
// Fails fast on boot if a required variable is missing, instead of
// surfacing confusing errors deep inside a request handler.

type EnvVar = {
  key: string;
  required: boolean;
  default?: string;
};

const ENV_SPEC: EnvVar[] = [
  { key: "PORT", required: false, default: "3000" },
  { key: "NODE_ENV", required: false, default: "development" },
  { key: "CORE_SECRET", required: true },
  { key: "MONGODB_URI", required: true },
  { key: "MONGODB_DB_NAME", required: false, default: "medbot" },
  { key: "OPENAI_API_KEY", required: true },
  { key: "EMBEDDING_MODEL", required: false, default: "text-embedding-3-small" },
  { key: "LLM_MODEL", required: false, default: "gpt-4o-mini" },
  { key: "JWT_SECRET", required: true },
  { key: "BREVO_API_KEY", required: true },
  { key: "SENDER_EMAIL", required: true },
  { key: "GOOGLE_CLIENT_ID", required: true },
  { key: "GOOGLE_CLIENT_SECRET", required: true },
  { key: "CLIENT_URL", required: true },
];

function loadEnv() {
  const missing: string[] = [];
  const values: Record<string, string> = {};

  for (const spec of ENV_SPEC) {
    const raw = process.env[spec.key];
    if (raw === undefined || raw === "") {
      if (spec.required) {
        missing.push(spec.key);
        continue;
      }
      values[spec.key] = spec.default ?? "";
    } else {
      values[spec.key] = raw;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        `Copy .env.example to .env and fill these in.`
    );
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
