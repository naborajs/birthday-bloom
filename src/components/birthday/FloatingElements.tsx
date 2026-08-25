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
}

export const FloatingElements = () => {
    const [items, setItems] = useState<FloatingItem[]>([]);
    const config = useBirthdayStore((state) => state.config);
    const relationship = config.relationship;
    const emojiKit = useMemo(() => getTemplateEmojiKit(config), [config]);
    const { scrollY } = useScroll();

    useEffect(() => {
        const particleSpeed = relationship === 'partner' ? 1.5 :
            relationship === 'friend' ? 0.5 : 1;
        // Reduced from 30 to 12 items for better performance
        const newItems = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 0.8 + Math.random() * 1.8,
            duration: (25 + Math.random() * 35) * particleSpeed,
            delay: Math.random() * -20,
            element: emojiKit.floating[Math.floor(Math.random() * emojiKit.floating.length)],
            depth: 1 + Math.random() * 2,
        }));
        setItems(newItems);
    }, [emojiKit.floating, relationship]);

    return (<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle ambient glow — using CSS instead of heavy animated blurred divs */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-1/4 -left-20 w-[30rem] h-[30rem] rounded-full bg-primary blur-[120px] animate-bg-shift" style={{ backgroundSize: '200% 200%' }}/>
        <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] rounded-full bg-secondary blur-[120px] animate-bg-shift" style={{ backgroundSize: '200% 200%', animationDelay: '-10s' }}/>
      </div>

      {items.map((item) => (<ParallaxItem key={item.id} item={item} scrollY={scrollY}/>))}
    </div>);
};

const ParallaxItem = ({ item, scrollY }: {
    item: FloatingItem;
    scrollY: MotionValue<number>;
}) => {
    const y = useTransform(scrollY, [0, 2000], [0, -item.depth * 300]);
    return (<motion.div style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            opacity: 0.12 / item.depth,
            filter: `blur(${item.depth - 1}px)`,
            y,
        }} initial={{ y: 0 }} animate={{
            x: [0, 20, 0],
            rotate: [0, 15, -15, 0],
        }} transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
        }} className="absolute">
      {item.element}
    </motion.div>);
};
