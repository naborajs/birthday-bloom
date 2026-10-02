---
tags: [video, tutorials, masterclass, youtube, guides]
aliases: [video-tutorials, videos, masterclasses]
---

# Official Video Tutorials & Architecture Masterclasses

[[DOCUMENTATION_INDEX|Back to Index]] | [[introduction|Introduction]] | [[Website-Architecture|Build Toolchain]] | [[deployment|Deployment Guide]] | [[contributing|Contributor Guide]]

🌐 **Canonical Web Documentation**: [Official Video Tutorials & Architecture Masterclasses](https://naborajs.me/projects/birthday-bloom/docs/video-tutorials)

---

## 📺 Official Masterclass Curriculum (5 High-Definition Walkthroughs)

The Birthday Bloom project includes a structured 5-part video curriculum covering every aspect of the project—from visual overview to production deployment and core architectural deep-dives.

---

### 1. Project Overview & Interactive Feature Tour
- **Video ID**: `R3XNhP9hSjw`
- **Direct Link**: [Watch on YouTube](https://youtu.be/R3XNhP9hSjw)
- **Objective**: Complete end-to-end visual walkthrough of all 4 celebration phases (Splash → Unlock → Intro → Main) and interactive modules.
- **Key Highlights**:
  - Demonstration of 3D cake cutting physics and knife gesture dragging.
  - Interactive balloon popping, quiz trivia, and mystery gift reveal.
  - Zero-code URL parameter customizer in action.

---

### 2. Complete Architecture & Subsystem Explainer
- **Video ID**: `VBgtLDP-vco`
- **Direct Link**: [Watch on YouTube](https://youtu.be/VBgtLDP-vco)
- **Objective**: Deep technical analysis of the React 18, TypeScript 5.8, Three.js / R3F, and Web Audio API infrastructure.
- **Key Highlights**:
  - The 4-phase deterministic state machine in `src/pages/Index.tsx`.
  - Web Audio API gain scheduling, singleton lifecycle, and autoplay policy bypass.
  - Zustand 3-tier hydration hierarchy (URL Params > `.env.local` > Defaults).

---

### 3. Production Deployment Masterclass (Vercel, Netlify & Cloudflare)
- **Video ID**: `gwq1IaHXUn4`
- **Direct Link**: [Watch on YouTube](https://youtu.be/gwq1IaHXUn4)
- **Objective**: Zero-downtime, edge-accelerated deployment guide across major hosting providers.
- **Key Highlights**:
  - Importing repository to Vercel and configuring 53 environment variables.
  - Setting up SPA rewrite rules (`_redirects`) on Netlify.
  - Deploying to Cloudflare Pages for sub-25ms global TTFB.
  - Docker containerization for self-hosted instances.

---

### 4. Official Contributing Guide & Git Workflow
- **Video ID**: `V4XZRRvcxgk`
- **Direct Link**: [Watch on YouTube](https://youtu.be/V4XZRRvcxgk)
- **Objective**: Fast-track guide for first-time open-source contributors and seasoned developers.
- **Key Highlights**:
  - Finding `good first issue` tasks and using the `/assign` automated bot.
  - Git branching rules (`feat/`, `fix/`, `docs/`) and Conventional Commits.
  - Running automated local verification (`npm run verify`).
  - Navigating GitHub Actions PR automated triage gates.

---

### 5. Contributor Deep-Dive: Live Component Coding & Test Suite
- **Video ID**: `a9-ndTkD8IE`
- **Direct Link**: [Watch on YouTube](https://youtu.be/a9-ndTkD8IE)
- **Objective**: Hands-on coding session demonstrating how to build a new celebration component and write Vitest unit tests.
- **Key Highlights**:
  - Structuring a custom scene component with Framer Motion spring physics.
  - Hooking into `useBirthdayStore` and `useTranslation`.
  - Writing unit tests with Vitest, React Testing Library, and JSDOM mocks.

---

## 🔍 Scope Boundaries

### What is Present:
- 5 Official High-Definition Walkthroughs with YouTube video IDs and direct links.
- Video Curriculum Breakdown: timestamps, learning objectives, and core subjects.
- Cross-references to deployment, contributing, and architecture documentation.

### What is NOT Present:
- Raw textual source code listings (see [[developer-guide#Component-API-Reference|Developer Reference]]).
- Comprehensive 53-variable catalogs (see [[ENV_GUIDE#53-Variable-Comprehensive-Registry|ENV Guide]]).
