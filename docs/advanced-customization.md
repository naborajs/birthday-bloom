# 🎨 Advanced Personalization & Customization Guide

Welcome to the **Birthday Bloom v2.5** engine. This guide details how to leverage every environment variable to create the ultimate personalized birthday experience.

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
VITE_SHOW_VIDEO_SECTION=true   # Show/Hide the video gallery
```

---

## 🎂 The "Pure Reality" Cake Engine
v2.5 introduces a massively upgraded interactive cake-cutting system:
*   **Personalized Name Plaque**: The recipient's name is now automatically rendered on a premium frosting plaque on top of the cake.
*   **Artisan Textures**: Procedural 'Grain' and 'Drips' for a realistic bakery look.
*   **Kinetic Splitting**: The cake physically splits with physics-based 'Cut Sparks' and 3D depth filters when the knife passes through.
*   **Auto-Scroll Interaction**: When a cake is selected, the engine automatically smooth-scrolls the "Blow & Cut" UI into the center of the screen, ensuring mobile users never lose their place.

---

The engine now includes a gamified trivia section about the birthday person. 

### Customizing Questions
The quiz automatically adapts based on:
- `VITE_BIRTHDAY_INTERESTS`: Adds questions about their hobbies.
- `VITE_BIRTHDAY_RELATIONSHIP`: Adds emotional or funny questions about your bond.

**Example Setup:**
```env
VITE_BIRTHDAY_INTERESTS="coding, cars"
VITE_BIRTHDAY_RELATIONSHIP="partner"
```
*Result: The quiz will ask about production bugs, supercars, and who loves them the most!*

---

## 📸 Special Memories Gallery (v2.5)
Create a beautiful, polaroid-style memory lane.
**Variable**: `VITE_SPECIAL_MEMORIES`
**Syntax**: `Caption;ImageURL|Caption;ImageURL`

**Pure Perfect Example:**
```env
VITE_SPECIAL_MEMORIES="Our First Coffee;https://i.imgur.com/example1.jpg|The Night We Met;https://i.imgur.com/example2.jpg|Graduation Day 🎓;https://i.imgur.com/example3.jpg"
```

---

## 🎬 Final Surprise Video (v2.5)
Add a dedicated video reveal at the very end of the journey.
**Variable**: `VITE_FINAL_VIDEO_URL`

**Example:**
```env
VITE_FINAL_VIDEO_URL="https://www.youtube.com/embed/dQw4w9WgXcQ"
```
> [!TIP]
> For YouTube, use the `/embed/` link format for the best cinematic experience.

---

## 🎨 Global "Pure Reality" Theming
Customize the entire feel of the website with one color.
**Variable**: `VITE_FAVORITE_COLOR`

**Example (Midnight Blue):**
```env
VITE_FAVORITE_COLOR="#1E90FF"
```
*The engine will automatically generate lighter glows, darker shadows, and matching gradients based on this one color.*

---

## 🕒 Performance vs Quality
If you want to optimize for different devices:
| Variable | Value | Effect |
| :--- | :--- | :--- |
| `VITE_PARTICLE_COUNT` | `10` | Better performance on old phones |
| `VITE_PARTICLE_COUNT` | `100` | Super immersive on high-end PCs |
| `VITE_ANIMATION_SPEED` | `slow` | More emotional, poetic pacing |
| `VITE_ANIMATION_SPEED` | `fast` | High energy, exciting party vibe |

---

## 🏁 Full "Super OP" Env Template
Copy and paste this into your `.env` for the ultimate experience:

```env
VITE_BIRTHDAY_NAME="Nishant"
VITE_BIRTHDAY_AGE="24"
VITE_BIRTHDAY_GENDER="male"
VITE_BIRTHDAY_RELATIONSHIP="friend"
VITE_BIRTHDAY_COLOR="#FFD700"
VITE_BIRTHDAY_INTERESTS="gaming, cars, music"
VITE_BIRTHDAY_CUSTOM_MESSAGE="Stay Legendary, Bro!"
VITE_BIRTHDAY_LETTER_TITLE="A Message for the Icon"
VITE_FINAL_VIDEO_URL="https://www.youtube.com/embed/example"
VITE_SPECIAL_MEMORIES="The LAN Party;url|Road Trip 2023;url"
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_VIDEO_SECTION=true
```

---

*This engine is maintained by **Naboraj Sarkar**. Ensure you keep the authorship intact in the codebase while personalizing the website.*
3.  **Balloons**: Clicking the main greeting text or floating emojis adds more floating balloons to the scene.

---

## 🚀 Deployment Guide (Vercel)
1. Push your code to GitHub.
2. Link the repo to Vercel.
3. **Critical**: Add your environment variables in the Vercel dashboard.
4. Enjoy a zero-config, 60fps cinematic birthday launch!

---

**Crafted with excellence by Naboraj Sarkar.**
