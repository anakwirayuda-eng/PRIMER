/**
 * @reflection
 * [IDENTITY]: useStaffManagement
 * [PURPOSE]: Custom hook to encapsulate staff-related business logic (hiring, firing, coaching).
 * [STATE]: Experimental
 * [ANCHOR]: useStaffManagement
 * [DEPENDS_ON]: GameContext
 */

import { useGame } from '../context/GameContext.jsx';

export const useStaffManagement = () => {
    const {
        stats, setStats,
        hiredStaff, setHiredStaff,
        day, coachStaff
    } = useGame();

    const hireStaff = (staff) => {
        const cost = staff.salary * 3; // 3 months salary as hiring cost
        if (stats.kapitasi >= cost) {
            setStats(prev => ({
                ...prev,
                kapitasi: prev.kapitasi - cost
            }));
            setHiredStaff(prev => [
                ...prev,
                {
                    ...staff,
                    hiredDay: day,
                    performance: 70 + Math.random() * 20,
                    morale: 100 // New hires start with full morale
                }
            ]);
            return { success: true, message: `Berhasil merekrut ${staff.name}!` };
        } else {
            return { success: false, message: 'Dana kapitasi tidak cukup untuk merekrut staff ini!' };
        }
    };

    const fireStaff = (staffId) => {
        if (window.confirm('Apakah Anda yakin ingin memberhentikan staff ini?')) {
            setHiredStaff(prev => prev.filter(s => s.id !== staffId));
            return true;
        }
        return false;
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
        runCoaching,
        monthlySalaryTotal,
        currentDay: day,
        availableCapital: stats.kapitasi
    };
};
