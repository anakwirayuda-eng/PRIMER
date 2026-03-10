import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { getMedicationById, MEDICATION_CATEGORIES } from '../data/MedicationDatabase.js';
import { Package, Search, AlertTriangle, TrendingDown, ShoppingCart, Box, Pill, Syringe, Shield, Filter, ChevronDown, BarChart3, Info } from 'lucide-react';
/**
 * @reflection
 * [IDENTITY]: SaranaPage
 * [PURPOSE]: React UI component: SaranaPage.
 * [STATE]: Experimental
 * [ANCHOR]: SaranaPage
 * [DEPENDS_ON]: GameContext, ThemeContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

// (Redundant static items removed)

const CATEGORY_COLORS = {
    obat: 'from-blue-500 to-indigo-600',
    alkes: 'from-emerald-500 to-teal-600',
    apd: 'from-amber-500 to-orange-600',
};

const CATEGORY_ICONS = {
    obat: Pill,
    alkes: Syringe,
    apd: Shield,
};

export default function SaranaPage() {
    const { stats, setStats, pharmacyInventory, updateInventory, openWiki } = useGame();
    const { isDark } = useTheme();

    React.useEffect(() => {
        guardStability('SARANA_INIT', 2000, 3);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, _setSortBy] = useState('name');

    // Sync with real inventory
    const medicalInventory = useMemo(() => {
        return (pharmacyInventory || []).map(item => {
            const med = getMedicationById(item.medicationId);
            if (!med) return null;
            return {
                id: item.medicationId,
                name: med.name,
                stock: item.stock,
                minStock: med.minStock,
                unit: med.type,
                category: med.category === MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT ? 'alkes' :
                    med.category === MEDICATION_CATEGORIES.EMERGENCY ? 'igd' : 'obat',
                price: med.unitPrice,
                expiry: '2026-12', // Placeholder for simplicity
                icon: med.type === 'tablet' ? '💊' : med.type === 'botol' ? '🍯' : '💉'
            };
        }).filter(Boolean);
    }, [pharmacyInventory]);

    const _handleRestock = (item) => {
        const cost = item.price * 100; // Buy 100 units
        if (stats.pendapatanUmum >= cost) {
            setStats(prev => ({ ...prev, pendapatanUmum: prev.pendapatanUmum - cost }));
            updateInventory(item.id, 100);
        } else {
            alert('Dana tidak cukup!');
        }
    };

    const filteredItems = (medicalInventory || [])
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'stock') return a.stock - b.stock;
            if (sortBy === 'expiry') return new Date(a.expiry) - new Date(b.expiry);
            return a.name.localeCompare(b.name);
        });

    const lowStockCount = medicalInventory.filter(i => i.stock < i.minStock).length;
    const expiringCount = 0; // Simplified

    const totalItems = medicalInventory.reduce((sum, i) => sum + i.stock, 0);
    const totalValue = medicalInventory.reduce((sum, i) => sum + (i.stock * i.price), 0);

    // Theme-aware classes
    const bgMain = isDark
        ? 'bg-gradient-to-br from-slate-900 via-orange-900/30 to-amber-900/20'
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50';
    const textPrimary = isDark ? 'text-white' : 'text-slate-800';
    const textSecondary = isDark ? 'text-orange-300' : 'text-orange-600';
    const cardBg = isDark ? 'bg-white/10 border-white/10' : 'bg-white border-orange-200 shadow-sm';
    const inputBg = isDark ? 'bg-white/10 border-white/10 text-white placeholder-slate-400' : 'bg-white border-orange-200 text-slate-800 placeholder-slate-400';
    const decorBg = isDark ? 'bg-orange-500/10' : 'bg-orange-200/50';

    return (
        <div className={`h-full overflow-auto ${bgMain}`}>
            {/* Decorative Elements */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${decorBg} rounded-full blur-3xl pointer-events-none`} />
            <div className={`absolute bottom-0 left-0 w-64 h-64 ${decorBg} rounded-full blur-3xl pointer-events-none`} />

            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/30">
                            <Package className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>Sarana & Logistik</h1>
                            <p className={textSecondary}>Kelola stok obat, alkes, dan kebutuhan operasional</p>
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all">
                        <ShoppingCart size={20} />
                        Pengadaan
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className={`backdrop-blur-xl rounded-2xl p-5 border ${cardBg}`}>
                        <Box className="text-orange-500 mb-2" size={24} />
                        <div className={`text-2xl font-black ${textPrimary}`}>{totalItems.toLocaleString()}</div>
                        <div className={`text-sm ${textSecondary}`}>Total Item</div>
                    </div>
                    <div className={`backdrop-blur-xl rounded-2xl p-5 border ${cardBg}`}>
                        <BarChart3 className="text-green-500 mb-2" size={24} />
                        <div className={`text-2xl font-black ${textPrimary}`}>Rp {(totalValue / 1000000).toFixed(1)}M</div>
                        <div className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>Nilai Inventori</div>
                    </div>
                    <div className={`rounded-2xl p-5 border ${lowStockCount > 0 ? 'bg-red-500/20 border-red-500/30' : cardBg}`}>
                        <TrendingDown className={`mb-2 ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-400'}`} size={24} />
                        <div className={`text-2xl font-black ${textPrimary}`}>{lowStockCount}</div>
                        <div className={`text-sm ${lowStockCount > 0 ? (isDark ? 'text-red-300' : 'text-red-600') : 'text-slate-400'}`}>Stok Rendah</div>
                    </div>
                    <div className={`rounded-2xl p-5 border ${expiringCount > 0 ? 'bg-amber-500/20 border-amber-500/30' : cardBg}`}>
                        <AlertTriangle className={`mb-2 ${expiringCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} size={24} />
                        <div className={`text-2xl font-black ${textPrimary}`}>{expiringCount}</div>
                        <div className={`text-sm ${expiringCount > 0 ? (isDark ? 'text-amber-300' : 'text-amber-600') : 'text-slate-400'}`}>Segera Expired</div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className={`backdrop-blur-xl rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-orange-200 shadow-sm'}`}>
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari barang..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${inputBg}`}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'obat', 'alkes', 'apd'].map(cat => {
                            const Icon = cat !== 'all' ? CATEGORY_ICONS[cat] : Filter;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${filterCategory === cat
                                        ? cat === 'all' ? 'bg-slate-800 text-white' : `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white shadow-lg`
                                        : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {cat === 'all' ? 'Semua' : cat.toUpperCase()}
                                    {cat !== 'all' && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openWiki(`item_${cat}`);
                                            }}
                                            className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <Info size={10} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Inventory Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredItems.map((item, idx) => {
                        const isLowStock = item.stock < item.minStock;
                        const isExpiring = (new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24 * 30) < 3;

                        return (
                            <div
                                key={item.id}
                                className={`group backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] cursor-pointer
                                    ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-orange-50 shadow-sm'}
                                    ${isLowStock ? 'border-red-500/50' : isExpiring ? 'border-amber-500/50' : isDark ? 'border-white/10' : 'border-orange-200'}
                                `}
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[item.category]} text-white`}>
                                        {item.category.toUpperCase()}
                                    </span>
                                </div>

                                <h3 className={`font-bold mb-1 leading-tight ${textPrimary}`}>{item.name}</h3>

                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className={`text-2xl font-black ${isLowStock ? 'text-red-500' : textPrimary}`}>
                                        {item.stock}
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ {item.minStock} {item.unit}</span>
                                </div>

                                <div className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <span>Exp: {item.expiry}</span>
                                    <span>Rp {item.price.toLocaleString('id-ID')}</span>
                                </div>

                                {/* Stock Bar */}
                                <div className={`h-1.5 rounded-full mt-3 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                                        style={{ width: `${Math.min(100, (item.stock / item.minStock) * 50)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
