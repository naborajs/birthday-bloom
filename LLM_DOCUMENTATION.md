# Birthday Bloom — LLM & AI Documentation

> Feed this document into any LLM (ChatGPT, Claude, Gemini, etc.) before asking it to work on the Birthday Bloom project. It contains everything the model needs to understand the codebase, architecture, configuration system, and author goals.

---

## 1. PROJECT IDENTITY

### What is Birthday Bloom?

Birthday Bloom is a fully open-source, cinematic, interactive birthday celebration landing page. It is **env-first**: names, relationship types, messages, colors, photos, videos, audio, visible sections, animation behavior, and family metadata can all be customized through environment variables (`.env.local`) or URL query parameters — **without editing any React source code**.

- **Author:** Naboraj Sarkar
- **Repository:** https://github.com/naborajs/birthday-bloom
- **Current version:** v3.5.0 (package.json); README references v3.7.0
- **License:** MIT
- **Live docs portal:** https://naborajs.me/projects/birthday-bloom/docs

### Why this project exists

Most birthday landing pages are static templates. Birthday Bloom treats the browser as a stage. It uses a linear narrative state machine (`splash → unlock → intro → main`) with Framer Motion timelines, asynchronous delays, audio/haptic feedback, Three.js 3D elements, and Canvas 2D effects to guide users through an emotional journey — from splash screen to password gate, cinematic intro, and finally an interactive celebration dashboard.

**Goal:** Empower non-developers to create premium, personalized birthday websites without writing code, via a single `.env.local` file or a customized URL link.

---

## 2. HOW THE PROJECT WORKS

### The four-phase state machine

Located in `src/pages/Index.tsx`. The top-level experience coordinates sequential phases:

| Phase | Component | Trigger to Next |
|-------|-----------|-----------------|
| `splash` | `SplashScreen.tsx` | Tap-to-begin → `unlock` (or `intro` if no password required) |
| `unlock` | `PasswordUnlock.tsx` | Correct passcode → `intro` |
| `intro` | `CinematicIntro.tsx` | Storyline completion or Skip → `main` |
| `main` | `MainBirthday.tsx` | Celebration dashboard (hero, cake, quiz, galleries, finale) |

The phase can be overridden at load via `?phase=main|intro|unlock|splash` in the URL.

### Data flow (env → store → components)

1. **Environment variables** (`VITE_*` prefixed) are read via `import.meta.env` in `src/features/core/store/useBirthdayStore.ts`.
2. **URL query parameters** override env values via `parseBirthdayUrlParams()` in `src/features/core/store/urlParams.ts`.
3. The merged config is stored in a **Zustand 5 store** (`useBirthdayStore`).
4. Components subscribe to the store (`useBirthdayStore(state => state.config)`) and render accordingly.
5. `useDynamicTheme.ts` injects HSL/RGB CSS variables from `favoriteColor` into `:root`.
6. `useDynamicSEO.ts` injects dynamic meta tags, OpenGraph, Twitter Cards, and Schema.org JSON-LD (`SocialEvent`, `WebSite`, etc.).
7. `useTranslation()` (from `src/i18n`) switches UI copy between `en`, `bn`, `hi`, `fr`.

### Customization priority order

1. Host environment variables (Vercel/Netlify dashboard)
2. `.env.local` / `.env` values (local dev)
3. Built-in static fallbacks in code
4. URL query parameters override env values at runtime

---

## 3. TECH STACK

