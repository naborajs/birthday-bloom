import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBirthdayStore, type RelationshipType } from '@/features/core/store/useBirthdayStore';
import { useTranslation, type SupportedLanguage } from '@/i18n';
import { toast } from 'sonner';
import { 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Sparkles, 
  X, 
  Heart, 
  Globe 
} from 'lucide-react';

interface ShareCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCelebrationModal: React.FC<ShareCelebrationModalProps> = ({ isOpen, onClose }) => {
  const { config } = useBirthdayStore();
  const { language, isBengali, isHindi, isFrench } = useTranslation();
  
  const [customName, setCustomName] = useState(config.name || '');
  const [customRel, setCustomRel] = useState<RelationshipType>(config.relationship || 'partner');
  const [customLang, setCustomLang] = useState<SupportedLanguage>(
    (language as SupportedLanguage) || 'en'
  );
  const [customSender, setCustomSender] = useState(config.senderName || '');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'customize'>('share');

  // Build the share URL with query parameters
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://birthday-bloom.vercel.app/';

  const generateShareUrl = (name: string, rel: string, lang: string, sender: string) => {
    const params = new URLSearchParams();
    if (name.trim()) params.set('name', name.trim());
    if (rel) params.set('rel', rel);
    if (lang && lang !== 'en') params.set('lang', lang);
    if (sender.trim()) params.set('sender', sender.trim());
    params.set('utm_source', 'share');
    params.set('utm_medium', 'social');
    params.set('utm_campaign', 'birthday_celebration');
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const activeShareUrl = generateShareUrl(
    activeTab === 'customize' ? customName : (config.name || ''),
    activeTab === 'customize' ? customRel : (config.relationship || 'partner'),
    activeTab === 'customize' ? customLang : (language || 'en'),
    activeTab === 'customize' ? customSender : (config.senderName || '')
  );

  const targetName = activeTab === 'customize' ? customName : (config.name || '');
  
  const shareText = targetName
    ? (isFrench 
        ? `✨ Venez célébrer l'anniversaire magique de ${targetName} sur Birthday Bloom ! 🎂🎉`
        : isBengali
          ? `✨ ${targetName}-এর জাদুকরী জন্মদিনের উদযাপনে যোগ দিন Birthday Bloom-এ! 🎂🎉`
          : isHindi
            ? `✨ ${targetName} के जादुई जन्मदिन के जश्न में शामिल हों Birthday Bloom पर! 🎂🎉`
            : `✨ Join me in celebrating ${targetName}'s magical birthday surprise on Birthday Bloom! 🎂🎉`)
    : (isFrench
        ? `✨ Découvrez cette expérience magique de célébration d'anniversaire sur Birthday Bloom ! 🎂🎉`
        : isBengali
          ? `✨ Birthday Bloom-এ একটি অসাধারণ জাদুকরী জন্মদিনের ওয়েবসাইটের অভিজ্ঞতা নিন! 🎂🎉`
          : isHindi
            ? `✨ Birthday Bloom पर एक जादुई जन्मदिन का उत्सव देखें! 🎂🎉`
            : `✨ Check out this magical cinematic birthday celebration experience on Birthday Bloom! 🎂🎉`);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(activeShareUrl);
        setCopied(true);
        toast.success(
          isFrench 
            ? "Lien copié dans le presse-papier ! ✨" 
            : isBengali 
              ? "লিংক কপি করা হয়েছে! ✨" 
              : isHindi 
                ? "लिंक कॉपी हो गया! ✨" 
                : "Celebration link copied! ✨"
        );
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Birthday Bloom — ${targetName || 'Magical Celebration'}`,
          text: shareText,
          url: activeShareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const openShareWindow = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${activeShareUrl}`)}`;
    openShareWindow(url);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(activeShareUrl)}&hashtags=BirthdayBloom,HappyBirthday`;
    openShareWindow(url);
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(activeShareUrl)}&text=${encodeURIComponent(shareText)}`;
    openShareWindow(url);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeShareUrl)}`;
    openShareWindow(url);
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeShareUrl)}`;
    openShareWindow(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg rounded-3xl border border-white/20 bg-black/90 p-6 sm:p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 rounded-full p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-primary/30 to-pink-500/20 mb-3 border border-white/10">
              <Share2 className="text-primary" size={28} />
            </div>
            <h3 id="share-modal-title" className="font-display text-2xl sm:text-3xl font-black text-white">
              {isFrench ? "Partager la Célébration ✨" : isBengali ? "উদযাপন শেয়ার করুন ✨" : isHindi ? "जश्न शेयर करें ✨" : "Share Celebration ✨"}
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              {isFrench 
                ? "Envoyez cette surprise magique ou créez-en une nouvelle pour vos proches"
                : isBengali
                  ? "এই জাদুকরী সারপ্রাইজটি পাঠান বা প্রিয়জনের জন্য নতুন তৈরি করুন"
                  : isHindi
                    ? "यह जादुई सरप्राइज भेजें या अपने अपनों के लिए नया बनाएं"
                    : "Send this magical surprise or create a personalized link for someone special"}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('share')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'share'
                  ? 'bg-primary text-black shadow-lg font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Send size={14} />
              {isFrench ? "Partager Maintenant" : isBengali ? "এখনই শেয়ার করুন" : isHindi ? "अभी शेयर करें" : "Quick Share"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'customize'
                  ? 'bg-primary text-black shadow-lg font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              {isFrench ? "Créer pour Quelqu'un" : isBengali ? "নতুন তৈরি করুন" : isHindi ? "नया बनाएं" : "Customize Surprise"}
            </button>
          </div>

          {/* Customize View */}
          {activeTab === 'customize' && (
            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  {isFrench ? "Nom du Destinataire" : isBengali ? "যার জন্মদিন (নাম)" : isHindi ? "जिसका जन्मदिन है (नाम)" : "Recipient Name"}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sophia, Rahul, Ananya"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                    {isFrench ? "Relation" : isBengali ? "সম্পর্ক" : isHindi ? "रिश्ता" : "Relationship"}
                  </label>
                  <select
                    value={customRel}
                    onChange={(e) => setCustomRel(e.target.value as RelationshipType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a0515] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="partner">Partner / Love 💖</option>
                    <option value="friend">Best Friend / Bestie 🎉</option>
                    <option value="brother">Brother 🤜🤛</option>
                    <option value="sister">Sister 🌸</option>
                    <option value="mother">Mother 💐</option>
                    <option value="father">Father 👑</option>
                    <option value="daughter">Daughter 🌟</option>
                    <option value="son">Son 🚀</option>
                    <option value="family">Family Warmth 🏡</option>
                    <option value="mentor">Mentor / Guide 🏆</option>
                    <option value="colleague">Colleague 💼</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                    {isFrench ? "Langue" : isBengali ? "ভাষা" : isHindi ? "भाषा" : "Language"}
                  </label>
                  <select
                    value={customLang}
                    onChange={(e) => setCustomLang(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1a0515] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="en">English (Global)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="fr">Français (French)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  {isFrench ? "Votre Nom (Expéditeur)" : isBengali ? "আপনার নাম (শুভেচ্ছক)" : isHindi ? "आपका नाम (शुभचिंतक)" : "Your Name (Optional)"}
                </label>
                <input
                  type="text"
                  value={customSender}
                  onChange={(e) => setCustomSender(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

          {/* Share Channels Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-6">
            <button
              type="button"
              onClick={shareToWhatsApp}
              aria-label="Share via WhatsApp"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-1">💬</span>
              <span className="text-[11px] font-semibold">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={shareToTwitter}
              aria-label="Share via X / Twitter"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition-all hover:scale-105"
            >
              <Twitter size={22} className="mb-1" />
              <span className="text-[11px] font-semibold">X / Twitter</span>
            </button>

            <button
              type="button"
              onClick={shareToTelegram}
              aria-label="Share via Telegram"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-all hover:scale-105"
            >
              <Send size={22} className="mb-1" />
              <span className="text-[11px] font-semibold">Telegram</span>
            </button>

            <button
              type="button"
              onClick={shareToFacebook}
              aria-label="Share via Facebook"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 transition-all hover:scale-105"
            >
              <Facebook size={22} className="mb-1" />
              <span className="text-[11px] font-semibold">Facebook</span>
            </button>

            <button
              type="button"
              onClick={shareToLinkedIn}
              aria-label="Share via LinkedIn"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 transition-all hover:scale-105"
            >
              <Linkedin size={22} className="mb-1" />
              <span className="text-[11px] font-semibold">LinkedIn</span>
            </button>
          </div>

          {/* Copy Link Bar */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 mb-4">
            <input
              type="text"
              readOnly
              aria-label="Celebration Share URL"
              value={activeShareUrl}
              className="flex-1 bg-transparent px-3 text-xs text-white/80 select-all outline-none truncate font-mono"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy share link"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Native Web Share Button (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              {isFrench ? "Partager via les Applications" : isBengali ? "অন্যান্য অ্যাপে শেয়ার করুন" : isHindi ? "अन्य ऐप्स में शेयर करें" : "More Sharing Options"}
            </button>
          )}

          {/* Footer Branding */}
          <div className="mt-6 text-center text-[10px] text-white/40 tracking-wider uppercase flex items-center justify-center gap-1.5">
            <Heart size={10} className="text-primary fill-primary" />
            <span>Birthday Bloom • Crafted with Love</span>
            <Globe size={10} className="text-white/40" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
