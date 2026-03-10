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
import { Lock, Users } from 'lucide-react';
import { isServiceUnlocked, getUnlockRequirement } from '../data/ClinicalServices.js';

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
    emergencyCount = 0
}) {
    const { isDark } = useTheme();

    const _activeService = services.find(s => s.id === activeServiceId);
    const activeIndex = services.findIndex(s => s.id === activeServiceId);

    return (
        <div className="relative">
            {/* Folder Tabs Container */}
            <div className="relative" style={{ perspective: '1000px' }}>
                {/* Background folder tabs (stacked behind) */}
                <div className="relative h-auto">
                    {services.map((service, index) => {
                        const unlocked = isServiceUnlocked(service, playerLevel, hiredStaff);
                        const isActive = service.id === activeServiceId;
                        const _requirement = !unlocked ? getUnlockRequirement(service, playerLevel, hiredStaff) : '';

                        // Calculate position offset for stacking effect
                        const distanceFromActive = index - activeIndex;
                        const zIndex = isActive ? 50 : 40 - Math.abs(distanceFromActive);

                        // Offset for tab peek effect
                        const tabOffset = isActive ? 0 : (distanceFromActive * 2);

                        return (
                            <div
                                key={service.id}
                                onClick={() => unlocked && onSelectService(service.id)}
                                className={`
                                    ${isActive ? 'relative' : 'absolute top-0 left-0 right-0'}
                                    transition-all duration-300 ease-out
                                    ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                                `}
                                style={{
                                    zIndex,
                                    transform: isActive
                                        ? 'translateY(0) scale(1)'
                                        : `translateY(${tabOffset}px) scale(${1 - Math.abs(distanceFromActive) * 0.02})`,
                                    opacity: isActive ? 1 : (unlocked ? 0.9 : 0.5),
                                }}
                            >
                                {/* Tab Header (always visible) */}
                                <div
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-l border-r
                                        transition-all duration-200
                                        ${isActive
                                            ? `bg-gradient-to-r ${service.color} text-white border-transparent shadow-lg`
                                            : isDark
                                                ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                        }
                                        ${!unlocked ? 'opacity-50' : ''}
                                    `}
                                >
                                    <span className="text-lg">{service.icon}</span>
                                    <span className="font-bold text-sm">{service.shortName}</span>

                                    {/* Lock icon */}
                                    {!unlocked && (
                                        <Lock size={12} className="ml-auto opacity-60" />
                                    )}

                                    {/* Emergency badge */}
                                    {service.id === 'igd' && emergencyCount > 0 && (
                                        <span className="ml-auto bg-white text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                            {emergencyCount}
                                        </span>
                                    )}
                                </div>

                                {/* Folder Content (only for active) */}
                                {isActive && (
                                    <div
                                        className={`
                                            p-4 rounded-b-lg rounded-tr-lg border-b border-l border-r
                                            ${isDark
                                                ? 'bg-slate-800 border-slate-700'
                                                : 'bg-white border-slate-200 shadow-sm'
                                            }
                                        `}
                                    >
                                        <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {service.name}
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {service.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Navigation Tabs (visible tabs strip) */}
            <div className={`mt-4 flex flex-wrap gap-1 p-2 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                {services.map((service) => {
                    const unlocked = isServiceUnlocked(service, playerLevel, hiredStaff);
                    const isActive = service.id === activeServiceId;

                    return (
                        <button
                            key={service.id}
                            onClick={() => unlocked && onSelectService(service.id)}
                            disabled={!unlocked}
                            className={`
                                relative px-2 py-1.5 rounded-md text-xs font-bold transition-all
                                ${isActive
                                    ? `bg-gradient-to-r ${service.color} text-white shadow-md scale-105`
                                    : unlocked
                                        ? isDark
                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                                        : isDark
                                            ? 'bg-slate-800 text-slate-600'
                                            : 'bg-slate-200 text-slate-400'
                                }
                                ${!unlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                            `}
                        >
                            <span className="mr-1">{service.icon}</span>
                            {service.shortName}

                            {/* Emergency pulse */}
                            {service.id === 'igd' && emergencyCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer hint */}
            <div className={`mt-3 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Users size={12} className="inline mr-1" />
                Rekrut staff untuk membuka layanan baru
            </div>
        </div>
    );
}
