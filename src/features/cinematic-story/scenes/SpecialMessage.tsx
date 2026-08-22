import { motion } from 'framer-motion';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useStoryVariants } from '../animations/dynamicVariants';
import { useTranslation } from '@/i18n';

export const SpecialMessage = () => {
    const { customMessage, name, relationship, gender } = useBirthdayStore(state => state.config);
    const { isHindi, isBengali } = useTranslation();
    const variants = useStoryVariants();
    const defaultWords = isBengali
        ? ['আপনার', 'জন্য', 'এই', 'দিনটি', 'পৃথিবীর', 'সবচেয়ে', 'সুন্দর', 'ও', 'আনন্দময়', 'হোক!']
        : isHindi
            ? ['आपके', 'लिए', 'यह', 'दिन', 'दुनिया', 'का', 'सबसे', 'खूबसूरत', 'दिन', 'हो!']
            : ['Wishing', 'you', 'the', 'best', 'day', 'ever!'];
    const words = customMessage ? customMessage.split(' ') : defaultWords;
    const isMale = gender === 'male';
    const isFemale = gender === 'female';
    const typographyClass = relationship === 'partner' ? 'font-serif tracking-widest text-white/90 italic' :
        relationship === 'friend' ? 'font-sans font-black uppercase text-white tracking-tight italic' :
            'font-sans font-medium text-white/80';
    const salutation = isBengali
        ? (relationship === 'partner'
            ? (isMale ? 'আমার প্রিয় রাজপুত্রের জন্য,' : isFemale ? 'আমার প্রিয় রাজকন্যার জন্য,' : 'আমার সব কিছুর জন্য,')
            : relationship === 'friend'
                ? (isMale ? 'আমার লেজেন্ড ভাইয়ের জন্য,' : isFemale ? 'আমার প্রিয় বোনের জন্য,' : 'আমার সেরা বন্ধুর জন্য,')
                : `প্রিয় ${name || 'আপনি'},`)
        : isHindi
            ? (relationship === 'partner'
                ? (isMale ? 'मेरे प्यारे राजा के लिए,' : isFemale ? 'मेरी प्यारी रानी के लिए,' : 'मेरे सब कुछ के लिए,')
                : relationship === 'friend'
                    ? (isMale ? 'मेरे लीजेंड भाई के लिए,' : isFemale ? 'मेरी प्यारी बहना के लिए,' : 'मेरी बेस्टी के लिए,')
                    : `प्रिय ${name || 'आप'},`)
            : `For My ${relationship === 'partner' ? (isMale ? 'Handsome King' : isFemale ? 'Beautiful Queen' : 'Everything') : relationship === 'friend' ? (isMale ? 'Legendary Brother' : isFemale ? 'Amazing Sister' : 'Bestie') : (name || 'You')},`;
    return (<motion.div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative z-10" variants={variants.container} initial="hidden" animate="visible">
      <motion.h2 className={`text-4xl md:text-6xl mb-12 ${typographyClass}`} style={{ textShadow: 'var(--glow-effect)' }} variants={variants.item}>
        {salutation}
      </motion.h2>

      <div className="flex flex-wrap justify-center max-w-4xl gap-x-4 gap-y-3">
        {words.map((word, index) => (<motion.span key={index} className={`text-3xl md:text-5xl ${typographyClass}`} variants={variants.item} style={{
                color: index % 3 === 0 ? 'var(--color-primary)' : 'inherit',
                textShadow: index % 3 === 0 ? 'var(--glow-effect)' : 'none'
            }}>
            {word}
          </motion.span>))}
      </div>
    </motion.div>);
};
