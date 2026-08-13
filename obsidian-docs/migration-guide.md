# Migration Guide

This guide maps older Birthday Bloom structures to the v3 env-first and family-template system.

---

## Who Should Use This

You should read this if:
- You're upgrading a v2.x project to v3.x
- You have family member data in an older format
- You were editing source code for personalization and want to switch to env-driven customization

---

## Version History at a Glance

| Feature | v1.x | v2.x | v3.x |
|---|---|---|---|
| Core birthday experience | Basic | Enhanced | Cinematic |
| Environment variables | Minimal | 15 options | 40+ options |
| Theme support | None | 6 themes | 6 themes + env override |
| Relationship types | 1 | 6 | 8 + custom registry |
| Multi-layer animations | None | 7 animation types | Enhanced + responsive |
| Template system | None | 6 generic templates | 14 registered family types |
| Audio integration | None | Architecture (v2.1 ready) | Full BGM + sound effects |
| Video support | None | Limited | Full gallery |
| Family profiles | None | Ad-hoc objects | Typed schemas, 14 member types |
| Validation system | None | None | ConfigValidator + DataValidator |
| Emotional letters | Static strings | Static strings | Template library in config |
| Photo handling | Static imports | Static imports | Env-driven with fallback chain |
| Section visibility | Manual code edits | Manual code edits | Env toggles (VITE_SHOW_*) |
| Password unlock | None | None | Full implementation |
| Accessibility | None | Basic | 6 env-controlled options, WCAG AA |
| Type safety | None | Partial | Complete |
| Documentation | None | Sparse | Full documentation suite (15+ files) |
| Error handling | None | Error boundaries | Comprehensive |
| Bundle size (gzipped) | ~150KB | ~180KB | ~200KB |

---

## What's New in v3.x

### 1. Family Templates System

The family system is a registry-driven architecture in `src/features/core/models/familyTemplates.ts`. It keeps Brother and Sister support and adds Father, Mother, Grandfather, Grandmother, Uncle, Aunt, Cousin, Son, Daughter, Guardian, Friend, and Custom profiles. See [docs/family-system.md](./family-system.md) and [docs/template-architecture.md](./template-architecture.md).

**Brother Template** - 15 comprehensive sections: Basic Info, Identity, Personality, Interests, Skills, Appearance, Contact, Sibling Bond, Dreams, Achievements, Media, Important Dates, Personal Notes, Preferences, Future Plans. Specialized fields include Closeness Level (1-10), Shared Memories, Childhood Recollections.

**Sister Template** - 15 unique sections designed for female siblings with emphasis on professional life, personality profile, lifestyle, passions, and relationships.

```typescript
import { createDefaultBrotherProfile, createDefaultSisterProfile } from '@/features/core/models/familyTemplates';

const brother = createDefaultBrotherProfile("Raj", new Date('1998-03-15'));
brother.siblingBond.closenessLevel = 9;
brother.personality.traits = ['protective', 'humorous'];

const sister = createDefaultSisterProfile("Priya", new Date('2000-07-22'));
sister.professionalLife.currentRole = "Software Engineer";
sister.relationshipDynamics.bondStrength = 10;
```

### 2. Enhanced Data Models

`EnhancedBirthdayConfig` with 7 major sections:

```
Core Information (Required)
Personalization (Recommended)
Media Assets (Optional)
Experience Settings (Optional)
Accessibility (Optional)
Messaging & Letters (Optional)
Special Sections (Optional)
```

**40+ Configuration Options** across color schemes, animation controls, particle effects, text accessibility, photo/video management, custom sections, and more.

### 3. Validation System

**ConfigValidator** provides three methods:
- `validate(config)` - Comprehensive validation with error reporting
- `sanitize(config)` - Remove invalid data, apply safe defaults
- `mergeWithDefaults(config)` - Blend user config with defaults

**DataValidator** includes 12+ specialized validators:
- Email, hex color, phone number, URL, date, age, closeness level, name validation, and more

```typescript
const result = ConfigValidator.validate(config);
if (!result.isValid) {
  console.error("Validation errors:", result.errors);
  const cleanConfig = ConfigValidator.sanitize(config);
}
```

### 4. Extended Emotional Letters

New templates for Brother and Sister relationships with enhanced depth for existing templates. Each template is emotionally resonant, poetically crafted, relationship-aware, gender-sensitive, and context-appropriate.

### 5. Complete Documentation Overhaul

