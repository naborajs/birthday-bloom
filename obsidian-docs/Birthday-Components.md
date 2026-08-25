---
tags: [birthday, components, cinematic, react-three-fiber, ui, animations]
aliases: [Birthday Components, Cinematic Experience]
---

# Birthday Components Engine
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom cinematic experience relies on an optimized suite of 29 specialized components located inside the `src/components/birthday/` directory.

These components are conditionally orchestrated across the 4-phase state machine (`splash` $\rightarrow$ `unlock` $\rightarrow$ `intro` $\rightarrow$ `main`) via [[Index.tsx]] and [[MainBirthday.tsx]].

---

## 1. Orchestration & Gateway
- **[[MainBirthday.tsx]]**: The central dashboard and stage orchestrator for the `main` phase. Coordinates the hero section, interest badges, message card, wishes grid, cake cutting, quiz, heart tree, galleries, and footer.
- **[[SplashScreen.tsx]]**: The entry loading screen. Handles initial user gesture to unlock Web Audio playback, font preloading, and dynamic heart progress loading.
- **[[PasswordUnlock.tsx]]**: Optional frosted-glass passcode gatekeeper screen. Validates birthday dates (`MMDD`, `YYYYMMDD`, etc.) or custom passwords with vibration and shake animations.
- **[[SoundManager.tsx]]**: Singleton `AudioManager` coordinating background music loop, fade-in/fade-out, and interactive sound effects (typewriter, chimes, pops, fireworks, cake cuts).

## 2. The 3D & 2D Cake Cutting Experience
Powered by React Three Fiber (`@react-three/fiber`), Drei, and React Spring:
- **[[Cake3D.tsx]]**: 3D cake model utilizing procedural geometry, ambient lighting, contact shadows, and dynamic slicing spring physics.
- **[[CakeVisuals.tsx]]**: 3D `<Canvas>` scene wrapper configuring camera frustum, lighting parameters, and shadow maps.
- **[[CakeCutting.tsx]]**: 2D/3D composite interaction orchestrator managing the 4 cake stages (flavor selection, candle blow, wish making, slice cutting) and reduced motion adaptation.
- **[[CakeKnife.tsx]]**: Interactive cursor-tracking knife and drag gesture controller.
- **[[CakeTypes.ts]]**: TypeScript definitions for cake variants, geometries, and slice angles.

## 3. Cinematic Storytelling & Typography
- **[[CinematicIntro.tsx]]**: Multi-scene narrative timeline coordinating storytelling sequences, typing intervals, simulated chat dialogues, and grand reveal payoff.
- **[[TypeWriter.tsx]]**: Grapheme-safe recursive typewriter component with custom speed multipliers, blinking cursor, and sound synchronization.
- **[[KineticText.tsx]]**: Dynamic kinetic typography component for animated character reveals and emotional headlines.
- **[[HighlightedText.tsx]]**: Gradient and glowing text highlighter with subtle shimmer animations.
- **[[FakeChatScene.tsx]]**: Realistic simulated messaging window where friends/loved ones type emotional birthday messages sequentially with realistic typing indicators.

## 4. Memories & Media
- **[[PhotoGallery.tsx]]**: Polaroid-style 3D-tilt slider gallery with caption reveal, lightbox expansion, and automatic multi-language placeholder card when custom photos are omitted.
- **[[VideoGallery.tsx]]**: Video memories carousel supporting YouTube embeds and direct MP4/WebM videos.
- **[[SpecialMemories]] / [[FinalSurprise.tsx]]**: Grand finale celebration screen with memory cards, closing video embed, and celebration replay button.

## 5. Ambient & Sensory Effects Layer
High-performance 60fps ambient visual effects running across mobile and desktop:
- **[[PremiumFireworks.tsx]]**: HTML5 Canvas 2D fireworks particle engine with realistic physics, gravity, and color blending.
- **[[SparkleRain.tsx]]**: Ambient falling sparkle canvas with alpha falloff.
- **[[FireflyEffect.tsx]]**: Organic glowing fireflies floating across the screen.
- **[[ShootingStars.tsx]]**: Ambient diagonal shooting star streaks.
- **[[EmojiCursorTrail.tsx]]**: Interactive mouse and touch cursor trail spawning relationship-tailored emojis.
- **[[Balloons.tsx]]**: Floating SVG balloons with physics drift and interactive click-to-pop sound effects.
- **[[Confetti.tsx]]**: Layered multi-cannon confetti bursts powered by `canvas-confetti`.
- **[[FloatingElements.tsx]]**: Ambient floating emoji and token particles with parallax depth.
- **[[Sparkles.tsx]]**: SVG star sparkles and glowing ambient orbs.

## 6. Climax & Gamification
- **[[HeartTree.tsx]]**: The emotional visual climax of the celebration. Draws an SVG tree using `requestAnimationFrame` where branches bloom into hearts.
- **[[HeartProgression.tsx]]**: Multi-stage SVG heart progress tracker used across splash and reveal screens.
- **[[BirthdayQuiz.tsx]]**: Gamified trivia quiz that adapts questions dynamically based on the celebrant's interests and relationship.

---
#obsidian #documentation #birthday-bloom #vault #components
