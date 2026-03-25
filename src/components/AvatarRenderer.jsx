/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (Golden Ratio 50:50 Edition)
 * [PURPOSE]: Ultra-premium SVG avatar for PRIMER. Zero dependencies.
 *            - Head:Body = 50:50 (not bobblehead 68:32).
 *            - Eyes at y=80 (40% golden line).
 *            - Shoulders x=10→190 (wide dominant anchor).
 *            - Gender dimorphism, jewel iris, cel-shading.
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
// PREMIUM SVG COMPONENTS (GOLDEN RATIO 50:50 EDITION)
// ============================================================================

function VanguardHead({ skin, gender }) {
    const isFemale = gender === 'P';
    const jawPath = isFemale
        ? "M66.4,72 C66.4,108 82.4,132.8 100,132.8 C117.6,132.8 133.6,108 133.6,72 C133.6,40 116,28 100,28 C84,28 66.4,40 66.4,72Z"
        : "M64.8,72 C64.8,116 79.2,137.6 100,137.6 C120.8,137.6 135.2,116 135.2,72 C135.2,40 116,28 100,28 C84,28 64.8,40 64.8,72Z";
    const cheekShadow = isFemale
        ? "M100,28 C116,28 133.6,40 133.6,72 C133.6,108 117.6,132.8 100,132.8 C112,121.6 116,100 116,72 C116,48 109.6,36 100,28Z"
        : "M100,28 C116,28 135.2,40 135.2,72 C135.2,116 120.8,137.6 100,137.6 C112,124 117.6,100 117.6,72 C117.6,48 109.6,36 100,28Z";
    const neckPath = isFemale ? "M88.8,104 L111.2,104 L111.2,128 C100,132.8 88.8,128 88.8,128Z" : "M84,104 L116,104 L116,129.6 C100,137.6 84,129.6 84,129.6Z";
    const neckShadow = isFemale ? "M88.8,104 L111.2,104 L111.2,113.6 C103.2,118.4 96.8,118.4 88.8,113.6Z" : "M84,104 L116,104 L116,116 C104.8,121.6 95.2,121.6 84,116Z";

    return (
        <g id="head-base">
            <path d={neckPath} fill={skin} />
            <path d={neckShadow} fill={SHADOW} opacity="0.18" />
            <path d={isFemale ? "M63.2,76 L68,68.8 L68,89.6 L63.2,83.2Z" : "M60,76 L66.4,68 L66.4,92 L60,84Z"} fill={skin} />
            <path d={isFemale ? "M136.8,76 L132,68.8 L132,89.6 L136.8,83.2Z" : "M140,76 L133.6,68 L133.6,92 L140,84Z"} fill={skin} />
            <path d={isFemale ? "M64.8,78.4 L68,73.6 L68,86.4Z" : "M61.6,78.4 L64.8,73.6 L64.8,88Z"} fill={SHADOW} opacity="0.1" />
            <path d={jawPath} fill={skin} />
            <path d={cheekShadow} fill={SHADOW} opacity="0.08" />
            <path d="M100,76 L100,97.6 L96,100.8" fill="none" stroke={SHADOW} strokeWidth={isFemale ? "1.4" : "2"} strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
        </g>
    );
}