New documentation files:
- `COMPLETE_SETUP_GUIDE.md` - 15 sections covering overview, installation, configuration, family templates, customization, API reference, troubleshooting, deployment
- `API_REFERENCE.md` - 6 major sections (Store API, Component API, Utilities API, Data Models API, Hooks API, Type Definitions)
- Migration guide (v2.5 -> v3.0)
- Deployment instructions and performance tips

### 6. Specialized Family Models

**BrotherProfile Interface** includes 15 fields: basicInfo, identity, personality, interests, skills, appearance, contact, siblingBond, dreams, achievements, media, importantDates, personalNotes, preferences, futurePlans.

**SisterProfile Interface** includes 15 fields: coreIdentity, professionalLife, personalityProfile, lifestyle, passions, preferences, relationshipDynamics, memories, dreamsAndInspiration, achievements, styleAndAppearance, socialAndContact, personalArchive, heartMatters, futureAndGrowth.

### 7. Performance & Accessibility Improvements

- Bundle size: ~200KB (gzipped) - no increase from v2.5
- Load time: <2s on 4G
- WCAG 2.1 Level AA compliance maintained
- New flags: `screenReaderOptimized`, `highContrast`, `reducedMotion` enhanced, `textSize` scaling
- Input sanitization with XSS protection
- Fully client-side, no cookies or tracking, GDPR compliant

---

## What's New in v2.x

### 1. Multi-Layer Animation System

Seven built-in animation effects:
- **ParticleBurst** - Explosive particle effects with physics simulation
- **MorphingElements** - Fluid background shapes with continuous animation
- **EnhancedFloatingElements** - Floating emojis with varied animation timings
- **SparkleRain** - Falling sparkle effects
- **RibbonEffect** - Dynamic ribbon banners
- **WaveEffect** - Expanding wave animations
- **DigitalRain** - Matrix-style falling characters

Animation intensity is controllable via `VITE_ANIMATION_INTENSITY` (low/medium/high) and `VITE_ANIMATION_SPEED` (slow/moderate/fast).

### 2. Template System

Six birthday celebration templates with automatic selection based on relationship and gender:
- **Romantic** - Heart themes, soft colors, slow animations (for partners)
- **Fun** - Party themes, vibrant colors, fast animations (for friends)
- **Energetic** - High-energy celebrations
- **Elegant** - Sophisticated themes
- **Playful** - Quirky and fun themes
- **Nostalgic** - Vintage and retro themes, warm colors (for family)

Theme selection is derived from the configured relationship and runtime heuristics. `VITE_THEME` is reserved for future manual theme override and is not currently consumed.

### 3. Personalization by Demographics

The system automatically adjusts based on:
- Gender (male, female, other)
- Age group (teen, young adult, adult, senior)
- Relationship (partner, friend, family, colleague, mentor)
- Color preferences (6 color palettes)
- Accessibility (reduced motion, high contrast, text scaling)

### 4. Mobile-First Responsive Design

Five responsive breakpoints:
- **Mobile** (<=480px): 10 particles, optimized touch, reduced animation
- **Tablet** (481-768px): 15 particles, 2-column grids
- **Laptop** (769-1024px): balanced layout
- **Desktop** (1025-1280px): full features, 25 particles
- **Ultrawide** (1281px+): max visual impact, 40-60 particles

Touch targets minimum 44x44px, font-size 16px to prevent auto-zoom.

### 5. Audio System Architecture

Background music is loaded from `VITE_SOUND_URL` with `VITE_BGM_URL` as a backward-compatible alias. `VITE_SONG_URL` and `VITE_VOICE_MESSAGE_URL` are reserved for planned future enhancements and are not currently consumed.

```typescript
import { audioSystem } from '@/services/audioSystem';

audioSystem.initBGM(bgmUrl);
audioSystem.playEffect('pop');
audioSystem.setBGMVolume(0.5);
audioSystem.setEnabled(false);
```

### 6. Error Handling

Error Boundary component with graceful fallbacks, console error tracking, and user-friendly error messages.

---

## Version-by-Version Migration Path

### v1.x -> v2.x

v1.x was the initial release with a basic birthday experience, simple animations, and minimal environment variable support. To migrate to v2.x:

