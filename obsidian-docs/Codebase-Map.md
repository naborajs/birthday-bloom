---
tags: [map, index, codebase, files, structure]
aliases: [Codebase Map, File Index]
---

# Codebase Map
[[DOCUMENTATION_INDEX|Back to Home]]

This is the central index mapping every significant file in the Birthday Bloom repository.

## Root Directory
- `.env.example`: Template for environment variables. See [[ENV_GUIDE]].
- `vite.config.ts`: Vite build configuration. See [[Website-Architecture]].
- `package.json`: Project dependencies and npm scripts.
- `eslint.config.js`: Strict linting rules to prevent errors.

## `.github/`
See [[GitHub-Automation]] for a deep dive.
- `workflows/ci.yml`: Continuous integration pipeline.
- `workflows/triage-issues.yml`: Automated issue labeling and routing.

## `src/` Directory
The core React application. See [[Website-Architecture]].

### `src/components/`
- **`birthday/`**: All cinematic and visual components. See [[Birthday-Components]] for an exhaustive list of all 43 files (e.g. [[Cake3D]], [[HeartTree]], [[MainBirthday]]).
- **`ui/`**: Reusable generic components based on Shadcn UI. See [[UI-Components]] for an exhaustive list of all 49 files (e.g. [[button.tsx]], [[dialog.tsx]], [[form.tsx]]).

### `src/features/`
Domain-specific logic.
- **`core/store/useBirthdayStore.ts`**: The central brain of the app state. See [[Template-System-Deep-Dive]].
- **`core/models/familyTemplates.ts`**: Predefined configurations.
- **`cinematic-story/`**: Orchestrates scenes and dynamic variants.

### `src/pages/`
- `Index.tsx`: The main entry point rendered by React Router.

## `scripts/`
- `obsidian-migration.mjs`: Script to automatically convert markdown files to this very Obsidian vault structure!

---
#obsidian #documentation #birthday-bloom #vault #map
