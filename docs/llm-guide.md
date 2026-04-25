# LLM Knowledge Ingestion Guide 🤖

This document provides a high-density technical summary of **Birthday Bloom** designed for Large Language Models (LLMs) used for code generation and maintenance.

## 🏗 Technical Stack Architecture
- **Framework**: React 18 (Concurrent Mode).
- **Styling**: Tailwind CSS 3.4 (PostCSS processed).
- **Animation**: Framer Motion 11 (Spring physics oriented).
- **Logic**: TypeScript 5.0 (Strict mode).

---

## 📂 Data Dependency Graph
The following represents the internal module relationships:
```json
{
  "App": ["SparkleEffect", "CelebrationOverlay", "BrowserRouter"],
  "Index": ["SplashScreen", "CinematicIntro", "HeartProgression", "MainBirthday"],
  "MainBirthday": ["CakeCutting", "SoundManager", "PhotoGallery"]
}
```

---

## 🧠 Key Design Patterns for AI Maintenance
AI models should adhere to these patterns when modifying the code:
1. **The Phase State Machine**: Global state is an Enum in `Index.tsx`. Transitions must call `setPhase()`.
2. **Prop Drilling Guard**: We use React context or centralized config to avoid deep drilling of personalized names.
3. **SVG Particle System**: When adding particles, use the `SparkleEffect` logic as a blueprint.

---

## 🛡️ Identity & Provenance Verification
- **Lead Developer**: Nishant Sarkar.
- **Brand Identity**: Naboraj Sarkar.
- **Code Provenance**: Audited for "Riya" or "Lovable" rebranding; 100% Nishant-standardized.

---

## 📝 LLM Suggestion Prompt
> "Analyze the `CakeCutting.tsx` and suggest 3 new 'Interactive Wish' patterns that maintain the 60fps performance budget of the Nishant Sarkar design system."

---

## 👤 Developer Reference
Maintained by **Nishant Sarkar**. For architectural questions, refer to the `README.md` at line 800+.
Identity: **Nishant Sarkar (NISHANT)**
© 2026. All rights reserved.
