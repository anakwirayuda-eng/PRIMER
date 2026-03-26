/**
 * Archive building helpers for store.
 * Pure functions only — NO store imports.
 */
import { selectDerivedFinance } from '../selectors.js';
import {
    getHistoryForDay, getEncounterAction, isEncounterCorrect,
    hasCorrectDiagnosis, hasAntibioticMedication, calculateEncounterRevenue
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
            const joinedAt = Number(entry?.joinedAt ?? 480);
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
        const diagnosisName = entry?.medicalData?.diagnosisName
            || entry?.medicalData?.trueDiagnosisCode
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

export function buildDailyArchiveEntry(state, day) {
    const dayHistory = getHistoryForDay(state?.clinical?.history, day);
    const patientSatisfaction = dayHistory
        .map((entry) => entry?.satisfactionScore)
        .filter((score) => Number.isFinite(score));

    const dailyKpi = {
        totalPatients: dayHistory.length,
        correctDiagnoses: dayHistory.filter(hasCorrectDiagnosis).length,
        referrals: dayHistory.filter((entry) => getEncounterAction(entry) === 'refer').length,
        nonSpecialisticReferrals: dayHistory.filter((entry) => getEncounterAction(entry) === 'refer' && !isEncounterCorrect(entry)).length,
        treatedCases: dayHistory.filter((entry) => ['treat', 'delegate_to_maia'].includes(getEncounterAction(entry))).length,
        inappropriateTreat: dayHistory.filter((entry) => getEncounterAction(entry) === 'treat' && !isEncounterCorrect(entry)).length,
        antibioticPrescriptions: dayHistory.filter(hasAntibioticMedication).length,
        rationalAntibiotics: dayHistory.filter((entry) => hasAntibioticMedication(entry) && isEncounterCorrect(entry)).length,
        patientSatisfaction,
        bpjsPatients: dayHistory.filter((entry) => Boolean(entry?.social?.hasBPJS)).length,
        umumPatients: dayHistory.filter((entry) => !entry?.social?.hasBPJS).length
    };

    const derivedDailyFinance = selectDerivedFinance({
        finance: {
            stats: INITIAL_FINANCE_STATS,
            kpi: dailyKpi
        }
    });

    return {
        day,
        patientsToday: dayHistory.length,
        revenue: dayHistory.reduce((total, entry) => total + calculateEncounterRevenue(entry), 0),
        reputation: Math.round(Number(state?.player?.profile?.reputation) || 0),
        overallScore: derivedDailyFinance.overallScore,
        hourlyTraffic: buildHourlyTraffic(dayHistory),
        topDiseases: buildTopDiseases(dayHistory)
    };
}

export function buildMonthlyArchiveEntry(state, accreditation, hiredStaff) {
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
    const monthlyKapitasi = 50000000 * (ACCREDITATION_MULTIPLIER[accreditation] || 1.0);
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