| Layer | Technology | Version / Role |
|-------|-----------|----------------|
| Framework | React 18 | Concurrent mode, client-side rendering |
| Language | TypeScript 5.x | Strict mode |
| Build | Vite 8 | Dev server on port 5000, HMR, Rollup chunking |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate` | Utility classes + custom HSL CSS variables |
| Animation | Framer Motion 13 | Physics-spring transitions, `AnimatePresence`, layout animations |
| 3D WebGL | Three.js + React Three Fiber + Drei + `@react-spring/three` | Procedural 3D cake, knife, lazy-loaded 3D chunks |
| Icons | Lucide React | UI icons throughout |
| State | Zustand 5 | Central store + env parsing + URL param merging |
| Audio | Web Audio API (custom `SoundManager.tsx`) | BGM loop, SFX, autoplay mitigation |
| i18n | Custom type-safe engine (`useTranslation`) | `en`, `bn`, `hi`, `fr` with grapheme-safe typing |
| Testing | Vitest 3 + Playwright | 31 test files, 497 tests |
| Lint/Typecheck | ESLint 9 + TypeScript `tsc --noEmit` | Part of `npm run verify` |

---

## 4. CORE DIRECTORY STRUCTURE

```
birthday-bloom/
├── .env.example              # 53 environment variables template
├── ENV_GUIDE.md              # Master env customization reference
├── README.md                 # Project intro + video guides + visual showcase
├── LLM_DOCUMENTATION.md      # This file (AI ingestion guide)
├── public/llms.txt           # AI-friendly root developer map
├── public/llms-full.txt      # Comprehensive LLM reference
├── public/sitemap.xml        # Multilingual XML sitemap with hreflang
├── public/robots.txt         # Crawler rules
├── public/site.webmanifest   # PWA manifest
├── obsidian-docs/            # 47-note technical documentation vault
│   ├── DOCUMENTATION_INDEX.md
│   ├── architecture.md       # System architecture & FSM
│   ├── family-system.md      # 18 relationship archetypes
│   ├── template-architecture.md # Data flow & template inheritance
│   ├── ENV_GUIDE.md          # Complete env variable registry
│   ├── URL-Parameters.md     # Query parameter matrix
│   ├── developer-guide.md    # Developer extension patterns
│   ├── Adaptive-Performance-and-Mobile-Optimization.md
│   ├── Microphone-Candle-Blowing.md
│   ├── Guestbook-and-Live-Wishes.md
│   ├── SEO-guide.md          # GEO / JSON-LD structured data
│   └── ... (47 notes total)
├── src/
│   ├── App.tsx               # App shell: router, ErrorBoundary, Sonner toaster
│   ├── main.tsx              # React entry point
│   ├── pages/
│   │   ├── Index.tsx         # 4-phase state machine
│   │   └── NotFound.tsx      # Client-side 404 handler
│   ├── components/birthday/  # 35 celebration components (see below)
│   ├── components/ui/        # Design primitives (sonner, tooltip)
│   ├── components/ErrorBoundary.tsx # Cinematic error recovery UI
│   ├── config/               # Audio assets, wish templates, emoji kits, cultural letters
│   ├── features/core/store/
│   │   ├── useBirthdayStore.ts   # Zustand store, env parsing, config interface
│   │   ├── urlParams.ts          # URL query parameter parser
│   │   └── SuperPersonalizedLogic.ts # Tailored letter generation
│   ├── features/core/models/familyTemplates.ts # 18 member archetypes + factories
│   ├── features/core/theme/useDynamicTheme.ts # CSS variable token injection
│   ├── features/core/seo/useDynamicSEO.ts # Dynamic meta + Schema.org JSON-LD
│   ├── i18n/                 # en.ts, bn.ts, hi.ts, fr.ts + index.ts + types.ts
│   ├── hooks/                # use-mobile.tsx, useAdaptivePerformance.ts, useMicrophoneBlow.ts
│   ├── lib/                  # Tailwind class merge utility
│   ├── test/                 # Vitest infrastructure (497 tests)
│   └── utils/                # password, date, color, media utilities
├── docs/screenshots/         # 25 verified UI screenshots
├── docs/diagrams/            # Architecture & multilingual matrix diagrams
├── scripts/                  # Build/deployment scripts
├── skills/                   # AI agent skill definitions
├── .agents/                  # Agent configuration
├── vite.config.ts            # Vite config: port 5000, manual chunks (three/framer-motion/vendor)
├── tailwind.config.ts        # Tailwind config + custom HSL tokens
├── postcss.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vitest.config.ts
└── vercel.json               # Vercel deployment config
```

### Key celebration components (`src/components/birthday/`)

| Component | Purpose |
|-----------|---------|
| `SplashScreen.tsx` | Tap-to-begin welcome card; initializes Web Audio context |
| `PasswordUnlock.tsx` | Secret passcode gate with dynamic date-based hints |
| `CinematicIntro.tsx` | Kinetic typewriter text, simulated chat, emotional narrative |
| `FakeChatScene.tsx` | 3D tilted phone + iOS glass keypad simulator |
| `CakeCutting.tsx` | Cake flavor selector → 3D cake experience → candle blow |
| `Cake3D.tsx` | Three.js / React Three Fiber procedural 3D cake model (lazy-loaded) |
| `CakeKnife3D.tsx` | 3D stainless steel knife with drag physics (`@react-spring/three`) |
| `EnvelopeLetterScene.tsx` | Wax-sealed envelope, tap-to-open, grapheme-safe typewriter letter |
| `BalloonPopGame.tsx` | Gamified balloon pop with celebratory words |
| `BirthdayQuiz.tsx` | Gamified trivia quiz tailored to recipient interests |
| `WishDeck.tsx` | Tinder-style swipeable wishes deck |
| `HeartTree.tsx` | SVG blooming tree finale with heart leaves & memory polaroids |
| `PhotoGallery.tsx` | Polaroid 3D-tilt carousel with lightbox & captions |
| `VideoGallery.tsx` | Video memories carousel (YouTube/MP4 embeds) |
| `FinalSurprise.tsx` | Grand finale gift reveal + special wishes grid |
| `ShareCelebrationModal.tsx` | Glassmorphic sharing suite (WhatsApp, X, Telegram, FB, LinkedIn, Copy) |
| `PremiumFireworks.tsx` | HTML5 Canvas 2D fireworks engine |
| `SoundManager.tsx` | Singleton Web Audio manager (BGM + SFX) |
| `SoundToggle.tsx` | Accessible sound mute toggle |
| `MainBirthday.tsx` | Main celebration stage orchestrator |
| `Confetti.tsx` | Confetti cannon effects |
| `Balloons.tsx`, `Sparkles.tsx`, `FloatingElements.tsx` | Ambient decorative elements |

---

## 5. CONFIGURATION SYSTEM

### Environment variables (`.env.local`)

All `VITE_*` variables are public in the client bundle — **never store secrets here**. The app reads them at module load via `import.meta.env`. Copy `.env.example` to `.env.local` and restart the dev server after editing.

**Most commonly used variables:**

| Variable | Alias | Type | Default | Description |
|----------|-------|------|---------|-------------|
| `VITE_BIRTHDAY_NAME` | `VITE_USER_NAME` | string | `""` | Recipient's name (personalizes titles, cards, letters) |
| `VITE_BIRTHDAY_AGE` | — | number | `null` | Age; drives "Happy Nth Birthday" heading |
| `VITE_BIRTHDAY_GENDER` | — | `female\|male\|other` | `other` | Pronouns, tone nuances, theme shifts |
| `VITE_BIRTHDAY_DATE` | — | ISO date | `null` | Birthday; drives passcode auto-generation & age |
| `VITE_BIRTHDAY_RELATIONSHIP` | `love`, `bestie`, `mom`, `dad`, etc. | `partner\|friend\|family\|brother\|sister\|father\|mother\|grandfather\|grandmother\|uncle\|aunt\|cousin\|son\|daughter\|guardian\|sibling\|colleague\|mentor\|custom` | `friend` | Controls tone, letters, quiz questions, default pacing |
| `VITE_BIRTHDAY_WISHER_NAME` | `VITE_WISHER_NAME` | string | `""` | Sender name (letters, cards, footer signoff) |
| `VITE_LANGUAGE` | `VITE_LANG` | `en\|bn\|hi\|fr` | `en` | Localization (English, Bengali, Hindi, French) |
| `VITE_BIRTHDAY_COLOR` | `VITE_THEME_COLOR`, `VITE_FAVORITE_COLOR` | hex | `#FF6B6B` | Primary accent; injects HSL CSS variables into `:root` |
| `VITE_BIRTHDAY_INTERESTS` | `VITE_FAVORITE_ITEMS` | CSV | `""` | Interests (car, music, art, coding, gaming, nature, travel, food, sport, space); drives hero badges + quiz |
| `VITE_FAVORITE_EMOJIS` | `VITE_BIRTHDAY_EMOJIS` | CSV/pipe | `""` | Custom emoji set for trails & bursts |
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | `VITE_CUSTOM_MESSAGE` | string | `""` | Custom message across cards & letters |
| `VITE_BIRTHDAY_LETTER_TITLE` | `VITE_CARD_TITLE_SURPRISE` | string | `"A Special Letter Just for You 💌"` | Letter modal heading |
| `VITE_BIRTHDAY_LETTER_OVERRIDE` | — | escaped string | `""` | Full custom letter body (uses `\n` for breaks) |
| `VITE_SPECIAL_MEMORIES` | — | `title;url\|title;url` | `""` | Finale memory grid items |
| `VITE_PHOTOS` / `VITE_PHOTO_1..6` | — | URLs | `""` | Gallery photos; fallback to localized placeholder card |
| `VITE_PHOTO_CAPTIONS` | — | CSV/pipe | `""` | Gallery captions |
| `VITE_VIDEO_1..3` | — | URLs | `""` | Video carousel memories |
| `VITE_FINAL_VIDEO_URL` | — | URL | `""` | Grand finale closing video |
| `VITE_BGM_URL` | `VITE_SOUND_URL` | URL | Built-in track | Background music |
| `VITE_SOUND_EFFECTS` | — | boolean | `true` | UI SFX toggle |
| `VITE_PASSWORD_REQUIRED` | — | boolean | `false` | Force passcode gate |
| `VITE_PASSWORD` | — | string | `""` | Manual passcode override |
| `VITE_PASSWORD_HINT` | — | string | `""` | Custom hint on lock screen |
| `VITE_PASSWORD_FORMAT` | — | `MMDD\|DDMM\|YYYYMMDD\|YYYY-MM-DD\|MM-DD\|DD-MM\|YYYY` | `MMDD` | Passcode format derived from birthday date |
| `VITE_FAMILY_MEMBER_TYPE` | — | 18 archetypes | `friend` | Family profile archetype |
| `VITE_FAMILY_PROFILE_JSON` | — | JSON | `null` | Complete FamilyMemberProfile (overrides individual fields) |
| `VITE_SHOW_CAKE_SECTION` | — | boolean | `true` | Toggle 3D cake cutting |
| `VITE_SHOW_PHOTO_SECTION` | `VITE_SHOW_PHOTOS_SECTION` | boolean | `true` | Toggle photo gallery |
| `VITE_SHOW_QUIZ_SECTION` | — | boolean | `true` | Toggle trivia quiz |
| `VITE_SHOW_HEART_TREE_SECTION` | — | boolean | `true` | Toggle HeartTree finale |
| `VITE_SHOW_VIDEO_SECTION` | — | boolean | `true` | Toggle video gallery |
| `VITE_SHOW_FINAL_SURPRISE` | — | boolean | `true` | Toggle grand finale |
| `VITE_SHOW_GIFT_SECTION` | — | boolean | `true` | Toggle gift modal |
| `VITE_SHOW_SKIP_BUTTON` | — | boolean | `true` | Toggle skip intro button |
| `VITE_SHOW_GUESTBOOK_SECTION` | `VITE_SHOW_GUESTBOOK` | boolean | `true` | Toggle live wishes board |
| `VITE_ENABLE_MIC_BLOW` | — | boolean | `true` | Toggle microphone candle blowing |
| `VITE_ANIMATION_SPEED` | — | `slow\|moderate\|fast` | By relationship | Narrative pacing |
| `VITE_ANIMATION_INTENSITY` | — | `low\|medium\|high` | `high` | Particle/effect density |
| `VITE_PARTICLE_COUNT` | — | number | `25` | Base ambient particle count |
| `VITE_REDUCED_MOTION` | — | boolean | `false` | Force reduced motion (accessibility) |
| `VITE_FORCE_HIGH_GRAPHICS` | — | boolean | `false` | Force desktop-tier graphics on any device |

