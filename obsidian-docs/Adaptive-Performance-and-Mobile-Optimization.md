# Adaptive Battery, Frame Rate & Mobile Zero-Lag Architecture

🌐 **Canonical Web Documentation**: [https://naborajs.me/projects/birthday-bloom/docs/adaptive-performance](https://naborajs.me/projects/birthday-bloom/docs/adaptive-performance)

> **Status**: Production Feature  
> **Topic**: Mobile Zero-Lag Profiling, Hardware & Battery Throttling, WebGL DPR Optimization, and Emotional Simplification  
> **Target Audience**: Birthday Bloom Core Engineers, 3D Graphics Programmers & Frontend Architects

---

## 1. Executive Summary & Root Cause Analysis

In web celebrations featuring rich 3D graphics, particle systems, and concurrent animations, mobile browsers often experience severe frame drops, thermal throttling, and battery drain.

### 1.1 The Multi-Canvas Bottleneck

Our performance profiling revealed that mobile lag was caused by:
1. **Concurrent 2D Canvas RAF Loops**: Running 4–5 simultaneous full-screen `requestAnimationFrame` loops (`EmojiCursorTrail`, `PremiumFireworks`, `SparkleRain`, `ShootingStars`) alongside Three.js WebGL.
2. **High Mobile Device Pixel Ratio (DPR 2.5–3.0)**: On high-density smartphone screens (e.g. 1170x2532 on iPhone), rendering WebGL at native DPR forces the GPU to rasterize over **8 million pixels per frame**, leading to severe fragment shader fillrate bottlenecks.
3. **Continuous Compositor Repaints**: Infinite layout translations (e.g., repeating horizontal animations) continuously invalidating compositor layers.
4. **Off-screen Layout Calculations**: Heavy below-the-fold DOM trees triggering full reflows during scrolling.

```
                           PERFORMANCE PROFILING ENGINE
┌────────────────────────────────────────────────────────────────────────┐
│                        Hardware & Battery Profiler                     │
│  • Touch / Screen geometry (isTouch, screenWidth < 768px)              │
│  • Concurrency & RAM (navigator.hardwareConcurrency, deviceMemory)     │
│  • Battery API (navigator.getBattery() <= 20% & discharging)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Dynamic Performance Profile                        │
│             ┌─────────────────────────┬───────────────────────┐        │
│             │   Low / Mobile Tier     │     High / Desktop    │        │
│             ├─────────────────────────┼───────────────────────┤        │
│             │ • DPR: 1.0 (capped)     │ • DPR: Up to 2.0      │        │
│             │ • Shadow Map: 256px     │ • Shadow Map: 1024px  │        │
│             │ • Max Particles: 12     │ • Max Particles: 45   │        │
│             │ • Multi-Canvas: Disabled│ • Multi-Canvas: True  │        │
│             │ • Cursor Trail: Disabled│ • Cursor Trail: True  │        │
│             │ • Frame Cap: 30 FPS     │ • Frame Cap: 60 FPS   │        │
│             └─────────────────────────┴───────────────────────┘        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Downstream Optimizations                         │
│  • Cake3D: DPR capped to 1, orbs reduced from 14 to 4                  │
│  • Index.tsx: Background canvases gated to single peaceful layer       │
│  • MainBirthday.tsx: Infinite car translations disabled on mobile      │
│  • .perf-low: backdrop-filter suppressed on constrained devices        │
│  • PremiumFireworks: adaptive DPR + backing-store release               │
│  • BalloonPopGame / HeartTree: offscreen animations paused              │
│  • GuestbookSection: isolated form state + content-visibility           │
│  • Confetti: generic mobile bursts capped at 60 particles              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dynamic Hardware & Battery Detection (`deviceTier.ts`)

Located in [`src/utils/deviceTier.ts`](file:///d:/Projects/Website/birthday-bloom/src/utils/deviceTier.ts) and consumed reactively via [`src/hooks/useAdaptivePerformance.ts`](file:///d:/Projects/Website/birthday-bloom/src/hooks/useAdaptivePerformance.ts).

### 2.1 The Precedence Hierarchy

1. **Forced High Graphics (`VITE_FORCE_HIGH_GRAPHICS=true` or `?highGraphics=true`)**:
   Forces high-fidelity shaders, 1024px shadow maps, and DPR up to 2.0 regardless of device tier.
2. **Mobile / Resource-Constrained Auto-Detection**:
   If the device has touch inputs and screen width $< 768\text{px}$, or hardware concurrency $\le 4$, or device memory $\le 3\text{GB}$, it automatically switches to **Low Tier**:
   - Caps WebGL DPR to `1.0`.
   - Disables cursor trails (which generate hundreds of unnecessary event listeners on touch devices).
   - Limits ambient canvases to at most 1 calm layer (`FireflyEffect`).
   - Limits max particle count to `12` (`4` when reduced motion is active).
   - Sets shadow maps to `256px`, disables heavy blur, and recommends a `30 FPS` frame cap.
3. **Battery-Aware Downgrade (`navigator.getBattery()`)**:
   When the device is discharging at `<= 20%`, the hook re-evaluates the base profile and forces `tier: 'low'`, `dpr: 1`, `shadowMapSize: 256`, `maxParticles: 8`, disabled cursor trail/multi-canvas/complex shaders/heavy blur, and `recommendedFrameCap: 30`. The battery promise and change listener are both cleaned up on unmount.
4. **OS Reduced Motion Syncing (`prefers-reduced-motion`)**:
   Monitors OS accessibility preferences via `matchMedia('(prefers-reduced-motion: reduce)')`. If reduced motion is toggled, the performance profile automatically updates in real-time, throttling particle burst calculations down to minimum counts ($4-8$ particles) and preventing motion triggers.
5. **Debounced, Idempotent Profile Updates**:
   Resize events are debounced by `150ms` so dragging a window does not rebuild the profile on every pixel. `profilesEqual()` compares every profile field and returns the previous object when nothing changed, preventing a cascade of re-renders through every `useAdaptivePerformance()` consumer. Pending resize timers are cleared on unmount.
6. **Hardware GPU Layer Promotion**:
   Critical animated UI elements (`FakeChatScene.tsx`, `WishDeck.tsx`, `Balloons.tsx`, `EnvelopeLetterScene.tsx`) utilize `transform-gpu` and `will-change: transform`. This promotes elements directly to GPU compositor textures, completely preventing CPU layout invalidations and paint thrashing during fast touch scrolling.

---

## 3. WebGL & Three.js Optimization in `Cake3D.tsx`

Located in [`src/components/birthday/Cake3D.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/Cake3D.tsx):

