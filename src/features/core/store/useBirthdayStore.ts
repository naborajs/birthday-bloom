import { create } from 'zustand';
import {
    createFamilyMemberProfile,
    type FamilyMemberProfile,
    type FamilyMemberType,
    type RelationshipMetadata,
    type PrivacyLevel,
} from '../models/familyTemplates';
export type RelationshipType = 'partner' | 'friend' | 'family' | 'sibling' | 'brother' | 'sister' | 'father' | 'mother' | 'grandfather' | 'grandmother' | 'uncle' | 'aunt' | 'cousin' | 'son' | 'daughter' | 'guardian' | 'colleague' | 'mentor';
export type GenderType = 'male' | 'female' | 'other';
export interface BirthdayConfig {
    name: string;
    age: number | null;
    gender: GenderType;
    relationship: RelationshipType;
    favoriteColor: string;
    favoriteEmojis: string[];
    interests: string[];
    customMessage: string;
    birthdayDate: Date | null;
    animationSpeed?: 'slow' | 'moderate' | 'fast';
    animationIntensity?: 'low' | 'medium' | 'high';
    particleCount?: number;
    photos?: string[];
    photoCaptions?: string[];
    videos?: string[];
    senderName?: string;
    letterTitle?: string;
    letterOverride?: string;
    showCakeSection?: boolean;
    showPhotoSection?: boolean;
    showQuizSection?: boolean;
    showHeartTreeSection?: boolean;
    showVideoSection?: boolean;
    showFinalSurprise?: boolean;
    showGiftSection?: boolean;
    finalVideoUrl?: string;
    specialMemories?: {
        text: string;
        image?: string;
    }[];
    familyProfile?: FamilyMemberProfile;
    reducedMotion?: boolean;
    showSkipButton?: boolean;
    soundEffectsEnabled?: boolean;
    language?: 'en' | 'hi' | 'bn' | string;
    password?: string;
    passwordHint?: string;
    passwordFormat?: string;
    passwordRequired?: boolean;
}
interface BirthdayStore {
    config: BirthdayConfig;
    getAnimationPacing: () => 'slow' | 'fast' | 'moderate';
    getMood: () => 'romantic' | 'energetic' | 'warm';
    getLanguage: () => 'en' | 'hi' | 'bn' | string;
}
const parseEnvString = (...values: unknown[]): string => {
    for (const value of values) {
        if (value === undefined || value === null)
            continue;
        const parsed = String(value).trim();
        if (parsed && parsed !== 'undefined' && parsed !== 'null')
            return parsed;
    }
    return '';
};
const parseEnvBoolean = (value: unknown, fallback: boolean): boolean => {
    const parsed = parseEnvString(value).toLowerCase();
    if (!parsed)
        return fallback;
    if (['true', '1', 'yes', 'on', 'enabled'].includes(parsed))
        return true;
    if (['false', '0', 'no', 'off', 'disabled'].includes(parsed))
        return false;
    return fallback;
};
const parseEnvNumber = (value: unknown, fallback: number | null): number | null => {
    const parsed = parseEnvString(value);
    if (!parsed)
        return fallback;
    const numberValue = Number.parseInt(parsed, 10);
    return Number.isFinite(numberValue) ? numberValue : fallback;
};
const parseEnvList = (...values: unknown[]): string[] => {
    const raw = parseEnvString(...values);
    if (!raw)
        return [];
    if (raw.trim().startsWith('[')) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed))
                return parsed.map(String).map((item) => item.trim()).filter(Boolean);
        }
        catch {
            return [];
        }
    }
    return raw
        .split(/[,\n|]/)
        .map((item) => item.trim())
        .filter(Boolean);
};
const parseEnvJson = <T>(value: unknown): T | null => {
    const raw = parseEnvString(value);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw) as T;
    }
    catch {
        return null;
    }
};
const envName = parseEnvString(import.meta.env.VITE_BIRTHDAY_NAME, import.meta.env.VITE_USER_NAME);
const rawRel = (import.meta.env.VITE_BIRTHDAY_RELATIONSHIP || '').toLowerCase();
const envRelationship: RelationshipType = rawRel.includes('partner') || rawRel.includes('love') ? 'partner' :
    rawRel.includes('friend') || rawRel.includes('bestie') ? 'friend' :
        rawRel.includes('brother') ? 'brother' :
            rawRel.includes('sister') ? 'sister' :
                rawRel.includes('father') || rawRel.includes('dad') ? 'father' :
                    rawRel.includes('mother') || rawRel.includes('mom') ? 'mother' :
                        rawRel.includes('grandfather') || rawRel.includes('grandpa') ? 'grandfather' :
                            rawRel.includes('grandmother') || rawRel.includes('grandma') ? 'grandmother' :
                                rawRel.includes('uncle') ? 'uncle' :
                                    rawRel.includes('aunt') ? 'aunt' :
                                        rawRel.includes('cousin') ? 'cousin' :
                                            rawRel.includes('son') ? 'son' :
                                                rawRel.includes('daughter') ? 'daughter' :
                                                    rawRel.includes('guardian') ? 'guardian' :
                                                        rawRel.includes('sibling') ? 'sibling' :
                                                            rawRel.includes('colleague') || rawRel.includes('work') ? 'colleague' :
                                                                rawRel.includes('mentor') || rawRel.includes('teacher') ? 'mentor' :
                                                                    'family';
