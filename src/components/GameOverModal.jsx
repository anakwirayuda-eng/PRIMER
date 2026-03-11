/**
 * @reflection
 * [IDENTITY]: GameOverModal
 * [PURPOSE]: React UI component: GameOverModal.
 * [STATE]: Experimental
 * [ANCHOR]: GameOverModal
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useEffect } from 'react';
import { AlertTriangle, FileWarning, LogOut, RefreshCw, ArrowRight } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';

export default function GameOverModal({ type, reason, onContinue, onRestart }) {

    const config = {
        warning1: {
            title: 'SURAT PERINGATAN 1',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: FileWarning,
            message: 'Kinerja klinik di bawah standar. Harap segera perbaiki kualitas pelayanan dan manajemen rujukan.',
            action: 'Saya Mengerti'
        },
        warning2: {
            title: 'SURAT PERINGATAN 2',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: AlertTriangle,
            message: 'Kondisi KRITIS. Jika tidak ada perbaikan signifikan besok, kontrak kerja sama akan diputus.',
            action: 'Saya Mengerti'
        },
        fired: {
            title: 'PEMUTUSAN HUBUNGAN KERJA',
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: LogOut,
            message: 'Maaf, kinerja Anda tidak memenuhi standar kompetensi Kepala Puskesmas. Kontrak Anda dihentikan.',
            action: 'Coba Lagi'
        },
        fainted: {
            title: 'ANDA PINGSAN!',
            color: 'text-indigo-700',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            icon: AlertTriangle,
            message: 'Tubuh Anda mencapai batasnya. Anda pingsan karena kelelahan kronis.',
            action: 'Pulihkan Diri'
        }
    };

    const current = config[type] || config.warning1;
    const Icon = current.icon;
    const modalRef = useModalA11y(null); // No Escape — user must take action

    useEffect(() => {
        if (!type) return undefined;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                type === 'fired' ? onRestart() : onContinue();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [type, onContinue, onRestart]);

    if (!type) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-hud p-4 backdrop-blur-sm">
            <div ref={modalRef} role="alertdialog" aria-modal="true" aria-labelledby="gameover-title" className={`w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border-2 ${current.border}`}>
                {/* Header */}
                <div className={`${current.bg} p-6 text-center border-b ${current.border}`}>
                    <Icon size={64} className={`mx-auto mb-4 ${current.color}`} />
                    <h2 id="gameover-title" className={`text-2xl font-black tracking-tight ${current.color}`}>
                        {current.title}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <p className="text-slate-600 mb-6 font-medium text-lg">
                        {reason || current.message}
                    </p>

                    {type === 'fired' ? (
                        <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm text-slate-500">
                            <p className="font-semibold mb-1">Tips Evaluasi:</p>
                            <ul className="text-left list-disc list-inside space-y-1">
                                <li>Jaga RNS di bawah 5%</li>
                                <li>Pastikan diagnosis akurat</li>
                                <li>Hindari keluhan pasien</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 mb-6 uppercase tracking-wider font-semibold">
                            Kesempatan Tersisa: {type === 'warning1' ? '2' : '1'}
                        </div>
                    )}

                    <button
                        onClick={type === 'fired' ? onRestart : onContinue}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2
                            ${type === 'fired'
                                ? 'bg-slate-800 text-white hover:bg-slate-900'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-lg'
                            }`}
                    >
                        {type === 'fired' ? <RefreshCw size={20} /> : <ArrowRight size={20} />}
                        {current.action}
                    </button>
                </div>
            </div>
        </div>
    );
}
