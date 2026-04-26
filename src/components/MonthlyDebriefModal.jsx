/**
 * @reflection
 * [IDENTITY]: MonthlyDebriefModal
 * [PURPOSE]: Mid-stase checkpoint non-blocking di Day 30 dan Day 60.
 *            Menampilkan preview Skor Kinerja Terpadu agar mahasiswa tahu
 *            posisi mereka di tengah jalan, plus indikator PIS-PK paling
 *            kuat & lemah sebagai to-do list bulan berikutnya. Tidak
 *            mengunci progres — pemain klik "Lanjut" dan tetap bermain.
 *
 *            Berbeda dengan StaseFinalReportModal: modal ini terjadi
 *            mid-game, skor masih bisa berubah, sifatnya formative
 *            (membantu pemain kalibrasi strategi sisa stase).
 *
 * [STATE]: Experimental
 * [ANCHOR]: MonthlyDebriefModal
 * [DEPENDS_ON]: useModalA11y, scoringEngine, pisPkIndicators
 * [LAST_UPDATE]: 2026-04-26
 */

import React, { useEffect, useMemo } from 'react';
import { CalendarDays, ArrowRight, X, TrendingUp, AlertTriangle, Flag } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';
import { calculatePerformanceScore, SCORE_WEIGHTS } from '../utils/scoringEngine.js';
import { calculateVillageIKSPisPk, PIS_PK_INDICATORS } from '../domains/village/pisPkIndicators.js';

const SHORT_LABEL = Object.fromEntries(
    PIS_PK_INDICATORS.map((i) => [i.id, i.shortLabel])
);

function MiniBar({ label, score, max, accent }) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (score / max) * 100)) : 0;
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-white/50 uppercase tracking-widest">{label}</span>
                <span className={`text-${accent}-300 tabular-nums`}>{score.toFixed(1)}/{max}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className={`h-full bg-${accent}-400 transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function MonthlyDebriefModal({ state, milestoneDay, targetDay, onContinue }) {
    const modalRef = useModalA11y(onContinue);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
                onContinue?.();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onContinue]);

    const { performance, topIndicators, bottomIndicators } = useMemo(() => {
        const perf = calculatePerformanceScore(state);
        const families = state?.publicHealth?.villageData?.families || [];
        const villageIks = calculateVillageIKSPisPk(families);
        const rows = Object.entries(villageIks.indicatorCoverage)
            .map(([id, data]) => ({ id, label: SHORT_LABEL[id] || id, ...data }))
            .filter((d) => d.applicable > 0);
        rows.sort((a, b) => b.coverage - a.coverage);
        return {
            performance: perf,
            topIndicators: rows.slice(0, 3),
            bottomIndicators: rows.slice(-3).reverse(),
        };
    }, [state]);

    if (!performance) return null;

    const monthLabel = milestoneDay === 30 ? 'Pertama' : milestoneDay === 60 ? 'Kedua' : `ke-${Math.ceil(milestoneDay / 30)}`;
    const daysRemaining = Math.max(0, (targetDay ?? 90) - milestoneDay);

    return (
        <div className="fixed inset-0 z-hud flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div
                ref={modalRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="monthly-debrief-title"
                className="relative w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-sky-400/40 shadow-2xl shadow-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
                data-testid="monthly-debrief-modal"
            >
                {/* Header */}
                <div className="relative p-5 text-center border-b border-white/10 bg-gradient-to-b from-sky-500/[0.08] to-transparent">
                    <CalendarDays className="mx-auto mb-2 text-sky-300" size={36} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300/60">
                        Laporan Bulan {monthLabel}
                    </p>
                    <h2 id="monthly-debrief-title" className="text-2xl font-black text-white mt-1">
                        Hari ke-{milestoneDay}
                    </h2>
                    <p className="text-[11px] text-white/50 mt-1">
                        Sisa {daysRemaining} hari sebelum Laporan Akhir Stase. Skor masih dapat berubah.
                    </p>
                </div>

                {/* Performance preview */}
                <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Flag size={12} className="text-sky-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            Posisi Skor Saat Ini
                        </span>
                        <span className="ml-auto text-2xl font-black text-white tabular-nums">
                            {performance.total.toFixed(0)}
                            <span className="text-xs text-white/40 ml-1">/100</span>
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <MiniBar label="Klinis (UKP)" score={performance.ukp.score} max={SCORE_WEIGHTS.UKP} accent="rose" />
                        <MiniBar label="Komunitas (UKM)" score={performance.ukm.score} max={SCORE_WEIGHTS.UKM} accent="emerald" />
                        <MiniBar label="Manajemen" score={performance.management.score} max={SCORE_WEIGHTS.MANAGEMENT} accent="violet" />
                        <MiniBar label="Ketahanan" score={performance.resilience.score} max={SCORE_WEIGHTS.RESILIENCE} accent="amber" />
                    </div>
                </div>

                {/* Indicator highlights */}
                {(topIndicators.length > 0 || bottomIndicators.length > 0) && (
                    <div className="px-6 pb-4 grid grid-cols-2 gap-3">
                        {topIndicators.length > 0 && (
                            <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <TrendingUp size={11} className="text-emerald-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-300">
                                        Sudah Kuat
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {topIndicators.map((d) => (
                                        <li key={d.id} className="flex justify-between text-[11px] font-bold text-white/80">
                                            <span className="truncate">{d.label}</span>
                                            <span className="text-emerald-300 tabular-nums">{Math.round(d.coverage * 100)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {bottomIndicators.length > 0 && (
                            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <AlertTriangle size={11} className="text-amber-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">
                                        Prioritas Bulan Depan
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {bottomIndicators.map((d) => (
                                        <li key={d.id} className="flex justify-between text-[11px] font-bold text-white/80">
                                            <span className="truncate">{d.label}</span>
                                            <span className="text-amber-300 tabular-nums">{Math.round(d.coverage * 100)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-black/20">
                    <button
                        onClick={onContinue}
                        className="w-full py-3 rounded-xl bg-sky-500/15 text-sky-200 border border-sky-400/40 hover:bg-sky-500/25 font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        Lanjut Bertugas
                        <ArrowRight size={16} />
                    </button>
                </div>

                <button
                    onClick={onContinue}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Tutup"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
