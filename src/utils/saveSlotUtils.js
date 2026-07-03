import { parseSavePayload } from './savePayload.js';

export function buildCanonicalSave(saveBlob) {
    return parseSavePayload(saveBlob);
}

export function normalizeSlot(saveBlob, slotId) {
    const canonicalSave = buildCanonicalSave(saveBlob);
    if (!canonicalSave) {
        return { slotId, empty: true };
    }

    const profile = canonicalSave?.player?.profile || null;
    const day = canonicalSave?.world?.day || 1;
    const reputation = profile?.reputation ?? 80;
    const savedAt = canonicalSave?.savedAt || null;
    const saveVersion = canonicalSave?.saveVersion || null;
    return { slotId, profile, day, reputation, savedAt, saveVersion, saveData: canonicalSave, _raw: canonicalSave };
}
