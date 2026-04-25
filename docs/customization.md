# 🎨 Naboraj Sarkar: Master Customization & Theme Tuning

Birthday Bloom is built to be a canvas for your creativity. This guide explains how to push the "Cinematic Engine" to its limits through configuration and code.

---

## 🎭 1. Mood & Relationship Overrides

The `VITE_BIRTHDAY_RELATIONSHIP` variable is the "Soul" of the site. It doesn't just change text; it changes the entire design language.

| Relationship | Tone | Example Use Case |
| :--- | :--- | :--- |
| **`partner`** | Romantic & Dreamy | For a spouse or girlfriend/boyfriend. Uses deep reds and serif fonts. |
| **`friend`** | Energetic & Bold | For your best friend or sibling. Uses neon cyans and fast motion. |
| **`family`** | Warm & Sentimental | For parents or mentors. Uses soft amber tones and graceful transitions. |

---

## 🎨 2. Advanced Theme Tuning

The engine generates a full UI palette based on a single `VITE_BIRTHDAY_COLOR`. If you want to achieve a specific "Naboraj Sarkar" look, use these curated hex codes:

- **"Midnight Bloom"**: `#00C2FF` (Vibrant Cyan)
- **"Rose Quartz"**: `#FF6B6B` (Soft Coral)
- **"Golden Legacy"**: `#FFD700` (Classic Gold)
- **"Neon Cyber"**: `#A855F7` (Deep Purple)

### CSS Token Example
If you want to manually override a color in `index.css`:
```css
/* Customizing the Glow Intensity */
:root {
  --primary-glow: 0 0 40px rgba(var(--color-primary-rgb), 0.6);
}
```

---

## 💬 3. Kinetic Storytelling (The Script)

The intro scene is an orchestrated narrative. You can customize the "Script" in `src/components/birthday/CinematicIntro.tsx`.

### Properly Formatted Examples:
```ts
// Custom Storylines for a Friend
const friendLines = [
  "They say legends aren't born every day...",
  "But on this day, one definitely was. 🚀",
  "Ready for the epicness?"
];

// Custom Storylines for a Partner
const romanticLines = [
  "In a world of billions...",
  "My eyes always find you. 💖",
  "Today is about our favorite person."
];
```

---

## 🖼️ 4. Media & Photo Optimization

To keep the 60fps cinematic flow, your media MUST be optimized.

### Naboraj Sarkar Media Standards:
- **Format**: Always use `.webp` if possible, otherwise `.jpg`. Avoid `.png` as it's too heavy.
- **Size**: Keep every image under **500KB**.
- **Dimensions**: Use **16:9** aspect ratio for the gallery to avoid "black bars" in the 3D tilt view.

### Error Handling Example:
If you use a broken URL in `.env`:
```bash
# ❌ INCORRECT (Might cause infinite loading)
VITE_PHOTO_1="https://random-site.com/broken-link"

# ✅ CORRECT (Direct link to an image file)
VITE_PHOTO_1="https://images.unsplash.com/photo-1530101121243-c99ff3cdca42?auto=format&fit=crop&w=800&q=80"
```

---

## 🛠️ 5. Customizing the Interactive Cake

To change the "Cakes" available for selection, open `src/components/birthday/CakeCutting.tsx`:

1. Locate the `CAKE_OPTIONS` array.
2. Update the `name`, `flavorColor`, and `description`.
3. The 3D engine will automatically map your new colors to the SVG geometry.

---
*Identity: Naboraj Sarkar | Brand: Naboraj Sarkar* 🚀
