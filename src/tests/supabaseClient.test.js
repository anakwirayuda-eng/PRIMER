import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createClient = vi.fn(() => ({ auth: { getSession: vi.fn() } }));

vi.mock('@supabase/supabase-js', () => ({
    createClient
}));

describe('supabaseClient', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.stubEnv('VITE_SUPABASE_URL', 'https://primer-test.supabase.co');
        vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
        delete globalThis.__PRIMER_SUPABASE_CLIENT__;
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        delete globalThis.__PRIMER_SUPABASE_CLIENT__;
    });

    it('reuses a single Supabase client across repeated module evaluation', async () => {
        const firstModule = await import('../services/supabaseClient.js');

        vi.resetModules();

        const secondModule = await import('../services/supabaseClient.js');

        expect(firstModule.supabase).toBeTruthy();
        expect(secondModule.supabase).toBe(firstModule.supabase);
        expect(createClient).toHaveBeenCalledTimes(1);
    });
});
