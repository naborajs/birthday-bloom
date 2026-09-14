import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BalloonPopGame } from "@/components/birthday/BalloonPopGame";
import { ShareCelebrationModal } from "@/components/birthday/ShareCelebrationModal";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
    default: vi.fn(),
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
            div: ({ children, className, onClick, onKeyDown, role, tabIndex, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
                <div
                    className={className}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    role={role}
                    tabIndex={tabIndex}
                    style={style}
                    {...filterMotionProps(props as Record<string, unknown>)}
                >
                    {children}
                </div>
            ),
            button: ({ children, className, onClick, onKeyDown, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
                <button
                    className={className}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    {...filterMotionProps(props as Record<string, unknown>)}
                >
                    {children}
                </button>
            ),
        },
    };
});

describe("Accessibility & Keyboard Navigation Suite", () => {
    describe("BalloonPopGame", () => {
        it("renders balloons as accessible buttons with proper ARIA attributes", () => {
            render(<BalloonPopGame />);
            const balloonButtons = screen.getAllByRole("button", { name: /Pop balloon/i });
            expect(balloonButtons.length).toBe(4);

            balloonButtons.forEach((btn) => {
                expect(btn).toHaveAttribute("tabindex", "0");
                expect(btn).toHaveAttribute("aria-label");
            });
        });

        it("pops balloon when Enter key is pressed", () => {
            render(<BalloonPopGame />);
            const initialBalloons = screen.getAllByRole("button", { name: /Pop balloon/i });
            expect(initialBalloons.length).toBe(4);

            fireEvent.keyDown(initialBalloons[0], { key: "Enter" });

            const remainingBalloons = screen.getAllByRole("button", { name: /Pop balloon/i });
            expect(remainingBalloons.length).toBe(3);
        });

        it("pops balloon when Space key is pressed", () => {
            render(<BalloonPopGame />);
            const balloons = screen.getAllByRole("button", { name: /Pop balloon/i });
            fireEvent.keyDown(balloons[0], { key: " " });

            const remaining = screen.getAllByRole("button", { name: /Pop balloon/i });
            expect(remaining.length).toBe(3);
        });
    });

    describe("ShareCelebrationModal", () => {
        it("closes modal on Escape key press", () => {
            const onClose = vi.fn();
            render(<ShareCelebrationModal isOpen={true} onClose={onClose} />);

            fireEvent.keyDown(window, { key: "Escape" });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("renders modal dialog with aria-modal and aria-labelledby", () => {
            const onClose = vi.fn();
            render(<ShareCelebrationModal isOpen={true} onClose={onClose} />);

            const dialog = screen.getByRole("dialog");
            expect(dialog).toBeInTheDocument();
            expect(dialog).toHaveAttribute("aria-modal", "true");
        });
    });
});
