import { useEffect, useState, useRef, useCallback } from "react";
import { Snowflake, Heart, Sparkles, Star } from "lucide-react";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

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

const HeartSVG = ({ stage, glowing }: { stage: number; glowing: boolean }) => {
  const segments = [
    "M100,30 C100,10 75,0 50,20",
    "M100,30 C100,10 125,0 150,20",
    "M150,20 C175,45 160,75 100,120",
    "M50,20 C25,45 40,75 100,120",
  ];
  const visiblePaths = segments.slice(0, stage);

  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" style={{ filter: glowing ? "drop-shadow(0 0 30px hsl(330, 85%, 60%)) drop-shadow(0 0 60px hsl(330, 85%, 50%))" : "drop-shadow(0 0 10px hsl(330, 85%, 60%, 0.3))" }}>
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(330, 85%, 65%)" />
          <stop offset="50%" stopColor="hsl(350, 80%, 60%)" />
          <stop offset="100%" stopColor="hsl(330, 85%, 55%)" />
        </linearGradient>
      </defs>
      {stage === 4 && (
        <path d={FullHeartPath} fill="url(#heartGrad)" className="animate-heart-fill" />
      )}
      {visiblePaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="url(#heartGrad)" strokeWidth={stage === 4 ? "4" : "3"} strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ strokeDasharray: 200, strokeDashoffset: 0, animation: `heart-draw 1.5s ease-out ${i * 0.3}s both` }} />
      ))}
      {glowing && <circle cx="100" cy="65" r="50" fill="hsl(330,85%,60%)" opacity="0.15" className="animate-pulse" />}
    </svg>
  );
};

/* ── Lingering trail particles ── */
const TrailCanvas = ({ particles }: { particles: TrailParticle[] }) => {
  const now = Date.now();
  const LIFETIME = 2200;
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {particles.map((p) => {
        const age = now - p.born;
        const progress = Math.min(age / LIFETIME, 1);
        const opacity = 1 - progress;
        const scale = 1 + progress * 0.6;
        if (opacity <= 0) return null;
        return (
          <div key={p.id} className="absolute rounded-full" style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            background: p.color,
            opacity: opacity * 0.7,
            transform: `translate(-50%, -50%) scale(${scale})`,
            boxShadow: `0 0 ${6 + p.size}px ${p.color}, 0 0 ${12 + p.size * 2}px ${p.color}`,
          }} />
        );
      })}
    </div>
  );
};

