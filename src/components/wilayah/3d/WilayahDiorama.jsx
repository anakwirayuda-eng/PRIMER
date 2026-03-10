import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Html, Bvh } from '@react-three/drei';
import * as THREE from 'three';

import { InstancedTerrain, TILE_SIZE } from './InstancedTerrain.jsx';
import { BuildingRenderer } from './BuildingRenderer.jsx';
import { useGameStore } from '../../../store/useGameStore.js';

// ─── Premium Atmosphere Constants ─────────────────────────────────
const SKY_COLOR = '#dbeafe';
const FOG_NEAR = 40;
const FOG_FAR = 150;

// 🌟 CHRONOS SUN — directional light tied to player energy (diegetic anxiety)
function ChronosSun() {
    const lightRef = React.useRef();
    const energy = useGameStore(s => s.player?.profile?.energy ?? 100);

    useFrame(() => {
        if (!lightRef.current) return;
        // Energy 100 = overhead white, Energy 0 = low amber sunset
        const t = Math.max(0, Math.min(1, energy / 100)); // 0..1
        // Sun elevation: high (25) at full energy, low (5) as energy drains
        const sunY = 5 + t * 20;
        const sunX = 30 - (1 - t) * 15;
        lightRef.current.position.set(sunX, sunY, 20);
        // Color: warm amber (#FFB347) at low energy, white-warm (#fff5e6) at full
        const r = 1;
        const g = 0.85 + t * 0.11; // 0.85 -> 0.96
        const b = 0.28 + t * 0.62;  // 0.28 -> 0.90
        lightRef.current.color.setRGB(r, g, b);
        // Intensity slightly drops at low energy for dramatic effect
        lightRef.current.intensity = 1.2 + t * 0.6;
    });

    return (
        <directionalLight
            ref={lightRef}
            castShadow
            position={[30, 25, 20]}
            intensity={1.5}
            color="#fff5e6"
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0002}
        >
            <orthographicCamera attach="shadow-camera" args={[-40, 40, 40, -40, 0.1, 80]} />
        </directionalLight>
    );
}

