/**
 * @reflection
 * [IDENTITY]: RoomCard
 * [PURPOSE]: Holographic UI card for displaying building room status and upgrade trigger.
 * [STATE]: Experimental
 * [ANCHOR]: RoomCard
 */

import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { ACCENT_MAP } from '../../data/FacilityData.js';

const RoomCard = ({ room, currentLevel, onSelect, isSelected }) => {
    const a = ACCENT_MAP[room.accent] || ACCENT_MAP.emerald;
    const lvl = currentLevel || room.level;
    const isMaxed = lvl >= room.maxLevel;
    const _pct = (lvl / room.maxLevel) * 20 + 20; // visual representation reserved for future tooltip

    return (
        <button
            onClick={() => !room.locked && onSelect(room)}
            disabled={room.locked}
            className={`group relative p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] transition-all duration-300 text-left overflow-hidden
            ${room.locked ? 'opacity-40 cursor-not-allowed' : `hover:${a.bg} hover:border-white/20 cursor-pointer`}
            ${isSelected ? `${a.bg} ring-1 ${a.ring}` : ''}
        `}
        >
            {/* Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${a.glow} rounded-full -mr-8 -mt-8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
                {/* Icon + Level */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl filter drop-shadow-sm">{room.icon}</span>
                    {room.locked ? (
                        <Lock size={16} className="text-white/20" />
                    ) : isMaxed ? (
                        <div className="bg-emerald-500/20 p-1 rounded-full border border-emerald-500/30">
                            <CheckCircle size={12} className="text-emerald-400" />
                        </div>
                    ) : (
                        <span className={`font-data text-[10px] font-black px-2 py-0.5 rounded-lg ${a.bg} ${a.text} border ${a.border}`}>
                            Lv.{lvl}
                        </span>
                    )}
                </div>

                {/* Name + Effect */}
                <h3 className="text-xs font-black text-white/80 uppercase tracking-tight mb-0.5">{room.name}</h3>
                <p className="text-[9px] text-white/30 font-medium mb-3 leading-tight">{room.effect}</p>

                {/* Progress */}
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${a.bar} rounded-full transition-all duration-700`}
                        style={{ width: `${(lvl / room.maxLevel) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-white/20 font-mono">{lvl}/{room.maxLevel}</span>
                    {!room.locked && !isMaxed && (
                        <span className="text-[8px] text-amber-400/60 font-bold">
                            Rp {(room.cost / 1000000).toFixed(0)}M
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default RoomCard;
