# Developer Guide

This guide explains how Birthday Bloom is wired so a new contributor can make changes confidently. Read this before modifying source code.

---

## How to Read This Codebase

1. **Start with the data flow**: `src/features/core/store/useBirthdayStore.ts` -- this is where all env parsing happens
2. **Understand the phase machine**: `src/pages/Index.tsx` -- splash -> unlock -> intro -> main
3. **Explore the major components**: `src/components/birthday/CinematicIntro.tsx` and `src/components/birthday/MainBirthday.tsx`
4. **Study the models**: `src/features/core/models/familyTemplates.ts` and `dataModels.ts`
5. **Learn the config layer**: `src/config/templates.ts` (emotional letters, presets)

---

## Folder Structure

| Path | Purpose |
|---|---|---|
| `src/App.tsx` | App shell: router, error boundary, ambient effects (sparkles, balloons, celebration overlay), QueryClient, Toaster |
| `src/pages/Index.tsx` | Top-level phase state machine. Controls splash -> unlock -> intro -> main transitions with `AnimatePresence`. |
| `src/pages/NotFound.tsx` | Simple 404 page. |
| `src/components/birthday/` | 39 cinematic and interactive birthday components. Each is self-contained and reads from the Zustand store. |
| `src/components/ui/` | shadcn/Radix UI primitives (button, card, dialog, etc.). |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary with cinematic fallback UI. |
| `src/features/core/store/` | `useBirthdayStore.ts` (Zustand store, env parsing) + `SuperPersonalizedLogic.ts` (letter/quote/wish generation). |
| `src/features/core/models/` | `familyTemplates.ts` (14 member types, registry, factories), `dataModels.ts` (enhanced config, validators). |
| `src/features/core/theme/` | `useDynamicTheme.ts` -- injects CSS custom properties at runtime. |
| `src/features/cinematic-story/` | Narrative scenes (`SpecialMessage`) and animation variants for the intro. |
| `src/config/` | Static fallback config (`birthday.ts`), emotional letters and presets (`templates.ts`), emoji kits per relationship (`emojiKits.ts`). |
| `src/utils/` | `password.ts` (password generation/validation), `responsiveUtils.ts` (device detection). |
| `src/hooks/` | `use-mobile.tsx`, `use-toast.ts`. |
| `src/lib/` | Shared utility code. |
| `src/services/` | `audioSystem.ts`. |
| `src/test/` | Vitest test setup and examples. |
| `public/` | Static assets (favicon, images). |
| `docs/` | Full documentation suite. |

---

## Component Responsibilities

