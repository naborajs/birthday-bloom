import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "./SoundManager";
import { SPECIAL_QUOTES } from "@/config/templates";
import { HINDI_SPECIAL_QUOTES } from "@/config/hindiTemplates";
import { BENGALI_SPECIAL_QUOTES } from "@/config/bengaliTemplates";
import { FRENCH_SPECIAL_QUOTES } from "@/config/frenchTemplates";
import { useTranslation } from "@/i18n";

interface HeartTreeProps { delay?: number; }

const FRENCH_HEART_MESSAGES = [
    "Tu es la plus belle pièce de chaque souvenir gravé dans nos cœurs. ✨",
    "Dans un monde de moments ordinaires, tu es une pure merveille extraordinaire. 🌸",
    "Chaque année, tu rayonnes d'un éclat encore plus beau et inspirant. 🌟",
    "Même les étoiles pâlissent devant la lumière de ton sourire. 🌌",
    "Merci d'être cette présence chaleureuse qui illumine chaque instant. 🧡",
    "La vraie amitié, c'est d'avoir quelqu'un d'aussi loyal et formidable que toi. 🔥",
    "Tu portes la bienveillance comme un superpouvoir sans même t'en rendre compte. 💕",
    "Cette délicatesse avec laquelle tu prends soin des autres est inoubliable. 💫",
    "Ton sourire est le doux secret de tous mes plus grands bonheurs. 🌹",
    "Tu es la preuve vivante que les plus beaux cadeaux de la vie sont imprévus. ❤️",
    "Un rire contagieux et une loyauté sans faille — voilà qui tu es. 🎉",
    "À une nouvelle année où tu continueras de briller de mille feux ! 💖",
];

const BENGALI_HEART_MESSAGES = [
    "আপনি প্রতিটি সুন্দর স্মৃতির সবচেয়ে মূল্যবান অংশ যা হৃদয় আজীবন আগলে রাখে। ✨",
    "সাধারণ মুহূর্তের এই পৃথিবীতে আপনি এক অসাধারণ মায়া। 🌸",
    "প্রতি বছর আপনি আরও উজ্জ্বল হয়ে ওঠেন — যা দেখে মন ভরে যায়। 🌟",
    "আপনার হাসির আলোয় আকাশের চাঁদ-তারাও হার মানে। 🌌",
    "আপনার উপস্থিতি পুরো পরিবেশকে ভালোবাসা আর স্নিগ্ধতায় ভরিয়ে দেয়। 🧡",
    "বন্ধুত্বের আসল মানে তো তোর মতোই — তুই সেরা! 🔥",
    "আপনার সরলতা এবং মনের উদারতাই আপনার সবচেয়ে বড় শক্তি। 💕",
    "যে নিঃস্বার্থ ভালোবাসায় আপনি সবার পাশে থাকেন, তা হৃদয় ছুঁয়ে যায়। 💫",
    "আপনার মুখের মিষ্টি হাসিই আমার সমস্ত আনন্দের উৎস। 🌹",
    "আপনি প্রমাণ করেন যে জীবনের সেরা উপহারগুলো না চেয়েই পাওয়া যায়। ❤️",
    "প্রাণখোলা হাসি আর অবিচল বিশ্বস্ততা — এটাই আপনার আসল পরিচয়। 🎉",
    "আরেকটি নতুন বছর আপনার অনন্য এবং অনবদ্য সৌন্দর্যের নামে! 💖",
];

const HINDI_HEART_MESSAGES = [
    "आप हर उस खूबसूरत याद का सबसे अनमोल हिस्सा हैं जिसे दिल संभाल कर रखता है। ✨",
    "साधारण पलों की इस दुनिया में, आप एक असाधारण जादू हैं। 🌸",
    "हर साल आप और भी ज्यादा चमकते हैं — और यह देखकर दिल खुश हो जाता है। 🌟",
    "आपकी मुस्कान के आगे आसमान के सितारे भी फीके पड़ जाते हैं। 🌌",
    "आपकी मौजूदगी हर महफ़िल को प्यार और अपनेपन से भर देती है। 🧡",
    "दोस्ती का असली मतलब हो तो तुम जैसा — यार तुम जैसा! 🔥",
    "आपकी सादगी और अच्छाई आपकी सबसे बड़ी ताकत है। 💕",
    "जिस खामोशी और सच्चाई से आप सबका साथ देते हैं, वो दिल को छू जाती है। 💫",
    "आपकी मुस्कुराहट ही मेरी सबसे बड़ी खुशी का राज़ है। 🌹",
    "आप इस बात का सबूत हैं कि ज़िंदगी के सबसे बेहतरीन तोहफे बिन मांगे मिलते हैं। ❤️",
    "हंसी में सबसे आगे, और वफादारी में सबसे पक्के — ऐसे हैं आप। 🎉",
    "एक और साल, आपके उसी बेमिसाल और शानदार अंदाज़ के नाम! 💖",
];

