import { motion } from 'framer-motion';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useStoryVariants } from '../animations/dynamicVariants';

export const SpecialMessage = () => {
  const { customMessage, name, relationship } = useBirthdayStore(state => state.config);
  const variants = useStoryVariants();
  const words = customMessage ? customMessage.split(' ') : ['Wishing', 'you', 'the', 'best', 'day', 'ever!'];

  // Adaptive typography based on relationship
  const typographyClass = 
    relationship === 'partner' ? 'font-serif tracking-widest text-white/90' :
    relationship === 'friend' ? 'font-sans font-black uppercase text-white tracking-tight' :
    'font-sans font-medium text-white/80';

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10"
      variants={variants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className={`text-4xl md:text-6xl mb-12 ${typographyClass}`}
        style={{ textShadow: 'var(--glow-effect)' }}
        variants={variants.item}
      >
        For {name || 'You'},
      </motion.h2>

      <div className="flex flex-wrap justify-center max-w-4xl gap-x-4 gap-y-3">
        {words.map((word, index) => (
          <motion.span 
            key={index} 
            className={`text-3xl md:text-5xl ${typographyClass}`}
            variants={variants.item}
            style={{ 
              color: index % 3 === 0 ? 'var(--color-primary)' : 'inherit',
              textShadow: index % 3 === 0 ? 'var(--glow-effect)' : 'none'
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
