import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDevicePerformanceProfile, isBatteryLow } from '../utils/deviceTier';
import { renderHook, act } from '@testing-library/react';
import { useAdaptivePerformance } from '../hooks/useAdaptivePerformance';

describe('Adaptive Performance and Device Tiering', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalDevicePixelRatio = window.devicePixelRatio;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
    Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: originalDevicePixelRatio });
  });

  it('correctly provides a performance profile in browser environment', () => {
    const profile = getDevicePerformanceProfile();
    expect(profile).toBeDefined();
    expect(['low', 'balanced', 'high']).toContain(profile.tier);
    expect(typeof profile.dpr).toBe('number');
    expect(profile.dpr).toBeGreaterThanOrEqual(1);
    expect(typeof profile.maxParticles).toBe('number');
  });

  it('caps DPR and disables cursor trail for mobile constrained devices', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
    Object.defineProperty(window, 'devicePixelRatio', { writable: true, configurable: true, value: 3 });
    Object.defineProperty(navigator, 'maxTouchPoints', { writable: true, configurable: true, value: 5 });

    const profile = getDevicePerformanceProfile();
    expect(profile.dpr).toBe(1);
    expect(profile.enableCursorTrail).toBe(false);
    expect(profile.enableMultiCanvas).toBe(false);
    expect(profile.tier).toBe('low');
  });

  it('detects low battery state when battery level <= 20% and discharging', async () => {
    const mockBattery = {
      level: 0.15,
      charging: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const nav = navigator as unknown as { getBattery?: () => Promise<unknown> };
    nav.getBattery = vi.fn().mockResolvedValue(mockBattery);

    const isLow = await isBatteryLow();
    expect(isLow).toBe(true);
  });

  it('reports battery not low when charging even if level is low', async () => {
    const mockBattery = {
      level: 0.1,
      charging: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const nav = navigator as unknown as { getBattery?: () => Promise<unknown> };
    nav.getBattery = vi.fn().mockResolvedValue(mockBattery);

    const isLow = await isBatteryLow();
    expect(isLow).toBe(false);
  });

  it('reports battery not low when getBattery API is unavailable', async () => {
    const nav = navigator as unknown as { getBattery?: unknown };
    delete nav.getBattery;

    const isLow = await isBatteryLow();
    expect(isLow).toBe(false);
  });

  it('useAdaptivePerformance hook returns reactive profile', () => {
    const { result } = renderHook(() => useAdaptivePerformance());
    expect(result.current.profile).toBeDefined();
    expect(typeof result.current.isLowPowerMode).toBe('boolean');
    expect(typeof result.current.isMobile).toBe('boolean');

    // Trigger window resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.profile).toBeDefined();
  });
});
