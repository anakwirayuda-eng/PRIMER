/**
 * @reflection
 * [IDENTITY]: PersistenceService
 * [PURPOSE]: Service layer module providing: db, PersistenceService.
 * [STATE]: Experimental
 * [ANCHOR]: PersistenceService
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import Dexie from 'dexie';

/**
 * PersistenceService — Offloads massive medical datasets to IndexedDB
 * to prevent blocking the main JS thread and reduce initial bundle size.
 */
export const db = new Dexie('PrimerMedicalDB');

db.version(1).stores({
    icd10: 'code, name, category',
    icd9: 'code, name',
    medications: 'id, name, category',
    anamnesisVariations: 'caseId'
});

// v2: Added originalIndo hidden field for search without displaying bad translations
db.version(2).stores({
    icd10: 'code, name, category, originalIndo',
    icd9: 'code, name',
    medications: 'id, name, category',
    anamnesisVariations: 'caseId'
});

let syncInProgress = null;

export const PersistenceService = {
    /**
     * Check if the database is already populated
     */
    async isPopulated() {
        const count = await db.icd10.count();
        return count > 0;
    },

    /**
     * Initial sync: Hydrate IndexedDB from static JSON files
     * This should only run ONCE during the first boot or after an update.
     */
    async syncData(onProgress) {
        if (syncInProgress) {
            console.debug('PersistenceService: Sync already in progress, waiting...');
            return syncInProgress;
        }

        syncInProgress = (async () => {
            try {
                if (onProgress) onProgress('Loading ICD-10...', 10);
                const icd10Module = await import('../data/master_icd_10.json');
                const icd10Data = icd10Module.default || icd10Module;

                // Map JSON to internal schema
                const icd10Mapped = icd10Data.map(d => ({
                    code: d.kode_icd,
                    name: d.nama_icd,
                    originalIndo: d.nama_icd_indo || '',
                    category: d.kategori || 'general'
                }));

                if (onProgress) onProgress('Storing ICD-10...', 30);
                await db.icd10.bulkPut(icd10Mapped);

                if (onProgress) onProgress('Loading ICD-9...', 40);
                const icd9Module = await import('../data/master_icd_9.json');
                const icd9Data = icd9Module.default || icd9Module;
                const icd9Mapped = icd9Data.map(d => ({
                    code: d.code,
                    name: d.name
                }));
                await db.icd9.bulkPut(icd9Mapped);

                if (onProgress) onProgress('Loading Medications...', 60);
                const medModule = await import('../data/MedicationDatabase.js');
                const medData = medModule.MEDICATION_DATABASE;
                await db.medications.bulkPut(medData);

                if (onProgress) onProgress('Loading Anamnesis Variations...', 80);
                const varModule = await import('../game/AnamnesisVariations.js');
                const varData = varModule.default || varModule.ANAMNESIS_VARIATIONS || {};
                const variationsArray = Object.entries(varData).map(([caseId, variations]) => ({
                    caseId,
                    variations
                }));
                await db.anamnesisVariations.bulkPut(variationsArray);

                if (onProgress) onProgress('Finalizing...', 100);
                return true;
            } catch (error) {
                console.error('PersistenceService Sync Failed:', error.name, error.message, error);
                throw error;
            } finally {
                syncInProgress = null;
            }
        })();

        return syncInProgress;
    },

    /**
     * Optimized Search Methods
     */
    async searchICD10(query, limit = 15) {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        return await db.icd10
            .filter(item =>
                item.code.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                (item.originalIndo && item.originalIndo.toLowerCase().includes(q))
            )
            .limit(limit)
            .toArray();
    },

    async getMedication(id) {
        return await db.medications.get(id);
    },

    async getAnamnesisVariations(caseId) {
        const record = await db.anamnesisVariations.get(caseId);
        return record ? record.variations : null;
    }
};
