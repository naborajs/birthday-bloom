import { useEffect, useState, useRef, useMemo } from "react";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useTranslation } from "@/i18n";
interface HeartProgressionProps {
    stage: 1 | 2 | 3 | 4;
    onRevealComplete?: () => void;
}
const HeartPath = "M10,3 C10,1 8,0 6,2 C4,4 5,7 10,11 C15,7 16,4 14,2 C12,0 10,1 10,3 Z";
const FullHeartPath = "M100,30 C100,10 75,0 50,20 C25,45 40,75 100,120 C160,75 175,45 150,20 C125,0 100,10 100,30 Z";
interface TrailParticle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    born: number;
}
const HeartSVG = ({ stage, glowing }: {
    stage: number;
    glowing: boolean;
}) => {
    const segments = [
        "M100,30 C100,10 75,0 50,20",
        "M100,30 C100,10 125,0 150,20",
        "M150,20 C175,45 160,75 100,120",
        "M50,20 C25,45 40,75 100,120",
    ];
    const visiblePaths = segments.slice(0, stage);
    return (<svg viewBox="0 0 200 140" className="w-full h-full" style={{ filter: glowing ? "drop-shadow(0 0 30px hsl(330, 85%, 60%)) drop-shadow(0 0 60px hsl(330, 85%, 50%))" : "drop-shadow(0 0 10px hsl(330, 85%, 60%, 0.3))" }}>
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(330, 85%, 65%)"/>
          <stop offset="50%" stopColor="hsl(350, 80%, 60%)"/>
          <stop offset="100%" stopColor="hsl(330, 85%, 55%)"/>
        </linearGradient>
      </defs>
      {stage === 4 && (<path d={FullHeartPath} fill="url(#heartGrad)" className="animate-heart-fill"/>)}
      {visiblePaths.map((d, i) => (<path key={i} d={d} fill="none" stroke="url(#heartGrad)" strokeWidth={stage === 4 ? "4" : "3"} strokeLinecap="round" className="transition-all duration-1000" style={{ strokeDasharray: 200, strokeDashoffset: 0, animation: `heart-draw 1.5s ease-out ${i * 0.3}s both` }}/>))}
      {glowing && <circle cx="100" cy="65" r="50" fill="hsl(330,85%,60%)" opacity="0.15" className="animate-pulse"/>}
    </svg>);
};
const evalMergeEase = (t: number): number => {
    const clamped = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - clamped, 4);
};

