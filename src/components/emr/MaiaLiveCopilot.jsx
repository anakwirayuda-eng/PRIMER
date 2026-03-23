/**
 * @reflection
 * [IDENTITY]: MaiaLiveCopilot (The Cortana Interface)
 * [PURPOSE]: Proactive AI companion HUD — Bayesian Radar (Hack 1), Emergency Override (Hack 2),
 *            Contextual Whispers (Hack 4). Floating orb + panel on PatientEMR.
 * [STATE]: Cortana Protocol — AAA Companion AI
 * [DEPENDS_ON]: usePatientEMR (liveMaiaFeedback), ClinicalReasoning
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrainCircuit, Target, ShieldAlert, Sparkles, Lock, Zap } from 'lucide-react';

// ============================================================================
// CSS (inline to avoid separate file)
// ============================================================================
const MAIA_HUD_CSS = `
    @keyframes maia-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes maia-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes maia-pulse { 0%, 100% { box-shadow: 0 0 15px rgba(6,182,212,0.4); } 50% { box-shadow: 0 0 30px rgba(6,182,212,0.8); } }
    @keyframes maia-alert-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(225,29,72,0.5); } 50% { box-shadow: 0 0 50px rgba(225,29,72,0.9); } }
    @keyframes maia-locked-glow { 0%, 100% { box-shadow: 0 0 15px rgba(16,185,129,0.4); } 50% { box-shadow: 0 0 25px rgba(16,185,129,0.7); } }

    .maia-container { position: fixed; bottom: 32px; right: 32px; z-index: 999; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; pointer-events: none; }

    .maia-orb {
        width: 52px; height: 52px; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #22D3EE, #4F46E5);
        box-shadow: inset -4px -4px 10px rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center;
        border: 2px solid rgba(255,255,255,0.3); pointer-events: auto;
        cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: maia-float 4s ease-in-out infinite;
    }
    .maia-orb:hover { transform: scale(1.1); }
    .maia-orb.thinking { animation: maia-pulse 2s infinite, maia-float 4s ease-in-out infinite; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    .maia-orb.locked { background: radial-gradient(circle at 30% 30%, #34D399, #059669); border-color: #10B981; animation: maia-locked-glow 2s infinite; }
    .maia-orb.critical { background: radial-gradient(circle at 30% 30%, #FB7185, #E11D48); border-color: #FDA4AF; animation: maia-alert-pulse 1s infinite; }

    .maia-ring { position: absolute; inset: -8px; border-radius: 50%; border: 1px dashed rgba(255,255,255,0.3); animation: maia-spin 8s linear infinite; pointer-events: none; }

    .maia-panel {
        background: rgba(15, 23, 42, 0.90); backdrop-filter: blur(16px);
        border: 1px solid rgba(6,182,212,0.3); border-radius: 16px 16px 0 16px;
        padding: 14px; width: 280px; transform-origin: bottom right; pointer-events: auto;
        box-shadow: 0 12px 32px rgba(0,0,0,0.5), inset 0 0 16px rgba(6,182,212,0.08);
    }

    .radar-track { background: #1E293B; height: 5px; border-radius: 3px; overflow: hidden; margin-top: 4px; }
    .radar-fill { height: 100%; background: linear-gradient(90deg, #4F46E5, #22D3EE); transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 3px; }
`;

// ============================================================================
// COMPONENT
// ============================================================================
export default function MaiaLiveCopilot({ patient, liveMaiaFeedback, historyLength, isEmergency }) {
    const [expanded, setExpanded] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // 🧠 Extract Cortana Protocol data
    const diagData = liveMaiaFeedback?.diagnosticConfidence || {};
    const confidence = diagData.confidence || 0;
    const isLocked = confidence >= 85;
    const topDiagnosis = diagData.topDiagnosis || 'Mengumpulkan Data...';

    const alerts = liveMaiaFeedback?.alerts || [];
    const activeAlert = alerts[0] || null;
    const isCritical = activeAlert?.priority === 'critical';

    // Determine orb visual state
    let orbState = 'idle';
    if (isCritical) orbState = 'critical';
    else if (isLocked) orbState = 'locked';
    else if (historyLength > 1 && confidence < 85) orbState = 'thinking';

    // Auto-expand on critical alerts or first significant feedback
    useEffect(() => {
        if (isCritical) setExpanded(true);
    }, [isCritical]);

    // Auto-expand once when radar first moves
    useEffect(() => {
        if (confidence > 15 && !hasInteracted) {
            setExpanded(true);
            setHasInteracted(true);
        }
    }, [confidence, hasInteracted]);

    const togglePanel = useCallback(() => {
        setExpanded(prev => !prev);
        setHasInteracted(true);
    }, []);

    if (!patient || !liveMaiaFeedback) return null;

    // Build whisper text
    let whisperIcon = <Sparkles size={14} className="text-indigo-400" />;
    let whisperText = '"Memantau parameter klinis. Lanjutkan investigasi, Dokter."';
    let whisperClass = 'opacity-60';

    if (isCritical) {
        whisperIcon = <ShieldAlert size={14} className="text-rose-500" />;
        whisperText = `"${activeAlert.message}"`;
        whisperClass = 'text-rose-400 font-bold not-italic';
    } else if (activeAlert) {
        whisperIcon = <Zap size={14} className="text-amber-500" />;
        whisperText = `"${activeAlert.message}"`;
        whisperClass = 'text-amber-300';
    } else if (isLocked && patient.hidden?.maiaInsight) {
        whisperIcon = <Sparkles size={14} className="text-emerald-400" />;
        whisperText = `"${patient.hidden.maiaInsight}"`;
        whisperClass = 'text-emerald-300';
    }

    // Suggestion pill
    const suggestion = liveMaiaFeedback?.examLabSuggestions?.examSuggestions?.[0];

    return (
        <div className="maia-container select-none">
            <style dangerouslySetInnerHTML={{ __html: MAIA_HUD_CSS }} />

            {/* 📊 THE PROACTIVE HUD PANEL */}
            {expanded && (
                <div
                    className={`maia-panel transition-all duration-300 ${
                        isCritical ? '!border-rose-500/60 shadow-[0_0_24px_rgba(225,29,72,0.3)]'
                        : isLocked ? '!border-emerald-500/50' : ''
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 border-b border-slate-700/50 pb-2">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                isCritical ? 'bg-rose-500' : isLocked ? 'bg-emerald-400' : 'bg-cyan-400'
                            }`} />
                            <span className={`text-[9px] font-mono font-black uppercase tracking-[0.15em] ${
                                isCritical ? 'text-rose-400' : isLocked ? 'text-emerald-400' : 'text-cyan-400'
                            }`}>
                                M.A.I.A // {isCritical ? 'OVERRIDE' : isLocked ? 'LOCKED' : 'NEURAL LINK'}
                            </span>
                        </div>
                        <button onClick={togglePanel} className="text-slate-500 hover:text-slate-300 text-xs pointer-events-auto">✕</button>
                    </div>

                    {/* 🗣️ Whisper (Dynamic Dialogue) */}
                    <div className="text-slate-200 text-[11px] font-serif italic leading-relaxed mb-3 min-h-[32px] flex items-start gap-2">
                        <div className="mt-0.5 shrink-0">{whisperIcon}</div>
                        <span className={whisperClass}>{whisperText}</span>
                    </div>

                    {/* 🌟 HACK 1: BAYESIAN RADAR */}
                    {!isCritical && (
                        <div className="bg-[#020617]/60 rounded-lg p-3 border border-slate-800/80">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <Target size={9}/> DIAGNOSTIC LOCK
                                </span>
                                <span className={`text-[11px] font-black font-mono ${isLocked ? 'text-emerald-400' : 'text-cyan-400'}`}>
                                    {Math.round(confidence)}%
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-bold text-white mb-1 uppercase tracking-wide">
                                <span className="truncate max-w-[160px]">{topDiagnosis}</span>
                                {isLocked && <Lock size={11} className="text-emerald-500 shrink-0" />}
                            </div>

                            <div className="radar-track">
                                <div
                                    className={`radar-fill ${isLocked ? '!bg-emerald-500 shadow-[0_0_8px_#10B981]' : ''}`}
                                    style={{ width: `${Math.min(100, confidence)}%` }}
                                />
                            </div>

                            {/* Proactive suggestion pill */}
                            {suggestion && !isLocked && (
                                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5">
                                    <Target size={9} className="text-cyan-500 shrink-0" />
                                    <span className="text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest truncate">
                                        SARAN: {suggestion.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 🤖 THE CORE ORB */}
            <div className="relative">
                <div className={`maia-ring ${isCritical ? '!border-rose-500/60 !animate-[maia-spin_2s_linear_infinite_reverse]' : ''}`} />
                <div className={`maia-orb ${orbState}`} onClick={togglePanel} title="Toggle M.A.I.A Neural Link">
                    {isCritical
                        ? <ShieldAlert size={22} color="#fff" />
                        : <BrainCircuit size={22} color={isLocked ? '#064E3B' : '#fff'} />
                    }
                </div>
            </div>
        </div>
    );
}
