# Codebase Survey & Logic Analysis Report

**Explorer**: Explorer 2 (Source Code & Logic Survey)  
**Date**: 2026-08-18  
**Scope**: All source code files under `src/`, `pages/`, `components/`, `features/`, `config/`, `hooks/`, `lib/`, `services/`, `utils/`, `test/`, and root build/tooling files.

---

## 1. Executive Summary & Architecture Overview

The **Birthday Bloom** application is a React 18 + Vite 8 + Tailwind CSS + Framer Motion single-page web application featuring high-intensity animations, 3D Canvas rendering (Three.js / React Three Fiber), dynamic themes, interactive quizzes, photo/video galleries, and personalized birthday greetings driven by environment variables (`VITE_*`) and Zustand store state.

### Key Architectural Strengths
- **Rich Interactive Experience**: Multi-phased flow (`splash` -> `unlock` [optional] -> `intro` -> `main`), confetti, 3D interactive cake cutting, canvas-based fireworks, and dynamic background themes based on favorite colors and relationships.
- **Robust Audio Synthesis**: Global Web Audio / HTML5 audio orchestration (`SoundManager.tsx`) for keyboard typing, reveal sounds, pops, and background music.
- **Modern Build Pipeline**: Fast Vite 8 + Vitest test runner (all 3 unit test suites currently pass).

### Primary Survey Findings
1. **Extensive Dead Code & Orphaned Files**:
   - **8 Orphaned Birthday Components**: `DigitalRain.tsx`, `GlitchEffect.tsx`, `LiquidSwirl.tsx`, `ParticleBurst.tsx`, `RibbonEffect.tsx`, `TextRevealEffect.tsx`, `TunnelEffect.tsx`, `WaveEffect.tsx` are completely unrendered.
   - **47 Unused UI Boilerplate Components**: Out of 49 files in `src/components/ui/`, only `sonner.tsx` and `tooltip.tsx` are used in `App.tsx`. 47 shadcn/radix component files and dozens of associated `@radix-ui/*` packages in `package.json` are dead weight.
   - **Orphaned Services & Utilities**: `src/services/audioSystem.ts` (replaced by `SoundManager.tsx`) and `src/utils/responsiveUtils.ts` are 100% unused. `src/features/core/models/dataModels.ts` is only referenced in `config.example.ts`.
   - **Dead Code in Used Files**: Unused exports, functions, and state in `CakeVisuals.tsx` (`CakeSVG`), `MainBirthday.tsx` (multiple unused states, functions, imports), `HeartProgression.tsx` (unused Lucide icon imports), `templates.ts` (`COLOR_PALETTES`, `TEMPLATE_PRESETS`, `DEFAULT_CONFIG`, `MESSAGE_TEMPLATES`), `SuperPersonalizedLogic.ts` (`getInterestBasedTheme`), etc.
   - **Redundant Scripts & Debug Leftovers**: `test-crash.cjs` in root; duplicate `scripts/strip-comments.js` and `scripts/strip-comments.cjs`.

2. **Tooling & Build Diagnostics**:
   - **TypeScript Compatibility**: `npx tsc --noEmit` fails with TS5102 (`Option 'baseUrl' has been removed`) due to TypeScript 7.0 removal of `baseUrl`.
   - **ESLint Version Incompatibility**: `npm run lint` crashes on `@typescript-eslint/typescript-estree` (`TypeError: Cannot read properties of undefined (reading 'Cjs')`) due to incompatibility with `typescript@7.0.2`.
   - **Vite Build Warnings**: Vite warns about `__dirname` usage in `vite.config.ts` under native ESM loader.

