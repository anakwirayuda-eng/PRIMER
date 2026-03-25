/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (Paper-Doll Engine)
 * [PURPOSE]: Custom SVG-based modular avatar system. Zero external dependencies.
 *            Stacks SVG layers: Body → Eyes → Hair → Outfit → Accessories.
 *            Supports reactive expressions (Living Portrait) and progression-locked outfits.
 * [STATE]: Production
 * [ANCHOR]: AvatarRenderer
 * [DEPENDS_ON]: avatar/constants.js
 * [LAST_UPDATE]: 2026-03-25
 */

import React, { useMemo } from 'react';
import { SKIN_TONES, HAIR_COLORS } from './avatar/constants.js';

// ─── Backward compat exports ───
export { SKIN_TONES, HAIR_COLORS };
export { HAIR_STYLES_MALE as HAIR_STYLE_OPTIONS_MALE, HAIR_STYLES_FEMALE as HAIR_STYLE_OPTIONS_FEMALE } from './avatar/constants.js';

// Legacy AVATARS export
const AVATARS = [
    { id: 'doc_male_1', name: 'dr. Pria 1', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'dr. Wanita 1', icon: '👩‍⚕️', color: 'bg-pink-500' },
];
export { AVATARS };

// Re-export constants for PlayerSetup
export const HAIR_STYLES = {
    buzz: 'buzz', short: 'short', neat: 'neat', parted: 'parted',
    long: 'long', ponytail: 'ponytail', bun: 'bun', hijab: 'hijab',
};

// ============================================================================
// SVG PART RENDERERS
// ============================================================================

/** Shoulders + Neck + Head base */
function BodyBase({ skinColor }) {
    return (
        <g id="body-base">
            {/* Shoulders */}
            <path d="M30,200 Q30,160 60,148 L100,138 L140,148 Q170,160 170,200 Z"
                  fill={skinColor} stroke="none" />
            {/* Neck */}
            <rect x="85" y="120" width="30" height="25" rx="4" fill={skinColor} />
            {/* Head */}
            <ellipse cx="100" cy="85" rx="42" ry="48" fill={skinColor} />
            {/* Ears */}
            <ellipse cx="57" cy="88" rx="6" ry="9" fill={skinColor} />
            <ellipse cx="143" cy="88" rx="6" ry="9" fill={skinColor} />
            {/* Inner ear shadow */}
            <ellipse cx="57" cy="88" rx="3" ry="5" fill="rgba(0,0,0,0.1)" />
            <ellipse cx="143" cy="88" rx="3" ry="5" fill="rgba(0,0,0,0.1)" />
        </g>
    );
}

/** Eyes — 3 variants + glasses overlay */
function Eyes({ style = 'default', hasGlasses = false, mood = 'neutral' }) {
    // Mood-reactive eye adjustments
    const eyeScale = mood === 'panic' ? 1.3 : mood === 'relieved' ? 0.9 : 1;
    const pupilSize = mood === 'panic' ? 2.5 : 3;

    return (
        <g id="eyes" transform={`translate(100,80) scale(${eyeScale})`}>
            {/* Left eye */}
            <g transform="translate(-16,0)">
                <ellipse cx="0" cy="0" rx={style === 'friendly' ? 6 : 5} ry={style === 'serious' ? 3.5 : 4.5}
                         fill="white" stroke="#2d3748" strokeWidth="0.8" />
                <circle cx={style === 'friendly' ? 1 : 0} cy="0" r={pupilSize} fill="#1a1a2e" />
                <circle cx={style === 'friendly' ? 2 : 1} cy="-1" r="1" fill="white" opacity="0.8" />
            </g>
            {/* Right eye */}
            <g transform="translate(16,0)">
                <ellipse cx="0" cy="0" rx={style === 'friendly' ? 6 : 5} ry={style === 'serious' ? 3.5 : 4.5}
                         fill="white" stroke="#2d3748" strokeWidth="0.8" />
                <circle cx={style === 'friendly' ? 1 : 0} cy="0" r={pupilSize} fill="#1a1a2e" />
                <circle cx={style === 'friendly' ? 2 : 1} cy="-1" r="1" fill="white" opacity="0.8" />
            </g>
            {/* Eyebrows */}
            <line x1="-22" y1={mood === 'panic' ? -10 : -8} x2="-10" y2={mood === 'panic' ? -12 : -9}
                  stroke="#2d3748" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="10" y1={mood === 'panic' ? -12 : -9} x2="22" y2={mood === 'panic' ? -10 : -8}
                  stroke="#2d3748" strokeWidth="1.8" strokeLinecap="round" />

            {/* Sweat drop for panic */}
            {mood === 'panic' && (
                <g opacity="0.7">
                    <path d="M28,-6 Q30,-10 32,-6 Q32,-3 28,-3 Z" fill="#67e8f9" />
                </g>
            )}

            {/* Glasses overlay */}
            {hasGlasses && (
                <g stroke="#4a5568" strokeWidth="1.5" fill="none" opacity="0.85">
                    <rect x="-23" y="-7" width="16" height="14" rx="3" />
                    <rect x="7" y="-7" width="16" height="14" rx="3" />
                    <line x1="-7" y1="0" x2="7" y2="0" />
                    <line x1="-23" y1="0" x2="-30" y2="-2" />
                    <line x1="23" y1="0" x2="30" y2="-2" />
                </g>
            )}
        </g>
    );
}

