/**
 * @reflection
 * [IDENTITY]: createFinanceSlice (CP2 extraction)
 * [PURPOSE]: Finance, pharmacy, procurement state slice
 * [STATE]: Production
 * [CROSS_SLICE]: markPrescriptionDispensed writes clinical.history + player.profile
 *               processMonthlyReport writes finance + clinical.monthlyArchive
 * [DEPENDS_ON]: MedicationDatabase, SupplierDatabase, BillingEngine, InventoryRuntime,
 *               archiveHelpers, operationalFunds, SoundManager, immer(produce)
 * [LAST_UPDATE]: 2026-03-27
 */
import { produce } from 'immer';
import { soundManager } from '../../utils/SoundManager.js';
import { getMedicationById } from '../../data/MedicationDatabase.js';
import { getSupplierById, calculateOrderCost, estimateDeliveryDate } from '../../data/SupplierDatabase.js';
import { normalizeInventoryList, normalizeMedicationId } from '../../models/InventoryRuntime.js';
import { canAffordOperationalCost, spendOperationalFunds } from '../../utils/operationalFunds.js';
import { buildMonthlyArchiveEntry, ACCREDITATION_MULTIPLIER } from '../helpers/archiveHelpers.js';
import { createInitialFinanceState } from '../helpers/persistenceHelpers.js';
import { INITIAL_KPI } from '../helpers/persistenceHelpers.js';
import { applyXpGainToProfile } from '../helpers/playerHelpers.js';

