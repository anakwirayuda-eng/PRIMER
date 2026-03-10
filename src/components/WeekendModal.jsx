/**
 * @reflection
 * [IDENTITY]: WeekendModal
 * [PURPOSE]: Module: WeekendModal
 * [STATE]: Experimental
 * [ANCHOR]: WeekendModal
 * [DEPENDS_ON]: GameContext
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import {
    Briefcase,
    Coffee,
    BookOpen,
    Users,
    MapPin,
    Home,
    TrendingUp,
    Activity,
    Heart
} from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';

const ACTIVITIES = [
    {
        id: 'rest',
        label: 'Istirahat Total',
        icon: Home,
        description: 'Tidur seharian untuk memulihkan tenaga. Mengurangi stress secara signifikan.',
        cost: 0,
        effects: { stress: -40, energy: 100 },
        color: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'recreation',
        label: 'Liburan Singkat',
        icon: MapPin,
        description: 'Jalan-jalan ke luar kota atau mall bersama keluarga/teman.',
        cost: 500000,
        effects: { stress: -30, happiness: 20 },
        color: 'bg-green-100 text-green-700'
    },
    {
        id: 'workshop',
        label: 'Seminar Medis',
        icon: BookOpen,
        description: 'Mengikuti update ilmu kedokteran terkini. Menambah Skill Point.',
        cost: 1000000,
        effects: { stress: 10, knowledge: 15, xp: 50 },
        color: 'bg-purple-100 text-purple-700'
    },
    {
        id: 'community',
        label: 'Penyuluhan Warga',
        icon: Users,
        description: 'Memberikan edukasi kesehatan ke desa sekitar. Meningkatkan Reputasi.',
        cost: 200000,
        effects: { stress: 15, reputation: 5, xp: 30 },
        color: 'bg-orange-100 text-orange-700'
    },
    {
        id: 'part_time',
        label: 'Praktek Swasta',
        icon: Briefcase,
        description: 'Menerima pasien di klinik pribadi. Menambah uang tapi melelahkan.',
        cost: 0,
        income: 1500000,
        effects: { stress: 25, xp: 20 },
        color: 'bg-emerald-100 text-emerald-700'
    }
];

const WeekendModal = () => {
    const { playerStats, stats, performWeekendActivity, day } = useGame();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const modalRef = useModalA11y(null); // No Escape — must pick activity

    const getDayName = (dayCount) => {
        const dayOfWeek = dayCount % 7;
        return dayOfWeek === 6 ? 'Sabtu' : 'Minggu';
    };

    const dayName = getDayName(day);

    const handleConfirm = () => {
        if (selectedActivity) {
            performWeekendActivity(selectedActivity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="weekend-title" className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* Left Panel: Status & Context */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200 flex flex-col">
                    <div className="mb-6">
                        <h2 id="weekend-title" className="text-2xl font-bold text-slate-800">Akhir Pekan!</h2>
                        <p className="text-slate-500 mb-2">Hari ke-{day} ({dayName})</p>
                        <div className="bg-blue-600 h-1 w-16 rounded-full mb-4"></div>
                        <p className="text-sm text-slate-600">
                            Puskesmas tutup hari ini. Waktunya Kapus melakukan aktivitas lain untuk pengembangan diri atau istirahat.
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <Activity size={18} /> Status Anda
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Stress Level</span>
                                    <span className={`font-medium ${playerStats.stress > 70 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {playerStats.stress}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${playerStats.stress > 70 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(100, playerStats.stress)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Knowledge</span>
                                    <span className="text-purple-700 font-medium">{playerStats.knowledge || 0} pts</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-purple-500"
                                        style={{ width: `${Math.min(100, (playerStats.knowledge || 0) / 2)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Kas (Pribadi/Klinik)</span>
                                    <span className="text-emerald-700 font-medium">
                                        Rp {stats.pendapatanUmum.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedActivity}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
                 ${selectedActivity
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-slate-300 cursor-not-allowed'}`}
                        >
                            Mulai Aktivitas
                        </button>
                    </div>
                </div>

                {/* Right Panel: Activities Grid */}
                <div className="w-full md:w-2/3 p-6 bg-white overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Pilih Aktivitas</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ACTIVITIES.map((act) => {
                            const cantAfford = act.cost > stats.pendapatanUmum;

                            return (
                                <button
                                    key={act.id}
                                    onClick={() => !cantAfford && setSelectedActivity(act)}
                                    disabled={cantAfford}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all
                    ${selectedActivity?.id === act.id
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-slate-100 hover:border-blue-300 hover:shadow-md bg-white'}
                    ${cantAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                  `}
                                >
                                    <div className={`p-3 rounded-lg w-fit mb-3 ${act.color}`}>
                                        <act.icon size={24} />
                                    </div>

                                    <h4 className="font-bold text-slate-800 mb-1">{act.label}</h4>
                                    <p className="text-xs text-slate-500 mb-3 h-10 leading-snug">{act.description}</p>

                                    <div className="space-y-1 text-xs">
                                        {act.cost > 0 && (
                                            <div className="flex items-center text-red-600 font-medium">
                                                <span className="w-20">Biaya:</span>
                                                <span>Rp {act.cost.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {act.income > 0 && (
                                            <div className="flex items-center text-emerald-600 font-medium">
                                                <span className="w-20">Pendapatan:</span>
                                                <span>+Rp {act.income.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-slate-100 mt-2 flex flex-wrap gap-2">
                                            {Object.entries(act.effects).map(([key, value]) => (
                                                <span key={key} className={`px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium capitalize
                           ${value > 0 && key !== 'stress' ? 'text-green-600 bg-green-50' : ''}
                           ${value < 0 && key === 'stress' ? 'text-green-600 bg-green-50' : ''}
                           ${value > 0 && key === 'stress' ? 'text-red-600 bg-red-50' : ''}
                         `}>
                                                    {key}: {value > 0 ? '+' : ''}{value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekendModal;
