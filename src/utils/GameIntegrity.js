/**
 * @reflection
 * [IDENTITY]: GameIntegrity (Anti-Cheat Sentinel)
 * [PURPOSE]: Detects LocalStorage tampering via integrity hash.
 * [STATE]: Production
 * [ANCHOR]: INTEGRITY_CHECK
 * [DEPENDS_ON]: useGameStore
 * [LAST_UPDATE]: 2026-03-20
 */

// Simple hash using SubtleCrypto — NOT cryptographic security,
// just enough to catch F12 edits by non-IT students.
// The salt makes it non-trivial to reverse.

const SALT = 'PRIMER_UNAIR_2026_FK_INTEGRITAS';

/**
 * Generate integrity hash from critical game values.
 * Called before persisting to localStorage.
 */
export async function generateIntegrityHash(state) {
    const criticalValues = [
        state.world?.day || 0,
        state.finance?.stats?.budget || 0,
        state.clinical?.reputation || 0,
        state.player?.xp || 0,
        state.player?.level || 0,
        state.meta?.accreditationLevel || 'dasar',
        SALT
    ].join('|');

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(criticalValues);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
    } catch {
        // Fallback for environments without SubtleCrypto
        return btoa(criticalValues).slice(0, 16);
    }
}

/**
 * Verify integrity hash against current state.
 * Returns { valid: boolean, reason: string }
 */
export async function verifyIntegrity(state, storedHash) {
    if (!storedHash) return { valid: true, reason: 'No hash stored (first run)' };
    
    const currentHash = await generateIntegrityHash(state);
    
    if (currentHash !== storedHash) {
        console.warn('[GameIntegrity] ⚠️ Tampering detected!', {
            expected: storedHash,
            computed: currentHash
        });
        return { valid: false, reason: 'Integrity hash mismatch — state was modified externally' };
    }
    
    return { valid: true, reason: 'OK' };
}

/**
 * Quick sanity check on critical values.
 * Catches obviously impossible values even without hash comparison.
 */
export function sanityCheckState(state) {
    const violations = [];
    
    const budget = state.finance?.stats?.budget;
    if (typeof budget === 'number' && budget > 1_000_000_000) {
        violations.push(`Budget impossibly high: ${budget}`);
    }
    
    const reputation = state.clinical?.reputation;
    if (typeof reputation === 'number' && reputation > 200) {
        violations.push(`Reputation impossibly high: ${reputation}`);
    }
    
    const day = state.world?.day;
    if (typeof day === 'number' && day > 400) {
        violations.push(`Day impossibly high: ${day}`);
    }
    
    const xp = state.player?.xp;
    if (typeof xp === 'number' && xp > 500_000) {
        violations.push(`XP impossibly high: ${xp}`);
    }

    if (violations.length > 0) {
        console.warn('[GameIntegrity] 🚨 Sanity check failed:', violations);
        return { valid: false, violations };
    }
    
    return { valid: true, violations: [] };
}
