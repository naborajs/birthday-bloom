# Template Architecture

Birthday Bloom templates are data-first. Env values hydrate the app store, the store drives components, and family templates provide typed relationship profiles.

Repo: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom)

## Data Flow

```text
.env.local
  -> import.meta.env
  -> useBirthdayStore
  -> dynamic theme and birthday components
  -> optional FamilyMemberProfile schema
```

## Key Files

| File | Why It Exists |
| --- | --- |
| `src/features/core/store/useBirthdayStore.ts` | Parses env values and exposes runtime config. |
| `src/features/core/models/familyTemplates.ts` | Defines reusable family member templates and factories. |
| `src/features/core/models/dataModels.ts` | Defines enhanced app config, validation, and family collection types. |
| `src/config/birthday.ts` | Keeps backward-compatible photo/audio env fallbacks. |
| `src/config.example.ts` | Shows typed examples for config, family profiles, custom templates, and validation. |
| `src/components/birthday/*` | Renders the cinematic sections using store config. |

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

- [docs/family-system.md](./family-system.md) — Family template reference
- [docs/ENV_GUIDE.md](./ENV_GUIDE.md) — Env configuration for templates
- [docs/developer-guide.md](./developer-guide.md) — Developer extension patterns
- [ARCHITECTURE.md](../ARCHITECTURE.md) — System architecture overview
- [QUICK_START.md](../QUICK_START.md) — Getting started
