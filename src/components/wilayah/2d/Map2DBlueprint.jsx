/**
 * @reflection
 * [IDENTITY]: Map2DBlueprint
 * [PURPOSE]: Canonical 2D Wilayah gameplay surface. Renders the Hybrid A+C map:
 *            editorial canvas terrain below, interactive acrylic/data markers above.
 *            Owns pan/zoom, RW blank-spot framing, and readability overlays.
 * [STATE]: Runtime-Audited
 * [DEPENDS_ON]: Map2DTerrain, Map2DMarker, layerMeta.js, map-utils.js
 */

import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Map2DTerrain from './Map2DTerrain.jsx';
import Map2DMarker from './Map2DMarker.jsx';
import { useGameStore } from '../../../store/useGameStore.js';
import { BUILDING_TYPES } from '../constants.js';
import { getWilayahLayerMeta } from '../layerMeta.js';
import { selectBridgeSeasonalState } from '../../../store/selectors.js';
import { isLocalChampionEligible } from '../../../domains/village/localChampion.js';
import { getChampionProtectedFamilies } from '../../../domains/village/championProtection.js';
import { getSpatialContext } from '../../../domains/village/spatialContext.js';
import { getScenarioById } from '../../../content/scenarios/IKMScenarioLibrary.js';

const CELL_SIZE = 10; // pixels per grid cell
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.15;
const SERVICE_RING_RADIUS = 30 * CELL_SIZE;
const SERVICE_RING_INNER_RADIUS = 20 * CELL_SIZE;
const OVERVIEW_MAX_ZOOM = 0.6;
const CLOSE_DETAIL_MIN_ZOOM = 1.15;

const EVENT_MARKER_RADIUS = 16;

const EVENT_ANCHOR_RULES = [
    {
        match: ({ scenarioId }) => scenarioId === 'kesurupan_massal',
        label: 'Sekolah',
        priorities: [BUILDING_TYPES.SCHOOL, BUILDING_TYPES.TK, BUILDING_TYPES.BALAI_DESA]
    },
    {
        match: ({ scenarioId }) => ['tolak_vaksin', 'tolak_vaksin_campak', 'skrining_anemia_remaja_putri', 'anemia_remaja_putri'].includes(scenarioId),
        label: 'Sekolah / Posyandu',
        priorities: [BUILDING_TYPES.SCHOOL, BUILDING_TYPES.POSYANDU, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ scenarioId }) => ['dukun_beranak', 'persalinan_dukun_beranak_komplikasi', 'kehamilan_remaja_dilema_sosial'].includes(scenarioId),
        label: 'Polindes / Dukun',
        priorities: [BUILDING_TYPES.POLINDES, BUILDING_TYPES.PADEPOKAN_DUKUN, BUILDING_TYPES.RTK]
    },
    {
        match: ({ scenarioId }) => ['jamu_berbahaya', 'jamu_keliling_berbahaya_oplosan_steroid', 'interaksi_obat_herbal_hipertensi', 'anak_sakit_dikerokin'].includes(scenarioId),
        label: 'Warung / Dukun',
        priorities: [BUILDING_TYPES.WARUNG, BUILDING_TYPES.TOKO_KELONTONG, BUILDING_TYPES.PADEPOKAN_DUKUN, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ scenarioId }) => ['keracunan_jajanan_pasar', 'klb_keracunan_makanan_hajatan', 'tahu_berformalin_pasar_desa', 'jajanan_sekolah_tidak_sehat'].includes(scenarioId),
        label: 'Pasar / Sekolah',
        priorities: [BUILDING_TYPES.MARKET, BUILDING_TYPES.WARUNG, BUILDING_TYPES.SCHOOL, BUILDING_TYPES.BALAI_DESA]
    },
    {
        match: ({ scenarioId }) => ['keracunan_pestisida_petani', 'gigitan_ular_di_sawah', 'asap_pembakaran_lahan', 'leptospirosis_pasca_banjir'].includes(scenarioId),
        label: 'Sawah / Pos UKK',
        priorities: [BUILDING_TYPES.FARM, BUILDING_TYPES.POS_UKK, BUILDING_TYPES.SAWAH_BERUNDAK, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ scenarioId }) => ['deteksi_stunting_posyandu', 'gizi_buruk_balita_rt_pinggiran', 'mp_asi_terlalu_dini'].includes(scenarioId),
        label: 'Posyandu / Gizi',
        priorities: [BUILDING_TYPES.POSYANDU, BUILDING_TYPES.POS_GIZI, BUILDING_TYPES.DASHAT, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ scenarioId }) => ['depresi_pasca_bencana_longsor', 'episode_psikotik_akut_pasar', 'percobaan_bunuh_diri_remaja', 'penyalahgunaan_napza_kalangan_remaja'].includes(scenarioId),
        label: 'Komunitas',
        priorities: [BUILDING_TYPES.BALAI_DESA, BUILDING_TYPES.MARKET, BUILDING_TYPES.SCHOOL, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ category }) => category === 'phbs',
        label: 'PHBS',
        priorities: [BUILDING_TYPES.POSYANDU, BUILDING_TYPES.PAMSIMAS, BUILDING_TYPES.BANK_SAMPAH, BUILDING_TYPES.MCK, BUILDING_TYPES.BALAI_DESA]
    },
    {
        match: ({ category }) => category === 'environmental',
        label: 'Lingkungan',
        priorities: [BUILDING_TYPES.PAMSIMAS, BUILDING_TYPES.BANK_SAMPAH, BUILDING_TYPES.FARM, BUILDING_TYPES.POS_UKK]
    },
    {
        match: ({ category }) => category === 'nutrition',
        label: 'Gizi',
        priorities: [BUILDING_TYPES.POSYANDU, BUILDING_TYPES.POS_GIZI, BUILDING_TYPES.DASHAT, BUILDING_TYPES.SCHOOL]
    },
    {
        match: ({ category }) => category === 'food_safety',
        label: 'Pangan',
        priorities: [BUILDING_TYPES.MARKET, BUILDING_TYPES.WARUNG, BUILDING_TYPES.SCHOOL]
    },
    {
        match: ({ category }) => category === 'traditional_health' || category === 'cultural',
        label: 'Budaya',
        priorities: [BUILDING_TYPES.PADEPOKAN_DUKUN, BUILDING_TYPES.PESANTREN, BUILDING_TYPES.BALAI_DESA]
    },
    {
        match: ({ category }) => category === 'adolescent',
        label: 'Remaja',
        priorities: [BUILDING_TYPES.SCHOOL, BUILDING_TYPES.TK, BUILDING_TYPES.PUSTU]
    },
    {
        match: ({ category }) => category === 'mental_health',
        label: 'Jiwa',
        priorities: [BUILDING_TYPES.BALAI_DESA, BUILDING_TYPES.PUSTU, BUILDING_TYPES.MARKET]
    }
];

