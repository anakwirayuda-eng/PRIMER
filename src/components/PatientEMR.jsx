/**
 * @reflection
 * [IDENTITY]: PatientEMR
 * [PURPOSE]: React UI component: PatientEMR.
 * [STATE]: Polished & Immersive Medical UI/UX
 * [ANCHOR]: PatientEMR
 * [DEPENDS_ON]: ThemeContext, EducationOptions, MedicationDatabase, AvatarUtils, usePatientEMR, ClinicalSidebar, ReasoningDashboard
 */

import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    User, Shield, Brain, Microscope, Stethoscope, FileText, Activity, 
    Pill, Scissors, BookOpen, Receipt, Scale, AlertCircle, CheckCircle2,
    ChevronRight, Fingerprint, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { EDUCATION_OPTIONS } from '../data/EducationOptions.js';
import { MEDICATION_DATABASE, searchMedications, getMedicationById } from '../data/MedicationDatabase.js';
import { getAvatarStyle } from '../utils/AvatarUtils.js';
import { usePatientEMR } from '../hooks/usePatientEMR.js';
import { localizeClinicalText } from '../utils/clinicalContentLocalization.js';

// Lazy load heavy sub-tabs
const AnamnesisTab = React.lazy(() => import('./emr/AnamnesisTab'));
const HistoryTab = React.lazy(() => import('./emr/HistoryTab'));
const PhysicalExamTab = React.lazy(() => import('./emr/PhysicalExamTab'));
const LabTab = React.lazy(() => import('./emr/LabTab'));
const AssessmentTab = React.lazy(() => import('./emr/AssessmentTab'));
const TreatmentTab = React.lazy(() => import('./emr/TreatmentTab'));
const ProceduresTab = React.lazy(() => import('./emr/ProceduresTab'));
const BillingTab = React.lazy(() => import('./emr/BillingTab'));
const EducationTab = React.lazy(() => import('./emr/EducationTab'));
import ClinicalSidebar from './emr/ClinicalSidebar.jsx';
import ReasoningDashboard from './emr/ReasoningDashboard.jsx';

