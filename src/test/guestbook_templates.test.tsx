import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuestbookSection } from '@/components/birthday/GuestbookSection';
import { useBirthdayStore } from '@/features/core/store/useBirthdayStore';

describe('GuestbookSection Template-Aware Seeds & Badges', () => {
    beforeEach(() => {
        localStorage.clear();
        useBirthdayStore.setState({
            config: {
                ...useBirthdayStore.getState().config,
                relationship: 'brother',
                name: 'Alex',
                senderName: 'Sam',
            },
        });
    });

    it('renders brother-specific starter seeds when relationship is brother', () => {
        render(<GuestbookSection />);

        expect(screen.getByText(/Coolest Brother/i)).toBeInTheDocument();
        expect(screen.getByText(/Childhood Crew/i)).toBeInTheDocument();
    });

    it('renders sister-specific starter seeds when relationship is sister', () => {
        useBirthdayStore.setState({
            config: {
                ...useBirthdayStore.getState().config,
                relationship: 'sister',
                name: 'Emily',
                senderName: 'Sam',
            },
        });

        render(<GuestbookSection />);

        expect(screen.getByText(/most wonderful sister/i)).toBeInTheDocument();
        expect(screen.getByText(/Sweetest Memories/i)).toBeInTheDocument();
    });

    it('allows toggling like reactions on a wish', () => {
        render(<GuestbookSection />);

        const likeButtons = screen.getAllByRole('button', { name: /heart reaction/i });
        expect(likeButtons.length).toBeGreaterThan(0);

        const firstButton = likeButtons[0];
        const initialText = firstButton.textContent || '';
        const initialCount = parseInt(initialText.match(/\d+/)?.[0] || '0', 10);

        fireEvent.click(firstButton);

        const updatedCount = parseInt((firstButton.textContent || '').match(/\d+/)?.[0] || '0', 10);
        expect(updatedCount).toBe(initialCount + 1);
    });
});
