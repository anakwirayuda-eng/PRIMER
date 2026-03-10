/**
 * @reflection
 * [IDENTITY]: gameContext.contract.js
 * [PURPOSE]: Defines the required keys for the unified GameContext.
 */

export const GAME_CONTEXT_REQUIRED_KEYS = [
    // Navigation (from spread of nav + explicit aliases)
    'gameState',
    'viewParams',
    'navigate',
    // World (from spread of world + explicit aliases)
    'time',
    'day',
    // Player (from spread of player + explicit aliases)
    'energy',
    'morningStatus',
    'playerStats',
    // Finance (from spread of finance)
    'stats',
    // Clinical (from spread of clinical)
    'reputation',
    // Core actions
    'saveGame',
    'loadGame',
    'startNewGame',
    'nextDay',
];

export function assertGameContextContract(ctx, label = 'GameContext') {
    const missing = GAME_CONTEXT_REQUIRED_KEYS.filter(
        (k) => ctx == null || typeof ctx[k] === 'undefined'
    );

    if (missing.length === 0) return;

    const msg = `[CONTRACT:${label}] Missing keys: ${missing.join(', ')}. This is a regression. Fix provider "value" shape.`;

    // Fail fast in Dev to catch regressions immediately
    const isDev = import.meta.env?.DEV;

    if (isDev) {
        throw new Error(msg);
    } else {
        console.error(msg);
    }
}