function VanguardFace({ mood, hairColor, gender }) {
    const isFemale = gender === 'P';
    const isPanic = mood === 'panic';
    const isRelieved = mood === 'relieved';
    const browY = isPanic ? 64 : (isFemale ? 67 : 70);
    const browThick = isFemale ? "1.6" : "2.8";

    return (
        <g id="face-expressions">
            {/* EYEBROWS */}
            {isFemale ? (
                <>
                    <path d={isPanic ? `M69.6,${browY-3.2} Q80,${browY+1.6} 90.4,${browY-1.6}` : `M68,${browY+1.6} Q80,${browY-3.2} 90.4,${browY+0.8}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.8" />
                    <path d={isPanic ? `M130.4,${browY-3.2} Q120,${browY+1.6} 109.6,${browY-1.6}` : `M132,${browY+1.6} Q120,${browY-3.2} 109.6,${browY+0.8}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.8" />
                </>
            ) : (
                <>
                    <path d={isPanic ? `M68,${browY-3.2} Q80,${browY+2.4} 90.4,${browY-1.6}` : `M66.4,${browY} Q80,${browY-1.6} 90.4,${browY}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.85" />
                    <path d={isPanic ? `M132,${browY-3.2} Q120,${browY+2.4} 109.6,${browY-1.6}` : `M133.6,${browY} Q120,${browY-1.6} 109.6,${browY}`} fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.85" />
                </>
            )}

            {/* JEWEL EYES */}
            {isRelieved ? (
                <>
                    <path d="M71.2,83.2 Q80,76.8 88.8,83.2" fill="none" stroke={SHADOW} strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
                    <path d="M128.8,83.2 Q120,76.8 111.2,83.2" fill="none" stroke={SHADOW} strokeWidth="2.8" strokeLinecap="round" opacity="0.9" />
                    {isFemale && (
                        <>
                            <path d="M69.6,81.6 L66.4,80" fill="none" stroke={SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                            <path d="M130.4,81.6 L133.6,80" fill="none" stroke={SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                        </>
                    )}
                </>
            ) : (
                <g id="eyes-open">
                    {/* Sclera */}
                    <path d={isPanic ? "M68,80 C68,70.4 90.4,70.4 90.4,80 C90.4,89.6 68,89.6 68,80Z" : (isFemale ? "M68,80 Q80,72.8 90.4,80 Q80,86.4 68,80Z" : "M68,80 Q80,75.2 90.4,80 Q80,84 68,80Z")} fill="#f8fafc" />
                    <path d={isPanic ? "M132,80 C132,70.4 109.6,70.4 109.6,80 C109.6,89.6 132,89.6 132,80Z" : (isFemale ? "M132,80 Q120,72.8 109.6,80 Q120,86.4 132,80Z" : "M132,80 Q120,75.2 109.6,80 Q120,84 132,80Z")} fill="#f8fafc" />
                    {/* Sclera drop shadow */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M68,80 Q80,72.8 90.4,80 Q80,77.6 68,80Z" : "M68,80 Q80,75.2 90.4,80 Q80,77.6 68,80Z"} fill={SHADOW} opacity="0.15" />
                            <path d={isFemale ? "M132,80 Q120,72.8 109.6,80 Q120,77.6 132,80Z" : "M132,80 Q120,75.2 109.6,80 Q120,77.6 132,80Z"} fill={SHADOW} opacity="0.15" />
                        </>
                    )}
                    {/* Iris */}
                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={isPanic ? 2.8 : (isFemale ? 3.8 : 3.2)} fill={hairColor} />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={isPanic ? 2.8 : (isFemale ? 3.8 : 3.2)} fill={hairColor} />
                    {/* Jewel shading */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M75.36,79.2 A3.84,3.84 0 0 1 83.04,79.2Z" : "M76,79.2 A3.2,3.2 0 0 1 82.4,79.2Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M116.96,79.2 A3.84,3.84 0 0 1 124.64,79.2Z" : "M117.6,79.2 A3.2,3.2 0 0 1 124,79.2Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M75.76,80 A3.04,3.04 0 0 0 82.64,80" : "M76.4,80 A2.4,2.4 0 0 0 82,80"} fill="none" stroke={HIGHLIGHT} strokeWidth="1" opacity="0.35" />
                            <path d={isFemale ? "M117.36,80 A3.04,3.04 0 0 0 124.24,80" : "M118,80 A2.4,2.4 0 0 0 123.6,80"} fill="none" stroke={HIGHLIGHT} strokeWidth="1" opacity="0.35" />
                        </>
                    )}
                    {/* Pupil */}
                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={isFemale ? 1.7 : 1.4} fill={SHADOW} opacity="0.9" />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={isFemale ? 1.7 : 1.4} fill={SHADOW} opacity="0.9" />
                    {/* Dual catchlights */}
                    {!isPanic && (
                        <>
                            <circle cx="78.8" cy="77.2" r={isFemale ? 1.4 : 1.1} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="81.6" cy="80.8" r="0.6" fill={HIGHLIGHT} opacity="0.7" />
                            <circle cx="118" cy="77.2" r={isFemale ? 1.4 : 1.1} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="121.2" cy="80.8" r="0.6" fill={HIGHLIGHT} opacity="0.7" />
                        </>
                    )}
                    {/* Eyeliner + eyelashes */}
                    {isFemale ? (
                        <>
                            <path d={isPanic ? "M66.4,80 Q80,70.4 92,80" : "M66.4,80 Q80,72 90.4,80"} fill="none" stroke={SHADOW} strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
                            <path d={isPanic ? "M133.6,80 Q120,70.4 108,80" : "M133.6,80 Q120,72 109.6,80"} fill="none" stroke={SHADOW} strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
                            {!isPanic && (
                                <g fill={SHADOW} opacity="0.95">
                                    <path d="M66.4,80 Q63.2,76 60.8,73.6 Q64,76.8 68.8,77.6Z" />
                                    <path d="M133.6,80 Q136.8,76 139.2,73.6 Q136,76.8 131.2,77.6Z" />
                                </g>
                            )}
                        </>
                    ) : (
                        <>
                            <path d={isPanic ? "M68,80 Q80,70.4 92,80" : "M66.4,80 Q80,73.6 90.4,80 L90.4,78.4 Q80,72 66.4,78.4Z"} fill={SHADOW} opacity="0.9" />
                            <path d={isPanic ? "M132,80 Q120,70.4 108,80" : "M133.6,80 Q120,73.6 109.6,80 L109.6,78.4 Q120,72 133.6,78.4Z"} fill={SHADOW} opacity="0.9" />
                        </>
                    )}
                </g>
            )}

            {/* Fatigue lines (male only) */}
            {!isPanic && !isRelieved && !isFemale && (
                <>
                    <path d="M71.2,84.8 Q80,88 87.2,84.8" fill="none" stroke={SHADOW} strokeWidth="1" strokeLinecap="round" opacity="0.15" />
                    <path d="M128.8,84.8 Q120,88 112.8,84.8" fill="none" stroke={SHADOW} strokeWidth="1" strokeLinecap="round" opacity="0.15" />
                </>
            )}

            {/* Blush (female only) */}
            {isFemale && !isPanic && (
                <g opacity="0.12" fill="#e11d48">
                    <ellipse cx="72" cy="89" rx="7" ry="4" transform="rotate(-12 72 89)" />
                    <ellipse cx="128" cy="89" rx="7" ry="4" transform="rotate(12 128 89)" />
                </g>
            )}

            {/* MOUTH */}
            {isPanic ? (
                <rect x="95" y="106" width="10" height="6.4" rx="3" fill={SHADOW} opacity="0.85" />
            ) : isRelieved ? (
                <path d="M93.6,105.6 Q100,112 106.4,105.6" fill="none" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            ) : (
                <g>
                    {isFemale ? (
                        <>
                            <path d="M95.2,107.2 Q100,108.8 104.8,107.2" fill="none" stroke={SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                            <path d="M96,108 Q100,111.2 104,108 Q100,108.8 96,108Z" fill="#e11d48" opacity="0.35" />
                        </>
                    ) : (
                        <>
                            <line x1="94.4" y1="108" x2="105.6" y2="108" stroke={SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                            <path d="M96.8,112.8 Q100,114.4 103.2,112.8" fill="none" stroke={SHADOW} strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
                        </>
                    )}
                </g>
            )}

            {/* Panic sweat */}
            {isPanic && <path d="M125.6,54.4 C128.8,62.4 128.8,65.6 125.6,68.8 C122.4,65.6 122.4,62.4 125.6,54.4Z" fill="#38bdf8" opacity="0.9" />}
        </g>
    );
}

function VanguardHair({ style, color, isBackLayer }) {
    const SH_HAIR = "rgba(2,6,23,0.2)";
    const baseCap = <path d="M64,76 C64,32 136,32 136,76 C136,40 64,40 64,76Z" fill={color} />;

    if (isBackLayer) {
        if (style === 'ponytail') return (
            <g id="hair-back">
                <circle cx="136" cy="52" r="14.4" fill={color} />
                <path d="M136,52 C152,68 148,104 132,116 C140,88 128,64 136,52Z" fill={color} />
            </g>
        );
        if (style === 'long') return (
            <g id="hair-back">
                <path d="M56,72 C56,128 64,160 72,168 L56,168Z" fill={color} />
                <path d="M144,72 C144,128 136,160 128,168 L144,168Z" fill={color} />
            </g>
        );
        return null;
    }

    switch (style) {
        case 'buzz': return <path d="M65.6,76 C65.6,33.6 134.4,33.6 134.4,76 C134.4,44 65.6,44 65.6,76Z" fill={color} opacity="0.7" />;
        case 'short': return (
            <g id="hair-front">
                <path d="M61.6,76 C61.6,24 138.4,24 138.4,76 C138.4,44 116,28 100,28 C84,28 61.6,44 61.6,76Z" fill={color} />
                <path d="M64,48 Q76,28 100,36 L88,24 Q68,28 64,48Z" fill="rgba(255,255,255,0.12)" />
            </g>
        );
        case 'neat': return (
            <g id="hair-front">
                <path d="M60,76 C60,20 140,20 140,76 C140,44 124,28 100,28 C76,28 60,44 60,76Z" fill={color} />
                <path d="M60,68 Q76,44 108,32 Q84,48 72,76" fill={SH_HAIR} />
                <path d="M74.4,38.4 Q88,30.4 100,33.6" fill="none" stroke={HIGHLIGHT} strokeWidth="3.2" strokeLinecap="round" opacity="0.1" />
            </g>
        );
        case 'parted': return (
            <g id="hair-front">
                <path d="M61.6,76 C61.6,21 138.4,21 138.4,76 C138.4,44 118.8,26.2 100,26.2 C81.2,26.2 61.6,44 61.6,76Z" fill={color} />
                <path d="M112,25.6 Q108,40 116,68" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.3" />
                <path d="M72,36 Q88,28 100,30.4" fill="none" stroke={HIGHLIGHT} strokeWidth="2.4" opacity="0.1" strokeLinecap="round" />
            </g>
        );
        case 'long': case 'ponytail': return <g id="hair-front">{baseCap}</g>;
        case 'bun': return (
            <g id="hair-front">
                <circle cx="100" cy="22.4" r="17.6" fill={color} />
                <circle cx="100" cy="22.4" r="11.2" fill={SHADOW} opacity="0.15" />
                {baseCap}
            </g>
        );
        case 'hijab': return (
            <g id="hijab">
                <path d="M61.6,60 C61.6,33.6 138.4,33.6 138.4,60Z" fill="#0f172a" />
                <path d="M53.6,80 C53.6,24 146.4,24 146.4,80 C146.4,124 128,140 100,140 C72,140 53.6,124 53.6,80Z" fill={color} />
                <path d="M53.6,80 C68,112 80,132 100,140 C120,132 132,112 146.4,80 C132,100 120,108 100,112 C80,108 68,100 53.6,80Z" fill={SHADOW} opacity="0.18" />
                <path d="M55.2,80 C55.2,32 100,28 100,28" fill="none" stroke={HIGHLIGHT} strokeWidth="1.6" opacity="0.15" strokeLinecap="round" />
            </g>
        );
        default: return null;
    }
}

function VanguardOutfit({ style }) {
    const baseBody = "M10,200 C10,135 40,120 80,120 L120,120 C160,120 190,135 190,200Z";

    if (style === 'labCoat') {
        return (
            <g id="outfit-labcoat">
                <path d={baseBody} fill="#f8fafc" />
                <path d="M78,120 L100,160 L122,120Z" fill="#0f766e" />
                <path d="M78,120 L100,160 L122,120Z" fill={SHADOW} opacity="0.3" />
                <path d="M75,120 L60,185 L95,200 L100,200 L100,160Z" fill="#e2e8f0" />
                <path d="M125,120 L140,185 L105,200 L100,200 L100,160Z" fill="#e2e8f0" />
                <path d="M75,120 L60,185 L95,200" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M125,120 L140,185 L105,200" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="100" y1="160" x2="100" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <rect x="46" y="155" width="22" height="26" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="51" y1="150" x2="51" y2="165" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="153" x2="58" y2="165" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }

    if (style === 'scrubs') {
        return (
            <g id="outfit-scrubs">
                <path d={baseBody} fill="#059669" />
                <path d="M85,120 L100,150 L115,120Z" fill={SHADOW} opacity="0.25" />
                <path d="M85,120 L100,150 L115,120" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
        );
    }

    return (
        <g id="outfit-casual">
            <path d={baseBody} fill="#1e293b" />
            <path d="M85,120 L100,150 L115,120Z" fill={SHADOW} opacity="0.4" />
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
                    <rect x="61" y="68" width="30" height="18" rx="4" fill="none" stroke="#0f172a" strokeWidth="3.2" />
                    <rect x="109" y="68" width="30" height="18" rx="4" fill="none" stroke="#0f172a" strokeWidth="3.2" />
                    <line x1="91" y1="74" x2="109" y2="74" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                    <line x1="61" y1="74" x2="55" y2="71.6" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    <line x1="139" y1="74" x2="145" y2="71.6" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    <rect x="62.6" y="69.6" width="26.8" height="14.8" rx="2.4" fill="#38bdf8" opacity="0.1" />
                    <rect x="110.6" y="69.6" width="26.8" height="14.8" rx="2.4" fill="#38bdf8" opacity="0.1" />
                    <path d="M65,71 L78,71 L68,82 L65,82Z" fill={HIGHLIGHT} opacity="0.15" />
                    <path d="M113,71 L126,71 L116,82 L113,82Z" fill={HIGHLIGHT} opacity="0.15" />
                </g>
            )}

            {hasStethoscope && outfit !== 'casual' && (
                <g id="stethoscope">
                    <path d="M35,135 C20,225 180,225 165,135" fill="none" stroke="#020617" strokeWidth="9" strokeLinecap="round" />
                    <path d="M37,135 C23,218 177,218 163,135" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M100,185 L100,202" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                    <path d="M102,185 L102,202" fill="none" stroke={HIGHLIGHT} strokeWidth="1.5" opacity="0.5" />
                    <circle cx="100" cy="202" r="8" fill="#cbd5e1" stroke="#020617" strokeWidth="2.5" />
                    <circle cx="100" cy="202" r="3.5" fill="#334155" />
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

                {/* Rim light */}
                <path d="M38,65 C38,120 18,170 30,200" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                <g clipPath="url(#avatar-frame)">
                    {!isHijab && <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={true} />}
                    <VanguardHead skin={skin} gender={norm.gender || 'L'} />
                    <VanguardFace mood={mood} hairColor={effectiveHairColor} gender={norm.gender || 'L'} />
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={false} />
                    <VanguardOutfit style={norm.outfit} />
                    <VanguardAccessories accessories={norm.accessories} outfit={norm.outfit} />
                </g>
            </svg>
        </div>
    );
}
