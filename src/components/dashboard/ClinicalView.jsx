/**
 * @reflection
 * [IDENTITY]: ClinicalView
 * [PURPOSE]: React UI component: ClinicalView.
 * [STATE]: Experimental
 * [ANCHOR]: ClinicalView
 * [DEPENDS_ON]: GameContext, FKTP144Diseases
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Target, Activity, Shield, Pill, ArrowLeft, Info, Stethoscope, AlertTriangle } from 'lucide-react';
import { FKTP_144_DISEASES } from '../../data/FKTP144Diseases.js';

/**
 * ClinicalView — Sub-module for UKP (Clinical Excellence)
 * Shows: SKDI 4A Coverage, Clinical Accuracy, Rational Therapy, Antibiotic Stewardship, Top Diseases
 */
export default function ClinicalView({ onBack, openWiki }) {
    const { derivedKpis, kpi: _kpi, history } = useGame();

    // SKDI 4A Coverage: unique diseases handled vs 144 total
    const skdiStats = useMemo(() => {
        const handledIds = new Set();
        history.forEach(p => {
            const diseaseId = p.medicalData?.diseaseId || p.medicalData?.diagnosisId;
            if (diseaseId) handledIds.add(diseaseId);
        });
        const matched = FKTP_144_DISEASES.filter(d => handledIds.has(d.id)).length;
        return {
            handled: matched,
            total: FKTP_144_DISEASES.length,
            percentage: FKTP_144_DISEASES.length > 0 ? Math.round((matched / FKTP_144_DISEASES.length) * 100) : 0,
            allHandled: [...handledIds]
        };
    }, [history]);

    // Top 10 diseases
    const topDiseases = useMemo(() => {
        const counts = {};
        history.forEach(p => {
            const name = p.medicalData?.diagnosisName || 'Unknown';
            counts[name] = (counts[name] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
    }, [history]);

    // Patient Safety Composite
    const safetyScore = useMemo(() => {
        return Math.round(
            (derivedKpis.clinicalAccuracy * 0.4) +
            (derivedKpis.treatmentAppropriateRate * 0.3) +
            (derivedKpis.antibioticStewardship * 0.3)
        );
    }, [derivedKpis]);

    const getColor = (val) => val >= 80 ? 'text-emerald-400' : val >= 60 ? 'text-amber-400' : 'text-rose-400';
    const _getBarColor = (val) => val >= 80 ? 'bg-emerald-500' : val >= 60 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                            <Stethoscope size={20} className="text-rose-400" />
                            Clinical Intelligence
                        </h2>
                        <p className="text-rose-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">UKP • Patient Safety • SKDI</p>
                    </div>
                </div>
            </div>

            {/* Patient Safety Composite */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('patient_safety')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Shield size={12} /> Patient Safety Composite
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black ${getColor(safetyScore)}`}>{safetyScore}%</span>
                        <Info size={14} className="text-white/20" />
                    </div>
                </div>
                {/* Breakdown */}
                <div className="space-y-2">
                    {[
                        { label: 'Akurasi Dx', value: derivedKpis.clinicalAccuracy, wikiKey: 'accuracy' },
                        { label: 'Terapi Rasional', value: derivedKpis.treatmentAppropriateRate, wikiKey: 'treatment' },
                        { label: 'AB Stewardship', value: derivedKpis.antibioticStewardship, wikiKey: 'antibiotics' }
                    ].map(item => (
                        <div
                            key={item.label}
                            onClick={(e) => { e.stopPropagation(); openWiki(item.wikiKey); }}
                            className="flex items-center justify-between text-[10px] group/item cursor-pointer hover:bg-white/[0.06] rounded-lg p-1.5 -mx-1.5 transition-colors"
                        >
                            <div className="flex items-center gap-1.5">
                                <Info size={10} className="text-white/20 group-hover/item:text-white/60 transition-colors" />
                                <span className="text-white/60 font-medium group-hover/item:text-white/90 transition-colors">{item.label}</span>
                            </div>
                            <span className={`font-data font-black ${item.value >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SKDI 4A Coverage */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('skdi_coverage')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-sky-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Target size={12} /> SKDI 4A Coverage
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="flex items-center gap-6">
                    {/* Ring Gauge */}
                    <div className="relative w-[90px] h-[90px] flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 38}
                                strokeDashoffset={2 * Math.PI * 38 - (skdiStats.percentage / 100) * 2 * Math.PI * 38}
                                style={{ transition: 'stroke-dashoffset 1s ease-out', filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.4))' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-data text-xl font-black text-white/90">{skdiStats.percentage}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-white/60 mb-1">
                            <span className="text-white font-black">{skdiStats.handled}</span> / {skdiStats.total} penyakit tertangani
                        </p>
                        <p className="text-[10px] text-white/30">Semakin banyak variasi kasus = semakin kompeten</p>
                        <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-2 overflow-hidden">
                            <div className="h-full rounded-full bg-sky-500 transition-all duration-700" style={{ width: `${skdiStats.percentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RRNS + Referral Quality */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('rrns')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-amber-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertTriangle size={12} /> Referral Quality Index
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.04] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block mb-1">Rasio Rujukan</span>
                        <span className={`font-data text-lg font-black ${derivedKpis.referralRate <= 15 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {derivedKpis.referralRate}%
                        </span>
                        <span className="text-[9px] text-white/30 block">Target: &lt; 15%</span>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block mb-1">RRNS (Non-Spesialistik)</span>
                        <span className={`font-data text-lg font-black ${derivedKpis.rrns <= 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {derivedKpis.rrns}%
                        </span>
                        <span className="text-[9px] text-white/30 block">Target: &lt; 5%</span>
                    </div>
                </div>
            </div>

            {/* Top 10 Diseases */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5">
                <h3 className="text-[10px] font-black text-indigo-400/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                    <Activity size={12} /> Top 10 Diagnosa (Surveilans P-Care)
                </h3>
                {topDiseases.length === 0 ? (
                    <p className="text-xs text-white/30 italic">Belum ada data pasien</p>
                ) : (
                    <div className="space-y-1.5">
                        {topDiseases.map((d, i) => {
                            const maxCount = topDiseases[0]?.count || 1;
                            return (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-white/30 w-4 text-right">{i + 1}</span>
                                    <div className="flex-1 bg-white/[0.04] rounded-lg overflow-hidden h-6 relative">
                                        <div className="h-full bg-indigo-500/30 rounded-lg transition-all duration-500" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                                        <span className="absolute inset-0 flex items-center px-2 text-[10px] font-medium text-white/70 truncate">{d.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white/50 w-6 text-right">{d.count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
