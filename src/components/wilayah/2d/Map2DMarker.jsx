/**
 * @reflection
 * [IDENTITY]: Map2DMarker
 * [PURPOSE]: Single interactive building marker for 2D blueprint map.
 *            Phase 2: Acrylic Token style with economy-tier LED coloring,
 *            tap-first mobile UX, and icon mapping for all 47 building types.
 * [STATE]: Production
 * [DEPENDS_ON]: constants.js (BUILDING_TYPES)
 */

import React, { useState, useMemo, memo } from 'react';
import { BUILDING_TYPES } from '../constants.js';
import {
    Cross, Stethoscope, Home, School, Backpack, Moon, Store, ShoppingCart,
    Landmark, Heart, ShowerHead, Droplets, Pill, Square, FerrisWheel,
    Leaf, Recycle, Construction, Apple, Baby, Sprout, HardHat,
    BarChart3, Soup, Trees, Waves, Tent, Wheat, Footprints,
    Hotel, Anchor, Shield, BookOpen, Skull, Beef, Info, Binoculars,
} from 'lucide-react';

// ═══ ECONOMY TIER → LED DOT COLOR (Geospatial Law 1 visual) ═══
const ECONOMY_LED = {
    'High':       '#34d399', // emerald — prosperity
    'Middle':     '#60a5fa', // blue — stable
    'Low-Middle': '#fbbf24', // amber — at-risk
    'Low':        '#f97316', // orange — vulnerable
    'Very Low':   '#ef4444', // red — critical
};

// ═══ Guardrail #7: Zero-Emoji → lucide SVG icons (XII.K Hack 2) ═══
function getMarkerIcon(type) {
    const s = { width: '60%', height: '60%', strokeWidth: 2 };
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: return <Cross {...s} />;
        case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES: return <Stethoscope {...s} />;
        case BUILDING_TYPES.RUMAH_DINAS: return <Home {...s} />;
        case BUILDING_TYPES.SCHOOL: return <School {...s} />;
        case BUILDING_TYPES.TK: return <Backpack {...s} />;
        case BUILDING_TYPES.MOSQUE: return <Moon {...s} />;
        case BUILDING_TYPES.MARKET: return <Store {...s} />;
        case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG: return <ShoppingCart {...s} />;
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: return <Landmark {...s} />;
        case BUILDING_TYPES.POSYANDU: return <Heart {...s} />;
        case BUILDING_TYPES.MCK: return <ShowerHead {...s} />;
        case BUILDING_TYPES.WELL: return <Droplets {...s} />;
        case BUILDING_TYPES.APOTEK: return <Pill {...s} />;
        case BUILDING_TYPES.ALUN_ALUN: case BUILDING_TYPES.LAPANGAN: return <Square {...s} />;
        case BUILDING_TYPES.PLAYGROUND: return <FerrisWheel {...s} />;
        case BUILDING_TYPES.TPU: return <Leaf {...s} />;
        case BUILDING_TYPES.FARM: return <Wheat {...s} />;
        case BUILDING_TYPES.BANK_SAMPAH: return <Recycle {...s} />;
        case BUILDING_TYPES.PAMSIMAS: return <Construction {...s} />;
        case BUILDING_TYPES.POS_GIZI: return <Apple {...s} />;
        case BUILDING_TYPES.RTK: return <Baby {...s} />;
        case BUILDING_TYPES.KB_POST: return <Baby {...s} />;
        case BUILDING_TYPES.TOGA: return <Sprout {...s} />;
        case BUILDING_TYPES.POS_UKK: return <HardHat {...s} />;
        case BUILDING_TYPES.IKS_SCOREBOARD: return <BarChart3 {...s} />;
        case BUILDING_TYPES.DASHAT: return <Soup {...s} />;
        case BUILDING_TYPES.HUTAN_LINDUNG: return <Trees {...s} />;
        case BUILDING_TYPES.SUNGAI_CIKAPAS: return <Waves {...s} />;
        case BUILDING_TYPES.GAPURA_DESA: return <Tent {...s} />;
        case BUILDING_TYPES.SAWAH_BERUNDAK: return <Wheat {...s} />;
        case BUILDING_TYPES.JEMBATAN: return <Footprints {...s} />;
        case BUILDING_TYPES.WATERFALL: case BUILDING_TYPES.SUNGAI: return <Waves {...s} />;
        // ═══ Desa Wisata + One Health types ═══
        case BUILDING_TYPES.HOMESTAY: return <Hotel {...s} />;
        case BUILDING_TYPES.DERMAGA: return <Anchor {...s} />;
        case BUILDING_TYPES.POS_RONDA: return <Shield {...s} />;
        case BUILDING_TYPES.PESANTREN: return <BookOpen {...s} />;
        case BUILDING_TYPES.PADEPOKAN_DUKUN: return <Skull {...s} />;
        case BUILDING_TYPES.PASAR_HEWAN: return <Beef {...s} />;
        case BUILDING_TYPES.INFO_WISATA: return <Info {...s} />;
        case BUILDING_TYPES.GARDU_PANDANG: return <Binoculars {...s} />;
        // Houses — return null to use LED dot instead
        case BUILDING_TYPES.HOUSE_RED: case BUILDING_TYPES.HOUSE_BLUE:
        case BUILDING_TYPES.HOUSE_TRAD: case BUILDING_TYPES.HOUSE_MODERN:
        case BUILDING_TYPES.HOUSE_HUT: return null;
        default: return null;
    }
}

