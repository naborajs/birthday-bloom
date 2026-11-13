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
