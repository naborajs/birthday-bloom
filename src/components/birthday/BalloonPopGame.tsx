import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "./SoundManager";
import { useConfetti } from "./Confetti";
import { useTranslation } from "@/i18n";
import { Sparkles, RotateCcw, PartyPopper } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BalloonItem {
    id: number;
    color: string;
    lightColor: string;
    word: string;
    isPopped: boolean;
    xOffset: number;
    delay: number;
}

export const BalloonPopGame = () => {
    const { config } = useBirthdayStore();
    const { playPop, playReveal, playBoom } = useSoundManager();
    const { fireConfetti } = useConfetti();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const isMobile = useIsMobile();

    const relationship = config.relationship || "partner";
    const primaryColor = config.favoriteColor || "#FF2A6D";

    // 4 words for 4 balloons customized to relationship and language
    const words = useMemo(() => {
        if (isFrench) {
            if (relationship === "partner") return ["Tu", "es", "mon", "tout ! 💖"];
            if (relationship === "friend") return ["Tu", "es", "une", "légende ! 🚀"];
            if (relationship === "brother" || relationship === "sibling") return ["Tu", "es", "le", "meilleur ! 🏆"];
            if (relationship === "sister") return ["Tu", "es", "pure", "magie ! 🌸✨"];
            if (relationship === "father") return ["Tu", "es", "notre", "héros ! 🌟💪"];
            if (relationship === "mother") return ["Tu", "es", "notre", "cœur ! 💐💛"];
            if (relationship === "mentor" || relationship === "colleague") return ["Tu", "es", "une", "inspiration ! 🎯✨"];
            return ["Tu", "es", "notre", "trésor ! 🌟💝"];
        }
        if (isBengali) {
            if (relationship === "partner") return ["তুমি", "আমার", "সবচেয়ে", "প্রিয় ! 💖"];
            if (relationship === "friend") return ["তুই", "আমাদের", "আসল", "লেজেন্ড ! 🚀"];
            if (relationship === "brother" || relationship === "sibling") return ["তুমি", "আমাদের", "সেরা", "ভাই ! 🏆"];
            if (relationship === "sister") return ["তুমি", "আমাদের", "মিষ্টি", "বোন ! 🌸✨"];
            if (relationship === "father") return ["আপনি", "আমাদের", "আসল", "হিরো ! 🌟💪"];
            if (relationship === "mother") return ["আপনি", "আমাদের", "জীবনের", "আলো ! 💐💛"];
            if (relationship === "mentor" || relationship === "colleague") return ["আপনি", "আমাদের", "প্রেরণার", "উৎস ! 🎯✨"];
            return ["আপনি", "আমাদের", "শ্রেষ্ঠ", "উপহার ! 🌟💝"];
        }
        if (isHindi) {
            if (relationship === "partner") return ["आप", "मेरी", "पूरी", "दुनिया ! 💖"];
            if (relationship === "friend") return ["तुम", "सच में", "सुपर", "लीजेंड ! 🚀"];
            if (relationship === "brother" || relationship === "sibling") return ["तुम", "हमारे", "नंबर 1", "भाई ! 🏆"];
            if (relationship === "sister") return ["तुम", "हमारी", "प्यारी", "बहन ! 🌸✨"];
            if (relationship === "father") return ["आप", "हमारे", "सच्चे", "हीरो ! 🌟💪"];
            if (relationship === "mother") return ["आप", "हमारा", "सबसे प्यारा", "सुकून ! 💐💛"];
            if (relationship === "mentor" || relationship === "colleague") return ["आप", "हमारी", "सच्ची", "प्रेरणा ! 🎯✨"];
            return ["आप", "हमारा", "सबसे अनमोल", "तोहफा ! 🌟💝"];
        }

        // English Default
        if (relationship === "partner") return ["You", "are", "so", "loved! 💖"];
        if (relationship === "friend") return ["You", "are", "super", "awesome! 🚀"];
        if (relationship === "brother" || relationship === "sibling") return ["You", "are", "the", "legend! 🏆"];
        if (relationship === "sister") return ["You", "are", "pure", "magic! 🌸✨"];
        if (relationship === "father") return ["You", "are", "our", "hero! 🌟💪"];
        if (relationship === "mother") return ["You", "are", "our", "heart! 💐💛"];
        if (relationship === "grandfather" || relationship === "grandmother") return ["You", "are", "our", "pride! 🏅🌟"];
        if (relationship === "mentor" || relationship === "colleague") return ["You", "are", "an", "inspiration! 🎯✨"];
        return ["You", "are", "our", "treasure! 🌟💝"];
    }, [relationship, isHindi, isBengali, isFrench]);

    const initialBalloons: BalloonItem[] = useMemo(() => [
        { id: 0, color: "#FF4D6D", lightColor: "#FFAAA6", word: words[0] || "You", isPopped: false, xOffset: -12, delay: 0 },
        { id: 1, color: "#6C5CE7", lightColor: "#A29BFE", word: words[1] || "are", isPopped: false, xOffset: -4, delay: 0.3 },
        { id: 2, color: "#00CEC9", lightColor: "#81ECEC", word: words[2] || "so", isPopped: false, xOffset: 4, delay: 0.6 },
        { id: 3, color: "#FDCB6E", lightColor: "#FFEAA7", word: words[3] || "special! 💖", isPopped: false, xOffset: 12, delay: 0.9 },
    ], [words]);

    const [balloons, setBalloons] = useState<BalloonItem[]>(initialBalloons);

    const poppedCount = balloons.filter((b) => b.isPopped).length;
    const isGameComplete = poppedCount === balloons.length;

    const handlePop = useCallback((id: number, event: React.MouseEvent | React.TouchEvent) => {
        setBalloons((prev) => {
            const current = prev.find((b) => b.id === id);
            if (!current || current.isPopped) return prev;

            // Trigger pop sound and haptics
            playPop();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([30, 40, 30]);
            }

            // Directional confetti
            const target = event?.currentTarget as HTMLElement | null;
            const rect = target?.getBoundingClientRect ? target.getBoundingClientRect() : null;
            const x = rect ? (rect.left + rect.width / 2) / (window.innerWidth || 1) : 0.5;
            const y = rect ? (rect.top + rect.height / 2) / (window.innerHeight || 1) : 0.5;
            fireConfetti({
                particleCount: 25,
                spread: 60,
                origin: { x, y },
            });

            const next = prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b));
            const newPoppedCount = next.filter((b) => b.isPopped).length;

            if (newPoppedCount === next.length) {
                setTimeout(() => {
                    playReveal();
                    playBoom();
                    fireConfetti({ particleCount: 150, spread: 140 });
                }, 400);
            }

            return next;
        });
    }, [playPop, playReveal, playBoom, fireConfetti]);

    const handleReset = () => {
        setBalloons(initialBalloons);
        playPop();
    };

    return (
        <section className="relative z-20 py-20 px-4 max-w-5xl mx-auto w-full select-none">
            {/* Top Hanging Fairy Lights String */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden flex justify-center gap-4 sm:gap-6 pointer-events-none opacity-90 py-2">
                {Array.from({ length: isMobile ? 14 : 22 }).map((_, i) => {
                    const colors = ["#FF4D6D", "#FDCB6E", "#00CEC9", "#6C5CE7", "#00B894", "#E84393"];
                    const color = colors[i % colors.length];
                    return (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 1.8 + (i % 4) * 0.4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-1 h-3 bg-white/20" />
                            <div
                                className="w-3 h-4 sm:w-4 sm:h-5 rounded-full shadow-[0_0_12px]"
                                style={{
                                    backgroundColor: color,
                                    boxShadow: `0 0 12px ${color}, 0 0 20px ${color}80`,
                                }}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Header Badge */}
            <div className="text-center mt-6 mb-12">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl text-white font-display text-base sm:text-xl font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-3"
                    style={{ borderColor: `${primaryColor}60` }}
                >
                    <PartyPopper size={20} className="text-primary animate-bounce" />
                    <span>
                        {isFrench
                            ? "Éclatez les ballons ! 🎈"
                            : isBengali
                                ? "বেলুনগুলো ফাটান! 🎈"
                                : isHindi
                                    ? "गुब्बारे फोड़िए! 🎈"
                                    : "Pop the balloons! 🎈"}
                    </span>
                </motion.div>

                <p className="font-display italic text-lg sm:text-2xl text-foreground/80">
                    {isFrench
                        ? "Touchez chaque ballon pour révéler le message secret 💌"
                        : isBengali
                            ? "গোপন বার্তাটি দেখতে প্রতিটি বেলুনে স্পর্শ করুন 💌"
                            : isHindi
                                ? "गुप्त संदेश देखने के लिए हर गुब्बारे को फोड़ें 💌"
                                : "Tap each balloon to reveal the secret message 💌"}
                </p>
            </div>

            {/* Balloon Arena & Word Reveals */}
            <div className="relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl mx-auto">
                    {balloons.map((balloon) => (
                        <div
                            key={balloon.id}
                            className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px]"
                        >
                            <AnimatePresence mode="wait">
                                {!balloon.isPopped ? (
                                    /* Bouncy Floating Balloon */
                                    <motion.div
                                        key="balloon"
                                        initial={{ scale: 0, y: 50 }}
                                        animate={{
                                            scale: 1,
                                            y: [0, -18, 0],
                                            rotate: [0, 4, -4, 0],
                                        }}
                                        exit={{ scale: [1, 1.35, 0], opacity: [1, 1, 0] }}
                                        transition={{
                                            y: { duration: 3.5 + balloon.delay, repeat: Infinity, ease: "easeInOut" },
                                            rotate: { duration: 4 + balloon.delay, repeat: Infinity, ease: "easeInOut" },
                                            exit: { duration: 0.25 },
                                        }}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => handlePop(balloon.id, e)}
                                        onTouchStart={(e) => handlePop(balloon.id, e)}
                                        className="cursor-pointer flex flex-col items-center group touch-manipulation"
                                    >
                                        {/* Balloon Bulb */}
                                        <div
                                            className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-[50%] shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform group-hover:scale-105"
                                            style={{
                                                background: `radial-gradient(circle at 35% 30%, ${balloon.lightColor} 0%, ${balloon.color} 70%, #1a0515 100%)`,
                                                boxShadow: `0 15px 35px -5px ${balloon.color}80, 0 0 25px ${balloon.color}40`,
                                            }}
                                        >
                                            {/* Glossy Reflection */}
                                            <div className="absolute top-4 left-4 w-6 h-10 rounded-full bg-white/40 blur-[1px] transform -rotate-30 pointer-events-none" />
                                            <Sparkles size={20} className="text-white/60 group-hover:text-white transition-colors" />
                                        </div>

                                        {/* Balloon Knot & String */}
                                        <div
                                            className="w-3 h-2 -mt-1 rounded-sm shadow-sm"
                                            style={{ backgroundColor: balloon.color }}
                                        />
                                        <div className="w-[1.5px] h-16 sm:h-20 bg-white/30" />
                                    </motion.div>
                                ) : (
                                    /* Revealed Secret Word Token */
                                    <motion.div
                                        key="word"
                                        initial={{ scale: 0.2, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                        className="flex flex-col items-center justify-center text-center p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl w-full h-40"
                                    >
                                        <span className="font-display italic text-3xl sm:text-4xl md:text-5xl font-black text-gradient-romantic text-glow-rose drop-shadow-xl break-words leading-tight">
                                            {balloon.word}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Victory Cheer Card when all balloons popped */}
            {isGameComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-8 text-center"
                >
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-medium tracking-wide shadow-lg backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={16} />
                        <span>
                            {isFrench
                                ? "Rejouer 🎈"
                                : isBengali
                                    ? "আবার খেলুন 🎈"
                                    : isHindi
                                        ? "फिर से खेलें 🎈"
                                        : "Play Again 🎈"}
                        </span>
                    </button>
                </motion.div>
            )}
        </section>
    );
};