| Component | File | What It Does | Gated By |
|---|---|---|---|
| `SplashScreen` | `SplashScreen.tsx` | Tap-to-start with heart progression and ambient particles. Triggers audio awakening. | Always shown first |
| `PasswordUnlock` | `PasswordUnlock.tsx` | Frosted-glass passcode screen with shake animation, confetti on success, dynamic hints. | `isPasswordRequired()` |
| `CinematicIntro` | `CinematicIntro.tsx` | Multi-scene timeline: storytelling -> fake chat -> post-chat -> special message -> reveal. Uses timer ref pattern. | Phase state machine |
| `MainBirthday` | `MainBirthday.tsx` | Main dashboard: hero section, interest icons, message card, wishes grid, gift code, magnetic buttons, cake, heart tree, video gallery, final surprise. | Phase = "main" |
| `PhotoGallery` | `PhotoGallery.tsx` | 3D-tilt cards, auto-advance, lightbox with `AnimatePresence`. | `VITE_SHOW_PHOTO_SECTION` |
| `VideoGallery` | `VideoGallery.tsx` | Renders YouTube/MP4 videos. Returns null if no videos configured. | `VITE_SHOW_VIDEO_SECTION` |
| `CakeCutting` | `CakeCutting.tsx` | 4-phase state machine: select cake -> blow candles -> wish -> cut -> burst -> quotes. SVG-based. | `VITE_SHOW_CAKE_SECTION` |
| `BirthdayQuiz` | `BirthdayQuiz.tsx` | Interest-aware trivia with score tracking. | `VITE_SHOW_QUIZ_SECTION` |
| `HeartTree` | `HeartTree.tsx` | SVG stroke-dasharray tree with 5 growth stages, spark particles, quote display. | `VITE_SHOW_HEART_TREE_SECTION` |
| `FinalSurprise` | `FinalSurprise.tsx` | Memory grid + optional final video embed. | `VITE_SHOW_FINAL_SURPRISE` |
| `FakeChatScene` | `FakeChatScene.tsx` | Simulates a chat interface: types "Happy Birthday", deletes it, retypes emotional message. | CinematicIntro sub-scene |
| `TypeWriter` | `TypeWriter.tsx` | Character-by-character typing with blinking cursor and optional onComplete callback. | Used across components |
| `KineticText` | `KineticText.tsx` | Animated text with configurable animation type (float, pop-out, zoom-in). | Used across components |
| `HeartProgression` | `HeartProgression.tsx` | SVG heart drawn in 4 stages with trail particles. | Used across components |
| `Balloons` | `Balloons.tsx` | Floating SVG balloons with relationship-aware colors. | Ambient layer |
| `Sparkles` | `Sparkles.tsx` | Star sparkles and floating orbs. | Ambient layer |
| `Confetti` | `Confetti.tsx` | `useConfetti` hook wrapping `canvas-confetti` with mobile-aware scaling. | Used across components |
| `SoundManager` | `SoundManager.tsx` | `AudioManager` singleton + `useSoundManager` hook. Handles BGM loop, autoplay fallback, effect sounds. | Used across components |
| `FloatingElements` | `FloatingElements.tsx` | Emoji floating particles with parallax depth. | Ambient layer |
| `MorphingElements` | `MorphingElements.tsx` | Animated morphing shapes. | Ambient layer |
| `EnhancedFloatingElements` | `EnhancedFloatingElements.tsx` | Additional floating ambient layer. | Ambient layer |
| `SparkleRain` | `SparkleRain.tsx` | Falling sparkle particles (only in "main" phase). | Ambient layer |
| `FireflyEffect` | `FireflyEffect.tsx` | Floating firefly particles (only in "main" phase). | Ambient layer |
| `FloatingOrbs` | `FloatingOrbs.tsx` | Floating orb elements (only in "main" phase). | Ambient layer |
| `ShootingStars` | `ShootingStars.tsx` | Shooting star streaks (only in "main" phase). | Ambient layer |
| `AnimatedGradient` | `AnimatedGradient.tsx` | Background gradient animation. | Ambient layer |
| `EmojiCursorTrail` | `EmojiCursorTrail.tsx` | Emoji trail following cursor. | Ambient layer |
| `PremiumFireworks` | `PremiumFireworks.tsx` | Celebratory fireworks effect. | Ambient layer |
| `PartyElements` | `PartyElements.tsx` | General party visual elements. | Ambient layer |
| `CelebrationOverlay` | `CelebrationOverlay.tsx` | Overlay component for celebrations. | Ambient layer |
| `SparkleEffect` | `SparkleEffect.tsx` | Sparkle visual effect. | Ambient layer |
| `GlitchEffect` | `GlitchEffect.tsx` | Glitch visual effect. | Ambient layer |
| `TextRevealEffect` | `TextRevealEffect.tsx` | Cinematic text reveal. | Ambient layer |
| `ParticleBurst` | `ParticleBurst.tsx` | Particle burst effect. | Ambient layer |
| `DigitalRain` | `DigitalRain.tsx` | Digital rain effect. | Ambient layer |
| `LiquidSwirl` | `LiquidSwirl.tsx` | Liquid swirl effect. | Ambient layer |
| `RibbonEffect` | `RibbonEffect.tsx` | Ribbon animation effect. | Ambient layer |
| `TunnelEffect` | `TunnelEffect.tsx` | Tunnel animation effect. | Ambient layer |
| `WaveEffect` | `WaveEffect.tsx` | Wave animation effect. | Ambient layer |

---

## State Flow

```
.env.local -> import.meta.env -> useBirthdayStore (Zustand) -> components
                                                             -> useDynamicTheme (CSS vars)
```

The store parses env once at module load and exposes:
- `config` -- full `BirthdayConfig` object
- `isConfigured` -- boolean (true if `VITE_BIRTHDAY_NAME` is set)
- `setConfig(partial)` -- runtime partial update
- `completeConfiguration()` -- marks config as complete
- `getAnimationPacing()` -- `'slow' | 'moderate' | 'fast'`
- `getMood()` -- `'romantic' | 'energetic' | 'warm'`

**Rule**: Components should read from the store, not `import.meta.env` directly. This keeps env parsing centralized.

---

## Adding a New Env Variable

1. Add the variable to `.env.example` with a comment explaining its purpose
2. In `useBirthdayStore.ts`, use the appropriate parser:
   - `parseEnvString()` for strings
   - `parseEnvBoolean()` for booleans (supports true/false/1/0/yes/no/on/off)
   - `parseEnvNumber()` for integers
   - `parseEnvList()` for comma/pipe/newline-separated lists
   - `parseEnvJson<T>()` for JSON values
3. Add the parsed value to the `config` object in the store
4. Add the field to `BirthdayConfig` interface
5. Wire it through to the relevant component(s)
6. Add docs in `docs/ENV_GUIDE.md`

---

## Adding a New Section

