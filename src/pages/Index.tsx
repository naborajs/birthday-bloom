import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/birthday/SplashScreen";
import { CinematicIntro } from "@/components/birthday/CinematicIntro";
import { MainBirthday } from "@/components/birthday/MainBirthday";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { FloatingElements } from "@/components/birthday/FloatingElements";

type Phase = "splash" | "intro" | "main";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("splash");
  
  // Apply the dynamic theme globally to the body/app
  useDynamicTheme();

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 relative overflow-hidden" 
      style={{ background: 'var(--bg-gradient, #000)' }}
    >
      {/* Background System */}
      <FloatingElements />

      {/* Cinematic Overlays */}
      <div className="vignette" />

      {/* Skip button */}
      {phase !== "main" && (
        <button 
          onClick={() => setPhase("main")} 
          className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl rounded-full text-white/40 hover:text-white/90 text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl"
        >
          Skip Intro ⏭
        </button>
      )}

      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
          >
            <SplashScreen onStart={() => setPhase("intro")} />
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
          >
            <CinematicIntro onComplete={() => setPhase("main")} />
          </motion.div>
        )}

        {phase === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <MainBirthday />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
