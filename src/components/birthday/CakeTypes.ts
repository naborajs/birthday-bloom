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
    trimColor?: string;
    crumbColor?: string;
    innerCreamColor?: string;
    toppingColor?: string;
    plateTrimColor?: string;
}

export interface CakeOption {
    id: string;
    name: string;
    nameHi?: string;
    nameBn?: string;
    nameFr?: string;
    emoji: string;
    image: string;
    layers: string[];
    accent: string; // Used for UI accents and candle flames
    config: Cake3DConfig;
}

export const getCakeName = (cake: CakeOption, isHindi?: boolean, isBengali?: boolean, isFrench?: boolean): string => {
    if (isFrench && cake.nameFr) return cake.nameFr;
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
        nameFr: "Rêve Chocolaté",
        emoji: "🍫",
        image: chocolateCake,
        layers: ["hsl(15,60%,30%)", "hsl(15,50%,40%)", "hsl(20,40%,50%)"],
        accent: "hsl(45,100%,60%)",
        config: {
            spongeColor: "#2b1810",
            crumbColor: "#3e2417",
            fillingColor: "#4a2818",
            innerCreamColor: "#5c331e",
            frostingColor: "#361c12",
            dripColor: "#1a0b06",
            plateColor: "#f7f7f9",
            plateTrimColor: "#d4af37",
            cherryColor: "#c1121f",
            toppingColor: "#d4af37"
        }
    },
    {
        id: "strawberry",
        name: "Strawberry Bliss",
        nameHi: "स्ट्रॉबेरी ब्लिस",
        nameBn: "স্ট্রবেরি ব্লিস",
        nameFr: "Délice Fraise",
        emoji: "🍓",
        image: strawberryCake,
        layers: ["hsl(340,60%,55%)", "hsl(330,55%,65%)", "hsl(340,50%,75%)"],
        accent: "hsl(340,80%,60%)",
        config: {
            spongeColor: "#ffccd5",
            crumbColor: "#ffb3c1",
            fillingColor: "#ff4d6d",
            innerCreamColor: "#fff0f3",
            frostingColor: "#ffb3c6",
            dripColor: "#c9184a",
            plateColor: "#fffdfa",
            plateTrimColor: "#f4a261",
            cherryColor: "#e63946",
            toppingColor: "#ff758f"
        }
    },
    {
        id: "royal",
        name: "Royal Velvet",
        nameHi: "रॉयल वेलवेट",
        nameBn: "রয়্যাল ভেলভেট",
        nameFr: "Velours Royal",
        emoji: "👑",
        image: royalCake,
        layers: ["hsl(270,50%,35%)", "hsl(280,45%,50%)", "hsl(290,40%,60%)"],
        accent: "hsl(45,100%,60%)",
        config: {
            spongeColor: "#7209b7",
            crumbColor: "#560bad",
            fillingColor: "#fff9ec",
            innerCreamColor: "#ffffff",
            frostingColor: "#3f37c9",
            dripColor: "#ffd166",
            plateColor: "#1e1e24",
            plateTrimColor: "#ffd700",
            cherryColor: "#f72585",
            toppingColor: "#ffb703"
        }
    },
    {
        id: "nature",
        name: "Floral Garden",
        nameHi: "फ्लोरल गार्डन",
        nameBn: "ফ্লোরাল গার্ডেন",
        nameFr: "Jardin Floral",
        emoji: "🌸",
        image: natureCake,
        layers: ["hsl(120,40%,30%)", "hsl(100,30%,40%)", "hsl(140,40%,50%)"],
        accent: "hsl(140,60%,50%)",
        config: {
            spongeColor: "#d8f3dc",
            crumbColor: "#b7e4c7",
            fillingColor: "#52b788",
            innerCreamColor: "#fefae0",
            frostingColor: "#95d5b2",
            dripColor: "#2d6a4f",
            plateColor: "#fbfbf2",
            plateTrimColor: "#b5e2fa",
            cherryColor: "#e63946",
            toppingColor: "#e76f51"
        }
    }
];
