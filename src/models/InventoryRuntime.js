/**
 * @reflection
 * [IDENTITY]: InventoryRuntime (Anti-Corruption Layer)
 * [PURPOSE]: Normalizes pharmacy inventory SKUs and metadata into one canonical shape.
 * [STATE]: Production
 * [ANCHOR]: normalizeInventoryItem
 * [DEPENDS_ON]: MedicationDatabase
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-25
 */

import { getMedicationById } from '../data/MedicationDatabase.js';

export const INVENTORY_ACL_VERSION = 1;

const INVENTORY_ID_ALIASES = {
    folley_catheter: 'kateter_foley',
    foley_catheter: 'kateter_foley',
    splint_set: 'bidai_set',
    mgso4_inj: 'magnesium_sulfate_iv'
};

export function normalizeMedicationId(id) {
    if (typeof id !== 'string') return '';
    return INVENTORY_ID_ALIASES[id] || id;
}

export function normalizeInventoryItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw._isInventoryCanonical && raw._inventoryAclVersion === INVENTORY_ACL_VERSION) {
        return raw;
    }

    const incomingId = raw.medicationId || raw.id || '';
    const medicationId = normalizeMedicationId(incomingId);
    const medication = getMedicationById(medicationId) || getMedicationById(incomingId);
    const stockValue = Number(raw.stock ?? raw.quantity ?? 0);
    const lastRestockValue = Number(raw.lastRestockDay ?? raw.lastUpdatedDay ?? 0);

    return {
        ...raw,
        medicationId,
        stock: Number.isFinite(stockValue) ? stockValue : 0,
        lastRestockDay: Number.isFinite(lastRestockValue) ? lastRestockValue : 0,
        form: medication?.form || raw.form || 'consumable',
        category: medication?.category || raw.category || 'Lainnya',
        originalMedicationId: incomingId && incomingId !== medicationId ? incomingId : undefined,
        _isInventoryCanonical: true,
        _inventoryAclVersion: INVENTORY_ACL_VERSION
    };
}

export function normalizeInventoryList(rawList = []) {
    if (!Array.isArray(rawList)) return [];

    const merged = new Map();

    rawList
        .map(normalizeInventoryItem)
        .filter(Boolean)
        .forEach((item) => {
            const existing = merged.get(item.medicationId);
            if (!existing) {
                merged.set(item.medicationId, item);
                return;
            }

            merged.set(item.medicationId, {
                ...existing,
                stock: (existing.stock || 0) + (item.stock || 0),
                lastRestockDay: Math.max(existing.lastRestockDay || 0, item.lastRestockDay || 0),
                originalMedicationId: existing.originalMedicationId || item.originalMedicationId
            });
        });

    return Array.from(merged.values());
}
