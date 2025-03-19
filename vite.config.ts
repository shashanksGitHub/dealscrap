import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './client/src') },
      { find: '@shared', replacement: path.resolve(__dirname, './shared') }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
})