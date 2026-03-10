import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {url:'postgresql://neondb_owner:npg_buIj9hLe6Cao@ep-weathered-mud-a8mgtyiq-pooler.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require'}
});
