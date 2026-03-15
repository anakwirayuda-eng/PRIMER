/**
 * @reflection
 * [IDENTITY]: StatusJunctionModal
 * [PURPOSE]: React UI component: StatusJunctionModal.
 * [STATE]: Experimental
 * [ANCHOR]: StatusJunctionModal
 * [DEPENDS_ON]: GameContext, AvatarRenderer
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { X, Heart, Brain, Zap, Activity, Smile, Shield, Info } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer.jsx';

export default function StatusJunctionModal({ onClose, onOpenWiki }) {
    const { playerProfile, playerStats, skills, activeQuests: _activeQuests, derivedKpis } = useGame();
    const [animateIn] = useState(true); // Animate immediately on mount
    const modalRef = useModalA11y(onClose);
    const [selectedStat, setSelectedStat] = useState(null);

    // Helper to format large numbers
    const formatNumber = (num) => {
        return num?.toLocaleString('id-ID') || '0';
    };

    // Calculate next level percentage for progress bar
    const xpPercentage = (playerStats.xp / (playerStats.nextLevelXp || 1000)) * 100;

    // Skill list
    const unlockedSkills = Array.isArray(skills)
        ? skills.map((id) => id.replace(/_/g, ' ').toUpperCase())
        : Object.entries(skills || {})
            .filter(([_, unlocked]) => unlocked)
            .map(([id]) => id.replace(/_/g, ' ').toUpperCase());

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* Main Junction Container */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="status-junction-title"
                className={`
                    w-full max-w-4xl bg-gradient-to-br from-slate-600 to-slate-800 
                    rounded-lg shadow-2xl border-2 border-slate-400 overflow-hidden text-white font-mono
                    transform transition-all duration-300 ease-out
                    ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                style={{
                    boxShadow: '0 0 20px rgba(100, 116, 139, 0.5), inset 0 0 40px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header Strip - FF8 Style */}
                <div className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 p-1 border-b-2 border-slate-300 flex justify-between items-center px-4">
                    <h2 id="status-junction-title" className="font-bold text-shadow-sm tracking-wider uppercase text-slate-900">Status Junction</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-900 hover:text-white hover:bg-red-600 rounded p-1 transition-colors"
                        aria-label="Tutup status junction"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* LEFT COLUMN: Character Portrait & Basic Info */}
                    <div className="w-full md:w-1/3 bg-slate-900/50 p-6 flex flex-col border-r border-slate-500/30 relative overflow-hidden">
                        {/* Background Tech Lines */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}>
                        </div>

                        {/* Avatar */}
                        <div className="relative z-10 flex flex-col items-center mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-400 bg-slate-700 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4 overflow-hidden">
                                <AvatarRenderer avatar={playerProfile?.avatar} size={120} />
                            </div>
                            <h2 className="text-2xl font-bold text-cyan-300 text-shadow-glow uppercase tracking-widest">{playerProfile?.name || 'DOCTOR'}</h2>
                            <div className="text-sm text-slate-300 tracking-wide uppercase">Kepala Puskesmas</div>
                        </div>

                        {/* Level & XP */}
                        <div
                            className="bg-slate-800/80 p-4 rounded border border-slate-600 mb-4 z-10 cursor-pointer hover:border-cyan-500/50 group/xp transition-all"
                            onClick={() => onOpenWiki?.('xp_level')}
                        >
                            <div className="flex justify-between items-end mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold text-lg">LV</span>
                                    <Info size={14} className="text-slate-500 group-hover/xp:text-cyan-400 transition-colors" />
                                </div>
                                <span className="text-3xl font-bold text-white leading-none">{playerStats.level}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>EXP</span>
                                    <span>{formatNumber(playerStats.xp)} / {formatNumber(playerStats.nextLevelXp)}</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-600">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000"
                                        style={{ width: `${xpPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Limit Break / Special Status */}
                        <div className="mt-auto bg-red-900/30 border border-red-500/50 p-2 rounded text-center z-10">
                            <div className="text-xs text-red-300 uppercase tracking-widest mb-1">Condition</div>
                            <div className="text-xl font-bold text-red-100">
                                {playerStats.energy < 30 ? 'CRITICAL' : 'NORMAL'}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Stats Grid */}
                    <div className="flex-1 bg-slate-800/80 p-6 flex flex-col overflow-y-auto custom-scrollbar">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* HP / ENERGY */}
                            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group relative cursor-pointer"
                                onMouseEnter={() => setSelectedStat({ title: 'ENERGY (HP)', desc: 'Tenaga untuk melakukan aktivitas medis & manajemen.' })}
                                onMouseLeave={() => setSelectedStat(null)}
                                onClick={() => onOpenWiki?.('energy')}
                            >
                                <div className="p-2 bg-slate-800 rounded text-green-400 group-hover:text-green-300">
                                    <Heart size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="text-xs text-slate-400 uppercase">Energy</div>
                                        <Info size={12} className="text-slate-500 group-hover:text-green-400" />
                                    </div>
                                    <div className="text-xl font-bold font-mono">
                                        <span className={playerStats.energy < 30 ? 'text-red-400' : 'text-white'}>
                                            {Math.round(playerStats.energy)}
                                        </span>
                                        <span className="text-slate-500 text-sm"> / {playerStats.maxEnergy}</span>
                                    </div>
                                </div>
                            </div>

                            {/* STRESS */}
                            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group cursor-help"
                                onMouseEnter={() => setSelectedStat({ title: 'STRESS', desc: 'Tingkat kelelahan mental. Pengaruhi akurasi diagnosis.' })}
                                onMouseLeave={() => setSelectedStat(null)}>
                                <div className="p-2 bg-slate-800 rounded text-purple-400 group-hover:text-purple-300">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">Stress</div>
                                    <div className="text-xl font-bold font-mono text-purple-200">
                                        {playerStats.stress}%
                                    </div>
                                </div>
                            </div>

                            {/* KNOWLEDGE (MAG) */}
                            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group cursor-help"
                                onMouseEnter={() => setSelectedStat({ title: 'KNOWLEDGE (MAG)', desc: 'Kemampuan untuk membuka skill baru & riset.' })}
                                onMouseLeave={() => setSelectedStat(null)}>
                                <div className="p-2 bg-slate-800 rounded text-blue-400 group-hover:text-blue-300">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">Knowledge</div>
                                    <div className="text-xl font-bold font-mono text-blue-200">
                                        {playerStats.knowledge}
                                    </div>
                                </div>
                            </div>

                            {/* CONFIDENCE (SPR) */}
                            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group cursor-help"
                                onMouseEnter={() => setSelectedStat({ title: 'CONFIDENCE (SPR)', desc: 'Kepercayaan diri saat menghadapi audiens & staff.' })}
                                onMouseLeave={() => setSelectedStat(null)}>
                                <div className="p-2 bg-slate-800 rounded text-amber-400 group-hover:text-amber-300">
                                    <Smile size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">Confidence</div>
                                    <div className="text-xl font-bold font-mono text-amber-200">
                                        {playerStats.confidence}
                                    </div>
                                </div>
                            </div>

                            {/* HYGIENE (VIT) */}
                            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group cursor-help"
                                onMouseEnter={() => setSelectedStat({ title: 'HYGIENE (VIT)', desc: 'Kebersihan diri & resistensi terhadap penyakit.' })}
                                onMouseLeave={() => setSelectedStat(null)}>
                                <div className="p-2 bg-slate-800 rounded text-teal-400 group-hover:text-teal-300">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase">Hygiene</div>
                                    <div className="text-xl font-bold font-mono text-teal-200">
                                        {playerStats.hygiene}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Box (Bottom of Right Column) */}
                        <div className="mt-auto mb-6 bg-slate-900 border-2 border-slate-500 rounded p-4 min-h-[100px] shadow-inner relative">
                            {selectedStat ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h4 className="text-cyan-400 font-bold mb-1 border-b border-slate-700 pb-1">{selectedStat.title}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{selectedStat.desc}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 text-sm italic">
                                    Hover over a stat for details...
                                </div>
                            )}
                        </div>

                        {/* Skills / Abilities List */}
                        <div>
                            <h3 className="text-slate-400 uppercase text-xs font-bold mb-2 tracking-wider border-b border-slate-700 pb-1">Abilities (Junctioned)</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {unlockedSkills.length > 0 ? (
                                    unlockedSkills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                                            <Zap size={14} className="text-yellow-500" />
                                            <span>{skill}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 text-sm italic col-span-2">- No abilities unlocked -</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Status Line */}
                <div className="bg-slate-900 border-t-2 border-slate-500 p-2 text-xs flex justify-between items-center text-slate-400 px-4">
                    <div>
                        PLAY TIME: <span className="text-white font-mono">{Math.floor(playerStats.playTime || 0)}h</span>
                    </div>
                    <div
                        className="cursor-pointer hover:bg-white/5 px-2 py-0.5 rounded transition-all flex items-center gap-2 group/gil"
                        onClick={() => onOpenWiki?.('liquidity')}
                    >
                        GIL (Kapitasi): <span className="text-yellow-400 font-mono">Rp {formatNumber(derivedKpis?.totalRevenue)}</span>
                        <Info size={12} className="text-slate-600 group-hover/gil:text-yellow-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
