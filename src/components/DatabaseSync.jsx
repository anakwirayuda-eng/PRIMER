/**
 * @reflection
 * [IDENTITY]: DatabaseSync
 * [PURPOSE]: React UI component: DatabaseSync.
 * [STATE]: Experimental
 * [ANCHOR]: DatabaseSync
 * [DEPENDS_ON]: PersistenceService
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useEffect } from 'react';
import { PersistenceService } from '../services/PersistenceService.js';
import { Loader2, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { safeReloadPage } from '../utils/browserSafety.js';

export default function DatabaseSync({ onComplete }) {
    const [status, setStatus] = useState('Checking database...');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const isPopulated = await PersistenceService.isPopulated();
                if (isPopulated) {
                    onComplete();
                    return;
                }

                // Need to sync
                await PersistenceService.syncData((msg, val) => {
                    setStatus(msg);
                    setProgress(val);
                });

                onComplete();
            } catch (err) {
                console.error('DatabaseSync Error:', err);
                setError('Failed to synchronize medical database. Please refresh the page.');
            }
        };

        init();
    }, [onComplete]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] -z-10" />

                <div className="flex justify-center mb-6">
                    {error ? (
                        <div className="p-4 bg-red-500/20 rounded-full border border-red-500/50">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    ) : progress === 100 ? (
                        <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-500/50">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-500/20 rounded-full border border-blue-500/50 relative">
                            <Database className="w-12 h-12 text-blue-400" />
                            <Loader2 className="w-20 h-20 text-blue-500/30 absolute top-0 left-0 animate-spin" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-2 font-mono tracking-tight">PRIMER DATABASE</h1>
                <p className="text-slate-400 mb-8">{status}</p>

                {!error && (
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
                        <div
                            className="bg-emerald-500 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div className="flex justify-between text-xs font-mono text-slate-500 uppercase tracking-widest">
                    <span>{progress}% Optimized</span>
                    <span>v0.8.0 Scale</span>
                </div>

                {error && (
                    <button
                        onClick={() => safeReloadPage()}
                        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold transition-colors"
                    >
                        Retry Sync
                    </button>
                )}
            </div>

            <p className="mt-8 text-xs text-slate-600 max-w-sm">
                This process only runs once. We are moving 3.1MB of medical data to local storage for faster future startups.
            </p>
        </div>
    );
}
