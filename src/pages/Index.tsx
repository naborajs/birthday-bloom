import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/birthday/SplashScreen";
import { CinematicIntro } from "@/components/birthday/CinematicIntro";
import { MainBirthday } from "@/components/birthday/MainBirthday";
import { PasswordUnlock } from "@/components/birthday/PasswordUnlock";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingElements } from "@/components/birthday/FloatingElements";
import { SparkleRain } from "@/components/birthday/SparkleRain";
import { FireflyEffect } from "@/components/birthday/FireflyEffect";
import { ShootingStars } from "@/components/birthday/ShootingStars";
import { EmojiCursorTrail } from "@/components/birthday/EmojiCursorTrail";
import { PremiumFireworks } from "@/components/birthday/PremiumFireworks";
import { isPasswordRequired } from "@/utils/password";
import { useTranslation } from "@/i18n";

type Phase = "splash" | "unlock" | "intro" | "main";

const Index = () => {
    const [phase, setPhase] = useState<Phase>("splash");
    const [fireworksRunKey, setFireworksRunKey] = useState(0);
    const isMobile = useIsMobile();
    const config = useBirthdayStore((state) => state.config);
    const { t } = useTranslation();
    useDynamicTheme();

    return (<div className="min-h-screen transition-colors duration-1000 relative overflow-hidden" style={{ background: 'var(--bg-gradient, #1a0515)' }}>
      {/* Dreamy Ambient Bokeh Auras */}
      <div className="fixed top-[5%] left-[8%] w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,75,130,0.2)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-subtle-float" />
      <div className="fixed top-[20%] right-[8%] w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.15)_0%,transparent_70%)] blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[10%] left-[25%] w-[42rem] h-[42rem] rounded-full bg-[radial-gradient(circle,rgba(180,60,140,0.18)_0%,transparent_70%)] blur-[140px] pointer-events-none" />

      {/* Lightweight ambient effects — reduced for performance */}
      <EmojiCursorTrail />
      <PremiumFireworks runKey={fireworksRunKey}/>
      <FloatingElements />

      {/* Additional effects only in main phase to reduce initial load */}
      {phase === "main" && (<>
          <SparkleRain intensity={isMobile ? 4 : 6}/>
          <FireflyEffect intensity={isMobile ? 3 : 5}/>
          <ShootingStars count={isMobile ? 2 : 3}/>
        </>)}

      {/* Vignette overlay */}
      <div className="vignette"/>

      {/* Skip button */}
      {phase !== "main" && phase !== "unlock" && config.showSkipButton !== false && (<button onClick={() => setPhase("main")} className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl rounded-full text-white/40 hover:text-white/90 text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl">
          {t('common.skipIntro')}
        </button>)}

      <AnimatePresence mode="wait">
        {phase === "splash" && (<motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} transition={{ duration: 1 }}>
            <SplashScreen onStart={() => {
                if (isPasswordRequired(config)) {
                    setPhase("unlock");
                }
                else {
                    setPhase("intro");
                }
            }}/>
          </motion.div>)}

        {phase === "unlock" && (<motion.div key="unlock" initial={{ opacity: 0, scale: 0.95, filter: "blur(15px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }} transition={{ duration: 0.8 }}>
            <PasswordUnlock onUnlock={() => setPhase("intro")}/>
          </motion.div>)}

        {phase === "intro" && (<motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }} transition={{ duration: 1 }}>
            <CinematicIntro onComplete={() => {
                setPhase("main");
                setFireworksRunKey((key) => key + 1);
            }}/>
          </motion.div>)}

        {phase === "main" && (<motion.div key="main" initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.5, ease: "easeOut" }}>
            <MainBirthday />
          </motion.div>)}
      </AnimatePresence>
    </div>);
};

export default Index;
