/**
 * @reflection
 * [IDENTITY]: ReasoningDashboard
 * [PURPOSE]: React UI component: ReasoningDashboard.
 * [STATE]: Experimental
 * [ANCHOR]: ReasoningDashboard
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-24
 */

import React, { useMemo } from 'react';
import { Brain, Target, Activity, CheckCircle, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildDiagnosticProbabilities } from './reasoningDashboardUtils.js';
import { getEmergencyCasePresentation } from '../../game/emergency/emergencyPresentation.js';

export default function ReasoningDashboard({
    patient,
    isDark,
    coverageScore,
    diagnosticConfidence,
    diagnosticTracker: _diagnosticTracker,
    isSidebarCollapsed: _isSidebarCollapsed,
    setSidebarCollapsed: _setSidebarCollapsed,
    showClue: _showClue,
    setShowClue: _setShowClue
}) {
    const { t, i18n } = useTranslation();
    const score = coverageScore?.score || 0;
    const _macro = coverageScore?.macro || 0;
    const _micro = coverageScore?.micro || 0;
    const _essential = coverageScore?.essential || 0;

    const confidenceValue = typeof diagnosticConfidence === 'object'
        ? (diagnosticConfidence.confidence || 0)
        : (diagnosticConfidence || 0);

    const caseView = useMemo(
        () => getEmergencyCasePresentation(patient, t, i18n),
        [patient, t, i18n]
    );
    const differentials = buildDiagnosticProbabilities(patient, confidenceValue, {
        primaryName: caseView.diagnosisName || patient?.medicalData?.diagnosisName,
        differentialsList: caseView.differentialDiagnosis?.length
            ? caseView.differentialDiagnosis
            : patient?.hidden?.differentialDiagnosis
    });
    const clueText = caseView.clue || patient?.hidden?.clue || patient?.hidden?.hint;

    if (!patient) return null;

    return (
        <div className={`h-full flex flex-col ${isDark ? 'bg-slate-900 border-emerald-500/20 shadow-emerald-900/40' : 'bg-white border-slate-200 shadow-xl'} border rounded-xl overflow-hidden transition-all duration-500`}>
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'bg-slate-800/50 border-emerald-500/10' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        <Brain size={18} />
                    </div>
                    <div>
                        <h3 className={`font-black text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-800 uppercase'}`}>
                            {t('emergency.maia.reasoningTitle')}
                        </h3>
                        <p className={`text-[10px] uppercase tracking-widest font-bold opacity-50 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {t('emergency.maia.reasoningSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 thin-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('emergency.maia.overallInvestigation')}
                            </h4>
                            <span className={`text-xl font-black ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                {score}%
                            </span>
                        </div>
                        <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div
                                className={`h-full transition-all duration-1000 ${score >= 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>

                    {[
                        { label: t('emergency.maia.coverageAnamnesis'), value: coverageScore?.anamnesis?.essential || 0, weight: 70, color: 'emerald' },
                        { label: t('emergency.maia.coveragePhysical'), value: coverageScore?.physical || 0, weight: 15, color: 'cyan' },
                        { label: t('emergency.maia.coverageLabs'), value: coverageScore?.labs || 0, weight: 15, color: 'indigo' }
                    ].map(item => (
                        <div key={item.label} className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50 border-slate-100'} ${item.weight === 70 ? 'col-span-2' : 'col-span-1'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {item.label}
                                </span>
                                <span className="text-xs font-black">{item.value}%</span>
                            </div>
                            <div className={`h-1.5 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                <div
                                    className={`h-full bg-${item.color}-500 rounded-full transition-all duration-1000`}
                                    style={{ width: `${item.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-indigo-500" />
                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('emergency.maia.diagnosticProbability')}
                        </h4>
                    </div>

                    <div className="space-y-3">
                        {differentials.map((diff, idx) => (
                            <div key={diff.id} className="space-y-1.5">
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                        <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {diff.displayName || diff.name}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-mono font-black ${idx === 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                                        {diff.prob}%
                                    </span>
                                </div>
                                <div className={`h-4 w-full rounded-lg overflow-hidden flex ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div
                                        className="h-full transition-all duration-1000 relative group"
                                        style={{
                                            width: `${diff.prob}%`,
                                            background: idx === 0
                                                ? 'linear-gradient(to right, #10b981, #34d399)'
                                                : 'linear-gradient(to right, #6366f1, #818cf8)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {confidenceValue < 60 && (
                        <div className={`p-3 rounded-xl border border-dashed text-center ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                            <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 italic">
                                "{t('emergency.maia.lowConfidenceHint', {
                                    primary: differentials[0]?.displayName || differentials[0]?.name,
                                    secondary: differentials[1]?.displayName || differentials[1]?.name || t('emergency.maia.differentialDiagnosis').toLowerCase()
                                })}"
                            </p>
                        </div>
                    )}
                </div>

                {clueText && (
                    <div className={`p-4 rounded-xl border-2 border-dashed ${isDark ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-200/50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Brain size={14} className="text-amber-500 shadow-amber-500/50" />
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                {t('emergency.maia.expertInsight')}
                            </h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed italic font-medium ${isDark ? 'text-amber-200/80' : 'text-amber-900'}`}>
                            "{clueText}"
                        </p>
                    </div>
                )}
            </div>

            <div className={`p-3 border-t text-center ${isDark ? 'bg-slate-800/80 border-emerald-500/10' : 'bg-slate-50 border-slate-100'}`}>
                <p className={`text-[9px] uppercase tracking-tighter font-bold opacity-40 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('emergency.maia.confidenceLevel', {
                        level: confidenceValue >= 80
                            ? t('emergency.maia.confidenceHigh')
                            : confidenceValue >= 50
                                ? t('emergency.maia.confidenceMedium')
                                : t('emergency.maia.confidenceLow')
                    })}
                </p>
            </div>
        </div>
    );
}
