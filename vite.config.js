import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.JPG"],
  define: {
    "process.env": process.env, // To make env vars accessible globally (if needed)
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
