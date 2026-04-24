# 🛠️ Complete Environment Configuration Guide

This guide explains how to fully personalize the cinematic experience using the `.env` file. Since the setup wizard has been removed for a "Secret Surprise" launch, this file is mandatory for personalization.

## 🗝️ Core Configuration Variables

These variables define the heart of the experience.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `VITE_BIRTHDAY_NAME` | `String` | The name of the birthday person (e.g., "Naboraj"). |
| `VITE_BIRTHDAY_AGE` | `Number` | The age they are turning (e.g., `25`). |
| `VITE_BIRTHDAY_GENDER` | `String` | `male` or `female` (Influences some defaults). |
| `VITE_BIRTHDAY_DATE` | `ISO Date` | The target date/time (e.g., `2026-04-24T00:00:00`). |
| `VITE_BIRTHDAY_RELATIONSHIP` | `String` | **CRITICAL**: `partner`, `friend`, or `family`. Controls the entire design template. |
| `VITE_BIRTHDAY_COLOR` | `Hex` | The main accent color (e.g., `#FF6B6B`). |
| `VITE_BIRTHDAY_INTERESTS` | `CSV` | Comma-separated list (e.g., `Gaming,Coding,Cars`). |
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | `String` | The long message shown in the final card. |

---

## 🎭 Template-Specific Designs

The `VITE_BIRTHDAY_RELATIONSHIP` variable triggers a total UI overhaul:

### 1. `partner` (Romantic)
- **Design**: Elegant serif fonts, deep crimson/purple tones.
- **Motion**: Dreamy, slow sweeping transitions.
- **Particles**: Roses, Hearts, and soft glows.

### 2. `friend` (Energetic)
- **Design**: Bold Sans-Serif, vibrant neon tones, tight radii.
- **Motion**: Fast, high-energy pops and bounces.
- **Particles**: Confetti, Pizza, Beers, and Stars.

### 3. `family` (Warm)
- **Design**: Modern clean fonts, soft gold/amber tones.
- **Motion**: Gentle, graceful slides.
- **Particles**: Balloons, Gift boxes, and Sparkles.

---

## 🖼️ Media & Sound

| Variable | Description |
| :--- | :--- |
| `VITE_PHOTO_1` | URL for the first gallery photo. |
| `VITE_PHOTO_2` | URL for the second gallery photo. |
| `VITE_PHOTO_3` | URL for the third gallery photo. |
| `VITE_SOUND_URL` | Direct link to a celebratory MP3 file. |

---

## ✅ Testing Your Setup

1. Create a `.env` file in the root directory.
2. Paste the variables above with your custom values.
3. **Restart the dev server**: Press `Ctrl+C` and then run `npm run dev`.
4. The site should now bypass all setup screens and greet the user directly.

---

## 🚀 Deployment (Vercel/Netlify)

When deploying, add these same variables to your host's **Environment Variables** settings. This ensures the site is personalized the moment it is visited.
