import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    host: true,
    // Allow all hostnames for playground tunneling (ngrok/cloudflared, etc.)
    allowedHosts: true,
  },
  define: {
    'process.env': {}
  }
})
