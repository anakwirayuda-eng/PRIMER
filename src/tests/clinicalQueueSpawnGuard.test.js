import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { generatePatientMock, playNotificationMock } = vi.hoisted(() => ({
    generatePatientMock: vi.fn(),
    playNotificationMock: vi.fn()
}));

vi.mock('../utils/SoundManager.js', () => ({
    soundManager: {
        playSuccess: vi.fn(),
        playError: vi.fn(),
        playNotification: playNotificationMock,
        playConfirm: vi.fn(),
        playCancel: vi.fn()
    }
}));

vi.mock('../utils/deterministicRandom.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        chanceFromSeed: vi.fn((key) => String(key).startsWith('clinical-spawn:'))
    };
});

vi.mock('../game/PatientGenerator.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        generatePatient: (...args) => generatePatientMock(...args)
    };
});

import { useGameStore } from '../store/useGameStore.js';

function setTickState(queue) {
    useGameStore.setState((state) => ({
        ...state,
        world: { ...state.world, day: 2, time: 600 },
        clinical: {
            ...state.clinical,
            queue,
            emergencyQueue: [],
            consequenceQueue: [],
            todayLog: []
        }
    }));
}

describe('clinical queue spawn guard', () => {
    beforeEach(() => {
        useGameStore.setState(useGameStore.getInitialState(), true);
        generatePatientMock.mockReset();
        playNotificationMock.mockReset();
    });

    it('keeps same-name non-resident patients eligible for queue spawn', () => {
        setTickState([
            {
                id: 'queued-1',
                name: 'Siti Aminah',
                age: 31,
                gender: 'P',
                hidden: {},
                social: {}
            }
        ]);

        generatePatientMock.mockReturnValue({
            id: 'spawn-1',
            name: 'Siti Aminah',
            age: 22,
            gender: 'P',
            hidden: {},
            social: {}
        });

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        const queue = useGameStore.getState().clinical.queue;

        expect(generatePatientMock).toHaveBeenCalledTimes(1);
        expect(queue).toHaveLength(2);
        expect(queue.some((patient) => patient.id === 'spawn-1')).toBe(true);
        expect(playNotificationMock).toHaveBeenCalledTimes(1);
    });

    it('drops spawn when every retry collides with an already queued resident', () => {
        setTickState([
            {
                id: 'queued-resident',
                name: 'Bambang',
                age: 54,
                gender: 'L',
                hidden: { villagerId: 'resident-42' },
                social: { villagerId: 'resident-42' }
            }
        ]);

        generatePatientMock.mockImplementation(() => ({
            id: `duplicate-${generatePatientMock.mock.calls.length + 1}`,
            name: 'Bambang',
            age: 54,
            gender: 'L',
            hidden: { villagerId: 'resident-42' },
            social: { villagerId: 'resident-42' }
        }));

        act(() => {
            useGameStore.getState().clinicalActions.processDailyTick();
        });

        const queue = useGameStore.getState().clinical.queue;

        expect(generatePatientMock).toHaveBeenCalledTimes(4);
        expect(queue).toHaveLength(1);
        expect(queue[0].id).toBe('queued-resident');
        expect(playNotificationMock).not.toHaveBeenCalled();
    });
});
