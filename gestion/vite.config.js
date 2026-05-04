import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Manifest PWA — surchargeable par cabinet via env vars au build :
// VITE_PWA_NAME, VITE_PWA_SHORT_NAME, VITE_PWA_DESCRIPTION,
// VITE_PWA_THEME_COLOR, VITE_PWA_BG_COLOR
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'firestore-cache', networkTimeoutSeconds: 4 },
            },
          ],
        },
        manifest: {
          name:             env.VITE_PWA_NAME         || 'Mon Espace Pro — Cabinet PONCEY LEBAS',
          short_name:       env.VITE_PWA_SHORT_NAME   || 'Espace Pro',
          description:      env.VITE_PWA_DESCRIPTION  || 'Gestion sinistres, contrats, clients et MED',
          theme_color:      env.VITE_PWA_THEME_COLOR  || '#0d0f1a',
          background_color: env.VITE_PWA_BG_COLOR     || '#0d0f1a',
          display: 'standalone',
          orientation: 'portrait-primary',
          icons: [
            { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
        },
      }),
    ],
    base: './',
  };
});
