import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json"; // Add this back
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["@emotion/babel-plugin"] } }),
    themePlugin(), // Critical for ShadCN UI styling
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  root: path.resolve(__dirname, "./client"),
  server: {
    host: "0.0.0.0",
    watch: { usePolling: true, interval: 100 },
    hmr: { overlay: false },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: { output: { manualChunks: undefined } },
  },
});