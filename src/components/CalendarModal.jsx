/**
 * @reflection
 * [IDENTITY]: CalendarModal
 * [PURPOSE]: React UI component: CalendarModal — full calendar view with multi-event support
 * [STATE]: Production
 * [ANCHOR]: CalendarModal
 * [DEPENDS_ON]: CalendarEventDB
 * [LAST_UPDATE]: 2026-03-20
 */

import React, { useState, useMemo } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Activity, AlertCircle, Building2, FileText } from 'lucide-react';
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
    isHoliday,
    getDailyContext,
    getEpidemiologicalSeason
} from '../data/CalendarEventDB.js';

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarModal({ currentDay, dailyArchive, onSelectDay, onClose }) {
    const modalRef = useModalA11y(onClose);
    const minCalendarYear = GAME_START_DATE.getFullYear();
    const currentDate = getDayDate(currentDay);
    const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1);
    const [viewYear, setViewYear] = useState(currentDate.getFullYear());
    const [selectedDayDetail, setSelectedDayDetail] = useState(null);

    // Season widget for current view
    const viewSeason = useMemo(() => {
        const midMonthDay = getDayNumberForDate(viewYear, viewMonth, 15);
        return getEpidemiologicalSeason(midMonthDay);
    }, [viewMonth, viewYear]);

    const calendarData = useMemo(() => {
        const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
        const daysInMonth = getDaysInMonth(viewMonth, viewYear);
        const firstDayOfWeek = getDayOfWeek(firstDay);

        const grid = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            grid.push({ empty: true });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayNum = getDayNumberForDate(viewYear, viewMonth, d);
            const events = CALENDAR_EVENTS[dayNum];
            const hasEvents = Array.isArray(events) && events.length > 0;
            grid.push({
                date: d,
                dayNumber: dayNum,
                events: hasEvents ? events : [],
                hasEvents,
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

    const upcomingEvents = useMemo(() => {
        return Object.entries(CALENDAR_EVENTS)
            .filter(([day, events]) => parseInt(day) >= currentDay && Array.isArray(events) && events.length > 0)
            .slice(0, 8)
            .map(([day, events]) => ({
                day: parseInt(day),
                dateStr: formatDate(parseInt(day)),
                events
            }));
    }, [currentDay]);

    const handlePrevMonth = () => {
        if (viewMonth > 1) { setViewMonth(viewMonth - 1); return; }
        if (viewYear > minCalendarYear) { setViewYear(viewYear - 1); setViewMonth(12); }
    };

    const handleNextMonth = () => {
        if (viewMonth < 12) { setViewMonth(viewMonth + 1); return; }
        setViewYear(viewYear + 1); setViewMonth(1);
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

                    {/* Season Radar Widget */}
                    <div className="hidden md:flex bg-black/30 px-4 py-2 rounded-xl border border-emerald-500/20 items-center gap-3 mr-12">
                        <span className="text-2xl">{viewSeason.emoji}</span>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70">Radar Epidemiologi</div>
                            <div className="font-bold text-sm text-white">
                                {viewSeason.name}
                                {viewSeason.risks?.length > 0 && (
                                    <span className="ml-2 bg-rose-500/20 text-rose-300 text-[9px] px-2 py-0.5 rounded font-black border border-rose-500/20">WASPADA: {viewSeason.risks[0]}</span>
                                )}
                            </div>
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
                                                const ctx = getDailyContext(cell.dayNumber);
                                                setSelectedDayDetail({
                                                    ...cell,
                                                    event: cell.events,
                                                    dateStr: formatDate(cell.dayNumber),
                                                    ctx
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
                                            ${cell.isWeekend && !cell.isToday && !cell.hasEvents ? 'bg-rose-500/5 border-rose-500/10' : ''}
                                            ${cell.isHoliday && !cell.isToday ? 'bg-rose-500/20 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : ''}
                                            ${cell.hasEvents && !cell.isHoliday && !cell.isToday ? 'border-cyan-500/40 bg-cyan-500/5' : ''}
                                        `}
                                    >
                                        <span className={`${cell.isWeekend && !cell.isToday ? 'text-rose-400' : ''} ${cell.isToday ? 'text-emerald-400' : ''}`}>
                                            {cell.date}
                                        </span>

                                        {/* Event indicators - stacked dots for multi-event days */}
                                        {cell.hasEvents && cell.events.map((ev, i) => (
                                            <div key={i} className={`absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${ev.type === 'holiday' || ev.type === 'cuti' ? 'bg-rose-500 text-rose-500' : 'bg-emerald-400 text-emerald-400'}`} style={{ bottom: `${8 + i * 5}px` }} />
                                        ))}

                                        {/* Emoji floating — show first event's emoji */}
                                        {cell.hasEvents && (
                                            <span className="absolute top-1.5 right-1.5 text-[10px] opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                {cell.events[0]?.emoji || EVENT_COLORS[cell.events[0]?.type]?.emoji}
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
                                {upcomingEvents.map(entry => {
                                    const firstEvent = entry.events[0];
                                    const style = EVENT_COLORS[firstEvent?.type];
                                    const isEmergency = firstEvent?.type === 'holiday';
                                    return (
                                        <button
                                            key={entry.day}
                                            onClick={() => {
                                                const ctx = getDailyContext(entry.day);
                                                setSelectedDayDetail({ dateStr: entry.dateStr, dayNumber: entry.day, isFuture: true, event: entry.events, hasEvents: true, ctx });
                                            }}
                                            className={`
                                                w-full text-left p-4 rounded-2xl border transition-all hover:scale-102 group
                                                bg-white/5 border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40
                                                ${isEmergency ? 'border-rose-500/20 shadow-[inset_0_0_10px_rgba(244,63,94,0.05)]' : ''}
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-black/40 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                                                    <span className="text-xl">{firstEvent?.emoji || style?.emoji}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-black text-xs text-white truncate group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                                                        {firstEvent?.title}{entry.events.length > 1 ? ` +${entry.events.length - 1}` : ''}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-emerald-500/60 mt-0.5">{entry.dateStr}</div>
                                                    {firstEvent?.description && (
                                                        <div className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{firstEvent.description}</div>
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

                    {selectedDayDetail && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-20 animate-in zoom-in duration-300">
                            <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-0 max-w-sm w-full relative overflow-hidden">
                                {/* Header — RED if poli closed, GREEN if open */}
                                <div className={`p-6 text-center text-white ${selectedDayDetail.ctx?.facilities?.polyclinicOpen ? 'bg-gradient-to-br from-emerald-700 to-emerald-900' : 'bg-gradient-to-br from-rose-700 to-rose-900'}`}>
                                    <button
                                        onClick={() => setSelectedDayDetail(null)}
                                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all"
                                        aria-label="Tutup detail hari"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                                        {selectedDayDetail.dateStr}
                                    </div>
                                    <h3 className="text-xl font-black leading-tight">
                                        {selectedDayDetail.ctx?.gameplay?.vibe || 'Hari Normal'}
                                    </h3>
                                    {selectedDayDetail.dayNumber === currentDay && (
                                        <span className="inline-block mt-2 text-[9px] px-3 py-1 bg-white/20 rounded-full font-bold uppercase">Hari Ini</span>
                                    )}
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Facility Status Card */}
                                    {selectedDayDetail.ctx && (
                                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/5">
                                            <div className={`p-2 rounded-xl ${selectedDayDetail.ctx.facilities.polyclinicOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                <Building2 size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status Poliklinik</div>
                                                <div className="font-black text-white">{selectedDayDetail.ctx.facilities.statusText}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Traffic Alert */}
                                    {selectedDayDetail.ctx?.gameplay?.patientTraffic > 1.0 && (
                                        <div className="flex items-start gap-3 p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10">
                                            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-black text-amber-300 text-xs uppercase">Pasien Membludak</div>
                                                <div className="text-xs text-amber-200/80">Proyeksi trafik: <strong>{Math.round(selectedDayDetail.ctx.gameplay.patientTraffic * 100)}%</strong></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Season Context */}
                                    {selectedDayDetail.ctx?.season && (
                                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/5">
                                            <span className="text-2xl">{selectedDayDetail.ctx.season.emoji}</span>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Musim</div>
                                                <div className="text-sm text-white font-bold">{selectedDayDetail.ctx.season.name}</div>
                                                {selectedDayDetail.ctx.season.risks?.length > 0 && (
                                                    <div className="text-[10px] text-slate-400 mt-0.5">Risiko: {selectedDayDetail.ctx.season.risks.join(', ')}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Event List */}
                                    {Array.isArray(selectedDayDetail.event) && selectedDayDetail.event.length > 0 ? (
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agenda Harian</div>
                                            {selectedDayDetail.event.map((ev, i) => (
                                                <div key={i} className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 text-emerald-50 text-sm leading-relaxed">
                                                    <div className="font-bold text-xs">{ev.emoji || '📅'} {ev.title}</div>
                                                    <div className="opacity-70 text-[11px] mt-1">{ev.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-slate-500 text-xs italic">Rotasi reguler. Tidak ada instruksi khusus.</div>
                                    )}

                                    {/* Archive button if past day has report */}
                                    {selectedDayDetail.archived && (
                                        <button
                                            onClick={() => { onSelectDay(selectedDayDetail.archived); setSelectedDayDetail(null); }}
                                            className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-emerald-500/30"
                                        >
                                            <FileText size={16} /> Buka Laporan Harian
                                        </button>
                                    )}

                                    {selectedDayDetail.isFuture && !selectedDayDetail.archived && (
                                        <p className="text-center text-slate-500 text-[11px] italic">
                                            Data laporan akan tersedia setelah rotasi hari ini selesai.
                                        </p>
                                    )}

                                    <button
                                        onClick={() => setSelectedDayDetail(null)}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest transition-all"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
