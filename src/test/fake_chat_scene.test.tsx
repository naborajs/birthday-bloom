import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FakeChatScene } from '@/components/birthday/FakeChatScene';
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

    it('handles interaction on message bubbles', () => {
        const onComplete = vi.fn();
        render(<FakeChatScene onComplete={onComplete} />);

        const messageEl = screen.getByText(/hey my love/i);
        expect(messageEl).toBeTruthy();
        fireEvent.click(messageEl);
    });
});
