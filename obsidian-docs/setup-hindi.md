# 🌍 Multi-Language Localization Guide: Hindi (हिन्दी) Setup

Birthday Bloom v3.1 features full **Hindi & English Multi-Language Localization** with emotional nuance, cultural warmth, and automatic text-level adaptations across every page and component.

---

## 🚀 Quick Setup (Enable Hindi)

To switch the entire website to Hindi, set `VITE_LANGUAGE` in your `.env.local` or hosting provider environment settings:

```env
VITE_LANGUAGE=hi
```

*(Aliases accepted: `hi`, `hindi`, `in`)*

To switch back to English (default):
```env
VITE_LANGUAGE=en
```

---

## 📦 What Changes in Hindi Mode?

When `VITE_LANGUAGE=hi` is active:

1. **Splash & Welcome Screen**:
   - Tap-to-begin prompt becomes *"सफर शुरू करने के लिए कहीं भी टैप करें ✨"*.
   - Headline adjusts to *"जन्मदिन का एक बेहद खास और जादुई तोहफा"*.

2. **Password Unlock Screen**:
   - Unlock header changes to *"पासवर्ड से अनलॉक करें 🔐"*.
   - Subtext changes to *"एक जादुई और बेहद खास जन्मदिन का तोहफा..."*.
   - Dynamic date hints adapt to Hindi format (e.g. `MMDD` $\rightarrow$ *"जन्मदिन का महीना और दिन (MMDD)"*).
   - Error messages change to *"गलत पासवर्ड! कृपया दोबारा प्रयास करें ✨"*.

3. **Cinematic Storytelling & Chat**:
   - Storylines dynamically switch to poetic Hindi narratives customized by relationship (`partner`, `friend`, `family`).
   - Fake chat scene features emotional Hindi typing simulation (*"मेरे दिल के राजा के लिए..."*, *"अरे रुको, सिर्फ एक साधारण संदेश? वो हम नहीं! 😂"*).
   - Reveal sequence announces *"यह सिर्फ आपके लिए है..."* and *"जन्मदिन मुबारक!"*.

4. **Cake Cutting Ceremony (3D)**:
   - "Start Cutting" $\rightarrow$ *"काटना शुरू करें"*.
   - Baking screen $\rightarrow$ *"आपका केक तैयार हो रहा है..."*.
   - Countdown $\rightarrow$ *"केक काटने के लिए तैयार हो जाइए..."*.
   - Blow instruction $\rightarrow$ *"✨ एक प्यारी सी दुआ मांगें और मोमबत्ती बुझाएं ✨"*.
   - Blow button $\rightarrow$ *"🌬️ अभी फूंक मारें"*.
   - Wish sent $\rightarrow$ *"दुआ आसमान के तारों तक पहुँच गई ✨"*.
   - Cake celebration quotes adapt to heartfelt Hindi wishes.

5. **Emotional Letter & Big Wishes**:
   - Deeply personalized emotional letters generated in Hindi via `HINDI_EMOTIONAL_LETTERS` based on gender, relationship, and interests.
   - Letter title $\rightarrow$ *"आपके लिए एक खास पत्र 💌"*.
   - Big wishes display authentic Hindi celebration cards (*"दिल से निकली ढेरों दुआएं"*, *"अपार सफलता और खुशियां"*).

6. **Photo Gallery & Video Memories**:
   - Gallery title $\rightarrow$ *"यादें 📸"*.
   - Captions adapt to Hindi sentiments (*"आपके साथ बिताया हर पल एक अनमोल तोहफा है 💖"*, *"सच्चे यार के साथ बिताए यादगार लम्हे 🚀"*).
   - Video memories $\rightarrow$ *"खास वीडियो यादें 🎬"*.

7. **Interactive Birthday Trivia Quiz**:
   - Questions, multiple choices, and funny explanations adapt to lively Hindi trivia with cultural humor and warmth.
   - Victory message $\rightarrow$ *"धमाकेदार स्कोर! 🏆"*.
   - Play again $\rightarrow$ *"फिर से खेलें 🔄"*.

8. **Heart Tree of Memories**:
   - Clicking tree leaves reveals deep, poetic Hindi sentiments from `HINDI_SPECIAL_QUOTES` and `HINDI_HEART_MESSAGES`.

9. **Hidden Gift Box**:
   - Gift description, party hype mood (*"धमाकेदार मूड एक्टिवेटेड 💥"*), and secret code reveal adapt to Hindi.

---

## 🛠️ Developer & i18n Architecture

The localization system is built with modularity and type-safety:

- **Store**: `useBirthdayStore.getState().config.language` (parsed from `VITE_LANGUAGE`/`VITE_LANG`).
- **Hook**: `useTranslation()` from `@/i18n`.
  ```tsx
  import { useTranslation } from "@/i18n";

  export const MyComponent = () => {
    const { t, isHindi, language } = useTranslation();
    return <h1>{t('common.happyBirthday')}</h1>;
  };
  ```
- **Translation Schema**: `src/i18n/types.ts`
- **English Locale**: `src/i18n/locales/en.ts`
- **Hindi Locale**: `src/i18n/locales/hi.ts`
- **Hindi Templates**: `src/config/hindiTemplates.ts`

---

## 🧪 Verification & Testing

Run the test suite to verify Hindi and English translation pipelines:

```bash
npm run test
npm run build
```