3. **Runtime & Styling Bugs**:
   - **Invalid CSS Color Syntax in `useDynamicTheme.ts`**: Uses 4-argument comma syntax for `hsl()` (e.g. `hsl(${h}, ${s}%, ${l}%, 0.3)` and `hsl(${h}, 60%, 45%, 0.6)`), which is invalid CSS.
   - **Missing CSS Variable in `PhotoGallery.tsx`**: References `rgba(var(--color-primary-rgb),0.4)` which is never defined in theme CSS variables.
   - **Light Mode Theme Clash in `App.css`**: Media query `@media (prefers-color-scheme: light)` forces `body { background-color: #fff; color: #000; }`, severely breaking dark-theme cinematic contrast on light-mode OS settings.
   - **Production Information Leak in `ErrorBoundary.tsx`**: Prints full error message and stack trace in HTML view despite security comments.
   - **Vercel CSP Configuration Issue in `vercel.json`**: Restrictive `media-src 'self' data: blob:` and missing `frame-src` blocks Pixabay/SoundJay audio and YouTube embedded iframes.
   - **Non-deterministic `Math.random()` in React Render Bodies**: Components like `CelebrationOverlay.tsx`, `FireflyEffect.tsx`, `FloatingOrbs.tsx`, `ShootingStars.tsx`, `SparkleEffect.tsx`, and `SparkleRain.tsx` regenerate arrays or animate coordinates on every render.

---

## 2. Complete File-by-File Source Code Inventory

### 2.1 Root & Configuration Files

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `package.json` | Active | Defines dependencies and scripts | Heavy unneeded dependencies for unused Radix UI components; TypeScript 7.0 version conflicts with ESLint tooling |
| `package-lock.json` | Active | Dependency lockfile | Requires clean sync upon dependency pruning |
| `tsconfig.json` | Active | Root TypeScript configuration | `baseUrl: "."` causes error TS5102 in TypeScript 7.0 |
| `tsconfig.app.json` | Active | Application TS config | `baseUrl: "."` causes error TS5102 |
| `tsconfig.node.json` | Active | Vite config TS config | Configured cleanly for Node |
| `vite.config.ts` | Active | Vite build configuration | `path.resolve(__dirname, "./src")` generates Vite deprecation warning |
| `vitest.config.ts` | Active | Test runner configuration | Alias setup using `__dirname` |
| `tailwind.config.ts` | Active | Tailwind styling config | Configured with colors and animations |
| `postcss.config.js` | Active | PostCSS configuration | Standard Tailwind + Autoprefixer setup |
| `eslint.config.js` | Active | ESLint flat config | Crashes during `npm run lint` due to typescript-eslint vs typescript 7.0 issue |
| `vercel.json` | Active | Vercel deployment & CSP headers | CSP header blocks external BGM/SFX audio URLs and YouTube iframe embeds |
| `components.json` | Active | shadcn component config | Boilerplate configuration |
| `index.html` | Active | Application HTML entrypoint | Clean HTML with SEO metadata |
| `test-crash.cjs` | **DEAD** | Puppeteer crash diagnostic script | Scratch debug file left in root directory |
| `scripts/strip-comments.js` | Active | Comment stripping utility | Identical duplicate of `strip-comments.cjs` |
| `scripts/strip-comments.cjs` | **DEAD** | Comment stripping utility | Duplicate of `strip-comments.js` |
| `scripts/obsidian-migration.mjs` | Active | Docs migration script | Documentation automation utility |

---

### 2.2 Application Root (`src/`)

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `src/main.tsx` | Active | React application entry point | Contains `GlobalErrorBoundary` wrapper around `<App />` |
| `src/main.test.tsx` | Active | Vitest test for root element render | Test passes (8ms) |
| `src/App.tsx` | Active | Top-level routing & layout wrappers | Imports `Sonner`, `TooltipProvider`, `SparkleEffect`, `CelebrationOverlay`, `PartyElements`, `ErrorBoundary` |
| `src/App.css` | Active | Global CSS styles & animations | Light mode media query forces white background; `prefers-reduced-motion` `!important` 0.01ms conflicts with transitions |
| `src/index.css` | Active | Tailwind directives & custom keyframes | Comprehensive animations |
| `src/config.ts` | Active | Default config fallback | Small default config object with name and fallback photos |
| `src/config.example.ts` | **DEAD** | Example configuration file | 101 lines of unused example profiles and test validators; never imported in production app |
| `src/vite-env.d.ts` | Active | Vite client type declarations | Standard Vite client types |

---

### 2.3 Components - Root (`src/components/`)

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `src/components/ErrorBoundary.tsx` | Active | React component error boundary | Unused `import { motion } from "framer-motion"`; renders error message and stack trace directly in DOM |
| `src/components/NavLink.tsx` | **DEAD** | Router NavLink wrapper | 100% UNUSED anywhere in the codebase |

