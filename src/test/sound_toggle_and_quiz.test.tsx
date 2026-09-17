import { beforeAll, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SoundToggle } from "@/components/birthday/SoundToggle";
import { BirthdayQuiz } from "@/components/birthday/BirthdayQuiz";

beforeAll(() => {
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
});

// Mock sound manager
const mockSetBgVolume = vi.fn();
vi.mock("@/components/birthday/SoundManager", () => ({
    useSoundManager: () => ({
        setBgVolume: mockSetBgVolume,
        playPop: vi.fn(),
        playReveal: vi.fn(),
        playBoom: vi.fn(),
    }),
}));

// Mock confetti
vi.mock("@/components/birthday/Confetti", () => ({
    useConfetti: () => ({
        fireConfetti: vi.fn(),
        fireCannon: vi.fn(),
    }),
}));

describe("SoundToggle & BirthdayQuiz Interaction Suite", () => {
    describe("SoundToggle Component", () => {
        it("renders with default mute label and unmuted icon", () => {
            render(<SoundToggle />);
            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("aria-label", "Mute Audio");
        });

        it("toggles to muted state and sets volume to 0 on click", () => {
            render(<SoundToggle />);
            const button = screen.getByRole("button");

            fireEvent.click(button);
            expect(mockSetBgVolume).toHaveBeenCalledWith(0);
            expect(button).toHaveAttribute("aria-label", "Unmute Audio");

            fireEvent.click(button);
            expect(mockSetBgVolume).toHaveBeenCalledWith(0.25);
            expect(button).toHaveAttribute("aria-label", "Mute Audio");
        });
    });

    describe("BirthdayQuiz Component", () => {
        it("renders trivia questions and accessible option buttons", () => {
            render(<BirthdayQuiz />);
            const options = screen.getAllByRole("button", { name: /Option/i });
            expect(options.length).toBe(4);
            expect(options[0]).toHaveAttribute("type", "button");
        });

        it("disables option buttons after an answer is selected", () => {
            render(<BirthdayQuiz />);
            const options = screen.getAllByRole("button", { name: /Option/i });

            fireEvent.click(options[0]);
            options.forEach((opt) => {
                expect(opt).toBeDisabled();
            });
        });
    });
});
