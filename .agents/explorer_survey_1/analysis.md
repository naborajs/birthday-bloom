# Explorer 1: Dependencies, Build Systems & Toolchain Survey Report

**Author**: Explorer 1 (Dependencies & Build Survey)  
**Date**: 2026-08-18  
**Project**: Birthday Bloom (`d:\Projects\Website\birthday-bloom`)  
**Mode**: Read-only Investigation  

---

## Executive Summary

A comprehensive investigation into the package configuration, dependency graph, build systems, linting/typechecking toolchains, and environment of Birthday Bloom was conducted. 

Key critical findings:
1. **Corrupted Lockfile (`package-lock.json`)**: Contains **10 unresolved Git merge conflict blocks**, breaking `npm audit` and `npm ci` (`ENOLOCK: loadVirtual requires existing shrinkwrap file`).
2. **Broken Linting Toolchain (`npm run lint`)**: ESLint 10.8.1 crashes (`TypeError: Cannot read properties of undefined (reading 'Cjs')`) due to an AST parser incompatibility between `typescript-eslint` 8.64.0 and TypeScript 7.0.2.
3. **Broken TypeScript Type Checking (`npx tsc --noEmit`)**: Fails with `TS5102: Option 'baseUrl' has been removed` because TypeScript 7 removed `baseUrl`.
4. **4 Security Vulnerabilities Identified**: Once conflict markers are resolved, standard `npm audit` reports 2 High (DoS in `brace-expansion`, infinite loop in `nanoid`) and 2 Moderate (`react-router` / `react-router-dom` open redirect and XSS) vulnerabilities.
5. **Massive Boilerplate Dependency Bloat**: 46 of 49 Shadcn UI component files in `src/components/ui` are unused by the application. They pull in 25+ Radix UI packages, `cmdk`, `recharts`, `embla-carousel-react`, `input-otp`, `react-resizable-panels`, `react-day-picker`, `react-hook-form`, and `vaul`.
6. **Passing Test & Build Pipelines**: `npm run build` and `npm test` (Vitest, 7/7 tests) currently succeed, though Vite 8 emits deprecation warnings regarding `__dirname` and `@vitejs/plugin-react-swc`.

---

## 1. Environment & Runtime Specifications

| Property | Value | Notes / Discrepancies |
| :--- | :--- | :--- |
| **Node.js Local Runtime** | `v25.6.0` | Active Node version on development machine |
| **Node.js Configured** | `20` | Specified in `.nvmrc` and `.github/workflows/ci.yml` |
| **NPM Version** | `11.8.0` | Active package manager |
| **Lockfile Version** | `3` | `package-lock.json` |
| **Module System** | ESM (`"type": "module"`) | Specified in `package.json:5` |
| **License & Version** | MIT / v3.1.0 | Specified in `package.json` and `index.html` |

---

## 2. Lockfile & Conflict Marker Analysis

The file `package-lock.json` (365 KB, 10,033 lines) contains 10 unresolved Git merge conflict blocks between `HEAD` and `origin/main`.

### Conflict Locations:
1. **Lines 20–64**: Dependency version conflict for `@radix-ui/react-*` packages in root package declaration.
2. **Lines 83–88**: DevDependency version conflict for `@types/node`.
3. **Lines 905–941**: `node_modules/@radix-ui/react-dropdown-menu` block.
4. **Lines 3713–3724**: `node_modules/@radix-ui/react-hover-card` block.
5. **Lines 3818–3912**: `node_modules/@radix-ui/react-label` and `@radix-ui/react-menubar` blocks.
6. **Lines 3931–3975**: `node_modules/@radix-ui/react-navigation-menu` block.
7. **Lines 3990–4083**: `node_modules/@radix-ui/react-popover` and `@radix-ui/react-progress` blocks.
8. **Lines 5152–5179**: `node_modules/@radix-ui/react-radio-group` block.
9. **Lines 5461–5478**: `node_modules/@radix-ui/react-scroll-area` block.
10. **Lines 6765–7045**: `node_modules/@radix-ui/react-select` through `@radix-ui/react-tooltip` blocks.

### Impact:
- Running `npm ci` fails immediately.
- Running `npm audit` fails immediately (`npm error code ENOLOCK`).
- Running `npm install` without flags would re-trigger conflict parsing issues.

---

## 3. Toolchain & Script Execution Audit

