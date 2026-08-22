import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, HelpCircle, ArrowRight } from "lucide-react";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useSoundManager } from "./SoundManager";
import { getEffectivePassword } from "@/utils/password";
import { useConfetti } from "./Confetti";
import { useTranslation } from "@/i18n";
interface PasswordUnlockProps {
    onUnlock: () => void;
}
export const PasswordUnlock = ({ onUnlock }: PasswordUnlockProps) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [localFlash, setLocalFlash] = useState(false);
    const { config } = useBirthdayStore();
    const { t, isHindi, isBengali } = useTranslation();
    const { playType, playWhoosh, playReveal, playBoom } = useSoundManager();
    const { fireStars, fireConfetti } = useConfetti();
    const primaryColor = config.favoriteColor || "#FF6B6B";
    const expectedPassword = getEffectivePassword(config);
    const isNumericFormat = ['MMDD', 'DDMM', 'YYYYMMDD', 'YYYY'].includes(config.passwordFormat || 'MMDD');
    useEffect(() => {
        if (attempts >= 2) {
            setShowHint(true);
        }
    }, [attempts]);
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (unlocked)
            return;
        const inputClean = password.trim();
        if (inputClean.toLowerCase() === expectedPassword.toLowerCase()) {
            setUnlocked(true);
            setError(false);
            setLocalFlash(true);
            playReveal();
            playBoom();
            fireConfetti({ particleCount: 150, spread: 80 });
            fireStars();
            setTimeout(() => setLocalFlash(false), 300);
            setTimeout(onUnlock, 1200);
        }
        else {
            setError(true);
            setAttempts(prev => prev + 1);
            playWhoosh();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            setTimeout(() => setError(false), 600);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        playType();
    };
    const getDynamicHint = () => {
        if (config.passwordHint)
            return config.passwordHint;
        const format = config.passwordFormat || 'MMDD';
        if (isBengali) {
            switch (format.toUpperCase()) {
                case 'MMDD':
                    return "ইঙ্গিত: আজকের বিশেষ তারিখ (ফরম্যাট: MMDD, যেমন ২৪শে এপ্রিলের জন্য 0424) 📅";
                case 'DDMM':
                    return "ইঙ্গিত: আজকের বিশেষ তারিখ (ফরম্যাট: DDMM, যেমন ২৪শে এপ্রিলের জন্য 2404) 📅";
                case 'YYYYMMDD':
                    return "ইঙ্গিত: সালসহ জন্মদিনের তারিখ (ফরম্যাট: YYYYMMDD, যেমন 20010424) 📅";
                case 'YYYY-MM-DD':
                    return "ইঙ্গিত: পুরো জন্মতারিখ (ফরম্যাট: YYYY-MM-DD, যেমন 2001-04-24) 📅";
                case 'MM-DD':
                    return "ইঙ্গিত: জন্মদিনের মাস এবং দিন (ফরম্যাট: MM-DD, যেমন 04-24) 📅";
                case 'DD-MM':
                    return "ইঙ্গিত: জন্মদিনের দিন এবং মাস (ফরম্যাট: DD-MM, যেমন 24-04) 📅";
                case 'YYYY':
                    return "ইঙ্গিত: জন্মসাল (ফরম্যাট: YYYY, যেমন 2001) 📅";
                default:
                    return "ইঙ্গিত: সেই বিশেষ তারিখ যা আমরা আজ উদযাপন করছি! 🎂";
            }
        }
        if (isHindi) {
            switch (format.toUpperCase()) {
                case 'MMDD':
                    return "संकेत: आज की खास तारीख (प्रारूप: MMDD, उदा. 24 अप्रैल के लिए 0424) 📅";
                case 'DDMM':
                    return "संकेत: आज की खास तारीख (प्रारूप: DDMM, उदा. 24 अप्रैल के लिए 2404) 📅";
                case 'YYYYMMDD':
                    return "संकेत: साल सहित जन्मदिन की तारीख (प्रारूप: YYYYMMDD, उदा. 20010424) 📅";
                case 'YYYY-MM-DD':
                    return "संकेत: पूरा जन्मदिन (प्रारूप: YYYY-MM-DD, उदा. 2001-04-24) 📅";
                case 'MM-DD':
                    return "संकेत: जन्मदिन का महीना और दिन (प्रारूप: MM-DD, उदा. 04-24) 📅";
                case 'DD-MM':
                    return "संकेत: जन्मदिन का दिन और महीना (प्रारूप: DD-MM, उदा. 24-04) 📅";
                case 'YYYY':
                    return "संकेत: जन्म का साल (प्रारूप: YYYY, उदा. 2001) 📅";
                default:
                    return "संकेत: वह खास तारीख जिसका आज हम जश्न मना रहे हैं! 🎂";
            }
        }
        switch (format.toUpperCase()) {
            case 'MMDD':
                return "Hint: Today's special date (Format: MMDD, e.g. 0424 for April 24th) 📅";
            case 'DDMM':
                return "Hint: Today's special date (Format: DDMM, e.g. 2404 for April 24th) 📅";
            case 'YYYYMMDD':
                return "Hint: Birthday date including year (Format: YYYYMMDD, e.g. 20010424) 📅";
            case 'YYYY-MM-DD':
                return "Hint: Full birthdate (Format: YYYY-MM-DD, e.g. 2001-04-24) 📅";
            case 'MM-DD':
                return "Hint: Birthday month and day (Format: MM-DD, e.g. 04-24) 📅";
            case 'DD-MM':
                return "Hint: Birthday day and month (Format: DD-MM, e.g. 24-04) 📅";
            case 'YYYY':
                return "Hint: The birth year (Format: YYYY, e.g. 2001) 📅";
            default:
                return "Hint: The special date we are celebrating today! 🎂";
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      
      <AnimatePresence>
        {localFlash && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-white pointer-events-none" transition={{ duration: 0.2 }}/>)}
      </AnimatePresence>

      <motion.div animate={error ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}} transition={{ duration: 0.5, ease: "easeInOut" }} className="w-full max-w-md backdrop-blur-2xl border border-white/10 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)",
            borderRadius: "var(--card-radius, 2rem)",
            boxShadow: `0 30px 100px -25px ${primaryColor}20, inset 0 0 20px rgba(255,255,255,0.05)`,
        }}>
        <div className="flex justify-center mb-6 relative">
          <motion.div animate={unlocked ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 10, -10, 0] } : { scale: [1, 1.05, 1] }} transition={unlocked ? { duration: 0.6 } : { duration: 3, repeat: Infinity }} className="w-16 h-16 rounded-2xl flex items-center justify-center border text-white shadow-lg transition-colors" style={{
            backgroundColor: unlocked ? `${primaryColor}30` : "rgba(255,255,255,0.05)",
            borderColor: unlocked ? primaryColor : "rgba(255,255,255,0.1)",
        }}>
            {unlocked ? <Unlock className="w-8 h-8" style={{ color: primaryColor }}/> : <Lock className="w-8 h-8 opacity-75"/>}
          </motion.div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-wide">
          {unlocked ? t('common.verificationSuccessful') : t('common.unlockMagic')}
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase mb-8">
          {unlocked ? t('common.preparingSurprise') : t('common.enterPasscode')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input type="text" inputMode={isNumericFormat ? "numeric" : "text"} pattern={isNumericFormat ? "[0-9]*" : undefined} value={password} onChange={handleInputChange} placeholder={isNumericFormat ? "••••" : t('common.enterPasscodePlaceholder')} disabled={unlocked} className="w-full text-center py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-2xl md:text-3xl font-bold tracking-widest text-white focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:tracking-normal placeholder:font-normal placeholder:text-base focus:bg-white/10" style={{
            borderColor: error ? "#EF4444" : unlocked ? primaryColor : "rgba(255,255,255,0.1)",
            boxShadow: error
                ? "0 0 30px rgba(239, 68, 68, 0.2)"
                : unlocked
                    ? `0 0 30px ${primaryColor}30`
                    : "none"
        }} autoFocus autoComplete="off"/>
          </div>

          {error && (<motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 font-semibold text-sm animate-pulse">
              {t('common.passcodeIncorrect')}
            </motion.p>)}

          <div className="flex gap-4">
            <button type="button" onClick={() => setShowHint(prev => !prev)} className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-semibold flex-1">
              <HelpCircle className="w-4 h-4"/>
              <span>{showHint ? t('common.hideHint') : t('common.needHint')}</span>
            </button>

            <button type="submit" disabled={unlocked || !password} className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-black font-black uppercase text-sm tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex-[1.5]" style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}dd)`,
            boxShadow: `0 10px 30px -10px ${primaryColor}60`,
        }}>
              <span>{t('common.unlock')}</span>
              <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        </form>

        <AnimatePresence>
          {showHint && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-6 text-left border-t border-white/5 pt-4">
              <p className="text-white/60 text-sm italic bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">
                {getDynamicHint()}
              </p>
            </motion.div>)}
        </AnimatePresence>
      </motion.div>
    </div>);
};
