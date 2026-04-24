import { motion } from "framer-motion";

interface Gradient {
  id: number;
  delay: number;
  rotation: number;
  color1: string;
  color2: string;
}

export const AnimatedGradient = () => {
  const gradients: Gradient[] = [
    {
      id: 1,
      delay: 0,
      rotation: 0,
      color1: "rgba(255, 107, 107, 0.2)",
      color2: "rgba(255, 182, 193, 0.1)",
    },
    {
      id: 2,
      delay: 1,
      rotation: 120,
      color1: "rgba(78, 205, 196, 0.15)",
      color2: "rgba(149, 225, 211, 0.08)",
    },
    {
      id: 3,
      delay: 2,
      rotation: 240,
      color1: "rgba(255, 230, 109, 0.1)",
      color2: "rgba(255, 215, 0, 0.05)",
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {gradients.map((gradient) => (
        <motion.div
          key={gradient.id}
          className="absolute inset-0"
          style={{
            background: `conic-gradient(${gradient.color1}, ${gradient.color2})`,
            filter: "blur(80px)",
          }}
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            delay: gradient.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