---

### 2.4 Components - Birthday (`src/components/birthday/` - 43 Files)

| File Path | Status | Rendered In | Issues / Findings |
|---|---|---|---|
| `AnimatedGradient.tsx` | Active | `Index.tsx` | Unused property `rotation` in interface and objects |
| `Balloons.tsx` | Active | `MainBirthday.tsx`, `CinematicIntro.tsx` | Clean SVG balloon rise animation |
| `BirthdayQuiz.tsx` | Active | `MainBirthday.tsx` | Unused destructured variable `gender` from config; unhandled unmount timeout |
| `Cake3D.tsx` | Active | `CakeCutting.tsx` | Creates new `THREE.MeshStandardMaterial` and `THREE.CylinderGeometry` inside render body without `useMemo` (Three.js memory allocation on re-renders) |
| `CakeCutting.tsx` | Active | `MainBirthday.tsx` | Unused imports `Flame`, `Sparkles` from lucide-react; unused state `candlesLit`; unused destructured `fireCannon`; unused variable `cakeSpring` |
| `CakeKnife.tsx` | Active | `CakeCutting.tsx` | Smooth SVG knife animation |
| `CakeTypes.ts` | Active | `CakeCutting.tsx`, `Cake3D.tsx`, etc. | Clean type declarations and cake flavor data |
| `CakeVisuals.tsx` | Active | `CakeCutting.tsx` | `CakeSVG` export is 100% UNUSED dead code; unused parameters `split`, `name`, `springConfig` |
| `CelebrationOverlay.tsx` | Active | `App.tsx` | Non-deterministic `Math.random()` in `animate` prop causes visual jitter on re-render |
| `CinematicIntro.tsx` | Active | `Index.tsx` | Unused state `heartStage` (`setHeartStage` called but `heartStage` never read); `storyLineStyles` array has 4 items while lines can exceed 4 |
| `Confetti.tsx` | Active | Multiple files | `firePop` returned from `useConfetti()` but only used in `PartyElements.tsx` |
| `DigitalRain.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `EmojiCursorTrail.tsx` | Active | `Index.tsx` | Interactive mouse/touch trail |
| `EnhancedFloatingElements.tsx` | Active | `Index.tsx` | `Math.random()` inside `animate` prop |
| `FakeChatScene.tsx` | Active | `CinematicIntro.tsx` | Clean typing/deleting animated messaging interface |
| `FinalSurprise.tsx` | Active | `MainBirthday.tsx` | Unused import `AnimatePresence`; unused destructured `playReveal`, `playBoom`; unused state `revealed` |
| `FireflyEffect.tsx` | Active | `Index.tsx` | Unused dead import in `MainBirthday.tsx`; array regenerated on every render |
| `FloatingElements.tsx` | Active | `Index.tsx` | Parallax scroll elements |
| `FloatingOrbs.tsx` | Active | `Index.tsx` | Unused dead import in `MainBirthday.tsx`; array regenerated on every render |
| `GlitchEffect.tsx` | **DEAD** | None | 100% UNUSED orphaned component (only imported as dead import in `MainBirthday.tsx`) |
| `HeartProgression.tsx` | Active | `MainBirthday.tsx`, `CinematicIntro.tsx`, `SplashScreen.tsx` | Unused imports `Snowflake`, `Heart`, `Sparkles`, `Star` from lucide-react |
| `HeartTree.tsx` | Active | `MainBirthday.tsx` | Interactive SVG animated tree with hearts and message popups |
| `KineticText.tsx` | Active | `CakeCutting.tsx`, `CinematicIntro.tsx` | Unused state `done` |
| `LiquidSwirl.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `MainBirthday.tsx` | Active | `Index.tsx` | Multiple dead imports (`FireflyEffect`, `FloatingOrbs`, `ShootingStars`, `GlitchEffect`); unused states `heroRevealed`, `showName`, `showEmojis`; unused destructured `playWhoosh`; unused function `scrollToCake`; unused memo `activeInterests`; unused variable `heroMotionStyle` |
| `MorphingElements.tsx` | Active | `Index.tsx` | Background blur morphing shapes |
| `ParticleBurst.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `PartyElements.tsx` | Active | `App.tsx` | `Math.random()` in transition props |
| `PasswordUnlock.tsx` | Active | `Index.tsx` | Passcode entry screen |
| `PhotoGallery.tsx` | Active | `MainBirthday.tsx` | Unused import `useRef`; references undefined CSS variable `rgba(var(--color-primary-rgb),0.4)` |
| `PremiumFireworks.tsx` | Active | `Index.tsx` | Canvas-based fireworks particle system |
| `RibbonEffect.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `ShootingStars.tsx` | Active | `Index.tsx` | Unused dead import in `MainBirthday.tsx`; array regenerated on every render |
| `SoundManager.tsx` | Active | Multiple files | Unused field `audioCache`; unmemoized Audio allocation in `playEffect`; empty `useEffect` hook |
| `SparkleEffect.tsx` | Active | `App.tsx` | Heavy unmemoized `Math.random()` in map in render body |
| `SparkleRain.tsx` | Active | `Index.tsx` | Unmemoized array and `Math.random()` in animate |
| `Sparkles.tsx` | Active | `CinematicIntro.tsx`, `MainBirthday.tsx` | Animated SVG sparkles |
| `SplashScreen.tsx` | Active | `Index.tsx` | Initial tap-to-start screen |
| `TextRevealEffect.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `TunnelEffect.tsx` | **DEAD** | None | 100% UNUSED orphaned component |
| `TypeWriter.tsx` | Active | Multiple files | Animated typewriter text component |
| `VideoGallery.tsx` | Active | `MainBirthday.tsx` | YouTube & video file embeds |
| `WaveEffect.tsx` | **DEAD** | None | 100% UNUSED orphaned component |

---

### 2.5 Components - UI (`src/components/ui/` - 49 Files)

| File Path | Status | Used In Project? | Note |
|---|---|---|---|
| `sonner.tsx` | **Active** | `src/App.tsx` | Used for toast notifications |
| `tooltip.tsx` | **Active** | `src/App.tsx` | `TooltipProvider` used in App root |
| *All 47 other UI files* | **DEAD** | None | Unused boilerplate (`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle-group`, `toggle`, `use-toast`) |

---

### 2.6 Config (`src/config/` - 3 Files)

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `birthday.ts` | Active | Environment asset resolvers | `BIRTHDAY_NAME` is exported but 100% UNUSED |
| `emojiKits.ts` | Active | Emoji presets per relationship type | Actively used in floating elements and cursor trails |
| `templates.ts` | Active | Emotional letters & quotes | `EMOTIONAL_LETTERS` & `SPECIAL_QUOTES` used; `COLOR_PALETTES`, `TEMPLATE_PRESETS`, `DEFAULT_CONFIG`, `MESSAGE_TEMPLATES` are 100% UNUSED dead code |

---

### 2.7 Features (`src/features/` - 8 Files)

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `cinematic-story/animations/dynamicVariants.ts` | Active | Framer Motion variant generator | Used in `SpecialMessage.tsx` |
| `cinematic-story/scenes/SpecialMessage.tsx` | Active | Animated special message scene | Used in `CinematicIntro.tsx` |
| `core/models/dataModels.ts` | **DEAD** | Data validation classes & types | 339 lines; only imported in `config.example.ts` |
| `core/models/familyTemplates.ts` | Active | Family template definitions | Used in `useBirthdayStore.ts` and test suite |
| `core/models/familyTemplates.test.ts` | Active | Vitest test suite | 5 unit tests all passing |
| `core/store/SuperPersonalizedLogic.ts` | Active | Letter generator & big wishes | `getInterestBasedTheme` is 100% UNUSED; unused `interests` parameter in `getHighlySpecificLetter` |
| `core/store/useBirthdayStore.ts` | Active | Zustand global configuration store | `isConfigured`, `setConfig`, `completeConfiguration` are never called; type mismatch on `animationSpeed` (`null` vs `undefined`) |
| `core/theme/useDynamicTheme.ts` | Active | CSS variable theme manager | Invalid CSS HSL color syntax (`hsl(h, s%, l%, alpha)` with 4 comma-separated arguments) |

---

### 2.8 Hooks, Lib, Pages, Services, Test & Utils

| File Path | Status | Purpose | Issues / Findings |
|---|---|---|---|
| `src/hooks/use-mobile.tsx` | Active | Mobile screen breakpoint hook | Actively used across components |
| `src/hooks/use-toast.ts` | **DEAD** | shadcn toast hook | 100% UNUSED (only imported by dead `toaster.tsx` and `components/ui/use-toast.ts`) |
| `src/lib/utils.ts` | Active | `cn` utility (`clsx` + `tailwind-merge`) | Actively used |
| `src/pages/Index.tsx` | Active | Main orchestrator page | Handles phase transitions |
| `src/pages/NotFound.tsx` | Active | 404 error page | Uses raw `<a href="/">` causing full page reload instead of `<Link to="/">` |
| `src/services/audioSystem.ts` | **DEAD** | Legacy HTMLAudio service | 141 lines; 100% UNUSED (replaced by `SoundManager.tsx`); `AUDIO_PRESETS` and `FUTURE_AUDIO_FEATURES` unused |
| `src/test/example.test.ts` | Active | Vitest sanity test | Passes |
| `src/test/setup.ts` | Active | Vitest DOM setup & mocks | Mocks `window.matchMedia` |
| `src/utils/password.ts` | Active | Birthday date password generator | Used in `PasswordUnlock.tsx` and `Index.tsx` |
| `src/utils/responsiveUtils.ts` | **DEAD** | Responsive breakpoint helper utilities | 143 lines; 100% UNUSED |

---

## 3. Dead Code & Orphaned Files Catalog

### 3.1 Completely Orphaned / Unused Files (100% Dead)

1. `src/components/birthday/DigitalRain.tsx` (Unreferenced)
2. `src/components/birthday/GlitchEffect.tsx` (Only unreferenced import in `MainBirthday.tsx`)
3. `src/components/birthday/LiquidSwirl.tsx` (Unreferenced)
4. `src/components/birthday/ParticleBurst.tsx` (Unreferenced)
5. `src/components/birthday/RibbonEffect.tsx` (Unreferenced)
6. `src/components/birthday/TextRevealEffect.tsx` (Unreferenced)
7. `src/components/birthday/TunnelEffect.tsx` (Unreferenced)
8. `src/components/birthday/WaveEffect.tsx` (Unreferenced)
9. `src/components/NavLink.tsx` (Unreferenced)
10. `src/services/audioSystem.ts` (Unreferenced legacy service)
11. `src/utils/responsiveUtils.ts` (Unreferenced legacy utility)
12. `src/hooks/use-toast.ts` (Unreferenced)
13. `src/features/core/models/dataModels.ts` (Only imported in `config.example.ts`)
14. `src/config.example.ts` (Unreferenced example file)
15. `test-crash.cjs` (Root scratch file)
16. `scripts/strip-comments.cjs` (Duplicate of `strip-comments.js`)
17. **47 UI component files** in `src/components/ui/` (excluding `sonner.tsx` and `tooltip.tsx`)

### 3.2 Dead Exports & Unused Code in Active Files

- **`src/components/birthday/CakeVisuals.tsx`**: `CakeSVG` component (lines 73–118) is completely unused; has unused params `split`, `name`, `springConfig`.
- **`src/components/birthday/MainBirthday.tsx`**:
  - Unused imports: `FireflyEffect`, `FloatingOrbs`, `ShootingStars`, `GlitchEffect` (lines 13–15, 18).
  - Unused state: `heroRevealed` (line 35), `showName` (line 36), `showEmojis` (line 37).
  - Unused destructured helper: `playWhoosh` (line 48).
  - Unused function: `scrollToCake` (lines 156–161).
  - Unused memoized variable: `activeInterests` (lines 179–181).
  - Unused motion style: `heroMotionStyle` (line 190).
- **`src/components/birthday/CakeCutting.tsx`**:
  - Unused imports: `Flame`, `Sparkles` from `lucide-react` (line 3).
  - Unused state: `candlesLit` (line 70).
  - Unused destructured helper: `fireCannon` (line 74).
  - Unused spring config: `cakeSpring` (line 202).
- **`src/components/birthday/CinematicIntro.tsx`**:
  - Unused state: `heartStage` (line 33).
- **`src/components/birthday/FinalSurprise.tsx`**:
  - Unused import: `AnimatePresence` from `framer-motion` (line 1).
  - Unused destructured helpers: `playReveal`, `playBoom` (line 9).
  - Unused state: `revealed` (line 10).
- **`src/components/birthday/HeartProgression.tsx`**:
  - Unused imports: `Snowflake`, `Heart`, `Sparkles`, `Star` from `lucide-react` (line 2).
- **`src/components/birthday/KineticText.tsx`**:
  - Unused state: `done` (line 13).
- **`src/components/birthday/PhotoGallery.tsx`**:
  - Unused import: `useRef` from `react` (line 1).
- **`src/components/birthday/SoundManager.tsx`**:
  - Unused field: `audioCache` (line 13).
  - Empty `useEffect` hook (lines 79–82).
- **`src/components/ErrorBoundary.tsx`**:
  - Unused import: `motion` from `framer-motion` (line 2).
- **`src/config/birthday.ts`**:
  - Unused export: `BIRTHDAY_NAME` (line 15).
- **`src/config/templates.ts`**:
  - Unused exports: `COLOR_PALETTES` (lines 289–332), `TEMPLATE_PRESETS` (lines 204–265), `DEFAULT_CONFIG` (lines 266–288), `MESSAGE_TEMPLATES` (lines 333–344).
- **`src/features/core/store/SuperPersonalizedLogic.ts`**:
  - Unused export: `getInterestBasedTheme` (lines 31–40).
  - Unused parameter: `interests` in `getHighlySpecificLetter` (line 3).
- **`src/features/core/store/useBirthdayStore.ts`**:
  - Unused store members: `isConfigured` (line 44), `setConfig` (line 45), `completeConfiguration` (line 46).

---

## 4. Bugs, Logic Errors & Runtime Exceptions

### Bug 1: Invalid CSS Color Syntax in `useDynamicTheme.ts`
- **Location**: `src/features/core/theme/useDynamicTheme.ts`, lines 46, 49, 58, 67.
- **Code**:
  ```ts
  root.style.setProperty('--color-primary-glow', `hsl(${h}, ${s}%, ${l}%, 0.3)`);
  root.style.setProperty('--glow-effect', `0 0 50px hsl(${h}, 60%, 45%, 0.6)`);
  ```
- **Error**: In standard CSS, `hsl(h, s%, l%, alpha)` with 4 comma-separated values is invalid. The modern CSS Color 4 syntax is `hsl(h s% l% / alpha)` or legacy `hsla(h, s%, l%, alpha)`. Modern browsers will ignore invalid HSL values, causing glow effects and background gradients to fail silently.
- **Fix**: Use `hsla(${h}, ${s}%, ${l}%, 0.3)` or `hsl(${h} ${s}% ${l}% / 0.3)`.

### Bug 2: Missing CSS Variable in `PhotoGallery.tsx`
- **Location**: `src/components/birthday/PhotoGallery.tsx`, line 149.
- **Code**: `shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.4)]`
- **Error**: `--color-primary-rgb` is never declared or set in `useDynamicTheme.ts` or `index.css`. This results in `rgba(undefined, 0.4)` which is invalid CSS and causes the active thumbnail box shadow to fail.
- **Fix**: Set `--color-primary-rgb` in `useDynamicTheme.ts` (e.g. `${r}, ${g}, ${b}`) or use `var(--color-primary)` with standard opacity.

### Bug 3: Light-Mode Media Query Breaking Dark Aesthetic
- **Location**: `src/App.css`, lines 204–209.
- **Code**:
  ```css
  @media (prefers-color-scheme: light) {
    body {
      background-color: #fff;
      color: #000;
    }
  }
  ```
- **Error**: If an end-user has Light Mode enabled in Windows or their browser, the body background overrides to `#fff` and text to `#000`. However, the app components are designed for a dark cinematic backdrop (white text with glowing transparent cards). White text becomes unreadable against the white background.
- **Fix**: Remove the `@media (prefers-color-scheme: light)` override, or lock `body` background to dark theme palette.

