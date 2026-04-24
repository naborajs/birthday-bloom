/**
 * Enhanced Audio Manager for Birthday Bloom v2.0+
 * Supports background music, sound effects, voice messages, and songs
 * Prepared for future music integration in v2.1
 */

class AudioSystem {
  private bgmAudio: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private bgmVolume = 0.4;
  private sfxVolume = 0.7;
  private isEnabled = true;

  /**
   * Initialize background music
   */
  initBGM(url: string | null | undefined) {
    if (!url || !this.isEnabled) return;

    try {
      this.bgmAudio = new Audio();
      this.bgmAudio.src = url;
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
      this.bgmAudio.preload = "auto";
      this.bgmAudio.crossOrigin = "anonymous";
    } catch (error) {
      console.error("Failed to initialize BGM:", error);
    }
  }

  /**
   * Initialize sound effect
   */
  initSoundEffect(name: string, url: string) {
    try {
      const audio = new Audio();
      audio.src = url;
      audio.volume = this.sfxVolume;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      this.soundEffects.set(name, audio);
    } catch (error) {
      console.error(`Failed to initialize SFX '${name}':`, error);
    }
  }

  /**
   * Play background music
   */
  playBGM() {
    if (this.bgmAudio && this.isEnabled) {
      this.bgmAudio.play().catch((error) => {
        console.warn("BGM playback failed:", error);
      });
    }
  }

  /**
   * Stop background music
   */
  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  /**
   * Play sound effect
   */
  playEffect(name: string) {
    const audio = this.soundEffects.get(name);
    if (audio && this.isEnabled) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn(`SFX '${name}' playback failed:`, error);
      });
    }
  }

  /**
   * Play multiple effects in sequence
   */
  playSequence(names: string[], delay: number = 200) {
    names.forEach((name, index) => {
      setTimeout(() => this.playEffect(name), delay * index);
    });
  }

  /**
   * Set background music volume (0-1)
   */
  setBGMVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  /**
   * Set sound effects volume (0-1)
   */
  setSFXVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this.soundEffects.forEach((audio) => {
      audio.volume = this.sfxVolume;
    });
  }

  /**
   * Enable/disable all audio
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    }
  }

  /**
   * Cleanup audio resources
   */
  dispose() {
    this.stopBGM();
    if (this.bgmAudio) {
      this.bgmAudio.src = "";
      this.bgmAudio = null;
    }
    this.soundEffects.forEach((audio) => {
      audio.src = "";
    });
    this.soundEffects.clear();
  }
}

// Create singleton instance
export const audioSystem = new AudioSystem();

/**
 * Audio presets for different templates/moods
 */
export const AUDIO_PRESETS = {
  romantic: {
    bgm: "https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3",
    effects: {
      pop: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      boom: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    },
  },
  fun: {
    bgm: "https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3",
    effects: {
      pop: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      boom: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    },
  },
  energetic: {
    bgm: "https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3",
    effects: {
      pop: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      boom: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    },
  },
};

/**
 * Future audio features (v2.1+)
 * These are prepared for implementation but not yet activated
 */
export const FUTURE_AUDIO_FEATURES = {
  // Birthday song integration
  BIRTHDAY_SONG: {
    enabled: false,
    url: import.meta.env.VITE_SONG_URL || "",
    startTime: 3, // seconds
    fadeOutDuration: 2, // seconds
  },

  // Voice message feature
  VOICE_MESSAGE: {
    enabled: false,
    url: import.meta.env.VITE_VOICE_MESSAGE_URL || "",
    autoPlay: true,
    triggerAt: "after-intro", // 'after-intro' | 'before-finale' | 'on-demand'
  },

  // Custom playlist support
  PLAYLIST: {
    enabled: false,
    songs: [] as string[],
    shuffle: false,
    repeat: true,
  },

  // Beat sync animations (requires beat detection)
  BEAT_SYNC: {
    enabled: false,
    sensitivity: 0.7,
    animationTypes: ["pulse", "bounce", "rotate"],
  },
};
