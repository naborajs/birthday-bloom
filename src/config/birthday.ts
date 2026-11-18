import { normalizeImageUrl } from "@/utils/mediaUtils";

const parseEnvStr = (val: unknown): string | null => {
    if (!val)
        return null;
    let str = String(val).trim();
    str = str.replace(/^["']|["']$/g, "").trim();
    if (str === "" || str === "null" || str === "undefined")
        return null;
    return str;
};

const rawPhotosList = parseEnvStr(import.meta.env.VITE_PHOTOS || import.meta.env.VITE_PHOTOGRAPHS);
const splitPhotos = rawPhotosList ? rawPhotosList.split(/[|,]/).map(s => s.trim()).filter(Boolean) : [];

const rawPhoto1 = parseEnvStr(import.meta.env.VITE_PHOTO_1) ||
    parseEnvStr(import.meta.env.VITE_PHOTO) ||
    parseEnvStr(import.meta.env.VITE_PHOTOGRAPH) ||
    parseEnvStr(import.meta.env.VITE_IMAGE) ||
    parseEnvStr(import.meta.env.VITE_IMAGE_1) ||
    splitPhotos[0] ||
    null;

const rawPhoto2 = parseEnvStr(import.meta.env.VITE_PHOTO_2) ||
    parseEnvStr(import.meta.env.VITE_IMAGE_2) ||
    splitPhotos[1] ||
    null;

const rawPhoto3 = parseEnvStr(import.meta.env.VITE_PHOTO_3) ||
    parseEnvStr(import.meta.env.VITE_IMAGE_3) ||
    splitPhotos[2] ||
    null;

const envPhoto1 = rawPhoto1 ? normalizeImageUrl(rawPhoto1) : null;
const envPhoto2 = rawPhoto2 ? normalizeImageUrl(rawPhoto2) : null;
const envPhoto3 = rawPhoto3 ? normalizeImageUrl(rawPhoto3) : null;
const envBgm = parseEnvStr(import.meta.env.VITE_BGM_URL) || parseEnvStr(import.meta.env.VITE_SOUND_URL);
const envSoundEffectsRaw = parseEnvStr(import.meta.env.VITE_SOUND_EFFECTS);
const envSoundEffects = envSoundEffectsRaw !== null
    ? !['false', '0', 'no', 'off', 'disabled'].includes(envSoundEffectsRaw.toLowerCase())
    : true;

export const PHOTO_ASSETS = {
    photo1: envPhoto1,
    photo2: envPhoto2,
    photo3: envPhoto3,
};

export const AUDIO_ASSETS = {
    bgmUrl: envBgm,
    soundEffectsEnabled: envSoundEffects,
};
