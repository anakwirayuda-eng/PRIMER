/**
 * @reflection
 * [IDENTITY]: ProceduresTab
 * [PURPOSE]: React UI component: COMMON_PROCEDURES.
 * [STATE]: Experimental
 * [ANCHOR]: ProceduresTab
 * [DEPENDS_ON]: ICD9CM, ProceduresDB, WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import { Brain, Search, Check, Scissors, Trash2, CheckCircle, Plus, Info } from 'lucide-react';
// findICD9CM — search is handled by parent component
import { PROCEDURES_DB } from '../../data/ProceduresDB.js';
import { findWikiKey } from '../../data/WikiData.js';

const COMMON_PROCEDURES = [
    { id: 'wound_care', code: '93.57', name: 'Rawat Luka (GV)', cost: 25000 },
    { id: 'suturing', code: '86.59', name: 'Hecting (Jahit)', cost: 50000 },
    { id: 'aff_hecting', code: '97.83', name: 'Aff Hecting (Lepas)', cost: 20000 },
    { id: 'wound_debridement', code: '86.28', name: 'Debridement Luka', cost: 75000 },
    { id: 'incision_drainage', code: '86.04', name: 'Insisi Drainase Abses', cost: 75000 },
    { id: 'nebulizer', code: '93.94', name: 'Nebulizer / Uap', cost: 35000 },
    { id: 'oxygen_therapy', code: '93.96', name: 'Oksigenasi / Kanul', cost: 25000 },
    { id: 'iv_fluid', code: '99.18', name: 'Pasang Infus', cost: 100000 },
    { id: 'im_injection', code: '99.29', name: 'Injeksi IM', cost: 20000 },
    { id: 'iv_injection', code: '99.21', name: 'Injeksi IV', cost: 25000 },
    { id: 'ear_toilet', code: '96.52', name: 'Toilet Telinga / Cerumen', cost: 30000 },
    { id: 'foreign_body_removal_nose', code: '98.12', name: 'Ekstraksi Benda Asing Hidung', cost: 35000 },
    { id: 'foreign_body_removal_eye', code: '98.21', name: 'Ekstraksi Benda Asing Mata', cost: 35000 },
    { id: 'dent_ext', code: '23.09', name: 'Ekstraksi Gigi', cost: 75000 },
    { id: 'catheter', code: '57.94', name: 'Pasang Kateter', cost: 75000 },
    { id: 'ngtb', code: '96.07', name: 'Pasang NGT', cost: 75000 },
    { id: 'epistaxis_tampon', code: '21.01', name: 'Tampon Hidung', cost: 40000 },
    { id: 'foreign_body_removal_ear', code: '98.11', name: 'Ekstraksi Benda Asing Telinga', cost: 35000 },
    { id: 'roserplasty', code: '86.23', name: 'Ekstraksi Kuku (Roserplasty)', cost: 75000 },
    { id: 'fracture_splinting', code: '93.54', name: 'Bidai / Splinting', cost: 40000 },
    { id: 'normal_delivery', code: '73.59', name: 'Persalinan Normal (APN)', cost: 600000 },
    { id: 'needle_decompression', code: '34.01', name: 'Dekompresi Jarum', cost: 150000 },
    { id: 'neonatal_resuscitation', code: '93.93', name: 'Resusitasi Neonatus', cost: 100000 },
    { id: 'spirometry', code: '89.37', name: 'Spirometri Dasar', cost: 50000 },
    { id: 'mmse', code: '94.01', name: 'Screening Kognitif (MMSE)', cost: 25000 },
    { id: 'iva_test', code: '89.26', name: 'IVA Test', cost: 25000 },
    { id: 'ecg', code: '89.52', name: 'Rekam Jantung (EKG)', cost: 50000 }
];

export { COMMON_PROCEDURES };

export default function ProceduresTab({ patient, isDark, icd9Query, setIcd9Query, icd9Results, selectedDiagnoses, selectedProcedures, toggleProcedure, openWiki }) {
    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <div className={`p-4 rounded-2xl relative overflow-hidden transition-all ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-white border border-blue-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-blue-500" />
                    <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Saran Tindakan MAIA</h4>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                    {(() => {
                        const correctProcs = patient.hidden?.correctProcedures || [];
                        let suggestions;
                        if (correctProcs.length > 0) {
                            suggestions = correctProcs.map(id => {
                                return PROCEDURES_DB.find(p => p.id === id) || COMMON_PROCEDURES.find(p => p.id === id || p.code === id);
                            }).filter(Boolean);
                        } else {
                            suggestions = COMMON_PROCEDURES.filter(cp => {
                                const diagText = selectedDiagnoses.map(d => d.name.toLowerCase()).join(' ');
                                if (diagText.includes('vulnus') || diagText.includes('luka')) return cp.id === 'wound_care' || cp.id === 'suturing' || cp.id === 'im_injection';
                                if (diagText.includes('asma') || diagText.includes('pneu') || diagText.includes('napas')) return cp.id === 'nebulizer' || cp.id === 'iv_injection';
                                if (diagText.includes('diare') || diagText.includes('muntah') || diagText.includes('shock')) return cp.id === 'iv_fluid';
                                if (diagText.includes('jantung') || diagText.includes('dada')) return cp.id === 'ecg';
                                return cp.id === 'im_injection' || cp.id === 'iv_injection';
                            }).slice(0, 3);
                        }

                        return suggestions.map(proc => (
                            <button
                                key={proc.id}
                                onClick={() => toggleProcedure(proc)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code)
                                    ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                    : (isDark ? 'bg-slate-800 text-blue-300 border-blue-500/30 hover:bg-blue-500/20' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50')}`}
                            >
                                {(selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code)) && <Check size={10} className="inline mr-1" />}
                                {proc.name}
                            </button>
                        ));
                    })()}
                </div>
            </div>

            <div className="relative group">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                    type="text"
                    placeholder="Cari kode atau nama tindakan (misal: 99.21 atau Injeksi)..."
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border-2 text-xs transition-all outline-none font-bold ${isDark
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-blue-500 focus:bg-slate-900 shadow-inner'
                        : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-blue-500 focus:bg-white'}`}
                    value={icd9Query}
                    onChange={(e) => setIcd9Query(e.target.value)}
                />
                {icd9Results.length > 0 && (
                    <div className={`absolute z-20 w-full border-2 rounded-xl mt-1 max-h-60 overflow-y-auto animate-fadeIn shadow-2xl ${isDark ? 'bg-slate-900 border-blue-900/50' : 'bg-white border-blue-100'}`}>
                        {icd9Results.map((p, idx) => (
                            <button
                                key={`${p.id || p.code}-${idx}`}
                                onClick={() => toggleProcedure(p)}
                                className={`w-full text-left px-4 py-3 text-xs flex flex-col gap-1 border-b last:border-0 transition-colors ${isDark ? 'hover:bg-blue-500/10 border-slate-800' : 'hover:bg-blue-50 border-slate-50'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`font-black ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{p.code}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>ICD9-CM</span>
                                </div>
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{p.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 thin-scrollbar space-y-4">
                <div>
                    <h4 className={`text-[9px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tindakan Terpilih</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedProcedures.map(p => {
                            const pId = p.id || p.code;
                            const wikiKey = findWikiKey('proc', pId) || findWikiKey('proc', p.id);
                            return (
                                <div key={pId} className={`px-3 py-2 rounded-xl border flex items-center gap-2 animate-fadeIn ${isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                    <Scissors size={12} className="opacity-50" />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{p.code}: {p.name}</span>
                                    {wikiKey && (
                                        <button onClick={() => openWiki(wikiKey)} className="hover:text-blue-500 transition-colors">
                                            <Info size={12} />
                                        </button>
                                    )}
                                    <button onClick={() => toggleProcedure(pId)} className={`p-1 rounded-lg hover:bg-red-500 hover:text-white transition-all`}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            );
                        })}
                        {selectedProcedures.length === 0 && (
                            <div className="w-full py-8 text-center opacity-30">
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Belum ada tindakan</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tindakan Umum</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {COMMON_PROCEDURES.map(proc => {
                            const _isSelected = selectedProcedures.includes(proc.id) || selectedProcedures.includes(proc.code);
                            return (
                                <button
                                    key={proc.id}
                                    onClick={() => toggleProcedure(proc)}
                                    className={`text-left p-3 rounded-xl border flex items-center justify-between transition-all ${selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code)
                                        ? (isDark ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-blue-600 border-blue-700 text-white shadow-md')
                                        : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-500/30' : 'bg-white border-slate-100 text-slate-600 hover:bg-blue-50')}`}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className={`text-[9px] font-black ${selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code) ? 'text-blue-200' : 'text-blue-500'}`}>{proc.code}</span>
                                            <span className={`text-[8px] font-bold ${selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code) ? 'text-blue-300' : 'text-slate-400'}`}>Rp {proc.cost.toLocaleString('id-ID')}</span>
                                        </div>
                                        <span className="text-xs font-bold truncate">{proc.name}</span>
                                    </div>
                                    {selectedProcedures.some(x => (x.id || x.code) === proc.id || (x.id || x.code) === proc.code) ? <CheckCircle size={14} /> : <Plus size={14} className="opacity-20" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
