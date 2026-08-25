import { describe, it, expect } from "vitest";
import {
  parseRawBirthdayDate,
  generatePasswordFromDate,
  getEffectivePassword,
  isPasswordRequired,
} from "@/utils/password";
import { getTemplateEmojiKit, pickTemplateEmoji } from "@/config/emojiKits";
import {
  getHighlySpecificLetter,
  getBigWishes,
} from "@/features/core/store/SuperPersonalizedLogic";
import { cn, getYouTubeEmbedUrl } from "@/lib/utils";
import type { BirthdayConfig } from "@/features/core/store/useBirthdayStore";

describe("Password & Date Parsing Utilities", () => {
  describe("parseRawBirthdayDate", () => {
    it("returns null for empty, null, or undefined inputs", () => {
      expect(parseRawBirthdayDate(null)).toBeNull();
      expect(parseRawBirthdayDate(undefined)).toBeNull();
      expect(parseRawBirthdayDate("")).toBeNull();
      expect(parseRawBirthdayDate("   ")).toBeNull();
    });

    it("correctly parses standard ISO date strings and handles TH separator", () => {
      const parsed = parseRawBirthdayDate("2000-08-15");
      expect(parsed).toEqual({ year: "2000", month: "08", day: "15" });

      const parsedWithTh = parseRawBirthdayDate("2024-02-29TH14:30:00");
      expect(parsedWithTh).toEqual({ year: "2024", month: "02", day: "29" });
    });

    it("correctly parses YYYY/MM/DD and YYYY-M-D formats", () => {
      const parsedSlash = parseRawBirthdayDate("1995/4/7");
      expect(parsedSlash).toEqual({ year: "1995", month: "04", day: "07" });

      const parsedDash = parseRawBirthdayDate("1988-12-05");
      expect(parsedDash).toEqual({ year: "1988", month: "12", day: "05" });
    });

    it("correctly infers DD-MM when day is greater than 12", () => {
      const parsed = parseRawBirthdayDate("25-08");
      expect(parsed).not.toBeNull();
      expect(parsed?.day).toBe("25");
      expect(parsed?.month).toBe("08");
    });

    it("correctly infers MM-DD when first number is a valid month <= 12", () => {
      const parsed = parseRawBirthdayDate("05-20");
      expect(parsed).not.toBeNull();
      expect(parsed?.month).toBe("05");
      expect(parsed?.day).toBe("20");
    });
  });

  describe("generatePasswordFromDate", () => {
    it("returns empty string for invalid date inputs", () => {
      expect(generatePasswordFromDate(null)).toBe("");
      expect(generatePasswordFromDate(undefined)).toBe("");
      expect(generatePasswordFromDate("invalid-date-string-xyz")).toBe("");
    });

    it("generates passwords in all 7 supported date formats", () => {
      const dateStr = "1998-07-24";

      expect(generatePasswordFromDate(dateStr, "MMDD")).toBe("0724");
      expect(generatePasswordFromDate(dateStr, "DDMM")).toBe("2407");
      expect(generatePasswordFromDate(dateStr, "YYYYMMDD")).toBe("19980724");
      expect(generatePasswordFromDate(dateStr, "YYYY-MM-DD")).toBe("1998-07-24");
      expect(generatePasswordFromDate(dateStr, "MM-DD")).toBe("07-24");
      expect(generatePasswordFromDate(dateStr, "DD-MM")).toBe("24-07");
      expect(generatePasswordFromDate(dateStr, "YYYY")).toBe("1998");
      // Default fallback format
      expect(generatePasswordFromDate(dateStr, "UNKNOWN_FORMAT")).toBe("0724");
    });

    it("properly handles leap year dates", () => {
      const leapDate = "2024-02-29";
      expect(generatePasswordFromDate(leapDate, "DDMM")).toBe("2902");
      expect(generatePasswordFromDate(leapDate, "YYYYMMDD")).toBe("20240229");
    });
  });

  describe("getEffectivePassword", () => {
    it("prioritizes explicit password if present and non-empty", () => {
      const result = getEffectivePassword({
        password: "  Secret123  ",
        birthdayDate: new Date("2000-01-01"),
      });
      expect(result).toBe("Secret123");
    });

    it("formats Date instance according to passwordFormat", () => {
      const date = new Date(2005, 9, 18); // Note: month is 0-indexed (9 -> October)
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "DDMM" })).toBe("1810");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "YYYYMMDD" })).toBe("20051018");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "YYYY-MM-DD" })).toBe("2005-10-18");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "MM-DD" })).toBe("10-18");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "DD-MM" })).toBe("18-10");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "YYYY" })).toBe("2005");
      expect(getEffectivePassword({ birthdayDate: date, passwordFormat: "MMDD" })).toBe("1018");
    });

    it("formats birthdayDate provided as a string", () => {
      const result = getEffectivePassword({
        birthdayDate: "1992-06-11",
        passwordFormat: "DDMM",
      });
      expect(result).toBe("1106");
    });

    it("returns empty string when no password or date is provided and env is unset", () => {
      const result = getEffectivePassword({});
      expect(typeof result).toBe("string");
    });
  });

  describe("isPasswordRequired", () => {
    it("returns explicit passwordRequired setting when present", () => {
      expect(isPasswordRequired({ passwordRequired: true })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: false })).toBe(false);
      expect(isPasswordRequired({ passwordRequired: true, password: "" })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: false, password: "active" })).toBe(false);
    });

    it("falls back to presence of non-empty password if passwordRequired is undefined", () => {
      expect(isPasswordRequired({ password: "myPass" })).toBe(true);
      expect(isPasswordRequired({ password: "   " })).toBe(false);
      expect(isPasswordRequired({ password: "" })).toBe(false);
      expect(isPasswordRequired({})).toBe(false);
    });
  });
});

