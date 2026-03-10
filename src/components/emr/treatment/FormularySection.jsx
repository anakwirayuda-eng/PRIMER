/**
 * @reflection
 * [IDENTITY]: FormularySection
 * [PURPOSE]: React UI component: FormularySection.
 * [STATE]: Experimental
 * [ANCHOR]: FormularySection
 * [DEPENDS_ON]: MedicationItems
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { Search, Brain } from 'lucide-react';
import { MedicationItem, RecommendedMed } from './MedicationItems.jsx';

export default function FormularySection({
    isDark, medQuery, setMedQuery, filteredMeds,
    suggestedMeds, selectedMeds, toggleMed, openWiki
}) {
    return (
        <div className="flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between">
                <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
                    Formularium Puskesmas
                </h4>
            </div>

            <div className="relative group">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-emerald-500' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                <input
                    type="text"
                    placeholder="Cari obat (generik/merek)..."
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border-2 text-xs transition-all outline-none font-bold ${isDark
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-emerald-500 focus:bg-slate-900 group-focus-within:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-emerald-500 focus:bg-white'}`}
                    value={medQuery}
                    onChange={(e) => setMedQuery(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 thin-scrollbar space-y-4">
                {/* Suggested Section */}
                {suggestedMeds.length > 0 && !medQuery && (
                    <div>
                        <div className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <Brain size={12} /> Rekomendasi MAIA
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {suggestedMeds.map(med => (
                                <RecommendedMed
                                    key={`sug-${med.id}`}
                                    med={med}
                                    isDark={isDark}
                                    isSelected={!!selectedMeds.find(m => m.id === med.id)}
                                    toggleMed={toggleMed}
                                    openWiki={openWiki}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Katalog Obat</div>
                    <div className="grid grid-cols-1 gap-2">
                        {filteredMeds.map(med => (
                            <MedicationItem
                                key={med.id}
                                med={med}
                                isDark={isDark}
                                isSelected={!!selectedMeds.find(m => m.id === med.id)}
                                toggleMed={toggleMed}
                                openWiki={openWiki}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
