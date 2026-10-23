---
tags: [architecture, website, react, vite, structure, bundler, performance]
aliases: [Website Architecture, Codebase Architecture, Build System]
---

# Website Architecture & Build Pipeline

[[DOCUMENTATION_INDEX|Back to Home]]


🌐 **Canonical Web Documentation**: [Build Toolchain & Rendering Pipeline](https://naborajs.me/projects/birthday-bloom/docs/website-architecture)

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

The `radix-ui` branch remains available for future primitives, but the default app shell no longer imports any Radix component. As a result, the production build currently emits **no `radix-ui` chunk**.

### Production Build Metrics
Measured with Vite 8.3.4 on 2026-10-24:

- **Build Time**: $\approx 1.2\text{s}$
- **Three.js Chunk**: $\approx 938\text{kB}$ ($\approx 254\text{kB}$ gzip, lazy-loaded)
- **Framer Motion Chunk**: $\approx 144\text{kB}$ ($\approx 48\text{kB}$ gzip)
- **Main App Code**: $\approx 420\text{kB}$ ($\approx 126\text{kB}$ gzip)
- **Vendor & Runtime**: $\approx 226\text{kB}$ ($\approx 75\text{kB}$ gzip)
- **Template Pack**: $\approx 83\text{kB}$ ($\approx 19\text{kB}$ gzip)
- **Initial JS Total**: $\approx 873\text{kB}$ ($\approx 268\text{kB}$ gzip)
- **CSS**: $\approx 103\text{kB}$ ($\approx 17\text{kB}$ gzip)
- **Cake Selector Art**: four JPEGs totaling $\approx 431\text{kB}$

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

---

## 🔍 Scope Boundaries

### What is Present:
- Vite 8 / Rolldown Compilation Graph, Bundle Budget Analysis (~268 KB gzipped initial JS vs. ~254 KB gzipped lazy WebGL chunk), CSS JIT Tree-Shaking.

### What is NOT Present:
- Step-by-step local clone commands (see [[quick-start#5-Minute-Local-Setup|Quick Start]]), Translation lexicons (see [[setup-hindi|Hindi]], [[setup-bengali|Bengali]], [[setup-french|French]]).
