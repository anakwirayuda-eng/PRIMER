import React, { useCallback, useRef, useState } from 'react';
import { Bvh, Html } from '@react-three/drei';

import { InstancedTerrain } from './InstancedTerrain.jsx';
import { BuildingRenderer } from './BuildingRenderer.jsx';

const DEFAULT_BACKGROUND = '#dbeafe';

export default function DioramaSceneCore({
    mapData,
    selectedBuildingId = null,
    activeLayer = 'general',
    onBuildingSelect = null,
    enableTooltip = true,
    tooltipDistanceFactor = 15,
    backgroundColor = DEFAULT_BACKGROUND,
    renderTier = 'standard',
}) {
    const tooltipGroupRef = useRef(null);
    const [tooltipData, setTooltipData] = useState(null);

    const handleHover = useCallback((building, position) => {
        if (!enableTooltip || !tooltipGroupRef.current) return;

        if (building && position) {
            tooltipGroupRef.current.position.set(position.x, position.y + 2.5, position.z);
            tooltipGroupRef.current.visible = true;
            setTooltipData({
                name: building.name || '',
                type: (building.type || '').replace(/_/g, ' ').toUpperCase(),
            });
            return;
        }

        tooltipGroupRef.current.visible = false;
        setTooltipData(null);
    }, [enableTooltip]);

    const handleSelect = useCallback((selectedBuildingData, fallbackType) => {
        if (!onBuildingSelect) return;
        onBuildingSelect({
            ...selectedBuildingData,
            x: selectedBuildingData.worldX ?? selectedBuildingData.x,
            y: selectedBuildingData.worldY ?? selectedBuildingData.y,
            type: selectedBuildingData.type || fallbackType || null,
        });
    }, [onBuildingSelect]);

    if (!mapData?.tiles) return null;

    return (
        <Bvh firstHitOnly>
            <group position={[0, -1, 0]}>
                <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[500, 500]} />
                    <meshBasicMaterial color={backgroundColor} />
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
                        onHover={enableTooltip ? handleHover : undefined}
                        onSelect={(selectedBuildingData) => handleSelect(selectedBuildingData, building.type)}
                        renderTier={renderTier}
                    />
                ))}

                {enableTooltip && (
                    <group ref={tooltipGroupRef} visible={false}>
                        <Html center distanceFactor={tooltipDistanceFactor} style={{ pointerEvents: 'none', transition: 'opacity 0.1s' }}>
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
                                    <span style={{
                                        display: 'block',
                                        fontSize: '8px',
                                        fontWeight: 900,
                                        color: '#34d399',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                    }}>
                                        {tooltipData?.type || ''}
                                    </span>
                                    <span style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 800,
                                    }}>
                                        {tooltipData?.name || ''}
                                    </span>
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
                )}
            </group>
        </Bvh>
    );
}
