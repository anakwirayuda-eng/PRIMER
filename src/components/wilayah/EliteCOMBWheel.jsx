import React, { useState } from 'react';
// framer-motion removed — using plain CSS transitions
import { X, Info, Zap, Shield, Eye, ArrowRight } from 'lucide-react';

const COM_B_DOMAINS = [
    {
        id: 'cap_psy', label: 'Psychological Capability', shortLabel: 'CAP-PSY', color: '#3b82f6', icon: '🧠',
        interventions: ['education', 'training', 'enablement']
    },
    {
        id: 'cap_phy', label: 'Physical Capability', shortLabel: 'CAP-PHY', color: '#0ea5e9', icon: '💪',
        interventions: ['training', 'enablement']
    },
    {
        id: 'opp_phy', label: 'Physical Opportunity', shortLabel: 'OPP-PHY', color: '#10b981', icon: '🏗️',
        interventions: ['training', 'restriction', 'environmental_restructuring']
    },
    {
        id: 'opp_soc', label: 'Social Opportunity', shortLabel: 'OPP-SOC', color: '#059669', icon: '👥',
        interventions: ['restriction', 'environmental_restructuring', 'modelling']
    },
    {
        id: 'mot_ref', label: 'Reflective Motivation', shortLabel: 'MOT-REF', color: '#f59e0b', icon: '🤔',
        interventions: ['education', 'persuasion', 'incentivisation', 'coercion']
    },
    {
        id: 'mot_aut', label: 'Automatic Motivation', shortLabel: 'MOT-AUT', color: '#ea580c', icon: '⚡',
        interventions: ['persuasion', 'incentivisation', 'coercion', 'environmental_restructuring', 'modelling', 'enablement']
    }
];

