/**
 * @reflection
 * [IDENTITY]: i18n
 * [PURPOSE]: Module: i18n
 * [STATE]: Experimental
 * [ANCHOR]: i18n
 * [DEPENDS_ON]: en, id
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';
import enWilayah from './locales/wilayah/en.js';
import idWilayah from './locales/wilayah/id.js';
import enEmergency from './locales/emergency/en.js';
import idEmergency from './locales/emergency/id.js';
import enEmr from './locales/emr/en.js';
import idEmr from './locales/emr/id.js';
import {
    DEFAULT_LANGUAGE,
    LANGUAGE_STORAGE_KEY,
    SUPPORTED_LANGUAGES,
    getStoredLanguagePreference
} from './config/languages.js';

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeLocale(base, extension) {
    if (Array.isArray(base) && Array.isArray(extension)) {
        return extension;
    }
    if (isPlainObject(base) && isPlainObject(extension)) {
        const merged = { ...base };
        for (const [key, value] of Object.entries(extension)) {
            merged[key] = key in merged ? mergeLocale(merged[key], value) : value;
        }
        return merged;
    }
    return extension ?? base;
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: mergeLocale(mergeLocale(mergeLocale(en, enWilayah), enEmergency), enEmr) },
            id: { translation: mergeLocale(mergeLocale(mergeLocale(id, idWilayah), idEmergency), idEmr) },
        },
        lng: getStoredLanguagePreference(),
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: SUPPORTED_LANGUAGES,
        load: 'languageOnly',
        interpolation: {
            escapeValue: false,
        },
    });

if (typeof window !== 'undefined') {
    i18n.on('languageChanged', (language) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) return;
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    });
}

export {
    DEFAULT_LANGUAGE,
    LANGUAGE_STORAGE_KEY,
    SUPPORTED_LANGUAGES
};

export default i18n;
