import type { BirthdayConfig, GenderType } from './useBirthdayStore';

/**
 * Safely parses URL query parameters to allow custom, shareable birthday celebration links.
 * Works seamlessly in both browser and test environments.
 */
export const parseBirthdayUrlParams = (searchString?: string): Partial<BirthdayConfig> => {
  if (typeof window === 'undefined' && !searchString) {
    return {};
  }

  const query = searchString !== undefined 
    ? searchString 
    : (typeof window !== 'undefined' ? window.location.search : '');

  if (!query || query.length <= 1) {
    return {};
  }

  try {
    const params = new URLSearchParams(query);
    const overrides: Partial<BirthdayConfig> = {};

    // Recipient Name
    const name = params.get('name') || params.get('recipient') || params.get('to');
    if (name && name.trim()) {
      overrides.name = name.trim();
    }

    // Relationship archetype
    const rawRel = (params.get('rel') || params.get('relationship') || params.get('archetype') || '').toLowerCase().trim();
    if (rawRel) {
      if (rawRel.includes('partner') || rawRel.includes('love') || rawRel === 'romantic') {
        overrides.relationship = 'partner';
      } else if (rawRel.includes('friend') || rawRel.includes('bestie') || rawRel === 'fun' || rawRel === 'energetic') {
        overrides.relationship = 'friend';
      } else if (rawRel.includes('brother')) {
        overrides.relationship = 'brother';
      } else if (rawRel.includes('sister')) {
        overrides.relationship = 'sister';
      } else if (rawRel.includes('father') || rawRel.includes('dad')) {
        overrides.relationship = 'father';
      } else if (rawRel.includes('mother') || rawRel.includes('mom')) {
        overrides.relationship = 'mother';
      } else if (rawRel.includes('grandfather') || rawRel.includes('grandpa')) {
        overrides.relationship = 'grandfather';
      } else if (rawRel.includes('grandmother') || rawRel.includes('grandma')) {
        overrides.relationship = 'grandmother';
      } else if (rawRel.includes('uncle')) {
        overrides.relationship = 'uncle';
      } else if (rawRel.includes('aunt')) {
        overrides.relationship = 'aunt';
      } else if (rawRel.includes('cousin')) {
        overrides.relationship = 'cousin';
      } else if (rawRel.includes('son')) {
        overrides.relationship = 'son';
      } else if (rawRel.includes('daughter')) {
        overrides.relationship = 'daughter';
      } else if (rawRel.includes('guardian')) {
        overrides.relationship = 'guardian';
      } else if (rawRel.includes('sibling')) {
        overrides.relationship = 'sibling';
      } else if (rawRel.includes('colleague') || rawRel.includes('work')) {
        overrides.relationship = 'colleague';
      } else if (rawRel.includes('mentor') || rawRel.includes('teacher')) {
        overrides.relationship = 'mentor';
      } else if (rawRel.includes('family')) {
        overrides.relationship = 'family';
      }
    }

    // Language
    const rawLang = (params.get('lang') || params.get('language') || params.get('locale') || '').toLowerCase().trim();
    if (rawLang) {
      if (rawLang === 'hi' || rawLang === 'hindi' || rawLang === 'in') {
        overrides.language = 'hi';
      } else if (rawLang === 'bn' || rawLang === 'bengali' || rawLang === 'bangla') {
        overrides.language = 'bn';
      } else if (rawLang === 'fr' || rawLang === 'french' || rawLang === 'francais' || rawLang === 'française' || rawLang === 'francaise') {
        overrides.language = 'fr';
      } else if (rawLang === 'en' || rawLang === 'english') {
        overrides.language = 'en';
      }
    }

    // Age
    const rawAge = params.get('age');
    if (rawAge) {
      const parsedAge = parseInt(rawAge, 10);
      if (!isNaN(parsedAge) && parsedAge > 0 && parsedAge < 150) {
        overrides.age = parsedAge;
      }
    }

    // Gender
    const rawGender = (params.get('gender') || '').toLowerCase().trim();
    if (rawGender === 'male' || rawGender === 'female' || rawGender === 'other') {
      overrides.gender = rawGender as GenderType;
    }

    // Sender / Wisher Name
    const sender = params.get('sender') || params.get('wisher') || params.get('from');
    if (sender && sender.trim()) {
      overrides.senderName = sender.trim();
    }

    // Custom Message
    const msg = params.get('msg') || params.get('message') || params.get('note');
    if (msg && msg.trim()) {
      overrides.customMessage = msg.trim();
    }

    // Theme Color
    const color = params.get('color') || params.get('theme');
    if (color && color.trim()) {
      const cleanColor = color.trim().startsWith('#') ? color.trim() : `#${color.trim()}`;
      if (/^#[0-9A-Fa-f]{3,8}$/.test(cleanColor)) {
        overrides.favoriteColor = cleanColor;
      }
    }

    // Pacing / Speed
    const rawSpeed = (params.get('speed') || params.get('pacing') || '').toLowerCase().trim();
    if (rawSpeed === 'slow' || rawSpeed === 'moderate' || rawSpeed === 'fast') {
      overrides.animationSpeed = rawSpeed;
    }

    // Sound Effects
    const rawSound = params.get('sound');
    if (rawSound !== null) {
      overrides.soundEffectsEnabled = !['false', '0', 'no', 'off', 'disabled'].includes(rawSound.toLowerCase().trim());
    }

    return overrides;
  } catch {
    return {};
  }
};
