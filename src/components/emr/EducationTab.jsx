/**
 * @reflection
 * [IDENTITY]: EducationTab
 * [PURPOSE]: React UI component: EducationTab.
 * [STATE]: Experimental
 * [ANCHOR]: EducationTab
 * [DEPENDS_ON]: EducationOptions
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import { Brain, CheckCircle, Check, Heart, Shield, AlertCircle, Plus, BookOpen, Search } from 'lucide-react';
import { EDUCATION_OPTIONS } from '../../data/EducationOptions.js';

export default function EducationTab({ patient, isDark, eduQuery, setEduQuery, eduFiltered, selectedDiagnoses, selectedEducation, setSelectedEducation }) {
    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* MAIA Smart Suggestions */}
            <div className={`p-5 rounded-2xl relative overflow-hidden transition-all border-l-4 ${isDark
                ? 'bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/40 border-slate-800'
                : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-500 border-indigo-100'} shadow-xl`}>
                <div className="flex items-center gap-2 mb-4">
                    <Brain size={18} className="text-indigo-500" />
                    <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-900'}`}>MAIA Smart Guidance</h4>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                    {(() => {
                        const required = patient.hidden?.requiredEducation || [];
                        let suggestions;
                        if (required.length > 0) {
                            suggestions = required.map(id => EDUCATION_OPTIONS.find(e => e.id === id)).filter(Boolean);
                        } else {
                            suggestions = EDUCATION_OPTIONS.filter(e => {
                                if (selectedDiagnoses.length === 0) return e.category === 'lifestyle' || e.category === 'prevention';
                                const diagText = selectedDiagnoses.map(d => d.name.toLowerCase()).join(' ');
                                if (diagText.includes('hampir') || diagText.includes('food')) return e.category === 'diet' || e.category === 'hygiene';
                                if (diagText.includes('hyper') || diagText.includes('tens')) return e.id === 'low_salt' || e.category === 'compliance';
                                return e.category === 'general';
                            }).slice(0, 4);
                        }

                        return suggestions.map(edu => (
                            <button
                                key={edu.id}
                                onClick={() => setSelectedEducation(prev => prev.includes(edu.id) ? prev.filter(e => e !== edu.id) : [...prev, edu.id])}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedEducation.includes(edu.id)
                                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                    : (isDark ? 'bg-slate-800 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50')}`}
                            >
                                {selectedEducation.includes(edu.id) && <Check size={10} className="inline mr-1" />}
                                {edu.label}
                            </button>
                        ));
                    })()}
                </div>
                {isDark && <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />}
            </div>

            <div className="relative z-10">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                    type="text"
                    placeholder="Cari topik edukasi..."
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border-2 text-xs transition-all outline-none font-bold ${isDark
                        ? 'bg-slate-900/60 border-slate-800 text-white focus:border-emerald-500'
                        : 'bg-white border-slate-200 text-slate-800 focus:border-emerald-500'}`}
                    value={eduQuery}
                    onChange={(e) => setEduQuery(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 thin-scrollbar space-y-6">
                {eduQuery.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fadeIn">
                        {eduFiltered.map(edu => (
                            <button
                                key={edu.id}
                                onClick={() => setSelectedEducation(prev => prev.includes(edu.id) ? prev.filter(e => e !== edu.id) : [...prev, edu.id])}
                                className={`p-3.5 rounded-xl border-2 border-dashed text-left flex items-start gap-4 transition-all group ${selectedEducation.includes(edu.id)
                                    ? (isDark ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md translate-x-1' : 'bg-green-50 border-green-600 text-green-800 translate-x-1')
                                    : (isDark ? 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')}`}
                            >
                                <div className={`mt-0.5 p-1 rounded-full ${selectedEducation.includes(edu.id) ? 'bg-emerald-500 text-white' : 'bg-slate-500/10 opacity-30 group-hover:opacity-100 transition-opacity'}`}>
                                    {selectedEducation.includes(edu.id) ? <Check size={12} /> : <Plus size={12} />}
                                </div>
                                <span className={`text-xs font-bold leading-tight ${selectedEducation.includes(edu.id) ? 'text-emerald-400' : ''}`}>{edu.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {[
                            { id: 'lifestyle', label: 'Gaya Hidup & Nutrisi', desc: 'Diet, Aktivitas, Kebiasaan', categories: ['diet', 'lifestyle'], icon: Heart, color: 'text-rose-500' },
                            { id: 'care', label: 'Perawatan & Kebersihan', desc: 'Luka, Higienitas, Pencegahan', categories: ['self_care', 'prevention', 'hygiene'], icon: Shield, color: 'text-emerald-500' },
                            { id: 'medical', label: 'Medis & Kepatuhan', desc: 'Minum Obat, Tanda Bahaya, Kontrol', categories: ['compliance', 'warning_signs', 'maternal', 'infant'], icon: AlertCircle, color: 'text-amber-500' }
                        ].map(pillar => {
                            const pillarOptions = EDUCATION_OPTIONS.filter(e => pillar.categories.includes(e.category));
                            if (pillarOptions.length === 0) return null;
                            return (
                                <div key={pillar.id} className="animate-slideUp">
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <pillar.icon size={14} className={pillar.color} />
                                        <div>
                                            <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>{pillar.label}</h4>
                                            <p className={`text-[9px] font-medium opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{pillar.desc}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pillarOptions.map(edu => (
                                            <button
                                                key={edu.id}
                                                onClick={() => setSelectedEducation(prev => prev.includes(edu.id) ? prev.filter(e => e !== edu.id) : [...prev, edu.id])}
                                                className={`p-3 rounded-xl border-l-[4px] border-y border-r border-dashed text-left flex items-start gap-3 transition-all group ${selectedEducation.includes(edu.id)
                                                    ? (isDark ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-emerald-50 border-emerald-600 text-emerald-800')
                                                    : (isDark ? 'bg-slate-900/40 border-slate-800 border-l-slate-700 text-slate-500 hover:border-emerald-500/40' : 'bg-white border-slate-200 border-l-slate-300 text-slate-600 hover:bg-slate-50')}`}
                                            >
                                                <div className={`mt-0.5 p-1 rounded-full ${selectedEducation.includes(edu.id) ? 'bg-emerald-500 text-white' : 'bg-slate-500/10 opacity-30 group-hover:opacity-100'}`}>
                                                    {selectedEducation.includes(edu.id) ? <Check size={10} /> : <Plus size={10} />}
                                                </div>
                                                <span className="text-[11px] font-bold leading-tight uppercase tracking-tight">{edu.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
