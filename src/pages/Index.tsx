import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/birthday/SplashScreen";
import { CinematicIntro } from "@/components/birthday/CinematicIntro";
import { MainBirthday } from "@/components/birthday/MainBirthday";
import { PasswordUnlock } from "@/components/birthday/PasswordUnlock";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { useDynamicSEO } from "@/features/core/seo/useDynamicSEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingElements } from "@/components/birthday/FloatingElements";
import { SparkleRain } from "@/components/birthday/SparkleRain";
import { FireflyEffect } from "@/components/birthday/FireflyEffect";
import { ShootingStars } from "@/components/birthday/ShootingStars";
import { EmojiCursorTrail } from "@/components/birthday/EmojiCursorTrail";
import { PremiumFireworks } from "@/components/birthday/PremiumFireworks";
import { isPasswordRequired } from "@/utils/password";
import { useTranslation } from "@/i18n";
import { useAdaptivePerformance } from "@/hooks/useAdaptivePerformance";

type Phase = "splash" | "unlock" | "intro" | "main";

const Index = () => {
    const [phase, setPhase] = useState<Phase>(() => {
        if (typeof window !== 'undefined') {
            const param = new URLSearchParams(window.location.search).get('phase');
            if (param === 'main' || param === 'intro' || param === 'unlock') {
                return param;
            }
        }
        return "splash";
    });
    const [fireworksRunKey, setFireworksRunKey] = useState(0);
    const isMobile = useIsMobile();
    const perf = useAdaptivePerformance();
    const config = useBirthdayStore((state) => state.config);
    const { t } = useTranslation();
    useDynamicTheme();
    useDynamicSEO(config);

    return (<main aria-label="Birthday Celebration Experience" className="min-h-screen transition-colors duration-1000 relative overflow-hidden" style={{ background: 'var(--bg-gradient, #1a0515)' }}>
      {/* Dreamy Ambient Bokeh Auras (Zero-filter GPU-optimized multi-stop radial gradients) */}
      <div className="fixed top-[5%] left-[8%] w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,75,130,0.16)_0%,rgba(255,75,130,0.08)_40%,transparent_70%)] pointer-events-none animate-subtle-float" />
      <div className="fixed top-[20%] right-[8%] w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.14)_0%,rgba(255,200,100,0.05)_40%,transparent_70%)] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[10%] left-[25%] w-[42rem] h-[42rem] rounded-full bg-[radial-gradient(circle,rgba(180,60,140,0.15)_0%,rgba(180,60,140,0.06)_40%,transparent_70%)] pointer-events-none" />

      {/* Lightweight ambient effects — adaptively throttled to eliminate mobile lag */}
      {perf.enableCursorTrail && <EmojiCursorTrail />}
      <PremiumFireworks runKey={fireworksRunKey}/>
      <FloatingElements />

      {/* Additional ambient effects in main phase: single tranquil layer on mobile, full multi-canvas on high-spec desktop */}
      {phase === "main" && (
        perf.enableMultiCanvas ? (
          <>
            <SparkleRain intensity={4} />
            <FireflyEffect intensity={3} />
            <ShootingStars count={2} />
          </>
        ) : (
          <FireflyEffect intensity={2} />
        )
      )}

      {/* Vignette overlay */}
      <div className="vignette"/>

      {/* Skip button */}
      {phase !== "main" && phase !== "unlock" && config.showSkipButton !== false && (<button onClick={() => {
          setPhase("main");
          setFireworksRunKey((key) => key + 1);
        }} aria-label={t('common.skipIntro')} className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl rounded-full text-white/40 hover:text-white/90 text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl">
          {t('common.skipIntro')}
        </button>)}

      <AnimatePresence mode="wait">
        {phase === "splash" && (<motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.85, ease: "easeOut" }}>
            <SplashScreen onStart={() => {
                if (isPasswordRequired(config)) {
                    setPhase("unlock");
                }
                else {
                    setPhase("intro");
                }
            }}/>
          </motion.div>)}

        {phase === "unlock" && (<motion.div key="unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <PasswordUnlock onUnlock={() => setPhase("intro")}/>
          </motion.div>)}

        {phase === "intro" && (<motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.85, ease: "easeOut" }}>
            <CinematicIntro onComplete={() => {
                setPhase("main");
                setFireworksRunKey((key) => key + 1);
            }}/>
          </motion.div>)}

        {phase === "main" && (<motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.0, ease: "easeOut" }}>
            <MainBirthday />
          </motion.div>)}
      </AnimatePresence>
    </main>);
};

export default Index;
