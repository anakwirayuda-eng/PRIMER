/**
 * @reflection
 * [IDENTITY]: BodyMapWidget
 * [PURPOSE]: Module: BodyMapWidget
 * [STATE]: Experimental
 * [ANCHOR]: BodyMapWidget
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { Activity, Zap, Info, Search, Heart, CircleDot } from 'lucide-react';

const BodyMapWidget = ({ examsPerformed, onExam, isDark }) => {
    // Re-scaled markers for zoomed-in anatomical asset (450x450 square in 200x450 viewBox)
    const regions = [
        { id: 'general', label: 'Umum', x: '50%', y: '4%', icon: Activity, group: 'general' },
        { id: 'heent', label: 'Kepala/Leher', x: '50%', y: '16%', group: 'focus' },
        { id: 'vitals', label: 'Vital', x: '22%', y: '18%', icon: Zap, group: 'general' },
        { id: 'neuro', label: 'Neuro', x: '78%', y: '18%', icon: Zap, group: 'general' },
        { id: 'thorax', label: 'Dada/Paru', x: '50%', y: '32%', group: 'focus' },
        { id: 'heart', label: 'Jantung', x: '62%', y: '35%', group: 'focus' },
        { id: 'abdomen', label: 'Perut', x: '50%', y: '48%', group: 'focus' },
        { id: 'genitalia', label: 'Genitalia', x: '50%', y: '61%', group: 'sensitive' },
        { id: 'extremities', label: 'Ekstremitas', x: '18%', y: '75%', group: 'focus' },
        { id: 'skin', label: 'Kulit', x: '82%', y: '75%', icon: Info, group: 'general' },
    ];

    const getStatusColor = (isDone) => {
        if (isDone) return isDark ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' : 'text-emerald-600 border-emerald-200 bg-emerald-50';
        return isDark ? 'text-slate-400 border-slate-700 bg-slate-800/50 hover:border-blue-500/50 hover:text-blue-400' : 'text-slate-500 border-slate-200 bg-white hover:border-blue-300 hover:text-blue-600';
    };

    return (
        <div className={`relative w-full aspect-[3/5] max-w-md mx-auto rounded-3xl p-4 transition-all duration-700 overflow-hidden ${isDark ? 'bg-slate-950/40 border border-emerald-500/10 shadow-[inset_0_0_30px_rgba(16,185,129,0.05)]' : 'bg-slate-50 border border-slate-200 shadow-inner'}`}>

            {/* Background Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-3xl">
                <svg width="100%" height="100%">
                    <pattern id="hexagons" width="20" height="34.6" patternUnits="userSpaceOnUse" viewBox="0 0 20 34.6">
                        <path d="M10 0 L20 5.77 L20 17.3 L10 23.1 L0 17.3 L0 5.77 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#hexagons)" className={isDark ? 'text-emerald-500' : 'text-slate-800'} />
                </svg>
            </div>

            <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10">
                <h4 className={`text-[9px] font-black uppercase tracking-[0.5em] ${isDark ? 'text-emerald-400/40' : 'text-slate-400'}`}>
                    Anatomical Biometry Core
                </h4>
            </div>

            {/* HIGH FIDELITY ANATOMICAL SILHOUETTE ASSET */}
            <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 450" className="w-full h-full drop-shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <defs>
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        <linearGradient id="scanLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor={isDark ? '#10b981' : '#3b82f6'} stopOpacity="0.4" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Scaled/Centered Anatomical Image Base */}
                    <image
                        href="/anatomical-base.png"
                        x="-125" y="0" width="450" height="450"
                        className="opacity-90"
                    />

                    {/* Interactive Hotspots Layer - Re-aligned to bigger asset */}
                    <g className="cursor-pointer">
                        {/* Head/Neck */}
                        <path d="M75,50 h50 v80 h-50 z" fill="transparent" onClick={() => onExam('heent')} />
                        {/* Thorax */}
                        <path d="M55,130 h90 v80 h-90 z" fill="transparent" onClick={() => onExam('thorax')} />
                        {/* Abdomen */}
                        <path d="M65,210 h70 v80 h-70 z" fill="transparent" onClick={() => onExam('abdomen')} />
                        {/* Legs */}
                        <path d="M40,290 h120 v150 h-120 z" fill="transparent" onClick={() => onExam('extremities')} />
                    </g>

                    {/* Scanning Beam */}
                    <rect x="0" y="0" width="200" height="2" fill="url(#scanLineGrad)" className="animate-scan-svg">
                        <animate attributeName="y" from="20" to="430" dur="4s" repeatCount="indefinite" />
                    </rect>
                </svg>

                {/* UI Markers Alignment */}
                {regions.map((reg) => {
                    const isDone = !!examsPerformed[reg.id];
                    return (
                        <button
                            key={`btn-${reg.id}`}
                            onClick={() => onExam(reg.id)}
                            style={{ left: reg.x, top: reg.y }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-500 group overflow-hidden ${getStatusColor(isDone)} ${isDone ? 'scale-105 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'hover:scale-110 shadow-lg border-current/20'}`}
                        >
                            {/* Marker Hover Decal */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current`} />

                            {isDone ? (
                                <Activity size={10} className="text-emerald-500" />
                            ) : (
                                <CircleDot size={9} className={`opacity-40 group-hover:opacity-100 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                            )}
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap relative z-10">
                                {reg.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Futuristic Telemetry HUD */}
            <div className={`absolute bottom-6 left-6 right-6 flex justify-between items-end ${isDark ? 'text-emerald-500/20' : 'text-slate-300'} pointer-events-none`}>
                <div className="flex flex-col gap-0.5">
                    <div className="w-16 h-[1.5px] bg-current" />
                    <div className="text-[7px] font-mono tracking-widest uppercase italic">Diagnostic Core v4.2</div>
                </div>
                <div className="text-[7px] font-mono uppercase text-right leading-tight opacity-80">
                    Neural Sync: Stable<br />
                    Scan Rank: Perfect<br />
                    Rel: {Object.keys(examsPerformed).length}/{regions.length}
                </div>
            </div>
        </div>
    );
};

export default BodyMapWidget;
