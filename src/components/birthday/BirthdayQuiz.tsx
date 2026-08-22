import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "@/components/birthday/SoundManager";
import { useConfetti } from "@/components/birthday/Confetti";
import { useTranslation } from "@/i18n";
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
    const { isHindi, isBengali } = useTranslation();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const questions: Question[] = useMemo(() => {
        const { name, interests, relationship } = config;
        const displayName = name || (isBengali ? "আমাদের বার্থডে স্টার" : isHindi ? "हमारे बर्थडे स्टार" : "Birthday Star");
        if (isBengali) {
            const base: Question[] = [
                {
                    q: `আজকের দিনে জন্ম নেওয়া সবচেয়ে চমৎকার এবং লেজেন্ডারি মানুষ কে?`,
                    options: ["আলবার্ট আইনস্টাইন", "কোনো সেলিব্রিটি", displayName, "একটি পেঙ্গুইন"],
                    correct: 2,
                    reason: `নিঃসন্দেহে! তিনি আর কেউ নন, শুধুই ${displayName}! আশেপাশেও কেউ নেই।`
                },
                {
                    q: `আজ ${displayName}-এর মুড কেমন?`,
                    options: ["ঘুমে কাতর", "ক্ষুধার্ত", "সুপার এনার্জেটিক ও ধামাকাদার", "বিরক্ত"],
                    correct: 2,
                    reason: "আজ ওনার জন্মদিন! আজ পুরো গড মোডে আছেন।"
                }
            ];
            if (interests?.includes('car')) {
                base.push({
                    q: `যদি ${displayName}-কে আজ একটি গাড়ি বেছে নিতে বলা হয়, তবে কোনটি হবে?`,
                    options: ["একটি সাইকেল", "একটি সুপারকার 🏎️", "একটি বাস", "একটি স্কুটার"],
                    correct: 1,
                    reason: "কারণ লেজেন্ডরা সবসময় গতির সাথে চলে!"
                });
            }
            if (relationship === 'partner') {
                base.push({
                    q: `পুরো পৃথিবীতে ${displayName}-কে সবচেয়ে বেশি ভালোবাসে কে?`,
                    options: ["বিড়াল", "প্রতিবেশী", "যে এই সুন্দর ওয়েবসাইটটি পাঠিয়েছে ❤️", "মঙ্গল গ্রহের প্রাণী"],
                    correct: 2,
                    reason: "যে এই ওয়েবসাইট পাঠিয়েছে, সে আকাশের তারার চেয়েও বেশি ভালোবাসে।"
                });
            }
            if (interests?.includes('coding')) {
                base.push({
                    q: `${displayName}-এর সবচেয়ে বড় ভয় কোনটি?`,
                    options: ["মাকড়সা", "উচ্চতা", "শুক্রবার বিকেল ৪টায় প্রোডাকশনে বাগ 🐞", "কফি শেষ হওয়া"],
                    correct: 2,
                    reason: "আসল কোডাররা জানে... প্রোডাকশনের বাগই সবচেয়ে বড় দুঃস্বপ্ন!"
                });
            }
            base.push({
                q: `যদি ${displayName} একজন সুপারহিরো হতেন, তবে ওনার নাম কী হতো?`,
                options: ["ক্যাপ্টেন ঘুমকাতুরে", "দ্য প্রোক্রাস্টিনেটর", "সুপার লেজেন্ড বার্থডে স্টার 🦸‍♂️", "আয়রন কফি-ম্যান"],
                correct: 2,
                reason: "আজকের দিনে, আপনিই সেই সুপারহিরো যাকে আমাদের সবার প্রয়োজন!"
            });
            return base;
        }
        if (isHindi) {
            const base: Question[] = [
                {
                    q: `आज के दिन पैदा होने वाला सबसे शानदार और लीजेंड इंसान कौन है?`,
                    options: ["अल्बर्ट आइंस्टीन", "कोई सेलिब्रिटी", displayName, "एक पेंगुइन"],
                    correct: 2,
                    reason: `ज़ाहिर सी बात है! वो सिर्फ और सिर्फ ${displayName} हैं! कोई आसपास भी नहीं टिकता।`
                },
                {
                    q: `आज ${displayName} का मूड कैसा है?`,
                    options: ["नींद में", "भूखा", "सुपर धमाकेदार और लीजेंड्री", "बोर"],
                    correct: 2,
                    reason: "आज इनका जन्मदिन है! आज ये फुल गॉड मोड में हैं।"
                }
            ];
            if (interests?.includes('car')) {
                base.push({
                    q: `अगर ${displayName} को आज कोई गाड़ी चुननी हो, तो वो क्या होगी?`,
                    options: ["एक साइकिल", "एक सुपरकार 🏎️", "एक बस", "एक स्कूटर"],
                    correct: 1,
                    reason: "क्योंकि लीजेंड्स हमेशा रफ्तार से चलते हैं!"
                });
            }
            if (relationship === 'partner') {
                base.push({
                    q: `पूरी कायनात में ${displayName} को सबसे ज्यादा प्यार कौन करता है?`,
                    options: ["बिल्ली", "पड़ोसी", "जिसने यह खूबसूरत वेबसाइट भेजी है ❤️", "मंगल ग्रह का प्राणी"],
                    correct: 2,
                    reason: "जिसने यह वेबसाइट भेजी है, वो आसमान के तारों से भी ज्यादा प्यार करता/करती है।"
                });
            }
            if (interests?.includes('coding')) {
                base.push({
                    q: `${displayName} का सबसे बड़ा डर क्या है?`,
                    options: ["मकड़ी", "ऊंचाई", "शुक्रवार शाम 4 बजे प्रोडक्शन में बग 🐞", "कॉफी खत्म होना"],
                    correct: 2,
                    reason: "असली कोडर्स जानते हैं... प्रोडक्शन का बग सबसे बड़ा डरावना सपना होता है!"
                });
            }
            base.push({
                q: `अगर ${displayName} एक सुपरहीरो होते, तो उनका नाम क्या होता?`,
                options: ["कैप्टन कुंभकरण", "द प्रोक्रास्टिनेटर", "सुपर लीजेंड बर्थडे स्टार 🦸‍♂️", "आयरन कॉफी-मैन"],
                correct: 2,
                reason: "आज के दिन, आप वही सुपरहीरो हैं जिसकी हम सबको ज़रूरत है!"
            });
            return base;
        }
        const base: Question[] = [
            {
                q: `Who is undeniably the most legendary person born on this day?`,
                options: ["Albert Einstein", "Some Celebrity", displayName, "A Penguin"],
                correct: 2,
                reason: `Obviously! It's none other than ${displayName}! No one else comes close.`
            },
            {
                q: `What is ${displayName}'s vibe today?`,
                options: ["Sleepy", "Hungry", "Unstoppable & Legendary", "Bored"],
                correct: 2,
                reason: "It's their birthday! They are operating in full God-mode."
            }
        ];
        if (interests?.includes('car')) {
            base.push({
                q: `If ${displayName} could drive anything today, what would it be?`,
                options: ["A tricycle", "A roaring supercar 🏎️", "A bus", "A scooter"],
                correct: 1,
                reason: "Because legends need speed, pure and simple!"
            });
        }
        if (relationship === 'partner') {
            base.push({
                q: `Who loves ${displayName} more than anything in the entire universe?`,
                options: ["The cat", "The neighbor", "The person who sent this ❤️", "An alien"],
                correct: 2,
                reason: "The sender loves them to infinity and back!"
            });
        }
        if (interests?.includes('coding')) {
            base.push({
                q: `What is ${displayName}'s biggest fear?`,
                options: ["Spiders", "Heights", "Bugs in production on Friday 🐞", "No coffee"],
                correct: 2,
                reason: "Real coders know... production bugs on Friday are pure nightmare fuel!"
            });
        }
        base.push({
            q: `If ${displayName} had a superpower, what would their hero name be?`,
            options: ["Captain Sleep", "The Procrastinator", "Super Legend Birthday Star 🦸‍♂️", "Iron Coffee"],
            correct: 2,
            reason: "Today, they are the hero this world needs!"
        });
        return base;
    }, [config, isHindi, isBengali]);
    const handleSelect = (index: number) => {
        if (selected !== null)
            return;
        setSelected(index);
        playPop();
        if (index === questions[currentIdx].correct) {
            setScore(prev => prev + 1);
            playReveal();
        }
        setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
                setCurrentIdx(prev => prev + 1);
                setSelected(null);
            }
            else {
                setShowResult(true);
                playBoom();
                fireCannon();
            }
        }, 2200);
    };
    return (<section className="relative z-20 px-4 py-20 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl text-center">
        {!showResult ? (<AnimatePresence mode="wait">
            <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex justify-between items-center text-sm font-bold tracking-widest text-primary uppercase">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>

              <h3 className="font-display text-2xl md:text-4xl font-bold leading-tight min-h-[4rem] flex items-center justify-center">
                {questions[currentIdx].q}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentIdx].options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === questions[currentIdx].correct;
                let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-foreground";
                if (selected !== null) {
                    if (isCorrect)
                        btnStyle = "bg-green-500/20 border-green-500 text-green-300 scale-102";
                    else if (isSelected)
                        btnStyle = "bg-red-500/20 border-red-500 text-red-300";
                    else
                        btnStyle = "bg-white/5 border-white/5 opacity-40";
                }
                return (<button key={i} disabled={selected !== null} onClick={() => handleSelect(i)} className={`p-5 rounded-2xl border text-lg md:text-xl font-medium transition-all duration-300 text-left flex items-center justify-between ${btnStyle}`}>
                      <span>{opt}</span>
                      {selected !== null && isCorrect && <CheckCircle2 className="text-green-400 shrink-0"/>}
                      {selected !== null && isSelected && !isCorrect && <XCircle className="text-red-400 shrink-0"/>}
                    </button>);
            })}
              </div>

              {selected !== null && (<motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-muted-foreground italic text-lg pt-4 border-t border-white/5">
                  {questions[currentIdx].reason}
                </motion.p>)}
            </motion.div>
          </AnimatePresence>) : (<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]"/>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-yellow-400/30 rounded-full"/>
              </div>
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl font-black">{isBengali ? "অসাধারণ স্কোর! 🏆" : isHindi ? "धमाकेदार स्कोर! 🏆" : "LEGENDARY SCORE!"}</h2>
            <p className="text-2xl md:text-3xl text-foreground/80">
              {isBengali ? `আপনি ${config.name || 'বার্থডে'} কুইজে ` : isHindi ? `आपने ${config.name || 'बर्थडे'} क्विज़ में ` : 'You scored '}
              <span className="text-primary font-black">{score}/{questions.length}</span>
              {isBengali ? ' নম্বর পেয়েছেন!' : isHindi ? ' अंक हासिल किए!' : ` on the ${config.name || 'Birthday'} Trivia!`}
            </p>
            
            <div className="flex justify-center gap-4 text-primary">
              <Star className="animate-pulse"/>
              <Heart className="animate-bounce"/>
              <Flame className="animate-pulse"/>
              <Sparkles className="animate-bounce"/>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setShowResult(false);
                setSelected(null);
                fireStars();
            }} className="px-10 py-4 bg-primary text-white rounded-full font-black tracking-widest uppercase text-sm shadow-2xl shadow-primary/30">
              {isHindi ? "फिर से खेलें 🔄" : "Play Again 🔄"}
            </motion.button>
          </motion.div>)}
      </motion.div>
    </section>);
};
