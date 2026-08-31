# Complete Env Customization Guide — Birthday Bloom v3.3

Birthday Bloom is **env-first and URL-first**. Names, relationship types, messages, colors, photos, captions, videos, audio, visible sections, animation behavior, accessibility, and family-template metadata are all controlled through environment variables or instant URL query parameters without editing React source files.

**Important**: "Env" means environment variables. Locally, these live in `.env.local` or `.env`. On hosting platforms, they live in your provider's Environment Variables dashboard (Vercel, Netlify, AWS Amplify, Docker, etc.).

---

## How Configuration & URL Resolution Works

Vite exposes client-accessible variables prefixed with `VITE_`. Dynamic URL query parameters evaluated in `src/features/core/store/urlParams.ts` can override static build environment variables in real time.

**Precedence Hierarchy**:
1. **URL Query Parameters** (e.g. `?name=Aria&rel=partner&color=%23FF1493`)
2. **Host Environment Variables** (production hosting dashboard: Vercel, Netlify)
3. **Local `.env.local` / `.env` values** (local development server)
4. **Built-in Static Fallbacks** in `useBirthdayStore.ts` and `src/config/birthday.ts`

After editing `.env.local`, **restart the dev server**:
```bash
npm run dev      # macOS/Linux
npm.cmd run dev  # PowerShell
```

**All `VITE_` values are public in the client bundle.** Do not store sensitive database passwords, private API keys, or server secrets in `VITE_` variables.

---

## Master Environment Variables Reference (All 53 Variables & Aliases)

