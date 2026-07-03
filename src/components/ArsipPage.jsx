/**
 * @reflection
 * [IDENTITY]: ArsipPage
 * [PURPOSE]: React UI component: ArsipPage.
 * [STATE]: Experimental
 * [ANCHOR]: ArsipPage
 * [DEPENDS_ON]: GameContext, VillageRegistry, ThemeContext, CPPTCard
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary.jsx';
import { Folder, User, FileText, Calendar, ChevronRight, Search, Activity, AlertCircle, Map, Home, Heart, Pill, AlertTriangle, Shield, ChevronDown, ChevronUp, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { INDIVIDUAL_PROFILES, FAMILY_MEDICAL_HISTORY } from '../domains/village/VillageRegistry.js';
import { useTheme } from '../context/ThemeContext.jsx';
import CPPTCard from './CPPTCard.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { formatTime } from '../utils/formatTime.js';
import { formatIkmImpactSummary } from '../utils/ikmHistory.js';
import useViewportWidth from '../hooks/useViewportWidth.js';

function getEncounterDiagnosisLabel(record) {
    if (record?.type === 'ikm_event') {
        return record?.description
            || formatIkmImpactSummary({
                balance: record?.ikmEvent?.impact?.balance,
                iks_score: record?.ikmEvent?.impact?.iks_score,
                outbreak_risk_reduction: record?.ikmEvent?.impact?.outbreak_risk_reduction,
                outbreak_risk: record?.ikmEvent?.impact?.outbreak_risk,
                spawnPatients: { amount: record?.ikmEvent?.impact?.spawnedCases || 0 }
            });
    }

    return record?.decision?.diagnoses?.join(', ')
        || record?.medicalData?.trueDiagnosisCode
        || record?.medicalData?.diagnosisName
        || '-';
}

function getEncounterActionBadge(record, t) {
    if (record?.type === 'posyandu') return { label: t('archive.badges.action.activity'), className: 'bg-rose-100 text-rose-700' };
    if (record?.type === 'senam_prolanis') return { label: t('archive.badges.action.mass'), className: 'bg-indigo-100 text-indigo-700' };
    if (record?.type === 'prolanis_call') return { label: t('archive.badges.action.call'), className: 'bg-indigo-100 text-indigo-700' };
    if (record?.type === 'prolanis_monitor') return { label: t('archive.badges.action.monitor'), className: 'bg-indigo-100 text-indigo-700' };
    if (record?.type === 'ikm_event') return { label: t('archive.badges.action.ikm'), className: 'bg-teal-100 text-teal-700' };

    const action = record?.decision?.action;
    if (action === 'refer') return { label: t('archive.badges.action.refer'), className: 'bg-purple-100 text-purple-700' };
    if (action === 'delegate_to_maia') return { label: t('archive.badges.action.delegate'), className: 'bg-indigo-100 text-indigo-700' };
    if (action === 'stabilize') return { label: t('archive.badges.action.stabilize'), className: 'bg-cyan-100 text-cyan-700' };
    if (action === 'death') return { label: t('archive.badges.action.resus'), className: 'bg-red-100 text-red-700' };
    if (action === 'treat') return { label: t('archive.badges.action.treat'), className: 'bg-green-100 text-green-700' };

    return {
        label: action ? String(action).replaceAll('_', ' ').toUpperCase() : t('archive.badges.action.treat'),
        className: 'bg-slate-100 text-slate-700'
    };
}

function getEncounterStatusBadge(record, t) {
    if (record?.type === 'posyandu' || String(record?.type || '').includes('prolanis')) {
        return { label: t('archive.badges.status.logged'), className: 'bg-slate-100 text-slate-700' };
    }
    if (record?.type === 'ikm_event') {
        if (record?.outcomeStatus === 'ikm_failure') return { label: t('archive.badges.status.failed'), className: 'bg-rose-100 text-rose-700' };
        if (record?.outcomeStatus === 'ikm_partial') return { label: t('archive.badges.status.partial'), className: 'bg-amber-100 text-amber-700' };
        return { label: t('archive.badges.status.success'), className: 'bg-emerald-100 text-emerald-700' };
    }

    const outcomeStatus = record?.outcomeStatus;
    if (outcomeStatus === 'sisrute_transferred') return { label: t('archive.badges.status.transfer_sisrute'), className: 'bg-cyan-100 text-cyan-700' };
    if (outcomeStatus === 'referred_sisrute') return { label: t('archive.badges.status.refer_sisrute'), className: 'bg-blue-100 text-blue-700' };
    if (outcomeStatus === 'referred') return { label: t('archive.badges.status.referred'), className: 'bg-blue-100 text-blue-700' };
    if (outcomeStatus === 'stabilized') return { label: t('archive.badges.status.stabilized'), className: 'bg-teal-100 text-teal-700' };
    if (outcomeStatus === 'delegated') return { label: t('archive.badges.status.delegated'), className: 'bg-indigo-100 text-indigo-700' };
    if (outcomeStatus === 'pulih') return { label: t('archive.badges.status.recovered'), className: 'bg-emerald-100 text-emerald-700' };
    if (outcomeStatus === 'memburuk') return { label: t('archive.badges.status.worsened'), className: 'bg-amber-100 text-amber-700' };
    if (outcomeStatus === 'meninggal') return { label: t('archive.badges.status.deceased'), className: 'bg-red-100 text-red-700' };
    if (outcomeStatus === 'komplain') return { label: t('archive.badges.status.complaint'), className: 'bg-orange-100 text-orange-700' };
    if (outcomeStatus === 'correct') return { label: t('archive.badges.status.correct'), className: 'bg-emerald-100 text-emerald-700' };
    if (outcomeStatus === 'incorrect') return { label: t('archive.badges.status.incorrect'), className: 'bg-rose-100 text-rose-700' };
    if (record?.decision?.action === 'refer') return { label: t('archive.badges.status.referred'), className: 'bg-blue-100 text-blue-700' };
    if (record?.outcome === 'bad') return { label: t('archive.badges.status.review_needed'), className: 'bg-amber-100 text-amber-700' };

    return { label: t('archive.badges.status.done'), className: 'bg-emerald-100 text-emerald-700' };
}

export default function ArsipPage() {
    const { t } = useTranslation();
    const { history, villageData, day, viewParams, navigate } = useGame();
    const [activeTab, setActiveTab] = useState('folders'); // 'folders' | 'daily'
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [folderSearchQuery, setFolderSearchQuery] = useState('');
    const [dailySearchQuery, setDailySearchQuery] = useState('');
    const viewportWidth = useViewportWidth();
    const showDailyTable = viewportWidth >= 1440;
    const activeSearchQuery = activeTab === 'folders' ? folderSearchQuery : dailySearchQuery;

    const setActiveSearchQuery = (value) => {
        if (activeTab === 'folders') {
            setFolderSearchQuery(value);
            return;
        }

        setDailySearchQuery(value);
    };

    const clearActiveSearch = () => {
        setActiveSearchQuery('');
    };

    // Handle Deep Linking / Navigation
    // Effect removed: Redundant with line 65 logic

    // --- FAMILY FOLDER LOGIC ---
    // Group history by family (must be defined before useEffects that use it)
    const familyRecords = useMemo(() => {
        if (!villageData || !Array.isArray(villageData.families)) return [];

        return villageData.families.map(family => {
            // Find all visits for this family
            const visits = (history || []).filter(visit =>
                visit.hidden && visit.hidden.familyId === family.id
            );

            // Calculate health summary
            const recentVisit = visits[visits.length - 1];

            return {
                ...family,
                members: family.members || [],
                visits: visits.sort((a, b) => b.dischargedAt - a.dischargedAt), // Newest first
                lastVisit: recentVisit ? recentVisit.day : null,
                totalVisits: visits.length,
                // Ensure IKS Score exists (use pre-calculated if available)
                iksScore: family.iksScore !== undefined ? family.iksScore :
                    (Object.values(family.indicators || {}).filter(v => v === true).length / Object.keys(family.indicators || {}).length) || 0
            };
        });
    }, [villageData, history]);

    // Use a separate effect that depends on familyRecords availability
    useEffect(() => {
        if (!guardStability('NAV_ARSIP_INIT', 2000, 3)) return;
        if (viewParams && viewParams.familyId) {
            // Set active tab and selected family in next tick to avoid synchronous setState warning
            setTimeout(() => {
                setActiveTab(prev => prev !== 'folders' ? 'folders' : prev);

                // Try to find family if records are ready
                if (familyRecords.length > 0) {
                    const target = familyRecords.find(f => f.id === viewParams.familyId);
                    if (target) {
                        setSelectedFamily(target);
                    }
                }
            }, 0);
        }
    }, [viewParams, familyRecords]);

    // Filter families by search
    const filteredFamilies = familyRecords.filter(f =>
        (f.headName && f.headName.toLowerCase().includes(folderSearchQuery.toLowerCase())) ||
        (f.id && f.id.toLowerCase().includes(folderSearchQuery.toLowerCase()))
    );

    // --- DAILY LOG LOGIC ---
    const dailyRecords = useMemo(() => {
        if (!history) return [];
        return [...history].sort((a, b) => b.dischargedAt - a.dischargedAt);
    }, [history]);
    const filteredDailyRecords = useMemo(() => {
        const query = dailySearchQuery.toLowerCase();
        return dailyRecords.filter(record =>
            record.name?.toLowerCase().includes(query) || record.label?.toLowerCase().includes(query)
        );
    }, [dailyRecords, dailySearchQuery]);

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-main)]">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm z-10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Folder className="text-teal-600" />
                            {t('archive.header_title')}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('archive.header_subtitle')}</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full lg:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder={activeTab === 'folders' ? t('archive.search_folders_placeholder') : t('archive.search_patients_placeholder')}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 lg:w-72"
                            value={activeSearchQuery}
                            onChange={(e) => setActiveSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 pt-2">
                <button
                    onClick={() => { setActiveTab('folders'); setSelectedFamily(null); }}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'folders' ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Folder size={16} />
                    {t('archive.tabs.folders')}
                </button>
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'daily' ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Calendar size={16} />
                    {t('archive.tabs.daily')}
                </button>
            </div>

            {activeSearchQuery && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-100 bg-teal-50/80 px-4 py-2 text-xs dark:border-teal-900/40 dark:bg-teal-950/30">
                    <p className="font-semibold text-teal-800 dark:text-teal-200">
                        {activeTab === 'folders'
                            ? t('archive.filter_state.folders', { query: activeSearchQuery })
                            : t('archive.filter_state.daily', { query: activeSearchQuery })}
                    </p>
                    <button
                        type="button"
                        onClick={clearActiveSearch}
                        className="rounded-md border border-teal-200 px-2.5 py-1 font-bold text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-800 dark:text-teal-200 dark:hover:bg-teal-900/40"
                    >
                        {t('archive.filter_state.clear')}
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'folders' ? (
                    selectedFamily ? (
                        /* --- FAMILY DETAIL VIEW --- */
                        <ErrorBoundary name="FamilyDetailView">
                            <FamilyDetailView
                                family={selectedFamily}
                                onBack={() => setSelectedFamily(null)}
                            />
                        </ErrorBoundary>
                    ) : (
                        /* --- FAMILY FOLDER GRID --- */
                        <div className="h-full overflow-y-auto p-4">
                            {filteredFamilies.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                    <Folder size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">
                                        {folderSearchQuery ? t('archive.empty.search_title') : t('archive.empty.no_family_title')}
                                    </h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md">
                                        {folderSearchQuery
                                            ? t('archive.empty.search_description', { query: folderSearchQuery })
                                            : t('archive.empty.no_family_description')
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <ErrorBoundary name="FamilyFolderList">
                                        {filteredFamilies.map((fam, idx) => (
                                            <div
                                                key={fam.id || idx}
                                                onClick={() => setSelectedFamily(fam)}
                                                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg text-teal-600 dark:text-teal-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                                            <Folder size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                                                {t('archive.family_card.family_prefix')} {fam.headName || t('archive.unnamed')}
                                                            </h3>
                                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{fam.id ? fam.id.toUpperCase() : 'NO-ID'}</p>
                                                        </div>
                                                    </div>
                                                    {fam.lastVisit === day && (
                                                        <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                                            {t('archive.family_card.new_badge')}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{t('archive.family_card.members_label')}</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{t('archive.family_card.members_value', { count: fam.members.length })}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{t('archive.family_card.total_visits_label')}</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{fam.totalVisits || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{t('archive.family_card.pis_pk_status_label')}</span>
                                                        <span className={`font-semibold ${fam.iksScore > 0.8 ? 'text-green-600 dark:text-green-400' : fam.iksScore > 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            IKS: {fam.iksScore?.toFixed(2) || '0.00'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                                                    {fam.houseId && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate('wilayah', { focusHouseId: fam.houseId });
                                                            }}
                                                            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors px-2 py-1 -ml-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                                                            title={t('archive.view_house_map_title')}
                                                        >
                                                            <Home size={14} /> {t('archive.house_short')}
                                                        </button>
                                                    )}
                                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                                                        {t('archive.open_folder')} <ChevronRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </ErrorBoundary>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    /* --- DAILY LOG VIEW --- */
                    <div className="h-full overflow-y-auto p-0">
                        <ErrorBoundary name="DailyLogTable">
                            {filteredDailyRecords.length === 0 ? (
                                <div className="flex h-full items-center justify-center px-6 py-16 text-center">
                                    <div className="max-w-md">
                                        <Calendar size={48} className="mx-auto mb-4 text-slate-400 dark:text-slate-600" />
                                        <h3 className="mb-2 text-lg font-bold text-slate-500 dark:text-slate-400">
                                            {dailySearchQuery ? t('archive.empty.search_title') : t('archive.empty.no_daily_title')}
                                        </h3>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">
                                            {dailySearchQuery
                                                ? t('archive.empty.daily_search_description', { query: dailySearchQuery })
                                                : t('archive.empty.no_daily_description')}
                                        </p>
                                        {dailySearchQuery && (
                                            <button
                                                type="button"
                                                onClick={clearActiveSearch}
                                                className="mt-4 rounded-lg border border-teal-200 px-3 py-2 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 dark:border-teal-800 dark:text-teal-200 dark:hover:bg-teal-900/30"
                                            >
                                                {t('archive.filter_state.clear')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : showDailyTable ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-[920px] w-full text-sm text-left">
                                        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                            <tr>
                                                <th className="px-6 py-3">{t('archive.table.time')}</th>
                                                <th className="px-6 py-3">{t('archive.table.patient_name')}</th>
                                                <th className="px-6 py-3">{t('archive.table.diagnosis')}</th>
                                                <th className="px-6 py-3">{t('archive.table.action')}</th>
                                                <th className="px-6 py-3">{t('archive.table.status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDailyRecords.map((record, idx) => {
                                                const actionBadge = getEncounterActionBadge(record, t);
                                                const statusBadge = getEncounterStatusBadge(record, t);

                                                return (
                                                    <tr key={idx} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                        <td className="px-6 py-4 font-mono text-slate-500">
                                                            {t('archive.day_time', { day: record.day, time: record.dischargedAt ? formatTime(record.dischargedAt) : '08:00' })}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                            {record.name || record.label}
                                                            {record.type === 'posyandu' && (
                                                                <span className="ml-2 text-xs bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                                                                    {t('archive.badges.misc.posyandu')}
                                                                </span>
                                                            )}
                                                            {record.type === 'ikm_event' ? (
                                                                <span className="ml-2 text-xs bg-teal-100 dark:bg-teal-950/40 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
                                                                    IKM
                                                                </span>
                                                            ) : null}
                                                            {record.type?.startsWith('prolanis') || record.type === 'senam_prolanis' ? (
                                                                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                                                                    Prolanis
                                                                </span>
                                                            ) : null}
                                                            {record.hidden?.familyId && (
                                                                <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                                                    {t('archive.badges.misc.resident')}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="max-w-[20rem] px-6 py-4 truncate text-slate-600 dark:text-slate-300" title={record.description}>
                                                            {record.type === 'posyandu' || record.type?.includes('prolanis') || record.type === 'ikm_event'
                                                                ? (record.description || getEncounterDiagnosisLabel(record))
                                                                : getEncounterDiagnosisLabel(record)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${actionBadge.className}`}>
                                                                {actionBadge.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${statusBadge.className}`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="space-y-3 p-4">
                                    {filteredDailyRecords.map((record, idx) => {
                                        const actionBadge = getEncounterActionBadge(record, t);
                                        const statusBadge = getEncounterStatusBadge(record, t);
                                        const diagnosisLabel = record.type === 'posyandu' || record.type?.includes('prolanis') || record.type === 'ikm_event'
                                            ? (record.description || getEncounterDiagnosisLabel(record))
                                            : getEncounterDiagnosisLabel(record);

                                        return (
                                            <article key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0 space-y-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                                {record.name || record.label}
                                                            </h3>
                                                            {record.type === 'posyandu' && (
                                                                <span className="text-xs bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                                                                    {t('archive.badges.misc.posyandu')}
                                                                </span>
                                                            )}
                                                            {record.type === 'ikm_event' ? (
                                                                <span className="text-xs bg-teal-100 dark:bg-teal-950/40 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
                                                                    IKM
                                                                </span>
                                                            ) : null}
                                                            {record.type?.startsWith('prolanis') || record.type === 'senam_prolanis' ? (
                                                                <span className="text-xs bg-indigo-100 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                                                                    Prolanis
                                                                </span>
                                                            ) : null}
                                                            {record.hidden?.familyId && (
                                                                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                                                    {t('archive.badges.misc.resident')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-mono text-slate-500">
                                                            {t('archive.day_time', { day: record.day, time: record.dischargedAt ? formatTime(record.dischargedAt) : '08:00' })}
                                                        </p>
                                                        <p className="text-sm text-slate-600 break-words dark:text-slate-300">
                                                            {diagnosisLabel}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 sm:justify-end">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${actionBadge.className}`}>
                                                            {actionBadge.label}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusBadge.className}`}>
                                                            {statusBadge.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </ErrorBoundary>
                    </div>
                )}
            </div>
        </div>
    );
}

// === MEMBER PROFILE CARD COMPONENT ===
// Expandable card showing individual health profile details
function MemberProfileCard({ member, profile, history }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    // Count visits for this member
    const memberVisits = useMemo(() =>
        (history || []).filter(h =>
            h.hidden?.villagerId === member.id || h.social?.villagerId === member.id
        ).length,
        [history, member.id]);

    const hasProfile = !!profile;
    const hasConditions = profile?.conditions?.length > 0;
    const hasAllergies = profile?.allergies?.length > 0;
    const hasMedications = profile?.medications?.length > 0;
    const genderLabel = member.gender === 'L' ? t('archive.member.gender_male') : t('archive.member.gender_female');

    // Role badge colors
    const roleBadge = {
        head: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-400', label: t('archive.member.roles.head_short') },
        spouse: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-400', label: t('archive.member.roles.spouse_short') },
        elder: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-400', label: t('archive.member.roles.elder_short') },
        child: { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-400', label: t('archive.member.roles.child_short') },
        grandchild: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-400', label: t('archive.member.roles.grandchild_short') },
    }[member.role] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: t('archive.member.roles.other_short') };

    return (
        <div className={`rounded-lg border transition-all ${hasConditions ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
            {/* Header - Always Visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
                <div className={`w-10 h-10 rounded-full ${roleBadge.bg} ${roleBadge.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {roleBadge.label}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.fullName || member.name || member.firstName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('archive.member.identity_line', { age: member.age, gender: genderLabel, occupation: member.occupation })}</p>
                    {/* Quick condition badges */}
                    {hasConditions && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {profile.conditions.slice(0, 2).map((c, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-medium border border-amber-300 dark:border-amber-700">
                                    {c.replace(/_/g, ' ').replace('stage1', '').replace('stage2', '').replace('type2', '')}
                                </span>
                            ))}
                            {profile.conditions.length > 2 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                                    +{profile.conditions.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    {memberVisits > 0 && (
                        <span className="text-[9px] bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-800">
                            {t('archive.member.visit_count', { count: memberVisits })}
                        </span>
                    )}
                    {expanded ? <ChevronUp size={16} className="text-slate-400 dark:text-slate-500" /> : <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />}
                </div>
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-3 pb-3 space-y-3 animate-fadeIn">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3"></div>

                    {/* Conditions */}
                    {hasConditions && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <Heart size={12} /> {t('archive.member.health_conditions')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.conditions.map((c, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-medium border border-red-200 dark:border-red-800">
                                        {c.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Allergies */}
                    {hasAllergies && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <AlertTriangle size={12} /> {t('archive.member.allergies')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.allergies.map((a, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-800">
                                        ⚠️ {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {hasMedications && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Pill size={12} /> {t('archive.member.routine_meds')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.medications.map((m, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                        💊 {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vaccinations */}
                    {profile?.vaccinations && Object.keys(profile.vaccinations).length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Shield size={12} /> {t('archive.member.vaccination')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {Object.entries(profile.vaccinations).map(([vax, status]) => (
                                    <span key={vax} className={`text-xs px-2 py-1 rounded font-medium border ${status === true ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                                        status === false ? 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' :
                                            'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                        }`}>
                                        {vax}: {status === true ? '✓' : status === false ? '✗' : status}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lifestyle */}
                    {profile?.lifestyle && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Activity size={12} /> {t('archive.member.lifestyle')}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {profile.lifestyle.smoking && (
                                    <div className={`p-2 rounded border ${profile.lifestyle.smoking === 'current' || profile.lifestyle.smoking === 'current_heavy'
                                        ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}>
                                        <span className="font-medium">{t('archive.member.smoking_label')}</span> {profile.lifestyle.smoking.replace('_', ' ')}
                                    </div>
                                )}
                                {profile.lifestyle.exercise && (
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">{t('archive.member.exercise_label')}</span> {profile.lifestyle.exercise}
                                    </div>
                                )}
                                {profile.lifestyle.diet && (
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">{t('archive.member.diet_label')}</span> {profile.lifestyle.diet.replace('_', ' ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Clinical Notes */}
                    {profile?.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900/50 rounded text-xs text-yellow-800 dark:text-yellow-400 italic">
                            📋 {profile.notes}
                        </div>
                    )}

                    {/* No Profile Message */}
                    {!hasProfile && (
                        <div className="text-center py-4 text-slate-400 text-xs italic">
                            {t('archive.member.no_profile')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FamilyDetailView({ family, onBack }) {
    const { history, navigate, openWiki } = useGame();
    const { isDark } = useTheme();
    const { t } = useTranslation();

    // Filter visits only for this family
    const familyVisits = useMemo(() =>
        (history || []).filter(h => h.hidden?.familyId === family.id).sort((a, b) => b.dischargedAt - a.dischargedAt),
        [history, family.id]);

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-main)]">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-lg transition-all font-medium text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    {t('archive.back')}
                </button>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('archive.family_detail.title', { name: family.headName || t('archive.unnamed') })}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {t('archive.family_detail.meta', { id: family.id, count: (family.members || []).length })} • IKS: <span className={`font-bold ${family.iksScore > 0.8 ? 'text-green-600 dark:text-green-400' : family.iksScore > 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{family.iksScore?.toFixed(2) || '0.00'}</span>
                    </p>
                </div>
                {family.houseId && (
                    <button
                        onClick={() => navigate('wilayah', { focusHouseId: family.houseId })}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors"
                    >
                        <Map size={14} /> {t('archive.view_house')}
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* Family Biography / Story (Harvest Moon Style) */}
                {family.biography && (
                    <div className="mb-6 bg-teal-50 dark:bg-teal-900/10 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm border border-teal-100 dark:border-teal-900/50">
                        <h3 className="text-teal-800 dark:text-teal-400 font-bold flex items-center gap-2 mb-1">
                            <BookOpen size={18} /> {t('archive.family_story')}
                        </h3>
                        <p className="text-teal-900 dark:text-teal-300 text-sm italic leading-relaxed">
                            "{family.biography}"
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Family Members Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <User size={18} /> {t('archive.member_list')}
                            </h3>
                            <div className="space-y-3">
                                {(family.members || []).map((member, i) => {
                                    const profile = INDIVIDUAL_PROFILES[member.id];

                                    return (
                                        <ErrorBoundary key={member.id || i} name="MemberProfileCard">
                                            <MemberProfileCard
                                                member={member}
                                                profile={profile}
                                                familyId={family.id}
                                                history={history}
                                            />
                                        </ErrorBoundary>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Determinants Summary */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <Activity size={18} /> {t('archive.risk_factors')}
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(family.indicators || {}).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="capitalize text-slate-600 dark:text-slate-400">{key}</span>
                                        {val ? (
                                            <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">{t('archive.indicator_healthy')}</span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400 font-bold text-xs bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded flex items-center gap-1 border border-red-200 dark:border-red-800">
                                                <AlertCircle size={10} /> {t('archive.indicator_risk')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Medical History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 min-h-[500px]">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <FileText size={18} /> {t('archive.visit_history')}
                            </h3>

                            {(familyVisits || []).length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Folder size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>{t('archive.no_cppt_history')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* CPPT Records */}
                                    {familyVisits.filter(v => v.cpptRecord).map((visit, idx) => (
                                        <CPPTCard
                                            key={visit.cpptRecord?.id || idx}
                                            record={visit.cpptRecord}
                                            isDark={isDark}
                                            openWiki={openWiki}
                                            showPatientName={true}
                                            defaultExpanded={false}
                                        />
                                    ))}
                                    {/* Legacy visits without CPPT */}
                                    {familyVisits.filter(v => !v.cpptRecord).map((visit, idx) => (
                                        <div key={`legacy-${idx}`} className="relative">
                                            <div className={`rounded-lg p-4 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full mb-2 inline-block border border-teal-100 dark:border-teal-800">
                                                            {t('archive.visit_day_only', { day: visit.day })}
                                                        </span>
                                                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{visit.name}</h4>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${visit.decision?.action === 'refer' ? 'bg-rose-100 text-rose-700' : visit.decision?.action === 'delegate_to_maia' ? 'bg-indigo-100 text-indigo-700' : visit.decision?.action === 'stabilize' ? 'bg-teal-100 text-teal-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {visit.decision?.action === 'refer'
                                                            ? t('archive.badges.action.refer')
                                                            : visit.decision?.action === 'delegate_to_maia'
                                                                ? t('archive.badges.action.delegate')
                                                                : visit.decision?.action === 'stabilize'
                                                                    ? t('archive.badges.action.stabilize')
                                                                    : t('archive.badges.action.treat')}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">{getEncounterDiagnosisLabel(visit)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

