---
tags: [ui, components, shadcn, radix, tailwind, design-system]
aliases: [UI Components, Shadcn Components]
---

# UI Components Engine
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom codebase employs a streamlined, tree-shaken Design System built with **Tailwind CSS**, **Lucide Icons**, and **Radix UI Primitives**. 

To maximize runtime performance and minimize bundle overhead, the active generic UI primitives in `src/components/ui/` are focused on essential interaction layers:

---

## 1. Active UI Components (`src/components/ui/`)

### A. `sonner.tsx` — Toast Notification System
* **Implementation:** Wrapper around the `sonner` toast library integrated with theme tokens.
* **Usage:** Provides non-blocking notifications, feedback triggers, and status messages during celebration playback and user interactions.
* **Theme Sync:** Automatically inherits theme colors and styling rules defined in `tailwind.config.ts`.

### B. `tooltip.tsx` — Accessible Tooltips
* **Implementation:** Accessible tooltip primitive powered by `@radix-ui/react-tooltip`.
* **Usage:** Provides hover and focus hints for interactive controls, audio toggles, and photo gallery navigation.
* **Accessibility:** Fully WAI-ARIA compliant with animated fade/slide transitions and smooth delay timing.

---

## 2. Birthday Celebration Components (`src/components/birthday/`)

The primary cinematic experiences and interactive features are located in `src/components/birthday/`:

- **`CinematicIntro.tsx`**: Typewriter text sequencing, story pacing, and unlock logic.
- **`CakeCutting.tsx`**: 3D/SVG cake with candle blowout detection, wishes, and interactive cutting physics.
- **`HeartTree.tsx`**: Procedural physics blossoming finale tree.
- **`PhotoGallery.tsx`**: Polaroid-style 3D tilt photo grid with caption reveal and lightbox support.
- **`MainBirthday.tsx`**: Central orchestration view coordinating ambient fireworks, audio playback, countdowns, and footer.
- **`Balloons.tsx`**: Dynamic floating balloons with pop interactions and physics drift.
- **`Confetti.tsx`**: High-performance canvas confetti engine.
- **`PasswordUnlock.tsx`**: Gatekeeper passcode challenge for personalized surprise unlocks.

---

## 3. Extending the UI Design System

Birthday Bloom is fully compatible with additional **Shadcn UI** and **Radix UI** primitives if you wish to expand functionality (such as adding custom dialogs, accordions, or drawer menus).

To add new primitives to `src/components/ui/`:
1. Use standard Radix UI primitives already installed in `package.json` (such as `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-accordion`).
2. Compose with Tailwind CSS utility classes and `cn()` helper from `@/lib/utils`.
3. Follow the PascalCase component convention established in the project.

---
#obsidian #documentation #birthday-bloom #vault #ui #components