### Bug 4: Vercel CSP Blocking Audio and Video
- **Location**: `vercel.json`, line 34.
- **Code**:
  `"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com; media-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"`
- **Error**:
  1. `media-src 'self' data: blob:` blocks all BGM and SFX loaded from `https://cdn.pixabay.com` and `https://www.soundjay.com`.
  2. Missing `frame-src` blocks all YouTube iframe embeds in `VideoGallery.tsx` and `FinalSurprise.tsx`.
  3. `img-src` blocks photo URLs from any CDN other than `images.unsplash.com`.
- **Fix**: Add `https://cdn.pixabay.com https://www.soundjay.com` to `media-src`, add `frame-src 'self' https://www.youtube.com https://youtube.com`, and broaden `img-src https:`.

### Bug 5: Error Boundary Exposes Stack Traces in UI
- **Location**: `src/components/ErrorBoundary.tsx`, lines 31–35; `src/main.tsx`, lines 15–16.
- **Code**:
  ```tsx
  <div className="bg-black/50 p-4 rounded text-left overflow-auto mb-6 text-red-400 font-mono text-sm max-h-[300px]">
    {this.state.error && this.state.error.toString()}
    <br/><br/>
    {this.state.error && this.state.error.stack}
  </div>
  ```
- **Error**: Line 24 explicitly notes `"Never leak internal error details to end users in production"`, yet the component displays raw error stack traces to users.
- **Fix**: Gate error stack trace behind `import.meta.env.DEV`.

