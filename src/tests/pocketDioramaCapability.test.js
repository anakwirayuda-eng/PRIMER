import { describe, expect, it } from 'vitest';

import { resolvePocketDioramaCapability } from '../components/wilayah/pocketDioramaCapability.js';

describe('resolvePocketDioramaCapability', () => {
    it('returns off when no scope data is available', () => {
        expect(resolvePocketDioramaCapability({
            hasScopeData: false,
            canUse3D: true,
            isCompactHud: false,
            showShowcaseModal: false,
        })).toBe('off');
    });

    it('returns live for desktop-capable inspector contexts', () => {
        expect(resolvePocketDioramaCapability({
            hasScopeData: true,
            canUse3D: true,
            isCompactHud: false,
            showShowcaseModal: false,
        })).toBe('live');
    });

    it('returns snapshot on compact/mobile layouts', () => {
        expect(resolvePocketDioramaCapability({
            hasScopeData: true,
            canUse3D: true,
            isCompactHud: true,
            showShowcaseModal: false,
        })).toBe('snapshot');
    });

    it('returns snapshot when exhibition modal is active', () => {
        expect(resolvePocketDioramaCapability({
            hasScopeData: true,
            canUse3D: true,
            isCompactHud: false,
            showShowcaseModal: true,
        })).toBe('snapshot');
    });
});
