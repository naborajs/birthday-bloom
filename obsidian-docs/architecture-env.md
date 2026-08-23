---
tags: [architecture, env, configuration, store, zustand, i18n, localization]
aliases: [Env Architecture, Store Flow, Configuration Lifecycle]
---

# Environment & Configuration Architecture

[[DOCUMENTATION_INDEX|Back to Home]] | [[ENV_GUIDE|Env Customization Guide]] | [[setup-bengali|Bengali Localization]] | [[setup-hindi|Hindi Localization]] | [[Template-System-Deep-Dive|Template System]]

Birthday Bloom is built around an **Environment-First Reactive Architecture**. The entire application — including theme colors, relationship tones, interactive scenes, and multi-language localization (English, Hindi, Bengali) — can be completely personalized without touching React components or JSX.

---

## 🏗 1. The Configuration Lifecycle

```
                       ┌───────────────────────────────┐
                       │     .env.local / Host Env     │
                       │  (Vercel, Netlify, Amplify)   │
                       └───────────────┬───────────────┘
                                       │ (Vite build / HMR)
                                       ▼
                       ┌───────────────────────────────┐
                       │       import.meta.env         │
                       │      (Browser-exposed)        │
                       └───────┬───────────────┬───────┘
                               │               │
            ┌──────────────────┘               └──────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────────┐
│     src/config/birthday.ts    │             │ src/features/core/store/          │
│ - PHOTO_ASSETS (photo1..3)    │             │   useBirthdayStore.ts             │
│ - AUDIO_ASSETS (bgmUrl, sfx)  │             │ - Type coercion & alias fallback  │
└───────────────┬───────────────┘             │ - Language normalization (en/hi/bn│
                │                             │ - Family template profile merge   │
                │                             │ - Mood & pacing resolution        │
                │                             └─────────────────┬─────────────────┘
                │                                               │
                │         ┌─────────────────────────────────────┤
                ▼         ▼                                     ▼
     ┌───────────────────────────────┐             ┌───────────────────────────────┐
     │  src/features/core/theme/     │             │     src/i18n/ Translation     │
     │      useDynamicTheme.ts       │             │   - getTranslation(lang)      │
     │ - Generates HSL/RGB palettes  │             │   - getTranslationValue()     │
     │ - Injects tokens into :root   │             │   - English fallback lookup   │
     └───────────────┬───────────────┘             └────────────┬──────────────────┘
                     │                                          │
                     └────────────────────┬─────────────────────┘
                                          ▼
                             ┌───────────────────────────────┐
                             │       React Scenes & UI       │
                             │ - SplashScreen / Intro        │
                             │ - CakeCutting (3D & physics)  │
                             │ - PhotoGallery & VideoGallery │
                             │ - HeartTree finale            │
                             └───────────────────────────────┘
```

---

## 🧩 2. Parsing & Fallback Layers

All environment variables pass through specialized sanitization and parser utilities in `useBirthdayStore.ts`:

1. **`parseEnvString(...values: unknown[]): string`**
   - Evaluates arguments in priority order.
   - Filters out `undefined`, `null`, `"undefined"`, `"null"`, and empty whitespace.
   - Returns the first valid trimmed string or `""`.

2. **`parseEnvBoolean(value: unknown, fallback: boolean): boolean`**
   - Normalizes truthy strings: `['true', '1', 'yes', 'on', 'enabled']` → `true`.
   - Normalizes falsy strings: `['false', '0', 'no', 'off', 'disabled']` → `false`.
   - Falls back safely to `fallback` boolean.

3. **`parseEnvNumber(value: unknown, fallback: number | null): number | null`**
   - Parses integer radix 10 and validates `Number.isFinite`.
   - Falls back safely to `fallback` number.

4. **`parseEnvList(...values: unknown[]): string[]`**
   - Supports both JSON arrays (e.g. `["photo1.jpg", "photo2.jpg"]`) and delimiter-separated strings (comma `,`, newline `\n`, or pipe `|`).

5. **`parseEnvJson<T>(value: unknown): T | null`**
   - Safely parses complex JSON profiles (e.g. `VITE_FAMILY_PROFILE_JSON`) with `try/catch` error shielding.

---

## 🌐 3. Multi-Language (i18n) Normalization & Fallback Flow

Localization is resolved in `src/i18n/index.ts` and `src/features/core/store/useBirthdayStore.ts`:

### A. Alias Normalization
The raw environment string (`VITE_LANGUAGE` or `VITE_LANG`) is lowercased and trimmed:
- `"bn"`, `"bengali"`, `"bangla"` $\rightarrow$ `'bn'` (Bengali)
- `"hi"`, `"hindi"`, `"in"` $\rightarrow$ `'hi'` (Hindi)
- All other values (or unset) $\rightarrow$ `'en'` (English default)

### B. Recursive Dictionary Lookup with Fallback
When a component calls `t('path.to.key', params)`:
1. The engine checks the active language dictionary (`bnTranslations`, `hiTranslations`, or `enTranslations`).
2. If the key exists, it retrieves the string and performs regex-based placeholder interpolation (`{{name}}` $\rightarrow$ value).
3. If the key is missing in Hindi or Bengali, the engine **transparently falls back to `enTranslations`** at runtime, ensuring the UI never displays broken blanks or throws exceptions.
4. If missing in all dictionaries, the literal `keyPath` is returned safely.

---

## 🛠 4. Contributor Guide: Adding a New Environment Variable

Follow this 5-step checklist whenever introducing a new configurable option:

### Step 1: Update `.env.example`
Add the key with type comments and sensible default values:
```env
# Interactive particle burst count on click (default: 25)
VITE_PARTICLE_COUNT=25
```

### Step 2: Update `BirthdayConfig` Interface
In `src/features/core/store/useBirthdayStore.ts`:
```typescript
export interface BirthdayConfig {
    // ...
    particleCount?: number;
}
```

### Step 3: Parse and Assign in Store
In `src/features/core/store/useBirthdayStore.ts`:
```typescript
const envParticleCount = parseEnvNumber(import.meta.env.VITE_PARTICLE_COUNT, 25) ?? 25;

export const useBirthdayStore = create<BirthdayStore>((set, get) => ({
    config: {
        // ...
        particleCount: envParticleCount,
    },
    // ...
}));
```

### Step 4: Consume in Component
In your target React component:
```tsx
const particleCount = useBirthdayStore(state => state.config.particleCount ?? 25);
```

### Step 5: Add Unit Tests & Documentation
1. Add test assertions in `src/test/example.test.ts`.
2. Update the reference table in `obsidian-docs/ENV_GUIDE.md` and `README.md`.

---

## 🧬 5. Family & Relationship System Integration

For relationship-driven customization:
- `VITE_FAMILY_MEMBER_TYPE` hydrates a full `FamilyMemberProfile` from `src/features/core/models/familyTemplates.ts`.
- `SuperPersonalizedLogic.ts` reads the profile to dynamically produce personalized storytelling, memories, and quiz questions in English, Hindi, and Bengali.
- For instructions on creating new relationship types, see [[Template-System-Deep-Dive]].

---
#obsidian #documentation #birthday-bloom #vault #architecture #env #i18n
