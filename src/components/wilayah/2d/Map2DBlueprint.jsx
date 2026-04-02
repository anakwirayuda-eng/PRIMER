/**
 * @reflection
 * [IDENTITY]: Map2DBlueprint
 * [PURPOSE]: Main 2D helicopter-view blueprint map. Renders all buildings from mapData
 *            as interactive DOM markers over a simplified SVG terrain backdrop.
 *            Supports pan (drag), zoom (wheel/pinch), keyboard shortcuts, and exposes
 *            zoom API via forwardRef for parent HUD controls.
 * [STATE]: New
 * [DEPENDS_ON]: Map2DTerrain, Map2DMarker, map-utils.js
 */

import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import Map2DTerrain from './Map2DTerrain.jsx';
import Map2DMarker from './Map2DMarker.jsx';
import { useGameStore } from '../../../store/useGameStore.js';
import { BUILDING_TYPES } from '../constants.js';
import { selectBridgeSeasonalState } from '../../../store/selectors.js';
import { isLocalChampionEligible } from '../../../domains/village/localChampion.js';
import { getChampionProtectedFamilies } from '../../../domains/village/championProtection.js';
import { getSpatialContext } from '../../../domains/village/spatialContext.js';

const CELL_SIZE = 10; // pixels per grid cell
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.15;
const SERVICE_RING_RADIUS = 30 * CELL_SIZE;
const SERVICE_RING_INNER_RADIUS = 20 * CELL_SIZE;

