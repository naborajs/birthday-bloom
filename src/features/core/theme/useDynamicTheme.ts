import { useEffect } from 'react';
import { useBirthdayStore } from '../store/useBirthdayStore';

const hexToHSL = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return { h, s, l };
};

export const useDynamicTheme = () => {
  const { favoriteColor, relationship } = useBirthdayStore((state) => state.config);

  useEffect(() => {
    const root = document.documentElement;
    const { h, s, l } = hexToHSL(favoriteColor);

    // Core Accent Variables
    root.style.setProperty('--color-primary', `hsl(${h}, ${s}%, ${l}%)`);
    root.style.setProperty('--color-primary-low', `hsl(${h}, ${s}%, ${l * 0.5}%)`);
    root.style.setProperty('--color-primary-glow', `hsl(${h}, ${s}%, ${l}%, 0.3)`);

    // RELATIONSHIP TEMPLATE OVERRIDES
    if (relationship === 'partner') {
      // ROMANTIC TEMPLATE: Deep, Dreamy, Serif
      root.style.setProperty('--bg-gradient', `radial-gradient(circle at 50% 50%, hsl(${h}, 40%, 12%) 0%, #050505 100%)`);
      root.style.setProperty('--glow-effect', `0 0 50px hsl(${h}, 60%, 45%, 0.6)`);
      root.style.setProperty('--glass-opacity', '0.08');
      root.style.setProperty('--font-display', '"Playfair Display", "Times New Roman", serif');
      root.style.setProperty('--animation-pacing', '2s');
      root.style.setProperty('--particle-speed', '0.5');
      root.style.setProperty('--card-radius', '3rem');
    } else if (relationship === 'friend') {
      // ENERGETIC TEMPLATE: Vibrant, Fast, Bold Sans
      root.style.setProperty('--bg-gradient', `linear-gradient(135deg, hsl(${h}, 70%, 15%) 0%, #111111 100%)`);
      root.style.setProperty('--glow-effect', `0 8px 30px hsl(${h}, 90%, 55%, 0.4)`);
      root.style.setProperty('--glass-opacity', '0.15');
      root.style.setProperty('--font-display', '"Inter", "Impact", sans-serif');
      root.style.setProperty('--animation-pacing', '0.8s');
      root.style.setProperty('--particle-speed', '2');
      root.style.setProperty('--card-radius', '1.5rem');
    } else {
      // FAMILY/WARM TEMPLATE: Soft, Elegant, Rounded
      root.style.setProperty('--bg-gradient', `linear-gradient(to bottom, hsl(${h}, 25%, 15%), #0a0a0a)`);
      root.style.setProperty('--glow-effect', `0 0 30px hsl(${h}, 40%, 40%, 0.4)`);
      root.style.setProperty('--glass-opacity', '0.1');
      root.style.setProperty('--font-display', '"Outfit", sans-serif');
      root.style.setProperty('--animation-pacing', '1.2s');
      root.style.setProperty('--particle-speed', '1');
      root.style.setProperty('--card-radius', '2rem');
    }
  }, [favoriteColor, relationship]);
};
