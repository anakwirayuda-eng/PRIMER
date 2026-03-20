/**
 * TimeController — Luxury Glassmorphism time control panel
 * Inspired by Two Point Hospital + Mini Metro + Plague Inc
 * 
 * Features:
 * - Calendar date display (DD-M-YYYY)
 * - Sliding pill highlight with physics bounce curve
 * - Discrete speed buttons with chevron indicators  
 * - Visual state changes for paused/playing/system
 */
import React, { useEffect, useMemo } from 'react';
import { Play, Pause, ChevronRight, AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { soundManager } from '../utils/SoundManager.js';
import { getDayDate, CALENDAR_EVENTS } from '../data/CalendarEventDB.js';

const TC_STYLE_ID = 'tc-luxury-styles';

const TC_CSS = `
    .tc-panel {
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        padding: 4px 6px 4px 16px;
        display: flex; align-items: center; gap: 4px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05);
        user-select: none;
        transition: all 0.3s ease;
    }
    .tc-panel.tc-system {
        border-color: rgba(225, 29, 72, 0.5);
        background: rgba(30, 10, 15, 0.9);
        box-shadow: 0 10px 30px rgba(225, 29, 72, 0.2);
    }

    /* ── Date Section ── */
    .tc-date {
        font-family: 'Courier New', monospace;
        font-size: 17px; font-weight: 900; letter-spacing: 0.05em;
        display: flex; align-items: center; line-height: 1;
        padding-right: 10px; margin-right: 2px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        transition: color 0.3s ease;
        white-space: nowrap;
    }
    .tc-date.tc-playing { color: #e2e8f0; }
    .tc-date.tc-paused { color: #F59E0B; text-shadow: 0 0 12px rgba(245, 158, 11, 0.4); }
    .tc-date.tc-system { color: #E11D48; text-shadow: 0 0 12px rgba(225, 29, 72, 0.5); }

    .tc-date-sep {
        opacity: 0.35; margin: 0 1px;
    }

    /* ── Controls ── */
    .tc-controls {
        display: flex; position: relative;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 999px; padding: 3px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
    }

    /* Sliding Pill */
    .tc-pill {
        position: absolute; top: 3px; bottom: 3px;
        border-radius: 999px; z-index: 1;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                    width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                    background 0.3s, box-shadow 0.3s;
    }
    .tc-pill.tc-playing {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.4);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 8px rgba(16,185,129,0.2);
    }
    .tc-pill.tc-paused {
        background: rgba(245, 158, 11, 0.2);
        border: 1px solid rgba(245, 158, 11, 0.4);
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
    }
    .tc-pill.tc-system {
        background: rgba(225, 29, 72, 0.2);
        border: 1px solid rgba(225, 29, 72, 0.4);
        box-shadow: 0 0 15px rgba(225, 29, 72, 0.3);
    }

    .tc-btn {
        position: relative; z-index: 2;
        height: 30px; display: flex;
        align-items: center; justify-content: center;
        background: transparent; border: none;
        color: rgba(255, 255, 255, 0.35);
        cursor: pointer; transition: color 0.2s;
        padding: 0;
    }
    .tc-btn:hover:not(:disabled) { color: rgba(255, 255, 255, 0.9); }
    .tc-btn.tc-active { color: #fff; }
    .tc-btn:disabled { cursor: not-allowed; opacity: 0.3; }

    /* Speed chevron stacks */
    .tc-chevrons {
        display: flex; align-items: center;
        margin: 0 -3px;
    }
    .tc-chevrons svg {
        margin: 0 -4px;
    }
`;

// Pill positions: [left offset, width] for each button
const POSITIONS = [
    { left: 3, w: 34 },   // pause
    { left: 37, w: 34 },  // 1x
    { left: 71, w: 38 },  // 2x
    { left: 109, w: 42 }, // 3x
    { left: 151, w: 48 }, // 4x
];

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function TimeController({ onOpenCalendar }) {
    const ctx = useGame();
    const { gameState, setGameState, day, setGameSpeed } = ctx;
    const gameSpeed = ctx.gameSpeed ?? 1;
    const gameOver = ctx.gameOver;

    const isRuntimeTrap = gameState === 'paused' && gameOver?.type === 'runtime_trap';
    const isEffectivelyPaused = gameState === 'paused' || gameState !== 'playing';
    const statusType = isRuntimeTrap ? 'tc-system' : (isEffectivelyPaused ? 'tc-paused' : 'tc-playing');

    // Inject styles once
    useEffect(() => {
        if (!document.getElementById(TC_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = TC_STYLE_ID;
            style.textContent = TC_CSS;
            document.head.appendChild(style);
        }
    }, []);

    // BGM volume fade on pause
    useEffect(() => {
        try {
            if (isEffectivelyPaused) soundManager.pause?.();
            else soundManager.resume?.();
        } catch (_) { /* sound not critical */ }
    }, [isEffectivelyPaused]);

    // Compute calendar date from day number
    const time = ctx.time ?? 480;

    const dateDisplay = useMemo(() => {
        const date = getDayDate(day ?? 1);
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const dayName = HARI[date.getDay()];
        const totalMinutes = Math.floor(time);
        const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
        const mm = String(totalMinutes % 60).padStart(2, '0');
        return { d, m, y, hh, mm, dayName };
    }, [day, Math.floor(time)]); // Floor prevents re-render on fractional changes

    // Calendar events for today (now array-based)
    const todayEvents = useMemo(() => {
        const events = CALENDAR_EVENTS?.[day];
        return (Array.isArray(events) && events.length > 0) ? events : null;
    }, [day]);

    const [showTooltip, setShowTooltip] = React.useState(false);

    // Determine active button index
    let activeIdx = 0; // paused
    if (!isEffectivelyPaused) {
        if (gameSpeed === 1) activeIdx = 1;
        else if (gameSpeed === 2) activeIdx = 2;
        else if (gameSpeed === 3) activeIdx = 3;
        else if (gameSpeed >= 4) activeIdx = 4;
    }
    const pillStyle = POSITIONS[activeIdx];

    const handleSetSpeed = (speed) => {
        if (isRuntimeTrap) return;
        try { soundManager.playClick?.(); } catch (_) { }

        if (speed === 0) {
            setGameState('paused');
        } else {
            if (gameState !== 'playing') setGameState('playing');
            setGameSpeed(speed);
        }
    };

    // Keyboard shortcut: Space to toggle pause
    useEffect(() => {
        const onKey = (e) => {
            if (e.repeat) return; // Anti-machine-gun: reject held spacebar
            if (e.code === 'Space' && !e.target.closest('input, textarea, select, [contenteditable]')) {
                e.preventDefault();
                if (isRuntimeTrap) return;
                if (gameState === 'playing') setGameState('paused');
                else if (gameState === 'paused') setGameState('playing');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [gameState, isRuntimeTrap, setGameState]);

    // Chevron helper — renders N chevrons stacked tight
    const Chevrons = ({ count, size = 13 }) => (
        <div className="tc-chevrons">
            {Array.from({ length: count }, (_, i) => (
                <ChevronRight key={i} size={size} strokeWidth={2.5} />
            ))}
        </div>
    );

    return (
        <div className={`tc-panel ${isRuntimeTrap ? 'tc-system' : ''}`}>
            {/* Date + Time Display */}
            <div
                className={`tc-date ${statusType}`}
                onClick={() => { if (onOpenCalendar) onOpenCalendar(); else setShowTooltip(!showTooltip); }}
                onMouseEnter={() => { if (todayEvents) setShowTooltip(true); }}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ cursor: 'pointer', position: 'relative' }}
            >
                {isRuntimeTrap && <AlertTriangle size={16} style={{ marginRight: 8, animation: 'tc-pulse-colon 1s infinite' }} />}
                <span style={{ opacity: 0.5, marginRight: 6, fontSize: '14px' }}>{dateDisplay.dayName}</span>
                {dateDisplay.d}<span className="tc-date-sep">-</span>{dateDisplay.m}<span className="tc-date-sep">-</span>{dateDisplay.y}
                <span className="tc-date-sep" style={{ marginLeft: 8, marginRight: 4 }}>|</span>
                {dateDisplay.hh}<span className="tc-date-sep" style={{ opacity: 0.6 }}>:</span>{dateDisplay.mm}

                {/* Calendar tooltip */}
                {showTooltip && todayEvents && (
                    <div style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        marginTop: 8, padding: '8px 14px', borderRadius: 10,
                        background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(16,185,129,0.3)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
                        fontSize: 13, color: '#e2e8f0', zIndex: 100,
                    }}>
                        {todayEvents.map((ev, i) => (
                            <div key={i} style={{ marginTop: i > 0 ? 6 : 0 }}>
                                <div style={{ fontWeight: 700, color: '#10b981' }}>{ev.emoji || '📅'} {ev.title}</div>
                                <div style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>{ev.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Speed Controls */}
            <div className="tc-controls">
                <div
                    className={`tc-pill ${statusType}`}
                    style={{ transform: `translateX(${pillStyle.left}px)`, width: `${pillStyle.w}px` }}
                />

                {/* Pause */}
                <button
                    className={`tc-btn ${activeIdx === 0 ? 'tc-active' : ''}`}
                    style={{ width: 34 }}
                    onClick={() => handleSetSpeed(0)}
                    disabled={isRuntimeTrap}
                    title="Jeda (Space)"
                >
                    <Pause size={13} fill={activeIdx === 0 ? "currentColor" : "none"} />
                </button>

                {/* 1x — ▶ */}
                <button
                    className={`tc-btn ${activeIdx === 1 ? 'tc-active' : ''}`}
                    style={{ width: 34 }}
                    onClick={() => handleSetSpeed(1)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Normal"
                >
                    <Play size={13} fill={activeIdx === 1 ? "currentColor" : "none"} />
                </button>

                {/* 2x — ▶▶ */}
                <button
                    className={`tc-btn ${activeIdx === 2 ? 'tc-active' : ''}`}
                    style={{ width: 38 }}
                    onClick={() => handleSetSpeed(2)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Ganda"
                >
                    <Chevrons count={2} />
                </button>

                {/* 3x — ▶▶▶ */}
                <button
                    className={`tc-btn ${activeIdx === 3 ? 'tc-active' : ''}`}
                    style={{ width: 42 }}
                    onClick={() => handleSetSpeed(3)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Tinggi"
                >
                    <Chevrons count={3} />
                </button>

                {/* 4x — ▶▶▶▶ */}
                <button
                    className={`tc-btn ${activeIdx === 4 ? 'tc-active' : ''}`}
                    style={{ width: 48 }}
                    onClick={() => handleSetSpeed(4)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Maksimal"
                >
                    <Chevrons count={4} size={14} />
                </button>
            </div>
        </div>
    );
}
