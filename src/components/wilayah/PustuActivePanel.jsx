/**
 * @reflection
 * [IDENTITY]: PustuActivePanel.jsx — "BUKU KIA PINK"
 * [PURPOSE]: Active Pustu/Polindes clinical station for ANC (Antenatal Care).
 *            Wires PregnancyEngine for K1-K4 visits, risk scoring, and KB counseling.
 * [MECHANICS]:
 *    - Triage: Choose which ibu hamil to examine (AP-limited)
 *    - ANC Visit: Select checks from checklist, engine scores completeness
 *    - Risk Assessment: Player identifies risk factors from vital signs
 *    - KB Counseling: Post-partum contraception recommendation (optional)
 * [STATE]: P0 Engine Integration — WIRED
 * [ANCHOR]: PustuActivePanel
 * [DEPENDS_ON]: PregnancyEngine
 * [LAST_UPDATE]: 2026-03-10
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
    Activity, Heart, ShieldAlert, CheckCircle2, AlertTriangle,
    X, ClipboardList, ThermometerSnowflake, Stethoscope, Baby
} from 'lucide-react';

import {
    createANCPatient,
    simulateANCVisit,
    evaluateRiskFactors,
    processKBCounseling,
    ANC_VISITS,
    RISK_FACTORS,
    KB_METHODS
} from '../../game/kia/PregnancyEngine.js';
import { chanceFromSeed } from '../../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// 🎨 KINETIC CSS (Reused from PosyanduActivePanel)
// ═══════════════════════════════════════════════════════════════
const KINETIC_CSS = `
    @keyframes bc-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-1deg); } 75% { transform: translateX(5px) rotate(1deg); } }
    @keyframes stamp-hit { 0% { opacity: 0; transform: scale(3.5) rotate(var(--rot, -10deg)); filter: blur(5px); } 100% { opacity: 0.95; transform: scale(1) rotate(var(--rot, -10deg)); filter: blur(0px); } }
    .bc-shake { animation: bc-shake 0.35s cubic-bezier(.36,.07,.19,.97) both; }
    .stamp-hit { animation: stamp-hit 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; mix-blend-mode: multiply; }
    .paper-texture { background-color: #f6f4eb; }
    .kia-pink { background-color: #fdf2f8; border-left: 12px solid #be185d; }
    .blueprint-grid { background-size: 20px 20px; background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px); }
    .btn-med { border-bottom-width: 5px; transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-med:active:not(:disabled) { border-bottom-width: 0px; transform: translateY(5px); box-shadow: none !important; }
`;

// ═══════════════════════════════════════════════════════════════
// 🗄️ ANC CHECK OPTIONS (Player selects which to perform)
// ═══════════════════════════════════════════════════════════════
const ANC_CHECKS = [
    { id: 'berat_badan', label: 'Timbang Berat Badan', icon: '⚖️', time: 1 },
    { id: 'tekanan_darah', label: 'Ukur Tekanan Darah', icon: '🩺', time: 1 },
    { id: 'tinggi_fundus', label: 'Ukur Tinggi Fundus Uteri', icon: '📏', time: 1 },
    { id: 'denyut_jantung_janin', label: 'Dengar DJJ (Doppler)', icon: '💓', time: 2 },
    { id: 'hb', label: 'Cek Hemoglobin', icon: '🩸', time: 2 },
    { id: 'golongan_darah', label: 'Cek Golongan Darah', icon: '🅰️', time: 2 },
    { id: 'protein_urin', label: 'Tes Protein Urin', icon: '🧪', time: 2 },
    { id: 'gds', label: 'Gula Darah Sewaktu', icon: '🍬', time: 2 },
    { id: 'hiv', label: 'Rapid Test HIV', icon: '🔬', time: 3 },
    { id: 'hbsag', label: 'Tes HBsAg', icon: '🧫', time: 2 },
    { id: 'sifilis', label: 'Tes Sifilis (RPR)', icon: '🔎', time: 2 },
    { id: 'letak_janin', label: 'Palpasi Leopold (Letak Janin)', icon: '👶', time: 2 },
    { id: 'rencana_persalinan', label: 'Rencana Persalinan (P4K)', icon: '📋', time: 1 },
];

// Demo patients for standalone testing
const DEMO_PATIENTS = [
    { id: 'p1', name: 'Ibu Sari', age: 28 },
    { id: 'p2', name: 'Ibu Wati', age: 37 },
    { id: 'p3', name: 'Ibu Lina', age: 19 },
];

// ═══════════════════════════════════════════════════════════════
// 🏥 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PustuActivePanel({ onClose, onComplete }) {
    const [phase, setPhase] = useState('triage'); // triage → anc → risk → kb → report
    const [ap, setAp] = useState(2);
    const [shake, setShake] = useState(false);

    const [activePatient, setActivePatient] = useState(null);
    const [selectedChecks, setSelectedChecks] = useState([]);
    const [visitType, setVisitType] = useState('K1');
    const [sessionLog, setSessionLog] = useState([]);
    const [visitResult, setVisitResult] = useState(null);
    const [riskResult, setRiskResult] = useState(null);
    const [selectedKB, setSelectedKB] = useState(null);

    // Create ANC patients from demo data
    const [queue, setQueue] = useState(() =>
        DEMO_PATIENTS.map(p => createANCPatient(p))
    );

    // ─── Computed scores ───
    const totalXP = useMemo(() => sessionLog.reduce((sum, log) => sum + (log.score || 0), 0), [sessionLog]);
    const malpracticeCount = useMemo(() => sessionLog.filter(l => l.score < 40).length, [sessionLog]);
    const repDelta = useMemo(() => malpracticeCount > 0 ? -(malpracticeCount * 10) : sessionLog.length * 5, [malpracticeCount, sessionLog]);

    // ─── TRIAGE ──────────────────────────────────────────
    const handleExamine = (patient) => {
        if (ap <= 0) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        setAp(p => p - 1);
        setActivePatient(patient);
        setSelectedChecks([]);
        setVisitResult(null);
        setRiskResult(null);
        setSelectedKB(null);

        // Determine visit type based on gestational week
        const gw = patient.ancData?.gestationalWeek || 8;
        if (gw <= 12) setVisitType('K1');
        else if (gw <= 27) setVisitType('K2');
        else if (gw <= 35) setVisitType('K3');
        else setVisitType('K4');

        setPhase('anc');
    };

    const handleDelegateKader = (patient) => {
        const isError = chanceFromSeed(`pustu-kader:${patient.id}`, 0.25);
        setSessionLog(prev => [...prev, {
            patient, handler: 'Bidan Desa',
            score: isError ? 15 : 30,
            feedback: isError
                ? 'Bidan desa melewatkan pemeriksaan penting. Risiko kehamilan tidak terdeteksi!'
                : 'Bidan desa melakukan pemeriksaan standar. Catatan OK.'
        }]);
        setQueue(q => q.filter(p => p.id !== patient.id));
    };

    // ─── ANC CHECK TOGGLE ──────────────────────────────────
    const toggleCheck = (checkId) => {
        setSelectedChecks(prev =>
            prev.includes(checkId) ? prev.filter(c => c !== checkId) : [...prev, checkId]
        );
    };

    const submitANC = () => {
        if (selectedChecks.length < 3) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        const result = simulateANCVisit(activePatient, visitType, { checksPerformed: selectedChecks });
        setVisitResult(result);
        setPhase('risk');
    };

    // ─── RISK ASSESSMENT ──────────────────────────────────
    const [selectedRisks, setSelectedRisks] = useState([]);

    const toggleRisk = (riskId) => {
        setSelectedRisks(prev =>
            prev.includes(riskId) ? prev.filter(r => r !== riskId) : [...prev, riskId]
        );
    };

    const submitRisk = () => {
        const result = evaluateRiskFactors(activePatient, { ...visitResult?.newParams });
        setRiskResult(result);

        // Check if KB counseling applicable (K4 or high parity)
        const anc = activePatient.ancData || {};
        if (visitType === 'K4' || anc.parity >= 3) {
            setPhase('kb');
        } else {
            finalizeVisit(result);
        }
    };

    // ─── KB COUNSELING ──────────────────────────────────
    const submitKB = () => {
        let kbRes = null;
        if (selectedKB) {
            kbRes = processKBCounseling(activePatient, selectedKB);
        }
        finalizeVisit(riskResult, kbRes);
    };

    // ─── FINALIZE ──────────────────────────────────────────
    const finalizeVisit = useCallback((riskRes, kbRes = null) => {
        const visitScore = visitResult?.score || 0;
        const riskScore = riskRes?.accuracy || 0;
        const totalScore = Math.round((visitScore * 0.6 + riskScore * 0.4));

        setSessionLog(prev => [...prev, {
            patient: activePatient,
            handler: 'Dokter',
            visitType,
            checksPerformed: selectedChecks,
            visitResult,
            riskResult: riskRes,
            kbResult: kbRes,
            score: totalScore,
            events: visitResult?.events || [],
            feedback: totalScore >= 70 ? 'Pemeriksaan ANC lengkap dan sesuai standar.' :
                totalScore >= 40 ? 'Beberapa pemeriksaan penting terlewat.' :
                    'Pemeriksaan sangat tidak lengkap. Risiko kehamilan tidak teridentifikasi!'
        }]);

        setQueue(q => q.filter(p => p.id !== activePatient.id));
        setActivePatient(null);
        setSelectedRisks([]);
        setPhase('triage');
    }, [activePatient, visitType, selectedChecks, visitResult]);

    const activePhase = queue.length === 0 && phase === 'triage' && sessionLog.length > 0
        ? 'report'
        : phase;

    const essentialChecks = ANC_VISITS[visitType]?.essentialChecks || [];

    // ═══════════════════════════════════════════════════════════════
    // 🖥️ RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans pointer-events-none">
            <style dangerouslySetInnerHTML={{ __html: KINETIC_CSS }} />
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto" onClick={activePhase === 'report' ? onClose : undefined} />

            <div className={`w-full max-w-5xl h-[85vh] flex flex-col pointer-events-auto relative z-10 animate-in zoom-in-95 duration-500 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden bg-[#0A0D14] ${shake ? 'bc-shake' : ''}`}>

                {/* HEADER */}
                {activePhase !== 'report' && (
                    <div className="bg-[#121824]/90 backdrop-blur-xl border-b border-white/10 p-5 shrink-0 flex justify-between items-center relative z-20">
                        <div className="absolute inset-0 blueprint-grid opacity-20" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-pink-950 border border-pink-800 rounded-xl flex items-center justify-center text-pink-400 shadow-inner">
                                <Heart size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <div className="font-mono text-[9px] text-pink-400 tracking-[0.3em] uppercase mb-0.5 flex items-center gap-2 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> PUSTU / POLINDES
                                </div>
                                <h2 className="text-white font-black text-xl uppercase tracking-widest leading-none">PELAYANAN KIA · BUKU PINK</h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            {activePhase === 'triage' && (
                                <div className="bg-black/50 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-4 shadow-inner">
                                    <div className="text-right">
                                        <div className="font-mono text-[9px] text-amber-500 font-bold tracking-widest uppercase">Kapasitas Dokter (AP)</div>
                                        <div className="flex gap-1 mt-1.5 justify-end">
                                            {[0, 1].map(i => (
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

                {/* BODY */}
                <div className="flex-1 relative flex overflow-hidden">

                    {/* ════ TRIAGE ════ */}
                    {activePhase === 'triage' && (
                        <div className="w-full h-full p-8 overflow-y-auto blueprint-grid flex flex-col items-center bg-[#151b24]">
                            <div className="max-w-3xl w-full">
                                <div className="border-l-4 border-pink-500 pl-4 mb-8">
                                    <h3 className="text-white font-black text-2xl uppercase tracking-widest">Antrian Ibu Hamil</h3>
                                    <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mt-1">AP Terbatas. Prioritaskan Kehamilan Risiko Tinggi. Delegasi = 25% Error.</p>
                                </div>

                                <div className="space-y-4">
                                    {queue.map((patient, idx) => (
                                        <div key={patient.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg animate-in slide-in-from-bottom-4 group hover:border-pink-800 transition-colors" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-pink-950 border-2 border-pink-800 flex items-center justify-center text-pink-400 shadow-inner">
                                                    <Stethoscope size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg uppercase tracking-wider">{patient.name}</h4>
                                                    <div className="text-slate-400 text-[10px] font-mono uppercase tracking-widest mt-1 flex gap-3">
                                                        <span>Usia {patient.age} th</span>
                                                        <span>G{patient.ancData?.gravida}P{patient.ancData?.parity}A{patient.ancData?.abortus}</span>
                                                        <span>UK {patient.ancData?.gestationalWeek} mg</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                                <button onClick={() => handleDelegateKader(patient)} className="flex-1 sm:flex-none px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:border-slate-500 flex items-center justify-center gap-2 btn-med border-b-slate-900">
                                                    <Baby size={14} /> Bidan (0 AP)
                                                </button>
                                                <button onClick={() => handleExamine(patient)} disabled={ap <= 0}
                                                    className={`flex-1 sm:flex-none px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 btn-med ${ap > 0 ? 'bg-pink-700 text-white border-pink-500 border-b-pink-900 hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-slate-800 text-slate-600 border-slate-700 border-b-slate-900 cursor-not-allowed'}`}>
                                                    <Activity size={14} /> Periksa (-1 AP)
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {ap <= 0 && queue.length > 0 && (
                                    <div className="mt-8 p-4 bg-red-950/40 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400 animate-pulse">
                                        <AlertTriangle size={20} className="shrink-0" />
                                        <p className="text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                                            <strong>CRITICAL:</strong> Tenaga Dokter Habis. Sisa wajib didelegasikan ke Bidan Desa.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ════ ANC EXAMINATION ════ */}
                    {activePhase === 'anc' && activePatient && (
                        <div className="w-full h-full flex animate-in slide-in-from-right-8 bg-[#1e232d]">
                            {/* Buku KIA Pink — Patient Info */}
                            <div className="flex-[3] p-8 overflow-y-auto">
                                <div className="kia-pink rounded shadow-xl border border-pink-300 p-6 mb-6 transform rotate-[0.5deg]">
                                    <h3 className="font-serif text-pink-900 font-bold text-xl uppercase tracking-widest mb-2">KARTU IBU — {visitType}</h3>
                                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-pink-800 uppercase tracking-widest">
                                        <div>Nama: <b>{activePatient.name}</b></div>
                                        <div>Usia: <b>{activePatient.age} tahun</b></div>
                                        <div>G{activePatient.ancData?.gravida}P{activePatient.ancData?.parity}A{activePatient.ancData?.abortus}</div>
                                        <div>UK: <b>{activePatient.ancData?.gestationalWeek} minggu</b></div>
                                        <div>HPL: <b>{activePatient.ancData?.edd}</b></div>
                                        <div>BB Awal: <b>{activePatient.ancData?.weightStart} kg</b></div>
                                        <div>TB: <b>{activePatient.ancData?.height} cm</b></div>
                                        <div>BMI: <b>{activePatient.ancData?.bmi}</b></div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                                    <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                                        <ClipboardList size={16} className="text-pink-400" /> PILIH PEMERIKSAAN
                                    </h4>
                                    <p className="text-slate-400 text-[9px] font-mono uppercase tracking-widest mb-4">
                                        Centang pemeriksaan yang diperlukan untuk {ANC_VISITS[visitType]?.label}. Pemeriksaan wajib yang terlewat = skor turun.
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {ANC_CHECKS.map(check => {
                                            const isEssential = essentialChecks.includes(check.id);
                                            const isSelected = selectedChecks.includes(check.id);
                                            return (
                                                <button key={check.id} onClick={() => toggleCheck(check.id)}
                                                    className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all font-mono text-xs ${isSelected ? 'bg-pink-950/50 border-pink-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-pink-600 border-pink-400' : 'border-slate-600'}`}>
                                                        {isSelected && <CheckCircle2 size={14} />}
                                                    </span>
                                                    <span>{check.icon}</span>
                                                    <span className="flex-1 uppercase tracking-widest font-bold">{check.label}</span>
                                                    {isEssential && <span className="text-[8px] bg-pink-900 text-pink-300 px-1.5 py-0.5 rounded uppercase font-bold">Wajib {visitType}</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Submit panel */}
                            <div className="w-72 border-l border-slate-700 p-6 flex flex-col bg-slate-900/80 z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                                <div className="mb-6">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Stethoscope size={16} className="text-pink-400" /> {ANC_VISITS[visitType]?.label}
                                    </h3>
                                    <p className="text-slate-400 text-[9px] font-mono mt-2 uppercase tracking-widest leading-relaxed">
                                        Wajib: {essentialChecks.length} pemeriksaan<br />
                                        Dipilih: {selectedChecks.length}
                                    </p>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="bg-black/40 p-3 rounded-lg border border-slate-800 mb-4">
                                        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2">Kelengkapan</div>
                                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-pink-600 to-pink-400 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedChecks.length / essentialChecks.length) * 100)}%` }} />
                                        </div>
                                        <div className="font-mono text-[9px] text-right mt-1 text-slate-400">{selectedChecks.filter(c => essentialChecks.includes(c)).length}/{essentialChecks.length} wajib</div>
                                    </div>

                                    <button onClick={submitANC} disabled={selectedChecks.length < 3}
                                        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest btn-med ${selectedChecks.length >= 3 ? 'bg-pink-700 text-white border-pink-500 border-b-pink-900' : 'bg-slate-800 text-slate-600 border-slate-700 border-b-slate-900 cursor-not-allowed'}`}>
                                        SAHKAN PEMERIKSAAN →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════ RISK ASSESSMENT ════ */}
                    {activePhase === 'risk' && activePatient && (
                        <div className="w-full h-full p-8 overflow-y-auto bg-[#1e232d] animate-in slide-in-from-right-8 flex flex-col items-center">
                            <div className="max-w-3xl w-full">
                                <div className="border-l-4 border-amber-500 pl-4 mb-6">
                                    <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert size={20} className="text-amber-500" /> ASESMEN RISIKO KEHAMILAN
                                    </h3>
                                    <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mt-1">
                                        Identifikasi faktor risiko dari data pemeriksaan. Salah tanda = risiko tidak terdeteksi.
                                    </p>
                                </div>

                                {/* Visit result summary */}
                                {visitResult && (
                                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
                                        <div className="font-mono text-[9px] text-pink-400 uppercase tracking-widest mb-2 font-bold">Hasil Pemeriksaan {visitType}</div>
                                        <div className="text-slate-300 text-xs font-mono">{visitResult.feedback}</div>
                                        {visitResult.events?.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {visitResult.events.map((evt, i) => (
                                                    <div key={i} className="bg-amber-950/40 border border-amber-500/30 rounded p-2 text-amber-300 text-[10px] font-mono">
                                                        ⚠️ {evt.label}: {evt.description}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Risk factor checklist */}
                                <div className="space-y-2 mb-6">
                                    {Object.entries(RISK_FACTORS).map(([key, factor]) => (
                                        <button key={key} onClick={() => toggleRisk(key)}
                                            className={`w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all font-mono text-xs ${selectedRisks.includes(key) ? 'bg-red-950/50 border-red-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedRisks.includes(key) ? 'bg-red-600 border-red-400' : 'border-slate-600'}`}>
                                                {selectedRisks.includes(key) && <CheckCircle2 size={14} />}
                                            </span>
                                            <span className="flex-1 uppercase tracking-widest font-bold">{factor.label}</span>
                                            <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Bobot: {factor.weight}</span>
                                        </button>
                                    ))}
                                </div>

                                <button onClick={submitRisk}
                                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest btn-med bg-amber-600 text-white border-amber-400 border-b-amber-800">
                                    KONFIRMASI ASESMEN RISIKO →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ════ KB COUNSELING ════ */}
                    {activePhase === 'kb' && activePatient && (
                        <div className="w-full h-full p-8 overflow-y-auto bg-[#1e232d] animate-in slide-in-from-right-8 flex flex-col items-center">
                            <div className="max-w-3xl w-full">
                                <div className="border-l-4 border-emerald-500 pl-4 mb-6">
                                    <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-2">
                                        <Heart size={20} className="text-emerald-400" /> KONSELING KB PASCA SALIN
                                    </h3>
                                    <p className="text-slate-400 font-mono text-[10px] tracking-widest uppercase mt-1">
                                        Rekomendasikan metode KB berdasarkan profil pasien. Perhatikan kontraindikasi.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {Object.entries(KB_METHODS).map(([key, method]) => (
                                        <button key={key} onClick={() => setSelectedKB(key)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedKB === key ? 'bg-emerald-950/50 border-emerald-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-white font-bold text-sm uppercase tracking-widest">{method.name}</span>
                                                <span className="font-mono text-[10px] bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded">{method.effectiveness}% efektif</span>
                                            </div>
                                            <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                                                Durasi: {method.duration} | Efek samping: {method.sideEffects.length > 0 ? method.sideEffects.join(', ') : 'minimal'}
                                            </div>
                                            {method.contraindications.length > 0 && (
                                                <div className="font-mono text-[9px] text-red-400 uppercase tracking-widest mt-1">
                                                    ⚠ Kontraindikasi: {method.contraindications.join(', ')}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => { setSelectedKB(null); finalizeVisit(riskResult); }}
                                        className="flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest btn-med bg-slate-800 text-slate-400 border-slate-700 border-b-slate-900">
                                        LEWATI KB
                                    </button>
                                    <button onClick={submitKB} disabled={!selectedKB}
                                        className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest btn-med ${selectedKB ? 'bg-emerald-600 text-white border-emerald-400 border-b-emerald-800' : 'bg-slate-800 text-slate-600 border-slate-700 border-b-slate-900 cursor-not-allowed'}`}>
                                        KONSELING KB →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════ REPORT ════ */}
                    {activePhase === 'report' && (
                        <div className="flex flex-col h-full w-full bg-[#EAE6DF] paper-texture p-6 sm:p-10 text-slate-900 overflow-y-auto scrollbar-hide relative animate-in zoom-in-95 duration-500">
                            <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded-sm shadow-2xl border border-slate-300 relative transform rotate-[1deg]">
                                <div className="text-center mb-6 border-b-2 border-pink-800/30 pb-4">
                                    <h3 className="text-slate-600 font-serif text-[10px] uppercase tracking-[0.4em] mb-1 font-bold">Kementerian Kesehatan RI</h3>
                                    <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest font-serif">AUDIT MUTU PELAYANAN KIA</h2>
                                </div>

                                <div className="space-y-4 font-mono text-xs text-slate-800 relative z-10">
                                    {sessionLog.map((log, i) => (
                                        <div key={i} className={`bg-slate-50 p-4 border-l-4 shadow-sm rounded flex flex-col gap-1.5 ${log.score < 40 ? 'border-red-600' : log.score < 70 ? 'border-amber-500' : 'border-emerald-500'}`}>
                                            <div className="flex justify-between font-bold text-slate-900 uppercase">
                                                <span>{log.patient.name} <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded ml-1">{log.handler}</span></span>
                                                <span className={log.score >= 70 ? 'text-emerald-600' : log.score >= 40 ? 'text-amber-600' : 'text-red-600'}>
                                                    Skor: {log.score}/100
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-600">{log.feedback}</div>
                                            {log.visitType && <div className="text-[9px] text-pink-600 font-bold">{ANC_VISITS[log.visitType]?.label} · {(log.checksPerformed || []).length} pemeriksaan</div>}
                                            {log.events?.length > 0 && log.events.map((evt, j) => (
                                                <div key={j} className="text-[9px] text-amber-700 bg-amber-50 p-1 rounded">⚠️ {evt.label}</div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t-2 border-pink-800/30 flex justify-between items-center">
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <div className="font-black text-2xl text-emerald-700">+{totalXP}</div>
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">XP Medis</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`font-black text-2xl ${repDelta >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{repDelta >= 0 ? '+' : ''}{repDelta}</div>
                                            <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">Reputasi</div>
                                        </div>
                                    </div>
                                    <button onClick={() => { onComplete?.({ sessionLog, totalXP, repDelta, malpracticeCount }); onClose?.(); }}
                                        className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded shadow-xl hover:bg-slate-800 btn-med border-b-black">
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
