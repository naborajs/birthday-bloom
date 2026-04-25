# 🎨 Advanced Personalization & Customization Guide

Welcome to the **Birthday Bloom v2.1** engine. This guide details how to leverage every environment variable to create the ultimate personalized birthday experience.

---

## 💌 Custom Emotional Letters
The heart of the experience is the emotional letter. You can now fully control this via your `.env` file or Vercel dashboard.

### 1. The Letter Heading
Set a custom title for your letter:
```env
VITE_BIRTHDAY_LETTER_TITLE="To My Soulmate 💖"
```

### 2. The Letter Content
You can write an entire multi-line letter directly in your environment variables. 
> [!TIP]
> Use `\n` or actual line breaks if your platform supports it to create paragraphs.

```env
VITE_BIRTHDAY_LETTER_OVERRIDE="My Dearest Name,\n\nToday is a celebration of you. From the moment we met, my life has been transformed by your light..."
```

---

## 🏗️ Section Visibility Toggles
Control which parts of the experience are visible:
```env
VITE_SHOW_CAKE_SECTION=true    # Show/Hide the interactive cake cutting
VITE_SHOW_VIDEO_SECTION=true   # Show/Hide the video gallery at the end
```

---

## 🎂 The "Pure Reality" Cake Engine
v2.1 introduces a massively upgraded interactive cake-cutting system:
*   **Personalized Name Plaque**: The recipient's name is now automatically rendered on a premium frosting plaque on top of the cake.
*   **Dynamic Theme Elements**: Each cake (Chocolate, Strawberry, Royal, Nature) features unique sprinkles, cream swirls, and lighting effects that adapt to the chosen theme.
*   **Kinetic Splitting**: The cake physically splits with physics-based 'Cut Sparks' and 3D depth filters when the knife passes through.
*   **Auto-Scroll Interaction**: When a cake is selected, the engine automatically smooth-scrolls the "Blow & Cut" UI into the center of the screen, ensuring mobile users never lose their place.
*   **Dynamic Scaling**: Typography and interactive elements automatically scale based on screen width.
*   **Haptic Feedback**: On supported Android devices, interactions like blowing candles and cutting the cake trigger subtle vibrations.

---

## ✨ Hidden Surprises (Easter Eggs)
Encourage your birthday person to explore the UI!
1.  **Meteor Shower**: Clicking the **Heart Tree** triggers a magical falling star effect.
2.  **Secret Confetti**: Double-clicking the **Letter Title** fires a massive confetti cannon.
3.  **Balloons**: Clicking the main greeting text or floating emojis adds more floating balloons to the scene.

---

## 🚀 Deployment Guide (Vercel)
1. Push your code to GitHub.
2. Link the repo to Vercel.
3. **Critical**: Add your environment variables in the Vercel dashboard.
4. Enjoy a zero-config, 60fps cinematic birthday launch!

---

**Crafted with excellence by Naboraj Sarkar.**
