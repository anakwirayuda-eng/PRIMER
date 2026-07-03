/**
 * @reflection
 * [IDENTITY]: InventoryPage
 * [PURPOSE]: React UI component: InventoryPage.
 * [STATE]: Experimental
 * [ANCHOR]: InventoryPage
 * [DEPENDS_ON]: GameContext, MedicationDatabase, OrderModal
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useGameStore } from '../store/useGameStore.js';
import { guardStability } from '../utils/prophylaxis.js';
import { MEDICATION_DATABASE, MEDICATION_CATEGORIES, getMedicationById } from '../data/MedicationDatabase.js';
import { Package, ShoppingCart, Search, Filter, AlertTriangle, TrendingDown, Package2, BarChart3, ClipboardList, ChevronDown } from 'lucide-react';
import OrderModal from './OrderModal.jsx';
import { normalizeMedicationId } from '../models/InventoryRuntime.js';

const CATEGORY_LABEL_KEYS = {
    [MEDICATION_CATEGORIES.ANALGESIC]: 'analgesic',
    [MEDICATION_CATEGORIES.ANTIBIOTIC]: 'antibiotic',
    [MEDICATION_CATEGORIES.ANTIHYPERTENSIVE]: 'antihypertensive',
    [MEDICATION_CATEGORIES.ANTIDIABETIC]: 'antidiabetic',
    [MEDICATION_CATEGORIES.RESPIRATORY]: 'respiratory',
    [MEDICATION_CATEGORIES.GASTROINTESTINAL]: 'gastrointestinal',
    [MEDICATION_CATEGORIES.DERMATOLOGY]: 'dermatology',
    [MEDICATION_CATEGORIES.SUPPLEMENT]: 'supplement',
    [MEDICATION_CATEGORIES.PSYCHIATRY_NEURO]: 'psychiatryNeuro',
    [MEDICATION_CATEGORIES.ENT_EYE]: 'entEye',
    [MEDICATION_CATEGORIES.MEDICAL_EQUIPMENT]: 'medicalEquipment',
    [MEDICATION_CATEGORIES.EQUIPMENT]: 'equipment',
    [MEDICATION_CATEGORIES.LAB_REAGENT]: 'labReagent',
    [MEDICATION_CATEGORIES.EMERGENCY]: 'emergency',
    [MEDICATION_CATEGORIES.METABOLIC]: 'metabolic'
};

function translateCategory(t, category) {
    return t(`inventoryPage.categories.${CATEGORY_LABEL_KEYS[category]}`, { defaultValue: category });
}

export default function InventoryPage() {
    const { t } = useTranslation();
    const { pharmacyInventory, pendingOrders, day } = useGame();
    const procurementLog = useGameStore(state => state.finance.procurementLog || []);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showProcurementLog, setShowProcurementLog] = useState(false);

    React.useEffect(() => {
        guardStability('INVENTORY_INIT', 2000, 3);
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Calculate stats
    const stats = useMemo(() => {
        // Codex Fix: exclude pseudo-items from inventory stats
        const stockItems = pharmacyInventory.filter(item => {
            const m = getMedicationById(item.medicationId);
            return m && m.form !== 'action' && m.form !== 'equipment';
        });
        const lowStock = stockItems.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med ? item.stock < med.minStock : false;
        });

        const outOfStock = stockItems.filter(item => item.stock === 0);

        const totalValue = stockItems.reduce((sum, item) => {
            const med = getMedicationById(item.medicationId);
            return sum + (med ? med.buyPrice * item.stock : 0);
        }, 0);

        // Codex Fix: show both pending and overdue orders (was hiding overdue)
        const activeOrders = pendingOrders.filter(o =>
            o.status === 'pending' && o.deliveryDay >= day
        );
        const overdueOrders = pendingOrders.filter(o =>
            o.status === 'pending' && o.deliveryDay < day
        );

        return {
            totalItems: stockItems.length, // Codex Fix: use filtered count, not raw DB
            lowStock: lowStock.length,
            outOfStock: outOfStock.length,
            totalValue,
            pendingOrders: activeOrders.length,
            overdueOrders: overdueOrders.length
        };
    }, [pharmacyInventory, pendingOrders, day]);

    // Filter medications — Codex Fix: use stockItems base, null-safe search
    const filteredMeds = useMemo(() => {
        const seen = new Set();
        let result = MEDICATION_DATABASE
            .filter(m => m && m.form !== 'action' && m.form !== 'equipment')
            .map((med) => {
                const canonicalId = normalizeMedicationId(med.id);
                if (seen.has(canonicalId)) return null;
                seen.add(canonicalId);
                return getMedicationById(canonicalId) || med;
            })
            .filter(Boolean);

        if (selectedCategory !== 'all') {
            result = result.filter(m => m.category === selectedCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(m =>
                (m.name && m.name.toLowerCase().includes(q)) ||
                (m.category && m.category.toLowerCase().includes(q)) ||
                (m.description && m.description.toLowerCase().includes(q))
            );
        }

        return result;
    }, [searchQuery, selectedCategory]);

    const procurementEntries = useMemo(
        () => [...procurementLog].slice().reverse(),
        [procurementLog]
    );

    return (
        <div className="h-full flex flex-col overflow-hidden bg-slate-50">
            {/* Header */}
            <div className="p-6 bg-white border-b">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Package size={32} />
                            {t('inventoryPage.title')}
                        </h1>
                        <button
                            onClick={() => setShowOrderModal(true)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                            <ShoppingCart size={20} />
                            {t('inventoryPage.createOrder')}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-5 gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <Package2 size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold">{t('inventoryPage.stats.totalItems')}</p>
                                    <p className="text-2xl font-black text-blue-900">{stats.totalItems}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500 rounded-lg text-white">
                                    <TrendingDown size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600 font-bold">{t('inventoryPage.stats.lowStock')}</p>
                                    <p className="text-2xl font-black text-amber-900">{stats.lowStock}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl border border-rose-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500 rounded-lg text-white">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-rose-600 font-bold">{t('inventoryPage.stats.outOfStock')}</p>
                                    <p className="text-2xl font-black text-rose-900">{stats.outOfStock}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                    <BarChart3 size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600 font-bold">{t('inventoryPage.stats.totalValue')}</p>
                                    <p className="text-xl font-black text-emerald-900">
                                        Rp {(stats.totalValue / 1000000).toFixed(1)}M
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                    <ClipboardList size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-600 font-bold">{t('inventoryPage.stats.pendingOrders')}</p>
                                    <p className="text-2xl font-black text-indigo-900">{stats.pendingOrders}</p>
                                    {stats.overdueOrders > 0 && (
                                        <p className="text-[10px] font-bold text-rose-600">{t('inventoryPage.stats.overdueOrders', { count: stats.overdueOrders })}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="px-6 py-4 bg-white border-b">
                <div className="max-w-7xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('inventoryPage.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                        >
                            <option value="all">{t('inventoryPage.allCategories')}</option>
                            {Object.values(MEDICATION_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{translateCategory(t, cat)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Inventory Table - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b sticky top-0">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        {t('inventoryPage.table.name')}
                                    </th>
                                    <th className="text-center px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        {t('inventoryPage.table.stock')}
                                    </th>
                                    <th className="text-center px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        {t('inventoryPage.table.minStock')}
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        {t('inventoryPage.table.unitPrice')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <ErrorBoundary name="InventoryList">
                                    {filteredMeds.map(med => {
                                        const item = pharmacyInventory.find(i => i.medicationId === normalizeMedicationId(med.id));
                                        const stock = item?.stock || 0;
                                        const isLow = stock < med.minStock;
                                        const isOut = stock === 0;

                                        return (
                                            <tr key={med.id} className="border-b hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{med.name}</p>
                                                        <p className="text-xs text-slate-500">{translateCategory(t, med.category)}</p>
                                                    </div>
                                                </td>
                                                <td className="text-center px-6 py-4">
                                                    <span className={
                                                        isOut ? 'text-rose-600 font-black' :
                                                            isLow ? 'text-amber-600 font-bold' :
                                                                'text-slate-700'
                                                    }>
                                                        {stock.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td className="text-center text-slate-600 px-6 py-4">
                                                    {med.minStock.toLocaleString('id-ID')}
                                                </td>
                                                <td className="text-right px-6 py-4 font-semibold text-slate-700">
                                                    Rp {(med.buyPrice || 0).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </ErrorBoundary>
                            </tbody>
                        </table>

                        {filteredMeds.length === 0 && (
                            <div className="py-12 text-center text-slate-500">
                                <Package size={48} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">{t('inventoryPage.emptyTitle')}</p>
                                <p className="text-xs mt-1">{t('inventoryPage.emptyHint')}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 bg-white rounded-xl border shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowProcurementLog((prev) => !prev)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b text-left"
                        >
                            <div>
                                <p className="text-sm font-bold text-slate-800">{t('inventoryPage.procurement.title')}</p>
                                <p className="text-xs text-slate-500">{t('inventoryPage.procurement.subtitle')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full">
                                    {t('inventoryPage.procurement.logCount', { count: procurementEntries.length })}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-500 transition-transform ${showProcurementLog ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </button>

                        {showProcurementLog && (
                            procurementEntries.length === 0 ? (
                                <div className="px-6 py-10 text-center text-slate-500">
                                    <ClipboardList size={28} className="mx-auto mb-3 opacity-40" />
                                    <p className="font-semibold">{t('inventoryPage.procurement.empty')}</p>
                                </div>
                            ) : (
                                <div className="max-h-80 overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 sticky top-0 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">{t('inventoryPage.procurement.day')}</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Supplier</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase">{t('inventoryPage.procurement.items')}</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">{t('inventoryPage.procurement.totalCost')}</th>
                                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase">{t('inventoryPage.procurement.type')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {procurementEntries.map((entry, index) => {
                                                const typeLabel = entry.receiptMode === 'auto'
                                                    ? 'AUTO'
                                                    : entry.isExpress
                                                        ? 'EXPRESS'
                                                        : 'REGULAR';
                                                return (
                                                    <tr key={`${entry.orderId || 'log'}-${entry.timestamp || index}`} className="border-b hover:bg-slate-50">
                                                        <td className="px-6 py-3 text-sm text-slate-700">{t('inventoryPage.procurement.dayValue', { day: entry.day ?? '-' })}</td>
                                                        <td className="px-6 py-3 text-sm text-slate-700">{entry.supplierName || entry.supplierId || '-'}</td>
                                                        <td className="px-6 py-3 text-center text-sm font-semibold text-slate-700">{entry.itemCount || 0}</td>
                                                        <td className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                                                            Rp {(entry.cost || 0).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                                                typeLabel === 'AUTO'
                                                                    ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                                                    : typeLabel === 'EXPRESS'
                                                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                                            }`}>
                                                                {typeLabel}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {showOrderModal && <OrderModal onClose={() => setShowOrderModal(false)} />}
        </div>
    );
}
