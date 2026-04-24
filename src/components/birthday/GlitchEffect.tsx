import { motion } from "framer-motion";

export const GlitchEffect = ({ text = "HAPPY BIRTHDAY", color = "#FF6B6B" }) => {
  return (
    <div className="relative h-32 flex items-center justify-center">
      {/* Base text */}
      <motion.div
        className="text-5xl font-bold tracking-widest"
        style={{ color }}
        animate={{
          opacity: [1, 0.8, 1],
          textShadow: [
            "0 0 10px rgba(255, 107, 107, 0.5)",
            "0 0 20px rgba(255, 107, 107, 0.8)",
            "0 0 10px rgba(255, 107, 107, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.div>

      {/* Glitch layer 1 - Red offset */}
      <motion.div
        className="absolute text-5xl font-bold tracking-widest"
        style={{
          color: "#FF1493",
          opacity: 0.3,
          mixBlendMode: "screen",
        }}
        animate={{
          x: [-3, 3, -2, 2, -3],
          opacity: [0.3, 0.1, 0.3, 0.15, 0.3],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
      >
        {text}
      </motion.div>

      {/* Glitch layer 2 - Cyan offset */}
      <motion.div
        className="absolute text-5xl font-bold tracking-widest"
        style={{
          color: "#00FFFF",
          opacity: 0.3,
          mixBlendMode: "multiply",
        }}
        animate={{
          x: [3, -3, 2, -2, 3],
          opacity: [0.3, 0.15, 0.3, 0.1, 0.3],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
      >
        {text}
      </motion.div>
    </div>
  );
};
