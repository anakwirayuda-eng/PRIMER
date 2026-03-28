/**
 * @reflection
 * [IDENTITY]: PhysicalExamTab
 * [PURPOSE]: React UI component: PhysicalExamTab — System-grouped accordion with passive body reference.
 * [STATE]: Production
 * [ANCHOR]: PhysicalExamTab
 * [DEPENDS_ON]: ProceduresDB, physicalExam utils
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-28
 */

import React, { memo, useEffect, useMemo, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Cpu,
    Crosshair,
    HeartPulse,
    ScanEye,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';
import { PHYSICAL_EXAM_OPTIONS } from '../../data/ProceduresDB.js';
import {
    getPhysicalExamDisplayName,
    normalizePhysicalExamFindings,
    normalizePhysicalExamKey,
} from '../../utils/physicalExam.js';

const ABNORMAL_WORDS = [
    'nyeri', 'bengkak', 'abnormal', 'lesi', 'massa', 'krepitasi',
    'ronkhi', 'wheezing', 'pucat', 'kemerahan', 'luka', 'fraktur',
    'takikardi', 'deformitas', 'kaku', 'sesak', 'sianosis', 'menurun',
    'murmur', 'gallop', 'edema', 'retraksi', 'defans', 'rigiditas',
    'darah', 'jejas', 'perdarahan', 'henti', 'koma', 'apnea', 'asam',
    'distensi', 'ikterik', 'lemah', 'defisit', 'parese', 'kejang',
];

const BODY_IMAGES = {
    MALE: { front: '/body-male-front.png', back: '/body-male-back.png' },
    FEMALE: { front: '/body-female-front.png', back: '/body-female-back.png' },
    CHILD: { front: '/body-child-front.png', back: '/body-child-back.png' },
    INFANT: { front: '/body-infant-front.png', back: '/body-infant-back.png' },
};

const BODY_MARKERS = {
    general: { side: 'front', x: 50, y: 7 },
    vitals: { side: 'front', x: 18, y: 27 },
    heent: { side: 'front', x: 50, y: 13 },
    neck: { side: 'front', x: 50, y: 20 },
    thorax: { side: 'front', x: 50, y: 31 },
    breast: { side: 'front', x: 79, y: 30 },
    abdomen: { side: 'front', x: 50, y: 48 },
    genitalia: { side: 'front', x: 50, y: 62 },
    rectal: { side: 'back', x: 50, y: 63 },
    skin: { side: 'back', x: 31, y: 47 },
    neuro: { side: 'back', x: 50, y: 29 },
    extremities: { side: 'front', x: 36, y: 84 },
};

const EXAM_SYSTEM_GROUPS = [
    {
        id: 'general_assessment',
        label: 'Penilaian Umum',
        icon: ScanEye,
        exams: ['general', 'vitals'],
    },
    {
        id: 'head_neck',
        label: 'Kepala & Leher',
        icon: BrainCircuit,
        exams: ['heent', 'neck'],
    },
    {
        id: 'thorax_cardio',
        label: 'Thorax & Kardiovaskular',
        icon: HeartPulse,
        exams: ['thorax', 'breast'],
    },
    {
        id: 'abdominal_pelvic',
        label: 'Abdomen & Pelvis',
        icon: ShieldAlert,
        exams: ['abdomen', 'genitalia', 'rectal'],
    },
    {
        id: 'extremities_skin',
        label: 'Ekstremitas & Kulit',
        icon: Crosshair,
        exams: ['extremities', 'skin', 'neuro'],
    },
];

function analyzeSeverity(text) {
    if (!text) return 'unexamined';
    const normalized = String(text).toLowerCase();
    return ABNORMAL_WORDS.some((word) => normalized.includes(word)) ? 'abnormal' : 'normal';
}

function generateMedHash(examKey, finding = '') {
    const source = `${examKey}:${finding}`;
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) {
        hash = ((hash << 5) - hash) + source.charCodeAt(i);
        hash |= 0;
    }
    return `EX-${Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6)}`;
}

