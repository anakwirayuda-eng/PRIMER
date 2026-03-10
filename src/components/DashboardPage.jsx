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
import { useGame } from '../context/GameContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import {
    Stethoscope, MapPin, BarChart3, Shield, Package,
    Activity, AlertCircle, AlertTriangle, Clock, Info,
    Wifi, WifiOff, Zap, Users, Heart, Brain, Loader2
} from 'lucide-react';
import EducationalWikiModal from './EducationalWikiModal.jsx';
// WIKI_DATA removed — EducationalWikiModal loads data internally via getWikiEntry
import { getMedicationById } from '../data/MedicationDatabase.js';
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
    const {
        stats, kpi, derivedKpis, accreditation,
        day, villageData, activeEvent, pharmacyInventory,
        hiredStaff, queue, history, prbQueue, prolanisRoster,
        playerStats, activeOutbreaks,
        isWikiOpen, wikiMetric, openWiki, closeWiki
    } = useGame();

    // Navigation state: 'hub' | 'clinical' | 'community' | 'performance' | 'accreditation' | 'logistics'
    const [activeView, setActiveView] = useState('hub');

    React.useEffect(() => {
        guardStability('DASHBOARD_LIVE', 2000, 3);
    }, []);

    // Wiki Modal — uses global store state from useGame()

    // === QUICK METRICS FOR HUB OVERVIEW ===
    const todayPatients = useMemo(() => history.filter(p => p.day === day).length, [history, day]);

    const alerts = useMemo(() => {
        const list = [];
        const outOfStock = pharmacyInventory?.filter(i => i.stock === 0).length || 0;
        const lowStock = pharmacyInventory?.filter(i => {
            const med = getMedicationById(i.medicationId);
            return med && i.stock < med.minStock && i.stock > 0;
        }).length || 0;
        if (outOfStock > 0) list.push({ text: `${outOfStock} obat HABIS`, icon: AlertTriangle, severity: 'critical' });
        if (lowStock > 0) list.push({ text: `${lowStock} obat rendah`, icon: Package, severity: 'warning' });
        if (derivedKpis.rrns > 5) list.push({ text: `RRNS: ${derivedKpis.rrns}% (tinggi)`, icon: Activity, severity: 'warning' });
        if (playerStats.stress > 70) list.push({ text: `Stress: ${playerStats.stress}%`, icon: Brain, severity: 'critical' });
        if (playerStats.energy < 30) list.push({ text: `Energi: ${Math.round(playerStats.energy)}%`, icon: Zap, severity: 'critical' });
        const lowMoraleStaff = hiredStaff?.filter(s => (s.morale || 70) < 50).length || 0;
        if (lowMoraleStaff > 0) list.push({ text: `${lowMoraleStaff} staf morale rendah`, icon: Heart, severity: 'warning' });
        if (activeOutbreaks?.length > 0) list.push({ text: `KLB Aktif: ${activeOutbreaks.map(o => o.disease).join(', ')}`, icon: AlertCircle, severity: 'critical' });
        const activePRB = prbQueue?.filter(p => p.status === 'active' && p.tasks.some(t => !t.completed && t.dueDay <= day)).length || 0;
        if (activePRB > 0) list.push({ text: `${activePRB} PRB overdue`, icon: Clock, severity: 'warning' });
        return list;
    }, [pharmacyInventory, derivedKpis, playerStats, hiredStaff, activeOutbreaks, prbQueue, day]);

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
        alert('Satu Sehat Sync Complete! \n\nNote: Developer should run PRIMERA_SYNC.bat to update documentation reflections.');
    };


    // === WIKI LIVE STATS ===
    const wikiLiveStats = useMemo(() => {
        if (!wikiMetric) return null;
        switch (wikiMetric) {
            case 'liquidity':
                return { "Dana Kapitasi": `Rp ${(stats.kapitasi / 1000000).toFixed(1)}M`, "Pendapatan Umum": `Rp ${(stats.pendapatanUmum / 1000000).toFixed(2)}M` };
            case 'staff_readiness': {
                const avg = hiredStaff.length > 0 ? Math.round(hiredStaff.reduce((s, st) => s + (st.performance || 0), 0) / hiredStaff.length) : 0;
                return { "Total Staf": hiredStaff.length, "Avg Readiness": avg + "%" };
            }
            case 'rrns':
                return { "Total Pasien": kpi.totalPatients, "RRNS": derivedKpis.rrns + "%", "Target": "< 5%" };
            case 'accreditation':
            case 'accreditation_chapters':
                return { "Status": accreditation, "Overall Score": derivedKpis.overallScore };
            case 'iks': {
                const fams = villageData?.families || [];
                const avgIKS = fams.length > 0 ? (fams.reduce((s, f) => s + (f.iksScore || 0), 0) / fams.length) : 0;
                return { "Rata-rata IKS": (avgIKS * 100).toFixed(1) + "%", "Total KK": fams.length };
            }
            case 'kbk': {
                const pop = villageData?.stats?.totalPopulation || 1;
                const months = Math.max(1, day / 30);
                return { "Angka Kontak": `${Math.round((kpi.totalPatients / pop) * 1000 / months)}‰`, "RRNS": derivedKpis.referralRate + "%" };
            }
            case 'angka_kontak': {
                const pop2 = villageData?.stats?.totalPopulation || 1;
                return { "Total Kontak": kpi.totalPatients, "Populasi": pop2 };
            }
            case 'skdi_coverage':
                return { "Total Pasien Ditangani": kpi.totalPatients };
            case 'prolanis_compliance':
                return { "Peserta Prolanis": prolanisRoster?.length || 0 };
            case 'stress':
                return { "Stress": playerStats.stress + "%", "Energy": Math.round(playerStats.energy) + "%" };
            case 'accuracy':
                return { "Akurasi Diagnosa": derivedKpis.clinicalAccuracy + "%", "Total Pasien": kpi.totalPatients };
            case 'treatment':
                return { "Terapi Rasional": derivedKpis.treatmentAppropriateRate + "%" };
            case 'antibiotics':
                return { "AB Stewardship": derivedKpis.antibioticStewardship + "%" };
            case 'patient_safety':
                return { "Akurasi": derivedKpis.clinicalAccuracy + "%", "Terapi": derivedKpis.treatmentAppropriateRate + "%", "AB": derivedKpis.antibioticStewardship + "%" };
            case 'prb':
                return { "PRB Aktif": prbQueue?.filter(p => p.status === 'active').length || 0, "PRB Selesai": prbQueue?.filter(p => p.status === 'completed').length || 0 };
            case 'inventory': {
                const outOfStock = pharmacyInventory?.filter(i => i.stock === 0).length || 0;
                return { "Total Item": pharmacyInventory?.length || 0, "Stok Habis": outOfStock };
            }
            case 'ukp_overview':
                return { "Akurasi Klinis": derivedKpis.clinicalAccuracy + "%", "Total Pasien": kpi.totalPatients };
            case 'ukm_overview': {
                const fams2 = villageData?.families || [];
                const avgIKS2 = fams2.length > 0 ? (fams2.reduce((s, f) => s + (f.iksScore || 0), 0) / fams2.length) : 0;
                return { "Rata-rata IKS": (avgIKS2 * 100).toFixed(1) + "%", "Total KK": fams2.length };
            }
            default:
                return null;
        }
    }, [wikiMetric, stats, kpi, derivedKpis, hiredStaff, accreditation, villageData, playerStats, prolanisRoster, prbQueue, pharmacyInventory, day]);

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
            id: 'clinical', label: 'Clinical Intel', sublabel: 'UKP • SKDI • Patient Safety',
            icon: Stethoscope, color: 'rose',
            quickStat: `${derivedKpis.clinicalAccuracy}% Akurasi`,
            wikiKey: 'ukp_overview'
        },
        {
            id: 'community', label: 'Community Intel', sublabel: 'UKM • PIS-PK • Prolanis',
            icon: MapPin, color: 'violet',
            quickStat: `IKS ${((villageData?.families || []).length > 0 ? ((villageData.families.reduce((s, f) => s + (f.iksScore || 0), 0) / villageData.families.length) * 100).toFixed(0) : 0)}%`,
            wikiKey: 'ukm_overview'
        },
        {
            id: 'performance', label: 'Performance', sublabel: 'KBK • Kapitasi • Revenue',
            icon: BarChart3, color: 'emerald',
            quickStat: `Rp ${(stats.kapitasi / 1000000).toFixed(1)}M`,
            wikiKey: 'kbk'
        },
        {
            id: 'accreditation', label: 'Accreditation', sublabel: '5 Bab • Radar Mutu',
            icon: Shield, color: 'amber',
            quickStat: accreditation,
            wikiKey: 'accreditation_chapters'
        },
        {
            id: 'logistics', label: 'Logistics', sublabel: 'Staff • Inventory • Wellness',
            icon: Package, color: 'teal',
            quickStat: `${hiredStaff?.length || 0} Staf`,
            wikiKey: null
        },
    ];

    // === RENDER SUB-VIEWS ===
    if (activeView === 'clinical') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <ClinicalView onBack={() => setActiveView('hub')} openWiki={openWiki} />
                <EducationalWikiModal isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric} liveStats={wikiLiveStats} />
            </div>
        </div>
    );
    if (activeView === 'community') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <CommunityView onBack={() => setActiveView('hub')} openWiki={openWiki} />
                <EducationalWikiModal isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric} liveStats={wikiLiveStats} />
            </div>
        </div>
    );
    if (activeView === 'performance') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <PerformanceView onBack={() => setActiveView('hub')} openWiki={openWiki} />
                <EducationalWikiModal isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric} liveStats={wikiLiveStats} />
            </div>
        </div>
    );
    if (activeView === 'accreditation') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <AccreditationView onBack={() => setActiveView('hub')} openWiki={openWiki} />
                <EducationalWikiModal isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric} liveStats={wikiLiveStats} />
            </div>
        </div>
    );
    if (activeView === 'logistics') return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950">
            <div className="max-w-3xl mx-auto">
                <LogisticsView onBack={() => setActiveView('hub')} openWiki={openWiki} />
                <EducationalWikiModal isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric} liveStats={wikiLiveStats} />
            </div>
        </div>
    );


    // === MAIN HUB ===
    return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950 relative">
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

            <div className="relative z-10 max-w-4xl mx-auto space-y-5">
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-black text-white/90 uppercase tracking-tight flex items-center gap-3">
                            <div className="bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/20">
                                <Activity size={22} className="text-emerald-400" />
                            </div>
                            Mission Control
                        </h2>
                        <p className="text-emerald-300/50 text-[10px] uppercase tracking-[0.3em] mt-1 ml-14 font-black">
                            {accreditation} • SYSTEM HUB
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Satu Sehat Sync */}
                        <button
                            onClick={handleManualSync}
                            disabled={isSyncing}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${isSyncing ? 'animate-pulse bg-blue-500/20 border-blue-500/40 text-blue-400' : syncStatus === 'synced' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-white/[0.04] border-white/[0.08] text-white/30'}`}
                            title="Sync Data & Documentation"
                        >
                            {isSyncing ? <Loader2 size={12} className="animate-spin" /> : syncStatus === 'synced' ? <Wifi size={12} /> : <WifiOff size={12} />}
                            <span>{isSyncing ? 'Syncing...' : 'Satu Sehat'}</span>
                        </button>
                    </div>
                </div>

                {/* ── LIVE STATUS BAR ── */}
                <div data-testid="dashboard-stats" className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-4">
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Pasien Hari Ini</span>
                            <span className="font-data text-xl font-black text-white/80">{todayPatients}</span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Antrian</span>
                            <span className="font-data text-xl font-black text-white/80">{queue.length}</span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Quality Score</span>
                            <span className="font-data text-xl font-black text-emerald-400">{derivedKpis.overallScore}</span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Kesembuhan</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hubButtons.map(btn => {
                        const c = colorMap[btn.color];
                        return (
                            <button
                                key={btn.id}
                                onClick={() => setActiveView(btn.id)}
                                className={`group relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:${c.bg10} hover:${c.border30} transition-all duration-300 text-left overflow-hidden`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg5} rounded-full -mr-12 -mt-12 blur-2xl group-hover:${c.bgGlow} transition-all duration-500`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2.5 rounded-xl ${c.bg15} border ${c.border20} group-hover:scale-110 transition-transform`}>
                                            <btn.icon size={20} className={c.text} />
                                        </div>
                                        {btn.wikiKey && (
                                            <div onClick={(e) => { e.stopPropagation(); openWiki(btn.wikiKey); }}
                                                className="p-1.5 rounded-full bg-white/[0.05] text-white/20 hover:text-white/50 transition-colors">
                                                <Info size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={`font-display text-sm font-black text-white/80 uppercase tracking-tight group-hover:${c.textHover} transition-colors`}>
                                        {btn.label}
                                    </h3>
                                    <p className="text-[10px] text-white/30 font-medium mt-0.5 uppercase tracking-wider">{btn.sublabel}</p>
                                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                        <span className={`font-data text-xs font-black ${c.textStat}`}>
                                            {btn.quickStat}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── ACTIVE EVENT BANNER ── */}
                {activeEvent && (
                    <div className="bg-indigo-500/10 backdrop-blur-md rounded-2xl border border-indigo-500/20 p-4 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                            <Activity size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-indigo-300 uppercase tracking-wider">{activeEvent.title}</p>
                            <p className="text-[10px] text-indigo-300/50">{activeEvent.description}</p>
                        </div>
                    </div>
                )}

                {/* ── SYSTEM LOG (Condensed) ── */}
                {alerts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 opacity-30">
                        <Shield size={40} className="text-emerald-400 mb-2" />
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Semua Sistem Normal</p>
                    </div>
                )}
            </div>

            {/* Wiki Modal */}
            <EducationalWikiModal
                isOpen={isWikiOpen}
                onClose={closeWiki}
                metricKey={wikiMetric}
                liveStats={wikiLiveStats}
            />
        </div>
    );
}
