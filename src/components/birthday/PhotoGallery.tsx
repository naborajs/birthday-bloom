import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PHOTO_ASSETS } from "@/config/birthday";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import photo1Default from "@/assets/photo-1.jpg";
import photo2Default from "@/assets/photo-2.jpg";
import photo3Default from "@/assets/photo-3.jpg";

export const PhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { config } = useBirthdayStore();
  const { relationship } = config;

  const photos = useMemo(() => {
    const base = [
      { src: PHOTO_ASSETS.photo1 || photo1Default, fallback: photo1Default, key: "p1" },
      { src: PHOTO_ASSETS.photo2 || photo2Default, fallback: photo2Default, key: "p2" },
      { src: PHOTO_ASSETS.photo3 || photo3Default, fallback: photo3Default, key: "p3" },
    ].filter(p => p.src !== null);

    const captions = relationship === 'partner' ? [
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
    ];

    return base.map((p, i) => ({ ...p, caption: captions[i] || "Beautiful memory ✨" }));
  }, [relationship]);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
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

  useEffect(() => {
    if (lightbox !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [lightbox, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <section className="relative z-20 px-4 py-32 max-w-7xl mx-auto overflow-hidden">
        <motion.h3 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black text-center mb-24 bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent drop-shadow-2xl"
        >
          MEMORIES 📸
        </motion.h3>

        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="relative group cursor-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9, rotateY: -15, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, rotateY: 15, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={() => setLightbox(activeIndex)}
            >
              <img
                src={photos[activeIndex].src}
                alt={photos[activeIndex].caption}
                onError={(e) => { (e.target as HTMLImageElement).src = photos[activeIndex].fallback; }}
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-12 left-0 right-0 text-center px-12">
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-display text-3xl md:text-5xl lg:text-6xl text-white font-black italic tracking-tighter drop-shadow-2xl"
                >
                  {photos[activeIndex].caption}
                </motion.p>
              </div>

              {/* Custom 3D Cursor */}
              <motion.div 
                style={{ x, y }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black uppercase tracking-widest text-xs">
                  View Large
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + photos.length) % photos.length); }}
              className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white text-4xl hover:bg-primary transition-all shadow-2xl"
            >
              ‹
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % photos.length); }}
              className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white text-4xl hover:bg-primary transition-all shadow-2xl"
            >
              ›
            </button>
          </div>
        </motion.div>

        {/* Cinematic Thumbnails */}
        <div className="flex justify-center mt-20 gap-8">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.15, y: -10, rotate: i % 2 === 0 ? 2 : -2 }}
              whileTap={{ scale: 0.9 }}
              className={`relative cursor-pointer rounded-3xl overflow-hidden w-28 h-28 md:w-40 md:h-40 border-4 transition-all duration-700 ${i === activeIndex ? "border-primary scale-110 shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.4)]" : "border-transparent opacity-30 hover:opacity-100"}`}
            >
              <img src={photo.src} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = photo.fallback; }} />
              {i === activeIndex && (
                <motion.div 
                  layoutId="active-thumb-glow"
                  className="absolute inset-0 bg-primary/10 pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8"
            onClick={() => setLightbox(null)}
          >
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 1.3, opacity: 0, filter: "blur(20px)" }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightbox].src}
                alt={photos[lightbox].caption}
                className="w-full max-h-[85vh] object-contain rounded-[2.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border border-white/10"
              />
              <div className="text-center mt-12">
                <p className="font-display text-4xl md:text-6xl text-white font-black italic tracking-tighter drop-shadow-2xl">
                  {photos[lightbox].caption}
                </p>
              </div>
              <button 
                onClick={() => setLightbox(null)}
                className="absolute -top-12 -right-12 w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white text-3xl transition-all shadow-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
