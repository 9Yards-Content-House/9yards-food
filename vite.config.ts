import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // Bundle analyzer - generates stats.html when running npm run analyze
    mode === "analyze" && visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'images/logo/apple-touch-icon.png', 'images/logo/favicon.svg'],
      manifest: {
        name: '9Yards Food - Authentic Ugandan Cuisine Delivery',
        short_name: '9Yards Food',
        description: 'Order authentic Ugandan dishes delivered fresh to your door. Matooke, Posho, Chicken, Fish & more. Serving Kampala.',
        theme_color: '#212282',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['food', 'shopping', 'lifestyle'],
        icons: [
          {
            src: '/images/logo/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/logo/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/logo/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/logo/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification
    minify: "esbuild",
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Optimize CSS
    cssMinify: true,
    // Source maps only in development
    sourcemap: mode === "development",
    // Rollup options for better chunking
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks - cached separately
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-select",
            "@radix-ui/react-popover",
          ],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority", "date-fns"],
        },
        // Consistent chunk naming for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Increase chunk size warning limit (we're splitting well now)
    chunkSizeWarningLimit: 300,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
}));
