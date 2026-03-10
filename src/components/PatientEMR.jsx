/**
 * @reflection
 * [IDENTITY]: PatientEMR
 * [PURPOSE]: React UI component: PatientEMR.
 * [STATE]: Experimental
 * [ANCHOR]: PatientEMR
 * [DEPENDS_ON]: ThemeContext, EducationOptions, MedicationDatabase, AvatarUtils, usePatientEMR, ClinicalSidebar, ReasoningDashboard
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { User, Shield, Brain, Microscope, Stethoscope, FileText, Activity, Pill, Scissors, BookOpen, Receipt, Scale } from 'lucide-react';
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
    const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(true); // Default collapsed
    const [sidebarTab, setSidebarTab] = React.useState('insight'); // 'insight', 'eval', 'cppt'

    const {
        patient, activeTab, setActiveTab,
        anamnesisCategory, setAnamnesisCategory,
        anamnesisHistory, setAnamnesisHistory,
        showAnamnesisHint, setShowAnamnesisHint,
        icdQuery, setIcdQuery,
        selectedDiagnoses,
        selectedMeds,
        selectedProcedures,
        maiaFeedback,
        medQuery, setMedQuery,
        icd9Query, setIcd9Query,
        eduQuery, setEduQuery,
        icd10SearchResults,
        icd9SearchResults,
        showClue, setShowClue,
        showValidation: _showValidation, setShowValidation, // Restored missing state
        showAnswer, setShowAnswer,
        selectedEducation, setSelectedEducation,
        hasAskedComplaint, setHasAskedComplaint,
        isProcessing,
        isSigned, setIsSigned,
        chatEndRef,
        examResultsRef,
        handleAskQuestion,
        handleInitialComplaint,
        handleExam,
        examsPerformed,
        labsRevealed,
        handleOrderLab,
        addDiagnosis,
        removeDiagnosis,
        toggleMed,
        updateMedConfig,
        toggleProcedure,
        handleEnrollProlanis,
        handleDischarge,
        // Sprint 2: Clinical Reasoning
        diagnosticTracker, maiaAlerts, setMaiaAlerts,
        getDiagnosticConfidence, coverageScore,
        morningStatus, navigate,
        openWiki, prolanisRoster, updatePatient,
        anamnesisContext, history
    } = emr;

    if (!patient) return null;

    const caseData = patient.medicalData;
    const social = patient.social || {};

    const eduFiltered = eduQuery.length > 0
        ? EDUCATION_OPTIONS.filter(e => e.label.toLowerCase().includes(eduQuery.toLowerCase()) || e.category.toLowerCase().includes(eduQuery.toLowerCase()))
        : null;

    const filteredMeds = medQuery.length > 1
        ? searchMedications(medQuery, 20)
        : MEDICATION_DATABASE.slice(0, 15);

    // Extract suggested meds from patient data
    const suggestedMedIds = (patient.hidden?.correctTreatment || []).flat();
    const suggestedMeds = [...new Set(suggestedMedIds)].map(id => getMedicationById(id)).filter(Boolean);

    const QUICK_CODEX_MAP = {
        'anamnesis': 'accuracy',
        'physical': 'accuracy',
        'labs': 'ukp_overview',
        'treatment': 'treatment',
        'education': 'ukp_overview',
        'billing': 'kbk'
    };


    return (
        <div className={`p-4 h-full flex flex-col overflow-y-auto ${isDark ? 'bg-slate-950' : 'bg-slate-50'} transition-colors`}>
            {/* Header with Avatar */}
            <div className={`flex items-start gap-3 md:gap-4 mb-2 md:mb-4 ${isDark ? 'bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white shadow-sm'} p-3 md:p-4 rounded-xl border ${isDark ? 'border-emerald-500/20' : 'border-slate-200'} relative overflow-hidden transition-all backdrop-blur-md`}>
                {/* Futuristic Glow Backdrop */}
                {isDark && (
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                )}

                <div
                    style={getAvatarStyle(patient.age, patient.gender, 80)}
                    className={`flex-shrink-0 relative z-10 w-12 h-12 md:w-20 md:h-20 border-4 ${isDark ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-100 shadow-md'} rounded-full bg-slate-50`}
                />
                <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className={`text-base md:text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'} flex items-center gap-2 mb-1 tracking-tight`}>
                                {patient.name}
                                {social.isResident ? (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-black ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-teal-100 text-teal-700 border-teal-200'}`}>
                                        Warga Desa
                                    </span>
                                ) : (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-black ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        Pengunjung
                                    </span>
                                )}
                                {morningStatus === 'groggy' && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider font-bold">
                                        😵 Groggy
                                    </span>
                                )}
                            </h2>
                            {/* Informant Badge */}
                            {patient.informant && patient.age <= 7 && (
                                <div className={`flex items-center gap-1.5 mt-1 text-[10px] px-2 py-1 rounded-lg border w-fit ${isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                                    <User size={12} />
                                    <span className="font-bold">Diantar:</span>
                                    <span>{patient.informant.relation} {patient.informant.name}</span>
                                </div>
                            )}
                            <div className={`flex flex-wrap items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs mt-1.5 opacity-90`}>
                                <span className="flex items-center gap-1 font-medium"><User size={14} className="text-emerald-500" /> {patient.age}th / {patient.gender}</span>
                                {patient.anthropometrics && (
                                    <span className={`flex items-center gap-1 font-medium ${patient.anthropometrics.bmiCategory?.includes('Obese') ? 'text-red-500 font-black' : ''}`}>
                                        <Scale size={14} className="text-emerald-500" />
                                        {patient.anthropometrics.height}cm / {patient.anthropometrics.weight}kg
                                        <span className="ml-1 opacity-70">(BMI {patient.anthropometrics.bmi})</span>
                                    </span>
                                )}
                                <span className={`flex items-center gap-1 font-bold ${social.hasBPJS ? 'text-cyan-500' : 'text-orange-500'}`}>
                                    <Shield size={14} /> {social.hasBPJS ? social.bpjsClass : 'Pasien Umum'}
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => openWiki(QUICK_CODEX_MAP[activeTab] || 'ukp_overview')}
                                className={`${isDark ? 'bg-emerald-600 shadow-emerald-900/40 hover:bg-emerald-500' : 'bg-indigo-600'} text-white px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 group`}
                            >
                                <Brain size={14} className="group-hover:animate-pulse" />
                                MAIA Wiki
                            </button>
                            {social.isResident && social.familyId && (
                                <button
                                    onClick={() => navigate('archive', { familyId: social.familyId })}
                                    className={`${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-teal-200 text-teal-700 hover:bg-teal-50'} border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors`}
                                >
                                    <BookOpen size={14} />
                                    Data Keluarga
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
                {/* Left: Clinical Worksheet */}
                <div className="flex-1 flex flex-col gap-3 min-h-0 min-w-0 transition-all duration-500 ease-in-out">
                    {/* Folder Tip Tabs — desktop only */}
                    <div className="hidden md:flex items-end px-2 gap-1 overflow-x-auto snap-x snap-mandatory no-scrollbar translate-y-[1px] relative z-20">
                        {[
                            { key: 'anamnesis', icon: FileText, label: 'Anamnesis' },
                            { key: 'history', icon: Activity, label: 'Riwayat' },
                            { key: 'physical', icon: Stethoscope, label: 'Fisik' },
                            { key: 'labs', icon: Microscope, label: 'Laboratorium' },
                            { key: 'assessment', icon: Brain, label: 'Diagnosa' },
                            { key: 'treatment', icon: Pill, label: 'Medikamentosa' },
                            { key: 'procedures', icon: Scissors, label: 'Tindakan' },
                            { key: 'education', icon: BookOpen, label: 'Edukasi' },
                            { key: 'billing', icon: Receipt, label: 'Billing' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    snap-start relative flex items-center gap-2 px-5 py-2.5 text-xs font-black transition-all duration-300
                                    rounded-t-2xl border-t border-x
                                    ${activeTab === tab.key
                                        ? (isDark
                                            ? 'bg-slate-900 border-emerald-500/40 text-emerald-400 z-30 h-11 shadow-[0_-8px_15px_-3px_rgba(16,185,129,0.15)] translate-y-[2px]'
                                            : 'bg-white border-slate-300 text-emerald-700 z-30 h-11 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] translate-y-[2px]')
                                        : (isDark
                                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 h-9 opacity-80 mt-2'
                                            : 'bg-slate-100/90 border-slate-200 text-slate-500 hover:bg-slate-50 h-9 opacity-80 mt-2')
                                    }
                                `}
                            >
                                <tab.icon size={13} className={activeTab === tab.key ? 'animate-bounce text-emerald-500' : ''} />
                                <span className="hidden lg:inline uppercase tracking-wider">{tab.label}</span>

                                {activeTab === tab.key && (
                                    <>
                                        {/* Bottom seamless connection */}
                                        <div className={`absolute -bottom-[3px] left-[1px] right-[1px] h-[5px] ${isDark ? 'bg-slate-900' : 'bg-white'} z-40`} />
                                        {/* Premium Glow indicator */}
                                        <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${isDark ? 'bg-emerald-500/50' : 'bg-emerald-500/30'}`} />
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div
                        key={activeTab}
                        className={`${isDark ? 'bg-slate-900 border-slate-700 shadow-emerald-900/10' : 'bg-white border-slate-200'} p-4 md:rounded-b-xl shadow-lg md:border-t-0 border flex-1 overflow-y-auto relative animate-fadeIn pb-20 md:pb-4`}
                    >
                        {isProcessing && (
                            <div className={`absolute inset-0 ${isDark ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-[1px] z-50 flex flex-col items-center justify-center`}>
                                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    {morningStatus === 'groggy' ? 'Sedang Ngumpulin Nyawa...' : 'Berpikir...'}
                                </span>
                            </div>
                        )}

                        <React.Suspense fallback={
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                                <Activity size={32} className="animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider">Memuat Modul...</span>
                            </div>
                        }>
                            {activeTab === 'anamnesis' && (
                                <AnamnesisTab
                                    patient={patient}
                                    isDark={isDark}
                                    anamnesisHistory={anamnesisHistory}
                                    setAnamnesisHistory={setAnamnesisHistory}
                                    anamnesisCategory={anamnesisCategory}
                                    setAnamnesisCategory={setAnamnesisCategory}
                                    hasAskedComplaint={hasAskedComplaint}
                                    setHasAskedComplaint={setHasAskedComplaint}
                                    handleAskQuestion={handleAskQuestion}
                                    chatEndRef={chatEndRef}
                                    showAnamnesisHint={showAnamnesisHint}
                                    setShowAnamnesisHint={setShowAnamnesisHint}
                                    caseData={caseData}
                                    isProcessing={isProcessing}
                                    updatePatient={updatePatient}
                                    maiaAlerts={maiaAlerts}
                                    setMaiaAlerts={setMaiaAlerts}
                                    diagnosticConfidence={getDiagnosticConfidence()}
                                    coverageScore={coverageScore}
                                    anamnesisContext={anamnesisContext}
                                    handleInitialComplaint={handleInitialComplaint}
                                />
                            )}
                            {activeTab === 'history' && (
                                <HistoryTab
                                    patient={patient}
                                    isDark={isDark}
                                    history={history}
                                    openWiki={openWiki}
                                />
                            )}
                            {activeTab === 'physical' && (
                                <PhysicalExamTab
                                    patient={patient}
                                    isDark={isDark}
                                    handleExam={handleExam}
                                    examsPerformed={examsPerformed}
                                    examResultsRef={examResultsRef}
                                    openWiki={openWiki}
                                    maiaSuggestions={maiaFeedback?.examLabSuggestions?.examSuggestions}
                                    anamnesisScore={maiaFeedback?.anamnesis?.score ?? 0}
                                />
                            )}
                            {activeTab === 'labs' && (
                                <LabTab
                                    patient={patient}
                                    isDark={isDark}
                                    labsRevealed={labsRevealed}
                                    handleOrderLab={handleOrderLab}
                                    caseData={caseData}
                                    openWiki={openWiki}
                                    maiaSuggestions={maiaFeedback?.examLabSuggestions?.labSuggestions}
                                    anamnesisScore={maiaFeedback?.anamnesis?.score ?? 0}
                                />
                            )}
                            {activeTab === 'assessment' && (
                                <AssessmentTab
                                    isDark={isDark}
                                    icdQuery={icdQuery}
                                    setIcdQuery={setIcdQuery}
                                    icdResults={icd10SearchResults}
                                    selectedDiagnoses={selectedDiagnoses}
                                    addDiagnosis={addDiagnosis}
                                    removeDiagnosis={removeDiagnosis}
                                    openWiki={openWiki}
                                />
                            )}
                            {activeTab === 'treatment' && (
                                <TreatmentTab
                                    patient={patient}
                                    isDark={isDark}
                                    medQuery={medQuery}
                                    setMedQuery={setMedQuery}
                                    filteredMeds={filteredMeds}
                                    suggestedMeds={suggestedMeds}
                                    selectedMeds={selectedMeds}
                                    toggleMed={toggleMed}
                                    updateMedConfig={updateMedConfig}
                                    isSigned={isSigned}
                                    setIsSigned={setIsSigned}
                                    openWiki={openWiki}
                                />
                            )}
                            {activeTab === 'procedures' && (
                                <ProceduresTab
                                    patient={patient}
                                    isDark={isDark}
                                    icd9Query={icd9Query}
                                    setIcd9Query={setIcd9Query}
                                    icd9Results={icd9SearchResults}
                                    selectedDiagnoses={selectedDiagnoses}
                                    selectedProcedures={selectedProcedures}
                                    toggleProcedure={toggleProcedure}
                                    openWiki={openWiki}
                                />
                            )}
                            {activeTab === 'education' && (
                                <EducationTab
                                    patient={patient}
                                    isDark={isDark}
                                    eduQuery={eduQuery}
                                    setEduQuery={setEduQuery}
                                    eduFiltered={eduFiltered}
                                    selectedDiagnoses={selectedDiagnoses}
                                    selectedEducation={selectedEducation}
                                    setSelectedEducation={setSelectedEducation}
                                />
                            )}
                            {activeTab === 'billing' && (
                                <BillingTab
                                    patient={patient}
                                    isDark={isDark}
                                    selectedMeds={selectedMeds}
                                    selectedProcedures={selectedProcedures}
                                    labsRevealed={labsRevealed}
                                    caseData={caseData}
                                    social={social}
                                />
                            )}
                        </React.Suspense>
                    </div>
                </div>

                {/* Right Panel: RESUME MEDIS / REASONING / MAIA */}
                <div
                    className={`flex flex-col min-h-0 relative transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'w-12' : 'w-[400px] shadow-2xl'}`}
                >

                    {/* Folder Tabs (Vertical Stack on the left edge of sidebar) */}
                    <div className="absolute left-0 top-[10%] flex flex-col gap-1 z-20">
                        {[
                            { id: 'insight', icon: Brain, label: 'MAIA Insight', color: 'bg-emerald-500' },
                            { id: 'eval', icon: Activity, label: 'Evaluasi MAIA', color: 'bg-indigo-500' },
                            { id: 'cppt', icon: FileText, label: 'Resume CPPT', color: 'bg-amber-500' }
                        ].map((tab) => {
                            const isActive = sidebarTab === tab.id && !isSidebarCollapsed;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (sidebarTab === tab.id && !isSidebarCollapsed) {
                                            setSidebarCollapsed(true);
                                        } else {
                                            setSidebarTab(tab.id);
                                            setSidebarCollapsed(false);

                                            // Handling state triggers for specific views
                                            if (tab.id === 'insight') {
                                                setShowClue(true); // Always show clues in insight
                                                setShowValidation(false);
                                            } else if (tab.id === 'eval') {
                                                setShowClue(false);
                                                setShowValidation(true); // Always show validation in evaluation
                                            } else if (tab.id === 'cppt') {
                                                setShowClue(false);
                                                setShowValidation(false);
                                            }
                                        }
                                    }}
                                    className={`relative w-12 h-16 flex items-center justify-center transition-all duration-300 group
                                        ${isActive ? 'w-14 -left-2 z-30' : 'w-12 hover:w-14 hover:-left-2 z-10'}
                                    `}
                                    style={{
                                        clipPath: 'polygon(100% 0, 15% 0, 0 15%, 0 85%, 15% 100%, 100% 100%)',
                                        backgroundColor: isActive
                                            ? (isDark ? 'rgba(30, 41, 59, 0.9)' : '#fff')
                                            : (isDark ? 'rgba(15, 23, 42, 0.8)' : '#f1f5f9')
                                    }}
                                >
                                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${isActive ? tab.color : 'bg-slate-500/30'}`} />
                                    <tab.icon size={18} className={`${isActive ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : 'text-slate-400 group-hover:text-slate-200'}`} />

                                    {/* Tooltip on Hover */}
                                    <div className="absolute right-full mr-2 px-2 py-1 rounded bg-slate-800 text-[9px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                                        {tab.label}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sidebar Content Container */}
                    {!isSidebarCollapsed && (
                        <div className={`flex-1 flex flex-col gap-3 min-h-0 glass-morphism border-l ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} ml-12 overflow-hidden transition-all duration-500`}>
                            {sidebarTab === 'insight' ? (
                                <ReasoningDashboard
                                    patient={patient}
                                    isDark={isDark}
                                    coverageScore={coverageScore}
                                    diagnosticConfidence={getDiagnosticConfidence()}
                                    diagnosticTracker={diagnosticTracker}
                                    isSidebarCollapsed={isSidebarCollapsed}
                                    setSidebarCollapsed={setSidebarCollapsed}
                                    showClue={showClue}
                                    setShowClue={setShowClue}
                                />
                            ) : sidebarTab === 'eval' ? (
                                <ClinicalSidebar
                                    patient={patient}
                                    isDark={isDark}
                                    caseData={caseData}
                                    social={social}
                                    anamnesisHistory={anamnesisHistory}
                                    examsPerformed={examsPerformed}
                                    labsRevealed={labsRevealed}
                                    selectedDiagnoses={selectedDiagnoses}
                                    selectedMeds={selectedMeds}
                                    selectedProcedures={selectedProcedures}
                                    selectedEducation={selectedEducation}
                                    showClue={false}
                                    setShowClue={setShowClue}
                                    showValidation={true}
                                    setShowValidation={setShowValidation}
                                    showAnswer={showAnswer}
                                    setShowAnswer={setShowAnswer}
                                    maiaFeedback={maiaFeedback}
                                    handleDischarge={handleDischarge}
                                    handleEnrollProlanis={handleEnrollProlanis}
                                    prolanisRoster={prolanisRoster}
                                    openWiki={openWiki}
                                />
                            ) : (
                                <ClinicalSidebar
                                    patient={patient}
                                    isDark={isDark}
                                    caseData={caseData}
                                    social={social}
                                    anamnesisHistory={anamnesisHistory}
                                    examsPerformed={examsPerformed}
                                    labsRevealed={labsRevealed}
                                    selectedDiagnoses={selectedDiagnoses}
                                    selectedMeds={selectedMeds}
                                    selectedProcedures={selectedProcedures}
                                    selectedEducation={selectedEducation}
                                    showClue={false}
                                    setShowClue={setShowClue}
                                    showValidation={false}
                                    setShowValidation={setShowValidation}
                                    showAnswer={showAnswer}
                                    setShowAnswer={setShowAnswer}
                                    maiaFeedback={maiaFeedback}
                                    handleDischarge={handleDischarge}
                                    handleEnrollProlanis={handleEnrollProlanis}
                                    prolanisRoster={prolanisRoster}
                                    openWiki={openWiki}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Nav Bar — visible only on mobile */}
            <nav className={`md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around
                ${isDark ? 'bg-slate-900/95 border-t border-slate-700 backdrop-blur-md' : 'bg-white/95 border-t border-slate-200 backdrop-blur-md'}
                py-1.5 px-1 safe-area-pb`}
            >
                {[
                    { key: 'anamnesis', icon: FileText, label: 'Anamn.' },
                    { key: 'history', icon: Activity, label: 'Riwayat' },
                    { key: 'physical', icon: Stethoscope, label: 'Fisik' },
                    { key: 'labs', icon: Microscope, label: 'Lab' },
                    { key: 'assessment', icon: Brain, label: 'Diagnosa' },
                    { key: 'treatment', icon: Pill, label: 'Obat' },
                    { key: 'procedures', icon: Scissors, label: 'Tindakan' },
                    { key: 'education', icon: BookOpen, label: 'Edukasi' },
                    { key: 'billing', icon: Receipt, label: 'Billing' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg min-w-[2.5rem] transition-all
                            ${activeTab === tab.key
                                ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                                : (isDark ? 'text-slate-500 active:text-slate-300' : 'text-slate-400 active:text-slate-600')
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="text-[9px] font-bold leading-none truncate max-w-[3rem]">{tab.label}</span>
                        {activeTab === tab.key && (
                            <div className={`w-1 h-1 rounded-full mt-0.5 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
