/**
 * @reflection
 * [IDENTITY]: DashboardPage
 * [PURPOSE]: React UI component: DashboardPage.
 * [STATE]: Experimental
 * [ANCHOR]: DashboardPage
 * [DEPENDS_ON]: GameContext, EducationalWikiModal, WikiData, MedicationDatabase, ClinicalView, CommunityView, PerformanceView, AccreditationView, LogisticsView
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { showToast } from '../utils/ToastManager.js';
import {
    Stethoscope, MapPin, BarChart3, Shield, Package,
    Activity, AlertCircle, AlertTriangle, Clock, Info,
    Wifi, WifiOff, Zap, Users, Heart, Brain, Loader2
} from 'lucide-react';
// WIKI_DATA removed — EducationalWikiModal loads data internally via getWikiEntry
import { summarizeOperationalInventory } from '../utils/operationalInventory.js';
import { calculateCommunityMetrics } from '../utils/communityMetrics.js';
import ClinicalView from './dashboard/ClinicalView.jsx';
import CommunityView from './dashboard/CommunityView.jsx';
import PerformanceView from './dashboard/PerformanceView.jsx';
import AccreditationView from './dashboard/AccreditationView.jsx';
import LogisticsView from './dashboard/LogisticsView.jsx';

/**
 * DashboardPage — Mission Control HUB (Launchpad Architecture)
 *
 * Central command screen with holographic navigation buttons.
 * Each button navigates to a specialized sub-view (Clinical, Community, KBK, Accreditation, Logistics).
 */
