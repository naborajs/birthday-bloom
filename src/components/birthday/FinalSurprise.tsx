import { motion } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { Heart, Stars, Video, Sparkles, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import { useTranslation } from "@/i18n";

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

/** Validate whether a URL is a genuine video URL */
const isValidVideoUrl = (url?: string): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "0" || trimmed === "null" || trimmed === "undefined" || trimmed === "false") return false;
    if (/^\/?[0-9]+$/.test(trimmed)) return false;
    if (trimmed.includes("example.com") || trimmed.includes("placeholder")) return false;
    if (
        trimmed.includes("youtube.com/watch") ||
        trimmed.includes("youtu.be/") ||
        trimmed.includes("youtube.com/embed") ||
        trimmed.includes("youtube.com/shorts") ||
        trimmed.endsWith(".mp4") ||
        trimmed.endsWith(".webm")
    ) {
        return true;
    }
    try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

export const FinalSurprise = () => {
    const { config } = useBirthdayStore();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const isMobile = useIsMobile();
    const allMemories = config.specialMemories || [];
    const memories = allMemories.filter(m => m.text && (isRealImageUrl(m.image) || !m.image));
    const hasRealMemories = memories.length > 0 && memories.some(m => isRealImageUrl(m.image));
    const primaryColor = config.favoriteColor || "#ff0080";
    const isValidVideo = isValidVideoUrl(config.finalVideoUrl);
    const finalVideoEmbed = isValidVideo && config.finalVideoUrl ? getYouTubeEmbedUrl(config.finalVideoUrl) : "";
    const finalVideoSrc = finalVideoEmbed.includes("youtube.com/embed")
        ? `${finalVideoEmbed}?autoplay=0&controls=1&rel=0`
        : finalVideoEmbed;
    const hasValidVideo = Boolean(isValidVideo && finalVideoSrc);

    return (<section className="relative z-20 py-32 px-4 overflow-hidden" aria-label="Final Surprise and Memories">
      <div className="max-w-6xl mx-auto">
        {hasRealMemories && (<>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
              {isFrench ? "Nos Souvenirs Spéciaux 🏞️" : isBengali ? "আমাদের বিশেষ স্মৃতিগুলো 🏞️" : isHindi ? "हमारी खास यादें 🏞️" : "Our Special Memories 🏞️"}
            </h2>
            <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto italic">
              {isFrench ? "« Un voyage de mille lieues commence par un premier pas, mais ce sont les moments partagés qui lui donnent tout son sens. »" : isBengali ? "“হাজার মাইলের যাত্রা একটি পদক্ষেপ দিয়ে শুরু হয়, কিন্তু সুন্দর স্মৃতিগুলোই এই যাত্রাকে সার্থক করে তোলে।”" : isHindi ? "“हजारों मीलों का सफर एक कदम से शुरू होता है, लेकिन वे खूबसूरत लम्हें ही हैं जो इस सफर को यादगार बनाते हैं।”" : "\"A journey of a thousand miles begins with a single step, but it's the moments we share that make it worth traveling.\""}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {memories.map((memory, i) => (<motion.div key={i} initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -2 : 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} whileHover={{ scale: 1.05, y: -10, rotate: i % 2 === 0 ? 2 : -2 }} className="group relative aspect-[4/5] bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"/>
                {memory.image ? (<img src={memory.image} alt={memory.text || `Special celebration memory ${i + 1}`} className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"/>) : (<div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
                    <Camera size={48} className="text-white/10"/>
                  </div>)}
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg leading-tight">
                    {memory.text}
                  </p>
                </div>
              </motion.div>))}
          </div>
        </>)}

        {hasValidVideo && (<motion.div initial={{ opacity: 0, scale: isMobile ? 1 : 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={isMobile ? "relative max-w-4xl mx-auto rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_80px_-20px_var(--color-primary)] bg-black/70 backdrop-blur-xl" : "relative max-w-4xl mx-auto rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_100px_-20px_var(--color-primary)] bg-black/40 backdrop-blur-3xl"}>
            <div className="aspect-video w-full">
              <iframe src={finalVideoSrc} loading="lazy" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Final Surprise Video"/>
            </div>
            <div className="p-10 text-center bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-display text-2xl md:text-4xl font-black mb-4">{isFrench ? "L'Ultime Surprise 🎬" : isBengali ? "শেষ সারপ্রাইজ 🎬" : isHindi ? "आखरी सरप्राइज 🎬" : "The Final Surprise 🎬"}</h3>
              <p className="text-lg md:text-xl text-white/60 font-light">{isFrench ? "Une petite touche spéciale pour illuminer votre cœur et faire sourire votre âme." : isBengali ? "আপনার মুখে একটি মিষ্টি হাসি ফুটিয়ে তোলার জন্য একটি ছোট্ট উপহার।" : isHindi ? "आपके चेहरे पर एक प्यारी सी मुस्कान लाने के लिए एक छोटा सा तोहफा।" : "A little something extra to make your heart smile."}</p>
            </div>
          </motion.div>)}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-40 text-center space-y-12 pb-40">
          <motion.div animate={isMobile ? { scale: [1, 1.05, 1], rotate: [0, 0, 0] } : { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: isMobile ? 6 : 4, repeat: Infinity, ease: "easeInOut" }} className="inline-block">
            <Heart size={80} fill={primaryColor} className="text-primary drop-shadow-[0_0_30px_var(--color-primary)]"/>
          </motion.div>
          <div className="space-y-6">
            <h2 className="font-display text-4xl md:text-7xl font-black tracking-tight leading-tight">
              {isFrench ? "J'espère que cette journée a été " : isBengali ? "আশা করি এটি আপনার দিনটিকে " : isHindi ? "उम्मीद है यह आपके दिन को " : "I Hope This Made Your "} <br />
              <span style={{ color: primaryColor }} className="animate-pulse">{isFrench ? "aussi spéciale et merveilleuse que vous l'êtes" : isBengali ? "আপনার মতোই সুন্দর ও বিশেষ করে তুলবে" : isHindi ? "उतना ही खास बनाएगा जितने आप हैं" : "Day As Special As You Are"}</span>
            </h2>
            <p className="text-xl md:text-3xl font-light text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              {isFrench ? "Chaque pixel, chaque animation et chaque mot a \u00E9t\u00E9 con\u00E7u avec tout notre amour." : isBengali ? "\u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AA\u09BF\u0995\u09CD\u09B8\u09C7\u09B2, \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u09A8\u09BF\u09AE\u09C7\u09B6\u09A8 \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09B6\u09AC\u09CD\u09A6 \u09B6\u09C1\u09A7\u09C1 \u09A8\u09BF\u0996\u09BE\u09A6 \u09AD\u09BE\u09B2\u09CB\u09AC\u09BE\u09B8\u09BE \u09A6\u09BF\u09AF\u09BC\u09C7 \u09A4\u09C8\u09B0\u09BF\u0964" : isHindi ? "\u09B9\u09B0 \u090F\u0915 \u09AA\u09BF\u0915\u09CD\u09B8\u09C7\u09B2, \u09B9\u09B0 \u090F\u09A8\u09BF\u09AE\u09C7\u09B6\u09A8 \u0914\u09B0 \u09B9\u09B0 \u09B6\u09AC\u09CD\u09A6 \u09B8\u09BF\u09B0\u09CD\u092B \u0914\u09B0 \u09B8\u09BF\u09B0\u09CD\u092B \u09AA\u09CD\u09AF\u09BE\u09B0 \u09B8\u09C7 \u09B8\u099C\u09BE\u09AF\u09BE \u0917\u09AF\u09BE \u09B9\u0948\u0964" : "Every pixel, every animation, and every word was crafted with love."} <br />
              {isFrench ? `Encore une fois, tr\u00E8s Joyeux Anniversaire, ${config.name}. \u2728` : isBengali ? `\u0986\u09B0\u0993 \u098F\u0995\u09AC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8\u09C7\u09B0 \u0985\u09AB\u09C1\u09B0\u09A8\u09CD\u09A4 \u09B6\u09C1\u09AD\u09C7\u099A\u09CD\u099B\u09BE, ${config.name}\u0964 \u2728` : isHindi ? `\u090F\u0915 \u09AC\u09BE\u09B0 \u09AB\u09BF\u09B0 \u099C\u09A8\u09CD\u09AE\u09A6\u09BF\u09A8 \u0915\u0940 \u09A2\u09C7\u09B0 \u09B8\u09BE\u09B0\u0940 \u09B6\u09C1\u09AD\u0915\u09BE\u09AE\u09A8\u09BE\u090F\u0902, ${config.name}\u0964 \u2728` : `Happy Birthday once again, ${config.name}. \u2728`}
            </p>
          </div>
          <div className={`flex justify-center gap-8 text-white/20 ${isMobile ? 'opacity-70' : ''}`}>
            <Stars size={32} className={isMobile ? "" : "animate-spin-slow"}/>
            <Sparkles size={32} className={isMobile ? "" : "animate-pulse"}/>
            <Video size={32} className={isMobile ? "" : "animate-bounce"}/>
          </div>
        </motion.div>
      </div>
    </section>);
};
