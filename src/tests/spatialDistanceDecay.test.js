import { describe, it, expect } from 'vitest';
import { calculateDistanceDecayModifiers } from '../domains/village/spatialDistanceDecay.js';

describe('Geo Law 3: Distance Decay Modifiers', () => {

    it('returns baseline for distances < 20', () => {
        // Jarak dekat (0 - 19)
        const close = calculateDistanceDecayModifiers(15);
        expect(close).toEqual({ driftMultiplier: 1.0, severityBoost: 0 });

        const veryClose = calculateDistanceDecayModifiers(0);
        expect(veryClose).toEqual({ driftMultiplier: 1.0, severityBoost: 0 });
    });

    it('returns middle tier penalty for 20-40 distances', () => {
        // Jarak menengah (20 - 40)
        const edgeLow = calculateDistanceDecayModifiers(20);
        expect(edgeLow).toEqual({ driftMultiplier: 1.5, severityBoost: 1 });

        const edgeHigh = calculateDistanceDecayModifiers(40);
        expect(edgeHigh).toEqual({ driftMultiplier: 1.5, severityBoost: 1 });
    });

    it('returns top tier penalty for distances > 40', () => {
        // Jarak jauh (> 40)
        const far = calculateDistanceDecayModifiers(41);
        expect(far).toEqual({ driftMultiplier: 2.0, severityBoost: 2 });

        const veryFar = calculateDistanceDecayModifiers(150);
        expect(veryFar).toEqual({ driftMultiplier: 2.0, severityBoost: 2 });
    });

    it('reduces penalty safely using FOB mitigation without giving bonus', () => {
        // FOB mengurangi evaluasi "jarak" sebanyak 20 sel

        // Distance > 40 turun ke 20-40
        const mitigatedFar = calculateDistanceDecayModifiers(50, true);
        expect(mitigatedFar).toEqual({ driftMultiplier: 1.5, severityBoost: 1 }); 
        // (effective 30)

        // Distance = 40 turun ke < 20
        const mitigatedEdge = calculateDistanceDecayModifiers(39, true);
        expect(mitigatedEdge).toEqual({ driftMultiplier: 1.0, severityBoost: 0 }); 
        // (effective 19)

        // Distance < 20 tidak memberikan bonus, tetap return 1.0 / 0
        const mitigatedClose = calculateDistanceDecayModifiers(10, true);
        expect(mitigatedClose).toEqual({ driftMultiplier: 1.0, severityBoost: 0 });
    });

    it('handles negative, null, or invalid input safely', () => {
        const negative = calculateDistanceDecayModifiers(-10);
        expect(negative).toEqual({ driftMultiplier: 1.0, severityBoost: 0 });

        const nullDistance = calculateDistanceDecayModifiers(null);
        expect(nullDistance).toEqual({ driftMultiplier: 1.0, severityBoost: 0 });
    });
});
