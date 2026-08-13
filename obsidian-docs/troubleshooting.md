# Troubleshooting Guide

Common issues and solutions for Birthday Bloom.

---

## Local Setup Issues

### Blank screen on load

**Causes**: Missing `.env.local`, typo in `VITE_BIRTHDAY_NAME`, failed `npm install`, or browser extension blocking.

**Fixes**:
1. Check browser console for errors
2. Verify `.env.local` exists (copy from `.env.example`)
3. Run `npm install` to ensure dependencies
4. Try incognito/private mode (extensions can interfere)

### "Module not found" errors

Windows/macOS are case-insensitive, but Linux servers (Vercel, Netlify) are case-sensitive.

**Fix**: Ensure all import paths match filenames EXACTLY. `CakeCutting.tsx` must be imported as `'./CakeCutting'`, not `'./cakecutting'`.

### Dev server port conflict

The dev server runs on `http://localhost:5000`. If that port is in use, edit `vite.config.ts`:
```ts
server: { port: 5001 }
```

### "process is not defined" error

**Cause**: Using `process.env` instead of `import.meta.env` (Vite standard).

**Fix**: Replace `process.env.VITE_*` with `import.meta.env.VITE_*`.

---

## Env Configuration Issues

### Env changes not reflected

**Fix**: Restart the dev server. Vite caches `import.meta.env` values at startup.

### Env works locally but not in production

**Fix**: Add the variables in your hosting provider's Environment Variables dashboard and trigger a fresh deploy.

### Boolean values not parsed correctly

Supported values: `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off`, `enabled`, `disabled`.

### Photos not loading

- Use direct image URLs ending in `.jpg`, `.png`, `.webp`
- URLs from image CDNs usually work
- Check browser Network tab for 404s
- The PhotoGallery component has fallback logic but unreachable URLs may cause delays

### Relationship mood looks wrong

- Use a supported relationship value (see [ENV_GUIDE.md](./ENV_GUIDE.md))
- `VITE_THEME` is reserved for future manual theme override and is not currently consumed by the runtime.

### JSON family profile fails

Validate JSON — all keys and strings must be in double quotes. Use a JSON validator before pasting.

---

## Audio Issues

### No sound / music doesn't play

- iOS requires a user gesture (tap) to start audio — the SplashScreen handles this
- Check browser autoplay policies — the app has a fallback listener for first click
- Verify `VITE_SOUND_URL` or `VITE_BGM_URL` points to an accessible audio file
- The app falls back to a built-in Pixabay URL if no env URL is set

### Audio stops when screen locks (iOS)

This is an iOS limitation. Audio resumes on the next touch interaction via the AudioContext resume handler.

---

## Animation and Performance

### Jittery animations (low FPS)

**Fixes**:
```env
VITE_PARTICLE_COUNT=10
VITE_ANIMATION_INTENSITY=low
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=true
```

Also check: low power mode, browser GPU acceleration settings, and avoid high-resolution transparent PNGs (use WebP).

### SVG artifacts or invisible elements

Hardware acceleration bugs in specific GPU drivers can cause SVG rendering issues. Ensure `--color-primary` HSL values have sufficient contrast — the cake and heart tree are entirely SVG-based.

### Animation stops mid-sequence

The cinematic intro uses `setTimeout` chains stored in `timersRef`. If a timer is cleared incorrectly (e.g., component unmounts), the sequence can freeze. Check that you haven't modified the timer logic in `CinematicIntro.tsx`.

---

## Browser-Specific Issues

| Browser | Issue | Resolution |
|---|---|---|
| Safari (iOS) | Audio stops on screen lock | Auto-resumes AudioContext on next touch |
| Chrome (Mobile) | Address bar causing layout jumps | App uses `100dvh` (Dynamic Viewport Height) |
| Firefox | SVG filters look blurry | Native rendering difference — no action needed |

---

## Build and Deployment

### Vercel build fails

- Ensure Node.js 18+ (check `.nvmrc`)
- Check for case-sensitive imports
- Verify environment variables are set in Vercel dashboard
- Build command: `npm run build`, output: `dist`

### White screen after deployment

Usually caused by a failed import. Check the hosting provider's build logs for "Module not found" errors.

### Lighthouse performance goals

- **LCP**: < 1.2s
- **FID**: < 100ms
- **CLS**: 0.00

---

## Common Questions

### How do I change the background music?

Set `VITE_SOUND_URL` or `VITE_BGM_URL` in `.env.local` to an MP3/audio file URL. The app falls back to a built-in Pixabay track if unset.

### The romantic message isn't showing?

Set `VITE_BIRTHDAY_RELATIONSHIP=partner` to trigger the romantic narrative branch and partner-specific letter content.

### How do I add more than 3 photos?

Use `VITE_PHOTOS` with pipe-separated URLs for unlimited photos, or use the numbered variables `VITE_PHOTO_1` through `VITE_PHOTO_6`.

### How do I remove sections?

Set the corresponding `VITE_SHOW_*` variable to `false`. See [ENV_GUIDE.md](./ENV_GUIDE.md) for the full list.

### How do I change theme colors?

Set `VITE_BIRTHDAY_COLOR` in `.env.local` with any hex code (e.g., `#FF0000`). The engine generates a matching HSL palette automatically.

---

## Debug Mode

The current runtime does not parse `VITE_DEBUG`. Use browser developer tools and console logging for troubleshooting.

---

## Fail-Safe Behavior

Birthday Bloom is designed to never show a blank screen:
1. If an asset fails to load, fallback placeholders are used
2. If a phase gets stuck, it auto-skips after 5 seconds
3. If `VITE_BIRTHDAY_NAME` is missing, placeholder names are used
4. If a custom color is invalid, fallback colors are applied

---

## Still Stuck?

- Open a [GitHub issue](https://github.com/naborajs/birthday-bloom/issues)
- Check [FAQ.md](../FAQ.md)
- Read the [ENV_GUIDE.md](./ENV_GUIDE.md) for environment variable details
- See [SUPPORT.md](../SUPPORT.md) for contact options

---

## See Also

- [ENV_GUIDE.md](./ENV_GUIDE.md) — Environment variable reference
- [deployment.md](./deployment.md) — Deployment guide (includes expanded troubleshooting section)
- [developer-guide.md](./developer-guide.md) — Developer reference
