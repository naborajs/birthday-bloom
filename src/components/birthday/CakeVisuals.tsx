import { useMemo } from "react";
import { motion } from "framer-motion";

export const CutSparks = ({ count, color }: { count: number; color: string }) => {
    const sparks = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        distance: 70 + Math.random() * 110,
        size: 3 + Math.random() * 6,
        duration: 0.5 + Math.random() * 0.4,
        hue: i % 2 === 0 ? color : "#ffd700",
    })), [count, color]);

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
                    className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                    style={{
                        width: s.size,
                        height: s.size,
                        background: s.hue.startsWith('hsl') || s.hue.startsWith('#') ? s.hue : `hsl(${s.hue}, 100%, 70%)`,
                        boxShadow: `0 0 12px ${s.hue}, 0 0 24px white`,
                    }}
                />
            ))}
        </div>
    );
};

export const PastryCrumbs = ({ count = 24, color = "#ffb703" }: { count?: number; color?: string }) => {
    const crumbs = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        xDist: (Math.random() - 0.5) * 160,
        yDist: 40 + Math.random() * 90,
        size: 2.5 + Math.random() * 4,
        duration: 0.6 + Math.random() * 0.35,
        rotation: (Math.random() - 0.5) * 360,
    })), [count]);

    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {crumbs.map((c) => (
                <motion.div
                    key={c.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                    animate={{
                        x: c.xDist,
                        y: c.yDist,
                        opacity: 0,
                        scale: 1,
                        rotate: c.rotation
                    }}
                    transition={{ duration: c.duration, ease: "easeIn" }}
                    className="absolute left-1/2 top-1/2 rounded-sm pointer-events-none"
                    style={{
                        width: c.size,
                        height: c.size,
                        backgroundColor: color,
                        boxShadow: `0 0 4px ${color}80`,
                    }}
                />
            ))}
        </div>
    );
};

export const MagicDust = ({ count }: { count: number }) => {
    const dust = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 360 - 180,
        y: Math.random() * 360 - 180,
        size: Math.random() * 3 + 1.2,
        duration: Math.random() * 3.5 + 2,
        delay: Math.random() * 1.5
    })), [count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {dust.map(d => (
                <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 0.85, 0],
                        x: d.x,
                        y: d.y - 80,
                        scale: [0, 1.5, 0]
                    }}
                    transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }}
                    className="absolute left-1/2 top-1/2 bg-white rounded-full pointer-events-none"
                    style={{ width: d.size, height: d.size, boxShadow: "0 0 8px white, 0 0 16px #ffd700" }}
                />
            ))}
        </div>
    );
};
