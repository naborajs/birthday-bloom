export type RelationshipType =
    | 'partner'
    | 'friend'
    | 'family'
    | 'sibling'
    | 'brother'
    | 'sister'
    | 'father'
    | 'mother'
    | 'grandfather'
    | 'grandmother'
    | 'uncle'
    | 'aunt'
    | 'cousin'
    | 'son'
    | 'daughter'
    | 'guardian'
    | 'colleague'
    | 'mentor';

export type GenderType = 'male' | 'female' | 'other';

/**
 * Normalizes input string to a canonical RelationshipType archetype.
 */
export const normalizeRelationship = (raw?: unknown): RelationshipType => {
    if (!raw) return 'family';
    const rel = String(raw).toLowerCase().trim();
    if (!rel) return 'family';

    if (
        rel.includes('partner') ||
        rel.includes('love') ||
        rel.includes('romantic') ||
        rel.includes('girlfriend') ||
        rel.includes('boyfriend') ||
        rel.includes('wife') ||
        rel.includes('husband') ||
        rel.includes('soulmate') ||
        rel.includes('crush') ||
        rel === 'gf' ||
        rel === 'bf'
    ) {
        return 'partner';
    }
    if (
        rel.includes('friend') ||
        rel.includes('bestie') ||
        rel.includes('buddy') ||
        rel.includes('fun') ||
        rel.includes('energetic')
    ) {
        return 'friend';
    }
    if (rel.includes('brother')) return 'brother';
    if (rel.includes('sister')) return 'sister';
    if (rel.includes('father') || rel.includes('dad')) return 'father';
    if (rel.includes('mother') || rel.includes('mom')) return 'mother';
    if (rel.includes('grandfather') || rel.includes('grandpa')) return 'grandfather';
    if (rel.includes('grandmother') || rel.includes('grandma')) return 'grandmother';
    if (rel.includes('uncle')) return 'uncle';
    if (rel.includes('aunt')) return 'aunt';
    if (rel.includes('cousin')) return 'cousin';
    if (rel.includes('son')) return 'son';
    if (rel.includes('daughter')) return 'daughter';
    if (rel.includes('guardian')) return 'guardian';
    if (rel.includes('sibling')) return 'sibling';
    if (rel.includes('colleague') || rel.includes('work')) return 'colleague';
    if (rel.includes('mentor') || rel.includes('teacher')) return 'mentor';
    return 'family';
};

/**
 * Normalizes input string to a canonical GenderType.
 */
export const normalizeGender = (raw?: unknown): GenderType => {
    if (!raw) return 'other';
    const g = String(raw).toLowerCase().trim();
    if (
        g.includes('female') ||
        g.includes('girl') ||
        g.includes('woman') ||
        g.includes('she') ||
        g.includes('her')
    ) {
        return 'female';
    }
    if (
        g.includes('male') ||
        g.includes('boy') ||
        g.includes('man') ||
        g.includes('he') ||
        g.includes('him')
    ) {
        return 'male';
    }
    return 'other';
};