function getBodyProfile(patient) {
    const age = patient?.age || 25;
    const gender = String(patient?.gender || '').toLowerCase();
    const isFemale = gender === 'p' || gender === 'f' || gender.includes('female') || gender.includes('perempuan') || gender.includes('wanita');

    if (age <= 3) return BODY_IMAGES.INFANT;
    if (age <= 12) return BODY_IMAGES.CHILD;
    if (isFemale) return BODY_IMAGES.FEMALE;
    return BODY_IMAGES.MALE;
}

const FindingCard = memo(function FindingCard({ examKey, finding, isDark }) {
    const severity = analyzeSeverity(finding);
    const examLabel = getPhysicalExamDisplayName(examKey);
    const hash = generateMedHash(examKey, finding);

    return (
        <article
            className={`rounded-2xl border p-3 md:p-4 transition-colors ${
                severity === 'abnormal'
                    ? (isDark ? 'border-rose-500/30 bg-rose-500/10' : 'border-rose-200 bg-rose-50')
                    : (isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/70')
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {severity === 'abnormal' ? (
                            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                        ) : (
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        )}
                        <div className="min-w-0">
                            <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {examLabel}
                            </h4>
                            <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                {hash}
                            </p>
                        </div>
                    </div>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                        severity === 'abnormal'
                            ? 'bg-rose-500/15 text-rose-500'
                            : 'bg-emerald-500/15 text-emerald-500'
                    }`}
                >
                    {severity === 'abnormal' ? 'Abnormal' : 'Normal'}
                </span>
            </div>

            <p className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {finding}
            </p>
        </article>
    );
});

