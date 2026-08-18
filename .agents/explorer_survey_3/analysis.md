# Comprehensive Configuration, Workflow & Documentation Survey Report

**Agent:** Explorer 3 (Configs, Workflows & Docs Survey)  
**Date:** 2026-08-18  
**Repository:** `birthday-bloom` (`https://github.com/naborajs/birthday-bloom`)  
**Working Directory:** `d:\Projects\Website\birthday-bloom`

---

## Executive Summary

A comprehensive investigation was conducted across all repository configuration files, CI/CD pipelines, GitHub automation workflows, documentation vaults, assets, metadata, and git history. 

### Key High-Level Findings:
1. **Build & CI Quality Failures:**
   - `npm run lint` fails completely with a runtime `TypeError` (`Cannot read properties of undefined (reading 'Cjs')`) due to incompatibility between TypeScript `^7.0.2`, `@typescript-eslint/typescript-estree` (v8.63.0), and ESLint (v10.8.1).
   - `npx tsc --noEmit` fails with `TS5102: Option 'baseUrl' has been removed` due to the TS 7 compiler configuration.
   - `vite.config.ts` emits deprecation warnings regarding `__dirname` (incompatible with Vite native config loader) and `@vitejs/plugin-react-swc`.
   - CI workflow `.github/workflows/ci.yml` specifies non-existent action versions (`actions/checkout@v7`, `actions/setup-node@v7`).
2. **Critical Documentation Path Breaks (404s):**
   - Documentation was migrated to Obsidian vault format in `obsidian-docs/`, but `README.md`, `.github/CONTRIBUTING.md`, `.github/SUPPORT.md`, `.github/CODEOWNERS`, `.github/ISSUE_TEMPLATE/config.yml`, `ai-readme.txt`, `llm.txt`, and `public/llms.txt` still link to non-existent `docs/` and `../docs/` paths. All web links in GitHub Issue Templates and README are dead 404 links on GitHub.
3. **GitHub Workflow & Automation Bugs:**
   - `.github/workflows/sync-labels.yml` is missing a repository checkout step before reading `.github/automation.config.json`, causing it to crash with `ENOENT` on execution.
   - `.github/scripts/pr-triage.js` and `.github/pr-automation.config.json` are orphaned/unreferenced because triage workflows were removed in commit `6653cfe` to save action credits, but the scripts and stale documentation in `.github/docs/automation/README.md` remain.
4. **Version & Cross-File Metadata Discrepancies:**
   - `package.json` and `index.html` report version `3.1.0`, while `CHANGELOG.md` only documents up to `[3.0.0]`, `.env.example` and `DOCUMENTATION_INDEX.md` say `v3.0`.
   - `public/robots.txt` and `public/sitemap.xml` reference `https://birthday-bloom-by-naboraj.vercel.app` while `index.html` and other docs reference `https://birthday-bloom.vercel.app`.
   - `index.html` has duplicated author metadata: `"Naboraj Sarkar | Naboraj Sarkar"`.
5. **Code Hygiene & Orphaned Files:**
   - Unused/scratch files in repo root: `test-crash.cjs` (scratch Puppeteer script), duplicate scripts `scripts/strip-comments.js` vs `scripts/strip-comments.cjs`, unreferenced asset `attached_assets/screenshot-1771336210205.png`.
   - Typescript & linter loose modes: `tsconfig.app.json` has `strict: false`, `noUnusedLocals: false`, `noImplicitAny: false`; `eslint.config.js` turns off `@typescript-eslint/no-unused-vars`.

---

## 1. Inventory & Configuration Inspection

### 1.1 Root Configuration Files