function getServiceAnchorLabel(anchor) {
    if (!anchor) return '';
    if (anchor.id === 'puskesmas') return 'PUSKESMAS';
    if (anchor.id === 'pustu') return 'PUSTU';
    if (anchor.id === 'polindes') return 'POLINDES';
    return String(anchor.id || '').toUpperCase();
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

function Map2DBlueprintInner({ mapData, selectedBuildingId, onBuildingSelect, activeLayer, gameTime = 480, bridgeStatus }, ref) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1.0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [bridgeRepairFeedback, setBridgeRepairFeedback] = useState(null);
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const bridgeRepairTimerRef = useRef(null);
    const derivedBridgeStatus = useGameStore((state) => selectBridgeSeasonalState(state).status);
    const buildingProgress = useGameStore((state) => state.publicHealth.buildingProgress);
    const activeOutbreaks = useGameStore((state) => state.publicHealth.activeOutbreaks);
    const lastIntelTargets = useGameStore((state) => state.publicHealth.lastIntelTargets);
    const villageData = useGameStore((state) => state.publicHealth.villageData);
    const repairBridge = useGameStore((state) => state.publicHealthActions.repairBridge);
    const effectiveBridgeStatus = bridgeStatus ?? derivedBridgeStatus ?? 'normal';

    const mapW = mapData.width * CELL_SIZE;
    const mapH = mapData.height * CELL_SIZE;
    const showBridgeStatusDetails = zoom >= 0.6;
    const shouldShowEastOverlay = showBridgeStatusDetails && effectiveBridgeStatus !== 'normal';
    const showServiceCoverage = activeLayer !== 'general';
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
            if (!zones[rw]) zones[rw] = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
            zones[rw].minX = Math.min(zones[rw].minX, b.x);
            zones[rw].minY = Math.min(zones[rw].minY, b.y);
            zones[rw].maxX = Math.max(zones[rw].maxX, b.x);
            zones[rw].maxY = Math.max(zones[rw].maxY, b.y);
        });
        return zones;
    }, [mapData.buildings]);

    // ═══ SEMANTIC ZOOM: filter markers by zoom level ═══
    // zoom < 0.6 → facilities + critical houses only (overview)
    // zoom >= 0.6 → all buildings visible (detail)
    const visibleBuildings = useMemo(() => {
        if (!mapData.buildings) return [];
        if (zoom >= 0.6) return mapData.buildings;

        return mapData.buildings.filter(b => {
            // Always show selected building
            if (selectedBuildingId === b.id) return true;
            // Always show facilities (non-house buildings)
            if (!b.familyId) return true;
            // Show at-risk houses (low IKS, has outbreak, has jentik)
            if (b.familyData?.iksScore != null && b.familyData.iksScore < 0.4) return true;
            if (b.hasCase || b.familyData?.hasCase) return true;
            if (b.hasJentik) return true;
            // Show Very Low / Low economy houses (vulnerable)
            if (b.economyTier === 'Very Low' || b.economyTier === 'Low') return true;
            // Always surface active local intel targets, even at overview zoom.
            if (b.familyId && intelTargetMap.has(b.familyId)) return true;
            // Hide regular houses at overview zoom
            return false;
        });
    }, [mapData.buildings, zoom, selectedBuildingId, intelTargetMap]);

    const championFamilyIds = useMemo(() => {
        const families = villageData?.families;
        if (!Array.isArray(families) || families.length === 0) return [];
        return families
            .filter((family) => isLocalChampionEligible(family.iksScore))
            .map((family) => family.id);
    }, [villageData]);

    const protectedFamilyIds = useMemo(() => {
        if (!Array.isArray(championFamilyIds) || championFamilyIds.length === 0 || !villageData) return [];
        const familyCoords = getSpatialContext(villageData)?.familyCoords;
        if (!familyCoords) return [];
        return getChampionProtectedFamilies(championFamilyIds, familyCoords, 3);
    }, [championFamilyIds, villageData]);

    const championFamilyIdSet = useMemo(() => new Set(championFamilyIds || []), [championFamilyIds]);
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
        '01': 'rgba(120,160,180,0.08)', // steel blue
        '02': 'rgba(140,130,160,0.08)', // muted lavender
        '03': 'rgba(110,150,120,0.08)', // sage
        '04': 'rgba(170,150,100,0.08)', // warm sand
        '05': 'rgba(160,120,130,0.08)', // dusty rose
        '06': 'rgba(150,110,100,0.08)', // terracotta
        '07': 'rgba(130,150,90,0.08)',  // olive
        '08': 'rgba(100,140,160,0.08)', // dusty teal
    };
    const rwBorderColors = {
        '01': 'rgba(120,160,180,0.30)',
        '02': 'rgba(140,130,160,0.30)',
        '03': 'rgba(110,150,120,0.30)',
        '04': 'rgba(170,150,100,0.30)',
        '05': 'rgba(160,120,130,0.30)',
        '06': 'rgba(150,110,100,0.30)',
        '07': 'rgba(130,150,90,0.30)',
        '08': 'rgba(100,140,160,0.30)',
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden select-none"
            style={{
                backgroundColor: '#f5f0e6',
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
                    background: 'radial-gradient(ellipse at center, transparent 55%, rgba(60,40,20,0.3) 100%)',
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
                    backgroundColor: '#8fbc6b', // Blueprint XII.B: warm grass base
                }}
            >
                {/* Terrain backdrop */}
                    <Map2DTerrain
                        mapData={mapData}
                        cellSize={CELL_SIZE}
                        bridgeStatus={effectiveBridgeStatus}
                        showBridgeStatusDetails={showBridgeStatusDetails}
                    />

                {/* RW Zone boundaries */}
                {Object.entries(rwZones).map(([rw, zone]) => {
                    const pad = 3; // grid cells padding
                    return (
                        <div
                            key={`rw-${rw}`}
                            className="absolute pointer-events-none"
                            style={{
                                left: (zone.minX - pad) * CELL_SIZE,
                                top: (zone.minY - pad) * CELL_SIZE,
                                width: (zone.maxX - zone.minX + pad * 2) * CELL_SIZE,
                                height: (zone.maxY - zone.minY + pad * 2) * CELL_SIZE,
                                background: rwColors[rw] || 'rgba(100,116,139,0.08)',
                                border: `1px dashed ${rwBorderColors[rw] || 'rgba(100,116,139,0.3)'}`,
                                borderRadius: 8,
                            }}
                        >
                            <span
                                className="absolute font-black uppercase tracking-[0.2em]"
                                style={{
                                    top: 4,
                                    left: 6,
                                    fontSize: 7,
                                    color: rwBorderColors[rw] || 'rgba(100,116,139,0.5)',
                                    opacity: 0.7,
                                }}
                            >
                                RW {rw}
                            </span>
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
                                        border: '1px solid rgba(16,185,129,0.15)'
                                    }}
                                />
                            )}
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
                                    backdropFilter: 'blur(6px)',
                                    boxShadow: '0 6px 18px rgba(15,23,42,0.16)',
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
                            backdropFilter: 'blur(6px)',
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

            {/* ═══ ZOOM INDICATOR ═══ */}
            <div className="absolute bottom-16 left-4 z-40 pointer-events-none">
                <div className="px-2 py-1 rounded-md text-[9px] font-black text-white/30 uppercase tracking-widest"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}>
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
