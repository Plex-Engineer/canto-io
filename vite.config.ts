import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
//vite.config.js
import nodePolyfills from 'rollup-plugin-polyfill-node';
const production = process.env.NODE_ENV === 'production';
export default {
  server: { 
    host: '0.0.0.0'
  } ,
  plugins: [
    react(), tsconfigPaths(),
    // ↓ Needed for development mode
    !production && nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
      })
  ],

  build: {
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}