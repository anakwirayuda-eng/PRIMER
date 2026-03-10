/**
 * @reflection
 * [IDENTITY]: StaffPage
 * [PURPOSE]: React UI component: StaffPage.
 * [STATE]: Experimental
 * [ANCHOR]: StaffPage
 * [DEPENDS_ON]: GameContext, ThemeContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Users, UserPlus, Briefcase } from 'lucide-react';

// Modular Imports
import { AVAILABLE_STAFF } from '../data/StaffData.js';
import { useStaffManagement } from '../hooks/useStaffManagement.js';
import StaffCard from './staff/StaffCard.jsx';
import StaffDetail from './staff/StaffDetail.jsx';

export default function StaffPage() {
    const { playerStats, openWiki } = useGame();
    const { isDark } = useTheme();
    const {
        hiredStaff, hireStaff, fireStaff, runCoaching,
        monthlySalaryTotal, availableCapital: _availableCapital
    } = useStaffManagement();

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [activeTab, setActiveTab] = useState('available');

    const playerLevel = playerStats?.level || 1;

    const handleHire = (staff) => {
        const result = hireStaff(staff);
        if (result.success) {
            setSelectedStaff(null);
        } else {
            alert(result.message);
        }
    };

    const handleCoach = (staffId) => {
        const res = runCoaching(staffId);
        if (!res.success) alert(res.message);
    };

    return (
        <div className={`p-6 h-full overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <header className="mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <Users className="inline mr-2" size={28} />
                    Manajemen SDM (Squad)
                </h1>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Rekrut dan kelola tim Puskesmas Anda
                </p>
            </header>

            {/* Stats Bar */}
            <div className={`grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Staff</p>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{hiredStaff.length}</p>
                </div>
                <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gaji Bulanan</p>
                    <p className={`text-xl font-bold text-red-500`}>
                        Rp {(monthlySalaryTotal / 1000000).toFixed(1)}jt
                    </p>
                </div>
                <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Level Anda</p>
                    <p className={`text-xl font-bold text-purple-500`}>{playerLevel}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className={`flex gap-2 mb-6 p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <button
                    onClick={() => setActiveTab('available')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${activeTab === 'available'
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <UserPlus size={16} className="inline mr-1" /> Rekrutmen
                </button>
                <button
                    onClick={() => setActiveTab('hired')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${activeTab === 'hired'
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    <Briefcase size={16} className="inline mr-1" /> Tim Saya ({hiredStaff.length})
                </button>
            </div>

            <div className="flex gap-6">
                {/* Staff Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab === 'available' && (
                        <ErrorBoundary name="StaffRecruitment">
                            {AVAILABLE_STAFF.filter(s => !hiredStaff.some(h => h.id === s.id)).map(staff => (
                                <StaffCard
                                    key={staff.id}
                                    staff={staff}
                                    isLocked={playerLevel < staff.unlockLevel}
                                    isSelected={selectedStaff?.id === staff.id}
                                    onSelect={setSelectedStaff}
                                    onOpenWiki={openWiki}
                                    isDark={isDark}
                                />
                            ))}
                        </ErrorBoundary>
                    )}
                    {activeTab === 'hired' && (
                        <ErrorBoundary name="HiredStaff">
                            {hiredStaff.map(staff => (
                                <StaffCard
                                    key={staff.id}
                                    staff={staff}
                                    isHired
                                    isSelected={selectedStaff?.id === staff.id}
                                    onSelect={setSelectedStaff}
                                    onCoach={handleCoach}
                                    onOpenWiki={openWiki}
                                    isDark={isDark}
                                />
                            ))}
                        </ErrorBoundary>
                    )}
                    {activeTab === 'hired' && hiredStaff.length === 0 && (
                        <div className={`col-span-2 text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Belum ada staff yang direkrut.</p>
                            <p className="text-sm">Klik tab Rekrutmen untuk mulai membangun tim!</p>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selectedStaff && (
                    <StaffDetail
                        staff={selectedStaff}
                        isHired={hiredStaff.some(s => s.id === selectedStaff.id)}
                        isLocked={playerLevel < selectedStaff.unlockLevel}
                        playerLevel={playerLevel}
                        onHire={handleHire}
                        onFire={fireStaff}
                        isDark={isDark}
                    />
                )}
            </div>
        </div>
    );
}

