import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy:{
      '/api': 'http://localhost:8080',
    },
    port: 5173, // 👈 tady nastavíš port napevno
  },
})
