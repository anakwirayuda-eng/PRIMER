/**
 * @reflection
 * [IDENTITY]: DosenDashboard
 * [PURPOSE]: Read-only leaderboard mahasiswa untuk dosen — tabel dengan
 *            sorting per kolom, filter grade A/B/C/D, breakdown 4-dimensi
 *            skor (UKP/UKM/Manajemen/Ketahanan). Fetched dari Supabase
 *            via LeaderboardService; offline mode → fallback empty state.
 *
 *            Akses route: setActivePage('dosen_dashboard') atau
 *            window.location.hash === '#dosen-dashboard'. TIDAK di sidebar
 *            mahasiswa — dosen dapat URL/instruction terpisah.
 *
 *            Privacy: tidak menampilkan data sensitif klinis (riwayat
 *            pasien, save state). Hanya skor agregat per NIM untuk
 *            evaluation oleh dosen.
 *
 * [STATE]: Experimental
 * [ANCHOR]: DosenDashboard
 * [DEPENDS_ON]: LeaderboardService, supabaseClient
 * [LAST_UPDATE]: 2026-04-26
 */

import React, { useEffect, useState, useMemo } from 'react';
import { GraduationCap, RefreshCw, Filter, ArrowDown, ArrowUp, Users, AlertCircle } from 'lucide-react';
import { LeaderboardService } from '../services/LeaderboardService.js';
import { isSupabaseConfigured } from '../services/supabaseClient.js';

const GRADE_FILTERS = ['Semua', 'A', 'B', 'C', 'D'];
const SORT_FIELDS = [
    { key: 'score', label: 'Skor Total', numeric: true },
    { key: 'score_ukp', label: 'Klinis (UKP)', numeric: true },
    { key: 'score_ukm', label: 'Komunitas (UKM)', numeric: true },
    { key: 'score_management', label: 'Manajemen', numeric: true },
    { key: 'score_resilience', label: 'Ketahanan', numeric: true },
    { key: 'day_reached', label: 'Hari Tercapai', numeric: true },
    { key: 'patients_treated', label: 'Pasien', numeric: true },
];

const GRADE_PALETTE = {
    A: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    B: 'bg-sky-500/15 text-sky-300 border-sky-400/40',
    C: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
    D: 'bg-rose-500/15 text-rose-300 border-rose-400/40',
};

