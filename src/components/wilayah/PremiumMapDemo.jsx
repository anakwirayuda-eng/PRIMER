import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment, Bounds, OrbitControls,
    ContactShadows, RoundedBox, Float
} from '@react-three/drei';
import { EffectComposer, Bloom, Outline, Selection, Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- Procedural Low-Poly Tree ---
function Tree({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.1, 0.15, 1, 5]} />
                <meshStandardMaterial color="#5D4037" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
                <icosahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial color="#2E7D32" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0.3, 1.0, 0.2]} castShadow receiveShadow>
                <icosahedronGeometry args={[0.4, 0]} />
                <meshStandardMaterial color="#388E3C" roughness={0.8} flatShading />
            </mesh>
        </group>
    );
}

// --- Stylized Low Poly Building ---
function StylizedBuilding({ position, scale = 1, color = '#ffffff', name, onSelect, selected }) {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current) return;
        const targetScale = hovered || selected ? scale * 1.05 : scale;
        const currentScale = groupRef.current.scale.x;
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(currentScale, targetScale, 0.15));

        const targetY = selected ? position[1] + 0.5 : position[1];
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.15);
    });

    return (
        <Select enabled={hovered || selected}>
            <group
                ref={groupRef}
                position={position}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={(e) => { e.stopPropagation(); onSelect(name); }}
            >
                {/* Main Body */}
                <RoundedBox args={[1.2, 1, 1.2]} position={[0, 0.5, 0]} radius={0.05} smoothness={4} castShadow receiveShadow>
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
                </RoundedBox>
                {/* Roof */}
                <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
                    <coneGeometry args={[1, 0.8, 4]} />
                    <meshStandardMaterial color="#D84315" roughness={0.7} flatShading />
                </mesh>
                {/* Chimney */}
                <mesh position={[0.3, 1.6, -0.2]} castShadow receiveShadow>
                    <boxGeometry args={[0.2, 0.6, 0.2]} />
                    <meshStandardMaterial color="#5D4037" />
                </mesh>
                {/* Window */}
                <mesh position={[0, 0.5, 0.61]}>
                    <boxGeometry args={[0.4, 0.4, 0.05]} />
                    <meshPhysicalMaterial color="#81D4FA" transmission={0.9} roughness={0.1} />
                </mesh>
            </group>
        </Select>
    );
}

// --- Luxury Diorama Base ---
function DioramaBase() {
    return (
        <group>
            {/* Main Earth Block */}
            <RoundedBox args={[16, 2, 16]} position={[0, -1, 0]} radius={0.2} smoothness={4} receiveShadow>
                <meshStandardMaterial color="#7CB342" roughness={1} />
            </RoundedBox>

            {/* Sub-layer Dirt */}
            <RoundedBox args={[15.5, 2.2, 15.5]} position={[0, -1.2, 0]} radius={0.1} smoothness={4} receiveShadow>
                <meshStandardMaterial color="#5D4037" roughness={1} />
            </RoundedBox>

            {/* River Trench */}
            <mesh position={[0, -0.4, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[16, 3]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>

            {/* Glassy River Water */}
            <mesh position={[0, -0.2, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[16, 3]} />
                <meshPhysicalMaterial
                    color="#4DD0E1"
                    transmission={0.9}
                    opacity={1}
                    transparent
                    roughness={0.1}
                    ior={1.5}
                    thickness={2}
                />
            </mesh>

            {/* Roads */}
            <mesh position={[0, 0.01, -2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[16, 1.5]} />
                <meshStandardMaterial color="#CFD8DC" roughness={0.9} />
            </mesh>
            <mesh position={[-2, 0.01, -4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
                <planeGeometry args={[5, 1.5]} />
                <meshStandardMaterial color="#CFD8DC" roughness={0.9} />
            </mesh>
        </group>
    );
}

export function PremiumMapDemo({ onClose }) {
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const buildings = useMemo(() => [
        { id: 'puskesmas', name: 'Puskesmas', position: [0, 0, -5], color: '#FAFAFA' },
        { id: 'posyandu', name: 'Posyandu Flamboyan', position: [-4, 0, -2], color: '#FCE4EC' },
        { id: 'sekolah', name: 'SD Negeri 1', position: [4, 0, -2], color: '#FFF3E0' },
        { id: 'rumah_kader', name: 'Rumah Kader', position: [-5, 0, 5], color: '#E8F5E9' },
        { id: 'rumah_warga1', name: 'Rumah Warga (RT 01)', position: [4, 0, 5], color: '#FFF9C4' },
    ], []);

    const trees = useMemo(() => [
        [-6, 0, -6], [-4, 0, -6], [6, 0, -6], [6, 0, -4],
        [-2, 0, 0], [2, 0, 0],
        [-7, 0, 3], [-6, 0, 7], [6, 0, 7], [7, 0, 3]
    ], []);

    return (
        <div className="fixed inset-0 z-50 bg-[#0f172a] overflow-hidden font-sans">
            {/* Global UI Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition border border-slate-600"
                >
                    &larr; Return to 2D Map
                </button>
            </div>

            <div className="absolute top-4 right-4 z-20 text-right pointer-events-none">
                <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-xl">Village Map 360&deg;</h1>
                <p className="text-amber-400 font-medium tracking-wide">Phase 5 Luxury Voxel Diorama</p>
                {selectedBuilding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        className="mt-6 p-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl text-left pointer-events-auto shadow-2xl"
                    >
                        <h2 className="text-amber-400 font-bold text-xl">{selectedBuilding}</h2>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-xs">
                            Bangunan berinteraksi dengan outline neon dan melayang.
                            Di fase produksi, ini akan mentransisikan Anda ke dalam ruangan.
                        </p>
                        <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg font-bold text-white shadow-lg transition-all scale-100 hover:scale-105">
                            Masuk Gedung
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Instruction Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="bg-slate-900/60 backdrop-blur-xl text-white/90 px-8 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
                    <span className="text-2xl animate-bounce">🖱️</span>
                    <span className="text-sm font-medium tracking-wide">Click & Drag to Rotate 360&deg; &bull; Right Click to Pan &bull; Click Buildings</span>
                </div>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [15, 15, 15], fov: 25 }}>
                <color attach="background" args={['#0f172a']} />

                {/* Lighting setup for that "Luxury" feel */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    castShadow
                    position={[10, 20, 15]}
                    intensity={2.5}
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                >
                    <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15, 0.1, 50]} />
                </directionalLight>

                {/* Post-Processing Effects */}
                <Selection>
                    <EffectComposer multisampling={8} autoClear={false}>
                        <Outline blur edgeStrength={100} width={2000} visibleEdgeColor="#fbbf24" hiddenEdgeColor="#fbbf24" />
                        <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} intensity={0.5} />
                    </EffectComposer>

                    <group position={[0, -1, 0]}>
                        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
                            <Bounds fit clip observe margin={1.5}>
                                <DioramaBase />

                                {buildings.map(b => (
                                    <StylizedBuilding
                                        key={b.id}
                                        name={b.name}
                                        position={b.position}
                                        color={b.color}
                                        selected={selectedBuilding === b.name}
                                        onSelect={setSelectedBuilding}
                                    />
                                ))}

                                {trees.map((pos, i) => (
                                    <Tree key={`tree-${i}`} position={pos} scale={0.8 + Math.random() * 0.4} />
                                ))}
                            </Bounds>
                        </Float>
                    </group>
                </Selection>

                {/* Orbit Controls for 360 Globe View */}
                <OrbitControls
                    makeDefault
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.2}
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={10}
                    maxDistance={40}
                />

                {/* Soft environmental reflections */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

export default PremiumMapDemo;
