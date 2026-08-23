---
tags: [quickstart, setup, tutorial, localization]
aliases: [quick-start, quickstart]
---

# Quick Start

[[DOCUMENTATION_INDEX|Back to Home]] | [[ENV_GUIDE|Env Customization Guide]] | [[setup-french|French Setup Guide]] | [[setup-hindi|Hindi Setup Guide]] | [[setup-bengali|Bengali Setup Guide]] | [[deployment|Deployment Guide]]

Get Birthday Bloom running locally in 5 minutes with zero code changes required.

---

## Prerequisites

- Node.js 18+ ([.nvmrc](../.nvmrc): 20)
- npm 9+
- Git (latest)

Verify your environment:

```bash
node -v
npm -v
git --version
```

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom

# 2. Install dependencies
npm install

# 3. Copy the env template
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or `http://localhost:5000`).

**PowerShell users**:
```powershell
npm.cmd run dev
```

### Creating Your First Bloom

At minimum, set the recipient's name, relationship, and theme color in `.env.local`:

```env
VITE_BIRTHDAY_NAME="Naboraj"
VITE_BIRTHDAY_RELATIONSHIP="friend"
VITE_BIRTHDAY_COLOR="#FF6B6B"
```

Supported relationship templates include:

```
partner, friend, brother, sister, father, mother, grandfather, grandmother,
uncle, aunt, cousin, son, daughter, guardian, colleague, mentor, family, custom
```

> Most customizations can be completed without editing source code.
> Check [[ENV_GUIDE|ENV_GUIDE.md]] before modifying components.

---

## 🌍 Multi-Language Localization Setup

Birthday Bloom natively supports **English (default)**, **French (Français)**, **Hindi (हिन्दी)**, and **Bengali (বাংলা)**. Switch languages instantly via `VITE_LANGUAGE` (or `VITE_LANG`):

```env
# English (Default)
VITE_LANGUAGE=en

# French (Français) - Accepts 'fr', 'french', 'francais'
VITE_LANGUAGE=fr

# Hindi (हिन्दी) - Accepts 'hi', 'hindi', 'in'
VITE_LANGUAGE=hi

# Bengali (বাংলা) - Accepts 'bn', 'bengali', 'bangla'
VITE_LANGUAGE=bn
```

For complete localized setup guides:
- 🇫🇷 **French Guide**: See [[setup-french|setup-french.md]] for French emotional letters, quotes, cake names, and recipes.
- 🇮🇳 **Hindi Guide**: See [[setup-hindi|setup-hindi.md]] for Devanagari typography, cultural nuances, and Hindi templates.
- 🇧🇩 **Bengali Guide**: See [[setup-bengali|setup-bengali.md]] for Bengali script typography, cultural nuance, and Bengali templates.

---

## Personalize It

Edit `.env.local` with your own values. Here are real-world examples:

### Sample .env.local for a Partner (English)

```env
VITE_LANGUAGE=en
VITE_BIRTHDAY_NAME=Riya
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=You make every moment magical.
VITE_BIRTHDAY_WISHER_NAME=Your Love
VITE_BIRTHDAY_INTERESTS=photography,travel,music
VITE_PHOTO_1=https://example.com/photo1.jpg
VITE_PHOTO_2=https://example.com/photo2.jpg
VITE_BGM_URL=https://example.com/song.mp3
```

### Sample .env.local for a Sibling (Hindi)

```env
VITE_LANGUAGE=hi
VITE_BIRTHDAY_NAME=राज
VITE_BIRTHDAY_AGE=22
VITE_BIRTHDAY_RELATIONSHIP=brother
VITE_BIRTHDAY_COLOR=#0047AB
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_DATE=2004-03-15
VITE_BIRTHDAY_CUSTOM_MESSAGE=जन्मदिन की बहुत-बहुत बधाई भाई! हमेशा चमकते रहो।
VITE_BIRTHDAY_WISHER_NAME=दीदी
VITE_ANIMATION_INTENSITY=high
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_VIDEO_SECTION=true
```

### Sample .env.local for a Friend (Bengali)

```env
VITE_LANGUAGE=bn
VITE_BIRTHDAY_NAME=সৌরভ
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00C2FF
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_DATE=2002-08-10
VITE_BIRTHDAY_CUSTOM_MESSAGE=শুভ জন্মদিন দোস্ত! জীবনে অনেক উন্নতি কর আর সবসময় এমন হাসি-খুশি থাকিস।
VITE_BIRTHDAY_WISHER_NAME=অনির্বাণ
VITE_ANIMATION_INTENSITY=high
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_PHOTO_SECTION=true
```

