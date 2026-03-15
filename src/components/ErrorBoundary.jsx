/**
 * @reflection
 * [IDENTITY]: ErrorBoundary
 * [PURPOSE]: React UI component: ErrorBoundary.
 * [STATE]: Experimental
 * [ANCHOR]: ErrorBoundary
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-03-12
 */

import React from 'react';
import { safeReloadPage } from '../utils/browserSafety.js';

/**
 * ErrorBoundary - Catches React rendering errors and shows a recovery UI.
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

    isDynamicImportError = (error = this.state.error) => {
        const message = error?.message || '';
        return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message);
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        console.error(`[ErrorBoundary:${this.props.name || 'unnamed'}]`, error, errorInfo);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.hasError) return;

        const prevResetKeys = prevProps.resetKeys || [];
        const nextResetKeys = this.props.resetKeys || [];
        const hasResetKeyChange =
            prevResetKeys.length !== nextResetKeys.length ||
            nextResetKeys.some((key, index) => !Object.is(key, prevResetKeys[index]));

        if (hasResetKeyChange) {
            this.setState({ hasError: false, error: null, errorInfo: null });
        }
    }

    handleRetry = () => {
        this.props.onReset?.(this.state.error, this.state.errorInfo);

        if (this.isDynamicImportError()) {
            safeReloadPage();
            return;
        }

        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleFallbackAction = () => {
        this.props.fallbackAction?.(this.state.error, this.state.errorInfo);
    };

    render() {
        if (this.state.hasError) {
            const isDark = this.props.isDark !== false;
            const name = this.props.name || 'Component';
            const isDynamicImportError = this.isDynamicImportError();
            const description = this.props.description || (isDynamicImportError
                ? 'Modul aplikasi gagal dimuat, biasanya karena server dev Vite sempat putus atau restart. Muat ulang aplikasi untuk menyambungkan ulang modul.'
                : `${name} mengalami error. Klik tombol di bawah untuk mencoba lagi.`);
            const buttonLabel = this.props.retryLabel || (isDynamicImportError ? 'Muat Ulang Aplikasi' : 'Coba Lagi');
            const fallbackActionLabel = this.props.fallbackActionLabel || 'Tutup';

            return (
                <div className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed m-2 min-h-[200px] ${isDark
                    ? 'bg-slate-900/80 border-rose-500/30 text-slate-300'
                    : 'bg-rose-50 border-rose-300 text-slate-700'
                }`}>
                    <div className="text-4xl mb-3">!</div>
                    <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                        Terjadi Kesalahan
                    </h3>
                    <p className={`text-sm mb-3 text-center max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {description}
                    </p>

                    {import.meta.env.DEV && this.state.error && (
                        <details className={`text-xs mb-3 w-full max-w-lg p-2 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
                            <summary className="cursor-pointer font-mono text-rose-400 mb-1">
                                {this.state.error.toString()}
                            </summary>
                            <pre className={`whitespace-pre-wrap text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={this.handleRetry}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isDark
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                            }`}
                        >
                            {buttonLabel}
                        </button>

                        {this.props.fallbackAction && (
                            <button
                                onClick={this.handleFallbackAction}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isDark
                                    ? 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {fallbackActionLabel}
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
