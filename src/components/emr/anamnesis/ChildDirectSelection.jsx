/**
 * @reflection
 * [IDENTITY]: ChildDirectSelection
 * [PURPOSE]: React UI component: compact tag-pill format for child direct questions.
 * [STATE]: Experimental
 * [ANCHOR]: ChildDirectSelection
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-19
 */

import React from 'react';
import { getChildDirectQuestions, getTagLabel } from '../../../game/AnamnesisEngine.js';

export default function ChildDirectSelection({ patient, anamnesisHistory, handleAskQuestion }) {
    const childQs = getChildDirectQuestions(patient, patient.complaint);
    if (childQs.length === 0) return null;

    const unaskedChildQs = childQs.filter(q => !anamnesisHistory.some(h => h.id === q.id));
    if (unaskedChildQs.length === 0) return null;

    return (
        <div className="mb-2 p-1.5 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-lg">
            <p className="text-tag text-amber-700 dark:text-amber-400 mb-1.5 font-medium">👶 Tanya langsung ke anak:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {unaskedChildQs.map((q) => (
                    <button
                        key={q.id}
                        title={q.text}
                        onClick={() => handleAskQuestion(q)}
                        className="px-2 py-1.5 rounded-full border text-tag text-center truncate transition-all bg-white dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50 hover:border-amber-500 hover:shadow-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 font-medium"
                    >
                        🗣️ {getTagLabel(q.id, q.text)}
                    </button>
                ))}
            </div>
        </div>
    );
}
