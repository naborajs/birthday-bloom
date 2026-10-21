import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDevicePerformanceProfile, isBatteryLow } from '@/utils/deviceTier';

describe('Reduced Motion & Battery Throttling Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('assigns low tier and reduced particles when prefers-reduced-motion is true', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        const profile = getDevicePerformanceProfile();

        expect(profile.prefersReducedMotion).toBe(true);
        expect(profile.tier).toBe('low');
        expect(profile.maxParticles).toBeLessThanOrEqual(4);
    });

    it('correctly reports battery low status when discharging and below 20%', async () => {
        const mockBattery = {
            charging: false,
            level: 0.15,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).getBattery = vi.fn().mockResolvedValue(mockBattery);

        const isLow = await isBatteryLow();
        expect(isLow).toBe(true);
    });

    it('reports not low battery when charging even below 20%', async () => {
        const mockBattery = {
            charging: true,
            level: 0.15,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).getBattery = vi.fn().mockResolvedValue(mockBattery);

        const isLow = await isBatteryLow();
        expect(isLow).toBe(false);
    });
});
