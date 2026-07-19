# Contributing to Birthday Bloom

Thank you for considering a contribution to Birthday Bloom. Whether you're fixing a bug, improving documentation, polishing UI, enhancing accessibility, or building new features — your help is appreciated.

### 🎬 Video Guides for Contributors
We have created two animated walkthrough guides to help you contribute to Birthday Bloom:

#### 1. Official Contributing Guide (Overview)
<p align="center">
  <a href="https://youtu.be/V4XZRRvcxgk" target="_blank">
    <img src="https://img.youtube.com/vi/V4XZRRvcxgk/maxresdefault.jpg"
         alt="Birthday Bloom - Official Contributing Guide"
         width="900">
  </a>
</p>

<p align="center">
  <strong>🤝 Watch the Official Contributing Guide</strong><br>
  Learn how to contribute to <strong>Birthday Bloom</strong>, whether you're a first-time open-source contributor or an experienced developer. This guide covers GitHub Issues, feature requests, bug reports, forking the repository, creating branches, making meaningful commits, submitting Pull Requests, the code review process, and open-source best practices to help you become a successful contributor.
</p>

#### 2. Detailed Step-by-Step Contributor Guide (Explainer)
<p align="center">
  <a href="https://youtu.be/a9-ndTkD8IE" target="_blank">
    <img src="https://img.youtube.com/vi/a9-ndTkD8IE/maxresdefault.jpg"
         alt="How to Contribute to Birthday Bloom"
         width="900">
  </a>
</p>

<p align="center">
  <strong>📚 Watch the Complete Contributor Guide</strong><br>
  Learn how to contribute to <strong>Birthday Bloom</strong> from start to finish. This step-by-step guide covers GitHub Issues, feature requests, bug reporting, forking the repository, cloning the project, creating branches, writing meaningful commit messages, opening Pull Requests, the review process, and open-source best practices. Whether you're making your first contribution or you're an experienced developer, this guide will help you confidently contribute to the project.
</p>

---