export default function DashboardPage() {
    const { t } = useTranslation();
    const {
        stats, kpi, derivedKpis, accreditation,
        day, villageData, activeEvent, pharmacyInventory,
        hiredStaff, queue, history, prbQueue,
        playerStats, activeOutbreaks,
        openWiki
    } = useGame();

    // Navigation state: 'hub' | 'clinical' | 'community' | 'performance' | 'accreditation' | 'logistics'
    const [activeView, setActiveView] = useState('hub');

    React.useEffect(() => {
        guardStability('DASHBOARD_LIVE', 2000, 3);
    }, []);

    const communityMetrics = useMemo(
        () => calculateCommunityMetrics(villageData),
        [villageData]
    );
    const inventorySummary = useMemo(
        () => summarizeOperationalInventory(pharmacyInventory),
        [pharmacyInventory]
    );
    const overduePrbCount = useMemo(
        () => prbQueue?.filter(p => p.status === 'active' && p.tasks.some(t => !t.completed && t.dueDay <= day)).length || 0,
        [prbQueue, day]
    );

    // Wiki Modal — uses global store state from useGame()

    // === QUICK METRICS FOR HUB OVERVIEW ===
    const todayPatients = useMemo(() => history.filter(p => p.day === day).length, [history, day]);

    const alerts = useMemo(() => {
        const list = [];
        const { outOfStock, lowStock } = inventorySummary;
        if (outOfStock > 0) list.push({ text: t('dashboard.hub.alerts.out_of_stock', { count: outOfStock }), icon: AlertTriangle, severity: 'critical' });
        if (lowStock > 0) list.push({ text: t('dashboard.hub.alerts.low_stock', { count: lowStock }), icon: Package, severity: 'warning' });
        if (derivedKpis.rrns > 5) list.push({ text: t('dashboard.hub.alerts.rrns_high', { value: derivedKpis.rrns }), icon: Activity, severity: 'warning' });
        if (playerStats.stress > 70) list.push({ text: t('dashboard.hub.alerts.stress', { value: playerStats.stress }), icon: Brain, severity: 'critical' });
        if (playerStats.energy < 30) list.push({ text: t('dashboard.hub.alerts.energy', { value: Math.round(playerStats.energy) }), icon: Zap, severity: 'critical' });
        const lowMoraleStaff = hiredStaff?.filter(s => (s.morale || 70) < 50).length || 0;
        if (lowMoraleStaff > 0) list.push({ text: t('dashboard.hub.alerts.low_morale_staff', { count: lowMoraleStaff }), icon: Heart, severity: 'warning' });
        if (activeOutbreaks?.length > 0) list.push({ text: t('dashboard.hub.alerts.outbreak_active', { diseases: activeOutbreaks.map(o => o.disease).join(', ') }), icon: AlertCircle, severity: 'critical' });
        if (overduePrbCount > 0) list.push({ text: t('dashboard.hub.alerts.prb_overdue', { count: overduePrbCount }), icon: Clock, severity: 'warning' });
        return list;
    }, [inventorySummary, derivedKpis, playerStats, hiredStaff, activeOutbreaks, overduePrbCount, t]);

    // Satu Sehat sync status (fictional — always "connected" for immersion)
    const syncStatus = useMemo(() => {
        return kpi.totalPatients > 0 ? 'synced' : 'idle';
    }, [kpi.totalPatients]);

    const [isSyncing, setIsSyncing] = useState(false);
    const handleManualSync = async () => {
        setIsSyncing(true);
        // Simulate deep sync
        await new Promise(r => setTimeout(r, 1500));
        setIsSyncing(false);
        showToast(t('dashboard.hub.sync_success'), 'success', 4200);
    };
    // Memoize particle positions so they don't change on every re-render
    const particles = useMemo(() => {
        return [...Array(12)].map((_, i) => ({
            w: 2 + (i * 0.3) % 3,
            left: ((i * 17 + 3) % 97),
            top: ((i * 23 + 7) % 93),
            rgb: i % 3 === 0 ? '16,185,129' : i % 3 === 1 ? '59,130,246' : '139,92,246',
            opacity: 0.08 + (i * 0.01),
            dur: 8 + (i * 1.5),
            delay: i * 0.4
        }));
    }, []);

    // Tailwind color map — dynamic classes get purged at build time so we need explicit strings
    const colorMap = {
        rose: { bg10: 'bg-rose-500/10', border30: 'border-rose-500/30', bg15: 'bg-rose-500/15', border20: 'border-rose-500/20', bg5: 'bg-rose-500/5', bgGlow: 'bg-rose-500/15', text: 'text-rose-400', textHover: 'text-rose-300', textStat: 'text-rose-400/80' },
        violet: { bg10: 'bg-violet-500/10', border30: 'border-violet-500/30', bg15: 'bg-violet-500/15', border20: 'border-violet-500/20', bg5: 'bg-violet-500/5', bgGlow: 'bg-violet-500/15', text: 'text-violet-400', textHover: 'text-violet-300', textStat: 'text-violet-400/80' },
        emerald: { bg10: 'bg-emerald-500/10', border30: 'border-emerald-500/30', bg15: 'bg-emerald-500/15', border20: 'border-emerald-500/20', bg5: 'bg-emerald-500/5', bgGlow: 'bg-emerald-500/15', text: 'text-emerald-400', textHover: 'text-emerald-300', textStat: 'text-emerald-400/80' },
        amber: { bg10: 'bg-amber-500/10', border30: 'border-amber-500/30', bg15: 'bg-amber-500/15', border20: 'border-amber-500/20', bg5: 'bg-amber-500/5', bgGlow: 'bg-amber-500/15', text: 'text-amber-400', textHover: 'text-amber-300', textStat: 'text-amber-400/80' },
        teal: { bg10: 'bg-teal-500/10', border30: 'border-teal-500/30', bg15: 'bg-teal-500/15', border20: 'border-teal-500/20', bg5: 'bg-teal-500/5', bgGlow: 'bg-teal-500/15', text: 'text-teal-400', textHover: 'text-teal-300', textStat: 'text-teal-400/80' },
    };

    // === HUB NAVIGATION BUTTONS ===
    const hubButtons = [
        {
            id: 'clinical', label: t('dashboard.hub.cards.clinical.label'), sublabel: t('dashboard.hub.cards.clinical.sublabel'),
            icon: Stethoscope, color: 'rose',
            quickStat: t('dashboard.hub.cards.clinical.quick_stat', { value: derivedKpis.clinicalAccuracy }),
            supportStats: [
                { label: t('dashboard.hub.cards.clinical.support_queue'), value: queue.length },
                { label: t('dashboard.hub.cards.clinical.support_today'), value: todayPatients }
            ],
            wikiKey: 'ukp_overview'
        },
        {
            id: 'community', label: t('dashboard.hub.cards.community.label'), sublabel: t('dashboard.hub.cards.community.sublabel'),
            icon: MapPin, color: 'violet',
            quickStat: t('dashboard.hub.cards.community.quick_stat', { value: (communityMetrics.avgIKS * 100).toFixed(0) }),
            supportStats: [
                { label: t('dashboard.hub.cards.community.support_prb'), value: overduePrbCount },
                { label: t('dashboard.hub.cards.community.support_population'), value: villageData?.stats?.totalPopulation || villageData?.families?.length || 0 }
            ],
            wikiKey: 'ukm_overview'
        },
        {
            id: 'performance', label: t('dashboard.hub.cards.performance.label'), sublabel: t('dashboard.hub.cards.performance.sublabel'),
            icon: BarChart3, color: 'emerald',
            quickStat: t('dashboard.hub.cards.performance.quick_stat', {
                value: ((derivedKpis.availableFunds ?? ((stats.kapitasi || 0) + (stats.pendapatanUmum || 0))) / 1000000).toFixed(1)
            }),
            supportStats: [
                { label: t('dashboard.hub.cards.performance.support_quality'), value: derivedKpis.overallScore },
                { label: t('dashboard.hub.cards.performance.support_rrns'), value: `${derivedKpis.rrns}%` }
            ],
            wikiKey: 'kbk'
        },
        {
            id: 'accreditation', label: t('dashboard.hub.cards.accreditation.label'), sublabel: t('dashboard.hub.cards.accreditation.sublabel'),
            icon: Shield, color: 'amber',
            quickStat: accreditation,
            supportStats: [
                { label: t('dashboard.hub.cards.accreditation.support_alerts'), value: alerts.length },
                { label: t('dashboard.hub.cards.accreditation.support_outbreak'), value: activeOutbreaks?.length || 0 }
            ],
            wikiKey: 'accreditation_chapters'
        },
        {
            id: 'logistics', label: t('dashboard.hub.cards.logistics.label'), sublabel: t('dashboard.hub.cards.logistics.sublabel'),
            icon: Package, color: 'teal',
            quickStat: t('dashboard.hub.cards.logistics.quick_stat', { count: hiredStaff?.length || 0 }),
            supportStats: [
                { label: t('dashboard.hub.cards.logistics.support_low'), value: inventorySummary.lowStock },
                { label: t('dashboard.hub.cards.logistics.support_out'), value: inventorySummary.outOfStock }
            ],
            wikiKey: null
        },
    ];

    // === RENDER SUB-VIEWS ===
    if (activeView === 'clinical') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <ClinicalView onBack={() => setActiveView('hub')} openWiki={openWiki} />
            </div>
        </div>
    );
    if (activeView === 'community') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <CommunityView onBack={() => setActiveView('hub')} openWiki={openWiki} />
            </div>
        </div>
    );
    if (activeView === 'performance') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <PerformanceView onBack={() => setActiveView('hub')} openWiki={openWiki} />
            </div>
        </div>
    );
    if (activeView === 'accreditation') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <AccreditationView onBack={() => setActiveView('hub')} openWiki={openWiki} />
            </div>
        </div>
    );
    if (activeView === 'logistics') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <LogisticsView onBack={() => setActiveView('hub')} openWiki={openWiki} />
            </div>
        </div>
    );


    // === MAIN HUB ===
    return (
        <div className="h-full overflow-y-auto bg-slate-950 relative px-4 py-4 sm:p-5">
            {/* mc-float keyframes */}


            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {particles.map((p, i) => (
                    <div key={i} className="absolute rounded-full"
                        style={{
                            width: p.w, height: p.w,
                            left: `${p.left}%`, top: `${p.top}%`,
                            background: `rgba(${p.rgb}, ${p.opacity})`,
                            animation: `particle-float ${p.dur}s ease-in-out infinite alternate`,
                            animationDelay: `${p.delay}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-4 sm:space-y-5">
                {/* ── HEADER ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2.5 sm:gap-3 sm:text-2xl">
                            <div className="bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/20">
                                <Activity size={22} className="text-emerald-400" />
                            </div>
                            {t('dashboard.hub.title')}
                        </h2>
                        <p className="text-emerald-300/50 text-[11px] uppercase tracking-[0.22em] mt-1 ml-12 font-black sm:ml-14 sm:text-[10px] sm:tracking-[0.3em]">
                            {t('dashboard.hub.subtitle', { accreditation })}
                        </p>
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        {/* Satu Sehat Sync */}
                        <button
                            onClick={handleManualSync}
                            disabled={isSyncing}
                            className={`flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-[0.18em] transition-all active:scale-95 sm:w-auto sm:justify-start sm:py-1.5 sm:text-[10px] sm:tracking-wider ${isSyncing ? 'animate-pulse bg-blue-500/20 border-blue-500/40 text-blue-400' : syncStatus === 'synced' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/[0.04] border-white/[0.08] text-white/30'}`}
                            title={t('dashboard.hub.sync_title')}
                        >
                            {isSyncing ? <Loader2 size={12} className="animate-spin" /> : syncStatus === 'synced' ? <Wifi size={12} /> : <WifiOff size={12} />}
                            <span>{isSyncing ? t('dashboard.hub.sync_busy') : t('dashboard.hub.sync_name')}</span>
                        </button>
                    </div>
                </div>

                {/* ── LIVE STATUS BAR ── */}
                <div data-testid="dashboard-stats" className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-3.5 sm:p-4">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-4">
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] block sm:text-[9px] sm:tracking-widest">{t('dashboard.hub.stats.patients_today')}</span>
                            <span className="font-data text-xl font-black text-white/80">{todayPatients}</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] block sm:text-[9px] sm:tracking-widest">{t('dashboard.hub.stats.queue')}</span>
                            <span className="font-data text-xl font-black text-white/80">{queue.length}</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] block sm:text-[9px] sm:tracking-widest">{t('dashboard.hub.stats.quality_score')}</span>
                            <span className="font-data text-xl font-black text-emerald-400">{derivedKpis.overallScore}</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] block sm:text-[9px] sm:tracking-widest">{t('dashboard.hub.stats.recovery')}</span>
                            <span className="font-data text-xl font-black text-blue-400">{Math.round(derivedKpis.clinicalAccuracy)}%</span>
                        </div>
                    </div>
                </div>

                {/* ── ALERT TICKER ── */}
                {alerts.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {alerts.map((alert, i) => (
                            <div key={i} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold ${alert.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                <alert.icon size={12} />
                                <span className="whitespace-nowrap">{alert.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── NAVIGATION HUB — Holographic Buttons ── */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
                    {hubButtons.map(btn => {
                        const c = colorMap[btn.color];
                        return (
                            <button
                                key={btn.id}
                                onClick={() => setActiveView(btn.id)}
                                className={`group relative h-full min-h-[10rem] rounded-2xl bg-white/[0.03] p-4 text-left overflow-hidden border border-white/[0.08] transition-all duration-300 hover:${c.bg10} hover:${c.border30} sm:min-h-[10.75rem] sm:p-5 xl:min-h-[11.5rem]`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg5} rounded-full -mr-12 -mt-12 blur-2xl group-hover:${c.bgGlow} transition-all duration-500`} />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className={`p-2 rounded-xl ${c.bg15} border ${c.border20} group-hover:scale-110 transition-transform sm:p-2.5`}>
                                            <btn.icon size={18} className={c.text} />
                                        </div>
                                        {btn.wikiKey && (
                                            <div onClick={(e) => { e.stopPropagation(); openWiki(btn.wikiKey); }}
                                                className="p-1.5 rounded-full bg-white/[0.05] text-white/20 hover:text-white/50 transition-colors">
                                                <Info size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={`font-display text-xs font-black text-white/80 uppercase leading-snug tracking-tight group-hover:${c.textHover} transition-colors sm:text-sm`}>
                                        {btn.label}
                                    </h3>
                                    <p className="mt-1 text-[10px] text-white/35 font-medium leading-relaxed tracking-[0.08em] sm:text-[10px] sm:mt-0.5 sm:uppercase sm:tracking-wider">{btn.sublabel}</p>
                                    <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] sm:mt-3 sm:pt-3">
                                        <span className={`font-data text-[11px] font-black ${c.textStat} sm:text-xs`}>
                                            {btn.quickStat}
                                        </span>
                                    </div>
                                    <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3">
                                        {btn.supportStats?.map((stat) => (
                                            <div key={`${btn.id}-${stat.label}`} className={`rounded-xl border px-2 py-1.5 sm:px-2.5 sm:py-2 ${c.bg5} ${c.border20}`}>
                                                <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
                                                    {stat.label}
                                                </span>
                                                <span className="mt-1 block text-[11px] font-black text-white/80">
                                                    {stat.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── ACTIVE EVENT BANNER ── */}
                {activeEvent && (
                    <div className="bg-indigo-500/10 backdrop-blur-md rounded-2xl border border-indigo-500/20 p-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                            <Activity size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-indigo-300 uppercase tracking-wider">{activeEvent.title}</p>
                            <p className="text-[11px] text-indigo-300/60 sm:text-[10px]">{activeEvent.description}</p>
                        </div>
                    </div>
                )}

                {/* ── SYSTEM LOG (Condensed) ── */}
                {alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 opacity-30">
                        <Shield size={40} className="text-emerald-400 mb-2" />
                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em]">{t('dashboard.hub.alerts.all_normal')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
