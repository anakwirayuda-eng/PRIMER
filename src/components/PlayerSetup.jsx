/**
 * @reflection
 * [IDENTITY]: PlayerSetup (Aegis Registration Protocol)
 * [PURPOSE]: Cinematic character creation — diegetic terminal UI with RPG age trade-offs,
 *            biometric scanner frame, ID card skeuomorphism, and stamp + flashbang handoff.
 * [STATE]: Production
 * [ANCHOR]: PlayerSetup
 * [DEPENDS_ON]: AvatarRenderer, AppMetadata, assets
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-11
 */

import React, { useState, useMemo } from 'react';
import { User, ChevronRight, ChevronLeft, Palette, Scissors, IdCard, Fingerprint, FileSignature, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import AvatarRenderer, { SKIN_TONES, HAIR_COLORS } from './AvatarRenderer.jsx';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { pickDeterministic } from '../utils/deterministicRandom.js';

// ─── Backward compat export for AvatarSelectionModal ───
// eslint-disable-next-line react-refresh/only-export-components
export const AVATARS = [
    { id: 'doc_male_1', name: 'Dr. Pria', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'Dr. Wanita', icon: '👩‍⚕️', color: 'bg-pink-500' },
    { id: 'doc_male_2', name: 'Dr. Pria 2', icon: '🧑‍⚕️', color: 'bg-green-500' },
    { id: 'doc_female_2', name: 'Dr. Wanita 2', icon: '👩🏽‍⚕️', color: 'bg-purple-500' },
];

// ─── Derived from AvatarRenderer exports ───
const SKIN_OPTIONS = Object.entries(SKIN_TONES).map(([key, hex]) => ({ id: key, hex }));
const HAIR_COLOR_OPTIONS = Object.entries(HAIR_COLORS).map(([key, hex]) => ({ id: key, hex }));
const HAIR_STYLE_OPTIONS_MALE = ['buzz', 'short', 'neat', 'parted'];
const HAIR_STYLE_OPTIONS_FEMALE = ['short', 'neat', 'long', 'ponytail', 'bun', 'hijab'];

const ACCESSORY_OPTIONS = [
    { id: 'glasses', label: 'Kacamata Optik', icon: '👓' },
    { id: 'stethoscope', label: 'Stetoskop Klinis', icon: '🩺' },
];

const HAIR_STYLE_LABELS = {
    buzz: 'Cepak Taktis', short: 'Pendek', neat: 'Rapi Standar', parted: 'Belah Sisi',
    long: 'Panjang', ponytail: 'Kuncir Kuda', bun: 'Sanggul Medis', hijab: 'Hijab Klinis',
};

// ─── Kinetic CSS (self-contained, no external keyframes needed) ───
const SETUP_CSS = `
    @keyframes sp-fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes sp-pulse-slow { 0%, 100% { opacity: 0.05; transform: scale(1); } 50% { opacity: 0.2; transform: scale(1.2); } }
    @keyframes sp-scanline { 0% { transform: translateY(-10px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(180px); opacity: 0; } }
    @keyframes sp-holo-spin { from { transform: rotateX(70deg) rotateZ(0deg); } to { transform: rotateX(70deg) rotateZ(360deg); } }
    @keyframes sp-foil-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes sp-stamp-smash { 0% { transform: scale(4) rotate(-25deg); opacity: 0; } 100% { transform: scale(1) rotate(-10deg); opacity: 0.95; filter: drop-shadow(0 0 20px rgba(225, 29, 72, 0.5)); } }
    @keyframes sp-flashbang { 0% { opacity: 0; background: transparent; } 15% { opacity: 1; background: white; } 100% { opacity: 1; background: #020617; } }
    @keyframes sp-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px) rotate(-1deg); } 40% { transform: translateX(8px) rotate(1deg); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

    .sp-animate-fadeIn { animation: sp-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .sp-animate-stamp { animation: sp-stamp-smash 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .sp-animate-shake { animation: sp-shake 0.4s ease-out; }
    .sp-animate-flash { animation: sp-flashbang 1.8s ease-out forwards; pointer-events: none; }
    .sp-animate-scan { animation: sp-scanline 2.5s linear infinite; }
    .sp-holo-foil { background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.5) 30%, rgba(6,182,212,0.3) 40%, rgba(255,255,255,0.5) 50%, transparent 60%); background-size: 200% auto; animation: sp-foil-shimmer 4s infinite linear; mix-blend-mode: hard-light; pointer-events: none; }
`;

// Pre-generated particles (outside render — no Math.random in JSX)
const BG_PARTICLES = [...Array(15)].map((_, i) => ({
    id: i, w: 4 + Math.random() * 8, h: 4 + Math.random() * 8,
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    delay: `-${Math.random() * 5}s`, duration: `${4 + Math.random() * 4}s`,
}));

// Alternating thematic quotes for the confirmation step
const BRIEFING_QUOTES = [
    { text: 'Satu Puskesmas. Satu desa terpencil. Ribuan nyawa yang menunggu keputusan Anda.', src: 'Briefing Penugasan PRIMER' },
    { text: 'Menyelamatkan satu nyawa membutuhkan stetoskop di IGD. Menyelamatkan ribuan nyawa membutuhkan Peta dan Kebijakan.', src: 'Prinsip Kesehatan Masyarakat' },
    { text: 'Tugas Anda bukan hanya menyembuhkan — tetapi mencegah, mendidik, dan membangun ketahanan komunitas.', src: 'Misi Puskesmas' },
    { text: 'Di desa ini, Anda adalah garis pertahanan pertama dan terakhir. Setiap keputusan berdampak pada generasi.', src: 'Orientasi Lapangan' },
    { text: 'Data epidemiologi adalah kompas Anda. Tanpanya, Anda hanya menebak di kegelapan.', src: 'Doktrin Surveilans' },
    { text: 'Anggaran terbatas. Waktu terbatas. Harapan masyarakat tak terbatas. Selamat bertugas, Dokter.', src: 'Nota Dinas No. 001' },
];

export default function PlayerSetup({ onComplete }) {
    const [step, setStep] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [gender, setGender] = useState('L');
    const [age, setAge] = useState(28);
    const [idNumber, setIdNumber] = useState('');
    const [idType, setIdType] = useState('NIP');

    const [skinTone, setSkinTone] = useState('fair');
    const [hairStyle, setHairStyle] = useState('neat');
    const [hairColor, setHairColor] = useState('black');
    const [accessories, setAccessories] = useState(['stethoscope']);

    const [error, setError] = useState('');
    const [isAuthorizing, setIsAuthorizing] = useState(false);

    const availableHairStyles = gender === 'L' ? HAIR_STYLE_OPTIONS_MALE : HAIR_STYLE_OPTIONS_FEMALE;
    const effectiveHairStyle = availableHairStyles.includes(hairStyle) ? hairStyle : availableHairStyles[0];

    const avatarData = useMemo(() => ({
        skinTone, hairStyle: effectiveHairStyle, hairColor, gender, accessories,
    }), [skinTone, effectiveHairStyle, hairColor, gender, accessories]);

    // RPG Age Trade-Off: young = high energy low rep, old = low energy high rep
    const derivedStats = useMemo(() => ({
        energy: Math.max(60, 120 - (age - 24)),
        rep: Math.min(100, 50 + (age - 24)),
    }), [age]);

    // Alternating quote — picked once on mount
    const activeQuote = useMemo(
        () => pickDeterministic(BRIEFING_QUOTES, 'player-setup-briefing') || BRIEFING_QUOTES[0],
        []
    );

    const toggleAccessory = (accId) => setAccessories(prev =>
        prev.includes(accId) ? prev.filter(a => a !== accId) : [...prev, accId]
    );

    const handleNext = () => {
        if (step === 0) {
            if (!playerName.trim()) { setError('AUTENTIKASI GAGAL: Nomenklatur Medis wajib diisi.'); return; }
            if (playerName.trim().length < 2) { setError('AUTENTIKASI GAGAL: Format nama tidak valid.'); return; }
            setError(''); setStep(1);
        } else if (step === 1) {
            setStep(2);
        }
    };

    const handleBack = () => { setError(''); setStep(s => Math.max(0, s - 1)); };

    const handleAuthorize = () => {
        if (isAuthorizing) return;
        setIsAuthorizing(true);
        setTimeout(() => {
            const profile = {
                name: playerName.trim(), gender, age,
                idType: idNumber.trim() ? idType : null,
                idNumber: idNumber.trim() || null,
                initialStats: { maxEnergy: derivedStats.energy, baseReputation: derivedStats.rep },
                avatar: {
                    id: `agent_${Date.now()}`, name: `dr. ${playerName.trim()}`,
                    icon: gender === 'L' ? '👨‍⚕️' : '👩‍⚕️',
                    color: gender === 'L' ? 'bg-blue-500' : 'bg-pink-500',
                    skinTone, hairStyle: effectiveHairStyle, hairColor, accessories, gender,
                },
                createdAt: Date.now()
            };
            onComplete(profile, null);
        }, 1800);
    };

    const STEP_DEFS = [
        { step: 0, label: 'Kredensial Identitas', desc: 'Sistem Data Kependudukan' },
        { step: 1, label: 'Pemindaian Biometrik', desc: 'Visual Profiling' },
        { step: 2, label: 'Penerbitan S.K', desc: 'Otorisasi & Sumpah Dokter' },
    ];

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none ${isAuthorizing ? 'sp-animate-shake' : ''}`}
             style={{
                 backgroundColor: '#020617',
                 backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
             }}>
            <style>{SETUP_CSS}</style>

            {/* Flashbang transition */}
            {isAuthorizing && <div className="absolute inset-0 z-[200] sp-animate-flash" />}

            {/* CRT scanline */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-50"
                 style={{ background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)', backgroundSize: '100% 4px' }} />

            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {BG_PARTICLES.map(p => (
                    <div key={p.id} className="absolute rounded-full opacity-20"
                        style={{ width: p.w, height: p.h, left: p.left, top: p.top,
                            background: p.id % 2 === 0 ? '#10b981' : '#3b82f6',
                            animation: `sp-pulse-slow ${p.duration} ease-in-out infinite alternate`,
                            animationDelay: p.delay }} />
                ))}
            </div>

            <div className={`relative w-full max-w-4xl z-10 flex flex-col md:flex-row gap-6 transition-all duration-700 ${isAuthorizing ? 'scale-[1.02]' : 'scale-100'}`}>

                {/* ════ LEFT: LORE PANEL ════ */}
                <div className="w-full md:w-1/3 flex flex-col justify-center border-l-4 border-emerald-500 pl-6 sp-animate-fadeIn">
                    <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-2xl w-fit mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <ShieldCheck size={36} className="text-emerald-400" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-black tracking-widest text-white leading-tight mb-2 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        AEGIS<br/>REGISTRY
                    </h1>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] font-mono mb-10 font-bold bg-emerald-950/50 py-1 px-2 inline-block border border-emerald-900 rounded">
                        Protokol Otorisasi Medis
                    </p>

                    <div className="space-y-6 hidden md:block">
                        {STEP_DEFS.map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${step === s.step ? 'opacity-100 scale-105 translate-x-2' : step > s.step ? 'opacity-50' : 'opacity-20'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s.step ? 'border-emerald-500 text-emerald-400 bg-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-700 text-slate-500'}`}>
                                    {step > s.step ? <CheckCircle2 size={16}/> : i + 1}
                                </div>
                                <div>
                                    <div className={`text-xs font-black uppercase tracking-widest ${step === s.step ? 'text-white' : 'text-slate-400'}`}>{s.label}</div>
                                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════ RIGHT: INTERACTIVE TERMINAL ════ */}
                <div className="w-full md:w-2/3 bg-[#0a0f16]/95 backdrop-blur-2xl rounded-3xl border border-slate-700 shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative min-h-[550px]">

                    {/* Terminal Header */}
                    <div className="bg-slate-900 border-b border-slate-800 p-5 flex justify-between items-center shrink-0 z-10">
                        <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            FKK — INSTITUT TEKNOLOGI SEPULUH NOPEMBER
                        </div>
                        <div className="font-mono text-[10px] text-cyan-400 font-bold tracking-widest border border-cyan-900 bg-cyan-950/50 px-3 py-1.5 rounded">
                            STEP 0{step + 1} / 03
                        </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10">

                        {/* ═══ STEP 0: IDENTITY ═══ */}
                        {step === 0 && (
                            <div className="space-y-6 sp-animate-fadeIn">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">
                                        <Fingerprint size={14} /> KODE GENETIK (GENDER)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { g: 'L', emoji: '👨‍⚕️', label: 'LAKI-LAKI', activeClass: 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]' },
                                            { g: 'P', emoji: '👩‍⚕️', label: 'PEREMPUAN', activeClass: 'border-pink-500 bg-pink-950/40 text-pink-300 shadow-[inset_0_0_20px_rgba(236,72,153,0.2)]' },
                                        ].map(opt => (
                                            <button key={opt.g} onClick={() => setGender(opt.g)}
                                                className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2 ${gender === opt.g ? opt.activeClass : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                                                <span className="text-3xl drop-shadow-md opacity-90">{opt.emoji}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">
                                        <User size={14} /> NOMENKLATUR MEDIS
                                    </label>
                                    <div className="flex items-stretch bg-slate-950 border border-slate-700 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all shadow-inner">
                                        <span className="px-5 flex items-center justify-center bg-slate-900 border-r border-slate-800 text-slate-400 font-black text-sm">dr.</span>
                                        <input type="text" value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value.replace(/[^a-zA-Z\s.,]/g, '').toUpperCase())}
                                            placeholder="KETIK NAMA LENGKAP..."
                                            maxLength={30}
                                            className="w-full px-4 py-4 bg-transparent text-white font-black tracking-widest outline-none placeholder-slate-700 uppercase" />
                                    </div>
                                </div>

                                {/* Age RPG Trade-Off */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                                        <div className="flex justify-between items-end mb-3">
                                            <label className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">USIA KLINIS</label>
                                            <span className="text-amber-400 font-black text-xl">{age} <span className="text-xs text-amber-500/50">Thn</span></span>
                                        </div>
                                        <input type="range" min={24} max={65} value={age}
                                            onChange={(e) => setAge(parseInt(e.target.value))}
                                            className="w-full accent-amber-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer mb-3" />
                                        <div className="space-y-2 border-t border-slate-800 pt-3">
                                            <div>
                                                <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1 uppercase">
                                                    <span>Stamina (AP)</span><span className="text-emerald-400 font-bold">{derivedStats.energy}</span>
                                                </div>
                                                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(derivedStats.energy / 120) * 100}%` }}/>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1 uppercase">
                                                    <span>Wibawa (Rep)</span><span className="text-purple-400 font-bold">{derivedStats.rep}</span>
                                                </div>
                                                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500 transition-all" style={{ width: `${derivedStats.rep}%` }}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <label className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">
                                            <IdCard size={14} /> OTORITAS ID
                                        </label>
                                        <div className="flex gap-2">
                                            <select value={idType} onChange={(e) => setIdType(e.target.value)}
                                                className="w-24 px-3 py-4 bg-slate-900 border border-slate-700 rounded-xl text-cyan-400 font-black text-xs text-center focus:outline-none cursor-pointer">
                                                <option value="NIP">NIP</option>
                                                <option value="NIK">NIK</option>
                                                <option value="NIM">NIM</option>
                                            </select>
                                            <input type="text" value={idNumber}
                                                onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                                                placeholder="OPSIONAL"
                                                className="flex-1 px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 1: BIOMETRIC SCAN ═══ */}
                        {step === 1 && (
                            <div className="space-y-6 sp-animate-fadeIn">
                                {/* Holographic Pedestal */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-56 h-56 flex items-center justify-center">
                                        {/* Volumetric Light Beam */}
                                        <div className="absolute bottom-4 left-8 right-8 top-0 bg-gradient-to-t from-cyan-500/15 to-transparent pointer-events-none" style={{ clipPath: 'polygon(20% 100%, 80% 100%, 100% 0, 0 0)' }} />
                                        {/* 3D Scanning Ring */}
                                        <div className="absolute bottom-0 w-48 h-14 border-2 border-cyan-400/30 rounded-[100%] shadow-[0_0_25px_rgba(6,182,212,0.3)]" style={{ animation: 'sp-holo-spin 6s linear infinite', transformStyle: 'preserve-3d' }} />
                                        <div className="absolute bottom-2 w-36 h-10 border border-dashed border-emerald-400/40 rounded-[100%]" style={{ animation: 'sp-holo-spin 4s linear infinite reverse' }} />
                                        {/* Laser Sweep */}
                                        <div className="absolute w-28 h-[2px] bg-cyan-300 shadow-[0_0_15px_2px_#67e8f9] z-20 sp-animate-scan pointer-events-none" />
                                        {/* Avatar */}
                                        <div className="relative z-10 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transform scale-[1.2] -translate-y-4">
                                            <AvatarRenderer avatar={avatarData} size={150} />
                                        </div>
                                        {/* BIO_SYNC badge */}
                                        <div className="absolute top-0 right-0 bg-slate-900 border border-cyan-500/50 text-cyan-400 px-2.5 py-1 rounded text-[8px] font-mono tracking-widest font-bold z-30 shadow-lg flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/> BIO_SYNC
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest"><Palette size={12}/> PIGMENTASI</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SKIN_OPTIONS.map(s => (
                                                <button key={s.id} onClick={() => setSkinTone(s.id)} style={{ background: s.hex }}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${skinTone === s.id ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-slate-800'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[9px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest"><Scissors size={12}/> FOLIKEL RAMBUT</label>
                                        <div className="flex flex-wrap gap-2">
                                            {HAIR_COLOR_OPTIONS.map(h => (
                                                <button key={h.id} onClick={() => setHairColor(h.id)} style={{ background: h.hex }}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${hairColor === h.id ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-slate-800'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 border-t border-slate-800 pt-3">
                                        <label className="block text-[9px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">TOPOLOGI RAMBUT</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {availableHairStyles.map(hs => (
                                                <button key={hs} onClick={() => setHairStyle(hs)}
                                                    className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${effectiveHairStyle === hs
                                                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]'
                                                        : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-600'}`}>
                                                    {HAIR_STYLE_LABELS[hs]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 border-t border-slate-800 pt-3">
                                        <label className="block text-[9px] font-mono font-bold text-cyan-500 mb-3 uppercase tracking-widest">PERLENGKAPAN DINAS</label>
                                        <div className="flex gap-2">
                                            {ACCESSORY_OPTIONS.map(acc => (
                                                <button key={acc.id} onClick={() => toggleAccessory(acc.id)}
                                                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${accessories.includes(acc.id) ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-600'}`}>
                                                    <span className="text-base drop-shadow">{acc.icon}</span> {acc.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 2: ID CARD + OATH ═══ */}
                        {step === 2 && (
                            <div className="sp-animate-fadeIn flex flex-col items-center">
                                {/* Skeuomorphic ID Card with Hologram Foil */}
                                <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-300 relative transform rotate-1 z-10 hover:rotate-0 hover:scale-105 transition-all duration-300"
                                     style={{
                                         backgroundColor: '#F8FAFC',
                                         backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)',
                                         boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.8)',
                                         color: '#0f172a',
                                     }}>
                                    {/* Holographic Foil Overlay */}
                                    <div className="absolute inset-0 sp-holo-foil z-30" />
                                    {/* Lanyard Hole */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#020617] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-20 border border-slate-400/40" />

                                    {/* Card Header with gold accent */}
                                    <div className="h-16 bg-gradient-to-r from-emerald-800 to-teal-700 flex items-end pb-3 px-5 justify-between relative overflow-hidden border-b-4 border-amber-500">
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
                                        </div>
                                        <div className="flex items-center gap-3 relative z-10">
                                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-9 brightness-200 drop-shadow-md" />
                                            <div className="text-white font-mono text-[9px] leading-tight font-bold tracking-widest border-l-2 border-emerald-400/50 pl-3">FKK — ITS<br/>SEPULUH NOPEMBER</div>
                                        </div>
                                        <div className="text-emerald-100 font-black tracking-widest text-[9px] border border-emerald-400/50 px-2 py-1 rounded relative z-10 bg-emerald-900/80 backdrop-blur-sm shadow-sm">ID-ASN</div>
                                    </div>

                                    <div className="p-6 pb-5 flex gap-4 bg-white text-slate-800 relative z-10">
                                        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] pointer-events-none">
                                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="" className="h-36 grayscale" />
                                        </div>
                                        {/* Photo Frame with inner shadow */}
                                        <div className="w-22 h-30 bg-slate-200 border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden flex items-end justify-center relative rounded z-10">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15 pointer-events-none z-20" />
                                            <AvatarRenderer avatar={avatarData} size={100} />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center z-10">
                                            <div className="text-[8px] font-mono text-slate-400 font-bold mb-0.5 uppercase tracking-widest">NAMA PEJABAT:</div>
                                            <div className="text-lg font-black text-slate-900 leading-none uppercase tracking-wide border-b border-slate-300 pb-2 mb-2">dr. {playerName}</div>
                                            <div className="text-[8px] font-mono text-slate-400 font-bold mb-0.5 uppercase tracking-widest">JABATAN TUGAS:</div>
                                            <div className="text-[10px] font-bold text-emerald-800 uppercase mb-3 bg-emerald-100/80 border border-emerald-200 px-2 py-1 rounded inline-block w-fit shadow-sm">KEPALA PUSKESMAS</div>
                                            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                                                <div>
                                                    <div className="text-[7px] font-mono text-slate-400 font-bold tracking-widest">GENDER</div>
                                                    <div className="text-[10px] font-black text-slate-700">{gender === 'L' ? 'PRIA' : 'WANITA'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[7px] font-mono text-slate-400 font-bold tracking-widest">REGISTRASI</div>
                                                    <div className="text-[10px] font-black text-slate-700">{idType} {idNumber ? '✓' : '—'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barcode + Microprint Footer */}
                                    <div className="bg-[#E2E8F0] border-t border-slate-300 px-4 py-2.5 flex justify-between items-end relative z-10">
                                        <div className="font-mono text-xs tracking-[-0.1em] text-slate-500 font-bold opacity-60" style={{ transform: 'scaleY(1.8)' }}>||||| | |||| ||| | |||||</div>
                                        <div className="text-[5px] font-mono text-slate-400 uppercase tracking-widest text-right">AEGIS OS / VALID 2028<br/>{idType} {idNumber || 'PENDING'}</div>
                                    </div>

                                    {/* THE STAMP */}
                                    {isAuthorizing && (
                                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-white/20 backdrop-blur-[1px]">
                                            <div className="border-[6px] border-red-600 text-red-600 font-black text-4xl px-6 py-2 rounded-xl transform -rotate-12 mix-blend-multiply sp-animate-stamp tracking-widest uppercase bg-white/60"
                                                 style={{ textShadow: '0 0 10px rgba(220,38,38,0.2)' }}>
                                                DISETUJUI
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mission briefing flavour — alternating quotes */}
                                <div className="mt-8 text-center max-w-sm px-4">
                                    <FileSignature className="mx-auto text-emerald-500 mb-3 opacity-50" size={28} />
                                    <p className="font-serif italic text-slate-400 text-sm leading-relaxed">
                                        &ldquo;{activeQuote.text}&rdquo;
                                    </p>
                                    <p className="text-[9px] font-mono text-slate-500 mt-3 uppercase tracking-[0.2em] font-bold">
                                        &mdash; {activeQuote.src}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error toast */}
                    {error && (
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-500 text-red-400 text-[10px] font-mono uppercase tracking-widest px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(225,29,72,0.4)] flex items-center gap-3 sp-animate-fadeIn z-50">
                            <AlertTriangle size={16}/> {error}
                        </div>
                    )}

                    {/* Footer Command Deck */}
                    <div className="p-5 bg-slate-900 border-t border-slate-800 flex gap-4 shrink-0 relative z-20">
                        {step > 0 && !isAuthorizing && (
                            <button onClick={handleBack} className="px-6 py-4 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-black text-xs uppercase tracking-widest">
                                <ChevronLeft size={16} />
                            </button>
                        )}
                        {step < 2 ? (
                            <button onClick={handleNext} className="flex-1 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(6,182,212,0.3)] flex justify-center items-center gap-2">
                                PROSES DATA <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button onClick={handleAuthorize} disabled={isAuthorizing}
                                className={`flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-[0_15px_30px_rgba(225,29,72,0.3)]
                                ${isAuthorizing ? 'bg-slate-800 text-slate-500' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                                {isAuthorizing ? 'MEMPROSES OTORISASI...' : <><ShieldCheck size={20} /> SAHKAN S.K PENUGASAN</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
