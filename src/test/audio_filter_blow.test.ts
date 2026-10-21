import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMicrophoneBlow } from '@/hooks/useMicrophoneBlow';

describe('Microphone Blow High-Pass Audio Graph Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('creates biquad highpass filter and connects between source and analyser', async () => {
        const mockFilter = {
            type: '',
            frequency: { value: 0 },
            connect: vi.fn(),
        };

        const mockAnalyser = {
            fftSize: 0,
            smoothingTimeConstant: 0,
            frequencyBinCount: 128,
            getByteFrequencyData: vi.fn(),
            connect: vi.fn(),
        };

        const mockSource = {
            connect: vi.fn(),
        };

        const mockAudioContext = {
            state: 'running',
            createMediaStreamSource: vi.fn().mockReturnValue(mockSource),
            createBiquadFilter: vi.fn().mockReturnValue(mockFilter),
            createAnalyser: vi.fn().mockReturnValue(mockAnalyser),
            resume: vi.fn().mockResolvedValue(undefined),
            close: vi.fn().mockResolvedValue(undefined),
        };

        // Mock window.AudioContext
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).AudioContext = vi.fn().mockImplementation(() => mockAudioContext);

        const mockStream = {
            getTracks: () => [{ stop: vi.fn() }],
        };

        // Mock getUserMedia
        Object.defineProperty(navigator, 'mediaDevices', {
            value: {
                getUserMedia: vi.fn().mockResolvedValue(mockStream),
            },
            configurable: true,
        });

        const onBlow = vi.fn();
        const { result } = renderHook(() => useMicrophoneBlow({ onBlow }));

        await act(async () => {
            await result.current.startListening();
        });

        // Verify filter settings
        expect(mockAudioContext.createBiquadFilter).toHaveBeenCalled();
        expect(mockFilter.type).toBe('highpass');
        expect(mockFilter.frequency.value).toBe(50);

        // Verify graph connections: source -> filter -> analyser
        expect(mockSource.connect).toHaveBeenCalledWith(mockFilter);
        expect(mockFilter.connect).toHaveBeenCalledWith(mockAnalyser);

        // Trigger manual blow fallback
        act(() => {
            result.current.triggerManualBlow();
        });

        expect(onBlow).toHaveBeenCalledTimes(1);
    });

    it('gracefully handles missing mediaDevices', async () => {
        Object.defineProperty(navigator, 'mediaDevices', {
            value: undefined,
            configurable: true,
        });

        const { result } = renderHook(() => useMicrophoneBlow());

        await act(async () => {
            await result.current.startListening();
        });

        expect(result.current.permission).toBe('unsupported');
    });
});
