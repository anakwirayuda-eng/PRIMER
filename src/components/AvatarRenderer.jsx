/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (The Apex Vanguard Edition)
 * [PURPOSE]: Ultra-premium SVG avatar for PRIMER. Zero dependencies.
 *            - Sharp visual-novel jawline (V-shape, not capsule).
 *            - Soulful eyes (Sclera, Iris, Pupil, Catchlight).
 *            - Multi-layered cel-shading & dramatic cyan rim lighting.
 *            - Flawless Z-Index (hair back/front layers, hijab under lab coat).
 *            - vector-effect: non-scaling-stroke for multi-size.
 * [STATE]: Production
 * [ANCHOR]: AvatarRenderer
 * [DEPENDS_ON]: avatar/constants.js
 * [LAST_UPDATE]: 2026-03-26
 */

import React, { useMemo } from 'react';
import { SKIN_TONES, HAIR_COLORS } from './avatar/constants.js';

// ─── Re-exports for backward compat ───
export { SKIN_TONES, HAIR_COLORS };
export { HAIR_STYLES_MALE as HAIR_STYLE_OPTIONS_MALE, HAIR_STYLES_FEMALE as HAIR_STYLE_OPTIONS_FEMALE } from './avatar/constants.js';
export const HAIR_STYLES = {
    buzz: 'buzz', short: 'short', neat: 'neat', parted: 'parted',
    long: 'long', ponytail: 'ponytail', bun: 'bun', hijab: 'hijab',
};
export const AVATARS = [
    { id: 'doc_male_1', name: 'dr. Pria', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'dr. Wanita', icon: '👩‍⚕️', color: 'bg-pink-500' },
];

// ─── Core Art Variables ───
const SHADOW = '#020617';
const HIGHLIGHT = '#ffffff';

// ============================================================================
// PREMIUM SVG COMPONENTS
// ============================================================================

function VanguardHead({ skin, gender }) {
    const isFemale = gender === 'P';
    const jawPath = isFemale
        ? "M58,80 C58,125 78,156 100,156 C122,156 142,125 142,80 C142,40 120,25 100,25 C80,25 58,40 58,80Z"
        : "M56,80 C56,135 74,162 100,162 C126,162 144,135 144,80 C144,40 120,25 100,25 C80,25 56,40 56,80Z";
    const cheekShadow = isFemale
        ? "M100,25 C120,25 142,40 142,80 C142,125 122,156 100,156 C115,142 120,115 120,80 C120,50 112,35 100,25Z"
        : "M100,25 C120,25 144,40 144,80 C144,135 126,162 100,162 C115,145 122,115 122,80 C122,50 112,35 100,25Z";
    const neckPath = isFemale ? "M86,120 L114,120 L114,150 C100,156 86,150 86,150Z" : "M80,120 L120,120 L120,152 C100,162 80,152 80,152Z";
    const neckShadow = isFemale ? "M86,120 L114,120 L114,132 C104,138 96,138 86,132Z" : "M80,120 L120,120 L120,135 C106,142 94,142 80,135Z";

    return (
        <g id="head-base">
            <path d={neckPath} fill={skin} />
            <path d={neckShadow} fill={SHADOW} opacity="0.18" />
            {/* Ears (female smaller) */}
            <path d={isFemale ? "M54,85 L60,76 L60,102 L54,94Z" : "M50,85 L58,75 L58,105 L50,95Z"} fill={skin} />
            <path d={isFemale ? "M146,85 L140,76 L140,102 L146,94Z" : "M150,85 L142,75 L142,105 L150,95Z"} fill={skin} />
            <path d={isFemale ? "M56,88 L60,82 L60,98Z" : "M52,88 L56,82 L56,100Z"} fill={SHADOW} opacity="0.1" />
            <path d={jawPath} fill={skin} />
            <path d={cheekShadow} fill={SHADOW} opacity="0.08" />
            {/* Nose (female thinner) */}
            <path d="M100,85 L100,112 L95,116" fill="none" stroke={SHADOW} strokeWidth={isFemale ? "1.8" : "2.5"} strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
        </g>
    );
}

