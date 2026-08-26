import type { BirthdayConfig, RelationshipType } from "@/features/core/store/useBirthdayStore";
export interface TemplateEmojiKit {
    relationship: RelationshipType;
    signature: string[];
    cursor: string[];
    floating: string[];
    celebration: string[];
    accent: string[];
    chat: {
        avatar: string;
        greeting: string;
        followup: string;
        status: string;
    };
    labels: {
        cake: string;
        gift: string;
        party: string;
        sparkle: string;
        message: string;
        photo: string;
        hype: string;
        close: string;
    };
    captions: string[];
}
const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const emojiKeywordMap: Record<string, string> = {
    heart: "💖",
    hearts: "💕",
    love: "🥰",
    sparkle: "✨",
    sparkles: "✨",
    rose: "🌹",
    roses: "🌹",
    flower: "🌸",
    flowers: "🌸",
    butterfly: "🦋",
    butterflies: "🦋",
    star: "⭐",
    stars: "✨",
    fire: "🔥",
    kiss: "😘",
    cupid: "💘",
    gift: "🎁",
    cake: "🎂",
    balloon: "🎈",
    balloons: "🎈",
    party: "🎉",
    celebrate: "🥳",
    crown: "👑",
    queen: "👑",
    king: "👑",
    diamond: "💎",
    ring: "💍",
    teddy: "🧸",
    bear: "🧸",
    cat: "🐱",
    dog: "🐶",
    sun: "☀️",
    moon: "🌙",
    rocket: "🚀",
    smile: "😊",
    music: "🎵",
    notes: "🎶",
    magic: "🪄",
    tulip: "🌷",
    ribbon: "🎀",
    letter: "💌",
};

export const normalizeToEmoji = (input: string): string => {
    if (!input || !input.trim()) return "";
    const trimmed = input.trim();
    if (/\p{Extended_Pictographic}/u.test(trimmed)) {
        return trimmed;
    }
    const lower = trimmed.toLowerCase();
    return emojiKeywordMap[lower] || "";
};

