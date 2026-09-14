import { describe, it, expect } from "vitest";
import {
    isValidHexColor,
    hexToRGB,
    hexToHSL,
    getLuminance,
    getContrastRatio,
} from "@/utils/colorUtils";

describe("colorUtils", () => {
    describe("isValidHexColor", () => {
        it("validates standard 6-digit hex codes with hash", () => {
            expect(isValidHexColor("#FF6B6B")).toBe(true);
            expect(isValidHexColor("#000000")).toBe(true);
            expect(isValidHexColor("#ffffff")).toBe(true);
        });

        it("validates 3-digit hex codes with hash", () => {
            expect(isValidHexColor("#FFF")).toBe(true);
            expect(isValidHexColor("#f0a")).toBe(true);
        });

        it("validates hex codes without hash", () => {
            expect(isValidHexColor("FF6B6B")).toBe(true);
            expect(isValidHexColor("FFF")).toBe(true);
        });

        it("rejects invalid characters, wrong lengths, or empty input", () => {
            expect(isValidHexColor("#GGG")).toBe(false);
            expect(isValidHexColor("#12345")).toBe(false);
            expect(isValidHexColor("#1234567")).toBe(false);
            expect(isValidHexColor("")).toBe(false);
            expect(isValidHexColor(null)).toBe(false);
            expect(isValidHexColor(undefined)).toBe(false);
        });
    });

    describe("hexToRGB", () => {
        it("converts 6-digit hex to RGB", () => {
            expect(hexToRGB("#000000")).toEqual({ r: 0, g: 0, b: 0 });
            expect(hexToRGB("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
            expect(hexToRGB("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
        });

        it("converts 3-digit hex to RGB", () => {
            expect(hexToRGB("#FFF")).toEqual({ r: 255, g: 255, b: 255 });
            expect(hexToRGB("#000")).toEqual({ r: 0, g: 0, b: 0 });
        });

        it("falls back to default pink on invalid hex", () => {
            expect(hexToRGB("invalid")).toEqual({ r: 255, g: 107, b: 107 });
        });
    });

    describe("hexToHSL", () => {
        it("converts pure red to HSL", () => {
            const hsl = hexToHSL("#FF0000");
            expect(hsl.h).toBe(0);
            expect(hsl.s).toBe(100);
            expect(hsl.l).toBe(50);
        });

        it("converts pure white to HSL", () => {
            const hsl = hexToHSL("#FFFFFF");
            expect(hsl.l).toBe(100);
            expect(hsl.s).toBe(0);
        });

        it("converts pure black to HSL", () => {
            const hsl = hexToHSL("#000000");
            expect(hsl.l).toBe(0);
            expect(hsl.s).toBe(0);
        });
    });

    describe("getLuminance and getContrastRatio", () => {
        it("calculates relative luminance correctly", () => {
            expect(getLuminance("#000000")).toBe(0);
            expect(getLuminance("#FFFFFF")).toBeCloseTo(1, 4);
        });

        it("computes standard contrast ratio between black and white as 21:1", () => {
            const contrast = getContrastRatio("#000000", "#FFFFFF");
            expect(contrast).toBe(21);
        });

        it("computes symmetric contrast ratio", () => {
            expect(getContrastRatio("#FFFFFF", "#000000")).toBe(
                getContrastRatio("#000000", "#FFFFFF")
            );
        });
    });
});