function VanguardFace({ mood, hairColor, gender }) {
    const isFemale = gender === 'P';
    const isPanic = mood === 'panic';
    const isRelieved = mood === 'relieved';
    const browY = isPanic ? 72 : (isFemale ? 76 : 80);
    const browThick = isFemale ? "2" : "3.5";

    return (
        <g id="face-expressions">
            {/* 1. EYEBROWS */}
            {isFemale ? (
                <>
                    <path d={isPanic ? `M62,${browY-4} Q75,${browY+2} 88,${browY-2}` : `M60,${browY+2} Q75,${browY-4} 88,${browY+1}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.8" />
                    <path d={isPanic ? `M138,${browY-4} Q125,${browY+2} 112,${browY-2}` : `M140,${browY+2} Q125,${browY-4} 112,${browY+1}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.8" />
                </>
            ) : (
                <>
                    <path d={isPanic ? `M60,${browY-4} Q75,${browY+3} 88,${browY-2}` : `M58,${browY} Q75,${browY-2} 88,${browY}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.85" />
                    <path d={isPanic ? `M140,${browY-4} Q125,${browY+3} 112,${browY-2}` : `M142,${browY} Q125,${browY-2} 112,${browY}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.85" />
                </>
            )}

            {/* 2. JEWEL EYES */}
            {isRelieved ? (
                <>
                    <path d="M64,94 Q75,86 86,94" fill="none" stroke={SHADOW} strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
                    <path d="M136,94 Q125,86 114,94" fill="none" stroke={SHADOW} strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
                    {isFemale && (
                        <>
                            <path d="M62,92 L58,90" fill="none" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                            <path d="M138,92 L142,90" fill="none" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        </>
                    )}
                </>
            ) : (
                <g id="eyes-open">
                    {/* A. Sclera (female rounder, male narrower) */}
                    <path d={isPanic ? "M60,90 C60,78 88,78 88,90 C88,102 60,102 60,90Z" : (isFemale ? "M60,90 Q75,81 88,90 Q75,98 60,90Z" : "M60,90 Q75,84 88,90 Q75,95 60,90Z")} fill="#f8fafc" />
                    <path d={isPanic ? "M140,90 C140,78 112,78 112,90 C112,102 140,102 140,90Z" : (isFemale ? "M140,90 Q125,81 112,90 Q125,98 140,90Z" : "M140,90 Q125,84 112,90 Q125,95 140,90Z")} fill="#f8fafc" />
                    {/* B. Sclera drop shadow (eyelid cast) */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M60,90 Q75,81 88,90 Q75,87 60,90Z" : "M60,90 Q75,84 88,90 Q75,87 60,90Z"} fill={SHADOW} opacity="0.15" />
                            <path d={isFemale ? "M140,90 Q125,81 112,90 Q125,87 140,90Z" : "M140,90 Q125,84 112,90 Q125,87 140,90Z"} fill={SHADOW} opacity="0.15" />
                        </>
                    )}
                    {/* C. Base Iris (female larger) */}
                    <circle cx="74" cy={isPanic ? 90 : 89} r={isPanic ? 3.5 : (isFemale ? 4.8 : 4)} fill={hairColor} />
                    <circle cx="126" cy={isPanic ? 90 : 89} r={isPanic ? 3.5 : (isFemale ? 4.8 : 4)} fill={hairColor} />
                    {/* D. Jewel shading (depth shadow + crescent highlight) */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M69.2,89 A4.8,4.8 0 0 1 78.8,89Z" : "M70,89 A4,4 0 0 1 78,89Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M121.2,89 A4.8,4.8 0 0 1 130.8,89Z" : "M122,89 A4,4 0 0 1 130,89Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M69.7,90 A3.8,3.8 0 0 0 78.3,90" : "M70.5,90 A3,3 0 0 0 77.5,90"} fill="none" stroke={HIGHLIGHT} strokeWidth="1.2" opacity="0.35" />
                            <path d={isFemale ? "M121.7,90 A3.8,3.8 0 0 0 130.3,90" : "M122.5,90 A3,3 0 0 0 129.5,90"} fill="none" stroke={HIGHLIGHT} strokeWidth="1.2" opacity="0.35" />
                        </>
                    )}
                    {/* E. Pupil */}
                    <circle cx="74" cy={isPanic ? 90 : 89} r={isFemale ? 2.2 : 1.8} fill={SHADOW} opacity="0.9" />
                    <circle cx="126" cy={isPanic ? 90 : 89} r={isFemale ? 2.2 : 1.8} fill={SHADOW} opacity="0.9" />
                    {/* F. Dual catchlights */}
                    {!isPanic && (
                        <>
                            <circle cx="72" cy="86.5" r={isFemale ? 1.8 : 1.4} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="76.5" cy="91" r="0.8" fill={HIGHLIGHT} opacity="0.7" />
                            <circle cx="124" cy="86.5" r={isFemale ? 1.8 : 1.4} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="128.5" cy="91" r="0.8" fill={HIGHLIGHT} opacity="0.7" />
                        </>
                    )}
                    {/* G. Eyeliner + eyelashes */}
                    {isFemale ? (
                        <>
                            <path d={isPanic ? "M58,90 Q75,78 90,90" : "M58,90 Q75,80 88,90"} fill="none" stroke={SHADOW} strokeWidth="2.8" strokeLinecap="round" opacity="0.95" />
                            <path d={isPanic ? "M142,90 Q125,78 110,90" : "M142,90 Q125,80 112,90"} fill="none" stroke={SHADOW} strokeWidth="2.8" strokeLinecap="round" opacity="0.95" />
                            {!isPanic && (
                                <g fill={SHADOW} opacity="0.95">
                                    <path d="M58,90 Q54,85 51,82 Q55,86 61,87Z" />
                                    <path d="M142,90 Q146,85 149,82 Q145,86 139,87Z" />
                                </g>
                            )}
                        </>
                    ) : (
                        <>
                            <path d={isPanic ? "M60,90 Q75,78 90,90" : "M58,90 Q75,82 88,90 L88,88 Q75,80 58,88Z"} fill={SHADOW} opacity="0.9" />
                            <path d={isPanic ? "M140,90 Q125,78 110,90" : "M142,90 Q125,82 112,90 L112,88 Q125,80 142,88Z"} fill={SHADOW} opacity="0.9" />
                        </>
                    )}
                </g>
            )}

            {/* Fatigue lines (male only — female covered by makeup) */}
            {!isPanic && !isRelieved && !isFemale && (
                <>
                    <path d="M64,96 Q75,100 84,96" fill="none" stroke={SHADOW} strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
                    <path d="M136,96 Q125,100 116,96" fill="none" stroke={SHADOW} strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
                </>
            )}

            {/* Subtle blush (female only) */}
            {isFemale && !isPanic && (
                <g opacity="0.12" fill="#e11d48">
                    <ellipse cx="66" cy="102" rx="9" ry="5" transform="rotate(-12 66 102)" />
                    <ellipse cx="134" cy="102" rx="9" ry="5" transform="rotate(12 134 102)" />
                </g>
            )}

            {/* 3. LIPS */}
            {isPanic ? (
                <rect x="94" y="124" width="12" height="8" rx="4" fill={SHADOW} opacity="0.85" />
            ) : isRelieved ? (
                <path d="M92,122 Q100,130 108,122" fill="none" stroke={SHADOW} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            ) : (
                <g>
                    {isFemale ? (
                        <>
                            <path d="M94,124 Q100,126 106,124" fill="none" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                            <path d="M95,125 Q100,129 105,125 Q100,126 95,125Z" fill="#e11d48" opacity="0.35" />
                        </>
                    ) : (
                        <>
                            <line x1="93" y1="125" x2="107" y2="125" stroke={SHADOW} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                            <path d="M96,131 Q100,133 104,131" fill="none" stroke={SHADOW} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
                        </>
                    )}
                </g>
            )}

            {/* Panic sweat */}
            {isPanic && <path d="M132,58 C136,68 136,72 132,76 C128,72 128,68 132,58Z" fill="#38bdf8" opacity="0.9" />}
        </g>
    );
}

