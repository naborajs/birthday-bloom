import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    AnimatePresence,
    type PanInfo,
} from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useTranslation } from "@/i18n";
import { getWishDeck, WRITE_YOUR_OWN_CARD, type WishTemplate } from "@/config/wishTemplates";
import { Heart, X, Send, Pencil, RotateCcw } from "lucide-react";

/* ──────────────────────────────────────────────
   WishCard — a single physical greeting card
   ────────────────────────────────────────────── */

interface WishCardProps {
    wish: WishTemplate;
    isTop: boolean;
    stackIndex: number; // 0 = top, 1 = behind, 2 = further back
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    rotation: number; // slight random tilt per card
}

const SWIPE_THRESHOLD = 120;
const SWIPE_VELOCITY = 500;
const EXIT_X = 400;

const WishCard = ({
    wish,
    isTop,
    stackIndex,
    onSwipeLeft,
    onSwipeRight,
    rotation,
}: WishCardProps) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 0, 300], [-15, rotation, 15]);
    const leftOpacity = useTransform(x, [-150, -40, 0], [1, 0.3, 0]);
    const rightOpacity = useTransform(x, [0, 40, 150], [0, 0.3, 1]);

    // Handwriting animation state
    const [displayedChars, setDisplayedChars] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const fullText = wish.text;
    const isBlankCard = wish.id === "write-your-own";

    // Reset and replay handwriting when card becomes the top
    useEffect(() => {
        if (!isTop || isBlankCard) return;
        setDisplayedChars(0);
        const delay = setTimeout(() => {
            timerRef.current = setInterval(() => {
                setDisplayedChars((prev) => {
                    if (prev >= fullText.length) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 28);
        }, 300);
        return () => {
            clearTimeout(delay);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTop, fullText, isBlankCard]);

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > SWIPE_VELOCITY) {
            if (info.offset.x > 0) {
                onSwipeRight();
            } else {
                onSwipeLeft();
            }
        }
    };

    const scale = 1 - stackIndex * 0.04;
    const yOffset = stackIndex * 10;
    const isWritingDone = displayedChars >= fullText.length;

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
                zIndex: 10 - stackIndex,
                pointerEvents: isTop ? "auto" : "none",
            }}
        >
            <motion.div
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDragEnd={isTop ? handleDragEnd : undefined}
                style={{
                    x: isTop ? x : 0,
                    rotate: isTop ? rotate : rotation,
                    scale,
                    translateY: yOffset,
                    touchAction: isTop ? "none" : "auto",
                }}
                exit={{
                    x: x.get() > 0 ? EXIT_X : -EXIT_X,
                    opacity: 0,
                    rotate: x.get() > 0 ? 20 : -20,
                    transition: { duration: 0.35, ease: "easeIn" },
                }}
                className={`
                    relative w-[85vw] max-w-[340px] sm:max-w-[380px]
                    h-[420px] sm:h-[460px]
                    rounded-2xl
                    border border-[#e8ddd0]
                    select-none
                    ${isTop ? "cursor-grab active:cursor-grabbing" : ""}
                `}
            >
                {/* Paper background with grain texture */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, #FFFDF8 0%, #FFF9F0 40%, #FFF5E8 100%)",
                        boxShadow: isTop
                            ? "0 12px 40px -8px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
                            : "0 4px 15px -4px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* SVG paper grain noise */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-multiply pointer-events-none" aria-hidden="true">
                        <filter id="wishCardGrain">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#wishCardGrain)" />
                    </svg>
                </div>

                {/* Swipe direction indicators (only on top card) */}
                {isTop && (
                    <>
                        <motion.div
                            className="absolute top-6 left-6 z-20 rounded-full border-2 border-red-400 px-3 py-1 text-red-400 font-bold text-sm"
                            style={{ opacity: leftOpacity }}
                        >
                            <X size={18} className="inline -mt-0.5" /> SKIP
                        </motion.div>
                        <motion.div
                            className="absolute top-6 right-6 z-20 rounded-full border-2 border-emerald-500 px-3 py-1 text-emerald-500 font-bold text-sm"
                            style={{ opacity: rightOpacity }}
                        >
                            <Heart size={18} className="inline -mt-0.5 fill-emerald-500" /> PICK
                        </motion.div>
                    </>
                )}

                {/* Card content */}
                <div className="relative z-10 h-full flex flex-col p-7 sm:p-9">
                    {/* Corner icon */}
                    <div className="text-4xl sm:text-5xl mb-4 select-none" aria-hidden="true">
                        {wish.icon}
                    </div>

                    {/* Wish text with handwriting reveal */}
                    <div className="flex-1 flex items-center">
                        {isBlankCard ? (
                            <div className="text-center w-full">
                                <Pencil size={32} className="mx-auto mb-4 text-[#a08060] opacity-40" />
                                <p className="font-handwritten text-xl sm:text-2xl text-[#8B7355] italic">
                                    Write your own wish...
                                </p>
                            </div>
                        ) : (
                            <p className="font-handwritten text-xl sm:text-2xl md:text-[1.65rem] text-[#2B1B0E] leading-relaxed tracking-wide">
                                {isTop ? (
                                    <>
                                        {fullText.slice(0, displayedChars)}
                                        {!isWritingDone && (
                                            <span className="inline-block ml-0.5 opacity-70 animate-pulse text-base">✒️</span>
                                        )}
                                    </>
                                ) : (
                                    fullText
                                )}
                            </p>
                        )}
                    </div>

                    {/* Decorative bottom accent */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e8ddd0]/60">
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map((i) => (
                                <span key={i} className="text-xs text-[#d4a574] opacity-60">✦</span>
                            ))}
                        </div>
                        <span className="text-xs text-[#b8956a] tracking-widest uppercase font-medium opacity-50">
                            {wish.tone}
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ──────────────────────────────────────────────
   WishDeck — the complete swipeable deck flow
   ────────────────────────────────────────────── */

