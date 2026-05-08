/**
 * @reflection
 * [IDENTITY]: AvatarRenderer (DiceBear Lorelei Edition)
 * [PURPOSE]: Renders player doctor avatar using DiceBear Lorelei style.
 *            Vanguard SVG engine is frozen in ./avatar/_frozen_vanguard/
 * [STATE]: Active
 * [LAST_UPDATE]: 2026-03-27
 */
/* eslint-disable react-refresh/only-export-components */
import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as lorelei from '@dicebear/lorelei';
import { SKIN_TONES, HAIR_COLORS, HAIR_STYLES_MALE, HAIR_STYLES_FEMALE } from './avatar/constants.js';

// ─── Re-export constants for consumers ───
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

// ─── Avatar Normalization ───
function normalizeAvatar(avatar) {
    if (!avatar) return null;
    if (typeof avatar === 'string') {
        return {
            skinTone: 'fair',
            hairStyle: 'neat',
            hairColor: 'black',
            accessories: ['stethoscope'],
            outfit: 'labCoat',
            gender: 'L',
        };
    }
    return { ...avatar, outfit: avatar.outfit || 'labCoat' };
}

// ─── Map avatar props to a deterministic DiceBear seed ───
function buildSeed(norm) {
    return `primer-${norm.gender}-${norm.skinTone}-${norm.hairStyle}-${norm.hairColor}`;
}

// ─── Main Component ───
export default function AvatarRenderer({ avatar, size = 80, className = '', mood: _mood = 'neutral' }) {
    const norm = useMemo(() => normalizeAvatar(avatar), [avatar]);

    const svgDataUri = useMemo(() => {
        if (!norm) return null;
        try {
            const seed = buildSeed(norm);
            const av = createAvatar(lorelei, {
                seed,
                size: 200,
                // Lorelei-specific options
                backgroundColor: ['transparent'],
            });
            return av.toDataUri();
        } catch (e) {
            console.warn('[AvatarRenderer] DiceBear error:', e);
            return null;
        }
    }, [norm]);

    if (!norm || !svgDataUri) {
        return (
            <span
                className={className}
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {'👨‍⚕️'}
            </span>
        );
    }

    return (
        <div
            className={`relative flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={svgDataUri}
                alt="Avatar"
                width={size}
                height={size}
                className="rounded-xl drop-shadow-lg"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
    );
}