function getEventMarkerTone(category = 'phbs') {
    switch (category) {
        case 'environmental':
            return {
                glow: 'rgba(16,185,129,0.28)',
                dot: 'rgba(16,185,129,0.96)',
                border: 'rgba(167,243,208,0.65)',
                bg: 'rgba(6,78,59,0.82)',
                text: 'rgba(209,250,229,0.96)',
            };
        case 'nutrition':
            return {
                glow: 'rgba(139,92,246,0.28)',
                dot: 'rgba(167,139,250,0.96)',
                border: 'rgba(216,180,254,0.65)',
                bg: 'rgba(76,29,149,0.82)',
                text: 'rgba(243,232,255,0.96)',
            };
        case 'food_safety':
            return {
                glow: 'rgba(239,68,68,0.28)',
                dot: 'rgba(248,113,113,0.96)',
                border: 'rgba(254,202,202,0.65)',
                bg: 'rgba(127,29,29,0.82)',
                text: 'rgba(254,226,226,0.96)',
            };
        case 'traditional_health':
        case 'cultural':
            return {
                glow: 'rgba(245,158,11,0.28)',
                dot: 'rgba(251,191,36,0.96)',
                border: 'rgba(253,230,138,0.65)',
                bg: 'rgba(120,53,15,0.82)',
                text: 'rgba(254,243,199,0.96)',
            };
        case 'mental_health':
            return {
                glow: 'rgba(236,72,153,0.28)',
                dot: 'rgba(244,114,182,0.96)',
                border: 'rgba(251,207,232,0.65)',
                bg: 'rgba(131,24,67,0.82)',
                text: 'rgba(252,231,243,0.96)',
            };
        case 'adolescent':
            return {
                glow: 'rgba(249,115,22,0.28)',
                dot: 'rgba(251,146,60,0.96)',
                border: 'rgba(254,215,170,0.65)',
                bg: 'rgba(124,45,18,0.82)',
                text: 'rgba(255,237,213,0.96)',
            };
        default:
            return {
                glow: 'rgba(56,189,248,0.28)',
                dot: 'rgba(56,189,248,0.96)',
                border: 'rgba(186,230,253,0.65)',
                bg: 'rgba(8,47,73,0.82)',
                text: 'rgba(224,242,254,0.96)',
            };
    }
}

function resolveEventAnchorBuilding(event, scenario, buildings = []) {
    const availableBuildings = Array.isArray(buildings) ? buildings.filter((building) => !building.familyId) : [];
    if (availableBuildings.length === 0) return null;

    const context = {
        scenarioId: event?.scenarioId || '',
        category: event?.category || scenario?.category || '',
        title: `${event?.title || scenario?.title || ''}`.toLowerCase(),
        speaker: `${scenario?.phases?.[0]?.speaker || ''}`.toLowerCase(),
    };

    const matchedRule = EVENT_ANCHOR_RULES.find((rule) => rule.match(context));
    const priorities = matchedRule?.priorities || [BUILDING_TYPES.BALAI_DESA, BUILDING_TYPES.PUSKESMAS];

    for (const buildingType of priorities) {
        const building = availableBuildings.find((candidate) => candidate.type === buildingType);
        if (building) {
            return {
                building,
                roleLabel: matchedRule?.label || 'Event',
            };
        }
    }

    const fallback = availableBuildings.find((candidate) => candidate.type === BUILDING_TYPES.BALAI_DESA)
        || availableBuildings.find((candidate) => candidate.type === BUILDING_TYPES.PUSKESMAS)
        || availableBuildings[0];

    if (!fallback) return null;

    return {
        building: fallback,
        roleLabel: matchedRule?.label || 'Event',
    };
}

function getServiceAnchorLabel(anchor) {
    if (!anchor) return '';
    if (anchor.id === 'puskesmas') return 'PUSKESMAS';
    if (anchor.id === 'pustu') return 'PUSTU';
    if (anchor.id === 'polindes') return 'POLINDES';
    return String(anchor.id || '').toUpperCase();
}

function getSemanticZoomLevel(zoom) {
    if (zoom < OVERVIEW_MAX_ZOOM) return 'overview';
    if (zoom >= CLOSE_DETAIL_MIN_ZOOM) return 'detail';
    return 'operational';
}

function getIntelTargetMap(lastIntelTargets = []) {
    const targetMap = new Map();
    (Array.isArray(lastIntelTargets) ? lastIntelTargets : []).forEach((target, index) => {
        if (!target?.familyId || targetMap.has(target.familyId)) return;
        targetMap.set(target.familyId, {
            rank: index + 1,
            distance: Number(target.distance ?? 0)
        });
    });
    return targetMap;
}

function getServiceAnchorVisuals(buildings = [], buildingProgress = {}) {
    const buildingsByType = new Map(
        (Array.isArray(buildings) ? buildings : []).map((building) => [building.type, building])
    );
    const fobLevel = Number(buildingProgress?.fob?.level || 0);

    const anchorDefs = [
        {
            id: 'puskesmas',
            type: BUILDING_TYPES.PUSKESMAS,
            isActive: true,
            tone: 'primary',
            fallback: { x: 100, y: 30 },
            level: 0
        },
        {
            id: 'pustu',
            type: BUILDING_TYPES.PUSTU,
            isActive: Boolean(buildingProgress?.pustu?.completed || buildingProgress?.fob?.completed),
            tone: 'satellite',
            fallback: { x: 28, y: 50 },
            level: Number(buildingProgress?.pustu?.level || 0) || fobLevel
        },
        {
            id: 'polindes',
            type: BUILDING_TYPES.POLINDES,
            isActive: Boolean(buildingProgress?.polindes?.completed || buildingProgress?.fob?.completed),
            tone: 'satellite',
            fallback: { x: 25, y: 95 },
            level: Number(buildingProgress?.polindes?.level || 0) || fobLevel
        }
    ];

    return anchorDefs
        .filter((anchor) => anchor.isActive)
        .map((anchor) => {
            const building = buildingsByType.get(anchor.type);
            const x = Number(building?.x ?? anchor.fallback.x);
            const y = Number(building?.y ?? anchor.fallback.y);
            return Number.isFinite(x) && Number.isFinite(y)
                ? {
                    ...anchor,
                    x,
                    y,
                    isLevel2: anchor.tone === 'satellite' && anchor.level >= 2
                }
                : null;
        })
        .filter(Boolean);
}

