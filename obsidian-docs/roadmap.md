# 🌸 Birthday Bloom — Detailed Project Roadmap

Welcome to the official roadmap for **Birthday Bloom**. This document details our planned future, ongoing work, and ultimate vision for this interactive birthday landing page platform.

> [!NOTE]
> Timelines are estimates and driven by community needs and contributor availability. We welcome feedback and contributions to speed up any of these items!

---

## 🎨 Project Vision & Philosophy

Birthday Bloom's goal is to turn a static landing page into a **cinematic, interactive stage** in the browser. 

* **Config-First:** We want non-coders to customize everything through environment variables.
* **Performance-First:** Keep bundle sizes low, animations at 60fps, and avoid heavy external rendering engines.
* **Emotion-Driven:** Structure the pacing of text, audio, and visual reveals to build anticipation and surprise.

---

## 📅 Roadmap Overview

```mermaid
gantt
    title Birthday Bloom Project Timeline & Milestones
    dateFormat  YYYY-MM
    section Now (Core & Quality)
    Docs & Community Health      :done, des1, 2026-06, 2026-07
    CI/CD Automation & Lint      :done, des2, 2026-06, 2026-07
    Security & Dependabot        :done, des3, 2026-06, 2026-07
    Discussions & Branch Rules   :active, des4, 2026-07, 2026-08
    section Next (Features & DX)
    Presets & Themes             :active, des5, 2026-08, 2026-10
    Spotify & Audio Embeds       :des6, 2026-09, 2026-11
    Accessibility & PWA          :des7, 2026-10, 2026-12
    Storybook & Testing          :des8, 2026-11, 2027-01
    section Later (Scale & Ecosystem)
    CLI Tool & Boilerplate       :des9, 2027-01, 2027-03
    Online Preview Configurator  :des10, 2027-02, 2027-05
    Guestbook Backend System     :des11, 2027-04, 2027-07
```

---

## 🟢 Phase 1: Now — Quality & Community Foundation
*Focus: Deepen repository stability, build infrastructure, and improve developer experience (DX).*

### 🛠️ Completed Milestones
* **✅ Standard Community Health Files**
  * Established standard documentation including [CODE_OF_CONDUCT.md](file:///d:/Projects/Website/birthday-bloom-main/.github/CODE_OF_CONDUCT.md) for community guidelines, [SECURITY.md](file:///d:/Projects/Website/birthday-bloom-main/.github/SECURITY.md) for vulnerability reporting, and [SUPPORT.md](file:///d:/Projects/Website/birthday-bloom-main/.github/SUPPORT.md) for user assistance.
* **✅ Pull Request & Issue Templates**
  * Created custom YAML-driven templates for Bug Reports, Feature Requests, and Documentation requests, as well as a markdown Pull Request template.
* **✅ Continuous Integration (CI) Automation**
  * Set up GitHub Action pipelines that run ESLint, TypeScript compilation, Vitest checks, and production builds on every push and PR to ensure no broken code enters the branch.
* **✅ Automated Dependency Management**
  * Added Dependabot configuration to track node package updates and automatically submit security PRs.
* **✅ Redesigned Documentation Suite**
  * Created deep-dive guides: [architecture.md](file:///d:/Projects/Website/birthday-bloom-main/docs/architecture.md), [env-configs.md](file:///d:/Projects/Website/birthday-bloom-main/docs/env-configs.md), [faq.md](file:///d:/Projects/Website/birthday-bloom-main/docs/faq.md), [CHANGELOG.md](file:///d:/Projects/Website/birthday-bloom-main/CHANGELOG.md), and a comprehensive [README.md](file:///d:/Projects/Website/birthday-bloom-main/README.md).

### ⏳ Current Work-in-Progress
* **🔄 Community Discussions Hub**
  * Enable GitHub Discussions to allow users to share their own deployed sites, request features, and get troubleshooting support.
* **🔒 Branch Protection Safeguards**
  * Set up strict branch requirements for the `main` branch to guarantee all commits pass CI tests before being merged.

---

## 🟡 Phase 2: Next — Features & Polish
*Focus: Add premium customization options, enrich media interactivity, and enhance core performance.*

### 🎨 Templates & Personalization Presets
* **Celebration Presets:** Drop-in themes and layouts for different milestones (e.g. *Anniversaries*, *Graduations*, *Mother's/Father's Day*).
* **Pre-built Theme Packs:** Preset theme combinations of HSL colors and background gradients that can be switched via a single environment variable.
* **Group Celebrations Mode:** Support for multiple people writing messages and signing the card together.

### 🎵 Media & Content Integrations
* **Native Audio & Spotify Embed:** Direct integrations to load background tracks seamlessly from Spotify or YouTube Music without breaking the page's audio lifecycle.
* **Native Video Embed Support:** Clean wrapper components to display YouTube, Vimeo, or local HTML5 videos beautifully inside the birthday cinematic intro.

### 📱 Accessibility & Mobile Improvements
* **Screen Reader Audit (A11y):** Ensure all interactive triggers (like blowing candles and popping balloons) have correct ARIA labels and focus states.
* **PWA (Progressive Web App):** Add a manifest file and service workers so the experience can be saved to a mobile home screen like a native app.
* **Offline Compatibility:** Cache key assets (music, images, SVG icons) to allow offline loads.

### 💻 Developer Experience (DX)
* **Storybook Integration:** Set up Storybook for visual cataloging and testing of components like `<CakeCutting />` and `<HeartTree />`.
* **Deeper Testing Coverage:** Introduce Vitest coverage metrics targeting core state stores and animations.

---

## 🔴 Phase 3: Later — Ecosystem & Scale
*Focus: Scale out the platform to support automated setup, code-free configuration, and interactive server features.*

### 🚀 Developer Scaffolding
* **Scaffolding CLI Tool:** Create `npx create-birthday-bloom` to let developers generate a customized copy of the repository directly from their terminals.
* **GitHub Template Repo:** Mark the repository as a GitHub Template to allow users to generate a duplicate with a single button click.

### 🖥️ Online Configurator (No-Code Config)
* **Visual Configurator UI:** A web-based form where users can fill out their details, select themes, upload assets, and preview the site in real-time.
* **Export Config Package:** Download a prepared `.env` file containing the user's settings, ready to deploy.

### 💬 Community & Shared Interactivity
* **Interactive Guest Book:** A backend-supported message board allowing family and friends to write congratulations live on the page.
* **Community Template Gallery:** Showcase user customizations and custom styles to inspire others.
* **i18n Localization Engine:** Support for instant translations of standard messages.

---

## 🗳️ How the Roadmap is Managed

We prioritize features that align with our core values:
1. **Accessibility:** Lightweight, responsive, and working smoothly on all mobile devices.
2. **Configuration-First:** Code adjustments are secondary to setting simple variables in [.env.example](file:///d:/Projects/Website/birthday-bloom-main/.env.example).
3. **No Bloat:** Refrain from importing large library dependencies that impact rendering performance.

### Want to influence the direction?
* **Upvote:** Add a 👍 reaction to existing feature requests.
* **Discuss:** Start a discussion thread to brainstorm new ideas.
* **Submit:** Pull Requests are always welcome! Check [CONTRIBUTING.md](file:///d:/Projects/Website/birthday-bloom-main/.github/CONTRIBUTING.md) to get started.
