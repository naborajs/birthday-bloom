---
tags: [templates, architecture, models]
aliases: [template-architecture]
---

# Template Architecture

Birthday Bloom templates are data-first. Env values hydrate the app store, the store drives components, and family templates provide typed relationship profiles.

Repo: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom)

## Data Flow

```text
.env.local / Host Variables (Static Defaults)
  └─► import.meta.env
        │
window.location.search (URL Query Parameters)
  └─► parseBirthdayUrlParams()
        │
        ▼ (URL overrides Env)
useBirthdayStore (Zustand 5)
  ├─► useDynamicTheme (Injects HSL/RGB CSS Variables)
  ├─► useDynamicSEO (Injects OpenGraph, Meta, and JSON-LD SocialEvent)
  ├─► useTranslation (Multi-language localization: EN, BN, HI, FR)
  └─► Birthday Components (30 interactive celebration scenes)
```

## Key Files

| File | Why It Exists |
| :--- | :--- |
| `src/features/core/store/useBirthdayStore.ts` | Central Zustand 5 store parsing 53 env values, aliases, and runtime state. |
| `src/features/core/store/urlParams.ts` | Universal URL query parameter parser (`?name=...&rel=...&lang=...`). |
| `src/features/core/seo/useDynamicSEO.ts` | Reactive Schema.org `SocialEvent`, OpenGraph, and title generator. |
| `src/features/core/models/familyTemplates.ts` | Defines 18 reusable member archetypes, registry, and factory functions. |
| `src/config/wishTemplates.ts` | 100+ categorized wishes and handwriting cards across all 18 relationships. |
| `src/config/birthday.ts` | Keeps audio assets configuration and static photo fallbacks. |
| `src/config/templates.ts` | Cultural emotional letters, quotes, and tone presets. |
| `src/components/birthday/*` | Renders the 30 active cinematic sections using store configuration. |

## Inheritance Model

Every family profile uses:

```ts
BaseFamilyMemberProfile & { specialized: RelationshipSpecificFields }
```

This means shared sections are stable and only relationship-specific details vary.

Examples:

- `BrotherProfile` extends `BaseFamilyMemberProfile` with `SiblingFields`.
- `FatherProfile` extends `BaseFamilyMemberProfile` with `ParentFields`.
- `CustomMemberProfile` extends `BaseFamilyMemberProfile` with `CustomMemberFields`.

## Overrides

Use `createFamilyMemberProfile(type, name, dob, options)` to override:

- `preferredName`
- `nicknames`
- `gender`
- `ageGroup`
- `relationshipOverrides`
- `dynamicFields`
- `privacy`
- `specialized`

## Versioning

`FAMILY_TEMPLATE_VERSION` marks the persisted family schema version. Bump it when a saved profile would need migration.

Backward-compatible exports are preserved:

- `createDefaultBrotherProfile()`
- `createDefaultSisterProfile()`

New specialized factories are also available for parents, grandparents, relatives, children, guardians, and friends.

---

## See Also

- [[family-system|docs/family-system.md]] — Family template reference
- [[ENV_GUIDE|docs/ENV_GUIDE.md]] — Env configuration for templates
- [[developer-guide|docs/developer-guide.md]] — Developer extension patterns
- [[./ARCHITECTURE|ARCHITECTURE.md]] — System architecture overview
- [[./QUICK_START|QUICK_START.md]] — Getting started


#obsidian #documentation #birthday-bloom #vault