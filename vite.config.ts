import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import OptimizationPersist from 'vite-plugin-optimize-persist'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // OptimizationPersist()
  ],
  resolve: {
    alias: {
      '@': '/src/',
    }
  },
  css: {
    modules: {
      // localIdentName: "[path][name]---[local]---[hash:base64:5]",
      generateScopedName: "[local]__[hash:base64:5]",
    },
  },
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, '')
      },
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
