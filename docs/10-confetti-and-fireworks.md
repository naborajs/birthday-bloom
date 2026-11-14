# Canvas 2D Fireworks & Particle Physics

> **Canonical Web Route**: [`/docs/confetti-and-fireworks`](https://naborajs.me/projects/birthday-bloom/docs/confetti-and-fireworks)  
> **Repository**: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom) | **Version**: v3.5.1

## Overview
Device-tier particle budgeting, retina DPR clamping, and 60fps animation loops.

## Architecture & Integration
This module operates under Birthday Bloom's **v3.5 Directed Acyclic Graph (DAG)** architecture:
- Centralized domain normalizers ensure zero logic duplication across builds and query strings.
- Leaf utility modules (`languageUtils.ts`, `relationshipUtils.ts`, `dateUtils.ts`) eliminate circular dependency hazards.
- 100% automated test coverage across 470 test assertions in 24 test suites.

## Implementation Details
For complete details and source code references, see the corresponding obsidian notes in `obsidian-docs/` and interactive web demonstrations at [birthday-bloom.vercel.app](https://birthday-bloom.vercel.app).
