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
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext.jsx';
import { Package, ArrowLeft, Info, Users, Clock, AlertTriangle, Brain } from 'lucide-react';
import { getMedicationById } from '../../data/MedicationDatabase.js';
import { PROCEDURES_DB } from '../../data/ProceduresDB.js';
import { normalizeMedicationId } from '../../models/InventoryRuntime.js';

/**
 * LogisticsView - Sub-module for Resources & Staff
 * Shows: Staff morale, inventory health, stockout predictions, stress
 */
export default function LogisticsView({ onBack, openWiki }) {
    const { t } = useTranslation();
    const { hiredStaff, pharmacyInventory, history, day, playerStats } = useGame();

    const staffData = useMemo(() => {
        if (!hiredStaff || hiredStaff.length === 0) return { count: 0, avgMorale: 0, avgPerf: 0, lowMorale: [] };
        const avgMorale = Math.round(hiredStaff.reduce((sum, staff) => sum + (staff.morale || 70), 0) / hiredStaff.length);
        const avgPerf = Math.round(hiredStaff.reduce((sum, staff) => sum + (staff.performance || 0), 0) / hiredStaff.length);
        const lowMorale = hiredStaff.filter(staff => (staff.morale || 70) < 50);
        return { count: hiredStaff.length, avgMorale, avgPerf, lowMorale };
    }, [hiredStaff]);

    const inventoryData = useMemo(() => {
        if (!pharmacyInventory || !Array.isArray(pharmacyInventory)) return { total: 0, low: 0, out: 0 };
        const stockItems = pharmacyInventory.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med && med.form !== 'action' && med.form !== 'equipment';
        });
        const low = stockItems.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med && item.stock < med.minStock && item.stock > 0;
        }).length;
        const out = stockItems.filter(item => item.stock === 0).length;
        return { total: stockItems.length, low, out };
    }, [pharmacyInventory]);

    const stockOutPredictions = useMemo(() => {
        if (!history || !pharmacyInventory) return [];
        const relevantHistory = history.filter(item => item.day > day - 7 && item.decision?.action !== 'refer');
        const daysCount = Math.max(1, Math.min(day, 7));
        const consumption = {};
        relevantHistory.forEach(item => {
            if (item.decision?.medications) {
                item.decision.medications.forEach(medication => {
                    const medId = normalizeMedicationId(typeof medication === 'object' ? (medication.id || medication.medId) : medication);
                    const med = getMedicationById(medId);
                    if (!med || med.form === 'action') return;
                    const qty = typeof medication === 'object'
                        ? ((medication.dose || 1) * (medication.frequency || 1) * (medication.duration || 1))
                        : 1;
                    consumption[medId] = (consumption[medId] || 0) + qty;
                });
            }
            if (item.decision?.procedures) {
                item.decision.procedures.forEach(procId => {
                    const pid = typeof procId === 'object' ? (procId.id || procId.code) : procId;
                    const proc = PROCEDURES_DB.find(procedure => procedure.id === pid);
                    if (proc?.requiredItems) {
                        proc.requiredItems.forEach(itemId => {
                            const canonicalItemId = normalizeMedicationId(itemId);
                            const med = getMedicationById(canonicalItemId);
                            if (med && med.form !== 'action' && med.form !== 'equipment') {
                                consumption[canonicalItemId] = (consumption[canonicalItemId] || 0) + 1;
                            }
                        });
                    }
                });
            }
        });
        const realStockItems = pharmacyInventory.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med && med.form !== 'action' && med.form !== 'equipment';
        });
        return realStockItems.map(item => {
            const avgDaily = (consumption[item.medicationId] || 0) / daysCount;
            const daysRemaining = avgDaily > 0 ? Math.floor(item.stock / avgDaily) : 99;
            const med = getMedicationById(item.medicationId);
            return { ...item, name: med?.name || item.medicationId, daysRemaining, avgDaily };
        }).filter(prediction => prediction.daysRemaining < 7 && prediction.avgDaily > 0).sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [history, pharmacyInventory, day]);

    const getColor = (val) => val >= 70 ? 'text-emerald-400' : val >= 40 ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.1] hover:bg-white/[0.1] transition-all text-white/60 hover:text-white">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-display text-xl font-black text-white/90 uppercase tracking-tight flex items-center gap-2">
                        <Package size={20} className="text-teal-400" />
                        {t('dashboard.views.logistics.title')}
                    </h2>
                    <p className="text-teal-300/50 text-[10px] uppercase tracking-[0.3em] mt-0.5 ml-7 font-medium">
                        {t('dashboard.views.logistics.subtitle')}
                    </p>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('stress')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-rose-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Brain size={12} /> {t('dashboard.views.logistics.wellnessTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ProgressTile
                        label={t('dashboard.views.logistics.metrics.stress')}
                        value={`${playerStats.stress}%`}
                        colorClass={playerStats.stress > 70 ? 'text-rose-400' : playerStats.stress > 30 ? 'text-amber-400' : 'text-emerald-400'}
                        barClass={playerStats.stress > 70 ? 'bg-rose-500' : playerStats.stress > 30 ? 'bg-amber-500' : 'bg-emerald-500'}
                        width={playerStats.stress}
                    />
                    <ProgressTile
                        label={t('dashboard.views.logistics.metrics.energy')}
                        value={`${Math.round(playerStats.energy)}%`}
                        colorClass={getColor(playerStats.energy)}
                        barClass="bg-sky-500"
                        width={playerStats.energy}
                    />
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('staff_readiness')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-sky-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={12} /> {t('dashboard.views.logistics.staffTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                {staffData.count === 0 ? (
                    <p className="text-xs text-amber-400/80 italic">{t('dashboard.views.logistics.noStaff')}</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <MetricTile label={t('dashboard.views.logistics.metrics.count')} value={staffData.count} />
                        <MetricTile label={t('dashboard.views.logistics.metrics.avgMorale')} value={`${staffData.avgMorale}%`} valueClass={getColor(staffData.avgMorale)} />
                        <MetricTile label={t('dashboard.views.logistics.metrics.avgPerformance')} value={`${staffData.avgPerf}%`} valueClass={getColor(staffData.avgPerf)} />
                    </div>
                )}
                {staffData.lowMorale.length > 0 && (
                    <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                            <AlertTriangle size={12} /> {t('dashboard.views.logistics.lowMoraleWarning', { count: staffData.lowMorale.length })}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5"
                onClick={() => openWiki('inventory')} style={{ cursor: 'pointer' }}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black text-teal-400/70 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Package size={12} /> {t('dashboard.views.logistics.inventoryTitle')}
                    </h3>
                    <Info size={14} className="text-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <MetricTile label={t('dashboard.views.logistics.metrics.totalItems')} value={inventoryData.total} />
                    <MetricTile label={t('dashboard.views.logistics.metrics.lowStock')} value={inventoryData.low} valueClass={inventoryData.low > 0 ? 'text-amber-400' : 'text-emerald-400'} />
                    <MetricTile label={t('dashboard.views.logistics.metrics.stockout')} value={inventoryData.out} valueClass={inventoryData.out > 0 ? 'text-rose-400' : 'text-emerald-400'} />
                </div>
            </div>

            {stockOutPredictions.length > 0 && (
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5">
                    <h3 className="text-[10px] font-black text-amber-400/70 uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                        <Clock size={12} /> {t('dashboard.views.logistics.demandTitle')}
                    </h3>
                    <div className="space-y-2">
                        {stockOutPredictions.slice(0, 5).map(prediction => (
                            <div key={prediction.medicationId} className="flex items-center justify-between text-[10px] bg-white/[0.04] rounded-lg p-2.5">
                                <span className="text-white/60 font-medium truncate flex-1 mr-2">{prediction.name}</span>
                                <span className={`font-black px-2 py-0.5 rounded ${prediction.daysRemaining <= 1 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {prediction.daysRemaining <= 0
                                        ? t('dashboard.views.logistics.out')
                                        : t('dashboard.views.logistics.daysRemaining', { count: prediction.daysRemaining })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricTile({ label, value, valueClass = 'text-white/80' }) {
    return (
        <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
            <span className="text-[9px] font-bold text-white/40 uppercase block">{label}</span>
            <span className={`text-lg font-black ${valueClass}`}>{value}</span>
        </div>
    );
}

function ProgressTile({ label, value, colorClass, barClass, width }) {
    return (
        <div className="bg-white/[0.04] rounded-xl p-3">
            <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">{label}</span>
            <span className={`text-lg font-black ${colorClass}`}>{value}</span>
            <div className="w-full bg-white/[0.06] rounded-full h-1 mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${barClass} transition-all`} style={{ width: `${width}%` }} />
            </div>
        </div>
    );
}
