// Test setup file (preloaded by bunfig.toml).
// Placeholder for shared test fixtures / env stubbing.

process.env.NODE_ENV = "test";
process.env.CORE_SECRET ||= "test-secret";
process.env.MONGODB_URI ||= "mongodb://localhost:27017";
process.env.MONGODB_DB_NAME ||= "medbot_test";
process.env.OPENAI_API_KEY ||= "test-key";
