/**
 * @reflection
 * [IDENTITY]: CategoryTabs
 * [PURPOSE]: React UI component: CategoryTabs.
 * [STATE]: Experimental
 * [ANCHOR]: CategoryTabs
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { QUESTION_CATEGORIES } from '../../../game/AnamnesisEngine.js';

export default function CategoryTabs({ anamnesisCategory, setAnamnesisCategory, isDark }) {
    return (
        <div className="flex items-end gap-1 overflow-x-auto snap-x snap-mandatory no-scrollbar translate-y-[1px] relative z-20 px-2 pb-[1px]">
            {Object.entries(QUESTION_CATEGORIES).map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => setAnamnesisCategory(key)}
                    className={`
                        snap-start relative px-4 py-2.5 md:py-2 text-tag whitespace-nowrap font-black uppercase tracking-tight transition-all duration-300
                        rounded-t-2xl border-t border-x min-w-[3.5rem]
                        ${anamnesisCategory === key
                            ? (isDark
                                ? 'bg-slate-800 border-blue-500/40 text-blue-400 z-30 h-10 shadow-[0_-8px_15px_-3px_rgba(59,130,246,0.15)] translate-y-[2px]'
                                : 'bg-white border-slate-300 text-blue-600 z-30 h-10 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] translate-y-[2px]')
                            : (isDark
                                ? 'bg-slate-900/60 border-slate-800/80 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 h-8 opacity-80 mt-2'
                                : 'bg-slate-100/90 border-slate-200 text-slate-500 hover:bg-slate-50 h-8 opacity-80 mt-2')
                        }
                    `}
                >
                    {label}
                    {anamnesisCategory === key && (
                        <>
                            {/* Bottom seamless connection */}
                            <div className={`absolute -bottom-[3px] left-[1px] right-[1px] h-[5px] ${isDark ? 'bg-slate-800' : 'bg-white'} z-40`} />
                            {/* Blue Glow indicator */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${isDark ? 'bg-blue-500/50' : 'bg-blue-500/30'}`} />
                        </>
                    )}
                </button>
            ))}
        </div>
    );
}
