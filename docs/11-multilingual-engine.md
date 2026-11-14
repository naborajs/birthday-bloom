# Multilingual Localization Engine

> **Canonical Web Route**: [`/docs/multilingual-engine`](https://naborajs.me/projects/birthday-bloom/docs/multilingual-engine)  
> **Repository**: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom) | **Version**: v3.5.1

## Overview
Culturally authentic emotional narratives in English, Bengali, Hindi, and European French.

## Architecture & Integration
This module operates under Birthday Bloom's **v3.5 Directed Acyclic Graph (DAG)** architecture:
- Centralized domain normalizers ensure zero logic duplication across builds and query strings.
- Leaf utility modules (`languageUtils.ts`, `relationshipUtils.ts`, `dateUtils.ts`) eliminate circular dependency hazards.
- 100% automated test coverage across 470 test assertions in 24 test suites.

## Implementation Details
For complete details and source code references, see the corresponding obsidian notes in `obsidian-docs/` and interactive web demonstrations at [birthday-bloom.vercel.app](https://birthday-bloom.vercel.app).
