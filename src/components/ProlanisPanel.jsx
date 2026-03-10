/**
 * @reflection
 * [IDENTITY]: ProlanisPanel
 * [PURPOSE]: Module: ProlanisPanel
 * [STATE]: Experimental
 * [ANCHOR]: ProlanisPanel
 * [DEPENDS_ON]: GameContext, ProlanisDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { Users, Activity, TrendingUp, AlertCircle, Heart, Award } from 'lucide-react';
import { PROLANIS_DISEASES } from '../data/ProlanisDB.js';

const ProlanisPanel = ({ compact = false }) => {
    const { prolanisRoster, prolanisState, triggerSenamProlanis, day, playerStats: _playerStats, stats: _stats } = useGame();

    const dmPatients = prolanisRoster.filter(p => p.prolanisData.diseaseType === 'dm_type2');
    const htPatients = prolanisRoster.filter(p => p.prolanisData.diseaseType === 'hypertension');

    // Calculate aggregate stats
    const totalEnrolled = prolanisRoster.length;
    const controlledCount = prolanisRoster.filter(p => {
        const history = p.prolanisData.history;
        return history.length > 0 && history[history.length - 1].wasControlled;
    }).length;

    // Controlled percentage
    const controlledRate = totalEnrolled > 0 ? Math.round((controlledCount / totalEnrolled) * 100) : 0;

    // Senam Status
    const currentMonth = Math.floor((day - 1) / 30);
    const isSenamDone = prolanisState?.lastSenamMonth === currentMonth;

    const handleSenam = () => {
        const result = triggerSenamProlanis();
        if (!result.success) {
            alert(result.message); // In real app, use toast
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
            {/* Header: Senam Dashboard - Hidden in compact mode (sidebar) */}
            {!compact && (
                <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 overflow-hidden">
                    {/* Background Pattern/Image */}
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                        <img src="/images/wilayah/puskesmas_iso.png" alt="Puskesmas" className="h-full object-cover object-left" />
                    </div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Heart className="text-pink-300" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Prolanis Club</h2>
                                    <p className="text-indigo-100 text-sm">Program Pengelolaan Penyakit Kronis</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="text-center bg-black/20 rounded-lg p-2 px-4 shadow-sm backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-indigo-100 uppercase tracking-widest">Rasio Terkontrol</div>
                                    <div className={`text-2xl font-bold ${controlledRate >= 75 ? 'text-emerald-300' : 'text-amber-300'}`}>
                                        {controlledRate}%
                                    </div>
                                </div>
                                <div className="text-center bg-black/20 rounded-lg p-2 px-4 shadow-sm backdrop-blur-sm border border-white/10">
                                    <div className="text-xs text-indigo-100 uppercase tracking-widest">Total Pasien</div>
                                    <div className="text-2xl font-bold text-white">
                                        {totalEnrolled}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Senam Action Card */}
                        <div className="bg-white text-slate-800 rounded-xl p-4 shadow-lg w-72 border-2 border-indigo-200">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold flex items-center gap-2">
                                    🤸 Senam Prolanis
                                </h3>
                                {isSenamDone ? (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Award size={12} /> Selesai
                                    </span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                                        Belum Terlaksana
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 mb-3">
                                {isSenamDone
                                    ? "Kegiatan bulan ini sudah terlaksana. Pasien merasa lebih sehat!"
                                    : "Adakan senam di pelataran Puskesmas untuk meningkatkan kesehatan semua anggota."}
                            </p>

                            {!isSenamDone && (
                                <button
                                    onClick={handleSenam}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:transform active:scale-95"
                                >
                                    <span>Adakan Kegiatan</span>
                                    <div className="flex flex-col items-start text-[10px] font-normal opacity-90 leading-tight">
                                        <span>⚡ 20 Energi</span>
                                        <span>💰 150k</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Simple Header for Compact Mode */}
            {compact && (
                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b flex items-center justify-between">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                        <Heart size={16} className="text-pink-600 fill-pink-600" />
                        Pasien Prolanis
                    </h3>
                    <span className="text-xs bg-white px-2 py-0.5 rounded border text-slate-500 font-mono">
                        {prolanisRoster.length} Total
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Section: DM Tipe 2 */}
                <div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3 sticky top-0 bg-white dark:bg-slate-800 z-10 py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-lg">{PROLANIS_DISEASES.dm_type2.emoji}</span>
                        Diabetes Mellitus Tipe 2
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-auto bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{dmPatients.length} Pasien</span>
                    </h3>

                    {dmPatients.length === 0 ? (
                        <EmptyState message="Belum ada pasien Diabetes terdaftar" />
                    ) : (
                        <div className="space-y-2">
                            {dmPatients.map(p => <PatientCard key={p.id} patient={p} />)}
                        </div>
                    )}
                </div>

                {/* Section: Hipertensi */}
                <div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3 sticky top-0 bg-white dark:bg-slate-800 z-10 py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-lg">{PROLANIS_DISEASES.hypertension.emoji}</span>
                        Hipertensi
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-auto bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{htPatients.length} Pasien</span>
                    </h3>

                    {htPatients.length === 0 ? (
                        <EmptyState message="Belum ada pasien Hipertensi terdaftar" />
                    ) : (
                        <div className="space-y-2">
                            {htPatients.map(p => <PatientCard key={p.id} patient={p} />)}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const PatientCard = ({ patient }) => {
    const { prolanisData } = patient;
    const { day, callProlanisPatient, monitorMedication } = useGame(); // Need day to check last visit status
    const history = prolanisData.history || [];
    const lastVisit = history.length > 0 ? history[history.length - 1] : null;
    const isControlled = lastVisit?.wasControlled;
    const consecutive = prolanisData.consecutiveControlled || 0;

    // Check if due for checkup (> 30 days or never checked)
    const lastVisitDay = lastVisit ? lastVisit.day : 0;
    const daysSinceVisit = day - lastVisitDay;
    const isOverdue = daysSinceVisit > 30;

    // Get primary parameter based on disease type
    const paramValue = prolanisData.diseaseType === 'dm_type2'
        ? `HbA1c: ${prolanisData.parameters.hba1c?.toFixed(1) || '-'}`
        : `BP: ${Math.round(prolanisData.parameters.systolic || 0)}/${Math.round(prolanisData.parameters.diastolic || 0)}`;

    return (
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 group relative dark:border-slate-700">
            {/* Overdue Indicator */}
            {isOverdue && (
                <div className="absolute right-0 top-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-red-200">
                    ⚠️ Belum Kontrol
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm relative ${patient.gender === 'P' ? 'bg-pink-500' : 'bg-blue-500'
                        }`}>
                        {patient.gender}
                        {/* Status Dot */}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${isControlled ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} title={isControlled ? "Terkontrol" : "Tidak Terkontrol"}></div>
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">{patient.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{patient.age} th</span>
                            <span>•</span>
                            <span className="font-mono">{patient.bpjsNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right mt-4">
                    <div className={`text-sm font-mono font-bold ${isControlled ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                        {paramValue}
                    </div>
                    {consecutive > 0 && (
                        <div className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-1">
                            <Award size={10} /> Streak: {consecutive} bln
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats / Risk Bar */}
            <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Risiko Komplikasi</span>
                    <span>{patient.complicationRisk || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
                    <div
                        className={`h-full rounded-full ${(patient.complicationRisk || 0) > 70 ? 'bg-red-500' :
                            (patient.complicationRisk || 0) > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                        style={{ width: `${patient.complicationRisk || 0}%` }}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const res = callProlanisPatient(patient.id);
                            if (res && !res.success) alert(res.message);
                        }}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs py-1.5 rounded border border-slate-200 font-medium transition-colors"
                    >
                        📞 Panggil
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const res = monitorMedication(patient.id);
                            if (res && !res.success) alert(res.message);
                        }}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs py-1.5 rounded border border-indigo-200 font-medium transition-colors"
                    >
                        💊 Pantau Obat
                    </button>
                </div>
            </div>
        </div>
    );
};

const EmptyState = ({ message }) => (
    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="text-slate-300" />
        </div>
        <p className="text-sm text-slate-400">{message}</p>
    </div>
);

export default ProlanisPanel;
