/**
 * @reflection
 * [IDENTITY]: StaseFinalReportModal
 * [PURPOSE]: Laporan Akhir Stase — muncul sekali saat Day > STASE_TARGET_DAY
 *            (default 90). Menampilkan Skor Kinerja Terpadu 4-dimensi (UKP/UKM/
 *            Manajemen/Ketahanan) yang sudah di-lock di meta.stase.finalScore.
 *            Setelah dismiss, pemain masuk fase pasca-stase: bisa lanjut bermain
 *            untuk hunt achievement Model C, tapi skor leaderboard tidak
 *            berubah lagi (immutable).
 *
 *            Berbeda dengan VictoryModal: modal itu untuk milestone "Desa Sehat"
 *            mid-stase (IKS ≥70 + Readiness ≥60), dapat tercapai sebelum hari 91.
 *            Modal ini adalah hard endpoint final dengan grade akhir.
 *
 * [STATE]: Experimental
 * [ANCHOR]: StaseFinalReportModal
 * [DEPENDS_ON]: useModalA11y, scoringEngine
 * [LAST_UPDATE]: 2026-04-26
 */

import React, { useEffect } from 'react';
import { Trophy, Award, X, ArrowRight, Stethoscope, HeartHandshake, Building2, Activity } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';
import { SCORE_WEIGHTS } from '../utils/scoringEngine.js';

const GRADE_PALETTE = {
    A: { ring: 'border-emerald-400/70', text: 'text-emerald-300', bg: 'bg-emerald-500/15', glow: 'shadow-emerald-500/40' },
    B: { ring: 'border-sky-400/70', text: 'text-sky-300', bg: 'bg-sky-500/15', glow: 'shadow-sky-500/40' },
    C: { ring: 'border-amber-400/70', text: 'text-amber-300', bg: 'bg-amber-500/15', glow: 'shadow-amber-500/40' },
    D: { ring: 'border-rose-400/70', text: 'text-rose-300', bg: 'bg-rose-500/15', glow: 'shadow-rose-500/40' },
};

function StatCard({ iconNode, label, score, max, detail, accent = 'emerald' }) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (score / max) * 100)) : 0;
    return (
        <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
                {iconNode}
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{label}</span>
                <span className="ml-auto text-[10px] text-white/40 tabular-nums">/ {max}</span>
            </div>
            <p className={`text-2xl font-black text-${accent}-300 tabular-nums leading-none`}>
                {score.toFixed(1)}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className={`h-full bg-${accent}-400 transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
            {detail && <p className="text-[10px] text-white/50 mt-2 leading-tight">{detail}</p>}
        </div>
    );
}

export default function StaseFinalReportModal({ finalScore, dayLockedAt, targetDay, onContinue }) {
    const modalRef = useModalA11y(onContinue);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onContinue?.();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onContinue]);

    if (!finalScore) return null;

    const { total, grade, ukp, ukm, management, resilience } = finalScore;
    const palette = GRADE_PALETTE[grade.grade] || GRADE_PALETTE.D;

    const ukpDetail = `Akurasi ${ukp.accuracy.toFixed(0)}% · RRNS ${ukp.rrns.toFixed(1)}% (guillotine ×${ukp.guillotine.toFixed(2)})`;
    const ukmDetail = `KK Sehat ${ukm.kkSehatPercent.toFixed(0)}% · Readiness ${ukm.readinessPercent.toFixed(0)}%${ukm.apathyEvents > 0 ? ` · ${ukm.apathyEvents}× apathy (-${ukm.apathyPenalty})` : ''}`;
    const manDetail = `Akreditasi ${management.accreditation}`;
    const resDetail = `Reputasi ${resilience.reputation.toFixed(0)}${resilience.faintedCount > 0 ? ` · ${resilience.faintedCount}× pingsan (-${resilience.faintedPenalty})` : ''}`;

    return (
        <div className="fixed inset-0 z-hud flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div
                ref={modalRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="stase-final-title"
                className={`relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 ${palette.ring} shadow-2xl ${palette.glow} bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900`}
                data-testid="stase-final-report-modal"
            >
                {/* Header */}
                <div className="relative p-6 text-center border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
                    <Trophy className={`mx-auto mb-3 ${palette.text} drop-shadow-2xl`} size={56} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
                        Laporan Akhir Stase {targetDay}-Hari
                    </p>
                    <h2 id="stase-final-title" className={`text-3xl font-black ${palette.text} tracking-tight`}>
                        {grade.label}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-black border ${palette.ring} ${palette.bg} ${palette.text}`}>
                            Grade {grade.grade}
                        </span>
                        <span className="text-4xl font-black text-white tabular-nums tracking-tight">
                            {total.toFixed(1)}
                            <span className="text-base text-white/40 font-bold ml-1">/100</span>
                        </span>
                    </div>
                    {dayLockedAt && (
                        <p className="text-[10px] text-white/30 mt-2 font-medium">
                            Skor di-lock pada Hari ke-{dayLockedAt}
                        </p>
                    )}
                </div>

                {/* 4-dimension breakdown */}
                <div className="grid grid-cols-2 gap-3 p-6">
                    <StatCard
                        iconNode={<Stethoscope className="text-rose-300" size={16} />}
                        label="Klinis (UKP)"
                        score={ukp.score}
                        max={SCORE_WEIGHTS.UKP}
                        detail={ukpDetail}
                        accent="rose"
                    />
                    <StatCard
                        iconNode={<HeartHandshake className="text-emerald-300" size={16} />}
                        label="Komunitas (UKM)"
                        score={ukm.score}
                        max={SCORE_WEIGHTS.UKM}
                        detail={ukmDetail}
                        accent="emerald"
                    />
                    <StatCard
                        iconNode={<Building2 className="text-violet-300" size={16} />}
                        label="Manajemen"
                        score={management.score}
                        max={SCORE_WEIGHTS.MANAGEMENT}
                        detail={manDetail}
                        accent="violet"
                    />
                    <StatCard
                        iconNode={<Activity className="text-amber-300" size={16} />}
                        label="Ketahanan Diri"
                        score={resilience.score}
                        max={SCORE_WEIGHTS.RESILIENCE}
                        detail={resDetail}
                        accent="amber"
                    />
                </div>

                {/* Pedagogic note */}
                <div className="mx-6 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <p className="text-[11px] text-white/60 leading-relaxed">
                        <Award size={12} className="inline mr-1 text-amber-300" />
                        Skor ini sudah di-<em className="text-white/80">lock</em> dan tidak berubah lagi. Anda tetap dapat
                        bermain untuk mengejar lencana SKDI dan capaian PIS-PK lain di mode <strong className="text-white/80">Pasca-Stase</strong>.
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/30">
                    <button
                        onClick={onContinue}
                        className={`w-full py-4 rounded-xl ${palette.bg} ${palette.text} border ${palette.ring} hover:bg-white/[0.08] font-black text-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2`}
                    >
                        Lanjut Pasca-Stase
                        <ArrowRight size={18} />
                    </button>
                </div>

                <button
                    onClick={onContinue}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Tutup"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
