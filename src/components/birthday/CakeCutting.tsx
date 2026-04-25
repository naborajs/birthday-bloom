import { useState, useEffect, useCallback, useMemo, CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Cake as CakeIcon, Flame, Heart, Sparkles } from "lucide-react";
import { useConfetti } from "./Confetti";
import { useSoundManager } from "./SoundManager";
import { KineticText } from "./KineticText";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { motion, AnimatePresence } from "framer-motion";

type Phase =
  | "select"
  | "blow-intro"
  | "blowing"
  | "wish"
  | "knife-enter"
  | "cutting"
  | "burst"
  | "quotes";

/* ── Cake designs ── */
const CAKE_OPTIONS = [
  {
    id: "chocolate",
    name: "Chocolate Dream",
    layers: ["hsl(15,60%,30%)", "hsl(15,50%,40%)", "hsl(20,40%,50%)"],
    frosting: "hsl(30,70%,70%)",
    accent: "hsl(45,100%,60%)",
    emoji: "🍫",
    image: "/assets/birthday/cake-maroon.png",
  },
  {
    id: "strawberry",
    name: "Strawberry Bliss",
    layers: ["hsl(340,60%,55%)", "hsl(330,55%,65%)", "hsl(340,50%,75%)"],
    frosting: "hsl(350,80%,88%)",
    accent: "hsl(0,80%,60%)",
    emoji: "🍓",
    image: "/assets/birthday/cake-pink.png",
  },
  {
    id: "royal",
    name: "Royal Velvet",
    layers: ["hsl(270,50%,35%)", "hsl(280,45%,50%)", "hsl(290,40%,60%)"],
    frosting: "hsl(45,100%,75%)",
    accent: "hsl(45,100%,60%)",
    emoji: "👑",
    image: "/assets/birthday/birthday-gold.png",
  },
  {
    id: "nature",
    name: "Floral Garden",
    layers: ["hsl(120,40%,30%)", "hsl(100,30%,40%)", "hsl(140,40%,50%)"],
    frosting: "hsl(80,50%,80%)",
    accent: "hsl(330,85%,65%)",
    emoji: "🌸",
    image: "/assets/birthday/cake-green.png",
  },
];

type CakeOption = (typeof CAKE_OPTIONS)[number];

const CutSparks = ({ count, color }: { count: number; color: string }) => {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        distance: 60 + Math.random() * 100,
        size: 4 + Math.random() * 6,
        duration: 0.8 + Math.random() * 0.4,
        hue: i % 2 === 0 ? color : "45",
      })),
    [count, color]
  );
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ 
            x: Math.cos((s.angle * Math.PI) / 180) * s.distance, 
            y: Math.sin((s.angle * Math.PI) / 180) * s.distance,
            opacity: 0,
            scale: 0,
            rotate: s.angle * 2
          }}
          transition={{ duration: s.duration, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: `hsl(${s.hue}, 100%, 70%)`,
            boxShadow: `0 0 15px hsl(${s.hue}, 100%, 70%), 0 0 30px white`,
          }}
        />
      ))}
    </div>
  );
};

const MagicDust = ({ count }: { count: number }) => {
  const dust = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  })), [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {dust.map(d => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            x: d.x,
            y: d.y,
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }}
          className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full blur-[1px]"
          style={{ width: d.size, height: d.size }}
        />
      ))}
    </div>
  );
};

