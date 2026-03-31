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

const CELL_SIZE = 10; // pixels per grid cell
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.15;

function Map2DBlueprintInner({ mapData, selectedBuildingId, onBuildingSelect, activeLayer }, ref) {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1.0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

    const mapW = mapData.width * CELL_SIZE;
    const mapH = mapData.height * CELL_SIZE;

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

    const rwColors = {
        '01': 'rgba(56,189,248,0.12)',  // sky
        '02': 'rgba(167,139,250,0.12)', // violet
        '03': 'rgba(52,211,153,0.12)',  // emerald
        '04': 'rgba(251,191,36,0.12)',  // amber
        '05': 'rgba(244,114,182,0.12)', // pink
        '06': 'rgba(248,113,113,0.12)', // red
        '07': 'rgba(132,204,22,0.12)',  // lime
        '08': 'rgba(14,165,233,0.12)',  // blue
    };
    const rwBorderColors = {
        '01': 'rgba(56,189,248,0.4)',
        '02': 'rgba(167,139,250,0.4)',
        '03': 'rgba(52,211,153,0.4)',
        '04': 'rgba(251,191,36,0.4)',
        '05': 'rgba(244,114,182,0.4)',
        '06': 'rgba(248,113,113,0.4)',
        '07': 'rgba(132,204,22,0.4)',
        '08': 'rgba(14,165,233,0.4)',
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden select-none"
            style={{
                background: '#0a0f14',
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
            {/* ═══ SCANLINE + VIGNETTE (subtle sci-fi feel) ═══ */}
            <div
                className="absolute inset-0 pointer-events-none z-50"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
                }}
            />

            {/* ═══ TRANSFORM CONTAINER (pan + zoom) ═══ */}
            <div
                className="absolute origin-top-left will-change-transform"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    width: mapW,
                    height: mapH,
                }}
            >
                {/* Terrain backdrop */}
                <Map2DTerrain mapData={mapData} cellSize={CELL_SIZE} />

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

                {/* Building markers */}
                {mapData.buildings.map((building) => (
                    <Map2DMarker
                        key={building.id}
                        building={building}
                        cellSize={CELL_SIZE}
                        activeLayer={activeLayer}
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
        </div>
    );
}

const Map2DBlueprint = forwardRef(Map2DBlueprintInner);
export default Map2DBlueprint;
