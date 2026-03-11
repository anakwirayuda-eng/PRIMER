/**
 * @reflection
 * [IDENTITY]: BuildingGamePanel
 * [PURPOSE]: Full-screen Posyandu interior with clean denah-style layout.
 *            5 stations in U-shape flow, painted background, no overlap.
 * [STATE]: Rewritten — denah layout, no Konva, no framer-motion
 * [ANCHOR]: BuildingGamePanel
 * [DEPENDS_ON]: buildingScenes.js, EliteCOMBWheel
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    X, Zap, Star, MessageCircle,
    ChevronRight, Search, Eye, CheckCircle, Play,
    ArrowLeft, Sparkles, Shield, Target, ChevronDown, ChevronUp
} from 'lucide-react';
import { getSceneForBuilding, COM_B_SEGMENTS } from './buildingScenes.js';
import EliteCOMBWheel from './EliteCOMBWheel.jsx';
import { pickDeterministic } from '../../utils/deterministicRandom.js';

// ═══════════════════════════════════════════════════════════════
// STATION CARD — a single desk in the denah
// ═══════════════════════════════════════════════════════════════

function StationCard({ station, index, isActive, isDone, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                relative flex flex-col items-center p-3 rounded-2xl
                transition-all duration-300 w-[130px] group
                ${isActive
                    ? 'bg-white/15 ring-2 ring-white/50 shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-105'
                    : isDone
                        ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/25 hover:scale-105'
                }
            `}
        >
            {/* Step number */}
            <div className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black
                ${isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-white text-slate-900' : 'bg-slate-700 text-white/60'}
            `}>
                {isDone ? '✓' : index + 1}
            </div>

            {/* Kader + Warga */}
            <div className="flex items-end justify-center gap-1 mb-1.5 h-8">
                <span className="text-xl drop-shadow-lg">{station.kader || '👩'}</span>
                {station.warga !== null && (
                    <span className="text-lg drop-shadow-lg opacity-80">{station.warga || '👤'}</span>
                )}
            </div>

            {/* Icon */}
            <div className="text-xl mb-1">{station.icon}</div>

            {/* Label */}
            <p className={`text-[8px] font-black uppercase tracking-wider text-center leading-tight
                ${isActive ? 'text-white' : isDone ? 'text-emerald-300' : 'text-white/60 group-hover:text-white/90'}
            `}>
                {station.label.replace(/^Meja \d: /, '')}
            </p>

            {/* Status */}
            <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest
                ${isDone ? 'bg-emerald-500/20 text-emerald-300' : isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'}
            `}>
                {isDone ? 'Selesai' : isActive ? 'Aktif' : `Meja ${index + 1}`}
            </div>
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════
// FLOW ARROW SVG
// ═══════════════════════════════════════════════════════════════

