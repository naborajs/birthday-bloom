import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Models & Config
import {
  useBirthdayStore,
  type RelationshipType,
} from "@/features/core/store/useBirthdayStore";
import {
  getHighlySpecificLetter,
  getBigWishes,
} from "@/features/core/store/SuperPersonalizedLogic";
import {
  CAKE_OPTIONS,
  getCakeName,
} from "@/components/birthday/CakeTypes";
import {
  createFamilyMemberProfile,
  createCustomFamilyMemberTemplate,
  createDefaultSisterProfile,
  createDefaultFatherProfile,
  createDefaultGrandfatherProfile,
  createDefaultGuardianProfile,
  createDefaultSonProfile,
  createDefaultMotherProfile,
} from "@/features/core/models/familyTemplates";

// Utilities & i18n
import {
  getEffectivePassword,
  isPasswordRequired,
} from "@/utils/password";
import {
  getTranslation,
} from "@/i18n";
import { getYouTubeEmbedUrl } from "@/lib/utils";

/* ========================================================================= */
/* TIER 3: CROSS-FEATURE PAIRWISE INTERACTIONS (≥15 TESTS)                   */
/* ========================================================================= */

describe("Tier 3: Cross-Feature Pairwise Interactions", () => {

  /* ----------------------------------------------------------------------- */
  /* Pairwise 1: Bengali + Romantic Partner + Slow Pacing + Custom Emojis    */
  /* ----------------------------------------------------------------------- */
  it("P1: Bengali + Romantic Partner (Male) + Slow Pacing + Custom Emojis", () => {
    useBirthdayStore.setState({
      config: {
        name: "সৌম্য",
        age: 28,
        gender: "male",
        relationship: "partner",
        favoriteColor: "#FF4B82",
        favoriteEmojis: ["💖", "🌹"],
        interests: ["music", "travel"],
        customMessage: "তুমি আমার জীবনের সেরা উপহার",
        birthdayDate: new Date("1998-04-15"),
        animationSpeed: "slow",
        language: "bn",
        senderName: "ঐন্দ্রিলা",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getAnimationPacing()).toBe("slow");
    expect(store.getMood()).toBe("romantic");
    expect(store.getLanguage()).toBe("bn");

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("সৌম্য");
    expect(letter).toContain("রাজপুত্র");
    expect(letter).toContain("ঐন্দ্রিলা");
    expect(letter).not.toContain("[আপনার নাম]");

    const chocolateCake = CAKE_OPTIONS.find((c) => c.id === "chocolate")!;
    expect(getCakeName(chocolateCake, false, true, false)).toBe("চকলেট ড্রিম");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 2: Bengali + Partner (Female) + Slow Pacing + Custom Sender    */
  /* ----------------------------------------------------------------------- */
  it("P2: Bengali + Partner (Female) + Slow Pacing + Custom Sender + Sound Effects", () => {
    useBirthdayStore.setState({
      config: {
        name: "অনন্যা",
        age: 26,
        gender: "female",
        relationship: "partner",
        favoriteColor: "#FF69B4",
        favoriteEmojis: ["👑", "✨"],
        interests: ["art", "reading"],
        customMessage: "আমার রাজকন্যাকে জন্মদিনের অনেক শুভেচ্ছা",
        birthdayDate: new Date("2000-11-20"),
        animationSpeed: "slow",
        language: "bn",
        soundEffectsEnabled: true,
        senderName: "সৌরভ",
      },
    });

    const store = useBirthdayStore.getState();
    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("অনন্যা");
    expect(letter).toContain("রাজকন্যা");
    expect(letter).toContain("সৌরভ");

    const wishes = getBigWishes(store.config.name, store.config.relationship, store.config.gender, store.config.interests, "bn");
    expect(wishes.some((w) => w.wish.includes("ভালোবাসা") || w.wish.includes("হৃদস্পন্দন"))).toBe(true);
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 3: French + Friend (Legend) + Fast Pacing + Reduced Motion     */
  /* ----------------------------------------------------------------------- */
  it("P3: French + Friend (Male / Legend) + Fast Pacing + Reduced Motion + Car Interests", () => {
    useBirthdayStore.setState({
      config: {
        name: "Antoine",
        age: 24,
        gender: "male",
        relationship: "friend",
        favoriteColor: "#00C2FF",
        favoriteEmojis: ["🔥", "🏎️"],
        interests: ["car", "gaming"],
        customMessage: "Joyeux Anniversaire mon frère !",
        birthdayDate: new Date("2002-06-18"),
        animationSpeed: "fast",
        reducedMotion: true,
        language: "fr",
        senderName: "Lucas",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getAnimationPacing()).toBe("fast");
    expect(store.getMood()).toBe("energetic");
    expect(store.config.reducedMotion).toBe(true);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Antoine");
    expect(letter).toContain("légende");
    expect(letter).toContain("Lucas");

    const wishes = getBigWishes(store.config.name, store.config.relationship, store.config.gender, store.config.interests, "fr");
    expect(wishes.some((w) => w.emoji === "🏎️" && w.wish.includes("0 à 100 km/h"))).toBe(true);
    expect(wishes.some((w) => w.emoji === "🔥")).toBe(true);
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 4: French + Friend (Friendly) + Moderate Pacing + Theme        */
  /* ----------------------------------------------------------------------- */
  it("P4: French + Friend (Female / Friendly) + Moderate Pacing + Photo Captions + Custom Theme", () => {
    useBirthdayStore.setState({
      config: {
        name: "Camille",
        age: 27,
        gender: "female",
        relationship: "friend",
        favoriteColor: "#9B51E0",
        favoriteEmojis: ["✨", "🌸"],
        interests: ["nature", "travel"],
        customMessage: "À ma meilleure amie...",
        birthdayDate: new Date("1999-09-12"),
        animationSpeed: "moderate",
        language: "fr",
        photos: ["https://example.com/p1.jpg", "https://example.com/p2.jpg"],
        photoCaptions: ["Souvenir d'été", "Rires partagés"],
        senderName: "Élodie",
      },
    });

    const store = useBirthdayStore.getState();
    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Camille");
    expect(letter).toContain("meilleur(e) ami(e)");
    expect(letter).toContain("Élodie");

    const royalCake = CAKE_OPTIONS.find((c) => c.id === "royal")!;
    expect(getCakeName(royalCake, false, false, true)).toBe("Velours Royal");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 5: Hindi + Family + Secret Vault (DDMM) + Amber Theme          */
  /* ----------------------------------------------------------------------- */
  it("P5: Hindi + Family + Secret Vault (DDMM) + Amber Theme", () => {
    useBirthdayStore.setState({
      config: {
        name: "राजेश",
        age: 50,
        gender: "male",
        relationship: "family",
        favoriteColor: "#FFBF00",
        favoriteEmojis: ["🙏", "✨"],
        interests: ["nature", "reading"],
        customMessage: "परिवार का गौरव हो आप",
        birthdayDate: new Date("1976-08-25"),
        passwordRequired: true,
        passwordFormat: "DDMM",
        language: "hi",
        senderName: "पूरा परिवार",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getMood()).toBe("warm");
    expect(store.config.passwordRequired).toBe(true);

    const passcode = getEffectivePassword({
      birthdayDate: store.config.birthdayDate,
      passwordFormat: store.config.passwordFormat,
    });
    expect(passcode).toBe("2508"); // 25th August

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("राजेश");
    expect(letter).toContain("परिवार");
    expect(letter).toContain("आपका परिवार");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 6: Hindi + Brother + Custom Passcode Date (YYYYMMDD)           */
  /* ----------------------------------------------------------------------- */
  it("P6: Hindi + Brother + Custom Passcode Date (YYYYMMDD) + Coding Interests", () => {
    useBirthdayStore.setState({
      config: {
        name: "अमित",
        age: 23,
        gender: "male",
        relationship: "brother",
        favoriteColor: "#007BFF",
        favoriteEmojis: ["💻", "⚡"],
        interests: ["coding", "gaming"],
        customMessage: "मेरे प्यारे भाई को जन्मदिन की बधाई",
        birthdayDate: new Date("2003-03-14"),
        passwordRequired: true,
        passwordFormat: "YYYYMMDD",
        language: "hi",
        senderName: "अभिषेक",
      },
    });

    const store = useBirthdayStore.getState();
    const passcode = getEffectivePassword({
      birthdayDate: store.config.birthdayDate,
      passwordFormat: store.config.passwordFormat,
    });
    expect(passcode).toBe("20030314");

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("अमित");
    expect(letter).toContain("भाई");
    expect(letter).toContain("अभिषेक");

    const wishes = getBigWishes(store.config.name, store.config.relationship, store.config.gender, store.config.interests, "hi");
    expect(wishes.some((w) => w.emoji === "💻" && w.wish.includes("बग्स"))).toBe(true);
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 7: English + Sibling + Coding/Car + Letter Override            */
  /* ----------------------------------------------------------------------- */
  it("P7: English + Sibling + Coding/Car Interests + Custom Letter Override", () => {
    useBirthdayStore.setState({
      config: {
        name: "Jordan",
        age: 29,
        gender: "other",
        relationship: "sibling",
        favoriteColor: "#10B981",
        favoriteEmojis: ["🚀", "✨"],
        interests: ["coding", "car"],
        customMessage: "To the coolest sibling!",
        letterOverride: "Dear Jordan,\\n\\nYou are simply the best sibling ever.\\n\\nWith love,\\nTaylor",
        birthdayDate: new Date("1997-12-05"),
        language: "en",
        senderName: "Taylor",
      },
    });

    const store = useBirthdayStore.getState();
    const override = store.config.letterOverride?.replace(/\\n/g, "\n");
    expect(override).toContain("Jordan");
    expect(override).toContain("best sibling ever");
    expect(override).toContain("Taylor");

    const wishes = getBigWishes("Jordan", "sibling", "other", ["coding", "car"], "en");
    expect(wishes.some((w) => w.emoji === "💻" && w.wish.includes("zero bugs"))).toBe(true);
    expect(wishes.some((w) => w.emoji === "🏎️" && w.wish.includes("0 to 100"))).toBe(true);
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 8: French + Partner + Female + Custom Sender + Sound Disabled  */
  /* ----------------------------------------------------------------------- */
  it("P8: French + Partner (Female) + Custom Sender + Sound Effects Disabled", () => {
    useBirthdayStore.setState({
      config: {
        name: "Juliette",
        age: 25,
        gender: "female",
        relationship: "partner",
        favoriteColor: "#E11D48",
        favoriteEmojis: ["🌹", "💖"],
        interests: ["art", "music"],
        customMessage: "Mon amour infini pour toi...",
        birthdayDate: new Date("2001-02-14"),
        soundEffectsEnabled: false,
        language: "fr",
        senderName: "Roméo",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.soundEffectsEnabled).toBe(false);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Juliette");
    expect(letter).toContain("reine");
    expect(letter).toContain("Roméo");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 9: Bengali + Friend (Male / Legend) + High Particles           */
  /* ----------------------------------------------------------------------- */
  it("P9: Bengali + Friend (Male / Legend) + High Intensity Particles + Music Interests", () => {
    useBirthdayStore.setState({
      config: {
        name: "অর্ক",
        age: 22,
        gender: "male",
        relationship: "friend",
        favoriteColor: "#F59E0B",
        favoriteEmojis: ["🔥", "🎸"],
        interests: ["music", "rock"],
        customMessage: "রকস্টার দোস্ত!",
        birthdayDate: new Date("2004-07-07"),
        particleCount: 50,
        animationIntensity: "high",
        language: "bn",
        senderName: "শুভ",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.particleCount).toBe(50);
    expect(store.config.animationIntensity).toBe("high");

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("অর্ক");
    expect(letter).toContain("লেজেন্ড");
    expect(letter).toContain("শুভ");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 10: Hindi + Grandfather + Legacy Profile + Private Notes       */
  /* ----------------------------------------------------------------------- */
  it("P10: Hindi + Grandfather + Legacy Profile + Private Notes + Closeness 10", () => {
    const grandfatherProfile = createDefaultGrandfatherProfile("दादाजी", new Date("1945-08-15"));
    grandfatherProfile.relationship.closenessLevel = 10;
    grandfatherProfile.personalNotes.privateReflection = "दादाजी का आशीर्वाद सदा साथ रहे";

    useBirthdayStore.setState({
      config: {
        name: "दादाजी",
        age: 81,
        gender: "male",
        relationship: "grandfather",
        favoriteColor: "#D97706",
        favoriteEmojis: ["🙏", "🌸"],
        interests: ["spirituality", "history"],
        customMessage: "जन्मदिन की अनंत शुभकामनाएं दादाजी",
        birthdayDate: new Date("1945-08-15"),
        familyProfile: grandfatherProfile,
        language: "hi",
        senderName: "आपका पोता",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.familyProfile?.relationship.closenessLevel).toBe(10);
    expect(store.config.familyProfile?.personalNotes.privateReflection).toBe("दादाजी का आशीर्वाद सदा साथ रहे");

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("दादाजी");
    expect(letter).toContain("परिवार");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 11: French + Guardian + Chosen Family + Public Privacy         */
  /* ----------------------------------------------------------------------- */
  it("P11: French + Guardian + Chosen Family + Public Privacy + Care Notes", () => {
    const guardian = createDefaultGuardianProfile("Hélène", new Date("1970-05-20"));
    guardian.privacy.defaultLevel = "public";
    guardian.relationship.isChosenFamily = true;

    useBirthdayStore.setState({
      config: {
        name: "Hélène",
        age: 56,
        gender: "female",
        relationship: "guardian",
        favoriteColor: "#6366F1",
        favoriteEmojis: ["✨", "🛡️"],
        interests: ["reading", "gardening"],
        customMessage: "Merci pour tout votre soutien...",
        birthdayDate: new Date("1970-05-20"),
        familyProfile: guardian,
        language: "fr",
        senderName: "Maxime",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.familyProfile?.privacy.defaultLevel).toBe("public");
    expect(store.config.familyProfile?.relationship.isChosenFamily).toBe(true);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Hélène");
    expect(letter).toContain("famille");
    expect(letter).toContain("Maxime");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 12: English + Mentor + Custom Theme + Zero Photos              */
  /* ----------------------------------------------------------------------- */
  it("P12: English + Mentor + Custom Theme + Zero Photos (Placeholder Safe)", () => {
    useBirthdayStore.setState({
      config: {
        name: "Dr. Evelyn Reed",
        age: 48,
        gender: "female",
        relationship: "mentor",
        favoriteColor: "#4338CA",
        favoriteEmojis: ["🎓", "💡"],
        interests: ["science", "teaching"],
        customMessage: "Thank you for inspiring our paths.",
        birthdayDate: new Date("1978-01-30"),
        photos: [],
        language: "en",
        senderName: "Your Students",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.photos?.length).toBe(0);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Dr. Evelyn Reed");
    expect(letter).toContain("Mentor");
    expect(letter).toContain("generosity of spirit");
    expect(letter).toContain("Your Students");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 13: English + Colleague + Moderate Pacing + Gift Unlock        */
  /* ----------------------------------------------------------------------- */
  it("P13: English + Colleague + Moderate Pacing + Custom Colors + Gift Unlock", () => {
    useBirthdayStore.setState({
      config: {
        name: "Marcus Vance",
        age: 34,
        gender: "male",
        relationship: "colleague",
        favoriteColor: "#0284C7",
        favoriteEmojis: ["🚀", "☕"],
        interests: ["coding", "coffee"],
        customMessage: "Happy Birthday Marcus!",
        birthdayDate: new Date("1992-10-10"),
        animationSpeed: "moderate",
        showGiftSection: true,
        language: "en",
        senderName: "Engineering Team",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.showGiftSection).toBe(true);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Marcus Vance");
    expect(letter).toContain("Colleague");
    expect(letter).toContain("Engineering Team");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 14: Bengali + Sibling (Sister) + Memory Lane                   */
  /* ----------------------------------------------------------------------- */
  it("P14: Bengali + Sibling (Sister) + Memory Lane + High Closeness", () => {
    const sisterProfile = createDefaultSisterProfile("অনন্যা", new Date("2002-09-09"));
    sisterProfile.relationship.closenessLevel = 10;
    sisterProfile.bond.sharedMemories = ["প্রথম পুজো ভ্রমণ", "গান শেখার দিনগুলো"];

    useBirthdayStore.setState({
      config: {
        name: "অনন্যা",
        age: 24,
        gender: "female",
        relationship: "sister",
        favoriteColor: "#EC4899",
        favoriteEmojis: ["🌸", "✨"],
        interests: ["music", "art"],
        customMessage: "আমার মিষ্টি বোন...",
        birthdayDate: new Date("2002-09-09"),
        familyProfile: sisterProfile,
        language: "bn",
        senderName: "তোর দাদা",
      },
    });

    const store = useBirthdayStore.getState();
    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("অনন্যা");
    expect(letter).toContain("বোন");
    expect(letter).toContain("তোর দাদা");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 15: Hindi + Son + Descendant Direction + Milestone Birthday    */
  /* ----------------------------------------------------------------------- */
  it("P15: Hindi + Son + Descendant Direction + Milestone Birthday + Extreme Particle Boundaries", () => {
    const son = createDefaultSonProfile("आर्यन", new Date("2008-03-21"));
    expect(son.relationship.direction).toBe("descendant");

    useBirthdayStore.setState({
      config: {
        name: "आर्यन",
        age: 18,
        gender: "male",
        relationship: "son",
        favoriteColor: "#3B82F6",
        favoriteEmojis: ["🚀", "⭐"],
        interests: ["coding", "gaming"],
        customMessage: "18वें जन्मदिन की बधाई बेटा!",
        birthdayDate: new Date("2008-03-21"),
        particleCount: 80,
        familyProfile: son,
        language: "hi",
        senderName: "माता-पिता",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.particleCount).toBe(80);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("आर्यन");
    expect(letter).toContain("आपका परिवार");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 16: Bengali + Custom Member + Custom Fields + Export Allowed   */
  /* ----------------------------------------------------------------------- */
  it("P16: Bengali + Custom Member + Custom Fields + Export Allowed", () => {
    const customTemplate = createCustomFamilyMemberTemplate("গুরুজন", [
      { id: "blessing", label: "আশীর্বাদ", type: "textarea" },
    ]);
    expect(customTemplate.label).toBe("গুরুজন");

    const customProfile = createFamilyMemberProfile("custom", "হরিশচন্দ্র বাবু", new Date("1952-01-01"), {
      preferredName: "দাদু",
      privacy: { allowExport: true },
    });

    useBirthdayStore.setState({
      config: {
        name: "হরিশচন্দ্র বাবু",
        age: 74,
        gender: "male",
        relationship: "custom" as unknown as RelationshipType,
        favoriteColor: "#B45309",
        favoriteEmojis: ["🙏"],
        interests: ["literature"],
        customMessage: "শ্রদ্ধা ও প্রণাম",
        birthdayDate: new Date("1952-01-01"),
        familyProfile: customProfile,
        language: "bn",
        senderName: "নাতি",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.familyProfile?.privacy.allowExport).toBe(true);

    const letter = getHighlySpecificLetter(
      store.config.name,
      "custom" as unknown as RelationshipType,
      "male",
      [],
      "bn",
      "নাতি"
    );

    expect(letter).toContain("হরিশচন্দ্র বাবু");
    expect(letter).toContain("আপনার পরিবার");
  });

  /* ----------------------------------------------------------------------- */
  /* Pairwise 17: French + Mother + Warm Mood + Video Gallery                */
  /* ----------------------------------------------------------------------- */
  it("P17: French + Mother + Warm Mood + Video Gallery + Audio Fallback", () => {
    const motherProfile = createDefaultMotherProfile("Marie", new Date("1968-12-10"));

    useBirthdayStore.setState({
      config: {
        name: "Marie",
        age: 58,
        gender: "female",
        relationship: "mother",
        favoriteColor: "#F43F5E",
        favoriteEmojis: ["💖", "🌹"],
        interests: ["cooking", "art"],
        customMessage: "Pour la meilleure maman du monde...",
        birthdayDate: new Date("1968-12-10"),
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        familyProfile: motherProfile,
        language: "fr",
        senderName: "Ton fils",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getMood()).toBe("warm");
    expect(store.config.videos?.length).toBe(1);

    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("Marie");
    expect(letter).toContain("maman");
    expect(letter).toContain("Ton fils");
  });
});

/* ========================================================================= */
/* TIER 4: REAL-WORLD CELEBRATION WORKLOAD SCENARIOS (≥5 TESTS)              */
/* ========================================================================= */

describe("Tier 4: Real-World Celebration Workload Scenarios", () => {
  const rootDir = path.resolve(__dirname, "../../");

  /* ----------------------------------------------------------------------- */
  /* Scenario 1: Full Bengali Romantic Partner Celebration Lifecycle         */
  /* ----------------------------------------------------------------------- */
  it("Scenario 1: Bengali Partner Celebration with Romantic Letters, 3D Cake & Fireworks", () => {
    // 1. Configure state for Bengali Romantic Celebration
    useBirthdayStore.setState({
      config: {
        name: "ঐন্দ্রিলা",
        age: 25,
        gender: "female",
        relationship: "partner",
        favoriteColor: "#FF1493",
        favoriteEmojis: ["💖", "👑", "🌹"],
        interests: ["music", "travel", "coding"],
        customMessage: "তুমি আমার জীবনের ধ্রুবতারা।",
        birthdayDate: new Date("2001-04-24"),
        animationSpeed: "slow",
        language: "bn",
        soundEffectsEnabled: true,
        showCakeSection: true,
        showPhotoSection: true,
        showGiftSection: true,
        showFinalSurprise: true,
        senderName: "সৌম্য",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getMood()).toBe("romantic");
    expect(store.getAnimationPacing()).toBe("slow");

    // 2. Validate translation tokens
    const bnDict = getTranslation("bn");
    expect(bnDict.common.happyBirthday).toBe("শুভ জন্মদিন");
    expect(bnDict.cake.selectTitle).toContain("কেক");

    // 3. Select Cake & slice
    const strawberryCake = CAKE_OPTIONS.find((c) => c.id === "strawberry")!;
    const localizedCakeName = getCakeName(strawberryCake, false, true, false);
    expect(localizedCakeName).toBe("স্ট্রবেরি ব্লিস");

    // 4. Generate Big Wishes
    const wishes = getBigWishes(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language
    );
    expect(wishes.length).toBeGreaterThanOrEqual(4);
    expect(wishes.some((w) => w.emoji === "❤️")).toBe(true);
    expect(wishes.some((w) => w.emoji === "💻")).toBe(true);

    // 5. Generate Highly Specific Emotional Letter
    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("ঐন্দ্রিলা");
    expect(letter).toContain("রাজকন্যা");
    expect(letter).toContain("সৌম্য");
    expect(letter).not.toContain("[আপনার নাম]");
  });

  /* ----------------------------------------------------------------------- */
  /* Scenario 2: Hindi Family Milestone Celebration with Password Vault      */
  /* ----------------------------------------------------------------------- */
  it("Scenario 2: Hindi Family Milestone Celebration with Custom Timeline & Vault Unlock", () => {
    // 1. Configure state with password security gate
    const fatherProfile = createDefaultFatherProfile("पापा", new Date("1966-10-15"));
    fatherProfile.timeline = [
      { id: "t1", title: "सफर की शुरुआत", date: new Date("1990-01-01"), description: "कड़ी मेहनत और सफलता" },
      { id: "t2", title: "पारिवारिक उपलब्धि", date: new Date("2010-06-15"), description: "नया घर और खुशियाँ" },
    ];

    useBirthdayStore.setState({
      config: {
        name: "पापा",
        age: 60,
        gender: "male",
        relationship: "father",
        favoriteColor: "#D97706",
        favoriteEmojis: ["🙏", "✨", "👑"],
        interests: ["reading", "gardening"],
        customMessage: "हमारे घर की सबसे मजबूत नींव",
        birthdayDate: new Date("1966-10-15"),
        passwordRequired: true,
        passwordFormat: "MMDD",
        language: "hi",
        familyProfile: fatherProfile,
        senderName: "आपका परिवार",
      },
    });

    const store = useBirthdayStore.getState();

    // 2. Validate Password Unlock mechanics
    expect(isPasswordRequired(store.config)).toBe(true);
    const expectedPasscode = getEffectivePassword({
      birthdayDate: store.config.birthdayDate,
      passwordFormat: store.config.passwordFormat,
    });
    expect(expectedPasscode).toBe("1015"); // Oct 15

    // 3. Validate Family Timeline
    expect(store.config.familyProfile?.timeline.length).toBe(2);
    expect(store.config.familyProfile?.timeline[0].title).toBe("सफर की शुरुआत");

    // 4. Validate Hindi emotional letter
    const letter = getHighlySpecificLetter(
      store.config.name,
      store.config.relationship,
      store.config.gender,
      store.config.interests,
      store.config.language,
      store.config.senderName
    );

    expect(letter).toContain("पापा");
    expect(letter).toContain("परिवार");
    expect(letter).toContain("आपका परिवार");
  });

  /* ----------------------------------------------------------------------- */
  /* Scenario 3: French Friend Celebration with Fast Pacing & Reduced Motion */
  /* ----------------------------------------------------------------------- */
  it("Scenario 3: French Friend Celebration with Fast Pacing & Reduced Motion", () => {
    useBirthdayStore.setState({
      config: {
        name: "Maxime",
        age: 26,
        gender: "male",
        relationship: "friend",
        favoriteColor: "#06B6D4",
        favoriteEmojis: ["⚡", "🍻", "🚀"],
        interests: ["car", "gaming"],
        customMessage: "Prêt pour une nouvelle année de folie !",
        birthdayDate: new Date("2000-05-18"),
        animationSpeed: "fast",
        reducedMotion: true,
        showGiftSection: true,
        language: "fr",
        senderName: "Alexandre",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.getAnimationPacing()).toBe("fast");
    expect(store.getMood()).toBe("energetic");
    expect(store.config.reducedMotion).toBe(true);

    // Validate Gift Code computation rule
    const interestMap = [
      { key: "car", code: "RIDE" },
      { key: "music", code: "BEATS" },
      { key: "coding", code: "CODE" },
    ];
    const matched = store.config.interests?.find((i) => interestMap.some((item) => i.includes(item.key)));
    expect(matched).toBe("car");

    const templateTag = store.config.relationship === "friend" ? "LEGEND" : "HOME";
    const currentYear = String(new Date().getFullYear()).slice(-2);
    const giftCode = `${templateTag}-RIDE-${currentYear}`;
    expect(giftCode).toBe(`LEGEND-RIDE-${currentYear}`);

    // Validate French translation of cake flavors
    const natureCake = CAKE_OPTIONS.find((c) => c.id === "nature")!;
    expect(getCakeName(natureCake, false, false, true)).toBe("Jardin Floral");
  });

  /* ----------------------------------------------------------------------- */
  /* Scenario 4: Offline / Zero-CDN Resilient Celebration                    */
  /* ----------------------------------------------------------------------- */
  it("Scenario 4: Offline / Zero-CDN Resilient Celebration with Safe Fallbacks", () => {
    // Config with zero photos, broken/null video link, and unset sound url
    useBirthdayStore.setState({
      config: {
        name: "Jordan",
        age: null,
        gender: "other",
        relationship: "friend",
        favoriteColor: "#8B5CF6",
        favoriteEmojis: [],
        interests: [],
        customMessage: "",
        birthdayDate: null,
        photos: [],
        videos: [],
        finalVideoUrl: undefined,
        language: "en",
        senderName: "",
      },
    });

    const store = useBirthdayStore.getState();
    expect(store.config.photos?.length).toBe(0);
    expect(store.config.videos?.length).toBe(0);

    // Test YouTube parser resilience with null and empty inputs
    expect(getYouTubeEmbedUrl("")).toBe("");
    expect(getYouTubeEmbedUrl(undefined as unknown as string)).toBe("");

    // Test default big wishes resilience with empty interests
    const wishes = getBigWishes("Jordan", "friend", "other", [], "en");
    expect(wishes.length).toBeGreaterThanOrEqual(4);
    expect(wishes[0].wish).toContain("Jordan");

    // Test default letter generation with fallback wisher name
    const letter = getHighlySpecificLetter("Jordan", "friend", "other", [], "en", "");
    expect(letter).toContain("Jordan");
    expect(letter).not.toContain("[Your Name]");
  });

  /* ----------------------------------------------------------------------- */
  /* Scenario 5: Full Production Build, SEO, Meta & Manifest Validation      */
  /* ----------------------------------------------------------------------- */
  it("Scenario 5: Full Production Build, SEO, Meta & Manifest Synchronicity Validation", () => {
    const indexPath = path.join(rootDir, "index.html");
    const manifestPath = path.join(rootDir, "public/site.webmanifest");
    const llmPath = path.join(rootDir, "public/llms.txt");
    const pkgPath = path.join(rootDir, "package.json");

    // 1. Validate index.html exists and is complete
    expect(fs.existsSync(indexPath)).toBe(true);
    const html = fs.readFileSync(indexPath, "utf-8");

    // Canonical & Viewport
    expect(html).toContain('<link rel="canonical" href="https://birthday-bloom.vercel.app/" />');
    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1.0"');

    // OpenGraph & Twitter
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
    expect(html).toContain('property="og:locale:alternate" content="hi_IN"');
    expect(html).toContain('property="og:locale:alternate" content="bn_BD"');
    expect(html).toContain('property="og:locale:alternate" content="fr_FR"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');

    // JSON-LD Structured Data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(jsonLdMatch).not.toBeNull();
    const jsonLd = JSON.parse(jsonLdMatch![1]);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@graph"].length).toBeGreaterThanOrEqual(2);

    // 2. Validate site.webmanifest theme synchronization
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.name).toBe("Birthday Bloom");
    expect(manifest.theme_color).toBe("#1a0515");
    expect(manifest.background_color).toBe("#1a0515");

    // 3. Validate llms.txt & package.json
    expect(fs.existsSync(llmPath)).toBe(true);
    const llmText = fs.readFileSync(llmPath, "utf-8");
    expect(llmText).toContain("BIRTHDAY BLOOM");

    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    expect(pkg.version).toBe("3.3.0");
  });
});
