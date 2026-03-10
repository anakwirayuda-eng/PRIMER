/**
 * @reflection
 * [IDENTITY]: CaseSpecificSelection
 * [PURPOSE]: React UI component: Tag-pill grid for anamnesis questions with arrow-key navigation.
 *            Shows compact keyword tags in 3-column, single-row visible layout.
 *            Arrow keys navigate: ←→ between columns, ↑↓ between rows (scrolls into view).
 * [STATE]: Experimental
 * [ANCHOR]: CaseSpecificSelection
 * [DEPENDS_ON]: AnamnesisEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-19
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { CheckCircle, Star, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { getInformantMode, adaptTextForGender, getTagLabel, GENERIC_QUESTIONS } from '../../../game/AnamnesisEngine.js';

const COLS = 3;

export default function CaseSpecificSelection({ patient, anamnesisCategory, hasAskedComplaint, caseData, anamnesisHistory, handleAskQuestion, isDark }) {
    const infoMode = getInformantMode(patient);
    const caseQuestions = caseData?.anamnesisQuestions?.[anamnesisCategory] || [];
    const genericQuestions = GENERIC_QUESTIONS[anamnesisCategory] || [];
    const essentialQuestions = caseData?.essentialQuestions || [];

    const [focusIdx, setFocusIdx] = useState(0);
    const [previewText, setPreviewText] = useState(null);
    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const gridRef = useRef(null);
    const btnRefs = useRef([]);
    const longPressTimer = useRef(null);

    // Combine questions — deduplicate by ID AND by normalized text
    let combinedQuestions = [...caseQuestions];
    const existingTexts = new Set(combinedQuestions.map(q => (q.text || '').toLowerCase().trim()));
    genericQuestions.forEach(gq => {
        if (!combinedQuestions.find(cq => cq.id === gq.id) && !existingTexts.has((gq.text || '').toLowerCase().trim())) {
            const caseOverride = caseData?.questionOverrides?.[gq.id];
            combinedQuestions.push(caseOverride ? { ...gq, response: caseOverride } : gq);
        }
    });

    const questions = combinedQuestions.filter(q => {
        if (hasAskedComplaint && (q.id === 'q_main_complaint' || q.id === 'q_main')) return false;
        return true;
    });

    // Reset focus when category changes
    useEffect(() => { setFocusIdx(0); }, [anamnesisCategory]);

    // Long-press handlers for touch preview
    const handleTouchStart = useCallback((text, e) => {
        const touch = e.touches[0];
        longPressTimer.current = setTimeout(() => {
            setPreviewText(text);
            setPreviewPos({ x: touch.clientX, y: touch.clientY - 60 });
        }, 300);
    }, []);
    const handleTouchEnd = useCallback(() => {
        clearTimeout(longPressTimer.current);
        setPreviewText(null);
    }, []);

    // Arrow key navigation
    const handleKeyDown = useCallback((e) => {
        const total = questions.length;
        if (total === 0) return;
        let next = focusIdx;

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                next = (focusIdx + 1) % total;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                next = (focusIdx - 1 + total) % total;
                break;
            case 'ArrowDown':
                e.preventDefault();
                next = Math.min(focusIdx + COLS, total - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                next = Math.max(focusIdx - COLS, 0);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (btnRefs.current[focusIdx]) btnRefs.current[focusIdx].click();
                return;
            default:
                return;
        }
        setFocusIdx(next);
        btnRefs.current[next]?.focus();
        btnRefs.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [focusIdx, questions.length]);

    // Visible row count for single-row display
    const totalRows = Math.ceil(questions.length / COLS);
    const currentRow = Math.floor(focusIdx / COLS);

    return (
        <div className="relative">
            {/* Row navigator hint */}
            {totalRows > 1 && (
                <div className={`absolute -right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-0.5 z-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <button
                        tabIndex={-1}
                        onClick={() => { const n = Math.max(focusIdx - COLS, 0); setFocusIdx(n); btnRefs.current[n]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }}
                        className={`p-0.5 rounded hover:bg-slate-700/50 transition-colors ${currentRow === 0 ? 'opacity-20' : 'opacity-70'}`}
                        aria-label="Baris sebelumnya"
                    >
                        <ChevronUp size={12} />
                    </button>
                    <span className="text-[8px] font-bold">{currentRow + 1}/{totalRows}</span>
                    <button
                        tabIndex={-1}
                        onClick={() => { const n = Math.min(focusIdx + COLS, questions.length - 1); setFocusIdx(n); btnRefs.current[n]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }}
                        className={`p-0.5 rounded hover:bg-slate-700/50 transition-colors ${currentRow >= totalRows - 1 ? 'opacity-20' : 'opacity-70'}`}
                        aria-label="Baris berikutnya"
                    >
                        <ChevronDown size={12} />
                    </button>
                </div>
            )}

            {/* Tag grid — single row visible, scroll for more */}
            <div
                ref={gridRef}
                onKeyDown={handleKeyDown}
                className="grid grid-cols-2 md:grid-cols-3 gap-1.5 max-h-[4.5rem] overflow-y-auto pr-5 thin-scrollbar scroll-smooth"
                role="grid"
                aria-label="Pertanyaan anamnesis"
            >
                {questions.map((q, idx) => {
                    const historyEntry = anamnesisHistory.find(h => h.id === q.id);
                    const isAsked = !!historyEntry;
                    const isVague = historyEntry?.isVague === true;
                    const isEssential = essentialQuestions.includes(q.id);
                    const tagLabel = getTagLabel(q.id, q.text);
                    const fullText = adaptTextForGender(q.text, patient, infoMode);
                    const isFocused = idx === focusIdx;

                    // Vague re-ask button
                    if (isAsked && isVague) {
                        return (
                            <button
                                key={q.id}
                                ref={el => btnRefs.current[idx] = el}
                                tabIndex={isFocused ? 0 : -1}
                                title={`🔄 ${fullText}\n(jawaban kurang jelas — tanyakan ulang)`}
                                onClick={() => handleAskQuestion({
                                    ...q,
                                    response: historyEntry.rawClinical || historyEntry.clarifiedResponse || q.response,
                                    isReask: true
                                })}
                                className={`px-2 py-1.5 rounded-full border-2 border-dashed text-tag text-center truncate transition-all
                                    ${isDark
                                        ? 'bg-amber-950/30 text-amber-400 border-amber-700/50 hover:bg-amber-900/40 hover:border-amber-500'
                                        : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 hover:border-amber-500'}
                                    ${isFocused ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900' : ''}
                                    hover:shadow-md`}
                                role="gridcell"
                                onTouchStart={(e) => handleTouchStart(fullText, e)}
                                onTouchEnd={handleTouchEnd}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <RotateCcw size={9} className="inline mr-0.5" />
                                {tagLabel}
                            </button>
                        );
                    }

                    return (
                        <button
                            key={q.id}
                            ref={el => btnRefs.current[idx] = el}
                            tabIndex={isFocused ? 0 : -1}
                            title={fullText}
                            onClick={() => handleAskQuestion(q)}
                            disabled={isAsked}
                            className={`px-2 py-1.5 rounded-full border text-tag text-center truncate transition-all
                                ${isAsked
                                    ? (isDark ? 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-default opacity-40' : 'bg-slate-100 text-slate-400 border-slate-100 cursor-default opacity-40')
                                    : isEssential
                                        ? (isDark ? 'bg-amber-950/30 text-amber-300 border-amber-700/50 hover:border-amber-400 hover:bg-amber-900/40 hover:shadow-sm' : 'bg-amber-50/80 text-amber-800 border-amber-300 hover:border-amber-500 hover:shadow-sm hover:bg-amber-100')
                                        : (isDark ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-blue-500 hover:bg-slate-700 hover:shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:shadow-sm hover:bg-blue-50')
                                }
                                ${isFocused && !isAsked ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : ''}
                            `}
                            role="gridcell"
                            onTouchStart={(e) => !isAsked && handleTouchStart(fullText, e)}
                            onTouchEnd={handleTouchEnd}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            {isAsked && <CheckCircle size={9} className="inline mr-0.5 opacity-60" />}
                            {isEssential && !isAsked && <Star size={9} className="inline mr-0.5 text-amber-500 fill-amber-500" />}
                            {tagLabel}
                        </button>
                    );
                })}
            </div>

            {/* Long-press preview tooltip (mobile) */}
            {previewText && (
                <div
                    className={`fixed z-50 max-w-[80vw] px-3 py-2 rounded-xl shadow-xl text-body-sm font-medium border pointer-events-none animate-fadeIn
                        ${isDark ? 'bg-slate-800 text-slate-100 border-slate-600' : 'bg-white text-slate-800 border-slate-200 shadow-lg'}`}
                    style={{ left: `${Math.max(16, Math.min(previewPos.x - 100, window.innerWidth - 250))}px`, top: `${Math.max(16, previewPos.y)}px` }}
                >
                    💬 {previewText}
                </div>
            )}
        </div>
    );
}
