import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { TranslationSchema } from "./types";
import { enTranslations } from "./locales/en";
import { hiTranslations } from "./locales/hi";
import { bnTranslations } from "./locales/bn";
import { fr as frTranslations } from "./locales/fr";

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'fr';

export const translations: Record<SupportedLanguage, TranslationSchema> = {
    en: enTranslations,
    hi: hiTranslations,
    bn: bnTranslations,
    fr: frTranslations,
};

export const getTranslation = (lang?: string): TranslationSchema => {
    const normalized = (lang || '').toLowerCase().trim();
    if (normalized === 'fr' || normalized === 'french' || normalized === 'francais' || normalized === 'française' || normalized === 'francaise') {
        return frTranslations;
    }
    if (normalized === 'bn' || normalized === 'bengali' || normalized === 'bangla') {
        return bnTranslations;
    }
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
    const normalized = (rawLanguage || '').toLowerCase().trim();
    const language: SupportedLanguage =
        normalized === 'fr' || normalized === 'french' || normalized === 'francais' || normalized === 'française' || normalized === 'francaise'
            ? 'fr'
            : normalized === 'bn' || normalized === 'bengali' || normalized === 'bangla'
                ? 'bn'
                : normalized === 'hi' || normalized === 'hindi' || normalized === 'in'
                    ? 'hi'
                    : 'en';
    const currentTranslations = translations[language] || enTranslations;

    const t = (keyPath: string, params?: Record<string, string | number>): string => {
        return getTranslationValue(language, keyPath, params);
    };

    return {
        t,
        language,
        isHindi: language === 'hi',
        isBengali: language === 'bn',
        isFrench: language === 'fr',
        translations: currentTranslations,
    };
};
