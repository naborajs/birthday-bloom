import { EMOTIONAL_LETTERS } from '@/config/templates';
import { HINDI_EMOTIONAL_LETTERS, HINDI_BIG_WISHES } from '@/config/hindiTemplates';
import { BENGALI_EMOTIONAL_LETTERS, BENGALI_BIG_WISHES } from '@/config/bengaliTemplates';
import { FRENCH_EMOTIONAL_LETTERS, FRENCH_BIG_WISHES } from '@/config/frenchTemplates';
import { RelationshipType, GenderType } from './relationshipUtils';
import { normalizeLanguage } from '@/i18n/languageUtils';

const LETTER_CATALOG = {
    en: EMOTIONAL_LETTERS,
    hi: HINDI_EMOTIONAL_LETTERS,
    bn: BENGALI_EMOTIONAL_LETTERS,
    fr: FRENCH_EMOTIONAL_LETTERS,
} as const;

type LetterTemplateSet = typeof EMOTIONAL_LETTERS;

const resolveLetterTemplate = (
    catalog: LetterTemplateSet,
    relationship: RelationshipType,
    name: string,
    gender: GenderType
): string => {
    const isFemale = gender === 'female';
    const isMale = gender === 'male';

    if (relationship === 'partner') {
        return isFemale ? catalog.partner.female(name) : catalog.partner.male(name);
    }
    if (relationship === 'friend') {
        if (isFemale) return catalog.friend.friendly(name);
        if (isMale) return catalog.friend.legend(name);
        return catalog.friend.romantic(name);
    }
    if (relationship === 'sibling') return catalog.sibling(name);
    if (relationship === 'brother') return catalog.brother(name);
    if (relationship === 'sister') return catalog.sister(name);
    if (relationship === 'father') return catalog.father(name);
    if (relationship === 'mother') return catalog.mother(name);
    if (relationship === 'grandfather') return catalog.grandfather(name);
    if (relationship === 'grandmother') return catalog.grandmother(name);
    if (relationship === 'uncle') return catalog.uncle(name);
    if (relationship === 'aunt') return catalog.aunt(name);
    if (relationship === 'cousin') return catalog.cousin(name);
    if (relationship === 'son') return catalog.son(name);
    if (relationship === 'daughter') return catalog.daughter(name);
    if (relationship === 'guardian') return catalog.guardian(name);
    if (relationship === 'colleague') return catalog.colleague(name);
    if (relationship === 'mentor') return catalog.mentor(name);
    return catalog.family(name);
};

export const getHighlySpecificLetter = (
    name: string,
    relationship: RelationshipType,
    gender: GenderType,
    _interests: string[] = [],
    language: string = 'en',
    senderName?: string
): string => {
    const lang = normalizeLanguage(language);
    const catalog = LETTER_CATALOG[lang] || EMOTIONAL_LETTERS;
    const letter = resolveLetterTemplate(catalog, relationship, name, gender);

    const cleanSender = senderName ? senderName.trim() : '';
    return letter
        .replace(/\[Your Name\]/g, cleanSender)
        .replace(/\[Votre Nom\]/g, cleanSender)
        .replace(/\[आपका नाम\]/g, cleanSender)
        .replace(/\[আপনার নাম\]/g, cleanSender)
        .trimEnd();
};

export const getBigWishes = (
    name: string,
    relationship: RelationshipType,
    _gender: GenderType,
    interests: string[] = [],
    language: string = 'en'
) => {
    const lang = normalizeLanguage(language);

    if (lang === 'fr') {
        return FRENCH_BIG_WISHES(name, relationship, interests);
    }
    if (lang === 'bn') {
        return BENGALI_BIG_WISHES(name, relationship, interests);
    }
    if (lang === 'hi') {
        return HINDI_BIG_WISHES(name, relationship, interests);
    }

    const wishes = [
        { emoji: "🚀", wish: `May your ${name} brand reach new galaxies this year!` },
        { emoji: "💎", wish: `You are a diamond in the rough, ${name}. Stay precious.` }
    ];
    if (relationship === 'partner') {
        wishes.push(
            { emoji: "❤️", wish: `Every heartbeat of mine is a wish for your happiness, ${name}.` },
            { emoji: "💍", wish: `To many more years of us making the world jealous of our love.` }
        );
    } else if (relationship === 'friend') {
        wishes.push(
            { emoji: "🔥", wish: `Stay legendary, stay wild, and keep breaking the internet, ${name}!` },
            { emoji: "🍻", wish: `To the nights we won't remember and the friend I'll never forget.` }
        );
    }

    if (interests.some(i => i.toLowerCase().includes('car'))) {
        wishes.push({ emoji: "🏎️", wish: `May your life accelerate from 0 to 100 in pure happiness this year!` });
    }
    if (interests.some(i => i.toLowerCase().includes('coding'))) {
        wishes.push({ emoji: "💻", wish: `May your life have zero bugs and infinite features, ${name}!` });
    }
    return wishes;
};
