import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "./SoundManager";
import { useTranslation } from "@/i18n";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnvelopeLetterSceneProps {
    onComplete?: () => void;
    autoOpen?: boolean;
    compact?: boolean;
}

export const EnvelopeLetterScene = ({
    onComplete,
    autoOpen = false,
    compact: _compact = false,
}: EnvelopeLetterSceneProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExtracted, setIsExtracted] = useState(false);
    const [typedLength, setTypedLength] = useState(0);
    const [isTypingDone, setIsTypingDone] = useState(false);

    const { config } = useBirthdayStore();
    const { playPop, playWhoosh, playType } = useSoundManager();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const isMobile = useIsMobile();
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const relationship = config.relationship || "partner";
    const senderName = config.senderName || "";

    // Generate heartfelt paragraphs
    const paragraphs = (() => {
        if (config.customMessage && config.customMessage.trim().length > 10) {
            return config.customMessage.split("\n\n").filter(Boolean);
        }

        if (isFrench) {
            if (relationship === "partner") {
                return [
                    `Tu es ma douceur, ma force, mon repère, et je suis infiniment reconnaissant(e) de t'avoir dans ma vie. 💖`,
                    `Tu apportes tant de chaleur et d'éclat dans mon quotidien. Chaque instant partagé avec toi est un trésor inestimable.`,
                    `Pour ton jour si spécial, je te souhaite tout le bonheur, l'amour et la joie que ton cœur mérite. Que cette année t'offre d'innombrables souvenirs magiques. ✨`,
                    `À notre amour, aujourd'hui et pour toujours. 🌹`,
                ];
            }
            if (relationship === "friend") {
                return [
                    `Joyeux Anniversaire au meilleur complice et à la personne la plus incroyable de ce monde ! 🚀`,
                    `Merci pour tous les fous rires, les aventures mémorables et d'être toujours là.`,
                    `Je te souhaite une année grandiose, pleine de succès, de gâteau et de souvenirs inoubliables ! 🎉🍻`,
                ];
            }
            return [
                `À une personne exceptionnelle dont la bonté et la générosité illuminent notre univers. 🌟`,
                `Merci pour tout votre amour, votre bienveillance et votre présence chaleureuse.`,
                `Puisse cette journée être aussi merveilleuse et précieuse que vous l'êtes pour nous tous ! 💝`,
            ];
        }

        if (isBengali) {
            if (relationship === "partner") {
                return [
                    `তুমি আমার প্রশান্তি, আমার শক্তি, আমার আশ্রয়, আর তোমাকে জীবনে পেয়ে আমি চিরকৃতজ্ঞ। 💖`,
                    `তুমি আমার জীবনে অফুরন্ত আলো আর মায়া নিয়ে এসেছ। তোমার সাথে কাটানো প্রতিটি মুহূর্ত অমূল্য।`,
                    `তোমার এই বিশেষ দিনে পৃথিবীর সমস্ত ভালোবাসা ও সুখ তোমার জীবনে বর্ষিত হোক। ✨`,
                    `আমাদের এই ভালোবাসার বন্ধন চিরকাল অম্লান থাকুক। 🌹`,
                ];
            }
            if (relationship === "friend") {
                return [
                    `শুভ জন্মদিন আমার সেরা পার্টনার-ইন-ক্রাইম আর সবচেয়ে কুল দোস্তকে! 🚀`,
                    `সব পাগলামি ভরা আড্ডা আর সবসময় পাশে থাকার জন্য অনেক ধন্যবাদ।`,
                    `তোর সামনের বছরটা যেন দারুণ সব সারপ্রাইজ আর আনন্দে ভরে থাকে! 🎉🍻`,
                ];
            }
            return [
                `পরিবারের এমন একজন অনন্য মানুষকে জন্মদিনের বুকভরা শুভেচ্ছা যাঁর ভালোবাসা আমাদের পুরো সংসারকে আগলে রাখে। 🌟`,
                `আপনার স্নেহ, ত্যাগ এবং শুভাশিস আমাদের জীবনের শ্রেষ্ঠ উপহার।`,
                `ঈশ্বর আপনাকে দীর্ঘায়ু ও সর্বদা হাসিখুশি রাখুন! 💝`,
            ];
        }

        if (isHindi) {
            if (relationship === "partner") {
                return [
                    `आप मेरा सुकून, मेरी ताकत, और मेरी दुनिया हैं, और आपको पाकर मैं खुद को सबसे खुशनसीब मानता/मानती हूँ। 💖`,
                    `आप मेरी ज़िंदगी में इतनी खुशियाँ और मिठास लेकर आए हैं कि हर एक पल अनमोल बन गया है।`,
                    `आपके इस खास दिन पर, मैं दुनिया की सारी खुशियाँ और प्यार आपके नाम करता/करती हूँ। ✨`,
                    `हमारे प्यार का यह सफर हमेशा यूँ ही महकता रहे। 🌹`,
                ];
            }
            if (relationship === "friend") {
                return [
                    `जन्मदिन मुबारक मेरे सबसे पक्के यार और ज़िंदगी के सबसे बड़े पार्टनर-इन-क्राइम को! 🚀`,
                    `हर मस्ती, हर पागलपन और हमेशा साथ निभाने के लिए दिल से शुक्रिया।`,
                    `आने वाला साल तुम्हारे लिए ढेर सारी कामयाबी और मस्ती लेकर आए! 🎉🍻`,
                ];
            }
            return [
                `परिवार के उस अनमोल इंसान को जन्मदिन की ढेर सारी शुभकामनाएं जिनका प्यार हमारे जीवन की सबसे बड़ी दौलत है। 🌟`,
                `आपकी दुआएं और अपनापन ही हमारे जीवन की सबसे मजबूत ढाल है।`,
                `ईश्वर आपको हमेशा स्वस्थ और खुशहाल रखे! 💝`,
            ];
        }

        // English Default
        if (relationship === "partner") {
            return [
                `You are sweet, loyal, my rock, and I'm so grateful to have you in my life. 💖`,
                `You bring so much warmth and sweetness into my life. Every single moment with you is precious.`,
                `On your special day, I wish you all the happiness, love, and joy that you deserve. May this year bring you countless beautiful moments and wonderful memories. ✨`,
                `Here's to us, today, tomorrow, and forever. 🌹`,
            ];
        }
        if (relationship === "friend") {
            return [
                `To my absolute favorite partner-in-crime and the greatest friend on earth! 🚀`,
                `Thank you for all the chaotic adventures, the late-night laughs, and always having my back no matter what.`,
                `Wishing you a year filled with epic wins, endless joy, delicious cake, and zero regrets! 🎉🍻`,
            ];
        }
        return [
            `To someone whose kindness, wisdom, and unconditional love brighten our entire world. 🌟`,
            `Thank you for every sacrifice, every warm hug, and for making our family complete.`,
            `May your day be as radiant, joyful, and wonderful as the love you give to all of us! 💝`,
        ];
    })();

    const fullLetterText = paragraphs.join("\n\n");

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);
        playPop();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([40, 60, 40]);
        }

        setTimeout(() => {
            setIsExtracted(true);
            playWhoosh();
        }, 900);
    };

    useEffect(() => {
        if (autoOpen) {
            const t = setTimeout(handleOpen, 800);
            return () => clearTimeout(t);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoOpen]);

    // Live typewriter typing effect for the letter
    useEffect(() => {
        if (!isExtracted) return;

        if (typedLength < fullLetterText.length) {
            typingTimerRef.current = setTimeout(() => {
                setTypedLength((prev) => {
                    const next = prev + 1;
                    if (next % 4 === 0) playType();
                    return next;
                });
            }, isMobile ? 22 : 28);

            return () => {
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            };
        } else {
            setIsTypingDone(true);
        }
    }, [isExtracted, typedLength, fullLetterText.length, isMobile, playType]);

    const displayedContent = fullLetterText.slice(0, typedLength);

    return (
        <div className="relative w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[520px]">
            <AnimatePresence mode="wait">
                {!isExtracted ? (
                    /* The Luxury 3D Envelope */
                    <motion.div
                        key="envelope"
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -40, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex flex-col items-center cursor-pointer select-none"
                        onClick={handleOpen}
                    >
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-4 text-center"
                        >
                            <span className="text-3xl sm:text-4xl inline-block drop-shadow-[0_0_15px_rgba(255,42,109,0.5)]">
                                💜
                            </span>
                            <h3 className="font-display italic text-2xl sm:text-3xl text-white font-bold tracking-wide mt-2 drop-shadow-lg">
                                {isFrench
                                    ? "Pendant ce temps, la surprise 😭💌"
                                    : isBengali
                                        ? "এদিকে তোমার জন্য বিশেষ চিঠি 😭💌"
                                        : isHindi
                                            ? "इस बीच एक प्यारा सा सरप्राइज 😭💌"
                                            : "Meanwhile the surprise 😭💌"}
                            </h3>
                        </motion.div>

                        {/* Envelope Body */}
                        <div className="relative w-[310px] sm:w-[380px] h-[210px] sm:h-[250px] rounded-3xl bg-[#FAF6F0] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(255,200,120,0.2)] border-2 border-[#E5C378] overflow-hidden flex items-center justify-center">
                            {/* Inner pink lining */}
                            <div className="absolute inset-2 rounded-2xl bg-gradient-to-b from-[#FFAAA6] via-[#FF8E9E] to-[#FF758C] opacity-90" />

                            {/* Decorative gold lines */}
                            <div className="absolute inset-0 border-8 border-[#FAF6F0] rounded-3xl pointer-events-none" />
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#F5EFE6] border-b-2 border-[#E5C378]/60 [clip-path:polygon(0_0,100%_0,50%_100%)]" />

                            {/* Animated Top Flap */}
                            <motion.div
                                initial={{ rotateX: 0 }}
                                animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                style={{ transformOrigin: "top center" }}
                                className="absolute top-0 left-0 right-0 h-1/2 bg-[#FFFDF9] border-b-2 border-[#D4AF37] [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md z-20"
                            >
                                <div className="w-full h-full bg-gradient-to-b from-[#FFFDF9] to-[#F3EDE2]" />
                            </motion.div>

                            {/* Wax Heart Seal */}
                            {!isOpen && (
                                <motion.div
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative z-30 w-14 h-14 rounded-full bg-gradient-to-tr from-[#A60F35] via-[#D11A48] to-[#FF2A6D] shadow-[0_10px_25px_rgba(166,15,53,0.7),inset_0_2px_4px_rgba(255,255,255,0.4)] border-2 border-[#FFE8B3] flex items-center justify-center cursor-pointer animate-pulse"
                                >
                                    <Heart size={24} fill="white" className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                                </motion.div>
                            )}

                            {/* Letter Peek inside */}
                            <motion.div
                                animate={isOpen ? { y: -40 } : { y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="absolute bottom-3 w-[88%] h-[60%] bg-[#FAF5EA] rounded-xl shadow-inner border border-[#E8DFC8] flex items-center justify-center z-10"
                            >
                                <p className="font-script text-xs sm:text-sm text-[#8B5A2B] opacity-70">
                                    {isFrench ? "Pour toi..." : isBengali ? "তোমার জন্য..." : isHindi ? "आपके लिए..." : "For you..."}
                                </p>
                            </motion.div>
                        </div>

                        <p className="font-display text-xs sm:text-sm tracking-widest uppercase text-white/50 mt-4 flex items-center gap-2">
                            <Sparkles size={14} className="text-primary animate-pulse" />
                            {isOpen
                                ? (isFrench ? "Ouverture de la lettre..." : isBengali ? "চিঠি খোলা হচ্ছে..." : isHindi ? "पत्र खुल रहा है..." : "Opening letter...")
                                : (isFrench ? "Appuyez pour ouvrir 💌" : isBengali ? "চিঠি খুলতে স্পর্শ করুন 💌" : isHindi ? "खोलने के लिए टैप करें 💌" : "Tap to open letter 💌")}
                        </p>
                    </motion.div>
                ) : (
                    /* The Realistic Luxury Parchment Letter */
                    <motion.div
                        key="letter-card"
                        initial={{ opacity: 0, scale: 0.88, y: 60 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg rounded-[2.5rem] p-7 sm:p-11 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(218,165,32,0.3),inset_0_0_60px_rgba(180,130,70,0.14)] border-2 border-[#D4AF37]/50 text-[#2B1B17] overflow-hidden select-none"
                        style={{
                            backgroundColor: "#FAF3E3",
                            backgroundImage: `
                                radial-gradient(circle at 100% 0%, rgba(220, 180, 120, 0.25) 0%, transparent 40%),
                                radial-gradient(circle at 0% 100%, rgba(190, 140, 80, 0.2) 0%, transparent 40%),
                                radial-gradient(ellipse at center, #FFFCF5 0%, #FAF3E3 70%, #F0E2C8 100%)
                            `,
                        }}
                    >
                        {/* Realistic Hand-Crafted Paper Grain Noise Texture Layer */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.065] mix-blend-multiply"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Deckle Edge / Aged Parchment Vignette Shadow */}
                        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] shadow-[inset_0_0_45px_rgba(160,110,50,0.18),inset_0_0_90px_rgba(120,70,25,0.08)]" />

                        {/* Debossed Gold Leaf Filigree Inner Framing */}
                        <div className="absolute inset-3.5 sm:inset-4 rounded-[2rem] border border-[#D4AF37]/30 pointer-events-none" />
                        <div className="absolute inset-4 sm:inset-5 rounded-[1.8rem] border border-[#C59B27]/15 pointer-events-none" />

                        {/* Delicate Filigree Corner Ornaments */}
                        <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#C59B27]/50 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#C59B27]/50 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#C59B27]/50 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#C59B27]/50 rounded-br-sm pointer-events-none" />

                        {/* Subtle Central Botanical / Heart Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                            <Heart size={260} fill="#6B4423" />
                        </div>

                        {/* Realistic 3D Red Wax Seal Stamp with Drip Rim & Gold Halo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -40 }}
                            animate={{ scale: 1, rotate: -8 }}
                            transition={{ duration: 0.6, delay: 0.25, type: "spring", stiffness: 180 }}
                            className="absolute top-5 sm:top-6 right-5 sm:right-7 z-20 cursor-pointer"
                        >
                            <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#8C0B2B] via-[#C9184A] to-[#FF4D6D] shadow-[0_8px_22px_rgba(140,11,43,0.65),inset_0_3px_6px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.5)] border-2 border-[#FFD166]/60 flex items-center justify-center">
                                {/* Debossed Inner Ring */}
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 flex items-center justify-center shadow-inner">
                                    <Heart size={18} fill="white" className="text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]" />
                                </div>
                                {/* Molten Wax Irregular Edge Details */}
                                <div className="absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full bg-[#C9184A] opacity-80" />
                                <div className="absolute -bottom-1 -right-0.5 w-3.5 h-3 rounded-full bg-[#8C0B2B] opacity-90" />
                            </div>
                        </motion.div>

                        {/* Title Header */}
                        <div className="relative z-10 text-center mb-6 sm:mb-8 pr-12 sm:pr-14">
                            <h2 className="font-display italic text-2xl sm:text-4xl font-bold text-[#3B1F2B] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                                {isFrench
                                    ? "Un Message de Mon Cœur"
                                    : isBengali
                                        ? "আমার হৃদয়ের এক বিশেষ চিঠি"
                                        : isHindi
                                            ? "मेरे दिल का एक पैग़ाम"
                                            : "A Message From My Heart"}
                            </h2>
                            <div className="flex justify-center mt-1.5 text-purple-600 text-base sm:text-lg">
                                💜
                            </div>
                        </div>

                        {/* Live Handwritten Cursive Text Body on Parchment */}
                        <div className="relative z-10 font-script text-xl sm:text-2xl md:text-[1.65rem] text-[#24120B] leading-relaxed sm:leading-[1.75] tracking-wide min-h-[220px] whitespace-pre-line select-none font-medium drop-shadow-[0_0.5px_1px_rgba(255,255,255,0.7)]">
                            {displayedContent}
                            {!isTypingDone && (
                                <span className="inline-block w-[2.5px] h-[1.1em] ml-1 bg-[#C9184A] animate-blink align-middle shadow-[0_0_8px_rgba(201,24,74,0.7)]" />
                            )}
                        </div>

                        {/* Luxury Stationery Footer / Sign-off & Stickers */}
                        <div className="relative z-10 mt-8 pt-4 border-t border-[#D4AF37]/35 flex items-center justify-between">
                            <div className="font-script text-lg sm:text-xl md:text-2xl text-[#5C3215] font-bold tracking-wide">
                                {senderName ? `— ${senderName}` : `— Yours Forever 💕`}
                            </div>
                            <div className="flex items-center gap-1.5 text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] select-none animate-subtle-float">
                                {relationship === "friend" ? "🎉😎" : relationship === "family" ? "💐💝" : "🧸🧸"}
                            </div>
                        </div>

                        {/* Done / Continue Button */}
                        {onComplete && isTypingDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10 mt-6 flex justify-center"
                            >
                                <button
                                    type="button"
                                    onClick={onComplete}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#A60F35] via-[#D11A48] to-[#FF2A6D] text-white font-semibold text-sm sm:text-base tracking-wide shadow-[0_10px_25px_rgba(166,15,53,0.4)] hover:shadow-[0_15px_35px_rgba(166,15,53,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 border border-[#FFD166]/40"
                                >
                                    <span>{isFrench ? "Continuer la Fête ✨" : isBengali ? "উদযাপনে এগিয়ে যান ✨" : isHindi ? "जश्न जारी रखें ✨" : "Continue Celebration ✨"}</span>
                                    <ArrowRight size={17} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