1. **Clone fresh or update**: `git pull` to get the v2.x codebase
2. **Add environment variables**: Copy `.env.example` and add new v2.x variables:
   ```env
   VITE_BIRTHDAY_GENDER=female
   VITE_BIRTHDAY_RELATIONSHIP=partner
   VITE_ANIMATION_INTENSITY=high
   VITE_PARTICLE_COUNT=25
   ```
   Note: `VITE_THEME`, `VITE_REDUCED_MOTION`, `VITE_TEXT_SIZE`, and `VITE_HIGH_CONTRAST` are reserved for future use and are not currently parsed.

3. **Update component imports**: v2.x introduced the Zustand store (`useBirthdayStore`) replacing direct config imports. Migrate from:
   ```typescript
   // v1.x - direct config import
   import { config } from '@/config';
   console.log(config.name);
   ```
   To:
   ```typescript
   // v2.x - Zustand store
   import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
   const { config } = useBirthdayStore();
   ```
4. **Replace manual animations**: Remove custom animation code and use the built-in animation components (`ParticleBurst`, `MorphingElements`, etc.)
5. **Apply responsive design**: Remove custom media queries; the v2.x responsive system handles all breakpoints
6. **Add error boundaries**: Wrap your main component with the provided `ErrorBoundary`

### v2.x -> v3.x

1. **Copy the new env template** to preserve all v3 keys:
   ```bash
   cp .env.example .env.local
   ```

2. **Move all names, colors, media, and messages into env**:
   - Replace `src/config.ts` edits with env values
   - Replace hardcoded names with `VITE_BIRTHDAY_NAME`
   - Replace hardcoded colors with `VITE_BIRTHDAY_COLOR`

3. **Replace code-edited photos**:
   - Use `VITE_PHOTOS` (pipe-separated URL list) or `VITE_PHOTO_1..6` (numbered variables)

4. **Replace hardcoded section edits** with `VITE_SHOW_*` toggles:
   - `VITE_SHOW_CAKE_SECTION=false` instead of removing `<CakeCutting />` from JSX

5. **Create family profiles** with `VITE_FAMILY_MEMBER_TYPE` or `VITE_FAMILY_PROFILE_JSON`

6. **Migrate legacy family data**:
   ```typescript
   import { migrateLegacyFamilyMember } from '@/features/core/models/familyTemplates';

   const oldMember = { id: 'm1', type: 'brother', name: 'Raj' };
   const migrated = migrateLegacyFamilyMember(oldMember);
   // migrated.memberType === 'brother'
   // migrated.metadata.source === 'migration'
   ```

7. **Adopt new configuration structure** (optional but recommended):
   ```typescript
   // v2.x style (still works)
   config.customMessage = "...";
   config.photos = [...];

   // v3.x recommended
   config.messaging.letterContent = "...";
   config.media.photos.gallery = [...];
   ```

8. **Run validation on existing configs**:
   ```typescript
   const result = ConfigValidator.validate(myConfig);
   if (!result.isValid) {
     const safeConfig = ConfigValidator.sanitize(myConfig);
   }
   ```

9. **Verify the build**:
   ```bash
   npm run test
   npm run build
   ```

### Quick Upgrade Commands

**Option A: Fresh Installation (Recommended)**
```bash
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom
npm install
npm run dev
```

**Option B: Update Existing Installation**
```bash
git pull origin main
npm install
# No breaking changes, should work immediately
```

**Option C: Gradual Migration**
1. Keep using v2.x features
2. Gradually adopt v3.x models
3. Update when ready (no deadline)

---

## Breaking Changes

### v2.x Breaking Changes (vs v1.x)

- **Config system replaced**: Direct config imports replaced by Zustand store (`useBirthdayStore`)
- **Animation API changed**: Custom animation code must be replaced with built-in components
- **Responsive system**: Custom media queries may conflict with the new responsive framework
- **Environment variables**: New required variables (`VITE_BIRTHDAY_GENDER`, `VITE_BIRTHDAY_RELATIONSHIP`)
- **Component structure**: Some component paths changed; review imports after upgrading

### v3.x Breaking Changes (vs v2.x)

**None!** Version 3.x is **fully backward compatible** with v2.x.

All existing env variables continue to work. New optional variables added:
- `VITE_BIRTHDAY_LETTER_OVERRIDE` - Custom letter content
- `VITE_SHOW_CAKE_SECTION` - Show/hide cake section
- `VITE_SHOW_VIDEO_SECTION` - Show/hide video section
- `VITE_FAMILY_MEMBER_TYPE` - Family member type
- `VITE_FAMILY_PROFILE_JSON` - Full family profile JSON
- `VITE_PASSWORD_REQUIRED` - Enable password lock
- `VITE_PASSWORD` - Manual password override
- `VITE_PASSWORD_HINT` - Custom password hint
- `VITE_PASSWORD_FORMAT` - Auto-generate password format

