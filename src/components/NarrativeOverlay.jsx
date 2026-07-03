/**
 * @reflection
 * [IDENTITY]: NarrativeOverlay
 * [PURPOSE]: Displays branching narrative dialogue and choices for the Story Engine.
 * [STATE]: Experimental
 * [ANCHOR]: NarrativeOverlay
 * [DEPENDS_ON]: GameContext, StoryDatabase
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import { STORY_TEMPLATES } from '../game/StoryDatabase.js';
import { MessageSquare, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { getAvailableOperationalFunds } from '../utils/operationalFunds.js';
import { showToast } from '../utils/ToastManager.js';

export default function NarrativeOverlay({ storyInstance, onClose }) {
    const { t, i18n } = useTranslation();
    const { advanceStory, stats } = useGame();
    const modalRef = useModalA11y(onClose);
    const availableFunds = Number(stats?.availableFunds ?? getAvailableOperationalFunds(stats));
    const currencyFormatter = new Intl.NumberFormat(i18n.language === 'id' ? 'id-ID' : 'en-US');

    if (!storyInstance) return null;

    const template = STORY_TEMPLATES.find(t => t.id === storyInstance.templateId);
    if (!template) return null;

    const currentNode = template.nodes[storyInstance.currentNodeId];
    if (!currentNode) return null;
    const isActionNode = currentNode.type === 'action';
    const choiceList = Array.isArray(currentNode.choices) ? currentNode.choices : [];
    const progressTarget = Math.max(0, Number(currentNode.target) || 0);
    const progressValue = Math.max(0, Number(storyInstance.progress) || 0);
    const progressPercent = progressTarget > 0
        ? Math.min(100, Math.round((progressValue / progressTarget) * 100))
        : 0;
    const narrativeText = currentNode.text || currentNode.description || t('narrative.active_default');

    const handleChoice = (choice) => {
        const requiredFunds = Math.max(0, -(Number(choice?.impact?.balance) || 0));
        if (requiredFunds > availableFunds) {
            showToast(t('narrative.insufficient_funds'), 'warning');
            return;
        }

        const result = advanceStory(storyInstance, choice);
        if (result && result.success === false) {
            showToast(result.message || t('narrative.choice_unavailable'), 'warning');
            return;
        }
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
                            <h4 className="text-[10px] uppercase tracking-widest font-black opacity-60">{t('narrative.active_title')}</h4>
                            <h3 className="text-sm font-black tracking-tight uppercase">{template.title}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                        aria-label={t('narrative.close_aria')}
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
                                    {narrativeText}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isActionNode ? (
                        <div className="space-y-4 mt-8">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('narrative.progress_title')}</h5>
                            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                            {currentNode.metric?.replace(/_/g, ' ') || t('narrative.action_goal')}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('narrative.progress_help')}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-2xl font-black text-indigo-600">{progressValue} / {progressTarget}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400">{t('narrative.completed_label')}</p>
                                    </div>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : choiceList.length > 0 ? (
                        <div className="space-y-3 mt-8">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('narrative.choices_title')}</h5>
                            {choiceList.map((choice, idx) => (
                                (() => {
                                    const requiredFunds = Math.max(0, -(Number(choice?.impact?.balance) || 0));
                                    const cantAfford = requiredFunds > availableFunds;
                                    return (
                                <button
                                    key={idx}
                                    onClick={() => handleChoice(choice)}
                                    disabled={cantAfford}
                                    className={`w-full group flex items-center justify-between p-4 bg-white border-2 rounded-2xl transition-all text-left shadow-sm active:scale-[0.99] ${
                                        cantAfford
                                            ? 'border-slate-100 opacity-60 cursor-not-allowed'
                                            : 'border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                                            cantAfford
                                                ? 'bg-slate-100 text-slate-400'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="font-bold text-slate-800">{choice.text}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {choice.impact && (
                                            <div className={`hidden md:flex flex-col items-end transition-opacity ${cantAfford ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {requiredFunds > 0 && (
                                                        <span className={`text-[10px] font-black ${cantAfford ? 'text-rose-600' : 'text-amber-600'}`}>
                                                            {t('narrative.cost_required', { amount: currencyFormatter.format(requiredFunds) })}
                                                        </span>
                                                )}
                                                {choice.impact.reputation && (
                                                    <span className={`text-[10px] font-black ${choice.impact.reputation > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {t('narrative.reputation_delta', {
                                                            sign: choice.impact.reputation > 0 ? '+' : '',
                                                            value: choice.impact.reputation
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <ChevronRight size={18} className={cantAfford ? 'text-slate-300' : 'text-slate-300 group-hover:text-indigo-600 transition-colors'} />
                                    </div>
                                </button>
                                    );
                                })()
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm">
                            <p className="text-sm font-medium text-slate-600">
                                {t('narrative.no_extra_choices')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer (Hint) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                    <AlertCircle size={14} />
                    <span>{isActionNode ? t('narrative.footer_action_hint') : t('narrative.footer_choice_hint')}</span>
                </div>
            </div>
        </div>
    );
}
