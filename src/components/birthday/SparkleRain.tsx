import { motion } from "framer-motion";

interface Sparkle {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export const SparkleRain = ({ intensity = 20 }) => {
  const sparkles: Sparkle[] = Array.from({ length: intensity }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: "#ffffff",
            opacity: sparkle.opacity,
            boxShadow: "0 0 6px #ffffff",
            top: "-10px",
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            opacity: [sparkle.opacity, 0],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
