import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Html, Bvh } from '@react-three/drei';
import * as THREE from 'three';

import { InstancedTerrain, TILE_SIZE } from './InstancedTerrain.jsx';
import { BuildingRenderer } from './BuildingRenderer.jsx';
import { useGameStore } from '../../../store/useGameStore.js';
import ErrorBoundary from '../../ErrorBoundary.jsx';

const SKY_COLOR = '#dbeafe';
const FOG_NEAR = 40;
const FOG_FAR = 150;

function ChronosSun() {
    const lightRef = React.useRef();
    const energy = useGameStore(s => s.player?.profile?.energy ?? 100);

    useFrame(() => {
        if (!lightRef.current) return;

        const t = Math.max(0, Math.min(1, energy / 100));
        const sunY = 5 + t * 20;
        const sunX = 30 - (1 - t) * 15;
        lightRef.current.position.set(sunX, sunY, 20);

        lightRef.current.color.setRGB(
            1,
            0.85 + t * 0.11,
            0.28 + t * 0.62
        );
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

function CameraBridge({ controlsRef, zoomRef, selectedBuilding, mapData }) {
    const { camera } = useThree();
    const swoopState = useRef(null);
    const keysRef = useRef(new Set());
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, onCanvas: true });

    const startSwoop = useCallback((endCam, endLook, speed = 1.5, onComplete = null) => {
        if (!controlsRef.current) return;

        swoopState.current = {
            startCam: camera.position.clone(),
            startLook: controlsRef.current.target.clone(),
            endCam,
            endLook,
            progress: 0,
            speed,
            onComplete,
        };
        controlsRef.current.enabled = false;
    }, [camera, controlsRef]);

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
                    2.5,
                    onComplete
                );
            },
        };
    }, [camera, zoomRef, controlsRef, mapData, startSwoop]);

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

    useEffect(() => {
        const onDown = (event) => {
            keysRef.current.add(event.key.toLowerCase());
            if (event.key === ' ') {
                startSwoop(new THREE.Vector3(15, 12, 15), new THREE.Vector3(0, 0, 0), 2.0);
                event.preventDefault();
            }
        };
        const onUp = (event) => keysRef.current.delete(event.key.toLowerCase());
        const onMove = (event) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
            mouseRef.current.onCanvas = event.target.tagName === 'CANVAS';
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

    useFrame((_, delta) => {
        const controls = controlsRef.current;
        if (!controls) return;

        if (swoopState.current) {
            const swoop = swoopState.current;
            swoop.progress += delta * swoop.speed;
            const t = Math.min(swoop.progress, 1);
            const ease = 1 - Math.pow(1 - t, 4);

            camera.position.lerpVectors(swoop.startCam, swoop.endCam, ease);
            controls.target.lerpVectors(swoop.startLook, swoop.endLook, ease);
            controls.update();

            if (t >= 1) {
                if (swoop.onComplete) swoop.onComplete();
                swoopState.current = null;
                controls.enabled = true;
            }
            return;
        }

        const keys = keysRef.current;
        const panSpeed = 18 * delta;
        let truckX = 0;
        let truckZ = 0;

        if (keys.has('w') || keys.has('arrowup')) truckZ -= panSpeed;
        if (keys.has('s') || keys.has('arrowdown')) truckZ += panSpeed;
        if (keys.has('a') || keys.has('arrowleft')) truckX -= panSpeed;
        if (keys.has('d') || keys.has('arrowright')) truckX += panSpeed;

        if (truckX === 0 && truckZ === 0 && mouseRef.current.onCanvas && document.hasFocus()) {
            const { x, y } = mouseRef.current;
            const edgeMargin = 30;
            const edgeSpeed = 12 * delta;

            if (x < edgeMargin) truckX -= edgeSpeed;
            else if (x > window.innerWidth - edgeMargin) truckX += edgeSpeed;

            if (y < edgeMargin) truckZ -= edgeSpeed;
            else if (y > window.innerHeight - edgeMargin) truckZ += edgeSpeed;
        }

        if (truckX !== 0 || truckZ !== 0) {
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
            const move = new THREE.Vector3()
                .addScaledVector(right, truckX)
                .addScaledVector(forward, truckZ);

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

function WebGLRecoveryBridge({ onContextLost, onContextRestored }) {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl?.domElement;
        if (!canvas) return undefined;

        const handleContextLost = (event) => {
            event.preventDefault();
            onContextLost();
        };
        const handleContextRestored = () => {
            onContextRestored();
        };

        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost, false);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
        };
    }, [gl, onContextLost, onContextRestored]);

    return null;
}

export default function WilayahDiorama({ mapData, onBuildingSelect, selectedBuildingId, zoomRef, activeLayer }) {
    const controlsRef = useRef(null);
    const tooltipGroupRef = useRef(null);
    const [canvasKey, setCanvasKey] = useState(0);
    const [isContextLost, setIsContextLost] = useState(false);

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

    const handleContextLost = useCallback(() => {
        setIsContextLost(true);
        console.warn('[WilayahDiorama] WebGL context lost. Diorama interactions are paused until recovery.');
    }, []);

    const handleContextRestored = useCallback(() => {
        setIsContextLost(false);
        setCanvasKey(prev => prev + 1);
        console.info('[WilayahDiorama] WebGL context restored. Rebuilding diorama canvas.');
    }, []);

    const handleCanvasRebuild = useCallback(() => {
        setIsContextLost(false);
        setCanvasKey(prev => prev + 1);
    }, []);

    if (!mapData || !mapData.tiles) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing" style={{ background: `linear-gradient(180deg, ${SKY_COLOR} 0%, #f0f4f8 100%)` }}>
            <ErrorBoundary name="WilayahDiorama">
                <Canvas
                    key={canvasKey}
                    shadows="percentage"
                    dpr={[1, 1.5]}
                    camera={{ position: [15, 12, 15], fov: 30, far: 150 }}
                    gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: 3 }}
                >
                    <WebGLRecoveryBridge
                        onContextLost={handleContextLost}
                        onContextRestored={handleContextRestored}
                    />
                    <color attach="background" args={[SKY_COLOR]} />
                    <fog attach="fog" args={[SKY_COLOR, FOG_NEAR, FOG_FAR]} />

                    <CameraBridge
                        controlsRef={controlsRef}
                        zoomRef={zoomRef}
                        selectedBuilding={selectedBuildingObj}
                        mapData={mapData}
                    />

                    <hemisphereLight
                        skyColor="#f0f4ff"
                        groundColor="#3a5a28"
                        intensity={0.75}
                    />
                    <ChronosSun />

                    <directionalLight
                        position={[-20, 10, -25]}
                        intensity={0.4}
                        color="#93c5fd"
                    />

                    <Bvh firstHitOnly>
                        <group position={[0, -1, 0]}>
                            <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                <planeGeometry args={[500, 500]} />
                                <meshBasicMaterial color={SKY_COLOR} />
                            </mesh>

                            <InstancedTerrain mapData={mapData} />

                            {mapData.buildings.map((building, idx) => (
                                <BuildingRenderer
                                    key={building.id || idx}
                                    building={building}
                                    centerX={mapData.centerX}
                                    centerY={mapData.centerY}
                                    selected={selectedBuildingId === building.id}
                                    activeLayer={activeLayer}
                                    onHover={handleHover}
                                    onSelect={(selectedBuildingData) => {
                                        selectedBuildingData.type = selectedBuildingData.type || building.type;
                                        onBuildingSelect(selectedBuildingData);
                                    }}
                                />
                            ))}

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
                                            width: 0,
                                            height: 0,
                                            borderLeft: '6px solid transparent',
                                            borderRight: '6px solid transparent',
                                            borderTop: '7px solid rgba(15,23,42,0.9)',
                                        }} />
                                    </div>
                                </Html>
                            </group>
                        </group>
                    </Bvh>

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
            </ErrorBoundary>

            {isContextLost && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6">
                    <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/90 px-6 py-5 text-center shadow-2xl">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">GPU Recovery Mode</p>
                        <h3 className="mt-3 text-lg font-black text-white">Koneksi WebGL terputus</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Diorama 3D dijeda sementara. Biasanya ini terjadi saat tab lama di-background atau driver GPU me-reset context.
                        </p>
                        <button
                            onClick={handleCanvasRebuild}
                            className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300 transition-colors hover:bg-emerald-500/25"
                        >
                            Bangun Ulang Diorama
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
