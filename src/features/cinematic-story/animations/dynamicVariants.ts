import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

export const useStoryVariants = () => {
  const pacing = useBirthdayStore(state => state.getAnimationPacing());

  // Dynamic spring physics based on relationship
  const springConfig = 
    pacing === 'fast' ? { type: "spring", stiffness: 400, damping: 15 } : // Bouncy, fun
    pacing === 'slow' ? { type: "spring", stiffness: 50, damping: 20 } :  // Smooth, emotional
    { type: "spring", stiffness: 100, damping: 20 };                      // Standard

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
