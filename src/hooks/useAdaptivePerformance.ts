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

export const useAdaptivePerformance = (): PerformanceProfile => {
    const [profile, setProfile] = useState<PerformanceProfile>(() => getDevicePerformanceProfile());

    useEffect(() => {
        // 1. Re-evaluate on window resize (e.g. tablet orientation change or window docking)
        const handleResize = () => {
            setProfile(getDevicePerformanceProfile());
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // 2. Battery API integration (where supported by browser, e.g. Chrome / Android)
        let batteryInstance: BatteryManager | null = null;
        let batteryHandler: (() => void) | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = navigator as any;
        if (typeof nav !== 'undefined' && typeof nav.getBattery === 'function') {
            nav.getBattery().then((battery: BatteryManager) => {
                batteryInstance = battery;

                batteryHandler = () => {
                    // If battery is low (< 20%) and not charging, throttle down to low tier
                    if (!battery.charging && battery.level <= 0.2) {
                        setProfile((prev) => ({
                            ...prev,
                            tier: 'low',
                            dpr: 1,
                            maxParticles: 8,
                            enableCursorTrail: false,
                            enableMultiCanvas: false,
                            enableComplexShaders: false,
                            enableHeavyBlur: false,
                            recommendedFrameCap: 30,
                        }));
                    } else {
                        setProfile(getDevicePerformanceProfile());
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
            window.removeEventListener('resize', handleResize);
            if (batteryInstance && batteryHandler) {
                batteryInstance.removeEventListener('levelchange', batteryHandler);
                batteryInstance.removeEventListener('chargingchange', batteryHandler);
            }
        };
    }, []);

    return profile;
};
