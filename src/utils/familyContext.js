/**
 * @reflection
 * [IDENTITY]: familyContext
 * [PURPOSE]: Resolve UKM context (PIS-PK score, recent home visits, linked
 *            behavior-change case, SDOH risk flags) for a clinical patient so
 *            the EMR sidebar can surface "continuity of care" — bridging the
 *            UKM (community) and UKP (individual clinical) sides of Puskesmas.
 * [STATE]: Production
 * [ANCHOR]: getFamilyContextForPatient
 * [DEPENDS_ON]: pisPkIndicators (canonical engine)
 * [LAST_UPDATE]: 2026-04-23
 */

import {
    calculateFamilyIKSPisPk,
    classifyFamilyIKS,
} from '../domains/village/pisPkIndicators.js';

const MAX_RECENT_VISITS = 5;

// Map ledger entryType → display label / icon
const LEDGER_ENTRY_META = {
    home_visit: { label: 'Kunjungan Rumah', icon: '🏠' },
    immunization: { label: 'Imunisasi', icon: '💉' },
    posyandu: { label: 'Posyandu', icon: '👶' },
    prolanis: { label: 'Prolanis', icon: '💊' },
    discharge: { label: 'Rawat Jalan Klinik', icon: '🏥' },
};

/**
 * Resolve patient→family linkage. Tries several fields in order:
 *   social.familyId → hidden.familyId → null.
 */
export function resolvePatientFamilyId(patient) {
    if (!patient || typeof patient !== 'object') return null;
    const fromSocial = patient.social?.familyId;
    if (typeof fromSocial === 'string' && fromSocial.length > 0) return fromSocial;
    const fromHidden = patient.hidden?.familyId;
    if (typeof fromHidden === 'string' && fromHidden.length > 0) return fromHidden;
    return null;
}

/**
 * Classify SDOH + indicator gaps into short labels for the EMR header.
 */
function deriveRiskFlags(family) {
    const flags = [];
    const indicators = family?.indicators || {};
    const sdoh = family?.sdoh || {};

    if (indicators.jkn === false) flags.push({ id: 'no_jkn', label: 'Tanpa JKN', severity: 'warning' });
    if (indicators.jamban === false) flags.push({ id: 'no_jamban', label: 'Jamban tidak sehat', severity: 'warning' });
    if (indicators.air === false) flags.push({ id: 'no_air', label: 'Air tidak bersih', severity: 'warning' });
    if (indicators.rokok === false) flags.push({ id: 'perokok', label: 'Ada perokok', severity: 'warning' });
    if (indicators.jentik === false) flags.push({ id: 'jentik', label: 'Ada jentik', severity: 'warning' });

    // SDOH red flags (if available on family/member)
    if (sdoh.economy === 'Very Low' || sdoh.economy === 'Low') {
        flags.push({ id: 'ekonomi', label: 'Ekonomi rendah', severity: 'danger' });
    }
    if (sdoh.housing === 'Make-shift') {
        flags.push({ id: 'rumah', label: 'Rumah non-permanen', severity: 'danger' });
    }

    return flags;
}

/**
 * Filter the village ledger for the most recent entries touching this family.
 * Entries are expected to have shape { familyId, type, day, details, at }.
 */
function collectRecentVisits(ledger, familyId, limit = MAX_RECENT_VISITS) {
    if (!Array.isArray(ledger) || !familyId) return [];
    const entries = ledger
        .filter((e) => e && e.familyId === familyId)
        .slice()
        .sort((a, b) => {
            const aDay = Number(a.day) || 0;
            const bDay = Number(b.day) || 0;
            if (bDay !== aDay) return bDay - aDay;
            return Number(b.at || 0) - Number(a.at || 0);
        });
    return entries.slice(0, limit).map((entry) => {
        const meta = LEDGER_ENTRY_META[entry.type] || { label: entry.type, icon: '📝' };
        const actionLabel = entry.details?.actionLabel || entry.details?.action || null;
        return {
            day: Number(entry.day) || null,
            type: entry.type,
            label: meta.label,
            icon: meta.icon,
            actionLabel,
            indicators: entry.details?.indicatorsUpdated || null,
        };
    });
}

