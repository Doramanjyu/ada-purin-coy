import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tsconfigPaths({
        root: "./",
      }),
    ],
    server: {
      port: 8080,
      strictPort: true,
      host: "0.0.0.0",
    },
  };
});
