import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, MessageSquareHeart, Sparkles, Plus, Check } from 'lucide-react';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';
import { useTranslation } from '@/i18n';
import { useConfetti } from '@/components/birthday/Confetti';
import { useSoundManager } from '@/components/birthday/SoundManager';
import { useAdaptivePerformance } from '@/hooks/useAdaptivePerformance';

export interface GuestbookWish {
  id: string;
  name: string;
  message: string;
  role: 'partner' | 'friend' | 'family' | 'wellWisher' | 'colleague';
  emoji: string;
  colorScheme: 'rose' | 'amber' | 'lavender' | 'emerald' | 'sky';
  likes: number;
  timestamp: string;
  isCustom?: boolean;
}

const STORAGE_KEY = 'birthday_bloom_guestbook_wishes';

const COLOR_MAP = {
  rose: {
    bg: 'from-pink-500/10 via-rose-500/5 to-transparent',
    border: 'border-pink-500/25 hover:border-pink-500/40',
    badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    heart: 'text-pink-400 fill-pink-400',
    accent: '#ec4899',
  },
  amber: {
    bg: 'from-amber-500/10 via-orange-500/5 to-transparent',
    border: 'border-amber-500/25 hover:border-amber-500/40',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    heart: 'text-amber-400 fill-amber-400',
    accent: '#f59e0b',
  },
  lavender: {
    bg: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    border: 'border-purple-500/25 hover:border-purple-500/40',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    heart: 'text-purple-400 fill-purple-400',
    accent: '#a855f7',
  },
  emerald: {
    bg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    border: 'border-emerald-500/25 hover:border-emerald-500/40',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    heart: 'text-emerald-400 fill-emerald-400',
    accent: '#10b981',
  },
  sky: {
    bg: 'from-sky-500/10 via-blue-500/5 to-transparent',
    border: 'border-sky-500/25 hover:border-sky-500/40',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    heart: 'text-sky-400 fill-sky-400',
    accent: '#0ea5e9',
  },
};

const AVAILABLE_EMOJIS = ['❤️', '✨', '🌸', '🎂', '🌟', '🕊️', '💌', '🎉'];

