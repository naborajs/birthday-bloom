---
tags: [templates, state, store, features, architecture]
aliases: [Template System, State Logic, Store]
---

# Template System Deep Dive

[[DOCUMENTATION_INDEX|Back to Home]]

Birthday Bloom features an extensible, multi-tiered **Family & Relationship Template Engine**. It automatically customizes letter tones, emotional storytelling, quiz questions, animation pacing, and fallback assets based on the recipient's relationship to the sender.

---

## 🏛 1. End-to-End Architecture

The template system is composed of three interconnected layers:

```
                  ┌──────────────────────────────┐
                  │       Environment / Env      │
                  │ (VITE_FAMILY_MEMBER_TYPE,    │
                  │  VITE_BIRTHDAY_RELATIONSHIP) │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │    familyTemplates.ts        │
                  │  createFamilyMemberProfile() │
                  │  (Defines 15 schema sections)│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │     useBirthdayStore.ts      │
                  │ Hydrates profile & resolves  │
                  │ mood, pacing & color tokens  │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │  SuperPersonalizedLogic.ts   │
                  │ Generates letters, memories, │
                  │ big wishes & quiz questions  │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │      React UI Scenes         │
                  │ (CinematicIntro, CakeCutting,│
                  │  HeartTree, PhotoGallery)    │
                  └──────────────────────────────┘
```

---

## ⚙️ 2. How Relationship & Family Templates Drive UI & Tone

When a relationship is configured (via `VITE_BIRTHDAY_RELATIONSHIP` or `VITE_FAMILY_MEMBER_TYPE`):

1. **Emotional Mood & Story Pacing (`useBirthdayStore.ts`)**:
   - `partner`: Mood is `'romantic'`, animation pacing is `'slow'` (graceful, intimate spring curves).
   - `friend` / `sibling`: Mood is `'energetic'`, animation pacing is `'fast'` (snappy, celebratory particle bursts).
   - `family` (parents, grandparents, etc.): Mood is `'warm'`, animation pacing is `'moderate'`.

2. **Letter & Storyline Generation (`SuperPersonalizedLogic.ts`)**:
   - Generates relationship-specific opening hooks, gratitude statements, shared memory reflections, and custom sign-offs.
   - Tailors adjectives and expressions (e.g. nostalgic for grandparents, supportive for siblings, deeply affectionate for partners).

3. **Emoji Kits & Visual Confetti (`emojiKits.ts`)**:
   - Maps relationship types to themed emoji particle bursts (hearts for partners, stars/gaming for friends, flowers/sparkles for family).

4. **Dynamic Section Fallbacks**:
   - If `VITE_PHOTOS` or `VITE_PHOTO_1..6` are omitted, relationship-curated Unsplash collections are loaded to ensure the page never renders blank.

---

## 📋 3. Supported Relationship Types (18 Archetypes)

| Member Type | Category | Direction | Default Closeness | Supported Aliases / URL Params |
| :--- | :--- | :--- | :---: | :--- |
| `partner` | `chosen` | `chosen` | 10 | `partner`, `love`, `spouse`, `wife`, `husband`, `boyfriend`, `girlfriend` |
| `friend` | `friend` | `chosen` | 8 | `friend`, `bestie`, `buddy`, `pal`, `bff` |
| `family` | `family` | `family` | 8 | `family`, `relative`, `kin` |
| `brother` | `sibling` | `sibling` | 8 | `brother`, `bro`, `bhai` |
| `sister` | `sibling` | `sibling` | 8 | `sister`, `sis`, `didi`, `bon` |
| `father` | `parent` | `ancestor` | 9 | `father`, `dad`, `papa`, `baba` |
| `mother` | `parent` | `ancestor` | 9 | `mother`, `mom`, `mama`, `maa` |
| `grandfather` | `grandparent` | `ancestor` | 9 | `grandfather`, `grandpa`, `dadu`, `thakurda` |
| `grandmother` | `grandparent` | `ancestor` | 9 | `grandmother`, `grandma`, `dida`, `thakuma` |
| `uncle` | `relative` | `extended` | 7 | `uncle`, `kaka`, `mama`, `chacha` |
| `aunt` | `relative` | `extended` | 7 | `aunt`, `kaki`, `mami`, `chachi`, `masi` |
| `cousin` | `relative` | `extended` | 7 | `cousin` |
| `son` | `child` | `descendant` | 10 | `son`, `chele`, `beta` |
| `daughter` | `child` | `descendant` | 10 | `daughter`, `meye`, `beti` |
| `guardian` | `guardian` | `ancestor` | 8 | `guardian`, `protector` |
| `colleague` | `colleague` | `chosen` | 7 | `colleague`, `coworker`, `teammate` |
| `mentor` | `guardian` | `ancestor` | 8 | `mentor`, `teacher`, `guide`, `coach` |
| `custom` | `custom` | `custom` | 7 | Any arbitrary relationship string |

---

## 4. URL Parameter Resolution Hierarchy

When a user visits via a share URL (e.g. `?name=Sam&rel=mentor&lang=fr`), the template engine resolves properties with strict precedence:

$$\text{URL Query Parameters} \succ \text{Environment Variables (.env.local)} \succ \text{Built-in Archetype Defaults}$$

This guarantees zero-code customization without needing code rebuilds or redeployment.

---

## 🛠 4. Step-by-Step Guide: Adding a New Relationship Template

To add a new template type (e.g. `mentor`):

### Step 1: Update `familyTemplates.ts`
1. Add `'mentor'` to `FamilyMemberType` union type:
   ```typescript
   export type FamilyMemberType = ... | 'mentor';
   ```
2. Add default relationship metadata mapping in `createDefaultRelationshipMetadata()`:
   ```typescript
   case 'mentor':
       return {
           memberType: 'mentor',
           category: 'guardian',
           relationshipLabel: 'Mentor & Guide',
           direction: 'ancestor',
           closenessLevel: 8,
           isBloodRelation: false,
           isChosenFamily: true,
       };
   ```

### Step 2: Update Store Mapping in `useBirthdayStore.ts`
1. Add `'mentor'` to `validFamilyTypes` array.
2. Update the `rawRel` parser in `useBirthdayStore.ts` to map keywords (e.g. `teacher`, `coach`, `mentor`):
   ```typescript
   rawRel.includes('mentor') || rawRel.includes('teacher') ? 'mentor' : ...
   ```

### Step 3: Add Narrative Logic in `SuperPersonalizedLogic.ts`
Add tailored letter generators and wish templates in `getHighlySpecificLetter()`:
```typescript
case 'mentor':
    return {
        title: "To An Inspiring Mentor 🌟",
        body: "Thank you for your guidance, wisdom, and encouragement...",
        signoff: "With gratitude and respect,"
    };
```

### Step 4: Update Documentation & `.env.example`
1. Add `mentor` to the list of supported values in `.env.example`.
2. Update `obsidian-docs/ENV_GUIDE.md` and `README.md`.

---
#obsidian #documentation #birthday-bloom #vault #templates
