import { motion } from "framer-motion";

interface Orb {
  id: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  initialX: number;
  initialY: number;
}

export const FloatingOrbs = ({ count = 8 }) => {
  const orbs: Orb[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: ["#FF1493", "#00FFFF", "#FFD700", "#FF69B4", "#4ECDC4"][i % 5],
    size: 40 + Math.random() * 60,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 2,
    initialX: Math.random() * 80 + 10,
    initialY: Math.random() * 80 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 30% 30%, ${orb.color}88, ${orb.color}22)`,
            left: `${orb.initialX}%`,
            top: `${orb.initialY}%`,
          }}
          animate={{
            x: [0, Math.sin(orb.id) * 200, 0],
            y: [0, Math.cos(orb.id) * 200, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
