# Birthday Bloom — Technical Intelligence Report (Read-Only Audit)

**Status:** Investigation only. No files modified, created, deleted, or committed.
**Repository:** `D:\Projects\Website\birthday-bloom`
**Git branch:** `feat/3d-mobile-chat-and-ux-upgrades`
**Current commit:** `7d4fec7ccb65f714ec04878823a596c96a6c9b53`
**Working tree:** 24 modified source files, 4 untracked JPEG assets, 1 untracked doc file

---

## A. Executive Summary

Birthday Bloom is an open-source, env-first, cinematic birthday celebration SPA built with React 18, TypeScript, Vite, Framer Motion, Three.js (lazy-loaded), Zustand, and Tailwind CSS. The app runs on port 5000 and is deployed to Vercel.

**Core architecture:** A 4-phase narrative state machine (`splash → unlock → intro → main`) defined in `src/pages/Index.tsx`. Configuration flows from environment variables (`.env.local`, `VITE_*` prefixed) and URL query parameters into a central Zustand store (`src/features/core/store/useBirthdayStore.ts`), which components subscribe to.

**Highest-priority findings:**
1. **Version discrepancy:** `package.json` reports `3.5.0`; `README.md` references `3.7.0`; unresolved.
2. **`.env` exists on disk but is gitignored** (`.gitignore` line 26). Contains personal values and **7 variables not declared in `.env.example`**: `VITE_THEME`, `VITE_SONG_URL`, `VITE_VOICE_MESSAGE_URL`, `VITE_TEXT_SIZE`, `VITE_HIGH_CONTRAST`, `VITE_DEBUG`, `VITE_ANALYTICS_ID`. `VITE_FORCE_HIGH_GRAPHICS` is used in code but missing from `.env.example`.
3. **Password security is client-side only:** Passcodes derived from `VITE_BIRTHDAY_DATE` via `src/utils/password.ts` and compared in `PasswordUnlock.tsx`. The password logic and date live in the client bundle — obfuscation, not authentication.
4. **All `VITE_*` values are public in the client bundle** (`.env.example` line 11). No build-time secret stripping.
5. **Splash screen (`SplashScreen.tsx`) is largely hardcoded:** "✨ Made with Love ✨" (line 79) is not relationship-driven, not translated, not configurable via env. Only two translation keys used.
6. **Test suite:** 31 test files, 497 tests (Vitest 3). Validation commands not yet run in this audit session.

---

## B. Verified Architecture Map

### Top-level directory structure

| Path | Responsibility |
|------|---------------|
| `src/main.tsx` | Entry point. `React.StrictMode` + `GlobalErrorBoundary` (class component). Renders `App`. |
| `src/App.tsx` | App shell. `ErrorBoundary`, `Sonner` toaster, `BrowserRouter`: `/` → `Index`, `*` → `NotFound`. |
| `src/pages/Index.tsx` | Main page. 4-phase state machine. Imports ambient components, store, theme, SEO, i18n, performance hooks. |
| `src/pages/NotFound.tsx` | Client-side 404. Sets `noindex` robots meta, localized title/description, nav links. |
| `src/components/birthday/` | 36 celebration component files (Section F). |
| `src/components/ui/` | `sonner.tsx` wrapper (Toaster + toast, light theme). |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary with cinematic fallback UI. |
| `src/features/core/store/` | Zustand store (`useBirthdayStore.ts`), URL param parser (`urlParams.ts`), letter generator (`SuperPersonalizedLogic.ts`). |
| `src/features/core/models/` | `familyTemplates.ts` (18 archetypes, rich profile schema) + test. |
| `src/features/core/theme/` | `useDynamicTheme.ts` (injects HSL CSS variables into `:root` based on color + relationship + gender). |
| `src/features/core/seo/` | `useDynamicSEO.ts` (dynamic meta, OpenGraph, Twitter Cards, JSON-LD `SocialEvent`, `lang` attr). |
| `src/config/` | `templates.ts` (emotional letters, `SPECIAL_QUOTES`), locale template files, `emojiKits.ts`, `wishTemplates.ts`, `birthday.ts` (audio assets). |
| `src/i18n/` | `index.ts` (`useTranslation`), `types.ts` (`TranslationSchema`), `locales/{en,hi,bn,fr}.ts`. |
| `src/hooks/` | `use-mobile.tsx` (768px), `useAdaptivePerformance.ts` (device tier + battery API), `useMicrophoneBlow.ts` (Web Audio candle-blow). |
| `src/utils/` | `password.ts`, `colorUtils.ts`, `dateUtils.ts`, `deviceTier.ts`, `audioUtils.ts`, `mediaUtils.ts`, `urlUtils.ts`. |
| `public/` | `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `site.webmanifest`, `og-image.jpg`, favicons. |
| `obsidian-docs/` | 47-note technical documentation vault. |
| `docs/screenshots/` | 25 verified UI screenshots. `docs/diagrams/` | 2 diagrams. |

### Dependency flow (verified)

```
import.meta.env (VITE_* vars)
  └─► useBirthdayStore (Zustand) ──┬─► useDynamicTheme (CSS vars :root)
                                     ├─► useDynamicSEO (meta/JSON-LD)
                                     ├─► useTranslation (locale)
                                     └─► Components
window.location.search (URL params)
  └─► parseBirthdayUrlParams() ───► useBirthdayStore (URL overrides env)
