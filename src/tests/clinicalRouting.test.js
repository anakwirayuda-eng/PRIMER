import { describe, expect, it } from 'vitest';

import { filterQueueByService, isClinicalServiceOpen, isPatientAssignedToService, resolvePatientServiceId } from '../utils/clinicalRouting.js';

describe('clinicalRouting helpers', () => {
    const queue = [
        { id: 'u-1', facility: 'poli_umum', isEmergency: false },
        { id: 'k-1', facility: 'poli_kia_kb', isEmergency: false },
        { id: 'g-1', facility: 'poli_gigi', isEmergency: false },
        { id: 'e-1', isEmergency: true }
    ];

    it('resolves the owning service from patient runtime fields', () => {
        expect(resolvePatientServiceId(queue[0])).toBe('poli_umum');
        expect(resolvePatientServiceId(queue[1])).toBe('poli_kia_kb');
        expect(resolvePatientServiceId(queue[2])).toBe('poli_gigi');
        expect(resolvePatientServiceId(queue[3])).toBe('igd');
    });

    it('filters queues by active poli instead of mixing all regular patients together', () => {
        expect(filterQueueByService(queue, 'poli_umum').map((patient) => patient.id)).toEqual(['u-1']);
        expect(filterQueueByService(queue, 'poli_kia_kb').map((patient) => patient.id)).toEqual(['k-1']);
        expect(filterQueueByService(queue, 'poli_gigi').map((patient) => patient.id)).toEqual(['g-1']);
        expect(isPatientAssignedToService(queue[1], 'poli_kia_kb')).toBe(true);
        expect(isPatientAssignedToService(queue[1], 'poli_umum')).toBe(false);
    });

    it('treats queue-based services as closed outside 08:00-16:00 while emergency stays open', () => {
        expect(isClinicalServiceOpen({ queueType: 'queue' }, 479)).toBe(false);
        expect(isClinicalServiceOpen({ queueType: 'queue' }, 480)).toBe(true);
        expect(isClinicalServiceOpen({ queueType: 'queue' }, 959)).toBe(true);
        expect(isClinicalServiceOpen({ queueType: 'queue' }, 960)).toBe(false);
        expect(isClinicalServiceOpen({ queueType: 'emergency' }, 300)).toBe(true);
    });
});
