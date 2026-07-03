/**
 * Archive building helpers for store.
 * Pure functions only — NO store imports.
 */
import { selectDerivedFinance } from '../selectors.js';
import {
    getHistoryForDay, getEncounterAction,
    hasCorrectDiagnosis, calculateEncounterRevenue, isAntibioticMed
} from './clinicalHelpers.js';

const INITIAL_FINANCE_STATS = {
    kapitasi: 50000000,
    pendapatanUmum: 0,
    pengeluaranObat: 0,
    pengeluaranLab: 0,
    pengeluaranOperasional: 0
};

const ACCREDITATION_MULTIPLIER = {
    Dasar: 1.0,
    Madya: 1.1,
    Utama: 1.25,
    Paripurna: 1.5
};

function buildHourlyTraffic(dayHistory) {
    return Array.from({ length: 9 }, (_, index) => {
        const hour = index + 8;
        const start = hour * 60;
        const end = (hour + 1) * 60;
        const value = dayHistory.filter((entry) => {
            const joinedAt = Number(entry?.joinedAt ?? entry?.arrivalTime ?? 480);
            return joinedAt >= start && joinedAt < end;
        }).length;

        return {
            label: `${hour < 10 ? '0' : ''}${hour}:00`,
            value
        };
    });
}

function buildTopDiseases(dayHistory) {
    const diseaseCounts = {};
    dayHistory.forEach((entry) => {
        const diagnosisName = entry?.diagnosisName
            || entry?.medicalData?.diagnosisName
            || entry?.medicalData?.trueDiagnosisCode
            || entry?.correctDiagnosis
            || entry?.diagnosis
            || 'Undiagnosed';
        diseaseCounts[diagnosisName] = (diseaseCounts[diagnosisName] || 0) + 1;
    });

    return Object.entries(diseaseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
            name,
            count,
            percent: Math.round((count / Math.max(dayHistory.length, 1)) * 100)
        }));
}

function resolveEncounterJoinedAt(entry) {
    const value = Number(entry?.joinedAt ?? entry?.arrivalTime ?? 480);
    return Number.isFinite(value) ? value : 480;
}

function resolveEncounterDiagnosisName(entry) {
    return entry?.diagnosisName
        || entry?.medicalData?.diagnosisName
        || entry?.medicalData?.trueDiagnosisCode
        || entry?.correctDiagnosis
        || entry?.diagnosis
        || 'Undiagnosed';
}

function resolveEncounterFacility(entry) {
    return entry?.facility || entry?.serviceId || (entry?.isEmergency ? 'igd' : 'poli_umum');
}

function normalizeArchiveEncounterFromHistory(entry) {
    const action = getEncounterAction(entry);

    return {
        patientId: entry?.id || null,
        patientName: entry?.name || 'Pasien',
        age: entry?.age,
        gender: entry?.gender,
        diagnosis: entry?.medicalData?.trueDiagnosisCode || entry?.decision?.diagnoses?.[0] || 'unknown',
        diagnosisName: resolveEncounterDiagnosisName(entry),
        action,
        completed: ['treat', 'delegate_to_maia'].includes(action),
        referred: action === 'refer',
        missed: false,
        leftWithoutService: false,
        wasCorrect: hasCorrectDiagnosis(entry),
        diagnosisScore: hasCorrectDiagnosis(entry) ? 100 : 0,
        revenue: calculateEncounterRevenue(entry),
        joinedAt: resolveEncounterJoinedAt(entry),
        facility: resolveEncounterFacility(entry),
        medications: (entry?.decision?.medications || []).map((medication) => (typeof medication === 'object' ? (medication.id || medication.medId) : medication)),
        hasBPJS: typeof entry?.social?.hasBPJS === 'boolean' ? entry.social.hasBPJS : null,
        satisfactionScore: Number.isFinite(entry?.satisfactionScore) ? Number(entry.satisfactionScore) : null,
        reason: null
    };
}

function normalizeArchiveEncounterFromTodayLog(entry) {
    return {
        patientId: entry?.patientId || null,
        patientName: entry?.patientName || entry?.name || 'Pasien',
        age: entry?.age,
        gender: entry?.gender,
        diagnosis: entry?.diagnosis || 'unknown',
        diagnosisName: resolveEncounterDiagnosisName(entry),
        action: entry?.action || null,
        completed: Boolean(entry?.completed),
        referred: Boolean(entry?.referred),
        missed: Boolean(entry?.missed || entry?.leftWithoutService),
        leftWithoutService: Boolean(entry?.leftWithoutService),
        wasCorrect: entry?.wasCorrect === true || Number(entry?.diagnosisScore) >= 80,
        diagnosisScore: Number(entry?.diagnosisScore) || 0,
        revenue: Number(entry?.revenue) || 0,
        joinedAt: resolveEncounterJoinedAt(entry),
        facility: resolveEncounterFacility(entry),
        medications: Array.isArray(entry?.medications) ? entry.medications : [],
        hasBPJS: typeof entry?.hasBPJS === 'boolean' ? entry.hasBPJS : null,
        satisfactionScore: Number.isFinite(entry?.satisfactionScore) ? Number(entry.satisfactionScore) : null,
        reason: entry?.reason || null
    };
}

