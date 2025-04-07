import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Barcha IP'lar uchun ruxsat
    port: 5173, // Portni o'zgartirish mumkin
    strictPort: true,
    allowedHosts: ["million-oe-treasure-characterization.trycloudflare.com"], // Ngrok hostiga ruxsat
    cors: true, // CORS ruxsat berish
  },
  plugins: [react()],
})
