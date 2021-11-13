import { defineConfig } from 'vite'
import glslifyCompiler from './vite-plugin-glslify-compiler'

export default defineConfig({
  plugins: [
    glslifyCompiler()
  ],
  build: {
    reportCompressedSize: false
  }
})
