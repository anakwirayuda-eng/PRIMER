/**
 * @reflection
 * [IDENTITY]: OrderModal
 * [PURPOSE]: React UI component: OrderModal.
 * [STATE]: Experimental
 * [ANCHOR]: OrderModal
 * [DEPENDS_ON]: GameContext, MedicationDatabase, SupplierDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-24
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { MEDICATION_DATABASE, getMedicationById } from '../data/MedicationDatabase.js';
import { SUPPLIER_DATABASE, getSupplierById } from '../data/SupplierDatabase.js';
import { X, ShoppingCart } from 'lucide-react';
import { normalizeMedicationId } from '../models/InventoryRuntime.js';
import { showToast } from '../utils/ToastManager.js';

export default function OrderModal({ onClose }) {
    const { t } = useTranslation();
    const { pharmacyInventory, submitOrder, day, stats: _stats, pendingOrders = [] } = useGame();
    const modalRef = useModalA11y(onClose);
    const [selectedSupplierId, setSelectedSupplierId] = useState('dinkes');
    const [isExpress, setIsExpress] = useState(false);

    // Codex Fix: only exclude items with PENDING + not-overdue orders
    // Overdue orders (deliveryDay < day) should NOT block reorder
    const pendingMedIds = new Set((pendingOrders || []).filter(o => o.status === 'pending' && o.deliveryDay >= day).flatMap(o =>
        (o.items || []).map(i => normalizeMedicationId(i.medicationId))
    ));

    const lowStockMeds = pharmacyInventory
        .map(item => ({
            ...getMedicationById(item.medicationId),
            currentStock: item.stock
        }))
        // Codex Fix: exclude non-stock pseudo-items (care instructions like bed_rest, diet)
        .filter(med => med.id && med.form !== 'action' && med.form !== 'equipment')
        .filter(med => med.currentStock < med.minStock && !pendingMedIds.has(med.id));

    const handleOrder = () => {
        const orderItems = lowStockMeds.map(med => ({
            medicationId: med.id,
            // Codex Fix: order deficit, not full minStock (prevents overstocking)
            quantity: Math.max(1, med.minStock - med.currentStock)
        }));

        const result = submitOrder(orderItems, selectedSupplierId, day, isExpress);
        if (result.success) {
            // Codex Fix: show skipped items so player knows about partial orders
            const createdCount = result.order?.items?.length ?? orderItems.length;
            const msg = result.skipped?.length
                ? t('orderModal.toast.partial', { count: createdCount, skippedCount: result.skipped.length, skipped: result.skipped.join(', ') })
                : t('orderModal.toast.success', { count: createdCount });
            showToast(msg, result.skipped?.length ? 'warning' : 'success', 4200);
            onClose();
        } else {
            showToast(result.error || t('orderModal.toast.error'), 'error', 4200);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="order-title" className="bg-white w-full max-w-3xl rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="order-title" className="text-2xl font-bold">{t('orderModal.title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded" aria-label={t('orderModal.closeAria')}>
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">{t('orderModal.supplier')}</label>
                    <select
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        {SUPPLIER_DATABASE.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name} - {t('orderModal.leadTime', { count: supplier.leadTime })}
                            </option>
                        ))}
                    </select>
                </div>

                {(() => {
                    const sup = getSupplierById(selectedSupplierId);
                    return sup?.expressFee ? (
                        <div className="mb-4">
                            <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isExpress}
                                    onChange={(e) => setIsExpress(e.target.checked)}
                                    className="w-4 h-4 accent-amber-600"
                                />
                                <div>
                                    <span className="text-sm font-bold text-amber-800">{t('orderModal.expressTitle')}</span>
                                    <p className="text-xs text-amber-600">{t('orderModal.expressDescription', { value: sup.expressFee.toLocaleString('id-ID') })}</p>
                                </div>
                            </label>
                        </div>
                    ) : null;
                })()}

                <div className="mb-6">
                    <h3 className="font-semibold mb-2">{t('orderModal.itemsToOrder', { count: lowStockMeds.length })}</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {lowStockMeds.map(med => (
                            <div key={med.id} className="p-3 bg-slate-50 rounded flex justify-between">
                                <div>
                                    <p className="font-semibold">{med.name}</p>
                                    <p className="text-xs text-slate-600">
                                        {t('orderModal.stockLine', { stock: med.currentStock, min: med.minStock })}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold">{t('orderModal.orderQty', { count: Math.max(1, med.minStock - med.currentStock) })}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-200 rounded-lg font-semibold hover:bg-slate-300"
                    >
                        {t('orderModal.cancel')}
                    </button>
                    <button
                        onClick={handleOrder}
                        disabled={lowStockMeds.length === 0}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                    >
                        <ShoppingCart className="inline mr-2" size={18} />
                        {t('orderModal.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
}
