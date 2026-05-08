/**
 * @reflection
 * [IDENTITY]: SensusPage
 * [PURPOSE]: Census/demography view accessible from the village office building.
 *            Designed with an authentic family-card document aesthetic.
 *            Shows government perspective: KK data, RT/RW distribution,
 *            SDOH summary, JKN status, occupation stats, age pyramid.
 *            Complements ArsipPage (medical view) with administrative view.
 * [STATE]: Polished & Immersive UI/UX
 * [ANCHOR]: SensusPage
 * [DEPENDS_ON]: VillageRegistry, VillagerAvatar
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VILLAGE_FAMILIES, FAMILY_SDOH, FAMILY_INDICATORS, VILLAGE_STATS } from '../../domains/village/VillageRegistry.js';
import VillagerAvatar from '../VillagerAvatar.jsx';
import { useGame } from '../../context/GameContext.jsx';
import {
    Users, Home, MapPin, Shield, Heart, Search,
    TrendingUp, Baby, Briefcase, X, FileText, Droplets, Flame, Building2,
    Lock, Printer, SearchX
} from 'lucide-react';
import useViewportWidth from '../../hooks/useViewportWidth.js';

// ═══════════════════════════════════════════════════════════════
// GARUDA SVG - Simplified emblem for document headers
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
        const occ = m.occupation || 'tidak_diketahui';
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

        const water = sdoh.water || 'sumur';
        waterSources[water] = (waterSources[water] || 0) + 1;

        const toilet = sdoh.sanitation || 'tidak_diketahui';
        toiletTypes[toilet] = (toiletTypes[toilet] || 0) + 1;
    });

    return {
        jknCoverage: totalFamilies ? Math.round((jknCount / totalFamilies) * 100) : 0,
        jknCount, totalFamilies, incomeDistribution, waterSources, toiletTypes
    };
}

function getFamilyIndicators(family) { return family?.indicators || FAMILY_INDICATORS[family?.id] || {}; }
function getFamilySDOH(family) { return family?.sdoh || FAMILY_SDOH[family?.id] || {}; }

const ROLE_KEYS = { head: 'head', spouse: 'spouse', child: 'child', elder: 'elder', relative: 'relative', grandchild: 'grandchild' };
const EDUCATION_KEYS = {
    'No School': 'no_school',
    Elementary: 'elementary',
    'Junior High': 'junior_high',
    'High School': 'high_school',
    Vocational: 'vocational',
    University: 'university',
    'Islamic Board': 'islamic_board'
};

function toLocaleToken(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function translateCensusValue(t, value) {
    if (value === null || value === undefined || value === '') return '-';
    return t(`sensus.values.${toLocaleToken(value)}`, { defaultValue: value });
}

function translateRole(t, role) {
    return t(`sensus.roles.${ROLE_KEYS[role] || role}`, { defaultValue: role || '-' });
}

function getDocumentHeaders(t) {
    const headers = t('sensus.document.tableHeaders', { returnObjects: true });
    return Array.isArray(headers) ? headers : ['No', 'Full Name', 'NIK', 'Sex', 'Birthplace', 'Birth Date', 'Religion', 'Education', 'Occupation', 'Status'];
}

function getExplorerHeaders(t) {
    const headers = t('sensus.explorer.tableHeaders', { returnObjects: true });
    return Array.isArray(headers) ? headers : ['Household ID', 'Family Head', 'Domicile', 'Members', 'JKN Status', 'IKS Score', 'Action'];
}

function getMemberEducationKey(member, sdoh) {
    if ((member?.age || 0) < 7) return 'not_yet_school';
    if ((member?.age || 0) < 13) return 'elementary_short';
    if ((member?.age || 0) < 16) return 'junior_high_short';
    if ((member?.age || 0) < 19) return 'high_school_short';
    return EDUCATION_KEYS[sdoh?.education] || 'high_school_short';
}

// ═══════════════════════════════════════════════════════════════
// REAL BIDIRECTIONAL AGE PYRAMID
// ═══════════════════════════════════════════════════════════════
function RealAgePyramid({ ageGroups }) {
    const { t } = useTranslation();
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
                <span className="text-blue-600">{t('sensus.gender.maleUpper')}</span>
                <span className="text-pink-600">{t('sensus.gender.femaleUpper')}</span>
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
    const { t } = useTranslation();
    const sdoh = getFamilySDOH(family);
    const indicators = getFamilyIndicators(family);
    const kkNumber = `33${(family.rt || '01').padStart(2, '0')}${(family.rw || '01').padStart(2, '0')}0${family.id.replace('kk_', '')}2024`;
    const documentHeaders = getDocumentHeaders(t);
    const socialItems = [
        { icon: <Building2 size={12} className="text-slate-400" />, label: t('sensus.document.sdoh.housing'), value: translateCensusValue(t, sdoh.housing) },
        { icon: <Droplets size={12} className="text-blue-500" />, label: t('sensus.document.sdoh.water'), value: translateCensusValue(t, sdoh.water) },
        { icon: <Building2 size={12} className="text-amber-600" />, label: t('sensus.document.sdoh.sanitation'), value: translateCensusValue(t, sdoh.sanitation) },
        { icon: <TrendingUp size={12} className="text-emerald-600" />, label: t('sensus.document.sdoh.economy'), value: translateCensusValue(t, sdoh.economy) },
        { icon: <Flame size={12} className="text-rose-400" />, label: t('sensus.document.sdoh.smoking'), value: sdoh.smoking ? t('sensus.common.yes') : t('sensus.common.no') },
        { icon: <Heart size={12} className="text-pink-500" />, label: t('sensus.document.sdoh.activity'), value: translateCensusValue(t, sdoh.activity) },
    ];
    const indicatorItems = ['kb', 'persalinan', 'imunisasi', 'asi', 'balita', 'tb', 'hipertensi', 'jiwa', 'rokok', 'jkn', 'air', 'jamban']
        .map((key) => ({ key, label: t(`sensus.indicators.${key}`) }));

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-5xl max-h-[96vh] flex flex-col bg-white rounded-xl shadow-2xl relative overflow-hidden">
                
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    <button disabled className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-md shadow-sm border border-slate-200 text-xs font-bold cursor-not-allowed opacity-60" title={t('sensus.document.printDisabledTitle')}>
                        <Printer size={14} /> <span className="hidden sm:inline">{t('sensus.document.printSoon')}</span>
                    </button>
                    <button onClick={onClose} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md shadow-sm transition-colors border border-rose-200" title={t('sensus.document.closeTitle')}>
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
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-slate-900 mb-1">{t('sensus.document.title')}</h1>
                                        <div className="text-lg font-bold tracking-[0.2em] text-slate-800 font-mono">
                                            {t('sensus.document.number', { number: kkNumber })}
                                        </div>
                                    </div>
                                    <GarudaEmblem size={56} className="opacity-0" /> {/* Spacer for centering */}
                                </div>
                            </div>

                            {/* Administrative Info Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs font-sans">
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">{t('sensus.document.householdHead')}</span><span className="font-bold text-slate-900 text-sm uppercase">{family.headName || family.surname}</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">{t('sensus.document.address')}</span><span className="font-semibold text-slate-800 uppercase">{t('sensus.common.rtRw', { rt: family.rt || '-', rw: family.rw || '01' })}</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">{t('sensus.document.village')}</span><span className="font-semibold text-slate-800 uppercase">{t('sensus.document.villageName')}</span></div>
                                <div><span className="text-slate-500 text-[10px] uppercase font-bold block">{t('sensus.document.district')}</span><span className="font-semibold text-slate-800 uppercase">{VILLAGE_STATS?.kecamatan || t('sensus.document.districtFallback')}</span></div>
                            </div>

                            {/* Main Table (Sticky Header & Sans Serif for Legibility) */}
                            <div className="overflow-x-auto border-y-2 border-emerald-800 font-sans relative">
                                <table className="w-full text-xs text-left whitespace-nowrap">
                                    <thead className="bg-[#E8F5E9] text-emerald-900 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {documentHeaders.map((h, i) => (
                                                <th key={i} className="px-3 py-3 border-r border-emerald-800/30 last:border-r-0 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/60">
                                        {(family.members || []).map((m, idx) => {
                                            const familyNum = family.id.replace(/\D/g, '').padStart(3, '0');
                                            const nik = `33${(family.rw || '01').padStart(2, '0')}${(family.rt || '01').padStart(2, '0')}${m.gender === 'L' ? '0' : '4'}${String(m.age > 9 ? m.age : '0' + m.age)}${familyNum}${String(idx + 1).padStart(2, '0')}`;
                                            const birthYear = new Date().getFullYear() - m.age;
                                            return (
                                                <tr key={m.id || idx} className="border-b border-slate-300 last:border-b-0 hover:bg-emerald-50/50 transition-colors">
                                                    <td className="px-3 py-2.5 text-center border-r border-slate-300">{idx + 1}</td>
                                                    <td className="px-3 py-2.5 font-bold text-slate-800 border-r border-slate-300 uppercase">{m.firstName} {family.surname}</td>
                                                    <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold border-r border-slate-300 tracking-wider text-[11px]">{nik}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 text-center font-bold">{m.gender === 'L' ? t('sensus.gender.maleShort') : t('sensus.gender.femaleShort')}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{t('sensus.document.birthplace')}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 tabular-nums font-mono text-[11px]">{`01-01-${birthYear}`}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{t('sensus.document.religionIslam')}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{t(`sensus.education.${getMemberEducationKey(m, sdoh)}`)}</td>
                                                    <td className="px-3 py-2.5 border-r border-slate-300 uppercase">{translateCensusValue(t, m.occupation)}</td>
                                                    <td className="px-3 py-2.5 font-semibold text-emerald-800 uppercase">{translateRole(t, m.role)}</td>
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
                                        <Home size={14} className="text-emerald-600" /> {t('sensus.document.socialProfileTitle')}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                        {socialItems.map((item, i) => (
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
                                        <Shield size={14} className="text-emerald-600" /> {t('sensus.document.healthyFamilyTitle')}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                                        {indicatorItems.map(({ key, label }) => (
                                            <div key={key} className="flex items-center gap-1.5 text-xs">
                                                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm ${indicators[key] ? 'bg-emerald-500' : 'bg-rose-400'}`}>
                                                    {indicators[key] ? 'OK' : '--'}
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
                                    <p className="mb-12">{t('sensus.document.householdHeadSignature')}</p>
                                    <p className="font-bold underline uppercase">{family.headName || family.surname}</p>
                                </div>
                                <div className="text-center z-10">
                                    <p className="mb-12">{t('sensus.document.villageHeadSignature')}</p>
                                    <p className="font-bold underline uppercase">{t('sensus.document.villageHeadName')}</p>
                                    <p className="text-[10px]">NIP. 19700101 200001 1 001</p>
                                </div>

                                {/* Wet Stamp Aesthetic (Cap Stempel) */}
                                <div className="absolute right-6 top-2 pointer-events-none transform -rotate-12 opacity-80 mix-blend-multiply z-0">
                                    <div className="w-28 h-28 rounded-full border-[3px] border-indigo-700/80 flex flex-col items-center justify-center text-indigo-700/80 p-1 relative">
                                        <div className="absolute inset-1 rounded-full border border-indigo-700/60"></div>
                                        <span className="text-[8px] font-black uppercase tracking-widest mt-2">{t('sensus.document.stampGovernment')}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest border-t border-b border-indigo-700/50 w-full text-center py-1 my-1">{t('sensus.document.stampRegency')}</span>
                                        <span className="text-[11px] font-black uppercase tracking-wide">{t('sensus.document.stampVillage')}</span>
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
    const { t } = useTranslation();
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
            role={isLocked ? undefined : 'button'}
            tabIndex={isLocked ? -1 : 0}
            onKeyDown={isLocked ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
            aria-label={isLocked ? t('sensus.common.lockedFamilyAria', { surname: family.surname }) : t('sensus.common.openFamilyAria', { surname: family.surname })}
        >
            {/* Immersive Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 z-20 bg-slate-100/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                    <div className="bg-white px-4 py-2 rounded-full shadow-md text-slate-500 flex items-center gap-2 border border-slate-200 transform transition-transform group-hover:scale-105">
                        <Lock size={16} className="text-slate-400" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{t('sensus.common.rwLocked', { rw: family.rw })}</span>
                    </div>
                </div>
            )}

            {/* Header Band */}
            <div className={`px-3 py-2 flex items-center justify-between ${isLocked ? 'bg-slate-300' : 'bg-emerald-800'}`}>
                <div className="flex items-center gap-2">
                    <GarudaEmblem size={16} className={isLocked ? "grayscale opacity-50" : ""} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/90" style={{ fontFamily: '"Times New Roman", serif' }}>{t('sensus.document.title')}</span>
                </div>
                <span className="text-[10px] font-mono text-white/70">{family.id.toUpperCase()}</span>
            </div>

            {/* Body */}
            <div className={`p-4 ${isLocked ? 'grayscale opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                    <VillagerAvatar name={kepala.firstName || family.headName} age={kepala.age || 40} gender={kepala.gender === 'L' ? 'M' : 'F'} size={48} />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-800 truncate" style={{ fontFamily: '"Times New Roman", serif' }}>{t('sensus.common.familyPrefix', { surname: family.surname })}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{t('sensus.common.headPrefix', { name: family.headName || kepala.firstName })}</div>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200">
                                {t('sensus.common.rtRw', { rt: family.rt || '-', rw: family.rw || '01' })}
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                <Users size={12} className="text-slate-400" /> {t('sensus.common.memberCount', { count: memberCount })}
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
                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">{t('sensus.common.jknActive')}</span>
                        ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded bg-rose-100 text-rose-600 font-bold border border-rose-200">{t('sensus.common.jknInactive')}</span>
                        )}
                        <div className="flex items-center gap-1.5" title={t('sensus.common.healthyIndexTitle', { score: iksScore })}>
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

function KKCompactRow({ family, indicators, onClick, isLocked }) {
    const { t } = useTranslation();
    const kepala = (family.members || []).find(m => m.role === 'head') || family.members?.[0] || {};
    const memberCount = (family.members || []).length;
    const scored = Object.values(indicators).filter(v => v !== null && v !== undefined);
    const healthy = scored.filter(v => v === true).length;
    const iksScore = scored.length > 0 ? Math.round((healthy / scored.length) * 100) : 0;

    return (
        <div
            className={`rounded-xl border bg-white p-4 transition-all ${isLocked ? 'border-slate-200 opacity-70' : 'border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer'}`}
            onClick={isLocked ? undefined : onClick}
            role={isLocked ? undefined : 'button'}
            tabIndex={isLocked ? -1 : 0}
            onKeyDown={isLocked ? undefined : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            aria-label={isLocked ? t('sensus.common.lockedArchiveAria', { surname: family.surname }) : t('sensus.common.openArchiveAria', { surname: family.surname })}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <VillagerAvatar name={kepala.firstName || family.headName} age={kepala.age || 40} gender={kepala.gender === 'L' ? 'M' : 'F'} size={40} />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-sm font-bold text-slate-800">{t('sensus.common.familyPrefix', { surname: family.surname })}</div>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                {family.id.toUpperCase()}
                            </span>
                            {isLocked ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                    <Lock size={10} /> {t('sensus.common.rwLocked', { rw: family.rw })}
                                </span>
                            ) : null}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            {family.headName || kepala.firstName} - {t('sensus.common.rtRw', { rt: family.rt || '-', rw: family.rw || '01' })} - {t('sensus.common.memberCount', { count: memberCount })}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:min-w-[13rem]">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">JKN</div>
                        <div className={`mt-1 text-xs font-bold ${indicators.jkn ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {indicators.jkn ? t('sensus.common.active') : t('sensus.common.none')}
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">IKS</div>
                        <div className={`mt-1 text-xs font-bold ${iksScore >= 80 ? 'text-emerald-600' : iksScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {iksScore}%
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
    const { t } = useTranslation();
    const { villageData, viewParams } = useGame();
    const [search, setSearch] = useState('');
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [filterRwRt, setFilterRwRt] = useState('all');
    const [viewMode, setViewMode] = useState('cards');
    const viewportWidth = useViewportWidth();
    const showWideTable = viewportWidth >= 1536;
    const focusRw = viewParams?.focusRw || null;

    // P5: RW Progressive Unlock awareness
    const unlockedRWs = useMemo(
        () => villageData?.unlockedRWs || ['01', '02'],
        [villageData?.unlockedRWs]
    ); /*
    // eslint-disable-next-line react-hooks/exhaustive-deps - unlockedRWs is derived from villageData, safe to omit
    */
    const families = useMemo(() => {
        const raw = Array.isArray(villageData?.families) && villageData.families.length > 0 ? villageData.families : VILLAGE_FAMILIES;
        return raw.map(f => ({ ...f, isLocked: !unlockedRWs.includes(f.rw || '01') }));
    }, [unlockedRWs, villageData]);

    const demographics = useMemo(() => calculateDemographics(families), [families]);
    const sdohSummary = useMemo(() => calculateSDOHSummary(families), [families]);
    const rwList = useMemo(() => [...new Set(families.map(f => (f.rw || '01')))].sort(), [families]);
    const rwRtList = useMemo(() => [...new Set(families.map(f => (f.rw||'01')+'-'+(f.rt||'01')))].sort(), [families]);

    useEffect(() => {
        if (!focusRw) return;
        const hasRw = families.some((family) => (family.rw || '01') === focusRw);
        if (hasRw) {
            setFilterRwRt(`rw:${focusRw}`);
        }
    }, [families, focusRw]);

    const filteredFamilies = useMemo(() => {
        let list = [...families];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(f => {
                // Search by family id, surname, head name, member names
                if (f.id.toLowerCase().includes(q) || (f.surname || '').toLowerCase().includes(q) || (f.headName || '').toLowerCase().includes(q)) return true;
                if ((f.members || []).some(m => (m.firstName || '').toLowerCase().includes(q))) return true;
                // Search by synthetic NIK (matches promise in search placeholder)
                const familyNum = f.id.replace(/\D/g, '').padStart(3, '0');
                return (f.members || []).some((m, idx) => {
                    const nik = `33${(f.rw || '01').padStart(2, '0')}${(f.rt || '01').padStart(2, '0')}${m.gender === 'L' ? '0' : '4'}${String(m.age > 9 ? m.age : '0' + m.age)}${familyNum}${String(idx + 1).padStart(2, '0')}`;
                    return nik.includes(q);
                });
            });
        }
        if (filterRwRt.startsWith('rw:')) {
            const activeRw = filterRwRt.slice(3);
            list = list.filter(f => (f.rw || '01') === activeRw);
        } else if (filterRwRt !== 'all') {
            list = list.filter(f => ((f.rw||'01')+'-'+(f.rt||'01')) === filterRwRt);
        }
        return list;
    }, [families, search, filterRwRt]);

    const topOccupations = useMemo(() => Object.entries(demographics.occupations).sort((a, b) => b[1] - a[1]).slice(0, 5), [demographics]);
    const explorerHeaders = getExplorerHeaders(t);

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
                                    {t('sensus.page.government')}
                                </div>
                                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wider font-serif drop-shadow-sm">
                                    {t('sensus.page.title')}
                                </h1>
                                <div className="text-emerald-200 text-xs tracking-widest mt-1 opacity-90">
                                    {t('sensus.page.subtitle')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner - Made Responsive */}
                    <div className="grid grid-cols-2 divide-y divide-slate-100 bg-white sm:grid-cols-3 sm:divide-y-0 2xl:grid-cols-6 2xl:divide-x">
                        {[
                            { icon: Users, label: t('sensus.page.stats.totalPeople'), value: demographics.total, sub: `${demographics.male}${t('sensus.gender.maleShort')} / ${demographics.female}${t('sensus.gender.femaleShort')}`, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Home, label: t('sensus.page.stats.households'), value: families.length, sub: t('sensus.page.stats.registered'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { icon: MapPin, label: t('sensus.page.stats.territory'), value: rwRtList.length, sub: t('sensus.page.stats.activeRwRt'), color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: Shield, label: t('sensus.page.stats.jknCoverage'), value: `${sdohSummary.jknCoverage}%`, sub: t('sensus.page.stats.families', { count: sdohSummary.jknCount }), color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: Baby, label: t('sensus.page.stats.underFive'), value: demographics.ageGroups.balita.L + demographics.ageGroups.balita.P, sub: t('sensus.page.stats.age0to5'), color: 'text-pink-500', bg: 'bg-pink-50' },
                            { icon: Briefcase, label: t('sensus.page.stats.olderAdults'), value: demographics.ageGroups.lansia.L + demographics.ageGroups.lansia.P, sub: t('sensus.page.stats.age60plus'), color: 'text-slate-600', bg: 'bg-slate-50' },
                        ].map(({ icon, label, value, sub, color, bg }, i) => {
                            const StatIcon = icon;
                            return (
                                <div key={i} className="flex flex-col items-center justify-center p-3 text-center transition-colors hover:bg-slate-50 sm:p-4">
                                    <div className={`p-2 rounded-full ${bg} ${color} mb-2`}>
                                        <StatIcon size={20} />
                                    </div>
                                    <div className="text-2xl font-black text-slate-800 font-serif leading-none mb-1">{value}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5 2xl:grid-cols-3 2xl:gap-6">
                    {/* Piramida */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm md:p-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <TrendingUp size={18} className="text-emerald-600" /> {t('sensus.widgets.agePyramid')}
                        </h3>
                        <RealAgePyramid ageGroups={demographics.ageGroups} />
                    </div>

                    {/* Environment */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm md:p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Home size={18} className="text-emerald-600" /> {t('sensus.widgets.environment')}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">{t('sensus.widgets.cleanWater')}</div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(sdohSummary.waterSources).map(([source, count]) => (
                                        <div key={source} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 text-xs font-bold shadow-sm">
                                            <Droplets size={12} /> {translateCensusValue(t, source)} <span className="bg-blue-200/50 px-1.5 rounded-sm ml-1 text-[10px]">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">{t('sensus.widgets.sanitation')}</div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(sdohSummary.toiletTypes).map(([type, count]) => (
                                        <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100 text-xs font-bold shadow-sm">
                                            <Building2 size={12} /> {translateCensusValue(t, type)} <span className="bg-amber-200/50 px-1.5 rounded-sm ml-1 text-[10px]">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Occupation */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm md:p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-emerald-600" /> {t('sensus.widgets.occupation')}
                        </h3>
                        <div className="space-y-3">
                            {topOccupations.map(([occ, count], i) => (
                                <div key={occ} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                                            <span className="font-bold">{translateCensusValue(t, occ)}</span>
                                            <span className="font-bold">{t('sensus.widgets.peopleCount', { count })}</span>
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[360px]">
                    {/* Toolbar */}
                    <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={18} className="text-emerald-600" /> {t('sensus.explorer.title')}
                        </h3>

                        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
                            <div className="flex w-full rounded-lg bg-slate-200 p-1 sm:w-auto">
                                <button onClick={() => setViewMode('cards')} className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all sm:flex-none ${viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t('sensus.explorer.cards')}</button>
                                <button onClick={() => setViewMode('table')} className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all sm:flex-none ${viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t('sensus.explorer.table')}</button>
                            </div>

                            <select value={filterRwRt} onChange={e => setFilterRwRt(e.target.value)} className="w-full flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 lg:min-w-[13rem] lg:w-auto lg:flex-none">
                                <option value="all">{t('sensus.explorer.allAreas')}</option>
                                {rwList.map(rw => <option key={`rw-${rw}`} value={`rw:${rw}`}>{t('sensus.explorer.rwOption', { rw })}</option>)}
                                {rwRtList.map(rwRt => {
                                    const [rw, rt] = rwRt.split('-');
                                    return <option key={rwRt} value={rwRt}>{t('sensus.explorer.rwRtOption', { rw, rt })}</option>;
                                })}
                            </select>

                            <div className="relative w-full lg:w-72">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder={t('sensus.explorer.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {focusRw && (
                        <div className="border-b border-amber-100 bg-amber-50/80 px-4 py-3">
                            <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                                <div className="font-bold text-amber-900">
                                    {t('sensus.explorer.focusTitle', { rw: focusRw })}
                                </div>
                                <div className="text-amber-700">
                                    {t('sensus.explorer.focusDescription')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 bg-slate-50/50 p-4">
                        {viewMode === 'table' && !showWideTable && (
                            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 shadow-sm">
                                {t('sensus.explorer.compactTableNotice')}
                            </div>
                        )}
                        {filteredFamilies.length === 0 ? (
                            /* Empty State Immersive */
                            <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in">
                                <div className="bg-emerald-50 p-4 rounded-full mb-3 shadow-inner border border-emerald-100">
                                    <SearchX size={32} className="text-emerald-500" />
                                </div>
                                <h4 className="text-slate-800 font-bold mb-1">{t('sensus.explorer.emptyTitle')}</h4>
                                <p className="text-slate-500 text-sm max-w-xs">{t('sensus.explorer.emptyDescription')}</p>
                            </div>
                        ) : viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 gap-4 animate-in fade-in sm:grid-cols-2 2xl:grid-cols-3">
                                {filteredFamilies.map(family => (
                                    <KKCardPreview key={family.id} family={family} indicators={getFamilyIndicators(family)} onClick={() => setSelectedFamily(family)} isLocked={family.isLocked} />
                                ))}
                            </div>
                        ) : showWideTable ? (
                            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 animate-in fade-in">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                        <tr>
                                            {explorerHeaders.map((h, i) => (
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
                                                <tr key={family.id} className={`transition-colors ${family.isLocked ? 'bg-slate-50/50 cursor-not-allowed' : 'hover:bg-emerald-50/30 cursor-pointer'}`} onClick={family.isLocked ? undefined : () => setSelectedFamily(family)} tabIndex={family.isLocked ? -1 : 0} onKeyDown={family.isLocked ? undefined : (e) => { if (e.key === 'Enter') setSelectedFamily(family); }} aria-label={family.isLocked ? t('sensus.common.lockedArchiveAria', { surname: family.surname }) : t('sensus.common.openArchiveAria', { surname: family.surname })}>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-500">
                                                        {family.isLocked && <Lock size={12} className="inline mr-1 text-slate-400" />}
                                                        {family.id.toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className={`flex items-center gap-3 ${family.isLocked ? 'opacity-50 grayscale' : ''}`}>
                                                            <VillagerAvatar name={kepala.firstName} age={kepala.age} gender={kepala.gender === 'L' ? 'M' : 'F'} size={32} />
                                                            <div>
                                                                <div className="font-bold text-slate-800">{t('sensus.common.familyPrefix', { surname: family.surname })}</div>
                                                                <div className="text-[10px] font-bold uppercase text-slate-400">{kepala.firstName}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 font-bold text-xs">{t('sensus.common.rtRw', { rt: family.rt || '-', rw: family.rw || '01' })}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-700">{t('sensus.common.memberCount', { count: (family.members || []).length })}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${indicators.jkn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                                                            {indicators.jkn ? t('sensus.common.active') : t('sensus.common.none')}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold border shadow-sm ${iksScore >= 80 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : iksScore >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
                                                            {iksScore}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {!family.isLocked ? <span className="text-emerald-600 text-xs font-bold hover:underline">{t('sensus.explorer.openArchive')}</span> : <span className="text-slate-400 text-xs font-medium italic">{t('sensus.explorer.locked')}</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="space-y-3 animate-in fade-in">
                                {filteredFamilies.map((family) => (
                                    <KKCompactRow
                                        key={family.id}
                                        family={family}
                                        indicators={getFamilyIndicators(family)}
                                        onClick={() => setSelectedFamily(family)}
                                        isLocked={family.isLocked}
                                    />
                                ))}
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
