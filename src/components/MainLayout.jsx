/**
 * @reflection
 * [IDENTITY]: MainLayout
 * [PURPOSE]: React UI component: MainLayout.
 * [STATE]: Experimental
 * [ANCHOR]: MainLayout
 * [DEPENDS_ON]: GameContext, ThemeContext, Smartphone, DashboardPage, ClinicalPage, PlayerSetup, QuestBoard, AvatarRenderer, WikiData, AppMetadata
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-12
 */

import React, { useState, useMemo, Suspense, useEffect, useCallback } from 'react';
import TimeController from './TimeController.jsx';
import PauseOverlay from './PauseOverlay.jsx';
import { useGame } from '../context/GameContext.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import GameOverModal from './GameOverModal.jsx';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import useModalA11y from '../hooks/useModalA11y.js';
import { safeReloadPage } from '../utils/browserSafety.js';
import { PAGE_SHORTCUTS, TOGGLE_SHORTCUTS, SYSTEM_SHORTCUTS, resolveGlobalGameShortcut, shouldExecuteGlobalGameShortcut } from '../utils/gameShortcuts.js';
import { LayoutDashboard, Dna, Stethoscope, Users, Package, Settings, LogOut, ChevronLeft, ChevronRight, Moon, Sun, Archive, GraduationCap, Map, Building2, Home, Smartphone as PhoneIcon, Play, Pause, FastForward, Activity, X, CheckCircle, Sparkles, AlertTriangle, Loader2, Brain, Landmark, Keyboard } from 'lucide-react';
// import Smartphone from './Smartphone.jsx'; // Lazy loaded below
// Code-split heavy route components (only loaded when navigated to)
const Smartphone = React.lazy(() => import('./Smartphone'));
const QuestBoard = React.lazy(() => import('./QuestBoard'));
const DashboardPage = React.lazy(() => import('./DashboardPage'));
const ClinicalPage = React.lazy(() => import('./ClinicalPage'));
const WilayahPage = React.lazy(() => import('./WilayahPage'));
const GedungPage = React.lazy(() => import('./GedungPage'));
const InventoryPage = React.lazy(() => import('./InventoryPage'));
const DiklatPage = React.lazy(() => import('./DiklatPage'));
const ArsipPage = React.lazy(() => import('./ArsipPage'));
const StaffPage = React.lazy(() => import('./StaffPage'));
const KPIDashboard = React.lazy(() => import('./KPIDashboard'));
const SensusPage = React.lazy(() => import('./sensus/SensusPage'));

// Code-split modals (loaded on first open)
const SettingsModal = React.lazy(() => import('./SettingsModal'));
const AvatarSelectionModal = React.lazy(() => import('./AvatarSelectionModal'));
const StatusJunctionModal = React.lazy(() => import('./StatusJunctionModal'));
const CalendarModal = React.lazy(() => import('./CalendarModal'));
const DailyReportModal = React.lazy(() => import('./DailyReportModal'));
const EducationalWikiModal = React.lazy(() => import('./EducationalWikiModal'));
const ReferralSISRUTEModal = React.lazy(() => import('./ReferralSISRUTEModal'));
const OutbreakModal = React.lazy(() => import('./OutbreakModal'));
const NarrativeOverlay = React.lazy(() => import('./NarrativeOverlay'));

import AvatarRenderer from './AvatarRenderer.jsx';
import AboutModal from './AboutModal.jsx';
import ReferralHUD from './ReferralHUD.jsx';
import OutbreakBanner from './OutbreakBanner.jsx';
// WIKI_DATA removed — EducationalWikiModal loads data internally via getWikiEntry
import { APP_METADATA } from '../data/AppMetadata.js';

// Reusable loading fallback for lazy-loaded components
const PageLoader = () => (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-main)]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Memuat...</span>
        </div>
    </div>
);

const PAGE_SHORTCUT_HINTS = Object.fromEntries(PAGE_SHORTCUTS.map(({ id, hint }) => [id, hint]));
const TOGGLE_SHORTCUT_HINTS = Object.fromEntries(TOGGLE_SHORTCUTS.map(({ id, hint }) => [id, hint]));

