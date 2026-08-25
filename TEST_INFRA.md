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

## Test Architecture
- Test Runner: `npm test` (`vitest run`) executing test suites under `src/test/`.
- Pass/Fail Semantics: 100% assertions must pass with zero unhandled rejections, 0 TypeScript errors, 0 ESLint warnings, and clean production build.
- Directory Layout:
  - `src/test/e2e_requirements_tier1_2.test.ts`: Tier 1 (Feature coverage) & Tier 2 (Boundary & Corner cases).
  - `src/test/e2e_requirements_tier3_4.test.ts`: Tier 3 (Cross-feature pairwise interactions) & Tier 4 (Real-world celebration workload scenarios).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Bengali Partner Celebration with Romantic Letters & Sound | F1, F2, F3, F4, F5, F10 | High |
| 2 | Hindi Family Milestone Celebration with Custom Timeline & Vault | F1, F2, F3, F4, F10 | High |
| 3 | French Friend Celebration with Fast Pacing & Reduced Motion | F1, F2, F3, F6, F7, F10 | Medium |
| 4 | Offline / Zero-CDN Resilient Celebration with Fallbacks | F4, F6, F7, F8 | High |
| 5 | Full Production Build, SEO, Meta & Manifest Validation | F8, F9, F10, F11, F12, F13 | High |

## Coverage Thresholds
- Tier 1: ≥5 test cases per feature (13 features = ≥65 tests)
- Tier 2: ≥5 test cases per feature (13 features = ≥65 tests)
- Tier 3: Pairwise coverage across major relationship, language, pacing, and reduced motion dimensions (≥15 tests)
- Tier 4: ≥5 realistic end-to-end celebration scenarios (≥5 tests)
- Total E2E Test Suite Goal: ≥150 rigorous test cases
