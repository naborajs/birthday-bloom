import type { RelationshipType } from "@/features/core/store/useBirthdayStore";

export interface StoryCopy {
    initialWish: string;
    reconsiderThought: string;
    linkSubtitle: string;
}

/**
 * Returns relationship-, person-, language-, and ENV-aware copy for the Fake Chat typing sequence.
 * Fully adapts across 18 relationship types, gender identities, custom ENV messages,
 * and 4 supported languages (English, Bengali, Hindi, French).
 */
export function getStoryCopy(
    relationship: RelationshipType,
    name: string,
    gender: "male" | "female" | "other",
    isHindi: boolean,
    isBengali: boolean,
    isFrench: boolean,
    customMessage?: string,
    senderName?: string
): StoryCopy {
    const isMale = gender === "male";
    const isFemale = gender === "female";
    const targetName = name?.trim() || "";
    const cleanCustomMsg = customMessage?.trim();
    const cleanSender = senderName?.trim();

    const copy = ((): StoryCopy => {
        // ══════════════════════════════════════════════════════════════
        // 1. FRENCH (fr)
        // ══════════════════════════════════════════════════════════════
        if (isFrench) {
        if (cleanCustomMsg) {
            return {
                initialWish: cleanCustomMsg.includes("🎂") ? cleanCustomMsg : `${cleanCustomMsg} 🎂`,
                reconsiderThought: targetName
                    ? `Oh non, un simple texto pour ${targetName} ne suffira jamais... ✨`
                    : "Oh non, un simple texto ne suffira jamais pour une personne si spéciale... ✨",
                linkSubtitle: cleanSender
                    ? `Créé avec tout l'amour de ${cleanSender} spécialement pour toi ❤️`
                    : "Une expérience d'anniversaire magique créée spécialement pour toi ❤️",
            };
        }

        if (relationship === "partner") {
            return {
                initialWish: isMale ? "Joyeux anniversaire mon amour ! 🎂❤️" : "Joyeux anniversaire ma chérie ! 🎂❤️",
                reconsiderThought: isMale
                    ? "Oh non, un simple message n'est pas digne de mon prince... 👑✨"
                    : "Oh non, un simple message n'est pas digne de ma reine... 👑✨",
                linkSubtitle: "Un univers magique créé spécialement pour toi ❤️",
            };
        }
        if (relationship === "mother") {
            return {
                initialWish: "Joyeux anniversaire Maman ! 🌸🎂",
                reconsiderThought: "Oh non, un simple texto ne suffira jamais pour Maman... 💐✨",
                linkSubtitle: "Une célébration magique créée avec tout mon amour pour toi, Maman ✨",
            };
        }
        if (relationship === "father") {
            return {
                initialWish: "Joyeux anniversaire Papa ! 🎂⭐",
                reconsiderThought: "Oh non, un simple message pour mon héros ? Pas question... 🌟💪",
                linkSubtitle: "Un hommage d'anniversaire créé spécialement pour toi, Papa ✨",
            };
        }
        if (relationship === "brother") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🔥` : "Joyeux anniversaire frangin ! 🎂🔥",
                reconsiderThought: "Oh non, un simple SMS pour le meilleur frère du monde ? Jamais ! 🏆🔥",
                linkSubtitle: "J'ai créé tout ce site de fête spécialement pour toi 🚀",
            };
        }
        if (relationship === "sister") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🌸🎂` : "Joyeux anniversaire sœurette ! 🌸🎂",
                reconsiderThought: "Oh non, un simple texto pour ma sœur adorée ? Tu mérites un univers ! 🌸✨",
                linkSubtitle: "J'ai créé tout ce site féerique spécialement pour toi ✨",
            };
        }
        if (relationship === "friend") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🎉` : "Joyeux anniversaire mon pote ! 🎂🎉",
                reconsiderThought: "Oh non, un SMS classique pour une légende comme toi ? Jamais ! 😂🚀",
                linkSubtitle: "J'ai créé tout ce site rien que pour te fêter ! 🥳",
            };
        }
        if (relationship === "uncle") {
            return {
                initialWish: targetName ? `Joyeux anniversaire Tonton ${targetName} ! 🎂🕶️` : "Joyeux anniversaire Tonton ! 🎂🕶️",
                reconsiderThought: "Oh non, un simple SMS pour le tonton le plus cool ? Jamais ! 🌟🕶️",
                linkSubtitle: "Une célébration magique créée pour le meilleur tonton du monde ✨",
            };
        }
        if (relationship === "aunt") {
            return {
                initialWish: targetName ? `Joyeux anniversaire Tata ${targetName} ! 🌸🎂` : "Joyeux anniversaire Tata ! 🌸🎂",
                reconsiderThought: "Oh non, un simple texto pour ma tante préférée ? Tu mérites tout ! 🌸💐",
                linkSubtitle: "Une célébration chaleureuse créée avec tout mon amour pour Tata ✨",
            };
        }
        if (relationship === "son") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂⭐` : "Joyeux anniversaire mon fils adoré ! 🎂⭐",
                reconsiderThought: "Oh non, un simple message pour mon fils chéri ? Tu es ma fierté ! 🌟❤️",
                linkSubtitle: "Une célébration pleine d'amour créée spécialement pour mon fils ❤️",
            };
        }
        if (relationship === "daughter") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🌸🎂` : "Joyeux anniversaire ma fille chérie ! 🌸🎂",
                reconsiderThought: "Oh non, un simple texto pour ma fille adorée ? Tu mérites les étoiles ! 🌸💖",
                linkSubtitle: "Une célébration féerique créée avec tout mon amour pour ma fille ✨",
            };
        }
        if (relationship === "grandfather") {
            return {
                initialWish: "Joyeux anniversaire Papy ! 🎂⭐",
                reconsiderThought: "Oh non, un simple message pour notre cher grand-père ne suffira jamais... 💛⭐",
                linkSubtitle: "Un hommage d'anniversaire créé avec tout notre amour pour Papy ✨",
            };
        }
        if (relationship === "grandmother") {
            return {
                initialWish: "Joyeux anniversaire Mamie ! 🌸🎂",
                reconsiderThought: "Oh non, un simple texto pour la plus douce des mamies ? Jamais ! 💐💛",
                linkSubtitle: "Une célébration pleine de tendresse créée pour notre chère Mamie ✨",
            };
        }
        if (relationship === "cousin") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🎉` : "Joyeux anniversaire cousin ! 🎂🎉",
                reconsiderThought: "Oh non, un message basique pour le meilleur des cousins ? Pas notre genre ! 😂🚀",
                linkSubtitle: "J'ai créé tout ce site de fête rien que pour toi 🥳",
            };
        }
        if (relationship === "guardian") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🌟` : "Joyeux anniversaire ! 🎂🌟",
                reconsiderThought: "Oh non, un simple message pour quelqu'un qui me guide chaque jour... 🌟✨",
                linkSubtitle: "Un hommage d'anniversaire créé avec une profonde gratitude ✨",
            };
        }
        if (relationship === "mentor") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🎯` : "Joyeux anniversaire ! 🎂🎯",
                reconsiderThought: "Un simple ping pour notre plus grand mentor ? Pas question ! 🎯✨",
                linkSubtitle: "Une expérience interactive créée spécialement pour vous ✨",
            };
        }
        if (relationship === "colleague") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂💼` : "Joyeux anniversaire ! 🎂💼",
                reconsiderThought: "Un simple ping pour un collègue si formidable ? Tu mérites une vraie fête ! 🎯💼",
                linkSubtitle: "Un site de célébration créé spécialement pour notre super collègue ✨",
            };
        }
        if (relationship === "sibling") {
            return {
                initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂🔥` : "Joyeux anniversaire ! 🎂🔥",
                reconsiderThought: "Oh non, un simple texto pour mon complice de toujours ? Jamais ! 🚀✨",
                linkSubtitle: "J'ai créé tout ce site rien que pour toi 🚀",
            };
        }

        return {
            initialWish: targetName ? `Joyeux anniversaire ${targetName} ! 🎂✨` : "Joyeux anniversaire ! 🎂✨",
            reconsiderThought: "Oh non, un être si cher mérite bien plus qu'un simple message... ✨",
            linkSubtitle: "Une expérience d'anniversaire unique créée spécialement pour toi ❤️",
        };
    }

    // ══════════════════════════════════════════════════════════════
    // 2. BENGALI (bn)
    // ══════════════════════════════════════════════════════════════
    if (isBengali) {
        if (cleanCustomMsg) {
            return {
                initialWish: cleanCustomMsg.includes("🎂") ? cleanCustomMsg : `${cleanCustomMsg} 🎂`,
                reconsiderThought: targetName
                    ? `${targetName}-এর জন্য শুধু একটা সাধারণ টেক্সট কখনোই যথেষ্ট নয়... ✨`
                    : "এত বিশেষ মানুষের জন্য শুধু একটা টেক্সট কখনোই যথেষ্ট নয়... ✨",
                linkSubtitle: cleanSender
                    ? `${cleanSender}-এর গভীর ভালোবাসা দিয়ে তৈরি এই উপহার ❤️`
                    : "শুধু তোমার জন্য তৈরি এই বিশেষ জাদুকরী ওয়েবসাইট ❤️",
            };
        }

        if (relationship === "partner") {
            return {
                initialWish: isMale ? "শুভ জন্মদিন আমার রাজপুত্র! 🎂❤️" : "শুভ জন্মদিন আমার রাজকন্যা! 🎂❤️",
                reconsiderThought: isMale
                    ? "আমার মনের রাজার জন্য শুধু একটা টেক্সট কখনোই যথেষ্ট নয়... 👑✨"
                    : "আমার মনের রানীর জন্য শুধু একটা টেক্সট কখনোই যথেষ্ট নয়... 👑✨",
                linkSubtitle: "শুধু তোমার জন্য তৈরি এই বিশেষ জাদুকরী ওয়েবসাইট ❤️",
            };
        }
        if (relationship === "mother") {
            return {
                initialWish: "শুভ জন্মদিন মা! 🌸🎂",
                reconsiderThought: "মায়ের জন্য শুধু একটা মেসেজ? কোনোদিনও যথেষ্ট নয়... 💐✨",
                linkSubtitle: "মায়ের জন্য বুকভরা ভালোবাসা দিয়ে তৈরি এই বিশেষ উপহার ✨",
            };
        }
        if (relationship === "father") {
            return {
                initialWish: "শুভ জন্মদিন বাবা! 🎂⭐",
                reconsiderThought: "আমার আসল হিরোকে একটা মেসেজে কি আর ভালোবাসা জানানো যায়... 🌟💪",
                linkSubtitle: "বাবার প্রতি অসীম শ্রদ্ধা ও ভালোবাসা দিয়ে তৈরি এই সাইট ✨",
            };
        }
        if (relationship === "brother") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🔥` : "শুভ জন্মদিন ভাই! 🎂🔥",
                reconsiderThought: "সেরা ভাইয়ের জন্য এত সাধারণ টেক্সট? হতেই পারে না! 🏆🔥",
                linkSubtitle: "শুধু তোর জন্য পুরো একটা ওয়েবসাইট বানিয়ে ফেলেছি 🚀",
            };
        }
        if (relationship === "sister") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🌸🎂` : "শুভ জন্মদিন বোন! 🌸🎂",
                reconsiderThought: "মিষ্টি বোনের জন্য সামান্য মেসেজ? তোর জন্য পুরো একটা ওয়েবসাইট! 🌸✨",
                linkSubtitle: "তোর জন্য পুরো একটা জাদুকরী ওয়েবসাইট সাজিয়েছি ✨",
            };
        }
        if (relationship === "friend") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🎉` : "শুভ জন্মদিন দোস্ত! 🎂🎉",
                reconsiderThought: "তোর মতো সেরা বন্ধুর জন্য সাধারণ টেক্সট? এটা আমরা নই! 😂🚀",
                linkSubtitle: "তোর সেলিব্রেশনের জন্য পুরো একটা ওয়েবসাইট বানিয়েছি! 🥳",
            };
        }
        if (relationship === "uncle") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন কাকা/মামা ${targetName}! 🎂🕶️` : "শুভ জন্মদিন কাকা/মামা! 🎂🕶️",
                reconsiderThought: "আমাদের সেরা কাকার জন্য শুধু একটা মেসেজ? হতেই পারে না! 🌟✨",
                linkSubtitle: "প্রিয় কাকা/মামার জন্য ভালোবাসা দিয়ে সাজানো এই বিশেষ সাইট ✨",
            };
        }
        if (relationship === "aunt") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন মাসিমা/কাকীমা ${targetName}! 🌸🎂` : "শুভ জন্মদিন মাসিমা/কাকীমা! 🌸🎂",
                reconsiderThought: "প্রিয় মাসিমার জন্য সাধারণ মেসেজ একদম মানায় না... 🌸💐",
                linkSubtitle: "মাসিমার প্রতি অসীম ভালোবাসা দিয়ে সাজানো এই ডিজিটাল উপহার ✨",
            };
        }
        if (relationship === "son") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂⭐` : "শুভ জন্মদিন আমার ছেলে! 🎂⭐",
                reconsiderThought: "আমার গর্বের ছেলের জন্য সাধারণ একটা টেক্সট কখনোই যথেষ্ট নয়... 🌟❤️",
                linkSubtitle: "আমার রাজপুত্রের জন্মদিনে ভালোবাসা দিয়ে তৈরি এই ওয়েবসাইট ❤️",
            };
        }
        if (relationship === "daughter") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🌸🎂` : "শুভ জন্মদিন আমার মা/মেয়ে! 🌸🎂",
                reconsiderThought: "আমার চোখের মণির জন্য শুধু একটা মেসেজ? একদম নয়! 🌸💖",
                linkSubtitle: "আমার মিষ্টি মেয়ের জন্য আদর দিয়ে তৈরি এই জাদুকরী সাইট ✨",
            };
        }
        if (relationship === "grandfather") {
            return {
                initialWish: "শুভ জন্মদিন দাদু! 🎂⭐",
                reconsiderThought: "আমাদের পরিবারের বটবৃক্ষ দাদুর জন্য একটা মেসেজ কি আর যথেষ্ট... 💛✨",
                linkSubtitle: "দাদুর প্রতি অসীম শ্রদ্ধা ও ভালোবাসা নিয়ে তৈরি বিশেষ উপহার ✨",
            };
        }
        if (relationship === "grandmother") {
            return {
                initialWish: "শুভ জন্মদিন দিদা/ঠাকুমা! 🌸🎂",
                reconsiderThought: "আমাদের প্রিয় দিদার স্নেহের তুলনায় একটা মেসেজ কিছুই নয়... 💐💛",
                linkSubtitle: "দিদার জন্য বুকভরা ভালোবাসা দিয়ে তৈরি এই স্মৃতি সাইট ✨",
            };
        }
        if (relationship === "cousin") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🎉` : "শুভ জন্মদিন! 🎂🎉",
                reconsiderThought: "সেরা কাজিনের জন্য সাধারণ টেক্সট? আমরা তো স্পেশাল কিছু করবই! 😂🚀",
                linkSubtitle: "তোর জন্য পুরো একটা ধামাকা সেলিব্রেশন সাইট রেডি করেছি! 🥳",
            };
        }
        if (relationship === "guardian") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🌟` : "শুভ জন্মদিন! 🎂🌟",
                reconsiderThought: "যার অনুপ্রেরণায় আমি বড় হয়েছি, তার জন্য সাধারণ টেক্সট নয়... 🌟✨",
                linkSubtitle: "শ্রদ্ধা ও ভালোবাসায় তৈরি বিশেষ জন্মদিনের উপহার ✨",
            };
        }
        if (relationship === "mentor") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🎯` : "শুভ জন্মদিন! 🎂🎯",
                reconsiderThought: "আমাদের সেরা পথপ্রদর্শকের জন্য একটা সাধারণ মেসেজ যথেষ্ট নয়... 🎯✨",
                linkSubtitle: "সম্মান ও কৃতজ্ঞতার সাথে তৈরি এই ডিজিটাল শ্রদ্ধাঞ্জলি ✨",
            };
        }
        if (relationship === "colleague") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂💼` : "শুভ জন্মদিন! 🎂💼",
                reconsiderThought: "সেরা সহকর্মীর জন্মদিনে শুধু একটা চ্যাট পিং? কখনোই না! 🎯✨",
                linkSubtitle: "আমাদের প্রিয় সহকর্মীর জন্য বিশেষ সেলিব্রেশন উপহার ✨",
            };
        }
        if (relationship === "sibling") {
            return {
                initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂🔥` : "শুভ জন্মদিন! 🎂🔥",
                reconsiderThought: "আমার প্রাণের ভাই/বোনের জন্য পুরো একটা ওয়েবসাইট উপহার! 🚀✨",
                linkSubtitle: "ভালোবাসা দিয়ে তৈরি তোমার নিজস্ব ওয়েবসাইট 🚀",
            };
        }

        return {
            initialWish: targetName ? `শুভ জন্মদিন ${targetName}! 🎂✨` : "শুভ জন্মদিন! 🎂✨",
            reconsiderThought: "তোমার মতো বিশেষ মানুষের জন্য একটা সাধারণ মেসেজ যথেষ্ট নয়... ✨",
            linkSubtitle: "ভালোবাসা দিয়ে তৈরি তোমার নিজস্ব জন্মদিন সেলিব্রেশন সাইট ❤️",
        };
    }

    // ══════════════════════════════════════════════════════════════
    // 3. HINDI (hi)
    // ══════════════════════════════════════════════════════════════
    if (isHindi) {
        if (cleanCustomMsg) {
            return {
                initialWish: cleanCustomMsg.includes("🎂") ? cleanCustomMsg : `${cleanCustomMsg} 🎂`,
                reconsiderThought: targetName
                    ? `${targetName} के लिए सिर्फ एक साधारण टेक्स्ट कभी काफी नहीं हो सकता... ✨`
                    : "आप जैसे खास इंसान के लिए सिर्फ एक मैसेज काफी नहीं हो सकता... ✨",
                linkSubtitle: cleanSender
                    ? `${cleanSender} के प्यार से बनाया गया यह खास सरप्राइज ❤️`
                    : "प्यार से बनाई गई आपकी अपनी बर्थडे वेबसाइट ❤️",
            };
        }

        if (relationship === "partner") {
            return {
                initialWish: isMale ? "जन्मदिन मुबारक हो मेरे राजा! 🎂❤️" : "जन्मदिन मुबारक हो मेरी रानी! 🎂❤️",
                reconsiderThought: isMale
                    ? "मेरे राजा के लिए सिर्फ एक साधारण टेक्स्ट कभी काफी नहीं हो सकता... 👑✨"
                    : "मेरी रानी के लिए सिर्फ एक साधारण टेक्स्ट कभी काफी नहीं हो सकता... 👑✨",
                linkSubtitle: "सिर्फ आपके लिए बनाई गई यह खास जादुई वेबसाइट ❤️",
            };
        }
        if (relationship === "mother") {
            return {
                initialWish: "जन्मदिन मुबारक हो माँ! 🌸🎂",
                reconsiderThought: "माँ के लिए सिर्फ एक साधारण टेक्स्ट? कभी भी मुमकिन नहीं... 💐✨",
                linkSubtitle: "माँ के लिए दिल से बनाया गया यह खास सरप्राइज ✨",
            };
        }
        if (relationship === "father") {
            return {
                initialWish: "जन्मदिन मुबारक हो पापा! 🎂⭐",
                reconsiderThought: "हमारे असली हीरो के लिए सिर्फ एक संदेश काफी नहीं हो सकता... 🌟💪",
                linkSubtitle: "पापा के लिए खास तौर पर बनाया गया यह डिजिटल ट्रिब्यूट ✨",
            };
        }
        if (relationship === "brother") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🔥` : "जन्मदिन मुबारक हो भाई! 🎂🔥",
                reconsiderThought: "दुनिया के सबसे धांसू भाई के लिए सिर्फ एक टेक्स्ट? कभी नहीं! 🏆🔥",
                linkSubtitle: "सिर्फ तुम्हारे लिए बनाई है यह पूरी सेलिब्रेशन वेबसाइट 🚀",
            };
        }
        if (relationship === "sister") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🌸🎂` : "जन्मदिन मुबारक हो बहना! 🌸🎂",
                reconsiderThought: "मेरी प्यारी बहन के लिए सिर्फ एक मैसेज? तुम्हारे लिए पूरी दुनिया हाजिर है! 🌸✨",
                linkSubtitle: "सिर्फ तुम्हारे लिए बनाई है यह पूरी जादुई वेबसाइट ✨",
            };
        }
        if (relationship === "friend") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🎉` : "जन्मदिन मुबारक हो यार! 🎂🎉",
                reconsiderThought: "तुम जैसे लेजेंड के लिए सिर्फ एक साधारण सा टेक्स्ट? कभी नहीं! 😂🚀",
                linkSubtitle: "तुम्हारी मस्ती के लिए पूरी वेबसाइट तैयार की है! 🥳",
            };
        }
        if (relationship === "uncle") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो चाचाजी/मामाजी ${targetName}! 🎂🕶️` : "जन्मदिन मुबारक हो चाचाजी/मामाजी! 🎂🕶️",
                reconsiderThought: "हमारे सबसे कूल चाचाजी के लिए सिर्फ एक मैसेज? बिल्कुल नहीं! 🌟🕶️",
                linkSubtitle: "चाचाजी के लिए दिल से बनाई गई यह खास बर्थडे वेबसाइट ✨",
            };
        }
        if (relationship === "aunt") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो चाचीजी/मौसीजी ${targetName}! 🌸🎂` : "जन्मदिन मुबारक हो चाचीजी/मौसीजी! 🌸🎂",
                reconsiderThought: "हमारी सबसे प्यारी चाचीजी के लिए एक साधारण टेक्स्ट काफी नहीं... 🌸💐",
                linkSubtitle: "चाचीजी के लिए ढेर सारे प्यार से सजाई गई यह खास वेबसाइट ✨",
            };
        }
        if (relationship === "son") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂⭐` : "जन्मदिन मुबारक हो बेटा! 🎂⭐",
                reconsiderThought: "मेरे प्यारे बेटे के लिए सिर्फ एक टेक्स्ट? तुम मेरी शान हो! 🌟❤️",
                linkSubtitle: "मेरे लाडले बेटे के लिए दिल से बनाई गई यह खास वेबसाइट ❤️",
            };
        }
        if (relationship === "daughter") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🌸🎂` : "जन्मदिन मुबारक हो मेरी बेटी! 🌸🎂",
                reconsiderThought: "मेरी प्यारी राजकुमारी बेटी के लिए सिर्फ एक मैसेज काफी नहीं हो सकता... 🌸💖",
                linkSubtitle: "मेरी प्यारी बिटिया के लिए प्यार से सजाया गया यह डिजिटल तोहफा ✨",
            };
        }
        if (relationship === "grandfather") {
            return {
                initialWish: "जन्मदिन मुबारक हो दादाजी/नानाजी! 🎂⭐",
                reconsiderThought: "हमारे परिवार की शान दादाजी के लिए एक साधारण मैसेज काफी नहीं... 💛✨",
                linkSubtitle: "दादाजी के प्रति आदर और प्यार से बनाई गई यह खास वेबसाइट ✨",
            };
        }
        if (relationship === "grandmother") {
            return {
                initialWish: "जन्मदिन मुबारक हो दादीजी/नानीजी! 🌸🎂",
                reconsiderThought: "सबसे प्यारी दादीजी के लिए प्यार से भरी पूरी वेबसाइट तैयार की है... 💐💛",
                linkSubtitle: "दादीजी के लिए अपार प्यार और स्नेह से सजाया गया यह तोहफा ✨",
            };
        }
        if (relationship === "cousin") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🎉` : "जन्मदिन मुबारक हो कजिन! 🎂🎉",
                reconsiderThought: "दुनिया के सबसे मस्त कजिन के लिए बोरिंग टेक्स्ट? बिल्कुल नहीं! 😂🚀",
                linkSubtitle: "तुम्हारी बर्थडे पार्टी के लिए यह खास वेबसाइट बनाई है! 🥳",
            };
        }
        if (relationship === "guardian") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🌟` : "जन्मदिन मुबारक हो! 🎂🌟",
                reconsiderThought: "जिसने हर कदम पर राह दिखाई, उनके लिए एक साधारण टेक्स्ट काफी नहीं... 🌟✨",
                linkSubtitle: "गहरे सम्मान और कृतज्ञता के साथ बनाया गया यह खास उपहार ✨",
            };
        }
        if (relationship === "mentor") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🎯` : "जन्मदिन मुबारक हो! 🎂🎯",
                reconsiderThought: "हमारे सबसे बड़े मार्गदर्शक के लिए सिर्फ एक मैसेज? बिल्कुल नहीं! 🎯✨",
                linkSubtitle: "सम्मान और प्रेरणा के साथ तैयार किया गया यह खास पेज ✨",
            };
        }
        if (relationship === "colleague") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂💼` : "जन्मदिन मुबारक हो साथी! 🎂💼",
                reconsiderThought: "शानदार टीममेट के लिए सिर्फ एक कैजुअल टेक्स्ट? पूरी पार्टी बनती है! 🎯💼",
                linkSubtitle: "हमारे शानदार कलीग के लिए खास तौर पर बनाई गई यह वेबसाइट ✨",
            };
        }
        if (relationship === "sibling") {
            return {
                initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂🔥` : "जन्मदिन मुबारक हो! 🎂🔥",
                reconsiderThought: "मेरे सबसे खास साथी के लिए सिर्फ एक साधारण मैसेज? कभी नहीं! 🔥🎉",
                linkSubtitle: "सिर्फ तुम्हारे लिए बनाई है यह पूरी सेलिब्रेशन वेबसाइट 🚀",
            };
        }

        return {
            initialWish: targetName ? `जन्मदिन मुबारक हो ${targetName}! 🎂✨` : "जन्मदिन मुबारक हो! 🎂✨",
            reconsiderThought: "आप जैसे खास इंसान के लिए सिर्फ एक मैसेज काफी नहीं हो सकता... ✨",
            linkSubtitle: "प्यार से बनाई गई आपकी अपनी बर्थडे वेबसाइट ❤️",
        };
    }

    // ══════════════════════════════════════════════════════════════
    // 4. ENGLISH (Default)
    // ══════════════════════════════════════════════════════════════
    if (cleanCustomMsg) {
        return {
            initialWish: cleanCustomMsg.includes("🎂") ? cleanCustomMsg : `${cleanCustomMsg} 🎂`,
            reconsiderThought: targetName
                ? `Oh no, an ordinary text isn't enough for ${targetName}... ✨`
                : "Oh no, someone so special deserves so much more than just a text message... ✨",
            linkSubtitle: cleanSender
                ? `A magical birthday celebration handcrafted with love by ${cleanSender} ❤️`
                : "A special birthday website experience handcrafted just for you ❤️",
        };
    }

    if (relationship === "partner") {
        return {
            initialWish: isMale
                ? "Happy birthday my handsome! 🎂❤️"
                : isFemale
                ? "Happy birthday my beautiful! 🎂❤️"
                : "Happy birthday my love! 🎂❤️",
            reconsiderThought: isMale
                ? "Oh no, a simple message is not enough for my King... 👑✨"
                : isFemale
                ? "Oh no, a simple message is not enough for my Queen... 👑✨"
                : "Oh no, an ordinary message is never enough for you... 💖✨",
            linkSubtitle: "A magical birthday experience handcrafted just for you ❤️",
        };
    }

    if (relationship === "mother") {
        return {
            initialWish: "Happy birthday Mom! 🌸🎂",
            reconsiderThought: "Oh no, a simple text could never thank you enough, Mom... 💐✨",
            linkSubtitle: "A special celebration crafted with all my love for Mom ✨",
        };
    }

    if (relationship === "father") {
        return {
            initialWish: "Happy birthday Dad! 🎂⭐",
            reconsiderThought: "Oh no, an ordinary message is never enough for my hero... 🌟💪",
            linkSubtitle: "A special birthday tribute handcrafted just for you, Dad ✨",
        };
    }

    if (relationship === "brother") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🔥` : "Happy birthday bro! 🎂🔥",
            reconsiderThought: "Oh no, a basic text for the best brother? Not how we roll! 🏆🔥",
            linkSubtitle: "Built this whole celebration website just for you 🚀",
        };
    }

    if (relationship === "sister") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🌸🎂` : "Happy birthday sis! 🌸🎂",
            reconsiderThought: "Oh no, a plain text for my sweetest sister? You deserve a whole universe! 🌸✨",
            linkSubtitle: "Built this whole celebration website just for you ✨",
        };
    }

    if (relationship === "friend") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🎉` : "Happy birthday bestie! 🎂🎉",
            reconsiderThought: "Oh no, a boring text for a legend like you? Definitely not us! 😂🚀",
            linkSubtitle: "Built this entire website just to celebrate you! 🥳",
        };
    }

    if (relationship === "uncle") {
        return {
            initialWish: targetName ? `Happy birthday Uncle ${targetName}! 🎂🕶️` : "Happy birthday Uncle! 🎂🕶️",
            reconsiderThought: "Oh no, a routine text for the coolest uncle? Not a chance! 🌟🕶️",
            linkSubtitle: "A special celebration handcrafted for the best uncle in the world ✨",
        };
    }

    if (relationship === "aunt") {
        return {
            initialWish: targetName ? `Happy birthday Aunt ${targetName}! 🌸🎂` : "Happy birthday Auntie! 🌸🎂",
            reconsiderThought: "Oh no, a simple message isn't enough for my favorite aunt... 🌸💐",
            linkSubtitle: "A warm birthday celebration handcrafted with love for Auntie ✨",
        };
    }

    if (relationship === "son") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂⭐` : "Happy birthday my son! 🎂⭐",
            reconsiderThought: "Oh no, an ordinary text could never show how proud I am of my son... 🌟❤️",
            linkSubtitle: "A special birthday experience handcrafted with all my love for my son ❤️",
        };
    }

    if (relationship === "daughter") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🌸🎂` : "Happy birthday my sweet daughter! 🌸🎂",
            reconsiderThought: "Oh no, a simple text is never enough for my precious daughter... 🌸💖",
            linkSubtitle: "A magical celebration handcrafted with all my love for my daughter ✨",
        };
    }

    if (relationship === "grandfather") {
        return {
            initialWish: "Happy birthday Grandpa! 🎂⭐",
            reconsiderThought: "Oh no, a simple message could never honor our family's greatest patriarch... 💛⭐",
            linkSubtitle: "A special tribute celebration handcrafted with love for Grandpa ✨",
        };
    }

    if (relationship === "grandmother") {
        return {
            initialWish: "Happy birthday Grandma! 🌸🎂",
            reconsiderThought: "Oh no, an ordinary message is never enough for the sweetest grandma... 💐💛",
            linkSubtitle: "A magical celebration crafted with all our love for Grandma ✨",
        };
    }

    if (relationship === "cousin") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🎉` : "Happy birthday cousin! 🎂🎉",
            reconsiderThought: "Oh no, a basic text for the best cousin in the world? We don't do boring! 😂🚀",
            linkSubtitle: "Built this entire celebration website just for you 🥳",
        };
    }

    if (relationship === "guardian") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🌟` : "Happy birthday! 🎂🌟",
            reconsiderThought: "Oh no, a simple text isn't enough for someone who guides me every step of the way... 🌟✨",
            linkSubtitle: "A special tribute handcrafted with deep gratitude and love ✨",
        };
    }

    if (relationship === "mentor") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🎯` : "Happy birthday! 🎂🎯",
            reconsiderThought: "A regular birthday ping for our greatest inspiration? Not a chance! 🎯✨",
            linkSubtitle: "An interactive celebration experience handcrafted for you ✨",
        };
    }

    if (relationship === "colleague") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂💼` : "Happy birthday! 🎂💼",
            reconsiderThought: "A routine chat ping for such a valued colleague? You deserve a real celebration! 🎯💼",
            linkSubtitle: "A custom celebration website handcrafted for our stellar teammate ✨",
        };
    }

    if (relationship === "sibling") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🔥` : "Happy birthday! 🎂🔥",
            reconsiderThought: "Oh no, a basic text for my partner-in-crime? Never! 🔥🎉",
            linkSubtitle: "Built this entire celebration website just for you 🚀",
        };
    }

    if (relationship === "family") {
        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂🏡` : "Happy birthday! 🎂🏡",
            reconsiderThought: "Oh no, someone so cherished by our family deserves so much more than a simple text... 💛✨",
            linkSubtitle: "A special birthday experience handcrafted with all our family's love ✨",
        };
    }

        return {
            initialWish: targetName ? `Happy birthday ${targetName}! 🎂✨` : "Happy birthday! 🎂✨",
            reconsiderThought: targetName
                ? `Oh no, an ordinary text isn't enough for ${targetName}... ✨`
                : "Oh no, someone so special deserves so much more than just a text message... ✨",
            linkSubtitle: "A special birthday website experience handcrafted just for you ❤️",
        };
    })();

    if (cleanSender) {
        if (isFrench) {
            copy.linkSubtitle = `Créé avec tout l'amour de ${cleanSender} spécialement pour toi ❤️`;
        } else if (isBengali) {
            copy.linkSubtitle = `${cleanSender}-এর গভীর ভালোবাসা দিয়ে তৈরি এই উপহার ❤️`;
        } else if (isHindi) {
            copy.linkSubtitle = `${cleanSender} के प्यार से बनाई गई यह खास वेबसाइट ❤️`;
        } else {
            copy.linkSubtitle = `A special celebration handcrafted with love by ${cleanSender} ❤️`;
        }
    }

    return copy;
}
