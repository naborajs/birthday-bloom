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
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 select-none ${
                tapped ? "opacity-0 scale-105 filter blur-sm" : "opacity-100 scale-100"
            }`}
            style={{
                background: "radial-gradient(ellipse at center, hsl(290, 50%, 12%) 0%, hsl(280, 60%, 6%) 70%, #000 100%)",
            }}
            onClick={handleTap}
        >
            {/* Ambient Background Glow */}
            <div className="absolute w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

            {/* Central Glassmorphic Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-4 max-w-lg w-full p-8 sm:p-12 rounded-[2.5rem] border border-white/10 text-center backdrop-blur-2xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]"
                style={{
                    background: "linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                }}
            >
                <div className="mb-6 animate-subtle-float">
                    <HeartProgression stage={1} />
                </div>

                <motion.div
                    whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                    className="text-7xl sm:text-8xl mb-6 inline-block drop-shadow-[0_10px_30px_rgba(255,107,107,0.4)]"
                >
                    🎂
                </motion.div>

                <h2 className="font-display text-2xl sm:text-4xl text-foreground font-black tracking-tight mb-8 leading-snug">
                    <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-lg">
                        {t('splash.specialSurpriseAwaits')}
                    </span>
                </h2>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-white font-medium text-sm sm:text-base tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(255,107,107,0.3)]"
                >
                    <Sparkles size={18} className="text-primary animate-pulse" />
                    <span>{t('splash.tapAnywhereToBegin')}</span>
                </motion.div>
            </motion.div>

            {/* Subtle Starfield */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 2 + (i % 3),
                            height: 2 + (i % 3),
                            left: `${(i * 19 + 7) % 100}%`,
                            top: `${(i * 23 + 11) % 100}%`,
                            backgroundColor: `hsl(${[330, 270, 45, 200][i % 4]}, 80%, 65%)`,
                            opacity: 0.3 + ((i % 4) * 0.15),
                            animation: `sparkle ${2.5 + (i % 3)}s ease-in-out ${(i * 0.4) % 2}s infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
