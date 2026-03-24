import React from 'react';
import { Building2, CheckCircle, Clock3, Radio } from 'lucide-react';
import { formatClockMinutes, getReferralProgress } from '../utils/referralLog.js';

export default function ReferralHUD({ activeReferralLog, day, time }) {
    if (!activeReferralLog || activeReferralLog.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-hud flex flex-col gap-3 w-64 pointer-events-none" aria-live="polite" aria-label="Status rujukan aktif">
            {activeReferralLog.map(ref => {
                const progress = getReferralProgress(ref, day, time);
                const etaLabel = formatClockMinutes(ref.estimatedArrivalTotal);
                const arrivalLabel = formatClockMinutes(ref.arrivedTime ?? ref.estimatedArrivalTotal);

                return (
                    <div key={ref.id} className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl animate-in slide-in-from-right duration-500 pointer-events-auto">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${ref.status === 'ARRIVED' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SISRUTE LIVE</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ref.status === 'ARRIVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {ref.status === 'ARRIVED' ? 'SAMPAI' : 'DI JALAN'}
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{ref.patientName}</h4>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-1">
                        <Building2 size={12} className="shrink-0" />
                        <span className="truncate">{ref.hospitalName}</span>
                    </div>

                    {ref.status === 'EN_ROUTE' && (
                        <div className="mt-3">
                            <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-bold">
                                <span>Progress Rujukan</span>
                                <span>ETA {etaLabel}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{
                                    width: `${progress}%`
                                }}></div>
                            </div>
                        </div>
                    )}

                    {ref.status === 'ARRIVED' && (
                        <div className="mt-2 space-y-2">
                            <div className="py-1 px-2 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                                <CheckCircle size={12} />
                                <span>Pasien telah diterima di RS</span>
                            </div>
                            <div className="py-2 px-2.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-semibold border border-slate-200">
                                <div className="flex items-start gap-1.5">
                                    <Radio size={12} className="mt-0.5 shrink-0 text-emerald-600" />
                                    <span>{ref.arrivalNote}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wide">
                                    <Clock3 size={11} className="shrink-0" />
                                    <span>Tiba {arrivalLabel}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                );
            })}
        </div>
    );
}
