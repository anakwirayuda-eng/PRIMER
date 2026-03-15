/**
 * @reflection
 * [IDENTITY]: PhysicalExamTab (Aegis Biometric Scanner × God-Tier Engine)
 * [PURPOSE]: Merged edition — Aegis visual skin (HUD reticles, scanning laser,
 *            forensic hex logs, radar idle) atop the original engine (memo(),
 *            severity NLP, actionable MAIA pills, normalization).
 * [STATE]: Production Ready
 * [ANCHOR]: PhysicalExamTab
 * [DEPENDS_ON]: ProceduresDB, WikiData, BodyMapWidget, physicalExam utils
 * [LAST_UPDATE]: 2026-03-15
 */

import React, { useMemo, useEffect, memo } from 'react';
import {
    Info, Sparkles, Activity, CheckCircle2, AlertCircle,
    Fingerprint, ChevronRight, Crosshair, Cpu, ScanFace
} from 'lucide-react';
import { PHYSICAL_EXAM_OPTIONS } from '../../data/ProceduresDB.js';
import { findWikiKey } from '../../data/WikiData.js';
import BodyMapWidget from '../BodyMapWidget.jsx';
import {
    getPhysicalExamDisplayName,
    normalizePhysicalExamFindings,
    normalizePhysicalExamKey,
} from '../../utils/physicalExam.js';

// ==========================================
// 🧠 CLINICAL NLP HEURISTIC ENGINE (PRESERVED)
// ==========================================
const analyzeSeverity = (text) => {
    if (!text) return 'neutral';
    const t = typeof text === 'string' ? text.toLowerCase() : String(text).toLowerCase();
    const abnormal = [
        'nyeri', 'bengkak', 'abnormal', 'lesi', 'massa', 'krepitasi',
        'ronkhi', 'wheezing', 'pucat', 'kemerahan', 'luka', 'fraktur',
        'takikardi', 'deformitas', 'kaku', 'edema', 'murmur', 'stridor',
        'ikterik', 'sianosis', 'retraksi', 'defans', 'rigiditas'
    ];
    const normal = [
        'normal', 'dbn', 'simetris', 'reguler', 'clear', 'tidak ada',
        'batas normal', 'sonor', 'vesikuler', 'utuh', 'baik', 'negatif',
        'supel', 'tenang', 'compos mentis', 'dalam batas'
    ];
    if (abnormal.some(w => t.includes(w))) return 'abnormal';
    if (normal.some(w => t.includes(w))) return 'normal';
    return 'neutral';
};

// Procedural hex code generator for forensic feel
const generateMedHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `0x${Math.abs(hash).toString(16).substring(0, 5).toUpperCase().padStart(5, '0')}`;
};

