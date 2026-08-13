# Complete Env Customization Guide

Birthday Bloom is **env-first**. Names, relationship type, messages, colors, photos, videos, audio, visible sections, animation behavior, accessibility, and family-template metadata are all controlled through environment variables.

**Important**: "Env" means environment variables. Locally, these live in `.env.local`. On hosting platforms, they live in the provider's Environment Variables dashboard (Vercel, Netlify, AWS Amplify, etc.).

---

## How Env Works

Vite exposes browser-safe variables prefixed with `VITE_`. The app parses them in `src/features/core/store/useBirthdayStore.ts` at module load time.

**Priority order**:
1. Host environment variables (production)
2. `.env.local` values (development)
3. `src/config.ts` fallback (basic static defaults)
4. Built-in constants

After changing `.env.local`, **restart the dev server**:
```bash
npm run dev      # macOS/Linux
npm.cmd run dev  # PowerShell
```

**All `VITE_` values are public** — they ship to the browser. Keep passwords, tokens, and secrets out of env values.

### Hydration & Verification

On boot, `useBirthdayStore` parses all env variables starting with `VITE_BIRTHDAY_*`, stores them in a reactive **Zustand** store, and auto-sets `isConfigured: true` when `VITE_BIRTHDAY_NAME` is present — this skips the setup wizard and triggers the cinematic intro immediately.

To verify env is loaded:
1. Ensure `.env` or `.env.local` exists in the project root.
2. Restart the dev server after creating/editing the file.
3. Open the browser console; the app logs `"Personalization Loaded"` on success.

---

## Core Identity

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_BIRTHDAY_NAME` | string | `""` | Main displayed name. Setting it personalizes the whole app and sets `isConfigured=true`. |
| `VITE_BIRTHDAY_AGE` | number (optional) | `null` | Displays "Happy Nth Birthday" and affects story tone. |
| `VITE_BIRTHDAY_GENDER` | enum | `other` | `male`, `female`, or `other`. Affects pronouns, letter content, theme subtle shifts. |
| `VITE_BIRTHDAY_DATE` | date | `null` | ISO format date, e.g. `2026-10-15` or `2026-10-15T00:00:00`. Used for password generation and birthday age. Handles `TH` typo correction. |
| `VITE_BIRTHDAY_RELATIONSHIP` | enum/string | `friend` | Drives mood, pacing, emoji kits, chat messages, letter content, theme, and color palette. |
| `VITE_BIRTHDAY_WISHER_NAME` | string | `""` | Sender name appended to letter signoff. Also accepted as `VITE_WISHER_NAME` for backward compatibility. |

**Supported relationship values**: `partner`, `friend`, `family`, `sibling`, `brother`, `sister`, `father`, `mother`, `grandfather`, `grandmother`, `uncle`, `aunt`, `cousin`, `son`, `daughter`, `guardian`, `colleague`, `mentor`, `custom`.

The store normalizes aliases: e.g., `"love"` → `partner`, `"mom"` → `mother`, `"bestie"` → `friend`, `"work"` → `colleague`.

---

## Message and Theme

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | string | `""` | Custom message displayed in the letter card. When set, replaces the auto-generated message. |
| `VITE_BIRTHDAY_LETTER_TITLE` | string | `"A Special Letter Just for You 💌"` | Letter section heading. |
| `VITE_BIRTHDAY_LETTER_OVERRIDE` | escaped string | `""` | Full custom letter body. Use `\n` for newlines. The `\n` is converted to actual newlines in `useBirthdayStore`. |
| `VITE_BIRTHDAY_COLOR` | hex | `#FF6B6B` | Primary accent color. Also accepted as `VITE_FAVORITE_COLOR`. Used for buttons, glows, cards, gradients. |
| `VITE_THEME` | enum | `reserved` | Reserved for future theme hints; not currently parsed by the runtime. |
| `VITE_BIRTHDAY_INTERESTS` | CSV/list | `""` | Drives interest icons (lucide-react icons in hero), quiz questions, gift code generation, emoji injection. Also accepted as `VITE_FAVORITE_ITEMS`. |
| `VITE_FAVORITE_EMOJIS` | CSV/list | `""` | Custom burst emojis when tapping interactive elements. Also accepted as `VITE_BIRTHDAY_EMOJIS`. |
| `VITE_CUSTOM_MESSAGE` | string | `""` | Backward-compatible alias for `VITE_BIRTHDAY_CUSTOM_MESSAGE`. |

