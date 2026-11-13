import type { BirthdayConfig } from './useBirthdayStore';
import { normalizeRelationship, normalizeGender } from './relationshipUtils';
import { normalizeLanguage } from '@/i18n/languageUtils';

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
    const rawRel = params.get('rel') || params.get('relationship') || params.get('archetype');
    if (rawRel && rawRel.trim()) {
      overrides.relationship = normalizeRelationship(rawRel);
    }

    // Language
    const rawLang = params.get('lang') || params.get('language') || params.get('locale');
    if (rawLang && rawLang.trim()) {
      overrides.language = normalizeLanguage(rawLang);
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
    const rawGender = params.get('gender');
    if (rawGender && rawGender.trim()) {
      overrides.gender = normalizeGender(rawGender);
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

    // Password lock & hints
    const rawPass = params.get('password') || params.get('pass');
    if (rawPass && rawPass.trim()) {
      overrides.password = rawPass.trim();
      overrides.passwordRequired = true;
    }
    const rawLock = params.get('lock') || params.get('locked');
    if (rawLock !== null) {
      overrides.passwordRequired = !['false', '0', 'no', 'off'].includes(rawLock.toLowerCase().trim());
      if (overrides.passwordRequired && !overrides.password) {
        overrides.password = '1234';
      }
    }
    const rawHint = params.get('hint') || params.get('passwordHint');
    if (rawHint && rawHint.trim()) {
      overrides.passwordHint = rawHint.trim();
    }

    return overrides;
  } catch {
    return {};
  }
};
