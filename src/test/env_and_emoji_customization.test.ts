import { describe, it, expect } from 'vitest';
import { getTemplateEmojiKit, normalizeToEmoji } from '@/config/emojiKits';
import type { BirthdayConfig } from '@/features/core/store/useBirthdayStore';

describe('Environment & Emoji Customization Engine', () => {
    it('normalizes keyword emoji names into actual Unicode emojis', () => {
        expect(normalizeToEmoji('heart')).toBe('💖');
        expect(normalizeToEmoji('rose')).toBe('🌹');
        expect(normalizeToEmoji('butterfly')).toBe('🦋');
        expect(normalizeToEmoji('sparkle')).toBe('✨');
        expect(normalizeToEmoji('star')).toBe('⭐');
        expect(normalizeToEmoji('love')).toBe('🥰');
        expect(normalizeToEmoji('cake')).toBe('🎂');
        expect(normalizeToEmoji('💖')).toBe('💖');
        expect(normalizeToEmoji('🦋')).toBe('🦋');
    });

    it('creates romantic floating emojis for partner girlfriend (female) without plain english words', () => {
        const config: BirthdayConfig = {
            name: 'My Love',
            age: 22,
            gender: 'female',
            relationship: 'partner',
            favoriteColor: '#FF2A6D',
            favoriteEmojis: ['heart', 'sparkle', 'rose', 'star', 'butterfly'],
            interests: ['Music', 'Travel', 'Romance', 'Stars', 'Art'],
            customMessage: 'Happy Birthday!',
            birthdayDate: new Date('2026-07-14'),
        };

        const kit = getTemplateEmojiKit(config);

        // Verify that every floating element is a valid emoji and NOT an English word
        for (const item of kit.floating) {
            expect(item).not.toBe('heart');
            expect(item).not.toBe('butterfly');
            expect(item).not.toBe('rose');
            expect(item).not.toBe('sparkle');
            expect(item).not.toBe('star');
            expect(/\p{Extended_Pictographic}/u.test(item)).toBe(true);
        }

        // Verify key romantic emojis are present
        expect(kit.floating).toContain('💖');
        expect(kit.floating).toContain('🌹');
        expect(kit.floating).toContain('🦋');
        expect(kit.floating).toContain('✨');
        expect(kit.cursor).toContain('💖');
        expect(kit.cursor).toContain('🌹');
        expect(kit.cursor).toContain('🦋');
    });

    it('creates energetic emojis for friend relationship', () => {
        const config: BirthdayConfig = {
            name: 'Alex',
            age: 25,
            gender: 'male',
            relationship: 'friend',
            favoriteColor: '#00D2FF',
            favoriteEmojis: ['fire', 'rocket', 'party'],
            interests: ['gaming', 'music'],
            customMessage: 'Happy Birthday bro!',
            birthdayDate: new Date('2026-07-14'),
        };

        const kit = getTemplateEmojiKit(config);
        expect(kit.floating).toContain('🎉');
        expect(kit.floating).toContain('🔥');
        expect(kit.floating).toContain('🚀');
    });
});
