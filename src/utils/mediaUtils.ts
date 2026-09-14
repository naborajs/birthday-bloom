/**
 * Checks if an image URL looks like a genuine personal photo
 * and not an automated stock photo, unsplash placeholder, or dummy URL.
 */
export const isRealImageUrl = (url?: string | null): boolean => {
    if (!url || typeof url !== "string") return false;
    const lower = url.trim().toLowerCase();
    if (!lower) return false;
    if (lower.includes("unsplash.com")) return false;
    if (lower.includes("example.com")) return false;
    if (lower.includes("placeholder")) return false;
    if (lower.includes("picsum.photos")) return false;
    return true;
};

/**
 * Checks whether a given URL points directly to an HTML5 video file (.mp4, .webm, etc.).
 */
export const isDirectVideoFile = (url?: string | null): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim().toLowerCase();
    return (
        trimmed.endsWith(".mp4") ||
        trimmed.endsWith(".webm") ||
        trimmed.includes(".mp4?") ||
        trimmed.includes(".webm?")
    );
};

/**
 * Validates whether a given URL is a valid, supported video link
 * (YouTube embed/watch/shorts/youtu.be or direct HTML5 video stream).
 * Filters out dummy numbers, placeholders, and null strings.
 */
export const isValidVideoUrl = (url?: string | null): boolean => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (
        !trimmed ||
        trimmed === "0" ||
        trimmed === "null" ||
        trimmed === "undefined" ||
        trimmed === "false"
    ) {
        return false;
    }

    // Exclude invalid short paths like "/0" or "/2" that trigger local 404 routes
    if (/^\/?[0-9]+$/.test(trimmed)) return false;
    if (trimmed.includes("example.com") || trimmed.includes("placeholder")) return false;

    if (
        trimmed.includes("youtube.com/watch") ||
        trimmed.includes("youtu.be/") ||
        trimmed.includes("youtube.com/embed") ||
        trimmed.includes("youtube.com/shorts") ||
        isDirectVideoFile(trimmed)
    ) {
        return true;
    }

    try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};