**Supported interests**: `car`, `music`, `art`, `coding`, `gaming`, `nature`, `travel`, `food`, `sport`, `space` — each maps to a lucide-react icon and interest-specific emojis.

### Curated Theme Palettes

The engine generates a full UI palette from a single `VITE_BIRTHDAY_COLOR`. These curated hex codes achieve specific looks:

- **"Midnight Bloom"**: `#00C2FF` (Vibrant Cyan)
- **"Rose Quartz"**: `#FF6B6B` (Soft Coral)
- **"Golden Legacy"**: `#FFD700` (Classic Gold)
- **"Neon Cyber"**: `#A855F7` (Deep Purple)

Each theme ships with a full color palette:

| Theme | Primary | Secondary | Accent |
|---|---|---|---|
| Romantic | `#FF1493` | `#FFB6C1` | `#FF69B4` |
| Fun | `#FFD700` | `#FF6347` | `#00CED1` |
| Energetic | `#FF4500` | `#00FF00` | `#00FFFF` |
| Elegant | `#C0C0C0` | `#DAA520` | `#696969` |
| Playful | `#FF69B4` | `#00FFFF` | `#FFD700` |
| Nostalgic | `#8B4513` | `#DAA520` | `#CD5C5C` |

### CSS Variable Overrides

For manual CSS overrides in `index.css`:
```css
:root {
  --primary-glow: 0 0 40px rgba(var(--color-primary-rgb), 0.6);
}
```

---

## Photos

Two modes — `VITE_PHOTOS` (unlimited, pipe-separated) wins when set:

```env
VITE_PHOTOS=https://example.com/one.jpg|https://example.com/two.jpg|https://example.com/three.jpg
VITE_PHOTO_CAPTIONS=First memory|Favorite trip|Best smile
```

For simple setups (easier in hosting dashboards):

```env
VITE_PHOTO_1=https://example.com/one.jpg
VITE_PHOTO_2=https://example.com/two.jpg
VITE_PHOTO_3=https://example.com/three.jpg
VITE_PHOTOS=                    # Leave empty so numbered vars are used
VITE_PHOTO_CAPTIONS=First memory|Favorite trip|Best smile
```

The store builds the photos array: if `VITE_PHOTOS` is set, it splits on `|`. Otherwise it collects non-empty `VITE_PHOTO_1..6` values. Fallback defaults from `src/config/birthday.ts` and static imports (`src/assets/photo-1.jpg` etc.) are used when no env values are provided.

### Media Optimization Standards

To maintain 60fps cinematic flow:

- **Format**: Prefer `.webp`, then `.jpg`. Avoid `.png` — too heavy.
- **Size**: Keep each image under **500KB**.
- **Dimensions**: Use **16:9** aspect ratio for the gallery to avoid black bars in the 3D tilt view.
- **Mobile**: The gallery auto-disables tilt on phones and uses smoother transitions.
- **Recommended sizes**: 800x600px or larger.

### Error Handling

```env
# INCORRECT (may cause broken loading)
VITE_PHOTO_1="https://random-site.com/broken-link"

# CORRECT (direct image URL)
VITE_PHOTO_1="https://images.unsplash.com/photo-1530101121243-c99ff3cdca42?auto=format&fit=crop&w=800&q=80"
```

The photo gallery supports lazy loading and falls back gracefully if a memory image fails.

---

## Videos and Audio

| Variable | Type | Purpose |
|---|---|---|
| `VITE_VIDEO_1`, `VITE_VIDEO_2`, `VITE_VIDEO_3` | URL | Memory videos in the video gallery. Supports YouTube (watch, embed, short URL) and direct MP4/WebM files. |
| `VITE_FINAL_VIDEO_URL` | URL | Closing video in the FinalSurprise component. |
| `VITE_SOUND_URL` | URL | Background music (falls back to built-in Pixabay audio if unset). |
| `VITE_BGM_URL` | URL | Backward-compatible alias for sound URL. |
| `VITE_SONG_URL` | URL | Reserved for a future song integration; not currently consumed. |
| `VITE_VOICE_MESSAGE_URL` | URL | Reserved for future voice message support; not currently consumed. |
| `VITE_SOUND_EFFECTS` | `reserved` | Reserved for future sound-control support; not currently parsed. |

**Audio resolution**: `AUDIO_ASSETS.bgmUrl` in `src/config/birthday.ts` checks `VITE_BGM_URL` first, then `VITE_SOUND_URL`. The `SoundManager` uses this for background music. Individual sound effects are hosted on Pixabay CDN.

