import { describe, expect, it } from 'vitest';
import { formatTime } from '../utils/formatTime.js';

describe('formatTime', () => {
    it('rounds fractional game-loop minutes down to whole-minute HH:MM output', () => {
        expect(formatTime(510.5)).toBe('08:30');
        expect(formatTime(426.25)).toBe('07:06');
    });

    it('falls back to midnight for invalid values', () => {
        expect(formatTime(undefined)).toBe('00:00');
        expect(formatTime(Number.NaN)).toBe('00:00');
    });
});
