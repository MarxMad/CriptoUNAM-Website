import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ethers-vendor': ['ethers'],
          'ui-vendor': [ '@emotion/react', '@emotion/styled', 'framer-motion'],
          'web3-vendor': ['@reown/appkit', '@reown/appkit-adapter-wagmi', 'wagmi', 'viem'],
          'charts-vendor': ['recharts'],
          'utils-vendor': ['axios', 'react-helmet-async']
        },
        // Optimización de chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop()?.split('.')[0]
            return `js/${fileName}-[hash].js`
          }
          return 'js/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            return 'images/[name]-[hash][extname]'
          }
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
            return 'fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      },
    },
    // Optimizaciones adicionales
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp'],
  publicDir: 'public',
  base: '/',
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: ['@reown/appkit']
  },
  // Configuración de servidor para desarrollo
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  // Configuración de preview
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
