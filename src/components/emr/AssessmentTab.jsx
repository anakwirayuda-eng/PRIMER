/**
 * @reflection
 * [IDENTITY]: AssessmentTab
 * [PURPOSE]: React UI component: AssessmentTab.
 * [STATE]: Experimental
 * [ANCHOR]: AssessmentTab
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import { Brain, Search, Plus, Trash2, Info } from 'lucide-react';
import { findWikiKey } from '../../data/WikiData.js';

export default function AssessmentTab({ isDark, icdQuery, setIcdQuery, icdResults, selectedDiagnoses, addDiagnosis, removeDiagnosis, openWiki }) {
    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden pt-1">
            <div className={`p-4 rounded-xl border-2 border-dashed flex items-start gap-3 text-xs transition-all ${isDark ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-100' : 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-sm shadow-indigo-100/50'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Brain size={18} />
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-[0.15em] mb-1">Assessment & Diagnosis</h4>
                    <p className="text-[11px] leading-tight opacity-70 italic font-medium">Tegakkan diagnosis kerja berdasarkan Anamnesis (S) dan Pemeriksaan Fisik (O). Gunakan kode ICD-10 yang sesuai.</p>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1 thin-scrollbar">
                <div className="relative group z-20 px-1">
                    <Search size={14} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                    <input
                        type="text"
                        placeholder="Cari kode ICD-10 atau nama penyakit..."
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-xs transition-all outline-none font-bold tracking-tight ${isDark
                            ? 'bg-slate-900/50 border-slate-800/60 text-white focus:border-indigo-500 focus:bg-slate-900 shadow-inner'
                            : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-indigo-500 focus:bg-white'}`}
                        value={icdQuery}
                        onChange={(e) => setIcdQuery(e.target.value)}
                        autoFocus
                    />
                    {icdResults.length > 0 && (
                        <div className={`absolute w-full mt-2 rounded-xl border-2 shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-fadeIn z-50 ${isDark ? 'bg-slate-900 border-indigo-900/50' : 'bg-white border-indigo-100'}`}>
                            {icdResults.map(d => (
                                <button
                                    key={d.code}
                                    onClick={() => addDiagnosis(d)}
                                    className={`w-full text-left p-3 border-b flex justify-between items-center transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-50 hover:bg-indigo-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`px-2 py-0.5 rounded font-mono font-black text-[10px] ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                                            {d.code}
                                        </div>
                                        <div className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{d.name}</div>
                                    </div>
                                    <Plus size={14} className="opacity-30" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-1">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Diagnosis Terpilih
                            </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-black text-[9px] ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedDiagnoses.length} ITEMS
                        </span>
                    </div>

                    <div className="space-y-3">
                        {selectedDiagnoses.length === 0 ? (
                            <div className={`mt-6 p-12 text-center rounded-3xl border-2 border-dashed transition-colors ${isDark ? 'border-slate-800/50 bg-slate-900/20 text-slate-700' : 'border-slate-100 bg-slate-50/50 text-slate-300'}`}>
                                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                                    <Brain size={28} className="opacity-20 translate-y-[-1px]" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-normal opacity-40">Belum ada diagnosis dipilih</p>
                            </div>
                        ) : (
                            selectedDiagnoses.map((d, i) => (
                                <div key={d.code} className={`group relative p-4 rounded-xl border-2 border-dashed transition-all duration-300 animate-slideRight ${isDark
                                        ? 'bg-slate-900 border-slate-800/60 hover:border-indigo-500/30 shadow-lg shadow-black/20'
                                        : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200'
                                    }`}>
                                    {/* Left Accent */}
                                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-lg shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all ${i === 0 ? 'bg-emerald-500' : (isDark ? 'bg-indigo-500/40 group-hover:bg-indigo-500' : 'bg-indigo-500')
                                        }`} />

                                    <div className="flex justify-between items-center pl-2">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg transition-all ${i === 0
                                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                    : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')
                                                }`}>
                                                {i === 0 ? 'UT' : i + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-mono font-black text-[13px] tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{d.code}</span>
                                                    {findWikiKey('prob', d.code) && (
                                                        <button onClick={() => openWiki(findWikiKey('prob', d.code))} className={`transition-all ${isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}>
                                                            <Info size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={`text-[11px] font-black uppercase tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{d.name}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeDiagnosis(d.code)} className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-700 hover:text-rose-500 hover:bg-rose-500/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                                            }`}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
