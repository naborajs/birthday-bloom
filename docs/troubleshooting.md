# 🆘 Naboraj Sarkar: Master Troubleshooting & Diagnostic Guide

If your "Cinematic Surprise" isn't running at 60fps or the secrets aren't loading, use this guide to diagnose and repair the engine.

---

## 🔬 Diagnostic Command Center

Before deep-diving into specific errors, run this "Sanity Check" in your terminal:
```bash
# 1. Clean the cache
rm -rf node_modules/.vite

# 2. Reinstall (if logic feels broken)
npm install

# 3. Check for TS errors (Production Pre-flight)
npm run build
```

---

## 🔴 Critical Failures & Recovery

### 1. The "Infinite Loader" Syndrome
- **Symptoms**: The splash screen shows a loading spinner forever.
- **Cause**: The engine is waiting for a critical asset (usually a `VITE_PHOTO_X` URL) that is unreachable or 404.
- **Example**: `VITE_PHOTO_1="https://invalid-link.com/img.jpg"`
- **Fix**: Check the browser console (`Network` tab). If a request is red (404/Timeout), fix the URL in your `.env`. The engine will now auto-inject a placeholder if a request takes longer than 10 seconds.

### 2. "Uncaught ReferenceError: process is not defined"
- **Cause**: Using `process.env` instead of `import.meta.env` (Vite standard).
- **Fix**: Ensure all your environment access follows the Vite pattern:
  - **❌ Wrong**: `process.env.VITE_BIRTHDAY_NAME`
  - **✅ Correct**: `import.meta.env.VITE_BIRTHDAY_NAME`

### 3. "Module not found" on Deployment (Vercel/Netlify)
- **Cause**: Case-sensitivity. Your local machine (Windows/Mac) might ignore `cakecutting.tsx` vs `CakeCutting.tsx`, but Linux servers will fail.
- **Fix**: Audit all imports. Ensure `import { CakeCutting } from './CakeCutting'` matches the filename EXACTLY.

---

## 🟠 Performance & 3D Engine Issues

### 1. Jittery 3D Tilts (Low FPS)
- **Check**: Are you on a Low Power Mode device?
- **Optimization Example**:
  ```env
  # Reduce particle load for low-end devices
  VITE_PARTICLE_COUNT=10
  VITE_ANIMATION_SPEED="fast"
  ```
- **Pro-Tip**: Avoid high-resolution transparent PNGs. Use WebP for all images.

### 2. SVG Artifacts or "Invisible" Cake
- **Cause**: Hardware acceleration bugs in specific GPU drivers.
- **Fix**: Open `src/index.css` and ensure the `--color-primary` has a high enough contrast. If the cake is invisible, it’s often because the HSL values calculated from your Hex code resulted in `lightness: 100%`.

---

## 🟡 Browser-Specific "Gotchas"

| Browser | Known Issue | Resolution |
| :--- | :--- | :--- |
| **Safari (iOS)** | Audio stops when screen locks. | The engine now auto-resumes the `AudioContext` on the first touch after a lock event. |
| **Chrome (Mobile)** | Address bar hides/shows, causing layout jumps. | We use `100dvh` (Dynamic Viewport Height) to prevent "UI Bouncing" during the intro. |
| **Firefox** | SVG filters look slightly "blurry". | This is a native rendering difference. The engine applies a `sharpness` boost filter specifically for Gecko browsers. |

---

---

## 🟢 Common Questions (FAQ)

### How do I change the music?
Replace the files in `public/assets/audio/` with your own MP3 files. Make sure to keep the filenames the same (e.g., `bg-music.mp3`) or update the `SoundManager.tsx`.

### The "I Love You" message isn't showing up?
Check if `VITE_BIRTHDAY_RELATIONSHIP` is set to `partner`. This triggers the romantic narrative branch.

### How to add more photos?
Go to `src/components/birthday/PhotoGallery.tsx` and add more URLs to the `PHOTOS` array, or use the `VITE_PHOTO_1`, `VITE_PHOTO_2` etc. variables in your `.env`.

### Can I change the theme colors?
Yes! Use `VITE_BIRTHDAY_COLOR` in your `.env` with any Hex code (like `#FF0000` for Red). The engine will automatically generate a matching palette.

---

## 🛡️ "Never Fail" Strategy
Birthday Bloom is designed with a **Fail-Safe Architecture**. If an animation fails to load, the engine will automatically:
1.  **Skip the stuck phase** after 5 seconds.
2.  **Use fallback colors** if your custom color is invalid.
3.  **Use placeholder names** if `VITE_BIRTHDAY_NAME` is missing.

*Maintained by the Naboraj Sarkar Reliability Engineering Team.* 🛠️