> [!IMPORTANT]
> **Before writing code:** Please read [architecture.md](https://github.com/naborajs/birthday-bloom/blob/main/docs/architecture.md) and [styleguide.md](https://github.com/naborajs/birthday-bloom/blob/main/docs/styleguide.md) to understand how the project is structured.

---

## Table of Contents

- [Project Philosophy](#project-philosophy)
- [Development Setup](#development-setup)
- [Finding Work](#finding-work)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)
- [Ways to Contribute Beyond Code](#ways-to-contribute-beyond-code)
- [First-Time Contributors](#first-time-contributors)

---

## Project Philosophy

### 1. Environment First

The project is env-driven. Before hardcoding a value, ask: *should this be configurable?*

**Good:**
```env
VITE_BIRTHDAY_NAME=Priya
```

**Avoid:**
```ts
const name = "Priya";
```

New env variables should be added to `.env.example`, parsed in `useBirthdayStore.ts`, and documented in `docs/ENV_GUIDE.md`.

### 2. Build for Everyone

Features should work across all relationship types — partner, friend, sibling, parent, grandparent, and more. Avoid relationship-specific hardcoding. Think in systems, not one-off implementations.

### 3. Extend Existing Systems

Before creating something new, check if an existing component, template, hook, or env variable can be extended. Prefer extension over duplication.

### 4. Respect the Architecture

The repo uses a three-layer architecture: **data** (Zustand store + env parsing), **design** (CSS variable injection + Tailwind), **execution** (scene state machine). Understand these layers before making architectural changes. Incremental improvements are preferred over large rewrites.

---

## Development Setup

```bash
# Clone
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom

# Install dependencies
npm install

# Copy env template
cp .env.example .env.local

# Start dev server
npm run dev

# Run in another terminal for builds
npm run build      # production build
npm run lint       # check lint
npm test           # run tests
```

The dev server runs on `http://localhost:5000` by default.

---

## Finding Work

- **Good first issues**: [Filter by label](https://github.com/naborajs/birthday-bloom/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- **Docs improvements**: [docs_improvement template](https://github.com/naborajs/birthday-bloom/issues/new?template=docs_improvement.yml)
- **Feature requests**: [feature_request template](https://github.com/naborajs/birthday-bloom/issues/new?template=feature_request.yml)
- **Bug fixes**: [bug_report template](https://github.com/naborajs/birthday-bloom/issues/new?template=bug_report.yml)

If you want to work on something, comment on the issue first so others know it's claimed.

---

## Making Changes

### Branch Naming

```
feat/add-emoji-trail-system
fix/mobile-fireworks-cleanup
docs/improve-env-guide
refactor/simplify-store-parsing
perf/optimize-particle-render
```

### Coding Standards

See [styleguide.md](../docs/styleguide.md) for detailed conventions. Key points:

- Components: PascalCase, one per file
- Hooks: `use` prefix, camelCase
- Env variables: `VITE_UPPER_SNAKE_CASE`
- Prefer interfaces over types for object shapes
- Use Tailwind utility classes for styling
- Clean up timeouts and event listeners on unmount

### What to Check Before Submitting

1. Application runs locally (`npm run dev`)
2. Production build succeeds (`npm run build`)
3. No TypeScript errors (`npx tsc --noEmit`)
4. Lint passes (`npm run lint`)
5. Existing tests pass (`npm test`)
6. Mobile responsiveness is reasonable
7. If the change affects UI, test with multiple relationship types
8. Documentation is updated if behavior changes

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add template-aware emoji trail system
fix: resolve mobile fireworks cleanup issue
docs: improve family system documentation
refactor: simplify birthday template configuration
perf: optimize particle rendering
chore: update dependencies
```

Keep the first line under 72 characters. Reference issues in the body if applicable.

---

## Pull Request Process

We follow a strict, manually reviewed pull request process to maintain high codebase standards. Pull requests are never merged automatically. For details on merge criteria, approvals, and administrator reviews, please see our [PULL_REQUEST_POLICY.md](./PULL_REQUEST_POLICY.md).

1. **Open early, even as a draft** — feedback is welcome
2. **Link the issue** your PR addresses
3. **Describe what changed and why**
4. **Include screenshots** for UI changes
5. **Complete the PR checklist** in the template
6. **Keep PRs focused** — one logical change per PR
7. **Respond to review feedback** promptly

Reviewers will check for:
- Correctness
- Consistency with project conventions
- Accessibility considerations
- Documentation completeness
- No visual regressions

---

## Testing Requirements

### Required for All PRs

- [ ] Project runs locally
- [ ] Production build succeeds
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No merge conflicts

### For UI/Animation Changes

- [ ] Mobile layout tested
- [ ] Multiple relationship types tested (partner, friend, sibling at minimum)
- [ ] Reduced motion respected if applicable
- [ ] Performance is not regressed (check FPS on lower-end devices)

---

## Documentation Standards

If your change affects:

- **Behavior** — update relevant docs
- **Env configuration** — update `ENV_GUIDE.md` and `.env.example`
- **Architecture** — update `ARCHITECTURE.md`
- **UI** — update `FAQ.md` or `README.md` if user-facing
- **Contribution workflow** — update `CONTRIBUTING.md`

---

## Ways to Contribute Beyond Code

- **Documentation** — improve guides, fix typos, add examples
- **Issue triage** — help reproduce bugs, ask clarifying questions
- **Design feedback** — suggest UI/UX improvements
- **Accessibility review** — audit components for screen readers and keyboard navigation
- **Performance profiling** — identify janky interactions on various devices
- **Translation** — help localize docs into more languages
- **Community** — answer questions in issues and discussions

---

## First-Time Contributors

Welcome! Here's how to get started:

1. **Find a `good first issue`** — these are labeled and scoped for newcomers
2. **Read the [architecture.md](../docs/architecture.md)** to understand the codebase
3. **Set up the project** using the [Development Setup](#development-setup) section
4. **Ask questions** — comment on the issue if something is unclear
5. **Submit a draft PR** — we'll help you polish it

We appreciate every contribution, no matter how small. A typo fix, a clearer sentence in the docs, or a better error message all make a difference.

---

## Final Note

> *"Build features that scale across templates, relationships, and future versions — not just your own use case."*

Thank you for helping make Birthday Bloom better for everyone.

— Naboraj Sarkar  
Maintainer
