import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@ext": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    // Vitest 4 default `forks` pool intermittently fails to register suites
    // on Windows; `vmThreads` is stable for this jsdom-based test surface.
    pool: "vmThreads",
  },
});
