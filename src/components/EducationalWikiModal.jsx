/**
 * @reflection
 * [IDENTITY]: EducationalWikiModal
 * [PURPOSE]: Module: EducationalWikiModal - Knowledge base with dynamic loading.
 * [STATE]: Experimental
 * [ANCHOR]: EducationalWikiModal
 * [DEPENDS_ON]: WikiData
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, useEffect } from 'react';
import { X, BookOpen, Activity, Info, Lightbulb, Target, Shield, HelpCircle, TrendingUp, DollarSign, Users, Package, GraduationCap, Home, AlertCircle, Search, Brain, ChevronRight, Zap, Microscope, FlaskConical, Scissors, Anchor, Droplet, Disc } from 'lucide-react';
import { getWikiEntry, WIKI_REGISTRY } from '../data/WikiData.js';
import useModalA11y from '../hooks/useModalA11y.js';

const icons = {
    DollarSign, Users, Package, Shield, TrendingUp, Activity, AlertCircle, GraduationCap,
    Home, Info, HelpCircle, Target, BookOpen, Zap, Microscope, FlaskConical,
    Scissors, Anchor, Droplet, Disc
};

const MAIA_CODEX_THEME = {
    manajemen: "from-blue-600 to-indigo-600",
    klinis: "from-rose-600 to-orange-600",
    wilayah: "from-emerald-600 to-teal-600",
    prosedur: "from-amber-600 to-yellow-600",
    lab: "from-purple-600 to-fuchsia-600",
    farmasi: "from-emerald-700 to-green-900",
    default: "from-slate-600 to-slate-800"
};

const EducationalWikiModal = ({ metricKey, isOpen, onClose }) => {
    const modalRef = useModalA11y(onClose);
    const [currentKey, setCurrentKey] = useState(metricKey || 'liquidity');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Flat list of all available keys from registry for sidebar/search
    const allItems = useMemo(() => {
        return Object.entries(WIKI_REGISTRY).flatMap(([cat, keys]) =>
            keys.map(key => ({ key, category: cat, title: key.replace(/_/g, ' ').toUpperCase() }))
        );
    }, []);

    // Update internal state when metricKey prop changes
    useEffect(() => {
        if (metricKey) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync internal key from prop
            setCurrentKey(metricKey);
        }
    }, [metricKey]);

    // Load entry content when currentKey or isOpen changes
    useEffect(() => {
        if (isOpen && currentKey) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: trigger loading state for async data fetch
            setIsLoading(true);
            getWikiEntry(currentKey).then(entry => {
                setData(entry);
                setIsLoading(false);
            });
        }
    }, [isOpen, currentKey]);

    const filteredItems = useMemo(() => {
        if (!searchQuery) return allItems;
        const q = searchQuery.toLowerCase();
        return allItems.filter(item =>
            item.key.toLowerCase().includes(q) ||
            item.title.toLowerCase().includes(q)
        );
    }, [searchQuery, allItems]);

    const categories = Object.keys(WIKI_REGISTRY);

    if (!isOpen) return null;

    const Icon = data?.icon && icons[data.icon] ? icons[data.icon] : Info;
    const theme = data?.category && MAIA_CODEX_THEME[data.category] ? MAIA_CODEX_THEME[data.category] : MAIA_CODEX_THEME.default;

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="codex-title"
                data-testid="maia-codex"
                className="bg-slate-900/40 border border-white/10 w-full max-w-6xl h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl flex animate-in zoom-in-95 duration-300 backdrop-blur-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sidebar Navigation */}
                <div className="w-72 border-r border-white/5 bg-slate-950/40 flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <Brain size={24} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                            </div>
                            <div>
                                <h1 id="codex-title" className="text-lg font-black text-white tracking-wider">MAIA <span className="text-indigo-400">CODEX</span></h1>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Knowledge Base v1.0</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                type="text"
                                placeholder="Cari pengetahuan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {filteredItems.length === 0 && searchQuery && (
                            <div className="text-center py-8 text-slate-500">
                                <Search size={20} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-bold">Tidak ditemukan</p>
                                <p className="text-[10px] opacity-70">Coba kata kunci lain</p>
                            </div>
                        )}
                        {categories
                            .filter(cat => filteredItems.some(item => item.category === cat))
                            .map(cat => (
                                <div key={cat} className="space-y-2">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">{cat}</h3>
                                    <div className="space-y-1">
                                        {filteredItems
                                            .filter(item => item.category === cat)
                                            .map(item => (
                                                <button
                                                    key={item.key}
                                                    onClick={() => setCurrentKey(item.key)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${currentKey === item.key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    <BookOpen size={16} className={currentKey === item.key ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                                                    <span className="text-xs font-bold text-left truncate">{item.title}</span>
                                                    {currentKey === item.key && <ChevronRight size={14} className="ml-auto" />}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-slate-900/20">
                    {/* Header */}
                    <div className={`p-8 bg-gradient-to-r ${theme} border-b border-white/10 flex justify-between items-center transition-all duration-500`}>
                        {isLoading ? (
                            <div className="flex items-center gap-4 text-white animate-pulse">
                                <Brain size={32} />
                                <span className="font-bold">Memuat Pengetahuan...</span>
                            </div>
                        ) : data ? (
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white shadow-xl">
                                    <Icon size={32} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                                            {data.category || 'Inquiry'}
                                        </span>
                                        {data.maiaInsight && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                                                <Zap size={10} /> AI VERIFIED
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{data.title}</h2>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-white/50">
                                <AlertCircle size={32} />
                                <span className="font-bold">Pengetahuan tidak ditemukan.</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/50 hover:text-white group"
                            aria-label="Tutup MAIA Codex"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                        {!data && !isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                <Search size={48} className="opacity-20" />
                                <p className="font-bold italic">Pilih topik di sidebar untuk mulai belajar.</p>
                            </div>
                        ) : data && (
                            <>
                                {/* MAIA's Insight */}
                                {data.maiaInsight && (
                                    <section className="relative">
                                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                        <div className="flex items-start gap-4 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 flex-shrink-0">
                                                <Brain size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">MAIA's Clinical Insight</h4>
                                                <p className="text-slate-200 text-lg font-medium leading-relaxed italic">
                                                    "{data.maiaInsight}"
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Concept Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <HelpCircle size={20} />
                                        <h3 className="font-black text-sm uppercase tracking-[0.2em]">Deskripsi Fundamental</h3>
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed font-medium pl-2 border-l-2 border-white/5">
                                        {data.concept}
                                    </p>
                                </section>

                                {/* Grid Contexts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex items-center gap-3 mb-4 text-amber-400 group-hover:scale-105 transition-transform">
                                            <BookOpen size={20} />
                                            <h3 className="font-black text-sm uppercase tracking-wider">Perspektif Ilmu Kesehatan (IKM)</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                            {data.ikmContext}
                                        </p>
                                    </section>

                                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex items-center gap-3 mb-4 text-indigo-400 group-hover:scale-105 transition-transform">
                                            <Shield size={20} />
                                            <h3 className="font-black text-sm uppercase tracking-wider">Sistem Kesehatan Nasional (SKN)</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                            {data.sknContext}
                                        </p>
                                    </section>
                                </div>

                                {/* Did You Know? */}
                                <section className="relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>
                                    <div className="relative p-8 border border-indigo-500/20 rounded-3xl flex items-center gap-8">
                                        <div className="hidden lg:block">
                                            <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                                                <Lightbulb size={40} className="group-hover:animate-bounce" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-indigo-300">
                                                <Zap size={18} />
                                                <h3 className="font-black text-sm uppercase tracking-wider">Tahukah Anda?</h3>
                                            </div>
                                            <p className="text-base text-slate-200 font-bold leading-relaxed">
                                                {data.funFact}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Game Tips */}
                                <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                        <Target size={20} />
                                        <h3 className="font-black text-sm uppercase tracking-wider">MAIA's Strategy Recommendations</h3>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-1.5 h-16 bg-emerald-500 rounded-full"></div>
                                        <p className="text-lg text-slate-300 font-bold leading-snug">
                                            {data.gameTip}
                                        </p>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 bg-slate-950/50 border-t border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-slate-500">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                                <Microscope size={14} /> Clinical Database Linked
                            </div>
                            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                                <Activity size={14} /> Real-time Telemetry Active
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-white text-slate-950 hover:bg-indigo-50 text-base font-black rounded-2xl transition-all shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sinkronisasi Selesai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationalWikiModal;
