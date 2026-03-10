/**
 * @reflection
 * [IDENTITY]: LogisticsView
 * [PURPOSE]: React UI component: LogisticsView.
 * [STATE]: Experimental
 * [ANCHOR]: LogisticsView
 * [DEPENDS_ON]: GameContext, MedicationDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Package, ArrowLeft, Info, Users, Clock, AlertTriangle, Brain, Heart } from 'lucide-react';
import { getMedicationById } from '../../data/MedicationDatabase.js';

/**
 * LogisticsView — Sub-module for Resources & Staff
 * Shows: Staff morale, inventory health, stockout predictions, stress
 */
export default function LogisticsView({ onBack, openWiki }) {
    const { hiredStaff, pharmacyInventory, history, day, playerStats } = useGame();

    const staffData = useMemo(() => {
        if (!hiredStaff || hiredStaff.length === 0) return { count: 0, avgMorale: 0, avgPerf: 0, lowMorale: [] };
        const avgMorale = Math.round(hiredStaff.reduce((s, st) => s + (st.morale || 70), 0) / hiredStaff.length);
        const avgPerf = Math.round(hiredStaff.reduce((s, st) => s + (st.performance || 0), 0) / hiredStaff.length);
        const lowMorale = hiredStaff.filter(s => (s.morale || 70) < 50);
        return { count: hiredStaff.length, avgMorale, avgPerf, lowMorale };
    }, [hiredStaff]);

    const inventoryData = useMemo(() => {
        if (!pharmacyInventory || !Array.isArray(pharmacyInventory)) return { total: 0, low: 0, out: 0 };
        const low = pharmacyInventory.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med && item.stock < med.minStock && item.stock > 0;
        }).length;
        const out = pharmacyInventory.filter(item => item.stock === 0).length;
        return { total: pharmacyInventory.length, low, out };
    }, [pharmacyInventory]);

    const stockOutPredictions = useMemo(() => {
        if (!history || !pharmacyInventory) return [];
        const relevantHistory = history.filter(h => h.day > day - 7);
        const daysCount = Math.max(1, Math.min(day, 7));
        const consumption = {};
        relevantHistory.forEach(h => {
            if (h.decision?.medications) {
                h.decision.medications.forEach(mId => {
                    consumption[mId] = (consumption[mId] || 0) + 1;
                });
            }
        });
        return pharmacyInventory.map(item => {
            const avgDaily = (consumption[item.medicationId] || 0) / daysCount;
            const daysRemaining = avgDaily > 0 ? Math.floor(item.stock / avgDaily) : 99;
            const med = getMedicationById(item.medicationId);
            return { ...item, name: med?.name || item.medicationId, daysRemaining, avgDaily };
        }).filter(p => p.daysRemaining < 7 && p.avgDaily > 0).sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [history, pharmacyInventory, day]);

    const getColor = (val) => val >= 70 ? 'text-emerald-400' : val >= 40 ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                        <Package size={20} className="text-teal-400" />
                        Logistics & Staff
                    </h2>
                    <p className="text-teal-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">Supply Chain • HR • Wellness</p>
                </div>
            </div>

            {/* Player Wellness */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('stress')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Brain size={12} /> Player Wellness
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.04] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">Stress Level</span>
                        <span className={`text-lg font-black ${playerStats.stress > 70 ? 'text-rose-400' : playerStats.stress > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {playerStats.stress}%
                        </span>
                        <div className="w-full bg-white/[0.06] rounded-full h-1 mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${playerStats.stress > 70 ? 'bg-rose-500' : playerStats.stress > 30 ? 'bg-amber-500' : 'bg-emerald-500'} transition-all`} style={{ width: `${playerStats.stress}%` }} />
                        </div>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">Energy</span>
                        <span className={`font-data text-lg font-black ${getColor(playerStats.energy)}`}>
                            {Math.round(playerStats.energy)}%
                        </span>
                        <div className="w-full bg-white/[0.06] rounded-full h-1 mt-2 overflow-hidden">
                            <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${playerStats.energy}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Overview */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('staff_readiness')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-sky-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={12} /> Staff Overview
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                {staffData.count === 0 ? (
                    <p className="text-xs text-amber-400/80 italic">Belum ada staf direkrut</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Jumlah</span>
                            <span className="text-lg font-black text-white/80">{staffData.count}</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Avg Morale</span>
                            <span className={`text-lg font-black ${getColor(staffData.avgMorale)}`}>{staffData.avgMorale}%</span>
                        </div>
                        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                            <span className="text-[9px] font-bold text-white/40 uppercase block">Avg Performa</span>
                            <span className={`text-lg font-black ${getColor(staffData.avgPerf)}`}>{staffData.avgPerf}%</span>
                        </div>
                    </div>
                )}
                {staffData.lowMorale.length > 0 && (
                    <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <p className="text-[10px] text-rose-400 font-bold">⚠ {staffData.lowMorale.length} staf morale rendah — risiko resign!</p>
                    </div>
                )}
            </div>

            {/* Inventory Status */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('inventory')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-teal-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Package size={12} /> Inventory Status
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-white/40 uppercase block">Total Items</span>
                        <span className="text-lg font-black text-white/80">{inventoryData.total}</span>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-white/40 uppercase block">Low Stock</span>
                        <span className={`text-lg font-black ${inventoryData.low > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{inventoryData.low}</span>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-bold text-white/40 uppercase block">Stockout</span>
                        <span className={`text-lg font-black ${inventoryData.out > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{inventoryData.out}</span>
                    </div>
                </div>
            </div>

            {/* Stockout Predictions */}
            {stockOutPredictions.length > 0 && (
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5">
                    <h3 className="text-[10px] font-black text-amber-400/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                        <Clock size={12} /> Prediksi Stok Habis
                    </h3>
                    <div className="space-y-2">
                        {stockOutPredictions.slice(0, 5).map(p => (
                            <div key={p.medicationId} className="flex items-center justify-between text-[10px] bg-white/[0.04] rounded-lg p-2.5">
                                <span className="text-white/60 font-medium truncate flex-1 mr-2">{p.name}</span>
                                <span className={`font-black px-2 py-0.5 rounded ${p.daysRemaining <= 1 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {p.daysRemaining <= 0 ? 'HABIS' : `${p.daysRemaining} Hari`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
