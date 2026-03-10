/**
 * @reflection
 * [IDENTITY]: OutbreakModal
 * [PURPOSE]: React UI component: OutbreakModal.
 * [STATE]: Experimental
 * [ANCHOR]: OutbreakModal
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import {
    AlertTriangle,
    X,
    Zap,
    Clock,
    CheckCircle,
    MapPin,
    ChevronRight,
    Activity
} from 'lucide-react';

export default function OutbreakModal({ isOpen, onClose }) {
    const modalRef = useModalA11y(onClose);
    const {
        outbreakNotification,
        dismissOutbreakNotification,
        activeOutbreaks,
        respondToOutbreak,
        getOutbreakActions,
        OUTBREAK_ACTIONS,
        playerStats
    } = useGame();

    const [_selectedAction, setSelectedAction] = useState(null);
    const [actionResult, setActionResult] = useState(null);

    if (!isOpen || !outbreakNotification) return null;

    const outbreak = outbreakNotification;
    const typeData = outbreak.typeData;
    const availableActions = getOutbreakActions(outbreak.type);
    const performedActions = outbreak.actionsPerformed || [];

    const handleAction = (actionId) => {
        if (performedActions.includes(actionId)) return;

        const result = respondToOutbreak(outbreak.id, actionId);
        setActionResult(result);

        if (result.success) {
            setSelectedAction(actionId);
            // Check if outbreak is now resolved
            const updated = activeOutbreaks.find(o => o.id === outbreak.id);
            if (updated?.resolved) {
                setTimeout(() => {
                    dismissOutbreakNotification();
                    onClose();
                }, 2000);
            }
        }
    };

    const handleDismiss = () => {
        dismissOutbreakNotification();
        onClose();
    };

    const colorClasses = {
        red: 'from-red-600 to-red-800',
        purple: 'from-purple-600 to-purple-800',
        blue: 'from-blue-600 to-blue-800',
        amber: 'from-amber-600 to-amber-800'
    };

    const bgColor = colorClasses[typeData?.color] || colorClasses.red;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-critical flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="outbreak-title" className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-2 border-red-300 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                {/* Header - Urgent Alert Style */}
                <div className={`bg-gradient-to-r ${bgColor} text-white p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">
                                    ⚠️ PERINGATAN OUTBREAK
                                </p>
                                <h2 id="outbreak-title" className="text-2xl font-black tracking-tight">
                                    {typeData?.icon} {typeData?.name}
                                </h2>
                                <p className="text-sm text-white/80 mt-1">
                                    Terdeteksi {outbreak.caseCount} kasus dalam 7 hari terakhir
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            aria-label="Tutup peringatan outbreak"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Affected Area */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={16} className="text-slate-500" />
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                Lokasi Terdampak
                            </span>
                        </div>
                        <p className="text-sm text-slate-700">
                            {outbreak.affectedHouseIds?.length || 0} rumah di area wilayah kerja
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={12} />
                            <span>
                                Batas waktu penanganan: <strong>Hari {outbreak.expiresOnDay}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Resolution Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                Progress Penanganan
                            </span>
                            <span className="text-sm font-black text-slate-800">
                                {Math.round(outbreak.resolutionProgress || 0)}%
                            </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                                className={`h-full bg-gradient-to-r ${bgColor} transition-all duration-700 rounded-full`}
                                style={{ width: `${outbreak.resolutionProgress || 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Available Actions */}
                    <div className="mb-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                            Tindakan Tersedia
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {availableActions.map(action => {
                                const isPerformed = performedActions.includes(action.id);
                                const canAfford = playerStats.energy >= action.energyCost;

                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action.id)}
                                        disabled={isPerformed || !canAfford}
                                        className={`p-4 rounded-xl border-2 text-left transition-all group
                                            ${isPerformed
                                                ? 'bg-emerald-50 border-emerald-200 cursor-default'
                                                : canAfford
                                                    ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer'
                                                    : 'bg-slate-50 border-slate-100 cursor-not-allowed opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className={`text-2xl ${isPerformed ? 'grayscale' : ''}`}>
                                                    {action.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                                                        {action.name}
                                                        {isPerformed && (
                                                            <CheckCircle size={14} className="text-emerald-500" />
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {action.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                                            <Zap size={10} /> {action.energyCost} Energi
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Clock size={10} /> {action.timeCost} menit
                                                        </span>
                                                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                                            <Activity size={10} /> +{Math.round(action.effectiveness * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isPerformed && canAfford && (
                                                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Result Toast */}
                    {actionResult && (
                        <div className={`p-3 rounded-xl text-sm font-medium animate-in slide-in-from-bottom-2 duration-300 ${actionResult.success
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            {actionResult.message}
                        </div>
                    )}

                    {/* Resolved State */}
                    {outbreak.resolved && (
                        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center animate-in zoom-in-95 duration-500">
                            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                            <h3 className="text-lg font-black text-emerald-700">Outbreak Teratasi!</h3>
                            <p className="text-sm text-emerald-600 mt-1">
                                +{typeData?.xpReward} XP | +{typeData?.reputationReward} Reputasi
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex justify-between items-center">
                    <p className="text-[10px] text-slate-400">
                        💡 Tip: Lakukan beberapa tindakan untuk memaksimalkan efektivitas penanganan.
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
