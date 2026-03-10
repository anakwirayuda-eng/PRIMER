/**
 * @reflection
 * [IDENTITY]: QuestBoard
 * [PURPOSE]: Module: QuestBoard
 * [STATE]: Experimental
 * [ANCHOR]: QuestBoard
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { CheckCircle2, Circle, Trophy, CalendarClock, Sparkles, BookOpen } from 'lucide-react';
import { STORY_TEMPLATES } from '../game/StoryDatabase.js';

const QuestBoard = () => {
    const { activeQuests, claimQuest, activeStories } = useGame();

    const dailyQuests = activeQuests.filter(q => q.type === 'daily');
    const weeklyQuests = activeQuests.filter(q => q.type === 'weekly');

    const renderStoryItem = (story) => {
        const template = STORY_TEMPLATES.find(t => t.id === story.templateId);
        if (!template) return null;

        return (
            <div key={story.instanceId} className="p-3 rounded-lg border mb-2 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm transition-all hover:border-indigo-300">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h4 className="font-black text-xs text-indigo-900 flex items-center gap-1.5 uppercase tracking-tight">
                            <Sparkles size={12} className="text-indigo-500" /> {template.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {template.nodes[story.currentNodeId]?.text?.substring(0, 60)}...
                        </p>

                        {/* Story Progress */}
                        {template.nodes[story.currentNodeId]?.progressTarget > 0 && (
                            <div className="mt-2">
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-700"
                                        style={{ width: `${Math.min(100, (story.progress / template.nodes[story.currentNodeId].progressTarget) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[9px] font-bold text-slate-400">
                                        {story.progress} / {template.nodes[story.currentNodeId].progressTarget}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderQuestItem = (quest) => {
        const isCompleted = quest.progress >= quest.target;
        const widthPercent = Math.min(100, (quest.progress / quest.target) * 100);

        return (
            <div key={quest.id} className={`p-3 rounded-lg border mb-2 transition-all ${quest.claimed
                ? 'bg-slate-50 border-slate-100 opacity-60'
                : isCompleted
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h4 className={`font-bold text-sm ${quest.claimed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {quest.icon} {quest.label}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{quest.description}</p>

                        {/* Progress Bar */}
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${widthPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-mono text-slate-600">
                                {quest.progress} / {quest.target}
                            </span>
                            <span className="text-xs font-bold text-amber-600">
                                +{quest.xp} XP
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center justify-center">
                        {quest.claimed ? (
                            <CheckCircle2 size={18} className="text-slate-400" />
                        ) : isCompleted ? (
                            <button
                                onClick={() => claimQuest(quest.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm"
                            >
                                KLAIM
                            </button>
                        ) : (
                            <Circle size={18} className="text-slate-300" />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (activeQuests.length === 0 && (!activeStories || activeStories.length === 0)) {
        return (
            <div className="p-4 text-center text-slate-500 text-sm">
                Belum ada misi atau cerita aktif.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 w-80 shadow-xl overflow-y-auto">
            <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Trophy className="text-amber-500" size={20} />
                    Misi Harian
                </h3>
                <p className="text-xs text-slate-500">Selesaikan misi untuk dapat XP & Reputasi</p>
            </div>

            <div className="p-4 space-y-6">
                {/* Story/Narrative Section */}
                {activeStories && activeStories.filter(s => !s.completed).length > 0 && (
                    <div className="animate-in slide-in-from-top-4 duration-500 mb-6">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <BookOpen size={12} /> Cerita & Investigasi
                        </h4>
                        {activeStories.filter(s => !s.completed).map(renderStoryItem)}
                    </div>
                )}

                {/* Daily Quests Section */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <CalendarClock size={12} /> Harian
                    </h4>
                    {dailyQuests.length > 0 ? (
                        dailyQuests.map(renderQuestItem)
                    ) : (
                        <p className="text-xs text-slate-400 italic">Semua misi harian selesai!</p>
                    )}
                </div>

                {/* Weekly Quests Section */}
                {weeklyQuests.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Trophy size={12} /> Mingguan
                        </h4>
                        {weeklyQuests.map(renderQuestItem)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestBoard;
