/**
 * @reflection
 * [IDENTITY]: PhysicalExamTab
 * [PURPOSE]: React UI component: PhysicalExamTab.
 * [STATE]: Experimental
 * [ANCHOR]: PhysicalExamTab
 * [DEPENDS_ON]: ProceduresDB, WikiData, BodyMapWidget
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import { Stethoscope, Info, Sparkles } from 'lucide-react';
import { PHYSICAL_EXAM_OPTIONS } from '../../data/ProceduresDB.js';
import { findWikiKey } from '../../data/WikiData.js';
import BodyMapWidget from '../BodyMapWidget.jsx';

export default function PhysicalExamTab({ patient: _patient, isDark, handleExam, examsPerformed, examResultsRef, openWiki, maiaSuggestions, anamnesisScore }) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* MAIA Banner */}
            {anamnesisScore >= 30 && (
                <div className={`shrink-0 mb-4 p-3 rounded-xl border flex items-center justify-between transition-all shadow-sm ${isDark
                        ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200'
                        : 'bg-indigo-50 border-indigo-100 text-indigo-800'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-80">Saran MAIA</h4>
                            {maiaSuggestions?.length > 0 ? (
                                <p className="text-xs font-medium">
                                    Pertimbangkan untuk memeriksa: <span className="font-bold text-indigo-600 dark:text-indigo-300">{maiaSuggestions.map(s => s.label).join(', ')}</span>
                                </p>
                            ) : (
                                <p className="text-xs font-medium opacity-90">✨ Tidak ada usulan pemeriksaan fisik lebih lanjut.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Left: Body Map */}
                <div className="flex flex-col gap-3 min-h-0">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-3 rounded-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'}`} />
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Pemeriksaan Fisik
                            </h4>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            Interactive Body Map
                        </div>
                    </div>
                    <div className={`flex-1 overflow-hidden rounded-2xl border-2 border-dashed p-1 ${isDark ? 'bg-slate-950/20 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
                        <BodyMapWidget
                            isDark={isDark}
                            onExam={handleExam}
                            examsPerformed={examsPerformed}
                        />
                    </div>
                </div>

                {/* Right: Findings List */}
                <div className="flex flex-col gap-3 min-h-0">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-3 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-blue-400' : 'text-slate-500'}`}>
                                Temuan Klinis
                            </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-black text-[9px] ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                            {Object.keys(examsPerformed).length} TEMUAN
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 thin-scrollbar">
                        {Object.entries(examsPerformed).map(([key, finding]) => {
                            const wikiKey = findWikiKey('prob', key);
                            return (
                                <div key={key} className={`group relative p-4 rounded-xl border-2 border-dashed transition-all duration-300 animate-slideRight ${isDark
                                    ? 'bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/40 hover:bg-slate-900/60'
                                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                                    }`}>
                                    {/* Left Color Bar Accent */}
                                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-lg shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all ${isDark ? 'bg-emerald-500/40 group-hover:bg-emerald-500' : 'bg-emerald-500'
                                        }`} />

                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                            {PHYSICAL_EXAM_OPTIONS[key]?.name || key}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {wikiKey && (
                                                <button
                                                    onClick={() => openWiki(wikiKey)}
                                                    className={`p-1 rounded-md transition-colors ${isDark ? 'text-slate-600 hover:text-emerald-400 hover:bg-emerald-400/10' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    <Info size={12} />
                                                </button>
                                            )}
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>
                                    <p className={`text-[11px] leading-relaxed pl-2 font-medium ${isDark ? 'text-slate-300/90' : 'text-slate-700'}`}>
                                        {finding}
                                    </p>
                                </div>
                            );
                        })}
                        {Object.keys(examsPerformed).length === 0 && (
                            <div className={`mt-10 p-12 text-center rounded-3xl border-2 border-dashed transition-colors ${isDark ? 'border-slate-800/50 bg-slate-900/20 text-slate-700' : 'border-slate-100 bg-slate-50/50 text-slate-300'}`}>
                                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                                    <Stethoscope size={32} className="opacity-20 translate-y-[-1px]" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] leading-normal opacity-40">
                                    Belum Dilakukan<br />Pemeriksaan Fisik
                                </p>
                            </div>
                        )}
                        <div ref={examResultsRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