### URL query parameters (zero-config sharing)

URL params **override** env values at runtime. No rebuild needed.

| Parameter | Alias | Type | Example |
|-----------|-------|------|---------|
| `name` | `n` | string | `?name=Sophia` |
| `rel` / `relationship` | `r` | archetype | `?rel=partner` |
| `lang` / `language` | `l` | `en\|bn\|hi\|fr` | `?lang=fr` |
| `age` | `a` | number | `?age=25` |
| `sender` / `wisher` | `s` | string | `?sender=Alex` |
| `msg` / `message` | — | string | `?msg=Happy+Birthday!` |
| `color` | `c` | hex | `?color=%23FF6B6B` |
| `speed` | — | `slow\|moderate\|fast` | `?speed=slow` |
| `sound` | — | boolean | `?sound=false` |
| `passcode` / `pass` / `password` / `lock` / `p` | — | string | `?passcode=0714` |
| `passwordHint` / `hint` | — | string | `?hint=Our+Anniversary` |
| `interests` | `i` | CSV | `?interests=cars,gaming` |
| `video` / `v` | — | URL | `?video=https://youtu.be/xyz` |
| `phase` | — | `splash\|unlock\|intro\|main` | `?phase=main` |

### Family system (18 relationship archetypes)

Defined in `src/features/core/models/familyTemplates.ts`. Each archetype extends `BaseFamilyMemberProfile` with a `specialized` extension:

