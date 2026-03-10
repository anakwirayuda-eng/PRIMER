import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function OutbreakBanner({ outbreakNotification, onViewMap, onDismiss }) {
    if (!outbreakNotification) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-modal animate-in slide-in-from-top duration-500" role="alert" aria-live="assertive">
            <div className="bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-rose-400">
                <div className="bg-white/20 p-2 rounded-full animate-pulse">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-black text-sm uppercase tracking-tight">Peringatan Wabah!</h4>
                    <p className="text-xs text-rose-100 italic">Kasus {outbreakNotification.typeData?.name} terdeteksi di {outbreakNotification.villageName || 'Desa'}.</p>
                </div>
                <button
                    onClick={onViewMap}
                    className="ml-4 px-4 py-2 bg-white text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors"
                >
                    Lihat Peta
                </button>
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Tutup notifikasi wabah"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