/**
 * Resolve UKM context for a patient. Returns null when patient isn't linked to
 * a village family (walk-in outsiders, anonymous cases, etc.). Otherwise:
 *   {
 *     family,         // the family object
 *     pisPk,          // { iks, fulfilled, applicable, breakdown, ... }
 *     tier,           // 'sehat' | 'pra_sehat' | 'tidak_sehat'
 *     recentVisits,   // up to MAX_RECENT_VISITS ledger entries
 *     linkedBcCase,   // { scenarioId, title, outcomeBadge } or null
 *     riskFlags,      // array of { id, label, severity }
 *   }
 *
 * @param {Object} patient
 * @param {Object} villageData — { families, readinessState, ... }
 * @param {Array}  ledger      — publicHealth.villageLedger
 * @param {Object} [options]
 * @param {Object} [options.scenarios] — optional { byId: Record<id, scenarioDef> }
 */
export function getFamilyContextForPatient(patient, villageData, ledger, options = {}) {
    const familyId = resolvePatientFamilyId(patient);
    if (!familyId) return null;

    const families = Array.isArray(villageData?.families) ? villageData.families : [];
    const family = families.find((f) => f && f.id === familyId);
    if (!family) return null;

    const pisPk = calculateFamilyIKSPisPk(family);
    const tier = classifyFamilyIKS(pisPk.iks);
    const recentVisits = collectRecentVisits(ledger, familyId);
    const riskFlags = deriveRiskFlags(family);

    // Linked BC case: either "patient is a UKP-bridge" (failed BC → clinical
    // consequence), or the family currently has an active BC case. Bridge
    // signal wins because it's more actionable (surfaces cause-of-visit).
    let linkedBcCase = null;
    const bridgeScenarioId = patient?.hidden?.bcScenarioId;
    const activeScenarioId = family.activeScenarioId;
    const scenariosById = options.scenarios?.byId || null;
    if (bridgeScenarioId || activeScenarioId) {
        const id = bridgeScenarioId || activeScenarioId;
        const def = scenariosById ? scenariosById[id] : null;
        linkedBcCase = {
            scenarioId: id,
            title: def?.title || id,
            outcomeBadge: bridgeScenarioId ? 'bridged_from_fail' : 'active',
            isBridge: Boolean(bridgeScenarioId),
        };
    }

    return {
        family,
        pisPk,
        tier,
        recentVisits,
        linkedBcCase,
        riskFlags,
        familyId,
    };
}

// Map risk flag id → actionable teaching note for MAIA clinical reasoning.
// Keep notes short + doctor-ready (what to do, not jargon).
const TEACHING_NOTES = {
    no_jkn: 'Belum ada JKN. Bantu daftarkan BPJS saat edukasi; dorong Kartu Indonesia Sehat untuk cegah biaya katastropik.',
    no_jamban: 'Jamban keluarga tidak sehat. Tingkatkan kecurigaan penyakit fecal-oral; edukasi CTPS + STBM + rujuk program Pamsimas.',
    no_air: 'Sumber air tidak bersih. Skrining diare/penyakit kulit; edukasi klorinasi/rebus air + rujuk sanitasi lingkungan.',
    perokok: 'Ada anggota keluarga merokok. Skrining ISPA/asma pada anak; konseling Upaya Berhenti Merokok (UBM).',
    jentik: 'Rumah positif jentik. Skrining DBD/malaria sesuai musim; aktifkan 3M Plus + koordinasi Juru Pemantau Jentik.',
    ekonomi: 'Ekonomi keluarga rendah. Pertimbangkan obat BPJS/generik, rujukan sosial (PKH/BLT), cegah drop-out treatment.',
    rumah: 'Hunian non-permanen. Faktor risiko sanitasi + kepadatan; prioritaskan follow-up kunjungan rumah.',
};

/**
 * Build actionable SDOH teaching notes that MAIA can surface during EMR review.
 * Returns an empty array when the patient has no village linkage (outside
 * visitors) or the family has no relevant gaps — keeps MAIA quiet when there
 * is nothing to learn from SDOH.
 *
 * @param {Object} context - output of getFamilyContextForPatient
 * @returns {Array<{id:string,label:string,note:string,severity:'warning'|'danger'}>}
 */
export function deriveSdohTeachingNotes(context) {
    if (!context || !Array.isArray(context.riskFlags)) return [];
    return context.riskFlags
        .map((flag) => {
            const note = TEACHING_NOTES[flag.id];
            if (!note) return null;
            return {
                id: flag.id,
                label: flag.label,
                severity: flag.severity,
                note,
            };
        })
        .filter(Boolean);
}

export default {
    resolvePatientFamilyId,
    getFamilyContextForPatient,
    deriveSdohTeachingNotes,
};