**Audio best practices**:
- Always use HTTPS URLs for audio/video sources.
- Ensure CORS is enabled on your audio host.
- For YouTube final videos, use the `/embed/` link format for the best cinematic experience.
- Browser autoplay policies require user interaction before audio plays — clicking "Start" triggers it.

---

## Sections

Every rendered section has an env toggle:

| Variable | Default | Controls |
|---|---|---|
| `VITE_SHOW_PHOTO_SECTION` | `true` | Photo gallery |
| `VITE_SHOW_QUIZ_SECTION` | `true` | Birthday quiz |
| `VITE_SHOW_GIFT_SECTION` | `true` | Hidden gift code section |
| `VITE_SHOW_HEART_TREE_SECTION` | `true` | Heart tree finale |
| `VITE_SHOW_VIDEO_SECTION` | `true` | Video gallery |
| `VITE_SHOW_CAKE_SECTION` | `true` | Cake cutting experience |
| `VITE_SHOW_FINAL_SURPRISE` | `true` | Final surprise (memories + video) |
| `VITE_SHOW_SKIP_BUTTON` | `reserved` | The intro skip button is currently always shown; this env is reserved for future parsing. |

Also accepted: `VITE_SHOW_PHOTOS_SECTION` (alias for photo section).

**Supported boolean values**: `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off`, `enabled`, `disabled`.

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_DURATION` | `reserved` | `normal` | Reserved for future overall pacing control; not currently parsed. |

---

## Animation and Accessibility

| Variable | Values | Default | Recommended Use |
|---|---|---|---|
| `VITE_ANIMATION_SPEED` | `slow`, `moderate`, `fast` | based on relationship | Slow for romantic/family, fast for energetic friends |
| `VITE_ANIMATION_INTENSITY` | `low`, `medium`, `high` | `high` | Lower for older phones or reduced motion needs |
| `VITE_PARTICLE_COUNT` | number | `25` | Higher for desktop (`25-60`), lower for mobile (`8-15`) |
| `VITE_REDUCED_MOTION` | `reserved` | `false` | Reserved for future reduced-motion support; not currently parsed. |
| `VITE_TEXT_SIZE` | `reserved` | `normal` | Reserved for future text-scaling support; not currently parsed. |
| `VITE_HIGH_CONTRAST` | `reserved` | `false` | Reserved for future high-contrast support; not currently parsed. |

### Responsive Breakpoints

| Device | Width | Default Particles | Base Font | Animations |
|---|---|---|---|---|
| Mobile | 480px | 10 | 14px | Medium |
| Tablet | 481-768px | 15 | 15px | Medium-High |
| Laptop | 769-1024px | 25 | 16px | High |
| Desktop | 1025-1280px | 40 | 17px | High |
| Ultrawide | 1281px+ | 60 | 18px | Max |

### Performance vs Quality

| Variable | Low-End Value | High-End Value |
|---|---|---|
| `VITE_PARTICLE_COUNT` | `10` (old phones) | `100` (high-end PCs) |
| `VITE_ANIMATION_SPEED` | `slow` (emotional pacing) | `fast` (party vibe) |
| `VITE_ANIMATION_INTENSITY` | `low` | `high` |

### Accessibility Features

- **Reduced Motion**: Reserved for future support; currently not parsed.
- **Text Scaling**: Reserved for future support; currently not parsed.
- **High Contrast**: Reserved for future support; currently not parsed.
- **Touch Targets**: 44x44px minimum for all interactive elements
- **Keyboard Navigation**: Full support throughout the experience
- **Screen Reader**: Compatible with semantic HTML and ARIA labels

### Animation Effects (15 total)

The engine includes 15 distinct animation effects tuned through env variables:

1. **ParticleBurst** — Physics-based explosions on cake clicks
2. **MorphingElements** — Fluid background shapes (4 animated orbs)
3. **EnhancedFloatingElements** — Floating emoji elements
4. **SparkleRain** — Cascading sparkle effect
5. **FireflyEffect** — Glowing flying lights (15 configurable fireflies)
6. **FloatingOrbs** — Blurred color orbs (8 spheres)
7. **ShootingStars** — Streaking stars with comet trails
8. **AnimatedGradient** — Rotating conic gradient layers
9. **RibbonEffect** — Banner animation with bouncing motion
10. **WaveEffect** — Expanding concentric rings
11. **LiquidSwirl** — Organic fluid SVG shape
12. **DigitalRain** — Matrix-style falling character columns
13. **GlitchEffect** — RGB offset glitch
14. **TextRevealEffect** — Staggered character reveal with spring physics
15. **TunnelEffect** — Zooming tunnel with depth

---

## Special Memories

Format for the FinalSurprise component's memory grid:

```env
VITE_SPECIAL_MEMORIES=First celebration;https://example.com/one.jpg|Favorite trip;https://example.com/two.jpg
```

Each item is `text;imageUrl`. Separate multiple memories with `|`. Images are optional — without a URL, a camera placeholder icon is shown.

---

## Family Template Env

See [family-system.md](./family-system.md) for the full schema. Env bootstrap:

| Variable | Type | Example | Purpose |
|---|---|---|---|
| `VITE_FAMILY_MEMBER_TYPE` | enum | `sister` | Selects template: `brother`, `sister`, `father`, `mother`, `grandfather`, `grandmother`, `uncle`, `aunt`, `cousin`, `son`, `daughter`, `guardian`, `friend`, `custom` |
| `VITE_FAMILY_PREFERRED_NAME` | string | `Pri` | Display name override |
| `VITE_FAMILY_NICKNAMES` | CSV | `Pri,Star` | Comma-separated nicknames |
| `VITE_FAMILY_RELATIONSHIP_LABEL` | string | `Younger Sister` | Human-readable relationship label |
| `VITE_FAMILY_CLOSENESS` | number (1-10) | `9` | Closeness level |
| `VITE_FAMILY_YEARS_KNOWN` | number | `24` | Years of shared history |
| `VITE_FAMILY_SIDE` | enum | `maternal` | `maternal`, `paternal`, `both`, `chosen`, `unknown` |
| `VITE_FAMILY_PRIVACY` | enum | `family` | `public`, `family`, `private` |
| `VITE_FAMILY_ALLOW_EXPORT` | boolean | `true` | Allow profile export |

For full control, paste a complete JSON profile:

```env
VITE_FAMILY_PROFILE_JSON={"schemaVersion":"3.0.0","id":"sister-1","memberType":"sister","basicInfo":{"fullName":"Priya","nicknames":["Pri"],"gender":"female","ageGroup":"young-adult"}}
```

`VITE_FAMILY_PROFILE_JSON` wins when set. Otherwise, the store constructs a profile from the individual env variables.

For code-level profile creation, use the factory functions in `src/features/core/models/familyTemplates`:
```typescript
import { createDefaultBrotherProfile, createDefaultSisterProfile } from '@/features/core/models/familyTemplates';
const profile = createDefaultSisterProfile("Priya", new Date('2000-07-22'));
profile.relationshipDynamics.bondStrength = 10;
```

See `src/features/core/models/dataModels.ts` for `ConfigValidator` (validate, sanitize, mergeWithDefaults) and `DataValidator` (isValidEmail, isValidHexColor, isValidPhoneNumber).

---

## Cinematic Password Unlock

Protect the surprise with a frosted-glass passcode screen:

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_PASSWORD_REQUIRED` | boolean | `false` | Force enables the password lock page. |
| `VITE_PASSWORD` | string | `""` | Manual password override (case-insensitive). |
| `VITE_PASSWORD_HINT` | string | `""` | Custom hint message. Without it, a dynamic hint based on format is shown. |
| `VITE_PASSWORD_FORMAT` | enum | `MMDD` | Format to generate password from `VITE_BIRTHDAY_DATE` when `VITE_PASSWORD` is not set. |

