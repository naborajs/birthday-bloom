import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { KineticText } from "./KineticText";
import { TypeWriter } from "./TypeWriter";
import { FakeChatScene } from "./FakeChatScene";
import { HeartProgression } from "./HeartProgression";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { SpecialMessage } from "@/features/cinematic-story/scenes/SpecialMessage";

interface CinematicIntroProps {
  onComplete: () => void;
}

type Scene = "storytelling" | "fake-chat" | "post-chat" | "reveal-sequence" | "special-message" | "done";
type RevealStep = "dear-name" | "grand-reveal" | "final-message";

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [scene, setScene] = useState<Scene>("storytelling");
  const [storyLine, setStoryLine] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [postChatLine, setPostChatLine] = useState(0);
  const [revealStep, setRevealStep] = useState<RevealStep>("dear-name");
  const [shaking, setShaking] = useState(false);
  const [emojiBursts, setEmojiBursts] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [ringPulse, setRingPulse] = useState(false);
  const [finalLineIndex, setFinalLineIndex] = useState(0);
  const [heartStage, setHeartStage] = useState<1 | 2 | 3 | 4>(2);
  const [flashWhite, setFlashWhite] = useState(false);
  
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { fireConfetti, fireCannon, fireStars } = useConfetti();
  const { playType, playWhoosh, playReveal, playPop, playBoom } = useSoundManager();

  // DYNAMIC CONFIGURATION ENGINE
  const { config, getAnimationPacing } = useBirthdayStore();
  const { name, age, relationship, favoriteColor } = config;
  const pacing = getAnimationPacing();
  const speedMultiplier = pacing === 'fast' ? 0.7 : pacing === 'slow' ? 1.3 : 1;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }, []);

  const spawnEmojiBurst = useCallback(() => {
    const burstEmojis = relationship === 'friend' ? ["🎉", "😎", "🍻", "🍕", "⭐", "🔥", "🎈", "🥳"] : ["✨", "💫", "⭐", "🌟", "💖", "🥂", "🌹"];
    const bursts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      emoji: burstEmojis[Math.floor(Math.random() * burstEmojis.length)],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    }));
    setEmojiBursts(bursts);
    setTimeout(() => setEmojiBursts([]), 2000);
  }, [relationship]);

  const triggerRingPulse = useCallback(() => {
    setRingPulse(true);
    setTimeout(() => setRingPulse(false), 1200);
  }, []);

  const triggerFlash = useCallback(() => {
    setFlashWhite(true);
    setTimeout(() => setFlashWhite(false), 300);
  }, []);

  const storyLines = useMemo(() => relationship === 'partner' ? [
    "There's someone I've been thinking about...",
    "Someone who makes ordinary moments feel extraordinary...",
    "Someone whose smile lights up the darkest days...",
    "I could have sent a simple message..."
  ] : relationship === 'friend' ? [
    "Hey! Guess what day it is?...",
    "Yep, it's about time we celebrate you!",
    "I couldn't just send a boring text...",
    "So I built an entire experience..."
  ] : [
    "Today is a very special day...",
    "Because we are celebrating someone truly wonderful...",
    "Someone who brings so much joy to our lives...",
    "I wanted to do something memorable..."
  ], [relationship]);

  const postChatLines = useMemo(() => relationship === 'friend' ? [
    "Because you're not just any friend...",
    "You deserve something epic...",
    "So let's get this party started! 🎉",
  ] : [
    "But you are not just anyone to me...",
    "You deserve something as special as you are...",
    "So I stayed up, and I made this... just for you ❤️",
  ], [relationship]);

  const finalLines = useMemo(() => relationship === 'partner' ? [
    `My dearest ${name || 'Love'}`,
    "I hope you felt every ounce of love in this...",
    "You mean the world to me ✨",
    "I can't wait for our beautiful future ahead 💖"
  ] : relationship === 'friend' ? [
    `Happy Birthday ${name || 'Bestie'}!`,
    "Hope this put a huge smile on your face!",
    "Let's make this year the craziest one yet 🎉",
    "Stay awesome! 😎"
  ] : [
    `Dear ${name || 'You'}`,
    "We all wanted to wish you the happiest of birthdays...",
    "May this year bring you endless joy ✨",
    "We love you so much! 💖"
  ], [name, relationship]);

  const primaryColor = favoriteColor || '#FF6B6B';

  const storyLineStyles = [
    { className: `${relationship === 'partner' ? 'italic' : ''} text-lg md:text-2xl lg:text-3xl font-light`, style: { color: "hsl(280, 20%, 85%)" } },
    { className: `${relationship === 'friend' ? 'font-black uppercase tracking-tight' : 'font-normal'} text-xl md:text-3xl lg:text-4xl`, style: { color: "hsl(330, 80%, 85%)" } },
    { className: `${relationship === 'partner' ? 'italic' : 'font-semibold'} text-xl md:text-3xl lg:text-[2.5rem]`, style: { color: primaryColor } },
    { className: "text-lg md:text-2xl lg:text-3xl font-light", style: { color: "hsl(200, 90%, 85%)" } },
  ];

  const postChatStyles = [
    { className: `${relationship === 'partner' ? 'italic' : ''} text-2xl md:text-4xl lg:text-5xl font-bold`, style: { color: "hsl(330, 95%, 75%)" } },
    { className: `${relationship === 'friend' ? 'font-black uppercase' : 'font-extrabold'} text-2xl md:text-4xl lg:text-5xl`, style: { color: primaryColor } },
    { className: "text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[hsl(330,90%,70%)] via-[var(--color-primary)] to-[hsl(270,70%,70%)] bg-clip-text text-transparent animate-gradient-shift" },
  ];

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Scene Orchestration
  useEffect(() => {
    clearTimers();

    if (scene === "storytelling") {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
      const lines = age ? [...storyLines.slice(0, -1), `As you celebrate your ${age}th year...`, storyLines[storyLines.length - 1]] : storyLines;
      lines.forEach((_, i) => {
        addTimer(() => { setStoryLine(i); playType(); }, i * 4000 * speedMultiplier);
      });
      addTimer(() => setHeartStage(2), 5000 * speedMultiplier);
      addTimer(() => { 
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
        playWhoosh(); 
        setScene("fake-chat"); 
      }, lines.length * 4000 * speedMultiplier);
    }

    if (scene === "post-chat") {
      setHeartStage(3);
      postChatLines.forEach((_, i) => {
        addTimer(() => { setPostChatLine(i); playType(); }, i * 3500 * speedMultiplier);
      });
      addTimer(() => {
        playReveal();
        fireStars();
        triggerFlash();
        setHeartStage(4);
        setScene("special-message");
      }, postChatLines.length * 3500 * speedMultiplier);
    }

    if (scene === "special-message") {
      addTimer(() => {
        setScene("reveal-sequence");
        setRevealStep("dear-name");
      }, 6000 * speedMultiplier);
    }

    if (scene === "reveal-sequence") {
      addTimer(() => {
        setRevealStep("grand-reveal");
        playBoom();
        fireCannon();
        triggerShake();
        triggerFlash();
        spawnEmojiBurst();
        triggerRingPulse();
      }, 4000 * speedMultiplier);
      
      addTimer(() => { playPop(); fireConfetti({ particleCount: 200, spread: 160 }); triggerShake(); }, 6000 * speedMultiplier);
      addTimer(() => { fireStars(); spawnEmojiBurst(); }, 7500 * speedMultiplier);
      addTimer(() => { playPop(); fireConfetti({ particleCount: 150, spread: 120, origin: { x: 0.3, y: 0.5 } }); triggerRingPulse(); }, 9000 * speedMultiplier);
      
      addTimer(() => { setRevealStep("final-message"); setFinalLineIndex(0); playType(); }, 11000 * speedMultiplier);
      finalLines.forEach((_, i) => {
        if (i > 0) addTimer(() => { setFinalLineIndex(i); playType(); }, (11000 + i * 3500) * speedMultiplier);
      });

      const endTime = (11000 + finalLines.length * 3500) * speedMultiplier;
      addTimer(() => { playBoom(); fireConfetti({ particleCount: 300, spread: 180 }); fireCannon(); }, endTime);
      addTimer(() => setFadeOut(true), endTime + 2000);
      addTimer(() => { setScene("done"); onComplete(); }, endTime + 3500);
    }

  }, [scene, speedMultiplier, age, storyLines, postChatLines, finalLines, onComplete, playType, playWhoosh, playReveal, playPop, playBoom, fireConfetti, fireCannon, fireStars]);

  const handleChatComplete = useCallback(() => {
    playWhoosh();
    setScene("post-chat");
    setPostChatLine(0);
  }, [playWhoosh]);

  if (scene === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"} ${shaking ? "animate-screen-shake" : ""}`}
      style={{ background: 'transparent' }}
    >
      <AnimatePresence mode="wait">
        {scene === "storytelling" && (
          <motion.div 
            key="storytelling"
            initial={{ scale: 1.2, filter: "blur(20px)", opacity: 0 }}
            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
            exit={{ scale: 0.8, filter: "blur(20px)", opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-50 text-center max-w-3xl mx-auto px-6"
          >
            <div className="text-3xl mb-8 animate-pulse opacity-60">💭</div>
            {(age ? [...storyLines.slice(0, -1), `As you celebrate your ${age}th year...`, storyLines[storyLines.length - 1]] : storyLines).map((line, i) => (
              <p
                key={i}
                className={`font-display leading-relaxed mb-6 transition-all duration-1000 ${(storyLine >= i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${storyLineStyles[i]?.className || ''}`}
                style={{ ...(storyLineStyles[i]?.style || {}), color: i === storyLine ? primaryColor : (storyLineStyles[i]?.style?.color || "hsl(0,0%,90%)"), textShadow: i === storyLine ? `0 0 20px ${primaryColor}40` : "none" }}
              >
                {storyLine >= i && (
                <TypeWriter 
                  text={line} 
                  speed={relationship === 'partner' ? 90 : relationship === 'friend' ? 40 : 70} 
                  delay={300} 
                  cursor={storyLine === i} 
                />
              )}
              </p>
            ))}
          </motion.div>
        )}

        {scene === "fake-chat" && (
          <motion.div 
            key="fake-chat"
            initial={{ y: 100, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -100, opacity: 0, rotateX: -45 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <FakeChatScene onComplete={handleChatComplete} />
          </motion.div>
        )}

        {scene === "post-chat" && (
          <motion.div 
            key="post-chat"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, filter: "blur(10px)", opacity: 0 }}
            className="text-center max-w-3xl mx-auto px-6"
          >
            <div className="mb-8 flex justify-center"><HeartProgression stage={3} /></div>
            {postChatLines.slice(0, postChatLine + 1).map((line, i) => (
              <p 
                key={i} 
                className={`font-display leading-relaxed mb-6 ${postChatStyles[i]?.className || ''}`} 
                style={{ ...(postChatStyles[i]?.style || {}), color: i === postChatLine ? primaryColor : (postChatStyles[i]?.style?.color || "white") }}
              >
                <KineticText text={line} animation={relationship === 'partner' ? 'float' : 'pop-out'} delay={300} />
              </p>
            ))}
          </motion.div>
        )}

        {scene === "special-message" && (
          <motion.div 
            key="special-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpecialMessage />
          </motion.div>
        )}

        {scene === "reveal-sequence" && (
          <motion.div 
            key="reveal"
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {revealStep === "dear-name" && (
              <motion.div 
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "circOut" }}
                className="text-center"
              >
                <p className="text-2xl md:text-4xl text-muted-foreground mb-4 font-display italic">This is for you...</p>
                <h2 className="font-display text-7xl md:text-9xl lg:text-[12rem] font-black animate-glow-pulse" style={{ color: primaryColor }}>
                  <KineticText text={name || 'You'} animation="zoom-in" delay={600} />
                </h2>
              </motion.div>
            )}

            {revealStep === "grand-reveal" && (
              <div className="text-center">
                <Balloons count={20} />
                <div className="flex justify-center mb-6"><HeartProgression stage={4} /></div>
                <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black mb-4">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] via-[hsl(45,100%,65%)] to-[hsl(200,80%,70%)] bg-clip-text text-transparent animate-gradient-shift">
                    Happy Birthday
                  </span>
                </h1>
                <h2 className="font-display text-7xl md:text-9xl lg:text-[12rem] font-black text-foreground animate-glow-pulse mt-4">
                  {name}!
                </h2>
              </div>
            )}

            {revealStep === "final-message" && (
              <div className="text-center max-w-4xl mx-auto px-6">
                {finalLines.slice(0, finalLineIndex + 1).map((line, i) => (
                  <p key={i} className={`font-display leading-relaxed mb-5 ${i === 0 ? "text-3xl md:text-5xl font-black text-primary" : "text-2xl md:text-4xl text-white/90"}`}>
                    <TypeWriter text={line} speed={65} delay={400} cursor={finalLineIndex === i} />
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      {flashWhite && <div className="fixed inset-0 z-[60] bg-white/40 pointer-events-none animate-flash" />}
      <Sparkles count={15} />
      {ringPulse && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="w-64 h-64 rounded-full border-8 animate-ring-expand" style={{ borderColor: primaryColor }} />
        </div>
      )}
    </div>
  );
};
