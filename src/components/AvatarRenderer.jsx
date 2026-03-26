/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (PRIMER Trademark Edition)
 * [PURPOSE]: Proprietary SVG avatar engine for PRIMER medical simulator.
 *            - Golden Ratio 50:50 head:body proportions.
 *            - Trademark eyes: overscaled iris, thick upper eyelid.
 *            - Readable at 36px (HUD sidebar) and 120px (Status Junction).
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

// ─── Adaptive Shadow Engine ───
// Warm shift + opacity multiplier prevents ashy shadows on dark skin
const SHADOW_PARAMS = {
    light:  { mul: 1.0, color: SHADOW },
    fair:   { mul: 1.0, color: SHADOW },
    medium: { mul: 1.2, color: '#1a0f0a' },
    tan:    { mul: 1.5, color: '#1a0f0a' },
    brown:  { mul: 1.9, color: '#1a0f0a' },
    dark:   { mul: 2.4, color: '#140a05' },
};

// ============================================================================
// PREMIUM SVG COMPONENTS (PRIMER TRADEMARK EDITION)
// ============================================================================

function VanguardHead({ skin, skinTone, gender }) {
    const isFemale = gender === 'P';
    const shadowCfg = SHADOW_PARAMS[skinTone] || SHADOW_PARAMS.fair;
    const sMul = shadowCfg.mul;
    const sColor = shadowCfg.color;

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
            <path d={neckShadow} fill={sColor} opacity={0.18 * sMul} />
            <path d={isFemale ? "M63.2,76 L68,68.8 L68,89.6 L63.2,83.2Z" : "M60,76 L66.4,68 L66.4,92 L60,84Z"} fill={skin} />
            <path d={isFemale ? "M136.8,76 L132,68.8 L132,89.6 L136.8,83.2Z" : "M140,76 L133.6,68 L133.6,92 L140,84Z"} fill={skin} />
            <path d={isFemale ? "M64.8,78.4 L68,73.6 L68,86.4Z" : "M61.6,78.4 L64.8,73.6 L64.8,88Z"} fill={sColor} opacity={0.1 * sMul} />
            <path d={jawPath} fill={skin} />
            <path d={cheekShadow} fill={sColor} opacity={0.08 * sMul} />
            <path d="M100,76 L100,97.6 L96,100.8" fill="none" stroke={sColor} strokeWidth={isFemale ? "1.4" : "2"} strokeLinecap="round" strokeLinejoin="round" opacity={0.12 * sMul} />
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

            {/* JEWEL EYES — PRIMER Trademark */}
            {isRelieved ? (
                <>
                    <path d="M66,82 Q79,74 92,82" fill="none" stroke={SHADOW} strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
                    <path d="M134,82 Q121,74 108,82" fill="none" stroke={SHADOW} strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
                    {isFemale && (
                        <>
                            <path d="M66,82 Q62,79 59,77" fill="none" stroke={SHADOW} strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
                            <path d="M134,82 Q138,79 141,77" fill="none" stroke={SHADOW} strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
                        </>
                    )}
                </>
            ) : (
                <g id="eyes-open">
                    {/* Sclera — 28px wide (anti-aliasing safe at 36px HUD) */}
                    <path d={isPanic ? "M65,80 C65,66 93,66 93,80 C93,94 65,94 65,80Z" : (isFemale ? "M65,80 Q79,67 93,80 Q79,91 65,80Z" : "M65,80 Q79,70 93,80 Q79,89 65,80Z")} fill="#f8fafc" />
                    <path d={isPanic ? "M135,80 C135,66 107,66 107,80 C107,94 135,94 135,80Z" : (isFemale ? "M135,80 Q121,67 107,80 Q121,91 135,80Z" : "M135,80 Q121,70 107,80 Q121,89 135,80Z")} fill="#f8fafc" />
                    {/* Sclera drop shadow */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M65,80 Q79,67 93,80 Q79,75 65,80Z" : "M65,80 Q79,70 93,80 Q79,76 65,80Z"} fill={SHADOW} opacity="0.15" />
                            <path d={isFemale ? "M135,80 Q121,67 107,80 Q121,75 135,80Z" : "M135,80 Q121,70 107,80 Q121,76 135,80Z"} fill={SHADOW} opacity="0.15" />
                        </>
                    )}
                    {/* Iris — overscaled for trademark semi-chibi professional style */}
                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={isPanic ? 4.2 : (isFemale ? 5.6 : 4.8)} fill={hairColor} />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={isPanic ? 4.2 : (isFemale ? 5.6 : 4.8)} fill={hairColor} />
                    {/* Jewel shading — A-path arc precision */}
                    {!isPanic && (
                        <>
                            <path d={isFemale ? "M74.8,79.2 A5.6,5.6 0 0 1 86,79.2Z" : "M75.6,79.2 A4.8,4.8 0 0 1 85.2,79.2Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M114,79.2 A5.6,5.6 0 0 1 125.2,79.2Z" : "M114.8,79.2 A4.8,4.8 0 0 1 124.4,79.2Z"} fill={SHADOW} opacity="0.4" />
                            <path d={isFemale ? "M76,81 A4.4,4.4 0 0 0 84.8,81" : "M76.8,81 A3.6,3.6 0 0 0 84,81"} fill="none" stroke={HIGHLIGHT} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
                            <path d={isFemale ? "M115.2,81 A4.4,4.4 0 0 0 124,81" : "M116,81 A3.6,3.6 0 0 0 123.2,81"} fill="none" stroke={HIGHLIGHT} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
                        </>
                    )}
                    {/* Pupil */}
                    <circle cx="80.4" cy={isPanic ? 80 : 79.2} r={isPanic ? 1.8 : (isFemale ? 2.6 : 2.2)} fill={SHADOW} opacity="0.9" />
                    <circle cx="119.6" cy={isPanic ? 80 : 79.2} r={isPanic ? 1.8 : (isFemale ? 2.6 : 2.2)} fill={SHADOW} opacity="0.9" />
                    {/* Dual catchlights — forced 1px at 36px HUD */}
                    {!isPanic && (
                        <>
                            <circle cx="78.4" cy="77" r={isFemale ? 2.2 : 1.8} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="82.4" cy="81.5" r={isFemale ? 1.0 : 0.8} fill={HIGHLIGHT} opacity="0.7" />
                            <circle cx="117.6" cy="77" r={isFemale ? 2.2 : 1.8} fill={HIGHLIGHT} opacity="0.95" />
                            <circle cx="121.6" cy="81.5" r={isFemale ? 1.0 : 0.8} fill={HIGHLIGHT} opacity="0.7" />
                        </>
                    )}
                    {/* Thick upper eyelid — trademark PRIMER style */}
                    {isFemale ? (
                        <>
                            <path d={isPanic ? "M64,80 C64,65 94,65 94,80" : "M64,80 Q79,66 94,80"} fill="none" stroke={SHADOW} strokeWidth={isPanic ? "2.4" : "3.6"} strokeLinecap="round" opacity="0.95" />
                            <path d={isPanic ? "M136,80 C136,65 106,65 106,80" : "M136,80 Q121,66 106,80"} fill="none" stroke={SHADOW} strokeWidth={isPanic ? "2.4" : "3.6"} strokeLinecap="round" opacity="0.95" />
                            {!isPanic && (
                                <g fill={SHADOW} opacity="0.95">
                                    <path d="M64,80 Q60,76 57,73 Q61,76.5 66,78Z" />
                                    <path d="M136,80 Q140,76 143,73 Q139,76.5 134,78Z" />
                                </g>
                            )}
                        </>
                    ) : (
                        <>
                            <path d={isPanic ? "M64,80 C64,65 94,65 94,80" : "M64,80 Q79,69 94,80"} fill="none" stroke={SHADOW} strokeWidth={isPanic ? "2.4" : "3.2"} strokeLinecap="round" opacity="0.9" />
                            <path d={isPanic ? "M136,80 C136,65 106,65 106,80" : "M136,80 Q121,69 106,80"} fill="none" stroke={SHADOW} strokeWidth={isPanic ? "2.4" : "3.2"} strokeLinecap="round" opacity="0.9" />
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

    // Shared "AAA Trademark" front style for female hair
    const femaleFrontHair = (
        <g id="female-front-hair">
            {/* Base Cap + Sweeping Bangs (asymmetric poni) */}
            <path d="M52,76 C52,25 148,25 148,76 C148,45 125,36 100,38 C75,40 52,50 52,76 Z" fill={color} />
            <path d="M105,28 C75,30 58,45 54,76 C65,55 85,42 110,44 C125,44 140,55 146,76 C138,45 125,28 105,28 Z" fill={SH_HAIR} />
            <path d="M108,30 C80,32 62,48 58,76 C68,58 85,46 112,48 C126,48 138,58 142,76 C135,48 122,30 108,30 Z" fill={color} />
            <path d="M72,40 Q90,36 108,38" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
            {/* Face-framing tendrils */}
            <path d="M56,70 C52,90 54,105 60,115 C64,100 62,85 64,70 Z" fill={color} />
            <path d="M144,70 C148,90 146,105 140,115 C136,100 138,85 136,70 Z" fill={color} />
        </g>
    );

    if (isBackLayer) {
        if (style === 'ponytail') return (
            <g id="hair-back-ponytail">
                <path d="M136,52 C165,45 170,100 145,130 C130,145 115,130 120,100 C125,75 125,60 136,52 Z" fill={color} />
                <path d="M138,65 Q150,85 140,115" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                <rect x="130" y="48" width="8" height="12" rx="2" fill="#0f172a" transform="rotate(25 134 54)" />
            </g>
        );
        if (style === 'long') return (
            <g id="hair-back-long">
                <path d="M56,72 C40,90 35,150 55,185 C70,195 80,150 72,120 Z" fill={color} />
                <path d="M144,72 C160,90 165,150 145,185 C130,195 120,150 128,120 Z" fill={color} />
                <path d="M50,120 Q55,150 45,170" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                <path d="M150,120 Q145,150 155,170" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
            </g>
        );
        if (style === 'hijab') return (
            <g id="hijab-back">
                <path d="M30,80 C30,150 40,200 100,200 C160,200 170,150 170,80 Z" fill={color} />
            </g>
        );
        return null;
    }

    switch (style) {
        case 'buzz': return (
            <g id="hair-front-buzz">
                {/* BUZZ: M-shape widow's peak, super thin cap, nearly bald */}
                <path d="M62,76 C62,34 78,24 100,24 C122,24 138,34 138,76 C138,48 120,36 104,36 L100,40 L96,36 C80,36 62,48 62,76Z" fill={color} opacity="0.75" />
                <path d="M62,76 C62,48 80,36 96,36 L100,40 L104,36 C120,36 138,48 138,76" fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" strokeLinejoin="round" />
            </g>
        );
        case 'short': return (
            <g id="hair-front-short">
                {/* SHORT: Volume tinggi asimetris, spiky military, peak y=10 */}
                <path d="M60,76 C60,30 70,14 86,16 L94,10 L102,16 L114,12 C130,16 140,30 140,76 C140,46 120,34 100,34 C80,34 60,46 60,76Z" fill={color} />
                <path d="M60,76 C65,50 85,42 100,42 C115,42 135,50 140,76 C140,46 120,34 100,34 C80,34 60,46 60,76Z" fill={SH_HAIR} />
                <path d="M72,26 C80,18 90,16 100,20 L92,10 C80,14 74,20 72,26Z" fill={HIGHLIGHT} opacity="0.15" />
            </g>
        );
        case 'neat': return (
            <g id="hair-front-neat">
                {/* NEAT: Side-swept kiri, asimetri horizontal ekstrem, formal */}
                <path d="M52,76 C45,15 80,6 112,14 C136,20 138,40 138,76 C138,50 125,36 110,34 C75,28 60,50 52,76Z" fill={color} />
                <path d="M110,34 C85,30 70,45 60,65 C68,55 85,45 110,40 Z" fill={SH_HAIR} />
                <path d="M112,14 Q105,24 114,35" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
                <path d="M66,48 C75,32 90,24 104,26" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
            </g>
        );
        case 'parted': return (
            <g id="hair-front-parted">
                {/* PARTED: V-notch negative space split, dua massa terpisah */}
                <path d="M80,30 C80,10 120,10 120,30 Z" fill={color} />
                <path d="M56,76 C56,18 80,14 96,18 L90,44 C76,38 66,50 56,76Z" fill={color} />
                <path d="M144,76 C144,18 120,14 104,18 L110,44 C124,38 134,50 144,76Z" fill={color} />
                <path d="M100,16 L100,38" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
                <path d="M72,38 C80,30 88,32 92,38" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.12" strokeLinecap="round" />
                <path d="M128,38 C120,30 112,32 108,38" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.12" strokeLinecap="round" />
            </g>
        );
        case 'long':
        case 'ponytail':
            return <g id={`hair-front-${style}`}>{femaleFrontHair}</g>;
        case 'bun': return (
            <g id="hair-front-bun">
                <circle cx="100" cy="18" r="18" fill={color} />
                <path d="M85,14 Q100,-2 115,14" fill="none" stroke={SHADOW} strokeWidth="3" opacity="0.2" strokeLinecap="round" />
                <path d="M82,8 Q100,-8 118,8" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                {femaleFrontHair}
            </g>
        );
        case 'hijab': return (
            <g id="hijab-front">
                {/* Inner Cap (Ciput) */}
                <path d="M62,60 C62,25 138,25 138,60 Q100,42 62,60 Z" fill="#0f172a" opacity="0.95" />
                {/* Main Hijab Drape & Face Hole (Compound Path) */}
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="
                        M 25,120 C 25,10 175,10 175,120 C 175,170 140,185 100,185 C 60,185 25,170 25,120 Z
                        M 67,74 C 67,108 82,131 100,131 C 118,131 133,108 133,74 C 133,50 117,36 100,36 C 83,36 67,50 67,74 Z
                    "
                    fill={color}
                />
                {/* Rim Shadow around face opening */}
                <path d="M67,74 C67,108 82,131 100,131 C118,131 133,108 133,74 C133,50 117,36 100,36 C83,36 67,50 67,74 Z" fill="none" stroke={SHADOW} strokeWidth="3" opacity="0.12" />
                {/* Shadow Drape Folds */}
                <path d="M68,105 C75,120 75,140 80,150" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
                <path d="M132,105 C125,120 125,140 120,150" fill="none" stroke={SHADOW} strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
                <path d="M60,95 Q64,110 68,115" fill="none" stroke={SHADOW} strokeWidth="1.5" opacity="0.1" strokeLinecap="round" />
                <path d="M140,95 Q136,110 132,115" fill="none" stroke={SHADOW} strokeWidth="1.5" opacity="0.1" strokeLinecap="round" />
                {/* Highlight cel-shade */}
                <path d="M48,70 C48,25 100,20 100,20" fill="none" stroke={HIGHLIGHT} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                {/* Medical Pin/Bros (PRIMER Theme) */}
                <g id="hijab-pin" transform="translate(70, 112)">
                    <circle cx="0" cy="0" r="2.5" fill="#0d9488" stroke="#fcd34d" strokeWidth="1" />
                    <circle cx="-0.5" cy="-0.5" r="1" fill="#ccfbf1" opacity="0.8" />
                </g>
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
                {/* Lab Coat Pocket & Pens (validated at x=42,y=148 — clear of lapel) */}
                <rect x="42" y="148" width="22" height="26" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="47" y1="143" x2="47" y2="158" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="54" y1="146" x2="54" y2="158" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                {/* ID Badge — right chest, teal PRIMER theme */}
                <g id="id-badge">
                    <rect x="152" y="146" width="4" height="6" rx="1" fill="#94a3b8" />
                    <rect x="150" y="150" width="8" height="12" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
                    <rect x="151" y="151.5" width="6" height="2.5" rx="0.5" fill="#0d9488" />
                    <line x1="152" y1="156" x2="156" y2="156" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                    <line x1="152" y1="159" x2="154" y2="159" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
                </g>
            </g>
        );
    }

    if (style === 'scrubs') {
        return (
            <g id="outfit-scrubs">
                <path d={baseBody} fill="#059669" />
                {/* Raglan Sleeve Seams */}
                <path d="M65,120 Q45,150 20,185" fill="none" stroke="#047857" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
                <path d="M135,120 Q155,150 180,185" fill="none" stroke="#047857" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
                {/* Drape folds */}
                <path d="M25,170 C30,185 30,195 20,200" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                <path d="M175,170 C170,185 170,195 180,200" fill="none" stroke={SHADOW} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                {/* V-Neck */}
                <path d="M85,120 L100,150 L115,120Z" fill={SHADOW} opacity="0.25" />
                <path d="M85,120 L100,150 L115,120" fill="none" stroke="#047857" strokeWidth="3" strokeLinejoin="round" />
                <path d="M82,120 L100,154 L118,120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />
                {/* Chest Pocket (Left) */}
                <g id="scrubs-pocket">
                    <rect x="42" y="148" width="22" height="26" rx="2" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                    <line x1="42" y1="153" x2="64" y2="153" stroke="#047857" strokeWidth="1.5" />
                    <line x1="44" y1="150.5" x2="62" y2="150.5" stroke="#047857" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="48" y1="142" x2="48" y2="152" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                    <line x1="48" y1="140" x2="48" y2="142" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                </g>
                {/* ID Badge (Right) */}
                <g id="id-badge-scrubs">
                    <rect x="152" y="146" width="4" height="6" rx="1" fill="#94a3b8" />
                    <rect x="150" y="150" width="8" height="12" rx="1" fill="#f8fafc" stroke="#047857" strokeWidth="1.2" />
                    <rect x="151" y="151.5" width="6" height="2.5" rx="0.5" fill="#0d9488" />
                    <line x1="152" y1="156" x2="156" y2="156" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                    <line x1="152" y1="159" x2="154" y2="159" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
                </g>
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
                    {/* Frame centered on pupil (cx=80.4/119.6, cy=79.2) */}
                    <rect x="62.4" y="66.2" width="36" height="26" rx="8" fill="none" stroke="#0f172a" strokeWidth="2.4" />
                    <rect x="101.6" y="66.2" width="36" height="26" rx="8" fill="none" stroke="#0f172a" strokeWidth="2.4" />
                    {/* Half-rim top bar */}
                    <path d="M62.4,74 C62.4,66.2 70.4,66.2 80.4,66.2 C90.4,66.2 98.4,66.2 98.4,74" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M101.6,74 C101.6,66.2 109.6,66.2 119.6,66.2 C129.6,66.2 137.6,66.2 137.6,74" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                    {/* Bridge */}
                    <path d="M98.4,75 Q100,73 101.6,75" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    {/* Temple arms */}
                    <path d="M62.4,74 Q56,72 52,69" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M137.6,74 Q144,72 148,69" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
                    {/* Lens tint & reflection */}
                    <rect x="63.6" y="67.4" width="33.6" height="23.6" rx="6.8" fill="#38bdf8" opacity="0.08" />
                    <rect x="102.8" y="67.4" width="33.6" height="23.6" rx="6.8" fill="#38bdf8" opacity="0.08" />
                    <path d="M66,69 L76,69 L68,88 L64,88 Z" fill={HIGHLIGHT} opacity="0.12" />
                    <path d="M105,69 L115,69 L107,88 L103,88 Z" fill={HIGHLIGHT} opacity="0.12" />
                </g>
            )}

            {hasStethoscope && outfit !== 'casual' && (
                <g id="stethoscope">
                    {/* Rubber tube — thinned to 5.5, bezier raised to y=195 */}
                    <path d="M35,135 C20,195 180,195 165,135" fill="none" stroke="#020617" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M35,135 C20,195 180,195 165,135" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Connector stem — slimmed to strokeWidth 3 */}
                    <path d="M100,178 L100,192" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                    <path d="M100.5,178 L100.5,192" fill="none" stroke={HIGHLIGHT} strokeWidth="1" opacity="0.5" />
                    {/* Chestpiece — proportional r=6 */}
                    <circle cx="100" cy="192" r="6" fill="#cbd5e1" stroke="#020617" strokeWidth="2" />
                    <circle cx="100" cy="192" r="2.5" fill="#334155" />
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
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={true} />
                    <VanguardHead skin={skin} skinTone={norm.skinTone || 'fair'} gender={norm.gender || 'L'} />
                    <VanguardFace mood={mood} hairColor={effectiveHairColor} gender={norm.gender || 'L'} />
                    <VanguardHair style={norm.hairStyle} color={effectiveHairColor} isBackLayer={false} />
                    <VanguardOutfit style={norm.outfit} />
                    <VanguardAccessories accessories={norm.accessories} outfit={norm.outfit} />
                </g>
            </svg>
        </div>
    );
}
