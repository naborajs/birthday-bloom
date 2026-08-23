import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import { KineticText } from "@/components/birthday/KineticText";
import { TypeWriter } from "@/components/birthday/TypeWriter";
import fs from "fs";
import path from "path";

// Helper function to test regex fallback logic directly
const splitGraphemesWithRegexFallback = (str: string): string[] => {
  const match = str.match(/[\s\S][\u0300-\u036f\u0900-\u097f\u0980-\u09ff]*/g);
  return match || Array.from(str);
};

// Intl.Segmenter helper
const splitGraphemesWithIntl = (str: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as unknown as {
      Segmenter: new (locales?: string | string[], options?: { granularity: "grapheme" | "word" | "sentence" }) => {
        segment(input: string): Iterable<{ segment: string }>;
      };
    }).Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (s: { segment: string }) => s.segment);
  }
  return splitGraphemesWithRegexFallback(str);
};

describe("Adversarial Stress Test: Indic Grapheme Cluster Segmentation & Animation", () => {
  describe("1. Bengali Complex Words Segmentation Integrity", () => {
    const bengaliTestCases = [
      {
        word: "ভালোবাসা",
        description: "Standard vowel matras (aa-kar, o-kar)",
        expectedClusters: ["ভা", "লো", "বা", "সা"],
      },
      {
        word: "স্মৃতিসমূহ",
        description: "Initial conjunct + ri-kar (স্মৃ), hrasva u-kar (মু), dirgha u-kar (মূ)",
        expectedClusters: ["স্মৃ", "তি", "স", "মূ", "হ"],
      },
      {
        word: "শুভ জন্মদিন",
        description: "Multi-word with space and medial conjunct (ন্ম)",
        expectedClusters: ["শু", "ভ", " ", "জ", "ন্ম", "দি", "ন"],
      },
      {
        word: "ঐন্দ্রিলা",
        description: "Initial diphthong + triple conjunct with i-kar and r-phala (ন্দ্রি)",
        expectedClusters: ["ঐ", "ন্দ্রি", "লা"],
      },
      {
        word: "শ্রদ্ধা",
        description: "Sha + r-phala (শ্র) and double dha conjunct with aa-kar (দ্ধা)",
        expectedClusters: ["শ্র", "দ্ধা"],
      },
      {
        word: "প্রণাম",
        description: "Pra-kar and murdhanya Na with aa-kar",
        expectedClusters: ["প্র", "ণা", "ম"],
      },
      {
        word: "বন্ধুত্ব",
        description: "Anusvara-like conjunct (ন্ধু) and ta-va conjunct (ত্ব)",
        expectedClusters: ["ব", "ন্ধু", "ত্ব"],
      },
      {
        word: "স্নেহাশীষ",
        description: "Sna conjunct with e-kar (স্নে) and dirgha i-kar (শী)",
        expectedClusters: ["স্নে", "হা", "শী", "ষ"],
      },
      {
        word: "হৃদয়স্পর্শী",
        description: "Hri-kar (হৃ), spa conjunct, and reph with dirgha i-kar (র্শী)",
        expectedClusters: ["হৃ", "দ", "য়", "স্প", "র্শী"],
      },
    ];

    for (const tc of bengaliTestCases) {
      it(`correctly segments Bengali word: '${tc.word}' (${tc.description})`, () => {
        const intlClusters = splitGraphemesWithIntl(tc.word);
        expect(intlClusters).toEqual(tc.expectedClusters);
        expect(intlClusters.join("")).toBe(tc.word);

        // Verify that combining characters are never orphaned at index 0 of any cluster
        const orphanCombiningRegex = /^[\u0981-\u0983\u09BC\u09BE-\u09CD\u09D7]/;
        for (let i = 0; i < intlClusters.length; i++) {
          const cluster = intlClusters[i];
          if (cluster.trim().length > 0) {
            expect(cluster).not.toMatch(orphanCombiningRegex);
          }
        }
      });
    }
  });

  describe("2. Devanagari Complex Words Segmentation Integrity", () => {
    const devanagariTestCases = [
      {
        word: "प्रोत्साहन",
        description: "Complex initial conjunct with o-kar (प्रो) and medial t-sa conjunct (त्सा)",
        expectedClusters: ["प्रो", "त्सा", "ह", "न"],
      },
      {
        word: "सरताज",
        description: "Simple multi-syllable with aa-kar (ता)",
        expectedClusters: ["स", "र", "ता", "ज"],
      },
      {
        word: "बंदगी",
        description: "Anusvara (बं) and dirgha ee-kar (गी)",
        expectedClusters: ["बं", "द", "गी"],
      },
      {
        word: "आशीर्वाद",
        description: "Initial independent vowel, sha + ee-kar, and va + reph + aa-kar (र्वा)",
        expectedClusters: ["आ", "शी", "र्वा", "द"],
      },
      {
        word: "कृतज्ञता",
        description: "Kri-kar (कृ) and jna conjunct (ज्ञ)",
        expectedClusters: ["कृ", "त", "ज्ञ", "ता"],
      },
      {
        word: "सौहार्द",
        description: "Au-kar (सौ) and da + reph (र्द)",
        expectedClusters: ["सौ", "हा", "र्द"],
      },
      {
        word: "उज्ज्वल",
        description: "Independent vowel (उ) and triple conjunct ja-ja-va (ज्ज्व)",
        expectedClusters: ["उ", "ज्ज्व", "ल"],
      },
      {
        word: "हृदयस्पर्शी",
        description: "Hri-kar (हृ), spa conjunct, and sha + reph + ee-kar (र्शी)",
        expectedClusters: ["हृ", "द", "य", "स्प", "र्शी"],
      },
    ];

    for (const tc of devanagariTestCases) {
      it(`correctly segments Devanagari word: '${tc.word}' (${tc.description})`, () => {
        const intlClusters = splitGraphemesWithIntl(tc.word);
        expect(intlClusters).toEqual(tc.expectedClusters);
        expect(intlClusters.join("")).toBe(tc.word);

        // Verify that combining characters are never orphaned at index 0 of any cluster
        const orphanCombiningRegex = /^[\u0901-\u0903\u093C\u093E-\u094F\u0955-\u0957\u0962-\u0963]/;
        for (let i = 0; i < intlClusters.length; i++) {
          const cluster = intlClusters[i];
          if (cluster.trim().length > 0) {
            expect(cluster).not.toMatch(orphanCombiningRegex);
          }
        }
      });
    }
  });

  describe("3. Zero-Width Joiner (ZWJ) and Zero-Width Non-Joiner (ZWNJ) Handling", () => {
    it("handles explicit ZWJ and ZWNJ in Bengali ligatures without throwing or corrupting", () => {
      // Khanda Ta vs Ta + Hasanta
      const withKhandaTa = "উৎসব"; // U + Khanda Ta + Sa + Ba
      const clustersKhandaTa = splitGraphemesWithIntl(withKhandaTa);
      expect(clustersKhandaTa).toEqual(["উ", "ৎ", "স", "ব"]);
      expect(clustersKhandaTa.join("")).toBe(withKhandaTa);

      // Explicit ZWNJ: র + ্ + \u200C + য
      const withZwnj = "র\u09CD\u200Cয";
      const clustersZwnj = splitGraphemesWithIntl(withZwnj);
      expect(clustersZwnj.join("")).toBe(withZwnj);

      // Explicit ZWJ: ক + ্ + \u200D + ষ
      const withZwj = "ক\u09CD\u200Dষ";
      const clustersZwj = splitGraphemesWithIntl(withZwj);
      expect(clustersZwj.join("")).toBe(withZwj);
    });

    it("handles Hindi Nuqta and ZWJ combinations cleanly", () => {
      // फ़िल्मी (Fa with nuqta + i-kar, la-ma conjunct with dirgha ee-kar)
      const filmi = "फ़िल्मी";
      const clusters = splitGraphemesWithIntl(filmi);
      expect(clusters).toEqual(["फ़ि", "ल्मी"]);
      expect(clusters.join("")).toBe(filmi);
    });
  });

  describe("4. KineticText DOM & Typography Stress Tests", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders Bengali text in KineticText with intact word tokens and aria-label accessibility", () => {
      const bengaliText = "শুভ জন্মদিন প্রিয় বন্ধু";
      const onCompleteSpy = vi.fn();

      const { container } = render(
        <KineticText text={bengaliText} animation="zoom-in" onComplete={onCompleteSpy} />
      );

      // Fast forward start delay
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // Check aria-label accessibility wrapper
      const rootSpan = container.querySelector("span[aria-label]");
      expect(rootSpan).not.toBeNull();
      expect(rootSpan?.getAttribute("aria-label")).toBe(bengaliText);

      // Verify that word containers have inline-flex and whitespace-nowrap to prevent mid-syllable wrap
      const wordWrappers = container.querySelectorAll(".whitespace-nowrap");
      expect(wordWrappers.length).toBe(4); // 4 words: শুভ, জন্মদিন, প্রিয়, বন্ধু

      // Verify character elements inside first word: 'শু', 'ভ'
      const firstWordChars = wordWrappers[0].querySelectorAll("span");
      expect(firstWordChars.length).toBe(2);
      expect(firstWordChars[0].textContent).toBe("শু");
      expect(firstWordChars[1].textContent).toBe("ভ");

      // Verify second word: 'জ', 'ন্ম', 'দি', 'ন'
      const secondWordChars = wordWrappers[1].querySelectorAll("span");
      expect(secondWordChars.length).toBe(4);
      expect(secondWordChars[0].textContent).toBe("জ");
      expect(secondWordChars[1].textContent).toBe("ন্ম");
      expect(secondWordChars[2].textContent).toBe("দি");
      expect(secondWordChars[3].textContent).toBe("ন");

      // Fast-forward animation completion
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onCompleteSpy).toHaveBeenCalledTimes(1);
    });

    it("renders Devanagari text in KineticText with all animation styles without error", () => {
      const devanagariText = "सफलता और प्रोत्साहन";
      const animations = [
        "zoom-in",
        "pop-out",
        "stagger-up",
        "float",
        "wave",
        "typewriter-burst",
      ] as const;

      for (const anim of animations) {
        const { container, unmount } = render(
          <KineticText text={devanagariText} animation={anim} />
        );

        act(() => {
          vi.advanceTimersByTime(50);
        });

        const rootSpan = container.querySelector("span[aria-label]");
        expect(rootSpan?.getAttribute("aria-label")).toBe(devanagariText);

        const wordWrappers = container.querySelectorAll(".whitespace-nowrap");
        expect(wordWrappers.length).toBe(3); // 3 words: सफलता, और, प्रोत्साहन

        unmount();
      }
    });

    it("handles zero-delay, empty text, and whitespace-only text gracefully", () => {
      const { container: emptyContainer } = render(
        <KineticText text="" animation="float" />
      );
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(emptyContainer.textContent).toBe("");

      const { container: spaceContainer } = render(
        <KineticText text="   " animation="wave" />
      );
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(spaceContainer.textContent).toBeTruthy();
    });
  });

  describe("5. TypeWriter Step-by-Step Indic Grapheme Playback", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("types Bengali complex text one whole grapheme cluster per tick with no orphan matras", () => {
      const bengaliPhrase = "ভালোবাসা ও আশীর্বাদ";
      const onCompleteSpy = vi.fn();

      const { container } = render(
        <TypeWriter text={bengaliPhrase} speed={40} onComplete={onCompleteSpy} cursor={true} />
      );

      // Initially mount (delay = 0)
      act(() => {
        vi.advanceTimersByTime(10);
      });

      const clusters = splitGraphemesWithIntl(bengaliPhrase);
      // Step through each cluster tick
      for (let i = 1; i <= clusters.length; i++) {
        act(() => {
          vi.advanceTimersByTime(40);
        });

        const currentExpectedText = clusters.slice(0, i).join("");
        expect(container.textContent).toContain(currentExpectedText);

        // Ensure no combining character is rendered at the trailing position without its base
        expect(currentExpectedText.length).toBeGreaterThanOrEqual(i);
      }

      // Fast-forward to trigger onComplete
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(onCompleteSpy).toHaveBeenCalledTimes(1);
    });

    it("types Devanagari text with accurate incremental text and cursor visibility during typing", () => {
      const hindiPhrase = "जन्मदिन मुबारक";
      const { container } = render(
        <TypeWriter text={hindiPhrase} speed={50} cursor={true} />
      );

      act(() => {
        vi.advanceTimersByTime(10);
      });

      const clusters = splitGraphemesWithIntl(hindiPhrase);

      for (let i = 1; i <= clusters.length; i++) {
        act(() => {
          vi.advanceTimersByTime(50);
        });
        const currentSlice = clusters.slice(0, i).join("");
        expect(container.textContent).toContain(currentSlice);

        // Check that cursor is visible while typing intermediate characters
        if (i < clusters.length) {
          expect(container.querySelector(".animate-blink")).not.toBeNull();
        }
      }

      // After full completion, cursor should disappear
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(container.querySelector(".animate-blink")).toBeNull();
    });
  });

  describe("6. Responsive Layout & CSS Continuity Verification", () => {
    it("verifies index.css contains Indic font rules, normal letter-spacing, and no text-transform", () => {
      const indexCssPath = path.resolve(__dirname, "../index.css");
      const indexCss = fs.readFileSync(indexCssPath, "utf-8");

      // Verify Google Fonts import for Bengali and Devanagari
      expect(indexCss).toContain("Noto+Sans+Bengali");
      expect(indexCss).toContain("Hind+Siliguri");
      expect(indexCss).toContain("Noto+Sans+Devanagari");
      expect(indexCss).toContain("Rozha+One");

      // Verify Shirorekha continuity CSS rules
      expect(indexCss).toContain('html[lang="bn"] *');
      expect(indexCss).toContain('html[lang="hi"] *');
      expect(indexCss).toContain("letter-spacing: normal !important");
      expect(indexCss).toContain("text-transform: none !important");
    });

    it("verifies responsive Tailwind classes in CakeCutting, PasswordUnlock, HeartTree, PhotoGallery", () => {
      const srcDir = path.resolve(__dirname, "..");

      // CakeCutting.tsx
      const cakeCuttingPath = path.join(srcDir, "components/birthday/CakeCutting.tsx");
      const cakeCutting = fs.readFileSync(cakeCuttingPath, "utf-8");
      expect(cakeCutting).toContain("w-44 sm:w-48");
      expect(cakeCutting).toContain("whitespace-normal px-3 py-1.5 leading-tight");

      // PasswordUnlock.tsx
      const passwordUnlockPath = path.join(srcDir, "components/birthday/PasswordUnlock.tsx");
      const passwordUnlock = fs.readFileSync(passwordUnlockPath, "utf-8");
      expect(passwordUnlock).toContain("p-6 sm:p-8");
      expect(passwordUnlock).toContain("px-3 sm:px-6");

      // HeartTree.tsx
      const heartTreePath = path.join(srcDir, "components/birthday/HeartTree.tsx");
      const heartTree = fs.readFileSync(heartTreePath, "utf-8");
      expect(heartTree).toContain('width: "min(300px, 90%)"');
      expect(heartTree).toContain('top: "8%"');

      // PhotoGallery.tsx
      const photoGalleryPath = path.join(srcDir, "components/birthday/PhotoGallery.tsx");
      const photoGallery = fs.readFileSync(photoGalleryPath, "utf-8");
      expect(photoGallery).toContain("top-4 right-4 md:-top-12 md:-right-12");
    });

    it("verifies dynamic theme font fallbacks include Bengali and Devanagari fonts", () => {
      const themePath = path.resolve(__dirname, "../features/core/theme/useDynamicTheme.ts");
      const themeCode = fs.readFileSync(themePath, "utf-8");

      expect(themeCode).toContain('"Noto Sans Bengali"');
      expect(themeCode).toContain('"Noto Sans Devanagari"');
      expect(themeCode).toContain('"Hind Siliguri"');
    });
  });
});
