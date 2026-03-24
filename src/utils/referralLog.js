const REFERRAL_ARRIVAL_NOTES = [
    'Satpam RS sudah buka portal. Serah terima lancar.',
    'Tim jaga menerima pasien tanpa drama.',
    'Berkas lengkap. Stempel basah didapat.',
    'Ambulans parkir miring sedikit, tapi pasien diterima.'
];

export const REFERRAL_ARRIVED_RETENTION_MINUTES = 60;

const toFiniteNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

export const toAbsoluteWorldMinutes = (day = 1, time = 0) => (
    (Math.max(1, Math.trunc(toFiniteNumber(day, 1))) - 1) * 1440
) + Math.max(0, Math.trunc(toFiniteNumber(time, 0)));

export const fromAbsoluteWorldMinutes = (totalMinutes = 0) => {
    const safeTotal = Math.max(0, Math.trunc(toFiniteNumber(totalMinutes, 0)));
    return {
        day: Math.floor(safeTotal / 1440) + 1,
        time: safeTotal % 1440
    };
};

const hashString = (value = '') => {
    let hash = 0;
    for (const char of String(value)) {
        hash = ((hash << 5) - hash) + char.charCodeAt(0);
        hash |= 0;
    }
    return Math.abs(hash);
};

const getFallbackTravelDurationMinutes = (entry = {}) => {
    const distance = Math.max(1, toFiniteNumber(entry.distance, 1));
    const multiplier = entry.ambulanceType === 'Advance' ? 1.5 : 2;
    return Math.max(1, Math.ceil(distance * multiplier));
};

export const pickReferralArrivalNote = (entry = {}) => {
    if (entry.arrivalNote) return entry.arrivalNote;

    const seed = [
        entry.patientId,
        entry.hospitalName,
        entry.diagnosisId,
        entry.ambulanceType
    ].filter(Boolean).join(':');

    const noteIndex = hashString(seed) % REFERRAL_ARRIVAL_NOTES.length;
    return REFERRAL_ARRIVAL_NOTES[noteIndex];
};

const normalizeReferralLogEntry = (entry, day = 1, time = 0) => {
    if (!entry || typeof entry !== 'object') return null;

    const sentDay = Math.max(1, Math.trunc(toFiniteNumber(entry.sentDay, day)));
    const timeSent = Math.max(0, Math.trunc(toFiniteNumber(entry.timeSent, time)));
    const sentAtTotal = Number.isFinite(Number(entry.sentAtTotal))
        ? Math.trunc(Number(entry.sentAtTotal))
        : toAbsoluteWorldMinutes(sentDay, timeSent);
    const travelDurationMinutes = Math.max(
        1,
        Math.ceil(
            Number.isFinite(Number(entry.travelDurationMinutes))
                ? Number(entry.travelDurationMinutes)
                : getFallbackTravelDurationMinutes(entry)
        )
    );
    const estimatedArrivalTotal = Number.isFinite(Number(entry.estimatedArrivalTotal))
        ? Math.trunc(Number(entry.estimatedArrivalTotal))
        : sentAtTotal + travelDurationMinutes;
    const status = entry.status === 'ARRIVED' ? 'ARRIVED' : 'EN_ROUTE';

    let arrivedAtTotal = null;
    if (status === 'ARRIVED') {
        arrivedAtTotal = Number.isFinite(Number(entry.arrivedAtTotal))
            ? Math.trunc(Number(entry.arrivedAtTotal))
            : estimatedArrivalTotal;
    }

    const arrivedPoint = arrivedAtTotal == null ? null : fromAbsoluteWorldMinutes(arrivedAtTotal);

    return {
        ...entry,
        id: entry.id || `ref_${entry.patientId || 'unknown'}_${sentAtTotal}`,
        patientId: entry.patientId || entry.id || `ref_${sentAtTotal}`,
        patientName: entry.patientName || entry.name || 'Pasien',
        hospitalName: entry.hospitalName || 'RS Rujukan',
        ambulanceType: entry.ambulanceType || 'Basic',
        distance: Math.max(0, toFiniteNumber(entry.distance, 0)),
        diagnosisId: entry.diagnosisId || '',
        diagnosis: entry.diagnosis || entry.diagnosisId || '',
        familyId: entry.familyId || null,
        sentDay,
        timeSent,
        sentAtTotal,
        travelDurationMinutes,
        estimatedArrivalTotal,
        status,
        arrivedAtTotal,
        arrivedDay: arrivedPoint?.day ?? entry.arrivedDay ?? null,
        arrivedTime: arrivedPoint?.time ?? entry.arrivedTime ?? null,
        arrivalNote: pickReferralArrivalNote(entry)
    };
};

