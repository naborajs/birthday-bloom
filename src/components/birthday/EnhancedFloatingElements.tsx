import { motion } from "framer-motion";

interface FloatingElement {
  id: number;
  emoji: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
  opacity: number;
}

export const EnhancedFloatingElements = () => {
  const elements: FloatingElement[] = [
    {
      id: 1,
      emoji: "🎉",
      delay: 0,
      duration: 4,
      startX: 15,
      startY: 20,
      size: 32,
      opacity: 0.6,
    },
    {
      id: 2,
      emoji: "✨",
      delay: 0.3,
      duration: 5,
      startX: 85,
      startY: 30,
      size: 28,
      opacity: 0.7,
    },
    {
      id: 3,
      emoji: "🎊",
      delay: 0.6,
      duration: 6,
      startX: 25,
      startY: 75,
      size: 36,
      opacity: 0.5,
    },
    {
      id: 4,
      emoji: "🌟",
      delay: 0.9,
      duration: 4.5,
      startX: 70,
      startY: 80,
      size: 30,
      opacity: 0.6,
    },
    {
      id: 5,
      emoji: "💫",
      delay: 1.2,
      duration: 5.5,
      startX: 50,
      startY: 15,
      size: 26,
      opacity: 0.65,
    },
    {
      id: 6,
      emoji: "🎈",
      delay: 1.5,
      duration: 6,
      startX: 10,
      startY: 60,
      size: 34,
      opacity: 0.55,
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.startX}%`,
            top: `${element.startY}%`,
            fontSize: element.size,
            opacity: element.opacity,
          }}
          animate={{
            y: [-20, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
            rotate: [0, 360],
            scale: [1, 1.2, 0.8],
            opacity: [element.opacity, element.opacity * 0.7, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};
