import { describe, it, expect } from "vitest";
import {
    getDaysUntilBirthday,
    isTodayBirthday,
    calculateAge,
    formatBirthdayDisplay,
} from "@/utils/dateUtils";

describe("dateUtils", () => {
    describe("getDaysUntilBirthday", () => {
        it("returns 0 if today is the birthday", () => {
            const today = new Date(2026, 3, 24); // April 24, 2026
            const days = getDaysUntilBirthday("2026-04-24", today);
            expect(days).toBe(0);
        });

        it("calculates positive days when birthday is later in the current year", () => {
            const refDate = new Date(2026, 3, 20); // April 20, 2026
            const days = getDaysUntilBirthday("2026-04-24", refDate);
            expect(days).toBe(4);
        });

        it("calculates days rolling into next year when birthday has passed", () => {
            const refDate = new Date(2026, 4, 1); // May 1, 2026
            const days = getDaysUntilBirthday("2026-04-24", refDate);
            expect(days).toBeGreaterThan(300);
        });

        it("handles null and undefined dates gracefully", () => {
            expect(getDaysUntilBirthday(null)).toBe(0);
            expect(getDaysUntilBirthday(undefined)).toBe(0);
        });
    });

    describe("isTodayBirthday", () => {
        it("returns true when current date matches birthday", () => {
            const today = new Date(2026, 3, 24);
            expect(isTodayBirthday("2026-04-24", today)).toBe(true);
        });

        it("returns false when date does not match", () => {
            const today = new Date(2026, 3, 20);
            expect(isTodayBirthday("2026-04-24", today)).toBe(false);
        });
    });

    describe("calculateAge", () => {
        it("calculates exact age before birthday in current year", () => {
            const refDate = new Date(2026, 2, 1); // March 1, 2026
            const age = calculateAge("2000-04-24", refDate);
            expect(age).toBe(25);
        });

        it("calculates exact age after birthday in current year", () => {
            const refDate = new Date(2026, 5, 1); // June 1, 2026
            const age = calculateAge("2000-04-24", refDate);
            expect(age).toBe(26);
        });

        it("returns null for invalid inputs", () => {
            expect(calculateAge("invalid-date")).toBeNull();
            expect(calculateAge(null)).toBeNull();
        });
    });

    describe("formatBirthdayDisplay", () => {
        it("formats birthday month and day in polite en-US", () => {
            const formatted = formatBirthdayDisplay("2026-04-24", "en-US");
            expect(formatted).toBe("April 24");
        });

        it("returns empty string on empty input", () => {
            expect(formatBirthdayDisplay(null)).toBe("");
            expect(formatBirthdayDisplay("")).toBe("");
        });
    });
});
