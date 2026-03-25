/**
 * @reflection
 * [IDENTITY]: AvatarRenderer
 * [PURPOSE]: DiceBear-powered Avatar System for PRIMER.
 *            Generates unique SVG avatars from player customization.
 *            Every combination of skin/hair/accessories produces a distinct avatar.
 * [STATE]: Production
 * [ANCHOR]: AvatarRenderer
 * [DEPENDS_ON]: @dicebear/core, @dicebear/collection
 * [LAST_UPDATE]: 2026-03-25
 */

import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// ─── Exported constants (used by PlayerSetup, AvatarSelectionModal) ───

// Skin tones mapped to DiceBear hex values
const SKIN_TONES = {
    light:  '#ffdbb4',
    fair:   '#edb98a',
    medium: '#d08b5b',
    tan:    '#ae5d29',
    brown:  '#614335',
    dark:   '#3b2219',
};

// Hair colors mapped to DiceBear hex values
const HAIR_COLORS = {
    black:     '#1a1a2e',
    darkBrown: '#3d2b1f',
    brown:     '#6b4226',
    auburn:    '#922724',
    gray:      '#9e9e9e',
    white:     '#e0e0e0',
};

// Hair styles mapping: PRIMER name → DiceBear `top` value
const HAIR_STYLES = {
    // Male-leaning
    buzz:     'shortFlat',
    short:    'shortWaved',
    neat:     'shortRound',
    parted:   'theCaesarAndSidePart',
    // Female-leaning
    long:     'straight01',
    ponytail: 'longButNotTooLong',
    bun:      'bun',
    hijab:    'hijab',
};

// Accessories mapping: PRIMER name → DiceBear `accessories` value
const ACCESSORY_MAP = {
    glasses: 'prescription01',
};

export { SKIN_TONES, HAIR_COLORS, HAIR_STYLES };

// ─── Legacy AVATARS export (backward compat for AvatarSelectionModal) ───
const AVATARS = [
    { id: 'doc_male_1', name: 'dr. Pria 1', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_male_2', name: 'dr. Pria 2', icon: '👨‍⚕️', color: 'bg-cyan-500' },
    { id: 'doc_female_1', name: 'dr. Wanita 1', icon: '👩‍⚕️', color: 'bg-pink-500' },
    { id: 'doc_female_2', name: 'dr. Wanita 2', icon: '👩‍⚕️', color: 'bg-purple-500' },
];
export { AVATARS };

// ─── SVG generation cache ───
const svgCache = new Map();

function generateAvatarSVG(avatarConfig) {
    if (!avatarConfig) return null;

    // Build a stable cache key from config
    const cacheKey = JSON.stringify(avatarConfig);
    if (svgCache.has(cacheKey)) return svgCache.get(cacheKey);

    const skinHex = SKIN_TONES[avatarConfig.skinTone] || SKIN_TONES.fair;
    const hairHex = HAIR_COLORS[avatarConfig.hairColor] || HAIR_COLORS.black;
    const topStyle = HAIR_STYLES[avatarConfig.hairStyle] || HAIR_STYLES.neat;

    // Map accessories
    const hasGlasses = avatarConfig.accessories?.includes('glasses');
    const dicebearAccessories = hasGlasses ? ['prescription01'] : [];

    const avatar = createAvatar(avataaars, {
        seed: `primer-${avatarConfig.hairStyle}-${avatarConfig.skinTone}`,
        style: ['circle'],
        skinColor: [skinHex.replace('#', '')],
        hairColor: [hairHex.replace('#', '')],
        top: [topStyle],
        accessories: dicebearAccessories.length > 0 ? dicebearAccessories : [],
        accessoriesProbability: hasGlasses ? 100 : 0,
        clothing: ['blazerAndShirt'],
        clothesColor: ['3c4f5c'],  // Professional dark
        mouth: ['smile'],
        eyes: ['default'],
        eyebrows: ['default'],
        facialHairProbability: 0,
        backgroundColor: ['transparent'],
        randomizeIds: true,
    });

    const svg = avatar.toString();
    svgCache.set(cacheKey, svg);
    return svg;
}

// ─── Normalize legacy avatar formats ───
function normalizeAvatar(avatar) {
    if (!avatar) return null;

    // String-type from INITIAL_PLAYER_STATE ('default')
    if (typeof avatar === 'string') {
        return { skinTone: 'fair', hairStyle: 'neat', hairColor: 'black', gender: 'L', accessories: ['stethoscope'] };
    }

    // Already has skinTone — new format, use as-is
    if (avatar.skinTone) return avatar;

    // Legacy object format: infer gender from icon/color, assign defaults
    const isFemale = avatar.icon?.includes('👩') || avatar.color?.includes('pink') || avatar.color?.includes('purple');
    return {
        ...avatar,
        skinTone: 'fair',
        hairStyle: isFemale ? 'long' : 'neat',
        hairColor: 'black',
        gender: isFemale ? 'P' : (avatar.gender || 'L'),
        accessories: ['stethoscope'],
    };
}

function AvatarRenderer({ avatar, size = 80, className = '' }) {
    const normalizedAvatar = useMemo(() => normalizeAvatar(avatar), [avatar]);

    const svgString = useMemo(
        () => generateAvatarSVG(normalizedAvatar),
        [normalizedAvatar?.skinTone, normalizedAvatar?.hairStyle,
         normalizedAvatar?.hairColor, normalizedAvatar?.accessories?.join(',')]
    );

    // Truly no avatar data — emoji fallback
    if (!normalizedAvatar || !svgString) {
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
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
}

export default AvatarRenderer;
