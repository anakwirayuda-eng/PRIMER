import React from 'react';
import { AlertTriangle, Stethoscope, UserRound } from 'lucide-react';
import { adaptTextForGender, getInformantMode, getSpeakerLabel } from '../../../game/AnamnesisEngine.js';

function formatPseudoTime(idx, offset = 0) {
    const totalMinutes = (8 * 60) + (idx * 2) + offset;
    const hour = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minute = String(totalMinutes % 60).padStart(2, '0');
    return `${hour}:${minute}`;
}

function BubbleTail({ side, className }) {
    const sideClass = side === 'left' ? '-left-1' : '-right-1';
    return (
        <span
            aria-hidden="true"
            className={`absolute bottom-3 h-3 w-3 rotate-45 ${sideClass} ${className}`}
        />
    );
}

function TypingDots({ isDark }) {
    return (
        <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
                <span
                    key={idx}
                    className={`h-2 w-2 rounded-full ${isDark ? 'bg-slate-300' : 'bg-slate-500'}`}
                    style={{
                        animation: `dialogue-bounce 0.9s ${idx * 0.12}s infinite ease-in-out`,
                    }}
                />
            ))}
        </div>
    );
}

export default function DialogueLog({ anamnesisHistory, patient, isDark, chatEndRef, isProcessing }) {
    const informantMode = getInformantMode(patient);

    if (anamnesisHistory.length === 0) {
        return (
            <div className={`mb-2 flex-1 overflow-y-auto rounded-xl border p-4 ${isDark ? 'border-slate-800 bg-[#0b1120]' : 'border-slate-200 bg-slate-50'} inner-shadow`}>
                <div className="mt-4 text-center font-mono text-xs italic tracking-wide text-slate-500">
                    [ MENUNGGU PERTANYAAN KLINIS ]
                </div>
                <div ref={chatEndRef} />
            </div>
        );
    }

    return (
        <div className={`mb-2 flex-1 overflow-y-auto rounded-xl border p-4 ${isDark ? 'border-slate-800 bg-[#0b1120]' : 'border-slate-200 bg-slate-50'} inner-shadow thin-scrollbar transition-colors`}>
            <style>
                {`@keyframes dialogue-bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }`}
            </style>

            <div className="space-y-4">
                {anamnesisHistory.map((question, idx) => {
                    const speakerLabel = question.speaker || getSpeakerLabel(question, patient) || 'Pasien';
                    const doctorTime = formatPseudoTime(idx, 0);
                    const patientTime = formatPseudoTime(idx, 1);
                    const doctorText = adaptTextForGender(question.text, patient, informantMode);

                    const doctorBubbleClass = isDark
                        ? 'border-emerald-500 bg-slate-800/85 text-slate-100'
                        : 'border-emerald-300 bg-white text-slate-900 shadow-sm';
                    const patientBubbleClass = question.isVague
                        ? (isDark ? 'border-amber-500 bg-amber-500/10 text-amber-100' : 'border-amber-300 bg-amber-50 text-amber-950')
                        : (isDark ? 'border-indigo-500 bg-indigo-950/40 text-white' : 'border-indigo-200 bg-indigo-50 text-slate-900');

                    return (
                        <div key={idx} className="space-y-2.5">
                            <div className="flex justify-start">
                                <div className="relative max-w-[85%] sm:max-w-[80%]">
                                    <div className={`relative rounded-2xl border-l-4 px-4 py-3 ${doctorBubbleClass}`}>
                                        <BubbleTail
                                            side="left"
                                            className={isDark ? 'border-l border-t border-emerald-500 bg-slate-800/85' : 'border-l border-t border-emerald-200 bg-white'}
                                        />

                                        <div className="mb-1 flex items-center gap-2">
                                            <Stethoscope size={12} className="text-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-500">
                                                Dokter
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed">
                                            {doctorText}
                                        </p>

                                        <div className={`mt-2 text-right text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            {doctorTime}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {question.response && (
                                <div className="flex justify-end">
                                    <div className="relative max-w-[85%] sm:max-w-[80%]">
                                        <div className={`relative rounded-2xl border-r-4 px-4 py-3 ${patientBubbleClass}`}>
                                            <BubbleTail
                                                side="right"
                                                className={question.isVague
                                                    ? (isDark ? 'border-r border-t border-amber-500 bg-amber-500/10' : 'border-r border-t border-amber-300 bg-amber-50')
                                                    : (isDark ? 'border-r border-t border-indigo-500 bg-indigo-950/40' : 'border-r border-t border-indigo-200 bg-indigo-50')}
                                            />

                                            <div className="mb-1 flex items-center justify-end gap-2">
                                                {question.isVague && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-500">
                                                        <AlertTriangle size={10} />
                                                        Vague
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${question.isVague ? 'text-amber-500' : (isDark ? 'text-indigo-300' : 'text-indigo-700')}`}>
                                                    {speakerLabel}
                                                </span>
                                                <UserRound size={12} className={question.isVague ? 'text-amber-500' : (isDark ? 'text-indigo-300' : 'text-indigo-700')} />
                                            </div>

                                            <p className={`text-sm leading-relaxed ${question.isVague ? 'italic' : ''}`}>
                                                {question.response}
                                            </p>

                                            <div className={`mt-2 text-left text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {patientTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Codex Fix [Medium-High]: Typing indicator was showing MAIA,
                    but isProcessing fires during getAdaptiveResponse() which generates
                    the PATIENT's answer. Now shows patient/informant typing bubble. */}
                {isProcessing && (
                    <div className="flex justify-end">
                        <div className="relative max-w-[85%] sm:max-w-[80%]">
                            <div className={`relative rounded-2xl border-r-4 px-4 py-3 ${isDark ? 'border-indigo-500 bg-indigo-950/40 text-white' : 'border-indigo-200 bg-indigo-50 text-slate-900'}`}>
                                <BubbleTail
                                    side="right"
                                    className={isDark ? 'border-r border-t border-indigo-500 bg-indigo-950/40' : 'border-r border-t border-indigo-200 bg-indigo-50'}
                                />

                                <div className="mb-1 flex items-center justify-end gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                        {getSpeakerLabel(null, patient)}
                                    </span>
                                    <UserRound size={12} className={isDark ? 'text-indigo-300' : 'text-indigo-700'} />
                                </div>
                                <TypingDots isDark={isDark} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div ref={chatEndRef} className="h-4" />
        </div>
    );
}
