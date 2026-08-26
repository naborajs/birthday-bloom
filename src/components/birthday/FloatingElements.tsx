import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { getTemplateEmojiKit } from '@/config/emojiKits';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

interface FloatingItem {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    element: string;
    depth: number;
    isHeart?: boolean;
}

export const FloatingElements = () => {
    const [items, setItems] = useState<FloatingItem[]>([]);
    const config = useBirthdayStore((state) => state.config);
    const { relationship, gender, favoriteColor } = config;
    const emojiKit = useMemo(() => getTemplateEmojiKit(config), [config]);
    const { scrollY } = useScroll();
    const primaryColor = favoriteColor || '#FF2A6D';

    useEffect(() => {
        const particleSpeed = relationship === 'partner' ? 1.4 :
            relationship === 'friend' ? 0.6 : 1;
        
        const count = relationship === 'partner' ? 16 : 12;
        const newItems: FloatingItem[] = Array.from({ length: count }, (_, i) => {
            const isPartner = relationship === 'partner';
            const element = emojiKit.floating[Math.floor(Math.random() * emojiKit.floating.length)] || (isPartner ? '💖' : '✨');
            return {
                id: i,
                x: (i * (100 / count)) + (Math.random() * 8 - 4),
                y: Math.random() * 95,
                size: isPartner ? 1.2 + Math.random() * 1.6 : 0.9 + Math.random() * 1.5,
                duration: (20 + Math.random() * 25) * particleSpeed,
                delay: Math.random() * -20,
                element,
                depth: 1 + Math.random() * 1.5,
                isHeart: isPartner && (element === '💖' || element === '💕' || element === '💞' || element === '💝'),
            };
        });
        setItems(newItems);
    }, [emojiKit.floating, relationship, gender]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ambient Bokeh Aura */}
            <div className="absolute inset-0 opacity-[0.1]">
                <div
                    className="absolute top-1/4 -left-20 w-[32rem] h-[32rem] rounded-full blur-[130px] animate-bg-shift"
                    style={{ background: relationship === 'partner' ? primaryColor : 'var(--color-primary, #FF6B6B)', backgroundSize: '200% 200%' }}
                />
                <div
                    className="absolute bottom-1/4 -right-20 w-[32rem] h-[32rem] rounded-full blur-[130px] animate-bg-shift"
                    style={{ background: relationship === 'partner' ? '#FF69B4' : 'var(--color-secondary, #4ECDC4)', backgroundSize: '200% 200%', animationDelay: '-10s' }}
                />
            </div>

            {/* Romantic SVG Background Hearts for Partner */}
            {relationship === 'partner' && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={`bg-heart-${i}`}
                            className="absolute"
                            style={{
                                left: `${12 + i * 16}%`,
                                top: `${15 + (i % 3) * 28}%`,
                            }}
                            animate={{
                                y: [0, -25, 0],
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 8 + i * 2,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: "easeInOut",
                            }}
                        >
                            <svg width={28 + (i % 3) * 12} height={28 + (i % 3) * 12} viewBox="0 0 24 24" fill={primaryColor}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Parallax Floating Emojis */}
            {items.map((item) => (
                <ParallaxItem key={item.id} item={item} scrollY={scrollY} isPartner={relationship === 'partner'} />
            ))}
        </div>
    );
};

const ParallaxItem = ({
    item,
    scrollY,
    isPartner,
}: {
    item: FloatingItem;
    scrollY: MotionValue<number>;
    isPartner: boolean;
}) => {
    const y = useTransform(scrollY, [0, 2000], [0, -item.depth * 250]);
    const baseOpacity = isPartner ? 0.35 / item.depth : 0.22 / item.depth;

    return (
        <motion.div
            style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}rem`,
                opacity: baseOpacity,
                filter: `blur(${Math.max(0, item.depth - 1.4)}px)`,
                y,
            }}
            initial={{ y: 0 }}
            animate={{
                x: [0, 18, -12, 0],
                y: [0, -22, 0],
                rotate: [0, 12, -12, 0],
            }}
            transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
            }}
            className={`absolute select-none pointer-events-none ${
                item.isHeart ? 'drop-shadow-[0_0_12px_rgba(255,42,109,0.5)]' : ''
            }`}
        >
            {item.element}
        </motion.div>
    );
};