export const buildReferralLogEntry = ({
    patient,
    hospital,
    ambulance,
    day,
    time,
    travelDurationMinutes
}) => {
    const sentAtTotal = toAbsoluteWorldMinutes(day, time);
    const resolvedTravelDuration = Math.max(
        1,
        Math.ceil(
            Number.isFinite(Number(travelDurationMinutes))
                ? Number(travelDurationMinutes)
                : getFallbackTravelDurationMinutes({
                    distance: hospital?.distance,
                    ambulanceType: ambulance?.type
                })
        )
    );

    return normalizeReferralLogEntry({
        id: `ref_${patient?.id || 'unknown'}_${sentAtTotal}`,
        patientId: patient?.id || `ref_${sentAtTotal}`,
        patientName: patient?.name || patient?.patientName || 'Pasien',
        familyId: patient?.hidden?.familyId || null,
        diagnosisId: patient?.medicalData?.trueDiagnosisCode || '',
        diagnosis: patient?.medicalData?.diagnosisName || patient?.medicalData?.trueDiagnosisCode || '',
        hospitalName: hospital?.name || 'RS Rujukan',
        distance: hospital?.distance || 0,
        ambulanceType: ambulance?.type || 'Basic',
        sentDay: day,
        timeSent: time,
        sentAtTotal,
        travelDurationMinutes: resolvedTravelDuration,
        estimatedArrivalTotal: sentAtTotal + resolvedTravelDuration,
        status: 'EN_ROUTE'
    }, day, time);
};

export const appendReferralLogEntry = (activeReferralLog, entry, day = 1, time = 0) => {
    const normalizedEntry = normalizeReferralLogEntry(entry, day, time);
    if (!normalizedEntry) {
        return Array.isArray(activeReferralLog) ? activeReferralLog : [];
    }

    const existing = Array.isArray(activeReferralLog) ? activeReferralLog : [];
    return [
        ...existing.filter((item) => (item?.patientId || item?.id) !== normalizedEntry.patientId),
        normalizedEntry
    ];
};

export const reconcileReferralLog = (
    activeReferralLog,
    day,
    time,
    retentionMinutes = REFERRAL_ARRIVED_RETENTION_MINUTES
) => {
    if (!Array.isArray(activeReferralLog) || activeReferralLog.length === 0) {
        return { activeReferralLog: [], newlyArrived: [] };
    }

    const currentTotal = toAbsoluteWorldMinutes(day, time);
    const deduped = new Map();

    activeReferralLog.forEach((entry) => {
        const normalized = normalizeReferralLogEntry(entry, day, time);
        if (!normalized) return;

        const key = normalized.patientId || normalized.id;
        const previous = deduped.get(key);
        if (!previous || normalized.sentAtTotal >= previous.sentAtTotal) {
            deduped.set(key, normalized);
        }
    });

    const orderedEntries = Array.from(deduped.values())
        .sort((left, right) => left.sentAtTotal - right.sentAtTotal);

    const nextEntries = [];
    const newlyArrived = [];

    orderedEntries.forEach((entry) => {
        if (entry.status === 'EN_ROUTE' && entry.estimatedArrivalTotal <= currentTotal) {
            const arrivalPoint = fromAbsoluteWorldMinutes(entry.estimatedArrivalTotal);
            const arrivedEntry = {
                ...entry,
                status: 'ARRIVED',
                arrivedAtTotal: entry.estimatedArrivalTotal,
                arrivedDay: arrivalPoint.day,
                arrivedTime: arrivalPoint.time
            };
            newlyArrived.push(arrivedEntry);
            nextEntries.push(arrivedEntry);
            return;
        }

        if (entry.status === 'ARRIVED') {
            const arrivedAtTotal = Number.isFinite(Number(entry.arrivedAtTotal))
                ? Math.trunc(Number(entry.arrivedAtTotal))
                : entry.estimatedArrivalTotal;

            if ((arrivedAtTotal + retentionMinutes) <= currentTotal) {
                return;
            }

            const arrivalPoint = fromAbsoluteWorldMinutes(arrivedAtTotal);
            nextEntries.push({
                ...entry,
                arrivedAtTotal,
                arrivedDay: entry.arrivedDay ?? arrivalPoint.day,
                arrivedTime: entry.arrivedTime ?? arrivalPoint.time
            });
            return;
        }

        nextEntries.push(entry);
    });

    return { activeReferralLog: nextEntries, newlyArrived };
};

export const getReferralProgress = (entry, day, time) => {
    const normalized = normalizeReferralLogEntry(entry, day, time);
    if (!normalized) return 0;
    if (normalized.status === 'ARRIVED') return 100;

    const currentTotal = toAbsoluteWorldMinutes(day, time);
    const elapsed = Math.max(0, currentTotal - normalized.sentAtTotal);
    const total = Math.max(1, normalized.estimatedArrivalTotal - normalized.sentAtTotal);
    return Math.max(0, Math.min(95, (elapsed / total) * 100));
};

export const formatClockMinutes = (timeMinutes) => {
    const safeMinutes = Math.max(0, Math.trunc(toFiniteNumber(timeMinutes, 0))) % 1440;
    const hours = String(Math.floor(safeMinutes / 60)).padStart(2, '0');
    const minutes = String(safeMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
};
