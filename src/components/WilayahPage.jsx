/**
 * @reflection
 * [IDENTITY]: WilayahPage
 * [PURPOSE]: Strategy-game–style interactive village map with transparent floating HUD panels.
 * [STATE]: Experimental
 * [ANCHOR]: WilayahPage
 * [DEPENDS_ON]: GameContext, EducationalWikiModal, WikiData, VillageRegistry, TextureGenerator, wilayah modular components
 * [KNOWN_ISSUES]: None
 * [LAST_UPDATE]: 2026-02-18
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import {
    Map, Home as HomeIcon, Users, Activity,
    Layers, Search, X, Bug, BookOpen,
    Plus, Minus, Minimize, Check, Heart,
    Footprints, Building
} from 'lucide-react';

import EducationalWikiModal from './EducationalWikiModal.jsx';

// Modular Imports
import {
    BUILDING_TYPES,
    getBuildingInsetUrl,
    PISPK_INDICATORS,
    HOME_VISIT_INTERVENTIONS
} from './wilayah/constants.js';
import { generateVillageMap, getWikiKeyForBuilding } from './wilayah/map-utils.js';
import {
    PISPKPanel,
    IKSBoardPanel
} from './wilayah/AuxiliaryComponents.jsx';
import BuildingGamePanel from './wilayah/BuildingGamePanel.jsx';
import PosyanduActivePanel from './wilayah/PosyanduActivePanel.jsx';
import PustuActivePanel from './wilayah/PustuActivePanel.jsx';
import CommunityDiagnosisPanel from './wilayah/CommunityDiagnosisPanel.jsx';
import BehaviorCasePanel from './wilayah/BehaviorCasePanel.jsx';
import WilayahDiorama from './wilayah/3d/WilayahDiorama.jsx';
import { isGameEnabledBuilding } from './wilayah/buildingScenes.js';

import { getCachedTextures, generateTextures } from '../utils/TextureGenerator.js';
import { guardStability } from '../utils/prophylaxis.js';
import VillagerBehavior from '../domains/village/VillagerBehavior.js';
import { VILLAGE_FAMILIES } from '../domains/village/VillageRegistry.js';

// ─── VisionOS Glassmorphism (Apple Vision Pro Style) ───────────────
const GLASS = 'bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]';
const GLASS_HOVER = 'hover:bg-slate-800/80 transition-all duration-300';

export default function WilayahPage() {
    useEffect(() => {
        guardStability('NAV_WILAYAH_INIT', 2000, 3);
    }, []);

    const {
        day, villageData, setVillageData,
        viewParams, navigate, history, playerStats, setPlayerStats,
        addXp, publicHealth,
        openWiki, isWikiOpen, closeWiki, updateProgress, wikiMetric,
        triggerIKMEvent, applyBuildingSDOH
    } = useGame();

    const energy = Math.max(0, Math.floor(Number(playerStats?.energy) || 0));

    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [viewMode, setViewMode] = useState('map');
    const [activeLayer, setActiveLayer] = useState('general');
    const [homeVisitModal, setHomeVisitModal] = useState(null);
    const [showRiskOnly, setShowRiskOnly] = useState(false);
    const [zoom, setZoom] = useState(0.4);
    const [buildingInterior, setBuildingInterior] = useState(null);
    const [activeIKMEventId, setActiveIKMEventId] = useState(null);
    const [activeBCCase, setActiveBCCase] = useState(null); // Behavior Change Case panel
    const viewportRef = useRef(null);
    const dioramaZoomRef = useRef(null); // ref for 3D camera zoom callbacks
    const [diveWhiteout, setDiveWhiteout] = useState(false); // Dollhouse Dive flash
    const [textures] = useState(() => {
        const cached = getCachedTextures('v10-modular-refactor');
        return cached || generateTextures('v10-modular-refactor');
    });

    // ═══ TOPOLOGY DECOUPLING (Performance Critical!) ═══════════════════
    // Static map geometry: generated ONCE, never regenerated on data changes
    const isDataLoaded = !!villageData?.families;
    const staticMapTopology = useMemo(() => {
        if (!isDataLoaded) return null;
        return generateVillageMap(60, 50, 42, villageData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataLoaded]); // Only depends on data EXISTING, not data CHANGING

    // Dynamic data injection: lightweight O(N) operation (~0.1ms)
    const mapData = useMemo(() => {
        if (!staticMapTopology || !villageData?.families) return null;
        const families = villageData.families.map(f => {
            const phbs = VillagerBehavior.calculatePHBSScore(f);
            const risk = VillagerBehavior.classifyBehavioralRisk(f);
            return {
                ...f, phbsScore: phbs, behaviorRisk: risk?.level || 'low',
                behaviorEmoji: risk?.level === 'high' ? '🔴' : risk?.level === 'medium' ? '🟠' : '🟢'
            };
        });
        const buildings = staticMapTopology.buildings.map(b => {
            if (!b.familyId) return b;
            return { ...b, familyData: families.find(f => f.id === b.familyId) };
        });
        return { ...staticMapTopology, buildings, families };
    }, [staticMapTopology, villageData]);


    const scrollToBuilding = useCallback((building) => {
        if (!viewportRef.current || !building) return;
        const container = viewportRef.current;
        const TILE_SIZE = 36;
        const paddingX = container.clientWidth * 0.15;
        const paddingY = container.clientHeight * 0.15;
        const targetX = (paddingX + building.x * TILE_SIZE + 1.5 * TILE_SIZE) * zoom;
        const targetY = (paddingY + building.y * TILE_SIZE + 1.5 * TILE_SIZE) * zoom;
        container.scrollTo({
            left: targetX - container.clientWidth / 2,
            top: targetY - container.clientHeight / 2,
            behavior: 'smooth'
        });
    }, [zoom]);

    useEffect(() => {
        if (viewParams && viewParams.focusHouseId && mapData) {
            const target = mapData.buildings.find(b => b.id === viewParams.focusHouseId || b.familyId === viewParams.focusHouseId);
            if (target) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync view state from navigation params
                setViewMode('map');
                setSelectedBuilding(target);
                setTimeout(() => scrollToBuilding(target), 300);
            }
        }
    }, [viewParams, mapData, scrollToBuilding]);

    const surveillanceStatus = useMemo(() => {
        const status = {};
        if (!villageData || !history) return status;
        const recentHistory = history.filter(p => (day - p.day) <= 14);
        recentHistory.forEach(p => {
            if (!p.medicalData || !p.medicalData.diagnosisCode) return;
            const dx = p.medicalData.diagnosisCode;
            const houseId = p.hidden?.familyId ? villageData.families.find(f => f.id === p.hidden.familyId)?.houseId : null;
            if (houseId) {
                let caseType = null;
                if (dx.startsWith('A90') || dx.startsWith('A91')) caseType = 'dbd';
                else if (dx.startsWith('B5')) caseType = 'malaria';
                else if (dx.startsWith('A0')) caseType = 'diare';
                else if (dx.startsWith('J1')) caseType = 'pneumonia';
                if (caseType) {
                    status[houseId] = {
                        hasCase: true,
                        caseType,
                        patientName: p.name,
                        diagnosis: p.medicalData.diagnosisName,
                        date: p.day
                    };
                }
            }
        });
        return status;
    }, [history, day, villageData]);

    const centerMap = useCallback(() => {
        if (viewportRef.current && mapData) {
            const container = viewportRef.current;
            const TILE_SIZE = 36;
            const vw = container.clientWidth;
            const vh = container.clientHeight;
            const paddingX = vw * 0.15;
            const paddingY = vh * 0.15;
            const midX = mapData.width / 2;
            const midY = mapData.height / 2;
            const targetX = (paddingX + midX * TILE_SIZE) * zoom;
            const targetY = (paddingY + midY * TILE_SIZE) * zoom;
            container.scrollTo({
                left: targetX - vw / 2,
                top: targetY - vh / 2,
                behavior: 'smooth'
            });
        }
    }, [mapData, zoom]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            // Zero-render zoom: call ref directly, no setState
            if (e.key === '+' || e.key === '=') {
                dioramaZoomRef.current?.zoomIn();
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                dioramaZoomRef.current?.zoomOut();
                e.preventDefault();
            } else if (e.key === '0') {
                dioramaZoomRef.current?.reset();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                setSelectedBuilding(null);
            }
            // Layer shortcuts (1-6)
            const layerMap = { '1': 'general', '2': 'pispk', '3': 'surveillance', '4': 'psn', '5': 'phbs', '6': 'perilaku' };
            if (layerMap[e.key]) setActiveLayer(layerMap[e.key]);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Loading guard (moved after all hooks to avoid Rules of Hooks violation)
    if (!mapData || !textures) {
        return (
            <ErrorBoundary>
                <div className="relative w-full h-screen overflow-hidden bg-[#0a0f0d] flex items-center justify-center">
                    <div className="text-center space-y-4 animate-pulse">
                        <Map className="mx-auto text-emerald-500/40" size={48} />
                        <p className="text-white/40 text-sm font-black uppercase tracking-widest">Memuat Peta Wilayah...</p>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    const stats = {
        totalHouses: villageData?.families?.length || 0,
        avgIks: villageData?.families?.reduce((acc, f) => {
            const ind = f.indicators || {};
            const scored = Object.values(ind).filter(v => v !== null).length;
            const healthy = Object.values(ind).filter(v => v === true).length;
            return acc + (scored > 0 ? healthy / scored : 0);
        }, 0) / (villageData?.families?.length || 1),
        alertCount: Object.keys(surveillanceStatus).length
    };

    // ─── Compute actual IKS for selected building ───
    const selectedFamily = selectedBuilding?.familyId
        ? villageData?.families?.find(f => f.id === selectedBuilding.familyId)
        : null;
    const selectedIks = selectedFamily
        ? (() => {
            const ind = selectedFamily.indicators || {};
            const scored = Object.values(ind).filter(v => v !== null).length;
            const healthy = Object.values(ind).filter(v => v === true).length;
            return scored > 0 ? healthy / scored : 0;
        })()
        : 0;
    const iksLabel = selectedIks >= 0.8 ? 'SEHAT' : selectedIks >= 0.5 ? 'PRA SEHAT' : 'TIDAK SEHAT';
    const iksColor = selectedIks >= 0.8 ? 'text-emerald-400' : selectedIks >= 0.5 ? 'text-amber-400' : 'text-red-400';

    const handleHomeVisitAction = (action) => {
        if (energy < action.energy) return;
        const family = villageData.families.find(f => f.id === selectedBuilding.familyId);
        if (!family) return;
        let updatedIndicators = { ...family.indicators };
        // Support both singular `indicator` and plural `indicators` array
        const idsToUpdate = action.indicators || (action.indicator ? [action.indicator] : []);
        idsToUpdate.forEach(id => { updatedIndicators[id] = true; });
        setVillageData(prev => ({
            ...prev,
            families: prev.families.map(f => f.id === family.id ? { ...f, indicators: updatedIndicators } : f)
        }));
        setPlayerStats(prev => ({ ...prev, energy: energy - action.energy }));
        addXp(action.xp);

        if (updateProgress) {
            updateProgress('home_visits', 1);
            if (action.id === 'psn') {
                updateProgress('psn_done', 1);
            }
        }

        navigate('megalog', { type: 'home_visit', familyId: family.id, action: action.id });
    };

    // ─── Overlay layer definitions ──────────────────────────────
    const OVERLAY_LAYERS = [
        { id: 'general', label: 'Infrastruktur', icon: Building, color: 'text-slate-300' },
        { id: 'pispk', label: 'PIS-PK', icon: HomeIcon, color: 'text-blue-400' },
        { id: 'surveillance', label: 'Surveilans', icon: Activity, color: 'text-rose-400' },
        { id: 'psn', label: 'Jentik', icon: Bug, color: 'text-lime-400' },
        { id: 'phbs', label: 'PHBS', icon: Heart, color: 'text-pink-400' },
        { id: 'perilaku', label: 'Perilaku', icon: Users, color: 'text-indigo-400' }
    ];

    return (
        <ErrorBoundary>
            <div className="relative w-full h-screen overflow-hidden bg-[#1a2614] font-sans select-none"
                onContextMenu={(e) => e.preventDefault()}>
                {/* ═══════════════════════════════════════════════════
                    LAYER 0: FULL MAP (takes entire viewport)
                   ═══════════════════════════════════════════════════ */}
                {/* TACTICAL VIGNETTE — color shifts per active layer */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none transition-colors duration-1000"
                    style={{
                        boxShadow: `inset 0 0 180px 30px ${activeLayer === 'surveillance' ? 'rgba(225,29,72,0.12)' :
                            activeLayer === 'pispk' ? 'rgba(56,189,248,0.08)' :
                                activeLayer === 'phbs' ? 'rgba(244,114,182,0.08)' :
                                    activeLayer === 'perilaku' ? 'rgba(129,140,248,0.08)' :
                                        activeLayer === 'psn' ? 'rgba(163,230,53,0.08)' :
                                            'transparent'
                            }`
                    }}
                />

                <div className="absolute inset-0">
                    <WilayahDiorama
                        mapData={mapData}
                        selectedBuildingId={selectedBuilding?.id}
                        onBuildingSelect={setSelectedBuilding}
                        zoomRef={dioramaZoomRef}
                        activeLayer={activeLayer}
                    />
                </div>

                {/* ═══════════════════════════════════════════════════
                    LAYER 1: TOP HUD BAR (transparent)
                   ═══════════════════════════════════════════════════ */}
                <div className={`absolute top-0 left-0 right-0 z-30 ${GLASS} border-t-0 border-x-0`}
                    onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-5 py-3">
                        {/* Left: Back + Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('dashboard')}
                                className={`p-2 rounded-lg ${GLASS_HOVER} text-white/60 hover:text-white`}
                                aria-label="Kembali ke dashboard"
                            >
                                <X size={18} />
                            </button>
                            <div>
                                <h2 className="text-sm font-black text-white/90 tracking-tight flex items-center gap-2">
                                    <Map className="text-emerald-400" size={16} />
                                    Wilayah Kerja Puskesmas
                                </h2>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                    Desa Sukamaju • Hari ke-{day}
                                </p>
                            </div>
                        </div>

                        {/* Center: Stats */}
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <HomeIcon size={12} />
                                <span>{stats.totalHouses} KK</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                                <Activity size={12} />
                                <span>IKS {(stats.avgIks * 100).toFixed(0)}%</span>
                            </div>
                            {stats.alertCount > 0 && (
                                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                                    <span>⚠️ {stats.alertCount} KASUS</span>
                                </div>
                            )}
                            {publicHealth?.activeIKMEvents?.length > 0 && (
                                <button
                                    onClick={() => setActiveIKMEventId(publicHealth.activeIKMEvents[0].instanceId)}
                                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 animate-pulse transition-colors"
                                    title="Ada Kasus IKM aktif!"
                                >
                                    <span>🛡️ {publicHealth.activeIKMEvents.length} IKM</span>
                                </button>
                            )}
                            <div className="flex items-center gap-2 text-blue-400">
                                <span>⚡ {energy} EP</span>
                            </div>
                        </div>

                        {/* Right: View Mode + Sensus */}
                        <div className="flex items-center gap-2">
                            <div className={`flex rounded-lg overflow-hidden ${GLASS}`}>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'map' ? 'bg-emerald-500/30 text-emerald-300' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    PETA
                                </button>
                                <button
                                    onClick={() => setViewMode('satelite')}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'satelite' ? 'bg-emerald-500/30 text-emerald-300' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    SATELIT
                                </button>
                            </div>
                            <button
                                onClick={() => navigate('sensus')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${GLASS} ${GLASS_HOVER} text-amber-300`}
                            >
                                📊 SENSUS
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════
                    LAYER 2: BOTTOM HUD BAR (transparent toolbar)
                   ═══════════════════════════════════════════════════ */}
                <div className={`absolute bottom-0 left-0 right-0 z-30 ${GLASS} border-b-0 border-x-0`}
                    onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-5 py-2.5">
                        {/* Left: Overlay Layer Buttons */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mr-2">Overlay</span>
                            {OVERLAY_LAYERS.map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => {
                                        setActiveLayer(layer.id);
                                        // Assuming setOverlayPanelOpen is defined elsewhere or removed
                                        // if (layer.id !== 'general') setOverlayPanelOpen(true);
                                        // else setOverlayPanelOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeLayer === layer.id
                                        ? 'bg-white/20 text-white shadow-lg shadow-white/5'
                                        : `text-white/40 ${GLASS_HOVER}`
                                        }`}
                                    title={layer.label}
                                >
                                    <layer.icon size={12} />
                                    <span className="hidden sm:inline">{layer.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Center: Active layer legend (inline) */}
                        <div className="flex items-center gap-3">
                            {activeLayer === 'pispk' && (
                                <div className="flex items-center gap-3 text-[9px] font-bold animate-in fade-in duration-300">
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input type="checkbox" checked={showRiskOnly} onChange={() => setShowRiskOnly(!showRiskOnly)} className="hidden" />
                                        <div className={`w-3.5 h-3.5 rounded border transition-colors ${showRiskOnly ? 'bg-rose-500 border-rose-500' : 'border-white/30'}`}>
                                            {showRiskOnly && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className="text-white/60 group-hover:text-white/90 uppercase">Risiko Only</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" />Sehat</span>
                                        <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" />Waspada</span>
                                        <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500" />Risiko</span>
                                    </div>
                                </div>
                            )}
                            {activeLayer === 'phbs' && (
                                <div className="flex items-center gap-2 text-[9px] font-bold animate-in fade-in duration-300">
                                    <span className="text-white/40 uppercase">PHBS:</span>
                                    <span className="text-emerald-400">7-10 Baik</span>
                                    <span className="text-amber-400">4-6 Sedang</span>
                                    <span className="text-red-400">0-3 Buruk</span>
                                </div>
                            )}
                            {activeLayer === 'perilaku' && (
                                <div className="flex items-center gap-2 text-[9px] font-bold animate-in fade-in duration-300">
                                    <span className="text-white/40 uppercase">TTM:</span>
                                    <span>🔴 Prekontemplasi</span>
                                    <span>🟠 Kontemplasi</span>
                                    <span>🟡 Persiapan</span>
                                    <span>🟢 Aksi</span>
                                    <span>🏆 Pemeliharaan</span>
                                </div>
                            )}
                            {activeLayer === 'surveillance' && (
                                <div className="flex items-center gap-2 text-[9px] font-bold text-rose-400 animate-in fade-in duration-300">
                                    <span>⚠️ {stats.alertCount} kasus aktif (14 hari terakhir)</span>
                                </div>
                            )}
                        </div>

                        {/* Right: Zoom Controls (works for both 2D and 3D) */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => { setZoom(prev => Math.min(prev + 0.1, 1.5)); dioramaZoomRef.current?.zoomIn(); }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label="Perbesar peta"
                            >
                                <Plus size={14} />
                            </button>
                            <button
                                onClick={() => { setZoom(prev => Math.max(prev - 0.1, 0.2)); dioramaZoomRef.current?.zoomOut(); }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label="Perkecil peta"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={() => { setZoom(0.4); centerMap(); dioramaZoomRef.current?.reset(); }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label="Reset zoom peta"
                            >
                                <Minimize size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════
                    LAYER 3: BUILDING DETAIL DRAWER (slide in from right)
                   ═══════════════════════════════════════════════════ */}
                {selectedBuilding && (
                    <div className="absolute top-14 right-4 bottom-14 z-40 w-[400px] flex flex-col animate-in slide-in-from-right-8 duration-300"
                        onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}>
                        <div className={`flex-1 flex flex-col rounded-2xl overflow-hidden ${GLASS} shadow-2xl shadow-black/40`}>
                            {/* Drawer Header */}
                            <div className="p-5 border-b border-white/10 relative">
                                <button
                                    onClick={() => setSelectedBuilding(null)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                                    aria-label="Tutup detail bangunan"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-500/30">
                                        {selectedBuilding.type?.replace(/_/g, ' ')}
                                    </span>
                                    {selectedBuilding.familyId && (
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-500/30">
                                            Hunian Aktif
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-white leading-tight tracking-tight pr-8">
                                    {selectedBuilding.name}
                                </h3>

                                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-white/30">
                                    <span>📍 {selectedBuilding.x}, {selectedBuilding.y}</span>
                                    {selectedFamily && (
                                        <span>🏘️ RT {selectedFamily.rt || '01'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Building Sprite */}
                            <div className="px-5 pt-4">
                                <div
                                    onClick={() => isGameEnabledBuilding(selectedBuilding.type) && setBuildingInterior(selectedBuilding.type)}
                                    className={`group aspect-[2/1] bg-white/5 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden ${isGameEnabledBuilding(selectedBuilding.type) ? 'cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-emerald-500/20' : ''}`}
                                    title={isGameEnabledBuilding(selectedBuilding.type) ? "Masuk Gedung" : ""}
                                >
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
                                    <img
                                        src={getBuildingInsetUrl(selectedBuilding.type)}
                                        alt={selectedBuilding.name || selectedBuilding.type}
                                        className="w-32 h-32 object-contain drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {isGameEnabledBuilding(selectedBuilding.type) && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                            <span className="text-[10px] font-black tracking-widest text-emerald-300 bg-black/50 px-3 py-1 rounded-full uppercase">Masuk Gedung</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Drawer Content — scrollable */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                {selectedBuilding.familyId ? (
                                    <div className="p-5">
                                        <PISPKPanel
                                            building={selectedBuilding}
                                            villageData={villageData}
                                            onOpenWiki={openWiki}
                                            onOpenIntervention={() => setHomeVisitModal(selectedBuilding)}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4 p-5">
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Informasi</h4>
                                            <p className="text-xs font-medium text-white/60 leading-relaxed">
                                                {selectedBuilding.description || `${selectedBuilding.name} merupakan sarana umum penting di Desa Sukamaju.`}
                                            </p>
                                        </div>

                                        {selectedBuilding.type === BUILDING_TYPES.IKS_SCOREBOARD && (
                                            <IKSBoardPanel stats={stats} />
                                        )}

                                        {selectedBuilding.type === BUILDING_TYPES.KANTOR_DESA && (
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => navigate('sensus')}
                                                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                                >
                                                    📊 DATA SENSUS DESA
                                                </button>
                                                <button
                                                    onClick={() => openWiki('iks')}
                                                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                                >
                                                    📋 LAPORAN IKS
                                                </button>
                                            </div>
                                        )}

                                        {/* ═══ MASUK GEDUNG BUTTON ═══ */}
                                        {isGameEnabledBuilding(selectedBuilding.type) && (
                                            <button
                                                onClick={() => {
                                                    // Dollhouse Dive: camera zoom → flash → interior
                                                    if (dioramaZoomRef.current?.dive) {
                                                        dioramaZoomRef.current.dive(
                                                            selectedBuilding,
                                                            mapData.centerX,
                                                            mapData.centerY,
                                                            () => {
                                                                setDiveWhiteout(true);
                                                                setTimeout(() => {
                                                                    setBuildingInterior(selectedBuilding.type);
                                                                    setDiveWhiteout(false);
                                                                }, 250);
                                                            }
                                                        );
                                                    } else {
                                                        setBuildingInterior(selectedBuilding.type);
                                                    }
                                                }}
                                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30 uppercase tracking-wider"
                                            >
                                                🚪 MASUK GEDUNG — Mulai Investigasi
                                            </button>
                                        )}

                                        <button
                                            onClick={() => openWiki(getWikiKeyForBuilding(selectedBuilding))}
                                            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                        >
                                            <BookOpen size={14} /> WIKI & PROSEDUR
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Home Visit CTA */}
                            {selectedBuilding.familyId && (
                                <div className="p-4 border-t border-white/10 space-y-2">
                                    <button
                                        onClick={() => setActiveBCCase(selectedBuilding)}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black p-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30"
                                    >
                                        <Footprints size={16} /> 🔍 KUNJUNGAN RUMAH (Behavior Change)
                                    </button>
                                    <button
                                        onClick={() => setHomeVisitModal(selectedBuilding)}
                                        className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 p-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 transition-all"
                                    >
                                        ⚡ Kunjungan Cepat (Lama)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════
                    MODAL: HOME VISIT
                   ═══════════════════════════════════════════════════ */}
                {homeVisitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className={`w-full max-w-2xl rounded-2xl overflow-hidden ${GLASS} shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-8 duration-500`}>
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                            <Footprints size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-tight">Kunjungan Rumah (PIS-PK)</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{homeVisitModal.name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setHomeVisitModal(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white" aria-label="Tutup kunjungan rumah">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Energi</span>
                                        <span className="text-sm font-black text-amber-400">{energy} EP</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Status IKS</span>
                                        <span className={`text-sm font-black ${iksColor}`}>{iksLabel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                                <div className="grid grid-cols-1 gap-2">
                                    {HOME_VISIT_INTERVENTIONS.map((action) => {
                                        const isCompleted = homeVisitModal.familyId && villageData.families.find(f => f.id === homeVisitModal.familyId)?.indicators?.[action.indicator];
                                        return (
                                            <button
                                                key={action.id}
                                                disabled={energy < action.energy || isCompleted}
                                                onClick={() => handleHomeVisitAction(action)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isCompleted
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60'
                                                    : energy >= action.energy
                                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                        : 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="text-xl">{action.icon}</div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-white text-xs uppercase tracking-tight">{action.label}</h4>
                                                    <p className="text-[10px] text-white/50 font-medium">{action.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    {isCompleted ? (
                                                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md uppercase">Selesai</span>
                                                    ) : (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] font-black text-amber-400">-{action.energy} EP</span>
                                                            <span className="text-[9px] font-black text-emerald-400 uppercase">+{action.xp} XP</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <EducationalWikiModal
                    isOpen={isWikiOpen}
                    onClose={closeWiki}
                    metricKey={wikiMetric}
                />

                {/* Dollhouse Dive white flash overlay */}
                {diveWhiteout && (
                    <div
                        className="fixed inset-0 z-45 pointer-events-none"
                        style={{
                            background: 'white',
                            animation: 'diveFlash 0.3s ease-in-out',
                        }}
                    />
                )}

                {/* ═══════════════════════════════════════════════════
                    FULL-SCREEN BUILDING INTERIOR OVERLAY
                   ═══════════════════════════════════════════════════ */}
                {buildingInterior && buildingInterior === 'posyandu' && (
                    <PosyanduActivePanel
                        onClose={() => setBuildingInterior(null)}
                        onComplete={(result) => {
                            if (result?.totalXP) addXp(result.totalXP);
                            setBuildingInterior(null);
                        }}
                    />
                )}
                {buildingInterior && (buildingInterior === 'pustu' || buildingInterior === 'polindes') && (
                    <PustuActivePanel
                        onClose={() => setBuildingInterior(null)}
                        onComplete={(result) => {
                            if (result?.totalXP) addXp(result.totalXP);
                            setBuildingInterior(null);
                        }}
                    />
                )}
                {buildingInterior && buildingInterior !== 'posyandu' && buildingInterior !== 'pustu' && buildingInterior !== 'polindes' && (
                    <div className="fixed inset-0 z-50 animate-in fade-in zoom-in-95 duration-300">
                        <BuildingGamePanel
                            buildingType={buildingInterior}
                            energy={energy}
                            onAction={(action) => {
                                setPlayerStats(prev => ({
                                    ...prev,
                                    energy: Math.max(0, (prev.energy || 0) - (action.energy || 0))
                                }));
                                if (action.sdohDelta) {
                                    applyBuildingSDOH?.(buildingInterior, action.sdohDelta);
                                }
                            }}
                            onXpGain={(xp) => addXp(xp)}
                            onClose={() => setBuildingInterior(null)}
                            onTriggerScenario={(scenarioId) => {
                                triggerIKMEvent?.(scenarioId);
                            }}
                        />
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════
                    BEHAVIOR CHANGE CASE PANEL (UKM Gameplay)
                   ═══════════════════════════════════════════════════ */}
                {activeBCCase && (
                    <BehaviorCasePanel
                        building={activeBCCase}
                        familyData={activeBCCase.familyData || villageData?.families?.find(f => f.id === activeBCCase.familyId)}
                        day={day}
                        onClose={() => setActiveBCCase(null)}
                        onComplete={(result) => {
                            // Apply XP and reputation
                            if (result.xpEarned) addXp(result.xpEarned);
                            if (result.reputationDelta) {
                                setPlayerStats(prev => ({
                                    ...prev,
                                    energy: Math.max(0, (prev.energy || 0) - 15) // BC case costs 15 energy
                                }));
                            }
                            // Update village data based on outcome
                            if (result.outcomeTier === 'excellent' || result.outcomeTier === 'good') {
                                setVillageData(prev => ({
                                    ...prev,
                                    families: prev.families.map(f => {
                                        if (f.id !== result.familyId) return f;
                                        const boost = result.outcomeTier === 'excellent' ? 2 : 1;
                                        return {
                                            ...f,
                                            phbsScore: Math.min(10, (f.phbsScore || 0) + boost)
                                        };
                                    })
                                }));
                            }
                            if (updateProgress) updateProgress('home_visits', 1);
                            setActiveBCCase(null);
                        }}
                    />
                )}

                {/* ═══════════════════════════════════════════════════
                    COMMUNITY DIAGNOSIS PANEL (Global IKM Events)
                   ═══════════════════════════════════════════════════ */}
                {activeIKMEventId && (
                    <CommunityDiagnosisPanel
                        eventInstance={publicHealth.activeIKMEvents.find(e => e.instanceId === activeIKMEventId)}
                        onClose={() => setActiveIKMEventId(null)}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}
