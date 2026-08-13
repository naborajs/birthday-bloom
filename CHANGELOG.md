# Changelog

All notable changes to Birthday Bloom are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Repository open-source upgrade: community health files, CI, issue templates, PR template
- CODE_OF_CONDUCT, SECURITY, SUPPORT, CHANGELOG, ROADMAP, STYLEGUIDE, FAQ, ARCHITECTURE docs
- GitHub Actions CI workflow (lint, typecheck, build, test)
- Issue templates: bug report, feature request, docs improvement, performance, question
- Pull request template with contributor checklist
- Dependabot configuration for npm and GitHub Actions

### Fixed
- Resolved all strict TypeScript errors regarding implicit `any` types in main.tsx, chart.tsx, Cake3D.tsx, and CakeVisuals.tsx
- Fixed React hooks exhaustive-deps warning in HeartTree component
- Removed ambiguous Tailwind class to resolve build warnings
- Configured ESLint to appropriately ignore `react-refresh/only-export-components` for UI components

### Changed
- README restructured for clarity: slimmed down, better navigation, removed duplication
- CONTRIBUTING.md improved with clearer workflows
- Package name updated to `birthday-bloom`
- Docs reorganization and internal linking improvements

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