| Archetype | Category | Direction | Specialized Fields |
|-----------|----------|-----------|-------------------|
| `partner` | chosen | chosen | Love language, anniversary, shared pet names |
| `friend` | friend | chosen | Inside jokes, late-night talks, epic trips |
| `brother` / `sister` | sibling | sibling | Childhood memories, nickname, rivalry jokes |
| `father` / `mother` | parent | ancestor | Wisdom quotes, life lessons, warmth |
| `grandfather` / `grandmother` | grandparent | ancestor | Legacy stories, generational blessings |
| `uncle` / `aunt` / `cousin` | relative | extended | Family gatherings, adventures |
| `son` / `daughter` | child | descendant | Pride milestones, future dreams |
| `guardian` / `mentor` | guardian | ancestor | Mentorship, career inspiration, protection |
| `colleague` | colleague | chosen | Team collaboration, project triumphs |
| `family` | family | family | Shared heritage, holiday traditions |
| `custom` | custom | custom | Arbitrary user-defined key-values |

Relationship drives: emotional letter tone, quiz questions, emoji accents, default animation pacing (`slow` for partner, `fast` for friend, `moderate` otherwise), and default mood (`romantic`/`energetic`/`warm`).

---

## 6. INTERNATIONALIZATION (i18N)

### Supported languages

