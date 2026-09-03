import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The original prototype, kept for reference only - not part of the new app.
    "legacy/**",
    // The native Capacitor Android project - Java/Gradle, plus vendored/generated
    // JS in its build output that isn't part of this app's own source.
    "android/**",
  ]),
]);

export default eslintConfig;
