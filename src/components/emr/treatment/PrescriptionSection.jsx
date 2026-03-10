/**
 * @reflection
 * [IDENTITY]: PrescriptionSection
 * [PURPOSE]: React UI component: PrescriptionSection.
 * [STATE]: Experimental
 * [ANCHOR]: PrescriptionSection
 * [DEPENDS_ON]: PrescriptionItem, SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { FileText, CheckCircle, PenTool } from 'lucide-react';
import PrescriptionItem from './PrescriptionItem.jsx';
import { soundManager } from '../../../utils/SoundManager.js';

export default function PrescriptionSection({
    isDark, isSigned, setIsSigned, selectedMeds,
    toggleMed, updateMedConfig
}) {
    return (
        <div className={`flex flex-col gap-3 min-h-0 rounded-2xl p-4 transition-all ${isDark ? 'bg-slate-950 border border-emerald-500/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.4)]' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="flex items-center justify-between">
                <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>Resep Aktif</h4>
                <div className={`px-2 py-0.5 rounded text-[10px] font-black ${isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-200 text-slate-600'}`}>R /</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 thin-scrollbar relative">
                {isSigned && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className={`border-[4px] px-6 py-2 rounded-2xl rotate-[-15deg] animate-in zoom-in-150 duration-500 ${isDark ? 'border-emerald-500/20 text-emerald-500/20' : 'border-emerald-600/20 text-emerald-600/20'}`}>
                            <span className="text-4xl font-black uppercase tracking-tighter text-center leading-none">
                                TERTANDA<br />ELEKTRONIK
                            </span>
                        </div>
                    </div>
                )}

                {selectedMeds.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                        <FileText size={48} className="mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-center">Belum Ada<br />Obat Dipilih</p>
                    </div>
                ) : (
                    selectedMeds.map((m) => (
                        <PrescriptionItem
                            key={m.id}
                            m={m}
                            isDark={isDark}
                            toggleMed={toggleMed}
                            updateMedConfig={updateMedConfig}
                        />
                    ))
                )}
            </div>

            {selectedMeds.length > 0 && (
                <button
                    onClick={() => { if (!isSigned) { setIsSigned(true); soundManager.playSuccess(); } }}
                    disabled={isSigned}
                    className={`w-full rounded-2xl py-3.5 text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 group ${isSigned
                        ? (isDark ? 'bg-slate-800 text-slate-600 cursor-default' : 'bg-slate-200 text-slate-500')
                        : (isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100')}`}
                >
                    {isSigned ? (
                        <><CheckCircle size={18} /> RESEP TELAH DITANDA-TANGANI</>
                    ) : (
                        <><PenTool size={18} className="group-hover:rotate-12 transition-transform" /> TANDA-TANGANI RESEP ELEKTRONIK</>
                    )}
                </button>
            )}
        </div>
    );
}
