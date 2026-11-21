import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useTranslation } from "@/i18n";
import { getTemplateEmojiKit } from "@/config/emojiKits";
import { normalizeImageUrl } from "@/utils/mediaUtils";
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

interface KeyButtonProps {
    keyId: string;
    isPressed: boolean;
    isShiftActive: boolean;
    onPress: (keyId: string) => void;
}

const KeyButton = memo(({ keyId, isPressed, isShiftActive, onPress }: KeyButtonProps) => {
    const displayChar = isShiftActive ? keyId.toUpperCase() : keyId;
    return (
        <button
            type="button"
            data-key={keyId}
            data-active={isPressed ? "true" : "false"}
            onClick={() => onPress(keyId)}
            className={`relative h-8 sm:h-9 rounded-[6px] flex items-center justify-center text-[13px] sm:text-[14px] font-medium transition-all duration-75 ${
                isPressed
                    ? "bg-[#121217] text-rose-300 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                    : "bg-[#2D232B] text-white shadow-[0_1.5px_0_#000000] border-t border-white/10 hover:bg-[#382C36]"
            }`}
        >
            {isPressed && (
                <span
                    data-testid="key-callout-popup"
                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-[#4A4A58] border border-rose-400/50 text-white font-bold text-sm flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.85)] z-30"
                >
                    {displayChar}
                </span>
            )}
            {displayChar}
        </button>
    );
});
KeyButton.displayName = "KeyButton";

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
    const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({ msg2: true });
    const [animatingHeartMsg, setAnimatingHeartMsg] = useState<string | null>(null);
    const isHeartLiked = likedMessages.msg2 ?? true;

    const { playType, playWhoosh, playReveal, playPop, playBoom } = useSoundManager();
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
                return "Un simple message ne suffira jamais pour toi... Ouvre ta surprise : birthday-bloom.vercel.app 🎁✨";
            if (relationship === "friend")
                return "Attends, un simple SMS ? Pas notre genre ! Ouvre ta surprise : birthday-bloom.vercel.app 🚀🔥";
            if (relationship === "brother" || relationship === "sibling")
                return "Un simple SMS pour mon frère ? Jamais ! Ouvre ta surprise : birthday-bloom.vercel.app 🏆✨";
            if (relationship === "sister")
                return "Un simple message pour ma sœur ? Ouvre ta surprise : birthday-bloom.vercel.app 🌸✨";
            if (relationship === "father" || relationship === "mother")
                return "Un simple texto ne suffira jamais... Ouvre ta surprise : birthday-bloom.vercel.app 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "Un simple message pour une telle inspiration ? Ouvre ta surprise : birthday-bloom.vercel.app 🎯✨";
            return "Un simple message ne suffirait jamais... Ouvre ta surprise : birthday-bloom.vercel.app 💝🌟";
        }
        if (isBengali) {
            if (relationship === "partner")
                return "শুধু একটা সাধারণ টেক্সট তোমার জন্য যথেষ্ট নয়... তোমার সারপ্রাইজটি খোলো: birthday-bloom.vercel.app 🎁✨";
            if (relationship === "friend")
                return "দাঁড়াও, এত বোরিং টেক্সট? এটা আমরা নই! তোর সারপ্রাইজ খোল: birthday-bloom.vercel.app 🚀🔥";
            if (relationship === "brother" || relationship === "sibling")
                return "সেরা ভাইয়ের জন্য এত সাধারণ টেক্সট? সারপ্রাইজ খোল: birthday-bloom.vercel.app 🏆✨";
            if (relationship === "sister")
                return "মিষ্টি বোনের জন্য সামান্য মেসেজ? তোর সারপ্রাইজ খোল: birthday-bloom.vercel.app 🌸✨";
            if (relationship === "father" || relationship === "mother")
                return "বাবা-মায়ের জন্য শুধু একটা মেসেজ? কোনোদিনও যথেষ্ট নয়... সারপ্রাইজ দেখুন: birthday-bloom.vercel.app 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "সেরা অনুপ্রেরণাকে এত সাধারণ শুভেচ্ছা? অসম্ভব! সারপ্রাইজটি দেখুন: birthday-bloom.vercel.app 🎯✨";
            return "পরিবারের এত বিশেষ মানুষের জন্য শুধু একটা টেক্সট যথেষ্ট নয়... সারপ্রাইজটি দেখুন: birthday-bloom.vercel.app 💝🌟";
        }
        if (isHindi) {
            if (relationship === "partner")
                return "सिर्फ एक टेक्स्ट आपके लिए काफी नहीं हो सकता... अपना सरप्राइज खोलें: birthday-bloom.vercel.app 🎁✨";
            if (relationship === "friend")
                return "अरे, एक बोरिंग टेक्स्ट? वो हम नहीं! अपना सरप्राइज खोलो: birthday-bloom.vercel.app 🚀🔥";
            if (relationship === "brother" || relationship === "sibling")
                return "धांसू भाई के लिए सिर्फ एक टेक्स्ट? कभी नहीं! अपना सरप्राइज खोलो: birthday-bloom.vercel.app 🏆✨";
            if (relationship === "sister")
                return "मेरी प्यारी बहन के लिए सिर्फ एक मैसेज? अपना सरप्राइज खोलो: birthday-bloom.vercel.app 🌸✨";
            if (relationship === "father" || relationship === "mother")
                return "सिर्फ एक संदेश काफी नहीं हो सकता... अपना सरप्राइज खोलें: birthday-bloom.vercel.app 💐💛";
            if (relationship === "mentor" || relationship === "colleague")
                return "साधारण मैसेज? कभी नहीं! हमने कुछ खास बनाया है: birthday-bloom.vercel.app 🎯✨";
            return "सिर्फ एक साधारण टेक्स्ट कभी काफी नहीं हो सकता... अपना सरপ্রाइज खोलें: birthday-bloom.vercel.app 💝🌟";
        }

        // English Default
        if (relationship === "partner")
            return "A simple text could never capture how special you are... Open your surprise: birthday-bloom.vercel.app 🎁✨";
        if (relationship === "friend")
            return "Wait, a boring text? That's not us! Open your surprise: birthday-bloom.vercel.app 🚀🔥";
        if (relationship === "brother" || relationship === "sibling")
            return "A basic text for the best brother in the universe? Open your surprise: birthday-bloom.vercel.app 🏆✨";
        if (relationship === "sister")
            return "A plain text for my sweetest sister? Open your surprise: birthday-bloom.vercel.app 🌸✨";
        if (relationship === "father")
            return "A mere text could never thank you enough... Open your surprise: birthday-bloom.vercel.app 🌟💪";
        if (relationship === "mother")
            return "A simple message could never express our love... Open your surprise: birthday-bloom.vercel.app 💐💛";
        if (relationship === "mentor" || relationship === "colleague")
            return "A regular ping? We built something better! Open your surprise: birthday-bloom.vercel.app 🎯✨";
        return "A simple text could never capture how much you mean to us... Open your surprise: birthday-bloom.vercel.app 💝🌟";
    }, [relationship, isHindi, isBengali, isFrench]);

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
        const tId = setTimeout(() => {
            setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
        }, 1200);
        heartTimeoutsRef.current.push(tId);
    }, [playPop]);

    const lastTapRef = useRef<number>(0);
    const chatStreamRef = useRef<HTMLElement | null>(null);
    const activeKeyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const heartTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const completedRef = useRef(false);

    const finishScene = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        setPhase("done");
        playWhoosh();
        setTimeout(() => {
            onComplete();
        }, 280);
    }, [onComplete, playWhoosh]);

    const handleInstantComplete = useCallback(() => {
        if (completedRef.current) return;
        playReveal();
        if (typeof playBoom === "function") {
            playBoom();
        } else {
            playPop();
        }
        triggerHeartBurst();
        finishScene();
    }, [playReveal, playBoom, playPop, triggerHeartBurst, finishScene]);

    useEffect(() => {
        return () => {
            if (activeKeyTimeoutRef.current) {
                clearTimeout(activeKeyTimeoutRef.current);
            }
            heartTimeoutsRef.current.forEach(clearTimeout);
            heartTimeoutsRef.current = [];
        };
    }, []);

    useEffect(() => {
        if (chatStreamRef.current && typeof chatStreamRef.current.scrollTo === "function") {
            chatStreamRef.current.scrollTo({
                top: chatStreamRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [sentMessageText, phase]);

    const currentTypedWord = useMemo(() => {
        if (!typedInputText) return "";
        const parts = typedInputText.trimEnd().split(/\s+/);
        return parts[parts.length - 1] || "";
    }, [typedInputText]);

    const handleDoubleTapMessage = (msgId: string, e: React.MouseEvent | React.TouchEvent) => {
        const now = Date.now();
        if (now - lastTapRef.current < 400) {
            setLikedMessages((prev) => ({ ...prev, [msgId]: true }));
            setAnimatingHeartMsg(msgId);
            const clearAnimTimeout = setTimeout(() => setAnimatingHeartMsg(null), 850);
            heartTimeoutsRef.current.push(clearAnimTimeout);
            const clientX = "clientX" in e ? e.clientX : e.touches?.[0]?.clientX;
            const clientY = "clientY" in e ? e.clientY : e.touches?.[0]?.clientY;
            triggerHeartBurst(clientX, clientY);
        }
        lastTapRef.current = now;
    };

    const handleManualKeyPress = useCallback((keyId: string) => {
        playType();
        setActiveKey(keyId);
        if (activeKeyTimeoutRef.current) {
            clearTimeout(activeKeyTimeoutRef.current);
        }
        activeKeyTimeoutRef.current = setTimeout(() => {
            if (typeof window !== "undefined") {
                setActiveKey((prev) => (prev === keyId ? null : prev));
            }
        }, 120);
    }, [playType]);

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
            await sleep(4000);
            if (!isMounted || completedRef.current) return;
            finishScene();
        };

        runSequence().catch((err) => {
            console.error("FakeChatScene sequence failed:", err);
        });

        return () => {
            isMounted = false;
        };
    }, [finishScene, playType, playReveal, playPop, basicText, heartfeltText]);

    const emojiKit = useMemo(() => getTemplateEmojiKit(config), [config]);
    const contactName = name || (relationship === "partner" ? "My Love" : relationship === "friend" ? "Bestie 🔥" : "Family 🌟");
    const celebrantPhoto = useMemo(() => {
        return (config.photos && config.photos.length > 0)
            ? normalizeImageUrl(config.photos[0])
            : null;
    }, [config.photos]);
    const avatarEmoji = emojiKit.chat?.avatar || (relationship === "partner" ? "💖" : relationship === "friend" ? "😎" : "👑");
    const floatingBadges = useMemo(
        () => (emojiKit.floating?.length >= 4 ? emojiKit.floating.slice(0, 4) : ["💖", "✨", "🌹", "🦋"]),
        [emojiKit.floating]
    );

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
            className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/80 sm:backdrop-blur-sm p-2 sm:p-6 overflow-hidden"
            style={{
                perspective: "1400px",
            }}
        >
            {/* ── Seamless Atmospheric Dark Romantic Backdrop ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-95 transition-opacity duration-1000"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(26, 6, 22, 0.8) 0%, rgba(13, 3, 11, 0.95) 60%, #0A0209 100%)",
                }}
            />

            {/* ── 3D Smartphone Hardware Model Wrapper (Hardware Accelerated Zero-Lag Compositing) ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                    duration: 0.45,
                    ease: "easeOut",
                }}
                style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(1400px) rotateX(1.8deg) rotateY(-1.2deg)",
                }}
                className="relative w-[92vw] max-w-[362px] h-[83dvh] max-h-[720px] sm:max-w-[388px] sm:h-[87vh] sm:max-h-[790px] mb-8 sm:mb-2 p-[4px] sm:p-[5px] rounded-[44px] sm:rounded-[50px] bg-gradient-to-br from-[#2D242B] via-[#171115] to-[#251D23] shadow-[0_30px_90px_rgba(0,0,0,0.92),0_0_35px_rgba(255,42,109,0.12),inset_0_1px_2px_rgba(255,255,255,0.35)] flex flex-col will-change-transform animate-subtle-float"
            >
                {/* 3D Parallax Floating Template Emoji Orbs Around Smartphone Bezel */}
                <button
                    type="button"
                    aria-label="Floating celebration badge 1"
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHeartBurst(e.clientX, e.clientY);
                    }}
                    style={{ transform: "translateZ(28px)" }}
                    className="pointer-events-auto hidden sm:flex absolute -left-8 top-14 w-11 h-11 rounded-2xl bg-[#1c0d20]/85 border border-white/20 backdrop-blur-xl items-center justify-center text-xl shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(255,42,109,0.25)] hover:scale-115 hover:border-rose-400/60 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                    {floatingBadges[0]}
                </button>
                <button
                    type="button"
                    aria-label="Floating celebration badge 2"
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHeartBurst(e.clientX, e.clientY);
                    }}
                    style={{ transform: "translateZ(34px)" }}
                    className="pointer-events-auto hidden sm:flex absolute -right-8 top-28 w-11 h-11 rounded-2xl bg-[#1c0d20]/85 border border-white/20 backdrop-blur-xl items-center justify-center text-xl shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(255,42,109,0.25)] hover:scale-115 hover:border-rose-400/60 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                    {floatingBadges[1]}
                </button>
                <button
                    type="button"
                    aria-label="Floating celebration badge 3"
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHeartBurst(e.clientX, e.clientY);
                    }}
                    style={{ transform: "translateZ(24px)" }}
                    className="pointer-events-auto hidden sm:flex absolute -left-7 bottom-28 w-10 h-10 rounded-2xl bg-[#1c0d20]/85 border border-white/20 backdrop-blur-xl items-center justify-center text-lg shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(255,42,109,0.25)] hover:scale-115 hover:border-rose-400/60 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                    {floatingBadges[2]}
                </button>
                <button
                    type="button"
                    aria-label="Floating celebration badge 4"
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerHeartBurst(e.clientX, e.clientY);
                    }}
                    style={{ transform: "translateZ(30px)" }}
                    className="pointer-events-auto hidden sm:flex absolute -right-7 bottom-16 w-10 h-10 rounded-2xl bg-[#1c0d20]/85 border border-white/20 backdrop-blur-xl items-center justify-center text-lg shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(255,42,109,0.25)] hover:scale-115 hover:border-rose-400/60 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                    {floatingBadges[3]}
                </button>

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
                        background: "#0C020A",
                        fontFamily:
                            "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif",
                    }}
                >
                    {/* Subtle Diagonal 3D Glass Screen Reflection */}
                    <div
                        className="pointer-events-none absolute inset-0 z-40"
                        style={{
                            background:
                                "linear-gradient(125deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 30%, transparent 48%)",
                        }}
                    />

                    {/* ── Seamless Color-Harmonized OLED Wallpaper ── */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 0%, #1D0618 0%, #10030E 48%, #090208 100%)",
                            }}
                        />
                        <div
                            className="absolute top-0 inset-x-0 h-64 opacity-25"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${primaryColor}4D 0%, transparent 75%)` }}
                        />
                    </div>

                    {/* ── Simulated iOS Status Bar & Dynamic Island ── */}
                    <div className="relative z-30 px-5 pt-2.5 pb-1 flex items-center justify-between text-white/90 text-xs font-semibold shrink-0">
                        <span className="tracking-tight text-[12px] font-semibold text-white/90 pl-1">9:41</span>

                        {/* Dynamic Island Pill with Live Audio Visualizer */}
                        <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-2.5 shadow-inner border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-[#1c1c1e] ring-1 ring-white/15" />
                            {/* Live iOS Equalizer Waveform Bars */}
                            <div className="flex items-center gap-[2px]">
                                <span className="w-[2px] h-2 rounded-full bg-[#00E676] animate-pulse" />
                                <span className="w-[2px] h-3 rounded-full bg-[#00E676] animate-pulse [animation-delay:150ms]" />
                                <span className="w-[2px] h-1.5 rounded-full bg-[#00E676] animate-pulse [animation-delay:300ms]" />
                            </div>
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
                    <header className="relative z-20 px-2.5 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-between border-b border-white/8 bg-[#130311]/95 sm:backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Go back"
                                className="w-9 h-9 -ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-full transition-colors active:scale-95"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Authentic Instagram 5-Stop Story Gradient Avatar Ring */}
                            <div className="relative">
                                <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] shadow-[0_0_12px_rgba(225,48,108,0.5)]">
                                    <div className="w-9 h-9 rounded-full bg-[#121212] overflow-hidden flex items-center justify-center text-lg border border-white/10">
                                        {celebrantPhoto ? (
                                            <img
                                                src={celebrantPhoto}
                                                alt={contactName}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            avatarEmoji
                                        )}
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
                    <main
                        ref={chatStreamRef}
                        className="relative z-10 flex-1 px-3.5 py-2.5 flex flex-col justify-end gap-2.5 overflow-y-auto min-h-0"
                    >
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
                            onClick={(e) => handleDoubleTapMessage("msg1", e)}
                            className="relative self-start max-w-[82%] px-3.5 py-2 rounded-[18px] rounded-bl-[4px] bg-[#26262B]/95 text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-md border border-white/10 leading-snug cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            <span>
                                {relationship === "partner"
                                    ? t("chat.heyLove")
                                    : relationship === "friend"
                                    ? t("chat.heyFriend")
                                    : t("chat.heyGeneral")}
                            </span>

                            {/* Instagram DM Center Double-Tap Pop Heart */}
                            <AnimatePresence>
                                {animatingHeartMsg === "msg1" && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.45, 1, 0], opacity: [0, 1, 1, 0], y: [0, -8, -20] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.75, ease: "easeOut" }}
                                        className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                                    >
                                        <Heart size={36} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_12px_rgba(255,42,109,0.95)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Liked Heart Badge */}
                            <AnimatePresence>
                                {likedMessages.msg1 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.3, 1] }}
                                        transition={{ delay: 0.1, duration: 0.25, type: "spring" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            triggerHeartBurst(e.clientX, e.clientY);
                                        }}
                                        className="absolute -bottom-2.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#1C1C20] border border-white/15 flex items-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform z-10"
                                    >
                                        <Heart size={11} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_6px_rgba(255,42,109,0.8)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Received Message 2 with Double-Tap Heart Reaction */}
                        <motion.div
                            initial={{ opacity: 0, x: -14, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => handleDoubleTapMessage("msg2", e)}
                            className="relative self-start max-w-[85%] px-3.5 py-2 rounded-[18px] rounded-bl-[4px] bg-[#26262B]/95 text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-md border border-white/10 leading-snug cursor-pointer active:scale-[0.98] transition-transform mb-1"
                        >
                            <span>
                                {relationship === "partner"
                                    ? t("chat.stayedUpLate")
                                    : relationship === "friend"
                                    ? t("chat.prepareEpic")
                                    : t("chat.specialSurpriseMsg")}
                            </span>

                            {/* Instagram DM Center Double-Tap Pop Heart */}
                            <AnimatePresence>
                                {animatingHeartMsg === "msg2" && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.45, 1, 0], opacity: [0, 1, 1, 0], y: [0, -8, -20] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.75, ease: "easeOut" }}
                                        className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                                    >
                                        <Heart size={36} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_12px_rgba(255,42,109,0.95)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                        className="absolute -bottom-2.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#1C1C20] border border-white/15 flex items-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform z-10"
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
                                        onClick={(e) => handleDoubleTapMessage("sent", e)}
                                        className="relative px-4 py-2.5 rounded-[20px] rounded-br-[4px] text-white text-[13px] sm:text-[14px] font-normal normal-case tracking-normal shadow-[0_6px_22px_rgba(225,48,108,0.42)] leading-snug border border-white/20 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                                        style={{
                                            background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 36%, #FF1361 72%, #FFA033 100%)",
                                        }}
                                    >
                                        {/* Subtle top gloss highlight */}
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                                        <div className="flex flex-col gap-1.5 text-left">
                                            <span>{sentMessageText}</span>
                                            {/* Rich Instagram DM Link Preview Card */}
                                            <div className="mt-1 p-2 rounded-xl bg-black/40 border border-white/20 backdrop-blur-md flex items-center gap-2.5 text-left shadow-md">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-sm shrink-0 shadow-inner">
                                                    🎁
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-semibold text-white/95 truncate">
                                                        {name ? `${name}'s Birthday Celebration` : "Birthday Celebration"}
                                                    </span>
                                                    <span className="text-[9px] text-amber-200/90 truncate flex items-center gap-1 font-medium">
                                                        birthday-bloom.vercel.app ↗
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Instagram DM Center Double-Tap Pop Heart */}
                                        <AnimatePresence>
                                            {animatingHeartMsg === "sent" && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: [0, 1.45, 1, 0], opacity: [0, 1, 1, 0], y: [0, -8, -20] }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.75, ease: "easeOut" }}
                                                    className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                                                >
                                                    <Heart size={34} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_12px_rgba(255,42,109,0.95)]" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Liked Heart Badge on Sent Message */}
                                    <AnimatePresence>
                                        {likedMessages.sent && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: [0, 1.3, 1] }}
                                                transition={{ duration: 0.25, type: "spring" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerHeartBurst(e.clientX, e.clientY);
                                                }}
                                                className="self-end -mt-3.5 mr-1 px-1.5 py-0.5 rounded-full bg-[#1C1C20] border border-white/15 flex items-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform z-10"
                                            >
                                                <Heart size={10} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_6px_rgba(255,42,109,0.8)]" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Micro-Receipt: Delivered -> Seen just now • ❤️ */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[10px] text-white/60 pr-1 flex items-center gap-1 font-medium normal-case"
                                    >
                                        {phase === "seen" || phase === "climax" || phase === "done" ? (
                                            <span className="flex items-center gap-1 text-rose-300 font-semibold">
                                                Seen just now • <Heart size={10} fill="#FF2A6D" className="inline text-[#FF2A6D] animate-pulse drop-shadow-[0_0_4px_#FF2A6D]" />
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
                    <div className="relative z-20 px-2.5 py-2 bg-[#130311]/98 sm:backdrop-blur-md border-t border-white/8 shrink-0">
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
                            <div className="flex-1 rounded-[20px] px-3.5 py-2 bg-[#231A21] border border-white/10 flex items-center justify-between min-h-[38px] max-h-[84px] overflow-y-auto transition-all">
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
                                className="relative z-20 bg-[#120310]/98 sm:backdrop-blur-md border-t border-white/8 px-1.5 pt-1.5 pb-1.5 select-none shrink-0 overflow-hidden"
                            >
                                {/* Live iOS Predictive Text Suggestion Bar */}
                                <div
                                    data-testid="keypad-predictive-bar"
                                    className="grid grid-cols-3 items-center text-center pb-1.5 mb-1 border-b border-white/5 text-[11px] text-white/75"
                                >
                                    <span className="truncate px-2 border-r border-white/10 text-white/60">
                                        {currentTypedWord ? `"${currentTypedWord}"` : '"Happy"'}
                                    </span>
                                    <span
                                        className={`truncate px-2 border-r border-white/10 font-medium transition-colors ${
                                            activeKey === "space"
                                                ? "text-rose-300 bg-white/10 rounded py-0.5"
                                                : "text-white/90"
                                        }`}
                                    >
                                        {currentTypedWord || "Birthday"}
                                    </span>
                                    <span className="truncate px-2 text-white/80">
                                        {phase === "typing-heartfelt" ? "💝 🌟" : "🎂 ✨"}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    {/* Row 1: Q - P */}
                                    <div className="grid grid-cols-10 gap-1">
                                        {KEYBOARD_ROW_1.map((key) => (
                                            <KeyButton
                                                key={key}
                                                keyId={key}
                                                isPressed={activeKey === key}
                                                isShiftActive={isShiftActive}
                                                onPress={handleManualKeyPress}
                                            />
                                        ))}
                                    </div>

                                    {/* Row 2: A - L */}
                                    <div className="grid grid-cols-9 gap-1 px-3">
                                        {KEYBOARD_ROW_2.map((key) => (
                                            <KeyButton
                                                key={key}
                                                keyId={key}
                                                isPressed={activeKey === key}
                                                isShiftActive={isShiftActive}
                                                onPress={handleManualKeyPress}
                                            />
                                        ))}
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
                                                    : "bg-[#251B23] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            ⇧
                                        </button>

                                        <div className="flex-1 grid grid-cols-7 gap-1">
                                            {KEYBOARD_ROW_3.map((key) => (
                                                <KeyButton
                                                    key={key}
                                                    keyId={key}
                                                    isPressed={activeKey === key}
                                                    isShiftActive={isShiftActive}
                                                    onPress={handleManualKeyPress}
                                                />
                                            ))}
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
                                                    : "bg-[#251B23] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
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
                                                    : "bg-[#251B23] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
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
                                                    : "bg-[#251B23] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
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
                                                    : "bg-[#332530] text-white/85 shadow-[0_1.5px_0_#000000] border-t border-white/12"
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
                                initial={{ opacity: 0, y: 35, scale: 0.88 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                className="absolute inset-x-3 sm:inset-x-4 top-[24%] z-30 flex flex-col items-center"
                            >
                                {/* Glowing Ambient Aura Halo */}
                                <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-r from-rose-500/35 via-pink-500/25 to-amber-500/35 blur-xl -z-10 animate-pulse pointer-events-none" />

                                {/* Glassmorphic Card Container */}
                                <div className="relative w-full overflow-hidden p-5 sm:p-6 rounded-[26px] bg-gradient-to-b from-[#210927]/96 via-[#140618]/98 to-[#0B020E]/98 border border-rose-400/40 backdrop-blur-3xl text-center shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(244,63,94,0.35),inset_0_1px_2px_rgba(255,255,255,0.35)]">
                                    {/* Shimmer line on top rim */}
                                    <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-rose-300 to-transparent pointer-events-none" />

                                    {/* Eyebrow Tag */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-400/30 text-amber-200 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase mb-3 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                                        <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
                                        <span>A Special Surprise Awaits</span>
                                        <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
                                    </div>

                                    {/* Animated Center Jewel */}
                                    <div className="relative w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/40 to-amber-400/40 blur-md animate-pulse" />
                                        <div className="relative w-11 h-11 rounded-full bg-[#240C2A] border border-rose-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                                            <Heart size={20} fill="#FF2A6D" className="text-[#FF2A6D] drop-shadow-[0_0_8px_rgba(255,42,109,0.9)] animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Climax Narrative Headline */}
                                    <p className="text-[16px] sm:text-[18px] font-bold normal-case tracking-tight leading-snug bg-gradient-to-r from-amber-100 via-rose-100 to-pink-200 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(244,63,94,0.4)]">
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

                                    {/* Interactive Pulsing CTA Button */}
                                    <motion.button
                                        type="button"
                                        onClick={handleInstantComplete}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF2A6D] via-[#FF5E7E] to-[#FFA033] text-white text-[12px] sm:text-[13px] font-semibold tracking-normal flex items-center justify-center gap-2 mx-auto shadow-[0_6px_22px_rgba(255,42,109,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.7)] transition-all cursor-pointer group"
                                    >
                                        <span>Enter Celebration</span>
                                        <Sparkles size={14} className="group-hover:rotate-12 transition-transform text-amber-200" />
                                    </motion.button>
                                </div>
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

