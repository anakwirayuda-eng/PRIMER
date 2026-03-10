/**
 * @reflection
 * [IDENTITY]: DailyReportModal
 * [PURPOSE]: React UI component: DailyReportModal.
 * [STATE]: Experimental
 * [ANCHOR]: DailyReportModal
 * [DEPENDS_ON]: None
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React from 'react';
import { X, TrendingUp, Activity, Stethoscope, Users, DollarSign, Star, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useModalA11y from '../hooks/useModalA11y.js';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

export default function DailyReportModal({ dayData, dailyArchive = [], onNavigate, onBackToCalendar, onClose }) {
    const modalRef = useModalA11y(onClose);
    if (!dayData) return null;

    const { day, patientsToday, revenue, reputation, overallScore, hourlyTraffic, topDiseases } = dayData;

    const formatCurrency = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
        return num.toString();
    };

    // Find current index and check nav availability
    const currentIndex = dailyArchive.findIndex(d => d.day === day);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < dailyArchive.length - 1;

    const handlePrev = () => {
        if (hasPrev && onNavigate) {
            onNavigate(dailyArchive[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (hasNext && onNavigate) {
            onNavigate(dailyArchive[currentIndex + 1]);
        }
    };

    const handleBackToCalendar = () => {
        if (onBackToCalendar) {
            onBackToCalendar();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="daily-report-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 relative">
                    <button onClick={handleBackToCalendar} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors" aria-label="Tutup laporan harian">
                        <X size={20} />
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                                    <Activity size={24} className="text-emerald-400" /> Daily Report: Day {day}
                                </h2>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-200' :
                                    overallScore >= 60 ? 'bg-amber-500/20 text-amber-200' :
                                        'bg-rose-500/20 text-rose-200'
                                    }`}>
                                    {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Satisfactory' : 'Needs Improvemen'}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-white/60 mt-0.5 uppercase tracking-wide">Operational Summary & Regional Insights</p>
                        </div>
                        {/* Day Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={!hasPrev}
                                className={`p-2 rounded-lg transition-all ${hasPrev ? 'bg-white/20 hover:bg-white/30' : 'opacity-30 cursor-not-allowed'}`}
                                title="Hari Sebelumnya"
                                aria-label="Hari sebelumnya"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded">Hari {day}</span>
                            <button
                                onClick={handleNext}
                                disabled={!hasNext}
                                className={`p-2 rounded-lg transition-all ${hasNext ? 'bg-white/20 hover:bg-white/30' : 'opacity-30 cursor-not-allowed'}`}
                                title="Hari Berikutnya"
                                aria-label="Hari berikutnya"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                            <Users className="mx-auto text-blue-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-blue-700">{patientsToday}</div>
                            <div className="text-xs text-blue-600">Pasien</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                            <DollarSign className="mx-auto text-emerald-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-emerald-700">Rp {formatCurrency(revenue)}</div>
                            <div className="text-xs text-emerald-600">Pendapatan</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                            <Star className="mx-auto text-amber-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-amber-700">{reputation}</div>
                            <div className="text-xs text-amber-600">Reputasi</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                            <TrendingUp className="mx-auto text-purple-500 mb-2" size={24} />
                            <div className="text-2xl font-bold text-purple-700">{overallScore}</div>
                            <div className="text-xs text-purple-600">Skor</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Hourly Traffic Chart */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Users size={16} /> Lalu Lintas Pasien per Jam
                            </h3>
                            <ResponsiveContainer width="100%" height={200} minWidth={0}>
                                <LineChart data={hourlyTraffic || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Diseases Chart */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <Stethoscope size={16} /> Top 10 Penyakit Hari Ini
                            </h3>
                            {topDiseases?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200} minWidth={0}>
                                    <BarChart data={topDiseases} layout="vertical" margin={{ left: -10, right: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fontWeight: 'bold' }} width={110} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                                            {topDiseases.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center py-20 border-2 border-dashed border-slate-100 rounded-xl">
                                    No data available
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer with Back to Calendar button */}
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-between items-center">
                    <button
                        onClick={handleBackToCalendar}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                    >
                        <Calendar size={16} /> Kembali ke Kalender
                    </button>
                    <div className="text-xs text-slate-400">
                        Menampilkan data hari ke-{day} dari {dailyArchive.length} hari
                    </div>
                </div>
            </div>
        </div>
    );
}
