import { useMemo } from 'react';
import { EMOTIONAL_LETTERS } from '@/config/templates';
import { RelationshipType, GenderType } from './store/useBirthdayStore';

export const getHighlySpecificLetter = (
  name: string,
  relationship: RelationshipType,
  gender: GenderType,
  interests: string[] = []
) => {
  const isFemale = gender === 'female';
  const isMale = gender === 'male';

  // 1. Partner Case
  if (relationship === 'partner') {
    return isFemale ? EMOTIONAL_LETTERS.partner.female : EMOTIONAL_LETTERS.partner.male;
  }

  // 2. Friend Case (with gender-specific nuances)
  if (relationship === 'friend') {
    if (isFemale) return EMOTIONAL_LETTERS.friend.friendly; // "Bestie" style
    if (isMale) return EMOTIONAL_LETTERS.friend.legend; // "Legend" style
    return EMOTIONAL_LETTERS.friend.romantic; // Neutral/Romantic fallback
  }

  // 3. Sibling Case
  if (relationship === 'sibling') {
    return EMOTIONAL_LETTERS.sibling;
  }

  // 4. Colleague / Mentor
  if (relationship === 'colleague') return EMOTIONAL_LETTERS.colleague;
  if (relationship === 'mentor') return EMOTIONAL_LETTERS.mentor;

  // 5. Family (Default Fallback)
  return EMOTIONAL_LETTERS.family;
};

export const getInterestBasedTheme = (interests: string[]) => {
  const lowerInterests = interests.map(i => i.toLowerCase().trim());
  
  if (lowerInterests.includes('car')) return 'automotive';
  if (lowerInterests.includes('music')) return 'melodic';
  if (lowerInterests.includes('coding')) return 'matrix';
  if (lowerInterests.includes('gaming')) return 'pixel';
  
  return 'classic';
};
