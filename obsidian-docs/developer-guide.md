---
tags: [developer, api, components, contribution]
aliases: [developer-guide]
---

# Developer Guide & Contributor Handbook

This guide explains how Birthday Bloom is wired so new contributors and open-source developers can make changes quickly, safely, and confidently. Read this before modifying source code.

---

## 🧭 How to Read This Codebase

1. **Start with the data flow**: [`src/features/core/store/useBirthdayStore.ts`](file:///d:/Projects/Website/birthday-bloom/src/features/core/store/useBirthdayStore.ts) — where 53 environment variables, query parameters, and aliases are parsed, validated, and hydrated into the centralized Zustand store.
2. **Understand the phase machine**: [`src/pages/Index.tsx`](file:///d:/Projects/Website/birthday-bloom/src/pages/Index.tsx) — manages linear transitions: `splash` -> `unlock` -> `intro` -> `main`.
3. **Explore major interactive components**: [`CinematicIntro.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/CinematicIntro.tsx), [`CakeCutting.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/CakeCutting.tsx), [`Cake3D.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/Cake3D.tsx), and [`MainBirthday.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/MainBirthday.tsx).
4. **Study relationship and template models**: [`familyTemplates.ts`](file:///d:/Projects/Website/birthday-bloom/src/features/core/models/familyTemplates.ts) and [`templates.ts`](file:///d:/Projects/Website/birthday-bloom/src/config/templates.ts).
5. **Learn the i18n localization engine**: [`src/i18n/index.ts`](file:///d:/Projects/Website/birthday-bloom/src/i18n/index.ts) and locale dictionaries (`en.ts`, `bn.ts`, `hi.ts`, `fr.ts`).

---

## 📁 Folder Structure

| Path | Purpose |
|---|---|
| `src/App.tsx` | Application shell: React Router, global error boundary, ambient effect canvas, Sonner toast notification provider. |
| `src/pages/Index.tsx` | Top-level 4-phase state machine (`splash` -> `unlock` -> `intro` -> `main`) with Framer Motion `AnimatePresence`. |
| `src/pages/NotFound.tsx` | SEO-optimized client-side 404 page with glassmorphic cards, theme palette, and discovery links. |
| `src/components/birthday/` | 30 cinematic, 3D WebGL, and interactive celebration components. |
| `src/components/ui/` | Design system primitives (`sonner.tsx`, `tooltip.tsx`). |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary with a cinematic fallback UI. |
| `src/features/core/store/` | `useBirthdayStore.ts` (Zustand store, env/URL parameter parsing) + `SuperPersonalizedLogic.ts`. |
| `src/features/core/models/` | `familyTemplates.ts` (14 member types, registry, factories). |
| `src/features/core/theme/` | `useDynamicTheme.ts` — computes and injects HSL/RGB CSS custom properties at runtime. |
| `src/features/core/seo/` | `useDynamicSEO.ts` — updates OpenGraph, Twitter Cards, canonical tags, and Schema.org `SocialEvent` structured data. |
| `src/features/cinematic-story/` | Narrative scenes and animation variants for the cinematic intro. |
| `src/i18n/` | Multi-language translation engine (`useTranslation()`) and locale dictionaries (`en`, `bn`, `hi`, `fr`). |
| `src/config/` | Audio assets fallback (`birthday.ts`), emotional letters (`templates.ts`), cultural presets (`bengaliTemplates.ts`, `hindiTemplates.ts`, `frenchTemplates.ts`). |
| `src/utils/` | `password.ts` (password validation and date hashing). |
| `src/hooks/` | Responsive and platform hooks (`use-mobile.tsx`). |
| `src/lib/` | Tailwind class merging utilities (`utils.ts`). |
| `src/test/` | Vitest test suites (unit, integration, stress, and challenge tests). |
| `public/` | Static assets (favicon, images, `llms.txt`, `site.webmanifest`, `robots.txt`, `sitemap.xml`). |
| `obsidian-docs/` | Comprehensive 32-note documentation vault. |

---

## 🧩 Component Responsibilities

| Component | File | What It Does | Gated By |
|---|---|---|---|
| `SplashScreen` | `SplashScreen.tsx` | Tap-to-start with heart progression and ambient bokeh. Triggers audio context awakening. | Always shown first |
| `PasswordUnlock` | `PasswordUnlock.tsx` | Frosted-glass passcode screen with shake animation, dynamic hints, and celebration bursts on success. | `isPasswordRequired()` / `VITE_PASSWORD_REQUIRED` |
| `CinematicIntro` | `CinematicIntro.tsx` | Multi-scene timeline: storytelling -> fake chat -> post-chat -> special message -> reveal. | Phase state machine |
| `MainBirthday` | `MainBirthday.tsx` | Main celebration stage: hero header, interest icons, emotional letter card, wishes grid, and interactive triggers. | Phase = "main" |
| `PhotoGallery` | `PhotoGallery.tsx` | 3D-tilt photo cards, auto-advance, lightbox with `AnimatePresence`. Localized placeholder if no photos. | `VITE_SHOW_PHOTO_SECTION` |
| `VideoGallery` | `VideoGallery.tsx` | Renders YouTube and MP4 videos. Returns null if no videos configured. | `VITE_SHOW_VIDEO_SECTION` |
| `CakeCutting` | `CakeCutting.tsx` | 9-phase state machine: select cake -> blow candles -> wish -> cut -> burst -> quotes. SVG/3D composite. | `VITE_SHOW_CAKE_SECTION` |
| `Cake3D` | `Cake3D.tsx` | Three.js / React Three Fiber procedural 3D WebGL cake model with dynamic slice physics. | Rendered inside `CakeCutting` |
| `CakeVisuals` | `CakeVisuals.tsx` | 2D Framer Motion celebration particle overlays (`CutSparks` and `MagicDust`). | Rendered inside `CakeCutting` |
| `CakeKnife` | `CakeKnife.tsx` | Interactive cursor-tracking knife and drag gesture controller. | Rendered inside `CakeCutting` |
| `BirthdayQuiz` | `BirthdayQuiz.tsx` | Interest-aware trivia with score tracking and confetti burst. | `VITE_SHOW_QUIZ_SECTION` |
| `HeartTree` | `HeartTree.tsx` | Interactive SVG tree with 5 growth stages, spark particles, and quote display leaves. | `VITE_SHOW_HEART_TREE_SECTION` |
| `ShareCelebrationModal` | `ShareCelebrationModal.tsx` | Modal dialog for sharing customized URLs across WhatsApp, X, Telegram, Facebook, and LinkedIn. | Triggered by user share button |
| `FinalSurprise` | `FinalSurprise.tsx` | Memory photo grid + optional final video embed and replay trigger. | `VITE_SHOW_FINAL_SURPRISE` |
| `FakeChatScene` | `FakeChatScene.tsx` | Simulates a live chat interface: types greeting, deletes it, and retypes a heartfelt message. | CinematicIntro sub-scene |
| `TypeWriter` | `TypeWriter.tsx` | Character-by-character typing with blinking cursor, audio sync, and optional onComplete callback. | Used across components |
| `KineticText` | `KineticText.tsx` | Animated kinetic text with float, pop-out, or zoom reveals. | Used across components |
| `HighlightedText` | `HighlightedText.tsx` | Shimmering text highlighter for emphasized phrases. | Used across components |
| `HeartProgression` | `HeartProgression.tsx` | SVG heart drawn in 4 stages with trail particles. | Used across components |
| `Balloons` | `Balloons.tsx` | Floating SVG balloons with relationship-aware colors and pop interaction. | Ambient layer |
| `Sparkles` | `Sparkles.tsx` | Star sparkles and floating orbs. | Ambient layer |
| `Confetti` | `Confetti.tsx` | `useConfetti` hook wrapping `canvas-confetti` with mobile-aware scaling. | Used across components |
| `SoundManager` | `SoundManager.tsx` | `AudioManager` singleton + `useSoundManager` hook. Handles BGM loop, volume, and sound effects. | Used across components |
| `FloatingElements` | `FloatingElements.tsx` | Emoji floating particles with parallax depth. | Ambient layer |
| `SparkleRain` | `SparkleRain.tsx` | Falling sparkle canvas particles (active in "main" phase). | Ambient layer |
| `FireflyEffect` | `FireflyEffect.tsx` | Golden firefly particles with organic movement (active in "main" phase). | Ambient layer |
| `ShootingStars` | `ShootingStars.tsx` | Shooting star streaks (active in "main" phase). | Ambient layer |
| `EmojiCursorTrail` | `EmojiCursorTrail.tsx` | Interactive emoji particle trail following cursor / touch position. | Ambient layer |
| `PremiumFireworks` | `PremiumFireworks.tsx` | HTML5 Canvas 2D celebratory fireworks engine. | Ambient layer |

---

## ⚡ Central State Flow

```
.env.local / URL Query Params -> useBirthdayStore (Zustand) -> components
                                                            -> useDynamicTheme (CSS vars)
                                                            -> useDynamicSEO (JSON-LD & Meta)
```

The Zustand store at [`src/features/core/store/useBirthdayStore.ts`](file:///d:/Projects/Website/birthday-bloom/src/features/core/store/useBirthdayStore.ts) exposes:
- `config`: full immutable `BirthdayConfig` object containing all 53 resolved configuration parameters.
- `getAnimationPacing()`: returns `'slow' | 'fast' | 'moderate'`.
- `getMood()`: returns `'romantic' | 'energetic' | 'warm'`.
- `getLanguage()`: returns `'en' | 'hi' | 'bn' | 'fr' | string`.

```typescript
interface BirthdayStore {
  config: BirthdayConfig;
  getAnimationPacing: () => 'slow' | 'fast' | 'moderate';
  getMood: () => 'romantic' | 'energetic' | 'warm';
  getLanguage: () => 'en' | 'hi' | 'bn' | 'fr' | string;
}
```

---

## 🛠️ Step-by-Step Contributor Walkthroughs

### 🌟 Walkthrough 1: How to Add a New Relationship Template

1. **Update the Relationship Union**:
   In `src/features/core/store/useBirthdayStore.ts`, add the new relationship identifier (e.g. `'godparent'`):
   ```typescript
   export type RelationshipType =
     | 'partner'
     | 'friend'
     | 'family'
     | 'sibling'
     | 'godparent' // [NEW]
     // ...
   ```
2. **Add Normalization**:
   In the raw string normalization switch inside `useBirthdayStore.ts`, add matching aliases:
   ```typescript
   case 'godparent':
   case 'godfather':
   case 'godmother':
     return 'godparent';
   ```
3. **Add Emotional Letter & Preset Data**:
   In `src/config/templates.ts`, add an entry to `EMOTIONAL_LETTERS` and `TEMPLATE_PRESETS`:
   ```typescript
   export const EMOTIONAL_LETTERS: Record<RelationshipType, string> = {
     // ...
     godparent: "To my wonderful Godparent, thank you for your unconditional guidance, love, and support...",
   };
   ```
4. **Test & Verify**:
   Run `npm test` and verify that `?rel=godparent` correctly loads the preset.

---

### 🌐 Walkthrough 2: How to Add a New Language Localization (i18n)

1. **Create the Locale Dictionary**:
   Create a new dictionary file in `src/i18n/locales/` (e.g. `es.ts` for Spanish):
   ```typescript
   export const es = {
     common: {
       happyBirthday: "¡Feliz Cumpleaños!",
       skipIntro: "Saltar Introducción",
       unlockMagic: "Desbloquear Magia",
       // ...
     },
     // ...
   };
   ```
2. **Register the Language in i18n Engine**:
   In `src/i18n/index.ts`, import `es`, add `'es'` to supported languages, and register translations.
3. **Add static hreflang Tag in `index.html`**:
   ```html
   <link rel="alternate" hreflang="es" href="https://birthday-bloom.vercel.app/?lang=es" />
   ```
4. **Run Verification**:
   Run `npm run verify` (`npm run typecheck && npm run lint && npm test && npm run build`).

---

### 🎂 Walkthrough 3: How to Add a Custom 3D Cake Design

1. **Define Cake Model Configuration**:
   In `src/components/birthday/CakeCutting.tsx`, add your new cake to `CAKE_OPTIONS`:
   ```typescript
   {
     id: 'matcha-zen',
     name: 'Matcha Blossom Zen',
     flavor: 'Japanese Ceremonial Matcha & White Chocolate',
     layers: 3,
     color: '#88B04B',
     icingColor: '#E8F5E9',
     config3D: {
       layers: [
         { color: '#88B04B', radius: 1.6, height: 0.8 },
         { color: '#A0C878', radius: 1.2, height: 0.7 },
         { color: '#D4E7C5', radius: 0.8, height: 0.6 },
       ],
       candleCount: 5,
       toppings: 'blossom',
     }
   }
   ```
2. **Update 3D Mesh Renderer in `Cake3D.tsx`**:
   Ensure materials and topping geometries in `src/components/birthday/Cake3D.tsx` handle your custom toppings.
3. **Verify 60fps WebGL Physics**:
   Test cake selection, candle blowing, and cutting slice animations in your local browser.

---

### ✨ Walkthrough 4: How to Add a Custom Canvas 2D Particle Effect

1. **Create the Particle Component**:
   In `src/components/birthday/`, create your canvas component (e.g. `FloatingLanterns.tsx`):
   ```typescript
   import React, { useEffect, useRef } from 'react';
   import { useIsMobile } from '@/hooks/use-mobile';

   export const FloatingLanterns: React.FC<{ count?: number }> = ({ count = 8 }) => {
     const canvasRef = useRef<HTMLCanvasElement>(null);
     const isMobile = useIsMobile();
     const actualCount = isMobile ? Math.ceil(count / 2) : count;

     useEffect(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const ctx = canvas.getContext('2d');
       if (!ctx) return;

       let animationFrameId: number;
       // ... initialize particles and render with requestAnimationFrame ...

       return () => cancelAnimationFrame(animationFrameId);
     }, [actualCount]);

     return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
   };
   ```
2. **Mount in `src/pages/Index.tsx`**:
   Render conditionally based on `phase` or configuration.
3. **Verify Performance**:
   Ensure zero frame drops and automatic cleanup on unmount.

---

## 🧪 Testing & Verification

We maintain strict zero-regression standards across all test suites:

```bash
# Run all vitest suites
npm test

# Run TypeScript typecheck without emitting files
npm run typecheck

# Run ESLint
npm run lint

# Unified CI/CD verification script
npm run verify
```

---

## 🔗 Related Documentation
- [[URL-Parameters|Zero-Config URL Parameters Reference]]
- [[Birthday-Components|30 Interactive Birthday Components Reference]]
- [[architecture|System Architecture & Rendering Pipeline]]
- [[env-configs|Environment Variables & Configuration Matrix]]

#obsidian #documentation #birthday-bloom #developer #guide