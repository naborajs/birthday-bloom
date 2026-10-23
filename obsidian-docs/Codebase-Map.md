---
tags: [map, index, codebase, files, structure, tests]
aliases: [Codebase Map, File Index, Repository Architecture Map]
---

# Codebase Map

[[DOCUMENTATION_INDEX|Back to Home]]


🌐 **Canonical Web Documentation**: [Codebase Directory Map & File Manifest](https://naborajs.me/projects/birthday-bloom/docs/codebase-map)

This is the central index mapping every significant file and directory in the Birthday Bloom repository.

---

## 1. Root Configuration & Documentation
- `.env.example`: Complete 53 environment variables reference template. See [[ENV_GUIDE]].
- `ENV_GUIDE.md`: Root markdown environment customization guide and recipes.
- `README.md`: Project introduction, architecture overview, and video guides.
- `CHANGELOG.md`: Detailed version history and release notes adhering to Keep a Changelog.
- `CONTRIBUTING.md` & `.github/CONTRIBUTING.md`: Contributor onboarding and 10-minute fast-track guide.
- `PROJECT.md`, `TEST_INFRA.md`, `TEST_READY.md`: Internal engineering specifications and audit status.
- `llm.txt`: AI-friendly developer architectural and project map.
- `vite.config.ts`: Vite build, manual chunk splitting, and Rolldown configuration. See [[Website-Architecture]].
- `package.json`: Project dependencies, npm scripts, and repository metadata.
- `eslint.config.js`: Modern flat ESLint configuration.

---

## 2. `.github/` Workflows & Community Standards
See [[GitHub-Automation]] for a deep dive.
- `workflows/ci.yml`: Continuous integration pipeline (typecheck, lint, 497 tests, build).
- `workflows/repo-health.yml`: Automated repository maintenance and issue assignment.
- `workflows/sync-labels.yml`: GitHub label synchronization.
- `dependabot.yml`: Automated dependency updates with semver-major safety guards.
- `PULL_REQUEST_POLICY.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`: Open-source governance.

---

## 3. `src/` Directory Architecture
The core React 18 client-side application. See [[Website-Architecture]].

### `src/components/`
- **`birthday/`**: All 35 cinematic, narrative, and sensory visual component files. See [[Birthday-Components]] (e.g. [[Cake3D]], [[CakeCutting]], [[WishDeck]], [[EnvelopeLetterScene]], [[BalloonPopGame]], [[HeartTree]], [[CinematicIntro]], [[MainBirthday]], [[PhotoGallery]], [[SoundManager]]).
- **`ui/`**: Focused design system primitives (`sonner.tsx` toast notifications, plus an optional `tooltip.tsx` Radix primitive not imported by the default app shell). See [[UI-Components]].

### `src/features/`
Domain-driven feature modules:
- **`core/store/useBirthdayStore.ts`**: The central Zustand 5 store parsing 53 env variables, aliases, and defaults. See [[architecture-env]].
- **`core/store/urlParams.ts`**: Universal URL query parameter engine (`?name=...&rel=...&lang=...`). See [[URL-Parameters]].
- **`core/seo/useDynamicSEO.ts`**: Reactive runtime document title, meta tags, and Schema.org `SocialEvent` structured data generator. See [[seo-guide]].
- **`core/models/familyTemplates.ts`**: 18 specialized family and relationship member archetypes and factory functions. See [[family-system]].
- **`core/theme/useDynamicTheme.ts`**: Generates and injects dynamic HSL/RGB CSS variable tokens into `:root`.
- **`cinematic-story/`**: Orchestrates narrative scenes, animations, and typography tokens.

### `src/i18n/`
Multi-language localization subsystem:
- `index.ts`: Lightweight type-safe `useTranslation()` hook and fallback engine.
- `locales/`: Authentic localization dictionaries (`en.ts`, `bn.ts`, `hi.ts`, `fr.ts`).

### `src/config/`
- `birthday.ts`: Audio assets configuration and static photo fallbacks.
- `wishTemplates.ts`: 100+ categorized wishes and cards across all 18 relationships.
- `templates.ts`: Cultural emotional letters, quotes, and relationship presets.
- `bengaliTemplates.ts`, `hindiTemplates.ts`, `frenchTemplates.ts`: Language-specific cultural templates.

### `src/pages/`
- `Index.tsx`: Main route managing the 4-phase state machine (`splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`).
- `NotFound.tsx`: Client-side 404 handler with Link navigation back to celebration home.

---

## 4. `src/test/` Test Suites
Comprehensive Vitest 3 test infrastructure (31 test files, 497 tests):
- `setup.ts`: Global test environment mocks (matchMedia, HTMLMediaElement audio stubs).
- `e2e_requirements_tier1_2.test.ts`, `e2e_requirements_tier3_4.test.ts`: Complete opaque-box requirement matrices.
- `adaptive_performance.test.ts`, `challenger_perf_lifecycle.test.ts`, `reduced_motion_perf.test.ts`: Adaptive tiers, bundle/asset budgets, lifecycle cleanup, and reduced-motion behavior.
- `dynamic_seo.test.tsx`, `seo_and_ux_enhancements.test.tsx`: SEO, URL parameters, and OpenGraph tests.
- `interactive_features_envelope_balloons.test.tsx`, `guestbook_section.test.tsx`, `fake_chat_scene.test.tsx`: Interactive activity coverage.
- `wish_deck_and_templates.test.tsx`, `guestbook_templates.test.tsx`, `relationship_templates_deep.test.ts`: Wish deck, template interpolation, and relationship seed coverage.
- `indic_grapheme_stress.test.tsx`, `challenger_stress_multilingual.test.tsx`: Unicode conjunct and typography stress tests.
- `src/main.test.tsx` and `src/features/core/models/familyTemplates.test.ts` live beside their source and are included in the 31-file total.

---

## 5. `public/` Static Assets & Discovery Specs
- `favicon.ico`, `site.webmanifest`: PWA icons, shortcuts, and manifest.
- `sitemap.xml`: Multilingual XML sitemap with `xhtml:link` alternates.
- `robots.txt`: Search bot and AI crawler directives.
- `llms.txt`, `llms-full.txt`: Standard AI discovery specifications.

---
#obsidian #documentation #birthday-bloom #vault #map #structure

---

## 🔍 Scope Boundaries

### What is Present:
- Exhaustive File Tree, Single Responsibility Boundaries for audio, 3D math, translation files, and Zustand slices.

### What is NOT Present:
- Complete source code duplication, Video tutorial embeds (see [[video-tutorials#Official-Masterclass-Curriculum|Video Tutorials]]).
