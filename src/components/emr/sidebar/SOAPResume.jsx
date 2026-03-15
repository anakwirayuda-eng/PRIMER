/**
 * @reflection
 * [IDENTITY]: SOAPResume
 * [PURPOSE]: React UI component: SOAPResume.
 * [STATE]: Experimental
 * [ANCHOR]: SOAPResume
 * [DEPENDS_ON]: AnamnesisEngine, ProceduresDB, EducationOptions, ProceduresTab, MedicationDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { CheckCircle, Pill, Scissors, BookOpen, Stethoscope, FileText } from 'lucide-react';
import { synthesizeAnamnesis } from '../../../game/AnamnesisEngine.js';
import { PROCEDURES_DB, PHYSICAL_EXAM_OPTIONS } from '../../../data/ProceduresDB.js';
import { COMMON_PROCEDURES } from '../../../data/CommonProcedures.js';
import { EDUCATION_OPTIONS } from '../../../data/EducationOptions.js';
// getMedicationById — medications are already resolved in selectedMeds prop

export default function SOAPResume({
    patient,
    isDark,
    caseData,
    anamnesisHistory = [],
    examsPerformed = {},
    labsRevealed = {},
    selectedDiagnoses = [],
    selectedMeds = [],
    selectedProcedures = [],
    selectedEducation = []
}) {
    const examKeys = Array.isArray(examsPerformed) ? examsPerformed : Object.keys(examsPerformed || {});
    const labKeys = Array.isArray(labsRevealed) ? labsRevealed : Object.keys(labsRevealed || {});

    return (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 thin-scrollbar">
            {/* S: Subjective */}
            <div>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="text-emerald-500">S</span>UBJECTIVE
                </h4>
                <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${isDark ? 'bg-slate-950/30 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                    {(() => {
                        const essential = caseData?.essentialQuestions || [];
                        const askedIds = anamnesisHistory.map(q => q.id);
                        const isEssentialAsked = (eId) => {
                            if ((eId === 'q_main_complaint' || eId === 'q_main') && askedIds.includes('initial_complaint')) return true;
                            return askedIds.includes(eId);
                        };
                        const essentialAsked = essential.filter(e => isEssentialAsked(e));
                        const completeness = essential.length > 0 ? Math.round((essentialAsked.length / essential.length) * 100) : 100;
                        const hasComplaint = anamnesisHistory.some(q => q.id === 'initial_complaint');

                        if (!hasComplaint) return <p className="opacity-50 italic">Belum ada data anamnesis...</p>;

                        const synthesis = synthesizeAnamnesis(anamnesisHistory, caseData, patient);
                        return (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold opacity-70">Kelengkapan Data:</span>
                                    <span className={`font-mono font-bold ${completeness >= 80 ? 'text-emerald-500' : completeness >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        {completeness}%
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {synthesis.complaintResponse && (
                                        <p><span className="font-bold">KU:</span> {synthesis.complaintResponse}</p>
                                    )}
                                    {Object.values(synthesis.categories).map(cat => (
                                        <div key={cat.label}>
                                            <p className="font-bold opacity-60 text-[9px] uppercase tracking-wider mt-1">{cat.label}</p>
                                            {cat.findings.map((f, i) => (
                                                <p key={i} className={f.status === 'denied' ? 'opacity-50' : ''}>
                                                    {f.status === 'confirmed' ? '✓' : f.status === 'denied' ? '✗' : '•'} {f.keyword}: {f.summary}
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                    {synthesis.unaskedEssentials.length > 0 && (
                                        <p className="text-rose-400 text-[10px] mt-1">⚠ Belum ditanyakan: {synthesis.unaskedEssentials.map(e => e.label).join(', ')}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* O: Objective */}
            <div>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="text-emerald-500">O</span>BJECTIVE
                </h4>
                <div className="space-y-2">
                    {examKeys.some(e => ['e_vitals', 'e_gcs'].includes(e)) && (
                        <div className={`p-2.5 rounded-lg border grid grid-cols-2 gap-2 ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                            {Object.entries(patient.medicalData.physicalExamFindings || {}).map(([key, value]) => {
                                if (key.includes('TD') || key.includes('Nadi') || key.includes('Napas') || key.includes('Suhu')) {
                                    return (
                                        <div key={key} className="flex justify-between items-center text-[10px]">
                                            <span className="opacity-60">{key}:</span>
                                            <span className="font-mono font-bold">{value}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${isDark ? 'bg-slate-950/30 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                        {examKeys.length === 0 && labKeys.length === 0 ? (
                            <p className="opacity-50 italic">Belum ada pemeriksaan...</p>
                        ) : (
                            <ul className="space-y-1">
                                {Object.entries(patient.medicalData.physicalExamFindings || {}).map(([key, value]) => {
                                    const isVital = key.includes('TD') || key.includes('Nadi') || key.includes('Napas') || key.includes('Suhu');
                                    if (isVital) return null;
                                    return <li key={key} className="flex gap-2"><span className="text-emerald-500 shrink-0">•</span> <span><span className="font-bold">{key}:</span> {value}</span></li>;
                                })}
                                {labKeys.map(labId => {
                                    const labData = labsRevealed?.[labId];
                                    const labDisplay = labData
                                        ? (typeof labData === 'object' ? `${labData.result || '?'} ${labData.unit || ''}`.trim() : String(labData))
                                        : '—';
                                    return (
                                        <li key={labId} className="flex gap-2">
                                            <span className="text-cyan-500 shrink-0">•</span>
                                            <span><span className="font-bold">{labId.replace(/_/g, ' ').toUpperCase()}:</span> {labDisplay}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* A: Assessment */}
            <div>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="text-emerald-500">A</span>SSESSMENT
                </h4>
                <div className={`p-2.5 rounded-lg border text-xs ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    {selectedDiagnoses.length === 0 ? (
                        <p className="opacity-50 italic">Belum ada diagnosis...</p>
                    ) : (
                        <div className="space-y-2">
                            {selectedDiagnoses.map((diag, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="font-bold flex items-center gap-1.5">
                                        <CheckCircle size={10} className="text-emerald-500" />
                                        {diag.name}
                                    </span>
                                    <span className={`font-mono text-[10px] ml-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>ICD-10: {diag.code}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* P: Planning */}
            <div>
                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="text-emerald-500">P</span>LANNING
                </h4>
                <div className="space-y-2">
                    <div className={`p-2.5 rounded-lg border text-xs ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter mb-1.5">Resep & Terapi</p>
                        {selectedMeds.length === 0 ? (
                            <p className="opacity-30 italic">Belum ada obat...</p>
                        ) : (
                            <ul className="space-y-1">
                                {selectedMeds.map((med, i) => (
                                    <li key={i} className="flex gap-2">
                                        <Pill size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="font-bold">{med.name}</span>
                                            <span className="opacity-60 text-[10px]">{med.dose} | {med.route} | {med.freq}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className={`p-2.5 rounded-lg border text-xs ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter mb-1.5">Tindakan & Prosedur</p>
                        {selectedProcedures.length === 0 ? (
                            <p className="opacity-30 italic">Belum ada tindakan...</p>
                        ) : (
                            <ul className="space-y-1">
                                {selectedProcedures.map((proc, i) => {
                                    const procId = typeof proc === 'string' ? proc : (proc.id || proc.code);
                                    const procName = typeof proc === 'object' ? proc.name : null;
                                    const procData = PROCEDURES_DB.find(p => p.id === procId) || (COMMON_PROCEDURES && COMMON_PROCEDURES.find(p => p.id === procId));
                                    return (
                                        <li key={i} className="flex gap-2 items-center">
                                            <Scissors size={12} className="text-cyan-500 shrink-0" />
                                            <span className="font-bold">{procName || procData?.name || procId}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className={`p-2.5 rounded-lg border text-xs ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter mb-1.5">Edukasi & Konseling</p>
                        {selectedEducation.length === 0 ? (
                            <p className="opacity-30 italic">Belum ada edukasi...</p>
                        ) : (
                            <ul className="space-y-1">
                                {selectedEducation.map((eduId, i) => {
                                    const eduData = EDUCATION_OPTIONS.find(e => e.id === eduId);
                                    return (
                                        <li key={i} className="flex gap-2 items-center">
                                            <BookOpen size={12} className="text-teal-500 shrink-0" />
                                            <span className="font-bold">{eduData?.label || eduId}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