1. Create the component in `src/components/birthday/`
2. Add a `VITE_SHOW_*` env variable and wire it through the store
3. In `MainBirthday.tsx`, add the section gated by `config.show*Section`
4. Follow the existing pattern: `motion.section` with `whileInView` animations, store-driven content
5. Add env docs in `docs/ENV_GUIDE.md`

---

## Adding a New Family Template

1. Define specialized fields interface (e.g., `CoachFields`)
2. Add the type to `FamilyMemberType` union
3. Add a template entry to `FAMILY_TEMPLATE_REGISTRY`
4. Add a `createDefault*Profile()` factory function
5. Add the type to the env normalization in `useBirthdayStore.ts`
6. Add docs in `docs/family-system.md`

---

## Testing

```bash
npm run test          # Run vitest once
npm run test:watch    # Watch mode
```

Tests live in `src/test/`. The test environment uses `jsdom` with `@testing-library/react`.

---

## Build and Typecheck

```bash
npm run build         # Production build
npm run lint          # ESLint
```

The Vite build configuration:
- Chunk splitting: framer-motion, radix-ui, and vendor chunks
- Content hashing in filenames
- Empty `dist/` on each build
- Alias `@/` -> `./src/`

---

## Extension Rules

1. **Env first**: Names, colors, media, section visibility, relationship, animation, accessibility -- change in `.env.local` or hosting env secrets before editing source
2. **Centralized config**: Add new env vars in `useBirthdayStore.ts`, not scattered across components
3. **Store over direct env**: Components should read from the Zustand store, not `import.meta.env`
4. **Backward compatibility**: Keep old env aliases (e.g., `VITE_FAVORITE_COLOR` alongside `VITE_BIRTHDAY_COLOR`)
5. **Export preservation**: Keep factory functions like `createDefaultBrotherProfile()` for compatibility

---

## AI Agent Rule

When an AI coding agent works on this repo, it should first check whether a personalization request can be solved with env values using `.env.example` and `docs/ENV_GUIDE.md`. Only edit source code when the requested behavior is not covered by env.

---

## Component API Reference

### Core Exported Types

The Zustand store lives at `src/features/core/store/useBirthdayStore.ts:70`:

```typescript
interface BirthdayStore {
  config: BirthdayConfig;
  isConfigured: boolean;
  setConfig: (config: Partial<BirthdayConfig>) => void;
  completeConfiguration: () => void;
  getAnimationPacing: () => 'slow' | 'fast' | 'moderate';
  getMood: () => 'romantic' | 'energetic' | 'warm';
}
```

`BirthdayConfig` at `src/features/core/store/useBirthdayStore.ts:35` holds all runtime state: name, age, gender, relationship, favoriteColor, favoriteEmojis, interests, customMessage, birthdayDate, animationSpeed, animationIntensity, particleCount, photos, photoCaptions, videos, senderName, letterTitle, letterOverride, show*Section booleans, finalVideoUrl, specialMemories, familyProfile, password, passwordHint, passwordFormat, passwordRequired.

### `SplashScreen`

**Source**: `src/components/birthday/SplashScreen.tsx`

```typescript
interface SplashScreenProps {
  onStart: () => void;
}
```

First screen shown to the user. Displays a tap-to-start prompt with `HeartProgression` stage 1, ambient sparkle particles, and triggers audio awakening via `useSoundManager().startMusic()`. After tap, fades out over 800ms then calls `onStart`.

**Example**:

```typescript
<SplashScreen onStart={() => setPhase("intro")} />
```

### `PasswordUnlock`

**Source**: `src/components/birthday/PasswordUnlock.tsx`

```typescript
interface PasswordUnlockProps {
  onUnlock: () => void;
}
```

Frosted-glass passcode entry screen with shake animation on failed attempts. After 2 failed attempts, automatically expands a hint drawer (`getDynamicHint()` in `useBirthdayStore`). On success, fires confetti bursts, triggers a white flash overlay, then calls `onUnlock` after 1200ms. The expected password is resolved via `getEffectivePassword(config)` from `src/utils/password.ts:107`.

**Behavior notes**:
- Input mode switches to `numeric` when `passwordFormat` is `MMDD`, `DDMM`, or `YYYYMMDD`
- Falls back to generating a password from `VITE_BIRTHDAY_DATE` when no `VITE_PASSWORD` is set
- Uses `isPasswordRequired()` from `src/utils/password.ts:151` in `Index.tsx` to decide if this screen appears

### `CinematicIntro`

**Source**: `src/components/birthday/CinematicIntro.tsx`

```typescript
interface CinematicIntroProps {
  onComplete: () => void;
}
```

Multi-scene orchestration component that drives the full cinematic experience before the main dashboard. Manages a scene state machine: `storytelling` -> `fake-chat` -> `post-chat` -> `special-message` -> `reveal-sequence` -> `done`.

