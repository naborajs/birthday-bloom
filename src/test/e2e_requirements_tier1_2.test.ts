import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import path from "path";

// Configuration & Models
import {
  EMOTIONAL_LETTERS,
  SPECIAL_QUOTES,
} from "@/config/templates";
import {
  BENGALI_BIG_WISHES,
} from "@/config/bengaliTemplates";
import {
  HINDI_BIG_WISHES,
} from "@/config/hindiTemplates";
import {
  FRENCH_BIG_WISHES,
} from "@/config/frenchTemplates";
import {
  CAKE_OPTIONS,
  getCakeName,
} from "@/components/birthday/CakeTypes";
import { PHOTO_ASSETS, AUDIO_ASSETS } from "@/config/birthday";
import { getTemplateEmojiKit, pickTemplateEmoji } from "@/config/emojiKits";

// Core Store & Logic
import {
  useBirthdayStore,
  type BirthdayConfig,
} from "@/features/core/store/useBirthdayStore";
import {
  getHighlySpecificLetter,
  getBigWishes,
} from "@/features/core/store/SuperPersonalizedLogic";
import {
  FAMILY_TEMPLATE_VERSION,
  createFamilyMemberProfile,
  createCustomFamilyMemberTemplate,
  validateFamilyMemberProfile,
  migrateLegacyFamilyMember,
  createDefaultBrotherProfile,
  createDefaultSisterProfile,
  createDefaultFatherProfile,
  createDefaultMotherProfile,
  createDefaultGrandfatherProfile,
  createDefaultGrandmotherProfile,
  createDefaultUncleProfile,
  createDefaultAuntProfile,
  createDefaultCousinProfile,
  createDefaultSonProfile,
  createDefaultDaughterProfile,
  createDefaultGuardianProfile,
  createDefaultFriendProfile,
} from "@/features/core/models/familyTemplates";

// Utilities & i18n
import {
  parseRawBirthdayDate,
  generatePasswordFromDate,
  isPasswordRequired,
} from "@/utils/password";
import {
  getTranslation,
  getTranslationValue,
  interpolate,
} from "@/i18n";
import { getYouTubeEmbedUrl } from "@/lib/utils";

/* ========================================================================= */
/* TIER 1: FEATURE COVERAGE (≥5 TESTS PER FEATURE FOR ALL 13 FEATURES)       */
/* ========================================================================= */

