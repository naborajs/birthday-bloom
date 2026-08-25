# Changelog

All notable changes to Birthday Bloom are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [3.2.0] — 2026-08-26

### Added
- Complete Documentation Overhaul: synchronized all 30 Obsidian docs in `obsidian-docs/`, `DOCUMENTATION_INDEX.md`, `ENV_GUIDE.md`, `.env.example`, `README.md`, `llm.txt`, and `public/llms.txt`.
- Exhaustive Master Reference for all 53 environment variables and aliases in `src/features/core/store/useBirthdayStore.ts`.
- Multi-Language Localization Engine documentation covering English (`en`), Bengali (`bn`), Hindi (`hi`), and French (`fr`) with authentic cultural letters and grapheme-safe typography.
- Documented `VITE_REDUCED_MOTION` as an active runtime configuration option consumed in `useBirthdayStore.ts` and `CakeCutting.tsx`.

### Removed
- Cleaned up 7 unreferenced and dead component files from `src/components/birthday/` (`AnimatedGradient.tsx`, `CelebrationOverlay.tsx`, `EnhancedFloatingElements.tsx`, `FloatingOrbs.tsx`, `MorphingElements.tsx`, `PartyElements.tsx`, `SparkleEffect.tsx`).
- Pruned all stale citations to obsolete files (`src/config.ts`, `dataModels.ts`, `responsiveUtils.ts`, `audioSystem.ts`, and dead effect components) across the documentation suite.

### Changed
- Streamlined `obsidian-docs/DOCUMENTATION_INDEX.md` with read times, tags, and categorized use-case pathways.
- Upgraded root `README.md` and `llm.txt` with up-to-date Three.js/R3F 3D architecture, Canvas 2D physics, and 60fps performance specifications.

## [3.1.1] — 2026-08-25

### Added
- Multi-language empty-state placeholder for Photo Gallery when no custom photos are configured.
- iOS-level glassmorphism and spring animation utilities (`.glass-panel`, `.glass-card`, `.glass-pill`, `.animate-subtle-float`).

### Changed
- Major performance optimization: eliminated massive rendering lag by removing redundant global particle layers (`SparkleEffect`, `PartyElements`, `CelebrationOverlay`, `MorphingElements`, `EnhancedFloatingElements`, `AnimatedGradient`, `FloatingOrbs`) and scaling down active particle counts for silky 60fps performance.
- Upgraded Splash Screen, Message card, Wishes cards, and Action buttons with frosted glass aesthetic and spring physics.
- Replaced hardcoded footer credit with dynamic `VITE_BIRTHDAY_WISHER_NAME` (`senderName`) integration.

### Fixed
- Fixed `Special Memories` video iframe "refused to connect" error by guarding video embeds and hiding the section when no valid media is provided.
- Filtered out stock/placeholder coding images from appearing in `PhotoGallery` and `HeartTree` when custom photos are not provided.
- Cleaned up `.env.example` to document auto-placeholder and wisher name configurations.

## [3.1.0] — 2026-08-20

### Added
- Complete codebase audit, dead code cleanup, and toolchain modernization.
- Empirical test suite for theme variables, error boundaries, SPA routing, and import integrity.
- Persistent audit state tracking and verification logs.

### Changed
- Modernized Vite configuration to use `import.meta.dirname`.
- Upgraded GitHub Actions workflows (`ci.yml`, `sync-labels.yml`, `repo-health.yml`) to supported action versions (`actions/checkout@v4`, `actions/setup-node@v4`, `actions/github-script@v7`).
- Updated TypeScript configuration deprecations (`baseUrl`).
- Modernized ESLint configuration with comprehensive `@typescript-eslint/no-unused-vars` rules.

### Removed
- Pruned orphaned and unused UI components (`toggle.tsx`, `toggle-group.tsx`, `toast.tsx`, `toaster.tsx`, `use-toast.ts`, `NavLink.tsx`).
- Pruned obsolete services and utilities (`audioSystem.ts`, `responsiveUtils.ts`, `config.example.ts`, `dataModels.ts`).

### Fixed
- Resolved all dependency audit vulnerabilities (0 vulnerabilities reported by `npm audit`).
- Fixed `useReducedMotion` and `useIsMobile` reference handling in `CakeCutting.tsx`.
- Fixed React Router SPA Link navigation in `NotFound.tsx`.
- Prevented production error stack trace leaks in `ErrorBoundary.tsx`.

## [3.0.0] — 2026-05-22

### Added
- Family template system (brother, sister profiles with 15 sections each)
- Enhanced data models with 40+ configuration options
- Production-grade validation system (12+ validators)
- Password unlock screen with cinematic UI
- 2,800+ lines of new documentation
- Complete API reference documentation

### Changed
- Env-first architecture solidified — all major sections configurable via env
- Zustand store expanded with family profile support
- Documentation reorganized with new index

### Fixed
- Backward compatibility preserved — all v2.5 features continue to work

## [2.0.0] — 2026-04-01

### Added
- 15 new animation effects (ParticleBurst, MorphingElements, SparkleRain, etc.)
- 6 theme templates (Romantic, Fun, Energetic, Elegant, Playful, Nostalgic)
- Full mobile responsiveness
- Audio system (background music, sound effects)
- Accessibility features (reduced motion, text scaling, high contrast)
- SEO optimization (sitemap, robots.txt, meta tags)
- Error boundary component

### Changed
- State management migrated to Zustand
- Vite configuration with code splitting and cache busting
- Performance optimized — ~188 KB gzipped bundle

## [1.0.0] — 2025-12-01

### Added
- Initial release
- Core birthday experience with cinematic intro
- Interactive cake cutting
- Photo gallery with lightbox
- TypeWriter typography engine
- Heart Tree finale animation
- Configurable env variables
