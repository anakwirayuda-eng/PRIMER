import React, { useEffect, useRef, useCallback, useState } from 'react';
// NOTE: uses useEffect for auto-recovery below
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { TILE_SIZE } from './InstancedTerrain.jsx';
import DioramaSceneCore from './DioramaSceneCore.jsx';
import { useGameStore } from '../../../store/useGameStore.js';
import ErrorBoundary from '../../ErrorBoundary.jsx';

const SKY_COLOR = '#dbeafe';
const FOG_NEAR = 40;
const FOG_FAR = 150;

function ChronosSun({ enableShadow = true }) {
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
            castShadow={enableShadow}
            position={[30, 25, 20]}
            intensity={1.5}
            color="#fff5e6"
            shadow-mapSize={enableShadow ? [1024, 1024] : [1, 1]}
            shadow-bias={-0.0002}
        >
            {enableShadow && (
                <orthographicCamera attach="shadow-camera" args={[-40, 40, 40, -40, 0.1, 80]} />
            )}
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBuilding, startSwoop]); // Intentionally exclude mapData to prevent re-swoop on data changes

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

export default function ExhibitionVillageDiorama({
    mapData,
    onBuildingSelect,
    selectedBuildingId,
    zoomRef,
    activeLayer,
    renderTier = 'standard',
}) {
    const controlsRef = useRef(null);
    const [canvasKey, setCanvasKey] = useState(0);
    const [isContextLost, setIsContextLost] = useState(false);
    const isLowDetail = renderTier === 'low';

    const selectedBuildingObj = selectedBuildingId
        ? mapData?.buildings?.find(b => b.id === selectedBuildingId) || null
        : null;

    const handleContextLost = useCallback(() => {
        setIsContextLost(true);
        console.warn('[ExhibitionVillageDiorama] WebGL context lost. Diorama interactions are paused until recovery.');
    }, []);

    const handleContextRestored = useCallback(() => {
        setIsContextLost(false);
        setCanvasKey(prev => prev + 1);
        console.info('[ExhibitionVillageDiorama] WebGL context restored. Rebuilding diorama canvas.');
    }, []);

    const handleCanvasRebuild = useCallback(() => {
        setIsContextLost(false);
        setCanvasKey(prev => prev + 1);
    }, []);

    // ═══ AUTO-RECOVERY: rebuild canvas automatically after context lost ═══
    useEffect(() => {
        if (!isContextLost) return;
        const timer = setTimeout(() => {
            console.info('[ExhibitionVillageDiorama] Auto-recovering from WebGL context loss...');
            handleCanvasRebuild();
        }, 2000);
        return () => clearTimeout(timer);
    }, [isContextLost, handleCanvasRebuild]);

    if (!mapData || !mapData.tiles) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing" style={{ background: `linear-gradient(180deg, ${SKY_COLOR} 0%, #f0f4f8 100%)` }}>
            <ErrorBoundary name="ExhibitionVillageDiorama">
                <Canvas
                    key={canvasKey}
                    shadows={isLowDetail ? false : 'percentage'}
                    dpr={1}
                    camera={{ position: [15, 12, 15], fov: 30, far: isLowDetail ? 120 : 150 }}
                    gl={{
                        antialias: false,
                        powerPreference: isLowDetail ? 'low-power' : 'high-performance',
                        failIfMajorPerformanceCaveat: false,
                        toneMapping: 3,
                    }}
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
                    <ChronosSun enableShadow={!isLowDetail} />

                    <directionalLight
                        position={[-20, 10, -25]}
                        intensity={0.4}
                        color="#93c5fd"
                    />

                    <DioramaSceneCore
                        mapData={mapData}
                        selectedBuildingId={selectedBuildingId}
                        activeLayer={activeLayer}
                        onBuildingSelect={onBuildingSelect}
                        enableTooltip={!isLowDetail}
                        tooltipDistanceFactor={15}
                        backgroundColor={SKY_COLOR}
                        renderTier={renderTier}
                    />

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
