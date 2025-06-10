import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      outDir: 'dist/types',
    }),
    cssInjectedByJsPlugin(),
  ],
  css: {
    devSourcemap: true,
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'react-nepali-datetime',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'nepali-datetime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'nepali-datetime': 'NepaliDateTime',
        },
      },
    },
    sourcemap: false,
    emptyOutDir: true,
  },
})