function FlowArrow({ direction = 'right' }) {
    const rotation = { right: 0, down: 90, left: 180 };
    return (
        <div className="flex items-center justify-center w-8 h-8 opacity-40"
            style={{ transform: `rotate(${rotation[direction] || 0}deg)` }}>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <path d="M0 6H20M20 6L14 1M20 6L14 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// ACTION PANEL (Right sidebar when station selected)
// ═══════════════════════════════════════════════════════════════

function ActionPanel({ station, energy, completedActions, onAction, onBack }) {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <button onClick={onBack} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/10">
                    {station.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-white text-sm">{station.label}</h4>
                    <p className="text-[10px] text-white/40 leading-tight">{station.description}</p>
                </div>
            </div>

            {/* Actions list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <h5 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Aksi Tersedia</h5>
                {station.actions.map((action) => {
                    const isDone = completedActions.has(action.id);
                    const canDo = energy >= action.energy && !isDone;
                    return (
                        <button key={action.id} disabled={!canDo} onClick={() => onAction(action, station)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                                ${isDone
                                    ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60'
                                    : canDo
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                        : 'bg-white/5 border-white/5 opacity-30 cursor-not-allowed'
                                }`}>
                            <span className="text-base flex-shrink-0">
                                {{ task: '📋', investigate: '🔍', dialog: '💬', minigame: '🎮' }[action.type] || '📋'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h5 className="font-black text-white text-xs">{action.label}</h5>
                            </div>
                            {isDone ? (
                                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-lg">✓</span>
                            ) : (
                                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                    <span className="text-[9px] font-black text-amber-400">-{action.energy} EP</span>
                                    <span className="text-[9px] font-black text-emerald-400">+{action.xp} XP</span>
                                </div>
                            )}
                        </button>
                    );
                })}

                {/* Findings section */}
                {station.findings && station.findings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <h5 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Search size={10} /> Temuan
                        </h5>
                        {station.findings.map((f, i) => {
                            const sevMap = {
                                critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🔴' },
                                warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: '🟡' },
                                info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🔵' },
                                good: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: '🟢' }
                            };
                            const s = sevMap[f.severity] || sevMap.info;
                            const isRevealed = completedActions.size > i;
                            return (
                                <div key={i} className={`p-2.5 rounded-xl border mb-1.5 transition-all ${isRevealed
                                    ? `${s.bg} ${s.border}`
                                    : 'bg-white/5 border-white/5 opacity-40'}`}>
                                    {isRevealed ? (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs mt-0.5">{s.icon}</span>
                                            <p className="text-[10px] text-white/80 leading-relaxed">{f.text}</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Eye size={10} className="text-white/20" />
                                            <span className="text-[9px] text-white/20 italic">Lakukan aksi untuk mengungkap...</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// NPC DIALOG PANEL (Bottom Sheet — appears above the denah)
// ═══════════════════════════════════════════════════════════════

function DialogPanel({ npc, dialog, onChoice, onDismiss }) {
    if (!dialog) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onDismiss} />
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
                <div className="w-full max-w-2xl bg-[#0f172a] border border-white/20 rounded-t-3xl shadow-2xl max-h-[60vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10 bg-white/5 flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl ring-2 ring-white/10">
                            {npc.avatar}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-white text-base">{npc.name}</h4>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{npc.role}</p>
                        </div>
                        <button onClick={onDismiss} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto p-5 space-y-4 flex-1">
                        <p className="text-sm text-white/90 leading-relaxed italic">
                            &ldquo;{dialog.text}&rdquo;
                        </p>
                        {dialog.choices && dialog.choices.length > 0 && (
                            <div className="space-y-2 pt-3 border-t border-white/10">
                                {dialog.choices.map((choice, i) => (
                                    <button key={i} onClick={() => onChoice(choice)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-white/10 hover:bg-slate-700 hover:border-blue-400/40 transition-all text-left group">
                                        <ChevronRight size={14} className="text-white/30 group-hover:text-blue-400" />
                                        <span className="text-xs font-bold text-white/80 group-hover:text-white flex-1">{choice.text}</span>
                                        {choice.xp && (
                                            <span className="text-[10px] font-black text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg">+{choice.xp} XP</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN BUILDING GAME PANEL
// ═══════════════════════════════════════════════════════════════

export default function BuildingGamePanel({ buildingType, energy, onAction, onClose, onXpGain, onTriggerScenario }) {
    const scene = getSceneForBuilding(buildingType);
    const [activeStation, setActiveStation] = useState(null);
    const [completedActions, setCompletedActions] = useState(new Set());
    const [completedStations, setCompletedStations] = useState(new Set());
    const [activeDialog, setActiveDialog] = useState(null);
    const [activeNpc, setActiveNpc] = useState(null);
    const [discoveredBarriers, setDiscoveredBarriers] = useState([]);
    const [sessionXp, setSessionXp] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);
    const [showDiagnostic, setShowDiagnostic] = useState(false);
    const [pendingScenario, setPendingScenario] = useState(null);
    const dialogShownRef = useRef(new Set());

    // Auto-triggered NPC dialogs
    useEffect(() => {
        if (!scene) return;
        const autoDialogs = scene.npcs?.flatMap(npc =>
            npc.dialogs
                .filter(d => d.trigger === 'auto' && !dialogShownRef.current.has(`${npc.id}_auto`))
                .map(d => ({ npc, dialog: d }))
        ) || [];
        if (autoDialogs.length > 0) {
            const first = autoDialogs[0];
            const timer = setTimeout(() => {
                setActiveNpc(first.npc);
                setActiveDialog(first.dialog);
                dialogShownRef.current.add(`${first.npc.id}_auto`);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [scene]);

    const handleAction = useCallback((action, station) => {
        if (energy < action.energy) return;
        setCompletedActions(prev => new Set([...prev, action.id]));
        setSessionXp(prev => prev + action.xp);
        onXpGain?.(action.xp);
        onAction?.(action);

        // Discover COM-B barrier on critical/warning findings
        const doneCount = [...completedActions].filter(id => station.actions.some(a => a.id === id)).length;
        if (station.findings && doneCount < station.findings.length) {
            const finding = station.findings[doneCount];
            if (finding?.severity === 'critical' || finding?.severity === 'warning') {
                const randomBarrier = pickDeterministic(
                    COM_B_SEGMENTS,
                    `${buildingType}:${station.id}:${finding.text}:${doneCount}`
                )?.id;
                if (randomBarrier && !discoveredBarriers.includes(randomBarrier)) {
                    setDiscoveredBarriers(prev => [...prev, randomBarrier]);
                }
            }
        }

        // Check station completion
        const allDone = station.actions.every(a => completedActions.has(a.id) || a.id === action.id);
        if (allDone) {
            setCompletedStations(prev => new Set([...prev, station.id]));
            // Check full completion
            const allStationsDone = scene.stations.every(s => completedStations.has(s.id) || s.id === station.id);
            if (allStationsDone) setTimeout(() => setShowCompletion(true), 600);
        }
    }, [buildingType, energy, onAction, onXpGain, completedActions, completedStations, discoveredBarriers, scene]);

    const handleDialogChoice = useCallback((choice) => {
        if (choice.xp) {
            setSessionXp(prev => prev + choice.xp);
            onXpGain?.(choice.xp);
        }
        if (choice.action === 'focus_station') {
            const target = scene.stations.find(s => s.id === choice.target);
            if (target) setActiveStation(target);
        }
        setActiveDialog(null);
        setActiveNpc(null);
    }, [scene, onXpGain]);

    if (!scene) return null;

    const totalActions = scene.stations.reduce((sum, s) => sum + s.actions.length, 0);
    const completedCount = completedActions.size;
    const progressPct = totalActions > 0 ? (completedCount / totalActions) * 100 : 0;

    // Determine if right panel is open
    const panelOpen = !!activeStation;

    // Dynamic Denah Layout Logic
    const totalStations = scene.stations.length;
    let topCount = totalStations;
    if (totalStations > 3) {
        topCount = Math.ceil(totalStations / 2);
        if (totalStations === 5) topCount = 3;
    }
    const topRow = scene.stations.slice(0, topCount);
    const bottomRow = scene.stations.slice(topCount, totalStations);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-xl text-white font-sans overflow-hidden">

            {/* ═══ TOP BAR ═══ */}
            <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-10">
                <button onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                    <ArrowLeft size={14} /> Keluar
                </button>

                <div className="flex-1 flex items-center gap-2 justify-center">
                    <span className="text-xl">{scene.theme.icon}</span>
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight">{scene.title}</h2>
                        <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{scene.subtitle}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400">
                        <Zap size={12} /> {energy}
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400">
                        <Star size={12} /> +{sessionXp}
                    </div>
                    {discoveredBarriers.length > 0 && (
                        <button onClick={() => setShowDiagnostic(true)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 hover:bg-purple-500/20 transition-colors">
                            <Target size={12} /> {discoveredBarriers.length} Barrier
                        </button>
                    )}
                </div>
            </div>

            {/* ═══ PROGRESS BAR ═══ */}
            <div className="flex-shrink-0 h-1 bg-black/50">
                <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>

            {/* ═══ MAIN CONTENT: Denah + Side Panel ═══ */}
            <div className="flex-1 flex min-h-0 overflow-hidden">

                {/* LEFT: Denah with painted background */}
                <div className={`flex-1 relative transition-all duration-500 ${panelOpen ? 'mr-0' : ''}`}>
                    {/* Painted background */}
                    <img
                        src={`/assets/buildings/${buildingType}_interior.png`}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        draggable={false}
                        onError={(e) => { e.target.src = '/assets/buildings/posyandu_interior.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />

                    {/* Denah layout: U-shape flow */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">

                        {/* Top row */}
                        <div className="flex items-center gap-2 mb-6">
                            {topRow.map((st, i) => (
                                <React.Fragment key={st.id}>
                                    <StationCard
                                        station={st}
                                        index={i}
                                        isActive={activeStation?.id === st.id}
                                        isDone={completedStations.has(st.id)}
                                        onClick={() => setActiveStation(st)}
                                    />
                                    {i < topRow.length - 1 && <FlowArrow direction="right" />}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Turn arrow & Bottom row (only if we have stations on bottom) */}
                        {bottomRow.length > 0 && (
                            <>
                                {/* Turn arrow:  ↓ from last station on top row */}
                                <div className="flex justify-end w-[460px] pr-[50px] mb-2">
                                    <FlowArrow direction="down" />
                                </div>

                                {/* Bottom row: reversed for U-shape */}
                                <div className="flex items-center justify-end w-[460px] gap-2 flex-row-reverse">
                                    {bottomRow.map((st, i) => {
                                        const globalIndex = i + topCount;
                                        return (
                                            <React.Fragment key={st.id}>
                                                <StationCard
                                                    station={st}
                                                    index={globalIndex}
                                                    isActive={activeStation?.id === st.id}
                                                    isDone={completedStations.has(st.id)}
                                                    onClick={() => setActiveStation(st)}
                                                />
                                                {i < bottomRow.length - 1 && <FlowArrow direction="left" />}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* "Pintu Masuk / Keluar" labels */}
                        <div className="flex justify-between w-[460px] mt-8 opacity-30 pointer-events-none">
                            <div className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                                ↗ Pintu Masuk
                            </div>
                            {bottomRow.length > 0 && (
                                <div className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                                    Pintu Keluar ↘
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NPC chips — bottom of denah */}
                    {!activeStation && scene.npcs && scene.npcs.length > 0 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {scene.npcs.map(npc => (
                                <button key={npc.id}
                                    onClick={() => {
                                        const nextDialog = npc.dialogs.find(d => !dialogShownRef.current.has(`${npc.id}_${d.trigger}`)) || npc.dialogs[0];
                                        setActiveNpc(npc);
                                        setActiveDialog(nextDialog || { text: npc.greeting, choices: [] });
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <span className="text-xl">{npc.avatar}</span>
                                    <div className="text-left">
                                        <span className="text-[9px] font-black text-white block">{npc.name}</span>
                                        <span className="text-[7px] text-white/40 uppercase tracking-widest">{npc.role}</span>
                                    </div>
                                    <MessageCircle size={10} className="text-white/20 group-hover:text-white/50" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Linked Scenarios — only when no station is selected */}
                    {!activeStation && scene.linkedScenarios && scene.linkedScenarios.length > 0 && (
                        <div className="absolute bottom-4 right-4 z-20">
                            <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                                <h5 className="text-[8px] font-black text-purple-300 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                    <Shield size={8} /> Kasus Terkait
                                </h5>
                                <div className="flex flex-col gap-1">
                                    {scene.linkedScenarios.map(s => (
                                        <button key={s} onClick={() => setPendingScenario(s)}
                                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-[8px] rounded font-bold border border-purple-500/30 hover:bg-purple-500/40 transition-all text-left">
                                            ⚡ {s.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: Station Detail Panel — slides in, never overlaps denah */}
                {panelOpen && (
                    <div className="w-[340px] flex-shrink-0 bg-slate-950/95 backdrop-blur-xl border-l border-white/10 overflow-hidden">
                        <ActionPanel
                            station={activeStation}
                            energy={energy}
                            completedActions={completedActions}
                            onAction={handleAction}
                            onBack={() => setActiveStation(null)}
                        />
                    </div>
                )}
            </div>

            {/* ═══ DIALOG (bottom sheet, covers nothing permanently) ═══ */}
            {activeDialog && activeNpc && (
                <DialogPanel
                    npc={activeNpc}
                    dialog={activeDialog}
                    onChoice={handleDialogChoice}
                    onDismiss={() => { setActiveDialog(null); setActiveNpc(null); }}
                />
            )}

            {/* ═══ COM-B DIAGNOSTIC MODAL ═══ */}
            {showDiagnostic && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md">
                    <div className="relative">
                        <button onClick={() => setShowDiagnostic(false)}
                            className="absolute -top-10 right-0 flex items-center gap-2 text-white/60 hover:text-white px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-xs font-bold uppercase tracking-widest">
                            Tutup <X size={14} />
                        </button>
                        <EliteCOMBWheel activeBarriers={discoveredBarriers} size={500} />
                    </div>
                </div>
            )}

            {/* ═══ SCENARIO CONFIRM MODAL ═══ */}
            {pendingScenario && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚡</div>
                        <h3 className="text-lg font-black text-white mb-2">{pendingScenario.replace(/_/g, ' ').toUpperCase()}</h3>
                        <p className="text-xs text-white/60 mb-6">Progress stasiun akan tersimpan.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setPendingScenario(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 font-bold text-xs transition-all">
                                Batal
                            </button>
                            <button onClick={() => { onTriggerScenario?.(pendingScenario); setPendingScenario(null); }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2">
                                <Play size={14} /> Mulai
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ COMPLETION ═══ */}
            {showCompletion && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md">
                    <div className="text-center">
                        <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🎉</div>
                        <h3 className="text-2xl font-black text-white mb-3">{scene.completionReward.message}</h3>
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-black text-emerald-300 uppercase tracking-widest">+{scene.completionReward.xp} XP</span>
                            <span className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-[11px] font-black text-purple-300 uppercase tracking-widest">+{scene.completionReward.reputation} Reputasi</span>
                        </div>
                        <button onClick={() => { setShowCompletion(false); onClose?.(); }}
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                            <Sparkles size={16} /> SELESAI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
