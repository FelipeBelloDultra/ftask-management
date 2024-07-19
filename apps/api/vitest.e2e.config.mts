import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    include: ["src/**/*.e2e.spec.ts"],
    setupFiles: ["~/test/database/setup.ts"],
  },
});
