export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

/**
 * Validates whether a given string is a valid 3-digit or 6-digit hex color (with optional leading #).
 */
export const isValidHexColor = (hex?: string | null): boolean => {
    if (!hex || typeof hex !== 'string') return false;
    const clean = hex.trim().replace(/^#/, '');
    return /^[0-9a-fA-F]{3}$/.test(clean) || /^[0-9a-fA-F]{6}$/.test(clean);
};

/**
 * Converts a hex string into an RGB object with safe fallback to #FF6B6B on invalid input.
 */
export const hexToRGB = (hex: string): RGB => {
    if (!isValidHexColor(hex)) {
        return { r: 255, g: 107, b: 107 };
    }

    const clean = hex.trim().replace(/^#/, '');
    let r = 0, g = 0, b = 0;

    if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16);
        g = parseInt(clean[1] + clean[1], 16);
        b = parseInt(clean[2] + clean[2], 16);
    } else if (clean.length === 6) {
        r = parseInt(clean.substring(0, 2), 16);
        g = parseInt(clean.substring(2, 4), 16);
        b = parseInt(clean.substring(4, 6), 16);
    }

    return { r, g, b };
};

/**
 * Converts a hex string into HSL values with safe fallback.
 */
export const hexToHSL = (hex: string): HSL => {
    const { r: rRaw, g: gRaw, b: bRaw } = hexToRGB(hex);

    const r = rRaw / 255;
    const g = gRaw / 255;
    const b = bRaw / 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    let s = 0;
    let l = 0;

    if (delta === 0) {
        h = 0;
    } else if (cmax === r) {
        h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
};

/**
 * Calculates the relative luminance of a color per WCAG specifications.
 */
export const getLuminance = (hex: string): number => {
    const { r, g, b } = hexToRGB(hex);
    const [rs, gs, bs] = [r, g, b].map((val) => {
        const s = val / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Computes contrast ratio between two hex colors per WCAG 2.1 specs.
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};
