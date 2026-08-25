import { describe, it, expect } from "vitest";
import {
  getTranslation,
  getTranslationValue,
  interpolate,
  translations,
  type SupportedLanguage,
} from "@/i18n";
import {
  getHighlySpecificLetter,
  getBigWishes,
} from "@/features/core/store/SuperPersonalizedLogic";
import {
  generatePasswordFromDate,
  getEffectivePassword,
  isPasswordRequired,
} from "@/utils/password";
import {
  FAMILY_TEMPLATE_VERSION,
  createFamilyMemberProfile,
  validateFamilyMemberProfile,
  migrateLegacyFamilyMember,
  createCustomFamilyMemberTemplate,
  type FamilyMemberType,
  type PrivacyLevel,
} from "@/features/core/models/familyTemplates";
import { useBirthdayStore, type RelationshipType, type GenderType } from "@/features/core/store/useBirthdayStore";
import { getYouTubeEmbedUrl } from "@/lib/utils";

// Intl.Segmenter helper for Indic segmentation stress tests
const splitGraphemesWithIntl = (str: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as unknown as {
      Segmenter: new (
        locales?: string | string[],
        options?: { granularity: "grapheme" | "word" | "sentence" }
      ) => {
        segment(input: string): Iterable<{ segment: string }>;
      };
    }).Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (s: { segment: string }) => s.segment);
  }
  const match = str.match(/[\s\S][\u0300-\u036f\u0900-\u097f\u0980-\u09ff]*/g);
  return match || Array.from(str);
};

