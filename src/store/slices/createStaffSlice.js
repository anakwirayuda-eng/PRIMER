/**
 * @reflection
 * [IDENTITY]: createStaffSlice (CP2 extraction)
 * [PURPOSE]: Staff management state slice
 * [STATE]: Production
 * [CROSS_SLICE]: coachStaff writes player.profile.energy (cross-slice)
 * [DEPENDS_ON]: persistenceHelpers, publicHealthHelpers, SoundManager
 * [LAST_UPDATE]: 2026-03-27
 */
import { soundManager } from '../../utils/SoundManager.js';
import { createInitialStaffState } from '../helpers/persistenceHelpers.js';
import { applyStaffMoraleDecay } from '../helpers/publicHealthHelpers.js';

export const createStaffSlice = (set, get) => ({
    // --- STATE ---
    staff: createInitialStaffState(),

    // --- ACTIONS ---
    staffActions: {
        setHiredStaff: (val) => set(s => ({ staff: { ...s.staff, hiredStaff: typeof val === 'function' ? val(s.staff.hiredStaff) : val } })),
        coachStaff: (staffId, day) => {
            const s = get();
            const staff = s.staff.hiredStaff.find(st => st.id === staffId);
            if (!staff) return { success: false, message: 'Staff not found' };
            if (s.player.profile.energy < 10) { soundManager.playError(); return { success: false, message: 'Not enough energy' }; }
            // Cross-slice write: staff + player
            set(state => ({
                staff: { ...state.staff, hiredStaff: state.staff.hiredStaff.map(st => st.id === staffId ? { ...st, morale: Math.min(100, (st.morale || 70) + 15), lastCoached: day } : st) },
                player: { ...state.player, profile: { ...state.player.profile, energy: state.player.profile.energy - 10 } }
            }));
            soundManager.playSuccess();
            return { success: true, message: `${staff.name} motivated!` };
        },
        assignTask: (staffId, taskId, day) => {
            set(s => ({ staff: { ...s.staff, hiredStaff: s.staff.hiredStaff.map(st => st.id === staffId ? { ...st, currentTask: taskId, taskAssignedDay: day } : st) } }));
            soundManager.playConfirm();
            return { success: true, message: `Task assigned` };
        },
        processDailyDecay: () => {
            const day = get().world.day;
            set(s => ({
                staff: {
                    ...s.staff,
                    hiredStaff: applyStaffMoraleDecay(s.staff.hiredStaff, `staff-daily:${day}`)
                }
            }));
        },
        resetStaff: () => set(s => ({ staff: { ...s.staff, hiredStaff: [] } })),
    },
});
