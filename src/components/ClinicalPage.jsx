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

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import QueueList from './QueueList.jsx';
import PatientEMR from './PatientEMR.jsx';
import KPIDashboard from './KPIDashboard.jsx';
import EmergencyPanel, { EmergencyEMR } from './EmergencyPanel.jsx';
import ProlanisPanel from './ProlanisPanel.jsx';
import ProlanisConsultation from './ProlanisConsultation.jsx';
import FarmasiPanel from './FarmasiPanel.jsx';
import ServiceCardDeck from './ServiceCardDeck.jsx';
import { CLINICAL_SERVICES } from '../data/ClinicalServices.js';
import { Stethoscope, BarChart3, Construction, X, ChevronLeft, ChevronRight, Siren, Users, Lock } from 'lucide-react';
import { TRIAGE_LEVELS } from '../game/EmergencyCases.js';
import { getAvatarStyle } from '../utils/AvatarUtils.js';
import { useToast } from '../utils/ToastManager.js';


export default function ClinicalPage() {
    const {
        emergencyQueue, activeEmergencyId, admitEmergencyPatient, dischargeEmergencyPatient,
        activePatientId, completeProlanisVisit, playerStats, time, day,
        morningStatus, takeLoungeRest, loungeRestCount, queue, hiredStaff, admitPatient, history
    } = useGame();
    const { isDark } = useTheme();
    const { t } = useTranslation();

    // Local state for this page
    const [activeServiceId, setActiveServiceId] = useState('poli_umum');
    const [showKPI, setShowKPI] = useState(false);
    const [activeProlanisConsultation, setActiveProlanisConsultation] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [poliUmumSubTab, setPoliUmumSubTab] = useState('antrian'); // 'antrian' | 'prolanis'

    // Get player level from game state
    const playerLevel = playerStats?.level || 1;

    // Get active service details
    const activeService = CLINICAL_SERVICES.find(s => s.id === activeServiceId);

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
                            <h3 className="font-bold text-lg">{activeService.name}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                                🔒 Coming Soon
                            </span>
                        </div>
                    </div>
                    <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {activeService.description}
                    </p>
                    {activeService.comingSoonFeatures && (
                        <div className="space-y-2 flex-1 overflow-y-auto">
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Preview Gameplay
                            </p>
                            {activeService.comingSoonFeatures.map((feature, i) => (
                                <div key={i} className={`p-3 rounded-lg text-xs leading-relaxed transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-100'}`}>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={`mt-4 p-3 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                        Unlock di Level {activeService.unlockLevel}
                        {activeService.requiredStaff && ` + Hire Staff`}
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
                            <div className={`flex border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                <button
                                    onClick={() => setPoliUmumSubTab('antrian')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all ${poliUmumSubTab === 'antrian'
                                        ? `border-b-2 ${isDark ? 'border-indigo-400 text-indigo-400' : 'border-indigo-600 text-indigo-600'}`
                                        : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`
                                        }`}
                                >
                                    🩺 Antrian
                                </button>
                                <button
                                    onClick={() => setPoliUmumSubTab('prolanis')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all ${poliUmumSubTab === 'prolanis'
                                        ? `border-b-2 ${isDark ? 'border-pink-400 text-pink-400' : 'border-pink-600 text-pink-600'}`
                                        : `${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`
                                        }`}
                                >
                                    💗 Prolanis
                                </button>
                            </div>
                            {/* Sub-tab content */}
                            <div className="flex-1 overflow-y-auto">
                                {poliUmumSubTab === 'prolanis'
                                    ? <ProlanisPanel compact />
                                    : (time < 480 || time >= 960) ? (
                                        <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <Construction size={32} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Antrean Belum Dibuka</p>
                                            <p className="text-[10px] mt-1 opacity-60">Poli melayani jam 08:00 - 16:00</p>
                                        </div>
                                    ) : <QueueList activeService={activeService} />
                                }
                            </div>
                        </div>
                    );
                }
                // Other queue-type polis (fallback)
                return (time < 480 || time >= 960) ? (
                    <div className={`p-8 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Construction size={32} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">Antrean Belum Dibuka</p>
                        <p className="text-[10px] mt-1 opacity-60">Poli melayani jam 08:00 - 16:00</p>
                    </div>
                ) : <QueueList activeService={activeService} />;
            case 'emergency':
                return (
                    <EmergencyPanel
                        emergencyQueue={emergencyQueue}
                        onAdmitEmergency={admitEmergencyPatient}
                        activeEmergencyId={activeEmergencyId}
                        time={time}
                    />
                );
            case 'farmasi_lab':
                return <FarmasiPanel isDark={isDark} history={history} currentDay={day} />;
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
                                        🔒 Terkunci
                                    </span>
                                ) : (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                        🔧 Dalam Pengembangan
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Unlock requirements */}
                        {isLocked && (
                            <div className={`p-3 rounded-lg mb-4 flex flex-col gap-2 ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Syarat Buka:</p>
                                {needsLevel && (
                                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Lock size={12} className="text-amber-500" />
                                        <span>Level <strong>{activeService.unlockLevel}</strong> (sekarang Lv.{playerLevel})</span>
                                    </div>
                                )}
                                {needsStaff && (
                                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <Users size={12} className="text-amber-500" />
                                        <span>Rekrut <strong>{activeService.requiredStaff}</strong> dari menu Staff</span>
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
                                    Preview Gameplay
                                </p>
                                {activeService.comingSoonFeatures.map((feature, i) => (
                                    <div key={i} className={`p-3 rounded-lg text-xs leading-relaxed transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-100'}`}>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className={`mt-4 p-3 rounded-lg text-center text-[10px] italic ${isDark ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                            {isLocked ? 'Penuhi syarat di atas untuk membuka layanan ini' : 'Engine gameplay untuk layanan ini sedang dikembangkan'}
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
                    <KPIDashboard />
                    <button
                        onClick={() => setShowKPI(false)}
                        className="absolute top-6 right-8 z-50 p-2.5 bg-white/10 hover:bg-rose-500 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all group shadow-xl"
                        title="Close Dashboard"
                        aria-label="Tutup Dashboard KPI"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            );
        }

        // Only show EmergencyEMR if we're in IGD service AND have an active emergency
        if (activeEmergencyId && activeServiceId === 'igd') {
            return (
                <EmergencyEMR
                    patient={emergencyQueue.find(p => p.id === activeEmergencyId)}
                    onStabilize={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                    onRefer={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                    onDischarge={(patient, decision) => dischargeEmergencyPatient(patient, decision)}
                />
            );
        }

        // Only show PatientEMR if we have an active patient AND we're in a regular queue-based service
        if (activePatientId && activeServiceId !== 'igd' && activeServiceId !== 'farmasi_lab') {
            return (
                <ErrorBoundary name="Patient EMR (Poly)">
                    <PatientEMR />
                </ErrorBoundary>
            );
        }

        // Handle prolanis consultation (now a sub-tab of Poli Umum)
        if (activeProlanisConsultation && activeServiceId === 'poli_umum' && poliUmumSubTab === 'prolanis') {
            return (
                <ErrorBoundary name="Patient EMR (Prolanis)">
                    <PatientEMR />
                </ErrorBoundary>
            );
        }

        // Empty state background
        const emptyStateBg = activeServiceId === 'poli_umum' ? '/images/wilayah/poli_umum_bg.png' :
            activeServiceId === 'igd' ? '/images/wilayah/igd_bg.png' : null;

        const isNotYetOpen = time < 480 && activeServiceId !== 'igd';
        const isClosed = (time >= 960 || time < 480) && activeServiceId !== 'igd';


        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 relative overflow-hidden">
                {/* Visual Context Background */}
                {emptyStateBg && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <img src={emptyStateBg} alt="Background" className="max-w-[40%] max-h-[60%] object-contain" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center gap-4">
                    {isClosed ? (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                            <div className="p-6 bg-amber-50 rounded-full border-4 border-amber-200">
                                <Construction size={64} className="text-amber-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-amber-800 tracking-tight uppercase">
                                    {isNotYetOpen ? 'Poli Belum Buka' : t('dashboard.closed_title')}
                                </h3>
                                <p className="text-amber-600 mt-1 max-w-xs">
                                    {isNotYetOpen
                                        ? 'Pelayanan poli dimulai pukul 08:00 AM. Silakan beristirahat atau dampingi pasien IGD.'
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
                            <Stethoscope size={64} className="opacity-30" />
                            <p>{t('emr.header_waiting')}</p>

                            {/* Lounge Rest Area */}
                            {queue.length === 0 && !activePatientId && !activeEmergencyId && (
                                <div className={`mt-8 p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl border shadow-sm max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <span className="text-2xl">☕</span>
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Lounge Puskesmas</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tempat Istirahat Sejenak</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                                        Antrean sedang kosong. Gunakan waktu ini untuk istirahat sejenak agar tetap fokus melayani pasien.
                                    </p>
                                    <div className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} p-3 rounded-lg mb-4 flex justify-between items-center text-[10px] font-bold`}>
                                        <span className="text-slate-500 uppercase">Kuota Hari Ini:</span>
                                        <span className={loungeRestCount >= 3 ? 'text-red-500' : 'text-indigo-600'}>
                                            {3 - loungeRestCount} / 3 Kali
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const result = takeLoungeRest();
                                            if (!result.success) alert(result.message);
                                        }}
                                        disabled={loungeRestCount >= 3}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2
                                            ${loungeRestCount >= 3
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
                                            }`}
                                    >
                                        Istirahat Sejenak (15m)
                                    </button>
                                </div>
                            )}

                            {emergencyQueue && emergencyQueue.length > 0 && activeServiceId !== 'igd' && (
                                <button
                                    onClick={() => setActiveServiceId('igd')}
                                    className="flex items-center gap-2 text-red-500 animate-pulse bg-red-50 px-4 py-2 rounded-lg border border-red-100 shadow-sm"
                                >
                                    <span className="font-bold">🚨 Ada {emergencyQueue.length} pasien IGD menunggu!</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowKPI(true)}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all active:scale-95"
                            >
                                <BarChart3 size={18} /> {t('dashboard.open_kpi')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };
    // Toast system (replaces alert/confirm)
    const { toasts, dismissToast } = useToast();

    return (
        <div className="flex h-full overflow-hidden relative">
            {/* Left Sidebar: Service Card Deck & Queue */}
            <div className={`border-r flex flex-col h-full transition-all duration-300 relative overflow-x-hidden ${isSidebarCollapsed ? 'w-16' : 'w-80'} ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-1.5 shadow-lg hover:scale-110 transition-all ${isDark ? 'bg-slate-800 border border-slate-600 hover:bg-slate-700' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                    title={isSidebarCollapsed ? "Buka Panel" : "Tutup Panel"}
                    aria-label={isSidebarCollapsed ? "Buka Panel Layanan" : "Tutup Panel Layanan"}
                >
                    {isSidebarCollapsed ? <ChevronRight size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} /> : <ChevronLeft size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />}
                </button>

                {/* Service Card Deck */}
                <div className={`p-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} ${isSidebarCollapsed ? 'hidden' : ''}`}>
                    <ServiceCardDeck
                        services={CLINICAL_SERVICES}
                        activeServiceId={activeServiceId}
                        onSelectService={setActiveServiceId}
                        playerLevel={playerLevel}
                        hiredStaff={hiredStaff}
                        emergencyCount={emergencyQueue?.length || 0}
                    />
                </div>

                {/* Queue/Panel Content - When Expanded */}
                {!isSidebarCollapsed && (
                    <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
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
                    let serviceLabel = 'Antrian';
                    const isEmergency = activeService?.queueType === 'emergency';

                    if (activeService?.queueType === 'queue') {
                        serviceQueue = queue;
                        accentBg = 'bg-indigo-500';
                        accentRing = 'ring-indigo-500';
                        accentText = 'text-indigo-600';
                        serviceLabel = 'Poli';
                    } else if (activeService?.queueType === 'emergency') {
                        serviceQueue = emergencyQueue || [];
                        accentBg = 'bg-red-500';
                        accentRing = 'ring-red-500';
                        accentText = 'text-red-600';
                        serviceLabel = 'IGD';
                    }




                    const handlePatientClick = (patient) => {
                        if (isEmergency) {
                            admitEmergencyPatient(patient.id);
                        } else {
                            admitPatient(patient.id);
                        }
                    };

                    return (
                        <>
                            {/* Service Icons with accent colors */}
                            <div className={`flex flex-col items-center gap-1 ${isSidebarCollapsed ? 'p-0.5' : 'p-2'} border-b border-slate-200 transition-all overflow-x-hidden`}>
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
                                                onClick={() => setActiveServiceId(service.id)}
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
                            <div className={`flex-1 flex flex-col items-center ${isSidebarCollapsed ? 'pt-1.5' : 'pt-3'} gap-2 overflow-hidden transition-all`}>
                                <span className={`text-[8px] ${accentText} uppercase tracking-widest font-bold`}>{serviceLabel}</span>

                                {/* Scrollable Patient Avatar List */}
                                <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar ${isSidebarCollapsed ? 'px-0' : 'px-1'} transition-all`}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        {serviceQueue.slice(0, 8).map((patient, idx) => {

                                            const isFirst = idx === 0;

                                            return (
                                                <div key={patient.id} className="relative group">
                                                    <button
                                                        onClick={() => handlePatientClick(patient)}
                                                        className={`w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-110 shadow-md ${isEmergency
                                                            ? patient.triageLevel === 1
                                                                ? 'ring-4 ring-red-600'
                                                                : patient.triageLevel === 2
                                                                    ? 'ring-4 ring-yellow-500'
                                                                    : patient.triageLevel === 3
                                                                        ? 'ring-4 ring-green-500'
                                                                        : 'ring-4 ring-slate-800'
                                                            : `ring-2 ${accentRing}`
                                                            }`}
                                                        title={`${patient.name} - Klik untuk panggil`}
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
                                                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900/95 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 whitespace-nowrap z-50 shadow-lg max-w-32 truncate">
                                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-slate-900/95 border-b-4 border-b-transparent"></div>
                                                        {patient.name?.split(' ')[0] || 'Pasien'}
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
                                            <div className={`text-[9px] ${accentText} font-bold`}>
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

                {/* Prolanis Overlay (now accessible via sub-tab in Poli Umum) */}
                {activeServiceId === 'poli_umum' && poliUmumSubTab === 'prolanis' && !activePatientId && (
                    <div className={`absolute inset-0 z-20 p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <ProlanisPanel />
                    </div>
                )}

                {/* Prolanis Consultation Modal */}
                {activeProlanisConsultation && (
                    <ProlanisConsultation
                        patient={activeProlanisConsultation}
                        onClose={() => setActiveProlanisConsultation(null)}
                        onComplete={(data) => {
                            completeProlanisVisit(data);
                            setActiveProlanisConsultation(null);
                            setActiveServiceId('poli_umum');
                        }}
                    />
                )}
            </div>

            {/* Global Toast Renderer */}
            {toasts.length > 0 && (
                <div className="absolute top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-auto max-w-md" role="status" aria-live="polite">
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={`px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-sm border backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-600/95 border-red-500/30' :
                                toast.type === 'success' ? 'bg-emerald-600/95 border-emerald-500/30' :
                                    toast.type === 'warning' ? 'bg-amber-600/95 border-amber-500/30 text-amber-50' :
                                        'bg-blue-600/95 border-blue-500/30'}`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-base shrink-0">{toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                <span className="flex-1 leading-snug">{toast.message}</span>
                            </div>
                            {toast.isConfirm && (
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => dismissToast(toast.id, true)} className="flex-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-black uppercase tracking-wider transition-all">
                                        Ya, Lanjutkan
                                    </button>
                                    <button onClick={() => dismissToast(toast.id, false)} className="flex-1 px-3 py-1.5 bg-black/20 hover:bg-black/30 rounded-lg text-xs font-black uppercase tracking-wider transition-all">
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
