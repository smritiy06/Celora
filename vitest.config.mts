import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "server-only": path.resolve(import.meta.dirname, "src/tests/empty.ts"),
    },
  },
  test: { include: ["src/tests/**/*.test.ts"] },
});
