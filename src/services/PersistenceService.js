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

export const REQUIRED_MEDICAL_TABLES = [
    'icd10',
    'icd9',
    'medications',
    'anamnesisVariations'
];

export async function getPopulationCounts(database = db) {
    const counts = await Promise.all(
        REQUIRED_MEDICAL_TABLES.map(async (tableName) => [tableName, await database[tableName].count()])
    );
    return Object.fromEntries(counts);
}

export function hasCompleteMedicalDataset(counts) {
    return REQUIRED_MEDICAL_TABLES.every((tableName) => Number(counts?.[tableName]) > 0);
}

const DEFAULT_SYNC_LOADERS = {
    async icd10() {
        const icd10Module = await import('../data/master_icd_10.json');
        const icd10Data = icd10Module.default || icd10Module;
        return icd10Data.map(d => ({
            code: d.kode_icd,
            name: d.nama_icd,
            originalIndo: d.nama_icd_indo || '',
            category: d.kategori || 'general'
        }));
    },

    async icd9() {
        const icd9Module = await import('../data/master_icd_9.json');
        const icd9Data = icd9Module.default || icd9Module;
        return icd9Data.map(d => ({
            code: d.code,
            name: d.name
        }));
    },

    async medications() {
        const medModule = await import('../data/MedicationDatabase.js');
        return medModule.MEDICATION_DATABASE;
    },

    async anamnesisVariations() {
        const varModule = await import('../game/AnamnesisVariations.js');
        const varData = varModule.default || varModule.ANAMNESIS_VARIATIONS || {};
        return Object.entries(varData).map(([caseId, variations]) => ({
            caseId,
            variations
        }));
    }
};

export const PersistenceService = {
    /**
     * Check if the database is already populated
     */
    async isPopulated(database = db) {
        return hasCompleteMedicalDataset(await getPopulationCounts(database));
    },

    /**
     * Initial sync: Hydrate IndexedDB from static JSON files
     * This should only run ONCE during the first boot or after an update.
     */
    async syncData(onProgress, database = db, loaders = DEFAULT_SYNC_LOADERS) {
        if (syncInProgress) {
            console.debug('PersistenceService: Sync already in progress, waiting...');
            return syncInProgress;
        }

        syncInProgress = (async () => {
            try {
                if (onProgress) onProgress('Loading ICD-10...', 10);
                const icd10Mapped = await loaders.icd10();

                if (onProgress) onProgress('Loading ICD-9...', 25);
                const icd9Mapped = await loaders.icd9();

                if (onProgress) onProgress('Loading Medications...', 40);
                const medicationData = await loaders.medications();

                if (onProgress) onProgress('Loading Anamnesis Variations...', 55);
                const variationsArray = await loaders.anamnesisVariations();

                if (onProgress) onProgress('Writing medical database...', 75);
                const tables = REQUIRED_MEDICAL_TABLES.map((tableName) => database[tableName]);
                await database.transaction('rw', ...tables, async () => {
                    await database.icd10.clear();
                    await database.icd9.clear();
                    await database.medications.clear();
                    await database.anamnesisVariations.clear();

                    await database.icd10.bulkPut(icd10Mapped);
                    await database.icd9.bulkPut(icd9Mapped);
                    await database.medications.bulkPut(medicationData);
                    await database.anamnesisVariations.bulkPut(variationsArray);
                });

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
