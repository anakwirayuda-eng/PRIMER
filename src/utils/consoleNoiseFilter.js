/**
 * @reflection
 * [IDENTITY]: consoleNoiseFilter
 * [PURPOSE]: Suppress a handful of known benign Three.js/WebGL console messages so real app issues stay visible during runtime QA.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-03-25
 */

const NOISY_CONSOLE_PATTERNS = [
    /^THREE\.THREE\.Clock: This module has been deprecated\. Please use THREE\.Timer instead\./,
    /^THREE\.WebGLProgram: Program Info Log:/,
    /^THREE\.WebGLRenderer: Context Lost\.$/,
    /^THREE\.WebGLRenderer: Context Restored\.$/
];

function shouldSuppressConsoleArgs(args) {
    return args.some((arg) => (
        typeof arg === 'string'
        && NOISY_CONSOLE_PATTERNS.some((pattern) => pattern.test(arg))
    ));
}

export function installConsoleNoiseFilter() {
    if (typeof window === 'undefined') return;
    if (window.__PRIMER_CONSOLE_NOISE_FILTER_INSTALLED__) return;

    window.__PRIMER_CONSOLE_NOISE_FILTER_INSTALLED__ = true;

    for (const method of ['debug', 'info', 'log', 'warn']) {
        const original = console[method]?.bind(console);
        if (!original) continue;

        console[method] = (...args) => {
            if (shouldSuppressConsoleArgs(args)) return;
            original(...args);
        };
    }
}
