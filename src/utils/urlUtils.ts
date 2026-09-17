export interface ShareUrlOptions {
    baseUrl?: string;
    name?: string;
    relationship?: string;
    language?: string;
    age?: number | string;
    senderName?: string;
    color?: string;
    phase?: string;
    includeUtm?: boolean;
}

export interface ParsedCelebrationQuery {
    name?: string;
    relationship?: string;
    language?: string;
    age?: number;
    senderName?: string;
    color?: string;
    phase?: string;
}

/**
 * Sanitizes an individual parameter value, trimming whitespace.
 */
export const sanitizeUrlParam = (val?: string | null): string => {
    if (!val || typeof val !== "string") return "";
    return val.trim();
};

/**
 * Builds a canonical celebration share URL with optional UTM parameters.
 */
export const buildShareUrl = (options: ShareUrlOptions): string => {
    const {
        baseUrl = typeof window !== "undefined"
            ? `${window.location.origin}${window.location.pathname}`
            : "https://birthday-bloom.vercel.app/",
        name,
        relationship,
        language,
        age,
        senderName,
        color,
        phase,
        includeUtm = true,
    } = options;

    const params = new URLSearchParams();

    const cleanName = sanitizeUrlParam(name);
    if (cleanName) params.set("name", cleanName);

    const cleanRel = sanitizeUrlParam(relationship);
    if (cleanRel && cleanRel !== "partner") params.set("rel", cleanRel);

    const cleanLang = sanitizeUrlParam(language);
    if (cleanLang && cleanLang !== "en") params.set("lang", cleanLang);

    if (age !== undefined && age !== null && String(age).trim() !== "") {
        params.set("age", String(age).trim());
    }

    const cleanSender = sanitizeUrlParam(senderName);
    if (cleanSender) params.set("sender", cleanSender);

    const cleanColor = sanitizeUrlParam(color);
    if (cleanColor && cleanColor !== "#FF6B6B" && cleanColor !== "#FF2A6D") {
        params.set("color", cleanColor);
    }

    const cleanPhase = sanitizeUrlParam(phase);
    if (cleanPhase) params.set("phase", cleanPhase);

    if (includeUtm) {
        params.set("utm_source", "share");
        params.set("utm_medium", "social");
        params.set("utm_campaign", "birthday_celebration");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Parses URL query parameters into strongly typed configuration keys.
 */
export const parseCelebrationParams = (search: string): ParsedCelebrationQuery => {
    if (!search) return {};
    const params = new URLSearchParams(search);
    const result: ParsedCelebrationQuery = {};

    const name = params.get("name") || params.get("recipient") || params.get("user");
    if (name) result.name = name.trim();

    const rel = params.get("rel") || params.get("relationship");
    if (rel) result.relationship = rel.trim();

    const lang = params.get("lang") || params.get("language");
    if (lang) result.language = lang.trim();

    const age = params.get("age");
    if (age && !isNaN(parseInt(age, 10))) result.age = parseInt(age, 10);

    const sender = params.get("sender") || params.get("from") || params.get("wisher");
    if (sender) result.senderName = sender.trim();

    const color = params.get("color") || params.get("theme");
    if (color) result.color = color.trim();

    const phase = params.get("phase");
    if (phase) result.phase = phase.trim();

    return result;
};
