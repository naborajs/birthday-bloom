---
tags: [github, automation, ci, workflows, infrastructure]
aliases: [GitHub Automation, CI/CD, Actions]
---

# GitHub Automation Architecture
[[DOCUMENTATION_INDEX|Back to Home]]

Birthday Bloom features a robust GitHub automation setup, largely managed within the `.github/workflows` and `.github/ISSUE_TEMPLATE` directories.

## Core Workflows
1. **[[ci.yml|Continuous Integration]]**
   - Triggers on push to `main` and pull requests.
   - Runs `npm run lint` and `npx tsc --noEmit` to ensure strict typing.
   - Executes Vitest tests.
   - Builds the Vite application.
   - **Tools Used**: GitHub Actions, ESLint, TypeScript, Vitest, Vite.

2. **[[repo-health.yml|Repository Health]]**
   - Automatically checks for stale issues and PRs.

3. **[[triage-issues.yml|Issue Triage]] & [[triage-prs.yml|PR Triage]]**
   - Connects to labels defined in `labeler.yml` and automatically routes issues/PRs to appropriate project boards based on paths modified or tags selected.

## Issue Templates
We use structured YAML issue templates to standardize bug reports and feature requests:
- `bug_report.yml`
- `feature_request.yml`
- `customization_issue.yml`
- `deployment_issue.yml`

## Interconnections
- The automation directly supports the codebase described in [[Website-Architecture]].
- Strict PR policies are enforced as documented in [[PULL_REQUEST_POLICY]].
- Dependency updates are fully automated via Dependabot (`dependabot.yml`).

---
#obsidian #documentation #birthday-bloom #vault #github
