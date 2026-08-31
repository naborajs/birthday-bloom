---
tags: [family, templates, profiles]
aliases: [family-system]
---

# Family System

Birthday Bloom v3.0 uses a scalable family template system in `src/features/core/models/familyTemplates.ts`.

## Why This File Exists

`familyTemplates.ts` is the single source of truth for family profile schemas. It avoids duplicated Brother/Sister-style objects by defining one shared base profile and relationship-specific extensions.

Use it when you need to:

- Create Brother, Sister, Father, Mother, Grandfather, Grandmother, Uncle, Aunt, Cousin, Son, Daughter, Guardian, Friend, or Custom profiles.
- Add unlimited additional member templates through custom fields.
- Validate family profile data before import, export, rendering, or storage.
- Migrate old loose family member objects into the v3 shape.

## Architecture

All member profiles inherit from `BaseFamilyMemberProfile`.

Shared fields include:

- `schemaVersion`
- `id`
- `memberType`
- `basicInfo`
- `relationship`
- `identity`
- `personality`
- `interests`
- `bond`
- `personalNotes`
- `timeline`
- `media`
- `dynamicFields`
- `privacy`
- `metadata`

Specialized fields live in the `specialized` property. This keeps the base stable while allowing each relationship to add meaning.

## Supported Templates (18 Archetypes)

| Type | Category | Direction | Specialized Extension |
| :--- | :--- | :--- | :--- |
| `partner` | chosen | chosen | `PartnerFields` (Love language, anniversary, shared pet names) |
| `brother` | sibling | sibling | `SiblingFields` (Childhood memories, nickname, rivalry jokes) |
| `sister` | sibling | sibling | `SiblingFields` (Childhood memories, secrets, heart-to-hearts) |
| `father` | parent | ancestor | `ParentFields` (Wisdom quotes, dad jokes, life lessons) |
| `mother` | parent | ancestor | `ParentFields` (Unconditional warmth, recipes, comfort advice) |
| `grandfather` | grandparent | ancestor | `GrandparentFields` (Legacy stories, generational blessings) |
| `grandmother` | grandparent | ancestor | `GrandparentFields` (Lullabies, heirlooms, gentle warmth) |
| `uncle` | relative | extended | `RelativeFields` (Fun adventures, family gatherings) |
| `aunt` | relative | extended | `RelativeFields` (Caring advice, festive treats) |
| `cousin` | relative | extended | `RelativeFields` (Partner-in-crime adventures) |
| `son` | child | descendant | `ChildFields` (Pride milestones, future dreams) |
| `daughter` | child | descendant | `ChildFields` (Pride milestones, treasured moments) |
| `guardian` | guardian | ancestor | `GuardianFields` (Mentorship, guidance, protection) |
| `colleague` | colleague | chosen | `ColleagueFields` (Team collaboration, project triumphs) |
| `mentor` | guardian | ancestor | `MentorFields` (Career inspiration, guiding wisdom) |
| `friend` | friend | chosen | `FriendFields` (Inside jokes, late-night talks, epic trips) |
| `family` | family | family | `FamilyFields` (Shared heritage, holiday traditions) |
| `custom` | custom | custom | `CustomMemberFields` (Arbitrary user-defined key-values) |

## Creating Profiles

```ts
import {
  createDefaultBrotherProfile,
  createFamilyMemberProfile,
} from '@/features/core/models/familyTemplates';

const brother = createDefaultBrotherProfile('Raj', new Date('1998-03-15'));

const guardian = createFamilyMemberProfile('guardian', 'Mrs. Sen', undefined, {
  privacy: { defaultLevel: 'private' },
  specialized: {
    supportResponsibilities: ['Education guidance', 'Life advice'],
  },
});
```

## Custom Member Templates

Use `createCustomFamilyMemberTemplate()` for relationships not built into the registry.

```ts
import { createCustomFamilyMemberTemplate } from '@/features/core/models/familyTemplates';

const coachTemplate = createCustomFamilyMemberTemplate('Coach', [
  { id: 'lesson-learned', label: 'Lesson learned', type: 'textarea' },
]);
```

Custom templates do not mutate `FAMILY_TEMPLATE_REGISTRY`. This makes them safe for previews, imports, and per-project extensions.

## Relationships

Relationship metadata explains how a member connects to the celebration recipient.

Important fields:

- `memberType`: the concrete template type.
- `category`: sibling, parent, grandparent, relative, child, guardian, friend, or custom.
- `relationshipLabel`: human-readable label.
- `direction`: ancestor, descendant, sibling, extended, chosen, or custom.
- `closenessLevel`: integer from 1 to 10.
- `familySide`: maternal, paternal, both, chosen, or unknown.
- `isBloodRelation` and `isChosenFamily`: useful for rendering and privacy decisions.

## Timeline And Media

`timeline` stores important moments as `FamilyTimelineEntry[]`.

`media` stores images, videos, audio, and documents as `FamilyMediaItem[]`. Media items can be connected to timeline entries through `mediaIds`.

Best practice:

- Keep media URLs external or in `public/assets` when bundling with the app.
- Always include `altText` for images used in the UI.
- Use `privacy` on sensitive media and timeline items.

## Privacy Controls

Each profile includes:

- `defaultLevel`: public, family, or private.
- `hiddenFields`: field IDs to suppress from rendering/export.
- `privateNoteIds`: note IDs excluded from public output.
- `privateMediaIds`: media IDs excluded from public output.
- `allowExport`: whether the profile can be exported.

The current app keeps profiles client-side, so privacy controls are schema-level controls for future rendering, import/export, and storage integrations.

## Validation Rules

Use `validateFamilyMemberProfile(profile)` before accepting imported or edited data.

Current validation checks:

- `id` is present.
- `schemaVersion` is present.
- `memberType` exists in the registry.
- `basicInfo.fullName` is non-empty.
- `basicInfo.dateOfBirth` is valid when supplied.
- `relationship.closenessLevel` is between 1 and 10.

## Migration

Use `migrateLegacyFamilyMember()` for old family records shaped like:

```ts
{
  id?: string;
  type?: string;
  name?: string;
  dateOfBirth?: Date;
  profileData?: Record<string, unknown>;
}
```

Known legacy Brother/Sister members migrate to their dedicated types. Unknown legacy types migrate to `custom` with the old `profileData` preserved in `specialized.customSections`.

## Best Practices

- Add new relationship types through the registry instead of creating isolated interfaces.
- Put universal fields in `BaseFamilyMemberProfile`.
- Put relationship-only fields in a specialized interface.
- Keep custom data in `dynamicFields` or `specialized.customSections`.
- Bump `FAMILY_TEMPLATE_VERSION` when the persisted shape changes.
- Preserve factory function names when possible for backward compatibility.

## Performance Notes

The registry is static and lightweight. Profile creation is synchronous and suitable for forms, import flows, tests, and client-side configuration. Large media files should remain URL-based instead of being embedded directly in profile objects.

---

## See Also

- [[ENV_GUIDE|docs/ENV_GUIDE.md]] — Family template env variables
- [[template-architecture|docs/template-architecture.md]] — Template inheritance model
- [[developer-guide|docs/developer-guide.md]] — Adding new family templates
- [[./QUICK_START|QUICK_START.md]] — Getting started


#obsidian #documentation #birthday-bloom #vault