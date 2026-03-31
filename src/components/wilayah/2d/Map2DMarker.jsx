/**
 * @reflection
 * [IDENTITY]: Map2DMarker
 * [PURPOSE]: Single interactive building marker for 2D blueprint map.
 *            Supports hover tooltips, selection glow, overlay coloring, 
 *            locked RW state, and outbreak/alert pulse animations.
 * [STATE]: New
 * [DEPENDS_ON]: constants.js (BUILDING_TYPES)
 */

import React, { useState, useMemo } from 'react';
import { BUILDING_TYPES } from '../constants.js';

// ── Building type → emoji icon mapping ──
function getMarkerIcon(type) {
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: return '🏥';
        case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES: return '🩺';
        case BUILDING_TYPES.RUMAH_DINAS: return '🏡';
        case BUILDING_TYPES.SCHOOL: return '🏫';
        case BUILDING_TYPES.TK: return '🎒';
        case BUILDING_TYPES.MOSQUE: return '🕌';
        case BUILDING_TYPES.MARKET: return '🏪';
        case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG: return '🛒';
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: return '🏛️';
        case BUILDING_TYPES.POSYANDU: return '💗';
        case BUILDING_TYPES.MCK: return '🚿';
        case BUILDING_TYPES.WELL: return '💧';
        case BUILDING_TYPES.APOTEK: return '💊';
        case BUILDING_TYPES.ALUN_ALUN: case BUILDING_TYPES.LAPANGAN: return '⬜';
        case BUILDING_TYPES.PLAYGROUND: return '🎠';
        case BUILDING_TYPES.TPU: return '🪦';
        case BUILDING_TYPES.FARM: return '🌾';
        case BUILDING_TYPES.BANK_SAMPAH: return '♻️';
        case BUILDING_TYPES.PAMSIMAS: return '🏗️';
        case BUILDING_TYPES.POS_GIZI: return '🍎';
        case BUILDING_TYPES.RTK: return '🤰';
        case BUILDING_TYPES.KB_POST: return '👶';
        case BUILDING_TYPES.TOGA: return '🌿';
        case BUILDING_TYPES.POS_UKK: return '🦺';
        case BUILDING_TYPES.IKS_SCOREBOARD: return '📊';
        case BUILDING_TYPES.DASHAT: return '🍲';
        case BUILDING_TYPES.HUTAN_LINDUNG: return '🌳';
        case BUILDING_TYPES.SUNGAI_CIKAPAS: return '🏞️';
        case BUILDING_TYPES.GAPURA_DESA: return '⛩️';
        case BUILDING_TYPES.SAWAH_BERUNDAK: return '🌾';
        case BUILDING_TYPES.HOUSE_RED: case BUILDING_TYPES.HOUSE_BLUE:
        case BUILDING_TYPES.HOUSE_TRAD: case BUILDING_TYPES.HOUSE_MODERN:
        case BUILDING_TYPES.HOUSE_HUT: return '🏠';
        default: return '🏠';
    }
}

// ── Building type → background color ──
function getMarkerBg(type) {
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES:
            return 'rgba(220,38,38,0.35)';       // red health
        case BUILDING_TYPES.APOTEK: return 'rgba(16,185,129,0.3)';
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.POS_GIZI: case BUILDING_TYPES.RTK:
        case BUILDING_TYPES.KB_POST: case BUILDING_TYPES.POS_UKK:
            return 'rgba(236,72,153,0.3)';        // pink community
        case BUILDING_TYPES.SCHOOL: case BUILDING_TYPES.TK:
            return 'rgba(245,158,11,0.3)';        // amber education
        case BUILDING_TYPES.MOSQUE: return 'rgba(22,163,74,0.3)';
        case BUILDING_TYPES.MARKET: case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG:
            return 'rgba(120,53,15,0.35)';        // brown commerce
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: case BUILDING_TYPES.RUMAH_DINAS:
            return 'rgba(51,65,85,0.45)';         // slate official
        case BUILDING_TYPES.HUTAN_LINDUNG: return 'rgba(5,46,22,0.4)';
        case BUILDING_TYPES.SUNGAI_CIKAPAS: return 'rgba(14,165,233,0.35)';
        default: return 'rgba(100,116,139,0.25)'; // neutral slate
    }
}

// ── Marker size by importance ──
function getMarkerSize(type) {
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: return 28;
        case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES:
        case BUILDING_TYPES.SCHOOL: case BUILDING_TYPES.TK:
        case BUILDING_TYPES.MOSQUE: case BUILDING_TYPES.MARKET:
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA:
            return 22;
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.ALUN_ALUN:
        case BUILDING_TYPES.HUTAN_LINDUNG: case BUILDING_TYPES.SUNGAI_CIKAPAS:
        case BUILDING_TYPES.GAPURA_DESA: case BUILDING_TYPES.SAWAH_BERUNDAK:
            return 20;
        default: return 16; // houses & small posts
    }
}

// ── Detective mode: does this building have an issue for the active layer? ──
function isBuildingAtRisk(building, activeLayer) {
    if (activeLayer === 'general') return false;
    if (activeLayer === 'pispk') return building.familyData?.iksScore != null && building.familyData.iksScore < 0.4;
    if (activeLayer === 'surveillance') return building.hasCase || building.familyData?.hasCase;
    if (activeLayer === 'phbs') return building.familyData?.phbsScore != null && building.familyData.phbsScore < 4;
    if (activeLayer === 'perilaku') return building.familyData?.behaviorRisk === 'high' || building.familyData?.behaviorRisk === 'medium';
    if (activeLayer === 'psn') return building.hasJentik;
    return false;
}

