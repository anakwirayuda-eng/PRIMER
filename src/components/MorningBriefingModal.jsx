import React, { useMemo, useState } from 'react';
import { Sun, Users, AlertTriangle, Package, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import useModalA11y from '../hooks/useModalA11y.js';
import StepCarousel from './shared/StepCarousel';
import StatCard from './shared/StatCard';
import { generateMorningBriefing, generateDefaultAllocation, generateDailyQuests } from '../game/MorningBriefing.js';

const POLI_NAME_KEYS = {
    poli_umum: 'morningBriefing.polis.poli_umum',
    igd: 'morningBriefing.polis.igd',
    farmasi_lab: 'morningBriefing.polis.farmasi_lab',
    poli_kia_kb: 'morningBriefing.polis.poli_kia_kb',
    poli_gigi: 'morningBriefing.polis.poli_gigi',
};

const STAFF_ROLE_KEYS = {
    perawat: 'morningBriefing.staff_roles.perawat',
    bidan: 'morningBriefing.staff_roles.bidan',
    apoteker: 'morningBriefing.staff_roles.apoteker',
    analis_lab: 'morningBriefing.staff_roles.analis_lab',
    dokter_gigi: 'morningBriefing.staff_roles.dokter_gigi',
};

function formatCompactCurrency(value, locale, t) {
    const amount = Number(value) || 0;
    const numberLocale = locale?.startsWith('id') ? 'id-ID' : 'en-US';
    const prefix = t('morningBriefing.currency.prefix');

    if (amount >= 1000000000) {
        return `${prefix} ${formatCompactValue(amount / 1000000000, numberLocale)}${t('morningBriefing.currency.billion_suffix')}`;
    }
    if (amount >= 1000000) {
        return `${prefix} ${formatCompactValue(amount / 1000000, numberLocale)}${t('morningBriefing.currency.million_suffix')}`;
    }
    if (amount >= 1000) {
        return `${prefix} ${formatCompactValue(amount / 1000, numberLocale)}${t('morningBriefing.currency.thousand_suffix')}`;
    }

    return `${prefix} ${amount.toLocaleString(numberLocale)}`;
}

function formatCompactValue(value, locale) {
    return Number(value).toLocaleString(locale, {
        minimumFractionDigits: value >= 10 || Number.isInteger(value) ? 0 : 1,
        maximumFractionDigits: 1,
    });
}

function translatePoliName(poli, t) {
    return t(POLI_NAME_KEYS[poli.id] || '', { defaultValue: poli.name });
}

function translateStaffRole(staffId, t) {
    const fallback = String(staffId || '')
        .replaceAll('_', ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

    return t(STAFF_ROLE_KEYS[staffId] || '', { defaultValue: fallback });
}

function translateReason(reasonKey, reasonVars, fallbackReason, t) {
    if (!reasonKey) return fallbackReason;

    if (reasonKey === 'morningBriefing.poli_reason.staff_required') {
        return t(reasonKey, {
            ...reasonVars,
            staff: translateStaffRole(reasonVars?.staff, t),
            defaultValue: fallbackReason,
        });
    }

    return t(reasonKey, { ...(reasonVars || {}), defaultValue: fallbackReason });
}

function translateEvent(event, t) {
    return {
        ...event,
        title: event.titleKey
            ? t(event.titleKey, { ...(event.titleVars || {}), defaultValue: event.title })
            : event.title,
        description: event.descriptionKey
            ? t(event.descriptionKey, { ...(event.descriptionVars || {}), defaultValue: event.description })
            : event.description,
    };
}

function translatePriority(priority, t) {
    if (!priority) return priority;

    return {
        ...priority,
        text: priority.textKey
            ? t(priority.textKey, { ...(priority.textVars || {}), defaultValue: priority.text })
            : priority.text,
    };
}

function translateQuest(quest, t) {
    return {
        ...quest,
        title: quest.titleKey
            ? t(quest.titleKey, { defaultValue: quest.title })
            : quest.title,
        description: quest.descriptionKey
            ? t(quest.descriptionKey, { defaultValue: quest.description })
            : quest.description,
    };
}

export default function MorningBriefingModal({ briefingData = null, gameState = null, onComplete, onDismiss }) {
    const { isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const modalRef = useModalA11y(onDismiss);

    const briefing = useMemo(
        () => briefingData || generateMorningBriefing(gameState || {}),
        [briefingData, gameState]
    );
    const dailyQuests = useMemo(() => generateDailyQuests(gameState || {}), [gameState]);
    const [allocation] = useState(() => generateDefaultAllocation(gameState?.hiredStaff || []));
    const [selectedQuest, setSelectedQuest] = useState(dailyQuests[0]?.id || null);
    const locale = i18n.resolvedLanguage || 'id';

    const translatedEvents = useMemo(
        () => briefing.todayEvents.map(event => translateEvent(event, t)),
        [briefing.todayEvents, t]
    );
    const translatedPriority = useMemo(
        () => translatePriority(briefing.suggestedPriority, t),
        [briefing.suggestedPriority, t]
    );
    const translatedPolis = useMemo(
        () => briefing.availablePolis.map(poli => ({
            ...poli,
            name: translatePoliName(poli, t),
            translatedReason: translateReason(poli.reasonKey, poli.reasonVars, poli.reason, t),
        })),
        [briefing.availablePolis, t]
    );
    const translatedQuests = useMemo(
        () => dailyQuests.map(quest => translateQuest(quest, t)),
        [dailyQuests, t]
    );
    const allocationEntries = useMemo(
        () => Object.entries(allocation).map(([poliId, staffIds]) => ({
            poliId,
            staffCount: staffIds.length,
            poliLabel: translatePoliName({ id: poliId, name: poliId }, t),
        })),
        [allocation, t]
    );

    const handleComplete = () => {
        onComplete?.({
            staffAllocation: allocation,
            dailyQuestId: selectedQuest,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="morning-briefing-title"
                className={`flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />

                    <div className="relative flex items-center gap-3">
                        <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                            <Sun size={24} />
                        </div>
                        <div>
                            <h2 id="morning-briefing-title" className="text-lg font-black tracking-tight">
                                {t('morningBriefing.header.greeting')}
                            </h2>
                            <p className="text-xs font-medium text-white/70">
                                {t('morningBriefing.header.subtitle', { day: briefing.day })}
                            </p>
                        </div>
                    </div>
                </div>

                <StepCarousel onComplete={handleComplete} completeLabel={t('morningBriefing.actions.start_day')}>
                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>{t('morningBriefing.sections.today_status')}</SectionTitle>

                        <div className="grid grid-cols-3 gap-2">
                            <StatCard
                                icon={<Users size={18} />}
                                value={briefing.staffReport.available}
                                label={t('morningBriefing.stats.staff_active')}
                                colorClass="bg-blue-50 text-blue-600"
                                suffix={`/${briefing.staffReport.total}`}
                            />
                            <StatCard
                                icon={<ShieldCheck size={18} />}
                                value={briefing.kpiSnapshot.reputation}
                                label={t('morningBriefing.stats.reputation')}
                                colorClass="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard
                                icon={<Zap size={18} />}
                                value={briefing.staffReport.avgMorale}
                                label={t('morningBriefing.stats.morale')}
                                colorClass="bg-amber-50 text-amber-600"
                                suffix="%"
                            />
                        </div>

                        <div className={`rounded-xl p-3 text-xs ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-bold uppercase tracking-wider">
                                    {t('morningBriefing.funds.active')}
                                </span>
                                <span className="font-mono font-bold">
                                    {formatCompactCurrency(briefing.kpiSnapshot.availableFunds, locale, t)}
                                </span>
                            </div>
                            {briefing.kpiSnapshot.currentCycleReceipts > 0 && (
                                <div className="mt-1 flex items-center justify-between gap-4 opacity-80">
                                    <span>{t('morningBriefing.funds.receipts')}</span>
                                    <span className="font-mono">
                                        {formatCompactCurrency(briefing.kpiSnapshot.currentCycleReceipts, locale, t)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {briefing.pendingFollowups.length > 0 && (
                            <AlertBox isDark={isDark} type="warning">
                                <AlertTriangle size={14} className="flex-shrink-0" />
                                <div>
                                    <div className="text-xs font-bold">{t('morningBriefing.followups.title')}</div>
                                    {briefing.pendingFollowups.map((followup, index) => (
                                        <div key={index} className="mt-0.5 text-[11px] opacity-80">
                                            {(followup.originalCase?.patientName || t('clinical.patient_fallback'))}: {followup.narrative}
                                        </div>
                                    ))}
                                </div>
                            </AlertBox>
                        )}

                        {briefing.stockAlerts.lowStock.length > 0 && (
                            <AlertBox isDark={isDark} type="info">
                                <Package size={14} className="flex-shrink-0" />
                                <div>
                                    <div className="text-xs font-bold">{t('morningBriefing.stock.low_title')}</div>
                                    {briefing.stockAlerts.lowStock.map((stockItem, index) => (
                                        <div key={index} className="mt-0.5 text-[11px] opacity-80">
                                            {t('morningBriefing.stock.item_line', {
                                                name: stockItem.name,
                                                quantity: stockItem.quantity,
                                                minStock: stockItem.minStock,
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </AlertBox>
                        )}

                        {translatedEvents.length > 0 && (
                            <div className="space-y-1.5">
                                {translatedEvents.map((event, index) => (
                                    <EventCard key={`${event.type}-${index}`} event={event} isDark={isDark} />
                                ))}
                            </div>
                        )}

                        {translatedPriority && (
                            <div className={`flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed ${isDark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-800'}`}>
                                <span className="text-base">{translatedPriority.icon}</span>
                                <span>{translatedPriority.text}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>{t('morningBriefing.sections.poli_status')}</SectionTitle>

                        <div className="space-y-2">
                            {translatedPolis.map(poli => (
                                <div
                                    key={poli.id}
                                    className={`flex items-center gap-3 rounded-xl p-3 transition-all ${poli.available
                                        ? isDark
                                            ? 'border border-slate-700 bg-slate-800'
                                            : 'border border-slate-200 bg-white shadow-sm'
                                        : isDark
                                            ? 'border border-slate-700/50 bg-slate-800/50 opacity-50'
                                            : 'border border-slate-200 bg-slate-50 opacity-50'
                                        }`}
                                >
                                    <span className="text-xl">{poli.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <div className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {poli.name}
                                        </div>
                                        {poli.translatedReason && (
                                            <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {poli.translatedReason}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`h-2 w-2 rounded-full ${poli.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                </div>
                            ))}
                        </div>

                        {allocationEntries.length > 0 && (
                            <div className={`rounded-xl p-3 text-[11px] leading-relaxed ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                <div className="mb-1 text-xs font-bold opacity-70">
                                    {t('morningBriefing.allocation.title')}
                                </div>
                                {allocationEntries.map(entry => (
                                    <div key={entry.poliId} className="mt-0.5 flex items-center gap-1">
                                        <span className="font-medium">{entry.poliLabel}:</span>
                                        <span>{t('morningBriefing.allocation.line', { count: entry.staffCount })}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>{t('morningBriefing.sections.daily_mission')}</SectionTitle>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('morningBriefing.quests.helper')}
                        </p>

                        <div className="space-y-2">
                            {translatedQuests.map(quest => (
                                <button
                                    key={quest.id}
                                    onClick={() => setSelectedQuest(quest.id)}
                                    className={`w-full rounded-xl border p-3.5 text-left transition-all duration-200 ${selectedQuest === quest.id
                                        ? 'scale-[1.02] border-amber-500 ring-2 ring-amber-500/20'
                                        : isDark
                                            ? 'border-slate-700 hover:border-slate-600'
                                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        } ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 text-xl">{quest.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {quest.title}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                                    +{quest.xpBonus} XP
                                                </span>
                                            </div>
                                            <p className={`mt-1 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {quest.description}
                                            </p>
                                        </div>
                                        <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${selectedQuest === quest.id
                                            ? 'border-amber-500 bg-amber-500'
                                            : isDark ? 'border-slate-600' : 'border-slate-300'
                                            }`}>
                                            {selectedQuest === quest.id && (
                                                <div className="h-2 w-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </StepCarousel>
            </div>
        </div>
    );
}

function SectionTitle({ children, isDark }) {
    return (
        <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {children}
        </h3>
    );
}

function AlertBox({ children, isDark, type = 'warning' }) {
    const colors = {
        warning: isDark ? 'border-amber-800 bg-amber-900/20 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-800',
        info: isDark ? 'border-blue-800 bg-blue-900/20 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-800',
        critical: isDark ? 'border-red-800 bg-red-900/20 text-red-300' : 'border-red-200 bg-red-50 text-red-800',
    };

    return (
        <div className={`flex items-start gap-2 rounded-xl border p-3 ${colors[type]}`}>
            {children}
        </div>
    );
}

function EventCard({ event, isDark }) {
    const priorityColors = {
        critical: 'border-l-red-500',
        high: 'border-l-amber-500',
        medium: 'border-l-blue-500',
        low: isDark ? 'border-l-slate-500' : 'border-l-slate-300',
    };

    return (
        <div className={`flex items-center gap-2 rounded-lg border-l-4 p-2.5 ${priorityColors[event.priority]} ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <span className="text-base">{event.icon}</span>
            <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {event.title}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {event.description}
                </div>
            </div>
        </div>
    );
}