```tsx
// Dynamic DPR capping to prevent GPU fillrate throttling on mobile
const perfProfile = useAdaptivePerformance();
const dpr = perfProfile.dpr;

<Canvas
  dpr={dpr}
  shadows
  gl={{
    powerPreference: 'high-performance',
    antialias: !perfProfile.isMobile,
  }}
>
```

- **Floating Orbs**: Scaled down from 14 to 4 on mobile devices.
- **Shadow Maps**: Configured to $256 \times 256$ on low tier vs $1024 \times 1024$ on desktop.
- **Acoustic Wind Physics**: Flame lean and wind displacement physics compute with zero allocation overhead inside `useFrame`.
- **Smoke Lifetime**: Extinguished-candle smoke is driven by elapsed time instead of unbounded per-frame position/scale additions. It stops expanding after roughly `4.5s` and is hidden, preventing giant transparent smoke spheres from accumulating.
- **Single Click Path**: The redundant `onClick` binding inside the 3D cake group was removed; click handling remains at the cake-experience level so the WebGL scene does not register duplicate interactions.
- **Cancellable Ceremony**: `CakeCutting.tsx` assigns every cut/blow sequence a run id and tracks its timers. Closing the modal, pressing Escape, finishing, or unmounting invalidates the run so late timers cannot re-open the experience or fire stale sounds.
- **Particle Budgets**: `MagicDust` uses `12` particles on low tier, `16` on mobile, and `32` on desktop (down from `40`).