Old configuration structure still works. New `EnhancedBirthdayConfig` structure is recommended but optional.

**Known migration notes:**
- `src/config.ts` still works as a static fallback but is deprecated
- `PHOTO_ASSETS` and `AUDIO_ASSETS` in `src/config/birthday.ts` still work but env-driven approach is preferred
- Legacy relationship values like `"love"`, `"bestie"`, `"bro"`, `"mom"`, `"dad"` are normalized automatically

---

## Old to New Env Mapping

| Old / Alias | New Preferred Variable | Still Works? |
|---|---|---|
| `VITE_FAVORITE_COLOR` | `VITE_BIRTHDAY_COLOR` | Yes (alias) |
| `VITE_CUSTOM_MESSAGE` | `VITE_BIRTHDAY_CUSTOM_MESSAGE` | Yes (alias) |
| `VITE_WISHER_NAME` | `VITE_BIRTHDAY_WISHER_NAME` | Yes (alias) |
| `VITE_FAVORITE_ITEMS` | `VITE_BIRTHDAY_INTERESTS` | Yes (alias) |
| `VITE_BGM_URL` | `VITE_SOUND_URL` (checked second if BGM not set) | Yes (alias) |
| Individual photo edits in code | `VITE_PHOTOS` or `VITE_PHOTO_1..6` | N/A (was in code) |
| Manual section removal in code | `VITE_SHOW_*_SECTION=false` | N/A (was in code) |

Preferred names should be used in new projects. Aliases continue to work for backward compatibility.

---

## Relationship Type Changes

In v2.x, relationship was typically hardcoded as `"partner"`, `"friend"`, or `"family"`. In v3.x, the supported types expanded to 18 values with intelligent normalization:

| Old Value | Normalized To |
|---|---|
| `"love"` | `partner` |
| `"bestie"` | `friend` |
| `"bro"` | `brother` |
| `"mom"` | `mother` |
| `"dad"` | `father` |
| `"work"`, `"coworker"` | `colleague` |
| `"teacher"` | `mentor` |

The store uses `.includes()` matching, so partial matches work: `"best friend ever"` -> `friend`.

### v3.x Relationship Types

| Type | Description |
|---|---|
| `partner` | Romantic partner/spouse |
| `friend` | Close friend/best friend |
| `sibling` | Brother or sister |
| `brother` | Male sibling |
| `sister` | Female sibling |
| `father` | Father |
| `mother` | Mother |
| `grandfather` | Grandfather |
| `grandmother` | Grandmother |
| `uncle` | Uncle |
| `aunt` | Aunt |
| `cousin` | Cousin |
| `son` | Son |
| `daughter` | Daughter |
| `guardian` | Guardian |
| `colleague` | Work colleague |
| `mentor` | Teacher/mentor |
| `custom` | Custom relationship |

---

## Old Family Shape

Older family objects (pre-v3) looked like:

```ts
{
  id: 'member-1',
  type: 'extended',
  name: 'Relative',
  dateOfBirth: new Date(),
  profileData: {}
}
```

New profiles use `FamilyMemberProfile` from `familyTemplates.ts` with a structured schema including basicInfo, relationship metadata, identity, personality, interests, bond, personalNotes, timeline, media, dynamic fields, and privacy controls.

### Migration in Code

```ts
import { migrateLegacyFamilyMember } from '@/features/core/models/familyTemplates';

const oldMember = {
  id: 'member-1',
  type: 'brother',
  name: 'Raj',
  dateOfBirth: new Date('1998-03-15'),
  profileData: { favoriteMemory: 'Treehouse summers' },
};

const migrated = migrateLegacyFamilyMember(oldMember);
// migrated.memberType === 'brother'
// migrated.metadata.source === 'migration'
```

Known `brother` and `sister` legacy types migrate to dedicated profiles (`SiblingFields`). Unknown types migrate to `custom` with `profileData` preserved in `specialized.customSections`.

---

## Migration Scripts & Functions

### migrateLegacyFamilyMember

Converts old family member objects (pre-v3) to the new `FamilyMemberProfile` format.

