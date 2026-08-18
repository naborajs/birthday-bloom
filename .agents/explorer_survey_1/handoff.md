# Handoff Report — Explorer 1 (Dependencies & Build Survey)

**Agent**: Explorer 1 (Dependencies & Build Survey)  
**Recipient**: Parent Orchestrator (`139c7d7b-516a-47f1-b69e-0b2e055094cd`)  
**Date**: 2026-08-18  
**Type**: Hard Handoff (Investigation Complete)  
**Detailed Report**: `d:\Projects\Website\birthday-bloom\.agents\explorer_survey_1\analysis.md`

---

## 1. Observation

1. **Lockfile Git Merge Conflict Markers**:
   - `package-lock.json` contains 10 unresolved Git merge conflict blocks (`<<<<<<< HEAD`, `=======`, `>>>>>>> origin/main`) at lines 20–64, 83–88, 905–941, 3713–3724, 3818–3912, 3931–3975, 3990–4083, 5152–5179, 5461–5478, and 6765–7045.
   - Command `npm audit` returned:
     ```
     npm error code ENOLOCK
     npm error audit This command requires an existing lockfile.
     npm error audit Original error: loadVirtual requires existing shrinkwrap file
     ```

2. **Security Vulnerabilities (once lockfile sanitized)**:
   - When sanitized, `npm audit` reported 4 vulnerabilities:
     - `brace-expansion` (High severity, GHSA-3jxr-9vmj-r5cp / GHSA-mh99-v99m-4gvg / GHSA-rgw5-rvv9-x895 - DoS & OOM)
     - `nanoid` (High severity, GHSA-2v37-7h3g-55p8 - DoS via infinite loop)
     - `react-router` (Moderate severity, GHSA-wrjc-x8rr-h8h6 / GHSA-337j-9hxr-rhxg - Open redirect / Constructor injection)
     - `react-router-dom` (Moderate severity, GHSA-jjmj-jmhj-qwj2 - Open redirect leading to XSS)

3. **Lint Script Failure (`npm run lint`)**:
   - Command `npm run lint` (`eslint .`) crashed with exit code 1:
     ```
     TypeError: Cannot read properties of undefined (reading 'Cjs')
         at Object.<anonymous> (D:\Projects\Website\birthday-bloom\node_modules\typescript-eslint\node_modules\@typescript-eslint\typescript-estree\dist\create-program\shared.js:59:18)
     ```
   - In `eslint.config.js:23`, `"@typescript-eslint/no-unused-vars": "off"` is disabled.

4. **TypeScript Type Check Failure (`npx tsc --noEmit`)**:
   - Command `npx tsc --noEmit` exited with code 1:
     ```
     tsconfig.json(5,5): error TS5102: Option 'baseUrl' has been removed. Please remove it from your configuration.
       Use '"paths": {"*": ["./*"]}' instead.
     ```
   - `tsconfig.json:5` and `tsconfig.app.json:25` contain `"baseUrl": "."`.

5. **Build & Test Success with Vite Deprecation Warnings**:
   - Command `npm run build` (`vite build`) succeeded in 932ms (exit code 0). Emitted warnings:
     - `(!) Your Vite config uses features that are unsupported by configLoader: 'native' ... - __dirname (vite.config.ts:42:25). Use import.meta.dirname instead`
     - `[vite] warning: esbuild option was specified by "vite:react-swc" plugin. This option is deprecated, please use oxc instead.`
   - Command `npm test` (`vitest run`) succeeded with 3 test files, 7 tests passed in 985ms.

6. **Boilerplate Dependency Inventory**:
   - `package.json` declares 52 production dependencies and 19 devDependencies.
   - Out of 49 files in `src/components/ui/`, only 3 are imported by application code (`sonner.tsx`, `toast.tsx`, `tooltip.tsx`).
   - The other 46 UI components are unused boilerplate pulling in 25+ Radix UI packages, `cmdk`, `recharts`, `embla-carousel-react`, `input-otp`, `react-resizable-panels`, `react-day-picker`, `react-hook-form`, `vaul`.
   - `@types/three` (`^0.185.1`) is in `dependencies` instead of `devDependencies`.

7. **Root Directory Scripts & Files**:
   - `test-crash.cjs` requires uninstalled `puppeteer`.
   - `scripts/strip-comments.js` contains CommonJS syntax with a `.js` extension inside an ESM project (`"type": "module"`).

---

## 2. Logic Chain

1. From Observation 1 (`package-lock.json` conflict markers), `npm audit` and `npm ci` cannot load the lockfile, which blocks automated CI security audits and reproducible builds.
2. From Observation 2 (npm audit report), upgrading `react-router-dom` to `>= 7.18.2` and updating transitive dependencies (`nanoid`, `brace-expansion`) will resolve all 4 security vulnerabilities.
3. From Observation 3 & 4 (lint crash and tsc baseUrl removal), both `npm run lint` and `npx tsc --noEmit` fail due to modern toolchain incompatibilities (TypeScript 7 compiler removes `baseUrl`, and `typescript-eslint` 8.64.0 has AST loader incompatibilities).
4. From Observation 5 (Vite 8 deprecations), replacing `__dirname` with `import.meta.dirname` in `vite.config.ts` and `vitest.config.ts` will eliminate Vite warnings.
5. From Observation 6 & 7 (46 unused UI components and obsolete scripts), removing dead UI boilerplate will allow pruning >25 dependencies from `package.json`, dramatically simplifying the project dependency tree and attack surface.

---

## 3. Caveats

- **React 19 Compatibility**: React 18.3.1 is currently used. While React 19.2.8 is available, 3D libraries (`@react-three/fiber`, `@react-three/drei`) often have strict React 18 peer dependency constraints. Upgrading React to 19 should only be done if `@react-three/fiber` supports it without peer resolution issues.
- **Dead UI File Pruning**: Pruning the 46 unused UI files in `src/components/ui/` should be coordinated with Explorer 2 (Codebase & Architecture) to confirm that no future UI components planned for the app require them.

---

## 4. Conclusion

The build system and dependencies of Birthday Bloom are functional for bundling and testing, but require immediate remediation in four critical areas before Milestone 1 implementation:
1. **Lockfile fix**: Clean and re-generate `package-lock.json`.
2. **Typecheck & Lint fixes**: Remove deprecated `baseUrl` in `tsconfig*.json` and fix ESLint / `typescript-eslint` compatibility.
3. **Vulnerability remediation**: Upgrade `react-router-dom`, `nanoid`, and `brace-expansion`.
4. **Dependency hygiene**: Move `@types/three` to devDependencies and prepare removal of unused UI dependencies.

---

## 5. Verification Method

To independently verify these findings:
1. Check lockfile conflicts: `git grep -n "<<<<<<< HEAD" package-lock.json`
2. Run npm audit: `npm audit` (verifies `ENOLOCK` error)
3. Run linting: `npm run lint` (verifies ESLint TypeError crash)
4. Run TypeScript check: `npx tsc --noEmit` (verifies TS5102 error)
5. Run build: `npm run build` (verifies successful build and Vite deprecation warnings)
6. Run test suite: `npm test` (verifies 7 passing unit tests)