export default function PhysicalExamTab({
    patient,
    isDark,
    handleExam,
    examsPerformed,
    examResultsRef,
    openWiki,
    maiaSuggestions = [],
    anamnesisScore,
}) {
    const [openGroups, setOpenGroups] = useState(() => {
        // Mobile: start with only first group open to reduce scroll. Desktop: all open.
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        return new Set(isMobile ? [EXAM_SYSTEM_GROUPS[0].id] : EXAM_SYSTEM_GROUPS.map((g) => g.id));
    });

    const normalizedFindings = useMemo(() => {
        if (Array.isArray(examsPerformed)) {
            return normalizePhysicalExamFindings(
                Object.fromEntries(examsPerformed.map((examKey) => [normalizePhysicalExamKey(examKey), 'Sudah diperiksa']))
            );
        }
        return normalizePhysicalExamFindings(examsPerformed || {});
    }, [examsPerformed]);

    const findingEntries = useMemo(() => (
        Object.entries(normalizedFindings).filter(([, finding]) => Boolean(finding))
    ), [normalizedFindings]);

    const bodyProfile = useMemo(() => getBodyProfile(patient), [patient]);

    useEffect(() => {
        if (!examResultsRef?.current || findingEntries.length === 0) return;
        examResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [findingEntries.length, examResultsRef]);

    const suggestionItems = useMemo(() => (
        (maiaSuggestions || []).map((suggestion) => ({
            ...suggestion,
            key: normalizePhysicalExamKey(suggestion.id),
        })).filter((suggestion) => suggestion.key)
    ), [maiaSuggestions]);

    const completedCount = findingEntries.length;
    const totalCount = Object.keys(PHYSICAL_EXAM_OPTIONS).length;
    const completionPct = Math.round((completedCount / totalCount) * 100);

    function toggleGroup(groupId) {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) next.delete(groupId);
            else next.add(groupId);
            return next;
        });
    }

    function renderMarker(examKey, side) {
        const marker = BODY_MARKERS[examKey];
        if (!marker || marker.side !== side) return null;

        const finding = normalizedFindings[examKey];
        const severity = analyzeSeverity(finding);
        const markerColor = finding
            ? (severity === 'abnormal' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]')
            : (isDark ? 'bg-slate-600' : 'bg-slate-300');

        return (
            <div
                key={`${examKey}-${side}`}
                className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 ${markerColor}`}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                title={getPhysicalExamDisplayName(examKey)}
            />
        );
    }

    function renderExamButton(examKey) {
        const finding = normalizedFindings[examKey];
        const severity = analyzeSeverity(finding);
        const isDone = Boolean(finding);
        const examOption = PHYSICAL_EXAM_OPTIONS[examKey];
        const label = getPhysicalExamDisplayName(examKey);
        const accentClass = !isDone
            ? (isDark ? 'border-slate-700 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900' : 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/50')
            : severity === 'abnormal'
                ? (isDark ? 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50' : 'border-rose-200 bg-rose-50 hover:border-rose-300')
                : (isDark ? 'border-emerald-500/25 bg-emerald-500/10 hover:border-emerald-500/45' : 'border-emerald-200 bg-emerald-50 hover:border-emerald-300');

        return (
            <button
                key={examKey}
                onClick={() => handleExam(examKey)}
                className={`min-h-[48px] w-full rounded-2xl border p-3 text-left transition-all active:scale-[0.99] ${accentClass}`}
            >
                <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                        {!isDone ? (
                            <div className={`h-3 w-3 rounded-full border-2 ${isDark ? 'border-cyan-500/70' : 'border-cyan-500'}`} />
                        ) : severity === 'abnormal' ? (
                            <AlertTriangle size={16} className="text-rose-500" />
                        ) : (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {label}
                                </p>
                                <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Estimasi {examOption?.time || 1} menit
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                                    !isDone
                                        ? (isDark ? 'bg-cyan-500/10 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                                        : severity === 'abnormal'
                                            ? 'bg-rose-500/15 text-rose-500'
                                            : 'bg-emerald-500/15 text-emerald-500'
                                }`}
                            >
                                {!isDone ? 'Periksa' : severity === 'abnormal' ? 'Abnormal' : 'Normal'}
                            </span>
                        </div>

                        <p className={`mt-2 line-clamp-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} ${!isDone ? 'opacity-80' : ''}`}>
                            {isDone ? finding : 'Belum diperiksa. Ketuk untuk memulai pemeriksaan sistem ini.'}
                        </p>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <section
                className={`rounded-3xl border p-4 md:p-5 ${
                    isDark
                        ? 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950'
                        : 'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-slate-50'
                }`}
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-cyan-500" />
                            <span className={`text-[10px] font-black uppercase tracking-[0.24em] ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                MAIA Neural Assist
                            </span>
                        </div>
                        <h3 className={`mt-2 text-lg font-black md:text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Clinical System Scanner
                        </h3>
                        <p className={`mt-1 max-w-3xl text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Periksa pasien berdasarkan kelompok sistem organ. Pilih pemeriksaan yang sesuai dengan keluhan utama.
                        </p>
                    </div>

                    <div className="grid min-w-[240px] grid-cols-3 gap-2 md:min-w-[280px]">
                        <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/80'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Anamnesis
                            </p>
                            <p className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {Math.round(anamnesisScore || 0)}%
                            </p>
                        </div>
                        <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/80'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Progress
                            </p>
                            <p className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {completedCount}/{totalCount}
                            </p>
                        </div>
                        <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/80'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Coverage
                            </p>
                            <p className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {completionPct}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                        {suggestionItems.length > 0 ? suggestionItems.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleExam(suggestion.key)}
                                className={`min-h-[44px] rounded-full border px-3 py-2 text-left text-xs font-bold transition-all active:scale-[0.99] ${
                                    isDark
                                        ? 'border-cyan-500/25 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/15'
                                        : 'border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                                }`}
                            >
                                <span className="block text-[10px] uppercase tracking-wider opacity-70">
                                    Prioritas MAIA
                                </span>
                                <span>{suggestion.label}</span>
                            </button>
                        )) : (
                            <div className={`rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
                                MAIA belum melihat kebutuhan prioritas tambahan. Lanjutkan sistem yang paling relevan dengan keluhan.
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => openWiki?.('accuracy')}
                        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition-colors ${
                            isDark
                                ? 'border-cyan-500/25 bg-slate-900/70 text-cyan-200 hover:bg-slate-900'
                                : 'border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-50'
                        }`}
                    >
                        <BookOpen size={15} />
                        Buka Panduan MAIA
                    </button>
                </div>
            </section>

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="hidden xl:flex xl:min-h-0 xl:flex-col">
                    <div className={`h-full rounded-3xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                Referensi Visual
                                </p>
                                <h4 className={`mt-1 text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Area Pemeriksaan
                                </h4>
                            </div>
                            <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-slate-800 text-cyan-300' : 'bg-cyan-50 text-cyan-700'}`}>
                                Baca Saja
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4">
                            {[
                                { side: 'front', label: 'Anterior', src: bodyProfile.front },
                                { side: 'back', label: 'Posterior', src: bodyProfile.back },
                            ].map((view) => (
                                <div
                                    key={view.side}
                                    className={`rounded-2xl border p-3 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {view.label}
                                        </span>
                                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            Titik hijau = normal, merah = temuan
                                        </span>
                                    </div>

                                    <div className={`relative overflow-hidden rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
                                        <img
                                            src={view.src}
                                            alt={`Referensi tubuh ${view.label.toLowerCase()}`}
                                            className="h-[260px] w-full object-contain"
                                        />
                                        {Object.keys(BODY_MARKERS).map((examKey) => renderMarker(examKey, view.side))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="flex min-h-0 flex-col gap-4">
                    <div className={`min-h-0 rounded-3xl border ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                        <div className={`border-b px-4 py-3 md:px-5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2">
                                <Cpu size={16} className="text-cyan-500" />
                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                    Kelompok Sistem
                                </h4>
                            </div>
                            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Pilih pemeriksaan berdasarkan sistem organ. Target sentuh sudah dioptimalkan untuk layar sentuh.
                            </p>
                        </div>

                        <div className="max-h-[52vh] overflow-y-auto p-3 md:p-4 thin-scrollbar">
                            <div className="space-y-3">
                                {EXAM_SYSTEM_GROUPS.map((group) => {
                                    const Icon = group.icon;
                                    const groupDone = group.exams.filter((examKey) => Boolean(normalizedFindings[examKey])).length;
                                    const isOpen = openGroups.has(group.id);

                                    return (
                                        <section
                                            key={group.id}
                                            className={`overflow-hidden rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-950/50' : 'border-slate-200 bg-slate-50/70'}`}
                                        >
                                            <button
                                                onClick={() => toggleGroup(group.id)}
                                                className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className={`rounded-2xl p-2 ${isDark ? 'bg-cyan-500/10 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {group.label}
                                                        </h5>
                                                        <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                            {groupDone}/{group.exams.length} selesai
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'}`}>
                                                        {groupDone === group.exams.length ? 'Lengkap ✓' : `${groupDone}/${group.exams.length}`}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronDown size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                                                    ) : (
                                                        <ChevronRight size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                                                    )}
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className={`border-t p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                                    <div className="grid gap-2">
                                                        {group.exams.map((examKey) => renderExamButton(examKey))}
                                                    </div>
                                                </div>
                                            )}
                                        </section>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={`min-h-0 rounded-3xl border ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                        <div className={`border-b px-4 py-3 md:px-5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-emerald-500" />
                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                    Telemetry Logs
                                </h4>
                            </div>
                            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Ringkasan temuan terkini dari seluruh pemeriksaan fisik yang sudah dilakukan.
                            </p>
                        </div>

                        <div className="max-h-[34vh] overflow-y-auto p-3 md:p-4 thin-scrollbar">
                            {findingEntries.length === 0 ? (
                                <div className={`rounded-2xl border border-dashed p-6 text-center ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                                    Belum ada telemetry log. Pilih salah satu sistem di atas untuk mulai memeriksa pasien.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {findingEntries.map(([examKey, finding]) => (
                                        <FindingCard
                                            key={examKey}
                                            examKey={examKey}
                                            finding={finding}
                                            isDark={isDark}
                                        />
                                    ))}
                                </div>
                            )}
                            <div ref={examResultsRef} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
