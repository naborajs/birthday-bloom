import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useConfetti } from "./Confetti";
import { useSoundManager } from "./SoundManager";

const Balloon = ({ color, delay, x, size }: { color: string; delay: number; x: number; size: number }) => {
  const { firePop } = useConfetti();
  const { playPop } = useSoundManager();
  const [isPopped, setIsPopped] = useState(false);

  if (isPopped) return null;

  return (
    <motion.div
      initial={{ y: "120vh", opacity: 0, rotate: 0 }}
      animate={{ 
        y: ["110vh", "-20vh"], 
        opacity: [0, 1, 1, 0],
        rotate: [0, 15, -15, 0],
        x: [0, 40, -40, 20, -20, 0]
      }}
      transition={{ 
        duration: 18 + Math.random() * 10, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1]
      }}
      onTap={() => {
        setIsPopped(true);
        playPop();
        firePop();
      }}
      className="fixed z-10 pointer-events-auto cursor-pointer"
      style={{ left: `${x}%` }}
    >
      <div className="relative group" style={{ width: size, height: size * 1.3 }}>
        {/* Balloon Body */}
        <div 
          className="w-full h-full rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] transition-transform group-hover:scale-110"
          style={{ 
            backgroundColor: color, 
            opacity: 0.8,
            boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), 0 10px 30px ${color}60` 
          }}
        />
        {/* Balloon String */}
        <div className="w-[1px] h-20 bg-white/30 mx-auto" />
        {/* Reflection */}
        <div className="absolute top-[15%] left-[15%] w-[20%] h-[30%] bg-white/40 rounded-full blur-[1px]" />
      </div>
    </motion.div>
  );
};

const Streamer = ({ color, x, delay }: { color: string; x: number; delay: number }) => (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{ 
      y: "110vh",
      opacity: [0, 1, 1, 0],
      rotate: [0, 360],
      x: [0, 50, -50, 0]
    }}
    transition={{ 
      duration: 10 + Math.random() * 5, 
      delay, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className="fixed z-0 pointer-events-none w-1 h-8"
    style={{ left: `${x}%`, backgroundColor: color }}
  />
);

export const PartyElements = () => {
  const { config } = useBirthdayStore();
  const primaryColor = config.favoriteColor || "#ff0080";
  
  const balloons = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    color: i % 3 === 0 ? primaryColor : i % 3 === 1 ? "#FFD700" : "#00CED1",
    delay: i * 1.5,
    x: Math.random() * 90 + 5,
    size: 40 + Math.random() * 40
  })), [primaryColor]);

  const streamers = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: i % 2 === 0 ? primaryColor : "#ffffff",
    delay: i * 0.5,
    x: Math.random() * 100
  })), [primaryColor]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map(b => <Balloon key={b.id} {...b} />)}
      {streamers.map(s => <Streamer key={s.id} {...s} />)}
    </div>
  );
};
