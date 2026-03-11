/**
 * @reflection
 * [IDENTITY]: MiniGamePanel.jsx — "CLINICAL REALISM" Mini-Games
 * [PURPOSE]: Renders individual mini-games for behavior change intervention phases.
 *            3 game types: Audit Kesling (sanitasi inspection), Anamnesis Sosial
 *            (HBM social interview), Rencana Tindak Lanjut (BCW policy allocation).
 *            All animations self-contained via injected CSS.
 * [STATE]: Experimental
 * [ANCHOR]: MiniGamePanel
 * [DEPENDS_ON]: MiniGameLibrary (game definitions + scoring)
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { scoreMiniGame } from '../../game/MiniGameLibrary.js';
import { ClipboardCheck, Stethoscope, Users, CheckCircle2, XCircle, AlertTriangle, Crosshair, Activity, Scan, Search, Bug, Droplet, Wind } from 'lucide-react';
import { shuffleDeterministic } from '../../utils/deterministicRandom.js';

// Static barrier info (no dynamic Tailwind!)
const BARRIER_INFO = {
    cap_phy: { label: 'KAPABILITAS FISIK', slotActive: 'border-blue-400 bg-blue-950/30', slotLabel: 'text-blue-400' },
    cap_psy: { label: 'KAPAB. PSIKOLOGIS', slotActive: 'border-purple-400 bg-purple-950/30', slotLabel: 'text-purple-400' },
    opp_phy: { label: 'PELUANG FISIK', slotActive: 'border-amber-400 bg-amber-950/30', slotLabel: 'text-amber-400' },
    opp_soc: { label: 'PELUANG SOSIAL', slotActive: 'border-pink-400 bg-pink-950/30', slotLabel: 'text-pink-400' },
    mot_ref: { label: 'MOTIVASI REFLEKTIF', slotActive: 'border-cyan-400 bg-cyan-950/30', slotLabel: 'text-cyan-400' },
    mot_aut: { label: 'MOTIVASI OTOMATIS', slotActive: 'border-emerald-400 bg-emerald-950/30', slotLabel: 'text-emerald-400' }
};

// Self-contained kinetic CSS
const MINI_CSS = `
    @keyframes mg-sonar { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
    @keyframes mg-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px) rotate(-1deg); } 75% { transform: translateX(6px) rotate(1deg); } }
    @keyframes mg-float { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-40px) scale(1.5); opacity: 0; } }
    @keyframes mg-shutter { 0% { background: white; opacity: 0.6; } 100% { background: transparent; opacity: 0; } }
    @keyframes mg-ekg { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
    @keyframes mg-autobar { 0% { width: 0%; } 100% { width: 100%; } }
    @keyframes mg-stamp { 0% { opacity: 0; transform: scale(2.5) rotate(-15deg); } 100% { opacity: 1; transform: scale(1) rotate(-6deg); } }
    @keyframes crt-scanline { 0% { top: 0%; } 100% { top: 100%; } }
    .mg-shake { animation: mg-shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
    .mg-float { animation: mg-float 0.8s ease-out forwards; }
    .mg-sonar { animation: mg-sonar 3s linear infinite; }
    .mg-stamp { animation: mg-stamp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .btn-tac { border-bottom-width: 4px; transition: all 150ms; }
    .btn-tac:active:not(:disabled) { border-bottom-width: 0px; transform: translateY(4px); }
    .blueprint-bg { background-color: #05080C; background-image: linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px); background-size: 30px 30px; }
`;

// Transmission route icons for triangulation classification
const TRANSMISSION_ROUTES = [
    { id: 'vector', label: 'VECTOR', icon: Bug, color: 'rose', hoverBg: 'hover:bg-rose-950 hover:border-rose-500 hover:text-rose-400' },
    { id: 'water', label: 'WATER', icon: Droplet, color: 'blue', hoverBg: 'hover:bg-blue-950 hover:border-blue-500 hover:text-blue-400' },
    { id: 'air', label: 'AIR', icon: Wind, color: 'emerald', hoverBg: 'hover:bg-emerald-950 hover:border-emerald-500 hover:text-emerald-400' },
];

// ═══════════════════════════════════════════════════════════════
// 📋 FORENSIK SANITASI (Inspeksi + Triangulasi Transmisi)
// ═══════════════════════════════════════════════════════════════
function AuditKesling({ game, scenarioKey, onComplete }) {
    const scene = game.scenes?.[scenarioKey] || game.scenes?.general;
    const allItems = useMemo(() => {
        const h = (scene?.hazards || []).map(i => ({ ...i, isHazard: true }));
        const f = (scene?.fakeItems || []).map(i => ({ ...i, isHazard: false }));
        return shuffleDeterministic(
            [...h, ...f],
            `${game?.id || game?.title || 'audit-kesling'}:${scenarioKey || scene?.title || 'general'}`
        );
    }, [game, scene, scenarioKey]);

    const hazardsCount = scene?.hazards?.length || 0;
    const [found, setFound] = useState([]); // IDs of found hazards
    const [classified, setClassified] = useState({}); // { hazardId: route }
    const [mistakes, setMistakes] = useState(0);
    const [classifyMistakes, setClassifyMistakes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(game.timeLimit || 60);
    const [battery, setBattery] = useState(100); // Triangulation tool battery
    const [finished, setFinished] = useState(false);
    const [shake, setShake] = useState(false);
    const [shutter, setShutter] = useState(false);
    const [floats, setFloats] = useState([]);
    const [classifyTarget, setClassifyTarget] = useState(null); // hazard awaiting classification
    const timerRef = useRef(null);
    const floatIdRef = useRef(0);

    useEffect(() => {
        if (finished) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0; } return prev - 1; });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [finished]);

    const handleFinish = useCallback(() => {
        if (finished) return;
        setFinished(true);
        clearInterval(timerRef.current);
        const correctClassifications = Object.entries(classified).filter(([id, route]) => {
            const hazard = allItems.find(i => i.id === id);
            return hazard?.type === route || !hazard?.type; // If no type defined, count as correct
        }).length;
        setTimeout(() => {
            onComplete(scoreMiniGame('inspeksi_kilat', {
                correct: found.length + correctClassifications,
                incorrect: mistakes + classifyMistakes,
                timeRemaining: timeLeft
            }));
        }, 3000);
    }, [found, classified, allItems, mistakes, classifyMistakes, timeLeft, onComplete, finished]);

    useEffect(() => {
        if (timeLeft !== 0 || finished) return undefined;
        const finishTimer = setTimeout(() => handleFinish(), 0);
        return () => clearTimeout(finishTimer);
    }, [timeLeft, finished, handleFinish]);
    // Finish when all hazards found AND classified
    const allClassified = Object.keys(classified).length >= hazardsCount;
    useEffect(() => {
        if (!allClassified || hazardsCount <= 0 || finished) return undefined;
        const finishTimer = setTimeout(() => handleFinish(), 0);
        return () => clearTimeout(finishTimer);
    }, [allClassified, hazardsCount, finished, handleFinish]);

    const handleClick = (item) => {
        if (finished || found.includes(item.id) || classifyTarget) return;
        floatIdRef.current += 1;
        const fid = floatIdRef.current;
        setShutter(true); setTimeout(() => setShutter(false), 150);

        if (item.isHazard) {
            setFound(prev => [...prev, item.id]);
            setFloats(p => [...p, { id: fid, x: item.x, y: item.y, text: 'DITEMUKAN!', color: 'text-amber-400' }]);
            // Open triangulation classification menu
            setClassifyTarget(item);
        } else {
            setMistakes(prev => prev + 1);
            setShake(true); setTimeout(() => setShake(false), 300);
            setTimeLeft(p => Math.max(0, p - 5));
            setFloats(p => [...p, { id: fid, x: item.x, y: item.y, text: '-5s', color: 'text-red-500' }]);
        }
        setTimeout(() => setFloats(p => p.filter(f => f.id !== fid)), 800);
    };

    const handleClassify = (route) => {
        if (!classifyTarget) return;
        floatIdRef.current += 1;
        const fid = floatIdRef.current;
        const isCorrect = classifyTarget.type === route || !classifyTarget.type;

        if (isCorrect) {
            setClassified(p => ({ ...p, [classifyTarget.id]: route }));
            setFloats(p => [...p, { id: fid, x: classifyTarget.x, y: classifyTarget.y, text: '✓ ' + route.toUpperCase(), color: 'text-emerald-400' }]);
        } else {
            // BRUTAL PENALTY: -20% battery for wrong epidemiological classification
            setBattery(b => Math.max(0, b - 20));
            setClassifyMistakes(m => m + 1);
            setShake(true); setTimeout(() => setShake(false), 400);
            setFloats(p => [...p, { id: fid, x: classifyTarget.x, y: classifyTarget.y, text: 'SALAH! -20%🔋', color: 'text-red-500' }]);
        }
        setClassifyTarget(null);
        setTimeout(() => setFloats(p => p.filter(f => f.id !== fid)), 1200);

        // Battery dead = forced finish
        if (!isCorrect && battery - 20 <= 0) {
            setTimeout(() => handleFinish(), 500);
        }
    };

    const isCritical = timeLeft <= 10;
    const isBatteryLow = battery <= 30;

    return (
        <div className={`relative h-full flex flex-col bg-[#05080C] animate-in fade-in zoom-in-95 duration-500 ${shake ? 'mg-shake bg-red-950/10' : ''}`}>
            {shutter && <div className="absolute inset-0 z-50 pointer-events-none" style={{ animation: 'mg-shutter 0.15s ease-out' }} />}
            {/* CRT scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[10px] w-full pointer-events-none z-[60]" style={{ animation: 'crt-scanline 3s linear infinite' }} />

            {/* Timer bar */}
            <div className="h-1.5 w-full bg-slate-900 relative z-20">
                <div className={`h-full transition-all duration-1000 ease-linear ${isCritical ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`} style={{ width: `${(timeLeft / (game.timeLimit || 60)) * 100}%` }} />
            </div>

            {/* HUD Header */}
            <div className="p-4 flex justify-between items-center border-b border-cyan-900/50 bg-[#05080C]/90 z-10 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                    <Crosshair className={`${isCritical ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} size={24} />
                    <div>
                        <h3 className="text-white font-black text-lg uppercase tracking-[0.15em] leading-none">TRIANGULASI TRANSMISI</h3>
                        <p className="text-cyan-600 font-mono text-[9px] uppercase tracking-widest mt-1">Forensik Sanitasi — Temukan & Klasifikasikan Jalur</p>
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <div className="text-right font-mono">
                        <div className="text-[9px] text-rose-400 tracking-widest font-bold">TEMUAN</div>
                        <div className="text-xl font-black text-white">{Object.keys(classified).length}<span className="text-slate-600 text-sm">/{hazardsCount}</span></div>
                    </div>
                    <div className="text-right font-mono w-20">
                        <div className={`text-[9px] tracking-widest font-bold ${isBatteryLow ? 'text-red-400 animate-pulse' : 'text-amber-500'}`}>BATERAI</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1">
                            <div className={`h-full transition-all ${isBatteryLow ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} style={{ width: `${battery}%` }} />
                        </div>
                        <div className={`text-[10px] font-black mt-0.5 ${isBatteryLow ? 'text-red-400' : 'text-amber-400'}`}>{battery}%</div>
                    </div>
                    <div className="text-right font-mono w-16">
                        <div className="text-[9px] text-slate-500 tracking-widest">WAKTU</div>
                        <div className={`text-xl font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                            {timeLeft}s
                        </div>
                    </div>
                </div>
            </div>

            {/* Spatial Viewfinder */}
            <div className="relative flex-1 blueprint-bg overflow-hidden cursor-crosshair shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
                {/* Sonar sweep */}
                <div className="absolute top-0 left-0 right-0 h-[200%] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent border-b border-cyan-400/50 pointer-events-none z-0 mg-sonar" />

                {allItems.map((item, idx) => {
                    const isFound = found.includes(item.id);
                    const isClassified = classified[item.id];
                    const isClassTarget = classifyTarget?.id === item.id;
                    const isRevealed = finished || isFound;
                    return (
                        <div key={item.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                            <button onClick={() => handleClick(item)} disabled={finished || isFound}
                                className={`transition-all duration-300 group ${isFound ? 'scale-110' : 'hover:scale-125 hover:z-20'}`}
                                style={{ opacity: finished && !isFound ? 0.2 : 1 }}
                            >
                                {!isRevealed && !finished && <div className="absolute inset-0 border border-cyan-400/30 rounded-full animate-ping" style={{ animationDelay: `${idx * 200}ms` }} />}
                                <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl backdrop-blur-sm transition-all
                                    ${isClassified ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                                      isFound ? 'bg-amber-950/80 border-2 border-amber-400 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-pulse' :
                                      'bg-slate-900/60 border border-cyan-900/50 text-cyan-600 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/80'}`}
                                >
                                    {isClassified ? <CheckCircle2 size={20}/> : isFound ? <AlertTriangle size={20}/> : <Search size={20}/>}
                                    <span className={`absolute top-full mt-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap rounded
                                        ${isClassified ? 'bg-emerald-900 text-emerald-300 border border-emerald-500' :
                                          isFound ? 'bg-amber-900 text-amber-300 border border-amber-500' :
                                          'opacity-0 group-hover:opacity-100 bg-slate-900 border border-cyan-700 text-cyan-400 font-mono'}`}
                                    >
                                        {isClassified ? `✓ ${classified[item.id].toUpperCase()}` : isRevealed ? item.label : 'TITIK-' + (idx + 1)}
                                    </span>
                                    {isClassified && (
                                        <div className="absolute -top-3 -right-3 text-emerald-500 font-black text-[10px] border-2 border-emerald-500 px-1 rounded transform -rotate-6 bg-emerald-950/90 mg-stamp">
                                            {classified[item.id]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* ── TRIANGULATION CLASSIFICATION MENU ── */}
                            {isClassTarget && (
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 p-2 rounded-xl flex gap-2 animate-in zoom-in-75 shadow-2xl z-50">
                                    {TRANSMISSION_ROUTES.map(route => {
                                        const Icon = route.icon;
                                        return (
                                            <button key={route.id} onClick={() => handleClassify(route.id)}
                                                className={`p-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded flex flex-col items-center btn-tac transition-colors ${route.hoverBg}`}>
                                                <Icon size={16}/> <span className="text-[8px] mt-1.5 font-bold tracking-wider">{route.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Floating text */}
                {floats.map(f => (
                    <div key={f.id} className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl font-black font-mono ${f.color} mg-float pointer-events-none z-50`}
                         style={{ left: `${f.x}%`, top: `${f.y}%`, textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                        {f.text}
                    </div>
                ))}

                {/* Battery dead overlay */}
                {battery <= 0 && !finished && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in">
                        <AlertTriangle className="text-red-500 mb-4 animate-pulse" size={56}/>
                        <h2 className="text-red-500 font-black text-3xl tracking-widest uppercase">DAYA HABIS</h2>
                        <p className="font-mono text-xs text-red-300 mt-2">Alat triangulasi mati. Investigasi dihentikan.</p>
                    </div>
                )}

                {/* ── AUDIT COMPLETE OVERLAY ── */}
                {finished && (
                    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center space-y-4">
                            <div className={`text-4xl font-black uppercase tracking-[0.2em] ${allClassified ? 'text-emerald-400' : 'text-amber-400'}`}
                                 style={{ textShadow: `0 0 40px ${allClassified ? 'rgba(16,185,129,0.6)' : 'rgba(245,158,11,0.6)'}` }}>
                                {allClassified ? '✓ FORENSIK SELESAI' : battery <= 0 ? '🔋 DAYA HABIS' : '⏱ WAKTU HABIS'}
                            </div>
                            <div className="flex gap-6 justify-center font-mono text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white">{Object.keys(classified).length}/{hazardsCount}</div>
                                    <div className="text-[9px] text-slate-500 tracking-widest uppercase">Terklasifikasi</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-cyan-400">+{timeLeft}s</div>
                                    <div className="text-[9px] text-slate-500 tracking-widest uppercase">Bonus Waktu</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-red-400">{classifyMistakes}</div>
                                    <div className="text-[9px] text-slate-500 tracking-widest uppercase">Salah Klasifikasi</div>
                                </div>
                            </div>
                            <div className="w-48 h-1 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{ animation: 'mg-autobar 3s linear forwards' }} />
                            </div>
                            <div className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase mt-1">→ MEMBUKA LAPORAN EVALUASI...</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 🩺 ANAMNESIS SOSIAL (Health Belief Model Profiling)
// ═══════════════════════════════════════════════════════════════
function AnamnesisSosial({ game, onComplete }) {
    const expressions = game.expressions || [];
    const [round, setRound] = useState(0);
    const [score, setScore] = useState({ correct: 0, incorrect: 0, streak: 0 });
    const [selected, setSelected] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [shake, setShake] = useState(false);

    const current = expressions[round];

    const handleAnswer = (answer) => {
        if (showFeedback || !current) return;
        const isCorrect = answer === current.correctRead;
        setSelected(answer);
        setShowFeedback(true);
        if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 400); }

        setScore(p => ({ correct: p.correct + (isCorrect ? 1 : 0), incorrect: p.incorrect + (isCorrect ? 0 : 1), streak: isCorrect ? p.streak + 1 : 0 }));

        setTimeout(() => {
            if (round + 1 >= expressions.length) {
                onComplete(scoreMiniGame('baca_ekspresi', { correct: score.correct + (isCorrect ? 1 : 0), incorrect: score.incorrect + (isCorrect ? 0 : 1), streak: isCorrect ? score.streak + 1 : 0 }));
            } else {
                setRound(p => p + 1); setSelected(null); setShowFeedback(false);
            }
        }, 3000);
    };

    if (!current) return null;
    const isSuccess = selected === current.correctRead;

    return (
        <div className={`flex flex-col h-full bg-[#05080C] relative ${shake ? 'mg-shake bg-red-950/10' : ''}`}>
            {/* Header — Clinical */}
            <div className="flex justify-between items-center p-5 shrink-0 border-b border-emerald-900/30">
                <div className="flex items-center gap-3">
                    <Stethoscope className={showFeedback ? 'text-emerald-400' : 'text-emerald-500 animate-pulse'} size={24} />
                    <div>
                        <h4 className="font-black tracking-[0.15em] uppercase text-emerald-400 text-lg leading-none">ANAMNESIS SOSIAL</h4>
                        <p className="text-[9px] font-mono text-emerald-700 tracking-widest uppercase mt-1">Health Belief Model (HBM) Profiling</p>
                    </div>
                </div>
                <div className="flex gap-5 text-right font-mono">
                    <div>
                        <span className="text-[9px] text-slate-500 tracking-widest block">KUTIPAN</span>
                        <span className="text-lg font-black text-white">[{round + 1}/{expressions.length}]</span>
                    </div>
                    {score.streak > 1 && (
                        <div>
                            <span className="text-[9px] text-amber-500 tracking-widest block">STREAK</span>
                            <span className="text-lg font-black text-amber-400 animate-pulse">🔥 x{score.streak}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Expression Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* EKG heartbeat  */}
                <div className="absolute inset-0 flex items-center opacity-10 pointer-events-none">
                    <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 100 20">
                        <path d="M0 10 L40 10 L45 2 L50 18 L55 10 L100 10" fill="none" stroke="#10B981" strokeWidth="0.5" style={!showFeedback ? { animation: 'mg-ekg 1.5s linear infinite' } : {}} />
                    </svg>
                </div>

                <div className={`text-[80px] leading-none mb-4 relative z-10 transition-all duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] ${showFeedback ? 'scale-90 opacity-40' : 'scale-110'}`}>
                    {current.emoji}
                </div>

                <div className="relative z-10 bg-black/60 border border-slate-700/50 p-5 rounded-xl w-full max-w-lg text-center backdrop-blur-sm mb-6">
                    <span className="absolute -top-3 left-4 text-[9px] font-mono text-emerald-500 tracking-[0.2em] bg-black px-2">TRANSKRIP WAWANCARA:</span>
                    <p className={`text-lg font-serif italic font-medium leading-relaxed ${showFeedback ? 'text-slate-500 line-through' : 'text-amber-100'}`}>
                        &quot;{current.npcLine.replace(/"/g, '')}&quot;
                    </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg relative z-20">
                    <div className="col-span-2 text-center text-[9px] font-mono text-cyan-600 tracking-[0.2em] uppercase mb-1">Identifikasi Dinding Psikologis Warga:</div>
                    {current.options.map((option) => {
                        const isCorrect = option === current.correctRead;
                        const isSelected = selected === option;
                        let cls = 'bg-slate-900 border-slate-700 border-b-slate-950 text-slate-300 hover:border-emerald-500 hover:text-white btn-tac';
                        if (showFeedback) {
                            if (isCorrect) cls = 'bg-emerald-950 border-emerald-500 border-b-0 text-emerald-400 translate-y-1 shadow-[0_0_30px_rgba(16,185,129,0.2)]';
                            else if (isSelected) cls = 'bg-rose-950 border-rose-600 border-b-0 text-rose-400 translate-y-1';
                            else cls = 'bg-slate-950 border-slate-900 text-slate-700 opacity-20';
                        }
                        return (
                            <button key={option} onClick={() => handleAnswer(option)} disabled={showFeedback}
                                className={`p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 border ${cls}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{option}</span>
                                    {showFeedback && isCorrect && <CheckCircle2 size={16}/>}
                                    {showFeedback && isSelected && !isCorrect && <XCircle size={16}/>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Slide-up Insight Panel */}
            <div className={`absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-emerald-500/30 p-5 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 z-50 backdrop-blur-xl flex items-start gap-4
                ${showFeedback ? 'translate-y-0' : 'translate-y-full'}
            `}>
                <div className={`p-2.5 rounded-xl shrink-0 ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-500'}`}>
                    {isSuccess ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                </div>
                <div>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5 ${isSuccess ? 'text-emerald-400' : 'text-rose-500'}`}>
                        &gt; {isSuccess ? 'ANALISIS HBM: AKURAT' : 'MISINTERPRETASI KLINIS'}
                    </div>
                    <p className="text-slate-200 text-sm font-medium leading-relaxed">{current.followUp}</p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// 📋 RENCANA TINDAK LANJUT (BCW Policy Allocation)
// ═══════════════════════════════════════════════════════════════
function RencanaTindakLanjut({ game, activeBarriers, onComplete }) {
    const allCards = useMemo(
        () => shuffleDeterministic(
            [...(game.cards || []), ...(game.distractors || [])],
            `${game?.id || game?.title || 'rencana-tindak-lanjut'}:cards`
        ),
        [game]
    );
    const barrierSlots = Object.keys(activeBarriers || {}).filter(k => activeBarriers[k] > 0);

    const [placements, setPlacements] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSlotClick = (barrierId) => {
        if (submitted) return;
        if (selectedCard) {
            setPlacements(p => {
                const newP = { ...p };
                Object.keys(newP).forEach(k => { if (newP[k]?.id === selectedCard.id) delete newP[k]; });
                newP[barrierId] = selectedCard;
                return newP;
            });
            setSelectedCard(null);
        } else if (placements[barrierId]) {
            setPlacements(p => { const newP = { ...p }; delete newP[barrierId]; return newP; });
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        let correct = 0, incorrect = 0;
        for (const [id, card] of Object.entries(placements)) {
            if (card.matchBarriers?.includes(id)) correct++; else incorrect++;
        }
        setTimeout(() => onComplete(scoreMiniGame('susun_strategi', { correct, incorrect })), 2500);
    };

    const placedCardIds = new Set(Object.values(placements).map(c => c.id));
    const allFilled = Object.keys(placements).length >= barrierSlots.length;

    return (
        <div className="flex flex-col h-full bg-[#05080C] p-6 relative">
            <div className="flex justify-between items-end mb-5 border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <Users className="text-purple-400" size={24} />
                    <div>
                        <h3 className="text-white font-black text-lg tracking-[0.15em] uppercase leading-none">Rencana Tindak Lanjut</h3>
                        <p className="text-purple-600 font-mono text-[9px] tracking-widest uppercase mt-1">Alokasi Intervensi BCW Lintas Sektor</p>
                    </div>
                </div>
                <div className="text-right font-mono">
                    <span className="text-[10px] text-cyan-500">ALOKASI</span>
                    <div className="text-lg font-black text-white">{Object.keys(placements).length}/{barrierSlots.length}</div>
                </div>
            </div>

            {/* Target Slots — Akar Masalah */}
            <div className="grid grid-cols-2 gap-3 mb-5 shrink-0">
                {barrierSlots.map(bId => {
                    const placed = placements[bId];
                    const info = BARRIER_INFO[bId] || { label: bId, slotActive: 'border-slate-400 bg-slate-950/30', slotLabel: 'text-slate-400' };
                    const isTargetable = selectedCard !== null && !placed;
                    const isCorrect = submitted && placed?.matchBarriers?.includes(bId);
                    const isWrong = submitted && placed && !isCorrect;

                    return (
                        <button key={bId} onClick={() => handleSlotClick(bId)} disabled={submitted && !placed}
                            className={`
                                relative min-h-[100px] rounded-xl p-4 border-2 transition-all duration-300 flex flex-col justify-center items-center text-center overflow-hidden
                                ${placed
                                    ? isCorrect ? 'border-emerald-500 bg-emerald-950/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                    : isWrong ? 'border-rose-500 bg-rose-950/50 shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                                    : info.slotActive + ' scale-[1.02]'
                                    : isTargetable ? 'border-amber-400 border-dashed bg-amber-950/20 animate-pulse cursor-pointer'
                                    : 'border-slate-800 border-dashed bg-slate-900/30 hover:border-slate-600'}
                            `}
                        >
                            <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-600 uppercase tracking-widest">TARGET:</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 mt-2 ${placed ? info.slotLabel : 'text-slate-500'}`}>{info.label}</div>

                            {placed ? (
                                <div className="mt-1 w-full bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-lg flex flex-col items-center gap-1 animate-in zoom-in-75 duration-200 shadow-inner">
                                    <span className="text-2xl">{placed.icon}</span>
                                    <span className="text-[9px] font-bold text-white uppercase leading-tight">{placed.label}</span>
                                    {submitted && (
                                        <div className={`absolute -right-2 -top-2 w-7 h-7 rounded-full flex items-center justify-center text-white border-2 font-black animate-in zoom-in-150 shadow-lg ${isCorrect ? 'bg-emerald-600 border-emerald-300' : 'bg-rose-600 border-rose-300'}`}>
                                            {isCorrect ? '✓' : '✖'}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`text-[10px] font-mono tracking-widest uppercase mt-2 ${isTargetable ? 'text-amber-400' : 'text-slate-600'}`}>
                                    {isTargetable ? '< DEPLOY DISINI >' : '[ SLOT KOSONG ]'}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Card Deck — Arsenal Intervensi */}
            <div className={`flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-y-auto transition-opacity duration-500 ${submitted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="font-mono text-[9px] text-cyan-600 tracking-[0.2em] uppercase mb-3 text-center">
                    {selectedCard ? '>>> KLIK SLOT TARGET DI ATAS <<<' : 'ARSENAL INTERVENSI — PILIH KEBIJAKAN'}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {allCards.map((card, idx) => {
                        if (placedCardIds.has(card.id)) return null;
                        const isActive = selectedCard?.id === card.id;
                        return (
                            <button key={card.id} onClick={() => setSelectedCard(isActive ? null : card)} disabled={submitted}
                                style={{ animationDelay: `${idx * 40}ms` }}
                                className={`
                                    w-[120px] h-[80px] rounded-lg border flex flex-col items-center justify-center p-2 text-center transition-all duration-200 animate-in slide-in-from-bottom-6 fade-in
                                    ${isActive
                                        ? 'bg-amber-500 border-amber-300 text-slate-900 scale-110 shadow-[0_15px_30px_rgba(245,158,11,0.4)] z-20 font-black'
                                        : 'bg-slate-800 border-slate-600 border-b-slate-900 text-slate-300 hover:bg-cyan-950 hover:border-cyan-500 hover:text-white btn-tac'}
                                `}
                            >
                                <span className="text-2xl mb-1">{card.icon}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest leading-snug">{card.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sahkan RTL */}
            {!submitted && allFilled && (
                <div className="absolute bottom-6 left-6 right-6 z-50 animate-in slide-in-from-bottom-8 fade-in">
                    <button onClick={handleSubmit} className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.3em] bg-emerald-600 text-white shadow-[0_15px_40px_rgba(16,185,129,0.4)] btn-tac border-b-emerald-900 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                        <ClipboardCheck size={18} /> SAHKAN RTL LINTAS SEKTOR
                    </button>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export default function MiniGamePanel({ game, scenarioKey, activeBarriers, onComplete }) {
    if (!game) return null;

    return (
        <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] bg-[#05080C] text-slate-200">
            <style dangerouslySetInnerHTML={{__html: MINI_CSS}} />
            {game.gameType === 'hidden_object' && <AuditKesling game={game} scenarioKey={scenarioKey} onComplete={onComplete} />}
            {game.gameType === 'expression_reading' && <AnamnesisSosial game={game} onComplete={onComplete} />}
            {game.gameType === 'card_matching' && <RencanaTindakLanjut game={game} activeBarriers={activeBarriers} onComplete={onComplete} />}

            {!['hidden_object', 'expression_reading', 'card_matching'].includes(game.gameType) && (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-800 m-8 rounded-2xl">
                    <AlertTriangle size={48} className="mb-4 text-amber-500 opacity-50" />
                    <p className="font-mono text-sm tracking-[0.2em] uppercase text-slate-400 mb-6">MODULE [{game.gameType}]</p>
                    <button onClick={() => onComplete({ score: 50, maxScore: 100, normalized: 50, feedback: 'AUTO-RESOLVED' })}
                        className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black tracking-widest btn-tac border-slate-800 border-b-slate-950 hover:bg-slate-800 transition-all text-xs">
                        BYPASS
                    </button>
                </div>
            )}
        </div>
    );
}
