---
tags: [architecture, env, configuration, store, zustand]
aliases: [Env Architecture, Store Flow, Configuration Lifecycle]
---

# Environment & Configuration Architecture

[[DOCUMENTATION_INDEX|Back to Home]] | [[ENV_GUIDE|Env Customization Guide]] | [[setup-hindi|Hindi Localization]] | [[Template-System-Deep-Dive|Template System]]

Birthday Bloom is built around an **Environment-First Reactive Architecture**. The application can be completely personalized without touching React components or JSX.

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
└───────────────┬───────────────┘             │ - Family template profile merge   │
                │                             │ - Mood & pacing resolution        │
                │                             └─────────────────┬─────────────────┘
                │                                               │
                │         ┌─────────────────────────────────────┤
                ▼         ▼                                     ▼
     ┌───────────────────────────────┐             ┌───────────────────────────────┐
     │  src/features/core/theme/     │             │        React Scenes & UI      │
     │      useDynamicTheme.ts       │             │ - SplashScreen / Intro        │
     │ - Generates HSL/RGB palettes  │             │ - CakeCutting (3D & physics)  │
     │ - Injects tokens into :root   │             │ - PhotoGallery & VideoGallery │
     └───────────────────────────────┘             │ - HeartTree finale            │
                                                   └───────────────────────────────┘
```

---

## 🧩 2. Parsing & Fallback Layers

All environment variables pass through specialized sanitization and parser utilities in `useBirthdayStore.ts`:

1. **`parseEnvString(...values: unknown[]): string`**
   - Evaluates arguments in priority order.
   - Filters out `undefined`, `null`, `"undefined"`, `"null"`, and empty whitespace.
   - Returns the first valid string or `""`.

2. **`parseEnvBoolean(value: unknown, fallback: boolean): boolean`**
   - Normalizes truthy strings: `['true', '1', 'yes', 'on', 'enabled']` → `true`.
   - Normalizes falsy strings: `['false', '0', 'no', 'off', 'disabled']` → `false`.
   - Falls back safely to default.

3. **`parseEnvNumber(value: unknown, fallback: number | null): number | null`**
   - Parses integer radix 10 and validates `Number.isFinite`.

4. **`parseEnvList(...values: unknown[]): string[]`**
   - Supports both JSON arrays (e.g. `["photo1.jpg", "photo2.jpg"]`) and delimiter-separated strings (comma `,`, newline `\n`, or pipe `|`).

5. **`parseEnvJson<T>(value: unknown): T | null`**
   - Safely parses complex JSON profiles (e.g. `VITE_FAMILY_PROFILE_JSON`) with try/catch protection.

---

## 🛠 3. Contributor Guide: Adding a New Environment Variable

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

## 🧬 4. Family & Relationship System Integration

For relationship-driven customization:
- `VITE_FAMILY_MEMBER_TYPE` hydrates a full `FamilyMemberProfile` from `src/features/core/models/familyTemplates.ts`.
- `SuperPersonalizedLogic.ts` reads the profile to dynamically produce personalized storytelling, memories, and quiz questions.
- For instructions on creating new relationship types, see [[Template-System-Deep-Dive]].

---
#obsidian #documentation #birthday-bloom #vault #architecture #env
