import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

interface FakeChatSceneProps {
  onComplete: () => void;
}

export const FakeChatScene = ({ onComplete }: FakeChatSceneProps) => {
  const [phase, setPhase] = useState<"typing" | "deleting" | "retype" | "special" | "done">("typing");
  const [typedText, setTypedText] = useState("");
  const { playType, playWhoosh, playReveal } = useSoundManager();
  const { config } = useBirthdayStore();
  const { name, relationship, favoriteColor, gender } = config;

  const isMale = gender === 'male';
  const isFemale = gender === 'female';

  const fullText = "Happy Birthday";
  const retypeFullText = useMemo(() => {
    if (relationship === 'partner') return isMale ? "To the man who holds my heart..." : isFemale ? "To the woman of my dreams..." : "To the soul who completes me...";
    if (relationship === 'friend') return "Wait, a boring text? That's not us! 😂";
    return "Something special is coming...";
  }, [relationship, isMale, isFemale]);

  const primaryColor = favoriteColor || '#FF6B6B';

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      for (let i = 0; i <= fullText.length; i++) {
        if (!isMounted) return;
        setTypedText(fullText.slice(0, i));
        playType();
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        await new Promise(r => setTimeout(r, 120));
      }

      await new Promise(r => setTimeout(r, 2000));
      
      setPhase("deleting");
      for (let i = fullText.length; i >= 0; i--) {
        if (!isMounted) return;
        setTypedText(fullText.slice(0, i));
        playType();
        await new Promise(r => setTimeout(r, 60));
      }

      await new Promise(r => setTimeout(r, 800));

      setPhase("retype");
      for (let i = 0; i <= retypeFullText.length; i++) {
        if (!isMounted) return;
        setTypedText(retypeFullText.slice(0, i));
        playType();
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
        await new Promise(r => setTimeout(r, 80));
      }

      await new Promise(r => setTimeout(r, 1200));

      setPhase("special");
      playReveal();

      await new Promise(r => setTimeout(r, 4500));
      
      playWhoosh();
      onComplete();
    };

    runSequence();
    return () => { isMounted = false; };
  }, [onComplete, playType, playWhoosh, playReveal, retypeFullText]);

  // Design Tokens
  const theme = useMemo(() => {
    if (relationship === 'partner') return {
      bg: "rgba(30, 10, 20, 0.95)",
      border: "rgba(255, 100, 150, 0.2)",
      headerBg: "rgba(255, 255, 255, 0.05)",
      bubbleOther: "rgba(255, 255, 255, 0.1)",
      bubbleMe: `${primaryColor}40`,
      icon: "💖",
      status: "typing love notes...",
    };
    if (relationship === 'friend') return {
      bg: "rgba(10, 15, 25, 0.98)",
      border: "rgba(0, 200, 255, 0.2)",
      headerBg: "rgba(255, 255, 255, 0.03)",
      bubbleOther: "rgba(255, 255, 255, 0.08)",
      bubbleMe: `${primaryColor}60`,
      icon: "😎",
      status: "setting up the vibe...",
    };
    return {
      bg: "rgba(25, 20, 15, 0.95)",
      border: "rgba(255, 200, 100, 0.2)",
      headerBg: "rgba(255, 255, 255, 0.05)",
      bubbleOther: "rgba(255, 255, 255, 0.1)",
      bubbleMe: `${primaryColor}40`,
      icon: "🎈",
      status: "sending warm vibes...",
    };
  }, [relationship, primaryColor]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ perspective: "1500px" }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 5 }}
        exit={{ scale: 1.2, opacity: 0, filter: "blur(40px)", rotateX: -20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md preserve-3d"
      >
        <div 
          className="rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border backdrop-blur-2xl" 
          style={{ background: theme.bg, borderColor: theme.border }}
        >
          {/* Header */}
          <div className="px-8 py-6 flex items-center gap-4 border-b" style={{ background: theme.headerBg, borderColor: theme.border }}>
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl shadow-xl border border-white/10">
              {theme.icon}
            </div>
            <div>
              <p className="text-white font-black tracking-tight text-lg">{name || 'Special Someone'}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                <p className="text-xs text-green-500/80 font-bold uppercase tracking-widest">{theme.status}</p>
              </div>
            </div>
            <div className="ml-auto flex gap-5 text-white/30">
              <span className="text-xl hover:text-white transition-colors cursor-pointer">📞</span>
              <span className="text-xl hover:text-white transition-colors cursor-pointer">📹</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-10 min-h-[300px] flex flex-col justify-end gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="self-start max-w-[85%] px-5 py-4 rounded-[1.5rem] rounded-bl-none text-base font-medium shadow-lg"
              style={{ background: theme.bubbleOther, color: "rgba(255,255,255,0.9)" }}
            >
              {relationship === 'partner' ? "Hey my love... ❤️" : relationship === 'friend' ? "Yoooo! 👋" : "Hi there! ✨"}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="self-start max-w-[85%] px-5 py-4 rounded-[1.5rem] rounded-bl-none text-base font-medium shadow-lg"
              style={{ background: theme.bubbleOther, color: "rgba(255,255,255,0.9)" }}
            >
              {relationship === 'partner' ? "I stayed up late thinking about you... ❤️" : relationship === 'friend' ? "Prepare yourself for something epic... 🚀" : "I have a special surprise for you..."}
            </motion.div>

            {/* Typing Bubble */}
            <AnimatePresence>
              {(phase === "typing" || phase === "retype") && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  className="self-end px-6 py-4 rounded-[1.5rem] rounded-br-none flex gap-2 shadow-2xl"
                  style={{ background: theme.bubbleMe }}
                >
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 h-2.5 rounded-full bg-white" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full bg-white" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full bg-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="px-6 py-6 bg-black/40 border-t" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-[2rem] px-6 py-4 text-sm bg-white/5 border border-white/10 flex items-center min-h-[56px] shadow-inner">
                <span className={`text-base tracking-tight ${phase === "retype" || phase === "special" ? "text-white/60 italic font-light" : "text-white font-medium"}`}>
                  {typedText}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-[2px] h-5 ml-1 bg-primary align-middle shadow-[0_0_10px_var(--color-primary)]"
                  />
                </span>
              </div>
              <motion.div 
                animate={(phase === "typing" || phase === "retype") && typedText.length > 5 ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Special Message Below */}
        <AnimatePresence>
          {(phase === "special") && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
              className="text-center mt-16 px-6"
            >
              <p className="text-3xl md:text-4xl font-display font-black leading-tight bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                {relationship === 'partner' ? `Because ${isMale ? 'a King' : isFemale ? 'a Queen' : 'someone special'} like you deserves more than just words...` : relationship === 'friend' ? "Warning: High levels of legend-ness detected! ⚠️" : "But you deserve a much more magical surprise..."}
              </p>
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1], 
                  rotate: [0, 180, 360],
                  filter: ["drop-shadow(0 0 10px white)", "drop-shadow(0 0 30px white)", "drop-shadow(0 0 10px white)"]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="mt-8 text-4xl"
              >
                ✨
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