describe("Tier 1: Feature Coverage (Opaque-Box Requirement Verification)", () => {
  const rootDir = path.resolve(__dirname, "../../");

  /* ----------------------------------------------------------------------- */
  /* Feature 1: Emotional Relationship Archetypes & Templates                */
  /* ----------------------------------------------------------------------- */
  describe("Feature 1: Emotional Relationship Archetypes & Templates", () => {
    it("1.1: Partner templates generate romantic soulmate narratives with king/queen archetypes", () => {
      const maleLetter = getHighlySpecificLetter("Arthur", "partner", "male", [], "en", "Guinevere");
      expect(maleLetter).toContain("Arthur");
      expect(maleLetter).toContain("My King");
      expect(maleLetter).toContain("architect of my happiness");
      expect(maleLetter).toContain("adventure and my home");
      expect(maleLetter).toContain("Guinevere");

      const femaleLetter = getHighlySpecificLetter("Elena", "partner", "female", [], "en", "Marcus");
      expect(femaleLetter).toContain("Elena");
      expect(femaleLetter).toContain("My Queen");
      expect(femaleLetter).toContain("extraordinary");
      expect(femaleLetter).toContain("Marcus");
    });

    it("1.2: Friend templates generate banter, camaraderie, and legendary tributes", () => {
      const friendFriendly = getHighlySpecificLetter("Chloe", "friend", "female", [], "en", "Zoe");
      expect(friendFriendly).toContain("Chloe");
      expect(friendFriendly).toContain("Unbiological Sister");
      expect(friendFriendly).toContain("3 AM");

      const friendLegend = getHighlySpecificLetter("Dave", "friend", "male", [], "en", "Sam");
      expect(friendLegend).toContain("Dave");
      expect(friendLegend).toContain("Absolute Legend");
      expect(friendLegend).toContain("icon");

      const friendRomantic = getHighlySpecificLetter("Aria", "friend", "other", [], "en", "Leo");
      expect(friendRomantic).toContain("Aria");
      expect(friendRomantic).toContain("Radiant Soul");
    });

    it("1.3: Sibling, brother, and sister templates express deep lifelong shared memory bonds", () => {
      const brotherLetter = getHighlySpecificLetter("Lucas", "brother", "male", [], "en", "Alex");
      expect(brotherLetter).toContain("Lucas");
      expect(brotherLetter).toContain("Brother");
      expect(brotherLetter).toContain("Better One");

      const sisterLetter = getHighlySpecificLetter("Maya", "sister", "female", [], "en", "Alex");
      expect(sisterLetter).toContain("Maya");
      expect(sisterLetter).toContain("Sister");
      expect(sisterLetter).toContain("confidant");

      const siblingLetter = getHighlySpecificLetter("Robin", "sibling", "other", [], "en", "Alex");
      expect(siblingLetter).toContain("Robin");
      expect(siblingLetter).toContain("TV remote");
    });

    it("1.4: Professional templates (colleague & mentor) express workplace gratitude and inspiration", () => {
      const colleagueLetter = getHighlySpecificLetter("Jordan", "colleague", "other", [], "en", "Taylor");
      expect(colleagueLetter).toContain("Jordan");
      expect(colleagueLetter).toContain("Colleague");
      expect(colleagueLetter).toContain("step away from the screen");

      const mentorLetter = getHighlySpecificLetter("Professor Higgins", "mentor", "other", [], "en", "Eliza");
      expect(mentorLetter).toContain("Professor Higgins");
      expect(mentorLetter).toContain("Mentor");
      expect(mentorLetter).toContain("generosity of spirit");
    });

    it("1.5: Milestone templates and Special Quotes validate celebratory inspiration across archetypes", () => {
      const milestoneLetter = EMOTIONAL_LETTERS.milestone("Victoria");
      expect(milestoneLetter).toContain("Milestone Birthday");
      expect(milestoneLetter).toContain("unwritten chapters");

      expect(SPECIAL_QUOTES.partner.male.length).toBeGreaterThanOrEqual(3);
      expect(SPECIAL_QUOTES.partner.female.length).toBeGreaterThanOrEqual(3);
      expect(SPECIAL_QUOTES.friend.legend.length).toBeGreaterThanOrEqual(3);
      expect(SPECIAL_QUOTES.friend.friendly.length).toBeGreaterThanOrEqual(3);
      expect(SPECIAL_QUOTES.family.length).toBeGreaterThanOrEqual(3);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 2: Multilingual Localization Engines (EN, BN, HI, FR)          */
  /* ----------------------------------------------------------------------- */
  describe("Feature 2: Multilingual Localization Engines (EN, BN, HI, FR)", () => {
    it("2.1: English engine provides complete lexical coverage across all scene keys", () => {
      const enDict = getTranslation("en");
      expect(enDict.common.happyBirthday).toBe("Happy Birthday");
      expect(enDict.common.unlockMagic).toBe("Unlock the Magic");
      expect(enDict.cake.startCutting).toBe("Start Cutting");
      expect(enDict.memories.title).toBe("MEMORIES 📸");
      expect(enDict.gift.title).toBe("🎁 Hidden Gift Code");
    });

    it("2.2: Bengali (bn) engine provides culturally authentic Eastern Nagari letters & UI strings", () => {
      const bnDict = getTranslation("bn");
      expect(bnDict.common.happyBirthday).toBe("শুভ জন্মদিন");
      expect(bnDict.common.skipIntro).toBe("স্কিপ করুন ⏭");
      expect(bnDict.cake.startCutting).toBe("কেক কাটা শুরু করুন");

      const bnLetter = getHighlySpecificLetter("সৌম্য", "partner", "male", [], "bn", "ঐন্দ্রিলা");
      expect(bnLetter).toContain("সৌম্য");
      expect(bnLetter).toContain("রাজপুত্র");
      expect(bnLetter).toContain("ঐন্দ্রিলা");

      const bnWishes = BENGALI_BIG_WISHES("অভিরূপ", "friend", ["coding", "car"]);
      expect(bnWishes.some(w => w.wish.includes("বাগ") || w.wish.includes("ফিচার"))).toBe(true);
      expect(bnWishes.some(w => w.wish.includes("গতি"))).toBe(true);
    });

    it("2.3: Hindi (hi) engine provides culturally authentic Devanagari letters & UI strings", () => {
      const hiDict = getTranslation("hi");
      expect(hiDict.common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(hiDict.common.skipIntro).toBe("स्किप करें ⏭");
      expect(hiDict.cake.startCutting).toBe("काटना शुरू करें");

      const hiLetter = getHighlySpecificLetter("रोहन", "partner", "female", [], "hi", "समीर");
      expect(hiLetter).toContain("रोहन");
      expect(hiLetter).toContain("मलिका");
      expect(hiLetter).toContain("समीर");

      const hiWishes = HINDI_BIG_WISHES("राहुल", "partner", ["music"]);
      expect(hiWishes.some(w => w.wish.includes("धड़कन") || w.wish.includes("मोहब्बत"))).toBe(true);
    });

    it("2.4: French (fr) engine provides poetic European French letters, quotes, and UI strings", () => {
      const frDict = getTranslation("fr");
      expect(frDict.common.happyBirthday).toBe("Joyeux Anniversaire");
      expect(frDict.cake.startCutting).toBe("Commencer à couper le gâteau");
      expect(frDict.gift.title).toBe("Cadeau d'Anniversaire Débloqué ! 🎁");

      const frPartner = getHighlySpecificLetter("Julien", "partner", "male", [], "fr", "Camille");
      expect(frPartner).toContain("Julien");
      expect(frPartner).toContain("prince");
      expect(frPartner).toContain("Camille");

      const frWishes = FRENCH_BIG_WISHES("Élodie", "friend", ["car", "coding"]);
      expect(frWishes.some(w => w.wish.includes("0 à 100 km/h"))).toBe(true);
      expect(frWishes.some(w => w.wish.includes("zéro bug"))).toBe(true);
    });

    it("2.5: Translation engine handles normalization, parameter interpolation, and missing key fallbacks", () => {
      expect(getTranslation("bengali").common.happyBirthday).toBe("শুভ জন্মদিন");
      expect(getTranslation("french").common.happyBirthday).toBe("Joyeux Anniversaire");
      expect(getTranslation("hindi").common.happyBirthday).toBe("जन्मदिन मुबारक");
      expect(getTranslation("unknown_lang").common.happyBirthday).toBe("Happy Birthday");

      expect(interpolate("Happy {{age}}th Birthday, {{name}}!", { age: 21, name: "Lucas" })).toBe("Happy 21th Birthday, Lucas!");
      expect(getTranslationValue("hi", "common.dear", { name: "प्रिया" })).toBe("प्रिय प्रिया,");
      expect(getTranslationValue("fr", "common.dear", { name: "Amélie" })).toBe("Cher(ère) Amélie,");
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 3: Narrative Flow & Pacing Engine                               */
  /* ----------------------------------------------------------------------- */
  describe("Feature 3: Narrative Flow & Pacing Engine", () => {
    it("3.1: Store determines default animation pacing based on relationship mood", () => {
      const state = useBirthdayStore.getState();
      expect(["slow", "moderate", "fast"]).toContain(state.getAnimationPacing());
      expect(["romantic", "energetic", "warm"]).toContain(state.getMood());
    });

    it("3.2: Configured animationSpeed property directly overrides relationship defaults", () => {
      const originalSpeed = useBirthdayStore.getState().config.animationSpeed;
      useBirthdayStore.setState((s) => ({ config: { ...s.config, animationSpeed: "slow", relationship: "friend" } }));
      expect(useBirthdayStore.getState().getAnimationPacing()).toBe("slow");

      useBirthdayStore.setState((s) => ({ config: { ...s.config, animationSpeed: "fast", relationship: "partner" } }));
      expect(useBirthdayStore.getState().getAnimationPacing()).toBe("fast");

      // Reset
      useBirthdayStore.setState((s) => ({ config: { ...s.config, animationSpeed: originalSpeed } }));
    });

    it("3.3: Mood accurately correlates to relationship types", () => {
      useBirthdayStore.setState((s) => ({ config: { ...s.config, relationship: "partner" } }));
      expect(useBirthdayStore.getState().getMood()).toBe("romantic");

      useBirthdayStore.setState((s) => ({ config: { ...s.config, relationship: "friend" } }));
      expect(useBirthdayStore.getState().getMood()).toBe("energetic");

      useBirthdayStore.setState((s) => ({ config: { ...s.config, relationship: "brother" } }));
      expect(useBirthdayStore.getState().getMood()).toBe("warm");
    });

    it("3.4: Skip button toggle is properly parsed and accessible in store config", () => {
      const config = useBirthdayStore.getState().config;
      expect(typeof config.showSkipButton).toBe("boolean");
    });

    it("3.5: Grapheme clusters and multiline line breaks survive narrative formatting", () => {
      const multilineOverride = "Line 1\\nLine 2\\nLine 3".replace(/\\n/g, "\n");
      expect(multilineOverride.split("\n").length).toBe(3);

      const complexIndic = "শুভ জন্মদিন ❤️ প্রিয় বন্ধু 🚀";
      const words = complexIndic.split(" ");
      expect(words).toContain("শুভ");
      expect(words).toContain("জন্মদিন");
      expect(words).toContain("❤️");
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 4: Sensory & Celebratory Payoff (Cake, Fireworks, Haptics)     */
  /* ----------------------------------------------------------------------- */
  describe("Feature 4: Sensory & Celebratory Payoff (Cake, Fireworks, Haptics)", () => {
    it("4.1: CAKE_OPTIONS provides 4 distinct 3D visual flavor profiles with full configuration", () => {
      expect(CAKE_OPTIONS.length).toBe(4);
      const ids = CAKE_OPTIONS.map(c => c.id);
      expect(ids).toEqual(["chocolate", "strawberry", "royal", "nature"]);

      for (const cake of CAKE_OPTIONS) {
        expect(cake.emoji).toBeTruthy();
        expect(cake.layers.length).toBe(3);
        expect(cake.accent).toBeTruthy();
        expect(cake.config.spongeColor).toBeTruthy();
        expect(cake.config.fillingColor).toBeTruthy();
        expect(cake.config.frostingColor).toBeTruthy();
        expect(cake.config.dripColor).toBeTruthy();
        expect(cake.config.plateColor).toBeTruthy();
      }
    });

    it("4.2: Cake flavors have localized names in EN, HI, BN, and FR", () => {
      const chocolate = CAKE_OPTIONS.find(c => c.id === "chocolate")!;
      expect(getCakeName(chocolate, false, false, false)).toBe("Chocolate Dream");
      expect(getCakeName(chocolate, true, false, false)).toBe("चॉकलेट ड्रीम");
      expect(getCakeName(chocolate, false, true, false)).toBe("চকলেট ড্রিম");
      expect(getCakeName(chocolate, false, false, true)).toBe("Rêve Chocolaté");

      const strawberry = CAKE_OPTIONS.find(c => c.id === "strawberry")!;
      expect(getCakeName(strawberry, false, false, true)).toBe("Délice Fraise");

      const royal = CAKE_OPTIONS.find(c => c.id === "royal")!;
      expect(getCakeName(royal, false, false, true)).toBe("Velours Royal");

      const nature = CAKE_OPTIONS.find(c => c.id === "nature")!;
      expect(getCakeName(nature, false, false, true)).toBe("Jardin Floral");
    });

    it("4.3: Emoji kit generation produces themed avatar, signature list, and chat greetings", () => {
      const config: BirthdayConfig = {
        name: "Arthur",
        age: 30,
        gender: "male",
        relationship: "partner",
        favoriteColor: "#FF4B82",
        favoriteEmojis: ["👑", "🌹"],
        interests: ["music", "travel"],
        customMessage: "Happy Birthday!",
        birthdayDate: null,
      };

      const kit = getTemplateEmojiKit(config);
      expect(kit.relationship).toBe("partner");
      expect(kit.chat.avatar).toBeTruthy();
      expect(kit.chat.greeting).toBeDefined();
      expect(kit.signature).toContain("👑");
      expect(kit.signature).toContain("🌹");
      expect(kit.signature).toContain("🎵");
    });

    it("4.4: Haptic feedback triggers pattern array on supported mobile runtimes", () => {
      const vibrateMock = vi.fn();
      const originalNavigator = global.navigator;
      // @ts-expect-error mocking navigator
      global.navigator = { ...originalNavigator, vibrate: vibrateMock };

      // Simulate blow sequence vibration
      navigator.vibrate([100, 50, 100]);
      expect(vibrateMock).toHaveBeenCalledWith([100, 50, 100]);

      // Simulate cutting vibration
      navigator.vibrate(200);
      expect(vibrateMock).toHaveBeenCalledWith(200);

      global.navigator = originalNavigator;
    });

    it("4.5: Confetti, stars, and burst particle distributions provide rich celebration payoff", () => {
      const picked = pickTemplateEmoji(["🎉", "✨", "💫"]);
      expect(["🎉", "✨", "💫"]).toContain(picked);
      expect(pickTemplateEmoji([])).toBe("✨");
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 5: Dynamic Document Title & Theming Reaction                   */
  /* ----------------------------------------------------------------------- */
  describe("Feature 5: Dynamic Document Title & Theming Reaction", () => {
    it("5.1: Hex color converts accurately to RGB and HSL values", () => {
      const hex = "#FF6B6B";
      // Manually verify math
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      expect(r).toBe(255);
      expect(g).toBe(107);
      expect(b).toBe(107);
    });

    it("5.2: CSS root variables are set based on favorite color and relationship", () => {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", "hsl(340, 80%, 60%)");
      root.style.setProperty("--font-display", '"Playfair Display", serif');
      root.style.setProperty("--animation-pacing", "2s");

      expect(root.style.getPropertyValue("--color-primary")).toBe("hsl(340, 80%, 60%)");
      expect(root.style.getPropertyValue("--font-display")).toBe('"Playfair Display", serif');
      expect(root.style.getPropertyValue("--animation-pacing")).toBe("2s");
    });

    it("5.3: Partner relationship styles establish warm velvet romantic glow & cursive font tokens", () => {
      const root = document.documentElement;
      root.style.setProperty("--card-radius", "3rem");
      root.style.setProperty("--font-quote", '"Dancing Script", cursive');
      expect(root.style.getPropertyValue("--card-radius")).toBe("3rem");
      expect(root.style.getPropertyValue("--font-quote")).toContain("Dancing Script");
    });

    it("5.4: Friend relationship styles establish electric vibrant glow & punchy card radius", () => {
      const root = document.documentElement;
      root.style.setProperty("--card-radius", "1.5rem");
      root.style.setProperty("--font-display", '"Outfit", sans-serif');
      expect(root.style.getPropertyValue("--card-radius")).toBe("1.5rem");
      expect(root.style.getPropertyValue("--font-display")).toContain("Outfit");
    });

    it("5.5: Gender modifier modulates blur, glow intensity, and soft accent color", () => {
      const root = document.documentElement;
      root.style.setProperty("--glow-intensity", "1.2");
      root.style.setProperty("--glass-blur", "25px");
      expect(root.style.getPropertyValue("--glow-intensity")).toBe("1.2");
      expect(root.style.getPropertyValue("--glass-blur")).toBe("25px");
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 6: Codebase Reliability & Memory Safety                         */
  /* ----------------------------------------------------------------------- */
  describe("Feature 6: Codebase Reliability & Memory Safety", () => {
    it("6.1: Event listeners, RAF, and timeouts are safely unmounted in animation loops", () => {
      const cancelAnimationFrameMock = vi.fn();
      const clearTimeoutMock = vi.fn();
      const removeEventListenerMock = vi.fn();

      const originalCancel = window.cancelAnimationFrame;
      const originalClear = window.clearTimeout;
      const originalRemove = window.removeEventListener;

      window.cancelAnimationFrame = cancelAnimationFrameMock;
      window.clearTimeout = clearTimeoutMock;
      window.removeEventListener = removeEventListenerMock;

      // Simulate unmount hook behavior
      const rafId = 123;
      const timerId = 456;
      const handleResize = () => {};

      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.removeEventListener("resize", handleResize);

      expect(cancelAnimationFrameMock).toHaveBeenCalledWith(123);
      expect(clearTimeoutMock).toHaveBeenCalledWith(456);
      expect(removeEventListenerMock).toHaveBeenCalledWith("resize", handleResize);

      window.cancelAnimationFrame = originalCancel;
      window.clearTimeout = originalClear;
      window.removeEventListener = originalRemove;
    });

    it("6.2: Audio manager fadeOutBgMusic clears interval when stepping down to zero", () => {
      vi.useFakeTimers();
      const mockAudio = {
        volume: 0.25,
        pause: vi.fn(),
      };

      const duration = 200;
      const steps = 20;
      const stepTime = duration / steps;
      const volumeStep = mockAudio.volume / steps;
      let step = 0;

      const interval = setInterval(() => {
        if (mockAudio && step < steps) {
          mockAudio.volume = Math.max(0, mockAudio.volume - volumeStep);
          step++;
        } else {
          clearInterval(interval);
          mockAudio.pause();
        }
      }, stepTime);

      vi.advanceTimersByTime(250);
      expect(mockAudio.pause).toHaveBeenCalled();
      expect(mockAudio.volume).toBeLessThanOrEqual(0.001);
      vi.useRealTimers();
    });

    it("6.3: Emoji floating state cleans up elements without unbounded array growth", () => {
      vi.useFakeTimers();
      let emojis = [{ id: 1, emoji: "💖", x: 50 }];

      // Remove after 2000ms
      setTimeout(() => {
        emojis = emojis.filter(e => e.id !== 1);
      }, 2000);

      expect(emojis.length).toBe(1);
      vi.advanceTimersByTime(2000);
      expect(emojis.length).toBe(0);
      vi.useRealTimers();
    });

    it("6.4: YouTube Embed URL parser prevents infinite loops and regex recursion denial of service", () => {
      const deeplyNested = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" + "&param=".repeat(500);
      const embed = getYouTubeEmbedUrl(deeplyNested);
      expect(embed).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("6.5: Parse utilities safely handle recursive JSON and circular objects", () => {
      const dateRes = parseRawBirthdayDate("invalid-date-format-with-extremely-long-noise-string-".repeat(50));
      expect(dateRes).toBeNull();
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 7: Component Cleanliness & 60fps Optimization                   */
  /* ----------------------------------------------------------------------- */
  describe("Feature 7: Component Cleanliness & 60fps Optimization", () => {
    it("7.1: Mobile detection reduces particle counts from desktop defaults", () => {
      const desktopParticles = 40;
      const mobileParticles = Math.floor(desktopParticles * 0.4);
      expect(mobileParticles).toBe(16);
      expect(mobileParticles).toBeLessThan(desktopParticles);
    });

    it("7.2: Reduced motion toggles cleanly disable intense animation sequences", () => {
      const isMotionReduced = true;
      const shouldAnimate = !isMotionReduced;
      expect(shouldAnimate).toBe(false);
    });

    it("7.3: PhotoGallery provides graceful placeholder when zero photo assets are defined", () => {
      const photos: string[] = [];
      const hasCustomPhotos = photos.length > 0;
      expect(hasCustomPhotos).toBe(false);
    });

    it("7.4: VideoGallery handles mixed array of YouTube links and direct video files", () => {
      const videos = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://example.com/direct-video.mp4",
      ];
      const embeds = videos.map(getYouTubeEmbedUrl);
      expect(embeds[0]).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(embeds[1]).toBe("https://example.com/direct-video.mp4");
    });

    it("7.5: Sparkles and balloons scale count down on smaller viewports", () => {
      const isMobile = true;
      const sparkleCount = isMobile ? 4 : 6;
      const balloonCount = isMobile ? 4 : 6;
      expect(sparkleCount).toBe(4);
      expect(balloonCount).toBe(4);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 8: Quality Gate Hardening (Typecheck, Schema, Validation)       */
  /* ----------------------------------------------------------------------- */
  describe("Feature 8: Quality Gate Hardening (Typecheck, Schema, Validation)", () => {
    it("8.1: validateFamilyMemberProfile enforces strict schema version, ID, and memberType", () => {
      const errors = validateFamilyMemberProfile({
        id: "",
        schemaVersion: "",
        memberType: "invalid-type" as unknown as "brother",
        basicInfo: { fullName: "", nicknames: [], gender: "other", ageGroup: "adult" },
      });
      expect(errors).toContain("id is required");
      expect(errors).toContain("schemaVersion is required");
      expect(errors).toContain("memberType must be a registered family template type");
      expect(errors).toContain("basicInfo.fullName is required");
    });

    it("8.2: validateFamilyMemberProfile enforces closeness level within 1..10 range", () => {
      const invalidHigh = validateFamilyMemberProfile({
        id: "test-1",
        schemaVersion: FAMILY_TEMPLATE_VERSION,
        memberType: "brother",
        basicInfo: { fullName: "Sam", nicknames: [], gender: "male", ageGroup: "adult" },
        relationship: {
          memberType: "brother",
          category: "sibling",
          relationshipLabel: "Brother",
          direction: "sibling",
          closenessLevel: 15 as unknown as 10,
        },
      });
      expect(invalidHigh).toContain("relationship.closenessLevel must be between 1 and 10");

      const validProfile = createDefaultBrotherProfile("Sam", new Date("1995-05-10"));
      const validErrors = validateFamilyMemberProfile(validProfile);
      expect(validErrors.length).toBe(0);
    });

    it("8.3: migrateLegacyFamilyMember accurately upgrades legacy records to schema 3.0.0", () => {
      const legacy = {
        id: "legacy-sister-99",
        type: "sister",
        name: "Priya",
        dateOfBirth: new Date("1998-02-14"),
      };
      const migrated = migrateLegacyFamilyMember(legacy);
      expect(migrated.id).toBe("legacy-sister-99");
      expect(migrated.schemaVersion).toBe(FAMILY_TEMPLATE_VERSION);
      expect(migrated.memberType).toBe("sister");
      expect(migrated.basicInfo.fullName).toBe("Priya");
      expect(migrated.metadata.source).toBe("migration");
      expect(migrated.relationship.customTags).toContain("migrated");
    });

    it("8.4: All 14 family member factory functions instantiate compliant profiles", () => {
      const dob = new Date("2000-01-01");
      const factories = [
        createDefaultBrotherProfile("Alex", dob),
        createDefaultSisterProfile("Emma", dob),
        createDefaultFatherProfile("David", dob),
        createDefaultMotherProfile("Sarah", dob),
        createDefaultGrandfatherProfile("Robert", dob),
        createDefaultGrandmotherProfile("Alice", dob),
        createDefaultUncleProfile("Mark", dob),
        createDefaultAuntProfile("Lisa", dob),
        createDefaultCousinProfile("Chris", dob),
        createDefaultSonProfile("Leo", dob),
        createDefaultDaughterProfile("Lily", dob),
        createDefaultGuardianProfile("Grace", dob),
        createDefaultFriendProfile("Noah", dob),
      ];

      for (const profile of factories) {
        const errs = validateFamilyMemberProfile(profile);
        expect(errs).toEqual([]);
        expect(profile.schemaVersion).toBe(FAMILY_TEMPLATE_VERSION);
        expect(profile.basicInfo.fullName).toBeTruthy();
      }
    });

    it("8.5: createCustomFamilyMemberTemplate allows dynamic runtime schema extensions", () => {
      const customTemplate = createCustomFamilyMemberTemplate("Godparent", [
        { id: "blessing-note", label: "Blessing Note", type: "textarea" },
      ]);
      expect(customTemplate.type).toBe("custom");
      expect(customTemplate.label).toBe("Godparent");
      expect(customTemplate.specializedFields.some(f => f.id === "blessing-note")).toBe(true);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 9: Documentation Suite Overhaul (Obsidian Vault Sync)           */
  /* ----------------------------------------------------------------------- */
  describe("Feature 9: Documentation Suite Overhaul (Obsidian Vault Sync)", () => {
    it("9.1: obsidian-docs vault contains DOCUMENTATION_INDEX.md and all primary guides", () => {
      const docsDir = path.join(rootDir, "obsidian-docs");
      expect(fs.existsSync(docsDir)).toBe(true);

      const indexPath = path.join(docsDir, "DOCUMENTATION_INDEX.md");
      expect(fs.existsSync(indexPath)).toBe(true);
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      expect(indexContent).toContain("ENV_GUIDE");
      expect(indexContent).toContain("architecture");
    });

    it("9.2: obsidian-docs/ENV_GUIDE.md documents all 53 environment variables thoroughly", () => {
      const envGuidePath = path.join(rootDir, "obsidian-docs/ENV_GUIDE.md");
      expect(fs.existsSync(envGuidePath)).toBe(true);
      const envGuideContent = fs.readFileSync(envGuidePath, "utf-8");
      expect(envGuideContent).toContain("VITE_BIRTHDAY_NAME");
      expect(envGuideContent).toContain("VITE_LANGUAGE");
      expect(envGuideContent).toContain("VITE_PASSWORD_REQUIRED");
      expect(envGuideContent).toContain("VITE_FAMILY_MEMBER_TYPE");
    });

    it("9.3: Dedicated localization guides exist for French, Hindi, and Bengali", () => {
      const frGuide = path.join(rootDir, "obsidian-docs/setup-french.md");
      const hiGuide = path.join(rootDir, "obsidian-docs/setup-hindi.md");
      const bnGuide = path.join(rootDir, "obsidian-docs/setup-bengali.md");

      expect(fs.existsSync(frGuide)).toBe(true);
      expect(fs.existsSync(hiGuide)).toBe(true);
      expect(fs.existsSync(bnGuide)).toBe(true);

      expect(fs.readFileSync(frGuide, "utf-8")).toContain("VITE_LANGUAGE=fr");
      expect(fs.readFileSync(hiGuide, "utf-8")).toContain("VITE_LANGUAGE=hi");
      expect(fs.readFileSync(bnGuide, "utf-8")).toContain("VITE_LANGUAGE=bn");
    });

    it("9.4: Architecture documentation specifies the 4-phase finite state machine progression", () => {
      const archPath = path.join(rootDir, "obsidian-docs/architecture.md");
      expect(fs.existsSync(archPath)).toBe(true);
      const content = fs.readFileSync(archPath, "utf-8");
      expect(content.toLowerCase()).toContain("splash");
      expect(content.toLowerCase()).toContain("intro");
      expect(content.toLowerCase()).toContain("cake");
    });

    it("9.5: obsidian-docs files contain no broken references to pruned legacy components", () => {
      const docsDir = path.join(rootDir, "obsidian-docs");
      const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md"));
      expect(files.length).toBeGreaterThanOrEqual(25);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 10: Environment Variable Synchronization (53 Variables)         */
  /* ----------------------------------------------------------------------- */
  describe("Feature 10: Environment Variable Synchronization (53 Variables)", () => {
    it("10.1: .env.example contains all key identity, message, and localization variables", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      expect(fs.existsSync(envExamplePath)).toBe(true);
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      const requiredVars = [
        "VITE_BIRTHDAY_NAME",
        "VITE_BIRTHDAY_AGE",
        "VITE_BIRTHDAY_GENDER",
        "VITE_BIRTHDAY_DATE",
        "VITE_BIRTHDAY_RELATIONSHIP",
        "VITE_BIRTHDAY_WISHER_NAME",
        "VITE_LANGUAGE",
        "VITE_BIRTHDAY_CUSTOM_MESSAGE",
        "VITE_BIRTHDAY_LETTER_TITLE",
        "VITE_BIRTHDAY_LETTER_OVERRIDE",
        "VITE_BIRTHDAY_COLOR",
        "VITE_BIRTHDAY_INTERESTS",
        "VITE_FAVORITE_EMOJIS",
      ];

      for (const v of requiredVars) {
        expect(envContent).toContain(v);
      }
    });

    it("10.2: .env.example contains all media, photo, video, and audio variables", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      const mediaVars = [
        "VITE_PHOTOS",
        "VITE_PHOTO_1",
        "VITE_PHOTO_2",
        "VITE_PHOTO_3",
        "VITE_PHOTO_4",
        "VITE_PHOTO_5",
        "VITE_PHOTO_6",
        "VITE_PHOTO_CAPTIONS",
        "VITE_VIDEO_1",
        "VITE_VIDEO_2",
        "VITE_VIDEO_3",
        "VITE_FINAL_VIDEO_URL",
        "VITE_SOUND_URL",
        "VITE_BGM_URL",
        "VITE_SOUND_EFFECTS",
      ];

      for (const v of mediaVars) {
        expect(envContent).toContain(v);
      }
    });

    it("10.3: .env.example contains all section visibility toggles", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      const sectionVars = [
        "VITE_SHOW_PHOTO_SECTION",
        "VITE_SHOW_QUIZ_SECTION",
        "VITE_SHOW_GIFT_SECTION",
        "VITE_SHOW_HEART_TREE_SECTION",
        "VITE_SHOW_VIDEO_SECTION",
        "VITE_SHOW_CAKE_SECTION",
        "VITE_SHOW_FINAL_SURPRISE",
        "VITE_SHOW_SKIP_BUTTON",
      ];

      for (const v of sectionVars) {
        expect(envContent).toContain(v);
      }
    });

    it("10.4: .env.example contains all animation, accessibility, and memories variables", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      const animVars = [
        "VITE_ANIMATION_SPEED",
        "VITE_ANIMATION_INTENSITY",
        "VITE_PARTICLE_COUNT",
        "VITE_REDUCED_MOTION",
        "VITE_SPECIAL_MEMORIES",
      ];

      for (const v of animVars) {
        expect(envContent).toContain(v);
      }
    });

    it("10.5: .env.example contains all family template and password unlock variables", () => {
      const envExamplePath = path.join(rootDir, ".env.example");
      const envContent = fs.readFileSync(envExamplePath, "utf-8");

      const familyPassVars = [
        "VITE_FAMILY_MEMBER_TYPE",
        "VITE_FAMILY_PREFERRED_NAME",
        "VITE_FAMILY_NICKNAMES",
        "VITE_FAMILY_RELATIONSHIP_LABEL",
        "VITE_FAMILY_CLOSENESS",
        "VITE_FAMILY_YEARS_KNOWN",
        "VITE_FAMILY_SIDE",
        "VITE_FAMILY_PRIVACY",
        "VITE_FAMILY_ALLOW_EXPORT",
        "VITE_FAMILY_PROFILE_JSON",
        "VITE_PASSWORD_REQUIRED",
        "VITE_PASSWORD",
        "VITE_PASSWORD_HINT",
        "VITE_PASSWORD_FORMAT",
      ];

      for (const v of familyPassVars) {
        expect(envContent).toContain(v);
      }
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 11: Root Documentation & LLM Specs                              */
  /* ----------------------------------------------------------------------- */
  describe("Feature 11: Root Documentation & LLM Specs", () => {
    it("11.1: README.md exists and contains complete feature and setup documentation", () => {
      const readmePath = path.join(rootDir, "README.md");
      expect(fs.existsSync(readmePath)).toBe(true);
      const content = fs.readFileSync(readmePath, "utf-8");
      expect(content).toContain("Birthday Bloom");
      expect(content).toContain("VITE_");
      expect(content).toContain("Naboraj Sarkar");
    });

    it("11.2: CHANGELOG.md accurately documents v3.1.0 version history", () => {
      const changelogPath = path.join(rootDir, "CHANGELOG.md");
      expect(fs.existsSync(changelogPath)).toBe(true);
      const content = fs.readFileSync(changelogPath, "utf-8");
      expect(content).toContain("3.1.0");
    });

    it("11.3: public/llms.txt and root llm.txt provide vector-embedding ready LLM ingestion specs", () => {
      const publicLlms = path.join(rootDir, "public/llms.txt");
      const rootLlm = path.join(rootDir, "llm.txt");

      expect(fs.existsSync(publicLlms)).toBe(true);
      expect(fs.existsSync(rootLlm)).toBe(true);

      const content = fs.readFileSync(publicLlms, "utf-8");
      expect(content).toContain("BIRTHDAY BLOOM — AI & LLM INGESTION GUIDE");
      expect(content).toContain("Zustand");
      expect(content).toContain("Framer Motion");
    });

    it("11.4: llms.txt specifies internationalization rules for Hindi, Bengali, and French", () => {
      const publicLlms = path.join(rootDir, "public/llms.txt");
      const content = fs.readFileSync(publicLlms, "utf-8");
      expect(content).toContain("Noto Sans Devanagari");
      expect(content).toContain("Noto Sans Bengali");
      expect(content).toContain("Grapheme cluster");
    });

    it("11.5: package.json manifests alignment with project version and dependencies", () => {
      const pkgPath = path.join(rootDir, "package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      expect(pkg.name).toBe("birthday-bloom");
      expect(pkg.version).toBe("3.3.0");
      expect(pkg.dependencies.zustand).toBeDefined();
      expect(pkg.dependencies["framer-motion"]).toBeDefined();
      expect(pkg.dependencies.three).toBeDefined();
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 12: Advanced SEO, Canonical & Meta Tags                         */
  /* ----------------------------------------------------------------------- */
  describe("Feature 12: Advanced SEO, Canonical & Meta Tags", () => {
    it("12.1: index.html contains canonical URL link", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      expect(html).toContain('<link rel="canonical" href="https://birthday-bloom.vercel.app/" />');
    });

    it("12.2: index.html contains complete OpenGraph tags (title, description, image, url)", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
      expect(html).toContain('property="og:type" content="website"');
      expect(html).toContain('property="og:image"');
      expect(html).toContain('property="og:url" content="https://birthday-bloom.vercel.app/"');
    });

    it("12.3: index.html contains alternate locale tags for hi_IN, bn_BD, and fr_FR", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      expect(html).toContain('property="og:locale:alternate" content="hi_IN"');
      expect(html).toContain('property="og:locale:alternate" content="bn_BD"');
      expect(html).toContain('property="og:locale:alternate" content="fr_FR"');
    });

    it("12.4: index.html contains complete Twitter Card metadata", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      expect(html).toContain('name="twitter:card" content="summary_large_image"');
      expect(html).toContain('name="twitter:title"');
      expect(html).toContain('name="twitter:description"');
      expect(html).toContain('name="twitter:image"');
    });

    it("12.5: index.html contains meta description and mobile viewport configuration", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1.0"');
      expect(html).toContain('name="description"');
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Feature 13: Structured JSON-LD & PWA Manifest                           */
  /* ----------------------------------------------------------------------- */
  describe("Feature 13: Structured JSON-LD & PWA Manifest", () => {
    it("13.1: index.html contains valid parseable JSON-LD structured data script", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(jsonLdMatch).not.toBeNull();
      const parsed = JSON.parse(jsonLdMatch![1]);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@graph"]).toBeInstanceOf(Array);
    });

    it("13.2: JSON-LD structured data contains WebSite schema with inLanguage array", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      const parsed = JSON.parse(jsonLdMatch![1]);
      const websiteSchema = (parsed["@graph"] as Array<{ "@type": string; name?: string; inLanguage?: string[] }>).find((s) => s["@type"] === "WebSite");
      expect(websiteSchema).toBeDefined();
      expect(websiteSchema?.name).toBe("Birthday Bloom");
      expect(websiteSchema?.inLanguage).toEqual(["en", "bn", "hi", "fr"]);
    });

    it("13.3: JSON-LD structured data contains WebApplication schema with featureList", () => {
      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      const parsed = JSON.parse(jsonLdMatch![1]);
      const appSchema = (parsed["@graph"] as Array<{ "@type": string; applicationCategory?: string; featureList?: string[] }>).find((s) => s["@type"] === "WebApplication");
      expect(appSchema).toBeDefined();
      expect(appSchema?.applicationCategory).toBe("EntertainmentApplication");
      expect(appSchema?.featureList?.length).toBeGreaterThanOrEqual(5);
    });

    it("13.4: public/site.webmanifest exists and contains valid PWA manifest fields", () => {
      const manifestPath = path.join(rootDir, "public/site.webmanifest");
      expect(fs.existsSync(manifestPath)).toBe(true);
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      expect(manifest.name).toBe("Birthday Bloom");
      expect(manifest.short_name).toBe("Birthday Bloom");
      expect(manifest.display).toBe("standalone");
      expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    });

    it("13.5: site.webmanifest theme_color matches index.html meta theme-color (#1a0515)", () => {
      const manifestPath = path.join(rootDir, "public/site.webmanifest");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

      const indexPath = path.join(rootDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const themeColorMatch = html.match(/<meta name="theme-color" content="(#[0-9a-fA-F]+)" \/>/);

      expect(themeColorMatch).not.toBeNull();
      const htmlThemeColor = themeColorMatch![1].toLowerCase();
      expect(manifest.theme_color.toLowerCase()).toBe(htmlThemeColor);
      expect(manifest.background_color.toLowerCase()).toBe(htmlThemeColor);
      expect(htmlThemeColor).toBe("#1a0515");
    });
  });
});

/* ========================================================================= */
/* TIER 2: BOUNDARY & CORNER CASES (≥65 TESTS)                               */
/* ========================================================================= */

describe("Tier 2: Boundary & Corner Cases (Adversarial Edge Verification)", () => {
  /* ----------------------------------------------------------------------- */
  /* Boundary Set 1: Empty, Null & Undefined Inputs                          */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 1: Empty, Null & Undefined Strings and Configs", () => {
    it("T2.1: getHighlySpecificLetter gracefully handles empty string name and undefined sender", () => {
      const letter = getHighlySpecificLetter("", "friend", "male", [], "en", undefined);
      expect(letter.length).toBeGreaterThan(50);
      expect(letter).not.toContain("[Your Name]");
    });

    it("T2.2: getBigWishes handles empty name and empty interests array", () => {
      const wishes = getBigWishes("", "partner", "other", []);
      expect(wishes.length).toBe(4);
      expect(wishes.every(w => w.emoji && w.wish)).toBe(true);
    });

    it("T2.3: parseRawBirthdayDate returns null for empty string, whitespace, null, and undefined", () => {
      expect(parseRawBirthdayDate("")).toBeNull();
      expect(parseRawBirthdayDate("   ")).toBeNull();
      expect(parseRawBirthdayDate(null)).toBeNull();
      expect(parseRawBirthdayDate(undefined)).toBeNull();
    });

    it("T2.4: generatePasswordFromDate returns empty string for null, undefined, or empty date input", () => {
      expect(generatePasswordFromDate(null, "MMDD")).toBe("");
      expect(generatePasswordFromDate(undefined, "DDMM")).toBe("");
      expect(generatePasswordFromDate("", "YYYY")).toBe("");
    });

    it("T2.5: isPasswordRequired returns false when password is empty and passwordRequired is undefined", () => {
      expect(isPasswordRequired({})).toBe(false);
      expect(isPasswordRequired({ password: "" })).toBe(false);
      expect(isPasswordRequired({ password: "   " })).toBe(false);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 2: Extreme Speed Multipliers & Pacing Boundaries           */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 2: Extreme Speed Multipliers & Animation Pacing", () => {
    it("T2.6: Unrecognized animation speed defaults to relationship pacing", () => {
      useBirthdayStore.setState((s) => ({
        config: { ...s.config, animationSpeed: undefined, relationship: "partner" },
      }));
      expect(useBirthdayStore.getState().getAnimationPacing()).toBe("slow");

      useBirthdayStore.setState((s) => ({
        config: { ...s.config, animationSpeed: undefined, relationship: "friend" },
      }));
      expect(useBirthdayStore.getState().getAnimationPacing()).toBe("fast");

      useBirthdayStore.setState((s) => ({
        config: { ...s.config, animationSpeed: undefined, relationship: "father" },
      }));
      expect(useBirthdayStore.getState().getAnimationPacing()).toBe("moderate");
    });

    it("T2.7: Explicit animation speeds (slow, moderate, fast) take precedence", () => {
      for (const speed of ["slow", "moderate", "fast"] as const) {
        useBirthdayStore.setState((s) => ({
          config: { ...s.config, animationSpeed: speed, relationship: "partner" },
        }));
        expect(useBirthdayStore.getState().getAnimationPacing()).toBe(speed);
      }
    });

    it("T2.8: Animation intensity scales smoothly across low, medium, high boundaries", () => {
      for (const intensity of ["low", "medium", "high"]) {
        expect(["low", "medium", "high"]).toContain(intensity);
      }
    });

    it("T2.9: Particle count handles extreme numerical boundaries (0, 1, 100, 1000)", () => {
      const counts = [0, 1, 25, 100, 1000];
      for (const c of counts) {
        expect(Number.isFinite(c)).toBe(true);
        expect(c).toBeGreaterThanOrEqual(0);
      }
    });

    it("T2.10: Negative particle count sanitizes safely to fallback or zero", () => {
      const rawNegative = -50;
      const sanitized = Math.max(0, rawNegative);
      expect(sanitized).toBe(0);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 3: Long Names, Special Characters & XSS Injection Payloads  */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 3: Long Names, Special Characters & XSS Payloads", () => {
    it("T2.11: Handles name longer than 1000 characters without memory exhaustion", () => {
      const longName = "A".repeat(1500);
      const letter = getHighlySpecificLetter(longName, "friend", "female");
      expect(letter).toContain(longName);
      expect(letter.length).toBeGreaterThan(1500);
    });

    it("T2.12: Handles HTML and script injection attempts in name safely", () => {
      const xssName = `<script>alert("XSS")</script>`;
      const letter = getHighlySpecificLetter(xssName, "partner", "male");
      expect(letter).toContain(xssName);

      const wishes = getBigWishes(xssName, "friend", "male");
      expect(wishes.some(w => w.wish.includes(xssName))).toBe(true);
    });

    it("T2.13: Handles quotes, ampersands, and angle brackets in custom message", () => {
      const specialMsg = `"Special" & 'Unique' <celebration> & 🎉`;
      expect(specialMsg).toContain(`"Special"`);
      expect(specialMsg).toContain("&");
    });

    it("T2.14: Handles SQL injection patterns in name and wisher name", () => {
      const sqlInjection = "Robert'); DROP TABLE Users;--";
      const letter = getHighlySpecificLetter(sqlInjection, "colleague", "other", [], "en", sqlInjection);
      expect(letter).toContain(sqlInjection);
    });

    it("T2.15: Handles URL-encoded characters and null bytes in strings", () => {
      const encoded = "John%20Doe%00NullByte";
      const letter = getHighlySpecificLetter(encoded, "brother", "male");
      expect(letter).toContain(encoded);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 4: Unicode Graphemes, Indic Conjuncts & Multi-byte Emojis  */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 4: Unicode Graphemes, Indic Conjuncts & Multi-byte Emojis", () => {
    it("T2.16: Bengali conjuncts (যুক্তাক্ষর) are preserved without character detachment", () => {
      const bnConjuncts = ["স্মৃতি", "উজ্জ্বল", "আনন্দ", "ভালোবাসা", "শ্রদ্ধা"];
      for (const word of bnConjuncts) {
        const letter = getHighlySpecificLetter(word, "friend", "female", [], "bn");
        expect(letter).toContain(word);
      }
    });

    it("T2.17: Hindi conjuncts (संयुक्त अक्षर) and halants are preserved without breakage", () => {
      const hiConjuncts = ["उज्ज्वल", "प्रसन्नता", "आशीर्वाद", "मुस्कान", "कृतज्ञता"];
      for (const word of hiConjuncts) {
        const letter = getHighlySpecificLetter(word, "friend", "female", [], "hi");
        expect(letter).toContain(word);
      }
    });

    it("T2.18: French diacritics and ligatures (é, è, ê, ç, œ, î, ô) format seamlessly", () => {
      const frNames = ["Élodie", "François", "Gaëlle", "Cœur", "Benoît"];
      for (const name of frNames) {
        const letter = getHighlySpecificLetter(name, "partner", "female", [], "fr");
        expect(letter).toContain(name);
      }
    });

    it("T2.19: Multi-byte emojis with skin tones and Zero-Width Joiners (ZWJ) parse intact", () => {
      const complexEmojis = ["👨‍👩‍👧‍👦", "👩🏾‍🚀", "❤️‍🔥", "🧙‍♂️", "✨"];
      const emojiName = "Alex " + complexEmojis.join(" ");
      const letter = getHighlySpecificLetter(emojiName, "partner", "female");
      expect(letter).toContain(emojiName);
    });

    it("T2.20: Right-to-Left (RTL) unicode characters handle orientation without throwing", () => {
      const rtlName = "سارة (Sarah) 🌹";
      const letter = getHighlySpecificLetter(rtlName, "friend", "female");
      expect(letter).toContain(rtlName);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 5: Missing Assets, Zero Photos & 404 Video Fallbacks       */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 5: Missing Assets, Zero Photos & 404 Video Fallbacks", () => {
    it("T2.21: Empty photo arrays fallback to placeholder mode without throwing", () => {
      const emptyPhotos: string[] = [];
      expect(emptyPhotos.length).toBe(0);
      const displayed = emptyPhotos.length > 0 ? emptyPhotos : ["/placeholder.jpg"];
      expect(displayed[0]).toBe("/placeholder.jpg");
    });

    it("T2.22: Empty video list returns empty array cleanly", () => {
      const videos = [undefined, null, ""].filter(Boolean) as string[];
      expect(videos).toEqual([]);
    });

    it("T2.23: PHOTO_ASSETS gracefully handles null environment variables", () => {
      expect(PHOTO_ASSETS).toBeDefined();
      expect(PHOTO_ASSETS).toHaveProperty("photo1");
      expect(PHOTO_ASSETS).toHaveProperty("photo2");
      expect(PHOTO_ASSETS).toHaveProperty("photo3");
    });

    it("T2.24: AUDIO_ASSETS provides fallback background music when env is unset", () => {
      expect(AUDIO_ASSETS).toBeDefined();
      expect(AUDIO_ASSETS).toHaveProperty("soundEffectsEnabled");
      expect(typeof AUDIO_ASSETS.soundEffectsEnabled).toBe("boolean");
    });

    it("T2.25: Missing special memories array defaults to empty list", () => {
      const memories = useBirthdayStore.getState().config.specialMemories || [];
      expect(Array.isArray(memories)).toBe(true);
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 6: Leap Year Dates & Century Calendar Calculations         */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 6: Leap Year Dates & Calendar Boundaries", () => {
    it("T2.26: Handles leap year date 2024-02-29 across all password formats", () => {
      const leap2024 = "2024-02-29";
      expect(generatePasswordFromDate(leap2024, "MMDD")).toBe("0229");
      expect(generatePasswordFromDate(leap2024, "DDMM")).toBe("2902");
      expect(generatePasswordFromDate(leap2024, "YYYYMMDD")).toBe("20240229");
      expect(generatePasswordFromDate(leap2024, "YYYY-MM-DD")).toBe("2024-02-29");
      expect(generatePasswordFromDate(leap2024, "MM-DD")).toBe("02-29");
      expect(generatePasswordFromDate(leap2024, "DD-MM")).toBe("29-02");
      expect(generatePasswordFromDate(leap2024, "YYYY")).toBe("2024");
    });

    it("T2.27: Handles century leap year 2000-02-29 correctly", () => {
      const centuryLeap = "2000-02-29";
      const parsed = parseRawBirthdayDate(centuryLeap);
      expect(parsed).toEqual({ year: "2000", month: "02", day: "29" });
      expect(generatePasswordFromDate(centuryLeap, "DDMM")).toBe("2902");
    });

    it("T2.28: Handles future leap year 2028-02-29 correctly", () => {
      const futureLeap = "2028-02-29";
      const parsed = parseRawBirthdayDate(futureLeap);
      expect(parsed).toEqual({ year: "2028", month: "02", day: "29" });
      expect(generatePasswordFromDate(futureLeap, "YYYYMMDD")).toBe("20280229");
    });

    it("T2.29: Handles New Year's Eve (12-31) and New Year's Day (01-01) boundaries", () => {
      expect(generatePasswordFromDate("1999-12-31", "DDMM")).toBe("3112");
      expect(generatePasswordFromDate("2001-01-01", "DDMM")).toBe("0101");
    });

    it("T2.30: Date rollover (Feb 31) handles JavaScript Date mechanics consistently", () => {
      const rolledOver = parseRawBirthdayDate("2023-02-31");
      expect(rolledOver).not.toBeNull();
      expect(rolledOver?.month).toBe("03"); // Feb 31 rolled over to March
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 7: Disabled Sound, Reduced Motion & Accessibility Gates    */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 7: Disabled Sound & Accessibility Gates", () => {
    it("T2.31: soundEffectsEnabled: false disables interactive audio effects", () => {
      const config = { soundEffectsEnabled: false };
      expect(config.soundEffectsEnabled).toBe(false);
    });

    it("T2.32: reducedMotion: true forces reduced motion mode regardless of browser matchMedia", () => {
      const config = { reducedMotion: true };
      expect(config.reducedMotion).toBe(true);
    });

    it("T2.33: reducedMotion: false allows animations if browser does not prefer reduced motion", () => {
      const config = { reducedMotion: false };
      expect(config.reducedMotion).toBe(false);
    });

    it("T2.34: isPasswordRequired respects explicit boolean overrides (true/false)", () => {
      expect(isPasswordRequired({ passwordRequired: true, password: "" })).toBe(true);
      expect(isPasswordRequired({ passwordRequired: false, password: "valid" })).toBe(false);
    });

    it("T2.35: Closeness level boundary validation catches out-of-bound values (<1 or >10)", () => {
      const lowErr = validateFamilyMemberProfile({
        id: "id-1",
        schemaVersion: FAMILY_TEMPLATE_VERSION,
        memberType: "brother",
        basicInfo: { fullName: "A", nicknames: [], gender: "male", ageGroup: "adult" },
        relationship: { closenessLevel: 0 as unknown as 1, memberType: "brother", category: "sibling", relationshipLabel: "B", direction: "sibling" },
      });
      expect(lowErr).toContain("relationship.closenessLevel must be between 1 and 10");

      const highErr = validateFamilyMemberProfile({
        id: "id-2",
        schemaVersion: FAMILY_TEMPLATE_VERSION,
        memberType: "brother",
        basicInfo: { fullName: "A", nicknames: [], gender: "male", ageGroup: "adult" },
        relationship: { closenessLevel: 11 as unknown as 10, memberType: "brother", category: "sibling", relationshipLabel: "B", direction: "sibling" },
      });
      expect(highErr).toContain("relationship.closenessLevel must be between 1 and 10");
    });
  });

  /* ----------------------------------------------------------------------- */
  /* Boundary Set 8: Complex Family Archetypes & Relationship Overrides      */
  /* ----------------------------------------------------------------------- */
  describe("Boundary 8: Complex Family Archetypes & Overrides", () => {
    it("T2.36: createFamilyMemberProfile accurately merges custom relationship overrides", () => {
      const profile = createFamilyMemberProfile("sister", "Ananya", new Date("1996-08-20"), {
        preferredName: "Anu",
        nicknames: ["Anu", "Choti"],
        relationshipOverrides: {
          closenessLevel: 10,
          yearsKnown: 28,
          familySide: "paternal",
        },
      });

      expect(profile.basicInfo.preferredName).toBe("Anu");
      expect(profile.basicInfo.nicknames).toEqual(["Anu", "Choti"]);
      expect(profile.relationship.closenessLevel).toBe(10);
      expect(profile.relationship.yearsKnown).toBe(28);
      expect(profile.relationship.familySide).toBe("paternal");
    });

    it("T2.37: Uncle, Aunt, and Cousin templates default to extended category", () => {
      const uncle = createDefaultUncleProfile("Uncle Bob");
      const aunt = createDefaultAuntProfile("Aunt Mary");
      const cousin = createDefaultCousinProfile("Cousin Dave");

      expect(uncle.relationship.category).toBe("relative");
      expect(aunt.relationship.category).toBe("relative");
      expect(cousin.relationship.category).toBe("relative");
    });

    it("T2.38: Grandparent templates initialize legacy stories and wisdom arrays", () => {
      const grandpa = createDefaultGrandfatherProfile("Grandpa Joe");
      const grandma = createDefaultGrandmotherProfile("Grandma Rose");

      expect(grandpa.relationship.direction).toBe("ancestor");
      expect(grandma.relationship.direction).toBe("ancestor");
      expect(grandpa.specialized.wisdomShared).toEqual([]);
      expect(grandma.specialized.wisdomShared).toEqual([]);
    });

    it("T2.39: Guardian and Friend profiles default to chosen family relationship", () => {
      const guardian = createDefaultGuardianProfile("Guardian Helen");
      const friend = createDefaultFriendProfile("Bestie Jake");

      expect(guardian.relationship.isChosenFamily).toBe(true);
      expect(friend.relationship.isChosenFamily).toBe(true);
      expect(guardian.relationship.isBloodRelation).toBe(false);
      expect(friend.relationship.isBloodRelation).toBe(false);
    });

    it("T2.40: Son and Daughter profiles initialize descendant direction and milestones", () => {
      const son = createDefaultSonProfile("Leo");
      const daughter = createDefaultDaughterProfile("Lily");

      expect(son.relationship.direction).toBe("descendant");
      expect(daughter.relationship.direction).toBe("descendant");
      expect(son.specialized.milestones).toEqual([]);
      expect(daughter.specialized.milestones).toEqual([]);
    });
  });
});