function VanguardHair({ style, color, isBackLayer }) {
    const SH_HAIR = "rgba(2,6,23,0.2)";
    const baseCap = <path d="M55,85 C55,30 145,30 145,85 C145,40 55,40 55,85Z" fill={color} />;

    // BACK LAYER (behind neck/body)
    if (isBackLayer) {
        if (style === 'ponytail') return (
            <g id="hair-back">
                <circle cx="145" cy="55" r="18" fill={color} />
                <path d="M145,55 C165,75 160,120 140,135 C150,100 135,70 145,55Z" fill={color} />
            </g>
        );
        if (style === 'long') return (
            <g id="hair-back">
                <path d="M45,80 C45,150 55,190 65,200 L45,200Z" fill={color} />
                <path d="M155,80 C155,150 145,190 135,200 L155,200Z" fill={color} />
            </g>
        );
        return null;
    }

    // FRONT LAYER
    switch (style) {
        case 'buzz': return <path d="M57,85 C57,32 143,32 143,85 C143,45 57,45 57,85Z" fill={color} opacity="0.7" />;
        case 'short': return (
            <g id="hair-front">
                <path d="M52,85 C52,20 148,20 148,85 C148,45 120,25 100,25 C80,25 52,45 52,85Z" fill={color} />
                <path d="M55,50 Q70,25 100,35 L85,20 Q60,25 55,50Z" fill="rgba(255,255,255,0.12)" />
            </g>
        );
        case 'neat': return (
            <g id="hair-front">
                <path d="M50,85 C50,15 150,15 150,85 C150,45 130,25 100,25 C70,25 50,45 50,85Z" fill={color} />
                <path d="M50,75 Q70,45 110,30 Q80,50 65,85" fill={SH_HAIR} />
                <path d="M68,38 Q85,28 100,32" fill="none" stroke={HIGHLIGHT} strokeWidth="4" strokeLinecap="round" opacity="0.1" />
            </g>
        );
        case 'parted': return (
            <g id="hair-front">
                <path d="M52,85 C52,18 148,18 148,85 C148,45 125,25 100,25 C75,25 52,45 52,85Z" fill={color} />
                <path d="M115,22 Q110,40 120,75" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.3" />
                <path d="M65,35 Q85,25 100,28" fill="none" stroke={HIGHLIGHT} strokeWidth="3" opacity="0.1" strokeLinecap="round" />
            </g>
        );
        case 'long':
        case 'ponytail':
            return <g id="hair-front">{baseCap}</g>;
        case 'bun': return (
            <g id="hair-front">
                <circle cx="100" cy="18" r="22" fill={color} />
                <circle cx="100" cy="18" r="14" fill={SHADOW} opacity="0.15" />
                {baseCap}
            </g>
        );
        case 'hijab': return (
            <g id="hijab">
                <path d="M52,65 C52,32 148,32 148,65Z" fill="#0f172a" />
                <path d="M42,90 C42,20 158,20 158,90 C158,145 135,165 100,165 C65,165 42,145 42,90Z" fill={color} />
                <path d="M42,90 C60,130 75,155 100,165 C125,155 140,130 158,90 C140,115 125,125 100,130 C75,125 60,115 42,90Z" fill={SHADOW} opacity="0.18" />
                <path d="M44,90 C44,30 100,25 100,25" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
            </g>
        );
        default: return null;
    }
}

