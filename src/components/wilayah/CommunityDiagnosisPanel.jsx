import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Shield, CheckCircle, XCircle, ChevronRight, Activity } from 'lucide-react';
import { soundManager } from '../../utils/SoundManager.js';
import EliteCOMBWheel from './EliteCOMBWheel.jsx';
import { getScenarioById } from '../../content/scenarios/IKMScenarioLibrary.js';

export default function CommunityDiagnosisPanel({ eventInstance, onClose }) {
    const { advanceIKMPhase, resolveIKMEvent } = useGame();
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [evaluating, setEvaluating] = useState(false);
    const [stepResult, setStepResult] = useState(null); // { isSuccess: true/false, feedback: '...' }

    if (!eventInstance || eventInstance.completed) {
        return null;
    }

    // Determine current phase from the scenario definition
    // Note: In a real app we'd import getScenarioById from IKMScenarioLibrary,
    // but we can also just rely on eventInstance state if we keep phases simple.
    // Wait, we need the phase definition.
    const scenarioDef = getScenarioById(eventInstance.scenarioId);
    const phase = scenarioDef?.phases.find(p => p.id === eventInstance.currentPhaseId);

    if (!phase) return null;

    const handleChoice = (choice, index) => {
        soundManager.playClick();
        advanceIKMPhase(eventInstance.instanceId, choice.nextNode || choice.nextPhase, choice.impact, {
            phaseId: phase.id, choiceIndex: index, choiceText: choice.text
        });
    };

    const handleDiagnosisSubmit = () => {
        const choice = phase.choices[selectedAnswers.diagnosis || 0];
        setEvaluating(true);
        setTimeout(() => {
            soundManager.playNotification();
            setStepResult({
                isSuccess: choice.isCorrect,
                feedback: choice.feedback
            });
            setTimeout(() => {
                setEvaluating(false);
                setStepResult(null);
                setSelectedAnswers({});
                advanceIKMPhase(eventInstance.instanceId, phase.nextPhase, choice.isCorrect ? { iks_score: 1, xp: 50 } : { xp: 10 });
            }, 3000);
        }, 1000);
    };

    const handleInterventionSubmit = () => {
        let correctCount = 0;
        const total = 6; // 5W1H
        const qKeys = ['who', 'what', 'where', 'when', 'why', 'how'];

        qKeys.forEach(k => {
            if (selectedAnswers[k] === phase[k].correct) correctCount++;
        });

        const isSuccess = correctCount >= 4;

        setEvaluating(true);
        setTimeout(() => {
            if (isSuccess) soundManager.playSuccess();
            else soundManager.playError();

            setStepResult({
                isSuccess,
                feedback: isSuccess
                    ? `Intervensi disusun dengan baik! (${correctCount}/${total} tepat)`
                    : `Perencanaan intervensi kurang tepat sasaran (${correctCount}/${total}). Evaluasi kembali!`
            });

            setTimeout(() => {
                setEvaluating(false);
                setStepResult(null);
                advanceIKMPhase(eventInstance.instanceId, isSuccess ? 'resolution_success' : 'resolution_fail', {}, null);
                // Also trigger resolve if it's the last step. (resolution phase will handle it)
            }, 3000);
        }, 1500);
    };

    const renderDialog = () => (
        <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="p-6 bg-slate-900 border-b border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl">
                    {eventInstance.icon}
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">{eventInstance.title}</h3>
                    <p className="text-xs text-white/50">{phase.speaker || 'Laporan Kasus'}</p>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-lg text-white/90 leading-relaxed italic mb-8">"{phase.text}"</p>
                {phase.choices && (
                    <div className="space-y-3">
                        {phase.choices.map((c, i) => (
                            <button key={i} onClick={() => handleChoice(c, i)} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
                                <span className="text-white/80 font-medium group-hover:text-white">{c.text}</span>
                                <ChevronRight size={16} className="text-white/30 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                )}
                {phase.isEnd && (
                    <button onClick={() => { resolveIKMEvent(eventInstance.instanceId); onClose?.(); }} className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-all">
                        Tutup Laporan
                    </button>
                )}
            </div>
        </div>
    );

    const renderCombAnalysis = () => (
        <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl">
            <div className="p-4 bg-blue-950 border-b border-blue-500/30 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-blue-100">Analisis COM-B</h3>
                    <p className="text-xs text-blue-300/70">{phase.description}</p>
                </div>
                <button onClick={() => advanceIKMPhase(eventInstance.instanceId, phase.nextPhase)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-bold transition-all">
                    Selesai Analisis
                </button>
            </div>
            <div className="flex-1 relative overflow-hidden bg-black/40 p-4 flex items-center justify-center">
                <EliteCOMBWheel activeBarriers={phase.activeBarriers || []} size={400} />
            </div>
        </div>
    );

    const renderDiagnosisQnA = () => (
        <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl">
            <div className="p-6 bg-purple-950 border-b border-purple-500/30">
                <h3 className="text-xl font-black text-purple-100 mb-2">Diagnosis Komunitas</h3>
                <p className="text-sm text-purple-200/80 leading-relaxed">{phase.question}</p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {phase.choices.map((c, i) => (
                    <div key={i}
                        onClick={() => !evaluating && setSelectedAnswers({ diagnosis: i })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAnswers.diagnosis === i ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                    >
                        <p className="text-white/90 font-medium">{c.text}</p>
                    </div>
                ))}
            </div>
            <div className="p-6 border-t border-white/10 bg-black/40">
                {stepResult ? (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${stepResult.isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                        {stepResult.isSuccess ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <p className="font-bold">{stepResult.feedback}</p>
                    </div>
                ) : (
                    <button
                        disabled={selectedAnswers.diagnosis === undefined || evaluating}
                        onClick={handleDiagnosisSubmit}
                        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg transition-all"
                    >
                        {evaluating ? 'Menganalisis...' : 'Tetapkan Diagnosis'}
                    </button>
                )}
            </div>
        </div>
    );

    const renderInterventionQnA = () => {
        const questions = [
            { key: 'who', label: 'Who', icon: '👥', data: phase.who },
            { key: 'what', label: 'What', icon: '🎯', data: phase.what },
            { key: 'where', label: 'Where', icon: '📍', data: phase.where },
            { key: 'when', label: 'When', icon: '⏱️', data: phase.when },
            { key: 'why', label: 'Why', icon: '❓', data: phase.why },
            { key: 'how', label: 'How', icon: '🛠️', data: phase.how }
        ];

        return (
            <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl">
                <div className="p-6 bg-emerald-950 border-b border-emerald-500/30">
                    <h3 className="text-xl font-black text-emerald-100">Perencanaan Intervensi (5W1H)</h3>
                    <p className="text-xs text-emerald-200/60 mt-1">Lengkapi rencana tindakan puskesmas.</p>
                </div>
                <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 gap-4">
                    {questions.map(q => (
                        <div key={q.key} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col">
                            <span className="text-xs font-black text-emerald-400 mb-2 uppercase tracking-widest flex items-center gap-1">{q.icon} {q.label}</span>
                            <p className="text-sm text-white/90 font-medium mb-3 flex-1">{q.data.question}</p>
                            <select
                                className="w-full bg-slate-900 border border-white/20 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                                value={selectedAnswers[q.key] || ''}
                                onChange={e => setSelectedAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                                disabled={evaluating}
                            >
                                <option value="" disabled>Pilih jawaban...</option>
                                {q.data.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t border-white/10 bg-black/40">
                    {stepResult ? (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${stepResult.isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                            {stepResult.isSuccess ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            <p className="font-bold">{stepResult.feedback}</p>
                        </div>
                    ) : (
                        <button
                            disabled={Object.keys(selectedAnswers).length < 6 || evaluating}
                            onClick={handleInterventionSubmit}
                            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Activity size={20} />
                            {evaluating ? 'Memproses...' : 'Eksekusi Intervensi'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl h-full max-h-[85vh] relative">
                <button onClick={onClose} className="absolute -top-12 right-0 text-white/50 hover:text-white px-4 py-2 flex items-center gap-2 rounded-full border border-white/10 hover:border-white/30 transition-all font-bold text-xs uppercase tracking-widest">
                    <XCircle size={16} /> Tutup
                </button>
                {phase.type === 'dialog' && renderDialog()}
                {phase.type === 'comb_analysis' && renderCombAnalysis()}
                {phase.type === 'diagnosisQnA' && renderDiagnosisQnA()}
                {phase.type === 'interventionQnA' && renderInterventionQnA()}
            </div>
        </div>
    );
}