### Bug 6: Navigation in `NotFound.tsx` Uses Hard Reload
- **Location**: `src/pages/NotFound.tsx`, line 12.
- **Code**: `<a href="/" className="...">Return to Home</a>`
- **Error**: Uses regular `<a>` tag instead of React Router `<Link to="/">`, forcing a full browser reload and re-initializing the entire React app.
- **Fix**: Replace with `<Link to="/">Return to Home</Link>`.

---

## 5. Performance, Memory Leaks & Styling Issues

### Issue 1: Three.js Geometry & Material Allocation in Render Loop
- **Location**: `src/components/birthday/Cake3D.tsx`, line 92.
- **Code**:
  ```tsx
  <Instances range={sprinkleData.length} material={new THREE.MeshStandardMaterial({ color: accent, roughness: 0.2 })} geometry={new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8)}>
  ```
- **Impact**: Instantiating `new THREE.MeshStandardMaterial` and `new THREE.CylinderGeometry` inside JSX without `useMemo` creates new WebGL resources on every re-render and can cause GPU memory leaks in Three.js scenes.
- **Fix**: Wrap material and geometry instantiation in `useMemo`.

### Issue 2: Unmemoized Random Arrays in Render Bodies
- **Locations**:
  - `src/components/birthday/SparkleEffect.tsx` (line 5)
  - `src/components/birthday/FireflyEffect.tsx` (line 11)
  - `src/components/birthday/FloatingOrbs.tsx` (line 12)
  - `src/components/birthday/ShootingStars.tsx` (line 11)
  - `src/components/birthday/SparkleRain.tsx` (line 11)
  - `src/components/birthday/SplashScreen.tsx` (line 35)
