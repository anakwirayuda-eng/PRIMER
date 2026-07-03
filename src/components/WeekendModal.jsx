/**
 * @reflection
 * [IDENTITY]: WeekendModal
 * [PURPOSE]: Module: WeekendModal
 * [STATE]: Experimental
 * [ANCHOR]: WeekendModal
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import {
    Briefcase,
    BookOpen,
    Users,
    MapPin,
    Home,
    Activity,
} from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';
import { getAvailableOperationalFunds } from '../utils/operationalFunds.js';

const ACTIVITY_DEFS = [
    {
        id: 'rest',
        icon: Home,
        cost: 0,
        effects: { stress: -40, energy: 100 },
        color: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'recreation',
        icon: MapPin,
        cost: 500000,
        effects: { stress: -30, happiness: 20 },
        color: 'bg-green-100 text-green-700'
    },
    {
        id: 'workshop',
        icon: BookOpen,
        cost: 1000000,
        effects: { stress: 10, knowledge: 15, xp: 50 },
        color: 'bg-purple-100 text-purple-700'
    },
    {
        id: 'community',
        icon: Users,
        cost: 200000,
        effects: { stress: 15, reputation: 5, xp: 30 },
        color: 'bg-orange-100 text-orange-700'
    },
    {
        id: 'part_time',
        icon: Briefcase,
        cost: 0,
        income: 1500000,
        effects: { stress: 25, xp: 20 },
        color: 'bg-emerald-100 text-emerald-700'
    }
];

const WeekendModal = () => {
    const { t, i18n } = useTranslation();
    const { playerStats, stats, performWeekendActivity, day } = useGame();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const availableFunds = Number(stats?.availableFunds ?? getAvailableOperationalFunds(stats));
    const isWeekendEngineAvailable = typeof performWeekendActivity === 'function';
    const modalRef = useModalA11y(null); // No Escape — must pick activity
    const locale = i18n.resolvedLanguage || 'id';
    const activities = useMemo(
        () => ACTIVITY_DEFS.map((activity) => ({
            ...activity,
            label: t(`weekend.activities.${activity.id}.label`),
            description: t(`weekend.activities.${activity.id}.description`)
        })),
        [t]
    );

    const getDayName = (dayCount) => {
        const dayOfWeek = dayCount % 7;
        return dayOfWeek === 6 ? t('weekend.days.saturday') : t('weekend.days.sunday');
    };

    const dayName = getDayName(day);

    const handleConfirm = () => {
        if (selectedActivity && isWeekendEngineAvailable) {
            performWeekendActivity(selectedActivity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="weekend-title" className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* Left Panel: Status & Context */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200 flex flex-col">
                    <div className="mb-6">
                        <h2 id="weekend-title" className="text-2xl font-bold text-slate-800">{t('weekend.title')}</h2>
                        <p className="text-slate-500 mb-2">{t('weekend.day_label', { day, dayName })}</p>
                        <div className="bg-blue-600 h-1 w-16 rounded-full mb-4"></div>
                        <p className="text-sm text-slate-600">
                            {t('weekend.description')}
                        </p>
                    </div>

                    {!isWeekendEngineAvailable && (
                        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            {t('weekend.unavailable')}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <Activity size={18} /> {t('weekend.status.title')}
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{t('weekend.status.stress')}</span>
                                    <span className={`font-medium ${playerStats.stress > 70 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {playerStats.stress}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${playerStats.stress > 70 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(100, playerStats.stress)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{t('weekend.status.knowledge')}</span>
                                    <span className="text-purple-700 font-medium">{playerStats.knowledge || 0} {t('weekend.status.points_short')}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-purple-500"
                                        style={{ width: `${Math.min(100, (playerStats.knowledge || 0) / 2)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{t('weekend.status.funds')}</span>
                                    <span className="text-emerald-700 font-medium">
                                        {t('weekend.currency_prefix')} {availableFunds.toLocaleString(locale)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedActivity || !isWeekendEngineAvailable}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
                 ${selectedActivity && isWeekendEngineAvailable
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-slate-300 cursor-not-allowed'}`}
                        >
                            {isWeekendEngineAvailable ? t('weekend.actions.start') : t('weekend.actions.unavailable')}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Activities Grid */}
                <div className="w-full md:w-2/3 p-6 bg-white overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('weekend.select_title')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activities.map((act) => {
                            const cantAfford = act.cost > availableFunds;

                            return (
                                <button
                                    key={act.id}
                                    onClick={() => !cantAfford && setSelectedActivity(act)}
                                    disabled={cantAfford}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all
                    ${selectedActivity?.id === act.id
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-slate-100 hover:border-blue-300 hover:shadow-md bg-white'}
                    ${cantAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                  `}
                                >
                                    <div className={`p-3 rounded-lg w-fit mb-3 ${act.color}`}>
                                        <act.icon size={24} />
                                    </div>

                                    <h4 className="font-bold text-slate-800 mb-1">{act.label}</h4>
                                    <p className="text-xs text-slate-500 mb-3 h-10 leading-snug">{act.description}</p>

                                    <div className="space-y-1 text-xs">
                                        {act.cost > 0 && (
                                            <div className="flex items-center text-red-600 font-medium">
                                                <span className="w-20">{t('weekend.cost_label')}</span>
                                                <span>{t('weekend.currency_prefix')} {act.cost.toLocaleString(locale)}</span>
                                            </div>
                                        )}
                                        {act.income > 0 && (
                                            <div className="flex items-center text-emerald-600 font-medium">
                                                <span className="w-20">{t('weekend.income_label')}</span>
                                                <span>+{t('weekend.currency_prefix')} {act.income.toLocaleString(locale)}</span>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-slate-100 mt-2 flex flex-wrap gap-2">
                                            {Object.entries(act.effects).map(([key, value]) => (
                                                <span key={key} className={`px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium capitalize
                           ${value > 0 && key !== 'stress' ? 'text-green-600 bg-green-50' : ''}
                           ${value < 0 && key === 'stress' ? 'text-green-600 bg-green-50' : ''}
                           ${value > 0 && key === 'stress' ? 'text-red-600 bg-red-50' : ''}
                         `}>
                                                    {t(`weekend.effects.${key}`)}: {value > 0 ? '+' : ''}{value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekendModal;