// ── Building type → background color ──
function getMarkerBg(type) {
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES:
            return 'rgba(220,38,38,0.35)';
        case BUILDING_TYPES.APOTEK: return 'rgba(16,185,129,0.3)';
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.POS_GIZI: case BUILDING_TYPES.RTK:
        case BUILDING_TYPES.KB_POST: case BUILDING_TYPES.POS_UKK:
            return 'rgba(236,72,153,0.3)';
        case BUILDING_TYPES.SCHOOL: case BUILDING_TYPES.TK: case BUILDING_TYPES.PESANTREN:
            return 'rgba(245,158,11,0.3)';
        case BUILDING_TYPES.MOSQUE: return 'rgba(22,163,74,0.3)';
        case BUILDING_TYPES.MARKET: case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG:
        case BUILDING_TYPES.PASAR_HEWAN:
            return 'rgba(120,53,15,0.35)';
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: case BUILDING_TYPES.RUMAH_DINAS:
        case BUILDING_TYPES.POS_RONDA:
            return 'rgba(51,65,85,0.45)';
        case BUILDING_TYPES.HUTAN_LINDUNG: return 'rgba(5,46,22,0.4)';
        case BUILDING_TYPES.SUNGAI_CIKAPAS: case BUILDING_TYPES.DERMAGA:
        case BUILDING_TYPES.WATERFALL: case BUILDING_TYPES.SUNGAI:
            return 'rgba(14,165,233,0.35)';
        case BUILDING_TYPES.HOMESTAY: case BUILDING_TYPES.INFO_WISATA: case BUILDING_TYPES.GARDU_PANDANG:
            return 'rgba(168,85,247,0.3)';
        case BUILDING_TYPES.PADEPOKAN_DUKUN:
            return 'rgba(139,92,246,0.35)';
        default: return null; // houses use LED dot, no bg
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
        case BUILDING_TYPES.PESANTREN: case BUILDING_TYPES.PADEPOKAN_DUKUN:
            return 22;
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.ALUN_ALUN:
        case BUILDING_TYPES.HUTAN_LINDUNG: case BUILDING_TYPES.SUNGAI_CIKAPAS:
        case BUILDING_TYPES.GAPURA_DESA: case BUILDING_TYPES.SAWAH_BERUNDAK:
        case BUILDING_TYPES.HOMESTAY: case BUILDING_TYPES.DERMAGA:
        case BUILDING_TYPES.PASAR_HEWAN: case BUILDING_TYPES.GARDU_PANDANG:
        case BUILDING_TYPES.WATERFALL:
            return 20;
        case BUILDING_TYPES.POS_RONDA: case BUILDING_TYPES.INFO_WISATA:
            return 18;
        // Houses: LED data nodes (economy-based sizing)
        default: return 10;
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


function Map2DMarkerInner({ building, cellSize, activeLayer, selected, onClick }) {
    const [hovered, setHovered] = useState(false);

    const icon = useMemo(() => getMarkerIcon(building.type), [building.type]);
    const bgColor = useMemo(() => getMarkerBg(building.type), [building.type]);
    const size = useMemo(() => getMarkerSize(building.type), [building.type]);
    const atRisk = useMemo(() => isBuildingAtRisk(building, activeLayer), [building, activeLayer]);
    const isDetective = activeLayer && activeLayer !== 'general';
    const isLocked = building.isLocked;
    const hasOutbreak = building.hasCase || building.familyData?.hasCase;
    const isHouse = building.familyId != null;

    // Economy-based LED color for houses
    const ledColor = useMemo(() => {
        if (!isHouse) return null;
        return ECONOMY_LED[building.economyTier] || ECONOMY_LED['Middle'];
    }, [isHouse, building.economyTier]);

    // Overlay ring
    const ringColor = useMemo(() => {
        if (!isDetective || !isHouse) return 'transparent';
        return getOverlayRingColor(building, activeLayer);
    }, [building, activeLayer, isDetective, isHouse]);

    const left = building.x * cellSize - size / 2;
    const top = building.y * cellSize - size / 2;

    // Minimum hit area for touch (44px for facilities, 24px for houses)
    const hitSize = isHouse ? Math.max(size, 24) : Math.max(size, 44);
    const hitOffset = (hitSize - size) / 2;

    return (
        <div
            className="absolute"
            style={{
                left: left - hitOffset,
                top: top - hitOffset,
                width: hitSize,
                height: hitSize,
                zIndex: selected ? 50 : hovered ? 40 : isHouse ? 10 : 20,
                pointerEvents: isLocked ? 'none' : 'auto',
            }}
            onClick={(e) => { e.stopPropagation(); onClick(building); }}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            {/* Visual marker (centered within hit area) */}
            <div
                className="absolute transition-all duration-150 select-none"
                style={{
                    left: hitOffset,
                    top: hitOffset,
                    width: size,
                    height: size,
                    transform: hovered ? 'scale(1.5)' : selected ? 'scale(1.35)' : 'scale(1)',
                    filter: isLocked ? 'grayscale(1) brightness(0.4)' : isDetective && !atRisk && isHouse ? 'grayscale(0.8) brightness(0.5)' : 'none',
                }}
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
                {isHouse ? (
                    // ═══ LED DATA NODE (economy-colored dot) ═══
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: ledColor,
                            opacity: 0.85,
                            boxShadow: `0 0 ${selected || hovered ? 8 : 4}px ${ledColor}`,
                            border: `1px solid rgba(255,255,255,${hovered ? 0.4 : 0.15})`,
                        }}
                    />
                ) : (
                    // ═══ ACRYLIC TOKEN (XII.K Hack 2 — board game pion) ═══
                    <div
                        className="w-full h-full rounded-lg flex items-center justify-center relative"
                        style={{
                            background: bgColor || 'rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(6px)',
                            borderTop: '1px solid rgba(255,255,255,0.35)',
                            border: `1.5px solid rgba(255,255,255,${hovered ? 0.35 : 0.15})`,
                            boxShadow: hovered
                                ? '2px 6px 0 rgba(0,0,0,0.18)'
                                : '2px 4px 0 rgba(0,0,0,0.12)',
                            color: 'currentColor',
                        }}
                    >
                        {icon || null}
                    </div>
                )}
            </div>

            {/* Tooltip (hover on desktop, appears on tap+hold on mobile) */}
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
                        {building.economyTier && (
                            <div className="text-[9px] font-bold mt-0.5" style={{ color: ledColor }}>
                                {building.economyTier}
                            </div>
                        )}
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

const Map2DMarker = memo(Map2DMarkerInner);
export default Map2DMarker;
