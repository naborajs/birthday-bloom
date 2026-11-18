/**
 * Normalizes user-provided image URLs (e.g. from environment variables, URL query parameters, or configs).
 * - Strips enclosing quotes (single/double) and unescapes slashes.
 * - Converts Google Drive view/open links into directly embeddable image streams (lh3.googleusercontent.com).
 * - Converts Dropbox dl=0 links to raw=1 for direct binary streaming.
 * - Converts Imgur page links to direct image links.
 * - Preserves data URLs, local relative paths, Cloudinary, Unsplash, and standard HTTPS/HTTP endpoints.
 */
export const normalizeImageUrl = (url?: string | null): string => {
    if (!url || typeof url !== "string") return "";
    let trimmed = url.trim();
    // Strip wrapping quotes
    trimmed = trimmed.replace(/^["']|["']$/g, "").trim();
    if (!trimmed) return "";

    // Unescape backslashes if escaped (e.g. https:\/\/...)
    trimmed = trimmed.replace(/\\\//g, "/");

    // 1. Google Drive Links:
    // Formats:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    const gDriveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    const gDriveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i);
    const gDriveId = gDriveFileMatch?.[1] || gDriveIdMatch?.[1];
    if (gDriveId) {
        return `https://lh3.googleusercontent.com/d/${gDriveId}`;
    }

    // 2. Dropbox Links:
    // Replace dl=0 with raw=1 so Dropbox returns direct image bytes instead of HTML preview page
    if (trimmed.includes("dropbox.com/")) {
        if (trimmed.includes("dl=0")) {
            return trimmed.replace("dl=0", "raw=1");
        }
        if (!trimmed.includes("raw=1") && !trimmed.includes("dl=1")) {
            const separator = trimmed.includes("?") ? "&" : "?";
            return `${trimmed}${separator}raw=1`;
        }
        return trimmed;
    }

    // 3. Imgur Page Links:
    // https://imgur.com/ABC -> https://i.imgur.com/ABC.jpg
    const imgurMatch = trimmed.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,8})$/i);
    if (imgurMatch?.[1]) {
        return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }

    // 4. Postimages Viewer Links (postimg.cc / postimages.org):
    // Viewer link: https://postimg.cc/nX1YHsX8
    // Direct stream: https://i.postimg.cc/nX1YHsX8/image.jpg
    const postimgMatch = trimmed.match(/^https?:\/\/(?:www\.)?(?:postimg\.cc|postimages\.org)\/([a-zA-Z0-9]+)\/?$/i);
    if (postimgMatch?.[1]) {
        return `https://i.postimg.cc/${postimgMatch[1]}/image.jpg`;
    }

    return trimmed;
};

/**
 * Checks if an image URL looks like a genuine, loadable photo
 * and not an empty string, null, undefined, or obvious fake placeholder domain.
 */
export const isRealImageUrl = (url?: string | null): boolean => {
    if (!url || typeof url !== "string") return false;
    const normalized = normalizeImageUrl(url);
    if (!normalized) return false;
    const lower = normalized.toLowerCase();
    if (lower === "null" || lower === "undefined" || lower === "false" || lower === "none" || lower === "0") {
        return false;
    }
    // Block obvious dummy placeholder domains
    if (lower.includes("example.com")) return false;
    if (lower.includes("via.placeholder.com") || lower.includes("dummyimage.com") || lower.includes("placehold.co")) {
        return false;
    }
    // Allow data URIs and local paths
    if (lower.startsWith("data:image/") || lower.startsWith("/") || lower.startsWith("./") || lower.startsWith("../")) {
        return true;
    }
    try {
        const parsed = new URL(normalized);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
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
