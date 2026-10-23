# E2E Test Infra: Birthday Bloom

🌐 **Canonical Web Documentation**: [Test Infrastructure & Vitest Architecture](https://naborajs.me/projects/birthday-bloom/docs/test-infrastructure)

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
- Test Runner: `npm test` (`vitest run`) executing 31 test files across `src/test/`, `src/main.test.tsx`, and `src/features/core/models/familyTemplates.test.ts`.
- All-in-One Quality Gate: `npm run verify` (`npm run typecheck && npm run lint && npm test && npm run build`).
- Pass/Fail Semantics: 100% assertions must pass with 0 unhandled rejections, 0 TypeScript errors, 0 ESLint warnings, and clean production build.
- Total Tests: **31 test files, 497 automated unit and integration tests** executing in ~5.1s.

### Full Test Suite Matrix
1. `src/test/e2e_requirements_tier1_2.test.ts`: Tier 1 & Tier 2 core requirements.
2. `src/test/e2e_requirements_tier3_4.test.ts`: Tier 3 & Tier 4 pairwise scenarios.
3. `src/test/adaptive_performance.test.ts`: Device-tier detection, DPR caps, and battery/reduced-motion profiles.
4. `src/test/reduced_motion_perf.test.ts`: Reduced-motion particle scaling and animation suppression.
5. `src/test/challenger_perf_lifecycle.test.ts`: Bundle/asset budgets, cache headers, and lifecycle cleanup.
6. `src/test/accessibility_and_ux.test.tsx`: ARIA roles, labels, focus states, and keyboard navigation.
7. `src/test/audio_filter_blow.test.ts`: Breath-filter acoustics and blow-energy accumulation.
8. `src/test/audio_utils.test.ts`: Volume clamping, mute toggles, and audio state helpers.
9. `src/test/challenger_stress.test.ts`: Store and personalization stress cases.
10. `src/test/challenger_stress_multilingual.test.ts`: Multi-locale stress and fallback behavior.
11. `src/test/color_utils.test.ts`: Hex/HSL conversion and WCAG luminance.
12. `src/test/comprehensive_env_customization_matrix.test.tsx`: Env and URL customization combinations.
13. `src/test/date_utils.test.ts`: Countdowns, leap years, and localized date formatting.
14. `src/test/dynamic_seo.test.tsx`: Dynamic title, meta tags, OpenGraph, and Schema.org JSON-LD.
15. `src/test/empirical_m2_challenge.test.tsx`: UI, routing, and animation integration challenges.
16. `src/test/env_and_emoji_customization.test.ts`: Emoji kits and environment overrides.
17. `src/test/example.test.ts`: Baseline Vitest environment sanity.
18. `src/test/fake_chat_scene.test.tsx`: Chat typing rhythm, keypad state, and completion callbacks.
19. `src/test/guestbook_section.test.tsx`: Guestbook form isolation, likes, and persistence.
20. `src/test/guestbook_templates.test.tsx`: Template-aware starter wishes.
21. `src/test/indic_grapheme_stress.test.tsx`: Bengali/Hindi grapheme and conjunct rendering.
22. `src/test/interactive_features_envelope_balloons.test.tsx`: Envelope and balloon interactions.
23. `src/test/media_utils.test.ts`: YouTube/video URL validation and sanitization.
24. `src/test/microphone_blow.test.tsx`: Mic lifecycle, throttled UI publishing, and replay reset.
25. `src/test/relationship_templates_deep.test.ts`: Relationship archetype and tone coverage.
26. `src/test/seo_and_ux_enhancements.test.tsx`: SEO and UX regression coverage.
27. `src/test/sound_toggle_and_quiz.test.tsx`: Audio toggle and quiz accessibility.
28. `src/test/url_utils.test.ts`: Query parameter encoding, validation, and fallbacks.
29. `src/test/wish_deck_and_templates.test.tsx`: Wish deck swipes and template interpolation.
30. `src/main.test.tsx`: Main application mount and DOM initialization.
31. `src/features/core/models/familyTemplates.test.ts`: 18 relationship archetypes and factory validation.

## Coverage & Quality Metrics
- Total Automated Tests: **497 tests (100% passing)**
- Test Run Time: ~5.1 seconds
- TypeScript Status: 0 errors (`tsc --noEmit`)
- ESLint Status: 0 warnings / 0 errors
- Production Build: ~1.2s bundle compilation
