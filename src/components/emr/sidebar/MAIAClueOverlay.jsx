/**
 * @reflection
 * [IDENTITY]: MAIAClueOverlay
 * [PURPOSE]: React UI component: MAIAClueOverlay.
 * [STATE]: Experimental
 * [ANCHOR]: MAIAClueOverlay
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { Brain, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getEmergencyCasePresentation } from '../../../game/emergency/emergencyPresentation.js';
import { localizeClinicalText } from '../../../utils/clinicalContentLocalization.js';

export default function MAIAClueOverlay({
    patient,
    isDark,
    showClue,
    setShowClue
}) {
    const { t, i18n } = useTranslation();
    const caseView = getEmergencyCasePresentation(patient, t, i18n);
    const localize = (value) => localizeClinicalText(value, i18n.language);
    const localizedClue = localize(caseView.clue || patient?.hidden?.clue);
    const mainFinding = localize(Object.keys(patient?.medicalData?.physicalExamFindings || {})[0]) || t('emergency.maia.mainSymptom');

    return (
        <div
            className={`absolute inset-0 z-30 transition-all duration-300 ease-in-out ${showClue ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        >
            <div className={`h-full rounded-xl border-2 overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-slate-900/80 border-amber-500/30 shadow-amber-900/20' : 'bg-white/80 border-amber-300 shadow-amber-200/30'}`}
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
                <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'}`}>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/30">
                            <Brain size={14} />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{t('emergency.maia.clueTitle')}</span>
                    </div>
                    <button
                        onClick={() => setShowClue(false)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-amber-100 text-amber-600'}`}
                        title={t('emergency.maia.close')}
                    >
                        <XCircle size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className={`p-4 rounded-xl border-2 border-dashed text-sm italic leading-relaxed ${isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-200/90' : 'bg-amber-50/50 border-amber-200 text-amber-900'}`}>
                        {localizedClue || t('emergency.maia.clueFallback', { target: mainFinding })}
                    </div>
                </div>
            </div>
        </div>
    );
}
