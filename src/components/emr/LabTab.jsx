/**
 * @reflection
 * [IDENTITY]: LabTab
 * [PURPOSE]: React UI component: LabTab — shows case-specific + common labs.
 * [STATE]: Experimental
 * [ANCHOR]: LabTab
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

import React, { useMemo } from 'react';
import { Microscope, AlertCircle, Info, FlaskConical, Sparkles } from 'lucide-react';
import { findWikiKey } from '../../data/WikiData.js';

// Common labs available at FKTP — always orderable regardless of case
const COMMON_LABS = [
    { id: 'darah_lengkap', name: 'Darah Lengkap (DL)', cost: 45000, result: 'Hb 13.2 g/dL, Leukosit 7.800/µL, Trombosit 245.000/µL, Ht 40%', flag: 'normal' },
    { id: 'gds', name: 'Gula Darah Sewaktu (GDS)', cost: 25000, result: '98 mg/dL', flag: 'normal' },
    { id: 'urinalisis', name: 'Urinalisis', cost: 35000, result: 'pH 6.0, Protein (-), Glukosa (-), Leukosit (-)', flag: 'normal' },
    { id: 'kolesterol', name: 'Kolesterol Total', cost: 35000, result: '185 mg/dL', flag: 'normal' },
    { id: 'asam_urat', name: 'Asam Urat', cost: 25000, result: '5.2 mg/dL', flag: 'normal' },
];

export default function LabTab({ patient: _patient, isDark, labsRevealed, handleOrderLab, caseData, openWiki, maiaSuggestions, anamnesisScore }) {
    // Merge case-specific labs with common labs (deduplicate by name)
    const allLabs = useMemo(() => {
        const caseLabs = caseData?.labs || {};
        // Normalize: strip "(DL)" suffixes, underscores→spaces, lowercase
        const normalize = (s) => s.toLowerCase().replace(/\s*\(.*?\)/, '').replace(/_/g, ' ').trim();
        const caseLabNorms = new Set(Object.keys(caseLabs).map(normalize));
        const merged = [];

        // Case-specific labs first (primary)
        Object.entries(caseLabs).forEach(([labName, labData]) => {
            merged.push({ id: labName, name: labName, ...labData, isCase: true });
        });

        // Common labs that aren't already in case data (fuzzy match)
        COMMON_LABS.forEach(lab => {
            if (!caseLabNorms.has(normalize(lab.id)) && !caseLabNorms.has(normalize(lab.name))) {
                merged.push({ ...lab, isCase: false });
            }
        });

        return merged;
    }, [caseData]);

    return (
        <div className="space-y-4 h-full overflow-y-auto pr-2 thin-scrollbar">
            <div className={`p-4 rounded-xl border-2 border-dashed flex items-start gap-3 transition-all ${isDark ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100/90' : 'bg-orange-50/50 border-orange-200 text-orange-900 shadow-sm shadow-orange-100/50'}`}>
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-100 text-orange-600'}`}>
                    <AlertCircle size={14} />
                </div>
                <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest mb-1">Kendali Mutu & Biaya</h5>
                    <p className="text-[11px] leading-tight opacity-80">Setiap pemeriksaan laboratorium memotong plafon Kapitasi. Gunakan secara bijak sesuai indikasi klinis.</p>
                </div>
            </div>

            {/* MAIA Banner */}
            {anamnesisScore >= 30 && (
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-all shadow-sm ${isDark
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
                                <p className="text-xs font-medium opacity-90">✨ Tidak ada usulan pemeriksaan laboratorium lebih lanjut.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allLabs.map(lab => {
                    const wikiKey = findWikiKey('lab', lab.id || lab.name);
                    const isRevealed = labsRevealed[lab.id || lab.name];
                    const labName = lab.id || lab.name;
                    const displayName = lab.isCase ? labName : lab.name;
                    const labCost = lab.cost || 50000;
                    const labResult = isRevealed ? (lab.result || labsRevealed[labName]?.result || 'Dalam batas normal') : null;
                    const labFlag = lab.flag || 'normal';

                    return (
                        <div key={labName} className={`group relative rounded-xl border-2 border-dashed transition-all duration-300 ${isDark
                            ? 'bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/30'
                            : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                            }`}>
                            {/* Left Accent */}
                            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-lg transition-all ${isRevealed
                                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                : lab.isCase
                                    ? 'bg-slate-300 opacity-20'
                                    : 'bg-blue-400 opacity-30'
                                }`} />

                            <div className={`p-4 flex justify-between items-center ${isDark && isRevealed && 'bg-emerald-500/5 rounded-t-xl'}`}>
                                <div className="flex items-center gap-2 pl-2">
                                    <span className={`font-black text-[11px] uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-700'}`}>{displayName}</span>
                                    {!lab.isCase && (
                                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                                            Umum
                                        </span>
                                    )}
                                    {wikiKey && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openWiki(wikiKey); }}
                                            className={`transition-colors ${isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}
                                        >
                                            <Info size={12} />
                                        </button>
                                    )}
                                </div>
                                {!isRevealed ? (
                                    <button
                                        onClick={() => handleOrderLab(labName, labCost)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDark
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500'
                                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'}`}
                                    >
                                        Pesan — Rp {labCost.toLocaleString('id-ID')}
                                    </button>
                                ) : (
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Selesai</span>
                                    </div>
                                )}
                            </div>
                            {isRevealed && (
                                <div className={`p-4 pt-0 pl-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <div className="flex items-end gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Result</span>
                                            <span className="text-sm font-black tracking-tight">{labResult}</span>
                                        </div>
                                        <div className="flex flex-col items-end flex-1">
                                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Status</span>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${labFlag === 'normal' || labFlag === 'negative'
                                                ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-200')
                                                : (isDark ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-rose-100 text-rose-800 border border-rose-200')}`}>
                                                {labFlag}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {allLabs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <Microscope size={48} className="mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Fasilitas Lab Terbatas</p>
                </div>
            )}
        </div>
    );
}
