import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
export const useStoryVariants = () => {
    const pacing = useBirthdayStore(state => state.getAnimationPacing());
    const springConfig = pacing === 'fast' ? { type: "spring" as const, stiffness: 400, damping: 15 } :
        pacing === 'slow' ? { type: "spring" as const, stiffness: 50, damping: 20 } :
            { type: "spring" as const, stiffness: 100, damping: 20 };
    return {
        container: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: pacing === 'slow' ? 0.8 : 0.2,
                    delayChildren: 0.5,
                }
            }
        },
        item: {
            hidden: { y: 40, opacity: 0, filter: "blur(10px)", scale: 0.9 },
            visible: {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                transition: springConfig
            }
        }
    };
};