const envColor = parseEnvString(import.meta.env.VITE_BIRTHDAY_COLOR, import.meta.env.VITE_THEME_COLOR, import.meta.env.VITE_FAVORITE_COLOR) || '#FF6B6B';
const envMessage = parseEnvString(import.meta.env.VITE_BIRTHDAY_CUSTOM_MESSAGE, import.meta.env.VITE_CUSTOM_MESSAGE);
const envSenderName = parseEnvString(import.meta.env.VITE_BIRTHDAY_WISHER_NAME, import.meta.env.VITE_WISHER_NAME);
const envAge = parseEnvNumber(import.meta.env.VITE_BIRTHDAY_AGE, null);
const envGender = (import.meta.env.VITE_BIRTHDAY_GENDER as GenderType) || 'other';
let envDate: Date | null = null;
try {
    if (import.meta.env.VITE_BIRTHDAY_DATE) {
        const cleanDate = import.meta.env.VITE_BIRTHDAY_DATE.replace('TH', 'T');
        envDate = new Date(cleanDate);
    }
}
catch (_e) {
    envDate = null;
}
const envItems = parseEnvList(import.meta.env.VITE_BIRTHDAY_INTERESTS, import.meta.env.VITE_FAVORITE_ITEMS);
const envFavoriteEmojis = parseEnvList(import.meta.env.VITE_FAVORITE_EMOJIS, import.meta.env.VITE_BIRTHDAY_EMOJIS);
const envPhotos = parseEnvList(import.meta.env.VITE_PHOTOS, [
    import.meta.env.VITE_PHOTO_1,
    import.meta.env.VITE_PHOTO_2,
    import.meta.env.VITE_PHOTO_3,
    import.meta.env.VITE_PHOTO_4,
    import.meta.env.VITE_PHOTO_5,
    import.meta.env.VITE_PHOTO_6,
].filter(Boolean).join('|'));
const envPhotoCaptions = parseEnvList(import.meta.env.VITE_PHOTO_CAPTIONS);
const envVideos = [
    import.meta.env.VITE_VIDEO_1,
    import.meta.env.VITE_VIDEO_2,
    import.meta.env.VITE_VIDEO_3,
].map(parseEnvString).filter(Boolean) as string[];
const envLetterTitle = parseEnvString(import.meta.env.VITE_BIRTHDAY_LETTER_TITLE, import.meta.env.VITE_CARD_TITLE_SURPRISE);
const envLetterOverride = parseEnvString(import.meta.env.VITE_BIRTHDAY_LETTER_OVERRIDE).replace(/\\n/g, '\n');
const envShowCake = parseEnvBoolean(import.meta.env.VITE_SHOW_CAKE_SECTION, true);
const envShowPhotos = parseEnvBoolean(import.meta.env.VITE_SHOW_PHOTO_SECTION ?? import.meta.env.VITE_SHOW_PHOTOS_SECTION, true);
const envShowQuiz = parseEnvBoolean(import.meta.env.VITE_SHOW_QUIZ_SECTION, true);
const envShowHeartTree = parseEnvBoolean(import.meta.env.VITE_SHOW_HEART_TREE_SECTION, true);
const envShowVideo = parseEnvBoolean(import.meta.env.VITE_SHOW_VIDEO_SECTION, true);
const envShowFinalSurprise = parseEnvBoolean(import.meta.env.VITE_SHOW_FINAL_SURPRISE, true);
const envShowGift = parseEnvBoolean(import.meta.env.VITE_SHOW_GIFT_SECTION, true);
const envShowSkipButton = parseEnvBoolean(import.meta.env.VITE_SHOW_SKIP_BUTTON, true);
const envReducedMotion = import.meta.env.VITE_REDUCED_MOTION !== undefined
    ? parseEnvBoolean(import.meta.env.VITE_REDUCED_MOTION, false)
    : undefined;
