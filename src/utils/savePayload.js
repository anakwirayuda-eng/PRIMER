import { z } from 'zod';
import { INITIAL_PLAYER_STATE, INITIAL_TIME_STATE } from '../game/GameCore.js';

export const CURRENT_SAVE_VERSION = 5;
const MAX_CLINICAL_HISTORY = 200;

const finiteNumber = z.number().finite();

const PlayerProfileSchema = z.record(z.string(), z.unknown());

const PlayerSliceSchema = z.object({
    profile: PlayerProfileSchema.optional()
}).passthrough();

const WorldSliceSchema = z.object({
    day: finiteNumber.optional(),
    time: finiteNumber.optional(),
    speed: finiteNumber.optional(),
    isPaused: z.boolean().optional()
}).passthrough();

const FinanceSliceSchema = z.object({
    stats: z.record(z.string(), z.unknown()).optional(),
    facilities: z.record(z.string(), z.unknown()).optional(),
    pharmacyInventory: z.array(z.unknown()).optional(),
    pendingOrders: z.array(z.unknown()).optional()
}).passthrough();

const ClinicalSliceSchema = z.object({
    queue: z.array(z.unknown()).optional(),
    emergencyQueue: z.array(z.unknown()).optional(),
    activePatientId: z.string().nullable().optional(),
    activeEmergencyId: z.string().nullable().optional(),
    history: z.array(z.unknown()).optional(),
    gameOver: z.unknown().nullable().optional()
}).passthrough();

const PublicHealthSliceSchema = z.object({
    villageData: z.unknown().nullable().optional(),
    prolanisRoster: z.array(z.unknown()).optional(),
    prolanisState: z.record(z.string(), z.unknown()).optional(),
    activeOutbreaks: z.array(z.unknown()).optional(),
    outbreakNotification: z.unknown().nullable().optional(),
    activeIKMEvents: z.array(z.unknown()).optional(),
    completedIKMIds: z.array(z.unknown()).optional(),
    ikmCooldowns: z.record(z.string(), z.unknown()).optional(),
    ikmCaseBoosts: z.array(z.unknown()).optional(),
    buildingProgress: z.record(z.string(), z.unknown()).optional()
}).passthrough();

const StaffSliceSchema = z.object({
    hiredStaff: z.array(z.unknown()).optional()
}).passthrough();

export const SavePayloadSchema = z.object({
    saveVersion: z.number().int().nonnegative().optional(),
    savedAt: finiteNumber.optional(),
    player: PlayerSliceSchema.nullable().optional(),
    world: WorldSliceSchema.nullable().optional(),
    finance: FinanceSliceSchema.nullable().optional(),
    clinical: ClinicalSliceSchema.nullable().optional(),
    publicHealth: PublicHealthSliceSchema.nullable().optional(),
    staff: StaffSliceSchema.nullable().optional()
}).passthrough();

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asFiniteNumber(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clampInteger(value, fallback, min, max) {
    const safeValue = Math.trunc(asFiniteNumber(value, fallback));
    return Math.min(max, Math.max(min, safeValue));
}

function normalizeWorld(world) {
    const nextWorld = isPlainObject(world) ? { ...world } : {};
    nextWorld.day = clampInteger(nextWorld.day, INITIAL_TIME_STATE.day, 1, 999999);
    nextWorld.time = clampInteger(nextWorld.time, INITIAL_TIME_STATE.time, 0, 1439);
    nextWorld.speed = Math.max(0, asFiniteNumber(nextWorld.speed, INITIAL_TIME_STATE.speed));
    nextWorld.isPaused = typeof nextWorld.isPaused === 'boolean' ? nextWorld.isPaused : INITIAL_TIME_STATE.isPaused;
    return nextWorld;
}

function normalizePlayer(player, legacyProfile, legacyReputation) {
    if (!isPlainObject(player) && !isPlainObject(legacyProfile) && typeof legacyReputation === 'undefined') {
        return null;
    }

    const profile = {
        ...(isPlainObject(player?.profile) ? player.profile : {}),
        ...(isPlainObject(legacyProfile) ? legacyProfile : {})
    };

    if (typeof profile.reputation === 'undefined' && typeof legacyReputation !== 'undefined') {
        profile.reputation = legacyReputation;
    }

    return {
        ...(isPlainObject(player) ? player : {}),
        profile: {
            ...INITIAL_PLAYER_STATE,
            ...profile
        }
    };
}

export function buildCanonicalSavePayload(rawSave) {
    if (!isPlainObject(rawSave)) return null;

    const payload = isPlainObject(rawSave.saveData)
        ? rawSave.saveData
        : isPlainObject(rawSave._raw)
            ? rawSave._raw
            : rawSave;

    if (!isPlainObject(payload)) return null;

    const canonicalSave = {
        ...payload,
        saveVersion: Number.isInteger(payload.saveVersion) ? payload.saveVersion : CURRENT_SAVE_VERSION,
        savedAt: asFiniteNumber(payload.savedAt, Date.now()),
        world: normalizeWorld(payload.world)
    };

    if ((canonicalSave.world.day === INITIAL_TIME_STATE.day || canonicalSave.world.day == null) && typeof payload.day !== 'undefined') {
        canonicalSave.world.day = clampInteger(payload.day, INITIAL_TIME_STATE.day, 1, 999999);
    }

    const player = normalizePlayer(payload.player, payload.profile, payload.reputation);
    if (player) {
        canonicalSave.player = player;
    }

    delete canonicalSave.profile;
    delete canonicalSave.day;
    delete canonicalSave.reputation;

    return canonicalSave;
}

export function parseSavePayload(rawSave) {
    const canonicalSave = buildCanonicalSavePayload(rawSave);
    if (!canonicalSave) return null;

    const parsed = SavePayloadSchema.safeParse(canonicalSave);
    if (!parsed.success) {
        const issues = parsed.error.issues
            .slice(0, 3)
            .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
            .join('; ');
        console.warn(`[SavePayload] Invalid save rejected: ${issues}`);
        return null;
    }

    return {
        ...parsed.data,
        saveVersion: CURRENT_SAVE_VERSION,
        savedAt: asFiniteNumber(parsed.data.savedAt, Date.now()),
        world: normalizeWorld(parsed.data.world),
        clinical: parsed.data.clinical
            ? {
                ...parsed.data.clinical,
                history: Array.isArray(parsed.data.clinical.history)
                    ? parsed.data.clinical.history.slice(-MAX_CLINICAL_HISTORY)
                    : parsed.data.clinical.history
            }
            : null,
        player: parsed.data.player
            ? {
                ...parsed.data.player,
                profile: {
                    ...INITIAL_PLAYER_STATE,
                    ...(parsed.data.player.profile || {})
                }
            }
            : null
    };
}

export function createSaveSnapshot(state) {
    return parseSavePayload({
        saveVersion: CURRENT_SAVE_VERSION,
        player: state.player,
        world: state.world,
        finance: state.finance,
        clinical: state.clinical,
        publicHealth: state.publicHealth,
        staff: state.staff,
        savedAt: Date.now()
    });
}
