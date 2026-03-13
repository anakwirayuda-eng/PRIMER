/**
 * @reflection
 * [IDENTITY]: SaveSlotSelector (Aegis Command Center)
 * [PURPOSE]: Main Menu & Save Management.
 *            Art Direction: Tactical UI, Dossier Files, Blueprint Radar.
 * [STATE]: Stable
 * [ANCHOR]: SaveSlotSelector
 * [DEPENDS_ON]: AvatarRenderer, assets
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-11
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trash2, Play, Plus, Clock, Calendar, Award, Download, Upload, AlertCircle, ChevronDown, Activity, ShieldCheck, Fingerprint, Database, Server, Lock, Cpu } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer.jsx';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { parseSavePayload } from '../utils/savePayload.js';
import { safeGetStorageItem, safeSetStorageItem, safeRemoveStorageItem } from '../utils/browserSafety.js';

const MAX_SLOTS = 5;

// ═══ PRE-GENERATED DATA (outside render cycle — fixes C2) ═══
const RADAR_NODES = [...Array(30)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    isOutbreak: Math.random() > 0.75,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
}));

// ═══ SELF-CONTAINED CSS ═══
function buildCanonicalSave(saveBlob) {
    return parseSavePayload(saveBlob);
}

export function normalizeSlot(saveBlob, slotId) {
    const canonicalSave = buildCanonicalSave(saveBlob);
    if (!canonicalSave) {
        return { slotId, empty: true };
    }

    const profile = canonicalSave?.player?.profile || null;
    const day = canonicalSave?.world?.day || 1;
    const reputation = profile?.reputation ?? 80;
    const savedAt = canonicalSave?.savedAt || null;
    const saveVersion = canonicalSave?.saveVersion || null;
    return { slotId, profile, day, reputation, savedAt, saveVersion, saveData: canonicalSave, _raw: canonicalSave };
}

const MENU_CSS = `
    @keyframes sss-radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes sss-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
    @keyframes sss-pulse-ring-red { 0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(225, 29, 72, 0); } 100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); } }
    @keyframes sss-auth-flash { 0% { opacity: 0; background: white; } 10% { opacity: 1; background: white; } 100% { opacity: 1; background: #020617; } }
    @keyframes sss-slot-entry { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    .sss-blueprint-bg {
        background-color: #020617;
        background-image:
            linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
    }

    .sss-crt-scanline {
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
        background-size: 100% 4px;
        pointer-events: none;
    }

    .btn-tactical { border-bottom-width: 4px; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-tactical:active:not(:disabled) { border-bottom-width: 0px; transform: translateY(4px); }

    .dossier-card {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%);
        box-shadow: inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5);
    }
`;

export default function SaveSlotSelector({ onSelectSlot, onNewGame }) {
    const [slots, setSlots] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showSlots, setShowSlots] = useState(false);
    const [titleAnimDone, setTitleAnimDone] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const fileInputRef = useRef(null);
    const [importTargetSlot, setImportTargetSlot] = useState(null);
    const [overwriteTarget, setOverwriteTarget] = useState(null);
    const MAX_FILE_SIZE = 500 * 1024;

    const radarNodes = useMemo(() => RADAR_NODES, []);

    useEffect(() => { loadSlots(); }, []);
    useEffect(() => { const t = setTimeout(() => setTitleAnimDone(true), 800); return () => clearTimeout(t); }, []);
    useEffect(() => {
        if (notification) { const t = setTimeout(() => setNotification(null), 3500); return () => clearTimeout(t); }
    }, [notification]);
    const loadSlots = () => {
        const loadedSlots = [];
        for (let i = 0; i < MAX_SLOTS; i++) {
            const data = safeGetStorageItem(`primer_save_${i}`);
            if (data) {
                try {
                    const saveBlob = JSON.parse(data);
                    loadedSlots.push(normalizeSlot(saveBlob, i));
                } catch { loadedSlots.push({ slotId: i, empty: true }); }
            } else loadedSlots.push({ slotId: i, empty: true });
        }
        setSlots(loadedSlots);
    };

    const handleDeleteSlot = (slotId) => {
        const didRemove = safeRemoveStorageItem(`primer_save_${slotId}`);
        loadSlots(); setConfirmDelete(null);
        setNotification({
            type: didRemove ? 'success' : 'error',
            message: didRemove
                ? `DATA OPERASIONAL SLOT 0${slotId + 1} DIHAPUS.`
                : `GAGAL MENGHAPUS DATA SLOT 0${slotId + 1}.`
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':');
    };

    // ─── Cinematic Handoff (Flashbang) ───
    const executeStartGame = (slotId, slotData) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        const payload = slotData?.saveData || slotData?._raw || slotData;
        setTimeout(() => onSelectSlot(slotId, payload), 1200);
    };

    const executeNewGame = (slotId) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => onNewGame(slotId), 1200);
    };

    // ─── Hardened Import / Export ───
    const handleExportSave = (slotId) => {
        const data = safeGetStorageItem(`primer_save_${slotId}`);
        if (!data) return;
        try {
            const saveBlob = JSON.parse(data);
            const canonicalSave = buildCanonicalSave(saveBlob);
            const exportData = { ...canonicalSave, _exportInfo: { exportedAt: new Date().toISOString(), gameVersion: '1.0', originalSlot: slotId } };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            const name = canonicalSave?.player?.profile?.name || 'Agent';
            const day = canonicalSave?.world?.day || 1;
            a.download = `PRIMER_Dossier_${name}_Day${day}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            setNotification({ type: 'success', message: 'BERKAS BERHASIL DIEKSPOR.' });
        } catch { setNotification({ type: 'error', message: 'GAGAL MENGEKSPOR BERKAS.' }); }
    };

    const handleExportAll = () => {
        const allSaves = {}; let hasAnySave = false;
        for (let i = 0; i < MAX_SLOTS; i++) {
            const data = safeGetStorageItem(`primer_save_${i}`);
            if (data) {
                try {
                    const saveBlob = JSON.parse(data);
                    const canonicalSave = buildCanonicalSave(saveBlob);
                    if (canonicalSave) {
                        allSaves[`slot_${i}`] = canonicalSave;
                        hasAnySave = true;
                    }
                } catch { continue; }
            }
        }
        if (!hasAnySave) { setNotification({ type: 'error', message: 'DATABASE KOSONG.' }); return; }
        const blob = new Blob([JSON.stringify({ _exportInfo: { exportedAt: new Date().toISOString(), type: 'all_saves' }, saves: allSaves }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `PRIMER_MasterDB_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        setNotification({ type: 'success', message: 'SELURUH DATABASE DIAMANKAN.' });
    };

    const handleImportClick = (slotId = null) => { setImportTargetSlot(slotId); fileInputRef.current?.click(); };

    const processImport = (slotId, data) => {
        try {
            const canonicalSave = buildCanonicalSave(data);
            if (!canonicalSave) throw new Error('Invalid save payload');
            const didWrite = safeSetStorageItem(`primer_save_${slotId}`, JSON.stringify(canonicalSave));
            if (!didWrite) throw new Error('Storage write failed');
            loadSlots(); setNotification({ type: 'success', message: `DOSSIER DITERIMA DI PORT 0${slotId + 1}.` });
            setOverwriteTarget(null);
        } catch { setNotification({ type: 'error', message: 'GAGAL MENYIMPAN DATA (QUOTA EXCEEDED).' }); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) { setNotification({ type: 'error', message: 'FILE TERLALU BESAR (Max 500KB)' }); e.target.value = ''; return; }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const payload = JSON.parse(event.target?.result);
                if (!payload || typeof payload !== 'object') throw new Error('Invalid JSON');
                if (payload._exportInfo?.type === 'all_saves' && payload.saves) {
                    let imported = 0;
                    Object.entries(payload.saves).forEach(([slotKey, saveBlob]) => {
                        const match = slotKey.match(/slot_(\d+)/);
                        if (!match) return;

                        const slotId = parseInt(match[1], 10);
                        if (slotId < 0 || slotId >= MAX_SLOTS) return;

                        const canonicalSave = buildCanonicalSave(saveBlob);
                        if (!canonicalSave) return;

                        if (safeSetStorageItem(`primer_save_${slotId}`, JSON.stringify(canonicalSave))) {
                            imported++;
                        }
                    });
                    loadSlots(); setNotification({ type: 'success', message: `${imported} DATA BERHASIL DIPULIHKAN.` });
                } else {
                    const { _exportInfo, ...importBlob } = payload;
                    const canonicalSave = buildCanonicalSave(importBlob);
                    if (!canonicalSave?.player?.profile) { setNotification({ type: 'error', message: 'FORMAT BERKAS KORUP.' }); return; }
                    const targetSlot = importTargetSlot !== null ? importTargetSlot : (_exportInfo?.originalSlot ?? 0);
                    if (targetSlot >= 0 && targetSlot < MAX_SLOTS) {
                        const isOccupied = !slots.find(s => s.slotId === targetSlot)?.empty;
                        if (isOccupied) setOverwriteTarget({ slotId: targetSlot, data: canonicalSave });
                        else processImport(targetSlot, canonicalSave);
                    }
                }
            } catch { setNotification({ type: 'error', message: 'DEKRIPSI FILE GAGAL.' }); }
        };
        reader.readAsText(file); e.target.value = '';
    };

    const hasSaves = slots.some(s => !s.empty);

    return (
        <div className="min-h-screen sss-blueprint-bg flex flex-col md:flex-row relative overflow-hidden text-slate-200 select-none">
            <style>{MENU_CSS}</style>

            {/* CRT Scanline */}
            <div className="absolute inset-0 sss-crt-scanline z-40 pointer-events-none" />
            {/* Flashbang Transition */}
            {isTransitioning && <div className="absolute inset-0 z-[200] mix-blend-screen pointer-events-none" style={{ animation: 'sss-auth-flash 1.2s ease-out forwards' }} />}

            {/* ═══ RADAR BACKGROUND ═══ */}
            <div className={`absolute inset-0 z-0 opacity-30 pointer-events-none transition-all duration-1000 ${isTransitioning ? 'scale-150 blur-xl opacity-0' : 'scale-100'}`}>
                <div className="absolute top-1/2 left-[30%] w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/20" />
                <div className="absolute top-1/2 left-[30%] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30" />
                <div className="absolute top-1/2 left-[30%] w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/40" />
                <div className="absolute top-1/2 left-[30%] w-[400px] h-[2px] bg-gradient-to-r from-emerald-500 to-transparent origin-left" style={{ animation: 'sss-radar-spin 6s linear infinite' }} />
                {radarNodes.map(node => (
                    <div key={node.id} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                        <div className={`rounded-full ${node.isOutbreak ? 'bg-rose-500' : 'bg-emerald-400'}`}
                             style={{
                                 width: node.size, height: node.size,
                                 animation: `${node.isOutbreak ? 'sss-pulse-ring-red' : 'sss-pulse-ring'} ${node.duration}s infinite ${node.delay}s`,
                             }} />
                    </div>
                ))}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

            {/* ═══ NOTIFICATION TOAST ═══ */}
            {notification && (
                <div className={`fixed top-8 right-8 z-[100] px-5 py-3 rounded-lg border-l-4 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] bg-slate-950/90 backdrop-blur-md
                    ${notification.type === 'success' ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}
                    style={{ animation: 'sss-slot-entry 0.3s ease-out' }}>
                    {notification.type === 'success' ? <Database size={20} /> : <AlertCircle size={20} />}
                    <div>
                        <div className="text-[9px] font-mono tracking-widest uppercase font-bold opacity-70 mb-0.5">System Notice</div>
                        <span className="font-bold text-sm tracking-wider">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* ═══ OVERWRITE MODAL ═══ */}
            {overwriteTarget && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#05080f] border-t-4 border-t-rose-600 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-[0_20px_60px_rgba(225,29,72,0.3)]"
                         style={{ animation: 'sss-slot-entry 0.3s ease-out' }}>
                        <div className="flex items-center gap-4 text-rose-500 mb-6 border-b border-rose-900/50 pb-4">
                            <AlertCircle size={36} className="animate-pulse" />
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest text-white">OVERWRITE PROTOCOL</h3>
                                <p className="text-[9px] font-mono tracking-widest uppercase mt-1">Data collision at Node 0{overwriteTarget.slotId + 1}</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-8 font-mono leading-relaxed">
                            Data operasional di Port 0{overwriteTarget.slotId + 1} akan ditimpa. Berkas lama akan <strong className="text-rose-400">dihapus permanen</strong> dari sistem lokal. Lanjutkan eksekusi?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setOverwriteTarget(null)} className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Batal</button>
                            <button onClick={() => processImport(overwriteTarget.slotId, overwriteTarget.data)} className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest btn-tactical border-b-rose-900 hover:bg-rose-500 flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                                <Trash2 size={14}/> FORCE OVERWRITE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════ LEFT PANEL: LORE & COMMAND CENTER ════════ */}
            <div className={`w-full md:w-5/12 lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10 transition-all duration-1000 ${titleAnimDone ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} ${isTransitioning ? 'opacity-0' : ''}`}>

                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <Activity size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <div className="font-mono text-[9px] text-emerald-500 tracking-[0.4em] uppercase font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> SISTEM ONLINE
                        </div>
                        <div className="font-black text-slate-300 text-xs tracking-widest uppercase mt-1">FKK — Institut Teknologi Sepuluh Nopember</div>
                    </div>
                </div>

                <h1 className="font-display text-6xl lg:text-7xl font-black tracking-[0.15em] text-white mb-2 leading-none" style={{ textShadow: '0 0 50px rgba(16,185,129,0.5)', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                    PRIMER
                </h1>
                <p className="text-emerald-500/80 text-[10px] uppercase tracking-[0.5em] font-mono font-bold mb-8">
                    Epidemiology Operating System
                </p>

                {/* Lore Quote */}
                <div className="bg-[#0a0f16]/80 backdrop-blur-sm border-l-4 border-emerald-500 p-5 rounded-r-xl max-w-sm shadow-lg mb-10">
                    <p className="text-slate-300 text-sm font-serif italic leading-relaxed">
                        &ldquo;Di balik setiap angka kematian, ada satu desa yang terlambat dijangkau.&rdquo;
                    </p>
                    <p className="text-emerald-500/60 text-[9px] uppercase tracking-[0.3em] font-mono mt-3 font-bold">
                        &mdash; Prinsip Pertama Surveilans
                    </p>
                </div>

                {/* Main Actions */}
                <div className="max-w-sm">
                    {!showSlots ? (
                        <button onClick={() => setShowSlots(true)}
                            className="w-full relative px-8 py-5 bg-emerald-600 text-white font-black text-lg tracking-[0.2em] uppercase rounded-xl btn-tactical border-b-emerald-900 shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:bg-emerald-500 flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-3"><Fingerprint size={20}/> {hasSaves ? 'AKSES DATABASE' : 'INISIASI SISTEM'}</span>
                            <Play size={20} className="transform group-hover:translate-x-2 transition-transform" />
                        </button>
                    ) : (
                        <button onClick={() => setShowSlots(false)}
                            className="text-slate-500 hover:text-emerald-400 text-xs font-mono uppercase tracking-[0.3em] flex items-center gap-2 transition-colors font-bold bg-slate-900/50 px-6 py-3 rounded-xl border border-slate-800"
                        >
                            <ChevronDown size={14} className="rotate-90" /> TUTUP DATABASE
                        </button>
                    )}

                    {hasSaves && !showSlots && (
                        <div className="flex gap-5 font-mono text-[9px] tracking-widest mt-6 opacity-60 justify-center">
                            <button onClick={handleExportAll} className="hover:text-emerald-400 flex items-center gap-1.5 uppercase"><Download size={12}/> Master Backup</button>
                            <span className="text-slate-700">|</span>
                            <button onClick={() => handleImportClick(null)} className="hover:text-cyan-400 flex items-center gap-1.5 uppercase"><Upload size={12}/> Restore OS</button>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-8 left-8 lg:left-16 flex flex-col gap-2">
                    <div className="flex items-center gap-4 opacity-40 grayscale">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-5 object-contain" />
                        <div className="h-3 w-px bg-slate-500" />
                        <img src={getAssetUrl(ASSET_KEY.FKK_LOGO)} alt="FKK" className="h-6 object-contain"
                             style={{ filter: 'brightness(0) invert(1)', mixBlendMode: 'screen' }} />
                    </div>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-mono">
                        &copy; 2026 Anak Agung Bagus Wirayuda MD PhD &bull; ITS MEDICS
                    </p>
                </div>
            </div>

            {/* ════════ RIGHT PANEL: DOSSIER FILES ════════ */}
            <div className={`w-full md:w-7/12 lg:w-1/2 p-4 md:p-8 flex items-center justify-center relative z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${showSlots ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32 pointer-events-none absolute lg:relative'}`}>

                <div className="w-full max-w-xl bg-[#0a0f16]/95 backdrop-blur-2xl border border-slate-800 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh]">

                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 shrink-0">
                        <div className="flex items-center gap-3">
                            <Server className="text-cyan-500" size={24} />
                            <div>
                                <h3 className="font-black text-white uppercase tracking-widest text-sm leading-none">ACTIVE DEPLOYMENTS</h3>
                                <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mt-1">Pilih profil agen untuk bertugas</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleExportAll} className="p-2.5 bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/50 rounded-xl transition-colors" title="Backup Seluruh Slot"><Download size={16} /></button>
                            <button onClick={() => handleImportClick(null)} className="p-2.5 bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 rounded-xl transition-colors" title="Restore Data"><Upload size={16} /></button>
                        </div>
                    </div>

                    {/* Slots */}
                    <div className="p-5 flex-1 overflow-y-auto space-y-4 thin-scrollbar">
                        {slots.map((slot, index) => (
                            <div key={slot.slotId} style={{ animation: `sss-slot-entry 0.5s ease-out forwards ${index * 0.1}s`, opacity: 0 }}>
                                <div className={`dossier-card rounded-2xl transition-all duration-300 border-l-4 relative overflow-hidden group
                                    ${slot.empty ? 'border-l-slate-700 bg-slate-900/40 hover:border-l-cyan-500 hover:bg-slate-900/80 border border-transparent' : 'border-l-emerald-500 border border-slate-800 hover:border-emerald-500/30'}`}>

                                    {slot.empty ? (
                                        <div className="flex items-center justify-between p-5">
                                            <div className="flex items-center gap-4 text-slate-600 font-mono text-[10px] tracking-[0.2em] uppercase">
                                                <Lock size={20} className="group-hover:text-cyan-500 transition-colors" />
                                                <div>
                                                    <div className="group-hover:text-cyan-400 transition-colors font-bold text-xs mb-1">NODE 0{slot.slotId + 1} : [ UNASSIGNED ]</div>
                                                    <div className="opacity-70">Tersedia untuk Registrasi Baru</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleImportClick(slot.slotId)} disabled={isTransitioning} className="p-3 border border-slate-800 hover:border-blue-900 text-slate-500 hover:text-blue-400 rounded-xl transition-colors bg-slate-900">
                                                    <Upload size={16} />
                                                </button>
                                                <button onClick={() => executeNewGame(slot.slotId)} disabled={isTransitioning} className="px-6 py-3 bg-cyan-950/40 text-cyan-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-600 hover:text-white transition-all btn-tactical border-b-cyan-900 flex items-center gap-2 border border-cyan-800">
                                                    <Plus size={16} /> INISIASI
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 relative z-10">
                                            <div className="flex justify-between items-start mb-3 ml-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700 p-1 shadow-inner shrink-0 relative overflow-hidden">
                                                        <AvatarRenderer avatar={slot.profile?.avatar} size={54} />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-[7px] font-mono text-center text-white font-bold py-0.5">VERIFIED</div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-mono text-emerald-400 tracking-widest flex items-center gap-1"><ShieldCheck size={10}/> STATUS: ACTIVE</span>
                                                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest border-l border-slate-700 pl-2">AEGIS-0{slot.slotId + 1}</span>
                                                        </div>
                                                        <h3 className="font-black text-white text-xl uppercase tracking-wider mb-2 truncate max-w-[200px]">dr. {slot.profile?.name}</h3>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50"><Calendar size={10}/> Hari {slot.day || 1}</span>
                                                            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1.5 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/50"><Award size={10}/> Rep: {slot.reputation || 80}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {confirmDelete === slot.slotId ? (
                                                        <div className="flex flex-col gap-1 bg-rose-950/80 p-1 rounded-xl border border-rose-900">
                                                            <button onClick={() => handleDeleteSlot(slot.slotId)} className="px-4 py-2 text-[9px] font-black uppercase text-white bg-rose-600 rounded-lg hover:bg-rose-500">Purge</button>
                                                            <button onClick={() => setConfirmDelete(null)} className="px-4 py-1.5 text-[9px] text-slate-300 bg-slate-900 rounded-lg hover:text-white">Batal</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleExportSave(slot.slotId)} disabled={isTransitioning} className="p-2.5 text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-700 hover:border-cyan-800 rounded-lg transition-colors" title="Export Dossier"><Download size={14}/></button>
                                                            <button onClick={() => setConfirmDelete(slot.slotId)} disabled={isTransitioning} className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-700 hover:border-rose-800 rounded-lg transition-colors" title="Delete Dossier"><Trash2 size={14}/></button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-2 mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                                <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5"><Clock size={10}/> LAST_SYNC: {formatDate(slot.savedAt)}</div>
                                                <button onClick={() => executeStartGame(slot.slotId, slot)} disabled={isTransitioning}
                                                    className="px-8 py-3 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 btn-tactical border-b-emerald-900 shadow-[0_5px_15px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2"
                                                >
                                                    <Cpu size={14} /> OTORISASI LOGIN
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { MAX_SLOTS };
