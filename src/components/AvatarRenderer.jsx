/**
 * @reflection
 * [IDENTITY]: AvatarRenderer
 * [PURPOSE]: High-quality SVG-based Avatar Renderer for PRIMER.
 * [STATE]: Production
 * [ANCHOR]: AvatarRenderer
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-13
 */

import React from 'react';

/**
 * SVG-based Avatar Renderer for PRIMER
 * Renders a doctor portrait based on customizable traits.
 * 
 * Props:
 *   avatar: { skinTone, hairStyle, hairColor, gender, accessories }
 *   size: number (default 80)
 *   className: string
 */

const SKIN_TONES = {
    light: '#FDEBD0',
    fair: '#F5CBA7',
    medium: '#E0AC69',
    tan: '#C68642',
    brown: '#8D5524',
    dark: '#5C3A1E',
};

const HAIR_COLORS = {
    black: '#1a1a2e',
    darkBrown: '#3d2b1f',
    brown: '#6b4226',
    auburn: '#922724',
    gray: '#9e9e9e',
    white: '#e0e0e0',
};

const HAIR_STYLES = {
    short: 'short',
    neat: 'neat',
    parted: 'parted',
    buzz: 'buzz',
    long: 'long',
    ponytail: 'ponytail',
    hijab: 'hijab',
    bun: 'bun',
};

// Export constants for the setup form
export { SKIN_TONES, HAIR_COLORS, HAIR_STYLES };

function AvatarRenderer({ avatar, size = 80, className = '' }) {
    if (!avatar || !avatar.skinTone) {
        // Fallback for legacy emoji avatars
        return (
            <span className={className} style={{ fontSize: size * 0.6, lineHeight: 1 }}>
                {avatar?.icon || '👨‍⚕️'}
            </span>
        );
    }

    const skin = SKIN_TONES[avatar.skinTone] || SKIN_TONES.fair;
    const skinDark = adjustColor(skin, -25);
    const skinLight = adjustColor(skin, 20);
    const hairCol = HAIR_COLORS[avatar.hairColor] || HAIR_COLORS.black;
    const style = avatar.hairStyle || 'neat';
    const isFemale = avatar.gender === 'P';
    const hasGlasses = avatar.accessories?.includes('glasses');
    const hasStethoscope = avatar.accessories?.includes('stethoscope');

    const gradId = `skinGrad-${avatar.skinTone}`;

    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
            style={{ borderRadius: '50%', overflow: 'hidden', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
            <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={skinLight} />
                    <stop offset="100%" stopColor={skin} />
                </linearGradient>
                <radialGradient id="faceShine" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Background */}
            <rect width="100" height="100" fill="#f1f5f9" />
            <circle cx="50" cy="50" r="48" fill="white" fillOpacity="0.3" />

            {/* Lab Coat / Shoulders */}
            <ellipse cx="50" cy="98" rx="42" ry="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <path d="M20 90 Q50 85 80 90 L80 100 L20 100 Z" fill="#ffffff" />

            {/* V-Neck Shirt Underneath */}
            <path d="M40 85 L50 95 L60 85" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

            {/* Coat Collars */}
            <path d="M35 85 L45 92 L45 100" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
            <path d="M65 85 L55 92 L55 100" fill="none" stroke="#94a3b8" strokeWidth="1.2" />

            {/* Neck */}
            <rect x="42" y="68" width="16" height="14" fill={skinDark} rx="2" />

            {/* Head Shadow */}
            <ellipse cx="50" cy="74" rx="20" ry="6" fill="black" fillOpacity="0.1" />

            {/* Head */}
            <ellipse cx="50" cy="42" rx="28" ry="32" fill={`url(#${gradId})`} />
            <ellipse cx="50" cy="42" rx="28" ry="32" fill="url(#faceShine)" />

            {/* Ears */}
            <ellipse cx="22" cy="45" rx="5" ry="7" fill={skin} stroke={skinDark} strokeWidth="0.5" />
            <ellipse cx="78" cy="45" rx="5" ry="7" fill={skin} stroke={skinDark} strokeWidth="0.5" />

            {/* Cheeks */}
            <circle cx="32" cy="54" r="5" fill="#f43f5e" fillOpacity="0.08" />
            <circle cx="68" cy="54" r="5" fill="#f43f5e" fillOpacity="0.08" />

            {/* Hair */}
            {renderHair(style, hairCol, isFemale, skin)}

            {/* Eyes */}
            <g className="eyes">
                <ellipse cx="38" cy="46" rx="4" ry="4.5" fill="white" />
                <ellipse cx="62" cy="46" rx="4" ry="4.5" fill="white" />
                <circle cx="38" cy="46.5" r="2.2" fill="#0f172a" />
                <circle cx="62" cy="46.5" r="2.2" fill="#0f172a" />
                <circle cx="38.8" cy="45.5" r="0.8" fill="white" />
                <circle cx="62.8" cy="45.5" r="0.8" fill="white" />
            </g>

            {/* Eyebrows */}
            <path d="M31 39 Q38 35 45 39" fill="none" stroke={hairCol} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M55 39 Q62 35 69 39" fill="none" stroke={hairCol} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

            {/* Nose */}
            <path d="M50 48 Q49 56 47 57 Q50 59 53 57 Q51 56 50 48" fill={skinDark} opacity="0.4" />

            {/* Mouth */}
            <path d="M42 63 Q50 68 58 63" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

            {/* Glasses */}
            {hasGlasses && (
                <g opacity="0.9">
                    <circle cx="38" cy="46" r="7.5" fill="rgba(186, 230, 253, 0.2)" stroke="#1e293b" strokeWidth="1.5" />
                    <circle cx="62" cy="46" r="7.5" fill="rgba(186, 230, 253, 0.2)" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="45.5" y1="46" x2="54.5" y2="46" stroke="#1e293b" strokeWidth="1.5" />
                    <path d="M22 44 L31 46" stroke="#1e293b" strokeWidth="1" />
                    <path d="M78 44 L69 46" stroke="#1e293b" strokeWidth="1" />
                </g>
            )}

            {/* Stethoscope around neck */}
            {hasStethoscope && (
                <g filter="drop-shadow(0 2px 2px rgba(0,0,0,0.15))">
                    <path d="M38 78 Q36 85 41 90 Q43 93 50 93 Q57 93 59 90 Q64 85 62 78" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="94" r="4.5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                    <circle cx="50" cy="94" r="1.5" fill="#f8fafc" opacity="0.5" />
                </g>
            )}
        </svg>
    );
}

