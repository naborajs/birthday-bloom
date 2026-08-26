import { EMOTIONAL_LETTERS } from '@/config/templates';
import { HINDI_EMOTIONAL_LETTERS, HINDI_BIG_WISHES } from '@/config/hindiTemplates';
import { BENGALI_EMOTIONAL_LETTERS, BENGALI_BIG_WISHES } from '@/config/bengaliTemplates';
import { FRENCH_EMOTIONAL_LETTERS, FRENCH_BIG_WISHES } from '@/config/frenchTemplates';
import { RelationshipType, GenderType } from './useBirthdayStore';

export const getHighlySpecificLetter = (
    name: string,
    relationship: RelationshipType,
    gender: GenderType,
    _interests: string[] = [],
    language: string = 'en',
    senderName?: string
) => {
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    const isFrench = language === 'fr' || language === 'french' || language === 'francais' || language === 'française' || language === 'francaise';
    const isHindi = language === 'hi' || language === 'hindi' || language === 'in';
    const isBengali = language === 'bn' || language === 'bengali' || language === 'bangla';

    let letter = '';

    if (isFrench) {
        if (relationship === 'partner') {
            letter = isFemale ? FRENCH_EMOTIONAL_LETTERS.partner.female(name) : FRENCH_EMOTIONAL_LETTERS.partner.male(name);
        } else if (relationship === 'friend') {
            if (isFemale) letter = FRENCH_EMOTIONAL_LETTERS.friend.friendly(name);
            else if (isMale) letter = FRENCH_EMOTIONAL_LETTERS.friend.legend(name);
            else letter = FRENCH_EMOTIONAL_LETTERS.friend.romantic(name);
        } else if (relationship === 'sibling') {
            letter = FRENCH_EMOTIONAL_LETTERS.sibling(name);
        } else if (relationship === 'brother') {
            letter = FRENCH_EMOTIONAL_LETTERS.brother(name);
        } else if (relationship === 'sister') {
            letter = FRENCH_EMOTIONAL_LETTERS.sister(name);
        } else if (relationship === 'father') {
            letter = FRENCH_EMOTIONAL_LETTERS.father(name);
        } else if (relationship === 'mother') {
            letter = FRENCH_EMOTIONAL_LETTERS.mother(name);
        } else if (relationship === 'grandfather') {
            letter = FRENCH_EMOTIONAL_LETTERS.grandfather(name);
        } else if (relationship === 'grandmother') {
            letter = FRENCH_EMOTIONAL_LETTERS.grandmother(name);
        } else if (relationship === 'uncle') {
            letter = FRENCH_EMOTIONAL_LETTERS.uncle(name);
        } else if (relationship === 'aunt') {
            letter = FRENCH_EMOTIONAL_LETTERS.aunt(name);
        } else if (relationship === 'cousin') {
            letter = FRENCH_EMOTIONAL_LETTERS.cousin(name);
        } else if (relationship === 'son') {
            letter = FRENCH_EMOTIONAL_LETTERS.son(name);
        } else if (relationship === 'daughter') {
            letter = FRENCH_EMOTIONAL_LETTERS.daughter(name);
        } else if (relationship === 'guardian') {
            letter = FRENCH_EMOTIONAL_LETTERS.guardian(name);
        } else if (relationship === 'colleague') {
            letter = FRENCH_EMOTIONAL_LETTERS.colleague(name);
        } else if (relationship === 'mentor') {
            letter = FRENCH_EMOTIONAL_LETTERS.mentor(name);
        } else {
            letter = FRENCH_EMOTIONAL_LETTERS.family(name);
        }
    } else if (isBengali) {
        if (relationship === 'partner') {
            letter = isFemale ? BENGALI_EMOTIONAL_LETTERS.partner.female(name) : BENGALI_EMOTIONAL_LETTERS.partner.male(name);
        } else if (relationship === 'friend') {
            if (isFemale) letter = BENGALI_EMOTIONAL_LETTERS.friend.friendly(name);
            else if (isMale) letter = BENGALI_EMOTIONAL_LETTERS.friend.legend(name);
            else letter = BENGALI_EMOTIONAL_LETTERS.friend.romantic(name);
        } else if (relationship === 'sibling') {
            letter = BENGALI_EMOTIONAL_LETTERS.sibling(name);
        } else if (relationship === 'brother') {
            letter = BENGALI_EMOTIONAL_LETTERS.brother(name);
        } else if (relationship === 'sister') {
            letter = BENGALI_EMOTIONAL_LETTERS.sister(name);
        } else if (relationship === 'father') {
            letter = BENGALI_EMOTIONAL_LETTERS.father(name);
        } else if (relationship === 'mother') {
            letter = BENGALI_EMOTIONAL_LETTERS.mother(name);
        } else if (relationship === 'grandfather') {
            letter = BENGALI_EMOTIONAL_LETTERS.grandfather(name);
        } else if (relationship === 'grandmother') {
            letter = BENGALI_EMOTIONAL_LETTERS.grandmother(name);
        } else if (relationship === 'uncle') {
            letter = BENGALI_EMOTIONAL_LETTERS.uncle(name);
        } else if (relationship === 'aunt') {
            letter = BENGALI_EMOTIONAL_LETTERS.aunt(name);
        } else if (relationship === 'cousin') {
            letter = BENGALI_EMOTIONAL_LETTERS.cousin(name);
        } else if (relationship === 'son') {
            letter = BENGALI_EMOTIONAL_LETTERS.son(name);
        } else if (relationship === 'daughter') {
            letter = BENGALI_EMOTIONAL_LETTERS.daughter(name);
        } else if (relationship === 'guardian') {
            letter = BENGALI_EMOTIONAL_LETTERS.guardian(name);
        } else if (relationship === 'colleague') {
            letter = BENGALI_EMOTIONAL_LETTERS.colleague(name);
        } else if (relationship === 'mentor') {
            letter = BENGALI_EMOTIONAL_LETTERS.mentor(name);
        } else {
            letter = BENGALI_EMOTIONAL_LETTERS.family(name);
        }
    } else if (isHindi) {
        if (relationship === 'partner') {
            letter = isFemale ? HINDI_EMOTIONAL_LETTERS.partner.female(name) : HINDI_EMOTIONAL_LETTERS.partner.male(name);
        } else if (relationship === 'friend') {
            if (isFemale) letter = HINDI_EMOTIONAL_LETTERS.friend.friendly(name);
            else if (isMale) letter = HINDI_EMOTIONAL_LETTERS.friend.legend(name);
            else letter = HINDI_EMOTIONAL_LETTERS.friend.romantic(name);
        } else if (relationship === 'sibling') {
            letter = HINDI_EMOTIONAL_LETTERS.sibling(name);
        } else if (relationship === 'brother') {
            letter = HINDI_EMOTIONAL_LETTERS.brother(name);
        } else if (relationship === 'sister') {
            letter = HINDI_EMOTIONAL_LETTERS.sister(name);
        } else if (relationship === 'father') {
            letter = HINDI_EMOTIONAL_LETTERS.father(name);
        } else if (relationship === 'mother') {
            letter = HINDI_EMOTIONAL_LETTERS.mother(name);
        } else if (relationship === 'grandfather') {
            letter = HINDI_EMOTIONAL_LETTERS.grandfather(name);
        } else if (relationship === 'grandmother') {
            letter = HINDI_EMOTIONAL_LETTERS.grandmother(name);
        } else if (relationship === 'uncle') {
            letter = HINDI_EMOTIONAL_LETTERS.uncle(name);
        } else if (relationship === 'aunt') {
            letter = HINDI_EMOTIONAL_LETTERS.aunt(name);
        } else if (relationship === 'cousin') {
            letter = HINDI_EMOTIONAL_LETTERS.cousin(name);
        } else if (relationship === 'son') {
            letter = HINDI_EMOTIONAL_LETTERS.son(name);
        } else if (relationship === 'daughter') {
            letter = HINDI_EMOTIONAL_LETTERS.daughter(name);
        } else if (relationship === 'guardian') {
            letter = HINDI_EMOTIONAL_LETTERS.guardian(name);
        } else if (relationship === 'colleague') {
            letter = HINDI_EMOTIONAL_LETTERS.colleague(name);
        } else if (relationship === 'mentor') {
            letter = HINDI_EMOTIONAL_LETTERS.mentor(name);
        } else {
            letter = HINDI_EMOTIONAL_LETTERS.family(name);
        }
    } else {
        if (relationship === 'partner') {
            letter = isFemale ? EMOTIONAL_LETTERS.partner.female(name) : EMOTIONAL_LETTERS.partner.male(name);
        } else if (relationship === 'friend') {
            if (isFemale) letter = EMOTIONAL_LETTERS.friend.friendly(name);
            else if (isMale) letter = EMOTIONAL_LETTERS.friend.legend(name);
            else letter = EMOTIONAL_LETTERS.friend.romantic(name);
        } else if (relationship === 'sibling') {
            letter = EMOTIONAL_LETTERS.sibling(name);
        } else if (relationship === 'brother') {
            letter = EMOTIONAL_LETTERS.brother(name);
        } else if (relationship === 'sister') {
            letter = EMOTIONAL_LETTERS.sister(name);
        } else if (relationship === 'father') {
            letter = EMOTIONAL_LETTERS.father(name);
        } else if (relationship === 'mother') {
            letter = EMOTIONAL_LETTERS.mother(name);
        } else if (relationship === 'grandfather') {
            letter = EMOTIONAL_LETTERS.grandfather(name);
        } else if (relationship === 'grandmother') {
            letter = EMOTIONAL_LETTERS.grandmother(name);
        } else if (relationship === 'uncle') {
            letter = EMOTIONAL_LETTERS.uncle(name);
        } else if (relationship === 'aunt') {
            letter = EMOTIONAL_LETTERS.aunt(name);
        } else if (relationship === 'cousin') {
            letter = EMOTIONAL_LETTERS.cousin(name);
        } else if (relationship === 'son') {
            letter = EMOTIONAL_LETTERS.son(name);
        } else if (relationship === 'daughter') {
            letter = EMOTIONAL_LETTERS.daughter(name);
        } else if (relationship === 'guardian') {
            letter = EMOTIONAL_LETTERS.guardian(name);
        } else if (relationship === 'colleague') {
            letter = EMOTIONAL_LETTERS.colleague(name);
        } else if (relationship === 'mentor') {
            letter = EMOTIONAL_LETTERS.mentor(name);
        } else {
            letter = EMOTIONAL_LETTERS.family(name);
        }
    }

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
    gender: GenderType,
    interests: string[] = [],
    language: string = 'en'
) => {
    const isFrench = language === 'fr' || language === 'french' || language === 'francais' || language === 'française' || language === 'francaise';
    if (isFrench) {
        return FRENCH_BIG_WISHES(name, relationship, interests);
    }

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