function getFacilityUpgradeStatus(building, buildingProgress = {}) {
    if (!building || building.familyId != null) return null;

    if (building.type === BUILDING_TYPES.POSYANDU) {
        const posyandu = buildingProgress.posyandu;
        if (posyandu?.isUpgraded) {
            return { tone: 'emerald', showRing: true, level: 1 };
        }
        return null;
    }

    if (building.type === BUILDING_TYPES.PUSTU || building.type === BUILDING_TYPES.POLINDES) {
        const progress = buildingProgress[building.type] || buildingProgress.fob;
        if (!progress?.completed && !progress?.isActive) {
            return null;
        }

        return {
            tone: Number(progress?.level || 0) >= 2 ? 'gold' : 'emerald',
            showRing: false,
            level: Number(progress?.level || 1)
        };
    }

    return null;
}

function Map2DBlueprintInner({
    mapData,
    selectedBuildingId,
    onBuildingSelect,
    activeLayer,
    gameTime = 480,
    bridgeStatus,
    selectedEventAnchorId = null,
    onEventAnchorSelect = null,
    selectedRwZoneId = null,
    onRwZoneSelect = null
}, ref) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1.0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [bridgeRepairFeedback, setBridgeRepairFeedback] = useState(null);
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const bridgeRepairTimerRef = useRef(null);
    const { t } = useTranslation();
    const derivedBridgeStatus = useGameStore((state) => selectBridgeSeasonalState(state).status);
    const buildingProgress = useGameStore((state) => state.publicHealth.buildingProgress);
    const activeOutbreaks = useGameStore((state) => state.publicHealth.activeOutbreaks);
    const activeIKMEvents = useGameStore((state) => state.publicHealth.activeIKMEvents);
    const lastIntelTargets = useGameStore((state) => state.publicHealth.lastIntelTargets);
    const villageData = useGameStore((state) => state.publicHealth.villageData);
    const repairBridge = useGameStore((state) => state.publicHealthActions.repairBridge);
    const effectiveBridgeStatus = bridgeStatus ?? derivedBridgeStatus ?? 'normal';
    const layerVisual = getWilayahLayerMeta(activeLayer, t);
    const semanticZoomLevel = useMemo(() => getSemanticZoomLevel(zoom), [zoom]);
    const isOverviewZoom = semanticZoomLevel === 'overview';
    const isCloseDetailZoom = semanticZoomLevel === 'detail';

    const mapW = mapData.width * CELL_SIZE;
    const mapH = mapData.height * CELL_SIZE;
    const showBridgeStatusDetails = !isOverviewZoom;
    const shouldShowEastOverlay = showBridgeStatusDetails && effectiveBridgeStatus !== 'normal';
    const showServiceCoverage = Boolean(layerVisual.showServiceCoverage);
    const showServiceLabels = Boolean(layerVisual.showServiceLabels || (activeLayer === 'general' && isCloseDetailZoom));
    const serviceRingOpacity = Number(layerVisual.serviceRingOpacity ?? 1);
    const serviceLabelScale = Math.min(1.4, Math.max(0.9, 1 / Math.max(zoom, 0.01)));
    const intelTargetMap = useMemo(() => getIntelTargetMap(lastIntelTargets), [lastIntelTargets]);

    const eastSectorOverlayStyle = useMemo(() => {
        if (!shouldShowEastOverlay) return null;
        if (effectiveBridgeStatus === 'putus') {
            return {
                background: 'rgba(220,38,38,0.06)',
                borderLeft: '1px dashed rgba(220,38,38,0.25)',
                animation: 'primer-east-danger-pulse 2.4s ease-in-out infinite'
            };
        }
        return {
            background: 'rgba(217,119,6,0.04)',
            borderLeft: '1px solid rgba(217,119,6,0.15)'
        };
    }, [effectiveBridgeStatus, shouldShowEastOverlay]);

    // ═══ Center the map on initial mount ═══
    useEffect(() => {
        if (!containerRef.current) return;
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;
        // Center the village hub (centerX, centerY) in the viewport
        const initialZoom = Math.min(cw / mapW, ch / mapH) * 0.9;
        const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialZoom));
        setPan({
            x: (cw / 2) - (mapData.centerX * CELL_SIZE * clampedZoom),
            y: (ch / 2) - (mapData.centerY * CELL_SIZE * clampedZoom),
        });
        setZoom(clampedZoom);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapData.centerX, mapData.centerY]);

    // ═══ Zoom controls exposed to parent via ref ═══
    useImperativeHandle(ref, () => ({
        zoomIn: () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP)),
        zoomOut: () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP)),
        reset: () => {
            if (!containerRef.current) return;
            const cw = containerRef.current.clientWidth;
            const ch = containerRef.current.clientHeight;
            const fitZoom = Math.min(cw / mapW, ch / mapH) * 0.9;
            setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, fitZoom)));
            setPan({
                x: (cw / 2) - (mapData.centerX * CELL_SIZE * fitZoom),
                y: (ch / 2) - (mapData.centerY * CELL_SIZE * fitZoom),
            });
        },
    }), [mapW, mapH, mapData.centerX, mapData.centerY]);

    // ═══ Mouse wheel zoom (zoom toward cursor) ═══
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        setZoom(prevZ => {
            const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
            const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZ + delta));
            const scale = newZ / prevZ;
            setPan(prev => ({
                x: mx - (mx - prev.x) * scale,
                y: my - (my - prev.y) * scale,
            }));
            return newZ;
        });
    }, []);

    // ═══ Pointer drag pan (mouse + single-finger touch) ═══
    const handlePointerDown = useCallback((e) => {
        if (e.pointerType === 'touch' && e.isPrimary === false) return; // let pinch handler manage multi-touch
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }, [pan]);

    const handlePointerMove = useCallback((e) => {
        if (!isDragging) return;
        setPan({
            x: dragStart.current.panX + (e.clientX - dragStart.current.x),
            y: dragStart.current.panY + (e.clientY - dragStart.current.y),
        });
    }, [isDragging]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // ═══ Two-finger pinch zoom (mobile) ═══
    const pinchState = useRef({ active: false, startDist: 0, startZoom: 1, midX: 0, midY: 0 });

    const getTouchDistance = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const getTouchMidpoint = (t1, t2, rect) => ({
        x: (t1.clientX + t2.clientX) / 2 - rect.left,
        y: (t1.clientY + t2.clientY) / 2 - rect.top,
    });

    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const mid = getTouchMidpoint(e.touches[0], e.touches[1], rect);
            pinchState.current = {
                active: true,
                startDist: getTouchDistance(e.touches[0], e.touches[1]),
                startZoom: zoom,
                midX: mid.x,
                midY: mid.y,
            };
            setIsDragging(false); // cancel any single-finger drag
        }
    }, [zoom]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length === 2 && pinchState.current.active) {
            e.preventDefault();
            const dist = getTouchDistance(e.touches[0], e.touches[1]);
            const scaleFactor = dist / pinchState.current.startDist;
            const newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchState.current.startZoom * scaleFactor));
            const scaleChange = newZ / zoom;
            const { midX, midY } = pinchState.current;

            setPan(prev => ({
                x: midX - (midX - prev.x) * scaleChange,
                y: midY - (midY - prev.y) * scaleChange,
            }));
            setZoom(newZ);
        }
    }, [zoom]);

    const handleTouchEnd = useCallback((e) => {
        if (e.touches.length < 2) {
            pinchState.current.active = false;
        }
    }, []);

    // ═══ Group buildings by RW for zone rendering ═══
    const rwZones = useMemo(() => {
        const zones = {};
        if (!mapData.buildings) return zones;

        mapData.buildings.forEach(b => {
            if (!b.familyData) return;
            const rw = b.familyData.rw || (b.familyId ? '01' : null);
            if (!rw) return;
            if (!zones[rw]) {
                zones[rw] = {
                    minX: Infinity,
                    minY: Infinity,
                    maxX: -Infinity,
                    maxY: -Infinity,
                    familyCount: 0,
                    lockedCount: 0,
                };
            }
            zones[rw].minX = Math.min(zones[rw].minX, b.x);
            zones[rw].minY = Math.min(zones[rw].minY, b.y);
            zones[rw].maxX = Math.max(zones[rw].maxX, b.x);
            zones[rw].maxY = Math.max(zones[rw].maxY, b.y);
            zones[rw].familyCount += 1;
            if (b.isLocked || b.familyData?.isLocked) zones[rw].lockedCount += 1;
        });
        Object.values(zones).forEach((zone) => {
            zone.isLocked = zone.familyCount > 0 && zone.lockedCount === zone.familyCount;
        });
        return zones;
    }, [mapData.buildings]);

    const championFamilyIds = useMemo(() => {
        const families = villageData?.families;
        if (!Array.isArray(families) || families.length === 0) return [];
        return families
            .filter((family) => isLocalChampionEligible(family.iksScore))
            .map((family) => family.id);
    }, [villageData]);

    const championFamilyIdSet = useMemo(() => new Set(championFamilyIds || []), [championFamilyIds]);

    // ═══ SEMANTIC ZOOM: overview → operational → detail ═══
    // overview (< 0.6): facilities + critical cue houses only
    // operational (0.6 - < 1.15): full markers, full interactivity
    // detail (>= 1.15): full markers + auto labels for local/event cues
    const visibleBuildings = useMemo(() => {
        if (!mapData.buildings) return [];
        if (!isOverviewZoom) return mapData.buildings;

        return mapData.buildings.filter((b) => {
            if (selectedBuildingId === b.id) return true;
            if (!b.familyId) return true;
            if (b.familyData?.iksScore != null && b.familyData.iksScore < 0.4) return true;
            if (b.hasCase || b.familyData?.hasCase) return true;
            if (b.hasJentik) return true;
            if (b.economyTier === 'Very Low' || b.economyTier === 'Low') return true;
            if (b.familyId && intelTargetMap.has(b.familyId)) return true;
            if (b.familyId && championFamilyIdSet.has(b.familyId)) return true;
            return false;
        });
    }, [mapData.buildings, isOverviewZoom, selectedBuildingId, intelTargetMap, championFamilyIdSet]);

    const protectedFamilyIds = useMemo(() => {
        if (!Array.isArray(championFamilyIds) || championFamilyIds.length === 0 || !villageData) return [];
        const familyCoords = getSpatialContext(villageData)?.familyCoords;
        if (!familyCoords) return [];
        return getChampionProtectedFamilies(championFamilyIds, familyCoords, 3);
    }, [championFamilyIds, villageData]);
    const protectedFamilyIdSet = useMemo(() => new Set(protectedFamilyIds || []), [protectedFamilyIds]);

    const visibleBuildingsWithStatus = useMemo(() => (
        visibleBuildings.map((building) => ({
            ...(intelTargetMap.get(building.familyId) || {}),
            ...building,
            upgradeStatus: getFacilityUpgradeStatus(building, buildingProgress),
            isChampion: Boolean(building.familyId && championFamilyIdSet.has(building.familyId)),
            isChampionProtected: Boolean(building.familyId && protectedFamilyIdSet.has(building.familyId)),
            isIntelTarget: Boolean(building.familyId && intelTargetMap.has(building.familyId))
        }))
    ), [visibleBuildings, buildingProgress, championFamilyIdSet, protectedFamilyIdSet, intelTargetMap]);
    const lockedRwCount = useMemo(
        () => Object.values(rwZones).filter((zone) => zone.isLocked).length,
        [rwZones]
    );
    const championCount = championFamilyIds.length;
    const intelTargetCount = intelTargetMap.size;
    const bridgeStatusLabel = effectiveBridgeStatus === 'putus'
        ? 'Jembatan Putus'
        : effectiveBridgeStatus === 'rawan_banjir'
            ? 'Jembatan Rawan'
            : 'Jembatan Normal';
    const ikmEventAnchors = useMemo(() => {
        return (Array.isArray(activeIKMEvents) ? activeIKMEvents : [])
            .filter((event) => event && !event.completed)
            .map((event, index) => {
                const scenario = getScenarioById(event.scenarioId);
                const resolvedAnchor = resolveEventAnchorBuilding(event, scenario, mapData.buildings);
                if (!resolvedAnchor?.building) return null;

                const tone = getEventMarkerTone(event.category || scenario?.category);
                return {
                    id: `ikm-anchor-${event.instanceId}`,
                    eventInstanceId: event.instanceId,
                    title: event.title || scenario?.title || 'Event IKM',
                    phaseLabel: scenario?.phases?.find((phase) => phase.id === event.currentPhaseId)?.speaker || resolvedAnchor.roleLabel,
                    roleLabel: resolvedAnchor.roleLabel,
                    category: event.category || scenario?.category || 'phbs',
                    x: Number(resolvedAnchor.building.x),
                    y: Number(resolvedAnchor.building.y),
                    buildingName: resolvedAnchor.building.name || resolvedAnchor.building.id,
                    tone,
                    zIndex: 22 + index,
                };
            })
            .filter((anchor) => anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y));
    }, [activeIKMEvents, mapData.buildings]);
    const mapLegendItems = useMemo(() => {
        const items = [];

        if (lockedRwCount > 0) {
            items.push({
                key: 'blank-spot',
                label: `Blank ${lockedRwCount}`,
                color: '#fef3c7',
                background: 'rgba(146,64,14,0.35)',
                border: '1px solid rgba(251,191,36,0.25)',
            });
        }

        if (showServiceCoverage) {
            items.push({
                key: 'service-coverage',
                label: 'Cakupan',
                color: 'rgba(186,230,253,0.96)',
                background: 'rgba(8,47,73,0.4)',
                border: '1px solid rgba(56,189,248,0.22)',
            });
        }

        if (intelTargetCount > 0) {
            items.push({
                key: 'intel-targets',
                label: `Intel ${intelTargetCount}`,
                color: '#cffafe',
                background: 'rgba(8,145,178,0.35)',
                border: '1px solid rgba(34,211,238,0.25)',
            });
        }

        if (championCount > 0) {
            items.push({
                key: 'local-champions',
                label: `Kader ${championCount}`,
                color: '#fef3c7',
                background: 'rgba(120,53,15,0.35)',
                border: '1px solid rgba(251,191,36,0.25)',
            });
        }

        if (ikmEventAnchors.length > 0) {
            items.push({
                key: 'ikm-events',
                label: `IKM ${ikmEventAnchors.length}`,
                color: 'rgba(224,242,254,0.96)',
                background: 'rgba(8,47,73,0.4)',
                border: '1px solid rgba(56,189,248,0.24)',
            });
        }

        if (effectiveBridgeStatus !== 'normal') {
            items.push({
                key: 'bridge-status',
                label: bridgeStatusLabel,
                color: effectiveBridgeStatus === 'putus' ? '#ffe4e6' : '#fef3c7',
                background: effectiveBridgeStatus === 'putus' ? 'rgba(127,29,29,0.45)' : 'rgba(146,64,14,0.35)',
                border: effectiveBridgeStatus === 'putus'
                    ? '1px solid rgba(251,113,133,0.28)'
                    : '1px solid rgba(251,191,36,0.25)',
            });
        }

        return items;
    }, [
        lockedRwCount,
        showServiceCoverage,
        intelTargetCount,
        championCount,
        ikmEventAnchors.length,
        effectiveBridgeStatus,
        bridgeStatusLabel,
    ]);

    const outbreakZones = useMemo(() => {
        const buildingsById = new Map((mapData.buildings || []).map((building) => [building.id, building]));
        return (Array.isArray(activeOutbreaks) ? activeOutbreaks : [])
            .filter((outbreak) => !outbreak?.resolved && Array.isArray(outbreak.affectedHouseIds) && outbreak.affectedHouseIds.length > 0)
            .map((outbreak) => {
                const points = outbreak.affectedHouseIds
                    .map((houseId) => buildingsById.get(houseId))
                    .filter(Boolean)
                    .map((building) => ({ x: Number(building.x), y: Number(building.y) }))
                    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

                if (points.length === 0) return null;

                const centroidX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
                const centroidY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
                const maxDistance = points.reduce((max, point) => {
                    const distance = Math.hypot(point.x - centroidX, point.y - centroidY);
                    return Math.max(max, distance);
                }, 0);
                const radius = Math.max(6, maxDistance + 3);
                return {
                    id: outbreak.id,
                    label: `WABAH ${(outbreak.typeData?.label || outbreak.type || 'cluster').toUpperCase()}`,
                    left: (centroidX - radius) * CELL_SIZE,
                    top: (centroidY - radius) * CELL_SIZE,
                    size: radius * 2 * CELL_SIZE
                };
            })
            .filter(Boolean);
    }, [activeOutbreaks, mapData.buildings]);

    const serviceAnchorVisuals = useMemo(
        () => getServiceAnchorVisuals(mapData.buildings, buildingProgress),
        [mapData.buildings, buildingProgress]
    );

    const bridgeBuilding = useMemo(
        () => (mapData.buildings || []).find((building) => building.type === BUILDING_TYPES.JEMBATAN) || null,
        [mapData.buildings]
    );

    const showBridgeRepairChip = Boolean(bridgeBuilding && effectiveBridgeStatus === 'putus' && showBridgeStatusDetails);

    useEffect(() => () => {
        if (bridgeRepairTimerRef.current) {
            window.clearTimeout(bridgeRepairTimerRef.current);
        }
    }, []);

    const handleBridgeRepair = useCallback(() => {
        if (typeof repairBridge !== 'function') return;
        const result = repairBridge();
        if (bridgeRepairTimerRef.current) {
            window.clearTimeout(bridgeRepairTimerRef.current);
        }

        if (result?.success) {
            setBridgeRepairFeedback({ tone: 'success', label: 'DIPERBAIKI ✓' });
            bridgeRepairTimerRef.current = window.setTimeout(() => {
                setBridgeRepairFeedback(null);
            }, 1000);
            return;
        }

        setBridgeRepairFeedback({
            tone: 'error',
            label: result?.message || 'Perbaikan gagal'
        });
        bridgeRepairTimerRef.current = window.setTimeout(() => {
            setBridgeRepairFeedback(null);
        }, 2000);
    }, [repairBridge]);

    // ═══ XII.B: Warm editorial RW zone colors ═══
    const rwColors = {
        '01': 'rgba(56,189,248,0.05)',
        '02': 'rgba(129,140,248,0.05)',
        '03': 'rgba(52,211,153,0.05)',
        '04': 'rgba(251,191,36,0.05)',
        '05': 'rgba(244,114,182,0.05)',
        '06': 'rgba(248,113,113,0.05)',
        '07': 'rgba(163,230,53,0.05)',
        '08': 'rgba(45,212,191,0.05)',
    };
    const rwBorderColors = {
        '01': 'rgba(103,232,249,0.22)',
        '02': 'rgba(165,180,252,0.22)',
        '03': 'rgba(110,231,183,0.22)',
        '04': 'rgba(253,224,71,0.22)',
        '05': 'rgba(249,168,212,0.22)',
        '06': 'rgba(252,165,165,0.22)',
        '07': 'rgba(190,242,100,0.22)',
        '08': 'rgba(153,246,228,0.22)',
    };

    return (
        <div
            ref={containerRef}
            data-testid="map2d-semantic-zoom-root"
            data-semantic-zoom={semanticZoomLevel}
            className="absolute inset-0 overflow-hidden select-none"
            style={{
                backgroundColor: '#09131a',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
            }}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* ═══ VIGNETTE (warm parchment edge — XII.B) ═══ */}
            <div
                className="absolute inset-0 pointer-events-none z-50"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(8,15,22,0) 54%, rgba(2,6,23,0.62) 100%)',
                }}
            />

            {/* ═══ DIRECTIVE 3: Time-of-Day Lighting Overlay ═══ */}
            {(() => {
                // gameTime = minutes since midnight (0-1440)
                const t = gameTime ?? 480;
                let overlayColor = 'transparent';
                let opacity = 0;
                if (t < 360) {        // 00:00-06:00 Night
                    overlayColor = 'rgba(15,23,42,0.35)';
                    opacity = 1;
                } else if (t < 480) { // 06:00-08:00 Dawn (golden)
                    overlayColor = 'rgba(251,191,36,0.12)';
                    opacity = 1 - (t - 360) / 120; // fade out
                } else if (t < 960) { // 08:00-16:00 Day (clear)
                    overlayColor = 'transparent';
                    opacity = 0;
                } else if (t < 1080) { // 16:00-18:00 Dusk (amber)
                    overlayColor = 'rgba(245,158,11,0.15)';
                    opacity = (t - 960) / 120; // fade in
                } else {               // 18:00-24:00 Night
                    overlayColor = 'rgba(15,23,42,0.35)';
                    opacity = Math.min(1, (t - 1080) / 120);
                }
                if (opacity <= 0) return null;
                return (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            zIndex: 45,
                            backgroundColor: overlayColor,
                            opacity,
                            mixBlendMode: 'multiply',
                            transition: 'background-color 2s ease, opacity 2s ease',
                        }}
                    />
                );
            })()}

            {/* ═══ TRANSFORM CONTAINER (pan + zoom) ═══ */}
            <div
                className="absolute origin-top-left will-change-transform"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    width: mapW,
                    height: mapH,
                    backgroundColor: '#111c24',
                }}
            >
                {/* Terrain backdrop */}
                    <Map2DTerrain
                        mapData={mapData}
                        cellSize={CELL_SIZE}
                        bridgeStatus={effectiveBridgeStatus}
                        showBridgeStatusDetails={showBridgeStatusDetails}
                        activeLayer={activeLayer}
                    />

                {/* RW Zone boundaries */}
                {Object.entries(rwZones).map(([rw, zone]) => {
                    const pad = 3; // grid cells padding
                    const isRwSelected = selectedRwZoneId === rw;
                    const isZoneInteractive = zone.isLocked && typeof onRwZoneSelect === 'function';
                    const zoneBackground = zone.isLocked
                        ? `repeating-linear-gradient(-45deg, rgba(148,163,184,0.12) 0 7px, rgba(15,23,42,0.02) 7px 14px), ${rwColors[rw] || 'rgba(100,116,139,0.06)'}`
                        : rwColors[rw] || 'rgba(100,116,139,0.06)';
                    const zoneBorder = zone.isLocked
                        ? 'rgba(148,163,184,0.36)'
                        : rwBorderColors[rw] || 'rgba(100,116,139,0.2)';
                    return (
                        <div
                            key={`rw-${rw}`}
                            className="absolute pointer-events-none"
                            style={{
                                left: (zone.minX - pad) * CELL_SIZE,
                                top: (zone.minY - pad) * CELL_SIZE,
                                width: (zone.maxX - zone.minX + pad * 2) * CELL_SIZE,
                                height: (zone.maxY - zone.minY + pad * 2) * CELL_SIZE,
                                background: zoneBackground,
                                border: `1px dashed ${zoneBorder}`,
                                borderRadius: 8,
                                boxShadow: zone.isLocked
                                    ? isRwSelected
                                        ? 'inset 0 0 0 1px rgba(251,191,36,0.22), 0 0 0 1px rgba(251,191,36,0.16)'
                                        : 'inset 0 0 0 1px rgba(226,232,240,0.05)'
                                    : 'inset 0 0 0 1px rgba(255,255,255,0.01)',
                            }}
                        >
                            {zone.isLocked && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center font-black uppercase tracking-[0.28em]"
                                    style={{
                                        fontSize: 8,
                                        color: 'rgba(226,232,240,0.12)',
                                        textShadow: '0 1px 0 rgba(2,6,23,0.42)',
                                    }}
                                >
                                    Zona Belum Terdata
                                </div>
                            )}
                            <button
                                type="button"
                                data-testid={`rw-zone-chip-${rw}`}
                                onPointerDown={isZoneInteractive ? (event) => event.stopPropagation() : undefined}
                                onClick={isZoneInteractive ? (event) => {
                                    event.stopPropagation();
                                    onRwZoneSelect({
                                        rw,
                                        familyCount: zone.familyCount,
                                        lockedCount: zone.lockedCount,
                                        isLocked: zone.isLocked
                                    });
                                } : undefined}
                                title={zone.isLocked ? `Buka dossier blank spot RW ${rw}` : `RW ${rw}`}
                                aria-label={zone.isLocked ? `Buka dossier blank spot RW ${rw}` : `RW ${rw}`}
                                className={`absolute rounded-md px-1.5 py-1 text-left ${isZoneInteractive ? 'pointer-events-auto transition-transform duration-200 hover:scale-[1.03]' : 'pointer-events-none'}`}
                                style={{
                                    top: 4,
                                    left: 6,
                                    maxWidth: 74,
                                    background: zone.isLocked
                                        ? isRwSelected
                                            ? 'rgba(24,15,8,0.92)'
                                            : 'rgba(7,12,20,0.86)'
                                        : 'rgba(7,12,20,0.72)',
                                    border: isRwSelected
                                        ? '1px solid rgba(251,191,36,0.45)'
                                        : `1px solid ${zoneBorder}`,
                                    boxShadow: isRwSelected
                                        ? '0 10px 24px rgba(251,191,36,0.14)'
                                        : '0 8px 18px rgba(2,6,23,0.28)',
                                    cursor: isZoneInteractive ? 'pointer' : 'default',
                                }}
                            >
                                <div
                                    className="font-black uppercase tracking-[0.2em]"
                                    style={{
                                        fontSize: 7,
                                        lineHeight: 1.1,
                                        color: zone.isLocked ? 'rgba(226,232,240,0.96)' : rwBorderColors[rw] || 'rgba(148,163,184,0.58)',
                                    }}
                                >
                                    RW {rw}
                                </div>
                                <div
                                    className="font-black uppercase"
                                    style={{
                                        marginTop: 2,
                                        fontSize: 6.5,
                                        lineHeight: 1.1,
                                        letterSpacing: '0.08em',
                                        color: zone.isLocked ? 'rgba(251,191,36,0.92)' : 'rgba(203,213,225,0.76)',
                                    }}
                                >
                                    {zone.isLocked ? 'ZONA BELUM TERDATA' : `${zone.familyCount} KK`}
                                </div>
                                {zone.isLocked && (
                                    <div
                                        className="font-black uppercase"
                                        style={{
                                            marginTop: 2,
                                            fontSize: 6,
                                            lineHeight: 1.15,
                                            letterSpacing: '0.08em',
                                            color: 'rgba(148,163,184,0.88)',
                                        }}
                                    >
                                        Blank Spot PIS-PK
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}

                {outbreakZones.map((zone) => (
                    <div
                        key={zone.id}
                        data-testid={`outbreak-zone-${zone.id}`}
                        className="absolute pointer-events-none rounded-full"
                        style={{
                            left: zone.left,
                            top: zone.top,
                            width: zone.size,
                            height: zone.size,
                            zIndex: 17,
                            background: activeLayer === 'surveillance'
                                ? 'rgba(220,38,38,0.10)'
                                : 'rgba(220,38,38,0.06)',
                            border: '1px dashed rgba(220,38,38,0.20)'
                        }}
                    >
                        <span
                            className="absolute left-1/2 -translate-x-1/2 font-black uppercase tracking-[0.18em]"
                            style={{
                                top: -10,
                                fontSize: 7,
                                color: 'rgba(220,38,38,0.55)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {zone.label}
                        </span>
                    </div>
                ))}

                {ikmEventAnchors.map((anchor) => {
                    const isSelected = selectedEventAnchorId === anchor.eventInstanceId;
                    const showLabel = isSelected || isCloseDetailZoom;

                    return (
                        <button
                            key={anchor.id}
                            type="button"
                            data-testid={`ikm-event-anchor-${anchor.eventInstanceId}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                onEventAnchorSelect?.(anchor.eventInstanceId);
                            }}
                            className="absolute rounded-full transition-transform duration-200"
                            style={{
                                left: (anchor.x * CELL_SIZE) - EVENT_MARKER_RADIUS,
                                top: (anchor.y * CELL_SIZE) - EVENT_MARKER_RADIUS,
                                width: EVENT_MARKER_RADIUS * 2,
                                height: EVENT_MARKER_RADIUS * 2,
                                zIndex: anchor.zIndex,
                                background: 'transparent',
                                pointerEvents: onEventAnchorSelect ? 'auto' : 'none',
                                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                            }}
                            title={`${anchor.title} • ${anchor.buildingName}`}
                            aria-label={`${anchor.title} di ${anchor.buildingName}`}
                        >
                            <span
                                className="absolute inset-[5px] rounded-full"
                                style={{
                                    border: `1px solid ${anchor.tone.border}`,
                                    background: anchor.tone.bg,
                                    boxShadow: `0 0 0 4px ${anchor.tone.glow}`,
                                    animation: 'primer-map-pulse 1.8s ease-in-out infinite'
                                }}
                            />
                            <span
                                className="absolute inset-[11px] rounded-full"
                                style={{
                                    background: anchor.tone.dot,
                                    boxShadow: `0 0 12px ${anchor.tone.dot}`
                                }}
                            />
                            {showLabel && (
                                <span
                                    data-testid={`ikm-event-label-${anchor.eventInstanceId}`}
                                    className="absolute left-1/2 rounded-full px-2 py-1 font-black uppercase tracking-[0.16em] whitespace-nowrap pointer-events-none"
                                    style={{
                                        top: -(EVENT_MARKER_RADIUS + 18),
                                        transform: 'translateX(-50%)',
                                        fontSize: 7,
                                        color: anchor.tone.text,
                                        background: anchor.tone.bg,
                                        border: `1px solid ${anchor.tone.border}`,
                                        boxShadow: '0 8px 18px rgba(15,23,42,0.18)',
                                        opacity: isSelected ? 1 : 0.96
                                    }}
                                >
                                    {anchor.roleLabel}: {anchor.title}
                                </span>
                            )}
                        </button>
                    );
                })}

                {showServiceCoverage && serviceAnchorVisuals.map((anchor) => {
                    const primaryStyle = anchor.tone === 'primary'
                        ? {
                            border: '1.5px dashed rgba(14,165,233,0.25)',
                            background: 'rgba(14,165,233,0.03)'
                        }
                        : {
                            border: '1.5px dashed rgba(16,185,129,0.25)',
                            background: 'rgba(16,185,129,0.03)'
                        };
                    const labelTone = anchor.tone === 'primary'
                        ? {
                            border: '1px solid rgba(14,165,233,0.32)',
                            background: 'rgba(15,23,42,0.76)',
                            color: 'rgba(186,230,253,0.95)',
                            accent: 'rgba(14,165,233,0.95)'
                        }
                        : {
                            border: '1px solid rgba(16,185,129,0.32)',
                            background: 'rgba(15,23,42,0.72)',
                            color: 'rgba(167,243,208,0.95)',
                            accent: 'rgba(16,185,129,0.92)'
                        };

                    return (
                        <React.Fragment key={`service-ring-${anchor.id}`}>
                            <div
                                data-testid={`service-ring-${anchor.id}`}
                                className="absolute pointer-events-none rounded-full"
                                style={{
                                    left: (anchor.x * CELL_SIZE) - SERVICE_RING_RADIUS,
                                    top: (anchor.y * CELL_SIZE) - SERVICE_RING_RADIUS,
                                    width: SERVICE_RING_RADIUS * 2,
                                    height: SERVICE_RING_RADIUS * 2,
                                    zIndex: 15,
                                    opacity: serviceRingOpacity,
                                    ...primaryStyle
                                }}
                            />
                            {anchor.isLevel2 && (
                                <div
                                    data-testid={`service-ring-inner-${anchor.id}`}
                                    className="absolute pointer-events-none rounded-full"
                                    style={{
                                        left: (anchor.x * CELL_SIZE) - SERVICE_RING_INNER_RADIUS,
                                        top: (anchor.y * CELL_SIZE) - SERVICE_RING_INNER_RADIUS,
                                        width: SERVICE_RING_INNER_RADIUS * 2,
                                        height: SERVICE_RING_INNER_RADIUS * 2,
                                        zIndex: 16,
                                        opacity: serviceRingOpacity,
                                        border: '1px solid rgba(16,185,129,0.15)'
                                    }}
                                />
                            )}
                            {showServiceLabels && (
                                <div
                                    data-testid={`service-label-${anchor.id}`}
                                    className="absolute pointer-events-none rounded-full px-2 py-1"
                                    style={{
                                        left: anchor.x * CELL_SIZE,
                                        top: (anchor.y * CELL_SIZE) - SERVICE_RING_RADIUS - 12,
                                        transform: `translate(-50%, -100%) scale(${serviceLabelScale})`,
                                        transformOrigin: 'center bottom',
                                        zIndex: 19,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 6px 18px rgba(15,23,42,0.16)',
                                        opacity: Math.max(0.72, serviceRingOpacity),
                                        ...labelTone
                                    }}
                                >
                                    <span
                                        className="font-black uppercase tracking-[0.18em]"
                                        style={{ fontSize: 7.5, lineHeight: 1 }}
                                    >
                                        {getServiceAnchorLabel(anchor)}
                                    </span>
                                    {anchor.isLevel2 && (
                                        <span
                                            className="rounded-full px-1 py-0.5 font-black uppercase"
                                            style={{
                                                fontSize: 6.5,
                                                lineHeight: 1,
                                                color: '#052e16',
                                                background: 'rgba(167,243,208,0.92)',
                                                border: `1px solid ${labelTone.accent}`
                                            }}
                                        >
                                            L2
                                        </span>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                {shouldShowEastOverlay && (
                    <div
                        data-testid="east-sector-overlay"
                        className="absolute pointer-events-none"
                        style={{
                            left: 120 * CELL_SIZE,
                            top: 0,
                            width: Math.max(0, mapData.width - 120) * CELL_SIZE,
                            height: mapH,
                            zIndex: 18,
                            ...eastSectorOverlayStyle
                        }}
                    />
                )}

                {showBridgeRepairChip && (
                    <button
                        type="button"
                        data-testid="bridge-repair-chip"
                        onClick={handleBridgeRepair}
                        className={`absolute rounded-md px-2 py-1 text-left ${bridgeRepairFeedback?.tone === 'error' ? 'animate-[primer-bridge-chip-shake_0.2s_ease-in-out_1]' : ''}`}
                        style={{
                            left: bridgeBuilding.x * CELL_SIZE,
                            top: (bridgeBuilding.y * CELL_SIZE) + 16,
                            transform: 'translateX(-50%)',
                            zIndex: 28,
                            pointerEvents: 'auto',
                            background: bridgeRepairFeedback?.tone === 'success'
                                ? 'rgba(16,185,129,0.88)'
                                : 'rgba(220,38,38,0.85)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
                        }}
                    >
                        <div
                            className="font-black uppercase tracking-[0.15em] text-white"
                            style={{ fontSize: 8 }}
                        >
                            {bridgeRepairFeedback?.label || 'PERBAIKI'}
                        </div>
                        <div
                            className="font-black uppercase"
                            style={{ fontSize: 7, color: '#fbbf24' }}
                        >
                            -25 EP
                        </div>
                    </button>
                )}

                {/* Building markers (semantic zoom filtering) */}
                {visibleBuildingsWithStatus.map((building) => (
                    <Map2DMarker
                        key={building.id}
                        building={building}
                        cellSize={CELL_SIZE}
                        activeLayer={activeLayer}
                        showStatusDetails={showBridgeStatusDetails}
                        selected={selectedBuildingId === building.id}
                        onClick={onBuildingSelect}
                    />
                ))}
            </div>

            {mapLegendItems.length > 0 && (
                <div
                    className="absolute left-4 top-24 z-40 pointer-events-none"
                    style={{ maxWidth: 'min(260px, calc(100vw - 2rem))' }}
                    data-testid="wilayah-map-layer-legend"
                    data-layer={activeLayer}
                    data-semantic-zoom={semanticZoomLevel}
                >
                    <div
                        className="rounded-2xl px-3 py-2"
                        style={{
                            background: layerVisual.chipBg,
                            border: `1px solid ${layerVisual.chipBorder}`,
                            boxShadow: '0 14px 32px rgba(15,23,42,0.14)',
                        }}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div
                                className="font-black uppercase tracking-[0.22em]"
                                style={{ fontSize: 7.5, color: layerVisual.accent }}
                            >
                                Cue Peta
                            </div>
                            <div
                                className="font-black uppercase tracking-[0.18em]"
                                style={{ fontSize: 7, color: layerVisual.chipText, opacity: 0.72 }}
                            >
                                {layerVisual.label}
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {mapLegendItems.map((item) => (
                                <span
                                    key={item.key}
                                    className="rounded-full px-2 py-1 font-black uppercase tracking-[0.14em]"
                                    style={{
                                        fontSize: 7,
                                        color: item.color,
                                        background: item.background,
                                        border: item.border,
                                    }}
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ ZOOM INDICATOR ═══ */}
            <div className="absolute bottom-16 left-4 z-40 pointer-events-none">
                <div className="px-2 py-1 rounded-md text-[9px] font-black text-white/30 uppercase tracking-widest"
                    style={{ background: 'rgba(15,23,42,0.5)', boxShadow: '0 8px 18px rgba(2,6,23,0.22)' }}>
                    {(zoom * 100).toFixed(0)}%
                </div>
            </div>

            {/* ═══ COMPASS ═══ */}
            <div className="absolute top-16 right-4 z-40 pointer-events-none">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-white/20"
                    style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    N
                </div>
            </div>

            <style>
                {`
                    @keyframes primer-map-pulse {
                        0%, 100% { transform: scale(0.92); opacity: 0.72; }
                        50% { transform: scale(1.08); opacity: 1; }
                    }

                    @keyframes primer-east-danger-pulse {
                        0%, 100% { opacity: 0.7; }
                        50% { opacity: 1; }
                    }

                    @keyframes primer-bridge-chip-shake {
                        0%, 100% { transform: translateX(-50%); }
                        25% { transform: translateX(calc(-50% - 3px)); }
                        75% { transform: translateX(calc(-50% + 3px)); }
                    }
                `}
            </style>
        </div>
    );
}

const Map2DBlueprint = forwardRef(Map2DBlueprintInner);
export default Map2DBlueprint;
