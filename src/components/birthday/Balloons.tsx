import { useState, useEffect, useMemo } from "react";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

interface Balloon {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
}

export const Balloons = ({ count = 20 }: { count?: number }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const { config } = useBirthdayStore();
  const { relationship } = config;

  const colors = useMemo(() => {
    if (relationship === 'partner') return ["hsl(340, 85%, 60%)", "hsl(320, 70%, 50%)", "hsl(0, 80%, 55%)", "hsl(45, 100%, 70%)"];
    if (relationship === 'friend') return ["hsl(200, 90%, 60%)", "hsl(160, 80%, 50%)", "hsl(270, 70%, 65%)", "hsl(330, 90%, 60%)"];
    return ["hsl(30, 90%, 65%)", "hsl(45, 100%, 60%)", "hsl(20, 80%, 70%)", "hsl(200, 70%, 75%)"];
  }, [relationship]);

  useEffect(() => {
    setBalloons(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        size: 40 + Math.random() * 30,
        rotate: Math.random() * 20 - 10,
      }))
    );
  }, [count, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ perspective: "1000px" }}>
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-150px] animate-balloon-rise"
          style={{
            left: `${b.x}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            transform: `rotate(${b.rotate}deg)`,
          }}
        >
          <svg width={b.size} height={b.size * 1.6} viewBox="0 0 50 80" className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
            <defs>
              <radialGradient id={`grad-${b.id}`} cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor={b.color} stopOpacity="0.7" />
              </radialGradient>
            </defs>
            <ellipse cx="25" cy="25" rx="22" ry="25" fill={`url(#grad-${b.id})`} />
            <ellipse cx="25" cy="25" rx="22" ry="25" fill={b.color} opacity="0.3" />
            
            {/* Highlight */}
            <ellipse cx="18" cy="18" rx="5" ry="7" fill="white" opacity="0.2" />
            
            {/* Knot */}
            <polygon points="22,48 25,54 28,48" fill={b.color} opacity="0.8" />
            
            {/* String */}
            <path 
              d="M25,54 Q20,65 25,80" 
              stroke="rgba(255,255,255,0.2)" 
              fill="none" 
              strokeWidth="1.5" 
              className="animate-pulse"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