const INTERVENTIONS = [
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

export default function EliteCOMBWheel({ activeBarriers = [], size = 400, onSelectBarrier }) {
    const [hoveredDomain, setHoveredDomain] = useState(null);
    const [hoveredIntervention, setHoveredIntervention] = useState(null);

    const cx = size / 2;
    const cy = size / 2;
    const innerR = size * 0.25;
    const midR = size * 0.40;
    const outerR = size * 0.50;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const drawWedge = (cx, cy, rIn, rOut, startAngle, endAngle) => {
        // Proper SVG path for a donut wedge
        const startOuter = polarToCartesian(cx, cy, rOut, startAngle);
        const endOuter = polarToCartesian(cx, cy, rOut, endAngle);
        const startInner = polarToCartesian(cx, cy, rIn, endAngle);
        const endInner = polarToCartesian(cx, cy, rIn, startAngle);
        const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

        return `M ${startOuter.x} ${startOuter.y} 
                A ${rOut} ${rOut} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y} 
                L ${startInner.x} ${startInner.y} 
                A ${rIn} ${rIn} 0 ${largeArc} 0 ${endInner.x} ${endInner.y} Z`;
    };

    // Calculation for domains (6 slices)
    const domainAngle = 360 / COM_B_DOMAINS.length;

    // Calculation for interventions (9 slices)
    const interventionAngle = 360 / INTERVENTIONS.length;

    const isActiveDomain = (domId) => activeBarriers.includes(domId);
    const isDomainHighlighted = (domId) => {
        if (hoveredDomain) return hoveredDomain.id === domId;
        if (hoveredIntervention) return COM_B_DOMAINS.find(d => d.id === domId)?.interventions.includes(hoveredIntervention.id);
        return false;
    };
    const isInterventionHighlighted = (intId) => {
        if (hoveredIntervention) return hoveredIntervention.id === intId;
        if (hoveredDomain) return hoveredDomain.interventions.includes(intId);
        return false;
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl">
            {/* Header / Title Area */}
            <div className="absolute top-6 left-8">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">The Behaviour Change Wheel</h2>
                <div className="text-sm text-white/50 font-mono mt-1"> Michie et al. (2011) — Diagnostic Engine</div>
            </div>

            <div className="relative mt-8" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-2xl">

                    {/* OUTER RING: Interventions */}
                    {INTERVENTIONS.map((intv, i) => {
                        const start = i * interventionAngle;
                        const end = (i + 1) * interventionAngle;
                        const mid = start + interventionAngle / 2;
                        const textPos = polarToCartesian(cx, cy, midR + (outerR - midR) / 2, mid);
                        const isHighlighted = isInterventionHighlighted(intv.id);

                        return (
                            <g
                                key={intv.id}
                                onMouseEnter={() => setHoveredIntervention(intv)}
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
                                    x={textPos.x} y={textPos.y}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill={isHighlighted ? '#fff' : 'rgba(255,255,255,0.4)'}
                                    fontSize="10"
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    {intv.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* INNER RING: COM-B Domains */}
                    {COM_B_DOMAINS.map((dom, i) => {
                        const start = i * domainAngle;
                        const end = (i + 1) * domainAngle;
                        const mid = start + domainAngle / 2;
                        const textPos = polarToCartesian(cx, cy, innerR + (midR - innerR) / 2, mid);
                        const active = isActiveDomain(dom.id);
                        const highlighted = isDomainHighlighted(dom.id);

                        // Opacity logic:
                        // 1. If it's active in the scenario, it should be highly visible (0.8)
                        // 2. If it's highlighted via hover, bump to 1.0
                        // 3. If it's neither, keep it dim (0.2)
                        const opacity = highlighted ? 1 : (active ? 0.7 : 0.15);

                        return (
                            <g
                                key={dom.id}
                                onMouseEnter={() => setHoveredDomain(dom)}
                                onMouseLeave={() => setHoveredDomain(null)}
                                onClick={() => onSelectBarrier && onSelectBarrier(dom)}
                                className="transition-all duration-300 cursor-pointer"
                            >
                                <path
                                    d={drawWedge(cx, cy, innerR, midR, start, end)}
                                    fill={dom.color}
                                    stroke={highlighted ? '#fff' : 'rgba(255,255,255,0.1)'}
                                    strokeWidth={highlighted ? 3 : 1}
                                    opacity={opacity}
                                    className="transition-opacity duration-300"
                                />
                                <text
                                    x={textPos.x} y={textPos.y - 12}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fontSize="24"
                                    opacity={opacity < 0.3 ? 0.3 : 1}
                                    className="transition-opacity"
                                >
                                    {dom.icon}
                                </text>
                                <text
                                    x={textPos.x} y={textPos.y + 12}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill="#fff" fontSize="12" fontWeight="black"
                                    opacity={opacity < 0.3 ? 0.3 : 1}
                                    className="transition-opacity"
                                >
                                    {dom.shortLabel}
                                </text>
                            </g>
                        );
                    })}

                    {/* CENTER HUB */}
                    <circle cx={cx} cy={cy} r={innerR - 6} fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize="28" fontWeight="black" tracking="tight">BEHAVIOUR</text>
                    <text x={cx} y={cy + 15} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">COM-B MODEL</text>
                </svg>

                {/* Info Panel for Hovered items */}
                {(hoveredDomain || hoveredIntervention) && (
                    <div
                        className="absolute -right-64 top-1/2 -translate-y-1/2 w-60 bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                        {hoveredDomain && (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-2xl">{hoveredDomain.icon}</div>
                                    {isActiveDomain(hoveredDomain.id) && (
                                        <span className="bg-red-500/20 text-red-400 text-[9px] uppercase px-2 py-0.5 rounded font-bold border border-red-500/30">Detected Barrier</span>
                                    )}
                                </div>
                                <h4 className="text-sm font-black text-white" style={{ color: hoveredDomain.color }}>{hoveredDomain.label}</h4>
                                <div className="mt-3">
                                    <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">Recommended Interventions</span>
                                    <div className="flex flex-wrap gap-1">
                                        {hoveredDomain.interventions.map(intId => {
                                            const intData = INTERVENTIONS.find(i => i.id === intId);
                                            return <span key={intId} className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap">{intData?.icon} {intData?.label}</span>
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                        {hoveredIntervention && !hoveredDomain && (
                            <>
                                <div className="text-2xl mb-2">{hoveredIntervention.icon}</div>
                                <h4 className="text-sm font-black text-pink-400">{hoveredIntervention.label}</h4>
                                <p className="text-[10px] text-white/70 mt-1">Select an intervention strategy to address the associated behavioral barriers.</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end border-t border-white/10 pt-4 mt-8 pointer-events-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-white/70 font-mono">Capability</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-white/70 font-mono">Opportunity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-white/70 font-mono">Motivation</span>
                    </div>
                </div>
                <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase">PRIMER Behavioral Science Engine</div>
            </div>
        </div>
    );
}
