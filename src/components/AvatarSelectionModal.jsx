/**
 * @reflection
 * [IDENTITY]: AvatarSelectionModal
 * [PURPOSE]: React UI component: AvatarSelectionModal.
 * [STATE]: Experimental
 * [ANCHOR]: AvatarSelectionModal
 * [DEPENDS_ON]: GameContext, AvatarRenderer
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { X, Palette, Scissors } from 'lucide-react';
import AvatarRenderer, { SKIN_TONES, HAIR_COLORS } from './AvatarRenderer.jsx';

const SKIN_OPTIONS = Object.entries(SKIN_TONES).map(([key, hex]) => ({ id: key, hex }));
const HAIR_COLOR_OPTIONS = Object.entries(HAIR_COLORS).map(([key, hex]) => ({ id: key, hex }));
const HAIR_STYLE_OPTIONS_MALE = ['buzz', 'short', 'neat', 'parted'];
const HAIR_STYLE_OPTIONS_FEMALE = ['short', 'neat', 'long', 'ponytail', 'bun', 'hijab'];
const HAIR_STYLE_LABELS = {
    buzz: 'Cepak', short: 'Pendek', neat: 'Rapi', parted: 'Belah',
    long: 'Panjang', ponytail: 'Ponytail', bun: 'Sanggul', hijab: 'Hijab',
};
const ACCESSORY_OPTIONS = [
    { id: 'glasses', label: 'Kacamata', icon: '👓' },
    { id: 'stethoscope', label: 'Stetoskop', icon: '🩺' },
];

export default function AvatarSelectionModal({ onClose }) {
    const { playerProfile, setPlayerProfile, soundManager } = useGame();
    const modalRef = useModalA11y(onClose);

    const currentAvatar = playerProfile?.avatar || {};
    const [skinTone, setSkinTone] = useState(currentAvatar.skinTone || 'fair');
    const [hairColor, setHairColor] = useState(currentAvatar.hairColor || 'black');
    const [hairStyle, setHairStyle] = useState(currentAvatar.hairStyle || 'neat');
    const [accessories, setAccessories] = useState(currentAvatar.accessories || ['stethoscope']);
    const gender = currentAvatar.gender || playerProfile?.gender || 'L';

    const availableHairStyles = gender === 'L' ? HAIR_STYLE_OPTIONS_MALE : HAIR_STYLE_OPTIONS_FEMALE;
    const effectiveHairStyle = availableHairStyles.includes(hairStyle) ? hairStyle : availableHairStyles[0];

    const previewAvatar = { skinTone, hairStyle: effectiveHairStyle, hairColor, gender, accessories };

    const toggleAccessory = (accId) => {
        setAccessories(prev => prev.includes(accId) ? prev.filter(a => a !== accId) : [...prev, accId]);
    };

    const handleSave = () => {
        setPlayerProfile(prev => ({
            ...prev,
            avatar: {
                ...prev.avatar,
                skinTone,
                hairStyle: effectiveHairStyle,
                hairColor,
                accessories,
            }
        }));
        if (soundManager) soundManager.playSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="avatar-title" className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white text-center relative">
                    <button onClick={onClose}
                        className="absolute right-3 top-3 p-1.5 hover:bg-white/20 rounded-full transition"
                        aria-label="Tutup kustomisasi avatar">
                        <X size={18} />
                    </button>
                    <h1 id="avatar-title" className="text-lg font-bold">Kustomisasi Penampilan</h1>
                    <p className="text-xs opacity-70 mt-0.5">Ubah penampilan dokter Anda</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Live Preview */}
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-b from-emerald-100 to-transparent dark:from-emerald-900/30 p-1 rounded-full">
                            <AvatarRenderer avatar={previewAvatar} size={100} />
                        </div>
                    </div>

                    {/* Skin Tone */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                            <Palette size={12} className="inline mr-1" /> Warna Kulit
                        </label>
                        <div className="flex gap-2 justify-center">
                            {SKIN_OPTIONS.map(s => (
                                <button key={s.id} onClick={() => setSkinTone(s.id)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${skinTone === s.id ? 'border-emerald-500 ring-2 ring-emerald-300/50 scale-110' : 'border-slate-200 dark:border-slate-600'}`}
                                    style={{ background: s.hex }} />
                            ))}
                        </div>
                    </div>

                    {/* Hair Color */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Warna Rambut</label>
                        <div className="flex gap-2 justify-center">
                            {HAIR_COLOR_OPTIONS.map(h => (
                                <button key={h.id} onClick={() => setHairColor(h.id)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${hairColor === h.id ? 'border-emerald-500 ring-2 ring-emerald-300/50 scale-110' : 'border-slate-200 dark:border-slate-600'}`}
                                    style={{ background: h.hex }} />
                            ))}
                        </div>
                    </div>

                    {/* Hair Style */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                            <Scissors size={12} className="inline mr-1" /> Gaya Rambut
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {availableHairStyles.map(hs => (
                                <button key={hs} onClick={() => setHairStyle(hs)}
                                    className={`px-2 py-1.5 rounded-lg border text-xs text-center transition-all ${effectiveHairStyle === hs
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold'
                                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                                    {HAIR_STYLE_LABELS[hs]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accessories */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Aksesori</label>
                        <div className="flex gap-2">
                            {ACCESSORY_OPTIONS.map(acc => (
                                <button key={acc.id} onClick={() => toggleAccessory(acc.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all ${accessories.includes(acc.id)
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}>
                                    <span>{acc.icon}</span> {acc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save */}
                    <button onClick={handleSave}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg">
                        Simpan Perubahan
                    </button>
                </div>
            </div >
        </div >
    );
}
