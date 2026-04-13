import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translateWilayahString } from './contentI18n.js';

const BASE_COM_B_DOMAINS = [
    {
        id: 'cap_psy',
        label: 'Psychological Capability',
        shortLabel: 'CAP-PSY',
        color: '#3b82f6',
        icon: '🧠',
        interventions: ['education', 'training', 'enablement']
    },
    {
        id: 'cap_phy',
        label: 'Physical Capability',
        shortLabel: 'CAP-PHY',
        color: '#0ea5e9',
        icon: '💪',
        interventions: ['training', 'enablement']
    },
    {
        id: 'opp_phy',
        label: 'Physical Opportunity',
        shortLabel: 'OPP-PHY',
        color: '#10b981',
        icon: '🏗️',
        interventions: ['training', 'restriction', 'environmental_restructuring']
    },
    {
        id: 'opp_soc',
        label: 'Social Opportunity',
        shortLabel: 'OPP-SOC',
        color: '#059669',
        icon: '👥',
        interventions: ['restriction', 'environmental_restructuring', 'modelling']
    },
    {
        id: 'mot_ref',
        label: 'Reflective Motivation',
        shortLabel: 'MOT-REF',
        color: '#f59e0b',
        icon: '🤔',
        interventions: ['education', 'persuasion', 'incentivisation', 'coercion']
    },
    {
        id: 'mot_aut',
        label: 'Automatic Motivation',
        shortLabel: 'MOT-AUT',
        color: '#ea580c',
        icon: '⚡',
        interventions: ['persuasion', 'incentivisation', 'coercion', 'environmental_restructuring', 'modelling', 'enablement']
    }
];

const BASE_INTERVENTIONS = [
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'persuasion', label: 'Persuasion', icon: '🗣️' },
    { id: 'incentivisation', label: 'Incentivisation', icon: '🎁' },
    { id: 'coercion', label: 'Coercion', icon: '⚠️' },
    { id: 'training', label: 'Training', icon: '🎯' },
    { id: 'restriction', label: 'Restriction', icon: '🚫' },
    { id: 'environmental_restructuring', label: 'Environmental Restructuring', icon: '🌍' },
    { id: 'modelling', label: 'Modelling', icon: '🌟' },
    { id: 'enablement', label: 'Enablement', icon: '🔧' }
];

function getLabelFontSize(label) {
    if (!label) return 10;
    if (label.length > 24) return 6;
    if (label.length > 18) return 7;
    if (label.length > 13) return 8;
    return 10;
}

