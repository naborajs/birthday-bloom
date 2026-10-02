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
