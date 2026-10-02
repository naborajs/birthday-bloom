import { useEffect } from 'react';
import { useBirthdayStore } from '../store/useBirthdayStore';
import { hexToRGB, hexToHSL } from '@/utils/colorUtils';

export const useDynamicTheme = () => {
    const { favoriteColor, relationship, gender } = useBirthdayStore((state) => state.config);
    useEffect(() => {
        const root = document.documentElement;
        const { h, s, l } = hexToHSL(favoriteColor);
        const { r, g, b } = hexToRGB(favoriteColor);

        let bgGradient: string;
        let glowEffect: string;
        let glassOpacity: string;
        let fontDisplay: string;
        let fontBody: string;
        let fontQuote: string;
        let animationPacing: string;
        let particleSpeed: string;
        let cardRadius: string;

        if (relationship === 'partner') {
            bgGradient = `radial-gradient(ellipse at 50% 15%, hsl(${h}, 80%, 25%) 0%, hsl(${h}, 65%, 15%) 40%, hsl(${Math.max(0, h - 20)}, 55%, 11%) 75%, hsl(${Math.max(0, h - 35)}, 45%, 8%) 100%)`;
            glowEffect = `0 0 50px hsla(${h}, 85%, 55%, 0.6)`;
            glassOpacity = '0.12';
            fontDisplay = '"Playfair Display", "Dancing Script", "Rozha One", "Noto Sans Bengali", "Times New Roman", serif';
            fontBody = '"Quicksand", "Playfair Display", sans-serif';
            fontQuote = '"Dancing Script", "Caveat", "Playfair Display", cursive';
            animationPacing = '2s';
            particleSpeed = '0.6';
            cardRadius = '3rem';
        } else if (relationship === 'friend') {
            bgGradient = `radial-gradient(ellipse at 50% 15%, hsl(${h}, 85%, 26%) 0%, hsl(${h}, 70%, 15%) 45%, hsl(${(h + 40) % 360}, 60%, 12%) 80%, hsl(${(h + 50) % 360}, 50%, 8%) 100%)`;
            glowEffect = `0 8px 35px hsla(${h}, 90%, 60%, 0.5)`;
            glassOpacity = '0.15';
            fontDisplay = '"Outfit", "Inter", "Noto Sans Devanagari", "Hind Siliguri", sans-serif';
            fontBody = '"Quicksand", "Inter", sans-serif';
            fontQuote = '"Outfit", sans-serif';
            animationPacing = '0.8s';
            particleSpeed = '1.8';
            cardRadius = '1.5rem';
        } else {
            bgGradient = `radial-gradient(ellipse at 50% 15%, hsl(${h}, 75%, 24%) 0%, hsl(${h}, 60%, 15%) 45%, hsl(35, 60%, 12%) 80%, hsl(25, 50%, 9%) 100%)`;
            glowEffect = `0 0 40px hsla(${h}, 60%, 50%, 0.5)`;
            glassOpacity = '0.12';
            fontDisplay = '"Cinzel", "Playfair Display", "Rozha One", "Noto Sans Bengali", serif';
            fontBody = '"Quicksand", sans-serif';
            fontQuote = '"Playfair Display", serif';
            animationPacing = '1.2s';
            particleSpeed = '1';
            cardRadius = '2rem';
        }

        let genderVars: string;
        if (gender === 'female') {
            genderVars = `--glow-intensity: 1.2; --glass-blur: 25px; --color-accent-soft: hsl(${h}, ${s * 0.85}%, ${l * 1.2}%);`;
        } else if (gender === 'male') {
            genderVars = `--glow-intensity: 0.8; --glass-blur: 15px; --color-accent-soft: hsl(${h}, ${s}%, ${l * 0.8}%);`;
        } else {
            genderVars = `--glow-intensity: 1; --glass-blur: 20px;`;
        }

        root.style.cssText = `--color-primary: hsl(${h}, ${s}%, ${l}%); --color-primary-rgb: ${r}, ${g}, ${b}; --color-primary-low: hsl(${h}, ${s}%, ${l * 0.5}%); --color-primary-glow: hsla(${h}, ${s}%, ${l}%, 0.4); --bg-gradient: ${bgGradient}; --glow-effect: ${glowEffect}; --glass-opacity: ${glassOpacity}; --font-display: ${fontDisplay}; --font-body: ${fontBody}; --font-quote: ${fontQuote}; --animation-pacing: ${animationPacing}; --particle-speed: ${particleSpeed}; --card-radius: ${cardRadius}; ${genderVars}`;
    }, [favoriteColor, relationship, gender]);
};
