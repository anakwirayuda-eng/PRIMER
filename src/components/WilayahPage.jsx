/**
 * @reflection
 * [IDENTITY]: WilayahPage
 * [PURPOSE]: Main Wilayah gameplay surface with the 2D blueprint as the canonical operational view.
 * [STATE]: Runtime-Audited
 * [ANCHOR]: WilayahPage
 * [DEPENDS_ON]: GameContext, useGameStore, layerMeta.js, Map2DBlueprint, ExhibitionVillageDiorama, BuildingGamePanel, PosyanduActivePanel, PustuActivePanel, CommunityDiagnosisPanel, BehaviorCasePanel, VillageRegistry
 * [KNOWN_ISSUES]: Wilayah orchestration is still heavy; 3D is being demoted toward inspector/showcase-only usage.
 * [LAST_UPDATE]: 2026-04-11
 */

import React, { useEffect, useRef, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useGame } from '../context/GameContext.jsx';
import { useGameStore } from '../store/useGameStore.js';
import { useShallow } from 'zustand/react/shallow';
import { showToast } from '../utils/ToastManager.js';
import {
    Map as MapIcon, Home as HomeIcon, Users, Activity,
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
import { WILAYAH_LAYER_ORDER, getWilayahLayerMeta } from './wilayah/layerMeta.js';
import { generateVillageMap, getWikiKeyForBuilding } from './wilayah/map-utils.js';
import {
    PISPKPanel,
    IKSBoardPanel
} from './wilayah/AuxiliaryComponents.jsx';
import { translateWilayahString } from './wilayah/contentI18n.js';
import BuildingGamePanel from './wilayah/BuildingGamePanel.jsx';
import PosyanduActivePanel from './wilayah/PosyanduActivePanel.jsx';
import PustuActivePanel from './wilayah/PustuActivePanel.jsx';
import CommunityDiagnosisPanel from './wilayah/CommunityDiagnosisPanel.jsx';
import BehaviorCasePanel from './wilayah/BehaviorCasePanel.jsx';
import { buildExhibitionDioramaData, buildPocketDioramaData, resolveInspectorScope } from './wilayah/pocketDiorama.js';
import PocketDioramaSnapshot from './wilayah/PocketDioramaSnapshot.jsx';
import { resolvePocketDioramaCapability } from './wilayah/pocketDioramaCapability.js';
const preloadExhibitionVillageDiorama = () => import('./wilayah/3d/ExhibitionVillageDiorama.jsx');
const preloadPocketDioramaCanvas = () => import('./wilayah/3d/PocketDioramaCanvas.jsx');
const ExhibitionVillageDiorama = lazy(preloadExhibitionVillageDiorama);
const PocketDioramaCanvas = lazy(preloadPocketDioramaCanvas);
import Map2DBlueprint from './wilayah/2d/Map2DBlueprint.jsx';
import { getSceneForBuilding, isGameEnabledBuilding } from './wilayah/buildingScenes.js';
import { getBuildingInspectorDossier } from './wilayah/inspectorDossiers.js';

import { guardStability } from '../utils/prophylaxis.js';
import { calculateIKS } from '../game/GameCore.js';
import { selectBridgeSeasonalState } from '../store/selectors.js';
import { resolveHomeVisitTravelState } from '../domains/village/homeVisitTravel.js';
import {
    activateBehaviorCaseForVillage,
    applyBehaviorCaseOutcomeToVillage,
    buildBehaviorCaseHistoryEntry,
    clearBehaviorCaseForVillage,
    resolveBehaviorCaseScenarioId
} from '../utils/behaviorCaseRuntime.js';
import { calculateCommunityMetrics } from '../utils/communityMetrics.js';
import {
    getHomeVisitProgressMetrics,
    getPosyanduProgressMetrics
} from '../utils/progressMetrics.js';
import VillagerBehavior from '../domains/village/VillagerBehavior.js';
import { RW_UNLOCK_THRESHOLDS } from '../domains/village/VillageRegistry.js';

// â”€â”€â”€ Runtime PHBS & Risk helpers (from villageData, not static registry) â”€â”€
function calculatePHBSFromIndicators(ind) {
    if (!ind) return 5;
    let s = 0;
    if (ind.persalinan) s++;
    if (ind.asi) s++;
    if (ind.balita) s++;
    if (ind.air) s++;
    if (ind.jamban) s++;
    if (ind.jentik) s++;
    if (ind.rokok) s++;
    if (ind.kb) s++;
    if (ind.jkn) s++;
    if (ind.imunisasi) s++;
    return s;
}
function calculateAvgBarrierFromIndicators(ind) {
    if (!ind) return 0.5;
    const keys = ['kb', 'persalinan', 'imunisasi', 'asi', 'balita', 'tb', 'hipertensi', 'jiwa', 'rokok', 'jkn', 'air', 'jamban'];
    const falseCount = keys.filter(k => ind[k] === false).length;
    return falseCount / keys.length;
}

// â”€â”€â”€ VisionOS Glassmorphism (Apple Vision Pro Style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GLASS = 'bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]';
const GLASS_HOVER = 'hover:bg-slate-800/80 transition-all duration-300';
function humanizeScenarioId(scenarioId) {
    return String(scenarioId || '')
        .split('_')
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
}

function detect3DProfile() {
    if (typeof window === 'undefined') {
        return { canUse3D: false, renderTier: 'off' };
    }

    const width = window.innerWidth;
    const isNarrowScreen = width < 768;
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

    // Keep 3D available on desktop-class screens even if the device exposes touch.
    if (isNarrowScreen || (isCoarsePointer && width < 1024)) {
        return { canUse3D: false, renderTier: 'off' };
    }

    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return { canUse3D: false, renderTier: 'off' };
    } catch {
        return { canUse3D: false, renderTier: 'off' };
    }

    const deviceMemory = Number(navigator.deviceMemory || 8);
    const hardwareConcurrency = Number(navigator.hardwareConcurrency || 8);
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const isLowTier = prefersReducedMotion
        || deviceMemory <= 4
        || hardwareConcurrency <= 4
        || (isCoarsePointer && width < 1280);

    return {
        canUse3D: true,
        renderTier: isLowTier ? 'low' : 'standard',
    };
}

