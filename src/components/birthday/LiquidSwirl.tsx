import { motion } from "framer-motion";

export const LiquidSwirl = ({ 
  color = "rgba(255, 107, 107, 0.2)", 
  position = { x: 50, y: 50 } 
}) => {
  const createPath = (offset: number) => {
    const points = [];
    for (let i = 0; i < 360; i += 10) {
      const rad = (i * Math.PI) / 180;
      const x = 150 * Math.cos(rad) + offset * Math.cos(rad * 2);
      const y = 150 * Math.sin(rad) + offset * Math.sin(rad * 2);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <svg
        className="absolute"
        width="400"
        height="400"
        viewBox="-200 -200 400 400"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.polyline
          points={createPath(0)}
          fill="none"
          stroke={color}
          strokeWidth="2"
          animate={{
            d: [
              `M${createPath(0)}`,
              `M${createPath(20)}`,
              `M${createPath(40)}`,
              `M${createPath(0)}`,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};
