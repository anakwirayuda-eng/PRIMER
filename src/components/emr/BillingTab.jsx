/**
 * @reflection
 * [IDENTITY]: BillingTab
 * [PURPOSE]: React UI component: BillingTab — uses BillingEngine for all cost calculations.
 * [STATE]: Experimental
 * [ANCHOR]: BillingTab
 * [DEPENDS_ON]: BillingEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Pill, Microscope, Scissors, Receipt } from 'lucide-react';
import { calculatePatientBill } from '../../game/BillingEngine.js';
import { localizeClinicalText } from '../../utils/clinicalContentLocalization.js';

export default function BillingTab({ patient: _patient, isDark, selectedMeds, selectedProcedures, labsRevealed, caseData, social }) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage || i18n.language;
    const localize = (value) => localizeClinicalText(value, locale);
    const billings = calculatePatientBill(selectedMeds, selectedProcedures, labsRevealed, caseData, social?.hasBPJS);

    // Build display items from engine output (single source of truth)
    const items = [
        { label: t('emrWorkspace.billing.consultation'), price: billings.pendaftaran, qty: 1, total: billings.pendaftaran, icon: Stethoscope },
        ...billings.medDetails.map(m => ({
            label: m.name, price: m.sellPrice || m.buyPrice, qty: m.qty, total: m.cost, icon: Pill
        })),
        ...billings.labDetails.map(l => ({
            label: t('emrWorkspace.billing.labPrefix', { name: localize(l.name).toUpperCase() }), price: l.cost, qty: 1, total: l.cost, icon: Microscope
        })),
        ...billings.procDetails.map(p => ({
            label: localize(p.name), price: p.cost, qty: 1, total: p.cost, icon: Scissors
        }))
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className={`flex-1 overflow-y-auto pr-1 thin-scrollbar space-y-6`}>
                <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-emerald-400' : 'text-slate-800'}`}>{t('emrWorkspace.billing.title')}</h4>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${social?.hasBPJS ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                        {social?.hasBPJS ? t('emrWorkspace.billing.payerBpjs') : t('emrWorkspace.billing.payerGeneral')}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className={`rounded-2xl border-2 overflow-hidden ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <table className="w-full text-left text-[10px]">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-200 bg-slate-100/50 text-slate-500'}`}>
                                    <th className="px-4 py-2 font-black uppercase tracking-wider">{t('emrWorkspace.billing.tableItem')}</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-wider text-right">{t('emrWorkspace.billing.tableUnit')}</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-wider text-right">{t('emrWorkspace.billing.tableQty')}</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-wider text-right">{t('emrWorkspace.billing.tableSubtotal')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-current/5">
                                {items.map((item, idx) => (
                                    <tr key={idx} className={`${isDark ? 'text-slate-300' : 'text-slate-600'} hover:bg-current/[0.02] transition-colors`}>
                                        <td className="px-4 py-2.5 flex items-center gap-2">
                                            <item.icon size={10} className="opacity-40 shrink-0" />
                                            <span className="font-bold truncate max-w-[150px]">{item.label}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right font-mono opacity-80">Rp {item.price.toLocaleString('id-ID')}</td>
                                        <td className="px-4 py-2.5 text-right font-mono">{item.qty}</td>
                                        <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-500">Rp {item.total.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={`p-5 rounded-3xl border-2 relative overflow-hidden flex flex-col items-end gap-1 ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-10">
                            <Receipt size={64} className={isDark ? 'text-emerald-500' : 'text-emerald-600'} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-emerald-500/60' : 'text-emerald-600'}`}>{t('emrWorkspace.billing.finalTotal')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-bold ${isDark ? 'text-emerald-500/40' : 'text-emerald-600/40'} line-through`}>Rp {billings.total.toLocaleString('id-ID')}</span>
                            <span className={`text-4xl font-black font-mono tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Rp {billings.finalBill.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p className={`text-[9px] font-bold uppercase ${isDark ? 'text-emerald-400/50' : 'text-emerald-700/50'}`}>
                            {social?.hasBPJS ? t('emrWorkspace.billing.covered') : t('emrWorkspace.billing.cash')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