| File | Purpose | Key Details & Status | Issues / Findings |
|---|---|---|---|
| `package.json` | Project manifest & scripts | React 18.3.1, Vite 8.2.0, Tailwind 3.4.17, Zustand 5.0.14, Vitest 3.2.4 | `"typescript": "^7.0.2"` breaks ESLint and TS compiler options; `"eslint": "^10.7.0"`. |
| `package-lock.json` | Dependency lockfile | Lockfile v3 | Synchronized with `package.json`. |
| `tsconfig.json` | TS Solution Root | References `tsconfig.app.json` & `tsconfig.node.json` | Contains deprecated/removed `"baseUrl": "."` causing `error TS5102`. |
| `tsconfig.app.json` | App TS Configuration | Target ES2020, moduleResolution "bundler" | Contains `"baseUrl": "."`; sets `strict: false`, `noUnusedLocals: false`, `noUnusedParameters: false`, `noImplicitAny: false`. |
| `tsconfig.node.json` | Node/Vite TS Config | Target ES2022, module ESNext | Includes `vite.config.ts`. Sets `strict: true`. |
| `vite.config.ts` | Vite 8 build config | Port 5000, manualChunks for three, framer-motion, radix-ui, vendor | Uses `__dirname` (warns against native configLoader, should use `import.meta.dirname`); uses `@vitejs/plugin-react-swc` (recommended `@vitejs/plugin-react-oxc`). |
| `vitest.config.ts` | Vitest test config | JSDOM environment, setup file `./src/test/setup.ts` | Properly configured, all 7 unit tests pass. |
| `eslint.config.js` | ESLint 9/10 flat config | Rules for react-hooks, react-refresh | `"@typescript-eslint/no-unused-vars": "off"`; fails on execution with `TypeError: Cannot read properties of undefined (reading 'Cjs')`. |
| `tailwind.config.ts` | Tailwind CSS configuration | Custom HSL color variables (`birthday-pink/purple/gold/sky/coral/mint`), animations | Valid configuration. |
| `postcss.config.js` | PostCSS config | Configures `tailwindcss` & `autoprefixer` | Valid standard configuration. |
| `components.json` | shadcn/ui configuration | Schema `https://ui.shadcn.com/schema.json`, aliases `@/components`, `@/lib/utils` | Properly aligned with `src/index.css`. |
| `vercel.json` | Vercel SPA routing & headers | Rewrites `/(.*) -> /index.html`, strict CSP, HSTS, X-Frame-Options: DENY, Permissions-Policy | Solid security configuration. |
| `.env` | Local environment instance | Holds customized preset for Naboraj (friend relationship, Unsplash photos, audio URLs) | Present in working directory; matched by `.gitignore`. |
| `.env.example` | Public template environment | Complete reference for all `VITE_*` keys | Title says `Birthday Bloom v3.0 environment template` (mismatch with v3.1.0). |
| `.editorconfig` | Editor standards | 2 spaces, UTF-8, LF line endings, trim whitespace | Valid. |
| `.gitignore` | Git ignore rules | Ignores `node_modules`, `dist`, `.env`, `*.local`, `logs` | Valid. |
| `.nvmrc` | Node version | `20` | Aligns with CI Node.js version. |
| `index.html` | SPA Entrypoint | Title, OpenGraph, Twitter cards, LLM hints, favicon tags | Line 22: `author` is `"Naboraj Sarkar | Naboraj Sarkar"` (duplicated); version `3.1.0`. |

---

## 2. GitHub Actions, CI/CD & Automation Survey

### 2.1 Workflow Analysis

| Workflow File | Triggers | Steps / Jobs | Flaws & Inconsistencies |
|---|---|---|---|
| `.github/workflows/ci.yml` | `push` (main), `pull_request` (main) | Checkout, Setup Node 20, `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test -- --run` | 1. Uses `actions/checkout@v7` and `actions/setup-node@v7` (fictional/invalid major versions).<br>2. `npm run lint` and `npx tsc --noEmit` fail.<br>3. `npm test -- --run` passes redundant `--run` flag when `package.json` already has `"test": "vitest run"`. |
| `.github/workflows/issue-assignment.yml` | `issue_comment` (`created`) | Checks if assigned, assigns user on `/assign` or "can I take this", posts 48-hour rule message | Uses `actions/github-script@v7`. Works well for community onboarding. |
| `.github/workflows/repo-health.yml` | `schedule` (cron 0 0 * * *), `pull_request` (`closed`) | Sparse checkout of config; stale issue sweep (14d), PR reminder ping (3d), 48h/72h inactive assignee check & unassign, milestone celebration comments | Uses `actions/checkout@v7`, `actions/github-script@v9`. Well-structured automated maintenance. |
| `.github/workflows/sync-labels.yml` | `push` (main, paths: `.github/workflows/sync-labels.yml`), `workflow_dispatch` | Synchronizes labels defined in `.github/automation.config.json` and deletes obsolete labels | **CRITICAL BUG:** Step calls `fs.readFileSync('.github/automation.config.json')` without checking out the repository first! Workflow will crash with `ENOENT`. Also, push trigger lacks path for `.github/automation.config.json`. |

