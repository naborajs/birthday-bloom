export type Phase = "select" | "baking" | "blow-intro" | "blowing" | "wish" | "countdown" | "knife-enter" | "cutting" | "burst" | "quotes";

import chocolateCake from "@/assets/birthday/cake-maroon.png";
import strawberryCake from "@/assets/birthday/cake-pink.png";
import royalCake from "@/assets/birthday/birthday-gold.png";
import natureCake from "@/assets/birthday/cake-green.png";

export interface Cake3DConfig {
    spongeColor: string;
    fillingColor: string;
    frostingColor: string;
    dripColor: string;
    plateColor: string;
    cherryColor?: string;
}

export interface CakeOption {
    id: string;
    name: string;
    nameHi?: string;
    nameBn?: string;
    emoji: string;
    image: string;
    layers: string[];
    accent: string; // Used for UI accents and candle flames
    config: Cake3DConfig;
}

export const getCakeName = (cake: CakeOption, isHindi?: boolean, isBengali?: boolean): string => {
    if (isBengali && cake.nameBn) return cake.nameBn;
    if (isHindi && cake.nameHi) return cake.nameHi;
    return cake.name;
};

export const CAKE_OPTIONS: CakeOption[] = [
    {
        id: "chocolate",
        name: "Chocolate Dream",
        nameHi: "चॉकलेट ड्रीम",
        nameBn: "চকলেট ড্রিম",
        emoji: "🍫",
        image: chocolateCake,
        layers: ["hsl(15,60%,30%)", "hsl(15,50%,40%)", "hsl(20,40%,50%)"],
        accent: "hsl(45,100%,60%)",
        config: {
            spongeColor: "#3e2723",
            fillingColor: "#4e342e",
            frostingColor: "#3e2723",
            dripColor: "#21100a",
            plateColor: "#e0e0e0"
        }
    },
    {
        id: "strawberry",
        name: "Strawberry Bliss",
        nameHi: "स्ट्रॉबेरी ब्लिस",
        nameBn: "স্ট্রবেরি ব্লিস",
        emoji: "🍓",
        image: strawberryCake,
        layers: ["hsl(340,60%,55%)", "hsl(330,55%,65%)", "hsl(340,50%,75%)"],
        accent: "hsl(340,80%,60%)",
        config: {
            spongeColor: "#fce4ec",
            fillingColor: "#f8bbd0",
            frostingColor: "#ffccd5",
            dripColor: "#ff4d6d",
            plateColor: "#e0e0e0"
        }
    },
    {
        id: "royal",
        name: "Royal Velvet",
        nameHi: "रॉयल वेलवेट",
        nameBn: "রয়্যাল ভেলভেট",
        emoji: "👑",
        image: royalCake,
        layers: ["hsl(270,50%,35%)", "hsl(280,45%,50%)", "hsl(290,40%,60%)"],
        accent: "hsl(45,100%,60%)",
        config: {
            spongeColor: "#b71c1c",
            fillingColor: "#ffffff",
            frostingColor: "#ffffff",
            dripColor: "#ffb300",
            plateColor: "#e0e0e0"
        }
    },
    {
        id: "nature",
        name: "Floral Garden",
        nameHi: "फ्लोरल गार्डन",
        nameBn: "ফ্লোরাল গার্ডেন",
        emoji: "🌸",
        image: natureCake,
        layers: ["hsl(120,40%,30%)", "hsl(100,30%,40%)", "hsl(140,40%,50%)"],
        accent: "hsl(140,60%,50%)",
        config: {
            spongeColor: "#e8f5e9",
            fillingColor: "#c8e6c9",
            frostingColor: "#ffffff",
            dripColor: "#81c784",
            plateColor: "#e0e0e0"
        }
    }
];
