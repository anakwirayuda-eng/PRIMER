/**
 * MorningBriefingModal — Strategic planning phase before daily operations.
 * 
 * 3-step carousel:
 *   1. Kondisi Hari Ini — staff, stock alerts, follow-ups, events
 *   2. Alokasi Staff — assign staff to polis
 *   3. Prioritas Hari Ini — pick a daily quest
 * 
 * Design: warm sunrise gradient (amber → orange), mobile-first, dark mode aware.
 */
import React, { useState, useMemo } from 'react';
import { Sun, Users, AlertTriangle, Package, Calendar, Target, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useModalA11y from '../hooks/useModalA11y.js';
import StepCarousel from './shared/StepCarousel';
import StatCard from './shared/StatCard';
import { generateMorningBriefing, generateDefaultAllocation, generateDailyQuests } from '../game/MorningBriefing.js';

export default function MorningBriefingModal({ gameState, onComplete, onDismiss }) {
    const { isDark } = useTheme();
    const modalRef = useModalA11y(onDismiss);

    // Generate briefing data
    const briefing = useMemo(() => generateMorningBriefing(gameState || {}), [gameState]);
    const dailyQuests = useMemo(() => generateDailyQuests(gameState || {}), [gameState]);

    // Staff allocation state
    const [allocation] = useState(() => generateDefaultAllocation(gameState?.hiredStaff || []));

    // Quest selection
    const [selectedQuest, setSelectedQuest] = useState(dailyQuests[0]?.id || null);

    const handleComplete = () => {
        onComplete?.({
            staffAllocation: allocation,
            dailyQuestId: selectedQuest,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="morning-briefing-title"
                className={`w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'
                    }`}
            >
                {/* Header — warm sunrise gradient */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 relative overflow-hidden">
                    {/* Decorative sun circle */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/10 rounded-full" />

                    <div className="relative flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Sun size={24} />
                        </div>
                        <div>
                            <h2 id="morning-briefing-title" className="text-lg font-black tracking-tight">
                                Selamat Pagi, Dokter!
                            </h2>
                            <p className="text-xs text-white/70 font-medium">
                                Hari ke-{briefing.day} — Briefing Pagi
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step Carousel */}
                <StepCarousel onComplete={handleComplete} completeLabel="🚀 Mulai Hari">
                    {/* ── Step 1: Kondisi Hari Ini ── */}
                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>📊 Kondisi Hari Ini</SectionTitle>

                        {/* Staff & KPI stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <StatCard
                                icon={<Users size={18} />}
                                value={briefing.staffReport.available}
                                label="Staff Aktif"
                                colorClass="bg-blue-50 text-blue-600"
                                suffix={`/${briefing.staffReport.total}`}
                            />
                            <StatCard
                                icon={<ShieldCheck size={18} />}
                                value={briefing.kpiSnapshot.reputation}
                                label="Reputasi"
                                colorClass="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard
                                icon={<Zap size={18} />}
                                value={briefing.staffReport.avgMorale}
                                label="Morale"
                                colorClass="bg-amber-50 text-amber-600"
                                suffix="%"
                            />
                        </div>

                        {/* Follow-up alerts */}
                        {briefing.pendingFollowups.length > 0 && (
                            <AlertBox isDark={isDark} type="warning">
                                <AlertTriangle size={14} className="flex-shrink-0" />
                                <div>
                                    <div className="font-bold text-xs">⚠️ Pasien Kembali</div>
                                    {briefing.pendingFollowups.map((f, i) => (
                                        <div key={i} className="text-[11px] mt-0.5 opacity-80">
                                            {f.originalCase.patientName} — {f.narrative}
                                        </div>
                                    ))}
                                </div>
                            </AlertBox>
                        )}

                        {/* Stock alerts */}
                        {briefing.stockAlerts.lowStock.length > 0 && (
                            <AlertBox isDark={isDark} type="info">
                                <Package size={14} className="flex-shrink-0" />
                                <div>
                                    <div className="font-bold text-xs">💊 Stok Rendah</div>
                                    {briefing.stockAlerts.lowStock.map((s, i) => (
                                        <div key={i} className="text-[11px] mt-0.5 opacity-80">
                                            {s.name}: {s.quantity} sisa (min: {s.minStock})
                                        </div>
                                    ))}
                                </div>
                            </AlertBox>
                        )}

                        {/* Today's events */}
                        {briefing.todayEvents.length > 0 && (
                            <div className="space-y-1.5">
                                {briefing.todayEvents.map((event, i) => (
                                    <EventCard key={i} event={event} isDark={isDark} />
                                ))}
                            </div>
                        )}

                        {/* AI suggestion */}
                        {briefing.suggestedPriority && (
                            <div className={`p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 ${isDark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-800'
                                }`}>
                                <span className="text-base">{briefing.suggestedPriority.icon}</span>
                                <span>{briefing.suggestedPriority.text}</span>
                            </div>
                        )}
                    </div>

                    {/* ── Step 2: Poli Status ── */}
                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>🏥 Status Poli</SectionTitle>

                        <div className="space-y-2">
                            {briefing.availablePolis.map(poli => (
                                <div
                                    key={poli.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${poli.available
                                            ? isDark
                                                ? 'bg-slate-800 border border-slate-700'
                                                : 'bg-white border border-slate-200 shadow-sm'
                                            : isDark
                                                ? 'bg-slate-800/50 border border-slate-700/50 opacity-50'
                                                : 'bg-slate-50 border border-slate-200 opacity-50'
                                        }`}
                                >
                                    <span className="text-xl">{poli.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {poli.name}
                                        </div>
                                        {poli.reason && (
                                            <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                🔒 {poli.reason}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${poli.available ? 'bg-emerald-500' : 'bg-slate-400'
                                        }`} />
                                </div>
                            ))}
                        </div>

                        {/* Staff allocation hint */}
                        {Object.keys(allocation).length > 0 && (
                            <div className={`p-3 rounded-xl text-[11px] leading-relaxed ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'
                                }`}>
                                <div className="font-bold text-xs mb-1 opacity-70">📋 Alokasi Staff Otomatis</div>
                                {Object.entries(allocation).map(([poliId, staffIds]) => (
                                    <div key={poliId} className="flex items-center gap-1 mt-0.5">
                                        <span className="font-medium">{poliId}:</span>
                                        <span>{staffIds.length} staf</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Step 3: Prioritas Hari Ini ── */}
                    <div className="space-y-4">
                        <SectionTitle isDark={isDark}>🎯 Pilih Misi Hari Ini</SectionTitle>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pilih satu misi untuk bonus XP di akhir hari.
                        </p>

                        <div className="space-y-2">
                            {dailyQuests.map(quest => (
                                <button
                                    key={quest.id}
                                    onClick={() => setSelectedQuest(quest.id)}
                                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 border ${selectedQuest === quest.id
                                            ? 'border-amber-500 ring-2 ring-amber-500/20 scale-[1.02]'
                                            : isDark
                                                ? 'border-slate-700 hover:border-slate-600'
                                                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        } ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl mt-0.5">{quest.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {quest.title}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    +{quest.xpBonus} XP
                                                </span>
                                            </div>
                                            <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {quest.description}
                                            </p>
                                        </div>
                                        {/* Radio indicator */}
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selectedQuest === quest.id
                                                ? 'border-amber-500 bg-amber-500'
                                                : isDark ? 'border-slate-600' : 'border-slate-300'
                                            }`}>
                                            {selectedQuest === quest.id && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </StepCarousel>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionTitle({ children, isDark }) {
    return (
        <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
            {children}
        </h3>
    );
}

function AlertBox({ children, isDark, type = 'warning' }) {
    const colors = {
        warning: isDark ? 'bg-amber-900/20 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-200',
        info: isDark ? 'bg-blue-900/20 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-800 border-blue-200',
        critical: isDark ? 'bg-red-900/20 text-red-300 border-red-800' : 'bg-red-50 text-red-800 border-red-200',
    };

    return (
        <div className={`flex items-start gap-2 p-3 rounded-xl border ${colors[type]}`}>
            {children}
        </div>
    );
}

function EventCard({ event, isDark }) {
    const priorityColors = {
        critical: isDark ? 'border-l-red-500' : 'border-l-red-500',
        high: isDark ? 'border-l-amber-500' : 'border-l-amber-500',
        medium: isDark ? 'border-l-blue-500' : 'border-l-blue-500',
        low: isDark ? 'border-l-slate-500' : 'border-l-slate-300',
    };

    return (
        <div className={`flex items-center gap-2 p-2.5 rounded-lg border-l-4 ${priorityColors[event.priority]} ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
            <span className="text-base">{event.icon}</span>
            <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {event.title}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {event.description}
                </div>
            </div>
        </div>
    );
}
