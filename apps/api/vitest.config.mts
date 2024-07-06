import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: [
        "src/modules/**/domain/**",
        "src/modules/**/application/{subscribers,use-cases}/**",
        "!src/modules/**/application/use-cases/factories/**",
        "!src/modules/**/domain/events/**",
      ],
    },
    include: ["src/**/*.spec.ts", "!src/**/*.e2e.spec.ts"],
    setupFiles: ["test/container/index.ts"],
  },
});
