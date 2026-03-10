/**
 * @reflection
 * [IDENTITY]: BehaviorCasePanel.jsx — "TACTILE MED-PUNK (EPIDEMIOLOGY OS)"
 * [PURPOSE]: Multi-phase interactive panel for UKM Behavior Change cases.
 *            Art Direction: Birokrasi Medis Taktil — warm paper skeuomorphism
 *            meets clinical glass. Bento Box layout, mechanical buttons,
 *            polaroid evidence, typewriter text, Papers Please stamp.
 *            MERGED: DeepThink V1 (SDOH bar, macro handoff) + V2 (hover tooltips,
 *            red string SVG, typewriter narrative, paper eval, CRT scanline).
 * [STATE]: Polished
 * [ANCHOR]: BehaviorCasePanel
 * [DEPENDS_ON]: BehaviorCaseEngine, MiniGameLibrary, MiniGamePanel
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Search, Brain, CheckCircle2, AlertTriangle, X, ShieldAlert, Zap,
    Eye, HeartHandshake, Fingerprint, Activity, FileText, Crosshair,
    Microscope, Paperclip, FileSignature, Database, Info, Briefcase
} from 'lucide-react';
import {
    createBehaviorCase, advancePhase, getCurrentPhaseInfo, recordClueFound,
    scoreCOMBDiagnosis, scoreIntervention, resolveOutcome, getOutcomeNarrative
} from '../../game/BehaviorCaseEngine.js';
import { getMiniGameForScenario } from '../../game/MiniGameLibrary.js';
import { getDiseaseScenarioById, DISEASE_SCENARIOS } from '../../content/scenarios/DiseaseScenarios.js';
import MiniGamePanel from './MiniGamePanel.jsx';

// ═══════════════════════════════════════════════════════════════
// 📚 COM-B DICTIONARY (with hover-education descriptions)
// ═══════════════════════════════════════════════════════════════
const BARRIER_LABELS = {
    cap_phy: {
        label: 'Kapabilitas Fisik', icon: <Zap size={18}/>,
        desc: 'Kurangnya keterampilan fisik atau kondisi jasmani warga untuk perilaku sehat.',
        activeBtn: 'bg-blue-950/80 border-blue-500 border-b-blue-700 shadow-[0_8px_20px_rgba(59,130,246,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-blue-400 bg-blue-500/20 text-blue-400', color: 'text-blue-400',
    },
    cap_psy: {
        label: 'Kapab. Psikologis', icon: <Brain size={18}/>,
        desc: 'Kurangnya pengetahuan, literasi kesehatan, atau kapasitas kognitif mengenai penyakit.',
        activeBtn: 'bg-purple-950/80 border-purple-500 border-b-purple-700 shadow-[0_8px_20px_rgba(168,85,247,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-purple-400 bg-purple-500/20 text-purple-400', color: 'text-purple-400',
    },
    opp_phy: {
        label: 'Peluang Fisik', icon: <Search size={18}/>,
        desc: 'Hambatan infrastruktur (air, faskes, jarak), ketersediaan waktu, atau kendala finansial.',
        activeBtn: 'bg-amber-950/80 border-amber-500 border-b-amber-700 shadow-[0_8px_20px_rgba(245,158,11,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-amber-400 bg-amber-500/20 text-amber-400', color: 'text-amber-400',
    },
    opp_soc: {
        label: 'Peluang Sosial', icon: <HeartHandshake size={18}/>,
        desc: 'Pengaruh norma sosial, stigma masyarakat, budaya lokal, atau penolakan tokoh masyarakat.',
        activeBtn: 'bg-pink-950/80 border-pink-500 border-b-pink-700 shadow-[0_8px_20px_rgba(236,72,153,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-pink-400 bg-pink-500/20 text-pink-400', color: 'text-pink-400',
    },
    mot_ref: {
        label: 'Motivasi Reflektif', icon: <Eye size={18}/>,
        desc: 'Niat sadar warga. Evaluasi logis bahwa perilaku sehat "tidak penting" bagi mereka.',
        activeBtn: 'bg-cyan-950/80 border-cyan-500 border-b-cyan-700 shadow-[0_8px_20px_rgba(34,211,238,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-cyan-400 bg-cyan-500/20 text-cyan-400', color: 'text-cyan-400',
    },
    mot_aut: {
        label: 'Motivasi Otomatis', icon: <Fingerprint size={18}/>,
        desc: 'Kebiasaan impulsif yang mendarah daging, dorongan emosional, dan refleks sehari-hari.',
        activeBtn: 'bg-emerald-950/80 border-emerald-500 border-b-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.3)] scale-[1.02] z-10',
        activeIcon: 'border-emerald-400 bg-emerald-500/20 text-emerald-400', color: 'text-emerald-400',
    }
};

// ═══════════════════════════════════════════════════════════════
// 🎨 KINETIC CSS (Tactile Med-Punk + Paper Textures)
// ═══════════════════════════════════════════════════════════════
const KINETIC_CSS = `
    @keyframes bc-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px) rotate(-1deg); } 40% { transform: translateX(5px) rotate(1deg); } 60% { transform: translateX(-2px); } 80% { transform: translateX(2px); } }
    @keyframes bc-stamp { 0% { opacity: 0; transform: scale(3.5) rotate(-35deg); filter: blur(6px); } 100% { opacity: 0.95; transform: scale(1) rotate(-15deg); filter: blur(0); } }
    @keyframes bc-flashbang { 0% { opacity: 1; } 100% { opacity: 0; } }
    @keyframes crt-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

    .bc-shake { animation: bc-shake 0.35s cubic-bezier(.36,.07,.19,.97) both; }
    .bc-stamp { animation: bc-stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .bc-flashbang { animation: bc-flashbang 0.5s ease-out forwards; pointer-events: none; }

    .btn-med { border-bottom-width: 6px; transition: all 120ms cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-med:active:not(:disabled) { border-bottom-width: 0px; transform: translateY(6px); box-shadow: none !important; }

    .paper-texture { background-color: #f6f4eb; background-image: repeating-linear-gradient(transparent, transparent 23px, #E2E8F0 24px); box-shadow: inset 0 0 20px rgba(0,0,0,0.03); }
    .blueprint-grid { background-size: 20px 20px; background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px); }
`;

// ═══════════════════════════════════════════════════════════════
// 🕵️ FASE 1: INTEROGASI KLINIS (OARS Psychological Siege)
// ═══════════════════════════════════════════════════════════════
function InvestigationPhase({ caseInstance, scenario, onAdvance }) {
    const clues = scenario?.investigationClues || [];
    const [localCase, setLocalCase] = useState(caseInstance);
    const [shake, setShake] = useState(false);

    // OARS Psychological Siege state
    const [round, setRound] = useState(0);
    const [tension, setTension] = useState(70); // Starts HIGH (Defensive)
    const [logs, setLogs] = useState([]);
    const [walkOut, setWalkOut] = useState(false);

    const currentClue = clues[round];
    const defenseThreshold = currentClue?.defenseThreshold || (40 + round * 10);

    // EKG visualization
    const isCritical = tension >= 90;
    const ekgColor = tension > 75 ? '#e11d48' : tension > 50 ? '#f59e0b' : '#10b981';
    const ekgSpeed = tension > 75 ? '0.4s' : tension > 50 ? '0.8s' : '1.5s';

    const handleTactic = (type) => {
        if (walkOut || !currentClue) return;
        let tensionChange = 0;
        let logMsg = '';
        let extracted = false;

        if (type === 'EMPATI') {
            tensionChange = -30;
            logMsg = '[EMPATI] Anda memvalidasi beban warga. Tembok pertahanan turun drastis.';
        } else if (type === 'PROBE') {
            tensionChange = +15;
            if (tension <= defenseThreshold) {
                extracted = true;
                logMsg = `[KLARIFIKASI BERHASIL] Warga curhat terbuka. Bukti: "${currentClue.finding}"`;
            } else {
                logMsg = `[KLARIFIKASI DITOLAK] Warga masih terlalu defensif (Tension ${tension}% > threshold ${defenseThreshold}%).`;
                setShake(true); setTimeout(() => setShake(false), 400);
            }
        } else if (type === 'KONFRONTASI') {
            tensionChange = +45;
            logMsg = '[KONFRONTASI MEDIS] Anda menggurui warga. Mereka merasa dihakimi dan marah!';
            setShake(true); setTimeout(() => setShake(false), 400);
        }

        const newTension = Math.max(0, Math.min(100, tension + tensionChange));
        setTension(newTension);
        setLogs(p => [{ msg: logMsg, type, round }, ...p]);

        if (extracted) {
            const { case: updated } = recordClueFound(localCase, currentClue.location);
            if (updated) setLocalCase(updated);
            setTimeout(() => advanceRound(newTension), 1500);
        } else if (newTension >= 100) {
            setWalkOut(true);
        }
    };

    const advanceRound = (currentTension) => {
        if (round + 1 < clues.length) {
            setRound(r => r + 1);
            setTension(Math.min(90, currentTension + 20));
        }
    };

    const foundCount = localCase.cluesFound.length;
    const canAdvance = walkOut || round >= clues.length - 1 || foundCount >= Math.ceil(clues.length * 0.5);

    return (
        <div className={`flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 relative ${shake ? 'bc-shake bg-red-900/10 rounded-xl' : ''}`}>
            {/* HUD: PSYCHO MONITOR */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 shrink-0 mb-4">
                <div className="border-l-4 border-emerald-500 pl-3">
                    <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-2">
                        <Microscope size={20} className="text-emerald-500" /> INTEROGASI KLINIS
                    </h3>
                    <p className="text-slate-400 font-mono text-[9px] tracking-widest uppercase mt-1">O.A.R.S Motivational Interviewing</p>
                </div>

                {/* EKG Tension Meter */}
                <div className="flex items-center gap-4">
                    <div className="w-48 bg-black border border-slate-800 p-2 rounded-lg shadow-inner">
                        <div className="text-[9px] font-mono text-slate-500 tracking-widest mb-1 flex justify-between font-bold">
                            <span>RESISTENSI WARGA</span>
                            <span className={isCritical ? 'text-red-500 animate-pulse' : 'text-slate-300'}>{tension}%</span>
                        </div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden relative">
                            <div className="absolute left-0 top-0 bottom-0 transition-all duration-700 opacity-30 mix-blend-screen" style={{ width: `${tension}%`, backgroundColor: ekgColor }} />
                            <svg className="absolute inset-0 w-full h-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 20">
                                <path d="M0 10 L5 10 L10 0 L15 20 L20 10 L100 10" fill="none" stroke={ekgColor} strokeWidth="1" strokeDasharray="100" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] font-mono text-amber-500 tracking-widest uppercase font-bold">BUKTI</span>
                        <div className="text-lg font-black text-white">{foundCount}<span className="text-slate-600 text-sm">/{clues.length}</span></div>
                    </div>
                </div>
            </div>

            {/* NPC Quote */}
            {!walkOut && currentClue && (
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 relative shadow-lg transform -rotate-1 mx-1 mb-4">
                    <span className="absolute -top-3 left-4 text-[9px] font-mono text-cyan-400 bg-slate-950 border border-cyan-900 px-3 py-0.5 rounded tracking-widest uppercase">SUBJEK MENGATAKAN:</span>
                    <p className="text-lg font-serif italic text-amber-50 leading-relaxed font-medium">
                        "{currentClue.npcLine || currentClue.finding || `Saya tidak mengerti kenapa harus berubah. ${currentClue.label} itu sudah biasa.`}"
                    </p>
                    <div className="mt-2 text-[9px] font-mono text-slate-500 tracking-widest uppercase">
                        Topik {round + 1}/{clues.length} · Threshold: Tension &lt; {defenseThreshold}%
                    </div>
                </div>
            )}

            {/* Combat Logs */}
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col-reverse scrollbar-hide px-1 mb-3">
                {logs.map((l, i) => (
                    <div key={i} className={`text-[10px] font-mono p-3 rounded-lg border-l-4 shadow-sm animate-in slide-in-from-left-4 fade-in
                        ${l.type === 'EMPATI' ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300' :
                          l.type === 'KONFRONTASI' ? 'bg-red-950/30 border-red-500 text-red-300' :
                          'bg-cyan-950/30 border-cyan-500 text-cyan-300'}`}>
                        {l.msg}
                    </div>
                ))}
            </div>

            {/* Walk-Out Overlay */}
            {walkOut && (
                <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center animate-in zoom-in-95 p-8 rounded-xl">
                    <ShieldAlert size={56} className="text-red-500 mb-4 animate-bounce" />
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">WARGA MENGAMUK</h2>
                    <p className="text-red-300 font-mono text-xs max-w-md leading-relaxed mb-6">
                        Menceramahi warga yang defensif memicu "Righting Reflex". Warga menutup pintu. Anamnesis gagal.
                    </p>
                    <button onClick={() => onAdvance(localCase)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black tracking-widest uppercase btn-med border-slate-700 border-b-black hover:bg-slate-800 text-xs">
                        LANJUT DENGAN DATA TERBATAS →
                    </button>
                </div>
            )}

            {/* Tactics Deck */}
            {!walkOut && currentClue && (
                <div className="shrink-0 pt-3 border-t border-slate-800/50">
                    <div className="text-[9px] font-mono text-slate-500 tracking-[0.2em] text-center mb-2 uppercase">STRATEGI RESPON:</div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <button onClick={() => handleTactic('EMPATI')}
                            className="p-3 rounded-xl border-2 bg-emerald-950/20 border-emerald-900 hover:bg-emerald-900/50 hover:border-emerald-500 text-emerald-500 flex flex-col items-center btn-med group transition-colors border-b-emerald-950">
                            <HeartHandshake size={18} className="mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black tracking-widest">EMPATI</span>
                            <span className="text-[7px] mt-0.5 font-mono opacity-70">Tension -30%</span>
                        </button>
                        <button onClick={() => handleTactic('PROBE')}
                            className="p-3 rounded-xl border-2 bg-cyan-950/20 border-cyan-900 hover:bg-cyan-900/50 hover:border-cyan-500 text-cyan-500 flex flex-col items-center btn-med group transition-colors border-b-cyan-950">
                            <Search size={18} className="mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black tracking-widest">KLARIFIKASI</span>
                            <span className="text-[7px] mt-0.5 font-mono opacity-70">Syarat: &lt; {defenseThreshold}%</span>
                        </button>
                        <button onClick={() => handleTactic('KONFRONTASI')}
                            className="p-3 rounded-xl border-2 bg-rose-950/20 border-rose-900 hover:bg-rose-900/50 hover:border-rose-500 text-rose-500 flex flex-col items-center btn-med group transition-colors border-b-rose-950">
                            <Zap size={18} className="mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black tracking-widest">KONFRONTASI</span>
                            <span className="text-[7px] mt-0.5 font-mono opacity-70">Tension +45% ⚠️</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Advance button */}
            {!walkOut && canAdvance && foundCount > 0 && (
                <div className="shrink-0">
                    <button onClick={() => onAdvance(localCase)}
                        className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] btn-med bg-amber-500 border-amber-400 border-b-amber-700 text-slate-950 hover:bg-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.25)]">
                        BUKTI CUKUP. LANJUT SINTESIS →
                    </button>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🧠 FASE 2: DIAGNOSIS (Red String Corkboard + Hover Education)
// ═══════════════════════════════════════════════════════════════
function DiagnosisPhase({ caseInstance, scenario, onAdvance }) {
    const [selectedBarriers, setSelectedBarriers] = useState({});
    const [hoveredBarrier, setHoveredBarrier] = useState(null);
    const [shake, setShake] = useState(false);
    const allBarriers = Object.keys(BARRIER_LABELS);
    const activeCount = Object.values(selectedBarriers).filter(v => v > 0).length;
    const maxSelect = 2;

    const toggleBarrier = (id) => {
        if (!selectedBarriers[id] && activeCount >= maxSelect) { setShake(true); setTimeout(() => setShake(false), 300); return; }
        setSelectedBarriers(p => ({ ...p, [id]: p[id] ? 0 : 0.8 }));
    };

    const foundClueData = useMemo(() => caseInstance.cluesFound.map(loc => scenario.investigationClues.find(c => c.location === loc)).filter(Boolean), [caseInstance, scenario]);

    return (
        <div className={`space-y-6 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500 ${shake ? 'bc-shake' : ''}`}>

            {/* The Crazy Wall (Corkboard + Red String + Pins) */}
            <div className="relative bg-[#1a1c23] p-5 rounded-2xl border-2 border-slate-700 shadow-[inset_0_20px_60px_rgba(0,0,0,0.8)] shrink-0 overflow-hidden">
                <div className="absolute inset-0 blueprint-grid opacity-30" />

                {/* Red String SVG connecting evidence */}
                <svg className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" preserveAspectRatio="none">
                    {foundClueData.length > 1 && (
                        <path d="M 50,40 Q 150,80 250,30 T 450,70" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="animate-pulse"/>
                    )}
                </svg>

                <div className="relative z-10 flex justify-between items-center mb-3 border-b border-slate-600/50 pb-2">
                    <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                        <FileText size={14}/> PETA BUKTI EMPIRIS
                    </h4>
                </div>
                <div className="relative min-h-[100px] w-full flex flex-wrap gap-4 items-start z-10 justify-center">
                    {foundClueData.map((clue, idx) => (
                        <div key={idx} className={`relative w-[45%] ${idx % 2 === 0 ? '-rotate-3' : 'rotate-2'} transition-transform duration-300 hover:scale-125 hover:z-50 cursor-crosshair`}>
                            {/* Red Pin */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[2px_3px_5px_rgba(0,0,0,0.6)] border border-red-800 z-20">
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
                            </div>
                            <div className="paper-texture p-3 pb-4 rounded-sm shadow-[4px_6px_15px_rgba(0,0,0,0.5)] border border-slate-300 relative z-10">
                                <div className="font-mono text-[8px] text-slate-500 border-b border-slate-300 pb-1 mb-1.5 flex justify-between items-center uppercase font-bold">
                                    <span>EV-{101+idx}</span>
                                </div>
                                <p className="font-serif text-slate-900 text-[11px] leading-snug italic font-semibold line-clamp-4">&quot;{clue.finding}&quot;</p>
                            </div>
                        </div>
                    ))}
                    {foundClueData.length === 0 && (
                        <div className="w-full flex items-center justify-center py-6 bg-black/30 rounded-lg border border-dashed border-slate-700">
                            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">[ NIHIL BUKTI — ANDA MENEBAK BUTA ]</span>
                        </div>
                    )}
                </div>
            </div>

            {/* COM-B Matrix with Hover Education */}
            <div className="flex-1 flex flex-col">
                <div className="mb-3 flex justify-between items-end border-b border-white/10 pb-2">
                    <div>
                        <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none">ANALISIS DETERMINAN</h3>
                        <p className="text-slate-400 font-mono text-[9px] tracking-widest uppercase mt-1.5">Pilih <span className="text-amber-400 font-bold px-1 bg-amber-500/10 rounded">Maks {maxSelect}</span> Akar Masalah (COM-B).</p>
                    </div>
                    <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-widest bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800">[{activeCount}/{maxSelect}]</span>
                </div>

                {/* Hover Education Box — COM-B theory on demand */}
                <div className="h-[56px] mb-3 rounded-lg bg-[#0F141E] border border-slate-800 flex items-center px-4 transition-all overflow-hidden shadow-inner">
                    {hoveredBarrier ? (
                        <div className="flex gap-3 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                            <div className="text-cyan-400 bg-cyan-950/50 p-1.5 rounded-lg border border-cyan-900 shrink-0">{BARRIER_LABELS[hoveredBarrier].icon}</div>
                            <div>
                                <span className="text-[10px] font-black text-white uppercase tracking-wider block mb-0.5">{BARRIER_LABELS[hoveredBarrier].label}</span>
                                <span className="text-[10px] text-slate-400 leading-tight">{BARRIER_LABELS[hoveredBarrier].desc}</span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mx-auto animate-pulse flex items-center gap-2">
                            <Info size={14}/> Sorot klasifikasi untuk panduan teori COM-B...
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1 content-start">
                    {allBarriers.map((id, idx) => {
                        const info = BARRIER_LABELS[id];
                        const active = selectedBarriers[id] > 0;
                        const disabled = !active && activeCount >= maxSelect;
                        return (
                            <button key={id}
                                onClick={() => toggleBarrier(id)}
                                onMouseEnter={() => setHoveredBarrier(id)}
                                onMouseLeave={() => setHoveredBarrier(null)}
                                disabled={disabled}
                                style={{ animationDelay: `${idx * 40}ms` }}
                                className={`
                                    relative p-3 text-left transition-all duration-200 border rounded-2xl animate-in zoom-in-95 fill-mode-backwards btn-med group
                                    ${active ? info.activeBtn
                                        : disabled ? 'bg-slate-950 border-slate-900 border-b-slate-950 opacity-40 grayscale cursor-not-allowed'
                                        : 'bg-[#121824] border-slate-700 border-b-slate-900 hover:bg-slate-800 hover:border-slate-500'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-inner shrink-0 ${active ? info.activeIcon : 'border-slate-700 bg-[#0A0F18] text-slate-500 group-hover:text-slate-300'}`}>
                                        {info.icon}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider leading-tight ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                        {info.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="shrink-0 pt-2 border-t border-slate-800/50">
                <button onClick={() => onAdvance(scoreCOMBDiagnosis(caseInstance, selectedBarriers))} disabled={activeCount === 0}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] btn-med transition-all ${activeCount > 0
                        ? 'bg-cyan-600 border-cyan-400 border-b-cyan-800 text-white hover:bg-cyan-500 shadow-[0_10px_30px_rgba(8,148,235,0.4)] flex justify-center items-center gap-2'
                        : 'bg-slate-900 border-slate-800 border-b-black text-slate-600 cursor-not-allowed'
                    }`}
                >
                    {activeCount > 0 ? <><FileSignature size={18} className="animate-pulse"/> SAHKAN DIAGNOSIS IKM</> : 'TENTUKAN PRIORITAS INTERVENSI...'}
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 FASE 3: INTERVENSI (BCW Policy War Room)
// ═══════════════════════════════════════════════════════════════
const BCT_ARSENAL = [
    { id: 'edu', label: 'Edukasi Komunitas', type: 'Education', cost: 2, trust: +5, impact: ['cap_psy', 'mot_ref'], icon: '📚' },
    { id: 'env', label: 'Bantuan Fisik/Subsidi', type: 'Env. Restructuring', cost: 6, trust: +20, impact: ['opp_phy', 'cap_phy'], icon: '🏗️' },
    { id: 'coe', label: 'Perdes/Hukuman', type: 'Coercion', cost: 1, trust: -30, impact: ['mot_aut', 'opp_soc'], icon: '⚖️' },
    { id: 'mod', label: 'Pendekatan Tokoh', type: 'Modeling', cost: 3, trust: +15, impact: ['opp_soc', 'mot_ref'], icon: '🤝' },
    { id: 'inc', label: 'Insentif Warga', type: 'Incentivisation', cost: 4, trust: +10, impact: ['mot_aut', 'mot_ref'], icon: '🎁' },
    { id: 'trn', label: 'Pelatihan Kader', type: 'Training', cost: 3, trust: +5, impact: ['cap_phy', 'cap_psy'], icon: '🎓' },
];

function InterventionPhase({ caseInstance, scenario, onAdvance }) {
    const targetBarriers = Object.keys(caseInstance.comBDiagnosis?.actual || {}).filter(k => (caseInstance.comBDiagnosis?.actual || {})[k] > 0);

    const MAX_BUDGET = 10;
    const [budget, setBudget] = useState(MAX_BUDGET);
    const [socialTrust, setSocialTrust] = useState(50);
    const [draft, setDraft] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [shake, setShake] = useState(null);

    const togglePolicy = (pol) => {
        if (submitted) return;
        const isDrafted = draft.some(p => p.id === pol.id);
        if (isDrafted) {
            setDraft(draft.filter(p => p.id !== pol.id));
            setBudget(b => b + pol.cost);
            setSocialTrust(s => s - pol.trust);
        } else {
            if (budget < pol.cost) {
                setShake(pol.id); setTimeout(() => setShake(null), 300);
                return;
            }
            setDraft([...draft, pol]);
            setBudget(b => b - pol.cost);
            setSocialTrust(s => s + pol.trust);
        }
    };

    const evaluateCoverage = () => {
        let covered = new Set();
        draft.forEach(p => p.impact.forEach(b => { if (targetBarriers.includes(b)) covered.add(b); }));
        return targetBarriers.length > 0 ? (covered.size / targetBarriers.length) * 100 : 0;
    };

    const coverage = evaluateCoverage();
    const isBackfire = socialTrust <= 20 && draft.some(p => p.type === 'Coercion');

    const handleSubmit = () => {
        setSubmitted(true);
        const finalScore = isBackfire ? 0 : Math.round(coverage);
        // Map to correct/incorrect for scoreMiniGame contract
        const correct = Math.round((finalScore / 100) * targetBarriers.length);
        const incorrect = targetBarriers.length - correct;
        setTimeout(() => {
            const best = scenario.bestInterventions?.[0];
            let scored = best ? scoreIntervention(caseInstance, best) : caseInstance;
            scored = { ...scored, interventionScore: finalScore, miniGameResult: { score: finalScore, normalized: finalScore, feedback: isBackfire ? 'BACKFIRE — Warga menolak!' : `Efikasi BCW: ${finalScore}%` } };
            onAdvance(scored);
        }, 2500);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
            {/* Header: War Room Desk */}
            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-3 shrink-0">
                <div className="border-l-4 border-purple-500 pl-3">
                    <h3 className="text-white font-black text-xl uppercase tracking-widest flex items-center gap-2">
                        <HeartHandshake className="text-purple-400" size={20} /> MEJA STRATEGI B.C.W
                    </h3>
                    <p className="text-slate-400 font-mono text-[9px] tracking-widest uppercase mt-1">Alokasi Anggaran & Kebijakan Promkes</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className={`bg-black/40 px-3 py-2 rounded-lg border border-slate-800 text-center ${budget <= 2 ? 'animate-pulse' : ''}`}>
                        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">DANA (AP)</div>
                        <div className={`text-xl font-black font-mono ${budget <= 2 ? 'text-red-400' : 'text-emerald-400'}`}>{budget}<span className="text-sm opacity-50">/{MAX_BUDGET}</span></div>
                    </div>
                    <div className={`bg-black/40 px-3 py-2 rounded-lg border border-slate-800 text-center ${socialTrust <= 20 ? 'animate-pulse' : ''}`}>
                        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">TRUST</div>
                        <div className={`text-xl font-black font-mono ${socialTrust <= 20 ? 'text-red-400' : 'text-sky-400'}`}>{socialTrust}%</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Target Barriers */}
                <div>
                    <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">DIAGNOSIS COM-B:</div>
                    <div className="flex flex-wrap gap-1.5">
                        {targetBarriers.map(b => {
                            const isHit = draft.some(p => p.impact.includes(b));
                            const info = BARRIER_LABELS[b];
                            return (
                                <span key={b} className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border-2 rounded flex items-center gap-1 transition-colors
                                    ${isHit ? `${info?.activeBtn || 'bg-emerald-950 border-emerald-500'}` : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                                    {info?.label || b} {isHit && <CheckCircle2 size={10}/>}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* BCT Arsenal */}
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
                    {BCT_ARSENAL.map(pol => {
                        const isSelected = draft.some(p => p.id === pol.id);
                        const isBroke = budget < pol.cost && !isSelected;
                        const isShaking = shake === pol.id;
                        return (
                            <button key={pol.id} onClick={() => togglePolicy(pol)} disabled={submitted || isBroke}
                                className={`w-full p-3 rounded-xl border-2 text-left transition-all btn-med flex items-center gap-3 relative
                                ${isShaking ? 'bc-shake border-rose-500 bg-rose-950/30' : ''}
                                ${isSelected ? 'bg-purple-950/60 border-purple-500 border-b-purple-800 text-white shadow-lg' :
                                  isBroke ? 'bg-slate-950 border-slate-800 border-b-slate-950 text-slate-600 opacity-40 cursor-not-allowed' :
                                  'bg-slate-800/60 border-slate-600 border-b-slate-800 hover:bg-slate-700 hover:border-purple-400/50 text-slate-300'}`}>
                                <span className="text-xl">{pol.icon}</span>
                                <div className="flex-1 pr-16">
                                    <div className="font-black text-[10px] uppercase tracking-widest leading-snug">{pol.label}</div>
                                    <div className={`text-[8px] font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>Target: {pol.impact.map(i => BARRIER_LABELS[i]?.label?.split(' ')[1] || i).join(', ')}</div>
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end gap-0.5">
                                    <div className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-purple-800 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                                        -{pol.cost} AP
                                    </div>
                                    <div className={`text-[7px] font-bold font-mono ${pol.trust < 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                                        {pol.trust > 0 ? '+' + pol.trust : pol.trust} TRST
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Efficacy + Backfire + Submit */}
                <div className="shrink-0 pt-2 border-t border-slate-800/50">
                    {isBackfire ? (
                        <div className="text-center mb-3 text-rose-400 animate-in zoom-in-95">
                            <AlertTriangle size={32} className="mx-auto mb-1 animate-pulse" />
                            <div className="font-black text-lg tracking-widest uppercase">BACKFIRE!</div>
                            <p className="font-mono text-[9px] text-rose-300 max-w-[250px] mx-auto leading-relaxed">
                                Social Trust terlalu rendah untuk Peraturan/Sanksi. Warga menolak masif!
                            </p>
                        </div>
                    ) : draft.length > 0 && (
                        <div className="text-center mb-3">
                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-1 font-bold">PROYEKSI EFIKASI</div>
                            <div className={`text-3xl font-black tracking-tighter ${coverage >= 100 ? 'text-emerald-400' : coverage > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {Math.round(coverage)}%
                            </div>
                        </div>
                    )}
                    <button onClick={handleSubmit} disabled={draft.length === 0 || submitted}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] btn-med transition-all flex justify-center items-center gap-2
                        ${submitted ? 'bg-slate-800 border-slate-700 border-b-slate-900 text-slate-500' :
                          draft.length > 0 ? 'bg-purple-600 border-purple-400 border-b-purple-800 text-white hover:bg-purple-500 shadow-[0_10px_30px_rgba(147,51,234,0.3)]' :
                          'bg-slate-900 border-slate-800 border-b-black text-slate-600 cursor-not-allowed'}`}>
                        <FileSignature size={16}/> {submitted ? 'MENGEKSEKUSI...' : 'SAHKAN KEBIJAKAN'}
                    </button>
                </div>
            </div>

            {/* Stamp on submit */}
            {submitted && !isBackfire && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="border-[5px] border-emerald-600 text-emerald-600 px-6 py-2 rounded-xl font-black text-3xl uppercase tracking-widest bc-stamp bg-white/80 backdrop-blur-[2px] mix-blend-multiply">
                        DISETUJUI
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🩸 FASE 4: EVALUASI (Paper Theme + Typewriter + Macro Handoff)
// ═══════════════════════════════════════════════════════════════
function EvaluationPhase({ caseInstance, onClose }) {
    const narrativeText = getOutcomeNarrative(caseInstance);
    const [step, setStep] = useState(0);
    const [displayScore, setDisplayScore] = useState(0);
    const [displayedNarrative, setDisplayedNarrative] = useState('');
    const targetScore = caseInstance.overallScore;

    useEffect(() => {
        const t1 = setTimeout(() => setStep(1), 500);
        const t2 = setTimeout(() => setStep(2), 1000);
        const t3 = setTimeout(() => setStep(3), 1500);
        const t4 = setTimeout(() => {
            setStep(4);
            let start = 0;
            if (targetScore === 0) { setDisplayScore(0); setStep(5); return; }
            const counter = setInterval(() => {
                start += Math.ceil((targetScore - start) / 5) + 1;
                if (start >= targetScore) { setDisplayScore(targetScore); setStep(5); clearInterval(counter); }
                else setDisplayScore(start);
            }, 30);
        }, 2200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [targetScore]);

    // Typewriter effect
    useEffect(() => {
        if (step >= 5 && narrativeText) {
            let i = 0;
            setDisplayedNarrative('');
            const interval = setInterval(() => {
                if (i < narrativeText.length) {
                    setDisplayedNarrative(prev => prev + narrativeText.charAt(i));
                    i++;
                } else clearInterval(interval);
            }, 20);
            return () => clearInterval(interval);
        }
    }, [step, narrativeText]);

    const TIERS = {
        excellent: { color: 'text-emerald-700', border: 'border-emerald-700', stamp: 'EFEKTIF', bg: 'bg-emerald-50' },
        good: { color: 'text-blue-700', border: 'border-blue-700', stamp: 'DITERIMA', bg: 'bg-blue-50' },
        partial: { color: 'text-amber-700', border: 'border-amber-700', stamp: 'PERLU REVISI', bg: 'bg-amber-50' },
        fail: { color: 'text-red-700', border: 'border-red-700', stamp: 'DITOLAK', bg: 'bg-red-50' }
    };
    const tier = TIERS[caseInstance.outcomeTier] || TIERS.partial;
    const invScore = Math.round((caseInstance.cluesFound?.length || 0) / Math.max(1, caseInstance.totalClues) * 100);

    // Macro handoff check: does the root cause need structural (Balai Desa) intervention?
    const needsMacro = caseInstance.comBDiagnosis?.actual?.opp_phy > 0.6 || caseInstance.comBDiagnosis?.actual?.opp_soc > 0.6;

    return (
        <div className={`relative flex flex-col h-full bg-[#EAE6DF] paper-texture -m-7 p-7 rounded-[28px] text-slate-900 shadow-[inset_0_0_80px_rgba(0,0,0,0.05)] overflow-hidden ${step === 5 ? 'bc-shake' : ''}`}>
            {step === 5 && <div className="absolute inset-0 bg-white z-[200] bc-flashbang" />}

            {/* Header Laporan Resmi */}
            <div className="text-center mb-5 shrink-0 border-b-2 border-slate-800/30 pb-4">
                <h3 className="text-slate-600 font-serif text-[10px] uppercase tracking-[0.4em] mb-1 font-bold">Kementerian Kesehatan RI</h3>
                <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest font-serif">LAPORAN EVALUASI UKM</h2>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-5 relative z-10 pb-20">
                {/* Tally */}
                <div className="space-y-4 font-mono text-xs tracking-widest bg-white/60 p-5 border border-slate-400 border-dashed rounded-sm">
                    {step >= 1 && (
                        <div className="flex justify-between items-end border-b border-slate-300 pb-1 animate-in slide-in-from-left-4 fade-in">
                            <span className="text-slate-600">I. Cakupan Surveilans</span><span className="text-slate-900 font-black">{invScore}%</span>
                        </div>
                    )}
                    {step >= 2 && (
                        <div className="flex justify-between items-end border-b border-slate-300 pb-1 animate-in slide-in-from-left-4 fade-in">
                            <span className="text-slate-600">II. Akurasi Akar Masalah</span><span className="text-slate-900 font-black">{caseInstance.comBDiagnosis?.score || 0}%</span>
                        </div>
                    )}
                    {step >= 3 && (
                        <div className="flex justify-between items-end animate-in slide-in-from-left-4 fade-in">
                            <span className="text-slate-600">III. Efikasi Promkes</span><span className="text-slate-900 font-black">{caseInstance.interventionScore || 0}%</span>
                        </div>
                    )}
                </div>

                {/* Score Circle + Stamp */}
                <div className="relative h-36 flex items-center justify-center mt-2">
                    {step >= 4 && (
                        <div className="relative w-32 h-32 mx-auto rounded-full bg-white border-4 border-slate-400 flex flex-col items-center justify-center z-10 shadow-sm">
                            <span className="text-6xl font-black tabular-nums tracking-tighter text-slate-800">{displayScore}</span>
                            <span className="text-[9px] font-mono text-slate-500 tracking-[0.3em] uppercase mt-1 font-bold">INDEKS TOTAL</span>
                        </div>
                    )}
                    {step >= 5 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                            <div className={`px-6 py-2 border-[5px] rounded font-black text-3xl tracking-widest uppercase transform -rotate-[15deg] mix-blend-multiply opacity-90 bc-stamp ${tier.color} ${tier.border} ${tier.bg}`}
                                 style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.7)' }}>
                                {tier.stamp}
                            </div>
                        </div>
                    )}
                </div>

                {step >= 5 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Typewriter Narrative */}
                        <div className="bg-white/50 p-4 text-[13px] text-slate-800 font-serif leading-relaxed border-l-4 border-slate-500 shadow-sm relative">
                            <span className="font-mono font-bold block mb-1 text-[9px] tracking-widest uppercase text-slate-500 border-b border-slate-300/50 pb-1">Evaluasi Pimpinan:</span>
                            <span className="italic">&quot;{displayedNarrative}&quot;</span>
                            <span className="animate-pulse bg-slate-800 w-1.5 h-3.5 inline-block ml-1 align-middle" />
                        </div>

                        {/* Macro Handoff Warning — "Bawa ke Balai Desa!" (V1) */}
                        {needsMacro && (
                            <div className="relative overflow-hidden bg-amber-100 border-l-4 border-amber-600 p-4 text-left shadow-md rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <Briefcase className="text-amber-700 shrink-0" size={22} />
                                    <div>
                                        <h4 className="text-amber-800 font-black text-[10px] uppercase tracking-widest mb-1">LIMITASI K.I.E MIKRO TERDETEKSI</h4>
                                        <p className="text-amber-900 text-xs font-medium leading-relaxed">
                                            Akar masalah struktural (Peluang Lingkungan/Sosial) tidak bisa diselesaikan hanya dengan edukasi keluarga!
                                            <br/><span className="text-amber-800 font-bold mt-1 block">→ TINDAK LANJUT: Bawa temuan ini ke Musyawarah Balai Desa untuk intervensi Makro!</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UKP Warning — IGD Consequence */}
                        {caseInstance.ukpTriggered && (
                            <div className="relative overflow-hidden bg-rose-100 border-2 border-rose-600 rounded-lg p-4 shadow-md animate-pulse">
                                <div className="absolute -right-4 -bottom-4 text-rose-500/10 font-black text-6xl rotate-[-10deg] uppercase pointer-events-none">IGD</div>
                                <div className="relative z-10 flex items-start gap-3">
                                    <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={24} />
                                    <div>
                                        <h4 className="text-rose-800 font-black text-[11px] uppercase tracking-widest mb-1">UKM GAGAL — BEBAN UKP MENINGKAT!</h4>
                                        <p className="text-rose-900 text-[11px] font-medium leading-relaxed font-mono">
                                            Upaya preventif komunitas gagal. Warga jatuh sakit dan menjadi beban IGD. Siapkan ranjang dalam <b className="bg-rose-200 px-1 rounded">{caseInstance.ukpDelayDays} Hari</b>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rewards */}
                        <div className="flex justify-center gap-3 pt-2">
                            <div className="flex-1 bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 flex flex-col items-center shadow-sm">
                                <span className="text-amber-700 font-black text-xl">+{caseInstance.xpEarned}</span>
                                <span className="text-amber-800 text-[8px] uppercase font-bold tracking-widest">XP Petugas</span>
                            </div>
                            <div className={`flex-1 border rounded-lg px-3 py-2 flex flex-col items-center shadow-sm ${caseInstance.reputationDelta >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                                <span className={`font-black text-xl ${caseInstance.reputationDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {caseInstance.reputationDelta > 0 ? '+' : ''}{caseInstance.reputationDelta}
                                </span>
                                <span className={`text-[8px] uppercase font-bold tracking-widest ${caseInstance.reputationDelta >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>Kepercayaan Warga</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Footer */}
            {step >= 5 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#EAE6DF] via-[#EAE6DF] to-transparent pt-12 z-20 animate-in slide-in-from-bottom-4 delay-500">
                    <button onClick={onClose} className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.3em] bg-slate-900 text-white btn-med border-b-slate-950 hover:bg-slate-800 shadow-xl">
                        ARSIPKAN BERKAS ✖
                    </button>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🏛️ MAIN ORCHESTRATOR (Bento Box + SDOH Bar + Evidence Handoff)
// ═══════════════════════════════════════════════════════════════
export default function BehaviorCasePanel({ building, familyData, day, onClose, onComplete }) {

    const scenarioId = useMemo(() => {
        if (familyData?.activeScenarioId) return familyData.activeScenarioId;
        const tier1 = DISEASE_SCENARIOS.filter(s => s.tier === 1);
        if (tier1.length === 0) return null;
        const charSum = (building?.familyId || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
        return tier1[(charSum + (day || 1)) % tier1.length].id;
    }, [familyData, building, day]);

    const scenario = useMemo(() => scenarioId ? getDiseaseScenarioById(scenarioId) : null, [scenarioId]);
    const [caseInstance, setCaseInstance] = useState(() => scenarioId ? createBehaviorCase(scenarioId, 'deep', day || 1, { familyId: building?.familyId, sdoh: familyData?.sdoh }) : null);

    const handleAdvance = useCallback((updatedCase) => {
        const advanced = advancePhase(updatedCase);
        if (advanced.completed) setCaseInstance(resolveOutcome(advanced));
        else setCaseInstance(advanced);
    }, []);

    const handleClose = useCallback(() => {
        if (caseInstance?.completed) {
            onComplete?.({
                caseInstance, familyId: building?.familyId, xpEarned: caseInstance.xpEarned,
                reputationDelta: caseInstance.reputationDelta, outcomeTier: caseInstance.outcomeTier,
                ukpTriggered: caseInstance.ukpTriggered, ukpDelayDays: caseInstance.ukpDelayDays, ukpDiseaseId: caseInstance.ukpDiseaseId,
                // Evidence handoff for Balai Desa War Room (V1)
                evidenceGathered: (caseInstance.cluesFound || []).map(loc => {
                    const ic = scenario?.investigationClues?.find(c => c.location === loc);
                    return ic ? { location: loc, rootBarrier: ic.comBRevealed, detail: ic.finding } : null;
                }).filter(e => e && e.rootBarrier)
            });
        }
        onClose();
    }, [caseInstance, building, onClose, onComplete, scenario]);

    if (!caseInstance || !scenario) return null;
    const phaseInfo = getCurrentPhaseInfo(caseInstance);
    const progress = caseInstance.phasesCompleted.length / caseInstance.availablePhases.length;

    // SDOH bar data (V1)
    const sdohEco = familyData?.sdoh?.economic || familyData?.sdoh?.economicStatus || 'Menengah';
    const sdohEdu = familyData?.sdoh?.education || 'Menengah';
    const isVulnerable = ['low', 'rendah', 'miskin'].includes(String(sdohEco).toLowerCase()) ||
                         ['low', 'rendah'].includes(String(sdohEdu).toLowerCase());

    // Hide glass header during paper-themed evaluation
    const isEvaluation = caseInstance.currentPhase === 'evaluation' || caseInstance.currentPhase === 'complete';

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:justify-end pointer-events-none p-4 sm:p-6">
            <style dangerouslySetInnerHTML={{__html: KINETIC_CSS}} />

            {/* Vignette overlay */}
            <div className="absolute inset-0 pointer-events-auto transition-opacity"
                 style={{background: 'radial-gradient(circle at center, rgba(2,6,23,0.5) 0%, rgba(2,6,23,0.85) 100%)'}}
                 onClick={handleClose} />

            <div className="w-full sm:w-[520px] h-full flex flex-col gap-4 pointer-events-auto relative z-10 animate-in slide-in-from-right-16 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">

                {/* HEADER MODULE (Glass Clinical) */}
                {!isEvaluation && (
                    <div className="bg-[#0b0e14]/90 backdrop-blur-xl border border-white/10 border-t-2 border-t-cyan-400/40 rounded-[28px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-950 border border-slate-700 rounded-2xl shadow-inner flex items-center justify-center text-cyan-400 text-3xl shrink-0 relative overflow-hidden">
                                    <div className="absolute inset-0 blueprint-grid opacity-30" />
                                    <span className="relative z-10">{scenario.icon || '⚕️'}</span>
                                </div>
                                <div>
                                    <div className="font-mono text-[9px] text-cyan-400 tracking-[0.3em] uppercase mb-1 flex items-center gap-2 font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                        PIS-PK: {scenario.category}
                                    </div>
                                    <h2 className="text-white font-black text-xl uppercase tracking-widest leading-none mb-2">{scenario.title}</h2>
                                    <div className="flex gap-2 font-mono text-[9px] tracking-widest uppercase font-bold">
                                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">{scenario.disease}</span>
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">{building?.name}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleClose} className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-600 border border-slate-700 hover:border-rose-500 transition-all flex items-center justify-center btn-med border-b-slate-900 shrink-0">
                                <X size={20} strokeWidth={3}/>
                            </button>
                        </div>

                        {/* SDOH Profile Bar (V1) */}
                        <div className={`mt-4 px-3 py-2 rounded-lg border flex justify-between items-center font-mono text-[10px] uppercase tracking-widest ${isVulnerable ? 'bg-rose-950/40 border-rose-900/60 text-rose-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            <span className="flex items-center gap-2"><Database size={12}/> PROFIL SDOH</span>
                            <span className="font-bold">EKO: {sdohEco} | DIDIK: {sdohEdu}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 bg-black/40 p-3 rounded-xl border border-slate-800/50">
                            <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-bold">
                                <span>PROSEDUR: <span className="text-white">{phaseInfo.label}</span></span>
                                <span className="text-cyan-400">[{Math.round(progress * 100)}%]</span>
                            </div>
                            <div className="flex gap-1.5">
                                {caseInstance.availablePhases.slice(0,4).map((phase) => (
                                    <div key={phase} className={`h-1.5 flex-1 rounded-sm transition-all duration-700 ${
                                        caseInstance.phasesCompleted.includes(phase) ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]' :
                                        phase === caseInstance.currentPhase ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-slate-800'
                                    }`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN STAGE MODULE */}
                <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-500 ${isEvaluation ? 'bg-transparent' : 'bg-[#12161c]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative'}`}>
                    {!isEvaluation && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-7 scrollbar-hide relative z-10">
                        {caseInstance.currentPhase === 'investigation' && <InvestigationPhase caseInstance={caseInstance} scenario={scenario} onAdvance={handleAdvance} />}
                        {caseInstance.currentPhase === 'diagnosis' && <DiagnosisPhase caseInstance={caseInstance} scenario={scenario} onAdvance={handleAdvance} />}
                        {(caseInstance.currentPhase === 'intervention' || caseInstance.currentPhase === 'planning') && <InterventionPhase caseInstance={caseInstance} scenario={scenario} onAdvance={handleAdvance} />}
                        {(caseInstance.currentPhase === 'evaluation' || caseInstance.currentPhase === 'complete' || caseInstance.currentPhase === 'followup') && <EvaluationPhase caseInstance={caseInstance} onClose={handleClose} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
