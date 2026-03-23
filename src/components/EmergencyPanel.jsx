/**
 * @reflection
 * [IDENTITY]: EmergencyPanel
 * [PURPOSE]: React UI component: TriageBadge, EmergencyQueue, EmergencyEMR.
 * [STATE]: Stable + Dynamic Vitals + Code Blue Engine
 * [ANCHOR]: EmergencyPanel
 * [DEPENDS_ON]: GameContext, EmergencyCases, SoundManager, AvatarUtils
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-21
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { AlertTriangle, Clock, Heart, Activity, Zap, CheckCircle, XCircle, ArrowRight, Siren, Thermometer, Droplets, Bot, FileText, Stethoscope, Info, Truck } from 'lucide-react';
import { TRIAGE_LEVELS, ESI_LEVELS, validateTriage, validateStabilization, calculatePatientStatus, getEmergencyCase, EMERGENCY_ACTIONS, calculateEmergencyBill } from '../game/EmergencyCases.js';
import { useTranslation } from 'react-i18next';
import { soundManager as _soundManager } from '../utils/SoundManager.js';
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

/// Single emergency patient card — with Plateau & SISRUTE Limbo visual states
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
                /* Deterioration indicator — shows Plateau when rate ≤ 0 */
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
    const { t: _t } = useTranslation();

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
                                <span className="text-xs font-bold opacity-80">×{count}</span>
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

// S.A.M.P.L.E Cito Anamnesis — rapid emergency history taking
const SAMPLE_CONFIG = [
    { key: 'S', label: 'Symptoms', labelId: 'Gejala', color: 'bg-red-500', icon: '🩺' },
    { key: 'A', label: 'Allergies', labelId: 'Alergi', color: 'bg-orange-500', icon: '⚠️' },
    { key: 'M', label: 'Medications', labelId: 'Obat', color: 'bg-blue-500', icon: '💊' },
    { key: 'P', label: 'Past History', labelId: 'Riwayat', color: 'bg-purple-500', icon: '📋' },
    { key: 'L', label: 'Last Meal', labelId: 'Makan Terakhir', color: 'bg-green-500', icon: '🍚' },
    { key: 'E', label: 'Events', labelId: 'Kejadian', color: 'bg-slate-600', icon: '🔍' },
];

