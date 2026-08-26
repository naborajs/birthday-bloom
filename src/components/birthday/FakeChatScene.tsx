import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
    Sparkles,
} from "lucide-react";

interface FakeChatSceneProps {
    onComplete: () => void;
}

interface FloatingHeart {
    id: number;
    x: number;
    y: number;
    size: number;
}

export const FakeChatScene = ({ onComplete }: FakeChatSceneProps) => {
    const [phase, setPhase] = useState<
        | "incoming"
        | "typing-basic"
        | "holding-basic"
        | "deleting"
        | "typing-heartfelt"
        | "send-pulse"
        | "sent"
        | "seen"
        | "climax"
        | "done"
    >("incoming");

    const [typedInputText, setTypedInputText] = useState("");
    const [sentMessageText, setSentMessageText] = useState("");
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
    const [isHeartLiked, setIsHeartLiked] = useState(true);

    const { playType, playWhoosh, playReveal, playPop } = useSoundManager();
    const { config } = useBirthdayStore();
    const { t, isHindi, isBengali, isFrench } = useTranslation();
    const { name, relationship, favoriteColor, gender } = config;

    const isMale = gender === "male";
    const isFemale = gender === "female";
    const primaryColor = favoriteColor || "#FF2A6D";

    const basicText = t("common.happyBirthday");

    const heartfeltText = useMemo(() => {
        if (isFrench) {
            if (relationship === "partner")
                return isMale ? "Pour l'homme qui fait battre mon cœur... ❤️" : isFemale ? "Pour la femme de mes rêves... ❤️" : "Pour l'âme qui me complète... ❤️";
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
                return isMale ? "আমার মনের রাজপুত্রের জন্য... ❤️" : isFemale ? "আমার স্বপ্নের রাজকন্যার জন্য... ❤️" : "সেই বিশেষ মানুষের জন্য যে আমাকে পূর্ণ করে... ❤️";
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
                return isMale ? "मेरे दिल के राजा के लिए... ❤️" : isFemale ? "मेरे ख्वाबों की मलिका के लिए... ❤️" : "उस इंसान के लिए जो मुझे पूरा करता है... ❤️";
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
            return isMale ? "To the man who holds my heart... ❤️" : isFemale ? "To the woman of my dreams... ❤️" : "To the soul who completes me... ❤️";
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

    const triggerHeartBurst = useCallback((clientX?: number, clientY?: number) => {
        playPop();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(30);
        }
        const originX = clientX ?? window.innerWidth / 2;
        const originY = clientY ?? window.innerHeight / 2;

        const newHearts: FloatingHeart[] = Array.from({ length: 6 }, (_, i) => ({
            id: Date.now() + i + Math.random(),
            x: originX + (Math.random() - 0.5) * 60,
            y: originY + (Math.random() - 0.5) * 40,
            size: 16 + Math.random() * 16,
        }));

        setFloatingHearts((prev) => [...prev, ...newHearts]);
        setTimeout(() => {
            setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
        }, 1200);
    }, [playPop]);

    const lastTapRef = useRef<number>(0);
    const handleDoubleTapMessage = (e: React.MouseEvent | React.TouchEvent) => {
        const now = Date.now();
        if (now - lastTapRef.current < 320) {
            setIsHeartLiked(true);
            const clientX = "clientX" in e ? e.clientX : e.touches[0]?.clientX;
            const clientY = "clientY" in e ? e.clientY : e.touches[0]?.clientY;
            triggerHeartBurst(clientX, clientY);
        }
        lastTapRef.current = now;
    };

    useEffect(() => {
        let isMounted = true;

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const runSequence = async () => {
            // Initial breathing pause
            await sleep(700);
            if (!isMounted) return;

            // Phase 1: Typing basic message ("Happy Birthday")
            setPhase("typing-basic");
            for (let i = 0; i <= basicText.length; i++) {
                if (!isMounted) return;
                setTypedInputText(basicText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(8);
                }
                await sleep(85);
            }

            // Phase 2: Hold & reflect ("Wait... this is too ordinary")
            setPhase("holding-basic");
            await sleep(1800);
            if (!isMounted) return;

            // Phase 3: Backspace deleting
            setPhase("deleting");
            for (let i = basicText.length; i >= 0; i--) {
                if (!isMounted) return;
                setTypedInputText(basicText.slice(0, i));
                playType();
                await sleep(38);
            }

            await sleep(400);
            if (!isMounted) return;

            // Phase 4: Type deeply personal message
            setPhase("typing-heartfelt");
            for (let i = 0; i <= heartfeltText.length; i++) {
                if (!isMounted) return;
                setTypedInputText(heartfeltText.slice(0, i));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(8);
                }
                await sleep(55);
            }

            // Phase 5: Send button pulse
            setPhase("send-pulse");
            await sleep(650);
            if (!isMounted) return;

            // Phase 6: Fly message into chat as Sent
            setSentMessageText(heartfeltText);
            setTypedInputText("");
            setPhase("sent");
            playPop();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([40, 30, 40]);
            }

            // Phase 7: "Seen just now • ❤️" micro-receipt
            await sleep(1200);
            if (!isMounted) return;
            setPhase("seen");

            // Phase 8: Reveal Climax Narrative Banner
            await sleep(1400);
            if (!isMounted) return;
            setPhase("climax");
            playReveal();

            // Climax display duration before seamless transition
            await sleep(3800);
            if (!isMounted) return;
            setPhase("done");
            playWhoosh();
            await sleep(300);
            onComplete();
        };

        runSequence().catch((err) => {
            console.error("FakeChatScene sequence failed:", err);
        });

        return () => {
            isMounted = false;
        };
    }, [onComplete, playType, playWhoosh, playReveal, playPop, basicText, heartfeltText]);

    const contactName = name || (relationship === "partner" ? "My Love" : relationship === "friend" ? "Bestie 🔥" : "Family 🌟");
    const avatarEmoji = relationship === "partner" ? "💖" : relationship === "friend" ? "😎" : "👑";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/90 md:bg-black/95 backdrop-blur-2xl p-0 md:p-6 overflow-hidden">
            {/* Ambient Desktop Atmospheric Glow in Favorite Theme Color */}
            <div
                className="hidden md:block absolute w-[480px] h-[780px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle, ${primaryColor} 0%, rgba(131,58,180,0.5) 50%, transparent 75%)`,
                }}
            />

            {/* Phone Container: Full-bleed on Mobile (<768px), Authentic iPhone 16 Pro Silhouette on Desktop */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full md:h-[94vh] md:max-h-[860px] md:max-w-[420px] flex flex-col md:rounded-[48px] md:border-[4px] md:border-[#38333b] md:shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12)] overflow-hidden relative"
                style={{
                    background: "#0D0209",
                }}
            >
                {/* ── Modern Instagram "Midnight Rose" Ambient Mesh Wallpaper ── */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Deep luxury plum/charcoal base */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(ellipse at 50% 0%, #2A081B 0%, #160412 50%, #0D0209 100%)",
                        }}
                    />

                    {/* Soft Dreamy Rose/Amethyst Auras */}
                    <div
                        className="absolute top-[20%] -left-20 w-80 h-80 rounded-full blur-[100px] opacity-25"
                        style={{ background: primaryColor }}
                    />
                    <div
                        className="absolute bottom-[25%] -right-20 w-80 h-80 rounded-full blur-[110px] opacity-20"
                        style={{ background: "#A855F7" }}
                    />

                    {/* Subtle slow-drifting dust sparkles (CSS transform/opacity only) */}
                    <div className="absolute top-[18%] left-[25%] w-1.5 h-1.5 rounded-full bg-rose-200/40 animate-pulse" />
                    <div className="absolute top-[45%] right-[20%] w-1 h-1 rounded-full bg-purple-200/30 animate-ping" />
                    <div className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 rounded-full bg-amber-100/30 animate-pulse" />
                    <div className="absolute bottom-[20%] right-[30%] w-1 h-1 rounded-full bg-pink-300/40 animate-pulse" />
                </div>

                {/* ── Simulated iOS Status Bar & Dynamic Island (Desktop & Mobile) ── */}
                <div
                    className="relative z-30 px-6 pt-3 pb-1 flex items-center justify-between text-white/90 text-xs font-semibold shrink-0"
                    style={{
                        paddingTop: "max(10px, env(safe-area-inset-top, 10px))",
                    }}
                >
                    {/* Time */}
                    <span className="tracking-tight text-[13px] font-medium text-white/90 pl-1">9:41</span>

                    {/* Dynamic Island Pill */}
                    <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2.5 shadow-inner border border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e] border border-white/10" />
                        <div className="w-2 h-2 rounded-full bg-[#00E676]/80 animate-pulse" />
                    </div>

                    {/* Cell, WiFi, Battery Indicators */}
                    <div className="flex items-center gap-1.5 pr-1">
                        {/* Cellular Signal Bars */}
                        <svg className="w-4 h-3 text-white/90 fill-current" viewBox="0 0 17 12">
                            <rect x="0" y="8" width="3" height="4" rx="0.5" />
                            <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                            <rect x="9" y="3" width="3" height="9" rx="0.5" />
                            <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
                        </svg>
                        {/* WiFi */}
                        <svg className="w-4 h-3 text-white/90 fill-current" viewBox="0 0 16 12">
                            <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-2.5a5.9 5.9 0 018.4 0 .8.8 0 101.1-1.1 7.5 7.5 0 00-10.6 0 .8.8 0 001.1 1.1zm-2.8-2.8a9.9 9.9 0 0114 0 .8.8 0 101.1-1.1 11.5 11.5 0 00-16.2 0 .8.8 0 001.1 1.1z" />
                        </svg>
                        {/* Battery */}
                        <div className="w-5 h-2.5 rounded-[4px] border border-white/80 p-[1px] flex items-center">
                            <div className="w-full h-full bg-white rounded-[2px]" />
                        </div>
                    </div>
                </div>

                {/* ── Instagram Direct Message Header Bar ── */}
                <header className="relative z-20 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between border-b border-white/10 bg-[#160614]/80 backdrop-blur-xl shrink-0">
                    {/* Left: Back Chevron & Profile Info */}
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            aria-label="Go back"
                            className="w-10 h-10 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-full transition-colors active:scale-95"
                        >
                            <ChevronLeft size={26} />
                        </button>

                        {/* Story Gradient Avatar Ring */}
                        <div className="relative">
                            <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_12px_rgba(221,42,123,0.5)]">
                                <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-xl border border-white/10">
                                    {avatarEmoji}
                                </div>
                            </div>
                            {/* Glowing Active Indicator Dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00E676] ring-2 ring-[#160614] shadow-[0_0_8px_#00E676]" />
                        </div>

                        {/* Contact Name & Status */}
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-semibold text-sm sm:text-base tracking-tight truncate max-w-[140px] sm:max-w-[180px]">
                                {contactName}
                            </span>
                            <span className="text-[11px] text-[#00E676] font-medium tracking-wide flex items-center gap-1">
                                {phase === "typing-basic" || phase === "typing-heartfelt" ? (
                                    <span className="text-white/60 italic flex items-center gap-1">
                                        typing<span className="animate-pulse">...</span>
                                    </span>
                                ) : (
                                    "Active now"
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Right Action Icons: Phone, Video, Info */}
                    <div className="flex items-center gap-1 text-white/80">
                        <button
                            type="button"
                            aria-label="Voice call"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Phone size={19} />
                        </button>
                        <button
                            type="button"
                            aria-label="Video call"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Video size={21} />
                        </button>
                        <button
                            type="button"
                            aria-label="Chat details"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                        >
                            <Info size={20} />
                        </button>
                    </div>
                </header>

                {/* ── Scrollable Chat Message Stream ── */}
                <main className="relative z-10 flex-1 px-4 py-4 flex flex-col justify-end gap-3.5 overflow-y-auto">
                    {/* Centered Timestamp Pill */}
                    <div className="text-center my-1">
                        <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] text-white/50 tracking-wider font-medium backdrop-blur-md border border-white/5">
                            Today • 12:00 AM
                        </span>
                    </div>

                    {/* Received Message 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -16, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        onClick={handleDoubleTapMessage}
                        className="relative self-start max-w-[82%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262B]/90 backdrop-blur-md text-white text-sm sm:text-[15px] font-normal shadow-md border border-white/10 leading-relaxed cursor-pointer active:scale-[0.98] transition-transform"
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
                        initial={{ opacity: 0, x: -16, scale: 0.94 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.35, ease: "easeOut" }}
                        onClick={handleDoubleTapMessage}
                        className="relative self-start max-w-[85%] px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-[#26262B]/90 backdrop-blur-md text-white text-sm sm:text-[15px] font-normal shadow-md border border-white/10 leading-relaxed cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        <span>
                            {relationship === "partner"
                                ? t("chat.stayedUpLate")
                                : relationship === "friend"
                                ? t("chat.prepareEpic")
                                : t("chat.specialSurpriseMsg")}
                        </span>

                        {/* Liked Heart Badge */}
                        <AnimatePresence>
                            {isHeartLiked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.35, 1] }}
                                    transition={{ delay: 0.7, duration: 0.35, type: "spring" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        triggerHeartBurst(e.clientX, e.clientY);
                                    }}
                                    className="absolute -bottom-2.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#1C1C20] border border-white/15 flex items-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                                >
                                    <Heart size={13} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_6px_rgba(255,42,109,0.8)]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Dynamic Sent Outgoing Message with Instagram Signature Sunset Gradient */}
                    <AnimatePresence>
                        {sentMessageText && (
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                className="self-end max-w-[85%] flex flex-col items-end gap-1"
                            >
                                <div
                                    className="relative px-4 py-3 rounded-[20px] rounded-br-[4px] text-white text-sm sm:text-[15px] font-normal shadow-[0_8px_24px_rgba(236,72,153,0.35)] leading-relaxed border border-white/15"
                                    style={{
                                        background: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
                                    }}
                                >
                                    {sentMessageText}
                                </div>

                                {/* Micro-Receipt: Delivered -> Seen just now • ❤️ */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[11px] text-white/50 pr-1 flex items-center gap-1 font-medium"
                                >
                                    {phase === "seen" || phase === "climax" || phase === "done" ? (
                                        <span className="flex items-center gap-1 text-rose-300/80">
                                            Seen just now • <Heart size={10} fill="#FF2A6D" className="inline text-[#FF2A6D]" />
                                        </span>
                                    ) : (
                                        <span>Delivered</span>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Typing Dots Wave Indicator before text appears */}
                    <AnimatePresence>
                        {(phase === "typing-basic" || phase === "typing-heartfelt") && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                                className="self-end px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center gap-1.5 shadow-[0_4px_16px_rgba(221,42,123,0.45)]"
                            >
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                />
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                />
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* ── Fixed Bottom Instagram Input Bar ── */}
                <footer
                    className="relative z-20 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#160614]/90 border-t border-white/10 backdrop-blur-xl shrink-0"
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
                        <div className="flex-1 rounded-full px-3.5 py-2 bg-[#26262B] border border-white/10 flex items-center justify-between min-h-[44px] overflow-hidden">
                            <div className="flex-1 overflow-hidden pr-2">
                                {typedInputText ? (
                                    <span className="text-white text-sm sm:text-[15px] font-normal leading-tight break-words">
                                        {typedInputText}
                                        <span className="inline-block w-[2px] h-4 ml-0.5 bg-[#3797EF] animate-blink align-middle" />
                                    </span>
                                ) : (
                                    <span className="text-white/35 text-sm sm:text-[15px]">
                                        Message...
                                    </span>
                                )}
                            </div>

                            {/* Right Input Icons (Mic, Gallery, Emoji) */}
                            <div className="flex items-center gap-0.5 text-white/50 shrink-0">
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

                        {/* Instagram Gradient Send Button with Dynamic Pulse */}
                        <button
                            type="button"
                            aria-label="Send message"
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg shrink-0 transition-all ${
                                phase === "send-pulse" ? "scale-115 shadow-[0_0_20px_#FD1D1D]" : "active:scale-95"
                            }`}
                            style={{
                                background:
                                    typedInputText.length > 0 || phase === "send-pulse"
                                        ? "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)"
                                        : `${primaryColor}35`,
                            }}
                        >
                            <Send size={18} className={typedInputText.length > 0 || phase === "send-pulse" ? "text-white" : "text-white/40"} />
                        </button>
                    </div>
                </footer>

                {/* ── Climax Emotional Payoff Banner Overlay ── */}
                <AnimatePresence>
                    {phase === "climax" && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(12px)" }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute inset-x-4 top-[32%] z-30 p-6 sm:p-7 rounded-[28px] bg-black/90 border border-white/25 backdrop-blur-3xl text-center shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                        >
                            <div className="flex justify-center mb-3 text-rose-400">
                                <Sparkles size={28} className="animate-spin-slow" />
                            </div>
                            <p className="text-xl sm:text-2xl font-display font-black leading-snug bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                                {relationship === "partner"
                                    ? isFrench
                                        ? isMale
                                            ? "Parce qu'un prince comme toi mérite bien plus qu'un simple message... ✨"
                                            : "Parce qu'une princesse comme toi mérite bien plus qu'un simple message... ✨"
                                        : isBengali
                                        ? isMale
                                            ? "কারণ আমার রাজপুত্রের জন্য শুধু একটা টেক্সট যথেষ্ট নয়... ✨"
                                            : "কারণ আমার রাজকন্যার জন্য শুধু একটা টেক্সট যথেষ্ট নয়... ✨"
                                        : isHindi
                                        ? isMale
                                            ? "क्योंकि मेरे राजा के लिए सिर्फ एक टेक्स्ट काफी नहीं... ✨"
                                            : "क्योंकि मेरी रानी के लिए सिर्फ एक टेक्स्ट काफी नहीं... ✨"
                                        : isMale
                                        ? "Because a King like you deserves more than just a text message... ✨"
                                        : "Because a Queen like you deserves more than just a text message... ✨"
                                    : relationship === "friend"
                                    ? t("chat.highLegendLevel")
                                    : t("chat.moreMagicalSurprise")}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Interactive Floating Hearts Overlay (Burst on Double-Tap/Click) ── */}
                <AnimatePresence>
                    {floatingHearts.map((heart) => (
                        <motion.div
                            key={heart.id}
                            initial={{ opacity: 1, scale: 0.5, x: heart.x, y: heart.y }}
                            animate={{
                                opacity: 0,
                                scale: [0.5, 1.3, 1],
                                y: heart.y - 120,
                                x: heart.x + (Math.random() - 0.5) * 40,
                            }}
                            transition={{ duration: 1.1, ease: "easeOut" }}
                            className="fixed z-50 pointer-events-none text-rose-500 drop-shadow-[0_0_12px_rgba(255,42,109,0.9)]"
                        >
                            <Heart size={heart.size} fill="#FF2A6D" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