function buildArchiveEncounterSignature(entry) {
    if (entry?.patientId) {
        return [
            'id',
            entry.patientId,
            entry.action || '',
            entry.reason || '',
            entry.facility || ''
        ].join('|');
    }

    return [
        entry?.patientName || 'Pasien',
        entry?.age ?? '',
        entry?.gender ?? '',
        entry?.diagnosis || '',
        entry?.action || '',
        entry?.reason || '',
        entry?.facility || '',
        entry?.joinedAt ?? 480
    ].join('|');
}

function pickDefined(preferred, fallback) {
    return preferred !== undefined && preferred !== null ? preferred : fallback;
}

function mergeArchiveEncounter(existing, incoming) {
    return {
        ...existing,
        ...incoming,
        patientId: pickDefined(incoming?.patientId, existing?.patientId),
        patientName: incoming?.patientName || existing?.patientName || 'Pasien',
        age: pickDefined(incoming?.age, existing?.age),
        gender: incoming?.gender || existing?.gender,
        diagnosis: incoming?.diagnosis || existing?.diagnosis || 'unknown',
        diagnosisName: incoming?.diagnosisName || existing?.diagnosisName || 'Undiagnosed',
        action: incoming?.action || existing?.action || null,
        completed: typeof incoming?.completed === 'boolean' ? incoming.completed : existing?.completed,
        referred: typeof incoming?.referred === 'boolean' ? incoming.referred : existing?.referred,
        missed: typeof incoming?.missed === 'boolean' ? incoming.missed : existing?.missed,
        leftWithoutService: typeof incoming?.leftWithoutService === 'boolean' ? incoming.leftWithoutService : existing?.leftWithoutService,
        wasCorrect: typeof incoming?.wasCorrect === 'boolean' ? incoming.wasCorrect : existing?.wasCorrect,
        diagnosisScore: Number.isFinite(incoming?.diagnosisScore) ? Number(incoming.diagnosisScore) : (Number(existing?.diagnosisScore) || 0),
        revenue: Number.isFinite(incoming?.revenue) ? Number(incoming.revenue) : (Number(existing?.revenue) || 0),
        joinedAt: Number.isFinite(incoming?.joinedAt) ? Number(incoming.joinedAt) : resolveEncounterJoinedAt(existing),
        facility: incoming?.facility || existing?.facility || 'poli_umum',
        medications: Array.isArray(incoming?.medications) && incoming.medications.length > 0
            ? incoming.medications
            : (Array.isArray(existing?.medications) ? existing.medications : []),
        hasBPJS: typeof incoming?.hasBPJS === 'boolean' ? incoming.hasBPJS : existing?.hasBPJS,
        satisfactionScore: Number.isFinite(incoming?.satisfactionScore) ? Number(incoming.satisfactionScore) : existing?.satisfactionScore,
        reason: incoming?.reason || existing?.reason || null
    };
}

function buildDailyEncounterLog(state, day) {
    const dayHistory = getHistoryForDay(state?.clinical?.history, day).map(normalizeArchiveEncounterFromHistory);
    const todayLog = Array.isArray(state?.clinical?.todayLog)
        ? state.clinical.todayLog
            .filter((entry) => typeof entry?.action === 'string' && entry.action.length > 0)
            .map(normalizeArchiveEncounterFromTodayLog)
        : [];

    const seen = new Set();
    const merged = [];

    [...dayHistory, ...todayLog].forEach((entry) => {
        const signature = buildArchiveEncounterSignature(entry);
        if (!seen.has(signature)) {
            seen.add(signature);
            merged.push(entry);
            return;
        }

        const existingIndex = merged.findIndex((candidate) => buildArchiveEncounterSignature(candidate) === signature);
        if (existingIndex >= 0) {
            merged[existingIndex] = mergeArchiveEncounter(merged[existingIndex], entry);
        }
    });

    return merged;
}