**Behavior notes**:
- Scene transitions are driven by `useEffect` with timer chains; all timers are cleaned up via `clearTimers()` on unmount
- Relationship and gender adjust story lines, post-chat lines, final lines, and emoji bursts
- The `reveal-sequence` sub-step (`dear-name` -> `grand-reveal` -> `final-message`) includes layered confetti, screen shake, emoji bursts, and ring pulses
- Pacing is determined by `getAnimationPacing()`: `fast` = 0.7x multiplier, `slow` = 1.3x, `moderate` = 1x
- Returns `null` once scene reaches `"done"`

### `MainBirthday`

**Source**: `src/components/birthday/MainBirthday.tsx`

No props required -- reads everything from `useBirthdayStore`.

Main landing page after the cinematic intro. Orchestrates: hero section with interest icons, wishes grid, emotional letter card, hidden gift code reveal, magnetic buttons, plus all section components conditionally rendered by `config.show*` flags.

**Behavior notes**:
- Cake emoji click counter: 7 clicks triggers the "MEGA SURPRISE!" easter egg
- Gift code is auto-generated from relationship + interest mapping (`src/components/birthday/MainBirthday.tsx:72`)
- Interest icons are mapped via `interestIcons` record using Lucide icons
- Magnetic mouse-tracking effect on hero via `useMotionValue` + `useSpring`
- `useReducedMotion()` and `useIsMobile()` control animation intensity
- Calls `setBgVolume(0.4)` on mount

### `PhotoGallery`

**Source**: `src/components/birthday/PhotoGallery.tsx`

```typescript
// No props -- reads from store
```

3D-tilt photo cards with auto-advance, lightbox with `AnimatePresence`, and keyboard navigation (ArrowLeft/ArrowRight/Escape). Auto-advance interval is derived from `getAnimationPacing()`.

**Behavior notes**:
- Falls back to `src/assets/photo-*.jpg` when no `VITE_PHOTO_*` env vars are set
- 3D tilt effect uses `useMotionValue` + `useSpring` + `useTransform`
- Captions are relationship-aware (3 different sets)
- Returns `null` when `photos.length === 0`

### `VideoGallery`

**Source**: `src/components/birthday/VideoGallery.tsx`

```typescript
// No props -- reads config.videos from store
```

Renders YouTube embed URLs or direct MP4/WebM video files. Distinguishes YouTube URLs via `includes('youtube.com')` or `includes('youtu.be')` and converts to embed format. Returns `null` when `config.videos` is empty.

### `CakeCutting`

**Source**: `src/components/birthday/CakeCutting.tsx`

```typescript
// No props -- reads from store. Renders via createPortal when active.
```

9-phase state machine: `select` -> `blow-intro` -> `blowing` -> `wish` -> `countdown` -> `knife-enter` -> `cutting` -> `burst` -> `quotes`. Portaled into `document.body` once a cake is selected.

**Behavior notes**:
- 4 cake designs: Chocolate Dream, Strawberry Bliss, Royal Velvet, Floral Garden
- Cinematic timings are defined in `CINEMATIC_TIMINGS` at `src/components/birthday/CakeCutting.tsx:352`
- Quotes are relationship/gender-aware with per-quote animation types (`zoom-in`, `float`, `pop-out`, `typewriter-burst`)
- Knife SVG descends via spring physics; on `burst` the cake SVG splits into left/right halves
- Countdown displays 3-2-1 with staggered pop sounds and scale animations

### `BirthdayQuiz`

**Source**: `src/components/birthday/BirthdayQuiz.tsx`

```typescript
// No props -- reads from store
```

Interest-aware trivia game. Questions are generated dynamically from the store's name, interests, and relationship. Score tracking with trophy animation on completion.

**Behavior notes**:
- If `interests` includes `car`, a car-themed question is added
- If `interests` includes `coding`, a coding-themed question is added
- If `relationship === 'partner'`, a love-themed question is added
- Correct answer highlights green, incorrect red, with explanation text

### `HeartTree`

**Source**: `src/components/birthday/HeartTree.tsx`

```typescript
interface HeartTreeProps {
  delay?: number;
}
```

SVG heart tree that grows through 5 stages (0-4) with stroke-dasharray branch animations. Stage 4 triggers a glow background. Contains `heartLeaves` that display either photos from the config or heart-shaped icons. Clicking a leaf shows a quote bubble from `SPECIAL_QUOTES` in `src/config/templates.ts`.

**Behavior notes**:
- `TreeSparks` sub-component animates 25 spark particles upward
- Quotes are filtered by `relationship` and `gender` from `SPECIAL_QUOTES`
- Default `delay` is 1000ms for the growth animation timeline

### `FinalSurprise`

**Source**: `src/components/birthday/FinalSurprise.tsx`

```typescript
// No props -- reads from store
```

