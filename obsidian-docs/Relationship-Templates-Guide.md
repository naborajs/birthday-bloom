---
tags: [templates, customization, relationships, i18n, psychology]
aliases: [relationship-templates-guide]
---

# Complete Guide to Relationship Templates & Emotional Customization

Birthday Bloom is built around the philosophy that **celebrations should feel personal, authentic, and emotionally resonant**. Rather than generic greetings, every visual asset, message, soundtrack tempo, and guestbook seed dynamically molds itself to the recipient's relationship.

---

## 1. Supported Relationship Archetypes

The app supports 12 first-class relationship archetypes configured via `VITE_RELATIONSHIP` or the URL parameter `?rel=`:

| Relationship Key | Archetype | Dominant Emotional Tone | Default Accent | Primary Emojis |
|---|---|---|---|---|
| `partner` | Romantic Soulmate | Intimate, poetic, deep romance | Rose & Deep Carmine (`#FF2A6D`) | 💖 ❤️ ✨ 🌹 🕊️ |
| `friend` | Bestie / Companion | Playful, exuberant, legendary banter | Amber & Electric Gold (`#F59E0B`) | 🚀 🎉 😂 🍻 🌟 |
| `brother` / `sibling` | Brother | Loyal, spirited, shared childhood memories | Sky Blue & Goldenrod (`#0EA5E9`) | 🏆 🎮 ✨ 👊 🎂 |
| `sister` | Sister | Radiance, affection, sweet warmth | Lavender & Blossom Pink (`#A855F7`) | 🌸 💖 ✨ 💐 👑 |
| `mother` | Mother / Matriarch | Infinite gratitude, gentle tenderness | Soft Rose & Emerald (`#EC4899`) | 💐 🕊️ 🌸 💛 👑 |
| `father` | Father / Patriarch | Strength, guidance, steady inspiration | Royal Sky & Amber (`#0284C7`) | 🌟 🛡️ 💪 ⚓ 🏆 |
| `grandfather` | Grandfather | Legacy, deep roots, timeless wisdom | Warm Amber & Mahogany (`#D97706`) | 📜 🌲 🌟 🕊️ 🍂 |
| `grandmother` | Grandmother | Sweet comfort, heritage, warmth | Blossom Pink & Sage (`#F472B6`) | 🌸 🧶 🕊️ 🍵 💖 |
| `colleague` / `mentor` | Colleague / Mentor | Professional admiration, inspiration | Emerald & Teal (`#10B981`) | 🎯 📈 ✨ 🤝 🏆 |
| `family` | Extended Family | Unity, blessing, collective love | Violet & Gold (`#8B5CF6`) | 🏡 🌸 🕊️ 🌟 🎂 |

---

## 2. Dynamic Component Personalization

When a relationship is selected, the following subsystems automatically adapt:

### A. The 3D Smartphone Chat (`FakeChatScene.tsx`)
- **Partner**: Displays romantic opening messages, heart-burst double-tap reactions, and tender closing words.
- **Friend**: Opens with lighthearted teasing ("Wait, a boring text message? Not on my watch! 😂🚀").
- **Mother / Father**: Opens with heartfelt reverence and deep filial gratitude.
- **Brother / Sister**: Features nostalgic childhood banter and celebratory congratulations.

### B. The 3D Cake & Ceremony (`CakeCutting.tsx`)
- Customized congratulatory quote chains in the chosen language.
- Flavor, candle glow, and floating bokeh orbs harmonize with the relationship's color palette.
- Acoustic breath turbulence analysis lets users naturally blow out the 3D candle array via their microphone.

### C. The Heart Tree (`HeartTree.tsx`)
- Displays 12 blossoming heart leaves containing secret memories and emotional affirmations tailored to the specific family or romantic connection.

### D. The Interactive Guestbook (`GuestbookSection.tsx`)
- Automatically populates template-aware starter wishes from loved ones in the active locale.
- Allows party guests and family members to leave persistent wishes and heart reactions.

---

## 3. Multi-Language Cultural Nuances

All emotional templates are natively translated and culturally adapted across 4 languages:

- **English (`en`)**: Warm, authentic, contemporary celebration prose.
- **Bengali (`bn`)**: Rich lyrical phrasing, respectful familial honors (*মায়ের জন্য*, *বাবার জন্য*), and intimate romantic expressions.
- **Hindi (`hi`)**: Respectful and affectionate tone (*पापा का संबल*, *माँ की ममता*, *हमसफ़र का प्यार*).
- **French (`fr`)**: Elegant poetic warmth (*Mon âme sœur*, *Pour le meilleur des frères*).

---

## 4. URL Customization Quick Reference

You can instantly preview or generate customized links for any loved one without modifying code:

```bash
# Romantic Partner
https://birthday-bloom.pages.dev/?name=Sophie&rel=partner&gender=female&sender=Alex

# Loving Mother
https://birthday-bloom.pages.dev/?name=Mom&rel=mother&lang=en

# Cool Brother
https://birthday-bloom.pages.dev/?name=Liam&rel=brother&lang=en

# Cherished Sister
https://birthday-bloom.pages.dev/?name=Maya&rel=sister&lang=hi
```

#obsidian #documentation #templates #customization #i18n
