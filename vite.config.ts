import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  build: {
    // Ensure fresh builds - no cache
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    // Add cache busting with content hashes.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('Cake3D') ||
            id.includes('CakeKnife3D')
          ) {
            return 'three';
          }
          if (
            id.includes('hindiTemplates') ||
            id.includes('bengaliTemplates') ||
            id.includes('frenchTemplates')
          ) {
            return 'templates';
          }
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('@react-three') ||
              id.includes('@react-spring')
            ) {
              return 'three';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('radix-ui') || id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            return 'vendor';
          }
        },
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
}));