**Supported formats**:
- `MMDD` (default) — e.g., `0424` for April 24th
- `DDMM` — e.g., `2404`
- `YYYYMMDD` — e.g., `20010424`
- `YYYY-MM-DD` — e.g., `2001-04-24`
- `MM-DD` — e.g., `04-24`
- `DD-MM` — e.g., `24-04`
- `YYYY` — e.g., `2001`

**Password resolution** (`getEffectivePassword` in `src/utils/password.ts`):
1. If `VITE_PASSWORD` is set and non-empty, use it
2. If `VITE_BIRTHDAY_DATE` is set, generate password per format
3. If neither, fall back to raw `import.meta.env.VITE_BIRTHDAY_DATE`

---

## Debug and Integrations

| Variable | Type | Purpose |
|---|---|---|
| `VITE_DEBUG` | `reserved` | Reserved for future debug logging support; not currently parsed. |
| `VITE_ANALYTICS_ID` | `reserved` | Optional | Reserved for future analytics integration; not currently parsed. |

---

## Interactive Quiz System

The quiz automatically adapts based on env configuration:

- `VITE_BIRTHDAY_INTERESTS`: Adds questions about the person's hobbies.
- `VITE_FAVORITE_ITEMS`: Alias for interests.
- `VITE_BIRTHDAY_RELATIONSHIP`: Adds emotional or funny questions about your bond.
- `VITE_BIRTHDAY_GENDER`: Adjusts pronoun usage.

