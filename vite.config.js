import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'schwinsight.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})