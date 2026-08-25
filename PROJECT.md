# Project: Birthday Bloom

## Architecture
Birthday Bloom is a modern, deeply emotional, high-performance birthday celebration web experience.
- **Frontend Core**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI + Lucide Icons.
- **Animation & 3D Layer**: Framer Motion (page and phase transitions), Three.js + React Three Fiber + Drei + React Spring (procedural 3D cake cutting and slice physics), Canvas 2D (PremiumFireworks, EmojiCursorTrail, SparkleRain, FireflyEffect).
- **State Management**: Zustand store (`src/features/core/store/useBirthdayStore.ts`) parsing 53 configuration variables and aliases from `.env.local` / `import.meta.env`, dynamic CSS variable theme injection (`useDynamicTheme.ts`).
- **Audio & Haptics Subsystem**: Singleton `AudioManager` (`src/components/birthday/SoundManager.tsx`) managing background music fade-in/fade-out, interactive sound effects (typewriter, chimes, pops, boom), and mobile vibration triggers.
- **Narrative State Machine**: 4 sequential phases (`splash` -> `unlock` -> `intro` -> `main`) with configurable narrative pacing (`fast`, `moderate`, `slow`), 10+ relationship templates, and 4 culturally authentic language engines (`en`, `bn`, `hi`, `fr`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Emotional Relationship Archetypes | 10+ templates (Partner, Friend, Family, Love, Mentor, Colleague, Milestone) with custom styling | M1 | UX Survey |
| 2 | Multilingual Localization Engines | English, Bengali, Hindi, and French culturally authentic letters, wishes, quotes, and UI copy | M1 | UX Survey |
| 3 | Narrative Flow & Pacing Engine | 4-phase journey with speed multipliers, typing effects, and emotional phase transitions | M1 | UX Survey |
| 4 | Sensory & Celebratory Payoff | 3D WebGL cake cutting, candle blowing, canvas fireworks physics, emoji trails, audio/haptic sync | M1 | UX Survey |
| 5 | Dynamic Document Title | Reactive browser document title reflecting the recipient's name and celebration state | M1 | UX/SEO Survey |
| 6 | Codebase Reliability & Memory Safety | Zero circular dependencies, zero memory leaks in RAF/intervals/audio listeners, zero unhandled errors | M2 | Arch Survey |
| 7 | Component Cleanliness & Optimization | Prune unreferenced legacy components, optimize 60fps canvas/animation loops, ensure smooth mobile/desktop layout | M2 | Arch Survey |
| 8 | Quality Gate Hardening | 100% pass rate for `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` | M2 | Arch Survey |
| 9 | Documentation Suite Overhaul | Overhaul `obsidian-docs/` (all 31 files), fix pruned file citations, update `DOCUMENTATION_INDEX.md` | M3 | Docs Survey |
| 10 | Environment Variable Synchronization | Harmonize all 53 env vars across `useBirthdayStore.ts`, `.env.example`, `ENV_GUIDE.md`, and docs | M3 | Docs Survey |
| 11 | Root Documentation & LLM Specs | Overhaul `README.md`, `CHANGELOG.md`, `llm.txt`, and `public/llms.txt` with up-to-date architecture | M3 | Docs Survey |
| 12 | Advanced SEO & Meta Tags | Canonical URL, `og:locale:alternate` (hi_IN, bn_BD, fr_FR), Twitter creator/card tags | M4 | SEO Survey |
| 13 | Structured JSON-LD & PWA Manifest | Dual `WebSite` + `WebApplication` JSON-LD schemas, harmonize manifest theme color with index.html | M4 | SEO Survey |
| 14 | Opaque-Box E2E Test Suite | 4-Tier requirement-driven test suite validating all templates, languages, env flags, and flows | E2E-Track | Dual Track |
| 15 | Adversarial Coverage Hardening | Tier 5 white-box stress testing, gap analysis, and forensic integrity audit verification | Final-M | Dual Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Emotional UX, Pacing & Multilingual Narratives | Dynamic title hook, emotional typography, 10+ relationship templates, 4 language engines verification | None | DONE |
| M2 | Codebase Architecture, Memory Leaks & Quality Gates | Pruning dead components, canvas/RAF lifecycle optimization, ensuring 0 circular deps, 0 lint warnings, 0 type errors | None | DONE |
| M3 | Documentation & Knowledge Base Overhaul | Complete sync of 31 obsidian docs, ENV_GUIDE.md, .env.example, README.md, CHANGELOG.md, llm.txt | None | DONE |
| M4 | SEO, OpenGraph & Social Sharing Optimization | index.html canonical, og:locale:alternate, Twitter metadata, JSON-LD schemas, site.webmanifest theme sync | None | DONE |
| E2E | E2E Testing Track | Tier 1-4 opaque-box test suite, automated test runner, publish TEST_READY.md | None | DONE |
| Final | 100% E2E Pass & Adversarial Hardening | Pass 100% E2E test suite (319/319 tests), Tier 5 Challenger stress testing, and Forensic Integrity Audit | M1, M2, M3, M4, E2E | DONE |

## Interface Contracts
### `useBirthdayStore.ts` ↔ Components & Views
- `config: BirthdayConfig` contains normalized `name`, `relationship`, `language`, `pacingSpeed`, `soundEnabled`, `reducedMotion`, `familyMember`, `specialMemories`, `passwords`.
- Custom hooks: `useDynamicTheme(config)` injects CSS variables into `document.documentElement.style`.

### `SoundManager.tsx` ↔ Celebration Components
- `audioManager.playEffect(name: 'click' | 'whoosh' | 'pop' | 'sparkle' | 'cheer' | 'firework' | 'cakeCut' | 'blowCandle' | 'giftOpen' | 'levelUp')`
- `audioManager.playBgMusic(url?: string)` / `audioManager.fadeOutBgMusic(durationMs?: number)`

### Environment Variables ↔ `ENV_GUIDE.md` / `.env.example`
- Strict 1:1 mapping for all 53 variables across `Core Configuration`, `Storytelling & Content`, `Family Mode`, `Secret Vault / Password Protection`, and `Visual & Audio Controls`.

## Code Layout
- `src/features/core/store/`: `useBirthdayStore.ts`, `useAudioStore.ts`
- `src/config/`: `templates.ts`, `bengaliTemplates.ts`, `hindiTemplates.ts`, `frenchTemplates.ts`, `birthday.ts`, `themes.ts`
- `src/components/birthday/`: Active visual, narrative, and interactive celebration components (29 active components)
- `src/i18n/locales/`: `en.ts`, `bn.ts`, `hi.ts`, `fr.ts`
- `obsidian-docs/`: 31 markdown technical, architectural, and user guides
- `public/`: Assets, audio, favicon, `site.webmanifest`, `llms.txt`
- `src/test/`: Unit, integration, stress, performance, and E2E test suites (11 suites, 319 passing tests)
