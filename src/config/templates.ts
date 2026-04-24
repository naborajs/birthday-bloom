/**
 * Enhanced Configuration System for Birthday Bloom v2.0
 * Supports multiple templates based on gender, age, relationship, and theme
 */

export type Gender = "male" | "female" | "other";
export type Relationship = "partner" | "friend" | "family" | "colleague" | "mentor";
export type TemplateTheme = "romantic" | "fun" | "energetic" | "elegant" | "playful" | "nostalgic";
export type AgeGroup = "teen" | "young-adult" | "adult" | "senior";

export interface BirthdayConfig {
  // Basic Information
  name: string;
  age: number;
  gender: Gender;
  relationship: Relationship;
  theme: TemplateTheme;

  // Personalization
  customMessage: string;
  favoriteColor: string;
  favoriteEmoji: string[];

  // Media
  photos: string[];
  backgroundMusic?: string;
  soundEffects: boolean;

  // Experience Settings
  animationIntensity: "low" | "medium" | "high";
  particleEffects: boolean;
  showSkipButton: boolean;
  duration: "quick" | "normal" | "extended";

  // Accessibility
  reducedMotion: boolean;
  textSize: "small" | "normal" | "large";
  highContrast: boolean;
}

/**
 * Template Presets
 * Automatically adjust messages, colors, emojis based on gender, age, and relationship
 */
export const TEMPLATE_PRESETS = {
  romantic: {
    female: {
      young_adult: {
        colors: ["#FF1493", "#FF69B4", "#FFB6C1"],
        emojis: ["💖", "✨", "💫", "🌹", "💝"],
        messageTemplate: "Happy Birthday Beautiful! 🌹",
        vibration: true,
      },
      adult: {
        colors: ["#DC143C", "#FF69B4", "#FF4500"],
        emojis: ["💕", "🌹", "✨", "💎", "👑"],
        messageTemplate: "Happy Birthday to the Love of My Life! 💕",
        vibration: true,
      },
    },
    male: {
      young_adult: {
        colors: ["#1E90FF", "#00CED1", "#FFD700"],
        emojis: ["💙", "✨", "🎊", "⭐", "🚀"],
        messageTemplate: "Happy Birthday Legend! 🎉",
        vibration: true,
      },
      adult: {
        colors: ["#0047AB", "#1E90FF", "#FF6347"],
        emojis: ["💙", "⭐", "🎯", "👑", "💪"],
        messageTemplate: "Happy Birthday King! 👑",
        vibration: true,
      },
    },
  },
  fun: {
    friend: {
      teen: {
        colors: ["#00FF00", "#00FFFF", "#FF00FF"],
        emojis: ["😎", "🍻", "🎮", "🎸", "🔥"],
        messageTemplate: "Hey Birthday Buddy! Let's Party! 🎉",
        vibration: true,
      },
      young_adult: {
        colors: ["#FFD700", "#FF6347", "#00CED1"],
        emojis: ["🥳", "🍕", "🎊", "🎈", "⭐"],
        messageTemplate: "Another Year Older, Still Awesome! 🎉",
        vibration: true,
      },
    },
  },
  family: {
    young_adult: {
      colors: ["#FFD700", "#FF69B4", "#87CEEB"],
      emojis: ["👨‍👩‍👧‍👦", "❤️", "🎂", "🎁", "✨"],
      messageTemplate: "Happy Birthday to Our Precious One! 🎉",
      vibration: true,
    },
    adult: {
      colors: ["#8B4513", "#DAA520", "#CD5C5C"],
      emojis: ["❤️", "👪", "🎂", "✨", "🌟"],
      messageTemplate: "Happy Birthday to Our Beloved! 💕",
      vibration: true,
    },
  },
};

/**
 * Default Configuration
 */
export const DEFAULT_CONFIG: BirthdayConfig = {
  name: "YOU",
  age: 25,
  gender: "other",
  relationship: "friend",
  theme: "fun",
  customMessage: "Have an Amazing Birthday! 🎉",
  favoriteColor: "#FF6B6B",
  favoriteEmoji: ["🎉", "✨", "🎊", "🎈", "🥳"],
  photos: [
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  ],
  soundEffects: true,
  animationIntensity: "high",
  particleEffects: true,
  showSkipButton: true,
  duration: "normal",
  reducedMotion: false,
  textSize: "normal",
  highContrast: false,
};

/**
 * Color Palettes for Different Templates
 */
export const COLOR_PALETTES = {
  romantic: {
    primary: "#FF1493",
    secondary: "#FFB6C1",
    accent: "#FF69B4",
    light: "#FFE4E1",
    dark: "#8B0A50",
  },
  fun: {
    primary: "#FFD700",
    secondary: "#FF6347",
    accent: "#00CED1",
    light: "#FFFACD",
    dark: "#FF4500",
  },
  energetic: {
    primary: "#FF4500",
    secondary: "#00FF00",
    accent: "#00FFFF",
    light: "#FFE4B5",
    dark: "#DC143C",
  },
  elegant: {
    primary: "#C0C0C0",
    secondary: "#DAA520",
    accent: "#696969",
    light: "#F5F5DC",
    dark: "#2F4F4F",
  },
  playful: {
    primary: "#FF69B4",
    secondary: "#00FFFF",
    accent: "#FFD700",
    light: "#FFEFD5",
    dark: "#FF1493",
  },
  nostalgic: {
    primary: "#8B4513",
    secondary: "#DAA520",
    accent: "#CD5C5C",
    light: "#F5DEB3",
    dark: "#654321",
  },
};

/**
 * Message Templates by Gender, Age, and Relationship
 */
export const MESSAGE_TEMPLATES = {
  romantic_female_young: "Happy Birthday Beautiful! You make every day special. 💖",
  romantic_female_adult:
    "Happy Birthday to the Love of My Life! Forever grateful for you. 💕",
  romantic_male_young: "Happy Birthday Legend! Can't wait to celebrate with you. 💙",
  romantic_male_adult: "Happy Birthday King! You mean everything to me. 👑",
  fun_friend_teen: "Hey Birthday Buddy! Time to make some epic memories! 🎉",
  fun_friend_young:
    "Another year older, still awesome! Let's party like we're 21! 🥳",
  fun_colleague: "Happy Birthday! Cheers to another year of collaboration! 🎊",
  family_child: "Happy Birthday to our Precious One! We love you so much! 🎂",
  family_adult: "Happy Birthday to our Beloved! You make us so proud! ❤️",
  family_senior:
    "Happy Birthday to our Wonderful Parent! Thank you for everything! 🌟",
};
