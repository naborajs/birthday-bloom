# 🆘 NS CODEX: Master Troubleshooting & Diagnostic Guide

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

## 🛡️ Error Logging & Reporting

The **NS CODEX** engine implements a silent logger. If a critical scene fails, it won't crash the page; instead, it will skip to the **Main Dashboard** to ensure the birthday person still sees the message.

To see the debug logs:
1. Open DevTools (`F12`).
2. Type `window.__CODEX_DEBUG__ = true` in the console.
3. Refresh the page.

---
*Maintained by the NS CODEX Reliability Engineering Team.* 🛠️
