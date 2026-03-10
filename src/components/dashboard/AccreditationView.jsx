/**
 * @reflection
 * [IDENTITY]: AccreditationView
 * [PURPOSE]: React UI component: AccreditationView.
 * [STATE]: Experimental
 * [ANCHOR]: AccreditationView
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Shield, ArrowLeft, Info, Users, MapPin, Stethoscope, AlertTriangle, Award } from 'lucide-react';

/**
 * AccreditationView — Sub-module for Accreditation Radar
 * Shows: 5 Bab Akreditasi as radar/bar chart, mapped to game metrics
 */
export default function AccreditationView({ onBack, openWiki }) {
    const { accreditation, kpi: _kpi, derivedKpis, hiredStaff, facilities, villageData, prolanisRoster, prbQueue, activeOutbreaks, day } = useGame();

    const chapters = useMemo(() => {
        // Bab 1: Kepemimpinan & Manajemen
        const staffCount = hiredStaff?.length || 0;
        const avgMorale = staffCount > 0 ? hiredStaff.reduce((s, st) => s + (st.morale || 70), 0) / staffCount : 50;
        const facilityLevel = Object.values(facilities || {}).reduce((s, v) => s + v, 0);
        const bab1 = Math.min(100, Math.round((staffCount * 10) + (avgMorale * 0.4) + (facilityLevel * 5)));

        // Bab 2: UKM
        const families = villageData?.families || [];
        const avgIKS = families.length > 0 ? families.reduce((s, f) => s + (f.iksScore || 0), 0) / families.length : 0;
        const jentik = families.length > 0 ? (families.filter(f => f.indicators?.jentik).length / families.length) * 100 : 0;
        const prolanisActive = prolanisRoster?.filter(m => (day - (m.prolanisData?.lastVisitDay || 0)) <= 30).length || 0;
        const bab2 = Math.min(100, Math.round((avgIKS * 50) + (jentik * 0.3) + (prolanisActive * 3)));

        // Bab 3: UKP
        const bab3 = Math.min(100, Math.round(
            (derivedKpis.clinicalAccuracy * 0.35) +
            (derivedKpis.treatmentAppropriateRate * 0.35) +
            (derivedKpis.antibioticStewardship * 0.3)
        ));

        // Bab 4: Program Prioritas
        const outbreakResponse = (activeOutbreaks?.length || 0) === 0 ? 100 : Math.max(0, 100 - (activeOutbreaks.length * 25));
        const prbCompletion = prbQueue ? prbQueue.filter(p => p.status === 'completed').length * 20 : 0;
        const bab4 = Math.min(100, Math.round((outbreakResponse * 0.6) + (prbCompletion * 0.4) + 20));

        // Bab 5: Peningkatan Mutu
        const bab5 = Math.min(100, Math.round(
            (derivedKpis.overallScore * 0.5) +
            (derivedKpis.avgSatisfaction * 0.5)
        ));

        return [
            { id: 1, label: 'Kepemimpinan', shortLabel: 'Bab 1', score: bab1, icon: Users, color: 'sky' },
            { id: 2, label: 'UKM', shortLabel: 'Bab 2', score: bab2, icon: MapPin, color: 'violet' },
            { id: 3, label: 'UKP', shortLabel: 'Bab 3', score: bab3, icon: Stethoscope, color: 'rose' },
            { id: 4, label: 'Prog. Prioritas', shortLabel: 'Bab 4', score: bab4, icon: AlertTriangle, color: 'amber' },
            { id: 5, label: 'Mutu & Safety', shortLabel: 'Bab 5', score: bab5, icon: Award, color: 'emerald' },
        ];
    }, [hiredStaff, facilities, villageData, prolanisRoster, derivedKpis, activeOutbreaks, prbQueue, day]);

    const overallAccredScore = Math.round(chapters.reduce((s, c) => s + c.score, 0) / chapters.length);
    const accLevels = ['Dasar', 'Madya', 'Utama', 'Paripurna'];
    const currentIdx = accLevels.indexOf(accreditation) || 0;

    const getBarColor = (score) => score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500';

    // Tailwind purges dynamic template-literal classes, so we map explicitly
    const chColorMap = {
        sky: { bg20: 'bg-sky-500/20', text: 'text-sky-400' },
        violet: { bg20: 'bg-violet-500/20', text: 'text-violet-400' },
        rose: { bg20: 'bg-rose-500/20', text: 'text-rose-400' },
        amber: { bg20: 'bg-amber-500/20', text: 'text-amber-400' },
        emerald: { bg20: 'bg-emerald-500/20', text: 'text-emerald-400' },
    };

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                        <Shield size={20} className="text-amber-400" />
                        Accreditation Command
                    </h2>
                    <p className="text-amber-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">5 Bab • Radar • Standar Nasional</p>
                </div>
            </div>

            {/* Current Level + Overall */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('accreditation_chapters')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-amber-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Shield size={12} /> Status Akreditasi
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex flex-col items-center justify-center">
                            <span className="font-display text-lg font-black text-amber-400">{accreditation}</span>
                        </div>
                        <p className="text-[9px] text-white/30 mt-1">Current Level</p>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {accLevels.map((level, i) => (
                                <div key={level} className={`flex-1 h-1.5 rounded-full ${i <= currentIdx ? 'bg-amber-500' : 'bg-white/[0.08]'}`} />
                            ))}
                        </div>
                        <div className="flex justify-between text-[8px] text-white/30 font-bold uppercase">
                            {accLevels.map(l => <span key={l}>{l}</span>)}
                        </div>
                        <p className="text-xs text-white/50 mt-2">Skor Rata-rata: <span className="text-white font-black">{overallAccredScore}/100</span></p>
                    </div>
                </div>
            </div>

            {/* 5 Bab Radar (Bar Chart Style) */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('accreditation_chapters')} style={{ cursor: 'pointer' }}>
                <h3 className="text-[10px] font-black text-amber-400/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Award size={12} /> Radar 5 Bab Akreditasi
                </h3>
                <div className="space-y-3">
                    {chapters.map(ch => {
                        const cc = chColorMap[ch.color] || chColorMap.sky;
                        return (
                            <div key={ch.id} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${cc.bg20} flex items-center justify-center flex-shrink-0`}>
                                    <ch.icon size={14} className={cc.text} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between text-[10px] mb-1">
                                        <span className="text-white/60 font-bold">{ch.shortLabel}: {ch.label}</span>
                                        <span className={`font-black ${ch.score >= 80 ? 'text-emerald-400' : ch.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {ch.score}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${getBarColor(ch.score)} transition-all duration-700`} style={{ width: `${ch.score}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
