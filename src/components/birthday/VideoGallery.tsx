import { motion } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import { Film, Sparkles, Heart, Video } from "lucide-react";

/** Validate whether a URL is a genuine YouTube embed or video media file */
const isValidVideoUrl = (url?: string): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "0" || trimmed === "null" || trimmed === "undefined" || trimmed === "false") return false;
    // Exclude invalid short paths like "/0" or "/2" that trigger local 404 routes
    if (/^\/?[0-9]+$/.test(trimmed)) return false;
    if (trimmed.includes("example.com") || trimmed.includes("placeholder")) return false;

    if (
        trimmed.includes("youtube.com/watch") ||
        trimmed.includes("youtu.be/") ||
        trimmed.includes("youtube.com/embed") ||
        trimmed.includes("youtube.com/shorts") ||
        trimmed.endsWith(".mp4") ||
        trimmed.endsWith(".webm") ||
        trimmed.includes(".mp4?") ||
        trimmed.includes(".webm?")
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

export const VideoGallery = () => {
    const { config } = useBirthdayStore();
    const { isHindi, isBengali, isFrench } = useTranslation();
    const isMobile = useIsMobile();
    const rawVideos = config.videos || [];
    const validVideos = rawVideos.filter(isValidVideoUrl);
    const relationship = config.relationship || "partner";
    const primaryColor = config.favoriteColor || "#FF2A6D";

    return (
        <section className="relative z-20 px-4 py-24 sm:py-32 max-w-7xl mx-auto overflow-hidden" aria-label="Special Video Memories Gallery">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,42,109,0.3)] bg-white/5 backdrop-blur-md"
                    >
                        🎬
                    </motion.div>
                </div>
                <h2
                    className="font-display text-4xl sm:text-6xl md:text-7xl font-black drop-shadow-xl mb-4 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent"
                >
                    {isFrench
                        ? "SOUVENIRS VIDÉO SPÉCIAUX 🎬"
                        : isBengali
                            ? "বিশেষ ভিডিও স্মৃতি 🎬"
                            : isHindi
                                ? "खास वीडियो यादें 🎬"
                                : "SPECIAL MEMORIES 🎬"}
                </h2>
                <p className="font-display italic text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto">
                    {relationship === "partner"
                        ? isFrench
                            ? "« Chaque seconde passée avec toi ressemble à la plus belle des scènes de film. »"
                            : isBengali
                                ? "“আপনার সাথে কাটানো প্রতিটি মুহূর্ত যেন এক সুন্দর সিনেমার দৃশ্যের মতো।”"
                                : isHindi
                                    ? "“आपके साथ बिताया हर एक पल किसी खूबसूरत फिल्म के दृश्य जैसा है।”"
                                    : '"Every second spent with you feels like the most beautiful movie scene."'
                        : relationship === "friend"
                            ? isFrench
                                ? "« Pour toutes les aventures folles et les rires inoubliables ! »"
                                : isBengali
                                    ? "“সব পাগলামি ভরা রোমাঞ্চ আর অট্টহাসির স্মৃতির নামে!”"
                                    : isHindi
                                        ? "“उन सभी पागलपन भरे कारनामों और हंसी के ठहाकों के नाम!”"
                                        : '"To all the wild adventures and unforgettable laughter!"'
                            : isFrench
                                ? "« Les moments partagés en famille sont les plus précieux des trésors. »"
                                : isBengali
                                    ? "“পরিবারের সাথে ভাগ করে নেওয়া মুহূর্তগুলোই জীবনের সেরা সম্পদ।”"
                                    : isHindi
                                        ? "“परिवार के साथ साझा किए गए लम्हें ही जीवन की सबसे अनमोल धरोहर हैं।”"
                                        : '"Moments shared with family are the most precious treasures of all."'}
                </p>
            </motion.div>

            {validVideos.length > 0 ? (
                <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
                    {validVideos.map((url, i) => {
                        const isVideoFile =
                            url.endsWith(".mp4") ||
                            url.endsWith(".webm") ||
                            url.includes(".mp4?");
                        const embedUrl = getYouTubeEmbedUrl(url);

                        return (
                            <motion.div
                                key={i}
                                initial={
                                    isMobile
                                        ? { opacity: 1, scale: 1, y: 0 }
                                        : { opacity: 0, scale: 0.9, y: 50 }
                                }
                                whileInView={
                                    isMobile ? undefined : { opacity: 1, scale: 1, y: 0 }
                                }
                                viewport={
                                    isMobile ? undefined : { once: true, margin: "-50px" }
                                }
                                transition={{
                                    duration: isMobile ? 1.2 : 0.8,
                                    delay: i * 0.2,
                                    ease: "easeOut",
                                }}
                                className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/15 bg-black/60 backdrop-blur-2xl group"
                            >
                                {isVideoFile ? (
                                    <video
                                        src={url}
                                        controls
                                        playsInline
                                        className="w-full h-full object-contain"
                                        preload="metadata"
                                    />
                                ) : (
                                    <iframe
                                        src={embedUrl}
                                        loading="lazy"
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={`Video memory ${i + 1}`}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                /* Heartfelt Emotional Memory Placeholder Card (No broken 404 iframes) */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-3xl mx-auto p-10 sm:p-14 rounded-[2.5rem] border backdrop-blur-3xl text-center relative overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)]"
                    style={{
                        background:
                            "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, hsla(var(--primary), 0.06) 50%, rgba(0,0,0,0.4) 100%)",
                        borderColor: `${primaryColor}35`,
                    }}
                >
                    <div className="flex justify-center gap-4 mb-6 text-white/30">
                        <Film size={36} className="text-primary/70 animate-subtle-float" />
                        <Heart size={36} className="text-rose-400/80 animate-pulse" />
                        <Sparkles size={36} className="text-amber-300/80 animate-subtle-float" />
                    </div>

                    <h3
                        className="font-script text-3xl sm:text-5xl font-bold italic mb-6 text-gradient-romantic text-glow-rose leading-tight"
                    >
                        {relationship === "partner"
                            ? isFrench
                                ? "Créons ensemble nos plus beaux souvenirs ✨"
                                : isBengali
                                    ? "চলুন একসাথে তৈরি করি আমাদের সুন্দর সব স্মৃতি ✨"
                                    : isHindi
                                        ? "चलिए मिलकर बनाते हैं अपनी सबसे खूबसूरत यादें ✨"
                                        : "Waiting to Create Countless Memories With You ✨"
                            : relationship === "friend"
                                ? isFrench
                                ? "Prêt(e) pour nos prochaines aventures légendaires ? 🔥"
                                : isBengali
                                    ? "চল দোস্ত, সামনে আরও বড় ধামাকা স্মৃতি তৈরি করব! 🔥"
                                    : isHindi
                                        ? "चलो यार, आगे और भी धमाकेदार यादें बनाएंगे! 🔥"
                                        : "Ready For Our Next Legendary Memories? 🔥"
                                : isFrench
                                    ? "De précieux souvenirs sont encore à venir 🌟"
                                    : isBengali
                                        ? "সামনে আরও অনেক সুন্দর স্মৃতি তৈরি করার অপেক্ষায় 🌟"
                                        : isHindi
                                            ? "आगे और भी अनमोल यादें बनाने का इंतज़ार है 🌟"
                                            : "Treasured Moments Still to Come 🌟"}
                    </h3>

                    <p className="font-display font-light text-lg sm:text-2xl text-white/85 max-w-xl mx-auto leading-relaxed mb-8">
                        {relationship === "partner"
                            ? isFrench
                                ? "Nous n'avons pas encore enregistré toutes nos vidéos... mais mon cœur a hâte de vivre et capturer une infinité d'instants magiques avec toi ! 💖"
                                : isBengali
                                    ? "আমাদের সব ভিডিও স্মৃতি হয়তো এখনও ক্যামেরায় বন্দি হয়নি... কিন্তু আপনার সাথে প্রতিটি মুহূর্ত সিনেমার মতো সুন্দর করে সাজানোর অপেক্ষায় আছি! 💖"
                                    : isHindi
                                        ? "हमारी सारी वीडियो यादें भले ही अभी रिकॉर्ड नहीं हुईं... पर आपके साथ ज़िंदगी का हर खूबसूरत पल जीने और नई यादें बनाने का इंतज़ार है! 💖"
                                        : "We haven't recorded all our video clips yet... but my heart is waiting for a lifetime of beautiful adventures and movie scenes with you! 💖"
                            : relationship === "friend"
                                ? isFrench
                                    ? "Pas encore de vidéos importées... mais viens, on va bientôt créer des souvenirs complètement fous et inoubliables ! 🎉🍻"
                                    : isBengali
                                        ? "এখনও কোনো ভিডিও ক্লিপ যুক্ত হয়নি... কিন্তু চল শীঘ্রই দারুণ কিছু পাগলামি আর স্মরণীয় স্মৃতি তৈরি করা যাক! 🎉🍻"
                                        : isHindi
                                            ? "अभी कोई वीडियो क्लिप नहीं जुड़ी... पर चलो जल्द ही कुछ धमाकेदार और यादगार यादें बनाते हैं! 🎉🍻"
                                            : "No wild video clips uploaded yet... but come on, let's create some chaotic, unforgettable memories together soon! 🎉🍻"
                                : isFrench
                                    ? "Chaque instant partagé en famille est une bénédiction. Hâte de capturer encore plus de magnifiques souvenirs ensemble ! 🌟"
                                    : isBengali
                                        ? "পরিবারের সাথে কাটানো প্রতিটি মুহূর্ত ঈশ্বরের আশীর্বাদ। একসাথে আরও অনেক সুন্দর ও মধুর স্মৃতি তৈরির অপেক্ষায় রইলাম! 🌟"
                                        : isHindi
                                            ? "परिवार के साथ बिताया हर पल एक अनमोल तोहफा है। साथ मिलकर और भी ढेर सारी खूबसूरत यादें बनाने की उम्मीद है! 🌟"
                                            : "Every moment shared with family is a blessing. Looking forward to capturing many more precious memories together! 🌟"}
                    </p>

                    <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-sm sm:text-base font-medium shadow-lg backdrop-blur-xl">
                        <Video size={18} className="text-primary animate-pulse" />
                        <span>
                            {isFrench
                                ? "Nos Mémoires en Cours d'Écriture 🎬"
                                : isBengali
                                    ? "স্মৃতি তৈরির এক নতুন সূচনা 🎬"
                                    : isHindi
                                        ? "यादों की एक नई शुरुआत 🎬"
                                        : "Our Story is Just Beginning 🎬"}
                        </span>
                    </div>
                </motion.div>
            )}
        </section>
    );
};
