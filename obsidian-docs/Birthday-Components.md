---
tags: [birthday, components, cinematic, react-three-fiber, ui, animations]
aliases: [Birthday Components, Cinematic Experience]
---

# Birthday Components Engine
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom cinematic experience relies on a complex orchestration of 43 distinct components located inside the `src/components/birthday/` directory.

These components are mostly conditionally rendered via the central orchestrator: [[MainBirthday.tsx]]. Below is an exhaustive breakdown of **every single component** and its responsibility in the experience.

---

## 1. Orchestration & Core
- **[[MainBirthday.tsx]]**: The absolute core of the app. It watches `phase` from [[useBirthdayStore]] (Mount, Cake, Reveal, Quotes, Final) and triggers the mount/unmount of all other components. It handles the initial splash screen logic.
- **[[SplashScreen.tsx]]**: The entry loading screen. Handles preloading fonts, images, and audio, showing a progress bar before transitioning to the `Mount` phase.
- **[[SoundManager.tsx]]**: An invisible component responsible for orchestrating background music using the Web Audio API based on the active phase.

## 2. The 3D Cake Phase
This section relies heavily on React Three Fiber (`@react-three/fiber`) and Drei.
- **[[Cake3D.tsx]]**: The core 3D model. It uses `@react-spring/three` to animate a slice being pulled out when the user "cuts" the cake.
- **[[CakeVisuals.tsx]]**: Connects the 3D `<Canvas>` from R3F and passes the lighting and shadow configurations to `Cake3D`.
- **[[CakeCutting.tsx]]**: The 2D UI overlay for the cutting phase. It presents the "Swipe to cut" instruction.
- **[[CakeKnife.tsx]]**: The interactive knife graphic that tracks cursor/touch events to slice the cake.
- **[[CakeTypes.ts]]**: TypeScript definitions for cake variants (Maroon, Green, Pink).

## 3. The Cinematic Reveal Phase
After cutting the cake, the UI transitions to a text/story-driven phase.
- **[[CinematicIntro.tsx]]**: Handles massive text reveals, using staggered framer-motion variants defined in [[dynamicVariants]].
- **[[TypeWriter.tsx]]**: A robust typewriter effect that can stagger individual letters or words.
- **[[TextRevealEffect.tsx]]**: A specialized reveal component for massive headlines.
- **[[KineticText.tsx]]**: Handles fast-moving, kinetic typography effects.
- **[[GlitchEffect.tsx]]**: A stylistic, cyberpunk-style text glitch for transitions.

## 4. The Gallery & Memories
- **[[PhotoGallery.tsx]]**: A heavily animated Masonry-style grid for showing user photos loaded via `.env` (or Unsplash fallbacks).
- **[[VideoGallery.tsx]]**: Supports autoplaying/looping video memories.
- **[[FakeChatScene.tsx]]**: A highly detailed component mimicking an iMessage/WhatsApp interface, where messages from friends (defined in templates) "type" themselves out sequentially.
- **[[PasswordUnlock.tsx]]**: An optional lock screen component that requires a secret code (configured via env) before viewing the gallery.

## 5. Particle & Environmental Effects (Framer Motion)
These components add the "juice" to the experience. They use pure Framer Motion or DOM manipulation.
- **[[ParticleBurst.tsx]]**: Generates 2D particles (SVG or Div) on user clicks (like fireworks or starbursts).
- **[[Balloons.tsx]]**: Spawns floating balloons from the bottom of the screen.
- **[[Confetti.tsx]]**: Uses `canvas-confetti` (or custom logic) to blast confetti after the cake is cut.
- **[[DigitalRain.tsx]]**: A Matrix-style code rain effect.
- **[[EmojiCursorTrail.tsx]]**: Follows the user's mouse with a trail of contextual emojis.
- **[[EnhancedFloatingElements.tsx]]**: Smoothly interpolates elements (like hearts/stars) randomly across the screen.
- **[[FloatingElements.tsx]]**: The legacy/base floating engine.
- **[[FloatingOrbs.tsx]]**: Renders glowing CSS orbs with blur filters.
- **[[MorphingElements.tsx]]**: SVG shapes that morph (e.g. circle to heart).
- **[[PartyElements.tsx]]**: Confetti poppers and party hats.
- **[[RibbonEffect.tsx]]**: Wavy, trailing CSS ribbons.
- **[[ShootingStars.tsx]]**: Fast CSS animations simulating shooting stars diagonally.
- **[[SparkleEffect.tsx]] & [[SparkleRain.tsx]] & [[Sparkles.tsx]]**: Variations of glowing, rotating SVG stars using Framer Motion.
- **[[TunnelEffect.tsx]]**: A 3D CSS optical illusion tunnel for transitions.
- **[[WaveEffect.tsx]]**: Sine-wave animations for backgrounds.
- **[[FireflyEffect.tsx]]**: Small glowing dots with chaotic paths (like fireflies).
- **[[LiquidSwirl.tsx]]**: CSS filter-based gooey liquid animations.
- **[[AnimatedGradient.tsx]]**: A shifting background hue gradient.
- **[[CelebrationOverlay.tsx]]**: A full-screen overlay for max climax.

## 6. The Finale (HeartTree)
- **[[HeartTree.tsx]]**: The absolute climax of the animation. It draws an SVG tree using `requestAnimationFrame`, where each branch blooms into a heart. It requires extreme performance optimization to prevent memory leaks and React `exhaustive-deps` warnings.
- **[[HeartProgression.tsx]]**: The UI that wraps the HeartTree and displays the final personalized message.

## 7. Interactive Elements
- **[[BirthdayQuiz.tsx]]**: An optional interactive quiz about the birthday person.
- **[[PremiumFireworks.tsx]]**: Intense fireworks rendering (Canvas or complex DOM).
- **[[FinalSurprise.tsx]]**: The absolute final screen, showing the ultimate message and restart button.

---
#obsidian #documentation #birthday-bloom #vault #components
