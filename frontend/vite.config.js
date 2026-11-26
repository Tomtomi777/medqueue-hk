
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "icons/favicon-32.png",
        "icons/apple-touch-icon.png",
      ],

      manifest: {
        id: "/",

        name: "MedQueue HK",

        short_name: "MedQueue",

        description:
          "Hong Kong A&E waiting time monitoring and historical analytics.",

        lang: "en",

        theme_color: "#102e38",

        background_color: "#102e38",

        display: "standalone",

        start_url: "/",

        scope: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],

        shortcuts: [
          {
            name: "Hospital Directory",
            short_name: "Hospitals",
            url: "/hospitals",
          },
          {
            name: "Hospital Comparison",
            short_name: "Compare",
            url: "/comparison",
          },
          {
            name: "Historical Analytics",
            short_name: "Analytics",
            url: "/analytics",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,ico,woff2}",
        ],

        cleanupOutdatedCaches: true,

        navigateFallback: "/index.html",

        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/actuator\//,
        ],

        runtimeCaching: [],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
});
