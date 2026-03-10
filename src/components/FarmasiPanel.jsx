/**
 * @reflection
 * [IDENTITY]: FarmasiPanel
 * [PURPOSE]: Farmasi poli MVP — processes prescriptions from discharged patients via DispensingEngine.
 * [STATE]: Experimental
 * [ANCHOR]: FarmasiPanel
 * [DEPENDS_ON]: DispensingEngine, useGameStore, MedicationDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Pill, CheckCircle2, AlertTriangle, XCircle, Package, Clock, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { verifyPrescription, checkDrugInteractions } from '../game/DispensingEngine.js';
import { getMedicationById } from '../data/MedicationDatabase.js';

/**
 * Build prescription queue from today's discharged patients
 */
function buildPrescriptionQueue(history, currentDay) {
    if (!history || history.length === 0) return [];
    return history
        .filter(p => p.day === currentDay && p.decision?.medications?.length > 0)
        .map(p => ({
            id: p.id,
            patientName: p.name,
            patientAge: p.age,
            patientGender: p.gender,
            patientAllergies: p.medicalData?.allergies || [],
            medications: p.decision.medications,
            diagnosis: p.decision?.diagnoses?.[0]?.name || p.caseData?.diagnosis || 'Tidak ada diagnosis',
            dischargedAt: p.dischargedAt,
            items: p.decision.medications.map(m => ({
                medId: typeof m === 'object' ? m.id : m,
                dose: 1,
                frequency: typeof m === 'object' ? (m.frequency || 1) : 1,
                duration: typeof m === 'object' ? (m.duration || 1) : 1,
                route: getMedicationById(typeof m === 'object' ? m.id : m)?.form === 'tablet' ? 'oral' : 'oral'
            }))
        }));
}

