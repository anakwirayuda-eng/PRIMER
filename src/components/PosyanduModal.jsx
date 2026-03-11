/**
 * @reflection
 * [IDENTITY]: PosyanduModal
 * [PURPOSE]: React UI component: PosyanduModal.
 * [STATE]: Experimental
 * [ANCHOR]: PosyanduModal
 * [DEPENDS_ON]: GameContext, PosyanduEngine
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useEffect, useMemo } from 'react';
import useModalA11y from '../hooks/useModalA11y.js';
import { useGame } from '../context/GameContext.jsx';
import {
    X, Scale, ClipboardList, Syringe, Apple, Baby, Award,
    Users, CheckCircle, AlertTriangle, ChevronRight, Heart
} from 'lucide-react';
import {
    POSYANDU_ACTIVITIES,
    getEligibleParticipants,
    calculateAttendance,
    processActivityResult,
    generatePosyanduSummary
} from '../game/PosyanduEngine.js';
import { calculateIKS } from '../game/GameCore.js';
import { chanceFromSeed } from '../utils/deterministicRandom.js';

const ACTIVITY_ICONS = {
    penimbangan: Scale,
    kms: ClipboardList,
    imunisasi: Syringe,
    penyuluhan_gizi: Apple,
    penyuluhan_asi: Baby,
    pmba: Baby
};

export default function PosyanduModal({ isOpen, onClose }) {
    const modalRef = useModalA11y(onClose);
    const {
        villageData, reputation, day, playerStats, setPlayerStats,
        setTime, setReputation, setVillageData, soundManager, setHistory, getStaffBuffs,
        gainXp // Added for unified XP handling
    } = useGame();

    const [phase, setPhase] = useState('setup'); // setup, activity, summary
    const [selectedActivities, setSelectedActivities] = useState(['penimbangan', 'kms']);
    const [attendees, setAttendees] = useState([]);
    const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [reminderSent, setReminderSent] = useState(false);

    // Get eligible participants
    const eligibleChildren = useMemo(() => {
        return getEligibleParticipants(villageData, 'penimbangan');
    }, [villageData]);

    const eligibleMothers = useMemo(() => {
        return getEligibleParticipants(villageData, 'penyuluhan_gizi');
    }, [villageData]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset form state when modal opens
            setPhase('setup');
            setSelectedActivities(['penimbangan', 'kms']);
            setAttendees([]);
            setCurrentAttendeeIndex(0);
            setResults([]);
            setReminderSent(false);
        }
    }, [isOpen]);

    const toggleActivity = (activityId) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(a => a !== activityId)
                : [...prev, activityId]
        );
    };

    const startPosyandu = () => {
        // Calculate total energy needed
        const totalEnergy = selectedActivities.reduce((sum, actId) =>
            sum + POSYANDU_ACTIVITIES[actId].energyCost, 0);

        if (playerStats.energy < totalEnergy) {
            alert('Energi tidak cukup untuk menyelenggarakan Posyandu!');
            return;
        }

        // Determine participants based on activities
        const hasChildActivity = selectedActivities.some(a =>
            POSYANDU_ACTIVITIES[a].targetAge !== null);
        const hasMotherActivity = selectedActivities.some(a =>
            POSYANDU_ACTIVITIES[a].targetAge === null);

        let participants = [];
        if (hasChildActivity) {
            participants = [...participants, ...eligibleChildren];
        }
        if (hasMotherActivity) {
            participants = [...participants, ...eligibleMothers];
        }

        // Calculate attendance
        const attending = calculateAttendance(participants, {
            reminderSent,
            reputation,
            iksScore: villageData?.averageIks || 0.5
        });

        if (attending.length === 0) {
            alert('Tidak ada warga yang hadir hari ini. Coba lagi di hari kegiatan berikutnya atau tingkatkan Reputasi desa.');
            return;
        }

        setAttendees(attending);
        setPhase('activity');
        soundManager?.playConfirm();
    };

    const processCurrentAttendee = () => {
        const attendee = attendees[currentAttendeeIndex];
        if (!attendee) return;

        // Process each selected activity for this attendee
        const attendeeResults = selectedActivities.map(actId => {
            const activity = POSYANDU_ACTIVITIES[actId];
            return processActivityResult(activity, attendee, {});
        });

        setResults(prev => [...prev, ...attendeeResults]);

        if (currentAttendeeIndex < attendees.length - 1) {
            setCurrentAttendeeIndex(prev => prev + 1);
        } else {
            // All done, move to summary
            finishPosyandu();
        }
    };

    const finishPosyandu = () => {
        const summary = generatePosyanduSummary(results);

        // --- STAFF BUFF INTEGRATION ---
        const buffs = getStaffBuffs();
        const nutritionBonus = buffs.childNutrition || 0;
        const improvementChance = 0.3 + (nutritionBonus / 100); // Base 30% + staff bonus

        // Award XP using unified gainXp function
        const totalXpEarned = summary.totalXP + (nutritionBonus * 2);
        gainXp(totalXpEarned);

        // Handle energy separately
        setPlayerStats(prev => ({
            ...prev,
            energy: prev.energy - selectedActivities.reduce((sum, actId) =>
                sum + POSYANDU_ACTIVITIES[actId].energyCost, 0)
        }));

        // Advance time
        const totalTime = selectedActivities.reduce((sum, actId) =>
            sum + POSYANDU_ACTIVITIES[actId].timeCost, 0);
        setTime(t => Math.min(960, t + totalTime));

        // Improve reputation
        setReputation(prev => Math.min(100, prev + 2 + Math.floor(summary.totalParticipants / 5)));

        // Update village IKS
        setVillageData(prev => {
            if (!prev) return prev;
            const updatedFamilies = prev.families.map(fam => {
                // Check if any attendee is from this family
                const attended = attendees.some(a => a.familyId === fam.id);
                if (!attended) return fam;

                const indicators = { ...fam.indicators };
                selectedActivities.forEach(actId => {
                    const activity = POSYANDU_ACTIVITIES[actId];
                    if (activity.iksImpact?.indicator === 'gizi') {
                        indicators.gizi = true;
                    }
                    if (activity.iksImpact?.indicator === 'imunisasi') {
                        indicators.imunisasi = true;
                    }
                });

                // Apply IKS improvement based on chance
                const nutritionSeed = `posyandu:${day}:${fam.id}:${selectedActivities.join('|')}`;
                if (chanceFromSeed(nutritionSeed, improvementChance)) {
                    // Assuming these are the indicators related to child nutrition
                    indicators.bayi_asi_eksklusif = true;
                    indicators.balita_pertumbuhan = true;
                }

                return { ...fam, indicators, iksScore: calculateIKS(indicators) };
            });

            return { ...prev, families: updatedFamilies, averageIks: calculateIKS(updatedFamilies) };
        });

        // Record to History
        setHistory(prev => [...prev, {
            day,
            type: 'posyandu',
            label: `Kegiatan Posyandu`,
            description: `${summary.totalParticipants} warga dilayani. ${summary.issuesFound} masalah gizi terdeteksi. (Bonus Staff: +${nutritionBonus}%)`,
            xp: summary.totalXP + (nutritionBonus * 2), // Extra XP from staff
            timestamp: Date.now()
        }]);

        setPhase('summary');
        soundManager?.playSuccess();
    };

    const summary = useMemo(() => {
        if (results.length === 0) return null;
        return generatePosyanduSummary(results);
    }, [results]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="posyandu-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Heart className="text-white" size={28} />
                            </div>
                            <div>
                                <h2 id="posyandu-title" className="text-2xl font-bold">Posyandu</h2>
                                <p className="text-pink-100 text-sm">Pos Pelayanan Terpadu</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Tutup Posyandu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4">
                        <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs text-pink-100">Balita Eligible</div>
                            <div className="text-xl font-bold">{eligibleChildren.length}</div>
                        </div>
                        <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs text-pink-100">Ibu Eligible</div>
                            <div className="text-xl font-bold">{eligibleMothers.length}</div>
                        </div>
                        <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs text-pink-100">Hari ke-</div>
                            <div className="text-xl font-bold">{day}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {phase === 'setup' && (
                        <div className="space-y-6">
                            {/* Activity Selection */}
                            <div>
                                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <ClipboardList size={18} />
                                    Pilih Kegiatan Posyandu
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.values(POSYANDU_ACTIVITIES).map(activity => {
                                        const Icon = ACTIVITY_ICONS[activity.id] || ClipboardList;
                                        const isSelected = selectedActivities.includes(activity.id);
                                        return (
                                            <button
                                                key={activity.id}
                                                onClick={() => toggleActivity(activity.id)}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-slate-200 hover:border-pink-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-700 text-sm">{activity.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-2">
                                                            <span>⚡{activity.energyCost}</span>
                                                            <span>🕐{activity.timeCost}m</span>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircle size={20} className="text-pink-500" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reminder Toggle */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={reminderSent}
                                        onChange={e => setReminderSent(e.target.checked)}
                                        className="w-5 h-5 rounded accent-amber-500"
                                    />
                                    <div>
                                        <div className="font-bold text-amber-800">Kirim Pengumuman ke Warga</div>
                                        <div className="text-xs text-amber-600">
                                            +15% kehadiran • Biaya: 5 Energi tambahan
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={startPosyandu}
                                disabled={selectedActivities.length === 0}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <span>Mulai Posyandu</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {phase === 'activity' && (
                        <div className="space-y-6">
                            {/* Progress */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all"
                                        style={{ width: `${((currentAttendeeIndex + 1) / attendees.length) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm font-bold text-slate-500">
                                    {currentAttendeeIndex + 1} / {attendees.length}
                                </div>
                            </div>

                            {/* Current Attendee */}
                            {attendees[currentAttendeeIndex] && (
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 text-center">
                                    <div className="w-20 h-20 bg-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                                        {attendees[currentAttendeeIndex].age < 6 ? '👶' : '👩'}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {attendees[currentAttendeeIndex].name}
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        {attendees[currentAttendeeIndex].age < 1
                                            ? `${Math.round(attendees[currentAttendeeIndex].age * 12)} bulan`
                                            : `${attendees[currentAttendeeIndex].age} tahun`
                                        } • Keluarga {attendees[currentAttendeeIndex].familyName}
                                    </p>

                                    {/* Activity Buttons */}
                                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                                        {selectedActivities.map(actId => {
                                            const activity = POSYANDU_ACTIVITIES[actId];
                                            return (
                                                <span
                                                    key={actId}
                                                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
                                                >
                                                    {activity.icon} {activity.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Process Button */}
                            <button
                                onClick={processCurrentAttendee}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                <span>Layani & Lanjut</span>
                            </button>
                        </div>
                    )}

                    {phase === 'summary' && summary && (
                        <div className="space-y-6 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto flex items-center justify-center">
                                <Award size={48} className="text-emerald-600" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Posyandu Selesai! 🎉</h3>
                                <p className="text-slate-500">Terima kasih atas dedikasi Anda</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-3xl font-black text-pink-600">{summary.totalParticipants}</div>
                                    <div className="text-xs text-slate-500 font-medium">Peserta Dilayani</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-3xl font-black text-amber-500">+{summary.totalXP}</div>
                                    <div className="text-xs text-slate-500 font-medium">XP Diperoleh</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-3xl font-black text-rose-500">{summary.issuesFound}</div>
                                    <div className="text-xs text-slate-500 font-medium">Masalah Terdeteksi</div>
                                </div>
                            </div>

                            {summary.issuesFound > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                                    <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                                        <AlertTriangle size={18} />
                                        <span>Tindak Lanjut Diperlukan</span>
                                    </div>
                                    <p className="text-sm text-amber-600">
                                        Ditemukan {summary.issuesFound} anak dengan gizi kurang.
                                        Jadwalkan kunjungan rumah atau konseling gizi lebih lanjut.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all"
                            >
                                Selesai
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
