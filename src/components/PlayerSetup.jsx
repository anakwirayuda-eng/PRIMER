/**
 * @reflection
 * [IDENTITY]: PlayerSetup (Aegis Registration Protocol)
 * [PURPOSE]: Cinematic character creation with RPG age trade-offs,
 *            biometric scanner framing, ID-card skeuomorphism,
 *            and an authorization handoff into gameplay.
 * [STATE]: Production
 * [ANCHOR]: PlayerSetup
 * [DEPENDS_ON]: AvatarRenderer, assets
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-04-16
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ChevronRight, ChevronLeft, Palette, Scissors, Fingerprint, FileSignature, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import AvatarRenderer, { SKIN_TONES, HAIR_COLORS } from './AvatarRenderer.jsx';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';
import { pickDeterministic } from '../utils/deterministicRandom.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AVATARS = [
    { id: 'doc_male_1', name: 'Dr. Pria', icon: '\u{1F468}\u200D\u2695\uFE0F', color: 'bg-blue-500' },
    { id: 'doc_female_1', name: 'Dr. Wanita', icon: '\u{1F469}\u200D\u2695\uFE0F', color: 'bg-pink-500' },
    { id: 'doc_male_2', name: 'Dr. Pria 2', icon: '\u{1F9D1}\u200D\u2695\uFE0F', color: 'bg-green-500' },
    { id: 'doc_female_2', name: 'Dr. Wanita 2', icon: '\u{1F469}\u{1F3FD}\u200D\u2695\uFE0F', color: 'bg-purple-500' },
];

const SKIN_OPTIONS = Object.entries(SKIN_TONES).map(([key, value]) => ({
    id: key,
    hex: value.hex || value,
    label: value.label || key,
}));
const HAIR_COLOR_OPTIONS = Object.entries(HAIR_COLORS).map(([key, value]) => ({
    id: key,
    hex: value.hex || value,
    label: value.label || key,
}));
const HAIR_STYLE_OPTIONS_MALE = ['buzz', 'short', 'neat', 'parted'];
const HAIR_STYLE_OPTIONS_FEMALE = ['short', 'neat', 'long', 'ponytail', 'bun', 'hijab'];
const ACCESSORY_OPTIONS = [
    { id: 'glasses', icon: '\u{1F453}' },
    { id: 'stethoscope', icon: '\u{1FA7A}' },
];

const AEGIS_CODENAMES = [
    {
        id: 'VANGUARD',
        minEnergy: 90,
        maxRep: 65,
        note: 'Stamina fisik superior. Risiko: idealisme naif berpotensi diabaikan tetua desa saat negosiasi kasus rujukan.',
    },
    {
        id: 'SENTINEL',
        minEnergy: 80,
        maxRep: 75,
        note: 'Profil seimbang. Kapasitas jaga malam memadai, namun perlu pembuktian otoritas di hadapan staf senior Puskesmas.',
    },
    {
        id: 'SCALPEL',
        minEnergy: 70,
        maxRep: 85,
        note: 'Ketajaman klinis terverifikasi. Cadangan energi moderat - alokasi istirahat perlu diprioritaskan pada shift ketiga.',
    },
    {
        id: 'ORACLE',
        minEnergy: 0,
        maxRep: 100,
        note: 'Wibawa absolut. Peringatan: kapasitas fisik menurun signifikan. Risiko dekompensasi kardiak pada jaga IGD 48 jam nonstop.',
    },
];

const BRIEFING_QUOTES = [
    {
        text: 'Satu Puskesmas. Satu desa terpencil. Ribuan nyawa yang menunggu keputusan Anda.',
        src: 'Briefing Penugasan PRIMER',
    },
    {
        text: 'Menyelamatkan satu nyawa membutuhkan stetoskop di IGD. Menyelamatkan ribuan nyawa membutuhkan peta dan kebijakan.',
        src: 'Prinsip Kesehatan Masyarakat',
    },
    {
        text: 'Tugas Anda bukan hanya menyembuhkan - tetapi mencegah, mendidik, dan membangun ketahanan komunitas.',
        src: 'Misi Puskesmas',
    },
    {
        text: 'Di desa ini, Anda adalah garis pertahanan pertama dan terakhir. Setiap keputusan berdampak pada generasi.',
        src: 'Orientasi Lapangan',
    },
    {
        text: 'Data epidemiologi adalah kompas Anda. Tanpanya, Anda hanya menebak di kegelapan.',
        src: 'Doktrin Surveilans',
    },
    {
        text: 'Anggaran terbatas. Waktu terbatas. Harapan masyarakat tak terbatas. Selamat bertugas, Dokter.',
        src: 'Nota Dinas No. 001',
    },
];

function generateAegisProfile(energy, reputation) {
    for (const profile of AEGIS_CODENAMES) {
        if (energy >= profile.minEnergy && reputation <= profile.maxRep) return profile;
    }

    return AEGIS_CODENAMES[AEGIS_CODENAMES.length - 1];
}

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

const BG_PARTICLES = [...Array(15)].map((_, index) => ({
    id: index,
    w: 4 + Math.random() * 8,
    h: 4 + Math.random() * 8,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `-${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 4}s`,
}));

export default function PlayerSetup({ onComplete }) {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [playerName, setPlayerName] = useState('');
    const [gender, setGender] = useState('L');
    const [age, setAge] = useState(28);
    const idNumber = '';
    const idType = 'NIP';

    const [skinTone, setSkinTone] = useState('fair');
    const [hairStyle, setHairStyle] = useState('neat');
    const [hairColor, setHairColor] = useState('black');
    const [accessories, setAccessories] = useState(['stethoscope']);
    const [error, setError] = useState('');
    const [isAuthorizing, setIsAuthorizing] = useState(false);

    const availableHairStyles = gender === 'L' ? HAIR_STYLE_OPTIONS_MALE : HAIR_STYLE_OPTIONS_FEMALE;
    const effectiveHairStyle = availableHairStyles.includes(hairStyle) ? hairStyle : availableHairStyles[0];

    const avatarData = useMemo(() => ({
        skinTone,
        hairStyle: effectiveHairStyle,
        hairColor,
        gender,
        accessories,
        outfit: 'labCoat',
        eyeStyle: 'default',
    }), [skinTone, effectiveHairStyle, hairColor, gender, accessories]);

    const derivedStats = useMemo(() => ({
        energy: Math.max(60, 120 - (age - 24)),
        rep: Math.min(100, 50 + (age - 24)),
    }), [age]);

    const aegisProfile = useMemo(
        () => generateAegisProfile(derivedStats.energy, derivedStats.rep),
        [derivedStats]
    );
    const aegisNote = useMemo(
        () => t(`playerSetup.profiles.${aegisProfile.id.toLowerCase()}.note`, { defaultValue: aegisProfile.note }),
        [aegisProfile, t]
    );
    const translatedQuotes = useMemo(() => ([
        {
            text: t('playerSetup.quotes.assignment.text', { defaultValue: BRIEFING_QUOTES[0].text }),
            src: t('playerSetup.quotes.assignment.source', { defaultValue: BRIEFING_QUOTES[0].src }),
        },
        {
            text: t('playerSetup.quotes.public_health.text', { defaultValue: BRIEFING_QUOTES[1].text }),
            src: t('playerSetup.quotes.public_health.source', { defaultValue: BRIEFING_QUOTES[1].src }),
        },
        {
            text: t('playerSetup.quotes.mission.text', { defaultValue: BRIEFING_QUOTES[2].text }),
            src: t('playerSetup.quotes.mission.source', { defaultValue: BRIEFING_QUOTES[2].src }),
        },
        {
            text: t('playerSetup.quotes.field_orientation.text', { defaultValue: BRIEFING_QUOTES[3].text }),
            src: t('playerSetup.quotes.field_orientation.source', { defaultValue: BRIEFING_QUOTES[3].src }),
        },
        {
            text: t('playerSetup.quotes.surveillance.text', { defaultValue: BRIEFING_QUOTES[4].text }),
            src: t('playerSetup.quotes.surveillance.source', { defaultValue: BRIEFING_QUOTES[4].src }),
        },
        {
            text: t('playerSetup.quotes.memo.text', { defaultValue: BRIEFING_QUOTES[5].text }),
            src: t('playerSetup.quotes.memo.source', { defaultValue: BRIEFING_QUOTES[5].src }),
        },
    ]), [t]);
    const activeQuote = useMemo(
        () => pickDeterministic(translatedQuotes, 'player-setup-briefing') || translatedQuotes[0],
        [translatedQuotes]
    );

    const accessoryOptions = useMemo(() => ACCESSORY_OPTIONS.map(accessory => ({
        ...accessory,
        label: t(`playerSetup.accessories.${accessory.id}`),
    })), [t]);

    const hairStyleLabels = useMemo(() => ({
        buzz: t('playerSetup.hair_styles.buzz'),
        short: t('playerSetup.hair_styles.short'),
        neat: t('playerSetup.hair_styles.neat'),
        parted: t('playerSetup.hair_styles.parted'),
        long: t('playerSetup.hair_styles.long'),
        ponytail: t('playerSetup.hair_styles.ponytail'),
        bun: t('playerSetup.hair_styles.bun'),
        hijab: t('playerSetup.hair_styles.hijab'),
    }), [t]);

    const stepDefs = useMemo(() => ([
        { step: 0, label: t('playerSetup.steps.identity.title'), desc: t('playerSetup.steps.identity.desc') },
        { step: 1, label: t('playerSetup.steps.biometric.title'), desc: t('playerSetup.steps.biometric.desc') },
        { step: 2, label: t('playerSetup.steps.assignment.title'), desc: t('playerSetup.steps.assignment.desc') },
    ]), [t]);

    const genderOptions = useMemo(() => ([
        {
            g: 'L',
            emoji: '\u{1F468}\u200D\u2695\uFE0F',
            label: t('playerSetup.genders.male'),
            activeClass: 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]',
        },
        {
            g: 'P',
            emoji: '\u{1F469}\u200D\u2695\uFE0F',
            label: t('playerSetup.genders.female'),
            activeClass: 'border-pink-500 bg-pink-950/40 text-pink-300 shadow-[inset_0_0_20px_rgba(236,72,153,0.2)]',
        },
    ]), [t]);

    const genderCardLabel = gender === 'L'
        ? t('playerSetup.genders.male_short')
        : t('playerSetup.genders.female_short');

    const toggleAccessory = (accessoryId) => setAccessories(current =>
        current.includes(accessoryId)
            ? current.filter(item => item !== accessoryId)
            : [...current, accessoryId]
    );

    const handleNext = () => {
        if (step === 0) {
            if (!playerName.trim()) {
                setError(t('playerSetup.errors.name_required'));
                return;
            }
            if (playerName.trim().length < 2) {
                setError(t('playerSetup.errors.name_invalid'));
                return;
            }
            setError('');
            setStep(1);
            return;
        }

        if (step === 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setError('');
        setStep(current => Math.max(0, current - 1));
    };

    const handleAuthorize = () => {
        if (isAuthorizing) return;

        setIsAuthorizing(true);
        setTimeout(() => {
            const profile = {
                name: playerName.trim(),
                gender,
                age,
                codename: aegisProfile.id,
                aegisNote,
                idType: idNumber.trim() ? idType : null,
                idNumber: idNumber.trim() || null,
                initialStats: {
                    maxEnergy: derivedStats.energy,
                    baseReputation: derivedStats.rep,
                },
                avatar: {
                    id: `agent_${Date.now()}`,
                    name: `dr. ${playerName.trim()}`,
                    icon: gender === 'L' ? '\u{1F468}\u200D\u2695\uFE0F' : '\u{1F469}\u200D\u2695\uFE0F',
                    color: gender === 'L' ? 'bg-blue-500' : 'bg-pink-500',
                    skinTone,
                    hairStyle: effectiveHairStyle,
                    hairColor,
                    accessories,
                    gender,
                    outfit: 'labCoat',
                    eyeStyle: 'default',
                },
                createdAt: Date.now(),
            };

            onComplete(profile, null);
        }, 800);
    };

    return (
        <div
            className={`relative min-h-screen select-none overflow-hidden p-4 sm:p-8 ${isAuthorizing ? 'sp-animate-shake' : ''} flex items-center justify-center`}
            style={{
                backgroundColor: '#020617',
                backgroundImage: 'linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        >
            <style>{SETUP_CSS}</style>

            {isAuthorizing && <div className="sp-animate-flash absolute inset-0 z-[200]" />}

            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-50"
                style={{
                    background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%)',
                    backgroundSize: '100% 4px',
                }}
            />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {BG_PARTICLES.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: particle.w,
                            height: particle.h,
                            left: particle.left,
                            top: particle.top,
                            background: particle.id % 2 === 0 ? '#10b981' : '#3b82f6',
                            animation: `sp-pulse-slow ${particle.duration} ease-in-out infinite alternate`,
                            animationDelay: particle.delay,
                        }}
                    />
                ))}
            </div>

            <div className={`relative z-10 flex w-full max-w-4xl flex-col gap-6 transition-all duration-700 md:flex-row ${isAuthorizing ? 'scale-[1.02]' : 'scale-100'}`}>
                <div className="sp-animate-fadeIn flex w-full flex-col justify-center border-l-4 border-emerald-500 pl-6 md:w-1/3">
                    <div className="mb-4 w-fit rounded-2xl border border-emerald-500 bg-emerald-950/80 p-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <ShieldCheck size={36} className="text-emerald-400" />
                    </div>
                    <h1 className="font-display mb-2 text-4xl font-black leading-tight tracking-widest text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] md:text-5xl">
                        AEGIS
                        <br />
                        REGISTRY
                    </h1>
                    <p className="mb-10 inline-block border border-emerald-900 bg-emerald-950/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
                        {t('playerSetup.panel.protocol')}
                    </p>

                    <div className="hidden space-y-6 md:block">
                        {stepDefs.map((definition, index) => (
                            <div
                                key={definition.step}
                                className={`flex items-center gap-4 transition-all duration-300 ${step === definition.step ? 'translate-x-2 scale-105 opacity-100' : step > definition.step ? 'opacity-50' : 'opacity-20'}`}
                            >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${step >= definition.step ? 'border-emerald-500 bg-emerald-950 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-slate-700 text-slate-500'}`}>
                                    {step > definition.step ? <CheckCircle2 size={16} /> : index + 1}
                                </div>
                                <div>
                                    <div className={`text-xs font-black uppercase tracking-widest ${step === definition.step ? 'text-white' : 'text-slate-400'}`}>
                                        {definition.label}
                                    </div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
                                        {definition.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative flex min-h-[550px] w-full flex-col overflow-hidden rounded-3xl border border-slate-700 bg-[#0a0f16]/95 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:w-2/3">
                    <div className="z-10 flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            {t('playerSetup.header.registration')}
                        </div>
                        <div className="rounded border border-cyan-900 bg-cyan-950/50 px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-cyan-400">
                            {t('playerSetup.header.step_counter', { current: step + 1, total: 3 })}
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8">
                        {step === 0 && (
                            <div className="sp-animate-fadeIn space-y-6">
                                <div>
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                        <Fingerprint size={14} />
                                        {t('playerSetup.identity.gender_label')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {genderOptions.map(option => (
                                            <button
                                                key={option.g}
                                                onClick={() => setGender(option.g)}
                                                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${gender === option.g ? option.activeClass : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}
                                            >
                                                <span className="text-3xl opacity-90 drop-shadow-md">{option.emoji}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-3 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                        <User size={14} />
                                        {t('playerSetup.identity.name_label')}
                                    </label>
                                    <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-inner transition-all focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                                        <span className="flex items-center justify-center border-r border-slate-800 bg-slate-900 px-5 text-sm font-black text-slate-400">dr.</span>
                                        <input
                                            type="text"
                                            value={playerName}
                                            onChange={(event) => setPlayerName(event.target.value.replace(/[^a-zA-Z\s.,]/g, '').toUpperCase())}
                                            placeholder={t('playerSetup.identity.name_placeholder')}
                                            maxLength={30}
                                            className="w-full bg-transparent px-4 py-4 font-black uppercase tracking-widest text-white outline-none placeholder-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                                    <div className="mb-3 flex items-end justify-between">
                                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
                                            {t('playerSetup.identity.age_label')}
                                        </label>
                                        <span className="text-xl font-black text-amber-400">
                                            {age}{' '}
                                            <span className="text-xs text-amber-500/50">
                                                {t('playerSetup.identity.age_unit')}
                                            </span>
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={24}
                                        max={65}
                                        value={age}
                                        onChange={(event) => setAge(parseInt(event.target.value, 10))}
                                        className="mb-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-950 accent-amber-500"
                                    />
                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                                        <div>
                                            <div className="mb-1 flex justify-between text-[8px] font-mono uppercase text-slate-400">
                                                <span>{t('playerSetup.stats.energy')}</span>
                                                <span className="font-bold text-emerald-400">{derivedStats.energy}</span>
                                            </div>
                                            <div className="h-1 overflow-hidden rounded-full bg-slate-950">
                                                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(derivedStats.energy / 120) * 100}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex justify-between text-[8px] font-mono uppercase text-slate-400">
                                                <span>{t('playerSetup.stats.reputation')}</span>
                                                <span className="font-bold text-purple-400">{derivedStats.rep}</span>
                                            </div>
                                            <div className="h-1 overflow-hidden rounded-full bg-slate-950">
                                                <div className="h-full bg-purple-500 transition-all" style={{ width: `${derivedStats.rep}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="sp-animate-fadeIn space-y-6">
                                <div className="mb-6 flex justify-center">
                                    <div className="relative flex h-56 w-56 items-center justify-center">
                                        <div className="pointer-events-none absolute bottom-4 left-8 right-8 top-0 bg-gradient-to-t from-cyan-500/15 to-transparent" style={{ clipPath: 'polygon(20% 100%, 80% 100%, 100% 0, 0 0)' }} />
                                        <div className="absolute bottom-0 h-14 w-48 rounded-[100%] border-2 border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.3)]" style={{ animation: 'sp-holo-spin 6s linear infinite', transformStyle: 'preserve-3d' }} />
                                        <div className="absolute bottom-2 h-10 w-36 rounded-[100%] border border-dashed border-emerald-400/40" style={{ animation: 'sp-holo-spin 4s linear infinite reverse' }} />
                                        <div className="sp-animate-scan pointer-events-none absolute z-20 h-[2px] w-28 bg-cyan-300 shadow-[0_0_15px_2px_#67e8f9]" />
                                        <div className="relative z-10 -translate-y-4 scale-[1.2] transform drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                                            <AvatarRenderer avatar={avatarData} size={150} />
                                        </div>
                                        <div className="absolute right-0 top-0 z-30 flex items-center gap-2 rounded border border-cyan-500/50 bg-slate-900 px-2.5 py-1 text-[8px] font-mono font-bold tracking-widest text-cyan-400 shadow-lg">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                            BIO_SYNC
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                                    <div>
                                        <label className="mb-3 flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                            <Palette size={12} />
                                            {t('playerSetup.biometric.skin')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {SKIN_OPTIONS.map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSkinTone(option.id)}
                                                    style={{ background: option.hex }}
                                                    className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${skinTone === option.id ? 'scale-110 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-slate-800'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-3 flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                            <Scissors size={12} />
                                            {t('playerSetup.biometric.hair_color')}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {HAIR_COLOR_OPTIONS.map(option => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setHairColor(option.id)}
                                                    style={{ background: option.hex }}
                                                    className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${hairColor === option.id ? 'scale-110 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-slate-800'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 border-t border-slate-800 pt-3">
                                        <label className="mb-3 block text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                            {t('playerSetup.biometric.hair_style')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                            {availableHairStyles.map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => setHairStyle(style)}
                                                    className={`rounded-lg border py-2 text-[9px] font-black uppercase tracking-wider transition-all ${effectiveHairStyle === style ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]' : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-600'}`}
                                                >
                                                    {hairStyleLabels[style]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 border-t border-slate-800 pt-3">
                                        <label className="mb-3 block text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-500">
                                            {t('playerSetup.biometric.accessories')}
                                        </label>
                                        <div className="flex gap-2">
                                            {accessoryOptions.map(accessory => (
                                                <button
                                                    key={accessory.id}
                                                    onClick={() => toggleAccessory(accessory.id)}
                                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[10px] font-black uppercase tracking-widest transition-all ${accessories.includes(accessory.id) ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-600'}`}
                                                >
                                                    <span className="text-base drop-shadow">{accessory.icon}</span>
                                                    {accessory.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="sp-animate-fadeIn flex flex-col items-center">
                                <div
                                    className="relative z-10 w-full max-w-sm rotate-1 transform overflow-hidden rounded-2xl border border-slate-300 transition-all duration-300 hover:rotate-0 hover:scale-105"
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)',
                                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.8)',
                                        color: '#0f172a',
                                    }}
                                >
                                    <div className="sp-holo-foil absolute inset-0 z-30" />
                                    <div className="absolute left-1/2 top-3 z-20 h-3 w-12 -translate-x-1/2 rounded-full border border-slate-400/40 bg-[#020617] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />

                                    <div className="relative flex h-16 items-end justify-between overflow-hidden border-b-4 border-amber-500 bg-gradient-to-r from-emerald-800 to-teal-700 px-5 pb-3">
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="h-full w-full" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
                                        </div>
                                        <div className="relative z-10 flex items-center gap-3">
                                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-9 brightness-200 drop-shadow-md" />
                                            <div className="border-l-2 border-emerald-400/50 pl-3 text-[9px] font-bold leading-tight tracking-widest text-white">
                                                PRIMER
                                                <br />
                                                {t('playerSetup.card.program')}
                                            </div>
                                        </div>
                                        <div className="relative z-10 rounded border border-emerald-400/50 bg-emerald-900/80 px-2 py-1 text-[9px] font-black tracking-widest text-emerald-100 shadow-sm backdrop-blur-sm">
                                            ID-ASN
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex flex-col gap-3 bg-white p-4 pb-4 text-slate-800 sm:flex-row sm:gap-4 md:p-6 md:pb-5">
                                        <div className="pointer-events-none absolute bottom-[-10px] right-[-10px] opacity-[0.03]">
                                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="" className="h-36 grayscale" />
                                        </div>
                                        <div className="relative z-10 mx-auto flex h-28 w-20 flex-shrink-0 items-end justify-center overflow-hidden rounded border-2 border-white bg-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.1)] sm:mx-0 sm:h-30 sm:w-22">
                                            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent to-black/15" />
                                            <AvatarRenderer avatar={avatarData} size={90} />
                                        </div>
                                        <div className="z-10 flex min-w-0 flex-1 flex-col justify-center">
                                            <div className="mb-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                                {t('playerSetup.card.officer_name')}
                                            </div>
                                            <div className="mb-2 truncate border-b border-slate-300 pb-2 text-base font-black uppercase leading-none tracking-wide text-slate-900 sm:text-lg">
                                                dr. {playerName}
                                            </div>
                                            <div className="mb-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                                {t('playerSetup.card.assignment')}
                                            </div>
                                            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                                                <div className="rounded border border-emerald-200 bg-emerald-100/80 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-800 shadow-sm sm:text-[10px]">
                                                    {t('playerSetup.card.role')}
                                                </div>
                                                <div className="rounded border border-amber-300 bg-amber-100/80 px-1.5 py-0.5 font-mono text-[8px] font-black uppercase tracking-wider text-amber-700 shadow-sm sm:text-[9px]">
                                                    {aegisProfile.id}
                                                </div>
                                            </div>
                                            <div className="mb-2 hidden border-l-2 border-slate-300 pl-2 text-[7px] font-mono italic leading-relaxed text-slate-400 sm:block">
                                                {t('playerSetup.card.evaluation_prefix')} {aegisNote}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                                                <div>
                                                    <div className="text-[7px] font-mono font-bold tracking-widest text-slate-400">
                                                        {t('playerSetup.card.gender')}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-700">
                                                        {genderCardLabel}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[7px] font-mono font-bold tracking-widest text-slate-400">
                                                        {t('playerSetup.card.registration')}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-700">
                                                        {idType} {idNumber ? '\u2713' : '\u2014'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-end justify-between border-t border-slate-300 bg-[#E2E8F0] px-4 py-2.5">
                                        <div className="text-xs font-bold tracking-[-0.1em] text-slate-500 opacity-60" style={{ transform: 'scaleY(1.8)' }}>
                                            ||||| | |||| ||| | |||||
                                        </div>
                                        <div className="text-right text-[5px] font-mono uppercase tracking-widest text-slate-400">
                                            AEGIS OS / VALID 2028
                                            <br />
                                            {idType} {idNumber || t('playerSetup.card.registration_pending')}
                                        </div>
                                    </div>

                                    {isAuthorizing && (
                                        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                                            <div
                                                className="sp-animate-stamp -rotate-12 transform rounded-xl border-[6px] border-red-600 bg-white/60 px-6 py-2 text-4xl font-black uppercase tracking-widest text-red-600 mix-blend-multiply"
                                                style={{ textShadow: '0 0 10px rgba(220,38,38,0.2)' }}
                                            >
                                                {t('playerSetup.card.approved')}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 max-w-sm px-4 text-center">
                                    <FileSignature className="mx-auto mb-3 text-emerald-500 opacity-50" size={28} />
                                    <p className="font-serif text-sm italic leading-relaxed text-slate-400">
                                        &ldquo;{activeQuote.text}&rdquo;
                                    </p>
                                    <p className="mt-3 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
                                        &mdash; {activeQuote.src}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="sp-animate-fadeIn absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-red-500 bg-red-950/90 px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-red-400 shadow-[0_10px_30px_rgba(225,29,72,0.4)]">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="relative z-20 flex shrink-0 gap-4 border-t border-slate-800 bg-slate-900 p-5">
                        {step > 0 && !isAuthorizing && (
                            <button
                                onClick={handleBack}
                                className="rounded-xl border border-slate-700 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                                aria-label={t('stepCarousel.back')}
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}
                        {step < 2 ? (
                            <button
                                onClick={handleNext}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:bg-cyan-500 sm:text-sm"
                            >
                                {t('playerSetup.actions.process_data')}
                                <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleAuthorize}
                                disabled={isAuthorizing}
                                className={`flex flex-1 items-center justify-center gap-3 rounded-xl py-4 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_15px_30px_rgba(225,29,72,0.3)] ${isAuthorizing ? 'bg-slate-800 text-slate-500' : 'bg-red-600 text-white hover:bg-red-500'}`}
                            >
                                {isAuthorizing
                                    ? t('playerSetup.actions.authorizing')
                                    : (
                                        <>
                                            <ShieldCheck size={20} />
                                            {t('playerSetup.actions.authorize_assignment')}
                                        </>
                                    )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