export default function EliteCOMBWheel({ activeBarriers = [], size = 400, onSelectBarrier }) {
    const [hoveredDomain, setHoveredDomain] = useState(null);
    const [hoveredIntervention, setHoveredIntervention] = useState(null);
    const { t } = useTranslation();

    const copy = useMemo(() => ({
        title: translateWilayahString(t, 'wilayahContent.ui.combWheel.title', 'The Behaviour Change Wheel'),
        subtitle: translateWilayahString(
            t,
            'wilayahContent.ui.combWheel.subtitle',
            'Michie et al. (2011) | Behavioral diagnostic engine'
        ),
        detectedBarrier: translateWilayahString(t, 'wilayahContent.ui.combWheel.detectedBarrier', 'Detected barrier'),
        recommendedInterventions: translateWilayahString(
            t,
            'wilayahContent.ui.combWheel.recommendedInterventions',
            'Recommended interventions'
        ),
        interventionHelp: translateWilayahString(
            t,
            'wilayahContent.ui.combWheel.interventionHelp',
            'Select an intervention strategy to address the associated behavioral barriers.'
        ),
        legendCapability: translateWilayahString(t, 'wilayahContent.ui.combWheel.legendCapability', 'Capability'),
        legendOpportunity: translateWilayahString(t, 'wilayahContent.ui.combWheel.legendOpportunity', 'Opportunity'),
        legendMotivation: translateWilayahString(t, 'wilayahContent.ui.combWheel.legendMotivation', 'Motivation'),
        engineLabel: translateWilayahString(
            t,
            'wilayahContent.ui.combWheel.engineLabel',
            'PRIMER Behavioral Science Engine'
        ),
        centerTitle: translateWilayahString(t, 'wilayahContent.ui.combWheel.centerTitle', 'BEHAVIOUR'),
        centerSubtitle: translateWilayahString(t, 'wilayahContent.ui.combWheel.centerSubtitle', 'COM-B MODEL')
    }), [t]);

    const domains = useMemo(
        () => BASE_COM_B_DOMAINS.map((domain) => ({
            ...domain,
            label: translateWilayahString(
                t,
                `wilayahContent.ui.combWheel.domains.${domain.id}.label`,
                domain.label
            ),
            shortLabel: translateWilayahString(
                t,
                `wilayahContent.ui.combWheel.domains.${domain.id}.shortLabel`,
                domain.shortLabel
            )
        })),
        [t]
    );

    const interventions = useMemo(
        () => BASE_INTERVENTIONS.map((intervention) => ({
            ...intervention,
            label: translateWilayahString(
                t,
                `wilayahContent.ui.combWheel.interventions.${intervention.id}`,
                intervention.label
            )
        })),
        [t]
    );

    const cx = size / 2;
    const cy = size / 2;
    const innerR = size * 0.25;
    const midR = size * 0.40;
    const outerR = size * 0.50;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const drawWedge = (centerX, centerY, rIn, rOut, startAngle, endAngle) => {
        const startOuter = polarToCartesian(centerX, centerY, rOut, startAngle);
        const endOuter = polarToCartesian(centerX, centerY, rOut, endAngle);
        const startInner = polarToCartesian(centerX, centerY, rIn, endAngle);
        const endInner = polarToCartesian(centerX, centerY, rIn, startAngle);
        const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

        return `M ${startOuter.x} ${startOuter.y}
                A ${rOut} ${rOut} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}
                L ${startInner.x} ${startInner.y}
                A ${rIn} ${rIn} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`;
    };

    const domainAngle = 360 / domains.length;
    const interventionAngle = 360 / interventions.length;

    const isActiveDomain = (domainId) => activeBarriers.includes(domainId);
    const isDomainHighlighted = (domainId) => {
        if (hoveredDomain) return hoveredDomain.id === domainId;
        if (hoveredIntervention) {
            return domains.find((domain) => domain.id === domainId)?.interventions.includes(hoveredIntervention.id);
        }
        return false;
    };
    const isInterventionHighlighted = (interventionId) => {
        if (hoveredIntervention) return hoveredIntervention.id === interventionId;
        if (hoveredDomain) return hoveredDomain.interventions.includes(interventionId);
        return false;
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute top-6 left-8">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">{copy.title}</h2>
                <div className="text-sm text-white/50 font-mono mt-1">{copy.subtitle}</div>
            </div>

            <div className="relative mt-8" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-2xl">
                    {interventions.map((intervention, index) => {
                        const start = index * interventionAngle;
                        const end = (index + 1) * interventionAngle;
                        const mid = start + interventionAngle / 2;
                        const textPos = polarToCartesian(cx, cy, midR + (outerR - midR) / 2, mid);
                        const isHighlighted = isInterventionHighlighted(intervention.id);

                        return (
                            <g
                                key={intervention.id}
                                onMouseEnter={() => setHoveredIntervention(intervention)}
                                onMouseLeave={() => setHoveredIntervention(null)}
                                className="transition-all duration-300 cursor-help"
                            >
                                <path
                                    d={drawWedge(cx, cy, midR + 2, outerR, start, end)}
                                    fill={isHighlighted ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255,255,255,0.02)'}
                                    stroke={isHighlighted ? '#ec4899' : 'rgba(255,255,255,0.1)'}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    className="transition-colors duration-300"
                                />
                                <text
                                    x={textPos.x}
                                    y={textPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isHighlighted ? '#fff' : 'rgba(255,255,255,0.4)'}
                                    fontSize={getLabelFontSize(intervention.label)}
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    {intervention.label}
                                </text>
                            </g>
                        );
                    })}

                    {domains.map((domain, index) => {
                        const start = index * domainAngle;
                        const end = (index + 1) * domainAngle;
                        const mid = start + domainAngle / 2;
                        const textPos = polarToCartesian(cx, cy, innerR + (midR - innerR) / 2, mid);
                        const active = isActiveDomain(domain.id);
                        const highlighted = isDomainHighlighted(domain.id);
                        const opacity = highlighted ? 1 : (active ? 0.7 : 0.15);

                        return (
                            <g
                                key={domain.id}
                                onMouseEnter={() => setHoveredDomain(domain)}
                                onMouseLeave={() => setHoveredDomain(null)}
                                onClick={() => onSelectBarrier && onSelectBarrier(domain)}
                                className="transition-all duration-300 cursor-pointer"
                            >
                                <path
                                    d={drawWedge(cx, cy, innerR, midR, start, end)}
                                    fill={domain.color}
                                    stroke={highlighted ? '#fff' : 'rgba(255,255,255,0.1)'}
                                    strokeWidth={highlighted ? 3 : 1}
                                    opacity={opacity}
                                    className="transition-opacity duration-300"
                                />
                                <text
                                    x={textPos.x}
                                    y={textPos.y - 12}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="24"
                                    opacity={opacity < 0.3 ? 0.3 : 1}
                                    className="transition-opacity"
                                >
                                    {domain.icon}
                                </text>
                                <text
                                    x={textPos.x}
                                    y={textPos.y + 12}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#fff"
                                    fontSize="11"
                                    fontWeight="black"
                                    opacity={opacity < 0.3 ? 0.3 : 1}
                                    className="transition-opacity"
                                >
                                    {domain.shortLabel}
                                </text>
                            </g>
                        );
                    })}

                    <circle
                        cx={cx}
                        cy={cy}
                        r={innerR - 6}
                        fill="rgba(15, 23, 42, 0.9)"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                    />
                    <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize="28" fontWeight="black" tracking="tight">
                        {copy.centerTitle}
                    </text>
                    <text x={cx} y={cy + 15} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
                        {copy.centerSubtitle}
                    </text>
                </svg>

                {(hoveredDomain || hoveredIntervention) && (
                    <div className="absolute -right-64 top-1/2 -translate-y-1/2 w-60 bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                        {hoveredDomain && (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-2xl">{hoveredDomain.icon}</div>
                                    {isActiveDomain(hoveredDomain.id) && (
                                        <span className="bg-red-500/20 text-red-400 text-[9px] uppercase px-2 py-0.5 rounded font-bold border border-red-500/30">
                                            {copy.detectedBarrier}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-black text-white" style={{ color: hoveredDomain.color }}>
                                    {hoveredDomain.label}
                                </h4>
                                <div className="mt-3">
                                    <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">
                                        {copy.recommendedInterventions}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {hoveredDomain.interventions.map((interventionId) => {
                                            const intervention = interventions.find((item) => item.id === interventionId);
                                            return (
                                                <span
                                                    key={interventionId}
                                                    className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                                                >
                                                    {intervention?.icon} {intervention?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                        {hoveredIntervention && !hoveredDomain && (
                            <>
                                <div className="text-2xl mb-2">{hoveredIntervention.icon}</div>
                                <h4 className="text-sm font-black text-pink-400">{hoveredIntervention.label}</h4>
                                <p className="text-[10px] text-white/70 mt-1">{copy.interventionHelp}</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end border-t border-white/10 pt-4 mt-8 pointer-events-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-white/70 font-mono">{copy.legendCapability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-white/70 font-mono">{copy.legendOpportunity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-white/70 font-mono">{copy.legendMotivation}</span>
                    </div>
                </div>
                <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase">{copy.engineLabel}</div>
            </div>
        </div>
    );
}