const envSoundEffects = import.meta.env.VITE_SOUND_EFFECTS !== undefined
    ? parseEnvBoolean(import.meta.env.VITE_SOUND_EFFECTS, true)
    : true;
const rawLanguage = parseEnvString(import.meta.env.VITE_LANGUAGE, import.meta.env.VITE_LANG).toLowerCase();
const envLanguage: 'en' | 'hi' | 'bn' =
    rawLanguage === 'hi' || rawLanguage === 'hindi' || rawLanguage === 'in'
        ? 'hi'
        : rawLanguage === 'bn' || rawLanguage === 'bengali' || rawLanguage === 'bangla'
            ? 'bn'
            : 'en';
const envFinalVideo = parseEnvString(import.meta.env.VITE_FINAL_VIDEO_URL);
const envMemories = import.meta.env.VITE_SPECIAL_MEMORIES
    ? String(import.meta.env.VITE_SPECIAL_MEMORIES).split('|').map((m: string) => {
        const [text, image] = m.split(';');
        return { text: text?.trim(), image: image?.trim() };
    })
    : [];
const envPassword = parseEnvString(import.meta.env.VITE_PASSWORD);
const envPasswordHint = parseEnvString(import.meta.env.VITE_PASSWORD_HINT);
const envPasswordFormat = parseEnvString(import.meta.env.VITE_PASSWORD_FORMAT) || 'MMDD';
const envPasswordRequired = import.meta.env.VITE_PASSWORD_REQUIRED !== undefined
    ? parseEnvBoolean(import.meta.env.VITE_PASSWORD_REQUIRED, false)
    : undefined;
const envFamilyProfileJson = parseEnvJson<FamilyMemberProfile>(import.meta.env.VITE_FAMILY_PROFILE_JSON);
const envFamilyType = parseEnvString(import.meta.env.VITE_FAMILY_MEMBER_TYPE) as FamilyMemberType;
const validFamilyTypes: FamilyMemberType[] = [
    'brother',
    'sister',
    'father',
    'mother',
    'grandfather',
    'grandmother',
    'uncle',
    'aunt',
    'cousin',
    'son',
    'daughter',
    'guardian',
    'friend',
    'custom',
];
const envFamilySideRaw = parseEnvString(import.meta.env.VITE_FAMILY_SIDE).toLowerCase();
const envFamilySide: RelationshipMetadata['familySide'] =
    envFamilySideRaw === 'maternal' || envFamilySideRaw === 'paternal' || envFamilySideRaw === 'both' || envFamilySideRaw === 'chosen' || envFamilySideRaw === 'unknown'
        ? envFamilySideRaw
        : undefined;

