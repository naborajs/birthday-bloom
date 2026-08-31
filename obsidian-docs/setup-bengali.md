---
tags: [localization, bengali, bangla, i18n, setup, indic]
aliases: [setup-bengali, bengali-setup, bangla-guide]
---

# 🌍 Multi-Language Localization Guide: Bengali (বাংলা) Setup

[[DOCUMENTATION_INDEX|Back to Home]] | [[quick-start|Quick Start]] | [[setup-hindi|Hindi Setup]] | [[ENV_GUIDE|Env Customization Guide]] | [[architecture-env|Env Architecture]]

Birthday Bloom features complete **Bengali (বাংলা) Multi-Language Localization** with rich emotional depth, authentic cultural resonance, respectful Indic honorifics, and automated layout-safe text adaptations across every page and component.

---

## 🚀 Quick Setup (Enable Bengali)

To switch the entire website to Bengali, set `VITE_LANGUAGE` (or `VITE_LANG`) in your `.env.local` or hosting provider environment settings:

```env
VITE_LANGUAGE=bn
```

### Accepted Language Aliases
The reactive Zustand store and i18n dispatcher automatically normalize the following aliases to Bengali:
- `bn`
- `bengali`
- `bangla`

*(Case-insensitive and trimmed automatically)*

### ⚡ Instant URL Testing (Zero Setup)