export default function DosenDashboard() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterGrade, setFilterGrade] = useState('Semua');
    const [sortKey, setSortKey] = useState('score');
    const [sortDir, setSortDir] = useState('desc');
    const [refreshTick, setRefreshTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        // Promise chain — semua setState terjadi setelah resolve, di luar
        // synchronous effect body (mematuhi react-hooks/set-state-in-effect).
        Promise.resolve()
            .then(() => LeaderboardService.getLeaderboard(100))
            .then(({ data, error: err }) => {
                if (cancelled) return;
                if (err) {
                    setError(err);
                    setEntries([]);
                } else {
                    setError(null);
                    setEntries(Array.isArray(data) ? data : []);
                }
                setLoading(false);
            });
        return () => { cancelled = true; };
    }, [refreshTick]);

    const filteredSorted = useMemo(() => {
        let list = entries.slice();
        if (filterGrade !== 'Semua') {
            list = list.filter((e) => (e.grade || 'D') === filterGrade);
        }
        list.sort((a, b) => {
            const av = Number(a?.[sortKey]) || 0;
            const bv = Number(b?.[sortKey]) || 0;
            return sortDir === 'desc' ? bv - av : av - bv;
        });
        return list;
    }, [entries, filterGrade, sortKey, sortDir]);

    const summary = useMemo(() => {
        const total = entries.length;
        const byGrade = { A: 0, B: 0, C: 0, D: 0 };
        let avgScore = 0;
        entries.forEach((e) => {
            const g = e.grade || 'D';
            if (byGrade[g] !== undefined) byGrade[g] += 1;
            avgScore += Number(e.score) || 0;
        });
        if (total > 0) avgScore /= total;
        return { total, byGrade, avgScore };
    }, [entries]);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    if (!isSupabaseConfigured) {
        return (
            <div className="p-8 max-w-3xl mx-auto">
                <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 text-amber-300" size={36} />
                    <h2 className="text-lg font-black text-white mb-1">Mode Offline</h2>
                    <p className="text-sm text-white/60 leading-relaxed">
                        Dashboard Dosen membutuhkan koneksi Supabase yang ter-konfigurasi.
                        Setel <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-200">VITE_SUPABASE_URL</code>{' '}
                        dan <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-200">VITE_SUPABASE_ANON_KEY</code>{' '}
                        di file <code className="bg-white/10 px-1.5 py-0.5 rounded">.env</code> lalu jalankan migrasi{' '}
                        <code className="bg-white/10 px-1.5 py-0.5 rounded">004_leaderboard_4dim.sql</code>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full overflow-auto" data-testid="dosen-dashboard">
            <header className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
                    <GraduationCap size={20} />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-black text-white tracking-tight">Dashboard Dosen</h1>
                    <p className="text-[11px] text-white/50 font-medium">
                        Leaderboard Skor Kinerja Terpadu — Read-only
                    </p>
                </div>
                <button
                    onClick={() => setRefreshTick((t) => t + 1)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/70 flex items-center gap-1.5 transition-colors"
                >
                    <RefreshCw size={12} />
                    Refresh
                </button>
            </header>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                <div className="bg-white/[0.04] rounded-xl border border-white/10 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Users size={11} className="text-white/40" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Mahasiswa</span>
                    </div>
                    <p className="text-2xl font-black text-white tabular-nums">{summary.total}</p>
                </div>
                {['A', 'B', 'C', 'D'].map((g) => (
                    <div key={g} className={`rounded-xl border p-3 ${GRADE_PALETTE[g]}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Grade {g}</span>
                        <p className="text-2xl font-black tabular-nums">{summary.byGrade[g]}</p>
                    </div>
                ))}
            </div>

            {/* Filter & average */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                    <Filter size={12} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Filter Grade:</span>
                    {GRADE_FILTERS.map((g) => (
                        <button
                            key={g}
                            onClick={() => setFilterGrade(g)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-colors ${
                                filterGrade === g
                                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                                    : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                            }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-[11px] text-white/40 tabular-nums">
                    Rata-rata: <span className="text-white/70 font-black">{summary.avgScore.toFixed(1)}/100</span>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <table className="w-full text-xs">
                    <thead className="bg-white/[0.04] border-b border-white/10">
                        <tr>
                            <th className="text-left px-3 py-2.5 font-black text-[9px] uppercase tracking-widest text-white/50 w-12">#</th>
                            <th className="text-left px-3 py-2.5 font-black text-[9px] uppercase tracking-widest text-white/50">Mahasiswa</th>
                            <th className="text-left px-3 py-2.5 font-black text-[9px] uppercase tracking-widest text-white/50">Grade</th>
                            {SORT_FIELDS.map((field) => (
                                <th
                                    key={field.key}
                                    onClick={() => toggleSort(field.key)}
                                    className={`text-right px-3 py-2.5 font-black text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white/[0.03] ${sortKey === field.key ? 'text-indigo-300' : 'text-white/50'}`}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {field.label}
                                        {sortKey === field.key && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}
                                    </span>
                                </th>
                            ))}
                            <th className="text-left px-3 py-2.5 font-black text-[9px] uppercase tracking-widest text-white/50">Akreditasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={11} className="text-center py-8 text-white/40 text-[11px]">Memuat data…</td></tr>
                        )}
                        {!loading && error && (
                            <tr><td colSpan={11} className="text-center py-8 text-rose-400 text-[11px]">Error: {error}</td></tr>
                        )}
                        {!loading && !error && filteredSorted.length === 0 && (
                            <tr><td colSpan={11} className="text-center py-8 text-white/40 text-[11px]">Belum ada data leaderboard.</td></tr>
                        )}
                        {!loading && !error && filteredSorted.map((entry, idx) => (
                            <tr key={entry.nim || idx} className="border-b border-white/5 hover:bg-white/[0.03]">
                                <td className="px-3 py-2 text-white/40 tabular-nums">{idx + 1}</td>
                                <td className="px-3 py-2">
                                    <p className="font-black text-white text-[11px]">{entry.nama || 'Unknown'}</p>
                                    <p className="text-[10px] text-white/40 font-medium">NIM {entry.nim || '-'}</p>
                                </td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${GRADE_PALETTE[entry.grade] || GRADE_PALETTE.D}`}>
                                        {entry.grade || 'D'}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-right font-black text-white tabular-nums">{Number(entry.score || 0).toFixed(0)}</td>
                                <td className="px-3 py-2 text-right text-rose-300 tabular-nums">{Number(entry.score_ukp || 0).toFixed(1)}</td>
                                <td className="px-3 py-2 text-right text-emerald-300 tabular-nums">{Number(entry.score_ukm || 0).toFixed(1)}</td>
                                <td className="px-3 py-2 text-right text-violet-300 tabular-nums">{Number(entry.score_management || 0).toFixed(1)}</td>
                                <td className="px-3 py-2 text-right text-amber-300 tabular-nums">{Number(entry.score_resilience || 0).toFixed(1)}</td>
                                <td className="px-3 py-2 text-right text-white/60 tabular-nums">{entry.day_reached || '-'}</td>
                                <td className="px-3 py-2 text-right text-white/60 tabular-nums">{entry.patients_treated || 0}</td>
                                <td className="px-3 py-2 text-white/60 text-[10px]">{entry.accreditation || 'Dasar'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-[10px] text-white/30 mt-4 text-center italic">
                Skor di-lock saat mahasiswa melewati Hari ke-91. Pasca-stase tidak mengubah angka.
            </p>
        </div>
    );
}
