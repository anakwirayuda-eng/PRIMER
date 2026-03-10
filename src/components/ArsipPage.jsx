/**
 * @reflection
 * [IDENTITY]: ArsipPage
 * [PURPOSE]: React UI component: ArsipPage.
 * [STATE]: Experimental
 * [ANCHOR]: ArsipPage
 * [DEPENDS_ON]: GameContext, VillageRegistry, ThemeContext, CPPTCard
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { Folder, User, FileText, Calendar, ChevronRight, Search, Activity, AlertCircle, Map, Home, Heart, Pill, AlertTriangle, Shield, ChevronDown, ChevronUp, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { INDIVIDUAL_PROFILES, FAMILY_MEDICAL_HISTORY } from '../domains/village/VillageRegistry.js';
import { useTheme } from '../context/ThemeContext.jsx';
import CPPTCard from './CPPTCard.jsx';
import { guardStability } from '../utils/prophylaxis.js';

export default function ArsipPage() {
    const { history, villageData, day, viewParams, navigate } = useGame();
    const [activeTab, setActiveTab] = useState('folders'); // 'folders' | 'daily'
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Handle Deep Linking / Navigation
    // Effect removed: Redundant with line 65 logic

    // --- FAMILY FOLDER LOGIC ---
    // Group history by family (must be defined before useEffects that use it)
    const familyRecords = useMemo(() => {
        if (!villageData || !Array.isArray(villageData.families)) return [];

        return villageData.families.map(family => {
            // Find all visits for this family
            const visits = (history || []).filter(visit =>
                visit.hidden && visit.hidden.familyId === family.id
            );

            // Calculate health summary
            const recentVisit = visits[visits.length - 1];

            return {
                ...family,
                members: family.members || [],
                visits: visits.sort((a, b) => b.dischargedAt - a.dischargedAt), // Newest first
                lastVisit: recentVisit ? recentVisit.day : null,
                totalVisits: visits.length,
                // Ensure IKS Score exists (use pre-calculated if available)
                iksScore: family.iksScore !== undefined ? family.iksScore :
                    (Object.values(family.indicators || {}).filter(v => v === true).length / Object.keys(family.indicators || {}).length) || 0
            };
        });
    }, [villageData, history]);

    // Use a separate effect that depends on familyRecords availability
    useEffect(() => {
        if (!guardStability('NAV_ARSIP_INIT', 2000, 3)) return;
        if (viewParams && viewParams.familyId) {
            // Set active tab and selected family in next tick to avoid synchronous setState warning
            setTimeout(() => {
                setActiveTab(prev => prev !== 'folders' ? 'folders' : prev);

                // Try to find family if records are ready
                if (familyRecords.length > 0) {
                    const target = familyRecords.find(f => f.id === viewParams.familyId);
                    if (target) {
                        setSelectedFamily(target);
                    }
                }
            }, 0);
        }
    }, [viewParams, familyRecords]);

    // Filter families by search
    const filteredFamilies = familyRecords.filter(f =>
        (f.headName && f.headName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.id && f.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // --- DAILY LOG LOGIC ---
    const dailyRecords = useMemo(() => {
        if (!history) return [];
        return [...history].sort((a, b) => b.dischargedAt - a.dischargedAt);
    }, [history]);

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-main)]">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Folder className="text-teal-600" />
                        SIMPUS: Arsip & Rekam Medis
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Pencatatan & Pelaporan Puskesmas</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder={activeTab === 'folders' ? "Cari KK / Kepala Keluarga..." : "Cari Pasien..."}
                        className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 pt-2 gap-4">
                <button
                    onClick={() => { setActiveTab('folders'); setSelectedFamily(null); }}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'folders' ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Folder size={16} />
                    Family Folder (Rekam Medis)
                </button>
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'daily' ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Calendar size={16} />
                    Log Kunjungan Harian
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'folders' ? (
                    selectedFamily ? (
                        /* --- FAMILY DETAIL VIEW --- */
                        <ErrorBoundary name="FamilyDetailView">
                            <FamilyDetailView
                                family={selectedFamily}
                                onBack={() => setSelectedFamily(null)}
                            />
                        </ErrorBoundary>
                    ) : (
                        /* --- FAMILY FOLDER GRID --- */
                        <div className="h-full overflow-y-auto p-4">
                            {filteredFamilies.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                    <Folder size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">
                                        {searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Data Keluarga'}
                                    </h3>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-md">
                                        {searchQuery
                                            ? `Tidak ditemukan keluarga dengan kata kunci "${searchQuery}"`
                                            : 'Data keluarga belum tersedia. Mulai permainan baru untuk menginisialisasi data wilayah.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <ErrorBoundary name="FamilyFolderList">
                                        {filteredFamilies.map((fam, idx) => (
                                            <div
                                                key={fam.id || idx}
                                                onClick={() => setSelectedFamily(fam)}
                                                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg text-teal-600 dark:text-teal-400 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                                            <Folder size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                                                Kel. {fam.headName || 'Tanpa Nama'}
                                                            </h3>
                                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{fam.id ? fam.id.toUpperCase() : 'NO-ID'}</p>
                                                        </div>
                                                    </div>
                                                    {fam.lastVisit === day && (
                                                        <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>Anggota</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{fam.members.length} Orang</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>Total Kunjungan</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{fam.totalVisits || 0}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>Status PIS-PK</span>
                                                        <span className={`font-semibold ${fam.iksScore > 0.8 ? 'text-green-600 dark:text-green-400' : fam.iksScore > 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            IKS: {fam.iksScore?.toFixed(2) || '0.00'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                                                    {fam.houseId && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate('wilayah', { focusHouseId: fam.houseId });
                                                            }}
                                                            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors px-2 py-1 -ml-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                                                            title="Lihat Rumah di Peta"
                                                        >
                                                            <Home size={14} /> Rumah
                                                        </button>
                                                    )}
                                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                                                        Buka Folder <ChevronRight size={14} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </ErrorBoundary>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    /* --- DAILY LOG VIEW --- */
                    <div className="h-full overflow-y-auto p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Waktu</th>
                                    <th className="px-6 py-3">Nama Pasien</th>
                                    <th className="px-6 py-3">Diagnosis</th>
                                    <th className="px-6 py-3">Tindakan</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ErrorBoundary name="DailyLogTable">
                                    {dailyRecords.filter(r => r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || r.label?.toLowerCase().includes(searchQuery.toLowerCase())).map((record, idx) => (
                                        <tr key={idx} className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <td className="px-6 py-4 font-mono text-slate-500">
                                                Hari {record.day}, {record.dischargedAt ? `${Math.floor(record.dischargedAt / 60)}:${(record.dischargedAt % 60).toString().padStart(2, '0')}` : '08:00'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                                {record.name || record.label}
                                                {record.type === 'posyandu' && (
                                                    <span className="ml-2 text-xs bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                                                        Posyandu
                                                    </span>
                                                )}
                                                {record.type?.startsWith('prolanis') || record.type === 'senam_prolanis' ? (
                                                    <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                                                        Prolanis
                                                    </span>
                                                ) : null}
                                                {record.hidden?.familyId && (
                                                    <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                                        Warga
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300" title={record.description}>
                                                {record.type === 'posyandu' || record.type?.includes('prolanis')
                                                    ? record.description
                                                    : record.decision?.diagnoses?.join(', ') || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${record.type === 'posyandu' ? 'bg-rose-100 text-rose-700' :
                                                    record.type === 'senam_prolanis' ? 'bg-indigo-100 text-indigo-700' :
                                                        record.decision?.action === 'refer' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {record.type === 'posyandu' ? 'KEGIATAN' :
                                                        record.type === 'senam_prolanis' ? 'MASSA' :
                                                            record.type === 'prolanis_call' ? 'PANGGIL' :
                                                                record.type === 'prolanis_monitor' ? 'PANTAU' :
                                                                    record.decision?.action === 'refer' ? 'RUJUK' : 'RAWAT'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.outcome === 'bad' ? '⚠️' : '✅'}
                                            </td>
                                        </tr>
                                    ))}
                                </ErrorBoundary>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// === MEMBER PROFILE CARD COMPONENT ===
// Expandable card showing individual health profile details
function MemberProfileCard({ member, profile, history }) {
    const [expanded, setExpanded] = useState(false);

    // Count visits for this member
    const memberVisits = useMemo(() =>
        (history || []).filter(h =>
            h.hidden?.villagerId === member.id || h.social?.villagerId === member.id
        ).length,
        [history, member.id]);

    const hasProfile = !!profile;
    const hasConditions = profile?.conditions?.length > 0;
    const hasAllergies = profile?.allergies?.length > 0;
    const hasMedications = profile?.medications?.length > 0;

    // Role badge colors
    const roleBadge = {
        head: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-400', label: 'KK' },
        spouse: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-400', label: 'IST' },
        elder: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-400', label: 'OR' },
        child: { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-400', label: 'AK' },
        grandchild: { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-400', label: 'CC' },
    }[member.role] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: 'L' };

    return (
        <div className={`rounded-lg border transition-all ${hasConditions ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
            {/* Header - Always Visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
                <div className={`w-10 h-10 rounded-full ${roleBadge.bg} ${roleBadge.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {roleBadge.label}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{member.fullName || member.name || member.firstName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.age} th • {member.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {member.occupation}</p>
                    {/* Quick condition badges */}
                    {hasConditions && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {profile.conditions.slice(0, 2).map((c, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-medium border border-amber-300 dark:border-amber-700">
                                    {c.replace(/_/g, ' ').replace('stage1', '').replace('stage2', '').replace('type2', '')}
                                </span>
                            ))}
                            {profile.conditions.length > 2 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                                    +{profile.conditions.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    {memberVisits > 0 && (
                        <span className="text-[9px] bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-800">
                            {memberVisits} visit
                        </span>
                    )}
                    {expanded ? <ChevronUp size={16} className="text-slate-400 dark:text-slate-500" /> : <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />}
                </div>
            </button>

            {/* Expanded Details */}
            {expanded && (
                <div className="px-3 pb-3 space-y-3 animate-fadeIn">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3"></div>

                    {/* Conditions */}
                    {hasConditions && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <Heart size={12} /> Kondisi Kesehatan
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.conditions.map((c, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-medium border border-red-200 dark:border-red-800">
                                        {c.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Allergies */}
                    {hasAllergies && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                                <AlertTriangle size={12} /> Alergi
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.allergies.map((a, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-800">
                                        ⚠️ {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {hasMedications && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Pill size={12} /> Obat Rutin
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {profile.medications.map((m, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                        💊 {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vaccinations */}
                    {profile?.vaccinations && Object.keys(profile.vaccinations).length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Shield size={12} /> Vaksinasi
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {Object.entries(profile.vaccinations).map(([vax, status]) => (
                                    <span key={vax} className={`text-xs px-2 py-1 rounded font-medium border ${status === true ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                                        status === false ? 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' :
                                            'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                        }`}>
                                        {vax}: {status === true ? '✓' : status === false ? '✗' : status}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lifestyle */}
                    {profile?.lifestyle && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                                <Activity size={12} /> Gaya Hidup
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {profile.lifestyle.smoking && (
                                    <div className={`p-2 rounded border ${profile.lifestyle.smoking === 'current' || profile.lifestyle.smoking === 'current_heavy'
                                        ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}>
                                        <span className="font-medium">Merokok:</span> {profile.lifestyle.smoking.replace('_', ' ')}
                                    </div>
                                )}
                                {profile.lifestyle.exercise && (
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">Olahraga:</span> {profile.lifestyle.exercise}
                                    </div>
                                )}
                                {profile.lifestyle.diet && (
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                        <span className="font-medium">Diet:</span> {profile.lifestyle.diet.replace('_', ' ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Clinical Notes */}
                    {profile?.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900/50 rounded text-xs text-yellow-800 dark:text-yellow-400 italic">
                            📋 {profile.notes}
                        </div>
                    )}

                    {/* No Profile Message */}
                    {!hasProfile && (
                        <div className="text-center py-4 text-slate-400 text-xs italic">
                            Belum ada profil kesehatan tercatat untuk anggota ini.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FamilyDetailView({ family, onBack }) {
    const { history, navigate, openWiki } = useGame();
    const { isDark } = useTheme();

    // Filter visits only for this family
    const familyVisits = useMemo(() =>
        (history || []).filter(h => h.hidden?.familyId === family.id).sort((a, b) => b.dischargedAt - a.dischargedAt),
        [history, family.id]);

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-main)]">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-lg transition-all font-medium text-sm group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    Kembali
                </button>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Folder Keluarga: {family.headName || 'Tanpa Nama'}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        ID: {family.id} • Anggota: {(family.members || []).length} • IKS: <span className={`font-bold ${family.iksScore > 0.8 ? 'text-green-600 dark:text-green-400' : family.iksScore > 0.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{family.iksScore?.toFixed(2) || '0.00'}</span>
                    </p>
                </div>
                {family.houseId && (
                    <button
                        onClick={() => navigate('wilayah', { focusHouseId: family.houseId })}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors"
                    >
                        <Map size={14} /> Lihat Rumah
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* Family Biography / Story (Harvest Moon Style) */}
                {family.biography && (
                    <div className="mb-6 bg-teal-50 dark:bg-teal-900/10 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm border border-teal-100 dark:border-teal-900/50">
                        <h3 className="text-teal-800 dark:text-teal-400 font-bold flex items-center gap-2 mb-1">
                            <BookOpen size={18} /> Kisah Keluarga
                        </h3>
                        <p className="text-teal-900 dark:text-teal-300 text-sm italic leading-relaxed">
                            "{family.biography}"
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Family Members Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <User size={18} /> Daftar Anggota
                            </h3>
                            <div className="space-y-3">
                                {(family.members || []).map((member, i) => {
                                    const profile = INDIVIDUAL_PROFILES[member.id];

                                    return (
                                        <ErrorBoundary key={member.id || i} name="MemberProfileCard">
                                            <MemberProfileCard
                                                member={member}
                                                profile={profile}
                                                familyId={family.id}
                                                history={history}
                                            />
                                        </ErrorBoundary>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Determinants Summary */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <Activity size={18} /> Faktor Risiko (PIS-PK)
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(family.indicators || {}).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="capitalize text-slate-600 dark:text-slate-400">{key}</span>
                                        {val ? (
                                            <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">Sehat</span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400 font-bold text-xs bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded flex items-center gap-1 border border-red-200 dark:border-red-800">
                                                <AlertCircle size={10} /> Risiko
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Medical History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 min-h-[500px]">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <FileText size={18} /> Riwayat Kunjungan
                            </h3>

                            {(familyVisits || []).length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Folder size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>Belum ada riwayat CPPT.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* CPPT Records */}
                                    {familyVisits.filter(v => v.cpptRecord).map((visit, idx) => (
                                        <CPPTCard
                                            key={visit.cpptRecord?.id || idx}
                                            record={visit.cpptRecord}
                                            isDark={isDark}
                                            openWiki={openWiki}
                                            showPatientName={true}
                                            defaultExpanded={false}
                                        />
                                    ))}
                                    {/* Legacy visits without CPPT */}
                                    {familyVisits.filter(v => !v.cpptRecord).map((visit, idx) => (
                                        <div key={`legacy-${idx}`} className="relative">
                                            <div className={`rounded-lg p-4 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full mb-2 inline-block border border-teal-100 dark:border-teal-800">
                                                            Hari {visit.day}
                                                        </span>
                                                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{visit.name}</h4>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${visit.decision?.action === 'refer' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {visit.decision?.action === 'refer' ? 'Rujuk' : 'Rawat'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">{(visit.decision?.diagnoses || []).join(', ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
