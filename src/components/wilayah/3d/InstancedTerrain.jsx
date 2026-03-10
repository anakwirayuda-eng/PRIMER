import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TILE_TYPES } from '../constants.js';

export const TILE_SIZE = 1;

// ─── Seeded PRNG for deterministic randomness ─────────────────────
function mulberry32(seed) {
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Spatial noise for biome clusters (smooth variation across map)
function spatialNoise(x, z) {
    return (Math.sin(x * 0.1) + Math.cos(z * 0.15) + Math.sin((x + z) * 0.05)) / 3;
}

// ─── AAA Color Palette ────────────────────────────────────────────
const BASE_GRASS_HSL = { h: 100, s: 45, l: 42 };

const COLORS = {
    WATER: new THREE.Color('#0ea5e9'),
    ROAD: new THREE.Color('#94a3b8'),
    DIRT: new THREE.Color('#8D6E63'),
    SAWAH: new THREE.Color('#84cc16'),
    BRIDGE: new THREE.Color('#78350f'),
    FLOWER_PINK: new THREE.Color('#f472b6'),
    FLOWER_YELLOW: new THREE.Color('#facc15'),
    FLOWER_WHITE: new THREE.Color('#f8fafc'),
    TRUNK: new THREE.Color('#451a03'),
    LEAF_DARK: new THREE.Color('#15803d'),
    BASE_TOP: new THREE.Color('#451a03'),
    BASE_BOTTOM: new THREE.Color('#1c1917'),
};

// ─── Rolling Hills height function (MUST match BuildingRenderer!) ──
function hillHeight(x, z) {
    return Math.sin(x * 0.2) * Math.cos(z * 0.15) * 0.2
        + Math.sin(x * 0.5 + 1.3) * Math.cos(z * 0.4) * 0.08;
}

// ═══════════════════════════════════════════════════════════════════
export function InstancedTerrain({ mapData }) {
    const { tiles, width, height, centerX, centerY } = mapData;

    // PASS 1: Count tiles + PASS 2: Fill Float32Arrays (zero GC)
    const groundData = useMemo(() => {
        // Count pass
        let gC = 0, rC = 0, dC = 0, sC = 0, wC = 0, bC = 0, fC = 0, tC = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const t = tiles[y][x];
                if (t === TILE_TYPES.GRASS) gC++;
                else if ([TILE_TYPES.ROAD_H, TILE_TYPES.ROAD_V, TILE_TYPES.ROAD_CROSS].includes(t)) { gC++; rC++; }
                else if ([TILE_TYPES.DIRT_ROAD_H, TILE_TYPES.DIRT_ROAD_V, TILE_TYPES.DIRT_ROAD_CROSS].includes(t)) { gC++; dC++; }
                else if (t === TILE_TYPES.WATER) { dC++; wC++; }
                else if (t === TILE_TYPES.SAWAH) { gC++; sC++; }
                else if (t === TILE_TYPES.BRIDGE) { dC++; wC++; bC++; }
                else if (t === TILE_TYPES.FLOWER) { gC++; fC++; }
                else if (t === TILE_TYPES.TREE) { gC++; tC++; }
                else gC++;
            }
        }

        // Pre-allocate Float32Arrays (VRAM-friendly, zero GC)
        const data = {
            grass: { mat: new Float32Array(gC * 16), col: new Float32Array(gC * 3), idx: 0, max: gC },
            roads: { mat: new Float32Array(rC * 16), idx: 0, max: rC },
            dirt: { mat: new Float32Array(dC * 16), idx: 0, max: dC },
            sawah: { mat: new Float32Array(sC * 16), idx: 0, max: sC },
            water: { mat: new Float32Array(wC * 16), originalY: new Float32Array(wC), idx: 0, max: wC },
            bridges: { mat: new Float32Array(bC * 16), idx: 0, max: bC },
            flowers: { mat: new Float32Array(fC * 16), col: new Float32Array(fC * 3), idx: 0, max: fC },
            trees: { trunk: new Float32Array(tC * 16), leaves: new Float32Array(tC * 2 * 16), idx: 0, leafIdx: 0, max: tC },
        };

        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        const pushMat = (layer) => {
            dummy.updateMatrix();
            dummy.matrix.toArray(layer.mat, layer.idx * 16);
            layer.idx++;
        };

        const pushGrass = (px, pz, yRoll, r) => {
            dummy.position.set(px, yRoll, pz);
            dummy.scale.set(0.995, 1, 0.995); // Micro-gap for subtle ambient occlusion
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            dummy.matrix.toArray(data.grass.mat, data.grass.idx * 16);

            // Biome noise + per-tile variation
            const noise = spatialNoise(px, pz);
            color.setHSL(
                (BASE_GRASS_HSL.h + noise * 12 + (r * 4 - 2)) / 360,
                (BASE_GRASS_HSL.s + noise * 10) / 100,
                (BASE_GRASS_HSL.l + (r * 6 - 3)) / 100
            );
            color.toArray(data.grass.col, data.grass.idx * 3);
            data.grass.idx++;
        };

        // Fill pass
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const type = tiles[y][x];
                const px = (x - centerX) * TILE_SIZE;
                const pz = (y - centerY) * TILE_SIZE;
                const yRoll = hillHeight(px, pz);
                const seed = x * 7919 + y * 6271;
                const r = mulberry32(seed);

                if (type === TILE_TYPES.GRASS) {
                    pushGrass(px, pz, yRoll, r);
                }
                else if ([TILE_TYPES.ROAD_H, TILE_TYPES.ROAD_V, TILE_TYPES.ROAD_CROSS].includes(type)) {
                    pushGrass(px, pz, yRoll, r);
                    dummy.position.set(px, yRoll + 0.11, pz);
                    dummy.scale.set(1, 1, 1);
                    dummy.rotation.set(0, 0, 0);
                    pushMat(data.roads);
                }
                else if ([TILE_TYPES.DIRT_ROAD_H, TILE_TYPES.DIRT_ROAD_V, TILE_TYPES.DIRT_ROAD_CROSS].includes(type)) {
                    pushGrass(px, pz, yRoll, r);
                    dummy.position.set(px, yRoll + 0.11, pz);
                    dummy.scale.set(1, 1, 1);
                    dummy.rotation.set(0, 0, 0);
                    pushMat(data.dirt);
                }
                else if (type === TILE_TYPES.WATER) {
                    // Dirt riverbed below water
                    dummy.position.set(px, yRoll - 0.4, pz);
                    dummy.scale.set(0.98, 1, 0.98);
                    dummy.rotation.set(0, 0, 0);
                    pushMat(data.dirt);
                    // Water surface (store original Y for animation)
                    const waterY = -0.15;
                    dummy.position.set(px, waterY, pz);
                    dummy.scale.set(1, 1, 1);
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.water.mat, data.water.idx * 16);
                    data.water.originalY[data.water.idx] = waterY;
                    data.water.idx++;
                }
                else if (type === TILE_TYPES.SAWAH) {
                    pushGrass(px, pz, yRoll, r);
                    // Sawah terrace (slightly inset for paddy field look)
                    dummy.position.set(px, yRoll + 0.12, pz);
                    dummy.scale.set(0.85, 1, 0.85);
                    dummy.rotation.set(0, 0, 0);
                    pushMat(data.sawah);
                }
                else if (type === TILE_TYPES.BRIDGE) {
                    dummy.position.set(px, yRoll - 0.4, pz);
                    dummy.scale.set(0.98, 1, 0.98);
                    dummy.rotation.set(0, 0, 0);
                    pushMat(data.dirt);
                    const waterY = -0.15;
                    dummy.position.set(px, waterY, pz);
                    dummy.scale.set(1, 1, 1);
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.water.mat, data.water.idx * 16);
                    data.water.originalY[data.water.idx] = waterY;
                    data.water.idx++;
                    dummy.position.set(px, yRoll + 0.2, pz);
                    dummy.scale.set(1, 1, 1);
                    pushMat(data.bridges);
                }
                else if (type === TILE_TYPES.FLOWER) {
                    pushGrass(px, pz, yRoll, r);
                    dummy.position.set(
                        px + (r - 0.5) * 0.5,
                        yRoll + 0.15,
                        pz + (mulberry32(seed + 1) - 0.5) * 0.5
                    );
                    dummy.rotation.set(0, r * Math.PI, 0);
                    dummy.scale.setScalar(0.5 + r * 0.5);
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.flowers.mat, data.flowers.idx * 16);
                    const fCol = r < 0.4 ? COLORS.FLOWER_PINK : r < 0.7 ? COLORS.FLOWER_YELLOW : COLORS.FLOWER_WHITE;
                    fCol.toArray(data.flowers.col, data.flowers.idx * 3);
                    data.flowers.idx++;
                }
                else if (type === TILE_TYPES.TREE) {
                    pushGrass(px, pz, yRoll, r);
                    const scale = 0.6 + r * 0.6;
                    const rRot = mulberry32(seed + 2) * Math.PI * 2;

                    // Trunk (slight organic lean)
                    dummy.position.set(px, yRoll + 0.1, pz);
                    dummy.scale.setScalar(scale);
                    dummy.rotation.set(
                        (mulberry32(seed + 3) - 0.5) * 0.1,
                        rRot,
                        (mulberry32(seed + 4) - 0.5) * 0.1
                    );
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.trees.trunk, data.trees.idx * 16);
                    data.trees.idx++;

                    // GHIBLI CANOPY: 2 leaf layers per tree
                    // Main canopy (center)
                    dummy.position.set(px, yRoll + 0.1 + scale * 0.8, pz);
                    dummy.scale.setScalar(scale);
                    dummy.rotation.set(rRot, rRot, rRot);
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.trees.leaves, data.trees.leafIdx * 16);
                    data.trees.leafIdx++;
                    // Side canopy (asymmetric, smaller)
                    dummy.position.set(
                        px + Math.sin(rRot) * 0.25 * scale,
                        yRoll + 0.1 + scale * 0.5,
                        pz + Math.cos(rRot) * 0.25 * scale
                    );
                    dummy.scale.setScalar(scale * 0.75);
                    dummy.updateMatrix();
                    dummy.matrix.toArray(data.trees.leaves, data.trees.leafIdx * 16);
                    data.trees.leafIdx++;
                }
                else {
                    pushGrass(px, pz, yRoll, r);
                }
            }
        }
        return data;
    }, [tiles, width, height, centerX, centerY]);

    // Refs
    const grassRef = useRef();
    const roadsRef = useRef();
    const dirtRef = useRef();
    const sawahRef = useRef();
    const waterRef = useRef();
    const bridgeRef = useRef();
    const treeTrunkRef = useRef();
    const treeLeavesRef = useRef();
    const flowerRef = useRef();

    // Apply Float32Arrays to instanced meshes
    useEffect(() => {
        const apply = (ref, layer, useColor = false) => {
            if (!ref.current || layer.idx === 0) return;
            // 🚨 FIX: Prevent world vanishing when panning to edges
            ref.current.frustumCulled = false;
            ref.current.instanceMatrix = new THREE.InstancedBufferAttribute(layer.mat, 16);
            ref.current.instanceMatrix.needsUpdate = true;
            ref.current.count = layer.idx;
            if (useColor && layer.col) {
                ref.current.instanceColor = new THREE.InstancedBufferAttribute(layer.col, 3);
            }
        };

        apply(grassRef, groundData.grass, true);
        apply(roadsRef, groundData.roads);
        apply(dirtRef, groundData.dirt);
        apply(sawahRef, groundData.sawah);
        apply(waterRef, groundData.water);
        apply(bridgeRef, groundData.bridges);
        apply(flowerRef, groundData.flowers, true);

        // Trunk
        if (treeTrunkRef.current && groundData.trees.idx > 0) {
            treeTrunkRef.current.frustumCulled = false;
            treeTrunkRef.current.instanceMatrix = new THREE.InstancedBufferAttribute(groundData.trees.trunk, 16);
            treeTrunkRef.current.instanceMatrix.needsUpdate = true;
            treeTrunkRef.current.count = groundData.trees.idx;
        }
        // Leaves (2x count)
        if (treeLeavesRef.current && groundData.trees.leafIdx > 0) {
            treeLeavesRef.current.frustumCulled = false;
            treeLeavesRef.current.instanceMatrix = new THREE.InstancedBufferAttribute(groundData.trees.leaves, 16);
            treeLeavesRef.current.instanceMatrix.needsUpdate = true;
            treeLeavesRef.current.count = groundData.trees.leafIdx;
        }
    }, [groundData]);

    // BREATHING RIVER: animate water Y position via instanceMatrix (zero GC)
    useFrame((state) => {
        if (!waterRef.current || groundData.water.idx === 0) return;
        const time = state.clock.elapsedTime;
        const arr = waterRef.current.instanceMatrix.array;
        for (let i = 0; i < groundData.water.idx; i++) {
            const base = i * 16;
            const x = arr[base + 12];
            const z = arr[base + 14];
            arr[base + 13] = groundData.water.originalY[i]
                + Math.sin(x * 1.5 + time * 2.0) * Math.cos(z * 1.5 + time * 1.5) * 0.04;
        }
        waterRef.current.instanceMatrix.needsUpdate = true;
    });

    // ─── AAA Geometry Cache ─────────────────────────────────────────
    // EARTH SKIRT: tile height 2.0, pushed down so top is flush, bottom hides gaps
    const tileGeo = useMemo(() => new THREE.BoxGeometry(TILE_SIZE, 2.0, TILE_SIZE).translate(0, -0.9, 0), []);
    const flatGeo = useMemo(() => new THREE.BoxGeometry(TILE_SIZE, 0.05, TILE_SIZE), []);
    const sawahGeo = useMemo(() => new THREE.BoxGeometry(TILE_SIZE, 0.08, TILE_SIZE), []);
    const waterGeo = useMemo(() => new THREE.BoxGeometry(TILE_SIZE, 0.35, TILE_SIZE), []);
    const flowerGeo = useMemo(() => new THREE.DodecahedronGeometry(0.12, 0), []);
    const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.12, 1, 5).translate(0, 0.5, 0), []);
    // 🌟 GHIBLI SPHERICAL NORMALS — light bounces like Studio Ghibli clouds
    const leafGeo = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(0.55, 1);
        const pos = geo.getAttribute('position');
        const norm = geo.getAttribute('normal');
        for (let i = 0; i < pos.count; i++) {
            const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
            norm.setXYZ(i, v.x, v.y, v.z);
        }
        norm.needsUpdate = true;
        geo.translate(0, 0.8, 0);
        return geo;
    }, []);

    const mapW = width * TILE_SIZE;
    const mapH = height * TILE_SIZE;

    return (
        <group>
            {/* 🌟 MUSEUM PEDESTAL — gold band + mahogany base */}
            <group position={[0, -0.2, 0]}>
                {/* Gold brass band */}
                <mesh receiveShadow position={[0, -0.15, 0]}>
                    <boxGeometry args={[mapW + 2.5, 0.12, mapH + 2.5]} />
                    <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Soil crust */}
                <mesh receiveShadow position={[0, -0.6, 0]}>
                    <boxGeometry args={[mapW + 2.3, 0.8, mapH + 2.3]} />
                    <meshStandardMaterial color="#3A2112" roughness={1} />
                </mesh>
                {/* Mahogany base */}
                <mesh receiveShadow position={[0, -1.3, 0]}>
                    <boxGeometry args={[mapW + 2.6, 0.6, mapH + 2.6]} />
                    <meshStandardMaterial color="#291004" roughness={0.8} />
                </mesh>
            </group>

            {/* Grass (Earth Skirt geometry + biome-colored instances) */}
            {groundData.grass.max > 0 && (
                <instancedMesh ref={grassRef} args={[tileGeo, null, groundData.grass.max]} receiveShadow>
                    <meshStandardMaterial roughness={0.9} flatShading />
                </instancedMesh>
            )}

            {groundData.roads.max > 0 && (
                <instancedMesh ref={roadsRef} args={[flatGeo, null, groundData.roads.max]} receiveShadow>
                    <meshStandardMaterial color={COLORS.ROAD} roughness={0.8} />
                </instancedMesh>
            )}

            {groundData.dirt.max > 0 && (
                <instancedMesh ref={dirtRef} args={[flatGeo, null, groundData.dirt.max]} receiveShadow>
                    <meshStandardMaterial color={COLORS.DIRT} roughness={1} />
                </instancedMesh>
            )}

            {/* WET SAWAH: clearcoat reflects golden hour light like real paddy water */}
            {groundData.sawah.max > 0 && (
                <instancedMesh ref={sawahRef} args={[sawahGeo, null, groundData.sawah.max]} receiveShadow>
                    <meshPhysicalMaterial color={COLORS.SAWAH} roughness={0.15} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.05} />
                </instancedMesh>
            )}

            {/* BREATHING WATER: animated Y in useFrame */}
            {groundData.water.max > 0 && (
                <instancedMesh ref={waterRef} args={[waterGeo, null, groundData.water.max]} receiveShadow>
                    <meshPhysicalMaterial color={COLORS.WATER} roughness={0.05} metalness={0.3} clearcoat={1} />
                </instancedMesh>
            )}

            {groundData.bridges.max > 0 && (
                <instancedMesh ref={bridgeRef} args={[flatGeo, null, groundData.bridges.max]} castShadow receiveShadow>
                    <meshStandardMaterial color={COLORS.BRIDGE} roughness={0.9} />
                </instancedMesh>
            )}

            {/* GHIBLI CANOPY: 2 leaf layers per tree */}
            <group>
                {groundData.trees.max > 0 && (
                    <instancedMesh ref={treeTrunkRef} args={[trunkGeo, null, groundData.trees.max]} castShadow receiveShadow>
                        <meshStandardMaterial color={COLORS.TRUNK} roughness={0.9} />
                    </instancedMesh>
                )}
                {groundData.trees.max > 0 && (
                    <instancedMesh ref={treeLeavesRef} args={[leafGeo, null, groundData.trees.max * 2]} castShadow receiveShadow>
                        <meshStandardMaterial color={COLORS.LEAF_DARK} roughness={0.8} />
                    </instancedMesh>
                )}
            </group>

            {groundData.flowers.max > 0 && (
                <instancedMesh ref={flowerRef} args={[flowerGeo, null, groundData.flowers.max]} castShadow>
                    <meshStandardMaterial roughness={0.6} />
                </instancedMesh>
            )}
        </group>
    );
}
