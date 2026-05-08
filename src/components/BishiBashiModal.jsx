/**
 * @reflection
 * [IDENTITY]: BishiBashiModal
 * [PURPOSE]: Opt-in dispensing challenge modal — "Pharmacovigilance Rush".
 *            Player picks correct medications from shuffled grid under time pressure.
 *            LASA (Look-Alike Sound-Alike) distractors test real-world clinical awareness.
 * [STATE]: Experimental
 * [ANCHOR]: BishiBashiModal
 * [DEPENDS_ON]: DispensingEngine (generateDispensingChallenge, scoreBishiBashi)
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Clock, Target, XCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { generateDispensingChallenge, scoreBishiBashi } from '../game/DispensingEngine.js';
import { getMedicationById } from '../data/MedicationDatabase.js';
import { useTheme } from '../context/ThemeContext';

/**
 * BishiBashiModal — Speed-accuracy dispensing challenge.
 *
 * @param {Object} props
 * @param {Object[]} props.prescriptionQueue - Current pharmacy queue items
 * @param {number} props.difficulty - 1-5, scales distractors and time
 * @param {Function} props.onComplete - Called with { xpEarned, accuracy, speed }
 * @param {Function} props.onDismiss - Cancel
 */
export default function BishiBashiModal({ prescriptionQueue = [], difficulty = 1, onComplete, onDismiss }) {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const [phase, setPhase] = useState('ready'); // ready | playing | result
    const [selectedMeds, setSelectedMeds] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [result, setResult] = useState(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const selectedMedsRef = useRef([]);
    const challenge = useMemo(
        () => generateDispensingChallenge(difficulty, prescriptionQueue),
        [difficulty, prescriptionQueue]
    );

    const handleStart = useCallback(() => {
        setPhase('playing');
        setSelectedMeds([]);
        setTimeElapsed(0);
    }, []);

    const handleToggleMed = useCallback((medId) => {
        setSelectedMeds(prev =>
            prev.includes(medId)
                ? prev.filter(m => m !== medId)
                : [...prev, medId]
        );
    }, []);

    useEffect(() => {
        selectedMedsRef.current = selectedMeds;
    }, [selectedMeds]);

    const handleSubmit = useCallback((timeout = false) => {
        clearInterval(timerRef.current);
        timerRef.current = null;
        if (!challenge) return;
        const elapsed = timeout ? challenge.timeLimit * 1000 : (Date.now() - startTimeRef.current);
        const score = scoreBishiBashi(
            challenge.targetMeds,
            selectedMedsRef.current,
            elapsed,
            challenge.timeLimit * 1000
        );
        setResult(score);
        setPhase('result');
    }, [challenge]);

    // Timer logic
    useEffect(() => {
        if (phase !== 'playing' || !challenge) return;
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            setTimeElapsed(elapsed);
            if (elapsed >= challenge.timeLimit * 1000) {
                handleSubmit(true);
            }
        }, 50);
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [phase, challenge, handleSubmit]);

    if (!challenge) return null;

    const timeLimitMs = challenge.timeLimit * 1000;
    const progress = phase === 'playing' ? Math.max(0, 1 - timeElapsed / timeLimitMs) : 1;
    const fuseColor = progress > 0.5 ? 'bg-emerald-500' : progress > 0.2 ? 'bg-amber-500' : 'bg-red-500';
    const getFeedback = () => {
        if (!result) return '';
        if (result.accuracy === 100 && result.wrong === 0) return t('bishiBashi.feedback.perfect');
        if (result.accuracy >= 80) return t('bishiBashi.feedback.near');
        if (result.accuracy >= 50) return t('bishiBashi.feedback.partial');
        return t('bishiBashi.feedback.poor');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-white'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-4 relative">
                    <button onClick={onDismiss} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/20 transition-colors">
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/15 rounded-xl">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black tracking-tight">PHARMACOVIGILANCE RUSH</h2>
                            <p className="text-[10px] text-white/60 font-medium">
                                {t('bishiBashi.subtitle', { level: difficulty, count: challenge.targetMeds.length })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* READY PHASE */}
                    {phase === 'ready' && (
                        <div className="text-center py-8 space-y-4">
                            <div className={`inline-flex p-4 rounded-2xl ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                                <Target size={48} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {t('bishiBashi.prescription', { patient: challenge.challenge.patientName })}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {t('bishiBashi.instruction', { count: challenge.targetMeds.length })}
                                </p>
                            </div>
                            <div className={`text-xs font-mono ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                {t('bishiBashi.prescribed')}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {challenge.challenge.items.map((item, i) => (
                                    <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                            <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Clock size={12} className="inline mr-1" />
                                {t('bishiBashi.timeLimit', { seconds: challenge.timeLimit })}
                            </div>
                            <button
                                onClick={handleStart}
                                className="px-6 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                <Zap size={16} className="inline mr-2" />
                                {t('bishiBashi.start')}
                            </button>
                        </div>
                    )}

                    {/* PLAYING PHASE */}
                    {phase === 'playing' && (
                        <div className="space-y-4">
                            {/* Fuse Timer */}
                            <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div
                                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-100 ${fuseColor}`}
                                    style={{ width: `${progress * 100}%` }}
                                />
                            </div>
                            <div className={`text-center text-xs font-mono font-bold ${progress < 0.2 ? 'text-red-500 animate-pulse' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {Math.max(0, Math.ceil((timeLimitMs - timeElapsed) / 1000))}s
                            </div>

                            {/* Prescription reminder */}
                            <div className={`p-3 rounded-xl text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                <span className="font-bold">{t('bishiBashi.prescriptionLabel')}</span>{' '}
                                {challenge.challenge.items.map(i => i.name).join(', ')}
                            </div>

                            {/* Medication Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {challenge.allMeds.map((medId) => {
                                    const med = getMedicationById(medId);
                                    const isSelected = selectedMeds.includes(medId);
                                    return (
                                        <button
                                            key={medId}
                                            onClick={() => handleToggleMed(medId)}
                                            className={`p-3 rounded-xl text-left transition-all duration-150 border-2 ${isSelected
                                                    ? `scale-[1.02] ${isDark ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-900/20' : 'bg-amber-50 border-amber-400 shadow-md'}`
                                                    : `${isDark ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`
                                                }`}
                                        >
                                            <div className={`text-[11px] font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {med?.name || medId}
                                            </div>
                                            <div className={`text-[9px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {med?.form || '?'} - {med?.type || ''}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Submit */}
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={selectedMeds.length === 0}
                                className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${selectedMeds.length > 0
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                                        : `${isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'} cursor-not-allowed`
                                    }`}
                            >
                                {t('bishiBashi.submit', { selected: selectedMeds.length, total: challenge.targetMeds.length })}
                            </button>
                        </div>
                    )}

                    {/* RESULT PHASE */}
                    {phase === 'result' && result && (
                        <div className="text-center py-6 space-y-4">
                            {/* Score */}
                            <div className={`inline-flex p-4 rounded-2xl ${result.accuracy === 100 && result.wrong === 0
                                    ? isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                                    : result.accuracy >= 50
                                        ? isDark ? 'bg-amber-500/10' : 'bg-amber-50'
                                        : isDark ? 'bg-red-500/10' : 'bg-red-50'
                                }`}>
                                {result.accuracy === 100 && result.wrong === 0
                                    ? <CheckCircle2 size={48} className="text-emerald-500" />
                                    : result.accuracy >= 50
                                        ? <AlertTriangle size={48} className="text-amber-500" />
                                        : <XCircle size={48} className="text-red-500" />
                                }
                            </div>

                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {getFeedback()}
                            </p>
                            {result.feedback && (
                                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {result.feedback}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className={`text-xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{result.accuracy}%</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('bishiBashi.accuracy')}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className={`text-xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{result.speed}%</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('bishiBashi.speed')}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className={`text-xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>+{result.xpEarned}</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>XP</div>
                                </div>
                            </div>

                            {/* Detail */}
                            {(result.wrong > 0 || result.missed > 0) && (
                                <div className={`p-3 rounded-xl text-xs text-left space-y-1 ${isDark ? 'bg-red-500/5 text-red-300' : 'bg-red-50 text-red-700'}`}>
                                    {result.wrong > 0 && <p>X {t('bishiBashi.wrong', { count: result.wrong })}</p>}
                                    {result.missed > 0 && <p>WARN {t('bishiBashi.missed', { count: result.missed })}</p>}
                                </div>
                            )}

                            {result.combo > 0 && (
                                <div className={`text-xs font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {t('bishiBashi.combo', { combo: result.combo })}
                                </div>
                            )}

                            <button
                                onClick={() => onComplete?.(result)}
                                className="px-6 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r from-slate-600 to-indigo-700 hover:from-slate-700 hover:to-indigo-800 transition-all shadow-lg"
                            >
                                {t('bishiBashi.finish')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
