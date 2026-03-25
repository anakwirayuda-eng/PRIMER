import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

import { getScenarioById } from '../content/scenarios/IKMScenarioLibrary.js';
import { calculateIKS } from '../game/GameCore.js';
import { advanceEventPhase, createEventInstance } from '../game/IKMEventEngine.js';
import { useGameStore } from '../store/useGameStore.js';

function makeFamily(id, indicators) {
    return {
        id,
        houseId: `house_${id}`,
        indicators: { ...indicators },
        iksScore: calculateIKS(indicators)
    };
}

describe('IKM public health actions', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
    });

    it('charges operational funds when a paid IKM choice is taken and blocks unaffordable choices', () => {
        const scenario = getScenarioById('air_minum_tercemar');
        const event = createEventInstance(scenario, 1);

        useGameStore.setState((state) => ({
            ...state,
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: 100000,
                    pendapatanUmum: 0
                }
            },
            publicHealth: {
                ...state.publicHealth,
                activeIKMEvents: [event]
            }
        }));

        const blocked = useGameStore.getState().publicHealthActions.advanceIKMPhase(
            event.instanceId,
            'distribute_treat',
            { energy: -20, balance: -300000 }
        );

        expect(blocked).toEqual(expect.objectContaining({ success: false }));
        expect(useGameStore.getState().publicHealth.activeIKMEvents[0].currentPhaseId).toBe('discovery');
        expect(useGameStore.getState().finance.stats.kapitasi).toBe(100000);

        useGameStore.setState((state) => ({
            ...state,
            finance: {
                ...state.finance,
                stats: {
                    ...state.finance.stats,
                    kapitasi: 50000000,
                    pendapatanUmum: 500000
                }
            }
        }));

        const charged = useGameStore.getState().publicHealthActions.advanceIKMPhase(
            event.instanceId,
            'distribute_treat',
            { energy: -20, balance: -300000 }
        );

        expect(charged).toEqual(expect.objectContaining({ success: true }));
        expect(useGameStore.getState().finance.stats.pendapatanUmum).toBe(200000);
        expect(useGameStore.getState().publicHealth.activeIKMEvents[0].currentPhaseId).toBe('distribute_treat');
        expect(useGameStore.getState().publicHealth.activeIKMEvents[0].impactAccumulated.balance).toBe(0);
    });

    it('applies village IKS improvement, outbreak protection, and writes an audit trail when an IKM event resolves successfully', () => {
        const scenario = getScenarioById('bab_sembarangan');
        const event = advanceEventPhase(createEventInstance(scenario, 1), 'resolution_success');

        useGameStore.setState((state) => ({
            ...state,
            world: { ...state.world, day: 1 },
            publicHealth: {
                ...state.publicHealth,
                villageData: {
                    families: [
                        makeFamily('kk_01', {
                            kb: true, persalinan: true, imunisasi: true, asi: true, balita: true,
                            tb: true, hipertensi: true, jiwa: true, rokok: false, jkn: true,
                            air: false, jamban: false, jentik: false
                        })
                    ],
                    stats: { avgIKS: 0.77 }
                },
                activeIKMEvents: [event]
            }
        }));

        useGameStore.getState().publicHealthActions.resolveIKMEvent(event.instanceId);

        const state = useGameStore.getState();
        const family = state.publicHealth.villageData.families[0];
        const historyEntry = state.clinical.history.at(-1);

        expect(state.publicHealth.activeIKMEvents).toHaveLength(0);
        expect(family.iksScore).toBeGreaterThan(0.77);
        expect(family.indicators.air || family.indicators.jamban).toBe(true);
        expect(state.publicHealth.outbreakRiskModifiers.protectedUntil.diare).toBeGreaterThanOrEqual(8);
        expect(historyEntry).toEqual(expect.objectContaining({
            type: 'ikm_event',
            outcomeStatus: 'ikm_success',
            name: scenario.title
        }));
        expect(historyEntry.description).toContain('IKS +5');
        expect(historyEntry.description).toContain('Risiko diare turun');
    });
});
