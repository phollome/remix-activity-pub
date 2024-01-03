import { defineConfig, defaultExclude } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.spec.?(c|m)[jt]s?(x)"],
    exclude: [...defaultExclude, "**/tests/**/*"],
  },
  plugins: [tsconfigPaths()],
});