/** Nose + Mouth */
function Face({ mood = 'neutral' }) {
    return (
        <g id="face">
            {/* Nose */}
            <path d="M97,90 Q100,96 103,90" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
            {/* Mouth */}
            {mood === 'panic' ? (
                <ellipse cx="100" cy="104" rx="5" ry="3" fill="#2d3748" />
            ) : mood === 'relieved' ? (
                <path d="M92,102 Q100,110 108,102" fill="none" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
                /* Neutral/serious — slight line */
                <line x1="93" y1="103" x2="107" y2="103" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" />
            )}
        </g>
    );
}

/** Hair — 8 styles, colored via fill */
function Hair({ style = 'neat', color = '#1a1a2e' }) {
    const c = color;
    switch (style) {
        case 'buzz':
            return (
                <g id="hair-buzz">
                    <path d="M58,75 Q60,38 100,35 Q140,38 142,75 Q142,55 100,50 Q58,55 58,75 Z"
                          fill={c} opacity="0.6" />
                </g>
            );
        case 'short':
            return (
                <g id="hair-short">
                    <path d="M58,82 Q58,36 100,32 Q142,36 142,82 Q138,55 100,48 Q62,55 58,82 Z" fill={c} />
                </g>
            );
        case 'neat':
            return (
                <g id="hair-neat">
                    <path d="M56,88 Q56,34 100,30 Q144,34 144,88 Q140,52 100,45 Q60,52 56,88 Z" fill={c} />
                    {/* Side part line */}
                    <path d="M78,35 Q82,50 80,65" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                </g>
            );
        case 'parted':
            return (
                <g id="hair-parted">
                    <path d="M56,90 Q56,34 100,30 Q144,34 144,90 Q140,52 100,45 Q60,52 56,90 Z" fill={c} />
                    {/* Part */}
                    <path d="M90,32 Q88,50 90,70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    {/* Swept side */}
                    <path d="M56,70 Q50,55 58,42 Q65,50 56,70 Z" fill={c} />
                </g>
            );
        case 'long':
            return (
                <g id="hair-long">
                    <path d="M54,90 Q54,32 100,28 Q146,32 146,90 Q142,50 100,43 Q58,50 54,90 Z" fill={c} />
                    {/* Long sides */}
                    <path d="M54,90 Q50,120 55,155" fill="none" stroke={c} strokeWidth="12" strokeLinecap="round" />
                    <path d="M146,90 Q150,120 145,155" fill="none" stroke={c} strokeWidth="12" strokeLinecap="round" />
                </g>
            );
        case 'ponytail':
            return (
                <g id="hair-ponytail">
                    <path d="M56,88 Q56,34 100,30 Q144,34 144,88 Q140,50 100,43 Q60,50 56,88 Z" fill={c} />
                    {/* Ponytail at back */}
                    <path d="M100,45 Q115,40 120,50 Q125,80 118,130" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" />
                    {/* Hair tie */}
                    <circle cx="120" cy="52" r="3" fill="rgba(255,255,255,0.3)" stroke={c} strokeWidth="1" />
                </g>
            );
        case 'bun':
            return (
                <g id="hair-bun">
                    <path d="M56,88 Q56,34 100,30 Q144,34 144,88 Q140,50 100,43 Q60,50 56,88 Z" fill={c} />
                    {/* Bun */}
                    <circle cx="100" cy="32" r="14" fill={c} />
                    <circle cx="100" cy="32" r="11" fill={c} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                </g>
            );
        case 'hijab':
            return (
                <g id="hair-hijab">
                    {/* Hijab wrapping around head and draping over shoulders */}
                    <path d="M48,95 Q45,40 100,28 Q155,40 152,95 Q150,115 145,145 L130,155 Q115,148 100,150 Q85,148 70,155 L55,145 Q50,115 48,95 Z"
                          fill={c} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                    {/* Inner hijab frame around face */}
                    <path d="M62,90 Q60,50 100,40 Q140,50 138,90"
                          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    {/* Subtle fold lines */}
                    <path d="M55,110 Q60,100 62,90" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                    <path d="M145,110 Q140,100 138,90" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                </g>
            );
        default:
            return <g id="hair-none" />;
    }
}

