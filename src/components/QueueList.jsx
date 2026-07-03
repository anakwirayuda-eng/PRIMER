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
import { useGameStore } from '../store/useGameStore.js';
import { Timer, Bot, Scale, Dna, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { getAvatarStyle } from '../utils/AvatarUtils.js';
import { getUpcomingFollowups } from '../game/ConsequenceEngine.js';
import { filterQueueByService } from '../utils/clinicalRouting.js';

export default function QueueList({ activeService, patients = null }) {
    const { queue, admitPatient, activePatientId, delegateToMaia, time, day } = useGame();
    const consequenceQueue = useGameStore(state => state.clinical.consequenceQueue || []);
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const tr = (key, fallback, options = {}) => {
        const value = t(key, options);
        return value === key ? fallback : value;
    };
    const serviceName = activeService?.id
        ? tr(`clinical.services.${activeService.id}.name`, activeService?.name || tr('queue.service_fallback', 'General Clinic'))
        : tr('queue.service_fallback', 'General Clinic');
    const serviceDescription = activeService?.id
        ? tr(`clinical.services.${activeService.id}.description`, activeService?.description || serviceName)
        : serviceName;

    const upcomingFollowups = React.useMemo(
        () => getUpcomingFollowups(consequenceQueue, day, 3).length,
        [consequenceQueue, day]
    );

    const visibleQueue = React.useMemo(
        () => (Array.isArray(patients) ? patients : filterQueueByService(queue, activeService?.id)),
        [patients, queue, activeService?.id]
    );

    const getWaitTimeMinutes = React.useCallback(
        (patient) => Math.max(0, Math.round(time - (patient.joinedAt || 480))),
        [time]
    );

    const maxWaitMinutes = React.useMemo(
        () => (visibleQueue.length > 0 ? Math.max(...visibleQueue.map(getWaitTimeMinutes)) : 0),
        [visibleQueue, getWaitTimeMinutes]
    );

    const getBMIIndicator = (patient) => {
        const bmi = patient.anthropometrics?.bmiCategory;
        if (!bmi) return null;
        if (bmi === 'Underweight') return { color: 'text-amber-500', icon: 'v' };
        if (bmi === 'Overweight') return { color: 'text-orange-500', icon: '^' };
        if (bmi?.startsWith('Obese')) return { color: 'text-red-500', icon: '!' };
        return null;
    };

    const getPatientLocaleMeta = (patient) => {
        const residentLabel = patient.social?.isResident ? t('clinical.resident') : t('clinical.visitor');
        const coverageLabel = patient.social?.hasBPJS ? 'BPJS' : tr('queue.general', 'General');
        return {
            ageLabel: tr('queue.age_compact', `${patient.age} y.o.`, { age: patient.age }),
            residentLabel,
            coverageLabel
        };
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className={`sticky top-0 z-10 overflow-hidden bg-gradient-to-r ${activeService?.color || 'from-emerald-600 to-teal-600'} p-3.5 text-white`}>
                {(!activeService || activeService.id === 'poli_umum') && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
                        <img src="/images/wilayah/poli_umum_bg.png" alt={t('queue.background_alt')} className="h-full object-cover object-left" />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-1 flex min-w-0 items-center gap-2">
                                {activeService?.icon ? <span className="text-xl drop-shadow-sm">{activeService.icon}</span> : <Dna size={18} />}
                                <h2 className="flex min-w-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                                    <span className="truncate">{serviceName}</span>
                                    {time >= 960 && (
                                        <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] text-white">{tr('queue.closed_badge', 'Closed')}</span>
                                    )}
                                </h2>
                            </div>
                            <p className="text-[11px] leading-relaxed text-emerald-50/85">
                                {serviceDescription}
                            </p>
                        </div>
                        <div className="shrink-0 rounded-xl bg-white/15 px-2.5 py-2 text-right backdrop-blur-sm">
                            <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/70">{t('queue.counter_label')}</div>
                            <div className="text-lg font-black">{visibleQueue.length}</div>
                        </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {time >= 960 ? (
                            <span className="text-xs italic text-emerald-100">{tr('queue.registration_closed', 'Registration closed')}</span>
                        ) : (
                            <>
                                <span className={`${isDark ? 'bg-white/10 text-emerald-100' : 'bg-white/20 text-white'} rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]`}>
                                    {visibleQueue.length} {t('dashboard.waiting')}
                                </span>
                                {upcomingFollowups > 0 && (
                                    <span className={`${isDark ? 'border border-amber-500/30 bg-amber-500/15 text-amber-300' : 'border border-amber-200 bg-amber-100 text-amber-700'} rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]`}>
                                        {tr('queue.upcoming_followups', `${upcomingFollowups} follow-ups`, { count: upcomingFollowups })}
                                    </span>
                                )}
                                {visibleQueue.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-50">
                                        <Timer size={10} />
                                        {tr('queue.max_wait', `${maxWaitMinutes}m max wait`, {
                                            minutes: maxWaitMinutes
                                        })}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {visibleQueue.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-400">
                        {t('queue.empty')}
                        <br />
                        <span className="text-xs">({t('queue.relax')})</span>
                    </div>
                )}

                {visibleQueue.map(patient => {
                    const waitTime = getWaitTimeMinutes(patient);
                    const bmiIndicator = getBMIIndicator(patient);
                    const patientMeta = getPatientLocaleMeta(patient);

                    return (
                        <div
                            key={patient.id}
                            className={clsx(
                                'group flex items-center justify-between gap-2 px-2.5 py-2.5 transition-colors lg:gap-3 lg:px-3 lg:py-3',
                                isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50',
                                activePatientId === patient.id ? (isDark ? 'border-l-4 border-emerald-500 bg-emerald-900/30' : 'border-l-4 border-emerald-500 bg-emerald-50') : ''
                            )}
                        >
                            <button
                                onClick={() => admitPatient(patient.id)}
                                className="flex min-w-0 flex-1 items-center gap-2 text-left lg:gap-3"
                            >
                                <div className="relative">
                                    <div
                                        className={clsx(
                                            'shrink-0 overflow-hidden rounded-full border-2',
                                            patient.isFollowup ? 'border-amber-400 shadow-sm shadow-amber-200'
                                                : patient.social?.hasBPJS ? 'border-emerald-200 shadow-sm shadow-emerald-100' : 'border-slate-200'
                                        )}
                                    >
                                        <div
                                            style={getAvatarStyle(patient.age, patient.gender, 36)}
                                            className="h-full w-full"
                                        />
                                    </div>
                                    {patient.isFollowup && (
                                        <span
                                            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm"
                                            title={tr('queue.followup_patient', 'Follow-up patient')}
                                        >
                                            <RotateCcw size={10} />
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex min-w-0 items-center gap-1.5">
                                        <p className={clsx('min-w-0 flex-1 truncate text-sm font-semibold leading-tight', isDark ? 'text-slate-100' : 'text-slate-900')}>{patient.name}</p>
                                        {patient.isFollowup && (
                                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                                {tr('queue.followup_short', 'Follow-up')}
                                            </span>
                                        )}
                                    </div>

                                    <div className={`mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-medium leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <span>{patientMeta.ageLabel}</span>
                                        <span className="opacity-40">|</span>
                                        <span>{patientMeta.residentLabel}</span>
                                        <span className="opacity-40">|</span>
                                        <span className={patient.social?.hasBPJS ? (isDark ? 'text-emerald-300' : 'text-emerald-700') : ''}>
                                            {patientMeta.coverageLabel}
                                        </span>
                                        {bmiIndicator && (
                                            <span className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${bmiIndicator.color}`}>
                                                <Scale size={10} />
                                                {bmiIndicator.icon}
                                            </span>
                                        )}
                                        {patient.isFollowup && patient.followupData?.severity && (
                                            <span
                                                className={clsx(
                                                    'rounded-full px-2 py-0.5 font-bold',
                                                    patient.followupData.severity === 'critical' ? 'text-red-500'
                                                        : patient.followupData.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                                                )}
                                            >
                                                {patient.followupData.severity === 'critical' ? tr('queue.severity_critical', 'Critical')
                                                    : patient.followupData.severity === 'medium' ? tr('queue.severity_medium', 'Moderate') : tr('queue.severity_improving', 'Improving')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
                                <div
                                    className={clsx(
                                        'flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold tabular-nums lg:text-[11px]',
                                        waitTime > 60 ? 'font-bold text-red-500'
                                            : waitTime > 30 ? 'font-medium text-amber-500'
                                                : 'text-slate-400',
                                        isDark ? 'bg-slate-800' : 'bg-slate-100'
                                    )}
                                >
                                    <Timer size={12} />
                                    <span>{waitTime}m</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        delegateToMaia(patient.id);
                                    }}
                                    className={`flex items-center gap-1 rounded p-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100 ${isDark ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
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
