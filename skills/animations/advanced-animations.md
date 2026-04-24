# Advanced Animation Patterns

This document details advanced animation strategies, focusing on pushing UI/UX beyond basic transitions while maintaining 60fps performance.

## Framer Motion: Beyond `initial` and `animate`

Basic animations are fine, but professional UIs rely on orchestration and physics-based interactions.

### 1. Variants & Orchestration
Instead of hardcoding animation states on individual elements, use `variants` to propagate animations down the DOM tree.

```tsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children sequentially
      delayChildren: 0.3,   // Delay before starting children
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const StaggeredList = ({ items }) => (
  <motion.ul variants={containerVariants} initial="hidden" animate="visible">
    {items.map((item) => (
      <motion.li key={item.id} variants={itemVariants}>
        {item.content}
      </motion.li>
    ))}
  </motion.ul>
);
```

### 2. Layout Animations (`layoutId`)
Shared element transitions create a seamless experience. Use `layoutId` to animate an element from one component to another (e.g., clicking a list item to open a detail view).

```tsx
// List Item
<motion.img layoutId={`image-${item.id}`} src={item.src} className="w-16 h-16" />

// Detail View (in AnimatePresence)
<motion.img layoutId={`image-${item.id}`} src={item.src} className="w-full h-96" />
```

### 3. Scroll-Driven Animations (`useScroll`)
Bind animation values directly to scroll progress for parallax or scrubbable animations.

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <motion.div style={{ y, opacity }} className="relative h-screen bg-black">
      <h1 className="text-white text-9xl">Scroll Me</h1>
    </motion.div>
  );
};
```

## Real-world Animation Patterns

### The Cinematic Intro
To create a "Birthday Bloom" style intro, avoid `setTimeout` chains when possible. Use Framer Motion's `useAnimate` hook to build a robust timeline.

```tsx
import { useAnimate } from "framer-motion";
import { useEffect } from "react";

export const CinematicSequence = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      // 1. Fade in text
      await animate(".text-1", { opacity: 1, y: 0 }, { duration: 1 });
      // 2. Wait 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
      // 3. Fade out text-1, pop in text-2
      animate(".text-1", { opacity: 0, scale: 0.9 }, { duration: 0.5 });
      await animate(".text-2", { opacity: 1, scale: [0.8, 1.1, 1] }, { duration: 0.8 });
    };
    sequence();
  }, [animate]);

  return (
    <div ref={scope}>
      <h1 className="text-1 opacity-0 translate-y-4">A story begins...</h1>
      <h1 className="text-2 opacity-0">With you.</h1>
    </div>
  );
};
```

## Performance Tips

1.  **Animate Compositor Properties Only**: Stick to `transform` (translate, scale, rotate) and `opacity`. Animating `width`, `height`, or `top`/`left` triggers layout recalculations (reflows) which kill frame rates.
2.  **`will-change`**: If an element has a complex animation, hint the browser using `will-change: transform`. Do not overuse this, as it consumes GPU memory.
3.  **Reduce React Renders**: Do not tie animation frames to React state (e.g., updating a state variable on every `requestAnimationFrame`). Use Framer Motion's `useMotionValue` or CSS variables.

## GSAP vs. Framer Motion

*   **Framer Motion**: The go-to for React. Declarative, integrates perfectly with React's render cycle, excellent for component entering/exiting (`AnimatePresence`), and spring physics.
*   **GSAP (GreenSock)**: The industry standard for complex, sequenced, timeline-based animations (especially scroll-driven). It's imperative. Use GSAP when building highly complex landing pages with intricate SVG animations, 3D scroll-scrubbing, or when performance is failing under Framer Motion due to sheer element count.