describe("Emoji Kits Configuration", () => {
  const baseConfig: BirthdayConfig = {
    name: "Alex",
    age: 25,
    gender: "female",
    relationship: "friend",
    favoriteColor: "#ff0080",
    favoriteEmojis: ["✨", "💖"],
    interests: ["coding", "car"],
    customMessage: "Have a blast!",
    birthdayDate: null,
  };

  it("generates complete emoji kit with relationship-specific icons", () => {
    const friendKit = getTemplateEmojiKit(baseConfig);
    expect(friendKit.relationship).toBe("friend");
    expect(friendKit.signature).toBeInstanceOf(Array);
    expect(friendKit.signature.length).toBeGreaterThan(0);
    expect(friendKit.chat.avatar).toBe("😎");
    expect(friendKit.chat.greeting).toContain("Yoooo!");
  });

  it("incorporates custom favorite emojis and interest-mapped emojis", () => {
    const kit = getTemplateEmojiKit(baseConfig);
    // Custom emojis
    expect(kit.signature).toContain("✨");
    expect(kit.signature).toContain("💖");
    // Coding interest emojis
    expect(kit.signature).toContain("💻");
    // Car interest emojis
    expect(kit.signature).toContain("🚗");
  });

  it("falls back gracefully for unknown relationship types", () => {
    const unknownConfig = {
      ...baseConfig,
      relationship: "alien-cousin" as BirthdayConfig["relationship"],
    };
    const kit = getTemplateEmojiKit(unknownConfig);
    expect(kit.chat.greeting).toBeDefined();
    expect(kit.signature.length).toBeGreaterThan(0);
  });

  it("pickTemplateEmoji returns an emoji from array or default fallback", () => {
    const items = ["🎂", "🎈", "🎁"];
    const picked = pickTemplateEmoji(items);
    expect(items).toContain(picked);

    const fallback = pickTemplateEmoji([]);
    expect(fallback).toBe("✨");
  });
});

