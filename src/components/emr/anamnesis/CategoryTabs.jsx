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
import { getLocalizedQuestionCategory, getLocalizedQuestionShortLabel } from '../../../game/anamnesis/QuestionPresentation.js';

export default function CategoryTabs({ anamnesisCategory, setAnamnesisCategory, isDark, t }) {
    return (
        <div className={`mb-2 flex gap-1 overflow-x-auto no-scrollbar rounded-2xl border p-1.5 ${isDark ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 bg-slate-100/80'}`}>
            {Object.keys(QUESTION_CATEGORIES).map((key) => {
                const label = getLocalizedQuestionCategory(key, t);
                const shortLabel = getLocalizedQuestionShortLabel(key, t);

                return (
                    <button
                        key={key}
                        onClick={() => setAnamnesisCategory(key)}
                        className={`
                        relative shrink-0 rounded-xl px-3 py-2 text-[10px] md:text-xs whitespace-nowrap font-black uppercase tracking-[0.12em] transition-all duration-200
                        min-w-[3.25rem] md:min-w-[4.25rem]
                        ${anamnesisCategory === key
                            ? (isDark
                                ? 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30'
                                : 'bg-white text-blue-700 ring-1 ring-blue-200 shadow-sm')
                            : (isDark
                                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                : 'text-slate-500 hover:bg-white hover:text-slate-700')
                        }
                    `}
                    >
                        <span className="lg:hidden">{shortLabel}</span>
                        <span className="hidden lg:inline xl:hidden">{shortLabel}</span>
                        <span className="hidden xl:inline">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
