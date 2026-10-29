import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FakeChatScene } from '@/components/birthday/FakeChatScene';
import { getStoryCopy } from '@/components/birthday/fakeChatStory';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

// Mock SoundManager to prevent audio exceptions
vi.mock('@/components/birthday/SoundManager', () => ({
    useSoundManager: () => ({
        playType: vi.fn(),
        playWhoosh: vi.fn(),
        playReveal: vi.fn(),
        playPop: vi.fn(),
        playFanfare: vi.fn(),
        startMusic: vi.fn(),
    }),
}));

describe('FakeChatScene Component (Instagram DM Style)', () => {
    beforeEach(() => {
        useBirthdayStore.setState({
            config: {
                name: 'My Love',
                age: 22,
                gender: 'female',
                relationship: 'partner',
                favoriteColor: '#FF2A6D',
                favoriteEmojis: ['💖', '🌹'],
                interests: ['music', 'travel'],
                customMessage: 'Happy Birthday!',
                birthdayDate: new Date('2026-07-14'),
            },
        });
    });

    it('renders Instagram DM header with story ring avatar, contact name, and action icons', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);

        // Header and back button
        expect(screen.getByRole('button', { name: /go back/i })).toBeTruthy();
        expect(screen.getByText('My Love')).toBeTruthy();
        expect(screen.getByRole('button', { name: /voice call/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /video call/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /chat details/i })).toBeTruthy();
    });

    it('renders Instagram DM message list with timestamp and input bar', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);

        // Timestamp
        expect(screen.getByText(/Today • 12:00 AM/i)).toBeTruthy();

        // Input controls
        expect(screen.getByRole('button', { name: /open camera/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /record voice note/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /attach photo/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /add sticker or emoji/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy();
    });

    it('renders simulated iOS status bar with time indicator', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);
        expect(screen.getByText('9:41')).toBeTruthy();
    });

    it('handles interaction and double-tap heart bursts', () => {
        const onComplete = vi.fn();
        const { container } = render(<FakeChatScene onComplete={onComplete} />);

        const phoneScreen = container.querySelector('.select-none');
        expect(phoneScreen).toBeTruthy();
        if (phoneScreen) {
            fireEvent.click(phoneScreen);
            fireEvent.click(phoneScreen);
        }
    });

    it('renders the interactive virtual mobile keypad and darkens keys when pressed', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);

        const keypad = screen.getByTestId('virtual-mobile-keypad');
        expect(keypad).toBeTruthy();

        const keyH = keypad.querySelector('button[data-key="h"]') as HTMLButtonElement;
        expect(keyH).toBeTruthy();
        expect(keyH.getAttribute('data-active')).toBe('false');

        fireEvent.click(keyH);
        expect(keyH.getAttribute('data-active')).toBe('true');

        const backspaceBtn = screen.getByRole('button', { name: /backspace/i });
        expect(backspaceBtn).toBeTruthy();
        const keyboardSendBtn = screen.getByRole('button', { name: /keyboard send/i });
        expect(keyboardSendBtn).toBeTruthy();
    });

    it('adapts story and renders accessible phone frame across different relationships', () => {
        // Test Friend relationship
        useBirthdayStore.setState({
            config: {
                name: 'Alex',
                age: 25,
                gender: 'male',
                relationship: 'friend',
                favoriteColor: '#00D2FF',
                favoriteEmojis: ['😎', '🚀'],
                interests: ['gaming'],
                customMessage: 'Happy Birthday!',
                birthdayDate: new Date('2026-07-14'),
            },
        });

        const onCompleteFriend = vi.fn();
        const { unmount } = render(<FakeChatScene onComplete={onCompleteFriend} />);
        expect(screen.getByText('Alex')).toBeTruthy();
        unmount();

        // Test Father relationship
        useBirthdayStore.setState({
            config: {
                name: 'Dad',
                age: 55,
                gender: 'male',
                relationship: 'father',
                favoriteColor: '#4A90E2',
                favoriteEmojis: ['⭐', '👔'],
                interests: ['reading'],
                customMessage: 'Best Dad Ever!',
                birthdayDate: new Date('2026-07-14'),
            },
        });

        const onCompleteFather = vi.fn();
        render(<FakeChatScene onComplete={onCompleteFather} />);
        expect(screen.getByText('Dad')).toBeTruthy();
    });

    it('generates the correct realization story copy across relationships, genders, and languages', () => {
        // Partner Female (Queen realization)
        const partnerFemale = getStoryCopy('partner', 'Sarah', 'female', false, false, false);
        expect(partnerFemale.initialWish).toContain('beautiful');
        expect(partnerFemale.reconsiderThought).toBe('Oh no, a simple message is not enough for my Queen... 👑✨');
        expect(partnerFemale.linkSubtitle).toContain('magical birthday experience handcrafted just for you');

        // Partner Male (King realization)
        const partnerMale = getStoryCopy('partner', 'David', 'male', false, false, false);
        expect(partnerMale.initialWish).toContain('handsome');
        expect(partnerMale.reconsiderThought).toBe('Oh no, a simple message is not enough for my King... 👑✨');

        // Father (Hero realization)
        const fatherCopy = getStoryCopy('father', 'Dad', 'male', false, false, false);
        expect(fatherCopy.reconsiderThought).toContain('hero');

        // Mother (Loving realization)
        const motherCopy = getStoryCopy('mother', 'Mom', 'female', false, false, false);
        expect(motherCopy.reconsiderThought).toContain('never thank you enough, Mom');

        // Friend
        const friendCopy = getStoryCopy('friend', 'Alex', 'other', false, false, false);
        expect(friendCopy.reconsiderThought).toContain('legend like you');

        // French Partner Female
        const frenchPartner = getStoryCopy('partner', 'Camille', 'female', false, false, true);
        expect(frenchPartner.reconsiderThought).toContain('ma reine');

        // Bengali Partner Female
        const bengaliPartner = getStoryCopy('partner', 'Priya', 'female', false, true, false);
        expect(bengaliPartner.reconsiderThought).toContain('রানীর জন্য');

        // Hindi Partner Female
        const hindiPartner = getStoryCopy('partner', 'Ananya', 'female', true, false, false);
        expect(hindiPartner.reconsiderThought).toContain('मेरी रानी के लिए');

        // Extended ENV: Uncle
        const uncleCopy = getStoryCopy('uncle', 'Bob', 'male', false, false, false);
        expect(uncleCopy.initialWish).toContain('Uncle Bob');
        expect(uncleCopy.reconsiderThought).toContain('coolest uncle');

        // Extended ENV: Aunt
        const auntCopy = getStoryCopy('aunt', 'Clara', 'female', false, false, false);
        expect(auntCopy.initialWish).toContain('Aunt Clara');
        expect(auntCopy.reconsiderThought).toContain('favorite aunt');

        // Extended ENV: Son & Daughter
        const sonCopy = getStoryCopy('son', 'Leo', 'male', false, false, false);
        expect(sonCopy.reconsiderThought).toContain('proud I am of my son');

        const daughterCopy = getStoryCopy('daughter', 'Maya', 'female', false, false, false);
        expect(daughterCopy.reconsiderThought).toContain('precious daughter');

        // Extended ENV: Custom message and Sender Name
        const customEnvCopy = getStoryCopy('partner', 'Emma', 'female', false, false, false, 'Stay wonderful always!', 'Liam');
        expect(customEnvCopy.initialWish).toBe('Stay wonderful always! 🎂');
        expect(customEnvCopy.reconsiderThought).toContain('Emma');
        expect(customEnvCopy.linkSubtitle).toContain('Liam');

        // Extended ENV: Uncle in French, Bengali, and Hindi
        const frenchUncle = getStoryCopy('uncle', 'Pierre', 'male', false, false, true);
        expect(frenchUncle.initialWish).toContain('Tonton');

        const bengaliUncle = getStoryCopy('uncle', 'Rabi', 'male', false, true, false);
        expect(bengaliUncle.reconsiderThought).toContain('কাকার');

        const hindiUncle = getStoryCopy('uncle', 'Rajesh', 'male', true, false, false);
        expect(hindiUncle.reconsiderThought).toContain('चाचाजी');
    });

    it('renders touch-friendly keypad buttons with touch-manipulation and responsive layout', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);

        const keypad = screen.getByTestId('virtual-mobile-keypad');
        const buttons = keypad.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(25);

        // Verify touch-manipulation class exists on keypad keys to eliminate 300ms mobile tap delay
        const sampleKey = keypad.querySelector('button[data-key="a"]');
        expect(sampleKey?.className).toContain('touch-manipulation');
    });
});

