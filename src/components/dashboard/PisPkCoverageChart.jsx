/**
 * @reflection
 * [IDENTITY]: PisPkCoverageChart
 * [PURPOSE]: Dashboard card — shows % cakupan per 12 indikator Kemenkes PIS-PK
 *            (+ jentik). Readonly; designed to live inside the Community
 *            Intelligence view below the village IKS donut.
 * [STATE]: Experimental
 * [ANCHOR]: PisPkCoverageChart
 * [DEPENDS_ON]: pisPkIndicators
 * [LAST_UPDATE]: 2026-04-23
 */

import React, { useMemo } from 'react';
import { BarChart3, Info } from 'lucide-react';
import {
    PIS_PK_INDICATORS,
    PIS_PK_CATEGORIES,
    calculateVillageIKSPisPk,
} from '../../domains/village/pisPkIndicators.js';

// Pastel-tier color, mapped from coverage (0-1).
function coverageStyle(coverage) {
    if (coverage >= 0.8) {
        return {
            bar: 'bg-emerald-500',
            barSoft: 'bg-emerald-500/20',
            text: 'text-emerald-300',
        };
    }
    if (coverage >= 0.5) {
        return {
            bar: 'bg-amber-500',
            barSoft: 'bg-amber-500/20',
            text: 'text-amber-300',
        };
    }
    return {
        bar: 'bg-rose-500',
        barSoft: 'bg-rose-500/20',
        text: 'text-rose-300',
    };
}

export default function PisPkCoverageChart({ families, onOpenInfo }) {
    const { rows, totalKK, meanIks, kkSehatPercent } = useMemo(() => {
        const villageIks = calculateVillageIKSPisPk(Array.isArray(families) ? families : [], { forceRecompute: true });
        const nextRows = PIS_PK_INDICATORS.map((ind) => {
            const cov = villageIks.indicatorCoverage[ind.id] || { applicable: 0, fulfilled: 0, coverage: 0 };
            return {
                id: ind.id,
                shortLabel: ind.shortLabel,
                label: ind.label,
                category: ind.category,
                categoryMeta: PIS_PK_CATEGORIES[ind.category] || null,
                official: ind.official,
                applicable: cov.applicable,
                fulfilled: cov.fulfilled,
                coverage: cov.coverage,
            };
        });

        // Sort: worst coverage first — gives students a "to-do" reading order.
        nextRows.sort((a, b) => {
            if (a.applicable === 0 && b.applicable === 0) return 0;
            if (a.applicable === 0) return 1;
            if (b.applicable === 0) return -1;
            return a.coverage - b.coverage;
        });

        return {
            rows: nextRows,
            totalKK: villageIks.totalKK,
            meanIks: villageIks.meanIks,
            kkSehatPercent: villageIks.kkSehatPercent,
        };
    }, [families]);

    const hasData = totalKK > 0;

    return (
        <div
            className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
            data-testid="pispk-coverage-chart"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-emerald-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BarChart3 size={12} /> Cakupan 12 Indikator PIS-PK
                </h3>
                {onOpenInfo && (
                    <button
                        onClick={onOpenInfo}
                        aria-label="Info: apa itu 12 indikator Kemenkes PIS-PK"
                        className="text-white/20 hover:text-emerald-400 transition-colors"
                    >
                        <Info size={14} />
                    </button>
                )}
            </div>

            {!hasData ? (
                <p className="text-[11px] text-white/40 italic py-4 text-center">
                    Belum ada data keluarga. Mulai kunjungan rumah untuk mengisi indikator.
                </p>
            ) : (
                <>
                    {/* Headline stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Rata-rata IKS</span>
                            <span className="text-sm font-black text-emerald-300 tabular-nums">{(meanIks * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">KK Sehat</span>
                            <span className="text-sm font-black text-white/80 tabular-nums">{kkSehatPercent.toFixed(0)}%</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Total KK</span>
                            <span className="text-sm font-black text-white/80 tabular-nums">{totalKK}</span>
                        </div>
                    </div>

                    {/* Per-indicator bars */}
                    <div className="space-y-1.5">
                        {rows.map((row) => {
                            const style = coverageStyle(row.coverage);
                            const pct = row.applicable > 0 ? Math.round(row.coverage * 100) : null;
                            const isNA = row.applicable === 0;
                            return (
                                <div
                                    key={row.id}
                                    className="flex items-center gap-2"
                                    title={`${row.label}${isNA ? ' — Tidak ada keluarga yang berlaku' : ''}`}
                                    data-testid={`coverage-row-${row.id}`}
                                >
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-wider w-20 shrink-0">
                                        {row.shortLabel}
                                    </span>
                                    <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isNA ? 'bg-white/[0.05]' : style.barSoft}`}>
                                        {!isNA && (
                                            <div
                                                className={`h-full ${style.bar} transition-all duration-500`}
                                                style={{ width: `${Math.max(2, pct)}%` }}
                                            />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-black tabular-nums w-16 text-right ${isNA ? 'text-white/30' : style.text}`}>
                                        {isNA ? 'N/A' : `${pct}% · ${row.fulfilled}/${row.applicable}`}
                                    </span>
                                    {!row.official && (
                                        <span className="text-[7px] font-bold text-white/30 uppercase tracking-wider w-8 text-left" title="Indikator tambahan PSN (bukan 12 resmi Kemenkes)">
                                            PSN
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
