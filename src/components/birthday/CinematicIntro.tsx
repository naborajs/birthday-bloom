import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { KineticText } from "./KineticText";
import { FakeChatScene } from "./FakeChatScene";
import { HeartProgression } from "./HeartProgression";
import { useSoundManager } from "./SoundManager";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { SpecialMessage } from "@/features/cinematic-story/scenes/SpecialMessage";
import { useTranslation } from "@/i18n";
import { HighlightedText } from "./HighlightedText";

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
    const { t, isHindi, isBengali, isFrench } = useTranslation();
    const { name, age, relationship, favoriteColor, gender } = config;

    const pacing = getAnimationPacing();
    const speedMultiplier = pacing === 'fast' ? 0.75 : pacing === 'slow' ? 1.15 : 1;

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

    // Hold all action callbacks in a ref to avoid recreating effect timers
    const actionsRef = useRef({
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
        onComplete,
    });

    useEffect(() => {
        actionsRef.current = {
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
            onComplete,
        };
    });

    const storyLines = useMemo(() => {
        const isMale = gender === 'male';
        const isFemale = gender === 'female';
        if (isFrench) {
            if (relationship === 'partner') {
                return [
                    "Il y a quelqu'un qui est devenu le *centre de mon univers*...",
                    "Quelqu'un qui transforme chaque instant en une *scène de film magique*... ✨",
                    isMale ? "L'homme dont la *force et la tendresse* ont tout changé pour moi..." : isFemale ? "La femme dont la *douceur et la grâce* illuminent chaque instant..." : "Cette âme merveilleuse qui me fait croire à la *magie* chaque jour...",
                    "J'aurais pu simplement t'envoyer un *'Je t'aime'*...",
                    "Mais un simple message ne suffirait jamais à exprimer *tout ce que je ressens* 💖"
                ];
            }
            if (relationship === 'friend') {
                return [
                    "Alerte générale ! Une *véritable légende* passe au niveau supérieur ! 🚀",
                    "Attends, c'est vraiment ton anniversaire ou le calendrier nous fait une *blague* ? 😂",
                    isMale ? "À celui qui est responsable de *99% de mes meilleurs souvenirs*..." : isFemale ? "À celle qui a la mission de me *faire rire tous les jours*..." : "À la personne la plus *incroyable et iconique* de ce monde...",
                    "J'avais pensé t'offrir un cadeau classique et très sérieux...",
                    "Mais après réflexion... ce n'est tellement *pas notre style* ! 😎🔥"
                ];
            }
            return [
                "Aujourd'hui est une journée qui restera gravée comme un *moment inoubliable*...",
                `Parce que nous célébrons l'anniversaire de la personne la plus *précieuse et extraordinaire* !`,
                "Une personne d'exception dont la présence est un *cadeau inestimable* pour nous tous...",
                "Nous voulions créer quelque chose d'aussi spécial que nos *plus beaux souvenirs*...",
                "Alors, installez-vous confortablement et *profitez de la magie* ! ✨"
            ];
        }
        if (isBengali) {
            if (relationship === 'partner') {
                return [
                    "এমন একজন মানুষ আছেন যিনি আমার পুরো *পৃথিবীর কেন্দ্রবিন্দু*...",
                    "এমন একজন যিনি প্রতিটি মুহূর্তকে এক সুন্দর *সিনেমার দৃশ্যের মতো* বানিয়ে তোলেন... ✨",
                    isMale ? "সেই মানুষ যিনি আমার কাছে *শক্তি ও ভালোবাসার* এক নতুন অর্থ এনে দিয়েছেন..." : isFemale ? "সেই মানুষ যার *স্নিগ্ধতা ও সৌন্দর্য* চারপাশকে আলোয় ভরিয়ে দেয়..." : "সেই মায়াবী রূহ যিনি আমাকে প্রতিটি দিন *ভালোবাসার জাদুতে* বিশ্বাস করান...",
                    "আমি শুধু একটি সাধারণ *'I Love You'* লিখে পাঠাতে পারতাম...",
                    "কিন্তু একটি সাধারণ মেসেজ আমার হৃদয়ের *গভীর অনুভূতি* কখনোই প্রকাশ করতে পারবে না 💖"
                ];
            }
            if (relationship === 'friend') {
                return [
                    "সতর্কতা! একজন *আসল লেজেন্ড* জীবনের পরবর্তী ধাপে পা রেখেছেন! 🚀",
                    "দাঁড়াও, সত্যিই কি আজ তোর জন্মদিন? নাকি ক্যালেন্ডার *মজা করছে*? 😂",
                    isMale ? "সেই দোস্তের নামে যে আমার *৯৯% পাগলামির জন্য দায়ী*..." : isFemale ? "সেই বান্ধবীর নামে যে আমাকে *হাসানোর সব দায়িত্ব* নিজের কাঁধে তুলে নিয়েছে..." : "সেই মানুষের নামে যে এই পুরো পৃথিবীতে *সবচেয়ে বেশি কুল*...",
                    "আমি ভেবেছিলাম তোকে কোনো সিরিয়াস উপহার দেব...",
                    "কিন্তু তারপর মনে পড়ল... সেটা তো *আমাদের স্টাইলই না*! 😎🔥"
                ];
            }
            return [
                "আজকের এই দিনটি এক *অনন্য ইতিহাস* হতে চলেছে...",
                `কারণ আজ আমরা পরিবারের সবচেয়ে *মূল্যবান নক্ষত্র*-এর জন্মদিন উদযাপন করছি!`,
                "এমন একজন মানুষ যার উপস্থিতি আমাদের সবার জীবনে *ঈশ্বরের সেরা উপহার*...",
                "আমরা এমন কিছু তৈরি করতে চেয়েছিলাম যা আমাদের ভালোবাসার মতো *চিরকাল অম্লান* থাকবে...",
                "তাই আরাম করে বসুন এবং এই *অপূর্ব উদযাপনটি উপভোগ করুন*! ✨"
            ];
        }
        if (isHindi) {
            if (relationship === 'partner') {
                return [
                    "कोई ऐसा है जो मेरी पूरी *दुनिया का केंद्र* बन चुका है...",
                    "कोई ऐसा जो हर एक पल को किसी *खूबसूरत फिल्म* जैसा बना देता है... ✨",
                    isMale ? "वो इंसान जिसने मेरे लिए *प्यार और मजबूती* की नई परिभाषा लिखी..." : isFemale ? "वो इंसान जिसकी *सादगी और खूबसूरती* हर महफ़िल को रोशन कर देती है..." : "वो खूबसूरत रूह जो मुझे हर दिन *जादू पर यकीन* दिलाती है...",
                    "मैं सिर्फ एक *'I Love You'* लिखकर भेज सकता/सकती थी...",
                    "पर एक साधारण संदेश मेरे दिल के *सच्चे जज़्बातों* को कभी बयां नहीं कर सकता 💖"
                ];
            }
            if (relationship === 'friend') {
                return [
                    "सावधान! एक *असली लीजेंड* ज़िंदगी के अगले लेवल पर पहुँच चुका है! 🚀",
                    "रुको, क्या सच में आज तुम्हारा जन्मदिन है? या कैलेंडर *मज़ाक कर रहा है*? 😂",
                    isMale ? "उस यार के नाम जो मेरे *99% पागल फैसलों की वजह* है..." : isFemale ? "उस दोस्त के नाम जो मुझे *हंसाने की पूरी ज़िम्मेदारी* लिए बैठी है..." : "उस इंसान के नाम जो इस दुनिया में *सबसे ज्यादा कूल* है...",
                    "मैंने सोचा था तुम्हें कोई समझदारी भरा तोहफा दूँ...",
                    "पर फिर याद आया... वो तो *हमारा स्टाइल ही नहीं है*! 😎🔥"
                ];
            }
            return [
                "आज का दिन एक यादगार और *बेहद खास पल* बनने जा रहा है...",
                `क्योंकि आज हम परिवार के सबसे *अनमोल सितारे* का जन्मदिन मना रहे हैं!`,
                "एक ऐसा इंसान जिसकी मौजूदगी हम सबके लिए *ईश्वर का सबसे बड़ा उपहार* है...",
                "हम कुछ ऐसा बनाना चाहते थे जो हमारी *खूबसूरत यादों* की तरह हमेशा महकता रहे...",
                "तो आराम से बैठिए और इस *खूबसूरत जश्न का आनंद* लीजिए! ✨"
            ];
        }
        if (relationship === 'partner') {
            return [
                "There's someone who has been the *center of my world*...",
                "Someone who makes every second feel like a *movie scene*... ✨",
                isMale ? "The man whose *strength and kindness* redefined everything for me..." : isFemale ? "The woman whose *grace and beauty* light up every room she enters..." : "The soul who makes me believe in *true magic* every single day...",
                "I could have just texted *'I love you'*...",
                "But a simple message could never hold *all that I feel for you* 💖"
            ];
        }
        if (relationship === 'friend') {
            return [
                "Warning: A *true legend* is leveling up today! 🚀",
                "Wait, is it actually your birthday, or is the calendar just *flexing*? 😂",
                isMale ? "To the guy who is responsible for *99% of my best memories*..." : isFemale ? "To the girl who somehow manages to keep me *sane while being completely insane*..." : "To the most *unhinged, iconic human* on this planet...",
                "I was going to get you a sensible, adult birthday card...",
                "Then I remembered *who we are*! 😎🔥"
            ];
        }
        return [
            "Today marks a very *special moment* in time...",
            "Because today, we celebrate the most *incredible person* in our universe ✨",
            "Someone whose presence is a *priceless gift* to all of us...",
            "I wanted to build something that lasts as long as our *treasured memories*...",
            "So, sit back, relax, and *enjoy your celebration*! ✨"
        ];
    }, [relationship, gender, isHindi, isBengali, isFrench]);

    const postChatLines = useMemo(() => {
        if (isFrench) {
            if (relationship === 'friend')
                return [
                    "Parce que tu n'es pas n'importe quel(le) ami(e)...",
                    "Tu es la personne sur qui je peux toujours compter pour *rire et refaire le monde* ! ☕️",
                    "Tu mérites une fête aussi *grandiose et unique* que notre amitié...",
                    "Alors, lançons les festivités et *célébrons ça comme des légendes* ! 🎉",
                ];
            if (relationship === 'partner')
                return [
                    "Mais tu es tellement plus qu'un(e) simple partenaire pour moi...",
                    "Tu es mon *refuge*, ma *plus belle aventure* et mon *foyer*.",
                    "J'ai passé la nuit à perfectionner chaque détail... *tout comme toi* ✨",
                    "Es-tu prêt(e) pour la *grande révélation* ? ❤️",
                ];
            return [
                "Vous apportez tellement de *lumière et de bonheur* dans nos vies...",
                "Vous méritez une célébration aussi *éclatante que votre sourire*.",
                "Nous y avons mis *tout notre cœur*, spécialement pour vous...",
                "Que la *fête commence* ! ✨",
            ];
        }
        if (isBengali) {
            if (relationship === 'friend')
                return [
                    "কারণ তুই শুধু একজন সাধারণ বন্ধু নোস...",
                    "তুই সেই মানুষ যার ওপর আমি চোখ বন্ধ করে *ভরসা করতে পারি*! ☕️",
                    "আমাদের এই অদ্ভুত বন্ধুত্বের মতো তুইও এক *অবিস্মরণীয় উদযাপনের* দাবিদার...",
                    "তাহলে চল এই পার্টি *ধামাকা সহকারে শুরু করা যাক*! 🎉",
                ];
            if (relationship === 'partner')
                return [
                    "কিন্তু আপনি আমার কাছে শুধু একজন সঙ্গীর চেয়েও অনেক বেশি...",
                    "আপনি আমার *প্রশান্তি*, আমার জীবনের *সেরা রোমাঞ্চ* এবং আমার *নিরাপদ আশ্রয়*।",
                    "গভীর রাত জেগে প্রতিটি পিক্সেল সাজিয়েছি... ঠিক *আপনারই মতো সুন্দর* করে।",
                    "আপনি কি সেই *বড় সারপ্রাইজের* জন্য প্রস্তুত? ❤️",
                ];
            return [
                "আপনি আমাদের জীবনে অনেক *আনন্দ আর আলো* নিয়ে এসেছেন...",
                "আপনি আপনার মিষ্টি হাসির মতোই *উজ্জ্বল এক উদযাপনের* যোগ্য।",
                "আমরা আমাদের *সম্পূর্ণ হৃদয় উজাড় করে* এটি সাজিয়েছি, শুধু আপনার জন্য...",
                "চলুন *উদযাপনের আনন্দ শুরু করা যাক*! ✨",
            ];
        }
        if (isHindi) {
            if (relationship === 'friend')
                return [
                    "क्योंकि तुम सिर्फ एक दोस्त नहीं हो...",
                    "तुम वो इंसान हो जिस पर मैं *हमेशा भरोसा कर सकता हूँ*! ☕️",
                    "तुम हमारी इस अनोखी दोस्ती जितने ही *शानदार जश्न के हकदार* हो...",
                    "तो चलो इस पार्टी को *धमाकेदार तरीके से शुरू करते हैं*! 🎉",
                ];
            if (relationship === 'partner')
                return [
                    "लेकिन आप मेरे लिए सिर्फ एक साथी से कहीं बढ़कर हैं...",
                    "आप मेरा *सुकून*, मेरा *सबसे बड़ा रोमांच* और मेरा *घर* हैं।",
                    "देर रात तक जागकर हर एक पिक्सल को सजाया है... बिल्कुल *आपकी तरह खूबसूरत*।",
                    "क्या आप इस *बड़े सरप्राइज* के लिए तैयार हैं? ❤️",
                ];
            return [
                "आप हमारी ज़िंदगी में इतनी सारी *खुशियाँ लेकर आते हैं*...",
                "आप अपनी मुस्कान जितने ही *उज्ज्वल जश्न के हकदार* हैं।",
                "हमने अपना *पूरा दिल इसमें लगा दिया है*, सिर्फ आपके लिए...",
                "चलिए *जश्न की शुरुआत करते हैं*! ✨",
            ];
        }
        if (relationship === 'friend')
            return [
                "Because you're not just any friend...",
                "You're the person I can always count on for *chaos & coffee*! ☕️",
                "You deserve something as *epic and iconic* as our friendship...",
                "So let's get this *party started*! 🎉",
            ];
        if (relationship === 'partner')
            return [
                "You are so much more than just a partner to me...",
                "You are my *safe haven*, my *greatest adventure*, and my *home*.",
                "I stayed up late, making sure every pixel was *perfect*... just like you ✨",
                "Are you ready for the *big reveal*? ❤️",
            ];
        return [
            "You bring so much *warmth and love* into our lives...",
            "You deserve a celebration as *bright as your smile*.",
            "We put our whole hearts into this, just for you...",
            "Let the *celebration begin*! ✨",
        ];
    }, [relationship, isHindi, isBengali, isFrench]);

    const finalLines = useMemo(() => {
        if (isFrench) {
            if (relationship === 'partner')
                return [
                    `Mon très cher / Ma très chère *${name || 'Amour'}* 💖`,
                    t('intro.hopeYouFeltHeartbeat'),
                    "Tu es mon *aujourd'hui*, mon *demain*, et mon *toujours* ✨",
                    "Joyeux Anniversaire, *je t'aime infiniment* ! 💖"
                ];
            if (relationship === 'friend')
                return [
                    `Joyeux Anniversaire *${name || 'Légende'}* ! 🚀`,
                    t('intro.cakeChaosNoRegrets'),
                    "Tellement fier(ère) d'avoir un(e) *complice comme toi* 🎉",
                    "Reste *légendaire* ! 😎"
                ];
            return [
                `Cher(ère) *${name || 'Personne Formidable'}* ✨`,
                t('intro.yearOfPureHappiness'),
                t('intro.kindnessReturnTenfold'),
                "Nous *vous aimons* de tout notre cœur ! 💖"
            ];
        }
        if (isBengali) {
            if (relationship === 'partner')
                return [
                    `আমার প্রিয় *${name || 'ভালোবাসা'}* 💖`,
                    t('intro.hopeYouFeltHeartbeat'),
                    "আপনি আমার *বর্তমান*, আমার *আগামীকাল*, এবং আমার *চিরন্তন আশ্রয়* ✨",
                    "শুভ জন্মদিন, *আপনাকে অনন্ত ভালোবাসি*! 💖"
                ];
            if (relationship === 'friend')
                return [
                    `শুভ জন্মদিন *${name || 'লেজেন্ড'}*! 🚀`,
                    t('intro.cakeChaosNoRegrets'),
                    "তোর মতো একজন *পার্টনার-ইন-ক্রাইম* পেয়ে আমি ধন্য 🎉",
                    "সবসময় *লেজেন্ডারি* থাকিস! 😎"
                ];
            return [
                `প্রিয় *${name || 'অসাধারণ মানুষ'}* ✨`,
                t('intro.yearOfPureHappiness'),
                t('intro.kindnessReturnTenfold'),
                "আমরা *আপনাকে অনেক ভালোবাসি*! 💖"
            ];
        }
        if (isHindi) {
            if (relationship === 'partner')
                return [
                    `मेरे प्यारे *${name || 'हमसफ़र'}* 💖`,
                    t('intro.hopeYouFeltHeartbeat'),
                    "आप मेरा *आज*, मेरा *कल*, और मेरी *हर सांस* हैं ✨",
                    "जन्मदिन मुबारक, *मैं आपसे बेपनाह प्यार करता/करती हूँ*! 💖"
                ];
            if (relationship === 'friend')
                return [
                    `जन्मदिन मुबारक *${name || 'लीजेंड'}*! 🚀`,
                    t('intro.cakeChaosNoRegrets'),
                    "तुम्हारे जैसा *पार्टनर-इन-क्राइम* पाकर मैं बहुत खुश हूँ 🎉",
                    "हमेशा *लीजेंडरी* रहो! 😎"
                ];
            return [
                `प्रिय *${name || 'अद्भुत इंसान'}* ✨`,
                t('intro.yearOfPureHappiness'),
                t('intro.kindnessReturnTenfold'),
                "हम आपसे *बहुत प्यार करते हैं*! 💖"
            ];
        }
        if (relationship === 'partner')
            return [
                `My dearest *${name || 'Love'}* 💖`,
                "I hope you felt the *heartbeat* behind every animation...",
                "You are my *today*, my *tomorrow*, and my *always* ✨",
                "Happy Birthday, *I love you infinitely*! 💖"
            ];
        if (relationship === 'friend')
            return [
                `Happy Birthday *${name || 'Legend'}*! 🚀`,
                "May your day be filled with *cake, chaos, and zero regrets*!",
                "I'm so lucky to have a *partner-in-crime* like you 🎉",
                "Stay *legendary*! 😎"
            ];
        return [
            `Dear *${name || 'Wonderful Human'}* ✨`,
            "We all wanted to wish you a year of *pure happiness*...",
            "May your kindness always come back to you *tenfold* ✨",
            "We *love you* so much! 💖"
        ];
    }, [name, relationship, isHindi, isBengali, isFrench, t]);

    const effectiveStoryLines = useMemo(() => {
        if (!age) return storyLines;
        const ageLine = isFrench
            ? `Alors que vous célébrez votre *${age}e année* de pure splendeur... ✨`
            : isBengali
                ? `আপনার জীবনের *${age}-তম বছর* উদযাপন করতে করতে... ✨`
                : isHindi
                    ? `आपके जीवन के *${age}वें खूबसूरत साल* का जश्न मनाते हुए... ✨`
                    : `As you celebrate your *${age}th magical year*... ✨`;
        return [...storyLines.slice(0, -1), ageLine, storyLines[storyLines.length - 1]];
    }, [age, storyLines, isHindi, isBengali, isFrench]);

    const primaryColor = favoriteColor || '#FF2A6D';

    // Cleanup on unmount
    useEffect(() => () => clearTimers(), [clearTimers]);

    // Scene progression orchestrator — ONLY triggers when scene changes
    useEffect(() => {
        clearTimers();

        if (scene === "storytelling") {
            if (typeof navigator !== 'undefined' && navigator.vibrate)
                navigator.vibrate(30);

            const lineInterval = 4200 * speedMultiplier;
            effectiveStoryLines.forEach((_, i) => {
                addTimer(() => {
                    setStoryLine(i);
                    actionsRef.current.playType();
                }, i * lineInterval);
            });

            addTimer(() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate)
                    navigator.vibrate(50);
                actionsRef.current.playWhoosh();
                setScene("fake-chat");
            }, effectiveStoryLines.length * lineInterval + 600);
        }

        if (scene === "post-chat") {
            const chatLineInterval = 3800 * speedMultiplier;
            postChatLines.forEach((_, i) => {
                addTimer(() => {
                    setPostChatLine(i);
                    actionsRef.current.playType();
                }, i * chatLineInterval);
            });

            addTimer(() => {
                actionsRef.current.playReveal();
                actionsRef.current.fireStars();
                actionsRef.current.triggerFlash();
                setScene("special-message");
            }, postChatLines.length * chatLineInterval + 800);
        }

        if (scene === "special-message") {
            addTimer(() => {
                setScene("reveal-sequence");
                setRevealStep("dear-name");
            }, 5500 * speedMultiplier);
        }

        if (scene === "reveal-sequence") {
            addTimer(() => {
                setRevealStep("grand-reveal");
                actionsRef.current.playBoom();
                actionsRef.current.fireCinematicCelebration();
                actionsRef.current.triggerShake();
                actionsRef.current.triggerFlash();
                actionsRef.current.spawnEmojiBurst();
                actionsRef.current.triggerRingPulse();
            }, 3500 * speedMultiplier);

            addTimer(() => {
                actionsRef.current.playPop();
                actionsRef.current.fireConfetti({ particleCount: 200, spread: 160 });
                actionsRef.current.triggerShake();
            }, 5500 * speedMultiplier);

            addTimer(() => {
                actionsRef.current.fireStars();
                actionsRef.current.spawnEmojiBurst();
            }, 7000 * speedMultiplier);

            addTimer(() => {
                actionsRef.current.playPop();
                actionsRef.current.fireConfetti({ particleCount: 150, spread: 120, origin: { x: 0.3, y: 0.5 } });
                actionsRef.current.triggerRingPulse();
            }, 8500 * speedMultiplier);

            addTimer(() => {
                setRevealStep("final-message");
                setFinalLineIndex(0);
                actionsRef.current.playType();
            }, 10000 * speedMultiplier);

            finalLines.forEach((_, i) => {
                if (i > 0) {
                    addTimer(() => {
                        setFinalLineIndex(i);
                        actionsRef.current.playType();
                    }, (10000 + i * 3600) * speedMultiplier);
                }
            });

            const endTime = (10000 + finalLines.length * 3600) * speedMultiplier;
            addTimer(() => {
                actionsRef.current.playBoom();
                actionsRef.current.fireConfetti({ particleCount: 300, spread: 180 });
                actionsRef.current.fireCinematicCelebration();
            }, endTime);

            addTimer(() => setFadeOut(true), endTime + 2000);
            addTimer(() => {
                setScene("done");
                actionsRef.current.onComplete();
            }, endTime + 3500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene, speedMultiplier, effectiveStoryLines.length, postChatLines.length, finalLines.length, clearTimers, addTimer]);

    const handleChatComplete = useCallback(() => {
        actionsRef.current.playWhoosh();
        setScene("post-chat");
        setPostChatLine(0);
    }, []);

    if (scene === "done")
        return null;

    return (
        <div
            className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000 overflow-hidden ${
                fadeOut ? "opacity-0" : "opacity-100"
            } ${shaking ? "animate-screen-shake" : ""}`}
            style={{ background: 'transparent' }}
        >
            {/* Dreamy Ambient Bokeh Auras */}
            <div className="absolute top-[8%] left-[12%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,75,130,0.22)_0%,transparent_70%)] blur-[100px] pointer-events-none animate-subtle-float" />
            <div className="absolute top-[18%] right-[12%] w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,100,0.18)_0%,transparent_70%)] blur-[110px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-[25%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(180,60,140,0.2)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

            <AnimatePresence mode="wait">
                {scene === "storytelling" && (
                    <motion.div
                        key="storytelling"
                        initial={{ scale: 1.08, filter: "blur(12px)", opacity: 0 }}
                        animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                        exit={{ scale: 0.88, filter: "blur(12px)", opacity: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="relative z-50 text-center max-w-4xl mx-auto px-6"
                    >
                        <div className="flex justify-center mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(255,107,107,0.4)] backdrop-blur-md bg-white/10"
                            >
                                ✨
                            </motion.div>
                        </div>

                        {/* Cumulative Storytelling — lines stay stacked vertically with zero collision */}
                        <div className="space-y-5 sm:space-y-7 flex flex-col items-center justify-center w-full">
                            {effectiveStoryLines.slice(0, storyLine + 1).map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{
                                        opacity: i === storyLine ? 1 : 0.72,
                                        y: 0,
                                        scale: i === storyLine ? 1.02 : 0.98,
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <HighlightedText
                                        text={line}
                                        relationship={relationship}
                                        typewriter={i === storyLine}
                                        speed={relationship === 'partner' ? 40 : relationship === 'friend' ? 30 : 35}
                                        delay={i === storyLine ? 150 : 0}
                                        cursor={i === storyLine}
                                        onType={i === storyLine ? playType : undefined}
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-light leading-relaxed"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {scene === "fake-chat" && (
                    <motion.div
                        key="fake-chat"
                        initial={{ y: 80, opacity: 0, rotateX: 30 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -80, opacity: 0, rotateX: -30 }}
                        transition={{ duration: 0.7, type: "spring" }}
                    >
                        <FakeChatScene onComplete={handleChatComplete} />
                    </motion.div>
                )}

                {scene === "post-chat" && (
                    <motion.div
                        key="post-chat"
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.05, filter: "blur(10px)", opacity: 0 }}
                        className="text-center max-w-4xl mx-auto px-6"
                    >
                        <div className="mb-8 flex justify-center">
                            <HeartProgression stage={3} />
                        </div>

                        {/* Cumulative Post-Chat Lines */}
                        <div className="space-y-5 sm:space-y-7 flex flex-col items-center justify-center w-full">
                            {postChatLines.slice(0, postChatLine + 1).map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{
                                        opacity: i === postChatLine ? 1 : 0.75,
                                        y: 0,
                                        scale: i === postChatLine ? 1.02 : 0.98,
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <HighlightedText
                                        text={line}
                                        relationship={relationship}
                                        typewriter={i === postChatLine}
                                        speed={relationship === 'partner' ? 36 : relationship === 'friend' ? 26 : 30}
                                        delay={i === postChatLine ? 150 : 0}
                                        cursor={i === postChatLine}
                                        onType={i === postChatLine ? playType : undefined}
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-medium leading-relaxed"
                                    />
                                </motion.div>
                            ))}
                        </div>
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
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="text-center px-4"
                            >
                                <p className="text-xl md:text-4xl text-muted-foreground mb-4 font-display italic">
                                    {t('intro.thisIsForYou')}
                                </p>
                                <h2
                                    className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[13rem] font-bold text-gradient-romantic text-glow-rose break-words leading-tight"
                                >
                                    <KineticText
                                        text={name || (isFrench ? 'Vous' : isBengali ? 'আপনি' : isHindi ? 'आप' : 'You')}
                                        animation="zoom-in"
                                        delay={500}
                                    />
                                </h2>
                            </motion.div>
                        )}

                        {revealStep === "grand-reveal" && (
                            <div className="text-center px-4">
                                <Balloons count={12} />
                                <div className="flex justify-center mb-6">
                                    <HeartProgression stage={4} />
                                </div>
                                <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black mb-4 break-words leading-tight">
                                    <span className="bg-gradient-to-r from-[var(--color-primary)] via-[hsl(45,100%,65%)] to-[hsl(200,80%,70%)] bg-clip-text text-transparent animate-gradient-shift">
                                        {t('common.happyBirthday')}
                                    </span>
                                </h1>
                                <h2 className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-gradient-romantic text-glow-rose mt-4 break-words">
                                    {name}!
                                </h2>
                            </div>
                        )}

                        {revealStep === "final-message" && (
                            <div className="text-center max-w-4xl mx-auto px-6 min-h-[140px] flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={finalLineIndex}
                                        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
                                        transition={{ duration: 0.7 }}
                                        className="py-4 px-2"
                                    >
                                        <HighlightedText
                                            text={finalLines[finalLineIndex] || ""}
                                            relationship={relationship}
                                            typewriter={true}
                                            speed={35}
                                            delay={100}
                                            cursor={true}
                                            onType={playType}
                                            className={
                                                finalLineIndex === 0
                                                    ? "font-script text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gradient-romantic text-glow-rose"
                                                    : "text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/95 font-light"
                                            }
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
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

            {flashWhite && (
                <div className="fixed inset-0 z-[60] bg-white/40 pointer-events-none animate-flash" />
            )}
            <Sparkles count={8} />
            {ringPulse && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div
                        className="w-64 h-64 rounded-full border-8 animate-ring-expand"
                        style={{ borderColor: primaryColor }}
                    />
                </div>
            )}
        </div>
    );
};
