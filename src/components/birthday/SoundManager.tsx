import { useCallback, useMemo, useRef } from "react";
import { AUDIO_ASSETS } from "@/config/birthday";
const AUDIO_URLS = {
    bgMusic: AUDIO_ASSETS.bgmUrl || "https://cdn.pixabay.com/audio/2024/09/03/audio_73147814c8.mp3",
    typeClick: "https://www.soundjay.com/communication/sounds/typing-on-computer-keyboard-01.mp3",
    whoosh: "https://cdn.pixabay.com/audio/2022/03/24/audio_1c5e3e06.mp3",
    reveal: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3",
    pop: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c836a148.mp3",
    boom: "https://cdn.pixabay.com/audio/2022/03/10/audio_783d4a0231.mp3",
};
type SoundEffectType = "typeClick" | "whoosh" | "reveal" | "pop" | "boom";

const MAX_POOL_SIZE = 3;
const TYPE_CLICK_MIN_INTERVAL_MS = 45;

class AudioManager {
    private bgMusic: HTMLAudioElement | null = null;
    private started = false;
    private muted = false;
    private fadeInterval: ReturnType<typeof setInterval> | null = null;
    private effectPools: Partial<Record<SoundEffectType, HTMLAudioElement[]>> = {};
    private poolCursors: Partial<Record<SoundEffectType, number>> = {};
    private lastTypeClickTime = 0;

    start() {
        if (this.started)
            return;
        this.started = true;
        this.playBgMusic();
    }
    private playBgMusic() {
        try {
            this.bgMusic = new Audio(AUDIO_URLS.bgMusic);
            this.bgMusic.loop = true;
            this.bgMusic.volume = this.muted ? 0 : 0.25;
            this.bgMusic.play().catch(() => {
                const playOnInteraction = () => {
                    this.bgMusic?.play().catch(() => {});
                    ['click', 'touchstart', 'pointerdown'].forEach((evt) => {
                        document.removeEventListener(evt, playOnInteraction);
                    });
                };
                ['click', 'touchstart', 'pointerdown'].forEach((evt) => {
                    document.addEventListener(evt, playOnInteraction, { passive: true });
                });
            });
        }
        catch (e) {
            console.debug("Autoplay failed or blocked:", e);
        }
    }
    fadeOutBgMusic(duration = 2000) {
        if (!this.bgMusic)
            return;
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = this.bgMusic.volume / steps;
        let step = 0;
        this.fadeInterval = setInterval(() => {
            if (this.bgMusic && step < steps) {
                this.bgMusic.volume = Math.max(0, this.bgMusic.volume - volumeStep);
                step++;
            }
            else {
                if (this.fadeInterval) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                }
                this.bgMusic?.pause();
            }
        }, stepTime);
    }
    setBgVolume(vol: number) {
        const clamped = Math.max(0, Math.min(1, vol));
        this.muted = clamped === 0;
        if (this.bgMusic)
            this.bgMusic.volume = clamped;
    }
    setMuted(muted: boolean) {
        this.muted = muted;
        if (this.bgMusic) {
            this.bgMusic.volume = muted ? 0 : 0.25;
        }
    }
    playEffect(type: SoundEffectType, volume = 0.4) {
        if (this.muted || AUDIO_ASSETS.soundEffectsEnabled === false)
            return;
        if (type === "typeClick") {
            const now = typeof performance !== "undefined" ? performance.now() : Date.now();
            if (now - this.lastTypeClickTime < TYPE_CLICK_MIN_INTERVAL_MS) {
                return;
            }
            this.lastTypeClickTime = now;
        }
        try {
            let pool = this.effectPools[type];
            if (!pool) {
                pool = [];
                this.effectPools[type] = pool;
            }
            let audio: HTMLAudioElement;
            if (pool.length < MAX_POOL_SIZE) {
                audio = new Audio(AUDIO_URLS[type]);
                audio.preload = "auto";
                pool.push(audio);
            } else {
                const cursor = (this.poolCursors[type] ?? 0) % MAX_POOL_SIZE;
                this.poolCursors[type] = cursor + 1;
                audio = pool[cursor];
                try {
                    audio.currentTime = 0;
                } catch {
                    // Ignore currentTime reset errors if audio metadata is not yet loaded
                }
            }
            audio.volume = volume;
            audio.play().catch(() => { });
        }
        catch (e) {
            console.debug("Audio effect playback failed:", e);
        }
    }
    stop() {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
        this.bgMusic?.pause();
        this.bgMusic = null;
        this.started = false;
    }
}
const globalAudioManager = new AudioManager();
export const useSoundManager = () => {
    const managerRef = useRef(globalAudioManager);
    const startMusic = useCallback(() => {
        managerRef.current.start();
    }, []);
    const playType = useCallback(() => {
        managerRef.current.playEffect("typeClick", 0.15);
    }, []);
    const playWhoosh = useCallback(() => {
        managerRef.current.playEffect("whoosh", 0.3);
    }, []);
    const playReveal = useCallback(() => {
        managerRef.current.playEffect("reveal", 0.5);
    }, []);
    const playPop = useCallback(() => {
        managerRef.current.playEffect("pop", 0.4);
    }, []);
    const playBoom = useCallback(() => {
        managerRef.current.playEffect("boom", 0.6);
    }, []);
    const fadeOut = useCallback((duration?: number) => {
        managerRef.current.fadeOutBgMusic(duration);
    }, []);
    const setBgVolume = useCallback((vol: number) => {
        managerRef.current.setBgVolume(vol);
    }, []);
    const setMuted = useCallback((muted: boolean) => {
        managerRef.current.setMuted(muted);
    }, []);
    return useMemo(() => ({
        startMusic,
        playType,
        playWhoosh,
        playReveal,
        playPop,
        playBoom,
        fadeOut,
        setBgVolume,
        setMuted,
    }), [startMusic, playType, playWhoosh, playReveal, playPop, playBoom, fadeOut, setBgVolume, setMuted]);
};
