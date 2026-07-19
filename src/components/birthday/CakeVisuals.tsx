import { useMemo } from "react";
import { motion } from "framer-motion";
import { CakeOption } from "./CakeTypes";

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

export const CakeSVG = ({ cake, split, candlesLit, name, springConfig }: {
    cake: CakeOption;
    split: boolean;
    candlesLit: boolean;
    name: string;
    springConfig?: any;
}) => {
    // Note: Kept the component name "CakeSVG" to avoid breaking CakeCutting.tsx 
    // but this is now a static DOM composite for the pre-rendered image approach.

    return (
        <motion.div 
            className="relative w-72 sm:w-96 md:w-[32rem] aspect-square mx-auto flex items-center justify-center"
            style={{ perspective: "1500px" }}
        >
            {/* The pre-rendered photorealistic cake layer */}
            <img 
                src={cake.image} 
                alt={cake.name} 
                className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            />
            
            {/* Overlay a simple candle for the static proof-of-concept */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="relative">
                    <div className="w-2.5 h-16 rounded-sm bg-gradient-to-b from-white to-[#ffb6c1] border border-white/50 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.2)]" />
                    
                    {candlesLit ? (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-flame-premium">
                            <div className="w-5 h-12 bg-yellow-400 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] blur-[1px] opacity-90 shadow-[0_0_30px_#facc15]" />
                            <div className="w-2 h-6 bg-white absolute bottom-1 rounded-full blur-[1px]" />
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0.8, y: 0 }} 
                            animate={{ opacity: 0, y: -30 }} 
                            transition={{ duration: 2 }}
                            className="absolute -top-4 left-1/2 w-px h-10 bg-gradient-to-t from-gray-400 to-transparent blur-[1px]"
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
};
