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

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            id: { translation: id },
        },
        lng: 'id', // Default to Indonesian
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
