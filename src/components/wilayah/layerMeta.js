/**
 * @reflection
 * [IDENTITY]: layerMeta
 * [PURPOSE]: Shared source of truth for Wilayah overlay-layer language.
 *            Keeps HUD labels, map legend copy, and visual tone in sync.
 * [STATE]: Runtime-Audited
 * [ANCHOR]: WILAYAH_LAYER_META, WILAYAH_LAYER_ORDER
 */

import { localizeWilayahLayerMeta } from './contentI18n.js';

export const WILAYAH_LAYER_ORDER = [
    'general',
    'pispk',
    'surveillance',
    'psn',
    'phbs',
    'perilaku',
];

export const WILAYAH_LAYER_META = {
    general: {
        label: 'Infrastruktur',
        subtitle: 'Topologi desa, blank spot RW, anchor layanan, dan status jembatan.',
        tooltip: 'Mode kanonik 2D: topologi desa, RW blank spot, intel, kader lokal, anchor layanan, dan status jembatan.',
        activeBg: 'rgba(15,23,42,0.82)',
        activeBorder: 'rgba(148,163,184,0.28)',
        activeText: 'rgba(248,250,252,0.96)',
        accent: 'rgba(203,213,225,0.96)',
        vignette: 'rgba(148,163,184,0.05)',
        chipBg: 'rgba(15,23,42,0.78)',
        chipBorder: 'rgba(148,163,184,0.35)',
        chipText: 'rgba(226,232,240,0.95)',
        showServiceCoverage: false,
        showServiceLabels: false,
        serviceRingOpacity: 0,
        legendItems: [
            { label: 'RW & Blank Spot', dot: 'rgba(251,191,36,0.92)', text: 'rgba(254,243,199,0.96)' },
            { label: 'Anchor Layanan', dot: 'rgba(56,189,248,0.92)', text: 'rgba(224,242,254,0.96)' },
            { label: 'Intel / Kader', dot: 'rgba(34,211,238,0.92)', text: 'rgba(207,250,254,0.96)' },
        ]
    },
    pispk: {
        label: 'PIS-PK',
        subtitle: 'IKS keluarga, rumah prioritas, dan ring cakupan layanan primer.',
        tooltip: 'Lacak IKS keluarga, rumah prioritas, dan jangkauan layanan primer dari anchor utama.',
        activeBg: 'rgba(8,47,73,0.82)',
        activeBorder: 'rgba(56,189,248,0.28)',
        activeText: 'rgba(224,242,254,0.96)',
        accent: 'rgba(56,189,248,0.96)',
        vignette: 'rgba(56,189,248,0.065)',
        chipBg: 'rgba(8,47,73,0.84)',
        chipBorder: 'rgba(56,189,248,0.35)',
        chipText: 'rgba(224,242,254,0.96)',
        showServiceCoverage: true,
        showServiceLabels: true,
        serviceRingOpacity: 0.74,
        legendItems: [
            { label: 'Sehat', dot: '#34d399', text: 'rgba(167,243,208,0.96)' },
            { label: 'Waspada', dot: '#fbbf24', text: 'rgba(254,240,138,0.96)' },
            { label: 'Risiko', dot: '#f87171', text: 'rgba(254,226,226,0.96)' },
            { label: 'Ring Layanan', dot: 'rgba(56,189,248,0.92)', text: 'rgba(224,242,254,0.96)' },
        ]
    },
    surveillance: {
        label: 'Surveilans',
        subtitle: 'Kasus aktif, klaster outbreak, dan rumah prioritas tracing.',
        tooltip: 'Sorot kasus aktif, klaster outbreak, dan rumah prioritas tracing 14 hari terakhir.',
        activeBg: 'rgba(76,5,25,0.82)',
        activeBorder: 'rgba(251,113,133,0.28)',
        activeText: 'rgba(255,228,230,0.96)',
        accent: 'rgba(251,113,133,0.96)',
        vignette: 'rgba(225,29,72,0.085)',
        chipBg: 'rgba(76,5,25,0.84)',
        chipBorder: 'rgba(251,113,133,0.35)',
        chipText: 'rgba(255,228,230,0.96)',
        showServiceCoverage: true,
        showServiceLabels: true,
        serviceRingOpacity: 0.58,
        legendItems: [
            { label: 'Kasus Aktif', dot: '#ef4444', text: 'rgba(254,226,226,0.96)' },
            { label: 'Klaster / Outbreak', dot: 'rgba(251,113,133,0.92)', text: 'rgba(255,228,230,0.96)' },
            { label: 'Prioritas Tracing', dot: 'rgba(248,113,113,0.92)', text: 'rgba(255,228,230,0.96)' },
        ]
    },
    psn: {
        label: 'Jentik',
        subtitle: 'Titik breeding, rumah berisiko, dan prioritas PSN.',
        tooltip: 'Cari breeding cue, rumah dengan jentik, dan titik yang perlu PSN atau kerja bakti.',
        activeBg: 'rgba(54,83,20,0.82)',
        activeBorder: 'rgba(163,230,53,0.28)',
        activeText: 'rgba(247,254,231,0.96)',
        accent: 'rgba(163,230,53,0.96)',
        vignette: 'rgba(163,230,53,0.06)',
        chipBg: 'rgba(54,83,20,0.84)',
        chipBorder: 'rgba(163,230,53,0.35)',
        chipText: 'rgba(247,254,231,0.96)',
        showServiceCoverage: false,
        showServiceLabels: false,
        serviceRingOpacity: 0,
        legendItems: [
            { label: 'Aman', dot: '#a3e635', text: 'rgba(236,252,203,0.96)' },
            { label: 'Breeding Risk', dot: '#f97316', text: 'rgba(255,237,213,0.96)' },
            { label: 'Jentik Aktif', dot: '#ef4444', text: 'rgba(254,226,226,0.96)' },
        ]
    },
    phbs: {
        label: 'PHBS',
        subtitle: 'Mutu PHBS rumah tangga dan wilayah yang butuh edukasi dasar.',
        tooltip: 'Baca mutu PHBS rumah tangga dan sebaran wilayah yang butuh edukasi dasar.',
        activeBg: 'rgba(80,7,36,0.82)',
        activeBorder: 'rgba(244,114,182,0.28)',
        activeText: 'rgba(252,231,243,0.96)',
        accent: 'rgba(244,114,182,0.96)',
        vignette: 'rgba(244,114,182,0.06)',
        chipBg: 'rgba(80,7,36,0.84)',
        chipBorder: 'rgba(244,114,182,0.35)',
        chipText: 'rgba(252,231,243,0.96)',
        showServiceCoverage: true,
        showServiceLabels: true,
        serviceRingOpacity: 0.7,
        legendItems: [
            { label: '7-10 Baik', dot: '#34d399', text: 'rgba(167,243,208,0.96)' },
            { label: '4-6 Sedang', dot: '#fbbf24', text: 'rgba(254,240,138,0.96)' },
            { label: '0-3 Buruk', dot: '#ef4444', text: 'rgba(254,226,226,0.96)' },
            { label: 'Ring Edukasi', dot: 'rgba(244,114,182,0.92)', text: 'rgba(252,231,243,0.96)' },
        ]
    },
    perilaku: {
        label: 'Perilaku',
        subtitle: 'Barrier perilaku, kesiapan intervensi, dan fokus BCC lapangan.',
        tooltip: 'Sorot rumah dengan barrier perilaku tinggi dan kesiapan intervensi perubahan perilaku.',
        activeBg: 'rgba(30,27,75,0.82)',
        activeBorder: 'rgba(129,140,248,0.28)',
        activeText: 'rgba(224,231,255,0.96)',
        accent: 'rgba(129,140,248,0.96)',
        vignette: 'rgba(129,140,248,0.06)',
        chipBg: 'rgba(30,27,75,0.84)',
        chipBorder: 'rgba(129,140,248,0.35)',
        chipText: 'rgba(224,231,255,0.96)',
        showServiceCoverage: true,
        showServiceLabels: true,
        serviceRingOpacity: 0.68,
        legendItems: [
            { label: 'Risiko Tinggi', dot: '#ef4444', text: 'rgba(254,226,226,0.96)' },
            { label: 'Risiko Sedang', dot: '#f97316', text: 'rgba(255,237,213,0.96)' },
            { label: 'Rendah / Siap', dot: '#34d399', text: 'rgba(167,243,208,0.96)' },
            { label: 'Ring Intervensi', dot: 'rgba(129,140,248,0.92)', text: 'rgba(224,231,255,0.96)' },
        ]
    }
};

export function getWilayahLayerMeta(layerId, t = null) {
    const meta = WILAYAH_LAYER_META[layerId] || WILAYAH_LAYER_META.general;
    return t ? localizeWilayahLayerMeta(layerId, meta, t) : meta;
}
