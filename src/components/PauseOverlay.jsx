/**
 * PauseOverlay — Frosted glass overlay when game is paused
 * 
 * Shows a breathing "WAKTU DIJEDA" badge with ambient visual cue.
 * Distinguishes between user pause and system/runtime trap pause.
 * pointer-events: none so player can still click the TimeController to unpause.
 */
import React, { useEffect, useState } from 'react';
import { Pause, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';

const PO_STYLE_ID = 'po-overlay-styles';

const PO_CSS = `
    @keyframes po-fade-in {
        from { opacity: 0; backdrop-filter: blur(0px); }
        to { opacity: 1; backdrop-filter: blur(6px); }
    }
    @keyframes po-breathe {
        0%, 100% {
            transform: scale(1) translateY(-20px);
            opacity: 0.95;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        50% {
            transform: scale(1.02) translateY(-20px);
            opacity: 1;
        }
    }

    .po-backdrop {
        position: fixed; inset: 0; z-index: 40;
        background: radial-gradient(circle at center, transparent 0%, rgba(2,6,23,0.4) 100%);
        pointer-events: none;
        animation: po-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        display: flex; align-items: center; justify-content: center;
    }

    .po-badge {
        background: rgba(15, 23, 42, 0.95);
        border: 2px solid;
        padding: 20px 48px;
        border-radius: 100px;
        display: flex; align-items: center; gap: 20px;
        animation: po-breathe 3s ease-in-out infinite;
        pointer-events: auto;
    }

    .po-badge.po-user {
        border-color: rgba(245, 158, 11, 0.6);
        box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
    }
    .po-badge.po-system {
        border-color: rgba(225, 29, 72, 0.6);
        box-shadow: 0 0 30px rgba(225, 29, 72, 0.15);
        animation-duration: 1.5s;
    }

    .po-title {
        font-family: 'Courier New', monospace;
        font-weight: 900; font-size: 28px;
        letter-spacing: 0.3em; margin: 0; line-height: 1;
        color: #fff;
    }
    .po-subtitle {
        font-family: sans-serif; font-size: 11px;
        letter-spacing: 0.2em; margin-top: 6px;
        text-transform: uppercase; font-weight: bold;
    }
`;

export default function PauseOverlay() {
    const { gameState, gameOver } = useGame();
    const [visible, setVisible] = useState(false);

    const isRuntimeTrap = gameState === 'paused' && gameOver?.type === 'runtime_trap';
    const isEffectivelyPaused = gameState === 'paused';

    // Delay show slightly (avoid flash during fast state transitions)
    useEffect(() => {
        if (isEffectivelyPaused) {
            const t = setTimeout(() => setVisible(true), 150);
            return () => clearTimeout(t);
        } else {
            setVisible(false);
        }
    }, [isEffectivelyPaused]);

    // Inject styles once
    useEffect(() => {
        if (!document.getElementById(PO_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = PO_STYLE_ID;
            style.textContent = PO_CSS;
            document.head.appendChild(style);
        }
    }, []);

    if (!visible) return null;

    return (
        <div className="po-backdrop">
            <div className={`po-badge ${isRuntimeTrap ? 'po-system' : 'po-user'}`}>
                {isRuntimeTrap
                    ? <ShieldAlert size={40} color="#FB7185" />
                    : <Pause size={40} color="#FBBF24" fill="#FBBF24" />
                }
                <div>
                    <h2 className="po-title">
                        {isRuntimeTrap ? 'SISTEM JEDA' : 'WAKTU DIJEDA'}
                    </h2>
                    <div
                        className="po-subtitle"
                        style={{ color: isRuntimeTrap ? '#FDA4AF' : '#FCD34D' }}
                    >
                        {isRuntimeTrap
                            ? 'MENYELESAIKAN PROSES KLINIS...'
                            : 'TEKAN SPACE ATAU ▶ UNTUK MELANJUTKAN'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