```

### Build configuration (`vite.config.ts`)

- Dev server: `host: "0.0.0.0"`, `port: 5000`
- Build outDir: `dist`, `emptyOutDir: true`
- Rollup `manualChunks`: `three` (Cake3D/CakeKnife3D + three/react-three/react-spring), `templates` (locale files), `framer-motion`, `radix-ui`, `vendor`
- Cache busting: `[name].[hash].js` entry/chunk, `[name].[hash][extname]` assets
- Alias: `@` → `./src`

### TypeScript configuration (`tsconfig.json`)

- Project references: `tsconfig.app.json`, `tsconfig.node.json`
- Paths: `@/*` → `./src/*`
- `noImplicitAny: false`, `strictNullChecks: false`, `skipLibCheck: true`, `allowJs: true`

---

## C. Complete Environment Variable Registry

### Discovery method

Read `.env.example` (38 documented vars), `.env` (present on disk, gitignored, personal values + extra undeclared vars), traced every `import.meta.env.VITE_*` read in `useBirthdayStore.ts` (lines 119-224) and `deviceTier.ts` (lines 43, 90-91).

### Complete variable registry

| # | Variable | Aliases | Type | Default | In `.env.example`? | URL-overridable? | Exposed? | Sensitive? |
|---|----------|---------|------|---------|-------------------|------------------|----------|------------|
| 1 | `VITE_BIRTHDAY_NAME` | `VITE_USER_NAME` | string | `""` | Yes | Yes (`name`/`recipient`/`to`) | Yes | No |
| 2 | `VITE_BIRTHDAY_AGE` | — | number | `null` | Yes | Yes (`age`) | Yes | No |
| 3 | `VITE_BIRTHDAY_GENDER` | `VITE_GENDER` | `female\|male\|other` | `other` | Yes | Yes (`gender`) | Yes | No |
| 4 | `VITE_BIRTHDAY_DATE` | — | ISO date | `null` | Yes | No | Yes (passcode source) | **Yes** |
| 5 | `VITE_BIRTHDAY_RELATIONSHIP` | `VITE_RELATIONSHIP`, `VITE_THEME`, `VITE_ROLE` | 17 archetypes | `friend` | Yes | Yes (`rel`/`relationship`/`archetype`) | Yes | No |
| 6 | `VITE_BIRTHDAY_WISHER_NAME` | `VITE_WISHER_NAME` | string | `""` | Yes | Yes (`sender`/`wisher`/`from`) | Yes | No |
| 7 | `VITE_LANGUAGE` | `VITE_LANG` | `en\|bn\|hi\|fr` | `en` | Yes | Yes (`lang`/`language`/`locale`) | Yes | No |
| 8 | `VITE_BIRTHDAY_COLOR` | `VITE_THEME_COLOR`, `VITE_FAVORITE_COLOR` | hex | `#FF6B6B` | Yes | Yes (`color`/`theme`) | Yes | No |
| 9 | `VITE_BIRTHDAY_INTERESTS` | `VITE_FAVORITE_ITEMS` | CSV | `""` | Yes | Yes (`interests`) | Yes | No |
| 10 | `VITE_FAVORITE_EMOJIS` | `VITE_BIRTHDAY_EMOJIS` | CSV/pipe | `""` | Yes | No | Yes | No |
| 11 | `VITE_BIRTHDAY_CUSTOM_MESSAGE` | `VITE_CUSTOM_MESSAGE` | string | `""` | Yes | Yes (`msg`/`message`/`note`) | Yes | No |
| 12 | `VITE_BIRTHDAY_LETTER_TITLE` | `VITE_CARD_TITLE_SURPRISE` | string | `"A Special Letter Just for You 💌"` | Yes | No | Yes | No |
| 13 | `VITE_BIRTHDAY_LETTER_OVERRIDE` | — | escaped string | `""` | Yes | No | Yes | No |
| 14 | `VITE_SPECIAL_MEMORIES` | — | `title;\|url\|` | `""` | Yes | No | Yes | No |
| 15 | `VITE_PHOTOS` / `VITE_PHOTO_1..6` | — | CSV/pipe/JSON | `""` | Yes | No | Yes | No |
| 16 | `VITE_PHOTO_CAPTIONS` | — | CSV/pipe | `""` | Yes | No | Yes | No |
| 17 | `VITE_VIDEO_1..3` / `VITE_FINAL_VIDEO_URL` | — | URL | `""` | Yes | No | Yes | No |
| 18 | `VITE_BGM_URL` | `VITE_SOUND_URL` | URL | Mixkit MP3 | Yes | No | Yes | No |
| 19 | `VITE_SOUND_EFFECTS` | — | boolean | `true` | Yes | Yes (`sound`) | Yes | No |
| 20-31 | `VITE_SHOW_*_SECTION` (cake, mic, guestbook, photo, quiz, heartTree, video, finalSurprise, gift, skip) | various | boolean | `true` | Yes | mic/guestbook yes | Yes | No |
| 32 | `VITE_ANIMATION_SPEED` | — | `slow\|moderate\|fast` | By relationship | Yes | Yes (`speed`/`pacing`) | Yes | No |
| 33 | `VITE_ANIMATION_INTENSITY` | — | `low\|medium\|high` | `high` | Yes | No | Yes | No |
| 34 | `VITE_PARTICLE_COUNT` | — | number | `25` | Yes | No | Yes | No |
| 35 | `VITE_REDUCED_MOTION` | — | boolean | `false` (store: `undefined` when unset) | Yes | No | Yes | No |
| 36 | `VITE_PASSWORD` / `VITE_PASSWORD_REQUIRED` / `VITE_PASSWORD_HINT` / `VITE_PASSWORD_FORMAT` | — | various | `false`/`""`/`""`/`MMDD` | Yes | Yes (`password`/`pass`/`lock`/`locked`/`hint`) | Yes | **Yes** |
| 37-48 | `VITE_FAMILY_*` (12 vars) | — | various | various | Yes | No | Yes | **Yes** (`PROFILE_JSON`) |
| 49 | `VITE_FORCE_HIGH_GRAPHICS` | — | boolean | `false` | **No** (missing from example) | Yes (`highGraphics`/`high_graphics`/`perf`) | Yes | No |

### C.1 Variables used but missing from `.env.example`

- `VITE_FORCE_HIGH_GRAPHICS` — used in `deviceTier.ts` L43 and `useBirthdayStore.ts` L196, missing from `.env.example`.
- `.env` on disk (gitignored) also has `VITE_THEME`, `VITE_ROLE`, `VITE_GENDER` (read as aliases in store L123-124, L147), plus `VITE_SONG_URL`, `VITE_VOICE_MESSAGE_URL`, `VITE_TEXT_SIZE`, `VITE_HIGH_CONTRAST`, `VITE_DEBUG`, `VITE_ANALYTICS_ID` — not traced as consumed.

### C.2 Behavior differs from documentation

- `VITE_REDUCED_MOTION`: Documented default `false`. Store L197-199 sets `undefined` when env var absent (`import.meta.env.VITE_REDUCED_MOTION !== undefined ? ... : undefined`), so the store field is `undefined` rather than `false` when unset. Components must handle `undefined`.
- `VITE_BIRTHDAY_DATE`: "TH typo correction" — verified consistent in `useBirthdayStore.ts` L161 and `password.ts` L9.

### C.3 Security analysis

**CRITICAL:** All `VITE_*` variables are inlined into the client bundle by Vite. `.env.example` line 11 warns: "All `VITE_` variables are bundled and accessible in the client browser."

Password logic (`src/utils/password.ts`):
- `getEffectivePassword()` (L73-107): explicit password > date-derived password > `''`.
- `isPasswordRequired()` (L108-115): `config.passwordRequired` if defined, else `!!config.password`.
- `PasswordUnlock.tsx` L24: `expectedPassword = getEffectivePassword(config)`. L36: case-insensitive comparison.

**False sense of security:** Passcode and birthday date are recoverable from the client bundle. URL param `?lock=` without password defaults to `'1234'` (`urlParams.ts` L161-162). URL parameters can override security-sensitive settings.

### C.7 Where to add a new environment variable

1. Declare in `.env.example`.
2. Read via `import.meta.env.VITE_*` in `useBirthdayStore.ts` (follow `parseEnvString`/`parseEnvBoolean`/`parseEnvNumber` patterns).
3. Add field to `BirthdayConfig` interface (lines 12-55).
4. Populate in store `config` object (lines 275-314) with URL override pattern if desired.
5. Consume via `useBirthdayStore((state) => state.config.yourField)`.
6. Theming: `useDynamicTheme.ts`. SEO: `useDynamicSEO.ts`. URL override: `urlParams.ts`.

---

## D. Configuration Precedence and URL Parameter Matrix

### Precedence order (verified in `useBirthdayStore.ts` lines 274-314)

For every config field, the store applies: **URL param override > env value > static default**.

Example pattern (line 276):
```ts
name: urlOverrides.name !== undefined ? urlOverrides.name : envName,
```

Where `envName` (line 119) = `parseEnvString(import.meta.env.VITE_BIRTHDAY_NAME, import.meta.env.VITE_USER_NAME)` — first non-empty wins among aliases.

### Supported URL parameters (`urlParams.ts` lines 7-170)

| Parameter | Aliases | Type | Validation | Overrides |
|-----------|---------|------|------------|-----------|
| `name` | `recipient`, `to` | string | non-empty trimmed | `name` |
| `rel` / `relationship` | `relationship`, `archetype` | archetype | substring match against 17 types | `relationship` |
| `lang` / `language` | `language`, `locale` | `en\|bn\|hi\|fr` | exact match after aliases | `language` |
| `age` | — | number | 1-149 integer | `age` |
| `gender` | — | `male\|female\|other` | exact lowercase | `gender` |
| `sender` | `wisher`, `from` | string | non-empty trimmed | `senderName` |
| `msg` | `message`, `note` | string | non-empty trimmed | `customMessage` |
| `color` | `theme` | hex | `/^#[0-9A-Fa-f]{3,8}$/` (auto-prepends `#`) | `favoriteColor` |
| `speed` | `pacing` | `slow\|moderate\|fast` | exact lowercase | `animationSpeed` |
| `sound` | — | boolean | not in `[false,0,no,off,disabled]` | `soundEffectsEnabled` |
| `micBlow` | `mic_blow`, `mic` | boolean | not in `[false,0,no,off,disabled]` | `enableMicrophoneCandleBlow` |
| `guestbook` | `wishes`, `board` | boolean | not in `[false,0,no,off,disabled]` | `showGuestbookSection` |
| `highGraphics` | `high_graphics`, `perf` | boolean | in `[true,1,yes,on,high]` | `forceHighGraphics` |
| `password` | `pass` | string | non-empty trimmed | `password` + sets `passwordRequired=true` |
| `lock` | `locked` | boolean | not in `[false,0,no,off]` | `passwordRequired`; if true and no password, defaults to `'1234'` |
| `hint` | `passwordHint` | string | non-empty trimmed | `passwordHint` |
| `phase` | — | `splash\|unlock\|intro\|main` | exact match | handled in `Index.tsx` L24-31, not in urlParams |

### URL parameter precedence vs other sources

| Source | Precedence | Notes |
|--------|-----------|-------|
| URL query parameter | **Highest** | Overrides env at store initialization (lines 276-314) |
| Host environment (Vercel/Netlify dashboard) | High | `import.meta.env` at module load |
| `.env.local` / `.env` | Medium | `import.meta.env` at module load (Vite loads `.env` then `.env.local`) |
| Static defaults in code | **Lowest** | Hardcoded fallbacks in `useBirthdayStore.ts` |

### URL parameter security and persistence

- **Security-sensitive override:** `?password=`, `?pass=`, `?lock=` can enable/weaken the passcode gate. `?lock=` without password defaults to `'1234'`.
- **Persistence:** Parameters are read once at store initialization (`parseBirthdayUrlParams()` called at module scope, line 272). They do **not** persist across navigation or refresh unless re-appended to the URL.
- **Shared link exposure:** All URL params are visible in the browser address bar and in browser history. Personal data (name, relationship, message) shared via URL is exposed in referrer headers and server logs.
- **Dynamic updates:** Configuration is initialized once at mount. URL param changes after mount do **not** reactively update the store (no `useEffect` on `location.search`).

### Precedence discrepancy: documented vs actual

Documentation claims URL parameters override env. Actual implementation confirms this in `useBirthdayStore.ts` lines 276-314 where every field checks `urlOverrides.X !== undefined ? urlOverrides.X : envX`. No discrepancy found for the traced fields.

---

## E. Template and Relationship System Reference

### Supported relationship archetypes (verified in `familyTemplates.ts` L1-108 and `useBirthdayStore.ts` L10)

The store `RelationshipType` (L10) supports 17 values:
`partner`, `friend`, `family`, `sibling`, `brother`, `sister`, `father`, `mother`, `grandfather`, `grandmother`, `uncle`, `aunt`, `cousin`, `son`, `daughter`, `guardian`, `colleague`, `mentor`.

Note: `custom` exists in `familyTemplates.ts` `FamilyMemberType` (L8) but **not** in the store's `RelationshipType`. The store defaults unknown relationships to `'family'` (`useBirthdayStore.ts` L145).

### Per-archetype influence matrix

| Archetype | Default pacing | Default mood | Emoji kit | Letter source | Specialized profile fields |
|-----------|---------------|--------------|-----------|---------------|---------------------------|
| `partner` | `slow` | `romantic` | `emojiKits.ts` L96-123 | `templates.ts` L1-23 / locale variants | Love language, anniversary, pet names |
| `friend` | `fast` | `energetic` | `emojiKits.ts` L124-151 | `templates.ts` L24-54 | Inside jokes, adventures |
| `brother` / `sister` | `moderate` | `warm` | `emojiKits.ts` L208-263 | `templates.ts` L96-117 | Sibling role, childhood memories |
| `father` / `mother` | `moderate` | `warm` | `emojiKits.ts` L264-319 | `templates.ts` L118-137 | Wisdom, lessons, warmth |
| `grandfather` / `grandmother` | `moderate` | `warm` | `emojiKits.ts` L320-375 | `templates.ts` L138-157 | Legacy, stories, lullabies |
| `uncle` / `aunt` / `cousin` | `moderate` | `warm` | `emojiKits.ts` L376-459 | `templates.ts` L158-181 | Gatherings, adventures |
| `son` / `daughter` | `moderate` | `warm` | `emojiKits.ts` L460-515 | `templates.ts` L182-201 | Milestones, dreams |
| `guardian` / `mentor` | `moderate` | `warm` | `emojiKits.ts` L516-599 | `templates.ts` L202-231 | Mentorship, guidance |
| `colleague` | `moderate` | `warm` | `emojiKits.ts` L544-571 | `templates.ts` L212-221 | Collaboration, projects |
| `family` | `moderate` | `warm` | `emojiKits.ts` L152-179 | `templates.ts` L76-85 | Heritage, traditions |
| `custom` | `moderate` | `warm` | falls back to `family` | `templates.ts` L76-85 | Arbitrary key-values |

### Template system components

- **`SuperPersonalizedLogic.ts`** (`getHighlySpecificLetter`, L7-192): Generates relationship-, gender-, and language-specific letters. Switches on `isFrench`/`isBengali`/`isHindi`/`else`, then on relationship. Falls back to `EMOTIONAL_LETTERS.family` for unknown. Replaces `[Your Name]` / localized variants with `senderName`.
- **`getBigWishes`** (L194-233): Generates wish array. Base 2 wishes + relationship-specific wishes + interest-based wishes (car → 🏎️, coding → 💻).
- **`emojiKits.ts`** (`getTemplateEmojiKit`, L601-643): Returns per-relationship emoji kit merged with `config.favoriteEmojis` (normalized via `normalizeToEmoji`), interest emojis, and birthday base. Partner variant splits by gender for floating emojis.
- **`familyTemplates.ts`**: Rich `BaseFamilyMemberProfile` schema with `RelationshipMetadata`, `FamilyTimelineEntry`, `FamilyMediaItem`, `PrivacyControls`. 18 specialized interfaces (`SiblingFields`, `ParentFields`, etc.). Factory `createFamilyMemberProfile` (not fully read, truncated at L200).

### Template × env × URL × i18n interactions

- Relationship drives: animation pacing (`getAnimationPacing`, L316-325), mood (`getMood`, L326-333), letter tone (`SuperPersonalizedLogic`), emoji accents (`emojiKits`), theme fonts/gradients (`useDynamicTheme.ts` L22-52).
- Language (`VITE_LANGUAGE` / `?lang=`) controls locale dictionary (`i18n/index.ts` L18-30) and SEO locale (`useDynamicSEO.ts` L118).
- URL params override env at store init; no reactive re-init on param change.

---

## F. Complete Component Inventory

### All 36 files in `src/components/birthday/`

| File | Purpose | Key props/state | Config consumed | Tests |
|------|---------|-----------------|-----------------|-------|
| `SplashScreen.tsx` | Tap-to-begin welcome card; initializes audio | `onStart: () => void` | None directly (theme via CSS vars) | Unknown |
| `PasswordUnlock.tsx` | Secret passcode gate | `onUnlock: () => void` | `config.favoriteColor`, `config.passwordFormat`, `config.passwordHint`, `config.password`, `config.passwordRequired` | Unknown |
| `CinematicIntro.tsx` | Kinetic typewriter, simulated chat, letter reveal | Not read (file exists) | Unknown | Unknown |
| `FakeChatScene.tsx` | 3D tilted phone + iOS glass keypad | Not read | Unknown | Unknown |
| `CakeCutting.tsx` | Cake flavor selector → 3D experience → candle blow | Internal phase state | `config.reducedMotion`, `config.enableMicrophoneCandleBlow` | Unknown |
| `Cake3D.tsx` | Three.js / R3F procedural 3D cake (lazy-loaded) | Not read | Unknown | Unknown |
| `CakeKnife3D.tsx` | 3D knife with drag physics (`@react-spring/three`) | Not read | Unknown | Unknown |
| `CakeKnife.tsx` | 2D knife variant | Not read | Unknown | Unknown |
| `CakeVisuals.tsx` | `CutSparks`, `MagicDust`, `PastryCrumbs` | Not read | Unknown | Unknown |
| `CakeTypes.ts` | `Phase` type, `CakeOption` interface, `CAKE_OPTIONS` (4 cakes), `getCakeName` | N/A (module) | N/A | Unknown |
| `EnvelopeLetterScene.tsx` | Wax-sealed envelope, tap-to-open, grapheme-safe typewriter letter | `onComplete?`, `autoOpen?`, `compact?` | `config.letterOverride`, `config.name`, `config.gender`, `config.interests`, `config.language`, `config.senderName` | Unknown |
| `BalloonPopGame.tsx` | Gamified balloon pop | Not read | Unknown | Unknown |
| `BirthdayQuiz.tsx` | Gamified trivia quiz | Not read | `config.interests`, `config.relationship` | Unknown |
| `WishDeck.tsx` | Tinder-style swipeable wishes deck | Not read | Unknown | Unknown |
| `HeartTree.tsx` | SVG blooming tree finale | `delay` prop | Unknown | Unknown |
| `PhotoGallery.tsx` | Polaroid 3D-tilt carousel with lightbox | Not read | `config.photos`, `config.photoCaptions` | Unknown |
| `VideoGallery.tsx` | Video memories carousel | Not read | `config.videos`, `config.finalVideoUrl` | Unknown |
| `FinalSurprise.tsx` | Grand finale gift reveal + special wishes | Not read | `config.specialMemories` | Unknown |
| `ShareCelebrationModal.tsx` | Glassmorphic sharing suite | `isOpen`, `onClose` | Unknown | Unknown |
| `PremiumFireworks.tsx` | HTML5 Canvas 2D fireworks | `runKey` | Unknown | Unknown |
| `SoundManager.tsx` | Singleton Web Audio manager (BGM + SFX) | N/A (singleton) | `VITE_BGM_URL`, `VITE_SOUND_EFFECTS` | Unknown |
| `SoundToggle.tsx` | Accessible sound mute toggle | Not read | Unknown | Unknown |
| `Confetti.tsx` | Confetti cannon effects | Not read | Unknown | Unknown |
| `Balloons.tsx` | Floating SVG balloons | `count` prop | Unknown | Unknown |
| `Sparkles.tsx` | Sparkle elements | `count` prop | Unknown | Unknown |
| `FloatingElements.tsx` | Ambient floating elements | Not read | Unknown | Unknown |
| `EmojiCursorTrail.tsx` | Emoji cursor trail | Not read | `config.favoriteEmojis` | Unknown |
| `FireflyEffect.tsx` | Ambient fireflies | `intensity` prop | Unknown | Unknown |
| `SparkleRain.tsx` | Ambient sparkle rain | `intensity` prop | Unknown | Unknown |
| `ShootingStars.tsx` | Shooting stars | `count` prop | Unknown | Unknown |
| `HeartProgression.tsx` | Heart progress indicator | `stage` prop | Unknown | Unknown |
| `HighlightedText.tsx` | Highlighted text | Not read | Unknown | Unknown |
| `KineticText.tsx` | Kinetic text animation | Not read | Unknown | Unknown |
| `TypeWriter.tsx` | Typewriter animation | `text`, `speed`, `delay`, `cursor` | Unknown | Unknown |
| `MainBirthday.tsx` | Main celebration stage orchestrator | None (store-driven) | `config.*` (extensive: name, age, relationship, color, interests, giftStage, shareOpen, etc.) | Unknown |

### Shared/UI components

| File | Purpose |
|------|---------|
| `src/components/ErrorBoundary.tsx` | Class-based error boundary, cinematic fallback |
| `src/components/ui/sonner.tsx` | Sonner Toaster + toast wrapper, light theme |

### Components not fully read (limitation)

The following were directory-listed but not fully read due to output constraints: `CinematicIntro.tsx`, `FakeChatScene.tsx`, `Cake3D.tsx`, `CakeKnife3D.tsx`, `CakeKnife.tsx`, `CakeVisuals.tsx`, `BalloonPopGame.tsx`, `BirthdayQuiz.tsx`, `WishDeck.tsx`, `HeartTree.tsx`, `PhotoGallery.tsx`, `VideoGallery.tsx`, `FinalSurprise.tsx`, `ShareCelebrationModal.tsx`, `EmojiCursorTrail.tsx`, `FireflyEffect.tsx`, `FloatingElements.tsx`, `HeartProgression.tsx`, `HighlightedText.tsx`, `KineticText.tsx`, `TypeWriter.tsx`. Their exact props and config dependencies are inferred from imports and usage in `MainBirthday.tsx` but not line-verified.

---

## G. Theme and Visual Architecture

### How color becomes CSS variables (`useDynamicTheme.ts`)

1. Store provides `favoriteColor`, `relationship`, `gender`.
2. `hexToHSL(favoriteColor)` + `hexToRGB(favoriteColor)` (`colorUtils.ts`) convert hex to HSL/RGB.
3. Relationship branch (L22-52):
   - `partner`: romantic gradients, Playfair Display/Dancing Script fonts, slow pacing (2s), large card radius (3rem)
   - `friend`: energetic gradients, Outfit/Inter fonts, fast pacing (0.8s), smaller radius (1.5rem)
   - `family`/else: neutral gradients, Cinzel/Playfair fonts, moderate pacing (1.2s), radius 2rem
4. Gender branch (L54-61): adjusts `--glow-intensity`, `--glass-blur`, `--color-accent-soft`.
5. Single `root.style.cssText` call (L63) injects all variables: `--color-primary`, `--color-primary-rgb`, `--color-primary-low`, `--color-primary-glow`, `--bg-gradient`, `--glow-effect`, `--glass-opacity`, `--font-display`, `--font-body`, `--font-quote`, `--animation-pacing`, `--particle-speed`, `--card-radius`, plus gender vars.

### Tailwind design tokens (`tailwind.config.ts`)

- `darkMode: ["class"]`
- Colors all map to `hsl(var(--*))` CSS custom properties (border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card, sidebar)
- `birthday` sub-palette: `pink`, `purple`, `gold`, `sky`, `coral`, `mint` (all `hsl(var(--birthday-*.))`)
- `borderRadius`: `lg` = `var(--radius)`, etc.
- No custom keyframes beyond accordion; `animate-subtle-float`, `animate-pulse`, `animate-glow-pulse`, `text-gradient-romantic`, `text-glow-rose` are referenced in components but their keyframe definitions were not found in `tailwind.config.ts` or `index.css` (may be in global CSS or inline).

### Hardcoded colors vs dynamic theme

- `useDynamicTheme.ts` is the single dynamic theming path.
- Components use `primaryColor` from store with inline styles (e.g., `PasswordUnlock.tsx` L23, L157-158, L210-213; `MainBirthday.tsx` L49, L354-357).
- Some hardcoded values persist: `SplashScreen.tsx` L40 uses `var(--bg-gradient, radial-gradient(ellipse at 50% 15%, #3b0724 0%, #1a0515 100%))` fallback; `NotFound.tsx` L51 uses hardcoded `radial-gradient(ellipse at center, #2e0827 0%, #1a0515 70%, #0d000a 100%)`.
- `tailwind.config.ts` `birthday.*` colors reference CSS vars that may not be defined globally — potential undefined-var fallback.

### Responsive behavior

- `use-mobile.tsx`: breakpoint 768px, `window.innerWidth < 768`.
- `deviceTier.ts`: mobile = touch AND (small screen OR mobile UA); caps DPR to 1, disables multi-canvas, cursor trail, heavy blur.
- `MainBirthday.tsx`: `isMobile` reduces balloon/sparkle counts (L170-171), disables hover springs (L48 `shouldAnimate`).

### Accessibility

- `SplashScreen.tsx`: `role="button"`, `tabIndex={0}`, `aria-label`, Enter/Space key handling, `sr-only` heading.
- `PasswordUnlock.tsx`: `aria-label` on input, `sr-only` heading, `inputMode="numeric"` for numeric formats.
- `NotFound.tsx`: localized text, semantic links.
- `VITE_REDUCED_MOTION` supported but defaults to `undefined` in store (see C.2).

---

## H. Splash-Screen Implementation Dossier

### Exact component hierarchy

`src/pages/Index.tsx` (phase `splash`) → `motion.div` (AnimatePresence, key="splash") → `SplashScreen` component (`src/components/birthday/SplashScreen.tsx`).

SplashScreen internal structure:
- Outer `div` (role="button", tabIndex=0, full-screen, `var(--bg-gradient)` background, onClick + onKeyDown)
  - `h1.sr-only`: "Birthday Bloom — Magical Cinematic Birthday Celebration"
  - 3 ambient bokeh `div`s (absolute, radial gradients, pointer-events-none)
  - `motion.div` (glassmorphic card, `backdrop-blur-3xl`, rounded-[2.5rem])
    - `div.mb-6` → `HeartProgression stage={1}`
    - `motion.div` (🎂 emoji, text-7xl, whileHover scale/rotate)
    - `h2` (font-display, text-foreground, font-black)
      - `span` (bg-gradient text-transparent): `t('splash.specialSurpriseAwaits')`
      - `span` (font-script, text-gradient-romantic): **"✨ Made with Love ✨"** (HARDCODED, line 79)
    - `motion.div` (button-like, inline-flex): `Sparkles` icon + `t('splash.tapAnywhereToBegin')`
  - Starfield `div` (14 absolutely-positioned stars, random colors/opacities/animations)

### Rendering conditions

- Rendered when `Index.tsx` phase === `"splash"` (L74-84).
- Initial phase determined at mount: URL `?phase=` param if `main`/`intro`/`unlock`, else `"splash"` (L23-31).
- Skip button shown when `phase !== "main" && phase !== "unlock" && config.showSkipButton !== false` (L67-72). Clicking skip sets phase to `"main"` directly (bypasses unlock/intro).
- `onStart` callback: if `isPasswordRequired(config)` → phase `"unlock"`; else → phase `"intro"` (L76-83).
- `isPasswordRequired(config)` (`password.ts` L108-115): `config.passwordRequired !== undefined ? config.passwordRequired : !!config.password`.

### Copy and localization source

| Element | Source | Translated? | Config-driven? |
|---------|--------|-------------|----------------|
| SR-only heading | Hardcoded string | No | No |
| "specialSurpriseAwaits" | `i18n/locales/{en,hi,bn,fr}.ts` `splash.specialSurpriseAwaits` | Yes | No |
| "✨ Made with Love ✨" | **Hardcoded in `SplashScreen.tsx` line 79** | **No** | **No** |
| "tapAnywhereToBegin" | `i18n/locales/{en,hi,bn,fr}.ts` `splash.tapAnywhereToBegin` | Yes | No |
| 🎂 emoji | Hardcoded | N/A | No |
| Background gradient | `var(--bg-gradient)` + hardcoded fallback | N/A | Indirectly (via `favoriteColor` → `useDynamicTheme`) |

**GAP:** The signature phrase "Made with Love" is hardcoded English, not in any locale dictionary, not relationship-variant (no "Made with Fun" for friends), and not overridable via env.

### Template selection

No template selection on splash screen. `HeartProgression stage={1}` is rendered but not relationship-driven at this point. The splash screen does not read `useBirthdayStore` config at all — it is purely presentational with theme CSS vars.

### Theme selection

- Background: `var(--bg-gradient, radial-gradient(...#3b0724...#1a0515...))` — CSS var from `useDynamicTheme.ts` (relationship-dependent gradient) with hardcoded dark fallback.
- Card: `linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)` — hardcoded.
- Emoji drop-shadow: `drop-shadow-[0_10px_30px_rgba(255,107,107,0.5)]` — hardcoded pink, not theme-driven.
- Button hover shadow: `hover:shadow-[0_10px_40px_rgba(255,107,107,0.4)]` — hardcoded pink.

### Styling and animations

- Card entrance: `motion.div` with `initial={{ opacity: 0, scale: 0.9, y: 20 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}`, duration 0.8, ease `[0.22, 1, 0.36, 1]`.
- 🎂 emoji: `whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}`, duration 0.4.
- Button: `whileHover={{ scale: 1.05 }}`, `whileTap={{ scale: 0.96 }}`.
- Stars: 14 elements with CSS `animation: sparkle ... infinite`, staggered delays.
- `animate-subtle-float` and `animate-pulse` classes used — keyframe definitions not found in `tailwind.config.ts` (may be in `index.css` or global styles).

### User interaction

- Tap/click anywhere → `handleTap()`: sets `tapped=true`, `playPop()`, `startMusic()`, `setTimeout(onStart, 700)`.
- Enter or Space key → same `handleTap()` (with `preventDefault`).
- Double-tap guard: `if (tapped) return;`.

### Audio initialization

- `useSoundManager()`: `startMusic()` (BGM loop), `playPop()` (tap sound).
- Audio context resumed on first user gesture (autoplay mitigation).
- `startMusic()` — implementation in `SoundManager.tsx` (not fully read).

### Phase transitions

- Splash → Unlock: when `isPasswordRequired(config)` is true.
- Splash → Intro: when no password required.
- Splash → Main: via skip button (bypasses unlock and intro).
- All transitions use `AnimatePresence mode="wait"` with fade/scale exits (duration 0.85s).

### Accessibility and responsive behavior

- **A11y:** `role="button"`, `tabIndex={0}`, `aria-label` from translation, Enter/Space keyboard support, `focus:ring-2 focus:ring-primary`, `sr-only` heading for screen readers.
- **Responsive:** `max-w-lg w-full`, `p-8 sm:p-12`, `text-2xl sm:text-4xl`, `text-3xl sm:text-5xl` — viewport-relative sizing. No mobile-specific layout changes beyond Tailwind breakpoints.
- **Reduced motion:** No explicit `useReducedMotion` consumption in SplashScreen. Theme `--animation-pacing` is set globally but not read by SplashScreen.

### Related tests

Not line-verified. Test files exist under `src/test/` but splash-specific tests not confirmed from directory listing.

### Existing limitations

1. "Made with Love" is hardcoded English — not translatable, not relationship-variant.
2. No env override for splash copy or emoji.
3. No relationship-driven visual personality on splash (theme CSS vars affect background but copy/emoji static).
4. `VITE_REDUCED_MOTION` not consumed by SplashScreen.
5. Skip button bypasses unlock/intro entirely — may bypass intended narrative.

### Safest extension points for future visual improvements

1. **Copy:** Add `splash.madeWithLove` (or similar) to all 4 locale dictionaries; replace hardcoded line 79 with `t('splash.madeWithLove')`. Add relationship variant if desired (`splash.madeWithLove` vs `splash.madeWithFun`).
2. **Emoji:** Derive from `config` via `useBirthdayStore` or `emojiKits.ts` instead of hardcoded 🎂.
3. **Theme:** Splash already uses `--bg-gradient` CSS var; extend to card gradient, emoji shadow, button shadow.
4. **Relationship styling:** Read `config.relationship` in SplashScreen to vary fonts/gradients beyond CSS vars.
5. **Do not touch:** `Index.tsx` phase transition logic, `useSoundManager` audio init, `AnimatePresence` exit animations.

---

## I. Animation, Timer, and Audio Reference

### Animations

**Framer Motion variants/transitions:**
- `Index.tsx`: phase exits use `AnimatePresence mode="wait"` with fade/scale (0.6s-1.0s).
- `SplashScreen.tsx`: card entrance 0.8s spring `[0.22, 1, 0.36, 1]`; emoji hover 0.4s; button hover/tap.
- `PasswordUnlock.tsx`: error shake `{ x: [0, -10, 10, ...] }` 0.5s; unlock scale/rotate 0.6s; hint height animation 0.3s; localFlash opacity 0.2s.
- `MainBirthday.tsx`: container staggerChildren 0.2s delay 0.5s; item variants y:30→0 duration 0.8s; emoji fall duration 2.5s; megaSurprise `animate-screen-shake` 3s.

**Timers (`setTimeout`/`setInterval`):**
- `SplashScreen.tsx` L22: `setTimeout(onStart, 700)` after tap.
- `PasswordUnlock.tsx` L45: `setTimeout(onUnlock, 1200)` after unlock; L54: `setTimeout(() => setError(false), 600)`; L44: `setTimeout(() => setLocalFlash(false), 300)`.
- `MainBirthday.tsx` L106-111: intro timers (setVisible 100ms, playBoom 600ms, playReveal 1200ms, fireCannon 2000ms); L155: `setTimeout(() => setMegaSurprise(false), 3000)`; L38: `giftTimerRef.current` 2000ms gift party→open.
- `useMicrophoneBlow.ts`: UI published at ~20fps (every 50ms), not 60fps RAF.

**cleanup:**
- `Index.tsx`: no cleanup of intro timers (they fire once).
- `MainBirthday.tsx` L96-116: cleanup clears `giftTimerRef`, `surpriseTimerRef`, `introTimersRef` on unmount.
- `useMicrophoneBlow.ts` L85-85, L229-232: `stopListening()` cancels RAF, stops tracks, closes AudioContext.

**IntersectionObserver:** Used in `HeartTree.tsx` (referenced in architecture.md L147) for stage growth gating — not line-read.

**Reduced motion:** `useReducedMotion()` consumed in `CakeCutting.tsx` L75-78 combined with store `reducedMotion` and perf tier. `useAdaptivePerformance.ts` listens to `matchMedia('(prefers-reduced-motion: reduce)')` changes.

### Audio

**`SoundManager.tsx`** (singleton, not fully read): BGM loop, SFX (`playType`, `playWhoosh`, `playReveal`, `playPop`, `playBoom`), `setBgVolume`, `startMusic`. Autoplay fallback on first user gesture.

**Microphone candle blow (`useMicrophoneBlow.ts`):**
- Web Audio API: `getUserMedia({audio: {echoCancellation:false, noiseSuppression:false, autoGainControl:false}})`, `AudioContext`, `BiquadFilter` highpass 50Hz, `AnalyserNode` FFT 256.
- Analyzes low-frequency bins (1-8, ~80-600Hz) for breath turbulence.
- Smoothes intensity (0.65/0.35 low-pass), accumulates energy, publishes UI at ~20fps.
- Threshold 0.35, required duration 550ms. `triggerManualBlow()` fallback.
- Permission states: `prompt`\|`granted`\|`denied`\|`unsupported`. Cleanup on unmount/disable.
- `CakeCutting.tsx` integrates `useMicrophoneBlow` with `onBlow` handler.

### Timer/countdown audit

No real-time countdown display found in inspected files. `dateUtils.ts` provides `getDaysUntilBirthday`, `isTodayBirthday`, `calculateAge`, `formatBirthdayDisplay` — calculation utilities, not live timers. No `setInterval`-based countdown observed in inspected source. Password gate is static (no expiry). Gift timer is one-shot (2000ms). No interval leak risk identified in inspected code.

---

## J. Localization and Content System Reference

### Supported locales (verified)

| Code | File | Script | Notes |
|------|------|--------|-------|
| `en` | `src/i18n/locales/en.ts` | Latin | Default fallback |
| `hi` | `src/i18n/locales/hi.ts` | Devanagari | Noto Sans Devanagari |
| `bn` | `src/i18n/locales/bn.ts` | Eastern Nagari | Noto Sans Bengali |
| `fr` | `src/i18n/locales/fr.ts` | Latin | French orthography |

### Translation infrastructure

- `src/i18n/index.ts`: `translations` record, `getTranslation()` (normalizes aliases), `getTranslationValue()` (deep key path with English fallback), `interpolate()` (`{{key}}`/`{key}` replacement), `useTranslation()` hook.
- `src/i18n/types.ts`: `TranslationSchema` interface with `common`, `splash`, `intro`, `cake`, `memories`, `quiz`, `gift`, `heartTree`, `chat`, `guestbook` namespaces.
- Language normalization in `useBirthdayStore.ts` L203-211 and `useTranslation.ts` L67-74 — consistent alias handling.

### Fallback logic

- `getTranslationValue` (L39-62): traverses key path; on missing key, falls back to `enTranslations`; if still missing, returns `keyPath` string.
- `useTranslation`: defaults to `'en'` for unrecognized language values.

### Relationship-specific language

- `SuperPersonalizedLogic.ts`: letter content varies by relationship + gender + language. `friend` has sub-variants (`romantic`/`friendly`/`legend`) by gender.
- `getBigWishes`: partner/friend-specific wishes + interest-based wishes (car, coding).
- `emojiKits.ts`: per-relationship signature/cursor/floating/celebration/accent emojis + chat greetings.
- `CakeTypes.ts`: `nameHi`/`nameBn`/`nameFr` per cake; `getCakeName()` selects by locale.

### Hardcoded user-visible strings outside translation dictionaries

- `SplashScreen.tsx` L79: "✨ Made with Love ✨" (NOT translated).
- Various component inline strings (not fully audited due to output constraints).

### Splash screen localization consistency

**Not consistent.** Only `splash.specialSurpriseAwaits` and `splash.tapAnywhereToBegin` are translated. The signature phrase and emoji are hardcoded English.

---

## K. Asset and Dependency Inventory

### Local assets

| Path | Type | Status |
|------|------|--------|
| `src/assets/birthday/cake-maroon.jpg` | Image | **Untracked** (new) |
| `src/assets/birthday/cake-pink.jpg` | Image | **Untracked** (new) |
| `src/assets/birthday/birthday-gold.jpg` | Image | **Untracked** (new) |
| `src/assets/birthday/cake-green.jpg` | Image | **Untracked** (new) |
| `public/og-image.jpg` | Image | Tracked |
| `public/placeholder.svg` | Image | Tracked |
| `public/favicon-*.png`, `favicon.ico`, `apple-touch-icon.png` | Icons | Tracked |
| `public/icon-192x192.png`, `icon-512x512.png` | PWA icons | Tracked |

**Note:** `CakeTypes.ts` L3-6 imports all 4 cake JPEGs. They are untracked (new files) — present on disk but not in git. Build will include them if referenced.

### External assets / network

| Asset | URL | Consumer | Failure mode |
|-------|-----|----------|--------------|
| BGM | `https://assets.mixkit.co/.../2869-preview.mp3` | `SoundManager.tsx` (via `.env`) | Silent if unreachable |
| OG image | `https://birthday-bloom.vercel.app/og-image.jpg` | `useDynamicSEO.ts` L148 | Broken social preview |
| Unsplash images | `https://images.unsplash.com/...` | `.env.example` `VITE_SPECIAL_MEMORIES` default | Broken memory images |
| YouTube/Vimeo/MP4 videos | User-provided `VITE_VIDEO_*` | `VideoGallery.tsx` | Broken embeds |

### Bundle contributors (Rollup manualChunks)

- `three-[hash].js`: Three.js, React Three Fiber, Drei, React Spring, Cake3D, CakeKnife3D
- `templates-[hash].js`: Hindi, Bengali, French template locale files
- `framer-motion-[hash].js`: Framer Motion
- `radix-ui-[hash].js`: Radix UI primitives
- `vendor-[hash].js`: All other node_modules

### Unused/untraced dependencies

- `@radix-ui/react-tooltip` — installed but `ui/` only has `sonner.tsx`; tooltip not confirmed used.
- `canvas-confetti` — installed; `Confetti.tsx` likely uses it (not read).
- `VITE_SONG_URL`, `VITE_VOICE_MESSAGE_URL`, `VITE_TEXT_SIZE`, `VITE_HIGH_CONTRAST`, `VITE_DEBUG`, `VITE_ANALYTICS_ID` — in `.env` but not traced as consumed.

---

## L. Security and Reliability Findings

### Severity ranking

| Severity | Finding | Evidence | Impact |
|----------|---------|----------|--------|
| **High** | Client-side passcode security (obfuscation only) | `password.ts`, `PasswordUnlock.tsx`; passcode + date in bundle | Passcode recoverable via DevTools; false sense of security |
| **High** | All `VITE_*` values public in client bundle | Vite behavior; `.env.example` L11 | Secrets in env exposed to users |
| **Medium** | `.env` on disk contains personal values + undeclared vars | `.env` file (gitignored but present) | Personal data (names, dates) on disk; undeclared vars undocumented |
| **Medium** | URL param `?lock=` defaults to `'1234'` | `urlParams.ts` L161-162 | Weak default passcode |
| **Medium** | URL params can override security settings | `urlParams.ts` L153-157 | `?password=`/`?lock=` can enable/weaken gate |
| **Low** | `VITE_REDUCED_MOTION` store value `undefined` when unset | `useBirthdayStore.ts` L197-199 | Components must handle `undefined`; potential logic bugs |
| **Low** | `custom` archetype in `familyTemplates.ts` but not in store `RelationshipType` | `familyTemplates.ts` L8 vs `useBirthdayStore.ts` L10 | `custom` family profiles fall through to `family` default |
| **Low** | Hardcoded "Made with Love" not translated/localized | `SplashScreen.tsx` L79 | English-only signature phrase |

### Confirmed vs potential

**Confirmed:** Items above with direct code citations are verified from source. The client-side password exposure is architecturally inherent (Vite inlines `VITE_*`), not a specific bug.

**Potential (not confirmed exploitable):** No evidence of XSS, SQL injection, or server-side vulnerabilities (SPA has no backend). Microphone permission is gated behind user gesture and `enabled` prop. External media URLs fail gracefully (broken images/videos, no code execution).

---

## M. Test and Build Report

### Validation commands (not yet executed in this audit)

| Command | Purpose | Status |
|---------|---------|--------|
| `npm run typecheck` | `tsc --noEmit` | Not run |
| `npm run lint` | ESLint 9 | Not run |
| `npm test` | Vitest run (31 files, 497 tests) | Not run |
| `npm run build` | Vite production build to `dist/` | Not run |
| `npm run verify` | typecheck + lint + test + build | Not run |

**Note:** Commands were not executed to avoid mutating the repository (build writes to `dist/`). Test counts (31 files, 497 tests) come from prior context / documentation claims, not from a fresh run in this session.

### Test infrastructure (from `vitest.config.ts`, directory listing)

- Test files under `src/test/`, plus `src/main.test.tsx` and `src/features/core/models/familyTemplates.test.ts`.
- JSDOM environment (mocks Web Audio and WebGL).
- Playwright available as devDependency for E2E.
- 497 tests claimed (per documentation/context); not independently verified in this session.

### Coverage gaps (inferred, not confirmed by test run)

- No splash-screen-specific tests confirmed.
- No password-gate security tests confirmed.
- No URL-parameter precedence tests confirmed.
- No theme/CSS-variable tests confirmed.
- No reduced-motion behavior tests confirmed.

---

## N. Documentation Discrepancies

| Document | Claim | Actual source | Status |
|----------|-------|---------------|--------|
| `package.json` | version `3.5.0` | N/A (source of truth) | — |
| `README.md` | references `3.7.0` | `package.json` says `3.5.0` | **DISCREPANCY** |
| `.env.example` | 38 variables documented | `VITE_FORCE_HIGH_GRAPHICS` used in code but missing | **UNDOCUMENTED VAR** |
| `.env.example` | `VITE_REDUCED_MOTION` default `false` | Store sets `undefined` when unset | **BEHAVIOR DIFFERS** |
| `SplashScreen.tsx` | "Made with Love" implied customizable | Hardcoded, not translated, no env override | **FEATURE GAP** |
| `architecture.md` / `ENV_GUIDE.md` | 53 variables | Registry found 48 example + extra undeclared | **COUNT DISCREPANCY** |
| `familyTemplates.ts` | `custom` archetype | Not in store `RelationshipType` (defaults to `family`) | **TYPE GAP** |

---

## O. Recommended Implementation Map (Splash Screen Redesign)

### Files that would likely change

1. `src/i18n/locales/{en,hi,bn,fr}.ts` — Add `splash.madeWithLove` (and optionally `splash.madeWithFun`) keys.
2. `src/components/birthday/SplashScreen.tsx` — Replace hardcoded "✨ Made with Love ✨" with `t('splash.madeWithLove')`; derive emoji from `config`/`emojiKits`; add relationship variant logic.
3. `src/features/core/store/useBirthdayStore.ts` — No change needed unless adding new splash-specific config fields.
4. `src/features/core/theme/useDynamicTheme.ts` — Already injects relationship-dependent fonts/gradients; splash can consume `--font-display`, `--bg-gradient` CSS vars (already does for background).
5. `src/config/emojiKits.ts` — Already has per-relationship emoji kits; splash can reuse `signature` or `celebration` arrays.

### Mechanisms to reuse

- `useTranslation()` — already imported in SplashScreen (L5).
- `useBirthdayStore` — not currently imported in SplashScreen; add to read `config.relationship`/`config.gender`/`config.favoriteEmojis`.
- `getTemplateEmojiKit(config)` — already exported from `emojiKits.ts`.
- CSS vars `--bg-gradient`, `--font-display`, `--glow-effect` — already injected by `useDynamicTheme` in `Index.tsx` (L36).

### New behavior needed

- Relationship-aware copy variant (e.g., "Made with Fun" for `friend`).
- Config-driven emoji instead of hardcoded 🎂.
- Optional env override for splash copy (`VITE_SPLASH_COPY` or similar).
- `useReducedMotion` consumption to disable sparkle animations.

### Areas to leave untouched

- `Index.tsx` phase transition logic (splash → unlock/intro/main).
- `useSoundManager` audio initialization.
- `AnimatePresence` exit animations.
- `HeartProgression stage={1}` (already present).

---

## P. Known Unknowns and Unanswered Questions

1. Exact test results (pass/fail) — validation commands not run in this session.
2. Whether untracked cake JPEGs are valid images or placeholders.
3. Contents of `src/features/cinematic-story/` directory (not enumerated).
4. Whether `src/components/birthday/` components not fully read (CinematicIntro, FakeChatScene, Cake3D, etc.) have additional config dependencies.
5. Whether `tailwind.config.ts` keyframes (`animate-subtle-float`, etc.) are defined in `index.css` or missing.
6. Whether `vite-env.d.ts` and `tsconfig.app.json`/`tsconfig.node.json` contain additional config.
7. Whether `.env` on disk is actively used or a leftover.
8. Exact test file names and coverage beyond the 497/31 claim.
9. CHANGELOG.md version references (not read).

---

## Q. Handoff Summary for Another AI Agent

### Verified architecture

- **Entry:** `src/main.tsx` → `GlobalErrorBoundary` → `src/App.tsx` (router + ErrorBoundary + Sonner) → `src/pages/Index.tsx` (4-phase FSM).
- **Phases:** `splash` (`SplashScreen`) → `unlock` (`PasswordUnlock`) → `intro` (`CinematicIntro`) → `main` (`MainBirthday` + 35 sub-components).
- **State:** Zustand store `useBirthdayStore` (`src/features/core/store/useBirthdayStore.ts`). Single `config` object (`BirthdayConfig` interface, lines 12-55). URL params override env at init (lines 276-314). No reactive re-init on URL change.
- **Theme:** `useDynamicTheme.ts` injects HSL CSS vars into `:root` based on `favoriteColor` + `relationship` + `gender`.
- **i18n:** 4 locales (en/hi/bn/fr), `useTranslation()` hook, English fallback, grapheme-safe typing.
- **Build:** Vite on port 5000, Rollup manual chunks (three/templates/framer-motion/radix-ui/vendor), content-hashed assets.

### Important file paths

- Config parsing: `src/features/core/store/useBirthdayStore.ts`, `src/features/core/store/urlParams.ts`
- Password: `src/utils/password.ts`
- Theme: `src/features/core/theme/useDynamicTheme.ts`
- SEO: `src/features/core/seo/useDynamicSEO.ts`
- i18n: `src/i18n/index.ts`, `src/i18n/types.ts`, `src/i18n/locales/`
- Templates: `src/config/templates.ts`, `src/config/emojiKits.ts`, `src/config/SuperPersonalizedLogic.ts` (via store)
- Family models: `src/features/core/models/familyTemplates.ts`
- Splash: `src/components/birthday/SplashScreen.tsx`
- Main stage: `src/components/birthday/MainBirthday.tsx`
- Cake: `src/components/birthday/CakeCutting.tsx`, `CakeTypes.ts`, `Cake3D.tsx` (lazy)
- Env template: `.env.example` (tracked), `.env` (gitignored, on disk)
- Vite: `vite.config.ts` (port 5000)
- Tests: `src/test/`, `vitest.config.ts`

### Complete configuration source references

- **Env → store:** `useBirthdayStore.ts` lines 119-272 (all `import.meta.env.VITE_*` reads → `env*` constants → store config).
- **URL → store:** `urlParams.ts` lines 7-170 (`parseBirthdayUrlParams`), applied at `useBirthdayStore.ts` line 272 and lines 276-314.
- **Precedence:** URL > host env > `.env.local` > static defaults.
- **Missing from `.env.example`:** `VITE_FORCE_HIGH_GRAPHICS` (used in code), plus `.env`-only vars (`VITE_THEME`, `VITE_ROLE`, `VITE_GENDER`, `VITE_SONG_URL`, `VITE_VOICE_MESSAGE_URL`, `VITE_TEXT_SIZE`, `VITE_HIGH_CONTRAST`, `VITE_DEBUG`, `VITE_ANALYTICS_ID`).

### Template and theme relationships

- Relationship → pacing (`getAnimationPacing` L316-325), mood (`getMood` L326-333), letter (`SuperPersonalizedLogic`), emoji kit (`emojiKits.ts`), theme fonts/gradients (`useDynamicTheme.ts` L22-52).
- Gender → letter variant, theme glow/blur (`useDynamicTheme.ts` L54-61).
- Language → locale dictionary (`i18n/index.ts`), SEO locale (`useDynamicSEO.ts` L118, L164).

### Splash-screen extension points

- Copy: add `splash.madeWithLove` to all 4 locales; use `t()` in `SplashScreen.tsx` L79.
- Emoji: derive from `emojiKits.getTemplateEmojiKit(config)` instead of hardcoded 🎂.
- Relationship variant: read `config.relationship` via `useBirthdayStore`.
- Theme: already uses `--bg-gradient` CSS var; extend to card/shadow/button.
- Do NOT modify: `Index.tsx` FSM transitions, audio init, exit animations.

### Relevant tests and validation commands

- `npm run typecheck` (`tsc --noEmit`)
- `npm run lint` (ESLint 9)
- `npm test` (Vitest, 31 files / 497 tests claimed)
- `npm run build` (Vite, writes to `dist/`)
- `npm run verify` (all of the above)
- Test location: `src/test/` + `src/main.test.tsx` + `src/features/core/models/familyTemplates.test.ts`

### Confirmed issues

1. Version mismatch: `package.json` 3.5.0 vs README 3.7.0.
2. `.env` on disk with undeclared vars + personal values (gitignored).
3. `VITE_FORCE_HIGH_GRAPHICS` used but missing from `.env.example`.
4. `VITE_REDUCED_MOTION` store default is `undefined`, not `false`.
5. `custom` archetype in models but not in store `RelationshipType`.
6. Client-side passcode = obfuscation only (no real security).
7. Splash screen "Made with Love" hardcoded, not translated, not configurable.
8. All `VITE_*` values public in client bundle.

### Strict constraints for future modifications

- Do NOT store secrets in `VITE_*` variables (client-bundled).
- Do NOT break the 4-phase FSM in `Index.tsx` without updating all phase guards.
- Do NOT remove `import.meta.env` reads from `useBirthdayStore.ts` without updating `.env.example`.
- Do NOT change URL param names in `urlParams.ts` without updating shared links/docs.
- Do NOT assume `VITE_REDUCED_MOTION` is boolean — handle `undefined`.
- Preserve grapheme-safe typing (`Intl.Segmenter`) for Indic locales.

---

**End of report.** All findings are traceable to the cited file paths and line numbers. No repository files were modified during this audit.


---
