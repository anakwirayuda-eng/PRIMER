/**
 * @reflection
 * [IDENTITY]: NarrativeOverlay
 * [PURPOSE]: Displays branching narrative dialogue and choices for the Story Engine.
 * [STATE]: Experimental
 * [ANCHOR]: NarrativeOverlay
 * [DEPENDS_ON]: GameContext, StoryDatabase
 */
import React from 'react';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import { STORY_TEMPLATES } from '../game/StoryDatabase.js';
import { MessageSquare, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';

export default function NarrativeOverlay({ storyInstance, onClose }) {
    const { advanceStory } = useGame();
    const modalRef = useModalA11y(onClose);

    if (!storyInstance) return null;

    const template = STORY_TEMPLATES.find(t => t.id === storyInstance.templateId);
    if (!template) return null;

    const currentNode = template.nodes[storyInstance.currentNodeId];
    if (!currentNode) return null;

    const handleChoice = (choice) => {
        advanceStory(storyInstance, choice);
        if (choice.nextNode === null || template.nodes[choice.nextNode]?.isEnd) {
            // Optional: small delay or auto-close logic
        }
    };

    return (
        <div className="fixed inset-0 z-hud bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="narrative-title" className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border-4 border-slate-900 animate-in zoom-in-95 duration-200">
                {/* Header (Quest Info) */}
                <div className="bg-slate-900 p-4 border-b border-white/10 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-black opacity-60">Cerita Aktif</h4>
                            <h3 className="text-sm font-black tracking-tight uppercase">{template.title}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                        aria-label="Tutup cerita"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (The Text) */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Character/Speaker (Optional extension in template) */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 border-2 border-indigo-200">
                            <MessageSquare className="text-indigo-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100 relative shadow-sm">
                                <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-slate-50 border-b-[8px] border-b-transparent"></div>
                                <p className="text-slate-700 font-medium leading-relaxed text-lg">
                                    {currentNode.text}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Choices */}
                    <div className="space-y-3 mt-8">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tentukan Pilihanmu:</h5>
                        {currentNode.choices.map((choice, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleChoice(choice)}
                                className="w-full group flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left shadow-sm hover:shadow-md active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="font-bold text-slate-800">{choice.text}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {choice.impact && (
                                        <div className="hidden md:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            {choice.impact.reputation && (
                                                <span className={`text-[10px] font-black ${choice.impact.reputation > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {choice.impact.reputation > 0 ? '+' : ''}{choice.impact.reputation} Reputasi
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer (Hint) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                    <AlertCircle size={14} />
                    <span>Pilihanmu berpengaruh pada jalannya cerita dan kondisi game.</span>
                </div>
            </div>
        </div>
    );
}
