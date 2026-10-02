---
tags: [contributing, git, workflow, conventions, pr]
aliases: [contributing, contributor-guide]
---

# Contributor Guide & Workflow Standards

[[DOCUMENTATION_INDEX|Back to Index]] | [[styleguide|TypeScript & Code Standards]] | [[pull-request-policy|Pull Request Policy]] | [[code-of-conduct|Code of Conduct]] | [[test-infrastructure|Test Infrastructure]]

🌐 **Canonical Web Documentation**: [Contributor Guide & Workflow Standards](https://naborajs.me/projects/birthday-bloom/docs/contributing)

---

## 🌿 Branch Management Standards

To maintain a clean and trackable git commit history, all branches submitted for pull requests must adhere to explicit naming conventions:

- `feat/<feature-name>`: New celebration features, visual components, or engine enhancements (e.g., `feat/webgl-knife-lighting`).
- `fix/<bug-description>`: Bug fixes, patch corrections, or UI alignment repairs (e.g., `fix/audio-autoplay-ios`).
- `docs/<doc-update>`: Documentation expansions, typo corrections, or guide additions (e.g., `docs/update-env-matrix`).
- `perf/<optimization>`: Performance improvements, frame-rate boosting, or bundle reduction (e.g., `perf/raf-loop-consolidation`).
- `refactor/<scope>`: Code restructuring without functional behavior changes (e.g., `refactor/color-utils-isolation`).
- `test/<test-scope>`: New test additions, Vitest suites, or mocking improvements (e.g., `test/indic-grapheme-tests`).

---

## 📝 Conventional Commit Specifications

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. Commit messages are validated by our GitHub Actions PR quality gates:

```
<type>(<scope>): <short description>

[optional body explaining rationale and context]

[optional footer(s), e.g., Closes #123]
```

### Supported Types:
- `feat`: A new feature for users or developers.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect code logic (formatting, white-space).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `perf`: Code changes that improve performance or reduce memory footprint.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Maintenance tasks, dependency updates, or tool configurations.

### Examples:
- `feat(audio): implement floating sound toggle with persistent mute state`
- `fix(fsm): resolve timer leak on rapid intro skip`
- `docs(i18n): clarify Shirorekha ligature protections for Hindi and Bengali`

---

## ✅ PR Verification Checklist

Before opening a pull request, run the local all-in-one verification gate:

```bash
# 1. Typecheck TypeScript files
npm run typecheck

# 2. Run ESLint checks
npm run lint

# 3. Run all Vitest unit and integration suites
npm test

# 4. Verify clean production build
npm run build

# Or execute the unified verification gate:
npm run verify
```

### Self-Review Checklist:
- [ ] Code passes all linting and typecheck constraints with zero warnings or errors.
- [ ] All 400+ Vitest tests pass without regressions.
- [ ] No `@ts-ignore` or unvalidated type assertions were added.
- [ ] Documentation updated to reflect any behavioral or parameter changes.
- [ ] Tested on both desktop and mobile viewports (responsive layouts).

---

## 🔍 Scope Boundaries

### What is Present:
- Branch management conventions (`feat/`, `fix/`, `docs/`, `perf/`).
- Conventional Commit message specifications with scope rules.
- Local pre-PR verification commands and all-in-one test suite execution.
- Maintainer review workflow and self-review checklist.

### What is NOT Present:
- Low-level WebGL vertex buffer calculations (see [[Birthday-Components#3D-WebGL-Canvas-and-Component-Hierarchy|Birthday Components]]).
- Pre-built `.env.local` snippets for specific relationships (see [[env-configs#Ready-to-Use-Env-Snippets|Pre-built Persona Configurations]]).