Test the Bengali celebration experience immediately in your browser:
👉 [https://birthday-bloom.vercel.app/?name=অনিন্দিতা&rel=partner&lang=bn&color=%23FF2A6D&sender=নবরায়](https://birthday-bloom.vercel.app/?name=অনিন্দিতা&rel=partner&lang=bn&color=%23FF2A6D&sender=নবরায়)

---

### Switching Between Locales
```env
# Switch to Bengali
VITE_LANGUAGE=bn

# Switch to Hindi
VITE_LANGUAGE=hi

# Switch to French
VITE_LANGUAGE=fr

# Switch to English (default)
VITE_LANGUAGE=en
```

> **Fallback Guarantee**: If `VITE_LANGUAGE` is omitted, misspelled, or set to an invalid locale, the application safely falls back to English (`en`) without throwing runtime exceptions or breaking key lookups.

---

## 🔤 Indic Typography & Grapheme Clusters

Bengali text features complex conjuncts (যুক্তাক্ষর, e.g. `ক্ষ`, `জ্ঞ`, `হ্ন`) and vowel matras (হ্রস্ব-ই কার, দীর্ঘ-ঈ কার).
- **Grapheme Segmenter**: The `TypeWriter.tsx` component utilizes `Intl.Segmenter` to advance typing by grapheme clusters rather than raw UTF-16 code units, preventing detached matras or broken conjunct characters.
- **Font Stack**: Backed by `Noto Sans Bengali` and `Hind Siliguri` for clean rendering across Windows, macOS, Android, and iOS.

---

## 📦 What Changes in Bengali Mode?

When `VITE_LANGUAGE=bn` is active, the entire experience adapts to native Bengali:

### 1. Splash & Welcome Screen (`SplashScreen.tsx`)
- Tap prompt: *"যাত্রা শুরু করতে যেকোনো জায়গায় স্পর্শ করুন ✨"*
- Headline: *"জন্মদিনের এক অপূর্ব ও জাদুকরী উপহার"*
- Subtext and start buttons adapt dynamically to create an emotionally captivating entrance.

### 2. Password Unlock Screen (`PasswordUnlock.tsx`)
- Unlock Header: *"পাসকোড দিয়ে আনলক করুন 🔐"*
- Subtext: *"এক জাদুকরী ও ভালোবাসায় ভরা জন্মদিনের উপহার..."*
- Dynamic Date Hint: Automatically translates format hints to Bengali (e.g. `MMDD` $\rightarrow$ *"ইঙ্গিত: আজকের বিশেষ তারিখ (ফরম্যাট: MMDD, যেমন ২৪শে এপ্রিলের জন্য 0424) 📅"*).
- Form Validation & Security:
  - Input Placeholder: *"গোপন পাসকোড লিখুন"*
  - Error Notification: *"ভুল পাসকোড! অনুগ্রহ করে আবার চেষ্টা করুন ✨"*
  - Unlock CTA Button: *"জাদু উন্মোচন করুন ✨"*

### 3. Cinematic Storytelling & Fake Chat (`CinematicIntro.tsx`, `FakeChatScene.tsx`)
- **Storylines**: Dynamically selects culturally authentic Bengali poetic lines tailored to the recipient's relationship (`partner`, `friend`, `family`, `sibling`, etc.).
- **Fake Chat Simulation**:
  - Simulates active Bengali typing and backspacing:
    - Partner: *"আমার মনের রাজপুত্রের / রাজকন্যার জন্য..."*
    - Friend: *"দাঁড়াও, এত সাধারণ মেসেজ? এটা আমরা নই! 😂"*
    - Family: *"আমাদের পরিবারের নয়নমণি এবং সবচেয়ে বড় আনন্দ..."*
- **Reveal Sequence**:
  - Dramatic title reveal: *"এটি শুধুমাত্র আপনার জন্য..."*
  - Big celebratory banner: *"শুভ জন্মদিন!"*

### 4. 3D Interactive Cake Cutting Ceremony (`CakeCutting.tsx`, `CakeTypes.ts`)
- **Preparation & Baking**:
  - Start CTA: *"কাটা শুরু করুন"*
  - Baking Screen: *"আপনার কেক তৈরি হচ্ছে..."*
  - Countdown: *"কেক কাটার জন্য প্রস্তুত হন..."*
- **Flavors**: Localized cake flavor names (*"রয়্যাল চকোলেট ডিলাইট"*, *"রসালো স্ট্রবেরি ক্রিম"*, *"ক্লাসিক ভ্যানিলা ড্রিম"*).
- **Interactive Blowing Mechanic**:
  - Instruction: *"✨ মনে মনে একটি সুন্দর ইচ্ছা পূরণ করে মোমবাতি নিভান ✨"*
  - Blow Button: *"🌬️ এখনই ফুঁ দিন"*
  - Confirmation: *"আপনার সুন্দর ইচ্ছাটি আকাশের তারার কাছে পৌঁছে গেছে ✨"*
- **Celebration Quotes**: Heartfelt, poetic celebration wishes in Bengali.

### 5. Emotional Letters & Big Wishes (`SuperPersonalizedLogic.ts`, `bengaliTemplates.ts`)
- **Nuanced Letter Generation**: Deeply personalized emotional letters generated via `BENGALI_EMOTIONAL_LETTERS` based on gender, relationship, and interests.
- **Letter Title**: *"আপনার জন্য একটি বিশেষ চিঠি 💌"*
- **Sender Signoff**: Cleanly handles sender name replacement for `[আপনার নাম]` / `[Your Name]` without duplicate or broken placeholders.
- **Big Wishes Cards**: High-impact Bengali celebration cards:
  - *"আপনার জন্য অফুরন্ত শুভকামনা ✨"*
  - *"আপনার সাফল্য আকাশ ছুঁয়ে যাক"*
  - Interest-specific cards for coding, gaming, music, art, cars, travel, and more.

### 6. Polaroid Photo Gallery & Video Memories (`PhotoGallery.tsx`, `VideoGallery.tsx`)
- **Gallery Title**: *"স্মৃতিসমূহ 📸"*
- **Localized Captions**:
  - Partner: *"আপনার সাথে কাটানো প্রতিটি মুহূর্ত এক অমূল্য উপহার 💖"*
  - Friend: *"সেরা বন্ধুর সাথে অবিস্মরণীয় মুহূর্তগুলো 🚀"*
  - Family: *"পরিবারের সেই অমলিন স্নেহ যা জীবনকে সুন্দর করে তোলে ✨"*
- **Video Memories Section**: *"বিশেষ ভিডিও স্মৃতি 🎬"* with full subtitle and title support.

### 7. Interactive Birthday Trivia Quiz (`BirthdayQuiz.tsx`)
- **Culturally Tailored Questions**: Relatable, funny, and culturally attuned trivia questions in Bengali.
- **Live Score Counters**: *"প্রশ্ন {{current}} / {{total}}"* and dynamic question tracking.
- **Results & Celebrations**:
  - High score: *"অসাধারণ স্কোর! 🏆"*
  - Replay CTA: *"আবার খেলুন 🔄"*

### 8. Growing Heart Tree (`HeartTree.tsx`)
- Clicking each interactive leaf reveals deep, poetic Bengali thoughts from `BENGALI_SPECIAL_QUOTES` and `BENGALI_HEART_MESSAGES`.
- Stage 4 completion text: *"ভালোবাসা ও স্মৃতির এই বৃক্ষ চিরকাল অমলিন থাকবে 🌸"*.

### 9. Final Surprise & Special Message (`FinalSurprise.tsx`, `SpecialMessage.tsx`)
- Memory cards, party hype badge (*"ধামাকা পার্টি মোড সক্রিয় 💥"*), secret codes, and final video reveal adapt to natural Bengali phrasing.

---

## 👨‍👩‍👧‍👦 Relationship & Family Tone Nuances in Bengali

In Bengali culture, familial affection (*স্নেহ, শ্রদ্ধা ও ভালোবাসা*) carries distinct linguistic nuances across relationships. Birthday Bloom localizes every tone authentically:

| Relationship / Family Type | Tone & Honorifics in Bengali | Key Cultural Phrasing |
|---|---|---|
| **Elders** (`father`, `mother`, `grandfather`, `grandmother`) | Utmost respect (*শ্রদ্ধা, প্রণাম, আপনি*) | *"আপনার আশীর্বাদ ও স্নেহই আমাদের জীবনের সবচেয়ে বড় সম্পদ..."*, *"জগতের সেরা বাবা / মা"* |
| **Partner** (`partner`, `boyfriend`, `girlfriend`) | Deep romance, poetic tenderness (*ভালোবাসা, তুমি/তুই*) | *"তুমি আমার জীবনের সবচেয়ে সুন্দর কবিতা..."*, *"প্রতিটি নিঃশ্বাসে তোমারই সুখ ও আনন্দের প্রার্থনা"* |
| **Siblings** (`brother`, `sister`, `sibling`) | Playful banter + protective warmth (*ভাই, দিদি / বোন, তুই/তুমি*) | *"সারাদিন ঝগড়া আর খুনসুটির পরও প্রাণের ভাই/বোন..."*, *"ট্রিট কবে দিচ্ছিস? 😂"* |
| **Uncles & Aunts** (`uncle`, `aunt`) | Affectionate respect (*কাকু, মামা, মাসিমনি, পিসিমনি*) | *"পরিবারের প্রতিটি আনন্দের মধ্যমণি..."*, *"আপনার অফুরন্ত ভালোবাসা ও স্নেহের জন্য কৃতজ্ঞ"* |
| **Friends** (`friend`, `bestie`) | Energetic, funny, unconditional bond (*বন্ধু, দোস্ত, তুই*) | *"তুই শুধু বন্ধু নোস, আত্মার ভাই!"*, *"অসংখ্য আড্ডা আর পাগলামির স্মৃতিতে ঘেরা বন্ধুত্ব"* |
| **Mentors & Colleagues** (`mentor`, `colleague`) | Professional warmth & deep gratitude (*শ্রদ্ধেয় শিক্ষক / সহকর্মী*) | *"আপনার দিকনির্দেশনা ও অনুপ্রেরণা আমাদের পথচলাকে আলোকিত করেছে..."*, *"সফলতার নতুন দিগন্তে পৌঁছান"* |

---

## 🔤 Indic Typography & Responsive Layout Protections

Bengali (Eastern Nagari script / বাংলা লিপি) features top matra lines (*মাত্রা*), complex conjunct characters (*যুক্তাক্ষর* e.g., `ক্ষ`, `জ্ঞ`, `শ্র`, `ন্ত`, `ণ্ড`, `স্থ`), and vowel signs (*কার*). Birthday Bloom implements specialized CSS and runtime protections:

### 1. Google Fonts Hierarchy
Imported in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;900&display=swap');
```
- **Display & Headings**: `Hind Siliguri`, `Noto Sans Bengali`, `Playfair Display`, serif
- **Body & UI**: `Hind Siliguri`, `Noto Sans Bengali`, sans-serif

### 2. Matra (মাত্রা) & Conjunct Continuity Reset
In `src/index.css`:
```css
/* Indic typography protection: preserve shirorekha & conjunct continuity */
html[lang="bn"] * {
  letter-spacing: normal !important;
  text-transform: none !important;
}
```
> **Why this matters**: Adding letter-spacing or uppercase transformation to Bengali script breaks the continuous top matra (*মাত্রা*) and disconnects vowel modifiers (*কার* e.g., `ি`, `ী`, `ু`, `ূ`, `ে`, `ৈ`, `ো`, `ৌ`, `্`) from consonant glyphs. Our global reset guarantees pristine typography.

### 3. Grapheme-Aware Kinetic Typography
In `KineticText.tsx` and `TypeWriter.tsx`, text is split along grapheme clusters and word boundaries rather than raw byte strings, ensuring that dependent kar symbols stay glued to their parent consonants during animated reveals.

---

## 🛠️ Developer & i18n Architecture

The localization engine is modular and strongly typed:

### Translation Hook Usage
```tsx
import { useTranslation } from "@/i18n";

export const BirthdayHeader = () => {
    const { t, language, isBengali, isHindi } = useTranslation();

    return (
        <div>
            <h1>{t('common.happyBirthday')}</h1>
            <p>{t('common.dear', { name: 'রাহুল' })}</p>
            {isBengali && <span className="text-xs text-primary">বাংলা মোড সক্রিয়</span>}
        </div>
    );
};
```

### Parameter Interpolation
Interpolation handles variables smoothly:
```ts
t('quiz.questionProgress', { current: 1, total: 5 });
// Bengali Output: "প্রশ্ন 1 / 5"
```

### Key Source Files
- `src/i18n/types.ts`: `TranslationSchema` interface definition.
- `src/i18n/index.ts`: Translation dispatcher, alias normalization, and fallback logic.
- `src/i18n/locales/bn.ts`: Exhaustive Bengali translation dictionary.
- `src/config/bengaliTemplates.ts`: Bengali letters, big wishes, and tree quotes.
- `src/features/core/store/SuperPersonalizedLogic.ts`: Personalized narrative routing for Bengali.

---

## 📋 Sample Bengali `.env.local` Recipe

```env
# Core Identity & Language
VITE_LANGUAGE=bn
VITE_BIRTHDAY_NAME="সৌরভ"
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00C2FF
VITE_BIRTHDAY_WISHER_NAME="অনির্বাণ"

# Interactive Customization
VITE_BIRTHDAY_INTERESTS=coding,music,photography
VITE_BIRTHDAY_CUSTOM_MESSAGE="শুভ জন্মদিন দোস্ত! তোর জীবনের প্রতিটি দিন যেন আনন্দে ভরে ওঠে।"
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_PHOTO_SECTION=true
VITE_SHOW_QUIZ_SECTION=true
VITE_SHOW_HEART_TREE_SECTION=true
VITE_ANIMATION_INTENSITY=high
```

---

## 🧪 Verification & Testing

Run the test suite to verify Bengali localization, string interpolation, and build integrity:

```bash
# Run Vitest unit tests
npm run test

# TypeScript typecheck
npx tsc --noEmit

# ESLint audit
npm run lint

# Production build
npm run build
```

---

#obsidian #documentation #birthday-bloom #bengali #bangla #localization #i18n #indic