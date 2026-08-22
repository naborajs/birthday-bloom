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
import { useTranslation } from "@/i18n";
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
    const [emojiBursts, setEmojiBursts] = useState<Array<{
        id: number;
        emoji: string;
        x: number;
        y: number;
    }>>([]);
    const [ringPulse, setRingPulse] = useState(false);
    const [finalLineIndex, setFinalLineIndex] = useState(0);
    const [flashWhite, setFlashWhite] = useState(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const { fireConfetti, fireStars, fireCinematicCelebration } = useConfetti();
    const { playType, playWhoosh, playReveal, playPop, playBoom } = useSoundManager();
    const { config, getAnimationPacing } = useBirthdayStore();
    const { t, isHindi, isBengali } = useTranslation();
    const { name, age, relationship, favoriteColor, gender } = config;
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
    const storyLines = useMemo(() => {
        const isMale = gender === 'male';
        const isFemale = gender === 'female';
        if (isBengali) {
            if (relationship === 'partner') {
                return [
                    "এমন একজন মানুষ আছেন যিনি আমার পুরো পৃথিবীর কেন্দ্রবিন্দু...",
                    "এমন একজন যিনি প্রতিটি মুহূর্তকে এক সুন্দর সিনেমার দৃশ্যের মতো বানিয়ে তোলেন...",
                    isMale ? "সেই মানুষ যিনি আমার কাছে শক্তি এবং ভালোবাসার এক নতুন অর্থ এনে দিয়েছেন..." : isFemale ? "সেই মানুষ যার স্নিগ্ধতা ও সৌন্দর্য চারপাশকে আলোয় ভরিয়ে দেয়..." : "সেই মায়াবী রূহ যিনি আমাকে প্রতিটি দিন ভালোবাসার জাদুতে বিশ্বাস করান...",
                    "আমি শুধু একটি সাধারণ 'I Love You' লিখে পাঠাতে পারতাম...",
                    "কিন্তু একটি সাধারণ মেসেজ আমার হৃদয়ের গভীর অনুভূতি কখনোই প্রকাশ করতে পারবে না।"
                ];
            }
            if (relationship === 'friend') {
                return [
                    "সতর্কতা! একজন আসল লেজেন্ড জীবনের পরবর্তী ধাপে পা রেখেছেন! 🚀",
                    "দাঁড়াও, সত্যিই কি আজ তোর জন্মদিন? নাকি ক্যালেন্ডার মজা করছে? 😂",
                    isMale ? "সেই দোস্তের নামে যে আমার ৯৯% পাগলামির জন্য দায়ী..." : isFemale ? "সেই বান্ধবীর নামে যে আমাকে হাসানোর সব দায়িত্ব নিজের কাঁধে তুলে নিয়েছে..." : "সেই মানুষের নামে যে এই পুরো পৃথিবীতে সবচেয়ে বেশি কুল...",
                    "আমি ভেবেছিলাম তোকে কোনো সিরিয়াস উপহার দেব...",
                    "কিন্তু তারপর মনে পড়ল... সেটা তো আমাদের স্টাইলই না! 😎"
                ];
            }
            return [
                "আজকের এই দিনটি এক অনন্য ইতিহাস হতে চলেছে...",
                `কারণ আজ আমরা পরিবারের সবচেয়ে মূল্যবান ${isMale ? 'রাজপুত্র' : isFemale ? 'রাজকন্যা' : 'নক্ষত্র'}-এর জন্মদিন উদযাপন করছি!`,
                "এমন একজন মানুষ যার উপস্থিতি আমাদের সবার জীবনে ঈশ্বরের সেরা উপহার...",
                "আমরা এমন কিছু তৈরি করতে চেয়েছিলাম যা আমাদের ভালোবাসার মতো চিরকাল অম্লান থাকবে...",
                "তাই আরাম করে বসুন এবং এই অপূর্ব উদযাপনটি উপভোগ করুন! ✨"
            ];
        }
        if (isHindi) {
            if (relationship === 'partner') {
                return [
                    "कोई ऐसा है जो मेरी पूरी दुनिया का केंद्र बन चुका है...",
                    "कोई ऐसा जो हर एक पल को किसी खूबसूरत फिल्म जैसा बना देता है...",
                    isMale ? "वो इंसान जिसने मेरे लिए ताकत और प्यार की नई परिभाषा लिखी..." : isFemale ? "वो इंसान जिसकी सादगी और खूबसूरती हर महफ़िल को रोशन कर देती है..." : "वो खूबसूरत रूह जो मुझे हर दिन जादू पर यकीन दिलाती है...",
                    "मैं सिर्फ एक 'I Love You' लिखकर भेज सकता/सकती थी...",
                    "पर एक साधारण संदेश मेरे दिल के जज़्बातों को कभी बयां नहीं कर सकता।"
                ];
            }
            if (relationship === 'friend') {
                return [
                    "सावधान! एक असली लीजेंड ज़िंदगी के अगले लेवल पर पहुँच चुका है! 🚀",
                    "रुको, क्या सच में आज तुम्हारा जन्मदिन है? या कैलेंडर मज़ाक कर रहा है? 😂",
                    isMale ? "उस यार के नाम जो मेरे 99% पागलपन भरे फैसलों की वजह है..." : isFemale ? "उस दोस्त के नाम जो मुझे हंसाने की पूरी ज़िम्मेदारी लिए बैठी है..." : "उस इंसान के नाम जो इस दुनिया में सबसे ज्यादा कूल है...",
                    "मैंने सोचा था तुम्हें कोई समझदारी भरा तोहफा दूँ...",
                    "पर फिर याद आया... वो तो हमारा स्टाइल ही नहीं है! 😎"
                ];
            }
            return [
                "आज का दिन एक यादगार इतिहास बनने जा रहा है...",
                `क्योंकि आज हम परिवार के सबसे अनमोल ${isMale ? 'राजा' : isFemale ? 'रानी' : 'सितारे'} का जन्मदिन मना रहे हैं!`,
                "एक ऐसा इंसान जिसकी मौजूदगी हम सबके लिए ईश्वर का सबसे बड़ा उपहार है...",
                "हम कुछ ऐसा बनाना चाहते थे जो हमारी यादों की तरह हमेशा महकता रहे...",
                "तो आराम से बैठिए और इस खूबसूरत जश्न का आनंद लीजिए! ✨"
            ];
        }
        if (relationship === 'partner') {
            return [
                "There's someone who has been the center of my world...",
                `Someone who makes every second feel like a movie scene...`,
                isMale ? "The man who redefined what strength and kindness mean to me..." : isFemale ? "The woman whose grace and beauty light up every room she enters..." : "The soul who makes me believe in magic every single day...",
                "I could have just texted 'I love you'...",
                "But a simple message could never hold all that I feel for you."
            ];
        }
        if (relationship === 'friend') {
            return [
                "Warning: A true legend is leveling up today! 🚀",
                `Wait, is it actually your birthday, or is the calendar just flexing? 😂`,
                isMale ? "To the guy who is responsible for 99% of my worst decisions and best memories..." : isFemale ? "To the girl who somehow manages to keep me sane while being completely insane..." : "To the most unhinged, iconic human on this planet...",
                "I was going to get you a sensible, adult birthday card...",
                "Then I remembered who we are. 😎"
            ];
        }
        return [
            "Today marks a very special moment in time...",
            `Because today, we celebrate the most incredible person in our universe.`,
            "Someone whose presence is a gift to every single person in this room...",
            "I wanted to build something that lasts as long as the memories we share...",
            "So, sit back, relax, and enjoy the show! ✨"
        ];
    }, [relationship, gender, isHindi, isBengali]);
    const postChatLines = useMemo(() => {
        if (isBengali) {
            if (relationship === 'friend')
                return [
                    "কারণ তুই শুধু একজন সাধারণ বন্ধু নোস...",
                    "তুই সেই মানুষ যার ওপর আমি চোখ বন্ধ করে ভরসা করতে পারি! ☕️",
                    "আমাদের এই অদ্ভুত বন্ধুত্বের মতো তুইও এক অবিস্মরণীয় উদযাপনের দাবিদার...",
                    "তাহলে চল এই পার্টি ধামাকা সহকারে শুরু করা যাক! 🎉",
                ];
            if (relationship === 'partner')
                return [
                    "কিন্তু আপনি আমার কাছে শুধু একজন সঙ্গীর চেয়েও অনেক বেশি...",
                    "আপনি আমার প্রশান্তি, আমার জীবনের সেরা রোমাঞ্চ এবং আমার নিরাপদ আশ্রয়।",
                    "গভীর রাত জেগে প্রতিটি পিক্সেল সাজিয়েছি... ঠিক আপনারই মতো করে।",
                    "আপনি কি সেই বড় সারপ্রাইজের জন্য প্রস্তুত? ❤️",
                ];
            return [
                "আপনি আমাদের জীবনে অনেক আনন্দ আর আলো নিয়ে এসেছেন...",
                "আপনি আপনার মিষ্টি হাসির মতোই উজ্জ্বল এক উদযাপনের যোগ্য।",
                "আমরা আমাদের সম্পূর্ণ হৃদয় উজাড় করে এটি সাজিয়েছি, শুধু আপনার জন্য...",
                "চলুন উদযাপনের আনন্দ শুরু করা যাক! ✨",
            ];
        }
        if (isHindi) {
            if (relationship === 'friend')
                return [
                    "क्योंकि तुम सिर्फ एक दोस्त नहीं हो...",
                    "तुम वो इंसान हो जिस पर मैं हमेशा भरोसा कर सकता/सकती हूँ! ☕️",
                    "तुम हमारी इस अनोखी दोस्ती जितने ही शानदार जश्न के हकदार हो...",
                    "तो चलो इस पार्टी को धमाकेदार तरीके से शुरू करते हैं! 🎉",
                ];
            if (relationship === 'partner')
                return [
                    "लेकिन आप मेरे लिए सिर्फ एक साथी से कहीं बढ़कर हैं...",
                    "आप मेरा सुकून, मेरा सबसे बड़ा रोमांच और मेरा घर हैं।",
                    "देर रात तक जागकर हर एक पिक्सल को सजाया है... बिल्कुल आपकी तरह।",
                    "क्या आप इस बड़े सरप्राइज के लिए तैयार हैं? ❤️",
                ];
            return [
                "आप हमारी ज़िंदगी में इतनी सारी खुशियाँ लेकर आते हैं...",
                "आप अपनी मुस्कान जितने ही उज्ज्वल जश्न के हकदार हैं।",
                "हमने अपना पूरा दिल इसमें लगा दिया है, सिर्फ आपके लिए...",
                "चलिए जश्न की शुरुआत करते हैं! ✨",
            ];
        }
        if (relationship === 'friend')
            return [
                "Because you're not just any friend...",
                "You're the person I can always count on for chaos and coffee! ☕️",
                "You deserve something as epic and weird as our friendship...",
                "So let's get this party started! 🎉",
            ];
        if (relationship === 'partner')
            return [
                "But you are so much more than just a partner to me...",
                "You are my safe haven, my greatest adventure, and my home.",
                "I stayed up late, making sure every pixel was perfect... just like you.",
                "Are you ready for the big reveal? ❤️",
            ];
        return [
            "You bring so much warmth into our lives...",
            "You deserve a celebration as bright as your smile.",
            "We put our hearts into this, just for you...",
            "Let the celebration begin! ✨",
        ];
    }, [relationship, isHindi, isBengali]);
    const finalLines = useMemo(() => {
        const isMale = gender === 'male';
        const isFemale = gender === 'female';
        if (isBengali) {
            if (relationship === 'partner')
                return [
                    `আমার প্রিয় ${name || (isMale ? 'রাজপুত্র' : isFemale ? 'রাজকন্যা' : 'ভালোবাসা')}`,
                    t('intro.hopeYouFeltHeartbeat'),
                    t('intro.todayTomorrowAlways'),
                    t('intro.loveInfinitely')
                ];
            if (relationship === 'friend')
                return [
                    `শুভ জন্মদিন ${name || (isMale ? 'আমার ভাই' : isFemale ? 'আমার সেরা বন্ধু' : 'লেজেন্ড')}!`,
                    t('intro.cakeChaosNoRegrets'),
                    t('intro.partnerInCrime'),
                    t('intro.stayLegendary')
                ];
            return [
                `প্রিয় ${name || 'অসাধারণ মানুষ'}`,
                t('intro.yearOfPureHappiness'),
                t('intro.kindnessReturnTenfold'),
                t('intro.loveYouSoMuch')
            ];
        }
        if (isHindi) {
            if (relationship === 'partner')
                return [
                    `मेरे प्यारे ${name || (isMale ? 'राजकुमार' : isFemale ? 'राजकुमारी' : 'हमसफ़र')}`,
                    t('intro.hopeYouFeltHeartbeat'),
                    t('intro.todayTomorrowAlways'),
                    t('intro.loveInfinitely')
                ];
            if (relationship === 'friend')
                return [
                    `जन्मदिन मुबारक ${name || (isMale ? 'मेरे भाई' : isFemale ? 'मेरी बेस्टी' : 'लीजेंड')}!`,
                    t('intro.cakeChaosNoRegrets'),
                    t('intro.partnerInCrime'),
                    t('intro.stayLegendary')
                ];
            return [
                `प्रिय ${name || 'अद्भुत इंसान'}`,
                t('intro.yearOfPureHappiness'),
                t('intro.kindnessReturnTenfold'),
                t('intro.loveYouSoMuch')
            ];
        }
        if (relationship === 'partner')
            return [
                `My dearest ${name || (isMale ? 'Prince' : isFemale ? 'Princess' : 'Love')}`,
                "I hope you felt the heartbeat behind every animation...",
                "You are my today, my tomorrow, and my always ✨",
                "Happy Birthday, I love you infinitely! 💖"
            ];
        if (relationship === 'friend')
            return [
                `Happy Birthday ${name || (isMale ? 'Bro' : isFemale ? 'Bestie' : 'Legend')}!`,
                "May your day be filled with cake, chaos, and zero regrets!",
                "I'm so lucky to have a partner-in-crime like you 🎉",
                "Stay legendary! 😎"
            ];
        return [
            `Dear ${name || 'Wonderful Human'}`,
            "We all wanted to wish you a year of pure happiness...",
            "May your kindness always come back to you tenfold ✨",
            "We love you so much! 💖"
        ];
    }, [name, relationship, gender, isHindi, t]);
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
    useEffect(() => {
        clearTimers();
        if (scene === "storytelling") {
            if (typeof navigator !== 'undefined' && navigator.vibrate)
                navigator.vibrate(30);
            const lines = age ? [...storyLines.slice(0, -1), `As you celebrate your ${age}th year...`, storyLines[storyLines.length - 1]] : storyLines;
            lines.forEach((_, i) => {
                addTimer(() => { setStoryLine(i); playType(); }, i * 4000 * speedMultiplier);
            });
            addTimer(() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate)
                    navigator.vibrate(50);
                playWhoosh();
                setScene("fake-chat");
            }, lines.length * 4000 * speedMultiplier);
        }
        if (scene === "post-chat") {
            postChatLines.forEach((_, i) => {
                addTimer(() => { setPostChatLine(i); playType(); }, i * 3500 * speedMultiplier);
            });
            addTimer(() => {
                playReveal();
                fireStars();
                triggerFlash();
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
                fireCinematicCelebration();
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
                if (i > 0)
                    addTimer(() => { setFinalLineIndex(i); playType(); }, (11000 + i * 3500) * speedMultiplier);
            });
            const endTime = (11000 + finalLines.length * 3500) * speedMultiplier;
            addTimer(() => { playBoom(); fireConfetti({ particleCount: 300, spread: 180 }); fireCinematicCelebration(); }, endTime);
            addTimer(() => setFadeOut(true), endTime + 2000);
            addTimer(() => { setScene("done"); onComplete(); }, endTime + 3500);
        }
    }, [
        scene,
        speedMultiplier,
        age,
        storyLines,
        postChatLines,
        finalLines,
        onComplete,
        addTimer,
        clearTimers,
        playType,
        playWhoosh,
        playReveal,
        playPop,
        playBoom,
        fireConfetti,
        fireStars,
        fireCinematicCelebration,
        spawnEmojiBurst,
        triggerFlash,
        triggerRingPulse,
        triggerShake,
    ]);
    const handleChatComplete = useCallback(() => {
        playWhoosh();
        setScene("post-chat");
        setPostChatLine(0);
    }, [playWhoosh]);
    if (scene === "done")
        return null;
    return (<div className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"} ${shaking ? "animate-screen-shake" : ""}`} style={{ background: 'transparent' }}>
      <AnimatePresence mode="wait">
        {scene === "storytelling" && (<motion.div key="storytelling" initial={{ scale: 1.2, filter: "blur(20px)", opacity: 0 }} animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }} exit={{ scale: 0.8, filter: "blur(20px)", opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="relative z-50 text-center max-w-3xl mx-auto px-6">
            <div className="flex justify-center mb-12">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center text-3xl">
                ✨
              </motion.div>
            </div>
            {(age ? [...storyLines.slice(0, -1), `As you celebrate your ${age}th year...`, storyLines[storyLines.length - 1]] : storyLines).map((line, i) => (<p key={i} className={`font-display leading-relaxed mb-6 transition-all duration-1000 ${(storyLine >= i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${storyLineStyles[i]?.className || ''}`} style={{ ...(storyLineStyles[i]?.style || {}), color: i === storyLine ? primaryColor : (storyLineStyles[i]?.style?.color || "hsl(0,0%,90%)"), textShadow: i === storyLine ? `0 0 20px ${primaryColor}40` : "none" }}>
                {storyLine >= i && (<TypeWriter text={line} speed={relationship === 'partner' ? 90 : relationship === 'friend' ? 40 : 70} delay={300} cursor={storyLine === i}/>)}
              </p>))}
          </motion.div>)}

        {scene === "fake-chat" && (<motion.div key="fake-chat" initial={{ y: 100, opacity: 0, rotateX: 45 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: -100, opacity: 0, rotateX: -45 }} transition={{ duration: 0.8, type: "spring" }}>
            <FakeChatScene onComplete={handleChatComplete}/>
          </motion.div>)}

        {scene === "post-chat" && (<motion.div key="post-chat" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, filter: "blur(10px)", opacity: 0 }} className="text-center max-w-3xl mx-auto px-6">
            <div className="mb-8 flex justify-center"><HeartProgression stage={3}/></div>
            {postChatLines.slice(0, postChatLine + 1).map((line, i) => (<p key={i} className={`font-display leading-relaxed mb-6 ${postChatStyles[i]?.className || ''}`} style={{ ...(postChatStyles[i]?.style || {}), color: i === postChatLine ? primaryColor : (postChatStyles[i]?.style?.color || "white") }}>
                <KineticText text={line} animation={relationship === 'partner' ? 'float' : 'pop-out'} delay={300}/>
              </p>))}
          </motion.div>)}

        {scene === "special-message" && (<motion.div key="special-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SpecialMessage />
          </motion.div>)}

        {scene === "reveal-sequence" && (<motion.div key="reveal" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {revealStep === "dear-name" && (<motion.div initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2, ease: "circOut" }} className="text-center px-4">
                <p className="text-xl md:text-4xl text-muted-foreground mb-4 font-display italic">{t('intro.thisIsForYou')}</p>
                <h2 className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-black animate-glow-pulse break-words leading-tight" style={{ color: primaryColor }}>
                  <KineticText text={name || (isBengali ? 'আপনি' : isHindi ? 'आप' : 'You')} animation="zoom-in" delay={600}/>
                </h2>
              </motion.div>)}

            {revealStep === "grand-reveal" && (<div className="text-center px-4">
                <Balloons count={20}/>
                <div className="flex justify-center mb-6"><HeartProgression stage={4}/></div>
                <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black mb-4 break-words leading-tight">
                  <span className="bg-gradient-to-r from-[var(--color-primary)] via-[hsl(45,100%,65%)] to-[hsl(200,80%,70%)] bg-clip-text text-transparent animate-gradient-shift">
                    {t('common.happyBirthday')}
                  </span>
                </h1>
                <h2 className="font-display text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-black text-foreground animate-glow-pulse mt-4 break-words">
                  {name}!
                </h2>
              </div>)}

            {revealStep === "final-message" && (<div className="text-center max-w-4xl mx-auto px-6">
                {finalLines.slice(0, finalLineIndex + 1).map((line, i) => (<p key={i} className={`font-display leading-relaxed mb-5 ${i === 0 ? "text-3xl md:text-5xl font-black text-primary" : "text-2xl md:text-4xl text-white/90"}`}>
                    <TypeWriter text={line} speed={65} delay={400} cursor={finalLineIndex === i}/>
                  </p>))}
              </div>)}
          </motion.div>)}
      </AnimatePresence>

      <AnimatePresence>
        {emojiBursts.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, scale: 0.5, x: `${e.x}vw`, y: `${e.y}vh` }}
            animate={{ opacity: 1, scale: 1.5, y: `${e.y - 15}vh` }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed z-50 text-4xl pointer-events-none"
          >
            {e.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {flashWhite && <div className="fixed inset-0 z-[60] bg-white/40 pointer-events-none animate-flash"/>}
      <Sparkles count={15}/>
      {ringPulse && (<div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="w-64 h-64 rounded-full border-8 animate-ring-expand" style={{ borderColor: primaryColor }}/>
        </div>)}
    </div>);
};
