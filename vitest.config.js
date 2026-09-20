import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ["dotenv/config"],
  },
  coverage: {
    exclude: ["src/Commons/config.js"],
  },
});
