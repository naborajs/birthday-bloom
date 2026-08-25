---
tags: [map, index, codebase, files, structure]
aliases: [Codebase Map, File Index]
---

# Codebase Map
[[DOCUMENTATION_INDEX|Back to Home]]

This is the central index mapping every significant file and directory in the Birthday Bloom repository.

## Root Directory
- `.env.example`: Complete 53 environment variables reference template. See [[ENV_GUIDE]].
- `ENV_GUIDE.md`: Root markdown environment customization guide and recipes.
- `README.md`: Project introduction, architecture overview, and video guides.
- `CHANGELOG.md`: Detailed version history and release notes.
- `llm.txt`: AI-friendly developer architectural map.
- `vite.config.ts`: Vite build and code-splitting configuration. See [[Website-Architecture]].
- `package.json`: Project dependencies and npm scripts.
- `eslint.config.js`: Modern flat ESLint configuration.

## `.github/`
See [[GitHub-Automation]] for a deep dive.
- `workflows/ci.yml`: Continuous integration pipeline (typecheck, lint, test, build).
- `workflows/repo-health.yml`: Automated repository maintenance.
- `workflows/triage-issues.yml`: Automated issue routing and labeling.

## `src/` Directory
The core React application. See [[Website-Architecture]].

### `src/components/`
- **`birthday/`**: All 29 cinematic, narrative, and sensory visual components. See [[Birthday-Components]] (e.g. [[Cake3D]], [[CakeCutting]], [[HeartTree]], [[CinematicIntro]], [[MainBirthday]], [[PhotoGallery]], [[SoundManager]]).
- **`ui/`**: Focused design system primitives (`sonner.tsx` toast notifications, `tooltip.tsx`). See [[UI-Components]].

### `src/features/`
Domain-specific logic:
- **`core/store/useBirthdayStore.ts`**: The central brain of the app state, parsing 53 env variables and aliases. See [[architecture-env]].
- **`core/models/familyTemplates.ts`**: 14 specialized family and relationship member archetypes and factory functions. See [[family-system]].
- **`core/theme/useDynamicTheme.ts`**: Generates and injects dynamic HSL/RGB CSS variable tokens into `:root`.
- **`cinematic-story/`**: Orchestrates narrative scenes and animation variants.

### `src/i18n/`
Multi-language localization subsystem:
- `index.ts`: Lightweight type-safe `useTranslation()` hook and fallback engine.
- `locales/`: Authentic localization dictionaries (`en.ts`, `bn.ts`, `hi.ts`, `fr.ts`).

### `src/config/`
- `birthday.ts`: Audio assets configuration and static photo fallbacks.
- `templates.ts`: Cultural emotional letters, quotes, and relationship presets.
- `bengaliTemplates.ts`, `hindiTemplates.ts`, `frenchTemplates.ts`: Language-specific cultural templates.

### `src/pages/`
- `Index.tsx`: Main route managing the 4-phase state machine (`splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`).
- `NotFound.tsx`: Client-side 404 handler with Link navigation.

---
#obsidian #documentation #birthday-bloom #vault #map
