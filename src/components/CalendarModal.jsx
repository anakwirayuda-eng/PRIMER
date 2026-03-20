/**
 * @reflection
 * [IDENTITY]: CalendarModal
 * [PURPOSE]: React UI component: CalendarModal.
 * [STATE]: Experimental
 * [ANCHOR]: CalendarModal
 * [DEPENDS_ON]: CalendarEventDB
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Activity, Star, AlertCircle, Heart, Stethoscope } from 'lucide-react';
import useModalA11y from '../hooks/useModalA11y.js';
import {
    CALENDAR_EVENTS,
    EVENT_COLORS,
    GAME_START_DATE,
    getDayDate,
    getDayOfWeek,
    formatDate,
    getFirstDayOfMonth,
    getDaysInMonth,
    getDayNumberForDate,
    isWeekend,
    isHoliday
} from '../data/CalendarEventDB.js';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarModal({ currentDay, dailyArchive, onSelectDay, onClose }) {
    const modalRef = useModalA11y(onClose);
    const minCalendarYear = GAME_START_DATE.getFullYear();
    // Calculate current month based on game day
    const currentDate = getDayDate(currentDay);
    const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1); // 1-indexed month
    const [viewYear, setViewYear] = useState(currentDate.getFullYear());
    const [selectedDayDetail, setSelectedDayDetail] = useState(null);

    // Calculate calendar grid for the current view month
    const calendarData = useMemo(() => {
        const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
        const daysInMonth = getDaysInMonth(viewMonth, viewYear);
        const firstDayOfWeek = getDayOfWeek(firstDay);

        // Create grid with empty cells for padding
        const grid = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            grid.push({ empty: true });
        }

        // Add actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const dayNum = getDayNumberForDate(viewYear, viewMonth, d);
            grid.push({
                date: d,
                dayNumber: dayNum,
                event: CALENDAR_EVENTS[dayNum],
                isToday: dayNum === currentDay,
                isPast: dayNum < currentDay,
                isFuture: dayNum > currentDay,
                isWeekend: isWeekend(dayNum),
                isHoliday: isHoliday(dayNum),
                archived: dailyArchive.find(a => a.day === dayNum)
            });
        }

        return grid;
    }, [viewMonth, viewYear, currentDay, dailyArchive]);

    // Get upcoming events for the sidebar
    const upcomingEvents = useMemo(() => {
        return Object.entries(CALENDAR_EVENTS)
            .filter(([day]) => parseInt(day) >= currentDay)
            .slice(0, 8)
            .map(([day, event]) => ({
                day: parseInt(day),
                dateStr: formatDate(parseInt(day)),
                ...event
            }));
    }, [currentDay]);

    const handlePrevMonth = () => {
        if (viewMonth > 1) {
            setViewMonth(viewMonth - 1);
            return;
        }

        if (viewYear > minCalendarYear) {
            setViewYear(viewYear - 1);
            setViewMonth(12);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth < 12) {
            setViewMonth(viewMonth + 1);
            return;
        }

        setViewYear(viewYear + 1);
        setViewMonth(1);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="calendar-title" className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-emerald-500/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900/80 to-slate-900/80 text-white p-6 relative shrink-0 border-b border-emerald-500/20">
                    <button onClick={onClose} className="absolute top-5 right-6 p-2 hover:bg-emerald-500/20 rounded-full transition-all text-emerald-400" aria-label="Tutup Kalender">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <Calendar size={28} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Global Calendar
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/80">
                                Operational Day {currentDay} • {formatDate(currentDay)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main Calendar */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-8 bg-black/40 p-2 rounded-2xl border border-white/5">
                            <button
                                onClick={handlePrevMonth}
                                disabled={viewYear === minCalendarYear && viewMonth <= 1}
                                className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-xl disabled:opacity-10 transition-all border border-transparent hover:border-emerald-500/30"
                                aria-label="Bulan sebelumnya"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h3 className="text-2xl font-black uppercase tracking-widest text-emerald-50">
                                {MONTHS[viewMonth - 1]} <span className="text-emerald-500 opacity-50">{viewYear}</span>
                            </h3>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-xl disabled:opacity-10 transition-all border border-transparent hover:border-emerald-500/30"
                                aria-label="Bulan berikutnya"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {DAY_NAMES.map((name, i) => (
                                <div
                                    key={name}
                                    className={`text-center text-[10px] font-black uppercase tracking-tighter py-2 ${i === 0 ? 'text-rose-500' : 'text-slate-500'}`}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarData.map((cell, idx) => {
                                if (cell.empty) {
                                    return <div key={`empty-${idx}`} className="aspect-square opacity-0" />;
                                }


                                const hasArchive = !!cell.archived;

                                return (
                                    <button
                                        key={cell.dayNumber}
                                        onClick={() => {
                                            if (hasArchive) {
                                                onSelectDay(cell.archived);
                                            } else {
                                                setSelectedDayDetail({
                                                    ...cell,
                                                    dateStr: formatDate(cell.dayNumber)
                                                });
                                            }
                                        }}
                                        className={`
                                            relative aspect-square p-2 rounded-2xl text-sm font-bold transition-all flex flex-col items-center justify-center cursor-pointer group
                                            bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:scale-[1.05]
                                            ${cell.isToday ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10' : ''}
                                            ${hasArchive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                                            ${!hasArchive && cell.isPast && !cell.isToday ? 'opacity-40 grayscale' : 'text-white'}
                                            ${!hasArchive && cell.isFuture ? 'text-slate-400' : ''}
                                            ${cell.isWeekend && !cell.isToday && !cell.event ? 'bg-rose-500/5 border-rose-500/10' : ''}
                                            ${cell.isHoliday && !cell.isToday ? 'bg-rose-500/20 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : ''}
                                            ${cell.event && !cell.isHoliday && !cell.isToday ? 'border-cyan-500/40 bg-cyan-500/5' : ''}
                                        `}
                                    >
                                        <span className={`${cell.isWeekend && !cell.isToday ? 'text-rose-400' : ''} ${cell.isToday ? 'text-emerald-400' : ''}`}>
                                            {cell.date}
                                        </span>

                                        {/* Event indicator - Mini Glow */}
                                        {cell.event && (
                                            <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${cell.isHoliday ? 'bg-rose-500 text-rose-500' : 'bg-emerald-400 text-emerald-400'}`} />
                                        )}

                                        {/* Emoji floating */}
                                        {cell.event && (
                                            <span className="absolute top-1.5 right-1.5 text-[10px] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                {cell.event.emoji || EVENT_COLORS[cell.event.type]?.emoji}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 flex flex-wrap gap-3 p-3 bg-black/30 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-[10px] font-bold">🏁 Libur Nasional</div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20 text-[10px] font-bold">🏖️ Cuti Bersama</div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-[10px] font-bold">💊 Hari Kesehatan</div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 text-[10px] font-bold">✓ Ada Laporan</div>
                        </div>
                    </div>

                    {/* Sidebar: Upcoming Events */}
                    <div className="w-80 border-l border-emerald-500/10 bg-slate-900/40 p-6 overflow-y-auto shrink-0 hidden lg:flex flex-col">
                        <h3 className="font-black text-emerald-400 text-sm mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                            <Activity size={20} /> Mission Agenda
                        </h3>

                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-slate-500 italic text-center p-8">No missions available</p>
                        ) : (
                            <div className="space-y-4 flex-1">
                                {upcomingEvents.map(event => {
                                    const style = EVENT_COLORS[event.type];
                                    const isEmergency = event.type === 'holiday'; // Red accent for holidays
                                    return (
                                        <button
                                            key={event.day}
                                            onClick={() => setSelectedDayDetail({ ...event, dateStr: formatDate(event.day), dayNumber: event.day, isFuture: true, event: event })}
                                            className={`
                                                w-full text-left p-4 rounded-2xl border transition-all hover:scale-102 group
                                                bg-white/5 border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40
                                                ${isEmergency ? 'border-rose-500/20 shadow-[inset_0_0_10px_rgba(244,63,94,0.05)]' : ''}
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-black/40 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                                                    <span className="text-xl">{event.emoji || style?.emoji}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-black text-xs text-white truncate group-hover:text-emerald-400 transition-colors uppercase tracking-wider">{event.title}</div>
                                                    <div className="text-[9px] font-bold text-emerald-500/60 mt-0.5">{event.dateStr}</div>
                                                    {event.description && (
                                                        <div className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{event.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Quick Jump */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-emerald-500/40 mb-4 uppercase tracking-[0.3em]">Temporal Jump</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {MONTHS.map((m, i) => (
                                    <button
                                        key={m}
                                        onClick={() => setViewMonth(i + 1)}
                                        className={`
                                            text-[10px] p-2 rounded-xl font-black transition-all border
                                            ${viewMonth === i + 1
                                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                                : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                    >
                                        {m.substring(0, 3).toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Selected Day Detail Modal Overlay */}
                    {selectedDayDetail && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-20 animate-in zoom-in duration-300">
                            <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-8 max-w-sm w-full relative">
                                <button
                                    onClick={() => setSelectedDayDetail(null)}
                                    className="absolute top-4 right-4 p-2 hover:bg-emerald-500/20 rounded-full text-emerald-500 transition-all border border-transparent hover:border-emerald-500/40"
                                    aria-label="Tutup detail hari"
                                >
                                    <X size={20} />
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                        <span className="text-6xl filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                                            {selectedDayDetail.event?.emoji || (selectedDayDetail.isFuture ? '📅' : '📁')}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight mb-2 uppercase tracking-tight">
                                        {selectedDayDetail.event?.title || (selectedDayDetail.isFuture ? 'Agenda Mendatang' : 'Tidak Ada Laporan')}
                                    </h3>
                                    <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">
                                        {selectedDayDetail.dateStr}
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="space-y-4 mb-8">
                                    {selectedDayDetail.event ? (
                                        <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/20 text-emerald-50 text-sm text-center leading-relaxed">
                                            {selectedDayDetail.event.description}
                                        </div>
                                    ) : null}

                                    {selectedDayDetail.isFuture ? (
                                        <p className="text-center text-slate-400 text-xs italic px-4">
                                            Data laporan akan muncul secara otomatis setelah Dokter menyelesaikan jadwal operasional hari ini.
                                        </p>
                                    ) : !selectedDayDetail.event && (
                                        <p className="text-center text-slate-400 text-xs italic">
                                            Tidak ada arsip laporan atau event khusus pada rotasi tanggal ini.
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedDayDetail(null)}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
