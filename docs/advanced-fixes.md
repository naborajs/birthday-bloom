# 🛠️ Advanced Fixes & Troubleshooting Master Guide

This guide covers complex edge cases, browser-specific bugs, and deployment hurdles for the **Birthday Bloom** cinematic engine.

---

## 1. Cinematic Performance (FPS Drops)
**Problem**: The animations feel "choppy" or drop below 60fps on certain mobile devices.

### Solutions:
*   **GPU Hardware Acceleration**: Ensure the `preserve-3d` class is present on the main containers. This forces the browser to use the GPU.
*   **SVG Simplification**: If you've added custom SVG elements, ensure they aren't using heavy filters like `feDiffuseLighting` which are expensive to calculate.
*   **React Strict Mode**: In development, React renders components twice. If you notice double animations, this is normal in dev. Check production build for actual performance.

---

## 2. Audio Context Issues (Safari/Mobile)
**Problem**: No sound is playing on iPhone or Safari.

### The "Silent" Safari Rule:
Safari blocks all audio until a user performs a "meaningful interaction" (like a click).
*   **The Fix**: The **SplashScreen** is specifically designed to handle this. When the user clicks "Open Surprise", the `SoundManager` unlocks the audio context.
*   **Code fix**: Ensure `unlockAudioContext()` is called inside the `onStart` callback of `SplashScreen`.

---

## 3. Environment Variable Parsing Errors
**Problem**: "VITE_BIRTHDAY_NAME is undefined" or the site shows a blank screen.

### Checklist:
*   **Prefix**: All variables MUST start with `VITE_`.
*   **Restart**: If you change `.env`, you MUST stop and restart the dev server (`Ctrl+C` then `npm run dev`).
*   **Quotes**: Use double quotes for names with spaces: `VITE_BIRTHDAY_NAME="John Doe"`.

---

## 4. Hydration Mismatch (Server-Side)
**Problem**: Warning "Text content did not match. Server: '...' Client: '...'"

### Why it happens:
Components that use `Date.now()` or `Math.random()` during initial render will cause this if you are using SSR (like Next.js or generic Vite SSR).
*   **The Fix**: Wrap logic inside `useEffect`. In Birthday Bloom, we use `useState` and `useEffect` to ensure state is only generated on the client.

---

## 5. Deployment "Page Not Found" (404)
**Problem**: Refreshing the page on Vercel/Netlify results in a 404 error.

### Solution for Single Page Apps (SPA):
Create a `vercel.json` (for Vercel) or `_redirects` (for Netlify) in the root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 6. How to Fix "Everything" (The Panic Button)
If the project is behaving strangely:
1.  **Clear Cache**: Delete the `node_modules` folder and `package-lock.json`.
2.  **Clean Install**: Run `npm install` again.
3.  **Clean Build**: Run `npm run build` to see if there are any TypeScript errors hidden in the code.
4.  **Browser Check**: Test in "Incognito Mode" to rule out browser extensions interfering with the animations.

---

**Naboraj Sarkar (NS CODEX)**
*If you find a new bug, report it to the [Issues](https://github.com/naborajs/birthday-bloom/issues) page.*