Memory grid + optional final video embed + emotional closing section. Memories come from `config.specialMemories` (parsed from `VITE_SPECIAL_MEMORIES` env as pipe-separated `text;image` pairs). The final video embed supports YouTube auto-detection.

### `FakeChatScene`

**Source**: `src/components/birthday/FakeChatScene.tsx`

```typescript
interface FakeChatSceneProps {
  onComplete: () => void;
}
```

Simulated chat interface that types "Happy Birthday", deletes it character-by-character, retypes a relationship-aware emotional message, then displays a special message bubble. Generates different chat themes (colors, icons, status text) per relationship type.

**Behavior notes**:
- Uses async `runSequence` with `await new Promise(r => setTimeout(...))` pattern
- Phase state machine: `typing` -> `deleting` -> `retype` -> `special` -> `done`
- Chat bubble design tokens are memoized per relationship

### `TypeWriter`

**Source**: `src/components/birthday/TypeWriter.tsx`

```typescript
interface TypeWriterProps {
  text: string;
  speed?: number;        // ms per character, default 45
  delay?: number;        // ms before starting, default 0
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;      // show blinking cursor, default true
}
```

Character-by-character typing effect. Starts with an optional delay, then appends one character per `speed` ms. Calls `onComplete` when finished. Blinking cursor is a 3px-wide `span` with `animate-blink`.

### `KineticText`

**Source**: `src/components/birthday/KineticText.tsx`

```typescript
type AnimationType = "zoom-in" | "pop-out" | "stagger-up" | "float" | "wave" | "typewriter-burst";

interface KineticTextProps {
  text: string;
  animation: AnimationType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  onComplete?: () => void;
}
```

Per-character animated text. Each character is wrapped in an inline-block `span` with CSS animation classes defined in the global stylesheet. The `delay` prop sets a global delay before any animation starts; each character then staggers by `i * 60ms`.

### `HeartProgression`

**Source**: `src/components/birthday/HeartProgression.tsx`

```typescript
interface HeartProgressionProps {
  stage: 1 | 2 | 3 | 4;
  onRevealComplete?: () => void;
}
```

SVG heart drawn in 4 stages. Stage 1-3: draw heart segments via stroke-dasharray animation. Stage 4: renders `FourCornerMerge` sub-component with flying heart pieces that converge from 4 corners, a burst particle explosion, and a "Love You Dear [Name]" text reveal. `onRevealComplete` is called after the full animation (~6500ms).

### `Confetti`

**Source**: `src/components/birthday/Confetti.tsx`

```typescript
const { fireConfetti, fireCannon, fireStars, fireCinematicCelebration } = useConfetti();
```

Hook wrapping `canvas-confetti` with mobile-aware scaling. `fireConfetti` accepts optional `confetti.Options` overrides. `fireCannon` runs staggered corner cannons for ~2s. `fireStars` emits a circular star burst. `fireCinematicCelebration` runs a 3-layer pyrotechnic sequence: dual corner cannons, central fireworks burst, slow glitter rain.

### `SoundManager`

**Source**: `src/components/birthday/SoundManager.tsx`

```typescript
const {
  startMusic,      // Start BGM loop
  playType,        // Typing click
  playWhoosh,      // Whoosh transition
  playReveal,      // Celebration reveal
  playPop,         // Balloon pop
  playBoom,        // Explosion sound
  fadeOut,         // Fade out BGM (default 2000ms)
  setBgVolume,     // Set BGM volume (0-1)
} = useSoundManager();
```

Singleton `AudioManager` class manages BGM loop and effect sounds. Effect audio URLs are free hosted MP3s from CDNs. The BGM loop auto-plays with fallback for browsers that block autoplay (registers a one-time click listener). Volume is clamped to [0, 1].

### Ambient Effect Components

These components take optional count/intensity props and are rendered in `Index.tsx` as persistent layers:

| Component | Source | Props | Behavior |
|---|---|---|---|
| `Balloons` | `src/components/birthday/Balloons.tsx` | `count?: number` | SVG balloons with relationship-aware colors, floating upward with `animate-balloon-rise` |
| `Sparkles` | `src/components/birthday/Sparkles.tsx` | `count?: number` | Star sparkles + floating blurred orbs with drift animation |
| `FloatingOrbs` | `src/components/birthday/FloatingOrbs.tsx` | `count?: number` | Blurred floating orbs with slow drift, only rendered in "main" phase |
| `ShootingStars` | `src/components/birthday/ShootingStars.tsx` | `count?: number` | Streaking star particles with pulsing glow, only in "main" phase |
| `FireflyEffect` | `src/components/birthday/FireflyEffect.tsx` | `intensity?: number` | Golden glowing fireflies with organic movement, only in "main" phase |
| `SparkleRain` | `src/components/birthday/SparkleRain.tsx` | `intensity?: number` | Falling white sparkle particles, only in "main" phase |

