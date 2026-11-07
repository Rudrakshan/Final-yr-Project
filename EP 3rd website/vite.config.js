import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin: rewrite bare 'maplibre-gl' import to CJS build so Vite
// can pre-bundle it and create a proper ESM default-export wrapper.
// The CSS path import ('maplibre-gl/dist/maplibre-gl.css') is left untouched.
function maplibreResolvePlugin() {
  return {
    name: 'maplibre-resolve',
    resolveId(id) {
      if (id === 'maplibre-gl') {
        return this.resolve('maplibre-gl/dist/maplibre-gl.js', undefined, { skipSelf: true })
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), maplibreResolvePlugin()],
  server: {
    port: 3000,
    open: false
  }
})
