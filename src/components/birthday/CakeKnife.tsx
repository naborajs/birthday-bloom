import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phase } from "./CakeTypes";

export const CakeKnife = ({ phase }: { phase: Phase }) => {
    const isMobile = useIsMobile();
    
    // Smooth cinematic curve for the slice
    const sliceTransition = { 
        type: "spring" as const, 
        stiffness: isMobile ? 120 : 200, 
        damping: isMobile ? 18 : 20 
    };

    return (
        <motion.div 
            initial={{ y: -300, opacity: 0, rotate: -45 }} 
            animate={{
                y: phase === "knife-enter" ? -50 : phase === "cutting" ? 50 : -300,
                opacity: phase === "knife-enter" || phase === "cutting" ? 1 : 0,
                rotate: phase === "cutting" ? 0 : -20,
                scale: phase === "cutting" ? 1.2 : 1
            }} 
            transition={sliceTransition} 
            className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
            <svg viewBox="0 0 40 150" className="w-12 sm:w-16 md:w-20 drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]">
                <defs>
                    <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(0,0%,85%)" />
                        <stop offset="30%" stopColor="white" />
                        <stop offset="100%" stopColor="hsl(0,0%,60%)" />
                    </linearGradient>
                    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(30, 40%, 15%)" />
                        <stop offset="50%" stopColor="hsl(30, 40%, 30%)" />
                        <stop offset="100%" stopColor="hsl(30, 40%, 10%)" />
                    </linearGradient>
                    <filter id="knifeGlow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        <feFlood floodColor="white" floodOpacity="0.5" />
                        <feComposite in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Handle */}
                <rect x="14" y="0" width="12" height="55" rx="5" fill="url(#handleGrad)" stroke="hsl(30,40%,10%)" strokeWidth="1" />
                
                {/* Handle Details */}
                <circle cx="20" cy="15" r="2" fill="hsl(45,100%,70%)" opacity="0.8" />
                <circle cx="20" cy="30" r="2" fill="hsl(45,100%,70%)" opacity="0.8" />
                <circle cx="20" cy="45" r="2" fill="hsl(45,100%,70%)" opacity="0.8" />
                
                {/* Guard */}
                <rect x="10" y="52" width="20" height="6" rx="2" fill="hsl(45,100%,60%)" filter="url(#knifeGlow)" />
                
                {/* Blade */}
                <polygon points="12,58 28,58 26,145 15,145" fill="url(#bladeGrad)" />
                <path d="M15,145 L26,145 L20,150 Z" fill="hsl(0,0%,70%)" />
                
                {/* Edge Shine */}
                <rect x="15" y="60" width="3" height="80" fill="white" opacity="0.7" className="animate-pulse" />
            </svg>
        </motion.div>
    );
};
