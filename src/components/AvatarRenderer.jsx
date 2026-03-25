/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (Sleek Geometric Edition V2)
 * [PURPOSE]: Flat-vector, mathematically perfect geometric avatar.
 *            Capsule head, clean dot-eyes, alpha compositing shadows.
 *            Fixes: ClipPath ID mismatch, uncanny jawline, dark-on-dark outfit.
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
    { id: 'doc_male_1', name: 'dr. Pria 1', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'dr. Wanita 1', icon: '👩‍⚕️', color: 'bg-pink-500' },
];

// Universal Alpha Shadow color
const SH = '#0f172a';

// ============================================================================
// GEOMETRIC SVG PARTS
// ============================================================================

/** Capsule head + neck with ambient occlusion */
function GeometricHead({ skin }) {
    return (
        <g id="head">
            {/* Neck */}
            <rect x="85" y="120" width="30" height="40" fill={skin} />
            {/* Neck AO shadow under jaw */}
            <path d="M85,120 L115,120 L115,135 Q100,145 85,135Z" fill={SH} opacity="0.15" />
            {/* Ears */}
            <rect x="55" y="90" width="12" height="24" rx="6" fill={skin} />
            <rect x="133" y="90" width="12" height="24" rx="6" fill={skin} />
            <rect x="55" y="90" width="12" height="24" rx="6" fill={SH} opacity="0.05" />
            {/* Capsule head — mathematically perfect, no uncanny valley */}
            <rect x="60" y="45" width="80" height="100" rx="40" fill={skin} />
            {/* Core shadow — right side, 3D depth */}
            <path d="M100,45 A40,40 0 0 1 140,85 L140,105 A40,40 0 0 1 100,145Z" fill={SH} opacity="0.08" />
        </g>
    );
}

/** Mood-reactive face — clean dot-eyes, no creepy sclera */
function GeometricFace({ mood }) {
    const isPanic = mood === 'panic';
    const isRelieved = mood === 'relieved';

    return (
        <g id="face">
            {/* Eyebrows */}
            <line x1="70" y1={isPanic ? 76 : 80} x2="86" y2={isPanic ? 70 : 80}
                  stroke={SH} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="130" y1={isPanic ? 76 : 80} x2="114" y2={isPanic ? 70 : 80}
                  stroke={SH} strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Eyes */}
            {isRelieved ? (
                <>
                    <path d="M72,95 Q80,88 88,95" fill="none" stroke={SH} strokeWidth="3" strokeLinecap="round" />
                    <path d="M128,95 Q120,88 112,95" fill="none" stroke={SH} strokeWidth="3" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <circle cx="78" cy="92" r={isPanic ? 4 : 5.5} fill={SH} />
                    <circle cx="122" cy="92" r={isPanic ? 4 : 5.5} fill={SH} />
                    {isPanic && (
                        <>
                            <circle cx="78" cy="92" r="7" fill="none" stroke={SH} strokeWidth="1" opacity="0.5" />
                            <circle cx="122" cy="92" r="7" fill="none" stroke={SH} strokeWidth="1" opacity="0.5" />
                        </>
                    )}
                </>
            )}

            {/* Mouth */}
            {isPanic ? (
                <circle cx="100" cy="118" r="5" fill={SH} opacity="0.8" />
            ) : isRelieved ? (
                <path d="M92,118 Q100,126 108,118" fill="none" stroke={SH} strokeWidth="3" strokeLinecap="round" />
            ) : (
                <line x1="94" y1="118" x2="106" y2="118" stroke={SH} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            )}

            {/* Panic sweat */}
            {isPanic && <circle cx="130" cy="65" r="4" fill="#38bdf8" opacity="0.8" />}
        </g>
    );
}

/** Hair — 8 geometric styles */
function GeometricHair({ style, color }) {
    const baseHair = <path d="M60,85 L60,65 A40,40 0 0 1 140,65 L140,85 C140,40 60,40 60,85Z" fill={color} />;

    switch (style) {
        case 'buzz':
            return <path d="M60,85 L60,65 A40,40 0 0 1 140,65 L140,85 C140,40 60,40 60,85Z" fill={color} opacity="0.4" />;
        case 'short':
            return <g>{baseHair}<rect x="55" y="40" width="20" height="30" rx="10" fill={color} transform="rotate(30 65 55)" /></g>;
        case 'neat':
            return (
                <g>
                    <rect x="58" y="35" width="84" height="40" rx="20" fill={color} />
                    <path d="M60,60 Q80,30 140,60 L140,80 Q80,50 60,80Z" fill={color} />
                </g>
            );
        case 'parted':
            return (
                <g>
                    {baseHair}
                    <path d="M100,45 L110,35 C130,40 145,60 140,80 L130,80 C135,60 120,45 100,45Z" fill={SH} opacity="0.2" />
                </g>
            );
        case 'long':
            return (
                <g>
                    {baseHair}
                    {/* Long hair draping down sides */}
                    <rect x="52" y="55" width="16" height="110" rx="8" fill={color} />
                    <rect x="132" y="55" width="16" height="110" rx="8" fill={color} />
                </g>
            );
        case 'ponytail':
            return (
                <g>
                    <circle cx="145" cy="65" r="15" fill={color} />
                    <path d="M145,65 C160,80 160,110 140,120 C145,100 135,80 145,65Z" fill={color} />
                    {baseHair}
                </g>
            );
        case 'bun':
            return <g><circle cx="100" cy="25" r="22" fill={color} />{baseHair}</g>;
        case 'hijab':
            return (
                <g id="hijab">
                    {/* Ciput */}
                    <rect x="55" y="35" width="90" height="60" rx="30" fill={SH} />
                    {/* Main hijab body — drapes over shoulders, tucked into collar */}
                    <path d="M45,90 C45,30 155,30 155,90 C155,160 130,180 100,180 C70,180 45,160 45,90Z" fill={color} />
                    {/* Fabric fold cel-shade */}
                    <path d="M45,90 C60,130 80,160 100,170 C120,150 130,120 140,90 C120,110 110,120 100,125 C85,120 70,110 45,90Z" fill={SH} opacity="0.15" />
                </g>
            );
        default:
            return null;
    }
}

