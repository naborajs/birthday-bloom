import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { TranslationSchema } from "./types";
import { enTranslations } from "./locales/en";
import { hiTranslations } from "./locales/hi";

export type SupportedLanguage = 'en' | 'hi';

export const translations: Record<SupportedLanguage, TranslationSchema> = {
    en: enTranslations,
    hi: hiTranslations,
};

export const getTranslation = (lang?: string): TranslationSchema => {
    const normalized = (lang || '').toLowerCase().trim();
    if (normalized === 'hi' || normalized === 'hindi' || normalized === 'in') {
        return hiTranslations;
    }
    return enTranslations;
};

export const interpolate = (text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;
    return Object.entries(params).reduce((acc, [key, val]) => {
        return acc.replace(new RegExp(`\\{\\{?${key}\\}?\\}`, 'g'), String(val));
    }, text);
};

export const getTranslationValue = (lang: string, keyPath: string, params?: Record<string, string | number>): string => {
    const dict = getTranslation(lang);
    const keys = keyPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = dict;
    for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
            current = current[k];
        } else {
            // Fallback to English
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let fallbackCurrent: any = enTranslations;
            for (const fk of keys) {
                if (fallbackCurrent && typeof fallbackCurrent === 'object' && fk in fallbackCurrent) {
                    fallbackCurrent = fallbackCurrent[fk];
                } else {
                    return keyPath;
                }
            }
            return interpolate(String(fallbackCurrent), params);
        }
    }
    return interpolate(String(current), params);
};

export const useTranslation = () => {
    const rawLanguage = useBirthdayStore(state => state.config.language);
    const language: SupportedLanguage = rawLanguage === 'hi' ? 'hi' : 'en';
    const currentTranslations = translations[language] || enTranslations;

    const t = (keyPath: string, params?: Record<string, string | number>): string => {
        return getTranslationValue(language, keyPath, params);
    };

    return {
        t,
        language,
        isHindi: language === 'hi',
        translations: currentTranslations,
    };
};