const CakeSVG = ({ cake, split, candlesLit, name }: { cake: CakeOption; split: boolean; candlesLit: boolean; name: string }) => (
  <motion.div 
    animate={{ rotateX: split ? 25 : 8, rotateY: split ? 5 : 0, scale: split ? 1.15 : 1 }}
    transition={{ type: "spring", stiffness: 80, damping: 12 }}
    className="relative preserve-3d"
    style={{ perspective: "1500px" }}
  >
    <svg viewBox="0 0 200 200" className="w-64 sm:w-80 md:w-[32rem] mx-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
      <defs>
        <filter id="cakeDepth">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feOffset in="blur" dx="0" dy="6" result="offsetBlur" />
          <feComponentTransfer in="offsetBlur" result="opacity">
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="opacity" operator="over" />
        </filter>
        <filter id="candleGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="black" stopOpacity="0.3" />
          <stop offset="30%" stopColor="white" stopOpacity="0.2" />
          <stop offset="50%" stopColor="white" stopOpacity="0.4" />
          <stop offset="70%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="black" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="topFrosting" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </radialGradient>
        <filter id="frostingTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite operator="in" in2="SourceGraphic" />
          <feBlend mode="multiply" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="188" rx="95" ry="12" fill="black" opacity="0.4" filter="blur(12px)" />

      {/* Bottom Layer (Splittable) */}
      <g style={{ transform: split ? "translateX(-40px) rotate(-12deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M15,140 L15,175 Q57.5,185 100,180 L100,140 Q57.5,130 15,140 Z" fill={cake.layers[0]} filter="url(#cakeDepth)" />
        <path d="M15,140 L15,175 Q57.5,185 100,180 L100,140 Q57.5,130 15,140 Z" fill="url(#layerGrad)" />
        <path d="M15,140 Q57.5,150 100,140 Q57.5,130 15,140 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
        {/* Drip Effect */}
        <path d="M30,145 Q35,160 40,145" fill={cake.frosting} opacity="0.8" />
        <path d="M60,142 Q65,155 70,142" fill={cake.frosting} opacity="0.8" />
      </g>
      <g style={{ transform: split ? "translateX(40px) rotate(12deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M100,180 Q142.5,185 185,175 L185,140 Q142.5,130 100,140 L100,180 Z" fill={cake.layers[0]} filter="url(#cakeDepth)" />
        <path d="M100,180 Q142.5,185 185,175 L185,140 Q142.5,130 100,140 L100,180 Z" fill="url(#layerGrad)" />
        <path d="M100,140 Q142.5,150 185,140 Q142.5,130 100,140 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
        {/* Drip Effect */}
        <path d="M120,145 Q125,160 130,145" fill={cake.frosting} opacity="0.8" />
        <path d="M150,142 Q155,155 160,142" fill={cake.frosting} opacity="0.8" />
      </g>

      {/* Middle Layer (Splittable) */}
      <g style={{ transform: split ? "translateX(-25px) rotate(-8deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M30,95 L30,130 Q65,140 100,135 L100,95 Q65,85 30,95 Z" fill={cake.layers[1]} filter="url(#cakeDepth)" />
        <path d="M30,95 L30,130 Q65,140 100,135 L100,95 Q65,85 30,95 Z" fill="url(#layerGrad)" />
        <path d="M30,95 Q65,105 100,95 Q65,85 30,95 Z" fill={cake.frosting} filter="url(#frostingTexture)" opacity="0.9" />
        {/* Drip Effect */}
        <path d="M45,100 Q50,115 55,100" fill={cake.frosting} opacity="0.8" />
      </g>
      <g style={{ transform: split ? "translateX(25px) rotate(8deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M100,135 Q135,140 170,130 L170,95 Q135,85 100,95 L100,135 Z" fill={cake.layers[1]} filter="url(#cakeDepth)" />
        <path d="M100,135 Q135,140 170,130 L170,95 Q135,85 100,95 L100,135 Z" fill="url(#layerGrad)" />
        <path d="M100,95 Q135,105 170,95 Q135,85 100,95 Z" fill={cake.frosting} filter="url(#frostingTexture)" opacity="0.9" />
        {/* Drip Effect */}
        <path d="M130,100 Q135,115 140,100" fill={cake.frosting} opacity="0.8" />
      </g>

      {/* Top Layer (Splittable) */}
      <g style={{ transform: split ? "translateX(-15px) rotate(-5deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M45,50 L45,85 Q72.5,95 100,90 L100,50 Q72.5,40 45,50 Z" fill={cake.layers[2]} filter="url(#cakeDepth)" />
        <path d="M45,50 L45,85 Q72.5,95 100,90 L100,50 Q72.5,40 45,50 Z" fill="url(#layerGrad)" />
        <path d="M45,50 Q72.5,60 100,50 Q72.5,40 45,50 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
        <path d="M45,50 Q72.5,60 100,50 Q72.5,40 45,50 Z" fill="url(#topFrosting)" />
        {/* Drip Effect */}
        <path d="M60,55 Q65,70 70,55" fill={cake.frosting} opacity="0.8" />
      </g>
      <g style={{ transform: split ? "translateX(15px) rotate(5deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <path d="M100,90 Q127.5,95 155,85 L155,50 Q127.5,40 100,50 L100,90 Z" fill={cake.layers[2]} filter="url(#cakeDepth)" />
        <path d="M100,90 Q127.5,95 155,85 L155,50 Q127.5,40 100,50 L100,90 Z" fill="url(#layerGrad)" />
        <path d="M100,50 Q127.5,60 155,50 Q127.5,40 100,50 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
        <path d="M100,50 Q127.5,60 155,50 Q127.5,40 100,50 Z" fill="url(#topFrosting)" />
        {/* Drip Effect */}
        <path d="M130,55 Q135,70 140,55" fill={cake.frosting} opacity="0.8" />
      </g>

      {/* Candles (Precisely Centered) */}
      {[68, 84, 100, 116, 132].map((cx, i) => (
        <g key={i} style={{ transform: split ? (cx < 100 ? "translateX(-15px) rotate(-5deg)" : cx > 100 ? "translateX(15px) rotate(5deg)" : "scale(0.8) translateY(10px)") : "none", transition: "all 1s ease" }}>
          <rect x={cx - 1.5} y="15" width="3" height="35" rx="1.5" fill={`hsl(${i * 50 + 180}, 80%, 70%)`} />
          {candlesLit ? (
            <g className="animate-flame-premium" filter="url(#candleGlow)">
              <ellipse cx={cx} cy="5" rx="6" ry="12" fill={cake.accent} style={{ filter: "blur(1px)" }} />
              <ellipse cx={cx} cy="6" rx="2.5" ry="7" fill="white" />
              <circle cx={cx} cy="5" r="20" fill={cake.accent} opacity="0.2" className="animate-pulse" />
            </g>
          ) : (
            <motion.circle 
              initial={{ y: 0, opacity: 0.6, scale: 1 }}
              animate={{ y: -80, opacity: 0, scale: 3 }}
              transition={{ duration: 3, ease: "easeOut" }}
              cx={cx} cy="15" r="3" fill="white" 
            />
          )}
        </g>
      ))}

      {/* Name Plaque (Gold Chocolate Style) */}
      <g style={{ transform: split ? "translateY(40px) opacity(0)" : "none", transition: "all 0.8s ease" }}>
        <rect x="55" y="62" width="90" height="22" rx="11" fill="#4a3011" stroke="#d4af37" strokeWidth="1.5" />
        <text 
          x="100" y="77" 
          textAnchor="middle" 
          fill="#d4af37" 
          className="font-display font-black uppercase" 
          style={{ fontSize: '9px', textShadow: '0 1px 2px rgba(0,0,0,0.8)', letterSpacing: '2px' }}
        >
          {name}
        </text>
      </g>
      {/* Cutting Line Effect */}
      {split && (
        <rect x="98" y="20" width="4" height="160" fill="white" opacity="0.9"
          style={{ animation: "golden-reveal 1s ease-out both", filter: "blur(3px)" }} />
      )}
    </svg>
  </motion.div>
);

const KnifeSVG = ({ phase }: { phase: Phase }) => (
  <motion.div 
    initial={{ y: -300, opacity: 0, rotate: -45 }}
    animate={{ 
      y: phase === "knife-enter" ? 0 : phase === "cutting" ? 50 : 0, 
      opacity: 1, 
      rotate: phase === "cutting" ? 0 : -20,
      scale: phase === "cutting" ? 1.2 : 1
    }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="absolute left-1/2 -translate-x-1/2 z-40"
  >
    <svg viewBox="0 0 40 150" className="w-12 sm:w-16 md:w-20 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(0,0%,80%)" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="hsl(0,0%,70%)" />
        </linearGradient>
      </defs>
      <rect x="15" y="0" width="10" height="50" rx="4" fill="hsl(30, 40%, 20%)" />
      <polygon points="10,48 30,48 28,140 12,140" fill="url(#bladeGrad)" />
      <rect x="18" y="55" width="4" height="70" fill="white" opacity="0.3" className="animate-pulse" />
    </svg>
  </motion.div>
);

const CakeCard = ({ cake, index, onSelect }: { cake: CakeOption; index: number; onSelect: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -10, rotateZ: 2 }}
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
      <img
        src={cake.image}
        alt={cake.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
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

export const CakeCutting = () => {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedCake, setSelectedCake] = useState<CakeOption | null>(null);
  const [candlesLit, setCandlesLit] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(-1);
  const { fireCannon } = useConfetti();
  const { playBoom, playReveal, playPop, playWhoosh } = useSoundManager();
  
  const { name, relationship, gender } = useBirthdayStore(state => state.config);

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
    
    // Portal Fix: No need for scrollIntoView here as overlay is portaled
  }, [playPop]);

  const handleBlow = useCallback(() => {
    if (phase !== "blow-intro") return;
    setPhase("blowing");
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
    playWhoosh();
    setCandlesLit(false);

    setTimeout(() => setPhase("wish"), 1500);
    setTimeout(() => { playReveal(); setPhase("knife-enter"); }, 4500);
    setTimeout(() => { playBoom(); setPhase("cutting"); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200); }, 6000);
    setTimeout(() => { fireCannon(); setPhase("burst"); playReveal(); }, 7000);
    setTimeout(() => { setPhase("quotes"); setQuoteIndex(0); }, 8500);
  }, [phase, fireCannon, playBoom, playReveal, playWhoosh]);

  useEffect(() => {
    if (phase !== "select") {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [phase]);

  useEffect(() => {
    if (phase !== "quotes" || quoteIndex < 0 || quoteIndex >= quotes.length) return;
    const t = setTimeout(() => {
      if (quoteIndex < quotes.length - 1) setQuoteIndex((i) => i + 1);
    }, 4000);
    return () => clearTimeout(t);
  }, [phase, quoteIndex, quotes.length]);

  const cake = selectedCake || CAKE_OPTIONS[0];

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
              <MagicDust count={40} />
              
              <div className="relative w-full max-w-4xl px-4 flex flex-col items-center">

                {(phase === "blow-intro" || phase === "blowing") && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    className="flex flex-col items-center gap-12"
                  >
                    <h2 className="font-display text-3xl sm:text-4xl text-white font-black text-center tracking-tighter animate-glow-pulse">
                      ✨ MAKE A WISH & BLOW ✨
                    </h2>
                    <CakeSVG cake={cake} split={false} candlesLit={candlesLit} name={name} />
                    {phase === "blow-intro" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
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

                {phase === "wish" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-12"
                  >
                    <div className="relative">
                      <CakeSVG cake={cake} split={false} candlesLit={false} name={name} />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-white/10 blur-3xl" 
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="font-display text-4xl sm:text-6xl font-black bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
                        WISH SENT TO THE STARS
                      </h2>
                      <p className="text-white/60 text-xl mt-4 font-light italic">Wait for the magical cut...</p>
                    </div>
                  </motion.div>
                )}

                {(phase === "knife-enter" || phase === "cutting" || phase === "burst") && (
                  <div className="relative flex flex-col items-center">
                    <KnifeSVG phase={phase} />
                    {phase === "cutting" && <CutSparks count={30} color={cake.accent} />}
                    <CakeSVG cake={cake} split={phase === "burst"} candlesLit={false} name={name} />
                    {phase === "burst" && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 4, opacity: 1 }}
                        className="absolute inset-0 bg-white/40 rounded-full blur-[100px] pointer-events-none" 
                      />
                    )}
                  </div>
                )}

                {phase === "quotes" && (
                  <div className="flex flex-col items-center gap-12 w-full">
                    <CakeSVG cake={cake} split={true} candlesLit={false} name={name} />
                    <div className="text-center min-h-[150px] w-full max-w-2xl">
                      <AnimatePresence mode="wait">
                        {quoteIndex >= 0 && (
                          <motion.div
                            key={quoteIndex}
                            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center justify-center h-full"
                          >
                            <p className={`text-3xl sm:text-4xl md:text-6xl font-display font-black leading-tight ${quoteIndex === quotes.length - 1
                              ? "bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_0_30px_var(--color-primary)]"
                              : "text-white"
                              } `}>
                              <KineticText text={quotes[quoteIndex].text} animation={quotes[quoteIndex].animation} delay={100} />
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

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

      <div id="cake-section" className="relative z-20 py-16 sm:py-32 px-4">
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
