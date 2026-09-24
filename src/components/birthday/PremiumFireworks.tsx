import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
interface PremiumFireworksProps {
    runKey: number;
}
interface Firework {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    trail: Array<{
        x: number;
        y: number;
        alpha: number;
    }>;
}
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    maxLife: number;
    size: number;
    gravity: number;
    drag: number;
}
interface Flash {
    x: number;
    y: number;
    radius: number;
    life: number;
    color: string;
}
const palette = ["#f97316", "#facc15", "#38bdf8", "#fb7185", "#a78bfa", "#34d399", "#ffffff"];
export const PremiumFireworks = ({ runKey }: PremiumFireworksProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const reduceMotion = useReducedMotion();
    const isMobile = useIsMobile();
    useEffect(() => {
        if (!runKey || reduceMotion || typeof window === "undefined")
            return undefined;
        const canvas = canvasRef.current;
        if (!canvas)
            return undefined;
        const context = canvas.getContext("2d", { alpha: true });
        if (!context)
            return undefined;
        let raf = 0;
        let launchTimer = 0;
        let running = true;
        let lastTime = performance.now();
        let launched = 0;
        const maxLaunches = isMobile ? 8 : 14;
        const launchWindow = isMobile ? 2500 : 3300;
        const totalDuration = launchWindow + 2300;
        const startTime = performance.now();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const fireworks: Firework[] = [];
        const particles: Particle[] = [];
        const flashes: Flash[] = [];
        const resize = () => {
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const launch = () => {
            if (!running || launched >= maxLaunches)
                return;
            const launchPositions = [0.12, 0.28, 0.5, 0.72, 0.88];
            const x = launchPositions[launched % launchPositions.length] * window.innerWidth + (Math.random() - 0.5) * 48;
            const y = window.innerHeight + 24;
            const targetX = Math.min(window.innerWidth - 40, Math.max(40, x + (Math.random() - 0.5) * window.innerWidth * 0.36));
            const targetY = window.innerHeight * (0.16 + Math.random() * 0.36);
            const speed = isMobile ? 9 : 11;
            const angle = Math.atan2(targetY - y, targetX - x);
            fireworks.push({
                x,
                y,
                targetX,
                targetY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: palette[Math.floor(Math.random() * palette.length)],
                life: 1,
                trail: [],
            });
            launched += 1;
            launchTimer = window.setTimeout(launch, 180 + Math.random() * (isMobile ? 260 : 180));
        };
        const explode = (firework: Firework) => {
            const particleCount = isMobile ? 42 : 72;
            flashes.push({ x: firework.x, y: firework.y, radius: 18, life: 1, color: firework.color });
            for (let i = 0; i < particleCount; i += 1) {
                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.12;
                const speed = 1.8 + Math.random() * (isMobile ? 4 : 6);
                particles.push({
                    x: firework.x,
                    y: firework.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: Math.random() > 0.25 ? firework.color : palette[Math.floor(Math.random() * palette.length)],
                    life: 1,
                    maxLife: 54 + Math.random() * 34,
                    size: 1.2 + Math.random() * 2.4,
                    gravity: 0.035 + Math.random() * 0.025,
                    drag: 0.982 + Math.random() * 0.01,
                });
            }
        };
        const draw = (time: number) => {
            const delta = Math.min(32, time - lastTime) / 16.67;
            lastTime = time;
            context.globalCompositeOperation = "source-over";
            context.fillStyle = "rgba(0, 0, 0, 0.18)";
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            context.globalCompositeOperation = "lighter";
            for (let i = fireworks.length - 1; i >= 0; i -= 1) {
                const firework = fireworks[i];
                firework.trail.push({ x: firework.x, y: firework.y, alpha: 1 });
                if (firework.trail.length > 12)
                    firework.trail.shift();
                firework.x += firework.vx * delta;
                firework.y += firework.vy * delta;
                firework.vy += 0.025 * delta;
                firework.trail.forEach((point, index) => {
                    point.alpha *= 0.9;
                    context.beginPath();
                    context.strokeStyle = `${firework.color}${Math.floor(point.alpha * 180).toString(16).padStart(2, "0")}`;
                    context.lineWidth = Math.max(1, index / 2);
                    context.moveTo(point.x, point.y);
                    context.lineTo(firework.x, firework.y);
                    context.stroke();
                });
                context.beginPath();
                context.fillStyle = firework.color;
                context.arc(firework.x, firework.y, 2.8, 0, Math.PI * 2);
                context.fill();
                // Lightweight luminous aura without software shadowBlur
                context.beginPath();
                context.fillStyle = `${firework.color}40`;
                context.arc(firework.x, firework.y, 5.5, 0, Math.PI * 2);
                context.fill();
                if (firework.y <= firework.targetY || Math.hypot(firework.x - firework.targetX, firework.y - firework.targetY) < 28) {
                    explode(firework);
                    fireworks.splice(i, 1);
                }
            }
            for (let i = particles.length - 1; i >= 0; i -= 1) {
                const particle = particles[i];
                particle.vx *= particle.drag;
                particle.vy = particle.vy * particle.drag + particle.gravity * delta;
                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;
                particle.maxLife -= delta;
                particle.life = Math.max(0, particle.maxLife / 88);
                const particleAlpha = Math.floor(particle.life * 220).toString(16).padStart(2, "0");
                const haloAlpha = Math.floor(particle.life * 50).toString(16).padStart(2, "0");
                const pRadius = particle.size * particle.life;
                // Outer glow halo (GPU-accelerated, zero-software-blur)
                context.beginPath();
                context.fillStyle = `${particle.color}${haloAlpha}`;
                context.arc(particle.x, particle.y, pRadius * 2.2, 0, Math.PI * 2);
                context.fill();
                // Core particle
                context.beginPath();
                context.fillStyle = `${particle.color}${particleAlpha}`;
                context.arc(particle.x, particle.y, pRadius, 0, Math.PI * 2);
                context.fill();
                if (particle.life <= 0 || particle.y > window.innerHeight + 40)
                    particles.splice(i, 1);
            }
            for (let i = flashes.length - 1; i >= 0; i -= 1) {
                const flash = flashes[i];
                const gradient = context.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.radius * 5);
                gradient.addColorStop(0, `rgba(255,255,255,${flash.life * 0.9})`);
                gradient.addColorStop(0.25, `${flash.color}${Math.floor(flash.life * 130).toString(16).padStart(2, "0")}`);
                gradient.addColorStop(1, "rgba(255,255,255,0)");
                context.fillStyle = gradient;
                context.beginPath();
                context.arc(flash.x, flash.y, flash.radius * 5, 0, Math.PI * 2);
                context.fill();
                flash.radius += 6 * delta;
                flash.life -= 0.055 * delta;
                if (flash.life <= 0)
                    flashes.splice(i, 1);
            }
            const elapsed = time - startTime;
            if (elapsed > totalDuration && fireworks.length === 0 && particles.length === 0 && flashes.length === 0) {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                running = false;
                return;
            }
            raf = window.requestAnimationFrame(draw);
        };
        resize();
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        launch();
        raf = window.requestAnimationFrame(draw);
        window.addEventListener("resize", resize);
        return () => {
            running = false;
            window.clearTimeout(launchTimer);
            window.cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            fireworks.length = 0;
            particles.length = 0;
            flashes.length = 0;
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        };
    }, [isMobile, reduceMotion, runKey]);
    return (<canvas ref={canvasRef} className="fixed inset-0 z-[95] pointer-events-none mix-blend-screen" aria-hidden="true"/>);
};
