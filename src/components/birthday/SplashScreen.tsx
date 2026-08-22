import { useState } from "react";
import { useSoundManager } from "./SoundManager";
import { HeartProgression } from "./HeartProgression";
import { useTranslation } from "@/i18n";
interface SplashScreenProps {
    onStart: () => void;
}
export const SplashScreen = ({ onStart }: SplashScreenProps) => {
    const [tapped, setTapped] = useState(false);
    const { startMusic } = useSoundManager();
    const { t } = useTranslation();
    const handleTap = () => {
        setTapped(true);
        startMusic();
        setTimeout(onStart, 800);
    };
    return (<div className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-800 ${tapped ? "opacity-0 scale-110" : "opacity-100 scale-100"}`} style={{
            background: "linear-gradient(135deg, hsl(280, 60%, 8%) 0%, hsl(300, 40%, 12%) 50%, hsl(330, 50%, 10%) 100%)",
        }} onClick={handleTap}>
      
      <div className="mb-6 animate-float-balloon">
        <HeartProgression stage={1}/>
      </div>

      <div className="text-7xl md:text-8xl animate-cake-glow mb-6">🎂</div>
      <h2 className="font-display text-2xl md:text-4xl text-foreground animate-glow-pulse mb-10">
        {t('splash.specialSurpriseAwaits')}
      </h2>
      <div className="animate-pulse">
        <p className="text-muted-foreground text-lg md:text-xl tracking-widest uppercase">
          {t('splash.tapAnywhereToBegin')}
        </p>
      </div>

      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (<div key={i} className="absolute rounded-full" style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${[330, 270, 45, 200][i % 4]}, 80%, 60%)`,
                opacity: 0.3 + Math.random() * 0.4,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            }}/>))}
      </div>
    </div>);
};
