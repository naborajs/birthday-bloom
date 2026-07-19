import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Cake as CakeIcon, Flame, Sparkles } from "lucide-react";
import { useConfetti } from "./Confetti";
import { useSoundManager } from "./SoundManager";
import { KineticText } from "./KineticText";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { Phase, CakeOption, CAKE_OPTIONS } from "./CakeTypes";
import { CutSparks, MagicDust } from "./CakeVisuals";
import { Cake3D } from "./Cake3D";
import { CakeKnife } from "./CakeKnife";

const CakeCard = ({ cake, index, onSelect }: {
    cake: CakeOption;
    index: number;
    onSelect: () => void;
}) => {
    const isMobile = useIsMobile();
    return (
        <motion.button 
            whileHover={!isMobile ? { scale: 1.05, y: -10, rotateZ: 2 } : undefined} 
            whileTap={{ scale: 0.95 }} 
            onClick={onSelect} 
            className="group relative flex flex-col items-center gap-3 p-3 border border-white/10 backdrop-blur-2xl transition-all duration-500 overflow-hidden" 
            style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                borderRadius: 'var(--card-radius, 2rem)',
                width: "180px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)"
            }}
        >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2">
                <img src={cake.image} alt={cake.name} className={`w-full h-full object-cover transition-transform duration-700 ${!isMobile ? "group-hover:scale-110" : ""}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 right-3 text-3xl drop-shadow-2xl">
                    {cake.emoji}
                </div>
            </div>

            <div className="px-2 pb-3 text-center">
                <span className="font-display text-sm font-black tracking-widest uppercase text-white/70 group-hover:text-primary transition-colors">
                    {cake.name}
                </span>
                <div className="flex gap-2 justify-center mt-3">
                    {cake.layers.map((l, idx) => (
                        <div key={idx} className="w-3 h-3 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: l }} />
                    ))}
                </div>
            </div>
            
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    );
};

export const CakeCutting = () => {
    const isMobile = useIsMobile();
    const reduceMotion = useReducedMotion();
    const [phase, setPhase] = useState<Phase>("select");
    const [selectedCake, setSelectedCake] = useState<CakeOption | null>(null);
    const [candlesLit, setCandlesLit] = useState(true);
    const [quoteIndex, setQuoteIndex] = useState(-1);
    const [countdownVal, setCountdownVal] = useState<number | string>("");

    const { fireCannon, fireCinematicCelebration } = useConfetti();
    const { playBoom, playReveal, playPop, playWhoosh } = useSoundManager();
    const { name, relationship, gender, favoriteColor } = useBirthdayStore(state => state.config);
    const primaryColor = favoriteColor || '#FF6B6B';

    const quotes = useMemo(() => {
        const isMale = gender === 'male';
        const isFemale = gender === 'female';
        
        if (relationship === 'partner') return [
            { text: `My ${isMale ? 'Prince' : isFemale ? 'Princess' : 'Everything'}...`, animation: "zoom-in" as const },
            { text: "Make a wish for our future...", animation: "float" as const },
            { text: "I love you to the stars and back", animation: "pop-out" as const },
            { text: "Happy Birthday My Love! ❤️", animation: "typewriter-burst" as const },
            { text: `Forever Yours ✨`, animation: "pop-out" as const },
        ];
        
        if (relationship === 'friend') return [
            { text: `Yo ${name || 'Legend'}!`, animation: "pop-out" as const },
            { text: "Ready to get older but 0% wiser? 😂", animation: "zoom-in" as const },
            { text: "Wishing you zero hangovers tomorrow!", animation: "stagger-up" as const },
            { text: "Happy Birthday Bestie!", animation: "typewriter-burst" as const },
            { text: `Let's make some noise! 🎉`, animation: "float" as const },
        ];
        
        return [
            { text: `For our ${isMale ? 'King' : isFemale ? 'Queen' : 'Favorite Human'}...`, animation: "zoom-in" as const },
            { text: "A truly wonderful soul", animation: "pop-out" as const },
            { text: "May your day be magical", animation: "stagger-up" as const },
            { text: "Happy Birthday!", animation: "typewriter-burst" as const },
            { text: `Stay blessed always ✨`, animation: "float" as const },
        ];
    }, [name, relationship, gender]);

    const handleSelectCake = useCallback((cake: CakeOption) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
        setSelectedCake(cake);
        playPop();
        setPhase("blow-intro");
    }, [playPop]);

    const handleBlow = useCallback(() => {
        if (phase !== "blow-intro") return;
        
        const runSequence = async () => {
            // 1. Blow sequence
            setPhase("blowing");
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
            playWhoosh();
            setCandlesLit(false);
            
            // 2. Wish sent
            await new Promise(r => setTimeout(r, 1500));
            setPhase("wish");
            
            // 3. Countdown Start
            await new Promise(r => setTimeout(r, 3000));
            setPhase("countdown");
            setCountdownVal(3);
            playPop();
            
            await new Promise(r => setTimeout(r, 1000));
            setCountdownVal(2);
            playPop();
            
            await new Promise(r => setTimeout(r, 1000));
            setCountdownVal(1);
            playPop();
            
            // 4. Knife Enters
            await new Promise(r => setTimeout(r, 1000));
            playReveal();
            setPhase("knife-enter");
            
            // 5. Knife Cuts Down
            await new Promise(r => setTimeout(r, 1500));
            playBoom();
            setPhase("cutting");
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
            
            // 6. Burst and Cake Split
            await new Promise(r => setTimeout(r, 1000));
            fireCinematicCelebration();
            setPhase("burst");
            playReveal();
            
            // 7. Quotes Sequence
            await new Promise(r => setTimeout(r, 1500));
            setPhase("quotes");
            setQuoteIndex(0);
        };
        
        runSequence();
    }, [phase, fireCinematicCelebration, playBoom, playReveal, playWhoosh, playPop]);

    // Lock scroll when experience is active
    useEffect(() => {
        if (phase !== "select") {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [phase]);

    // Auto-advance quotes
    useEffect(() => {
        if (phase !== "quotes" || quoteIndex < 0 || quoteIndex >= quotes.length) return;
        const t = setTimeout(() => {
            if (quoteIndex < quotes.length - 1) setQuoteIndex((i) => i + 1);
        }, 4000);
        return () => clearTimeout(t);
    }, [phase, quoteIndex, quotes.length]);

    const cake = selectedCake || CAKE_OPTIONS[0];
    const lowMotion = isMobile || reduceMotion;
    const dustCount = isMobile ? 16 : 40;
    const sparkCount = isMobile ? 16 : 30;
    const cakeSpring = { type: "spring", stiffness: isMobile ? 45 : 80, damping: isMobile ? 20 : 12 };

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {phase !== "select" && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-center backdrop-blur-2xl overflow-y-auto overscroll-none py-10 md:py-8" 
                            style={{
                                background: "radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)"
                            }}
                        >
                            <MagicDust count={dustCount} />
                            
                            <div className="relative w-full max-w-4xl px-4 flex flex-col items-center">
                                
                                {/* The 3D Cake is ALWAYS rendered here so it never unmounts */}
                                <div className="relative w-full h-[50vh] min-h-[400px] flex justify-center items-center mt-10">
                                    <Cake3D cake={cake} phase={phase} />
                                    
                                    {/* Overlays on top of the Cake */}
                                    
                                    {/* Knife Overlay */}
                                    {(phase === "knife-enter" || phase === "cutting" || phase === "burst") && (
                                        <div className="absolute inset-0 z-50 pointer-events-none">
                                            <CakeKnife phase={phase} />
                                        </div>
                                    )}
                                    
                                    {/* Sparks and Burst */}
                                    <AnimatePresence>
                                        {phase === "cutting" && <CutSparks count={sparkCount} color={cake.accent} />}
                                        {phase === "burst" && <MagicDust count={60} />}
                                    </AnimatePresence>
                                    
                                    {/* Wish Overlay Glow */}
                                    {phase === "wish" && (
                                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                                    )}
                                    
                                    {/* Countdown Overlay */}
                                    {phase === "countdown" && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50 rounded-[2.5rem] pointer-events-none">
                                            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.5, y: 0 }} className="text-white/40 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-bold">
                                                Prepare to cut...
                                            </motion.span>
                                            <AnimatePresence mode="wait">
                                                <motion.h1 
                                                    key={countdownVal} 
                                                    initial={{ scale: 0.3, opacity: 0, filter: "blur(10px)" }} 
                                                    animate={{
                                                        scale: [0.3, 1.4, 1],
                                                        opacity: 1,
                                                        filter: "blur(0px)",
                                                        textShadow: `0 0 40px ${primaryColor}, 0 0 80px ${primaryColor}`
                                                    }} 
                                                    exit={{ scale: 1.8, opacity: 0, filter: "blur(15px)" }} 
                                                    transition={{ duration: 0.7, ease: "easeOut" }} 
                                                    className="font-display text-8xl md:text-[10rem] font-black text-white"
                                                >
                                                    {countdownVal}
                                                </motion.h1>
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>

                                {/* Text Content Below the Cake */}
                                <div className="w-full flex flex-col items-center mt-8 min-h-[150px]">
                                    {/* Blow Sequence Text */}
                                    {(phase === "blow-intro" || phase === "blowing") && (
                                        <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                                            <h2 className="font-display text-3xl sm:text-4xl text-white font-black text-center tracking-tighter animate-glow-pulse">
                                                ✨ MAKE A WISH & BLOW ✨
                                            </h2>
                                            {phase === "blow-intro" && (
                                                <motion.button 
                                                    whileHover={!lowMotion ? { scale: 1.1 } : undefined} 
                                                    whileTap={{ scale: 0.9 }} 
                                                    onClick={handleBlow} 
                                                    className="group relative px-12 py-5 rounded-full text-xl font-black text-white overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)]" 
                                                    style={{ background: "linear-gradient(90deg, #ff0080, #7928ca)" }}
                                                >
                                                    <span className="relative z-10">🌬️ BLOW NOW</span>
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Wish Sent Text */}
                                    {phase === "wish" && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                                            <h2 className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
                                                WISH SENT TO THE STARS
                                            </h2>
                                            <p className="text-white/60 text-xl mt-4 font-light italic">Wait for the magical cut...</p>
                                        </motion.div>
                                    )}
                                    
                                    {/* Quotes Sequence Text */}
                                    {phase === "quotes" && (
                                        <div className="text-center w-full max-w-2xl">
                                            <AnimatePresence mode="wait">
                                                {quoteIndex >= 0 && (
                                                    <motion.div key={quoteIndex} initial={{ y: 20, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -20, opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8 }} className="flex items-center justify-center">
                                                        <p className={`text-3xl sm:text-4xl md:text-6xl font-display font-black leading-tight ${
                                                            quoteIndex === quotes.length - 1 
                                                                ? "bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_0_30px_var(--color-primary)]" 
                                                                : "text-white"
                                                        } `}>
                                                            <KineticText text={quotes[quoteIndex].text} animation={quotes[quoteIndex].animation} delay={100} />
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>

                                {/* End Button */}
                                {phase === "quotes" && quoteIndex >= quotes.length - 1 && (
                                    <motion.button 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        onClick={() => setPhase("select")} 
                                        className="mt-16 px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.3em] text-white/40 hover:text-white border border-white/10 hover:bg-white/5 transition-all duration-500"
                                    >
                                        ✕ Finish Experience
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <div id="cake-section" className="relative z-20 py-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        className="font-display text-4xl sm:text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent"
                    >
                        CHOOSE YOUR CAKE
                    </motion.h3>
                    <p className="text-white/40 text-lg sm:text-xl mb-12 sm:mb-20 max-w-2xl mx-auto font-light tracking-widest uppercase">
                        A Masterpiece for every Masterpiece
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                        {CAKE_OPTIONS.map((c, i) => (
                            <CakeCard key={c.id} cake={c} index={i} onSelect={() => handleSelectCake(c)} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
