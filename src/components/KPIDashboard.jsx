/**
 * @reflection
 * [IDENTITY]: KPIDashboard
 * [PURPOSE]: React UI component: KPIDashboard.
 * [STATE]: Experimental
 * [ANCHOR]: KPIDashboard
 * [DEPENDS_ON]: GameContext, ThemeContext, EducationalWikiModal, WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
    TrendingUp, TrendingDown, Target, Users, Stethoscope, Pill,
    DollarSign, Heart, AlertTriangle, CheckCircle, Activity, Award,
    Search, Calendar, Info, ChevronRight, Check, XCircle, AlertCircle, Briefcase
} from 'lucide-react';
import EducationalWikiModal from './EducationalWikiModal.jsx';
// WIKI_DATA removed — EducationalWikiModal loads data internally via getWikiEntry

function KPICard({ title, value, unit, icon: _Icon, color, subtext, trend, info }) {
    const colorClasses = {
        green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        red: 'bg-rose-50 border-rose-100 text-rose-700',
        blue: 'bg-sky-50 border-sky-100 text-sky-700',
        yellow: 'bg-amber-50 border-amber-100 text-amber-700',
        purple: 'bg-indigo-50 border-indigo-100 text-indigo-700',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700'
    };

    const iconColors = {
        green: 'text-emerald-500 bg-emerald-100',
        red: 'text-rose-500 bg-rose-100',
        blue: 'text-sky-500 bg-sky-100',
        yellow: 'text-amber-500 bg-amber-100',
        purple: 'text-indigo-500 bg-indigo-100',
        indigo: 'text-indigo-500 bg-indigo-100'
    };

    return (
        <div
            onClick={() => info && info.wikiKey && info.onOpen(info.wikiKey)}
            className={`p-4 rounded-2xl border ${colorClasses[color] || colorClasses.blue} shadow-sm transition-all group ${info && info.wikiKey ? 'cursor-pointer hover:shadow-xl hover:border-indigo-500/50' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{title}</p>
                        {info && (
                            <div className="p-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <Info size={12} />
                            </div>
                        )}
                    </div>
                    <p className="text-3xl font-black tracking-tight">
                        {value}<span className="text-base font-normal ml-0.5 opacity-60">{unit}</span>
                    </p>
                    {subtext && <p className="text-xs mt-1 font-medium opacity-70">{subtext}</p>}
                </div>
                <div className={`p-2.5 rounded-xl ${iconColors[color] || iconColors.blue} transition-transform group-hover:scale-110`}>
                    <Icon size={22} strokeWidth={2.5} />
                </div>
            </div>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                </div>
            )}
        </div>
    );
}

function ProgressBar({ value, max = 100, color = 'emerald', label, showValue = true, info }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const gradients = {
        emerald: 'from-emerald-400 to-emerald-600',
        rose: 'from-rose-400 to-rose-600',
        sky: 'from-sky-400 to-sky-600',
        amber: 'from-amber-400 to-amber-600',
        indigo: 'from-indigo-400 to-indigo-600'
    };

    return (
        <div
            onClick={() => info && info.wikiKey && info.onOpen(info.wikiKey)}
            className={`space-y-1.5 py-1 ${info && info.wikiKey ? 'cursor-pointer group' : ''}`}
        >
            <div className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-1.5">
                    <span className={`font-bold uppercase tracking-tight ${info && info.wikiKey ? 'text-slate-500 group-hover:text-indigo-600' : 'text-slate-500'}`}>{label}</span>
                    {info && info.wikiKey && (
                        <Info size={12} className="text-slate-400 group-hover:text-indigo-500" />
                    )}
                </div>
                {showValue && <span className="font-black text-slate-800">{value}%</span>}
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-[1px]">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradients[color] || gradients.emerald} transition-all duration-700 ease-out shadow-sm`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default function KPIDashboard() {
    const { stats, kpi, derivedKpis, reputation: _reputation, day, history, queue, monthlyArchive, isWikiOpen, wikiMetric, openWiki, closeWiki } = useGame();
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('performance');



    const formatCurrency = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
        return num.toString();
    };

    // Determine performance level colors
    const getPerformanceColor = (value, thresholds) => {
        if (value >= thresholds.good) return 'green';
        if (value >= thresholds.fair) return 'yellow';
        return 'red';
    };

    // Analytics Calculations
    const getAnalyticsData = () => {
        const todayHistory = history.filter(p => p.day === day);

        // Traffic (Hour 8 to 16)
        const trafficData = Array.from({ length: 9 }, (_, i) => {
            const hour = i + 8;
            const start = hour * 60;
            const end = (hour + 1) * 60;
            const historyCount = todayHistory.filter(p => (p.joinedAt || 480) >= start && (p.joinedAt || 480) < end).length;
            const queueCount = queue.filter(p => (p.joinedAt || 480) >= start && (p.joinedAt || 480) < end).length;

            return { label: `${hour < 10 ? '0' : ''}${hour}:00`, value: historyCount + queueCount };
        });

        // Top Diseases
        const diseaseCounts = {};
        todayHistory.forEach(p => {
            const dx = p.medicalData?.diagnosisName || 'Undiagnosed';
            diseaseCounts[dx] = (diseaseCounts[dx] || 0) + 1;
        });

        const topDiseases = Object.entries(diseaseCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, count]) => ({ name, count, percent: (count / (todayHistory.length || 1)) * 100 }));

        // Clinical Audit (Recent Patients)
        const clinicalAudit = todayHistory.slice(-10).reverse();

        return { trafficData, topDiseases, totalToday: todayHistory.length + queue.length, clinicalAudit };
    };

    const { trafficData, topDiseases, totalToday, clinicalAudit } = getAnalyticsData();
    const maxTraffic = Math.max(...trafficData.map(d => d.value), 2);

    return (
        <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} h-full flex flex-col font-sans select-none transition-colors duration-300`}>
            {/* Glossy Header */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                                <Activity size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white/90 tracking-tight leading-none uppercase">Clinical Intelligence</h2>
                                <p className="text-[10px] text-emerald-300 font-bold tracking-[0.2em] uppercase mt-1 opacity-80">Day {day} Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs (Glassmorphic) */}
                    <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1.5 border border-white/10">
                        {[
                            { id: 'performance', label: 'Dashboard', icon: Target },
                            { id: 'audit', label: 'Audit Klinis', icon: Stethoscope },
                            { id: 'analytics', label: 'Analisis Data', icon: TrendingUp },
                            { id: 'monthly', label: 'Laporan Bulanan', icon: Calendar }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-950 shadow-lg shadow-black/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <tab.icon size={16} />
                                <span className="uppercase tracking-wider">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main scrollable view */}
            <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-slate-950/30' : 'bg-slate-50/50'}`}>

                {activeTab === 'performance' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Top Row: Strategic Indicators */}
                        <div className="grid grid-cols-4 gap-4">
                            <KPICard
                                title="Total Pasien"
                                value={kpi.totalPatients}
                                icon={Users}
                                color="blue"
                                subtext={`${kpi.bpjsPatients} BPJS | ${kpi.umumPatients} Umum`}
                            />
                            <KPICard
                                title="Akurasi Diagnosa"
                                value={derivedKpis.clinicalAccuracy}
                                unit="%"
                                icon={Target}
                                color={getPerformanceColor(derivedKpis.clinicalAccuracy, { good: 85, fair: 70 })}
                                info={{ wikiKey: 'accuracy', onOpen: openWiki }}
                            />
                            <KPICard
                                title="Rasio Rujukan"
                                value={derivedKpis.referralRate}
                                unit="%"
                                icon={Activity}
                                color={derivedKpis.referralRate <= 15 ? 'green' : 'red'}
                                subtext="Target: < 15%"
                                info={{ wikiKey: 'rrns', onOpen: openWiki }}
                            />
                            <KPICard
                                title="RRNS (Non-Spes)"
                                value={derivedKpis.rrns}
                                unit="%"
                                icon={AlertTriangle}
                                color={derivedKpis.rrns <= 2 ? 'green' : 'red'}
                                subtext="Kualitas Rujukan"
                                info={{ wikiKey: 'rrns', onOpen: openWiki }}
                            />
                        </div>

                        {/* Mid Row: Quality Metrics & Efficiency */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Quality Metrics Column */}
                            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/60'} rounded-3xl p-6 shadow-sm border`}>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Award size={14} /> Quality & Safety Indicators
                                </h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                    <ProgressBar
                                        label="Ketepatan Terapi"
                                        value={derivedKpis.treatmentAppropriateRate}
                                        color="indigo"
                                        info={{ wikiKey: 'treatment', onOpen: openWiki }}
                                    />
                                    <ProgressBar
                                        label="Antibiotic Stewardship"
                                        value={derivedKpis.antibioticStewardship}
                                        color="emerald"
                                        info={{ wikiKey: 'antibiotics', onOpen: openWiki }}
                                    />
                                    <ProgressBar
                                        label="Efisiensi Penunjang"
                                        value={derivedKpis.testEfficiency || 100}
                                        color="sky"
                                        info={{ wikiKey: 'inventory', onOpen: openWiki }}
                                    />
                                    <ProgressBar
                                        label="Customer Experience"
                                        value={derivedKpis.avgSatisfaction}
                                        color="amber"
                                        info={{ wikiKey: 'reputation', onOpen: openWiki }}
                                    />
                                </div>

                                {/* Proactive Feedback Toasts */}
                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    {derivedKpis.clinicalAccuracy < 70 && (
                                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
                                            <AlertCircle size={14} className="text-rose-500 mt-0.5" />
                                            <p className="text-[10px] text-rose-700 font-medium">Audit menunjukkan banyak kesalahan diagnosa. Luangkan waktu lebih banyak pada Anamnesis.</p>
                                        </div>
                                    )}
                                    {derivedKpis.antibioticStewardship < 80 && (
                                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                                            <Pill size={14} className="text-amber-500 mt-0.5" />
                                            <p className="text-[10px] text-amber-700 font-medium">Terlalu banyak antibiotik untuk kasus viral (ISPA/Flu). Skor rasionalitas menurun.</p>
                                        </div>
                                    )}
                                    {derivedKpis.clinicalAccuracy >= 85 && derivedKpis.avgSatisfaction >= 85 && (
                                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 col-span-2">
                                            <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                                            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight">Kinerja Klinis Sempurna! Standar kualitas rujukan dan terapi terpenuhi.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Financial Outlook */}
                            <div className="bg-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={80} /></div>
                                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-6">Financial Summary</h3>
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <p className="text-[10px] text-indigo-300 font-bold uppercase opacity-60">Total Pendapatan</p>
                                        <p className="text-2xl font-black">Rp {formatCurrency(stats.kapitasi + stats.pendapatanUmum)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-[9px] text-indigo-400 font-bold uppercase opacity-60">Pengeluaran</p>
                                            <p className="text-sm font-black text-rose-300">Rp {formatCurrency(derivedKpis.totalExpense)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-indigo-400 font-bold uppercase opacity-60">Saldo Bersih</p>
                                            <p className={`text-sm font-black ${derivedKpis.netBalance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                Rp {formatCurrency(derivedKpis.netBalance)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-xl text-[10px] leading-relaxed border border-white/5">
                                        <p className="opacity-80">💡 Efisiensi lab membatu menghemat operasional sebesar Rp {formatCurrency(stats.kapitasi * 0.1)} hari ini.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Clinical Audit Log</h3>
                                <p className="text-xs text-slate-500">Evaluasi keputusan medis 10 pasien terakhir sebagai sarana edukasi.</p>
                            </div>
                            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                                {clinicalAudit.length} Records
                            </div>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {clinicalAudit.length > 0 ? clinicalAudit.map((p, idx) => {
                                const isCorrectDx = p.medicalData?.isDiagnosisCorrect;
                                const isCorrectTx = p.medicalData?.isTreatmentCorrect;
                                return (
                                    <div key={idx} className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'} rounded-2xl border p-4 shadow-sm transition-all flex items-center gap-6`}>
                                        <div className={`p-3 rounded-full ${isCorrectDx && isCorrectTx ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {isCorrectDx && isCorrectTx ? <Check size={24} /> : <XCircle size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-800 uppercase text-xs">{p.name}</h4>
                                                <span className="text-[10px] text-slate-400 font-bold">HARI {p.day} | {p.medicalData?.diagnosisName}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isCorrectDx ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Diagnosis: {isCorrectDx ? 'TEPAT' : 'SALAH'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isCorrectTx ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Therapy: {isCorrectTx ? 'TEPAT' : 'KURANG RASIONAL'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="max-w-xs text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            {p.feedback || (isCorrectDx && isCorrectTx ? "Pasien menunjukkan perbaikan gejala yang nyata." : "Periksa kembali dasar diagnosa dan panduan obat.")}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                            <Award size={14} />
                                            <span className="text-xs font-black">{isCorrectDx && isCorrectTx ? '+20 XP' : '0 XP'}</span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-300">
                                    <Search size={48} className="opacity-20 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-[0.2em]">Belum ada data audit tersimpan</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-2 gap-6 h-full">
                            {/* Left: Patient Traffic Chart */}
                            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/60'} rounded-3xl p-6 shadow-sm border flex flex-col`}>
                                <h3 className="text-[10px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Users size={14} /> Patient Traffic Analysis
                                </h3>
                                <div className="flex-1 flex items-end justify-between gap-2.5 pt-4 pb-2 h-44">
                                    {trafficData.map((d, idx) => {
                                        const h = maxTraffic > 0 ? (d.value / maxTraffic) * 100 : 0;
                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                                                <div className="w-full h-full bg-slate-50 rounded-lg relative overflow-hidden">
                                                    <div
                                                        className="absolute bottom-0 left-0 w-full bg-indigo-500/80 group-hover:bg-indigo-600 rounded-t-sm transition-all cursor-pointer shadow-[0_-2px_6px_rgba(99,102,241,0.2)]"
                                                        style={{ height: `${h}%` }}
                                                    >
                                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all font-bold z-10 whitespace-nowrap shadow-xl">
                                                            {d.value} pasien
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400">{d.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500 text-center flex items-center justify-center gap-2">
                                    <Activity size={12} className="text-indigo-500" />
                                    TOTAL KUNJUNGAN HARI INI: <span className="text-slate-800">{totalToday} PASIEN</span>
                                </div>
                            </div>

                            {/* Right: Top Diseases */}
                            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/60'} rounded-3xl p-6 shadow-sm border flex flex-col`}>
                                <h3 className="text-[10px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <AlertTriangle size={14} /> Disease Prevalence (Top 8)
                                </h3>
                                <div className="flex-1 space-y-2.5">
                                    {topDiseases.length > 0 ? topDiseases.map((d, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[11px] group">
                                            <div className="flex items-center gap-2 max-w-[120px]">
                                                <span className="text-[9px] font-black text-slate-300 w-4 group-hover:text-indigo-400">{idx + 1}</span>
                                                <span className="font-bold text-slate-700 uppercase truncate">{d.name}</span>
                                            </div>
                                            <div className="flex-1 h-1.5 mx-4 bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="font-black text-slate-800 w-6 text-right">{d.count}</span>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-400 italic text-xs">No prevalence data</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Daily Insights Advice */}
                        <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
                            <div className="bg-indigo-500 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                                <Activity size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest mb-1.5">Intelligent Advice</h4>
                                <p className="text-[11px] text-indigo-800/80 leading-relaxed font-medium">
                                    Berdasarkan tren hari ini, lonjakan pasien diprediksi kembali pada pukul <strong>{[...trafficData].sort((a, b) => b.value - a.value)[0]?.label}</strong> esok hari.
                                    Pastikan stok obat <strong>{topDiseases[0]?.name || 'Golongan Antibiotik'}</strong> mencukupi di layanan farmasi untuk menjaga kelancaran operasional.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Laporan Kinerja Bulanan</h3>
                                <p className="text-xs text-slate-500">Rekapitulasi pencapaian dan bonus kapitasi setiap 30 hari.</p>
                            </div>
                            <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Award size={16} /> {monthlyArchive?.length || 0} Reports
                            </div>
                        </header>

                        {monthlyArchive && monthlyArchive.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 pb-10">
                                {monthlyArchive.slice().reverse().map((report, idx) => (
                                    <div key={idx} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-3xl border shadow-sm overflow-hidden group hover:border-indigo-300 transition-all`}>
                                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
                                                    {report.month}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Bulan {report.month}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Selesai pada Hari {report.month * 30}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status Kinerja</p>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${report.avgScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                    report.avgScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {report.avgScore >= 80 ? 'SANGAT BAIK' : report.avgScore >= 60 ? 'CUKUP' : 'KURANG'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 grid grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Skor Rata-rata</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-3xl font-black text-slate-800">{report.avgScore}<span className="text-sm font-normal opacity-40 ml-1">/100</span></p>
                                                    {report.trend?.score !== undefined && (
                                                        <span className={`text-[10px] font-black flex items-center ${report.trend.score >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {report.trend.score >= 0 ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                                                            {Math.abs(report.trend.score)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Rata-rata Reputasi</p>
                                                <div className="flex items-center gap-2 text-rose-600">
                                                    <Heart size={16} fill="currentColor" />
                                                    <p className="text-2xl font-black text-slate-800">{report.avgReputation}%</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Total Pasien</p>
                                                <p className="text-2xl font-black text-slate-800">{report.totalPatients?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Pendapatan Total</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-2xl font-black text-emerald-600">Rp {formatCurrency(report.totalRevenue)}</p>
                                                    {report.trend?.revenue !== undefined && (
                                                        <span className={`text-[10px] font-black ${report.trend.revenue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {report.trend.revenue >= 0 ? '+' : ''}{Math.round(report.trend.revenue / 1000000)}jt
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {report.staffSalaries > 0 && (
                                            <div className="px-6 py-3 bg-rose-50/30 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-rose-400" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beban Gaji Staff Terbayar:</span>
                                                </div>
                                                <span className="text-[11px] font-black text-rose-600">- Rp {formatCurrency(report.staffSalaries)}</span>
                                            </div>
                                        )}

                                        <div className="bg-indigo-50/50 p-6 flex items-center justify-between border-t border-indigo-100">
                                            <div className="flex items-center gap-3">
                                                <Award size={20} className="text-indigo-600" />
                                                <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Estimasi Bonus Kapitasi</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Pencapaian Reward</p>
                                                    <p className="text-lg font-black text-indigo-900">Rp {formatCurrency(report.avgScore * 50000)}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-300">
                                <Calendar size={64} className="opacity-20 mb-6" />
                                <div className="text-center space-y-2">
                                    <p className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Belum Ada Laporan Bulanan</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selesaikan {30 - ((day - 1) % 30)} hari lagi untuk laporan pertama</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Educational Wiki Modal */}
            <EducationalWikiModal
                isOpen={isWikiOpen}
                onClose={closeWiki}
                metricKey={wikiMetric}
                liveStats={useMemo(() => {
                    if (!wikiMetric) return null;
                    switch (wikiMetric) {
                        case 'accuracy':
                            return {
                                "Diagnosa Tepat": derivedKpis.clinicalAccuracy + "%",
                                "Total Pasien": kpi.totalPatients
                            };
                        case 'treatment':
                            return {
                                "Rasionalitas": derivedKpis.treatmentAppropriateRate + "%",
                                "Target": "90%"
                            };
                        case 'antibiotics':
                            return {
                                "Rasio Bijak": derivedKpis.antibioticStewardship + "%",
                                "Status": derivedKpis.antibioticStewardship < 80 ? "Over-prescribe" : "Normal"
                            };
                        case 'rrns':
                            return {
                                "Rasio RRNS": derivedKpis.rrns + "%",
                                "Target": "< 2%"
                            };
                        default:
                            return null;
                    }
                }, [wikiMetric, derivedKpis, kpi])}
            />
        </div>
    );
}
