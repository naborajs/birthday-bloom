import { useEffect } from 'react';
import { useBirthdayStore } from '../store/useBirthdayStore';

const hexToRGB = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    }
    else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    return { r, g, b };
};

const hexToHSL = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    }
    else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0)
        h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
};

export const useDynamicTheme = () => {
    const { favoriteColor, relationship, gender } = useBirthdayStore((state) => state.config);
    useEffect(() => {
        const root = document.documentElement;
        const { h, s, l } = hexToHSL(favoriteColor);
        const { r, g, b } = hexToRGB(favoriteColor);
        root.style.setProperty('--color-primary', `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--color-primary-low', `hsl(${h}, ${s}%, ${l * 0.5}%)`);
        root.style.setProperty('--color-primary-glow', `hsla(${h}, ${s}%, ${l}%, 0.4)`);

        if (relationship === 'partner') {
            // Warm romantic velvet rose & amber ambient glow (no pitch black)
            root.style.setProperty(
                '--bg-gradient',
                `radial-gradient(ellipse at 50% 15%, hsl(${h}, 80%, 25%) 0%, hsl(${h}, 65%, 15%) 40%, hsl(${Math.max(0, h - 20)}, 55%, 11%) 75%, hsl(${Math.max(0, h - 35)}, 45%, 8%) 100%)`
            );
            root.style.setProperty('--glow-effect', `0 0 50px hsla(${h}, 85%, 55%, 0.6)`);
            root.style.setProperty('--glass-opacity', '0.12');
            root.style.setProperty('--font-display', '"Playfair Display", "Dancing Script", "Rozha One", "Noto Sans Bengali", "Times New Roman", serif');
            root.style.setProperty('--font-body', '"Quicksand", "Playfair Display", sans-serif');
            root.style.setProperty('--font-quote', '"Dancing Script", "Caveat", "Playfair Display", cursive');
            root.style.setProperty('--animation-pacing', '2s');
            root.style.setProperty('--particle-speed', '0.6');
            root.style.setProperty('--card-radius', '3rem');
        }
        else if (relationship === 'friend') {
            // Electric vibrant celebration ambient
            root.style.setProperty(
                '--bg-gradient',
                `radial-gradient(ellipse at 50% 15%, hsl(${h}, 85%, 26%) 0%, hsl(${h}, 70%, 15%) 45%, hsl(${(h + 40) % 360}, 60%, 12%) 80%, hsl(${(h + 50) % 360}, 50%, 8%) 100%)`
            );
            root.style.setProperty('--glow-effect', `0 8px 35px hsla(${h}, 90%, 60%, 0.5)`);
            root.style.setProperty('--glass-opacity', '0.15');
            root.style.setProperty('--font-display', '"Outfit", "Inter", "Noto Sans Devanagari", "Hind Siliguri", sans-serif');
            root.style.setProperty('--font-body', '"Quicksand", "Inter", sans-serif');
            root.style.setProperty('--font-quote', '"Outfit", sans-serif');
            root.style.setProperty('--animation-pacing', '0.8s');
            root.style.setProperty('--particle-speed', '1.8');
            root.style.setProperty('--card-radius', '1.5rem');
        }
        else {
            // Royal golden warmth & wine ambient
            root.style.setProperty(
                '--bg-gradient',
                `radial-gradient(ellipse at 50% 15%, hsl(${h}, 75%, 24%) 0%, hsl(${h}, 60%, 15%) 45%, hsl(35, 60%, 12%) 80%, hsl(25, 50%, 9%) 100%)`
            );
            root.style.setProperty('--glow-effect', `0 0 40px hsla(${h}, 60%, 50%, 0.5)`);
            root.style.setProperty('--glass-opacity', '0.12');
            root.style.setProperty('--font-display', '"Cinzel", "Playfair Display", "Rozha One", "Noto Sans Bengali", serif');
            root.style.setProperty('--font-body', '"Quicksand", sans-serif');
            root.style.setProperty('--font-quote', '"Playfair Display", serif');
            root.style.setProperty('--animation-pacing', '1.2s');
            root.style.setProperty('--particle-speed', '1');
            root.style.setProperty('--card-radius', '2rem');
        }

        if (gender === 'female') {
            root.style.setProperty('--glow-intensity', '1.2');
            root.style.setProperty('--glass-blur', '25px');
            root.style.setProperty('--color-accent-soft', `hsl(${h}, ${s * 0.85}%, ${l * 1.2}%)`);
        }
        else if (gender === 'male') {
            root.style.setProperty('--glow-intensity', '0.85');
            root.style.setProperty('--glass-blur', '18px');
            root.style.setProperty('--color-accent-soft', `hsl(${h}, ${s * 0.85}%, ${l * 0.85}%)`);
        }
        else {
            root.style.setProperty('--glow-intensity', '1');
            root.style.setProperty('--glass-blur', '20px');
        }
    }, [favoriteColor, relationship, gender]);
};
