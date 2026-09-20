import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  // GitHub Pages serves this project at
  // https://callofguns.github.io/Producer.io/, not the domain root, so every
  // built asset URL needs that prefix. Without this, index.html would ask
  // for /assets/... instead of /Producer.io/assets/... and 404.
  base: '/Producer.io/',
})
