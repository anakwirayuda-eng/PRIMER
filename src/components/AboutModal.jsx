import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { APP_METADATA } from '../data/AppMetadata.js';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';

export default function AboutModal({ onClose }) {
    const { isDark } = useTheme();
    const { t } = useTranslation();

    const history = t('about.history', { returnObjects: true });
    const objectives = t('about.objectives', { returnObjects: true });
    const localizedHistory = Array.isArray(history) ? history : APP_METADATA.history;
    const localizedObjectives = Array.isArray(objectives) ? objectives : APP_METADATA.objectives;
    const appFullName = t('app.full_name', { defaultValue: APP_METADATA.fullName });
    const appOrganization = t('app.organization', { defaultValue: APP_METADATA.organization });
    const appDepartment = t('app.department', { defaultValue: APP_METADATA.department });
    const appCopyright = t('app.copyright', { defaultValue: APP_METADATA.copyright });

    return (
        <div className="fixed inset-0 z-critical flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl shadow-2xl ${isDark ? 'border border-white/10 bg-slate-900' : 'bg-white'}`}>
                <div className="relative flex h-32 shrink-0 items-end bg-gradient-to-r from-emerald-600 to-teal-700 p-8">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white transition-all hover:bg-black/40"
                        aria-label={t('about.close_aria')}
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl border border-white/20 bg-white/20 p-2 backdrop-blur-sm">
                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-12 w-12 object-contain drop-shadow-lg" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-white">PRIMER</h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 opacity-80">
                                {appFullName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
                    <section>
                        <h3 className={`mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <div className="h-1 w-4 rounded-full bg-emerald-500" />
                            {t('about.sections.vision')}
                        </h3>
                        <p className={`border-l-4 pl-4 text-sm italic leading-relaxed ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                            "{t('about.description', { defaultValue: APP_METADATA.description })}"
                        </p>
                    </section>

                    <div className="grid grid-cols-2 gap-4">
                        <section className={`flex items-center gap-4 rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-10 w-10 object-contain" />
                            <div>
                                <h4 className={`mb-1 text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {t('about.labels.creator')}
                                </h4>
                                <p className={`text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {APP_METADATA.creator}
                                </p>
                                <div className="mt-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-tighter ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                        {appOrganization}
                                    </p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {appDepartment}
                                    </p>
                                </div>
                            </div>
                        </section>
                        <section className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                            <h4 className={`mb-1 text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {t('about.labels.version')}
                            </h4>
                            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                v{APP_METADATA.version}
                            </p>
                        </section>
                    </div>

                    <section>
                        <h3 className={`mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <div className={`h-1 w-4 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                            {t('about.sections.history')}
                        </h3>
                        <div className="space-y-4">
                            {localizedHistory.map((entry, index) => (
                                <div key={`${entry.year}-${index}`} className="group flex gap-4">
                                    <div className={`w-12 pt-1 font-mono text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {entry.year}
                                    </div>
                                    <div className={`flex-1 border-b pb-4 text-sm group-last:border-0 ${isDark ? 'border-white/5 text-slate-300' : 'border-slate-50 text-slate-600'}`}>
                                        {entry.event}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className={`mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <div className={`h-1 w-4 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                            {t('about.sections.objectives')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {localizedObjectives.map((objective, index) => (
                                <div key={index} className={`flex items-start gap-3 rounded-xl border p-3 ${isDark ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-emerald-100/50 bg-emerald-50/50'}`}>
                                    <div className="mt-1 text-emerald-500">
                                        <CheckCircle size={14} />
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                                        {objective}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className={`flex shrink-0 flex-col items-center justify-center border-t p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                    <div className={`mb-1 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        {t('about.footer.thanks')}
                    </div>
                    <div className={`mb-4 px-8 text-center text-[9px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {appCopyright}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-emerald-600 px-8 py-2 font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-700 active:scale-95"
                    >
                        {t('about.actions.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
