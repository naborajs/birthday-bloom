import { parseRawBirthdayDate } from "./password";

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
