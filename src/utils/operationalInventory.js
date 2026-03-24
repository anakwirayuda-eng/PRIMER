import { getMedicationById } from '../data/MedicationDatabase.js';

export function getOperationalStockItems(pharmacyInventory = []) {
    if (!Array.isArray(pharmacyInventory)) return [];

    return pharmacyInventory.filter((item) => {
        const medication = getMedicationById(item?.medicationId);
        return medication && medication.form !== 'action' && medication.form !== 'equipment';
    });
}

export function summarizeOperationalInventory(pharmacyInventory = []) {
    const stockItems = getOperationalStockItems(pharmacyInventory);
    const lowStock = stockItems.filter((item) => {
        const medication = getMedicationById(item.medicationId);
        return medication && item.stock < medication.minStock && item.stock > 0;
    }).length;
    const outOfStock = stockItems.filter((item) => item.stock === 0).length;

    return {
        stockItems,
        totalItems: stockItems.length,
        lowStock,
        outOfStock
    };
}
