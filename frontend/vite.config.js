import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All /api/* requests from the dev server are forwarded to Render
      // This bypasses CORS because the request comes from the server, not the browser
      '/api': {
        target: 'https://venue-event.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
