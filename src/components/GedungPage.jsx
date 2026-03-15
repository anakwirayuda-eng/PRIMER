/**
 * @reflection
 * [IDENTITY]: GedungPage
 * [PURPOSE]: React UI component: GedungPage.
 * [STATE]: Experimental
 * [ANCHOR]: GedungPage
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { Building2, Plus, Sparkles, Hammer, ArrowUp } from 'lucide-react';

// Modular Imports
import { ROOMS } from '../data/FacilityData.js';
import RoomCard from './gedung/RoomCard.jsx';
import UpgradeModal from './gedung/UpgradeModal.jsx';

export default function GedungPage() {
    // Prophylaxis: Navigation Stability Guard
    useEffect(() => {
        guardStability('NAV_GEDUNG_INIT', 2000, 3);
    }, []);

    const { stats, facilities, upgradeFacility, openWiki } = useGame();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = (room) => {
        setIsUpgrading(true);
        setTimeout(() => {
            const success = upgradeFacility(room.id, room.cost);
            setIsUpgrading(false);
            if (success) {
                alert(`✅ Upgrade ${room.name} berhasil!`);
                setSelectedRoom(null);
            } else {
                alert('❌ Gagal upgrade! Dana tidak cukup.');
            }
        }, 1500);
    };

    const currentLevels = facilities || {};
    const totalLevel = ROOMS.reduce((sum, r) => sum + (currentLevels[r.id] || r.level), 0);
    const maxTotalLevel = ROOMS.reduce((sum, r) => sum + r.maxLevel, 0);
    const progressPct = Math.round((totalLevel / maxTotalLevel) * 100);

    // Stable floating particles
    const particles = useMemo(() => [...Array(10)].map((_, i) => ({
        w: 2 + (i * 0.4) % 3,
        left: ((i * 19 + 5) % 95),
        top: ((i * 27 + 11) % 91),
        rgb: i % 3 === 0 ? '16,185,129' : i % 3 === 1 ? '99,102,241' : '139,92,246',
        opacity: 0.06 + (i * 0.01),
        dur: 9 + (i * 1.3),
        delay: i * 0.5
    })), []);

    return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950 relative">
            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {particles.map((p, i) => (
                    <div key={i} className="absolute rounded-full" style={{
                        width: p.w, height: p.w,
                        left: `${p.left}%`, top: `${p.top}%`,
                        background: `rgba(${p.rgb}, ${p.opacity})`,
                        animation: `particle-float ${p.dur}s ease-in-out infinite alternate`,
                        animationDelay: `${p.delay}s`
                    }} />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-5">
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-black text-white/90 uppercase tracking-tight flex items-center gap-3">
                            <div className="bg-indigo-500/15 p-2.5 rounded-xl border border-indigo-500/20">
                                <Building2 size={22} className="text-indigo-400" />
                            </div>
                            Manajemen Gedung
                        </h2>
                        <p className="text-indigo-300/50 text-xs uppercase tracking-[0.3em] mt-1 ml-14 font-medium">
                            Infrastruktur • Fasilitas • Upgrade
                        </p>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-4">
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Dana Pembangunan</span>
                            <span className="font-data text-lg font-black text-amber-400">
                                Rp {((stats?.pendapatanUmum || 0) / 1000000).toFixed(1)}M
                            </span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Progress</span>
                            <span className="font-data text-lg font-black text-emerald-400">
                                {progressPct}%
                            </span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Level Total</span>
                            <span className="font-data text-lg font-black text-white/80">
                                {totalLevel}/{maxTotalLevel}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-white/[0.08]" />
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Fasilitas</span>
                            <span className="font-data text-lg font-black text-indigo-400">
                                {ROOMS.filter(r => !r.locked).length}/{ROOMS.length}
                            </span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${progressPct}%` }} />
                    </div>
                </div>

                {/* ── BOK ACTION CARD ── */}
                <button
                    onClick={() => openWiki('dana_bok')}
                    className="group w-full relative p-4 rounded-2xl bg-amber-500/[0.08] backdrop-blur-md border border-amber-500/20 hover:bg-amber-500/15 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/10 transition-all duration-500" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-amber-500/15 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                            <Plus size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm font-black text-amber-300 uppercase tracking-tight">
                                Panduan Dana BOK
                            </h3>
                            <p className="text-[10px] text-amber-400/50 font-medium uppercase tracking-wider">
                                Buka penjelasan Bantuan Operasional Kesehatan
                            </p>
                        </div>
                        <Sparkles size={16} className="text-amber-400/50 ml-auto" />
                    </div>
                </button>

                {/* ── ROOM GRID ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <ErrorBoundary name="RoomUpgradeList">
                        {ROOMS.map((room, _idx) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                currentLevel={currentLevels[room.id]}
                                isSelected={selectedRoom?.id === room.id}
                                onSelect={setSelectedRoom}
                            />
                        ))}
                    </ErrorBoundary>
                </div>

                {/* ── UPGRADE MODAL ── */}
                <UpgradeModal
                    room={selectedRoom}
                    currentLevel={currentLevels[selectedRoom?.id] || selectedRoom?.level}
                    isUpgrading={isUpgrading}
                    onUpgrade={handleUpgrade}
                    onCancel={() => setSelectedRoom(null)}
                />
            </div>
        </div>
    );
}

