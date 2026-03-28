/**
 * @reflection
 * [IDENTITY]: PhysicalExamTab
 * [PURPOSE]: React UI component: PhysicalExamTab — Gamified, interactive body targeting and telemetry dashboard.
 * [STATE]: Polished & Immersive UI (Sci-Fi HUD)
 * [ANCHOR]: PhysicalExamTab
 * [DEPENDS_ON]: ProceduresDB, physicalExam utils, framer-motion
 * [LAST_UPDATE]: 2026-03-28
 */

import React, { memo, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, AlertTriangle, BookOpen, BrainCircuit, CheckCircle2,
    ChevronDown, Cpu, Crosshair, HeartPulse, ScanEye,
    ShieldAlert, Sparkles, RefreshCw, Target, Fingerprint, Radar
} from 'lucide-react';
import { PHYSICAL_EXAM_OPTIONS } from '../../data/ProceduresDB.js';
import { getPhysicalExamDisplayName, normalizePhysicalExamFindings, normalizePhysicalExamKey } from '../../utils/physicalExam.js';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & UTILS
// ═══════════════════════════════════════════════════════════════
const ABNORMAL_WORDS = [
    'nyeri', 'bengkak', 'abnormal', 'lesi', 'massa', 'krepitasi', 'ronkhi', 'wheezing', 'pucat', 
    'kemerahan', 'luka', 'fraktur', 'takikardi', 'deformitas', 'kaku', 'sesak', 'sianosis', 
    'menurun', 'murmur', 'gallop', 'edema', 'retraksi', 'defans', 'rigiditas', 'darah', 'jejas', 
    'perdarahan', 'henti', 'koma', 'apnea', 'asam', 'distensi', 'ikterik', 'lemah', 'defisit', 
    'parese', 'kejang',
];

const BODY_IMAGES = {
    MALE: { front: '/body-male-front.png', back: '/body-male-back.png' },
    FEMALE: { front: '/body-female-front.png', back: '/body-female-back.png' },
    CHILD: { front: '/body-child-front.png', back: '/body-child-back.png' },
    INFANT: { front: '/body-infant-front.png', back: '/body-infant-back.png' },
};

const BODY_MARKERS = {
    general: { side: 'front', x: 50, y: 7 },
    vitals: { side: 'front', x: 22, y: 27 },
    heent: { side: 'front', x: 50, y: 13 },
    neck: { side: 'front', x: 50, y: 20 },
    thorax: { side: 'front', x: 50, y: 31 },
    breast: { side: 'front', x: 75, y: 30 },
    abdomen: { side: 'front', x: 50, y: 48 },
    genitalia: { side: 'front', x: 50, y: 62 },
    rectal: { side: 'back', x: 50, y: 63 },
    skin: { side: 'back', x: 28, y: 47 },
    neuro: { side: 'back', x: 50, y: 29 },
    extremities: { side: 'front', x: 36, y: 84 },
};

const EXAM_SYSTEM_GROUPS = [
    { id: 'general_assessment', label: 'Penilaian Umum', icon: ScanEye, exams: ['general', 'vitals'] },
    { id: 'head_neck', label: 'Kepala & Leher', icon: BrainCircuit, exams: ['heent', 'neck'] },
    { id: 'thorax_cardio', label: 'Thorax & Kardio', icon: HeartPulse, exams: ['thorax', 'breast'] },
    { id: 'abdominal_pelvic', label: 'Abdomen & Pelvis', icon: ShieldAlert, exams: ['abdomen', 'genitalia', 'rectal'] },
    { id: 'extremities_skin', label: 'Ekstremitas & Kulit', icon: Crosshair, exams: ['extremities', 'skin', 'neuro'] },
];

function analyzeSeverity(text) {
    if (!text) return 'unexamined';
    const normalized = String(text).toLowerCase();
    return ABNORMAL_WORDS.some((word) => normalized.includes(word)) ? 'abnormal' : 'normal';
}