| Code | Name | Script | Typography | Tone |
|------|------|--------|------------|------|
| `en` | English | Latin | Modern expressive storytelling | Partner, friend, family archetypes |
| `bn` | Bengali | Eastern Nagari | Noto Sans Bengali | Authentic idioms, warm poetic phrasing |
| `hi` | Hindi | Devanagari | Noto Sans Devanagari | Respectful honorifics, poetic blessings |
| `fr` | French | Latin | European typography | Poetic elegance, cultural resonance |

### How i18n works

- `src/i18n/index.ts` exports `useTranslation()` returning `{ t, language, isHindi, isBengali, isFrench }`.
- `src/i18n/types.ts` defines the `TranslationSchema` type (type-safe keys).
- `src/i18n/locales/{en,bn,hi,fr}.ts` are locale dictionaries.
- **Grapheme-safe typing:** Custom typewriter and kinetic text animations operate on Unicode grapheme clusters (via `Intl.Segmenter` with `granularity: "grapheme"`), preventing diacritic/matra character splits in Indic scripts.
- Language is set via `VITE_LANGUAGE` env var or `?lang=` URL param.

### Emotional letters & templates

- `src/features/core/store/SuperPersonalizedLogic.ts` exports `getHighlySpecificLetter()` — generates relationship-, gender-, interests-, and language-specific letters.
- `src/config/templates.ts` — cultural emotional letters, quotes, and tone presets.
- `src/config/hindiTemplates.ts`, `src/config/bengaliTemplates.ts`, `src/config/frenchTemplates.ts` — locale-specific special quotes.
- `src/config/emojiKits.ts` — `getTemplateEmojiKit(config)` returns relationship-specific emoji sets (signature + celebration emojis).
- `VITE_BIRTHDAY_LETTER_OVERRIDE` can replace template letters entirely (supports `\n` for line breaks).

---

## 7. DEVELOPER GUIDE

### Prerequisites

- Node.js (check `.nvmrc` for version)
- npm (comes with Node)

### Install & run

```bash
# 1. Clone
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env.local

# 4. Edit .env.local with your values (name, relationship, color, etc.)

# 5. Start dev server (port 5000)
npm run dev

# 6. Open http://localhost:5000/
```

### Available scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server on `0.0.0.0:5000` with HMR |
| `npm run build` | Production build via Vite (output to `dist/`) |
| `npm run build:dev` | Development-mode build |
| `npm run lint` | ESLint 9 check |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Watch-mode tests |
| `npm run verify` | Full CI: typecheck + lint + test + build |

### Adding new components

1. Place celebration components in `src/components/birthday/`.
2. Import and use them in `src/pages/Index.tsx` (phase-gated) or `src/components/birthday/MainBirthday.tsx` (main stage).
3. Section visibility should be controlled via a `VITE_SHOW_*_SECTION` boolean in `useBirthdayStore.ts`.
4. Add corresponding screenshot to `docs/screenshots/` and reference in `README.md`.
5. Run `npm run verify` before committing.

