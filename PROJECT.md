# Project: Birthday Bloom

## Architecture
Birthday Bloom is a modern, deeply emotional, high-performance birthday celebration web experience.
- **Frontend Core**: React 18 + TypeScript + Vite + Tailwind CSS + Radix UI + Lucide Icons.
- **Animation & 3D Layer**: Framer Motion (page and phase transitions), Three.js + React Three Fiber + Drei + React Spring (procedural 3D cake cutting and slice physics), Canvas 2D (PremiumFireworks, EmojiCursorTrail, SparkleRain, FireflyEffect).
- **State Management**: Zustand store (`src/features/core/store/useBirthdayStore.ts`) parsing URL query parameters and 53 configuration variables from `.env.local` / `import.meta.env`, dynamic CSS variable theme injection (`useDynamicTheme.ts`).
- **SEO & Social Engine**: Runtime SEO manager (`src/features/core/seo/useDynamicSEO.ts`), full Schema.org structured data (WebSite, WebApplication, FAQPage, HowTo, BreadcrumbList, SocialEvent), multilingual sitemap with `hreflang` alternates, crawler directives for search & AI bots, and viral sharing modal (`ShareCelebrationModal.tsx`).
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
| 16 | Dynamic Runtime SEO & GEO Engine | Reactive head tags, SocialEvent schema, URL param routing, and AI bot discovery rules | M5-SEO | SEO Upgrade |
| 17 | Viral Sharing & Referral Modal | 1-click WhatsApp/X/Telegram sharing, native Web Share API, and custom link generator | M5-SEO | Reach Upgrade |
| 18 | Multilingual Sitemaps & Rich Schemas | Full `hreflang` alternates in sitemap.xml, FAQPage, HowTo, and BreadcrumbList JSON-LD schemas | M5-SEO | SEO Upgrade |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Emotional UX, Pacing & Multilingual Narratives | Dynamic title hook, emotional typography, 10+ relationship templates, 4 language engines verification | None | DONE |
| M2 | Codebase Architecture, Memory Leaks & Quality Gates | Pruning dead components, canvas/RAF lifecycle optimization, ensuring 0 circular deps, 0 lint warnings, 0 type errors | None | DONE |
| M3 | Documentation & Knowledge Base Overhaul | Complete sync of 31 obsidian docs, ENV_GUIDE.md, .env.example, README.md, CHANGELOG.md, llm.txt | None | DONE |
| M4 | SEO, OpenGraph & Social Sharing Optimization | index.html canonical, og:locale:alternate, Twitter metadata, JSON-LD schemas, site.webmanifest theme sync | None | DONE |
| E2E | E2E Testing Track | Tier 1-4 opaque-box test suite, automated test runner, publish TEST_READY.md | None | DONE |
| Final | 100% E2E Pass & Adversarial Hardening | Pass 100% E2E test suite (319/319 tests), Tier 5 Challenger stress testing, and Forensic Integrity Audit | M1, M2, M3, M4, E2E | DONE |
| M5 | Advanced SEO & Viral Reach Upgrade | Dynamic SEO manager, URL query param parser, viral sharing modal, FAQPage/HowTo schemas, multilingual hreflang sitemap, AI bot rules | M1-M4 | DONE |

## Code Layout
- `src/features/core/seo/`: `useDynamicSEO.ts` (Reactive head and schema metadata)
- `src/features/core/store/`: `useBirthdayStore.ts`, `urlParams.ts` (Central state & query param engine)
- `src/config/`: `templates.ts`, `bengaliTemplates.ts`, `hindiTemplates.ts`, `frenchTemplates.ts`, `birthday.ts`, `themes.ts`
- `src/components/birthday/`: Active visual, narrative, and interactive celebration components (30 active components including `ShareCelebrationModal.tsx`)
- `src/i18n/locales/`: `en.ts`, `bn.ts`, `hi.ts`, `fr.ts`
- `obsidian-docs/`: 31 markdown technical, architectural, and user guides
- `public/`: Assets, audio, favicon, `site.webmanifest`, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`
- `src/test/`: Unit, integration, stress, SEO, and E2E test suites (17 suites, 408 passing tests)
