/**
 * @reflection
 * [IDENTITY]: UpgradeModal
 * [PURPOSE]: Modal component for building upgrade confirmation.
 * [STATE]: Experimental
 */

import React from 'react';
import { ArrowUp, Building2, Hammer, HeartPulse, Home, Microscope, Package, Pill, Siren, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useModalA11y from '../../hooks/useModalA11y.js';

const ROOM_ICONS = {
    poli_umum: Stethoscope,
    poli_gigi: Stethoscope,
    poli_kia_kb: HeartPulse,
    lab: Microscope,
    apotek: Pill,
    igd: Siren,
    rawat_inap: Home,
    gudang: Package
};

const UpgradeModal = ({ room, currentLevel, isUpgrading, onUpgrade, onCancel }) => {
    const { t, i18n } = useTranslation();
    const modalRef = useModalA11y(onCancel);
    if (!room) return null;

    const Icon = ROOM_ICONS[room.id] || Building2;
    const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'id-ID';

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upgrade-title"
                className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/[0.1] shadow-2xl shadow-black/50"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="mx-auto mb-3 h-16 w-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                        <Icon size={34} className="text-indigo-300" />
                    </div>
                    <h2 id="upgrade-title" className="font-display text-xl font-black text-white uppercase tracking-tight">
                        {t('gedungPage.upgrade.title', { room: room.name })}
                    </h2>
                    <p className="text-indigo-300/60 text-sm mt-1">
                        {t('gedungPage.upgrade.level', { current: currentLevel, next: currentLevel + 1 })}
                    </p>
                </div>

                <div className="bg-white/[0.04] rounded-2xl p-4 mb-6 border border-white/[0.08] space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{t('gedungPage.upgrade.cost')}</span>
                        <span className="font-data text-lg font-black text-amber-400">
                            {t('gedungPage.currency.fullValue', { value: room.cost.toLocaleString(locale) })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{t('gedungPage.upgrade.bonus')}</span>
                        <span className="text-sm font-bold text-emerald-400">{room.effect}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/60 font-bold text-sm hover:bg-white/[0.1] transition"
                    >
                        {t('common.close')}
                    </button>
                    <button
                        onClick={() => onUpgrade(room)}
                        disabled={isUpgrading}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isUpgrading
                            ? 'bg-white/[0.06] text-white/30 cursor-wait'
                            : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:scale-[1.02]'
                            }`}
                    >
                        {isUpgrading ? (
                            <><Hammer className="animate-bounce" size={16} /> {t('gedungPage.upgrade.building')}</>
                        ) : (
                            <><ArrowUp size={16} /> {t('gedungPage.upgrade.action')}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
