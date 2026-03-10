import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Outlines, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { BUILDING_TYPES } from '../constants.js';
import { TILE_SIZE } from './InstancedTerrain.jsx';

// ─── 🌟 GLOBAL GEOMETRY CACHE (Zero VRAM Leak!) ──────────────────
// 6 geometries sent to GPU ONCE, all buildings reference via scale
const GEO = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
    cone: new THREE.ConeGeometry(0.707, 1, 4),
    hip: new THREE.CylinderGeometry(0.2, 0.707, 1, 4), // Truncated pyramid
    sphere: new THREE.SphereGeometry(0.5, 12, 12),
    dome: new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    trash: new THREE.DodecahedronGeometry(0.15, 0) // 🌟 Crumpled plastic trash
};

// ─── Seeded PRNG (same as InstancedTerrain) ───────────────────────
function mulberry32(seed) {
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ─── Rolling Hills (MUST match InstancedTerrain!) ─────────────────
function hillHeight(x, z) {
    return Math.sin(x * 0.2) * Math.cos(z * 0.15) * 0.2
        + Math.sin(x * 0.5 + 1.3) * Math.cos(z * 0.4) * 0.08;
}

// Auto-shade: darken color by 20% lightness for wainscoting
function getTrimColor(hex) {
    const c = new THREE.Color(hex);
    const hsl = {}; c.getHSL(hsl);
    return new THREE.Color().setHSL(hsl.h, hsl.s, Math.max(0, hsl.l - 0.15)).getStyle();
}

// ─── EXPANDED Scale Dictionary (kills Clone Army) ─────────────────
function getScale(type, seed) {
    const r = mulberry32(seed);
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: return [2.6, 1.3, 1.8];
        case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES: return [1.8, 1.1, 1.5];
        case BUILDING_TYPES.SCHOOL: case BUILDING_TYPES.TK: return [3.2, 1.0, 1.4];
        case BUILDING_TYPES.MOSQUE: return [1.6, 1.6, 1.6];
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: return [2.2, 1.2, 1.6];
        case BUILDING_TYPES.MARKET: case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG: return [2.2, 0.9, 1.4];
        case BUILDING_TYPES.APOTEK: return [1.4, 1.1, 1.4];
        case BUILDING_TYPES.MCK: case BUILDING_TYPES.WELL: return [0.9, 0.8, 0.9];
        case BUILDING_TYPES.PAMSIMAS: return [1.0, 2.5, 1.0];
        case BUILDING_TYPES.GAPURA_DESA: return [2.2, 2.2, 0.5];
        case BUILDING_TYPES.BANK_SAMPAH: return [1.8, 0.8, 1.2];
        case BUILDING_TYPES.HOUSE_MODERN: case BUILDING_TYPES.RUMAH_DINAS: return [1.4, 1.2, 1.4];
        case BUILDING_TYPES.HOUSE_HUT: return [0.8, 0.7, 0.8];
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.POS_GIZI: case BUILDING_TYPES.RTK:
        case BUILDING_TYPES.KB_POST: case BUILDING_TYPES.POS_UKK: return [1.4, 0.9, 1.2];
        case BUILDING_TYPES.SUNGAI_CIKAPAS: return [3.0, 0.3, 2.0];
        case BUILDING_TYPES.SUNGAI: return [2.0, 0.3, 1.5];
        case BUILDING_TYPES.WATERFALL: return [1.5, 1.2, 1.5];
        case BUILDING_TYPES.JEMBATAN: return [2.0, 0.5, 1.0];
        case BUILDING_TYPES.ALUN_ALUN: case BUILDING_TYPES.LAPANGAN: case BUILDING_TYPES.PLAYGROUND:
        case BUILDING_TYPES.TPU: case BUILDING_TYPES.FARM: case BUILDING_TYPES.TOGA: return [2.5, 0.15, 2.5];
        default: return [0.95, 0.75 + r * 0.4, 0.95];
    }
}

// ─── EXPANDED Color Theming ───────────────────────────────────────
function getTheme(type) {
    switch (type) {
        case BUILDING_TYPES.PUSKESMAS: case BUILDING_TYPES.PUSTU: case BUILDING_TYPES.POLINDES:
            return { body: '#F8FAFC', roof: '#DC2626' };
        case BUILDING_TYPES.APOTEK: return { body: '#F0FDF4', roof: '#10B981' };
        case BUILDING_TYPES.POSYANDU: case BUILDING_TYPES.POS_GIZI: case BUILDING_TYPES.RTK:
        case BUILDING_TYPES.KB_POST: case BUILDING_TYPES.POS_UKK:
            return { body: '#FDF2F8', roof: '#EC4899' };
        case BUILDING_TYPES.SCHOOL: case BUILDING_TYPES.TK:
            return { body: '#FFFBEB', roof: '#F59E0B' };
        case BUILDING_TYPES.MOSQUE: return { body: '#F0FDF4', roof: '#16A34A' };
        case BUILDING_TYPES.MARKET: case BUILDING_TYPES.WARUNG: case BUILDING_TYPES.TOKO_KELONTONG:
            return { body: '#FEF3C7', roof: '#78350F' };
        case BUILDING_TYPES.BANK_SAMPAH: return { body: '#ECFCCB', roof: '#4D7C0F' };
        case BUILDING_TYPES.BALAI_DESA: case BUILDING_TYPES.KANTOR_DESA: case BUILDING_TYPES.RUMAH_DINAS:
            return { body: '#F1F5F9', roof: '#334155' };
        case BUILDING_TYPES.MCK: case BUILDING_TYPES.WELL:
            return { body: '#E0F2FE', roof: '#0369A1' };
        case BUILDING_TYPES.HOUSE_RED: return { body: '#FEF2F2', roof: '#B91C1C' };
        case BUILDING_TYPES.HOUSE_BLUE: return { body: '#F0F9FF', roof: '#0284C7' };
        case BUILDING_TYPES.HOUSE_TRAD: return { body: '#FEF3C7', roof: '#78350F' };
        case BUILDING_TYPES.HOUSE_HUT: return { body: '#D6D3D1', roof: '#451A03' };
        case BUILDING_TYPES.HOUSE_MODERN: return { body: '#F8FAFC', roof: '#1E293B' };
        case BUILDING_TYPES.ALUN_ALUN: case BUILDING_TYPES.LAPANGAN: case BUILDING_TYPES.PLAYGROUND:
        case BUILDING_TYPES.TPU: case BUILDING_TYPES.FARM: case BUILDING_TYPES.TOGA:
            return { body: '#86EFAC', roof: 'none' };
        case BUILDING_TYPES.SUNGAI_CIKAPAS: case BUILDING_TYPES.SUNGAI:
            return { body: '#0EA5E9', roof: 'none' };
        case BUILDING_TYPES.WATERFALL:
            return { body: '#7DD3FC', roof: 'none' };
        case BUILDING_TYPES.JEMBATAN:
            return { body: '#78350F', roof: 'none' };
        default: return { body: '#F5F5F4', roof: '#64748B' };
    }
}

