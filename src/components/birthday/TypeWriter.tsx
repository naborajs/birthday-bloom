import { useState, useEffect, useMemo } from "react";

interface TypeWriterProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    onComplete?: () => void;
    cursor?: boolean;
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

export const TypeWriter = ({ text, speed = 45, delay = 0, className = "", onComplete, cursor = true, }: TypeWriterProps) => {
    const graphemes = useMemo(() => splitGraphemes(text), [text]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setDone(false);
        setStarted(false);
        const delayTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(delayTimer);
    }, [text, delay]);

    useEffect(() => {
        if (!started)
            return;
        if (currentIndex < graphemes.length) {
            const timer = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        }
        else {
            setDone(true);
            onComplete?.();
        }
    }, [started, currentIndex, graphemes.length, speed, onComplete]);

    if (!started)
        return null;

    const displayed = graphemes.slice(0, currentIndex).join("");

    return (<span className={className}>
      {displayed}
      {cursor && !done && (<span className="inline-block w-[3px] h-[1em] ml-1 bg-primary animate-blink align-middle"/>)}
    </span>);
};

