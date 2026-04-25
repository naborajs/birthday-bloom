import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "./SoundManager";
import { Heart, Stars, Video, Sparkles, Camera } from "lucide-react";
import { useState } from "react";

export const FinalSurprise = () => {
  const { config } = useBirthdayStore();
  const { playReveal, playBoom } = useSoundManager();
  const [revealed, setRevealed] = useState(false);
  
  const memories = config.specialMemories || [];
  const primaryColor = config.favoriteColor || "#ff0080";

  return (
    <section className="relative z-20 py-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
            Our Special Memories 🎞️
          </h2>
          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto italic">
            "A journey of a thousand miles begins with a single step, but it's the moments we share that make it worth traveling."
          </p>
        </motion.div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {memories.map((memory, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -10, rotate: i % 2 === 0 ? 2 : -2 }}
              className="group relative aspect-[4/5] bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              {memory.image ? (
                <img src={memory.image} alt="Memory" className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
                  <Camera size={48} className="text-white/10" />
                </div>
              )}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg leading-tight">
                  {memory.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final Video Surprise */}
        {config.finalVideoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_100px_-20px_var(--color-primary)] bg-black/40 backdrop-blur-3xl"
          >
            <div className="aspect-video w-full">
              <iframe
                src={config.finalVideoUrl.includes('youtube.com') ? `${config.finalVideoUrl}?autoplay=0&controls=1&rel=0` : config.finalVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-10 text-center bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-display text-2xl md:text-4xl font-black mb-4">The Final Surprise 🎬</h4>
              <p className="text-lg md:text-xl text-white/60 font-light">A little something extra to make your heart smile.</p>
            </div>
          </motion.div>
        )}

        {/* Emotional Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center space-y-12 pb-40"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Heart size={80} fill={primaryColor} className="text-primary drop-shadow-[0_0_30px_var(--color-primary)]" />
          </motion.div>
          
          <div className="space-y-6">
            <h3 className="font-display text-4xl md:text-7xl font-black tracking-tight leading-tight">
              I Hope This Made Your <br />
              <span style={{ color: primaryColor }} className="animate-pulse">Day As Special As You Are</span>
            </h3>
            <p className="text-xl md:text-3xl font-light text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              Every pixel, every animation, and every word was crafted with love. <br />
              Happy Birthday once again, {config.name}. ✨
            </p>
          </div>

          <div className="flex justify-center gap-8 text-white/20">
            <Stars size={32} className="animate-spin-slow" />
            <Sparkles size={32} className="animate-pulse" />
            <Video size={32} className="animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
