/**
 * @reflection
 * [IDENTITY]: OrderModal
 * [PURPOSE]: React UI component: OrderModal.
 * [STATE]: Experimental
 * [ANCHOR]: OrderModal
 * [DEPENDS_ON]: GameContext, MedicationDatabase, SupplierDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { MEDICATION_DATABASE, getMedicationById } from '../data/MedicationDatabase.js';
import { SUPPLIER_DATABASE } from '../data/SupplierDatabase.js';
import { X, ShoppingCart } from 'lucide-react';

export default function OrderModal({ onClose }) {
    const { pharmacyInventory, submitOrder, day, stats: _stats } = useGame();
    const [quantities, setQuantities] = useState({});
    const modalRef = useModalA11y(onClose);
    const [selectedSupplierId, setSelectedSupplierId] = useState('dinkes');

    const lowStockMeds = pharmacyInventory
        .map(item => ({
            ...getMedicationById(item.medicationId),
            currentStock: item.stock
        }))
        .filter(med => med.currentStock < med.minStock);

    const handleOrder = () => {
        const orderItems = lowStockMeds.map(med => ({
            medicationId: med.id,
            quantity: med.minStock
        }));

        const result = submitOrder(orderItems, selectedSupplierId, day);
        if (result.success) {
            alert('Order berhasil dibuat!');
            onClose();
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="order-title" className="bg-white w-full max-w-3xl rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="order-title" className="text-2xl font-bold">Buat Pesanan</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded" aria-label="Tutup pesanan">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Pilih Supplier</label>
                    <select
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {SUPPLIER_DATABASE.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name} - {supplier.leadTime} hari
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Item yang Perlu Diorder ({lowStockMeds.length})</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {lowStockMeds.map(med => (
                            <div key={med.id} className="p-3 bg-slate-50 rounded flex justify-between">
                                <div>
                                    <p className="font-semibold">{med.name}</p>
                                    <p className="text-xs text-slate-600">
                                        Stock: {med.currentStock} / Min: {med.minStock}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold">Order: {med.minStock}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-200 rounded-lg font-semibold hover:bg-slate-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleOrder}
                        disabled={lowStockMeds.length === 0}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <ShoppingCart className="inline mr-2" size={18} />
                        Kirim Order
                    </button>
                </div>
            </div>
        </div>
    );
}
