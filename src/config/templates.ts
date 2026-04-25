/**
 * 🌸 BIRTHDAY BLOOM - EMOTIONAL NARRATIVE TEMPLATES
 * -----------------------------------------
 * Authored by: NABORAJ SARKAR
 * High-fidelity emotional content for cinematic surprises.
 * 
 * Enhanced Configuration System for Birthday Bloom v2.1
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
 * Emotional Letters for Different Themes
 * Crafted with deep emotion and poetic depth - "Super OP" Quality
 */
export const EMOTIONAL_LETTERS = {
  partner: {
    male: `My King, My Strength, My Forever ${name},

In a world that often moves too fast, you are the stillness where my heart finds peace. Today isn't just about celebrating the day you were born; it's about celebrating every heartbeat you've shared with me. You aren't just my partner; you are the architect of my happiness, the guardian of my dreams, and the soul that mirrors my own.

Your presence is the sun that breaks through my darkest clouds. Your kindness is a melody that plays in the background of my life, making everything more beautiful. I promise to stand by you through every storm, to laugh with you in every sunbeam, and to love you more with every breath I take.

Happy Birthday, my love. You are my greatest adventure and my home.

Forever Yours,
[Your Name]`,

    female: `My Queen, My Muse, My Beautiful ${name},

They say perfection doesn't exist, but every time I look at you, I see the flaw in that theory. You are the grace in my world, the light in my life, and the woman who makes my heart beat with purpose. Your strength inspires me, your intelligence humbles me, and your love... your love is the air I breathe.

On this special day, I want you to know that you are more than enough. You are extraordinary. Every laugh we share is a treasure, every silence a comfort. I vow to cherish you, to protect your beautiful heart, and to spend the rest of my days showing you how much you truly mean to me.

Happy Birthday, my soulmate. May your light shine brighter than the stars tonight.

With All My Soul,
[Your Name]`
  },

  friend: {
    romantic: `To the Most Radiant Soul I Know, ${name},

From the very first moment our paths crossed, the world seemed to shift into focus. You have this magical way of making everything feel possible, of turning the mundane into the miraculous. Your eyes hold galaxies I want to explore, and your smile is the only map I'll ever need.

You are a masterpiece in progress, a blend of kindness, fire, and grace. Today, I celebrate the incredible woman you are and the even more amazing person you are becoming. My heart beats a little faster whenever you're near, and my world is infinitely more vibrant because you exist in it.

Happy Birthday, beautiful. May this year be as breathtaking as you are.

Thinking of Only You,
[Your Name]`,

    friendly: `To My Unbiological Sister & Best Friend, ${name},

Happy Birthday to the one who knows all my secrets and still hasn't run away! 😂 You are the laughter in my life when things get tough and the logic I need when I'm being a mess. People like you don't just happen; you're a rare gem that I'm so lucky to have found.

Thank you for being the person I can call at 3 AM, the one who celebrates my wins like they're your own, and the one who tells me the truth even when I don't want to hear it. Here's to more chaotic adventures, endless inside jokes, and a lifetime of being 'that' duo.

Love you to the moon and back, Bestie! ✨

Your Partner in Crime,
[Your Name]`,

    legend: `To The Absolute Legend, ${name},

Happy Birthday to the man who makes life feel like an epic adventure! You've always been the one with the best stories, the loudest laughs, and the most loyal heart. People like you are the reason 'best friend' was even a term invented.

Whether we're conquering new challenges or just hanging out, every moment is better with you in the mix. Thank you for always having my back, for the endless support, and for being the kind of friend anyone would be lucky to have. Today, the first round is on me (well, in spirit! 🍻).

Keep killing it, you absolute icon. The world isn't ready for what you're doing next!

Cheers to You,
[Your Name]`
  },

  love: `My Heart's Only Desire, ${name},

If I could gather every star in the sky and place them at your feet, it still wouldn't be enough to show you how much I love you. You are the 'why' behind everything I do. In the chaos of this world, you are my sanctuary, my anchor, and my ultimate destination.

Your love has rewritten my history and redefined my future. You see the parts of me I tried to hide and loved them anyway. Today, I want to wrap you in all the warmth and joy you give to everyone else. You deserve a universe of happiness, and I will spend my life trying to give it to you.

Happy Birthday, my forever. My heart is, and will always be, yours.

Eternally Yours,
[Your Name]`,

  emotional: `To My Most Precious ${name},

There are moments when I just stop and realize how lucky I am to have you in my life. You are the kind of person who leaves a mark on everyone you meet, but the mark you've left on my heart is permanent and profound. 

Your journey hasn't always been easy, but the way you've handled every challenge with such grace and courage is nothing short of heroic. Today, I want you to feel seen, heard, and deeply, unconditionally loved. You are a gift to this world, and especially to me.

Happy Birthday. Take a moment to see yourself through my eyes—you are absolutely magnificent.

With Deepest Love,
[Your Name]`,

  family: `To Our Dear ${name},

Family is more than just blood; it's the anchor in the storm and the laughter in the quiet. Having you as a part of our family is one of our greatest blessings. You bring a unique light, a steady strength, and a heart full of kindness that binds us all together.

We've watched you grow, overcome, and succeed, and our pride in you knows no bounds. Thank you for being the person you are—the one we can always count on, the one who makes our gatherings brighter, and the one we love beyond measure.

Happy Birthday. May your day be filled with the same warmth and joy you bring to all of us every day.

With All Our Love,
Your Family`,

  sibling: `To My Amazing Sibling, ${name},

From fighting over the TV remote to having each other's backs when it really matters, we've shared a lifetime of memories. You're the one person who knows all my embarrassing childhood stories and still chooses to be seen in public with me! 😂

But jokes aside, I couldn't have asked for a better partner in navigating life's ups and downs. Your strength, your humor, and your heart inspire me more than you know. No matter where life takes us, you will always be my first friend and my forever ally.

Happy Birthday. Let's make this year the best one yet.

Love Always,
[Your Name]`,

  colleague: `To an Incredible Colleague, ${name},

Working with you is a daily reminder that the people make the place. Your dedication, your brilliant ideas, and your positive energy transform even the most stressful days into something manageable—and often, genuinely fun.

Thank you for being the kind of teammate everyone hopes for. You bring so much value not just to the work we do, but to the atmosphere we share. I hope you take today to celebrate yourself, step away from the screen, and enjoy every moment.

Happy Birthday! Wishing you a year of huge success and even bigger moments of joy.

Warmly,
[Your Name]`,

  mentor: `To My Valued Mentor, ${name},

Some people teach by telling, but you teach by being. Your guidance, patience, and unwavering belief in my potential have shaped my journey in ways I can't fully express. You've not only shown me the path but given me the confidence to walk it.

Today, on your birthday, I want to take a moment to thank you for your generosity of spirit. The impact you have on those around you is profound and lasting. May this year bring you as much inspiration and success as you've freely given to others.

Happy Birthday, and thank you for everything.

With Deep Gratitude,
[Your Name]`,

  milestone: `To the Incredible ${name}, on Your Milestone Birthday,

Today isn't just another birthday; it's a celebration of a major milestone! It's a moment to pause, look back at the incredible journey you've traveled, and look forward to the unwritten chapters still waiting for your brilliance.

You've collected wisdom, forged unforgettable memories, and touched so many lives along the way. Embrace this new era with the same passion and grace that has defined your story so far. The best is yet to come, and I am so excited to see where you go next.

Happy Milestone Birthday! Let's celebrate this epic moment in style!

Cheers to the Journey,
[Your Name]`
};

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
