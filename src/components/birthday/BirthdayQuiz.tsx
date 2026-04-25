import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "@/components/birthday/SoundManager";
import { useConfetti } from "@/components/birthday/Confetti";
import { Trophy, Star, Heart, Flame, Sparkles } from "lucide-react";

interface Question {
  q: string;
  options: string[];
  correct: number;
  reason: string;
}

export const BirthdayQuiz = () => {
  const { config } = useBirthdayStore();
  const { playPop, playReveal, playBoom } = useSoundManager();
  const { fireCannon, fireStars } = useConfetti();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const questions: Question[] = useMemo(() => {
    const { name, interests, relationship, gender } = config;
    const base: Question[] = [
      {
        q: `Who is the most legendary person born on this day?`,
        options: ["Albert Einstein", "A Celebrity", name, "A Penguin"],
        correct: 2,
        reason: `Duh! It's obviously ${name}! Nobody else comes close.`
      },
      {
        q: `What is ${name}'s current mood today?`,
        options: ["Sleepy", "Hungry", "Super OP & Legendary", "Bored"],
        correct: 2,
        reason: "It's their birthday! They are in God Mode today."
      }
    ];

    if (interests?.includes('car')) {
      base.push({
        q: `If ${name} could have any car today, what would it be?`,
        options: ["A Cycle", "A Supercar", "A Bus", "A Scooter"],
        correct: 1,
        reason: "Because legends drive fast!"
      });
    }

    if (relationship === 'partner') {
      base.push({
        q: `Who loves ${name} the most in the entire universe?`,
        options: ["The Cat", "Their Neighbor", "The Person Who Sent This Website", "A Martian"],
        correct: 2,
        reason: "The person who sent this loves them more than stars in the sky."
      });
    }

    if (interests?.includes('coding')) {
      base.push({
        q: `What is ${name}'s biggest fear?`,
        options: ["Spiders", "Heights", "A bug in production at 4 PM on a Friday", "Running out of coffee"],
        correct: 2,
        reason: "Real coders know... bugs are the ultimate nightmare!"
      });
    }

    base.push({
      q: `If ${name} was a superhero, what would their name be?`,
      options: ["Captain Sleep-A-Lot", "The Procrastinator", "Super Legendary Birthday Person", "Iron Coffee-Man"],
      correct: 2,
      reason: "Today, you're the hero we all need!"
    });

    return base;
  }, [config]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentIdx].correct) {
      setScore(s => s + 1);
      playPop();
    } else {
      // Small vibrate or sound
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelected(null);
        playReveal();
      } else {
        setShowResult(true);
        playBoom();
        fireCannon();
      }
    }, 1500);
  };

  return (
    <section className="relative z-20 px-4 py-32 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl w-full backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 text-center overflow-hidden relative"
        style={{ background: 'rgba(20,20,20,0.8)', boxShadow: `0 30px 100px -30px ${config.favoriteColor || '#ff0080'}40` }}
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
        
        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-center gap-2 mb-4">
                {questions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentIdx ? 'w-8 bg-primary' : i < currentIdx ? 'bg-primary/40' : 'bg-white/10'}`} />
                ))}
              </div>
              
              <h3 className="font-display text-2xl md:text-4xl font-black leading-tight">
                {questions[currentIdx].q}
              </h3>

              <div className="grid gap-4">
                {questions[currentIdx].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-6 rounded-2xl text-lg md:text-xl font-medium transition-all duration-300 border ${
                      selected === i 
                        ? i === questions[currentIdx].correct ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'
                        : selected !== null && i === questions[currentIdx].correct ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>

              {selected !== null && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary/80 italic text-lg"
                >
                  {questions[currentIdx].reason}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 py-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-yellow-400/30 rounded-full" />
              </div>
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl font-black">LEGENDARY SCORE!</h2>
            <p className="text-2xl md:text-3xl text-foreground/80">
              You scored <span className="text-primary font-black">{score}/{questions.length}</span> on the {config.name} Trivia!
            </p>
            
            <div className="flex justify-center gap-4 text-primary">
              <Star className="animate-pulse" />
              <Heart className="animate-bounce" />
              <Flame className="animate-pulse" />
              <Sparkles className="animate-bounce" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setShowResult(false);
                setSelected(null);
                fireStars();
              }}
              className="px-10 py-4 bg-primary text-white rounded-full font-black tracking-widest uppercase text-sm shadow-2xl shadow-primary/30"
            >
              Play Again 🔄
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
