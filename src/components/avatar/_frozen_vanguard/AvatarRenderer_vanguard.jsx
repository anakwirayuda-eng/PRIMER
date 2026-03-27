import React, { useMemo } from 'react';
import { SKIN_TONES, HAIR_COLORS, HAIR_STYLES_MALE, HAIR_STYLES_FEMALE } from './avatar/constants.js';

// ============================================================================
// 1. CONSTANTS & EXPORTS
// ============================================================================

export { SKIN_TONES, HAIR_COLORS };
export { HAIR_STYLES_MALE as HAIR_STYLE_OPTIONS_MALE, HAIR_STYLES_FEMALE as HAIR_STYLE_OPTIONS_FEMALE };

export const HAIR_STYLES = {
    buzz: 'buzz', short: 'short', neat: 'neat', parted: 'parted',
    long: 'long', ponytail: 'ponytail', bun: 'bun', hijab: 'hijab',
};

export const AVATARS = [
    { id: 'doc_male_1', name: 'dr. Pria', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'dr. Wanita', icon: '👩‍⚕️', color: 'bg-pink-500' },
];

const SHADOW = '#020617';
const HIGHLIGHT = '#ffffff';
const SH_HAIR = 'rgba(2,6,23,0.2)';

export const SHADOW_PARAMS = {
    light:  { mul: 1.0, color: SHADOW },
    fair:   { mul: 1.0, color: SHADOW },
    medium: { mul: 1.2, color: '#1a0f0a' },
    tan:    { mul: 1.5, color: '#1a0f0a' },
    brown:  { mul: 1.9, color: '#1a0f0a' },
    dark:   { mul: 2.4, color: '#140a05' },
};

// ============================================================================
// PHASE 1: VanguardHead
// ============================================================================
export function VanguardHead({ skin, skinTone, gender }) {
    const isFemale = gender === 'P';
    const shadowCfg = SHADOW_PARAMS[skinTone] || SHADOW_PARAMS.fair;
    const sColor = shadowCfg.color;
    const sMul = shadowCfg.mul;

    return (
        <g id="head-base">
            <path d={isFemale ? "M 88.8,90 V 150 H 111.2 V 90 Z" : "M 84,90 V 150 H 116 V 90 Z"} fill={skin} />
            <path d={isFemale ? "M 88.8,90 V 122 Q 100,134 111.2,138 V 90 Z" : "M 84,90 V 126 Q 100,140 116,144 V 90 Z"} fill={sColor} opacity={0.18 * sMul} />
            <path d={isFemale ? "M 72,76 C 58,74 58,92 72,92 Z M 128,76 C 142,74 142,92 128,92 Z" : "M 70,75 C 54,72 54,96 70,95 Z M 130,75 C 146,72 146,96 130,95 Z"} fill={skin} />
            <path d={isFemale ? "M 128,78 C 139,76 139,88 128,88 Z" : "M 130,78 C 142,76 142,92 130,92 Z"} fill={sColor} opacity={0.10 * sMul} />
            <path d={isFemale ? "M 100,24 C 122,24 133,45 133,75 C 133,100 122,118 110,128 C 105,132 102,132.8 100,132.8 C 98,132.8 95,132 90,128 C 78,118 67,100 67,75 C 67,45 78,24 100,24 Z" : "M 100,24 C 125,24 135,45 135,75 C 135,100 130,115 120,126 L 108,136 L 100,137.6 L 92,136 L 80,126 C 70,115 65,100 65,75 C 65,45 75,24 100,24 Z"} fill={skin} />
            <path d={isFemale ? "M 100,24 C 122,24 133,45 133,75 C 133,100 122,118 110,128 C 105,132 102,132.8 100,132.8 C 105,131 112,118 115,100 C 118,80 115,50 100,24 Z" : "M 100,24 C 125,24 135,45 135,75 C 135,100 130,115 120,126 L 108,136 L 100,137.6 C 105,136 112,124 116,105 C 120,85 118,50 100,24 Z"} fill={sColor} opacity={0.08 * sMul} />
            <path d={isFemale ? "M 93,130.5 Q 100,134 107,130.5" : "M 91,136 L 100,138.5 L 109,136"} fill="none" stroke={sColor} strokeWidth={isFemale ? "1.5" : "2"} strokeLinecap="round" strokeLinejoin="round" opacity={0.15 * sMul} />
            <path d="M 100,76 L 100,97.6 L 96,100.8" fill="none" stroke={sColor} strokeWidth={isFemale ? 1.4 : 2.0} strokeLinecap="round" strokeLinejoin="round" opacity={0.12 * sMul} />
        </g>
    );
}

