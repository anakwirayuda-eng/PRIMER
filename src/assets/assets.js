import manifest from './asset-manifest.json';

/**
 * @reflection
 * [IDENTITY]: assets.js (The Golden Path)
 * [PURPOSE]: Centralized asset management and URL resolution.
 */

export const ASSET_MANIFEST = manifest.ASSETS;

export const ASSET_KEY = Object.freeze(
    Object.keys(ASSET_MANIFEST).reduce((acc, k) => {
        acc[k] = k;
        return acc;
    }, {})
);

/**
 * Resolves a key to a stable URL.
 * Vite serves from /public by default, so 'assets/foo.png' -> '/assets/foo.png'
 */
export function getAssetUrl(key) {
    const meta = ASSET_MANIFEST[key];
    if (!meta) {
        throw new Error(`[ASSET] Unknown key: ${key}. Check src/assets/asset-manifest.json`);
    }
    const base = import.meta.env?.BASE_URL || '/';
    return `${base.replace(/\/?$/, '/')}assets/${meta.file.replace(/^\/+/, '')}`;
}

export function preloadImages(keys = []) {
    return Promise.all(
        keys.map((k) => {
            const url = getAssetUrl(k);
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ key: k, url });
                img.onerror = () => reject(new Error(`[ASSET] Failed to load image: ${k} -> ${url}`));
                img.src = url;
            });
        })
    );
}
