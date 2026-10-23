---
tags: [ui, components, shadcn, radix, tailwind, design-system, glassmorphism]
aliases: [UI Components, Shadcn Components, Design System]
---

# UI Components & Design System Architecture

[[DOCUMENTATION_INDEX|Back to Home]]


🌐 **Canonical Web Documentation**: [Design System Primitives](https://naborajs.me/projects/birthday-bloom/docs/ui-components)

The Birthday Bloom codebase employs a streamlined, tree-shaken Design System built with **Tailwind CSS**, **Lucide Icons**, and a single optional **Radix UI** tooltip primitive.

To maximize runtime performance and minimize bundle overhead, the UI layer is structured into lightweight primitives and glassmorphism styling utilities. The default app shell mounts only Sonner; because no Radix primitive is imported by the app graph, the production build emits no `radix-ui` chunk.

---

## 1. Active UI Primitives (`src/components/ui/`)

### A. `sonner.tsx` — Toast Notification System
* **Implementation:** Theme-integrated wrapper around the `sonner` toast library.
* **Usage:** Provides non-blocking notifications, link copied toasts, and feedback triggers during celebration playback and user interactions.
* **Theme Sync:** Automatically inherits dynamic HSL theme colors injected via `useDynamicTheme.ts`.

### B. `tooltip.tsx` — Optional Accessible Tooltips
* **Implementation:** Accessible tooltip primitive powered by `@radix-ui/react-tooltip`.
* **Usage:** Available for hover and focus hints, but **not mounted by the default app shell**. `App.tsx` no longer wraps the tree in `TooltipProvider`, so the Radix tooltip code stays out of the initial bundle until a feature imports it.
* **Accessibility:** Fully WAI-ARIA compliant with animated fade/slide transitions and smooth delay timing when used.

---

## 2. Utility Class Merging (`src/lib/utils.ts`)

Class name concatenation is managed via the standard `cn()` helper:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This ensures conflict-free class overrides with **Tailwind-Merge 3.6** without bloated specificity hacks.

---

## 3. Glassmorphism Design Tokens

To achieve modern iOS-grade frosted aesthetics across dark celebration backgrounds, the design system utilizes dedicated CSS classes:

| Class Token | Visual Effect | CSS Composition |
| :--- | :--- | :--- |
| `.glass-panel` | Full frosted backdrop | `bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl` |
| `.glass-card` | Interactive card tile | `bg-white/5 backdrop-blur-xl border border-white/15 hover:bg-white/10 transition-all` |
| `.glass-pill` | Floating badge / tag | `bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20` |

On low-tier devices, `Index.tsx` adds `.perf-low` to the root and `index.css` suppresses `backdrop-filter` for all descendants. The translucent backgrounds and borders remain; only the expensive compositor blur pass is skipped. Desktop and balanced profiles retain the full frosted treatment.

---

## 4. Extending the UI Design System

Birthday Bloom is fully compatible with additional **Shadcn UI** and **Radix UI** primitives if you wish to expand functionality.

To add new primitives to `src/components/ui/`:
1. Use lightweight composable Radix primitives.
2. Compose with Tailwind CSS utility classes and `cn()` helper from `@/lib/utils`.
3. Follow the PascalCase component convention established in the project.

---
#obsidian #documentation #birthday-bloom #vault #ui #components #glassmorphism

---

## 🔍 Scope Boundaries

### What is Present:
- Component Token Specifications (Sonner toast wrapper, optional Radix tooltip primitive, glassmorphic container classes `backdrop-blur-xl`, `.perf-low` blur fallback), Color Variable Mapping (`--birthday-primary`, `--birthday-glow`).

### What is NOT Present:
- Backend API endpoints or database ORM models, Audio synthesis buffer algorithms (see [[Celebration-Sound-and-Sensory-Design#Web-Audio-API-Graph-Architecture|Sound & Sensory Design]]).