/* ── Stage 4: Four-corner merge animation ── */
const FourCornerMerge = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<"fly-in" | "merging" | "merged" | "pop" | "text">("fly-in");
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const particleIdRef = useRef(0);
  const rafRef = useRef<number>(0);
  const { name } = useBirthdayStore(state => state.config);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("merging"), 100);
    const t2 = setTimeout(() => setPhase("merged"), 1800);
    const t3 = setTimeout(() => setPhase("pop"), 3200);
    const t4 = setTimeout(() => setPhase("text"), 4000);
    const t5 = setTimeout(() => onDone(), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onDone]);

  const corners = [
    { id: "tl", start: { x: "-60vw", y: "-60vh", rotate: -45 }, color: "hsl(330, 85%, 65%)" },
    { id: "tr", start: { x: "60vw", y: "-60vh", rotate: 45 }, color: "hsl(350, 80%, 60%)" },
    { id: "br", start: { x: "60vw", y: "60vh", rotate: 135 }, color: "hsl(330, 85%, 55%)" },
    { id: "bl", start: { x: "-60vw", y: "60vh", rotate: -135 }, color: "hsl(345, 85%, 62%)" },
  ];

  // Spawn trail particles by sampling heart element positions
  const spawnParticles = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newParticles: TrailParticle[] = [];

    heartRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      for (let j = 0; j < 2; j++) {
        newParticles.push({
          id: particleIdRef.current++,
          x: cx + (Math.random() - 0.5) * 16,
          y: cy + (Math.random() - 0.5) * 16,
          color: corners[idx].color,
          size: 3 + Math.random() * 5,
          born: Date.now(),
        });
      }
    });

    setParticles(prev => {
      const now = Date.now();
      const alive = prev.filter(p => now - p.born < 2200);
      return [...alive, ...newParticles].slice(-200);
    });
  }, []);

  // Spawn particles during merging phase via rAF
  useEffect(() => {
    if (phase !== "merging") return;
    let active = true;
    let lastSpawn = 0;
    const loop = (time: number) => {
      if (!active) return;
      if (time - lastSpawn > 50) {
        spawnParticles();
        lastSpawn = time;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { active = false; cancelAnimationFrame(rafRef.current); };
  }, [phase, spawnParticles]);

  // Fade out remaining particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => {
        const alive = prev.filter(p => Date.now() - p.born < 2200);
        if (alive.length === 0) { clearInterval(interval); return []; }
        return alive;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [particles.length > 0]);

  const isMerging = phase === "merging" || phase === "merged" || phase === "pop" || phase === "text";
  const isMerged = phase === "merged" || phase === "pop" || phase === "text";
  const isPopped = phase === "pop" || phase === "text";
  const showText = phase === "text";

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-full overflow-visible" style={{ minHeight: "300px" }}>
      {/* Cinematic Lens Flare / Glow Backdrop */}
      {isMerging && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <div className="w-[150%] h-1 bg-[hsl(330,85%,60%)] blur-[80px] opacity-40 animate-pulse" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-[hsl(330,85%,60%)] blur-[100px] opacity-20 animate-heart-glow-expand" />
        </div>
      )}

      {/* Lingering glow trail */}
      <TrailCanvas particles={particles} />

      {/* Glow backdrop behind merged heart */}
      {isMerged && (
        <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full opacity-40 animate-pulse"
          style={{ background: "radial-gradient(circle, hsl(330,85%,60%), hsl(330,85%,40%), transparent)" }} />
      )}

      {/* Four flying heart pieces with trails */}
      {!isMerged && corners.map((c, idx) => (
        <div key={c.id} ref={el => { heartRefs.current[idx] = el; }} className="absolute" style={{
          transform: isMerging
            ? "translate(0, 0) rotate(0deg) scale(1.2)"
            : `translate(${c.start.x}, ${c.start.y}) rotate(${c.start.rotate}deg) scale(0.5)`,
          transition: "all 2.2s cubic-bezier(0.19, 1, 0.22, 1)",
          zIndex: 10,
        }}>
          {/* Enhanced Trail ghosts */}
          {[0.1, 0.2, 0.3, 0.4].map((delay, i) => (
            <svg key={i} viewBox="0 0 20 18" className="absolute inset-0 w-12 h-12 md:w-16 md:h-16" style={{
              opacity: isMerging ? 0.5 - i * 0.1 : 0,
              filter: `blur(${3 + i * 3}px) drop-shadow(0 0 15px ${c.color})`,
              transition: `all 2s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s`,
              transform: isMerging ? `scale(${1.2 - i * 0.15})` : `scale(0.5)`,
            }}>
              <path d={HeartPath} fill={c.color} />
            </svg>
          ))}
          {/* Main heart piece */}
          <svg viewBox="0 0 20 18" className="relative w-12 h-12 md:w-16 md:h-16" style={{
            filter: `drop-shadow(0 0 20px ${c.color}) drop-shadow(0 0 40px ${c.color}80)`,
          }}>
            <path d={HeartPath} fill={c.color} />
          </svg>
        </div>
      ))}

      {/* Merged full heart with high-end effects */}
      {isMerged && (
        <div className={`relative z-20 transition-all duration-800 ${isPopped ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
          style={{ transition: isPopped ? "all 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045)" : "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: isPopped ? "scale(2.5)" : undefined }}>
          <div className="animate-heart-merge-appear">
            <svg viewBox="0 0 200 140" className="w-32 h-28 md:w-48 md:h-40"
              style={{ filter: "drop-shadow(0 0 40px hsl(330,85%,60%)) drop-shadow(0 0 80px hsl(330,85%,50%))" }}>
              <defs>
                <linearGradient id="mergedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(330, 85%, 70%)" />
                  <stop offset="50%" stopColor="hsl(350, 80%, 65%)" />
                  <stop offset="100%" stopColor="hsl(330, 85%, 60%)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d={FullHeartPath} fill="url(#mergedGrad)" filter="url(#glow)" />
            </svg>
          </div>
        </div>
      )}

      {/* Burst particles on pop */}
      {isPopped && Array.from({ length: 16 }, (_, i) => (
        <div key={i} className="absolute z-30 pointer-events-none"
          style={{ animation: `heart-burst-particle 1.2s ease-out ${i * 0.04}s forwards` }}>
          <svg viewBox="0 0 20 18" style={{
            width: 10 + Math.random() * 14, height: 10 + Math.random() * 14,
            transform: `rotate(${(360 / 16) * i}deg) translateY(-${50 + Math.random() * 40}px)`
          }}>
            <path d={HeartPath} fill={`hsl(${330 + i * 3}, 85%, ${55 + i * 2}%)`} />
          </svg>
        </div>
      ))}

      {/* Personalized Text */}
      {showText && (
        <div className="z-40 mt-2 animate-love-text-reveal text-center px-4">
          <span className="font-display text-xl sm:text-2xl md:text-5xl font-black bg-gradient-to-r from-[hsl(330,85%,65%)] via-[hsl(350,90%,70%)] to-[hsl(330,85%,60%)] bg-clip-text text-transparent animate-glow-pulse whitespace-nowrap leading-normal">
            {`Love You Dear ${name || 'One'}`}
          </span>
        </div>
      )}
    </div>
  );
};

export const HeartProgression = ({ stage, onRevealComplete }: HeartProgressionProps) => {
  if (stage === 4) {
    return (
      <div className="relative flex flex-col items-center justify-center w-full" style={{ minHeight: "200px" }}>
        <FourCornerMerge onDone={() => onRevealComplete?.()} />
      </div>
    );
  }

  const sizeClass = "w-16 h-14 md:w-20 md:h-18";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className={`relative transition-all duration-1000 ${sizeClass}`}>
        <HeartSVG stage={stage} glowing={false} />
      </div>
    </div>
  );
};