### Core Configuration Options

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_BIRTHDAY_NAME` | string | `""` | Birthday person's name (setting this skips wizard) |
| `VITE_LANGUAGE` / `VITE_LANG` | enum | `"en"` | Language localization (`en`, `hi`, `bn`). See [[setup-hindi]] & [[setup-bengali]]. |
| `VITE_BIRTHDAY_RELATIONSHIP` | enum | `"friend"` | Relationship type (`partner`, `friend`, `brother`, `sister`, `father`, etc.) |
| `VITE_BIRTHDAY_COLOR` | hex | `"#FF6B6B"` | Primary theme color accent |
| `VITE_BIRTHDAY_GENDER` | enum | `"other"` | Gender for personalized pronouns and letters (`male`, `female`, `other`) |
| `VITE_BIRTHDAY_AGE` | number | `null` | Age for age-specific storytelling and cards |
| `VITE_BIRTHDAY_DATE` | ISO date | `null` | Date of birth (format: `YYYY-MM-DD`) |
| `VITE_BIRTHDAY_INTERESTS` | csv | `""` | Comma-separated interests (`coding,music,travel,gaming`) |
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | string | `""` | Custom birthday message before cake cutting |
| `VITE_BIRTHDAY_WISHER_NAME` | string | `""` | Name of the message sender for letter signoff |
| `VITE_PHOTO_1`..`VITE_PHOTO_6` | URL | `""` | Photo gallery images (or pipe-separated `VITE_PHOTOS`) |
| `VITE_VIDEO_1`..`VITE_VIDEO_3` | URL | `""` | Video gallery links |
| `VITE_BGM_URL` / `VITE_SOUND_URL` | URL | `""` | Background audio music |
| `VITE_SOUND_EFFECTS` | boolean | `true` | Enable interactive sound effects |
| `VITE_ANIMATION_INTENSITY` | enum | `"high"` | Animation particle intensity (`low`, `medium`, `high`) |
| `VITE_FINAL_VIDEO_URL` | URL | `""` | Final surprise video URL |
| `VITE_PASSWORD_REQUIRED` | boolean | `false` | Enable passcode lock screen |
| `VITE_PASSWORD` | string | `""` | Manual password override |
| `VITE_PASSWORD_HINT` | string | `""` | Custom password hint |
| `VITE_PASSWORD_FORMAT` | enum | `"MMDD"` | Auto-generated password format from date |

For the complete reference of all 40+ variables, see [[ENV_GUIDE|ENV_GUIDE.md]].

> **Dev Note:** Restart the development server (`npm run dev`) after modifying `.env.local` for changes to take full effect.

---

## 👨‍👩‍👧‍👦 Family Templates

Birthday Bloom includes dedicated templates for specific family members. Activate them via environment variables:

```env
VITE_BIRTHDAY_RELATIONSHIP=sister
VITE_FAMILY_MEMBER_TYPE=sister
VITE_FAMILY_PREFERRED_NAME=Pri
VITE_FAMILY_CLOSENESS=10
```

The family system provides comprehensive personality, interests, memories, and tailored narrative arcs. For the full reference, see [[family-system|family-system.md]].

---

## 🔍 Verify It Works

1. The splash screen appears with "A Special Surprise Awaits..." (or localized equivalent).
2. Tap anywhere -- the cinematic intro begins.
3. The intro flows through storytelling -> fake chat -> reveal sequence.
4. The main dashboard renders with hero, interest icons, message card, wishes, and sections.
5. All content reflects your env values (name, color, language, relationship tone).
6. Interactive cake cutting, fireworks, audio, and memory gallery all load.
7. The final surprise video plays at the end (if configured).

### Pre-Launch Checklist

- [ ] Application builds successfully (`npm run build`)
- [ ] No console errors
- [ ] Language correctly configured (`en`, `hi`, or `bn`)
- [ ] Photos load correctly
- [ ] Videos play correctly
- [ ] Mobile and desktop layout tested
- [ ] Environment variables verified in `.env.local`
- [ ] Audio playback tested
- [ ] Relationship template verified

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder is ready to deploy to any static hosting (Vercel, Netlify, AWS S3, Docker). See the [[deployment|Deployment Guide]] for platform-specific instructions.

---

## 🧪 Test & Lint

```bash
# Unit test suite
npm run test

# Type checking
npx tsc --noEmit

# ESLint validation
npm run lint
```

---

## 🛠️ Troubleshooting

### Blank Screen
Check browser console (F12). Verify `VITE_BIRTHDAY_NAME` is set and `.env.local` exists in the project root. Restart the dev server (`npm run dev`).

### Environment Changes Not Updating
You must restart the dev server after modifying `.env.local`.

### Animations Stutter
Reduce animation intensity:
```env
VITE_ANIMATION_INTENSITY="low"
```

### Indic Characters Splitting or Broken Matras
Ensure `VITE_LANGUAGE` is set to `hi` or `bn`. Our typography engine automatically applies font loading and CSS shirorekha protections for Hindi and Bengali.

### Photos Not Loading
Verify URLs are public and accessible. Test with simple Unsplash URLs first. Keep images under 500 KB for rapid mobile loading.

### No Sound / Audio Does Not Play
Modern browsers block autoplay until user interaction. Click anywhere on the Splash Screen to trigger playback. Verify `VITE_BGM_URL` is a valid direct audio URL.

For more help, see the full [[troubleshooting|Troubleshooting Guide]].

---

## 📚 What's Next

| Guide | What It Covers |
|---|---|
| [[ENV_GUIDE|ENV_GUIDE.md]] | All 40+ configuration options and situation recipes |
| [[setup-hindi|setup-hindi.md]] | Dedicated Hindi (हिन्दी) localization and Devanagari guide |
| [[setup-bengali|setup-bengali.md]] | Dedicated Bengali (বাংলা) localization and script guide |
| [[deployment|Deployment Guide]] | Deploy to Vercel, Netlify, AWS, Docker |
| [[family-system|Family System]] | Brother, Sister, and custom family templates |
| [[architecture|architecture.md]] | Codebase overview and state machine structure |
| [[architecture-env|architecture-env.md]] | Environment variable lifecycle & Zustand store hydration |
| [[developer-guide|Developer Guide]] | Component reference, API, and extension |
| [[troubleshooting|Troubleshooting Guide]] | Common issues and solutions |
| [[faq|faq.md]] | Frequently asked questions |
| [[DOCUMENTATION_INDEX|Documentation Index]] | Complete documentation index and cross-references |

---

#obsidian #documentation #birthday-bloom #vault #quickstart #localization