### 2.2 Automation Configurations & Scripts

| File | Purpose | Status / Findings |
|---|---|---|
| `.github/automation.config.json` | Master automation taxonomy (exemptions, limits, complexity, types, areas, labels, labelsToDelete) | Active config file consumed by `repo-health.yml`, `sync-labels.yml`, and `pr-triage.js`. |
| `.github/pr-automation.config.json` | Duplicate subset configuration | **Redundant / Orphaned**: Not referenced anywhere in the repository. |
| `.github/scripts/pr-triage.js` | Native JS PR triage script | **Unreferenced**: Full script for complexity evaluation and check runs, but no GitHub workflow triggers it since triage workflows were removed in commit `6653cfe`. |
| `.github/dependabot.yml` | Dependabot v2 config | Configured for `npm` (weekly) and `github-actions` (monthly). Radix, build-tools, linting groups. |
| `.github/labeler.yml` | Labeler v5 configuration | Defines path rules for docs, customization, ci-cd, refactor. No workflow currently runs `actions/labeler`. |
| `.github/docs/automation/README.md` | Automation ecosystem doc | Outdated: Documents `triage-issues.yml` and `triage-prs.yml` which were deleted. |

### 2.3 Community & Policy Files

| File | Purpose | Findings |
|---|---|---|
| `.github/CODEOWNERS` | Reviewer assignment rules | Line 8 lists `docs/ @naborajs` (actual folder is `obsidian-docs/`). Line 22 lists `Dockerfile @naborajs` (`Dockerfile` does not exist). |
| `.github/SECURITY.md` | Security disclosure | Lists active support for 3.x, email `nishant.ns.business@gmail.com`. Accurate. |
| `.github/CONTRIBUTING.md` | Contributor onboarding guide | Multiple dead links: lines 39, 74, 148, 233, 234, 256 link to `docs/architecture.md`, `docs/styleguide.md`, `docs/ENV_GUIDE.md`, `../docs/*` instead of `obsidian-docs/*`. |
| `.github/CODE_OF_CONDUCT.md` | Contributor Covenant 2.1 | Proper contact email `nishant.ns.business@gmail.com`. Valid. |
| `.github/PULL_REQUEST_POLICY.md` | Strict merge & branch protection guide | Detailed instructions for repo admin; documents complexity taxonomy and quality gates. |
| `.github/SUPPORT.md` | Support routing table | Table lines 11-15 and line 34 link to `../docs/*` (all broken 404s). |
| `.github/pull_request_template.md` | Detailed PR template | Up to date, references `obsidian-docs/`. |
| `.github/ISSUE_TEMPLATE/config.yml` | Issue chooser links | Lines 4, 7, 10 link to `https://github.com/naborajs/birthday-bloom/blob/main/docs/DOCUMENTATION_INDEX.md`, `ENV_GUIDE.md`, `troubleshooting.md` (all 404s). |
| `.github/ISSUE_TEMPLATE/*.yml` | 10 Issue templates | Covers bug reports, feature requests, accessibility, customization, deployment, docs, performance, question, security, custom request. Clean YAML schemas. |

---

## 3. Documentation Suite & Asset Survey

### 3.1 Root Documentation Files

- **`README.md` (1009 lines):**
  - Well-structured, visually appealing, with YouTube tutorial thumbnails and deployment guides.
  - **Issue:** All documentation links in Section "Start Here" (lines 45-51) and Section "Documentation Map" (lines 63-75) link to `./docs/*.md` (e.g. `./docs/ENV_GUIDE.md`, `./docs/quick-start.md`, `./docs/architecture.md`). Since the documentation is in `obsidian-docs/`, all of these relative links are 404 dead links on GitHub.
