/**
 * @reflection
 * [IDENTITY]: EmergencyPanel
 * [PURPOSE]: React UI component: Gamified Trauma Bay Command Center (IGD).
 * [STATE]: Polished UI/UX Overhaul â€” Bento-Box Cockpit + Tactical Stepper
 * [ANCHOR]: EmergencyPanel
 * [DEPENDS_ON]: GameContext, EmergencyCases, AvatarUtils, framer-motion
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-29
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext.jsx';
import {
    AlertTriangle, Clock, Heart, Activity, Zap, CheckCircle, XCircle, ArrowRight,
    Siren, Thermometer, Droplets, Bot, FileText, Stethoscope, Info, Truck,
    Skull, ShieldAlert, Receipt, ChevronDown, ChevronRight, Check, Crosshair
} from 'lucide-react';
import { TRIAGE_LEVELS, ESI_LEVELS, validateTriage, validateStabilization, calculatePatientStatus, getEmergencyCase, EMERGENCY_ACTIONS, calculateEmergencyBillForPatient } from '../game/EmergencyCases.js';
import { getAvatarStyle } from '../utils/AvatarUtils.js';
import { formatTime } from '../utils/formatTime.js';

// Triage color badge component
export function TriageBadge({ level, esiLevel, size = 'sm' }) {
    const { openWiki } = useGame();
    const info = TRIAGE_LEVELS[level] || TRIAGE_LEVELS[3];
    const isLg = size === 'lg';

    const esiInfo = esiLevel ? ESI_LEVELS[esiLevel] : null;

    return (
        <div className="flex items-center gap-1">
            {/* Color Badge - Links to Triage Color Wiki */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    openWiki(`triage_${level}`);
                }}
                className={`
                    ${info.color} ${info.badgeTextColor || 'text-white'} font-black rounded flex items-center justify-center shadow-sm
                    cursor-help hover:brightness-110 active:scale-95 transition-all
                    ${isLg ? 'px-3 py-1 text-sm' : 'px-1.5 py-0.5 text-[10px]'}
                `}
                title={`${info.name}: ${info.desc} (Klik untuk WIKI)`}
            >
                {info.name}
            </div>

            {/* ESI Badge - Links to ESI Wiki */}
            {esiLevel && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        openWiki(`esi_${esiLevel}`);
                    }}
                    className={`
                        bg-white border-2 ${info.borderColor} ${info.textColor} font-black rounded flex items-center justify-center shadow-sm
                        cursor-help hover:brightness-110 active:scale-95 transition-all
                        ${isLg ? 'px-3 py-1 text-sm' : 'px-1.5 py-0.5 text-[10px]'}
                    `}
                    title={esiInfo ? `${esiInfo.name}: ${esiInfo.desc} (Klik untuk WIKI)` : 'ESI (Klik untuk WIKI)'}
                >
                    ESI {esiLevel}
                </div>
            )}
        </div>
    );
}

// Countdown timer for emergency patients
export function EmergencyTimer({ patient, time }) {
    const waitTime = time - patient.arrivalTime;
    const triage = TRIAGE_LEVELS[patient.triageLevel];
    const timeLimit = triage?.timeLimit || 60;
    const isOverdue = waitTime > timeLimit && timeLimit > 0;
    const isCritical = patient.triageLevel === 1;

    return (
        <div className={`flex items-center gap-1 text-xs font-mono ${isOverdue ? 'text-red-600 font-bold animate-pulse' :
            isCritical ? 'text-red-500' : 'text-amber-600'
            }`}>
            <Clock size={12} />
            <span>{waitTime}m</span>
            {isOverdue && <AlertTriangle size={12} />}
        </div>
    );
}

