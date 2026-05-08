/**
 * @reflection
 * [IDENTITY]: DiklatPage
 * [PURPOSE]: Training center UI component.
 * [STATE]: Experimental
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { canAffordOperationalCost, spendOperationalFunds } from '../utils/operationalFunds.js';
import { showToast } from '../utils/ToastManager.js';
import {
    GraduationCap, BookOpen, Award, Clock, CheckCircle, Lock,
    Star, Zap, Brain, Heart, Users, Trophy, Sparkles, ChevronRight,
    Stethoscope, Siren, Scissors, Landmark, Globe2, BatteryCharging, Leaf
} from 'lucide-react';

const SKILLS = [
    { id: 'diagnosis_1', nameKey: 'diagnosis_1.name', effectKey: 'diagnosis_1.effect', category: 'clinical', level: 2, maxLevel: 5, xpCost: 100, unlocked: true, Icon: Stethoscope },
    { id: 'emergency_1', nameKey: 'emergency_1.name', effectKey: 'emergency_1.effect', category: 'clinical', level: 1, maxLevel: 3, xpCost: 150, unlocked: true, Icon: Siren },
    { id: 'surgery_1', nameKey: 'surgery_1.name', effectKey: 'surgery_1.effect', category: 'clinical', level: 0, maxLevel: 3, xpCost: 300, unlocked: false, Icon: Scissors },
    { id: 'leadership_1', nameKey: 'leadership_1.name', effectKey: 'leadership_1.effect', category: 'management', level: 1, maxLevel: 5, xpCost: 80, unlocked: true, Icon: Users },
    { id: 'finance_1', nameKey: 'finance_1.name', effectKey: 'finance_1.effect', category: 'management', level: 0, maxLevel: 3, xpCost: 120, unlocked: true, Icon: Landmark },
    { id: 'public_health', nameKey: 'public_health.name', effectKey: 'public_health.effect', category: 'management', level: 2, maxLevel: 4, xpCost: 100, unlocked: true, Icon: Globe2 },
    { id: 'stamina_1', nameKey: 'stamina_1.name', effectKey: 'stamina_1.effect', category: 'personal', level: 3, maxLevel: 5, xpCost: 50, unlocked: true, Icon: BatteryCharging },
    { id: 'stress_mgmt', nameKey: 'stress_mgmt.name', effectKey: 'stress_mgmt.effect', category: 'personal', level: 1, maxLevel: 3, xpCost: 80, unlocked: true, Icon: Leaf },
];

const WORKSHOPS = [
    { id: 1, titleKey: 'tb.title', dateKey: 'tb.date', xpReward: 50, cost: 0, category: 'clinical', Icon: BookOpen },
    { id: 2, titleKey: 'usg.title', dateKey: 'usg.date', xpReward: 100, cost: 500000, category: 'clinical', Icon: Sparkles },
    { id: 3, titleKey: 'management.title', dateKey: 'management.date', xpReward: 80, cost: 0, category: 'management', Icon: GraduationCap },
];

const CATEGORY_CONFIG = {
    clinical: { accent: 'rose', icon: Brain, labelKey: 'diklatPage.categories.clinical' },
    management: { accent: 'indigo', icon: Users, labelKey: 'diklatPage.categories.management' },
    personal: { accent: 'emerald', icon: Heart, labelKey: 'diklatPage.categories.personal' },
};

const ACCENT_MAP = {
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', glow: 'bg-rose-500/5', bar: 'from-rose-400 to-pink-400', ring: 'ring-rose-500/30' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', glow: 'bg-indigo-500/5', bar: 'from-indigo-400 to-blue-400', ring: 'ring-indigo-500/30' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'bg-emerald-500/5', bar: 'from-emerald-400 to-teal-400', ring: 'ring-emerald-500/30' },
};

export default function DiklatPage() {
    const { t, i18n } = useTranslation();
    const { playerStats, skills, unlockSkill, addXp, stats, setStats, setPlayerProfile } = useGame();
    const [activeTab, setActiveTab] = useState('skills');

    React.useEffect(() => {
        guardStability('DIKLAT_INIT', 2000, 3);
    }, []);

    const [filterCategory, setFilterCategory] = useState('all');
    const [upgradeAnim, setUpgradeAnim] = useState(null);

    const currentXP = playerStats?.xp || 0;
    const playerLevel = playerStats?.level || 1;
    const xpTarget = playerStats?.nextLevelXp || 1000;
    const xpToNextLevel = Math.max(0, xpTarget - currentXP);
    const xpPct = Math.round((Math.min(currentXP, xpTarget) / xpTarget) * 100);
    const completedWorkshops = Array.isArray(playerStats?.completedWorkshops)
        ? playerStats.completedWorkshops
        : [];

    const localizedSkills = useMemo(() => SKILLS.map(skill => ({
        ...skill,
        name: t(`diklatPage.skills.${skill.nameKey}`),
        effect: t(`diklatPage.skills.${skill.effectKey}`)
    })), [t]);

    const localizedWorkshops = useMemo(() => WORKSHOPS.map(workshop => ({
        ...workshop,
        title: t(`diklatPage.workshops.${workshop.titleKey}`),
        date: t(`diklatPage.workshops.${workshop.dateKey}`)
    })), [t]);

    const handleUpgradeSkill = (skill) => {
        setUpgradeAnim(skill.id);
        setTimeout(() => {
            const success = unlockSkill(skill.id, skill.xpCost);
            if (!success) showToast(t('diklatPage.toast.notEnoughXp'), 'warning');
            setUpgradeAnim(null);
        }, 800);
    };

    const handleAttendWorkshop = (workshop) => {
        if (completedWorkshops.includes(workshop.id)) return;

        if (!canAffordOperationalCost(stats, workshop.cost)) {
            showToast(t('diklatPage.toast.notEnoughFunds'), 'warning');
            return;
        }

        if (workshop.cost > 0) {
            setStats(prev => spendOperationalFunds(prev, workshop.cost) || prev);
        }

        addXp?.(workshop.xpReward);
        setPlayerProfile?.(prev => ({
            ...prev,
            completedWorkshops: [...new Set([...(prev.completedWorkshops || []), workshop.id])]
        }));

        showToast(t('diklatPage.toast.workshopDone', { title: workshop.title, xp: workshop.xpReward }), 'success');
    };

    const filteredSkills = localizedSkills.filter(s => filterCategory === 'all' || s.category === filterCategory);

    const particles = useMemo(() => [...Array(10)].map((_, i) => ({
        w: 2 + (i * 0.35) % 3,
        left: ((i * 21 + 7) % 93),
        top: ((i * 31 + 3) % 89),
        rgb: i % 3 === 0 ? '139,92,246' : i % 3 === 1 ? '244,114,182' : '99,102,241',
        opacity: 0.06 + (i * 0.01),
        dur: 10 + (i * 1.2),
        delay: i * 0.6
    })), []);

    return (
        <div className="h-full overflow-y-auto p-5 bg-slate-950 relative">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {particles.map((p, i) => (
                    <div key={i} className="absolute rounded-full" style={{
                        width: p.w, height: p.w,
                        left: `${p.left}%`, top: `${p.top}%`,
                        background: `rgba(${p.rgb}, ${p.opacity})`,
                        animation: `particle-float ${p.dur}s ease-in-out infinite alternate`,
                        animationDelay: `${p.delay}s`
                    }} />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-black text-white/90 uppercase tracking-tight flex items-center gap-3">
                            <div className="bg-violet-500/15 p-2.5 rounded-xl border border-violet-500/20">
                                <GraduationCap size={22} className="text-violet-400" />
                            </div>
                            {t('diklatPage.title')}
                        </h2>
                        <p className="text-violet-300/50 text-xs uppercase tracking-[0.3em] mt-1 ml-14 font-medium">
                            {t('diklatPage.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none">
                        <Trophy size={160} className="text-white" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-yellow-400" />
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t('diklatPage.xp.label')}</span>
                            </div>
                            <div className="font-data text-3xl font-black text-white/90 mb-2">
                                {currentXP} <span className="text-lg text-white/30">XP</span>
                            </div>
                            <div className="h-2 w-48 bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                                    style={{ width: `${xpPct}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-white/20 font-mono mt-1 block">
                                {t('diklatPage.xp.toNextLevel', { xp: xpToNextLevel })}
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-white/[0.04] backdrop-blur border-2 border-yellow-400/30 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/10 to-transparent" />
                                <div className="relative text-center">
                                    <Star size={16} className="text-yellow-400 mx-auto mb-0.5" />
                                    <div className="font-data text-2xl font-black text-white">{playerLevel}</div>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{t('diklatPage.xp.level')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {[
                        { id: 'skills', label: t('diklatPage.tabs.skills'), icon: Zap },
                        { id: 'workshops', label: t('diklatPage.tabs.workshops'), icon: BookOpen }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-white/[0.1] border border-white/[0.15] text-white shadow-lg'
                                : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                                }`}
                        >
                            <tab.icon size={15} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'skills' && (
                    <>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filterCategory === 'all'
                                    ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                                    : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'
                                    }`}
                            >
                                {t('diklatPage.categories.all')}
                            </button>
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                                const a = ACCENT_MAP[config.accent];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setFilterCategory(key)}
                                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${filterCategory === key
                                            ? `${a.bg} ${a.text} border ${a.border}`
                                            : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'
                                            }`}
                                    >
                                        <config.icon size={11} />
                                        {t(config.labelKey)}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredSkills.map((skill, idx) => {
                                const config = CATEGORY_CONFIG[skill.category];
                                const a = ACCENT_MAP[config.accent];
                                const isUnlocked = Array.isArray(skills) && skills.includes(skill.id);
                                const canUpgrade = !isUnlocked && currentXP >= skill.xpCost;
                                const isAnimating = upgradeAnim === skill.id;
                                const SkillIcon = skill.Icon;

                                return (
                                    <div
                                        key={skill.id}
                                        className={`group relative p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] transition-all duration-300 overflow-hidden
                                            ${!skill.unlocked ? 'opacity-40' : ''}
                                            ${isAnimating ? 'scale-[1.02] ring-1 ring-yellow-400/40' : 'hover:bg-white/[0.06]'}
                                        `}
                                        style={{ animationDelay: `${idx * 60}ms` }}
                                    >
                                        {isAnimating && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10" />
                                        )}
                                        <div className={`absolute top-0 right-0 w-20 h-20 ${a.glow} rounded-full -mr-6 -mt-6 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        <div className="relative z-10 flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                                                    <SkillIcon size={20} className="text-white/70" />
                                                </span>
                                                <div>
                                                    <h3 className="text-xs font-black text-white/80 uppercase tracking-tight">{skill.name}</h3>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${a.bg} ${a.text} border ${a.border}`}>
                                                        {t(config.labelKey)}
                                                    </span>
                                                </div>
                                            </div>
                                            {!skill.unlocked ? (
                                                <Lock size={14} className="text-white/20" />
                                            ) : isUnlocked ? (
                                                <Award size={18} className="text-yellow-400" />
                                            ) : (
                                                <div className="text-right">
                                                    <div className="font-data text-sm font-black text-white/70">{t('diklatPage.levelShort', { level: skill.level })}</div>
                                                    <div className="text-[9px] text-white/20 font-mono">/ {skill.maxLevel}</div>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[10px] text-white/30 font-medium mb-3">{skill.effect}</p>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${a.bar} rounded-full transition-all duration-700`}
                                                        style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {skill.unlocked && !isUnlocked && (
                                                <button
                                                    onClick={() => handleUpgradeSkill(skill)}
                                                    disabled={!canUpgrade}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${canUpgrade
                                                        ? 'bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/25 hover:scale-105'
                                                        : 'bg-white/[0.04] border border-white/[0.06] text-white/20 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <Zap size={10} />
                                                    {skill.xpCost} XP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {activeTab === 'workshops' && (
                    <div className="space-y-3">
                        {localizedWorkshops.map((ws, idx) => {
                            const config = CATEGORY_CONFIG[ws.category];
                            const a = ACCENT_MAP[config.accent];
                            const isCompleted = completedWorkshops.includes(ws.id);
                            const canAfford = canAffordOperationalCost(stats, ws.cost);
                            const WorkshopIcon = ws.Icon;

                            return (
                                <div
                                    key={ws.id}
                                    className="group relative p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex items-center justify-between hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                                    style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                    <div className={`absolute top-0 left-0 w-24 h-24 ${a.glow} rounded-full -ml-8 -mt-8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center`}>
                                            <WorkshopIcon size={22} className={a.text} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white/80 uppercase tracking-tight">{ws.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] text-white/30 font-medium">
                                                    <Clock size={10} />{ws.date}
                                                </span>
                                                <span className="font-data text-[10px] font-bold text-violet-400">
                                                    +{ws.xpReward} XP
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAttendWorkshop(ws)}
                                        disabled={isCompleted || !canAfford}
                                        className={`relative z-10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isCompleted
                                            ? 'bg-white/[0.06] border border-white/[0.08] text-white/30 cursor-default'
                                            : ws.cost > 0
                                                ? canAfford
                                                    ? 'bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25'
                                                    : 'bg-white/[0.04] border border-white/[0.06] text-white/20 cursor-not-allowed'
                                                : 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <><CheckCircle size={12} /> {t('diklatPage.actions.completed')}</>
                                        ) : ws.cost > 0 ? (
                                            t('diklatPage.currency.thousandValue', { value: (ws.cost / 1000).toLocaleString(i18n.resolvedLanguage === 'en' ? 'en-US' : 'id-ID') })
                                        ) : (
                                            t('diklatPage.actions.free')
                                        )}
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
