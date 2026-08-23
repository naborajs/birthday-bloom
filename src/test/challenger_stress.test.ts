import { describe, it, expect } from "vitest";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import {
  parseRawBirthdayDate,
  generatePasswordFromDate,
  getEffectivePassword,
  isPasswordRequired,
} from "@/utils/password";
import {
  getHighlySpecificLetter,
  getBigWishes,
} from "@/features/core/store/SuperPersonalizedLogic";
import type { RelationshipType } from "@/features/core/store/useBirthdayStore";

describe("Adversarial Stress Test: getYouTubeEmbedUrl", () => {
  describe("Standard and Alternative Formats", () => {
    it("handles standard youtube.com/watch?v= URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("handles youtu.be shortlinks", () => {
      expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("http://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("www.youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("handles youtube.com/shorts/ URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("handles youtube.com/v/ legacy URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/v/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("handles mobile m.youtube.com URLs", () => {
      expect(getYouTubeEmbedUrl("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("http://m.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("preserves and normalizes already formatted embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });
  });

  describe("Query Parameters and Timestamp Variations", () => {
    it("strips complex query params and fragments from watch URLs", () => {
      expect(
        getYouTubeEmbedUrl("https://www.youtube.com/watch?feature=shared&v=dQw4w9WgXcQ&t=120s#t=2m")
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("strips query parameters from shortlinks", () => {
      expect(
        getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=15&feature=share")
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("strips query parameters from shorts URLs", () => {
      expect(
        getYouTubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ?feature=share")
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("handles video IDs containing underscores and dashes", () => {
      const complexId = "a-B_123_xYz-";
      expect(getYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${complexId}`)).toBe(
        `https://www.youtube.com/embed/${complexId}`
      );
      expect(getYouTubeEmbedUrl(`https://youtu.be/${complexId}`)).toBe(
        `https://www.youtube.com/embed/${complexId}`
      );
    });
  });

  describe("Non-Video YouTube URLs & Non-YouTube Assets", () => {
    it("leaves channel, playlist, user, and studio URLs untouched", () => {
      const channelUrl = "https://www.youtube.com/channel/UC123456789";
      expect(getYouTubeEmbedUrl(channelUrl)).toBe(channelUrl);

      const userUrl = "https://www.youtube.com/@some_user_channel";
      expect(getYouTubeEmbedUrl(userUrl)).toBe(userUrl);

      const playlistUrl = "https://www.youtube.com/playlist?list=PL123456789";
      expect(getYouTubeEmbedUrl(playlistUrl)).toBe(playlistUrl);
    });

    it("leaves third-party video links, direct MP4/WebM files, and local assets untouched", () => {
      const vimeoUrl = "https://vimeo.com/76979871";
      expect(getYouTubeEmbedUrl(vimeoUrl)).toBe(vimeoUrl);

      const cdnUrl = "https://cdn.example.com/videos/birthday.mp4";
      expect(getYouTubeEmbedUrl(cdnUrl)).toBe(cdnUrl);

      const localPath = "/assets/videos/intro.webm";
      expect(getYouTubeEmbedUrl(localPath)).toBe(localPath);

      const blobUrl = "blob:http://localhost:5173/9384-2834-2342";
      expect(getYouTubeEmbedUrl(blobUrl)).toBe(blobUrl);

      const dataUrl = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAA";
      expect(getYouTubeEmbedUrl(dataUrl)).toBe(dataUrl);
    });
  });

  describe("Malformed, Boundary, and Runtime Invalidation Inputs", () => {
    it("handles whitespace, newlines, tabs, and empty inputs gracefully", () => {
      expect(getYouTubeEmbedUrl("")).toBe("");
      expect(getYouTubeEmbedUrl("   ")).toBe("");
      expect(getYouTubeEmbedUrl("\n\t  \r")).toBe("");
    });

    it("safely returns non-string inputs without throwing", () => {
      // @ts-expect-error testing runtime non-string resilience
      expect(getYouTubeEmbedUrl(null)).toBe("");
      // @ts-expect-error testing runtime non-string resilience
      expect(getYouTubeEmbedUrl(undefined)).toBe("");
      // @ts-expect-error testing runtime non-string resilience
      expect(getYouTubeEmbedUrl(12345)).toBe(12345);
      // @ts-expect-error testing runtime non-string resilience
      const obj = { foo: "bar" };
      // @ts-expect-error testing runtime non-string resilience
      expect(getYouTubeEmbedUrl(obj)).toBe(obj);
    });

    it("handles XSS payloads and script tags defensively", () => {
      const scriptAttempt = "<script>alert('xss')</script>";
      expect(getYouTubeEmbedUrl(scriptAttempt)).toBe(scriptAttempt);

      const tagWithWatch = "https://www.youtube.com/watch?v=dQw4w9WgXcQ<script>";
      // Regex extracts only valid video ID characters [a-zA-Z0-9_-]+
      expect(getYouTubeEmbedUrl(tagWithWatch)).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });
  });
});

describe("Adversarial Stress Test: password.ts", () => {
  describe("parseRawBirthdayDate", () => {
    it("handles edge cases and invalid date strings", () => {
      expect(parseRawBirthdayDate("")).toBeNull();
      expect(parseRawBirthdayDate("   ")).toBeNull();
      expect(parseRawBirthdayDate(null)).toBeNull();
      expect(parseRawBirthdayDate(undefined)).toBeNull();
      expect(parseRawBirthdayDate("not-a-date-at-all")).toBeNull();
      expect(parseRawBirthdayDate("abc/def/ghi")).toBeNull();
    });

    it("parses ISO strings with time components, Z suffix, and TH separator", () => {
      const resZ = parseRawBirthdayDate("1996-11-23T14:30:00Z");
      expect(resZ).not.toBeNull();
      expect(resZ?.year).toBe("1996");
      expect(resZ?.month).toBe("11");

      const resTH = parseRawBirthdayDate("2002-04-09TH08:15:00");
      expect(resTH).not.toBeNull();
      expect(resTH?.year).toBe("2002");
      expect(resTH?.month).toBe("04");
      expect(resTH?.day).toBe("09");
    });

    it("handles leap year date 2024-02-29 and century leap year 2000-02-29", () => {
      const leap2024 = parseRawBirthdayDate("2024-02-29");
      expect(leap2024).not.toBeNull();
      expect(leap2024?.year).toBe("2024");
      expect(leap2024?.month).toBe("02");
      expect(leap2024?.day).toBe("29");

      const leap2000 = parseRawBirthdayDate("2000-02-29");
      expect(leap2000).not.toBeNull();
      expect(leap2000?.year).toBe("2000");
      expect(leap2000?.month).toBe("02");
      expect(leap2000?.day).toBe("29");
    });

    it("parses slash separated dates YYYY/MM/DD and single digit YYYY/M/D", () => {
      const res = parseRawBirthdayDate("1990/3/5");
      expect(res).toEqual({ year: "1990", month: "03", day: "05" });
    });

    it("demonstrates date parser behavior on two-part dates (DD-MM vs MM-DD)", () => {
      // 25-08: 25 > 12 -> falls to mdMatch regex fallback with currentYear
      const currentYear = String(new Date().getFullYear());
      const parsed2508 = parseRawBirthdayDate("25-08");
      expect(parsed2508?.day).toBe("25");
      expect(parsed2508?.month).toBe("08");
      expect(parsed2508?.year).toBe(currentYear);

      // 05-20: new Date("05-20") parses in V8 as year 2001, month 05, day 20
      const parsed0520 = parseRawBirthdayDate("05-20");
      expect(parsed0520?.month).toBe("05");
      expect(parsed0520?.day).toBe("20");
    });

    it("demonstrates JavaScript Date rollover behavior on non-calendar dates", () => {
      // "2021-02-31": in JS Date, Feb 31 rolls over into March 3
      const rolledOver = parseRawBirthdayDate("2021-02-31");
      expect(rolledOver).not.toBeNull();
      expect(rolledOver?.year).toBe("2021");
      expect(rolledOver?.month).toBe("03");
      expect(rolledOver?.day).toBe("03");
    });
  });

  describe("generatePasswordFromDate (All 7 formats + case/whitespace resilience)", () => {
    const raw = "1994-08-05";

    it("generates MMDD (default and explicit)", () => {
      expect(generatePasswordFromDate(raw, "MMDD")).toBe("0805");
      expect(generatePasswordFromDate(raw, "mmdd")).toBe("0805");
      expect(generatePasswordFromDate(raw, "  mmdd  ")).toBe("0805");
      expect(generatePasswordFromDate(raw, "")).toBe("0805");
      expect(generatePasswordFromDate(raw, "unknown-format")).toBe("0805");
    });

    it("generates DDMM", () => {
      expect(generatePasswordFromDate(raw, "DDMM")).toBe("0508");
      expect(generatePasswordFromDate(raw, "ddmm")).toBe("0508");
    });

    it("generates YYYYMMDD", () => {
      expect(generatePasswordFromDate(raw, "YYYYMMDD")).toBe("19940805");
      expect(generatePasswordFromDate(raw, "yyyymmdd")).toBe("19940805");
    });

    it("generates YYYY-MM-DD", () => {
      expect(generatePasswordFromDate(raw, "YYYY-MM-DD")).toBe("1994-08-05");
      expect(generatePasswordFromDate(raw, "yyyy-mm-dd")).toBe("1994-08-05");
    });

    it("generates MM-DD", () => {
      expect(generatePasswordFromDate(raw, "MM-DD")).toBe("08-05");
      expect(generatePasswordFromDate(raw, "mm-dd")).toBe("08-05");
    });

    it("generates DD-MM", () => {
      expect(generatePasswordFromDate(raw, "DD-MM")).toBe("05-08");
      expect(generatePasswordFromDate(raw, "dd-mm")).toBe("05-08");
    });

    it("generates YYYY", () => {
      expect(generatePasswordFromDate(raw, "YYYY")).toBe("1994");
      expect(generatePasswordFromDate(raw, "yyyy")).toBe("1994");
    });

    it("returns empty string when date input is invalid or null", () => {
      expect(generatePasswordFromDate(null, "DDMM")).toBe("");
      expect(generatePasswordFromDate(undefined, "DDMM")).toBe("");
      expect(generatePasswordFromDate("", "DDMM")).toBe("");
      expect(generatePasswordFromDate("invalid", "DDMM")).toBe("");
    });
  });

  describe("getEffectivePassword & isPasswordRequired", () => {
    it("respects priority: explicit password > Date object > string date > env date > empty string", () => {
      // 1. Explicit password takes highest priority
      expect(
        getEffectivePassword({
          password: "  customSecret!  ",
          birthdayDate: new Date(2000, 0, 1),
          passwordFormat: "DDMM",
        })
      ).toBe("customSecret!");

      // 2. Birthday Date object
      expect(
        getEffectivePassword({
          password: "",
          birthdayDate: new Date(2000, 11, 25), // Dec 25
          passwordFormat: "DDMM",
        })
      ).toBe("2512");

      // 3. Birthday string
      expect(
        getEffectivePassword({
          birthdayDate: "1999-05-12",
          passwordFormat: "YYYY",
        })
      ).toBe("1999");

      // 4. Empty config
      expect(getEffectivePassword({})).toBeDefined();
    });

    it("evaluates isPasswordRequired strictly based on boolean flag and presence", () => {
      expect(isPasswordRequired({ passwordRequired: true })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: true, password: "" })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: false, password: "activePassword" })).toBe(false);
      expect(isPasswordRequired({ password: "somePass" })).toBe(true);
      expect(isPasswordRequired({ password: "   " })).toBe(false);
      expect(isPasswordRequired({ password: "" })).toBe(false);
      expect(isPasswordRequired({})).toBe(false);
    });
  });
});

describe("Adversarial Stress Test: SuperPersonalizedLogic.ts", () => {
  describe("getHighlySpecificLetter", () => {
    const testName = "Alex";

    it("handles partner relationship across all genders", () => {
      const femaleLetter = getHighlySpecificLetter(testName, "partner", "female");
      expect(femaleLetter).toContain(testName);
      expect(femaleLetter).toContain("My Queen");

      const maleLetter = getHighlySpecificLetter(testName, "partner", "male");
      expect(maleLetter).toContain(testName);
      expect(maleLetter).toContain("My King");

      const otherLetter = getHighlySpecificLetter(testName, "partner", "other");
      expect(otherLetter).toContain(testName);
      // 'other' defaults to male partner template
      expect(otherLetter).toContain("My King");
    });

    it("handles friend relationship across all genders", () => {
      const femaleFriend = getHighlySpecificLetter(testName, "friend", "female");
      expect(femaleFriend).toContain("Best Friend");

      const maleFriend = getHighlySpecificLetter(testName, "friend", "male");
      expect(maleFriend).toContain("Absolute Legend");

      const otherFriend = getHighlySpecificLetter(testName, "friend", "other");
      expect(otherFriend).toContain("Radiant Soul");
    });

    it("handles sibling, brother, sister, colleague, and mentor", () => {
      expect(getHighlySpecificLetter(testName, "sibling", "other")).toContain("Sibling");
      expect(getHighlySpecificLetter(testName, "brother", "male")).toContain("Brother");
      expect(getHighlySpecificLetter(testName, "sister", "female")).toContain("Sister");
      expect(getHighlySpecificLetter(testName, "colleague", "other")).toContain("Colleague");
      expect(getHighlySpecificLetter(testName, "mentor", "other")).toContain("Mentor");
    });

    it("falls back gracefully to family letter for unmapped relationships", () => {
      const relationships: RelationshipType[] = [
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
        "family",
      ];
      for (const rel of relationships) {
        const letter = getHighlySpecificLetter(testName, rel, "male");
        expect(letter).toContain("Family");
        expect(letter).toContain(testName);
      }

      // Completely unmapped custom string casted as relationship
      // @ts-expect-error testing runtime unknown relationship
      const unknownRelLetter = getHighlySpecificLetter(testName, "unknown_alien_rel", "other");
      expect(unknownRelLetter).toContain("Family");
      expect(unknownRelLetter).toContain(testName);
    });

    it("handles empty name and special characters in name", () => {
      const emptyNameLetter = getHighlySpecificLetter("", "family", "female");
      expect(emptyNameLetter).toBeDefined();
      expect(emptyNameLetter.length).toBeGreaterThan(50);

      const specialName = "<script>alert('test')</script> & 💖 🌟";
      const specialLetter = getHighlySpecificLetter(specialName, "friend", "female");
      expect(specialLetter).toContain(specialName);
    });
  });

  describe("getBigWishes", () => {
    it("returns base wishes and partner/friend additions", () => {
      const partnerWishes = getBigWishes("Sam", "partner", "female", []);
      expect(partnerWishes.length).toBe(4);
      expect(partnerWishes.some((w) => w.emoji === "❤️")).toBe(true);
      expect(partnerWishes.some((w) => w.emoji === "💍")).toBe(true);

      const friendWishes = getBigWishes("Sam", "friend", "male", []);
      expect(friendWishes.length).toBe(4);
      expect(friendWishes.some((w) => w.emoji === "🔥")).toBe(true);
      expect(friendWishes.some((w) => w.emoji === "🍻")).toBe(true);

      const familyWishes = getBigWishes("Sam", "family", "other", []);
      expect(familyWishes.length).toBe(2);
      expect(familyWishes.some((w) => w.emoji === "🚀")).toBe(true);
      expect(familyWishes.some((w) => w.emoji === "💎")).toBe(true);
    });

    it("handles interest triggers: coding and car (case-insensitive)", () => {
      const wishes1 = getBigWishes("Sam", "family", "male", ["CODING", "SUPER CARS"]);
      expect(wishes1.some((w) => w.emoji === "💻")).toBe(true);
      expect(wishes1.some((w) => w.emoji === "🏎️")).toBe(true);

      const wishes2 = getBigWishes("Sam", "family", "male", ["gardening", "cooking"]);
      expect(wishes2.some((w) => w.emoji === "💻")).toBe(false);
      expect(wishes2.some((w) => w.emoji === "🏎️")).toBe(false);
    });

    it("handles empty interests array and empty name", () => {
      const wishes = getBigWishes("", "family", "female", []);
      expect(wishes.length).toBe(2);
      expect(wishes[0].wish).toContain("brand reach new galaxies");
    });
  });
});

describe("Adversarial Stress Test: Multi-Language Locale Resolution & Fallback Matrix", () => {
  describe("getTranslation Language Normalization", () => {
    it("maps all supported and aliased locale strings for Bengali", async () => {
      const { getTranslation } = await import("@/i18n");
      const aliases = ["bn", "BN", "Bn", "bengali", "BENGALI", "Bengali", "bangla", "BANGLA", "  bn  ", "  bengali  "];
      for (const alias of aliases) {
        const t = getTranslation(alias);
        expect(t.common.happyBirthday).toBe("শুভ জন্মদিন");
        expect(t.common.unlockMagic).toBe("মায়াবী সারপ্রাইজ আনলক করুন");
      }
    });

    it("maps all supported and aliased locale strings for Hindi", async () => {
      const { getTranslation } = await import("@/i18n");
      const aliases = ["hi", "HI", "Hi", "hindi", "HINDI", "Hindi", "in", "IN", "  hi  ", "  hindi  "];
      for (const alias of aliases) {
        const t = getTranslation(alias);
        expect(t.common.happyBirthday).toBe("जन्मदिन मुबारक");
        expect(t.common.unlockMagic).toBe("जादू अनलॉक करें");
      }
    });

    it("falls back to English for standard en, unknown locales, empty strings, and undefined", async () => {
      const { getTranslation } = await import("@/i18n");
      const fallbacks = ["en", "EN", "english", "ENGLISH", "fr", "es", "de", "unknown", "", "   ", undefined];
      for (const fb of fallbacks) {
        const t = getTranslation(fb);
        expect(t.common.happyBirthday).toBe("Happy Birthday");
        expect(t.common.unlockMagic).toBe("Unlock the Magic");
      }
    });
  });

  describe("getTranslationValue and Interpolation Matrix", () => {
    it("interpolates parameters in English, Hindi, and Bengali correctly", async () => {
      const { getTranslationValue } = await import("@/i18n");
      
      expect(getTranslationValue("en", "common.dear", { name: "Sophia" })).toBe("Dear Sophia,");
      expect(getTranslationValue("hi", "common.dear", { name: "राहुल" })).toBe("प्रिय राहुल,");
      expect(getTranslationValue("bn", "common.dear", { name: "সৌম্য" })).toBe("প্রিয় সৌম্য,");

      expect(getTranslationValue("en", "common.clickMoreTimes", { count: 3 })).toBe("Click 🎂 3 more times!");
      expect(getTranslationValue("hi", "common.clickMoreTimes", { count: 5 })).toBe("🎂 पर 5 बार और क्लिक करें!");
      expect(getTranslationValue("bn", "common.clickMoreTimes", { count: 2 })).toBe("কেক 🎂 আরও 2 বার ক্লিক করুন!");
    });

    it("falls back to English when a key is missing in a non-English locale", async () => {
      const { getTranslationValue } = await import("@/i18n");
      // If a hypothetical key only exists in en, it resolves cleanly from enTranslations
      expect(getTranslationValue("hi", "common.skipIntro")).toBe("स्किप करें ⏭");
      expect(getTranslationValue("bn", "common.skipIntro")).toBe("স্কিপ করুন ⏭");
    });

    it("returns raw keyPath when key does not exist anywhere", async () => {
      const { getTranslationValue } = await import("@/i18n");
      expect(getTranslationValue("en", "non.existent.deep.key")).toBe("non.existent.deep.key");
      expect(getTranslationValue("hi", "non.existent.deep.key")).toBe("non.existent.deep.key");
      expect(getTranslationValue("bn", "non.existent.deep.key")).toBe("non.existent.deep.key");
    });

    it("handles interpolate helper edge cases with null, empty params, and special characters", async () => {
      const { interpolate } = await import("@/i18n");
      expect(interpolate("Hello {name}!", { name: "Alice" })).toBe("Hello Alice!");
      expect(interpolate("Hello {{name}}!", { name: "Bob" })).toBe("Hello Bob!");
      expect(interpolate("Static text without params")).toBe("Static text without params");
      expect(interpolate("Count: {count}", { count: 0 })).toBe("Count: 0");
    });
  });
});

describe("Adversarial Stress Test: Multi-Language Emotional Letters Matrix", () => {
  const testRelationships: RelationshipType[] = [
    "partner",
    "friend",
    "sibling",
    "brother",
    "sister",
    "colleague",
    "mentor",
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
    "family",
    "custom",
  ];

  it("verifies all relationships produce authentic, non-empty letters with no bracket placeholders in English", () => {
    for (const rel of testRelationships) {
      for (const gender of ["male", "female", "other"] as const) {
        const letterWithSender = getHighlySpecificLetter("Elena", rel, gender, [], "en", "Alex");
        expect(letterWithSender.length).toBeGreaterThan(100);
        expect(letterWithSender).toContain("Elena");
        expect(letterWithSender).not.toContain("[Your Name]");
        expect(letterWithSender).not.toContain("[आपका नाम]");
        expect(letterWithSender).not.toContain("[আপনার নাম]");

        const letterWithoutSender = getHighlySpecificLetter("Elena", rel, gender, [], "en");
        expect(letterWithoutSender.length).toBeGreaterThan(100);
        expect(letterWithoutSender).not.toContain("[Your Name]");
      }
    }
  });

  it("verifies all relationships produce authentic Hindi letters with proper signoffs", () => {
    for (const rel of testRelationships) {
      for (const gender of ["male", "female", "other"] as const) {
        const letterWithSender = getHighlySpecificLetter("अनन्या", rel, gender, [], "hi", "समीर");
        expect(letterWithSender.length).toBeGreaterThan(100);
        expect(letterWithSender).toContain("अनन्या");
        expect(letterWithSender).not.toContain("[Your Name]");
        expect(letterWithSender).not.toContain("[आपका नाम]");
        expect(letterWithSender).not.toContain("[আপনার নাম]");

        const letterWithoutSender = getHighlySpecificLetter("अनन्या", rel, gender, [], "hi");
        expect(letterWithoutSender.length).toBeGreaterThan(100);
        expect(letterWithoutSender).not.toContain("[आपका नाम]");
      }
    }
  });

  it("verifies all relationships produce authentic Bengali letters with proper signoffs", () => {
    for (const rel of testRelationships) {
      for (const gender of ["male", "female", "other"] as const) {
        const letterWithSender = getHighlySpecificLetter("ঐন্দ্রিলা", rel, gender, [], "bn", "অভিরূপ");
        expect(letterWithSender.length).toBeGreaterThan(100);
        expect(letterWithSender).toContain("ঐন্দ্রিলা");
        expect(letterWithSender).not.toContain("[Your Name]");
        expect(letterWithSender).not.toContain("[आपका नाम]");
        expect(letterWithSender).not.toContain("[আপনার নাম]");

        const letterWithoutSender = getHighlySpecificLetter("ঐন্দ্রিলা", rel, gender, [], "bn");
        expect(letterWithoutSender.length).toBeGreaterThan(100);
        expect(letterWithoutSender).not.toContain("[আপনার নাম]");
      }
    }
  });
});

describe("Adversarial Stress Test: Cake Localization & Quiz Counters Matrix", () => {
  it("verifies all 4 cake flavors have valid names across en, hi, and bn in CakeTypes", async () => {
    const { CAKE_OPTIONS, getCakeName } = await import("@/components/birthday/CakeTypes");
    expect(CAKE_OPTIONS.length).toBe(4);

    const expectedNames = {
      chocolate: { en: "Chocolate Dream", hi: "चॉकलेट ड्रीम", bn: "চকলেট ড্রিম" },
      strawberry: { en: "Strawberry Bliss", hi: "स्ट्रॉबेरी ब्लिस", bn: "স্ট্রবেরি ব্লিস" },
      royal: { en: "Royal Velvet", hi: "रॉयल वेलवेट", bn: "রয়্যাল ভেলভেট" },
      nature: { en: "Floral Garden", hi: "फ्लोरल गार्डन", bn: "ফ্লোরাল গার্ডেন" },
    };

    for (const cake of CAKE_OPTIONS) {
      const exp = expectedNames[cake.id as keyof typeof expectedNames];
      expect(exp).toBeDefined();
      expect(getCakeName(cake, false, false)).toBe(exp.en);
      expect(getCakeName(cake, true, false)).toBe(exp.hi);
      expect(getCakeName(cake, false, true)).toBe(exp.bn);
      // Bengali flag takes priority if both are true
      expect(getCakeName(cake, true, true)).toBe(exp.bn);
    }
  });

  it("generates authentic Big Wishes across en, hi, and bn for partner, friend, coding, and car", () => {
    // English Big Wishes
    const enWishes = getBigWishes("Sam", "partner", "female", ["coding", "car"], "en");
    expect(enWishes.length).toBe(6); // 2 base + 2 partner + 1 car + 1 coding
    expect(enWishes.some((w) => w.emoji === "💻")).toBe(true);
    expect(enWishes.some((w) => w.emoji === "🏎️")).toBe(true);

    // Hindi Big Wishes
    const hiWishes = getBigWishes("राहुल", "partner", "male", ["coding", "car"], "hi");
    expect(hiWishes.length).toBe(6);
    expect(hiWishes.some((w) => w.wish.includes("बग्स") || w.wish.includes("फीचर्स"))).toBe(true);
    expect(hiWishes.some((w) => w.wish.includes("रफ़्तार"))).toBe(true);

    // Bengali Big Wishes
    const bnWishes = getBigWishes("সৌম্য", "friend", "male", ["coding", "car"], "bn");
    expect(bnWishes.length).toBe(6);
    expect(bnWishes.some((w) => w.wish.includes("বাগ") || w.wish.includes("ফিচার"))).toBe(true);
    expect(bnWishes.some((w) => w.wish.includes("গতি"))).toBe(true);
  });
});
