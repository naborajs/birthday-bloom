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
import { MorphingElements } from "@/components/birthday/MorphingElements";
import { EnhancedFloatingElements } from "@/components/birthday/EnhancedFloatingElements";
import { SparkleRain } from "@/components/birthday/SparkleRain";
import { FireflyEffect } from "@/components/birthday/FireflyEffect";
import { FloatingOrbs } from "@/components/birthday/FloatingOrbs";
import { ShootingStars } from "@/components/birthday/ShootingStars";
import { AnimatedGradient } from "@/components/birthday/AnimatedGradient";
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
    return (<div className="min-h-screen transition-colors duration-1000 relative overflow-hidden" style={{ background: 'var(--bg-gradient, #000)' }}>
      
      <EmojiCursorTrail />
      <PremiumFireworks runKey={fireworksRunKey}/>
      <FloatingElements />
      <MorphingElements />
      <EnhancedFloatingElements />
      <AnimatedGradient />
      {phase === "main" && (<>
          <SparkleRain intensity={isMobile ? 8 : 15}/>
          <FireflyEffect intensity={isMobile ? 7 : 12}/>
          <FloatingOrbs count={isMobile ? 4 : 6}/>
          <ShootingStars count={isMobile ? 4 : 8}/>
        </>)}

      
      <div className="vignette"/>

      
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
