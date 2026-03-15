import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: vi.fn(),
        playConfirm: vi.fn(),
        playCancel: vi.fn(),
    }
}));

vi.mock('../utils/browserSafety.js', async () => {
    const actual = await vi.importActual('../utils/browserSafety.js');
    return {
        ...actual,
        safeSetStorageItem: vi.fn(() => true)
    };
});

import { useGameStore } from '../store/useGameStore.js';
import { selectPlayerStats } from '../store/selectors.js';
import { safeSetStorageItem } from '../utils/browserSafety.js';
import { parseSavePayload } from '../utils/savePayload.js';
import { MEDICATION_DATABASE } from '../data/MedicationDatabase.js';
import { calculateGlobalBuffs } from '../game/GameCore.js';

describe('store prophylaxis', () => {
    beforeEach(() => {
        const initialState = useGameStore.getInitialState();
        useGameStore.setState(initialState, true);
        safeSetStorageItem.mockReset();
        safeSetStorageItem.mockReturnValue(true);
        vi.useRealTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('caps clinical history at 200 newest entries when patients are discharged', () => {
        useGameStore.setState(state => ({
            clinical: {
                ...state.clinical,
                history: Array.from({ length: 200 }, (_, index) => ({
                    id: `hist-${index}`,
                    day: 1
                }))
            }
        }));

        const patient = {
            id: 'p-new',
            name: 'Test Patient',
            social: { hasBPJS: true },
            hidden: { requiredAction: 'treat' },
            medicalData: {
                correctTreatment: ['paracetamol'],
                trueDiagnosisCode: 'J00'
            }
        };

        const decision = {
            action: 'treat',
            medications: ['paracetamol'],
            diagnoses: ['J00'],
            anamnesisScore: 80,
            education: ['rest']
        };

        act(() => {
            useGameStore.getState().clinicalActions.dischargePatient(patient, decision, 1, 600);
        });

        const history = useGameStore.getState().clinical.history;
        expect(history).toHaveLength(200);
        expect(history[0].id).toBe('hist-1');
        expect(history.at(-1).id).toBe('p-new');
    });

    it('restores seeded pharmacy inventory when the game is fully reset', () => {
        useGameStore.setState(state => ({
            finance: {
                ...state.finance,
                pharmacyInventory: []
            }
        }));

        act(() => {
            useGameStore.getState().actions.resetGame();
        });

        const inventory = useGameStore.getState().finance.pharmacyInventory;
        expect(inventory).toHaveLength(MEDICATION_DATABASE.length);
        expect(inventory[0]).toMatchObject({
            medicationId: MEDICATION_DATABASE[0].id,
            stock: Math.floor(MEDICATION_DATABASE[0].minStock * 1.5),
            lastRestockDay: 0
        });
    });

    it('clears slot-specific navigation state on full reset while preserving preferences', () => {
        useGameStore.setState(state => ({
            nav: {
                ...state.nav,
                activePage: 'inventory',
                viewParams: { panel: 'warehouse' },
                currentSlotId: 3,
                showKPIGlobal: true,
                gameState: 'playing',
                sidebarCollapsed: true,
                settings: { ...state.nav.settings, volume: 0.35 }
            },
            meta: {
                ...state.meta,
                isWikiOpen: true,
                wikiMetric: 'inventory'
            }
        }));

        act(() => {
            useGameStore.getState().actions.resetGame();
        });

        const { nav, meta } = useGameStore.getState();
        expect(nav.activePage).toBe('dashboard');
        expect(nav.viewParams).toEqual({});
        expect(nav.currentSlotId).toBeNull();
        expect(nav.showKPIGlobal).toBe(false);
        expect(nav.gameState).toBe('opening');
        expect(nav.sidebarCollapsed).toBe(true);
        expect(nav.settings.volume).toBe(0.35);
        expect(meta.isWikiOpen).toBe(false);
        expect(meta.wikiMetric).toBeNull();
    });

    it('applies player setup initial stats when starting a new game', () => {
        act(() => {
            useGameStore.getState().actions.startNewGame({
                name: 'Senior Doc',
                avatar: 'default',
                initialStats: {
                    maxEnergy: 77,
                    baseReputation: 91
                }
            }, 1);
        });

        const state = useGameStore.getState();
        expect(state.player.profile.name).toBe('Senior Doc');
        expect(state.player.profile.maxEnergy).toBe(77);
        expect(state.player.profile.energy).toBe(77);
        expect(state.player.profile.reputation).toBe(91);
        expect(state.nav.currentSlotId).toBe(1);
        expect(state.nav.activePage).toBe('dashboard');
        expect(state.nav.gameState).toBe('playing');
    });

    it('resets navigation and volatile meta state before loading another slot', () => {
        useGameStore.setState(state => ({
            nav: {
                ...state.nav,
                activePage: 'inventory',
                viewParams: { panel: 'warehouse' },
                showKPIGlobal: true,
                sidebarCollapsed: true,
                settings: { ...state.nav.settings, volume: 0.4 }
            },
            meta: {
                ...state.meta,
                activeQuests: [{ id: 'quest-old' }],
                activeStories: [{ instanceId: 'story-old' }],
                isWikiOpen: true,
                wikiMetric: 'inventory'
            }
        }));

        let didLoad = false;
        act(() => {
            didLoad = useGameStore.getState().actions.loadGame({
                player: {
                    profile: {
                        name: 'Loaded Doc'
                    }
                },
                world: {
                    day: 4,
                    time: 600
                }
            }, 2);
        });

        const state = useGameStore.getState();
        expect(didLoad).toBe(true);
        expect(state.player.profile.name).toBe('Loaded Doc');
        expect(state.world.day).toBe(4);
        expect(state.nav.currentSlotId).toBe(2);
        expect(state.nav.activePage).toBe('dashboard');
        expect(state.nav.viewParams).toEqual({});
        expect(state.nav.showKPIGlobal).toBe(false);
        expect(state.nav.sidebarCollapsed).toBe(true);
        expect(state.nav.settings.volume).toBe(0.4);
        expect(state.meta.activeQuests).toEqual([]);
        expect(state.meta.activeStories).toEqual([]);
        expect(state.meta.isWikiOpen).toBe(false);
        expect(state.meta.wikiMetric).toBeNull();
    });

    it('caps full sleep recovery at the configured max energy', () => {
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 20,
                    maxEnergy: 77
                }
            }
        }));

        act(() => {
            useGameStore.getState().playerActions.calculateSleepRecovery(8, 23 * 60);
        });

        expect(useGameStore.getState().player.profile.energy).toBe(77);
    });

    it('routes overnight lounge rest through the full next-day transition', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

        useGameStore.setState(state => ({
            nav: { ...state.nav, currentSlotId: 0, gameState: 'playing' },
            world: { ...state.world, day: 3, time: 1435, isPaused: false },
            clinical: {
                ...state.clinical,
                queue: [{ id: 'queue-1' }],
                todayLog: [{ id: 'log-1' }],
                showMorningBriefing: false,
                activePatientId: 'queue-1'
            },
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    energy: 40,
                    stress: 30,
                    loungeRestCount: 0,
                    lastLoungeDay: 2
                }
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().playerActions.takeLoungeRest();
        });

        const state = useGameStore.getState();
        expect(result.success).toBe(true);
        expect(state.world.day).toBe(4);
        expect(state.world.time).toBe(480);
        expect(state.clinical.queue).toEqual([]);
        expect(state.clinical.todayLog).toEqual([]);
        expect(state.clinical.showMorningBriefing).toBe(true);
        expect(state.player.profile.energy).toBe(55);
        expect(state.player.profile.lastLoungeDay).toBe(3);

        act(() => {
            vi.runAllTimers();
        });
    });

    it('initializes knowledge and preserves residual XP after level up', () => {
        act(() => {
            useGameStore.getState().playerActions.gainXp(1100);
        });

        expect(useGameStore.getState().player.profile).toMatchObject({
            level: 2,
            xp: 100,
            knowledge: 1,
            maxEnergy: 105,
            energy: 105
        });
    });

    it('freezes the game before day rollover when preflight autosave fails', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:10Z'));
        safeSetStorageItem.mockReturnValueOnce(false);

        useGameStore.setState(state => ({
            nav: { ...state.nav, currentSlotId: 0, gameState: 'playing' },
            world: { ...state.world, day: 5, time: 1439, isPaused: false },
            meta: { ...state.meta, runtimeTrap: null },
            clinical: { ...state.clinical, gameOver: null }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().actions.nextDay(5);
        });

        const state = useGameStore.getState();
        expect(result).toBe(false);
        expect(state.world.day).toBe(5);
        expect(state.nav.gameState).toBe('paused');
        expect(state.world.isPaused).toBe(true);
        expect(state.clinical.gameOver?.type).toBe('runtime_trap');
        expect(state.meta.runtimeTrap?.phase).toBe('autosave_preflight');
    });

    it('freezes the game if the post-rollover autosave fails', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:20Z'));
        safeSetStorageItem.mockReturnValueOnce(true).mockReturnValueOnce(false);

        useGameStore.setState(state => ({
            nav: { ...state.nav, currentSlotId: 0, gameState: 'playing' },
            world: { ...state.world, day: 2, time: 1439, isPaused: false },
            meta: { ...state.meta, runtimeTrap: null },
            clinical: { ...state.clinical, gameOver: null }
        }));

        act(() => {
            useGameStore.getState().actions.nextDay(2);
        });

        expect(useGameStore.getState().world.day).toBe(3);
        expect(useGameStore.getState().meta.runtimeTrap).toBeNull();

        act(() => {
            vi.runAllTimers();
        });

        const state = useGameStore.getState();
        expect(state.nav.gameState).toBe('paused');
        expect(state.world.isPaused).toBe(true);
        expect(state.clinical.gameOver?.type).toBe('runtime_trap');
        expect(state.meta.runtimeTrap?.phase).toBe('autosave_postshift');
    });

    it('derives current-level XP progress and total XP from residual store state', () => {
        const selected = selectPlayerStats({
            player: {
                profile: {
                    level: 2,
                    xp: 100,
                    energy: 80
                }
            }
        });

        expect(selected.totalXp).toBe(1100);
        expect(selected.nextLevelXp).toBe(1000);
        expect(selected.xp).toBe(100);
    });

    it('backfills legacy total-XP saves without breaking level progress', () => {
        const selected = selectPlayerStats({
            player: {
                profile: {
                    level: 3,
                    xp: 2300,
                    energy: 80
                }
            }
        });

        expect(selected.totalXp).toBe(2300);
        expect(selected.nextLevelXp).toBe(1000);
        expect(selected.xp).toBe(300);
    });

    it('treats exact legacy level-boundary XP saves as zero progress toward the next level', () => {
        const selected = selectPlayerStats({
            player: {
                profile: {
                    level: 2,
                    xp: 1000,
                    energy: 80
                }
            }
        });

        expect(selected.totalXp).toBe(1000);
        expect(selected.nextLevelXp).toBe(1000);
        expect(selected.xp).toBe(0);
    });

    it('derives buffs from legacy object-shaped skills without crashing', () => {
        const buffs = calculateGlobalBuffs({
            player: {
                profile: {
                    skills: {
                        diagnosis_1: true,
                        stress_mgmt: true
                    }
                }
            },
            finance: {
                facilities: {
                    poli_umum: 1,
                    lab: 0
                }
            },
            staff: {
                hiredStaff: []
            }
        });

        expect(buffs.accuracyBonus).toBe(5);
        expect(buffs.stressReduction).toBe(2);
    });

    it('normalizes legacy persisted saves through persist.merge', () => {
        const merge = useGameStore.persist.getOptions().merge;
        const mergedState = merge({
            world: {
                day: 12,
                time: 615,
                isPaused: false,
                speed: 1
            },
            player: {
                profile: {
                    name: 'Legacy Doctor',
                    level: 2,
                    xp: 1000,
                    knowledge: 0,
                    energy: 88,
                    maxEnergy: 100,
                    reputation: 83,
                    stress: 11,
                    skills: {
                        diagnosis_1: true,
                        stress_mgmt: true,
                        stamina_1: false
                    }
                }
            },
            clinical: {
                queue: [{ id: 'legacy-q-1' }],
                emergencyQueue: [{ id: 'legacy-e-1' }],
                activePatientId: 'legacy-q-1',
                activeEmergencyId: 'legacy-e-1'
            }
        }, useGameStore.getInitialState());

        const player = selectPlayerStats(mergedState);
        const buffs = calculateGlobalBuffs(mergedState);

        expect(mergedState.player.profile.skills).toEqual(['diagnosis_1', 'stress_mgmt']);
        expect(mergedState.player.profile.xp).toBe(0);
        expect(mergedState.clinical.queue).toEqual([]);
        expect(mergedState.clinical.emergencyQueue).toEqual([]);
        expect(player.totalXp).toBe(1000);
        expect(player.xp).toBe(0);
        expect(buffs.accuracyBonus).toBe(5);
        expect(buffs.stressReduction).toBe(2);
    });

    it('sanitizes persisted snapshots through persist.partialize', () => {
        const partialize = useGameStore.persist.getOptions().partialize;
        const snapshot = partialize({
            ...useGameStore.getInitialState(),
            player: {
                profile: {
                    ...useGameStore.getInitialState().player.profile,
                    name: 'Snapshot Doctor',
                    level: 3,
                    xp: 2300,
                    knowledge: 2,
                    energy: 999,
                    maxEnergy: 110,
                    reputation: 101,
                    stress: -4,
                    skills: {
                        diagnosis_1: true,
                        stress_mgmt: true,
                        stamina_1: false
                    }
                }
            },
            clinical: {
                ...useGameStore.getInitialState().clinical,
                queue: [{ id: 'volatile-q-1' }],
                emergencyQueue: [{ id: 'volatile-e-1' }],
                activePatientId: 'volatile-q-1',
                activeEmergencyId: 'volatile-e-1'
            }
        });

        expect(snapshot.player.profile).toMatchObject({
            name: 'Snapshot Doctor',
            level: 3,
            xp: 300,
            knowledge: 2,
            energy: 110,
            maxEnergy: 110,
            reputation: 100,
            stress: 0,
            skills: ['diagnosis_1', 'stress_mgmt']
        });
        expect(snapshot.clinical.queue).toEqual([]);
        expect(snapshot.clinical.emergencyQueue).toEqual([]);
        expect(snapshot.clinical.activePatientId).toBeNull();
        expect(snapshot.clinical.activeEmergencyId).toBeNull();
    });

    it('round-trips legacy data safely through persist.partialize and persist.merge', () => {
        const { partialize, merge } = useGameStore.persist.getOptions();
        const initialState = useGameStore.getInitialState();

        const snapshot = partialize({
            ...initialState,
            world: {
                ...initialState.world,
                day: 17,
                time: 735,
                isPaused: true,
                speed: 0
            },
            player: {
                profile: {
                    ...initialState.player.profile,
                    name: 'Roundtrip Doctor',
                    level: 2,
                    xp: 1000,
                    knowledge: 1,
                    energy: 999,
                    maxEnergy: 105,
                    reputation: 120,
                    stress: -3,
                    skills: {
                        diagnosis_1: true,
                        stress_mgmt: true
                    }
                }
            },
            finance: {
                ...initialState.finance,
                stats: {
                    ...initialState.finance.stats,
                    pendapatanUmum: 321000
                }
            },
            publicHealth: {
                ...initialState.publicHealth,
                prolanisState: {
                    lastSenamMonth: 1,
                    lastSenamDay: 31
                }
            },
            clinical: {
                ...initialState.clinical,
                queue: [{ id: 'volatile-q-1' }],
                emergencyQueue: [{ id: 'volatile-e-1' }]
            }
        });

        const hydrated = merge(snapshot, initialState);
        const player = selectPlayerStats(hydrated);
        const buffs = calculateGlobalBuffs(hydrated);

        expect(hydrated.world).toMatchObject({
            day: 17,
            time: 735,
            isPaused: true,
            speed: 0
        });
        expect(hydrated.player.profile).toMatchObject({
            name: 'Roundtrip Doctor',
            level: 2,
            xp: 0,
            knowledge: 1,
            energy: 105,
            maxEnergy: 105,
            reputation: 100,
            stress: 0,
            skills: ['diagnosis_1', 'stress_mgmt']
        });
        expect(hydrated.finance.stats.pendapatanUmum).toBe(321000);
        expect(hydrated.publicHealth.prolanisState.lastSenamDay).toBe(31);
        expect(hydrated.clinical.queue).toEqual([]);
        expect(hydrated.clinical.emergencyQueue).toEqual([]);
        expect(hydrated.clinical.activePatientId).toBeNull();
        expect(hydrated.clinical.activeEmergencyId).toBeNull();
        expect(player.totalXp).toBe(1000);
        expect(player.xp).toBe(0);
        expect(buffs.accuracyBonus).toBe(5);
        expect(buffs.stressReduction).toBe(2);
    });

    it('normalizes malformed world state during persist.merge', () => {
        const merge = useGameStore.persist.getOptions().merge;
        const mergedState = merge({
            world: {
                day: 0,
                time: 9999,
                speed: -4,
                isPaused: 'yes'
            }
        }, useGameStore.getInitialState());

        expect(mergedState.world).toMatchObject({
            day: 1,
            time: 1439,
            speed: 0,
            isPaused: false
        });
    });

    it('normalizes null inventory, roster, and staff arrays during persist.merge', () => {
        const merge = useGameStore.persist.getOptions().merge;
        const initialState = useGameStore.getInitialState();
        const mergedState = merge({
            finance: {
                ...initialState.finance,
                pharmacyInventory: null
            },
            publicHealth: {
                ...initialState.publicHealth,
                prolanisRoster: null
            },
            staff: {
                hiredStaff: null
            }
        }, initialState);

        expect(mergedState.finance.pharmacyInventory).toEqual(initialState.finance.pharmacyInventory);
        expect(mergedState.publicHealth.prolanisRoster).toEqual([]);
        expect(mergedState.staff.hiredStaff).toEqual([]);
    });

    it('clears orphaned active encounter ids when queues are discarded by persist.merge', () => {
        const merge = useGameStore.persist.getOptions().merge;
        const mergedState = merge({
            clinical: {
                ...useGameStore.getInitialState().clinical,
                activePatientId: 'legacy-q-1',
                activeEmergencyId: 'legacy-e-1',
                queue: [{ id: 'legacy-q-1' }],
                emergencyQueue: [{ id: 'legacy-e-1' }]
            }
        }, useGameStore.getInitialState());

        expect(mergedState.clinical.queue).toEqual([]);
        expect(mergedState.clinical.emergencyQueue).toEqual([]);
        expect(mergedState.clinical.activePatientId).toBeNull();
        expect(mergedState.clinical.activeEmergencyId).toBeNull();
    });

    it('spends current-level XP when unlocking a skill and keeps the skill list unique', () => {
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                profile: {
                    ...state.player.profile,
                    level: 2,
                    xp: 150,
                    skills: []
                }
            }
        }));

        let firstUnlock;
        let secondUnlock;
        act(() => {
            firstUnlock = useGameStore.getState().playerActions.unlockSkill('stress_mgmt', 80);
            secondUnlock = useGameStore.getState().playerActions.unlockSkill('stress_mgmt', 80);
        });

        const profile = useGameStore.getState().player.profile;
        expect(firstUnlock).toBe(true);
        expect(secondUnlock).toBe(false);
        expect(profile.xp).toBe(70);
        expect(profile.skills).toEqual(['stress_mgmt']);
    });

    it('delegates queued patients to MAIA without crashing and archives the case', () => {
        const patient = {
            id: 'patient-1',
            name: 'Delegated Queue',
            age: 42,
            complaint: 'Demam 3 hari',
            social: { hasBPJS: true },
            medicalData: {
                trueDiagnosisCode: 'J00',
                diagnosisName: 'Nasofaringitis akut',
                correctTreatment: ['paracetamol']
            }
        };

        useGameStore.setState(state => ({
            clinical: {
                ...state.clinical,
                queue: [patient],
                activePatientId: patient.id
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().clinicalActions.delegateToMaia(patient.id, 2, 600);
        });

        const state = useGameStore.getState();
        expect(result.success).toBe(true);
        expect(state.clinical.queue).toEqual([]);
        expect(state.clinical.activePatientId).toBeNull();
        expect(state.finance.kpi.delegatedCases).toBe(1);
        expect(state.finance.kpi.totalPatients).toBe(1);
        expect(state.finance.kpi.bpjsPatients).toBe(1);
        expect(state.clinical.history.at(-1)?.cpptRecord?.handledBy).toBe('Dr. MAIA');
    });

    it('delegates emergency patients to MAIA and applies the documented reputation penalty', () => {
        const patient = {
            id: 'emergency-1',
            name: 'Delegated Emergency',
            age: 57,
            triageLevel: 2,
            complaint: 'Sesak napas',
            social: { hasBPJS: false }
        };

        useGameStore.setState(state => ({
            clinical: {
                ...state.clinical,
                emergencyQueue: [patient],
                activeEmergencyId: patient.id
            }
        }));

        let result;
        act(() => {
            result = useGameStore.getState().clinicalActions.delegateEmergencyToMaia(patient.id, 2, 620);
        });

        const state = useGameStore.getState();
        expect(result.success).toBe(true);
        expect(state.clinical.emergencyQueue).toEqual([]);
        expect(state.clinical.activeEmergencyId).toBeNull();
        expect(state.player.profile.reputation).toBe(75);
        expect(state.finance.kpi.delegatedCases).toBe(1);
        expect(state.finance.kpi.totalPatients).toBe(1);
        expect(state.finance.kpi.umumPatients).toBe(1);
        expect(state.clinical.history.at(-1)?.isEmergency).toBe(true);
    });

    it('wires Prolanis actions for senam, patient calling, and medication monitoring', () => {
        const member = {
            id: 'pro-1',
            name: 'Pasien Prolanis',
            age: 63,
            gender: 'P',
            social: { hasBPJS: true },
            bpjsNumber: 'PRO-0001',
            complicationRisk: 40,
            prolanisData: {
                diseaseType: 'dm_type2',
                enrolledDay: 1,
                lastVisitDay: 1,
                parameters: {
                    hba1c: 8.4,
                    gds: 210,
                    gdp: 150
                },
                history: [],
                consecutiveControlled: 0
            }
        };

        useGameStore.setState(state => ({
            world: { ...state.world, day: 31, time: 540 },
            finance: {
                ...state.finance,
                stats: { ...state.finance.stats, pendapatanUmum: 500000 }
            },
            publicHealth: {
                ...state.publicHealth,
                prolanisRoster: [member]
            }
        }));

        let senamResult;
        let duplicateSenamResult;
        let callResult;
        let duplicateCallResult;
        let monitorResult;
        let duplicateMonitorResult;
        act(() => {
            senamResult = useGameStore.getState().publicHealthActions.triggerSenamProlanis();
            duplicateSenamResult = useGameStore.getState().publicHealthActions.triggerSenamProlanis();
            callResult = useGameStore.getState().publicHealthActions.callProlanisPatient(member.id);
            duplicateCallResult = useGameStore.getState().publicHealthActions.callProlanisPatient(member.id);
            monitorResult = useGameStore.getState().publicHealthActions.monitorMedication(member.id);
            duplicateMonitorResult = useGameStore.getState().publicHealthActions.monitorMedication(member.id);
        });

        const state = useGameStore.getState();
        const updatedMember = state.publicHealth.prolanisRoster[0];
        expect(senamResult.success).toBe(true);
        expect(duplicateSenamResult.success).toBe(false);
        expect(state.publicHealth.prolanisState.lastSenamDay).toBe(31);
        expect(updatedMember.prolanisData.parameters.gds).toBeLessThan(210);
        expect(callResult.success).toBe(true);
        expect(duplicateCallResult.success).toBe(false);
        expect(state.clinical.queue[0].originalId).toBe(member.id);
        expect(monitorResult.success).toBe(true);
        expect(duplicateMonitorResult.success).toBe(false);
        expect(updatedMember.prolanisData.lastMedicationReviewDay).toBe(31);
    });

    it('completes Prolanis visits using the current world day and clears the queued visit entry', () => {
        const member = {
            id: 'pro-complete-1',
            name: 'Pasien Kontrol',
            age: 58,
            gender: 'L',
            social: { hasBPJS: true },
            bpjsNumber: 'PRO-0099',
            complicationRisk: 25,
            prolanisData: {
                diseaseType: 'dm_type2',
                enrolledDay: 1,
                lastVisitDay: 1,
                parameters: {
                    hba1c: 8.1,
                    gds: 205,
                    gdp: 148
                },
                history: [],
                consecutiveControlled: 0
            }
        };

        useGameStore.setState(state => ({
            world: { ...state.world, day: 31, time: 540 },
            publicHealth: {
                ...state.publicHealth,
                prolanisRoster: [member]
            }
        }));

        let callResult;
        act(() => {
            callResult = useGameStore.getState().publicHealthActions.callProlanisPatient(member.id);
        });

        expect(callResult.success).toBe(true);

        act(() => {
            useGameStore.getState().publicHealthActions.completeProlanisVisit({
                patientId: callResult.patient.id,
                doctorDecisions: {
                    medicationAction: { effect: { paramChange: -10 } },
                    education: []
                }
            });
        });

        const state = useGameStore.getState();
        const updatedMember = state.publicHealth.prolanisRoster[0];

        expect(updatedMember.prolanisData.lastVisitDay).toBe(31);
        expect(updatedMember.prolanisData.history.at(-1)?.day).toBe(31);
        expect(state.clinical.queue).toEqual([]);
        expect(state.clinical.queue.find(patient => patient.id === callResult.patient.id)).toBeUndefined();
    });

    it('trims oversized clinical history during save payload normalization', () => {
        const parsed = parseSavePayload({
            clinical: {
                history: Array.from({ length: 240 }, (_, index) => ({ id: `hist-${index}` }))
            }
        });

        expect(parsed.clinical.history).toHaveLength(200);
        expect(parsed.clinical.history[0].id).toBe('hist-40');
    });
});
