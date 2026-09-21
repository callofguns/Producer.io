import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: { host: true, port: 5173 },

  // GitHub Pages serves this project at
  // https://callofguns.github.io/Producer.io/, not the domain root, so every
  // built asset URL needs that prefix. Without this, index.html would ask
  // for /assets/... instead of /Producer.io/assets/... and 404.
  base: '/Producer.io/',

  plugins: [
    react(),
    VitePWA({
      // 'autoUpdate' means a new deploy replaces the cached app on the next
      // visit instead of leaving people stuck on an old version forever.
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Producer.io',
        short_name: 'Producer',
        description:
          'Write it, produce it, drop it. Build a music catalogue from nothing and see how far you get.',
        theme_color: '#22242a',
        background_color: '#22242a',
        display: 'standalone',
        orientation: 'portrait',
        // Both are relative to `base`, so they resolve under /Producer.io/.
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the built app so it opens offline.
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        // Throw away caches from older deploys — this is what stops the
        // stale-white-screen problem a service worker can otherwise cause.
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // The Google Fonts stylesheet and font files are third-party, so they
        // get cached at runtime rather than precached.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