Example:
```env
VITE_BIRTHDAY_INTERESTS=coding,cars,music
VITE_BIRTHDAY_RELATIONSHIP=partner
```

Result: the quiz asks about coding habits, car preferences, favorite music, and relationship-themed questions.

---

## Interactive Cake Cutting Engine

The cake system in `src/components/birthday/CakeCutting.tsx` includes:

- **Personalized Name Plaque**: The recipient's name auto-renders on a premium frosting plaque.
- **Procedural Textures**: Grain and drip effects for a realistic bakery look.
- **Kinetic Splitting**: The cake splits with physics-based cut sparks and 3D depth filters.
- **Auto-Scroll Interaction**: Smooth-scrolls the "Blow & Cut" UI into view on mobile.

Customize cake options by editing the `CAKE_OPTIONS` array in `src/components/birthday/CakeCutting.tsx` — update `name`, `flavorColor`, and `description`.

Four default designs: Chocolate, Strawberry, Royal Velvet, Floral Garden.

---

## Kinetic Storytelling (Cinematic Intro)

The intro scene's narrative script lives in `src/components/birthday/CinematicIntro.tsx`. Customize storylines per relationship:

```typescript
// Custom storylines for a friend
const friendLines = [
  "They say legends aren't born every day...",
  "But on this day, one definitely was.",
  "Ready for the epicness?"
];

// Custom storylines for a partner
const romanticLines = [
  "In a world of billions...",
  "My eyes always find you.",
  "Today is about our favorite person."
];
```

---

## Performance & Mobile Optimization

The engine auto-detects mobile devices and applies these adjustments:

- **Reduced animation intensity** — confetti, spark effects, and glow effects are quieter.
- **Photo gallery tilt disabled** — smoother scrolling on touch devices.
- **Cake cutting interactions** — tuned for responsive touch.
- **Lower particle counts** — mobile gets 10-15 vs desktop 25-60.
- **Simplified hover states** — no persistent hover effects.

### Build Optimization

```bash
# Always test production build locally
npm run build
npm run preview

# Check bundle size
npm run build -- --analyze
```

**Production bundle sizes** (gzipped):
- Total: ~180-220KB
- JS: ~140-160KB
- CSS: ~20-30KB

**Performance targets** (Lighthouse):
- Performance: 90
- Accessibility: 95
- Best Practices: 90
- LCP: <2.5s | FID: <100ms | CLS: <0.1

---

## Situation Recipes

### Romantic Partner
```env
VITE_BIRTHDAY_NAME=Riya
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF4F8B
# Reserved for future theme hints; not currently parsed
# VITE_THEME=romantic
VITE_ANIMATION_SPEED=slow
VITE_BIRTHDAY_INTERESTS=music,coffee,travel
VITE_BIRTHDAY_CUSTOM_MESSAGE=You make ordinary days feel like magic.
```

### Best Friend
```env
VITE_BIRTHDAY_NAME=Alex
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00C2FF
# Reserved for future theme hints; not currently parsed
# VITE_THEME=fun
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=40
VITE_BIRTHDAY_INTERESTS=gaming,music,food
VITE_FAVORITE_EMOJIS=party,fire,star
```

### Sister
```env
VITE_BIRTHDAY_NAME=Priya
VITE_BIRTHDAY_RELATIONSHIP=sister
VITE_FAMILY_MEMBER_TYPE=sister
VITE_FAMILY_PREFERRED_NAME=Pri
VITE_FAMILY_RELATIONSHIP_LABEL=Younger Sister
VITE_FAMILY_CLOSENESS=10
VITE_BIRTHDAY_COLOR=#FF69B4
# Reserved for future theme hints; not currently parsed
# VITE_THEME=playful
```

### Father or Mother
```env
VITE_BIRTHDAY_NAME=Dad
VITE_BIRTHDAY_RELATIONSHIP=father
VITE_FAMILY_MEMBER_TYPE=father
VITE_FAMILY_RELATIONSHIP_LABEL=Father
VITE_BIRTHDAY_COLOR=#4A90E2
# Reserved for future theme hints; not currently parsed
# VITE_THEME=elegant
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=large
VITE_ANIMATION_INTENSITY=medium
```

