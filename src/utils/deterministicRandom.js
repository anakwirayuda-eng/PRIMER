function hashSeed(seed) {
    const value = String(seed ?? '');
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

export function createSeededGenerator(seed) {
    let state = hashSeed(seed);
    return () => {
        state += 0x6D2B79F5;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function seededFloat(seed, offset = 0) {
    const generator = createSeededGenerator(`${seed}:${offset}`);
    return generator();
}

export function seededBetween(seed, min, max, offset = 0) {
    return min + (seededFloat(seed, offset) * (max - min));
}

export function seededInt(seed, maxExclusive, offset = 0) {
    if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
        return 0;
    }
    return Math.floor(seededFloat(seed, offset) * maxExclusive);
}

export function chanceFromSeed(seed, probability, offset = 0) {
    if (probability <= 0) return false;
    if (probability >= 1) return true;
    return seededFloat(seed, offset) < probability;
}

export function pickDeterministic(items, seed, offset = 0) {
    if (!Array.isArray(items) || items.length === 0) {
        return undefined;
    }
    return items[seededInt(seed, items.length, offset)];
}

export function shuffleDeterministic(items, seed) {
    if (!Array.isArray(items)) {
        return [];
    }

    const shuffled = [...items];
    const next = createSeededGenerator(seed);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