export default function PatientEMR() {
    const emr = usePatientEMR();
    const { t, i18n } = useTranslation();
    const { isDark } = useTheme();
    const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(true);
    const [sidebarTab, setSidebarTab] = React.useState('insight');
    const [mobileTabGroup, setMobileTabGroup] = React.useState('clinical');

    const {
        patient, activeTab, setActiveTab,
        anamnesisCategory, setAnamnesisCategory,
        anamnesisHistory, setAnamnesisHistory,
        showAnamnesisHint, setShowAnamnesisHint,
        icdQuery, setIcdQuery,
        selectedDiagnoses, selectedMeds, selectedProcedures,
        maiaFeedback, medQuery, setMedQuery,
        icd9Query, setIcd9Query, eduQuery, setEduQuery,
        icd10SearchResults, icd9SearchResults,
        showClue, setShowClue, setShowValidation,
        showAnswer, setShowAnswer,
        selectedEducation, setSelectedEducation,
        hasAskedComplaint, setHasAskedComplaint,
        isProcessing, isSigned, setIsSigned,
        chatEndRef, examResultsRef,
        handleAskQuestion, handleInitialComplaint, handleExam,
        examsPerformed, labsRevealed, handleOrderLab,
        addDiagnosis, removeDiagnosis, toggleMed, updateMedConfig, toggleProcedure,
        handleEnrollProlanis, handleDischarge,
        diagnosticTracker, maiaAlerts, setMaiaAlerts,
        getDiagnosticConfidence, coverageScore,
        morningStatus, navigate, openWiki, prolanisRoster, updatePatient,
        anamnesisContext, history
    } = emr;

    React.useEffect(() => {
        if (['treatment', 'procedures', 'education', 'billing'].includes(activeTab)) {
            setMobileTabGroup('management');
        } else {
            setMobileTabGroup('clinical');
        }
    }, [activeTab]);

    // Pseudo-RM Number generator for clinical immersion
    const rmNumber = patient?.id
        ? (() => {
            const idStr = String(patient.id).replace(/\D/g, '').padStart(6, '0');
            return `RM-${idStr.substring(0, 2)}-${idStr.substring(2, 6)}`;
        })()
        : 'RM-00-0000';

    if (!patient) return null;

    const caseData = patient.medicalData;
    const social = patient.social || {};
    const isGroggy = morningStatus === 'groggy';
    const isObese = patient.anthropometrics?.bmiCategory?.includes('Obese');

    const locale = i18n.resolvedLanguage || i18n.language;
    const eduFiltered = eduQuery.length > 0 ? EDUCATION_OPTIONS.filter(e => {
        const localizedLabel = localizeClinicalText(e.label, locale).toLowerCase();
        const localizedCategory = localizeClinicalText(e.category, locale).toLowerCase();
        const query = eduQuery.toLowerCase();
        return localizedLabel.includes(query) || localizedCategory.includes(query) || e.label.toLowerCase().includes(query) || e.category.toLowerCase().includes(query);
    }) : null;
    const filteredMeds = medQuery.length > 1 ? searchMedications(medQuery, 20) : MEDICATION_DATABASE.slice(0, 15);
    const authoredTreatment = patient.hidden?.correctTreatment?.length
        ? patient.hidden.correctTreatment
        : (caseData?.correctTreatment || []);
    const suggestedMeds = [...new Set(authoredTreatment.flat())].map(id => getMedicationById(id)).filter(Boolean);

    const QUICK_CODEX_MAP = {
        'anamnesis': 'accuracy', 'physical': 'accuracy', 'labs': 'ukp_overview',
        'treatment': 'treatment', 'education': 'ukp_overview', 'billing': 'kbk'
    };

    // Data Presence Indicators for Tabs
    const hasData = {
        anamnesis: anamnesisHistory?.length > 0,
        history: history?.length > 0,
        physical: Object.keys(examsPerformed || {}).length > 0,
        labs: Object.keys(labsRevealed || {}).length > 0,
        assessment: selectedDiagnoses?.length > 0,
        treatment: selectedMeds?.length > 0,
        procedures: selectedProcedures?.length > 0,
        education: selectedEducation?.length > 0,
    };

    const sidebarTabs = [
        { id: 'insight', icon: Brain, label: t('patientEMR.sidebar.insight'), color: 'text-emerald-500' },
        { id: 'eval', icon: Activity, label: t('patientEMR.sidebar.evaluation'), color: 'text-indigo-500' },
        { id: 'cppt', icon: FileText, label: t('patientEMR.sidebar.cppt'), color: 'text-amber-500' }
    ];

    const EMR_TABS = [
        { key: 'anamnesis', icon: FileText, label: t('emr.anamnesis'), short: t('patientEMR.tabs.anamnesis_short') },
        { key: 'history', icon: Activity, label: t('patientEMR.tabs.history'), short: t('patientEMR.tabs.history_short') },
        { key: 'physical', icon: Stethoscope, label: t('emr.physical_exam'), short: t('patientEMR.tabs.physical_short') },
        { key: 'labs', icon: Microscope, label: t('emr.labs'), short: t('patientEMR.tabs.labs_short') },
        { key: 'assessment', icon: Brain, label: t('patientEMR.tabs.assessment'), short: t('patientEMR.tabs.assessment_short') },
        { key: 'treatment', icon: Pill, label: t('emr.treatment'), short: t('patientEMR.tabs.treatment_short') },
        { key: 'procedures', icon: Scissors, label: t('patientEMR.tabs.procedures'), short: t('patientEMR.tabs.procedures_short') },
        { key: 'education', icon: BookOpen, label: t('emr.education'), short: t('patientEMR.tabs.education_short') },
        { key: 'billing', icon: Receipt, label: t('emr.billing'), short: t('patientEMR.tabs.billing_short') },
    ];
    const mobileActionBarStyle = {
        bottom: 'calc(5.25rem + max(env(safe-area-inset-bottom, 0px), 0px))'
    };

    return (
        <div className={`p-2 md:p-4 h-full flex flex-col overflow-hidden relative transition-colors duration-1000 ${isDark ? 'bg-[#0B1120] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            
            {/* HIKMAT 5: Immersive Groggy Overlay */}
            {isGroggy && (
                <Motion.div 
                    className="pointer-events-none fixed inset-0 z-[100] mix-blend-multiply"
                    animate={{ backdropFilter: ['blur(0px) saturate(0.6)', 'blur(1.5px) saturate(0.3)', 'blur(0px) saturate(0.6)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: isDark ? 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)' : 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)' }}
                />
            )}

            {/* HIKMAT 1: HEADER (Clinical Telemetry Ribbon) */}
            <div className={`flex-shrink-0 flex flex-col xl:flex-row items-start xl:items-center gap-3 mb-2 p-3 md:px-4 md:py-3 rounded-xl border relative overflow-hidden z-10 transition-all shadow-sm backdrop-blur-md
                ${isDark ? 'bg-slate-900/80 border-slate-700/60 shadow-[0_4px_20px_rgba(16,185,129,0.05)]' : 'bg-white/90 border-slate-200'}`}
            >
                {/* Background Decor */}
                {isDark && <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />}

                {/* Identity & Avatar */}
                <div className="flex items-center gap-3 flex-1 w-full">
                    <div className="relative group">
                        <div style={getAvatarStyle(patient.age, patient.gender, 64)}
                             className={`w-14 h-14 md:w-[3.75rem] md:h-[3.75rem] border-2 rounded-full relative z-10 shadow-sm
                                ${isDark ? 'border-emerald-500/40 bg-slate-800' : 'border-slate-200 bg-slate-100'}`} />
                        {/* Pulse Ring */}
                        <div className={`absolute -inset-1 rounded-full animate-[spin_4s_linear_infinite] opacity-30 border-2 border-dashed
                            ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`font-mono text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                                <Fingerprint size={10} /> {rmNumber}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${social.isResident ? (isDark ? 'bg-emerald-900/50 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200') : (isDark ? 'bg-amber-900/40 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200')}`}>
                                {social.isResident ? t('patientEMR.badges.resident') : t('patientEMR.badges.visitor')}
                            </span>
                            {isGroggy && (
                                <span className="bg-amber-500/20 text-amber-500 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30 uppercase font-bold animate-pulse flex items-center gap-1">
                                    <AlertCircle size={10} /> {t('patientEMR.badges.groggy')}
                                </span>
                            )}
                        </div>
                        
                        <h2 className={`text-lg md:text-[1.35rem] font-black truncate tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {patient.name}
                        </h2>

                        {/* PATCH 1: Informant Badge (pediatric patients ≤7yo) */}
                        {patient.informant && patient.age <= 7 && (
                            <div className={`flex items-center gap-1.5 mt-1 text-[10px] px-2 py-1 rounded-lg border w-fit ${isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                                <User size={12} />
                                <span className="font-bold">{t('patientEMR.informant')}</span>
                                <span>{patient.informant.relation} {patient.informant.name}</span>
                            </div>
                        )}

                        {/* Vitals & Demographics */}
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] md:text-[11px] font-medium">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                <User size={12} className={isDark ? 'text-emerald-500' : 'text-emerald-600'} />
                                {t('queue.age_compact', { age: patient.age })} / {patient.gender}
                            </span>
                            
                            {patient.anthropometrics && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} ${isObese ? 'text-rose-500 font-bold' : ''}`}>
                                    <Scale size={12} className={isDark ? 'text-emerald-500' : 'text-emerald-600'} />
                                    <span className="font-mono">{patient.anthropometrics.height}</span>cm / <span className="font-mono">{patient.anthropometrics.weight}</span>kg
                                    {isObese && <AlertTriangle size={12} className="ml-0.5 animate-pulse" />}
                                </span>
                            )}
                            
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${social.hasBPJS
                                ? (isDark ? 'bg-teal-500/10 text-teal-300' : 'bg-teal-50 text-teal-700')
                                : (isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700')}`}>
                                <Shield size={12} /> {social.hasBPJS ? `BPJS ${social.bpjsClass}` : t('patientEMR.badges.general_payment')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop Top Actions */}
                <div className="hidden md:flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
                    {social.isResident && social.familyId && (
                        <button onClick={() => navigate('archive', { familyId: social.familyId })} className={`px-2.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}>
                            <BookOpen size={14} /> <span className="hidden xl:inline">{t('patientEMR.family_archive')}</span><span className="xl:hidden">{t('patientEMR.family_archive_short')}</span>
                        </button>
                    )}
                    <button onClick={() => openWiki(QUICK_CODEX_MAP[activeTab] || 'ukp_overview')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-900/20 transition-all active:scale-95 group">
                        <Brain size={14} className="group-hover:animate-pulse" /> <span className="hidden xl:inline">MAIA Codex</span><span className="xl:hidden">MAIA</span>
                    </button>
                </div>

                <div className="flex w-full flex-wrap gap-2 md:hidden">
                    <button
                        onClick={() => { setSidebarTab('insight'); setSidebarCollapsed(false); }}
                        className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-md shadow-emerald-900/20 transition-all active:scale-95"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Brain size={14} /> {t('patientEMR.maia_insight')}
                        </span>
                    </button>
                    {social.isResident && social.familyId && (
                        <button
                            onClick={() => navigate('archive', { familyId: social.familyId })}
                            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors border ${isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}
                        >
                            <span className="flex items-center gap-2">
                                <BookOpen size={14} /> {t('patientEMR.family_archive')}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className={`md:hidden mb-2 rounded-2xl border p-1 shadow-sm backdrop-blur-md ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-white/90'}`}>
                <div className="flex rounded-xl overflow-hidden mb-1">
                    <button onClick={() => setMobileTabGroup('clinical')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${mobileTabGroup === 'clinical' ? (isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800') : (isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>{t('patientEMR.mobile_groups.clinical')}</button>
                    <button onClick={() => setMobileTabGroup('management')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${mobileTabGroup === 'management' ? (isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800') : (isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100')}`}>{t('patientEMR.mobile_groups.management')}</button>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {EMR_TABS.filter(t => mobileTabGroup === 'clinical' ? ['anamnesis', 'history', 'physical', 'labs', 'assessment'].includes(t.key) : ['treatment', 'procedures', 'education', 'billing'].includes(t.key)).map(tab => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                title={tab.label}
                                className={`relative flex flex-1 flex-col items-center justify-center rounded-xl p-1.5 transition-all ${
                                    isActive
                                        ? (isDark ? 'text-emerald-400' : 'text-emerald-700')
                                        : (isDark ? 'text-slate-500 active:text-slate-300' : 'text-slate-400 active:text-slate-600')
                                }`}
                            >
                                {isActive && (
                                    <Motion.div layoutId="mobile-tab-pill" className={`absolute inset-0 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-200/50'}`} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                                )}
                                <tab.icon size={16} className="relative z-10 mb-0.5" />
                                <span className="relative z-10 text-[9px] font-bold tracking-tight">{tab.short}</span>
                                {hasData[tab.key] && !isActive && (
                                    <div className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MAIN EMR WORKSPACE */}
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden relative z-10">
                
                {/* LEFT: Clinical Worksheet Container */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    
                    {/* HIKMAT 2: Desktop EMR Tabs - flattened to reduce visual crowding */}
                    <div className={`hidden md:block px-1 pb-2 relative z-20 lg:px-2 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
                        <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar rounded-2xl border p-1 md:p-1.5 ${isDark ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 bg-slate-100/80'}`}>
                        {EMR_TABS.map(tab => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    title={tab.label}
                                    className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition-all duration-200 lg:gap-2 lg:px-3 lg:py-2 lg:text-xs
                                        ${isActive
                                            ? (isDark ? 'bg-emerald-500/15 text-emerald-300 shadow-sm ring-1 ring-emerald-500/30' : 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200')
                                            : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-white hover:text-slate-700')
                                        }`}
                                >
                                    <tab.icon size={14} className={isActive ? 'text-emerald-400' : 'opacity-70'} />
                                <span className="hidden 2xl:inline tracking-wide">{tab.label}</span>
                                <span className="2xl:hidden tracking-wide">{tab.short}</span>
                                    
                                    {/* Data Presence Dot Indicator */}
                                    {hasData[tab.key] && !isActive && (
                                        <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                                    )}
                                </button>
                            );
                        })}
                        </div>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className={`flex-1 relative overflow-hidden flex flex-col pb-40 md:pb-0 z-10 border rounded-xl md:rounded-tl-none shadow-lg
                        ${isDark ? 'bg-slate-900 border-slate-700 md:border-t-emerald-500/30' : 'bg-white border-slate-200 md:border-t-slate-300'}`}
                    >
                        {/* Global Processing Overlay */}
                        <AnimatePresence>
                            {isProcessing && (
                                <Motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className={`absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm ${isDark ? 'bg-slate-900/60' : 'bg-white/60'}`}
                                >
                                    <div className="w-12 h-12 border-4 border-slate-200/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest drop-shadow-sm">
                                        {isGroggy ? t('patientEMR.system_slowing') : t('patientEMR.processing')}
                                    </span>
                                </Motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 lg:p-5">
                            {/* Seamless Tab Transitions */}
                            <AnimatePresence mode="wait">
                                <Motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15, ease: "easeInOut" }}
                                    className="h-full"
                                >
                                    <React.Suspense fallback={
                                        <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                                            <Activity size={32} className="animate-pulse" />
                                        </div>
                                    }>
                                        {activeTab === 'anamnesis' && <AnamnesisTab patient={patient} isDark={isDark} anamnesisHistory={anamnesisHistory} setAnamnesisHistory={setAnamnesisHistory} anamnesisCategory={anamnesisCategory} setAnamnesisCategory={setAnamnesisCategory} hasAskedComplaint={hasAskedComplaint} setHasAskedComplaint={setHasAskedComplaint} handleAskQuestion={handleAskQuestion} chatEndRef={chatEndRef} showAnamnesisHint={showAnamnesisHint} setShowAnamnesisHint={setShowAnamnesisHint} caseData={caseData} isProcessing={isProcessing} updatePatient={updatePatient} maiaAlerts={maiaAlerts} setMaiaAlerts={setMaiaAlerts} diagnosticConfidence={getDiagnosticConfidence()} coverageScore={coverageScore} anamnesisContext={anamnesisContext} handleInitialComplaint={handleInitialComplaint} />}
                                        {activeTab === 'history' && <HistoryTab patient={patient} isDark={isDark} history={history} openWiki={openWiki} />}
                                        {activeTab === 'physical' && <PhysicalExamTab patient={patient} isDark={isDark} handleExam={handleExam} examsPerformed={examsPerformed} examResultsRef={examResultsRef} openWiki={openWiki} maiaSuggestions={maiaFeedback?.examLabSuggestions?.examSuggestions} anamnesisScore={maiaFeedback?.anamnesis?.score ?? 0} />}
                                        {activeTab === 'labs' && <LabTab patient={patient} isDark={isDark} labsRevealed={labsRevealed} handleOrderLab={handleOrderLab} caseData={caseData} openWiki={openWiki} maiaSuggestions={maiaFeedback?.examLabSuggestions?.labSuggestions} anamnesisScore={maiaFeedback?.anamnesis?.score ?? 0} />}
                                        {activeTab === 'assessment' && <AssessmentTab isDark={isDark} icdQuery={icdQuery} setIcdQuery={setIcdQuery} icdResults={icd10SearchResults} selectedDiagnoses={selectedDiagnoses} addDiagnosis={addDiagnosis} removeDiagnosis={removeDiagnosis} openWiki={openWiki} />}
                                        {activeTab === 'treatment' && <TreatmentTab patient={patient} isDark={isDark} medQuery={medQuery} setMedQuery={setMedQuery} filteredMeds={filteredMeds} suggestedMeds={suggestedMeds} selectedMeds={selectedMeds} toggleMed={toggleMed} updateMedConfig={updateMedConfig} isSigned={isSigned} setIsSigned={setIsSigned} openWiki={openWiki} />}
                                        {activeTab === 'procedures' && <ProceduresTab patient={patient} isDark={isDark} icd9Query={icd9Query} setIcd9Query={setIcd9Query} icd9Results={icd9SearchResults} selectedDiagnoses={selectedDiagnoses} selectedProcedures={selectedProcedures} toggleProcedure={toggleProcedure} openWiki={openWiki} />}
                                        {activeTab === 'education' && <EducationTab patient={patient} isDark={isDark} eduQuery={eduQuery} setEduQuery={setEduQuery} eduFiltered={eduFiltered} selectedDiagnoses={selectedDiagnoses} selectedEducation={selectedEducation} setSelectedEducation={setSelectedEducation} />}
                                        {activeTab === 'billing' && <BillingTab patient={patient} isDark={isDark} selectedMeds={selectedMeds} selectedProcedures={selectedProcedures} labsRevealed={labsRevealed} caseData={caseData} social={social} />}
                                    </React.Suspense>
                                </Motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* HIKMAT 3: AI Co-Pilot Drawer (Smart Sidebar untuk Desktop) */}
                <div className={`hidden md:flex flex-col relative h-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 ${isSidebarCollapsed ? 'w-14' : 'w-[clamp(16rem,24vw,20rem)] xl:w-[clamp(19rem,29vw,24rem)]'}`}>
                    
                    {/* Floating Vertical Rail (Dock) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-14 flex flex-col items-center py-4 gap-3 border rounded-l-2xl shadow-lg z-40 transition-colors
                        ${isDark ? 'bg-slate-800/90 border-slate-700 backdrop-blur-md' : 'bg-white border-slate-200'}`}>
                        
                        {sidebarTabs.map((tab) => {
                            const isActive = sidebarTab === tab.id && !isSidebarCollapsed;
                            return (
                                <button key={tab.id}
                                    onClick={() => {
                                        if (isActive) setSidebarCollapsed(true);
                                        else {
                                            setSidebarTab(tab.id); setSidebarCollapsed(false);
                                            if (tab.id === 'insight') { setShowClue(true); setShowValidation(false); }
                                            else if (tab.id === 'eval') { setShowClue(false); setShowValidation(true); }
                                            else { setShowClue(false); setShowValidation(false); }
                                        }
                                    }}
                                    className="relative group w-full flex justify-center py-2 outline-none"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                        ${isActive ? `${isDark ? 'bg-slate-900 shadow-inner' : 'bg-slate-100 shadow-inner'} scale-110` : 'hover:bg-slate-500/10'}`}>
                                        <tab.icon size={18} className={isActive ? tab.color : (isDark ? 'text-slate-500' : 'text-slate-400')} />
                                    </div>
                                    {isActive && (
                                        <Motion.div layoutId="sidebar-active-indicator" className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-current ${tab.color}`} />
                                    )}
                                    {/* Tooltip Hover */}
                                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Expand Toggle */}
                        <div className="mt-auto">
                            <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <ChevronRight size={18} className={`transform transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Sliding Content Drawer */}
                    <div className={`absolute top-0 bottom-0 left-14 right-0 border-y border-r rounded-r-2xl overflow-hidden transition-all duration-500 flex flex-col shadow-2xl
                        ${isDark ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl' : 'bg-slate-50 border-slate-200'}
                        ${isSidebarCollapsed ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {sidebarTab === 'insight' ? (
                                    <ReasoningDashboard patient={patient} isDark={isDark} coverageScore={coverageScore} diagnosticConfidence={getDiagnosticConfidence()} diagnosticTracker={diagnosticTracker} isSidebarCollapsed={isSidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} showClue={showClue} setShowClue={setShowClue} />
                                ) : (
                                    <ClinicalSidebar patient={patient} isDark={isDark} caseData={caseData} social={social} anamnesisHistory={anamnesisHistory} examsPerformed={examsPerformed} labsRevealed={labsRevealed} selectedDiagnoses={selectedDiagnoses} selectedMeds={selectedMeds} selectedProcedures={selectedProcedures} selectedEducation={selectedEducation} showClue={false} setShowClue={setShowClue} showValidation={sidebarTab === 'eval'} setShowValidation={setShowValidation} showAnswer={showAnswer} setShowAnswer={setShowAnswer} maiaFeedback={maiaFeedback} handleDischarge={handleDischarge} handleEnrollProlanis={handleEnrollProlanis} prolanisRoster={prolanisRoster} openWiki={openWiki} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HIKMAT 4: Mobile Ergonomics (Single Action Dock) */}
            <div className="md:hidden fixed inset-x-0 z-40 px-3" style={mobileActionBarStyle}>
                <div className={`rounded-2xl border px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleDischarge('refer')}
                            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] ${isDark ? 'bg-slate-800 border-rose-500/30 text-rose-400 active:bg-slate-700' : 'bg-rose-50 border-rose-200 text-rose-600 active:bg-rose-100'}`}
                        >
                            <span className="flex items-center justify-center gap-1.5">
                                <AlertCircle size={16} /> {t('emr.refer')}
                            </span>
                        </button>
                        <button
                            onClick={() => handleDischarge('treat')}
                            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98]"
                        >
                            <span className="flex items-center justify-center gap-1.5">
                                <CheckCircle2 size={16} /> {t('emr.discharge')}
                            </span>
                        </button>
                    </div>
                </div>
            
                {/* Mobile Sidebar: Bottom-Sheet Overlay */}
                <AnimatePresence>
                    {!isSidebarCollapsed && (
                        <Motion.div 
                            initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col justify-end"
                            onClick={() => setSidebarCollapsed(true)}
                        >
                            <div className={`h-[85vh] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-t border-slate-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                                {/* Drag Handle Marker */}
                                <div className="flex justify-center py-3 border-b border-slate-500/10">
                                    <div className="w-12 h-1.5 rounded-full bg-slate-500/30" />
                                </div>
                                
                                {/* Mobile Sidebar Segmented Control */}
                                <div className={`flex px-4 py-2 gap-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    {sidebarTabs.map((tab) => {
                                        const isActive = sidebarTab === tab.id;
                                        return (
                                            <button key={tab.id} onClick={() => {
                                                setSidebarTab(tab.id);
                                                if (tab.id === 'insight') { setShowClue(true); setShowValidation(false); }
                                                else if (tab.id === 'eval') { setShowClue(false); setShowValidation(true); }
                                                else { setShowClue(false); setShowValidation(false); }
                                            }} className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                                                <tab.icon size={14} /> {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Sidebar Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {sidebarTab === 'insight' ? (
                                        <ReasoningDashboard patient={patient} isDark={isDark} coverageScore={coverageScore} diagnosticConfidence={getDiagnosticConfidence()} diagnosticTracker={diagnosticTracker} isSidebarCollapsed={isSidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} showClue={showClue} setShowClue={setShowClue} />
                                    ) : (
                                        <ClinicalSidebar patient={patient} isDark={isDark} caseData={caseData} social={social} anamnesisHistory={anamnesisHistory} examsPerformed={examsPerformed} labsRevealed={labsRevealed} selectedDiagnoses={selectedDiagnoses} selectedMeds={selectedMeds} selectedProcedures={selectedProcedures} selectedEducation={selectedEducation} showClue={false} setShowClue={setShowClue} showValidation={sidebarTab === 'eval'} setShowValidation={setShowValidation} showAnswer={showAnswer} setShowAnswer={setShowAnswer} maiaFeedback={maiaFeedback} handleDischarge={handleDischarge} handleEnrollProlanis={handleEnrollProlanis} prolanisRoster={prolanisRoster} openWiki={openWiki} />
                                    )}
                                </div>
                            </div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>
            
        </div>
    );
}
