import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useSoundManager } from "./SoundManager";
import { useTranslation } from "@/i18n";

export const SoundToggle = () => {
    const [isMuted, setIsMuted] = useState(false);
    const { setBgVolume } = useSoundManager();
    const { isFrench, isBengali, isHindi } = useTranslation();

    const handleToggle = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            setBgVolume(next ? 0 : 0.25);
            return next;
        });
    }, [setBgVolume]);

    const label = isMuted
        ? isFrench
            ? "Activer le son"
            : isBengali
            ? "শব্দ চালু করুন"
            : isHindi
            ? "आवाज़ चालू करें"
            : "Unmute Audio"
        : isFrench
        ? "Couper le son"
        : isBengali
        ? "শব্দ বন্ধ করুন"
        : isHindi
        ? "आवाज़ बंद करें"
        : "Mute Audio";

    return (
        <motion.button
            type="button"
            role="button"
            aria-label={label}
            title={label}
            onClick={handleToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="fixed top-6 right-6 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {isMuted ? (
                <VolumeX size={18} className="text-white/60" />
            ) : (
                <Volume2 size={18} className="text-primary animate-pulse" />
            )}
        </motion.button>
    );
};
