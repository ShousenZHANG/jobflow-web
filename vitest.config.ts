import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    css: false,
    // Vitest 4 default `forks` pool fails to register suites on Windows in this
    // project (suites resolve before the worker registers them). `vmThreads`
    // is stable here and keeps memory bounded.
    pool: "vmThreads",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      // Chrome extension has its own Vitest config; do not pull it into the
      // root run.
      "chrome-extension/**",
      // Local tooling / vendored skill packs ship their own ad-hoc test
      // harnesses that call `process.exit` and are not product code.
      "everything-claude-code/**",
    ],
  },
});
