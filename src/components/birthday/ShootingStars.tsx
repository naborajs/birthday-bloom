import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export const ShootingStars = ({ count = 10 }) => {
  const stars: Star[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 1.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            x: [0, 200],
            y: [0, -200],
            opacity: [1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="w-1 h-1 bg-white rounded-full shadow-lg"
            style={{
              width: star.size,
              height: star.size,
              boxShadow: "0 0 10px #fff, 0 0 20px #fff",
            }}
            animate={{
              boxShadow: [
                "0 0 5px #fff, 0 0 10px #fff",
                "0 0 15px #fff, 0 0 25px #fff",
                "0 0 5px #fff, 0 0 10px #fff",
              ],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
