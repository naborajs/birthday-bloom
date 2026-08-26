import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useTranslation } from "@/i18n";
import {
    ChevronLeft,
    Phone,
    Video,
    Info,
    Camera,
    Mic,
    Image as ImageIcon,
    Smile,
    Send,
    Heart,
} from "lucide-react";

interface FakeChatSceneProps {
    onComplete: () => void;
}

export const FakeChatScene = ({ onComplete }: FakeChatSceneProps) => {
    const [phase, setPhase] = useState<"typing" | "deleting" | "retype" | "special" | "done">("typing");
    const [typedText, setTypedText] = useState("");
    const { playType, playWhoosh, playReveal } = useSoundManager();
    const { config } = useBirthdayStore();
    const { t, isHindi, isBengali, isFrench } = useTranslation();
    const { name, relationship, favoriteColor, gender } = config;

    const isMale = gender === "male";
    const isFemale = gender === "female";
    const fullText = t("common.happyBirthday");

    const retypeFullText = useMemo(() => {
        if (isFrench) {
            if (relationship === "partner")
                return isMale ? "Pour l'homme qui fait battre mon cœur..." : isFemale ? "Pour la femme de mes rêves..." : "Pour l'âme qui me complète...";
            if (relationship === "friend")
                return "Attends, un simple message texte ? Ce n'est pas notre genre ! 😂";
            return "Une surprise exceptionnelle arrive...";
        }
        if (isBengali) {
            if (relationship === "partner")
                return isMale ? "আমার মনের রাজপুত্রের জন্য..." : isFemale ? "আমার স্বপ্নের রাজকন্যার জন্য..." : "সেই বিশেষ মানুষের জন্য যে আমাকে পূর্ণ করে...";
            if (relationship === "friend")
                return "দাঁড়াও, এত সাধারণ মেসেজ? এটা আমরা নই! 😂";
            return "দারুণ কিছু আসতে চলেছে...";
        }
        if (isHindi) {
            if (relationship === "partner")
                return isMale ? "मेरे दिल के राजा के लिए..." : isFemale ? "मेरे ख्वाबों की मलिका के लिए..." : "उस इंसान के लिए जो मुझे पूरा करता है...";
            if (relationship === "friend")
                return "अरे रुको, सिर्फ एक साधारण संदेश? वो हम नहीं! 😂";
            return "कुछ बहुत ही खास आ रहा है...";
        }
        if (relationship === "partner")
            return isMale ? "To the man who holds my heart..." : isFemale ? "To the woman of my dreams..." : "To the soul who completes me...";
        if (relationship === "friend")
            return "Wait, a boring text? That's not us! 😂";
        return "Something special is coming...";
    }, [relationship, isMale, isFemale, isHindi, isBengali, isFrench]);

    const primaryColor = favoriteColor || "#FF2A6D";

    useEffect(() => {
        let isMounted = true;
        const runSequence = async () => {
            await new Promise((r) => setTimeout(r, 800));

            // Phase 1: Type initial basic message
            for (let i = 0; i <= fullText.length; i++) {
                if (!isMounted) return;
                setTypedText(fullText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(10);
                }
                await new Promise((r) => setTimeout(r, 100));
            }

            await new Promise((r) => setTimeout(r, 1800));

            // Phase 2: Backspace deleting
            setPhase("deleting");
            for (let i = fullText.length; i >= 0; i--) {
                if (!isMounted) return;
                setTypedText(fullText.slice(0, i));
                playType();
                await new Promise((r) => setTimeout(r, 50));
            }

            await new Promise((r) => setTimeout(r, 600));

            // Phase 3: Retype deeply emotional text
            setPhase("retype");
            for (let i = 0; i <= retypeFullText.length; i++) {
                if (!isMounted) return;
                setTypedText(retypeFullText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(10);
                }
                await new Promise((r) => setTimeout(r, 70));
            }

            await new Promise((r) => setTimeout(r, 1200));

            // Phase 4: Reveal climax
            setPhase("special");
            playReveal();
            await new Promise((r) => setTimeout(r, 4200));
            playWhoosh();
            onComplete();
        };

        runSequence().catch((err) => {
            console.error("FakeChatScene sequence failed:", err);
        });

        return () => {
            isMounted = false;
        };
    }, [onComplete, playType, playWhoosh, playReveal, fullText, retypeFullText]);

    const contactName = name || (relationship === "partner" ? "My Love" : relationship === "friend" ? "Bestie 🔥" : "Family 🌟");
    const avatarEmoji = relationship === "partner" ? "💖" : relationship === "friend" ? "😎" : "👑";

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 select-none" style={{ perspective: "1500px" }}>
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 80, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 1.15, opacity: 0, filter: "blur(30px)", rotateX: -15 }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
                className="w-full max-w-sm sm:max-w-md"
            >
                {/* Instagram Phone Mock Frame */}
                <div
                    className="relative rounded-[2.8rem] overflow-hidden border border-white/15 backdrop-blur-3xl shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(225,48,108,0.25)] flex flex-col"
                    style={{
                        background: "linear-gradient(180deg, #141416 0%, #0F0F11 100%)",
                    }}
                >
                    {/* Top Instagram Header Bar */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-[#1A1A1E]/80 backdrop-blur-xl z-20">
                        {/* Back Arrow & Avatar */}
                        <div className="flex items-center gap-3">
                            <ChevronLeft size={24} className="text-white/80 cursor-pointer hover:text-white" />

                            {/* Instagram Gradient Story Ring Avatar */}
                            <div className="relative">
                                <div className="p-[2.2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_12px_rgba(221,42,123,0.5)]">
                                    <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-lg border border-white/10">
                                        {avatarEmoji}
                                    </div>
                                </div>
                                {/* Active Now Green Dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00E676] ring-2 ring-[#141416] shadow-[0_0_8px_#00E676]" />
                            </div>

                            {/* Contact Name & Status */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-bold text-sm sm:text-base tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
                                        {contactName}
                                    </span>
                                </div>
                                <span className="text-[11px] text-[#00E676] font-medium tracking-wide flex items-center gap-1">
                                    {phase === "typing" || phase === "retype" ? (
                                        <span className="text-white/60 italic flex items-center gap-1">
                                            typing<span className="animate-pulse">...</span>
                                        </span>
                                    ) : (
                                        "Active now"
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Top Action Icons */}
                        <div className="flex items-center gap-4 text-white/70">
                            <Phone size={19} className="hover:text-white transition-colors cursor-pointer" />
                            <Video size={22} className="hover:text-white transition-colors cursor-pointer" />
                            <Info size={20} className="hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="px-5 py-6 min-h-[310px] sm:min-h-[340px] flex flex-col justify-end gap-3.5 overflow-hidden">
                        {/* Timestamp Header */}
                        <div className="text-center mb-2">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] text-white/40 tracking-wider font-medium">
                                Today • 12:00 AM
                            </span>
                        </div>

                        {/* Received Message 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative self-start max-w-[80%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262A] text-white/95 text-sm sm:text-base font-normal shadow-md border border-white/5"
                        >
                            <span>{relationship === "partner" ? t("chat.heyLove") : relationship === "friend" ? t("chat.heyFriend") : t("chat.heyGeneral")}</span>
                        </motion.div>

                        {/* Received Message 2 with Double-Tap Heart Reaction */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                            className="relative self-start max-w-[85%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262A] text-white/95 text-sm sm:text-base font-normal shadow-md border border-white/5"
                        >
                            <span>{relationship === "partner" ? t("chat.stayedUpLate") : relationship === "friend" ? t("chat.prepareEpic") : t("chat.specialSurpriseMsg")}</span>

                            {/* Instagram Liked Heart Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.25, 1] }}
                                transition={{ delay: 0.9, duration: 0.4, type: "spring" }}
                                className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-[#1F1F23] border border-white/15 flex items-center shadow-lg"
                            >
                                <Heart size={12} fill="#FF2A6D" className="text-[#FF2A6D]" />
                            </motion.div>
                        </motion.div>

                        {/* Typing Indicator Pill (Instagram 3 bouncing dots) */}
                        <AnimatePresence>
                            {(phase === "typing" || phase === "retype") && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.6, y: 15 }}
                                    className="self-end px-4 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center gap-1.5 shadow-[0_4px_15px_rgba(221,42,123,0.4)]"
                                >
                                    <motion.div
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                                        className="w-2 h-2 rounded-full bg-white"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                                        className="w-2 h-2 rounded-full bg-white"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                                        className="w-2 h-2 rounded-full bg-white"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Instagram Input Field Bar */}
                    <div className="px-4 py-3.5 bg-[#17171B] border-t border-white/10 z-20">
                        <div className="flex items-center gap-2.5">
                            {/* Blue Camera Icon */}
                            <div className="w-9 h-9 rounded-full bg-[#3797EF] flex items-center justify-center text-white shadow-md cursor-pointer hover:opacity-90">
                                <Camera size={18} />
                            </div>

                            {/* Capsule Input Bubble with Live Typewriter */}
                            <div className="flex-1 rounded-full px-4 py-2.5 bg-[#26262A] border border-white/10 flex items-center justify-between min-h-[42px]">
                                <div className="flex-1 overflow-hidden pr-2">
                                    {typedText ? (
                                        <span className="text-white text-sm sm:text-[15px] font-normal leading-tight break-words">
                                            {typedText}
                                            <span className="inline-block w-[1.5px] h-4 ml-0.5 bg-[#3797EF] animate-blink align-middle" />
                                        </span>
                                    ) : (
                                        <span className="text-white/35 text-sm sm:text-[15px]">
                                            Message...
                                        </span>
                                    )}
                                </div>

                                {/* Right input icons */}
                                <div className="flex items-center gap-2 text-white/50">
                                    <Mic size={17} className="hover:text-white cursor-pointer" />
                                    <ImageIcon size={17} className="hover:text-white cursor-pointer" />
                                    <Smile size={17} className="hover:text-white cursor-pointer" />
                                </div>
                            </div>

                            {/* Instagram Gradient Send Button */}
                            <motion.div
                                animate={
                                    typedText.length > 3
                                        ? { scale: [1, 1.12, 1] }
                                        : {}
                                }
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
                                style={{
                                    background: typedText.length > 0
                                        ? "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)"
                                        : `${primaryColor}40`,
                                }}
                            >
                                <Send size={16} className={typedText.length > 0 ? "text-white" : "text-white/40"} />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Climax Message Banner */}
                <AnimatePresence>
                    {phase === "special" && (
                        <motion.div
                            initial={{ opacity: 0, y: 25, scale: 0.9, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
                            className="text-center mt-8 px-4"
                        >
                            <p className="text-2xl sm:text-3xl font-display font-black leading-snug bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                                {relationship === "partner"
                                    ? isFrench
                                        ? isMale
                                            ? "Parce qu'un prince comme toi mérite bien plus que de simples mots..."
                                            : "Parce qu'une princesse comme toi mérite bien plus que de simples mots..."
                                        : isBengali
                                            ? isMale
                                                ? "কারণ আমার রাজপুত্রের জন্য কেবল কিছু শব্দ যথেষ্ট নয়..."
                                                : "কারণ আমার রাজকন্যার জন্য কেবল কিছু শব্দ যথেষ্ট নয়..."
                                            : isHindi
                                                ? isMale
                                                    ? "क्योंकि मेरे राजा के लिए सिर्फ शब्द काफी नहीं हैं..."
                                                    : "क्योंकि मेरी रानी के लिए सिर्फ शब्द काफी नहीं हैं..."
                                                : isMale
                                                    ? "Because a King like you deserves more than just words..."
                                                    : "Because a Queen like you deserves more than just words..."
                                    : relationship === "friend"
                                        ? t("chat.highLegendLevel")
                                        : t("chat.moreMagicalSurprise")}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
