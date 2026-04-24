# ✨ Animation & Motion System

The motion in Birthday Bloom is built on **Framer Motion**, following professional cinematography principles to create a "World Class" interactive experience.

## 🎥 Cinematography Principles

### 1. Camera Simulation (Zoom/Pan/Tilt)
Instead of simple fades, scenes transition using camera-like motion:
- **Depth Shift**: Scenes often start with a `1.1x` scale and `blur(20px)`, smoothly focusing as the content appears.
- **Perspective Rotations**: The `FakeChat` and `CinematicIntro` use `rotateX` and `rotateY` to give a 3D depth feel.

### 2. Orchestration & Staggering
We use Framer Motion `variants` to control the sequence of elements:
- **StaggerChildren**: Ensures that text lines and buttons appear one after another, creating a rhythmic visual pace.
- **Spring Physics**: We avoid linear easing. Instead, we use `stiffness: 150` and `damping: 20` for natural, organic movement.

### 3. Kinetic Typography
Text is never static. It uses:
- **TypeWriter Effects**: Realistic character-by-character typing.
- **Pop-out & Zoom-in**: For emphasis on the name and "Happy Birthday" reveal.

---

## 🌪️ Atmospheric Particles
The background uses the `FloatingElements` system which features:
- **3-Layer Parallax**: Background atmosphere, Mid-ground symbols, and Foreground details.
- **Mood-Aware Speed**: Particles move slower for romantic themes and faster for energetic themes.

---

## 🛠️ Implementation Details
Most animations are found in:
- `src/components/birthday/CinematicIntro.tsx`
- `src/components/birthday/MainBirthday.tsx`
- `src/components/birthday/FloatingElements.tsx`

For custom animations, use the `useStoryVariants` hook in the cinematic directory.
