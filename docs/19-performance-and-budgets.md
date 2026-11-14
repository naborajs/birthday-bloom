# Performance Optimization & Budgets

> **Canonical Web Route**: [`/docs/performance-and-budgets`](https://naborajs.me/projects/birthday-bloom/docs/performance-and-budgets)  
> **Repository**: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom) | **Version**: v3.5.1

## Overview
Strict chunk isolation, lazy-loaded Three.js bundles, and 15 kB HTML size limits.

## Architecture & Integration
This module operates under Birthday Bloom's **v3.5 Directed Acyclic Graph (DAG)** architecture:
- Centralized domain normalizers ensure zero logic duplication across builds and query strings.
- Leaf utility modules (`languageUtils.ts`, `relationshipUtils.ts`, `dateUtils.ts`) eliminate circular dependency hazards.
- 100% automated test coverage across 470 test assertions in 24 test suites.

## Implementation Details
For complete details and source code references, see the corresponding obsidian notes in `obsidian-docs/` and interactive web demonstrations at [birthday-bloom.vercel.app](https://birthday-bloom.vercel.app).