- **`CHANGELOG.md`:**
  - Follows Keep a Changelog.
  - **Issue:** Documents `[3.0.0]` (2026-05-22), `[2.0.0]` (2026-04-01), `[1.0.0]` (2025-12-01), and `[Unreleased]`. Does not have a formal `[3.1.0]` release section even though `package.json` and `index.html` are at `3.1.0`.
- **`LICENSE`:**
  - MIT License, Copyright (c) 2026 NABORAJ SARKAR. Valid.
- **`ai-readme.txt`:**
  - Instructions for AI models.
  - **Issue:** Line 16 refers to `/docs/` instead of `obsidian-docs/`.
- **`llm.txt` / `public/llms.txt`:**
  - Vector embedding and LLM prompt reference files (7,628 bytes each, exact duplicates).
  - **Issues:**
    1. Line 14 specifies `Build System: Vite 5` (project uses Vite 8).
    2. Section 3 directory map lists `docs/` instead of `obsidian-docs/`.
    3. Section 3 lists outdated component paths: `src/features/birthday/CinematicIntro.tsx`, `CakeCutting.tsx`, etc., whereas actual files reside in `src/components/birthday/`.

### 3.2 Obsidian Documentation Vault (`obsidian-docs/`)

The repository contains 27 Obsidian markdown files with YAML frontmatter tags and wikilinks (`[[file|Title]]`).

| File | Status & Contents |
|---|---|
| `DOCUMENTATION_INDEX.md` | Header says `v3.0`. Lists core documents. In line 185, marks `UPGRADE_SUMMARY.md` as deleted, but `upgrade-summary.md` and `implementation-summary.md` still exist in the folder. Does not index 7 newer documents. |
| `quick-start.md` | 5-minute setup guide. Accurate `npm install`, `npm run dev`. |
| `ENV_GUIDE.md` | Comprehensive 15+ recipe guide for env variables. Matches `.env.example`. |
| `env-configs.md` | Ready-to-copy configurations for romantic, friend, sibling, parent profiles. |
| `architecture.md` | Three-layer architecture (data, design, execution), FSM state progression. |
| `developer-guide.md` | Component API reference and extension patterns. |
| `family-system.md` | Documentation for 18+ relationship types and JSON schema customization. |
| `template-architecture.md` | Data flow and type model documentation for preset templates. |
| `styleguide.md` | Coding standards, formatting rules, Tailwind conventions. |
| `deployment.md` | Detailed deployment guides for Vercel, Netlify, Docker, AWS, Termux. |
| `troubleshooting.md` | Common runtime, build, and styling issues and fixes. |
| `faq.md` | Frequently asked questions. |
| `roadmap.md` | Version history and future feature plans. |
| `migration-guide.md` | Upgrading from v1 to v2 to v3. |
| `seo-guide.md` | Meta tags, OpenGraph, sitemap, and robots.txt setup. |
| `llm-access.md` | LLM context-injection instructions. |
| `setup-hindi.md` | Localized Hindi setup guide. |
| `setup-bengali.md` | Localized Bengali setup guide. |
| `Animation-System.md` | Deep dive into Framer Motion spring variants and SVG animations. |
| `Birthday-Components.md` | Granular breakdown of birthday components. |
| `Codebase-Map.md` | Comprehensive node mapping of the codebase. |
| `GitHub-Automation.md` | Triage and automation architecture. |
| `Template-System-Deep-Dive.md` | Family and relationship model architecture. |
| `UI-Components.md` | Generic UI components breakdown. |
| `Website-Architecture.md` | Web architecture overview. |
| `implementation-summary.md` | Legacy implementation summary notes (unindexed). |
| `upgrade-summary.md` | Legacy upgrade notes (unindexed). |

### 3.3 Public Static Assets & SEO Metadata

- `public/robots.txt` & `public/sitemap.xml`:
  - **Issue:** Sitemap URL and hostname in `robots.txt` (lines 2, 22) and `sitemap.xml` (all `<loc>` tags) reference `https://birthday-bloom-by-naboraj.vercel.app` instead of the canonical URL `https://birthday-bloom.vercel.app` used in `index.html`, `README.md`, and OpenGraph tags.
