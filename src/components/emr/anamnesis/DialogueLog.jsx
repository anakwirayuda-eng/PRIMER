/**
 * @reflection
 * [IDENTITY]: DialogueLog
 * [PURPOSE]: React UI component: DialogueLog with flex-grow layout for maximum chat room.
 * [STATE]: Experimental
 * [ANCHOR]: DialogueLog
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-19
 */

import React from 'react';
import { adaptTextForGender, getInformantMode, getSpeakerLabel } from '../../../game/AnamnesisEngine.js';

export default function DialogueLog({ anamnesisHistory, patient, isDark, chatEndRef }) {
    if (anamnesisHistory.length === 0) {
        return (
            <div className={`flex-1 min-h-[200px] overflow-y-auto mb-2 p-2 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded border inner-shadow`}>
                <div className="text-center text-slate-400 text-xs italic mt-4">
                    Mulai anamnesis dengan memilih pertanyaan di bawah.
                </div>
                <div ref={chatEndRef} />
            </div>
        );
    }

    return (
        <div className={`flex-1 min-h-[200px] overflow-y-auto mb-2 space-y-3 p-2 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded border inner-shadow thin-scrollbar transition-colors`}>
            {anamnesisHistory.map((q, idx) => {
                const infoMode = getInformantMode(patient);
                const speakerLabel = getSpeakerLabel(q, patient);
                return (
                    <div key={idx} className="flex flex-col gap-1.5 text-body-sm animate-fadeIn">
                        {/* Doctor bubble — right aligned (like WhatsApp "you") */}
                        <div className={`p-2.5 rounded-xl rounded-tr-none self-end max-w-[85%] border shadow-sm ${q.isAcknowledgment ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800'}`}>
                            <span className={`font-bold block text-caption ${q.isAcknowledgment ? 'text-emerald-700 dark:text-emerald-300' : 'text-blue-700 dark:text-blue-300'} mb-0.5`}>🩺 Dokter</span>
                            {adaptTextForGender(q.text, patient, infoMode)}
                        </div>
                        {/* Patient bubble — left aligned with expression avatar */}
                        {q.response && (
                            <div className="flex items-end gap-1.5 self-start max-w-[85%]">
                                {/* Expression avatar */}
                                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm border ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                                    {q.isGreeting || q.isAcknowledgment ? '😊'
                                        : patient?.demeanor?.toLowerCase().includes('dramatic') ? '😰'
                                            : patient?.demeanor?.toLowerCase().includes('anxious') || patient?.demeanor?.toLowerCase().includes('cemas') ? '😟'
                                                : patient?.demeanor?.toLowerCase().includes('stoic') ? '😐'
                                                    : '🙂'}
                                </div>
                                <div className={`p-2.5 rounded-xl rounded-tl-none flex-1 shadow-sm border ${q.isChildDirect ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`} title={q.metadata ? JSON.stringify(q.metadata, null, 2) : undefined}>
                                    <span className={`font-bold block text-caption ${q.isChildDirect ? 'text-amber-600 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'} mb-0.5`}>🗣️ {speakerLabel || 'Pasien'}</span>
                                    {q.response}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            <div ref={chatEndRef} />
        </div>
    );
}