// ─── THE AAA CAMERA ENGINE ────────────────────────────────────────
// Handles: zoom ref, WASD, Cinematic Swoop (Clutch Pedal pattern),
// Edge Panning (canvas-only), Home, Dive — all GPU-synced
function CameraBridge({ controlsRef, zoomRef, selectedBuilding, mapData }) {
    const { camera } = useThree();
    const swoopState = useRef(null);
    const keysRef = useRef(new Set());
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, onCanvas: true });

    // Internal: trigger a cinematic swoop (disables OrbitControls during flight)
    const startSwoop = useCallback((endCam, endLook, speed = 1.5, onComplete = null) => {
        if (!controlsRef.current) return;
        swoopState.current = {
            startCam: camera.position.clone(),
            startLook: controlsRef.current.target.clone(),
            endCam, endLook,
            progress: 0, speed, onComplete,
        };
        // CLUTCH PEDAL: disable OrbitControls during autopilot
        controlsRef.current.enabled = false;
    }, [camera, controlsRef]);

    // Expose zoom/home/dive methods to parent
    useEffect(() => {
        if (!zoomRef) return;
        zoomRef.current = {
            zoomIn: () => {
                if (!controlsRef.current) return;
                const dir = new THREE.Vector3().subVectors(controlsRef.current.target, camera.position).normalize();
                const dist = camera.position.distanceTo(controlsRef.current.target);
                camera.position.addScaledVector(dir, dist * 0.2);
                controlsRef.current.update();
            },
            zoomOut: () => {
                if (!controlsRef.current) return;
                const dir = new THREE.Vector3().subVectors(camera.position, controlsRef.current.target).normalize();
                const dist = camera.position.distanceTo(controlsRef.current.target);
                camera.position.addScaledVector(dir, dist * 0.2);
                controlsRef.current.update();
            },
            reset: () => startSwoop(new THREE.Vector3(15, 12, 15), new THREE.Vector3(0, 0, 0)),
            home: () => startSwoop(new THREE.Vector3(15, 12, 15), new THREE.Vector3(0, 0, 0)),
            dive: (building, centerX, centerY, onComplete) => {
                if (!building || !mapData) return;
                const px = (building.x - centerX) * TILE_SIZE;
                const pz = (building.y - centerY) * TILE_SIZE;
                startSwoop(
                    new THREE.Vector3(px + 0.1, 2.5, pz + 0.1),
                    new THREE.Vector3(px, 1.0, pz),
                    2.5, onComplete
                );
            },
        };
    }, [camera, zoomRef, controlsRef, mapData, startSwoop]);

    // Cinematic Swoop on building select (Rule of Thirds offset)
    useEffect(() => {
        if (!selectedBuilding || !mapData) return;
        const px = (selectedBuilding.x - mapData.centerX) * TILE_SIZE;
        const pz = (selectedBuilding.y - mapData.centerY) * TILE_SIZE;
        startSwoop(
            new THREE.Vector3(px + 8, 8, pz + 6),
            new THREE.Vector3(px + 3, 0.5, pz),
            1.8
        );
    }, [selectedBuilding, mapData, startSwoop]);

    // Keyboard + mouse listeners (capture only, processing in useFrame)
    useEffect(() => {
        const onDown = (e) => {
            keysRef.current.add(e.key.toLowerCase());
            if (e.key === ' ') {
                startSwoop(new THREE.Vector3(15, 12, 15), new THREE.Vector3(0, 0, 0), 2.0);
                e.preventDefault();
            }
        };
        const onUp = (e) => keysRef.current.delete(e.key.toLowerCase());
        const onMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
            // ZERO-COST CANVAS CHECK: edge pan disabled when mouse over HUD
            mouseRef.current.onCanvas = e.target.tagName === 'CANVAS';
        };

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);
        window.addEventListener('mousemove', onMove);
        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
            window.removeEventListener('mousemove', onMove);
        };
    }, [startSwoop]);

    // THE UNIFIED RENDER LOOP
    useFrame((_, delta) => {
        const controls = controlsRef.current;
        if (!controls) return;

        // --- MODE A: AUTOPILOT (Cinematic Swoop) ---
        if (swoopState.current) {
            const s = swoopState.current;
            s.progress += delta * s.speed;
            const t = Math.min(s.progress, 1);

            // QUARTIC EASE-OUT: blazing fast start, silky smooth brake
            const ease = 1 - Math.pow(1 - t, 4);

            camera.position.lerpVectors(s.startCam, s.endCam, ease);
            controls.target.lerpVectors(s.startLook, s.endLook, ease);
            controls.update();

            if (t >= 1) {
                if (s.onComplete) s.onComplete();
                swoopState.current = null;
                controls.enabled = true; // RELEASE CLUTCH: player regains control
            }
            return; // Don't mix with WASD during autopilot
        }

        // --- MODE B: MANUAL (WASD + Edge Pan) ---
        const keys = keysRef.current;
        const PAN_SPEED = 18 * delta;
        let truckX = 0, truckZ = 0;

        if (keys.has('w') || keys.has('arrowup')) truckZ -= PAN_SPEED;
        if (keys.has('s') || keys.has('arrowdown')) truckZ += PAN_SPEED;
        if (keys.has('a') || keys.has('arrowleft')) truckX -= PAN_SPEED;
        if (keys.has('d') || keys.has('arrowright')) truckX += PAN_SPEED;

        // Edge panning (only when no WASD, cursor on canvas, window focused)
        if (truckX === 0 && truckZ === 0 && mouseRef.current.onCanvas && document.hasFocus()) {
            const m = mouseRef.current;
            const EDGE_MARGIN = 30;
            const EDGE_SPEED = 12 * delta;
            if (m.x < EDGE_MARGIN) truckX -= EDGE_SPEED;
            else if (m.x > window.innerWidth - EDGE_MARGIN) truckX += EDGE_SPEED;
            if (m.y < EDGE_MARGIN) truckZ -= EDGE_SPEED;
            else if (m.y > window.innerHeight - EDGE_MARGIN) truckZ += EDGE_SPEED;
        }

        // Apply movement along camera's ground-plane directions
        if (truckX !== 0 || truckZ !== 0) {
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();
            const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

            const move = new THREE.Vector3()
                .addScaledVector(right, truckX)
                .addScaledVector(forward, truckZ);

            // ANTI-STUTTER: temporarily disable damping during manual pan
            const wasDamping = controls.enableDamping;
            controls.enableDamping = false;
            camera.position.add(move);
            controls.target.add(move);
            controls.update();
            controls.enableDamping = wasDamping;
        }
    });

    return null;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function WilayahDiorama({ mapData, onBuildingSelect, selectedBuildingId, zoomRef, activeLayer }) {
    const controlsRef = useRef(null);
    const tooltipGroupRef = useRef(null);

    // ZERO-COST HOVER — useRef + vanilla DOM, no React re-render
    const handleHover = useCallback((building, position) => {
        if (!tooltipGroupRef.current) return;
        if (building && position) {
            tooltipGroupRef.current.position.set(position.x, position.y + 2.5, position.z);
            tooltipGroupRef.current.visible = true;
            const nameEl = document.getElementById('tt-3d-name');
            const typeEl = document.getElementById('tt-3d-type');
            if (nameEl) nameEl.innerText = building.name || '';
            if (typeEl) typeEl.innerText = (building.type || '').replace(/_/g, ' ').toUpperCase();
        } else {
            tooltipGroupRef.current.visible = false;
        }
    }, []);

    const selectedBuildingObj = selectedBuildingId
        ? mapData?.buildings?.find(b => b.id === selectedBuildingId) || null
        : null;

    if (!mapData || !mapData.tiles) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing" style={{ background: `linear-gradient(180deg, ${SKY_COLOR} 0%, #f0f4f8 100%)` }}>
            <Canvas
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [15, 12, 15], fov: 30, far: 150 }}
                gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: 3 }}
            >
                <color attach="background" args={[SKY_COLOR]} />
                <fog attach="fog" args={[SKY_COLOR, FOG_NEAR, FOG_FAR]} />

                <CameraBridge
                    controlsRef={controlsRef}
                    zoomRef={zoomRef}
                    selectedBuilding={selectedBuildingObj}
                    mapData={mapData}
                />

                {/* GHIBLI LIGHTING — hemisphereLight for grass reflection */}
                <hemisphereLight
                    skyColor="#f0f4ff"
                    groundColor="#3a5a28"
                    intensity={0.75}
                />
                {/* 🌟 CHRONOS SUN — energy-driven lighting (diegetic anxiety) */}
                <ChronosSun />

                {/* Subtle rim light for silhouette depth */}
                <directionalLight
                    position={[-20, 10, -25]}
                    intensity={0.4}
                    color="#93c5fd"
                />

                {/* 🌟 BVH SHIELD — 100x faster raycasting on mouse clicks */}
                <Bvh firstHitOnly>
                    <group position={[0, -1, 0]}>
                        {/* INFINITE HORIZON: ground plane matching sky color */}
                        <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                            <planeGeometry args={[500, 500]} />
                            <meshBasicMaterial color={SKY_COLOR} />
                        </mesh>

                        <InstancedTerrain mapData={mapData} />

                        {mapData.buildings.map((b, idx) => (
                            <BuildingRenderer
                                key={b.id || idx}
                                building={b}
                                centerX={mapData.centerX}
                                centerY={mapData.centerY}
                                selected={selectedBuildingId === b.id}
                                activeLayer={activeLayer}
                                onHover={handleHover}
                                onSelect={(selectedBuildingData) => {
                                    selectedBuildingData.type = selectedBuildingData.type || b.type;
                                    onBuildingSelect(selectedBuildingData);
                                }}
                            />
                        ))}

                        {/* ZERO-COST SINGLETON TOOLTIP — rendered once, moved via ref */}
                        <group ref={tooltipGroupRef} visible={false}>
                            <Html center distanceFactor={15} style={{ pointerEvents: 'none', transition: 'opacity 0.1s' }}>
                                <div className="relative transform -translate-y-3">
                                    <div style={{
                                        background: 'rgba(15,23,42,0.9)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        <span id="tt-3d-type" style={{
                                            display: 'block',
                                            fontSize: '8px',
                                            fontWeight: 900,
                                            color: '#34d399',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                        }}></span>
                                        <span id="tt-3d-name" style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            fontWeight: 800,
                                        }}></span>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        left: '50%',
                                        bottom: '-6px',
                                        transform: 'translateX(-50%)',
                                        width: 0, height: 0,
                                        borderLeft: '6px solid transparent',
                                        borderRight: '6px solid transparent',
                                        borderTop: '7px solid rgba(15,23,42,0.9)',
                                    }} />
                                </div>
                            </Html>
                        </group>
                    </group>
                </Bvh>

                {/* THE TAMED BEAST: OrbitControls with Clutch pattern */}
                <OrbitControls
                    ref={controlsRef}
                    makeDefault
                    enableDamping
                    dampingFactor={0.06}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.25}
                    minDistance={5}
                    maxDistance={100}
                    enablePan
                    panSpeed={0.8}
                    rotateSpeed={0.5}
                    zoomSpeed={0.8}
                />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