export function buildDailyArchiveEntry(state, day) {
    const encounterLog = buildDailyEncounterLog(state, day);
    const patientSatisfaction = encounterLog
        .map((entry) => entry?.satisfactionScore)
        .filter((score) => Number.isFinite(score));

    const dailyKpi = {
        totalPatients: encounterLog.length,
        correctDiagnoses: encounterLog.filter((entry) => entry?.wasCorrect || (entry?.diagnosisScore || 0) >= 80).length,
        referrals: encounterLog.filter((entry) => entry?.referred || entry?.action === 'refer').length,
        nonSpecialisticReferrals: encounterLog.filter((entry) => (entry?.referred || entry?.action === 'refer') && !(entry?.wasCorrect || (entry?.diagnosisScore || 0) >= 80)).length,
        treatedCases: encounterLog.filter((entry) => ['treat', 'delegate_to_maia'].includes(entry?.action)).length,
        inappropriateTreat: encounterLog.filter((entry) => entry?.action === 'treat' && !(entry?.wasCorrect || (entry?.diagnosisScore || 0) >= 80)).length,
        antibioticPrescriptions: encounterLog.filter((entry) => (entry?.medications || []).some((medication) => isAntibioticMed(typeof medication === 'object' ? (medication.id || medication.medId) : medication))).length,
        rationalAntibiotics: encounterLog.filter((entry) => (entry?.medications || []).some((medication) => isAntibioticMed(typeof medication === 'object' ? (medication.id || medication.medId) : medication)) && (entry?.wasCorrect || (entry?.diagnosisScore || 0) >= 80)).length,
        patientSatisfaction,
        bpjsPatients: encounterLog.filter((entry) => entry?.hasBPJS === true).length,
        umumPatients: encounterLog.filter((entry) => entry?.hasBPJS === false).length
    };

    const derivedDailyFinance = selectDerivedFinance({
        finance: {
            stats: INITIAL_FINANCE_STATS,
            kpi: dailyKpi
        }
    });

    return {
        day,
        patientsToday: encounterLog.length,
        revenue: encounterLog.reduce((total, entry) => total + (Number(entry?.revenue) || 0), 0),
        reputation: Math.round(Number(state?.player?.profile?.reputation) || 0),
        overallScore: derivedDailyFinance.overallScore,
        hourlyTraffic: buildHourlyTraffic(encounterLog),
        topDiseases: buildTopDiseases(encounterLog)
    };
}

export function buildMonthlyArchiveEntry(state, accreditation, hiredStaff, overrides = {}) {
    const completedMonth = Math.max(1, Math.floor((Number(state?.world?.day) - 1) / 30));
    const monthStartDay = ((completedMonth - 1) * 30) + 1;
    const monthEndDay = completedMonth * 30;
    const relevantDailyReports = (state?.clinical?.dailyArchive || []).filter(
        (entry) => entry?.day >= monthStartDay && entry?.day <= monthEndDay
    );

    if (relevantDailyReports.length === 0) return null;

    const avgScore = Math.round(
        relevantDailyReports.reduce((total, entry) => total + (Number(entry?.overallScore) || 0), 0)
        / relevantDailyReports.length
    );
    const avgReputation = Math.round(
        relevantDailyReports.reduce((total, entry) => total + (Number(entry?.reputation) || 0), 0)
        / relevantDailyReports.length
    );
    const totalPatients = relevantDailyReports.reduce((total, entry) => total + (Number(entry?.patientsToday) || 0), 0);
    const totalDailyRevenue = relevantDailyReports.reduce((total, entry) => total + (Number(entry?.revenue) || 0), 0);
    const staffSalaries = Array.isArray(hiredStaff)
        ? hiredStaff.reduce((total, staffMember) => total + (Number(staffMember?.salary) || 0), 0)
        : 0;
    const recordedExpenses =
        (Number(state?.finance?.stats?.pengeluaranObat) || 0) +
        (Number(state?.finance?.stats?.pengeluaranLab) || 0) +
        (Number(state?.finance?.stats?.pengeluaranOperasional) || 0);
    const totalRecordedCosts = staffSalaries + recordedExpenses;
    const monthlyKapitasi = Number.isFinite(overrides?.monthlyKapitasi)
        ? overrides.monthlyKapitasi
        : 50000000 * (ACCREDITATION_MULTIPLIER[accreditation] || 1.0);
    const totalRevenue = totalDailyRevenue + monthlyKapitasi;
    const netOperationalResult = totalRevenue - totalRecordedCosts;
    const previousReport = Array.isArray(state?.clinical?.monthlyArchive) && state.clinical.monthlyArchive.length > 0
        ? state.clinical.monthlyArchive[state.clinical.monthlyArchive.length - 1]
        : null;
    const trend = previousReport
        ? {
            score: avgScore - (Number(previousReport?.avgScore) || 0),
            revenue: totalRevenue - (Number(previousReport?.totalRevenue) || 0),
            totalRevenue: totalRevenue - (Number(previousReport?.totalRevenue) || 0),
            serviceRevenue: totalDailyRevenue - (Number(previousReport?.serviceRevenue) || 0),
            recordedExpenses: recordedExpenses - (Number(previousReport?.recordedExpenses) || 0),
            totalRecordedCosts: totalRecordedCosts - (
                Number(previousReport?.totalRecordedCosts)
                || ((Number(previousReport?.staffSalaries) || 0) + (Number(previousReport?.recordedExpenses) || 0))
            ),
            netOperationalResult: netOperationalResult - (
                Number(previousReport?.netOperationalResult)
                || (
                    (Number(previousReport?.totalRevenue) || 0) -
                    (
                        Number(previousReport?.totalRecordedCosts)
                        || ((Number(previousReport?.staffSalaries) || 0) + (Number(previousReport?.recordedExpenses) || 0))
                    )
                )
            )
        }
        : {};

    return {
        month: completedMonth,
        avgScore,
        avgReputation,
        totalPatients,
        serviceRevenue: totalDailyRevenue,
        monthlyKapitasi,
        totalRevenue,
        staffSalaries,
        recordedExpenses,
        totalRecordedCosts,
        netOperationalResult,
        trend
    };
}

export { INITIAL_FINANCE_STATS, ACCREDITATION_MULTIPLIER };
