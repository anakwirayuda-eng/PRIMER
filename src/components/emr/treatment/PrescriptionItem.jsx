/**
 * @reflection
 * [IDENTITY]: PrescriptionItem
 * [PURPOSE]: React UI component: PrescriptionItem.
 * [STATE]: Experimental
 * [ANCHOR]: PrescriptionItem
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { XCircle } from 'lucide-react';

export default function PrescriptionItem({ m, isDark, toggleMed, updateMedConfig }) {
    return (
        <div className={`rounded-2xl border overflow-hidden animate-slideRight ${isDark ? 'bg-slate-900 border-slate-800/80 shadow-lg shadow-black/20' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="overflow-hidden">
                    <p className={`font-black text-xs uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-700'}`}>{m.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 font-bold">{m.category}</p>
                </div>
                <button
                    onClick={() => toggleMed(m.id)}
                    className={`transition-colors ${isDark ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'}`}
                >
                    <XCircle size={18} />
                </button>
            </div>

            <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aturan Pakai</span>
                    <div className={`px-2 py-0.5 rounded-lg text-xs font-black ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                        {m.frequency} x 1 <span className="text-[10px] opacity-70">Satu Hari</span>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(freq => (
                        <button
                            key={freq}
                            onClick={() => updateMedConfig(m.id, { frequency: freq })}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black border transition-all ${m.frequency === freq
                                ? (isDark ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-900/40' : 'bg-emerald-600 border-emerald-700 text-white')
                                : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')}`}
                        >
                            {freq}x1
                        </button>
                    ))}
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Durasi Pemberian</span>
                        <span className={`text-[10px] font-black ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{m.duration} Hari</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={m.duration}
                        onChange={(e) => updateMedConfig(m.id, { duration: parseInt(e.target.value) })}
                        className={`w-full accent-amber-500 h-1.5 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
                    />
                </div>
            </div>

            <div className={`px-3 py-2 flex justify-between items-center ${isDark ? 'bg-slate-800/40 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest">Total Sediaan:</span>
                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {m.frequency * m.duration} <span className="text-[10px] opacity-50 font-medium lowercase">tabs</span>
                </span>
            </div>
        </div>
    );
}
