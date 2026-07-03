import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from 'lucide-react';

export default function OutbreakBanner({ outbreakNotification, onViewMap, onDismiss }) {
    const { t } = useTranslation();
    if (!outbreakNotification) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-modal animate-in slide-in-from-top duration-500" role="alert" aria-live="assertive">
            <div className="bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-rose-400">
                <div className="bg-white/20 p-2 rounded-full animate-pulse">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-black text-sm uppercase tracking-tight">{t('outbreak.banner.title')}</h4>
                    <p className="text-xs text-rose-100 italic">
                        {t('outbreak.banner.description', {
                            type: outbreakNotification.typeData?.name,
                            village: outbreakNotification.villageName || t('outbreak.fallbackVillage')
                        })}
                    </p>
                </div>
                <button
                    onClick={onViewMap}
                    className="ml-4 px-4 py-2 bg-white text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors"
                >
                    {t('outbreak.banner.viewMap')}
                </button>
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    aria-label={t('outbreak.banner.closeAria')}
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
