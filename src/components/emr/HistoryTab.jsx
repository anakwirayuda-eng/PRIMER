/**
 * @reflection
 * [IDENTITY]: HistoryTab
 * [PURPOSE]: React UI component: HistoryTab.
 * [STATE]: Experimental
 * [ANCHOR]: HistoryTab
 * [DEPENDS_ON]: CPPTCard
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */


import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Info } from 'lucide-react';
import CPPTCard from '../CPPTCard.jsx';

function getVisitDiagnosisLabel(visit) {
    return visit?.decision?.diagnoses?.join(', ')
        || visit?.medicalData?.trueDiagnosisCode
        || visit?.medicalData?.diagnosisName
        || '-';
}

export default function HistoryTab({ patient, isDark, history, openWiki }) {
    const { t } = useTranslation();
    const getActionLabel = (action) => t(`emrWorkspace.history.actions.${action || 'default'}`, {
        defaultValue: t('emrWorkspace.history.actions.default')
    });

    return (
        <div className="space-y-4 animate-fadeIn h-full overflow-y-auto pr-1 thin-scrollbar">
            {(() => {
                const villagerId = patient.social?.villagerId || patient.hidden?.villagerId;
                const patientHistory = villagerId
                    ? (history || []).filter(h => (h.hidden?.villagerId === villagerId || h.social?.villagerId === villagerId)).sort((a, b) => b.dischargedAt - a.dischargedAt)
                    : [];

                if (patientHistory.length === 0) {
                    return (
                        <div className={`p-12 text-center rounded-2xl border-2 border-dashed ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                            <Activity size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{t('emrWorkspace.history.emptyArchive')}</p>
                            {!villagerId && <p className="text-[9px] mt-1 opacity-50">{t('emrWorkspace.history.nonResident')}</p>}
                        </div>
                    );
                }

                return (
                    <div className="space-y-3">
                        <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                            <Activity size={16} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                            <p className="font-bold">{t('emrWorkspace.history.totalVisits', { count: patientHistory.length })}</p>
                            <button
                                onClick={() => openWiki('cppt')}
                                className="ml-auto text-emerald-500 hover:scale-110 transition-transform"
                                title={t('emrWorkspace.history.cpptTitle')}
                            >
                                <Info size={14} />
                            </button>
                        </div>
                        {patientHistory.map((visit, idx) => (
                            <CPPTCard
                                key={visit.cpptRecord?.id || idx}
                                record={visit.cpptRecord}
                                isDark={isDark}
                                openWiki={openWiki}
                                defaultExpanded={idx === 0}
                            />
                        ))}
                        {/* Fallback for old visits without CPPT */}
                        {patientHistory.filter(v => !v.cpptRecord).length > 0 && (
                            <div className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                <p className="font-bold mb-1">{t('emrWorkspace.history.legacyNotes')}</p>
                                {patientHistory.filter(v => !v.cpptRecord).map((visit, idx) => (
                                    <div key={`legacy-${idx}`} className="flex items-center gap-2 py-1">
                                        <span className="font-mono">H-{visit.day}</span>
                                        <span className={`px-1.5 rounded text-[9px] font-bold ${visit.decision?.action === 'refer' ? 'bg-rose-500/10 text-rose-400' : visit.decision?.action === 'delegate_to_maia' ? 'bg-indigo-500/10 text-indigo-400' : visit.decision?.action === 'stabilize' ? 'bg-teal-500/10 text-teal-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {getActionLabel(visit.decision?.action)}
                                        </span>
                                        <span className="truncate">{getVisitDiagnosisLabel(visit)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}
