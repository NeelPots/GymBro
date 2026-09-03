import { defineConfig } from "vitest/config";
import path from "node:path";

// Mirrors tsconfig.json's "@/*" -> "./src/*" path mapping - needed now that
// a test (useLocalQuest.test.ts) imports a module that itself uses `@/`
// absolute imports, which no earlier test file happened to exercise.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