function generateMedHash(examKey, finding = '') {
    let hash = 0;
    const source = `${examKey}:${finding}`;
    for (let i = 0; i < source.length; i++) { hash = ((hash << 5) - hash) + source.charCodeAt(i); hash |= 0; }
    return `DX-${Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}`;
}

function getBodyProfile(patient) {
    const age = patient?.age || 25;
    const gender = String(patient?.gender || '').toLowerCase();
    const isFemale = gender.match(/p|f|female|perempuan|wanita/);
    if (age <= 3) return BODY_IMAGES.INFANT;
    if (age <= 12) return BODY_IMAGES.CHILD;
    if (isFemale) return BODY_IMAGES.FEMALE;
    return BODY_IMAGES.MALE;
}

// ═══════════════════════════════════════════════════════════════
// TELEMETRY LOG ENTRY (Terminal Style)
// ═══════════════════════════════════════════════════════════════
const FindingCard = memo(function FindingCard({ examKey, finding, isDark }) {
    const severity = analyzeSeverity(finding);
    const examLabel = getPhysicalExamDisplayName(examKey);
    const hash = generateMedHash(examKey, finding);
    const isAbnormal = severity === 'abnormal';

    return (
        <motion.article
            initial={{ opacity: 0, x: -20, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, height: 'auto', scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative overflow-hidden rounded-xl border p-3.5 transition-all shadow-sm
                ${isAbnormal 
                    ? (isDark ? 'border-rose-500/40 bg-rose-950/40' : 'border-rose-300 bg-rose-50') 
                    : (isDark ? 'border-emerald-500/20 bg-slate-900/60' : 'border-emerald-200 bg-white')}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isAbnormal ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-emerald-500'}`} />

            <div className="flex items-start justify-between gap-3 pl-1">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isAbnormal ? (isDark ? 'bg-rose-500/20 text-rose-500' : 'bg-rose-200 text-rose-600') : (isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600')}`}>
                        {isAbnormal ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div>
                        <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{examLabel}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Fingerprint size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            <span className={`font-mono text-[9px] uppercase tracking-widest font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{hash}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border
                    ${isAbnormal 
                        ? (isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-200') 
                        : (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}`}>
                    {isAbnormal ? 'Abnormal' : 'Nominal'}
                </span>
            </div>
            <p className={`mt-3 text-xs leading-relaxed pl-12 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {">"} {finding}
            </p>
        </motion.article>
    );
});

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PhysicalExamTab({
    patient, isDark, handleExam, examsPerformed, examResultsRef, openWiki, maiaSuggestions = [], anamnesisScore,
}) {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const [openGroups, setOpenGroups] = useState(() => new Set(isDesktop ? EXAM_SYSTEM_GROUPS.map(g => g.id) : [EXAM_SYSTEM_GROUPS[0].id]));
    const [bodyView, setBodyView] = useState('front');

    const normalizedFindings = useMemo(() => {
        if (Array.isArray(examsPerformed)) return normalizePhysicalExamFindings(Object.fromEntries(examsPerformed.map((examKey) => [normalizePhysicalExamKey(examKey), 'Sudah diperiksa'])));
        return normalizePhysicalExamFindings(examsPerformed || {});
    }, [examsPerformed]);

    const findingEntries = useMemo(() => Object.entries(normalizedFindings).filter(([, finding]) => Boolean(finding)), [normalizedFindings]);
    const bodyProfile = useMemo(() => getBodyProfile(patient), [patient]);
    
    const suggestionItems = useMemo(() => (maiaSuggestions || []).map((s) => ({ ...s, key: normalizePhysicalExamKey(s.id) })).filter((s) => s.key), [maiaSuggestions]);
    const suggestedKeys = useMemo(() => suggestionItems.map(s => s.key), [suggestionItems]);

    const completedCount = findingEntries.length;
    const totalCount = Object.keys(PHYSICAL_EXAM_OPTIONS).length;
    const completionPct = Math.round((completedCount / totalCount) * 100);

    // Auto-scroll telemetry log to the latest finding
    useEffect(() => {
        if (!examResultsRef?.current || findingEntries.length === 0) return;
        examResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [findingEntries.length, examResultsRef]);

    const toggleGroup = (groupId) => {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) next.delete(groupId); else next.add(groupId);
            return next;
        });
    };

    // 🌟 INTERACTIVE RADAR MARKERS 🌟
    const renderMarker = (examKey, side) => {
        const marker = BODY_MARKERS[examKey];
        if (!marker || marker.side !== side) return null;

        const finding = normalizedFindings[examKey];
        const isDone = Boolean(finding);
        const severity = analyzeSeverity(finding);
        const isSuggested = suggestedKeys.includes(examKey) && !isDone;
        
        let markerClass = '';
        if (!isDone) markerClass = isSuggested ? 'bg-cyan-400 border-cyan-200' : 'bg-slate-400 border-white';
        else if (severity === 'abnormal') markerClass = 'bg-rose-500 border-white shadow-[0_0_15px_rgba(244,63,94,1)] scale-110 z-10';
        else markerClass = 'bg-emerald-500 border-white shadow-[0_0_10px_rgba(16,185,129,0.8)] opacity-80';

        return (
            <button
                key={examKey} onClick={() => {
                    const group = EXAM_SYSTEM_GROUPS.find(g => g.exams.includes(examKey));
                    if (group) setOpenGroups(prev => new Set(prev).add(group.id));
                    handleExam(examKey);
                }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 p-2 outline-none cursor-crosshair`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
                <div className={`h-4 w-4 rounded-full border-[2.5px] transition-transform duration-200 group-hover:scale-150 group-active:scale-90 flex items-center justify-center ${markerClass}`}>
                    {(!isDone && isSuggested) && <div className="absolute w-full h-full rounded-full border-2 border-cyan-400 animate-ping" />}
                </div>
                <div className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest z-20 ${isDark ? 'bg-cyan-900 text-cyan-100 border border-cyan-500/30' : 'bg-slate-800 text-white shadow-lg'}`}>
                    [{getPhysicalExamDisplayName(examKey)}]
                </div>
            </button>
        );
    };

    // 🌟 SMART EXAM BUTTONS 🌟
    const renderExamButton = (examKey) => {
        const finding = normalizedFindings[examKey];
        const severity = analyzeSeverity(finding);
        const isDone = Boolean(finding);
        const isSuggested = suggestedKeys.includes(examKey) && !isDone;
        const label = getPhysicalExamDisplayName(examKey);

        let btnClass = isDark ? 'border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-500' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-cyan-300';
        if (isDone) {
            btnClass = severity === 'abnormal' 
                ? (isDark ? 'border-rose-500/40 bg-rose-500/10' : 'border-rose-300 bg-rose-50')
                : (isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50');
        } else if (isSuggested) {
            btnClass = isDark ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-cyan-500/20' : 'border-cyan-400 bg-cyan-50 shadow-sm hover:bg-cyan-100';
        }

        return (
            <motion.button
                key={examKey} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => handleExam(examKey)}
                className={`group relative w-full rounded-xl border p-3 text-left transition-all overflow-hidden ${btnClass}`}
            >
                {!isDone && <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />}

                <div className="flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="shrink-0">
                            {isDone ? (severity === 'abnormal' ? <AlertTriangle size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />) 
                                    : <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] ${isSuggested ? 'border-cyan-400 animate-pulse' : (isDark ? 'border-slate-600' : 'border-slate-300')}`} />}
                        </div>
                        <div>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{label}</p>
                            {!isDone && <p className={`text-[9px] uppercase tracking-wider font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Status: Pending</p>}
                        </div>
                    </div>

                    {isDone ? (
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${severity === 'abnormal' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                            {severity === 'abnormal' ? 'Deteksi' : 'Normal'}
                        </span>
                    ) : isSuggested ? (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/30">
                            <Target size={10} className="animate-spin-slow" /> Target
                        </span>
                    ) : null}
                </div>
            </motion.button>
        );
    };

    return (
        <div className="flex h-full flex-col gap-4 overflow-hidden">
            
            <style>{`
                @keyframes scan-line { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                .thin-scrollbar::-webkit-scrollbar { width: 4px; }
                .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .thin-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .dark .thin-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>

            {/* █ 1. BENTO BOX HUD HEADER █ */}
            <section className={`shrink-0 rounded-2xl border p-4 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-cyan-200'}`}>
                {isDark && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(#06b6d4_1px,transparent_1px),linear-gradient(90deg(#06b6d4_1px,transparent_1px)] bg-[size:20px_20px]" />}
                
                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Radar size={18} className="text-cyan-500 animate-[spin_4s_linear_infinite]" />
                        <h2 className={`font-black uppercase tracking-widest text-xs md:text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Sistem Pindai Medis</h2>
                    </div>
                    
                    {/* MAIA Targets Priority */}
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Prioritas MAIA:</span>
                        {suggestionItems.length > 0 ? suggestionItems.map(s => (
                            <button key={s.id} onClick={() => {
                                const targetGroup = EXAM_SYSTEM_GROUPS.find(g => g.exams.includes(s.key));
                                if (targetGroup) setOpenGroups(prev => new Set(prev).add(targetGroup.id));
                                handleExam(s.key);
                            }} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${isDark ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'border-cyan-300 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'}`}>
                                <Crosshair size={12} className="animate-pulse" /> {s.label}
                            </button>
                        )) : <span className="text-[10px] font-mono italic opacity-70">Standby. Pola bebas.</span>}
                    </div>
                </div>
                
                <div className="flex gap-2 shrink-0 relative z-10">
                    <div className={`flex flex-col justify-center items-center w-24 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-xl font-black font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{completionPct}%</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Coverage</span>
                    </div>
                    <div className={`flex flex-col justify-center items-center w-24 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-xl font-black font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{Math.round(anamnesisScore || 0)}%</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Anamnesis</span>
                    </div>
                    <button onClick={() => openWiki?.('accuracy')} className={`flex items-center justify-center w-12 rounded-xl border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300' : 'bg-white border-slate-200 text-cyan-600 hover:bg-cyan-50'}`} title="Buku Panduan">
                        <BookOpen size={16} />
                    </button>
                </div>
            </section>

            {/* █ 2. BIONIC LAYOUT: 3 COLUMNS █ */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 pb-4 lg:pb-0">
                
                {/* COLUMN A: Holographic Body Tracker */}
                <div className={`lg:col-span-3 flex flex-col rounded-2xl border relative overflow-hidden shadow-sm h-[320px] lg:h-auto ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className={`absolute top-0 inset-x-0 p-3 flex justify-between items-center z-20 border-b ${isDark ? 'bg-slate-900/80 border-slate-800 backdrop-blur-sm' : 'bg-white/90 border-slate-200 backdrop-blur-sm'}`}>
                        <div className="flex items-center gap-1.5">
                            <ScanEye size={14} className={isDark ? "text-cyan-400" : "text-cyan-600"} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Visual Target</span>
                        </div>
                        <button onClick={() => setBodyView(v => v === 'front' ? 'back' : 'front')} className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'}`}>
                            <RefreshCw size={10} /> {bodyView === 'front' ? 'Anterior' : 'Posterior'}
                        </button>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center p-6 pt-16">
                        {/* Scanning Laser Animation */}
                        {completedCount < totalCount && <div className="absolute left-0 right-0 h-10 bg-gradient-to-t from-cyan-500/30 to-transparent border-b-2 border-cyan-400/50 opacity-50 z-20 pointer-events-none" style={{ animation: 'scan-line 3s linear infinite' }} />}
                        
                        <div className="relative h-full w-full max-w-[180px]">
                            <img src={bodyView === 'front' ? bodyProfile.front : bodyProfile.back} alt="Tubuh" className={`h-full w-full object-contain relative z-10 drop-shadow-2xl transition-opacity duration-500 ${isDark ? 'opacity-60 sepia-[.3] hue-rotate-[180deg] saturate-[2]' : 'opacity-90'}`} />
                            <div className="absolute inset-0 z-20">
                                {Object.keys(BODY_MARKERS).map((examKey) => renderMarker(examKey, bodyView))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN B: System Modules (Command Deck) */}
                <div className={`lg:col-span-5 flex flex-col rounded-2xl border shadow-sm min-h-0 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className={`p-3 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
                        <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Diagnostic Modules</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto thin-scrollbar p-3 space-y-2.5">
                        {EXAM_SYSTEM_GROUPS.map((group) => {
                            const Icon = group.icon;
                            const groupDone = group.exams.filter(k => Boolean(normalizedFindings[k])).length;
                            const total = group.exams.length;
                            const progress = (groupDone / total) * 100;
                            const isOpen = openGroups.has(group.id);
                            
                            // 🌟 SMART DIMMING: Meredup otomatis jika sistem sudah lengkap dan semua normal
                            const hasAbnormal = group.exams.some(k => analyzeSeverity(normalizedFindings[k]) === 'abnormal');
                            const isDimmed = groupDone === total && !hasAbnormal;

                            return (
                                <div key={group.id} className={`rounded-xl border overflow-hidden transition-all duration-300 ${isOpen ? (isDark ? 'border-indigo-500/30 bg-slate-900' : 'border-indigo-200 bg-white shadow-sm') : (isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50')} ${isDimmed && !isOpen ? 'opacity-60 grayscale-[30%]' : ''}`}>
                                    <button onClick={() => toggleGroup(group.id)} className="w-full flex items-center justify-between p-3 outline-none group">
                                        <div className="flex items-center gap-3 w-full pr-4">
                                            <div className={`p-2 rounded-lg transition-colors ${groupDone === total ? (hasAbnormal ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500') : (isDark ? 'bg-slate-800 text-slate-400 group-hover:text-indigo-400' : 'bg-white border border-slate-200 text-slate-500 group-hover:text-indigo-600')}`}>
                                                {groupDone === total ? (hasAbnormal ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />) : <Icon size={16} />}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{group.label}</span>
                                                    <span className={`text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{groupDone}/{total}</span>
                                                </div>
                                                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full ${groupDone === total ? (hasAbnormal ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-cyan-500'}`} />
                                                </div>
                                            </div>
                                        </div>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 200 }}>
                                            <ChevronDown size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className={`p-3 pt-0 grid gap-2 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                                                    <div className="h-1" />
                                                    {group.exams.map(key => renderExamButton(key))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN C: Telemetry Stream (Live Log) */}
                <div className={`lg:col-span-4 flex flex-col min-h-0 rounded-2xl border shadow-sm ${isDark ? 'border-slate-700 bg-[#0B1120]' : 'border-slate-200 bg-slate-50'}`}>
                    <div className={`p-3 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Telemetry Log</span>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            {findingEntries.length} RECORDS
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto thin-scrollbar p-3 relative">
                        {findingEntries.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <Activity size={32} className={`mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                                <span className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>SYSTEM STANDBY<br/>Awaiting scan inputs...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <AnimatePresence initial={false}>
                                    {findingEntries.map(([k, f]) => (
                                        <FindingCard key={k} examKey={k} finding={f} isDark={isDark} />
                                    ))}
                                </AnimatePresence>
                                <div ref={examResultsRef} className="h-2" />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
