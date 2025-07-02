import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Rõ ràng hơn, lắng nghe tất cả interfaces
    port: 5173,
    strictPort: true, // Báo lỗi nếu cổng bị chiếm
    open: true, // Tự động mở trình duyệt
    cors: true, // Bật CORS cho frontend
    hmr: {
      host: "localhost" // Đảm bảo Hot Module Replacement hoạt động
    },
    proxy: {
      // Chuyển tiếp các yêu cầu API tới backend
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1")
      }
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    cors: true
  }
});