// ==========================================
// ⚡ MEMOIZED FINDING CARD — O(1) Re-render (PRESERVED)
// + Aegis visual: hex code, slide-in flash, SYS.VERIFIED
// ==========================================
const FindingCard = memo(({ examKey, finding, isDark, openWiki, index }) => {
    const wikiKey = useMemo(() => findWikiKey('prob', examKey), [examKey]);
    const examName = getPhysicalExamDisplayName(examKey) || PHYSICAL_EXAM_OPTIONS[examKey]?.name || examKey;
    const severity = analyzeSeverity(finding);
    const hexLog = generateMedHash(examKey);

    const theme = {
        normal: {
            bg: isDark ? 'bg-emerald-950/20 hover:bg-emerald-900/30' : 'bg-emerald-50/50 hover:bg-emerald-50',
            border: isDark ? 'border-emerald-900/50 hover:border-emerald-500/50' : 'border-emerald-100 hover:border-emerald-300',
            bar: 'bg-emerald-500',
            text: isDark ? 'text-emerald-400' : 'text-emerald-700',
            icon: <CheckCircle2 size={14} className={isDark ? 'text-emerald-500' : 'text-emerald-600'} />,
            stamp: isDark ? 'bg-emerald-950/50 border-emerald-900 text-emerald-500' : 'bg-emerald-50 border-emerald-200 text-emerald-600',
            cardAnim: 'pe-log-card',
        },
        abnormal: {
            bg: isDark ? 'bg-rose-950/20 hover:bg-rose-900/30' : 'bg-rose-50/50 hover:bg-rose-50',
            border: isDark ? 'border-rose-900/50 hover:border-rose-500/50' : 'border-rose-100 hover:border-rose-300',
            bar: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
            text: isDark ? 'text-rose-400' : 'text-rose-700',
            icon: <AlertCircle size={14} className={isDark ? 'text-rose-500' : 'text-rose-600'} />,
            stamp: isDark ? 'bg-rose-950/50 border-rose-900 text-rose-500' : 'bg-rose-50 border-rose-200 text-rose-600',
            cardAnim: 'pe-log-card-abnormal',
        },
        neutral: {
            bg: isDark ? 'bg-slate-900/40 hover:bg-slate-800/60' : 'bg-white hover:bg-slate-50',
            border: isDark ? 'border-slate-800/60 hover:border-blue-500/40' : 'border-slate-200 hover:border-blue-300',
            bar: 'bg-blue-500',
            text: isDark ? 'text-blue-400' : 'text-blue-700',
            icon: <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'} shadow-[0_0_8px_currentColor]`} />,
            stamp: isDark ? 'bg-blue-950/50 border-blue-900 text-blue-500' : 'bg-blue-50 border-blue-200 text-blue-600',
            cardAnim: 'pe-log-card',
        }
    }[severity];

    return (
        <div
            className={`${theme.cardAnim} group relative p-4 rounded-2xl border transition-all duration-300 transform hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden ${theme.bg} ${theme.border} hover:shadow-lg`}
            style={{ animationDelay: `${(index % 10) * 60}ms` }}
        >
            {/* Glowing Indicator Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-sm transition-all duration-300 ${theme.bar} opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_15px_currentColor]`} />

            {/* Header: hex code + name + stamp + wiki */}
            <div className="flex justify-between items-start mb-2.5 pl-3 pb-2 border-b border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Fingerprint size={8} className={isDark ? 'text-cyan-600' : 'text-slate-400'} />
                        <span className={`text-[7px] font-mono tracking-widest uppercase font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            LOG_ID: {hexLog}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {theme.icon}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>
                            {examName}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`text-[6px] font-black font-mono px-1.5 py-0.5 rounded border opacity-80 group-hover:opacity-100 transition-opacity ${theme.stamp}`}>
                        VERIFIED
                    </div>
                    {wikiKey && (
                        <button onClick={() => openWiki(wikiKey)} title="Referensi Medis"
                            className={`p-1.5 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-95 ${
                                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                            }`}>
                            <Info size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Finding text */}
            <p className={`text-[12px] leading-relaxed pl-3 font-medium transition-colors ${
                isDark ? 'text-slate-300 group-hover:text-slate-100' : 'text-slate-600 group-hover:text-slate-900'
            }`}>
                {finding}
            </p>
        </div>
    );
});
FindingCard.displayName = 'FindingCard';

// ==========================================
// 🏥 MAIN COMPONENT
// ==========================================
export default function PhysicalExamTab({ patient: _patient, isDark, handleExam, examsPerformed = {}, examResultsRef, openWiki, maiaSuggestions, anamnesisScore }) {
    const normalizedExamsPerformed = useMemo(() => normalizePhysicalExamFindings(examsPerformed), [examsPerformed]);
    const examEntries = useMemo(() => Object.entries(normalizedExamsPerformed), [normalizedExamsPerformed]);
    const examCount = examEntries.length;

    // Auto-scroll on new findings
    useEffect(() => {
        if (examCount > 0 && examResultsRef?.current) {
            setTimeout(() => {
                examResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    }, [examCount, examResultsRef]);

    return (
        <div className="flex flex-col h-full overflow-hidden relative">

            {/* ✨ MAIA NEURAL ASSIST BANNER — Aegis visual + preserved actionable pills */}
            {anamnesisScore >= 30 && (
                <div className={`shrink-0 mb-5 rounded-2xl border relative overflow-hidden transition-all shadow-lg ${
                    isDark
                        ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900/80 border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)]'
                        : 'bg-gradient-to-br from-indigo-50/80 to-white border-indigo-200 shadow-sm'
                }`}>
                    {/* Glowing left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" style={{ filter: 'drop-shadow(0 0 10px #6366F1)' }} />

                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 pl-6">
                        <div className="flex items-start md:items-center gap-4">
                            <div className={`p-2.5 rounded-xl flex-shrink-0 relative ${
                                isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                            }`}>
                                <Cpu size={18} style={{ animation: 'pe-ai-pulse 2s infinite' }} />
                                {maiaSuggestions?.length > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-indigo-400/80' : 'text-indigo-600/80'}`}>
                                        M.A.I.A · Neural Assist
                                    </h4>
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366F1]" />
                                </div>
                                <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {maiaSuggestions?.length > 0 ? 'Fokus prioritas pemindaian biometrik:' : 'Anamnesis solid. Lakukan pemeriksaan general.'}
                                </p>
                            </div>
                        </div>

                        {/* 🔥 ACTIONABLE PILLS — PRESERVED from original */}
                        {maiaSuggestions?.length > 0 && (
                            <div className="flex flex-wrap gap-2 relative z-10 md:ml-auto pl-14 md:pl-0">
                                {maiaSuggestions.map((suggestion, idx) => {
                                    const rawActionId = suggestion.id || suggestion.key || suggestion.value || null;
                                    const actionId = rawActionId ? normalizePhysicalExamKey(rawActionId) : null;
                                    return (
                                        <button key={idx} onClick={() => actionId && handleExam(actionId)}
                                            className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:-translate-y-0.5 active:scale-95 ${
                                                isDark
                                                    ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 hover:text-indigo-200 border border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 shadow-sm hover:shadow-md'
                                            }`}>
                                            <Fingerprint size={12} className="opacity-70" />
                                            {suggestion.label || suggestion.name || actionId}
                                            <ChevronRight size={12} className="opacity-50" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Two-column layout: Scanner Bay (5) + Forensic Logs (7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">

                {/* 📌 LEFT: SCANNER BAY */}
                <div className="lg:col-span-5 flex flex-col gap-3 min-h-0 relative">
                    <div className="flex items-center justify-between px-1 shrink-0">
                        <div className="flex items-center gap-2">
                            <Crosshair size={14} className={isDark ? 'text-emerald-500' : 'text-emerald-600'} />
                            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                                Scanner Bay
                            </h4>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded text-[8px] font-bold tracking-widest uppercase border ${
                            isDark ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sensor Aktif
                        </div>
                    </div>

                    {/* HUD Bay Wrapper */}
                    <div className={`pe-scanner-bay flex-1 overflow-hidden relative p-2 rounded-2xl transition-all duration-500 border ${
                        isDark ? 'bg-[#020617] border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]' : 'bg-slate-50 border-slate-300 shadow-inner'
                    }`}>
                        {/* HUD Reticle Corners */}
                        <div className={`pe-hud-corner pe-hud-tl ${isDark ? 'border-emerald-500/50' : 'border-slate-400'}`} />
                        <div className={`pe-hud-corner pe-hud-tr ${isDark ? 'border-emerald-500/50' : 'border-slate-400'}`} />
                        <div className={`pe-hud-corner pe-hud-bl ${isDark ? 'border-emerald-500/50' : 'border-slate-400'}`} />
                        <div className={`pe-hud-corner pe-hud-br ${isDark ? 'border-emerald-500/50' : 'border-slate-400'}`} />

                        {/* Blueprint Grid */}
                        <div className={`absolute inset-0 ${isDark ? 'pe-grid-dark' : 'pe-grid-light'} opacity-60 pointer-events-none z-0`} />

                        {/* Scanning Laser (dark mode only) */}
                        {isDark && (
                            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-emerald-500/15 border-b border-emerald-400/30 pointer-events-none z-20 mix-blend-screen"
                                style={{ animation: 'pe-scanline 3s linear infinite' }} />
                        )}

                        <div className="relative z-10 w-full h-full">
                            <BodyMapWidget isDark={isDark} patient={_patient} onExam={handleExam} examsPerformed={normalizedExamsPerformed} />
                        </div>

                        {/* Telemetry overlay */}
                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end pointer-events-none z-30">
                            <div className="font-mono text-[7px] uppercase tracking-[0.15em] opacity-50">
                                <div className={isDark ? 'text-emerald-400' : 'text-slate-500'}>BIO_SYNC: STABLE</div>
                                <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>MAP_V2.14</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📌 RIGHT: TELEMETRY LOGS */}
                <div className="lg:col-span-7 flex flex-col gap-3 min-h-0 relative">
                    <div className={`flex items-center justify-between px-1 pb-2 border-b border-dashed shrink-0 ${isDark ? 'border-slate-700/30' : 'border-slate-300'}`}>
                        <div className="flex items-center gap-2">
                            <Activity size={14} className={isDark ? 'text-cyan-400' : 'text-blue-600'} />
                            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-cyan-400' : 'text-blue-800'}`}>
                                Telemetry Logs
                            </h4>
                        </div>
                        <div className={`px-2 py-1 rounded-md font-mono font-black tracking-widest text-[9px] border ${
                            examCount > 0
                                ? (isDark ? 'bg-cyan-950/40 text-cyan-400 border-cyan-900/50' : 'bg-blue-100 text-blue-700 border-blue-200')
                                : (isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-200 border-slate-300 text-slate-500')
                        }`}>
                            {examCount.toString().padStart(2, '0')} Entries
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-10 pt-2 pe-thin-scrollbar scroll-smooth">
                        {examCount > 0 ? (
                            examEntries.map(([key, finding], index) => (
                                <FindingCard
                                    key={key}
                                    examKey={key}
                                    finding={finding}
                                    isDark={isDark}
                                    openWiki={openWiki}
                                    index={index}
                                />
                            ))
                        ) : (
                            /* RADAR IDLE STATE — Aegis "Awaiting Sensor Input" */
                            <div className={`h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border-2 border-dashed transition-all ${
                                isDark ? 'border-slate-800/60 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'
                            }`}>
                                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                                    {/* Sonar Rings */}
                                    <div className={`absolute inset-0 rounded-full border-2 border-dashed ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
                                        style={{ animation: 'pe-radar-spin 10s linear infinite' }} />
                                    <div className={`absolute inset-3 rounded-full border ${isDark ? 'border-cyan-900/50' : 'border-blue-200'}`}
                                        style={{ animation: 'pe-radar-spin 5s linear infinite reverse' }} />
                                    {/* Ping pulse */}
                                    <div className={`absolute w-4 h-4 rounded-full animate-ping ${isDark ? 'bg-cyan-500/50' : 'bg-blue-400/50'}`}
                                        style={{ animationDuration: '2s' }} />
                                    <ScanFace size={32} className={isDark ? 'text-cyan-600' : 'text-slate-400'} />
                                </div>
                                <h3 className={`font-mono text-xs font-black uppercase tracking-[0.3em] mb-2 ${isDark ? 'text-cyan-500' : 'text-slate-500'}`}>
                                    [ Awaiting Sensor Input ]
                                </h3>
                                <p className={`text-[10px] font-medium max-w-[220px] leading-relaxed uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Arahkan pemindai pada area tubuh pasien di Scanner Bay untuk mengekstrak data.
                                </p>
                            </div>
                        )}
                        <div ref={examResultsRef} className="h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
