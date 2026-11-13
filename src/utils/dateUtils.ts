export interface ParsedDate {
    year: string;
    month: string;
    day: string;
}

/**
 * Parses raw date string or ISO timestamp into structured year/month/day parts.
 */
export const parseRawBirthdayDate = (rawDate: string | null | undefined): ParsedDate | null => {
    if (!rawDate) return null;
    const clean = rawDate.trim().replace('TH', 'T');
    if (!clean) return null;

    const dateObj = new Date(clean);
    if (!isNaN(dateObj.getTime())) {
        const year = String(dateObj.getFullYear());
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return { year, month, day };
    }

    const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
        return {
            year: ymdMatch[1],
            month: ymdMatch[2].padStart(2, '0'),
            day: ymdMatch[3].padStart(2, '0'),
        };
    }

    const mdMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})/);
    if (mdMatch) {
        const val1 = parseInt(mdMatch[1], 10);
        const val2 = parseInt(mdMatch[2], 10);
        const currentYear = String(new Date().getFullYear());
        if (val1 > 12) {
            return {
                year: currentYear,
                month: String(val2).padStart(2, '0'),
                day: String(val1).padStart(2, '0'),
            };
        }
        return {
            year: currentYear,
            month: String(val1).padStart(2, '0'),
            day: String(val2).padStart(2, '0'),
        };
    }
    return null;
};

/**
 * Formats date parts according to a requested token pattern.
 */
export const formatDateByPattern = (
    parts: { year: string; month: string; day: string },
    format: string = 'MMDD'
): string => {
    const { year, month, day } = parts;
    const fmt = format.toUpperCase().trim();
    switch (fmt) {
        case 'DDMM': return `${day}${month}`;
        case 'YYYYMMDD': return `${year}${month}${day}`;
        case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
        case 'MM-DD': return `${month}-${day}`;
        case 'DD-MM': return `${day}-${month}`;
        case 'YYYY': return year;
        case 'MMDD':
        default: return `${month}${day}`;
    }
};

/**
 * Calculates how many days remain until the next occurrence of a birthday.
 * Returns 0 if today is the birthday.
 */
export const getDaysUntilBirthday = (
    birthday: Date | string | null | undefined,
    referenceDate: Date = new Date()
): number => {
    let parsedMonth: number;
    let parsedDay: number;

    if (birthday instanceof Date) {
        if (isNaN(birthday.getTime())) return 0;
        parsedMonth = birthday.getMonth();
        parsedDay = birthday.getDate();
    } else {
        const parsed = parseRawBirthdayDate(birthday);
        if (!parsed) return 0;
        parsedMonth = parseInt(parsed.month, 10) - 1;
        parsedDay = parseInt(parsed.day, 10);
    }

    const currentYear = referenceDate.getFullYear();
    const today = new Date(currentYear, referenceDate.getMonth(), referenceDate.getDate());
    let nextBday = new Date(currentYear, parsedMonth, parsedDay);

    if (today.getTime() === nextBday.getTime()) {
        return 0;
    }

    if (today > nextBday) {
        nextBday = new Date(currentYear + 1, parsedMonth, parsedDay);
    }

    const diffMs = nextBday.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Determines if today is the birthday.
 */
export const isTodayBirthday = (
    birthday: Date | string | null | undefined,
    referenceDate: Date = new Date()
): boolean => {
    return getDaysUntilBirthday(birthday, referenceDate) === 0;
};

/**
 * Calculates current age from a birth date.
 */
export const calculateAge = (
    birthDate: Date | string | null | undefined,
    referenceDate: Date = new Date()
): number | null => {
    let birthYear: number;
    let birthMonth: number;
    let birthDay: number;

    if (birthDate instanceof Date) {
        if (isNaN(birthDate.getTime())) return null;
        birthYear = birthDate.getFullYear();
        birthMonth = birthDate.getMonth();
        birthDay = birthDate.getDate();
    } else {
        const parsed = parseRawBirthdayDate(birthDate);
        if (!parsed) return null;
        birthYear = parseInt(parsed.year, 10);
        birthMonth = parseInt(parsed.month, 10) - 1;
        birthDay = parseInt(parsed.day, 10);
    }

    let age = referenceDate.getFullYear() - birthYear;
    const monthDiff = referenceDate.getMonth() - birthMonth;

    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDay)) {
        age--;
    }

    return Math.max(0, age);
};

/**
 * Formats a birthday date for polite display.
 */
export const formatBirthdayDisplay = (
    birthday: Date | string | null | undefined,
    locale: string = "en-US"
): string => {
    if (!birthday) return "";
    let dateObj: Date;

    if (birthday instanceof Date) {
        dateObj = birthday;
    } else {
        const parsed = parseRawBirthdayDate(birthday);
        if (!parsed) return "";
        dateObj = new Date(parseInt(parsed.year, 10), parseInt(parsed.month, 10) - 1, parseInt(parsed.day, 10));
    }

    if (isNaN(dateObj.getTime())) return "";

    return dateObj.toLocaleDateString(locale, {
        month: "long",
        day: "numeric",
    });
};
