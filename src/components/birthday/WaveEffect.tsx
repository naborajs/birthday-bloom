import { motion } from "framer-motion";

export const WaveEffect = ({ color = "rgba(255, 107, 107, 0.3)", count = 4 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: color,
            width: 100 + i * 50,
            height: 100 + i * 50,
          }}
          animate={{
            scale: [1, 2 + i * 0.5],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};
