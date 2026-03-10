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
import { Brain, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { QUESTION_CATEGORIES, ANAMNESIS_TIPS } from '../../game/AnamnesisEngine.js';
import CategoryTabs from './anamnesis/CategoryTabs.jsx';
import DialogueLog from './anamnesis/DialogueLog.jsx';
import InitialComplaintSelection from './anamnesis/InitialComplaintSelection.jsx';
import ChildDirectSelection from './anamnesis/ChildDirectSelection.jsx';
import CaseSpecificSelection from './anamnesis/CaseSpecificSelection.jsx';

export default function AnamnesisTab({
    patient, isDark, anamnesisHistory, setAnamnesisHistory, anamnesisCategory, setAnamnesisCategory,
    hasAskedComplaint, setHasAskedComplaint, handleAskQuestion, chatEndRef, showAnamnesisHint,
    setShowAnamnesisHint, caseData, isProcessing: _isProcessing,
    updatePatient,
    maiaAlerts = [],
    setMaiaAlerts: _setMaiaAlerts,
    diagnosticConfidence,
    coverageScore,
    anamnesisContext,
    handleInitialComplaint
}) {
    const score = coverageScore?.anamnesisTotal ?? coverageScore?.score ?? 0;
    const catDetails = coverageScore?.categories || {};
    const cartPct = coverageScore?.micro || 0;
    const confidence = diagnosticConfidence || { confidence: 0, level: 'low' };
    const confidenceValue = typeof confidence === 'object' ? (confidence.confidence || 0) : (confidence || 0);

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
                <div className={`flex items-center gap-2 mb-2 p-2 rounded-lg border text-tag ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-1.5 flex-1 p-0.5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Coverage:</span>
                        <div className={`flex-1 mx-1 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden relative group`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-400'}`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                        <span className={`font-black ${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-red-400'}`}>{score}%</span>
                    </div>

                    <div className={`flex items-center gap-1 px-2 border-l ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                        {catItems.map(item => (
                            <span
                                key={item.id}
                                title={catDetails[item.id]?.label}
                                className={`px-1 rounded font-bold ${catDetails[item.id]?.covered
                                    ? 'bg-emerald-500/20 text-emerald-500'
                                    : (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400')}`}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>

                    <div className={`border-l pl-2 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                        <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>B7:</span>
                        <span className={`ml-1 font-black ${cartPct > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{cartPct}%</span>
                    </div>

                    {score > 40 && confidenceValue > 0 && (
                        <div className={`border-l pl-2 flex items-center gap-1 ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                            <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dx:</span>
                            <span className={`font-black ${confidence.level === 'high' ? 'text-emerald-500' : confidence.level === 'moderate' ? 'text-blue-500' : 'text-amber-500'}`}>
                                {confidenceValue}%
                            </span>
                        </div>
                    )}
                </div>
            )}

            <CategoryTabs
                anamnesisCategory={anamnesisCategory}
                setAnamnesisCategory={setAnamnesisCategory}
                isDark={isDark}
            />



            <DialogueLog
                anamnesisHistory={anamnesisHistory}
                patient={patient}
                isDark={isDark}
                chatEndRef={chatEndRef}
            />

            {/* Question Area — Bottom Sheet on mobile, inline on desktop */}
            {/* Mobile: floating toggle */}
            <button
                onClick={() => setShowAnamnesisHint(prev => !prev)}
                className={`md:hidden fixed bottom-4 right-4 z-30 px-4 py-2.5 rounded-2xl shadow-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${isDark
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-emerald-600 text-white shadow-emerald-200'
                    }`}
                style={{ display: showAnamnesisHint ? 'none' : undefined }}
            >
                <Brain size={16} /> Pertanyaan
            </button>

            {/* Desktop inline / Mobile bottom sheet */}
            <div className={`
                flex-shrink-0
                md:relative md:rounded-none md:shadow-none md:max-h-none md:translate-y-0 md:border-0
                ${/* Mobile bottom sheet styles */''}
                max-md:fixed max-md:bottom-0 max-md:inset-x-0 max-md:z-40 max-md:rounded-t-2xl max-md:shadow-2xl max-md:max-h-[50vh]
                max-md:transition-transform max-md:duration-300
                ${!showAnamnesisHint ? 'max-md:translate-y-[calc(100%-0px)] max-md:pointer-events-none max-md:opacity-0' : 'max-md:translate-y-0'}
                ${isDark ? 'max-md:bg-slate-900 max-md:border-t max-md:border-slate-700' : 'max-md:bg-white max-md:border-t max-md:border-slate-200'}
            `}>
                {/* Drag handle — mobile only */}
                <div className="md:hidden flex justify-center pt-2 pb-1 cursor-grab"
                    onClick={() => setShowAnamnesisHint(false)}>
                    <div className={`h-1 w-10 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                </div>

                <div className="max-md:px-4 max-md:pb-4 max-md:overflow-y-auto max-md:max-h-[45vh] max-md:pointer-events-auto thin-scrollbar">
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
                                        {maiaAlerts[0].priority === 'high' ? '🔴' : maiaAlerts[0].priority === 'medium' ? '🟡' : '🔵'} MAIA Suggestion
                                    </span>
                                    <span className={`text-caption font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                                        Click to go to {maiaAlerts[0].suggestTab?.toUpperCase()}
                                    </span>
                                </div>
                                <p className={`text-xs font-bold mt-1 leading-tight ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                                    {maiaAlerts[0].message}
                                </p>
                            </div>
                        </button>
                    )}

                    <div className="flex justify-between items-center mb-2 mt-1">
                        <h4 className={`font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Pertanyaan ({QUESTION_CATEGORIES[anamnesisCategory]}):
                        </h4>
                        <button
                            onClick={() => setShowAnamnesisHint(!showAnamnesisHint)}
                            className="text-tag text-blue-600 hidden md:flex items-center gap-1 hover:underline"
                        >
                            <Brain size={10} /> Tips MAIA
                        </button>
                    </div>

                    {showAnamnesisHint && ANAMNESIS_TIPS[anamnesisCategory] && (
                        <div className={`mb-2 p-2 rounded text-tag italic border ${isDark ? 'bg-indigo-950/30 text-indigo-300 border-indigo-900/50' : 'bg-indigo-50 text-indigo-800 border-indigo-100'}`}>
                            💡 {ANAMNESIS_TIPS[anamnesisCategory]}
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
                        />
                    )}

                    {(anamnesisCategory === 'keluhan_utama' && hasAskedComplaint || anamnesisCategory === 'rps') && (
                        <ChildDirectSelection
                            patient={patient}
                            anamnesisHistory={anamnesisHistory}
                            handleAskQuestion={handleAskQuestion}
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