// ─── Roof geometry — with OVERHANG ───────────────────────────────
const OVERHANG = [1.15, 1, 1.15];
const OVH = 1.35; // scalar overhang for GEO-cached roofs

// Nature/flat types that should NOT animate (squash/stretch)
const NATURE_OR_FLAT = [
    BUILDING_TYPES.SUNGAI, BUILDING_TYPES.SUNGAI_CIKAPAS, BUILDING_TYPES.WATERFALL,
    BUILDING_TYPES.JEMBATAN, BUILDING_TYPES.ALUN_ALUN, BUILDING_TYPES.LAPANGAN,
    BUILDING_TYPES.PLAYGROUND, BUILDING_TYPES.TPU, BUILDING_TYPES.FARM, BUILDING_TYPES.TOGA
];

function RoofMesh({ buildingType, color, seedValue = 0, isTwoStory = false }) {
    const r = mulberry32((seedValue || 0) + 17);
    const isGable = r > 0.5; // 50% Pelana, 50% Limasan
    const isHouseType = buildingType?.includes?.('house') || buildingType?.includes?.('HOUSE');

    // Fascia (Lisplang Kayu) — wood trim under roof
    const Fascia = ({ yOff = 1.1 }) => (
        <mesh position={[0, yOff, 0]} scale={[OVH, 0.08, OVH]} geometry={GEO.box} castShadow receiveShadow>
            <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
    );

    // 🌟 GHIBLI DORMER — small attic window protruding from roof
    const Dormer = ({ yOff = 0.2 }) => (
        <group position={[0, yOff, 0.45]}>
            <mesh scale={[0.35, 0.35, 0.35]} geometry={GEO.box} castShadow>
                <meshPhysicalMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.22, 0]} scale={[0.5, 0.25, 0.5]} rotation={[0, Math.PI / 4, 0]} geometry={GEO.cone} castShadow>
                <meshStandardMaterial color="#1C1917" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.18]} scale={[0.18, 0.18, 0.02]} geometry={GEO.box}>
                <meshPhysicalMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={1.2} toneMapped={false} />
            </mesh>
        </group>
    );

    // MOSQUE — dome
    if (buildingType === BUILDING_TYPES.MOSQUE) return (
        <group>
            <Fascia />
            <mesh position={[0, 1.15, 0]} scale={[OVH, OVH * 0.8, OVH]} geometry={GEO.dome} castShadow receiveShadow>
                <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.6} metalness={0.1} />
            </mesh>
        </group>
    );

    // TRAD — steep pyramid with crossed ridge
    if (buildingType === BUILDING_TYPES.HOUSE_TRAD) return (
        <group>
            <Fascia />
            <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]} scale={[OVH * 1.4, 0.8, OVH * 1.4]} geometry={GEO.cone} castShadow receiveShadow>
                <meshPhysicalMaterial color={color} roughness={0.9} flatShading />
            </mesh>
            {/* Nok Kayu (Crossed Ridge) */}
            <mesh position={[0, 1.55, 0]} scale={[OVH * 1.2, 0.06, 0.06]} geometry={GEO.box} castShadow><meshStandardMaterial color="#451A03" /></mesh>
            <mesh position={[0, 1.55, 0]} scale={[0.06, 0.06, OVH * 1.2]} geometry={GEO.box} castShadow><meshStandardMaterial color="#451A03" /></mesh>
        </group>
    );

    // HUT — thatch cone (no fascia)
    if (buildingType === BUILDING_TYPES.HOUSE_HUT) return (
        <mesh position={[0, 1.3, 0]} scale={[1.1, 0.8, 1.1]} rotation={[0, Math.PI / 4, 0]} geometry={GEO.cone} castShadow receiveShadow>
            <meshPhysicalMaterial color={color} roughness={1.0} flatShading />
        </mesh>
    );

    // 🌟 PARAPET CROWN — official/modern buildings with sunken dark roof
    if ([BUILDING_TYPES.BALAI_DESA, BUILDING_TYPES.KANTOR_DESA, BUILDING_TYPES.HOUSE_MODERN,
    BUILDING_TYPES.MCK, BUILDING_TYPES.BANK_SAMPAH, BUILDING_TYPES.APOTEK].includes(buildingType)) return (
        <group>
            <Fascia yOff={1.05} />
            {/* Raised parapet walls */}
            <mesh position={[0, 1.2, 0]} scale={[OVH - 0.05, 0.18, OVH - 0.05]} geometry={GEO.box} castShadow receiveShadow>
                <meshPhysicalMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Sunken dark asphalt inside parapet */}
            <mesh position={[0, 1.27, 0]} scale={[OVH - 0.15, 0.05, OVH - 0.15]} geometry={GEO.box} receiveShadow>
                <meshStandardMaterial color="#1C1917" roughness={0.9} />
            </mesh>
        </group>
    );

    // 🌟 HIP / GABLE ROOFS — for standard houses
    const roofY = isTwoStory ? 1.85 : 1.15;
    const fasciaY = isTwoStory ? 1.8 : 1.1;

    if (isGable && isHouseType) {
        // PELANA (Gable) — rotated box forming peaked roof
        return (
            <group>
                <Fascia yOff={fasciaY} />
                <group position={[0, roofY + 0.15, 0]}>
                    <mesh rotation={[Math.PI / 4, 0, 0]} scale={[OVH, OVH * 0.707, OVH * 0.707]} geometry={GEO.box} castShadow receiveShadow>
                        <meshPhysicalMaterial color={color} roughness={0.8} flatShading clearcoat={0.1} />
                    </mesh>
                    {/* Nok Atap / Ridge Cap */}
                    <mesh position={[0, 0.35, 0]} scale={[OVH + 0.05, 0.06, 0.06]} geometry={GEO.box} castShadow>
                        <meshStandardMaterial color="#1E293B" roughness={0.9} />
                    </mesh>
                    {r > 0.75 && !isTwoStory && <Dormer yOff={0.15} />}
                </group>
            </group>
        );
    }

    // LIMASAN (Hip) — truncated pyramid with flat top
    return (
        <group>
            <Fascia yOff={fasciaY} />
            <group position={[0, roofY + 0.2, 0]}>
                <mesh rotation={[0, Math.PI / 4, 0]} scale={[OVH, 0.6, OVH]} geometry={GEO.hip} castShadow receiveShadow>
                    <meshPhysicalMaterial color={color} roughness={0.8} flatShading clearcoat={0.1} />
                </mesh>
                {/* Flat ridge cap on top */}
                <mesh position={[0, 0.3, 0]} scale={[0.3, 0.06, 0.3]} geometry={GEO.box} castShadow>
                    <meshStandardMaterial color="#1E293B" roughness={0.9} />
                </mesh>
                {r > 0.65 && !isTwoStory && <Dormer yOff={0.1} />}
            </group>
        </group>
    );
}

