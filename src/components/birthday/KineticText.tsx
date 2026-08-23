import React, { useState, useEffect, useMemo } from "react";
type AnimationType = "zoom-in" | "pop-out" | "stagger-up" | "float" | "wave" | "typewriter-burst";
interface KineticTextProps {
    text: string;
    animation: AnimationType;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
    onComplete?: () => void;
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

export const KineticText = ({ text, animation, className = "", style, delay = 0, onComplete }: KineticTextProps) => {
    const [started, setStarted] = useState(false);

    const wordTokens = useMemo(() => {
        const words = text.split(/(\s+)/);
        let globalIndex = 0;
        return words.map((word) => {
            const isSpace = /^\s+$/.test(word);
            if (isSpace) {
                const idx = globalIndex;
                globalIndex += 1;
                return { isSpace: true, text: word, index: idx, items: [] as { char: string; index: number }[] };
            }
            const graphemes = splitGraphemes(word);
            const items = graphemes.map((g) => ({
                char: g,
                index: globalIndex++,
            }));
            return { isSpace: false, text: word, index: globalIndex, items };
        });
    }, [text]);

    const totalCount = useMemo(() => {
        return splitGraphemes(text).length;
    }, [text]);

    useEffect(() => {
        if (started)
            return;
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay, started]);

    useEffect(() => {
        if (!started)
            return;
        const dur = totalCount * 80 + 800;
        const t = setTimeout(() => { onComplete?.(); }, dur);
        return () => clearTimeout(t);
    }, [started, totalCount, onComplete]);

    if (!started)
        return <span className={className} style={{ ...style, opacity: 0 }}>{text}</span>;

    const getCharStyle = (i: number): React.CSSProperties => {
        const charDelay = `${i * 60}ms`;
        switch (animation) {
            case "zoom-in":
                return {
                    display: "inline-block",
                    animation: `kinetic-zoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${charDelay} both`,
                };
            case "pop-out":
                return {
                    display: "inline-block",
                    animation: `kinetic-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) ${charDelay} both`,
                };
            case "stagger-up":
                return {
                    display: "inline-block",
                    animation: `kinetic-stagger-up 0.7s ease-out ${charDelay} both`,
                };
            case "float":
                return {
                    display: "inline-block",
                    animation: `kinetic-float 0.8s ease-out ${charDelay} both, kinetic-float-idle 3s ease-in-out ${parseFloat(charDelay) / 1000 + 0.8}s infinite alternate`,
                };
            case "wave":
                return {
                    display: "inline-block",
                    animation: `kinetic-wave 0.6s ease-out ${charDelay} both`,
                };
            case "typewriter-burst":
                return {
                    display: "inline-block",
                    animation: `kinetic-burst 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${charDelay} both`,
                };
            default:
                return { display: "inline-block" };
        }
    };

    return (<span className={`${className} inline-flex flex-wrap justify-center`} style={style} aria-label={text}>
      {wordTokens.map((token, wIdx) => {
            if (token.isSpace) {
                return (<span key={`space-${wIdx}`} style={getCharStyle(token.index)}>
              {"\u00A0"}
            </span>);
            }
            return (<span key={`word-${wIdx}`} className="inline-flex whitespace-nowrap">
            {token.items.map((item) => (<span key={`char-${item.index}`} style={getCharStyle(item.index)}>
                {item.char}
              </span>))}
          </span>);
        })}
    </span>);
};

