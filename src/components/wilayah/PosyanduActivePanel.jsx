/**
 * @reflection
 * [IDENTITY]: PosyanduActivePanel.jsx — "TACTILE MED-PUNK"
 * [PURPOSE]: Active clinical station for Posyandu. Kills passive "click-to-read".
 *            Wires GrowthChartEngine (Meja 2) & ImmunizationEngine (Meja 5).
 * [MECHANICS]:
 *    - Triage: Limited AP (2). Choose who to treat vs delegate to Kader (20% error).
 *    - Meja 2 (KMS): Visual diagnosis of WHO curves. Physical rubber stamp classification.
 *    - Meja 5 (Imunisasi): Buku KIA evaluation. Cold chain vial selection & injection.
 * [STATE]: P0 Engine Integration — WIRED
 * [ANCHOR]: PosyanduActivePanel
 * [DEPENDS_ON]: GrowthChartEngine, ImmunizationEngine
 * [LAST_UPDATE]: 2026-03-10
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Activity, Scale, ClipboardList, ShieldAlert, CheckCircle2,
    AlertTriangle, Users, ThermometerSnowflake, X, Baby, Syringe
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// 🔌 REAL ENGINE WIRING
// ═══════════════════════════════════════════════════════════════
import {
    plotGrowthPoint,
    detectGrowthFaltering,
    generateKMSData,
    calculateNutritionStatus
} from '../../game/kia/GrowthChartEngine.js';
import {
    getVaccineSchedule,
    processImmunization
} from '../../game/kia/ImmunizationEngine.js';

// ═══════════════════════════════════════════════════════════════
// 🎨 MED-PUNK TACTILE CSS
// ═══════════════════════════════════════════════════════════════
const KINETIC_CSS = `
    @keyframes bc-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-1deg); } 75% { transform: translateX(5px) rotate(1deg); } }
    @keyframes stamp-hit { 0% { opacity: 0; transform: scale(3.5) rotate(var(--rot, -10deg)); filter: blur(5px); } 100% { opacity: 0.95; transform: scale(1) rotate(var(--rot, -10deg)); filter: blur(0px); } }
    @keyframes crt-flicker { 0% { opacity: 0.9; } 50% { opacity: 1; } 100% { opacity: 0.95; } }

    .bc-shake { animation: bc-shake 0.35s cubic-bezier(.36,.07,.19,.97) both; }
    .stamp-hit { animation: stamp-hit 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; mix-blend-mode: multiply; }

    .paper-texture { background-color: #f6f4eb; box-shadow: 2px 4px 15px rgba(0,0,0,0.4); }
    .kia-pink { background-color: #fdf2f8; border-left: 12px solid #be185d; }
    .cold-chain-glass { background: rgba(14, 165, 233, 0.05); backdrop-filter: blur(8px); border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: inset 0 0 40px rgba(2, 132, 199, 0.2); }
    .vial-glass { background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(4px); box-shadow: inset 0 0 10px rgba(255,255,255,0.5); }
    .blueprint-grid { background-size: 20px 20px; background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px); }

    .btn-med { border-bottom-width: 5px; transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-med:active:not(:disabled) { border-bottom-width: 0px; transform: translateY(5px); box-shadow: none !important; }
`;

// ═══════════════════════════════════════════════════════════════
// 🗄️ STAMPS & VIALS (Aligned with real engine IDs)
// ═══════════════════════════════════════════════════════════════
const STAMPS = {
    gizi_baik:       { label: 'GIZI BAIK',       color: 'text-emerald-700 border-emerald-700', rot: '-5deg' },
    weight_faltering:{ label: 'TIDAK NAIK (T)',   color: 'text-amber-600 border-amber-600',    rot: '4deg' },
    gizi_kurang:     { label: 'GIZI KURANG',      color: 'text-orange-600 border-orange-600',  rot: '-8deg' },
    stunting:        { label: 'STUNTING',          color: 'text-red-700 border-red-700',        rot: '6deg' }
};

// Aligned with VACCINE_SCHEDULE IDs from ImmunizationEngine.js
const VIALS = [
    { id: 'bcg',               name: 'BCG',           color: 'bg-emerald-500/80', cap: 'bg-emerald-200' },
    { id: 'polio1',            name: 'Polio 1 (OPV)', color: 'bg-pink-500/80',    cap: 'bg-pink-200' },
    { id: 'polio2',            name: 'Polio 2 (OPV)', color: 'bg-pink-400/80',    cap: 'bg-pink-200' },
    { id: 'dpt_hb_hib1',      name: 'DPT-HB-HiB 1', color: 'bg-amber-500/80',   cap: 'bg-amber-200' },
    { id: 'dpt_hb_hib2',      name: 'DPT-HB-HiB 2', color: 'bg-amber-400/80',   cap: 'bg-amber-200' },
    { id: 'dpt_hb_hib3',      name: 'DPT-HB-HiB 3', color: 'bg-amber-300/80',   cap: 'bg-amber-200' },
    { id: 'campak_rubella1',   name: 'MR/Campak 1',   color: 'bg-purple-500/80',  cap: 'bg-purple-200' },
    { id: 'ipv1',              name: 'IPV 1',         color: 'bg-sky-500/80',     cap: 'bg-sky-200' },
    { id: 'tunda',             name: 'TUNDA VAKSIN',  color: 'bg-slate-500/50 border-dashed border-2', cap: 'hidden' }
];

// ═══════════════════════════════════════════════════════════════
// 🗄️ DEMO QUEUE (replaced by real VillageRegistry data at runtime)
// ═══════════════════════════════════════════════════════════════
const DEMO_QUEUE = [
    { id: 'b1', name: 'Bayi Rina',  ageMonths: 9,  gender: 'P', weight: 6.8,  height: 68, completedVaccines: ['hb0', 'bcg', 'polio1', 'polio2', 'polio3', 'dpt_hb_hib1', 'dpt_hb_hib2', 'dpt_hb_hib3'], growthHistory: [{ ageMonths: 6, weight: 6.9 }, { ageMonths: 7, weight: 6.8 }, { ageMonths: 8, weight: 6.8 }], complaint: 'Ibunya bilang BB anaknya tidak naik 2 bulan terakhir' },
    { id: 'b2', name: 'Bayi Budi',  ageMonths: 2,  gender: 'L', weight: 5.6,  height: 57, completedVaccines: ['hb0', 'bcg'], growthHistory: [{ ageMonths: 0, weight: 3.3 }, { ageMonths: 1, weight: 4.5 }], complaint: 'Ibu bawa untuk timbang rutin' },
    { id: 'b3', name: 'Bayi Citra', ageMonths: 14, gender: 'P', weight: 6.2,  height: 61, completedVaccines: ['hb0', 'bcg', 'polio1', 'polio2', 'polio3', 'polio4', 'dpt_hb_hib1', 'dpt_hb_hib2', 'dpt_hb_hib3', 'campak_rubella1'], growthHistory: [{ ageMonths: 9, weight: 5.9 }, { ageMonths: 12, weight: 6.1 }, { ageMonths: 13, weight: 6.2 }], complaint: 'Anaknya kecil, makan susah kata ibunya' },
    { id: 'b4', name: 'Bayi Doni',  ageMonths: 4,  gender: 'L', weight: 6.2,  height: 62, completedVaccines: ['hb0', 'bcg', 'polio1', 'polio2', 'dpt_hb_hib1'], growthHistory: [{ ageMonths: 2, weight: 4.8 }, { ageMonths: 3, weight: 5.5 }], complaint: 'Ibunya tanya jadwal suntik berikutnya' }
];

// ═══════════════════════════════════════════════════════════════
// 📊 KMS CHART (SVG from real engine data)
// ═══════════════════════════════════════════════════════════════
function KMSChart({ baby }) {
    const kmsData = useMemo(() => generateKMSData({
        gender: baby.gender,
        growthHistory: [...(baby.growthHistory || []), { ageMonths: baby.ageMonths, weight: baby.weight }]
    }), [baby]);

    const maxAge = 60;
    const maxWeight = 25;
    const toX = (age) => (age / maxAge) * 100;
    const toY = (weight) => 100 - (weight / maxWeight) * 100;

    const lineToPath = (points) => points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${toX(p.age).toFixed(1)},${toY(p.weight).toFixed(1)}`
    ).join(' ');

    const { referenceLines, actualPoints } = kmsData;
    const faltering = detectGrowthFaltering(baby.growthHistory || []);

    return (
        <div className="w-full aspect-video bg-white border-2 border-slate-600 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 blueprint-grid opacity-20" />

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                {/* WHO Z-score bands */}
                {referenceLines.minus3.length > 0 && (
                    <>
                        {/* Red zone: below -3SD */}
                        <path d={`${lineToPath(referenceLines.minus3)} L 100,100 L 0,100 Z`} fill="#fecaca" opacity="0.5" />
                        {/* Yellow zone: -3SD to -2SD */}
                        <path d={`${lineToPath(referenceLines.minus2)} L ${lineToPath([...referenceLines.minus3].reverse()).replace('M', 'L')} Z`} fill="#fef08a" opacity="0.5" />
                        {/* Green zone: -2SD to +2SD */}
                        <path d={`${lineToPath(referenceLines.plus2)} L ${lineToPath([...referenceLines.minus2].reverse()).replace('M', 'L')} Z`} fill="#bbf7d0" opacity="0.4" />
                    </>
                )}
                {/* Median line */}
                <path d={lineToPath(referenceLines.median)} fill="none" stroke="#16a34a" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.7" />
                {/* -2SD line */}
                <path d={lineToPath(referenceLines.minus2)} fill="none" stroke="#eab308" strokeWidth="0.3" opacity="0.5" />
                {/* -3SD line */}
                <path d={lineToPath(referenceLines.minus3)} fill="none" stroke="#ef4444" strokeWidth="0.3" opacity="0.5" />
            </svg>

            {/* Actual data points from engine */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10 overflow-visible">
                {/* Growth curve line */}
                {actualPoints.length > 1 && (
                    <polyline
                        points={actualPoints.map(p => `${toX(p.age).toFixed(1)},${toY(p.weight).toFixed(1)}`).join(' ')}
                        fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2"
                    />
                )}
                {/* Data points */}
                {actualPoints.map((p, i) => (
                    <circle key={i} cx={toX(p.age).toFixed(1)} cy={toY(p.weight).toFixed(1)} r={i === actualPoints.length - 1 ? "2.5" : "1.5"} fill={i === actualPoints.length - 1 ? "#ef4444" : "#0f172a"} />
                ))}
                {/* Pulse on current point */}
                {actualPoints.length > 0 && (
                    <circle cx={toX(actualPoints[actualPoints.length - 1].age).toFixed(1)} cy={toY(actualPoints[actualPoints.length - 1].weight).toFixed(1)} r="6" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" />
                )}
                {/* Faltering warning line */}
                {faltering.isFlat && actualPoints.length >= 2 && (
                    <line
                        x1={toX(actualPoints[actualPoints.length - 2].age)} y1={toY(actualPoints[actualPoints.length - 2].weight)}
                        x2={toX(actualPoints[actualPoints.length - 1].age)} y2={toY(actualPoints[actualPoints.length - 1].weight)}
                        stroke="#ef4444" strokeWidth="2" className="animate-pulse"
                    />
                )}
            </svg>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🏥 MAIN COMPONENT: PosyanduActivePanel
// ═══════════════════════════════════════════════════════════════
export default function PosyanduActivePanel({ initialBabies, onClose, onComplete }) {
    const [queue, setQueue] = useState(initialBabies || DEMO_QUEUE);
    const [ap, setAp] = useState(2);
    const [phase, setPhase] = useState('triage'); // triage -> meja2 -> meja5 -> report

    const [activeBaby, setActiveBaby] = useState(null);
    const [sessionLog, setSessionLog] = useState([]);
    const [shake, setShake] = useState(false);

    // Clinical states
    const [kmsStamp, setKmsStamp] = useState(null);
    const [kmsLocked, setKmsLocked] = useState(false);
    const [drawnVaccine, setDrawnVaccine] = useState(null);
    const [injectedSlot, setInjectedSlot] = useState(null);

    // ─── Computed scores ───
    const totalXP = useMemo(() => sessionLog.reduce((sum, log) => {
        if (log.handler === 'Kader') return sum + (log.malpractice ? 0 : 10);
        const kmsXP = log.kmsResult?.isCorrect ? 40 : 5;
        const vaxXP = log.vaxResult?.success ? (log.vaxResult?.xp || 20) : 0;
        return sum + kmsXP + vaxXP;
    }, 0), [sessionLog]);

    const malpracticeCount = useMemo(() => sessionLog.filter(l => l.malpractice).length, [sessionLog]);
    const repDelta = useMemo(() => malpracticeCount > 0 ? -(malpracticeCount * 15) : sessionLog.length * 5, [malpracticeCount, sessionLog]);

    // ─── TRIAGE ──────────────────────────────────────────
    const handleManualExamine = (baby) => {
        if (ap <= 0) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        setAp(p => p - 1);
        setActiveBaby(baby);
        setKmsStamp(null);
        setKmsLocked(false);
        setDrawnVaccine(null);
        setInjectedSlot(null);
        setPhase('meja2');
    };

    const handleDelegateKader = (baby) => {
        const isError = Math.random() < 0.2;
        setSessionLog(prev => [...prev, {
            baby, handler: 'Kader',
            malpractice: isError,
            feedback: isError
                ? 'Kader salah interpretasi kurva KMS. Kasus berisiko lolos tanpa intervensi!'
                : 'Kader melayani dengan standar dasar. Pencatatan OK.'
        }]);
        setQueue(q => q.filter(b => b.id !== baby.id));
    };

    // ─── MEJA 2: KMS STAMP ────────────────────────────────
    const handleStampKMS = useCallback((stampKey) => {
        if (kmsLocked) return;
        setKmsStamp(stampKey);
        setKmsLocked(true);
    }, [kmsLocked]);

    const submitKMS = () => {
        if (!kmsStamp) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        setPhase('meja5');
    };

    // ─── MEJA 5: IMUNISASI ──────────────────────────────
    const handleDrawVaccine = (vial) => {
        if (injectedSlot) return;
        setDrawnVaccine(vial);
        if (vial.id === 'tunda') setInjectedSlot('tunda');
    };

    const handleInjectSlot = (vaccineId) => {
        if (!drawnVaccine || injectedSlot || drawnVaccine.id === 'tunda') return;
        setInjectedSlot(vaccineId);
    };

    const submitImunisasi = () => {
        if (!drawnVaccine) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        if (drawnVaccine.id !== 'tunda' && !injectedSlot) { setShake(true); setTimeout(() => setShake(false), 300); return; }

        // ── Engine validation ──
        const growthResult = plotGrowthPoint(
            { ageMonths: activeBaby.ageMonths, gender: activeBaby.gender },
            { weight: activeBaby.weight, height: activeBaby.height }
        );
        const falterResult = detectGrowthFaltering(activeBaby.growthHistory || []);

        let actualCategory = growthResult.category;
        if (falterResult.isFlat && actualCategory === 'gizi_baik') actualCategory = 'weight_faltering';
        if (falterResult.isFalling) actualCategory = actualCategory === 'gizi_baik' ? 'weight_faltering' : actualCategory;

        const isKmsCorrect = kmsStamp === actualCategory;

        let vaxResult;
        if (drawnVaccine.id === 'tunda') {
            vaxResult = { success: true, feedback: 'Vaksinasi ditunda oleh dokter.', xp: 5 };
        } else {
            vaxResult = processImmunization(
                { ...activeBaby, ageMonths: activeBaby.ageMonths, completedVaccines: activeBaby.completedVaccines || [] },
                drawnVaccine.id,
                Date.now()
            );
        }

        setSessionLog(prev => [...prev, {
            baby: activeBaby,
            handler: 'Dokter',
            kmsResult: { player: kmsStamp, actual: actualCategory, isCorrect: isKmsCorrect },
            vaxResult: { player: drawnVaccine.id, ...vaxResult },
            malpractice: !isKmsCorrect || !vaxResult.success
        }]);

        setKmsStamp(null);
        setKmsLocked(false);
        setDrawnVaccine(null);
        setInjectedSlot(null);
        setActiveBaby(null);
        setQueue(q => q.filter(b => b.id !== activeBaby.id));
        setPhase('triage');
    };

    // Auto-advance to report when queue empty
    useEffect(() => {
        if (queue.length === 0 && phase === 'triage' && sessionLog.length > 0) setPhase('report');
    }, [queue, phase, sessionLog]);

    // ═══════════════════════════════════════════════════════════════
    // 🖥️ RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans pointer-events-none">
            <style dangerouslySetInnerHTML={{ __html: KINETIC_CSS }} />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto" onClick={phase === 'report' ? onClose : undefined} />

            <div className={`w-full max-w-5xl h-[85vh] flex flex-col pointer-events-auto relative z-10 animate-in zoom-in-95 duration-500 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden bg-[#0A0D14] ${shake ? 'bc-shake' : ''}`}>

                {/* 🪟 HEADER */}
                {phase !== 'report' && (
                    <div className="bg-[#121824]/90 backdrop-blur-xl border-b border-white/10 p-5 shrink-0 flex justify-between items-center relative z-20">
                        <div className="absolute inset-0 blueprint-grid opacity-20" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-cyan-950 border border-cyan-800 rounded-xl flex items-center justify-center text-cyan-400 shadow-inner">
                                <Activity size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <div className="font-mono text-[9px] text-cyan-400 tracking-[0.3em] uppercase mb-0.5 flex items-center gap-2 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> POSYANDU AKTIF
                                </div>
                                <h2 className="text-white font-black text-xl uppercase tracking-widest leading-none">LAYANAN MEJA 2 & 5</h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            {phase === 'triage' && (
                                <div className="bg-black/50 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-4 shadow-inner">
                                    <div className="text-right">
                                        <div className="font-mono text-[9px] text-amber-500 font-bold tracking-widest uppercase">Kapasitas Dokter (AP)</div>
                                        <div className="flex gap-1 mt-1.5 justify-end">
                                            {[0, 1].map((i) => (
                                                <div key={i} className={`w-4 h-2.5 rounded-sm border ${i < ap ? 'bg-amber-400 border-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'bg-slate-800 border-slate-700 opacity-50'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-600 border border-slate-700 hover:border-rose-500 transition-all flex items-center justify-center btn-med border-b-slate-900">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 📜 BODY */}
                <div className="flex-1 relative flex overflow-hidden">

                    {/* ════ TRIAGE ════ */}
                    {phase === 'triage' && (
                        <div className="w-full h-full p-8 overflow-y-auto blueprint-grid flex flex-col items-center bg-[#151b24]">
                            <div className="max-w-3xl w-full">
                                <div className="border-l-4 border-cyan-500 pl-4 mb-8">
                                    <h3 className="text-white font-black text-2xl uppercase tracking-widest">Meja 1: Pendaftaran & Triase</h3>
                                    <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mt-1">AP Terbatas. Prioritaskan Pasien Berisiko. Delegasi Kader = 20% Error Rate.</p>
                                </div>

                                <div className="space-y-4">
                                    {queue.map((baby, idx) => (
                                        <div key={baby.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg animate-in slide-in-from-bottom-4 group hover:border-cyan-800 transition-colors" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
                                                    <Baby size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg uppercase tracking-wider">{baby.name}</h4>
                                                    <div className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1 flex gap-3">
                                                        <span>{baby.ageMonths} Bulan</span>
                                                        <span>{baby.gender === 'L' ? '♂' : '♀'}</span>
                                                    </div>
                                                    {/* Neutral complaint — NO diagnosis hint */}
                                                    <p className="text-slate-500 text-[10px] font-mono mt-1.5 italic normal-case tracking-wide">"{baby.complaint}"</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                                <button onClick={() => handleDelegateKader(baby)} className="flex-1 sm:flex-none px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:border-slate-500 flex items-center justify-center gap-2 btn-med border-b-slate-900">
                                                    <Users size={14} /> Kader (0 AP)
                                                </button>
                                                <button onClick={() => handleManualExamine(baby)} disabled={ap <= 0}
                                                    className={`flex-1 sm:flex-none px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 btn-med ${ap > 0 ? 'bg-cyan-600 text-white border-cyan-400 border-b-cyan-800 hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,148,235,0.3)]' : 'bg-slate-800 text-slate-600 border-slate-700 border-b-slate-900 cursor-not-allowed'}`}>
                                                    <Activity size={14} /> Periksa (-1 AP)
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {ap <= 0 && queue.length > 0 && (
                                    <div className="mt-8 p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 animate-pulse">
                                        <AlertTriangle size={20} className="shrink-0" />
                                        <div className="text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                                            <strong>CRITICAL:</strong> Tenaga Dokter Habis. Sisa pasien wajib didelegasikan ke Kader.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ════ MEJA 2: KMS ════ */}
                    {phase === 'meja2' && activeBaby && (
                        <div className="w-full h-full flex animate-in slide-in-from-right-8 bg-[#1e232d]">
                            {/* Kertas KMS */}
                            <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #0f172a 10px, #0f172a 20px)' }} />

                                <div className="w-full max-w-md paper-texture border border-slate-300 p-6 flex flex-col transform rotate-[-1deg] relative z-10 rounded">
                                    <div className="border-b-2 border-slate-800 pb-2 mb-5 flex justify-between items-end">
                                        <div>
                                            <h3 className="font-serif text-2xl font-black text-slate-900 uppercase tracking-tighter">Kartu Menuju Sehat</h3>
                                            <p className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">GRAFIK PERTUMBUHAN WHO · {activeBaby.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-[10px] font-bold text-slate-800 bg-amber-100 border border-amber-300 px-2 py-0.5 mb-1">BB: {activeBaby.weight} kg</div>
                                            <div className="font-mono text-[9px] text-slate-500 font-bold uppercase">{activeBaby.name} · {activeBaby.ageMonths} bln</div>
                                        </div>
                                    </div>

                                    {/* Real KMS chart from engine */}
                                    <KMSChart baby={activeBaby} />
                                    <p className="text-center font-mono text-[8px] text-slate-500 uppercase font-bold mt-2">Analisis tren grafik. Salah diagnosis = pasien kehilangan intervensi gizi.</p>

                                    {/* Stamp overlay */}
                                    {kmsStamp && (
                                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                                            <div className={`px-6 py-2 border-[5px] rounded-lg font-black text-3xl tracking-widest uppercase bg-white/60 backdrop-blur-[2px] stamp-hit ${STAMPS[kmsStamp].color}`} style={{ '--rot': STAMPS[kmsStamp].rot }}>
                                                {STAMPS[kmsStamp].label}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stamp buttons */}
                            <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20">
                                <div className="mb-6">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <ClipboardList size={18} className="text-amber-500" /> DIAGNOSIS GIZI
                                    </h3>
                                    <p className="text-slate-400 text-[10px] font-mono mt-2 leading-relaxed uppercase">Baca grafik lalu pilih stempel.<br />Tidak ada auto-reveal!</p>
                                </div>
                                <div className="space-y-3 flex-1">
                                    {Object.entries(STAMPS).map(([key, data]) => (
                                        <button key={key} disabled={kmsLocked} onClick={() => handleStampKMS(key)}
                                            className={`w-full py-4 border-2 rounded-xl font-black text-xs tracking-[0.15em] transition-all bg-slate-950 btn-med shadow-inner
                                                ${kmsLocked ? 'opacity-40 cursor-not-allowed border-slate-800 border-b-slate-950' : `hover:bg-slate-800 border-slate-700 border-b-slate-950 hover:border-opacity-80`}
                                                ${kmsStamp === key ? `${data.color} border-current` : data.color.split(' ')[0]}`}>
                                            [ {data.label} ]
                                        </button>
                                    ))}
                                </div>
                                <button onClick={submitKMS} disabled={!kmsStamp}
                                    className={`w-full mt-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest btn-med transition-all ${kmsStamp ? 'bg-cyan-600 text-white border-cyan-400 border-b-cyan-800' : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'}`}>
                                    SAHKAN & LANJUT MEJA 5 →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════ MEJA 5: IMUNISASI ════ */}
                    {phase === 'meja5' && activeBaby && (
                        <div className="w-full h-full flex animate-in slide-in-from-right-8 bg-[#1e232d]">
                            {/* Buku KIA Pink */}
                            <div className="flex-[3] p-8 flex items-center justify-center relative">
                                <div className="absolute inset-0 opacity-10 blueprint-grid pointer-events-none" />
                                <div className="w-full max-w-lg kia-pink rounded shadow-[5px_20px_50px_rgba(0,0,0,0.6)] border border-pink-300 relative flex transform rotate-1 flex-col p-8 z-10">
                                    <div className="border-b-2 border-pink-800/20 pb-2 mb-6 text-center">
                                        <h4 className="font-serif text-pink-900 font-bold text-2xl uppercase tracking-widest">CATATAN IMUNISASI K.I.A</h4>
                                        <p className="font-mono text-[10px] text-pink-700 font-bold tracking-widest uppercase mt-1">NAMA: {activeBaby.name} | USIA: {activeBaby.ageMonths} BLN</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 content-start flex-1">
                                        {VIALS.filter(v => v.id !== 'tunda').map(vial => {
                                            const isDone = (activeBaby.completedVaccines || []).includes(vial.id);
                                            const isInjected = injectedSlot === vial.id;
                                            return (
                                                <div key={vial.id}
                                                    onClick={() => drawnVaccine && drawnVaccine.id !== 'tunda' && !isDone && handleInjectSlot(vial.id)}
                                                    className={`border-2 p-3 rounded h-16 relative flex items-center transition-all cursor-pointer
                                                        ${isDone ? 'border-emerald-300 bg-emerald-50/70' :
                                                        isInjected ? 'border-blue-400 bg-blue-50' :
                                                        drawnVaccine && drawnVaccine.id !== 'tunda' ? 'border-cyan-400 bg-cyan-50 border-dashed animate-pulse hover:bg-cyan-100' :
                                                        'border-dashed border-pink-300 bg-white/60'}`}
                                                >
                                                    <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${isDone ? 'text-emerald-800' : 'text-slate-500'}`}>{vial.name}</span>
                                                    {isDone && <div className="absolute inset-0 flex items-center justify-center text-emerald-600 font-black text-2xl transform -rotate-12 mix-blend-multiply opacity-70">✔</div>}
                                                    {isInjected && <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-xl transform -rotate-[15deg] stamp-hit opacity-90" style={{ '--rot': '-15deg' }}>✓ SUNTIK</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Cold Chain */}
                            <div className="w-80 border-l border-slate-700 p-6 flex flex-col cold-chain-glass z-20 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                                <div className="mb-6 border-b border-sky-800/50 pb-4">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
                                        <ThermometerSnowflake size={18} className="text-cyan-400" /> VACCINE COLD CHAIN
                                    </h3>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="text-cyan-100/60 text-[9px] font-mono uppercase tracking-widest leading-relaxed">Suhu: 2.0°C - 8.0°C<br />Salah vaksin = KIPI!</p>
                                        <div className="bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono text-[10px] font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]">4.5°C</div>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-3 content-start overflow-y-auto scrollbar-hide">
                                    {VIALS.map(vial => (
                                        <button key={vial.id} onClick={() => handleDrawVaccine(vial)} disabled={!!injectedSlot}
                                            className={`relative ${vial.id === 'tunda' ? 'col-span-2 h-12 border-dashed' : 'h-24'} rounded-xl border-2 flex flex-col items-center justify-end pb-2 transition-all shadow-lg btn-med
                                            ${drawnVaccine?.id === vial.id ? 'bg-cyan-950 border-cyan-400 border-b-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105' : 'bg-[#0b0f19] border-slate-700 border-b-slate-900 hover:border-slate-500'}`}>
                                            {vial.id !== 'tunda' && (
                                                <div className="absolute top-2 w-6 h-10 vial-glass rounded-b-md rounded-t-sm border border-white/20 flex flex-col items-center overflow-hidden">
                                                    <div className={`h-2 w-full ${vial.cap}`} />
                                                    <div className={`flex-1 ${vial.color} w-full mt-1 opacity-90`} />
                                                    <div className="absolute left-0.5 top-0.5 bottom-0.5 w-0.5 bg-white/40 rounded-full" />
                                                </div>
                                            )}
                                            <span className={`relative z-10 font-mono text-[8px] font-bold uppercase tracking-widest px-1 text-center ${vial.id !== 'tunda' ? 'mt-10' : ''} ${drawnVaccine?.id === vial.id ? 'text-cyan-400' : 'text-slate-400'}`}>{vial.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-sky-900/50">
                                    <button onClick={submitImunisasi} disabled={!drawnVaccine || (drawnVaccine.id !== 'tunda' && !injectedSlot)}
                                        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 btn-med transition-all ${(drawnVaccine && (injectedSlot || drawnVaccine.id === 'tunda')) ? 'bg-blue-600 text-white border-blue-400 border-b-blue-800 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-900 text-slate-600 border-slate-800 border-b-slate-950 cursor-not-allowed'}`}>
                                        <Syringe size={16} /> SELESAIKAN EXAM
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════ REPORT ════ */}
                    {phase === 'report' && (
                        <div className="flex flex-col h-full w-full bg-[#EAE6DF] paper-texture p-6 sm:p-10 text-slate-900 overflow-y-auto scrollbar-hide relative animate-in zoom-in-95 duration-500">
                            <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-sm shadow-2xl border border-slate-300 relative transform rotate-[1deg]">
                                <div className="text-center mb-6 border-b-2 border-slate-800/30 pb-4">
                                    <h3 className="text-slate-600 font-serif text-[10px] uppercase tracking-[0.4em] mb-1 font-bold">Kementerian Kesehatan RI</h3>
                                    <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest font-serif">AUDIT MUTU POSYANDU</h2>
                                </div>

                                <div className="space-y-4 font-mono text-xs text-slate-800 relative z-10">
                                    <p className="font-bold border-b border-slate-400 border-dashed pb-1 uppercase tracking-widest text-[10px] text-slate-500">Log Rekam Medis:</p>

                                    {sessionLog.map((log, i) => {
                                        const isDokter = log.handler === 'Dokter';
                                        return (
                                            <div key={i} className={`bg-slate-50 p-4 border-l-4 shadow-sm rounded flex flex-col gap-1.5 ${log.malpractice ? 'border-red-600' : 'border-emerald-500'}`}>
                                                <div className="flex justify-between font-bold text-slate-900 uppercase">
                                                    <span>{log.baby.name} <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded ml-1 tracking-widest">{log.handler}</span></span>
                                                    <span className={log.malpractice ? 'text-red-600' : 'text-emerald-600'}>{log.malpractice ? 'MALPRAKTIK / ERROR' : 'SESUAI SOP'}</span>
                                                </div>

                                                {!isDokter ? (
                                                    <div className={`text-[10px] mt-1 ${log.malpractice ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{log.feedback}</div>
                                                ) : (
                                                    <div className="text-[10px] text-slate-700 space-y-1 mt-1 pl-2 border-l-2 border-slate-300">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Diagnosis KMS:</span>
                                                            <b className={!log.kmsResult.isCorrect ? 'text-red-600' : 'text-emerald-700'}>
                                                                {STAMPS[log.kmsResult.player]?.label || '-'} {log.kmsResult.isCorrect ? ' (TEPAT)' : ` ❌ Harusnya: ${STAMPS[log.kmsResult.actual]?.label || log.kmsResult.actual}`}
                                                            </b>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Vaksinasi:</span>
                                                            <b className={!log.vaxResult.success ? 'text-red-600' : 'text-emerald-700'}>
                                                                {VIALS.find(v => v.id === log.vaxResult.player)?.name || 'Ditunda'} {!log.vaxResult.success ? ' (KIPI Risk!)' : ' (AMAN)'}
                                                            </b>
                                                        </div>
                                                        {log.vaxResult.feedback && (
                                                            <div className={`mt-1 text-[9px] italic ${!log.vaxResult.success ? 'text-red-600' : 'text-slate-500'}`}>{log.vaxResult.feedback}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {malpracticeCount > 0 && (
                                        <div className="mt-6 bg-red-100 border-2 border-red-600 p-4 rounded shadow-md transform rotate-[-1deg]">
                                            <div className="flex items-center gap-2 mb-2 text-red-800 font-black uppercase text-sm">
                                                <ShieldAlert size={18} /> LAPORAN MALPRAKTIK
                                            </div>
                                            <p className="font-serif italic text-red-900 text-xs font-semibold leading-relaxed">
                                                "{malpracticeCount} kasus malpraktik tercatat. Kesalahan diagnosis KMS menyebabkan kasus gizi buruk/stunting lolos tanpa intervensi. Kesalahan dosis vaksin memicu risiko KIPI. Reputasi Posyandu menurun."
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t-2 border-slate-800/30 flex justify-between items-center">
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <div className="font-black text-2xl text-emerald-700">+{totalXP}</div>
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">XP Medis</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`font-black text-2xl ${repDelta >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{repDelta >= 0 ? '+' : ''}{repDelta}</div>
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">Reputasi Desa</div>
                                        </div>
                                    </div>
                                    <button onClick={() => { onComplete?.({ sessionLog, totalXP, repDelta, malpracticeCount }); onClose?.(); }}
                                        className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded shadow-xl hover:bg-slate-800 btn-med border-b-black transition-all">
                                        TUTUP LOGBOOK ✖
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
