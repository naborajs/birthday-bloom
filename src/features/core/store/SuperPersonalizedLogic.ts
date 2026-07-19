import { EMOTIONAL_LETTERS } from '@/config/templates';
import { RelationshipType, GenderType } from './useBirthdayStore';
export const getHighlySpecificLetter = (name: string, relationship: RelationshipType, gender: GenderType, interests: string[] = []) => {
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
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
export const getInterestBasedTheme = (interests: string[]) => {
    const lowerInterests = interests.map(i => i.toLowerCase().trim());
    if (lowerInterests.includes('car'))
        return 'automotive';
    if (lowerInterests.includes('music'))
        return 'melodic';
    if (lowerInterests.includes('coding'))
        return 'matrix';
    return 'classic';
};
export const getBigWishes = (name: string, relationship: RelationshipType, gender: GenderType, interests: string[] = []) => {
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
