import { useState } from "react";
import { motion } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { HeartProgression } from "./HeartProgression";
import { useTranslation } from "@/i18n";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
    onStart: () => void;
}

export const SplashScreen = ({ onStart }: SplashScreenProps) => {
    const [tapped, setTapped] = useState(false);
    const { startMusic, playPop } = useSoundManager();
    const { t } = useTranslation();

    const handleTap = () => {
        if (tapped) return;
        setTapped(true);
        playPop();
        startMusic();
        setTimeout(onStart, 700);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={t('splash.tapAnywhereToBegin')}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTap();
                }
            }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary ${
                tapped ? "opacity-0 scale-105 filter blur-sm" : "opacity-100 scale-100"
            }`}
            style={{
                background: "var(--bg-gradient, radial-gradient(ellipse at 50% 15%, #3b0724 0%, #1a0515 100%))",
            }}
            onClick={handleTap}
        >
            {/* Semantic Top-Level Heading for Screen Readers & SEO */}
            <h1 className="sr-only">Birthday Bloom — Magical Cinematic Birthday Celebration</h1>

            {/* Dreamy Ambient Bokeh Auras */}
            <div className="absolute top-[10%] left-[10%] w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,75,130,0.22)_0%,transparent_70%)] blur-[110px] pointer-events-none animate-subtle-float" />
            <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-[30%] w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(circle,rgba(180,60,140,0.2)_0%,transparent_70%)] blur-[130px] pointer-events-none" />

            {/* Central Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-4 max-w-lg w-full p-8 sm:p-12 rounded-[2.5rem] border border-white/15 text-center backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]"
                style={{
                    background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                }}
            >
                <div className="mb-6 animate-subtle-float">
                    <HeartProgression stage={1} />
                </div>

                <motion.div
                    whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className="text-7xl sm:text-8xl mb-6 inline-block drop-shadow-[0_10px_30px_rgba(255,107,107,0.5)]"
                >
                    🎂
                </motion.div>

                <h2 className="font-display text-2xl sm:text-4xl text-foreground font-black tracking-tight mb-8 leading-snug">
                    <span className="bg-gradient-to-r from-white via-white/95 to-amber-200 bg-clip-text text-transparent drop-shadow-lg block mb-2">
                        {t('splash.specialSurpriseAwaits')}
                    </span>
                    <span className="font-script text-3xl sm:text-5xl font-bold italic text-gradient-romantic text-glow-rose inline-block animate-subtle-float">
                        ✨ Made with Love ✨
                    </span>
                </h2>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(255,107,107,0.4)]"
                >
                    <Sparkles size={18} className="text-primary animate-pulse" />
                    <span>{t('splash.tapAnywhereToBegin')}</span>
                </motion.div>
            </motion.div>

            {/* Subtle Starfield */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 2 + (i % 3),
                            height: 2 + (i % 3),
                            left: `${(i * 19 + 7) % 100}%`,
                            top: `${(i * 23 + 11) % 100}%`,
                            backgroundColor: `hsl(${[335, 45, 15, 200][i % 4]}, 85%, 65%)`,
                            opacity: 0.35 + ((i % 4) * 0.15),
                            animation: `sparkle ${2.5 + (i % 3)}s ease-in-out ${(i * 0.4) % 2}s infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
