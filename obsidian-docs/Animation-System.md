---
tags: [animation, framer-motion, react-three-fiber, ui, visual, physics]
aliases: [Animation System, Animations, Visuals, Motion Engine]
---

# Animation & Motion System Architecture

[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom project is a highly visual, cinematic experience engineered for silky **60 FPS** rendering across mobile and desktop. It is powered by an optimized, multi-tier animation architecture:

---

## 1. Architecture Overview

- **Global Celebration State Machine**: Coordinated through `useBirthdayStore`, driving transitions across `splash`, `unlock`, `intro`, and `main` celebration phases.
- **2D UI & Typography**: Powered by **Framer Motion 13** for smooth component choreography, layout transitions, and interactive gesture feedback.
- **3D WebGL Interactions**: Rendered with **React Three Fiber (Three.js)** and animated via `@react-spring/three` for physical 3D cake cutting and slice separation.
- **Particle Simulations**: Multi-cannon HTML5 Canvas 2D physics engines running off the DOM thread for high-density fireworks and sparkle rain.

---

## 2. Framer Motion 13 Implementation

Framer Motion is used for 2D UI animations, phase transitions, and interactive gesture feedback:

- **[[dynamicVariants]]**: A central configuration module (`src/features/cinematic-story/animations/dynamicVariants.ts`) provides standardized spring curves and transition tokens.
- **[[TypeWriter]]**: The `TypeWriter.tsx` component orchestrates grapheme-safe staggered character and word reveals without breaking Indic conjuncts or French diacritics.
- **[[KineticText]]**: High-impact kinetic typography transitions for celebratory headlines with spring bounce.
- **[[HeartTree]]**: Combines Framer Motion and SVG stroke-dashoffset path animations for a procedural multi-stage blooming memory tree.
- **[[WishDeck]]**: Physics-based card drag and fling mechanics with velocity thresholding and directional exit animations.

### Standard Spring Physics Tokens

| Motion Token | Stiffness ($k$) | Damping ($c$) | Mass ($m$) | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Gentle Float** | 120 | 14 | 1.0 | Ambient balloons, floating sparkle badges |
| **Crisp Spring** | 300 | 25 | 0.8 | Modal popups, button taps, wish card flips |
| **Snappy Snap** | 400 | 30 | 0.5 | Tab switching, quick icon toggles |
| **Cinematic Ease** | — | — | — | `[0.16, 1, 0.3, 1]` for fullscreen phase crossfades |

---

## 3. React Three Fiber (R3F) & 3D WebGL

For tactile 3D celebration interactions, we utilize R3F alongside `@react-spring/three`:

- **[[Cake3D]]**: Renders a procedural 3D cake (`src/components/birthday/Cake3D.tsx`) utilizing:
  - `Float` and `ContactShadows` from `@react-three/drei` for ambient floating effects and grounded soft shadows.
  - `@react-spring/three` to animate the cake slice separating dynamically during the cutting phase with spring-based spatial displacement (`x: 0.8`, `z: 0.6`, `rotationY: 0.25`).
- **Lighting & Material Optimization**:
  - `ambientLight` ($I=0.7$) + `directionalLight` ($I=1.2$, position `[5, 8, 5]`) with mesh standard materials to ensure low memory footprint without HDR environment bloat.

| 3D Cake Flavor Selector | 3D Candle Blow & Slicing |
| :---: | :---: |
| ![Cake Flavor Picker](../docs/screenshots/07-cake-cutting.png) | ![3D Cake with Candle](../docs/screenshots/08-cake-cutting-sliced.png) |

---

## 4. Canvas 2D Celebratory Physics Engines

High-particle effects run on isolated HTML5 Canvas 2D contexts to prevent DOM layout thrashing:

- **[[PremiumFireworks]]**: Canvas 2D fireworks engine with multi-stage explosion physics, gravity vectors ($g=0.08$), velocity decay ($\mu=0.96$), and spark trail dissipation.
- **[[SparkleRain]]**: Ambient vertical particle field with dynamic alpha falloff and sinusoidal drift.
- **[[FireflyEffect]]**: Ambient floating light orbs with Perlin-like random velocity wandering.
- **[[EmojiCursorTrail]]**: Interactive touch/mouse trail spawning culturally authentic emojis that scale down and fade over 800ms.
- **[[Confetti]]**: Multi-cannon confetti bursts powered by `canvas-confetti`.

| Pop The Balloons Physics | Canvas Confetti & Hero Stage |
| :---: | :---: |
| ![Balloon Pop Game](../docs/screenshots/06-balloon-pop-game.png) | ![Hero Celebration Stage](../docs/screenshots/04-hero-celebration.png) |

---

## 5. Procedural Climax: Blooming SVG Heart Tree

![Growing Heart Tree](../docs/screenshots/16-heart-tree.png)

---

## 6. GPU Optimization & Performance Guidelines

To prevent frame drops on low-power mobile devices:
1. **Hardware Acceleration**: Use `transform-gpu`, `translate3d(0, 0, 0)`, and `will-change: transform, opacity` only on active motion layers.
2. **Batch Render Cycles**: Canvas animations utilize `requestAnimationFrame` with delta time normalization ($\Delta t$) to ensure constant velocity across 60Hz, 90Hz, and 120Hz displays.
3. **Automatic Cleanup**: Unmounted scenes cancel animation frames and clear timers immediately to prevent memory leaks.

---

## 6. Accessibility & Reduced Motion

The animation engine automatically respects the user's OS preference (`prefers-reduced-motion: reduce`) and supports explicit overrides via `VITE_REDUCED_MOTION=true`:
- Complex 3D spring displacements in `CakeCutting.tsx` and 3D rotations are simplified to immediate states.
- Canvas particle counts are drastically reduced or substituted with subtle CSS fades.
- Grapheme typewriters render full text immediately without motion lag.

---

## 7. Global Phase State Synchronization

Animations are synchronized with the state machine managed in [[useBirthdayStore]]. The `phase` variable coordinates clean mount/unmount lifecycles:

$$\text{Splash} \xrightarrow{\text{timer / click}} \text{Unlock} \xrightarrow{\text{passcode}} \text{Intro} \xrightarrow{\text{timeline}} \text{Main Experience}$$

---
#obsidian #documentation #birthday-bloom #vault #animation #physics #framer-motion
