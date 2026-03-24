/**
 * @reflection
 * [IDENTITY]: DialogueLog
 * [PURPOSE]: React UI component: DialogueLog — Live Medical Transcript style.
 * [STATE]: Experimental
 * [ANCHOR]: DialogueLog
 * [DEPENDS_ON]: AnamnesisEngine
 * [LAST_UPDATE]: 2026-03-24
 */

import React from 'react';
import { Stethoscope, Activity, Mic, AlertTriangle, User, HeartPulse } from 'lucide-react';
import { adaptTextForGender, getInformantMode, getSpeakerLabel } from '../../../game/AnamnesisEngine.js';

/**
 * Get demeanor-driven icon props instead of emoji faces
 */
function getDemeanorIcon(patient, q) {
    if (q.isGreeting || q.isAcknowledgment) {
        return { icon: User, className: 'text-emerald-400', animate: false };
    }
    const d = (patient?.demeanor || '').toLowerCase();
    if (d.includes('dramatic') || d.includes('anxious') || d.includes('cemas')) {
        return { icon: HeartPulse, className: 'text-rose-400', animate: true };
    }
    if (d.includes('stoic')) {
        return { icon: Activity, className: 'text-slate-400', animate: false };
    }
    return { icon: Activity, className: 'text-emerald-400', animate: false };
}

export default function DialogueLog({ anamnesisHistory, patient, isDark, chatEndRef, isProcessing }) {
    if (anamnesisHistory.length === 0) {
        return (
            <div className={`flex-1 min-h-[200px] overflow-y-auto mb-2 p-4 ${isDark ? 'bg-[#0b1120] border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border inner-shadow`}>
                <div className="text-center text-slate-500 text-xs italic mt-4 font-mono tracking-wide">
                    [ AWAITING CLINICAL QUERY . . . ]
                </div>
                <div ref={chatEndRef} />
            </div>
        );
    }

    return (
        <div className={`flex-1 min-h-[200px] overflow-y-auto mb-2 space-y-4 p-4 ${isDark ? 'bg-[#0b1120] border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-xl border inner-shadow thin-scrollbar transition-colors`}>
            {anamnesisHistory.map((q, idx) => {
                const infoMode = getInformantMode(patient);
                const speakerLabel = getSpeakerLabel(q, patient);
                const demeanor = getDemeanorIcon(patient, q);
                const DemeanorIcon = demeanor.icon;

                return (
                    <div key={idx} className="flex flex-col gap-2.5 animate-fadeIn">
                        {/* Doctor query — system command style */}
                        <div className={`pl-3 border-l-2 ${q.isAcknowledgment ? 'border-emerald-500/50' : 'border-blue-500/50'}`}>
                            <div className="flex items-center gap-2 mb-1 opacity-60">
                                <Stethoscope size={12} className={q.isAcknowledgment ? 'text-emerald-400' : 'text-blue-400'} />
                                <span className={`font-mono text-[9px] font-bold tracking-widest uppercase ${q.isAcknowledgment ? 'text-emerald-400' : 'text-blue-400'}`}>
                                    SYS_QUERY // {q.category?.toUpperCase() || 'GENERAL'}
                                </span>
                            </div>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                "{adaptTextForGender(q.text, patient, infoMode)}"
                            </p>
                        </div>

                        {/* Patient response — audio transcript style */}
                        {q.response && (
                            <div className={`pl-3 border-l-2 py-0.5 ml-4 ${q.isVague ? 'border-amber-500/50' : 'border-emerald-500/50'}`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <DemeanorIcon
                                        size={12}
                                        className={`${demeanor.className} ${demeanor.animate ? 'animate-pulse' : ''}`}
                                    />
                                    <span className={`font-mono text-[9px] font-bold tracking-widest uppercase ${q.isVague ? 'text-amber-500' : q.isChildDirect ? 'text-amber-400' : 'text-emerald-500'}`}>
                                        AUDIO_TRANSCRIPT // {speakerLabel?.toUpperCase() || 'PATIENT'}
                                    </span>
                                    {q.isVague && (
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 flex items-center gap-1 text-[8px] font-bold uppercase animate-pulse">
                                            <AlertTriangle size={8} /> VAGUE
                                        </span>
                                    )}
                                </div>
                                <p className={`text-[14px] leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'} ${q.isVague ? 'opacity-60 italic' : ''}`}>
                                    {q.response}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* M.A.I.A Transcribing indicator — covers groggy delay */}
            {isProcessing && (
                <div className="pl-3 border-l-2 border-slate-500/30 py-2 ml-4 animate-pulse">
                    <div className="flex items-center gap-2">
                        <Mic size={12} className="text-slate-400 animate-bounce" />
                        <span className="font-mono text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                            M.A.I.A TRANSCRIBING . . .
                        </span>
                    </div>
                </div>
            )}

            <div ref={chatEndRef} className="h-4" />
        </div>
    );
}
