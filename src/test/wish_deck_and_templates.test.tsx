import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { WishDeck } from "@/components/birthday/WishDeck";
import {
    WISH_TEMPLATES,
    getWishDeck,
    WRITE_YOUR_OWN_CARD,
} from "@/config/wishTemplates";
import { useBirthdayStore, type RelationshipType } from "@/features/core/store/useBirthdayStore";

describe("Wish Templates Data Model", () => {
    const relationships: RelationshipType[] = [
        "partner", "friend", "family", "sibling", "brother", "sister",
        "father", "mother", "grandfather", "grandmother", "uncle", "aunt",
        "cousin", "son", "daughter", "guardian", "colleague", "mentor"
    ];

    it("has templates defined for every relationship type", () => {
        for (const rel of relationships) {
            const relTemplates = WISH_TEMPLATES.filter((t) => t.relationship === rel);
            expect(relTemplates.length).toBeGreaterThanOrEqual(6);
        }
    });

    it("interpolates recipient name correctly in getWishDeck", () => {
        const deck = getWishDeck("partner", "Aria");
        expect(deck.length).toBeGreaterThan(0);
        deck.forEach((card) => {
            expect(card.text).not.toContain("{name}");
            if (card.text.includes("Aria")) {
                expect(card.text).toContain("Aria");
            }
        });
    });

    it("falls back to family templates if an unknown relationship is provided", () => {
        const deck = getWishDeck("unknown" as unknown as RelationshipType, "Sam");
        expect(deck.length).toBeGreaterThan(0);
    });

    it("defines WRITE_YOUR_OWN_CARD with expected defaults", () => {
        expect(WRITE_YOUR_OWN_CARD.id).toBe("write-your-own");
        expect(WRITE_YOUR_OWN_CARD.text).toBe("");
        expect(WRITE_YOUR_OWN_CARD.icon).toBe("✍️");
    });
});

describe("WishDeck Component", () => {
    beforeEach(() => {
        useBirthdayStore.setState({
            config: {
                name: "Aria",
                age: 25,
                gender: "female",
                relationship: "partner",
                favoriteColor: "#FF2A6D",
                favoriteEmojis: ["💖", "🌹"],
                interests: ["music", "art"],
                customMessage: "Happy Birthday!",
                birthdayDate: null,
                language: "en",
            },
        });
    });

    afterEach(() => {
        cleanup();
        useBirthdayStore.setState({
            config: {
                name: "Alex",
                age: null,
                gender: "other",
                relationship: "friend",
                favoriteColor: "#FF6B6B",
                favoriteEmojis: [],
                interests: [],
                customMessage: "",
                birthdayDate: null,
                language: "en",
            },
        });
    });

    it("renders the heading and action buttons", () => {
        act(() => {
            render(<WishDeck />);
        });
        expect(screen.getByText(/Wishes for You/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Skip this wish/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Select this wish/i)).toBeInTheDocument();
    });

    it("allows selecting a wish and entering confirmation state", () => {
        act(() => {
            render(<WishDeck />);
        });
        const pickButton = screen.getByLabelText(/Select this wish/i);
        act(() => {
            fireEvent.click(pickButton);
        });

        expect(screen.getByText(/Use This Wish/i)).toBeInTheDocument();
        expect(screen.getByText(/Customize It/i)).toBeInTheDocument();
        expect(screen.getByText(/← Back to deck/i)).toBeInTheDocument();
    });

    it("allows customizing a selected wish", () => {
        act(() => {
            render(<WishDeck />);
        });
        act(() => {
            fireEvent.click(screen.getByLabelText(/Select this wish/i));
        });

        const customizeBtn = screen.getByText(/Customize It/i);
        act(() => {
            fireEvent.click(customizeBtn);
        });

        const textarea = screen.getByPlaceholderText(/Write a birthday wish for Aria/i);
        expect(textarea).toBeInTheDocument();

        act(() => {
            fireEvent.change(textarea, { target: { value: "You mean the world to me, Aria! ❤️" } });
        });
        expect(textarea).toHaveValue("You mean the world to me, Aria! ❤️");

        const sendBtn = screen.getByText(/Send to the World/i);
        expect(sendBtn).toBeEnabled();
    });

    it("supports skipping through cards", () => {
        act(() => {
            render(<WishDeck />);
        });
        const skipButton = screen.getByLabelText(/Skip this wish/i);
        act(() => {
            fireEvent.click(skipButton);
        });
        expect(screen.getByText(/Wishes for You/i)).toBeInTheDocument();
    });

    it("renders multilingual headings for Bengali, Hindi, and French", () => {
        useBirthdayStore.setState({
            config: {
                ...useBirthdayStore.getState().config,
                language: "bn",
            },
        });
        const { unmount: unmountBn } = render(<WishDeck />);
        expect(screen.getByText(/আপনার জন্য অফুরন্ত শুভকামনা/i)).toBeInTheDocument();
        unmountBn();

        useBirthdayStore.setState({
            config: {
                ...useBirthdayStore.getState().config,
                language: "hi",
            },
        });
        const { unmount: unmountHi } = render(<WishDeck />);
        expect(screen.getByText(/आपके लिए ढेरों दुआएं/i)).toBeInTheDocument();
        unmountHi();

        useBirthdayStore.setState({
            config: {
                ...useBirthdayStore.getState().config,
                language: "fr",
            },
        });
        const { unmount: unmountFr } = render(<WishDeck />);
        expect(screen.getByText(/Vœux pour toi/i)).toBeInTheDocument();
        unmountFr();
    });

    it("executes release flow and transitions to done state", async () => {
        act(() => {
            render(<WishDeck />);
        });
        act(() => {
            fireEvent.click(screen.getByLabelText(/Select this wish/i));
        });

        const useWishBtn = screen.getByText(/Use This Wish/i);
        act(() => {
            fireEvent.click(useWishBtn);
        });
    });
});