- `public/site.webmanifest`: Valid web manifest with 192x192 and 512x512 icons.
- `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `og-image.jpg`: All present and valid.

### 3.4 Repository Scripts & Scratch Files

- `scripts/obsidian-migration.mjs`: One-time migration script used to convert docs to Obsidian format and wikilinks.
- `scripts/strip-comments.js` & `scripts/strip-comments.cjs`: Exact duplicate TS comment stripping utility. One should be standardized or consolidated.
- `test-crash.cjs`: Scratch Puppeteer test script in repository root requiring external `puppeteer` package (not in `package.json`). Candidate for cleanup or moving to tests.
- `attached_assets/screenshot-1771336210205.png`: Unreferenced scratch screenshot.

---

## 4. Git Repository Status, Branches & Remotes

- **Current Branch:** `main` (synced with `origin/main`).
- **Remote Origin:** `https://github.com/naborajs/birthday-bloom.git`.
- **Existing Git Branches:**
  - `main` (default)
  - `audit/production-readiness`
  - `feature/cake-cutting-redesign`
- **Git Tags:** `v1.0.0`, `v3`.
- **Commit Log Highlights:**
  - `169ea34`: Merge pull request #70 from naborajs/feature/cake-cutting-redesign
  - `f70c5bc`: docs: add 48-hour assignment rule to contributing guidelines
  - `ed0655b`: chore: make pull request template significantly more detailed
  - `4c22489`: chore: add custom request issue template
  - `6653cfe`: ci: remove expensive triage workflows to save github action credits

---

## 5. Cross-File Inconsistencies Matrix

| Item | File A | File B | File C / Others | Inconsistency Details |
|---|---|---|---|---|
| **Version Number** | `package.json`: `3.1.0` | `index.html`: `3.1.0`, `README.md`: `v3.1` | `CHANGELOG.md`: `[3.0.0]` / `[Unreleased]`, `.env.example`: `v3.0`, `DOCUMENTATION_INDEX.md`: `v3.0` | Incomplete version propagation across changelog, env template, and documentation index. |
| **Doc Directory Path** | Actual folder: `obsidian-docs/` | `README.md`, `.github/CONTRIBUTING.md`, `.github/SUPPORT.md`, `ai-readme.txt`: `docs/` | `.github/ISSUE_TEMPLATE/config.yml`: `https://github.com/.../docs/...` | Broken links and 404s everywhere outside of `obsidian-docs/`. |
| **Production Domain** | `index.html`: `https://birthday-bloom.vercel.app` | `README.md`: `https://birthday-bloom.vercel.app` | `public/robots.txt` & `public/sitemap.xml`: `https://birthday-bloom-by-naboraj.vercel.app` | Inconsistent domain name in SEO robots & sitemaps vs OpenGraph and README. |
| **Action Versions** | `ci.yml`: `actions/checkout@v7`, `actions/setup-node@v7` | `repo-health.yml`: `actions/checkout@v7`, `actions/github-script@v9` | Standard GitHub action releases: checkout is v4, setup-node is v4 | Invalid future action versions specified in CI workflows. |
| **Component Paths** | Actual code: `src/components/birthday/CinematicIntro.tsx` | `llm.txt` / `public/llms.txt`: `src/features/birthday/CinematicIntro.tsx` | `obsidian-docs/Codebase-Map.md`: lists actual paths | Stale directory map in AI/LLM ingestion files. |
| **Vite Version** | `package.json`: `vite ^8.2.0` | `llm.txt`: `Build System: Vite 5` | `public/llms.txt`: `Build System: Vite 5` | LLM guidance documents outdated Vite major version. |
| **Author Meta** | `package.json`: `"author": "Naboraj Sarkar"` | `index.html`: `"Naboraj Sarkar \| Naboraj Sarkar"` | `LICENSE`: `NABORAJ SARKAR` | Double author name with delimiter in HTML meta tag. |
| **Automation Workflow Docs** | `.github/workflows/`: `issue-assignment.yml`, `repo-health.yml`, `sync-labels.yml` | `.github/docs/automation/README.md`: `triage-issues.yml`, `triage-prs.yml` | `.github/scripts/pr-triage.js` (uninvoked) | Documentation reflects deleted workflows. |

