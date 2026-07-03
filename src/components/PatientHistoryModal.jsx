/**
 * @reflection
 * [IDENTITY]: PatientHistoryModal
 * [PURPOSE]: React UI component: PatientHistoryModal.
 * [STATE]: Experimental
 * [ANCHOR]: PatientHistoryModal
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import useModalA11y from '../hooks/useModalA11y.js';
import { X, Heart, HeartCrack, Ambulance, AlertTriangle, ThumbsDown, UserCheck, Bot, Send } from 'lucide-react';

const outcomeConfig = {
    pulih: { labelKey: 'pulih', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    memburuk: { labelKey: 'memburuk', icon: HeartCrack, color: 'text-amber-600', bg: 'bg-amber-50' },
    meninggal: { labelKey: 'meninggal', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    komplain: { labelKey: 'komplain', icon: ThumbsDown, color: 'text-orange-600', bg: 'bg-orange-50' },
    referred: { labelKey: 'referred', icon: Ambulance, color: 'text-blue-600', bg: 'bg-blue-50' },
    rujuk_stabil: { labelKey: 'rujuk_stabil', icon: Ambulance, color: 'text-blue-600', bg: 'bg-blue-50' },
    rujuk_tidak_perlu: { labelKey: 'rujuk_tidak_perlu', icon: Ambulance, color: 'text-purple-600', bg: 'bg-purple-50' },
    // Codex Fix: missing outcome statuses from useGameStore
    delegated: { labelKey: 'delegated', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    sisrute_transferred: { labelKey: 'sisrute_transferred', icon: Send, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    referred_sisrute: { labelKey: 'referred_sisrute', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    stabilized: { labelKey: 'stabilized', icon: Heart, color: 'text-teal-600', bg: 'bg-teal-50' },
    default: { labelKey: 'default', icon: UserCheck, color: 'text-slate-600', bg: 'bg-slate-50' }
};

export default function PatientHistoryModal({ patients, filter, onClose, title }) {
    const { t } = useTranslation();
    const modalRef = useModalA11y(onClose);
    const filteredPatients = patients.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'bpjs') return p.social?.hasBPJS;
        if (filter === 'umum') return !p.social?.hasBPJS;
        if (filter === 'rujukan') return p.decision?.action === 'refer';
        return true;
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="patient-history-title" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                    <h2 id="patient-history-title" className="text-lg font-bold text-slate-800">{title || t('patientHistory.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        aria-label={t('patientHistory.closeAria')}
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredPatients.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">
                            <UserCheck size={48} className="mx-auto mb-3 opacity-30" />
                            <p>{t('patientHistory.empty')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredPatients.map((patient, idx) => {
                                const outcome = outcomeConfig[patient.outcomeStatus] || outcomeConfig.default;
                                const OutcomeIcon = outcome.icon;

                                return (
                                    <div
                                        key={patient.id || idx}
                                        className={`p-3 rounded-lg border ${outcome.bg} border-slate-200`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-800">{patient.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {/* Codex Fix: generator uses 'L'/'P', not 'male'/'female' */}
                                                        {t('patientHistory.ageGender', {
                                                            age: patient.age,
                                                            gender: (patient.gender === 'male' || patient.gender === 'L') ? t('patientHistory.gender.male') : t('patientHistory.gender.female')
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 mt-1">
                                                    <span className="font-medium">{t('patientHistory.diagnosis')}:</span> {patient.decision?.diagnoses?.[0] || patient.medicalData?.trueDiagnosisCode || patient.medicalData?.diagnosisName || '-'}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    <span className="font-medium">{t('patientHistory.decision')}:</span>{' '}
                                                    {/* Codex Fix: properly label all action types */}
                                                    {patient.decision?.action
                                                        ? t(`patientHistory.actions.${patient.decision.action}`, { defaultValue: patient.decision.action })
                                                        : t('patientHistory.actions.default')}
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${outcome.color} ${outcome.bg}`}>
                                                <OutcomeIcon size={14} />
                                                {t(`patientHistory.outcomes.${outcome.labelKey}`)}
                                            </div>
                                        </div>
                                        {/* Insurance Badge */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${patient.social?.hasBPJS ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {patient.social?.hasBPJS ? 'BPJS' : t('patientHistory.generalPatient')}
                                            </span>
                                            {patient.satisfactionScore && (
                                                <span className={`text-xs px-2 py-0.5 rounded ${patient.satisfactionScore >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {t('patientHistory.satisfaction', { score: patient.satisfactionScore })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                    <p className="text-xs text-slate-500 text-center">
                        {t('patientHistory.total', { count: filteredPatients.length })}
                    </p>
                </div>
            </div>
        </div>
    );
}
