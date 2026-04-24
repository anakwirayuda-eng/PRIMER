/**
 * @reflection
 * [IDENTITY]: FamilyPisPkCard
 * [PURPOSE]: EMR sidebar card — surfaces UKM context (PIS-PK score, recent
 *            home visits, linked behavior-change case) for the patient's
 *            family. Bridges UKP ↔ UKM so students see continuity of care.
 * [STATE]: Experimental
 * [ANCHOR]: FamilyPisPkCard
 * [DEPENDS_ON]: familyContext, GameContext, DiseaseScenarios
 * [LAST_UPDATE]: 2026-04-23
 */

import React, { useMemo } from 'react';
import { Home, AlertTriangle, Link as LinkIcon, ChevronRight, ShieldAlert } from 'lucide-react';
import { useGame } from '../../../context/GameContext.jsx';
import { getFamilyContextForPatient } from '../../../utils/familyContext.js';
import { DISEASE_SCENARIOS } from '../../../content/scenarios/DiseaseScenarios.js';

const TIER_STYLE = {
    sehat: { label: 'Sehat', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', bar: 'bg-emerald-500' },
    pra_sehat: { label: 'Pra-Sehat', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', bar: 'bg-amber-500' },
    tidak_sehat: { label: 'Tidak Sehat', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', bar: 'bg-rose-500' },
};

const SEVERITY_STYLE = {
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

export default function FamilyPisPkCard({ patient, isDark }) {
    const { villageData, villageLedger, navigate } = useGame();

    const context = useMemo(() => {
        const scenariosById = Object.fromEntries(
            DISEASE_SCENARIOS.map((s) => [s.id, s])
        );
        return getFamilyContextForPatient(patient, villageData, villageLedger || [], {
            scenarios: { byId: scenariosById },
        });
    }, [patient, villageData, villageLedger]);

    if (!context) return null;

    const { family, pisPk, tier, recentVisits, linkedBcCase, riskFlags, familyId } = context;
    const style = TIER_STYLE[tier] || TIER_STYLE.pra_sehat;
    const iksPct = (pisPk.iks * 100).toFixed(0);
    const surface = isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200';
    const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
    const textHeader = isDark ? 'text-white' : 'text-slate-900';

    return (
        <div className={`m-3 rounded-xl border ${surface} overflow-hidden`} data-testid="family-pispk-card">
            {/* Header row */}
            <div className={`px-3 py-2 flex items-center justify-between border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${style.bg} ${style.text}`}>
                        <Home size={14} />
                    </div>
                    <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-widest ${textHeader}`}>
                            Konteks UKM Keluarga
                        </h4>
                        <p className={`text-[10px] font-medium ${textMuted}`}>
                            Kel. {family.surname || familyId} · RT {family.rt || '–'} · RW {family.rw || '–'}
                        </p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${style.bg} ${style.text} ${style.border}`}>
                    {style.label}
                </span>
            </div>

            {/* IKS mini bar */}
            <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>IKS PIS-PK</span>
                    <span className={`text-[11px] font-black tabular-nums ${style.text}`}>
                        {iksPct}% <span className={`font-medium ${textMuted}`}>· {pisPk.fulfilled}/{pisPk.applicable}</span>
                    </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className={`h-full ${style.bar} transition-all duration-500`} style={{ width: `${Math.max(2, Number(iksPct))}%` }} />
                </div>
            </div>

            {/* Linked BC case (highest priority — often explains the visit) */}
            {linkedBcCase && (
                <div className={`mx-3 mb-2 p-2 rounded-lg border flex items-start gap-2 ${linkedBcCase.isBridge ? 'bg-amber-500/10 border-amber-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
                    <div className="shrink-0 mt-0.5">
                        {linkedBcCase.isBridge
                            ? <AlertTriangle size={13} className="text-amber-300" />
                            : <LinkIcon size={13} className="text-indigo-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${linkedBcCase.isBridge ? 'text-amber-300' : 'text-indigo-300'}`}>
                            {linkedBcCase.isBridge ? 'Dipicu UKM gagal' : 'Kasus UKM aktif'}
                        </p>
                        <p className={`text-[11px] font-bold leading-tight ${textHeader}`}>{linkedBcCase.title}</p>
                        {linkedBcCase.isBridge && (
                            <p className={`text-[10px] mt-0.5 ${textMuted}`}>
                                Pasien ini muncul akibat intervensi UKM yang belum tuntas di keluarga.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Risk flags */}
            {riskFlags.length > 0 && (
                <div className="px-3 pb-2">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 ${textMuted}`}>
                        <ShieldAlert size={10} /> Faktor Risiko SDOH
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {riskFlags.map((flag) => (
                            <span
                                key={flag.id}
                                className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border ${SEVERITY_STYLE[flag.severity] || SEVERITY_STYLE.warning}`}
                            >
                                {flag.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent visits */}
            {recentVisits.length > 0 && (
                <div className="px-3 pb-2">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${textMuted}`}>
                        Riwayat Kunjungan ({recentVisits.length})
                    </p>
                    <ul className="space-y-1">
                        {recentVisits.slice(0, 3).map((visit, i) => (
                            <li key={i} className={`flex items-center gap-2 text-[10px] ${textMuted}`}>
                                <span className="shrink-0">{visit.icon}</span>
                                <span className={`font-bold ${textHeader}`}>Hari {visit.day ?? '–'}</span>
                                <span className="truncate">
                                    {visit.actionLabel || visit.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer link to full family archive */}
            <button
                type="button"
                onClick={() => navigate?.('archive', { familyId })}
                className={`w-full px-3 py-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider transition-colors ${isDark ? 'text-emerald-300 hover:bg-slate-800/60 border-t border-slate-700/50' : 'text-emerald-700 hover:bg-emerald-50 border-t border-slate-200'}`}
            >
                <span>Lihat Arsip Keluarga</span>
                <ChevronRight size={12} />
            </button>
        </div>
    );
}
