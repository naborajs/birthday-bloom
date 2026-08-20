import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Transforms various YouTube URL formats (watch?v=, youtu.be/, shorts/, embed/)
 * into a standardized YouTube embed URL for iframe rendering.
 * Non-YouTube URLs or video asset URLs are returned unchanged.
 */
export function getYouTubeEmbedUrl(url: string): string {
    if (!url || typeof url !== "string") {
        return url || "";
    }

    const trimmed = url.trim();

    // youtu.be/{id}
    const shortMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i);
    if (shortMatch && shortMatch[1]) {
        const videoId = shortMatch[1].split("?")[0].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtube.com/watch?v={id}
    const watchMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?[^#]*\bv=([a-zA-Z0-9_-]+)/i);
    if (watchMatch && watchMatch[1]) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // youtube.com/embed/{id} or youtube.com/shorts/{id} or youtube.com/v/{id}
    const pathMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]+)/i);
    if (pathMatch && pathMatch[1]) {
        const videoId = pathMatch[1].split("?")[0].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return trimmed;
}

