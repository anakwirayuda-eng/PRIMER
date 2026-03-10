/**
 * @reflection
 * [IDENTITY]: ClinicalSidebar
 * [PURPOSE]: React UI component: ClinicalSidebar.
 * [STATE]: Experimental
 * [ANCHOR]: ClinicalSidebar
 * [DEPENDS_ON]: SOAPResume, BillingSummary, ActionButtons, MAIAClueOverlay, MAIAValidationOverlay
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { FileText, Brain, Info } from 'lucide-react';

// Sub-components
import SOAPResume from './sidebar/SOAPResume.jsx';
import BillingSummary from './sidebar/BillingSummary.jsx';
import ActionButtons from './sidebar/ActionButtons.jsx';
import MAIAClueOverlay from './sidebar/MAIAClueOverlay.jsx';
import MAIAValidationOverlay from './sidebar/MAIAValidationOverlay.jsx';

export default function ClinicalSidebar({
    patient,
    isDark,
    caseData,
    social,
    // SOAP data
    anamnesisHistory = [],
    examsPerformed = {},
    labsRevealed = {},
    selectedDiagnoses = [],
    selectedMeds = [],
    selectedProcedures = [],
    selectedEducation = [],
    // MAIA / validation
    showClue,
    setShowClue,
    showValidation,
    setShowValidation,
    showAnswer,
    setShowAnswer,
    maiaFeedback,
    handleMaiaValidate: _handleMaiaValidate,
    // Actions
    handleDischarge,
    handleEnrollProlanis,
    prolanisRoster = [],
    openWiki
}) {
    if (!patient) return null;

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden shadow-xl ${isDark ? 'bg-slate-900/80 border-emerald-500/20 shadow-emerald-900/20' : 'bg-white border-slate-200'} relative`}>
                {/* Resume Header */}
                <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'bg-slate-800/50 border-emerald-500/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            <FileText size={16} />
                        </div>
                        <h3 className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-800 uppercase'}`}>
                            CPPT
                        </h3>
                        <button
                            onClick={() => openWiki('cppt')}
                            className="text-emerald-500 hover:scale-110 transition-transform"
                            aria-label="Info: Apa itu CPPT?"
                        >
                            <Info size={14} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex gap-1.5 items-center">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-500/50' : 'text-slate-400'}`}>
                            Medical Record
                        </span>
                    </div>
                </div>

                {/* S-O-A-P Content */}
                <SOAPResume
                    patient={patient}
                    isDark={isDark}
                    caseData={caseData}
                    anamnesisHistory={anamnesisHistory}
                    examsPerformed={examsPerformed}
                    labsRevealed={labsRevealed}
                    selectedDiagnoses={selectedDiagnoses}
                    selectedMeds={selectedMeds}
                    selectedProcedures={selectedProcedures}
                    selectedEducation={selectedEducation}
                />

                {/* Billing Summary */}
                <BillingSummary
                    isDark={isDark}
                    social={social}
                    selectedMeds={selectedMeds}
                    selectedProcedures={selectedProcedures}
                    labsRevealed={labsRevealed}
                    caseData={caseData}
                />

                {/* Action Buttons */}
                <ActionButtons
                    patient={patient}
                    isDark={isDark}
                    social={social}
                    selectedDiagnoses={selectedDiagnoses}
                    prolanisRoster={prolanisRoster}
                    handleDischarge={handleDischarge}
                    handleEnrollProlanis={handleEnrollProlanis}
                />

                {/* Overlays */}
                <MAIAClueOverlay
                    patient={patient}
                    isDark={isDark}
                    showClue={showClue}
                    setShowClue={setShowClue}
                />

                <MAIAValidationOverlay
                    patient={patient}
                    isDark={isDark}
                    caseData={caseData}
                    showValidation={showValidation}
                    setShowValidation={setShowValidation}
                    showAnswer={showAnswer}
                    setShowAnswer={setShowAnswer}
                    maiaFeedback={maiaFeedback}
                    anamnesisHistory={anamnesisHistory}
                    selectedEducation={selectedEducation}
                />
            </div>
        </div>
    );
}