// ðŸŒŸ WISDOM 3: Diegetic Vitals with Pop Animation
function LiveVitalValue({ value, unit, isCritical, colorClass }) {
    const prevValue = useRef(value);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (value !== prevValue.current && value !== undefined) {
            setFlash(true);
            const t = setTimeout(() => setFlash(false), 400);
            prevValue.current = value;
            return () => clearTimeout(t);
        }
    }, [value]);

    return (
        <div className="flex items-baseline gap-1">
            <motion.span
                key={flash ? `${value}-flash` : value}
                initial={flash ? { scale: 1.25, filter: 'brightness(1.5)' } : false}
                animate={{ scale: 1, filter: 'brightness(1)' }}
                transition={{ duration: 0.3 }}
                className={`text-xl md:text-2xl font-black font-mono leading-none ${isCritical ? 'text-rose-500 animate-pulse' : colorClass}`}
            >
                {value ?? '--'}
            </motion.span>
            {unit && <span className="text-[10px] text-slate-500 font-bold ml-1">{unit}</span>}
        </div>
    );
}
// Single emergency patient card â€” with Plateau & SISRUTE Limbo visual states
function EmergencyPatientCard({ patient, onSelect, isActive, time }) {
    const triage = TRIAGE_LEVELS[patient.triageLevel];
    const isLimbo = patient.status === 'sisrute_limbo';

    return (
        <button
            onClick={() => onSelect(patient.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${isLimbo
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 opacity-90'
                    : isActive
                        ? `${triage?.borderColor || 'border-red-500'} bg-white dark:bg-slate-800 shadow-lg`
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:shadow-md'
                }`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <TriageBadge level={patient.triageLevel} esiLevel={patient.esiLevel} />
                    <div className="flex items-center gap-2">
                        <div className="rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-sm bg-slate-50">
                            <div
                                style={getAvatarStyle(patient.age, patient.gender, 36)}
                                className="w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{patient.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{patient.age} th / {patient.gender}</p>
                        </div>
                    </div>
                </div>
                {!isLimbo && <EmergencyTimer patient={patient} time={time} />}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 italic">"{patient.complaint}"</p>

            {/* SISRUTE Limbo indicator */}
            {isLimbo ? (
                <div className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-xs px-2 py-1.5 rounded flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1 animate-pulse"><Truck size={12} /> {patient.sisruteData?.hospitalName || 'RS Rujukan'}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {patient.sisruteData?.estimatedArrival ? `ETA ${formatTime(patient.sisruteData.estimatedArrival)}` : '?'}</span>
                </div>
            ) : patient.deterioration > 0 && (
                /* Deterioration indicator â€” shows Plateau when rate â‰¤ 0 */
                <div className={`mt-2 text-xs px-2 py-1 rounded flex items-center gap-1 ${patient.deteriorationRate <= 0
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    <Activity size={12} className={patient.deteriorationRate > 0 ? 'animate-pulse' : ''} />
                    {patient.deteriorationRate <= 0 ? 'Kondisi Tertahan (Plateau)' : `Kondisi memburuk (${patient.deterioration}%)`}
                </div>
            )}
        </button>
    );
}

// Main Emergency Panel Component
export default function EmergencyPanel({ emergencyQueue, onAdmitEmergency, activeEmergencyId, time }) {

    if (!emergencyQueue || emergencyQueue.length === 0) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-800">
                <Siren size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">Tidak ada pasien IGD</p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Pasien gawat darurat akan muncul di sini</p>
            </div>
        );
    }

    // Sort by triage level (critical first)
    const sortedQueue = [...emergencyQueue].sort((a, b) => a.triageLevel - b.triageLevel);

    // Count by triage level
    const triageCounts = emergencyQueue.reduce((acc, p) => {
        acc[p.triageLevel] = (acc[p.triageLevel] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-900/50 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-4 text-white overflow-hidden">
                {/* Background Pattern/Image */}
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 pointer-events-none">
                    <img src="/images/wilayah/igd_bg.png" alt="IGD" className="h-full object-cover object-left" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                            <Siren size={18} />
                            IGD - Gawat Darurat
                        </h3>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
                            {emergencyQueue.length} pasien
                        </span>
                    </div>

                    {/* Triage summary */}
                    <div className="flex gap-2 mt-2">
                        {Object.entries(triageCounts).map(([level, count]) => (
                            <div key={level} className="flex items-center gap-1">
                                <TriageBadge level={parseInt(level)} size="sm" />
                                <span className="text-xs font-bold opacity-80">x{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Patient List - expands naturally, only scrolls when needed */}
            <div className="p-3 space-y-2">
                {sortedQueue.map(patient => (
                    <EmergencyPatientCard
                        key={patient.id}
                        patient={patient}
                        onSelect={onAdmitEmergency}
                        isActive={activeEmergencyId === patient.id}
                        time={time}
                    />
                ))}
            </div>
        </div>
    );
}

// S.A.M.P.L.E Cito Anamnesis â€” tab-grid layout
const SAMPLE_CONFIG = [
    { key: 'S', label: 'Symptoms', labelId: 'Gejala', color: 'text-rose-500 bg-rose-100 dark:bg-rose-500/20' },
    { key: 'A', label: 'Allergies', labelId: 'Alergi', color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20' },
    { key: 'M', label: 'Medications', labelId: 'Obat', color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/20' },
    { key: 'P', label: 'Past History', labelId: 'Riwayat', color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/20' },
    { key: 'L', label: 'Last Meal', labelId: 'Makan Terakhir', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20' },
    { key: 'E', label: 'Events', labelId: 'Kejadian', color: 'text-slate-600 bg-slate-200 dark:text-slate-300 dark:bg-slate-700' },
];

function SampleAnamnesis({ patient }) {
    const [openKey, setOpenKey] = useState('S');

    // Map SAMPLE letters to case data (preserved from original â€” richer than DT version)
    const getData = (key) => {
        const aq = patient.medicalData?.anamnesisQuestions || {};
        const hidden = patient.hidden || {};
        switch (key) {
            case 'S': {
                const items = [];
                (aq.keluhan_utama || []).forEach(q => items.push({ q: q.text, a: q.response, essential: q.priority === 'essential' }));
                (aq.rps || []).forEach(q => items.push({ q: q.text, a: q.response, essential: q.priority === 'essential' }));
                if (items.length === 0) {
                    (patient.medicalData?.symptoms || []).forEach(s => items.push({ q: 'Gejala', a: s }));
                }
                return items;
            }
            case 'A': {
                const allergies = hidden.allergies || [];
                return allergies.length > 0
                    ? allergies.map(a => ({ q: 'Alergi', a }))
                    : [{ q: 'Ada alergi obat/makanan?', a: 'Tidak ada alergi yang diketahui.' }];
            }
            case 'M': {
                const meds = hidden.currentMedications || [];
                const items = meds.length > 0
                    ? meds.map(m => ({ q: 'Obat rutin', a: m }))
                    : [{ q: 'Minum obat rutin?', a: 'Tidak ada obat rutin.' }];
                (aq.rpd || []).filter(q => q.text.toLowerCase().includes('obat')).forEach(q => items.push({ q: q.text, a: q.response }));
                return items;
            }
            case 'P': {
                const items = [];
                (aq.rpd || []).forEach(q => items.push({ q: q.text, a: q.response }));
                (hidden.conditions || []).forEach(c => items.push({ q: 'Riwayat penyakit', a: c }));
                if (items.length === 0) items.push({ q: 'Riwayat penyakit dahulu?', a: 'Tidak ada riwayat penyakit penting.' });
                return items;
            }
            case 'L':
                return [{ q: 'Terakhir makan/minum kapan?', a: 'Tadi pagi sebelum kejadian.' }];
            case 'E': {
                const items = [];
                (aq.sosial || []).forEach(q => items.push({ q: q.text, a: q.response }));
                const mechanism = (aq.keluhan_utama || []).find(q => q.text.toLowerCase().includes('kenapa') || q.text.toLowerCase().includes('bagaimana') || q.text.toLowerCase().includes('kejadian'));
                if (mechanism) items.unshift({ q: mechanism.text, a: mechanism.response, essential: true });
                if (items.length === 0) items.push({ q: 'Apa yang terjadi sebelumnya?', a: patient.complaint || 'Keluhan muncul tiba-tiba.' });
                return items;
            }
            default: return [];
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Stethoscope size={16} className="text-slate-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">S.A.M.P.L.E Anamnesis Cito</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 border-b border-slate-100 dark:border-slate-800">
                {SAMPLE_CONFIG.map(({ key, labelId, color }) => (
                    <button key={key} onClick={() => setOpenKey(openKey === key ? null : key)} className={`p-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${openKey === key ? 'border-indigo-500 bg-slate-50 dark:bg-slate-800' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${color}`}>{key}</span>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 hidden sm:block">{labelId}</span>
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                {openKey && (
                    <motion.div key={openKey} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-slate-50/50 dark:bg-slate-900">
                        <div className="p-4 space-y-2">
                            {getData(openKey).filter(Boolean).map((item, i) => (
                                <div key={i} className={`text-xs ${item.essential ? 'bg-amber-50 dark:bg-amber-900/10 p-2 rounded border-l-2 border-amber-400' : 'border-l-2 border-indigo-400 pl-2'}`}>
                                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{item.q}</span>
                                    <p className="text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">"{item.a}"</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Emergency Patient EMR View (detailed view when admitted)
export function EmergencyEMR({ patient, onStabilize: _onStabilize, onRefer, onDischarge, time }) {
    const gameCtx = useGame();
    const { delegateEmergencyToMaia, openWiki } = gameCtx;
    // Fallback time from game context if not passed as prop
    const resolvedTime = time ?? gameCtx.time ?? 0;

    // Core States
    const [triageSelection, setTriageSelection] = useState(null);
    const [triageValidation, setTriageValidation] = useState(null);
    const [performedActions, setPerformedActions] = useState([]);
    const [stabilizationValidation, setStabilizationValidation] = useState(null);
    const [isResuscitating, setIsResuscitating] = useState(false);
    const [resuscitationAttempts, setResuscitationAttempts] = useState(0);
    const [showBilling, setShowBilling] = useState(false);
    const MAX_RESUS_ATTEMPTS = 2;

    // WISDOM 2: Phase Stepper Logic
    const maxPhase = !triageValidation ? 1 : !stabilizationValidation ? 2 : 3;
    const [activePhase, setActivePhase] = useState(1);

    // Preserved: Wiki integration for action items
    const PROC_WIKI_MAP = {
        'iv_line': 'proc_iv_line',
        'oxygen': 'proc_oxygen',
        'nebulizer': 'proc_nebulizer',
        'salbutamol_neb': 'proc_nebulizer',
        'ipratropium_neb': 'proc_nebulizer',
        'suturing': 'proc_hecting',
        'cpr': 'proc_cpr',
        'monitor_gds': 'lab_gds'
    };

    // Codex Fix [High]: All hooks must be called BEFORE any early return.
    const baseVitals = patient?.medicalData?.vitals || {};
    const vitals = useMemo(() => {
        const current = { ...baseVitals };
        performedActions.forEach(actionId => {
            const effect = EMERGENCY_ACTIONS[actionId]?.vitalEffect;
            if (!effect) return;
            if (effect.hr && typeof current.hr === 'number') current.hr = Math.max(0, Math.min(200, current.hr + effect.hr));
            if (effect.spo2 && typeof current.spo2 === 'number') current.spo2 = Math.max(0, Math.min(100, current.spo2 + effect.spo2));
            if (effect.rr && typeof current.rr === 'number') current.rr = Math.max(4, Math.min(60, current.rr + effect.rr));
            if (effect.temp && typeof current.temp === 'number') current.temp = Math.max(34, Math.min(42, current.temp + effect.temp));
            if (effect.gds && typeof current.gds === 'number') current.gds = Math.max(10, Math.min(600, current.gds + effect.gds));
            if (effect.bp_sys && typeof current.bp === 'string' && current.bp.includes('/')) {
                const [sys, dia] = current.bp.split('/');
                const newSys = Math.max(40, Math.min(250, parseInt(sys) + effect.bp_sys));
                current.bp = `${newSys}/${dia}`;
            }
        });
        return current;
    }, [baseVitals, performedActions]);

    // Reset state when patient changes
    const patientId = patient?.id;
    useEffect(() => {
        if (!patientId) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset component state when patient changes
        setTriageSelection(null); setTriageValidation(null);
        setPerformedActions([]); setStabilizationValidation(null);
        setIsResuscitating(false); setResuscitationAttempts(0);
        setActivePhase(1); setShowBilling(false);
    }, [patientId]);

    // Auto-advance phases smoothly
    useEffect(() => { if (triageValidation && activePhase === 1) setActivePhase(2); }, [triageValidation]);
    useEffect(() => { if (stabilizationValidation && activePhase === 2) setActivePhase(3); }, [stabilizationValidation]);

    // Guard: patient may be undefined if queue desyncs from activeEmergencyId
    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400">
                <Crosshair size={32} className="mb-3 opacity-50" />
                <p className="font-bold">Pilih Pasien dari Triage Board</p>
            </div>
        );
    }

    const triage = TRIAGE_LEVELS[patient.triageLevel];
    const deteriorationLevel = patient.deterioration || 0;

    // Handle action toggle
    const toggleAction = (actionId) => {
        if (performedActions.includes(actionId)) {
            setPerformedActions(performedActions.filter(a => a !== actionId));
        } else {
            setPerformedActions([...performedActions, actionId]);
        }
    };

    // ðŸ–¤ KODE HITAM (DEATH) â€” Max resuscitation attempts exhausted
    if (deteriorationLevel >= 100 && patient.triageLevel !== 4 && resuscitationAttempts >= MAX_RESUS_ATTEMPTS) {
        return (
            <motion.div initial={{ opacity: 0, filter: 'grayscale(0%)' }} animate={{ opacity: 1, filter: 'grayscale(100%)' }} transition={{ duration: 2 }} className="h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center rounded-xl border border-slate-800 z-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
                <Skull size={72} className="text-slate-600 mb-6 z-10" />
                <h2 className="text-4xl font-black text-slate-400 tracking-[0.3em] mb-4 z-10">KODE HITAM</h2>
                <div className="bg-slate-900/80 p-6 rounded-xl max-w-md mb-8 shadow-2xl z-10 border border-slate-800">
                    <p className="text-slate-300 font-bold mb-2">Resusitasi Dihentikan.</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Waktu kematian dicatat: {formatTime(resolvedTime)}.<br/>Upaya resusitasi maksimal ({MAX_RESUS_ATTEMPTS}x) telah dilakukan namun pasien tidak merespons.
                    </p>
                </div>
                <button onClick={() => onDischarge(patient, { action: 'death', triageAssigned: 'hitam', actionsPerformed: performedActions })}
                    className="z-10 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-8 py-4 rounded-xl border border-slate-600 transition-all flex items-center gap-3 shadow-xl">
                    <FileText size={18} /> Dokumentasi Kamar Jenazah
                </button>
            </motion.div>
        );
    }

    // ðŸš¨ CODE BLUE â€” Still have resuscitation attempts left
    if (deteriorationLevel >= 100 && patient.triageLevel !== 4 && !isResuscitating) {
        return (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full bg-rose-950 flex flex-col items-center justify-center p-8 rounded-xl border-4 border-red-600 relative overflow-hidden text-center z-50">
                <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />
                <Activity size={90} className="text-red-500 mb-6 animate-bounce relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,1)]" />
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-[0.2em] mb-4 relative z-10 drop-shadow-md">CODE BLUE</h2>
                <div className="max-w-md bg-black/50 backdrop-blur-md p-6 rounded-xl border border-red-800/50 mb-8 relative z-10">
                    <p className="text-red-200 font-bold text-lg mb-2">Henti Jantung / Napas Terdeteksi</p>
                    <p className="text-sm text-red-400">Segera lakukan Resusitasi Jantung Paru (RJP) pada <span className="text-white font-bold">{patient.name}</span>!</p>
                    {resuscitationAttempts > 0 && <p className="text-xs text-red-500 mt-3 font-bold uppercase tracking-wider">Percobaan ke-{resuscitationAttempts + 1} / Limit: {MAX_RESUS_ATTEMPTS}</p>}
                </div>
                <button onClick={() => { setIsResuscitating(true); setResuscitationAttempts(p => p + 1); if(!performedActions.includes('cpr')) toggleAction('cpr'); }}
                    className="z-10 px-10 py-6 bg-red-600 hover:bg-red-500 text-white font-black text-2xl rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 transition-transform flex items-center gap-4 border-b-4 border-red-800">
                    <Zap size={32} className="animate-pulse" /> MULAI RJP / DEFIBRILASI
                </button>
            </motion.div>
        );
    }

    // SISRUTE LIMBO: Read-only view while waiting for ambulance
    if (patient.status === 'sisrute_limbo') {
        const sd = patient.sisruteData || {};
        const etaMinutes = sd.estimatedArrival ? Math.max(0, sd.estimatedArrival - resolvedTime) : 0;
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/80 p-8 text-center rounded-xl border-2 border-indigo-200 dark:border-indigo-900/50">
                <Truck size={80} className="text-indigo-500 mb-6 animate-pulse" />
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-wider mb-2">Menunggu Ambulans</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">SISRUTE Diterima di <span className="text-indigo-600 dark:text-indigo-300 font-bold">{sd.hospitalName || 'RS Tujuan'}</span></p>
                <div className="bg-indigo-50 dark:bg-indigo-950/50 px-8 py-5 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 mb-4">
                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Estimasi Tiba (ETA)</p>
                    <p className="text-5xl font-mono font-black text-indigo-700 dark:text-indigo-400">{etaMinutes > 0 ? `${etaMinutes} MIN` : 'TIBA'}</p>
                </div>
                <TriageBadge level={patient.triageLevel} esiLevel={patient.esiLevel} size="lg" />
                {patient.deterioration > 30 && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                        Deteriorasi: <span className="font-bold">{Math.round(patient.deterioration)}%</span> - Pantau kondisi, Code Blue mungkin terjadi!
                    </div>
                )}
            </div>
        );
    }

    // WISDOM 5: Ambient Tension Vignette Intensity
    const dangerOpacity = Math.max(0, (deteriorationLevel - 50) / 50);

    return (
        <div className="flex flex-col lg:flex-row h-full bg-slate-100 dark:bg-slate-950 relative rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">

            {/* Ambient Tension Vignette Overlay */}
            {dangerOpacity > 0 && (
                <div className="absolute inset-0 pointer-events-none rounded-xl z-40 transition-opacity duration-1000"
                     style={{ boxShadow: `inset 0 0 150px rgba(220, 38, 38, ${dangerOpacity * 0.5})` }} />
            )}

            {/* â–ˆ 1. THE COCKPIT: ALWAYS-ON VITAL MONITOR â–ˆ */}
            <div className="w-full lg:w-[280px] shrink-0 flex flex-col bg-[#0B1120] text-slate-200 z-20 border-b lg:border-b-0 lg:border-r border-slate-800 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.2)]">

                {/* Patient Profile Header */}
                <div className="p-4 border-b border-slate-800/80 relative overflow-hidden bg-slate-900">
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <TriageBadge level={patient.triageLevel} esiLevel={patient.esiLevel} />
                        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">{formatTime(patient.arrivalTime)}</span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div style={getAvatarStyle(patient.age, patient.gender, 48)} className="shrink-0 rounded-full border-2 border-slate-700 shadow-md bg-slate-800" />
                        <div className="min-w-0">
                            <h2 className="font-bold text-white truncate text-lg leading-tight">{patient.name}</h2>
                            <p className="text-xs text-slate-400">{patient.age} th / {patient.gender}
                                {patient.anthropometrics && ` | ${patient.anthropometrics.height}cm/${patient.anthropometrics.weight}kg`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Telemetry Display */}
                <div className="p-4 flex-1 flex flex-col justify-center overflow-y-auto thin-scrollbar">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1.5"><Activity size={12} className="animate-pulse" /> Telemetry</span>
                        {deteriorationLevel > 0 && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${deteriorationLevel > 80 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-amber-500'}`}>DET {Math.round(deteriorationLevel)}%</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold mb-1">HR (bpm)</p>
                            <LiveVitalValue value={vitals.hr} isCritical={vitals.hr < 60 || vitals.hr > 110} colorClass="text-emerald-400" />
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold mb-1">NIBP (mmHg)</p>
                            <LiveVitalValue value={vitals.bp} isCritical={false} colorClass="text-blue-400" />
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold mb-1">SpO2 (%)</p>
                            <LiveVitalValue value={vitals.spo2} isCritical={vitals.spo2 < 92} colorClass="text-cyan-400" />
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold mb-1">RESP</p>
                            <LiveVitalValue value={vitals.rr} isCritical={vitals.rr < 12 || vitals.rr > 26} colorClass="text-teal-400" />
                        </div>
                    </div>
                    {(vitals.temp || vitals.gds) && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {vitals.temp && <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">TEMP</p>
                                <LiveVitalValue value={vitals.temp} isCritical={vitals.temp > 38 || vitals.temp < 36} colorClass="text-orange-400" />
                            </div>}
                            {vitals.gds && <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">GDS (mg/dL)</p>
                                <LiveVitalValue value={vitals.gds} isCritical={vitals.gds < 70 || vitals.gds > 200} colorClass="text-yellow-400" />
                            </div>}
                        </div>
                    )}

                    <div className="mt-auto pt-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                            <span className={dangerOpacity > 0 ? 'text-rose-500' : 'text-slate-500'}>Status Deteriorasi</span>
                            <span className={dangerOpacity > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}>{Math.floor(deteriorationLevel)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div className={`h-full ${deteriorationLevel > 80 ? 'bg-rose-500' : deteriorationLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${deteriorationLevel}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* â–ˆ 2. COMMAND CENTER WORKSPACE (Phased Stepper) â–ˆ */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative z-10 overflow-hidden">

                {/* Stepper Navigation */}
                <div className="flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 shrink-0 shadow-sm">
                    {[
                        { id: 1, name: 'Triase', icon: ShieldAlert },
                        { id: 2, name: 'Stabilisasi', icon: Zap },
                        { id: 3, name: 'Disposisi', icon: ArrowRight }
                    ].map(phase => {
                        const isUnlocked = maxPhase >= phase.id;
                        const isActive = activePhase === phase.id;
                        const isDone = maxPhase > phase.id;
                        return (
                            <button key={phase.id} onClick={() => isUnlocked && setActivePhase(phase.id)} disabled={!isUnlocked}
                                className={`flex-1 py-3 px-2 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-b-2
                                    ${isActive ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' :
                                      isDone ? 'border-emerald-500 text-emerald-600 dark:text-emerald-500' :
                                      'border-transparent text-slate-400 opacity-40 cursor-not-allowed'}`}
                            >
                                {isDone ? <CheckCircle size={14} /> : <phase.icon size={14} />}
                                <span className="hidden sm:inline">{phase.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    <AnimatePresence mode="wait">

                        {/* ðŸŸ¦ FASE 1: TRIASE */}
                        {activePhase === 1 && (
                            <motion.div key="phase1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto space-y-4">

                                <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 border-l-4 border-l-rose-500 shadow-sm">
                                    <h3 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Keluhan Utama (Chief Complaint)</h3>
                                    <p className="text-lg italic text-slate-800 dark:text-slate-200 font-medium">"{patient.complaint}"</p>
                                    {patient.medicalData?.symptoms?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {patient.medicalData.symptoms.map((s, i) => (
                                                <span key={i} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">{s}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <SampleAnamnesis patient={patient} />

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><ShieldAlert size={16} className="text-indigo-500"/> Penetapan Triase ESI</h3>
                                        <button onClick={() => openWiki('esi_overview')} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors"><Info size={14}/> Panduan ESI</button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                        {Object.entries(TRIAGE_LEVELS).filter(([k]) => k !== '0').map(([level, info]) => (
                                            <button key={level} onClick={() => setTriageSelection(parseInt(level))}
                                                className={`p-3.5 rounded-xl border-2 text-left transition-all relative overflow-hidden ${triageSelection === parseInt(level) ? `${info.borderColor} bg-slate-50 dark:bg-slate-800 shadow-md transform scale-[1.02]` : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:bg-slate-800'}`}
                                            >
                                                {triageSelection === parseInt(level) && <div className={`absolute top-0 left-0 w-1.5 h-full ${info.color}`} />}
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className={`font-bold ${triageSelection === parseInt(level) ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{info.name}</span>
                                                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded ${info.color} ${info.badgeTextColor || 'text-white'}`}>T{level}</span>
                                                </div>
                                                <p className={`text-xs ${triageSelection === parseInt(level) ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{info.desc}</p>
                                            </button>
                                        ))}
                                    </div>

                                    {!triageValidation ? (
                                        <button onClick={() => setTriageValidation(validateTriage({ triageLevel: patient.triageLevel }, triageSelection))} disabled={!triageSelection}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-indigo-600/20">
                                            Kunci Penilaian Triase
                                        </button>
                                    ) : (
                                        <div className={`p-4 rounded-xl border flex items-center justify-between ${triageValidation.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-300'}`}>
                                            <div>
                                                <p className="font-bold">{triageValidation.feedback}</p>
                                                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">Seharusnya: <TriageBadge level={triageValidation.correctLevel} esiLevel={triageValidation.triageLevelInfo?.esiLevel} /></p>
                                            </div>
                                            {triageValidation.isCorrect ? <CheckCircle size={24} className="text-emerald-500" /> : <XCircle size={24} className="text-rose-500" />}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ðŸŸ¨ FASE 2: STABILISASI (Tactical Grid) */}
                        {activePhase === 2 && (
                            <motion.div key="phase2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto space-y-4">

                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-1">Diagnosis Kerja (Suspect)</p>
                                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{patient.medicalData?.diagnosisName || patient.hidden?.diagnosis || 'Belum Tegak'}</p>
                                    </div>
                                    <span className="font-mono text-xs font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-slate-500">{patient.medicalData?.trueDiagnosisCode || '-'}</span>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="font-black text-xs uppercase text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-500"/> Tactical Action Grid</h3>

                                    {/* WISDOM 4: Tactical Action Chips */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                        {(patient.hidden?.stabilizationChecklist || []).map((action) => {
                                            const isDone = performedActions.includes(action);
                                            return (
                                                <button key={action} onClick={() => toggleAction(action)}
                                                    className={`relative p-3.5 rounded-xl border-2 text-left transition-all active:scale-95 flex flex-col justify-between min-h-[90px]
                                                        ${isDone ? 'bg-blue-600 border-blue-700 shadow-inner' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                                                    <div className="flex justify-between items-start w-full">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-blue-200' : 'text-slate-400'}`}>INTV</span>
                                                        <div className="flex items-center gap-1">
                                                            {PROC_WIKI_MAP[action] && (
                                                                <div onClick={(e) => { e.stopPropagation(); openWiki(PROC_WIKI_MAP[action]); }}
                                                                    className={`p-0.5 rounded transition-colors ${isDone ? 'text-blue-200 hover:text-white' : 'text-slate-400 hover:text-blue-500'}`} title="Info Wiki">
                                                                    <Info size={12} />
                                                                </div>
                                                            )}
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isDone ? 'border-white bg-white text-blue-600' : 'border-slate-300 dark:border-slate-600 text-transparent'}`}>
                                                                {isDone && <Check size={12} strokeWidth={4} />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`font-bold text-sm leading-tight mt-3 ${isDone ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                                        {EMERGENCY_ACTIONS[action]?.name || action.replace(/_/g, ' ')}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {!stabilizationValidation ? (
                                        <button onClick={() => setStabilizationValidation(validateStabilization({ stabilizationChecklist: patient.hidden?.stabilizationChecklist || [], immediateActions: patient.hidden?.immediateActions || [] }, performedActions))}
                                            className="w-full py-4 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-slate-700 dark:hover:bg-white active:scale-[0.98] transition-all shadow-lg">
                                            Evaluasi & Selesai Tindakan
                                        </button>
                                    ) : (
                                        <div className={`p-4 rounded-xl border ${stabilizationValidation.score >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-300' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300'}`}>
                                            <p className="font-bold text-base mb-1">Skor Pemulihan: {stabilizationValidation.score}%</p>
                                            <p className="text-sm opacity-90">{stabilizationValidation.feedback}</p>
                                            {stabilizationValidation.missing?.length > 0 && <p className="text-[10px] font-bold mt-2 uppercase tracking-wider p-2 bg-white/50 dark:bg-black/20 rounded">Terlewat: {stabilizationValidation.missing.join(', ')}</p>}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ðŸŸ© FASE 3: DISPOSISI & TAGIHAN */}
                        {activePhase === 3 && stabilizationValidation && (
                            <motion.div key="phase3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4 pb-8">

                                {(() => {
                                    const status = calculatePatientStatus(stabilizationValidation.score, triageValidation?.isCorrect, performedActions.length, patient.hidden?.stabilizationChecklist?.length || 0);
                                    return (
                                        <div className={`p-6 rounded-2xl border ${status.bgColor} dark:bg-opacity-10 border-current/20 shadow-sm flex items-center gap-5`}>
                                            <div className={`p-4 rounded-full bg-white dark:bg-slate-800 shadow-sm ${status.color}`}>
                                                <span className="text-4xl">{status.icon}</span>
                                            </div>
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${status.color} mb-1`}>Status Akhir</p>
                                                <p className="font-black text-xl text-slate-800 dark:text-slate-100">{status.label}</p>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{status.description}</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Differential Diagnosis */}
                                {(() => {
                                    const differentials = patient.hidden?.differentialDiagnosis || getEmergencyCase(patient.hidden?.diseaseId)?.differentialDiagnosis;
                                    if (!differentials) return null;
                                    return (
                                        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Stethoscope size={16}/> Diagnosis Banding (DDx)</h3>
                                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-2">
                                                {differentials.map((dx, i) => <li key={i}>{dx}</li>)}
                                            </ul>
                                            <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-xs text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                <p><strong>Untuk Surat Rujukan:</strong></p>
                                                <p>- Working Dx: {patient.medicalData?.diagnosisName || patient.hidden?.diagnosis || '-'}</p>
                                                <p>- DDx: {differentials.join(', ')}</p>
                                                <p>- Tindakan: {performedActions.length > 0 ? performedActions.map(id => EMERGENCY_ACTIONS[id]?.name || id).join('; ') : 'Belum ada'}</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Collapsible Billing Drawer */}
                                <div className="bg-slate-900 text-white rounded-xl border border-slate-700 overflow-hidden shadow-lg mt-4">
                                    <button onClick={() => setShowBilling(!showBilling)} className="w-full p-4 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition-colors outline-none">
                                        <div className="flex items-center gap-3">
                                            <Receipt size={18} className="text-cyan-400" />
                                            <span className="font-bold">Administrasi & Rincian Tagihan</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${patient.social?.hasBPJS ? 'bg-emerald-500 text-slate-900' : 'bg-slate-600 text-white'}`}>{patient.social?.hasBPJS ? 'BPJS' : 'UMUM'}</span>
                                            {showBilling ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {showBilling && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-900">
                                                {(() => {
                                                    const bill = calculateEmergencyBillForPatient(patient, performedActions, triageSelection || patient.triageLevel);
                                                    const actionDetails = Array.isArray(bill.actionDetails) ? bill.actionDetails : [];
                                                    return (
                                                        <div className="p-5 font-mono text-sm space-y-2 border-t border-slate-700 text-slate-300">
                                                            <div className="flex justify-between pb-1.5 border-b border-slate-800"><span>Pendaftaran IGD</span><span>Rp {bill.pendaftaran.toLocaleString()}</span></div>
                                                            <div className="flex justify-between pb-1.5 border-b border-slate-800"><span>Jasa Medis & Resusitasi</span><span>Rp {bill.jasaMedis.toLocaleString()}</span></div>
                                                            {actionDetails.map((a, i) => <div key={i} className="flex justify-between text-xs opacity-70 pl-4"><span className="truncate pr-4">- {a.name}</span><span>Rp {a.cost.toLocaleString()}</span></div>)}
                                                            <div className="flex justify-between pt-3 mt-3 border-t border-slate-700 font-black text-lg text-white"><span>TOTAL TAGIHAN</span><span className="text-emerald-400">Rp {bill.finalBill.toLocaleString()}</span></div>
                                                            <div className={`mt-4 p-4 rounded-xl font-sans text-xs border ${bill.isCovered ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' : 'bg-rose-900/30 border-rose-500/50 text-rose-200'}`}>
                                                                <span className="font-black uppercase tracking-widest mb-1.5 block">Penjamin: {bill.coverageType}</span>
                                                                {!bill.isCovered && patient.social?.hasBPJS ? 'Triase non-emergency (Hijau) tidak dijamin BPJS di IGD.' : 'Seluruh tindakan gawat darurat dikaver penuh.'}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Disposisi Buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    {!patient.hidden?.referralRequired && (
                                        <button onClick={() => onDischarge(patient, { action: 'stabilize', triageAssigned: triageSelection, actionsPerformed: performedActions })}
                                            className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-emerald-600/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                                            <CheckCircle size={24} /> Boleh Pulang
                                        </button>
                                    )}
                                    <button onClick={() => onRefer(patient, { action: 'refer', isSISRUTE: true, triageAssigned: triageSelection, actionsPerformed: performedActions })}
                                        className={`p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all ${patient.hidden?.referralRequired ? 'col-span-2' : ''}`}>
                                        <Truck size={24} /> Rujuk (SISRUTE)
                                    </button>
                                    <button onClick={() => delegateEmergencyToMaia(patient.id)}
                                        className="col-span-2 mt-2 p-3 bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex justify-center items-center gap-2 text-xs transition-colors">
                                        <Bot size={16} /> Delegasikan Sisa Dokumen ke MAIA <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[9px] text-rose-500">-5 Rep</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