### Grandparent or Low Motion
```env
VITE_BIRTHDAY_NAME=Grandma
VITE_BIRTHDAY_RELATIONSHIP=grandmother
VITE_FAMILY_MEMBER_TYPE=grandmother
VITE_BIRTHDAY_COLOR=#D4AF37
# Reserved for future theme hints; not currently parsed
# VITE_THEME=elegant
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=large
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=true
VITE_ANIMATION_INTENSITY=low
VITE_PARTICLE_COUNT=8
```

### Media-Heavy Celebration
```env
VITE_PHOTOS=https://example.com/1.jpg|https://example.com/2.jpg|https://example.com/3.jpg|https://example.com/4.jpg
VITE_PHOTO_CAPTIONS=School days|The trip|Family dinner|Favorite smile
VITE_VIDEO_1=https://www.youtube.com/watch?v=example
VITE_FINAL_VIDEO_URL=https://example.com/finale.mp4
```

### Minimal Private Link
```env
VITE_BIRTHDAY_NAME=Sam
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_SHOW_QUIZ_SECTION=false
VITE_SHOW_GIFT_SECTION=false
VITE_SHOW_VIDEO_SECTION=false
VITE_SHOW_FINAL_SURPRISE=false
VITE_FAMILY_PRIVACY=private
```

### Romantic Girlfriend (Vercel)
```env
VITE_BIRTHDAY_NAME=Sarah
VITE_BIRTHDAY_AGE=26
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=My beautiful Sarah, thank you for being the love of my life.
# Reserved for future theme hints; not currently parsed
# VITE_THEME=romantic
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=moderate
VITE_PHOTO_1=https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800
VITE_SOUND_URL=https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3
VITE_FAVORITE_EMOJIS=loved,bouquet,rose,heart,gift,ribbon
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=normal
```

### Best Friend Party (Firebase)
```env
VITE_BIRTHDAY_NAME=Alex
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00FFFF
VITE_BIRTHDAY_CUSTOM_MESSAGE=Hey my bro! Another year older but still awesome.
# Reserved for future theme hints; not currently parsed
# VITE_THEME=fun
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=30
VITE_PHOTO_1=https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1507539803526-19b419cd3b5d?w=800
VITE_FAVORITE_EMOJIS=party,clink,fire,star,confetti,balloon
# Intro skip button is currently always shown; this env is reserved for future parsing
# VITE_SHOW_SKIP_BUTTON=true
```

### Mom's Birthday (Self-Hosted)
```env
VITE_BIRTHDAY_NAME=Mom
VITE_BIRTHDAY_AGE=58
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FFD700
VITE_BIRTHDAY_CUSTOM_MESSAGE=Dear Mom,\n\nThank you for all your love, care, and sacrifices.
# Reserved for future theme hints; not currently parsed
# VITE_THEME=elegant
VITE_ANIMATION_INTENSITY=medium
VITE_ANIMATION_SPEED=slow
VITE_PARTICLE_COUNT=15
VITE_PHOTO_1=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1507539803526-19b419cd3b5d?w=800
VITE_FAVORITE_EMOJIS=heart,family,rose,star,gift,ribbon
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=large
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=false
```

### Colleague Birthday (Mobile-Optimized)
```env
VITE_BIRTHDAY_NAME=John
VITE_BIRTHDAY_AGE=32
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=colleague
VITE_BIRTHDAY_COLOR=#0047AB
VITE_BIRTHDAY_CUSTOM_MESSAGE=Happy Birthday John! Wishing you success and happiness this year.
# Reserved for future theme hints; not currently parsed
# VITE_THEME=energetic
VITE_ANIMATION_INTENSITY=medium
VITE_ANIMATION_SPEED=moderate
VITE_PARTICLE_COUNT=12
VITE_FAVORITE_EMOJIS=party,confetti,star,rocket,briefcase,sparkle
# Intro skip button is currently always shown; this env is reserved for future parsing
# VITE_SHOW_SKIP_BUTTON=true
```

### Kid's Birthday (Accessible)
```env
VITE_BIRTHDAY_NAME=Emma
VITE_BIRTHDAY_AGE=8
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=Happy Birthday Emma! You are an amazing girl!
# Reserved for future theme hints; not currently parsed
# VITE_THEME=playful
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=20
VITE_FAVORITE_EMOJIS=balloon,party,confetti,unicorn,sparkle,star,rainbow,ribbon
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=large
```