```typescript
import { migrateLegacyFamilyMember } from '@/features/core/models/familyTemplates';

function batchMigrateFamilyMembers(oldMembers: any[]): FamilyMemberProfile[] {
  return oldMembers.map(member => migrateLegacyFamilyMember(member));
}

// Usage
const legacyMembers = [
  { id: '1', type: 'brother', name: 'Raj', dateOfBirth: new Date('1998-03-15') },
  { id: '2', type: 'sister', name: 'Priya', dateOfBirth: new Date('2000-07-22'), profileData: { hobby: 'painting' } },
  { id: '3', type: 'extended', name: 'Uncle', dateOfBirth: new Date('1970-01-01') },
];

const familyProfiles = batchMigrateFamilyMembers(legacyMembers);
```

### ConfigValidator Migration Helpers

```typescript
import { ConfigValidator } from '@/features/core/models/dataModels';

function migrateV2ConfigToV3(v2Config: any): EnhancedBirthdayConfig {
  // Map v2 flat config to v3 structured config
  const v3Config = {
    core: {
      name: v2Config.name || v2Config.birthdayName || '',
      dateOfBirth: v2Config.dateOfBirth || new Date(),
      gender: v2Config.gender || 'other',
      relationship: v2Config.relationship || 'friend',
    },
    personalization: {
      theme: v2Config.theme || 'fun',
      favoriteColor: v2Config.favoriteColor || v2Config.color || '#FF6B6B',
      interests: v2Config.interests || v2Config.favoriteItems || [],
    },
    media: {
      photos: v2Config.photos ? { gallery: v2Config.photos } : undefined,
      audio: v2Config.bgmUrl ? { backgroundMusic: v2Config.bgmUrl } : undefined,
    },
    messaging: {
      letterContent: v2Config.customMessage || v2Config.message || undefined,
      senderName: v2Config.wisherName || undefined,
    },
    sections: {
      showCake: v2Config.showCakeSection ?? true,
      showPhotos: v2Config.showPhotos ?? true,
      showVideos: v2Config.showVideos ?? true,
    },
  };

  // Validate and sanitize the result
  return ConfigValidator.mergeWithDefaults(
    ConfigValidator.sanitize(v3Config)
  );
}
```

### Env Variable Migration Check

```typescript
// Quick check for legacy env variables
const LEGACY_ENV_MAP: Record<string, string> = {
  VITE_FAVORITE_COLOR: 'VITE_BIRTHDAY_COLOR',
  VITE_CUSTOM_MESSAGE: 'VITE_BIRTHDAY_CUSTOM_MESSAGE',
  VITE_WISHER_NAME: 'VITE_BIRTHDAY_WISHER_NAME',
  VITE_FAVORITE_ITEMS: 'VITE_BIRTHDAY_INTERESTS',
  VITE_BGM_URL: 'VITE_SOUND_URL',
};

function checkForLegacyEnvVars(): string[] {
  const warnings: string[] = [];
  for (const [legacy, preferred] of Object.entries(LEGACY_ENV_MAP)) {
    if (import.meta.env[legacy]) {
      warnings.push(`'${legacy}' is set. Consider using '${preferred}' instead.`);
    }
  }
  return warnings;
}
```

---

## Backward Compatibility

The project preserves these older APIs for backward compatibility:

### Env Variable Aliases

- `VITE_FAVORITE_COLOR` -> `VITE_BIRTHDAY_COLOR`
- `VITE_CUSTOM_MESSAGE` -> `VITE_BIRTHDAY_CUSTOM_MESSAGE`
- `VITE_WISHER_NAME` -> `VITE_BIRTHDAY_WISHER_NAME`
- `VITE_FAVORITE_ITEMS` -> `VITE_BIRTHDAY_INTERESTS`
- `VITE_BGM_URL` -> `VITE_SOUND_URL` (checked second if BGM not set)

### API Backward Compatibility

- `createDefaultBrotherProfile()` and `createDefaultSisterProfile()` factory functions remain available
- `src/config.ts` static fallback still works (deprecated but functional)
- `PHOTO_ASSETS` and `AUDIO_ASSETS` in `src/config/birthday.ts` continue to be supported
- Legacy relationship value normalization (see Relationship Type Changes table)
- Old v2.x flat config structure is still accepted by the store

### Legacy Factories

```typescript
// These v2.x factory functions still work in v3.x
import {
  createDefaultBrotherProfile,
  createDefaultSisterProfile,
} from '@/features/core/models/familyTemplates';

// They now delegate to the new FamilyMemberProfile system internally
const brother = createDefaultBrotherProfile("Raj", new Date('1998-03-15'));
// brother now has both legacy flat properties and new structured fields
```

