/**
 * Clamps audio volume strictly between 0.0 (muted) and 1.0 (maximum).
 */
export const clampVolume = (volume: number): number => {
    if (isNaN(volume)) return 0;
    return Math.max(0, Math.min(1, volume));
};

/**
 * Checks whether the given volume is effectively silent/muted.
 */
export const isAudioMuted = (volume: number): boolean => {
    return clampVolume(volume) <= 0.001;
};

/**
 * Calculates volume step per interval for smooth cross-fades.
 */
export const calculateFadeStep = (
    currentVolume: number,
    targetVolume: number,
    totalSteps: number
): number => {
    if (totalSteps <= 0) return 0;
    const diff = clampVolume(targetVolume) - clampVolume(currentVolume);
    return diff / totalSteps;
};

/**
 * Calculates effective background music volume given mute state and base level.
 */
export const getEffectiveBgVolume = (
    isMuted: boolean,
    baseVolume: number = 0.25
): number => {
    if (isMuted) return 0;
    return clampVolume(baseVolume);
};
