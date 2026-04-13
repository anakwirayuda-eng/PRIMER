import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '../../ErrorBoundary.jsx';
import DioramaSceneCore from './DioramaSceneCore.jsx';
import { translateWilayahString } from '../contentI18n.js';

const SKY_COLOR = '#dbeafe';
const FOG_NEAR = 12;
const FOG_FAR = 70;

function PocketFallback({ title, body }) {
    return (
        <div
            data-testid="pocket-diorama-fallback"
            className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-center shadow-inner shadow-black/20"
        >
            <div className="max-w-xs space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">{title}</p>
                <p className="text-xs font-medium leading-relaxed text-white/60">{body}</p>
            </div>
        </div>
    );
}

function PocketCameraRig({ cameraPreset }) {
    const cameraRef = useRef(null);

    useEffect(() => {
        cameraRef.current?.lookAt(0, 0, 0);
    }, [cameraPreset]);

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[cameraPreset.distance, cameraPreset.height, cameraPreset.distance]}
            fov={32}
            near={0.1}
            far={cameraPreset.far}
            onUpdate={(camera) => camera.lookAt(0, 0, 0)}
        />
    );
}

function PocketTurntable({ children }) {
    const groupRef = useRef(null);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += delta * 0.16;
    });

    return <group ref={groupRef}>{children}</group>;
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

        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', onContextRestored, false);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost, false);
            canvas.removeEventListener('webglcontextrestored', onContextRestored, false);
        };
    }, [gl, onContextLost, onContextRestored]);

    return null;
}

export default function PocketDioramaCanvas({
    mapData,
    selectedBuildingId = null,
    onBuildingSelect = null,
    renderTier = 'low',
}) {
    const { t } = useTranslation();
    const tr = useCallback((key, fallback, options = {}) => translateWilayahString(t, key, fallback, options), [t]);
    const [canvasKey, setCanvasKey] = useState(0);
    const [isContextLost, setIsContextLost] = useState(false);
    const isLowDetail = renderTier === 'low';

    const scopeLabel = mapData?.scopeMeta?.label || tr('wilayahContent.ui.dioramaInspector.fallbackTitle', 'Pocket Diorama');
    const cameraPreset = useMemo(() => {
        const span = Math.max(mapData?.width || 1, mapData?.height || 1);
        return {
            distance: Math.max(6, span * 0.78),
            height: Math.max(5, span * 0.62),
            far: Math.max(100, span * 12),
        };
    }, [mapData?.width, mapData?.height]);

    const handleCanvasRebuild = useCallback(() => {
        setIsContextLost(false);
        setCanvasKey(prev => prev + 1);
    }, []);

    const handleContextLost = useCallback(() => {
        setIsContextLost(true);
    }, []);

    const handleContextRestored = useCallback(() => {
        handleCanvasRebuild();
    }, [handleCanvasRebuild]);

    const handlePocketSelect = useCallback((building) => {
        if (!onBuildingSelect) return;
        onBuildingSelect({
            ...building,
            x: building.worldX ?? building.x,
            y: building.worldY ?? building.y,
        });
    }, [onBuildingSelect]);

    useEffect(() => {
        if (!isContextLost) return undefined;

        const timer = setTimeout(() => {
            handleCanvasRebuild();
        }, 1500);

        return () => clearTimeout(timer);
    }, [isContextLost, handleCanvasRebuild]);

    if (!mapData?.tiles) {
        return (
            <PocketFallback
                title={tr('wilayahContent.ui.dioramaInspector.fallbackTitle', 'Pocket Diorama')}
                body={tr(
                    'wilayahContent.ui.dioramaInspector.fallbackBody',
                    'Inspector 3D belum siap karena data scope belum lengkap.'
                )}
            />
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                        {tr('wilayahContent.ui.dioramaInspector.liveTitle', '3D Inspector')}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/60">{scopeLabel}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                    {tr('wilayahContent.ui.dioramaInspector.liveChip', 'Turntable')}
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/30">
                <ErrorBoundary name="PocketDioramaCanvas">
                    <Canvas
                        key={canvasKey}
                        dpr={1}
                        shadows={false}
                        gl={{
                            antialias: false,
                            powerPreference: isLowDetail ? 'low-power' : 'high-performance',
                            failIfMajorPerformanceCaveat: false,
                            toneMapping: 3,
                        }}
                        style={{ height: 220 }}
                    >
                        <WebGLRecoveryBridge
                            onContextLost={handleContextLost}
                            onContextRestored={handleContextRestored}
                        />
                        <color attach="background" args={[SKY_COLOR]} />
                        <fog attach="fog" args={[SKY_COLOR, FOG_NEAR, FOG_FAR]} />
                        <PocketCameraRig cameraPreset={cameraPreset} />

                        <hemisphereLight skyColor="#f0f4ff" groundColor="#365314" intensity={0.7} />
                        <directionalLight position={[14, 16, 12]} intensity={1.05} color="#fff5e6" />
                        <directionalLight position={[-10, 8, -12]} intensity={0.28} color="#93c5fd" />

                        <PocketTurntable>
                            <DioramaSceneCore
                                mapData={mapData}
                                selectedBuildingId={selectedBuildingId}
                                activeLayer="general"
                                onBuildingSelect={handlePocketSelect}
                                enableTooltip={false}
                                backgroundColor={SKY_COLOR}
                                renderTier={renderTier}
                            />
                        </PocketTurntable>
                    </Canvas>
                </ErrorBoundary>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-4 pb-3 pt-10">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                        <span>{tr('wilayahContent.ui.dioramaInspector.liveFooterMode', 'Inspector only')}</span>
                        <span>{tr('wilayahContent.ui.dioramaInspector.liveFooterHint', 'Klik bangunan untuk pindah fokus')}</span>
                    </div>
                </div>

                {isContextLost && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                        <div className="max-w-xs rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 text-center shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-400">
                                {tr('wilayahContent.ui.dioramaInspector.recoveryTitle', 'GPU Recovery')}
                            </p>
                            <p className="mt-2 text-xs font-medium leading-relaxed text-white/65">
                                {tr(
                                    'wilayahContent.ui.dioramaInspector.recoveryBody',
                                    'Inspector 3D dijeda sebentar. Canvas akan dibangun ulang otomatis.'
                                )}
                            </p>
                            <button
                                type="button"
                                onClick={handleCanvasRebuild}
                                className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 transition-colors hover:bg-cyan-500/25"
                            >
                                {tr('wilayahContent.ui.dioramaInspector.recoveryAction', 'Bangun ulang')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