const interestEmojiMap: Record<string, string[]> = {
    car: ["🚗", "🏎️", "⚙️", "🏁", "🏆"],
    music: ["🎵", "🎶", "🎸", "🎹", "🎧", "🎤"],
    art: ["🎨", "🖌️", "🖼️", "✨", "🌈"],
    coding: ["💻", "⌨️", "🚀", "⚡", "👾"],
    nature: ["🌿", "🌸", "🦋", "🍄", "🌙", "⭐"],
    travel: ["✈️", "🗺️", "🏔️", "🏝️", "🗼", "🗽"],
    food: ["🍕", "🍔", "🍣", "🍦", "🍩", "🧁"],
    sport: ["⚽", "🏀", "🎾", "⛳", "🏆", "🏃"],
    space: ["🚀", "🪐", "🛸", "☄️", "🌌", "👽"],
};
const birthdayBase = ["🎂", "🎉", "🎊", "🎈", "🎁", "🥳", "✨", "🌟"];
const kits: Record<RelationshipType, Omit<TemplateEmojiKit, "relationship">> = {
    partner: {
        signature: ["💖", "💕", "💞", "🌹", "✨", "💫"],
        cursor: ["💖", "💕", "🌹", "✨", "💫"],
        floating: ["💖", "🌹", "✨", "💫", "🎀", "💝"],
        celebration: ["💖", "💕", "💝", "🌹", "🎂", "✨", "💫"],
        accent: ["💌", "🌹", "✨"],
        chat: {
            avatar: "💖",
            greeting: "Hey my love... 💖",
            followup: "I stayed up late thinking about you... ✨",
            status: "typing love notes...",
        },
        labels: {
            cake: "🎂",
            gift: "💝",
            party: "💕",
            sparkle: "✨",
            message: "💌",
            photo: "🌹",
            hype: "Love glow",
            close: "💖",
        },
        captions: [
            "Every moment with you is a gift 💖",
            "Building our beautiful future ✨",
            "My heart's favorite place 🌹",
        ],
    },
    friend: {
        signature: ["🎉", "😎", "🚀", "🍕", "⭐", "🔥"],
        cursor: ["🎉", "😎", "🚀", "⭐", "🔥"],
        floating: ["🎉", "😎", "🎈", "⭐", "🍕", "🔥"],
        celebration: ["🎉", "🥳", "🎊", "🚀", "⭐", "🔥", "🎂"],
        accent: ["🚀", "🔥", "⭐"],
        chat: {
            avatar: "😎",
            greeting: "Yoooo! 👋",
            followup: "Prepare yourself for something epic... 🚀",
            status: "setting up the vibe...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⭐",
            message: "🚀",
            photo: "📸",
            hype: "Crowd hype",
            close: "😎",
        },
        captions: [
            "Legendary times with the MVP 🚀",
            "Making memories and wild stories 😎",
            "Stay epic, stay you! 🔥",
        ],
    },
    family: {
        signature: ["🎂", "🎁", "🌟", "💛", "✨", "🎈"],
        cursor: ["🎂", "🎁", "🌟", "✨", "🎈"],
        floating: ["✨", "🌟", "💛", "🌸", "🎈", "🎁"],
        celebration: birthdayBase,
        accent: ["🌟", "💛", "✨"],
        chat: {
            avatar: "🎈",
            greeting: "Hi there! ✨",
            followup: "I have a special surprise for you...",
            status: "sending warm vibes...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "💌",
            photo: "📸",
            hype: "Family glow",
            close: "🌟",
        },
        captions: [
            "Family is where life begins ✨",
            "Cherishing every smile 💛",
            "A journey filled with love 🌟",
        ],
    },
    sibling: {
        signature: ["🎮", "🏆", "😂", "🎂", "⚡", "🎉"],
        cursor: ["🎮", "🏆", "😂", "⚡", "🎉"],
        floating: ["🎮", "🏆", "😂", "⚡", "🎈", "🎁"],
        celebration: ["🎉", "🎮", "🏆", "🥳", "⚡", "🎂"],
        accent: ["🏆", "⚡", "😂"],
        chat: {
            avatar: "🎮",
            greeting: "Sibling alert! 🎮",
            followup: "This surprise comes with lifetime teasing rights...",
            status: "loading sibling chaos...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⚡",
            message: "🏆",
            photo: "📸",
            hype: "Sibling hype",
            close: "😂",
        },
        captions: [
            "Same roots, endless stories 🎮",
            "Built on memories and mischief 😂",
            "Forever teammate energy 🏆",
        ],
    },
    brother: {
        signature: ["🏆", "😎", "🔥", "🎮", "⚡", "🎂"],
        cursor: ["🏆", "😎", "🔥", "⚡", "🎮"],
        floating: ["🏆", "😎", "🔥", "🎮", "⚡", "🎈"],
        celebration: ["🎉", "🏆", "🔥", "🥳", "🎮", "🎂"],
        accent: ["🏆", "🔥", "⚡"],
        chat: {
            avatar: "🏆",
            greeting: "Bro, big day alert! 🏆",
            followup: "This one had to be legendary...",
            status: "building brother-level hype...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⚡",
            message: "🏆",
            photo: "📸",
            hype: "Bro hype",
            close: "🔥",
        },
        captions: [
            "Built different since day one 🏆",
            "Brotherhood, jokes, and big wins 🔥",
            "Forever the family legend 😎",
        ],
    },
    sister: {
        signature: ["🌸", "💫", "👑", "🎀", "✨", "🎂"],
        cursor: ["🌸", "💫", "👑", "🎀", "✨"],
        floating: ["🌸", "💫", "👑", "🎀", "✨", "🎈"],
        celebration: ["🎉", "🌸", "👑", "🥳", "💫", "🎂"],
        accent: ["🌸", "👑", "✨"],
        chat: {
            avatar: "🌸",
            greeting: "Sister sparkle incoming! 🌸",
            followup: "You deserve something as iconic as you...",
            status: "polishing sister magic...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "💌",
            photo: "📸",
            hype: "Sister sparkle",
            close: "👑",
        },
        captions: [
            "Grace, laughter, and sister magic 🌸",
            "Every memory shines brighter with you ✨",
            "The family star in full bloom 👑",
        ],
    },
    father: {
        signature: ["🏡", "🌟", "💙", "🏆", "🎂", "✨"],
        cursor: ["🏡", "🌟", "💙", "🏆", "✨"],
        floating: ["🏡", "🌟", "💙", "🏆", "🎈", "🎁"],
        celebration: ["🎉", "🏆", "💙", "🎂", "🌟", "🎁"],
        accent: ["🏆", "💙", "🌟"],
        chat: {
            avatar: "🏆",
            greeting: "For the man who holds us steady 🌟",
            followup: "Today is all about celebrating you...",
            status: "sending respect and love...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "🌟",
            message: "💙",
            photo: "📸",
            hype: "Family pride",
            close: "🏆",
        },
        captions: [
            "Strength, warmth, and endless guidance 💙",
            "The steady heart of the family 🌟",
            "Celebrating every lesson and laugh 🏆",
        ],
    },
    mother: {
        signature: ["💐", "🌷", "💛", "🌟", "🎂", "✨"],
        cursor: ["💐", "🌷", "💛", "🌟", "✨"],
        floating: ["💐", "🌷", "💛", "🌟", "🎈", "🎁"],
        celebration: ["🎉", "💐", "💛", "🎂", "🌟", "🎁"],
        accent: ["💐", "💛", "🌟"],
        chat: {
            avatar: "💐",
            greeting: "For the heart of everything 💐",
            followup: "You deserve the softest, brightest surprise...",
            status: "sending warmth and gratitude...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "🌟",
            message: "💛",
            photo: "📸",
            hype: "Warmth blooms",
            close: "💐",
        },
        captions: [
            "Love that makes every place feel home 💐",
            "Every smile carries your warmth 💛",
            "Celebrating the heart of our world 🌟",
        ],
    },
    grandfather: {
        signature: ["🌳", "📖", "🏅", "💛", "🎂", "✨"],
        cursor: ["🌳", "📖", "🏅", "💛", "✨"],
        floating: ["🌳", "📖", "🏅", "💛", "🎈", "✨"],
        celebration: ["🎉", "🌳", "🏅", "🎂", "💛", "🎁"],
        accent: ["🌳", "🏅", "💛"],
        chat: {
            avatar: "🌳",
            greeting: "A story worth celebrating 🌳",
            followup: "Your wisdom deserves a beautiful moment...",
            status: "honoring a lifetime of love...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "📖",
            photo: "📸",
            hype: "Legacy glow",
            close: "🏅",
        },
        captions: [
            "A lifetime of stories and strength 🌳",
            "Wisdom wrapped in warmth 📖",
            "Legacy shining bright today 🏅",
        ],
    },
    grandmother: {
        signature: ["🌼", "🕯️", "💛", "🧁", "🎂", "✨"],
        cursor: ["🌼", "🕯️", "💛", "🧁", "✨"],
        floating: ["🌼", "🕯️", "💛", "🧁", "🎈", "✨"],
        celebration: ["🎉", "🌼", "🧁", "🎂", "💛", "🎁"],
        accent: ["🌼", "🧁", "💛"],
        chat: {
            avatar: "🌼",
            greeting: "A little bloom for you 🌼",
            followup: "Your love makes every memory sweeter...",
            status: "wrapping this in tenderness...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "💛",
            photo: "📸",
            hype: "Tender glow",
            close: "🌼",
        },
        captions: [
            "Sweetness, stories, and endless care 🌼",
            "The softest love in every memory 💛",
            "Celebrating your beautiful light 🧁",
        ],
    },
    uncle: {
        signature: ["🎩", "😄", "🏆", "🎉", "🎂", "✨"],
        cursor: ["🎩", "😄", "🏆", "🎉", "✨"],
        floating: ["🎩", "😄", "🏆", "🎈", "🎁", "✨"],
        celebration: ["🎉", "🎩", "🏆", "🥳", "🎂", "✨"],
        accent: ["🎩", "🏆", "😄"],
        chat: {
            avatar: "🎩",
            greeting: "Uncle celebration mode is on 🎩",
            followup: "This surprise needed your signature style...",
            status: "cueing the family cheers...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "🏆",
            photo: "📸",
            hype: "Family cheers",
            close: "🎩",
        },
        captions: [
            "Style, laughs, and family stories 🎩",
            "Always bringing the good energy 😄",
            "Celebrating a family favorite 🏆",
        ],
    },
    aunt: {
        signature: ["🌺", "💃", "💛", "🎉", "🎂", "✨"],
        cursor: ["🌺", "💃", "💛", "🎉", "✨"],
        floating: ["🌺", "💃", "💛", "🎈", "🎁", "✨"],
        celebration: ["🎉", "🌺", "💃", "🥳", "🎂", "✨"],
        accent: ["🌺", "💃", "💛"],
        chat: {
            avatar: "🌺",
            greeting: "Auntie sparkle is live 🌺",
            followup: "This day needs your kind of joy...",
            status: "setting the celebration glow...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "✨",
            message: "💛",
            photo: "📸",
            hype: "Joy glow",
            close: "🌺",
        },
        captions: [
            "Warmth, style, and joy in motion 🌺",
            "Every memory has your sparkle ✨",
            "Celebrating your beautiful energy 💃",
        ],
    },
    cousin: {
        signature: ["🎮", "🎉", "😂", "⚡", "🎂", "✨"],
        cursor: ["🎮", "🎉", "😂", "⚡", "✨"],
        floating: ["🎮", "🎉", "😂", "⚡", "🎈", "🎁"],
        celebration: ["🎉", "🎮", "😂", "🥳", "🎂", "⚡"],
        accent: ["🎮", "😂", "⚡"],
        chat: {
            avatar: "🎮",
            greeting: "Cousin chaos loading 🎮",
            followup: "Obviously this had to be fun...",
            status: "charging up cousin energy...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⚡",
            message: "😂",
            photo: "📸",
            hype: "Cousin energy",
            close: "🎮",
        },
        captions: [
            "Family, friendship, and perfect chaos 🎮",
            "The cousin stories never miss 😂",
            "More memories, more energy, more fun ⚡",
        ],
    },
    son: {
        signature: ["🚀", "🏆", "💙", "⭐", "🎂", "✨"],
        cursor: ["🚀", "🏆", "💙", "⭐", "✨"],
        floating: ["🚀", "🏆", "💙", "⭐", "🎈", "🎁"],
        celebration: ["🎉", "🚀", "🏆", "🎂", "⭐", "🎁"],
        accent: ["🚀", "🏆", "💙"],
        chat: {
            avatar: "🚀",
            greeting: "For our star today 🚀",
            followup: "Watching you grow is the real gift...",
            status: "launching birthday pride...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⭐",
            message: "💙",
            photo: "📸",
            hype: "Proud launch",
            close: "🚀",
        },
        captions: [
            "Growing brighter every year 🚀",
            "Proud of every step you take 🏆",
            "Our star, our joy, our celebration ⭐",
        ],
    },
    daughter: {
        signature: ["🌈", "👑", "💖", "⭐", "🎂", "✨"],
        cursor: ["🌈", "👑", "💖", "⭐", "✨"],
        floating: ["🌈", "👑", "💖", "⭐", "🎈", "🎁"],
        celebration: ["🎉", "🌈", "👑", "🎂", "⭐", "🎁"],
        accent: ["🌈", "👑", "💖"],
        chat: {
            avatar: "🌈",
            greeting: "For our brightest light 🌈",
            followup: "You make every year more beautiful...",
            status: "sprinkling pride and joy...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⭐",
            message: "💖",
            photo: "📸",
            hype: "Proud sparkle",
            close: "👑",
        },
        captions: [
            "Bright, brave, and beautifully you 🌈",
            "Every memory shines with your joy 💖",
            "Celebrating our star today 👑",
        ],
    },
    guardian: {
        signature: ["🛡️", "🌟", "💛", "🏡", "🎂", "✨"],
        cursor: ["🛡️", "🌟", "💛", "🏡", "✨"],
        floating: ["🛡️", "🌟", "💛", "🏡", "🎈", "🎁"],
        celebration: ["🎉", "🛡️", "🌟", "🎂", "💛", "🎁"],
        accent: ["🛡️", "🌟", "💛"],
        chat: {
            avatar: "🛡️",
            greeting: "For the one who shows up always 🛡️",
            followup: "Your care deserves the whole spotlight...",
            status: "honoring steady love...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "🌟",
            message: "💛",
            photo: "📸",
            hype: "Gratitude glow",
            close: "🛡️",
        },
        captions: [
            "Protection, patience, and deep care 🛡️",
            "A home found in your kindness 🏡",
            "Celebrating steady love today 🌟",
        ],
    },
    colleague: {
        signature: ["🚀", "💼", "⭐", "🎯", "🎂", "✨"],
        cursor: ["🚀", "💼", "⭐", "🎯", "✨"],
        floating: ["🚀", "💼", "⭐", "🎯", "🎈", "🎁"],
        celebration: ["🎉", "🚀", "💼", "🎂", "⭐", "🎁"],
        accent: ["🚀", "💼", "🎯"],
        chat: {
            avatar: "🚀",
            greeting: "Big birthday energy at work 🚀",
            followup: "Today the calendar belongs to you...",
            status: "syncing celebration mode...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "⭐",
            message: "💼",
            photo: "📸",
            hype: "Team cheers",
            close: "🚀",
        },
        captions: [
            "Great work, better vibes 🚀",
            "Team memories worth celebrating 💼",
            "Another year of wins ahead 🎯",
        ],
    },
    mentor: {
        signature: ["📚", "🌟", "🧭", "🏅", "🎂", "✨"],
        cursor: ["📚", "🌟", "🧭", "🏅", "✨"],
        floating: ["📚", "🌟", "🧭", "🏅", "🎈", "🎁"],
        celebration: ["🎉", "📚", "🧭", "🎂", "🌟", "🎁"],
        accent: ["📚", "🧭", "🌟"],
        chat: {
            avatar: "📚",
            greeting: "For the guide who changed the path 📚",
            followup: "Your impact deserves a bright celebration...",
            status: "sending gratitude and respect...",
        },
        labels: {
            cake: "🎂",
            gift: "🎁",
            party: "🎉",
            sparkle: "🌟",
            message: "📚",
            photo: "📸",
            hype: "Respect glow",
            close: "🧭",
        },
        captions: [
            "Guidance that keeps shining 📚",
            "Every lesson became a light 🧭",
            "Celebrating your lasting impact 🌟",
        ],
    },
};
export const getTemplateEmojiKit = (config: BirthdayConfig): TemplateEmojiKit => {
    const relationship = config.relationship ?? "family";
    const base = kits[relationship] ?? kits.family;
    const isFemale = config.gender === "female";
    const isMale = config.gender === "male";

    // Normalize any text emoji keywords (e.g. 'heart', 'butterfly', 'rose') into real emojis
    const custom = (config.favoriteEmojis ?? []).map(normalizeToEmoji).filter(Boolean);

    const interestEmojis = (config.interests ?? []).flatMap((interest) => {
        const normalized = interest.toLowerCase().trim();
        const match = Object.keys(interestEmojiMap).find((key) => normalized.includes(key));
        return match ? interestEmojiMap[match] : [];
    });

    if (relationship === "partner") {
        const partnerFloating = isFemale
            ? ["💖", "💕", "💞", "🌹", "🦋", "✨", "🌸", "🥰", "💝", "🌷", "🎀", "💌"]
            : isMale
            ? ["💖", "💕", "💞", "🌹", "✨", "⭐", "💫", "🥰", "💝", "👑", "💌"]
            : ["💖", "💕", "💞", "🌹", "✨", "💫", "🥰", "💝", "🎀", "💌"];

        return {
            relationship: "partner",
            ...base,
            signature: unique([...custom, ...base.signature, ...partnerFloating, ...interestEmojis, ...birthdayBase]),
            cursor: unique([...custom, ...base.cursor, "💖", "💕", "🌹", "✨", "🦋"]),
            floating: unique([...custom, ...partnerFloating]),
            celebration: unique([...custom, ...base.celebration, "💖", "💕", "🌹", "🎂", "✨", "🎉", ...interestEmojis]),
            accent: unique([...base.accent, ...custom, "💌", "🌹", "✨", "💖"]),
        };
    }

    return {
        relationship,
        ...base,
        signature: unique([...custom, ...base.signature, ...interestEmojis, ...birthdayBase]),
        cursor: unique([...custom, ...base.cursor, ...interestEmojis, ...base.signature]),
        floating: unique([...custom, ...base.floating, ...(relationship === "friend" ? interestEmojis : []), ...base.signature]),
        celebration: unique([...custom, ...base.celebration, ...interestEmojis, ...birthdayBase]),
        accent: unique([...base.accent, ...custom, ...interestEmojis]),
    };
};
export const pickTemplateEmoji = (items: string[]) => items[Math.floor(Math.random() * items.length)] ?? "✨";