function ShortcutHelpModal({ onClose }) {
    const modalRef = useModalA11y(onClose);

    return (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="Daftar shortcut keyboard"
                className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-400 font-black">Input Layer</div>
                        <h2 className="text-xl font-black text-white mt-1">Shortcut Keyboard</h2>
                        <p className="text-sm text-slate-400 mt-1">Shortcut global aktif saat fokus tidak sedang berada di input atau textarea.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                        aria-label="Tutup bantuan shortcut"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300 mb-3">Navigasi</div>
                        <div className="space-y-2">
                            {PAGE_SHORTCUTS.map(shortcut => (
                                <div key={shortcut.id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-slate-200">{shortcut.label}</span>
                                    <kbd className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-emerald-300 font-mono text-xs">
                                        {shortcut.hint}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300 mb-3">Panel Cepat</div>
                        <div className="space-y-2">
                            {TOGGLE_SHORTCUTS.map(shortcut => (
                                <div key={shortcut.id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-slate-200">{shortcut.label}</span>
                                    <kbd className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-cyan-300 font-mono text-xs">
                                        {shortcut.hint}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-300 mb-3">Sistem</div>
                        <div className="space-y-2">
                            {SYSTEM_SHORTCUTS.map(shortcut => (
                                <div key={shortcut.hint} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-slate-200">{shortcut.label}</span>
                                    <kbd className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-amber-300 font-mono text-xs">
                                        {shortcut.hint}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MainLayout() {
    const { playerProfile, day, time, logout: _logout, setGameState, activePage, setActivePage, activeQuests, activeStories, energy, reputation, playerStats, dailyArchive, derivedKpis, stats, kpi, accreditation, villageData, hiredStaff, pharmacyInventory, prolanisRoster, prbQueue, gameOver, dismissWarning, restartGame, activeReferral, setActiveReferral, activeReferralLog, outbreakNotification, dismissOutbreakNotification, showKPIGlobal, setShowKPIGlobal, wikiMetric, isWikiOpen, openWiki, closeWiki } = useGame();
    const { theme, toggleTheme: _toggleTheme } = useTheme();
    const { t: _t, i18n: _i18n } = useTranslation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [showPhone, setShowPhone] = useState(false);
    const [showQuests, setShowQuests] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDailyReport, setSelectedDailyReport] = useState(null);
    const [showAbout, setShowAbout] = useState(false);
    const [showAvatarEdit, setShowAvatarEdit] = useState(false);
    const [focusedStory, setFocusedStory] = useState(null);
    const [showShortcutHelp, setShowShortcutHelp] = useState(false);

    // Find interactive stories
    const interactiveStory = useMemo(() => {
        if (!activeStories) return null;
        return activeStories.find(s => !s.completed);
    }, [activeStories]);

    const isCalendarOpen = showCalendar || Boolean(selectedDailyReport);
    const isNarrativeOpen = Boolean(focusedStory || interactiveStory);
    const hasBlockingOverlay = Boolean(
        showPhone ||
        showQuests ||
        showSettings ||
        showStatus ||
        isCalendarOpen ||
        showAbout ||
        showAvatarEdit ||
        showKPIGlobal ||
        activeReferral ||
        outbreakNotification ||
        isWikiOpen ||
        isNarrativeOpen ||
        gameOver ||
        showShortcutHelp
    );

    const handleNavigateTarget = useCallback((targetId) => {
        if (targetId === 'rumah_dinas') {
            setGameState('rumah_dinas');
            return;
        }

        if (targetId === 'wiki') {
            openWiki('cppt');
            return;
        }

        setActivePage(targetId);
    }, [openWiki, setActivePage, setGameState]);

    const toggleShortcutPanel = useCallback((targetId) => {
        switch (targetId) {
            case 'phone':
                setShowPhone(prev => !prev);
                break;
            case 'quests':
                setShowQuests(prev => !prev);
                break;
            case 'status':
                setShowStatus(prev => !prev);
                break;
            case 'kpi':
                setShowKPIGlobal(prev => !prev);
                break;
            case 'settings':
                setShowSettings(prev => !prev);
                break;
            case 'calendar':
                if (isCalendarOpen) {
                    setSelectedDailyReport(null);
                    setShowCalendar(false);
                } else {
                    setSelectedDailyReport(null);
                    setShowCalendar(true);
                }
                break;
            case 'shortcut_help':
                setShowShortcutHelp(prev => !prev);
                break;
            default:
                break;
        }
    }, [isCalendarOpen, setShowKPIGlobal]);

    useEffect(() => {
        const isShortcutOpen = (shortcutId) => {
            switch (shortcutId) {
                case 'phone':
                    return showPhone;
                case 'quests':
                    return showQuests;
                case 'status':
                    return showStatus;
                case 'kpi':
                    return showKPIGlobal;
                case 'settings':
                    return showSettings;
                case 'calendar':
                    return isCalendarOpen;
                case 'shortcut_help':
                    return showShortcutHelp;
                default:
                    return false;
            }
        };

        const handleGlobalShortcut = (event) => {
            const shortcut = resolveGlobalGameShortcut(event);
            if (!shortcut) return;

            event.preventDefault();
            event.stopPropagation();

            if (!shouldExecuteGlobalGameShortcut(shortcut, { hasBlockingOverlay, isShortcutOpen })) {
                return;
            }

            if (shortcut.type === 'page') {
                handleNavigateTarget(shortcut.id);
                return;
            }

            if (shortcut.id === 'rumah_dinas') {
                handleNavigateTarget(shortcut.id);
                return;
            }

            toggleShortcutPanel(shortcut.id);
        };

        window.addEventListener('keydown', handleGlobalShortcut);
        return () => window.removeEventListener('keydown', handleGlobalShortcut);
    }, [hasBlockingOverlay, handleNavigateTarget, isCalendarOpen, showKPIGlobal, showPhone, showQuests, showSettings, showShortcutHelp, showStatus, toggleShortcutPanel]);


    // Check for claimable quests
    const hasClaimableQuests = activeQuests?.some(q => q.progress >= q.target && !q.claimed);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcutHint: PAGE_SHORTCUT_HINTS.dashboard },
        { id: 'clinical', label: 'Layanan', icon: Stethoscope, shortcutHint: PAGE_SHORTCUT_HINTS.clinical },
        { id: 'wilayah', label: 'Wilayah (Map)', icon: Map, shortcutHint: PAGE_SHORTCUT_HINTS.wilayah },
        { id: 'facility', label: 'Gedung', icon: Building2, shortcutHint: PAGE_SHORTCUT_HINTS.facility },
        { id: 'staff', label: 'SDM (Squad)', icon: Users, shortcutHint: PAGE_SHORTCUT_HINTS.staff },
        { id: 'inventory', label: 'Sarana (Logistik)', icon: Package, shortcutHint: PAGE_SHORTCUT_HINTS.inventory },
        { id: 'academy', label: 'Diklat', icon: GraduationCap, shortcutHint: PAGE_SHORTCUT_HINTS.academy },
        { id: 'wiki', label: 'MAIA Codex', icon: Brain, shortcutHint: PAGE_SHORTCUT_HINTS.wiki },
        { id: 'archive', label: 'Arsip', icon: Archive, shortcutHint: PAGE_SHORTCUT_HINTS.archive },
        { id: 'sensus', label: 'Kantor Desa', icon: Landmark, shortcutHint: PAGE_SHORTCUT_HINTS.sensus },
    ];


    // Sidebar gradient from active theme
    const sidebarGradient = theme?.sidebarGradient || 'from-emerald-900 to-teal-900';

    // Get energy color based on level
    const getEnergyColor = (e) => {
        if (e >= 70) return 'bg-green-500';
        if (e >= 40) return 'bg-amber-500';
        return 'bg-red-500';
    };

    // Derived XP Progress
    const xpPercentage = (playerStats.xp / (playerStats.nextLevelXp || 1000)) * 100;

    const wikiLiveStats = useMemo(() => {
        if (!wikiMetric) return null;
        switch (wikiMetric) {
            case 'energy':
                return {
                    'Level Energi': `${Math.round(energy)}%`,
                    'Status': energy > 70 ? 'Fit' : energy > 40 ? 'Lelah' : 'Exhausted'
                };
            case 'reputation':
                return {
                    'Skor Reputasi': reputation,
                    'Status': reputation > 80 ? 'Sangat Dipercaya' : 'Cukup'
                };
            case 'xp_level':
                return {
                    'Level': playerStats.level,
                    'XP': `${playerStats.xp} / ${playerStats.nextLevelXp}`,
                    'Pencapaian': 'Kepala Puskesmas'
                };
            case 'liquidity':
                return {
                    'Dana Kapitasi': `Rp ${(stats.kapitasi / 1000000).toFixed(1)}M`,
                    'Pendapatan Umum': `Rp ${(stats.pendapatanUmum / 1000000).toFixed(2)}M`
                };
            case 'staff_readiness': {
                const avg = hiredStaff.length > 0 ? Math.round(hiredStaff.reduce((sum, staff) => sum + (staff.performance || 0), 0) / hiredStaff.length) : 0;
                return { 'Total Staf': hiredStaff.length, 'Avg Readiness': `${avg}%` };
            }
            case 'rrns':
                return { 'Total Pasien': kpi.totalPatients, 'RRNS': `${derivedKpis.rrns}%`, 'Target': '< 5%' };
            case 'accreditation':
            case 'accreditation_chapters':
                return { 'Status': accreditation, 'Overall Score': derivedKpis.overallScore };
            case 'iks':
            case 'ukm_overview': {
                const families = villageData?.families || [];
                const avgIKS = families.length > 0 ? (families.reduce((sum, family) => sum + (family.iksScore || 0), 0) / families.length) : 0;
                return { 'Rata-rata IKS': `${(avgIKS * 100).toFixed(1)}%`, 'Total KK': families.length };
            }
            case 'kbk': {
                const population = villageData?.stats?.totalPopulation || 1;
                const months = Math.max(1, day / 30);
                return {
                    'Angka Kontak': `${Math.round((kpi.totalPatients / population) * 1000 / months)} per 1000`,
                    'RRNS': `${derivedKpis.referralRate}%`
                };
            }
            case 'angka_kontak':
                return {
                    'Total Kontak': kpi.totalPatients,
                    'Populasi': villageData?.stats?.totalPopulation || 1
                };
            case 'skdi_coverage':
                return { 'Total Pasien Ditangani': kpi.totalPatients };
            case 'prolanis_compliance':
                return { 'Peserta Prolanis': prolanisRoster?.length || 0 };
            case 'stress':
                return { 'Stress': `${playerStats.stress}%`, 'Energy': `${Math.round(playerStats.energy)}%` };
            case 'accuracy':
                return { 'Akurasi Diagnosa': `${derivedKpis.clinicalAccuracy}%`, 'Total Pasien': kpi.totalPatients };
            case 'treatment':
                return { 'Terapi Rasional': `${derivedKpis.treatmentAppropriateRate}%` };
            case 'antibiotics':
                return { 'AB Stewardship': `${derivedKpis.antibioticStewardship}%` };
            case 'patient_safety':
                return {
                    'Akurasi': `${derivedKpis.clinicalAccuracy}%`,
                    'Terapi': `${derivedKpis.treatmentAppropriateRate}%`,
                    'AB': `${derivedKpis.antibioticStewardship}%`
                };
            case 'prb':
                return {
                    'PRB Aktif': prbQueue?.filter(p => p.status === 'active').length || 0,
                    'PRB Selesai': prbQueue?.filter(p => p.status === 'completed').length || 0
                };
            case 'inventory': {
                const outOfStock = pharmacyInventory?.filter(item => item.stock === 0).length || 0;
                return { 'Total Item': pharmacyInventory?.length || 0, 'Stok Habis': outOfStock };
            }
            case 'ukp_overview':
                return { 'Akurasi Klinis': `${derivedKpis.clinicalAccuracy}%`, 'Total Pasien': kpi.totalPatients };
            default:
                return null;
        }
    }, [wikiMetric, energy, reputation, playerStats, stats, kpi, derivedKpis, accreditation, villageData, hiredStaff, prolanisRoster, prbQueue, pharmacyInventory, day]);

    return (
        <div className="flex h-screen bg-[var(--color-bg-main)] overflow-hidden font-sans text-[var(--color-text-main)] transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`flex flex-col bg-gradient-to-b ${sidebarGradient} text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} shadow-xl z-20 overflow-x-hidden`}
            >
                {/* Brand */}
                <div
                    className={`${sidebarCollapsed ? 'p-2' : 'p-4'} flex items-center gap-3 border-b border-white/10 h-16 cursor-pointer hover:bg-white/5 transition-all group/brand`}
                    onClick={() => setShowAbout(true)}
                    title="Tentang PRIMER"
                >
                    <div className="bg-white/10 p-2 rounded-lg group-hover/brand:bg-emerald-500/20 transition-colors">
                        <Dna size={24} className="text-emerald-400" />
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <h1 className="font-display font-bold text-lg leading-tight tracking-wider group-hover/brand:text-emerald-300 transition-colors">PRIMER</h1>
                            <p className="text-[10px] text-emerald-200 opacity-80 uppercase tracking-widest">{APP_METADATA.fullName}</p>
                        </div>
                    )}
                </div>

                {/* RPG Avatar Profile (The "Hero") */}
                <div className={`${sidebarCollapsed ? 'p-1' : 'p-4'} border-b border-white/10 relative group transition-all`}>
                    <div
                        className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''} cursor-pointer hover:brightness-110 transition-all`}
                        title={`Status / Junction (${TOGGLE_SHORTCUT_HINTS.status})`}
                        onClick={() => setShowStatus(true)}
                    >
                        {/* Avatar Circle with XP Ring */}
                        <div className="relative w-12 h-12 flex-shrink-0 cursor-help">
                            {/* XP Ring SVG */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-white/10"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className="text-amber-400 transition-all duration-1000 ease-out"
                                    strokeDasharray={`${xpPercentage}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                            </svg>

                            {/* Avatar Icons */}
                            <div className="absolute inset-1 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                                <AvatarRenderer avatar={playerProfile?.avatar} size={36} />
                            </div>

                            {/* Level Badge */}
                            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full border border-slate-900 shadow-sm">
                                Lv.{playerStats.level}
                            </div>
                        </div>

                        {!sidebarCollapsed && (
                            <div className="overflow-hidden flex-1">
                                <p className="font-bold text-sm truncate">{playerProfile?.name || 'Dr. Player'}</p>
                                <div className="text-xs text-emerald-300 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    Kepala Puskesmas
                                </div>
                            </div>
                        )}

                        {!sidebarCollapsed && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowAvatarEdit(true); }}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                title="Ganti Avatar"
                                aria-label="Ganti Avatar"
                            >
                                <Sparkles size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <ul className="space-y-1 px-2">
                        {menuItems.map(item => (
                            <li key={item.id} className="relative group">
                                <button
                                    onClick={() => handleNavigateTarget(item.id)}
                                    title={`${item.label} (${item.shortcutHint})`}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${sidebarCollapsed ? 'justify-center' : ''} ${activePage === item.id
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 font-medium'
                                        : item.special
                                            ? 'text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 border border-yellow-500/30'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={20} className={activePage === item.id ? 'animate-pulse-slow' : ''} />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </button>
                                {/* PS-style hover label when collapsed */}
                                {sidebarCollapsed && (
                                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl backdrop-blur-sm">
                                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-slate-900/95 border-b-[6px] border-b-transparent"></div>
                                        {item.label}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer / Personal Area */}
                <div className={`mt-auto ${sidebarCollapsed ? 'p-1' : 'p-2'} space-y-1.5 border-t border-white/10 transition-all`}>
                    <div className="relative group">
                        <button
                            onClick={() => handleNavigateTarget('rumah_dinas')}
                            aria-label="Rumah Dinas"
                            title={`Rumah Dinas (${TOGGLE_SHORTCUT_HINTS.rumah_dinas})`}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 border border-yellow-500/20 ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <Home size={20} />
                            {!sidebarCollapsed && <span className="font-bold">Rumah Dinas</span>}
                        </button>
                        {sidebarCollapsed && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-yellow-500 text-slate-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-yellow-500 border-b-[6px] border-b-transparent"></div>
                                🏠 Rumah Dinas
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => setShowSettings(true)}
                            aria-label="Buka Pengaturan"
                            title={`Pengaturan (${TOGGLE_SHORTCUT_HINTS.settings})`}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            <Settings size={18} />
                            {!sidebarCollapsed && <span className="text-sm font-medium">Setting</span>}
                        </button>
                        {sidebarCollapsed && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl backdrop-blur-sm">
                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-slate-900/95 border-b-[6px] border-b-transparent"></div>
                                ⚙️ Setting
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            aria-label={sidebarCollapsed ? 'Buka Panel Samping' : 'Tutup Panel Samping'}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-slate-500 hover:text-white hover:bg-white/5 ${sidebarCollapsed ? 'justify-center' : ''}`}
                        >
                            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                            {!sidebarCollapsed && <span className="text-xs font-medium text-slate-500">Tutup Panel</span>}
                        </button>
                        {sidebarCollapsed && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl backdrop-blur-sm">
                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-slate-900/95 border-b-[6px] border-b-transparent"></div>
                                📂 Buka Panel
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-main)] relative">
                {/* Top Bar — Slim Futuristic HUD */}
                <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 h-11 px-4 flex items-center justify-between shadow-lg shadow-black/20 z-10 relative border-b border-slate-700/50">
                    {/* LEFT: Vitals */}
                    <div className="flex items-center gap-2">
                        {/* Energy */}
                        <button
                            onClick={() => openWiki('energy')}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                            aria-label={`Energi: ${Math.round(energy)}%`}
                            title="Energi Dokter"
                        >
                            <span className="text-sm">⚡</span>
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${getEnergyColor(energy)}`}
                                    style={{ width: `${energy}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 tabular-nums">{Math.round(energy)}</span>
                        </button>

                        <div className="w-px h-4 bg-slate-700" />

                        {/* Reputation */}
                        <button
                            onClick={() => openWiki('reputation')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                            aria-label={`Reputasi: ${reputation}`}
                            title="Skor Reputasi"
                        >
                            <span className="text-sm">⭐</span>
                            <span className="text-[10px] font-bold text-amber-400 tabular-nums">{reputation}</span>
                        </button>

                        {/* PRB Badge */}
                        {prbQueue && prbQueue.filter(p => p.status === 'active').length > 0 && (
                            <>
                                <div className="w-px h-4 bg-slate-700" />
                                <button
                                    onClick={() => setActivePage('dashboard')}
                                    className="flex items-center gap-1 bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold hover:bg-cyan-500/20 transition-all"
                                    title="Pasien PRB Aktif"
                                >
                                    📋 {prbQueue.filter(p => p.status === 'active').length} PRB
                                </button>
                            </>
                        )}
                    </div>
                     {/* CENTER: Luxury Time Controller */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <TimeController onOpenCalendar={() => setShowCalendar(true)} />
                    </div>
                    {/* RIGHT: System & Meta */}
                    <div className="flex items-center gap-1">
                        {/* Home (contextual) */}
                        {((time >= 720 && time < 780) || time >= 960) && (
                            <button
                                onClick={() => setGameState('rumah_dinas')}
                                className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-500 transition-all text-[10px] font-bold mr-1"
                                title={`Pulang ke Rumah (${TOGGLE_SHORTCUT_HINTS.rumah_dinas})`}
                            >
                                <Home size={12} />
                                Pulang
                            </button>
                        )}

                        {/* Quests */}
                        <div className="relative">
                            <button
                                onClick={() => setShowQuests(!showQuests)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all relative ${showQuests ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                title={`Misi (${TOGGLE_SHORTCUT_HINTS.quests})`}
                            >
                                <span className="text-sm">📜</span>
                                {hasClaimableQuests && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                                    </span>
                                )}
                            </button>
                            {showQuests && (
                                <div className="absolute top-10 right-0 z-50 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <ErrorBoundary
                                        name="QuestBoard"
                                        resetKeys={[showQuests]}
                                        fallbackAction={() => setShowQuests(false)}
                                        fallbackActionLabel="Tutup Misi"
                                    >
                                        <div className="max-h-[80vh] overflow-hidden flex">
                                            <QuestBoard />
                                        </div>
                                    </ErrorBoundary>
                                </div>
                            )}
                        </div>

                        {/* KPI Review */}
                        <button
                            onClick={() => setShowKPIGlobal(true)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all relative ${showKPIGlobal ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            title={`Review Kinerja (KPI) (${TOGGLE_SHORTCUT_HINTS.kpi})`}
                        >
                            <Activity size={14} />
                            {derivedKpis?.overallScore < 70 && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            )}
                        </button>

                        <button
                            onClick={() => setShowCalendar(true)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${showCalendar ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            title={`Kalender (${TOGGLE_SHORTCUT_HINTS.calendar})`}
                            aria-label="Buka Kalender"
                        >
                            <span className="text-sm">📅</span>
                        </button>

                        <button
                            onClick={() => setShowShortcutHelp(true)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${showShortcutHelp ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                            title="Shortcut Keyboard (?)"
                            aria-label="Buka bantuan shortcut keyboard"
                        >
                            <Keyboard size={14} />
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all"
                            title={`Pengaturan (${TOGGLE_SHORTCUT_HINTS.settings})`}
                        >
                            <Settings size={14} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Render Page based on state */}
                    <Suspense fallback={<PageLoader />}>
                        {activePage === 'dashboard' && (
                            <ErrorBoundary
                                name="DashboardPage"
                                resetKeys={[activePage]}
                                fallbackAction={safeReloadPage}
                                fallbackActionLabel="Muat Ulang App"
                            >
                                <DashboardPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'clinical' && (
                            <ErrorBoundary
                                name="ClinicalPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <ClinicalPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'wilayah' && (
                            <ErrorBoundary
                                name="WilayahPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <WilayahPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'facility' && (
                            <ErrorBoundary
                                name="GedungPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <GedungPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'staff' && (
                            <ErrorBoundary
                                name="StaffPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <StaffPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'inventory' && (
                            <ErrorBoundary
                                name="InventoryPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <InventoryPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'academy' && (
                            <ErrorBoundary
                                name="DiklatPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <DiklatPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'archive' && (
                            <ErrorBoundary
                                name="ArsipPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <ArsipPage />
                            </ErrorBoundary>
                        )}
                        {activePage === 'sensus' && (
                            <ErrorBoundary
                                name="SensusPage"
                                resetKeys={[activePage]}
                                fallbackAction={() => setActivePage('dashboard')}
                                fallbackActionLabel="Kembali ke Dashboard"
                            >
                                <SensusPage />
                            </ErrorBoundary>
                        )}
                    </Suspense>
                </div>
            </main>

            {/* Smartphone Overlay */}
            {showPhone && (
                <ErrorBoundary
                    name="Smartphone"
                    resetKeys={[showPhone]}
                    fallbackAction={() => setShowPhone(false)}
                    fallbackActionLabel="Tutup Smartphone"
                >
                    <Smartphone onClose={() => setShowPhone(false)} />
                </ErrorBoundary>
            )}
            <button
                onClick={() => setShowPhone(!showPhone)}
                className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-2xl hover:bg-slate-700 hover:scale-110 transition-all z-50 border-4 border-slate-600"
                aria-label={showPhone ? 'Tutup Smartphone' : 'Buka Smartphone'}
                title={`Smartphone (${TOGGLE_SHORTCUT_HINTS.phone})`}
            >
                <PhoneIcon size={24} />
            </button>

            {showShortcutHelp && <ShortcutHelpModal onClose={() => setShowShortcutHelp(false)} />}

            {/* Lazy-loaded Modals (wrapped in Suspense) */}
            <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="status" aria-label="Memuat modal"><div className="w-8 h-8 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" /></div>}>
                {/* Settings Modal */}
                {showSettings && (
                    <ErrorBoundary
                        name="SettingsModal"
                        resetKeys={[showSettings]}
                        fallbackAction={() => setShowSettings(false)}
                        fallbackActionLabel="Tutup Modal"
                    >
                        <SettingsModal onClose={() => setShowSettings(false)} />
                    </ErrorBoundary>
                )}

                {/* Avatar Selection Modal */}
                {showAvatarEdit && (
                    <ErrorBoundary
                        name="AvatarSelectionModal"
                        resetKeys={[showAvatarEdit]}
                        fallbackAction={() => setShowAvatarEdit(false)}
                        fallbackActionLabel="Tutup Modal"
                    >
                        <AvatarSelectionModal onClose={() => setShowAvatarEdit(false)} />
                    </ErrorBoundary>
                )}

                {/* FF8 Status Modal */}
                {showStatus && (
                    <ErrorBoundary
                        name="StatusJunctionModal"
                        resetKeys={[showStatus]}
                        fallbackAction={() => setShowStatus(false)}
                        fallbackActionLabel="Tutup Modal"
                    >
                        <StatusJunctionModal onClose={() => setShowStatus(false)} onOpenWiki={openWiki} />
                    </ErrorBoundary>
                )}

                {/* Calendar Modal */}
                {showCalendar && (
                    <ErrorBoundary
                        name="CalendarModal"
                        resetKeys={[showCalendar]}
                        fallbackAction={() => setShowCalendar(false)}
                        fallbackActionLabel="Tutup Modal"
                    >
                        <CalendarModal
                            currentDay={day}
                            dailyArchive={dailyArchive}
                            onSelectDay={(dayData) => {
                                setSelectedDailyReport(dayData);
                                setShowCalendar(false);
                            }}
                            onClose={() => setShowCalendar(false)}
                        />
                    </ErrorBoundary>
                )}

                {/* Daily Report Modal */}
                {selectedDailyReport && (
                    <ErrorBoundary
                        name="DailyReportModal"
                        resetKeys={[selectedDailyReport?.day || null]}
                        fallbackAction={() => setSelectedDailyReport(null)}
                        fallbackActionLabel="Tutup Laporan"
                    >
                        <DailyReportModal
                            dayData={selectedDailyReport}
                            dailyArchive={dailyArchive}
                            onNavigate={(newData) => setSelectedDailyReport(newData)}
                            onBackToCalendar={() => {
                                setSelectedDailyReport(null);
                                setShowCalendar(true);
                            }}
                            onClose={() => setSelectedDailyReport(null)}
                        />
                    </ErrorBoundary>
                )}

                {/* Global KPI Dashboard Modal */}
                {showKPIGlobal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-modal p-4 animate-in fade-in duration-300">
                        <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
                            <button
                                onClick={() => setShowKPIGlobal(false)}
                                className="absolute top-4 right-4 z-modal-close p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"
                                aria-label="Tutup Review KPI"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex-1 overflow-hidden">
                                <ErrorBoundary
                                    name="KPIDashboard"
                                    resetKeys={[showKPIGlobal]}
                                    fallbackAction={() => setShowKPIGlobal(false)}
                                    fallbackActionLabel="Tutup Review"
                                >
                                    <KPIDashboard />
                                </ErrorBoundary>
                            </div>
                            <div className="bg-slate-50 p-4 border-t flex justify-end shrink-0">
                                <button
                                    onClick={() => setShowKPIGlobal(false)}
                                    className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-bold transition-all"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Educational Wiki Modal */}
                <ErrorBoundary
                    name="EducationalWikiModal"
                    resetKeys={[isWikiOpen, wikiMetric]}
                    fallbackAction={closeWiki}
                    fallbackActionLabel="Tutup Wiki"
                >
                    <EducationalWikiModal
                        isOpen={isWikiOpen}
                        onClose={closeWiki}
                        metricKey={wikiMetric}
                        liveStats={wikiLiveStats}
                    />
                </ErrorBoundary>
                {/* Narrative Overlay */}
                {(focusedStory || interactiveStory) && (
                    <ErrorBoundary
                        name="NarrativeOverlay"
                        resetKeys={[focusedStory?.id || interactiveStory?.id || null]}
                        fallbackAction={() => setFocusedStory(null)}
                        fallbackActionLabel="Tutup Narasi"
                    >
                        <NarrativeOverlay
                            storyInstance={focusedStory || interactiveStory}
                            onClose={() => setFocusedStory(null)}
                        />
                    </ErrorBoundary>
                )}
            </Suspense>

            {/* About PRIMER Modal */}
            {showAbout && (
                <ErrorBoundary
                    name="AboutModal"
                    resetKeys={[showAbout]}
                    fallbackAction={() => setShowAbout(false)}
                    fallbackActionLabel="Tutup Modal"
                >
                    <AboutModal onClose={() => setShowAbout(false)} />
                </ErrorBoundary>
            )}

            {/* Referral SISRUTE Modal */}
            {activeReferral && (
                <ErrorBoundary
                    name="ReferralSISRUTEModal"
                    resetKeys={[activeReferral?.patientId || activeReferral?.id || null]}
                    fallbackAction={() => setActiveReferral(null)}
                    fallbackActionLabel="Tutup Rujukan"
                >
                    <ReferralSISRUTEModal
                        activeReferral={activeReferral}
                        onClose={() => setActiveReferral(null)}
                    />
                </ErrorBoundary>
            )}

            {/* Referral HUD Tracker */}
            <ReferralHUD activeReferralLog={activeReferralLog} time={time} />

            {/* Outbreak Notification Overlay */}
            <OutbreakBanner
                outbreakNotification={outbreakNotification}
                onViewMap={() => setActivePage('wilayah')}
                onDismiss={() => dismissOutbreakNotification()}
            />

            {/* Outbreak Detail Modal (Global) */}
            <ErrorBoundary
                name="OutbreakModal"
                resetKeys={[outbreakNotification?.id || outbreakNotification?.title || null]}
                fallbackAction={() => dismissOutbreakNotification()}
                fallbackActionLabel="Tutup Notifikasi"
            >
                <OutbreakModal
                    isOpen={!!outbreakNotification}
                    onClose={() => dismissOutbreakNotification()}
                />
            </ErrorBoundary>

            {/* Pause Overlay (Frosted Glass) */}
            <PauseOverlay />

            {/* Global Game Over / Warning / Faint Modal */}
            {gameOver && (
                <GameOverModal
                    type={gameOver.type}
                    reason={gameOver.reason}
                    onContinue={dismissWarning}
                    onRestart={restartGame}
                />
            )}
        </div>
    );
}
