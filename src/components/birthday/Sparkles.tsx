import { useEffect, useState } from "react";
interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
}
interface Orb {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
}
const orbColors = [
    "hsla(45, 100%, 70%, 0.25)",
    "hsla(330, 85%, 65%, 0.25)",
    "hsla(200, 80%, 65%, 0.25)",
    "hsla(270, 60%, 60%, 0.25)",
];
export const Sparkles = ({ count = 20 }: {
    count?: number;
}) => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const [orbs, setOrbs] = useState<Orb[]>([]);
    useEffect(() => {
        setSparkles(Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 4 + Math.random() * 8,
            delay: Math.random() * 3,
        })));
        setOrbs(Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 20 + Math.random() * 50,
            delay: Math.random() * 8,
            duration: 10 + Math.random() * 15,
            color: orbColors[i % orbColors.length],
        })));
    }, [count]);
    return (<div className="fixed inset-0 pointer-events-none z-5">
      
      {sparkles.map((s) => (<div key={s.id} className="absolute" style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                animation: `sparkle 2s ease-in-out ${s.delay}s infinite`,
            }}>
          <svg viewBox="0 0 20 20" fill="hsl(45, 100%, 70%)">
            <polygon points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8"/>
          </svg>
        </div>))}
      
      {orbs.map((o) => (<div key={`orb-${o.id}`} className="absolute rounded-full" style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                width: o.size,
                height: o.size,
                background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                animation: `drift ${o.duration}s ease-in-out ${o.delay}s infinite alternate`,
            }}/>))}
    </div>);
};
