/**
 * @reflection
 * [IDENTITY]: AvatarRenderer
 * [PURPOSE]: Portrait-based Avatar System for PRIMER.
 *            Uses pre-rendered professional illustrations instead of SVG.
 *            Matches avatar config (gender, skin, hair) to the best portrait.
 * [STATE]: Production
 * [ANCHOR]: AvatarRenderer
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-11
 */

import React, { useMemo } from 'react';

// ─── Exported constants (used by PlayerSetup, AvatarSelectionModal) ───

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

export { SKIN_TONES, HAIR_COLORS, HAIR_STYLES };

// ─── Portrait Registry ───
// Maps avatar configurations to pre-rendered professional portraits.
// Portraits are stored in /assets/avatars/ as PNG files.

const PORTRAIT_REGISTRY = [
    // Male portraits
    { id: 'male_light',   gender: 'L', skinGroup: 'light', hasGlasses: false, hairStyle: null, path: '/assets/avatars/male_light.png' },
    { id: 'male_medium',  gender: 'L', skinGroup: 'medium', hasGlasses: false, hairStyle: null, path: '/assets/avatars/male_medium.png' },
    { id: 'male_dark',    gender: 'L', skinGroup: 'dark', hasGlasses: false, hairStyle: null, path: '/assets/avatars/male_dark.png' },
    { id: 'male_glasses', gender: 'L', skinGroup: 'light', hasGlasses: true,  hairStyle: null, path: '/assets/avatars/male_glasses.png' },
    // Female portraits
    { id: 'female_light',  gender: 'P', skinGroup: 'light', hasGlasses: false, hairStyle: null, path: '/assets/avatars/female_light.png' },
    { id: 'female_medium', gender: 'P', skinGroup: 'medium', hasGlasses: false, hairStyle: null, path: '/assets/avatars/female_medium.png' },
    { id: 'female_dark',   gender: 'P', skinGroup: 'dark', hasGlasses: false, hairStyle: null, path: '/assets/avatars/female_dark.png' },
    { id: 'female_hijab',  gender: 'P', skinGroup: 'light', hasGlasses: false, hairStyle: 'hijab', path: '/assets/avatars/female_hijab.png' },
];

// Map individual skin tones to groups for matching
function getSkinGroup(skinTone) {
    if (['light', 'fair'].includes(skinTone)) return 'light';
    if (['medium', 'tan'].includes(skinTone)) return 'medium';
    return 'dark'; // brown, dark
}

// Smart portrait selector — picks the best matching portrait
function selectPortrait(avatar) {
    if (!avatar) return PORTRAIT_REGISTRY[0];

    const gender = avatar.gender || 'L';
    const skinGroup = getSkinGroup(avatar.skinTone || 'fair');
    const hasGlasses = avatar.accessories?.includes('glasses') || false;
    const hairStyle = avatar.hairStyle || 'neat';

    // Filter by gender first
    const genderMatches = PORTRAIT_REGISTRY.filter(p => p.gender === gender);
    if (genderMatches.length === 0) return PORTRAIT_REGISTRY[0];

    // Hijab is a special case — always prefer hijab portrait if hair is hijab
    if (hairStyle === 'hijab' && gender === 'P') {
        const hijabMatch = genderMatches.find(p => p.hairStyle === 'hijab');
        if (hijabMatch) return hijabMatch;
    }

    // Score-based matching
    let bestMatch = genderMatches[0];
    let bestScore = -1;

    for (const p of genderMatches) {
        let score = 0;
        // Skin match is most important
        if (p.skinGroup === skinGroup) score += 3;
        // Glasses match
        if (p.hasGlasses === hasGlasses) score += 2;
        // Don't pick hijab portrait for non-hijab users
        if (p.hairStyle === 'hijab' && hairStyle !== 'hijab') score -= 5;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = p;
        }
    }

    return bestMatch;
}

// ─── Legacy AVATARS export for AvatarSelectionModal ───
const AVATARS = [
    { id: 'doc_male_1', name: 'dr. Pria 1', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_male_2', name: 'dr. Pria 2', icon: '👨‍⚕️', color: 'bg-cyan-500' },
    { id: 'doc_female_1', name: 'dr. Wanita 1', icon: '👩‍⚕️', color: 'bg-pink-500' },
    { id: 'doc_female_2', name: 'dr. Wanita 2', icon: '👩‍⚕️', color: 'bg-purple-500' },
];
export { AVATARS };

function AvatarRenderer({ avatar, size = 80, className = '' }) {
    // Normalize legacy avatars — older saves may lack skinTone/gender fields
    const normalizedAvatar = useMemo(() => {
        if (!avatar) return null;
        // Already has skinTone — new format, use as-is
        if (avatar.skinTone) return avatar;
        // Legacy format: infer gender from icon/color, assign defaults
        const isFemale = avatar.icon?.includes('👩') || avatar.color?.includes('pink') || avatar.color?.includes('purple');
        return {
            ...avatar,
            skinTone: 'fair',
            hairStyle: isFemale ? 'neat' : 'neat',
            hairColor: 'black',
            gender: isFemale ? 'P' : 'L',
            accessories: ['stethoscope'],
        };
    }, [avatar]);

    const portrait = useMemo(() => selectPortrait(normalizedAvatar), [
        normalizedAvatar?.gender, normalizedAvatar?.skinTone, normalizedAvatar?.hairStyle,
        normalizedAvatar?.hairColor, normalizedAvatar?.accessories?.join(','),
    ]);

    // If truly no avatar data at all
    if (!normalizedAvatar) {
        return (
            <span className={className} style={{
                fontSize: size * 0.6,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
            }}>
                {'👨‍⚕️'}
            </span>
        );
    }

    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
            }}
        >
            <img
                src={portrait.path}
                alt={`Avatar ${portrait.id}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
                loading="eager"
                draggable={false}
            />
        </div>
    );
}

export default AvatarRenderer;