### AI coding agent directive

When asking an AI to customize Birthday Bloom, state this first:

> This project is already built to be customized through env values and URL parameters. Before editing components or templates, check `.env.example`, `obsidian-docs/URL-Parameters.md`, and `obsidian-docs/ENV_GUIDE.md`, then tell me which env keys or parameters to update.

Do not rewrite component code for simple personalization (name, color, message, language, interests). Use env vars or URL params instead.

### Deployment

- **Vercel (recommended):** Fork repo → import to Vercel → add `VITE_*` variables in Environment Variables dashboard → Deploy.
- Build output goes to `dist/`. Vite config uses manual chunking: `three-[hash].js` (Three.js/R3F), `framer-motion-[hash].js`, `vendor-[hash].js`, `templates-[hash].js` (locale templates).
- `vercel.json` configures deployment settings.

### Testing

- 31 test files, 497 passing tests (Vitest 3).
- Tests cover: components, SEO, i18n, family templates, performance lifecycle, challenger stress, multilingual, grapheme safety.
- JSDOM mocks Web Audio and WebGL for headless testing.
- Playwright is available for E2E.

### Port configuration

- Dev server: `0.0.0.0:5000` (configured in `vite.config.ts`).
- If port 5000 is occupied, Vite will suggest an alternative or you can set `PORT` env var.

---

## 8. AUTHOR'S GOALS & PROJECT MISSION

### Mission statement

> To empower users with the ability to create 1%-tier premium birthday websites without writing code.

### Core philosophy

1. **Env-first customization:** 53 environment variables cover identity, aesthetics, storytelling, media, audio, sections, animation, accessibility, security, and family metadata. Normal users should never need to touch React source code to personalize the experience.
2. **Zero-config sharing:** URL query parameters let anyone share a fully customized celebration link instantly — no build, no redeploy, no server.
3. **Cinematic narrative:** A 4-phase state machine (`splash → unlock → intro → main`) creates an emotional arc, not just a static page.
4. **Inclusive by design:** Four languages (en/bn/hi/fn) with grapheme-safe typography, reduced-motion support, mobile-adaptive performance, and accessible UI patterns.
5. **Open source & contributor-friendly:** MIT license, good-first-issues, Hacktoberfriendly, conventional commits, 47-note Obsidian documentation vault.

### What the author values

- **Brand identity:** Maintain the "Naboraj Sarkar" identity across the project.
- **Dual-tier customization:** Always recommend ENV or Static Config before code edits.
- **Separation of concerns:** Library components (UI primitives) vs. birthday-specific components (celebration scenes).
- **Performance:** 60fps target, adaptive device-tier gating, lazy-loaded Three.js chunks, reduced-motion mode.
- **SEO/GEO:** Dynamic Schema.org JSON-LD, OpenGraph, multilingual sitemap with hreflang, AI bot discovery rules.
- **Accessibility:** ARIA labels, skip buttons, sound toggle, reduced motion, grapheme-safe text rendering.

### Quick reference for AI models

| Task | Where to look | What to change |
|------|--------------|----------------|
| Change name/age/color/language | `.env.local` or `?name=`, `?color=`, `?lang=` | Env vars / URL params — **do not edit components** |
| Add/remove a section | `useBirthdayStore.ts` + `VITE_SHOW_*` | Add boolean + guard in `MainBirthday.tsx` |
| Add a new language | `src/i18n/locales/` | New `{code}.ts` + register in `index.ts` |
| Add a new relationship archetype | `familyTemplates.ts` | New specialized fields + factory function |
| Customize the emotional letter | `SuperPersonalizedLogic.ts` or `VITE_BIRTHDAY_LETTER_OVERRIDE` | Edit logic or set env override |
| Change theme color | `VITE_BIRTHDAY_COLOR` | Injects HSL CSS variables automatically |
| Add a screenshot | `docs/screenshots/` | Capture verified UI + reference in `README.md` |
| Deploy | Vercel dashboard | Add `VITE_*` vars → Deploy |

### Canonical documentation links

- Project portal: https://naborajs.me/projects/birthday-bloom/docs
- Obsidian vault (local): `obsidian-docs/DOCUMENTATION_INDEX.md`
- AI ingestion: `public/llms.txt` and `public/llms-full.txt`
- This file: `LLM_DOCUMENTATION.md`

---