/** Outfit — casual / scrubs / labCoat */
function Outfit({ style = 'casual', skinColor }) {
    switch (style) {
        case 'scrubs':
            return (
                <g id="outfit-scrubs">
                    <path d="M30,200 Q30,160 60,148 L100,138 L140,148 Q170,160 170,200 Z"
                          fill="#059669" />
                    {/* V-neck */}
                    <path d="M85,138 L100,158 L115,138" fill="none" stroke="#047857" strokeWidth="1.5" />
                    {/* Neckline shadow */}
                    <path d="M85,140 L100,142 L115,140" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                </g>
            );
        case 'labCoat':
            return (
                <g id="outfit-labcoat">
                    {/* Inner shirt */}
                    <path d="M35,200 Q35,162 62,150 L100,140 L138,150 Q165,162 165,200 Z"
                          fill="#0ea5e9" />
                    {/* Lab coat */}
                    <path d="M28,200 Q28,158 58,146 L95,138 L105,138 L142,146 Q172,158 172,200 Z"
                          fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
                    {/* Lapels */}
                    <path d="M95,138 L88,165 L100,170" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.5" />
                    <path d="M105,138 L112,165 L100,170" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.5" />
                    {/* Center buttons */}
                    <circle cx="100" cy="175" r="1.5" fill="#cbd5e1" />
                    <circle cx="100" cy="185" r="1.5" fill="#cbd5e1" />
                    {/* Pocket */}
                    <rect x="110" y="168" width="18" height="14" rx="2" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    {/* Breast pocket with pen */}
                    <rect x="72" y="152" width="14" height="10" rx="1.5" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    <line x1="78" y1="148" x2="78" y2="153" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                </g>
            );
        default: // casual
            return (
                <g id="outfit-casual">
                    <path d="M30,200 Q30,160 60,148 L100,138 L140,148 Q170,160 170,200 Z"
                          fill="#334155" />
                    {/* Collar */}
                    <path d="M82,138 L88,148 L100,145 L112,148 L118,138" fill="#1e293b" />
                    {/* Collar fold */}
                    <path d="M88,148 L100,145 L112,148" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                </g>
            );
    }
}

/** Stethoscope around neck */
function Stethoscope() {
    return (
        <g id="stethoscope" opacity="0.9">
            {/* Tubing around neck */}
            <path d="M80,130 Q75,145 78,165 Q80,180 85,190"
                  fill="none" stroke="#4a5568" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M120,130 Q125,145 122,165 Q120,180 115,190"
                  fill="none" stroke="#4a5568" strokeWidth="2.5" strokeLinecap="round" />
            {/* Chest piece */}
            <circle cx="100" cy="195" r="6" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
            <circle cx="100" cy="195" r="3" fill="#475569" />
            {/* Connecting tubes to chest piece */}
            <path d="M85,190 Q90,195 94,195" fill="none" stroke="#4a5568" strokeWidth="2" />
            <path d="M115,190 Q110,195 106,195" fill="none" stroke="#4a5568" strokeWidth="2" />
        </g>
    );
}

// ============================================================================
// MAIN AVATAR RENDERER
// ============================================================================

function normalizeAvatar(avatar) {
    if (!avatar) return null;
    if (typeof avatar === 'string') {
        return { skinTone: 'fair', hairStyle: 'neat', hairColor: 'black', gender: 'L', accessories: ['stethoscope'], eyeStyle: 'default', outfit: 'casual' };
    }
    if (avatar.skinTone) return avatar;
    const isFemale = avatar.icon?.includes('👩') || avatar.color?.includes('pink') || avatar.color?.includes('purple');
    return {
        ...avatar,
        skinTone: 'fair',
        hairStyle: isFemale ? 'long' : 'neat',
        hairColor: 'black',
        gender: isFemale ? 'P' : (avatar.gender || 'L'),
        accessories: ['stethoscope'],
        eyeStyle: 'default',
        outfit: 'casual',
    };
}

function AvatarRenderer({ avatar, size = 80, className = '', mood = 'neutral' }) {
    const norm = useMemo(() => normalizeAvatar(avatar), [avatar]);

    if (!norm) {
        return (
            <span className={className} style={{
                fontSize: size * 0.6, lineHeight: 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: size, height: size,
            }}>
                {'👨‍⚕️'}
            </span>
        );
    }

    const skinHex = SKIN_TONES[norm.skinTone]?.hex || SKIN_TONES.fair.hex;
    const hairHex = HAIR_COLORS[norm.hairColor]?.hex || HAIR_COLORS.black.hex;
    const hasGlasses = norm.accessories?.includes('glasses');
    const hasStethoscope = norm.accessories?.includes('stethoscope');
    const outfit = norm.outfit || 'casual';
    const hairStyle = norm.hairStyle || 'neat';
    const eyeStyle = norm.eyeStyle || 'default';

    return (
        <div
            className={className}
            style={{
                width: size, height: size,
                borderRadius: '50%', overflow: 'hidden',
                position: 'relative', flexShrink: 0,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            }}
        >
            <svg
                viewBox="0 0 200 200"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
            >
                {/* Z-order: body → outfit → face → eyes → hair → accessories */}
                <BodyBase skinColor={skinHex} />
                <Outfit style={outfit} skinColor={skinHex} />
                <Face mood={mood} />
                <Eyes style={eyeStyle} hasGlasses={hasGlasses} mood={mood} />
                {/* Hair on top (unless hijab which should cover outfit shoulders) */}
                <Hair style={hairStyle} color={hairHex} />
                {hasStethoscope && outfit !== 'casual' && <Stethoscope />}
            </svg>
        </div>
    );
}

export default AvatarRenderer;
