/**
 * @reflection
 * [IDENTITY]: ProlanisPanel
 * [PURPOSE]: Chronic care follow-up panel for Prolanis patients.
 * [STATE]: Experimental
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import { Users, Activity, Heart, Award, Phone, Pill, Dumbbell } from 'lucide-react';
import { showToast } from '../utils/ToastManager.js';

const ProlanisPanel = ({ compact = false, onPatientCalled }) => {
    const { t } = useTranslation();
    const { prolanisRoster, prolanisState, triggerSenamProlanis, day, playerStats: _playerStats, stats: _stats } = useGame();

    const dmPatients = prolanisRoster.filter(p => p.prolanisData.diseaseType === 'dm_type2');
    const htPatients = prolanisRoster.filter(p => p.prolanisData.diseaseType === 'hypertension');
    const totalEnrolled = prolanisRoster.length;
    const controlledCount = prolanisRoster.filter(p => {
        const history = p.prolanisData.history;
        return history.length > 0 && history[history.length - 1].wasControlled;
    }).length;
    const controlledRate = totalEnrolled > 0 ? Math.round((controlledCount / totalEnrolled) * 100) : 0;
    const currentMonth = Math.floor((day - 1) / 30);
    const isSenamDone = prolanisState?.lastSenamMonth === currentMonth;

    const handleSenam = () => {
        const result = triggerSenamProlanis();
        if (!result.success) {
            showToast(result.message || t('prolanisPanel.toast.activityUnavailable'), 'warning');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
            {!compact && (
                <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                        <img src="/images/wilayah/puskesmas_iso.png" alt={t('prolanisPanel.header.imageAlt')} className="h-full object-cover object-left" />
                    </div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Heart className="text-pink-300" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{t('prolanisPanel.title')}</h2>
                                    <p className="text-indigo-100 text-sm">{t('prolanisPanel.subtitle')}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <HeaderMetric
                                    label={t('prolanisPanel.metrics.controlledRate')}
                                    value={`${controlledRate}%`}
                                    valueClass={controlledRate >= 75 ? 'text-emerald-300' : 'text-amber-300'}
                                />
                                <HeaderMetric
                                    label={t('prolanisPanel.metrics.totalPatients')}
                                    value={totalEnrolled}
                                    valueClass="text-white"
                                />
                            </div>
                        </div>

                        <div className="bg-white text-slate-800 rounded-xl p-4 shadow-lg w-72 border-2 border-indigo-200">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Dumbbell size={16} className="text-indigo-600" /> {t('prolanisPanel.exercise.title')}
                                </h3>
                                {isSenamDone ? (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Award size={12} /> {t('prolanisPanel.exercise.done')}
                                    </span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {t('prolanisPanel.exercise.pending')}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 mb-3">
                                {isSenamDone ? t('prolanisPanel.exercise.doneDescription') : t('prolanisPanel.exercise.pendingDescription')}
                            </p>

                            {!isSenamDone && (
                                <button
                                    onClick={handleSenam}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:transform active:scale-95"
                                >
                                    <span>{t('prolanisPanel.exercise.action')}</span>
                                    <div className="flex flex-col items-start text-[10px] font-normal opacity-90 leading-tight">
                                        <span>{t('prolanisPanel.exercise.energyCost', { value: 20 })}</span>
                                        <span>{t('prolanisPanel.exercise.moneyCost', { value: 150 })}</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {compact && (
                <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b flex items-center justify-between">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                        <Heart size={16} className="text-pink-600 fill-pink-600" />
                        {t('prolanisPanel.compactTitle')}
                    </h3>
                    <span className="text-xs bg-white px-2 py-0.5 rounded border text-slate-500 font-mono">
                        {t('prolanisPanel.totalValue', { count: prolanisRoster.length })}
                    </span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <DiseaseSection
                    title={t('prolanisPanel.diseases.dm')}
                    count={dmPatients.length}
                    patients={dmPatients}
                    emptyMessage={t('prolanisPanel.empty.dm')}
                    onPatientCalled={onPatientCalled}
                />
                <DiseaseSection
                    title={t('prolanisPanel.diseases.hypertension')}
                    count={htPatients.length}
                    patients={htPatients}
                    emptyMessage={t('prolanisPanel.empty.hypertension')}
                    onPatientCalled={onPatientCalled}
                />
            </div>
        </div>
    );
};

function HeaderMetric({ label, value, valueClass }) {
    return (
        <div className="text-center bg-black/20 rounded-lg p-2 px-4 shadow-sm backdrop-blur-sm border border-white/10">
            <div className="text-xs text-indigo-100 uppercase tracking-widest">{label}</div>
            <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
        </div>
    );
}

function DiseaseSection({ title, count, patients, emptyMessage, onPatientCalled }) {
    const { t } = useTranslation();
    return (
        <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3 sticky top-0 bg-white dark:bg-slate-800 z-10 py-2 border-b border-slate-100 dark:border-slate-700">
                <Activity size={18} className="text-indigo-500" />
                {title}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-auto bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    {t('prolanisPanel.patientCount', { count })}
                </span>
            </h3>

            {patients.length === 0 ? (
                <EmptyState message={emptyMessage} />
            ) : (
                <div className="space-y-2">
                    {patients.map(p => <PatientCard key={p.id} patient={p} onPatientCalled={onPatientCalled} />)}
                </div>
            )}
        </div>
    );
}

const PatientCard = ({ patient, onPatientCalled }) => {
    const { t } = useTranslation();
    const { prolanisData } = patient;
    const { day, callProlanisPatient, monitorMedication } = useGame();
    const history = prolanisData.history || [];
    const lastVisit = history.length > 0 ? history[history.length - 1] : null;
    const isControlled = lastVisit?.wasControlled;
    const consecutive = prolanisData.consecutiveControlled || 0;
    const lastVisitDay = lastVisit ? lastVisit.day : 0;
    const daysSinceVisit = day - lastVisitDay;
    const isOverdue = daysSinceVisit > 30;
    const paramValue = prolanisData.diseaseType === 'dm_type2'
        ? t('prolanisPanel.params.hba1c', { value: prolanisData.parameters.hba1c?.toFixed(1) || '-' })
        : t('prolanisPanel.params.bp', {
            systolic: Math.round(prolanisData.parameters.systolic || 0),
            diastolic: Math.round(prolanisData.parameters.diastolic || 0)
        });

    return (
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 group relative dark:border-slate-700">
            {isOverdue && (
                <div className="absolute right-0 top-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-red-200">
                    {t('prolanisPanel.patient.overdue')}
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm relative ${patient.gender === 'P' ? 'bg-pink-500' : 'bg-blue-500'
                        }`}>
                        {patient.gender}
                        <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${isControlled ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                            title={isControlled ? t('prolanisPanel.patient.controlled') : t('prolanisPanel.patient.uncontrolled')}
                        />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">{patient.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{t('prolanisPanel.patient.age', { age: patient.age })}</span>
                            <span>|</span>
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
                            <Award size={10} /> {t('prolanisPanel.patient.streak', { count: consecutive })}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>{t('prolanisPanel.patient.complicationRisk')}</span>
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

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const res = callProlanisPatient(patient.id);
                            if (res && !res.success) showToast(res.message || t('prolanisPanel.toast.callUnavailable'), 'warning');
                            else onPatientCalled?.();
                        }}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs py-1.5 rounded border border-slate-200 font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <Phone size={12} /> {t('prolanisPanel.actions.call')}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const res = monitorMedication(patient.id);
                            if (res && !res.success) showToast(res.message || t('prolanisPanel.toast.monitorUnavailable'), 'warning');
                        }}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs py-1.5 rounded border border-indigo-200 font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <Pill size={12} /> {t('prolanisPanel.actions.monitorMedication')}
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
