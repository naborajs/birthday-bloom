export type PerformanceTier = 'low' | 'balanced' | 'high';

export interface PerformanceProfile {
    tier: PerformanceTier;
    isMobile: boolean;
    dpr: number;
    shadowMapSize: number;
    maxParticles: number;
    enableCursorTrail: boolean;
    enableMultiCanvas: boolean;
    enableComplexShaders: boolean;
    enableHeavyBlur: boolean;
    recommendedFrameCap: number; // e.g. 30fps for low/mobile, 60fps for high
}

/**
 * Determines device performance profile dynamically based on hardware,
 * battery state, touch/screen factor, and environment overrides.
 */
export const getDevicePerformanceProfile = (): PerformanceProfile => {
    if (typeof window === 'undefined') {
        return {
            tier: 'balanced',
            isMobile: false,
            dpr: 1,
            shadowMapSize: 512,
            maxParticles: 20,
            enableCursorTrail: false,
            enableMultiCanvas: false,
            enableComplexShaders: false,
            enableHeavyBlur: false,
            recommendedFrameCap: 60,
        };
    }

    // 1. Check explicit environment force override
    const forceHigh = import.meta.env.VITE_FORCE_HIGH_GRAPHICS === 'true';
    if (forceHigh) {
        return {
            tier: 'high',
            isMobile: window.innerWidth < 768,
            dpr: Math.min(window.devicePixelRatio || 1, 2),
            shadowMapSize: 1024,
            maxParticles: 45,
            enableCursorTrail: !('ontouchstart' in window),
            enableMultiCanvas: true,
            enableComplexShaders: true,
            enableHeavyBlur: true,
            recommendedFrameCap: 60,
        };
    }

    // 2. Hardware and environment auto-detection (Mobile takes precedence over generic env variables)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 600;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobile = isTouch && (isSmallScreen || isMobileUA);

    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deviceMemory = (navigator as any).deviceMemory || 4;

    // Detect if device is resource-constrained or mobile
    const isConstrained = isMobile || hardwareConcurrency <= 4 || deviceMemory <= 3;

    if (isConstrained) {
        return {
            tier: 'low',
            isMobile,
            dpr: 1, // Cap DPR to 1 on mobile to avoid 4x-9x fragment shading fillrate bottlenecks
            shadowMapSize: 256,
            maxParticles: 12,
            enableCursorTrail: false, // Disabling cursor trail on touch removes hundreds of RAF listeners
            enableMultiCanvas: false, // Run at most 1 ambient canvas effect instead of 4 overlapping
            enableComplexShaders: false,
            enableHeavyBlur: false, // Avoid expensive multi-pass backdrop-filters
            recommendedFrameCap: 30,
        };
    }

    // 3. Desktop / non-constrained device preferences
    const envIntensity = String(import.meta.env.VITE_ANIMATION_INTENSITY || '').toLowerCase();
    if (envIntensity === 'low') {
        return {
            tier: 'low',
            isMobile: false,
            dpr: 1,
            shadowMapSize: 256,
            maxParticles: 10,
            enableCursorTrail: false,
            enableMultiCanvas: false,
            enableComplexShaders: false,
            enableHeavyBlur: false,
            recommendedFrameCap: 30,
        };
    }

    if (envIntensity === 'high') {
        return {
            tier: 'high',
            isMobile: false,
            dpr: Math.min(window.devicePixelRatio || 1, 2),
            shadowMapSize: 1024,
            maxParticles: 40,
            enableCursorTrail: !isTouch,
            enableMultiCanvas: true,
            enableComplexShaders: true,
            enableHeavyBlur: true,
            recommendedFrameCap: 60,
        };
    }

    // Balanced desktop / modern tablet default
    return {
        tier: 'balanced',
        isMobile: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        shadowMapSize: 512,
        maxParticles: 25,
        enableCursorTrail: !isTouch,
        enableMultiCanvas: true,
        enableComplexShaders: true,
        enableHeavyBlur: true,
        recommendedFrameCap: 60,
    };
};

/**
 * Helper to query battery low state (< 20% and discharging)
 */
export const isBatteryLow = async (): Promise<boolean> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    if (nav && typeof nav.getBattery === 'function') {
        try {
            const battery = await nav.getBattery();
            return Boolean(!battery.charging && battery.level <= 0.2);
        } catch {
            return false;
        }
    }
    return false;
};
