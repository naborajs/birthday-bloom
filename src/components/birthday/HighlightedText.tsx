import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

export interface HighlightedTextProps {
    text: string;
    relationship?: string;
    className?: string;
    animate?: boolean;
    typewriter?: boolean;
    speed?: number;
    delay?: number;
    cursor?: boolean;
    onComplete?: () => void;
    onType?: () => void;
}

interface GraphemeSegmenter {
    segment(input: string): Iterable<{ segment: string }>;
}

interface IntlWithSegmenter {
    Segmenter: new (locales?: string | string[], options?: { granularity: "grapheme" | "word" | "sentence" }) => GraphemeSegmenter;
}

const splitGraphemes = (str: string): string[] => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new (Intl as unknown as IntlWithSegmenter).Segmenter(undefined, { granularity: "grapheme" });
        return Array.from(segmenter.segment(str), (s) => s.segment);
    }
    const match = str.match(/[\s\S][\u0300-\u036f\u0900-\u097f\u0980-\u09ff]*/g);
    return match || Array.from(str);
};

interface ParsedSegment {
    raw: string;
    isHighlight: boolean;
    graphemes: string[];
    startIndex: number;
    endIndex: number;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
    text,
    relationship = "partner",
    className = "",
    animate = true,
    typewriter = false,
    speed = 40,
    delay = 100,
    cursor = true,
    onComplete,
    onType,
}) => {
    const [charCount, setCharCount] = useState(typewriter ? 0 : 999999);
    const [started, setStarted] = useState(!typewriter);
    const [isFinished, setIsFinished] = useState(!typewriter);
    const onTypeRef = useRef(onType);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onTypeRef.current = onType;
        onCompleteRef.current = onComplete;
    });

    // Parse segments with start/end indices for typewriter slicing
    const { segments, totalGraphemes } = useMemo(() => {
        const rawTokens = text.split(/(\*[^*]+\*)/g);
        let currentIndex = 0;
        const parsed: ParsedSegment[] = [];

        for (const token of rawTokens) {
            if (!token) continue;
            const isHighlight = token.startsWith("*") && token.endsWith("*");
            const clean = isHighlight ? token.slice(1, -1) : token;
            const graphemes = splitGraphemes(clean);
            const startIndex = currentIndex;
            currentIndex += graphemes.length;

            parsed.push({
                raw: clean,
                isHighlight,
                graphemes,
                startIndex,
                endIndex: currentIndex,
            });
        }

        return { segments: parsed, totalGraphemes: currentIndex };
    }, [text]);

    // Typewriter timing orchestrator
    useEffect(() => {
        if (!typewriter) {
            setCharCount(999999);
            setStarted(true);
            setIsFinished(true);
            return;
        }

        setCharCount(0);
        setIsFinished(false);
        setStarted(false);

        const startTimer = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [text, typewriter, delay]);

    useEffect(() => {
        if (!typewriter || !started || isFinished) return;

        if (charCount < totalGraphemes) {
            const stepTimer = setTimeout(() => {
                setCharCount((prev) => {
                    const next = prev + 1;
                    onTypeRef.current?.();
                    return next;
                });
            }, speed);

            return () => clearTimeout(stepTimer);
        } else {
            setIsFinished(true);
            onCompleteRef.current?.();
        }
    }, [typewriter, started, charCount, totalGraphemes, speed, isFinished]);

    if (typewriter && !started) {
        return (
            <span className={`inline-block leading-relaxed ${className}`}>
                {cursor && (
                    <span className="inline-block w-[3px] h-[0.9em] ml-1 bg-primary animate-blink align-middle shadow-[0_0_8px_var(--color-primary)]" />
                )}
            </span>
        );
    }

    return (
        <span className={`inline-block leading-relaxed ${className}`}>
            {segments.map((segment, idx) => {
                if (typewriter && charCount <= segment.startIndex) {
                    return null;
                }

                const visibleGraphemes = typewriter
                    ? segment.graphemes.slice(0, Math.max(0, charCount - segment.startIndex))
                    : segment.graphemes;

                const displayedText = visibleGraphemes.join("");

                if (segment.isHighlight) {
                    if (relationship === "partner") {
                        return (
                            <motion.span
                                key={idx}
                                initial={animate && !typewriter ? { scale: 0.85, opacity: 0, y: 8 } : false}
                                animate={animate && !typewriter ? { scale: 1, opacity: 1, y: 0 } : false}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic text-gradient-romantic text-glow-rose inline-block px-1.5 mx-0.5 animate-subtle-float select-none"
                            >
                                {displayedText}
                            </motion.span>
                        );
                    }

                    if (relationship === "friend") {
                        return (
                            <motion.span
                                key={idx}
                                initial={animate && !typewriter ? { scale: 0.85, opacity: 0, y: 8 } : false}
                                animate={animate && !typewriter ? { scale: 1, opacity: 1, y: 0 } : false}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                                className="font-modern text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-gradient-gold inline-block px-1.5 mx-0.5 tracking-wider select-none"
                            >
                                {displayedText}
                            </motion.span>
                        );
                    }

                    return (
                        <motion.span
                            key={idx}
                            initial={animate && !typewriter ? { scale: 0.85, opacity: 0, y: 8 } : false}
                            animate={animate && !typewriter ? { scale: 1, opacity: 1, y: 0 } : false}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                            className="font-royal text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-gold inline-block px-1.5 mx-0.5 select-none"
                        >
                            {displayedText}
                        </motion.span>
                    );
                }

                return (
                    <span key={idx} className="font-display font-light text-white/90">
                        {displayedText}
                    </span>
                );
            })}

            {typewriter && cursor && !isFinished && (
                <span className="inline-block w-[3px] h-[0.9em] ml-1 bg-primary animate-blink align-middle shadow-[0_0_8px_var(--color-primary)]" />
            )}
        </span>
    );
};
