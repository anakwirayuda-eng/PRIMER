/**
 * @reflection
 * [IDENTITY]: QueueList
 * [PURPOSE]: React UI component: QueueList.
 * [STATE]: Experimental
 * [ANCHOR]: QueueList
 * [DEPENDS_ON]: GameContext, ThemeContext, AvatarUtils
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { User, Timer, Bot, Scale, Dna, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAvatarStyle } from '../utils/AvatarUtils.js';

export default function QueueList({ activeService }) {
    const { queue, admitPatient, activePatientId, delegateToMaia, time } = useGame();
    const { isDark } = useTheme();
    const { t } = useTranslation();

    // Helper to get BMI color
    const getBMIIndicator = (patient) => {
        const bmi = patient.anthropometrics?.bmiCategory;
        if (!bmi) return null;
        if (bmi === 'Underweight') return { color: 'text-amber-500', icon: '↓' };
        if (bmi === 'Overweight') return { color: 'text-orange-500', icon: '↑' };
        if (bmi?.startsWith('Obese')) return { color: 'text-red-500', icon: '⚠' };
        return null;
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header: Dynamic Clinic Dashboard */}
            <div className={`relative bg-gradient-to-r ${activeService?.color || 'from-emerald-600 to-teal-600'} text-white p-4 overflow-hidden sticky top-0 z-10`}>
                {/* Background Pattern/Image */}
                {(!activeService || activeService.id === 'poli_umum') && (
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
                        <img src="/images/wilayah/poli_umum_bg.png" alt="Poli Umum" className="h-full object-cover object-left" />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        {activeService?.icon ? <span className="text-xl drop-shadow-sm">{activeService.icon}</span> : <Dna size={18} />}
                        <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            {activeService?.name || 'Poli Umum'}
                            {time >= 960 && (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">TUTUP</span>
                            )}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {time >= 960 ? (
                            <span className="text-xs text-emerald-100 italic">Pendaftaran Berakhir</span>
                        ) : (
                            <>
                                <span className={`${isDark ? 'bg-white/10 text-emerald-300' : 'bg-white/20 text-white'} px-2 py-0.5 rounded text-xs font-bold`}>
                                    {queue.length} {t('dashboard.waiting')}
                                </span>
                                {queue.length > 0 && (
                                    <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                                        <Timer size={10} />
                                        {Math.max(...queue.map(p => time - (p.joinedAt || 480)))}m (max wait)
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {queue.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        {t('queue.empty')}
                        <br />
                        <span className="text-xs">({t('queue.relax')})</span>
                    </div>
                )}
                {queue.map(patient => {
                    const waitTime = time - (patient.joinedAt || 480);
                    const bmiIndicator = getBMIIndicator(patient);

                    return (
                        <div
                            key={patient.id}
                            className={clsx(
                                "p-3 transition-colors flex items-center justify-between group",
                                isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50",
                                activePatientId === patient.id ? (isDark ? "bg-emerald-900/30 border-l-4 border-emerald-500" : "bg-emerald-50 border-l-4 border-emerald-500") : ""
                            )}
                        >
                            {/* Patient Info - Click to admit */}
                            <button
                                onClick={() => admitPatient(patient.id)}
                                className="flex items-center gap-3 flex-1 text-left"
                            >
                                <div className="relative">
                                    <div className={clsx(
                                        "rounded-full overflow-hidden shrink-0 border-2",
                                        patient.isFollowup ? 'border-amber-400 shadow-sm shadow-amber-200' :
                                            patient.social?.hasBPJS ? 'border-emerald-200 shadow-sm shadow-emerald-100' : 'border-slate-200'
                                    )}>
                                        <div
                                            style={getAvatarStyle(patient.age, patient.gender, 36)}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    {patient.isFollowup && (
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-sm" title="Pasien Kontrol">
                                            <RotateCcw size={10} />
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className={clsx("font-semibold text-sm", isDark ? 'text-slate-100' : 'text-slate-900')}>{patient.name}</p>
                                        {patient.isFollowup && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                                Kontrol
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{patient.age} y.o</span>
                                        <span>•</span>
                                        <span className={patient.social?.hasBPJS ? "text-emerald-600 font-bold" : "text-slate-400"}>
                                            {patient.social?.hasBPJS ? 'BPJS' : 'Umum'}
                                        </span>
                                        {/* BMI Indicator */}
                                        {bmiIndicator && (
                                            <>
                                                <span>•</span>
                                                <span className={`flex items-center gap-0.5 ${bmiIndicator.color}`}>
                                                    <Scale size={10} />
                                                    {bmiIndicator.icon}
                                                </span>
                                            </>
                                        )}
                                        {/* Followup severity indicator */}
                                        {patient.isFollowup && patient.followupData?.severity && (
                                            <>
                                                <span>•</span>
                                                <span className={clsx(
                                                    'font-bold text-[10px]',
                                                    patient.followupData.severity === 'critical' ? 'text-red-500' :
                                                        patient.followupData.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                                                )}>
                                                    {patient.followupData.severity === 'critical' ? '⚠ Kritis' :
                                                        patient.followupData.severity === 'medium' ? '⚡ Sedang' : '✓ Membaik'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Right side: Wait time + Delegate button */}
                            <div className="flex items-center gap-2">
                                {/* Wait Time */}
                                <div className={clsx(
                                    "text-xs flex items-center gap-1",
                                    waitTime > 60 ? "text-red-500 font-bold" :
                                        waitTime > 30 ? "text-amber-500 font-medium" :
                                            "text-slate-400"
                                )}>
                                    <Timer size={12} />
                                    <span>{waitTime}m</span>
                                </div>

                                {/* Delegate to MAIA Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        delegateToMaia(patient.id);
                                    }}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded ${isDark ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'} text-xs flex items-center gap-1`}
                                    title={t('queue.delegate')}
                                >
                                    <Bot size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
