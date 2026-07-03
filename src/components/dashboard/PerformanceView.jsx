/**
 * @reflection
 * [IDENTITY]: PerformanceView
 * [PURPOSE]: React UI component: PerformanceView.
 * [STATE]: Experimental
 * [ANCHOR]: PerformanceView
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext.jsx';
import { BarChart3, ArrowLeft, Info, Wallet, Users } from 'lucide-react';

/**
 * PerformanceView - Sub-module for KBK Scorecard & Finance
 * Shows: Angka Kontak, RRNS, RPP, KBK Grade, operational fund breakdown
 */
export default function PerformanceView({ onBack, openWiki }) {
    const { t } = useTranslation();
    const { stats, kpi, derivedKpis, villageData, prolanisRoster, day } = useGame();

    const kbkData = useMemo(() => {
        const totalPop = villageData?.stats?.totalPopulation || 1;
        const monthsElapsed = Math.max(1, day / 30);
        const angkaKontak = Math.round((kpi.totalPatients / totalPop) * 1000 / monthsElapsed);
        const angkaKontakTarget = 150;
        const angkaKontakScore = Math.min(100, (angkaKontak / angkaKontakTarget) * 100);

        const rrnsScore = derivedKpis.rrns <= 15 ? 100 : Math.max(0, 100 - (derivedKpis.rrns - 15) * 5);

        const prolanisTotal = prolanisRoster?.length || 0;
        const prolanisActive = prolanisRoster?.filter(member => {
            const history = member.prolanisData?.history || [];
            const lastVisit = history.length > 0 ? history[history.length - 1].day : 0;
            return (day - lastVisit) <= 30;
        }).length || 0;
        const rppRate = prolanisTotal > 0 ? Math.round((prolanisActive / prolanisTotal) * 100) : 0;

        const kbkScore = Math.round(
            (angkaKontakScore * 0.4) +
            (rrnsScore * 0.5) +
            (rppRate * 0.1)
        );

        let grade = 'A', zone = 'safe', zoneColor = 'emerald';
        if (kbkScore < 90) { grade = 'D'; zone = 'penalty'; zoneColor = 'rose'; }
        else if (kbkScore < 95) { grade = 'C'; zone = 'warning'; zoneColor = 'amber'; }
        else if (kbkScore < 100) { grade = 'B'; zone = 'safe'; zoneColor = 'sky'; }

        return {
            angkaKontak, angkaKontakTarget, angkaKontakScore,
            rrnsScore, rppRate, kbkScore,
            grade, zone, zoneColor,
            prolanisTotal, prolanisActive
        };
    }, [kpi, derivedKpis, villageData, prolanisRoster, day]);

    const formatCurrency = (val) => {
        const safeValue = Number(val) || 0;
        if (safeValue >= 1000000) return t('dashboard.views.performance.currency.million', { value: (safeValue / 1000000).toFixed(1) });
        if (safeValue >= 1000) return t('dashboard.views.performance.currency.thousand', { value: (safeValue / 1000).toFixed(0) });
        return safeValue.toString();
    };

    const scoreItems = [
        {
            label: t('dashboard.views.performance.metrics.contactRate'),
            value: t('dashboard.views.performance.perThousandValue', { value: kbkData.angkaKontak }),
            score: kbkData.angkaKontakScore,
            weight: '40%',
            target: t('dashboard.views.performance.perThousandTarget', { value: kbkData.angkaKontakTarget }),
            wikiKey: 'angka_kontak'
        },
        {
            label: t('dashboard.views.performance.metrics.rrns'),
            value: `${derivedKpis.rrns}%`,
            score: kbkData.rrnsScore,
            weight: '50%',
            target: '< 15%',
            wikiKey: 'rrns'
        },
        {
            label: t('dashboard.views.performance.metrics.rpp'),
            value: `${kbkData.rppRate}%`,
            score: kbkData.rppRate,
            weight: '10%',
            target: '>= 50%',
            wikiKey: 'prolanis_compliance'
        },
    ];

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                        <BarChart3 size={20} className="text-emerald-400" />
                        {t('dashboard.views.performance.title')}
                    </h2>
                    <p className="text-emerald-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">
                        {t('dashboard.views.performance.subtitle')}
                    </p>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('kbk')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-emerald-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <BarChart3 size={12} /> {t('dashboard.views.performance.kbkTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-2xl bg-${kbkData.zoneColor}-500/20 border-2 border-${kbkData.zoneColor}-500/40 flex flex-col items-center justify-center flex-shrink-0`}>
                        <span className={`text-3xl font-black text-${kbkData.zoneColor}-400`}>{kbkData.grade}</span>
                        <span className={`text-[8px] font-bold text-${kbkData.zoneColor}-400/70 uppercase`}>
                            {t(`dashboard.views.performance.zones.${kbkData.zone}`)}
                        </span>
                    </div>
                    <div className="flex-1 space-y-2">
                        {scoreItems.map(item => (
                            <ScoreRow key={item.label} item={item} openWiki={openWiki} />
                        ))}
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[9px] text-white/30">{t('dashboard.views.performance.totalScore')}</span>
                    <span className="font-data text-sm font-black text-white/80">{kbkData.kbkScore}/100</span>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('angka_kontak')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-sky-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={12} /> {t('dashboard.views.performance.contactDetailTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <MetricTile label={t('dashboard.views.performance.metrics.totalContacts')} value={kpi.totalPatients} />
                    <MetricTile label={t('dashboard.views.performance.metrics.population')} value={villageData?.stats?.totalPopulation || 0} />
                    <MetricTile
                        label={t('dashboard.views.performance.metrics.contactsPerThousand')}
                        value={t('dashboard.views.performance.perThousandValue', { value: kbkData.angkaKontak })}
                        valueClass={kbkData.angkaKontak >= 150 ? 'text-emerald-400' : 'text-amber-400'}
                    />
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('liquidity')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-emerald-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Wallet size={12} /> {t('dashboard.views.performance.fundsTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <MetricTile label={t('dashboard.views.performance.funds.capitation')} value={t('dashboard.views.performance.currency.rupiah', { value: formatCurrency(stats.kapitasi) })} valueClass="text-emerald-400" />
                    <MetricTile label={t('dashboard.views.performance.funds.general')} value={t('dashboard.views.performance.currency.rupiah', { value: formatCurrency(stats.pendapatanUmum) })} valueClass="text-sky-400" />
                    <MetricTile
                        label={t('dashboard.views.performance.funds.available')}
                        value={t('dashboard.views.performance.currency.rupiah', { value: formatCurrency(derivedKpis.availableFunds ?? derivedKpis.netBalance) })}
                        valueClass={(derivedKpis.availableFunds ?? derivedKpis.netBalance) >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                    />
                </div>
            </div>
        </div>
    );
}

function ScoreRow({ item, openWiki }) {
    return (
        <div
            onClick={(event) => { event.stopPropagation(); openWiki(item.wikiKey); }}
            className="group/item cursor-pointer hover:bg-white/[0.06] rounded-lg p-1.5 -mx-1.5 transition-colors"
        >
            <div className="flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-1.5">
                    <Info size={10} className="text-white/20 group-hover/item:text-white/60 transition-colors" />
                    <span className="text-white/40 font-bold uppercase group-hover/item:text-white/90 transition-colors">{item.label} ({item.weight})</span>
                </div>
                <span className="text-white/60 font-black">{item.value} <span className="text-white/30">/ {item.target}</span></span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1 mt-1 overflow-hidden">
                <div className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-700`} style={{ width: `${Math.min(100, item.score)}%` }} />
            </div>
        </div>
    );
}

function MetricTile({ label, value, valueClass = 'text-white/80' }) {
    return (
        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
            <span className="text-[9px] font-bold text-white/40 uppercase block">{label}</span>
            <span className={`font-data text-lg font-black ${valueClass}`}>{value}</span>
        </div>
    );
}
