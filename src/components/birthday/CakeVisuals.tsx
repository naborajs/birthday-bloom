import { useMemo } from "react";
import { motion } from "framer-motion";

export const CutSparks = ({ count, color }: { count: number; color: string }) => {
    const sparks = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        distance: 80 + Math.random() * 120,
        size: 5 + Math.random() * 8,
        duration: 0.6 + Math.random() * 0.5,
        hue: i % 2 === 0 ? color : "45",
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
                    className="absolute left-1/2 top-1/2 rounded-full" 
                    style={{
                        width: s.size,
                        height: s.size,
                        background: s.hue.startsWith('hsl') ? s.hue : `hsl(${s.hue}, 100%, 70%)`,
                        boxShadow: `0 0 20px ${s.hue.startsWith('hsl') ? s.hue : `hsl(${s.hue}, 100%, 70%)`}, 0 0 40px white`,
                    }}
                />
            ))}
        </div>
    );
};

export const MagicDust = ({ count }: { count: number }) => {
    const dust = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        size: Math.random() * 4 + 1.5,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 2
    })), [count]);
    
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {dust.map(d => (
                <motion.div 
                    key={d.id} 
                    initial={{ opacity: 0, x: 0, y: 0 }} 
                    animate={{
                        opacity: [0, 0.9, 0],
                        x: d.x,
                        y: d.y - 100,
                        scale: [0, 1.8, 0]
                    }} 
                    transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }} 
                    className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full blur-[1px]" 
                    style={{ width: d.size, height: d.size, boxShadow: "0 0 10px white" }}
                />
            ))}
        </div>
    );
};