export default function WilayahPage() {
    const { t } = useTranslation();
    const tr = useCallback((key, fallback, options = {}) => translateWilayahString(t, key, fallback, options), [t]);
    useEffect(() => {
        guardStability('NAV_WILAYAH_INIT', 2000, 3);
    }, []);

    // â•â•â• P1 PERF FIX: Narrow selectors instead of broad useGame() context â•â•â•
    // Only subscribe to state fields this page actually needs â†’ prevents rerender
    // from unrelated state changes (queue, finance, time ticks, etc.)
    const day = useGameStore(s => s.world.day);
    const gameTime = useGameStore(s => s.world.time); // minutes 0-1440 for lighting overlay
    const villageData = useGameStore(s => s.publicHealth.villageData);
    const buildingProgress = useGameStore(s => s.publicHealth.buildingProgress);
    const financeStats = useGameStore(s => s.finance.stats);
    const history = useGameStore(s => s.clinical.history);
    const playerStats = useGameStore(useShallow(s => s.player.profile));
    const activeIKMEvents = useGameStore(s => s.publicHealth.activeIKMEvents);
    const bridgeState = useGameStore(useShallow(s => selectBridgeSeasonalState(s)));
    const recordVillageLedgerEntry = useGameStore(s => s.publicHealthActions.recordVillageLedgerEntry);

    // Actions & UI state still come from useGame() (stable references, no perf impact)
    const {
        setVillageData, viewParams, navigate, setPlayerStats,
        addXp, setTime,
        openWiki, isWikiOpen, closeWiki, updateProgress, wikiMetric,
        triggerIKMEvent, applyBuildingSDOH, appendClinicalHistoryEntry
    } = useGame();

    const energy = Math.max(0, Math.floor(Number(playerStats?.energy) || 0));
    const reputation = Math.max(0, Math.floor(Number(playerStats?.reputation) || 0));

    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedRwZone, setSelectedRwZone] = useState(null);
    const [activeLayer, setActiveLayer] = useState('general');
    const [homeVisitModal, setHomeVisitModal] = useState(null);
    const [buildingInterior, setBuildingInterior] = useState(null);
    const [activeIKMEventId, setActiveIKMEventId] = useState(null);
    const [inspectorScenarioNotice, setInspectorScenarioNotice] = useState(null);
    const [activeBCCase, setActiveBCCase] = useState(null); // Behavior Change Case panel
    // â•â•â• ADAPTIVE DEVICE DETECTION (Blueprint: cross-platform auto-pick) â•â•â•
    const [threeDProfile, setThreeDProfile] = useState(() => detect3DProfile());
    const canUse3D = threeDProfile.canUse3D;
    const dioramaRenderTier = threeDProfile.renderTier;
    const [showShowcaseModal, setShowShowcaseModal] = useState(false);
    const [isCompactHud, setIsCompactHud] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 1024;
    });
    const dioramaZoomRef = useRef(null); // ref for 3D camera zoom callbacks
    const blueprint2dRef = useRef(null); // ref for 2D pan/zoom callbacks
    const activeZoomRef = blueprint2dRef;
    const [diveWhiteout, setDiveWhiteout] = useState(false); // Dollhouse Dive flash
    const liquidBalance = useMemo(
        () => (Number(financeStats?.kapitasi) || 0) + (Number(financeStats?.pendapatanUmum) || 0),
        [financeStats]
    );
    const handleCloseInspector = useCallback(() => {
        setSelectedBuilding(null);
        setSelectedRwZone(null);
        setInspectorScenarioNotice(null);
    }, []);
    const warmPocketInspector3D = useCallback(() => {
        if (!canUse3D || isCompactHud || showShowcaseModal) return;
        preloadPocketDioramaCanvas();
    }, [canUse3D, isCompactHud, showShowcaseModal]);
    const warmExhibitionDiorama = useCallback(() => {
        if (!canUse3D) return;
        preloadExhibitionVillageDiorama();
    }, [canUse3D]);
    const handleBuildingSelect = useCallback((building) => {
        if (building) {
            warmPocketInspector3D();
        }
        setSelectedRwZone(null);
        setSelectedBuilding(building);
        setInspectorScenarioNotice(null);
    }, [warmPocketInspector3D]);
    const handleRwZoneSelect = useCallback((zone) => {
        setSelectedBuilding(null);
        setSelectedRwZone(zone);
        setInspectorScenarioNotice(null);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;
        const handleResize = () => {
            setIsCompactHud(window.innerWidth < 1024);
            setThreeDProfile(detect3DProfile());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // â•â•â• TOPOLOGY DECOUPLING (Performance Critical!) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // Static map geometry: generated ONCE, never regenerated on data changes
    const isDataLoaded = !!villageData?.families;
    const staticMapTopology = useMemo(() => {
        if (!isDataLoaded) return null;
        return generateVillageMap(160, 120, 12345, villageData);
    }, [isDataLoaded, villageData]); // Regenerate if village data identity changes

    // â•â•â• P1 PERF FIX: Pre-built familyIdâ†’houseId map for O(1) lookup â•â•â•
    const familyHouseIndex = useMemo(() => {
        if (!villageData?.families) return null;
        return new Map(villageData.families.map(f => [f.id, f.houseId]));
    }, [villageData]);

    const surveillanceStatus = useMemo(() => {
        const status = {};
        if (!familyHouseIndex || !history) return status;
        const recentHistory = history.filter(p => (day - p.day) <= 14);
        recentHistory.forEach(p => {
            const dx = p.medicalData?.trueDiagnosisCode || '';
            if (!dx) return;
            const houseId = p.hidden?.familyId ? familyHouseIndex.get(p.hidden.familyId) : null;
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
    }, [history, day, familyHouseIndex]);

    // Dynamic data injection: lightweight O(N) operation (~0.1ms)
    // â•â•â• P1 PERF FIX: O(1) Map lookup instead of O(n) .find() per building â•â•â•
    const mapData = useMemo(() => {
        if (!staticMapTopology || !villageData?.families) return null;
        // P5: RW Progressive Unlock â€” determine which RWs are accessible
        const unlockedRWs = villageData.unlockedRWs || ['01', '02'];
        const families = villageData.families.map(f => {
            const phbs = calculatePHBSFromIndicators(f.indicators);
            const avgBarrier = calculateAvgBarrierFromIndicators(f.indicators);
            const riskLevel = avgBarrier >= 0.7 ? 'high' : avgBarrier >= 0.5 ? 'medium' : 'low';
            const isLocked = !unlockedRWs.includes(f.rw || '01');
            return {
                ...f, phbsScore: phbs, behaviorRisk: riskLevel,
                behaviorEmoji: riskLevel === 'high' ? 'ðŸ”´' : riskLevel === 'medium' ? 'ðŸŸ ' : 'ðŸŸ¢',
                isLocked
            };
        });
        // Build O(1) lookup map instead of per-building .find()
        const familyById = new Map(families.map(f => [f.id, f]));
        const buildings = staticMapTopology.buildings.map(b => {
            if (!b.familyId) return b;
            const fd = familyById.get(b.familyId) || null;
            // Inject surveillance case data into building for 3D marker rendering
            const surv = surveillanceStatus[b.id] || null;
            return { ...b, familyData: fd, hasCase: !!surv, caseInfo: surv, isLocked: fd?.isLocked || false };
        });
        return { ...staticMapTopology, buildings, families };
    }, [staticMapTopology, villageData, surveillanceStatus]);
    const unlockedRWs = useMemo(
        () => villageData?.unlockedRWs || ['01', '02'],
        [villageData?.unlockedRWs]
    );
    const buildRwUnlockDossier = useCallback((rwId, familyCountHint = null) => {
        if (!rwId) return null;
        const familiesInRw = (villageData?.families || []).filter((family) => (family.rw || '01') === rwId);
        const requirements = RW_UNLOCK_THRESHOLDS[rwId] || { day: 0, reputation: 0 };
        const residentCount = familiesInRw.reduce((sum, family) => sum + (family.members?.length || 0), 0);

        return {
            rw: rwId,
            familyCount: familyCountHint ?? familiesInRw.length,
            residentCount,
            requiredDay: requirements.day,
            requiredReputation: requirements.reputation,
            currentDay: day,
            currentReputation: reputation,
            dayReady: day >= requirements.day,
            reputationReady: reputation >= requirements.reputation,
            remainingDays: Math.max(0, requirements.day - day),
            remainingReputation: Math.max(0, requirements.reputation - reputation),
            isUnlocked: unlockedRWs.includes(rwId),
        };
    }, [day, reputation, unlockedRWs, villageData]);
    const selectedRwDossier = useMemo(
        () => (selectedRwZone ? buildRwUnlockDossier(selectedRwZone.rw, selectedRwZone.familyCount) : null),
        [buildRwUnlockDossier, selectedRwZone]
    );
    const lockedBuildingRwDossier = useMemo(() => {
        if (!selectedBuilding?.isLocked) return null;
        const rwId = selectedBuilding.familyData?.rw || '01';
        return buildRwUnlockDossier(rwId);
    }, [buildRwUnlockDossier, selectedBuilding]);

    const inspectorScope = useMemo(
        () => resolveInspectorScope(selectedBuilding, mapData),
        [selectedBuilding, mapData]
    );
    const pocketDioramaData = useMemo(
        () => buildPocketDioramaData(mapData, inspectorScope),
        [mapData, inspectorScope]
    );
    const inspectorScene = useMemo(
        () => getSceneForBuilding(selectedBuilding?.type, t),
        [selectedBuilding?.type, t]
    );
    const inspectorDossier = useMemo(
        () => getBuildingInspectorDossier(selectedBuilding?.type),
        [selectedBuilding?.type]
    );
    const activeScenarioMap = useMemo(
        () => new Map(
            (Array.isArray(activeIKMEvents) ? activeIKMEvents : [])
                .filter((event) => !event.completed)
                .map((event) => [event.scenarioId, event.instanceId])
        ),
        [activeIKMEvents]
    );
    const pocketDioramaCapability = useMemo(
        () => resolvePocketDioramaCapability({
            hasScopeData: Boolean(
                selectedBuilding &&
                !selectedBuilding.isLocked &&
                pocketDioramaData?.scopeMeta
            ),
            canUse3D,
            isCompactHud,
            showShowcaseModal,
        }),
        [canUse3D, isCompactHud, pocketDioramaData?.scopeMeta, selectedBuilding, showShowcaseModal]
    );
    const shouldRenderPocketDiorama = pocketDioramaCapability === 'live';
    const shouldRenderPocketSnapshot = pocketDioramaCapability === 'snapshot';
    const pocketRenderTier = dioramaRenderTier === 'standard' ? 'low' : dioramaRenderTier;
    const exhibitionMapData = useMemo(
        () => buildExhibitionDioramaData(mapData),
        [mapData]
    );
    const exhibitionScopeMeta = exhibitionMapData?.scopeMeta || null;
    const exhibitionCaption = useMemo(() => {
        if (!exhibitionScopeMeta) {
            return tr(
                'wilayahContent.ui.dioramaExhibition.captionNoScope',
                'Full-village panorama | exhibition only | 2D remains the operational source of truth.'
            );
        }

        return tr(
            'wilayahContent.ui.dioramaExhibition.caption',
            '{{label}} | {{buildingCount}} nodes | {{houseCount}} homes | exhibition only | RW inspection continues from 2D.',
            {
                label: exhibitionScopeMeta.label,
                buildingCount: exhibitionScopeMeta.buildingCount,
                houseCount: exhibitionScopeMeta.houseCount,
            }
        );
    }, [exhibitionScopeMeta, tr]);
    const pocketScopeTitle = isCompactHud
        ? tr('wilayahContent.ui.dioramaInspector.scopeTitleCompact', 'Inspector Scope')
        : tr('wilayahContent.ui.dioramaInspector.scopeTitleExpanded', 'Pocket Diorama Scope');
    const pocketCapabilityLabel = useMemo(() => {
        if (pocketDioramaCapability === 'live') {
            return tr('wilayahContent.ui.dioramaInspector.capabilityLabels.live', '3D live');
        }
        if (pocketDioramaCapability === 'snapshot') {
            return tr('wilayahContent.ui.dioramaInspector.capabilityLabels.snapshot', 'Snapshot');
        }
        return tr('wilayahContent.ui.dioramaInspector.capabilityLabels.off', 'Metadata');
    }, [pocketDioramaCapability, tr]);
    const pocketScopeDescription = useMemo(() => {
        if (shouldRenderPocketSnapshot) {
            return isCompactHud
                ? tr(
                    'wilayahContent.ui.dioramaInspector.scopeDescriptions.compactSnapshot',
                    'Di mobile, inspector memakai snapshot statis agar tetap ringan, jelas, dan tidak memaksa render WebGL.'
                )
                : tr(
                    'wilayahContent.ui.dioramaInspector.scopeDescriptions.gpuSafeSnapshot',
                    'Device ini memakai snapshot GPU-safe. Inspector tetap menampilkan konteks RW/bangunan tanpa mengaktifkan kanvas 3D.'
                );
        }

        return tr(
            'wilayahContent.ui.dioramaInspector.scopeDescriptions.metadataOnly',
            'Inspector 3D aktif di desktop saat mode utama tetap 2D. Pada layar sempit atau mode 3D penuh, scope ini tetap diringkas sebagai metadata.'
        );
    }, [isCompactHud, shouldRenderPocketSnapshot, tr]);

    const communityMetrics = useMemo(
        () => calculateCommunityMetrics(villageData),
        [villageData]
    );

    // â•â•â• 3D-compatible: select building from navigation params (e.g. Arsip â†’ Wilayah) â•â•â•
    useEffect(() => {
        if (viewParams && viewParams.focusHouseId && mapData) {
            const target = mapData.buildings.find(b => b.id === viewParams.focusHouseId || b.familyId === viewParams.focusHouseId);
            if (target) {
                queueMicrotask(() => handleBuildingSelect(target));
            }
        }
    }, [handleBuildingSelect, mapData, viewParams]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const zoomRef = blueprint2dRef;
            if (e.key === '+' || e.key === '=') {
                zoomRef.current?.zoomIn();
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                zoomRef.current?.zoomOut();
                e.preventDefault();
            } else if (e.key === '0') {
                zoomRef.current?.reset();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                if (showShowcaseModal) {
                    setShowShowcaseModal(false);
                } else {
                    handleCloseInspector();
                }
            }
            // Layer shortcuts (1-6)
            const layerMap = { '1': 'general', '2': 'pispk', '3': 'surveillance', '4': 'psn', '5': 'phbs', '6': 'perilaku' };
            if (layerMap[e.key]) setActiveLayer(layerMap[e.key]);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleCloseInspector, showShowcaseModal]);

    const handleStartBehaviorCase = useCallback(() => {
        if (!selectedBuilding?.familyId) return;
        const familyId = selectedBuilding.familyId;
        const familyData = selectedBuilding.familyData || villageData?.families?.find(f => f.id === familyId) || null;
        const scenarioId = resolveBehaviorCaseScenarioId({ familyData, familyId, day });
        if (!scenarioId) return;

        setVillageData(prev => activateBehaviorCaseForVillage(prev, familyId, scenarioId));
        setActiveBCCase({
            ...selectedBuilding,
            familyData: familyData ? { ...familyData, activeScenarioId: scenarioId } : { id: familyId, activeScenarioId: scenarioId }
        });
    }, [day, selectedBuilding, setVillageData, villageData]);

    const handleCloseBehaviorCase = useCallback(() => {
        if (activeBCCase?.familyId) {
            setVillageData(prev => clearBehaviorCaseForVillage(prev, activeBCCase.familyId));
        }
        setActiveBCCase(null);
    }, [activeBCCase, setVillageData]);

    const homeVisitTravelByAction = useMemo(() => {
        if (!homeVisitModal) return new Map();

        return new Map(
            HOME_VISIT_INTERVENTIONS.map(action => [
                action.id,
                resolveHomeVisitTravelState(action.energy, { x: homeVisitModal.x, y: homeVisitModal.y }, {
                    day,
                    balance: liquidBalance,
                    buildingProgress,
                    bridgeState
                })
            ])
        );
    }, [homeVisitModal, day, liquidBalance, buildingProgress, bridgeState]);

    const stats = {
        totalHouses: communityMetrics.totalKK,
        avgIks: communityMetrics.avgIKS,
        alertCount: Object.keys(surveillanceStatus).length
    };
    const bridgeStatusLabel = bridgeState?.status === 'putus'
        ? tr('wilayahContent.ui.bridgeStatus.broken', 'Bridge Down')
        : bridgeState?.status === 'rawan_banjir'
            ? tr('wilayahContent.ui.bridgeStatus.atRisk', 'Bridge At Risk')
            : tr('wilayahContent.ui.bridgeStatus.normal', 'Bridge Normal');
    const handleOpenSensusForRw = useCallback((rwId) => {
        if (!rwId) {
            navigate('sensus');
            return;
        }
        handleCloseInspector();
        navigate('sensus', { focusRw: rwId, source: 'blank_spot' });
    }, [handleCloseInspector, navigate]);
    const handleOpenShowcase = useCallback(() => {
        warmExhibitionDiorama();
        setShowShowcaseModal(true);
    }, [warmExhibitionDiorama]);
    const handleInspectorScenarioSelect = useCallback((scenarioId) => {
        if (!scenarioId) return;

        const existingEventId = activeScenarioMap.get(scenarioId);
        const caseName = humanizeScenarioId(scenarioId);
        if (existingEventId) {
            setActiveIKMEventId(existingEventId);
            setInspectorScenarioNotice(
                tr(
                    'wilayahContent.ui.inspectorCaseLinks.noticeAlreadyActive',
                    '{{caseName}} is already active. The community panel is now focused.',
                    { caseName }
                )
            );
            return;
        }

        const ok = triggerIKMEvent?.(scenarioId);
        if (!ok) {
            setInspectorScenarioNotice(
                tr(
                    'wilayahContent.ui.inspectorCaseLinks.noticeUnavailable',
                    '{{caseName}} cannot be started right now.',
                    { caseName }
                )
            );
            return;
        }

        const latestEventId = (useGameStore.getState().publicHealth.activeIKMEvents || [])
            .find((event) => event.scenarioId === scenarioId && !event.completed)?.instanceId;

        if (latestEventId) {
            setActiveIKMEventId(latestEventId);
            setInspectorScenarioNotice(
                tr(
                    'wilayahContent.ui.inspectorCaseLinks.noticeOpened',
                    '{{caseName}} opened in the community diagnosis panel.',
                    { caseName }
                )
            );
            return;
        }

        setInspectorScenarioNotice(
            tr(
                'wilayahContent.ui.inspectorCaseLinks.noticeCalled',
                '{{caseName}} was called. Check the map anchor if the panel is still closed.',
                { caseName }
            )
        );
    }, [activeScenarioMap, tr, triggerIKMEvent]);



    // â”€â”€â”€ Compute actual IKS for selected building / home visit modal â”€â”€â”€
    // Use homeVisitModal family when modal is open, otherwise selectedBuilding
    const activeFamily = homeVisitModal?.familyId
        ? villageData?.families?.find(f => f.id === homeVisitModal.familyId)
        : selectedBuilding?.familyId
            ? villageData?.families?.find(f => f.id === selectedBuilding.familyId)
            : null;
    const selectedIks = activeFamily
        ? (() => {
            const ind = activeFamily.indicators || {};
            const scored = Object.values(ind).filter(v => v !== null).length;
            const healthy = Object.values(ind).filter(v => v === true).length;
            return scored > 0 ? healthy / scored : 0;
        })()
        : 0;
    const iksLabel = selectedIks >= 0.8
        ? tr('wilayahContent.ui.iksStatus.healthy', 'HEALTHY')
        : selectedIks >= 0.5
            ? tr('wilayahContent.ui.iksStatus.preHealthy', 'PRE-HEALTHY')
            : tr('wilayahContent.ui.iksStatus.unhealthy', 'UNHEALTHY');
    const iksColor = selectedIks >= 0.8 ? 'text-emerald-400' : selectedIks >= 0.5 ? 'text-amber-400' : 'text-red-400';

    const handleHomeVisitAction = (action) => {
        const travelState = homeVisitTravelByAction.get(action.id);
        const effectiveEnergy = travelState?.effectiveEnergy ?? action.energy;
        if (travelState?.isBlocked || energy < effectiveEnergy) return;
        // Use homeVisitModal's familyId, not selectedBuilding, to prevent desync
        const targetFamilyId = homeVisitModal?.familyId;
        if (!targetFamilyId) return;
        const family = villageData.families.find(f => f.id === targetFamilyId);
        if (!family) return;
        let updatedIndicators = { ...family.indicators };
        // Support both singular `indicator` and plural `indicators` array
        const idsToUpdate = action.indicators || (action.indicator ? [action.indicator] : []);
        idsToUpdate.forEach(id => { updatedIndicators[id] = true; });
        setVillageData(prev => ({
            ...prev,
            families: prev.families.map(f => f.id === family.id ? { ...f, indicators: updatedIndicators, iksScore: calculateIKS(updatedIndicators) } : f)
        }));
        setPlayerStats(prev => ({
            ...prev,
            energy: Math.max(0, (Number(prev?.energy) || 0) - effectiveEnergy)
        }));
        addXp(action.xp);

        if (updateProgress) {
            getHomeVisitProgressMetrics(action.id).forEach(metric => {
                updateProgress(metric, 1);
            });
        }

        // P6: Living Village Ledger â€” record home visit
        if (recordVillageLedgerEntry) {
            const entryType = action.id === 'immunisasi' ? 'immunization' : 'home_visit';
            recordVillageLedgerEntry(targetFamilyId, entryType, {
                actionId: action.id,
                actionLabel: action.label,
                indicatorsUpdated: idsToUpdate,
                energyCost: effectiveEnergy
            });
        }

        navigate('megalog', { type: 'home_visit', familyId: family.id, action: action.id });
    };

    // â”€â”€â”€ Overlay layer definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const OVERLAY_LAYER_ICONS = {
        general: Building,
        pispk: HomeIcon,
        surveillance: Activity,
        psn: Bug,
        phbs: Heart,
        perilaku: Users,
    };
    const layerBadges = {
        general: bridgeStatusLabel,
        pispk: t('wilayahContent.ui.layerBadges.pispk', {
            value: (stats.avgIks * 100).toFixed(0),
            defaultValue: `IKS Desa ${(stats.avgIks * 100).toFixed(0)}%`
        }),
        surveillance: t('wilayahContent.ui.layerBadges.surveillance', {
            count: stats.alertCount,
            defaultValue: `${stats.alertCount} kasus aktif`
        }),
        psn: t('wilayahContent.ui.layerBadges.psn', { defaultValue: 'Prioritas PSN' }),
        phbs: t('wilayahContent.ui.layerBadges.phbs', { defaultValue: 'Skor 0-10 indikator' }),
        perilaku: t('wilayahContent.ui.layerBadges.perilaku', { defaultValue: 'Mode behavior change' }),
    };
    const OVERLAY_LAYERS = (
        WILAYAH_LAYER_ORDER.map((layerId) => ({
            id: layerId,
            icon: OVERLAY_LAYER_ICONS[layerId],
            ...getWilayahLayerMeta(layerId, t),
            badge: layerBadges[layerId]
        }))
    );
    const activeLayerMeta = OVERLAY_LAYERS.find((layer) => layer.id === activeLayer) || OVERLAY_LAYERS[0];
    const visibleLayerLegendItems = isCompactHud
        ? activeLayerMeta.legendItems.slice(0, 2)
        : activeLayerMeta.legendItems;
    const shouldShowInspectorBackdrop = isCompactHud && Boolean(selectedBuilding || selectedRwDossier);
    const inspectorBackdropStyle = isCompactHud
        ? {
            top: 'calc(env(safe-area-inset-top, 0px) + 4.25rem)',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 4.75rem)'
        }
        : undefined;
    const inspectorShellClass = isCompactHud
        ? 'absolute inset-x-3 z-40 flex flex-col animate-in slide-in-from-bottom-6 duration-300'
        : 'absolute left-3 right-3 top-16 bottom-24 z-40 flex flex-col animate-in slide-in-from-right-8 duration-300 md:left-auto md:right-4 md:top-14 md:bottom-14 md:w-[400px]';
    const inspectorShellStyle = isCompactHud
        ? {
            top: 'auto',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.25rem)',
            maxHeight: 'min(74vh, 620px)'
        }
        : undefined;
    const inspectorPanelClass = isCompactHud
        ? `${GLASS} flex max-h-full flex-col overflow-hidden rounded-[26px] border border-white/15 shadow-2xl shadow-black/50`
        : `${GLASS} flex-1 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40`;
    const inspectorHeaderClass = isCompactHud
        ? 'px-5 pb-4 pt-3 border-b border-white/10 relative'
        : 'p-5 border-b border-white/10 relative';

    // Loading guard (kept after hook declarations to preserve hook order)
    if (!mapData) {
        return (
            <ErrorBoundary>
                <div className="relative w-full h-screen overflow-hidden bg-[#0a0f0d] flex items-center justify-center">
                    <div className="text-center space-y-4 animate-pulse">
                        <MapIcon className="mx-auto text-emerald-500/40" size={48} />
                        <p className="text-white/40 text-sm font-black uppercase tracking-widest">{t('common.loading')}</p>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div className="relative w-full h-screen overflow-hidden bg-[#1a2614] font-sans select-none"
                onContextMenu={(e) => e.preventDefault()}>
                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    LAYER 0: FULL MAP (takes entire viewport)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {/* TACTICAL VIGNETTE â€” color shifts per active layer */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none transition-colors duration-1000"
                    style={{
                        boxShadow: `inset 0 0 150px 24px ${activeLayerMeta.vignette || 'transparent'}`
                    }}
                />

                <div className="absolute inset-0 z-0">
                    <Map2DBlueprint
                        ref={blueprint2dRef}
                        mapData={mapData}
                        selectedBuildingId={selectedBuilding?.id}
                        onBuildingSelect={handleBuildingSelect}
                        activeLayer={activeLayer}
                        gameTime={gameTime}
                        bridgeStatus={bridgeState?.status || 'normal'}
                        selectedEventAnchorId={activeIKMEventId}
                        onEventAnchorSelect={setActiveIKMEventId}
                        selectedRwZoneId={selectedRwZone?.rw || null}
                        onRwZoneSelect={handleRwZoneSelect}
                    />
                </div>

                {showShowcaseModal && canUse3D && (
                    <div className="absolute inset-0 z-50 bg-slate-950/92 backdrop-blur-md">
                        <div className="flex h-full flex-col">
                            <div className={`border-b border-white/10 px-4 py-3 ${GLASS}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">{t('wilayah.showcase_badge')}</p>
                                        <h3 className="mt-1 text-sm font-black tracking-tight text-white">{t('wilayah.showcase_title')}</h3>
                                        <p className="mt-1 text-[11px] font-medium text-white/45">{t('wilayah.showcase_subtitle')}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
                                            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                                                {tr('wilayahContent.ui.dioramaExhibition.badgeFullVillage', 'Full Village Only')}
                                            </span>
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/45">
                                                {tr('wilayahContent.ui.dioramaExhibition.badgeNonOperational', 'Non-Operational')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => dioramaZoomRef.current?.zoomIn()}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                            aria-label={t('wilayah.zoom_in')}
                                        >
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            onClick={() => dioramaZoomRef.current?.zoomOut()}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                            aria-label={t('wilayah.zoom_out')}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            onClick={() => dioramaZoomRef.current?.reset()}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                            aria-label={t('wilayah.zoom_reset')}
                                        >
                                            <Minimize size={14} />
                                        </button>
                                        <button
                                            onClick={() => setShowShowcaseModal(false)}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                            aria-label={t('wilayah.showcase_close')}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 max-w-2xl text-[11px] font-medium leading-relaxed text-white/45">
                                    {tr(
                                        'wilayahContent.ui.dioramaExhibition.description',
                                        'Mode ini khusus untuk maket desa penuh dan presentasi. Pocket diorama RW tetap muncul lewat inspector 2D, bukan dari layar exhibition ini.'
                                    )}
                                </p>
                            </div>
                            <div className="relative flex-1">
                                <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: 14 }}>{t('common.loading')}</div>}>
                                    <ExhibitionVillageDiorama
                                        mapData={exhibitionMapData}
                                        selectedBuildingId={null}
                                        onBuildingSelect={null}
                                        zoomRef={dioramaZoomRef}
                                        activeLayer="general"
                                        renderTier={dioramaRenderTier}
                                    />
                                </Suspense>
                                <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 shadow-2xl shadow-black/30">
                                    {exhibitionCaption}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    LAYER 1: TOP HUD BAR (transparent)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                <div
                    className={`absolute top-0 left-0 right-0 z-30 ${GLASS} border-t-0 border-x-0`}
                    style={isCompactHud ? { paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)' } : undefined}
                    onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div className={`flex items-center justify-between ${isCompactHud ? 'gap-2 px-3 py-2.5' : 'px-5 py-3'}`}>
                        {/* Left: Back + Title */}
                        <div className={`flex items-center ${isCompactHud ? 'gap-2' : 'gap-4'}`}>
                            <button
                                onClick={() => navigate('dashboard')}
                                className={`p-2 rounded-lg ${GLASS_HOVER} text-white/60 hover:text-white`}
                                aria-label={t('wilayah.back_dashboard')}
                            >
                                <X size={18} />
                            </button>
                            <div>
                                <h2 className={`${isCompactHud ? 'text-[11px]' : 'text-sm'} font-black text-white/90 tracking-tight flex items-center gap-2`}>
                                    <MapIcon className="text-emerald-400" size={16} />
                                    {t('wilayah.title')}
                                </h2>
                                <p className={`${isCompactHud ? 'text-[9px]' : 'text-[10px]'} text-white/40 font-bold uppercase tracking-widest`}>
                                    {t('wilayah.subtitle_day', { day })}
                                </p>
                                {isCompactHud && (
                                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.14em]">
                                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                                            {stats.totalHouses} {t('wilayah.kk')}
                                        </span>
                                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-amber-300">
                                            IKS {(stats.avgIks * 100).toFixed(0)}%
                                        </span>
                                        <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-1 text-sky-300">
                                            {energy} {t('wilayah.energy_short')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center: Stats */}
                        <div className={`${isCompactHud ? 'hidden' : 'flex'} items-center gap-6 text-[10px] font-black uppercase tracking-widest`}>
                            <div className="flex items-center gap-2 text-emerald-400">
                                <HomeIcon size={12} />
                                <span>{stats.totalHouses} {t('wilayah.kk')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-400">
                                <Activity size={12} />
                                <span>IKS {(stats.avgIks * 100).toFixed(0)}%</span>
                            </div>
                            {stats.alertCount > 0 && (
                                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                                    <span>{stats.alertCount} {t('wilayah.active_cases')}</span>
                                </div>
                            )}
                            {activeIKMEvents?.length > 0 && (
                                <button
                                    onClick={() => setActiveIKMEventId(activeIKMEvents[0].instanceId)}
                                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 animate-pulse transition-colors"
                                    title={t('wilayah.ikm_active_title')}
                                >
                                    <span>{activeIKMEvents.length} {t('wilayah.ikm_short')}</span>
                                </button>
                            )}
                            <div className="flex items-center gap-2 text-blue-400">
                                <span>{energy} {t('wilayah.energy_short')}</span>
                            </div>
                        </div>

                        {/* Right: Utility Actions */}
                        <div className={`flex items-center ${isCompactHud ? 'gap-1' : 'gap-2'}`}>
                            <button
                                onClick={() => navigate('sensus')}
                                className={`${isCompactHud ? 'px-2 py-1.5 text-[9px]' : 'px-3 py-1.5 text-[10px]'} rounded-lg font-black uppercase tracking-wider ${GLASS} ${GLASS_HOVER} text-amber-300`}
                            >
                                {isCompactHud ? 'Sns' : t('wilayah.census')}
                            </button>
                            {canUse3D && (
                                <button
                                    onClick={handleOpenShowcase}
                                    onMouseEnter={warmExhibitionDiorama}
                                    onFocus={warmExhibitionDiorama}
                                    title={t('wilayah.showcase_open_title')}
                                    className={`${isCompactHud ? 'px-2 py-1.5 text-[9px]' : 'px-3 py-1.5 text-[10px]'} rounded-lg font-black uppercase tracking-wider ${GLASS} ${GLASS_HOVER} text-cyan-300`}
                                >
                                    {isCompactHud ? '3D' : t('wilayah.showcase_open')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>


                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    LAYER 2: BOTTOM HUD BAR (transparent toolbar)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

                <div
                    className={`absolute bottom-0 left-0 right-0 z-30 ${GLASS} border-b-0 border-x-0`}
                    style={isCompactHud ? { paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' } : undefined}
                    onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <div className={`flex flex-col gap-2 ${isCompactHud ? 'px-3 py-2' : 'px-4 py-2.5'} lg:flex-row lg:items-center lg:justify-between`}>
                        {/* Left: Overlay Layer Buttons */}
                        <div className={`flex items-center gap-1.5 lg:max-w-[38%] ${isCompactHud ? 'overflow-x-auto whitespace-nowrap pb-1' : 'flex-wrap'}`}>
                            <span className="mr-1 text-[9px] font-black text-white/30 uppercase tracking-widest">{t('wilayah.overlay')}</span>
                            {OVERLAY_LAYERS.map((layer) => {
                                const isActive = activeLayer === layer.id;
                                const LayerIcon = layer.icon;
                                return (
                                    <button
                                        key={layer.id}
                                        onClick={() => {
                                            setActiveLayer(layer.id);
                                            // Assuming setOverlayPanelOpen is defined elsewhere or removed
                                            // if (layer.id !== 'general') setOverlayPanelOpen(true);
                                            // else setOverlayPanelOpen(false);
                                        }}
                                        className={`flex items-center gap-1.5 rounded-lg ${isCompactHud ? 'px-2 py-1.5 text-[9px]' : 'px-2.5 py-1.5 text-[10px]'} font-black uppercase tracking-wider transition-all ${isActive ? '' : GLASS_HOVER}`}
                                        style={isActive ? {
                                            background: layer.activeBg,
                                            color: layer.activeText,
                                            border: `1px solid ${layer.activeBorder}`,
                                            boxShadow: `0 10px 24px ${layer.activeBorder}`
                                        } : {
                                            color: 'rgba(255,255,255,0.56)',
                                            border: '1px solid rgba(255,255,255,0.06)'
                                        }}
                                        title={`${layer.label}: ${layer.tooltip}`}
                                        aria-label={`${layer.label}: ${layer.tooltip}`}
                                        aria-pressed={isActive}
                                        data-testid={`wilayah-layer-toggle-${layer.id}`}
                                    >
                                        <LayerIcon size={12} />
                                        <span className="hidden sm:inline">{layer.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="min-w-0 flex-1 lg:max-w-[44%]">
                            <div
                                className="rounded-xl border px-3 py-2 animate-in fade-in duration-300"
                                style={{
                                    background: 'rgba(15,23,42,0.68)',
                                    borderColor: activeLayerMeta.activeBorder,
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(15,23,42,0.14)'
                                }}
                                data-testid="wilayah-active-layer-panel"
                                data-layer={activeLayer}
                            >
                                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div
                                            className="text-[8px] font-black uppercase tracking-[0.22em]"
                                            style={{ color: activeLayerMeta.accent }}
                                        >
                                            {t('wilayah.mode_label', { label: activeLayerMeta.label })}
                                        </div>
                                        <div className={`${isCompactHud ? 'text-[9px]' : 'text-[10px]'} mt-1 font-bold leading-snug text-white/78`}>
                                            {activeLayerMeta.subtitle}
                                        </div>
                                    </div>
                                    <span
                                        className="self-start rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em]"
                                        style={{
                                            color: activeLayerMeta.activeText,
                                            background: activeLayerMeta.activeBg,
                                            border: `1px solid ${activeLayerMeta.activeBorder}`
                                        }}
                                    >
                                        {activeLayerMeta.badge}
                                    </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {visibleLayerLegendItems.map((item) => (
                                        <span
                                            key={`${activeLayerMeta.id}-${item.label}`}
                                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]"
                                            style={{
                                                color: item.text,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.06)'
                                            }}
                                        >
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ background: item.dot }}
                                            />
                                            {item.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        {/* Legacy layer legend retired after HUD consolidation:
                            {activeLayer === 'pispk' && (
                                <div className="flex items-center gap-3 text-[9px] font-bold animate-in fade-in duration-300">
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
                                    <span>Prekontemplasi</span>
                                    <span>Kontemplasi</span>
                                    <span>Persiapan</span>
                                    <span>Aksi</span>
                                    <span>Pemeliharaan</span>
                                </div>
                            )}
                            {activeLayer === 'surveillance' && (
                                <div className="flex items-center gap-2 text-[9px] font-bold text-rose-400 animate-in fade-in duration-300">
                                    <span>{stats.alertCount} kasus aktif (14 hari terakhir)</span>
                                </div>
                            )}
                        */}
                        </div>

                        {/* Right: Zoom Controls (3D camera via dioramaZoomRef) */}
                        <div className="flex items-center gap-1 self-end lg:self-auto">
                            <button
                                onClick={() => activeZoomRef.current?.zoomIn()}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label={t('wilayah.zoom_in')}
                            >
                                <Plus size={14} />
                            </button>
                            <button
                                onClick={() => activeZoomRef.current?.zoomOut()}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label={t('wilayah.zoom_out')}
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={() => activeZoomRef.current?.reset()}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 ${GLASS_HOVER}`}
                                aria-label={t('wilayah.zoom_reset')}
                            >
                                <Minimize size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {shouldShowInspectorBackdrop && (
                    <button
                        type="button"
                        className="absolute inset-x-0 z-35 bg-slate-950/30 backdrop-blur-[2px] animate-in fade-in duration-200"
                        style={inspectorBackdropStyle}
                        onClick={handleCloseInspector}
                        aria-label="Tutup inspector wilayah"
                    />
                )}

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    LAYER 3: RW / BUILDING DETAIL DRAWER (desktop drawer / mobile sheet)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {selectedRwDossier && !selectedBuilding && (
                    <div className={inspectorShellClass}
                        style={inspectorShellStyle}
                        onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}>
                        <div className={inspectorPanelClass}>
                            <div className={inspectorHeaderClass}>
                                {isCompactHud && (
                                    <div className="mb-3 flex justify-center">
                                        <span className="h-1.5 w-12 rounded-full bg-white/15" />
                                    </div>
                                )}
                                <button
                                    onClick={handleCloseInspector}
                                    className={`absolute ${isCompactHud ? 'right-4 top-3' : 'right-4 top-4'} p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all`}
                                    aria-label="Tutup dossier RW"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-200 text-[9px] font-black uppercase tracking-widest rounded-md border border-amber-500/30">
                                        Blank Spot PIS-PK
                                    </span>
                                    <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
                                        RW {selectedRwDossier.rw}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-white leading-tight tracking-tight pr-8">
                                    Dossier Zona Belum Terdata
                                </h3>
                                <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-white/50">
                                    Sektor ini sudah ada di topologi desa, tetapi data rumah tangga PIS-PK belum menjadi wilayah operasional aktif.
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/35">Keluarga</div>
                                        <div className="mt-1 text-2xl font-black text-white">{selectedRwDossier.familyCount}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/35">KK terpetakan</div>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/35">Penduduk</div>
                                        <div className="mt-1 text-2xl font-black text-white">{selectedRwDossier.residentCount}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/35">Jiwa tercatat</div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">
                                        <Building size={14} />
                                        Status Unlock RW {selectedRwDossier.rw}
                                    </div>
                                    <div className="mt-3 space-y-3">
                                        <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                                    {tr('wilayahContent.ui.rwProgress.operationalDay', 'Operational Day')}
                                                </div>
                                                <div className="mt-1 text-sm font-black text-white">
                                                    {tr('wilayahContent.ui.rwProgress.dayValue', 'Day {{day}}', { day: selectedRwDossier.requiredDay })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${selectedRwDossier.dayReady ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-amber-100'}`}>
                                                    {selectedRwDossier.dayReady ? <Check size={12} /> : <Activity size={12} />}
                                                    {selectedRwDossier.dayReady
                                                        ? tr('wilayahContent.ui.rwProgress.ready', 'Ready')
                                                        : tr('wilayahContent.ui.rwProgress.remainingDays', '{{count}} days remaining', { count: selectedRwDossier.remainingDays })}
                                                </div>
                                                <div className="mt-1 text-[10px] font-medium text-white/40">
                                                    {tr('wilayahContent.ui.rwProgress.currentDay', 'Current: Day {{day}}', { day: selectedRwDossier.currentDay })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                                    {tr('wilayahContent.ui.rwProgress.villageReputation', 'Village Reputation')}
                                                </div>
                                                <div className="mt-1 text-sm font-black text-white">
                                                    {tr('wilayahContent.ui.rwProgress.reputationValue', '{{value}} REP', { value: selectedRwDossier.requiredReputation })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider ${selectedRwDossier.reputationReady ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-amber-100'}`}>
                                                    {selectedRwDossier.reputationReady ? <Check size={12} /> : <Activity size={12} />}
                                                    {selectedRwDossier.reputationReady
                                                        ? tr('wilayahContent.ui.rwProgress.ready', 'Ready')
                                                        : tr('wilayahContent.ui.rwProgress.remainingReputation', '{{value}} REP remaining', { value: selectedRwDossier.remainingReputation })}
                                                </div>
                                                <div className="mt-1 text-[10px] font-medium text-white/40">
                                                    {tr('wilayahContent.ui.rwProgress.currentReputation', 'Current: {{value}} REP', { value: selectedRwDossier.currentReputation })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
                                        Arahan Operasional
                                    </div>
                                    <p className="mt-2 text-xs font-medium leading-relaxed text-white/65">
                                        {tr(
                                            'wilayahContent.ui.rwInspector.unlockGuidance',
                                            'Open the Census archive to review household composition in this RW, then use day progress and reputation to track when the sector becomes active on the main map.'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-white/10 p-4 space-y-2">
                                <button
                                    onClick={() => handleOpenSensusForRw(selectedRwDossier.rw)}
                                    className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 p-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/30 uppercase tracking-wider"
                                >
                                    <Search size={16} /> {tr('wilayahContent.ui.rwInspector.openArchive', 'Open RW {{rw}} Archive', { rw: selectedRwDossier.rw })}
                                </button>
                                <button
                                    onClick={handleCloseInspector}
                                    className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 p-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 transition-all"
                                >
                                    {tr('wilayahContent.ui.rwInspector.closeDossier', 'Close Dossier')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {selectedBuilding && (
                    <div className={inspectorShellClass}
                        style={inspectorShellStyle}
                        onWheel={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}>
                        <div className={inspectorPanelClass}>
                            {/* Drawer Header */}
                            <div className={inspectorHeaderClass}>
                                {isCompactHud && (
                                    <div className="mb-3 flex justify-center">
                                        <span className="h-1.5 w-12 rounded-full bg-white/15" />
                                    </div>
                                )}
                                <button
                                    onClick={handleCloseInspector}
                                    className={`absolute ${isCompactHud ? 'right-4 top-3' : 'right-4 top-4'} p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all`}
                                    aria-label="Tutup detail bangunan"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-500/30">
                                        {selectedBuilding.type?.replace(/_/g, ' ')}
                                    </span>
                                    {inspectorScope && (
                                        <span className="px-2 py-0.5 bg-cyan-500/15 text-cyan-300 text-[9px] font-black uppercase tracking-widest rounded-md border border-cyan-500/30">
                                            {inspectorScope.label}
                                        </span>
                                    )}
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
                                    <span>ðŸ“ {selectedBuilding.x}, {selectedBuilding.y}</span>
                                    {activeFamily && (
                                        <span>ðŸ˜ï¸ RT {activeFamily.rt || '01'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Building Sprite */}
                            <div className={`px-5 ${isCompactHud ? 'pt-3' : 'pt-4'}`}>
                                <div
                                    onClick={() => isGameEnabledBuilding(selectedBuilding.type) && setBuildingInterior(selectedBuilding.type)}
                                    className={`group ${isCompactHud ? 'aspect-[2.4/1]' : 'aspect-[2/1]'} bg-white/5 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden ${isGameEnabledBuilding(selectedBuilding.type) ? 'cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-emerald-500/20' : ''}`}
                                    title={isGameEnabledBuilding(selectedBuilding.type) ? "Masuk Gedung" : ""}
                                >
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
                                    <img
                                        src={getBuildingInsetUrl(selectedBuilding.type)}
                                        alt={selectedBuilding.name || selectedBuilding.type}
                                        className={`${isCompactHud ? 'h-24 w-24' : 'h-32 w-32'} object-contain drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300`}
                                    />
                                    {isGameEnabledBuilding(selectedBuilding.type) && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                            <span className="text-[10px] font-black tracking-widest text-emerald-300 bg-black/50 px-3 py-1 rounded-full uppercase">Masuk Gedung</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Drawer Content â€” scrollable */}
                            {inspectorScope && pocketDioramaData?.scopeMeta && (
                                <div className="px-5 pt-3 space-y-3">
                                    {shouldRenderPocketSnapshot && (
                                        <PocketDioramaSnapshot
                                            mapData={pocketDioramaData}
                                            selectedBuildingId={selectedBuilding?.id}
                                            modeVariant={isCompactHud ? 'mobile' : 'gpuSafe'}
                                        />
                                    )}
                                    {shouldRenderPocketDiorama && (
                                        <Suspense
                                            fallback={(
                                                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-center shadow-inner shadow-black/20">
                                                    <div className="space-y-2 px-5">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                                            {tr('wilayahContent.ui.dioramaInspector.liveTitle', '3D Inspector')}
                                                        </p>
                                                        <p className="text-xs font-medium text-white/60">
                                                            {tr(
                                                                'wilayahContent.ui.dioramaInspector.liveLoadingBody',
                                                                'Memuat pocket diorama untuk scope ini...'
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <PocketDioramaCanvas
                                                mapData={pocketDioramaData}
                                                selectedBuildingId={selectedBuilding?.id}
                                                onBuildingSelect={handleBuildingSelect}
                                                renderTier={pocketRenderTier}
                                            />
                                        </Suspense>
                                    )}
                                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                                            {pocketScopeTitle}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/70">
                                            <span>{inspectorScope.label}</span>
                                            <span>{tr('wilayahContent.ui.dioramaInspector.metricNodes', '{{count}} titik', { count: pocketDioramaData.scopeMeta.buildingCount })}</span>
                                            <span>{tr('wilayahContent.ui.dioramaInspector.metricHouses', '{{count}} rumah', { count: pocketDioramaData.scopeMeta.houseCount })}</span>
                                            <span>{pocketCapabilityLabel}</span>
                                        </div>
                                        {!shouldRenderPocketDiorama && (
                                            <p className="mt-2 text-[10px] font-medium leading-relaxed text-white/45">
                                                {pocketScopeDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                {selectedBuilding.isLocked ? (
                                    <div className="p-5 space-y-4">
                                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">
                                                    <Building size={14} />
                                                    {tr('wilayahContent.ui.lockedRw.badge', 'RW Blind Spot {{rw}}', {
                                                        rw: lockedBuildingRwDossier?.rw || selectedBuilding.familyData?.rw || '??'
                                                    })}
                                                </div>
                                                <h4 className="mt-2 text-base font-black text-white">
                                                    {tr('wilayahContent.ui.lockedRw.title', 'Area Not Yet Unlocked')}
                                                </h4>
                                                <p className="mt-2 text-xs leading-relaxed text-white/55">
                                                    {tr(
                                                        'wilayahContent.ui.lockedRw.description',
                                                        'This building already exists in the topology, but gameplay access stays locked until the related RW meets the day and reputation thresholds.'
                                                    )}
                                                </p>
                                            </div>

                                        {lockedBuildingRwDossier && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/35">
                                                        {tr('wilayahContent.ui.rwProgress.dayShort', 'Day')}
                                                    </div>
                                                    <div className="mt-1 text-lg font-black text-white">
                                                        {lockedBuildingRwDossier.currentDay}/{lockedBuildingRwDossier.requiredDay}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-white/40">
                                                        {lockedBuildingRwDossier.dayReady
                                                            ? tr('wilayahContent.ui.rwProgress.dayRequirementMet', 'Day requirement met')
                                                            : tr('wilayahContent.ui.rwProgress.remainingDays', '{{count}} days remaining', { count: lockedBuildingRwDossier.remainingDays })}
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/35">
                                                        {tr('wilayahContent.ui.rwProgress.reputationShort', 'Reputation')}
                                                    </div>
                                                    <div className="mt-1 text-lg font-black text-white">
                                                        {lockedBuildingRwDossier.currentReputation}/{lockedBuildingRwDossier.requiredReputation}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-white/40">
                                                        {lockedBuildingRwDossier.reputationReady
                                                            ? tr('wilayahContent.ui.rwProgress.reputationRequirementMet', 'Reputation requirement met')
                                                            : tr('wilayahContent.ui.rwProgress.remainingReputation', '{{value}} REP remaining', { value: lockedBuildingRwDossier.remainingReputation })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleOpenSensusForRw(lockedBuildingRwDossier?.rw || selectedBuilding.familyData?.rw)}
                                            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Search size={14} /> {tr('wilayahContent.ui.rwInspector.openRelatedArchive', 'Open Related RW Archive')}
                                        </button>
                                    </div>
                                ) : selectedBuilding.familyId ? (
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
                                        {inspectorDossier && (
                                            <div className={`rounded-xl border p-4 ${inspectorDossier.shellClassName}`}>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] ${inspectorDossier.eyebrowClassName}`}>
                                                        {inspectorDossier.eyebrow}
                                                    </span>
                                                    {inspectorScene?.stations?.length > 0 && (
                                                        <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
                                                            {tr('wilayahContent.ui.buildingGamePanel.stationCount', '{{count}} stations', {
                                                                count: inspectorScene.stations.length
                                                            })}
                                                        </span>
                                                    )}
                                                    {inspectorScene?.completionReward && (
                                                        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
                                                            +{inspectorScene.completionReward.xp} XP / +{inspectorScene.completionReward.reputation} REP
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="mt-3 text-sm font-black leading-snug text-white">
                                                    {inspectorDossier.title}
                                                </h4>
                                                <p className="mt-2 text-xs font-medium leading-relaxed text-white/72">
                                                    {inspectorDossier.summary}
                                                </p>
                                                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                                    {inspectorDossier.metrics.map((metric) => (
                                                        <div
                                                            key={`${selectedBuilding.id}-${metric.label}`}
                                                            className={`rounded-xl border p-3 ${inspectorDossier.metricClassName}`}
                                                        >
                                                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                                                                {metric.label}
                                                            </div>
                                                            <div className={`mt-1 text-[11px] font-bold leading-snug ${inspectorDossier.metricValueClassName}`}>
                                                                {metric.value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 space-y-2">
                                                    {inspectorDossier.focusPoints.map((point) => (
                                                        <div key={point} className="flex items-start gap-2 text-xs font-medium leading-relaxed text-white/68">
                                                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${inspectorDossier.focusBulletClassName}`} />
                                                            <span>{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {inspectorScene?.linkedScenarios?.length > 0 && (
                                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                                            {tr('wilayahContent.ui.inspectorCaseLinks.title', 'Linked Cases')}
                                                        </h4>
                                                        <p className="mt-1 text-xs font-medium leading-relaxed text-white/55">
                                                            {inspectorDossier?.caseHint || tr('wilayahContent.ui.inspectorCaseLinks.hint', 'Choose a community case to open the diagnosis panel that best matches this node.')}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-200">
                                                        {tr('wilayahContent.ui.inspectorCaseLinks.runtimeBadge', 'Runtime Link')}
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {inspectorScene.linkedScenarios.map((scenarioId) => {
                                                        const isScenarioActive = activeScenarioMap.has(scenarioId);
                                                        return (
                                                            <button
                                                                key={`${selectedBuilding.id}-${scenarioId}`}
                                                                onClick={() => handleInspectorScenarioSelect(scenarioId)}
                                                                className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all ${
                                                                    isScenarioActive
                                                                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/22'
                                                                        : 'border-white/10 bg-black/20 text-white/70 hover:border-cyan-400/35 hover:bg-cyan-500/10 hover:text-cyan-100'
                                                                }`}
                                                            >
                                                                {isScenarioActive
                                                                    ? tr('wilayahContent.ui.inspectorCaseLinks.actionOpen', 'Open')
                                                                    : tr('wilayahContent.ui.inspectorCaseLinks.actionCall', 'Call')} {humanizeScenarioId(scenarioId)}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {inspectorScenarioNotice && (
                                                    <p className="mt-3 text-[11px] font-medium leading-relaxed text-cyan-100/80">
                                                        {inspectorScenarioNotice}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                                                {tr('wilayahContent.ui.inspectorInfo.title', 'Information')}
                                            </h4>
                                            <p className="text-xs font-medium text-white/60 leading-relaxed">
                                                {selectedBuilding.description
                                                    || inspectorScene?.subtitle
                                                    || tr(
                                                        'wilayahContent.ui.inspectorInfo.defaultDescription',
                                                        '{{name}} is an important public facility in Sukamaju Village.',
                                                        { name: selectedBuilding.name }
                                                    )}
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
                                                    <Search size={14} /> {tr('wilayahContent.ui.inspectorActions.censusData', 'Village Census Data')}
                                                </button>
                                                <button
                                                    onClick={() => openWiki('iks')}
                                                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <Heart size={14} /> {tr('wilayahContent.ui.inspectorActions.iksReport', 'IKS Report')}
                                                </button>
                                                {canUse3D && (
                                                    <button
                                                        onClick={handleOpenShowcase}
                                                        onMouseEnter={warmExhibitionDiorama}
                                                        onFocus={warmExhibitionDiorama}
                                                        className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-200 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <Building size={14} /> {tr('wilayahContent.ui.inspectorActions.operationalMockup3d', '3D Operational Mockup')}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Building entry button */}
                                        {isGameEnabledBuilding(selectedBuilding.type) && (
                                            <button
                                                onClick={() => {
                                                    // Dollhouse Dive: camera zoom â†’ flash â†’ interior
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
                                                <Building size={16} /> {tr('wilayahContent.ui.inspectorActions.enterBuilding', 'Enter Building')} | {tr('wilayahContent.ui.inspectorActions.enterBuildingSub', 'Start Investigation')}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => openWiki(getWikiKeyForBuilding(selectedBuilding))}
                                            className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                                        >
                                            <BookOpen size={14} /> {tr('wilayahContent.ui.inspectorActions.wikiProcedure', 'Wiki & Procedures')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Home Visit CTA */}
                            {selectedBuilding.familyId && !selectedBuilding.isLocked && (
                                <div className="p-4 border-t border-white/10 space-y-2">
                                    <button
                                        onClick={handleStartBehaviorCase}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black p-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30"
                                    >
                                        <Footprints size={16} /> {tr('wilayahContent.ui.inspectorActions.homeVisitBehaviorChange', 'Home Visit (Behavior Change)')}
                                    </button>
                                    <button
                                        onClick={() => setHomeVisitModal(selectedBuilding)}
                                        className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 p-2.5 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 transition-all"
                                    >
                                        {tr('wilayahContent.ui.inspectorActions.quickVisitLegacy', 'Quick Visit (Legacy)')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Home visit modal */}
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
                                            <h3 className="text-lg font-black text-white tracking-tight">{tr('wilayahContent.ui.homeVisitModal.title', 'Home Visit (PIS-PK)')}</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{homeVisitModal.name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setHomeVisitModal(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white" aria-label={tr('wilayahContent.ui.homeVisitModal.closeAria', 'Close home visit')}>
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{tr('wilayahContent.ui.homeVisitModal.energy', 'Energy')}</span>
                                        <span className="text-sm font-black text-amber-400">{energy} EP</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{tr('wilayahContent.ui.homeVisitModal.iksStatus', 'IKS Status')}</span>
                                        <span className={`text-sm font-black ${iksColor}`}>{iksLabel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                                <div className="grid grid-cols-1 gap-2">
                                    {HOME_VISIT_INTERVENTIONS.map((action) => {
                                        // Fix: support both singular `indicator` and plural `indicators` for completion check
                                        const family = villageData.families.find(f => f.id === homeVisitModal.familyId);
                                        const idsToCheck = action.indicators || (action.indicator ? [action.indicator] : []);
                                        const isCompleted = homeVisitModal.familyId && idsToCheck.length > 0 && idsToCheck.every(id => family?.indicators?.[id]);
                                        const travelState = homeVisitTravelByAction.get(action.id);
                                        const effectiveEnergy = travelState?.effectiveEnergy ?? action.energy;
                                        const isBlocked = Boolean(travelState?.isBlocked);
                                        const canAfford = energy >= effectiveEnergy;
                                        return (
                                            <button
                                                key={action.id}
                                                disabled={isBlocked || !canAfford || isCompleted}
                                                onClick={() => handleHomeVisitAction(action)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isCompleted
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60'
                                                    : isBlocked
                                                        ? 'bg-red-500/10 border-red-500/20 opacity-70 cursor-not-allowed'
                                                        : canAfford
                                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                        : 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="text-xl">{action.icon}</div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-white text-xs uppercase tracking-tight">{action.label}</h4>
                                                    <p className="text-[10px] text-white/50 font-medium">
                                                        {isBlocked ? 'Akses ke sektor Timur terputus.' : action.description}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {isCompleted ? (
                                                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md uppercase">Selesai</span>
                                                    ) : isBlocked ? (
                                                        <span className="text-[9px] font-black text-red-400 bg-red-500/20 px-2 py-1 rounded-md uppercase">
                                                            {travelState?.blockedReason || 'Terblokir'}
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] font-black text-amber-400">-{effectiveEnergy} EP</span>
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

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    FULL-SCREEN BUILDING INTERIOR OVERLAY
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {buildingInterior && buildingInterior === 'posyandu' && (
                    <ErrorBoundary name="PosyanduActivePanel" fallbackAction={() => setBuildingInterior(null)} fallbackActionLabel="Tutup Posyandu">
                        <PosyanduActivePanel
                            initialBabies={(() => {
                                // Wire real village babies â€” convert to PosyanduActivePanel format
                                if (!villageData?.families) return undefined;
                                const babies = [];
                                villageData.families.forEach(fam => {
                                    (fam.members || []).forEach(m => {
                                        if (m.age !== undefined && m.age <= 5) {
                                            const ageMonths = m.age < 1 ? Math.max(1, Math.round(m.age * 12) || 1) : m.age * 12;
                                            // Approximate weight/height by age norms
                                            const weight = m.weight || (ageMonths < 6 ? 3.5 + ageMonths * 0.7 : 6 + ageMonths * 0.2);
                                            const height = m.height || (ageMonths < 12 ? 50 + ageMonths * 2 : 70 + (ageMonths - 12) * 0.8);
                                            // Build growth history stubs (2 prior months)
                                            const growthHistory = [];
                                            if (ageMonths > 2) growthHistory.push({ ageMonths: ageMonths - 2, weight: weight - 0.4 });
                                            if (ageMonths > 1) growthHistory.push({ ageMonths: ageMonths - 1, weight: weight - 0.2 });
                                            // Completed vaccines by age (Indonesian schedule)
                                            const completedVaccines = ['hb0'];
                                            if (ageMonths >= 1) completedVaccines.push('bcg', 'polio1');
                                            if (ageMonths >= 2) completedVaccines.push('dpt_hb_hib1', 'polio2');
                                            if (ageMonths >= 3) completedVaccines.push('dpt_hb_hib2', 'polio3');
                                            if (ageMonths >= 4) completedVaccines.push('dpt_hb_hib3', 'polio4', 'ipv1');
                                            if (ageMonths >= 9) completedVaccines.push('campak_rubella1');

                                            babies.push({
                                                id: m.id || `${fam.id}_${m.firstName}`,
                                                name: m.fullName || `${m.firstName || 'Bayi'} ${fam.surname || ''}`.trim(),
                                                ageMonths,
                                                gender: m.gender || 'L',
                                                familyId: fam.id,
                                                familyName: fam.surname || 'Unknown',
                                                weight: Math.round(weight * 10) / 10,
                                                height: Math.round(height),
                                                growthHistory,
                                                completedVaccines,
                                                complaint: ageMonths < 12
                                                    ? 'Ibu bawa untuk timbang dan imunisasi rutin'
                                                    : 'Ibu bawa untuk timbang rutin bulanan',
                                            });
                                        }
                                    });
                                });
                                return babies.length > 0 ? babies : undefined;
                            })()}
                            onClose={() => setBuildingInterior(null)}
                            onComplete={(result) => {
                                // === FULL POSYANDU SIDE EFFECTS (ported from PosyanduModal V1) ===

                                // 1. XP reward
                                if (result?.totalXP) addXp(result.totalXP);

                                // 2. Reputation + Energy cost (30 EP per session)
                                setPlayerStats(prev => ({
                                    ...prev,
                                    reputation: Math.min(100, Math.max(0, (prev.reputation || 50) + (result?.repDelta || 0))),
                                    energy: Math.max(0, (prev.energy || 0) - 30)
                                }));

                                // 3. Time advance (Posyandu session = ~45 minutes)
                                if (setTime) setTime(t => Math.min(960, t + 45));

                                // 4. Village IKS update â€” families whose babies attended get improved indicators
                                if (result?.sessionLog?.length > 0 && villageData?.families) {
                                    const attendedFamilyIds = new Set(
                                        result.sessionLog.map(log => log.baby?.familyId).filter(Boolean)
                                    );
                                    if (attendedFamilyIds.size > 0) {
                                        setVillageData(prev => ({
                                            ...prev,
                                            families: prev.families.map(fam => {
                                                if (!attendedFamilyIds.has(fam.id)) return fam;
                                                const indicators = { ...fam.indicators };
                                                // Posyandu participation improves nutrition & immunization indicators
                                                indicators.balita = true;
                                                indicators.imunisasi = true;
                                                return { ...fam, indicators, iksScore: calculateIKS(indicators) };
                                            })
                                        }));
                                    }
                                }

                                // 5. Update progress tracker
                                if (updateProgress) {
                                    getPosyanduProgressMetrics().forEach(metric => {
                                        updateProgress(metric, 1);
                                    });
                                }

                                setBuildingInterior(null);
                            }}
                        />
                    </ErrorBoundary>
                )}
                {buildingInterior && (buildingInterior === 'pustu' || buildingInterior === 'polindes') && (
                    <ErrorBoundary name="PustuActivePanel" fallbackAction={() => setBuildingInterior(null)} fallbackActionLabel="Tutup Pustu">
                        <PustuActivePanel
                            buildingType={buildingInterior}
                            onClose={() => setBuildingInterior(null)}
                            onComplete={(result) => {
                                if (result?.totalXP) addXp(result.totalXP);
                                if (result?.repDelta) setPlayerStats(prev => ({
                                    ...prev,
                                    reputation: Math.max(0, Math.min(100, (prev.reputation || 50) + result.repDelta))
                                }));
                                setBuildingInterior(null);
                            }}
                        />
                    </ErrorBoundary>
                )}
                {buildingInterior && buildingInterior !== 'posyandu' && buildingInterior !== 'pustu' && buildingInterior !== 'polindes' && (
                    <div className="fixed inset-0 z-50 animate-in fade-in zoom-in-95 duration-300">
                        <ErrorBoundary name="BuildingGamePanel" fallbackAction={() => setBuildingInterior(null)} fallbackActionLabel="Tutup Gedung">
                            <BuildingGamePanel
                                buildingType={buildingInterior}
                                buildingName={selectedBuilding?.name || null}
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
                                onComplete={(reward) => {
                                    if (reward.reputation) {
                                        setPlayerStats(prev => ({
                                            ...prev,
                                            reputation: (prev.reputation || 0) + reward.reputation
                                        }));
                                    }
                                }}
                                onClose={() => setBuildingInterior(null)}
                                onTriggerScenario={(scenarioId) => {
                                    const ok = triggerIKMEvent?.(scenarioId);
                                    if (!ok) {
                                        showToast(`Skenario "${scenarioId.replace(/_/g, ' ')}" belum bisa dimulai saat ini. Cek status aktif, cooldown, atau kategori IKM.`, 'warning', 4200);
                                    }
                                }}
                            />
                        </ErrorBoundary>
                    </div>
                )}

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    BEHAVIOR CHANGE CASE PANEL (UKM Gameplay)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {activeBCCase && (
                    <ErrorBoundary name="BehaviorCasePanel" fallbackAction={handleCloseBehaviorCase} fallbackActionLabel="Tutup Kasus">
                        <BehaviorCasePanel
                            building={activeBCCase}
                            familyData={activeBCCase.familyData || villageData?.families?.find(f => f.id === activeBCCase.familyId)}
                            day={day}
                            onClose={handleCloseBehaviorCase}
                            onComplete={(result) => {
                                // Apply XP, reputation, and energy cost
                                if (result.xpEarned) addXp(result.xpEarned);
                                // Always deduct energy for BC case
                                setPlayerStats(prev => ({
                                    ...prev,
                                    energy: Math.max(0, (prev.energy || 0) - 15), // BC case costs 15 energy
                                    // Apply reputation delta from behavior case outcome
                                    ...(result.reputationDelta ? { reputation: (prev.reputation || 0) + result.reputationDelta } : {})
                                }));
                                setVillageData(prev => applyBehaviorCaseOutcomeToVillage(prev, result, day));
                                appendClinicalHistoryEntry?.(buildBehaviorCaseHistoryEntry(result, day));
                                if (updateProgress) updateProgress('home_visits', 1);
                                setActiveBCCase(null);
                            }}
                        />
                    </ErrorBoundary>
                )}

                {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    COMMUNITY DIAGNOSIS PANEL (Global IKM Events)
                   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
                {activeIKMEventId && (
                    <ErrorBoundary name="CommunityDiagnosisPanel" fallbackAction={() => setActiveIKMEventId(null)} fallbackActionLabel="Tutup Panel">
                        <CommunityDiagnosisPanel
                            eventInstance={activeIKMEvents?.find(e => e.instanceId === activeIKMEventId)}
                            onClose={() => setActiveIKMEventId(null)}
                        />
                    </ErrorBoundary>
                )}
            </div>
        </ErrorBoundary>
    );
}
