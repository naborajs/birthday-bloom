import { useState, useEffect } from 'react';
import { getDevicePerformanceProfile, type PerformanceProfile } from '@/utils/deviceTier';

interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
    onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
}

const profileKeys: Array<keyof PerformanceProfile> = [
    'tier',
    'dpr',
    'shadowMapSize',
    'maxParticles',
    'enableCursorTrail',
    'enableMultiCanvas',
    'enableComplexShaders',
    'enableHeavyBlur',
    'recommendedFrameCap',
    'isMobile',
    'prefersReducedMotion',
];

const profilesEqual = (a: PerformanceProfile, b: PerformanceProfile): boolean =>
    profileKeys.every((key) => a[key] === b[key]);

export const useAdaptivePerformance = (): PerformanceProfile => {
    const [profile, setProfile] = useState<PerformanceProfile>(() => getDevicePerformanceProfile());

    useEffect(() => {
        // 1. Re-evaluate on window resize (e.g. tablet orientation change or window docking).
        // Debounced so dragging a window doesn't rebuild the profile on every pixel and
        // cascade re-renders through every component that consumes this hook.
        let resizeTimer: ReturnType<typeof setTimeout> | null = null;
        let cancelled = false;

        const updateProfile = (next?: PerformanceProfile) => {
            if (cancelled) return;
            const candidate = next ?? getDevicePerformanceProfile();
            setProfile((prev) => (profilesEqual(prev, candidate) ? prev : candidate));
        };

        const handleResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeTimer = null;
                updateProfile();
            }, 150);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // 1b. Listen for prefers-reduced-motion OS changes
        const motionQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
        const handleMotionChange = () => updateProfile();
        if (motionQuery) {
            motionQuery.addEventListener('change', handleMotionChange);
        }

        // 2. Battery API integration (where supported by browser, e.g. Chrome / Android)
        let batteryInstance: BatteryManager | null = null;
        let batteryHandler: (() => void) | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = navigator as any;
        if (typeof nav !== 'undefined' && typeof nav.getBattery === 'function') {
            nav.getBattery().then((battery: BatteryManager) => {
                if (cancelled) return;
                batteryInstance = battery;

                batteryHandler = () => {
                    // If battery is low (< 20%) and not charging, throttle down to low tier
                    if (!battery.charging && battery.level <= 0.2) {
                        updateProfile({
                            ...getDevicePerformanceProfile(),
                            tier: 'low',
                            dpr: 1,
                            shadowMapSize: 256,
                            maxParticles: 8,
                            enableCursorTrail: false,
                            enableMultiCanvas: false,
                            enableComplexShaders: false,
                            enableHeavyBlur: false,
                            recommendedFrameCap: 30,
                        });
                    } else {
                        updateProfile();
                    }
                };

                battery.addEventListener('levelchange', batteryHandler);
                battery.addEventListener('chargingchange', batteryHandler);
                batteryHandler();
            }).catch(() => {
                // Ignore battery query failures
            });
        }

        return () => {
            cancelled = true;
            if (resizeTimer) clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
            if (motionQuery) {
                motionQuery.removeEventListener('change', handleMotionChange);
            }
            if (batteryInstance && batteryHandler) {
                batteryInstance.removeEventListener('levelchange', batteryHandler);
                batteryInstance.removeEventListener('chargingchange', batteryHandler);
            }
        };
    }, []);

    return profile;
};
