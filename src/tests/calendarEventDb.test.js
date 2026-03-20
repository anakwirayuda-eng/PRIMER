import { describe, expect, it } from 'vitest';
import {
    formatDate,
    getDayDate,
    getDayNumberForDate,
    getDaysInMonth,
    getFirstDayOfMonth
} from '../data/CalendarEventDB.js';

describe('CalendarEventDB', () => {
    it('formats future in-game dates with their actual year', () => {
        expect(formatDate(366)).toBe('1 Januari 2027');
    });

    it('supports month calculations beyond 2026', () => {
        const february2028Start = getFirstDayOfMonth(2, 2028);

        expect(getDayDate(february2028Start).getFullYear()).toBe(2028);
        expect(getDayDate(february2028Start).getMonth()).toBe(1);
        expect(getDaysInMonth(2, 2028)).toBe(29);
        expect(getDayNumberForDate(2028, 2, 29)).toBeGreaterThan(february2028Start);
    });
});
