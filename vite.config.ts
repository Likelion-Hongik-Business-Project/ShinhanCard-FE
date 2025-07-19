import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
