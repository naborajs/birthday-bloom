# Changelog

All notable changes to Birthday Bloom are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [3.5.0] — 2026-09-17

### Added
- **Date & Calendar Countdown Utilities (`src/utils/dateUtils.ts`)**: Pure leap year-safe functions for dynamic birthday countdown calculations (`calculateBirthdayCountdown`) and localized date formatting (`formatDisplayDate`).
- **Date Utilities Test Suite (`src/test/date_utils.test.ts`)**: Comprehensive unit tests covering future birthdays, same-day celebrations, past dates, and leap year handling (11 tests).
- **URL Query Parameter Engine Utilities (`src/utils/urlUtils.ts`)**: Zero-dependency URL query parameter encoder, serializer, and validator with URL length safety guards and automated fallback handling.
- **URL Utilities Test Suite (`src/test/url_utils.test.ts`)**: Unit tests validating parameter extraction, edge cases, and query reconstruction (7 tests).
- **Audio State & Soundscape Utilities (`src/utils/audioUtils.ts`)**: Pure state helpers for volume clamping (`clampVolume`), mute/unmute state toggling (`toggleMuteState`), and sound manager state serialization.
- **Audio Utilities Test Suite (`src/test/audio_utils.test.ts`)**: Dedicated test coverage for audio clamping, NaN fallback protection, and mute toggle calculations (8 tests).
- **Floating Audio Toggle Control (`src/components/birthday/SoundToggle.tsx`)**: Accessible, floating mute/unmute sound toggle button with volume memory, dynamic SVG icons, and ARIA labels.
- **Audio Toggle UI Integration (`src/components/birthday/MainBirthday.tsx`)**: Mounted `SoundToggle` onto the main celebration viewport with responsive positioning.
- **Interactive Component Test Suite (`src/test/sound_toggle_and_quiz.test.tsx`)**: Tested SoundToggle volume control integration and BirthdayQuiz accessibility options under Framer Motion in JSDOM (4 tests).
- **Automated PR Triage Labeler Workflow (`.github/workflows/labeler.yml`)**: Automatic classification of pull requests using `actions/labeler@v5` mapped against `.github/labeler.yml` paths.
- **PR Verification Pipeline (`.github/workflows/pr-verify.yml`)**: Continuous integration workflow for pull requests featuring concurrency guards (`cancel-in-progress: true`) to avoid redundant runner usage.

### Changed
- **Modernized GitHub Actions Runners**: Upgraded official action runners to `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/github-script@v7` across `ci.yml`, `issue-assignment.yml`, `repo-health.yml`, and `sync-labels.yml`.
- **Accessible Quiz Navigation (`BirthdayQuiz.tsx`)**: Enabled full keyboard interactivity (`Enter` / `Space`) on trivia option buttons and explicit button semantics.
- **Accessible Surprise Modal (`FinalSurprise.tsx`)**: Added standard `Escape` key dismissal listener and ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`).
- **Live Screen Reader Announcements (`TypeWriter.tsx`)**: Introduced `aria-live="polite"` region and dynamic invisible status updates for screen reader users.
- **Expanded Test Suite**: Reached 24 total test suites and 466 passing tests (100% pass rate).

## [3.4.0] — 2026-09-14

### Added
- **Modular Color Utilities (`src/utils/colorUtils.ts`)**: Hex color parsing, RGB and HSL conversion, WCAG relative luminance and contrast ratio calculations with safe fallbacks.
- **Media Utilities (`src/utils/mediaUtils.ts`)**: Unified personal image validation (`isRealImageUrl`), direct video file identification, and comprehensive YouTube link parsing.
- **Accessibility & Keyboard Suite (`accessibility_and_ux.test.tsx`)**: New automated test suite covering interactive components, keyboard controls, and dialog dismissal behaviors.
- **Escape Key Modal Dismissal**: Added standardized `Escape` key listeners and accessible close controls to `CakeCutting` and `ShareCelebrationModal`.
- **Keyboard Navigation in Photo Gallery**: Full arrow key (`ArrowRight` / `ArrowLeft`) navigation across photos in both fullscreen lightbox and carousel modes.
- **Accessible Balloon Pop Game**: Full keyboard popping (`Enter` / `Space`), focus rings, ARIA roles, and resolved touch duplicate event handlers.

### Changed
- **Reduced Motion Support**: `Confetti` and `Balloons` now dynamically scale down active particle counts and rise durations when reduced motion is preferred or configured.
- **Enhanced Mobile Audio Unlock**: `SoundManager` now attaches passive `touchstart` and `pointerdown` listeners to guarantee instantaneous audio unlocking on mobile Safari and iOS.
- **Celebration Fireworks on Intro Skip**: Pressing "Skip Intro" on the landing page now triggers the celebration fireworks sequence immediately.
- **Multilingual Completeness**: Added missing French localizations for interactive celebration buttons and gift box actions.

## [3.3.0] — 2026-08-26

### Added
- **Dynamic Runtime SEO Engine (`useDynamicSEO.ts`)**: Live reactive updates for document title, meta descriptions, multilingual keywords, OpenGraph tags (`og:title`, `og:description`, `og:locale`, `og:url`), Twitter cards, dynamic canonical links, and real-time Schema.org `SocialEvent` structured data tailored to the recipient and language.
- **Universal URL Query Parameter Engine (`urlParams.ts`)**: Instant zero-code customization and shareability via URL parameters (`?name=...&rel=...&lang=...&age=...&sender=...&msg=...&color=...`).
- **Viral Social Sharing & Referral Modal (`ShareCelebrationModal.tsx`)**: 1-click sharing to WhatsApp, X (Twitter), Telegram, Facebook, LinkedIn, native Web Share API (`navigator.share`), and interactive celebration link generator with UTM campaign attribution.
- **Rich Schema.org Structured Data (`index.html`)**: Added `FAQPage` schema (with 6 SEO-targeted questions & answers for Google Rich FAQ accordions), `HowTo` schema, `BreadcrumbList` schema, and enhanced `WebApplication` schema (with 4.9/5 star ratings and software version 3.1.0).
- **Multilingual XML Sitemap (`public/sitemap.xml`)**: Upgraded to standard XML Sitemap protocol with complete `xhtml:link rel="alternate" hreflang` alternates across English (`en`), Bengali (`bn`), Hindi (`hi`), French (`fr`), all 10+ relationship archetypes, visual themes, and Google Image tags.
- **Robots.txt Overhaul (`public/robots.txt`)**: Explicit allow directives for all search engine bots, social previewers (WhatsApp, Twitter, Discord, Telegram, LinkedIn), and generative AI search crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- **Standard AI Discovery Specs (`public/llms.txt`, `public/llms-full.txt`)**: Compliant with `llmstxt.org` specification.
- **PWA Discoverability & Vercel Caching**: Enhanced `site.webmanifest` with app shortcuts (Romantic, Friend, Family) and optimized static asset caching headers in `vercel.json`.
- **Comprehensive SEO Test Suites**: Added `src/test/dynamic_seo.test.tsx` and updated `src/test/seo_and_ux_enhancements.test.tsx` (12 test suites, 330 passing tests).

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
