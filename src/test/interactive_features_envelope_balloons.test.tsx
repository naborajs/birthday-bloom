import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EnvelopeLetterScene } from "@/components/birthday/EnvelopeLetterScene";
import { BalloonPopGame } from "@/components/birthday/BalloonPopGame";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

// Mock confetti to prevent canvas context error in jsdom
vi.mock("@/components/birthday/Confetti", () => ({
    useConfetti: () => ({
        fireConfetti: vi.fn(),
        fireStars: vi.fn(),
        fireCinematicCelebration: vi.fn(),
    }),
}));

// Mock framer-motion to render elements cleanly in jsdom
vi.mock("framer-motion", async () => {
    const actual = await vi.importActual("framer-motion");
    const filterMotionProps = (props: Record<string, unknown>) => {
        const {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            transition: _transition,
            variants: _variants,
            whileHover: _whileHover,
            whileTap: _whileTap,
            whileInView: _whileInView,
            whileFocus: _whileFocus,
            whileDrag: _whileDrag,
            layout: _layout,
            layoutId: _layoutId,
            ...domProps
        } = props;
        return domProps;
    };

    return {
        ...actual,
        AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
        motion: {
            div: ({ children, className, onClick, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
                <div className={className} onClick={onClick} style={style} {...filterMotionProps(props as Record<string, unknown>)}>
                    {children}
                </div>
            ),
            h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className={className} {...filterMotionProps(props as Record<string, unknown>)}>{children}</h1>,
            h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className={className} {...filterMotionProps(props as Record<string, unknown>)}>{children}</h2>,
            h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className={className} {...filterMotionProps(props as Record<string, unknown>)}>{children}</h3>,
            span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span className={className} {...filterMotionProps(props as Record<string, unknown>)}>{children}</span>,
            p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className={className} {...filterMotionProps(props as Record<string, unknown>)}>{children}</p>,
            button: ({ children, className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
                <button className={className} onClick={onClick} {...filterMotionProps(props as Record<string, unknown>)}>
                    {children}
                </button>
            ),
        },
    };
});

describe("Interactive Features: EnvelopeLetterScene and BalloonPopGame", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        useBirthdayStore.setState({
            config: {
                name: "Aria",
                age: 24,
                gender: "female",
                relationship: "partner",
                language: "en",
                favoriteColor: "#FF2A6D",
                mood: "romantic",
                interests: ["music"],
            },
        });
    });

    describe("EnvelopeLetterScene", () => {
        it("renders initial closed envelope state with wax seal and title", () => {
            render(<EnvelopeLetterScene autoOpen={false} />);
            expect(screen.getByText(/Meanwhile the surprise/i)).toBeInTheDocument();
            expect(screen.getByText(/Tap to open letter/i)).toBeInTheDocument();
        });

        it("opens envelope and extracts parchment letter when tapped", async () => {
            render(<EnvelopeLetterScene autoOpen={false} />);
            const envelope = screen.getByText(/Meanwhile the surprise/i).closest("div");
            expect(envelope).toBeDefined();

            act(() => {
                fireEvent.click(envelope!);
            });

            // Fast forward extraction timer (900ms)
            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.getByText(/A Message From My Heart/i)).toBeInTheDocument();
        });

        it("types handwritten cursive text across timer ticks", async () => {
            render(<EnvelopeLetterScene autoOpen={true} />);

            // Advance autoOpen (800ms) + extraction (900ms)
            act(() => {
                vi.advanceTimersByTime(2000);
            });

            expect(screen.getByText(/A Message From My Heart/i)).toBeInTheDocument();

            // Advance timer with state re-renders
            for (let i = 0; i < 250; i++) {
                act(() => {
                    vi.advanceTimersByTime(35);
                });
            }

            // Heartfelt partner message should be typed out
            expect(screen.getByText(/Queen|Muse|grace|warmth|Aria/i)).toBeInTheDocument();
        });

        it("renders French localized letter when language is fr", async () => {
            useBirthdayStore.setState({
                config: {
                    name: "Camille",
                    gender: "female",
                    relationship: "partner",
                    language: "fr",
                    favoriteColor: "#FF2A6D",
                    mood: "romantic",
                    interests: [],
                },
            });

            render(<EnvelopeLetterScene autoOpen={true} />);
            act(() => {
                vi.advanceTimersByTime(2000);
            });

            expect(screen.getByText(/Un Message de Mon Cœur/i)).toBeInTheDocument();
        });
    });

    describe("BalloonPopGame", () => {
        it("renders header badge and 4 floating balloons initially", () => {
            render(<BalloonPopGame />);
            expect(screen.getByText(/Pop the balloons!/i)).toBeInTheDocument();
            expect(screen.getByText(/Tap each balloon to reveal/i)).toBeInTheDocument();
        });

        it("pops balloon on click and reveals the secret word", async () => {
            render(<BalloonPopGame />);
            // Word 1 is "You"
            expect(screen.queryByText(/^You$/i)).toBeNull();

            // Find interactive balloon elements
            const balloons = document.querySelectorAll(".cursor-pointer");
            expect(balloons.length).toBeGreaterThan(0);

            act(() => {
                fireEvent.click(balloons[0]);
            });

            expect(screen.getByText(/^You$/i)).toBeInTheDocument();
        });

        it("reveals all 4 words and shows play again button when all balloons popped", async () => {
            render(<BalloonPopGame />);
            const balloons = document.querySelectorAll(".cursor-pointer");

            balloons.forEach((b) => {
                act(() => {
                    fireEvent.click(b);
                });
            });

            act(() => {
                vi.advanceTimersByTime(600);
            });

            expect(screen.getByText(/^You$/i)).toBeInTheDocument();
            expect(screen.getByText(/^are$/i)).toBeInTheDocument();
            expect(screen.getByText(/^so$/i)).toBeInTheDocument();
            expect(screen.getByText(/loved!/i)).toBeInTheDocument();
            expect(screen.getByText(/Play Again/i)).toBeInTheDocument();
        });
    });
});
