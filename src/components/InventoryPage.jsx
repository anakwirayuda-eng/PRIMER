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
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { guardStability } from '../utils/prophylaxis.js';
import { MEDICATION_DATABASE, MEDICATION_CATEGORIES, getMedicationById } from '../data/MedicationDatabase.js';
import { Package, ShoppingCart, Search, Filter, AlertTriangle, TrendingDown, Package2, BarChart3, ClipboardList } from 'lucide-react';
import OrderModal from './OrderModal.jsx';

export default function InventoryPage() {
    const { pharmacyInventory, pendingOrders, day } = useGame();
    const [showOrderModal, setShowOrderModal] = useState(false);

    React.useEffect(() => {
        guardStability('INVENTORY_INIT', 2000, 3);
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Calculate stats
    const stats = useMemo(() => {
        const lowStock = pharmacyInventory.filter(item => {
            const med = getMedicationById(item.medicationId);
            return med ? item.stock < med.minStock : false;
        });

        const outOfStock = pharmacyInventory.filter(item => item.stock === 0);

        const totalValue = pharmacyInventory.reduce((sum, item) => {
            const med = getMedicationById(item.medicationId);
            return sum + (med ? med.unitPrice * item.stock : 0);
        }, 0);

        const activeOrders = pendingOrders.filter(o =>
            o.status === 'pending' && o.deliveryDay >= day
        );

        return {
            totalItems: MEDICATION_DATABASE.length,
            lowStock: lowStock.length,
            outOfStock: outOfStock.length,
            totalValue,
            pendingOrders: activeOrders.length
        };
    }, [pharmacyInventory, pendingOrders, day]);

    // Filter medications
    const filteredMeds = useMemo(() => {
        let result = MEDICATION_DATABASE;

        if (selectedCategory !== 'all') {
            result = result.filter(m => m.category === selectedCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(q) ||
                m.category.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q)
            );
        }

        return result;
    }, [searchQuery, selectedCategory]);

    return (
        <div className="h-full flex flex-col overflow-hidden bg-slate-50">
            {/* Header */}
            <div className="p-6 bg-white border-b">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Package size={32} />
                            Logistik Farmasi & Alkes
                        </h1>
                        <button
                            onClick={() => setShowOrderModal(true)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                            <ShoppingCart size={20} />
                            Buat Pesanan
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
                                    <p className="text-xs text-blue-600 font-bold">Total Items</p>
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
                                    <p className="text-xs text-amber-600 font-bold">Low Stock</p>
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
                                    <p className="text-xs text-rose-600 font-bold">Out of Stock</p>
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
                                    <p className="text-xs text-emerald-600 font-bold">Total Value</p>
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
                                    <p className="text-xs text-indigo-600 font-bold">Pending Orders</p>
                                    <p className="text-2xl font-black text-indigo-900">{stats.pendingOrders}</p>
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
                            placeholder="Cari obat atau alkes..."
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
                            <option value="all">Semua Kategori</option>
                            {Object.values(MEDICATION_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
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
                                        Nama Obat/Alkes
                                    </th>
                                    <th className="text-center px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        Stok
                                    </th>
                                    <th className="text-center px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        Min Stock
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-slate-600 uppercase">
                                        Harga/Unit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <ErrorBoundary name="InventoryList">
                                    {filteredMeds.map(med => {
                                        const item = pharmacyInventory.find(i => i.medicationId === med.id);
                                        const stock = item?.stock || 0;
                                        const isLow = stock < med.minStock;
                                        const isOut = stock === 0;

                                        return (
                                            <tr key={med.id} className="border-b hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{med.name}</p>
                                                        <p className="text-xs text-slate-500">{med.category}</p>
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
                                                    Rp {med.unitPrice.toLocaleString('id-ID')}
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
                                <p className="font-semibold">Tidak ada hasil ditemukan</p>
                                <p className="text-xs mt-1">Coba ubah kata kunci atau filter kategori</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showOrderModal && <OrderModal onClose={() => setShowOrderModal(false)} />}
        </div>
    );
}
