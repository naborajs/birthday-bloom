import { motion } from "framer-motion";

export const TextRevealEffect = ({ 
  text = "SURPRISE!", 
  color = "#FF6B6B",
  delay = 0 
}) => {
  return (
    <div className="relative inline-block">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ color }}
          initial={{ opacity: 0, y: 50, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            type: "spring",
            stiffness: 100,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};