export default function FarmasiPanel({ isDark, history, currentDay }) {
    const [activeRxId, setActiveRxId] = useState(null);
    const [verifiedRxIds, setVerifiedRxIds] = useState(new Set());
    const [dispensedRxIds, setDispensedRxIds] = useState(new Set());
    const [checklist, setChecklist] = useState({});

    const queue = useMemo(() => buildPrescriptionQueue(history, currentDay), [history, currentDay]);
    const activeRx = queue.find(rx => rx.id === activeRxId);

    const verification = useMemo(() => {
        if (!activeRx) return null;
        return verifyPrescription({
            patientId: activeRx.id,
            patientName: activeRx.patientName,
            patientAge: activeRx.patientAge,
            patientGender: activeRx.patientGender,
            patientAllergies: activeRx.patientAllergies,
            items: activeRx.items
        });
    }, [activeRx]);

    const interactions = useMemo(() => {
        if (!activeRx) return [];
        return checkDrugInteractions(activeRx.items.map(i => i.medId));
    }, [activeRx]);

    const FIVE_RIGHTS = ['Obat Benar', 'Pasien Benar', 'Dosis Benar', 'Rute Benar', 'Waktu Benar'];

    const handleCheckRight = useCallback((right) => {
        setChecklist(prev => ({ ...prev, [right]: !prev[right] }));
    }, []);

    const allChecked = FIVE_RIGHTS.every(r => checklist[r]);

    const handleVerify = useCallback(() => {
        if (!activeRxId || !allChecked) return;
        setVerifiedRxIds(prev => new Set([...prev, activeRxId]));
    }, [activeRxId, allChecked]);

    const handleDispense = useCallback(() => {
        if (!activeRxId || !verifiedRxIds.has(activeRxId)) return;
        setDispensedRxIds(prev => new Set([...prev, activeRxId]));
        setActiveRxId(null);
        setChecklist({});
    }, [activeRxId, verifiedRxIds]);

    const pendingCount = queue.filter(rx => !dispensedRxIds.has(rx.id)).length;
    const completedCount = dispensedRxIds.size;

    // ─── Empty State ───
    if (queue.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center h-full gap-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-dashed ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                    <Pill size={40} className="opacity-30" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold mb-1">Belum Ada Resep</p>
                    <p className="text-[10px] opacity-60 max-w-[200px]">Resep akan otomatis masuk setelah pasien Poli Umum dipulangkan dengan obat.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden gap-4 p-4">
            {/* Left: Prescription Queue */}
            <div className="w-72 shrink-0 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                        Antrian Resep
                    </h3>
                    <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                            {pendingCount} Pending
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            {completedCount} ✓
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 thin-scrollbar pr-1">
                    {queue.map(rx => {
                        const isActive = rx.id === activeRxId;
                        const isDispensed = dispensedRxIds.has(rx.id);
                        const isVerified = verifiedRxIds.has(rx.id);

                        return (
                            <button
                                key={rx.id}
                                onClick={() => { if (!isDispensed) { setActiveRxId(rx.id); setChecklist({}); } }}
                                disabled={isDispensed}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${isDispensed
                                        ? `opacity-50 cursor-default ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`
                                        : isActive
                                            ? `scale-[1.02] ${isDark ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-900/20' : 'bg-amber-50 border-amber-300 shadow-md'}`
                                            : `${isDark ? 'bg-slate-900/40 border-slate-800/60 hover:border-amber-500/30' : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm'}`
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[11px] font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {rx.patientName}
                                    </span>
                                    {isDispensed && <CheckCircle2 size={14} className="text-emerald-500" />}
                                    {isVerified && !isDispensed && <ShieldCheck size={14} className="text-blue-500" />}
                                    {!isVerified && !isDispensed && <ChevronRight size={14} className="opacity-30" />}
                                </div>
                                <p className={`text-[9px] font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {rx.diagnosis}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <Pill size={10} className={`${isDark ? 'text-amber-500' : 'text-amber-600'}`} />
                                    <span className={`text-[9px] font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                        {rx.items.length} obat
                                    </span>
                                    <Clock size={10} className="opacity-30" />
                                    <span className={`text-[9px] opacity-50`}>{rx.dischargedAt || '—'}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Active Dispensing */}
            <div className="flex-1 overflow-y-auto thin-scrollbar">
                {!activeRx ? (
                    <div className={`flex items-center justify-center h-full ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        <div className="text-center">
                            <Package size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-xs font-bold">Pilih Resep dari Antrian</p>
                            <p className="text-[10px] opacity-60 mt-1">Klik pasien di sebelah kiri untuk mulai verifikasi</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Patient Header */}
                        <div className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{activeRx.patientName}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                    {activeRx.patientAge} th • {activeRx.patientGender === 'M' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                            </div>
                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Dx: {activeRx.diagnosis}
                            </p>
                            {activeRx.patientAllergies.length > 0 && (
                                <div className={`mt-2 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1.5 ${isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    <AlertTriangle size={10} />
                                    Alergi: {activeRx.patientAllergies.join(', ')}
                                </div>
                            )}
                        </div>

                        {/* Prescription Items */}
                        <div className={`rounded-2xl border-2 overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className={`px-4 py-2 border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Obat Diresepkan</span>
                            </div>
                            <div className="divide-y divide-current/5">
                                {verification?.verifiedItems?.map((item, idx) => {
                                    const med = getMedicationById(item.medId);
                                    return (
                                        <div key={idx} className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Pill size={12} className={`${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                                    <span className="text-[11px] font-bold">{med?.name || item.medId}</span>
                                                </div>
                                                {item.valid ? (
                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                ) : (
                                                    <XCircle size={12} className="text-red-500" />
                                                )}
                                            </div>
                                            <div className={`text-[9px] pl-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {med?.form} • {item.frequency}x/hari • {item.duration} hari • qty: {item.qtyNeeded}
                                            </div>
                                            {item.errors.length > 0 && (
                                                <div className="mt-1 pl-5 space-y-0.5">
                                                    {item.errors.map((e, i) => (
                                                        <p key={i} className="text-[9px] font-bold text-red-500">{e}</p>
                                                    ))}
                                                </div>
                                            )}
                                            {item.warnings.length > 0 && (
                                                <div className="mt-1 pl-5 space-y-0.5">
                                                    {item.warnings.map((w, i) => (
                                                        <p key={i} className="text-[9px] font-medium text-amber-500">{w}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drug Interactions */}
                        {interactions.length > 0 && (
                            <div className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                    ⚠️ Interaksi Obat
                                </h5>
                                {interactions.map((inter, idx) => (
                                    <div key={idx} className={`text-[10px] mb-1 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                                        <span className="font-bold">{inter.drugA}</span> × <span className="font-bold">{inter.drugB}</span>
                                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${inter.severity === 'major' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {inter.severity}
                                        </span>
                                        <span className="ml-1 opacity-70">— {inter.description}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 5-Rights Checklist */}
                        {!verifiedRxIds.has(activeRxId) && (
                            <div className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                                    ✅ Verifikasi 5-Benar
                                </h5>
                                <div className="space-y-2">
                                    {FIVE_RIGHTS.map(right => (
                                        <button
                                            key={right}
                                            onClick={() => handleCheckRight(right)}
                                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${checklist[right]
                                                    ? `${isDark ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`
                                                    : `${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500/30' : 'bg-white border border-slate-200 hover:border-blue-300 shadow-sm'}`
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${checklist[right]
                                                    ? 'bg-emerald-500 text-white'
                                                    : `${isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400'}`
                                                }`}>
                                                {checklist[right] && <CheckCircle2 size={12} />}
                                            </div>
                                            <span className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{right}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={!allChecked}
                                    className={`w-full mt-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${allChecked
                                            ? `${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`
                                            : `${isDark ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`
                                        }`}
                                >
                                    <ShieldCheck size={14} className="inline mr-2" />
                                    Verifikasi Resep
                                </button>
                            </div>
                        )}

                        {/* Dispense Button */}
                        {verifiedRxIds.has(activeRxId) && !dispensedRxIds.has(activeRxId) && (
                            <button
                                onClick={handleDispense}
                                className={`w-full py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] ${isDark
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 hover:shadow-xl'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                <Zap size={16} className="inline mr-2" />
                                Serahkan Obat ke Pasien
                            </button>
                        )}

                        {dispensedRxIds.has(activeRxId) && (
                            <div className={`p-4 rounded-2xl text-center ${isDark ? 'bg-emerald-500/10 border-2 border-emerald-500/20' : 'bg-emerald-50 border-2 border-emerald-100'}`}>
                                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                                <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Obat Sudah Diserahkan</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
