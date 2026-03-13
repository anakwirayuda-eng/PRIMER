/**
 * TimeController — Luxury Glassmorphism time control panel
 * Inspired by Two Point Hospital + Mini Metro
 * 
 * Features:
 * - Sliding pill highlight with physics bounce curve
 * - Discrete speed buttons with dot indicators  
 * - Animated clock with pulsing colon
 * - Visual state changes for paused/playing/system
 */
import React, { useEffect } from 'react';
import { Play, Pause, FastForward, AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { soundManager } from '../utils/SoundManager.js';

const TC_STYLE_ID = 'tc-luxury-styles';

const TC_CSS = `
    .tc-panel {
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        padding: 4px 6px 4px 16px;
        display: flex; align-items: center; gap: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05);
        user-select: none;
        transition: all 0.3s ease;
    }
    .tc-panel.tc-system {
        border-color: rgba(225, 29, 72, 0.5);
        background: rgba(30, 10, 15, 0.9);
        box-shadow: 0 10px 30px rgba(225, 29, 72, 0.2);
    }

    .tc-clock-wrapper {
        display: flex; flex-direction: column;
        align-items: flex-end; justify-content: center;
    }
    .tc-day-label {
        font-size: 9px; color: rgba(255,255,255,0.4);
        letter-spacing: 0.2em; margin-bottom: 2px; font-weight: bold;
    }
    .tc-clock {
        font-family: 'Courier New', monospace;
        font-size: 22px; font-weight: 900; letter-spacing: 0.1em;
        display: flex; align-items: center; line-height: 1;
        padding-right: 12px; margin-right: 4px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        transition: color 0.3s ease;
    }
    .tc-clock.tc-playing { color: #10B981; text-shadow: 0 0 12px rgba(16, 185, 129, 0.5); }
    .tc-clock.tc-paused { color: #F59E0B; text-shadow: 0 0 12px rgba(245, 158, 11, 0.5); }
    .tc-clock.tc-system { color: #E11D48; text-shadow: 0 0 12px rgba(225, 29, 72, 0.5); }

    .tc-colon {
        animation: tc-pulse-colon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        margin: 0 2px; transform: translateY(-1px);
    }
    .tc-clock.tc-paused .tc-colon,
    .tc-clock.tc-system .tc-colon { animation: none; opacity: 1; }
    @keyframes tc-pulse-colon { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

    .tc-controls {
        display: flex; position: relative;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 999px; padding: 4px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
    }

    /* Sliding Pill */
    .tc-pill {
        position: absolute; top: 4px; bottom: 4px;
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
        height: 32px; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        background: transparent; border: none;
        color: rgba(255, 255, 255, 0.4);
        cursor: pointer; transition: color 0.2s;
    }
    .tc-btn:hover:not(:disabled) { color: rgba(255, 255, 255, 0.9); }
    .tc-btn.tc-active { color: #fff; }
    .tc-btn:disabled { cursor: not-allowed; opacity: 0.3; }

    .tc-dots { display: flex; gap: 2px; margin-top: 3px; }
    .tc-dot {
        width: 4px; height: 4px; border-radius: 50%;
        background: currentColor; opacity: 0.4;
    }
    .tc-btn.tc-active .tc-dot { opacity: 1; box-shadow: 0 0 4px currentColor; }
`;

// Pill positions: [left offset, width] for each button
const POSITIONS = [
    { left: 4, w: 40 },   // pause
    { left: 44, w: 44 },  // 1x
    { left: 88, w: 48 },  // 2x
    { left: 136, w: 56 }, // 4x
];

export default function TimeController() {
    const ctx = useGame();
    const { gameState, setGameState, time, day, setGameSpeed } = ctx;
    const gameSpeed = ctx.gameSpeed || 1;
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

    const hours = String(Math.floor((time || 0) / 60)).padStart(2, '0');
    const minutes = String(Math.floor((time || 0) % 60)).padStart(2, '0');

    // Determine active button index
    let activeIdx = 0; // paused
    if (!isEffectivelyPaused) {
        if (gameSpeed === 1) activeIdx = 1;
        else if (gameSpeed === 2) activeIdx = 2;
        else if (gameSpeed >= 4) activeIdx = 3;
    }
    const pillStyle = POSITIONS[activeIdx];

    const handleSetSpeed = (speed) => {
        if (isRuntimeTrap) return;
        try { soundManager.playClick?.(); } catch (_) {}

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

    return (
        <div className={`tc-panel ${isRuntimeTrap ? 'tc-system' : ''}`}>
            <div className="tc-clock-wrapper">
                <span className="tc-day-label">HARI {day || 1}</span>
                <div className={`tc-clock ${statusType}`}>
                    {isRuntimeTrap && <AlertTriangle size={18} style={{ marginRight: 8, animation: 'tc-pulse-colon 1s infinite' }} />}
                    {hours}<span className="tc-colon">:</span>{minutes}
                </div>
            </div>

            <div className="tc-controls">
                <div
                    className={`tc-pill ${statusType}`}
                    style={{ transform: `translateX(${pillStyle.left}px)`, width: `${pillStyle.w}px` }}
                />

                <button
                    className={`tc-btn ${activeIdx === 0 ? 'tc-active' : ''}`}
                    style={{ width: 40 }}
                    onClick={() => handleSetSpeed(0)}
                    disabled={isRuntimeTrap}
                    title="Jeda (Space)"
                >
                    <Pause size={14} fill={activeIdx === 0 ? "currentColor" : "none"} />
                </button>

                <button
                    className={`tc-btn ${activeIdx === 1 ? 'tc-active' : ''}`}
                    style={{ width: 44 }}
                    onClick={() => handleSetSpeed(1)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Normal"
                >
                    <Play size={14} fill={activeIdx === 1 ? "currentColor" : "none"} />
                    <div className="tc-dots"><div className="tc-dot" /></div>
                </button>

                <button
                    className={`tc-btn ${activeIdx === 2 ? 'tc-active' : ''}`}
                    style={{ width: 48 }}
                    onClick={() => handleSetSpeed(2)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Ganda"
                >
                    <FastForward size={14} fill={activeIdx === 2 ? "currentColor" : "none"} />
                    <div className="tc-dots"><div className="tc-dot" /><div className="tc-dot" /></div>
                </button>

                <button
                    className={`tc-btn ${activeIdx === 3 ? 'tc-active' : ''}`}
                    style={{ width: 56 }}
                    onClick={() => handleSetSpeed(4)}
                    disabled={isRuntimeTrap}
                    title="Kecepatan Maksimal"
                >
                    <FastForward size={16} fill={activeIdx === 3 ? "currentColor" : "none"} />
                    <div className="tc-dots">
                        <div className="tc-dot" /><div className="tc-dot" />
                        <div className="tc-dot" /><div className="tc-dot" />
                    </div>
                </button>
            </div>
        </div>
    );
}
