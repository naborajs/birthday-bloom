import { describe, it, expect } from "vitest";
import {
    clampVolume,
    isAudioMuted,
    calculateFadeStep,
    getEffectiveBgVolume,
} from "@/utils/audioUtils";

describe("audioUtils", () => {
    describe("clampVolume", () => {
        it("clamps volume values between 0.0 and 1.0", () => {
            expect(clampVolume(0.5)).toBe(0.5);
            expect(clampVolume(-0.2)).toBe(0);
            expect(clampVolume(1.5)).toBe(1);
        });

        it("handles NaN safely", () => {
            expect(clampVolume(NaN)).toBe(0);
        });
    });

    describe("isAudioMuted", () => {
        it("detects silent volumes as muted", () => {
            expect(isAudioMuted(0)).toBe(true);
            expect(isAudioMuted(0.0005)).toBe(true);
            expect(isAudioMuted(0.1)).toBe(false);
        });
    });

    describe("calculateFadeStep", () => {
        it("calculates positive step when fading up", () => {
            const step = calculateFadeStep(0, 1, 10);
            expect(step).toBe(0.1);
        });

        it("calculates negative step when fading down", () => {
            const step = calculateFadeStep(1, 0, 10);
            expect(step).toBe(-0.1);
        });

        it("returns 0 for zero steps", () => {
            expect(calculateFadeStep(0, 1, 0)).toBe(0);
        });
    });

    describe("getEffectiveBgVolume", () => {
        it("returns 0 when muted", () => {
            expect(getEffectiveBgVolume(true, 0.4)).toBe(0);
        });

        it("returns clamped base volume when unmuted", () => {
            expect(getEffectiveBgVolume(false, 0.35)).toBe(0.35);
            expect(getEffectiveBgVolume(false, 1.5)).toBe(1);
        });
    });
});
