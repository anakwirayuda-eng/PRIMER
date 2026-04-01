import { describe, it, expect } from 'vitest';
import { generatePatient } from '../game/PatientGenerator.js';

describe('Bridge Seasonal -> Patient Severity Integration', () => {
    // Scaffold basic data to force resident generation
    const familyId = 'test_family_1';
    const mockVillager = {
        id: 'v1',
        familyId,
        gender: 'L',
        age: 30,
        fullName: 'Test Resident',
        status: 'alive'
    };
    
    const mockPopulation = {
        villagers: [mockVillager],
        families: [{ id: familyId }]
    };



    it('putus + east family: should boost risk (low -> medium or medium -> high)', () => {
        // An east family has x >= 120
        const coordsEast = { x: 125, y: 50 };
        const bridgePutus = { status: 'putus', severityBoost: 1 };
        
        // Let's run generating an empty context patient (no bridge) to get baseline risk
        const basePatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'stable-seed-1', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: { status: 'normal', severityBoost: 0 }
        });
        
        const boostedPatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'stable-seed-1', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: bridgePutus
        });
        
        // If baseline was not emergency or high, it should have incremented
        if (basePatient.hidden.risk === 'low') {
            expect(boostedPatient.hidden.risk).toBe('medium');
        } else if (basePatient.hidden.risk === 'medium') {
            expect(boostedPatient.hidden.risk).toBe('high');
        } else if (basePatient.hidden.risk === 'high') {
            expect(boostedPatient.hidden.risk).toBe('high');
        }
    });

    it('putus + east family: high stays high', () => {
        // Same as above but using a severityBoost of 3 to force it to cap at 'high'
        const coordsEast = { x: 130, y: 50 };
        const bridgePutusExtreme = { status: 'putus', severityBoost: 5 };
        
        const patient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'some-seed-2', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: bridgePutusExtreme
        });
        
        // Even with +5 boost, it shouldn't go past 'high' to 'emergency'
        expect(['medium', 'high']).toContain(patient.hidden.risk);
        expect(patient.hidden.risk).not.toBe('emergency');
    });

    it('putus + west family: no change', () => {
        const coordsWest = { x: 100, y: 50 }; // x < 120
        const bridgePutus = { status: 'putus', severityBoost: 1 };
        
        const basePatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-west', {
            familyCoords: { [familyId]: coordsWest },
            bridgeState: { status: 'normal', severityBoost: 0 }
        });
        
        const testPatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-west', {
            familyCoords: { [familyId]: coordsWest },
            bridgeState: bridgePutus
        });
        
        expect(testPatient.hidden.risk).toBe(basePatient.hidden.risk);
    });

    it('rawan_banjir + east family: no change', () => {
        const coordsEast = { x: 130, y: 50 };
        const bridgeBanjir = { status: 'rawan_banjir', severityBoost: 1 };
        
        const basePatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-banjir', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: { status: 'normal', severityBoost: 0 }
        });
        
        const testPatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-banjir', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: bridgeBanjir
        });
        
        expect(testPatient.hidden.risk).toBe(basePatient.hidden.risk);
    });

    it('null bridgeState: no change', () => {
        const coordsEast = { x: 130, y: 50 };
        
        const basePatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-null', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: null
        });
        
        const testPatient = generatePatient(480, mockPopulation, 1, { poli_umum: 1 }, [], 'seed-null', {
            familyCoords: { [familyId]: coordsEast }
            // bridgeState explicitly omitted
        });
        
        expect(testPatient.hidden.risk).toBe(basePatient.hidden.risk);
    });

    it('non-resident patient: no change', () => {
        const coordsEast = { x: 130, y: 50 };
        const bridgePutus = { status: 'putus', severityBoost: 1 };
        
        // Pass empty population to force non-resident
        const basePatient = generatePatient(480, { villagers: [], families: [] }, 1, { poli_umum: 1 }, [], 'seed-nonres', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: { status: 'normal', severityBoost: 0 }
        });
        
        const testPatient = generatePatient(480, { villagers: [], families: [] }, 1, { poli_umum: 1 }, [], 'seed-nonres', {
            familyCoords: { [familyId]: coordsEast },
            bridgeState: bridgePutus
        });
        
        expect(basePatient.hidden.isResident).toBe(false);
        expect(testPatient.hidden.isResident).toBe(false);
        expect(testPatient.hidden.risk).toBe(basePatient.hidden.risk);
    });
});
