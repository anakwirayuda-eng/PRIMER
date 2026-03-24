/**
 * @reflection
 * [IDENTITY]: useStaffManagement
 * [PURPOSE]: Custom hook to encapsulate staff-related business logic (hiring, firing, coaching).
 * [STATE]: Experimental
 * [ANCHOR]: useStaffManagement
 * [DEPENDS_ON]: GameContext
 */

import { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { seededBetween } from '../utils/deterministicRandom.js';
import { canAffordOperationalCost, getAvailableOperationalFunds, spendOperationalFunds } from '../utils/operationalFunds.js';

export const useStaffManagement = () => {
    const {
        stats, setStats,
        hiredStaff, setHiredStaff,
        day, coachStaff
    } = useGame();

    // Confirmation state for firing (replaces window.confirm for immersion)
    const [pendingFireStaffId, setPendingFireStaffId] = useState(null);

    const hireStaff = (staff) => {
        const cost = staff.salary * 3; // 3 months salary as hiring cost
        if (canAffordOperationalCost(stats, cost)) {
            setStats(prev => spendOperationalFunds(prev, cost) || prev);
            setHiredStaff(prev => [
                ...prev,
                {
                    ...staff,
                    hiredDay: day,
                    performance: seededBetween(`staff-hire:${staff.id}:${day}`, 70, 90),
                    morale: 100 // New hires start with full morale
                }
            ]);
            return { success: true, message: `Berhasil merekrut ${staff.name}!` };
        } else {
            return { success: false, message: 'Dana aktif tidak cukup untuk merekrut staff ini!' };
        }
    };

    const fireStaff = (staffId) => {
        // Stage 1: set pending — UI should render confirmation modal
        setPendingFireStaffId(staffId);
    };

    const confirmFireStaff = () => {
        if (pendingFireStaffId) {
            setHiredStaff(prev => prev.filter(s => s.id !== pendingFireStaffId));
            setPendingFireStaffId(null);
            return true;
        }
        return false;
    };

    const cancelFireStaff = () => {
        setPendingFireStaffId(null);
    };

    const runCoaching = (staffId) => {
        const result = coachStaff(staffId);
        return result;
    };

    const monthlySalaryTotal = hiredStaff.reduce((sum, s) => sum + s.salary, 0);

    return {
        hiredStaff,
        hireStaff,
        fireStaff,
        confirmFireStaff,
        cancelFireStaff,
        pendingFireStaffId,
        runCoaching,
        monthlySalaryTotal,
        currentDay: day,
        availableCapital: getAvailableOperationalFunds(stats)
    };
};
