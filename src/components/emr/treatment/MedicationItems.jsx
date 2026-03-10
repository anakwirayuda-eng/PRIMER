/**
 * @reflection
 * [IDENTITY]: MedicationItems
 * [PURPOSE]: React UI component: MedicationItem.
 * [STATE]: Experimental
 * [ANCHOR]: MedicationItem
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { Pill, CheckCircle, Plus, Info, Brain } from 'lucide-react';
import { findWikiKey } from '../../../data/WikiData.js';

export function MedicationItem({ med, isDark, isSelected, toggleMed, openWiki }) {
    const wikiKey = findWikiKey('med', med.id);

    return (
        <div className="group flex gap-1">
            <button
                onClick={() => toggleMed(med)}
                className={`flex-1 text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${isSelected
                    ? (isDark ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-emerald-600 text-white border-emerald-700 shadow-md')
                    : (isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30 text-slate-400' : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-600 shadow-sm')}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Pill size={14} className={isSelected ? 'text-white' : 'text-emerald-500 opacity-50'} />
                    <div className="truncate">
                        <p className="text-xs font-bold leading-none">{med.name}</p>
                        <p className={`text-[9px] mt-0.5 opacity-60`}>{med.category}</p>
                    </div>
                </div>
                {isSelected && <CheckCircle size={14} />}
            </button>
            {wikiKey && (
                <button
                    onClick={() => openWiki(wikiKey)}
                    className={`w-9 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-600 hover:text-emerald-400' : 'bg-white border-slate-100 text-slate-400 hover:text-emerald-600'}`}
                >
                    <Info size={14} />
                </button>
            )}
        </div>
    );
}

export function RecommendedMed({ med, isDark, isSelected, toggleMed, openWiki }) {
    const wikiKey = findWikiKey('med', med.id);

    return (
        <div className="group flex gap-1 animate-fadeIn">
            <button
                onClick={() => toggleMed(med)}
                className={`flex-1 text-left p-2.5 rounded-xl border-2 flex items-center justify-between transition-all ${isSelected
                    ? (isDark ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-emerald-600 border-emerald-700 text-white shadow-md')
                    : (isDark ? 'bg-slate-800/40 border-slate-800 hover:border-emerald-500/50 text-slate-300' : 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300 text-emerald-900')}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20' : (isDark ? 'bg-slate-900' : 'bg-white shadow-sm')}`}>
                        <Pill size={16} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-black leading-tight uppercase tracking-tight">{med.name}</p>
                        <p className={`text-[10px] font-medium opacity-70`}>{med.category}</p>
                    </div>
                </div>
                {isSelected ? <CheckCircle size={14} /> : <Plus size={14} className="opacity-30 group-hover:opacity-100" />}
            </button>
            {wikiKey && (
                <button
                    onClick={() => openWiki(wikiKey)}
                    className={`w-10 flex items-center justify-center rounded-xl border-2 transition-all ${isDark ? 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50' : 'bg-white border-slate-100 text-slate-400 hover:text-emerald-600'}`}
                >
                    <Info size={14} />
                </button>
            )}
        </div>
    );
}
