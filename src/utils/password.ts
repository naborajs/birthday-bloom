import {
    parseRawBirthdayDate,
    formatDateByPattern,
    type ParsedDate,
} from "./dateUtils";

export { parseRawBirthdayDate, type ParsedDate };

/**
 * Generates formatted password string from raw birthday date input.
 */
export const generatePasswordFromDate = (
    rawDate: string | null | undefined,
    format: string = 'MMDD'
): string => {
    const parsed = parseRawBirthdayDate(rawDate);
    if (!parsed) return '';
    return formatDateByPattern(parsed, format);
};

/**
 * Resolves the effective celebration password, falling back to birthday-derived formats.
 */
export const getEffectivePassword = (config: {
    password?: string;
    birthdayDate?: Date | string | null;
    passwordFormat?: string;
}): string => {
    if (config.password && config.password.trim().length > 0) {
        return config.password.trim();
    }
    if (config.birthdayDate) {
        if (config.birthdayDate instanceof Date) {
            const year = String(config.birthdayDate.getFullYear());
            const month = String(config.birthdayDate.getMonth() + 1).padStart(2, '0');
            const day = String(config.birthdayDate.getDate()).padStart(2, '0');
            return formatDateByPattern({ year, month, day }, config.passwordFormat || 'MMDD');
        }
        return generatePasswordFromDate(config.birthdayDate, config.passwordFormat);
    }
    const rawEnvDate = import.meta.env.VITE_BIRTHDAY_DATE;
    if (rawEnvDate) {
        return generatePasswordFromDate(rawEnvDate, config.passwordFormat);
    }
    return '';
};

/**
 * Resolves all valid passwords that can unlock the celebration:
 * - The custom configured password (if any)
 * - The birthday date in all common formats (MMDD, DDMM, YYYYMMDD, DDMMYYYY, YYYY-MM-DD, DD-MM, MM-DD, YYYY, etc.)
 */
export const getAllValidPasswords = (config: {
    password?: string;
    birthdayDate?: Date | string | null;
    passwordFormat?: string;
}): string[] => {
    const valid = new Set<string>();

    // 1. Custom configured password
    if (config.password && config.password.trim().length > 0) {
        valid.add(config.password.trim());
    }

    // 2. Birthday Date derived passwords
    let parsed: ParsedDate | null = null;
    if (config.birthdayDate) {
        if (config.birthdayDate instanceof Date && !isNaN(config.birthdayDate.getTime())) {
            parsed = {
                year: String(config.birthdayDate.getFullYear()),
                month: String(config.birthdayDate.getMonth() + 1).padStart(2, '0'),
                day: String(config.birthdayDate.getDate()).padStart(2, '0'),
            };
        } else if (typeof config.birthdayDate === 'string') {
            parsed = parseRawBirthdayDate(config.birthdayDate);
        }
    } else if (import.meta.env.VITE_BIRTHDAY_DATE) {
        parsed = parseRawBirthdayDate(import.meta.env.VITE_BIRTHDAY_DATE);
    }

    if (parsed) {
        const { year, month, day } = parsed;
        // Add all common birthday date formats
        valid.add(`${month}${day}`);           // MMDD (e.g. 1018)
        valid.add(`${day}${month}`);           // DDMM (e.g. 1810)
        valid.add(`${year}${month}${day}`);   // YYYYMMDD
        valid.add(`${day}${month}${year}`);   // DDMMYYYY
        valid.add(`${year}-${month}-${day}`); // YYYY-MM-DD
        valid.add(`${day}-${month}-${year}`); // DD-MM-YYYY
        valid.add(`${day}/${month}/${year}`); // DD/MM/YYYY
        valid.add(`${month}/${day}/${year}`); // MM/DD/YYYY
        valid.add(`${month}-${day}`);          // MM-DD
        valid.add(`${day}-${month}`);          // DD-MM
        valid.add(`${month}/${day}`);          // MM/DD
        valid.add(`${day}/${month}`);          // DD/MM
        valid.add(year);                       // YYYY
        if (config.passwordFormat) {
            valid.add(formatDateByPattern(parsed, config.passwordFormat));
        }
    }

    return Array.from(valid);
};

/**
 * Validates whether the user's entered passcode matches ANY acceptable password
 * (custom secret password OR the celebrant's birthday in any common format).
 * Case-insensitive, whitespace-trimmed, and punctuation-resilient.
 */
export const validateCelebrationPassword = (
    input: string,
    config: {
        password?: string;
        birthdayDate?: Date | string | null;
        passwordFormat?: string;
    }
): boolean => {
    if (!input || typeof input !== 'string') return false;
    const cleanInput = input.trim();
    if (!cleanInput) return false;

    const lowerInput = cleanInput.toLowerCase();
    const alphanumericInput = lowerInput.replace(/[^a-z0-9]/g, '');

    const candidates = getAllValidPasswords(config);
    for (const cand of candidates) {
        const lowerCand = cand.toLowerCase();
        // Direct exact match (case-insensitive)
        if (lowerInput === lowerCand) return true;
        // Punctuation-stripped match (e.g. "18/10" matches "18-10" or "1810")
        const alphanumericCand = lowerCand.replace(/[^a-z0-9]/g, '');
        if (alphanumericInput && alphanumericCand && alphanumericInput === alphanumericCand) {
            return true;
        }
    }
    return false;
};

/**
 * Determines whether password protection gate is active for the current configuration.
 */
export const isPasswordRequired = (config: {
    password?: string;
    passwordRequired?: boolean;
}): boolean => {
    if (config.passwordRequired !== undefined) {
        return config.passwordRequired;
    }
    return !!config.password && config.password.trim().length > 0;
};