| Category | Primary Variable | Aliases / Accepted Forms | Type & Options | Default | Description |
|---|---|---|---|---|---|
| **Identity** | `VITE_BIRTHDAY_NAME` | `VITE_USER_NAME` | string | `""` | Primary celebrant name. Personalizes titles, cards, plaques, and narrative scenes. |
| **Identity** | `VITE_BIRTHDAY_AGE` | — | number | `null` | Celebrant age. Influences "Happy Nth Birthday" headings and wishes. |
| **Identity** | `VITE_BIRTHDAY_GENDER` | — | `female` \| `male` \| `other` | `other` | Gender archetype for pronouns, tone nuances, and subtle theme shifts. |
| **Identity** | `VITE_BIRTHDAY_DATE` | — | ISO date string (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss`) | `null` | Birthday timestamp. Used for passcode generation and age calculations. |
| **Identity** | `VITE_BIRTHDAY_RELATIONSHIP` | `love`, `bestie`, `mom`, `dad`, `grandpa`, `grandma`, `work`, `teacher` | `partner` \| `friend` \| `family` \| `brother` \| `sister` \| `father` \| `mother` \| `grandfather` \| `grandmother` \| `uncle` \| `aunt` \| `cousin` \| `son` \| `daughter` \| `guardian` \| `sibling` \| `colleague` \| `mentor` \| `custom` | `friend` | Emotional relationship archetype controlling tone, letters, quiz questions, and default pacing. |
| **Identity** | `VITE_BIRTHDAY_WISHER_NAME` | `VITE_WISHER_NAME` | string | `""` | Name of the person giving the wish (used in letters, cards, and dynamic footer signoff). |
| **Localization** | `VITE_LANGUAGE` | `VITE_LANG`, `french`, `francais`, `hindi`, `bengali`, `bangla` | `en` \| `bn` \| `hi` \| `fr` | `en` | Multi-language localization engine switch (English, Bengali, Hindi, French). |
| **Aesthetics** | `VITE_BIRTHDAY_COLOR` | `VITE_THEME_COLOR`, `VITE_FAVORITE_COLOR` | hex string (e.g. `#FF6B6B`) | `#FF6B6B` | Primary theme accent color. Automatically computes HSL CSS variable tokens for `:root`. |
| **Aesthetics** | `VITE_BIRTHDAY_INTERESTS` | `VITE_FAVORITE_ITEMS` | CSV string / list | `""` | Interests list (`car`, `music`, `art`, `coding`, `gaming`, `nature`, `travel`, `food`, `sport`, `space`). Generates hero badges and quiz questions. |
| **Aesthetics** | `VITE_FAVORITE_EMOJIS` | `VITE_BIRTHDAY_EMOJIS` | CSV / pipe string | `""` | Custom emoji set for particle trails, interactive click bursts, and floating effects. |
| **Storytelling** | `VITE_BIRTHDAY_CUSTOM_MESSAGE` | `VITE_CUSTOM_MESSAGE` | string | `""` | Custom message displayed in message cards and letter overlays. |
| **Storytelling** | `VITE_BIRTHDAY_LETTER_TITLE` | `VITE_CARD_TITLE_SURPRISE` | string | `"A Special Letter Just for You 💌"` | Heading title for emotional letter modal. |
| **Storytelling** | `VITE_BIRTHDAY_LETTER_OVERRIDE` | — | escaped string (with `\n`) | `""` | Full custom letter body overriding template letters. |
| **Storytelling** | `VITE_SPECIAL_MEMORIES` | — | pipe/semicolon string (`title;url\|title;url`) | `""` | Special memory items rendered in the finale surprise grid. |
| **Media** | `VITE_PHOTOS` | — | CSV / pipe / JSON array | `""` | List of photo URLs. When empty, falls back to `VITE_PHOTO_1..6` or automatic localized placeholder. |
| **Media** | `VITE_PHOTO_1`..`VITE_PHOTO_6` | — | URL strings | `""` | Numbered photo URLs for gallery display. |
| **Media** | `VITE_PHOTO_CAPTIONS` | — | CSV / pipe / JSON array | `""` | Captions mapped to gallery photos. |
| **Media** | `VITE_VIDEO_1`..`VITE_VIDEO_3` | — | URL strings (YouTube, Vimeo, MP4) | `""` | Video memories for video carousel. |
| **Media** | `VITE_FINAL_VIDEO_URL` | — | URL string | `""` | Grand finale closing video embed. |
| **Audio** | `VITE_BGM_URL` | `VITE_SOUND_URL` | URL string (MP3, OGG, AAC) | Built-in ambient track | Background music soundtrack. Handled by `SoundManager.tsx`. |
| **Audio** | `VITE_SOUND_EFFECTS` | — | boolean (`true` \| `false`) | `true` | Enables or disables interactive UI sound effects (pops, chimes, typewriter, fireworks). |
| **Sections** | `VITE_SHOW_CAKE_SECTION` | — | boolean (`true` \| `false`) | `true` | Toggle 3D WebGL cake cutting and candle blowout scene. |
| **Sections** | `VITE_SHOW_PHOTO_SECTION` | `VITE_SHOW_PHOTOS_SECTION` | boolean (`true` \| `false`) | `true` | Toggle Polaroid-style memory gallery section. |
| **Sections** | `VITE_SHOW_QUIZ_SECTION` | — | boolean (`true` \| `false`) | `true` | Toggle personalized trivia quiz section. |
| **Sections** | `VITE_SHOW_HEART_TREE_SECTION` | — | boolean (`true` \| `false`) | `true` | Toggle blossoming SVG HeartTree animation. |
| **Sections** | `VITE_SHOW_VIDEO_SECTION` | — | boolean (`true` \| `false`) | `true` | Toggle video memories section. |
| **Sections** | `VITE_SHOW_FINAL_SURPRISE` | — | boolean (`true` \| `false`) | `true` | Toggle grand finale gift & confetti burst screen. |
| **Sections** | `VITE_SHOW_GIFT_SECTION` | — | boolean (`true` \| `false`) | `true` | Toggle gift box reveal modal. |
| **Sections** | `VITE_SHOW_SKIP_BUTTON` | — | boolean (`true` \| `false`) | `true` | Toggle skip intro button during splash and cinematic intro. |
| **Animation** | `VITE_ANIMATION_SPEED` | — | `slow` \| `moderate` \| `fast` | Pacing by relationship | Narrative storytelling pacing and text progression speed. |
| **Animation** | `VITE_ANIMATION_INTENSITY` | — | `low` \| `medium` \| `high` | `high` | Particle and effect density. |
| **Animation** | `VITE_PARTICLE_COUNT` | — | number (e.g. `25`) | `25` | Base particle count for ambient background canvases. |
| **Accessibility** | `VITE_REDUCED_MOTION` | — | boolean (`true` \| `false`) | `false` | **Active runtime option**: Enforces reduced motion in `useBirthdayStore.ts` and `CakeCutting.tsx`, disabling complex spring physics, 3D tilts, and intensive particle bursts. |
| **Security** | `VITE_PASSWORD_REQUIRED` | — | boolean (`true` \| `false`) | `false` | Force enables passcode challenge before unlocking celebration. |
| **Security** | `VITE_PASSWORD` | — | string | `""` | Manual passcode string override (case-insensitive). |
| **Security** | `VITE_PASSWORD_HINT` | — | string | `""` | Custom hint message displayed on passcode screen. |
| **Security** | `VITE_PASSWORD_FORMAT` | — | `MMDD` \| `DDMM` \| `YYYYMMDD` \| `YYYY-MM-DD` \| `MM-DD` \| `DD-MM` \| `YYYY` | `MMDD` | Format rule to auto-derive passcode from `VITE_BIRTHDAY_DATE` when `VITE_PASSWORD` is unset. |
| **Family** | `VITE_FAMILY_MEMBER_TYPE` | — | `brother` \| `sister` \| `father` \| `mother` \| `grandfather` \| `grandmother` \| `uncle` \| `aunt` \| `cousin` \| `son` \| `daughter` \| `guardian` \| `friend` \| `custom` | `friend` | Selects specialized family profile template archetype. |
| **Family** | `VITE_FAMILY_PREFERRED_NAME` | — | string | `""` | Affectionate nickname override. |
| **Family** | `VITE_FAMILY_NICKNAMES` | — | CSV string | `""` | Comma-separated list of family nicknames. |
| **Family** | `VITE_FAMILY_RELATIONSHIP_LABEL` | — | string | `""` | Custom badge label (e.g., "Favorite Chachu", "Best Big Bro"). |
| **Family** | `VITE_FAMILY_CLOSENESS` | — | number (1–10) | `7` | Closeness rating scale. |
| **Family** | `VITE_FAMILY_YEARS_KNOWN` | — | number | `null` | Number of years of shared memories. |
| **Family** | `VITE_FAMILY_SIDE` | — | `maternal` \| `paternal` \| `both` \| `chosen` \| `unknown` | `undefined` | Family lineage branch. |
| **Family** | `VITE_FAMILY_PRIVACY` | — | `public` \| `family` \| `private` | `family` | Content privacy rating. |
| **Family** | `VITE_FAMILY_ALLOW_EXPORT` | — | boolean (`true` \| `false`) | `true` | Toggle memory card export and download. |
| **Family** | `VITE_FAMILY_PROFILE_JSON` | — | JSON string | `null` | Advanced: Complete JSON string representing a `FamilyMemberProfile`. Overrides individual fields. |

---

## Multi-Language Localization (i18n)

Birthday Bloom supports four authentic language engines:

```env
# English (Default)
VITE_LANGUAGE=en

# Bengali / বাংলা (Eastern Nagari typography & cultural letter structures)
VITE_LANGUAGE=bn

# Hindi / हिन्दी (Devanagari typography & respectful honorifics)
VITE_LANGUAGE=hi

# French / Français (European typography & poetic phrasing)
VITE_LANGUAGE=fr
```

---

## Situation Recipes

### 1. Romantic Partner (English)
```env
VITE_LANGUAGE=en
VITE_BIRTHDAY_NAME=Sophia
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF4F8B
VITE_ANIMATION_SPEED=slow
VITE_BIRTHDAY_INTERESTS=music,coffee,travel
VITE_BIRTHDAY_CUSTOM_MESSAGE=You make every ordinary moment feel extraordinary.
VITE_BIRTHDAY_WISHER_NAME=Alex
```

### 2. Best Friend (English)
```env
VITE_LANGUAGE=en
VITE_BIRTHDAY_NAME=David
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00C2FF
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=35
VITE_BIRTHDAY_INTERESTS=gaming,music,food
VITE_FAVORITE_EMOJIS=🎉,🔥,⭐,🚀,🍕
VITE_BIRTHDAY_WISHER_NAME=Chris
```

### 3. Hindi Celebration (हिन्दी)
```env
VITE_LANGUAGE=hi
VITE_BIRTHDAY_NAME=राहुल
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#FF6B6B
VITE_BIRTHDAY_INTERESTS=coding,gaming,music
VITE_BIRTHDAY_CUSTOM_MESSAGE=जन्मदिन की हार्दिक शुभकामनाएं मेरे भाई! हमेशा मुस्कुराते रहो।
VITE_BIRTHDAY_WISHER_NAME=अमित
```

### 4. Bengali Celebration (বাংলা)
```env
VITE_LANGUAGE=bn
VITE_BIRTHDAY_NAME=সৌরভ
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00C2FF
VITE_BIRTHDAY_INTERESTS=coding,music,photography
VITE_BIRTHDAY_CUSTOM_MESSAGE=শুভ জন্মদিন দোস্ত! তোর জীবনের প্রতিটি দিন যেন আনন্দে ভরে ওঠে।
VITE_BIRTHDAY_WISHER_NAME=অনির্বাণ
```

### 5. French Celebration (Français)
```env
VITE_LANGUAGE=fr
VITE_BIRTHDAY_NAME=Camille
VITE_BIRTHDAY_AGE=26
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#E11D48
VITE_ANIMATION_SPEED=slow
VITE_BIRTHDAY_CUSTOM_MESSAGE=Joyeux anniversaire mon amour ! Que cette journée soit aussi belle que toi.
VITE_BIRTHDAY_WISHER_NAME=Antoine
```

### 6. Accessibility & Reduced Motion Mode
```env
VITE_BIRTHDAY_NAME=Grandma
VITE_BIRTHDAY_RELATIONSHIP=grandmother
VITE_FAMILY_MEMBER_TYPE=grandmother
VITE_BIRTHDAY_COLOR=#D4AF37
VITE_REDUCED_MOTION=true
VITE_ANIMATION_INTENSITY=low
VITE_PARTICLE_COUNT=10
```

---

## Production Deployment

1. **Set Environment Variables**: Add all required `VITE_*` keys in your hosting provider's dashboard.
2. **Verify Media URLs**: Ensure audio and image URLs use secure HTTPS.
3. **Build & Test**: Run `npm run build` and `npm test` to confirm quality gates pass.
