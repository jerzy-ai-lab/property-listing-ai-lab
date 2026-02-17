import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
          ],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [".ngrok-free.app"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
