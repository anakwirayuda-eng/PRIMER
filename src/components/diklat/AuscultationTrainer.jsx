/**
 * @reflection
 * [IDENTITY]: AuscultationTrainer
 * [PURPOSE]: Heart-sound auscultation mini-game — listen to a clip, classify
 *            Normal vs Abnormal, get feedback + score + XP. Lives as a Diklat tab.
 * [STATE]: MVP
 * [ANCHOR]: AuscultationTrainer
 * [DEPENDS_ON]: GameContext (addXp), SoundManager (SFX), auscultationClips
 * [LAST_UPDATE]: 2026-06-18
 *
 * Audio = native <audio controls loop> for accessibility (keyboard, replay,
 * scrub, screen-reader). Volume synced to the in-game master×clip level.
 * Feedback is visual + textual (never audio-only) — WCAG 1.2.1.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Stethoscope, CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy, Volume2 } from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { soundManager } from '../../utils/SoundManager.js';
import {
    AUSCULTATION_CHOICES,
    AUSCULTATION_EXPLAIN,
    AUSCULTATION_SOURCE,
    buildAuscultationRound,
} from '../../data/auscultationClips.js';

const ROUND_SIZE = 8;
const XP_PER_CORRECT = 12;

export default function AuscultationTrainer() {
    const { addXp, logCaseOutcome, settings } = useGame();
    const masterVol = settings?.volume ?? 1;

    const [round, setRound] = useState(() => buildAuscultationRound(ROUND_SIZE));
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const awardedRef = useRef(false);
    const audioRef = useRef(null);

    const current = round[index];
    const revealed = selected !== null;
    const isCorrect = revealed && selected === current.answer;

    // Sync the native audio element volume to the in-game master×clip level.
    // Depends on masterVol (from context settings) so live volume changes while
    // parked on a question re-sync — not just on question change.
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, masterVol * soundManager.clipVolume));
        }
    }, [index, masterVol]);

    // Auto-play the new clip when the question changes (best-effort; native
    // controls remain for manual replay if autoplay is blocked).
    useEffect(() => {
        const el = audioRef.current;
        if (el && !finished) {
            el.currentTime = 0;
            el.play().catch(() => { /* autoplay blocked — learner taps play */ });
        }
    }, [index, finished]);

    const handleAnswer = useCallback((choiceId) => {
        if (selected !== null) return;
        setSelected(choiceId);
        const ok = choiceId === current.answer;
        if (ok) {
            setCorrectCount((c) => c + 1);
            soundManager.playSuccess?.();
        } else {
            soundManager.playError?.();
        }
    }, [selected, current]);

    const next = useCallback(() => {
        if (index + 1 >= round.length) {
            setFinished(true);
        } else {
            setIndex((i) => i + 1);
            setSelected(null);
        }
    }, [index, round.length]);

    // Award XP once when the round finishes.
    useEffect(() => {
        if (finished && !awardedRef.current) {
            awardedRef.current = true;
            const xp = correctCount * XP_PER_CORRECT;
            if (xp > 0) addXp?.(xp);
            soundManager.playLevelUp?.();
            try {
                logCaseOutcome?.({
                    type: 'auscultation_round',
                    score: Math.round((correctCount / round.length) * 100),
                    total: round.length,
                    correct: correctCount,
                    xp,
                });
            } catch { /* logging is best-effort */ }
        }
    }, [finished, correctCount, round.length, addXp, logCaseOutcome]);

    const restart = useCallback(() => {
        setRound(buildAuscultationRound(ROUND_SIZE));
        setIndex(0);
        setSelected(null);
        setCorrectCount(0);
        setFinished(false);
        awardedRef.current = false;
    }, []);

    const scorePct = useMemo(
        () => (round.length ? Math.round((correctCount / round.length) * 100) : 0),
        [correctCount, round.length]
    );

    // ── Summary screen ──
    if (finished) {
        const grade = scorePct >= 80 ? 'emerald' : scorePct >= 50 ? 'amber' : 'rose';
        const gradeText = { emerald: 'text-emerald-400', amber: 'text-amber-400', rose: 'text-rose-400' }[grade];
        const gradeBar = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500' }[grade];
        return (
            <div className="flex flex-col items-center text-center gap-5 py-8 px-4">
                <Trophy size={56} className={gradeText} />
                <h3 className="text-xl font-black text-white">Sesi Selesai</h3>
                <div className="w-full max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Skor</span>
                        <span className={`font-mono font-bold ${gradeText}`}>{correctCount}/{round.length} — {scorePct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden bg-white/10">
                        <div className={`h-full ${gradeBar} transition-all duration-700`} style={{ width: `${scorePct}%` }} />
                    </div>
                </div>
                <p className="text-sm text-white/60 max-w-sm">
                    {scorePct >= 80 ? 'Telinga klinis yang tajam! 👂' : scorePct >= 50 ? 'Lumayan — ulangi untuk mengasah konsistensi.' : 'Latih terus — bedakan "lub-dub" bersih vs murmur.'}
                </p>
                <p className="text-xs text-emerald-400/80 font-bold">+{correctCount * XP_PER_CORRECT} XP</p>
                <button
                    onClick={restart}
                    className="mt-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-900/40"
                >
                    <RotateCcw size={16} /> Ulangi Sesi
                </button>
                <p className="text-[10px] text-white/30 mt-4 max-w-md">
                    Sumber audio: {AUSCULTATION_SOURCE.name} · {AUSCULTATION_SOURCE.license}
                </p>
            </div>
        );
    }

    // ── Question screen ──
    return (
        <div className="flex flex-col gap-5 py-4">
            {/* Progress + running score */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70">
                    <Stethoscope size={16} className="text-cyan-400" />
                    <span className="text-sm font-bold">Soal {index + 1} / {round.length}</span>
                </div>
                <span className="text-xs font-mono text-white/40">Benar: {correctCount}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
                <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${(index / round.length) * 100}%` }} />
            </div>

            {/* Audio player */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-cyan-500/15 flex items-center justify-center">
                    <Volume2 size={26} className="text-cyan-300" />
                </div>
                <p className="text-sm text-white/60 text-center">Dengarkan bunyi jantung, lalu klasifikasikan.</p>
                {/* native controls = accessible replay/scrub/keyboard */}
                <audio
                    ref={audioRef}
                    src={current.src}
                    controls
                    loop
                    preload="auto"
                    className="w-full max-w-sm"
                    aria-label={`Klip auskultasi jantung ${index + 1}`}
                />
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 gap-3">
                {AUSCULTATION_CHOICES.map((opt) => {
                    const isPicked = selected === opt.id;
                    const isAnswer = opt.id === current.answer;
                    let cls = 'bg-white/[0.03] border-white/10 hover:border-white/30 text-white';
                    if (revealed) {
                        if (isAnswer) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-200';
                        else if (isPicked) cls = 'bg-rose-500/15 border-rose-500 text-rose-200';
                        else cls = 'bg-white/[0.02] border-white/5 text-white/40';
                    }
                    return (
                        <button
                            key={opt.id}
                            onClick={() => handleAnswer(opt.id)}
                            disabled={revealed}
                            className={`px-4 py-3.5 rounded-xl border-2 transition-all text-left font-bold flex items-center justify-between ${cls} ${revealed ? 'cursor-default' : 'active:scale-[0.99]'}`}
                        >
                            <span>{opt.label}</span>
                            {revealed && isAnswer && <CheckCircle2 size={18} className="text-emerald-400" />}
                            {revealed && isPicked && !isAnswer && <XCircle size={18} className="text-rose-400" />}
                        </button>
                    );
                })}
            </div>

            {/* Feedback */}
            {revealed && (
                <div className={`rounded-xl border p-4 ${isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect
                            ? <><CheckCircle2 size={18} className="text-emerald-400" /><span className="text-emerald-400 font-bold text-sm">BENAR</span></>
                            : <><XCircle size={18} className="text-rose-400" /><span className="text-rose-400 font-bold text-sm">KURANG TEPAT</span></>}
                    </div>
                    <p className={`text-sm leading-relaxed ${isCorrect ? 'text-emerald-100/90' : 'text-rose-100/90'}`}>
                        {AUSCULTATION_EXPLAIN[current.answer]}
                    </p>
                    <button
                        onClick={next}
                        className="mt-3 w-full px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition"
                    >
                        {index + 1 >= round.length ? 'Lihat Hasil' : 'Soal Berikutnya'} <ChevronRight size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
