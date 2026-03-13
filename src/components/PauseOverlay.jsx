/**
 * PauseOverlay — Non-blocking floating badge when game is paused
 * 
 * Shows a small "WAKTU DIJEDA" badge at bottom-center.
 * Player can still interact with ALL game UI while paused (superpower mode).
 * Only time/energy/spawns stop — everything else is playable.
 */
import React, { useEffect, useState } from 'react';
import { Pause, ShieldAlert } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';

const PO_STYLE_ID = 'po-overlay-styles';

const PO_CSS = `
    @keyframes po-slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes po-breathe {
        0%, 100% { box-shadow: 0 4px 20px rgba(245, 158, 11, 0.2); }
        50% { box-shadow: 0 4px 30px rgba(245, 158, 11, 0.4); }
    }

    .po-badge-float {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 40;
        pointer-events: none;
        animation: po-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .po-badge-mini {
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 999px;
        padding: 8px 24px;
        display: flex; align-items: center; gap: 10px;
        animation: po-breathe 3s ease-in-out infinite;
    }
    .po-badge-mini.po-system-mini {
        border-color: rgba(225, 29, 72, 0.5);
        animation: none;
        box-shadow: 0 4px 20px rgba(225, 29, 72, 0.3);
    }

    .po-badge-mini .po-text {
        font-family: 'Courier New', monospace;
        font-weight: 900; font-size: 12px;
        letter-spacing: 0.25em;
        color: #FCD34D;
    }
    .po-badge-mini.po-system-mini .po-text {
        color: #FDA4AF;
    }
`;

export default function PauseOverlay() {
    const { gameState, gameOver } = useGame();
    const [visible, setVisible] = useState(false);

    const isRuntimeTrap = gameState === 'paused' && gameOver?.type === 'runtime_trap';
    const isEffectivelyPaused = gameState === 'paused';

    useEffect(() => {
        if (isEffectivelyPaused) {
            const t = setTimeout(() => setVisible(true), 150);
            return () => clearTimeout(t);
        } else {
            setVisible(false);
        }
    }, [isEffectivelyPaused]);

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
        <div className="po-badge-float">
            <div className={`po-badge-mini ${isRuntimeTrap ? 'po-system-mini' : ''}`}>
                {isRuntimeTrap
                    ? <ShieldAlert size={14} color="#FB7185" />
                    : <Pause size={14} color="#FBBF24" fill="#FBBF24" />
                }
                <span className="po-text">
                    {isRuntimeTrap ? 'SISTEM JEDA' : 'WAKTU DIJEDA'}
                </span>
            </div>
        </div>
    );
}
