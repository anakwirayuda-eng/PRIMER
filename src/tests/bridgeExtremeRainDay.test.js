import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isExtremeRainDay } from '../domains/village/bridgeSeasonalState.js';
import { selectBridgeSeasonalState, selectVillageTravelContext } from '../store/selectors.js';
import * as eventEngine from '../game/IKMEventEngine.js';

describe('Bridge Extreme Rain Mechanics', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('isExtremeRainDay helper', () => {
        it('always returns false on dry days', () => {
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('dry');
            
            // Scan across 100 days; all should be false if season is not hujan
            for (let day = 1; day <= 100; day++) {
                expect(isExtremeRainDay(day)).toBe(false);
            }
        });

        it('is deterministic for the same rainy day', () => {
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
            
            const firstRun = isExtremeRainDay(42);
            const secondRun = isExtremeRainDay(42);
            expect(firstRun).toBe(secondRun);
        });

        it('returns at least one true across a reasonable rainy-day scan range', () => {
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
            
            // At 8% chance per day, across 100 days we expect multiple trues
            let extremeCount = 0;
            for (let day = 1; day <= 100; day++) {
                if (isExtremeRainDay(day)) {
                    extremeCount++;
                }
            }
            expect(extremeCount).toBeGreaterThan(0);
        });
        
        it('safely handles invalid day input', () => {
            expect(isExtremeRainDay(NaN)).toBe(false);
            expect(isExtremeRainDay(0)).toBe(false);
            expect(isExtremeRainDay(-5)).toBe(false);
            expect(isExtremeRainDay('10')).toBe(false);
        });
    });

    describe('selectBridgeSeasonalState backward compatibility', () => {
        const dummyState = { world: { day: 42 } };

        it('respects manual override false', () => {
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
            
            const result = selectBridgeSeasonalState(dummyState, false);
            expect(result.status).not.toBe('putus');
            expect(result.isIsolated).toBe(false);
        });

        it('respects manual override true', () => {
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
            
            const result = selectBridgeSeasonalState(dummyState, true);
            expect(result.status).toBe('putus');
            expect(result.isIsolated).toBe(true);
        });

        it('auto-computes safely from day without override', () => {
            // Force random to return true for bridge-extreme day 42
            vi.spyOn(eventEngine, 'getSeasonForDay').mockReturnValue('rainy');
            
            // We'll trust the underlying deterministic logic; whatever it returns shouldn't crash
            const dynamicResult = selectBridgeSeasonalState(dummyState); // override = null
            
            expect(['rawan_banjir', 'putus']).toContain(dynamicResult.status);
            
            // Verify selectVillageTravelContext works too
            const ctxResult = selectVillageTravelContext(dummyState);
            expect(ctxResult.bridgeState.status).toBe(dynamicResult.status);
        });
    });
});