Additional ambient components without props (rendered unconditionally): `FloatingElements`, `MorphingElements`, `EnhancedFloatingElements`, `AnimatedGradient`, `EmojiCursorTrail`, `PremiumFireworks`, `PartyElements`, `CelebrationOverlay`, `SparkleEffect`, `GlitchEffect`, `TextRevealEffect`, `ParticleBurst`, `DigitalRain`, `LiquidSwirl`, `RibbonEffect`, `TunnelEffect`, `WaveEffect`.

---

## Store Consumption Patterns

### Reading config in a component

```typescript
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

function MySection() {
  const { config, getAnimationPacing, getMood } = useBirthdayStore();
  const { name, favoriteColor, relationship, interests } = config;
  const pacing = getAnimationPacing();
  const mood = getMood();

  return (
    <div style={{ color: favoriteColor }}>
      {name} - {mood} - {pacing}
    </div>
  );
}
```

### Updating config at runtime

```typescript
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

function ThemeSwitcher() {
  const { config, setConfig } = useBirthdayStore();

  const handleColorChange = (newColor: string) => {
    setConfig({ favoriteColor: newColor });
  };

  return (
    <button onClick={() => handleColorChange('#FF0000')}>
      Switch to Red
    </button>
  );
}
```

### Using selectors for performance

```typescript
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

function NameDisplay() {
  // Only re-renders when name changes
  const name = useBirthdayStore((state) => state.config.name);
  const isConfigured = useBirthdayStore((state) => state.isConfigured);

  return <h1>{isConfigured ? name : 'Guest'}</h1>;
}
```

### Composing store with hooks and sound

```typescript
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useConfetti } from '@/components/birthday/Confetti';
import { useSoundManager } from '@/components/birthday/SoundManager';

function CelebrationButton() {
  const { config } = useBirthdayStore();
  const { fireConfetti } = useConfetti();
  const { playBoom } = useSoundManager();

  const handleCelebrate = () => {
    fireConfetti({ particleCount: 200, spread: 120 });
    playBoom();
  };

  return (
    <button
      onClick={handleCelebrate}
      style={{ backgroundColor: config.favoriteColor }}
    >
      Celebrate {config.name}!
    </button>
  );
}
```

### Accessing family profile

```typescript
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

function FamilyCard() {
  const { config } = useBirthdayStore();
  const profile = config.familyProfile;

  if (!profile) return null;

  return (
    <div>
      <h2>{profile.basicInfo?.fullName}</h2>
      <p>Closeness: {profile.relationshipOverrides?.closenessLevel}/10</p>
    </div>
  );
}
```

---

## Creating Custom Components

### Pattern 1: Store-driven section component

Create a component that reads from the store and renders conditionally in `MainBirthday`:

```typescript
import { motion } from 'framer-motion';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useSoundManager } from '@/components/birthday/SoundManager';
import { useConfetti } from '@/components/birthday/Confetti';

interface CustomTimelineProps {
  title?: string;
}

export const CustomTimeline = ({ title = 'Our Journey' }: CustomTimelineProps) => {
  const { config, getMood } = useBirthdayStore();
  const { name, favoriteColor } = config;
  const mood = getMood();
  const { playReveal } = useSoundManager();
  const { fireStars } = useConfetti();

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 px-4 py-32 max-w-6xl mx-auto"
    >
      <h2
        className="font-display text-5xl md:text-7xl font-black text-center mb-16"
        style={{ color: favoriteColor }}
      >
        {title} - {name}
      </h2>
      <p className="text-center text-foreground/60 text-xl">
        Mood: {mood}
      </p>
    </motion.section>
  );
};
```

Then in `MainBirthday.tsx`:

```typescript
{config.showTimelineSection && <CustomTimeline />}
```

### Pattern 2: Wrapping ambient effects

```typescript
import { Sparkles } from '@/components/birthday/Sparkles';
import { Balloons } from '@/components/birthday/Balloons';

export const EnhancedBackground = () => {
  return (
    <>
      <Sparkles count={30} />
      <Balloons count={12} />
    </>
  );
};
```

### Pattern 3: Feature hook that combines store + confetti + sound

```typescript
import { useCallback } from 'react';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useConfetti } from '@/components/birthday/Confetti';
import { useSoundManager } from '@/components/birthday/SoundManager';

export const useSpecialMoment = () => {
  const { config } = useBirthdayStore();
  const { fireConfetti, fireStars } = useConfetti();
  const { playBoom, playReveal } = useSoundManager();

  const trigger = useCallback(() => {
    fireConfetti({ particleCount: 300, spread: 180 });
    fireStars();
    playBoom();
    setTimeout(() => playReveal(), 500);
  }, [fireConfetti, fireStars, playBoom, playReveal]);

  return {
    trigger,
    name: config.name,
    color: config.favoriteColor,
  };
};
```

