import { describe, expect, it } from 'vitest';
import { checkInvariants } from '../diagnostics/invariants.js';

function buildState({ energy, maxEnergy, pendapatanUmum = 1 }) {
    return {
        finance: { stats: { kapitasi: 1, pendapatanUmum, pengeluaranObat: 0, pengeluaranLab: 0, pengeluaranOperasional: 0 } },
        world: { time: 420 },
        player: { profile: { energy, maxEnergy } },
        clinical: { queue: [], history: [], activePatientId: null },
    };
}

describe('invariants', () => {
    it('accepts dynamic energy caps above 100 when energy stays within maxEnergy', () => {
        const failures = checkInvariants(buildState({ energy: 115, maxEnergy: 115 }));

        expect(failures.find((failure) => failure.id === 'PLAYER_ENERGY_RANGE')).toBeUndefined();
    });

    it('still rejects energy above the player maxEnergy cap', () => {
        const failures = checkInvariants(buildState({ energy: 116, maxEnergy: 115 }));

        expect(failures.find((failure) => failure.id === 'PLAYER_ENERGY_RANGE')).toEqual({
            id: 'PLAYER_ENERGY_RANGE',
            message: 'Energy must be between 0 and the player maxEnergy cap',
            severity: 'warning',
        });
    });

    it('rejects negative pendapatan umum balances', () => {
        const failures = checkInvariants(buildState({ energy: 50, maxEnergy: 100, pendapatanUmum: -1 }));

        expect(failures.find((failure) => failure.id === 'NON_NEGATIVE_MONEY')).toEqual({
            id: 'NON_NEGATIVE_MONEY',
            message: 'Operational fund buckets must not be negative',
            severity: 'alert',
        });
    });
});
