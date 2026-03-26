/**
 * Ambulance state helpers for store.
 * Pure functions only — NO store imports.
 */
import { toAbsoluteWorldMinutes } from './storeUtils.js';

export const createBusyAmbulanceEntry = (ambulanceId, day, time, durationMinutes) => {
    const busyUntilTotal = toAbsoluteWorldMinutes(day, time) + Math.max(0, Number(durationMinutes) || 0);
    return {
        id: ambulanceId,
        busyUntilTotal,
        busyUntilDay: Math.floor(busyUntilTotal / 1440) + 1,
        busyUntilTime: busyUntilTotal % 1440
    };
};

export const isAmbulanceStillBusy = (item, day, time) => {
    const currentTotal = toAbsoluteWorldMinutes(day, time);

    if (Number.isFinite(Number(item?.busyUntilTotal))) {
        return currentTotal < Number(item.busyUntilTotal);
    }

    if (
        Number.isFinite(Number(item?.busyUntilDay)) &&
        Number.isFinite(Number(item?.busyUntilTime))
    ) {
        return currentTotal < toAbsoluteWorldMinutes(item.busyUntilDay, item.busyUntilTime);
    }

    return (Number(time) || 0) < (Number(item?.busyUntil) || 0);
};