- **Impact**: `Array.from` with `Math.random()` executed directly in component body causes DOM elements to be assigned new positions, durations, and keys on every render cycle, triggering unnecessary layout recalculations and animation glitches.
- **Fix**: Wrap particle array generation in `useMemo(() => ..., [intensity/count])`.

### Issue 3: Unbounded Audio Element Creation in `SoundManager.tsx`
- **Location**: `src/components/birthday/SoundManager.tsx`, line 62.
- **Code**: `const audio = new Audio(AUDIO_URLS[type]);` inside `playEffect`.
- **Impact**: Rapid sound triggers (such as typewriter key clicks or confetti bursts) create dozens of unmanaged `HTMLAudioElement` DOM instances.
- **Fix**: Preload and reuse audio instances in a pooled `audioCache` map.

---

## 6. Type Issues, Linting Failures & Build Tooling

### Diagnostics Summary

1. **`npx tsc --noEmit` Output**:
   ```
   tsconfig.json(5,5): error TS5102: Option 'baseUrl' has been removed. Please remove it from your configuration.
     Use '"paths": {"*": ["./*"]}' instead.
   ```
   - **Root Cause**: `package.json` installs `typescript@7.0.2`. In TypeScript 7.0+, `baseUrl` is deprecated and removed when `paths` can be configured directly.
   - **Resolution**: Remove `"baseUrl": "."` from `tsconfig.json` and `tsconfig.app.json` or align path mapping.

