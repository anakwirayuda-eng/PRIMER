/**
 * @reflection
 * [IDENTITY]: LabTab
 * [PURPOSE]: React UI component: LabTab — Tactical CPOE with asymmetric split layout.
 *            Left (40%): Order catalog. Right (60%): Results panel.
 *            1.5s suspense delay + Resource Stewardship EBM warnings.
 * [STATE]: Production
 * [ANCHOR]: LabTab
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-23
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Microscope, AlertCircle, Info, FlaskConical, Sparkles, CheckCircle2, ChevronRight, Activity, FileWarning } from 'lucide-react';
import { findWikiKey } from '../../data/WikiData.js';
import { LAB_CATALOG } from '../../game/LabEngine.js';
import {
    getSupportedRelevantLabOrderables,
    getUnsupportedRelevantLabEntries,
    inferLabFlag,
    resolveLabOrderDefinition,
    summarizeLabResult,
} from '../../utils/labs.js';
import { localizeClinicalText } from '../../utils/clinicalContentLocalization.js';

// Common labs available at FKTP — always orderable regardless of case
// Codex Fix: prices aligned with LAB_CATALOG canonical costs
const COMMON_LABS = [
    { id: 'darah_lengkap', name: 'Darah Lengkap (DL)', cost: LAB_CATALOG.darah_lengkap?.cost || 25000, result: 'Hb 13.2 g/dL, Leukosit 7.800/µL, Trombosit 245.000/µL, Ht 40%', flag: 'normal' },
    { id: 'gds', name: 'Gula Darah Sewaktu (GDS)', cost: LAB_CATALOG.gds?.cost || 10000, result: '98 mg/dL', flag: 'normal' },
    { id: 'urinalisis', name: 'Urinalisis', cost: LAB_CATALOG.urinalisis?.cost || 15000, result: 'pH 6.0, Protein (-), Glukosa (-), Leukosit (-)', flag: 'normal' },
    { id: 'kolesterol_total', name: 'Kolesterol Total', cost: LAB_CATALOG.kolesterol_total?.cost || 20000, result: '185 mg/dL', flag: 'normal' },
    { id: 'asam_urat', name: 'Asam Urat', cost: LAB_CATALOG.asam_urat?.cost || 15000, result: '5.2 mg/dL', flag: 'normal' },
];

// Minimal CSS for suspense progress bar
const LAB_CSS = `
    .lab-proc-bar { background: rgba(6,182,212,0.1); overflow: hidden; border-radius: 4px; height: 4px; margin-top: 8px; }
    .lab-proc-fill { background: #06B6D4; height: 100%; width: 0%; animation: lab-fill 1.5s linear forwards; }
    @keyframes lab-fill { to { width: 100%; } }
`;

export default function LabTab({ patient: _patient, isDark, labsRevealed, handleOrderLab, caseData, openWiki, maiaSuggestions, anamnesisScore }) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage || i18n.language;
    const localize = (value) => localizeClinicalText(value, locale);
    // Cherry-pick 2: Suspense delay state
    const [processingLabs, setProcessingLabs] = useState({});
    const unsupportedRelevantLabs = useMemo(() => getUnsupportedRelevantLabEntries(caseData), [caseData]);

    // Merge case-specific labs with common labs (deduplicate by name)
    const allLabs = useMemo(() => {
        const rawLabs = caseData?.labs;
        // Guard: labs must be a plain object, not array or null
        const caseLabs = (rawLabs && typeof rawLabs === 'object' && !Array.isArray(rawLabs)) ? rawLabs : {};
        // Normalize: strip "(DL)" suffixes, underscores→spaces, lowercase
        const normalize = (s) => {
            if (typeof s !== 'string') return String(s || '').toLowerCase().trim();
            return s.toLowerCase().replace(/\s*\(.*?\)/, '').replace(/_/g, ' ').trim();
        };
        const seenNorms = new Set();
        const merged = [];

        // Case-specific labs first (primary)
        try {
            Object.entries(caseLabs).forEach(([labName, labData]) => {
                const safeData = (labData && typeof labData === 'object') ? labData : { result: String(labData || ''), cost: 50000 };
                const resolved = resolveLabOrderDefinition(caseData, labName);
                const entryId = resolved?.id || labName;
                if (seenNorms.has(normalize(entryId)) || seenNorms.has(normalize(labName))) return;
                seenNorms.add(normalize(entryId));
                seenNorms.add(normalize(labName));
                merged.push({
                    id: entryId,
                    name: resolved?.label || labName,
                    cost: Number(resolved?.cost) || Number(safeData.cost) || 50000,
                    result: safeData.result,
                    flag: safeData.flag || null,
                    isCase: true,
                });
            });
        } catch (e) {
            console.warn('[LabTab] Error processing case labs:', e);
        }

        getSupportedRelevantLabOrderables(caseData).forEach((lab) => {
            if (seenNorms.has(normalize(lab.id)) || seenNorms.has(normalize(lab.label))) return;
            seenNorms.add(normalize(lab.id));
            seenNorms.add(normalize(lab.label));
            merged.push({
                id: lab.id,
                name: lab.label,
                cost: Number(lab.cost) || 50000,
                isCase: true,
            });
        });

        // Common labs that aren't already in case data (fuzzy match)
        COMMON_LABS.forEach(lab => {
            if (!seenNorms.has(normalize(lab.id)) && !seenNorms.has(normalize(lab.name))) {
                merged.push({ ...lab, isCase: false });
            }
        });

        return merged;
    }, [caseData]);

    // Track pending timers for cleanup on unmount
    const pendingTimersRef = useRef(new Map());

    // Cleanup pending lab timers on unmount
    useEffect(() => {
        const pendingTimers = pendingTimersRef.current;
        return () => {
            pendingTimers.forEach(timerId => clearTimeout(timerId));
            pendingTimers.clear();
        };
    }, []);

    // Cherry-pick 2: 1.5s intentional friction before revealing results
    const executeLabOrder = (lab) => {
        const labId = lab.id || lab.name;
        if (processingLabs[labId] || labsRevealed[labId]) return;

        setProcessingLabs(prev => ({ ...prev, [labId]: true }));

        const timerId = setTimeout(() => {
            handleOrderLab(labId, Number(lab.cost) || 50000);
            setProcessingLabs(prev => {
                const next = { ...prev };
                delete next[labId];
                return next;
            });
            pendingTimersRef.current.delete(labId);
        }, 1500);
        pendingTimersRef.current.set(labId, timerId);
    };

    // Count completed results
    const completedCount = Object.keys(labsRevealed).length;
    const hasProcessing = Object.keys(processingLabs).length > 0;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: LAB_CSS }} />

            {/* Top Banners */}
            <div className="shrink-0 space-y-3 mb-4">
                {/* Kendali Mutu Banner */}
                <div className={`p-4 rounded-xl border-2 border-dashed flex items-start gap-3 transition-all ${isDark ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100/90' : 'bg-orange-50/50 border-orange-200 text-orange-900 shadow-sm shadow-orange-100/50'}`}>
                    <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-100 text-orange-600'}`}>
                        <AlertCircle size={14} />
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest mb-1">{t('emrWorkspace.labs.qualityTitle')}</h5>
                        <p className="text-[11px] leading-tight opacity-80">{t('emrWorkspace.labs.qualityDescription')}</p>
                    </div>
                </div>

                {/* MAIA Banner */}
                {anamnesisScore >= 30 && (
                    <div className={`p-3 rounded-xl border flex items-center justify-between transition-all shadow-sm ${isDark
                            ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200'
                            : 'bg-indigo-50 border-indigo-100 text-indigo-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-80">{t('emrWorkspace.labs.maiaTitle')}</h4>
                                {maiaSuggestions?.length > 0 ? (
                                    <p className="text-xs font-medium">
                                        {t('emrWorkspace.labs.maiaConsider', { items: '' })}<span className="font-bold text-indigo-600 dark:text-indigo-300">{maiaSuggestions.map(s => localize(s.label)).join(', ')}</span>
                                    </p>
                                ) : (
                                    <p className="text-xs font-medium opacity-90">{t('emrWorkspace.labs.maiaNoMore')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {unsupportedRelevantLabs.length > 0 && (
                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertCircle size={14} />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-0.5">{t('emrWorkspace.labs.unsupportedTitle')}</h4>
                            <p className="text-xs leading-snug">
                                {t('emrWorkspace.labs.unsupportedDescription', { items: unsupportedRelevantLabs.map((entry) => localize(entry.label)).join(', ') })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cherry-pick 1: Asymmetric Split Layout (40:60) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">

                {/* LEFT (40%): Order Catalog — static, scrollable */}
                <div className={`lg:col-span-5 flex flex-col min-h-0 lg:border-r lg:pr-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 shrink-0 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Microscope size={12} /> {t('emrWorkspace.labs.catalogTitle')}
                    </h4>

                    <div className="flex-1 overflow-y-auto thin-scrollbar space-y-2 pr-1">
                        {allLabs.map(lab => {
                            const labId = lab.id || lab.name;
                            const isRevealed = labsRevealed[labId];
                            const isProcessing = processingLabs[labId];
                            const displayName = localize(lab.name || labId);
                            const labCost = Number(lab.cost) || 50000;
                            const wikiKey = findWikiKey('lab', labId);

                            return (
                                <button
                                    key={labId}
                                    onClick={() => executeLabOrder(lab)}
                                    disabled={isRevealed || isProcessing}
                                    className={`w-full text-left p-3 rounded-xl border-2 border-dashed transition-all flex justify-between items-center group
                                        ${isRevealed
                                            ? (isDark ? 'bg-slate-900/40 border-slate-800/60 opacity-50' : 'bg-slate-50 border-slate-200 opacity-50')
                                            : isProcessing
                                                ? (isDark ? 'bg-cyan-950/20 border-cyan-900/50' : 'bg-cyan-50 border-cyan-200')
                                                : (isDark
                                                    ? 'bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/30'
                                                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200')
                                        }`}
                                >
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`font-black text-[11px] uppercase tracking-wider truncate ${isRevealed ? 'text-slate-500' : isDark ? 'text-white' : 'text-slate-700'}`}>
                                                {displayName}
                                            </span>
                                            {!lab.isCase && !isRevealed && (
                                                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                                                    {t('emrWorkspace.labs.commonBadge')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                                            Rp {labCost.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-1.5">
                                        {wikiKey && !isProcessing && !isRevealed && (
                                            <div
                                                onClick={(e) => { e.stopPropagation(); openWiki(wikiKey); }}
                                                className={`transition-colors p-1 rounded ${isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}
                                            >
                                                <Info size={12} />
                                            </div>
                                        )}
                                        {isRevealed
                                            ? <CheckCircle2 size={14} className="text-emerald-500" />
                                            : isProcessing
                                                ? <Activity size={14} className="text-cyan-500 animate-spin" />
                                                : <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                                        }
                                    </div>
                                </button>
                            );
                        })}

                        {allLabs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 opacity-30">
                                <Microscope size={48} className="mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{t('emrWorkspace.labs.noLabs')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT (60%): Results Panel — fills as labs complete */}
                <div className="lg:col-span-7 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${isDark ? 'text-emerald-500' : 'text-emerald-700'}`}>
                            <FlaskConical size={12} /> {t('emrWorkspace.labs.resultsTitle')}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            {t('emrWorkspace.labs.recorded', { count: completedCount })}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto thin-scrollbar space-y-3 pr-1 pb-4">

                        {/* Empty State */}
                        {completedCount === 0 && !hasProcessing && (
                            <div className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'}`}>
                                <Microscope size={40} className="mb-3 opacity-20" />
                                <p className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                    {t('emrWorkspace.labs.emptySamples')}
                                </p>
                            </div>
                        )}

                        {/* Cherry-pick 2: Processing states (suspense 1.5s) */}
                        {Object.keys(processingLabs).map(id => {
                            const labInfo = allLabs.find(l => (l.id || l.name) === id);
                            return (
                                <div key={`proc_${id}`} className={`p-4 rounded-xl border ${isDark ? 'bg-cyan-950/20 border-cyan-900/50' : 'bg-cyan-50/50 border-cyan-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <Activity size={14} className="text-cyan-500 animate-pulse" />
                                        <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                            {t('emrWorkspace.labs.analyzing', { name: localize(labInfo?.name || labInfo?.id || id) })}
                                        </span>
                                    </div>
                                    <div className="lab-proc-bar"><div className="lab-proc-fill" /></div>
                                </div>
                            );
                        })}

                        {/* Completed Results */}
                        {Object.keys(labsRevealed).map((labKey) => {
                            const labInfo = allLabs.find(l => (l.id || l.name) === labKey);
                            if (!labInfo) return null;

                            // PRIORITY: engine result (labsRevealed) > static default (labInfo.result)
                            const revealedData = labsRevealed[labKey];
                            const engineResult = summarizeLabResult(revealedData);
                            const labResult = localize(engineResult || labInfo.result || t('emrWorkspace.labs.defaultNormalResult'));
                            const labFlag = (typeof revealedData === 'object' ? inferLabFlag(revealedData) : null) || labInfo.flag || 'normal';
                            const isAbnormal = labFlag !== 'normal' && labFlag !== 'negative';

                            return (
                                <div key={`res_${labKey}`} className={`group relative rounded-xl border-2 border-dashed transition-all duration-300 ${isDark
                                    ? (isAbnormal ? 'bg-rose-950/10 border-rose-900/50' : 'bg-slate-900/40 border-slate-800/60')
                                    : (isAbnormal ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100 shadow-sm')
                                    }`}>
                                    {/* Left Accent */}
                                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-lg transition-all ${isAbnormal
                                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                                        : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                        }`} />

                                    <div className={`p-4 flex justify-between items-center ${isDark && !isAbnormal && 'bg-emerald-500/5 rounded-t-xl'}`}>
                                        <div className="flex items-center gap-2 pl-2">
                                            <span className={`font-black text-[11px] uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                                {localize(labInfo.name || labKey)}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${isAbnormal
                                            ? (isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-800 border-rose-200')
                                            : (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100')}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isAbnormal ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{labFlag}</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 pt-0 pl-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">{t('emrWorkspace.labs.resultLabel')}</span>
                                            <span className="text-sm font-black tracking-tight">{labResult}</span>
                                        </div>
                                    </div>

                                    {/* Cherry-pick 3: Resource Stewardship Sting */}
                                    {!labInfo.isCase && (
                                        <div className={`mx-4 mb-3 pt-3 border-t flex items-start gap-1.5 ${isDark ? 'border-slate-800 text-amber-500/70' : 'border-slate-200 text-amber-600'}`}>
                                            <FileWarning size={11} className="mt-0.5 shrink-0" />
                                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest leading-tight">
                                                {t('emrWorkspace.labs.systemNote')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
