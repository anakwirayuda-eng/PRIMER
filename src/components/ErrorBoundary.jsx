/**
 * @reflection
 * [IDENTITY]: ErrorBoundary
 * [PURPOSE]: React UI component: ErrorBoundary.
 * [STATE]: Experimental
 * [ANCHOR]: ErrorBoundary
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';

/**
 * ErrorBoundary — Catches React rendering errors and shows a recovery UI.
 * Prevents white-screen crashes from propagating to the entire app.
 *
 * Usage:
 *   <ErrorBoundary name="PatientEMR">
 *     <PatientEMR ... />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error(`[ErrorBoundary:${this.props.name || 'unnamed'}]`, error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            const isDark = this.props.isDark !== false; // default dark
            const name = this.props.name || 'Component';

            return (
                <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed m-2 min-h-[200px] ${isDark
                        ? 'bg-slate-900/80 border-rose-500/30 text-slate-300'
                        : 'bg-rose-50 border-rose-300 text-slate-700'
                    }`}>
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                        Terjadi Kesalahan
                    </h3>
                    <p className={`text-sm mb-3 text-center max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {name} mengalami error. Klik tombol di bawah untuk mencoba lagi.
                    </p>

                    {/* Error details (dev mode only) */}
                    {import.meta.env.DEV && this.state.error && (
                        <details className={`text-xs mb-3 w-full max-w-lg p-2 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
                            }`}>
                            <summary className="cursor-pointer font-mono text-rose-400 mb-1">
                                {this.state.error.toString()}
                            </summary>
                            <pre className={`whitespace-pre-wrap text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}

                    <button
                        onClick={this.handleRetry}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isDark
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                            }`}
                    >
                        🔄 Coba Lagi
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
