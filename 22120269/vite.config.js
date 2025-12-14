import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Thêm cấu hình proxy vào đây
    proxy: {
      "/api": {
        target: "https://34.124.214.214:2423", // Server gốc
        changeOrigin: true,
        secure: false, // ⚠️ CỰC KỲ QUAN TRỌNG: Giúp bỏ qua lỗi SSL (ERR_CERT...) tự động
      },
    },
  },
});
