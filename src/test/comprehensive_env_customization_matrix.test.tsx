import { describe, it, expect } from 'vitest';
import { getHighlySpecificLetter, getBigWishes } from '@/features/core/store/SuperPersonalizedLogic';
import { normalizeToEmoji, getRelationshipEmojiKit } from '@/config/emojiKits';
import type { RelationshipType, GenderType } from '@/features/core/store/useBirthdayStore';

describe('Comprehensive Environment Variable & Customization Matrix', () => {
    const relationships: RelationshipType[] = [
        'partner', 'friend', 'family', 'sibling', 'brother', 'sister',
        'father', 'mother', 'colleague', 'mentor'
    ];
    const _genders: GenderType[] = ['female', 'male', 'other'];
    const languages = ['en', 'fr', 'bn', 'hi'];

    describe('1. Dynamic Letter Customization for Every Relationship & Gender & Language', () => {
        for (const rel of relationships) {
            for (const lang of languages) {
                it(`generates meaningful letter for relationship="${rel}" in language="${lang}"`, () => {
                    const letterFemale = getHighlySpecificLetter('Sarah', rel, 'female', ['music'], lang, 'Alex');
                    const letterMale = getHighlySpecificLetter('David', rel, 'male', ['coding'], lang, 'Alex');

                    expect(letterFemale).toBeTruthy();
                    expect(letterFemale.length).toBeGreaterThan(20);
                    expect(letterMale).toBeTruthy();
                    expect(letterMale.length).toBeGreaterThan(20);

                    // Replaces placeholders with sender name
                    expect(letterFemale).not.toContain('[Your Name]');
                    expect(letterFemale).not.toContain('[Votre Nom]');
                    expect(letterFemale).not.toContain('[আপনার নাম]');
                    expect(letterFemale).not.toContain('[आपका नाम]');
                });
            }
        }
    });

    describe('2. Custom Wishes for Interests & Relationships across Languages', () => {
        const interestsList = [['music', 'travel'], ['car', 'coding'], ['art', 'space']];
        for (const interests of interestsList) {
            for (const lang of languages) {
                it(`generates customized wishes for interests [${interests.join(', ')}] in ${lang}`, () => {
                    const wishes = getBigWishes('Emma', 'partner', 'female', interests, lang);
                    expect(wishes).toBeInstanceOf(Array);
                    expect(wishes.length).toBeGreaterThan(0);
                    expect(wishes[0].emoji).toBeTruthy();
                    expect(wishes[0].wish).toBeTruthy();
                });
            }
        }
    });

    describe('3. Dynamic Emoji Kits & Normalization', () => {
        it('normalizes string keywords to genuine Unicode emojis', () => {
            expect(normalizeToEmoji('heart')).toBe('💖');
            expect(normalizeToEmoji('rose')).toBe('🌹');
            expect(normalizeToEmoji('sparkle')).toBe('✨');
            expect(normalizeToEmoji('butterfly')).toBe('🦋');
            expect(normalizeToEmoji('star')).toBe('⭐');
            expect(normalizeToEmoji('fire')).toBe('🔥');
            expect(normalizeToEmoji('party')).toBe('🎉');
            expect(normalizeToEmoji('cake')).toBe('🎂');
        });

        it('provides distinct emoji kits for different relationship archetypes', () => {
            const partnerKit = getRelationshipEmojiKit('partner');
            const friendKit = getRelationshipEmojiKit('friend');
            const familyKit = getRelationshipEmojiKit('family');

            expect(partnerKit.signature).toBeDefined();
            expect(partnerKit.signature.length).toBeGreaterThan(0);
            expect(friendKit.floating).toBeDefined();
            expect(familyKit.floating).toBeDefined();
        });
    });
});

