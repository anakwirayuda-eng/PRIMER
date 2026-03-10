/**
 * @reflection
 * [IDENTITY]: BillingSummary
 * [PURPOSE]: React UI component: BillingSummary.
 * [STATE]: Experimental
 * [ANCHOR]: BillingSummary
 * [DEPENDS_ON]: BillingEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { Shield } from 'lucide-react';
import { calculatePatientBill } from '../../../game/BillingEngine.js';

export default function BillingSummary({
    isDark,
    social,
    selectedMeds = [],
    selectedProcedures = [],
    labsRevealed = {},
    caseData
}) {
    const isBPJS = social?.hasBPJS;
    const billings = calculatePatientBill(selectedMeds, selectedProcedures, labsRevealed, caseData, isBPJS);

    return (
        <div className="space-y-3 px-3 pb-1 border-t border-current/5">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-slate-500'}`}>
                Rekap Billing (Estimasi)
            </span>
            <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${isBPJS
                ? (isDark ? 'bg-cyan-500/5 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-cyan-50 border-cyan-200')
                : (isDark ? 'bg-orange-500/5 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-orange-50 border-orange-200')}`}>
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isBPJS ? 'text-cyan-600' : 'text-orange-600'}`}>Total Biaya Layan</p>
                        <p className={`text-sm font-mono font-bold ${isDark ? 'text-white/60' : 'text-slate-400'} line-through decoration-emerald-500/30`}>
                            Rp {billings.total.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isBPJS ? 'text-cyan-600' : 'text-orange-600'}`}>Mandiri (Patient Pay)</p>
                        <p className={`text-2xl font-black font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Rp {billings.finalBill.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-current/10">
                    <div className={`p-1 rounded ${isBPJS ? 'bg-cyan-500 text-white' : 'bg-orange-500 text-white'}`}>
                        <Shield size={10} />
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-wider ${isBPJS ? 'text-cyan-600' : 'text-orange-600'}`}>
                        {isBPJS ? `Tanggungan ${social.bpjsClass} (JKN)` : 'Pasien Umum / Tanpa Jaminan'}
                    </p>
                </div>
            </div>
        </div>
    );
}
