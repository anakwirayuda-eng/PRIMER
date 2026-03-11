/**
 * @reflection
 * [IDENTITY]: GameCore
 * [PURPOSE]: Pure game mechanics extracted for headless simulation and logic consistency.
 * [STATE]: Stable
 */

import { createDeterministicSequence, seedKey } from '../utils/deterministicRandom.js';

export const INITIAL_PLAYER_STATE = {
    name: 'Dr. Anonim',
    avatar: 'default',
    gender: 'L',
    level: 1,
    xp: 0,
    energy: 100,
    maxEnergy: 100,
    spirit: 100,
    reputation: 80,
    stress: 0,
    skills: [],
    hygiene: 100,
    morningStatus: null, // 'groggy', 'refreshed'
    loungeRestCount: 0,
    lastLoungeDay: -1
};

export const INITIAL_TIME_STATE = {
    day: 1,
    time: 420, // 07:00
    isPaused: false,
    speed: 1,
};

export const calculateIKS = (indicators) => {
    const keys = Object.keys(indicators);
    if (keys.length === 0) return 0;
    const trueCount = keys.filter(k => indicators[k] === true).length;
    return Math.round((trueCount / keys.length) * 100) / 100;
};

export const calculateGlobalBuffs = (state) => {
    const hiredStaff = state.staff?.hiredStaff || [];
    const facilities = state.finance?.facilities || { poli_umum: 1 };
    const skills = state.player?.profile?.skills || [];

    const buffs = {
        labSpeed: 0,
        referralTime: 0,
        patientSatisfaction: 0,
        prolanisBonus: 0,
        childNutrition: 0,
        psnCoverage: 0,
        labCostReduction: (facilities.lab || 0) * 0.1,
        medicineCostReduction: Math.max(0, (facilities.poli_umum || 1) - 1) * 0.05,
        maxQueueCapacity: 12 + (facilities.poli_umum - 1) * 3,
        accuracyBonus: skills.includes('diagnosis_1') ? 5 : 0,
        energyEfficiency: skills.includes('stamina_1') ? 2 : 0,
        stressReduction: skills.includes('stress_mgmt') ? 2 : 0
    };

    hiredStaff.forEach(staff => {
        if ((staff.morale || 70) < 20) return;
        const moraleMultiplier = staff.morale >= 80 ? 1.1 : staff.morale >= 50 ? 1.0 : 0.9;
        if (staff.effects) {
            Object.entries(staff.effects).forEach(([key, val]) => {
                if (typeof val === 'number' && Object.prototype.hasOwnProperty.call(buffs, key)) {
                    buffs[key] += Math.round(val * moraleMultiplier);
                }
            });
        }
    });

    return buffs;
};

export const advanceTime = (currentTime, currentDay, minutes = 1) => {
    let nextTime = currentTime + minutes;
    let nextDay = currentDay;
    if (nextTime >= 1440) {
        nextTime = nextTime % 1440;
        nextDay += 1;
    }
    return { time: nextTime, day: nextDay };
};

export const calculateXpGain = (currentXp, amount) => {
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;
    return { xp: newXp, level: newLevel };
};

export const calculateSleepRecovery = (currentTime, targetHour, currentEnergy, currentStress) => {
    const sleepHour = Math.floor(currentTime / 60);
    const wakeHour = targetHour;
    let sleepDuration = (wakeHour > sleepHour) ? (wakeHour - sleepHour) : ((24 - sleepHour) + wakeHour);
    const isGroggy = sleepDuration < 6 || wakeHour < 5;

    return {
        energy: isGroggy ? 70 : 100,
        stress: Math.max(0, currentStress - (isGroggy ? 10 : 30)),
        status: isGroggy ? 'groggy' : 'refreshed',
        wakeTime: wakeHour * 60,
        isNextDay: wakeHour <= sleepHour
    };
};

export const calculateDailyStaffDecay = (hiredStaff, rngOrSeed = 'default') => {
    const next = typeof rngOrSeed === 'function'
        ? rngOrSeed
        : createDeterministicSequence(
            seedKey(
                'staff-decay',
                rngOrSeed,
                hiredStaff.map(st => st.id || st.name || st.role || 'staff')
            )
        ).nextFloat;

    return hiredStaff.map(st => ({
        ...st,
        morale: Math.max(0, (st.morale || 70) - (next() * 5 + 2))
    }));
};
