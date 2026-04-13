import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../../utils/ToastManager.js';

const TOAST_STYLES = {
    error: {
        wrapper: 'bg-red-600/95 border-red-500/30 text-white',
        icon: AlertTriangle
    },
    success: {
        wrapper: 'bg-emerald-600/95 border-emerald-500/30 text-white',
        icon: CheckCircle2
    },
    warning: {
        wrapper: 'bg-amber-600/95 border-amber-500/30 text-amber-50',
        icon: AlertTriangle
    },
    info: {
        wrapper: 'bg-blue-600/95 border-blue-500/30 text-white',
        icon: Info
    }
};

function ToastCard({ toast, onDismiss }) {
    const tone = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
    const Icon = tone.icon;

    return (
        <div
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300 ${tone.wrapper}`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                    <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-sm font-bold leading-snug">{toast.message}</p>
                    {toast.isConfirm && (
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => onDismiss(toast.id, true)}
                                className="flex-1 rounded-xl bg-white/20 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all hover:bg-white/30"
                            >
                                Ya, lanjutkan
                            </button>
                            <button
                                onClick={() => onDismiss(toast.id, false)}
                                className="flex-1 rounded-xl bg-black/20 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all hover:bg-black/30"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </div>
                {!toast.isConfirm && (
                    <button
                        onClick={() => onDismiss(toast.id)}
                        className="shrink-0 rounded-xl bg-black/15 p-1.5 transition-colors hover:bg-black/25"
                        aria-label="Tutup notifikasi"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ToastViewport() {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            data-testid="toast-viewport"
            className="pointer-events-none fixed inset-x-3 top-0 z-[140] flex flex-col gap-2 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:left-auto sm:right-4 sm:w-full sm:max-w-md"
            aria-live="polite"
            aria-atomic="true"
        >
            {toasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
            ))}
        </div>
    );
}