### Brother's Birthday Bash
```env
VITE_BIRTHDAY_NAME=Raj
VITE_BIRTHDAY_AGE=30
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=brother
VITE_FAMILY_MEMBER_TYPE=brother
VITE_FAMILY_PREFERRED_NAME=Raj
VITE_FAMILY_RELATIONSHIP_LABEL=Older Brother
VITE_FAMILY_CLOSENESS=9
VITE_FAMILY_YEARS_KNOWN=30
VITE_BIRTHDAY_COLOR=#0047AB
# Reserved for future theme hints; not currently parsed
# VITE_THEME=energetic
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=35
VITE_BIRTHDAY_INTERESTS=coding,gaming,sport
```

### Super OP Full Experience
```env
VITE_BIRTHDAY_NAME=Nishant
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#FFD700
VITE_BIRTHDAY_INTERESTS=gaming,cars,music
VITE_BIRTHDAY_CUSTOM_MESSAGE=Stay Legendary, Bro!
VITE_BIRTHDAY_LETTER_TITLE=A Message for the Icon
VITE_FINAL_VIDEO_URL=https://www.youtube.com/embed/example
VITE_SPECIAL_MEMORIES=The LAN Party;url|Road Trip 2023;url
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_VIDEO_SECTION=true
VITE_PARTICLE_COUNT=60
VITE_ANIMATION_INTENSITY=high
```

### Partner Anniversary-Style
```env
VITE_BIRTHDAY_NAME=Ananya
VITE_BIRTHDAY_AGE=28
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#B76E79
# Reserved for future theme hints; not currently parsed
# VITE_THEME=romantic
VITE_ANIMATION_SPEED=slow
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=false
VITE_BIRTHDAY_INTERESTS=music,art,travel
VITE_BIRTHDAY_CUSTOM_MESSAGE=Every moment with you is a treasure.
VITE_BIRTHDAY_LETTER_TITLE=To My Forever Valentine
VITE_BIRTHDAY_LETTER_OVERRIDE=My Dearest Ananya,\n\nFrom the day we met, my world has been brighter...
VITE_BIRTHDAY_WISHER_NAME=Your Partner
VITE_SHOW_HEART_TREE_SECTION=true
VITE_ANIMATION_INTENSITY=medium
```

---

## Best Practices

### Environment Variables

**DO:**
- Use `.env.local` for local development (never commit it to git).
- Add variables in your hosting provider's dashboard for production.
- Validate all variables before deployment.
- Prefix all custom variables with `VITE_`.

**DON'T:**
- Store sensitive info (passwords, API keys, tokens) in `VITE_` variables — they ship to the browser.
- Commit `.env` or `.env.local` files to version control.
- Forget to add variables to hosting after deployment.

### Image Optimization

```
Recommended Image Sizes: 800x600px (or larger)
Formats: WebP (best compression), JPEG (universal fallback)
Services: Unsplash (free), Imgix (CDN), AWS S3 + CloudFront (self-hosted)
```

### Animation Tuning

**Mobile**:
```env
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=10-15
VITE_ANIMATION_SPEED=moderate
```

**Desktop**:
```env
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=25-60
VITE_ANIMATION_SPEED=fast
```

### Accessibility

```env
# Reserved for future accessibility support; currently not parsed
# VITE_TEXT_SIZE=large
# VITE_HIGH_CONTRAST=true
# VITE_REDUCED_MOTION=true
```

### Deployment Checklist

- [ ] Lighthouse score 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] All `VITE_` variables set in hosting dashboard
- [ ] Production build tested locally (`npm run build && npm run preview`)

---

## Deployment Notes

**Prerequisites**:
- Node.js >= 18.0.0
- npm >= 9.0.0

### Vercel
1. Push code to GitHub.
2. Import repo in Vercel.
3. Project Settings → Environment Variables — add every `VITE_` key from your `.env.local`.
4. Redeploy after changing values.

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Site configuration → Environment variables — add the same keys.
4. Trigger a fresh deploy.

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://my-birthday-bloom/
aws cloudfront create-invalidation --distribution-id E1234ABC --paths "/*"
```

### Docker
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BIRTHDAY_NAME=Guest
ARG VITE_BIRTHDAY_RELATIONSHIP=friend
ARG VITE_BIRTHDAY_COLOR=#FF6B6B
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=0 /app/dist ./dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080"]
```

