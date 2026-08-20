import { motion } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { getYouTubeEmbedUrl } from "@/lib/utils";

export const VideoGallery = () => {
    const { config } = useBirthdayStore();
    const isMobile = useIsMobile();
    const videos = config.videos || [];
    if (!videos || videos.length === 0)
        return null;
    return (<section className="relative z-20 px-4 py-20 max-w-7xl mx-auto w-full">
      <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-5xl md:text-8xl font-black text-center mb-16 drop-shadow-xl" style={{ color: config.favoriteColor || '#FF6B6B' }}>
        SPECIAL MEMORIES 🎬
      </motion.h3>

      <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
        {videos.map((url, i) => {
            const isVideoFile = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('.mp4?');
            const embedUrl = getYouTubeEmbedUrl(url);
            return (<motion.div key={i} initial={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 50 }} whileInView={isMobile ? undefined : { opacity: 1, scale: 1, y: 0 }} viewport={isMobile ? undefined : { once: true, margin: "-50px" }} transition={{ duration: isMobile ? 1.2 : 0.8, delay: i * 0.2, ease: "easeOut" }} className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/50 backdrop-blur-xl group">
              {isVideoFile ? (<video src={url} controls playsInline className="w-full h-full object-contain" preload="metadata"/>) : (<iframe src={embedUrl} loading="lazy" className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={`Video memory ${i + 1}`}></iframe>)}
            </motion.div>);
        })}
      </div>
    </section>);
};
