# 🏛️ Birthday Bloom Architecture

Birthday Bloom is a **Cinematic Finite State Machine (CFSM)** — a React application designed for high-performance visual storytelling with env-driven personalization.

---

## Core Data Flow

```
.env.local
  → import.meta.env (Vite)
  → useBirthdayStore (Zustand) — parses, normalizes, validates
    → useDynamicTheme — injects HSL CSS custom properties into :root
    → Birthday components — read config from store
```

---

## Layer Architecture

### 1. Data Layer — `src/features/core/store/useBirthdayStore.ts`

The Zustand store is the single source of truth. At module load time, it parses every `VITE_*` environment variable using robust helpers:

- `parseEnvString()` — rejects `"undefined"`, `"null"`, empty strings
- `parseEnvBoolean()` — accepts `true/false/1/0/yes/no/on/off`
- `parseEnvNumber()` — safe integer parsing with null fallback
- `parseEnvList()` — splits on `,`, `|`, or newline; also handles JSON arrays
- `parseEnvJson()` — for `VITE_FAMILY_PROFILE_JSON`

The store exposes:
- `config` — full `BirthdayConfig` object
- `isConfigured` — whether `VITE_BIRTHDAY_NAME` is set
- `setConfig()` — partial runtime update
- `getAnimationPacing()` — derives `'slow' | 'moderate' | 'fast'` from relationship or `VITE_ANIMATION_SPEED`
- `getMood()` — derives `'romantic' | 'energetic' | 'warm'` from relationship

**Relationship normalization**: The raw env string is checked against a series of `.includes()` patterns. For example, `"partner"` or `"love"` → `partner`; `"brother"` → `brother`. Unknown values fall back to `family`.

### 2. Theme Layer — `src/features/core/theme/useDynamicTheme.ts`

Reads `favoriteColor`, `relationship`, and `gender` from the store and injects CSS custom properties on `:root`:

- `--color-primary`, `--color-primary-low`, `--color-primary-glow` — derived from the hex color
- `--bg-gradient` — relationship-specific background (radial for partner, linear for friend/family)
- `--glow-effect` — box-shadow intensity
- `--font-display` — typography: serif for partner, sans-serif for friend, rounded for family
- `--animation-pacing` and `--particle-speed` — timing multipliers
- `--card-radius` — border-radius mood

Gender-based subtle shifts adjust `--glow-intensity`, `--glass-blur`, and `--color-accent-soft`.

### 3. State Machine — `src/pages/Index.tsx`

The page orchestrates a strict `Phase` type:

```
Phase = "splash" | "unlock" | "intro" | "main"
```

- **splash**: `SplashScreen` — tap-to-start, triggers audio awakening via `useSoundManager.startMusic()`
- **unlock** (optional): `PasswordUnlock` — only if `isPasswordRequired(config)` returns true
- **intro**: `CinematicIntro` — multi-scene cinematic sequence
- **main**: `MainBirthday` — interactive celebration dashboard

Transitions use `AnimatePresence` with cinematic blur/scale/opacity animations.

**Skip button**: A floating "Skip Intro ⏭" button is shown during splash and intro phases (hidden during unlock to prevent bypass).

### 4. Cinematic Intro Timeline — `src/components/birthday/CinematicIntro.tsx`

Internal scene type:

```
Scene = "storytelling" | "fake-chat" | "post-chat" | "special-message" | "reveal-sequence" | "done"
```

Timing is controlled by `speedMultiplier` (derived from `getAnimationPacing()`):
- `fast` → 0.7x
- `slow` → 1.3x
- default → 1.0x

All timers use `timersRef` for cleanup on unmount. Each scene transition chains `setTimeout` calls with clear ordering.

Reveal step type:

```
RevealStep = "dear-name" | "grand-reveal" | "final-message"
```

The reveal sequence fires multi-layer confetti (`fireCinematicCelebration`), screen shake, flash, emoji bursts, ring pulse, and heart progression stage changes.

### 5. Execution Layer — `src/components/birthday/`

Every birthday component reads from `useBirthdayStore` rather than accessing `import.meta.env` directly. This keeps env parsing centralized.

### 6. Models Layer — `src/features/core/models/`

- **`familyTemplates.ts`**: Base `FamilyMemberProfile` schema + 14 specialized member types (brother, sister, father, mother, etc.) with factory functions. Uses `FAMILY_TEMPLATE_REGISTRY` for scalable type mapping.
- **`dataModels.ts`**: `EnhancedBirthdayConfig` (full app config), `ConfigValidator` (validate/sanitize/merge), `FamilyCollection`, `FamilyMember`, and `DataValidator` utility class.

### 7. Config Layer — `src/config/`

