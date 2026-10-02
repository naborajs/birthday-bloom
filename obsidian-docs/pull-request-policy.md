---
tags: [github, pr, pull-request, policy, quality-gates, review]
aliases: [pull-request-policy, pr-policy]
---

# Pull Request Policy & Quality Gates

[[DOCUMENTATION_INDEX|Back to Index]] | [[contributing|Contributor Guide]] | [[GitHub-Automation|GitHub Automation]] | [[test-infrastructure|Test Infrastructure]]

🌐 **Canonical Web Documentation**: [Pull Request Policy & Quality Gates](https://naborajs.me/projects/birthday-bloom/docs/pull-request-policy)

---

## 🚦 Automated Quality Gates

Every pull request submitted to Birthday Bloom must pass automated continuous integration quality checks before being eligible for maintainer review or merging:

1. **TypeScript Type Safety**: Zero compilation errors under strict mode (`tsc --noEmit`).
2. **ESLint Static Analysis**: Zero lint errors and zero warnings across all `.ts` and `.tsx` source files.
3. **Automated Vitest Suite**: 100% pass rate across all unit and integration test suites (400+ tests).
4. **Production Build Gate**: Clean production asset compilation with Vite (`vite build`) without bundling warnings.
5. **No Direct Commits to `main`**: All changes must arrive via branch pull requests.

Run the entire verification suite locally before opening your PR:
```bash
npm run verify
```

---

## 🤖 Automated PR Triage & Labeling

Birthday Bloom utilizes automated GitHub Actions scripts to classify PRs upon creation:
- **Complexity Assessment**: Tags PRs with `pr-level:trivial`, `pr-level:beginner`, `pr-level:intermediate`, `pr-level:advanced`, or `pr-level:major`. PRs exceeding 800 lines are flagged for modular splitting.
- **Scope Detection**: Automatically assigns `area:frontend`, `area:core`, `customization`, `documentation`, or `ci-cd`.
- **Status Tracking**: Updates `status:needs-review`, `status:changes-requested`, `status:approved`, and `status:ready-to-merge`.

---

## ⏱️ Review Turnaround SLAs

- **Issue Triage**: New issues are triaged and labeled within **24–48 hours**.
- **Pull Request Review**: First maintainer review feedback is provided within **3 business days**.
- **Security Inquiries**: Security notifications sent to `nishant.ns.business@gmail.com` receive acknowledgment within **48 hours**.

---

## 🔍 Scope Boundaries

### What is Present:
- Automated CI Standards and quality gate thresholds required for PR merging.
- Review turnaround SLAs for community PRs and issue triage.
- PR automation rules, complexity metrics, and labeling taxonomy.

### What is NOT Present:
- Narrative letter micro-copy templates (see [[Template-System-Deep-Dive#Complete-Message-Transcripts|Template Deep Dive]]).
- Web Audio gain graph node architecture (see [[Celebration-Sound-and-Sensory-Design#Web-Audio-API-Graph-Architecture|Sound & Sensory Design]]).
