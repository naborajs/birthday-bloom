import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMicrophoneBlow } from '@/hooks/useMicrophoneBlow';

describe('useMicrophoneBlow Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('initializes in idle state when disabled', () => {
        const { result } = renderHook(() =>
            useMicrophoneBlow({ enabled: false })
        );

        expect(result.current.isListening).toBe(false);
        expect(result.current.blowIntensity).toBe(0);
        expect(result.current.progress).toBe(0);
    });

    it('triggers manual blow callback when user taps or clicks fallback', () => {
        const onBlowMock = vi.fn();
        const { result } = renderHook(() =>
            useMicrophoneBlow({ enabled: true, onBlow: onBlowMock })
        );

        act(() => {
            result.current.triggerManualBlow();
        });

        expect(result.current.blowIntensity).toBe(1);
        expect(result.current.progress).toBe(1);
        expect(onBlowMock).toHaveBeenCalledTimes(1);
    });

    it('gracefully handles missing mediaDevices in unsupported environments', async () => {
        const originalMediaDevices = navigator.mediaDevices;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (navigator as any).mediaDevices;

        const { result } = renderHook(() =>
            useMicrophoneBlow({ enabled: true })
        );

        await act(async () => {
            await result.current.startListening();
        });

        expect(result.current.permission).toBe('unsupported');
        expect(result.current.isListening).toBe(false);

        // Restore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).mediaDevices = originalMediaDevices;
    });
});
