export const DEFAULT_LANGUAGE = 'id';
export const LANGUAGE_STORAGE_KEY = 'primer-language';

export const SUPPORTED_LANGUAGES = ['id', 'en'];

export const SUPPORTED_LANGUAGE_OPTIONS = [
    { id: 'id', label: 'Bahasa Indonesia', nativeLabel: 'Indonesia', status: 'ready' },
    { id: 'en', label: 'English', nativeLabel: 'English', status: 'ready' },
];

export const PLANNED_LANGUAGE_OPTIONS = [
    { id: 'fr-BE', label: 'French (Belgium)', nativeLabel: 'Francais (Belgique)', status: 'planned' },
    { id: 'nl-BE', label: 'Dutch (Belgium)', nativeLabel: 'Nederlands (Belgie)', status: 'planned' },
];

export function normalizeSupportedLanguage(language) {
    return SUPPORTED_LANGUAGES.includes(language) ? language : null;
}

export function getStoredLanguagePreference(storage = typeof window !== 'undefined' ? window.localStorage : null) {
    try {
        const storedLanguage = storage?.getItem?.(LANGUAGE_STORAGE_KEY);
        return normalizeSupportedLanguage(storedLanguage) || DEFAULT_LANGUAGE;
    } catch {
        return DEFAULT_LANGUAGE;
    }
}