export const GuestbookSection: React.FC = () => {
  const { config } = useBirthdayStore();
  const { t, isBengali, isHindi, isFrench } = useTranslation();
  const { fireConfetti, fireStars } = useConfetti();
  const perfProfile = useAdaptivePerformance();
  const isMobile = perfProfile.isMobile;
  const isLowPowerMode = perfProfile.tier === 'low';

  const [wishes, setWishes] = useState<GuestbookWish[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formRole, setFormRole] = useState<GuestbookWish['role']>('friend');
  const [formEmoji, setFormEmoji] = useState('❤️');
  const [formColor, setFormColor] = useState<GuestbookWish['colorScheme']>('rose');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Template-aware emotional starter messages
  const defaultSeeds: GuestbookWish[] = useMemo(() => {
    const rel = config.relationship || 'friend';
    const recipient = config.name || 'Dear';

    if (rel === 'partner') {
      return [
        {
          id: 'seed-partner-1',
          name: config.senderName || (isFrench ? "Ton âme sœur" : isBengali ? "তোমার ভালোবাসার মানুষ" : isHindi ? "तुम्हारा हमसफ़र" : "Your Soulmate"),
          message: t('guestbook.defaultWishes.partner') || `Happy Birthday my forever love! You make every single moment brighter, softer, and filled with wonder.`,
          role: 'partner',
          emoji: '💖',
          colorScheme: 'rose',
          likes: 12,
          timestamp: 'Just now',
        },
        {
          id: 'seed-partner-2',
          name: isFrench ? "Ami pour la vie" : isBengali ? "চিরদিনের বন্ধু" : isHindi ? "सच्चा दोस्त" : "Lifelong Friend",
          message: isFrench ? "Que cette nouvelle année t'apporte autant de lumière que tu en offres au monde." : isBengali ? "তোমার মতো খাঁটি মনের মানুষ পাওয়া সত্যিই ভাগ্যের বিষয়। শুভ জন্মদিন!" : isHindi ? "तुम्हारी यह मुस्कान सदा यूं ही बरकरार रहे। जन्मदिन की ढेरों शुभकामनाएं!" : `Cheers to the brightest soul in the room! May all your heartfelt wishes take flight this year.`,
          role: 'friend',
          emoji: '✨',
          colorScheme: 'amber',
          likes: 8,
          timestamp: 'Today',
        },
        {
          id: 'seed-partner-3',
          name: isFrench ? "La Famille" : isBengali ? "পরিবারের পক্ষ থেকে" : isHindi ? "पूरा परिवार" : "The Family",
          message: t('guestbook.defaultWishes.family') || `May your path ahead be blessed with pure happiness, peace, and endless love.`,
          role: 'family',
          emoji: '🌸',
          colorScheme: 'lavender',
          likes: 15,
          timestamp: 'Today',
        },
      ];
    }

    if (rel === 'mother') {
      return [
        {
          id: 'seed-mother-1',
          name: config.senderName || (isFrench ? "Ton enfant qui t'aime" : isBengali ? "তোমার স্নেহের সন্তান" : isHindi ? "आपका लाडला/लाडली" : "With Endless Gratitude"),
          message: t('guestbook.defaultWishes.mother') || `Happy Birthday Mom! Thank you for your endless love, kindness, and boundless grace.`,
          role: 'family',
          emoji: '🌸',
          colorScheme: 'rose',
          likes: 19,
          timestamp: 'Just now',
        },
        {
          id: 'seed-mother-2',
          name: isFrench ? "La Maison" : isBengali ? "ঘরের সবাই" : isHindi ? "घर-परिवार" : "Home Sweet Home",
          message: isFrench ? "Tu es le cœur et l'âme de notre foyer. Que cette journée soit aussi douce que ton cœur." : isBengali ? "তোমার স্নেহের ছায়ায় আমরা সবাই নিরাপদ ও সুখী। শুভ জন্মদিন মা!" : isHindi ? "माँ, आपकी ममता ही हमारे जीवन का सबसे बड़ा संबल है। जन्मदिन मुबारक!" : `To the warm heart of our home: wishing you gentle days, blooming smiles, and long health.`,
          role: 'family',
          emoji: '🕊️',
          colorScheme: 'emerald',
          likes: 14,
          timestamp: 'Today',
        },
      ];
    }

    if (rel === 'father') {
      return [
        {
          id: 'seed-father-1',
          name: config.senderName || (isFrench ? "Avec tout mon respect" : isBengali ? "শ্রদ্ধা ও ভালোবাসায়" : isHindi ? "आदर और प्यार से" : "Your Proud Child"),
          message: t('guestbook.defaultWishes.father') || `Happy Birthday Dad! Thank you for always being our steady guide, strength, and inspiration.`,
          role: 'family',
          emoji: '🌟',
          colorScheme: 'sky',
          likes: 21,
          timestamp: 'Just now',
        },
        {
          id: 'seed-father-2',
          name: isFrench ? "Toute la famille" : isBengali ? "সবার পক্ষ থেকে" : isHindi ? "सभी की तरफ से" : "From All of Us",
          message: isFrench ? "Merci pour ta sagesse tranquille et ton soutien inconditionnel. Très joyeux anniversaire !" : isBengali ? "আমাদের পথপ্রদর্শক ও জীবনের সেরা আদর্শ তুমি। শুভ জন্মদিন বাবা!" : isHindi ? "आपकी प्रेरणा ही हमारा मार्गदर्शन करती है। जन्मदिन बहुत-बहुत मुबारक पापा!" : `Wishing a very happy birthday to the pillar of strength. May this year bring you proud and joyful moments.`,
          role: 'family',
          emoji: '✨',
          colorScheme: 'amber',
          likes: 16,
          timestamp: 'Today',
        },
      ];
    }

    // Default friendly / universal celebration
    return [
      {
        id: 'seed-general-1',
        name: config.senderName || (isFrench ? "Un(e) ami(e) en or" : isBengali ? "প্রিয় শুভাকাঙ্ক্ষী" : isHindi ? "आपका सच्चा मित्र" : "True Companion"),
        message: t('guestbook.defaultWishes.friend') || `To one of the greatest people in the world — cheers to another year of legendary moments and boundless joy!`,
        role: 'friend',
        emoji: '🎂',
        colorScheme: 'amber',
        likes: 14,
        timestamp: 'Just now',
      },
      {
        id: 'seed-general-2',
        name: isFrench ? "Cercle Proche" : isBengali ? "ভালোবাসার বন্ধুরা" : isHindi ? "यारों की टोली" : "Circle of Love",
        message: t('guestbook.defaultWishes.general') || `Wishing you a bright, joyous, and truly wonderful birthday filled with sweetest surprises!`,
        role: 'wellWisher',
        emoji: '✨',
        colorScheme: 'rose',
        likes: 10,
        timestamp: 'Today',
      },
      {
        id: 'seed-general-3',
        name: isFrench ? "Bénédictions" : isBengali ? "শুভকামনা" : isHindi ? "शुभकामनाएं" : "Warm Blessings",
        message: isFrench ? "Que cette année t'ouvre toutes les portes du bonheur et de la réussite." : isBengali ? "তোমার জীবনের প্রতিটি নতুন দিন নতুন সাফল্য আর হাসিতে ভরে উঠুক।" : isHindi ? "यह नया साल आपके जीवन में सफलता और नई उमंग लेकर आए।" : `May this upcoming chapter bring health, peace, and dreams turned into reality. Happy Birthday ${recipient}!`,
        role: 'family',
        emoji: '🕊️',
        colorScheme: 'emerald',
        likes: 18,
        timestamp: 'Today',
      },
    ];
  }, [config.relationship, config.name, config.senderName, t, isBengali, isHindi, isFrench]);

  // Load wishes from localStorage and merge with seeds
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom user entries with standard defaults
          const customOnly = parsed.filter((p: GuestbookWish) => p.isCustom);
          setWishes([...customOnly, ...defaultSeeds]);
          return;
        }
      }
    } catch {
      // Fallback gracefully
    }
    setWishes(defaultSeeds);
  }, [defaultSeeds]);

  const handleLike = (id: string) => {
    playPop();
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    setWishes((prev) =>
      prev.map((wish) => {
        if (wish.id === id) {
          const delta = likedMap[id] ? -1 : 1;
          return { ...wish, likes: Math.max(0, wish.likes + delta) };
        }
        return wish;
      })
    );
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    const newWish: GuestbookWish = {
      id: `wish-${Date.now()}`,
      name: formName.trim(),
      message: formMessage.trim(),
      role: formRole,
      emoji: formEmoji,
      colorScheme: formColor,
      likes: 1,
      timestamp: 'Just now',
      isCustom: true,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    setLikedMap((prev) => ({ ...prev, [newWish.id]: true }));

    // Persist custom wishes
    try {
      const customs = updated.filter((w) => w.isCustom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
    } catch {
      // Ignore localStorage errors
    }

    setJustSubmitted(true);
    playReveal();
    fireConfetti();
    fireStars();

    setTimeout(() => {
      setFormName('');
      setFormMessage('');
      setIsFormOpen(false);
      setJustSubmitted(false);
    }, 1500);
  };

  const roleLabel = (role: GuestbookWish['role']) => {
    switch (role) {
      case 'partner':
        return t('guestbook.roles.partner') || 'Soulmate';
      case 'friend':
        return t('guestbook.roles.friend') || 'Friend';
      case 'family':
        return t('guestbook.roles.family') || 'Family';
      case 'colleague':
        return t('guestbook.roles.colleague') || 'Colleague';
      default:
        return t('guestbook.roles.wellWisher') || 'Well-Wisher';
    }
  };

  return (
    <section
      id="guestbook-section"
      className="relative z-20 px-4 py-16 sm:py-24 max-w-6xl mx-auto"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 650px',
      }}
    >
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold tracking-wider text-pink-300 uppercase mb-4 shadow-lg backdrop-blur-md"
        >
          <Sparkles size={14} className="animate-spin text-pink-400" />
          <span>{t('guestbook.badge') || 'Live Wishes Board'}</span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight drop-shadow-md">
          {t('guestbook.title') || 'Heartfelt Wishes & Notes'}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
          {t('guestbook.subtitle') ||
            'Leave a warm memory, blessing, or sweet note for the birthday celebration.'}
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <motion.button
            type="button"
            onClick={() => {
              playPop();
              setIsFormOpen((prev) => !prev);
            }}
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-[0_10px_30px_rgba(236,72,153,0.35)] border border-white/20 transition-all hover:shadow-[0_15px_40px_rgba(236,72,153,0.5)]"
          >
            {isFormOpen ? (
              <span>{isFrench ? "Fermer" : isBengali ? "বন্ধ করুন" : isHindi ? "बंद करें" : "Close"}</span>
            ) : (
              <>
                <Plus size={18} />
                <span>{t('guestbook.leaveWish') || 'Leave a Wish'}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Add Wish Form Modal / Accordion */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden mb-12"
          >
            <form
              onSubmit={handleAddWish}
              className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquareHeart className="text-pink-400" size={20} />
                <span>{t('guestbook.leaveWish') || 'Leave a Wish'}</span>
              </h3>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  {isFrench ? "Nom / Surnom" : isBengali ? "আপনার নাম" : isHindi ? "आपका नाम" : "Name / Nickname"}
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={t('guestbook.namePlaceholder') || 'Your Name or Nickname'}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-pink-400 transition-all text-sm"
                />
              </div>

              {/* Connection / Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  {t('guestbook.relationshipLabel') || 'Connection'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['friend', 'family', 'partner', 'wellWisher', 'colleague'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormRole(r)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                        formRole === r
                          ? 'bg-pink-500/25 border-pink-400 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {roleLabel(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  {isFrench ? "Votre message" : isBengali ? "আপনার শুভেচ্ছা বার্তা" : isHindi ? "संदेश" : "Message"}
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={300}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder={
                    t('guestbook.messagePlaceholder') ||
                    'Write your heartfelt birthday wish or cherished memory...'
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-pink-400 transition-all text-sm resize-none"
                />
              </div>

              {/* Sticker Emoji & Color Accent Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <span className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                    {isFrench ? "Sticker" : isBengali ? "স্টিকার" : isHindi ? "स्टीकर" : "Sticker"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {AVAILABLE_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormEmoji(emoji)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-transform ${
                          formEmoji === emoji
                            ? 'scale-125 bg-white/20 ring-2 ring-pink-400'
                            : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                    {isFrench ? "Couleur" : isBengali ? "রং" : isHindi ? "रंग" : "Card Theme"}
                  </span>
                  <div className="flex items-center gap-2">
                    {(['rose', 'amber', 'lavender', 'emerald', 'sky'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        style={{ backgroundColor: COLOR_MAP[c].accent }}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          formColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-60 hover:opacity-100'
                        }`}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={justSubmitted}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {justSubmitted ? (
                  <>
                    <Check size={18} />
                    <span>{t('guestbook.sentSuccess') || 'Added with Love!'}</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{t('guestbook.submit') || 'Send Your Wish'}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.map((wish, index) => {
          const theme = COLOR_MAP[wish.colorScheme] || COLOR_MAP.rose;
          const isLiked = likedMap[wish.id];

          return (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: isLowPowerMode ? 0.2 : 0.4,
                delay: isLowPowerMode ? 0 : Math.min(index * 0.08, 0.4),
              }}
              whileHover={!isMobile ? { y: -4, transition: { duration: 0.2 } } : undefined}
              className={`relative rounded-3xl p-6 border ${theme.border} bg-gradient-to-br ${theme.bg} bg-black/40 backdrop-blur-md shadow-xl flex flex-col justify-between transition-all duration-300`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none" role="img" aria-label="sticker">
                      {wish.emoji}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">
                        {wish.name}
                      </h4>
                      <span className={`inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${theme.badge}`}>
                        {roleLabel(wish.role)}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-white/40">{wish.timestamp}</span>
                </div>

                {/* Message */}
                <p className="text-white/85 text-sm sm:text-base leading-relaxed italic font-serif">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </div>

              {/* Card Footer: Likes Counter */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/50">
                  {wish.likes} {t('guestbook.likeCount') || 'hearts'}
                </span>

                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Send heart reaction"
                >
                  <Heart
                    size={14}
                    className={`transition-transform duration-200 ${
                      isLiked ? theme.heart + ' scale-110' : ''
                    }`}
                  />
                  <span className="text-xs font-semibold">{wish.likes}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
