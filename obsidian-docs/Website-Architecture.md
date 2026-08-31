---
tags: [architecture, website, react, vite, structure, bundler, performance]
aliases: [Website Architecture, Codebase Architecture, Build System]
---

# Website Architecture & Build Pipeline

[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom website is engineered on a modern React 18 / TypeScript 5.8 stack, optimized for instant client-side loads and cinematic visual performance.

---

## 1. Core Technology Stack

- **Vite 8 & Rolldown Compiler**: Development and production build bundler (`vite.config.ts`).
- **React 18 Concurrent Mode**: Root hydration via `createRoot` inside `src/main.tsx`, wrapped with `GlobalErrorBoundary` for resilient fail-safe error recovery.
- **TypeScript 5.8 (Strict Mode)**: Comprehensive type coverage (`tsconfig.json`) ensuring zero implicit `any` and complete prop validation.
- **Tailwind CSS 3.4 & Tailwind-Merge 3.6**: Atomic styling with dynamic HSL CSS variable theming.
- **Framer Motion 13**: High-performance gesture, transition, and layout animation engine.
- **Three.js & React Three Fiber 8**: WebGL 3D spatial rendering and interactive physics.

---

## 2. Production Chunking & Caching Strategy

Heavy third-party libraries are isolated into dedicated vendor chunks via `vite.config.ts`:

```typescript
rollupOptions: {
  output: {
    manualChunks(id) {
      if (id.includes('node_modules')) {
        if (id.includes('three') || id.includes('@react-three')) return 'three';
        if (id.includes('framer-motion')) return 'framer-motion';
        if (id.includes('radix-ui') || id.includes('@radix-ui')) return 'radix-ui';
        return 'vendor';
      }
    },
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
  }
}
```

### Production Build Metrics
- **Build Time**: $\approx 850\text{ms} - 1.1\text{s}$
- **Three.js Chunk**: $\approx 918\text{kB}$ ($\approx 248\text{kB}$ gzip)
- **Framer Motion Chunk**: $\approx 141\text{kB}$ ($\approx 46\text{kB}$ gzip)
- **Main App Code**: $\approx 447\text{kB}$ ($\approx 129\text{kB}$ gzip)
- **Vendor & Runtime**: $\approx 110\text{kB}$ ($\approx 37\text{kB}$ gzip)

---

## 3. Resilient Error Boundary Architecture

`GlobalErrorBoundary` (`src/components/GlobalErrorBoundary.tsx`) encapsulates the entire React component tree:
- Traps uncaught WebGL context losses, media decode errors, and rendering exceptions.
- Displays an elegant, accessible fallback card with reload options without dumping raw stack traces.

---

## 4. State Management Lifecycle

Application state is governed by **Zustand 5** (`useBirthdayStore.ts`):
- **Configuration Parser**: Normalizes 53 environment variables, query parameters, and relationship archetypes into `BirthdayConfig`.
- **Phase State Machine**: Manages the linear transition sequence: `splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`.

---
#obsidian #documentation #birthday-bloom #vault #architecture #vite #performance

