/**
 * @reflection
 * [IDENTITY]: VictoryModal
 * [PURPOSE]: Celebratory modal when the village reaches "Desa Sehat" milestone
 *            — dual criterion: IKS PIS-PK ≥70% AND Readiness TTM ≥60%.
 *            Fires once (after acknowledge, persisted via publicHealth slice).
 * [STATE]: Experimental
 * [ANCHOR]: VictoryModal
 * [DEPENDS_ON]: useModalA11y, pisPkIndicators, NPCReadiness
 * [LAST_UPDATE]: 2026-04-23
 */

import React, { useEffect } from 'react';
import { Trophy, Sparkles, X, ArrowRight, HeartPulse, Activity } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';
import { PIS_PK_CATEGORIES } from '../domains/village/pisPkIndicators.js';

function formatPct(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '–';
    return `${(n * 100).toFixed(0)}%`;
}

export default function VictoryModal({ scores, day, onContinue }) {
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

    if (!scores) return null;

    const kemenkesPct = formatPct(scores.kemenkes);
    const readinessPct = formatPct(scores.readiness);
    const kkSehatText = scores.kkSehatCount != null && scores.totalKK != null
        ? `${scores.kkSehatCount}/${scores.totalKK} KK`
        : null;

    // Top indicators by coverage (show up to 3 highlights)
    const coverageEntries = Object.entries(scores.indicatorCoverage || {})
        .map(([id, data]) => ({ id, ...data }))
        .filter((d) => d.applicable > 0)
        .sort((a, b) => (b.coverage || 0) - (a.coverage || 0));
    const top3 = coverageEntries.slice(0, 3);
    const bottom3 = coverageEntries.slice(-3).reverse();

    return (
        <div className="fixed inset-0 z-hud flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div
                ref={modalRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="victory-title"
                className="w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl shadow-amber-500/30 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
            >
                {/* Header */}
                <div className="relative p-8 text-center bg-gradient-to-br from-emerald-600/30 via-amber-500/10 to-transparent border-b border-white/10">
                    <Sparkles className="absolute top-4 left-4 text-amber-300/50 animate-pulse" size={24} />
                    <Sparkles className="absolute top-4 right-4 text-emerald-300/50 animate-pulse" size={24} />
                    <Trophy className="mx-auto mb-3 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" size={72} />
                    <h2 id="victory-title" className="text-3xl font-black tracking-tight text-white mb-1">
                        DESA SEHAT TERCAPAI
                    </h2>
                    <p className="text-sm text-emerald-200/80 font-bold uppercase tracking-widest">
                        Pencapaian dwi-sumbu PIS-PK × Kesiapan Berubah
                    </p>
                    <p className="text-[11px] text-white/40 mt-1 font-medium">
                        Hari ke-{day ?? '—'} · Milestone pertama
                    </p>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4 p-6">
                    <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <HeartPulse className="text-emerald-300" size={18} />
                            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">IKS PIS-PK</span>
                        </div>
                        <p className="text-4xl font-black text-white tabular-nums">{kemenkesPct}</p>
                        <p className="text-[11px] text-emerald-100/70 font-medium mt-1">
                            Rata-rata skor 12 indikator Kemenkes per keluarga
                            {kkSehatText && <><br/>{kkSehatText} termasuk kategori Sehat</>}
                        </p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-indigo-300" size={18} />
                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Kesiapan TTM</span>
                        </div>
                        <p className="text-4xl font-black text-white tabular-nums">{readinessPct}</p>
                        <p className="text-[11px] text-indigo-100/70 font-medium mt-1">
                            Agregat tahap TTM keluarga yang sudah dikunjungi
                        </p>
                    </div>
                </div>

                {/* Coverage highlights */}
                {(top3.length > 0 || bottom3.length > 0) && (
                    <div className="grid grid-cols-2 gap-4 px-6 pb-4">
                        {top3.length > 0 && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-2">Indikator Terkuat</p>
                                <ul className="space-y-1">
                                    {top3.map((d) => (
                                        <li key={d.id} className="flex justify-between text-[11px] font-bold text-white/80">
                                            <span className="truncate">{indicatorShortLabel(d.id)}</span>
                                            <span className="text-emerald-300 tabular-nums">{formatPct(d.coverage)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {bottom3.length > 0 && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-[9px] font-black text-amber-300 uppercase tracking-widest mb-2">Perlu Diperhatikan</p>
                                <ul className="space-y-1">
                                    {bottom3.map((d) => (
                                        <li key={d.id} className="flex justify-between text-[11px] font-bold text-white/80">
                                            <span className="truncate">{indicatorShortLabel(d.id)}</span>
                                            <span className="text-amber-300 tabular-nums">{formatPct(d.coverage)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/30">
                    <p className="text-center text-[11px] text-white/40 mb-3 italic">
                        Anda dapat terus bermain untuk mengejar <span className="text-emerald-300 font-bold">100% Sehat</span> atau mempertahankan skor.
                    </p>
                    <button
                        onClick={onContinue}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-white font-black text-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                    >
                        Lanjutkan Bermain
                        <ArrowRight size={20} />
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

// Avoid hauling the full indicator catalogue through the component; tiny local map.
function indicatorShortLabel(id) {
    const map = {
        kb: 'KB', persalinan: 'Persalinan', imunisasi: 'Imunisasi', asi: 'ASI',
        balita: 'Balita', tb: 'TB', hipertensi: 'Hipertensi', jiwa: 'ODGJ',
        rokok: 'Tak Merokok', jkn: 'JKN', air: 'Air Bersih', jamban: 'Jamban',
        jentik: 'Bebas Jentik',
    };
    return map[id] || PIS_PK_CATEGORIES[id]?.label || id;
}