---

## Extension Patterns

### Adding a new VITE_SHOW_* section toggle

1. Add env parsing in `useBirthdayStore.ts`:
```typescript
const envShowTimeline = parseEnvBoolean(import.meta.env.VITE_SHOW_TIMELINE_SECTION, true);
```
2. Add the boolean to `BirthdayConfig` interface and the store `config` object.
3. Create the component in `src/components/birthday/`.
4. Gate it in `MainBirthday.tsx`:
```typescript
{config.showTimelineSection && <CustomTimeline />}
```
5. Document the new env var in `docs/ENV_GUIDE.md`.

### Adding a new animation effect component

1. Create `src/components/birthday/MyEffect.tsx` following the ambient pattern:
```typescript
import { motion } from "framer-motion";

export const MyEffect = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div key={i} animate={{ ... }} />
      ))}
    </div>
  );
};
```
2. Import and render it in `Index.tsx`.

### Adding a new relationship type

1. Add the type string to the `RelationshipType` union in `useBirthdayStore.ts:14`.
2. Add a normalization branch in the raw relationship parsing block (`useBirthdayStore.ts:136`).
3. Add emotional letters in `src/config/templates.ts` under `EMOTIONAL_LETTERS`.
4. Add story lines in `CinematicIntro.tsx` (if different narrative needed).
5. Add color palette/emoji presets in `src/config/templates.ts` under `TEMPLATE_PRESETS`.
6. Document in `docs/family-system.md`.

### Adding a new password format

1. Add the format string to the switch in `generatePasswordFromDate()` (`src/utils/password.ts:82`).
2. Add the corresponding hint in `getDynamicHint()` in `PasswordUnlock.tsx:85`.
3. Add the format option to `.env.example` documentation.

### Customizing emotional letters

Override the letter content via env without touching source:
```env
VITE_BIRTHDAY_LETTER_OVERRIDE="Your completely custom letter with \n newlines..."
VITE_BIRTHDAY_LETTER_TITLE="My Custom Title"
```

Or programmatically in the store:
```typescript
setConfig({
  letterOverride: "Custom letter content here...",
  letterTitle: "A Special Note",
});
```

### Adding custom sections via env

```env
VITE_CUSTOM_SECTION_1_TITLE="Guest Book"
VITE_CUSTOM_SECTION_1_CONTENT="<div>Custom HTML here</div>"
VITE_CUSTOM_SECTION_1_ORDER=1
```

The `EnhancedBirthdayConfig.sections.customSections` array supports arbitrary sections with id, title, content, and order fields.

---

## Utilities API

### Data Validation

```typescript
import { ConfigValidator, DataValidator } from '@/features/core/models/dataModels';

// Quick field checks
DataValidator.isValidHexColor("#FF6B6B");    // true
DataValidator.isValidEmail("user@example.com"); // true
DataValidator.isValidName("Naboraj");          // true
DataValidator.isValidPhoneNumber("+1-555-123-4567"); // true
DataValidator.isValidURL("https://example.com"); // true
DataValidator.isValidClosenessLevel(7);        // true

// Full config validation
const result = ConfigValidator.validate(myConfig);
if (!result.isValid) {
  console.error(result.errors);
  console.warn(result.warnings);
}

// Sanitize and merge with defaults
const safeConfig = ConfigValidator.sanitize(userInput);
const fullConfig = ConfigValidator.mergeWithDefaults(partialConfig);
```

### Password Utilities

```typescript
import { getEffectivePassword, isPasswordRequired, generatePasswordFromDate } from '@/utils/password';

const password = getEffectivePassword(config);
const required = isPasswordRequired(config);
const generated = generatePasswordFromDate('2001-05-22', 'MMDD'); // "0522"
```

### Family Template Factories

```typescript
import {
  createDefaultBrotherProfile,
  createDefaultSisterProfile,
  createFamilyMemberProfile,
} from '@/features/core/models/familyTemplates';

const brother = createDefaultBrotherProfile("Raj", new Date('1998-03-15'));
brother.personality.traits = ['protective', 'humorous'];
brother.siblingBond.closenessLevel = 9;

const sister = createDefaultSisterProfile("Priya", new Date('2000-07-22'));
sister.professionalLife.currentRole = "Engineer";

// Generic factory (newer API)
const mom = createFamilyMemberProfile('mother', 'Mom', new Date('1968-09-12'));
```

### SuperPersonalizedLogic

```typescript
import { getHighlySpecificLetter, getBigWishes, getInterestBasedTheme } from '@/features/core/store/SuperPersonalizedLogic';

const letter = getHighlySpecificLetter("Sarah", "partner", "female", ["music", "art"]);
const wishes = getBigWishes("Alex", "friend", "male", ["gaming"]);
const theme = getInterestBasedTheme(["car"]); // "automotive"
```