| Script | Command | Status | Result / Output Summary |
| :--- | :--- | :--- | :--- |
| `dev` | `vite` | Available | Starts Vite dev server on port 5000 (host: `0.0.0.0`) |
| `build` | `vite build` | **PASS (0)** | Produces `dist/` bundle in 932ms. Warnings: `__dirname` deprecated in Vite config (use `import.meta.dirname`); `@vitejs/plugin-react-swc` recommends `@vitejs/plugin-react-oxc`. |
| `build:dev` | `vite build --mode development` | Available | Development bundle mode |
| `lint` | `eslint .` | **FAIL (1)** | `TypeError: Cannot read properties of undefined (reading 'Cjs')` at `@typescript-eslint/typescript-estree/dist/create-program/shared.js:59:18` |
| `preview` | `vite preview` | Available | Serves production build |
| `test` | `vitest run` | **PASS (0)** | 3 test files, 7 unit tests passed in 985ms |
| `test:watch` | `vitest` | Available | Interactive watch mode |
| *Typecheck (CI)* | `npx tsc --noEmit` | **FAIL (1)** | `tsconfig.json(5,5): error TS5102: Option 'baseUrl' has been removed. Use '"paths": {"*": ["./*"]}' instead.` |

### Detailed Script Findings:

#### 1. `npm run lint` Breakdown
- Configuration file: `eslint.config.js` (Flat config format).
- Packages: `eslint@10.8.1`, `typescript-eslint@8.64.0`, `@eslint/js@9.32.0`, `eslint-plugin-react-hooks@5.2.0`, `eslint-plugin-react-refresh@0.5.3`.
- Root cause: `@typescript-eslint/typescript-estree` fails to inspect AST when compiling with TypeScript 7 module resolution.
- Additional note: Line 23 of `eslint.config.js` sets `"@typescript-eslint/no-unused-vars": "off"`. This masks dead variables in code.

#### 2. `npx tsc --noEmit` Breakdown
- Configuration files: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.
- In `tsconfig.json:5` and `tsconfig.app.json:25`, `"baseUrl": "."` is present.
- In TypeScript 7+, `baseUrl` is removed in favor of direct path mappings (`paths`).
- `tsconfig.app.json` has linting/strict flags disabled (`strict: false`, `noUnusedLocals: false`, `noUnusedParameters: false`, `noImplicitAny: false`).

---

## 4. Security Audit Findings (`npm audit`)

Upon sanitizing the conflict markers from `package-lock.json`, running `npm audit --json` yielded **4 vulnerabilities** across 649 total dependencies:

```json
{
  "vulnerabilities": {
    "info": 0,
    "low": 0,
    "moderate": 2,
    "high": 2,
    "critical": 0,
    "total": 4
  }
}
```

### Vulnerability Breakdown:

| Package | Severity | Affected Version Range | Advisory & Description | Direct / Transitive | Fix Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`brace-expansion`** | **HIGH** | `2.0.0 - 2.1.3` \|\| `4.0.0 - 5.0.8` | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895): DoS via exponential-time expansion & unbounded intermediate memory allocation | Transitive (via `glob`) | Update `glob` / `brace-expansion` to `>= 2.1.4` or `>= 5.0.9` |
| **`nanoid`** | **HIGH** | `< 3.3.18` | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8): Custom generators loop indefinitely when size is 0 | Transitive (via `postcss`) | Update `nanoid` to `>= 3.3.18` |
| **`react-router`** | **MODERATE** | `6.0.0 - 7.17.0` | [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg): Open redirect via backslash & arbitrary constructor injection in `deserializeErrors()` | Transitive (via `react-router-dom`) | Upgrade `react-router` to `>= 7.18.0` |
| **`react-router-dom`** | **MODERATE** | `6.30.2 - 6.30.4` | [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2): Open redirect leading to XSS | **Direct** (`^6.30.1` in `package.json`) | Upgrade `react-router-dom` to `>= 7.18.2` |

---

## 5. Complete Dependency Inventory & Usage Mapping

### 5.1 Production Dependencies (`dependencies`)

Total declared: 52 packages.

