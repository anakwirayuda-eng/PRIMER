/**
 * @reflection
 * [IDENTITY]: RumahDinas
 * [PURPOSE]: Module: RumahDinas
 * [STATE]: Experimental
 * [ANCHOR]: RumahDinas
 * [DEPENDS_ON]: GameContext, FurnitureData, GuestEventSystem, SoundManager
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext.jsx';
import { FURNITURE_ITEMS, INITIAL_INVENTORY, ROOMS } from '../data/FurnitureData.js';
import { getRandomGuestEvent } from '../game/GuestEventSystem.js';
import { soundManager } from '../utils/SoundManager.js';
import { generateMorningBriefing } from '../game/MorningBriefing.js';
import { generateDebrief } from '../game/DebriefEngine.js';
import MorningBriefingModal from '../components/MorningBriefingModal.jsx';
import EndOfDayModal from '../components/EndOfDayModal.jsx';

// Icons/Assets (using emoji for now, replace with generated assets later)
const ICONS = {
    energy: '⚡',
    stress: '😌',
    knowledge: '📚',
    maxEnergy: '🔋',
    reputation: '🌟',
    money: '💰'
};

const RumahDinas = ({ onClose }) => {
    const {
        playerStats, setPlayerStats,
        stats, setStats,
        time, advanceTime,
        sleepWithAlarm, setReputation,
        clearMorningStatus,
        gainXp, // Added for unified XP handling
        // Phase 0: Foundation Engines
        showMorningBriefing, setShowMorningBriefing,
        showEndOfDayDebrief, setShowEndOfDayDebrief,
        todayLog, consequenceQueue,
        setDailyQuestId, setStaffAllocation,
        addReflection, logCaseOutcome: _logCaseOutcome,
        dailyQuestId, morningReputation,
        // Game state for briefing generators
        day, hiredStaff, pharmacyInventory,
        queue, history: _history
    } = useGame();

    const [activeTab, setActiveTab] = useState('living_room');
    const [alarmHour, setAlarmHour] = useState(5);
    const [debriefData, setDebriefData] = useState(null);

    const furnitureInventory = playerStats?.furnitureInventory ?? INITIAL_INVENTORY;

    // Toast State
    const [toasts, setToasts] = useState([]);

    // Calculate time of day for visuals
    const isLunch = time >= 720 && time < 780; // 12:00 - 13:00

    // 🔒 Action Mutex: prevents auto-clicker double-spend & action spam
    const isProcessingRef = useRef(false);

    // 🔒 Guest event daily limit (1x per day max)
    const [hasReceivedGuest, setHasReceivedGuest] = useState(false);
    const currentDayRef = useRef(day);

    useEffect(() => {
        if (currentDayRef.current !== day) {
            setHasReceivedGuest(false);
            currentDayRef.current = day;
        }
    }, [day]);

    // Toast ID Ref to satisfy purity rules
    const toastIdRef = useRef(0);

    // Toast Helper
    const showToast = useCallback((message, type = 'info') => {
        const id = ++toastIdRef.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    // Filter items owned/not owned
    const ownedItems = useMemo(() =>
        FURNITURE_ITEMS.filter(item => (furnitureInventory || []).includes(item.id)),
        [furnitureInventory]);

    const shopItems = useMemo(() =>
        FURNITURE_ITEMS.filter(item => !(furnitureInventory || []).includes(item.id) && item.price > 0),
        [furnitureInventory]);

    // Helper: Get active item in a room (highest tier owned)
    const getActiveItem = (room, type) => {
        const roomItems = ownedItems.filter(i => i.room === room && i.type === type);
        // Sort by price descending (assuming expensive = better)
        return roomItems.sort((a, b) => b.price - a.price)[0];
    };

    const handleAction = (actionType) => {
        if (isProcessingRef.current) return; // 🔒 Anti-spam mutex
        isProcessingRef.current = true;
        let costEnergy = 0;
        let gainEnergy = 0;
        let gainStress = 0; // Negative means stress reduction
        let gainExp = 0;
        let message = "";

        switch (actionType) {
            case 'sleep': {
                const bed = getActiveItem('bedroom', 'bed');
                gainEnergy = bed?.effect.energy || 5;
                message = "Tidur sejenak memulihkan energi.";
                break;
            }
            case 'relax': {
                const tv = getActiveItem('living_room', 'entertainment');
                const sofa = getActiveItem('living_room', 'sofa');
                gainStress = (tv?.effect.stress || -2) + (sofa?.effect.stress || -1);
                message = "Bersantai menonton TV mengurangi stres.";
                break;
            }
            case 'study': {
                const desk = getActiveItem('workspace', 'desk');
                gainExp = desk?.effect.knowledge || 5;
                costEnergy = 10;
                message = "Membaca jurnal medis menambah wawasan.";
                break;
            }
            case 'cook': {
                const stove = getActiveItem('kitchen', 'kitchen');
                gainEnergy = stove?.effect.energy || 10;
                costEnergy = 5; // Cooking takes effort
                message = "Masak makanan sehat lebih baik dari jajan.";
                break;
            }
            case 'workout': {
                const gym = getActiveItem('gym', 'gym');
                const bonusMax = gym?.effect.maxEnergy || 0;
                costEnergy = 20;
                if (bonusMax > 0) {
                    setPlayerStats(prev => ({
                        ...prev,
                        maxEnergy: Math.min(150, prev.maxEnergy + 1) // Cap at 150
                    }));
                    message = "Olahraga meningkatkan stamina maksimal!";
                } else {
                    message = "Olahraga ringan mencari keringat.";
                }
                break;
            }
            case 'travel': {
                const vehicle = ownedItems.find(i => i.room === 'garage');
                if (!vehicle) {
                    showToast("Anda belum punya kendaraan!", 'error');
                    soundManager.playError();
                    return;
                }
                costEnergy = 15;
                gainStress = -20; // Big stress relief
                if (vehicle.effect.comfort) gainStress -= 10; // Better car, more relax
                message = "Berkeliling menikmati pemandangan desa.";
                break;
            }
            case 'maintenance': {
                const hasVehicle = ownedItems.some(i => i.room === 'garage');
                if (!hasVehicle) {
                    showToast("Apa yang mau dicuci? Kendaraan belum ada.", 'error');
                    soundManager.playError();
                    return;
                }
                costEnergy = 10;
                gainStress = -5; // Therapeutic cleaning
                // Maybe add hygiene stat later
                message = "Kendaraan kinclong, hati tenang.";
                break;
            }
            case 'mandi': {
                costEnergy = 5;
                gainStress = -10;
                message = "Mandi air segar membuat pikiran jernih.";
                if (clearMorningStatus) clearMorningStatus();
                break;
            }
            case 'eat': {
                costEnergy = 0;
                gainEnergy = 15;
                gainStress = -5;
                message = "Sarapan bergizi memberikan energi untuk bekerja.";
                if (clearMorningStatus) clearMorningStatus();
                break;
            }
            case 'coffee': {
                costEnergy = 0;
                gainEnergy = 10;
                gainStress = -5;
                message = "Secangkir kopi hangat, mata langsung melek!";
                if (clearMorningStatus) clearMorningStatus();
                break;
            }
            case 'workout_morning': {
                costEnergy = 20;
                gainStress = -10;
                message = "Lari pagi mencari keringat dan udara segar.";
                if (clearMorningStatus) clearMorningStatus();
                break;
            }
            default:
                break;
        }

        if (playerStats.energy < costEnergy) {
            showToast("Energi tidak cukup!", 'error');
            soundManager.playError();
            return;
        }

        // Apply effects
        if (gainExp > 0) gainXp(gainExp); // Use unified gainXp function
        setPlayerStats(prev => ({
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy - costEnergy + gainEnergy),
            stress: Math.max(0, prev.stress + gainStress),
            knowledge: (prev.knowledge || 0) + (gainExp > 0 ? 1 : 0),
            spirit: Math.max(0, Math.min(100, (prev.spirit || 100) + (actionType === 'relax' ? 10 : actionType === 'cook' ? 5 : 0)))
        }));

        // Advance time (e.g. 30 mins per action)
        advanceTime(30);
        soundManager.playClick();
        showToast(message, 'success');
        setTimeout(() => { isProcessingRef.current = false; }, 300); // 🔓 Unlock after render
    };

    const buyItem = (item) => {
        if (isProcessingRef.current) return; // 🔒 Anti double-spend mutex
        isProcessingRef.current = true;
        if (stats.pendapatanUmum >= item.price) {
            setStats(prev => ({
                ...prev,
                pendapatanUmum: prev.pendapatanUmum - item.price
            }));
            setPlayerStats(prev => ({
                ...prev,
                furnitureInventory: [...new Set([...(prev.furnitureInventory ?? INITIAL_INVENTORY), item.id])]
            }));
            soundManager.playSuccess();
            showToast(`Berhasil membeli ${item.name}!`, 'success');
        } else {
            soundManager.playError();
            showToast("Uang tidak cukup (Gunakan Pendapatan Umum)", 'error');
        }
        setTimeout(() => { isProcessingRef.current = false; }, 300); // 🔓 Unlock
    };

    // Guest Event State
    const [activeEvent, setActiveEvent] = useState(null);

    const handleGuestEvent = () => {
        if (hasReceivedGuest) {
            showToast("Sudah tidak ada tamu hari ini.", 'error');
            soundManager.playError();
            return;
        }
        const event = getRandomGuestEvent();
        setActiveEvent(event);
    };

    const handleEventChoice = (option) => {
        applyEffect(option.effect);
        setHasReceivedGuest(true); // 🔒 Lock guest for today
        showToast(`Anda memilih: ${option.label}`, 'info');
        setActiveEvent(null);
    };

    const applyEffect = (effect) => {
        if (effect.knowledge) gainXp(effect.knowledge); // Use unified gainXp function
        setPlayerStats(prev => ({
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy + (effect.energy || 0)),
            stress: Math.max(0, prev.stress + (effect.stress || 0)),
            knowledge: (prev.knowledge || 0) + (effect.knowledge || 0),
            reputation: (prev.reputation || 80) + (effect.reputation || 0)
        }));

        if (effect.money) {
            setStats(prev => ({
                ...prev,
                pendapatanUmum: prev.pendapatanUmum + effect.money
            }));
        }
    };

    const mainContent = (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
            {/* Toast Container */}
            <div className="absolute top-4 right-4 z-hud flex flex-col gap-2">
                {toasts.map(toast => (
                    <div key={toast.id} className={`px-4 py-2 rounded shadow-lg text-white font-bold animate-in slide-in-from-right fade-in duration-300 ${toast.type === 'error' ? 'bg-red-500' :
                        toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                        {toast.message}
                    </div>
                ))}
            </div>

            {/* Guest Event Modal */}
            {activeEvent && (
                <div className="absolute inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slate-200">
                        <div className="bg-teal-600 text-white p-4 font-bold text-lg flex items-center gap-2">
                            <span>👋 Tamu Datang!</span>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{activeEvent.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">{activeEvent.text}</p>

                            <div className="flex flex-col gap-2">
                                {activeEvent.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleEventChoice(opt)}
                                        className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-300 transition group"
                                    >
                                        <div className="font-bold text-teal-800 group-hover:text-teal-900">{opt.label}</div>
                                        {/* Optional: Show effects hint if easy mode? For now hidden for surprise */}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                            Pilih tindakan Anda dengan bijak
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">🏠 Rumah Dinas</h1>
                        <div className="text-sm text-slate-300">
                            Dr. {playerStats.name || 'Dokter'} •
                            {isLunch ? ' 🍱 Jam Istirahat' : ' 🌙 Malam Hari'}
                        </div>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold">
                        Kembali ke Puskesmas
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Visual Area (Left) */}
                    <div className="w-2/3 bg-slate-100 relative items-center justify-center flex flex-col border-r border-slate-300">
                        {/* Dynamic Background based on Room */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: `url(/assets/rooms/${activeTab}.png)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        <div className="z-10 text-center p-8">
                            <h2 className="text-4xl font-bold text-slate-700 mb-4">{ROOMS.find(r => r.id === activeTab)?.name}</h2>

                            {/* Contextual Actions */}
                            <div className="flex gap-4 justify-center">
                                {activeTab === 'bedroom' && (
                                    <div className="flex flex-col items-center bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl">
                                        <div className="text-4xl mb-2">⏰</div>
                                        <h3 className="font-bold text-slate-800 mb-4">Pasang Weker</h3>

                                        <div className="flex items-center gap-4 mb-6">
                                            {[4, 5, 6, 7, 8].map(hour => (
                                                <button
                                                    key={hour}
                                                    onClick={() => setAlarmHour(hour)}
                                                    className={`w-12 h-12 rounded-full font-bold transition-all ${alarmHour === hour
                                                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                                                        : 'bg-white text-slate-600 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    0{hour}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="w-full mb-6">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                                <span>Willpower Check</span>
                                                <span>{Math.round((playerStats.energy * 0.4) + (playerStats.spirit * 0.6))}% Success</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${((playerStats.energy * 0.4) + (playerStats.spirit * 0.6)) > 70 ? 'bg-green-500' :
                                                        ((playerStats.energy * 0.4) + (playerStats.spirit * 0.6)) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${(playerStats.energy * 0.4) + (playerStats.spirit * 0.6)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                // Phase 0: Show debrief BEFORE sleeping
                                                const debrief = generateDebrief({
                                                    todayLog: todayLog || [],
                                                    consequenceQueue: consequenceQueue || [],
                                                    day: day || 1,
                                                    stats: stats || {},
                                                    dailyQuestId,
                                                    morningReputation
                                                });
                                                setDebriefData(debrief);
                                                setShowEndOfDayDebrief(true);
                                            }}
                                            className="w-full py-4 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95"
                                        >
                                            Tidur Sekarang
                                        </button>
                                    </div>
                                )}
                                {activeTab === 'living_room' && (
                                    <button onClick={() => handleAction('relax')} className="btn-action bg-purple-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                        <div className="text-4xl">📺</div>
                                        <div className="font-bold mt-2">Nonton TV</div>
                                        <div className="text-xs opacity-75">-Stress</div>
                                    </button>
                                )}
                                {activeTab === 'kitchen' && (
                                    <div className="flex gap-4">
                                        <button onClick={() => handleAction('cook')} className="btn-action bg-orange-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                            <div className="text-4xl">🍳</div>
                                            <div className="font-bold mt-2">Masak</div>
                                            <div className="text-xs opacity-75">+Energy (Murah)</div>
                                        </button>
                                        <button onClick={() => handleAction('eat')} className="btn-action bg-emerald-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg border-2 border-emerald-300">
                                            <div className="text-4xl">🍱</div>
                                            <div className="font-bold mt-2">Sarapan</div>
                                            <div className="text-xs opacity-75">Hapus Groggy</div>
                                        </button>
                                    </div>
                                )}
                                {activeTab === 'gym' && (
                                    <div className="flex gap-4">
                                        <button onClick={() => handleAction('workout')} className="btn-action bg-red-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                            <div className="text-4xl">🏃</div>
                                            <div className="font-bold mt-2">Olahraga</div>
                                            <div className="text-xs opacity-75">+Max Energy</div>
                                        </button>
                                        {time >= 300 && time <= 420 && (
                                            <button
                                                onClick={() => {
                                                    handleAction('workout_morning');
                                                    setPlayerStats(prev => ({ ...prev, maxEnergy: Math.min(150, prev.maxEnergy + 1) }));
                                                    showToast("Olahraga pagi meningkatkan kapasitas paru dan stamina!", "success");
                                                }}
                                                className="btn-action bg-emerald-600 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg border-4 border-emerald-300"
                                            >
                                                <div className="text-4xl">🌅</div>
                                                <div className="font-bold mt-2">Lari Pagi</div>
                                                <div className="text-xs opacity-75">Bonus Stamina Permanen</div>
                                            </button>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'workspace' && (
                                    <button onClick={() => handleAction('study')} className="btn-action bg-indigo-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                        <div className="text-4xl">📚</div>
                                        <div className="font-bold mt-2">Belajar</div>
                                        <div className="text-xs opacity-75">+XP</div>
                                    </button>
                                )}
                                {activeTab === 'guest_room' && (
                                    <div className="flex flex-col gap-4">
                                        <button onClick={handleGuestEvent} className="btn-action bg-teal-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                            <div className="text-4xl">👋</div>
                                            <div className="font-bold mt-2">Terima Tamu</div>
                                            <div className="text-xs opacity-75">Event Random</div>
                                        </button>
                                        <button onClick={() => handleAction('coffee')} className="btn-action bg-amber-700 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg border-2 border-amber-500">
                                            <div className="text-4xl">☕</div>
                                            <div className="font-bold mt-2">Ngopi Pagi</div>
                                            <div className="text-xs opacity-75">Hapus Groggy</div>
                                        </button>
                                        {time >= 270 && time <= 330 && (
                                            <button
                                                onClick={() => {
                                                    setPlayerStats(prev => ({
                                                        ...prev,
                                                        spirit: Math.min(100, prev.spirit + 20),
                                                        stress: Math.max(0, prev.stress - 15)
                                                    }));
                                                    setReputation(r => Math.min(100, r + 5));
                                                    advanceTime(60);
                                                    showToast("Ketemu warga di Masjid. Spirit & Reputasi naik!", "success");
                                                }}
                                                className="btn-action bg-amber-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg border-4 border-amber-200"
                                            >
                                                <div className="text-4xl">🕌</div>
                                                <div className="font-bold mt-2">Jamaah Subuh</div>
                                                <div className="text-xs opacity-75">Reputasi & Ketenangan</div>
                                            </button>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'garage' && (
                                    <>
                                        <button onClick={() => handleAction('travel')} className="btn-action bg-amber-600 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                            <div className="text-4xl">🛵</div>
                                            <div className="font-bold mt-2">Jalan-jalan</div>
                                            <div className="text-xs opacity-75">-Stress (Butuh Kendaraan)</div>
                                        </button>
                                        <button onClick={() => handleAction('maintenance')} className="btn-action bg-slate-600 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg">
                                            <div className="text-4xl">🧽</div>
                                            <div className="font-bold mt-2">Cuci Kendaraan</div>
                                            <div className="text-xs opacity-75">+Kebersihan</div>
                                        </button>
                                    </>
                                )}
                                {activeTab === 'bathroom' && (
                                    <button onClick={() => handleAction('mandi')} className="btn-action bg-blue-500 text-white p-6 rounded-xl hover:scale-105 transition shadow-lg border-2 border-blue-300">
                                        <div className="text-4xl">🚿</div>
                                        <div className="font-bold mt-2">Mandi</div>
                                        <div className="text-xs opacity-75">Hapus Groggy</div>
                                    </button>
                                )}
                            </div>

                            {/* Current Equipment Display */}
                            <div className="mt-12 bg-white/20 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/30 dark:border-slate-700/50 inline-block">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-4 tracking-wider">Fasilitas Aktif</h3>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {ownedItems.filter(i => i.room === activeTab).map(item => (
                                        <div
                                            key={item.id}
                                            className="text-xs bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-lg border border-white dark:border-slate-600 
                                                       text-slate-800 dark:text-slate-100 font-bold shadow-sm"
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                    {ownedItems.filter(i => i.room === activeTab).length === 0 && <span className="text-xs text-slate-500 dark:text-slate-400 italic">Rumah masih kosong melompong...</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Navigation (Right) */}
                    <div className="w-1/3 bg-white flex flex-col">
                        {/* Room Tabs */}
                        <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50 border-b">
                            {ROOMS.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => setActiveTab(room.id)}
                                    className={`p-3 rounded-lg text-left flex items-center transition ${activeTab === room.id
                                        ? 'bg-blue-100 text-blue-700 border-blue-200 border shadow-sm'
                                        : 'hover:bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <span className="text-xl mr-2">{room.icon}</span>
                                    <span className="font-medium text-sm">{room.name}</span>
                                </button>
                            ))}
                            {/* Injected Bathroom Tab */}
                            <button
                                onClick={() => setActiveTab('bathroom')}
                                className={`p-3 rounded-lg text-left flex items-center transition ${activeTab === 'bathroom'
                                    ? 'bg-blue-100 text-blue-700 border-blue-200 border shadow-sm'
                                    : 'hover:bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <span className="text-xl mr-2">🧼</span>
                                <span className="font-medium text-sm">Kamar Mandi</span>
                            </button>
                        </div>

                        {/* Stats Panel */}
                        <div className="p-4 border-b bg-amber-50">
                            <h3 className="font-bold text-slate-700 text-sm mb-2">Kondisi Dokter</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500">Energi</div>
                                    <div className="font-mono font-bold text-blue-600">
                                        {Math.round(playerStats.energy)} / {playerStats.maxEnergy}
                                    </div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(playerStats.energy / playerStats.maxEnergy) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Stress</div>
                                    <div className="font-mono font-bold text-red-500">
                                        {Math.round(playerStats.stress)}%
                                    </div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1">
                                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${playerStats.stress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shop Section */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">🛍️ Katalog Furniture</h3>
                                <div className="text-sm font-bold text-green-600">
                                    Rp {stats.pendapatanUmum.toLocaleString('id-ID')}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {shopItems.filter(i => i.room === activeTab).map(item => (
                                    <div key={item.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition bg-white">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-800">{item.name}</h4>
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 mb-2 italic">"{item.desc}"</p>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-xs text-blue-600">
                                                {item.effect.energy && `+${item.effect.energy} Energy`}
                                                {item.effect.stress && `${item.effect.stress} Stress`}
                                                {item.effect.maxEnergy && `+${item.effect.maxEnergy} Stamina`}
                                                {item.effect.knowledge && `+${item.effect.knowledge} XP`}
                                            </div>
                                            <button
                                                onClick={() => buyItem(item)}
                                                disabled={stats.pendapatanUmum < item.price}
                                                className={`text-xs px-3 py-1.5 rounded font-bold ${stats.pendapatanUmum >= item.price
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Beli
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {shopItems.filter(i => i.room === activeTab).length === 0 && (
                                    <div className="text-center text-slate-400 py-8">
                                        Semua barang di ruangan ini sudah dibeli! Sultan! 👑
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Phase 0: Morning Briefing Handler
    const handleBriefingComplete = useCallback((result) => {
        if (result.staffAllocation) setStaffAllocation(result.staffAllocation);
        if (result.dailyQuestId) setDailyQuestId(result.dailyQuestId);
        setShowMorningBriefing(false);
        showToast('Briefing selesai! Selamat bekerja! 🌅', 'success');
    }, [setStaffAllocation, setDailyQuestId, setShowMorningBriefing, showToast]);

    // Phase 0: Debrief Handler
    const handleDebriefComplete = useCallback((result) => {
        if (result.reflectionText) {
            addReflection({ day: day || 1, text: result.reflectionText });
        }
        if (result.xpBonus > 0) {
            gainXp(result.xpBonus);
        }
        setShowEndOfDayDebrief(false);
        setDebriefData(null);

        // Now actually sleep
        const res = sleepWithAlarm?.(alarmHour);
        if (res?.success) {
            showToast(`Bangun tepat waktu! Status: ${res.status.toUpperCase()}`, 'success');
        } else if (res) {
            const wakeTime = res.wakeTime ?? res.time ?? 0;
            showToast(`Kebablasan! Bangun jam ${Math.floor(wakeTime / 60)}:00. Status: ${res.status.toUpperCase()}`, 'error');
        } else {
            showToast('Tidur gagal diproses. Coba lagi.', 'error');
        }
    }, [addReflection, gainXp, setShowEndOfDayDebrief, sleepWithAlarm, alarmHour, day, showToast]);

    const activeBriefingData = useMemo(() => {
        if (!showMorningBriefing) return null;

        return generateMorningBriefing({
            day: day || 1,
            hiredStaff: hiredStaff || [],
            pharmacyInventory: pharmacyInventory || [],
            consequenceQueue: consequenceQueue || [],
            playerLevel: playerStats?.level || 1,
            queue: queue || [],
            reputation: playerStats?.reputation || 80,
            stats: stats || {}
        });
    }, [showMorningBriefing, day, hiredStaff, pharmacyInventory, consequenceQueue, playerStats, queue, stats]);

    return (
        <>
            {mainContent}

            {/* Phase 0: Morning Briefing Modal */}
            {showMorningBriefing && activeBriefingData && (
                <MorningBriefingModal
                    briefingData={activeBriefingData}
                    onComplete={handleBriefingComplete}
                    onDismiss={() => { setShowMorningBriefing(false); }}
                />
            )}

            {/* Phase 0: End-of-Day Debrief Modal */}
            {showEndOfDayDebrief && debriefData && (
                <EndOfDayModal
                    debriefData={debriefData}
                    onComplete={handleDebriefComplete}
                    onDismiss={() => { setShowEndOfDayDebrief(false); setDebriefData(null); }}
                />
            )}
        </>
    );
};

export default RumahDinas;