const envPrivacyRaw = parseEnvString(import.meta.env.VITE_FAMILY_PRIVACY).toLowerCase();
const envPrivacyLevel: PrivacyLevel =
    envPrivacyRaw === 'public' || envPrivacyRaw === 'private'
        ? envPrivacyRaw
        : 'family';

const envFamilyProfile = envFamilyProfileJson ??
    (validFamilyTypes.includes(envFamilyType)
        ? createFamilyMemberProfile(envFamilyType, envName || 'Family Member', envDate ?? undefined, {
            preferredName: parseEnvString(import.meta.env.VITE_FAMILY_PREFERRED_NAME),
            nicknames: parseEnvList(import.meta.env.VITE_FAMILY_NICKNAMES),
            relationshipOverrides: {
                relationshipLabel: parseEnvString(import.meta.env.VITE_FAMILY_RELATIONSHIP_LABEL) || undefined,
                closenessLevel: (parseEnvNumber(import.meta.env.VITE_FAMILY_CLOSENESS, 7) || 7) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
                yearsKnown: parseEnvNumber(import.meta.env.VITE_FAMILY_YEARS_KNOWN, undefined) ?? undefined,
                familySide: envFamilySide,
            },
            privacy: {
                defaultLevel: envPrivacyLevel,
                allowExport: parseEnvBoolean(import.meta.env.VITE_FAMILY_ALLOW_EXPORT, true),
            },
        })
        : undefined);
export const useBirthdayStore = create<BirthdayStore>((set, get) => ({
    config: {
        name: envName,
        age: envAge,
        gender: envGender,
        relationship: envRelationship,
        favoriteColor: envColor,
        favoriteEmojis: envFavoriteEmojis,
        interests: envItems,
        customMessage: envMessage,
        senderName: envSenderName,
        birthdayDate: envDate,
        animationSpeed: (import.meta.env.VITE_ANIMATION_SPEED as 'slow' | 'moderate' | 'fast') || null,
        animationIntensity: (parseEnvString(import.meta.env.VITE_ANIMATION_INTENSITY) as 'low' | 'medium' | 'high') || 'high',
        particleCount: parseEnvNumber(import.meta.env.VITE_PARTICLE_COUNT, 25) ?? 25,
        photos: envPhotos,
        photoCaptions: envPhotoCaptions,
        videos: envVideos,
        letterTitle: envLetterTitle,
        letterOverride: envLetterOverride,
        showCakeSection: envShowCake,
        showPhotoSection: envShowPhotos,
        showQuizSection: envShowQuiz,
        showHeartTreeSection: envShowHeartTree,
        showVideoSection: envShowVideo,
        showFinalSurprise: envShowFinalSurprise,
        showGiftSection: envShowGift,
        showSkipButton: envShowSkipButton,
        reducedMotion: envReducedMotion,
        soundEffectsEnabled: envSoundEffects,
        language: envLanguage,
        finalVideoUrl: envFinalVideo,
        specialMemories: envMemories,
        familyProfile: envFamilyProfile,
        password: envPassword,
        passwordHint: envPasswordHint,
        passwordFormat: envPasswordFormat,
        passwordRequired: envPasswordRequired,
    },
    getAnimationPacing: () => {
        const { relationship, animationSpeed } = get().config;
        if (animationSpeed)
            return animationSpeed;
        if (relationship === 'partner')
            return 'slow';
        if (relationship === 'friend')
            return 'fast';
        return 'moderate';
    },
    getMood: () => {
        const { relationship } = get().config;
        if (relationship === 'partner')
            return 'romantic';
        if (relationship === 'friend')
            return 'energetic';
        return 'warm';
    },
    getLanguage: () => {
        return get().config.language || 'en';
    }
}));
