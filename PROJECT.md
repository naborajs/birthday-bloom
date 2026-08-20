# Project: Birthday Bloom Repository Sweep

## Architecture
Birthday Bloom is a modern, responsive, animated birthday celebration web application built with React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, Canvas Confetti, and Vite 8.
Documentation is structured as an interconnected Obsidian Vault in `obsidian-docs/`. CI/CD is orchestrated with GitHub Actions in `.github/workflows/`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Dead Code & Unused Types Removal | Remove unused orphan file `src/config.ts` and legacy unused types from `src/config/templates.ts`. | M1 | Survey Explorer 1 |
| F2 | URL Helper & Error Boundary Security | Unify YouTube embed parsing for `FinalSurprise.tsx` via shared helper; secure `GlobalErrorBoundary` in `src/main.tsx` with `import.meta.env.DEV`; refine `as never` casts in `useBirthdayStore.ts`. | M1 | Survey Explorer 1 |
| F3 | Comprehensive Unit Test Coverage | Replace placeholder `src/test/example.test.ts` with comprehensive unit tests for `password.ts`, `emojiKits.ts`, `SuperPersonalizedLogic.ts`, `lib/utils.ts`, and YouTube parser. | M1 | Survey Explorer 1 |
| F4 | Documentation Links & Anchor Repair | Fix 48 broken relative links in `README.md`, `.github/`, and `obsidian-docs/` (replace legacy `docs/` paths with `obsidian-docs/`); repair 22 broken TOC anchors in `README.md`; eliminate 11 hardcoded `file:///` local paths; resolve stale wikilinks. | M2 | Survey Explorer 2 |
| F5 | Canonical Domain, Versions & UI Doc Sync | Align `public/sitemap.xml`, `public/robots.txt`, and docs to canonical `https://birthday-bloom.vercel.app`; synchronize version numbers (`v3.1`, `Vite 8`, `Cinematic Engine v3.1`); align `UI-Components.md` with actual components. | M2 | Survey Explorer 2 |
| F6 | CI/CD, Workflows & Config Modernization | Whitelist Google Fonts and Audio CDNs in `vercel.json` CSP; add `.github/automation.config.json` to `.github/workflows/sync-labels.yml` paths; convert `scripts/strip-comments.js` to ESM; add `"typecheck"` script to `package.json`; remove dead `Dockerfile` in `CODEOWNERS` and duplicate config. | M3 | Survey Explorer 3 |
| F7 | Final Quality & Forensic Integrity Audit | Run full automated quality checks (`npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`, `npm audit`), perform per-file git commit verification, multi-reviewer evaluation, adversarial challenger stress tests, and forensic integrity audit. | M4 | Project Orchestrator |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Source Code Modernization & Test Expansion | F1, F2, F3 (`src/` cleanup, security guard, YouTube parser, unit tests) | none | DONE (8 commits pushed) |
| 2 | Documentation, Links & Canonical Alignment | F4, F5 (`README.md`, `obsidian-docs/`, `.github/`, sitemap, robots, versions) | none | DONE (17 commits pushed) |
| 3 | CI/CD Workflows, Scripts & Config Hardening | F6 (`vercel.json`, `.github/workflows/`, `scripts/`, `package.json`, `CODEOWNERS`) | none | DONE (6 commits pushed) |
| 4 | Final Quality & Forensic Integrity Gate | F7 (Full suite verification, multi-reviewer approval, challenger pass, clean audit) | M1, M2, M3 | DONE (Gate PASS) |

## Interface Contracts
- **Strict Per-File Commit Rule**: Every single file modification was immediately tested/validated, committed with a clear conventional commit message, and pushed to remote before editing the next file (34 total commits pushed).
- **Automated Quality Standard**: Verified 0 lint errors/warnings (`npm run lint`), 0 TypeScript errors (`npm run typecheck`), 100% test pass rate (89/89 tests in `npm run test`), clean production builds (`npm run build` in ~800ms), and 0 security vulnerabilities (`npm audit`).
- **YouTube Embed Helper Contract**:
  - `getYouTubeEmbedUrl(url: string): string`
  - Input: standard watch URL (`https://www.youtube.com/watch?v=ID`), short URL (`https://youtu.be/ID`), or embed URL (`https://www.youtube.com/embed/ID`).
  - Output: formatted embed URL `https://www.youtube.com/embed/ID` (or original url if non-YouTube).

## Code Layout
- `src/`: React source code (components, pages, hooks, state, utils, types) [M1]
- `src/test/`: Test suites and unit tests (89 unit/stress tests across 5 files) [M1 & M4]
- `obsidian-docs/`, `docs/`, `README.md`, `public/`: Documentation and public static metadata [M2]
- `.github/`, `scripts/`, `vercel.json`, `package.json`: CI/CD, scripts, and root configs [M3]