// ── Overlay ring color ──
function getOverlayRingColor(building, activeLayer) {
    if (activeLayer === 'pispk') {
        const iks = building.familyData?.iksScore ?? 1;
        if (iks >= 0.8) return '#34d399';
        if (iks >= 0.5) return '#fbbf24';
        return '#f87171';
    }
    if (activeLayer === 'surveillance') return building.hasCase ? '#ef4444' : 'transparent';
    if (activeLayer === 'phbs') {
        const phbs = building.familyData?.phbsScore ?? 10;
        if (phbs >= 7) return '#34d399';
        if (phbs >= 4) return '#fbbf24';
        return '#f87171';
    }
    if (activeLayer === 'perilaku') {
        const risk = building.familyData?.behaviorRisk;
        if (risk === 'high') return '#ef4444';
        if (risk === 'medium') return '#f97316';
        return '#34d399';
    }
    if (activeLayer === 'psn') return building.hasJentik ? '#ef4444' : '#a3e635';
    return 'transparent';
}


export default function Map2DMarker({ building, cellSize, activeLayer, selected, onClick }) {
    const [hovered, setHovered] = useState(false);

    const icon = useMemo(() => getMarkerIcon(building.type), [building.type]);
    const bgColor = useMemo(() => getMarkerBg(building.type), [building.type]);
    const size = useMemo(() => getMarkerSize(building.type), [building.type]);
    const atRisk = useMemo(() => isBuildingAtRisk(building, activeLayer), [building, activeLayer]);
    const isDetective = activeLayer && activeLayer !== 'general';
    const isLocked = building.isLocked;
    const hasOutbreak = building.hasCase || building.familyData?.hasCase;
    const isHouse = building.familyId != null;

    // Overlay ring
    const ringColor = useMemo(() => {
        if (!isDetective || !isHouse) return 'transparent';
        return getOverlayRingColor(building, activeLayer);
    }, [building, activeLayer, isDetective, isHouse]);

    const left = building.x * cellSize - size / 2;
    const top = building.y * cellSize - size / 2;

    return (
        <div
            className="absolute transition-all duration-150 cursor-pointer select-none group"
            style={{
                left,
                top,
                width: size,
                height: size,
                zIndex: selected ? 50 : hovered ? 40 : isHouse ? 10 : 20,
                transform: hovered ? 'scale(1.5)' : selected ? 'scale(1.35)' : 'scale(1)',
                filter: isLocked ? 'grayscale(1) brightness(0.4)' : isDetective && !atRisk && isHouse ? 'grayscale(0.8) brightness(0.5)' : 'none',
                pointerEvents: isLocked ? 'none' : 'auto',
            }}
            onClick={(e) => { e.stopPropagation(); onClick(building); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Overlay ring (detective mode) */}
            {isDetective && ringColor !== 'transparent' && (
                <div
                    className="absolute inset-[-3px] rounded-full pointer-events-none"
                    style={{
                        border: `2px solid ${ringColor}`,
                        boxShadow: atRisk ? `0 0 8px 2px ${ringColor}` : 'none',
                        animation: atRisk ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    }}
                />
            )}

            {/* Outbreak pulse */}
            {hasOutbreak && !isDetective && (
                <div
                    className="absolute inset-[-5px] rounded-full pointer-events-none"
                    style={{
                        border: '2px solid #ef4444',
                        boxShadow: '0 0 12px 3px rgba(239,68,68,0.5)',
                        animation: 'pulse 1s ease-in-out infinite',
                    }}
                />
            )}

            {/* Selected glow */}
            {selected && (
                <div
                    className="absolute inset-[-4px] rounded-full pointer-events-none"
                    style={{
                        border: '2px solid #f59e0b',
                        boxShadow: '0 0 10px 3px rgba(245,158,11,0.4)',
                    }}
                />
            )}

            {/* Marker body */}
            <div
                className="w-full h-full rounded-full flex items-center justify-center relative"
                style={{
                    background: bgColor,
                    backdropFilter: 'blur(4px)',
                    border: `1px solid rgba(255,255,255,${hovered ? 0.3 : 0.1})`,
                    boxShadow: hovered ? '0 0 12px rgba(255,255,255,0.1)' : 'none',
                }}
            >
                <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>
                    {isLocked ? '🔒' : icon}
                </span>
            </div>

            {/* Tooltip */}
            {hovered && !isLocked && (
                <div
                    className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    style={{ zIndex: 999 }}
                >
                    <div className="px-2.5 py-1.5 rounded-lg text-center"
                        style={{
                            background: 'rgba(15,23,42,0.92)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}
                    >
                        <div className="text-[8px] font-black uppercase tracking-[0.15em] text-emerald-400">
                            {(building.type || '').replace(/_/g, ' ')}
                        </div>
                        <div className="text-[11px] font-extrabold text-white leading-tight mt-0.5">
                            {building.name || 'Bangunan'}
                        </div>
                        {building.familyData?.iksScore != null && (
                            <div className={`text-[9px] font-bold mt-0.5 ${building.familyData.iksScore >= 0.8 ? 'text-emerald-400' : building.familyData.iksScore >= 0.5 ? 'text-amber-400' : 'text-red-400'}`}>
                                IKS {(building.familyData.iksScore * 100).toFixed(0)}%
                            </div>
                        )}
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-0 h-0 mx-auto" style={{
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '5px solid rgba(15,23,42,0.92)',
                    }} />
                </div>
            )}
        </div>
    );
}