function SampleAnamnesis({ patient }) {
    const [revealed, setRevealed] = useState({});

    const toggleReveal = (key) => {
        setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Map SAMPLE letters to case data
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

    const revealedCount = Object.values(revealed).filter(Boolean).length;

    return (
        <div className="bg-teal-50 dark:bg-teal-950/20 p-4 rounded-lg border border-teal-200 dark:border-teal-900/50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                    <Stethoscope size={16} />
                    S.A.M.P.L.E — Anamnesis Cito
                </h3>
                <span className="text-[10px] bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded font-bold">
                    {revealedCount}/6
                </span>
            </div>

            {/* Chip Buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {SAMPLE_CONFIG.map(({ key, label, labelId, color, icon }) => (
                    <button
                        key={key}
                        onClick={() => toggleReveal(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 active:scale-95 ${revealed[key]
                                ? `${color} text-white border-black/20 shadow-md`
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span>{icon}</span>
                        <span className="font-black text-sm">{key}</span>
                        <span className="hidden sm:inline">— {labelId}</span>
                    </button>
                ))}
            </div>

            {/* Revealed Content */}
            {SAMPLE_CONFIG.filter(({ key }) => revealed[key]).map(({ key, label, labelId, color }) => {
                const data = getData(key);
                return (
                    <div key={key} className="mb-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 animate-in fade-in">
                        <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${color.replace('bg-', 'text-')}`}>
                            [{key}] {labelId} ({label})
                        </p>
                        <div className="space-y-1.5">
                            {data.map((item, i) => (
                                <div key={i} className={`text-xs ${item.essential ? 'bg-amber-50 dark:bg-amber-900/10 p-1.5 rounded border-l-2 border-amber-400' : ''}`}>
                                    <span className="text-slate-500 dark:text-slate-400">{item.q}</span>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium italic">"{item.a}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Emergency Patient EMR View (detailed view when admitted)
export function EmergencyEMR({ patient, onStabilize: _onStabilize, onRefer, onDischarge }) {
    const { delegateEmergencyToMaia, openWiki } = useGame();
    const [triageSelection, setTriageSelection] = useState(null);
    const [triageValidation, setTriageValidation] = useState(null);
    const [performedActions, setPerformedActions] = useState([]);
    const [showVitals, setShowVitals] = useState(false);
    const [stabilizationValidation, setStabilizationValidation] = useState(null);
    const [isResuscitating, setIsResuscitating] = useState(false);
    const [resuscitationAttempts, setResuscitationAttempts] = useState(0);
    const MAX_RESUS_ATTEMPTS = 2;

    // 💥 Dynamic Vitals — recalculates reactively when actions are toggled
    const baseVitals = patient.medicalData?.vitals || {};
    const vitals = React.useMemo(() => {
        // Clone base vitals (numbers or parse from strings)
        const current = { ...baseVitals };

        // Apply vitalEffect from each performed action
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

    const triage = TRIAGE_LEVELS[patient.triageLevel];

    // Mappings for Wiki
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

    // Reset state when patient changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset component state when patient changes
        setTriageSelection(null);
        setTriageValidation(null);
        setPerformedActions([]);
        setShowVitals(false);
        setStabilizationValidation(null);
        setIsResuscitating(false);
        setResuscitationAttempts(0);
    }, [patient.id]);

    // Handle triage selection
    const handleTriageSubmit = () => {
        if (triageSelection === null) return;

        const validation = validateTriage(
            { triageLevel: patient.triageLevel },
            triageSelection
        );
        setTriageValidation(validation);
    };

    // Handle action toggle
    const toggleAction = (actionId) => {
        if (performedActions.includes(actionId)) {
            setPerformedActions(performedActions.filter(a => a !== actionId));
        } else {
            setPerformedActions([...performedActions, actionId]);
        }
    };

    // Validate stabilization
    const handleValidateStabilization = () => {
        const validation = validateStabilization(
            {
                stabilizationChecklist: patient.hidden?.stabilizationChecklist || [],
                immediateActions: patient.hidden?.immediateActions || []
            },
            performedActions
        );
        setStabilizationValidation(validation);
    };

    // 🚨 CODE BLUE / KODE HITAM: Deterioration ≥ 100%
    if (patient.deterioration >= 100 && patient.triageLevel !== 4 && !isResuscitating) {
        // 🖤 KODE HITAM: Max resuscitation attempts exhausted → death
        if (resuscitationAttempts >= MAX_RESUS_ATTEMPTS) {
            return (
                <div className="p-8 h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-950 text-white rounded-lg border-4 border-slate-700 relative overflow-hidden">
                    <XCircle size={80} className="text-slate-500 mb-4 opacity-60" />
                    <h2 className="text-3xl font-black text-slate-400 tracking-widest mb-2">KODE HITAM</h2>
                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 mb-8 text-center z-10 w-full">
                        <p className="text-slate-300 font-bold text-lg mb-1">Pasien Tidak Merespons Resusitasi</p>
                        <p className="text-sm text-slate-500">Pasien <span className="text-slate-300 font-bold">{patient.name}</span> dinyatakan meninggal setelah {MAX_RESUS_ATTEMPTS}x percobaan RJP.</p>
                    </div>
                    <button
                        onClick={() => onDischarge(patient, {
                            action: 'death',
                            triageAssigned: 'hitam',
                            actionsPerformed: performedActions
                        })}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 z-10 border border-slate-600"
                    >
                        <FileText size={20} /> Catat Kematian & Dokumentasi
                    </button>
                </div>
            );
        }

        // 🚨 CODE BLUE: Still have resuscitation attempts left
        return (
            <div className="p-8 h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900 text-white rounded-lg border-4 border-red-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />
                <Activity size={80} className="text-red-500 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <h2 className="text-4xl font-black text-red-500 tracking-widest mb-2 drop-shadow-md">KODE BIRU!</h2>
                <div className="bg-red-950/50 p-4 rounded-lg border border-red-800/50 mb-8 text-center z-10 w-full">
                    <p className="text-red-200 font-bold text-lg mb-1">Deteriorasi 100% — Henti Jantung/Napas</p>
                    <p className="text-sm text-red-400">Pasien <span className="text-white font-bold">{patient.name}</span> membutuhkan resusitasi SEGERA!</p>
                    {resuscitationAttempts > 0 && (
                        <p className="text-xs text-red-500 mt-2 font-bold">⚠ Percobaan ke-{resuscitationAttempts + 1} dari {MAX_RESUS_ATTEMPTS} — Sisa kesempatan: {MAX_RESUS_ATTEMPTS - resuscitationAttempts}</p>
                    )}
                </div>
                <button
                    onClick={() => {
                        setIsResuscitating(true);
                        setResuscitationAttempts(prev => prev + 1);
                        if (!performedActions.includes('cpr')) toggleAction('cpr');
                    }}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3 z-10 border-b-4 border-red-800"
                >
                    <Zap size={24} /> MULAI RJP & DEFIBRILASI
                </button>
            </div>
        );
    }
    // 🚑 SISRUTE LIMBO: Read-only view while waiting for ambulance
    if (patient.status === 'sisrute_limbo') {
        const sd = patient.sisruteData || {};
        const etaMinutes = sd.estimatedArrival ? Math.max(0, sd.estimatedArrival - time) : 0;
        return (
            <div className="p-6 h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-950/30 rounded-lg border-2 border-blue-300 dark:border-blue-800 text-center space-y-4">
                <Truck size={48} className="text-blue-500 animate-bounce" />
                <h3 className="text-xl font-black text-blue-800 dark:text-blue-300">Menunggu Ambulans</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Pasien <span className="font-bold text-slate-800 dark:text-slate-200">{patient.name}</span> sudah diterima di
                </p>
                <div className="bg-blue-100 dark:bg-blue-900/40 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-bold text-blue-800 dark:text-blue-200">{sd.hospitalName || 'RS Rujukan'}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        🚑 {sd.ambulanceName || 'Ambulans'} • ETA: <span className="font-bold">{etaMinutes > 0 ? `${etaMinutes} menit` : 'Segera tiba!'}</span>
                    </p>
                </div>
                <TriageBadge level={patient.triageLevel} esiLevel={patient.esiLevel} size="lg" />
                {patient.deterioration > 30 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                        ⚠ Deteriorasi: <span className="font-bold">{Math.round(patient.deterioration)}%</span> — Pantau kondisi, Code Blue mungkin terjadi!
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {/* Patient Header */}
            <div className={`relative p-4 rounded-lg border-2 ${triage?.borderColor || 'border-red-500'} bg-white dark:bg-slate-900 overflow-hidden`}>
                {/* Background Pattern/Image */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                    <img src="/images/wilayah/igd_bg.png" alt="IGD" className="h-full object-cover object-left" />
                </div>
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div
                            style={getAvatarStyle(patient.age, patient.gender, 64)}
                            className="shrink-0 border-4 border-slate-100 shadow-md rounded-full bg-slate-50"
                        />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <TriageBadge level={patient.triageLevel} esiLevel={patient.esiLevel} size="lg" />
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{patient.name}</h2>
                                <button
                                    onClick={() => openWiki('esi_overview')}
                                    className="p-1 px-2 text-[10px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    <Bot size={12} />
                                    WIKI ESI
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {patient.age} th / {patient.gender} |
                                {patient.anthropometrics && ` ${patient.anthropometrics.height}cm / ${patient.anthropometrics.weight}kg`}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Tiba di IGD</p>
                        <p className="font-mono text-sm">{formatTime(patient.arrivalTime)}</p>
                    </div>
                </div>

                {/* Chief Complaint */}
                <div className="mt-3 bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-500 relative z-10">
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1">KELUHAN UTAMA</p>
                    <p className="text-sm italic text-slate-700 dark:text-slate-300">"{patient.complaint}"</p>
                </div>

                {/* Symptoms */}
                <div className="mt-3 relative z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">GEJALA</p>
                    <div className="flex flex-wrap gap-1">
                        {patient.medicalData?.symptoms?.map((s, i) => (
                            <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-200 dark:border-slate-700">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* S.A.M.P.L.E Cito Anamnesis — unlocks after triage */}
            {triageValidation && (
                <SampleAnamnesis patient={patient} />
            )}

            {/* Triage Assessment */}
            {
                !triageValidation && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50">
                        <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} />
                            Tentukan Level Triase
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(TRIAGE_LEVELS).map(([level, info]) => (
                                <button
                                    key={level}
                                    onClick={() => setTriageSelection(parseInt(level))}
                                    className={`p-2 rounded border-2 text-left transition-all ${triageSelection === parseInt(level)
                                        ? `${info.borderColor} ${info.color} ${info.badgeTextColor || 'text-white'}`
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <span className="font-bold text-sm">{info.name}</span>
                                    <p className={`text-xs ${triageSelection === parseInt(level) ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {info.desc}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleTriageSubmit}
                            disabled={triageSelection === null}
                            className="mt-3 w-full py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                        >
                            Konfirmasi Triase
                        </button>

                        {/* ESI Reference Guide */}
                        <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800/50">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">Panduan ESI (Emergency Severity Index)</p>
                                <button
                                    onClick={() => openWiki('esi_overview')}
                                    className="text-[10px] font-bold text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 underline"
                                >
                                    Apa itu ESI?
                                </button>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(ESI_LEVELS).map(([level, info]) => (
                                    <div
                                        key={level}
                                        onClick={() => openWiki(`esi_${level}`)}
                                        className="flex gap-2 items-start group cursor-help hover:bg-amber-100/50 dark:hover:bg-amber-900/20 p-1 rounded transition-all"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-[9px] font-black px-1.5 py-0.5 rounded min-w-[20px] text-center group-hover:bg-amber-300 dark:group-hover:bg-amber-700 transition-colors">T{level}</span>
                                            <Info size={10} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-tight">
                                            <span className="font-bold">{info.name.split(': ')[1]}:</span> {info.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Triage Result */}
            {
                triageValidation && (
                    <div className={`p-4 rounded-lg border ${triageValidation.isCorrect ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'}`}>
                        <p className={`font-bold ${triageValidation.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {triageValidation.feedback}
                        </p>
                        <div className="text-xs mt-1 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            Triase yang benar: <TriageBadge level={triageValidation.correctLevel} esiLevel={triageValidation.triageLevelInfo?.esiLevel} size="sm" />
                        </div>
                    </div>
                )
            }

            {/* Working Diagnosis - appears after triage */}
            {
                triageValidation && (
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-900/50">
                        <h3 className="font-bold text-purple-800 dark:text-purple-400 flex items-center gap-2 mb-2">
                            <FileText size={16} />
                            Working Diagnosis (Diagnosis Kerja)
                        </h3>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded border border-purple-100 dark:border-purple-800">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                                {patient.hidden?.diagnosis || patient.medicalData?.diagnosis || patient.medicalData?.diagnosisName || 'Belum ditentukan'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                ICD-10: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{patient.hidden?.icd10 || patient.medicalData?.icd10 || patient.medicalData?.trueDiagnosisCode || '-'}</span>
                            </p>
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-500 mt-2 italic">
                            💡 Diagnosis kerja berdasarkan anamnesis dan pemeriksaan awal. Akan dikonfirmasi setelah stabilisasi.
                        </p>
                    </div>
                )
            }

            {/* Vital Signs (expandable) — Dynamic: colors react to performed stabilization actions */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <button
                    onClick={() => setShowVitals(!showVitals)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Heart size={16} className="text-red-500" />
                        Tanda Vital (Monitor)
                        {performedActions.length > 0 && <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
                    </h3>
                    <ArrowRight size={16} className={`transform transition-transform dark:text-slate-500 ${showVitals ? 'rotate-90' : ''}`} />
                </button>

                {showVitals && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        {vitals.bp && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">TD</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 transition-colors duration-500">{vitals.bp}</p>
                            </div>
                        )}
                        {vitals.hr && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Nadi</p>
                                <p className={`font-bold transition-colors duration-500 ${vitals.hr < 60 || vitals.hr > 100 ? 'text-red-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>{vitals.hr}x/m</p>
                            </div>
                        )}
                        {vitals.rr && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">RR</p>
                                <p className={`font-bold transition-colors duration-500 ${vitals.rr < 12 || vitals.rr > 24 ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}>{vitals.rr}x/m</p>
                            </div>
                        )}
                        {vitals.temp && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Suhu</p>
                                <p className={`font-bold transition-colors duration-500 ${vitals.temp > 38 || vitals.temp < 36 ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {vitals.temp}°C
                                </p>
                            </div>
                        )}
                        {vitals.spo2 && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">SpO2</p>
                                <p className={`font-bold transition-colors duration-500 ${vitals.spo2 < 92 ? 'text-red-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {vitals.spo2}%
                                </p>
                            </div>
                        )}
                        {vitals.gds && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400">GDS</p>
                                <p className={`font-bold transition-colors duration-500 ${vitals.gds < 70 || vitals.gds > 200 ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {vitals.gds} mg/dL
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stabilization Checklist */}
            {
                triageValidation && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/50">
                        <h3 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-3">
                            <Zap size={16} />
                            Tindakan Stabilisasi
                        </h3>
                        <div className="space-y-2">
                            {(patient.hidden?.stabilizationChecklist || []).map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleAction(action)}
                                    className={`w-full p-2 rounded border text-left text-sm flex items-center gap-2 transition-all ${performedActions.includes(action)
                                        ? 'bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {performedActions.includes(action)
                                        ? <CheckCircle size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        : <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded flex-shrink-0" />
                                    }
                                    <span className="dark:text-slate-200 flex-1">{EMERGENCY_ACTIONS[action]?.name || action.replace(/_/g, ' ')}</span>
                                    {PROC_WIKI_MAP[action] && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openWiki(PROC_WIKI_MAP[action]);
                                            }}
                                            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors text-blue-400 hover:text-blue-600"
                                            title="Info Wiki"
                                        >
                                            <Info size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleValidateStabilization}
                            className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                            Validasi Stabilisasi
                        </button>

                        {stabilizationValidation && (
                            <div className={`mt-2 p-2 rounded text-sm border ${stabilizationValidation.score >= 80 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                }`}>
                                {stabilizationValidation.feedback} (Skor: {stabilizationValidation.score}%)
                                {stabilizationValidation.missing?.length > 0 && (
                                    <p className="text-amber-700 dark:text-amber-400 text-xs mt-1 font-bold">
                                        ⚠️ Perlu ditindaklanjuti: {stabilizationValidation.missing.join(', ')}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Patient Status - after stabilization */}
                        {stabilizationValidation && (
                            <div className="mt-3 bg-white dark:bg-slate-900 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                                    <Activity size={16} />
                                    Status Pasien Saat Ini
                                </h4>
                                {(() => {
                                    const status = calculatePatientStatus(
                                        stabilizationValidation.score,
                                        triageValidation?.isCorrect,
                                        performedActions.length,
                                        patient.hidden?.stabilizationChecklist?.length || 0
                                    );
                                    return (
                                        <div className={`p-3 rounded-lg ${status.bgColor} dark:bg-opacity-20 border`}>
                                            <p className={`font-bold text-lg ${status.color}`}>
                                                {status.icon} {status.label}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {status.description}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Billing Rekap - Real-time during stabilization */}
                        <div className="mt-4 bg-slate-800 text-white p-4 rounded-lg shadow-inner border-2 border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
                                    <FileText size={14} />
                                    Rekap Biaya IGD
                                </h4>
                                <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${patient.social?.hasBPJS ? 'bg-green-600' : 'bg-slate-600'}`}>
                                    {patient.social?.hasBPJS ? 'BPJS' : 'UMUM'}
                                </span>
                            </div>
                            {(() => {
                                const bill = calculateEmergencyBill(performedActions, patient.social?.hasBPJS, triageSelection || patient.triageLevel);
                                return (
                                    <div className="space-y-1.5 font-mono text-xs">
                                        <div className="flex justify-between border-b border-white/10 pb-1">
                                            <span className="text-slate-400">Pendaftaran (IGD)</span>
                                            <span>Rp {bill.pendaftaran.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-1">
                                            <span className="text-slate-400">Jasa Medis</span>
                                            <span>Rp {bill.jasaMedis.toLocaleString()}</span>
                                        </div>
                                        {bill.actionDetails.length > 0 && bill.actionDetails.map((a, idx) => (
                                            <div key={idx} className="flex justify-between text-[10px] opacity-80">
                                                <span className="truncate pr-4">• {a.name}</span>
                                                <span>Rp {a.cost.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between pt-2 text-sm font-bold border-t border-white/30 text-emerald-400">
                                            <span>Total</span>
                                            <span>Rp {bill.total.toLocaleString()}</span>
                                        </div>

                                        {/* Insurance Feedback */}
                                        <div className={`mt-3 p-2 rounded text-[10px] leading-relaxed border ${bill.isCovered
                                            ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-200'
                                            : patient.social?.hasBPJS
                                                ? 'bg-rose-900/50 border-rose-500/50 text-rose-200'
                                                : 'bg-slate-700 border-slate-600 text-slate-300'
                                            }`}>
                                            <p className="font-bold flex items-center gap-1 uppercase tracking-tighter">
                                                {bill.isCovered ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                                {bill.coverageType}
                                            </p>
                                            {!bill.isCovered && patient.social?.hasBPJS && (
                                                <p className="mt-1 opacity-80">
                                                    ⚠️ Pasien Triase Hijau (Non-Emergency) tidak dijamin BPJS di IGD. Pasien harus membayar mandiri atau diarahkan ke Poli Umum.
                                                </p>
                                            )}
                                            {bill.isCovered && (
                                                <p className="mt-1 opacity-80">
                                                    ✅ Kondisi gawat darurat (Merah/Kuning) terjamin sepenuhnya oleh BPJS.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-between pt-1 text-base font-black text-white">
                                            <span className="uppercase tracking-tighter">Tagihan Final</span>
                                            <span>Rp {bill.finalBill.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Differential Diagnosis - after stabilization */}
                        {stabilizationValidation && (() => {
                            const differentials = patient.hidden?.differentialDiagnosis || getEmergencyCase(patient.hidden?.diseaseId)?.differentialDiagnosis;

                            if (!differentials) return null;

                            return (
                                <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                    <h4 className="font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-2 mb-2">
                                        <Stethoscope size={16} />
                                        Diagnosis Banding (Differential Diagnosis)
                                    </h4>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-500 mb-2 italic">
                                        Pertimbangkan diagnosis lain yang mungkin sebelum merujuk:
                                    </p>
                                    <div className="space-y-1">
                                        {differentials.map((dx, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded border border-indigo-100 dark:border-indigo-800">
                                                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                                                <span className="text-slate-700 dark:text-slate-300">{dx}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded text-xs text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                        <p><strong>📋 Untuk Surat Rujukan:</strong></p>
                                        <p>• Working Dx: {patient.hidden?.diagnosis || patient.medicalData?.diagnosisName || '-'}</p>
                                        <p>• DDx: {differentials.join(', ')}</p>
                                        <p>• Tindakan: {performedActions.length > 0
                                            ? performedActions.map(id => EMERGENCY_ACTIONS[id]?.name || id).join('; ')
                                            : 'Belum ada'}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )
            }

            {/* Action Buttons */}
            {
                triageValidation && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {!patient.hidden?.referralRequired && (
                                <button
                                    onClick={() => onDischarge(patient, {
                                        action: 'stabilize',
                                        triageAssigned: triageSelection,
                                        actionsPerformed: performedActions
                                    })}
                                    className="p-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex flex-col items-center gap-1"
                                >
                                    <CheckCircle size={20} />
                                    <span>Stabilisasi & Pulang</span>
                                </button>
                            )}
                            <button
                                onClick={() => onRefer(patient, {
                                    action: 'refer',
                                    isSISRUTE: true,
                                    triageAssigned: triageSelection,
                                    actionsPerformed: performedActions
                                })}
                                className={`p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex flex-col items-center gap-1 ${patient.hidden?.referralRequired ? 'col-span-2' : ''
                                    }`}
                            >
                                <ArrowRight size={20} />
                                <span>Rujuk ke RS</span>
                            </button>
                        </div>

                        {/* Delegate to MAIA Button */}
                        <button
                            onClick={() => delegateEmergencyToMaia(patient.id)}
                            className="w-full p-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 border-2 border-indigo-400"
                        >
                            <Bot size={20} />
                            <span>Serahkan ke Dr. MAIA</span>
                            <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded">-5 Reputasi</span>
                        </button>
                    </div>
                )
            }
        </div>
    );

}
