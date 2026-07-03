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
import { useTranslation } from 'react-i18next';
import { AlertTriangle, FileWarning, LogOut, RefreshCw, ArrowRight } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';

export default function GameOverModal({ type, reason, onContinue, onRestart }) {
    const { t } = useTranslation();

    const config = {
        warning1: {
            title: t('gameOver.warning1.title'),
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: FileWarning,
            message: t('gameOver.warning1.message'),
            action: t('gameOver.warning1.action')
        },
        warning2: {
            title: t('gameOver.warning2.title'),
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: AlertTriangle,
            message: t('gameOver.warning2.message'),
            action: t('gameOver.warning2.action')
        },
        fired: {
            title: t('gameOver.fired.title'),
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: LogOut,
            message: t('gameOver.fired.message'),
            action: t('gameOver.fired.action')
        },
        fainted: {
            title: t('gameOver.fainted.title'),
            color: 'text-indigo-700',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            icon: AlertTriangle,
            message: t('gameOver.fainted.message'),
            action: t('gameOver.fainted.action')
        },
        runtime_trap: {
            title: t('gameOver.runtime_trap.title'),
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: AlertTriangle,
            message: t('gameOver.runtime_trap.message'),
            action: t('gameOver.runtime_trap.action')
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
                            <p className="font-semibold mb-1">{t('gameOver.fired.tips_title')}</p>
                            <ul className="text-left list-disc list-inside space-y-1">
                                <li>{t('gameOver.fired.tip_rrns')}</li>
                                <li>{t('gameOver.fired.tip_accuracy')}</li>
                                <li>{t('gameOver.fired.tip_complaints')}</li>
                            </ul>
                        </div>
                    ) : type === 'runtime_trap' ? (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-sm text-amber-900">
                            {t('gameOver.runtime_trap.notice')}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 mb-6 uppercase tracking-wider font-semibold">
                            {t('gameOver.remaining_chances', { count: type === 'warning1' ? 2 : 1 })}
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
