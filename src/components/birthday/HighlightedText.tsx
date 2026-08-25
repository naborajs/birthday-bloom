import React from "react";
import { motion } from "framer-motion";

interface HighlightedTextProps {
    text: string;
    relationship?: string;
    className?: string;
    animate?: boolean;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
    text,
    relationship = "partner",
    className = "",
    animate = true,
}) => {
    // Regex splits on `*highlighted text*` tokens
    const parts = text.split(/(\*[^*]+\*)/g);

    return (
        <span className={`inline-block leading-relaxed ${className}`}>
            {parts.map((part, idx) => {
                if (part.startsWith("*") && part.endsWith("*")) {
                    const cleanText = part.slice(1, -1);

                    if (relationship === "partner") {
                        return (
                            <motion.span
                                key={idx}
                                initial={animate ? { scale: 0.85, opacity: 0, y: 8 } : false}
                                animate={animate ? { scale: 1, opacity: 1, y: 0 } : false}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-gradient-romantic text-glow-rose inline-block px-1.5 mx-0.5 animate-subtle-float select-none"
                            >
                                {cleanText}
                            </motion.span>
                        );
                    }

                    if (relationship === "friend") {
                        return (
                            <motion.span
                                key={idx}
                                initial={animate ? { scale: 0.85, opacity: 0, y: 8 } : false}
                                animate={animate ? { scale: 1, opacity: 1, y: 0 } : false}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                className="font-modern text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-gradient-gold inline-block px-1.5 mx-0.5 tracking-wider select-none"
                            >
                                {cleanText}
                            </motion.span>
                        );
                    }

                    return (
                        <motion.span
                            key={idx}
                            initial={animate ? { scale: 0.85, opacity: 0, y: 8 } : false}
                            animate={animate ? { scale: 1, opacity: 1, y: 0 } : false}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                            className="font-royal text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold inline-block px-1.5 mx-0.5 select-none"
                        >
                            {cleanText}
                        </motion.span>
                    );
                }

                if (!part) return null;

                return (
                    <span key={idx} className="font-display font-light text-white/90">
                        {part}
                    </span>
                );
            })}
        </span>
    );
};
