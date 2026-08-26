import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/i18n";
import { Sparkles } from "lucide-react";

/** Check if a URL looks like a real personal photo (not a stock/placeholder) */
const isRealImageUrl = (url?: string): boolean => {
    if (!url || !url.trim()) return false;
    const lower = url.toLowerCase();
    if (lower.includes('unsplash.com')) return false;
    if (lower.includes('example.com')) return false;
    if (lower.includes('placeholder')) return false;
    if (lower.includes('picsum.photos')) return false;
    return true;
};

export const PhotoGallery = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [photoRatios, setPhotoRatios] = useState<Record<string, number>>({});
    const [supportsTilt, setSupportsTilt] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const isMobile = useIsMobile();
    const { config, getAnimationPacing } = useBirthdayStore();
    const { t, isHindi, isBengali, isFrench } = useTranslation();
    const { relationship } = config;
    const animationPacing = getAnimationPacing();
    const reducedMotion = isReducedMotion || isMobile;
    const transitionDuration = reducedMotion ? 0.9 : animationPacing === 'fast' ? 0.8 : animationPacing === 'slow' ? 1.5 : 1.2;
    const autoAdvanceDelay = animationPacing === 'fast' ? 4500 : animationPacing === 'slow' ? 8500 : 6000;

    // Filter to only genuine configured photos
    const validPhotos = useMemo(() => {
        return (config.photos || []).filter(src => isRealImageUrl(src));
    }, [config.photos]);

    const photos = useMemo(() => {
        if (validPhotos.length === 0) return [];

        const captions = isFrench ? (relationship === 'partner' ? [
            "Chaque moment à tes côtés est un cadeau précieux 💖",
            "Bâtir notre merveilleux avenir ensemble ✨",
            "Le lieu préféré de mon cœur 🌹"
        ] : relationship === 'friend' ? [
            "Des moments légendaires avec le boss 🚀",
            "Mille souvenirs et des fous rires inoubliables ! 😂",
            "Reste toujours au sommet, reste toi-même ! 🍻"
        ] : [
            "La famille est là où la vie commence ✨",
            "Chérir chaque sourire et chaque éclat de rire 💖",
            "Un voyage merveilleux rempli d'amour 🌟"
        ]) : isBengali ? (relationship === 'partner' ? [
            "আপনার সাথে কাটানো প্রতিটি মুহূর্ত এক অমূল্য উপহার 💖",
            "আমাদের সুন্দর ভবিষ্যতের অপূর্ব সূচনা ✨",
            "আমার হৃদয়ের সবচেয়ে পছন্দের ঠিকানা 🌹"
        ] : relationship === 'friend' ? [
            "সেরা বন্ধুর সাথে অবিস্মরণীয় মুহূর্তগুলো 🚀",
            "একরাশ স্মৃতি আর পাগলামির গল্প! 😂",
            "চিরকাল এমন দুর্দান্ত আর পাগল থাকিস! 🍻"
        ] : [
            "পরিবার সেখানেই যেখানে জীবনের শুরু ✨",
            "প্রতিটি হাসি পরম যত্নে আগলে রাখা 💖",
            "ভালোবাসা আর আনন্দের সুন্দর সফর 🌟"
        ]) : isHindi ? (relationship === 'partner' ? [
            "आपके साथ बिताया हर पल एक अनमोल तोहफा है 💖",
            "हमारे सुनहरे भविष्य की खूबसूरत शुरुआत ✨",
            "मेरे दिल का सबसे पसंदीदा ठिकाना 🌹"
        ] : relationship === 'friend' ? [
            "सच्चे यार के साथ बिताए यादगार लम्हे 🚀",
            "ढेर सारी यादें और पागलपन भरी बातें! 😂",
            "हमेशा ऐसे ही शानदार रहो! 🍻"
        ] : [
            "परिवार वो जगह है जहाँ ज़िंदगी शुरू होती है ✨",
            "हर एक मुस्कान को सहेज कर रखना 💖",
            "प्यार और खुशियों से भरा सफर 🌟"
        ]) : (relationship === 'partner' ? [
            "Every moment with you is a gift 💖",
            "Building our beautiful future ✨",
            "My heart's favorite place 🌹"
        ] : relationship === 'friend' ? [
            "Legendary times with the MVP 🚀",
            "Making memories and bad decisions! 😂",
            "Stay epic, stay you! 🍻"
        ] : [
            "Family is where life begins ✨",
            "Cherishing every smile 💖",
            "A journey filled with love 🌟"
        ]);

        return validPhotos.map((src, i) => ({
            src,
            key: `photo-${i}`,
            caption: config.photoCaptions?.[i] || captions[i % captions.length] || (isFrench ? "Doux souvenir" : isBengali ? "সুন্দর স্মৃতি" : isHindi ? "खूबसूरत याद" : "Beautiful memory"),
        }));
    }, [validPhotos, relationship, config.photoCaptions, isHindi, isBengali, isFrench]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20, stiffness: 150 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20, stiffness: 150 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!supportsTilt || isMobile)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleImageLoad = (key: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth && naturalHeight) {
            setPhotoRatios((prev) => ({ ...prev, [key]: naturalWidth / naturalHeight }));
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        setSupportsTilt(window.matchMedia('(pointer:fine)').matches && window.innerWidth >= 768);
        setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    useEffect(() => {
        if (lightbox !== null || photos.length <= 1)
            return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % photos.length);
        }, autoAdvanceDelay);
        return () => clearInterval(interval);
    }, [lightbox, photos.length, autoAdvanceDelay]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setLightbox(null);
            }
            if (lightbox !== null && photos.length > 0) {
                if (event.key === 'ArrowRight') {
                    setActiveIndex((prev) => (prev + 1) % photos.length);
                }
                if (event.key === 'ArrowLeft') {
                    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightbox, photos.length]);

    // If no real photos are configured, show a beautiful, personalized empty state
    if (photos.length === 0) {
        return (
            <section className="relative z-20 px-4 py-24 max-w-4xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-[2.5rem] border border-white/10 p-8 sm:p-14 text-center overflow-hidden backdrop-blur-3xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                        boxShadow: "0 30px 100px -20px rgba(0,0,0,0.6)",
                    }}
                >
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl mb-6 shadow-inner">
                        📸
                    </div>
                    <h2 className="font-display text-3xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
                        {t('memories.title')}
                    </h2>
                    <p className="text-base sm:text-xl text-foreground/80 font-light max-w-xl mx-auto leading-relaxed mb-6">
                        {isFrench
                            ? "Nous n'avons pas encore de photos ensemble ici, mais nous allons assurément créer d'innombrables souvenirs inoubliables !"
                            : isBengali
                            ? "আমাদের একসাথে কোনো ছবি এখনো যোগ করা হয়নি, তবে সামনে আমরা অনেক সুন্দর স্মৃতি তৈরি করব!"
                            : isHindi
                            ? "हमारे पास अभी साथ में तस्वीरें नहीं हैं, लेकिन आगे हम ढेर सारी खूबसूरत यादें ज़रूर बनाएंगे!"
                            : "Sadly we don't have any picture with us yet, but we definitely will make many memories together!"}
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-white/60">
                        <Sparkles size={14} className="text-primary" />
                        <span>{isFrench ? "De nouvelles aventures à venir ✨" : isBengali ? "সামনে আসছে দারুণ সব স্মৃতি ✨" : isHindi ? "ढेर सारी नई यादें आने वाली हैं ✨" : "Future adventures await ✨"}</span>
                    </div>
                </motion.div>
            </section>
        );
    }

    return (<>
      <section className="relative z-20 px-4 py-32 max-w-7xl mx-auto overflow-hidden" aria-label="Photo Memories Gallery">
        <motion.h2 initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black text-center mb-24 bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent drop-shadow-2xl">
          {t('memories.title')}
        </motion.h2>

        <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, perspective: 1000 }} className={`relative group ${isMobile ? '' : 'cursor-none'}`}>
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={isMobile ? { opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, rotateY: -15, filter: "blur(20px)" }} animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }} exit={isMobile ? undefined : { opacity: 0, scale: 1.1, rotateY: 15, filter: "blur(20px)" }} transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }} style={{ aspectRatio: photoRatios[photos[activeIndex].key] ?? 16 / 9 }} className="relative rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-white/10" onClick={() => setLightbox(activeIndex)}>
              <img src={photos[activeIndex].src} alt={photos[activeIndex].caption} onLoad={(e) => handleImageLoad(photos[activeIndex].key, e)} loading="lazy" className={`w-full h-full object-cover transition-transform [transition-duration:3000ms] ${!isMobile ? "group-hover:scale-110" : ""}`}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"/>
              
              <div className="absolute bottom-0 inset-x-0 p-8 sm:p-16 text-center">
                <p className="font-display text-3xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-2xl mb-4">
                  {photos[activeIndex].caption}
                </p>
                <span className="text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase font-bold">
                  {activeIndex + 1} / {photos.length}
                </span>
              </div>

              
              <motion.div style={{ x, y }} className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black uppercase tracking-widest text-xs">
                  {t('memories.viewLarge')}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          
          {photos.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + photos.length) % photos.length); }} className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white text-4xl hover:bg-primary transition-all shadow-2xl">
                ‹
              </button>
              <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % photos.length); }} className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white text-4xl hover:bg-primary transition-all shadow-2xl">
                ›
              </button>
            </div>
          )}
        </motion.div>

        
        {photos.length > 1 && (
          <div className="flex justify-center mt-20 gap-8">
            {photos.map((photo, i) => (<motion.div key={i} role="button" tabIndex={0} aria-label={`View photo ${i + 1}: ${photo.caption}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(i); } }} onClick={() => setActiveIndex(i)} whileHover={!isMobile ? { scale: 1.15, y: -10, rotate: i % 2 === 0 ? 2 : -2 } : undefined} whileTap={{ scale: 0.9 }} className={`relative cursor-pointer rounded-3xl overflow-hidden w-28 h-28 md:w-40 md:h-40 border-4 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-primary ${i === activeIndex ? "border-primary scale-110 shadow-[0_20px_50px_rgba(var(--color-primary-rgb,255,107,107),0.4)]" : "border-transparent opacity-30 hover:opacity-100"}`}>
                <img src={photo.src} alt={photo.caption || `Celebration photo memory thumbnail ${i + 1}`} className="w-full h-full object-cover"/>
                {i === activeIndex && (<motion.div layoutId="active-thumb-glow" className="absolute inset-0 bg-primary/10 pointer-events-none"/>)}
              </motion.div>))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightbox !== null && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.7, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 1.3, opacity: 0, filter: "blur(20px)" }} className="relative max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={photos[lightbox].src} alt={photos[lightbox].caption} className="w-full max-h-[85vh] object-contain rounded-[2.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border border-white/10"/>
              <div className="text-center mt-12">
                <p className="font-display text-4xl md:text-6xl text-white font-black italic tracking-tighter drop-shadow-2xl">
                  {photos[lightbox].caption}
                </p>
              </div>
              <button aria-label="Close enlarged photo view" onClick={() => setLightbox(null)} className="absolute top-4 right-4 md:-top-12 md:-right-12 w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white text-xl md:text-3xl transition-all shadow-2xl z-50">
                ✕
              </button>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </>);
};
