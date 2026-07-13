import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { PhotoGallery } from "./PhotoGallery";
import { HeartProgression } from "./HeartProgression";
import { TypeWriter } from "./TypeWriter";
import { useSoundManager } from "./SoundManager";
import { CakeCutting } from "./CakeCutting";
import { HeartTree } from "./HeartTree";
import { FireflyEffect } from "./FireflyEffect";
import { FloatingOrbs } from "./FloatingOrbs";
import { ShootingStars } from "./ShootingStars";
import { BirthdayQuiz } from "./BirthdayQuiz";
import { FinalSurprise } from "./FinalSurprise";
import { GlitchEffect } from "./GlitchEffect";
import { VideoGallery } from "./VideoGallery";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { getHighlySpecificLetter, getBigWishes } from "@/features/core/store/SuperPersonalizedLogic";
import { Car, Music, Code, Palmtree, Camera, Pizza, Dumbbell, Rocket, Heart, Trophy, Star, LucideIcon } from "lucide-react";
const interestIcons: Record<string, LucideIcon> = {
    car: Car,
    music: Music,
    coding: Code,
    nature: Palmtree,
    travel: Camera,
    food: Pizza,
    sport: Dumbbell,
    space: Rocket,
};
export const MainBirthday = () => {
    const [visible, setVisible] = useState(false);
    const [heroRevealed, setHeroRevealed] = useState(false);
    const [showName, setShowName] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [emojis, setEmojis] = useState<{
        id: number;
        emoji: string;
        x: number;
    }[]>([]);
    const [cakeClicks, setCakeClicks] = useState(0);
    const [megaSurprise, setMegaSurprise] = useState(false);
    const [giftStage, setGiftStage] = useState<'closed' | 'party' | 'open'>('closed');
    const giftTimerRef = useRef<number | null>(null);
    const { fireConfetti, fireCannon, fireStars } = useConfetti();
    const { playReveal, playPop, playBoom, playWhoosh, setBgVolume } = useSoundManager();
    const { config, getMood } = useBirthdayStore();
    const { name, age, customMessage, relationship, favoriteColor, gender, senderName } = config;
    const isMobile = useIsMobile();
    const reduceMotion = useReducedMotion();
    const shouldAnimate = !isMobile && !reduceMotion;
    const mood = getMood();
    const letterSignoff = senderName ? `\n\nWith love,\n${senderName}` : '';
    const primaryColor = favoriteColor || '#FF6B6B';
    const bigWishes = useMemo(() => getBigWishes(name, relationship, gender, config.interests || []), [name, relationship, gender, config.interests]);
    const specialCode = useMemo(() => {
        const template = relationship === 'partner' ? 'LOVE' : relationship === 'friend' ? 'LEGEND' : 'HOME';
        const interestMap = [
            { key: 'car', code: 'RIDE' },
            { key: 'music', code: 'BEATS' },
            { key: 'coding', code: 'CODE' },
            { key: 'travel', code: 'TRIP' },
            { key: 'food', code: 'FEAST' },
            { key: 'art', code: 'ART' },
            { key: 'space', code: 'STAR' },
            { key: 'nature', code: 'BLOOM' },
        ];
        const matchedInterest = config.interests?.map((interest) => interest.toLowerCase().trim()).find((interest) => interestMap.some((item) => interest.includes(item.key)));
        const interestTag = matchedInterest
            ? interestMap.find((item) => matchedInterest.includes(item.key))?.code
            : 'SPARK';
        return `${template}-${interestTag}-${String(new Date().getFullYear()).slice(-2)}`;
    }, [relationship, config.interests]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
    const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!shouldAnimate)
            return;
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) / 25;
        const moveY = (clientY - window.innerHeight / 2) / 25;
        mouseX.set(moveX);
        mouseY.set(moveY);
    };
    const openGift = () => {
        if (giftStage !== 'closed')
            return;
        setGiftStage('party');
        playBoom();
        fireConfetti();
        fireStars();
        if (giftTimerRef.current)
            window.clearTimeout(giftTimerRef.current);
        giftTimerRef.current = window.setTimeout(() => {
            setGiftStage('open');
            giftTimerRef.current = null;
        }, 2000);
    };
    useEffect(() => {
        return () => {
            if (giftTimerRef.current)
                window.clearTimeout(giftTimerRef.current);
        };
    }, []);
    useEffect(() => {
        setBgVolume(0.4);
        setTimeout(() => setVisible(true), 100);
        setTimeout(() => { setHeroRevealed(true); playBoom(); }, 600);
        setTimeout(() => { setShowName(true); playReveal(); }, 1200);
        setTimeout(() => setShowEmojis(true), 1800);
        setTimeout(() => { fireCannon(); playBoom(); }, 2000);
    }, [playReveal, playBoom, setBgVolume, fireCannon]);
    const addEmoji = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate)
            navigator.vibrate(50);
        playPop();
        let emojiList = relationship === 'partner'
            ? ["💖", "💕", "💍", "💘", "💋", "🌹", "✨", "💫"]
            : relationship === 'friend'
                ? ["🎉", "😎", "🍻", "🍕", "⭐", "🔥", "🎈", "🥳"]
                : ["🎉", "🥳", "💖", "⭐", "🎈", "🎊", "🎁", "🎂", "✨", "💫"];
        const interestEmojis: Record<string, string[]> = {
            car: ["🚗", "🏎️", "🏎", "🏎️", "⚙️", "🏁"],
            music: ["🎵", "🎶", "🎸", "🎹", "🎧", "🎤"],
            art: ["🎨", "🖌️", "🖼️", "✨", "🌈"],
            coding: ["💻", "⌨️", "🚀", "⚡", "👾"],
            nature: ["🌿", "🌸", "🦋", "🍄", "🌙", "⭐"],
            travel: ["✈️", "🗺️", "🏔️", "🏝️", "🗼", "🗽"],
            food: ["🍕", "🍔", "🍣", "🍦", "🍩", "🧁"],
            sport: ["⚽", "🏀", "🎾", "⛳", "🏆", "🏃"],
            space: ["🚀", "🪐", "🛸", "☄️", "🌌", "👽"]
        };
        if (config.favoriteEmojis.length > 0) {
            emojiList = [...emojiList, ...config.favoriteEmojis];
        }
        if (config.interests && config.interests.length > 0) {
            config.interests.forEach(interest => {
                const lowerInterest = interest.toLowerCase().trim();
                if (interestEmojis[lowerInterest]) {
                    emojiList = [...emojiList, ...interestEmojis[lowerInterest]];
                }
            });
        }
        const newEmoji = {
            id: Date.now(),
            emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
            x: 20 + Math.random() * 60,
        };
        setEmojis((prev) => [...prev, newEmoji]);
        setTimeout(() => setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id)), 2000);
    };
    const scrollToCake = () => {
        const element = document.getElementById('cake-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const handleCakeClick = () => {
        addEmoji();
        const newCount = cakeClicks + 1;
        setCakeClicks(newCount);
        if (newCount === 7) {
            setMegaSurprise(true);
            playBoom();
            playReveal();
            fireCannon();
            fireStars();
            fireConfetti({ particleCount: isMobile ? 120 : 500, spread: isMobile ? 140 : 200 });
            if (typeof navigator !== 'undefined' && navigator.vibrate)
                navigator.vibrate([100, 50, 100, 50, 300]);
            setTimeout(() => setMegaSurprise(false), 3000);
            setCakeClicks(0);
        }
    };
    const activeInterests = useMemo(() => {
        return (config.interests || []).map(i => i.toLowerCase().trim()).filter(i => interestIcons[i]);
    }, [config.interests]);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
    };
    const itemVariants = {
        hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
        visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
    };
    const heroMotionStyle = shouldAnimate ? { x: springX, y: springY } : { x: 0, y: 0 };
    const sparkleCount = isMobile ? 8 : 15;
    const balloonCount = isMobile ? 7 : 15;
    return (<div onMouseMove={shouldAnimate ? handleMouseMove : undefined} className={`min-h-screen transition-opacity duration-1000 w-full max-w-[100vw] overflow-x-hidden ${visible ? "opacity-100" : "opacity-0"} ${megaSurprise ? "animate-screen-shake" : ""}`} style={{ background: 'transparent' }}>
      <Balloons count={balloonCount}/>
      <Sparkles count={sparkleCount}/>

      
      {megaSurprise && (<div className="fixed inset-0 z-[100] bg-white/20 backdrop-blur-sm pointer-events-none animate-flash flex items-center justify-center">
          <h1 className="text-6xl md:text-9xl font-black text-white drop-shadow-2xl animate-bounce">MEGA SURPRISE! 🎊</h1>
        </div>)}

      <AnimatePresence>
        {emojis.map((e) => (<motion.div key={e.id} initial={{ opacity: 0, y: 100, x: `${e.x}%` }} animate={{ opacity: 1, y: -600, rotate: 360 }} exit={{ opacity: 0 }} transition={{ duration: 2.5, ease: "easeOut" }} className="fixed z-50 text-5xl pointer-events-none">
            {e.emoji}
          </motion.div>))}
      </AnimatePresence>

      
      <motion.section variants={containerVariants} initial="hidden" animate={visible ? "visible" : "hidden"} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <motion.div style={{ x: springX, y: springY }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[150%] h-[150%] bg-[radial-gradient(circle,var(--color-primary)_0%,transparent_70%)] opacity-[0.05]"/>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 relative z-10">
          <div className="flex justify-center mb-8"><HeartProgression stage={4}/></div>
          <motion.div whileHover={shouldAnimate ? { scale: 1.2, rotate: relationship === 'friend' ? [0, -10, 10, 0] : [0, -5, 5, 0] } : undefined} whileTap={{ scale: 0.9 }} className="text-8xl md:text-[10rem] mb-6 cursor-pointer drop-shadow-[0_0_50px_var(--color-primary)]" onClick={handleCakeClick}>
            🎂
          </motion.div>
          {cakeClicks > 0 && cakeClicks < 7 && (<p className="text-primary font-bold animate-pulse">Click 🎂 {7 - cakeClicks} more times!</p>)}
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-display text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black mb-4 break-words leading-tight px-2">
          <span className="bg-gradient-to-r from-[var(--color-primary)] via-[hsl(45,100%,75%)] to-[hsl(200,80%,70%)] bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)]">
            {age ? `Happy ${age}th Birthday` : "Happy Birthday"}
          </span>
        </motion.h1>

        <motion.h2 variants={itemVariants} className="font-display text-5xl sm:text-7xl md:text-[10rem] lg:text-[13rem] font-black text-foreground animate-glow-pulse mb-10 break-words leading-none px-2">
          <TypeWriter text={`${name}!`} speed={120} delay={1500} cursor={false}/>
        </motion.h2>

        
      </motion.section>

      
      

      {config.showPhotoSection && <PhotoGallery />}

      
      <section className="relative z-20 flex justify-center px-4 pb-32 pt-16">
        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl w-full p-8 md:p-20 backdrop-blur-3xl border relative overflow-hidden" style={{
            background: `linear-gradient(165deg, rgba(30,30,30,0.9), rgba(10,10,10,0.98))`,
            borderColor: `${primaryColor}40`,
            boxShadow: `0 30px 100px -30px ${primaryColor}30`,
            borderRadius: 'var(--card-radius, 2rem)',
        }}>
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">✨</div>
          <div className="text-7xl text-center mb-10 animate-bounce">💌</div>
          <h3 className="font-display text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {relationship === 'partner' ? "From My Heart" : relationship === 'friend' ? "Legendary Message" : "A Special Message"}
          </h3>
          <div className="space-y-10 text-center text-2xl md:text-3xl text-foreground/90 leading-relaxed">
            <p className="font-display font-black text-3xl md:text-5xl" style={{ color: primaryColor }}>Dear {name},</p>
            {customMessage ? (<p className="italic font-light text-3xl md:text-5xl leading-tight">"{customMessage}"</p>) : (<div className="space-y-8">
                <p>{mood === 'romantic' ? "My world is infinitely brighter because you are in it. Today is a celebration of the most beautiful soul I know." : mood === 'energetic' ? "You're not just older, you're better. A true legend deserves an epic day!" : "Today is a day of joy and gratitude as we celebrate you. You bring so much light into our lives."}</p>
                <p className="text-xl md:text-2xl text-foreground/60">May this new chapter be your best one yet. ✨</p>
              </div>)}
            
            <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.02]">
              <h4 className="font-display text-2xl md:text-4xl font-black mb-6 text-primary cursor-pointer" onDoubleClick={() => { fireCannon(); playBoom(); }} title="Double tap for a surprise!">
                {config.letterTitle || "A Special Letter Just for You 💌"}
              </h4>
              <div className="text-left text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                {config.letterOverride
            ? `${config.letterOverride}${letterSignoff}`
            : `${getHighlySpecificLetter(name, relationship, gender, config.interests)}${letterSignoff}`}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      
      {config.interests?.some(i => i.toLowerCase().includes('car')) && (<div className="relative h-20 w-full overflow-hidden opacity-30 pointer-events-none mb-10">
          <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="flex items-center gap-4 text-primary">
            <Car size={40}/>
            <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-primary to-transparent"/>
            <Trophy size={30}/>
          </motion.div>
          <motion.div animate={{ x: ["-150%", "250%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }} className="flex items-center gap-4 text-secondary mt-4">
            <Car size={32}/>
            <div className="h-[1px] w-60 bg-gradient-to-r from-transparent via-secondary to-transparent"/>
          </motion.div>
        </div>)}

      {config.showQuizSection && <BirthdayQuiz />}

      
      <section className="relative z-20 px-4 pb-32">
        <h3 className="font-display text-5xl md:text-8xl font-black text-center mb-20 drop-shadow-xl" style={{ color: primaryColor }}>Wishes for You ✨</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {bigWishes.map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={!isMobile ? { y: -15, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1, boxShadow: `0 30px 60px -15px ${primaryColor}40` } : undefined} className="p-10 backdrop-blur-3xl border cursor-pointer group bg-gradient-to-br from-white/10 to-transparent border-white/10" style={{ borderRadius: 'var(--card-radius, 2.5rem)' }} onClick={addEmoji}>
              <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">{item.emoji}</div>
              <p className="text-foreground/95 text-2xl md:text-4xl font-black leading-tight tracking-tight">{item.wish}</p>
              <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {[1, 2, 3].map(j => <Star key={j} size={16} className="text-primary fill-primary"/>)}
              </div>
            </motion.div>))}
        </div>
      </section>

      {config.showGiftSection && <section className="relative z-20 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.button type="button" onClick={openGift} whileHover={shouldAnimate ? { scale: 1.02 } : undefined} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }} className="w-full rounded-[3rem] border border-white/10 bg-gradient-to-r from-primary/15 to-transparent p-8 text-left shadow-2xl backdrop-blur-3xl hover:border-primary/40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-2xl md:text-3xl font-display font-black text-white">🎁 Hidden Gift Code</p>
                <p className="mt-3 text-sm md:text-base text-foreground/70 max-w-2xl leading-relaxed">
                  The party starts first, the crowd is hyped, and only then does the gift reveal open. Tap now to trigger the tease, light the dance floor, and keep the surprise waiting for its perfect moment.
                </p>
              </div>
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-4xl text-white shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
                🎁
              </div>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/75">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">✨</span>
              Your code: <span className="font-semibold text-primary">{specialCode}</span>
            </div>
          </motion.button>
        </div>
      </section>}

      <AnimatePresence>
        {giftStage !== 'closed' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6" onClick={() => setGiftStage('closed')}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.35 }} className="relative w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-black/90 p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] max-h-[calc(100vh-4rem)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {giftStage === 'party' ? (<div className="flex flex-col gap-6 text-center min-h-[42vh] justify-center">
                  <div className="text-6xl">🎂🎉✨</div>
                  <h3 className="text-4xl md:text-6xl font-black text-white">The party is teasing the surprise!</h3>
                  <p className="text-lg md:text-xl text-white/85 max-w-xl mx-auto leading-relaxed">
                    The crowd is cheering, the lights are flashing, and the celebration message is made to stay visible on every screen. Watch the party tease before the gift reveal arrives.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    {[
                    { icon: '🎶', label: 'Music builds' },
                    { icon: '🔥', label: 'Crowd hype' },
                    { icon: '✨', label: 'Gift tease' }
                ].map((item) => (<div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                        <span className="mr-2">{item.icon}</span>{item.label}
                      </div>))}
                  </div>
                  <div className="mx-auto inline-flex rounded-full bg-white/10 px-6 py-4 text-2xl font-semibold text-white shadow-[0_20px_60px_-30px_rgba(255,255,255,0.4)]">
                    Pataka mood activated.
                  </div>
                </div>) : (<div className="flex flex-col gap-6 text-center">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-4xl md:text-6xl font-black text-white">Surprise Unlocked!</h3>
                  <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
                    First the party sparkled, then the gift arrived. Your secret code is built from your relationship theme, your favorite interests, and a little playful mischief.
                  </p>
                  <div className="mx-auto inline-flex rounded-full bg-primary/10 px-6 py-4 text-2xl font-semibold text-primary shadow-[0_20px_60px_-30px_rgba(255,255,255,0.4)]">
                    {specialCode}
                  </div>
                  <button type="button" onClick={() => { setGiftStage('closed'); fireConfetti(); }} className="mx-auto rounded-full bg-primary px-10 py-4 text-xl font-black text-black transition-all hover:scale-105">
                    Close Gift
                  </button>
                </div>)}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent"/>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>

      
      <section className="relative z-20 flex flex-wrap justify-center gap-8 px-4 pb-32">
        {[
            { label: "🎊 Cannon!", color: primaryColor, action: fireCannon },
            { label: "🎈 Party!", color: "hsl(45, 100%, 50%)", action: fireConfetti },
            { label: "💫 Love!", color: "hsl(200, 80%, 50%)", action: () => { for (let i = 0; i < 5; i++)
                    setTimeout(addEmoji, i * 200); } }
        ].map((btn, i) => (<motion.button key={i} whileHover={shouldAnimate ? { scale: 1.15, rotate: i % 2 === 0 ? 3 : -3 } : undefined} whileTap={{ scale: 0.9 }} onClick={() => { btn.action(); addEmoji(); }} className="px-12 py-6 rounded-full text-2xl font-black text-white shadow-2xl transition-all" style={{
                background: `linear-gradient(135deg, ${btn.color}, ${btn.color}dd)`,
                boxShadow: `0 15px 45px -10px ${btn.color}60`
            }}>
            {btn.label}
          </motion.button>))}
      </section>

      {config.showHeartTreeSection && <HeartTree delay={500}/>}
      
      {config.showVideoSection && <VideoGallery />}

      
      {config.showCakeSection && (<section id="cake-section" className="relative z-20 px-4 pb-16 sm:pb-32">
        <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="text-center">
          <h3 className="font-display text-4xl sm:text-6xl md:text-7xl font-black mb-8 sm:mb-12 drop-shadow-xl" style={{ color: primaryColor }}>
            Time to Cut the Cake! 🎂
          </h3>
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 mb-10 sm:mb-12 max-w-2xl mx-auto">
            Ready for the sweetest moment? Let's make some magic happen! ✨
          </p>
          <motion.button whileHover={shouldAnimate ? { scale: 1.05 } : undefined} whileTap={{ scale: 0.95 }} onClick={() => { addEmoji(); scrollToCake(); }} className="px-10 py-5 sm:px-12 sm:py-6 rounded-full text-xl sm:text-2xl font-black text-white shadow-2xl mb-12 sm:mb-20" style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 15px 45px -10px ${primaryColor}60`
            }}>
            🎂 Start Cake Cutting
          </motion.button>
          <CakeCutting />
        </motion.div>
      </section>)}

      {config.showFinalSurprise && <FinalSurprise />}

      <footer className="relative z-20 text-center py-20 bg-black/40 w-full">
        <p className="mt-4 text-white/10 text-[10px] tracking-[0.5em] uppercase">
          Crafted by NABORAJ SARKAR — Cinematic Engine v2.5
        </p>
      </footer>
    </div>);
};