const HEART_MESSAGES = [
    "You are the centrepiece of every memory worth keeping. ✨",
    "In a world full of ordinary moments, you are the extraordinary one. 🌸",
    "Every year you bloom a little brighter — and somehow that still surprises me. 🌟",
    "Even the stars dim a little when you walk in. 🌌",
    "Thank you for being the reason the room always feels warmer. 🧡",
    "True friendship is having someone just as loyal and wonderful as you. 🔥",
    "You carry kindness like a superpower, and you don't even notice. 💕",
    "The quiet ways you show up for people — those are the chapters I remember. 💫",
    "Your smile is the secret behind all my happiest moments. 🌹",
    "You are proof that the best things in life are never planned. ❤️",
    "Loud in laughter, steady in loyalty — that's you, always. 🎉",
    "Here's to another year of you being absolutely, unapologetically you. 💖",
];

const TreeSparks = ({ count, color }: { count: number; color: string }) => {
    const sparks = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i, size: 3 + Math.random() * 5,
        left: 10 + Math.random() * 80, bottom: 10 + Math.random() * 80,
        duration: 3 + Math.random() * 4, delay: Math.random() * 5,
    })), [count]);
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {sparks.map((s) => (
                <motion.div key={s.id} initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -80, opacity: [0, 0.6, 0] }}
                    transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
                    className="absolute rounded-full"
                    style={{ width: s.size, height: s.size, left: `${s.left}%`, bottom: `${s.bottom}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
            ))}
        </div>
    );
};

const HEART = "M0,-8 C-2,-14 -10,-14 -12,-7 C-15,0 -8,8 0,16 C8,8 15,0 12,-7 C10,-14 2,-14 0,-8 Z";

const LEAVES = [
    { cx: 150, cy: 52,  s: 1.2, d: 0   },
    { cx: 128, cy: 32,  s: 0.9, d: 200 },
    { cx: 172, cy: 36,  s: 0.9, d: 100 },
    { cx: 150, cy: 18,  s: 0.7, d: 300 },
    { cx: 78,  cy: 98,  s: 1.1, d: 200 },
    { cx: 56,  cy: 78,  s: 0.8, d: 400 },
    { cx: 102, cy: 78,  s: 0.8, d: 300 },
    { cx: 38,  cy: 112, s: 0.6, d: 500 },
    { cx: 222, cy: 78,  s: 1.1, d: 100 },
    { cx: 202, cy: 58,  s: 0.8, d: 300 },
    { cx: 242, cy: 68,  s: 0.9, d: 200 },
    { cx: 262, cy: 92,  s: 0.7, d: 400 },
];

export const HeartTree = ({ delay = 0 }: HeartTreeProps) => {
    const [stage, setStage] = useState(0);
    const [activeMsg, setActiveMsg] = useState<string | null>(null);
    const [scales, setScales] = useState<number[]>(Array(12).fill(0));
    const rafRefs = useRef<number[]>([]);
    const { config } = useBirthdayStore();
    const { relationship, gender, photos = [] } = config;
    const { isHindi, isBengali, isFrench } = useTranslation();
    const primaryColor = config.favoriteColor || 'hsl(330, 90%, 75%)';
    const { playPop } = useSoundManager();

    const quotesPool = useMemo(() => {
        if (isFrench) {
            if (relationship === 'partner')
                return FRENCH_SPECIAL_QUOTES.partner[gender as 'male' | 'female'] || FRENCH_SPECIAL_QUOTES.family;
            if (relationship === 'friend')
                return (gender === 'male' ? FRENCH_SPECIAL_QUOTES.friend.legend : FRENCH_SPECIAL_QUOTES.friend.friendly) || FRENCH_SPECIAL_QUOTES.family;
            return FRENCH_SPECIAL_QUOTES.family;
        }
        if (isBengali) {
            if (relationship === 'partner')
                return BENGALI_SPECIAL_QUOTES.partner[gender as 'male' | 'female'] || BENGALI_SPECIAL_QUOTES.family;
            if (relationship === 'friend')
                return (gender === 'male' ? BENGALI_SPECIAL_QUOTES.friend.legend : BENGALI_SPECIAL_QUOTES.friend.friendly) || BENGALI_SPECIAL_QUOTES.family;
            return BENGALI_SPECIAL_QUOTES.family;
        }
        if (isHindi) {
            if (relationship === 'partner')
                return HINDI_SPECIAL_QUOTES.partner[gender as 'male' | 'female'] || HINDI_SPECIAL_QUOTES.family;
            if (relationship === 'friend')
                return (gender === 'male' ? HINDI_SPECIAL_QUOTES.friend.legend : HINDI_SPECIAL_QUOTES.friend.friendly) || HINDI_SPECIAL_QUOTES.family;
            return HINDI_SPECIAL_QUOTES.family;
        }
        if (relationship === 'partner')
            return SPECIAL_QUOTES.partner[gender as 'male' | 'female'] || SPECIAL_QUOTES.family;
        if (relationship === 'friend')
            return (gender === 'male' ? SPECIAL_QUOTES.friend.legend : SPECIAL_QUOTES.friend.friendly) || SPECIAL_QUOTES.family;
        return SPECIAL_QUOTES.family;
    }, [relationship, gender, isHindi, isBengali, isFrench]);
    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), delay),
            setTimeout(() => setStage(2), delay + 1500),
            setTimeout(() => setStage(3), delay + 3000),
            setTimeout(() => setStage(4), delay + 4500),
        ];
        return () => timers.forEach(clearTimeout);
    }, [delay]);

    useEffect(() => {
        if (stage < 3) return;
        const refs = rafRefs.current;
        refs.forEach(cancelAnimationFrame);
        LEAVES.forEach((leaf, i) => {
            const target = leaf.s;
            const startTime = performance.now() + leaf.d;
            const dur = 700;
            const tick = (now: number) => {
                if (now < startTime) { refs[i] = requestAnimationFrame(tick); return; }
                const t = Math.min((now - startTime) / dur, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                const overshoot = t < 0.7 ? 0 : Math.sin((t - 0.7) / 0.3 * Math.PI) * 0.12;
                const sc = (ease + overshoot) * target;
                setScales(prev => { const n = [...prev]; n[i] = sc; return n; });
                if (t < 1) refs[i] = requestAnimationFrame(tick);
                else setScales(prev => { const n = [...prev]; n[i] = target; return n; });
            };
            refs[i] = requestAnimationFrame(tick);
        });
        return () => refs.forEach(cancelAnimationFrame);
    }, [stage]);

    const clickHeart = (e: React.MouseEvent<SVGGElement>, i: number) => {
        e.stopPropagation();
        if (stage < 3) return;
        const messages = isFrench ? FRENCH_HEART_MESSAGES : isBengali ? BENGALI_HEART_MESSAGES : isHindi ? HINDI_HEART_MESSAGES : HEART_MESSAGES;
        setActiveMsg(messages[i] ?? quotesPool[i % quotesPool.length]);
        playPop();
        setTimeout(() => setActiveMsg(null), 5000);
    };

    return (
        <div className="relative w-full max-w-[500px] mx-auto mb-20">
            <div style={{
                borderRadius: 20,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.3), 0 32px 80px rgba(0,0,0,0.2)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                padding: "24px 16px 16px",
                position: "relative",
            }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>

                    <div className="absolute inset-0 pointer-events-none rounded-full blur-[100px] transition-opacity"
                        style={{ transitionDuration: '2000ms', background: `radial-gradient(circle at 50% 40%, ${primaryColor}40, transparent 70%)`, opacity: stage === 4 ? 1 : 0 }} />

                    {stage >= 3 && <TreeSparks count={20} color={primaryColor} />}

                    <svg
                        viewBox="0 0 300 300"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", zIndex: 10 }}
                    >
                        <defs>
                            <filter id="hg" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="5" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <linearGradient id="bark" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="hsl(22,35%,18%)" />
                                <stop offset="35%"  stopColor="hsl(22,44%,36%)" />
                                <stop offset="65%"  stopColor="hsl(22,40%,30%)" />
                                <stop offset="100%" stopColor="hsl(22,30%,20%)" />
                            </linearGradient>
                            <linearGradient id="bl" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="hsl(30,55%,58%)" stopOpacity="0" />
                                <stop offset="40%"  stopColor="hsl(30,55%,58%)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="hsl(30,55%,58%)" stopOpacity="0" />
                            </linearGradient>
                            <radialGradient id="hf" cx="35%" cy="28%" r="65%">
                                <stop offset="0%"   stopColor="hsl(350,95%,82%)" />
                                <stop offset="60%"  stopColor="hsl(345,88%,68%)" />
                                <stop offset="100%" stopColor="hsl(340,80%,55%)" />
                            </radialGradient>
                            <radialGradient id="hs" cx="30%" cy="25%" r="50%">
                                <stop offset="0%"   stopColor="white" stopOpacity="0.55" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        <motion.path
                            d="M 138 300 C 136 260 139 220 142 185 C 144 175 147 168 150 165 C 153 168 156 175 158 185 C 161 220 164 260 162 300 Z"
                            fill="url(#bark)"
                            initial={{ scaleY: 0 }} animate={{ scaleY: stage >= 1 ? 1 : 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ transformOrigin: "150px 300px" }}
                        />
                        <motion.path
                            d="M 149 300 C 148 260 149 220 149.5 185 C 149.8 175 150 168 150 165 C 150 168 150.2 175 150.5 185 C 151 220 152 260 151 300 Z"
                            fill="url(#bl)"
                            initial={{ scaleY: 0 }} animate={{ scaleY: stage >= 1 ? 1 : 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ transformOrigin: "150px 300px" }}
                        />

                        {[
                            { d: "M 150 165 C 130 150 105 130 80 102",  w: 13, dl: 0.3 },
                            { d: "M 150 165 C 170 148 195 118 222 80",  w: 13, dl: 0.5 },
                            { d: "M 150 165 C 150 140 150 108 150 52",  w: 11, dl: 0.4 },
                        ].map((b, i) => (
                            <g key={`mb-${i}`}>
                                <motion.path d={b.d} fill="none" stroke="url(#bark)" strokeWidth={b.w} strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 1 ? 1 : 0 }}
                                    transition={{ duration: 1.3, delay: b.dl }} />
                                <motion.path d={b.d} fill="none" stroke="url(#bl)" strokeWidth={b.w * 0.3} strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 1 ? 1 : 0 }}
                                    transition={{ duration: 1.3, delay: b.dl + 0.06 }} />
                            </g>
                        ))}

                        {[
                            { d: "M 112 140 C 90 122 68 116 56 120",    w: 7, dl: 1.4 },
                            { d: "M 90  110 C 70  88  50  78  38  80",  w: 6, dl: 1.5 },
                            { d: "M 188 128 C 210 112 232 112 248 118", w: 7, dl: 1.4 },
                            { d: "M 208  92 C 228  70  246  56 262  52", w: 6, dl: 1.5 },
                            { d: "M 150  98 C 134  76  116  56 108  40", w: 6, dl: 1.6 },
                            { d: "M 150  78 C 164  58  176  44 190  32", w: 5, dl: 1.7 },
                        ].map((b, i) => (
                            <g key={`sb-${i}`}>
                                <motion.path d={b.d} fill="none" stroke="url(#bark)" strokeWidth={b.w} strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 2 ? 1 : 0 }}
                                    transition={{ duration: 1.0, delay: b.dl }} />
                                <motion.path d={b.d} fill="none" stroke="url(#bl)" strokeWidth={b.w * 0.3} strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 2 ? 1 : 0 }}
                                    transition={{ duration: 1.0, delay: b.dl + 0.06 }} />
                            </g>
                        ))}

                        {LEAVES.map((leaf, i) => {
                            const sc = scales[i];
                            const hasPhoto = photos.length > 0 && i < photos.length;
                            return (
                                <g
                                    key={`h-${i}`}
                                    transform={`translate(${leaf.cx},${leaf.cy}) scale(${sc})`}
                                    onClick={(e) => clickHeart(e, i)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <circle r="22" fill="transparent" />
                                    {hasPhoto ? (
                                        <g>
                                            <rect x="-14" y="-14" width="28" height="32" fill="white" rx="2" />
                                            <image href={photos[i % photos.length]} x="-12" y="-12" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                                        </g>
                                    ) : (
                                        <g>
                                            <path d={HEART} fill="url(#hf)" filter="url(#hg)" />
                                            <path d={HEART} fill="url(#hs)" style={{ pointerEvents: "none" }} />
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    <AnimatePresence>
                        {activeMsg && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                                style={{ position: "absolute", left: "50%", top: "8%", transform: "translateX(-50%)", zIndex: 50, width: "min(300px, 90%)", pointerEvents: "none" }}
                            >
                                <div style={{
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(24px)",
                                    WebkitBackdropFilter: "blur(24px)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: 24,
                                    padding: "16px 20px",
                                    textAlign: "center",
                                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                }}>
                                    <p style={{ color: "white", fontSize: 14, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                                        "{activeMsg}"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
