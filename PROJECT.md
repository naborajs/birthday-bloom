# Project: Birthday Bloom Codebase Audit & Modernization

## Architecture
- **Framework & Runtime**: React 19 + TypeScript (Vite 8, SWC/OXC, Tailwind CSS 3.4)
- **UI & Animation**: Framer Motion, Lucide React, Canvas Confetti, Three.js, Sonner, Radix UI
- **State & Router**: Zustand 5, React Router 7
- **Testing**: Vitest 4 + React Testing Library + jsdom
- **Linting & Formatting**: ESLint 9 (Flat Config), Prettier 3, TypeScript ESLint

## Feature Inventory
| # | Feature / Work Item | Description | Milestone | Source |
|---|----------------------|-------------|-----------|--------|
| 1 | Lockfile & Dependency Hygiene | Resolve git merge conflicts in `package-lock.json`, fix `ENOLOCK` | M1 | survey 1 |
| 2 | Security Vulnerability Fixes | Fix `brace-expansion`, `nanoid`, `react-router` security vulnerabilities via npm audit / package upgrades | M1 | survey 1 |
| 3 | Toolchain & Typecheck Repair | Fix `tsconfig.json` `baseUrl` deprecation (TS5102) and ESLint `typescript-estree` crash with TS 7 | M1 | survey 1, 3 |
| 4 | Vite & Build Warning Resolution | Fix `__dirname` deprecation in `vite.config.ts` (`import.meta.dirname`) and move `@types/three` to devDependencies | M1 | survey 1 |
| 5 | Unused Dependency & Boilerplate Pruning | Remove 47 unused shadcn boilerplate UI files in `src/components/ui/` and their unused Radix/chart dependencies | M1, M2 | survey 1, 2 |
| 6 | Dead Component & Asset Pruning | Remove unrendered effect components (`DigitalRain`, `GlitchEffect`, `LiquidSwirl`, `ParticleBurst`, `RibbonEffect`, `TextRevealEffect`, `TunnelEffect`, `WaveEffect`), unreferenced assets and scratch scripts | M2 | survey 2, 3 |
| 7 | Dead Code & Unused Exports in Active Code | Clean up unused states, functions, and imports in `MainBirthday.tsx`, `CakeCutting.tsx`, `CakeVisuals.tsx`, `CinematicIntro.tsx`, `FinalSurprise.tsx`, `templates.ts`, `SuperPersonalizedLogic.ts`, `useBirthdayStore.ts` | M2 | survey 2 |
| 8 | Runtime Logic & Bug Fixes | Fix invalid 4-argument HSL syntax in `useDynamicTheme.ts`, fix `--color-primary-rgb` in `PhotoGallery.tsx`, fix SPA routing in `NotFound.tsx`, fix stack trace leak in `ErrorBoundary.tsx` | M2 | survey 2 |
| 9 | Styling & CSS System Cleanups | Fix dark/light mode conflict in `App.css` (`prefers-color-scheme: light` forcing white backgrounds) | M2 | survey 2 |
| 10 | CI/CD Workflow Fixes | Fix invalid action versions in `.github/workflows/ci.yml` (`v7` -> `v4`), fix missing checkout in `sync-labels.yml`, clean up orphaned triage scripts | M3 | survey 3 |
| 11 | Documentation & Link Integrity | Fix 404 broken doc links across `README.md`, `CONTRIBUTING.md`, `SUPPORT.md`, `ai-readme.txt`, `llm.txt` pointing to `obsidian-docs/` | M3 | survey 3 |
| 12 | Cross-File Metadata Consistency | Synchronize version numbers (3.1.0), canonical deployment URLs (`https://birthday-bloom.vercel.app`), author meta, and CSP rules | M3 | survey 3 |
| 13 | Full Verification & Summary Report | Execute full `npm run lint`, `npm run test`, `npm run build`, manual inspection, and generate comprehensive file-by-file summary report | M4 | original request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dependency Modernization & Toolchain Fixes | Resolve lockfile merge conflict, upgrade vulnerable packages, fix ESLint & TypeScript configs, resolve Vite warnings, verify clean build/lint/test | none | IN_PROGRESS |
| M2 | Systematic Source Code Audit & Dead Code/Bug Fixes | Audit all source files under `src/`, prune unused components/utilities, clean dead code/states, fix runtime bugs and CSS issues with per-file immediate commits | M1 | PLANNED |
| M3 | CI/CD Workflows, Docs & Cross-File Consistency | Fix GitHub workflows, update documentation links, synchronize version numbers, URLs, and metadata across all configs | M2 | PLANNED |
| M4 | Final E2E Build, Test Verification & Summary Report | Run full verification suite across all commands, write comprehensive changelog/summary report file-by-file with reasoning | M3 | PLANNED |

## Interface Contracts & Rules
1. **Commit Rule**: Every single file modification must be immediately committed and pushed before proceeding to the next file (e.g. `git commit -m "fix(module): clear description" && git push`).
2. **Functionality Preservation**: No feature or visual behavior shall be broken or altered unless fixing a bug, vulnerability, or dead code.
3. **Zero Cheating / Integrity Enforcement**: All fixes must be authentic. No mock passes, no suppressed linters without genuine root cause fixes.

## Code Layout
- `src/` - Application source code
  - `components/` - React UI components and birthday visual scenes
  - `features/` - Core features, audio logic, interactive cake, gift, quiz
  - `hooks/` - Custom React hooks (theme, audio, state)
  - `services/` - Audio synthesis and sound effects
  - `utils/` - Helper utilities and confettis
  - `data/` - Birthday configuration data and presets
- `public/` - Static assets, icons, manifest, robots.txt, sitemap.xml
- `.github/` - GitHub Actions workflows, issue templates, community docs
- `obsidian-docs/` - Comprehensive technical documentation vault
- `tests/` - Vitest test files
