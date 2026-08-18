# Handoff Report — Explorer 3: Configs, Workflows & Docs Survey

## 1. Observation

### Observation 1.1: Build, Lint and TypeCheck Errors
Running the verification commands produced the following verbatim terminal outputs:
```bash
> birthday-bloom@3.1.0 lint
> eslint .

Oops! Something went wrong! :(
ESLint: 10.8.1
TypeError: Cannot read properties of undefined (reading 'Cjs')
    at Object.<anonymous> (D:\Projects\Website\birthday-bloom\node_modules\typescript-eslint\node_modules\@typescript-eslint\typescript-estree\dist\create-program\shared.js:59:18)
```
```bash
npx tsc --noEmit
tsconfig.json(5,5): error TS5102: Option 'baseUrl' has been removed. Please remove it from your configuration.
  Use '"paths": {"*": ["./*"]}' instead.
```
```bash
> birthday-bloom@3.1.0 build
> vite build
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, which is planned to become the default in a future major version of Vite:
  - `__dirname` (vite.config.ts:42:25). Use `import.meta.dirname` instead
2:57:51 pm [vite] warning: `esbuild` option was specified by "vite:react-swc" plugin. This option is deprecated, please use `oxc` instead.
```

### Observation 1.2: Broken Documentation Links & Dead 404s
- In `README.md` lines 45–51 and lines 63–75: Links reference `./docs/ENV_GUIDE.md`, `./docs/quick-start.md`, `./docs/architecture.md`, etc.
- In `.github/CONTRIBUTING.md` lines 39, 74, 148, 233, 234, 256: Links reference `docs/architecture.md`, `../docs/styleguide.md`, etc.
- In `.github/SUPPORT.md` lines 11–15 and line 34: Links reference `../docs/ENV_GUIDE.md`, `../docs/quick-start.md`, etc.
- In `.github/ISSUE_TEMPLATE/config.yml` lines 4, 7, 10: URLs reference `https://github.com/naborajs/birthday-bloom/blob/main/docs/DOCUMENTATION_INDEX.md`, `ENV_GUIDE.md`, `troubleshooting.md`.
- In `ai-readme.txt` line 16: References `/docs/`.
- In the repository, no `docs/` directory exists in the root; all documentation is located in `obsidian-docs/`.

### Observation 1.3: Workflow Flaws & Dead Automation Files
- In `.github/workflows/ci.yml` lines 20 & 23:
  `uses: actions/checkout@v7` and `uses: actions/setup-node@v7` (standard current action versions are `v4`).
- In `.github/workflows/sync-labels.yml` lines 19–28:
  The job runs `actions/github-script@v9` and executes `fs.readFileSync('.github/automation.config.json')` without any prior `actions/checkout` step. On a GitHub runner, this triggers `ENOENT: no such file or directory`.
- In commit `6653cfe`: `ci: remove expensive triage workflows to save github action credits` removed `triage-issues.yml` and `triage-prs.yml`.
- Consequently, `.github/scripts/pr-triage.js` (313 lines) and `.github/pr-automation.config.json` (66 lines) remain unreferenced and unused. `.github/docs/automation/README.md` still documents the deleted triage workflows.

### Observation 1.4: Domain & Cross-File Metadata Discrepancies
- In `public/robots.txt` lines 2 & 22: References `https://birthday-bloom-by-naboraj.vercel.app` and `https://birthday-bloom-by-naboraj.vercel.app/sitemap.xml`.
- In `public/sitemap.xml` lines 8, 17, 25, 33, 41, 49, 57, 66, 75, 84: All `<loc>` tags reference `https://birthday-bloom-by-naboraj.vercel.app`.
- In `index.html` lines 30, 34, 41: OpenGraph and Twitter tags reference canonical URL `https://birthday-bloom.vercel.app`.
- In `index.html` line 22: `<meta name="author" content="Naboraj Sarkar | Naboraj Sarkar" />` (duplicated).
- In `package.json` line 4: `"version": "3.1.0"`. `CHANGELOG.md` only documents up to `[3.0.0]` and `[Unreleased]`. `obsidian-docs/DOCUMENTATION_INDEX.md` line 6 states `Birthday Bloom v3.0`. `.env.example` line 1 states `Birthday Bloom v3.0`.
- In `llm.txt` & `public/llms.txt`: Line 14 specifies `Build System: Vite 5` (actual is Vite 8). Lines 58–62 specify `src/features/birthday/*` (actual components are in `src/components/birthday/*`).

