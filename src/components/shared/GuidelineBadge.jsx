/**
 * GuidelineBadge — Inline reference badge linking to medical guidelines.
 * 
 * Features:
 * - Compact inline badge with source label
 * - Tooltip on hover/tap showing full reference text
 * - Color-coded by source type (Permenkes, WHO, IDAI)
 * - Dark mode aware
 * 
 * @param {{ source: 'permenkes'|'who'|'idai'|'kemenkes', text: string, reference?: string }} props
 */
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SOURCE_CONFIG = {
    permenkes: { label: 'Permenkes', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    who: { label: 'WHO', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    idai: { label: 'IDAI', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    kemenkes: { label: 'Kemenkes', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
};

export default function GuidelineBadge({ source = 'permenkes', text, reference }) {
    const { isDark } = useTheme();
    const [showTooltip, setShowTooltip] = useState(false);
    const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.permenkes;

    // Resolve dark mode class manually since Tailwind dark: variant may not work with isDark toggle
    const colorClass = isDark
        ? config.color.split(' ').filter(c => c.startsWith('dark:')).map(c => c.replace('dark:', '')).join(' ')
        || 'bg-slate-700 text-slate-300'
        : config.color.split(' ').filter(c => !c.startsWith('dark:')).join(' ');

    return (
        <span className="relative inline-flex items-center">
            <button
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:scale-105 ${colorClass}`}
            >
                <BookOpen size={10} />
                <span>{config.label}</span>
            </button>

            {/* Tooltip */}
            {showTooltip && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl shadow-xl z-50 text-xs leading-relaxed transition-all ${isDark
                        ? 'bg-slate-700 text-slate-200 border border-slate-600'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                    {/* Arrow */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${isDark ? 'border-t-slate-700' : 'border-t-white'
                        }`} />

                    <div className="font-bold mb-1">{config.label}</div>
                    <div className="opacity-90">{text}</div>
                    {reference && (
                        <div className={`mt-2 pt-2 border-t text-[10px] italic opacity-60 ${isDark ? 'border-slate-600' : 'border-slate-200'
                            }`}>
                            📖 {reference}
                        </div>
                    )}
                </div>
            )}
        </span>
    );
}
