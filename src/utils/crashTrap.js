/**
 * @reflection
 * [IDENTITY]: crashTrap
 * [PURPOSE]: Global error and rejection interceptor to prevent silent crashes.
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-14
 */

export function installCrashTrap(reportFn = console.error) {
    if (typeof window === 'undefined') return;
    if (window.__PRIMER_CRASH_TRAP_INSTALLED__) return;

    // Avoid duplicate global listeners during dev HMR or repeated bootstrap paths.
    window.__PRIMER_CRASH_TRAP_INSTALLED__ = true;

    window.addEventListener('error', (event) => {
        reportFn({
            type: 'UNCaught_ERROR',
            message: event.message,
            source: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        reportFn({
            type: 'UNHANDLED_REJECTION',
            message: String(event.reason),
            stack: event.reason?.stack
        });
    });

    console.debug('🛡️ PRIMERA Crash Trap Activated.');
}
