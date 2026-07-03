/**
 * @reflection
 * [IDENTITY]: StatusJunctionModal
 * [PURPOSE]: FF-style player status and ability junction panel.
 * [STATE]: Experimental
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { X, Heart, Brain, Zap, Activity, Smile, Shield, Info } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer.jsx';

export default function StatusJunctionModal({ onClose, onOpenWiki }) {
    const { t, i18n } = useTranslation();
    const { playerProfile, playerStats, skills, activeQuests: _activeQuests, derivedKpis } = useGame();
    const [animateIn] = useState(true);
    const modalRef = useModalA11y(onClose);
    const [selectedStat, setSelectedStat] = useState(null);
    const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'id-ID';

    const formatNumber = (num) => num?.toLocaleString(locale) || '0';
    const xpPercentage = (playerStats.xp / (playerStats.nextLevelXp || 1000)) * 100;

    const unlockedSkills = Array.isArray(skills)
        ? skills.map((id) => t(`diklatPage.skills.${id}.name`, { defaultValue: id.replace(/_/g, ' ').toUpperCase() }))
        : Object.entries(skills || {})
            .filter(([_, unlocked]) => unlocked)
            .map(([id]) => t(`diklatPage.skills.${id}.name`, { defaultValue: id.replace(/_/g, ' ').toUpperCase() }));

    const statCards = [
        {
            id: 'energy',
            icon: Heart,
            color: 'green',
            title: t('statusJunction.stats.energy.title'),
            desc: t('statusJunction.stats.energy.desc'),
            label: t('statusJunction.stats.energy.label'),
            value: Math.round(playerStats.energy),
            suffix: ` / ${playerStats.maxEnergy}`,
            wikiKey: 'energy'
        },
        {
            id: 'stress',
            icon: Activity,
            color: 'purple',
            title: t('statusJunction.stats.stress.title'),
            desc: t('statusJunction.stats.stress.desc'),
            label: t('statusJunction.stats.stress.label'),
            value: `${playerStats.stress}%`
        },
        {
            id: 'knowledge',
            icon: Brain,
            color: 'blue',
            title: t('statusJunction.stats.knowledge.title'),
            desc: t('statusJunction.stats.knowledge.desc'),
            label: t('statusJunction.stats.knowledge.label'),
            value: playerStats.knowledge
        },
        {
            id: 'confidence',
            icon: Smile,
            color: 'amber',
            title: t('statusJunction.stats.confidence.title'),
            desc: t('statusJunction.stats.confidence.desc'),
            label: t('statusJunction.stats.confidence.label'),
            value: playerStats.confidence
        },
        {
            id: 'hygiene',
            icon: Shield,
            color: 'teal',
            title: t('statusJunction.stats.hygiene.title'),
            desc: t('statusJunction.stats.hygiene.desc'),
            label: t('statusJunction.stats.hygiene.label'),
            value: playerStats.hygiene
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="status-junction-title"
                className={`
                    w-full max-w-4xl bg-gradient-to-br from-slate-600 to-slate-800
                    rounded-lg shadow-2xl border-2 border-slate-400 overflow-hidden text-white font-mono
                    transform transition-all duration-300 ease-out
                    ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
                style={{
                    boxShadow: '0 0 20px rgba(100, 116, 139, 0.5), inset 0 0 40px rgba(0,0,0,0.5)'
                }}
            >
                <div className="bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 p-1 border-b-2 border-slate-300 flex justify-between items-center px-4">
                    <h2 id="status-junction-title" className="font-bold text-shadow-sm tracking-wider uppercase text-slate-900">
                        {t('statusJunction.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-900 hover:text-white hover:bg-red-600 rounded p-1 transition-colors"
                        aria-label={t('statusJunction.closeAria')}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[600px]">
                    <div className="w-full md:w-1/3 bg-slate-900/50 p-6 flex flex-col border-r border-slate-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}>
                        </div>

                        <div className="relative z-10 flex flex-col items-center mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-400 bg-slate-700 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4 overflow-hidden">
                                <AvatarRenderer avatar={playerProfile?.avatar} size={120} />
                            </div>
                            <h2 className="text-2xl font-bold text-cyan-300 text-shadow-glow uppercase tracking-widest">
                                {playerProfile?.name || t('mainLayout.player_fallback')}
                            </h2>
                            <div className="text-sm text-slate-300 tracking-wide uppercase">{t('statusJunction.role')}</div>
                        </div>

                        <div
                            className="bg-slate-800/80 p-4 rounded border border-slate-600 mb-4 z-10 cursor-pointer hover:border-cyan-500/50 group/xp transition-all"
                            onClick={() => onOpenWiki?.('xp_level')}
                        >
                            <div className="flex justify-between items-end mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold text-lg">{t('statusJunction.levelShort')}</span>
                                    <Info size={14} className="text-slate-500 group-hover/xp:text-cyan-400 transition-colors" />
                                </div>
                                <span className="text-3xl font-bold text-white leading-none">{playerStats.level}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>{t('statusJunction.exp')}</span>
                                    <span>{formatNumber(playerStats.xp)} / {formatNumber(playerStats.nextLevelXp)}</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-600">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000"
                                        style={{ width: `${xpPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-red-900/30 border border-red-500/50 p-2 rounded text-center z-10">
                            <div className="text-xs text-red-300 uppercase tracking-widest mb-1">{t('statusJunction.condition')}</div>
                            <div className="text-xl font-bold text-red-100">
                                {playerStats.energy < 30 ? t('statusJunction.conditionCritical') : t('statusJunction.conditionNormal')}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-800/80 p-6 flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {statCards.map((stat) => (
                                <StatCard
                                    key={stat.id}
                                    stat={stat}
                                    isLowEnergy={stat.id === 'energy' && playerStats.energy < 30}
                                    onHover={setSelectedStat}
                                    onOpenWiki={onOpenWiki}
                                />
                            ))}
                        </div>

                        <div className="mt-auto mb-6 bg-slate-900 border-2 border-slate-500 rounded p-4 min-h-[100px] shadow-inner relative">
                            {selectedStat ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h4 className="text-cyan-400 font-bold mb-1 border-b border-slate-700 pb-1">{selectedStat.title}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{selectedStat.desc}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 text-sm italic">
                                    {t('statusJunction.hoverHint')}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-slate-400 uppercase text-xs font-bold mb-2 tracking-wider border-b border-slate-700 pb-1">
                                {t('statusJunction.abilities')}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {unlockedSkills.length > 0 ? (
                                    unlockedSkills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                                            <Zap size={14} className="text-yellow-500" />
                                            <span>{skill}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 text-sm italic col-span-2">{t('statusJunction.noAbilities')}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border-t-2 border-slate-500 p-2 text-xs flex justify-between items-center text-slate-400 px-4">
                    <div>
                        {t('statusJunction.playTime')}: <span className="text-white font-mono">{Math.floor(playerStats.playTime || 0)}h</span>
                    </div>
                    <div
                        className="cursor-pointer hover:bg-white/5 px-2 py-0.5 rounded transition-all flex items-center gap-2 group/gil"
                        onClick={() => onOpenWiki?.('liquidity')}
                    >
                        {t('statusJunction.activeFunds')}: <span className="text-yellow-400 font-mono">
                            {t('statusJunction.currency.fullValue', { value: formatNumber(derivedKpis?.availableFunds ?? derivedKpis?.totalRevenue) })}
                        </span>
                        <Info size={12} className="text-slate-600 group-hover/gil:text-yellow-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ stat, isLowEnergy, onHover, onOpenWiki }) {
    const Icon = stat.icon;
    const colorClasses = {
        green: 'text-green-400 group-hover:text-green-300',
        purple: 'text-purple-400 group-hover:text-purple-300',
        blue: 'text-blue-400 group-hover:text-blue-300',
        amber: 'text-amber-400 group-hover:text-amber-300',
        teal: 'text-teal-400 group-hover:text-teal-300'
    };
    const valueClasses = {
        green: isLowEnergy ? 'text-red-400' : 'text-white',
        purple: 'text-purple-200',
        blue: 'text-blue-200',
        amber: 'text-amber-200',
        teal: 'text-teal-200'
    };

    return (
        <div
            className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:bg-slate-700 transition flex items-center gap-3 group relative cursor-pointer"
            onMouseEnter={() => onHover({ title: stat.title, desc: stat.desc })}
            onMouseLeave={() => onHover(null)}
            onClick={() => stat.wikiKey && onOpenWiki?.(stat.wikiKey)}
        >
            <div className={`p-2 bg-slate-800 rounded ${colorClasses[stat.color]}`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="text-xs text-slate-400 uppercase">{stat.label}</div>
                    {stat.wikiKey && <Info size={12} className={`text-slate-500 ${colorClasses[stat.color]}`} />}
                </div>
                <div className={`text-xl font-bold font-mono ${valueClasses[stat.color]}`}>
                    {stat.value}
                    {stat.suffix && <span className="text-slate-500 text-sm">{stat.suffix}</span>}
                </div>
            </div>
        </div>
    );
}