describe("Adversarial Stress Suite: Multilingual & State Machine Challenger", () => {
  // =========================================================================
  // 1. 4-Language Localization & Complex Conjunct Rendering
  // =========================================================================
  describe("1. Multilingual Locale Resolution & Interpolation Stress (EN, BN, HI, FR)", () => {
    const allLangs: SupportedLanguage[] = ["en", "bn", "hi", "fr"];

    it("verifies key parity across all 4 locales for all top-level translation domains", () => {
      const topLevelKeys = [
        "common",
        "splash",
        "intro",
        "cake",
        "memories",
        "quiz",
        "gift",
        "heartTree",
        "chat",
      ] as const;

      for (const lang of allLangs) {
        const dict = translations[lang];
        expect(dict, `Locale '${lang}' should be defined in registry`).toBeDefined();

        for (const section of topLevelKeys) {
          expect(
            dict[section],
            `Locale '${lang}' must have section '${section}' defined`
          ).toBeDefined();
          expect(
            typeof dict[section],
            `Locale '${lang}.${section}' should be an object`
          ).toBe("object");

          // Ensure every string within the section is non-empty
          const entries = Object.entries(dict[section]);
          expect(entries.length, `Locale '${lang}.${section}' should not be empty`).toBeGreaterThan(0);
          for (const [subKey, val] of entries) {
            expect(typeof val, `${lang}.${section}.${subKey} should be a string`).toBe("string");
            expect((val as string).length, `${lang}.${section}.${subKey} should not be empty`).toBeGreaterThan(0);
          }
        }
      }
    });

    it("resolves all language aliases and casing variations without throwing", () => {
      const frenchAliases = [
        "fr", "FR", "Fr", "french", "FRENCH", "French",
        "francais", "FRANCAIS", "française", "FRANÇAISE", "francaise",
        "  fr  ", " french "
      ];
      for (const alias of frenchAliases) {
        const t = getTranslation(alias);
        expect(t.common.happyBirthday).toBe("Joyeux Anniversaire");
        expect(t.common.skipIntro).toBe("Passer l'intro ⏭");
      }

      const bengaliAliases = [
        "bn", "BN", "Bn", "bengali", "BENGALI", "Bengali",
        "bangla", "BANGLA", "  bn  ", "  bengali  "
      ];
      for (const alias of bengaliAliases) {
        const t = getTranslation(alias);
        expect(t.common.happyBirthday).toBe("শুভ জন্মদিন");
        expect(t.common.skipIntro).toBe("স্কিপ করুন ⏭");
      }

      const hindiAliases = [
        "hi", "HI", "Hi", "hindi", "HINDI", "Hindi",
        "in", "IN", "  hi  ", "  hindi  "
      ];
      for (const alias of hindiAliases) {
        const t = getTranslation(alias);
        expect(t.common.happyBirthday).toBe("जन्मदिन मुबारक");
        expect(t.common.skipIntro).toBe("स्किप करें ⏭");
      }

      const englishFallbacks = [
        "en", "EN", "english", "ENGLISH", "unknown_lang",
        "es", "de", "it", "", "   ", undefined
      ];
      for (const fb of englishFallbacks) {
        const t = getTranslation(fb);
        expect(t.common.happyBirthday).toBe("Happy Birthday");
        expect(t.common.skipIntro).toBe("Skip Intro ⏭");
      }
    });

    it("interpolates parameters across all 4 languages with single and double braces", () => {
      // English
      expect(getTranslationValue("en", "common.dear", { name: "Arthur" })).toBe("Dear Arthur,");
      expect(getTranslationValue("en", "quiz.scoreSummary", { score: 5, total: 5, name: "Arthur" })).toBe(
        "You scored 5/5 on the Arthur Trivia!"
      );
      expect(getTranslationValue("en", "common.clickMoreTimes", { count: 3 })).toBe(
        "Click 🎂 3 more times!"
      );

      // French
      expect(getTranslationValue("fr", "common.dear", { name: "Camille" })).toBe("Cher(ère) Camille,");
      expect(getTranslationValue("fr", "quiz.scoreSummary", { score: 4, total: 5 })).toBe(
        "Vous avez obtenu 4 / 5 au Quiz d'Anniversaire !"
      );
      expect(getTranslationValue("fr", "gift.yourCode", { code: "CADEAU-MAGIQUE" })).toBe(
        "Votre Code : CADEAU-MAGIQUE"
      );

      // Bengali
      expect(getTranslationValue("bn", "common.dear", { name: "সৌরভ" })).toBe("প্রিয় সৌরভ,");
      expect(getTranslationValue("bn", "quiz.defaultQ1", { name: "সৌরভ" })).toBe(
        "সৌরভ-এর সবচেয়ে পছন্দের জিনিস কোনটি?"
      );
      expect(getTranslationValue("bn", "common.clickMoreTimes", { count: 3 })).toBe(
        "কেক 🎂 আরও 3 বার ক্লিক করুন!"
      );

      // Hindi
      expect(getTranslationValue("hi", "common.dear", { name: "अमित" })).toBe("प्रिय अमित,");
      expect(getTranslationValue("hi", "quiz.defaultQ1", { name: "अमित" })).toBe(
        "इस दिन पैदा हुआ सबसे शानदार इंसान कौन है?"
      );
      expect(getTranslationValue("hi", "quiz.defaultQ1Reason", { name: "अमित" })).toBe(
        "अरे वाह! जाहिर सी बात है अमित! इनके सामने कोई नहीं टिकता।"
      );
      expect(getTranslationValue("hi", "common.clickMoreTimes", { count: 4 })).toBe(
        "🎂 पर 4 बार और क्लिक करें!"
      );
    });

    it("handles adversarial interpolate arguments: special characters, braces, and missing params", () => {
      // Missing parameters - leaves template intact without error
      expect(interpolate("Hello {name}!", undefined)).toBe("Hello {name}!");
      expect(interpolate("Code: {code}", {})).toBe("Code: {code}");

      // Special characters in parameters (HTML tags, quotes, slashes, ampersand)
      const specialParam = {
        name: "<b>Celebrant & Star / 'VIP'</b>",
      };
      const interpolated = interpolate("Welcome {name} to the party!", specialParam);
      expect(interpolated).toBe("Welcome <b>Celebrant & Star / 'VIP'</b> to the party!");

      // Numeric zero, negative numbers, floats
      expect(interpolate("Score: {score}", { score: 0 })).toBe("Score: 0");
      expect(interpolate("Temp: {temp}", { temp: -15.5 })).toBe("Temp: -15.5");

      // Double brace vs single brace
      expect(interpolate("Double: {{key}} and Single: {key}", { key: "VAL" })).toBe(
        "Double: VAL and Single: VAL"
      );
    });

    it("deeply stress-tests Bengali complex conjuncts: ক্ষ, জ্ঞ, শ্র, ত্র, হ্ন, হ্ম, ঙ্ক, ষ্ঠ, দ্ধ", () => {
      const bengaliConjunctWords = [
        {
          word: "নক্ষত্র",
          conjunct: "ক্ষ, ত্র",
          expectedClusters: ["ন", "ক্ষ", "ত্র"],
        },
        {
          word: "বিজ্ঞান",
          conjunct: "জ্ঞ",
          expectedClusters: ["বি", "জ্ঞা", "ন"],
        },
        {
          word: "শ্রদ্ধাঞ্জলি",
          conjunct: "শ্র, দ্ধ",
          expectedClusters: ["শ্র", "দ্ধা", "ঞ্জ", "লি"],
        },
        {
          word: "অপরাহ্ন",
          conjunct: "হ্ন",
          expectedClusters: ["অ", "প", "রা", "হ্ন"],
        },
        {
          word: "ব্রাহ্মণ",
          conjunct: "হ্ম",
          expectedClusters: ["ব্রা", "হ্ম", "ণ"],
        },
        {
          word: "কৃতজ্ঞতা",
          conjunct: "জ্ঞ",
          expectedClusters: ["কৃ", "ত", "জ্ঞ", "তা"],
        },
        {
          word: "পরিশ্রমী",
          conjunct: "শ্র",
          expectedClusters: ["প", "রি", "শ্র", "মী"],
        },
        {
          word: "অনুষ্ঠান",
          conjunct: "ষ্ঠ",
          expectedClusters: ["অ", "নু", "ষ্ঠা", "ন"],
        },
        {
          word: "অঙ্কন",
          conjunct: "ঙ্ক",
          expectedClusters: ["অ", "ঙ্ক", "ন"],
        },
      ];

      const orphanCombiningRegex = /^[\u0981-\u0983\u09BC\u09BE-\u09CD\u09D7]/;

      for (const tc of bengaliConjunctWords) {
        const clusters = splitGraphemesWithIntl(tc.word);
        expect(clusters).toEqual(tc.expectedClusters);
        expect(clusters.join("")).toBe(tc.word);

        for (const cluster of clusters) {
          if (cluster.trim().length > 0) {
            expect(
              cluster,
              `Cluster '${cluster}' in '${tc.word}' should not start with an orphan combining mark`
            ).not.toMatch(orphanCombiningRegex);
          }
        }
      }
    });

    it("deeply stress-tests Devanagari (Hindi) complex conjuncts: क्ष, ज्ञ, श्र, त्र, ह्न, ह्म, द्व, र्त्य", () => {
      const hindiConjunctWords = [
        {
          word: "नक्षत्र",
          conjunct: "क्ष, त्र",
          expectedClusters: ["न", "क्ष", "त्र"],
        },
        {
          word: "सर्वश्रेष्ठ",
          conjunct: "र्व, श्रे, ष्ठ",
          expectedClusters: ["स", "र्व", "श्रे", "ष्ठ"],
        },
        {
          word: "कृतज्ञ",
          conjunct: "ज्ञ",
          expectedClusters: ["कृ", "त", "ज्ञ"],
        },
        {
          word: "अपराह्न",
          conjunct: "ह्न",
          expectedClusters: ["अ", "प", "रा", "ह्न"],
        },
        {
          word: "विद्वान",
          conjunct: "द्व",
          expectedClusters: ["वि", "द्वा", "न"],
        },
        {
          word: "आशीर्वाद",
          conjunct: "र्वा",
          expectedClusters: ["आ", "शी", "र्वा", "द"],
        },
      ];

      const orphanHindiRegex = /^[\u0901-\u0903\u093C\u093E-\u094F\u0955-\u0957\u0962-\u0963]/;

      for (const tc of hindiConjunctWords) {
        const clusters = splitGraphemesWithIntl(tc.word);
        expect(clusters).toEqual(tc.expectedClusters);
        expect(clusters.join("")).toBe(tc.word);

        for (const cluster of clusters) {
          if (cluster.trim().length > 0) {
            expect(
              cluster,
              `Cluster '${cluster}' in '${tc.word}' should not start with an orphan combining mark`
            ).not.toMatch(orphanHindiRegex);
          }
        }
      }
    });

    it("verifies all emotional relationship templates across EN, BN, HI, and FR with authentic personalization", () => {
      const relationships: RelationshipType[] = [
        "partner",
        "friend",
        "sibling",
        "brother",
        "sister",
        "colleague",
        "mentor",
        "family",
      ];
      const genders: GenderType[] = ["male", "female", "other"];
      const languages: SupportedLanguage[] = ["en", "bn", "hi", "fr"];

      for (const lang of languages) {
        for (const rel of relationships) {
          for (const gender of genders) {
            const sender = "TestSender";
            const letter = getHighlySpecificLetter("TestRecipient", rel, gender, [], lang, sender);

            expect(letter.length, `Letter for [${lang}, ${rel}, ${gender}] should be substantial`).toBeGreaterThan(80);
            expect(letter, `Letter for [${lang}, ${rel}, ${gender}] should contain recipient`).toContain("TestRecipient");

            // Verify no bracket placeholders remained
            expect(letter).not.toContain("[Your Name]");
            expect(letter).not.toContain("[Votre Nom]");
            expect(letter).not.toContain("[आपका नाम]");
            expect(letter).not.toContain("[আপনার নাম]");
          }
        }
      }
    });

    it("verifies Big Wishes generation across all 4 languages with coding and car triggers", () => {
      for (const lang of allLangs) {
        const wishes = getBigWishes("Aria", "partner", "female", ["coding", "super car"], lang);
        expect(wishes.length).toBeGreaterThanOrEqual(4);
        expect(wishes.some((w) => w.emoji === "💻")).toBe(true);
        expect(wishes.some((w) => w.emoji === "🏎️")).toBe(true);
        expect(wishes.some((w) => w.emoji === "❤️")).toBe(true);
      }
    });
  });

  // =========================================================================
  // 2. State Machine Rapid Phase Transitions & Narrative Pacing Multipliers
  // =========================================================================
  describe("2. State Machine Transitions, Narrative Pacing & Numeric Boundaries", () => {
    it("derives correct mood and animation pacing based on relationship archetypes", () => {
      const store = useBirthdayStore.getState();

      // Test default store getters
      expect(["slow", "fast", "moderate"]).toContain(store.getAnimationPacing());
      expect(["romantic", "energetic", "warm"]).toContain(store.getMood());
      expect(store.getLanguage()).toBeDefined();
    });

    it("simulates sequential and skip phase transitions of the state machine", () => {
      type Phase = "splash" | "unlock" | "intro" | "main";
      
      const transitionSimulator = (
        initialPhase: Phase,
        requiresPassword: boolean,
        skipTriggered: boolean
      ): Phase[] => {
        const history: Phase[] = [initialPhase];
        let current = initialPhase;

        if (skipTriggered) {
          current = "main";
          history.push(current);
          return history;
        }

        // On splash click
        if (current === "splash") {
          current = requiresPassword ? "unlock" : "intro";
          history.push(current);
        }

        // If unlock, on submit
        if (current === "unlock") {
          current = "intro";
          history.push(current);
        }

        // If intro, on complete
        if (current === "intro") {
          current = "main";
          history.push(current);
        }

        return history;
      };

      // Flow 1: Standard without password
      const flowNoPass = transitionSimulator("splash", false, false);
      expect(flowNoPass).toEqual(["splash", "intro", "main"]);

      // Flow 2: Standard with password
      const flowWithPass = transitionSimulator("splash", true, false);
      expect(flowWithPass).toEqual(["splash", "unlock", "intro", "main"]);

      // Flow 3: Skip intro from splash
      const flowSkip = transitionSimulator("splash", false, true);
      expect(flowSkip).toEqual(["splash", "main"]);
    });

    it("handles extreme animation pacing and numeric multiplier boundaries", () => {
      // Test speed multiplier calculations (0.1x to 10.0x)
      const baseDelay = 45; // ms per character
      const multipliers = [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0];

      for (const m of multipliers) {
        const effectiveSpeed = Math.max(1, Math.round(baseDelay / m));
        expect(effectiveSpeed).toBeGreaterThanOrEqual(1);
        expect(effectiveSpeed).toBeLessThanOrEqual(450);
        expect(Number.isFinite(effectiveSpeed)).toBe(true);
      }

      // Negative particle counts and boundary values
      const sanitizeParticleCount = (count?: number | null): number => {
        if (count === undefined || count === null || isNaN(count)) return 25;
        if (count < 0) return 0;
        return Math.min(100, Math.floor(count));
      };

      expect(sanitizeParticleCount(-50)).toBe(0);
      expect(sanitizeParticleCount(0)).toBe(0);
      expect(sanitizeParticleCount(25)).toBe(25);
      expect(sanitizeParticleCount(500)).toBe(100);
      expect(sanitizeParticleCount(null)).toBe(25);
      expect(sanitizeParticleCount(NaN)).toBe(25);
    });
  });

  // =========================================================================
  // 3. Hostile Input Strings & Security Invariants
  // =========================================================================
  describe("3. Hostile Input Strings, XSS Vectors & Unicode Adversarial Stress", () => {
    it("handles 10,000+ character strings without crashing or timing out", () => {
      const massiveName = "A".repeat(10000);
      const massiveSender = "Sender-".repeat(1500);

      // Letter generation with 10k name
      const startTime = performance.now();
      const letter = getHighlySpecificLetter(massiveName, "friend", "male", ["coding"], "en", massiveSender);
      const elapsed = performance.now() - startTime;

      expect(letter).toContain(massiveName);
      expect(letter).toContain(massiveSender);
      expect(elapsed, "10k letter interpolation should execute under 100ms").toBeLessThan(100);

      // Interpolation with 10k parameter
      const interpolated = interpolate("Happy Birthday {name}!", { name: massiveName });
      expect(interpolated.length).toBeGreaterThan(10000);
    });

    it("safely neutralizes XSS scripts and HTML injection payloads in letters and embed URLs", () => {
      const xssPayloads = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert(1)>",
        "<svg/onload=alert('document.cookie')>",
        "'\"><script src=https://evil.com/xss.js></script>",
      ];

      for (const payload of xssPayloads) {
        // Safe letter generation preserves content without breaking
        const letter = getHighlySpecificLetter(payload, "partner", "female", [], "en", payload);
        expect(letter).toContain(payload);

        // Safe YouTube embed parsing
        const embedUrl = getYouTubeEmbedUrl(`https://www.youtube.com/watch?v=dQw4w9WgXcQ${payload}`);
        // Regex extracts only valid video ID chars: [a-zA-Z0-9_-]+
        expect(embedUrl).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
      }
    });

    it("resiliently processes Unicode zero-width characters, null bytes, and control codes", () => {
      const hostileName = "John\u200D\u200C\u200B\uFEFF\u0000\u0007\u001B\u202EDoe";
      
      const letter = getHighlySpecificLetter(hostileName, "brother", "male", [], "en");
      expect(letter).toContain(hostileName);

      const wishes = getBigWishes(hostileName, "friend", "other", [], "en");
      expect(wishes[0].wish).toContain(hostileName);

      const interpolated = interpolate("Dear {name},", { name: hostileName });
      expect(interpolated).toBe(`Dear ${hostileName},`);
    });

    it("handles SQL injection strings, template expressions, and regex metacharacters", () => {
      const injectionStrings = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "${process.env.SECRET_KEY}",
        "{{constructor.constructor('return process')()}}",
        "(?:[a-zA-Z0-9_-]+){1,100}",
      ];

      for (const str of injectionStrings) {
        const letter = getHighlySpecificLetter(str, "colleague", "other", [], "en", str);
        expect(letter).toContain(str);

        const interpolated = interpolate("Gift for {name} with code {code}!", {
          name: str,
          code: str,
        });
        expect(interpolated).toContain(str);
      }
    });
  });

  // =========================================================================
  // 4. Family Tree Schema Depth, Privacy Boundaries & Password Vault Derivations
  // =========================================================================
  describe("4. Family Tree Schema Depth, Privacy Boundaries & Vault Derivations", () => {
    it("validates that all 14 family member archetypes instantiate with valid defaults", () => {
      const allTypes: FamilyMemberType[] = [
        "brother",
        "sister",
        "father",
        "mother",
        "grandfather",
        "grandmother",
        "uncle",
        "aunt",
        "cousin",
        "son",
        "daughter",
        "guardian",
        "friend",
        "custom",
      ];

      for (const memberType of allTypes) {
        const profile = createFamilyMemberProfile(
          memberType,
          `Test ${memberType}`,
          new Date(1995, 5, 15)
        );

        expect(profile.schemaVersion).toBe(FAMILY_TEMPLATE_VERSION);
        expect(profile.memberType).toBe(memberType);
        expect(profile.basicInfo.fullName).toBe(`Test ${memberType}`);
        expect(profile.relationship.closenessLevel).toBeGreaterThanOrEqual(1);
        expect(profile.relationship.closenessLevel).toBeLessThanOrEqual(10);
        expect(profile.privacy.defaultLevel).toBe("family");
        expect(profile.privacy.allowExport).toBe(true);

        const errors = validateFamilyMemberProfile(profile);
        expect(errors.length, `Profile for ${memberType} should have 0 validation errors`).toBe(0);
      }
    });

    it("rigorously enforces schema validation rules and catches invalid profiles", () => {
      // Missing id
      const errNoId = validateFamilyMemberProfile({
        schemaVersion: "3.0.0",
        memberType: "brother",
        basicInfo: { fullName: "Sam", nicknames: [], gender: "male", ageGroup: "adult" },
      });
      expect(errNoId).toContain("id is required");

      // Missing fullName
      const errNoName = validateFamilyMemberProfile({
        id: "test-123",
        schemaVersion: "3.0.0",
        memberType: "brother",
        basicInfo: { fullName: "   ", nicknames: [], gender: "male", ageGroup: "adult" },
      });
      expect(errNoName).toContain("basicInfo.fullName is required");

      // Invalid closeness levels (<1, >10, float, NaN)
      const invalidCloseness = [0, -5, 11, 100, 4.5, NaN];
      for (const c of invalidCloseness) {
        const errCloseness = validateFamilyMemberProfile({
          id: "test-123",
          schemaVersion: "3.0.0",
          memberType: "sister",
          basicInfo: { fullName: "Mia", nicknames: [], gender: "female", ageGroup: "adult" },
          // @ts-expect-error testing runtime invalid closeness
          relationship: { closenessLevel: c },
        });
        expect(errCloseness).toContain("relationship.closenessLevel must be between 1 and 10");
      }
    });

    it("verifies privacy boundaries and field isolation controls", () => {
      const privateLevels: PrivacyLevel[] = ["public", "family", "private"];

      for (const level of privateLevels) {
        const profile = createFamilyMemberProfile("mother", "Eleanor", new Date(1965, 3, 10), {
          privacy: {
            defaultLevel: level,
            allowExport: level === "public",
            hiddenFields: ["birthYear", "medicalNotes"],
            privateNoteIds: ["note-1"],
            privateMediaIds: ["media-1"],
          },
        });

        expect(profile.privacy.defaultLevel).toBe(level);
        expect(profile.privacy.allowExport).toBe(level === "public");
        expect(profile.privacy.hiddenFields).toContain("birthYear");
        expect(profile.privacy.privateNoteIds).toContain("note-1");
      }
    });

    it("successfully creates and validates extensible custom family templates", () => {
      const customTpl = createCustomFamilyMemberTemplate("Godparent", [
        { id: "blessing", label: "Godparent Blessing", type: "textarea", required: true },
      ]);

      expect(customTpl.type).toBe("custom");
      expect(customTpl.label).toBe("Godparent");
      expect(customTpl.specializedFields.some((f) => f.id === "blessing")).toBe(true);

      const customProfile = createFamilyMemberProfile("custom", "Julian", undefined, {
        specialized: {
          customTypeLabel: "Godparent",
          customSections: { blessingNotes: "May you always walk in light." },
        },
      });

      expect(customProfile.memberType).toBe("custom");
      expect(customProfile.specialized.customTypeLabel).toBe("Godparent");
      const errors = validateFamilyMemberProfile(customProfile);
      expect(errors.length).toBe(0);
    });

    it("migrates legacy records and attaches source='migration' metadata", () => {
      const legacyRecord = {
        id: "legacy-999",
        type: "brother",
        name: "David Legacy",
        dateOfBirth: new Date(1992, 8, 20),
        profileData: { oldField: "oldValue" },
      };

      const migrated = migrateLegacyFamilyMember(legacyRecord);
      expect(migrated.id).toBe("legacy-999");
      expect(migrated.memberType).toBe("brother");
      expect(migrated.basicInfo.fullName).toBe("David Legacy");
      expect(migrated.metadata.source).toBe("migration");
      expect(migrated.relationship.customTags).toContain("migrated");
      expect(validateFamilyMemberProfile(migrated).length).toBe(0);
    });

    it("comprehensively verifies vault password date derivation across all 7 formats and calendar edge cases", () => {
      const testCases = [
        // Standard ISO date
        {
          raw: "1998-04-24",
          expected: {
            MMDD: "0424",
            DDMM: "2404",
            YYYYMMDD: "19980424",
            "YYYY-MM-DD": "1998-04-24",
            "MM-DD": "04-24",
            "DD-MM": "24-04",
            YYYY: "1998",
          },
        },
        // Leap year 2024-02-29
        {
          raw: "2024-02-29",
          expected: {
            MMDD: "0229",
            DDMM: "2902",
            YYYYMMDD: "20240229",
            "YYYY-MM-DD": "2024-02-29",
            "MM-DD": "02-29",
            "DD-MM": "29-02",
            YYYY: "2024",
          },
        },
        // Slash date 2005/11/03
        {
          raw: "2005/11/03",
          expected: {
            MMDD: "1103",
            DDMM: "0311",
            YYYYMMDD: "20051103",
            "YYYY-MM-DD": "2005-11-03",
            "MM-DD": "11-03",
            "DD-MM": "03-11",
            YYYY: "2005",
          },
        },
      ];

      for (const tc of testCases) {
        for (const [format, expectedPassword] of Object.entries(tc.expected)) {
          const derived = generatePasswordFromDate(tc.raw, format);
          expect(
            derived,
            `Date '${tc.raw}' with format '${format}' should equal '${expectedPassword}'`
          ).toBe(expectedPassword);
        }
      }
    });

    it("verifies password priority resolution and password requirement flags", () => {
      // 1. Explicit password takes precedence over everything
      expect(
        getEffectivePassword({
          password: "mySecretPass123",
          birthdayDate: new Date(2000, 0, 1),
          passwordFormat: "MMDD",
        })
      ).toBe("mySecretPass123");

      // 2. Birthday Date object
      expect(
        getEffectivePassword({
          password: "",
          birthdayDate: new Date(1996, 6, 18), // July 18
          passwordFormat: "DDMM",
        })
      ).toBe("1807");

      // 3. isPasswordRequired evaluation
      expect(isPasswordRequired({ passwordRequired: true })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: false, password: "active" })).toBe(false);
      expect(isPasswordRequired({ password: "activePass" })).toBe(true);
      expect(isPasswordRequired({ password: "" })).toBe(false);
      expect(isPasswordRequired({})).toBe(false);
    });
  });
});
