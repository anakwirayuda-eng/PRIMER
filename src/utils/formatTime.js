/**
 * Format a game-time value (minutes since midnight) to HH:MM string.
 * Shared utility used by MainLayout and Smartphone.
 *
 * @param {number} minutes - Minutes since midnight (0-1440)
 * @returns {string} Formatted time string, e.g. "07:30"
 */
export function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
