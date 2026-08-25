---
tags: [animation, framer-motion, react-three-fiber, ui, visual]
aliases: [Animation System, Animations, Visuals]
---

# Animation System
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom project is a highly visual and cinematic experience, powered by an optimized multi-tier animation architecture:

## 1. Framer Motion
Framer Motion is used for 2D UI animations, page/phase transitions, and text reveals:
- **[[dynamicVariants]]**: A central configuration module (`src/features/cinematic-story/animations/dynamicVariants.ts`) handles reusable stagger, fade, slide, and scale animations.
- **[[TypeWriter]]**: The `TypeWriter.tsx` component orchestrates grapheme-safe staggered character and word reveals.
- **[[KineticText]]**: High-impact kinetic typography transitions for celebratory headlines.
- **[[HeartTree]]**: Combines Framer Motion and SVG path animations for a procedural multi-stage blooming memory tree.
- **[[Balloons]] & [[Sparkles]]**: Ambient floating elements with physics-spring drift and pop interactions.

## 2. React Three Fiber (R3F) & 3D WebGL
For realistic 3D celebration interactions, we utilize R3F alongside `@react-spring/three`:
- **[[Cake3D]]**: Renders a procedural 3D cake (`src/components/birthday/Cake3D.tsx`) utilizing:
  - `Float` and `ContactShadows` from `@react-three/drei` for ambient floating effects.
  - `@react-spring/three` to animate the cake slice separating dynamically during the cutting phase.
- **Lighting & Shadows**: Cinematic lighting is achieved via `ambientLight`, `directionalLight`, and `pointLight` within the Three.js Canvas.

## 3. Canvas 2D Celebratory Physics
- **[[PremiumFireworks]]**: High-performance HTML5 Canvas 2D fireworks engine with particle trails, gravity simulation, and velocity physics.
- **[[SparkleRain]]**: Cascading ambient particle field with dynamic alpha falloff.
- **[[EmojiCursorTrail]]**: Interactive mouse/touch trail spawning culturally authentic emojis.
- **[[Confetti]]**: Multi-cannon confetti bursts powered by `canvas-confetti`.

## 4. Accessibility & Reduced Motion
The animation engine respects the user's OS preference (`prefers-reduced-motion`) and supports explicit override via `VITE_REDUCED_MOTION=true` in `useBirthdayStore.ts`. In reduced motion mode:
- 3D transforms, heavy spring physics, and particle densities in `CakeCutting.tsx` and ambient layers are simplified or bypassed.
- Transitions use gentle opacity fades rather than rapid transforms.

## 5. Global Animation Logic
Animations are synchronized with the state machine managed in [[useBirthdayStore]]. The `phase` variable (`splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`) coordinates clean mount/unmount lifecycles across the application.

---
#obsidian #documentation #birthday-bloom #vault #animation