| Package | Declared Version | Installed Version | Used in `src`? | Usage / Purpose | Upgrade / Action Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `@radix-ui/react-accordion` | `^1.2.20` | `1.2.20` | Boilerplate UI only | Unused by app (`accordion.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-alert-dialog` | `^1.1.23` | `1.1.23` | Boilerplate UI only | Unused by app (`alert-dialog.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-aspect-ratio` | `^1.1.15` | `1.1.15` | Boilerplate UI only | Unused by app (`aspect-ratio.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-avatar` | `^1.2.6` | `1.2.6` | Boilerplate UI only | Unused by app (`avatar.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-checkbox` | `^1.3.11` | `1.3.11` | Boilerplate UI only | Unused by app (`checkbox.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-collapsible` | `^1.1.11` | `1.1.20` | Boilerplate UI only | Unused by app (`collapsible.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-context-menu` | `^2.3.7` | `2.3.7` | Boilerplate UI only | Unused by app (`context-menu.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-dialog` | `^1.1.14` | `1.1.23` | Boilerplate UI only | Unused by app (`dialog.tsx`, `sheet.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-dropdown-menu` | `^2.1.24` | `2.1.24` | Boilerplate UI only | Unused by app (`dropdown-menu.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-hover-card` | `^1.1.23` | `1.1.23` | Boilerplate UI only | Unused by app (`hover-card.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-label` | `^2.1.15` | `2.1.15` | Boilerplate UI only | Unused by app (`label.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-menubar` | `^1.1.24` | `1.1.24` | Boilerplate UI only | Unused by app (`menubar.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-navigation-menu` | `^1.2.22` | `1.2.22` | Boilerplate UI only | Unused by app (`navigation-menu.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-popover` | `^1.1.23` | `1.1.23` | Boilerplate UI only | Unused by app (`popover.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-progress` | `^1.1.16` | `1.1.16` | Boilerplate UI only | Unused by app (`progress.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-radio-group` | `^1.4.7` | `1.4.7` | Boilerplate UI only | Unused by app (`radio-group.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-scroll-area` | `^1.2.18` | `1.2.18` | Boilerplate UI only | Unused by app (`scroll-area.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-select` | `^2.3.7` | `2.3.7` | Boilerplate UI only | Unused by app (`select.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-separator` | `^1.1.15` | `1.1.15` | Boilerplate UI only | Unused by app (`separator.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-slider` | `^1.4.7` | `1.4.7` | Boilerplate UI only | Unused by app (`slider.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-slot` | `^1.3.3` | `1.3.3` | Boilerplate UI only | Used in `button.tsx` (unused by app) | Keep only if `button` or `slot` needed |
| `@radix-ui/react-switch` | `^1.3.7` | `1.3.7` | Boilerplate UI only | Unused by app (`switch.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-tabs` | `^1.1.21` | `1.1.21` | Boilerplate UI only | Unused by app (`tabs.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-toast` | `^1.2.23` | `1.2.23` | **ACTIVE** | Imported in `src/components/ui/toast.tsx` | Keep / Update to latest |
| `@radix-ui/react-toggle` | `^1.1.18` | `1.1.18` | Boilerplate UI only | Unused by app (`toggle.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-toggle-group` | `^1.1.19` | `1.1.19` | Boilerplate UI only | Unused by app (`toggle-group.tsx` not imported) | Remove if unused UI cleaned up |
| `@radix-ui/react-tooltip` | `^1.2.16` | `1.2.16` | **ACTIVE** | Imported in `src/components/ui/tooltip.tsx` -> `App.tsx` | Keep / Update to latest |
| `@react-spring/three` | `^10.1.2` | `10.1.2` | **ACTIVE** | 3D animation / spring physics | Keep / Modernize |
| `@react-three/drei` | `^9.122.0` | `9.122.0` | **ACTIVE** | 3D helpers, OrbitControls, Canvas | Keep / Check React 19 compatibility |
| `@react-three/fiber` | `^8.18.0` | `8.18.0` | **ACTIVE** | React Three.js renderer | Keep / Check React 19 compatibility |
| `@types/three` | `^0.185.1` | `0.185.1` | Type Definitions | Misplaced in `dependencies` | **Move to `devDependencies`** |
| `canvas-confetti` | `^1.9.4` | `1.9.4` | **ACTIVE** | Confetti explosion animations (`Confetti.tsx`) | Keep / Latest |
| `class-variance-authority` | `^0.7.1` | `0.7.1` | **ACTIVE** | Component variants (e.g. `button.tsx`, `badge.tsx`) | Keep |
| `clsx` | `^2.1.1` | `2.1.1` | **ACTIVE** | CSS class merging in `src/lib/utils.ts` | Keep |
| `cmdk` | `^1.1.1` | `1.1.1` | Boilerplate UI only | Unused (`command.tsx` not imported) | Remove if unused UI cleaned up |
| `embla-carousel-react` | `^8.6.0` | `8.6.0` | Boilerplate UI only | Unused (`carousel.tsx` not imported) | Remove if unused UI cleaned up |
| `framer-motion` | `^12.42.2` | `12.42.2` | **ACTIVE** | Core UI animations across all pages/components | Keep / Update to `^12.43.0` |
| `input-otp` | `^1.4.2` | `1.4.2` | Boilerplate UI only | Unused (`input-otp.tsx` not imported) | Remove if unused UI cleaned up |
| `lucide-react` | `^0.462.0` | `0.462.0` | **ACTIVE** | Icons used throughout app | Keep / Update to latest `^0.462.0`+ |
| `react` | `^18.3.1` | `18.3.1` | **ACTIVE** | Core React library | Keep at 18.3.1 or evaluate React 19 |
| `react-day-picker` | `^8.10.1` | `8.10.1` | Boilerplate UI only | Unused (`calendar.tsx` not imported) | Remove if unused UI cleaned up |
| `react-dom` | `^18.3.1` | `18.3.1` | **ACTIVE** | React DOM rendering | Keep aligned with React version |
| `react-hook-form` | `^7.84.0` | `7.85.0` | Boilerplate UI only | Unused (`form.tsx` not imported) | Remove if unused UI cleaned up |
| `react-resizable-panels` | `^2.1.9` | `2.1.9` | Boilerplate UI only | Unused (`resizable.tsx` not imported) | Remove if unused UI cleaned up |
| `react-router-dom` | `^6.30.1` | `6.30.4` | **ACTIVE** | Routing (`App.tsx`, `NavLink.tsx`, `NotFound.tsx`) | **Upgrade to `>= 7.18.2` (CVE Fix)** |
| `recharts` | `^3.10.1` | `3.10.1` | Boilerplate UI only | Unused (`chart.tsx` not imported) | Remove if unused UI cleaned up |
| `sonner` | `^1.7.4` | `1.7.4` | **ACTIVE** | Toast notification provider (`App.tsx`, `sonner.tsx`) | Keep / Update |
| `tailwind-merge` | `^2.6.0` | `2.6.0` | **ACTIVE** | Class merging in `src/lib/utils.ts` | Keep / Update |
| `tailwindcss-animate` | `^1.0.7` | `1.0.7` | **ACTIVE** | Tailwind animation plugin in `tailwind.config.ts` | Keep |
| `three` | `^0.185.1` | `0.185.1` | **ACTIVE** | 3D rendering core (`Cake3D.tsx`) | Keep |
| `vaul` | `^1.1.2` | `1.1.2` | Boilerplate UI only | Unused (`drawer.tsx` not imported) | Remove if unused UI cleaned up |
| `zustand` | `^5.0.14` | `5.0.14` | **ACTIVE** | Global state store (`useBirthdayStore.ts`) | Keep / Update |

---

### 5.2 Development Dependencies (`devDependencies`)

Total declared: 19 packages.

| Package | Declared Version | Installed Version | Purpose | Upgrade / Fix Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| `@eslint/js` | `^9.32.0` | `9.32.0` | ESLint JS recommendations | Update to `^9.39.5` / `^10.0.1` |
| `@testing-library/jest-dom` | `^6.6.0` | `6.9.1` | DOM assertion matchers for Vitest | Keep / Update |
| `@testing-library/react` | `^16.0.0` | `16.3.2` | React test utilities | Keep / Update |
| `@types/node` | `^22.16.5` | `22.16.5` | Node type definitions | Update to `^22.20.1` |
| `@types/react` | `18.3.23` | `18.3.23` | React type definitions | Keep aligned with React version |
| `@types/react-dom` | `18.3.7` | `18.3.7` | React DOM type definitions | Keep aligned with React version |
| `@vitejs/plugin-react-swc` | `^3.11.0` | `3.11.0` | React SWC Vite plugin | Consider switching to `@vitejs/plugin-react-oxc` |
| `autoprefixer` | `^10.5.4` | `10.5.4` | PostCSS vendor prefixing | Keep |
| `eslint` | `^10.7.0` | `10.8.1` | Linter engine | Reconfigure / align with `typescript-eslint` |
| `eslint-plugin-react-hooks` | `^5.2.0` | `5.2.0` | React hook rules | Keep |
| `eslint-plugin-react-refresh` | `^0.5.3` | `0.5.3` | Vite React fast refresh lint rule | Keep |
| `globals` | `^15.15.0` | `15.15.0` | Browser/Node globals for ESLint | Update to `^17.11.0` |
| `jsdom` | `^20.0.3` | `20.0.3` | Test environment for Vitest | Update to `^29.1.1` |
| `postcss` | `^8.5.25` | `8.5.26` | CSS processor | Keep |
| `tailwindcss` | `^3.4.17` | `3.4.17` | Utility CSS framework | Keep at 3.4.x or plan v4 migration |
| `typescript` | `^7.0.2` | `7.0.2` | TypeScript compiler | Fix `tsconfig.json` `baseUrl` deprecation |
| `typescript-eslint` | `^8.63.0` | `8.64.0` | TypeScript ESLint plugin/parser | Fix AST loader crash / align versions |
| `vite` | `^8.2.0` | `8.2.1` | Build tool and dev server | Fix `__dirname` warning in `vite.config.ts` |
| `vitest` | `^3.2.4` | `3.2.6` | Test runner | Keep / Update |

---

## 6. Detailed Recommendations for Milestone 1 (Dependency Modernization)

### Phase 1: Lockfile Repair & Vulnerability Resolution
1. **Regenerate / Clean `package-lock.json`**:
   - Resolve all 10 Git conflict marker sections.
   - Run `npm i --package-lock-only` to ensure lockfile matches `package.json` cleanly.
2. **Move `@types/three`**:
   - Move from `dependencies` to `devDependencies` in `package.json`.
3. **Resolve `npm audit` Vulnerabilities**:
   - Upgrade `react-router-dom` to `>= 7.18.2` (or patched 6.x release).
   - Ensure `nanoid` (via `postcss`) is `>= 3.3.18`.
   - Ensure `brace-expansion` (via `glob`) is `>= 2.1.4` or `>= 5.0.9`.

### Phase 2: Build & Configuration Fixes
1. **Fix TypeScript Configurations (`tsconfig.json`, `tsconfig.app.json`)**:
   - Remove `"baseUrl": "."` from `tsconfig.json` and `tsconfig.app.json` (resolves `error TS5102`).
   - Use `"paths": { "@/*": ["./src/*"] }` directly.
   - Incrementally enable strict type checks where appropriate.
2. **Fix ESLint & `typescript-eslint` Incompatibility**:
   - Update ESLint config / `typescript-eslint` plugin to ensure compatibility with TypeScript compiler.
   - Enable `@typescript-eslint/no-unused-vars` (e.g. `"warn"` or `"error"` with `argsIgnorePattern: "^_"`) so dead code can be flagged during R1 file-by-file audit.
3. **Fix Vite Configuration Deprecations**:
   - In `vite.config.ts` line 42: Replace `__dirname` with `import.meta.dirname` (or `path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src")`).
   - In `vitest.config.ts` line 14: Replace `__dirname` with `import.meta.dirname`.
   - Evaluate switching `@vitejs/plugin-react-swc` to `@vitejs/plugin-react-oxc` to eliminate Vite 8 deprecation warnings.

### Phase 3: Dead Dependency & Boilerplate Trimming (Coordination with Milestone 2)
1. **Remove Unused Shadcn UI Boilerplate**:
   - 46 unused `.tsx` files in `src/components/ui/` can be safely removed.
   - Allows removal of 25+ unused `@radix-ui/*` packages, `cmdk`, `recharts`, `embla-carousel-react`, `input-otp`, `react-resizable-panels`, `react-day-picker`, `react-hook-form`, and `vaul`.
2. **Clean up Root Scripts**:
   - Delete obsolete `test-crash.cjs` (requires uninstalled `puppeteer`).
   - Delete duplicate/broken CommonJS `scripts/strip-comments.js` (or convert to ESM).

---

## 7. Verification Steps

To independently verify all findings:
1. **Lockfile Conflict**: `git grep -n "<<<<<<< HEAD" package-lock.json`
2. **NPM Audit**: `npm audit` (reproduces `ENOLOCK` error)
3. **Lint Failure**: `npm run lint` (reproduces `TypeError: Cannot read properties of undefined (reading 'Cjs')`)
4. **TypeScript Failure**: `npx tsc --noEmit` (reproduces `TS5102: Option 'baseUrl' has been removed`)
5. **Build Success with Warnings**: `npm run build` (reproduces Vite 8 `__dirname` warning)
6. **Test Success**: `npm test` (reproduces 7 passing tests)
