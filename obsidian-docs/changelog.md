---
tags: [changelog, releases, semver, versions, history]
aliases: [changelog, release-notes, history]
---

# Project Changelog & Release Notes

[[DOCUMENTATION_INDEX|Back to Index]] | [[roadmap|Roadmap]] | [[migration-guide|Migration Guide]] | [[Website-Architecture|Build Toolchain]]

🌐 **Canonical Web Documentation**: [Project Changelog & Release Notes](https://naborajs.me/projects/birthday-bloom/docs/changelog)

---

## 📜 Semantic Versioning Principles

All notable changes to Birthday Bloom are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/):
- **MAJOR (`x.0.0`)**: Incompatible API changes, parameter renames, or structural architecture rewrites.
- **MINOR (`0.x.0`)**: Backwards-compatible new features, components, and locale additions.
- **PATCH (`0.0.x`)**: Backwards-compatible bug fixes and performance improvements.

---

## 🚀 Release History Highlights

### [Unreleased] — 2026-10-24
- **Changed**:
  - Performance and lifecycle hardening across the app shell, adaptive performance hook, fireworks, confetti, cake ceremony, chat/letter typewriters, balloon game, heart tree, guestbook, and celebration timers.
  - Low-tier `.perf-low` profile now suppresses `backdrop-filter` while preserving translucent surfaces; desktop and balanced profiles retain glassmorphism.
  - Cake selector images converted from large PNGs to 640×640 JPEG q88 assets (~431 KB total).
- **Fixed**:
  - Cake cut/blow sequences are cancellable on close/Escape/unmount, and microphone candle blowing can be replayed.
  - Balloon pops are guarded against double-triggering; completion celebration and reset timers are cleaned up.
  - Fireworks release their full-screen canvas backing store after each run; adaptive DPR no longer restarts the show on resize.
- **Verification**: `npm run verify` passes with 31 test files / 497 tests.

### [3.7.0] — 2026-10-21
- **Added**:
  - **Microphone-Adaptive 3D Candle Blowing** (`useMicrophoneBlow.ts`): Real-time acoustic energy analysis using Web Audio API with a 50Hz high-pass biquad filter driving 3D flame tilt, candle flutter, and natural breath-extinguishing physics.
  - **Adaptive Battery & Mobile Zero-Lag Engine** (`useAdaptivePerformance.ts`, `deviceTier.ts`): Dynamic device tiering (`low`, `balanced`, `high`) capping DPR to 1 on mobile, gating concurrent canvas RAF loops, and reducing memory pressure.
  - **Interactive Guestbook & Live Wishes Board** (`GuestbookSection.tsx`): Template-aware starter wishes for all relationship types, heart reaction counters, client-side `localStorage` persistence, and confetti integration.
  - **Sensory & Visual Enhancements**: Added gentle falling rose petals effect (`fireRosePetals`) and soft chime audio cue (`playChime`).
  - **Emotional Template Depth**: Added dedicated brother and sister starter seeds, memory prompts, and gratitude fields across English, Bengali, Hindi, and French.
- **Changed**:
  - Upgraded toolchain to Vite 8.3.4, Vitest 3.2.7, React Router DOM 7.18.4, Framer Motion 13.5.1, and TypeScript-ESLint 8.71.2.
  - Test suite expanded to 27 test suites and 483 passing tests (100% passing).
- **Security**:
  - Resolved vulnerabilities via npm overrides for `brace-expansion` (^2.1.7), `fflate` (^0.8.2), `postcss-selector-parser` (^7.1.6), `js-yaml` (^4.3.2), and `@humanfs/node` (^0.16.8).

### [3.6.0] — 2026-09-27
- **Added**:
  - 3D Smartphone Hardware Chassis (`FakeChatScene.tsx`) with brushed rose-titanium metallic bezel and OLED reflections.
  - Interactive iOS glass keypad with live key-press darkening, popup magnifiers, and predictive text bar.
  - Procedural 3D Stainless Steel Pastry Knife (`CakeKnife3D.tsx`) with `@react-spring/three` drag physics.
  - Artisanal 5-Layer 3D Cake & Porcelain Pedestal Platter (`Cake3D.tsx`).
- **Changed**:
  - Site-wide 60 FPS mobile and desktop GPU optimization (consolidated RAF loops, removed expensive blur filters).
  - Grapheme-safe typewriter slicing preventing emoji corruption.
- **Fixed**:
  - 3D cake platter camera frustum framing preventing bottom clipping.
  - Hindi Devanagari Unicode string integrity.

### [3.5.0] — 2026-09-17
- **Added**:
  - Date & Calendar countdown utilities (`src/utils/dateUtils.ts`).
  - URL query parameter engine utilities (`src/utils/urlUtils.ts`).
  - Audio state and soundscape utilities (`src/utils/audioUtils.ts`).
  - Floating accessible audio toggle control (`SoundToggle.tsx`).
  - Automated PR triage labeler workflow.
- **Changed**:
  - Upgraded GitHub Actions runners to v4 and v7.
  - Expanded automated test suite to 470 tests (100% pass rate).

### [3.4.0] — 2026-09-14
- **Added**:
  - Modular color utilities (`src/utils/colorUtils.ts`) with WCAG luminance calculations.
  - Media validation utilities (`src/utils/mediaUtils.ts`) for YouTube and direct video links.
  - Accessible keyboard navigation for photo gallery and balloon pop game.
- **Changed**:
  - Reduced motion support scaling down confetti particle counts.
  - Enhanced mobile Safari passive touch audio unlock listener.

---

## 🔍 Scope Boundaries

### What is Present:
- Chronological, SemVer-compliant release records across all versions.
- Granular categorization of Added, Changed, and Fixed updates.
- Links to version migration steps.

### What is NOT Present:
- Forward-looking feature roadmaps (see [[roadmap#Future-Technical-Milestones|Architectural Roadmap]]).
- Technical hook implementation details (see [[developer-guide#Custom-Hooks-API-Reference|Developer Reference]]).
