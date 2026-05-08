/**
 * @reflection
 * [IDENTITY]: ClinicalPage
 * [PURPOSE]: React UI component: ClinicalPage.
 * [STATE]: Experimental
 * [ANCHOR]: ClinicalPage
 * [DEPENDS_ON]: ErrorBoundary, GameContext, ThemeContext, QueueList, PatientEMR, KPIDashboard, EmergencyPanel, ProlanisPanel, ProlanisConsultation, ServiceCardDeck, ClinicalServices, EmergencyCases, AvatarUtils
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import QueueList from './QueueList.jsx';
import PatientEMR from './PatientEMR.jsx';
import KPIDashboard from './KPIDashboard.jsx';
import EmergencyPanel, { EmergencyEMR } from './EmergencyPanel.jsx';
import ProlanisPanel from './ProlanisPanel.jsx';
import FarmasiPanel from './FarmasiPanel.jsx';
import ServiceCardDeck from './ServiceCardDeck.jsx';
import { CLINICAL_SERVICES, isServiceUnlocked } from '../data/ClinicalServices.js';
import { Stethoscope, BarChart3, Construction, X, ChevronLeft, ChevronRight, Siren, Users, Lock, Coffee } from 'lucide-react';
import { TRIAGE_LEVELS } from '../game/EmergencyCases.js';
import { getAvatarStyle, normalizeGender } from '../utils/AvatarUtils.js';
import { showToast } from '../utils/ToastManager.js';
import { filterQueueByService, isClinicalServiceOpen, isPatientAssignedToService } from '../utils/clinicalRouting.js';

function getLocalizedGenderLabel(gender, t) {
    return normalizeGender(gender) === 'P'
        ? t('playerSetup.genders.female')
        : t('playerSetup.genders.male');
}

export default function ClinicalPage() {
    const {
        emergencyQueue, activeEmergencyId, admitEmergencyPatient, dischargeEmergencyPatient,
        activePatientId, playerStats, time, day,
        morningStatus, takeLoungeRest, loungeRestCount, queue, hiredStaff, admitPatient, history, prolanisRoster,
        pharmacyInventory, consumeMedication, markPrescriptionDispensed
    } = useGame();
    const { isDark } = useTheme();
    const { t } = useTranslation();

    // Local state for this page
    const [activeServiceId, setActiveServiceId] = useState('poli_umum');
    const [showKPI, setShowKPI] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window === 'undefined') return 1440;
        return window.innerWidth;
    });

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 960;
    });
    const [poliUmumSubTab, setPoliUmumSubTab] = useState('antrian'); // 'antrian' | 'prolanis'
    const [mobileQueueOpen, setMobileQueueOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const handleResize = () => {
            const width = window.innerWidth;
            setViewportWidth(width);
            if (width < 960) {
                setIsSidebarCollapsed(true);
                return;
            }
            if (width < 1200) {
                setIsSidebarCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get player level from game state
    const playerLevel = playerStats?.level || 1;

    // Get active service details
    const activeService = CLINICAL_SERVICES.find(s => s.id === activeServiceId);
    const isTabletViewport = viewportWidth >= 960 && viewportWidth < 1200;
    const restQuotaRemaining = Math.max(0, 3 - loungeRestCount);
    const isEmergencyService = activeService?.queueType === 'emergency';
    const isQueueService = activeService?.queueType === 'queue';
    const activeRegularPatient = queue.find((patient) => patient.id === activePatientId) || null;
    const hasActiveRegularPatientInService = Boolean(activeRegularPatient && isPatientAssignedToService(activeRegularPatient, activeServiceId));
    const activeServiceQueue = isEmergencyService
        ? (emergencyQueue || [])
        : isQueueService
            ? filterQueueByService(queue, activeServiceId)
            : [];
    const prolanisCount = Array.isArray(prolanisRoster) ? prolanisRoster.length : 0;
    const isQueueInteractionLocked = isQueueService && !isClinicalServiceOpen(activeService, time);
    const queueUnavailableMessage = time < 480
        ? t('clinical.service_not_open_description')
        : t('dashboard.closed_description');
    const mobileQueueCount = activeServiceQueue.length;
    const nextQueuePatient = activeServiceQueue[0] || null;
    const hasPendingEmergencyOutsideIGD = (emergencyQueue?.length || 0) > 0 && activeServiceId !== 'igd';
    const nextPatientWaitMinutes = nextQueuePatient && !isEmergencyService
        ? Math.max(0, Math.round(time - (nextQueuePatient.joinedAt || 480)))
        : 0;
    const maxServiceWaitMinutes = !isEmergencyService && activeServiceQueue.length > 0
        ? Math.max(...activeServiceQueue.map((patient) => Math.max(0, Math.round(time - (patient.joinedAt || 480)))))
        : 0;
    const getResidentLabel = (patient) => patient?.social?.isResident ? t('clinical.resident') : t('clinical.visitor');
    const getCoverageLabel = (patient) => patient?.social?.hasBPJS ? 'BPJS' : t('queue.general');
    const getQueuePatientIdentity = (patient) => [
        t('queue.age_compact', { age: patient?.age ?? '--' }),
        getLocalizedGenderLabel(patient?.gender, t),
        getResidentLabel(patient)
    ].filter(Boolean).join(' | ');
    const mobileQueueStatus = isQueueInteractionLocked
        ? (mobileQueueCount > 0
            ? t('clinical.mobile_queue_closed_waiting', { count: mobileQueueCount })
            : t('clinical.mobile_queue_closed_idle'))
        : (mobileQueueCount > 0
            ? t('clinical.mobile_queue_waiting', { count: mobileQueueCount })
            : t('clinical.mobile_queue_idle'));
    const openMobileQueue = () => {
        if (!isQueueService && !isEmergencyService) return;
        setMobileQueueOpen(true);
    };
    const handleQueuePatientClick = (patient) => {
        if (isEmergencyService) {
            admitEmergencyPatient(patient.id);
            return true;
        }
        if (isQueueInteractionLocked) {
            showToast(queueUnavailableMessage, 'warning', 2600);
            return false;
        }
        admitPatient(patient.id);
        return true;
    };
    const handleMobileQueuePatientSelect = (patient) => {
        if (handleQueuePatientClick(patient)) {
            setMobileQueueOpen(false);
        }
    };

    // Render the appropriate queue/panel based on active service
    const renderServiceContent = () => {
        // Beta-locked services: show Coming Soon panel
        if (activeService?.betaLocked) {
            return (
                <div className={`flex flex-col h-full p-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${activeService.color} text-white text-2xl shadow-lg`}>
                            {activeService.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{t(`clinical.services.${activeService.id}.name`, { defaultValue: activeService.name })}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                {t('clinical.coming_soon')}
                            </span>
                        </div>
                    </div>
                    <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t(`clinical.services.${activeService.id}.description`, { defaultValue: activeService.description })}
                    </p>
                    {activeService.comingSoonFeatures && (
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('clinical.preview_gameplay')}
                            </p>
                            {activeService.comingSoonFeatures.map((feature, i) => (
                                <div key={i} className={`p-3 rounded-lg text-xs leading-relaxed transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-100'}`}>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={`mt-4 p-3 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                        {t('clinical.unlock_at_level', { level: activeService.unlockLevel })}
                        {activeService.requiredStaff && t('clinical.unlock_plus_hire_staff')}
                    </div>
                </div>
            );
        }

        switch (activeService?.queueType) {
            case 'queue':
                // Poli Umum has sub-tabs: Antrian / Prolanis
                if (activeServiceId === 'poli_umum') {
                    return (
                        <div className="flex flex-col h-full">
                            {/* Sub-tab selector */}
                            <div className={`border-b px-3 py-3 ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-white/70'}`}>
                                <div className={`rounded-2xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div className="grid grid-cols-2 gap-1">
                                        <button
                                            onClick={() => setPoliUmumSubTab('antrian')}
                                            className={`rounded-xl px-3 py-2.5 text-left transition-all ${poliUmumSubTab === 'antrian'
                                                ? (isDark ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'bg-white text-indigo-700 shadow-sm')
                                                : (isDark ? 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200' : 'text-slate-500 hover:bg-white/80 hover:text-slate-700')
                                                }`}
                                        >
                                            <span className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                                                    {t('clinical.queue_tab')}
                                                </span>
                                                <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black ${poliUmumSubTab === 'antrian'
                                                    ? (isDark ? 'bg-indigo-400/20 text-indigo-200' : 'bg-indigo-100 text-indigo-700')
                                                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600')
                                                    }`}>
                                                    {activeServiceQueue.length}
                                                </span>
                                            </span>
                                            <span className={`mt-1 block text-[10px] leading-snug ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {t('clinical.queue_tab_description')}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setPoliUmumSubTab('prolanis')}
                                            className={`rounded-xl px-3 py-2.5 text-left transition-all ${poliUmumSubTab === 'prolanis'
                                                ? (isDark ? 'bg-pink-500/20 text-pink-300 shadow-sm' : 'bg-white text-pink-700 shadow-sm')
                                                : (isDark ? 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200' : 'text-slate-500 hover:bg-white/80 hover:text-slate-700')
                                                }`}
                                        >
                                            <span className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                                                    {t('clinical.prolanis_tab')}
                                                </span>
                                                <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black ${poliUmumSubTab === 'prolanis'
                                                    ? (isDark ? 'bg-pink-400/20 text-pink-200' : 'bg-pink-100 text-pink-700')
                                                    : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600')
                                                    }`}>
                                                    {prolanisCount}
                                                </span>
                                            </span>
                                            <span className={`mt-1 block text-[10px] leading-snug ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {t('clinical.prolanis_tab_description')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Sub-tab content */}
                            <div className="flex-1 overflow-y-auto">
                                {poliUmumSubTab === 'prolanis'
                                    ? (!isClinicalServiceOpen(activeService, time)) ? (
                                        <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <Construction size={32} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">{t('clinical.prolanis_closed_title')}</p>
                                            <p className="text-[10px] mt-1 opacity-60">{t('clinical.prolanis_closed_hours')}</p>
                                        </div>
                                    ) : <ErrorBoundary name="ProlanisPanel"><ProlanisPanel compact onPatientCalled={() => setPoliUmumSubTab('antrian')} /></ErrorBoundary>
                                    : (!isClinicalServiceOpen(activeService, time)) ? (
                                        <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <Construction size={32} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">{t('clinical.queue_closed_title')}</p>
                                            <p className="text-[10px] mt-1 opacity-60">{t('clinical.queue_closed_hours')}</p>
                                        </div>
                                    ) : <ErrorBoundary name="QueueList"><QueueList activeService={activeService} patients={activeServiceQueue} /></ErrorBoundary>
                                }
                            </div>
                        </div>
                    );
                }
                // Other queue-type polis (fallback)
                return (!isClinicalServiceOpen(activeService, time)) ? (
                    <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Construction size={32} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">{t('clinical.queue_closed_title')}</p>
                        <p className="text-[10px] mt-1 opacity-60">{t('clinical.queue_closed_hours')}</p>
                    </div>
                ) : <ErrorBoundary name="QueueList"><QueueList activeService={activeService} patients={activeServiceQueue} /></ErrorBoundary>;
            case 'emergency':
                return (
                    <ErrorBoundary name="EmergencyPanel" fallbackAction={() => setActiveServiceId('poli_umum')} fallbackActionLabel={t('clinical.back_clinic')}>
                    <EmergencyPanel
                        emergencyQueue={emergencyQueue}
                        onAdmitEmergency={admitEmergencyPatient}
                        activeEmergencyId={activeEmergencyId}
                        time={time}
                    />
                    </ErrorBoundary>
                );
            case 'farmasi_lab':
                return <ErrorBoundary name="FarmasiPanel"><FarmasiPanel isDark={isDark} history={history} currentDay={day} pharmacyInventory={pharmacyInventory} consumeMedication={consumeMedication} markPrescriptionDispensed={markPrescriptionDispensed} /></ErrorBoundary>;
            default: {
                // Check if service is level-gated or staff-gated
                const needsLevel = activeService?.unlockLevel > playerLevel;
                const staffTypes = (hiredStaff || []).map(s => s.type || s.role);
                const needsStaff = activeService?.requiredStaff && !staffTypes.includes(activeService.requiredStaff);
                const isLocked = needsLevel || needsStaff;

                return (
                    <div className={`flex flex-col h-full p-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${activeService?.color} text-white text-2xl shadow-lg`}>
                                {activeService?.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{activeService?.name}</h3>
                                {isLocked ? (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                                        {t('clinical.locked')}
                                    </span>
                                ) : (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {t('clinical.in_development')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Unlock requirements */}
                        {isLocked && (
                            <div className={`p-3 rounded-lg mb-4 flex flex-col gap-2 ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{t('clinical.unlock_requirements')}</p>
                                {needsLevel && (
                                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Lock size={12} className="text-amber-500" />
                                        <span>{t('clinical.level_requirement', { level: activeService.unlockLevel, currentLevel: playerLevel })}</span>
                                    </div>
                                )}
                                {needsStaff && (
                                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Users size={12} className="text-amber-500" />
                                        <span>{t('clinical.staff_requirement', { staff: activeService.requiredStaff })}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {activeService?.description}
                        </p>
                        {activeService?.comingSoonFeatures && (
                            <div className="space-y-2 flex-1 overflow-y-auto">
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {t('clinical.preview_gameplay')}
                                </p>
                                {activeService.comingSoonFeatures.map((feature, i) => (
                                    <div key={i} className={`p-3 rounded-lg text-xs leading-relaxed transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-100'}`}>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={`mt-4 p-3 rounded-lg text-center text-[10px] italic ${isDark ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            {isLocked ? t('clinical.unlock_hint') : t('clinical.development_hint')}
                        </div>
                    </div>
                );
            }
        }
    };

    // Render EMR or work area based on state
    const renderWorkArea = () => {
        const groggyStyle = morningStatus === 'groggy' ? { filter: 'blur(0.8px)', transition: 'filter 2s ease-in-out' } : {};

        return (
            <div className="flex-1 h-full overflow-y-auto relative" style={groggyStyle}>
                {internalWorkArea()}
            </div>
        );
    };

    const internalWorkArea = () => {
        if (showKPI) {
            return (
                <div className="p-4">
                    <ErrorBoundary name="KPIDashboard" fallbackAction={() => setShowKPI(false)} fallbackActionLabel={t('clinical.close_kpi')}>
                    <KPIDashboard />
                    <button
                        onClick={() => setShowKPI(false)}
                        className="absolute top-6 right-8 z-50 p-2.5 bg-white/10 hover:bg-rose-500 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all group shadow-xl"
                        title={t('clinical.close_dashboard')}
                        aria-label={t('dashboard.close_kpi')}
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    </ErrorBoundary>
                </div>
            );
        }

        // Only show EmergencyEMR if we're in IGD service AND have an active emergency
        if (activeEmergencyId && activeServiceId === 'igd') {
            return (
                <ErrorBoundary name="EmergencyEMR" fallbackAction={() => setActiveServiceId('poli_umum')} fallbackActionLabel={t('clinical.back_clinic')}>
                <EmergencyEMR
                    patient={emergencyQueue.find(p => p.id === activeEmergencyId)}
                    onStabilize={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                    onRefer={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                    onDischarge={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                />
                </ErrorBoundary>
            );
        }

        // Only show PatientEMR if we have an active patient AND we're in a regular queue-based service
        if (hasActiveRegularPatientInService && activeServiceId !== 'igd' && activeServiceId !== 'farmasi_lab') {
            return (
                <ErrorBoundary name="Patient EMR (Poly)">
                    <PatientEMR />
                </ErrorBoundary>
            );
        }



        // Empty state background
        const emptyStateBg = activeServiceId === 'poli_umum' ? '/images/wilayah/poli_umum_bg.png' :
            activeServiceId === 'igd' ? '/images/wilayah/igd_bg.png' : null;

        const isNotYetOpen = isQueueService && !isClinicalServiceOpen(activeService, time) && time < 480;
        const isClosed = isQueueService && !isClinicalServiceOpen(activeService, time);
        const highlightTitle = isEmergencyService
            ? t('clinical.workflow_ready_emergency_title')
            : t('clinical.workflow_ready_queue_title');
        const highlightDescription = isEmergencyService
            ? t('clinical.workflow_ready_emergency_description')
            : t('clinical.workflow_ready_queue_description');
        const nextPatientIdentity = getQueuePatientIdentity(nextQueuePatient);
        const coverageLabel = getCoverageLabel(nextQueuePatient);


        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 relative overflow-hidden px-4">
                {/* Visual Context Background */}
                {emptyStateBg && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <img src={emptyStateBg} alt={t('clinical.empty_state_background_alt')} className="max-w-[65%] max-h-[55%] object-contain md:max-w-[40%] md:max-h-[60%]" />
                    </div>
                )}

                <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-4 md:max-w-5xl">
                    {isClosed ? (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                            <div className="p-6 bg-amber-50 rounded-full border-4 border-amber-200">
                                <Construction size={64} className="text-amber-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-amber-800 tracking-tight uppercase">
                                    {isNotYetOpen ? t('clinical.service_not_open_title') : t('dashboard.closed_title')}
                                </h3>
                                <p className="text-amber-600 mt-1 max-w-xs">
                                    {isNotYetOpen
                                        ? t('clinical.service_not_open_description')
                                        : t('dashboard.closed_description')}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-64">
                                <button
                                    onClick={() => setShowKPI(true)}
                                    className={`px-4 py-3 ${isDark ? 'bg-slate-800 text-indigo-300 border-indigo-900/50' : 'bg-white text-indigo-600 border-indigo-100'} border-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center justify-center gap-2 font-bold transition-all shadow-sm`}
                                >
                                    <BarChart3 size={20} /> {t('dashboard.performance')} (KPI)
                                </button>
                                <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold mt-2">
                                    {t('dashboard.closed_footer')}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={`hidden md:block w-full max-w-4xl rounded-[28px] border p-5 shadow-2xl backdrop-blur-xl ${isDark ? 'border-slate-700 bg-slate-900/85 text-slate-100 shadow-slate-950/40' : 'border-slate-200 bg-white/92 text-slate-800 shadow-slate-200/80'}`}>
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                                                <Stethoscope size={12} />
                                                {activeService?.name || t('queue.service_fallback')}
                                            </span>
                                            {activeServiceQueue.length > 0 && (
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                    {activeServiceQueue.length} {t('dashboard.waiting')}
                                                </span>
                                            )}
                                            {hasPendingEmergencyOutsideIGD && (
                                                <button
                                                    onClick={() => setActiveServiceId('igd')}
                                                    className={`hidden md:inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] transition-all active:scale-[0.98] ${
                                                        isDark
                                                            ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                                            : 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                    }`}
                                                >
                                                    <Siren size={12} />
                                                    {t('clinical.emergency_waiting', { count: emergencyQueue.length })}
                                                </button>
                                            )}
                                        </div>

                                        <h3 className={`mt-4 text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {highlightTitle}
                                        </h3>
                                        <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {highlightDescription}
                                        </p>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {t('clinical.workflow_metric_queue')}
                                                </p>
                                                <p className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeServiceQueue.length}</p>
                                                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {isEmergencyService
                                                        ? t('clinical.workflow_metric_queue_hint_emergency')
                                                        : t('clinical.workflow_metric_queue_hint')}
                                                </p>
                                            </div>

                                            <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {isEmergencyService ? t('clinical.workflow_metric_emergency') : t('clinical.workflow_metric_wait')}
                                                </p>
                                                <p className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {isEmergencyService
                                                        ? (activeServiceQueue[0]?.esiLevel || activeServiceQueue[0]?.triageLevel || '-')
                                                        : `${maxServiceWaitMinutes}m`}
                                                </p>
                                                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {isEmergencyService
                                                        ? t('clinical.workflow_metric_emergency_hint')
                                                        : t('clinical.workflow_metric_wait_hint')}
                                                </p>
                                            </div>

                                            <div className={`rounded-2xl border p-3 ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {activeServiceId === 'poli_umum'
                                                        ? t('clinical.workflow_metric_program')
                                                        : t('clinical.workflow_metric_support')}
                                                </p>
                                                <p className={`mt-2 text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {activeServiceId === 'poli_umum'
                                                        ? t('clinical.workflow_metric_program_value', { count: prolanisCount })
                                                        : (activeService?.shortName || activeService?.name || t('queue.service_fallback'))}
                                                </p>
                                                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {activeServiceId === 'poli_umum'
                                                        ? t('clinical.workflow_metric_program_hint')
                                                        : t('clinical.workflow_metric_support_hint')}
                                                </p>
                                            </div>
                                        </div>

                                        {nextQueuePatient ? (
                                            <div className={`mt-5 rounded-[24px] border p-4 ${isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-emerald-300/70' : 'text-emerald-700/70'}`}>
                                                    {t('clinical.workflow_next_patient')}
                                                </p>
                                                <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-center">
                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                        <div
                                                            style={getAvatarStyle(nextQueuePatient.age, nextQueuePatient.gender, 52)}
                                                            className="h-12 w-12 shrink-0 rounded-full border border-emerald-400/30 shadow-sm"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className={`truncate text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{nextQueuePatient.name}</p>
                                                            <div className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                <span>{nextPatientIdentity}</span>
                                                                <span className="opacity-40">•</span>
                                                                <span className={nextQueuePatient.social?.hasBPJS ? (isDark ? 'text-emerald-300' : 'text-emerald-700') : ''}>{coverageLabel}</span>
                                                                {!isEmergencyService && (
                                                                    <>
                                                                        <span className="opacity-40">•</span>
                                                                        <span>{t('clinical.workflow_wait_compact', { minutes: nextPatientWaitMinutes })}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => handleQueuePatientClick(nextQueuePatient)}
                                                            className={`rounded-2xl px-4 py-2.5 text-sm font-black transition-all active:scale-[0.98] ${isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                                                        >
                                                            {isEmergencyService
                                                                ? t('clinical.workflow_take_case')
                                                                : t('clinical.workflow_call_next')}
                                                        </button>
                                                        <button
                                                            onClick={() => setShowKPI(true)}
                                                            className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${isDark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                                        >
                                                            {t('dashboard.open_kpi')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`mt-5 rounded-[24px] border border-dashed p-4 ${isDark ? 'border-slate-700 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                                <p className="text-sm font-bold">
                                                    {t('clinical.workflow_empty_queue')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Stethoscope size={64} className="opacity-30 md:hidden" />
                            <p className="max-w-md text-center text-sm sm:text-base md:hidden">{t('emr.header_waiting')}</p>

                            {(isQueueService || isEmergencyService) && (
                                <div className={`md:hidden w-full rounded-2xl border p-4 shadow-lg backdrop-blur-sm ${isDark ? 'bg-slate-900/90 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${isDark ? 'text-indigo-300/80' : 'text-indigo-600/80'}`}>
                                                {activeService?.name || t('clinical.queue_tab')}
                                            </p>
                                            <h4 className="mt-2 text-lg font-black leading-tight">{mobileQueueStatus}</h4>
                                            <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {t('clinical.mobile_queue_hint')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={openMobileQueue}
                                            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition-all active:scale-95 ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}
                                        >
                                            {t('clinical.mobile_queue_cta')}
                                        </button>
                                    </div>

                                    {mobileQueueCount > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {t('clinical.mobile_queue_preview')}
                                            </p>
                                            {activeServiceQueue.slice(0, 2).map((patient) => (
                                                <button
                                                    key={patient.id}
                                                    onClick={() => handleMobileQueuePatientSelect(patient)}
                                                    className={`w-full rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.99] ${
                                                        isQueueInteractionLocked
                                                            ? (isDark ? 'border-amber-500/20 bg-slate-800/70 text-slate-300' : 'border-amber-200 bg-amber-50/80 text-slate-700')
                                                            : (isDark ? 'border-slate-700 bg-slate-800/80 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-800')
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            style={getAvatarStyle(patient.age, patient.gender, 36)}
                                                            className="h-9 w-9 rounded-full border border-indigo-400/30"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-bold">{patient.name}</p>
                                                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                {getQueuePatientIdentity(patient)}
                                                            </p>
                                                        </div>
                                                        {isQueueInteractionLocked ? (
                                                            <span className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                                                                {t('clinical.queue_locked_badge')}
                                                            </span>
                                                        ) : (
                                                            <ChevronRight size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Lounge Rest Area */}
                            {activeServiceId === 'poli_umum' && activeServiceQueue.length === 0 && !hasActiveRegularPatientInService && !activeEmergencyId && (
                                <div className={`mt-8 p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl border shadow-sm max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <Coffee size={24} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{t('clinical.lounge_title')}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('clinical.lounge_subtitle')}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                        {t('clinical.lounge_description')}
                                    </p>
                                    <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} p-3 rounded-lg mb-4 flex justify-between items-center text-[10px] font-bold`}>
                                        <span className="text-slate-500 uppercase">{t('clinical.lounge_quota')}</span>
                                        <span className={loungeRestCount >= 3 ? 'text-red-500' : 'text-indigo-600'}>
                                            {t('clinical.lounge_quota_value', { remaining: restQuotaRemaining })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const result = takeLoungeRest();
                                            if (!result.success) {
                                                showToast(result.message || t('clinical.rest_limit_reached'), 'warning', 2600);
                                            }
                                        }}
                                        disabled={loungeRestCount >= 3}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2
                                            ${loungeRestCount >= 3
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
                                            }`}
                                    >
                                        {t('clinical.lounge_rest_cta')}
                                    </button>
                                </div>
                            )}

                            {hasPendingEmergencyOutsideIGD && (
                                <button
                                    onClick={() => setActiveServiceId('igd')}
                                    className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-red-500 shadow-sm md:hidden"
                                >
                                    <Siren size={16} aria-hidden="true" />
                                    <span className="font-bold">{t('clinical.emergency_waiting', { count: emergencyQueue.length })}</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };
    // Toast system (replaces alert/confirm)
    return (
        <div className="flex h-full overflow-hidden relative">
            {/* Left Sidebar: Service Card Deck & Queue */}
            <div className={`hidden md:flex border-r flex-col h-full transition-all duration-300 relative overflow-x-hidden ${isSidebarCollapsed ? 'w-[4.5rem]' : isTabletViewport ? 'w-[20rem]' : 'w-[clamp(18.5rem,28vw,23rem)]'} ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5 shadow-lg hover:scale-110 transition-all ${isDark ? 'bg-slate-800 border border-slate-600 hover:bg-slate-700' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                    title={isSidebarCollapsed ? t('clinical.open_panel') : t('clinical.close_panel')}
                    aria-label={isSidebarCollapsed ? t('clinical.open_panel') : t('clinical.close_panel')}
                >
                    {isSidebarCollapsed ? <ChevronRight size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} /> : <ChevronLeft size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />}
                </button>

                {/* Service Card Deck */}
                <div className={`p-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} ${isSidebarCollapsed ? 'hidden' : ''}`}>
                    <ErrorBoundary name="ServiceCardDeck">
                    <ServiceCardDeck
                        services={CLINICAL_SERVICES}
                        activeServiceId={activeServiceId}
                        onSelectService={setActiveServiceId}
                        playerLevel={playerLevel}
                        hiredStaff={hiredStaff}
                        emergencyCount={emergencyQueue?.length || 0}
                        compact={viewportWidth < 1440}
                    />
                    </ErrorBoundary>
                </div>

                {/* Queue/Panel Content - When Expanded */}
                {!isSidebarCollapsed && (
                    <div data-testid="clinical-sidebar-panel" className={`flex-1 overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        {renderServiceContent()}
                    </div>
                )}

                {/* Collapsed State: Service Icons + Queue + Patient Avatars */}
                {isSidebarCollapsed && (() => {
                    // Calculate queue count and patients based on active service type
                    let serviceQueue = [];
                    let accentBg = 'bg-emerald-500';
                    let accentRing = 'ring-emerald-500';
                    let accentText = 'text-emerald-600';
                    let serviceLabel = t('clinical.collapsed_queue');
                    const isEmergency = activeService?.queueType === 'emergency';
                    const queueLocked = !isEmergency && isQueueInteractionLocked;

                    if (activeService?.queueType === 'queue') {
                        serviceQueue = activeServiceQueue;
                        accentBg = 'bg-indigo-500';
                        accentRing = 'ring-indigo-500';
                        accentText = 'text-indigo-600';
                        serviceLabel = t('clinical.collapsed_clinic');
                    } else if (activeService?.queueType === 'emergency') {
                        serviceQueue = emergencyQueue || [];
                        accentBg = 'bg-red-500';
                        accentRing = 'ring-red-500';
                        accentText = 'text-red-600';
                        serviceLabel = t('clinical.collapsed_emergency');
                    }




                    const handlePatientClick = (patient) => {
                        if (isEmergency) {
                            admitEmergencyPatient(patient.id);
                            return;
                        }
                        if (queueLocked) {
                            showToast(queueUnavailableMessage, 'warning', 2600);
                            return;
                        }
                        admitPatient(patient.id);
                    };

                    return (
                        <>
                            {/* Service Icons with accent colors */}
                            <div className={`flex flex-col items-center gap-1 ${isSidebarCollapsed ? 'p-1' : 'p-2'} border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} transition-all overflow-x-hidden`}>
                                {CLINICAL_SERVICES.filter(s => !s.betaLocked).map(service => {
                                    const ServiceIcon = service.id === 'igd' ? Siren : Stethoscope;
                                    const isActive = activeServiceId === service.id;
                                    // Service-specific active colors
                                    const serviceAccent = service.id === 'igd' ? 'bg-red-500 shadow-red-500/30'
                                        : 'bg-indigo-500 shadow-indigo-500/30';
                                    const hoverLabel = service.id === 'igd' ? 'bg-red-500 border-r-red-500'
                                        : 'bg-indigo-500 border-r-indigo-500';

                                    return (
                                        <div key={service.id} className="relative group">
                                            <button
                                                onClick={() => {
                                                if (!isServiceUnlocked(service, playerLevel, hiredStaff)) return;
                                                setActiveServiceId(service.id);
                                            }}
                                                className={`p-2.5 rounded-xl transition-all duration-200 ${isActive
                                                    ? `${serviceAccent} text-white shadow-lg scale-110`
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:scale-105'
                                                    }`}
                                            >
                                                <ServiceIcon size={18} />
                                            </button>
                                            {/* PS-style hover label with matching color */}
                                            <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 ${isActive ? hoverLabel.split(' ')[0] : 'bg-slate-800'} text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl`}>
                                                <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] ${isActive ? hoverLabel.split(' ')[1] : 'border-r-slate-800'} border-b-[6px] border-b-transparent`}></div>
                                                {service.icon} {service.name}
                                            </div>
                                            {/* Queue indicator on active service */}
                                            {isActive && serviceQueue.length > 0 && (
                                                <span className={`absolute -top-1 -right-1 w-4 h-4 ${accentBg} text-white text-[9px] font-bold rounded-full flex items-center justify-center`}>
                                                    {serviceQueue.length}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Queue Label + Mini Patient Avatars */}
                            <div className={`flex-1 flex flex-col items-center ${isSidebarCollapsed ? 'pt-2' : 'pt-3'} gap-2 overflow-hidden transition-all`}>
                                <span className={`text-[10px] ${accentText} uppercase tracking-[0.2em] font-bold`}>{serviceLabel}</span>

                                {/* Scrollable Patient Avatar List */}
                                <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar ${isSidebarCollapsed ? 'px-0' : 'px-1'} transition-all`}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        {serviceQueue.slice(0, 8).map((patient) => {
                                            return (
                                                <div key={patient.id} className="relative group">
                                                    <button
                                                        onClick={() => handlePatientClick(patient)}
                                                        className={`w-11 h-11 rounded-full overflow-hidden transition-all shadow-md ${queueLocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-110'} ${isEmergency
                                                            ? patient.triageLevel === 1
                                                                ? 'ring-4 ring-red-600'
                                                                : patient.triageLevel === 2
                                                                    ? 'ring-4 ring-yellow-500'
                                                                    : patient.triageLevel === 3
                                                                        ? 'ring-4 ring-green-500'
                                                                        : 'ring-4 ring-slate-800'
                                                            : `ring-2 ${accentRing}`
                                                            }`}
                                                        title={queueLocked ? queueUnavailableMessage : `${patient.name} - ${t('clinical.call_patient')}`}
                                                    >
                                                        <div
                                                            style={getAvatarStyle(patient.age, patient.gender, 40)}
                                                            className="w-full h-full"
                                                        />
                                                    </button>

                                                    {/* Triage level badge - Shows ESI Level (1-5) */}
                                                    {isEmergency && (
                                                        <span className={`absolute -bottom-1 -right-1 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md ${patient.triageLevel === 1 ? 'bg-red-700 text-white' : patient.triageLevel === 2 ? 'bg-yellow-600 text-white' : 'bg-green-700 text-white'}`}>
                                                            {patient.esiLevel || patient.triageLevel}
                                                        </span>
                                                    )}

                                                    {/* Hover label - Shows both systems */}
                                                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900/95 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 whitespace-nowrap z-50 shadow-lg max-w-36 truncate">
                                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-slate-900/95 border-b-4 border-b-transparent"></div>
                                                        {patient.name?.split(' ')[0] || t('clinical.patient_fallback')}
                                                        {isEmergency && (
                                                            <span className={`ml-1 px-1 rounded text-[9px] ${patient.triageLevel === 1 ? 'bg-red-500' : patient.triageLevel === 2 ? 'bg-yellow-500 text-black' : 'bg-green-500'}`}>
                                                                {patient.esiLevel ? `T${patient.esiLevel} | ` : ''}
                                                                {TRIAGE_LEVELS[patient.triageLevel]?.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* More indicator */}
                                        {serviceQueue.length > 8 && (
                                            <div className={`text-[10px] ${accentText} font-bold`}>
                                                +{serviceQueue.length - 8}
                                            </div>
                                        )}

                                        {/* Empty state */}
                                        {serviceQueue.length === 0 && (
                                            <div className="text-slate-300 py-4">
                                                <Users size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>

            {/* Right: Work Area (EMR) */}
            <div className={`flex-1 relative overflow-auto h-full transition-all duration-500 
                ${isDark ? 'bg-slate-800' : 'bg-slate-50'}
            `}>
                {renderWorkArea()}


            </div>

            {/* Mobile Queue Drawer - floating button + slide-up panel */}
            {!hasActiveRegularPatientInService && !activeEmergencyId && !showKPI && (isQueueService || isEmergencyService) && (
                <>
                    {/* Floating queue button */}
                    <button
                        onClick={() => setMobileQueueOpen(v => !v)}
                        className={`md:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40 flex h-14 items-center gap-3 rounded-2xl px-4 shadow-xl transition-all active:scale-90
                            ${isQueueInteractionLocked
                                ? (isDark ? 'bg-amber-500 text-slate-950 shadow-amber-900/40' : 'bg-amber-400 text-slate-950 shadow-amber-200')
                                : (isDark ? 'bg-indigo-600 text-white shadow-indigo-900/40' : 'bg-indigo-600 text-white shadow-indigo-200')}`}
                    >
                        <Users size={22} />
                        <div className="min-w-0 text-left">
                            <span className={`block text-[10px] font-black uppercase tracking-[0.18em] ${isQueueInteractionLocked ? 'text-slate-900/60' : 'text-white/75'}`}>
                                {activeService?.name || t('clinical.queue_tab')}
                            </span>
                            <span className="block truncate text-sm font-black">
                                {mobileQueueCount > 0 ? mobileQueueStatus : t('clinical.mobile_queue_cta')}
                            </span>
                        </div>
                        {mobileQueueCount > 0 && (
                            <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1.5 text-[10px] font-black text-white">
                                {mobileQueueCount}
                            </span>
                        )}
                    </button>

                    {/* Slide-up queue drawer */}
                        {mobileQueueOpen && (
                        <div className={`md:hidden fixed inset-0 z-50 flex flex-col justify-end`}>
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileQueueOpen(false)} />
                            {/* Panel */}
                            <div className={`relative max-h-[56vh] overflow-hidden rounded-t-[28px] flex flex-col overscroll-contain
                                ${isDark ? 'bg-slate-900 border-t border-slate-700' : 'bg-white border-t border-slate-200'}
                                animate-in slide-in-from-bottom-4 duration-300`}>
                                <div className="flex justify-center pt-2">
                                    <div className={`h-1.5 w-14 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                                </div>
                                {/* Header with close button */}
                                <div className={`sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-4 pt-3 pb-2 backdrop-blur-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}>
                                    <div>
                                        <span className={`block font-black text-xs uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {activeService?.name || t('clinical.mobile_queue_title', { count: mobileQueueCount })}
                                        </span>
                                        <span className={`block text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {mobileQueueStatus}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setMobileQueueOpen(false)}
                                        aria-label={t('clinical.close_queue')}
                                        className={`p-1.5 rounded-lg transition-all active:scale-90 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto px-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-2">
                                    {mobileQueueCount === 0 ? (
                                        <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <Stethoscope size={32} className="mx-auto mb-2 opacity-30" />
                                            <p className="text-xs">{t('clinical.mobile_queue_empty')}</p>
                                        </div>
                                    ) : (
                                        activeServiceQueue.map(patient => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handleMobileQueuePatientSelect(patient)}
                                                className={`mb-2 w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all active:scale-[0.98]
                                                    ${isQueueInteractionLocked
                                                        ? (isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-50 text-slate-500')
                                                        : (isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700')}`}
                                            >
                                                <div
                                                    style={getAvatarStyle(patient.age, patient.gender, 40)}
                                                    className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-indigo-400/30"
                                                />
                                                <div className="flex-1 text-left">
                                                    <p className="font-bold text-sm">{patient.name}</p>
                                                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {getQueuePatientIdentity(patient)}
                                                    </p>
                                                </div>
                                                {!isQueueInteractionLocked && (
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{t('clinical.call')}</span>
                                                )}
                                                {isQueueInteractionLocked && (
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>{t('clinical.queue_locked_badge')}</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
