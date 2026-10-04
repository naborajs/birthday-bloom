import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseMicrophoneBlowOptions {
    enabled?: boolean;
    onBlow?: () => void;
    threshold?: number; // Normalized blow intensity threshold (0.0 to 1.0)
    requiredDurationMs?: number; // How long sustained blowing is required (e.g. 500ms)
    sensitivity?: number; // Multiplier for audio gain/energy
}

export type MicrophonePermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface UseMicrophoneBlowReturn {
    isListening: boolean;
    blowIntensity: number; // 0 to 1, smoothed
    progress: number; // 0 to 1, completion progress towards blowing out candle
    permission: MicrophonePermissionState;
    startListening: () => Promise<void>;
    stopListening: () => void;
    triggerManualBlow: () => void;
}

export const useMicrophoneBlow = ({
    enabled = false,
    onBlow,
    threshold = 0.35,
    requiredDurationMs = 550,
    sensitivity = 1.2,
}: UseMicrophoneBlowOptions = {}): UseMicrophoneBlowReturn => {
    const [isListening, setIsListening] = useState(false);
    const [blowIntensity, setBlowIntensity] = useState(0);
    const [progress, setProgress] = useState(0);
    const [permission, setPermission] = useState<MicrophonePermissionState>(() => {
        if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
            return 'unsupported';
        }
        return 'prompt';
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const blowAccumulatorRef = useRef<number>(0);
    const hasTriggeredRef = useRef<boolean>(false);
    const lastTimestampRef = useRef<number | null>(null);
    const smoothedIntensityRef = useRef<number>(0);

    const onBlowRef = useRef(onBlow);
    useEffect(() => {
        onBlowRef.current = onBlow;
    });

    const stopListening = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                try {
                    track.stop();
                } catch {
                    // Ignore track stop errors
                }
            });
            streamRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            try {
                audioContextRef.current.close();
            } catch {
                // Ignore context close errors
            }
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        lastTimestampRef.current = null;
        setIsListening(false);
        setBlowIntensity(0);
    }, []);

    const triggerManualBlow = useCallback(() => {
        if (hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;
        stopListening();
        setBlowIntensity(1);
        setProgress(1);
        if (onBlowRef.current) {
            onBlowRef.current();
        }
    }, [stopListening]);

    const startListening = useCallback(async () => {
        if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
            setPermission('unsupported');
            return;
        }

        // Avoid double-starting
        if (streamRef.current || hasTriggeredRef.current) {
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            streamRef.current = stream;
            setPermission('granted');
            setIsListening(true);

            // Setup Web Audio graph
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const audioCtx = new AudioCtx();
            audioContextRef.current = audioCtx;

            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.2;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const analyzeFrame = (timestamp: number) => {
                if (!analyserRef.current || hasTriggeredRef.current) return;

                if (lastTimestampRef.current === null) {
                    lastTimestampRef.current = timestamp;
                }
                const dt = Math.min(100, timestamp - lastTimestampRef.current);
                lastTimestampRef.current = timestamp;

                analyserRef.current.getByteFrequencyData(dataArray);

                // Analyze breath turbulence: blowing produces heavy acoustic power
                // in the low-to-mid spectrum (approx 80Hz - 600Hz, corresponding to bins 1 to 8)
                let lowEnergy = 0;
                const lowBins = Math.min(8, bufferLength);
                for (let i = 1; i <= lowBins; i++) {
                    lowEnergy += dataArray[i];
                }
                const avgLow = (lowEnergy / lowBins) * sensitivity;

                // Normalized raw intensity (0.0 to 1.0)
                const rawIntensity = Math.min(1, Math.max(0, (avgLow - 35) / 100));

                // Smooth low-pass interpolation for flicker physics
                smoothedIntensityRef.current = smoothedIntensityRef.current * 0.65 + rawIntensity * 0.35;
                const currentIntensity = Number(smoothedIntensityRef.current.toFixed(3));
                setBlowIntensity(currentIntensity);

                // Accumulate breath energy
                if (currentIntensity >= threshold) {
                    blowAccumulatorRef.current += dt * (currentIntensity / threshold);
                } else {
                    // Decay gently when breathing pauses
                    blowAccumulatorRef.current = Math.max(0, blowAccumulatorRef.current - dt * 0.8);
                }

                const currentProgress = Math.min(1, blowAccumulatorRef.current / requiredDurationMs);
                setProgress(Number(currentProgress.toFixed(2)));

                // Threshold reached: flame extinguished!
                if (currentProgress >= 1 && !hasTriggeredRef.current) {
                    hasTriggeredRef.current = true;
                    stopListening();
                    if (onBlowRef.current) {
                        onBlowRef.current();
                    }
                    return;
                }

                rafIdRef.current = requestAnimationFrame(analyzeFrame);
            };

            rafIdRef.current = requestAnimationFrame(analyzeFrame);
        } catch {
            setPermission('denied');
            setIsListening(false);
        }
    }, [requiredDurationMs, sensitivity, stopListening, threshold]);

    // Manage lifecycle based on `enabled` prop
    useEffect(() => {
        if (enabled && !hasTriggeredRef.current) {
            hasTriggeredRef.current = false;
            blowAccumulatorRef.current = 0;
            smoothedIntensityRef.current = 0;
            setProgress(0);
            startListening();
        } else if (!enabled) {
            stopListening();
        }

        return () => {
            stopListening();
        };
    }, [enabled, startListening, stopListening]);

    return {
        isListening,
        blowIntensity,
        progress,
        permission,
        startListening,
        stopListening,
        triggerManualBlow,
    };
};
