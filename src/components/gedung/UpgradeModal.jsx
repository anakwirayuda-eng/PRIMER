/**
 * @reflection
 * [IDENTITY]: UpgradeModal
 * [PURPOSE]: Modal component for confirmation of building upgrades.
 * [STATE]: Experimental
 * [ANCHOR]: UpgradeModal
 */

import React from 'react';
import { Hammer, ArrowUp } from 'lucide-react';
import useModalA11y from '../../hooks/useModalA11y.js';

const UpgradeModal = ({ room, currentLevel, isUpgrading, onUpgrade, onCancel }) => {
    const modalRef = useModalA11y(onCancel);
    if (!room) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upgrade-title"
                className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/[0.1] shadow-2xl shadow-black/50"
                onClick={e => e.stopPropagation()}
            >
                {/* Room Info */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{room.icon}</div>
                    <h2 id="upgrade-title" className="font-display text-xl font-black text-white uppercase tracking-tight">
                        Upgrade {room.name}
                    </h2>
                    <p className="text-indigo-300/60 text-sm mt-1">
                        Level {currentLevel} → {currentLevel + 1}
                    </p>
                </div>

                {/* Cost Panel */}
                <div className="bg-white/[0.04] rounded-2xl p-4 mb-6 border border-white/[0.08] space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Biaya Upgrade</span>
                        <span className="font-data text-lg font-black text-amber-400">
                            Rp {room.cost.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Bonus</span>
                        <span className="text-sm font-bold text-emerald-400">{room.effect}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/60 font-bold text-sm hover:bg-white/[0.1] transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => onUpgrade(room)}
                        disabled={isUpgrading}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isUpgrading
                            ? 'bg-white/[0.06] text-white/30 cursor-wait'
                            : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:scale-[1.02]'
                            }`}
                    >
                        {isUpgrading ? (
                            <><Hammer className="animate-bounce" size={16} /> Membangun...</>
                        ) : (
                            <><ArrowUp size={16} /> Upgrade</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
