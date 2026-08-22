import { EMOTIONAL_LETTERS } from '@/config/templates';
import { HINDI_EMOTIONAL_LETTERS, HINDI_BIG_WISHES } from '@/config/hindiTemplates';
import { BENGALI_EMOTIONAL_LETTERS, BENGALI_BIG_WISHES } from '@/config/bengaliTemplates';
import { RelationshipType, GenderType } from './useBirthdayStore';

export const getHighlySpecificLetter = (
    name: string,
    relationship: RelationshipType,
    gender: GenderType,
    _interests: string[] = [],
    language: string = 'en'
) => {
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    const isHindi = language === 'hi' || language === 'hindi' || language === 'in';
    const isBengali = language === 'bn' || language === 'bengali' || language === 'bangla';

    if (isBengali) {
        if (relationship === 'partner') {
            return isFemale ? BENGALI_EMOTIONAL_LETTERS.partner.female(name) : BENGALI_EMOTIONAL_LETTERS.partner.male(name);
        }
        if (relationship === 'friend') {
            if (isFemale) return BENGALI_EMOTIONAL_LETTERS.friend.friendly(name);
            if (isMale) return BENGALI_EMOTIONAL_LETTERS.friend.legend(name);
            return BENGALI_EMOTIONAL_LETTERS.friend.romantic(name);
        }
        if (relationship === 'sibling') return BENGALI_EMOTIONAL_LETTERS.sibling(name);
        if (relationship === 'brother') return BENGALI_EMOTIONAL_LETTERS.brother(name);
        if (relationship === 'sister') return BENGALI_EMOTIONAL_LETTERS.sister(name);
        if (relationship === 'colleague') return BENGALI_EMOTIONAL_LETTERS.colleague(name);
        if (relationship === 'mentor') return BENGALI_EMOTIONAL_LETTERS.mentor(name);
        return BENGALI_EMOTIONAL_LETTERS.family(name);
    }

    if (isHindi) {
        if (relationship === 'partner') {
            return isFemale ? HINDI_EMOTIONAL_LETTERS.partner.female(name) : HINDI_EMOTIONAL_LETTERS.partner.male(name);
        }
        if (relationship === 'friend') {
            if (isFemale) return HINDI_EMOTIONAL_LETTERS.friend.friendly(name);
            if (isMale) return HINDI_EMOTIONAL_LETTERS.friend.legend(name);
            return HINDI_EMOTIONAL_LETTERS.friend.romantic(name);
        }
        if (relationship === 'sibling') return HINDI_EMOTIONAL_LETTERS.sibling(name);
        if (relationship === 'brother') return HINDI_EMOTIONAL_LETTERS.brother(name);
        if (relationship === 'sister') return HINDI_EMOTIONAL_LETTERS.sister(name);
        if (relationship === 'colleague') return HINDI_EMOTIONAL_LETTERS.colleague(name);
        if (relationship === 'mentor') return HINDI_EMOTIONAL_LETTERS.mentor(name);
        return HINDI_EMOTIONAL_LETTERS.family(name);
    }

    if (relationship === 'partner') {
        return isFemale ? EMOTIONAL_LETTERS.partner.female(name) : EMOTIONAL_LETTERS.partner.male(name);
    }
    if (relationship === 'friend') {
        if (isFemale)
            return EMOTIONAL_LETTERS.friend.friendly(name);
        if (isMale)
            return EMOTIONAL_LETTERS.friend.legend(name);
        return EMOTIONAL_LETTERS.friend.romantic(name);
    }
    if (relationship === 'sibling') {
        return EMOTIONAL_LETTERS.sibling(name);
    }
    if (relationship === 'brother') {
        return EMOTIONAL_LETTERS.brother(name);
    }
    if (relationship === 'sister') {
        return EMOTIONAL_LETTERS.sister(name);
    }
    if (relationship === 'colleague')
        return EMOTIONAL_LETTERS.colleague(name);
    if (relationship === 'mentor')
        return EMOTIONAL_LETTERS.mentor(name);
    return EMOTIONAL_LETTERS.family(name);
};

export const getBigWishes = (
    name: string,
    relationship: RelationshipType,
    gender: GenderType,
    interests: string[] = [],
    language: string = 'en'
) => {
    const isBengali = language === 'bn' || language === 'bengali' || language === 'bangla';
    if (isBengali) {
        return BENGALI_BIG_WISHES(name, relationship, interests);
    }

    const isHindi = language === 'hi' || language === 'hindi' || language === 'in';
    if (isHindi) {
        return HINDI_BIG_WISHES(name, relationship, interests);
    }

    const wishes = [
        { emoji: "🚀", wish: `May your ${name} brand reach new galaxies this year!` },
        { emoji: "💎", wish: `You are a diamond in the rough, ${name}. Stay precious.` }
    ];
    if (relationship === 'partner') {
        wishes.push({ emoji: "❤️", wish: `Every heartbeat of mine is a wish for your happiness, ${name}.` }, { emoji: "💍", wish: `To many more years of us making the world jealous of our love.` });
    }
    else if (relationship === 'friend') {
        wishes.push({ emoji: "🔥", wish: `Stay legendary, stay wild, and keep breaking the internet, ${name}!` }, { emoji: "🍻", wish: `To the nights we won't remember and the friend I'll never forget.` });
    }
    if (interests.some(i => i.toLowerCase().includes('car'))) {
        wishes.push({ emoji: "🏎️", wish: `May your life accelerate from 0 to 100 in pure happiness this year!` });
    }
    if (interests.some(i => i.toLowerCase().includes('coding'))) {
        wishes.push({ emoji: "💻", wish: `May your life have zero bugs and infinite features, ${name}!` });
    }
    return wishes;
};
