/**
 * @reflection
 * [IDENTITY]: KPIDashboard (Aegis Command Center Edition)
 * [PURPOSE]: Tactical Holographic Dashboard — Kinetic Numbers, Radar Sweep, Cybernetic Bars, Forensic Dossiers.
 * [STATE]: SSS-Tier Cinematic UI
 * [DEPENDS_ON]: GameContext, ThemeContext, EducationalWikiModal
 * [LAST_UPDATE]: 2026-03-23
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
    TrendingUp, TrendingDown, Target, Users, Stethoscope, Pill,
    DollarSign, Heart, AlertTriangle, CheckCircle, Activity, Award,
    Search, Calendar, Info, Check, XCircle, AlertCircle, Briefcase,
    ShieldCheck, Fingerprint, Database, Cpu, Radar
} from 'lucide-react';
import EducationalWikiModal from './EducationalWikiModal.jsx';

// ─── KINETIC CSS ───
const DASHBOARD_CSS = `
    @keyframes db-fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes dash-radar-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
    @keyframes db-chart-grow { from { height: 0%; opacity: 0; } to { opacity: 1; } }

    .tactical-glass {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.5);
    }
    .tactical-glass-light {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: inset 0 1px 1px rgba(255,255,255,1), 0 10px 30px rgba(0,0,0,0.05);
    }

    .kpi-card-hover { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .kpi-card-hover:hover { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2); border-color: rgba(6,182,212,0.4); }
    .tactical-glass-light.kpi-card-hover:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: rgba(99,102,241,0.4); }

    .tactical-tab { position: relative; overflow: hidden; transition: all 0.3s; }
    .tactical-tab.active { background: rgba(99,102,241,0.15); color: #818CF8; border-color: rgba(99,102,241,0.5); }
    .tactical-tab.active::after { content: ''; position: absolute; bottom: 0; left: 10%; right: 10%; height: 2px; background: #818CF8; box-shadow: 0 0 10px #818CF8; }

    .holo-bar { animation: db-chart-grow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: bottom; }

    .chart-grid { background-size: 24px 24px; background-image: linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px); }

    .radar-scanner {
        position: absolute; top: 0; bottom: 0; width: 30%;
        background: linear-gradient(to right, transparent, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.4) 100%);
        border-right: 1px solid rgba(99,102,241,0.8);
        animation: dash-radar-sweep 4s linear infinite; pointer-events: none; mix-blend-mode: screen;
    }

    .blueprint-bg {
        background-color: #020617;
        background-image: linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
        background-size: 40px 40px;
    }

    .thin-scrollbar::-webkit-scrollbar { width: 5px; }
    .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 10px; }
`;

// 🌟 HACK 1: ROLLING NUMBER EFFECT
function RollingNumber({ value, isCurrency = false }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1000;
        if (value === 0 || value == null) { setDisplay(0); return; }
        const numValue = Math.abs(Number(value) || 0);
        const increment = numValue / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= numValue) { setDisplay(numValue); clearInterval(timer); }
            else setDisplay(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    const numVal = Number(display) || 0;
    if (isCurrency) {
        if (numVal >= 1000000) return `${(numVal / 1000000).toFixed(1)}Jt`;
        if (numVal >= 1000) return `${(numVal / 1000).toFixed(0)}Rb`;
    }
    return numVal.toLocaleString('id-ID');
}

const generateMedHash = (str, day) => {
    const code = (str || 'X').charCodeAt(0);
    return `0x${Math.abs(code * (day || 1) * 13).toString(16).toUpperCase().padStart(4, '0')}`;
};

function TacticalKPICard({ title, value, unit, icon: Icon, colorTheme, subtext, trend, info, openWiki, isDark, delay = 0 }) {
    const themes = {
        emerald: isDark ? 'text-emerald-400' : 'text-emerald-700',
        rose: isDark ? 'text-rose-400' : 'text-rose-700',
        sky: isDark ? 'text-sky-400' : 'text-sky-700',
        amber: isDark ? 'text-amber-400' : 'text-amber-700',
        indigo: isDark ? 'text-indigo-400' : 'text-indigo-700'
    };

    return (
        <div style={{ animation: `db-fade-up 0.5s ease-out forwards ${delay}s`, opacity: 0 }}
            onClick={() => info && info.wikiKey && openWiki(info.wikiKey)}
            className={`${isDark ? 'tactical-glass' : 'tactical-glass-light'} rounded-2xl p-5 relative overflow-hidden kpi-card-hover group ${info ? 'cursor-pointer' : ''}`}>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <p className={`text-[9px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
                        {info && <Info size={10} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-4xl font-black tracking-tight ${isDark ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>
                            <RollingNumber value={value} />
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{unit}</span>
                    </div>
                    {subtext && <p className={`text-[9px] font-mono mt-3 uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>}
                </div>

                <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 shadow-inner ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'} ${themes[colorTheme]}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>

            {trend !== undefined && (
                <div className={`absolute bottom-4 right-4 flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded border ${trend >= 0 ? (isDark ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200') : (isDark ? 'bg-rose-950/50 text-rose-400 border-rose-900/50' : 'bg-rose-50 text-rose-600 border-rose-200')}`}>
                    {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                </div>
            )}
        </div>
    );
}

function CyberProgressBar({ value, max = 100, colorTheme = 'emerald', label, info, openWiki, isDark, delay = 0 }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const glows = { emerald: '#10B981', rose: '#E11D48', sky: '#0EA5E9', amber: '#F59E0B', indigo: '#6366F1' };

    return (
        <div style={{ animation: `db-fade-up 0.5s ease-out forwards ${delay}s`, opacity: 0 }}
            onClick={() => info && info.wikiKey && openWiki(info.wikiKey)} className={`space-y-2 py-1 ${info ? 'cursor-pointer group' : ''}`}>
            <div className="flex justify-between items-end text-[10px] font-mono tracking-widest uppercase font-bold">
                <div className="flex items-center gap-2">
                    <span className={isDark ? 'text-slate-400 group-hover:text-indigo-400 transition-colors' : 'text-slate-500 group-hover:text-indigo-600 transition-colors'}>{label}</span>
                    {info && <Info size={12} className="opacity-40" />}
                </div>
                <span className={isDark ? 'text-white text-xs font-black' : 'text-slate-800 text-xs font-black'}><RollingNumber value={value} />%</span>
            </div>

            <div className={`h-2 rounded-full overflow-hidden border p-[1px] relative ${isDark ? 'bg-[#020617] border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
                <div className="h-full rounded-full transition-all duration-1000 ease-out relative z-10"
                     style={{ width: `${percentage}%`, backgroundColor: glows[colorTheme], boxShadow: isDark ? `0 0 10px ${glows[colorTheme]}` : 'none' }}>
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full opacity-80" />
                </div>
            </div>
        </div>
    );
}

export default function KPIDashboard() {
    const { stats, kpi, derivedKpis, day, history, queue, monthlyArchive, isWikiOpen, wikiMetric, openWiki, closeWiki } = useGame();
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('performance');
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => { setRenderKey(prev => prev + 1); }, [activeTab]);

    const getPerformanceColor = (value, thresholds) => {
        if (value >= thresholds.good) return 'emerald';
        if (value >= thresholds.fair) return 'amber';
        return 'rose';
    };

    const analytics = useMemo(() => {
        const todayHistory = history.filter(p => p.day === day);
        const tData = Array.from({ length: 9 }, (_, i) => {
            const hour = i + 8; const start = hour * 60; const end = (hour + 1) * 60;
            const hCount = todayHistory.filter(p => (p.joinedAt || 480) >= start && (p.joinedAt || 480) < end).length;
            const qCount = queue.filter(p => (p.joinedAt || 480) >= start && (p.joinedAt || 480) < end).length;
            return { label: `${hour.toString().padStart(2, '0')}:00`, value: hCount + qCount };
        });

        const dCounts = {};
        todayHistory.forEach(p => { const dx = p.medicalData?.diagnosis || p.medicalData?.diagnosisName || 'Belum Diketahui'; dCounts[dx] = (dCounts[dx] || 0) + 1; });
        const tDiseases = Object.entries(dCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
            .map(([name, count]) => ({ name, count, percent: (count / (todayHistory.length || 1)) * 100 }));

        return { trafficData: tData, topDiseases: tDiseases, totalToday: todayHistory.length + queue.length, clinicalAudit: todayHistory.slice(-10).reverse() };
    }, [history, queue, day]);

    const { trafficData, topDiseases, totalToday, clinicalAudit } = analytics;
    const maxTraffic = Math.max(...trafficData.map(d => d.value), 2);

    return (
        <div className={`h-full flex flex-col font-sans select-none transition-colors duration-500 relative overflow-hidden ${isDark ? 'blueprint-bg text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <style dangerouslySetInnerHTML={{ __html: DASHBOARD_CSS }} />

            {isDark && (
                <>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />
                </>
            )}

            {/* TACTICAL HEADER */}
            <div className={`p-6 shrink-0 relative overflow-hidden border-b z-20 ${isDark ? 'bg-[#0a0f16]/80 backdrop-blur-xl border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900 border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
                            <Radar size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h1 className={`text-2xl md:text-3xl font-black tracking-[0.15em] uppercase leading-none ${isDark ? 'text-white drop-shadow-lg' : 'text-slate-800'}`}>
                                AEGIS <span className="text-indigo-500">OVERWATCH</span>
                            </h1>
                            <div className={`flex items-center gap-2 mt-1.5 text-[10px] font-mono tracking-widest uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
                                LIVE TELEMETRY // DAY {day}
                            </div>
                        </div>
                    </div>

                    <div className={`flex rounded-2xl p-1.5 border shadow-inner overflow-x-auto w-full md:w-auto thin-scrollbar ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                        {[
                            { id: 'performance', label: 'Telemetry', icon: Target },
                            { id: 'analytics', label: 'Radar', icon: Activity },
                            { id: 'audit', label: 'Forensic', icon: Stethoscope },
                            { id: 'monthly', label: 'Vault', icon: Database }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`tactical-tab flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? (isDark ? 'active bg-indigo-500/10' : 'bg-white text-indigo-600 shadow-sm border border-slate-200')
                                        : (isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:text-indigo-500 hover:bg-white/50')}`}>
                                <tab.icon size={14} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                                <span className="hidden sm:inline">DIR://</span>{tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div key={renderKey} className="flex-1 overflow-y-auto p-4 md:p-8 thin-scrollbar relative z-10">

                {/* TAB: PERFORMANCE */}
                {activeTab === 'performance' && (
                    <div className="space-y-8 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <TacticalKPICard title="Total Entitas" value={kpi.totalPatients} icon={Users} colorTheme="sky" isDark={isDark} openWiki={openWiki} delay={0.1} subtext={`${kpi.bpjsPatients} JKN | ${kpi.umumPatients} UMUM`} />
                            <TacticalKPICard title="Akurasi Diagnostik" value={derivedKpis.clinicalAccuracy} unit="%" icon={Target} isDark={isDark} openWiki={openWiki} delay={0.2} colorTheme={getPerformanceColor(derivedKpis.clinicalAccuracy, { good: 85, fair: 70 })} info={{ wikiKey: 'accuracy' }} />
                            <TacticalKPICard title="Rasio Evakuasi" value={derivedKpis.referralRate} unit="%" icon={Activity} isDark={isDark} openWiki={openWiki} delay={0.3} colorTheme={derivedKpis.referralRate <= 15 ? 'emerald' : 'rose'} subtext="TARGET: < 15%" info={{ wikiKey: 'rrns' }} />
                            <TacticalKPICard title="RRNS (Deviasi)" value={derivedKpis.rrns} unit="%" icon={AlertTriangle} isDark={isDark} openWiki={openWiki} delay={0.4} colorTheme={derivedKpis.rrns <= 2 ? 'emerald' : 'amber'} subtext="Clinical Waste" info={{ wikiKey: 'rrns' }} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className={`lg:col-span-2 rounded-[32px] p-6 md:p-8 border ${isDark ? 'tactical-glass' : 'tactical-glass-light'}`} style={{ animation: 'db-fade-up 0.5s ease-out forwards 0.5s', opacity: 0 }}>
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 border-b pb-3 font-mono ${isDark ? 'text-indigo-400 border-slate-700/50' : 'text-indigo-600 border-slate-200'}`}>
                                    <Award size={14} /> QUALITY & SAFETY MATRIX
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    <CyberProgressBar label="Validitas Terapi" value={derivedKpis.treatmentAppropriateRate} colorTheme="indigo" isDark={isDark} info={{ wikiKey: 'treatment' }} openWiki={openWiki} delay={0.6} />
                                    <CyberProgressBar label="Antibiotic Defense" value={derivedKpis.antibioticStewardship} colorTheme="emerald" isDark={isDark} info={{ wikiKey: 'antibiotics' }} openWiki={openWiki} delay={0.7} />
                                    <CyberProgressBar label="Efisiensi Logistik" value={derivedKpis.testEfficiency || 100} colorTheme="sky" isDark={isDark} info={{ wikiKey: 'inventory' }} openWiki={openWiki} delay={0.8} />
                                    <CyberProgressBar label="Social Reputation" value={derivedKpis.avgSatisfaction} colorTheme="amber" isDark={isDark} info={{ wikiKey: 'reputation' }} openWiki={openWiki} delay={0.9} />
                                </div>
                            </div>

                            {/* Financial Vault */}
                            <div className={`lg:col-span-1 rounded-3xl p-6 md:p-8 relative overflow-hidden border shadow-2xl flex flex-col justify-between ${isDark ? 'bg-[#020617] border-slate-800' : 'bg-slate-900 border-slate-800 text-white'}`} style={{ animation: 'db-fade-up 0.5s ease-out forwards 0.6s', opacity: 0 }}>
                                <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none"><DollarSign size={200} /></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />

                                <div>
                                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-mono">
                                        <Briefcase size={14} /> FINANCIAL LEDGER
                                    </h3>
                                    <div className="mb-6">
                                        <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest mb-1">GROSS REVENUE</p>
                                        <p className="text-3xl font-black text-emerald-400 font-mono tracking-tighter" style={{ textShadow: '0 0 15px rgba(16,185,129,0.4)' }}>
                                            <span className="text-slate-500 text-2xl mr-1">Rp</span><RollingNumber value={stats.kapitasi + stats.pendapatanUmum} isCurrency />
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-slate-800">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">OPEX (PENGELUARAN)</p>
                                            <p className="text-sm font-black text-rose-400 font-mono">- Rp <RollingNumber value={derivedKpis.totalExpense} isCurrency /></p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">NET MARGIN</p>
                                            <p className={`text-lg font-black font-mono ${derivedKpis.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                                                Rp <RollingNumber value={Math.abs(derivedKpis.netBalance || 0)} isCurrency />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: RADAR ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-7xl mx-auto">
                        <div className={`rounded-[32px] border flex flex-col overflow-hidden relative ${isDark ? 'tactical-glass border-indigo-900/30' : 'tactical-glass-light border-indigo-200'}`}>
                            <div className="p-8 pb-0 relative z-10">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    <Activity size={14} className="inline mr-2 -mt-0.5" /> LIVE TRAFFIC SONAR
                                </h3>
                                <p className={`text-2xl font-black font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    TOTAL: <span className="text-slate-500"><RollingNumber value={totalToday} /> ENTITIES</span>
                                </p>
                            </div>

                            <div className="flex-1 relative mt-6 chart-grid flex items-end px-8 pb-8 min-h-[300px]">
                                {isDark && <div className="radar-scanner" />}

                                <div className={`w-full flex items-end justify-between gap-2 sm:gap-4 h-full relative z-10 border-b-2 pb-2 ${isDark ? 'border-indigo-500/30' : 'border-slate-300'}`}>
                                    {trafficData.map((d, idx) => {
                                        const h = maxTraffic > 0 ? (d.value / maxTraffic) * 100 : 0;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                                                <div className={`w-full rounded-t-md relative overflow-hidden ${isDark ? 'bg-indigo-950/30' : 'bg-indigo-50'}`} style={{ height: `${h}%` }}>
                                                    {h > 0 && (
                                                        <div className={`absolute bottom-0 left-0 w-full holo-bar bg-gradient-to-t ${isDark ? 'from-indigo-900/50 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'from-indigo-100 to-indigo-500'}`} style={{ animationDelay: `${idx * 0.05}s` }} />
                                                    )}
                                                </div>
                                                <div className={`absolute bottom-[calc(100%+10px)] border text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg whitespace-nowrap ${isDark ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-white border-indigo-200 text-indigo-700'}`}>
                                                    {d.value} LOGS
                                                </div>
                                                <span className="text-[9px] font-mono font-black text-slate-500">{d.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Top Diseases */}
                        <div className={`rounded-[32px] border p-8 flex flex-col ${isDark ? 'tactical-glass' : 'tactical-glass-light'}`}>
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 border-b pb-3 font-mono ${isDark ? 'text-rose-400 border-slate-700/50' : 'text-rose-600 border-slate-200'}`}>
                                <Target size={16} /> EPIDEMIOLOGY TARGETS
                            </h3>
                            <div className="flex-1 space-y-5 pr-2 overflow-y-auto thin-scrollbar">
                                {topDiseases.length > 0 ? topDiseases.map((d, idx) => (
                                    <div key={idx} className="group cursor-default" style={{ animation: `db-fade-up 0.5s ease-out forwards ${idx * 0.1}s`, opacity: 0 }}>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className={`font-mono text-[10px] font-black uppercase tracking-widest truncate pr-4 ${isDark ? 'text-slate-300' : 'text-slate-700'} transition-colors`}>{idx + 1}. {d.name}</span>
                                            <span className="font-mono text-xs font-black text-rose-500">{d.count} <span className="text-[8px] text-slate-500">CASES</span></span>
                                        </div>
                                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-200'}`}>
                                            <div className={`h-full bg-gradient-to-r from-rose-700 to-rose-500 holo-bar ${isDark ? 'shadow-[0_0_10px_rgba(225,29,72,0.5)]' : ''}`} style={{ width: `${d.percent}%`, animationDelay: `${idx * 0.1}s` }} />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                                        <Search size={32} className="mb-2" /> SCANNING FOR ANOMALIES...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: FORENSIC AUDIT */}
                {activeTab === 'audit' && (
                    <div className="max-w-4xl mx-auto pb-10">
                        <div className={`flex justify-between items-end mb-6 border-b pb-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div>
                                <h3 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Forensic Audit Logs</h3>
                                <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em] mt-1">&gt; Dekripsi Keputusan Medis (10 Pasien Terakhir)</p>
                            </div>
                            <div className={`font-mono text-[10px] font-black px-3 py-1.5 rounded flex items-center gap-2 ${isDark ? 'text-indigo-400 bg-indigo-950/50 border border-indigo-900' : 'text-indigo-600 bg-indigo-50 border border-indigo-200'}`}>
                                <Database size={12} /> {clinicalAudit.length} RECORDS
                            </div>
                        </div>

                        <div className="space-y-4">
                            {clinicalAudit.length > 0 ? clinicalAudit.map((p, idx) => {
                                // Codex Fix: use decision.diagnoses[] not .diagnosis; exclude transfers from isPerfect
                                const isTransferOrStabilize = ['sisrute_transferred', 'stabilized', 'delegated'].includes(p.outcomeStatus);
                                const isPerfect = !isTransferOrStabilize && (p.outcome === 'good' || (p.satisfactionScore && p.satisfactionScore >= 80));
                                const diagName = p.decision?.diagnoses?.[0] || p.medicalData?.trueDiagnosisCode || p.medicalData?.diagnosisName || 'UNKNOWN';
                                const actionLabel = p.decision?.action === 'treat' ? 'TREATED' : p.decision?.action === 'refer' ? 'REFERRED' : p.decision?.action || 'N/A';
                                const logId = generateMedHash(p.name, p.day);

                                return (
                                    <div key={idx} style={{ animation: `db-fade-up 0.4s ease-out forwards ${idx * 0.1}s`, opacity: 0 }}
                                        className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] relative overflow-hidden group
                                        ${isDark ? 'bg-[#0a0f16]/80 backdrop-blur-md border-slate-800 hover:border-slate-600' : 'bg-white border-slate-200 hover:shadow-lg'}`}>

                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPerfect ? 'bg-emerald-500 shadow-[0_0_15px_#10B981]' : 'bg-rose-500 shadow-[0_0_15px_#E11D48]'}`} />

                                        <div className={`absolute -right-4 -top-6 text-[64px] font-black opacity-[0.03] transform rotate-12 pointer-events-none uppercase font-serif ${isPerfect ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {isPerfect ? 'VERIFIED' : 'REJECTED'}
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center gap-6 pl-2 relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                                                        LOG_ID: {logId}
                                                    </span>
                                                    <h4 className={`font-black uppercase tracking-wider truncate text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{p.name}</h4>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border hidden sm:inline ${isDark ? 'text-cyan-500 bg-cyan-950/50 border-cyan-900' : 'text-cyan-600 bg-cyan-50 border-cyan-200'}`}>DAY {p.day}</span>
                                                </div>

                                                <div className="flex gap-4 sm:gap-6 mt-3">
                                                    <div>
                                                        <p className={`text-[8px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>DIAGNOSIS</p>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isPerfect ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {isPerfect ? <CheckCircle size={12} /> : <XCircle size={12} />} {diagName}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className={`text-[8px] font-mono uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>TINDAKAN</p>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isPerfect ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                            {isPerfect ? <CheckCircle size={12} /> : <AlertCircle size={12} />} {actionLabel}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className={`text-[10px] font-mono mt-4 p-2.5 rounded-lg border italic border-l-2 ${isDark ? 'text-slate-400 bg-slate-900/50 border-slate-800/50 border-l-slate-600' : 'text-slate-600 bg-slate-50 border-slate-200 border-l-slate-400'}`}>
                                                    &gt; {isPerfect ? "Protokol dieksekusi dengan sempurna. Pasien pulih." : isTransferOrStabilize ? `Pasien di-${p.outcomeStatus === 'sisrute_transferred' ? 'transfer via SISRUTE' : p.outcomeStatus === 'stabilized' ? 'stabilisasi' : 'delegasikan'}.` : "Analisis mendalam diperlukan. Deviasi protokol terdeteksi."}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end gap-2 shrink-0 md:pr-4 mt-4 md:mt-0">
                                                <div className={`text-[9px] font-mono uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SKOR</div>
                                                <div className={`text-2xl font-black font-mono ${isPerfect ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-slate-600'}`}>
                                                    {p.satisfactionScore || (isPerfect ? 90 : 40)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className={`py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl ${isDark ? 'border-slate-700 bg-slate-900/20' : 'border-slate-300 bg-slate-50'}`}>
                                    <Search size={48} className="opacity-20 text-slate-500 mb-4" />
                                    <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>DATABASE KOSONG. BELUM ADA PASIEN DITANGANI.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: FISCAL VAULT */}
                {activeTab === 'monthly' && (
                    <div className="max-w-5xl mx-auto pb-10">
                        <div className={`flex justify-between items-end mb-6 border-b pb-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div>
                                <h3 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>FISCAL VAULT ARCHIVES</h3>
                                <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] mt-1">&gt; REKAPITULASI JKN (30-DAY CYCLE)</p>
                            </div>
                        </div>
                        {monthlyArchive && monthlyArchive.length > 0 ? (
                            <div className="space-y-6">
                                {monthlyArchive.slice().reverse().map((report, idx) => (
                                    <div key={idx} style={{ animation: `db-fade-up 0.5s ease-out forwards ${idx * 0.1}s`, opacity: 0 }}
                                        className={`p-6 rounded-[32px] border shadow-lg flex flex-col md:flex-row gap-8 items-center hover:border-indigo-500/50 transition-colors group ${isDark ? 'bg-[#0a0f16] border-slate-800' : 'bg-white border-slate-200'}`}>

                                        <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative shrink-0">
                                            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
                                            <div className="text-center">
                                                <div className="text-4xl font-black text-indigo-500 leading-none font-mono drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">{report.month}</div>
                                                <div className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">SIKLUS</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
                                            <div>
                                                <p className={`text-[9px] font-mono uppercase tracking-widest mb-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>RATA-RATA SKOR</p>
                                                <div className="flex items-baseline gap-1">
                                                    <p className={`text-3xl font-black font-mono ${report.avgScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{report.avgScore}</p>
                                                    <span className="text-sm opacity-50 font-bold">/100</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className={`text-[9px] font-mono uppercase tracking-widest mb-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>REPUTASI</p>
                                                <p className="text-3xl font-black text-rose-500 font-mono">{report.avgReputation}%</p>
                                            </div>
                                            <div className={`sm:col-span-2 p-4 rounded-2xl flex items-center justify-between shadow-inner ${isDark ? 'bg-indigo-950/30 border border-indigo-900/50' : 'bg-indigo-50 border border-indigo-200'}`}>
                                                <div>
                                                    <p className={`text-[9px] font-mono uppercase tracking-widest mb-1 font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>BONUS KAPITASI</p>
                                                    <p className={`text-2xl font-black font-mono ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>Rp <RollingNumber value={report.avgScore * 50000} isCurrency /></p>
                                                </div>
                                                <Award size={32} className="text-indigo-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl ${isDark ? 'border-slate-700 bg-slate-900/20' : 'border-slate-300 bg-slate-50'}`}>
                                <Calendar size={48} className="opacity-20 text-slate-500 mb-4" />
                                <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SIKLUS 30 HARI BELUM TERCAPAI.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Educational Wiki Modal */}
            <EducationalWikiModal
                isOpen={isWikiOpen} onClose={closeWiki} metricKey={wikiMetric}
                liveStats={useMemo(() => {
                    if (!wikiMetric) return null;
                    switch (wikiMetric) {
                        case 'accuracy': return { "Diagnosa Tepat": derivedKpis.clinicalAccuracy + "%", "Total Pasien": kpi.totalPatients };
                        case 'treatment': return { "Rasionalitas": derivedKpis.treatmentAppropriateRate + "%", "Target": "90%" };
                        case 'antibiotics': return { "Rasio Bijak": derivedKpis.antibioticStewardship + "%", "Status": derivedKpis.antibioticStewardship < 80 ? "Over-prescribe" : "Normal" };
                        case 'rrns': return { "Rasio RRNS": derivedKpis.rrns + "%", "Target": "< 2%" };
                        default: return null;
                    }
                }, [wikiMetric, derivedKpis, kpi])}
            />
        </div>
    );
}
