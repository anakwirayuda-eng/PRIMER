/**
 * @reflection
 * [IDENTITY]: SensusPage
 * [PURPOSE]: Census/demography view accessible from Kantor Desa building.
 *            Designed with authentic Indonesian Kartu Keluarga (KK) aesthetic.
 *            Shows government perspective: KK data, RT/RW distribution,
 *            SDOH summary, JKN status, occupation stats, age pyramid.
 *            Complements ArsipPage (medical view) with administrative view.
 * [STATE]: Polished & Immersive UI/UX
 * [ANCHOR]: SensusPage
 * [DEPENDS_ON]: VillageRegistry, VillagerAvatar
 */

import React, { useState, useMemo } from 'react';
import { VILLAGE_FAMILIES, FAMILY_SDOH, FAMILY_INDICATORS, VILLAGE_STATS } from '../../domains/village/VillageRegistry.js';
import VillagerAvatar from '../VillagerAvatar.jsx';
import { useGame } from '../../context/GameContext.jsx';
import {
    Users, Home, MapPin, Shield, Heart, Search,
    TrendingUp, Baby, Briefcase, X, FileText, Droplets, Flame, Building2,
    Lock, Printer, SearchX
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// GARUDA SVG — Simplified emblem for document headers
// ═══════════════════════════════════════════════════════════════
function GarudaEmblem({ size = 48, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M32 8L12 20V38C12 50 32 58 32 58C32 58 52 50 52 38V20L32 8Z" fill="#C5A84B" stroke="#8B7635" strokeWidth="1.5" />
            <path d="M32 14L18 23V36C18 45 32 52 32 52C32 52 46 45 46 36V23L32 14Z" fill="#CD0000" />
            <path d="M32 22L34.5 28.5H41L35.5 32.5L37.5 39L32 35L26.5 39L28.5 32.5L23 28.5H29.5L32 22Z" fill="#FFD700" />
            <rect x="22" y="34" width="20" height="3" rx="1" fill="white" />
            <path d="M12 20C8 18 5 15 4 12" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 22C9 20 5 18 3 16" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 25C10 24 6 22 4 20" stroke="#C5A84B" strokeWidth="2" strokeLinecap="round" />
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

    // Splitting age groups by gender for the true Pyramid
    const ageGroups = {
        lansia: { L: 0, P: 0, label: '60+', key: 'lansia' },
        dewasa: { L: 0, P: 0, label: '18-59', key: 'dewasa' },
        remaja: { L: 0, P: 0, label: '13-17', key: 'remaja' },
        anak:   { L: 0, P: 0, label: '6-12', key: 'anak' },
        balita: { L: 0, P: 0, label: '0-5', key: 'balita' },
    };

    allMembers.forEach(m => {
        const age = m.age || 0;
        const g = m.gender === 'L' ? 'L' : 'P';
        if (age <= 5) ageGroups.balita[g]++;
        else if (age <= 12) ageGroups.anak[g]++;
        else if (age <= 17) ageGroups.remaja[g]++;
        else if (age <= 59) ageGroups.dewasa[g]++;
        else ageGroups.lansia[g]++;
    });

    const occupations = {};
    allMembers.forEach(m => {
        const occ = m.occupation || 'Tidak diketahui';
        occupations[occ] = (occupations[occ] || 0) + 1;
    });

    return { total, male, female, ageGroups, occupations };
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
        jknCoverage: totalFamilies ? Math.round((jknCount / totalFamilies) * 100) : 0,
        jknCount, totalFamilies, incomeDistribution, waterSources, toiletTypes
    };
}

function getFamilyIndicators(family) { return family?.indicators || FAMILY_INDICATORS[family?.id] || {}; }
function getFamilySDOH(family) { return family?.sdoh || FAMILY_SDOH[family?.id] || {}; }

const ROLE_LABELS = { head: 'Kepala Keluarga', spouse: 'Istri', child: 'Anak', elder: 'Orang Tua', relative: 'Kerabat', grandchild: 'Cucu' };
const EDUCATION_LABELS = { 'No School': 'Tidak Sekolah', 'Elementary': 'SD/MI', 'Junior High': 'SMP/MTs', 'High School': 'SMA/MA', 'Vocational': 'SMK', 'University': 'D3/S1', 'Islamic Board': 'Pesantren' };

// ═══════════════════════════════════════════════════════════════
// REAL BIDIRECTIONAL AGE PYRAMID
// ═══════════════════════════════════════════════════════════════
function RealAgePyramid({ ageGroups }) {
    const keys = ['lansia', 'dewasa', 'remaja', 'anak', 'balita'];
    
    // Find dynamic maximum for responsive scaling
    let maxVal = 1;
    keys.forEach(k => {
        if (ageGroups[k].L > maxVal) maxVal = ageGroups[k].L;
        if (ageGroups[k].P > maxVal) maxVal = ageGroups[k].P;
    });

    return (
        <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-3 px-6">
                <span className="text-blue-600">LAKI-LAKI</span>
                <span className="text-pink-600">PEREMPUAN</span>
            </div>
            
            {keys.map((key) => {
                const g = ageGroups[key];
                return (
                    <div key={key} className="flex items-center justify-center gap-2 group">
                        {/* Male Bar (Right-aligned) */}
                        <div className="flex-1 flex justify-end">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-medium group-hover:text-blue-600 transition-colors">
                                    {g.L > 0 ? g.L : ''}
                                </span>
                                <div 
                                    className="h-4 bg-blue-400 rounded-l-sm transition-all duration-500 group-hover:bg-blue-500 shadow-sm" 
                                    style={{ width: `${(g.L / maxVal) * 100}%`, minWidth: g.L > 0 ? '4px' : '0' }} 
                                />
                            </div>
                        </div>
                        
                        {/* Age Label (Center) */}
                        <div className="w-14 text-center font-bold text-[10px] text-slate-500 bg-slate-100 rounded py-0.5 border border-slate-200 z-10">
                            {g.label}
                        </div>
                        
                        {/* Female Bar (Left-aligned) */}
                        <div className="flex-1 flex justify-start">
                            <div className="flex items-center gap-2 w-full">
                                <div 
                                    className="h-4 bg-pink-400 rounded-r-sm transition-all duration-500 group-hover:bg-pink-500 shadow-sm" 
                                    style={{ width: `${(g.P / maxVal) * 100}%`, minWidth: g.P > 0 ? '4px' : '0' }} 
                                />
                                <span className="text-[10px] text-slate-400 font-medium group-hover:text-pink-600 transition-colors">
                                    {g.P > 0 ? g.P : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// KARTU KELUARGA - REALISTIC DOCUMENT MODAL
// ═══════════════════════════════════════════════════════════════
function KartuKeluargaModal({ family, onClose }) {
    const sdoh = getFamilySDOH(family);
    const indicators = getFamilyIndicators(family);
    const kkNumber = `33${(family.rt || '01').padStart(2, '0')}${(family.rw || '01').padStart(2, '0')}0${family.id.replace('kk_', '')}2024`;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-5xl max-h-[96vh] flex flex-col bg-white rounded-xl shadow-2xl relative overflow-hidden">
                
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md shadow-sm transition-colors border border-emerald-200 text-xs font-bold" title="Cetak Dokumen">
                        <Printer size={14} /> <span className="hidden sm:inline">Cetak Dokumen</span>
                    </button>
                    <button onClick={onClose} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md shadow-sm transition-colors border border-rose-200" title="Tutup">
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-2 sm:p-4 bg-slate-200/50">
                    {/* The Document Paper (Double Border) */}
                    <div className="relative bg-[#FDFBF7] border-[6px] border-double border-emerald-800/80 rounded shadow-md overflow-hidden min-h-full p-4 sm:p-6 sm:px-8">
                        
                        {/* Faint Background Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                            <GarudaEmblem size={480} className="grayscale" />
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center pb-4 border-b-[3px] border-emerald-900 mb-6" style={{ fontFamily: '"Times New Roman", serif' }}>
                                <div className="flex items-center justify-center gap-4 sm:gap-6">
                                    <GarudaEmblem size={56} className="drop-shadow-sm" />
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-slate-900 mb-1">KARTU KELUARGA</h1>
                                        <div className="text-lg font-bold tracking-[0.2em] text-slate-800 font-mono">
                                            No. {kkNumber}
                                        </div>
                                    </div>
                                    <GarudaEmblem size={56} className="opacity-0" /> {/* Spacer for centering */}
                                </div>
                            </div>

                            {/* Administrative Info Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs font-sans">
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">Nama Kepala Keluarga</span><span className="font-bold text-slate-900 text-sm uppercase">{family.headName || family.surname}</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">Alamat</span><span className="font-semibold text-slate-800 uppercase">RT {family.rt || '-'} / RW {family.rw || '01'}</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">Desa/Kelurahan</span><span className="font-semibold text-slate-800 uppercase">Sukamaju</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">Kecamatan</span><span className="font-semibold text-slate-800 uppercase">{VILLAGE_STATS?.kecamatan || 'Sehat Sentosa'}</span></div>
                            </div>

                            {/* Main Table (Sticky Header & Sans Serif for Legibility) */}
                            <div className="overflow-x-auto border-y-2 border-emerald-800 font-sans relative">
                                <table className="w-full text-xs text-left whitespace-nowrap">
                                    <thead className="bg-[#E8F5E9] text-emerald-900 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {['No', 'Nama Lengkap', 'NIK', 'JK', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Pendidikan', 'Pekerjaan', 'Status'].map((h, i) => (
                                                <th key={i} className="px-3 py-3 border-r border-emerald-800/30 last:border-r-0 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/60">
                                        {(family.members || []).map((m, idx) => {
                                            const nik = `337${(family.rt || '01').padStart(2, '0')}${m.gender === 'L' ? '0' : '4'}${String(m.age > 9 ? m.age : '0' + m.age)}${String(idx + 1).padStart(4, '0')}`;
                                            const birthYear = new Date().getFullYear() - m.age;
                                            return (
                                                <tr key={m.id || idx} className="border-b border-slate-300 last:border-b-0 hover:bg-emerald-50/50 transition-colors">
                                                    <td className="px-3 py-2.5 text-center border-r border-slate-300">{idx + 1}</td>
                                                    <td className="px-3 py-2.5 font-bold text-slate-800 border-r border-slate-300 uppercase">{m.firstName} {family.surname}</td>
                                                    <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold border-r border-slate-300 tracking-wider text-[11px]">{nik}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 text-center font-bold">{m.gender === 'L' ? 'L' : 'P'}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">Sukamaju</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 tabular-nums font-mono text-[11px]">{`01-01-${birthYear}`}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">Islam</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{m.age < 7 ? 'Belum Sekolah' : m.age < 13 ? 'SD/MI' : m.age < 16 ? 'SMP/MTs' : m.age < 19 ? 'SMA/MA' : (EDUCATION_LABELS[sdoh.education] || 'SMA/MA')}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{m.occupation || '-'}</td>
                                                    <td className="px-3 py-2.5 font-semibold text-emerald-800 uppercase">{ROLE_LABELS[m.role] || m.role || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Extended Information Footer (SDOH & IKS) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 mt-6 border border-slate-300 rounded overflow-hidden font-sans">
                                {/* SDOH Section */}
                                <div className="p-4 bg-[#FAFFF5] border-b md:border-b-0 md:border-r border-slate-300">
                                    <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                                        <Home size={14} className="text-emerald-600" /> Profil Sosial & Lingkungan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                        {[
                                            { icon: <Building2 size={12} className="text-slate-400" />, label: 'Perumahan', value: sdoh.housing || '-' },
                                            { icon: <Droplets size={12} className="text-blue-500" />, label: 'Sumber Air', value: sdoh.water || '-' },
                                            { icon: <Building2 size={12} className="text-amber-600" />, label: 'Sanitasi', value: sdoh.sanitation || '-' },
                                            { icon: <TrendingUp size={12} className="text-emerald-600" />, label: 'Ekonomi', value: sdoh.economy || '-' },
                                            { icon: <Flame size={12} className="text-rose-400" />, label: 'Merokok', value: sdoh.smoking ? 'Ya' : 'Tidak' },
                                            { icon: <Heart size={12} className="text-pink-500" />, label: 'Aktivitas', value: sdoh.activity || '-' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="mt-0.5">{item.icon}</div>
                                                <div>
                                                    <div className="text-[9px] text-slate-500 font-bold uppercase">{item.label}</div>
                                                    <div className="font-semibold text-slate-800">{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* IKS Section */}
                                <div className="p-4 bg-white/80">
                                    <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                        <Shield size={14} className="text-emerald-600" /> Indikator Keluarga Sehat (IKS)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                                        {[
                                            { key: 'kb', label: 'KB' }, { key: 'persalinan', label: 'Salin Nakes' },
                                            { key: 'imunisasi', label: 'Imunisasi' }, { key: 'asi', label: 'ASI Eksklusif' },
                                            { key: 'balita', label: 'Pantau Balita' }, { key: 'tb', label: 'Bebas TB' },
                                            { key: 'hipertensi', label: 'Kontrol HT' }, { key: 'jiwa', label: 'Kesehatan Jiwa' },
                                            { key: 'rokok', label: 'Bebas Rokok' }, { key: 'jkn', label: 'Peserta JKN' },
                                            { key: 'air', label: 'Air Bersih' }, { key: 'jamban', label: 'Jamban Sehat' },
                                        ].map(({ key, label }) => (
                                            <div key={key} className="flex items-center gap-1.5 text-xs">
                                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${indicators[key] ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                                                    {indicators[key] ? '✓' : '✗'}
                                                </span>
                                                <span className={`truncate ${indicators[key] ? 'text-slate-600' : 'text-rose-600 font-bold'}`}>{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Signatures & Stamp */}
                            <div className="mt-8 flex justify-between px-8 text-xs text-slate-800 relative">
                                <div className="text-center z-10">
                                    <p className="mb-12">Kepala Keluarga</p>
                                    <p className="font-bold underline uppercase">{family.headName || family.surname}</p>
                                </div>
                                <div className="text-center z-10">
                                    <p className="mb-12">Kepala Desa Sukamaju</p>
                                    <p className="font-bold underline uppercase">Bpk. Kades</p>
                                    <p className="text-[10px]">NIP. 19700101 200001 1 001</p>
                                </div>

                                {/* Wet Stamp Aesthetic (Cap Stempel) */}
                                <div className="absolute right-6 top-2 pointer-events-none transform -rotate-12 opacity-80 mix-blend-multiply z-0">
                                    <div className="w-28 h-28 rounded-full border-[3px] border-indigo-700/80 flex flex-col items-center justify-center text-indigo-700/80 p-1 relative">
                                        <div className="absolute inset-1 rounded-full border border-indigo-700/60"></div>
                                        <span className="text-[8px] font-black uppercase tracking-widest mt-2">Pemerintah</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest border-t border-b border-indigo-700/50 w-full text-center py-1 my-1">Kab. Sehat Sentosa</span>
                                        <span className="text-[11px] font-black uppercase tracking-wide">Desa Sukamaju</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// KK CARD PREVIEW (With Gamified Locked State)
// ═══════════════════════════════════════════════════════════════
function KKCardPreview({ family, indicators, onClick, isLocked }) {
    const kepala = (family.members || []).find(m => m.role === 'head') || family.members?.[0] || {};
    const memberCount = (family.members || []).length;
    
    const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
    const healthy = scored.filter(v => v === true).length;
    const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;

    return (
        <div 
            className={`relative group transition-all duration-300 rounded-xl overflow-hidden border bg-white
                ${isLocked ? 'border-slate-300 cursor-not-allowed' : 'border-emerald-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-emerald-400'}`}
            onClick={isLocked ? undefined : onClick}
        >
            {/* Immersive Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 z-20 bg-slate-100/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md text-slate-500 flex items-center gap-2 border border-slate-200 transform transition-transform group-hover:scale-105">
                        <Lock size={16} className="text-slate-400" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">RW {family.rw} Terkunci</span>
                    </div>
                </div>
            )}

            {/* Header Band */}
            <div className={`px-3 py-2 flex items-center justify-between ${isLocked ? 'bg-slate-300' : 'bg-emerald-800'}`}>
                <div className="flex items-center gap-2">
                    <GarudaEmblem size={16} className={isLocked ? "grayscale opacity-50" : ""} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/90" style={{ fontFamily: '"Times New Roman", serif' }}>Kartu Keluarga</span>
                </div>
                <span className="text-[10px] font-mono text-white/70">{family.id.toUpperCase()}</span>
            </div>

            {/* Body */}
            <div className={`p-4 ${isLocked ? 'grayscale opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                    <VillagerAvatar name={kepala.firstName || family.headName} age={kepala.age || 40} gender={kepala.gender === 'L' ? 'M' : 'F'} size={48} />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-800 truncate" style={{ fontFamily: '"Times New Roman", serif' }}>Kel. {family.surname}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">KK: {family.headName || kepala.firstName}</div>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200">
                                RT {family.rt || '-'}/{family.rw || '01'}
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                <Users size={12} className="text-slate-400" /> {memberCount} Jiwa
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex -space-x-2">
                        {(family.members || []).slice(0, 4).map((m, i) => (
                            <div key={m.id || i} className="rounded-full border-2 border-white relative z-10">
                                <VillagerAvatar name={m.firstName} age={m.age} gender={m.gender === 'L' ? 'M' : 'F'} size={24} />
                            </div>
                        ))}
                        {(family.members || []).length > 4 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 z-0 shadow-sm">
                                +{family.members.length - 4}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        {indicators.jkn ? (
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">JKN ✓</span>
                        ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded bg-rose-100 text-rose-600 font-bold border border-rose-200">No JKN</span>
                        )}
                        <div className="flex items-center gap-1.5" title={`Skor IKS: ${iksScore}%`}>
                            <span className={`text-[9px] font-bold ${iksScore >= 80 ? 'text-emerald-600' : iksScore >= 50 ? 'text-amber-500' : 'text-rose-600'}`}>IKS</span>
                            <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full ${iksScore >= 80 ? 'bg-emerald-500' : iksScore >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${iksScore}%` }} />
                            </div>
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
    const [filterRwRt, setFilterRwRt] = useState('all');
    const [viewMode, setViewMode] = useState('cards'); 

    // P5: RW Progressive Unlock awareness
    const unlockedRWs = villageData?.unlockedRWs || ['01', '02'];
    const families = useMemo(() => {
        const raw = Array.isArray(villageData?.families) && villageData.families.length > 0 ? villageData.families : VILLAGE_FAMILIES;
        return raw.map(f => ({ ...f, isLocked: !unlockedRWs.includes(f.rw || '01') }));
    }, [villageData, unlockedRWs]);

    const demographics = useMemo(() => calculateDemographics(families), [families]);
    const sdohSummary = useMemo(() => calculateSDOHSummary(families), [families]);
    const rwRtList = useMemo(() => [...new Set(families.map(f => (f.rw||'01')+'-'+(f.rt||'01')))].sort(), [families]);

    const filteredFamilies = useMemo(() => {
        let list = [...families];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(f => f.id.toLowerCase().includes(q) || (f.surname || '').toLowerCase().includes(q) || (f.headName || '').toLowerCase().includes(q) || (f.members || []).some(m => (m.firstName || '').toLowerCase().includes(q)));
        }
        if (filterRwRt !== 'all') list = list.filter(f => ((f.rw||'01')+'-'+(f.rt||'01')) === filterRwRt);
        return list;
    }, [families, search, filterRwRt]);

    const topOccupations = useMemo(() => Object.entries(demographics.occupations).sort((a, b) => b[1] - a[1]).slice(0, 5), [demographics]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-slate-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

                {/* Hero Header Document Style */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-center py-6 px-4 relative">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                            <GarudaEmblem size={64} className="hidden md:block drop-shadow-lg" />
                            <div>
                                <div className="text-amber-300 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-1">
                                    Pemerintah Desa Sukamaju
                                </div>
                                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wider font-serif drop-shadow-sm">
                                    DATA KEPENDUDUKAN DESA
                                </h1>
                                <div className="text-emerald-200 text-xs tracking-widest mt-1 opacity-90">
                                    Sistem Informasi Profil Desa Terpadu
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner - Made Responsive */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 lg:divide-x divide-slate-100 bg-white">
                        {[
                            { icon: Users, label: 'Total Jiwa', value: demographics.total, sub: `${demographics.male}L / ${demographics.female}P`, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Home, label: 'Jumlah KK', value: families.length, sub: 'Terdaftar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { icon: MapPin, label: 'Wilayah', value: rwRtList.length, sub: 'RW/RT Aktif', color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: Shield, label: 'Cakupan JKN', value: `${sdohSummary.jknCoverage}%`, sub: `${sdohSummary.jknCount} Keluarga`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: Baby, label: 'Balita', value: demographics.ageGroups.balita.L + demographics.ageGroups.balita.P, sub: '0-5 Tahun', color: 'text-pink-500', bg: 'bg-pink-50' },
                            { icon: Briefcase, label: 'Lansia', value: demographics.ageGroups.lansia.L + demographics.ageGroups.lansia.P, sub: '> 60 Tahun', color: 'text-slate-600', bg: 'bg-slate-50' },
                        ].map(({ icon: Icon, label, value, sub, color, bg }, i) => (
                            <div key={i} className="p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                                <div className={`p-2 rounded-full ${bg} ${color} mb-2`}>
                                    <Icon size={20} />
                                </div>
                                <div className="text-2xl font-black text-slate-800 font-serif leading-none mb-1">{value}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Piramida */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">📊 Piramida Penduduk</h3>
                        <RealAgePyramid ageGroups={demographics.ageGroups} />
                    </div>

                    {/* Lingkungan */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🏠 Tinjauan Lingkungan</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Sumber Air Bersih</div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(sdohSummary.waterSources).map(([source, count]) => (
                                        <div key={source} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 text-xs font-bold shadow-sm">
                                            <Droplets size={12} /> {source} <span className="bg-blue-200/50 px-1.5 rounded-sm ml-1 text-[10px]">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Fasilitas Sanitasi</div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(sdohSummary.toiletTypes).map(([type, count]) => (
                                        <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100 text-xs font-bold shadow-sm">
                                            <Building2 size={12} /> {type} <span className="bg-amber-200/50 px-1.5 rounded-sm ml-1 text-[10px]">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pekerjaan */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">💼 Profil Pekerjaan (Top 5)</h3>
                        <div className="space-y-3">
                            {topOccupations.map(([occ, count], i) => (
                                <div key={occ} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                                            <span className="font-bold">{occ}</span>
                                            <span className="font-bold">{count} jiwa</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(count / demographics.total) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Explorer */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={18} className="text-emerald-600" /> Arsip Kartu Keluarga
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <div className="flex bg-slate-200 rounded-lg p-1 w-full sm:w-auto">
                                <button onClick={() => setViewMode('cards')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Kartu</button>
                                <button onClick={() => setViewMode('table')} className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Tabel</button>
                            </div>

                            <select value={filterRwRt} onChange={e => setFilterRwRt(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer flex-1 sm:flex-none">
                                <option value="all">Semua Wilayah</option>
                                {rwRtList.map(rwRt => <option key={rwRt} value={rwRt}>Wilayah RW {rwRt.replace('-',' RT ')}</option>)}
                            </select>

                            <div className="relative w-full sm:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Cari nama atau NIK..." value={search} onChange={e => setSearch(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-slate-50/50 p-4">
                        {filteredFamilies.length === 0 ? (
                            /* Empty State Immersive */
                            <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in">
                                <div className="bg-emerald-50 p-4 rounded-full mb-3 shadow-inner border border-emerald-100">
                                    <SearchX size={32} className="text-emerald-500" />
                                </div>
                                <h4 className="text-slate-800 font-bold mb-1">Data Tidak Ditemukan</h4>
                                <p className="text-slate-500 text-sm max-w-xs">Arsip untuk warga dengan kata kunci tersebut tidak ada di dalam database desa.</p>
                            </div>
                        ) : viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in">
                                {filteredFamilies.map(family => (
                                    <KKCardPreview key={family.id} family={family} indicators={getFamilyIndicators(family)} onClick={() => setSelectedFamily(family)} isLocked={family.isLocked} />
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 animate-in fade-in">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                        <tr>
                                            {['ID KK', 'Kepala Keluarga', 'Domisili', 'Anggota', 'Status JKN', 'Skor IKS', 'Aksi'].map((h, i) => (
                                                <th key={i} className="px-4 py-3 font-bold text-xs uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredFamilies.map((family) => {
                                            const indicators = getFamilyIndicators(family);
                                            const kepala = (family.members || []).find(m => m.role === 'head') || family.members?.[0] || {};
                                            const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
                                            const healthy = scored.filter(v => v === true).length;
                                            const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;

                                            return (
                                                <tr key={family.id} className={`transition-colors ${family.isLocked ? 'bg-slate-50/50 cursor-not-allowed' : 'hover:bg-emerald-50/30 cursor-pointer'}`} onClick={family.isLocked ? undefined : () => setSelectedFamily(family)}>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500">
                                                        {family.isLocked && <Lock size={12} className="inline mr-1 text-slate-400" />}
                                                        {family.id.toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className={`flex items-center gap-3 ${family.isLocked ? 'opacity-50 grayscale' : ''}`}>
                                                            <VillagerAvatar name={kepala.firstName} age={kepala.age} gender={kepala.gender === 'L' ? 'M' : 'F'} size={32} />
                                                            <div>
                                                                <div className="font-bold text-slate-800">Kel. {family.surname}</div>
                                                                <div className="text-[10px] font-bold uppercase text-slate-400">{kepala.firstName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 font-bold text-xs">RT {family.rt||'-'}/RW {family.rw||'01'}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-700">{(family.members || []).length} Jiwa</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${indicators.jkn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                                                            {indicators.jkn ? 'Aktif' : 'Tidak Ada'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold border shadow-sm ${iksScore >= 80 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : iksScore >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
                                                            {iksScore}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {!family.isLocked ? <span className="text-emerald-600 text-xs font-bold hover:underline">Buka Arsip &rarr;</span> : <span className="text-slate-400 text-xs font-medium italic">Terkunci</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Detail KK */}
            {selectedFamily && (
                <KartuKeluargaModal family={selectedFamily} onClose={() => setSelectedFamily(null)} />
            )}
        </div>
    );
}
