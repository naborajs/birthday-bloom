---
tags: [github, automation, ci, workflows, infrastructure, dependabot]
aliases: [GitHub Automation, CI/CD, Actions, Repository Workflows]
---

# GitHub Automation & CI/CD Architecture

[[DOCUMENTATION_INDEX|Back to Home]]

Birthday Bloom features a robust GitHub automation and continuous integration setup managed within the `.github/` directory.

---

## 1. Core CI/CD Workflows

### `ci.yml` — Continuous Integration Pipeline
Triggers on every push to `main` and all pull requests:
1. **Type Checking**: Runs `npm run typecheck` (`tsc --noEmit`) to verify zero TypeScript errors.
2. **Linting**: Executes `npm run lint` (`eslint .`) using modern flat ESLint 9 configuration.
3. **Automated Testing**: Runs `npm test` (`vitest run`) across all 17 test suites (408 unit and integration tests).
4. **Production Build**: Executes `npm run build` (`vite build`) to guarantee clean chunk compilation and asset bundling.

### `repo-health.yml` — Automated Maintenance
- Stale issue and PR detection and gentle notifications after periods of inactivity.
- Automatic closing of abandoned draft PRs.

### `issue-assignment.yml` & `sync-labels.yml`
- Contributor auto-assignment: Developers can claim issues by commenting `/assign` or "can I take this".
- Label synchronization across standard GitHub labels, good first issues, and Hacktoberfest tags.

---

## 2. Dependabot Configuration & Major Update Safety Guards

Automated dependency updates are managed via `.github/dependabot.yml`:

### Grouped Update Schedules
- **`radix-ui`**: Groups `@radix-ui/*` primitives.
- **`linting-testing`**: Groups `eslint*`, `@eslint/*`, `typescript-eslint`, `globals`, `@testing-library/*`, `vitest*`.
- **`build-tools`**: Groups `vite*`, `@vitejs/*`, `typescript`, `postcss`, `autoprefixer`, `tailwindcss`.
- **`actions`**: Groups all GitHub Action runners monthly.

### Semver-Major Safety Ignores
To prevent noisy, breaking automated PRs from failing CI pipelines, semver-major updates are explicitly ignored for packages requiring manual architectural migration:
- `@eslint/*` (major bump 10 requires ESLint core 10 ecosystem)
- `tailwindcss` (major bump 4 is a complete rewrite without `tailwind.config.ts`)
- `typescript` (major bump 7 requires `typescript-eslint` 9+ compatibility)
- `jsdom` (major bump 30 requires Node 20.18+/22.12+ test runner changes)

---

## 3. Issue Templates & Triage Standards

Standardized YAML issue forms ensure all community submissions contain necessary debug logs and reproduction steps:
- `bug_report.yml`: Bug reports with browser version, OS, and console errors.
- `feature_request.yml`: New 3D effects, soundscapes, or localization proposals.
- `customization_issue.yml`: Assistance with environment variable configuration or URL parameters.
- `deployment_issue.yml`: Assistance with Vercel, Netlify, Docker, or Cloudflare hosting.

---
#obsidian #documentation #birthday-bloom #vault #github #ci-cd #automation

