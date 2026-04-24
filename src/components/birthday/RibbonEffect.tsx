import { motion } from "framer-motion";

export const RibbonEffect = ({ text = "Happy Birthday", color = "#FF6B6B" }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Top ribbon */}
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            padding: "12px 40px",
            borderRadius: "4px",
            boxShadow: `0 10px 30px ${color}40`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-white font-bold tracking-widest text-lg">
            {text}
          </span>
        </motion.div>

        {/* Ribbon tails */}
        <motion.div
          className="absolute -top-20 -left-20 w-32 h-20"
          style={{
            background: `linear-gradient(to bottom, ${color}88, transparent)`,
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)",
          }}
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-32 h-20"
          style={{
            background: `linear-gradient(to bottom, ${color}88, transparent)`,
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)",
            transform: "scaleX(-1)",
          }}
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};
