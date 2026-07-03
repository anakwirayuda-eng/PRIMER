const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Dev', 'PRIMER', 'src', 'components', 'WilayahPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add the state
if (!content.includes('loadingTimeoutFallback')) {
    content = content.replace(
        'const [diveWhiteout, setDiveWhiteout] = useState(false);',
        'const [diveWhiteout, setDiveWhiteout] = useState(false);\n    const [loadingTimeoutFallback, setLoadingTimeoutFallback] = useState(false);'
    );
}

// Add the timeout effect
const effectCode = `    useEffect(() => {
        if (!mapData) {
            const timer = setTimeout(() => {
                setLoadingTimeoutFallback(true);
            }, 8000);
            return () => clearTimeout(timer);
        } else {
            setLoadingTimeoutFallback(false);
        }
    }, [mapData]);

    // Loading guard`;

content = content.replace('    // Loading guard', effectCode);

// Add the UI
const fallbackUI = `    if (!mapData) {
        return (
            <ErrorBoundary>
                <div className="relative w-full h-screen overflow-hidden bg-[#0a0f0d] flex flex-col items-center justify-center p-8">
                    <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        {loadingTimeoutFallback ? (
                            <React.Fragment>
                                <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-2xl border border-red-500/30 flex items-center justify-center animate-pulse">
                                    <Activity className="text-red-400" size={40} />
                                </div>
                                <div>
                                    <h3 className="text-red-400 font-black tracking-widest text-lg uppercase mb-2">Sinkronisasi Gagal</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                                        Data wilayah gagal dimuat setelah beberapa saat (Topology Sync Timeout).
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-6 py-3 rounded-xl font-bold tracking-widest text-xs uppercase transition-all"
                                >
                                    Muat Ulang Komponen
                                </button>
                            </React.Fragment>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <MapIcon className="mx-auto text-emerald-500/40" size={48} />
                                <p className="text-white/40 text-sm font-black uppercase tracking-widest">{t('common.loading', 'SINKRONISASI DATARAN...')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </ErrorBoundary>
        );
    }`;

// Replace the existing check using Regex
content = content.replace(/    if \(\!mapData\) \{[\s\S]*?        \);\n    \}/m, fallbackUI);

fs.writeFileSync(filePath, content);
console.log('Patched WilayahPage.jsx');
