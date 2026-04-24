import { motion } from "framer-motion";

interface Tunnel {
  id: number;
  delay: number;
  size: number;
  color: string;
  opacity: number;
}

export const TunnelEffect = ({ color = "rgba(255, 107, 107, 0.2)" }) => {
  const tunnels: Tunnel[] = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    size: 200 + i * 150,
    color,
    opacity: 0.1 + i * 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {tunnels.map((tunnel) => (
        <motion.div
          key={tunnel.id}
          className="absolute rounded-full border"
          style={{
            width: tunnel.size,
            height: tunnel.size,
            borderColor: tunnel.color,
            opacity: tunnel.opacity,
          }}
          animate={{
            scale: [0.5, 2],
            opacity: [tunnel.opacity, 0],
          }}
          transition={{
            duration: 3,
            delay: tunnel.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};
