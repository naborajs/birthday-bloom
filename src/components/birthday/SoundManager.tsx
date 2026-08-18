import { useCallback, useRef } from "react";
import { AUDIO_ASSETS } from "@/config/birthday";
const AUDIO_URLS = {
    bgMusic: AUDIO_ASSETS.bgmUrl || "https://cdn.pixabay.com/audio/2024/09/03/audio_73147814c8.mp3",
    typeClick: "https://www.soundjay.com/communication/sounds/typing-on-computer-keyboard-01.mp3",
    whoosh: "https://cdn.pixabay.com/audio/2022/03/24/audio_1c5e3e06.mp3",
    reveal: "https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3",
    pop: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c836a148.mp3",
    boom: "https://cdn.pixabay.com/audio/2022/03/10/audio_783d4a0231.mp3",
};
class AudioManager {
    private bgMusic: HTMLAudioElement | null = null;
    private started = false;
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
            this.bgMusic.volume = 0.25;
            this.bgMusic.play().catch(() => {
                const playOnInteraction = () => {
                    this.bgMusic?.play();
                    document.removeEventListener('click', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
            });
        }
        catch (e) {
            console.debug("Autoplay failed or blocked:", e);
        }
    }
    fadeOutBgMusic(duration = 2000) {
        if (!this.bgMusic)
            return;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = this.bgMusic.volume / steps;
        let step = 0;
        const interval = setInterval(() => {
            if (this.bgMusic && step < steps) {
                this.bgMusic.volume = Math.max(0, this.bgMusic.volume - volumeStep);
                step++;
            }
            else {
                clearInterval(interval);
                this.bgMusic?.pause();
            }
        }, stepTime);
    }
    setBgVolume(vol: number) {
        if (this.bgMusic)
            this.bgMusic.volume = Math.max(0, Math.min(1, vol));
    }
    playEffect(type: "typeClick" | "whoosh" | "reveal" | "pop" | "boom", volume = 0.4) {
        try {
            const audio = new Audio(AUDIO_URLS[type]);
            audio.volume = volume;
            audio.play().catch(() => { });
        }
        catch (e) {
            console.debug("Audio effect playback failed:", e);
        }
    }
    stop() {
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
    return { startMusic, playType, playWhoosh, playReveal, playPop, playBoom, fadeOut, setBgVolume };
};
