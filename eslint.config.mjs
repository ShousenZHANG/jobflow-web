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
    // Generated code:
    "lib/generated/**",
    // Local tooling / vendored skill packs not part of the product:
    "everything-claude-code/**",
    // Chrome extension build artifacts (linted via its own pipeline):
    "chrome-extension/dist/**",
  ]),
]);

export default eslintConfig;
