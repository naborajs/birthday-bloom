/**
 * 🌸 BIRTHDAY BLOOM - CONFIGURATION STORE
 * -----------------------------------------
 * Authored by: NABORAJ SARKAR (https://github.com/naborajs)
 */

import { create } from 'zustand';

export type RelationshipType = 'partner' | 'friend' | 'family' | 'sibling' | 'colleague' | 'mentor';
export type GenderType = 'male' | 'female' | 'other';

export interface BirthdayConfig {
  name: string;
  age: number | null;
  gender: GenderType;
  relationship: RelationshipType;
  favoriteColor: string; // Hex code
  interests: string[];
  customMessage: string;
  birthdayDate: Date | null;
  animationSpeed?: 'slow' | 'moderate' | 'fast';
  particleCount?: number;
  videos?: string[];
  letterTitle?: string;
  letterOverride?: string;
  showCakeSection?: boolean;
  showVideoSection?: boolean;
  finalVideoUrl?: string;
  specialMemories?: { text: string; image?: string }[];
}

interface BirthdayStore {
  config: BirthdayConfig;
  isConfigured: boolean;
  setConfig: (config: Partial<BirthdayConfig>) => void;
  completeConfiguration: () => void;
  getAnimationPacing: () => 'slow' | 'fast' | 'moderate';
  getMood: () => 'romantic' | 'energetic' | 'warm';
}

const envName = import.meta.env.VITE_BIRTHDAY_NAME || '';

// Normalize Relationship
const rawRel = (import.meta.env.VITE_BIRTHDAY_RELATIONSHIP || '').toLowerCase();
const envRelationship: RelationshipType = 
  rawRel.includes('partner') || rawRel.includes('love') ? 'partner' :
  rawRel.includes('friend') || rawRel.includes('bestie') ? 'friend' :
  rawRel.includes('sibling') || rawRel.includes('brother') || rawRel.includes('sister') ? 'sibling' :
  rawRel.includes('colleague') || rawRel.includes('work') ? 'colleague' :
  rawRel.includes('mentor') || rawRel.includes('teacher') ? 'mentor' :
  'family';

const envColor = import.meta.env.VITE_BIRTHDAY_COLOR || import.meta.env.VITE_FAVORITE_COLOR || '#FF6B6B';
const envMessage = import.meta.env.VITE_BIRTHDAY_CUSTOM_MESSAGE || import.meta.env.VITE_CUSTOM_MESSAGE || '';
const envAge = import.meta.env.VITE_BIRTHDAY_AGE ? parseInt(import.meta.env.VITE_BIRTHDAY_AGE, 10) : null;
const envGender = (import.meta.env.VITE_BIRTHDAY_GENDER as GenderType) || 'other';

// Robust Date Parsing
let envDate: Date | null = null;
try {
  if (import.meta.env.VITE_BIRTHDAY_DATE) {
    // Handle typos like 2010-10-24TH:00:00
    const cleanDate = import.meta.env.VITE_BIRTHDAY_DATE.replace('TH', 'T');
    envDate = new Date(cleanDate);
  }
} catch (e) {
  envDate = null;
}

const envItems = import.meta.env.VITE_BIRTHDAY_INTERESTS || import.meta.env.VITE_FAVORITE_ITEMS 
  ? (import.meta.env.VITE_BIRTHDAY_INTERESTS || import.meta.env.VITE_FAVORITE_ITEMS).split(',').map((s: string) => s.trim()) 
  : [];

const envVideos = [
  import.meta.env.VITE_VIDEO_1,
  import.meta.env.VITE_VIDEO_2,
  import.meta.env.VITE_VIDEO_3,
].filter(Boolean) as string[];

const envLetterTitle = import.meta.env.VITE_BIRTHDAY_LETTER_TITLE || '';
const envLetterOverride = import.meta.env.VITE_BIRTHDAY_LETTER_OVERRIDE || '';
const envShowCake = import.meta.env.VITE_SHOW_CAKE_SECTION !== 'false';
const envShowVideo = import.meta.env.VITE_SHOW_VIDEO_SECTION !== 'false';
const envFinalVideo = import.meta.env.VITE_FINAL_VIDEO_URL || '';
const envMemories = import.meta.env.VITE_SPECIAL_MEMORIES 
  ? import.meta.env.VITE_SPECIAL_MEMORIES.split('|').map((m: string) => {
      const [text, image] = m.split(';');
      return { text: text?.trim(), image: image?.trim() };
    })
  : [];

export const useBirthdayStore = create<BirthdayStore>((set, get) => ({
  config: {
    name: envName,
    age: envAge,
    gender: envGender,
    relationship: envRelationship,
    favoriteColor: envColor,
    interests: envItems,
    customMessage: envMessage,
    birthdayDate: envDate,
    animationSpeed: (import.meta.env.VITE_ANIMATION_SPEED as any) || null,
    particleCount: import.meta.env.VITE_PARTICLE_COUNT ? parseInt(import.meta.env.VITE_PARTICLE_COUNT, 10) : 25,
    videos: envVideos,
    letterTitle: envLetterTitle,
    letterOverride: envLetterOverride,
    showCakeSection: envShowCake,
    showVideoSection: envShowVideo,
    finalVideoUrl: envFinalVideo,
    specialMemories: envMemories,
  },
  isConfigured: !!envName,
  setConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),
  completeConfiguration: () => set({ isConfigured: true }),

  getAnimationPacing: () => {
    const { relationship, animationSpeed } = get().config;
    if (animationSpeed) return animationSpeed;
    if (relationship === 'partner') return 'slow';
    if (relationship === 'friend') return 'fast';
    return 'moderate';
  },
  getMood: () => {
    const { relationship } = get().config;
    if (relationship === 'partner') return 'romantic';
    if (relationship === 'friend') return 'energetic';
    return 'warm';
  }
}));
