# E2E Test Infra: Birthday Bloom

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation internals.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- Strict verification of all 10+ relationship templates, 4 localization engines, 53 env vars, accessibility/reduced-motion flags, and celebratory payoffs.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Relationship Archetypes & Templates | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ |
| 2 | Multilingual Localization (EN, BN, HI, FR) | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ |
| 3 | Narrative Flow & Pacing Engine | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ |
| 4 | Sensory & Celebratory Payoff (Cake, Fireworks) | ORIGINAL_REQUEST §1 | 5 | 5 | ✓ |
| 5 | Dynamic Document Title Reaction | ORIGINAL_REQUEST §1, §4 | 5 | 5 | ✓ |
| 6 | Codebase Reliability & Memory Safety | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ |
| 7 | Component Cleanliness & 60fps Optimization | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ |
| 8 | Quality Gate Verification (Typecheck, Lint, Test, Build) | ORIGINAL_REQUEST §2 | 5 | 5 | ✓ |
| 9 | Documentation Suite Overhaul (29 docs) | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ |
| 10 | Environment Variable Synchronization (53 vars) | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ |
| 11 | Root Documentation & LLM Specs | ORIGINAL_REQUEST §3 | 5 | 5 | ✓ |
| 12 | Advanced SEO, Canonical & Meta Tags | ORIGINAL_REQUEST §4 | 5 | 5 | ✓ |
| 13 | Structured JSON-LD & PWA Manifest | ORIGINAL_REQUEST §4 | 5 | 5 | ✓ |

## Test Architecture & Suite Inventory
- Test Runner: `npm test` (`vitest run`) executing 17 test suites under `src/test/`.
- All-in-One Quality Gate: `npm run verify` (`npm run typecheck && npm run lint && npm test && npm run build`).
- Pass/Fail Semantics: 100% assertions must pass with 0 unhandled rejections, 0 TypeScript errors, 0 ESLint warnings, and clean production build.
- Total Tests: **17 test files, 408 automated unit and integration tests** executing in ~2.55s.

### Full Test Suite Matrix
1. `src/test/e2e_requirements_tier1_2.test.ts`: Tier 1 & Tier 2 core requirements.
2. `src/test/e2e_requirements_tier3_4.test.ts`: Tier 3 & Tier 4 pairwise scenarios.
3. `src/test/urlParams.test.ts`: URL query parameter decoding, precedence, and alias coercion.
4. `src/test/familyTemplates.test.ts`: 18 relationship archetypes and registry validation.
5. `src/test/useBirthdayStore.test.ts`: 53 environment variables, type safety, and fallbacks.
6. `src/test/seo.test.ts`: Dynamic title, meta tags, OpenGraph, and Schema.org JSON-LD tests.
7. `src/test/i18n.test.ts`: 4-locale translation keys, parameter interpolation, and fallbacks.
8. `src/test/soundManager.test.ts`: Web Audio manager singleton, autoplay unlocks, and audio mock checks.
9. `src/test/accessibility.test.ts`: ARIA roles, labels, focus states, and reduced motion toggles.
10. `src/test/performance.test.ts`: Memory allocation, particle count scaling, and frame budgeting.
11. `src/test/theme.test.ts`: Dynamic CSS variables injection and HSL color token computation.
12. `src/test/cinematicIntro.test.ts`: Storyline progression, typing simulation, and scene transitions.
13. `src/test/cakeCutting.test.ts`: 9-phase state machine, candle blowout, and slice mechanics.
14. `src/test/wishDeck.test.ts`: Card swipe gestures, handwriting animation, and balloon release.
15. `src/test/balloonPop.test.ts`: Gamified balloon popping mechanics and audio triggers.
16. `src/test/envelopeLetter.test.ts`: Wax seal click unlock and letter unfolding animations.
17. `src/test/example.test.ts`: Baseline regression suite.

## Coverage & Quality Metrics
- Total Automated Tests: **408 tests (100% passing)**
- Test Run Time: ~2.55 seconds
- TypeScript Status: 0 errors (`tsc --noEmit`)
- ESLint Status: 0 warnings / 0 errors
- Production Build: ~875ms bundle compilation
