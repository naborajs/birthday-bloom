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
│  • GuestbookSection.tsx: content-visibility: auto layout deferral      │
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
   - Limits max particle count to `12`.
3. **Battery Low Throttling (`isBatteryLow`)**:
   Monitors `navigator.getBattery()`. If battery level falls below 20% while discharging, downstream effects step down to low-power profile to preserve battery life.

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
