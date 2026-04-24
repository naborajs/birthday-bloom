import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

interface HeartTreeProps {
    delay?: number; 
}

const TreeSparks = ({ count, color }: { count: number; color: string }) => {
    const sparks = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                size: 3 + Math.random() * 5,
                left: 10 + Math.random() * 80,
                bottom: 10 + Math.random() * 80,
                duration: 3 + Math.random() * 4,
                delay: Math.random() * 5,
            })),
        [count]
    );
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {sparks.map((s) => (
                <motion.div
                    key={s.id}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -100, opacity: [0, 0.7, 0] }}
                    transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
                    className="absolute rounded-full"
                    style={{
                        width: s.size,
                        height: s.size,
                        left: `${s.left}%`,
                        bottom: `${s.bottom}%`,
                        background: color,
                        boxShadow: `0 0 15px ${color}`,
                    }}
                />
            ))}
        </div>
    );
};

export const HeartTree = ({ delay = 1000 }: HeartTreeProps) => {
    const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
    const { config } = useBirthdayStore();
    const primaryColor = config.favoriteColor || 'hsl(330, 90%, 75%)';

    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), delay);
        const t2 = setTimeout(() => setStage(2), delay + 1500);
        const t3 = setTimeout(() => setStage(3), delay + 3000);
        const t4 = setTimeout(() => setStage(4), delay + 4500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [delay]);

    const branchesStage1 = [
        { path: "M 150 180 Q 100 130 80 100", length: 140 },
        { path: "M 150 160 Q 200 110 220 80", length: 150 },
        { path: "M 150 150 Q 150 100 150 50", length: 110 },
    ];

    const branchesStage2 = [
        { path: "M 115 145 Q 80 110 60 120", length: 60 },
        { path: "M 90 110 Q 60 70 40 80", length: 70 },
        { path: "M 185 130 Q 230 110 250 120", length: 70 },
        { path: "M 205 95 Q 240 60 260 50", length: 80 },
        { path: "M 150 100 Q 120 70 110 40", length: 80 },
        { path: "M 150 80 Q 180 50 190 30", length: 90 },
    ];

    const heartLeaves = [
        { cx: 150, cy: 50, scale: 1.2, delay: 0 },
        { cx: 130, cy: 30, scale: 0.9, delay: 0.2 },
        { cx: 170, cy: 35, scale: 0.9, delay: 0.1 },
        { cx: 150, cy: 20, scale: 0.7, delay: 0.3 },
        { cx: 80, cy: 100, scale: 1.1, delay: 0.2 },
        { cx: 60, cy: 80, scale: 0.8, delay: 0.4 },
        { cx: 100, cy: 80, scale: 0.8, delay: 0.3 },
        { cx: 40, cy: 110, scale: 0.6, delay: 0.5 },
        { cx: 220, cy: 80, scale: 1.1, delay: 0.1 },
        { cx: 200, cy: 60, scale: 0.8, delay: 0.3 },
        { cx: 240, cy: 70, scale: 0.9, delay: 0.2 },
        { cx: 260, cy: 90, scale: 0.7, delay: 0.4 },
    ];

    const heartPath = "M0,-5 Q-5,-10 -10,-5 Q-15,0 -5,10 L0,15 L5,10 Q15,0 10,-5 Q5,-10 0,-5 Z";

    return (
        <div className="relative w-full max-w-[500px] aspect-square mx-auto overflow-hidden px-4 mb-20" style={{ perspective: "1000px" }}>
            <motion.div
                animate={{ rotateX: stage === 4 ? 20 : 0 }}
                className="relative w-full h-full preserve-3d"
            >
                <div
                    className={`absolute inset-0 transition-opacity duration-2000 pointer-events-none rounded-full blur-[100px]`}
                    style={{
                        background: `radial-gradient(circle at 50% 40%, ${primaryColor}40, transparent 70%)`,
                        opacity: stage === 4 ? 1 : 0
                    }}
                />

                {stage >= 3 && <TreeSparks count={25} color={primaryColor} />}

                <svg viewBox="0 0 300 300" className="w-full h-full relative z-10 overflow-visible drop-shadow-2xl">
                    <defs>
                        <filter id="treeGlow">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Trunk */}
                    <motion.path
                        d="M 150 300 Q 145 200 150 150 Q 155 200 150 300 Z"
                        fill="hsl(20, 30%, 30%)"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: stage >= 1 ? 1 : 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ originY: "bottom" }}
                    />

                    {/* Main Branches */}
                    {branchesStage1.map((b, i) => (
                        <motion.path
                            key={`b1-${i}`}
                            d={b.path}
                            fill="none"
                            stroke="hsl(20, 25%, 35%)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: stage >= 1 ? 1 : 0 }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                        />
                    ))}

                    {/* Sub Branches */}
                    {branchesStage2.map((b, i) => (
                        <motion.path
                            key={`b2-${i}`}
                            d={b.path}
                            fill="none"
                            stroke="hsl(20, 20%, 40%)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: stage >= 2 ? 1 : 0 }}
                            transition={{ duration: 1.2, delay: 1.5 + i * 0.1 }}
                        />
                    ))}

                    {/* Leaves */}
                    {heartLeaves.map((leaf, i) => (
                        <motion.g
                            key={`leaf-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: stage >= 3 ? leaf.scale : 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 3 + leaf.delay }}
                            style={{ transform: `translate(${leaf.cx}px, ${leaf.cy}px)` }}
                        >
                            <path
                                d={heartPath}
                                fill={primaryColor}
                                filter={stage === 4 ? "url(#treeGlow)" : ""}
                                style={{
                                    animation: stage === 4 ? `pulse-scale 3s ease-in-out infinite alternate` : "none"
                                }}
                            />
                        </motion.g>
                    ))}
                </svg>
            </motion.div>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent z-20" />
        </div>
    );
};
