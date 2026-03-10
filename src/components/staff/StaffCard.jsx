/**
 * @reflection
 * [IDENTITY]: StaffCard
 * [PURPOSE]: UI component to display a summary of a staff member.
 * [STATE]: Experimental
 * [ANCHOR]: StaffCard
 * [DEPENDS_ON]: ThemeContext, LucideIcons
 */

import React from 'react';
import { Star, Lock, Info, Heart } from 'lucide-react';

const StaffCard = ({ staff, isHired = false, isLocked = false, isSelected = false, onSelect, onCoach, onOpenWiki, isDark }) => {
    const morale = staff.morale ?? 70;
    const moraleColor = morale >= 80 ? 'bg-green-500' : morale >= 50 ? 'bg-yellow-500' : morale >= 20 ? 'bg-orange-500' : 'bg-red-500';
    const moraleEmoji = morale >= 80 ? '😊' : morale >= 50 ? '😐' : morale >= 20 ? '😔' : '😫';
    const isBurnout = morale < 20;

    return (
        <div
            onClick={() => !isLocked && onSelect(staff)}
            role="button"
            aria-label={`${isLocked ? 'Terkunci — ' : ''}Pilih staf ${staff.name}, ${staff.type}`}
            tabIndex={isLocked ? -1 : 0}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isDark
                ? isLocked ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-800 border-slate-700 hover:border-blue-500'
                : isLocked ? 'bg-slate-100/50 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-500'
                } ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${isBurnout ? 'opacity-60' : ''}`}
        >
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl z-10">
                    <div className="text-center">
                        <Lock size={24} className="mx-auto text-white mb-1" />
                        <span className="text-white text-xs font-bold">Level {staff.unlockLevel}</span>
                    </div>
                </div>
            )}

            {isBurnout && isHired && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-10">
                    BURNOUT
                </div>
            )}

            <div className="flex items-start gap-3">
                <div className="text-3xl relative group/icon">
                    {staff.icon}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenWiki(`role_${staff.role}`);
                        }}
                        role="button"
                        aria-label={`Info tentang peran ${staff.type}`}
                        className="absolute -top-1 -right-1 opacity-0 group-hover/icon:opacity-100 transition-opacity bg-white/20 rounded-full p-0.5 pointer-events-auto"
                    >
                        <Info size={10} className={isDark ? 'text-white' : 'text-slate-800'} aria-hidden="true" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{staff.name}</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{staff.type}</p>

                    {/* Morale Bar for Hired Staff */}
                    {isHired && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                    {moraleEmoji} Morale
                                </span>
                                <span className={`font-bold ${morale >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {morale}%
                                </span>
                            </div>
                            <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                <div
                                    className={`h-full rounded-full transition-all ${moraleColor}`}
                                    style={{ width: `${morale}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Performance Badge */}
                    {isHired && staff.performance && (
                        <div className="mt-2 flex items-center gap-2">
                            <Star size={14} className="text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">
                                {staff.performance?.toFixed(0)}% Skill
                            </span>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <p className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Rp {(staff.salary / 1000000).toFixed(1)}jt
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/bulan</p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
                {staff.skills.map((skill, idx) => (
                    <span key={idx} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {skill}
                    </span>
                ))}
            </div>

            {/* Coaching Button for Hired Staff */}
            {isHired && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCoach(staff.id);
                    }}
                    className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${isDark
                        ? 'bg-pink-900/50 text-pink-300 hover:bg-pink-800/50'
                        : 'bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200'
                        }`}
                    aria-label={`Coaching staf ${staff.name} — tambah 15 morale`}
                >
                    <Heart size={14} aria-hidden="true" /> Coaching (+15 Morale)
                </button>
            )}
        </div>
    );
};

export default StaffCard;
