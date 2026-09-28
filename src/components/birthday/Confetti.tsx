import { useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

export const useConfetti = () => {
    const reducedMotionStore = useBirthdayStore((state) => state.config.reducedMotion);
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isReducedMotion = Boolean(reducedMotionStore || prefersReducedMotion);
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    const fireConfetti = useCallback((options?: confetti.Options) => {
        confetti({
            particleCount: isReducedMotion ? 15 : isMobile ? 30 : 100,
            spread: isMobile ? 55 : 70,
            origin: { y: 0.6 },
            scalar: isMobile ? 0.8 : 1,
            ticks: isReducedMotion ? 50 : isMobile ? 80 : undefined,
            disableForReducedMotion: isReducedMotion,
            colors: ["#e84393", "#a855f7", "#f59e0b", "#38bdf8", "#f97316", "#34d399"],
            ...options,
        });
    }, [isMobile, isReducedMotion]);
    const fireCannon = useCallback(() => {
        if (isReducedMotion) return;
        const end = Date.now() + (isMobile ? 1200 : 2000);
        const minInterval = isMobile ? 80 : 45;
        let lastFire = 0;
        const fire = () => {
            const now = Date.now();
            if (now - lastFire >= minInterval) {
                lastFire = now;
                confetti({
                    particleCount: isMobile ? 2 : 3,
                    angle: 60,
                    spread: isMobile ? 40 : 55,
                    origin: { x: 0 },
                    colors: ["#e84393", "#a855f7", "#f59e0b"],
                    scalar: isMobile ? 0.8 : 1,
                    disableForReducedMotion: isReducedMotion,
                });
                confetti({
                    particleCount: isMobile ? 2 : 3,
                    angle: 120,
                    spread: isMobile ? 40 : 55,
                    origin: { x: 1 },
                    colors: ["#38bdf8", "#f97316", "#34d399"],
                    scalar: isMobile ? 0.8 : 1,
                    disableForReducedMotion: isReducedMotion,
                });
            }
            if (now < end)
                requestAnimationFrame(fire);
        };
        fire();
    }, [isMobile, isReducedMotion]);
    const fireStars = useCallback(() => {
        confetti({
            particleCount: isReducedMotion ? 10 : isMobile ? 24 : 50,
            spread: 360,
            ticks: isMobile ? 80 : 100,
            origin: { x: 0.5, y: 0.5 },
            shapes: ["star"],
            colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
            scalar: isMobile ? 1 : 1.5,
            disableForReducedMotion: isReducedMotion,
        });
    }, [isMobile, isReducedMotion]);
    const firePop = useCallback(() => {
        confetti({
            particleCount: isReducedMotion ? 10 : isMobile ? 18 : 40,
            spread: isMobile ? 50 : 70,
            startVelocity: isMobile ? 25 : 35,
            origin: { y: 0.7 },
            scalar: isMobile ? 0.8 : 1,
            ticks: isMobile ? 80 : 120,
            disableForReducedMotion: isReducedMotion,
            colors: ["#e84393", "#a855f7", "#f59e0b", "#38bdf8", "#f97316", "#34d399"],
        });
    }, [isMobile, isReducedMotion]);
    const fireCinematicCelebration = useCallback(() => {
        if (isReducedMotion) {
            confetti({
                particleCount: 25,
                spread: 70,
                origin: { x: 0.5, y: 0.5 },
                colors: ["#e84393", "#a855f7", "#f59e0b", "#38bdf8"],
                disableForReducedMotion: true,
            });
            return;
        }
        confetti({
            particleCount: isMobile ? 60 : 125,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.85 },
            colors: ["#e84393", "#a855f7", "#ff007f", "#d63031"],
            scalar: isMobile ? 0.85 : 1.15,
            disableForReducedMotion: isReducedMotion,
        });
        confetti({
            particleCount: isMobile ? 60 : 125,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.85 },
            colors: ["#38bdf8", "#0984e3", "#00cec9", "#2ecc71"],
            scalar: isMobile ? 0.85 : 1.15,
            disableForReducedMotion: isReducedMotion,
        });
        setTimeout(() => {
            confetti({
                particleCount: isMobile ? 35 : 75,
                spread: 360,
                origin: { x: 0.5, y: 0.4 },
                shapes: ["star"],
                colors: ["#f59e0b", "#fbbf24", "#fcd34d", "#ffffff"],
                scalar: isMobile ? 1.05 : 1.45,
                gravity: 0.5,
                drift: 0,
                disableForReducedMotion: isReducedMotion,
            });
            confetti({
                particleCount: isMobile ? 50 : 110,
                spread: 360,
                origin: { x: 0.5, y: 0.4 },
                colors: ["#e84393", "#a855f7", "#f59e0b", "#38bdf8", "#ff7675", "#55efc4"],
                scalar: isMobile ? 0.75 : 0.95,
                gravity: 0.7,
                ticks: 120,
                disableForReducedMotion: isReducedMotion,
            });
        }, 250);
        const end = Date.now() + 3200;
        const minInterval = isMobile ? 80 : 45;
        let lastFire = 0;
        const glitterColors = ["#ffd700", "#ffffff", "#ffeaa7", "#ffe3e3"];
        const glitterRain = () => {
            const now = Date.now();
            if (now - lastFire >= minInterval) {
                lastFire = now;
                confetti({
                    particleCount: isMobile ? 1 : 2,
                    angle: 270,
                    spread: 35,
                    origin: { x: Math.random(), y: -0.05 },
                    colors: glitterColors,
                    gravity: 0.35,
                    scalar: isMobile ? 0.5 : 0.65,
                    drift: Math.random() * 0.4 - 0.2,
                    ticks: 100,
                    disableForReducedMotion: isReducedMotion,
                });
            }
            if (now < end) {
                requestAnimationFrame(glitterRain);
            }
        };
        setTimeout(glitterRain, 150);
    }, [isMobile, isReducedMotion]);
    return useMemo(() => ({
        fireConfetti,
        fireCannon,
        fireStars,
        firePop,
        fireCinematicCelebration,
    }), [fireConfetti, fireCannon, fireStars, firePop, fireCinematicCelebration]);
};
