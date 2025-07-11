import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Alternatively, use '0.0.0.0' for network exposure
    hmr: {
      overlay: false, // Disable overlay for hot module replacement
    },
  },
})
