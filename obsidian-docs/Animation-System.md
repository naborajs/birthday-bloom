---
tags: [animation, framer-motion, react-three-fiber, ui, visual]
aliases: [Animation System, Animations, Visuals]
---

# Animation System
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom project is a highly visual and cinematic experience, powered largely by two major animation libraries:

## Framer Motion
Framer Motion is used for 2D UI animations, transitions, and text reveals.
- **[[dynamicVariants]]**: A central configuration file (`src/features/cinematic-story/animations/dynamicVariants.ts`) handles reusable stagger, fade, and slide animations.
- **[[TypeWriter]]**: The `TypeWriter.tsx` component orchestrates staggered character and word reveals.
- **[[ParticleBurst]]**: Lightweight DOM-based particle generation for click effects.
- **[[HeartTree]]**: Combines Framer Motion and SVGs for a complex blooming effect.

## React Three Fiber (R3F)
For true 3D elements, we utilize R3F alongside `@react-spring/three`.
- **[[Cake3D]]**: Renders a configurable 3D cake (`src/components/birthday/Cake3D.tsx`). It uses:
  - `Float` and `ContactShadows` from `@react-three/drei` for ambient floating effects.
  - `@react-spring/three` to animate the cake slice separating during the cutting phase.
- **Lighting**: Cinematic lighting is achieved via `ambientLight`, `directionalLight`, and `pointLight` within the `Scene`.

## Global Animation Logic
Animations are deeply tied to the global state managed in [[useBirthdayStore]]. The `phase` variable triggers Mount/Unmount transitions across the entire app.

---
#obsidian #documentation #birthday-bloom #vault #animation