function renderHair(style, color, isFemale, skin) {
    const highlight = adjustColor(color, 25);
    switch (style) {
        case 'buzz':
            return (
                <g>
                    <path d="M22 40 Q25 10 50 8 Q75 10 78 40 Q70 25 50 22 Q30 25 22 40" fill={color} />
                    <path d="M30 15 Q50 12 70 15" fill="none" stroke={highlight} strokeWidth="1" opacity="0.3" />
                </g>
            );
        case 'short':
            return (
                <g>
                    <path d="M20 44 Q20 6 50 4 Q80 6 80 44 Q72 20 50 16 Q28 20 20 44" fill={color} />
                    <path d="M25 18 Q50 10 75 18" fill="none" stroke={highlight} strokeWidth="2" opacity="0.2" />
                    <path d="M20 44 Q18 35 20 28" fill={color} />
                    <path d="M80 44 Q82 35 80 28" fill={color} />
                </g>
            );
        case 'neat':
            return (
                <g>
                    <path d="M20 46 Q20 4 50 2 Q80 4 80 46 Q72 18 50 14 Q28 18 20 46" fill={color} />
                    <path d="M30 12 Q45 6 60 12" fill="none" stroke={highlight} strokeWidth="2" opacity="0.2" />
                    <path d="M48 4 L52 14" fill="none" stroke={highlight} strokeWidth="1" opacity="0.1" />
                </g>
            );
        case 'parted':
            return (
                <g>
                    <path d="M20 46 Q20 4 50 2 Q80 4 80 46 Q72 18 50 14 Q28 18 20 46" fill={color} />
                    <path d="M45 2 L42 16" fill="none" stroke={highlight} strokeWidth="3" opacity="0.3" />
                    <path d="M48 2 L52 16" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                </g>
            );
        case 'long':
            return (
                <g>
                    <path d="M18 55 Q16 2 50 0 Q84 2 82 55 Q78 16 50 12 Q22 16 18 55" fill={color} />
                    <path d="M18 55 Q15 70 18 85" fill={color} stroke={color} strokeWidth="8" strokeLinecap="round" />
                    <path d="M82 55 Q85 70 82 85" fill={color} stroke={color} strokeWidth="8" strokeLinecap="round" />
                    <path d="M30 10 Q50 6 70 10" fill="none" stroke={highlight} strokeWidth="2" opacity="0.2" />
                </g>
            );
        case 'ponytail':
            return (
                <g>
                    <path d="M20 46 Q20 4 50 2 Q80 4 80 46 Q72 18 50 14 Q28 18 20 46" fill={color} />
                    <path d="M78 20 Q95 15 90 40 Q85 55 80 45" fill={color} />
                    <circle cx="80" cy="25" r="3" fill="#334155" /> {/* Hair tie */}
                </g>
            );
        case 'hijab':
            return (
                <g>
                    <ellipse cx="50" cy="40" rx="38" ry="42" fill={color} />
                    <path d="M15 50 Q12 75 22 90 Q30 95 40 92" fill={color} />
                    <path d="M85 50 Q88 75 78 90 Q70 95 60 92" fill={color} />
                    <ellipse cx="50" cy="48" rx="26" ry="30" fill={skin} />
                    <path d="M24 48 Q24 22 50 20 Q76 22 76 48 Q76 75 50 78 Q24 75 24 48" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                </g>
            );
        case 'bun':
            return (
                <g>
                    <path d="M20 44 Q20 6 50 4 Q80 6 80 44 Q72 20 50 16 Q28 20 20 44" fill={color} />
                    <circle cx="50" cy="6" r="10" fill={color} />
                    <circle cx="50" cy="6" r="6" fill="url(#faceShine)" opacity="0.3" />
                </g>
            );
        default:
            return (
                <path d="M20 46 Q20 4 50 2 Q80 4 80 46 Q72 18 50 14 Q28 18 20 46" fill={color} />
            );
    }
}

function adjustColor(hex, amount) {
    if (!hex || hex.length < 7) return hex;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default AvatarRenderer;
