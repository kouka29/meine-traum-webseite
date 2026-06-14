import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    imagetools({
      // Default directives applied when ?picture is requested.
      defaultDirectives: (url) => {
        if (url.searchParams.has("picture")) {
          return new URLSearchParams({
            format: "avif;webp;" + (url.pathname.endsWith(".png") ? "png" : "jpg"),
            as: "picture",
          });
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    // Code-Splitting: schwere Drittanbieter-Bibliotheken in eigene Chunks legen,
    // damit sie unabhängig vom App-Code geladen und gecached werden können.
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react/jsx-runtime", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-charts": ["recharts"],
          "vendor-stripe": ["@stripe/react-stripe-js", "@stripe/stripe-js"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-embla": ["embla-carousel-react", "embla-carousel-autoplay"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
    // Inhalt-Hashing für aggressives CDN-Caching.
    chunkSizeWarningLimit: 800,
  },
}));
