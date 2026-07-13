export type Phase = "select" | "blow-intro" | "blowing" | "wish" | "countdown" | "knife-enter" | "cutting" | "burst" | "quotes";

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
    emoji: string;
    accent: string; // Used for UI accents and candle flames
    config: Cake3DConfig;
}

export const CAKE_OPTIONS: CakeOption[] = [
    {
        id: "chocolate",
        name: "Chocolate Dream",
        emoji: "🍫",
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
        emoji: "🍓",
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
        emoji: "👑",
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
        emoji: "🌸",
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
