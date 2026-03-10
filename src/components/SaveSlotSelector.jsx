/**
 * @reflection
 * [IDENTITY]: SaveSlotSelector
 * [PURPOSE]: React UI component: MAX_SLOTS.
 * [STATE]: Experimental
 * [ANCHOR]: SaveSlotSelector
 * [DEPENDS_ON]: AvatarRenderer
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Play, Plus, Clock, Calendar, Award, Download, Upload, CheckCircle, AlertCircle, ChevronDown, Dna } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer.jsx';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';

const MAX_SLOTS = 5;

export default function SaveSlotSelector({ onSelectSlot, onNewGame }) {
    const [slots, setSlots] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showSlots, setShowSlots] = useState(false);
    const [titleAnimDone, setTitleAnimDone] = useState(false);

    // --- New State for Import Hardening ---
    const fileInputRef = useRef(null);
    const [importTargetSlot, setImportTargetSlot] = useState(null);
    const [overwriteTarget, setOverwriteTarget] = useState(null);
    const MAX_FILE_SIZE = 500 * 1024; // 500KB limit
    // --------------------------------------

    useEffect(() => { loadSlots(); }, []);

    // Title animation sequence
    useEffect(() => {
        const timer = setTimeout(() => setTitleAnimDone(true), 1800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const loadSlots = () => {
        const loadedSlots = [];
        for (let i = 0; i < MAX_SLOTS; i++) {
            const key = `primer_save_${i}`;
            const data = localStorage.getItem(key);
            if (data) {
                try { loadedSlots.push({ slotId: i, ...JSON.parse(data) }); }
                catch { loadedSlots.push({ slotId: i, empty: true }); }
            } else {
                loadedSlots.push({ slotId: i, empty: true });
            }
        }
        setSlots(loadedSlots);
    };

    const handleDeleteSlot = (slotId) => {
        localStorage.removeItem(`primer_save_${slotId}`);
        loadSlots();
        setConfirmDelete(null);
        setNotification({ type: 'success', message: `Slot ${slotId + 1} berhasil dihapus` });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const d = new Date(timestamp);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleExportSave = (slotId) => {
        const key = `primer_save_${slotId}`;
        const data = localStorage.getItem(key);
        if (!data) { setNotification({ type: 'error', message: 'Tidak ada data untuk diekspor' }); return; }
        try {
            const parsed = JSON.parse(data);
            const exportData = { ...parsed, _exportInfo: { exportedAt: new Date().toISOString(), gameVersion: '1.0', originalSlot: slotId } };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `PRIMER_Save_${parsed.profile?.name || 'Unknown'}_Day${parsed.day || 1}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            setNotification({ type: 'success', message: `Save berhasil diekspor!` });
        } catch { setNotification({ type: 'error', message: 'Gagal mengekspor save' }); }
    };

    const handleExportAll = () => {
        const allSaves = {}; let hasAnySave = false;
        for (let i = 0; i < MAX_SLOTS; i++) {
            const data = localStorage.getItem(`primer_save_${i}`);
            if (data) { try { allSaves[`slot_${i}`] = JSON.parse(data); hasAnySave = true; } catch { /* ignore corrupt saves */ } }
        }
        if (!hasAnySave) { setNotification({ type: 'error', message: 'Tidak ada save untuk diekspor' }); return; }
        const blob = new Blob([JSON.stringify({ _exportInfo: { exportedAt: new Date().toISOString(), gameVersion: '1.0', type: 'all_saves' }, saves: allSaves }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `PRIMER_AllSaves_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        setNotification({ type: 'success', message: 'Semua save berhasil diekspor!' });
    };

    const handleImportClick = (slotId = null) => { setImportTargetSlot(slotId); fileInputRef.current?.click(); };

    // --- Hardened Import Logic ---

    const processImport = (slotId, data) => {
        try {
            localStorage.setItem(`primer_save_${slotId}`, JSON.stringify(data));
            loadSlots();
            setNotification({ type: 'success', message: `Save berhasil diimpor ke Slot ${slotId + 1}!` });
            setOverwriteTarget(null);
        } catch (e) {
            console.error('Import failed:', e);
            setNotification({ type: 'error', message: 'Gagal menyimpan data (Quota Exceeded?)' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Size Validation
        if (file.size > MAX_FILE_SIZE) {
            setNotification({ type: 'error', message: `File terlalu besar (Max ${MAX_FILE_SIZE / 1024}KB)` });
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result);

                // 2. Structure Validation
                if (!data || typeof data !== 'object') throw new Error('Invalid JSON');

                // Check for 'all_saves' package
                if (data._exportInfo?.type === 'all_saves' && data.saves) {
                    let imported = 0;
                    Object.entries(data.saves).forEach(([slotKey, saveData]) => {
                        const match = slotKey.match(/slot_(\d+)/);
                        if (match) {
                            const slotId = parseInt(match[1]);
                            if (slotId >= 0 && slotId < MAX_SLOTS) {
                                // For bulk import, we currently skip confirmation (or it would be too spammy)
                                const { _exportInfo, ...cleanData } = saveData;
                                localStorage.setItem(`primer_save_${slotId}`, JSON.stringify(cleanData));
                                imported++;
                            }
                        }
                    });
                    loadSlots();
                    setNotification({ type: 'success', message: `${imported} save berhasil diimpor!` });
                } else {
                    // Single Save Import
                    const { _exportInfo, ...cleanData } = data;

                    // Validate essential fields
                    if (!cleanData.profile || !cleanData.stats) {
                        setNotification({ type: 'error', message: 'Format save file tidak valid (Missing profile/stats)' });
                        return;
                    }

                    const targetSlot = importTargetSlot !== null ? importTargetSlot : (_exportInfo?.originalSlot ?? 0);

                    if (targetSlot >= 0 && targetSlot < MAX_SLOTS) {
                        // Check if slot is occupied
                        const isOccupied = !slots.find(s => s.slotId === targetSlot)?.empty;

                        // 3. Overwrite Confirmation
                        if (isOccupied) {
                            setOverwriteTarget({ slotId: targetSlot, data: cleanData });
                        } else {
                            processImport(targetSlot, cleanData);
                        }
                    } else {
                        setNotification({ type: 'error', message: 'Slot tidak valid' });
                    }
                }
            } catch (err) {
                console.error(err);
                setNotification({ type: 'error', message: 'File rusak atau bukan JSON valid' });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const hasSaves = slots.some(s => !s.empty);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" aria-label="Pilih file save untuk diimpor" />

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2
                    ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                    role="alert" aria-live="polite">
                    {notification.type === 'success' ? <CheckCircle size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
                    <span className="font-medium text-sm">{notification.message}</span>
                </div>
            )}

            {/* Overwrite Confirmation Modal */}
            {overwriteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" role="alertdialog" aria-modal="true" aria-labelledby="overwrite-title">
                        <div className="flex items-center gap-3 text-amber-500 mb-4">
                            <AlertCircle size={32} aria-hidden="true" />
                            <h3 id="overwrite-title" className="text-lg font-bold">Konfirmasi Timpa Data</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-6">
                            Slot {overwriteTarget.slotId + 1} sudah berisi data. Apakah Anda yakin ingin menimpanya?
                            <br /><span className="text-red-400 text-xs mt-2 block">Data lama akan hilang permanen.</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOverwriteTarget(null)}
                                className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 text-sm font-medium transition-colors"
                                aria-label="Batalkan impor"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => processImport(overwriteTarget.slotId, overwriteTarget.data)}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 text-sm font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                                aria-label={`Timpa data di Slot ${overwriteTarget.slotId + 1}`}
                            >
                                Ya, Timpa Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute rounded-full"
                        style={{
                            width: 2 + Math.random() * 3,
                            height: 2 + Math.random() * 3,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `rgba(${i % 3 === 0 ? '16,185,129' : i % 3 === 1 ? '59,130,246' : '139,92,246'}, ${0.15 + Math.random() * 0.2})`,
                            animation: `slot-float ${8 + Math.random() * 12}s ease-in-out infinite alternate`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* ========== TITLE SCREEN ========== */}
            <div className={`flex flex-col items-center transition-all duration-1000 ${showSlots ? 'mb-4' : 'mb-0'}`}>
                {/* Logo with Stethoscope */}
                <div className={`transition-all duration-1000 ${titleAnimDone ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                    <div className="flex justify-center mb-4">
                        <div className="bg-emerald-500/15 p-4 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-900/30">
                            <Dna size={44} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* PRIMER Logo — SVG custom font for trademark consistency */}
                <div className={`transition-all duration-700 delay-300 ${titleAnimDone ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <h1 className="text-center select-none">
                        <span className="font-display text-5xl md:text-6xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-white"
                            style={{
                                textShadow: '0 0 40px rgba(16,185,129,0.3)',
                                WebkitTextStroke: '0.5px rgba(255,255,255,0.1)',
                            }}>
                            PRIMER
                        </span>
                    </h1>
                    <p className="text-center text-emerald-300/60 text-xs uppercase tracking-[0.3em] mt-2 font-medium">
                        Primary Care Manager Simulator
                    </p>
                </div>

                {/* Tagline */}
                <div className={`mt-6 transition-all duration-700 delay-700 ${titleAnimDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-white/40 text-sm italic text-center max-w-md px-4">
                        "Bridging clinical excellence and public health leadership."
                    </p>
                </div>

                {/* Action Buttons - Game Style */}
                <div className={`mt-8 flex flex-col items-center gap-3 transition-all duration-700 delay-1000 ${titleAnimDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {!showSlots ? (
                        <>
                            <button
                                onClick={() => setShowSlots(true)}
                                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-900/50 hover:shadow-emerald-700/50 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-105 active:scale-95"
                                aria-label={hasSaves ? 'Lanjutkan permainan — pilih save slot' : 'Mulai permainan baru'}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Play size={22} aria-hidden="true" /> {hasSaves ? 'Lanjutkan Permainan' : 'Mulai Permainan'}
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                            </button>

                            {hasSaves && (
                                <button
                                    onClick={() => {
                                        const emptySlot = slots.find(s => s.empty);
                                        if (emptySlot) onNewGame(emptySlot.slotId);
                                        else setNotification({ type: 'error', message: 'Semua slot penuh. Hapus salah satu terlebih dahulu.' });
                                    }}
                                    className="px-6 py-2.5 text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-lg text-sm transition-all hover:bg-white/5"
                                >
                                    <Plus size={16} className="inline mr-1" /> Game Baru
                                </button>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button onClick={handleExportAll} className="text-xs text-emerald-400/60 hover:text-emerald-300 transition-colors flex items-center gap-1" aria-label="Ekspor semua save">
                                    <Download size={12} aria-hidden="true" /> Ekspor
                                </button>
                                <span className="text-white/10" aria-hidden="true">|</span>
                                <button onClick={() => handleImportClick(null)} className="text-xs text-blue-400/60 hover:text-blue-300 transition-colors flex items-center gap-1" aria-label="Impor save dari file">
                                    <Upload size={12} aria-hidden="true" /> Impor
                                </button>
                            </div>
                        </>
                    ) : (
                        <button onClick={() => setShowSlots(false)}
                            className="text-white/40 hover:text-white/70 text-sm flex items-center gap-1 transition-colors">
                            <ChevronDown size={14} className="rotate-180" /> Kembali ke Judul
                        </button>
                    )}
                </div>
            </div>

            {/* ========== SAVE SLOTS PANEL (slides up) ========== */}
            <div className={`w-full max-w-lg px-4 transition-all duration-500 ${showSlots
                ? 'opacity-100 translate-y-0 max-h-[600px] mt-4'
                : 'opacity-0 translate-y-8 max-h-0 overflow-hidden pointer-events-none'}`}>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white/80">Pilih Save Slot</h2>
                        <div className="flex gap-2">
                            <button onClick={handleExportAll} className="px-2.5 py-1 text-[10px] bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 flex items-center gap-1 font-medium border border-emerald-500/20" aria-label="Ekspor semua save">
                                <Download size={10} aria-hidden="true" /> Ekspor
                            </button>
                            <button onClick={() => handleImportClick(null)} className="px-2.5 py-1 text-[10px] bg-blue-500/15 text-blue-400 rounded-lg hover:bg-blue-500/25 flex items-center gap-1 font-medium border border-blue-500/20" aria-label="Impor save dari file">
                                <Upload size={10} aria-hidden="true" /> Impor
                            </button>
                        </div>
                    </div>

                    <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto thin-scrollbar">
                        {slots.map((slot) => (
                            <div key={slot.slotId}
                                className={`rounded-xl p-3 transition-all ${slot.empty
                                    ? 'border border-dashed border-white/10 hover:border-white/20 bg-white/[0.02]'
                                    : 'border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30'}`}>
                                {slot.empty ? (
                                    <div className="flex items-center justify-center gap-4 py-1">
                                        <button onClick={() => onNewGame(slot.slotId)} className="flex items-center gap-2 text-white/40 hover:text-emerald-300 transition-colors text-sm" aria-label={`Mulai game baru di Slot ${slot.slotId + 1}`}>
                                            <Plus size={16} aria-hidden="true" /> Slot {slot.slotId + 1} — Game Baru
                                        </button>
                                        <span className="text-white/10" aria-hidden="true">|</span>
                                        <button onClick={() => handleImportClick(slot.slotId)} className="flex items-center gap-1 text-blue-400/50 hover:text-blue-300 text-xs transition-colors" aria-label={`Impor save ke Slot ${slot.slotId + 1}`}>
                                            <Upload size={12} aria-hidden="true" /> Impor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 bg-white/10 rounded-xl p-1">
                                            <AvatarRenderer avatar={slot.profile?.avatar} size={48} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-white text-sm truncate">
                                                dr. {slot.profile?.name || 'Unknown'}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/40 mt-0.5">
                                                <span className="flex items-center gap-0.5"><Calendar size={10} /> Hari {slot.day || 1}</span>
                                                <span className="flex items-center gap-0.5"><Award size={10} /> Rep: {slot.reputation || 80}</span>
                                                <span className="flex items-center gap-0.5"><Clock size={10} /> {formatDate(slot.savedAt)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1.5 flex-shrink-0">
                                            <button onClick={() => onSelectSlot(slot.slotId, slot)}
                                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1 text-xs font-bold transition-all shadow shadow-emerald-900/50"
                                                aria-label={`Lanjutkan permainan dr. ${slot.profile?.name || 'Unknown'} — Hari ${slot.day || 1}`}>
                                                <Play size={12} aria-hidden="true" /> Lanjut
                                            </button>
                                            <button onClick={() => handleExportSave(slot.slotId)}
                                                className="p-1.5 text-emerald-400/50 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                aria-label={`Ekspor save Slot ${slot.slotId + 1}`}>
                                                <Download size={14} />
                                            </button>
                                            {confirmDelete === slot.slotId ? (
                                                <div className="flex gap-1" role="group" aria-label="Konfirmasi hapus">
                                                    <button onClick={() => handleDeleteSlot(slot.slotId)} className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] hover:bg-red-500" aria-label={`Konfirmasi hapus Slot ${slot.slotId + 1}`}>Hapus</button>
                                                    <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 bg-white/10 text-white/60 rounded-lg text-[10px] hover:bg-white/20" aria-label="Batalkan hapus">×</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setConfirmDelete(slot.slotId)}
                                                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    aria-label={`Hapus save Slot ${slot.slotId + 1}`}>
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`mt-8 flex flex-col items-center gap-2 transition-all duration-700 delay-1200 ${titleAnimDone ? 'opacity-100' : 'opacity-0'}`}>
                <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-8 object-contain opacity-30 hover:opacity-50 transition-opacity" />
                <p className="text-[9px] text-white/20 uppercase tracking-widest">
                    © 2026 Anak Agung Bagus Wirayuda MD PhD • ITS MEDICS
                </p>
            </div>

            {/* Global Styles */}
        </div>
    );
}

export { MAX_SLOTS };
