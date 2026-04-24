import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  rotation: number;
}

export const ParticleBurst = ({ trigger }: { trigger: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      const speed = 8 + Math.random() * 8;
      return {
        id: Date.now() + i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 4 + Math.random() * 8,
        color: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"][
          Math.floor(Math.random() * 5)
        ],
        rotation: Math.random() * 360,
      };
    });

    setParticles(newParticles);

    const animationFrames: number[] = [];
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // gravity
            life: p.life - 0.02,
            vx: p.vx * 0.98,
          }))
          .filter((p) => p.life > 0)
      );

      if (particles.length > 0) {
        animationFrames.push(requestAnimationFrame(animate));
      }
    };

    animationFrames.push(requestAnimationFrame(animate));

    return () => animationFrames.forEach(cancelAnimationFrame);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            rotate: particle.rotation,
          }}
          initial={{ scale: 1, filter: "blur(0px)" }}
          animate={{ scale: 0.3, filter: "blur(2px)" }}
          transition={{ duration: 2 }}
        />
      ))}
    </div>
  );
};
