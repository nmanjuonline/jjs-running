import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the dev server to local network (Wi-Fi) for mobile browsing
    port: 5173,
    watch: {
        ignored: ['**/.vs/**', '**/.git/**', '**/dist/**', '**/.wrangler/**'],
    },
  },
})
