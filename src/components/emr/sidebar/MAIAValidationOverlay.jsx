/**
 * @reflection
 * [IDENTITY]: MAIAValidationOverlay
 * [PURPOSE]: React UI component: MAIAValidationOverlay.
 * [STATE]: Experimental
 * [ANCHOR]: MAIAValidationOverlay
 * [DEPENDS_ON]: ProceduresDB, EducationOptions, MedicationDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { CheckCircle, XCircle, Brain, Stethoscope, FileText, Pill, Microscope, Shield, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PHYSICAL_EXAM_OPTIONS, PROCEDURES_DB } from '../../../data/ProceduresDB.js';
import { EDUCATION_OPTIONS } from '../../../data/EducationOptions.js';
import { getMedicationById } from '../../../data/MedicationDatabase.js';
import { getEmergencyCasePresentation, getLocalizedEmergencyActionName } from '../../../game/emergency/emergencyPresentation.js';
import { localizeClinicalText } from '../../../utils/clinicalContentLocalization.js';

export default function MAIAValidationOverlay({
    patient,
    isDark,
    caseData,
    showValidation,
    setShowValidation,
    showAnswer,
    setShowAnswer,
    maiaFeedback,
    anamnesisHistory = [],
    selectedEducation = []
}) {
    const { t, i18n } = useTranslation();
    const localize = (value) => localizeClinicalText(value, i18n.language);
    const caseView = getEmergencyCasePresentation(patient, t, i18n);
    const localizedDiagnosis = localize(caseView.diagnosisName || patient?.medicalData?.diagnosisName);
    const localizedDifferentials = (caseView.differentialDiagnosis?.length
        ? caseView.differentialDiagnosis
        : (patient?.hidden?.differentialDiagnosis || [])).map(localize);
    const localizedClue = localize(caseView.clue || patient?.hidden?.clue);
    const localizedAnamnesisQuestions = caseView.anamnesisQuestions || caseData?.anamnesisQuestions || {};
    const localizedRelevantLabs = (caseView.relevantLabs?.length
        ? caseView.relevantLabs
        : (maiaFeedback?.exams?.relevantLabs || [])).map(localize);
    const authoredTreatment = patient?.hidden?.correctTreatment?.length
        ? patient.hidden.correctTreatment
        : (caseData?.correctTreatment || patient?.medicalData?.correctTreatment || []);
    const authoredProcedures = patient?.hidden?.correctProcedures?.length
        ? patient.hidden.correctProcedures
        : (caseData?.correctProcedures || patient?.medicalData?.correctProcedures || []);
    const authoredEducation = patient?.hidden?.requiredEducation?.length
        ? patient.hidden.requiredEducation
        : (caseData?.requiredEducation || patient?.medicalData?.requiredEducation || []);
    const getActionLabel = (actionId) => {
        if (i18n.exists(`emergency.actions.${actionId}`)) {
            return localize(t(`emergency.actions.${actionId}`));
        }
        return localize(getMedicationById(actionId)?.name || getLocalizedEmergencyActionName(actionId, t, i18n));
    };
    const getProcedureLabel = (procedureId) => {
        const procData = PROCEDURES_DB.find(p => p.id === procedureId);
        return localize(procData?.name || String(procedureId).replace(/_/g, ' '));
    };
    const getEducationLabel = (educationId) => {
        const eduData = EDUCATION_OPTIONS.find(e => e.id === educationId);
        return localize(eduData?.label || String(educationId).replace(/_/g, ' '));
    };
    const getExamLabel = (examId) => {
        const found = PHYSICAL_EXAM_OPTIONS[examId];
        return localize(found?.name || String(examId).replace(/_/g, ' '));
    };
    const formatLocalizedList = (items, mapper = localize) => {
        return (items || []).map(mapper).join(', ');
    };
    const getRiskLabel = (risk) => {
        const rawRisk = risk || '-';
        if (rawRisk === '-') return rawRisk;
        return t(`emergency.maia.riskLevels.${String(rawRisk).toLowerCase()}`, {
            defaultValue: localize(rawRisk)
        });
    };

    if (!showValidation || !maiaFeedback) return null;

    return (
        <div
            className={`absolute inset-0 z-30 transition-all duration-300 ease-in-out ${showValidation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        >
            <div className={`h-full rounded-xl border-2 overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-slate-900/80 border-indigo-500/30 shadow-indigo-900/20' : 'bg-white/80 border-indigo-300 shadow-indigo-200/30'}`}
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
                <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50/80 border-indigo-200'}`}>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                            <CheckCircle size={14} />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>{t('emergency.maia.validationTitle')}</span>
                    </div>
                    <button
                        onClick={() => setShowValidation(false)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-indigo-100 text-indigo-600'}`}
                        title={t('emergency.maia.close')}
                    >
                        <XCircle size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="space-y-3">
                        {[
                            { id: 'anm', label: t('emergency.maia.stats.anamnesis'), score: maiaFeedback?.anamnesis?.score ?? 0, msg: maiaFeedback?.anamnesis?.feedback },
                            { id: 'diag', label: t('emergency.maia.stats.diagnosis'), score: maiaFeedback?.diagnosis?.isPrimaryCorrect ? 100 : 0, msg: maiaFeedback?.diagnosis?.feedback },
                            { id: 'tx', label: t('emergency.maia.stats.treatment'), score: maiaFeedback?.treatment?.score ?? 0, msg: maiaFeedback?.treatment?.feedback },
                            { id: 'exam', label: t('emergency.maia.stats.exams'), score: maiaFeedback?.exams?.score ?? 0, msg: maiaFeedback?.exams?.feedback },
                            { id: 'edu', label: t('emergency.maia.stats.education'), score: maiaFeedback?.education?.score ?? 0, msg: maiaFeedback?.education?.feedback }
                        ].map(stat => (
                            <div key={stat.id} className="space-y-1">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{stat.label}</span>
                                    <span className={`font-mono ${stat.score >= 80 ? 'text-emerald-500' : stat.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {stat.score}%
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className={`h-full transition-all duration-700 ${stat.score >= 80 ? 'bg-emerald-500' : stat.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${stat.score}%` }}
                                    />
                                </div>
                                {stat.msg && <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'} mt-0.5`}>{localize(stat.msg)}</p>}
                            </div>
                        ))}
                    </div>

                    {/* MAIA Exam/Lab Suggestions */}
                    {(maiaFeedback?.examLabSuggestions?.examSuggestions?.length > 0 || maiaFeedback?.examLabSuggestions?.labSuggestions?.length > 0) && (
                        <div className={`rounded-xl p-3 space-y-2 border ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                            <div className="flex items-center gap-1.5">
                                <Stethoscope size={12} className="text-cyan-500" />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{t('emergency.maia.suggestionsTitle')}</span>
                            </div>
                            {maiaFeedback.examLabSuggestions.examSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.physicalExam')}:</span>
                                    {maiaFeedback.examLabSuggestions.examSuggestions.map(s => (
                                        <p key={s.id} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                            <span className="flex-shrink-0">-&gt;</span>
                                            <span>{localize(s.label)}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            {maiaFeedback.examLabSuggestions.labSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.laboratory')}:</span>
                                    {maiaFeedback.examLabSuggestions.labSuggestions.map(s => (
                                        <p key={s.id} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                            <span className="flex-shrink-0">-&gt;</span>
                                            <span>{localize(s.label)}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className={`w-full py-2.5 border border-dashed rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDark ? 'text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10' : 'text-indigo-500 hover:bg-indigo-500/5'}`}
                    >
                        {showAnswer ? t('emergency.maia.hideAnswer') : t('emergency.maia.showAnswer')}
                    </button>

                    {showAnswer && (
                        <div className={`rounded-xl text-[11px] space-y-3 leading-relaxed overflow-hidden ${isDark ? 'bg-slate-950/60 text-slate-300' : 'bg-white text-slate-700'}`}>
                            {/* EBM Clue */}
                            {localizedClue && (
                                <div className={`p-3 ${isDark ? 'bg-indigo-500/10 border-b border-indigo-500/20' : 'bg-indigo-50 border-b border-indigo-100'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Brain size={12} className="text-indigo-400" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{t('emergency.maia.ebmClueTitle')}</span>
                                    </div>
                                    <p className={`leading-relaxed italic ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>{localizedClue}</p>
                                </div>
                            )}

                            <div className="p-3 space-y-3">
                                {/* 1. Diagnosis */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Stethoscope size={12} className="text-emerald-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{t('emergency.maia.diagnosisSection')}</span>
                                        {maiaFeedback?.diagnosis?.isPrimaryCorrect
                                            ? <span className="text-emerald-500 text-[9px] font-bold ml-auto">OK {t('emergency.maia.correct')}</span>
                                            : <span className="text-rose-500 text-[9px] font-bold ml-auto">X {t('emergency.maia.incorrect')}</span>
                                        }
                                    </div>
                                    <p className="font-bold">{localizedDiagnosis}</p>
                                    <p className={`font-mono text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>ICD-10: {patient.medicalData?.trueDiagnosisCode}</p>
                                    {/* Codex Fix: emergency uses differentialDiagnosis, regular uses differentials */}
                                    {(localizedDifferentials.length > 0) && (
                                        <div className="mt-1.5">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.differentialDiagnosis')}:</span>
                                            <p className="opacity-70">{localizedDifferentials.join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Anamnesis */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-cyan-500/20' : 'bg-cyan-50/50 border-cyan-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <FileText size={12} className="text-cyan-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{t('emergency.maia.anamnesisSection')}</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.anamnesis?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.anamnesis?.score ?? 0}%
                                        </span>
                                    </div>
                                    {caseData?.essentialQuestions?.length > 0 && (
                                        <div className="space-y-1">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.essentialQuestions')}:</span>
                                            <div className="space-y-0.5">
                                                {caseData.essentialQuestions.map(qId => {
                                                    const wasAsked = (qId === 'q_main_complaint' || qId === 'q_main')
                                                        ? anamnesisHistory.some(q => q.id === qId || q.id === 'initial_complaint')
                                                        : anamnesisHistory.some(q => q.id === qId);

                                                    let qText = qId;
                                                    if (localizedAnamnesisQuestions) {
                                                        Object.values(localizedAnamnesisQuestions).forEach(catQuestions => {
                                                            const found = catQuestions.find(q => q.id === qId);
                                                            if (found) qText = found.text;
                                                        });
                                                    }
                                                    if (qText === qId && (qId === 'q_main' || qId === 'q_main_complaint')) {
                                                        qText = t('emergency.maia.chiefComplaintFallback');
                                                    }
                                                    return (
                                                        <div key={qId} className={`flex items-start gap-1.5 ${wasAsked ? 'opacity-80' : 'opacity-100'}`}>
                                                            <span className="flex-shrink-0 mt-0.5">{wasAsked ? 'OK' : 'X'}</span>
                                                            <span className={wasAsked ? '' : 'font-bold text-rose-400'}>{localize(qText)}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.totalAsked', { count: maiaFeedback?.anamnesis?.totalAsked ?? anamnesisHistory.length })}</p>
                                </div>

                                {/* 3. Treatment */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-amber-500/20' : 'bg-amber-50/50 border-amber-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Pill size={12} className="text-amber-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{t('emergency.maia.treatmentSection')}</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.treatment?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.treatment?.score ?? 0}%
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div>
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.correctTherapy')}:</span>
                                            <div className="space-y-0.5 mt-0.5">
                                                {authoredTreatment.map((med, i) => {
                                                    const isAlt = Array.isArray(med);
                                                    const names = isAlt
                                                        ? med.map(getActionLabel).join(t('emergency.maia.orSeparator'))
                                                        : getActionLabel(med);
                                                    return <p key={i} className="flex items-start gap-1.5">
                                                        <span className="text-emerald-500 flex-shrink-0">MED</span>
                                                        <span>{names}</span>
                                                    </p>;
                                                })}
                                            </div>
                                        </div>
                                        {maiaFeedback?.treatment?.missingMeds?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                                <span className="text-[9px] font-bold text-rose-500">X {t('emergency.maia.missingMeds')}:</span>
                                                <p className="text-rose-400">{maiaFeedback.treatment.missingMeds.map(getActionLabel).join(', ')}</p>
                                            </div>
                                        )}
                                        {maiaFeedback?.treatment?.unnecessaryMeds?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                                <span className="text-[9px] font-bold text-amber-500">WARN {t('emergency.maia.unnecessaryMeds')}:</span>
                                                <p className="text-amber-400">{maiaFeedback.treatment.unnecessaryMeds.map(getActionLabel).join(', ')}</p>
                                            </div>
                                        )}
                                        {(authoredProcedures.length > 0) && (
                                            <div>
                                                <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.correctProcedures')}:</span>
                                                <div className="space-y-0.5 mt-0.5">
                                                    {authoredProcedures.map((proc, i) => {
                                                        return <p key={i} className="flex items-start gap-1.5">
                                                            <span className="text-cyan-500 flex-shrink-0">PROC</span>
                                                            <span>{getProcedureLabel(proc)}</span>
                                                        </p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {maiaFeedback?.treatment?.missingProcs?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                                <span className="text-[9px] font-bold text-rose-500">X {t('emergency.maia.missingProcs')}:</span>
                                                <p className="text-rose-400">{formatLocalizedList(maiaFeedback.treatment.missingProcs, getProcedureLabel)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Examinations */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Microscope size={12} className="text-purple-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{t('emergency.maia.examsSection')}</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.exams?.score ?? 0) >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.exams?.score ?? 0}%
                                        </span>
                                    </div>
                                    {localizedRelevantLabs.length > 0 && (
                                        <div className="mb-1">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.relevantLabs')}:</span>
                                            <p>{localizedRelevantLabs.join(', ')}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.missingExams?.length > 0 && (
                                        <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                            <span className="text-[9px] font-bold text-rose-500">X {t('emergency.maia.missingExams')}:</span>
                                            <p className="text-rose-400">{formatLocalizedList(maiaFeedback.exams.missingExams, getExamLabel)}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.missingLabs?.length > 0 && (
                                        <div className={`p-1.5 rounded mt-1 ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                            <span className="text-[9px] font-bold text-rose-500">X {t('emergency.maia.missingLabs')}:</span>
                                            <p className="text-rose-400">{formatLocalizedList(maiaFeedback.exams.missingLabs)}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.unnecessaryLabs?.length > 0 && (
                                        <div className={`p-1.5 rounded mt-1 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                            <span className="text-[9px] font-bold text-amber-500">WARN {t('emergency.maia.unnecessaryLabs')}:</span>
                                            <p className="text-amber-400">{formatLocalizedList(maiaFeedback.exams.unnecessaryLabs)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 5. Education */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <BookOpen size={12} className="text-teal-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>{t('emergency.maia.educationSection')}</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.education?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.education?.score ?? 0}%
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {authoredEducation.length > 0 && (
                                            <div>
                                                <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('emergency.maia.requiredEducation')}:</span>
                                                <div className="space-y-0.5 mt-0.5">
                                                    {authoredEducation.map((eduId, i) => {
                                                        const wasGiven = selectedEducation.includes(eduId);
                                                        return <p key={i} className={`flex items-start gap-1.5 ${wasGiven ? 'opacity-80' : ''}`}>
                                                            <span className="flex-shrink-0">{wasGiven ? 'OK' : 'X'}</span>
                                                            <span className={wasGiven ? '' : 'font-bold text-rose-400'}>{getEducationLabel(eduId)}</span>
                                                        </p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {maiaFeedback?.education?.unnecessary?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                                <span className="text-[9px] font-bold text-amber-500">WARN {t('emergency.maia.unnecessaryEducation')}:</span>
                                                <p className="text-amber-400">{formatLocalizedList(maiaFeedback.education.unnecessary, getEducationLabel)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SKDI Level */}
                                <div className={`p-2 rounded-lg flex items-center gap-2 text-[10px] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                                    <Shield size={12} className="text-indigo-400" />
                                    <span className="font-bold">{t('emergency.maia.skdi')}:</span>
                                    <span className={`font-mono font-black ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{patient.hidden?.skdi || '-'}</span>
                                    <span className="mx-1 opacity-30">|</span>
                                    <span className="font-bold">{t('emergency.maia.risk')}:</span>
                                    <span className={`font-bold capitalize ${patient.hidden?.risk === 'high' ? 'text-rose-500' : patient.hidden?.risk === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {getRiskLabel(patient.hidden?.risk)}
                                    </span>
                                    {patient.medicalData?.nonReferrable && (
                                        <>
                                            <span className="mx-1 opacity-30">|</span>
                                            <span className="text-emerald-500 font-bold">{t('emergency.maia.nonReferrable')}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
