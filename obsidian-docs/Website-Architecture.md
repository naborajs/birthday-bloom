---
tags: [architecture, website, react, vite, structure]
aliases: [Website Architecture, Codebase Architecture]
---

# Website Architecture
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom website is built using a modern React stack, optimized for performance and intense cinematic visual quality.

## Core Technologies
- **Vite**: The build tool and development server (`vite.config.ts`). Configured for extreme performance, manual chunking of heavy 3D libraries (like `three.js`), and CSS module support.
- **React 18**: Uses `createRoot` inside `src/main.tsx`. Wrapped in a custom `GlobalErrorBoundary` to catch any rendering crashes in production gracefully.
- **TypeScript**: Strict mode enabled (`tsconfig.json`). Every component and prop is strictly typed to prevent runtime errors.
- **Tailwind CSS**: Utility-first CSS framework (`tailwind.config.ts`), augmented with `framer-motion` for complex keyframe animations.

## Directory Structure
- `src/components/birthday/`: The core domain folder containing all cinematic components (e.g., [[Cake3D]], [[HeartTree]], [[TypeWriter]]).
- `src/components/ui/`: Reusable, generic shadcn-like UI components (e.g., buttons, dialogs, charts).
- `src/features/`: Contains business logic grouped by domain.
  - `cinematic-story/`: Animations and scenes.
  - `core/`: State management (`useBirthdayStore.ts`) and theme logic (`useDynamicTheme.ts`).
- `src/hooks/` & `src/utils/`: Shared utilities.

## State Management
We use **Zustand** via `useBirthdayStore.ts`. It acts as the central brain of the application, controlling:
- The current `phase` (Mount, Cake, Reveal, Quotes, Final).
- Configuration variables injected from `.env`.
- Profile and template selection logic handled in `SuperPersonalizedLogic.ts`.

---
#obsidian #documentation #birthday-bloom #vault #architecture