// ─── Detective Mode ───────────────────────────────────────────────
function isBuildingAtRisk(building, activeLayer) {
    if (activeLayer === 'general') return false;
    if (activeLayer === 'pispk') return building.familyData?.iksScore != null && building.familyData.iksScore < 0.4;
    if (activeLayer === 'surveillance') return building.hasDBCase || building.familyData?.hasCase;
    if (activeLayer === 'phbs') return building.familyData?.phbsScore != null && building.familyData.phbsScore < 4;
    if (activeLayer === 'perilaku') return building.familyData?.behaviorRisk === 'high' || building.familyData?.behaviorRisk === 'medium';
    return false;
}

const COMMERCIAL_TYPES = [BUILDING_TYPES.WARUNG, BUILDING_TYPES.MARKET, BUILDING_TYPES.TOKO_KELONTONG];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

// Internal component — wrapped in React.memo below
function BuildingRendererInternal({ building, centerX, centerY, onSelect, selected, activeLayer, onHover }) {
    const groupRef = useRef();
    const waterfallRef = useRef();
    const clothesRef = useRef();
    const questBobRef = useRef(0); // for bouncing quest marker
    const [hovered, setHovered] = useState(false);

    const px = (building.x - centerX) * TILE_SIZE;
    const pz = (building.y - centerY) * TILE_SIZE;
    const baseY = hillHeight(px, pz);

    const seed = useMemo(() => (building.x || 0) * 7919 + (building.y || 0) * 6271, [building.x, building.y]);
    const r = useMemo(() => mulberry32(seed), [seed]);
    const scale = useMemo(() => getScale(building.type, seed), [building.type, seed]);
    const theme = useMemo(() => getTheme(building.type), [building.type]);
    const organicRotationY = useMemo(() => (r - 0.5) * 0.14, [r]);

    const detectiveActive = activeLayer && activeLayer !== 'general';
    const atRisk = useMemo(() => isBuildingAtRisk(building, activeLayer), [building, activeLayer]);
    const bodyColor = detectiveActive && !atRisk ? '#64748B' : theme.body;
    const roofColor = detectiveActive && !atRisk ? '#475569' : theme.roof;
    const emissive = detectiveActive && atRisk ? '#EF4444' : '#000000';
    const emissiveIntensity = detectiveActive && atRisk ? 3.0 : 0;

    const isHouse = building.type?.includes('house') || building.type?.includes('HOUSE');
    const phbsScore = building.familyData?.phbsScore ?? 10;
    const isFilthy = isHouse && phbsScore <= 3; // 🌟 ECOLOGY OF CONSEQUENCE
    const isLShaped = isHouse && r > 0.6 && r <= 0.85; // 25% houses get L-shape
    const isTwoStory = isHouse && r > 0.85; // 15% houses get second floor
    const isCozy = isHouse && r > 0.4 && !detectiveActive; // Warm window glow
    const windowColor = isCozy ? '#FEF08A' : '#38BDF8';
    const windowEmissive = isCozy ? '#F59E0B' : '#000000';
    const trimColor = getTrimColor(bodyColor); // Wainscoting color
    const isNatureOrFlat = NATURE_OR_FLAT.includes(building.type);

    // QUEST / ALERT marker logic
    const hasOutbreak = building.familyData?.hasCase || building.hasDBCase;
    const needsAttention = isHouse && building.familyData && !hasOutbreak && (
        (building.familyData.iksScore != null && building.familyData.iksScore < 0.5) ||
        building.familyData.behaviorRisk === 'high'
    );

    // SELECTIVE PHYSICS — nature/flat BANNED from squash/stretch
    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const sqX = (hovered || selected) && !isNatureOrFlat ? 0.92 : 1;
        const sqY = (hovered || selected) && !isNatureOrFlat ? 1.12 : 1;
        groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, sqX, 15, delta);
        groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, sqY, 15, delta);
        groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, sqX, 15, delta);
        const targetY = baseY + ((selected && !isNatureOrFlat) ? 0.3 : 0);
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 15, delta);

        // KINETIC LIFE: clothesline sways in wind
        if (clothesRef.current) clothesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2 + seed) * 0.15;
        // KINETIC LIFE: waterfall emissive pulses
        if (waterfallRef.current) waterfallRef.current.material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
        // Quest marker bobbing
        questBobRef.current = Math.sin(state.clock.elapsedTime * 3) * 0.15;
    });

    const interactions = {
        onPointerOver: (e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; onHover?.(building, groupRef.current?.position); },
        onPointerOut: () => { setHovered(false); document.body.style.cursor = 'auto'; onHover?.(null, null); },
        onClick: (e) => { e.stopPropagation(); onSelect(building); },
        // DOUBLE-CLICK DIVE — instant building interior entry
        onDoubleClick: (e) => {
            e.stopPropagation();
            onSelect(building);
            document.dispatchEvent(new CustomEvent('buildingDoubleDive', { detail: building }));
        },
    };

    // ════ SPECIAL INFRASTRUCTURE (unique geometry, bypass standard box) ════

    if (building.type === BUILDING_TYPES.PAMSIMAS) return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            <group scale={scale}>
                <mesh position={[0, 0.05, 0]} receiveShadow><boxGeometry args={[1.2, 0.1, 1.2]} /><meshStandardMaterial color="#475569" /></mesh>
                {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([lx, lz], i) => (
                    <mesh key={i} position={[lx, 0.8, lz]} castShadow><cylinderGeometry args={[0.06, 0.06, 1.6]} /><meshStandardMaterial color="#94A3B8" /></mesh>
                ))}
                <mesh position={[0, 1.8, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.5, 0.8, 16]} />
                    <meshPhysicalMaterial color="#0EA5E9" roughness={0.2} clearcoat={1.0} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!atRisk} />
                    <Outlines thickness={selected ? 0.04 : 0.02} color={selected ? '#f59e0b' : '#0284c7'} visible={hovered || selected} />
                </mesh>
            </group>
        </group>
    );

    if (building.type === BUILDING_TYPES.GAPURA_DESA) return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            <group scale={scale}>
                <mesh position={[-0.5, 0.6, 0]} castShadow><boxGeometry args={[0.25, 1.2, 0.25]} /><meshStandardMaterial color="#B91C1C" /></mesh>
                <mesh position={[0.5, 0.6, 0]} castShadow><boxGeometry args={[0.25, 1.2, 0.25]} /><meshStandardMaterial color="#B91C1C" /></mesh>
                <mesh position={[0, 1.3, 0]} castShadow><boxGeometry args={[1.4, 0.2, 0.3]} /><meshStandardMaterial color="#1C1917" roughness={0.9} /></mesh>
            </group>
        </group>
    );

    // SUNGAI / SUNGAI_CIKAPAS — river pool with rocks
    if (building.type === BUILDING_TYPES.SUNGAI_CIKAPAS || building.type === BUILDING_TYPES.SUNGAI) return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            <group scale={scale}>
                {/* Riverbed (dirt) */}
                <mesh position={[0, -0.1, 0]} receiveShadow>
                    <boxGeometry args={[1.2, 0.2, 1.2]} />
                    <meshStandardMaterial color="#8D6E63" roughness={1} />
                </mesh>
                {/* Water surface (shimmering) */}
                <mesh position={[0, 0.05, 0]} receiveShadow>
                    <boxGeometry args={[1.1, 0.15, 1.1]} />
                    <meshPhysicalMaterial color="#0EA5E9" roughness={0.05} metalness={0.3} clearcoat={1} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!atRisk} />
                    <Outlines thickness={selected ? 0.04 : 0.02} color={selected ? '#f59e0b' : '#0284c7'} visible={hovered || selected} />
                </mesh>
                {/* Random rocks */}
                {[0.3, -0.25, 0.15].map((offset, i) => (
                    <mesh key={i} position={[offset * (i % 2 ? -1 : 1), 0.15, (mulberry32(seed + i + 20) - 0.5) * 0.6]} castShadow>
                        <sphereGeometry args={[0.08 + mulberry32(seed + i + 30) * 0.06, 5, 5]} />
                        <meshStandardMaterial color="#94A3B8" roughness={0.9} />
                    </mesh>
                ))}
            </group>
        </group>
    );

    // WATERFALL — cascade with splash
    if (building.type === BUILDING_TYPES.WATERFALL) return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            <group scale={scale}>
                {/* Rock cliff */}
                <mesh position={[0, 0.4, -0.2]} castShadow receiveShadow>
                    <boxGeometry args={[0.9, 0.8, 0.6]} />
                    <meshStandardMaterial color="#57534e" roughness={1} />
                </mesh>
                {/* Water cascade */}
                <mesh ref={waterfallRef} position={[0, 0.4, 0.15]} castShadow>
                    <boxGeometry args={[0.5, 0.7, 0.1]} />
                    <meshPhysicalMaterial color="#7DD3FC" roughness={0.05} clearcoat={1} emissive="#38BDF8" emissiveIntensity={0.5} toneMapped={false} />
                </mesh>
                {/* Splash pool */}
                <mesh position={[0, 0.02, 0.3]} receiveShadow>
                    <cylinderGeometry args={[0.4, 0.5, 0.08, 12]} />
                    <meshPhysicalMaterial color="#0EA5E9" roughness={0.05} metalness={0.3} clearcoat={1} />
                    <Outlines thickness={selected ? 0.04 : 0.02} color={selected ? '#f59e0b' : '#0284c7'} visible={hovered || selected} />
                </mesh>
            </group>
        </group>
    );

    // JEMBATAN — wooden bridge
    if (building.type === BUILDING_TYPES.JEMBATAN) return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            <group scale={scale}>
                {/* Bridge deck */}
                <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.2, 0.1, 0.8]} />
                    <meshStandardMaterial color="#78350F" roughness={0.9} />
                    <Outlines thickness={selected ? 0.04 : 0.02} color={selected ? '#f59e0b' : '#78350F'} visible={hovered || selected} />
                </mesh>
                {/* Railings */}
                <mesh position={[-0.55, 0.35, 0]} castShadow><boxGeometry args={[0.05, 0.25, 0.8]} /><meshStandardMaterial color="#451A03" /></mesh>
                <mesh position={[0.55, 0.35, 0]} castShadow><boxGeometry args={[0.05, 0.25, 0.8]} /><meshStandardMaterial color="#451A03" /></mesh>
                {/* Support posts */}
                <mesh position={[-0.4, 0, 0.35]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.5]} /><meshStandardMaterial color="#451A03" /></mesh>
                <mesh position={[0.4, 0, 0.35]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.5]} /><meshStandardMaterial color="#451A03" /></mesh>
                <mesh position={[-0.4, 0, -0.35]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.5]} /><meshStandardMaterial color="#451A03" /></mesh>
                <mesh position={[0.4, 0, -0.35]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.5]} /><meshStandardMaterial color="#451A03" /></mesh>
            </group>
        </group>
    );

    // ════ STANDARD BUILDINGS ════

    return (
        <group ref={groupRef} position={[px, baseY, pz]} rotation={[0, organicRotationY, 0]} {...interactions}>
            {theme.roof !== 'none' ? (
                <group scale={scale}>

                    {/* DIORAMA GROUNDING — yard plate + stepping stones + bushes */}
                    {isHouse && (
                        <group position={[0, 0.02, 0]}>
                            <mesh receiveShadow>
                                <boxGeometry args={[1.4, 0.04, 1.4]} />
                                <meshStandardMaterial color={r > 0.5 ? '#A8A29E' : '#8D6E63'} roughness={1} />
                            </mesh>
                            {/* Stepping stones to door */}
                            {!isLShaped && [-0.15, -0.45, -0.75].map((zPos, i) => (
                                <mesh key={i} position={[0, 0.03, zPos]} castShadow receiveShadow>
                                    <boxGeometry args={[0.22, 0.02, 0.12]} />
                                    <meshStandardMaterial color="#94A3B8" roughness={0.9} />
                                </mesh>
                            ))}
                            {/* Asymmetric bushes */}
                            {r > 0.3 && !detectiveActive && (
                                <mesh position={[-0.6, 0.12, 0.5]} castShadow>
                                    <sphereGeometry args={[0.18, 6, 6]} />
                                    <meshStandardMaterial color="#15803D" roughness={0.9} flatShading />
                                </mesh>
                            )}
                            {r > 0.6 && !detectiveActive && (
                                <mesh position={[0.55, 0.1, -0.5]} castShadow>
                                    <sphereGeometry args={[0.14, 6, 6]} />
                                    <meshStandardMaterial color="#16A34A" roughness={0.9} flatShading />
                                </mesh>
                            )}
                        </group>
                    )}

                    {/* PLINTH — concrete foundation */}
                    <mesh position={[0, 0.05, 0]} receiveShadow>
                        <boxGeometry args={[1.25, 0.1, 1.25]} />
                        <meshStandardMaterial color="#475569" roughness={0.9} />
                    </mesh>

                    {/* WAINSCOTING — darker foundation band (bottom 30%) */}
                    {building.type !== BUILDING_TYPES.HOUSE_HUT && (
                        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
                            <boxGeometry args={[1.22, 0.3, 1.22]} />
                            <meshStandardMaterial color={trimColor} roughness={0.95} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                        </mesh>
                    )}

                    {/* BODY — meshPhysicalMaterial + clearcoat "vinyl toy" */}
                    {building.type === BUILDING_TYPES.HOUSE_HUT ? (
                        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.5, 0.55, 1, 8]} />
                            <meshPhysicalMaterial color={bodyColor} roughness={1.0} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                        </mesh>
                    ) : (
                        <RoundedBox args={[1.2, 0.7, 1.2]} position={[0, 0.75, 0]} radius={0.05} smoothness={1} castShadow receiveShadow>
                            <meshPhysicalMaterial color={bodyColor} roughness={0.85} clearcoat={0.15} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                            <Outlines thickness={selected ? 0.04 : 0.02} color={selected ? '#f59e0b' : '#1e293b'} visible={hovered || selected} />
                        </RoundedBox>
                    )}

                    {/* 🌟 TWO-STORY CANTILEVER — Lt.2 offset back with glass balcony */}
                    {isTwoStory && (
                        <group position={[0, 1.1, -0.15]}>
                            {/* Floor belt */}
                            <mesh position={[0, 0.05, 0]} scale={[0.9, 0.15, 0.9]} geometry={GEO.box} castShadow receiveShadow>
                                <meshStandardMaterial color={trimColor} roughness={0.95} />
                            </mesh>
                            {/* Lt.2 walls */}
                            <RoundedBox args={[0.85, 0.5, 0.85]} position={[0, 0.35, 0]} radius={0.04} smoothness={1} castShadow receiveShadow>
                                <meshPhysicalMaterial color={bodyColor} roughness={0.85} clearcoat={0.15} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                            </RoundedBox>
                            {/* Lt.2 window */}
                            <group position={[0.2, 0.3, 0.43]}>
                                <mesh scale={[0.22, 0.22, 0.02]} geometry={GEO.box}><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                                <mesh position={[0, 0, 0.011]} scale={[0.15, 0.15, 0.02]} geometry={GEO.box}>
                                    <meshPhysicalMaterial color={windowColor} emissive={windowEmissive} emissiveIntensity={isCozy ? 1.5 : 0} transmission={isCozy ? 0 : 0.9} roughness={0.1} toneMapped={false} />
                                </mesh>
                            </group>
                            {/* 🌟 GLASS BALCONY — on front dak */}
                            <group position={[0, -0.05, 0.52]}>
                                <mesh position={[0, 0.1, 0]} scale={[0.8, 0.04, 0.2]} geometry={GEO.box} castShadow>
                                    <meshStandardMaterial color="#94A3B8" />
                                </mesh>
                                <mesh position={[0, 0.22, 0.1]} scale={[0.8, 0.18, 0.02]} geometry={GEO.box}>
                                    <meshPhysicalMaterial color="#38BDF8" transmission={0.85} roughness={0.1} />
                                </mesh>
                                <mesh position={[0, 0.32, 0.1]} scale={[0.85, 0.02, 0.04]} geometry={GEO.box}>
                                    <meshStandardMaterial color="#1E293B" />
                                </mesh>
                            </group>
                        </group>
                    )}

                    {/* L-SHAPE EXTENSION — 40% houses get procedural wing */}
                    {isLShaped && (
                        <group position={[-0.6, 0, 0.2]}>
                            <RoundedBox args={[0.7, 0.8, 0.8]} position={[0, 0.45, 0]} radius={0.05} smoothness={1} castShadow receiveShadow>
                                <meshPhysicalMaterial color={bodyColor} roughness={0.85} clearcoat={0.15} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                            </RoundedBox>
                            <mesh position={[0, 0.95, 0]} scale={OVERHANG} castShadow>
                                <coneGeometry args={[0.5, 0.4, 4]} />
                                <meshPhysicalMaterial color={roofColor} roughness={0.8} flatShading />
                            </mesh>
                        </group>
                    )}

                    {/* DOOR + TROPICAL PORCH (teras + tiang + loster) */}
                    {building.type !== BUILDING_TYPES.HOUSE_HUT && (
                        <group position={[isLShaped ? -0.2 : 0, 0, 0.61]}>
                            {/* Main door */}
                            <mesh position={[0, 0.35, 0]} castShadow>
                                <boxGeometry args={[0.28, 0.5, 0.04]} />
                                <meshStandardMaterial color={detectiveActive ? '#1E293B' : '#450A0A'} roughness={0.9} />
                            </mesh>
                            {/* Porch canopy */}
                            {isHouse && (
                                <>
                                    <mesh position={[0, 0.65, 0.15]} rotation={[-0.15, 0, 0]} castShadow>
                                        <boxGeometry args={[0.45, 0.04, 0.3]} />
                                        <meshStandardMaterial color="#78350F" />
                                    </mesh>
                                    {/* Porch columns */}
                                    <mesh position={[-0.18, 0.35, 0.25]} castShadow>
                                        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                                        <meshStandardMaterial color="#451A03" />
                                    </mesh>
                                    <mesh position={[0.18, 0.35, 0.25]} castShadow>
                                        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                                        <meshStandardMaterial color="#451A03" />
                                    </mesh>
                                    {/* Loster (tropical ventilation) */}
                                    <mesh position={[0, 0.78, 0]}>
                                        <boxGeometry args={[0.25, 0.05, 0.02]} />
                                        <meshStandardMaterial color="#0F172A" />
                                    </mesh>
                                </>
                            )}
                        </group>
                    )}
                    {building.type === BUILDING_TYPES.HOUSE_HUT && (
                        <mesh position={[0, 0.35, 0.45]} castShadow>
                            <boxGeometry args={[0.28, 0.5, 0.04]} />
                            <meshStandardMaterial color={detectiveActive ? '#1E293B' : '#450A0A'} roughness={0.9} />
                        </mesh>
                    )}

                    {/* GHIBLI WINDOW — warm amber glow on houses, blue glass on facilities */}
                    {building.type !== BUILDING_TYPES.MCK && building.type !== BUILDING_TYPES.HOUSE_HUT && !([BUILDING_TYPES.SCHOOL, BUILDING_TYPES.TK].includes(building.type)) && (
                        <group position={[0.35, 0.65, 0.61]}>
                            <mesh><boxGeometry args={[0.3, 0.3, 0.02]} /><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                            <mesh position={[0, 0, 0.011]}>
                                <boxGeometry args={[0.2, 0.2, 0.02]} />
                                <meshPhysicalMaterial color={windowColor} emissive={windowEmissive} emissiveIntensity={isCozy ? 1.5 : 0} transmission={isCozy ? 0 : 0.9} roughness={0.1} toneMapped={false} />
                            </mesh>
                            {/* Window canopy */}
                            <mesh position={[0, 0.18, 0.04]} rotation={[-0.2, 0, 0]} castShadow>
                                <boxGeometry args={[0.35, 0.03, 0.12]} />
                                <meshStandardMaterial color={roofColor} />
                            </mesh>
                            {/* Planter box (60% of houses) */}
                            {r > 0.4 && !detectiveActive && (
                                <group position={[0, -0.2, 0.05]}>
                                    <mesh castShadow><boxGeometry args={[0.28, 0.06, 0.1]} /><meshStandardMaterial color="#78350F" roughness={0.9} /></mesh>
                                    <mesh position={[-0.06, 0.05, 0]} castShadow><sphereGeometry args={[0.06, 5, 5, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#15803D" roughness={0.9} /></mesh>
                                    <mesh position={[0.06, 0.04, 0]} castShadow><sphereGeometry args={[0.05, 5, 5, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#22C55E" roughness={0.9} /></mesh>
                                </group>
                            )}
                        </group>
                    )}

                    {/* SCHOOL RIBBON WINDOWS — classroom strip */}
                    {[BUILDING_TYPES.SCHOOL, BUILDING_TYPES.TK].includes(building.type) && (
                        <group position={[0, 0.7, 0.61]}>
                            <mesh castShadow><boxGeometry args={[1.8, 0.35, 0.03]} /><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                            <mesh position={[0, 0, 0.011]}><boxGeometry args={[1.7, 0.25, 0.02]} /><meshPhysicalMaterial color="#38BDF8" transmission={0.9} roughness={0.1} /></mesh>
                            {/* Divider mullions */}
                            <mesh position={[-0.5, 0, 0.015]} castShadow><boxGeometry args={[0.03, 0.35, 0.02]} /><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                            <mesh position={[0, 0, 0.015]} castShadow><boxGeometry args={[0.03, 0.35, 0.02]} /><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                            <mesh position={[0.5, 0, 0.015]} castShadow><boxGeometry args={[0.03, 0.35, 0.02]} /><meshStandardMaterial color={detectiveActive ? '#475569' : '#F8FAFC'} /></mesh>
                        </group>
                    )}

                    {/* KANOPI TERPAL (Warung/Market/Toko) */}
                    {COMMERCIAL_TYPES.includes(building.type) && (
                        <mesh position={[0, 0.85, 0.7]} rotation={[-Math.PI / 5, 0, 0]} castShadow>
                            <boxGeometry args={[1.1, 0.04, 0.5]} />
                            <meshStandardMaterial color={r > 0.5 ? '#3B82F6' : '#EAB308'} roughness={0.9} />
                        </mesh>
                    )}

                    {/* AC OUTDOOR (Puskesmas/Kantor — Phase F preserved) */}
                    {[BUILDING_TYPES.PUSKESMAS, BUILDING_TYPES.KANTOR_DESA].includes(building.type) && (
                        <group position={[0.62, 0.8, 0]}>
                            <mesh><boxGeometry args={[0.1, 0.25, 0.35]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
                            <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} /><meshStandardMaterial color="#0f172a" />
                            </mesh>
                        </group>
                    )}

                    {/* TOREN AIR (Puskesmas, School, 20% houses — Phase F preserved) */}
                    {([BUILDING_TYPES.PUSKESMAS, BUILDING_TYPES.SCHOOL].includes(building.type)
                        || (isHouse && r > 0.8)) && (
                            <group position={[-0.35, 1.3, -0.35]}>
                                <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.12, 0.2, 0.12]} /><meshStandardMaterial color="#64748b" /></mesh>
                                <mesh position={[0, 0.1, 0]}>
                                    <cylinderGeometry args={[0.13, 0.13, 0.3, 8]} />
                                    <meshPhysicalMaterial color={detectiveActive ? '#555' : '#ea580c'} roughness={0.4} clearcoat={0.5} />
                                </mesh>
                            </group>
                        )}

                    {/* BANK SAMPAH: 3 colored bins */}
                    {building.type === BUILDING_TYPES.BANK_SAMPAH && (
                        <group position={[0, 0.25, 0.7]}>
                            <mesh position={[-0.3, 0, 0]} castShadow><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#EF4444" /></mesh>
                            <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#EAB308" /></mesh>
                            <mesh position={[0.3, 0, 0]} castShadow><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#22C55E" /></mesh>
                        </group>
                    )}

                    {/* MCK: Twin toilet doors */}
                    {building.type === BUILDING_TYPES.MCK && (
                        <group position={[0, 0.35, 0.61]}>
                            <mesh position={[-0.2, 0, 0]} castShadow><boxGeometry args={[0.2, 0.5, 0.04]} /><meshStandardMaterial color="#450A0A" /></mesh>
                            <mesh position={[0.2, 0, 0]} castShadow><boxGeometry args={[0.2, 0.5, 0.04]} /><meshStandardMaterial color="#450A0A" /></mesh>
                        </group>
                    )}

                    {/* CLOTHESLINE (30% houses — micro-storytelling) */}
                    {isHouse && r > 0.7 && !detectiveActive && (
                        <group position={[0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <mesh position={[-0.3, 0.3, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.6]} /><meshStandardMaterial color="#94A3B8" /></mesh>
                            <mesh position={[0.3, 0.3, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.6]} /><meshStandardMaterial color="#94A3B8" /></mesh>
                            <mesh position={[0, 0.55, 0]}><boxGeometry args={[0.6, 0.01, 0.01]} /><meshStandardMaterial color="#F8FAFC" /></mesh>
                            <group ref={clothesRef} position={[0, 0.55, 0]}>
                                <mesh position={[-0.15, -0.15, 0.01]} castShadow><boxGeometry args={[0.15, 0.3, 0.01]} /><meshStandardMaterial color="#F472B6" /></mesh>
                                <mesh position={[0.15, -0.1, -0.01]} castShadow><boxGeometry args={[0.12, 0.2, 0.01]} /><meshStandardMaterial color="#38BDF8" /></mesh>
                            </group>
                        </group>
                    )}

                    {/* HEALTHCARE CROSS — red (puskesmas) / green (apotek) */}
                    {[BUILDING_TYPES.PUSKESMAS, BUILDING_TYPES.PUSTU, BUILDING_TYPES.POLINDES, BUILDING_TYPES.APOTEK].includes(building.type) && (
                        <group position={[0, 1.9, 0]}>
                            {(() => {
                                const isApotek = building.type === BUILDING_TYPES.APOTEK;
                                const crossColor = isApotek ? '#10B981' : '#EF4444';
                                const crossEmissive = isApotek ? '#059669' : '#DC2626';
                                return (<>
                                    <mesh castShadow><boxGeometry args={[0.15, 0.5, 0.1]} /><meshStandardMaterial color={crossColor} emissive={crossEmissive} emissiveIntensity={2.5} toneMapped={false} /></mesh>
                                    <mesh castShadow><boxGeometry args={[0.5, 0.15, 0.1]} /><meshStandardMaterial color={crossColor} emissive={crossEmissive} emissiveIntensity={2.5} toneMapped={false} /></mesh>
                                </>);
                            })()}
                        </group>
                    )}

                    {/* MOSQUE MINARET */}
                    {building.type === BUILDING_TYPES.MOSQUE && (
                        <mesh position={[0.6, 1.5, 0.6]} castShadow>
                            <cylinderGeometry args={[0.06, 0.08, 1.5, 6]} />
                            <meshStandardMaterial color="#43A047" metalness={0.2} />
                        </mesh>
                    )}

                    {/* ROOF (with overhang) */}
                    <RoofMesh buildingType={building.type} color={roofColor} seedValue={seed} isTwoStory={isTwoStory} />
                </group>
            ) : (
                /* OPEN AREAS (alun-alun, lapangan, TPU, toga, farm) */
                <group scale={scale}>
                    <RoundedBox args={[1.8, 0.15, 1.8]} position={[0, 0.08, 0]} radius={0.05} smoothness={1} receiveShadow>
                        <meshPhysicalMaterial color={bodyColor} roughness={0.9} clearcoat={0.05} emissive={emissive} emissiveIntensity={emissiveIntensity} toneMapped={!(detectiveActive && atRisk)} />
                        <Outlines thickness={0.02} color="#0F172A" visible={hovered || selected} />
                    </RoundedBox>

                    {/* TPU: scattered tombstones */}
                    {building.type === BUILDING_TYPES.TPU ? (
                        <group position={[0, 0.2, 0]}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <mesh key={i} position={[(mulberry32(seed + i) - 0.5) * 1.2, 0.1, (mulberry32(seed + i + 10) - 0.5) * 1.2]}
                                    rotation={[0, (mulberry32(seed + i + 5) - 0.5), 0]} castShadow>
                                    <boxGeometry args={[0.1, 0.25, 0.05]} />
                                    <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
                                </mesh>
                            ))}
                        </group>
                    ) : (
                        <mesh position={[0, 0.5, 0]} castShadow>
                            <cylinderGeometry args={[0.02, 0.05, 0.8]} />
                            <meshStandardMaterial color="#B0BEC5" metalness={0.8} />
                        </mesh>
                    )}
                </group>
            )}

            {/* 🌟 ECOLOGY OF CONSEQUENCE — trash & flies for neglected houses */}
            {isFilthy && !detectiveActive && (
                <group position={[0.45, 0.05, 0.5]}>
                    {/* Dead brown yard patch */}
                    <mesh position={[-0.3, 0, -0.3]} scale={[1.2, 0.03, 1.0]} geometry={GEO.box} receiveShadow>
                        <meshStandardMaterial color="#573312" roughness={1} />
                    </mesh>
                    {/* Black trash bag */}
                    <mesh rotation={[0, r * Math.PI, 0]} scale={[1, 0.8, 1.2]} geometry={GEO.trash} castShadow>
                        <meshStandardMaterial color="#1C1917" roughness={0.6} />
                    </mesh>
                    {/* Cardboard scraps */}
                    <mesh position={[-0.15, 0.05, 0.15]} rotation={[r, 0, r]} scale={[0.12, 0.08, 0.12]} geometry={GEO.box} castShadow>
                        <meshStandardMaterial color="#78350F" />
                    </mesh>
                    {/* Buzzing flies (kinetic life particles) */}
                    <Sparkles count={6} scale={0.3} size={2.5} speed={4} opacity={0.8} color="#000000" position={[0, 0.25, 0]} noise={1} />
                </group>
            )}

            {/* ═══ LIVING WORLD OVERLAYS ═══ */}

            {/* OUTBREAK MIASMA — pulsing toxic glow over infected houses */}
            {hasOutbreak && !detectiveActive && (
                <mesh position={[0, scale[1] * 1.5 + 0.5, 0]}>
                    <sphereGeometry args={[0.6, 8, 8]} />
                    <meshBasicMaterial color="#EF4444" transparent opacity={0.15} />
                </mesh>
            )}

            {/* QUEST / ALERT MARKER — floating bouncing icon */}
            {needsAttention && !detectiveActive && !selected && (
                <Html
                    position={[0, scale[1] * 2 + 0.8, 0]}
                    center
                    distanceFactor={15}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                    <div style={{
                        fontSize: '20px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                        animation: 'questBob 1.5s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 6px rgba(234,179,8,0.8))'
                    }}>
                        ❗
                    </div>
                </Html>
            )}

            {/* OUTBREAK MARKER — urgent red pulse */}
            {hasOutbreak && !detectiveActive && !selected && (
                <Html
                    position={[0, scale[1] * 2 + 0.8, 0]}
                    center
                    distanceFactor={15}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                    <div style={{
                        fontSize: '18px',
                        animation: 'questBob 1s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.9))'
                    }}>
                        ⚠️
                    </div>
                </Html>
            )}
        </group>
    );
}

// 🌟 THE VRAM SAVIOR: Only re-render when THIS building's props actually change
export const BuildingRenderer = React.memo(BuildingRendererInternal, (prev, next) => (
    prev.selected === next.selected &&
    prev.activeLayer === next.activeLayer &&
    prev.building.id === next.building.id
));