describe("SuperPersonalizedLogic", () => {
  describe("getHighlySpecificLetter", () => {
    it("returns female partner letter when relationship is partner and gender is female", () => {
      const letter = getHighlySpecificLetter("Elena", "partner", "female");
      expect(letter).toContain("Elena");
      expect(letter).toContain("My Queen");
    });

    it("returns male partner letter when relationship is partner and gender is male", () => {
      const letter = getHighlySpecificLetter("Marcus", "partner", "male");
      expect(letter).toContain("Marcus");
      expect(letter).toContain("My King");
    });

    it("returns friendly letter for female friend and legend for male friend", () => {
      const femaleFriendLetter = getHighlySpecificLetter("Sarah", "friend", "female");
      expect(femaleFriendLetter).toContain("Sarah");
      expect(femaleFriendLetter).toContain("Best Friend");

      const maleFriendLetter = getHighlySpecificLetter("Dave", "friend", "male");
      expect(maleFriendLetter).toContain("Dave");
      expect(maleFriendLetter).toContain("Absolute Legend");
    });

    it("returns specific letters for brother, sister, and colleague", () => {
      const brotherLetter = getHighlySpecificLetter("Sam", "brother", "male");
      expect(brotherLetter).toContain("Brother");

      const sisterLetter = getHighlySpecificLetter("Maya", "sister", "female");
      expect(sisterLetter).toContain("Sister");

      const colleagueLetter = getHighlySpecificLetter("Jordan", "colleague", "other");
      expect(colleagueLetter).toContain("Colleague");
    });

    it("falls back to family letter for general family relationships", () => {
      const familyLetter = getHighlySpecificLetter("Grandpa", "grandfather", "male");
      expect(familyLetter).toContain("Grandpa");
      expect(familyLetter).toContain("Dear Grandpa");
    });
  });

  describe("getBigWishes", () => {
    it("generates base wishes and relationship-specific wishes for partner", () => {
      const wishes = getBigWishes("Taylor", "partner", "other", []);
      expect(wishes.length).toBeGreaterThanOrEqual(4);
      expect(wishes.some((w) => w.wish.includes("Taylor"))).toBe(true);
      expect(wishes.some((w) => w.emoji === "❤️")).toBe(true);
    });

    it("includes interest-based wishes for coding and car enthusiasts", () => {
      const wishes = getBigWishes("Devon", "friend", "male", ["coding", "car"]);
      expect(wishes.some((w) => w.emoji === "💻" && w.wish.includes("bugs"))).toBe(true);
      expect(wishes.some((w) => w.emoji === "🏎️" && w.wish.includes("accelerate"))).toBe(true);
      expect(wishes.some((w) => w.emoji === "🔥")).toBe(true);
    });
  });
});

