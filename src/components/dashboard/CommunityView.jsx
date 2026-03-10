/**
 * @reflection
 * [IDENTITY]: CommunityView
 * [PURPOSE]: React UI component: CommunityView.
 * [STATE]: Experimental
 * [ANCHOR]: CommunityView
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { MapPin, Heart, ArrowLeft, Info, Shield, Users, AlertTriangle } from 'lucide-react';

/**
 * CommunityView — Sub-module for UKM (Community Health)
 * Shows: IKS, Jentik, Prolanis Compliance, PRB, High Risk Families
 */
export default function CommunityView({ onBack, openWiki }) {
    const { villageData, prolanisRoster, prbQueue, day, completePRBControl } = useGame();

    const pispkMetrics = useMemo(() => {
        if (!villageData?.families || villageData.families.length === 0) return { avgIKS: 0, jentik: 0, risky: 0, totalKK: 0 };
        const families = villageData.families;
        const avgIKS = families.reduce((sum, f) => sum + (f.iksScore || 0), 0) / families.length;
        const jentik = (families.filter(f => f.indicators?.jentik).length / families.length) * 100;
        const risky = families.filter(f => (f.iksScore || 0) < 0.5).length;
        return { avgIKS, jentik, risky, totalKK: families.length };
    }, [villageData]);

    const prolanisStats = useMemo(() => {
        if (!prolanisRoster || prolanisRoster.length === 0) return { total: 0, compliant: 0, rate: 0 };
        const total = prolanisRoster.length;
        const recentWindowDays = 30;
        const compliant = prolanisRoster.filter(m => {
            const lastVisit = m.prolanisData?.lastVisitDay || 0;
            return (day - lastVisit) <= recentWindowDays;
        }).length;
        return { total, compliant, rate: Math.round((compliant / total) * 100) };
    }, [prolanisRoster, day]);

    const activePRB = useMemo(() => {
        if (!prbQueue) return [];
        return prbQueue.filter(p => p.status === 'active');
    }, [prbQueue]);

    const getColor = (val) => val >= 80 ? 'text-emerald-400' : val >= 60 ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                        <MapPin size={20} className="text-violet-400" />
                        Community Intelligence
                    </h2>
                    <p className="text-violet-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">UKM • PIS-PK • Prolanis</p>
                </div>
            </div>

            {/* IKS Score */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('iks')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-violet-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Shield size={12} /> Indeks Keluarga Sehat (IKS)
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative w-[90px] h-[90px] flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                            <circle cx="50" cy="50" r="38" fill="none" stroke={pispkMetrics.avgIKS >= 0.85 ? '#10b981' : '#f59e0b'} strokeWidth="7" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 38}
                                strokeDashoffset={2 * Math.PI * 38 - (pispkMetrics.avgIKS) * 2 * Math.PI * 38}
                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-white/90">{(pispkMetrics.avgIKS * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Total KK</span>
                            <span className="text-sm font-black text-white/80">{pispkMetrics.totalKK}</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Risiko Tinggi</span>
                            <span className="text-sm font-black text-rose-400">{pispkMetrics.risky} KK</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Bebas Jentik</span>
                            <span className={`text-sm font-black ${pispkMetrics.jentik >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pispkMetrics.jentik.toFixed(0)}%</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Target</span>
                            <span className="text-sm font-black text-white/50">≥ 85%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prolanis Compliance */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('prolanis_compliance')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-pink-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Heart size={12} /> Kepatuhan Prolanis (RPP)
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-data text-3xl font-black ${getColor(prolanisStats.rate)}`}>
                        {prolanisStats.rate}%
                    </span>
                    <div className="flex-1">
                        <p className="text-xs text-white/50">{prolanisStats.compliant}/{prolanisStats.total} peserta aktif kontrol</p>
                        <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${prolanisStats.rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all duration-700`} style={{ width: `${prolanisStats.rate}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* PRB Active Cases */}
            {activePRB.length > 0 && (
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5">
                    <div className="flex items-center justify-between mb-3" onClick={() => openWiki('prb')} style={{ cursor: 'pointer' }}>
                        <h3 className="text-[10px] font-black text-cyan-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Users size={12} /> Pasien PRB Aktif ({activePRB.length})
                        </h3>
                        <Info size={14} className="text-white/20 hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {activePRB.map(prb => {
                            const nextTask = prb.tasks.find(t => !t.completed);
                            const isOverdue = nextTask && nextTask.dueDay <= day;
                            return (
                                <div key={prb.id} className={`flex items-center justify-between p-2.5 rounded-xl ${isOverdue ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/[0.04]'}`}>
                                    <div>
                                        <p className="text-xs font-bold text-white/80">{prb.patientName}</p>
                                        <p className="text-[10px] text-white/40">{prb.diagnosis}</p>
                                        {nextTask && (
                                            <p className={`text-[10px] ${isOverdue ? 'text-rose-400 font-bold' : 'text-cyan-400'}`}>
                                                {isOverdue ? '⚠️ Overdue!' : `Kontrol: Hari ke-${nextTask.dueDay}`}
                                            </p>
                                        )}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); completePRBControl(prb.id); }}
                                        className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg text-[10px] font-bold hover:bg-cyan-500/40 transition-colors border border-cyan-500/20">
                                        ✓ Kontrol
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
