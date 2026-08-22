# 🌍 Multi-Language Localization Guide: Bengali (বাংলা) Setup

Birthday Bloom v3.1 features full **Bengali (বাংলা), Hindi (हिन्दी) & English Multi-Language Localization** with cultural nuance, emotional warmth, and automatic text-level adaptations across every page and component.

---

## 🚀 Quick Setup (Enable Bengali)

To switch the entire website to Bengali, set `VITE_LANGUAGE` in your `.env.local` or hosting provider environment settings:

```env
VITE_LANGUAGE=bn
```

*(Aliases accepted: `bn`, `bengali`, `bangla`)*

To switch back to English (default):
```env
VITE_LANGUAGE=en
```

To switch to Hindi:
```env
VITE_LANGUAGE=hi
```

---

## 📦 What Changes in Bengali Mode?

When `VITE_LANGUAGE=bn` is active:

1. **Splash & Welcome Screen**:
   - Tap-to-begin prompt becomes *"যাত্রা শুরু করতে যেকোনো জায়গায় স্পর্শ করুন ✨"*.
   - Headline adjusts to *"জন্মদিনের এক অপূর্ব ও জাদুকরী উপহার"*.

2. **Password Unlock Screen**:
   - Unlock header changes to *"পাসকোড দিয়ে আনলক করুন 🔐"*.
   - Subtext changes to *"এক জাদুকরী ও ভালোবাসায় ভরা জন্মদিনের উপহার..."*.
   - Dynamic date hints adapt to Bengali format (e.g. `MMDD` $\rightarrow$ *"ইঙ্গিত: আজকের বিশেষ তারিখ (ফরম্যাট: MMDD, যেমন ২৪শে এপ্রিলের জন্য 0424) 📅"*).
   - Error messages change to *"ভুল পাসকোড! অনুগ্রহ করে আবার চেষ্টা করুন ✨"*.

3. **Cinematic Storytelling & Chat**:
   - Storylines dynamically switch to poetic Bengali narratives customized by relationship (`partner`, `friend`, `family`).
   - Fake chat scene features emotional Bengali typing simulation (*"আমার মনের রাজপুত্রের জন্য..."*, *"দাঁড়াও, এত সাধারণ মেসেজ? এটা আমরা নই! 😂"*).
   - Reveal sequence announces *"এটি শুধুমাত্র আপনার জন্য..."* and *"শুভ জন্মদিন!"*.

4. **Cake Cutting Ceremony (3D)**:
   - "Start Cutting" $\rightarrow$ *"কাটা শুরু করুন"*.
   - Baking screen $\rightarrow$ *"আপনার কেক তৈরি হচ্ছে..."*.
   - Countdown $\rightarrow$ *"কেক কাটার জন্য প্রস্তুত হন..."*.
   - Blow instruction $\rightarrow$ *"✨ মনে মনে একটি সুন্দর ইচ্ছা পূরণ করে মোমবাতি নিভান ✨"*.
   - Blow button $\rightarrow$ *"🌬️ এখনই ফুঁ দিন"*.
   - Wish sent $\rightarrow$ *"আপনার সুন্দর ইচ্ছাটি আকাশের তারার কাছে পৌঁছে গেছে ✨"*.
   - Cake celebration quotes adapt to heartfelt Bengali wishes.

5. **Emotional Letter & Big Wishes**:
   - Deeply personalized emotional letters generated in Bengali via `BENGALI_EMOTIONAL_LETTERS` based on gender, relationship, and interests.
   - Letter title $\rightarrow$ *"আপনার জন্য একটি বিশেষ চিঠি 💌"*.
   - Big wishes display authentic Bengali celebration cards (*"আপনার জন্য অফুরন্ত শুভকামনা ✨"*, *"আপনার সাফল্য আকাশ ছুঁয়ে যাক"*).

6. **Photo Gallery & Video Memories**:
   - Gallery title $\rightarrow$ *"স্মৃতিসমূহ 📸"*.
   - Captions adapt to Bengali sentiments (*"আপনার সাথে কাটানো প্রতিটি মুহূর্ত এক অমূল্য উপহার 💖"*, *"সেরা বন্ধুর সাথে অবিস্মরণীয় মুহূর্তগুলো 🚀"*).
   - Video memories $\rightarrow$ *"বিশেষ ভিডিও স্মৃতি 🎬"*.

7. **Interactive Birthday Trivia Quiz**:
   - Culturally authentic Bengali questions and options with humorous answer explanations.
   - Score celebration screen $\rightarrow$ *"অসাধারণ স্কোর! 🏆"*, *"আপনি বার্থডে কুইজে X নম্বর পেয়েছেন!"*.

8. **Heart Tree of Wishes**:
   - Interactive leaf clicks trigger poetic Bengali messages from `BENGALI_HEART_MESSAGES` and `BENGALI_SPECIAL_QUOTES`.

9. **Final Surprise & Gift**:
   - Memory cards, video surprise subtext, and closing heartfelt love note adapt to pure Bengali.

---

## 🛠️ Architecture & Translation Hook

Localization in Birthday Bloom is driven by:

- `src/i18n/index.ts`: The central translation dispatcher with `useTranslation()` hook.
- `src/i18n/locales/bn.ts`: Type-safe Bengali dictionary adhering to `TranslationSchema`.
- `src/config/bengaliTemplates.ts`: Bengali emotional letter templates, special quotes, and wishes.
- `src/features/core/store/useBirthdayStore.ts`: Language state parsing and normalization.

### Example in React Components:
```tsx
import { useTranslation } from "@/i18n";

export const MyComponent = () => {
    const { t, language, isBengali, isHindi } = useTranslation();

    return (
        <div>
            <h1>{t('common.happyBirthday')}</h1>
            <p>{t('common.dear', { name: 'রাহুল' })}</p>
            {isBengali && <span>বাংলা মোড সক্রিয়</span>}
        </div>
    );
};
```

---

## 🧪 Verification & Testing

To test the Bengali localization:

```bash
# Run unit test suite
npm run test

# Check TypeScript typing
npx tsc --noEmit

# Run ESLint
npm run lint

# Build for production
npm run build
```