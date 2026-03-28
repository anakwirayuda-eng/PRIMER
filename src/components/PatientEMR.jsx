/**
 * @reflection
 * [IDENTITY]: PatientEMR
 * [PURPOSE]: React UI component: PatientEMR.
 * [STATE]: Polished & Immersive Medical UI/UX
 * [ANCHOR]: PatientEMR
 * [DEPENDS_ON]: ThemeContext, EducationOptions, MedicationDatabase, AvatarUtils, usePatientEMR, ClinicalSidebar, ReasoningDashboard
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const { isDark } = useTheme();
    const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(true);
    const [sidebarTab, setSidebarTab] = React.useState('insight');

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
        showClue, setShowClue, showValidation, setShowValidation,
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

    if (!patient) return null;

    const caseData = patient.medicalData;
    const social = patient.social || {};
    const isGroggy = morningStatus === 'groggy';
    const isObese = patient.anthropometrics?.bmiCategory?.includes('Obese');

    // Pseudo-RM Number generator for clinical immersion
    const rmNumber = useMemo(() => {
        const idStr = String(patient.id).replace(/\D/g, '').padStart(6, '0');
        return `RM-${idStr.substring(0,2)}-${idStr.substring(2,6)}`;
    }, [patient.id]);

    const eduFiltered = eduQuery.length > 0 ? EDUCATION_OPTIONS.filter(e => e.label.toLowerCase().includes(eduQuery.toLowerCase()) || e.category.toLowerCase().includes(eduQuery.toLowerCase())) : null;
    const filteredMeds = medQuery.length > 1 ? searchMedications(medQuery, 20) : MEDICATION_DATABASE.slice(0, 15);
    const suggestedMeds = [...new Set((patient.hidden?.correctTreatment || []).flat())].map(id => getMedicationById(id)).filter(Boolean);

    const QUICK_CODEX_MAP = {
        'anamnesis': 'accuracy', 'physical': 'accuracy', 'labs': 'ukp_overview',
        'treatment': 'treatment', 'education': 'ukp_overview', 'billing': 'kbk'
    };

    // Data Presence Indicators for Tabs
    const hasData = {
        anamnesis: anamnesisHistory?.length > 0,
        history: history?.length > 0,
        physical: examsPerformed?.length > 0,
        labs: labsRevealed?.length > 0,
        assessment: selectedDiagnoses?.length > 0,
        treatment: selectedMeds?.length > 0,
        procedures: selectedProcedures?.length > 0,
        education: selectedEducation?.length > 0,
    };

    const EMR_TABS = [
        { key: 'anamnesis', icon: FileText, label: 'Anamnesis', short: 'Anamn' },
        { key: 'history', icon: Activity, label: 'Riwayat', short: 'Riwayat' },
        { key: 'physical', icon: Stethoscope, label: 'P. Fisik', short: 'Fisik' },
        { key: 'labs', icon: Microscope, label: 'Lab', short: 'Lab' },
        { key: 'assessment', icon: Brain, label: 'Diagnosa', short: 'Dx' },
        { key: 'treatment', icon: Pill, label: 'Terapi', short: 'Obat' },
        { key: 'procedures', icon: Scissors, label: 'Tindakan', short: 'Tndkn' },
        { key: 'education', icon: BookOpen, label: 'Edukasi', short: 'Edukasi' },
        { key: 'billing', icon: Receipt, label: 'Billing', short: 'Billing' },
    ];

    return (
        <div className={`p-2 md:p-4 h-full flex flex-col overflow-hidden relative transition-colors duration-1000 ${isDark ? 'bg-[#0B1120] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            
            {/* HIKMAT 5: Immersive Groggy Overlay */}
            {isGroggy && (
                <motion.div 
                    className="pointer-events-none fixed inset-0 z-[100] mix-blend-multiply"
                    animate={{ backdropFilter: ['blur(0px) saturate(0.6)', 'blur(1.5px) saturate(0.3)', 'blur(0px) saturate(0.6)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: isDark ? 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)' : 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)' }}
                />
            )}

            {/* HIKMAT 1: HEADER (Clinical Telemetry Ribbon) */}
            <div className={`flex-shrink-0 flex flex-col md:flex-row items-start md:items-center gap-4 mb-3 p-3 md:p-4 rounded-xl border relative overflow-hidden z-10 transition-all shadow-sm backdrop-blur-md
                ${isDark ? 'bg-slate-900/80 border-slate-700/60 shadow-[0_4px_20px_rgba(16,185,129,0.05)]' : 'bg-white/90 border-slate-200'}`}
            >
                {/* Background Decor */}
                {isDark && <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />}

                {/* Identity & Avatar */}
                <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    <div className="relative group">
                        <div style={getAvatarStyle(patient.age, patient.gender, 64)}
                             className={`w-14 h-14 md:w-16 md:h-16 border-2 rounded-full relative z-10 shadow-sm
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
                                {social.isResident ? 'Warga Tetap' : 'Pendatang'}
                            </span>
                            {isGroggy && (
                                <span className="bg-amber-500/20 text-amber-500 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30 uppercase font-bold animate-pulse flex items-center gap-1">
                                    <AlertCircle size={10} /> Groggy
                                </span>
                            )}
                        </div>
                        
                        <h2 className={`text-lg md:text-xl font-black truncate tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {patient.name}
                        </h2>

                        {/* PATCH 1: Informant Badge (pediatric patients ≤7yo) */}
                        {patient.informant && patient.age <= 7 && (
                            <div className={`flex items-center gap-1.5 mt-1 text-[10px] px-2 py-1 rounded-lg border w-fit ${isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                                <User size={12} />
                                <span className="font-bold">Diantar:</span>
                                <span>{patient.informant.relation} {patient.informant.name}</span>
                            </div>
                        )}

                        {/* Vitals & Demographics */}
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] md:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1"><User size={12} className={isDark ? "text-emerald-500" : "text-emerald-600"} /> <span className="font-mono font-bold">{patient.age}</span> th / {patient.gender}</span>
                            
                            {patient.anthropometrics && (
                                <span className={`flex items-center gap-1 ${isObese ? 'text-rose-500 font-bold' : ''}`}>
                                    <Scale size={12} className={isDark ? "text-emerald-500" : "text-emerald-600"} />
                                    <span className="font-mono">{patient.anthropometrics.height}</span>cm / <span className="font-mono">{patient.anthropometrics.weight}</span>kg
                                    {isObese && <AlertTriangle size={12} className="ml-0.5 animate-pulse" />}
                                </span>
                            )}
                            
                            <span className={`flex items-center gap-1 font-bold ${social.hasBPJS ? 'text-teal-500' : 'text-amber-500'}`}>
                                <Shield size={12} /> {social.hasBPJS ? `BPJS ${social.bpjsClass}` : 'UMUM'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop Top Actions */}
                <div className="hidden md:flex items-center gap-2">
                    {social.isResident && social.familyId && (
                        <button onClick={() => navigate('archive', { familyId: social.familyId })} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}>
                            <BookOpen size={14} /> Berkas KK
                        </button>
                    )}
                    <button onClick={() => openWiki(QUICK_CODEX_MAP[activeTab] || 'ukp_overview')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-black flex items-center gap-2 shadow-md shadow-emerald-900/20 transition-all active:scale-95 group">
                        <Brain size={14} className="group-hover:animate-pulse" /> MAIA Codex
                    </button>
                </div>
            </div>

            {/* MAIN EMR WORKSPACE */}
            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden relative z-10">
                
                {/* LEFT: Clinical Worksheet Container */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    
                    {/* HIKMAT 2: Desktop Folder Tabs & Data Indicators */}
                    <div className="hidden md:flex items-end px-2 gap-1 overflow-x-auto no-scrollbar relative z-20">
                        {EMR_TABS.map(tab => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200 rounded-t-xl border-t border-x
                                        ${isActive 
                                            ? (isDark ? 'bg-slate-900 border-emerald-500/40 text-emerald-400 z-30 h-10 pb-3 -mb-1 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]' : 'bg-white border-slate-300 text-emerald-700 z-30 h-10 pb-3 -mb-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]')
                                            : (isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300 z-10 h-8 mt-2' : 'bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 z-10 h-8 mt-2')}
                                    `}
                                >
                                    <tab.icon size={14} className={isActive ? 'text-emerald-500' : 'opacity-70'} />
                                    <span className="tracking-wide uppercase">{tab.label}</span>
                                    
                                    {/* Data Presence Dot Indicator */}
                                    {hasData[tab.key] && !isActive && (
                                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                                    )}

                                    {/* Active Tab Overlap Line */}
                                    {isActive && (
                                        <motion.div layoutId="desktop-active-tab-glow" className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-emerald-500" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dynamic Content Area */}
                    <div className={`flex-1 relative overflow-hidden flex flex-col pb-28 md:pb-0 z-10 border rounded-xl md:rounded-tl-none shadow-lg
                        ${isDark ? 'bg-slate-900 border-slate-700 md:border-t-emerald-500/30' : 'bg-white border-slate-200 md:border-t-slate-300'}`}
                    >
                        {/* Global Processing Overlay */}
                        <AnimatePresence>
                            {isProcessing && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className={`absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm ${isDark ? 'bg-slate-900/60' : 'bg-white/60'}`}
                                >
                                    <div className="w-12 h-12 border-4 border-slate-200/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest drop-shadow-sm">
                                        {isGroggy ? 'Sistem Melambat...' : 'Memproses Data...'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5">
                            {/* Seamless Tab Transitions */}
                            <AnimatePresence mode="wait">
                                <motion.div
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
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* HIKMAT 3: AI Co-Pilot Drawer (Smart Sidebar untuk Desktop) */}
                <div className={`hidden md:flex flex-col relative h-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 ${isSidebarCollapsed ? 'w-14' : 'w-[420px]'}`}>
                    
                    {/* Floating Vertical Rail (Dock) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-14 flex flex-col items-center py-4 gap-3 border rounded-l-2xl shadow-lg z-40 transition-colors
                        ${isDark ? 'bg-slate-800/90 border-slate-700 backdrop-blur-md' : 'bg-white border-slate-200'}`}>
                        
                        {[
                            { id: 'insight', icon: Brain, label: 'Insight', color: 'text-emerald-500' },
                            { id: 'eval', icon: Activity, label: 'Evaluasi', color: 'text-indigo-500' },
                            { id: 'cppt', icon: FileText, label: 'CPPT', color: 'text-amber-500' }
                        ].map((tab) => {
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
                                        <motion.div layoutId="sidebar-active-indicator" className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-current ${tab.color}`} />
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

            {/* HIKMAT 4: Mobile Ergonomics (Action Tier & Bottom Nav) */}
            <div className="md:hidden">
                
                {/* Layer 1: Thumb-Zone Action Tier (Above Tabs) */}
                <div className={`fixed bottom-[64px] inset-x-0 z-40 px-3 py-2 flex items-center justify-between gap-2 border-t shadow-[0_-5px_20px_rgba(0,0,0,0.1)]
                    ${isDark ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'}`}>
                    
                    {/* Open MAIA Mobile Button */}
                    <button onClick={() => { setSidebarTab('insight'); setSidebarCollapsed(false); }}
                        className={`p-2 rounded-xl transition-all shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Brain size={20} />
                    </button>

                    {/* PATCH 3: Mobile KK shortcut for residents */}
                    {social.isResident && social.familyId && (
                        <button onClick={() => navigate('archive', { familyId: social.familyId })}
                            className={`flex items-center gap-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95
                                ${isDark ? 'bg-teal-600/20 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                            <BookOpen size={14} /> KK
                        </button>
                    )}
                    
                    {/* Critical Actions */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <button onClick={() => handleDischarge('refer')}
                            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                                ${isDark ? 'bg-slate-800 border-rose-500/30 text-rose-400 active:bg-slate-700' : 'bg-rose-50 border-rose-200 text-rose-600 active:bg-rose-100'}`}>
                            <AlertCircle size={14} /> Rujuk
                        </button>
                        <button onClick={() => handleDischarge('treat')}
                            className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 shadow-md shadow-emerald-900/20 active:scale-95 transition-all">
                            <CheckCircle2 size={16} /> Pulangkan
                        </button>
                    </div>
                </div>

                {/* Layer 2: Bottom Horizontal Tab Bar */}
                <nav className={`fixed bottom-0 inset-x-0 z-50 flex flex-col pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)]
                    ${isDark ? 'bg-slate-950 border-t border-slate-800' : 'bg-slate-100 border-t border-slate-200'}`}>
                    
                    <div className="relative w-full">
                        <div className="flex items-center overflow-x-auto no-scrollbar py-2 px-2 gap-1 scroll-smooth">
                            {EMR_TABS.map(tab => {
                                const isActive = activeTab === tab.key;
                                return (
                                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                        className={`relative flex flex-col items-center justify-center p-2 rounded-xl min-w-[4rem] transition-all
                                            ${isActive ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-slate-500 active:text-slate-400' : 'text-slate-400 active:text-slate-600')}`}
                                    >
                                        {/* Active Pill Highlights */}
                                        {isActive && (
                                            <motion.div layoutId="mobile-tab-pill" className={`absolute inset-0 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-200/50'}`} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                                        )}
                                        
                                        <tab.icon size={20} className="relative z-10 mb-0.5" />
                                        <span className="text-[10px] font-bold tracking-tight relative z-10">{tab.short}</span>
                                        
                                        {/* Data Indicator Dot for Mobile */}
                                        {hasData[tab.key] && !isActive && (
                                            <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Scroll hint gradients */}
                        <div className={`absolute right-0 top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l ${isDark ? 'from-slate-950/90' : 'from-slate-100/90'} to-transparent`} />
                    </div>
                </nav>

                {/* Mobile Sidebar: Bottom-Sheet Overlay */}
                <AnimatePresence>
                    {!isSidebarCollapsed && (
                        <motion.div 
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
                                    {[
                                        { id: 'insight', label: 'MAIA Insight', icon: Brain },
                                        { id: 'eval', label: 'Evaluasi', icon: Activity },
                                        { id: 'cppt', label: 'CPPT', icon: FileText }
                                    ].map(t => {
                                        const isActive = sidebarTab === t.id;
                                        return (
                                            <button key={t.id} onClick={() => {
                                                setSidebarTab(t.id);
                                                if (t.id === 'insight') { setShowClue(true); setShowValidation(false); }
                                                else if (t.id === 'eval') { setShowClue(false); setShowValidation(true); }
                                                else { setShowClue(false); setShowValidation(false); }
                                            }} className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                                                <t.icon size={14} /> {t.label}
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
        </div>
    );
}
