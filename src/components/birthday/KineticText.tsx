import { useState, useEffect, useMemo } from "react";
type AnimationType = "zoom-in" | "pop-out" | "stagger-up" | "float" | "wave" | "typewriter-burst";
interface KineticTextProps {
    text: string;
    animation: AnimationType;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
    onComplete?: () => void;
}
export const KineticText = ({ text, animation, className = "", style, delay = 0, onComplete }: KineticTextProps) => {
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (started)
            return;
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay, started]);
    useEffect(() => {
        if (!started)
            return;
        const dur = text.length * 80 + 800;
        const t = setTimeout(() => { onComplete?.(); }, dur);
        return () => clearTimeout(t);
    }, [started, text, onComplete]);
    const chars = useMemo(() => text.split(""), [text]);
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
      {chars.map((char, i) => (<span key={i} style={getCharStyle(i)}>
          {char === " " ? "\u00A0" : char}
        </span>))}
    </span>);
};
