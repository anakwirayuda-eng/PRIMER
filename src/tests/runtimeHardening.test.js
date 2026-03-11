import { describe, expect, it } from 'vitest';
import { dispatchGuard } from '../utils/dispatchGuard.js';
import { CURRENT_SAVE_VERSION, parseSavePayload } from '../utils/savePayload.js';

describe('runtime hardening', () => {
    it('normalizes legacy saves into the canonical schema', () => {
        const parsed = parseSavePayload({
            profile: { name: 'Legacy Dokter' },
            reputation: 91,
            day: 7
        });

        expect(parsed).not.toBeNull();
        expect(parsed.saveVersion).toBe(CURRENT_SAVE_VERSION);
        expect(parsed.player.profile.name).toBe('Legacy Dokter');
        expect(parsed.player.profile.reputation).toBe(91);
        expect(parsed.world.day).toBe(7);
    });

    it('rejects malformed save payloads before they enter the store', () => {
        expect(parseSavePayload({ player: [] })).toBeNull();
    });

    it('arms the runtime trap when invariants fail after an action', () => {
        let state = {
            nav: { gameState: 'playing' },
            world: { time: 2000, day: 1, isPaused: false },
            clinical: { queue: [], activePatientId: null, history: [], gameOver: null },
            player: { profile: { energy: 50 } },
            finance: { stats: { kapitasi: 5000, pengeluaranObat: 0, pengeluaranLab: 0, pengeluaranOperasional: 0 } },
            meta: { runtimeTrap: null }
        };

        const wrapped = dispatchGuard('test.guardTrap', () => 'ok', {
            getState: () => state,
            setState: (updater) => {
                const patch = typeof updater === 'function' ? updater(state) : updater;
                state = { ...state, ...patch };
            },
            enableStability: false
        });

        const result = wrapped();

        expect(result).toBe('ok');
        expect(state.nav.gameState).toBe('paused');
        expect(state.world.isPaused).toBe(true);
        expect(state.clinical.gameOver.type).toBe('runtime_trap');
        expect(state.meta.runtimeTrap.active).toBe(true);
    });
});