2. **`npm run lint` Output**:
   ```
   ESLint: 10.8.1
   TypeError: Cannot read properties of undefined (reading 'Cjs')
       at Object.<anonymous> (create-program\shared.js:59:18)
   ```
   - **Root Cause**: Incompatibility between `typescript@7.0.2` and `typescript-eslint@8.63.0` (which accesses internal TypeScript APIs like `ts.ModuleKind.Cjs` that changed in TypeScript 7).
   - **Resolution**: Align `typescript` version to stable `~5.7.3` / `~5.8.0` compatible with `typescript-eslint@8` or update `typescript-eslint` once TS 7 is officially supported.

3. **`npm run build` Output**:
   - Production bundle builds cleanly in ~1.5s.
   - Vite produces a deprecation warning: `__dirname (vite.config.ts:42:25). Use import.meta.dirname instead`.
   - Chunk distribution: `three.js` (918 kB), `radix-ui.js` (177 kB), `framer-motion.js` (141 kB), `index.js` (170 kB). Removing unused `@radix-ui/*` packages will significantly shrink `radix-ui.js` chunk size.

---

## 7. Actionable Recommendations for Milestone 2 (Systematic Audit & Cleanup)

1. **Phase 1: Tooling & TS/Lint Fixes**
   - Fix `tsconfig.json` and `tsconfig.app.json` by removing deprecated `baseUrl` or stabilizing TypeScript version.
   - Fix `vite.config.ts` and `vitest.config.ts` path aliases to use `import.meta.dirname` or `fileURLToPath(new URL('./src', import.meta.url))`.
   - Ensure `npm run lint` and `npx tsc --noEmit` pass with zero errors and zero warnings.

