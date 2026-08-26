---
tags: [architecture, system, state-machine, fsm]
aliases: [architecture]
---

# System Architecture & Finite State Machine

Birthday Bloom operates as an **environment-driven interactive state machine**. This document details the runtime orchestration, scene lifecycle, state flow, and component layers.

---

## 1. Runtime State Machine

The top-level experience in `src/pages/Index.tsx` coordinates 4 sequential phases:

```
[splash] ──(Tap to Start)──► [unlock] ──(Passcode / Auto)──► [intro] ──(Storyline / Skip)──► [main]
```

| Phase | Component | Trigger to Next Phase |
|---|---|---|
| `splash` | `SplashScreen.tsx` | User tap/click initializes Web Audio context and triggers transition to `unlock` (or `intro`). |
| `unlock` | `PasswordUnlock.tsx` | Correct passcode entry or bypass (if `VITE_PASSWORD_REQUIRED=false` and no passcode). |
| `intro` | `CinematicIntro.tsx` | Storyline sequence completion or "Skip Intro" click triggers transition to `main`. |
| `main` | `MainBirthday.tsx` | Celebration dashboard (hero, cake cutting, quiz, heart tree, photo/video galleries, finale). |

---

## 2. Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Presentation Layer                   │
│  (React 18 + Framer Motion + Tailwind CSS + Lucide Icons)   │
├─────────────────────────────────────────────────────────────┤
│                    3D & Canvas Physics                      │
│     - Three.js / React Three Fiber / Drei / React Spring    │
│     - HTML5 Canvas 2D Fireworks (PremiumFireworks.tsx)      │
│     - Canvas Confetti Engine (Confetti.tsx)                 │
├─────────────────────────────────────────────────────────────┤
│                    Audio & Sensory Engine                   │
│     - SoundManager.tsx (Singleton Web Audio Manager)        │
│     - Mobile Haptic Vibration Triggers                      │
├─────────────────────────────────────────────────────────────┤
│                 Internationalization (i18n)                 │
│     - useTranslation Hook + Fallback Engine                 │
│     - 4 Culturally Authentic Locales (EN, BN, HI, FR)       │
├─────────────────────────────────────────────────────────────┤
│                  State & Reactive Theming                   │
│     - Zustand Store (useBirthdayStore.ts)                   │
│     - Dynamic CSS Variable Injection (useDynamicTheme.ts)   │
│     - Dynamic SEO & Structured Data (useDynamicSEO.ts)      │
├─────────────────────────────────────────────────────────────┤
│                     Data & Models Layer                     │
│     - Family Member Profiles (familyTemplates.ts)           │
│     - Templates, Letters & Quotes (templates.ts, i18n)      │
├─────────────────────────────────────────────────────────────┤
│                 Environment Configuration                   │
│     - 53 Variables & Aliases from import.meta.env           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Specifications

### Models Layer — `src/features/core/models/familyTemplates.ts`
- Base `FamilyMemberProfile` schema + 14 specialized member archetypes (`brother`, `sister`, `father`, `mother`, `grandfather`, `grandmother`, `uncle`, `aunt`, `cousin`, `son`, `daughter`, `guardian`, `friend`, `custom`) with typed factory functions.
- Uses `FAMILY_TEMPLATE_REGISTRY` for scalable type mapping and metadata resolution.

### State & Env Parsing Layer — `src/features/core/store/useBirthdayStore.ts`
- Parses, sanitizes, and type-coerces all 53 environment variables, URL query parameters, and aliases.
- Computes reactive animation pacing (`slow`, `moderate`, `fast`), mood (`romantic`, `energetic`, `warm`), and language (`en`, `bn`, `hi`, `fr`).
- Exposes `config` to all celebration components.

### Audio Subsystem — `src/components/birthday/SoundManager.tsx`
- Singleton `AudioManager` manages:
  - Background music loop with smooth volume fade-in and fade-out.
  - Interactive sound effects: `typeClick` (`playType`), `whoosh` (`playWhoosh`), `reveal` (`playReveal`), `pop` (`playPop`), `boom` (`playBoom`).
  - Autoplay fallback handlers on first user gesture.

### Responsive & Device Adaptation
- `src/hooks/use-mobile.tsx` provides reactive viewport breakpoint detection.
- CSS responsive classes and dynamic viewport height (`100dvh`) ensure edge-to-edge mobile compatibility without layout jumping.
- Reduced motion mode (`VITE_REDUCED_MOTION` / `prefers-reduced-motion`) disables heavy spring animations and scales down particle systems.

---

## 4. Directory Structure

| Path | Purpose |
|---|---|
| `src/App.tsx` | App shell: router, global error boundary, ambient effects, toaster |
| `src/pages/Index.tsx` | 4-phase state machine (`splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`) |
| `src/pages/NotFound.tsx` | SEO-friendly client-side 404 handler with theme palette and discovery links |
| `src/components/birthday/` | 30 active cinematic, narrative, and sensory celebration components |
| `src/components/ui/` | Design system primitives (`sonner.tsx`, `tooltip.tsx`) |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary with cinematic fallback UI |
| `src/features/core/store/` | `useBirthdayStore.ts` (Zustand store, env parsing) + `SuperPersonalizedLogic.ts` |
| `src/features/core/models/` | `familyTemplates.ts` (14 member archetypes, registry, factories) |
| `src/features/core/theme/` | `useDynamicTheme.ts` (dynamic CSS variable tokens injection) |
| `src/features/core/seo/` | `useDynamicSEO.ts` (JSON-LD structured data and dynamic meta tags) |
| `src/features/cinematic-story/` | Narrative intro scenes and animation variants |
| `src/i18n/` | Multi-language translation engine & locale dictionaries (`en.ts`, `bn.ts`, `hi.ts`, `fr.ts`) |
| `src/config/` | Audio assets (`birthday.ts`), emotional letters (`templates.ts`), cultural presets |
| `src/utils/` | Password utilities (`password.ts`) |
| `src/hooks/` | Responsive hooks (`use-mobile.tsx`) |
| `src/lib/` | Tailwind class merging utilities (`utils.ts`) |
| `src/test/` | Vitest unit, integration, stress, and challenge test suites |
| `public/` | Static assets, web manifest, `robots.txt`, `sitemap.xml`, `llms.txt` |
| `obsidian-docs/` | Comprehensive 32-note technical documentation vault |

---

## 5. Error Handling & Reliability

- The `ErrorBoundary` at `src/components/ErrorBoundary.tsx` catches runtime rendering errors and displays a cinematic recovery UI without leaking internal stack traces in production.
- All asynchronous timer chains in `CinematicIntro.tsx` are managed through `timersRef` and automatically cleaned up on unmount.
- Missing media assets fall back to built-in placeholders (`PhotoGallery` multi-language card, default audio soundtrack).

---

#obsidian #documentation #birthday-bloom #vault #architecture