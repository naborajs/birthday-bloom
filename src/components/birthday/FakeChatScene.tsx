import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useTranslation } from "@/i18n";
import { getStoryCopy } from "./fakeChatStory";
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
    Globe,
    ExternalLink,
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

type ChatPhase =
    | "idle"
    | "composing"
    | "reconsidering"
    | "cancelling"
    | "pasting-link"
    | "sending-link"
    | "revealing-link"
    | "complete";

export const FakeChatScene = ({ onComplete }: FakeChatSceneProps) => {
    const [phase, setPhase] = useState<ChatPhase>("idle");
    const [typedInputText, setTypedInputText] = useState("");
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
    const [showTopPopup, setShowTopPopup] = useState(false);
    const [isPastingTooltip, setIsPastingTooltip] = useState(false);
    const [showLinkCard, setShowLinkCard] = useState(false);

    const { playType, playWhoosh, playReveal, playPop } = useSoundManager();
    const { config } = useBirthdayStore();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const { name, relationship, favoriteColor, gender, customMessage, senderName } = config;

    const prefersReducedMotion = useMemo(() => {
        return (
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
    }, []);

    const primaryColor = favoriteColor || "#FF2A6D";

    const storyData = useMemo(() => {
        return getStoryCopy(relationship, name, gender, isHindi, isBengali, isFrench, customMessage, senderName);
    }, [relationship, name, gender, isHindi, isBengali, isFrench, customMessage, senderName]);

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
    const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
        const now = Date.now();
        if (now - lastTapRef.current < 320) {
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

    const hasCompletedRef = useRef(false);
    const handleProceed = useCallback(() => {
        if (hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        playWhoosh();
        onComplete();
    }, [playWhoosh, onComplete]);

    useEffect(() => {
        let isMounted = true;
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        // Code-point array so emojis/multi-byte chars never get split
        const initialChars = Array.from(storyData.initialWish);
        const celebrationUrl = "https://birthdaybloom.celebration";

        const runSequence = async () => {
            await sleep(prefersReducedMotion ? 200 : 600);
            if (!isMounted) return;

            // ── Stage A: Typing normal birthday wish into composer ──
            setPhase("composing");

            if (prefersReducedMotion) {
                setTypedInputText(storyData.initialWish);
                await sleep(500);
            } else {
                for (let i = 1; i <= initialChars.length; i++) {
                    if (!isMounted) return;
                    const char = initialChars[i - 1];
                    const keyId = resolveKeyId(char);
                    const isUpper = char !== char.toLowerCase() && char === char.toUpperCase();

                    setIsShiftActive(isUpper);
                    setActiveKey(keyId);
                    setTypedInputText(initialChars.slice(0, i).join(""));
                    playType();

                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                        navigator.vibrate(6);
                    }

                    await sleep(40);
                    if (!isMounted) return;
                    setActiveKey(null);
                    setIsShiftActive(false);
                    await sleep(20);
                }
            }

            if (!isMounted) return;

            // ── Stage B: Pause & Reconsider — Beautiful Top Popup appears ──
            setPhase("reconsidering");
            setActiveKey(null);
            setShowTopPopup(true);
            playReveal();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(35);
            }

            // Increased display timer as requested so the user can comfortably read it
            await sleep(prefersReducedMotion ? 800 : 2600);
            if (!isMounted) return;

            // ── Stage C: Cancel the ordinary message (Backspacing out) ──
            setPhase("cancelling");

            if (prefersReducedMotion) {
                setTypedInputText("");
                await sleep(250);
            } else {
                for (let i = initialChars.length - 1; i >= 0; i--) {
                    if (!isMounted) return;
                    setActiveKey("backspace");
                    setTypedInputText(initialChars.slice(0, i).join(""));
                    playType();
                    await sleep(22);
                    if (!isMounted) return;
                    setActiveKey(null);
                    await sleep(12);
                }
            }

            setActiveKey(null);
            setTypedInputText("");
            await sleep(350);
            if (!isMounted) return;

            // ── Stage D1: Show pasting the link ──
            setPhase("pasting-link");
            setIsPastingTooltip(true);
            await sleep(prefersReducedMotion ? 150 : 400);
            if (!isMounted) return;
            setIsPastingTooltip(false);
            setTypedInputText(celebrationUrl);
            playType();
            await sleep(prefersReducedMotion ? 250 : 650);
            if (!isMounted) return;

            // ── Stage D2: Press Send ──
            setPhase("sending-link");
            setActiveKey("send");
            playPop();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([35, 25, 35]);
            }
            await sleep(prefersReducedMotion ? 150 : 380);
            if (!isMounted) return;

            setActiveKey(null);
            setTypedInputText("");
            setShowTopPopup(false);

            // ── Stage D3: Link card arrives in chat stream ──
            setPhase("revealing-link");
            setShowLinkCard(true);
            playReveal();

            // ── Stage E: Complete & Transition to existing experience ──
            await sleep(prefersReducedMotion ? 1800 : 3600);
            if (!isMounted) return;

            setPhase("complete");
            handleProceed();
        };

        runSequence().catch((err) => {
            console.error("FakeChatScene sequence failed:", err);
        });

        return () => {
            isMounted = false;
        };
    }, [storyData, playType, playReveal, playPop, handleProceed, prefersReducedMotion]);

    const contactName = name || (
        relationship === "partner" ? (gender === "male" ? "My King 👑" : gender === "female" ? "My Queen 👑" : "My Love 💖") :
        relationship === "father" ? "Dad ⭐" :
        relationship === "mother" ? "Mom 🌸" :
        relationship === "brother" ? "Bro 🔥" :
        relationship === "sister" ? "Sis 🌸" :
        relationship === "friend" ? "Bestie 🔥" :
        relationship === "uncle" ? "Uncle 🕶️" :
        relationship === "aunt" ? "Auntie 🌸" :
        relationship === "son" ? "Son ⭐" :
        relationship === "daughter" ? "Daughter 💖" :
        relationship === "grandfather" ? "Grandpa 💛" :
        relationship === "grandmother" ? "Grandma 💐" :
        relationship === "mentor" ? "Mentor 🎯" :
        relationship === "colleague" ? "Teammate 💼" :
        relationship === "cousin" ? "Cousin 🎉" :
        relationship === "sibling" ? "Sibling 🔥" :
        relationship === "guardian" ? "Guardian 🌟" :
        "Family 🌟"
    );

    const avatarEmoji =
        relationship === "partner" ? (gender === "male" ? "🤴" : gender === "female" ? "👸" : "💖") :
        relationship === "father" ? "👨" :
        relationship === "mother" ? "👩" :
        relationship === "brother" ? "😎" :
        relationship === "sister" ? "🌸" :
        relationship === "friend" ? "🔥" :
        relationship === "uncle" ? "🕶️" :
        relationship === "aunt" ? "💐" :
        relationship === "son" ? "👦" :
        relationship === "daughter" ? "👧" :
        relationship === "grandfather" ? "👴" :
        relationship === "grandmother" ? "👵" :
        relationship === "mentor" ? "🎯" :
        relationship === "colleague" ? "💼" :
        relationship === "cousin" ? "🎉" :
        relationship === "sibling" ? "⚡" :
        relationship === "guardian" ? "🌟" :
        "👑";

    const isKeyboardOpen =
        phase === "idle" ||
        phase === "composing" ||
        phase === "reconsidering" ||
        phase === "cancelling" ||
        phase === "pasting-link" ||
        phase === "sending-link";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center select-none bg-black/40 backdrop-blur-md p-1.5 xs:p-2 sm:p-6 overflow-hidden"
            style={{
                perspective: "1400px",
                paddingTop: "max(6px, env(safe-area-inset-top, 6px))",
                paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))",
            }}
            onClick={handleDoubleTap}
        >
            {/* ── Theme-Harmonious Ambient Backdrop ── */}
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

            {/* ── 3D Smartphone Hardware Model Wrapper (Engineered for all mobile screens & desktop) ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: prefersReducedMotion ? 0 : 8, rotateY: prefersReducedMotion ? 0 : -6, y: 20 }}
                animate={
                    prefersReducedMotion
                        ? { opacity: 1, scale: 1, y: 0 }
                        : {
                              opacity: 1,
                              scale: 1,
                              rotateX: [1.5, 0.4, 1.5],
                              rotateY: [-1.8, 1.5, -1.8],
                              y: [0, -3, 0],
                          }
                }
                exit={{ opacity: 0, scale: 1.05, filter: "blur(18px)" }}
                transition={
                    prefersReducedMotion
                        ? { duration: 0.2 }
                        : {
                              opacity: { duration: 0.45, ease: "easeOut" },
                              scale: { duration: 0.5, ease: "easeOut" },
                              rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                              rotateY: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                          }
                }
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full max-w-[364px] sm:max-w-[392px] h-[92dvh] sm:h-[87vh] max-h-[790px] my-auto p-[3.5px] sm:p-[5px] rounded-[38px] sm:rounded-[50px] bg-gradient-to-br from-[#7c6270] via-[#2b2228] to-[#523b47] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_45px_rgba(255,42,109,0.18),inset_0_1px_2px_rgba(255,255,255,0.45)] flex flex-col"
            >
                {/* 3D Hardware Left & Right Buttons */}
                <div className="pointer-events-none absolute -left-[3px] top-[96px] w-[3px] h-6 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -left-[3px] top-[136px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -left-[3px] top-[190px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -right-[3px] top-[152px] w-[3px] h-14 rounded-r-md bg-gradient-to-b from-[#8e7281] to-[#3d2e36] shadow-sm" />
                <div className="pointer-events-none absolute -bottom-7 inset-x-8 h-6 rounded-full bg-black/65 blur-xl -z-10" />

                {/* ── Inner OLED Display Screen ── */}
                <div
                    className="relative w-full h-full flex-1 flex flex-col rounded-[34px] sm:rounded-[45px] overflow-hidden border border-white/10 font-sans normal-case tracking-normal"
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

                    {/* Ambient Wallpaper Mesh */}
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
                    <header className="relative z-20 px-2 py-1.5 sm:px-3.5 sm:py-2 flex items-center justify-between border-b border-white/10 bg-[#1A0717]/85 backdrop-blur-xl shrink-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                aria-label="Go back"
                                className="w-8 h-8 sm:w-9 sm:h-9 -ml-0.5 sm:-ml-1 flex items-center justify-center text-white/90 hover:text-white rounded-full transition-colors active:scale-95"
                            >
                                <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
                            </button>

                            {/* Story Gradient Avatar Ring */}
                            <div className="relative">
                                <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_0_10px_rgba(221,42,123,0.45)]">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#121212] flex items-center justify-center text-base sm:text-lg border border-white/10">
                                        {avatarEmoji}
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00E676] ring-2 ring-[#1A0717] shadow-[0_0_6px_#00E676]" />
                            </div>

                            {/* Contact Name & Status */}
                            <div className="flex flex-col justify-center">
                                <span className="text-white font-semibold text-[13px] sm:text-[14px] leading-tight tracking-normal normal-case truncate max-w-[110px] xs:max-w-[130px] sm:max-w-[160px]">
                                    {contactName}
                                </span>
                                <span className="text-[9.5px] sm:text-[10px] text-[#00E676] font-medium tracking-normal normal-case flex items-center gap-1">
                                    Active now
                                </span>
                            </div>
                        </div>

                        {/* Right Action Icons: Phone, Video, Info */}
                        <div className="flex items-center gap-0.5 text-white/80">
                            <button
                                type="button"
                                aria-label="Voice call"
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
                            >
                                <Phone size={17} className="sm:w-[19px] sm:h-[19px]" />
                            </button>
                            <button
                                type="button"
                                aria-label="Video call"
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
                            >
                                <Video size={18} className="sm:w-5 sm:h-5" />
                            </button>
                            <button
                                type="button"
                                aria-label="Chat details"
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all"
                            >
                                <Info size={17} className="sm:w-[19px] sm:h-[19px]" />
                            </button>
                        </div>
                    </header>

                    {/* ── Top Realization Notification Popup ── */}
                    <AnimatePresence>
                        {showTopPopup && (
                            <motion.div
                                data-testid="chat-top-realization-popup"
                                initial={{ opacity: 0, y: -18, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -14, scale: 0.94 }}
                                transition={{ type: "spring", stiffness: 360, damping: 26 }}
                                className="absolute top-[80px] xs:top-[86px] sm:top-[94px] inset-x-2.5 sm:inset-x-3.5 z-30 p-2.5 sm:p-3.5 rounded-2xl bg-[#1C081A]/95 border border-rose-400/50 backdrop-blur-2xl shadow-[0_16px_42px_rgba(0,0,0,0.85),0_0_24px_rgba(255,42,109,0.3)] flex items-start gap-2 sm:gap-2.5"
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,42,109,0.5)]">
                                    <Sparkles size={15} className="text-white animate-spin-slow sm:w-4 sm:h-4" />
                                </div>
                                <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
                                            <span>💡</span>
                                            <span>Realization</span>
                                        </span>
                                        <span className="text-[8.5px] sm:text-[9px] text-white/40 font-mono">12:00 AM</span>
                                    </div>
                                    <p className="text-[11.5px] sm:text-[13px] font-semibold text-white tracking-normal leading-snug mt-0.5">
                                        {storyData.reconsiderThought}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Chat Messages Scroll Stream ── */}
                    <main className="relative z-10 flex-1 px-3.5 py-2.5 flex flex-col justify-between overflow-y-auto min-h-0">
                        {/* Centered Timestamp Pill */}
                        <div className="text-center pt-2 pb-1 shrink-0">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] text-white/60 tracking-normal normal-case font-medium backdrop-blur-md border border-white/10">
                                Today • 12:00 AM
                            </span>
                        </div>

                        {/* Conversation stream content */}
                        <div className="flex-1 flex flex-col justify-end gap-2.5 py-2">
                            {/* Stage D Rich Website Link Preview Card */}
                            <AnimatePresence>
                                {showLinkCard && (
                                    <div className="self-end flex flex-col items-end gap-1 w-full">
                                        <motion.div
                                            data-testid="chat-surprise-link"
                                            role="button"
                                            tabIndex={0}
                                            aria-label="Open birthday celebration website"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    handleProceed();
                                                }
                                            }}
                                            initial={{ opacity: 0, y: 24, scale: 0.92 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                            onClick={handleProceed}
                                            className="self-end w-full max-w-[285px] sm:max-w-[315px] rounded-[20px] rounded-tr-[4px] bg-[#1E0B19]/90 border border-rose-500/40 backdrop-blur-2xl overflow-hidden shadow-[0_16px_36px_rgba(255,42,109,0.3)] cursor-pointer hover:border-rose-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-400/80 transition-all group"
                                        >
                                            {/* Rich Card Banner */}
                                            <div className="relative h-20 bg-gradient-to-r from-rose-600/40 via-purple-700/40 to-amber-500/40 p-3 flex flex-col justify-between border-b border-white/10">
                                                <div className="flex items-center justify-between text-xs text-white/80">
                                                    <span className="flex items-center gap-1 font-mono text-[10px] text-white/75 tracking-tight">
                                                        <Globe size={11} className="text-rose-300" />
                                                        birthdaybloom.celebration
                                                    </span>
                                                    <ExternalLink size={12} className="text-rose-300 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                                        Special Birthday Website
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-normal leading-tight truncate">
                                                        {name ? `For ${name} ❤️` : "Handcrafted with Love ❤️"}
                                                    </h4>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-3 flex flex-col gap-1.5">
                                                <p className="text-[12px] font-medium text-white/90 leading-snug">
                                                    {storyData.linkSubtitle}
                                                </p>
                                                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                                    <span className="text-[10px] text-rose-300 font-semibold flex items-center gap-1 group-hover:text-rose-200 transition-colors">
                                                        <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
                                                        Tap to enter celebration ✨
                                                    </span>
                                                    <span className="text-[9px] text-white/40">Open Now</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Micro-Receipt: Delivered • ❤️ */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pr-1 text-[10px] text-rose-300/80 flex items-center gap-1 font-medium"
                                        >
                                            <span>Delivered •</span>
                                            <Heart size={9} fill="#FF2A6D" className="inline text-[#FF2A6D]" />
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </main>

                    {/* ── Sleek Instagram Input Bar ── */}
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

                            {/* Input Box Wrapper */}
                            <div className="relative flex-1">
                                {/* iOS Paste Tooltip Pill (unclipped by overflow container) */}
                                <AnimatePresence>
                                    {isPastingTooltip && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.85, y: 6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.85, y: 4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute -top-9 left-2 z-40 px-3 py-1 rounded-lg bg-[#3A3A40] text-white text-[11px] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.7)] border border-white/20 flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="text-[10px]">📋</span>
                                            <span>Paste</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Rounded-[20px] Input Box */}
                                <div className="rounded-[20px] px-3.5 py-2 bg-[#26262B] border border-white/12 flex items-center justify-between min-h-[38px] max-h-[84px] overflow-y-auto transition-all">

                                <div className="flex-1 min-w-0 pr-1">
                                    {typedInputText ? (
                                        <span
                                            className={`block text-[13px] sm:text-[14px] font-normal normal-case tracking-normal leading-snug break-all ${
                                                typedInputText.startsWith("http")
                                                    ? "text-cyan-300 underline underline-offset-2"
                                                    : "text-white"
                                            }`}
                                        >
                                            {typedInputText}
                                            <span className="inline-block w-[2px] h-3.5 ml-0.5 bg-[#3797EF] animate-blink align-middle" />
                                        </span>
                                    ) : (
                                        <span className="text-white/40 text-[13px] sm:text-[14px] normal-case tracking-normal">
                                            Message...
                                        </span>
                                    )}
                                </div>

                                {/* Secondary Input Icons */}
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
                        </div>

                        {/* Send Button */}
                            <button
                                type="button"
                                aria-label="Send message"
                                onClick={() => handleManualKeyPress("send")}
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 mb-0.5 transition-all duration-150 ${
                                    typedInputText.length > 0 || activeKey === "send"
                                        ? "shadow-lg scale-100 active:scale-90"
                                        : "opacity-60 scale-95"
                                }`}
                                style={{
                                    background:
                                        typedInputText.length > 0 || activeKey === "send"
                                            ? "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)"
                                            : `${primaryColor}40`,
                                }}
                            >
                                <Send
                                    size={16}
                                    className={typedInputText.length > 0 || activeKey === "send" ? "text-white" : "text-white/45"}
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
                                    <div className="grid grid-cols-10 gap-0.5 sm:gap-1">
                                        {KEYBOARD_ROW_1.map((key) => {
                                            const isPressed = activeKey === key;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    data-key={key}
                                                    data-active={isPressed ? "true" : "false"}
                                                    onClick={() => handleManualKeyPress(key)}
                                                    className={`h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[12px] sm:text-[14px] font-medium touch-manipulation transition-all duration-75 ${
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
                                    <div className="grid grid-cols-9 gap-0.5 sm:gap-1 px-1 sm:px-3">
                                        {KEYBOARD_ROW_2.map((key) => {
                                            const isPressed = activeKey === key;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    data-key={key}
                                                    data-active={isPressed ? "true" : "false"}
                                                    onClick={() => handleManualKeyPress(key)}
                                                    className={`h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[12px] sm:text-[14px] font-medium touch-manipulation transition-all duration-75 ${
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
                                    <div className="flex items-center gap-0.5 sm:gap-1">
                                        {/* Shift Key */}
                                        <button
                                            type="button"
                                            aria-label="Shift"
                                            data-key="shift"
                                            data-active={isShiftActive ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("shift")}
                                            className={`w-8 sm:w-10 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[11px] sm:text-xs font-semibold touch-manipulation transition-all duration-75 shrink-0 ${
                                                isShiftActive
                                                    ? "bg-white text-black scale-[0.92] shadow-inner"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            ⇧
                                        </button>

                                        <div className="flex-1 grid grid-cols-7 gap-0.5 sm:gap-1">
                                            {KEYBOARD_ROW_3.map((key) => {
                                                const isPressed = activeKey === key;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        data-key={key}
                                                        data-active={isPressed ? "true" : "false"}
                                                        onClick={() => handleManualKeyPress(key)}
                                                        className={`h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[12px] sm:text-[14px] font-medium touch-manipulation transition-all duration-75 ${
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

                                        {/* Backspace Key */}
                                        <button
                                            type="button"
                                            aria-label="Backspace"
                                            data-key="backspace"
                                            data-active={activeKey === "backspace" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("backspace")}
                                            className={`w-8 sm:w-10 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-xs font-medium touch-manipulation transition-all duration-75 shrink-0 ${
                                                activeKey === "backspace"
                                                    ? "bg-[#121217] text-rose-400 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            <Delete size={15} className="sm:w-4 sm:h-4" />
                                        </button>
                                    </div>

                                    {/* Row 4: 123 + Emoji + Space + Return/Send */}
                                    <div className="flex items-center gap-0.5 sm:gap-1 pt-0.5">
                                        <button
                                            type="button"
                                            aria-label="Numbers"
                                            data-key="123"
                                            data-active={activeKey === "123" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("123")}
                                            className={`w-8 sm:w-10 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[11px] sm:text-xs font-semibold touch-manipulation transition-all duration-75 shrink-0 ${
                                                activeKey === "123"
                                                    ? "bg-[#121217] text-rose-400 scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                    : "bg-[#2C2C35] text-white/90 shadow-[0_1.5px_0_#000000] border-t border-white/10"
                                            }`}
                                        >
                                            123
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Emoji keyboard"
                                            data-key="emoji"
                                            data-active={activeKey === "emoji" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("emoji")}
                                            className={`w-[30px] sm:w-8 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-xs sm:text-sm touch-manipulation transition-all duration-75 shrink-0 ${
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
                                            className={`flex-1 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[11px] sm:text-xs text-white/70 font-medium touch-manipulation transition-all duration-75 ${
                                                activeKey === "space"
                                                    ? "bg-[#121217] text-rose-300 scale-[0.98] translate-y-[1px] brightness-75 shadow-inner ring-1 ring-rose-500/60"
                                                    : "bg-[#3A3A44] text-white/80 shadow-[0_1.5px_0_#000000] border-t border-white/15 hover:bg-[#454552]"
                                            }`}
                                        >
                                            space
                                        </button>

                                        {/* Keyboard Send / Return */}
                                        <button
                                            type="button"
                                            aria-label="Keyboard send"
                                            data-key="send"
                                            data-active={activeKey === "send" ? "true" : "false"}
                                            onClick={() => handleManualKeyPress("send")}
                                            className={`w-[52px] sm:w-16 h-[31px] sm:h-9 rounded-[6px] flex items-center justify-center text-[11px] sm:text-xs font-semibold touch-manipulation transition-all duration-75 shrink-0 ${
                                                activeKey === "send"
                                                    ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white scale-[0.88] translate-y-[1.5px] brightness-75 shadow-inner ring-2 ring-rose-400"
                                                    : "bg-[#3797EF] text-white shadow-[0_1.5px_0_#000000] border-t border-white/20 active:opacity-90"
                                            }`}
                                        >
                                            <CornerDownLeft size={13} className="mr-0.5 sm:w-3.5 sm:h-3.5" />
                                            send
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
                </div>
            </motion.div>

            {/* ── Interactive Floating Hearts Overlay (Burst on Double-Tap/Click across full viewport) ── */}
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
                        style={{ left: 0, top: 0 }}
                        className="fixed z-50 pointer-events-none text-rose-500 drop-shadow-[0_0_12px_rgba(255,42,109,0.9)]"
                    >
                        <Heart size={heart.size} fill="#FF2A6D" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
