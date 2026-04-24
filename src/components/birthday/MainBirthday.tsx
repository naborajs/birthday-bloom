import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { PhotoGallery } from "./PhotoGallery";
import { HeartProgression } from "./HeartProgression";
import { TypeWriter } from "./TypeWriter";
import { useSoundManager } from "./SoundManager";
import { CakeCutting } from "./CakeCutting";
import { HeartTree } from "./HeartTree";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

export const MainBirthday = () => {
  const [visible, setVisible] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [cakeClicks, setCakeClicks] = useState(0);
  const [megaSurprise, setMegaSurprise] = useState(false);
  
  const { fireConfetti, fireCannon, fireStars } = useConfetti();
  const { playReveal, playPop, playBoom, playWhoosh, setBgVolume } = useSoundManager();

  // Dynamic Store
  const { config, getMood } = useBirthdayStore();
  const { name, age, customMessage, relationship, favoriteColor } = config;
  const mood = getMood();
  const primaryColor = favoriteColor || '#FF6B6B';

  // Magnetic Effect for Buttons
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 25;
    const moveY = (clientY - window.innerHeight / 2) / 25;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  useEffect(() => {
    setBgVolume(0.4);
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => { setHeroRevealed(true); playBoom(); }, 600);
    setTimeout(() => { setShowName(true); playReveal(); }, 1200);
    setTimeout(() => setShowEmojis(true), 1800);
    setTimeout(() => { fireCannon(); playBoom(); }, 2000);
  }, [playReveal, playBoom, setBgVolume, fireCannon]);

  const addEmoji = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    playPop();
    const emojiList = relationship === 'friend' ? ["🎉", "😎", "🍻", "🍕", "⭐", "🔥", "🎈", "🥳"] : ["🎉", "🥳", "💖", "⭐", "🎈", "🎊", "🎁", "🎂", "✨", "💫"];
    const newEmoji = {
      id: Date.now(),
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: 20 + Math.random() * 60,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id)), 2000);
  };

  const handleCakeClick = () => {
    addEmoji();
    const newCount = cakeClicks + 1;
    setCakeClicks(newCount);
    
    // Easter Egg: Mega Surprise
    if (newCount === 7) {
      setMegaSurprise(true);
      playBoom();
      playReveal();
      fireCannon();
      fireStars();
      fireConfetti({ particleCount: 500, spread: 200 });
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
      setTimeout(() => setMegaSurprise(false), 3000);
      setCakeClicks(0);
    }
  };

  const dynamicWishes = relationship === 'partner' ? [
    { emoji: "💖", wish: "To a lifetime of beautiful moments together!" },
    { emoji: "✨", wish: "You are the best thing that ever happened to me." },
    { emoji: "🌹", wish: "My love for you grows stronger every single day." },
    { emoji: "🥂", wish: "Here's to us, and to your amazing year ahead!" }
  ] : relationship === 'friend' ? [
    { emoji: "😎", wish: "Stay awesome and never change!" },
    { emoji: "🍻", wish: "To more crazy nights and epic memories!" },
    { emoji: "🚀", wish: "May you crush all your goals this year!" },
    { emoji: "🔥", wish: "Keep shining, you absolute legend!" }
  ] : [
    { emoji: "🌟", wish: "May your dreams take flight and reach the stars!" },
    { emoji: "💖", wish: "Wishing you a year filled with love and happiness!" },
    { emoji: "🎁", wish: "May life surprise you with the most wonderful gifts!" },
    { emoji: "🌈", wish: "Here's to colorful days and magical moments ahead!" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} ${megaSurprise ? "animate-screen-shake" : ""}`}
      style={{ background: 'transparent' }}
    >
      <Balloons count={15} />
      <Sparkles count={15} />

      {/* Mega Surprise Overlay */}
      {megaSurprise && (
        <div className="fixed inset-0 z-[100] bg-white/20 backdrop-blur-sm pointer-events-none animate-flash flex items-center justify-center">
          <h1 className="text-6xl md:text-9xl font-black text-white drop-shadow-2xl animate-bounce">MEGA SURPRISE! 🎊</h1>
        </div>
      )}

      <AnimatePresence>
        {emojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 100, x: `${e.x}%` }}
            animate={{ opacity: 1, y: -600, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="fixed z-50 text-5xl pointer-events-none"
          >
            {e.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
      >
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="w-[150%] h-[150%] bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_70%)] opacity-[0.05]" />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 relative z-10">
          <div className="flex justify-center mb-8"><HeartProgression stage={4} /></div>
          <motion.div 
            whileHover={{ scale: 1.2, rotate: relationship === 'friend' ? [0, -10, 10, 0] : [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            className="text-8xl md:text-[10rem] mb-6 cursor-pointer drop-shadow-[0_0_50px_var(--color-primary)]" 
            onClick={handleCakeClick}
          >
            🎂
          </motion.div>
          {cakeClicks > 0 && cakeClicks < 7 && (
            <p className="text-primary font-bold animate-pulse">Click 🎂 {7 - cakeClicks} more times!</p>
          )}
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-8xl lg:text-9xl font-black mb-4">
          <span className="bg-gradient-to-r from-[var(--color-primary)] via-[hsl(45,100%,75%)] to-[hsl(200,80%,70%)] bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)]">
            {age ? `Happy ${age}th Birthday` : "Happy Birthday"}
          </span>
        </motion.h1>

        <motion.h2 variants={itemVariants} className="font-display text-7xl md:text-[10rem] lg:text-[13rem] font-black text-foreground animate-glow-pulse mb-10">
          <TypeWriter text={`${name}!`} speed={120} delay={1500} cursor={false} />
        </motion.h2>

        <motion.div variants={itemVariants} className="text-5xl md:text-7xl space-x-4">
          <span>🎈</span><span>🎉</span><span>🎊</span><span>🎁</span><span>🥳</span>
        </motion.div>
      </motion.section>

      {/* Components */}
      <CakeCutting />
      <PhotoGallery />

      {/* Message Card */}
      <section className="relative z-20 flex justify-center px-4 pb-32 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl w-full p-12 md:p-20 backdrop-blur-3xl border relative overflow-hidden"
          style={{
            background: `linear-gradient(165deg, rgba(30,30,30,0.9), rgba(10,10,10,0.98))`,
            borderColor: `${primaryColor}40`,
            boxShadow: `0 30px 100px -30px ${primaryColor}30`,
            borderRadius: 'var(--card-radius, 2rem)',
          }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">✨</div>
          <div className="text-7xl text-center mb-10 animate-bounce">💌</div>
          <h3 className="font-display text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {relationship === 'partner' ? "From My Heart" : relationship === 'friend' ? "Legendary Message" : "A Special Message"}
          </h3>
          <div className="space-y-10 text-center text-2xl md:text-3xl text-foreground/90 leading-relaxed">
            <p className="font-display font-black text-3xl md:text-5xl" style={{ color: primaryColor }}>Dear {name},</p>
            {customMessage ? (
              <p className="italic font-light text-3xl md:text-5xl leading-tight">"{customMessage}"</p>
            ) : (
              <div className="space-y-8">
                <p>{mood === 'romantic' ? "My world is infinitely brighter because you are in it. Today is a celebration of the most beautiful soul I know." : mood === 'energetic' ? "You're not just older, you're better. A true legend deserves an epic day!" : "Today is a day of joy and gratitude as we celebrate you. You bring so much light into our lives."}</p>
                <p className="text-xl md:text-2xl text-foreground/60">May this new chapter be your best one yet. ✨</p>
              </div>
            )}
            <div className="pt-12">
              <p className="text-4xl md:text-7xl font-display font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-shift">Happy Birthday! 🎉</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Wishes */}
      <section className="relative z-20 px-4 pb-32">
        <h3 className="font-display text-5xl md:text-8xl font-black text-center mb-20 drop-shadow-xl" style={{ color: primaryColor }}>Wishes for You ✨</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {dynamicWishes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -15, scale: 1.03, boxShadow: `0 20px 50px -10px ${primaryColor}20` }}
              className="p-10 backdrop-blur-2xl border cursor-pointer group bg-white/5 border-white/10"
              style={{ borderRadius: 'var(--card-radius, 2rem)' }}
              onClick={addEmoji}
            >
              <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform">{item.emoji}</div>
              <p className="text-foreground/95 text-2xl md:text-3xl font-semibold leading-relaxed">{item.wish}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Magnetic Buttons Section */}
      <section className="relative z-20 flex flex-wrap justify-center gap-8 px-4 pb-32">
        {[
          { label: "🎊 Cannon!", color: primaryColor, action: fireCannon },
          { label: "🎈 Party!", color: "hsl(45, 100%, 50%)", action: fireConfetti },
          { label: "💫 Love!", color: "hsl(200, 80%, 50%)", action: () => { for (let i = 0; i < 5; i++) setTimeout(addEmoji, i * 200); } }
        ].map((btn, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.15, rotate: i % 2 === 0 ? 3 : -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { btn.action(); addEmoji(); }}
            className="px-12 py-6 rounded-full text-2xl font-black text-white shadow-2xl transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${btn.color}, ${btn.color}dd)`,
              boxShadow: `0 15px 45px -10px ${btn.color}60` 
            }}
          >
            {btn.label}
          </motion.button>
        ))}
      </section>

      <HeartTree delay={500} />

      <footer className="relative z-20 text-center py-32 bg-gradient-to-t from-black to-transparent">
        <motion.p className="text-3xl md:text-5xl font-light">Made with ❤️ for <span className="font-display font-black text-foreground" style={{ color: primaryColor }}>{name}</span></motion.p>
        <div className="text-6xl mt-12 space-x-6">
          {["🎂", "🎈", "💖", "🎈", "🎂"].map((emoji, i) => (
            <motion.span key={i} animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }} className="inline-block">{emoji}</motion.span>
          ))}
        </div>
      </footer>
    </div>
  );
};