export const createFinanceSlice = (set, get) => ({
    // --- STATE ---
    finance: createInitialFinanceState(),

    // --- ACTIONS ---
    financeActions: {
        setStats: (val) => set(s => ({ finance: { ...s.finance, stats: typeof val === 'function' ? val(s.finance.stats) : val } })),
        setKpi: (val) => set(s => ({ finance: { ...s.finance, kpi: typeof val === 'function' ? val(s.finance.kpi) : val } })),
        setFacilities: (val) => set(s => ({ finance: { ...s.finance, facilities: typeof val === 'function' ? val(s.finance.facilities) : val } })),
        setPharmacyInventory: (val) => set(s => ({
            finance: {
                ...s.finance,
                pharmacyInventory: normalizeInventoryList(typeof val === 'function' ? val(s.finance.pharmacyInventory) : val)
            }
        })),
        setPendingOrders: (val) => set(s => ({ finance: { ...s.finance, pendingOrders: typeof val === 'function' ? val(s.finance.pendingOrders) : val } })),
        upgradeFacility: (facilityId, cost) => {
            const state = get();
            if (state.finance.facilities[facilityId] !== undefined && canAffordOperationalCost(state.finance.stats, cost)) {
                set(s => ({
                    finance: {
                        ...s.finance,
                        stats: spendOperationalFunds(s.finance.stats, cost),
                        facilities: { ...s.finance.facilities, [facilityId]: s.finance.facilities[facilityId] + 1 }
                    }
                }));
                soundManager.playSuccess();
                return true;
            }
            return false;
        },
        consumeMedication: (medicationId, quantity, buffs = {}) => {
            const state = get();
            const canonicalMedicationId = normalizeMedicationId(medicationId);
            const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === canonicalMedicationId);
            const medication = getMedicationById(canonicalMedicationId) || getMedicationById(medicationId);
            if (!medication) return { success: false, error: 'Medication not found' };
            if (!currentItem || currentItem.stock < quantity) return { success: false, error: `Insufficient stock` };
            set(s => ({
                finance: {
                    ...s.finance,
                    pharmacyInventory: s.finance.pharmacyInventory.map(item =>
                        item.medicationId === canonicalMedicationId ? { ...item, stock: item.stock - quantity } : item
                    )
                }
            }));
            // Codex Fix: pengeluaranObat is procurement-side only (COGS-on-purchase).
            // Consumption just reduces stock — cost was already posted when order was placed/received.
            return { success: true, remainingStock: currentItem.stock - quantity };
        },
        // Codex Fix: mark prescription as dispensed in history to prevent double-dispense on remount
        // CROSS-SLICE: writes clinical.history + player.profile
        markPrescriptionDispensed: (patientId) => {
            set(produce(state => {
                // Mark dispensed in history
                state.clinical.history = (state.clinical.history || []).map(h =>
                    h.id === patientId ? { ...h, dispensed: true } : h
                );
                // Pharmacy verification bonus: +5 XP, +1 reputation
                state.player.profile = applyXpGainToProfile({
                    ...state.player.profile,
                    reputation: Math.min(100, (state.player.profile.reputation || 0) + 1)
                }, 5);
            }));
        },
        checkInventoryAvailability: (medicationId, quantity) => {
            const state = get();
            const canonicalMedicationId = normalizeMedicationId(medicationId);
            const currentItem = state.finance.pharmacyInventory.find(item => item.medicationId === canonicalMedicationId);
            const medication = getMedicationById(canonicalMedicationId) || getMedicationById(medicationId);
            if (!currentItem || !medication) return { available: false, stock: 0 };
            return {
                available: currentItem.stock >= quantity,
                stock: currentItem.stock,
                isLowStock: currentItem.stock < medication.minStock,
                percentageOfMin: (currentItem.stock / medication.minStock) * 100
            };
        },
        submitOrder: (orderItems, supplierId, day, isExpress = false) => {
            const state = get();
            const supplier = getSupplierById(supplierId);
            if (!supplier) return { success: false, error: 'Supplier not found' };
            const normalizedOrderItems = (Array.isArray(orderItems) ? orderItems : []).map(item => ({
                ...item,
                medicationId: normalizeMedicationId(item?.medicationId)
            }));

            // Codex Fix: filter compatible items instead of blocking entire batch.
            // acceptsAll suppliers (dinkes, apotek) accept all categories incl. null.
            let compatibleItems = normalizedOrderItems;
            const skipped = [];
            if (!supplier.acceptsAll && supplier.availableCategories) {
                compatibleItems = [];
                for (const item of normalizedOrderItems) {
                    const med = getMedicationById(item.medicationId);
                    if (!med) continue;
                    // Codex Fix: null-category items are incompatible with specialized suppliers
                    if (!med.category || !supplier.availableCategories.includes(med.category)) {
                        skipped.push(med.name || item.medicationId);
                    } else {
                        compatibleItems.push(item);
                    }
                }
            }
            if (compatibleItems.length === 0) {
                return { success: false, error: `${supplier.name} tidak menjual item yang dipilih${skipped.length ? `: ${skipped.join(', ')}` : ''}` };
            }

            const items = compatibleItems.map(item => {
                const med = getMedicationById(item.medicationId);
                return { ...item, unitPrice: med?.buyPrice || 0 };
            });
            const costCalculation = calculateOrderCost(supplierId, items, isExpress);
            if (costCalculation.error) return { success: false, error: costCalculation.error };
            const totalCost = costCalculation.total; // Already includes express surcharge
            // Codex Fix: include pending kapitasi_deduction orders in solvency check
            const pendingKapitasiReserved = (state.finance.pendingOrders || []).filter(
                o => o.status === 'pending' && o.paymentTerms === 'kapitasi_deduction'
            ).reduce((sum, o) => sum + (o.cost || 0), 0);
            const effectiveKapitasi = state.finance.stats.kapitasi - pendingKapitasiReserved;
            if (effectiveKapitasi < totalCost) return { success: false, error: 'Dana kapitasi tidak cukup (termasuk order pending)' };
            if (supplier.paymentTerms === 'cash_upfront') {
                set(s => ({
                    finance: {
                        ...s.finance,
                        stats: {
                            ...s.finance.stats,
                            kapitasi: s.finance.stats.kapitasi - totalCost,
                            pengeluaranObat: (s.finance.stats.pengeluaranObat || 0) + totalCost
                        }
                    }
                }));
            }
            const newOrder = {
                id: `ORDER_${Date.now()}`,
                supplierId,
                items: compatibleItems.filter(ci => {
                    // Codex Fix: Strip program meds (buyPrice=0) from non-government orders
                    // so they don't piggyback into restock for free
                    const med = getMedicationById(ci.medicationId);
                    if (!med) return false;
                    if (med.buyPrice === 0 && supplier.type !== 'government') return false;
                    return true;
                }),
                orderDay: day,
                // Use estimateDeliveryDate with express flag (respects supplier contract)
                deliveryDay: (() => {
                    const baseDelivery = estimateDeliveryDate(supplierId, day, isExpress);
                    const maxItemLead = compatibleItems.reduce((max, item) => {
                        const med = getMedicationById(item.medicationId);
                        return (med?.leadTime && med.leadTime > max) ? med.leadTime : max;
                    }, 0);
                    return !isExpress && maxItemLead > 0 ? Math.max(baseDelivery, day + maxItemLead) : baseDelivery;
                })(),
                status: 'pending',
                cost: totalCost,
                paymentTerms: supplier.paymentTerms,
                isExpress
            };
            set(s => ({ finance: { ...s.finance, pendingOrders: [...s.finance.pendingOrders, newOrder] } }));
            // Audit trail: log the procurement event
            set(s => ({
                finance: {
                    ...s.finance,
                    procurementLog: [...(s.finance.procurementLog || []), {
                        type: 'order_placed',
                        orderId: newOrder.id,
                        supplierName: supplier.name,
                        supplierId,
                        itemCount: newOrder.items.length,
                        skippedCount: skipped.length,
                        cost: totalCost, // Include express surcharge
                        isExpress,
                        orderMode: isExpress ? 'express' : 'regular',
                        day,
                        timestamp: Date.now()
                    }]
                }
            }));
            compatibleItems = newOrder.items;
            soundManager.playConfirm();
            const msg = skipped.length > 0
                ? `Order dikirim (${compatibleItems.length} item). ${skipped.length} item dilewati — tidak tersedia di ${supplier.name}.`
                : `Order berhasil dikirim (${compatibleItems.length} item)`;
            return { success: true, order: newOrder, message: msg, skipped };
        },
        receiveOrder: (orderId, day) => {
            const state = get();
            const order = state.finance.pendingOrders.find(o => o.id === orderId);
            if (!order) return { success: false, error: 'Order not found' };
            set(s => {
                const newStats = { ...s.finance.stats };
                // Codex Fix: sync with nextDay path — deduct kapitasi for kapitasi_deduction orders
                if (order.paymentTerms === 'kapitasi_deduction' && order.cost) {
                    newStats.kapitasi = (newStats.kapitasi || 0) - order.cost;
                    newStats.pengeluaranObat = (newStats.pengeluaranObat || 0) + order.cost;
                }
                return {
                    finance: {
                        ...s.finance,
                        stats: newStats,
                        pharmacyInventory: s.finance.pharmacyInventory.map(item => {
                            const orderItem = order.items.find(oi => normalizeMedicationId(oi.medicationId) === item.medicationId);
                            return orderItem ? { ...item, stock: item.stock + orderItem.quantity, lastRestockDay: day } : item;
                        }),
                        pendingOrders: s.finance.pendingOrders.map(o => o.id === orderId ? { ...o, status: 'received', receivedDay: day } : o)
                    }
                };
            });
            soundManager.playSuccess();
            // Audit trail: log the receive event
            set(s => ({
                finance: {
                    ...s.finance,
                    procurementLog: [...(s.finance.procurementLog || []), {
                        type: 'order_received',
                        orderId,
                        supplierId: order.supplierId,
                        supplierName: getSupplierById(order.supplierId)?.name || order.supplierId,
                        itemCount: order.items.length,
                        cost: order.cost,
                        isExpress: Boolean(order.isExpress),
                        receiptMode: 'manual',
                        day,
                        timestamp: Date.now()
                    }]
                }
            }));
            return { success: true };
        },
        archiveDay: (_day) => {
            set(s => {
                const dailyOpCost = 50000 + (Object.values(s.finance.facilities).reduce((a, b) => a + b, 0) * 10000);
                return {
                    finance: {
                        ...s.finance,
                        stats: { ...s.finance.stats, pengeluaranOperasional: (s.finance.stats.pengeluaranOperasional || 0) + dailyOpCost }
                    }
                };
            });
        },
        // CROSS-SLICE: writes finance + clinical.monthlyArchive
        processMonthlyReport: (accreditation, hiredStaff) => {
            set(s => {
                const accreditationMultiplier = ACCREDITATION_MULTIPLIER[accreditation] || 1.0;
                const monthlyKapitasi = 50000000 * accreditationMultiplier;
                const totalSalaries = hiredStaff.reduce((total, staffMember) => total + (staffMember.salary || 0), 0);
                const monthlyReport = buildMonthlyArchiveEntry(s, accreditation, hiredStaff);
                const existingMonthReport = monthlyReport
                    ? (s.clinical.monthlyArchive || []).find((entry) => entry?.month === monthlyReport.month)
                    : null;
                const monthlyArchive = monthlyReport
                    ? [
                        ...(s.clinical.monthlyArchive || []).filter((entry) => entry?.month !== monthlyReport.month),
                        monthlyReport
                    ]
                    : s.clinical.monthlyArchive;

                if (existingMonthReport) {
                    return {
                        clinical: {
                            ...s.clinical,
                            monthlyArchive
                        }
                    };
                }

                return {
                    finance: {
                        ...s.finance,
                        stats: {
                            ...s.finance.stats,
                            kapitasi: s.finance.stats.kapitasi + monthlyKapitasi - totalSalaries,
                            pengeluaranObat: 0,
                            pengeluaranLab: 0,
                            pengeluaranOperasional: 0,
                            pendapatanUmum: 0
                        },
                        kpi: INITIAL_KPI
                    },
                    clinical: {
                        ...s.clinical,
                        monthlyArchive
                    }
                };
            });
            soundManager.playNotification();
        },
        resetFinance: () => set(s => ({
            finance: {
                ...s.finance,
                ...createInitialFinanceState()
            }
        })),
    },
});
