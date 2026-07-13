export type Phase = "select" | "blow-intro" | "blowing" | "wish" | "countdown" | "knife-enter" | "cutting" | "burst" | "quotes";

export interface CakeOption {
    id: string;
    name: string;
    layers: string[];
    frosting: string;
    accent: string;
    emoji: string;
    image: string;
    // New design properties
    drizzle?: string;
    sprinkles?: string[];
    plate: string;
}

export const CAKE_OPTIONS: CakeOption[] = [
    {
        id: "chocolate",
        name: "Chocolate Dream",
        layers: ["hsl(15,60%,20%)", "hsl(15,50%,30%)", "hsl(20,40%,40%)"],
        frosting: "hsl(30,70%,65%)",
        accent: "hsl(45,100%,60%)",
        drizzle: "hsl(10,50%,15%)",
        sprinkles: ["hsl(45,100%,60%)", "hsl(0,0%,90%)", "hsl(20,40%,40%)"],
        plate: "hsl(0,0%,15%)",
        emoji: "🍫",
        image: "/assets/birthday/cake-maroon.png",
    },
    {
        id: "strawberry",
        name: "Strawberry Bliss",
        layers: ["hsl(340,60%,45%)", "hsl(330,55%,55%)", "hsl(340,50%,65%)"],
        frosting: "hsl(350,80%,88%)",
        accent: "hsl(340,80%,60%)",
        drizzle: "hsl(330,70%,40%)",
        sprinkles: ["hsl(0,80%,60%)", "hsl(340,60%,45%)", "white"],
        plate: "hsl(350,20%,95%)",
        emoji: "🍓",
        image: "/assets/birthday/cake-pink.png",
    },
    {
        id: "royal",
        name: "Royal Velvet",
        layers: ["hsl(270,50%,25%)", "hsl(280,45%,40%)", "hsl(290,40%,50%)"],
        frosting: "hsl(45,90%,75%)",
        accent: "hsl(45,100%,60%)",
        drizzle: "hsl(45,100%,40%)",
        sprinkles: ["hsl(45,100%,60%)", "white", "hsl(280,45%,40%)"],
        plate: "hsl(270,20%,15%)",
        emoji: "👑",
        image: "/assets/birthday/birthday-gold.png",
    },
    {
        id: "nature",
        name: "Floral Garden",
        layers: ["hsl(120,40%,25%)", "hsl(100,30%,35%)", "hsl(140,40%,45%)"],
        frosting: "hsl(80,40%,75%)",
        accent: "hsl(330,85%,65%)",
        drizzle: "hsl(100,40%,25%)",
        sprinkles: ["hsl(330,85%,65%)", "hsl(120,40%,25%)", "white"],
        plate: "hsl(80,20%,90%)",
        emoji: "🌸",
        image: "/assets/birthday/cake-green.png",
    },
];