- **`birthday.ts`**: Simple static fallback for photo URLs and birthday name (used only when env is missing)
- **`templates.ts`**: `EMOTIONAL_LETTERS` (relationship-specific letters), `SPECIAL_QUOTES` (partner/friend/family quotes), `TEMPLATE_PRESETS` (color/emoji presets by relationship/gender/age), `COLOR_PALETTES`
- **`emojiKits.ts`**: `TemplateEmojiKit` per relationship type with signature/cursor/floating/celebration emoji sets, chat messages, and label overrides. `getTemplateEmojiKit()` merges base emojis with interest-based and custom emojis.

---

## Sound Architecture — `src/components/birthday/SoundManager.tsx`

A singleton `AudioManager` class handles:
- Background music (loop, fade-out, volume control)
- Sound effects: type, whoosh, reveal, pop, boom
- Browser autoplay fallback (listens for first click)

The `useSoundManager` hook exposes `playType()`, `playWhoosh()`, `playReveal()`, `playPop()`, `playBoom()`, `startMusic()`, `setBgVolume()`, `fadeOutBgMusic()`.

URLs are configured via `AUDIO_URLS` object, with `bgMusic` sourced from `AUDIO_ASSETS.bgmUrl` (which resolves `VITE_BGM_URL` or `VITE_SOUND_URL`).

---

## Confetti Architecture — `src/components/birthday/Confetti.tsx`

Wraps `canvas-confetti` with mobile-aware scaling:

- `fireConfetti(options)` — single burst
- `fireCannon()` — dual-side cannons for 2s (mobile: 1.2s)
- `fireStars()` — 360° star-shaped particles
- `fireCinematicCelebration()` — layered burst: dual corner cannons → central fireworks

All functions reduce particle count on mobile (`<768px` or userAgent match).

---

## Password System — `src/utils/password.ts`

Three functions:

- `parseRawBirthdayDate()` — tries `new Date()`, regex match for `YYYY-MM-DD`, then `MM-DD`/`DD-MM` guessing
- `generatePasswordFromDate()` — formats parsed date as MMDD, DDMM, YYYYMMDD, etc.
- `getEffectivePassword()` — resolves `VITE_PASSWORD` first, then generates from `VITE_BIRTHDAY_DATE`, then falls back to raw `import.meta.env.VITE_BIRTHDAY_DATE`
- `isPasswordRequired()` — checks `VITE_PASSWORD_REQUIRED` first, then whether a custom password is set

---

## Responsive Utilities — `src/utils/responsiveUtils.ts`

Provides device type detection (`mobile/tablet/laptop/desktop/ultrawide`), touch detection, reduced motion preference, and optimal values for animation intensity, particle count, font size, spacing, grid columns, and container width — all derived from `window.innerWidth`.

---

## Folder Structure

| Path | Purpose |
|---|---|
| `src/App.tsx` | Shell with router, error boundary, ambient effects, query client |
| `src/pages/Index.tsx` | Phase state machine (splash → unlock → intro → main) |
| `src/pages/NotFound.tsx` | 404 page |
| `src/components/birthday/` | 38 cinematic birthday components |
| `src/components/ui/` | shadcn/Radix UI primitives |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary |
| `src/features/core/store/` | Zustand store + super personalization logic |
| `src/features/core/models/` | Family templates, data models, validators |
| `src/features/core/theme/` | Dynamic CSS variable injection |
| `src/features/cinematic-story/scenes/` | Intro narrative scenes (e.g., `SpecialMessage`) |
| `src/features/cinematic-story/animations/` | Animation variants |
| `src/config/` | Birthday config, emotional letters, emoji kits |
| `src/utils/` | Password, responsive utilities |
| `src/hooks/` | `use-mobile`, `use-toast` |
| `src/lib/` | Utility helpers |
| `src/services/` | Audio system |
| `src/test/` | Test setup and examples |
| `public/` | Static assets |
| `docs/` | Documentation suite |
| `.github/` | Issue templates, PR template, workflows |
| `skills/` | AI skills for opencode |

---

## Error Handling

The `ErrorBoundary` at `src/components/ErrorBoundary.tsx` wraps the entire app. It catches rendering errors and shows a cinematic fallback with a "Reload Page" button.

---

## Key Design Decisions

1. **No heavy physics libraries** — Uses `requestAnimationFrame` and CSS animations instead of Three.js or Matter.js
2. **SVG for cake and heart tree** — Resolution-independent, animatable via CSS
3. **CSS custom properties for theming** — Runtime injection avoids recompilation
4. **Timer ref pattern** — All `setTimeout` IDs stored in `useRef` arrays for cleanup
5. **Centralized env parsing** — One function per type (`parseEnvString`, `parseEnvBoolean`, etc.) in `useBirthdayStore.ts`
6. **Relationship-driven everything** — Mood, pacing, colors, emojis, text content, and chat messages all branch on `VITE_BIRTHDAY_RELATIONSHIP`
