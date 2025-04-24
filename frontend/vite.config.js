import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0', // This is important for Render
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