const FourCornerMerge = ({ onDone }: {
    onDone: () => void;
}) => {
    const [phase, setPhase] = useState<"fly-in" | "merging" | "merged" | "pop" | "text">("fly-in");
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    const { name } = useBirthdayStore(state => state.config);
    const { isHindi, isBengali, isFrench } = useTranslation();
    const loveMessage = isFrench
        ? `On t'aime tellement ${name || 'trésor'}`
        : isBengali
            ? `আপনাকে অনেক ভালোবাসি ${name || 'প্রিয়'}`
            : isHindi
                ? `आपसे बहुत प्यार करते हैं ${name || 'प्रिय'}`
                : `Love You Dear ${name || 'One'}`;
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("merging"), 100);
        const t2 = setTimeout(() => setPhase("merged"), 1800);
        const t3 = setTimeout(() => setPhase("pop"), 3200);
        const t4 = setTimeout(() => setPhase("text"), 4000);
        const t5 = setTimeout(() => onDone(), 6500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }, [onDone]);
    const corners = useMemo(() => [
        { id: "tl", start: { x: "-60vw", y: "-60vh", rotate: -45 }, dx: -0.6, dy: -0.6, color: "hsl(330, 85%, 65%)" },
        { id: "tr", start: { x: "60vw", y: "-60vh", rotate: 45 }, dx: 0.6, dy: -0.6, color: "hsl(350, 80%, 60%)" },
        { id: "br", start: { x: "60vw", y: "60vh", rotate: 135 }, dx: 0.6, dy: 0.6, color: "hsl(330, 85%, 55%)" },
        { id: "bl", start: { x: "-60vw", y: "60vh", rotate: -135 }, dx: -0.6, dy: 0.6, color: "hsl(345, 85%, 62%)" },
    ], []);
    const burstParticles = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
        id: i,
        w: 10 + ((i * 7) % 14),
        h: 10 + ((i * 7) % 14),
        dist: 50 + ((i * 11) % 40),
        angle: (360 / 16) * i,
        color: `hsl(${330 + i * 3}, 85%, ${55 + i * 2}%)`,
    })), []);
    const isMerging = phase === "merging" || phase === "merged" || phase === "pop" || phase === "text";
    const isMerged = phase === "merged" || phase === "pop" || phase === "text";
    const isPopped = phase === "pop" || phase === "text";
    const showText = phase === "text";
    useEffect(() => {
        if (!isMerging)
            return undefined;
        if (typeof window === "undefined" || (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)))
            return undefined;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container)
            return undefined;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx)
            return undefined;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || 300;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const particles: TrailParticle[] = [];
        let particleId = 0;
        let active = true;
        let lastSpawn = 0;
        const mergeStart = performance.now();
        const MERGE_DURATION = 2200;
        const LIFETIME = 1600;

        const loop = (now: number) => {
            if (!active)
                return;
            const elapsed = now - mergeStart;
            if (elapsed <= 1800 && now - lastSpawn > 50) {
                lastSpawn = now;
                const progress = evalMergeEase(elapsed / MERGE_DURATION);
                const rem = 1 - progress;
                const cx = width / 2;
                const cy = height / 2;
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                for (let idx = 0; idx < corners.length; idx++) {
                    const c = corners[idx];
                    const hx = cx + c.dx * vw * rem;
                    const hy = cy + c.dy * vh * rem;
                    for (let j = 0; j < 2; j++) {
                        particles.push({
                            id: particleId++,
                            x: hx + (Math.random() - 0.5) * 16,
                            y: hy + (Math.random() - 0.5) * 16,
                            color: c.color,
                            size: 3 + Math.random() * 5,
                            born: now,
                        });
                    }
                }
            }

            ctx.clearRect(0, 0, width, height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                const age = now - p.born;
                if (age >= LIFETIME) {
                    particles[i] = particles[particles.length - 1];
                    particles.pop();
                    continue;
                }
                const progress = age / LIFETIME;
                const alpha = (1 - progress) * 0.7;
                const radius = (p.size * (1 + progress * 0.6)) / 2;
                ctx.globalAlpha = alpha * 0.35;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            if (elapsed <= 1800 || particles.length > 0) {
                rafRef.current = requestAnimationFrame(loop);
            }
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            active = false;
            cancelAnimationFrame(rafRef.current);
            ctx.clearRect(0, 0, width, height);
        };
    }, [isMerging, corners]);
    return (<div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-full overflow-visible" style={{ minHeight: "300px" }}>
      
      {isMerging && (<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <div className="w-[150%] h-24 opacity-40 animate-pulse" style={{ background: "radial-gradient(ellipse at center, hsla(330,85%,60%,0.45) 0%, transparent 70%)" }}/>
          <div className="absolute w-[260px] h-[260px] rounded-full opacity-30 animate-heart-glow-expand" style={{ background: "radial-gradient(circle, hsla(330,85%,60%,0.5) 0%, transparent 70%)" }}/>
        </div>)}

      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[5]" aria-hidden="true"/>

      
      {isMerged && (<div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full opacity-40 animate-pulse" style={{ background: "radial-gradient(circle, hsl(330,85%,60%), hsl(330,85%,40%), transparent)" }}/>)}

      
      {!isMerged && corners.map((c) => (<div key={c.id} className="absolute" style={{
                transform: isMerging
                    ? "translate(0, 0) rotate(0deg) scale(1.2)"
                    : `translate(${c.start.x}, ${c.start.y}) rotate(${c.start.rotate}deg) scale(0.5)`,
                transition: "transform 2.2s cubic-bezier(0.19, 1, 0.22, 1)",
                willChange: "transform",
                zIndex: 10,
            }}>
          
          {[0.08, 0.16].map((delay, i) => (<svg key={i} viewBox="0 0 20 18" className="absolute inset-0 w-12 h-12 md:w-16 md:h-16" style={{
                    opacity: isMerging ? 0.38 - i * 0.14 : 0,
                    transition: `transform 2s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s, opacity 2s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s`,
                    transform: isMerging ? `scale(${1.1 - i * 0.2})` : `scale(0.5)`,
                }}>
              <path d={HeartPath} fill={c.color}/>
            </svg>))}
          
          <svg viewBox="0 0 20 18" className="relative w-12 h-12 md:w-16 md:h-16" style={{
                filter: `drop-shadow(0 0 18px ${c.color})`,
            }}>
            <path d={HeartPath} fill={c.color}/>
          </svg>
        </div>))}

      
      {isMerged && (<div className={`relative z-20 transition-all duration-800 ${isPopped ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} style={{ transition: isPopped ? "transform 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 0.6s ease" : "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease", transform: isPopped ? "scale(2.5)" : undefined }}>
          <div className="animate-heart-merge-appear">
            <svg viewBox="0 0 200 140" className="w-32 h-28 md:w-48 md:h-40" style={{ filter: "drop-shadow(0 0 36px hsl(330,85%,60%))" }}>
              <defs>
                <linearGradient id="mergedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(330, 85%, 70%)"/>
                  <stop offset="50%" stopColor="hsl(350, 80%, 65%)"/>
                  <stop offset="100%" stopColor="hsl(330, 85%, 60%)"/>
                </linearGradient>
              </defs>
              <path d={FullHeartPath} fill="url(#mergedGrad)"/>
            </svg>
          </div>
        </div>)}

      
      {isPopped && burstParticles.map((bp) => (<div key={bp.id} className="absolute z-30 pointer-events-none" style={{ animation: `heart-burst-particle 1.2s ease-out ${bp.id * 0.04}s forwards` }}>
          <svg viewBox="0 0 20 18" style={{
                width: bp.w, height: bp.h,
                transform: `rotate(${bp.angle}deg) translateY(-${bp.dist}px)`
            }}>
            <path d={HeartPath} fill={bp.color}/>
          </svg>
        </div>))}

      
      {showText && (<div className="z-40 mt-2 animate-love-text-reveal text-center px-4 max-w-full">
          <span className="font-display text-xl sm:text-2xl md:text-5xl font-black bg-gradient-to-r from-[hsl(330,85%,65%)] via-[hsl(350,90%,70%)] to-[hsl(330,85%,60%)] bg-clip-text text-transparent animate-glow-pulse break-words leading-normal">
            {loveMessage}
          </span>
        </div>)}
    </div>);
};
export const HeartProgression = ({ stage, onRevealComplete }: HeartProgressionProps) => {
    if (stage === 4) {
        return (<div className="relative flex flex-col items-center justify-center w-full" style={{ minHeight: "200px" }}>
        <FourCornerMerge onDone={() => onRevealComplete?.()}/>
      </div>);
    }
    const sizeClass = "w-16 h-14 md:w-20 md:h-18";
    return (<div className="relative flex flex-col items-center justify-center">
      <div className={`relative transition-all duration-1000 ${sizeClass}`}>
        <HeartSVG stage={stage} glowing={false}/>
      </div>
    </div>);
};
