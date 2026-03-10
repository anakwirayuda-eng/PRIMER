/**
 * @reflection
 * [IDENTITY]: SettingsModal
 * [PURPOSE]: Game settings panel with unified theme picker, volume, and game actions.
 * [STATE]: Stable
 * [ANCHOR]: SettingsModal
 * [DEPENDS_ON]: GameContext, ThemeContext, AppMetadata
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-17
 */

import React from 'react';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { useGame } from '../context/GameContext.jsx';
import { useTheme, THEMES } from '../context/ThemeContext.jsx';
import { Save, LogOut, Volume2, X, Check, Palette } from 'lucide-react';
import { APP_METADATA } from '../data/AppMetadata.js';
import useModalA11y from '../hooks/useModalA11y.js';

const THEME_LIST = Object.values(THEMES);

export default function SettingsModal({ onClose }) {
    const { settings, updateSettings, saveGame, logout, restartGame: _restartGame } = useGame();
    const { themeId, setThemeId } = useTheme();
    const modalRef = useModalA11y(onClose);

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

    return (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="settings-title" className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="bg-slate-100 dark:bg-slate-900 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                    <h2 id="settings-title" className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="text-xl">⚙️</span> Pengaturan Sistem
                    </h2>
                    <button onClick={onClose} aria-label="Tutup pengaturan" className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Volume Control */}
                    <div>
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2 block flex justify-between">
                            <span>Master Volume</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400">{Math.round(settings.volume * 100)}%</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <Volume2 size={18} className="text-slate-400" />
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={settings.volume}
                                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-700" />

                    {/* Unified Theme Picker */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Palette size={14} /> Pilih Tema
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5">
                            {THEME_LIST.map(t => {
                                const isActive = themeId === t.id;
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => handleThemeChange(t.id)}
                                        className={`
                                            relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                                            ${isActive
                                                ? 'border-emerald-500 dark:border-emerald-400 ring-1 ring-emerald-500/30 shadow-lg'
                                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        {/* Color Swatch Strip */}
                                        <div className="flex-shrink-0 flex flex-col gap-0.5 w-8 rounded-lg overflow-hidden shadow-inner">
                                            <div className="h-3" style={{ backgroundColor: t.colors.bg }} />
                                            <div className="h-3" style={{ backgroundColor: t.colors.panel }} />
                                            <div className="h-3" style={{ backgroundColor: t.colors.primary }} />
                                            <div className="h-3" style={{ backgroundColor: t.colors.accent }} />
                                        </div>

                                        {/* Theme Info */}
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800 dark:text-white">{t.name}</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${t.isDark
                                                    ? 'bg-slate-700 text-slate-300 dark:bg-slate-600'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-800/40 dark:text-amber-300'
                                                    }`}>
                                                    {t.isDark ? 'DARK' : 'LIGHT'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                {t.description}
                                            </p>
                                        </div>

                                        {/* Active check */}
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

                    {/* Game Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSave}
                            className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                        >
                            <Save size={18} /> Simpan Permainan (Quick Save)
                        </button>

                        <button
                            onClick={logout}
                            className="w-full p-3 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                        >
                            <LogOut size={18} /> Keluar ke Menu Utama
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-6 opacity-40 grayscale" />
                        <div className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            PRIMER v{APP_METADATA.version} • {APP_METADATA.organization}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
