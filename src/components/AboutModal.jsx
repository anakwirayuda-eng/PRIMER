import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { X, CheckCircle } from 'lucide-react';
import { APP_METADATA } from '../data/AppMetadata.js';
import { getAssetUrl, ASSET_KEY } from '../assets/assets.js';

export default function AboutModal({ onClose }) {
    const { isDark } = useTheme();

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-critical p-4 animate-in fade-in duration-300">
            <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}>
                {/* Header Image/Pattern */}
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-700 p-8 flex items-end relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
                        aria-label="Tutup Tentang Kami"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-12 w-12 object-contain drop-shadow-lg" />
                        </div>
                        <div>
                            <h2 className="text-white text-3xl font-black tracking-tighter">PRIMER</h2>
                            <p className="text-emerald-100 text-xs font-bold tracking-widest uppercase opacity-80">{APP_METADATA.fullName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <section>
                        <h3 className={`font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            <div className="w-4 h-1 bg-emerald-500 rounded-full"></div>
                            Visi & Misi
                        </h3>
                        <p className={`leading-relaxed text-sm italic pl-4 ${isDark ? 'text-slate-300 border-l-4 border-slate-700' : 'text-slate-600 border-l-4 border-slate-100'}`}>
                            "{APP_METADATA.description}"
                        </p>
                    </section>

                    <div className="grid grid-cols-2 gap-4">
                        <section className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                            <img src={getAssetUrl(ASSET_KEY.ITS_LOGO)} alt="ITS" className="h-10 w-10 object-contain" />
                            <div>
                                <h4 className={`font-bold text-[10px] uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Kreator</h4>
                                <p className={`font-black text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{APP_METADATA.creator}</p>
                                <div className="mt-1">
                                    <p className={`font-bold text-[11px] uppercase tracking-tighter ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{APP_METADATA.organization}</p>
                                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{APP_METADATA.department}</p>
                                </div>
                            </div>
                        </section>
                        <section className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                            <h4 className={`font-bold text-[10px] uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Versi Perangkat Lunak</h4>
                            <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>v{APP_METADATA.version}</p>
                        </section>
                    </div>

                    <section>
                        <h3 className={`font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <div className={`w-4 h-1 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
                            Sejarah Pengembangan
                        </h3>
                        <div className="space-y-4">
                            {APP_METADATA.history.map((h, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className={`w-12 font-mono text-[10px] pt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{h.year}</div>
                                    <div className={`flex-1 text-sm pb-4 border-b group-last:border-0 ${isDark ? 'text-slate-300 border-white/5' : 'text-slate-600 border-slate-50'}`}>{h.event}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className={`font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <div className={`w-4 h-1 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
                            Tujuan & Fokus Utama
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {APP_METADATA.objectives.map((obj, i) => (
                                <div key={i} className={`flex gap-3 items-start p-3 rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100/50'}`}>
                                    <div className="text-emerald-500 mt-1">
                                        <CheckCircle size={14} />
                                    </div>
                                    <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>{obj}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className={`p-6 flex flex-col items-center justify-center shrink-0 border-t ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`text-[10px] uppercase tracking-[0.2em] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Terima kasih telah berkontribusi bagi kesehatan bangsa</div>
                    <div className={`text-[9px] mb-4 px-8 text-center leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {APP_METADATA.copyright}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                    >
                        Tutup Panel
                    </button>
                </div>
            </div>
        </div>
    );
}
