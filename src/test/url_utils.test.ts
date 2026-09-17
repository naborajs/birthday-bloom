import { describe, it, expect } from "vitest";
import {
    buildShareUrl,
    parseCelebrationParams,
    sanitizeUrlParam,
} from "@/utils/urlUtils";

describe("urlUtils", () => {
    describe("sanitizeUrlParam", () => {
        it("trims whitespace from parameters", () => {
            expect(sanitizeUrlParam("  Alex  ")).toBe("Alex");
        });

        it("handles null or non-string inputs safely", () => {
            expect(sanitizeUrlParam(null)).toBe("");
            expect(sanitizeUrlParam(undefined)).toBe("");
        });
    });

    describe("buildShareUrl", () => {
        it("builds a canonical share URL with parameters and UTM tracking", () => {
            const url = buildShareUrl({
                baseUrl: "https://birthday-bloom.vercel.app/",
                name: "Sarah",
                relationship: "friend",
                language: "bn",
                age: 25,
                senderName: "Naboraj",
                includeUtm: true,
            });

            expect(url).toContain("https://birthday-bloom.vercel.app/?");
            expect(url).toContain("name=Sarah");
            expect(url).toContain("rel=friend");
            expect(url).toContain("lang=bn");
            expect(url).toContain("age=25");
            expect(url).toContain("sender=Naboraj");
            expect(url).toContain("utm_source=share");
            expect(url).toContain("utm_campaign=birthday_celebration");
        });

        it("omits default values like english lang or partner rel", () => {
            const url = buildShareUrl({
                baseUrl: "https://birthday-bloom.vercel.app/",
                name: "Alex",
                relationship: "partner",
                language: "en",
                includeUtm: false,
            });

            expect(url).toBe("https://birthday-bloom.vercel.app/?name=Alex");
            expect(url).not.toContain("lang=en");
            expect(url).not.toContain("rel=partner");
        });
    });

    describe("parseCelebrationParams", () => {
        it("parses query string into typed object", () => {
            const query = "?name=Elena&rel=sister&lang=fr&age=22&sender=Lucas&phase=main";
            const parsed = parseCelebrationParams(query);

            expect(parsed.name).toBe("Elena");
            expect(parsed.relationship).toBe("sister");
            expect(parsed.language).toBe("fr");
            expect(parsed.age).toBe(22);
            expect(parsed.senderName).toBe("Lucas");
            expect(parsed.phase).toBe("main");
        });

        it("supports aliases like 'recipient' and 'from'", () => {
            const query = "?recipient=Maya&from=Aiden";
            const parsed = parseCelebrationParams(query);

            expect(parsed.name).toBe("Maya");
            expect(parsed.senderName).toBe("Aiden");
        });

        it("returns empty object for empty search string", () => {
            expect(parseCelebrationParams("")).toEqual({});
        });
    });
});