function VanguardOutfit({ style }) {
    const baseBody = "M25,200 C25,140 50,128 80,128 L120,128 C150,128 175,140 175,200Z";

    if (style === 'labCoat') {
        return (
            <g id="outfit-labcoat">
                <path d={baseBody} fill="#f8fafc" />
                {/* Inner scrubs V-neck */}
                <path d="M78,128 L100,168 L122,128Z" fill="#0f766e" />
                <path d="M78,128 L100,168 L122,128Z" fill={SHADOW} opacity="0.3" />
                {/* Lapels */}
                <path d="M75,128 L62,185 L95,200 L100,200 L100,168Z" fill="#e2e8f0" />
                <path d="M125,128 L138,185 L105,200 L100,200 L100,168Z" fill="#e2e8f0" />
                <path d="M75,128 L62,185 L95,200" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M125,128 L138,185 L105,200" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="100" y1="168" x2="100" y2="200" stroke="#94a3b8" strokeWidth="2" />
                {/* Breast pocket + pens */}
                <rect x="52" y="160" width="18" height="22" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="56" y1="155" x2="56" y2="168" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="62" y1="158" x2="62" y2="168" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }

    if (style === 'scrubs') {
        return (
            <g id="outfit-scrubs">
                <path d={baseBody} fill="#059669" />
                <path d="M85,128 L100,155 L115,128Z" fill={SHADOW} opacity="0.25" />
                <path d="M85,128 L100,155 L115,128" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
        );
    }

    return (
        <g id="outfit-casual">
            <path d={baseBody} fill="#1e293b" />
            <path d="M85,128 L100,150 L115,128Z" fill={SHADOW} opacity="0.4" />
        </g>
    );
}

function VanguardAccessories({ accessories, outfit }) {
    const hasGlasses = accessories?.includes('glasses');
    const hasStethoscope = accessories?.includes('stethoscope');

    return (
        <g id="accessories">
            {hasGlasses && (
                <g id="glasses">
                    <rect x="54" y="80" width="36" height="24" rx="5" fill="none" stroke="#0f172a" strokeWidth="4" />
                    <rect x="110" y="80" width="36" height="24" rx="5" fill="none" stroke="#0f172a" strokeWidth="4" />
                    <line x1="90" y1="88" x2="110" y2="88" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                    <line x1="54" y1="88" x2="48" y2="85" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                    <line x1="146" y1="88" x2="152" y2="85" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                    {/* Lens glare */}
                    <rect x="56" y="82" width="32" height="20" rx="3" fill="#38bdf8" opacity="0.1" />
                    <rect x="112" y="82" width="32" height="20" rx="3" fill="#38bdf8" opacity="0.1" />
                    <path d="M60,84 L80,84 L65,100 L60,100Z" fill={HIGHLIGHT} opacity="0.15" />
                    <path d="M116,84 L136,84 L121,100 L116,100Z" fill={HIGHLIGHT} opacity="0.15" />
                </g>
            )}

            {hasStethoscope && outfit !== 'casual' && (
                <g id="stethoscope">
                    <path d="M48,140 C38,215 162,215 152,140" fill="none" stroke="#020617" strokeWidth="9" strokeLinecap="round" />
                    <path d="M50,140 C41,211 159,211 150,140" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M100,188 L100,205" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                    <path d="M102,188 L102,205" fill="none" stroke={HIGHLIGHT} strokeWidth="1.5" opacity="0.5" />
                    <circle cx="100" cy="205" r="8" fill="#cbd5e1" stroke="#020617" strokeWidth="2.5" />
                    <circle cx="100" cy="205" r="3.5" fill="#334155" />
                </g>
            )}
        </g>
    );
}

// ============================================================================
// MAIN RENDERER
// ============================================================================

function normalizeAvatar(avatar) {
    if (!avatar) return null;
    if (typeof avatar === 'string') {
        return { skinTone: 'fair', hairStyle: 'neat', hairColor: 'black', accessories: ['stethoscope'], outfit: 'labCoat', gender: 'L' };
    }
    return { ...avatar, outfit: avatar.outfit || 'labCoat' };
}

export default function AvatarRenderer({ avatar, size = 80, className = '', mood = 'neutral' }) {
    const norm = useMemo(() => normalizeAvatar(avatar), [avatar]);

    if (!norm) {
        return <span className={className} style={{ width: size, height: size, fontSize: size * 0.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{'👨‍⚕️'}</span>;
    }

    const skin = SKIN_TONES[norm.skinTone]?.hex || SKIN_TONES.fair.hex;
    const hairHex = HAIR_COLORS[norm.hairColor]?.hex || HAIR_COLORS.black.hex;
    const isHijab = norm.hairStyle === 'hijab';
    const effectiveHairColor = isHijab ? '#334155' : hairHex;

    return (
        <div className={`relative flex-shrink-0 drop-shadow-xl ${className}`} style={{ width: size, height: size }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                <defs>
                    <clipPath id="avatar-frame">
                        <rect x="0" y="0" width="200" height="200" rx="16" />
                    </clipPath>
                </defs>

                {/* Rim light — teal glow for dark HUD pop */}
                <path d="M38,65 C38,120 18,170 30,200" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                <g clipPath="url(#avatar-frame)">
                    {/* Z-INDEX PIPELINE */}
                    {/* 1. Back hair (ponytail tail, long drape) */}
                    {!isHijab && <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={true} />}
                    {/* 2. Head + face */}
                    <VanguardHead skin={skin} gender={norm.gender || 'L'} />
                    <VanguardFace mood={mood} hairColor={effectiveHairColor} gender={norm.gender || 'L'} />
                    {/* 3. Front hair / hijab */}
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={false} />
                    {/* 4. Outfit (covers neck, hijab bottom tucks under) */}
                    <VanguardOutfit style={norm.outfit} />
                    {/* 5. Accessories (topmost) */}
                    <VanguardAccessories accessories={norm.accessories} outfit={norm.outfit} />
                </g>
            </svg>
        </div>
    );
}
