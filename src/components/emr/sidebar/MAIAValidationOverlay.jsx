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
import { PHYSICAL_EXAM_OPTIONS, PROCEDURES_DB } from '../../../data/ProceduresDB.js';
import { EDUCATION_OPTIONS } from '../../../data/EducationOptions.js';
import { getMedicationById } from '../../../data/MedicationDatabase.js';

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
                        <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>Evaluasi MAIA</span>
                    </div>
                    <button
                        onClick={() => setShowValidation(false)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-indigo-100 text-indigo-600'}`}
                        title="Tutup"
                    >
                        <XCircle size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="space-y-3">
                        {[
                            { id: 'anm', label: 'Anamnesis', score: maiaFeedback?.anamnesis?.score ?? 0, msg: maiaFeedback?.anamnesis?.feedback },
                            { id: 'diag', label: 'Diagnosis', score: maiaFeedback?.diagnosis?.isPrimaryCorrect ? 100 : 0, msg: maiaFeedback?.diagnosis?.feedback },
                            { id: 'tx', label: 'Terapi', score: maiaFeedback?.treatment?.score ?? 0, msg: maiaFeedback?.treatment?.feedback },
                            { id: 'exam', label: 'Pemeriksaan', score: maiaFeedback?.exams?.score ?? 0, msg: maiaFeedback?.exams?.feedback },
                            { id: 'edu', label: 'Edukasi', score: maiaFeedback?.education?.score ?? 0, msg: maiaFeedback?.education?.feedback }
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
                                {stat.msg && <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'} mt-0.5`}>{stat.msg}</p>}
                            </div>
                        ))}
                    </div>

                    {/* MAIA Exam/Lab Suggestions */}
                    {(maiaFeedback?.examLabSuggestions?.examSuggestions?.length > 0 || maiaFeedback?.examLabSuggestions?.labSuggestions?.length > 0) && (
                        <div className={`rounded-xl p-3 space-y-2 border ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                            <div className="flex items-center gap-1.5">
                                <Stethoscope size={12} className="text-cyan-500" />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Saran MAIA</span>
                            </div>
                            {maiaFeedback.examLabSuggestions.examSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pemeriksaan Fisik:</span>
                                    {maiaFeedback.examLabSuggestions.examSuggestions.map(s => (
                                        <p key={s.id} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                            <span className="flex-shrink-0">{'→'}</span>
                                            <span>{s.label}</span>
                                        </p>
                                    ))}
                                </div>
                            )}
                            {maiaFeedback.examLabSuggestions.labSuggestions.length > 0 && (
                                <div className="space-y-0.5">
                                    <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Laboratorium:</span>
                                    {maiaFeedback.examLabSuggestions.labSuggestions.map(s => (
                                        <p key={s.id} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                                            <span className="flex-shrink-0">{'→'}</span>
                                            <span>{s.label}</span>
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
                        {showAnswer ? 'Sembunyikan Pembahasan' : 'Lihat Kunci Jawaban'}
                    </button>

                    {showAnswer && (
                        <div className={`rounded-xl text-[11px] space-y-3 leading-relaxed overflow-hidden ${isDark ? 'bg-slate-950/60 text-slate-300' : 'bg-white text-slate-700'}`}>
                            {/* EBM Clue */}
                            {patient.hidden?.clue && (
                                <div className={`p-3 ${isDark ? 'bg-indigo-500/10 border-b border-indigo-500/20' : 'bg-indigo-50 border-b border-indigo-100'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Brain size={12} className="text-indigo-400" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>EBM Clinical Clue</span>
                                    </div>
                                    <p className={`leading-relaxed italic ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>{patient.hidden.clue}</p>
                                </div>
                            )}

                            <div className="p-3 space-y-3">
                                {/* 1. Diagnosis */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Stethoscope size={12} className="text-emerald-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Diagnosis</span>
                                        {maiaFeedback?.diagnosis?.isPrimaryCorrect
                                            ? <span className="text-emerald-500 text-[9px] font-bold ml-auto">✅ BENAR</span>
                                            : <span className="text-rose-500 text-[9px] font-bold ml-auto">❌ SALAH</span>
                                        }
                                    </div>
                                    <p className="font-bold">{patient.medicalData.diagnosisName}</p>
                                    <p className={`font-mono text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>ICD-10: {patient.medicalData.trueDiagnosisCode}</p>
                                    {(patient.hidden?.differentials?.length > 0) && (
                                        <div className="mt-1.5">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Diagnosis Banding:</span>
                                            <p className="opacity-70">{patient.hidden.differentials.join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Anamnesis */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-cyan-500/20' : 'bg-cyan-50/50 border-cyan-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <FileText size={12} className="text-cyan-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Anamnesis</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.anamnesis?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.anamnesis?.score ?? 0}%
                                        </span>
                                    </div>
                                    {caseData?.essentialQuestions?.length > 0 && (
                                        <div className="space-y-1">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pertanyaan Esensial:</span>
                                            <div className="space-y-0.5">
                                                {caseData.essentialQuestions.map(qId => {
                                                    const wasAsked = (qId === 'q_main_complaint' || qId === 'q_main')
                                                        ? anamnesisHistory.some(q => q.id === qId || q.id === 'initial_complaint')
                                                        : anamnesisHistory.some(q => q.id === qId);

                                                    let qText = qId;
                                                    if (caseData.anamnesisQuestions) {
                                                        Object.values(caseData.anamnesisQuestions).forEach(catQuestions => {
                                                            const found = catQuestions.find(q => q.id === qId);
                                                            if (found) qText = found.text;
                                                        });
                                                    }
                                                    if (qText === qId && (qId === 'q_main' || qId === 'q_main_complaint')) {
                                                        qText = 'Keluhan utama pasien';
                                                    }
                                                    return (
                                                        <div key={qId} className={`flex items-start gap-1.5 ${wasAsked ? 'opacity-80' : 'opacity-100'}`}>
                                                            <span className="flex-shrink-0 mt-0.5">{wasAsked ? '✅' : '❌'}</span>
                                                            <span className={wasAsked ? '' : 'font-bold text-rose-400'}>{qText}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total ditanyakan: {maiaFeedback?.anamnesis?.totalAsked ?? anamnesisHistory.length} pertanyaan</p>
                                </div>

                                {/* 3. Terapi */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-amber-500/20' : 'bg-amber-50/50 border-amber-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Pill size={12} className="text-amber-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Terapi</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.treatment?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.treatment?.score ?? 0}%
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div>
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Terapi yang Benar:</span>
                                            <div className="space-y-0.5 mt-0.5">
                                                {(patient.hidden?.correctTreatment || []).map((med, i) => {
                                                    const isAlt = Array.isArray(med);
                                                    const names = isAlt
                                                        ? med.map(alt => getMedicationById(alt)?.name || alt.replace(/_/g, ' ')).join(' ATAU ')
                                                        : (getMedicationById(med)?.name || med.replace(/_/g, ' '));
                                                    return <p key={i} className="flex items-start gap-1.5">
                                                        <span className="text-emerald-500 flex-shrink-0">💊</span>
                                                        <span>{names}</span>
                                                    </p>;
                                                })}
                                            </div>
                                        </div>
                                        {maiaFeedback?.treatment?.missingMeds?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                                <span className="text-[9px] font-bold text-rose-500">❌ Belum diberikan:</span>
                                                <p className="text-rose-400">{maiaFeedback.treatment.missingMeds.join(', ')}</p>
                                            </div>
                                        )}
                                        {maiaFeedback?.treatment?.unnecessaryMeds?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                                <span className="text-[9px] font-bold text-amber-500">⚠️ Tidak diperlukan:</span>
                                                <p className="text-amber-400">{maiaFeedback.treatment.unnecessaryMeds.join(', ')}</p>
                                            </div>
                                        )}
                                        {(patient.hidden?.correctProcedures?.length > 0) && (
                                            <div>
                                                <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Prosedur yang Tepat:</span>
                                                <div className="space-y-0.5 mt-0.5">
                                                    {patient.hidden.correctProcedures.map((proc, i) => {
                                                        const procData = PROCEDURES_DB.find(p => p.id === proc);
                                                        return <p key={i} className="flex items-start gap-1.5">
                                                            <span className="text-cyan-500 flex-shrink-0">🔧</span>
                                                            <span>{procData?.name || proc.replace(/_/g, ' ')}</span>
                                                        </p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {maiaFeedback?.treatment?.missingProcs?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                                <span className="text-[9px] font-bold text-rose-500">❌ Prosedur belum dilakukan:</span>
                                                <p className="text-rose-400">{maiaFeedback.treatment.missingProcs.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Pemeriksaan */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Microscope size={12} className="text-purple-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Pemeriksaan</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.exams?.score ?? 0) >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.exams?.score ?? 0}%
                                        </span>
                                    </div>
                                    {maiaFeedback?.exams?.relevantLabs?.length > 0 && (
                                        <div className="mb-1">
                                            <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Lab yang Relevan:</span>
                                            <p>{maiaFeedback.exams.relevantLabs.join(', ')}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.missingExams?.length > 0 && (
                                        <div className={`p-1.5 rounded ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                            <span className="text-[9px] font-bold text-rose-500">❌ PF belum diperiksa:</span>
                                            <p className="text-rose-400">{maiaFeedback.exams.missingExams.map(e => {
                                                const found = PHYSICAL_EXAM_OPTIONS[e];
                                                return found?.name || e;
                                            }).join(', ')}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.missingLabs?.length > 0 && (
                                        <div className={`p-1.5 rounded mt-1 ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                            <span className="text-[9px] font-bold text-rose-500">❌ Lab belum dipesan:</span>
                                            <p className="text-rose-400">{maiaFeedback.exams.missingLabs.join(', ')}</p>
                                        </div>
                                    )}
                                    {maiaFeedback?.exams?.unnecessaryLabs?.length > 0 && (
                                        <div className={`p-1.5 rounded mt-1 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                            <span className="text-[9px] font-bold text-amber-500">⚠️ Lab tidak diperlukan:</span>
                                            <p className="text-amber-400">{maiaFeedback.exams.unnecessaryLabs.join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 5. Edukasi */}
                                <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/50 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'}`}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <BookOpen size={12} className="text-teal-500" />
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>Edukasi</span>
                                        <span className={`text-[9px] font-bold ml-auto ${(maiaFeedback?.education?.score ?? 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {maiaFeedback?.education?.score ?? 0}%
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {(patient.hidden?.requiredEducation || []).length > 0 && (
                                            <div>
                                                <span className={`text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Edukasi yang Wajib:</span>
                                                <div className="space-y-0.5 mt-0.5">
                                                    {patient.hidden.requiredEducation.map((eduId, i) => {
                                                        const eduData = EDUCATION_OPTIONS.find(e => e.id === eduId);
                                                        const wasGiven = selectedEducation.includes(eduId);
                                                        return <p key={i} className={`flex items-start gap-1.5 ${wasGiven ? 'opacity-80' : ''}`}>
                                                            <span className="flex-shrink-0">{wasGiven ? '✅' : '❌'}</span>
                                                            <span className={wasGiven ? '' : 'font-bold text-rose-400'}>{eduData?.label || eduId}</span>
                                                        </p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {maiaFeedback?.education?.unnecessary?.length > 0 && (
                                            <div className={`p-1.5 rounded ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                                <span className="text-[9px] font-bold text-amber-500">⚠️ Tidak diperlukan:</span>
                                                <p className="text-amber-400">{maiaFeedback.education.unnecessary.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SKDI Level */}
                                <div className={`p-2 rounded-lg flex items-center gap-2 text-[10px] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                                    <Shield size={12} className="text-indigo-400" />
                                    <span className="font-bold">SKDI:</span>
                                    <span className={`font-mono font-black ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{patient.hidden?.skdi || '-'}</span>
                                    <span className="mx-1 opacity-30">|</span>
                                    <span className="font-bold">Risiko:</span>
                                    <span className={`font-bold capitalize ${patient.hidden?.risk === 'high' ? 'text-rose-500' : patient.hidden?.risk === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {patient.hidden?.risk || '-'}
                                    </span>
                                    {patient.medicalData?.nonReferrable && (
                                        <>
                                            <span className="mx-1 opacity-30">|</span>
                                            <span className="text-emerald-500 font-bold">🏥 Non-Referrable (KMK 1186/2022)</span>
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
