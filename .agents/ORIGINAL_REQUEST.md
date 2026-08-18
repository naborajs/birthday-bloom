# Original User Request

## 2026-08-18T09:25:22Z

# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval.
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: [none — teamwork routes from the description]

Perform a complete top-to-bottom audit and update of the existing codebase in `d:\Projects\Website\birthday-bloom` to clean up dead code, fix vulnerabilities and bugs, resolve build issues, update docs, and modernize dependencies. 

Working directory: d:\Projects\Website\birthday-bloom
Integrity mode: development

## Requirements

### R1. Systematic File-by-File Audit
Check every file for dead code, security vulnerabilities, logic errors, build/deployment issues, and documentation discrepancies. Do not change functionality unless fixing a bug or vulnerability. 

### R2. Immediate Commits
After modifying any file, immediately commit and push the change with a clear, specific message describing what changed and why, before moving to the next file. Do not batch multiple unrelated changes into one commit.

### R3. Dependency Modernization
Update packages and runtime versions, ensuring existing tests/lint/build steps pass after each update.

### R4. Cross-file Consistency Pass
Perform a second pass to ensure version numbers and configurations match across all files (package.json, config files, workflows, docs).

### R5. Final Summary Report
Produce a summary report detailing every change made, file by file, and the reasoning behind each fix.

## Verification Resources
- Use the existing build scripts (`npm run build`, `npm run lint`, `npm run test` or equivalents found in `package.json`).

## Acceptance Criteria

### Reliability & Correctness
- [ ] The application builds successfully without errors.
- [ ] Existing test suites and linters pass cleanly after modifications.

### Code Hygiene
- [ ] No unused functions, variables, or unreachable code remains in the audited files.
- [ ] All security vulnerabilities identified via standard audits (`npm audit`) are addressed.

### Workflow
- [ ] Every individual file change has its own specific Git commit.
- [ ] A final summary report is produced documenting all changes and rationale.
