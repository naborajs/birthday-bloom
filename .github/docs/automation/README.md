# Birthday Bloom Automation Ecosystem

This repository uses a comprehensive, highly configurable automation ecosystem to improve the contributor experience, maintain repository health, and enforce quality without unnecessary bot spam.

## 1. Central Configuration (`.github/automation.config.json`)
All workflows rely on this central JSON file. This eliminates hardcoded values and makes customization simple.

- **Exemptions**: Specifies bots and roles (e.g. `admin`, `maintain`) that bypass limits and strict checks.
- **Limits**: Configures the maximum number of open issues/PRs a user can hold.
- **Protections**: Defines restricted labels and forbidden paths (`.env`, `node_modules`).
- **Timings**: Sets the thresholds for stale issues/PRs and reviewer reminders.
- **Metrics**: Configuration for milestone celebrations (e.g. merging 5th PR).

## 2. Workflows

### `triage-issues.yml`
- **Purpose**: Auto-assigns issue openers, posts a smart onboarding message with time expectations based on difficulty, and checks the 3-issue limit.
- **Triggers**: `issues` (`opened`)
- **Permissions**: `issues: write`
- **Behavior**: If a user is over the issue limit, the bot applies a warning label and leaves a friendly message. It does NOT auto-close the issue, giving the maintainer time to review.

### `triage-prs.yml`
- **Purpose**: The main PR handler. Labels PRs based on size, type, and area. Performs strict file bounds checking and limit checking. Generates a clean PR Dashboard.
- **Triggers**: `pull_request_target` (`opened`, `synchronize`, `reopened`)
- **Permissions**: `pull-requests: write`, `checks: write`
- **Security**: Runs on `pull_request_target` so it operates within the `main` branch context. It never checks out the PR author's untrusted code.
- **Behavior**: Instead of spamming the PR conversation with warnings, strict checks (like forbidden files or spam limits) are outputted as **GitHub Check Runs**. The only comment generated is a single, updating Dashboard comment containing metadata (complexity, area, review turnaround).

### `repo-health.yml`
- **Purpose**: Ensures the repository stays active and clean.
- **Triggers**: `schedule` (daily) and `pull_request` (`closed`)
- **Permissions**: `issues: write`, `pull-requests: write`
- **Behavior**: Sweeps for stale issues and draft PRs, sends reminders to reviewers for inactive PRs, and posts celebration comments when contributors hit merge milestones.

### `sync-labels.yml`
- **Purpose**: Ensures repository labels match the central config.
- **Triggers**: `push` (to config file) and `workflow_dispatch`
- **Permissions**: `issues: write`

## 3. How to Disable/Customize
To disable specific behaviors (like milestone celebrations), simply toggle the boolean in `.github/automation.config.json`. To modify limits, update the integer values. No code changes are required.

## 4. Maintenance Notes
If the repository grows to thousands of open issues, the `repo-health.yml` stale sweep may encounter GitHub API rate limits. In that event, the script should be modified to use the GitHub GraphQL API or Search API (`is:open updated:<DATE`) to only fetch issues that are already mathematically stale.
