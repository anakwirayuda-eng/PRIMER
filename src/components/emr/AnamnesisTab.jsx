/**
 * @reflection
 * [IDENTITY]: AnamnesisTab
 * [PURPOSE]: React UI component: AnamnesisTab.
 * [STATE]: Experimental
 * [ANCHOR]: AnamnesisTab
 * [DEPENDS_ON]: AnamnesisEngine, CategoryTabs, DialogueLog, InitialComplaintSelection, ChildDirectSelection, CaseSpecificSelection
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-19
 */


import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ANAMNESIS_TIPS } from '../../game/AnamnesisEngine.js';
import {
    getLocalizedAnamnesisTip,
    getLocalizedQuestionCategory
} from '../../game/anamnesis/QuestionPresentation.js';
import CategoryTabs from './anamnesis/CategoryTabs.jsx';
import DialogueLog from './anamnesis/DialogueLog.jsx';
import InitialComplaintSelection from './anamnesis/InitialComplaintSelection.jsx';
import ChildDirectSelection from './anamnesis/ChildDirectSelection.jsx';
import CaseSpecificSelection from './anamnesis/CaseSpecificSelection.jsx';

export default function AnamnesisTab({
    patient, isDark, anamnesisHistory, setAnamnesisHistory, anamnesisCategory, setAnamnesisCategory,
    hasAskedComplaint, setHasAskedComplaint, handleAskQuestion, chatEndRef, showAnamnesisHint,
    setShowAnamnesisHint, caseData, isProcessing,
    updatePatient,
    maiaAlerts = [],
    setMaiaAlerts: _setMaiaAlerts,
    diagnosticConfidence,
    coverageScore,
    anamnesisContext: _anamnesisContext,
    handleInitialComplaint
}) {
    const { t } = useTranslation();
    // Codex Fix [Medium]: Separate mobile sheet state from MAIA tips state.
    // Previously both used showAnamnesisHint, causing tips to appear when
    // opening the mobile question panel.
    const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);

    const score = coverageScore?.anamnesisTotal ?? coverageScore?.score ?? 0;
    const catDetails = coverageScore?.categories || {};
    const cartPct = coverageScore?.micro || 0;
    // Codex Fix: resolve diagnosticConfidence if it's a function (from usePatientEMR hook)
    const rawConfidence = typeof diagnosticConfidence === 'function' ? diagnosticConfidence() : diagnosticConfidence;
    const confidence = rawConfidence || { confidence: 0, level: 'low' };
    const confidenceValue = typeof confidence === 'object' ? (confidence.confidence || 0) : (confidence || 0);
    const activeCategoryLabel = getLocalizedQuestionCategory(anamnesisCategory, t);
    const activeTip = getLocalizedAnamnesisTip(anamnesisCategory, t) || ANAMNESIS_TIPS[anamnesisCategory];

    const catItems = [
        { id: 'keluhan_utama', label: 'KU' },
        { id: 'rps', label: 'RPS' },
        { id: 'rpd', label: 'RPD' },
        { id: 'rpk', label: 'RPK' },
        { id: 'sosial', label: 'Sos' }
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Sprint 2: Synchronized Coverage & Confidence Indicators */}
            {hasAskedComplaint && (
                <div className={`mb-2 rounded-2xl border p-3 ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                        <div className="flex items-center gap-2 rounded-xl p-2">
                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t('anamnesis.ui.coverage')}</span>
                            <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden relative group`}>
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-400'}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                            <span className={`text-sm font-black ${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-red-400'}`}>{score}%</span>
                        </div>

                        <div className={`flex flex-wrap items-center gap-1.5 rounded-xl border px-2 py-2 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/70'}`}>
                            {catItems.map(item => (
                                <span
                                    key={item.id}
                                    title={catDetails[item.id]?.label}
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ${catDetails[item.id]?.covered
                                        ? 'bg-emerald-500/20 text-emerald-500'
                                        : (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400')}`}
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-slate-900/60 text-slate-300' : 'bg-white/80 text-slate-600'}`}>
                                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>B7</span>
                                <span className={cartPct > 70 ? 'text-emerald-500' : 'text-amber-500'}>{cartPct}%</span>
                            </div>

                            {score > 40 && confidenceValue > 0 && (
                                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-slate-900/60 text-slate-300' : 'bg-white/80 text-slate-600'}`}>
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Dx</span>
                                    <span className={confidence.level === 'high' ? 'text-emerald-500' : confidence.level === 'moderate' ? 'text-blue-500' : 'text-amber-500'}>
                                        {confidenceValue}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <CategoryTabs
                anamnesisCategory={anamnesisCategory}
                setAnamnesisCategory={setAnamnesisCategory}
                isDark={isDark}
                t={t}
            />



            <DialogueLog
                anamnesisHistory={anamnesisHistory}
                patient={patient}
                isDark={isDark}
                chatEndRef={chatEndRef}
                isProcessing={isProcessing}
                t={t}
            />

            {/* Question Area — Bottom Sheet on mobile, inline on desktop */}
            {/* Mobile: floating toggle */}
            <button
                onClick={() => setIsMobileSheetOpen(prev => !prev)}
                className={`md:hidden fixed bottom-16 right-4 z-30 px-3.5 py-2 rounded-2xl shadow-lg font-bold text-xs flex items-center gap-2 transition-all active:scale-95 ${isDark
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-emerald-600 text-white shadow-emerald-200'
                    }`}
                style={{ display: isMobileSheetOpen ? 'none' : undefined }}
            >
                <Brain size={16} /> {t('anamnesis.ui.questions')}
            </button>

            {/* Desktop inline / Mobile bottom sheet */}
            <div className={`
                flex-shrink-0
                md:relative md:rounded-none md:shadow-none md:max-h-none md:translate-y-0 md:border-0
                ${/* Mobile bottom sheet styles */''}
                max-md:fixed max-md:bottom-0 max-md:inset-x-0 max-md:z-40 max-md:rounded-t-2xl max-md:shadow-2xl max-md:max-h-[46vh]
                max-md:transition-transform max-md:duration-300
                ${!isMobileSheetOpen ? 'max-md:translate-y-[calc(100%-0px)] max-md:pointer-events-none max-md:opacity-0' : 'max-md:translate-y-0'}
                ${isDark ? 'max-md:bg-slate-900 max-md:border-t max-md:border-slate-700' : 'max-md:bg-white max-md:border-t max-md:border-slate-200'}
            `}>
                {/* Mobile header — drag handle + close button */}
                <div className="md:hidden flex items-center justify-between px-3 pt-2 pb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('anamnesis.ui.questions')}</span>
                    <button
                        onClick={() => setIsMobileSheetOpen(false)}
                        aria-label={t('anamnesis.ui.close_questions')}
                        className={`p-1.5 rounded-lg transition-all active:scale-90 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}
                    >
                        {'\u00d7'}
                    </button>
                </div>

                <div className="max-md:px-4 max-md:pb-4 max-md:overflow-y-auto max-md:max-h-[41vh] max-md:pointer-events-auto thin-scrollbar">
                    {/* Sprint 2: MAIA EBM Feedback */}
                    {maiaAlerts.length > 0 && (
                        <button
                            onClick={() => {
                                if (maiaAlerts[0].suggestTab) {
                                    setAnamnesisCategory(maiaAlerts[0].suggestTab);
                                }
                            }}
                            className={`w-full text-left mt-1 md:mt-3 p-2 md:p-2.5 rounded-xl border-2 flex gap-3 transition-all active:scale-[0.98] group ${isDark
                                ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
                                : 'bg-amber-50 border-amber-200 hover:shadow-md'}`}
                        >
                            <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                <AlertTriangle size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className={`text-tag font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                        MAIA
                                    </span>
                                    {maiaAlerts[0].suggestTab && (
                                        <span className={`text-caption font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                                            {t('anamnesis.ui.jump_to_tab', {
                                                tab: getLocalizedQuestionCategory(maiaAlerts[0].suggestTab, t)
                                            })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs font-bold mt-1 leading-tight ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                                    {maiaAlerts[0].message}
                                </p>
                            </div>
                        </button>
                    )}

                    <div className="mb-2 mt-1 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {activeCategoryLabel}
                            </span>
                            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                {t('anamnesis.ui.active_questions')}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowAnamnesisHint(!showAnamnesisHint)}
                            className={`hidden md:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${isDark ? 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                        >
                            <Brain size={10} /> {t('anamnesis.ui.tips_button')}
                        </button>
                    </div>

                    {showAnamnesisHint && activeTip && (
                        <div className={`mb-2 rounded-xl border px-3 py-2 text-xs italic leading-relaxed ${isDark ? 'bg-indigo-950/30 text-indigo-300 border-indigo-900/50' : 'bg-indigo-50 text-indigo-800 border-indigo-100'}`}>
                            {t('anamnesis.ui.tip_prefix', { text: activeTip })}
                        </div>
                    )}

                    {anamnesisCategory === 'keluhan_utama' && !hasAskedComplaint && (
                        <InitialComplaintSelection
                            patient={patient}
                            isDark={isDark}
                            anamnesisHistory={anamnesisHistory}
                            setAnamnesisHistory={setAnamnesisHistory}
                            setHasAskedComplaint={setHasAskedComplaint}
                            updatePatient={updatePatient}
                            onComplaintAsked={handleInitialComplaint}
                            t={t}
                        />
                    )}

                    {/* Codex Fix: explicit parentheses — RPS tab also requires hasAskedComplaint */}
                    {((anamnesisCategory === 'keluhan_utama' || anamnesisCategory === 'rps') && hasAskedComplaint) && (
                        <ChildDirectSelection
                            patient={patient}
                            anamnesisHistory={anamnesisHistory}
                            handleAskQuestion={handleAskQuestion}
                            t={t}
                        />
                    )}

                    {(anamnesisCategory !== 'keluhan_utama' || hasAskedComplaint) && (
                        <CaseSpecificSelection
                            patient={patient}
                            anamnesisCategory={anamnesisCategory}
                            hasAskedComplaint={hasAskedComplaint}
                            caseData={caseData}
                            anamnesisHistory={anamnesisHistory}
                            handleAskQuestion={handleAskQuestion}
                            isDark={isDark}
                            t={t}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

