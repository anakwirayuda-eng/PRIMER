import { describe, expect, it } from 'vitest';

import { getSceneForBuilding, isGameEnabledBuilding } from '../components/wilayah/buildingScenes.js';

describe('building scene activation', () => {
    it('enables additional topology buildings through aliases and bespoke scenes', () => {
        expect(isGameEnabledBuilding('dashat')).toBe(true);
        expect(isGameEnabledBuilding('apotek')).toBe(true);
        expect(isGameEnabledBuilding('lapangan')).toBe(true);
        expect(isGameEnabledBuilding('alun_alun')).toBe(true);
        expect(isGameEnabledBuilding('padepokan_dukun')).toBe(true);
        expect(isGameEnabledBuilding('pasar_hewan')).toBe(true);
        expect(isGameEnabledBuilding('pesantren')).toBe(true);
        expect(isGameEnabledBuilding('pos_ronda')).toBe(true);
        expect(isGameEnabledBuilding('rtk')).toBe(true);
        expect(isGameEnabledBuilding('well')).toBe(true);
    });

    it('keeps legacy aliases while promoting RTK and Padepokan to unique scenes', () => {
        expect(getSceneForBuilding('dashat')?.title).toBe('Pos Pemulihan Gizi Dusun Sukamaju');
        expect(getSceneForBuilding('apotek')?.title).toBe('Pustu Dusun Cilengkrang');
        expect(getSceneForBuilding('lapangan')?.title).toBe('Balai Desa Sukamaju');
        expect(getSceneForBuilding('alun_alun')?.title).toBe('Balai Desa Sukamaju');
        expect(getSceneForBuilding('pasar_hewan')?.title).toBe('Pasar Desa Sukamaju');
        expect(getSceneForBuilding('pesantren')?.title).toBe('SD Negeri 1 Sukamaju');
        expect(getSceneForBuilding('pos_ronda')?.title).toBe('Warung Bu Minah');
        expect(getSceneForBuilding('well')?.title).toBe('Instalasi PAMSIMAS Desa Sukamaju');

        const rtkScene = getSceneForBuilding('rtk');
        expect(rtkScene?.title).toBe('RTK (Rumah Tunggu Kelahiran)');
        expect(rtkScene?.subtitle).toContain('Maternal Referral Hub');
        expect(rtkScene?.linkedScenarios).toContain('dukun_beranak');

        const dukunScene = getSceneForBuilding('padepokan_dukun');
        expect(dukunScene?.title).toBe('Padepokan Dukun Mbah Surti');
        expect(dukunScene?.subtitle).toContain('tradisi vs evidence');
        expect(dukunScene?.linkedScenarios).toContain('jamu_berbahaya');
    });
});