type DeckPhase = "browsing" | "confirming" | "customizing" | "releasing" | "done";

export const WishDeck = () => {
    const { config } = useBirthdayStore();
    const { isHindi, isBengali, isFrench } = useTranslation();
    
    const { name, relationship } = config;
    const primaryColor = config.favoriteColor || "#FF6B6B";

    // Build the deck once per relationship/name combo
    const deck = useMemo(() => {
        const templates = getWishDeck(relationship, name);
        return [...templates, { ...WRITE_YOUR_OWN_CARD, text: "" }];
    }, [relationship, name]);

    // Random rotations for each card in the deck (pre-computed for stability)
    const rotations = useMemo(
        () => deck.map(() => (Math.random() - 0.5) * 3),
        [deck]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<DeckPhase>("browsing");
    const [selectedWish, setSelectedWish] = useState<WishTemplate | null>(null);
    const [customText, setCustomText] = useState("");
    const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
    const [releaseParticles, setReleaseParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Heading text
    const heading = isBengali
        ? "আপনার জন্য অফুরন্ত শুভকামনা ✨"
        : isHindi
        ? "आपके लिए ढेरों दुआएं ✨"
        : isFrench
        ? "Vœux pour toi ✨"
        : "Wishes for You ✨";

    const swipeLeft = useCallback(() => {
        setExitDirection("left");
        setTimeout(() => {
            setCurrentIndex((prev) => Math.min(prev + 1, deck.length - 1));
            setExitDirection(null);
        }, 350);
    }, [deck.length]);

    const swipeRight = useCallback(() => {
        const wish = deck[currentIndex];
        if (wish.id === "write-your-own") {
            setSelectedWish(wish);
            setCustomText("");
            setPhase("customizing");
        } else {
            setSelectedWish(wish);
            setPhase("confirming");
        }
    }, [currentIndex, deck]);

    const handleCustomize = () => {
        if (selectedWish) {
            setCustomText(selectedWish.text);
            setPhase("customizing");
        }
    };

    const handleUseWish = () => {
        setPhase("releasing");
        triggerRelease();
    };

    const handleSendCustom = () => {
        if (customText.trim()) {
            setPhase("releasing");
            triggerRelease();
        }
    };

    const triggerRelease = () => {
        // Spawn particles
        const emojis = ["✨", "💖", "🌟", "💫", "🎉", "💕", "⭐"];
        const particles = Array.from({ length: 14 }, (_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 200,
            y: -(60 + Math.random() * 180),
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
        }));
        setReleaseParticles(particles);

        // End after animation
        setTimeout(() => {
            setPhase("done");
            setReleaseParticles([]);
        }, 2200);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setPhase("browsing");
        setSelectedWish(null);
        setCustomText("");
    };

    // Focus textarea on customize mode
    useEffect(() => {
        if (phase === "customizing" && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [phase]);

    const isAtEnd = currentIndex >= deck.length - 1 && phase === "browsing";
    const visibleCards = deck.slice(currentIndex, currentIndex + 3);

    return (
        <section className="relative z-20 px-4 pb-32">
            {/* Section heading */}
            <h2
                className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-center mb-12 sm:mb-16 drop-shadow-xl"
                style={{ color: primaryColor }}
            >
                {heading}
            </h2>

            {/* Card progress */}
            {phase === "browsing" && (
                <div className="text-center mb-6">
                    <span className="text-white/40 text-sm tracking-wider">
                        {currentIndex + 1} / {deck.length}
                    </span>
                </div>
            )}

            {/* ── BROWSING PHASE: Swipeable deck ── */}
            {phase === "browsing" && (
                <div className="max-w-md mx-auto">
                    {/* Deck container */}
                    <div className="relative w-full h-[440px] sm:h-[480px] flex items-center justify-center mb-8">
                        <AnimatePresence>
                            {visibleCards.map((wish, i) => {
                                const realIndex = currentIndex + i;
                                const isCurrentTop = i === 0 && !exitDirection;
                                return (
                                    <WishCard
                                        key={`${wish.id}-${realIndex}`}
                                        wish={wish}
                                        isTop={isCurrentTop}
                                        stackIndex={exitDirection && i === 0 ? -1 : i}
                                        onSwipeLeft={swipeLeft}
                                        onSwipeRight={swipeRight}
                                        rotation={rotations[realIndex] || 0}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Skip / Select buttons */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            type="button"
                            onClick={swipeLeft}
                            disabled={isAtEnd}
                            className="w-14 h-14 rounded-full border-2 border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Skip this wish"
                        >
                            <X size={24} />
                        </button>

                        <button
                            type="button"
                            onClick={swipeRight}
                            className="w-16 h-16 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                            aria-label="Select this wish"
                        >
                            <Heart size={28} className="fill-emerald-400" />
                        </button>

                        <div className="w-14 h-14" /> {/* Spacer for visual balance */}
                    </div>
                </div>
            )}

            {/* ── CONFIRMING PHASE: Card selected ── */}
            {phase === "confirming" && selectedWish && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto"
                >
                    {/* Selected card displayed */}
                    <div
                        className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto rounded-2xl border border-[#e8ddd0] overflow-hidden mb-8"
                        style={{
                            background: "linear-gradient(145deg, #FFFDF8 0%, #FFF9F0 40%, #FFF5E8 100%)",
                            boxShadow: "0 16px 50px -10px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-multiply pointer-events-none" aria-hidden="true">
                            <filter id="confirmGrain">
                                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#confirmGrain)" />
                        </svg>
                        <div className="relative z-10 p-7 sm:p-9">
                            <div className="text-4xl mb-4">{selectedWish.icon}</div>
                            <p className="font-handwritten text-xl sm:text-2xl text-[#2B1B0E] leading-relaxed">
                                {selectedWish.text}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                            type="button"
                            onClick={handleUseWish}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Send size={18} /> Use This Wish
                        </button>
                        <button
                            type="button"
                            onClick={handleCustomize}
                            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <Pencil size={16} /> Customize It
                        </button>
                        <button
                            type="button"
                            onClick={() => setPhase("browsing")}
                            className="px-6 py-3 text-white/40 hover:text-white/70 text-sm transition-colors"
                        >
                            ← Back to deck
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── CUSTOMIZING PHASE: Edit the wish ── */}
            {phase === "customizing" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <div
                        className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto rounded-2xl border border-[#e8ddd0] overflow-hidden mb-8"
                        style={{
                            background: "linear-gradient(145deg, #FFFDF8 0%, #FFF9F0 40%, #FFF5E8 100%)",
                            boxShadow: "0 16px 50px -10px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-multiply pointer-events-none" aria-hidden="true">
                            <filter id="editGrain">
                                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#editGrain)" />
                        </svg>
                        <div className="relative z-10 p-7 sm:p-9">
                            <div className="text-3xl mb-4">✍️</div>
                            <textarea
                                ref={textareaRef}
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder={`Write a birthday wish for ${name}...`}
                                className="w-full h-[240px] sm:h-[280px] bg-transparent resize-none outline-none font-handwritten text-xl sm:text-2xl text-[#2B1B0E] leading-relaxed placeholder:text-[#b8956a]/40"
                                maxLength={300}
                            />
                            <div className="text-right text-xs text-[#b8956a]/60">
                                {customText.length}/300
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSendCustom}
                            disabled={!customText.trim()}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <Send size={18} /> Send to the World
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (selectedWish?.id === "write-your-own") {
                                    setPhase("browsing");
                                } else {
                                    setPhase("confirming");
                                }
                            }}
                            className="px-6 py-3 text-white/40 hover:text-white/70 text-sm transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── RELEASING PHASE: Card lifts & dissolves ── */}
            {phase === "releasing" && (
                <motion.div className="max-w-md mx-auto flex items-center justify-center h-[440px] relative">
                    {/* The card lifting */}
                    <motion.div
                        initial={{ scale: 1, y: 0, opacity: 1 }}
                        animate={{
                            scale: [1, 1.05, 1.15],
                            y: [0, -40, -80],
                            opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }}
                        className="w-[85vw] max-w-[340px] sm:max-w-[380px] h-[200px] rounded-2xl border border-[#e8ddd0]"
                        style={{
                            background: "linear-gradient(145deg, #FFFDF8 0%, #FFF9F0 40%, #FFF5E8 100%)",
                            boxShadow: "0 0 60px rgba(255,200,100,0.5), 0 20px 60px -10px rgba(0,0,0,0.2)",
                        }}
                    >
                        <div className="p-7 font-handwritten text-lg text-[#2B1B0E] line-clamp-4 opacity-60">
                            {customText || selectedWish?.text || ""}
                        </div>
                    </motion.div>

                    {/* Rising particles */}
                    <AnimatePresence>
                        {releaseParticles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    x: p.x,
                                    y: p.y,
                                    scale: [0, 1.2, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    ease: "easeOut",
                                    delay: 0.3 + p.id * 0.08,
                                }}
                                className="absolute text-2xl sm:text-3xl pointer-events-none"
                            >
                                {p.emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* ── DONE PHASE: Wish sent ── */}
            {phase === "done" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-md mx-auto text-center py-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="text-7xl mb-6"
                    >
                        💫
                    </motion.div>
                    <h3 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">
                        {isBengali ? "শুভকামনা পাঠানো হয়েছে!" : isHindi ? "शुभकामना भेज दी गई!" : isFrench ? "Vœu envoyé !" : "Wish Sent!"}
                    </h3>
                    <p className="text-white/50 text-lg mb-8 max-w-xs mx-auto">
                        {isBengali
                            ? "আপনার ভালোবাসা মহাবিশ্বে ছড়িয়ে পড়েছে ✨"
                            : isHindi
                            ? "आपका प्यार ब्रह्मांड में फैल गया ✨"
                            : isFrench
                            ? "Ton amour s'est répandu dans l'univers ✨"
                            : "Your love has been released into the universe ✨"}
                    </p>
                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                    >
                        <RotateCcw size={14} /> Browse Again
                    </button>
                </motion.div>
            )}
        </section>
    );
};
