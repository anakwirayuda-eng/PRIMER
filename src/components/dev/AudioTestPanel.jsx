/**
 * @reflection
 * [IDENTITY]: AudioTestPanel
 * [PURPOSE]: DEV-only floating panel for triggering all SFX + BGM controls during playtest. Hidden in production builds.
 * [STATE]: Stable
 * [ANCHOR]: AudioTestPanel
 * [DEPENDS_ON]: SoundManager
 * [LAST_UPDATE]: 2026-04-26
 */

import React, { useState } from 'react';
import { soundManager } from '../../utils/SoundManager.js';

const SFX_GROUPS = [
    {
        title: 'FM Synth UI',
        items: [
            { name: 'Cursor (UI tick, 80ms)', method: 'playCursor' },
            { name: 'Confirm (chord shimmer)', method: 'playConfirm' },
            { name: 'Cancel (pitch drop)', method: 'playCancel' },
            { name: 'Notification (arpeggio)', method: 'playNotification' },
            { name: 'Success (major stab)', method: 'playSuccess' },
            { name: 'Error (buzzer)', method: 'playError' },
            { name: 'Emergency (siren)', method: 'playEmergency' },
        ],
    },
    {
        title: 'IEC 60601-1-8 Clinical Alarms',
        items: [
            { name: '🚨 Critical Alarm (1 kHz, 5×2 burst)', method: 'playCriticalAlarm' },
            { name: '⚠️ Medium Alarm (800 Hz, 3-pulse)', method: 'playMediumAlarm' },
            { name: 'Flatline (800 Hz, 3s)', method: 'playFlatline' },
            { name: '🖤 Respectful Silence (full sequence)', method: 'playRespectfulSilence' },
        ],
    },
    {
        title: 'Diegetic Clinical UI',
        items: [
            { name: 'Paper rustle', method: 'playPaperRustle' },
            { name: 'Pen scratch', method: 'playPenScratch' },
            { name: 'Stamp confirm (thud + tick)', method: 'playStampConfirm' },
        ],
    },
    {
        title: 'Environmental Stingers',
        items: [
            { name: '☀️ Day start (ascending C5-E5-G5)', method: 'playDayStart' },
            { name: '🌙 Day end (descending G4-E4-C4)', method: 'playDayEnd' },
            { name: '⭐ Level up (gamelan glissando)', method: 'playLevelUp' },
            { name: '🚪 Scene enter (woosh + chime)', method: 'playSceneEnter' },
        ],
    },
];

const BGM_CONTROLS = [
    { label: '▶ Play BGM (day=1)', action: () => soundManager.playBGM(1) },
    { label: '🎲 Play random BGM', action: () => soundManager.playRandomBGM() },
    { label: '⏸ Pause BGM', action: () => soundManager.pauseBGM() },
    { label: '↻ Resume BGM', action: () => soundManager.resumeFromPause() },
    { label: '⏹ Stop BGM', action: () => soundManager.stopBGM() },
];

const TOGGLES = [
    { label: 'Toggle Duck (50%)', getter: () => soundManager.ducked, action: () => soundManager.setDucked(!soundManager.ducked) },
    { label: 'Toggle Focus Mode', getter: () => soundManager.focusMode, action: () => soundManager.setFocusMode(!soundManager.focusMode) },
    { label: 'Toggle Mute', getter: () => soundManager.muted, action: () => soundManager.toggleMute() },
];

// Visible in DEV, or on ANY build (incl. Vercel preview) via `?audiotest`
// query param — lets reviewers/AG audition every SFX on the deployed preview
// without a local checkout. Hidden by default in production.
function isAudioTestEnabled() {
    if (import.meta.env.DEV) return true;
    if (typeof window === 'undefined') return false;
    try {
        return new URLSearchParams(window.location.search).has('audiotest');
    } catch {
        return false;
    }
}

export default function AudioTestPanel() {
    const [open, setOpen] = useState(false);
    const [, force] = useState(0); // force re-render after toggle
    const refresh = () => force((n) => n + 1);

    if (!isAudioTestEnabled()) return null;

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-4 left-4 z-[100] bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg opacity-40 hover:opacity-100 transition"
                title="Open Audio Test Panel (DEV only)"
            >
                🔊 Audio Test
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-[100] bg-slate-900/95 text-white p-4 rounded-xl shadow-2xl max-w-xs max-h-[85vh] overflow-y-auto border border-purple-700">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
                <h3 className="font-bold text-xs uppercase tracking-wider">🔊 Audio Test (DEV)</h3>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-lg leading-none">×</button>
            </div>

            {SFX_GROUPS.map((group) => (
                <div key={group.title} className="mb-3">
                    <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1.5 font-bold">{group.title}</div>
                    <div className="grid grid-cols-1 gap-0.5">
                        {group.items.map(({ name, method }) => (
                            <button
                                key={method}
                                onClick={() => soundManager[method]?.()}
                                className="text-[11px] text-left px-2 py-1 rounded hover:bg-slate-700 transition"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mb-3">
                <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1.5 font-bold">BGM Controls</div>
                <div className="grid grid-cols-1 gap-0.5">
                    {BGM_CONTROLS.map(({ label, action }) => (
                        <button
                            key={label}
                            onClick={action}
                            className="text-[11px] text-left px-2 py-1 rounded hover:bg-slate-700 transition"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1.5 font-bold">Toggles</div>
                <div className="grid grid-cols-1 gap-0.5">
                    {TOGGLES.map(({ label, getter, action }) => {
                        const active = !!getter();
                        return (
                            <button
                                key={label}
                                onClick={() => { action(); refresh(); }}
                                className={`text-[11px] text-left px-2 py-1 rounded transition flex justify-between items-center ${active ? 'bg-purple-700 hover:bg-purple-600' : 'hover:bg-slate-700'}`}
                            >
                                <span>{label}</span>
                                <span className="text-[9px] opacity-70">{active ? 'ON' : 'OFF'}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-700 text-[9px] text-slate-500">
                <div>masterVolume: {soundManager.masterVolume?.toFixed(2)}</div>
                <div>bgmVolume: {soundManager.bgmVolume?.toFixed(2)}</div>
                <div>sfxVolume: {soundManager.sfxVolume?.toFixed(2)}</div>
                <div>BGM tracks: {soundManager.bgmTracks?.length || 0}</div>
            </div>
        </div>
    );
}
