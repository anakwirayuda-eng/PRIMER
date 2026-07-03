/**
 * @reflection
 * [IDENTITY]: AuxiliaryComponents
 * [PURPOSE]: Helper HUD components for WilayahPage side panels (PIS-PK detail and IKS board).
 * [STATE]: Stable
 * [ANCHOR]: PISPKPanel
 * [LAST_UPDATE]: 2026-04-04
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Users, User, Activity,
    BookOpen, Info, Baby, Accessibility, Heart,
    Megaphone, BarChart3, ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext.jsx';
import { INDIVIDUAL_PROFILES } from '../../domains/village/VillageRegistry.js';
import { PISPK_INDICATORS } from './constants.js';

// ─── Satellite View (clean image, no interactive markers) ───
// ─── PIS-PK Detail Panel (designed for dark glassmorphism context) ───
// PIS-PK detail panel for the Wilayah side drawer.
export const PISPKPanel = ({ building, villageData, onOpenIntervention: _onOpenIntervention, onOpenWiki }) => {
    const { t } = useTranslation();
    const { navigate } = useGame();

    const family = villageData?.families?.find(f => f.id === building.familyId);
    const indicators = family?.indicators || building.indicators || {};

    const scoredIndicators = Object.values(indicators).filter(v => v !== null).length;
    const healthyIndicators = Object.values(indicators).filter(v => v === true).length;
    const score = scoredIndicators > 0 ? healthyIndicators / scoredIndicators : 0;
    const tx = (key, options = {}) => t(`wilayahContent.ui.auxiliary.${key}`, options);
    const getIksStatus = () => {
        if (score > 0.8) return tx('iksStatus.healthy');
        if (score > 0.5) return tx('iksStatus.preHealthy');
        return tx('iksStatus.unhealthy');
    };
    const getIndicatorLabel = (indicator) => tx(`indicators.${indicator.id}`, { defaultValue: indicator.label });

    return (
        <div className="space-y-4">
            {/* IKS Score Card */}
            <button
                onClick={() => onOpenWiki('iks')}
                className="w-full text-left bg-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-all group border border-white/10 hover:border-emerald-500/30"
                aria-label={tx('iksAria', { score: (score * 100).toFixed(0), status: getIksStatus() })}
            >
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-[10px] text-white/40 uppercase tracking-widest">{tx('familyIksScore')}</span>
                        <Info size={12} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase
                        ${score > 0.8 ? 'bg-emerald-500/20 text-emerald-300' :
                            score > 0.5 ? 'bg-amber-500/20 text-amber-300' :
                                'bg-red-500/20 text-red-300'}
                    `}>
                        {(score * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${score > 0.8 ? 'bg-emerald-500' : score > 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${score * 100}%` }}
                    />
                </div>
                <p className="text-[9px] uppercase font-black text-white/30 mt-1.5 text-right tracking-widest">
                    {getIksStatus()}
                </p>
            </button>

            {/* Family Members */}
            {family && family.members && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <h4 className="font-black text-[10px] text-white/30 uppercase mb-3 flex items-center gap-1.5 tracking-widest">
                        <Users size={11} /> {tx('members', { count: family.members.length })}
                    </h4>
                    <div className="space-y-1.5">
                        {family.members.map((m, i) => {
                            const profile = INDIVIDUAL_PROFILES?.[m.id];
                            const hasConditions = (profile?.conditions?.length > 0) || (m.riskFactors?.length > 0);
                            const getWikiKey = () => {
                                if (profile?.conditions?.length > 0) {
                                    const c = profile.conditions[0];
                                    if (c.includes('hypertension')) return 'hypertension';
                                    if (c.includes('diabetes')) return 'diabetes';
                                    if (c.includes('stunting')) return 'stunting';
                                    if (c.includes('tb')) return 'tbc';
                                }
                                if (m.riskFactors?.includes('stunting')) return 'stunting';
                                if (m.riskFactors?.includes('hypertension_risk')) return 'hypertension';
                                if (m.riskFactors?.includes('tb_contact')) return 'tbc';
                                if (m.riskFactors?.includes('poor_sanitation')) return 'mck';
                                return 'iks';
                            };

                            return (
                                <div
                                    key={i}
                                    className={`w-full group/member flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all
                                        ${hasConditions
                                            ? 'bg-amber-500/10 border-amber-500/20'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={() => onOpenWiki(getWikiKey())}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-all active:scale-90 hover:ring-2 hover:ring-emerald-400/50 relative
                                                ${m.role === 'head' ? 'bg-indigo-500/20 text-indigo-300' :
                                                    m.role === 'spouse' ? 'bg-pink-500/20 text-pink-300' :
                                                        m.role === 'elder' ? 'bg-orange-500/20 text-orange-300' :
                                                            m.role === 'child' ? 'bg-emerald-500/20 text-emerald-300' :
                                                                'bg-white/10 text-white/50'
                                                }`}
                                        >
                                            {m.role === 'child' && m.age < 5 ? <Baby size={16} /> :
                                                m.role === 'elder' ? <Accessibility size={16} /> :
                                                    m.role === 'head' ? <User size={16} /> :
                                                        m.role === 'spouse' ? <Heart size={16} /> :
                                                            <User size={16} />}
                                            <div className="absolute -bottom-0.5 -right-0.5 bg-black/60 p-0.5 rounded-full">
                                                <BookOpen size={7} className="text-emerald-400" />
                                            </div>
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-black text-white/90 text-xs leading-tight truncate">{m.name || m.firstName}</p>
                                                <button
                                                    onClick={() => navigate('archive', { familyId: family.id, memberId: m.id })}
                                                    className="text-[9px] font-black text-emerald-400 uppercase tracking-tight hover:underline"
                                                >
                                                    {tx('detail')}
                                                </button>
                                            </div>
                                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight">
                                                {tx('memberMeta', { age: m.age, gender: m.gender === 'L' ? tx('gender.maleShort') : tx('gender.femaleShort'), occupation: m.occupation })}
                                            </p>
                                        </div>
                                    </div>
                                    {hasConditions && (
                                        <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                                            {profile?.conditions?.map((c, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-tight bg-amber-500/20 text-amber-300"
                                                >
                                                    {c.replace(/_/g, ' ').replace('stage1', '').replace('stage2', '').replace('type2', '')}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* PIS-PK Indicators */}
            <div className="space-y-2">
                <h4 className="font-black text-[10px] text-white/30 uppercase tracking-widest">
                    {tx('indicatorCount', { count: PISPK_INDICATORS.length })}
                </h4>
                <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                    {PISPK_INDICATORS.map(ind => {
                        const isHealthy = indicators[ind.id];
                        return (
                            <div key={ind.id} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                                <div className={`mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black
                                    ${isHealthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                                `}>
                                    {isHealthy ? 'OK' : 'X'}
                                </div>
                                <span className={`text-[10px] font-bold leading-tight ${isHealthy ? 'text-white/60' : 'text-red-300'}`}>
                                    {getIndicatorLabel(ind)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── IKS Scoreboard (for dark glassmorphism drawer) ───
// IKS scoreboard for the Wilayah side drawer.
export const IKSBoardPanel = ({ stats, onOpenAnnouncements }) => {
    const { t } = useTranslation();
    const tx = (key, options = {}) => t(`wilayahContent.ui.auxiliary.${key}`, options);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{tx('pispkCoverage')}</p>
                    <p className="text-xl font-black text-white">{stats.totalHouses} <span className="text-xs text-white/30">{tx('householdsShort')}</span></p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{tx('surveillanceAlert')}</p>
                    <p className="text-xl font-black text-red-400">{stats.alertCount} <span className="text-xs text-white/30">{tx('cases')}</span></p>
                </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl relative overflow-hidden">
                <BarChart3 className="absolute -right-3 -bottom-3 text-emerald-500/10" size={80} />
                <h4 className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-2">{tx('villageIks')}</h4>
                <div className="flex items-end gap-2 mb-1.5">
                    <span className="text-3xl font-black text-white tracking-tighter">{(stats.avgIks * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(stats.avgIks * 100)} aria-valuemin="0" aria-valuemax="100" aria-label={tx('villageIksAria', { score: (stats.avgIks * 100).toFixed(1) })}>
                    <div className="h-full bg-emerald-400" style={{ width: `${stats.avgIks * 100}%` }} />
                </div>
            </div>

            {onOpenAnnouncements && (
                <button
                    onClick={onOpenAnnouncements}
                    className="w-full group bg-white/5 border border-white/10 p-3 rounded-xl transition-all hover:bg-white/10 text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:bg-amber-500/30 transition-all">
                            <Megaphone size={16} />
                        </div>
                        <span className="font-black text-white/70 text-[10px] uppercase tracking-wider">{tx('announcements')}</span>
                        <ChevronRight className="ml-auto text-white/20 group-hover:translate-x-1 transition-transform" size={14} />
                    </div>
                </button>
            )}
        </div>
    );
};
