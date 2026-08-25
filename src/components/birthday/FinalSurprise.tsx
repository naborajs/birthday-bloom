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

export const FinalSurprise = () => {
    const { config } = useBirthdayStore();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const isMobile = useIsMobile();
    const allMemories = config.specialMemories || [];
    const memories = allMemories.filter(m => m.text && (isRealImageUrl(m.image) || !m.image));
    const hasRealMemories = memories.length > 0 && memories.some(m => isRealImageUrl(m.image));
    const primaryColor = config.favoriteColor || "#ff0080";
    const finalVideoEmbed = config.finalVideoUrl ? getYouTubeEmbedUrl(config.finalVideoUrl) : "";
    const finalVideoSrc = finalVideoEmbed.includes("youtube.com/embed")
        ? `${finalVideoEmbed}?autoplay=0&controls=1&rel=0`
        : finalVideoEmbed;
    const hasValidVideo = config.finalVideoUrl && finalVideoSrc;

    return (<section className="relative z-20 py-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {hasRealMemories && (<>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
              {isFrench ? "Nos Souvenirs Spéciaux \uD83C\uDFDE\uFE0F" : isBengali ? "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AC\u09BF\u09B6\u09C7\u09B7 \u09B8\u09CD\u09AE\u09C3\u09A4\u09BF\u0997\u09C1\u09B2\u09CB \uD83C\uDFDE\uFE0F" : isHindi ? "\u0939\u092E\u093E\u0930\u0940 \u0916\u093E\u0938 \u092F\u093E\u0926\u0947\u0902 \uD83C\uDFDE\uFE0F" : "Our Special Memories \uD83C\uDFDE\uFE0F"}
            </h2>
            <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto italic">
              {isFrench ? "\u00AB Un voyage de mille lieues commence par un premier pas, mais ce sont les moments partag\u00E9s qui lui donnent tout son sens. \u00BB" : isBengali ? "\u201C\u09B9\u09BE\u099C\u09BE\u09B0 \u09AE\u09BE\u0987\u09B2\u09C7\u09B0 \u09AF\u09BE\u09A4\u09CD\u09B0\u09BE \u098F\u0995\u099F\u09BF \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09AF\u09BC, \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u09B8\u09CD\u09AE\u09C3\u09A4\u09BF\u0997\u09C1\u09B2\u09CB\u0987 \u098F\u0987 \u09AF\u09BE\u09A4\u09CD\u09B0\u09BE\u0995\u09C7 \u09B8\u09BE\u09B0\u09CD\u09A5\u0995 \u0995\u09B0\u09C7 \u09A4\u09CB\u09B2\u09C7\u0964\u201D" : isHindi ? "\u201C\u0939\u091C\u093E\u0930\u094B\u0902 \u092E\u0940\u0932\u094B\u0902 \u0915\u093E \u0938\u092B\u09B0 \u090F\u0915 \u0915\u0926\u092E \u0938\u0947 \u0936\u09C1\u09B0\u09C2 \u0939\u094B\u09A4\u093E \u0939\u0948, \u09B2\u09C7\u0915\u09BF\u09A8 \u0935\u0947 \u0916\u09C2\u09AC\u09B8\u09C2\u09B0\u09A4 \u09B2\u09AE\u09CD\u09B9\u09C7\u0902 \u09B9\u0940 \u09B9\u0948\u0902 \u091C\u094B \u0907\u09B8 \u09B8\u092B\u09B0 \u0915\u094B \u092F\u093E\u0926\u0917\u093E\u09B0 \u092C\u09A8\u093E\u09A4\u09C7 \u09B9\u0948\u0902\u0964\u201D" : "\"A journey of a thousand miles begins with a single step, but it's the moments we share that make it worth traveling.\""}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {memories.map((memory, i) => (<motion.div key={i} initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -2 : 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} whileHover={{ scale: 1.05, y: -10, rotate: i % 2 === 0 ? 2 : -2 }} className="group relative aspect-[4/5] bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"/>
                {memory.image ? (<img src={memory.image} alt="Memory" className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"/>) : (<div className="w-full h-full flex items-center justify-center bg-white/5 rounded-2xl">
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
              <h4 className="font-display text-2xl md:text-4xl font-black mb-4">{isFrench ? "L'Ultime Surprise \uD83C\uDFAC" : isBengali ? "\u09B6\u09C7\u09B7 \u09B8\u09BE\u09B0\u09AA\u09CD\u09B0\u09BE\u0987\u099C \uD83C\uDFAC" : isHindi ? "\u0906\u0916\u09B0\u0940 \u09B8\u09B0\u09AA\u09CD\u09B0\u09BE\u0987\u099C \uD83C\uDFAC" : "The Final Surprise \uD83C\uDFAC"}</h4>
              <p className="text-lg md:text-xl text-white/60 font-light">{isFrench ? "Une petite touche sp\u00E9ciale pour illuminer votre c\u0153ur et faire sourire votre \u00E2me." : isBengali ? "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AE\u09C1\u0996\u09C7 \u098F\u0995\u099F\u09BF \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09B9\u09BE\u09B8\u09BF \u09AB\u09C1\u099F\u09BF\u09AF\u09BC\u09C7 \u09A4\u09CB\u09B2\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u099F\u09BF \u099B\u09CB\u099F\u09CD\u099F \u0989\u09AA\u09B9\u09BE\u09B0\u0964" : isHindi ? "\u0906\u09AA\u0915\u09C7 \u091A\u09C7\u09B9\u09B0\u09C7 \u09AA\u09B0 \u090F\u0915 \u09AA\u09CD\u09AF\u09BE\u09B0\u0940 \u09B8\u0940 \u09AE\u09C1\u09B8\u09CD\u0995\u09BE\u09A8 \u09B2\u09BE\u09A8\u09C7 \u0915\u09C7 \u09B2\u09BF\u090F \u090F\u0915 \u099B\u09CB\u099F\u09BE \u09B8\u09BE \u09A4\u09CB\u09B9\u092B\u09BE\u0964" : "A little something extra to make your heart smile."}</p>
            </div>
          </motion.div>)}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-40 text-center space-y-12 pb-40">
          <motion.div animate={isMobile ? { scale: [1, 1.05, 1], rotate: [0, 0, 0] } : { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: isMobile ? 6 : 4, repeat: Infinity, ease: "easeInOut" }} className="inline-block">
            <Heart size={80} fill={primaryColor} className="text-primary drop-shadow-[0_0_30px_var(--color-primary)]"/>
          </motion.div>
          <div className="space-y-6">
            <h3 className="font-display text-4xl md:text-7xl font-black tracking-tight leading-tight">
              {isFrench ? "J'esp\u00E8re que cette journ\u00E9e a \u00E9t\u00E9 " : isBengali ? "\u0986\u09B6\u09BE \u0995\u09B0\u09BF \u098F\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u09BF\u09A8\u099F\u09BF\u0995\u09C7 " : isHindi ? "\u0909\u09AE\u09CD\u09AE\u0940\u09A6 \u09B9\u0948 \u092F\u09B9 \u0906\u09AA\u0915\u09C7 \u09A6\u09BF\u09A8 \u0915\u09CB " : "I Hope This Made Your "} <br />
              <span style={{ color: primaryColor }} className="animate-pulse">{isFrench ? "aussi sp\u00E9ciale et merveilleuse que vous l'\u00EAtes" : isBengali ? "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AE\u09A4\u09CB\u0987 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u0993 \u09AC\u09BF\u09B6\u09C7\u09B7 \u0995\u09B0\u09C7 \u09A4\u09C1\u09B2\u09AC\u09C7" : isHindi ? "\u0909\u09A4\u09A8\u09BE \u09B9\u0940 \u0916\u09BE\u09B8 \u09AC\u09A8\u093E\u090F\u0917\u09BE \u099C\u09BF\u09A4\u09A8\u09C7 \u0906\u09AA \u09B9\u0948\u0902" : "Day As Special As You Are"}</span>
            </h3>
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
