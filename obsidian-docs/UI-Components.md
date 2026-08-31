---
tags: [ui, components, shadcn, radix, tailwind, design-system, glassmorphism]
aliases: [UI Components, Shadcn Components, Design System]
---

# UI Components & Design System Architecture

[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom codebase employs a streamlined, tree-shaken Design System built with **Tailwind CSS**, **Lucide Icons**, and **Radix UI Primitives**. 

To maximize runtime performance and minimize bundle overhead, the UI layer is structured into lightweight primitives and glassmorphism styling utilities:

---

## 1. Active UI Primitives (`src/components/ui/`)

### A. `sonner.tsx` — Toast Notification System
* **Implementation:** Theme-integrated wrapper around the `sonner` toast library.
* **Usage:** Provides non-blocking notifications, link copied toasts, and feedback triggers during celebration playback and user interactions.
* **Theme Sync:** Automatically inherits dynamic HSL theme colors injected via `useDynamicTheme.ts`.

### B. `tooltip.tsx` — Accessible Tooltips
* **Implementation:** Accessible tooltip primitive powered by `@radix-ui/react-tooltip`.
* **Usage:** Provides hover and focus hints for interactive controls, audio toggles, and photo gallery navigation.
* **Accessibility:** Fully WAI-ARIA compliant with animated fade/slide transitions and smooth delay timing.

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

---

## 4. Extending the UI Design System

Birthday Bloom is fully compatible with additional **Shadcn UI** and **Radix UI** primitives if you wish to expand functionality.

To add new primitives to `src/components/ui/`:
1. Use lightweight composable Radix primitives.
2. Compose with Tailwind CSS utility classes and `cn()` helper from `@/lib/utils`.
3. Follow the PascalCase component convention established in the project.

---
#obsidian #documentation #birthday-bloom #vault #ui #components #glassmorphism

