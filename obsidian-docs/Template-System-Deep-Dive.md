---
tags: [templates, state, store, features, architecture]
aliases: [Template System, State Logic, Store]
---

# Template System Deep Dive
[[DOCUMENTATION_INDEX|Back to Home]]

Birthday Bloom utilizes a deeply personal and heavily nested Template System, controlled by Zustand in `src/features/core/store/useBirthdayStore.ts`.

## SuperPersonalizedLogic
The core engine for dynamic birthday data is `SuperPersonalizedLogic.ts`.
- **Profiles**: There are predefined profiles (e.g. `brother`, `sister`, `friend`).
- **Data Injection**: `.env` variables dictate the base identity, but the template system fills the gaps to prevent empty screens. If no photos are provided via env, the template provides high-quality fallback `unsplash` image arrays.

## Store Mechanics
- `useBirthdayStore.ts` merges `import.meta.env` variables with `familyTemplates.ts` logic.
- It exposes a `config` object accessible globally, preventing excessive prop-drilling through deeply nested components like [[HeartTree]] or [[Cake3D]].

## Adding New Templates
To add a new template (e.g., `coworker`):
1. Add it to `familyTemplates.ts`.
2. Reference it in `SuperPersonalizedLogic.ts` fallback generator.
3. Update `.env.example` to list it as an option for `VITE_RELATIONSHIP`.

---
#obsidian #documentation #birthday-bloom #vault #templates
