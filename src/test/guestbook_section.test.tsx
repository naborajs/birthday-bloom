import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GuestbookSection } from '@/components/birthday/GuestbookSection';

beforeAll(() => {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Mock SoundManager
vi.mock('@/components/birthday/SoundManager', () => ({
  useSoundManager: () => ({
    playPop: vi.fn(),
    playReveal: vi.fn(),
    playBoom: vi.fn(),
    setBgVolume: vi.fn(),
  }),
}));

// Mock Confetti
vi.mock('@/components/birthday/Confetti', () => ({
  useConfetti: () => ({
    fireConfetti: vi.fn(),
    fireCannon: vi.fn(),
    fireStars: vi.fn(),
  }),
}));

// Mock useAdaptivePerformance
vi.mock('@/hooks/useAdaptivePerformance', () => ({
  useAdaptivePerformance: () => ({
    tier: 'balanced',
    isMobile: false,
    dpr: 1,
    shadowMapSize: 512,
    maxParticles: 25,
    enableCursorTrail: true,
    enableMultiCanvas: true,
    enableComplexShaders: true,
    enableHeavyBlur: true,
    recommendedFrameCap: 60,
  }),
}));

describe('GuestbookSection Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders guestbook title, badge, and starter emotional seeds', () => {
    render(<GuestbookSection />);
    expect(screen.getByText(/Live Wishes Board|হৃদয়স্পর্শী|दिल से|Vœux/i)).toBeInTheDocument();
    expect(screen.getByText(/Leave a Wish|শুভেচ্ছা বার্তা|शुभकामना|Écrire/i)).toBeInTheDocument();
  });

  it('toggles the wish submission form when button is clicked', () => {
    render(<GuestbookSection />);
    const toggleButton = screen.getByRole('button', { name: /Leave a Wish|শুভেচ্ছা বার্তা|शुभकामना|Écrire/i });
    fireEvent.click(toggleButton);

    // Form inputs should now be visible
    expect(screen.getByPlaceholderText(/Your Name or Nickname|আপনার নাম|आपका नाम|Votre nom/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write your heartfelt birthday wish|আন্তরিক শুভেচ্ছা|हार्दिक शुभकामनाएं|Écrivez votre message/i)).toBeInTheDocument();
  });

  it('submits a new wish and persists to localStorage', () => {
    render(<GuestbookSection />);
    const toggleButton = screen.getByRole('button', { name: /Leave a Wish|শুভেচ্ছা বার্তা|शुभकामना|Écrire/i });
    fireEvent.click(toggleButton);

    const nameInput = screen.getByPlaceholderText(/Your Name or Nickname|আপনার নাম|आपका नाम|Votre nom/i);
    const messageInput = screen.getByPlaceholderText(/Write your heartfelt birthday wish|আন্তরিক শুভেচ্ছা|हार्दिक शुभकामनाएं|Écrivez votre message/i);

    fireEvent.change(nameInput, { target: { value: 'Aria' } });
    fireEvent.change(messageInput, { target: { value: 'Wishing you all the joy and stars in the sky!' } });

    const submitButton = screen.getByRole('button', { name: /Send Your Wish|শুভেচ্ছা পাঠান|शुभकामना भेजें|Envoyer avec amour/i });
    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      fireEvent.click(submitButton);
    }

    // Should appear in the document
    expect(screen.getByText('Aria')).toBeInTheDocument();
    expect(screen.getByText(/Wishing you all the joy and stars in the sky!/)).toBeInTheDocument();

    // Verify localStorage
    const saved = localStorage.getItem('birthday_bloom_guestbook_wishes');
    expect(saved).not.toBeNull();
    expect(saved).toContain('Aria');
  });

  it('handles heart reaction click on a wish card', () => {
    render(<GuestbookSection />);
    const heartButtons = screen.getAllByRole('button', { name: /Send heart reaction/i });
    expect(heartButtons.length).toBeGreaterThan(0);

    const firstHeartBtn = heartButtons[0];
    const initialText = firstHeartBtn.textContent;
    fireEvent.click(firstHeartBtn);

    // Likes count should update
    expect(firstHeartBtn.textContent).not.toBe(initialText);
  });
});
