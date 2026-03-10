/**
 * @reflection
 * [IDENTITY]: VillagerAvatar
 * [PURPOSE]: Deterministic SVG avatar generator for village residents.
 *            Generates consistent, unique portraits based on villager data
 *            (name, age, gender) using a hash-based system. No external deps.
 * [STATE]: Stable
 * [ANCHOR]: VillagerAvatar
 * [DEPENDS_ON]: none
 */

import React, { useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════
// HASH UTILITY — deterministic color/shape from string
// ═══════════════════════════════════════════════════════════════

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function pickFrom(arr, hash, offset = 0) {
    return arr[(hash + offset) % arr.length];
}

// ═══════════════════════════════════════════════════════════════
// APPEARANCE DATA
// ═══════════════════════════════════════════════════════════════

const SKIN_TONES = [
    '#F5D6B8', '#E8C4A2', '#D4A574', '#C49A6C',
    '#B0855A', '#8D6E4C', '#7A5C3D', '#6B4F35'
];

const HAIR_COLORS = [
    '#1A1A2E', '#2D2D3D', '#3D2B1F', '#4A3728',
    '#5C4033', '#2C2C2C', '#1C1C1C', '#3B3024'
];

const HIJAB_COLORS = [
    '#2E7D32', '#1565C0', '#6A1B9A', '#AD1457',
    '#F57F17', '#00838F', '#4E342E', '#37474F',
    '#D84315', '#1B5E20', '#283593', '#880E4F'
];

const SHIRT_COLORS = [
    '#1976D2', '#388E3C', '#D32F2F', '#7B1FA2',
    '#F57C00', '#0097A7', '#455A64', '#5D4037',
    '#E64A19', '#00796B', '#303F9F', '#C2185B'
];

const PECI_COLORS = ['#1A1A1A', '#2D2D2D', '#1E3A5F', '#3E2723'];

// Face shapes: 0=round, 1=oval, 2=square-ish
const FACE_RX = [42, 38, 35];
const FACE_RY = [40, 44, 38];

// ═══════════════════════════════════════════════════════════════
// AGE HELPERS
// ═══════════════════════════════════════════════════════════════

function getAgeCategory(age) {
    if (age <= 5) return 'toddler';
    if (age <= 12) return 'child';
    if (age <= 17) return 'teen';
    if (age <= 40) return 'adult';
    if (age <= 60) return 'middle';
    return 'elderly';
}

// ═══════════════════════════════════════════════════════════════
// SVG AVATAR COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function VillagerAvatar({ name = 'Warga', age = 30, gender = 'M', size = 48, className = '' }) {
    const avatar = useMemo(() => {
        const seed = `${name}-${gender}-${age}`;
        const h = hashCode(seed);
        const ageCat = getAgeCategory(age);

        const skin = pickFrom(SKIN_TONES, h, 0);
        const hair = pickFrom(HAIR_COLORS, h, 3);
        const shirt = pickFrom(SHIRT_COLORS, h, 7);
        const faceIdx = h % 3;
        const rx = FACE_RX[faceIdx];
        const ry = FACE_RY[faceIdx];

        // Eye style
        const eyeY = 44 + (h % 3);
        const eyeSize = ageCat === 'toddler' || ageCat === 'child' ? 3.5 : 2.5;
        const eyeSpacing = 11 + (h % 4);

        // Mouth
        const smileWidth = 6 + (h % 5);
        const mouthY = 56 + (h % 3);

        // Nose
        const noseSize = ageCat === 'toddler' ? 2 : 3 + (h % 2);

        // Hair style varies by gender + hash
        const hairStyle = h % 4;

        // Hijab for adult/elderly females (culturally appropriate for Indonesian village)
        const wearHijab = gender === 'F' && (ageCat === 'adult' || ageCat === 'middle' || ageCat === 'elderly') && (h % 3 !== 0);
        const hijabColor = pickFrom(HIJAB_COLORS, h, 5);

        // Peci for some adult males
        const wearPeci = gender === 'M' && (ageCat === 'adult' || ageCat === 'middle' || ageCat === 'elderly') && (h % 4 === 0);
        const peciColor = pickFrom(PECI_COLORS, h, 2);

        // Wrinkles for elderly
        const showWrinkles = ageCat === 'elderly' || ageCat === 'middle';

        // Glasses for some
        const wearGlasses = (h % 7 === 0) && ageCat !== 'toddler' && ageCat !== 'child';

        return {
            skin, hair, shirt, rx, ry, eyeY, eyeSize, eyeSpacing,
            smileWidth, mouthY, noseSize, hairStyle, wearHijab, hijabColor,
            wearPeci, peciColor, showWrinkles, wearGlasses, ageCat, h
        };
    }, [name, age, gender]);

    const {
        skin, hair, shirt, rx, ry, eyeY, eyeSize, eyeSpacing,
        smileWidth, mouthY, noseSize, hairStyle, wearHijab, hijabColor,
        wearPeci, peciColor, showWrinkles, wearGlasses, ageCat, h
    } = avatar;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            role="img"
            aria-label={`Avatar ${name}`}
        >
            {/* Background circle */}
            <circle cx="50" cy="50" r="50" fill="#E8F5E9" />

            {/* Body/Shirt */}
            <ellipse cx="50" cy="92" rx="30" ry="18" fill={shirt} />

            {/* Neck */}
            <rect x="44" y="68" width="12" height="10" rx="3" fill={skin} />

            {/* Head */}
            <ellipse cx="50" cy="45" rx={rx} ry={ry} fill={skin} />

            {/* Hair (behind head for some styles) */}
            {!wearHijab && (
                <>
                    {/* Base hair coverage */}
                    {gender === 'M' ? (
                        // Male hair styles
                        <>
                            {hairStyle === 0 && (
                                // Short neat
                                <path d={`M${50 - rx + 2},45 Q${50 - rx},${45 - ry + 5} 50,${45 - ry - 2} Q${50 + rx},${45 - ry + 5} ${50 + rx - 2},45`} fill={hair} />
                            )}
                            {hairStyle === 1 && (
                                // Side part
                                <>
                                    <path d={`M${50 - rx + 2},45 Q${50 - rx - 2},${45 - ry + 3} 50,${45 - ry - 3} Q${50 + rx + 2},${45 - ry + 3} ${50 + rx - 2},45`} fill={hair} />
                                    <path d={`M35,${45 - ry + 8} Q38,${45 - ry + 2} 50,${45 - ry - 3}`} fill="none" stroke={hair} strokeWidth="3" />
                                </>
                            )}
                            {hairStyle === 2 && (
                                // Buzz cut
                                <ellipse cx="50" cy={45 - ry / 2 + 5} rx={rx - 2} ry={ry / 2 + 2} fill={hair} />
                            )}
                            {hairStyle === 3 && (
                                // Wavy top
                                <path d={`M${50 - rx + 3},42 C${50 - rx},${45 - ry - 5} ${50 + rx},${45 - ry - 5} ${50 + rx - 3},42`} fill={hair} />
                            )}
                        </>
                    ) : (
                        // Female hair styles
                        <>
                            {hairStyle === 0 && (
                                // Long straight
                                <>
                                    <path d={`M${50 - rx + 2},50 Q${50 - rx},${45 - ry + 3} 50,${45 - ry - 2} Q${50 + rx},${45 - ry + 3} ${50 + rx - 2},50`} fill={hair} />
                                    <rect x={50 - rx + 5} y="45" width="5" height="25" rx="2" fill={hair} opacity="0.8" />
                                    <rect x={50 + rx - 10} y="45" width="5" height="25" rx="2" fill={hair} opacity="0.8" />
                                </>
                            )}
                            {hairStyle === 1 && (
                                // Bob
                                <>
                                    <path d={`M${50 - rx + 2},52 Q${50 - rx - 3},${45 - ry + 3} 50,${45 - ry - 3} Q${50 + rx + 3},${45 - ry + 3} ${50 + rx - 2},52`} fill={hair} />
                                    <rect x={50 - rx + 3} y="40" width="6" height="18" rx="3" fill={hair} opacity="0.7" />
                                    <rect x={50 + rx - 9} y="40" width="6" height="18" rx="3" fill={hair} opacity="0.7" />
                                </>
                            )}
                            {hairStyle === 2 && (
                                // Bun (for older women)
                                <>
                                    <path d={`M${50 - rx + 2},45 Q${50 - rx},${45 - ry + 3} 50,${45 - ry - 2} Q${50 + rx},${45 - ry + 3} ${50 + rx - 2},45`} fill={hair} />
                                    <circle cx="50" cy={45 - ry - 2} r="8" fill={hair} />
                                </>
                            )}
                            {hairStyle === 3 && (
                                // Ponytail
                                <>
                                    <path d={`M${50 - rx + 2},48 Q${50 - rx},${45 - ry + 3} 50,${45 - ry - 2} Q${50 + rx},${45 - ry + 3} ${50 + rx - 2},48`} fill={hair} />
                                    <rect x="58" y={45 - ry + 5} width="5" height="30" rx="2" fill={hair} opacity="0.7" transform="rotate(20, 60, 30)" />
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Hijab */}
            {wearHijab && (
                <>
                    <ellipse cx="50" cy="42" rx={rx + 6} ry={ry + 4} fill={hijabColor} />
                    <ellipse cx="50" cy="45" rx={rx} ry={ry} fill={skin} />
                    {/* Hijab drape */}
                    <path d={`M${50 - rx - 4},50 Q${50 - rx - 6},65 ${50 - rx + 5},78`} fill={hijabColor} stroke={hijabColor} strokeWidth="8" strokeLinecap="round" />
                    <path d={`M${50 + rx + 4},50 Q${50 + rx + 6},65 ${50 + rx - 5},78`} fill={hijabColor} stroke={hijabColor} strokeWidth="8" strokeLinecap="round" />
                    {/* Hijab border/detail */}
                    <path d={`M${50 - rx - 2},48 Q50,${45 - ry - 6} ${50 + rx + 2},48`} fill="none" stroke={hijabColor} strokeWidth="6" />
                </>
            )}

            {/* Peci */}
            {wearPeci && (
                <ellipse cx="50" cy={45 - ry + 8} rx={rx - 5} ry="8" fill={peciColor} />
            )}

            {/* Eyes */}
            <circle cx={50 - eyeSpacing} cy={eyeY} r={eyeSize} fill="#1A1A1A" />
            <circle cx={50 + eyeSpacing} cy={eyeY} r={eyeSize} fill="#1A1A1A" />
            {/* Eye highlights */}
            <circle cx={50 - eyeSpacing + 0.8} cy={eyeY - 0.8} r={eyeSize * 0.35} fill="white" />
            <circle cx={50 + eyeSpacing + 0.8} cy={eyeY - 0.8} r={eyeSize * 0.35} fill="white" />

            {/* Eyebrows */}
            <line x1={50 - eyeSpacing - 3} y1={eyeY - 5} x2={50 - eyeSpacing + 3} y2={eyeY - 6} stroke={hair} strokeWidth="1.5" strokeLinecap="round" />
            <line x1={50 + eyeSpacing - 3} y1={eyeY - 6} x2={50 + eyeSpacing + 3} y2={eyeY - 5} stroke={hair} strokeWidth="1.5" strokeLinecap="round" />

            {/* Nose */}
            <ellipse cx="50" cy={mouthY - 5} rx={noseSize * 0.6} ry={noseSize * 0.4} fill="none" stroke={skin} strokeWidth="1" opacity="0.5" />

            {/* Mouth */}
            <path
                d={`M${50 - smileWidth / 2},${mouthY} Q50,${mouthY + 4} ${50 + smileWidth / 2},${mouthY}`}
                fill="none"
                stroke="#C0392B"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Wrinkles for elderly */}
            {showWrinkles && (
                <>
                    <line x1={50 - eyeSpacing - 4} y1={eyeY + 1} x2={50 - eyeSpacing - 7} y2={eyeY + 3} stroke={skin} strokeWidth="0.8" opacity="0.4" />
                    <line x1={50 + eyeSpacing + 4} y1={eyeY + 1} x2={50 + eyeSpacing + 7} y2={eyeY + 3} stroke={skin} strokeWidth="0.8" opacity="0.4" />
                </>
            )}

            {/* Glasses */}
            {wearGlasses && (
                <>
                    <circle cx={50 - eyeSpacing} cy={eyeY} r={eyeSize + 3} fill="none" stroke="#4A4A4A" strokeWidth="1.2" />
                    <circle cx={50 + eyeSpacing} cy={eyeY} r={eyeSize + 3} fill="none" stroke="#4A4A4A" strokeWidth="1.2" />
                    <line x1={50 - eyeSpacing + eyeSize + 3} y1={eyeY} x2={50 + eyeSpacing - eyeSize - 3} y2={eyeY} stroke="#4A4A4A" strokeWidth="1" />
                    <line x1={50 - eyeSpacing - eyeSize - 3} y1={eyeY} x2={50 - eyeSpacing - eyeSize - 7} y2={eyeY - 2} stroke="#4A4A4A" strokeWidth="1" />
                    <line x1={50 + eyeSpacing + eyeSize + 3} y1={eyeY} x2={50 + eyeSpacing + eyeSize + 7} y2={eyeY - 2} stroke="#4A4A4A" strokeWidth="1" />
                </>
            )}

            {/* Baby/toddler cheeks */}
            {ageCat === 'toddler' && (
                <>
                    <circle cx={50 - eyeSpacing - 3} cy={eyeY + 5} r="4" fill="#FFB4B4" opacity="0.3" />
                    <circle cx={50 + eyeSpacing + 3} cy={eyeY + 5} r="4" fill="#FFB4B4" opacity="0.3" />
                </>
            )}

            {/* Child: simple flower/star accessory for girls */}
            {ageCat === 'child' && gender === 'F' && (h % 2 === 0) && (
                <circle cx={50 + rx - 8} cy={45 - ry + 12} r="4" fill="#FF6B6B" opacity="0.8" />
            )}
        </svg>
    );
}

/**
 * Generate an avatar for batch/non-React usage (returns SVG string).
 * Useful for canvas rendering or exporting.
 */
export function getAvatarSeed(name, gender, age) {
    return { name, gender, age };
}