### Observation 1.5: Scratch / Duplicate Files
- Root file `test-crash.cjs` (58 lines) uses `require('puppeteer')`, which is not in `package.json` dependencies.
- `scripts/strip-comments.js` and `scripts/strip-comments.cjs` are identical copies.
- `attached_assets/screenshot-1771336210205.png` is unreferenced.

---

## 2. Logic Chain

1. **Premise A (Tooling Failure):** Based on Observation 1.1, `package.json` specifies `"typescript": "^7.0.2"` and `tsconfig.json` contains `"baseUrl": "."`. Because TypeScript 7 removed `baseUrl` and is incompatible with the installed `@typescript-eslint` packages, both `npm run lint` and `npx tsc --noEmit` fail, directly breaking the project's quality checks.
2. **Premise B (Doc Broken Navigation):** Based on Observation 1.2, documentation was previously moved to `obsidian-docs/` during Obsidian conversion (as documented in `scripts/obsidian-migration.mjs`), but external markdown files, issue templates, and AI guides were never updated to reflect the new directory name. Therefore, anyone clicking documentation links in README, contributing guides, or issue templates receives a 404 error.
3. **Premise C (Broken CI Automation):** Based on Observation 1.3, `sync-labels.yml` assumes the repository workspace is pre-populated without a checkout step. Without `actions/checkout`, the workspace is empty when the GitHub Script runs, causing guaranteed runtime failure.
4. **Premise D (Stale Artifacts & Drift):** Based on Observations 1.3, 1.4, and 1.5, previous PR triage workflows were removed to conserve CI credits, leaving behind orphaned scripts (`pr-triage.js`, `pr-automation.config.json`) and outdated documentation (`.github/docs/automation/README.md`). Domain URLs in SEO files drifted from the primary Vercel deployment URL, and version numbers across documentation files are stuck on 3.0 rather than 3.1.0.

---

## 3. Caveats

- **Active Branches:** Two branches exist remotely (`audit/production-readiness` and `feature/cake-cutting-redesign`). This survey was strictly conducted on the default `main` branch.
- **Node.js Environment:** Local environment ran on Node.js v20 (matching `.nvmrc`).
- **Source Code Immutability:** In accordance with the read-only explorer role, no source or config files were modified during this survey.

---

## 4. Conclusion

The repository is structurally sound and functionally responsive in terms of React components and Vitest unit tests (all 7 tests pass). However, there is significant configuration, CI/CD, and documentation debt:
1. **Critical CI/Lint Failures:** Must fix TypeScript configuration (`baseUrl` deprecation) and TypeScript/ESLint package alignment to allow `npm run lint` and `npx tsc --noEmit` to pass cleanly.
2. **Critical Broken Links:** All doc references in `README.md`, `.github/CONTRIBUTING.md`, `.github/SUPPORT.md`, and `.github/ISSUE_TEMPLATE/config.yml` must be updated from `docs/` to `obsidian-docs/`.
3. **Workflow & Script Cleanup:** Fix missing checkout in `sync-labels.yml`, correct invalid GitHub action versions (`@v7` → `@v4`), and clean up or archive orphaned triage scripts and scratch files (`test-crash.cjs`, `attached_assets/`).
4. **Metadata & Domain Synchronization:** Align version numbers to `3.1.0` in `CHANGELOG.md`, `.env.example`, and `DOCUMENTATION_INDEX.md`; synchronize SEO domain in `robots.txt` and `sitemap.xml` to `https://birthday-bloom.vercel.app`.

---

## 5. Verification Method

To independently verify the survey findings:

1. **Verify Tooling Errors:**
   ```bash
   npm run lint        # Fails with TypeError in @typescript-eslint
   npx tsc --noEmit    # Fails with TS5102 Option 'baseUrl' has been removed
   npm run build       # Emits Vite __dirname deprecation warning
   npm test            # Passes (3 test files, 7 tests)
   ```
2. **Verify Broken Links:**
   - Inspect `README.md` lines 45–51 (`./docs/ENV_GUIDE.md`) vs filesystem (only `obsidian-docs/` exists).
   - Inspect `.github/ISSUE_TEMPLATE/config.yml` lines 4, 7, 10 URLs.
3. **Verify Workflow Flaws:**
   - Inspect `.github/workflows/sync-labels.yml` (notice absence of `actions/checkout` step before line 20).
   - Inspect `.github/workflows/ci.yml` line 20 (`actions/checkout@v7`).
4. **Verify Domain & Metadata Discrepancies:**
   - Inspect `public/robots.txt` line 2 vs `index.html` line 34.
   - Inspect `index.html` line 22 (`author`).
