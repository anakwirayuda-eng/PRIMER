/**
 * @reflection
 * [IDENTITY]: FacilityData
 * [PURPOSE]: Static data for Puskesmas facilities/rooms and their styling.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-17
 */

export const ROOMS = [
    { id: 'poli_umum', name: 'Poli Umum', level: 3, maxLevel: 5, cost: 5000000, icon: '🏥', effect: 'Kapasitas +5 pasien/hari', accent: 'emerald' },
    { id: 'poli_gigi', name: 'Poli Gigi', level: 1, maxLevel: 3, cost: 10000000, icon: '🦷', effect: 'Unlock dental treatments', accent: 'cyan' },
    { id: 'poli_kia_kb', name: 'Poli KIA-KB', level: 2, maxLevel: 3, cost: 8000000, icon: '👶', effect: '+10% maternal care score', accent: 'pink' },
    { id: 'lab', name: 'Laboratorium', level: 0, maxLevel: 3, cost: 25000000, icon: '🔬', effect: 'Unlock lab tests', accent: 'violet', locked: true },
    { id: 'apotek', name: 'Apotek', level: 2, maxLevel: 4, cost: 3000000, icon: '💊', effect: 'Faster dispensing', accent: 'amber' },
    { id: 'igd', name: 'Ruang UGD', level: 1, maxLevel: 3, cost: 15000000, icon: '🚑', effect: '+1 emergency bed', accent: 'rose' },
    { id: 'rawat_inap', name: 'Rawat Inap', level: 0, maxLevel: 2, cost: 50000000, icon: '🛏️', effect: 'Overnight stays', accent: 'blue', locked: true },
    { id: 'gudang', name: 'Gudang Obat', level: 1, maxLevel: 3, cost: 5000000, icon: '📦', effect: '+100 inventory slots', accent: 'slate' },
];

export const ACCENT_MAP = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'bg-emerald-500/5', bar: 'from-emerald-400 to-teal-400', ring: 'ring-emerald-500/30' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'bg-cyan-500/5', bar: 'from-cyan-400 to-blue-400', ring: 'ring-cyan-500/30' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', glow: 'bg-pink-500/5', bar: 'from-pink-400 to-rose-400', ring: 'ring-pink-500/30' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'bg-violet-500/5', bar: 'from-violet-400 to-purple-400', ring: 'ring-violet-500/30' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'bg-amber-500/5', bar: 'from-amber-400 to-yellow-400', ring: 'ring-amber-500/30' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', glow: 'bg-rose-500/5', bar: 'from-rose-400 to-red-400', ring: 'ring-rose-500/30' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'bg-blue-500/5', bar: 'from-blue-400 to-indigo-400', ring: 'ring-blue-500/30' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', glow: 'bg-slate-500/5', bar: 'from-slate-400 to-gray-400', ring: 'ring-slate-500/30' },
};
