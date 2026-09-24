import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getTemplateEmojiKit, pickTemplateEmoji } from "@/config/emojiKits";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";
interface TrailParticle {
    id: number;
    emoji: string;
    x: number;
    y: number;
    size: number;
    drift: number;
    rise: number;
    rotate: number;
    duration: number;
}
const MAX_PARTICLES_DESKTOP = 28;
const MIN_DISTANCE_DESKTOP = 22;
export const EmojiCursorTrail = () => {
    const [particles, setParticles] = useState<TrailParticle[]>([]);
    const config = useBirthdayStore((state) => state.config);
    const kit = useMemo(() => getTemplateEmojiKit(config), [config]);
    const isMobile = useIsMobile();
    const reduceMotion = useReducedMotion();
    const rafRef = useRef<number | null>(null);
    const pointerRef = useRef<{
        x: number;
        y: number;
        type: string;
    } | null>(null);
    const lastEmitRef = useRef<{
        x: number;
        y: number;
        time: number;
    } | null>(null);
    const cleanupTimersRef = useRef<number[]>([]);
    const idRef = useRef(0);
    useEffect(() => {
        if (reduceMotion || isMobile || typeof window === "undefined")
            return undefined;
        const maxParticles = MAX_PARTICLES_DESKTOP;
        const minDistance = MIN_DISTANCE_DESKTOP;
        const minDelay = 45;
        const emitParticle = () => {
            rafRef.current = null;
            const pointer = pointerRef.current;
            if (!pointer)
                return;
            const now = performance.now();
            const last = lastEmitRef.current;
            const distance = last ? Math.hypot(pointer.x - last.x, pointer.y - last.y) : Number.POSITIVE_INFINITY;
            if (last && (distance < minDistance || now - last.time < minDelay))
                return;
            lastEmitRef.current = { x: pointer.x, y: pointer.y, time: now };
            const particle: TrailParticle = {
                id: idRef.current++,
                emoji: pickTemplateEmoji(kit.cursor),
                x: pointer.x,
                y: pointer.y,
                size: 20 + Math.random() * 16,
                drift: (Math.random() - 0.5) * 72,
                rise: 72 + Math.random() * 68,
                rotate: (Math.random() - 0.5) * 110,
                duration: 0.85 + Math.random() * 0.45,
            };
            setParticles((current) => [...current.slice(-(maxParticles - 1)), particle]);
            const timer = window.setTimeout(() => {
                setParticles((current) => current.filter((item) => item.id !== particle.id));
                cleanupTimersRef.current = cleanupTimersRef.current.filter((id) => id !== timer);
            }, particle.duration * 1000 + 120);
            cleanupTimersRef.current.push(timer);
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch")
                return;
            pointerRef.current = { x: event.clientX, y: event.clientY, type: event.pointerType };
            if (rafRef.current === null) {
                rafRef.current = window.requestAnimationFrame(emitParticle);
            }
        };
        const handlePointerLeave = () => {
            pointerRef.current = null;
            lastEmitRef.current = null;
        };
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("blur", handlePointerLeave);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("blur", handlePointerLeave);
            if (rafRef.current !== null)
                window.cancelAnimationFrame(rafRef.current);
            cleanupTimersRef.current.forEach((timer) => window.clearTimeout(timer));
            cleanupTimersRef.current = [];
        };
    }, [isMobile, kit.cursor, reduceMotion]);
    if (reduceMotion || isMobile)
        return null;
    return (<div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (<motion.span key={particle.id} initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0.45,
                rotate: 0,
            }} animate={{
                x: particle.x + particle.drift,
                y: particle.y - particle.rise,
                opacity: [0, 0.95, 0],
                scale: [0.45, 1.08, 0.72],
                rotate: particle.rotate,
            }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: particle.duration, ease: [0.22, 1, 0.36, 1] }} className="absolute left-0 top-0 select-none will-change-transform" style={{
                fontSize: particle.size,
                filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.24))",
                transform: "translate3d(0,0,0)",
            }}>
            {particle.emoji}
          </motion.span>))}
      </AnimatePresence>
    </div>);
};