// ============================================================================
// PHASE 2: VanguardFace
// ============================================================================
export function VanguardFace({ mood, hairColor, gender }) {
    const isFemale = gender === 'P';
    const isPanic = mood === 'panic';
    const isRelieved = mood === 'relieved';
    const isHappy = mood === 'happy';
    const isStressed = mood === 'stressed';
    const isNeutral = !isPanic && !isRelieved && !isHappy && !isStressed;

    const browThick = isFemale ? "1.6" : "2.8";
    const browOffset = isStressed ? 1.5 : 0;
    const irisR = isPanic ? 4.2 : (isFemale ? 5.6 : 4.8);
    const pupilR = isPanic ? 1.8 : (isFemale ? 2.8 : 2.4);

    return (
        <g id="face-expressions">
            <g id="eyebrows" fill="none" stroke={SHADOW} strokeWidth={browThick} strokeLinecap="round" opacity="0.85">
                {isPanic ? (
                    <>
                        <path d="M 66,61 L 80,66 L 90.4,63" />
                        <path d="M 134,61 L 120,66 L 109.6,63" />
                    </>
                ) : isFemale ? (
                    <>
                        <path d={`M 66,${69 + browOffset} Q 80.4,${65 + browOffset} 91,${70.5 + browOffset}`} />
                        <path d={`M 134,${69 + browOffset} Q 119.6,${65 + browOffset} 109,${70.5 + browOffset}`} />
                    </>
                ) : (
                    <>
                        <path d={`M 64,${68 + browOffset} L 92,${71 + browOffset}`} />
                        <path d={`M 136,${68 + browOffset} L 108,${71 + browOffset}`} />
                    </>
                )}
            </g>

            {isRelieved ? (
                <g id="eyes-relieved" fill="none" stroke={SHADOW} strokeWidth="3.2" strokeLinecap="round" opacity="0.9">
                    <path d="M 66.4,80 Q 80.4,74 94.4,80" />
                    <path d="M 133.6,80 Q 119.6,74 105.6,80" />
                </g>
            ) : (
                <g id="eyes-open">
                    <path d={isPanic ? "M 66.4,80 C 66.4,65 94.4,65 94.4,80 C 94.4,94 66.4,94 66.4,80 Z" : (isFemale ? "M 66.4,79.2 Q 80.4,67 94.4,79.2 Q 80.4,91 66.4,79.2 Z" : "M 66.4,79.2 Q 80.4,69 94.4,79.2 Q 80.4,89 66.4,79.2 Z")} fill="#f8fafc" />
                    <path d={isPanic ? "M 105.6,80 C 105.6,65 133.6,65 133.6,80 C 133.6,94 105.6,94 105.6,80 Z" : (isFemale ? "M 105.6,79.2 Q 119.6,67 133.6,79.2 Q 119.6,91 105.6,79.2 Z" : "M 105.6,79.2 Q 119.6,69 133.6,79.2 Q 119.6,89 105.6,79.2 Z")} fill="#f8fafc" />

                    {!isPanic && (
                        <g fill={SHADOW} opacity="0.15">
                            <path d={isFemale ? "M 66.4,79.2 Q 80.4,67 94.4,79.2 Q 80.4,74 66.4,79.2 Z" : "M 66.4,79.2 Q 80.4,69 94.4,79.2 Q 80.4,75 66.4,79.2 Z"} />
                            <path d={isFemale ? "M 105.6,79.2 Q 119.6,67 133.6,79.2 Q 119.6,74 105.6,79.2 Z" : "M 105.6,79.2 Q 119.6,69 133.6,79.2 Q 119.6,75 105.6,79.2 Z"} />
                        </g>
                    )}

                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={irisR} fill={hairColor} />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={irisR} fill={hairColor} />

                    {!isPanic && (
                        <>
                            <g fill={SHADOW} opacity="0.40">
                                <path d={isFemale ? "M 74.8,79.2 A 5.6 5.6 0 0 1 86 79.2 Z" : "M 75.6,79.2 A 4.8 4.8 0 0 1 85.2 79.2 Z"} />
                                <path d={isFemale ? "M 114,79.2 A 5.6 5.6 0 0 1 125.2 79.2 Z" : "M 114.8,79.2 A 4.8 4.8 0 0 1 124.4 79.2 Z"} />
                            </g>
                            <g fill="none" stroke={HIGHLIGHT} strokeWidth="1.2" opacity="0.35" strokeLinecap="round">
                                <path d={isFemale ? "M 76,81 A 4.4 4.4 0 0 0 84.8 81" : "M 76.8,81 A 3.6 3.6 0 0 0 84 81"} />
                                <path d={isFemale ? "M 115.2,81 A 4.4 4.4 0 0 0 124 81" : "M 116,81 A 3.6 3.6 0 0 0 123.2 81"} />
                            </g>
                        </>
                    )}

                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={pupilR} fill={SHADOW} opacity="0.9" />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={pupilR} fill={SHADOW} opacity="0.9" />

                    {!isPanic && (
                        <g fill={HIGHLIGHT}>
                            <circle cx="78.4" cy="77" r={isFemale ? 2.2 : 1.8} opacity="0.95" />
                            <circle cx="117.6" cy="77" r={isFemale ? 2.2 : 1.8} opacity="0.95" />
                            <circle cx="82.4" cy="81.5" r="1.0" opacity="0.75" />
                            <circle cx="121.6" cy="81.5" r="1.0" opacity="0.75" />
                        </g>
                    )}

                    <g fill="none" stroke={SHADOW} strokeWidth={isPanic ? "2.4" : (isFemale ? "3.6" : "3.2")} strokeLinecap="round" opacity="0.95">
                        <path d={isPanic ? "M 64.4,80 C 64.4,65 96.4,65 96.4,80" : (isFemale ? "M 64.4,79.2 Q 80.4,65 96.4,79.2" : "M 64.4,79.2 Q 80.4,68 96.4,79.2")} />
                        <path d={isPanic ? "M 103.6,80 C 103.6,65 135.6,65 135.6,80" : (isFemale ? "M 103.6,79.2 Q 119.6,65 135.6,79.2" : "M 103.6,79.2 Q 119.6,68 135.6,79.2")} />
                    </g>
                </g>
            )}

            {isFemale && (isNeutral || isHappy || isRelieved) && (
                <g fill="#e11d48" opacity={isHappy ? "0.18" : "0.12"}>
                    <ellipse cx="72" cy="89" rx="7" ry="4" transform="rotate(-12 72 89)" />
                    <ellipse cx="128" cy="89" rx="7" ry="4" transform="rotate(12 128 89)" />
                </g>
            )}

            {!isFemale && !isPanic && !isRelieved && (
                <g fill="none" stroke={SHADOW} strokeWidth="1.0" strokeLinecap="round">
                    {isStressed ? (
                        <g opacity="0.15">
                            <path d="M 71.2,84.8 Q 80.4,87 87.2,84.8" />
                            <path d="M 128.8,84.8 Q 119.6,87 112.8,84.8" />
                        </g>
                    ) : (
                        <g opacity="0.08">
                            <path d="M 72,86 Q 80.4,88 88,86" />
                            <path d="M 128,86 Q 119.6,88 112,86" />
                        </g>
                    )}
                </g>
            )}

            <g id="mouth">
                {isPanic ? (
                    <rect x="95" y="106" width="10" height="6.4" rx="3" fill={SHADOW} opacity="0.85" />
                ) : isRelieved ? (
                    <path d="M 93.6,106 Q 100,112 106.4,106" fill="none" stroke={SHADOW} strokeWidth="2.0" strokeLinecap="round" opacity="0.8" />
                ) : isHappy ? (
                    <path d="M 94,106 Q 100,111.2 106,106" fill="none" stroke={SHADOW} strokeWidth={isFemale ? "1.6" : "2.0"} strokeLinecap="round" opacity="0.8" />
                ) : isStressed ? (
                    isFemale 
                        ? <path d="M 95.2,108.5 Q 100,107.5 104.8,108.5" fill="none" stroke={SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                        : <path d="M 93,109 Q 100,107 107,109" fill="none" stroke={SHADOW} strokeWidth="2.0" strokeLinecap="round" opacity="0.6" />
                ) : (
                    isFemale 
                        ? <path d="M 95.2,107.2 Q 100,108.8 104.8,107.2" fill="none" stroke={SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                        : <line x1="94.4" y1="108" x2="105.6" y2="108" stroke={SHADOW} strokeWidth="2.0" strokeLinecap="round" opacity="0.6" />
                )}
            </g>

            {isPanic && (
                <path d="M 125.6,54.4 C 128.8,62.4 128.8,65.6 125.6,68.8 C 122.4,65.6 122.4,62.4 125.6,54.4 Z" fill="#38bdf8" opacity="0.9" />
            )}
        </g>
    );
}

// ============================================================================
// PHASE 3: VanguardHair
// ============================================================================
export function VanguardHair({ style, color, isBackLayer }) {
    const isHijab = style === 'hijab';
    const effectiveColor = isHijab ? '#334155' : color;

    const femaleFrontHair = (
        <g id="female-front-hair">
            <path d="M 48,76 C 45,20 150,15 148,76 C 140,45 120,38 100,42 L 90,65 L 80,45 C 65,55 55,65 48,76 Z" fill={effectiveColor} />
            <path d="M 48,65 C 42,90 45,115 55,130 C 60,110 58,85 62,65 Z" fill={effectiveColor} />
            <path d="M 148,65 C 154,90 151,115 141,130 C 136,110 138,85 134,65 Z" fill={effectiveColor} />
            <path d="M 100,42 C 120,38 140,45 148,76 C 140,55 125,48 105,55 C 85,60 70,55 60,48 Z" fill={SH_HAIR} />
            <path d="M 65,35 Q 85,25 105,30" fill="none" stroke={HIGHLIGHT} strokeWidth="2.5" opacity="0.18" strokeLinecap="round" />
        </g>
    );

    if (isBackLayer) {
        switch (style) {
            case 'long':
                return (
                    <g id="hair-back-long">
                        <path d="M 45,70 C 25,100 20,180 40,200 L 75,200 C 85,150 75,100 65,80 Z" fill={effectiveColor} />
                        <path d="M 151,70 C 171,100 176,180 156,200 L 121,200 C 111,150 121,100 131,80 Z" fill={effectiveColor} />
                        <path d="M 40,120 Q 35,160 45,190 M 156,120 Q 161,160 151,190" fill="none" stroke={SH_HAIR} strokeWidth="3.5" strokeLinecap="round" />
                    </g>
                );
            case 'ponytail':
                return (
                    <g id="hair-back-ponytail">
                        <path d="M 135,55 C 170,50 180,120 150,150 C 125,125 130,85 135,55 Z" fill={effectiveColor} />
                        <rect x="130" y="50" width="8" height="12" rx="3" fill="#0f172a" transform="rotate(25 134 56)" />
                        <path d="M 142,65 Q 155,95 145,130" fill="none" stroke={SH_HAIR} strokeWidth="3" strokeLinecap="round" />
                    </g>
                );
            case 'bun':
                return (
                    <g id="hair-back-bun">
                        <circle cx="100" cy="18" r="22" fill={effectiveColor} />
                        <path d="M 82,24 A 18 18 0 0 0 118 24" fill="none" stroke={SH_HAIR} strokeWidth="4" strokeLinecap="round" />
                        <path d="M 85,10 A 18 18 0 0 1 115 10" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                    </g>
                );
            case 'hijab':
                return (
                    <g id="hijab-back">
                        <path d="M 25,120 C 25,44 175,44 175,120 C 175,185 140,200 100,200 C 60,200 25,185 25,120 Z" fill={effectiveColor} />
                        <path d="M 50,120 Q 60,160 75,190 M 150,120 Q 140,160 125,190" fill="none" stroke={SH_HAIR} strokeWidth="4" strokeLinecap="round" />
                    </g>
                );
            default:
                return null;
        }
    }

    switch (style) {
        case 'buzz':
            return (
                <g id="hair-front-buzz">
                    <path d="M 60,76 C 55,30 75,20 100,22 C 125,20 145,30 140,76 C 135,45 120,38 105,40 L 100,45 L 95,40 C 80,38 65,45 60,76 Z" fill={effectiveColor} opacity="0.85" />
                    <path d="M 60,76 C 65,55 80,45 95,40 L 100,45 L 105,40 C 120,45 135,55 140,76" fill="none" stroke={SH_HAIR} strokeWidth="2.5" strokeLinecap="round" />
                </g>
            );
        case 'short':
            return (
                <g id="hair-front-short">
                    <path d="M 52,76 C 45,30 70,10 90,15 L 100,5 L 110,12 L 125,8 C 145,20 148,80 148,80 C 140,50 125,35 105,35 L 95,45 L 85,35 C 65,38 58,50 52,76 Z" fill={effectiveColor} />
                    <path d="M 148,80 C 140,50 125,35 105,35 L 110,45 C 125,45 142,65 148,80 Z" fill={SH_HAIR} />
                    <path d="M 65,38 Q 80,25 90,28" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                </g>
            );
        case 'neat':
            return (
                <g id="hair-front-neat">
                    <path d="M 46,76 C 40,25 70,5 115,15 C 140,22 144,45 142,76 C 138,50 120,35 110,36 L 102,48 L 96,36 L 85,50 L 75,38 L 65,58 L 56,42 C 52,55 48,65 46,76 Z" fill={effectiveColor} />
                    <path d="M 110,36 L 102,48 L 96,36 L 85,50 L 75,38 L 65,58 L 56,42 C 65,60 85,55 110,45 Z" fill={SH_HAIR} />
                    <path d="M 115,15 Q 108,25 112,38" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
                    <path d="M 60,35 C 75,25 90,22 105,25" fill="none" stroke={HIGHLIGHT} strokeWidth="2.5" opacity="0.18" strokeLinecap="round" />
                </g>
            );
        case 'parted':
            return (
                <g id="hair-front-parted">
                    <path d="M 52,80 C 45,20 85,10 100,20 L 90,50 C 75,40 65,55 52,80 Z" fill={effectiveColor} />
                    <path d="M 148,80 C 155,20 115,10 100,20 L 110,50 C 125,40 135,55 148,80 Z" fill={effectiveColor} />
                    <path d="M 90,50 C 75,40 65,55 52,80 C 65,65 80,45 90,50 Z" fill={SH_HAIR} />
                    <path d="M 110,50 C 125,40 135,55 148,80 C 135,65 120,45 110,50 Z" fill={SH_HAIR} />
                    <path d="M 100,16 L 100,40" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.3" strokeLinecap="round" />
                    <path d="M 65,30 Q 80,20 90,25 M 135,30 Q 120,20 110,25" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                </g>
            );
        case 'long':
        case 'ponytail':
        case 'bun':
            return femaleFrontHair;
        case 'hijab':
            return (
                <g id="hijab-front">
                    <path d="M 62,60 C 62,25 138,25 138,60 Q 100,42 62,60 Z" fill="#0f172a" opacity="0.95" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M 15,120 C 15,10 185,10 185,120 C 185,190 140,200 100,200 C 60,200 15,190 15,120 Z M 66.4,74 C 66.4,108 82.4,132.8 100,132.8 C 117.6,132.8 133.6,108 133.6,74 C 133.6,50 117.6,36 100,36 C 82.4,36 66.4,50 66.4,74 Z" fill={effectiveColor} />
                    <path d="M 68,105 C 75,130 80,160 85,190 M 132,105 C 125,130 120,160 115,190" fill="none" stroke={SH_HAIR} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 66.4,74 C 66.4,108 82.4,132.8 100,132.8 C 117.6,132.8 133.6,108 133.6,74" fill="none" stroke={SHADOW} strokeWidth="3" opacity="0.15" />
                    <path d="M 45,70 C 45,25 90,20 100,20" fill="none" stroke={HIGHLIGHT} strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
                    <g id="hijab-pin" transform="translate(100, 112)">
                        <rect x="-10" y="-1.5" width="20" height="3" rx="1.5" fill="#0d9488" stroke="#fcd34d" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3.5" fill="#0d9488" stroke="#fcd34d" strokeWidth="1" />
                        <circle cx="-1" cy="-1" r="1.5" fill="#ccfbf1" opacity="0.8" />
                    </g>
                </g>
            );
        default:
            return null;
    }
}

// ============================================================================
// PHASE 4: VanguardOutfit
// ============================================================================
export function VanguardOutfit({ style }) {
    const renderIdBadge = (strokeColor) => (
        <g id="id-badge">
            <rect x="146" y="146" width="6" height="4" rx="1" fill="#94a3b8" />
            <rect x="140" y="150" width="18" height="24" rx="2" fill="#f8fafc" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M 144,155 h 10 M 144,161 h 10 M 144,167 h 6" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        </g>
    );

    switch (style) {
        case 'labCoat':
            return (
                <g id="outfit-labcoat">
                    <path d="M 78,120 L 100,160 L 122,120 L 112,120 L 100,145 L 88,120 Z" fill="#0f766e" />
                    <path d="M 100,160 L 122,120 L 112,120 L 100,145 Z" fill={SHADOW} opacity="0.30" />
                    <path d="M 10,200 C 10,135 40,120 78,120 L 100,160 L 122,120 C 160,120 190,135 190,200 Z" fill="#f8fafc" />
                    <path d="M 78,120 L 60,185 L 95,200 L 100,200 L 100,160 Z" fill="#e2e8f0" />
                    <path d="M 122,120 L 140,185 L 105,200 L 100,200 L 100,160 Z" fill="#e2e8f0" />
                    <path d="M 100,160 L 100,200 L 190,200 C 190,135 160,120 122,120 Z" fill={SHADOW} opacity="0.30" />
                    <path d="M 78,120 L 60,185 L 95,200 M 122,120 L 140,185 L 105,200" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />
                    <line x1="100" y1="160" x2="100" y2="200" stroke="#cbd5e1" strokeWidth="2.5" />
                    <rect x="42" y="148" width="22" height="26" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="47" y1="143" x2="47" y2="158" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="54" y1="146" x2="54" y2="158" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    {renderIdBadge("#cbd5e1")}
                </g>
            );
        case 'scrubs':
            return (
                <g id="outfit-scrubs">
                    <path d="M 10,200 C 10,135 40,120 85,120 L 100,150 L 115,120 C 160,120 190,135 190,200 Z" fill="#059669" />
                    <path d="M 100,150 L 100,200 L 190,200 C 190,135 160,120 115,120 Z" fill={SHADOW} opacity="0.25" />
                    <path d="M 85,120 L 100,150 L 115,120" fill="none" stroke="#047857" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M 65,120 Q 45,150 20,185 M 135,120 Q 155,150 180,185" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="42" y="148" width="22" height="26" rx="2" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                    <line x1="44" y1="153" x2="62" y2="153" stroke="#047857" strokeWidth="1.5" strokeDasharray="2,2" />
                    <line x1="48" y1="142" x2="48" y2="154" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                    {renderIdBadge("#047857")}
                </g>
            );
        case 'casual':
        default:
            return (
                <g id="outfit-casual">
                    <path d="M 10,200 C 10,135 40,120 85,120 L 100,135 L 115,120 C 160,120 190,135 190,200 Z" fill="#1e293b" />
                    <path d="M 100,135 L 100,200 L 190,200 C 190,135 160,120 115,120 Z" fill={SHADOW} opacity="0.40" />
                    <path d="M 85,120 L 100,135 L 115,120" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M 85,120 L 100,150 L 115,120 L 100,135 Z" fill={SHADOW} opacity="0.40" />
                </g>
            );
    }
}

// ============================================================================
// PHASE 5: VanguardAccessories
// ============================================================================
export function VanguardAccessories({ accessories, outfit }) {
    const hasGlasses = accessories?.includes('glasses');
    const hasStethoscope = accessories?.includes('stethoscope');

    return (
        <g id="accessories">
            {hasGlasses && (
                <g id="glasses">
                    <rect x="62.4" y="66.2" width="36" height="26" rx="8" fill="none" stroke="#0f172a" strokeWidth="2.4" />
                    <rect x="101.6" y="66.2" width="36" height="26" rx="8" fill="none" stroke="#0f172a" strokeWidth="2.4" />
                    <path d="M 62.4,74 C 62.4,66.2 70.4,66.2 80.4,66.2 C 90.4,66.2 98.4,66.2 98.4,74" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M 101.6,74 C 101.6,66.2 109.6,66.2 119.6,66.2 C 129.6,66.2 137.6,66.2 137.6,74" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M 98.4,75 Q 100,73 101.6,75" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M 62.4,74 Q 56,72 52,69" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M 137.6,74 Q 144,72 148,69" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    <rect x="63.6" y="67.4" width="33.6" height="23.6" rx="6.8" fill="#38bdf8" opacity="0.08" />
                    <rect x="102.8" y="67.4" width="33.6" height="23.6" rx="6.8" fill="#38bdf8" opacity="0.08" />
                    <path d="M 66,69 L 76,69 L 68,88 L 64,88 Z" fill={HIGHLIGHT} opacity="0.12" />
                </g>
            )}

            {hasStethoscope && outfit !== 'casual' && (
                <g id="stethoscope">
                    <path d="M 35,135 C 20,195 180,195 165,135" fill="none" stroke={SHADOW} strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M 35,135 C 20,195 180,195 165,135" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 100,178 L 100,192" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 100.5,178 L 100.5,192" fill="none" stroke={HIGHLIGHT} strokeWidth="1" opacity="0.5" />
                    <circle cx="100" cy="192" r="6" fill="#cbd5e1" stroke={SHADOW} strokeWidth="2" />
                    <circle cx="100" cy="192" r="2.5" fill="#334155" />
                </g>
            )}
        </g>
    );
}

// ============================================================================
// PHASE 6: MAIN RENDERER COMPONENT
// ============================================================================
function normalizeAvatar(avatar) {
    if (!avatar) return null;
    
    if (typeof avatar === 'string') {
        return { 
            skinTone: 'fair', 
            hairStyle: 'neat', 
            hairColor: 'black', 
            accessories: ['stethoscope'], 
            outfit: 'labCoat', 
            gender: 'L' 
        };
    }
    
    return { ...avatar, outfit: avatar.outfit || 'labCoat' };
}

export default function AvatarRenderer({ avatar, size = 80, className = '', mood = 'neutral' }) {
    const norm = useMemo(() => normalizeAvatar(avatar), [avatar]);

    if (!norm) {
        return (
            <span 
                className={className} 
                style={{ width: size, height: size, fontSize: size * 0.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {'👨‍⚕️'}
            </span>
        );
    }

    const skin = SKIN_TONES[norm.skinTone]?.hex || SKIN_TONES.fair.hex;
    const hairHex = HAIR_COLORS[norm.hairColor]?.hex || HAIR_COLORS.black.hex;
    
    const isHijab = norm.hairStyle === 'hijab';
    const effectiveHairColor = isHijab ? '#334155' : hairHex;
    const effectiveGender = norm.gender || 'L';

    return (
        <div className={`relative flex-shrink-0 drop-shadow-xl ${className}`} style={{ width: size, height: size }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
                <defs>
                    <clipPath id="avatar-frame">
                        <rect x="0" y="0" width="200" height="200" rx="16" />
                    </clipPath>
                </defs>

                {/* LAYER 0: RIM LIGHT */}
                <path d="M 38,65 C 38,120 18,170 30,200" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                {/* PAINTER'S ALGORITHM (BIBLE §9) */}
                <g clipPath="url(#avatar-frame)">
                    {/* Layer 2: BACK HAIR */}
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={true} />
                    
                    {/* Layer 3: HEAD BASE */}
                    <VanguardHead skin={skin} skinTone={norm.skinTone || 'fair'} gender={effectiveGender} />
                    
                    {/* Layer 4: FACE EXPRESSIONS */}
                    <VanguardFace mood={mood} hairColor={effectiveHairColor} gender={effectiveGender} />
                    
                    {/* Layer 5: FRONT HAIR */}
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={false} />
                    
                    {/* Layer 6: OUTFIT */}
                    <VanguardOutfit style={norm.outfit} />
                    
                    {/* Layer 7: ACCESSORIES */}
                    <VanguardAccessories accessories={norm.accessories} outfit={norm.outfit} />
                </g>
            </svg>
        </div>
    );
}
