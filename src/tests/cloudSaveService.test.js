import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CURRENT_SAVE_VERSION } from '../utils/savePayload.js';

const supabaseMocks = vi.hoisted(() => ({
    gameSavesUpsert: vi.fn(async () => ({ error: null })),
    leaderboardUpsert: vi.fn(async () => ({ error: null })),
    getUser: vi.fn(async () => ({
        data: {
            user: {
                id: 'user-1',
                user_metadata: {
                    nama: 'Tester',
                    nim: '123456'
                }
            }
        }
    }))
}));

vi.mock('../services/supabaseClient.js', () => ({
    isSupabaseConfigured: true,
    supabase: {
        auth: {
            getUser: supabaseMocks.getUser
        },
        from: vi.fn((tableName) => {
            if (tableName === 'game_saves') {
                return { upsert: supabaseMocks.gameSavesUpsert };
            }

            if (tableName === 'leaderboard') {
                return { upsert: supabaseMocks.leaderboardUpsert };
            }

            throw new Error(`Unexpected table: ${tableName}`);
        })
    }
}));

import { CloudSaveService } from '../services/CloudSaveService.js';

describe('CloudSaveService', () => {
    beforeEach(() => {
        supabaseMocks.gameSavesUpsert.mockClear();
        supabaseMocks.leaderboardUpsert.mockClear();
        supabaseMocks.getUser.mockClear();
    });

    it('stores canonical save payloads and uses clinical accreditation for leaderboard sync', async () => {
        const result = await CloudSaveService.saveToCloud('slot-1', {
            world: { day: 8, time: 700 },
            player: {
                profile: {
                    reputation: 91,
                    level: 4,
                    knowledge: 33
                }
            },
            clinical: {
                accreditation: 'Utama',
                history: [{ id: 'case-1' }, { id: 'case-2' }]
            }
        });

        expect(result).toEqual({ success: true, error: null });
        expect(supabaseMocks.gameSavesUpsert).toHaveBeenCalledTimes(1);
        expect(supabaseMocks.leaderboardUpsert).toHaveBeenCalledTimes(1);

        const savePayload = supabaseMocks.gameSavesUpsert.mock.calls[0][0];
        const leaderboardPayload = supabaseMocks.leaderboardUpsert.mock.calls[0][0];

        expect(savePayload.version).toBe(CURRENT_SAVE_VERSION);
        expect(savePayload.game_state).toEqual(expect.objectContaining({
            saveVersion: CURRENT_SAVE_VERSION,
            world: expect.objectContaining({
                day: 8,
                time: 700
            }),
            clinical: expect.objectContaining({
                accreditation: 'Utama'
            })
        }));
        expect(leaderboardPayload).toEqual(expect.objectContaining({
            accreditation: 'Utama',
            patients_treated: 2
        }));
    });
});
