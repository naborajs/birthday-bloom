---
tags: [guestbook, social, localStorage, components, celebration]
aliases: [guestbook-and-live-wishes]
---

# Interactive Guestbook & Live Wishes Board Architecture

The **Guestbook & Live Wishes Board** (`src/components/birthday/GuestbookSection.tsx`) adds a persistent, community-driven social dimension to Birthday Bloom. It allows friends, family, and loved ones to write heartfelt notes, select celebratory emojis, like messages, and display them in a glassmorphic celebration wall.

---

## 1. Feature Architecture & Lifecycle

```
[Store/Locale Config]
         │
         ▼
[Compute Template Seeds] ──► [Merge with LocalStorage Custom Wishes]
                                          │
                                          ▼
                                [Render Wishes Grid]
                                 ├── Like Counter
                                 ├── Color Badges
                                 └── Interactive Modal
                                          │
                                    (User Submits)
                                          │
                                          ▼
                               [Confetti & Sound Trigger]
                                          │
                                          ▼
                               [Persist to LocalStorage]
```

---

## 2. Environment Configuration

The guestbook is enabled by default in `MainBirthday.tsx` and can be toggled via environment variables:

| Variable | Type | Default | Description |
|---|---|---|---|
| `VITE_SHOW_GUESTBOOK_SECTION` | `boolean` | `true` | When `true`, displays the Guestbook section right after the Heart Tree. |

---

## 3. Template-Aware Starter Wishes

Rather than an empty canvas, the board mounts with **culturally attuned, relationship-tailored starter wishes** in the user's active language:

- **Partner**: Deeply romantic letters from the soulmate, celebrating their warmth and togetherness.
- **Mother**: Loving messages honoring maternal kindness, wisdom, and comforting guidance.
- **Father**: Respectful and proud affirmations from children and the whole family.
- **Brother / Sister**: Nostalgic, spirited childhood memories and brotherly/sisterly affection.
- **Friend**: High-energy party banter and wishes for a legendary year ahead.

---

## 4. Client-Side Persistence Layer

Wishes created by visitors are stored locally in the browser under the key:
`birthday_bloom_guestbook_wishes`

### Wish Data Structure:
```typescript
export interface GuestbookWish {
  id: string;
  name: string;
  message: string;
  role: 'partner' | 'friend' | 'family' | 'wellWisher' | 'colleague';
  emoji: string;
  colorScheme: 'rose' | 'amber' | 'lavender' | 'emerald' | 'sky';
  likes: number;
  timestamp: string;
  isCustom?: boolean;
}
```

### Safety & Error Resilience:
- Uses `try/catch` wrappers around `localStorage` to safeguard against Safari private browsing quota limits and SSR/JSDOM environments.
- Submissions trigger dual celebratory effects (`fireConfetti()` and `fireStars()`) accompanied by the reveal sound chime.
- Component timers (`submitTimerRef`) are tracked via React `useRef` and canceled on unmount to prevent memory leaks during page navigation.

---

## 5. Mobile & Zero-Lag Optimizations

- **Adaptive Particle Scaling**: On mobile or low-battery devices (`useAdaptivePerformance`), submission confetti particle counts automatically scale down.
- **Glassmorphic Compositing**: Border highlights and subtle gradients use GPU-promoted layer compositing (`transform-gpu`) to maintain 60 FPS scrolling even with multiple wish cards on screen.

#obsidian #documentation #guestbook #features #storage
