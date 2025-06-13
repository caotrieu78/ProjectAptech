import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // hoặc dùng host: '0.0.0.0'
    port: 5173,          // hoặc port khác nếu muốn
  }
})