```bash
docker build -t birthday-bloom \
  --build-arg VITE_BIRTHDAY_NAME=Guest \
  --build-arg VITE_BIRTHDAY_RELATIONSHIP=friend \
  --build-arg VITE_BIRTHDAY_COLOR=#FF6B6B \
  .
docker run -p 8080:8080 birthday-bloom
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Name did not change | Check spelling of `VITE_BIRTHDAY_NAME`, restart dev server or redeploy |
| Env works locally but not hosted | Add variables in hosting dashboard and rebuild |
| Photos do not load | Use direct image URLs (`.jpg`, `.png`, `.webp`) or CDN URLs |
| Too much motion | Set `VITE_ANIMATION_INTENSITY=low`, `VITE_PARTICLE_COUNT=8` (note: `VITE_REDUCED_MOTION` is reserved for future support) |
| Relationship mood looks wrong | Use a supported relationship value; `VITE_THEME` is reserved for future manual override |
| JSON family profile fails | Validate JSON — all keys and strings must be in double quotes |
| Blank screen | Check console (F12), verify `VITE_BIRTHDAY_NAME` is set, ensure `.env` is in root, restart dev server |
| Animations stutter on mobile | Set `VITE_ANIMATION_INTENSITY=low`, `VITE_PARTICLE_COUNT=5` (note: `VITE_REDUCED_MOTION` is reserved for future support) |
| Audio does not play | Verify `VITE_SOUND_URL` is valid HTTPS, CORS enabled on host, browser allows autoplay (click Start first) |
| Build error: "Cannot find module" | Run `rm -rf node_modules && npm install && npm run build` |
| Old version showing after deploy | Clear CDN cache — Vercel uses content hashes automatically |
| Animations lag | Lower `VITE_PARTICLE_COUNT`, set `VITE_ANIMATION_INTENSITY=low` |

---

## FAQ

**Q: Can I use this for non-birthday celebrations?**  
A: Yes — set `VITE_BIRTHDAY_RELATIONSHIP=custom` and customize the message.

**Q: What is the maximum image file size?**  
A: Recommended: < 500KB. Maximum: 5MB.

**Q: Can I add custom video content?**  
A: Yes — provide MP4/WebM URLs via `VITE_VIDEO_1`, `VITE_VIDEO_2`, `VITE_VIDEO_3`.

**Q: Is there a mobile version?**  
A: Yes — Birthday Bloom is fully responsive with mobile-specific optimizations.

**Q: Can I customize the emojis?**  
A: Yes — set `VITE_FAVORITE_EMOJIS` with comma-separated emoji keywords.

**Q: How do I add multiple recipients?**  
A: Deploy multiple instances with different env variable sets.

**Q: Is data saved to a backend?**  
A: No — it is fully client-side. No backend or database required.

**Q: Can I use custom fonts?**  
A: Yes — modify `index.css` and import custom font files.

**Q: What video formats are supported for memory videos?**  
A: YouTube URLs (watch, embed, short) and direct MP4/WebM files.

---

## Safety

All `VITE_` values are public in the browser bundle. Do not store actual passwords, tokens, private API keys, or personal secrets in environment variables. The password unlock is a cinematic feature, not a security boundary.

---

## Easter Eggs

- Click the cake 7 times for a MEGA SURPRISE.
- The gift code is generated from the recipient's relationship + interests.
- Emotional reactions shift based on gender and relationship settings.
- Hidden animation triggers across the experience.

---

## See Also

- [QUICK_START.md](../QUICK_START.md) — Quick start
- [docs/developer-guide.md](./developer-guide.md) — Adding new env variables
- [docs/family-system.md](./family-system.md) — Family profile configuration
- [docs/template-architecture.md](./template-architecture.md) — Template system
- [docs/troubleshooting.md](./troubleshooting.md) — Troubleshooting guide
- [docs/deployment.md](./deployment.md) — Deployment guide
- [docs/configuration-examples.md](./configuration-examples.md) — Pre-built configs
- [src/features/core/store/useBirthdayStore.ts](../src/features/core/store/useBirthdayStore.ts) — Env parsing logic
- [src/config/birthday.ts](../src/config/birthday.ts) — Audio defaults and fallback config
- [src/utils/password.ts](../src/utils/password.ts) — Password generation logic
- [src/components/birthday/CinematicIntro.tsx](../src/components/birthday/CinematicIntro.tsx) — Intro script customization
- [src/components/birthday/CakeCutting.tsx](../src/components/birthday/CakeCutting.tsx) — Cake options customization
- [src/features/core/models/familyTemplates.ts](../src/features/core/models/familyTemplates.ts) — Family profile factory functions
- [src/features/core/models/dataModels.ts](../src/features/core/models/dataModels.ts) — ConfigValidator and DataValidator
