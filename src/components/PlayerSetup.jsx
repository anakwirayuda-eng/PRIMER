/**
 * @reflection
 * [IDENTITY]: PlayerSetup
 * [PURPOSE]: React UI component: AVATARS.
 * [STATE]: Experimental
 * [ANCHOR]: PlayerSetup
 * [DEPENDS_ON]: AvatarRenderer
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo } from 'react';
import { User, Dna, Heart, ChevronRight, ChevronLeft, Palette, Scissors, IdCard } from 'lucide-react';
import AvatarRenderer, { SKIN_TONES, HAIR_COLORS, HAIR_STYLES } from './AvatarRenderer.jsx';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';

// eslint-disable-next-line react-refresh/only-export-components -- Backward compat constant for AvatarSelectionModal
export const AVATARS = [
    { id: 'doc_male_1', name: 'Dr. Pria', icon: '👨‍⚕️', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'Dr. Wanita', icon: '👩‍⚕️', color: 'bg-pink-500' },
    { id: 'doc_male_2', name: 'Dr. Pria 2', icon: '🧑‍⚕️', color: 'bg-green-500' },
    { id: 'doc_female_2', name: 'Dr. Wanita 2', icon: '👩🏽‍⚕️', color: 'bg-purple-500' },
];

const SKIN_OPTIONS = Object.entries(SKIN_TONES).map(([key, hex]) => ({ id: key, hex }));
const HAIR_COLOR_OPTIONS = Object.entries(HAIR_COLORS).map(([key, hex]) => ({ id: key, hex }));
const HAIR_STYLE_OPTIONS_MALE = ['buzz', 'short', 'neat', 'parted'];
const HAIR_STYLE_OPTIONS_FEMALE = ['short', 'neat', 'long', 'ponytail', 'bun', 'hijab'];

const ACCESSORY_OPTIONS = [
    { id: 'glasses', label: 'Kacamata', icon: '👓' },
    { id: 'stethoscope', label: 'Stetoskop', icon: '🩺' },
];

const HAIR_STYLE_LABELS = {
    buzz: 'Cepak', short: 'Pendek', neat: 'Rapi', parted: 'Belah',
    long: 'Panjang', ponytail: 'Ponytail', bun: 'Sanggul', hijab: 'Hijab',
};

// Pre-generated particle data (avoids Math.random() during render)
const SETUP_PARTICLES = [...Array(6)].map((_, i) => ({
    w: 4 + Math.random() * 6,
    h: 4 + Math.random() * 6,
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    delay: `-${3 + Math.random() * i}s`,
}));

export default function PlayerSetup({ onComplete }) {
    const [step, setStep] = useState(0); // 0=identity, 1=appearance, 2=confirm
    const [playerName, setPlayerName] = useState('');
    const [gender, setGender] = useState('L');
    const [age, setAge] = useState(28);
    const [idNumber, setIdNumber] = useState('');
    const [idType, setIdType] = useState('NIM');
    const [skinTone, setSkinTone] = useState('fair');
    const [hairStyle, setHairStyle] = useState('neat');
    const [hairColor, setHairColor] = useState('black');
    const [accessories, setAccessories] = useState(['stethoscope']);
    const [error, setError] = useState('');

    const availableHairStyles = gender === 'L' ? HAIR_STYLE_OPTIONS_MALE : HAIR_STYLE_OPTIONS_FEMALE;

    // Ensure selected hair style is valid for selected gender
    const effectiveHairStyle = availableHairStyles.includes(hairStyle) ? hairStyle : availableHairStyles[0];

    const avatarData = useMemo(() => ({
        skinTone,
        hairStyle: effectiveHairStyle,
        hairColor,
        gender,
        accessories,
    }), [skinTone, effectiveHairStyle, hairColor, gender, accessories]);

    const floatingParticles = useMemo(() => SETUP_PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full opacity-10"
            style={{
                width: p.w,
                height: p.h,
                left: p.left,
                top: p.top,
                background: i % 2 === 0 ? '#10b981' : '#3b82f6',
                animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
                animationDelay: p.delay,
            }}
        />
    )), []);

    const toggleAccessory = (accId) => {
        setAccessories(prev =>
            prev.includes(accId) ? prev.filter(a => a !== accId) : [...prev, accId]
        );
    };

    const handleNext = () => {
        if (step === 0) {
            if (!playerName.trim()) { setError('Masukkan nama Anda'); return; }
            if (playerName.trim().length < 2) { setError('Nama minimal 2 karakter'); return; }
            setError('');
            setStep(1);
        } else if (step === 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setError('');
        setStep(s => Math.max(0, s - 1));
    };

    const handleStart = () => {
        const profile = {
            name: playerName.trim(),
            gender,
            age,
            idType: idNumber.trim() ? idType : null,
            idNumber: idNumber.trim() || null,
            avatar: {
                id: `custom_${gender}_${Date.now()}`,
                name: `Dr. ${playerName.trim()}`,
                icon: gender === 'L' ? '👨‍⚕️' : '👩‍⚕️', // fallback for legacy
                color: gender === 'L' ? 'bg-blue-500' : 'bg-pink-500',
                // Custom SVG data
                skinTone,
                hairStyle: effectiveHairStyle,
                hairColor,
                accessories,
                gender,
            },
            createdAt: Date.now()
        };
        onComplete(profile);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
            {/* Floating particles background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {floatingParticles}
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo Area */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                            <Dna size={24} className="text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-wider text-white" style={{ letterSpacing: '0.15em' }}>
                        PRIMER
                    </h1>
                    <p className="text-xs text-emerald-300/70 mt-1 uppercase tracking-widest">Buat Karakter Baru</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

                    {/* Progress Steps */}
                    <div className="flex border-b border-white/10">
                        {['Identitas', 'Penampilan', 'Konfirmasi'].map((label, i) => (
                            <div key={i} className={`flex-1 py-3 text-center text-xs font-medium transition-all ${i === step ? 'text-emerald-300 bg-emerald-500/10 border-b-2 border-emerald-400' :
                                i < step ? 'text-emerald-500/60' : 'text-white/30'
                                }`}>
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] mr-1 ${i < step ? 'bg-emerald-500 text-white' :
                                    i === step ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400' :
                                        'bg-white/10 text-white/40'
                                    }`}>{i + 1}</span>
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 space-y-5">
                        {/* === STEP 0: IDENTITY === */}
                        {step === 0 && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Gender - Big Toggle */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Jenis Kelamin</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setGender('L')}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${gender === 'L'
                                                ? 'border-blue-400 bg-blue-500/20 text-blue-300' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                                            aria-label="Pilih jenis kelamin laki-laki"
                                            aria-pressed={gender === 'L'}>
                                            <span className="text-2xl block mb-1" aria-hidden="true">👨‍⚕️</span>
                                            <span className="text-xs font-medium">Laki-laki</span>
                                        </button>
                                        <button onClick={() => setGender('P')}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${gender === 'P'
                                                ? 'border-pink-400 bg-pink-500/20 text-pink-300' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                                            aria-label="Pilih jenis kelamin perempuan"
                                            aria-pressed={gender === 'P'}>
                                            <span className="text-2xl block mb-1" aria-hidden="true">👩‍⚕️</span>
                                            <span className="text-xs font-medium">Perempuan</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        <User size={12} className="inline mr-1" /> Nama Lengkap
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/40 text-sm font-medium whitespace-nowrap">dr.</span>
                                        <input
                                            type="text"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                            placeholder="Nama lengkap Anda..."
                                            maxLength={40}
                                            aria-label="Nama lengkap karakter"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        Usia: <span className="text-emerald-300 font-bold">{age} tahun</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={24} max={65} value={age}
                                        onChange={(e) => setAge(parseInt(e.target.value))}
                                        aria-label={`Usia karakter: ${age} tahun`}
                                        className="w-full accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                        <span>24 (Baru Lulus)</span>
                                        <span>65 (Pensiun)</span>
                                    </div>
                                </div>

                                {/* ID Number (Optional) */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        <IdCard size={12} className="inline mr-1" /> Nomor Identitas <span className="text-white/30">(opsional)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={idType}
                                            onChange={(e) => setIdType(e.target.value)}
                                            aria-label="Tipe nomor identitas"
                                            className="px-3 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                                        >
                                            <option value="NIM" className="bg-slate-800">NIM</option>
                                            <option value="NRM" className="bg-slate-800">NRM</option>
                                            <option value="NIP" className="bg-slate-800">NIP</option>
                                            <option value="NPP" className="bg-slate-800">NPP</option>
                                            <option value="NIK" className="bg-slate-800">NIK</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={idNumber}
                                            onChange={(e) => setIdNumber(e.target.value)}
                                            placeholder="Contoh: 123456789"
                                            maxLength={20}
                                            aria-label="Nomor identitas"
                                            className="flex-1 px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === STEP 1: APPEARANCE === */}
                        {step === 1 && (
                            <div className="space-y-5 animate-fadeIn">
                                {/* Live Preview */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="bg-gradient-to-b from-emerald-500/20 to-transparent p-1 rounded-full">
                                            <AvatarRenderer avatar={avatarData} size={120} />
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-800 border border-emerald-500/30 px-3 py-0.5 rounded-full text-[10px] text-emerald-300 whitespace-nowrap">
                                            dr. {playerName || '???'}
                                        </div>
                                    </div>
                                </div>

                                {/* Skin Tone */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        <Palette size={12} className="inline mr-1" /> Warna Kulit
                                    </label>
                                    <div className="flex gap-2 justify-center">
                                        {SKIN_OPTIONS.map(s => (
                                            <button key={s.id} onClick={() => setSkinTone(s.id)}
                                                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${skinTone === s.id ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-110' : 'border-white/20'}`}
                                                style={{ background: s.hex }}
                                                aria-label={`Warna kulit ${s.id}`}
                                                aria-pressed={skinTone === s.id} />
                                        ))}
                                    </div>
                                </div>

                                {/* Hair Color */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Warna Rambut</label>
                                    <div className="flex gap-2 justify-center">
                                        {HAIR_COLOR_OPTIONS.map(h => (
                                            <button key={h.id} onClick={() => setHairColor(h.id)}
                                                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${hairColor === h.id ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-110' : 'border-white/20'}`}
                                                style={{ background: h.hex }}
                                                aria-label={`Warna rambut ${h.id}`}
                                                aria-pressed={hairColor === h.id} />
                                        ))}
                                    </div>
                                </div>

                                {/* Hair Style */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        <Scissors size={12} className="inline mr-1" /> Gaya Rambut
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableHairStyles.map(hs => (
                                            <button key={hs}
                                                onClick={() => setHairStyle(hs)}
                                                className={`px-2 py-2 rounded-lg border text-xs text-center transition-all ${effectiveHairStyle === hs
                                                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                                                    : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                                                {HAIR_STYLE_LABELS[hs]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accessories as toggles */}
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">Aksesori</label>
                                    <div className="flex gap-2">
                                        {ACCESSORY_OPTIONS.map(acc => (
                                            <button key={acc.id}
                                                onClick={() => toggleAccessory(acc.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs transition-all ${accessories.includes(acc.id)
                                                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                                                    : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                                                <span>{acc.icon}</span> {acc.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === STEP 2: CONFIRM === */}
                        {step === 2 && (
                            <div className="space-y-4 animate-fadeIn text-center">
                                {/* Big Avatar */}
                                <div className="flex justify-center mb-2">
                                    <div className="bg-gradient-to-b from-emerald-500/20 to-transparent p-1.5 rounded-full">
                                        <AvatarRenderer avatar={avatarData} size={140} />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-white">dr. {playerName}</h2>
                                    <p className="text-emerald-300/70 text-sm mt-1">Kepala Puskesmas Desa Sehat Sentosa</p>
                                </div>

                                {/* Info Summary */}
                                <div className="bg-white/5 rounded-xl p-4 text-left space-y-2 border border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Jenis Kelamin</span>
                                        <span className="text-white">{gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Usia</span>
                                        <span className="text-white">{age} tahun</span>
                                    </div>
                                    {idNumber.trim() && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">{idType}</span>
                                            <span className="text-white font-mono">{idNumber}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-white/30 italic">
                                    Anda ditugaskan untuk mengelola Puskesmas di desa terpencil. Siapkah Anda?
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 text-red-300 text-sm px-4 py-2 rounded-lg border border-red-500/20">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step > 0 && (
                                <button onClick={handleBack}
                                    className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/5 transition-all text-sm"
                                    aria-label="Kembali ke langkah sebelumnya">
                                    <ChevronLeft size={16} aria-hidden="true" /> Kembali
                                </button>
                            )}
                            {step < 2 && (
                                <button onClick={handleNext}
                                    className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-sm shadow-lg shadow-emerald-900/50"
                                    aria-label="Lanjut ke langkah berikutnya">
                                    Lanjut <ChevronRight size={16} aria-hidden="true" />
                                </button>
                            )}
                            {step === 2 && (
                                <button onClick={handleStart}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base transition-all shadow-lg shadow-emerald-900/50"
                                    aria-label="Mulai bertugas sebagai Kepala Puskesmas">
                                    <Heart size={18} aria-hidden="true" /> Mulai Bertugas!
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-white/5 flex items-center justify-center gap-3">
                        <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-7 object-contain opacity-50" />
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">ITS MEDICS • Institut Teknologi Sepuluh Nopember</span>
                    </div>
                </div>
            </div>

            {/* Keyframe for pulse animation */}
        </div>
    );
}