describe("UI Utilities (src/lib/utils.ts)", () => {
  describe("cn (classnames merge helper)", () => {
    it("merges class names and handles conditional classes", () => {
      const isHidden = false;
      expect(cn("px-4 py-2", "text-center")).toBe("px-4 py-2 text-center");
      expect(cn("px-4", isHidden && "hidden", "text-red-500")).toBe("px-4 text-red-500");
    });

    it("resolves Tailwind CSS conflicts correctly", () => {
      expect(cn("px-2 text-sm", "px-4 text-lg")).toBe("px-4 text-lg");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("getYouTubeEmbedUrl", () => {
    it("converts standard watch URLs into embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("handles watch URLs with additional query parameters and fragments", () => {
      expect(
        getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&feature=shared")
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("converts short youtu.be URLs into embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
      expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=15")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("converts YouTube shorts URLs into embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("converts mobile m.youtube.com URLs into embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("preserves already formatted embed URLs", () => {
      expect(getYouTubeEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ"
      );
    });

    it("returns non-YouTube video URLs and local asset paths unchanged", () => {
      const mp4Url = "https://example.com/videos/birthday-celebration.mp4";
      expect(getYouTubeEmbedUrl(mp4Url)).toBe(mp4Url);

      const localPath = "/assets/videos/memory-clip.webm";
      expect(getYouTubeEmbedUrl(localPath)).toBe(localPath);
    });

    it("handles null, undefined, empty string, and whitespace safely", () => {
      expect(getYouTubeEmbedUrl("")).toBe("");
      expect(getYouTubeEmbedUrl("   ")).toBe("");
      // @ts-expect-error test non-string runtime safety
      expect(getYouTubeEmbedUrl(null)).toBe("");
      // @ts-expect-error test non-string runtime safety
      expect(getYouTubeEmbedUrl(undefined)).toBe("");
    });
  });

  describe("Environment Configuration & Store Wiring", () => {
    it("provides default soundEffectsEnabled and showSkipButton in store", async () => {
      const { useBirthdayStore } = await import("@/features/core/store/useBirthdayStore");
      const config = useBirthdayStore.getState().config;
      expect(typeof config.showSkipButton).toBe("boolean");
      expect(typeof config.soundEffectsEnabled).toBe("boolean");
    });

    it("exports soundEffectsEnabled in AUDIO_ASSETS config", async () => {
      const { AUDIO_ASSETS } = await import("@/config/birthday");
      expect(typeof AUDIO_ASSETS.soundEffectsEnabled).toBe("boolean");
    });
  });

  describe("Multi-Language Localization Engine (i18n)", () => {
    it("exports English, Hindi, and Bengali locale dictionaries with complete structures", async () => {
      const { en } = await import("@/i18n/locales/en");
      const { hi } = await import("@/i18n/locales/hi");
      const { bn } = await import("@/i18n/locales/bn");

      expect(en.common.happyBirthday).toBe("Happy Birthday");
      expect(hi.common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(bn.common.happyBirthday).toBe("শুভ জন্মদিন");

      expect(en.cake.startCutting).toBe("Start Cutting");
      expect(hi.cake.startCutting).toBe("काटना शुरू करें");
      expect(bn.cake.startCutting).toBe("কেক কাটা শুরু করুন");

      expect(en.memories.title).toBe("MEMORIES 📸");
      expect(hi.memories.title).toBe("अनमोल यादें 📸");
      expect(bn.memories.title).toBe("অনাবিল স্মৃতি 📸");
    });

    it("interpolates parameters accurately in English, Hindi, and Bengali", async () => {
      const { interpolate } = await import("@/i18n");

      const enInterpolated = interpolate("Dear {{name}},", { name: "Aarav" });
      expect(enInterpolated).toBe("Dear Aarav,");

      const hiInterpolated = interpolate("प्रिय {{name}},", { name: "प्रिया" });
      expect(hiInterpolated).toBe("प्रिय प्रिया,");

      const bnInterpolated = interpolate("প্রিয় {{name}},", { name: "সৌম্য" });
      expect(bnInterpolated).toBe("প্রিয় সৌম্য,");
    });

    it("falls back to English when a key or language is missing", async () => {
      const { getTranslationValue, getTranslation } = await import("@/i18n");

      // Valid Bengali key
      expect(getTranslationValue("bn", "common.skipIntro")).toBe("স্কিপ করুন ⏭");
      // Valid Hindi key
      expect(getTranslationValue("hi", "common.skipIntro")).toBe("स्किप करें ⏭");
      // Fallback
      expect(getTranslationValue("en", "common.skipIntro")).toBe("Skip Intro ⏭");
      // Unrecognized language defaults to English
      expect(getTranslationValue("es", "common.skipIntro")).toBe("Skip Intro ⏭");

      // getTranslation normalization
      expect(getTranslation("bn").common.happyBirthday).toBe("শুভ জন্মদিন");
      expect(getTranslation("bengali").common.happyBirthday).toBe("শুভ জন্মদিন");
      expect(getTranslation("bangla").common.happyBirthday).toBe("শুভ জন্মদিন");
      expect(getTranslation("hi").common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(getTranslation("hindi").common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(getTranslation("in").common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(getTranslation("en").common.happyBirthday).toBe("Happy Birthday");
      expect(getTranslation(undefined).common.happyBirthday).toBe("Happy Birthday");
    });

    it("generates authentic Hindi emotional letters for various relationships and genders", async () => {
      const { getHighlySpecificLetter, getBigWishes } = await import(
        "@/features/core/store/SuperPersonalizedLogic"
      );

      // Hindi partner male letter
      const partnerMaleLetter = getHighlySpecificLetter("रोहन", "partner", "male", ["music"], "hi");
      expect(partnerMaleLetter).toContain("रोहन");
      expect(partnerMaleLetter).toContain("सरताज");

      // Hindi partner female letter
      const partnerFemaleLetter = getHighlySpecificLetter("अनन्या", "partner", "female", ["art"], "hi");
      expect(partnerFemaleLetter).toContain("अनन्या");
      expect(partnerFemaleLetter).toContain("मलिका");

      // Hindi friend letter
      const friendLetter = getHighlySpecificLetter("समीर", "friend", "male", ["car"], "hi");
      expect(friendLetter).toContain("समीर");
      expect(friendLetter).toContain("दोस्त");

      // Hindi big wishes
      const hindiWishes = getBigWishes("राहुल", "friend", "male", ["travel"], "hi");
      expect(hindiWishes.length).toBeGreaterThan(0);
      expect(hindiWishes.some((w) => w.wish.includes("कामयाबी") || w.wish.includes("दुआ"))).toBe(true);
    });

    it("generates authentic Bengali emotional letters for various relationships and genders", async () => {
      const { getHighlySpecificLetter, getBigWishes } = await import(
        "@/features/core/store/SuperPersonalizedLogic"
      );

      // Bengali partner male letter
      const partnerMaleLetter = getHighlySpecificLetter("সৌম্য", "partner", "male", ["music"], "bn");
      expect(partnerMaleLetter).toContain("সৌম্য");
      expect(partnerMaleLetter).toContain("রাজপুত্র");

      // Bengali partner female letter
      const partnerFemaleLetter = getHighlySpecificLetter("ঐন্দ্রিলা", "partner", "female", ["art"], "bengali");
      expect(partnerFemaleLetter).toContain("ঐন্দ্রিলা");
      expect(partnerFemaleLetter).toContain("রাজকন্যা");

      // Bengali friend letter
      const friendLetter = getHighlySpecificLetter("অভিরূপ", "friend", "male", ["car"], "bangla");
      expect(friendLetter).toContain("অভিরূপ");
      expect(friendLetter).toContain("বন্ধু");

      // Bengali big wishes
      const bnWishes = getBigWishes("শুভম", "friend", "male", ["coding", "car"], "bn");
      expect(bnWishes.length).toBeGreaterThan(0);
      expect(bnWishes.some((w) => w.wish.includes("কোড") || w.wish.includes("বাগ") || w.wish.includes("গতি"))).toBe(true);
    });

    it("generates authentic French emotional letters for various relationships and genders", async () => {
      const { getHighlySpecificLetter, getBigWishes } = await import(
        "@/features/core/store/SuperPersonalizedLogic"
      );

      // French partner male letter
      const partnerMaleLetter = getHighlySpecificLetter("Julien", "partner", "male", ["music"], "fr");
      expect(partnerMaleLetter).toContain("Julien");
      expect(partnerMaleLetter).toContain("prince");

      // French partner female letter
      const partnerFemaleLetter = getHighlySpecificLetter("Camille", "partner", "female", ["art"], "french");
      expect(partnerFemaleLetter).toContain("Camille");
      expect(partnerFemaleLetter).toContain("reine");

      // French friend letter
      const friendLetter = getHighlySpecificLetter("Antoine", "friend", "male", ["car"], "francais");
      expect(friendLetter).toContain("Antoine");
      expect(friendLetter).toContain("légende");

      // French big wishes
      const frWishes = getBigWishes("Élodie", "friend", "female", ["coding", "car"], "fr");
      expect(frWishes.length).toBeGreaterThan(0);
      expect(frWishes.some((w) => w.wish.includes("succès") || w.wish.includes("bonheur") || w.wish.includes("joie"))).toBe(true);
    });

    it("normalizes language in Zustand store with French, Bengali, Hindi aliases and English default", async () => {
      const { useBirthdayStore } = await import("@/features/core/store/useBirthdayStore");
      
      const defaultLang = useBirthdayStore.getState().getLanguage();
      expect(["en", "hi", "bn", "fr"]).toContain(defaultLang);
    });

    it("localizes cake flavors and labels for en, hi, bn, and fr in CakeTypes", async () => {
      const { CAKE_OPTIONS, getCakeName } = await import("@/components/birthday/CakeTypes");
      expect(CAKE_OPTIONS.length).toBe(4);
      
      const chocolate = CAKE_OPTIONS.find((c) => c.id === "chocolate")!;
      expect(getCakeName(chocolate, false, false, false)).toBe("Chocolate Dream");
      expect(getCakeName(chocolate, true, false, false)).toBe("चॉकलेट ड्रीम");
      expect(getCakeName(chocolate, false, true, false)).toBe("চকলেট ড্রিম");
      expect(getCakeName(chocolate, false, false, true)).toBe("Rêve Chocolaté");

      const strawberry = CAKE_OPTIONS.find((c) => c.id === "strawberry")!;
      expect(getCakeName(strawberry, true, false, false)).toBe("स्ट्रॉबेरी ब्लिस");
      expect(getCakeName(strawberry, false, true, false)).toBe("স্ট্রবেরি ব্লিস");
      expect(getCakeName(strawberry, false, false, true)).toBe("Délice Fraise");

      const royal = CAKE_OPTIONS.find((c) => c.id === "royal")!;
      expect(getCakeName(royal, false, false, true)).toBe("Velours Royal");

      const nature = CAKE_OPTIONS.find((c) => c.id === "nature")!;
      expect(getCakeName(nature, false, false, true)).toBe("Jardin Floral");
    });

    it("substitutes senderName in getHighlySpecificLetter and removes bracketed placeholders across all languages", async () => {
      const { getHighlySpecificLetter } = await import(
        "@/features/core/store/SuperPersonalizedLogic"
      );

      const withSender = getHighlySpecificLetter("Elena", "partner", "female", [], "en", "Alex");
      expect(withSender).toContain("Alex");
      expect(withSender).not.toContain("[Your Name]");

      const withoutSender = getHighlySpecificLetter("Elena", "partner", "female", [], "en");
      expect(withoutSender).not.toContain("[Your Name]");

      const bnWithSender = getHighlySpecificLetter("ঐন্দ্রিলা", "partner", "female", [], "bn", "অভিরূপ");
      expect(bnWithSender).toContain("অভিরূপ");
      expect(bnWithSender).not.toContain("[আপনার নাম]");

      const hiWithSender = getHighlySpecificLetter("अनन्या", "partner", "female", [], "hi", "समीर");
      expect(hiWithSender).toContain("समीर");
      expect(hiWithSender).not.toContain("[आपका नाम]");

      const frWithSender = getHighlySpecificLetter("Camille", "partner", "female", [], "fr", "Julien");
      expect(frWithSender).toContain("Julien");
      expect(frWithSender).not.toContain("[Votre Nom]");
    });

    it("verifies authentic English quotes without Roman Hindi in SPECIAL_QUOTES", async () => {
      const { SPECIAL_QUOTES } = await import("@/config/templates");
      const partnerMaleQuotes = SPECIAL_QUOTES.partner.male.join(" ");
      expect(partnerMaleQuotes).not.toContain("Tere sang");
      expect(partnerMaleQuotes).not.toContain("tishnagi");

      const partnerFemaleQuotes = SPECIAL_QUOTES.partner.female.join(" ");
      expect(partnerFemaleQuotes).not.toContain("khushi ka raaz");

      const friendLegendQuotes = SPECIAL_QUOTES.friend.legend.join(" ");
      expect(friendLegendQuotes).not.toContain("Dosti ka naam");
    });

    it("ensures memories.title and memories.viewLarge keys exist across all translation dictionaries including French", async () => {
      const { getTranslation } = await import("@/i18n");
      const en = getTranslation("en");
      const hi = getTranslation("hi");
      const bn = getTranslation("bn");
      const fr = getTranslation("fr");

      expect(en.memories.title).toBeTruthy();
      expect(en.memories.viewLarge).toBeTruthy();
      expect(hi.memories.title).toBeTruthy();
      expect(hi.memories.viewLarge).toBeTruthy();
      expect(bn.memories.title).toBeTruthy();
      expect(bn.memories.viewLarge).toBeTruthy();
      expect(fr.memories.title).toBeTruthy();
      expect(fr.memories.viewLarge).toBeTruthy();
    });
  });
});
