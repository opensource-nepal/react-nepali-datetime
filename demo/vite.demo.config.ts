
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/react-nepali-datetime/',
  plugins: [react()],
  root: 'demo',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
