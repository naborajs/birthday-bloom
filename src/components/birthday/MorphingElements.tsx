import { motion } from "framer-motion";

interface MorphShape {
  id: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  startX: number;
  startY: number;
}

export const MorphingElements = () => {
  const shapes: MorphShape[] = [
    {
      id: 1,
      delay: 0,
      duration: 6,
      color: "rgba(255, 107, 107, 0.15)",
      size: 200,
      startX: 10,
      startY: 15,
    },
    {
      id: 2,
      delay: 0.5,
      duration: 8,
      color: "rgba(78, 205, 196, 0.1)",
      size: 300,
      startX: 75,
      startY: 10,
    },
    {
      id: 3,
      delay: 1,
      duration: 7,
      color: "rgba(255, 230, 109, 0.08)",
      size: 250,
      startX: 20,
      startY: 70,
    },
    {
      id: 4,
      delay: 0.2,
      duration: 9,
      color: "rgba(149, 225, 211, 0.12)",
      size: 280,
      startX: 85,
      startY: 75,
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            left: `${shape.startX}%`,
            top: `${shape.startY}%`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