### Component Backward Compatibility

All v2.x components remain importable from their original paths. No component was removed; only new components were added. The `MainBirthday`, `PhotoGallery`, `VideoGallery`, and `CakeCutting` components all maintain their v2.x APIs.

### Store Backward Compatibility

The `useBirthdayStore` Zustand store maintains backward compatibility:
- All v2.x store methods and properties continue to work
- New v3.x methods are additive (`getMood`, `getAnimationPacing`, etc.)
- Config set via `setConfig` with v2.x flat structure is normalized internally

### v2.5 Support Policy

- v2.5 will continue to work
- Bug fixes will be applied to v2.5
- New features are exclusive to v3.x
- v2.5 support: 12 months from v3.0 release (May 2026)

---

## What Changed in v3.x

| Area | v2.x | v3.x |
|---|---|---|
| Family profiles | Ad-hoc objects | Typed schemas, 14 member types, registry |
| Env parsing | Scattered across components | Centralized in `useBirthdayStore.ts` |
| Emoji kits | Hardcoded per component | Relationship-based, interest-merged |
| Emotional letters | Static strings | Template library in `config/templates.ts` |
| Photo handling | Static imports | Env-driven with fallback chain |
| Section visibility | Manual code edits | Env toggles |
| Password unlock | Not available | Full implementation |
| Accessibility | Not configurable | 6 env-controlled accessibility options |
| Documentation | Sparse | Full documentation suite |

---

## Cross-Reference Documentation

The following documentation files provide additional context for migration:

| Document | Purpose |
|---|---|
| [docs/ENV_GUIDE.md](./ENV_GUIDE.md) | Full environment variable reference, all 40+ options |
| [docs/family-system.md](./family-system.md) | Family template system architecture and usage |
| [docs/template-architecture.md](./template-architecture.md) | Template system internals and customization |
| [docs/developer-guide.md](./developer-guide.md) | Development setup, contributing, and architecture |
| [docs/API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference for stores, components, utilities |
| [docs/COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) | Full setup guide with configuration examples |
| [QUICK_START.md](../QUICK_START.md) | 5-minute quick start guide |
| [CHANGELOG.md](../CHANGELOG.md) | Full version history and release notes |
| [docs/UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md) | Detailed v3 upgrade summary |
| [docs/v2-upgrade-guide.md](./v2-upgrade-guide.md) | Original v2 upgrade guide |

---

## Recommended Upgrade Steps

1. **Copy the new env template** to preserve all v3 keys:
   ```bash
   cp .env.example .env.local
   ```

2. **Move all names, colors, media, and messages into env**:
   - Replace `src/config.ts` edits with env values
   - Replace hardcoded names with `VITE_BIRTHDAY_NAME`
   - Replace hardcoded colors with `VITE_BIRTHDAY_COLOR`

3. **Replace code-edited photos**:
   - Use `VITE_PHOTOS` (pipe-separated URL list) or `VITE_PHOTO_1..6` (numbered variables)

4. **Replace hardcoded section edits** with `VITE_SHOW_*` toggles:
   - `VITE_SHOW_CAKE_SECTION=false` instead of removing `<CakeCutting />` from JSX

5. **Create family profiles** with `VITE_FAMILY_MEMBER_TYPE` or `VITE_FAMILY_PROFILE_JSON`

6. **Verify the build**:
   ```bash
   npm run test
   npm run build
   ```

---

## v3.1 Roadmap

Q3 2026 planned features:
- Multi-recipient support
- Guest book/comments system
- Music playlist integration
- Advanced analytics
- Custom domain support
- Email invitations
- Social media sharing

---

## See Also

- [docs/ENV_GUIDE.md](./ENV_GUIDE.md) -- Full env variable reference
- [docs/family-system.md](./family-system.md) -- Family template system
- [docs/template-architecture.md](./template-architecture.md) -- Template architecture
- [docs/developer-guide.md](./developer-guide.md) -- Developer guide
- [QUICK_START.md](../QUICK_START.md) -- Quick start
- [CHANGELOG.md](../CHANGELOG.md) -- Full changelog
- [UPGRADE_SUMMARY.md](./UPGRADE_SUMMARY.md) -- Detailed v3 upgrade info
- [docs/v2-upgrade-guide.md](./v2-upgrade-guide.md) -- Original v2 upgrade guide
- [docs/API_REFERENCE.md](./API_REFERENCE.md) -- Complete API reference
- [docs/COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) -- Full setup guide