/** Outfit — casual / scrubs / labCoat */
function GeometricOutfit({ style }) {
    const bodyPath = "M35,200 L35,165 C35,145 55,135 80,135 L120,135 C145,135 165,145 165,165 L165,200Z";

    if (style === 'labCoat') {
        return (
            <g id="outfit">
                <path d={bodyPath} fill="#f8fafc" />
                {/* Inner scrub V-neck */}
                <path d="M85,135 L100,165 L115,135Z" fill="#0f766e" />
                <path d="M85,135 L100,165 L115,135Z" fill={SH} opacity="0.2" />
                {/* Lapels */}
                <path d="M80,135 L70,185 L90,200 L100,200 L100,165Z" fill="#e2e8f0" />
                <path d="M120,135 L130,185 L110,200 L100,200 L100,165Z" fill="#e2e8f0" />
                <line x1="100" y1="165" x2="100" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                {/* Breast pocket with pen */}
                <rect x="62" y="160" width="16" height="18" rx="2" fill="#f1f5f9" />
                <line x1="66" y1="155" x2="66" y2="165" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <line x1="72" y1="157" x2="72" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            </g>
        );
    }

    if (style === 'scrubs') {
        return (
            <g id="outfit">
                <path d={bodyPath} fill="#059669" />
                <path d="M85,135 L100,155 L115,135Z" fill={SH} opacity="0.2" />
            </g>
        );
    }

    // Casual
    return (
        <g id="outfit">
            <path d={bodyPath} fill="#334155" />
            <path d="M85,135 L100,155 L115,135Z" fill={SH} opacity="0.2" />
        </g>
    );
}

/** Stethoscope with silicone 3D trick */
function GeometricStethoscope() {
    return (
        <g id="stethoscope">
            <path d="M55,145 C45,200 155,200 145,145" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
            <path d="M55,145 C45,200 155,200 145,145" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="184" x2="100" y2="194" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="194" r="6" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
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
    if (avatar.skinTone) return { ...avatar, outfit: avatar.outfit || 'labCoat' };
    const isFemale = avatar.icon?.includes('👩') || avatar.color?.includes('pink') || avatar.color?.includes('purple');
    return {
        ...avatar, skinTone: 'fair', hairStyle: isFemale ? 'long' : 'neat',
        hairColor: 'black', gender: isFemale ? 'P' : (avatar.gender || 'L'),
        accessories: ['stethoscope'], outfit: 'labCoat',
    };
}

export default function AvatarRenderer({ avatar, size = 80, className = '', mood = 'neutral' }) {
    const norm = useMemo(() => normalizeAvatar(avatar), [avatar]);

    if (!norm) {
        return (
            <span className={className} style={{
                width: size, height: size, fontSize: size * 0.5,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{'👨‍⚕️'}</span>
        );
    }

    const skin = SKIN_TONES[norm.skinTone]?.hex || SKIN_TONES.fair.hex;
    const hairHex = HAIR_COLORS[norm.hairColor]?.hex || HAIR_COLORS.black.hex;
    const isHijab = norm.hairStyle === 'hijab';
    const hasStethoscope = norm.accessories?.includes('stethoscope');
    const hasGlasses = norm.accessories?.includes('glasses');
    const outfit = norm.outfit || 'labCoat';

    return (
        <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Render order: hair(back) → head → face → outfit → glasses → stethoscope */}
                <GeometricHair style={norm.hairStyle} color={isHijab ? '#334155' : hairHex} />
                <GeometricHead skin={skin} />
                <GeometricFace mood={mood} />
                <GeometricOutfit style={outfit} />

                {/* Glasses */}
                {hasGlasses && (
                    <g stroke="#4a5568" strokeWidth="3" fill="none">
                        <rect x="60" y="82" width="30" height="20" rx="8" />
                        <rect x="110" y="82" width="30" height="20" rx="8" />
                        <line x1="90" y1="92" x2="110" y2="92" />
                        <line x1="60" y1="92" x2="52" y2="88" />
                        <line x1="140" y1="92" x2="148" y2="88" />
                    </g>
                )}

                {/* Stethoscope — only with lab coat */}
                {hasStethoscope && outfit === 'labCoat' && <GeometricStethoscope />}
            </svg>
        </div>
    );
}
