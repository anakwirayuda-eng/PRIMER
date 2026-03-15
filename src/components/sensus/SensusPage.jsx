/**
 * @reflection
 * [IDENTITY]: SensusPage
 * [PURPOSE]: Census/demography view accessible from Kantor Desa building.
 *            Designed with authentic Indonesian Kartu Keluarga (KK) aesthetic.
 *            Shows government perspective: KK data, RT/RW distribution,
 *            SDOH summary, JKN status, occupation stats, age pyramid.
 *            Complements ArsipPage (medical view) with administrative view.
 * [STATE]: Experimental
 * [ANCHOR]: SensusPage
 * [DEPENDS_ON]: VillageRegistry, VillagerAvatar
 */

import React, { useState, useMemo } from 'react';
import { VILLAGE_FAMILIES, FAMILY_SDOH, FAMILY_INDICATORS, VILLAGE_STATS } from '../../domains/village/VillageRegistry.js';
import VillagerAvatar from '../VillagerAvatar.jsx';
import { useGame } from '../../context/GameContext.jsx';
import {
    Users, Home, MapPin, Shield, Heart, Search, ChevronDown, ChevronUp,
    TrendingUp, Baby, Briefcase, X, FileText, Droplets, Flame, Building2,
    GraduationCap, Utensils
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// GARUDA SVG — Simplified emblem for document headers
// ═══════════════════════════════════════════════════════════════

function GarudaEmblem({ size = 48 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield body */}
            <path d="M32 8L12 20V38C12 50 32 58 32 58C32 58 52 50 52 38V20L32 8Z" fill="#C5A84B" stroke="#8B7635" strokeWidth="1.5" />
            {/* Inner shield */}
            <path d="M32 14L18 23V36C18 45 32 52 32 52C32 52 46 45 46 36V23L32 14Z" fill="#CD0000" />
            {/* Star */}
            <path d="M32 22L34.5 28.5H41L35.5 32.5L37.5 39L32 35L26.5 39L28.5 32.5L23 28.5H29.5L32 22Z" fill="#FFD700" />
            {/* Horizontal band */}
            <rect x="22" y="34" width="20" height="3" rx="1" fill="white" />
            {/* Wings left */}
            <path d="M12 20C8 18 5 15 4 12" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 22C9 20 5 18 3 16" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 25C10 24 6 22 4 20" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            {/* Wings right */}
            <path d="M52 20C56 18 59 15 60 12" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 22C55 20 59 18 61 16" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M49 25C54 24 58 22 60 20" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════
// STATS HELPERS
// ═══════════════════════════════════════════════════════════════

function calculateDemographics(families) {
    const allMembers = families.flatMap(f => f.members || []);
    const total = allMembers.length;
    const male = allMembers.filter(m => m.gender === 'L').length;
    const female = total - male;

    const ageGroups = { balita: 0, anak: 0, remaja: 0, dewasa: 0, lansia: 0 };
    allMembers.forEach(m => {
        const age = m.age || 0;
        if (age <= 5) ageGroups.balita++;
        else if (age <= 12) ageGroups.anak++;
        else if (age <= 17) ageGroups.remaja++;
        else if (age <= 59) ageGroups.dewasa++;
        else ageGroups.lansia++;
    });

    const occupations = {};
    allMembers.forEach(m => {
        const occ = m.occupation || 'Tidak diketahui';
        occupations[occ] = (occupations[occ] || 0) + 1;
    });

    const rtDistribution = {};
    families.forEach(f => {
        const rt = f.rt || 'N/A';
        if (!rtDistribution[rt]) rtDistribution[rt] = { families: 0, members: 0 };
        rtDistribution[rt].families++;
        rtDistribution[rt].members += (f.members || []).length;
    });

    return { total, male, female, ageGroups, occupations, rtDistribution };
}

function calculateSDOHSummary(families) {
    let jknCount = 0;
    let totalFamilies = families.length;
    const incomeDistribution = { rendah: 0, menengah: 0, tinggi: 0 };
    const waterSources = {};
    const toiletTypes = {};

    families.forEach(f => {
        const indicators = f.indicators || FAMILY_INDICATORS[f.id] || {};
        const sdoh = f.sdoh || FAMILY_SDOH[f.id] || {};

        if (indicators.jkn) jknCount++;

        const economy = sdoh.economy || 'Middle';
        if (economy === 'Low' || economy === 'Very Low') incomeDistribution.rendah++;
        else if (economy === 'High') incomeDistribution.tinggi++;
        else incomeDistribution.menengah++;

        const water = sdoh.water || 'Sumur';
        waterSources[water] = (waterSources[water] || 0) + 1;

        const toilet = sdoh.sanitation || 'Tidak diketahui';
        toiletTypes[toilet] = (toiletTypes[toilet] || 0) + 1;
    });

    return {
        jknCoverage: Math.round((jknCount / totalFamilies) * 100),
        jknCount,
        totalFamilies,
        incomeDistribution,
        waterSources,
        toiletTypes
    };
}

function getFamilyIndicators(family) {
    return family?.indicators || FAMILY_INDICATORS[family?.id] || {};
}

function getFamilySDOH(family) {
    return family?.sdoh || FAMILY_SDOH[family?.id] || {};
}

// Role label mapping to Indonesian KK format
const ROLE_LABELS = {
    head: 'Kepala Keluarga',
    spouse: 'Istri',
    child: 'Anak',
    elder: 'Orang Tua',
    relative: 'Kerabat',
    grandchild: 'Cucu',
};

const EDUCATION_LABELS = {
    'No School': 'Tidak Sekolah',
    'Elementary': 'SD/MI',
    'Junior High': 'SMP/MTs',
    'High School': 'SMA/MA',
    'Vocational': 'SMK',
    'University': 'D3/S1',
    'Islamic Board': 'Pesantren',
};

// ═══════════════════════════════════════════════════════════════
// KARTU KELUARGA - FAMILY DETAIL MODAL
// ═══════════════════════════════════════════════════════════════

function KartuKeluargaModal({ family, onClose }) {
    const sdoh = getFamilySDOH(family);
    const indicators = getFamilyIndicators(family);

    const kkNumber = `33${family.rt || '01'}${family.rw || '01'}0${family.id.replace('kk_', '')}2024`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto custom-scrollbar">
                {/* KK Document */}
                <div
                    className="relative rounded-lg shadow-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF5D6 50%, #FFFBF0 100%)',
                        border: '3px solid #2E7D32',
                        fontFamily: '"Times New Roman", "Noto Serif", serif',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-red-50 rounded-full shadow-md transition-colors border border-slate-200"
                        aria-label="Tutup Kartu Keluarga"
                    >
                        <X size={18} className="text-slate-600" />
                    </button>

                    {/* Green header band */}
                    <div
                        className="text-center py-4 px-6 relative"
                        style={{ background: 'linear-gradient(to right, #1B5E20, #2E7D32, #1B5E20)' }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <GarudaEmblem size={52} />
                            <div>
                                <div className="text-yellow-300 text-[10px] font-bold tracking-[0.3em] uppercase">
                                    Republik Indonesia
                                </div>
                                <div className="text-white text-xl font-bold tracking-wider" style={{ fontFamily: '"Times New Roman", serif' }}>
                                    KARTU KELUARGA
                                </div>
                                <div className="text-green-200 text-[10px] tracking-widest mt-0.5">
                                    No. {kkNumber}
                                </div>
                            </div>
                            <GarudaEmblem size={52} />
                        </div>
                    </div>

                    {/* Administrative info row */}
                    <div
                        className="grid grid-cols-4 text-xs border-b-2"
                        style={{ borderColor: '#2E7D32', background: '#F0F7E8' }}
                    >
                        {[
                            { label: 'Nama Kepala Keluarga', value: family.headName || family.surname },
                            { label: 'Alamat', value: `RT ${family.rt || '-'} / RW ${family.rw || '01'}, Desa Sukamaju` },
                            { label: 'Kelurahan/Desa', value: 'Sukamaju' },
                            { label: 'Kecamatan', value: VILLAGE_STATS?.kecamatan || 'Sehat Sentosa' },
                        ].map((item, i) => (
                            <div key={i} className="px-3 py-2 border-r last:border-r-0" style={{ borderColor: '#A5D6A7' }}>
                                <div className="text-[9px] text-green-800 font-semibold uppercase tracking-wider">{item.label}</div>
                                <div className="font-bold text-slate-800 mt-0.5">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Member table — KK format */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#E8F5E9', borderBottom: '2px solid #2E7D32' }}>
                                    {['No', 'Nama Lengkap', 'NIK', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Pendidikan', 'Jenis Pekerjaan', 'Status Hubungan'].map((h, i) => (
                                        <th key={i} className="px-2 py-2.5 text-left font-bold text-green-900 whitespace-nowrap text-[10px] uppercase tracking-wide" style={{ borderRight: '1px solid #C8E6C9' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(family.members || []).map((m, idx) => {
                                    // Generate a deterministic "NIK" from family + member data
                                    const nik = `337${(family.rt || '01').padStart(2, '0')}${m.gender === 'L' ? '0' : '4'}${String(m.age > 9 ? m.age : '0' + m.age)}${String(idx + 1).padStart(4, '0')}`;
                                    const birthYear = new Date().getFullYear() - m.age;
                                    return (
                                        <tr
                                            key={m.id || idx}
                                            className="hover:bg-yellow-50/60 transition-colors"
                                            style={{
                                                borderBottom: '1px solid #C8E6C9',
                                                background: idx % 2 === 0 ? 'transparent' : 'rgba(232, 245, 233, 0.3)'
                                            }}
                                        >
                                            <td className="px-2 py-2 text-center font-bold" style={{ borderRight: '1px solid #E0E0E0' }}>{idx + 1}</td>
                                            <td className="px-2 py-2 font-semibold text-slate-800 whitespace-nowrap" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                <div className="flex items-center gap-2">
                                                    <VillagerAvatar name={m.firstName} age={m.age} gender={m.gender === 'L' ? 'M' : 'F'} size={28} />
                                                    <span>{m.firstName} {family.surname}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 font-mono text-[10px] text-slate-500" style={{ borderRight: '1px solid #E0E0E0' }}>{nik}</td>
                                            <td className="px-2 py-2 text-center" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${m.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                    {m.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>Sukamaju</td>
                                            <td className="px-2 py-2 whitespace-nowrap" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                {`01-01-${birthYear}`}
                                            </td>
                                            <td className="px-2 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>Islam</td>
                                            <td className="px-2 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                {m.age < 7 ? 'Belum Sekolah' : m.age < 13 ? 'SD/MI' : m.age < 16 ? 'SMP/MTs' : m.age < 19 ? 'SMA/MA' : (EDUCATION_LABELS[sdoh.education] || 'SMA/MA')}
                                            </td>
                                            <td className="px-2 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>{m.occupation || '-'}</td>
                                            <td className="px-2 py-2 font-semibold text-green-800">
                                                {ROLE_LABELS[m.role] || m.role || '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Lower document info */}
                    <div className="grid grid-cols-2 gap-0" style={{ borderTop: '2px solid #2E7D32' }}>
                        {/* SDOH Section */}
                        <div className="p-4" style={{ borderRight: '1px solid #C8E6C9', background: '#FAFFF5' }}>
                            <h4 className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Home size={12} /> Data Rumah Tangga
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                {[
                                    { icon: <Building2 size={10} className="text-green-600" />, label: 'Perumahan', value: sdoh.housing || '-' },
                                    { icon: <Droplets size={10} className="text-blue-500" />, label: 'Sumber Air', value: sdoh.water || '-' },
                                    { icon: <Building2 size={10} className="text-amber-600" />, label: 'Sanitasi', value: sdoh.sanitation || '-' },
                                    { icon: <TrendingUp size={10} className="text-emerald-600" />, label: 'Ekonomi', value: sdoh.economy || '-' },
                                    { icon: <GraduationCap size={10} className="text-indigo-500" />, label: 'Pendidikan KK', value: EDUCATION_LABELS[sdoh.education] || sdoh.education || '-' },
                                    { icon: <Utensils size={10} className="text-orange-500" />, label: 'Pola Makan', value: sdoh.diet || '-' },
                                    { icon: <Flame size={10} className="text-red-400" />, label: 'Merokok', value: sdoh.smoking ? '🚬 Ya' : '✅ Tidak' },
                                    { icon: <Heart size={10} className="text-pink-500" />, label: 'Aktivitas', value: sdoh.activity || '-' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5 py-0.5">
                                        {item.icon}
                                        <span className="text-slate-500 w-20 flex-shrink-0">{item.label}:</span>
                                        <span className="font-semibold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* IKS Indicators Section */}
                        <div className="p-4" style={{ background: '#FAFFF5' }}>
                            <h4 className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <TrendingUp size={12} /> Indikator Keluarga Sehat (IKS)
                            </h4>
                            <div className="grid grid-cols-2 gap-1">
                                {[
                                    { key: 'kb', label: 'Keluarga Berencana' },
                                    { key: 'persalinan', label: 'Persalinan Nakes' },
                                    { key: 'imunisasi', label: 'Imunisasi Lengkap' },
                                    { key: 'asi', label: 'ASI Eksklusif' },
                                    { key: 'balita', label: 'Pemantauan Balita' },
                                    { key: 'tb', label: 'Pengobatan TB' },
                                    { key: 'hipertensi', label: 'Penanganan HT' },
                                    { key: 'jiwa', label: 'Kesehatan Jiwa' },
                                    { key: 'rokok', label: 'Tidak Merokok' },
                                    { key: 'jkn', label: 'Peserta JKN' },
                                    { key: 'air', label: 'Akses Air Bersih' },
                                    { key: 'jamban', label: 'Akses Jamban' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-1.5 text-[11px] py-0.5">
                                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${indicators[key] ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
                                            }`}>
                                            {indicators[key] ? '✓' : '✗'}
                                        </span>
                                        <span className={indicators[key] ? 'text-slate-700' : 'text-red-600 font-semibold'}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* IKS Score */}
                            {(() => {
                                const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
                                const healthy = scored.filter(v => v === true).length;
                                const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;
                                const iksColor = iksScore >= 80 ? 'text-green-700 bg-green-100' : iksScore >= 50 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100';
                                return (
                                    <div className={`mt-3 text-center py-2 rounded-lg font-bold text-sm ${iksColor}`}>
                                        Skor IKS: {healthy}/{scored.length} ({iksScore}%) — {iksScore >= 80 ? 'SEHAT' : iksScore >= 50 ? 'PRA SEHAT' : 'TIDAK SEHAT'}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Biography / Notes */}
                    {family.biography && (
                        <div className="px-4 py-3" style={{ borderTop: '1px solid #C8E6C9', background: '#FFFFF0' }}>
                            <div className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Catatan Desa</div>
                            <p className="text-xs text-slate-600 italic leading-relaxed">📖 {family.biography}</p>
                        </div>
                    )}

                    {/* Footer stamp */}
                    <div
                        className="flex items-center justify-between px-4 py-3 text-[10px]"
                        style={{ background: '#E8F5E9', borderTop: '2px solid #2E7D32' }}
                    >
                        <span className="text-green-700 font-semibold">Desa Sukamaju, Kec. Sehat Sentosa</span>
                        <span className="text-green-600 italic">Dicetak dari Sistem Informasi Kependudukan Desa</span>
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50">
                                <span className="text-[8px] font-bold text-green-700">CAP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// AGE PYRAMID COMPONENT
// ═══════════════════════════════════════════════════════════════

function AgePyramid({ ageGroups }) {
    const labels = [
        { key: 'lansia', label: '60+', emoji: '👴' },
        { key: 'dewasa', label: '18-59', emoji: '🧑' },
        { key: 'remaja', label: '13-17', emoji: '👦' },
        { key: 'anak', label: '6-12', emoji: '🧒' },
        { key: 'balita', label: '0-5', emoji: '👶' },
    ];
    const max = Math.max(...Object.values(ageGroups), 1);

    return (
        <div className="space-y-1.5">
            {labels.map(({ key, label, emoji }) => (
                <div key={key} className="flex items-center gap-2">
                    <span className="text-xs w-6 text-center">{emoji}</span>
                    <span className="text-[10px] font-medium text-slate-500 w-10">{label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                            style={{ width: `${(ageGroups[key] / max) * 100}%` }}
                        >
                            <span className="text-[9px] font-bold text-white">{ageGroups[key]}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// KK CARD PREVIEW — Used in the family grid
// ═══════════════════════════════════════════════════════════════

function KKCardPreview({ family, indicators, onClick }) {
    const kepala = (family.members || []).find(m => m.role === 'head') || family.members?.[0] || {};
    const memberCount = (family.members || []).length;

    // Calculate IKS
    const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
    const healthy = scored.filter(v => v === true).length;
    const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;

    return (
        <div
            className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            onClick={onClick}
        >
            <div
                className="rounded-lg overflow-hidden shadow-sm"
                style={{
                    border: '2px solid #2E7D32',
                    background: 'linear-gradient(135deg, #FFF8E7, #FFFBF0)',
                    fontFamily: '"Times New Roman", "Noto Serif", serif',
                }}
            >
                {/* Green top band */}
                <div className="px-3 py-1.5 flex items-center justify-between"
                    style={{ background: 'linear-gradient(to right, #1B5E20, #2E7D32)' }}
                >
                    <div className="flex items-center gap-1.5">
                        <GarudaEmblem size={16} />
                        <span className="text-yellow-200 text-[8px] font-bold tracking-widest uppercase">Kartu Keluarga</span>
                    </div>
                    <span className="text-green-200 text-[7px] font-mono">
                        {family.id.toUpperCase()}
                    </span>
                </div>

                {/* Body */}
                <div className="p-3">
                    <div className="flex items-start gap-3">
                        <VillagerAvatar
                            name={kepala.firstName || family.headName}
                            age={kepala.age || 40}
                            gender={kepala.gender === 'L' ? 'M' : 'F'}
                            size={44}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-800 truncate leading-tight">
                                Kel. {family.surname}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                KK: {family.headName || kepala.firstName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-semibold border border-green-200">
                                    RT {family.rt || '-'}/RW {family.rw || '01'}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold">
                                    <Users size={9} className="inline mr-0.5" />{memberCount} jiwa
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Member strip */}
                    <div className="flex items-center gap-0.5 mt-2 pt-2" style={{ borderTop: '1px solid #C8E6C9' }}>
                        {(family.members || []).slice(0, 6).map((m, i) => (
                            <VillagerAvatar
                                key={m.id || i}
                                name={m.firstName}
                                age={m.age}
                                gender={m.gender === 'L' ? 'M' : 'F'}
                                size={22}
                            />
                        ))}
                        {(family.members || []).length > 6 && (
                            <span className="text-[8px] text-slate-400 ml-1">+{family.members.length - 6}</span>
                        )}

                        <div className="ml-auto flex items-center gap-1">
                            {indicators.jkn ? (
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold border border-green-200">JKN ✓</span>
                            ) : (
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-bold border border-red-200">No JKN</span>
                            )}
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${iksScore >= 80 ? 'bg-green-100 text-green-700 border-green-200' :
                                    iksScore >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        'bg-red-100 text-red-600 border-red-200'
                                }`}>
                                IKS {iksScore}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN SENSUS PAGE
// ═══════════════════════════════════════════════════════════════

export default function SensusPage() {
    const { villageData } = useGame();
    const [search, setSearch] = useState('');
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [filterRT, setFilterRT] = useState('all');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const families = useMemo(() => (
        Array.isArray(villageData?.families) && villageData.families.length > 0
            ? villageData.families
            : VILLAGE_FAMILIES
    ), [villageData]);

    const demographics = useMemo(() => calculateDemographics(families), [families]);
    const sdohSummary = useMemo(() => calculateSDOHSummary(families), [families]);

    const rtList = useMemo(() => {
        return [...new Set(families.map(f => f.rt || 'N/A'))].sort();
    }, [families]);

    const filteredFamilies = useMemo(() => {
        let list = [...families];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(f =>
                f.id.toLowerCase().includes(q) ||
                (f.surname || '').toLowerCase().includes(q) ||
                (f.headName || '').toLowerCase().includes(q) ||
                (f.members || []).some(m => (m.firstName || '').toLowerCase().includes(q))
            );
        }

        if (filterRT !== 'all') {
            list = list.filter(f => (f.rt || 'N/A') === filterRT);
        }

        return list;
    }, [families, search, filterRT]);

    const topOccupations = useMemo(() => {
        return Object.entries(demographics.occupations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
    }, [demographics]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar" style={{ background: 'linear-gradient(135deg, #F5F0E0 0%, #EBE5D3 50%, #F0EDE0 100%)' }}>
            <div className="max-w-7xl mx-auto p-6 space-y-5">

                {/* Government Document Header */}
                <div
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{ border: '2px solid #2E7D32' }}
                >
                    <div
                        className="text-center py-5 relative"
                        style={{ background: 'linear-gradient(to right, #1B5E20, #2E7D32, #1B5E20)' }}
                    >
                        <div className="flex items-center justify-center gap-5">
                            <GarudaEmblem size={56} />
                            <div>
                                <div className="text-yellow-300 text-[10px] font-bold tracking-[0.4em] uppercase">
                                    Pemerintah Desa Sukamaju • Kecamatan Sehat Sentosa
                                </div>
                                <h1 className="text-white text-2xl font-bold tracking-wider mt-1" style={{ fontFamily: '"Times New Roman", serif' }}>
                                    DATA KEPENDUDUKAN DESA
                                </h1>
                                <div className="text-green-200 text-[10px] tracking-widest mt-1">
                                    Kantor Desa — Sensus Penduduk — Perspektif Pemerintah
                                </div>
                            </div>
                            <GarudaEmblem size={56} />
                        </div>
                    </div>

                    {/* Overview Stats Row */}
                    <div className="grid grid-cols-6 divide-x" style={{ background: '#F0F7E8', borderTop: '2px solid #2E7D32', divideColor: '#C8E6C9' }}>
                        {[
                            { icon: Users, label: 'Jumlah Jiwa', value: demographics.total, sub: `${demographics.male}L / ${demographics.female}P` },
                            { icon: Home, label: 'Kepala Keluarga', value: families.length, sub: 'KK terdaftar' },
                            { icon: MapPin, label: 'Wilayah RT', value: rtList.length, sub: 'RT administratif' },
                            { icon: Shield, label: 'JKN/BPJS', value: `${sdohSummary.jknCoverage}%`, sub: `${sdohSummary.jknCount}/${sdohSummary.totalFamilies} KK` },
                            { icon: Baby, label: 'Balita', value: demographics.ageGroups.balita, sub: 'Usia 0-5 tahun' },
                            { icon: Briefcase, label: 'Lansia', value: demographics.ageGroups.lansia, sub: 'Usia 60+ tahun' },
                        ].map(({ icon, label, value, sub }, i) => (
                            <div key={i} className="px-3 py-3 text-center">
                                {React.createElement(icon, { size: 16, className: 'text-green-600 mx-auto mb-1' })}
                                <div className="text-[9px] text-green-700 font-bold uppercase tracking-wider">{label}</div>
                                <div className="text-xl font-black text-slate-800 leading-tight" style={{ fontFamily: '"Times New Roman", serif' }}>{value}</div>
                                <div className="text-[9px] text-slate-500">{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Section: Age Pyramid + SDOH + Occupations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Age Pyramid */}
                    <div className="rounded-xl p-4 shadow-sm" style={{ background: '#FFFBF0', border: '1px solid #C8E6C9' }}>
                        <h3 className="font-bold text-sm text-green-800 mb-3 flex items-center gap-2" style={{ fontFamily: '"Times New Roman", serif' }}>
                            📊 Piramida Penduduk
                        </h3>
                        <AgePyramid ageGroups={demographics.ageGroups} />
                    </div>

                    {/* SDOH Summary */}
                    <div className="rounded-xl p-4 shadow-sm" style={{ background: '#FFFBF0', border: '1px solid #C8E6C9' }}>
                        <h3 className="font-bold text-sm text-green-800 mb-3 flex items-center gap-2" style={{ fontFamily: '"Times New Roman", serif' }}>
                            🏠 Kondisi Lingkungan
                        </h3>
                        <div className="space-y-2.5">
                            <div>
                                <div className="text-[10px] font-bold text-green-700 uppercase">Sumber Air</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {Object.entries(sdohSummary.waterSources).map(([source, count]) => (
                                        <span key={source} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                                            {source}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-green-700 uppercase">Sanitasi</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {Object.entries(sdohSummary.toiletTypes).map(([type, count]) => (
                                        <span key={type} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium border border-amber-200">
                                            {type}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-green-700 uppercase">Tingkat Ekonomi</div>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-xs">📉 Rendah: <b>{sdohSummary.incomeDistribution.rendah}</b></span>
                                    <span className="text-xs">📊 Menengah: <b>{sdohSummary.incomeDistribution.menengah}</b></span>
                                    <span className="text-xs">📈 Tinggi: <b>{sdohSummary.incomeDistribution.tinggi}</b></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Occupations */}
                    <div className="rounded-xl p-4 shadow-sm" style={{ background: '#FFFBF0', border: '1px solid #C8E6C9' }}>
                        <h3 className="font-bold text-sm text-green-800 mb-3 flex items-center gap-2" style={{ fontFamily: '"Times New Roman", serif' }}>
                            💼 Mata Pencaharian
                        </h3>
                        <div className="space-y-1.5">
                            {topOccupations.map(([occ, count], i) => (
                                <div key={occ} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-4">{i + 1}.</span>
                                    <div className="flex-1 text-xs text-slate-600 truncate">{occ}</div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-16 bg-green-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(count / demographics.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 w-6 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Family Registry */}
                <div className="rounded-xl shadow-sm overflow-hidden" style={{ border: '2px solid #2E7D32', background: '#FFFBF0' }}>
                    {/* Registry Header */}
                    <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ background: '#E8F5E9', borderBottom: '2px solid #2E7D32' }}>
                        <h3 className="font-bold text-green-800 flex items-center gap-2" style={{ fontFamily: '"Times New Roman", serif' }}>
                            <FileText size={16} /> Daftar Kartu Keluarga
                        </h3>

                        <div className="flex items-center gap-3">
                            {/* View toggle */}
                            <div className="flex bg-white rounded-lg border border-green-300 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`px-3 py-1.5 text-[10px] font-bold transition-colors ${viewMode === 'cards' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'}`}
                                >
                                    KARTU
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1.5 text-[10px] font-bold transition-colors ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-green-700 hover:bg-green-50'}`}
                                >
                                    TABEL
                                </button>
                            </div>

                            {/* RT filter */}
                            <select
                                value={filterRT}
                                onChange={e => setFilterRT(e.target.value)}
                                className="text-xs border border-green-300 rounded-lg px-2 py-1.5 focus:ring-green-500 focus:border-green-500"
                                style={{ background: '#FFFBF0' }}
                            >
                                <option value="all">Semua RT</option>
                                {rtList.map(rt => (
                                    <option key={rt} value={rt}>RT {rt}</option>
                                ))}
                            </select>

                            {/* Search */}
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type="text"
                                    placeholder="Cari nama/KK..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="text-xs border border-green-300 rounded-lg pl-8 pr-3 py-1.5 w-48 focus:ring-green-500 focus:border-green-500"
                                    style={{ background: '#FFFBF0' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card Grid View */}
                    {viewMode === 'cards' ? (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredFamilies.map(family => (
                                <KKCardPreview
                                    key={family.id}
                                    family={family}
                                    indicators={getFamilyIndicators(family)}
                                    onClick={() => setSelectedFamily(family)}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Table View */
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ fontFamily: '"Times New Roman", serif' }}>
                                <thead>
                                    <tr style={{ background: '#E8F5E9', borderBottom: '2px solid #2E7D32' }}>
                                        {['No', 'No. KK', 'Kepala Keluarga', 'RT/RW', 'Anggota', 'JKN', 'IKS', ''].map((h, i) => (
                                            <th key={i} className="px-3 py-2.5 text-left text-[10px] font-bold text-green-900 uppercase tracking-wider" style={{ borderRight: '1px solid #C8E6C9' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFamilies.map((family, idx) => {
                                        const indicators = getFamilyIndicators(family);
                                        const kepala = (family.members || []).find(m => m.role === 'head') || family.members?.[0] || {};
                                        const memberCount = (family.members || []).length;
                                        const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
                                        const healthy = scored.filter(v => v === true).length;
                                        const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;

                                        return (
                                            <tr
                                                key={family.id}
                                                className="hover:bg-yellow-50/60 transition-colors cursor-pointer"
                                                onClick={() => setSelectedFamily(family)}
                                                style={{
                                                    borderBottom: '1px solid #C8E6C9',
                                                    background: idx % 2 === 0 ? 'transparent' : 'rgba(232, 245, 233, 0.2)'
                                                }}
                                            >
                                                <td className="px-3 py-2 text-center text-xs font-bold" style={{ borderRight: '1px solid #E0E0E0' }}>{idx + 1}</td>
                                                <td className="px-3 py-2 text-xs font-mono text-slate-500" style={{ borderRight: '1px solid #E0E0E0' }}>{family.id}</td>
                                                <td className="px-3 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                    <div className="flex items-center gap-2">
                                                        <VillagerAvatar name={kepala.firstName || family.headName} age={kepala.age || 40} gender={kepala.gender === 'L' ? 'M' : 'F'} size={30} />
                                                        <div>
                                                            <div className="font-semibold text-sm text-slate-800">{family.surname}</div>
                                                            <div className="text-[10px] text-slate-400">{kepala.occupation || '-'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                    <span className="text-xs font-semibold">RT {family.rt || '-'} / RW {family.rw || '01'}</span>
                                                </td>
                                                <td className="px-3 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                    <span className="text-sm font-bold">{memberCount}</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">jiwa</span>
                                                </td>
                                                <td className="px-3 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${indicators.jkn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {indicators.jkn ? '✓ Aktif' : '✗ Belum'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2" style={{ borderRight: '1px solid #E0E0E0' }}>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${iksScore >= 80 ? 'bg-green-100 text-green-700' :
                                                            iksScore >= 50 ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-600'
                                                        }`}>
                                                        {iksScore}%
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className="text-[10px] text-green-600 font-bold hover:text-green-800">Buka KK →</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: '#E8F5E9', borderTop: '1px solid #C8E6C9' }}>
                        <span className="text-xs text-green-700 font-semibold">
                            Menampilkan {filteredFamilies.length} dari {families.length} KK
                        </span>
                        <span className="text-[10px] text-green-600 italic">
                            Sumber: Sistem Informasi Kependudukan Desa Sukamaju
                        </span>
                    </div>
                </div>
            </div>

            {/* KK Detail Modal */}
            {selectedFamily && (
                <KartuKeluargaModal
                    family={selectedFamily}
                    onClose={() => setSelectedFamily(null)}
                />
            )}
        </div>
    );
}