2. **Phase 2: Orphaned File Removal**
   - Delete the 8 unused birthday components: `DigitalRain.tsx`, `GlitchEffect.tsx`, `LiquidSwirl.tsx`, `ParticleBurst.tsx`, `RibbonEffect.tsx`, `TextRevealEffect.tsx`, `TunnelEffect.tsx`, `WaveEffect.tsx`.
   - Delete unused root/lib files: `src/components/NavLink.tsx`, `src/services/audioSystem.ts`, `src/utils/responsiveUtils.ts`, `src/features/core/models/dataModels.ts`, `src/config.example.ts`, `test-crash.cjs`, `scripts/strip-comments.cjs`.
   - Delete the 47 unused `src/components/ui/*.tsx` files (retaining only `sonner.tsx` and `tooltip.tsx`), and delete `src/hooks/use-toast.ts`.
   - Prune unused `@radix-ui/*` and other dead dependencies from `package.json`.

3. **Phase 3: Dead Code & Unused Exports Cleanup in Active Files**
   - Clean dead imports and unused variables from `MainBirthday.tsx`, `CakeCutting.tsx`, `CakeVisuals.tsx`, `CinematicIntro.tsx`, `FinalSurprise.tsx`, `HeartProgression.tsx`, `templates.ts`, `SuperPersonalizedLogic.ts`, `SoundManager.tsx`, and `useBirthdayStore.ts`.

4. **Phase 4: Bug Fixes & Performance Optimization**
   - Fix invalid `hsl(h, s%, l%, alpha)` color syntax in `useDynamicTheme.ts`.
   - Fix missing `--color-primary-rgb` in `PhotoGallery.tsx`.
   - Remove disruptive `@media (prefers-color-scheme: light)` rule from `App.css`.
   - Update `vercel.json` CSP headers to allow required media CDNs (Pixabay, SoundJay) and YouTube iframes.
   - Memoize particle arrays and Three.js materials/geometries to eliminate render-time allocations and memory leaks.
   - Update `NotFound.tsx` to use `<Link to="/">`.
