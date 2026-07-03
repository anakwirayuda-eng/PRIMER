/**
 * @reflection
 * [IDENTITY]: SettingsModal
 * [PURPOSE]: Game settings panel with unified theme picker, language selector, volume, and game actions.
 * [STATE]: Runtime-Audited
 * [ANCHOR]: SettingsModal
 * [DEPENDS_ON]: GameContext, ThemeContext, AppMetadata, i18n
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, LogOut, Volume2, X, Check, Palette, Languages, Settings2 as SettingsIcon } from 'lucide-react';

import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { DEFAULT_LANGUAGE, PLANNED_LANGUAGE_OPTIONS, SUPPORTED_LANGUAGE_OPTIONS } from '../config/languages.js';
import { useGame } from '../context/GameContext.jsx';
import { useTheme, THEMES } from '../context/ThemeContext.jsx';
import { APP_METADATA } from '../data/AppMetadata.js';
import useModalA11y from '../hooks/useModalA11y.js';

const THEME_LIST = Object.values(THEMES);

export default function SettingsModal({ onClose }) {
    const { settings, updateSettings, saveGame, logout, restartGame: _restartGame } = useGame();
    const { themeId, setThemeId } = useTheme();
    const { t, i18n } = useTranslation();
    const modalRef = useModalA11y(onClose);
    const currentLanguage = settings?.language || i18n.resolvedLanguage || i18n.language || DEFAULT_LANGUAGE;
    const appOrganization = t('app.organization', { defaultValue: APP_METADATA.organization });

    const handleSave = () => {
        const success = saveGame();
        if (success) {
            onClose();
        }
    };

    const handleThemeChange = (id) => {
        setThemeId(id);
        updateSettings({ theme: id });
    };

    const handleLanguageChange = async (languageId) => {
        await i18n.changeLanguage(languageId);
        updateSettings({ language: languageId });
    };

    return (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700"
            >
                <div className="bg-slate-100 dark:bg-slate-900 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 id="settings-title" className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <SettingsIcon size={18} className="text-slate-500 dark:text-slate-300" />
                        {t('settings.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label={t('settings.close')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2 block flex justify-between">
                            <span>{t('settings.volume')}</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">{Math.round(settings.volume * 100)}%</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <Volume2 size={18} className="text-slate-400" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.volume}
                                onChange={(event) => updateSettings({ volume: parseFloat(event.target.value) })}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    <div>
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Languages size={14} /> {t('settings.language')}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                            {t('settings.language_help')}
                        </p>
                        <div className="grid grid-cols-1 gap-2.5">
                            {SUPPORTED_LANGUAGE_OPTIONS.map((language) => {
                                const isActive = currentLanguage === language.id;
                                return (
                                    <button
                                        key={language.id}
                                        type="button"
                                        onClick={() => handleLanguageChange(language.id)}
                                        className={`
                                            relative flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all duration-200
                                            ${isActive
                                                ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/30 shadow-lg'
                                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="text-left min-w-0">
                                            <div className="text-sm font-bold text-slate-800 dark:text-white">{language.label}</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                {language.nativeLabel}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {PLANNED_LANGUAGE_OPTIONS.length > 0 && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                                {t('settings.language_future', {
                                    languages: PLANNED_LANGUAGE_OPTIONS.map((language) => language.nativeLabel).join(', ')
                                })}
                            </p>
                        )}
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    <div>
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Palette size={14} /> {t('settings.theme')}
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                            {THEME_LIST.map((themeOption) => {
                                const isActive = themeId === themeOption.id;
                                const themeName = t(`settings.themes.${themeOption.id}.name`, { defaultValue: themeOption.name });
                                const themeDescription = t(`settings.themes.${themeOption.id}.description`, { defaultValue: themeOption.description });
                                return (
                                    <button
                                        key={themeOption.id}
                                        onClick={() => handleThemeChange(themeOption.id)}
                                        className={`
                                            relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                                            ${isActive
                                                ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/30 shadow-lg'
                                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="flex-shrink-0 flex flex-col gap-0.5 w-8 rounded-lg overflow-hidden shadow-inner">
                                            <div className="h-3" style={{ backgroundColor: themeOption.colors.bg }} />
                                            <div className="h-3" style={{ backgroundColor: themeOption.colors.panel }} />
                                            <div className="h-3" style={{ backgroundColor: themeOption.colors.primary }} />
                                            <div className="h-3" style={{ backgroundColor: themeOption.colors.accent }} />
                                        </div>

                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800 dark:text-white">{themeName}</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                                    themeOption.isDark
                                                        ? 'bg-slate-700 text-slate-300 dark:bg-slate-600'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-800/40 dark:text-amber-300'
                                                }`}>
                                                    {themeOption.isDark ? t('settings.theme_dark') : t('settings.theme_light')}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                {themeDescription}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    <div className="space-y-3">
                        <button
                            onClick={handleSave}
                            className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                        >
                            <Save size={18} /> {t('settings.save')}
                        </button>

                        <button
                            onClick={logout}
                            className="w-full p-3 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                            <LogOut size={18} /> {t('settings.logout')}
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-6 opacity-40 grayscale" />
                        <div className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            {t('settings.footer_signature', { version: APP_METADATA.version, organization: appOrganization })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
