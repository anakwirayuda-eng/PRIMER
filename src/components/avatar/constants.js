/**
 * Avatar System Constants
 * All color palettes, hairstyle enums, outfit tiers, and accessory definitions.
 */

// ─── Skin Tones (medically representative range) ───
export const SKIN_TONES = {
    light:  { hex: '#FDEBD0', label: 'Terang' },
    fair:   { hex: '#F5CBA7', label: 'Kuning Langsat' },
    medium: { hex: '#D4A574', label: 'Sawo Matang' },
    tan:    { hex: '#C68642', label: 'Cokelat' },
    brown:  { hex: '#8D5524', label: 'Cokelat Tua' },
    dark:   { hex: '#5C3A1E', label: 'Gelap' },
};

// ─── Hair Colors ───
export const HAIR_COLORS = {
    black:     { hex: '#1a1a2e', label: 'Hitam' },
    darkBrown: { hex: '#3d2b1f', label: 'Cokelat Tua' },
    brown:     { hex: '#6b4226', label: 'Cokelat' },
    auburn:    { hex: '#922724', label: 'Merah Tua' },
    gray:      { hex: '#9e9e9e', label: 'Abu-abu' },
    white:     { hex: '#e0e0e0', label: 'Putih' },
};

// ─── Hair Styles (key → label, grouped by typical gender) ───
export const HAIR_STYLES_MALE = [
    { id: 'buzz',   label: 'Cepak' },
    { id: 'short',  label: 'Pendek' },
    { id: 'neat',   label: 'Rapi' },
    { id: 'parted', label: 'Belah Sisi' },
];

export const HAIR_STYLES_FEMALE = [
    { id: 'short',    label: 'Pendek' },
    { id: 'neat',     label: 'Rapi' },
    { id: 'long',     label: 'Panjang' },
    { id: 'ponytail', label: 'Kuncir' },
    { id: 'bun',      label: 'Sanggul' },
    { id: 'hijab',    label: 'Hijab' },
];

// ─── Outfits (progression tiers) ───
export const OUTFITS = {
    casual:  { label: 'Kemeja Rapi', tier: 0, locked: false },
    scrubs:  { label: 'Baju Jaga (Scrubs)', tier: 1, locked: true, unlockHint: 'Selesaikan 3 kasus IGD' },
    labCoat: { label: 'Jas Lab (Snelli)', tier: 2, locked: true, unlockHint: 'Capai reputasi 80+' },
};

// ─── Accessories ───
export const ACCESSORIES = {
    glasses:     { label: 'Kacamata', icon: '👓' },
    stethoscope: { label: 'Stetoskop', icon: '🩺' },
};

// ─── Eye Styles ───
export const EYE_STYLES = {
    default:  { label: 'Normal' },
    serious:  { label: 'Serius' },
    friendly: { label: 'Ramah' },
};
