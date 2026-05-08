/**
 * @reflection
 * [IDENTITY]: PosyanduModal
 * [PURPOSE]: Posyandu session setup, activity, and summary flow.
 * [STATE]: Experimental
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import {
    X, Scale, ClipboardList, Syringe, Apple, Baby, Award,
    Users, CheckCircle, AlertTriangle, ChevronRight, Heart, Clock, Megaphone
} from 'lucide-react';
import {
    POSYANDU_ACTIVITIES,
    getEligibleParticipants,
    calculateAttendance,
    processActivityResult,
    generatePosyanduSummary
} from '../game/PosyanduEngine.js';
import { calculateIKS } from '../game/GameCore.js';
import { chanceFromSeed } from '../utils/deterministicRandom.js';
import { calculateAverageIksFromFamilies } from '../utils/villageMetrics.js';
import { showToast } from '../utils/ToastManager.js';

const ACTIVITY_ICONS = {
    penimbangan: Scale,
    kms: ClipboardList,
    imunisasi: Syringe,
    penyuluhan_gizi: Apple,
    penyuluhan_asi: Baby,
    pmba: Baby
};

const REMINDER_ENERGY_COST = 5;

export default function PosyanduModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return <PosyanduModalContent onClose={onClose} />;
}

function PosyanduModalContent({ onClose }) {
    const { t } = useTranslation();
    const modalRef = useModalA11y(onClose);
    const {
        villageData, reputation, day, playerStats, setPlayerStats,
        setTime, setReputation, setVillageData, soundManager, setHistory, getStaffBuffs,
        gainXp
    } = useGame();

    const [phase, setPhase] = useState('setup');
    const [selectedActivities, setSelectedActivities] = useState(['penimbangan', 'kms']);
    const [attendees, setAttendees] = useState([]);
    const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [reminderSent, setReminderSent] = useState(false);

    const eligibleChildren = useMemo(() => getEligibleParticipants(villageData, 'penimbangan'), [villageData]);
    const eligibleMothers = useMemo(() => getEligibleParticipants(villageData, 'penyuluhan_gizi'), [villageData]);

    const localizeActivity = useCallback((activity) => ({
        ...activity,
        name: t(`posyanduModal.activities.${activity.id}.name`, { defaultValue: activity.name }),
        description: t(`posyanduModal.activities.${activity.id}.description`, { defaultValue: activity.description })
    }), [t]);

    const localizedActivities = useMemo(
        () => Object.values(POSYANDU_ACTIVITIES).map(localizeActivity),
        [localizeActivity]
    );

    const toggleActivity = (activityId) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(a => a !== activityId)
                : [...prev, activityId]
        );
    };

    const getReminderEnergyCost = () => (reminderSent ? REMINDER_ENERGY_COST : 0);
    const getSessionEnergyCost = () => (
        selectedActivities.reduce((sum, actId) => sum + POSYANDU_ACTIVITIES[actId].energyCost, 0) +
        getReminderEnergyCost()
    );

    const startPosyandu = () => {
        const totalEnergy = getSessionEnergyCost();

        if (playerStats.energy < totalEnergy) {
            showToast(t('posyanduModal.toast.notEnoughEnergy'), 'warning');
            return;
        }

        const hasChildActivity = selectedActivities.some(a => POSYANDU_ACTIVITIES[a].targetAge !== null);
        const hasMotherActivity = selectedActivities.some(a => POSYANDU_ACTIVITIES[a].targetAge === null);

        let participants = [];
        if (hasChildActivity) participants = [...participants, ...eligibleChildren];
        if (hasMotherActivity) participants = [...participants, ...eligibleMothers];

        const attending = calculateAttendance(participants, {
            reminderSent,
            reputation,
            iksScore: villageData?.averageIks || 0.5
        });

        if (attending.length === 0) {
            showToast(t('posyanduModal.toast.noAttendance'), 'info', 4200);
            return;
        }

        setAttendees(attending);
        setPhase('activity');
        soundManager?.playConfirm();
    };

    const processCurrentAttendee = () => {
        const attendee = attendees[currentAttendeeIndex];
        if (!attendee) return;

        const attendeeResults = selectedActivities.map(actId => {
            const activity = POSYANDU_ACTIVITIES[actId];
            return processActivityResult(activity, attendee, {});
        });

        const nextResults = [...results, ...attendeeResults];
        setResults(nextResults);

        if (currentAttendeeIndex < attendees.length - 1) {
            setCurrentAttendeeIndex(prev => prev + 1);
        } else {
            finishPosyandu(nextResults);
        }
    };

    const finishPosyandu = (sessionResults = results) => {
        const summary = generatePosyanduSummary(sessionResults);
        const buffs = getStaffBuffs();
        const nutritionBonus = buffs.childNutrition || 0;
        const improvementChance = 0.3 + (nutritionBonus / 100);
        const totalXpEarned = summary.totalXP + (nutritionBonus * 2);

        gainXp(totalXpEarned);

        setPlayerStats(prev => ({
            ...prev,
            energy: prev.energy - getSessionEnergyCost()
        }));

        const totalTime = selectedActivities.reduce((sum, actId) => sum + POSYANDU_ACTIVITIES[actId].timeCost, 0);
        setTime(time => Math.min(960, time + totalTime));
        setReputation(prev => Math.min(100, prev + 2 + Math.floor(summary.totalParticipants / 5)));

        setVillageData(prev => {
            if (!prev) return prev;
            const updatedFamilies = prev.families.map(fam => {
                const attended = attendees.some(a => a.familyId === fam.id);
                if (!attended) return fam;

                const indicators = { ...fam.indicators };
                selectedActivities.forEach(actId => {
                    const activity = POSYANDU_ACTIVITIES[actId];
                    if (activity.iksImpact?.indicator === 'gizi') indicators.gizi = true;
                    if (activity.iksImpact?.indicator === 'imunisasi') indicators.imunisasi = true;
                });

                const nutritionSeed = `posyandu:${day}:${fam.id}:${selectedActivities.join('|')}`;
                if (chanceFromSeed(nutritionSeed, improvementChance)) {
                    indicators.bayi_asi_eksklusif = true;
                    indicators.balita_pertumbuhan = true;
                }

                return { ...fam, indicators, iksScore: calculateIKS(indicators) };
            });

            const averageIks = calculateAverageIksFromFamilies(updatedFamilies);
            return { ...prev, families: updatedFamilies, averageIks };
        });

        setHistory(prev => [...prev, {
            day,
            type: 'posyandu',
            label: t('posyanduModal.history.label'),
            description: t('posyanduModal.history.description', {
                participants: summary.totalParticipants,
                issues: summary.issuesFound,
                nutritionBonus
            }),
            xp: totalXpEarned,
            timestamp: Date.now()
        }]);

        setPhase('summary');
        soundManager?.playSuccess();
    };

    const summary = useMemo(() => {
        if (results.length === 0) return null;
        return generatePosyanduSummary(results);
    }, [results]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="posyandu-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Heart className="text-white" size={28} />
                            </div>
                            <div>
                                <h2 id="posyandu-title" className="text-2xl font-bold">{t('posyanduModal.title')}</h2>
                                <p className="text-pink-100 text-sm">{t('posyanduModal.subtitle')}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label={t('posyanduModal.closeAria')}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <HeaderStat label={t('posyanduModal.stats.eligibleChildren')} value={eligibleChildren.length} />
                        <HeaderStat label={t('posyanduModal.stats.eligibleMothers')} value={eligibleMothers.length} />
                        <HeaderStat label={t('posyanduModal.stats.day')} value={day} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {phase === 'setup' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <ClipboardList size={18} />
                                    {t('posyanduModal.setup.chooseActivities')}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {localizedActivities.map(activity => {
                                        const Icon = ACTIVITY_ICONS[activity.id] || ClipboardList;
                                        const isSelected = selectedActivities.includes(activity.id);
                                        return (
                                            <button
                                                key={activity.id}
                                                onClick={() => toggleActivity(activity.id)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-slate-200 hover:border-pink-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-700 text-sm">{activity.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-2">
                                                            <span>{t('posyanduModal.cost.energy', { value: activity.energyCost })}</span>
                                                            <span>{t('posyanduModal.cost.time', { value: activity.timeCost })}</span>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle size={20} className="text-pink-500" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={reminderSent}
                                        onChange={e => setReminderSent(e.target.checked)}
                                        className="w-5 h-5 rounded accent-amber-500"
                                    />
                                    <div>
                                        <div className="font-bold text-amber-800 flex items-center gap-2">
                                            <Megaphone size={16} /> {t('posyanduModal.reminder.title')}
                                        </div>
                                        <div className="text-xs text-amber-600">
                                            {t('posyanduModal.reminder.description', { energy: REMINDER_ENERGY_COST })}
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <button
                                onClick={startPosyandu}
                                disabled={selectedActivities.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <span>{t('posyanduModal.setup.start')}</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {phase === 'activity' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all"
                                        style={{ width: `${((currentAttendeeIndex + 1) / attendees.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm font-bold text-slate-500">
                                    {currentAttendeeIndex + 1} / {attendees.length}
                                </div>
                            </div>

                            {attendees[currentAttendeeIndex] && (
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 text-center">
                                    <div className="w-20 h-20 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center text-pink-500">
                                        {attendees[currentAttendeeIndex].age < 6 ? <Baby size={38} /> : <Users size={38} />}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {attendees[currentAttendeeIndex].name}
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        {formatAttendeeAge(t, attendees[currentAttendeeIndex].age)} | {t('posyanduModal.activity.family', { family: attendees[currentAttendeeIndex].familyName })}
                                    </p>

                                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                                        {selectedActivities.map(actId => {
                                            const activity = localizeActivity(POSYANDU_ACTIVITIES[actId]);
                                            const Icon = ACTIVITY_ICONS[activity.id] || ClipboardList;
                                            return (
                                                <span key={actId} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <Icon size={12} /> {activity.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={processCurrentAttendee}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                <span>{t('posyanduModal.activity.serveNext')}</span>
                            </button>
                        </div>
                    )}

                    {phase === 'summary' && summary && (
                        <div className="space-y-6 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto flex items-center justify-center">
                                <Award size={48} className="text-emerald-600" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{t('posyanduModal.summary.title')}</h3>
                                <p className="text-slate-500">{t('posyanduModal.summary.subtitle')}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <SummaryStat value={summary.totalParticipants} label={t('posyanduModal.summary.participants')} valueClass="text-pink-600" />
                                <SummaryStat value={`+${summary.totalXP}`} label={t('posyanduModal.summary.xp')} valueClass="text-amber-500" />
                                <SummaryStat value={summary.issuesFound} label={t('posyanduModal.summary.issues')} valueClass="text-rose-500" />
                            </div>

                            {summary.issuesFound > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                                    <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                                        <AlertTriangle size={18} />
                                        <span>{t('posyanduModal.summary.followUpTitle')}</span>
                                    </div>
                                    <p className="text-sm text-amber-600">
                                        {t('posyanduModal.summary.followUpBody', { count: summary.issuesFound })}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all"
                            >
                                {t('common.done')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HeaderStat({ label, value }) {
    return (
        <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-xs text-pink-100">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    );
}

function SummaryStat({ value, label, valueClass }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <div className={`text-3xl font-black ${valueClass}`}>{value}</div>
            <div className="text-xs text-slate-500 font-medium">{label}</div>
        </div>
    );
}

function formatAttendeeAge(t, age) {
    if (age < 1) {
        return t('posyanduModal.activity.ageMonths', { count: Math.round(age * 12) });
    }
    return t('posyanduModal.activity.ageYears', { count: age });
}
