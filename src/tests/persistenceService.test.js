import { describe, expect, it, vi } from 'vitest';
import { PersistenceService, REQUIRED_MEDICAL_TABLES, mapICD10Records } from '../services/PersistenceService.js';

const createFakeDatabase = (counts = {}) => {
    const tables = Object.fromEntries(
        REQUIRED_MEDICAL_TABLES.map((tableName) => [
            tableName,
            {
                count: vi.fn(async () => counts[tableName] ?? 0),
                clear: vi.fn(async () => {}),
                bulkPut: vi.fn(async () => {})
            }
        ])
    );

    return {
        ...tables,
        transaction: vi.fn(async (_mode, ...args) => {
            const callback = args.at(-1);
            await callback();
        })
    };
};

describe('PersistenceService', () => {
    it('maps raw ICD-10 records through the runtime Indonesian normalization layer', () => {
        const mapped = mapICD10Records([
            {
                kode_icd: 'C38.0',
                nama_icd: 'Malignant neoplasm of heart',
                nama_icd_indo: 'Neoplasma ganas hati'
            },
            {
                kode_icd: 'R09.2',
                nama_icd: 'Respiratory arrest',
                nama_icd_indo: 'pernapasan lambat'
            },
            {
                kode_icd: 'K38.0',
                nama_icd: 'Hyperplasia of appendix',
                nama_icd_indo: 'Hiperplasia lampiran'
            }
        ]);

        expect(mapped).toEqual([
            {
                code: 'C38.0',
                name: 'Malignant neoplasm of heart',
                originalIndo: 'Neoplasma ganas jantung',
                category: 'general'
            },
            {
                code: 'R09.2',
                name: 'Respiratory arrest',
                originalIndo: 'Henti napas',
                category: 'general'
            },
            {
                code: 'K38.0',
                name: 'Hyperplasia of appendix',
                originalIndo: 'Hiperplasia apendiks',
                category: 'general'
            }
        ]);
    });

    it('treats the database as populated only when every required table has rows', async () => {
        const incompleteDb = createFakeDatabase({
            icd10: 10,
            icd9: 8,
            medications: 20,
            anamnesisVariations: 0
        });
        const completeDb = createFakeDatabase({
            icd10: 10,
            icd9: 8,
            medications: 20,
            anamnesisVariations: 4
        });

        await expect(PersistenceService.isPopulated(incompleteDb)).resolves.toBe(false);
        await expect(PersistenceService.isPopulated(completeDb)).resolves.toBe(true);
    });

    it('rewrites every medical table inside one sync transaction', async () => {
        const database = createFakeDatabase();
        const loaders = {
            icd10: vi.fn(async () => [{ code: 'A00', name: 'Kolera' }]),
            icd9: vi.fn(async () => [{ code: '99.1', name: 'Contoh ICD-9' }]),
            medications: vi.fn(async () => [{ id: 'paracetamol', name: 'Paracetamol' }]),
            anamnesisVariations: vi.fn(async () => [{ caseId: 'flu', variations: ['demam'] }])
        };

        await expect(PersistenceService.syncData(undefined, database, loaders)).resolves.toBe(true);

        expect(database.transaction).toHaveBeenCalledTimes(1);
        expect(database.transaction.mock.calls[0][0]).toBe('rw');
        expect(database.icd10.clear).toHaveBeenCalledTimes(1);
        expect(database.icd9.clear).toHaveBeenCalledTimes(1);
        expect(database.medications.clear).toHaveBeenCalledTimes(1);
        expect(database.anamnesisVariations.clear).toHaveBeenCalledTimes(1);
        expect(database.icd10.bulkPut).toHaveBeenCalledWith([{ code: 'A00', name: 'Kolera' }]);
        expect(database.icd9.bulkPut).toHaveBeenCalledWith([{ code: '99.1', name: 'Contoh ICD-9' }]);
        expect(database.medications.bulkPut).toHaveBeenCalledWith([{ id: 'paracetamol', name: 'Paracetamol' }]);
        expect(database.anamnesisVariations.bulkPut).toHaveBeenCalledWith([{ caseId: 'flu', variations: ['demam'] }]);
    });
});
