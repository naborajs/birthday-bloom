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
    const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "retype" | "special" | "done">("typing");
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
                return "Attends, un simple message texte ? Ce n'est pas notre genre ! 😂🚀";
            if (relationship === "brother" || relationship === "sibling")
                return "Un simple SMS pour le meilleur frère du monde ? Pas question ! 🏆";
            if (relationship === "sister")
                return "Un simple message pour ma sœur adorée ? Tu mérites tout un univers ! 🌸✨";
            if (relationship === "father")
                return "Un simple texto ne suffira jamais pour remercier mon héros... 🌟💪";
            if (relationship === "mother")
                return "Un simple message ne pourra jamais exprimer tout mon amour... 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "Un simple message pour une telle inspiration ? On a créé bien mieux ! 🎯✨";
            return "Un simple message ne suffirait jamais pour exprimer tout notre amour... 💝🌟";
        }
        if (isBengali) {
            if (relationship === "partner")
                return isMale ? "আমার মনের রাজপুত্রের জন্য..." : isFemale ? "আমার স্বপ্নের রাজকন্যার জন্য..." : "সেই বিশেষ মানুষের জন্য যে আমাকে পূর্ণ করে...";
            if (relationship === "friend")
                return "দাঁড়াও, এত সাধারণ মেসেজ? এটা আমরা নই! 😂🚀";
            if (relationship === "brother" || relationship === "sibling")
                return "সেরা ভাইয়ের জন্য এত সাধারণ টেক্সট? হতেই পারে না! 🏆";
            if (relationship === "sister")
                return "আমার মিষ্টি বোনের জন্য সামান্য মেসেজ? তোর জন্য পুরো একটা ওয়েবসাইট! 🌸✨";
            if (relationship === "father")
                return "আমার জীবনের আসল হিরোকে একটা মেসেজে কি আর ভালোবাসা জানানো যায়... 🌟💪";
            if (relationship === "mother")
                return "মায়ের জন্য শুধু একটা মেসেজ? কোনোদিনও যথেষ্ট নয়... 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "আমাদের সেরা অনুপ্রেরণাকে এত সাধারণ শুভেচ্ছা? অসম্ভব! 🎯✨";
            return "পরিবারের এত বিশেষ মানুষের জন্য একটা টেক্সট কখনোই যথেষ্ট নয়... 💝🌟";
        }
        if (isHindi) {
            if (relationship === "partner")
                return isMale ? "मेरे दिल के राजा के लिए..." : isFemale ? "मेरे ख्वाबों की मलिका के लिए..." : "उस इंसान के लिए जो मुझे पूरा करता है...";
            if (relationship === "friend")
                return "अरे रुको, सिर्फ एक साधारण संदेश? वो हम नहीं! 😂🚀";
            if (relationship === "brother" || relationship === "sibling")
                return "दुनिया के सबसे धांसू भाई के लिए सिर्फ एक टेक्स्ट? कभी नहीं! 🏆";
            if (relationship === "sister")
                return "मेरी प्यारी बहन के लिए सिर्फ एक मैसेज? तुम्हारे लिए पूरी दुनिया हाजिर है! 🌸✨";
            if (relationship === "father")
                return "हमारे असली हीरो के लिए सिर्फ एक संदेश काफी नहीं हो सकता... 🌟💪";
            if (relationship === "mother")
                return "माँ के लिए सिर्फ एक टेक्स्ट? कभी भी मुमकिन नहीं... 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "हमारी सबसे बड़ी प्रेरणा के लिए साधारण मैसेज? हमने कुछ खास बनाया है! 🎯✨";
            return "परिवार के इतने अनमोल सदस्य के लिए सिर्फ एक टेक्स्ट काफी नहीं... 💝🌟";
        }

        // English Default
        if (relationship === "partner")
            return isMale ? "To the man who holds my heart..." : isFemale ? "To the woman of my dreams..." : "To the soul who completes me...";
        if (relationship === "friend")
            return "Wait, a boring text? That's not us! 😂🚀";
        if (relationship === "brother" || relationship === "sibling")
            return "A basic text for the best brother in the universe? Not a chance! 🏆";
        if (relationship === "sister")
            return "A plain text for my sweetest sister? You deserve a whole universe! 🌸✨";
        if (relationship === "father")
            return "A mere text could never thank you enough for being my hero... 🌟💪";
        if (relationship === "mother")
            return "A simple message could never express how much your warmth means to me... 💐💛";
        if (relationship === "mentor" || relationship === "colleague")
            return "A regular birthday ping? For our greatest inspiration? We built something better! 🎯✨";
        return "A simple text could never capture how much you mean to our family... 💝🌟";
    }, [relationship, isMale, isFemale, isHindi, isBengali, isFrench]);

    const primaryColor = favoriteColor || "#FF2A6D";

    useEffect(() => {
        let isMounted = true;
        const runSequence = async () => {
            await new Promise((r) => setTimeout(r, 600));

            // Phase 1: Type initial basic message ("Happy Birthday")
            for (let i = 0; i <= fullText.length; i++) {
                if (!isMounted) return;
                setTypedText(fullText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(10);
                }
                await new Promise((r) => setTimeout(r, 95));
            }

            // Phase 2: Hold on the typed text — the "I almost just sent a text" held breath
            setPhase("holding");
            await new Promise((r) => setTimeout(r, 2200));

            // Phase 3: Backspace deleting
            setPhase("deleting");
            for (let i = fullText.length; i >= 0; i--) {
                if (!isMounted) return;
                setTypedText(fullText.slice(0, i));
                playType();
                await new Promise((r) => setTimeout(r, 45));
            }

            await new Promise((r) => setTimeout(r, 500));

            // Phase 4: Retype deeply emotional text
            setPhase("retype");
            for (let i = 0; i <= retypeFullText.length; i++) {
                if (!isMounted) return;
                setTypedText(retypeFullText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(10);
                }
                await new Promise((r) => setTimeout(r, 65));
            }

            await new Promise((r) => setTimeout(r, 1200));

            // Phase 5: Reveal climax
            setPhase("special");
            playReveal();
            await new Promise((r) => setTimeout(r, 4000));
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
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/80 md:bg-black/85 backdrop-blur-2xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(20px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full md:h-[92vh] md:max-h-[860px] md:max-w-[430px] flex flex-col md:rounded-[3rem] md:border md:border-white/15 md:shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden relative"
                style={{
                    background: "radial-gradient(ellipse at 50% 20%, #35081f 0%, #1a0512 45%, #0d020a 100%)",
                }}
            >
                {/* Custom Themed Wallpaper Layer — Subtle Repeating Micro-Heart Pattern & Ambient Bokeh */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {/* SVG Heart Pattern Mesh */}
                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 28l-1.45-1.32C13.4 22.06 10 18.98 10 15.2 10 12.12 12.42 9.7 15.5 9.7c1.74 0 3.41.81 4.5 2.09C21.09 10.51 22.76 9.7 24.5 9.7 27.58 9.7 30 12.12 30 15.2c0 3.78-3.4 6.86-8.55 11.54L20 28z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                            backgroundSize: "40px 40px",
                        }}
                    />
                    {/* Slow-Drifting Warm Bokeh Orbs */}
                    <div
                        className="absolute top-1/4 -left-16 w-64 h-64 rounded-full blur-[90px] opacity-20 pointer-events-none"
                        style={{ background: primaryColor }}
                    />
                    <div
                        className="absolute bottom-1/3 -right-16 w-64 h-64 rounded-full blur-[90px] opacity-15 pointer-events-none"
                        style={{ background: "#FF69B4" }}
                    />
                </div>

                {/* Sticky Top Instagram Header Bar */}
                <header
                    className="sticky top-0 z-20 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-white/10 bg-[#141418]/85 backdrop-blur-xl shrink-0"
                    style={{
                        paddingTop: "max(12px, env(safe-area-inset-top, 12px))",
                    }}
                >
                    {/* Left: Back Chevron & Profile Info */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <button
                            type="button"
                            aria-label="Go back"
                            className="w-11 h-11 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-full transition-colors active:scale-95"
                        >
                            <ChevronLeft size={26} />
                        </button>

                        {/* Story Gradient Avatar Ring */}
                        <div className="relative">
                            <div className="p-[2.2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_12px_rgba(221,42,123,0.4)]">
                                <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-lg border border-white/10">
                                    {avatarEmoji}
                                </div>
                            </div>
                            {/* Active Indicator Dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00E676] ring-2 ring-[#141418] shadow-[0_0_8px_#00E676]" />
                        </div>

                        {/* Contact Name & Status */}
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-semibold text-sm sm:text-base tracking-tight truncate max-w-[140px] sm:max-w-[180px]">
                                {contactName}
                            </span>
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

                    {/* Right: Phone, Video, Info Icons */}
                    <div className="flex items-center gap-1 sm:gap-2 text-white/80">
                        <button
                            type="button"
                            aria-label="Voice call"
                            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Phone size={20} />
                        </button>
                        <button
                            type="button"
                            aria-label="Video call"
                            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Video size={22} />
                        </button>
                        <button
                            type="button"
                            aria-label="Chat details"
                            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Info size={21} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Chat Message Body */}
                <main className="relative z-10 flex-1 px-4 py-5 sm:px-5 flex flex-col justify-end gap-3.5 overflow-y-auto">
                    {/* Centered Timestamp Pill */}
                    <div className="text-center my-2">
                        <span className="px-3.5 py-1 rounded-full bg-white/5 text-[11px] text-white/50 tracking-wider font-medium backdrop-blur-md border border-white/5">
                            Today • 12:00 AM
                        </span>
                    </div>

                    {/* Received Message 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative self-start max-w-[82%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262A] text-white text-sm sm:text-base font-normal shadow-md border border-white/5 leading-relaxed"
                    >
                        <span>
                            {relationship === "partner"
                                ? t("chat.heyLove")
                                : relationship === "friend"
                                ? t("chat.heyFriend")
                                : t("chat.heyGeneral")}
                        </span>
                    </motion.div>

                    {/* Received Message 2 with Double-Tap Heart Reaction */}
                    <motion.div
                        initial={{ opacity: 0, x: -16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
                        className="relative self-start max-w-[85%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262A] text-white text-sm sm:text-base font-normal shadow-md border border-white/5 leading-relaxed"
                    >
                        <span>
                            {relationship === "partner"
                                ? t("chat.stayedUpLate")
                                : relationship === "friend"
                                ? t("chat.prepareEpic")
                                : t("chat.specialSurpriseMsg")}
                        </span>

                        {/* Instagram Liked Heart Badge (Double-Tap Reaction) */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ delay: 0.85, duration: 0.35, type: "spring" }}
                            className="absolute -bottom-2.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#1F1F23] border border-white/15 flex items-center shadow-lg cursor-pointer"
                        >
                            <Heart size={13} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_6px_rgba(255,42,109,0.6)]" />
                        </motion.div>
                    </motion.div>

                    {/* Typing Indicator (Instagram 3 bouncing dots) */}
                    <AnimatePresence>
                        {(phase === "typing" || phase === "retype") && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                                className="self-end px-4 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center gap-1.5 shadow-[0_4px_16px_rgba(221,42,123,0.45)]"
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
                </main>

                {/* Fixed Bottom Instagram Input Bar */}
                <footer
                    className="sticky bottom-0 z-20 px-3.5 py-3 sm:px-4 sm:py-3.5 bg-[#141418]/90 border-t border-white/10 backdrop-blur-xl shrink-0"
                    style={{
                        paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
                    }}
                >
                    <div className="flex items-center gap-2">
                        {/* Blue Camera Icon (44px min tap target) */}
                        <button
                            type="button"
                            aria-label="Open camera"
                            className="w-11 h-11 rounded-full bg-[#3797EF] flex items-center justify-center text-white shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0"
                        >
                            <Camera size={20} />
                        </button>

                        {/* Capsule Input Bubble with Live Typewriter */}
                        <div className="flex-1 rounded-full px-3.5 py-2.5 bg-[#26262A] border border-white/10 flex items-center justify-between min-h-[44px] overflow-hidden">
                            <div className="flex-1 overflow-hidden pr-2">
                                {typedText ? (
                                    <span className="text-white text-sm sm:text-[15px] font-normal leading-tight break-words">
                                        {typedText}
                                        <span className="inline-block w-[2px] h-4 ml-0.5 bg-[#3797EF] animate-blink align-middle" />
                                    </span>
                                ) : (
                                    <span className="text-white/35 text-sm sm:text-[15px]">
                                        Message...
                                    </span>
                                )}
                            </div>

                            {/* Right Input Icons (Mic, Gallery, Emoji) */}
                            <div className="flex items-center gap-1 text-white/50 shrink-0">
                                <button type="button" aria-label="Record voice note" className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors">
                                    <Mic size={18} />
                                </button>
                                <button type="button" aria-label="Attach photo" className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors">
                                    <ImageIcon size={18} />
                                </button>
                                <button type="button" aria-label="Add sticker or emoji" className="w-8 h-8 flex items-center justify-center hover:text-white transition-colors">
                                    <Smile size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Instagram Gradient Send Button (44px min tap target) */}
                        <button
                            type="button"
                            aria-label="Send message"
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg shrink-0 transition-transform active:scale-95"
                            style={{
                                background: typedText.length > 0
                                    ? "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)"
                                    : `${primaryColor}35`,
                            }}
                        >
                            <Send size={18} className={typedText.length > 0 ? "text-white" : "text-white/40"} />
                        </button>
                    </div>
                </footer>

                {/* Climax Message Banner Overlay */}
                <AnimatePresence>
                    {phase === "special" && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
                            className="absolute inset-x-4 top-1/3 z-30 p-6 rounded-3xl bg-black/85 border border-white/20 backdrop-blur-2xl text-center shadow-[0_20px_70px_rgba(0,0,0,0.9)]"
                        >
                            <p className="text-xl sm:text-2xl font-display font-black leading-snug bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
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
