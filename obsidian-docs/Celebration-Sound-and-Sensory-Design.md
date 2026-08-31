# Celebration Sound, Haptic & Sensory Design Guide

> **Status**: Core Sensory Architecture Document  
> **Topic**: Acoustic Neuro-Triggers, Mobile Haptics, Particle Physics & Sensory Harmony  
> **Target Audience**: Birthday Bloom Designers & Audio/UX Engineers

---

## 1. Acoustic Psychology & Emotional Soundscapes

Sound is the fastest pathway to the human emotional center (the amygdala). In Birthday Bloom, auditory cues are not decorative noise—they are emotional timestamps that structure the recipient's journey.

```
                          SENSORY SYNCHRONIZATION
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
      [ HARMONIC AUDIO ]      [ MOBILE HAPTICS ]      [ VISUAL PARTICLES ]
      • Ambient Lofi/Romantic • Heartbeat Thumps      • Rose Petals & Stars
      • Chime Cascades        • Confetti Shakes       • Screen Flashes
      • Typewriter Cadence    • Tap Vibrations        • Floating Orbs
```

### 1.1 Sound Categories & Psychological Functions

| Sound Trigger | Acoustic Quality | Neurochemical Goal | Component Link |
| :--- | :--- | :--- | :--- |
| **Background Music (`bgmUrl`)** | Warm piano, acoustic guitar, soft strings, lofi chill | Reduces cortisol, fosters emotional intimacy | [`SoundManager.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/SoundManager.tsx) |
| **Typewriter Clicks (`playType`)** | Crisp, mechanical tactile taps (80–120ms) | Focuses attention word-by-word; dopamine anticipation | [`CinematicIntro.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/CinematicIntro.tsx) |
| **Whoosh Transition (`playWhoosh`)** | Low-frequency stereo swoosh (200–500ms) | Signals narrative transition between acts | [`FakeChatScene.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/FakeChatScene.tsx) |
| **Grand Reveal Boom (`playBoom`)** | Deep sub-bass impact (50–80Hz) + sparkle tail | Climactic endorphin rush; awe and scale | [`CinematicIntro.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/CinematicIntro.tsx) |
| **Chime & Pop Cascade (`playPop`, `playReveal`)** | High pentatonic bells (C6–G6 harmonic ring) | Delight, celebratory payoff | [`Confetti.tsx`](file:///d:/Projects/Website/birthday-bloom/src/components/birthday/Confetti.tsx) |

---

## 2. Browser Autoplay & AudioContext Unlocking

Modern browsers (Chrome, Safari, iOS WebKit) strictly enforce audio autoplay restrictions. Audio playback without a prior user gesture throws `NotAllowedError`.

### 2.1 The Seamless Unlock Flow

1. **User Interaction Gate**: The entry [[SplashScreen.tsx]] displays an inviting pulsating button ("Tap to Start the Magic").
2. **AudioContext Activation**: The first touch/click event triggers:
   ```typescript
   // Immediate resume on user gesture
   if (audioContext && audioContext.state === 'suspended') {
     await audioContext.resume();
   }
   ```
3. **Smooth Exponential Fade-In**: Rather than abruptly blaring audio, `SoundManager` ramps volume from `0.0` to target volume ($V_{\text{target}}=0.6$) over `1500ms` using exponential gain curves to prevent acoustic shock.

---

## 3. Mobile Haptic Vibration Architecture

Mobile devices offer direct tactile feedback through the `navigator.vibrate()` API. Birthday Bloom synchronizes physical device pulses with on-screen visual climaxes:

```typescript
// Standard Celebration Haptic Patterns
export const HAPTIC_PATTERNS = {
    /** Gentle tap on button or heart touch */
    SOFT_TAP: 25,
    /** Mimics human heartbeat during suspense sequences */
    HEARTBEAT: [40, 100, 60, 300],
    /** Energetic burst during confetti release */
    CONFETTI_BURST: [60, 40, 60, 40, 100],
    /** Deep rumble for the Grand Name Reveal */
    GRAND_REVEAL: [80, 50, 120, 50, 200],
};
```

### 3.1 Graceful Degradation
- If `navigator.vibrate` is unsupported (e.g. desktop browsers, iOS Safari), haptic calls fail silently without breaking execution.
- Visual micro-shakes (CSS keyframe transforms) provide visual parity on devices lacking physical vibration hardware.

---

## 4. Visual Particle Physics & Performance Guardrails

A common flaw in celebration websites is overwhelming the device with hundreds of un-optimized DOM nodes, causing stutters and device heating.

### 4.1 The Golden Ratio of Celebration Elements

| Phase | Particle Cap | Type | Frame Budget |
| :--- | :--- | :--- | :--- |
| **Splash Screen** | 12 elements | Subtle twinkling stars + 3 CSS radial auras | 60 FPS (16.6ms) |
| **Storytelling Intro** | 8 sparkles | Typewriter kinetic letters + floating emojis | 60 FPS (16.6ms) |
| **Grand Climax** | 200–300 particles | Canvas-based multi-directional confetti + fireworks | 60 FPS (Canvas2D) |
| **Main Exploration** | 12 floating orbs | Parallax scroll + lazy-loaded galleries | 60 FPS (CSS transforms) |

---

## 5. Sensory Checklist for Authors & Creators

1. [x] Background music is soft, romantic, and loops seamlessly without clipping.
2. [x] Sound effects can be toggled on/off instantly via `VITE_SOUND_EFFECTS`.
3. [x] All heavy particle bursts are canvas-rendered (`canvas-confetti`) rather than DOM elements.
4. [x] Screen shakes and flashes respect `VITE_REDUCED_MOTION=true` for accessibility.
5. [x] Audio state is cleanly torn down on unmount to prevent background audio leaks.