---

## 6. Recommendations for Milestone 3 (Cross-file Consistency & Docs)

Based on this survey, the following prioritized steps are recommended for the implementation team:

### Priority 1: Fix CI/CD Workflows & Build Tooling
1. **Fix TypeScript & ESLint Compatibility:**
   - Normalize `typescript` in `package.json` to a stable release compatible with `@typescript-eslint` (or update ESLint / `@typescript-eslint` dependencies to match TS 7).
   - In `tsconfig.json` and `tsconfig.app.json`, remove deprecated `"baseUrl": "."` and update paths mapping to `"@/*": ["./src/*"]`.
   - In `eslint.config.js`, verify parser and enable strict code hygiene rules (e.g. enable unused variable warnings with underscore ignore pattern).
2. **Fix `vite.config.ts` Warnings:**
   - Replace `path.resolve(__dirname, "./src")` with `path.resolve(import.meta.dirname, "./src")` or `fileURLToPath(new URL('./src', import.meta.url))`.
   - Consider transitioning from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react-oxc` or updating plugin options to silence Vite 8 deprecations.
3. **Fix GitHub Actions Workflows:**
   - In `.github/workflows/ci.yml`, update actions to standard supported versions (`actions/checkout@v4`, `actions/setup-node@v4`).
   - In `.github/workflows/sync-labels.yml`, add `actions/checkout@v4` prior to the script step, and add `.github/automation.config.json` to the trigger paths.
   - In `.github/workflows/repo-health.yml`, update `actions/checkout@v4`.

### Priority 2: Comprehensive Documentation Link & Path Remediation
1. **Fix All External Markdown Links:**
   - Update `README.md` to point all `./docs/*` links to `./obsidian-docs/*`.
   - Update `.github/CONTRIBUTING.md` and `.github/SUPPORT.md` to point relative links to `../obsidian-docs/*`.
   - Update `.github/ISSUE_TEMPLATE/config.yml` URLs from `.../blob/main/docs/...` to `.../blob/main/obsidian-docs/...`.
   - Update `ai-readme.txt` from `/docs/` to `obsidian-docs/`.
2. **Update `llm.txt` and `public/llms.txt`:**
   - Correct Vite version from Vite 5 to Vite 8.
   - Update file tree from `docs/` to `obsidian-docs/`.
   - Correct component file paths from `src/features/birthday/*` to `src/components/birthday/*`.
3. **Harmonize `DOCUMENTATION_INDEX.md`:**
   - Bump title to v3.1.
   - Index the 7 newer documents (`Animation-System.md`, `Birthday-Components.md`, `Codebase-Map.md`, `GitHub-Automation.md`, `Template-System-Deep-Dive.md`, `UI-Components.md`, `Website-Architecture.md`).
   - Clean up or reconcile legacy files (`upgrade-summary.md`, `implementation-summary.md`).
4. **Update `CHANGELOG.md`:**
   - Add a formal `## [3.1.0]` release section reflecting current features, open-source upgrade, and bug fixes.

### Priority 3: Cross-File Metadata & SEO Domain Harmonization
1. **Synchronize Production URLs:**
   - Update `public/robots.txt` and `public/sitemap.xml` to use the canonical URL `https://birthday-bloom.vercel.app/`.
2. **Clean up HTML Metadata:**
   - In `index.html`, fix `<meta name="author" content="Naboraj Sarkar" />` (remove duplicate).
3. **Clean up Repository Scratch Files:**
   - Remove `test-crash.cjs` or relocate to `src/test/`.
   - Remove redundant `.github/pr-automation.config.json`.
   - Deduplicate `scripts/strip-comments.js` / `.cjs`.
   - Update `.github/docs/automation/README.md` to accurately reflect active workflows (`issue-assignment.yml`, `repo-health.yml`, `sync-labels.yml`).