---

## 4. Modern Web Guidance & DOM Layout Deferral

Following Google's Modern Web Guidance:
- Sections positioned below the fold (such as [`GuestbookSection.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/GuestbookSection.tsx) and [`HeartTree.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/HeartTree.tsx)) utilize CSS `content-visibility: auto`:

```css
#guestbook-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 650px;
}
```

This instructs modern browser rendering engines (Chrome 108+, Safari 18+, Firefox 130+) to skip layout recalculation and paint cycles until the element approaches the viewport, completely eliminating offscreen rendering stutter.

### 4.1 Backdrop-Filter Gating (`.perf-low`)

`src/pages/Index.tsx` adds the `perf-low` class to the root `<main>` whenever `perf.tier === 'low'`. `src/index.css` then removes `backdrop-filter` from every descendant:

```css
.perf-low *,
.perf-low *::before,
.perf-low *::after {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}
```

Translucent backgrounds and border treatments remain visually intact; only the expensive compositor blur pass is skipped. Desktop and balanced profiles keep their original glassmorphism.

### 4.2 Offscreen Animation Gating

- `BalloonPopGame.tsx` keeps a live `IntersectionObserver` (not a one-shot trigger) and pauses the infinite fairy-light and balloon-float animations while the section is offscreen.
- `HeartTree.tsx` keeps a separate `isOnScreen` state so `TreeSparks` unmounts when the tree leaves the viewport, while the one-time bloom reveal remains latched.
- Both components fall back to "visible" in JSDOM or browsers without `IntersectionObserver`, so tests and unsupported environments do not stall.

### 4.3 Form State Isolation

`GuestbookSection.tsx` renders its form through an isolated `GuestbookWishForm` component. Name, message, role, emoji, color, and submit-feedback state live inside the form, so typing a 300-character wish no longer re-renders the entire wishes grid. The parent only receives the completed draft.

### 4.4 Cake Selector Asset Budget

The four cake selector images in `src/assets/birthday/` are `640×640` JPEG q88 assets totaling roughly `431 KB`, replacing PNG sources that totaled roughly `2.7 MB`. They are decoded asynchronously (`decoding="async"`) and remain below the project's `500 KB` per-image guideline. WebP/AVIF remains the preferred future format when an encoder is available in the build pipeline.

---

## 5. Emotional Simplification Across All Templates

Per user design philosophy, visual noise has been simplified in favor of deep emotional intimacy:
- **Intimate Tone**: Shifted emphasis from chaotic party animations to heartfelt sentiments, the interactive handwritten letter (`EnvelopeLetterScene`), and the **Live Wishes Board** (`GuestbookSection`).
- **Template Adaptation**: Starter wishes and tones naturally adapt to the recipient's relationship:
  - **`partner`**: Romantic devotion, tenderness, and shared dreams.
  - **`mother`**: Reverence, profound gratitude, and safe harbor warmth.
  - **`father`**: Guidance, enduring strength, and quiet pride.
  - **`friend`**: Loyal camaraderie, shared laughter, and uplifting milestones.
  - **`family`**: Generational blessings and warmth of home.
- **Multilingual Resonance**: Fully localized into English, Bengali, Hindi, and French.

---

## 6. Environment & URL Configuration Reference

| Key | Type | Default | Description |
|---|---|---|---|
| `VITE_FORCE_HIGH_GRAPHICS` | Boolean | `false` | Force high-fidelity graphics and disable mobile throttling. |
| `VITE_SHOW_GUESTBOOK_SECTION` | Boolean | `true` | Show the interactive guestbook / wishes board. |
| `?highGraphics=true` | URL Query | — | Force high graphics via shareable URL. |
| `?guestbook=false` | URL Query | — | Disable the guestbook section via URL. |
