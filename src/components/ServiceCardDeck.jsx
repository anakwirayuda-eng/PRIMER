/**
 * @reflection
 * [IDENTITY]: ServiceCardDeck
 * [PURPOSE]: React UI component: ServiceCardDeck.
 * [STATE]: Experimental
 * [ANCHOR]: ServiceCardDeck
 * [DEPENDS_ON]: ThemeContext, ClinicalServices
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from 'react-i18next';
import { Lock, Users } from 'lucide-react';
import { isServiceUnlocked } from '../data/ClinicalServices.js';

/**
 * ServiceCardDeck - A flip-folder tab style UI for clinical services
 * Like file folder dividers that you flip through
 */
export default function ServiceCardDeck({
    services,
    activeServiceId,
    onSelectService,
    playerLevel = 1,
    hiredStaff = [],
    emergencyCount = 0,
    compact = false
}) {
    const { isDark } = useTheme();
    const { t } = useTranslation();
    const tr = (key, fallback, options = {}) => {
        const value = t(key, { ...options, defaultValue: fallback });
        return value === key ? fallback : value;
    };
    const localizeService = (service) => ({
        ...service,
        name: tr(`clinical.services.${service.id}.name`, service.name),
        shortName: tr(`clinical.services.${service.id}.short_name`, service.shortName),
        description: tr(`clinical.services.${service.id}.description`, service.description)
    });
    const getServiceModeLabel = (service) => {
        if (service.queueType === 'emergency') return tr('clinical.service_modes.emergency', 'Rapid triage');
        if (service.queueType === 'farmasi_lab') return tr('clinical.service_modes.support', 'Support');
        return tr('clinical.service_modes.queue', 'Clinic queue');
    };
    const getLocalizedRequirement = (service) => {
        if (service.betaLocked) {
            return tr('clinical.coming_soon', 'Coming Soon');
        }

        const requirements = [];
        if (service.unlockLevel > playerLevel) {
            requirements.push(tr('clinical.level_requirement', `Level ${service.unlockLevel} (current Lv.${playerLevel})`, {
                level: service.unlockLevel,
                currentLevel: playerLevel
            }));
        }

        if (service.requiredStaff && !hiredStaff.includes(service.requiredStaff)) {
            const staffLabel = tr(`morningBriefing.staff_roles.${service.requiredStaff}`, service.requiredStaff);
            requirements.push(tr('clinical.staff_requirement', `Recruit ${staffLabel} from the Staff menu`, { staff: staffLabel }));
        }

        return requirements.join(' + ');
    };

    const activeService = services.find((service) => service.id === activeServiceId) || services[0] || null;
    const activeUnlocked = activeService ? isServiceUnlocked(activeService, playerLevel, hiredStaff) : false;
    const localizedActiveService = activeService ? localizeService(activeService) : null;
    const activeRequirement = activeService && !activeUnlocked
        ? getLocalizedRequirement(activeService)
        : '';

    if (!activeService || !localizedActiveService) return null;

    return (
        <div className={compact ? 'space-y-2' : 'space-y-3'}>
            <div className={`rounded-2xl border ${compact ? 'p-1.5' : 'p-2'} ${isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-slate-100/80'}`}>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {services.map((service) => {
                        const unlocked = isServiceUnlocked(service, playerLevel, hiredStaff);
                        const isActive = service.id === activeServiceId;
                        const localizedService = localizeService(service);

                        return (
                            <button
                                key={service.id}
                                onClick={() => unlocked && onSelectService(service.id)}
                                disabled={!unlocked}
                                className={`
                                    relative shrink-0 rounded-2xl border text-left transition-all
                                    ${compact ? 'min-w-[4.75rem] px-2.5 py-2' : 'min-w-[5.5rem] px-3 py-2.5'}
                                    ${isActive
                                        ? `bg-gradient-to-r ${service.color} border-transparent text-white shadow-lg`
                                        : unlocked
                                            ? (isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50')
                                            : (isDark ? 'border-slate-800 bg-slate-900/70 text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-400')
                                    }
                                    ${!unlocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                                `}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-lg leading-none">{service.icon}</span>
                                    {!unlocked && <Lock size={12} className="shrink-0 opacity-70" />}
                                    {service.id === 'igd' && emergencyCount > 0 && (
                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-red-600">
                                            {emergencyCount}
                                        </span>
                                    )}
                                </div>
                                <div className={compact ? 'mt-1.5' : 'mt-2'}>
                                    <p className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-black uppercase tracking-[0.14em]`}>{localizedService.shortName}</p>
                                    <p className={`mt-1 truncate ${compact ? 'text-[9px]' : 'text-[10px]'} ${isActive ? 'text-white/75' : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                                        {getServiceModeLabel(service)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={`rounded-2xl border ${compact ? 'px-3.5 py-3' : 'px-4 py-3'} ${isDark ? 'border-slate-700 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${activeService.color} text-xl text-white shadow-md ${compact ? 'h-10 w-10' : 'h-11 w-11'}`}>
                        {activeService.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {localizedActiveService.name}
                            </h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                                activeUnlocked
                                    ? (isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700')
                                    : (isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700')
                            }`}>
                                {activeUnlocked ? t('clinical.service_status_ready') : t('clinical.locked')}
                            </span>
                        </div>
                        <p className={`mt-1 leading-relaxed ${compact ? 'text-[11px]' : 'text-xs'} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {localizedActiveService.description}
                        </p>
                    </div>
                </div>

                <div className={`flex flex-wrap gap-2 ${compact ? 'mt-2.5' : 'mt-3'}`}>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {getServiceModeLabel(activeService)}
                    </span>
                    {activeService.requiredStaff && (
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                            {t('clinical.service_staff_label', { staff: activeService.requiredStaff })}
                        </span>
                    )}
                    {activeService.unlockLevel > 1 && (
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {t('clinical.service_level_label', { level: activeService.unlockLevel })}
                        </span>
                    )}
                    {activeService.id === 'igd' && emergencyCount > 0 && (
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'}`}>
                            {t('clinical.service_emergency_count', { count: emergencyCount })}
                        </span>
                    )}
                </div>

                {!activeUnlocked && activeRequirement && (
                    <div className={`mt-3 rounded-xl border px-3 py-2 text-xs leading-relaxed ${isDark ? 'border-amber-500/20 bg-amber-500/10 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                        <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
                            <Users size={12} />
                            {t('clinical.unlock_requirements_short')}
                        </div>
                        <p>{activeRequirement}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
