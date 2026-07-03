/**
 * @reflection
 * [IDENTITY]: ActionButtons
 * [PURPOSE]: React UI component: ActionButtons.
 * [STATE]: Experimental
 * [ANCHOR]: ActionButtons
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ActionButtons({
    patient,
    isDark,
    social,
    selectedDiagnoses = [],
    prolanisRoster = [],
    handleDischarge,
    handleEnrollProlanis
}) {
    const { t } = useTranslation();
    const isResident = social?.isResident;
    const isDM = selectedDiagnoses.some(d => d.code.startsWith('E10') || d.code.startsWith('E11') || d.code.startsWith('E13'));
    const isHT = selectedDiagnoses.some(d => d.code.startsWith('I10') || d.code.startsWith('I11') || d.code.startsWith('I12') || d.code.startsWith('I13') || d.code.startsWith('I15'));
    const canEnrollProlanis = isResident && !prolanisRoster.some(p => p.id === patient.id) && (isDM || isHT);

    return (
        <div className={`p-3 border-t flex flex-col gap-2 ${isDark ? 'bg-slate-800/80 border-emerald-500/10' : 'bg-white border-slate-100'}`}>
            {/* Prolanis Quick Actions */}
            {canEnrollProlanis && (
                <div className="w-full">
                    <button
                        onClick={handleEnrollProlanis}
                        className={`w-full py-2.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all group mb-1 ${isDark
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
                        aria-label={t('emr.enroll_prolanis')}
                    >
                        <CheckCircle size={16} className="group-hover:scale-110 transition-transform text-emerald-500" aria-hidden="true" />
                        <span className="text-[11px] font-black uppercase tracking-wider">{t('emr.enroll_prolanis')}</span>
                    </button>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => handleDischarge('treat')}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg ${isDark
                        ? 'bg-emerald-600 text-white shadow-emerald-900/40 hover:bg-emerald-500'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    aria-label={t('emr.discharge')}
                >
                    <CheckCircle size={14} aria-hidden="true" /> {t('emr.discharge')}
                </button>
                <button
                    onClick={() => handleDischarge('refer')}
                    title={patient.hidden?.requiredAction !== 'refer' && patient.hidden?.skdi === '4A'
                        ? t('referral.buttons.warn_skdi4a')
                        : t('referral.buttons.refer_default')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all active:scale-95 flex items-center justify-center gap-1 ${isDark
                        ? 'bg-slate-900 border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                        : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'}`}
                    aria-label={t('referral.buttons.refer_aria')}
                >
                    {patient.hidden?.requiredAction !== 'refer' && <AlertCircle size={12} className="opacity-60" />}
                    {t('emr.refer')}
                </button>
            </div>
        </div>
    );
}
