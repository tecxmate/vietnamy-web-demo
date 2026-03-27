import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'grammar-modules': ['./src/data/grammar_modules.json'],
          'grammar-bank': ['./src/data/vn_grammar_bank_v2.json'],
        },
      },
    },
  },
})
