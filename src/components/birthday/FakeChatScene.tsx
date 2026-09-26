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
    Delete,
    CornerDownLeft,
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

const KEYBOARD_ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const KEYBOARD_ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const KEYBOARD_ROW_3 = ["z", "x", "c", "v", "b", "n", "m"];
const ALL_LETTER_KEYS = [...KEYBOARD_ROW_1, ...KEYBOARD_ROW_2, ...KEYBOARD_ROW_3];

/**
 * Maps a typed character (Latin, accented French, emoji, or Indic script)
 * to a virtual keyboard key identifier so every keystroke visibly depresses/darkens a key.
 */
function resolveKeyId(char: string): string {
    if (!char) return "";
    if (char === " ") return "space";

    // Normalize accented Latin characters (e.g., French é -> e, ç -> c)
    const normalized = char
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (/^[a-z]$/.test(normalized)) {
        return normalized;
    }

    if (/^[0-9.,?!'"\-:;()]$/.test(normalized)) {
        return "123";
    }

    const code = char.codePointAt(0) ?? 0;
    // Emoji surrogate / pictographic ranges
    if (code > 0x1f000 || (code >= 0x2600 && code <= 0x27bf) || char === "❤️") {
        return "emoji";
    }

    // Indic scripts (Hindi Devanagari / Bengali) map deterministically to letter keys
    if (code > 127) {
        return ALL_LETTER_KEYS[code % ALL_LETTER_KEYS.length];
    }

    return "space";
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
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isShiftActive, setIsShiftActive] = useState(false);
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

    const handleManualKeyPress = (keyId: string) => {
        playType();
        setActiveKey(keyId);
        setTimeout(() => {
            setActiveKey((prev) => (prev === keyId ? null : prev));
        }, 120);
    };

    useEffect(() => {
        let isMounted = true;

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        // Convert to code-point arrays so multi-byte emojis (💝, 🌟) never split into surrogate halves ()
        const basicChars = Array.from(basicText);
        const heartfeltChars = Array.from(heartfeltText);

        const runSequence = async () => {
            // Initial breathing pause
            await sleep(700);
            if (!isMounted) return;

            // Phase 1: Typing basic message ("Happy Birthday")
            setPhase("typing-basic");
            for (let i = 1; i <= basicChars.length; i++) {
                if (!isMounted) return;
                const char = basicChars[i - 1];
                const keyId = resolveKeyId(char);
                const isUpper = char !== char.toLowerCase() && char === char.toUpperCase();

                setIsShiftActive(isUpper);
                setActiveKey(keyId);
                setTypedInputText(basicChars.slice(0, i).join(""));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(8);
                }
                await sleep(55);
                if (!isMounted) return;
                setActiveKey(null);
                setIsShiftActive(false);
                await sleep(30);
            }

            // Phase 2: Hold & reflect ("Wait... this is too ordinary")
            setPhase("holding-basic");
            setActiveKey(null);
            await sleep(1700);
            if (!isMounted) return;

            // Phase 3: Backspace deleting with live backspace key darkening
            setPhase("deleting");
            for (let i = basicChars.length - 1; i >= 0; i--) {
                if (!isMounted) return;
                setActiveKey("backspace");
                setTypedInputText(basicChars.slice(0, i).join(""));
                playType();
                await sleep(26);
                if (!isMounted) return;
                setActiveKey(null);
                await sleep(14);
            }

            setActiveKey(null);
            await sleep(380);
            if (!isMounted) return;

            // Phase 4: Type deeply personal message with live key darkening
            setPhase("typing-heartfelt");
            for (let i = 1; i <= heartfeltChars.length; i++) {
                if (!isMounted) return;
                const char = heartfeltChars[i - 1];
                const keyId = resolveKeyId(char);
                const isUpper = char !== char.toLowerCase() && char === char.toUpperCase();

                setIsShiftActive(isUpper);
                setActiveKey(keyId);
                setTypedInputText(heartfeltChars.slice(0, i).join(""));
                playType();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                    navigator.vibrate(8);
                }
                await sleep(38);
                if (!isMounted) return;
                setActiveKey(null);
                setIsShiftActive(false);
                await sleep(18);
            }

            // Phase 5: Send button & keyboard return key physical press & darken
            setPhase("send-pulse");
            setActiveKey("send");
            await sleep(620);
            if (!isMounted) return;
            setActiveKey(null);

            // Phase 6: Fly message into chat as Sent & retract virtual keyboard
            setSentMessageText(heartfeltChars.join(""));
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

    const isKeyboardOpen =
        phase === "incoming" ||
        phase === "typing-basic" ||
        phase === "holding-basic" ||
        phase === "deleting" ||
        phase === "typing-heartfelt" ||
        phase === "send-pulse";

    const isSendDepressed = phase === "send-pulse" || activeKey === "send";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/30 backdrop-blur-md p-2 sm:p-6 overflow-hidden"
            style={{
                perspective: "1400px",
            }}
        >
            {/* ── Website Theme-Harmonious Ambient Backdrop (Preserves Crimson/Gold/Rose Glow) ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-85 transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(circle at 50% 45%, ${primaryColor}33 0%, rgba(131, 58, 180, 0.22) 42%, rgba(12, 4, 10, 0.72) 100%)`,
                }}
            />
            <div
                className="absolute w-[340px] h-[580px] sm:w-[500px] sm:h-[760px] rounded-full blur-[110px] opacity-35 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${primaryColor} 0%, rgba(252,176,69,0.45) 55%, transparent 75%)`,
                }}
            />

            {/* ── 3D Smartphone Hardware Model Wrapper (Works on Both Mobile & Desktop) ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -8, y: 24 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    rotateX: [2, 0.5, 2],
                    rotateY: [-2.5, 2, -2.5],
                    y: [0, -4, 0],
                }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(18px)" }}
                transition={{
                    opacity: { duration: 0.45, ease: "easeOut" },
                    scale: { duration: 0.5, ease: "easeOut" },
                    rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                    transformStyle: "preserve-3d",
                }}
                className="relative w-[92vw] max-w-[362px] h-[83dvh] max-h-[720px] sm:max-w-[388px] sm:h-[87vh] sm:max-h-[790px] mb-8 sm:mb-2 p-[4px] sm:p-[5px] rounded-[44px] sm:rounded-[50px] bg-gradient-to-br from-[#7c6270] via-[#2b2228] to-[#523b47] shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_45px_rgba(255,42,109,0.18),inset_0_1px_2px_rgba(255,255,255,0.45)] flex flex-col"
            >
                {/* 3D Hardware Left Buttons (Action + Volume Up/Down) */}
                <div className="pointer-events-none absolute -left-[3px] top-[96px] w-[3px] h-6 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -left-[3px] top-[136px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -left-[3px] top-[190px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />

                {/* 3D Hardware Right Button (Power / Side Button) */}
                <div className="pointer-events-none absolute -right-[3px] top-[152px] w-[3px] h-14 rounded-r-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />

                {/* 3D Floor Pedestal Shadow Beneath Phone */}
                <div className="pointer-events-none absolute -bottom-7 inset-x-8 h-6 rounded-full bg-black/65 blur-xl -z-10" />

                {/* ── Inner OLED Display Screen (Isolated Modern Sans-Serif Typography) ── */}
                <div
                    className="relative w-full h-full flex-1 flex flex-col rounded-[40px] sm:rounded-[45px] overflow-hidden border border-white/10 font-sans normal-case tracking-normal"
                    style={{
                        background: "#12040E",
                        fontFamily:
                            "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif",
                    }}
                >
                    {/* Subtle Diagonal 3D Glass Screen Reflection */}
                    <div
                        className="pointer-events-none absolute inset-0 z-40"
                        style={{
                            background:
                                "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 30%, transparent 48%)",
                        }}
                    />

                    {/* ── Modern Instagram "Midnight Rose" Ambient Mesh Wallpaper ── */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 0%, #310A20 0%, #1B0515 52%, #0F030C 100%)",
                            }}
                        />
                        <div
                            className="absolute top-[16%] -left-16 w-64 h-64 rounded-full blur-[85px] opacity-25"
                            style={{ background: primaryColor }}
                        />
                        <div
                            className="absolute bottom-[28%] -right-16 w-64 h-64 rounded-full blur-[90px] opacity-20"
                            style={{ background: "#A855F7" }}
                        />
                    </div>

                    {/* ── Simulated iOS Status Bar & Dynamic Island ── */}
                    <div className="relative z-30 px-5 pt-2.5 pb-1 flex items-center justify-between text-white/90 text-xs font-semibold shrink-0">
                        <span className="tracking-tight text-[12px] font-semibold text-white/90 pl-1">9:41</span>

                        {/* Dynamic Island Pill */}
                        <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-2.5 shadow-inner border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-[#1c1c1e] border border-white/10" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00E676]/85 animate-pulse" />
                        </div>

                        {/* Cell, WiFi, Battery Indicators */}
                        <div className="flex items-center gap-1.5 pr-1">
                            <svg className="w-3.5 h-2.5 text-white/90 fill-current" viewBox="0 0 17 12">
                                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
                            </svg>
                            <svg className="w-3.5 h-2.5 text-white/90 fill-current" viewBox="0 0 16 12">
                                <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-2.5a5.9 5.9 0 018.4 0 .8.8 0 101.1-1.1 7.5 7.5 0 00-10.6 0 .8.8 0 001.1 1.1zm-2.8-2.8a9.9 9.9 0 0114 0 .8.8 0 101.1-1.1 11.5 11.5 0 00-16.2 0 .8.8 0 001.1 1.1z" />
                            </svg>
                            <div className="w-5 h-2.5 rounded-[4px] border border-white/80 p-[1px] flex items-center">
                                <div className="w-full h-full bg-white rounded-[2px]" />
                            </div>
                        </div>
                    </div>

                    {/* ── Instagram Direct Message Header Bar ── */}
                    <header className="relative z-20 px-2.5 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-between border-b border-white/10 bg-[#1A0717]/85 backdrop-blur-xl shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Go back"
                                className="w-9 h-9 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-full transition-colors active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Story Gradient Avatar Ring */}
                            <div className="relative">
                                <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_10px_rgba(221,42,123,0.45)]">
                                    <div className="w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center text-lg border border-white/10">
                                        {avatarEmoji}
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00E676] ring-2 ring-[#1A0717] shadow-[0_0_6px_#00E676]" />
                            </div>

                            {/* Contact Name & Status */}
                            <div className="flex flex-col justify-center">
                                <span className="text-white font-semibold text-[13px] sm:text-[14px] leading-tight tracking-normal normal-case truncate max-w-[125px] sm:max-w-[155px]">
                                    {contactName}
                                </span>
                                <span className="text-[10px] text-[#00E676] font-medium tracking-normal normal-case flex items-center gap-1">
                                    {phase === "typing-basic" || phase === "typing-heartfelt" ? (
                                        <span className="text-white/60 italic flex items-center gap-0.5">
                                            typing<span className="animate-pulse">...</span>
                                        </span>
                                    ) : (
                                        "Active now"
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Right Action Icons: Phone, Video, Info */}
                        <div className="flex items-center gap-0.5 text-white/80">
                            <button
                                type="button"
                                aria-label="Voice call"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                            >
                                <Phone size={17} />
                            </button>
                            <button
                                type="button"
                                aria-label="Video call"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                            >
                                <Video size={19} />
                            </button>
                            <button
                                type="button"
                                aria-label="Chat details"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white"
                            >
                                <Info size={18} />
                            </button>
                        </div>
                    </header>

                    {/* ── Scrollable Chat Message Stream ── */}
                    <main className="relative z-10 flex-1 px-3.5 py-2.5 flex flex-col justify-end gap-2.5 overflow-y-auto min-h-0">
                        {/* Centered Timestamp Pill */}
                        <div className="text-center my-0.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-white/55 tracking-normal normal-case font-medium backdrop-blur-md border border-white/5">
                                Today • 12:00 AM
                            </span>
                        </div>

                        {/* Received Message 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -14, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={handleDoubleTapMessage}
                            className="relative self-start max-w-[82%] px-3.5 py-2 rounded-[18px] rounded-bl-[4px] bg-[#26262B]/95 text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-md border border-white/10 leading-snug cursor-pointer active:scale-[0.98] transition-transform"
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
                            initial={{ opacity: 0, x: -14, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                            onClick={handleDoubleTapMessage}
                            className="relative self-start max-w-[85%] px-3.5 py-2 rounded-[18px] rounded-bl-[4px] bg-[#26262B]/95 text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-md border border-white/10 leading-snug cursor-pointer active:scale-[0.98] transition-transform mb-1"
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
                                        animate={{ scale: [0, 1.3, 1] }}
                                        transition={{ delay: 0.6, duration: 0.3, type: "spring" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            triggerHeartBurst(e.clientX, e.clientY);
                                        }}
                                        className="absolute -bottom-2.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#1C1C20] border border-white/15 flex items-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                                    >
                                        <Heart size={11} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_6px_rgba(255,42,109,0.8)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Dynamic Sent Outgoing Message with Instagram Signature Sunset Gradient */}
                        <AnimatePresence>
                            {sentMessageText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 24, scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    className="self-end max-w-[85%] flex flex-col items-end gap-1"
                                >
                                    <div
                                        className="relative px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-[0_8px_24px_rgba(236,72,153,0.35)] leading-snug border border-white/15"
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
                                        className="text-[10px] text-white/55 pr-1 flex items-center gap-1 font-medium normal-case"
                                    >
                                        {phase === "seen" || phase === "climax" || phase === "done" ? (
                                            <span className="flex items-center gap-1 text-rose-300/85">
                                                Seen just now • <Heart size={9} fill="#FF2A6D" className="inline text-[#FF2A6D]" />
                                            </span>
                                        ) : (
                                            <span>Delivered</span>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Typing Dots Wave Indicator */}
                        <AnimatePresence>
                            {(phase === "typing-basic" || phase === "typing-heartfelt") && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.6, y: 8 }}
                                    className="self-end px-3 py-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex items-center gap-1 shadow-[0_4px_14px_rgba(221,42,123,0.4)]"
                                >
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                                        className="w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                                        className="w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                                        className="w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    {/* ── Non-Bloating Instagram Input Bar ── */}
                    <div className="relative z-20 px-2.5 py-2 bg-[#1A0717]/95 border-t border-white/10 backdrop-blur-xl shrink-0">
                        <div className="flex items-end gap-1.5">
                            {/* Blue Camera Button */}
                            <button
                                type="button"
                                aria-label="Open camera"
                                className="w-9 h-9 rounded-full bg-[#3797EF] flex items-center justify-center text-white shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0 mb-0.5"
                            >
                                <Camera size={17} />
                            </button>

                            {/* Sleek Rounded-[20px] Input Box (Never bloats into a clipping oval) */}
                            <div className="flex-1 rounded-[20px] px-3.5 py-2 bg-[#26262B] border border-white/12 flex items-center justify-between min-h-[38px] max-h-[84px] overflow-y-auto transition-all">
                                <div className="flex-1 min-w-0 pr-1">
                                    {typedInputText ? (
                                        <span className="block text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal leading-snug break-words">
                                            {typedInputText}
                                            <span className="inline-block w-[2px] h-3.5 ml-0.5 bg-[#3797EF] animate-blink align-middle" />
                                        </span>
                                    ) : (
                                        <span className="text-white/40 text-[13px] sm:text-[14px] normal-case tracking-normal">
                                            Message...
                                        </span>
                                    )}
                                </div>

                                {/* Secondary Input Icons: Auto-collapse while typing so text has full width */}
                                <div
                                    className={`flex items-center gap-0.5 text-white/55 shrink-0 transition-all duration-200 ${
                                        typedInputText.length > 0
                                            ? "w-0 opacity-0 pointer-events-none overflow-hidden"
                                            : "w-auto opacity-100"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        aria-label="Record voice note"
                                        className="w-7 h-7 flex items-center justify-center hover:text-white transition-colors"
                                    >
                                        <Mic size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Attach photo"
                                        className="w-7 h-7 flex items-center justify-center hover:text-white transition-colors"
                                    >
                                        <ImageIcon size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Add sticker or emoji"
                                        className="w-7 h-7 flex items-center justify-center hover:text-white transition-colors"
                                    >
                                        <Smile size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Send Button with Realistic Depress + Darken Animation */}
                            <button
                                type="button"
                                aria-label="Send message"
                                onClick={() => handleManualKeyPress("send")}
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 mb-0.5 transition-all duration-150 ${
                                    isSendDepressed
                                        ? "scale-90 translate-y-[1.5px] brightness-75 shadow-inner ring-2 ring-rose-300/60"
                                        : "shadow-lg active:scale-90 active:brightness-75"
                                }`}
                                style={{
                                    background:
                                        typedInputText.length > 0 || isSendDepressed
                                            ? "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)"
                                            : `${primaryColor}40`,
                                }}
                            >
                                <Send
                                    size={16}
                                    className={
                                        typedInputText.length > 0 || isSendDepressed ? "text-white" : "text-white/45"
                                    }
                                />
                            </button>
                        </div>
                    </div>

                    {/* ── Interactive On-Screen Mobile Virtual Keypad with Live Key-Press Darkening ── */}
                    <AnimatePresence initial={false}>
                        {isKeyboardOpen && (
                            <motion.div
                                data-testid="virtual-mobile-keypad"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: "easeInOut" }}
                                className="relative z-20 bg-[#18181D]/95 border-t border-white/10 backdrop-blur-2xl px-1.5 pt-2 pb-1.5 select-none shrink-0 overflow-hidden"
                            >
                                <div className="flex flex-col gap-1.5">
                                    {/* Row 1: Q - P */}
                                    <div className="grid grid-cols-10 gap-1">
                                        {KEYBOARD_ROW_1.map((key) => {
                                            const isPressed = activeKey === key;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    data-key={key}
                                                    data-active={isPressed ? "true" : "false"}
                                                    onClick={() => handleManualKeyPress(key)}
                                                    className={`h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[13px] sm:text-[14px] font-medium transition-all duration-75 ${
                                                        isPressed
                                                            ? "bg-[#121217] text-rose-300 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                            : "bg-[#3A3A44] text-white shadow-[0_1.5px_0_#000000] border-t border-white/15 hover:bg-[#454552]"
                                                    }`}
                                                >
                                                    {isShiftActive ? key.toUpperCase() : key}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Row 2: A - L */}
                                    <div className="grid grid-cols-9 gap-1 px-3">
                                        {KEYBOARD_ROW_2.map((key) => {
                                            const isPressed = activeKey === key;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    data-key={key}
                                                    data-active={isPressed ? "true" : "false"}
                                                    onClick={() => handleManualKeyPress(key)}
                                                    className={`h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[13px] sm:text-[14px] font-medium transition-all duration-75 ${
                                                        isPressed
                                                            ? "bg-[#121217] text-rose-300 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                            : "bg-[#3A3A44] text-white shadow-[0_1.5px_0_#000000] border-t border-white/15 hover:bg-[#454552]"
                                                    }`}
                                                >
                                                    {isShiftActive ? key.toUpperCase() : key}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Row 3: Shift + Z - M + Backspace */}
                                    <div className="flex items-center gap-1">
                                        {/* Shift Key */}
                                        <button
                                            type="button"
                                            aria-label="Shift"
                                            data-key="shift"
                                            data-active={isShiftActive ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("shift")}
                                            className={`w-9 sm:w-10 h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-xs font-semibold transition-all duration-75 shrink-0 ${
                                                isShiftActive
                                                    ? "bg-white text-black scale-[0.92] shadow-inner"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            ⇧
                                        </button>

                                        <div className="flex-1 grid grid-cols-7 gap-1">
                                            {KEYBOARD_ROW_3.map((key) => {
                                                const isPressed = activeKey === key;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        data-key={key}
                                                        data-active={isPressed ? "true" : "false"}
                                                        onClick={() => handleManualKeyPress(key)}
                                                        className={`h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[13px] sm:text-[14px] font-medium transition-all duration-75 ${
                                                            isPressed
                                                                ? "bg-[#121217] text-rose-300 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                                : "bg-[#3A3A44] text-white shadow-[0_1.5px_0_#000000] border-t border-white/15 hover:bg-[#454552]"
                                                        }`}
                                                    >
                                                        {isShiftActive ? key.toUpperCase() : key}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Backspace Key (Darkens & depresses during deleting phase) */}
                                        <button
                                            type="button"
                                            aria-label="Backspace"
                                            data-key="backspace"
                                            data-active={activeKey === "backspace" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("backspace")}
                                            className={`w-9 sm:w-10 h-8 sm:h-9 rounded-[6px] flex items-center justify-center transition-all duration-75 shrink-0 ${
                                                activeKey === "backspace"
                                                    ? "bg-[#121217] text-rose-400 scale-[0.86] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/70"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            <Delete size={15} />
                                        </button>
                                    </div>

                                    {/* Row 4: 123, Emoji, Spacebar, Return/Send */}
                                    <div className="flex items-center gap-1 pt-0.5">
                                        <button
                                            type="button"
                                            data-key="123"
                                            data-active={activeKey === "123" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("123")}
                                            className={`w-10 sm:w-11 h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[11px] font-semibold transition-all duration-75 shrink-0 ${
                                                activeKey === "123"
                                                    ? "bg-[#121217] text-rose-300 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            123
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Emoji key"
                                            data-key="emoji"
                                            data-active={activeKey === "emoji" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("emoji")}
                                            className={`w-9 sm:w-10 h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-sm transition-all duration-75 shrink-0 ${
                                                activeKey === "emoji"
                                                    ? "bg-[#121217] scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            😊
                                        </button>

                                        {/* Spacebar */}
                                        <button
                                            type="button"
                                            aria-label="Space"
                                            data-key="space"
                                            data-active={activeKey === "space" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("space")}
                                            className={`flex-1 h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[12px] font-medium tracking-normal normal-case transition-all duration-75 ${
                                                activeKey === "space"
                                                    ? "bg-[#121217] text-rose-200 scale-[0.95] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/50"
                                                    : "bg-[#3A3A44] text-white/85 shadow-[0_1.5px_0_#000000] border-t border-white/15"
                                            }`}
                                        >
                                            space
                                        </button>

                                        {/* Keyboard Send / Return Key */}
                                        <button
                                            type="button"
                                            aria-label="Keyboard send"
                                            data-key="send"
                                            data-active={isSendDepressed ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("send")}
                                            className={`w-14 sm:w-16 h-8 sm:h-9 rounded-[6px] flex items-center justify-center gap-1 text-[12px] font-semibold tracking-normal normal-case text-white transition-all duration-100 shrink-0 ${
                                                isSendDepressed
                                                    ? "bg-[#1b4f82] scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-2 ring-white/50"
                                                    : "bg-[#3797EF] shadow-[0_1.5px_0_#000000] border-t border-white/20"
                                            }`}
                                        >
                                            <span>Send</span>
                                            <CornerDownLeft size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* iOS Home Indicator Bar */}
                    <div className="relative z-20 bg-[#18181D]/95 pb-1.5 pt-1 flex justify-center shrink-0">
                        <div className="w-28 h-1 rounded-full bg-white/30" />
                    </div>

                    {/* ── Climax Emotional Payoff Banner Overlay ── */}
                    <AnimatePresence>
                        {phase === "climax" && (
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(12px)" }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="absolute inset-x-3.5 top-[28%] z-30 p-5 sm:p-6 rounded-[24px] bg-black/90 border border-white/25 backdrop-blur-3xl text-center shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                            >
                                <div className="flex justify-center mb-2.5 text-rose-400">
                                    <Sparkles size={26} className="animate-spin-slow" />
                                </div>
                                <p className="text-lg sm:text-xl font-bold normal-case tracking-normal leading-snug bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
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
                </div>
            </motion.div>
        </div>
    );
};