### Hooks

```typescript
import { useIsMobile } from '@/hooks/use-mobile';

function Responsive() {
  const isMobile = useIsMobile();
  return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
}
```

```typescript
import { useToast } from '@/hooks/use-toast';

function Notifier() {
  const { toast } = useToast();
  return <button onClick={() => toast({ title: "Celebration started!", duration: 5000 })}>Go</button>;
}
```

---

## Data Models

### EnhancedBirthdayConfig

The full type for programmatic configuration at `src/features/core/models/dataModels.ts:134`:

```typescript
interface EnhancedBirthdayConfig {
  core: {
    name: string;
    dateOfBirth: Date;
    gender: GenderType;
    relationship: RelationshipType;
    customRelationship?: string;
  };
  personalization: {
    theme: ThemeType;
    favoriteColor: string;
    favoriteEmojis?: string[];
    customMessage?: string;
    interests?: string[];
    hobbies?: string[];
  };
  media: {
    photos?: { primary?: string; gallery?: string[]; thumbnails?: string[] };
    videos?: { intro?: string; memories?: string[]; outro?: string };
    audio?: { backgroundMusic?: string; voiceMessage?: string; soundEffects?: boolean };
  };
  experience: {
    animationSpeed?: AnimationSpeed;
    animationIntensity?: 'low' | 'medium' | 'high';
    particleEffects?: boolean;
    particleCount?: number;
    showSkipButton?: boolean;
    duration?: 'quick' | 'normal' | 'extended';
  };
  accessibility: {
    reducedMotion?: boolean;
    textSize?: 'small' | 'normal' | 'large';
    highContrast?: boolean;
    captions?: boolean;
    screenReaderOptimized?: boolean;
  };
  messaging: {
    letterTitle?: string;
    letterContent?: string;
    senderName?: string;
    additionalMessages?: { title?: string; content?: string }[];
  };
  sections: {
    showCake?: boolean;
    showPhotos?: boolean;
    showVideos?: boolean;
    showQuiz?: boolean;
    showHeartTree?: boolean;
    showTimeline?: boolean;
    customSections?: { id: string; title: string; content: string; order?: number }[];
  };
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    tags?: string[];
    isPublic?: boolean;
  };
}
```

### Type Constants

```typescript
import {
  RELATIONSHIP_TYPES,
  GENDER_TYPES,
  THEME_TYPES,
  ANIMATION_SPEEDS,
  AGE_GROUPS,
} from '@/features/core/models/dataModels';

const relationship = RELATIONSHIP_TYPES.PARTNER; // "partner"
const theme = THEME_TYPES.ROMANTIC;              // "romantic"
```

---

## Performance Considerations

| Technique | Implementation |
|---|---|
| Lazy loading | `const MainBirthday = lazy(() => import('@/components/birthday/MainBirthday'))` |
| Memoization | `useMemo` for `getBigWishes`, interest icons, story lines |
| Mobile particle reduction | `useIsMobile()` limits `Balloons`, `Sparkles`, `CakeCutting` spark counts |
| Reduced motion | `useReducedMotion()` disables spring physics, 3D tilts, complex animations |
| Image optimization | `< 500KB per image, lazy loading, onError fallback to assets |
| Bundle splitting | Vite chunks: framer-motion, radix-ui, vendor, app |
| CSS animations | Animations use CSS `@keyframes` where possible (sparkle, balloon-rise, etc.) |

---

## Error Handling

The `ErrorBoundary` component at `src/components/ErrorBoundary.tsx` wraps the app and provides a cinematic fallback UI. Individual components handle their own edge cases:
- `PhotoGallery` returns `null` when no photos are configured
- `VideoGallery` returns `null` when no videos are configured
- `CakeCutting` uses `createPortal` with cleanup for body overflow
- `CinematicIntro` cleans up all timers on unmount via `clearTimers()`
- `SoundManager` catches autoplay failures and registers fallback click handlers

---

## Cross-References

- [ARCHITECTURE.md](../ARCHITECTURE.md) -- System architecture overview, rendering pipeline, data flow diagram
- [docs/ENV_GUIDE.md](./ENV_GUIDE.md) -- Complete environment variable reference with all options
- [docs/family-system.md](./family-system.md) -- Family template system, member types, registry, factories
- [docs/template-architecture.md](./template-architecture.md) -- Template architecture, presets, emotional content
- [STYLEGUIDE.md](../STYLEGUIDE.md) -- Code conventions, naming, formatting rules
- [CONTRIBUTING.md](../CONTRIBUTING.md) -- Contribution workflow, PR process, code review guidelines
- [QUICK_START.md](../QUICK_START.md) -- 5-minute setup with minimal configuration
