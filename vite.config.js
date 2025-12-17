import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "exemption-deliver-backing-minimal.trycloudflare.com"
    ],
    proxy: {
      "/api/market": {
        target: "https://api.data.gov.in",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/market/, "/resource"),
        secure: false,
      },
    },
  },
});
