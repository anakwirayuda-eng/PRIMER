/**
 * @reflection
 * [IDENTITY]: MapCanvas.jsx
 * [PURPOSE]: Interactive map layer with building sprites, environmental effects, and real-time surveillance badges.
 * [STATE]: Stable
 * [ANCHOR]: MapCanvas
 * [DEPENDS_ON]: TerrainCanvas, constants.js, map-utils.js
 */

import React, { useState, useEffect, useRef } from 'react';
import { Home as HomeIcon, Building } from 'lucide-react';
import TerrainCanvas from './TerrainCanvas.jsx';
import { BUILDING_TYPES, TILE_TYPES } from './constants.js';

const MapCanvas = ({
    mapData,
    selectedBuilding,
    onSelectBuilding,
    showDBCases,
    surveillanceStatus,
    villageData,
    activeLayer,
    showRiskOnly,
    textures,
    time,
    activeOutbreaks
}) => {

    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const TILE_SIZE = 36;
    const mapRef = useRef(null);

    const FRAME = {
        outer: '#2d3a1f',
        middle: '#4a5d32',
        inner: '#6b8045',
        shadow: '#1a2410',
    };

    const getBadgeStyle = (score) => {
        let bgColor, borderColor;
        if (score > 0.7) { bgColor = '#10b981'; borderColor = '#047857'; }
        else if (score > 0.4) { bgColor = '#f59e0b'; borderColor = '#b45309'; }
        else { bgColor = '#ef4444'; borderColor = '#b91c1c'; }

        return {
            background: bgColor,
            border: `1px solid ${borderColor}`,
            color: 'white',
        };
    };

    const houses = mapData.buildings.filter(b => b.familyId);
    const publicBuildings = mapData.buildings.filter(b => !b.familyId);

    const [birds, setBirds] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const id = Date.now();
                setBirds(prev => [...prev, { id, startY: Math.random() * 100, speed: 2 + Math.random() * 3 }]);
                setTimeout(() => {
                    setBirds(prev => prev.filter(b => b.id !== id));
                }, 10000);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!textures) return <div className="p-10 text-center">Loading High-Res Textures...</div>;

    return (
        <div className="relative inline-block overflow-visible">

            <div
                style={{
                    padding: '8px',
                    background: `linear-gradient(135deg, ${FRAME.middle} 0%, ${FRAME.outer} 100%)`,
                    borderRadius: '16px',
                    boxShadow: `0 8px 0 ${FRAME.shadow}, 0 20px 40px rgba(0,0,0,0.5)`,
                }}
            >
                <div
                    style={{
                        padding: '4px',
                        background: FRAME.inner,
                        borderRadius: '10px',
                        boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.4)',
                        overflow: 'visible',
                    }}
                >
                    <div
                        ref={mapRef}
                        className="relative font-sans origin-center transition-transform duration-200 ease-out"
                        style={{
                            width: mapData.width * TILE_SIZE,
                            height: mapData.height * TILE_SIZE,
                            borderRadius: '4px',
                            backgroundColor: '#2d3a1f',
                            imageRendering: 'pixelated',
                            overflow: 'visible'
                        }}
                    >
                        <TerrainCanvas mapData={mapData} textures={textures} TILE_SIZE={TILE_SIZE} />

                        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
                            {mapData.tiles.map((row, y) =>
                                row.map((tile, x) => {
                                    if (tile !== TILE_TYPES.TREE) return null;
                                    return (
                                        <img
                                            key={`tree-${x}-${y}`}
                                            src={textures.tree}
                                            alt=""
                                            className="animate-sway absolute"
                                            style={{
                                                bottom: (mapData.height - y - 1) * TILE_SIZE + TILE_SIZE * 0.1,
                                                left: x * TILE_SIZE + TILE_SIZE * 0.5,
                                                transform: 'translateX(-50%)',
                                                transformOrigin: 'bottom center',
                                                width: TILE_SIZE * 1.5,
                                                height: TILE_SIZE * 2.0,
                                                zIndex: 5 + y,
                                                filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.4))'
                                            }}
                                        />
                                    );
                                })
                            )}
                        </div>

                        {houses.map(building => {
                            const isSelected = selectedBuilding?.id === building.id;
                            const score = building.iksScore || 0;
                            const isRiskFamily = score < 0.4;
                            const isGhosted = showRiskOnly && !isRiskFamily;

                            const family = villageData?.families?.find(f => f.id === building.familyId);
                            const hasSurveillanceCase = family && surveillanceStatus && surveillanceStatus[family.houseId];
                            const caseInfo = hasSurveillanceCase ? surveillanceStatus[family.houseId] : null;

                            return (
                                <div
                                    key={building.id}
                                    onClick={() => onSelectBuilding(building)}
                                    onMouseEnter={() => setHoveredBuilding(building)}
                                    onMouseLeave={() => setHoveredBuilding(null)}
                                    className="absolute cursor-pointer transition-all duration-300 group"
                                    style={{
                                        left: building.x * TILE_SIZE - (TILE_SIZE * 0.4),
                                        top: building.y * TILE_SIZE - (TILE_SIZE * 1.0),
                                        width: TILE_SIZE * 2.2,
                                        height: TILE_SIZE * 2.6,
                                        zIndex: isSelected ? 300 : 10 + building.y,
                                        transform: isSelected ? 'scale(1.1) translateY(-6px)' : 'scale(1)',
                                        opacity: isGhosted ? 0.35 : 1,
                                        filter: isGhosted ? 'grayscale(0.8) contrast(0.8)' : 'none',
                                        pointerEvents: isGhosted ? 'none' : 'auto',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center'
                                    }}
                                    title={building.name}
                                >
                                    {activeLayer === 'pispk' && isRiskFamily && (
                                        <div className="absolute inset-0 -m-1 rounded-lg border-2 border-red-500 animate-pulse"
                                            style={{ boxShadow: '0 0 16px 2px rgba(239, 68, 68, 0.4)' }}
                                        />
                                    )}

                                    {activeLayer === 'phbs' && building.phbsScore != null && (
                                        <div className="absolute inset-0 -m-1 rounded-lg border-2 animate-pulse"
                                            style={{
                                                borderColor: building.phbsScore >= 7 ? '#10b981' : building.phbsScore >= 4 ? '#f59e0b' : '#ef4444',
                                                boxShadow: `0 0 12px 2px ${building.phbsScore >= 7 ? 'rgba(16,185,129,0.3)' : building.phbsScore >= 4 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                            }}
                                        />
                                    )}

                                    {activeLayer === 'perilaku' && building.behaviorRisk && (
                                        <div className="absolute inset-0 -m-1 rounded-lg border-2"
                                            style={{
                                                borderColor: building.behaviorRisk === 'high' ? '#ef4444' : building.behaviorRisk === 'medium' ? '#f59e0b' : '#10b981',
                                                boxShadow: `0 0 12px 2px ${building.behaviorRisk === 'high' ? 'rgba(239,68,68,0.35)' : building.behaviorRisk === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.2)'}`,
                                            }}
                                        />
                                    )}

                                    {showDBCases && hasSurveillanceCase && (
                                        <div className="absolute inset-0 -m-2 rounded-full border-4 border-red-500 animate-pulse opacity-80"
                                            style={{ boxShadow: '0 0 10px 3px rgba(239, 68, 68, 0.6)' }}
                                        />
                                    )}

                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <img
                                            src={
                                                building.type === BUILDING_TYPES.HOUSE_BLUE ? textures.houseBlue :
                                                    building.type === BUILDING_TYPES.HOUSE_MODERN ? textures.houseModern :
                                                        building.type === BUILDING_TYPES.HOUSE_TRAD ? textures.houseTrad :
                                                            textures.house
                                            }
                                            alt="Rumah"
                                            className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:-translate-y-2 group-hover:drop-shadow-[0_12px_12px_rgba(0,0,0,0.4)]"
                                            style={{
                                                imageRendering: 'pixelated',
                                                filter: 'drop-shadow(0 6px 4px rgba(0,0,0,0.25))'
                                            }}
                                        />
                                    </div>

                                    {showDBCases && hasSurveillanceCase && (
                                        <div className="absolute -top-3 -left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-md z-20 animate-bounce">
                                            ⚠️ {caseInfo?.caseType?.toUpperCase()}
                                        </div>
                                    )}

                                    {(() => {
                                        const outbreak = activeOutbreaks?.find(o => o.affectedHouseIds?.includes(building.id));
                                        if (outbreak && !outbreak.resolved) {
                                            return (
                                                <>
                                                    <div className="absolute inset-0 -m-6 rounded-full border-4 border-red-600/60 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '3s' }} />
                                                    <div className="absolute inset-0 -m-3 rounded-full bg-red-500/30 animate-pulse pointer-events-none border-2 border-red-500/50" />
                                                </>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Layer-specific badges */}
                                    {activeLayer === 'phbs' && building.phbsScore != null ? (
                                        <div
                                            className="absolute -top-1 -right-0 w-6 h-5 flex items-center justify-center rounded-full text-[9px] font-bold shadow-sm z-10"
                                            style={{
                                                background: building.phbsScore >= 7 ? '#10b981' : building.phbsScore >= 4 ? '#f59e0b' : '#ef4444',
                                                border: `1px solid ${building.phbsScore >= 7 ? '#047857' : building.phbsScore >= 4 ? '#b45309' : '#b91c1c'}`,
                                                color: 'white',
                                            }}
                                        >
                                            {building.phbsScore}
                                        </div>
                                    ) : activeLayer === 'perilaku' && building.behaviorEmoji ? (
                                        <div className="absolute -top-1 -right-0 w-5 h-5 flex items-center justify-center text-xs z-10">
                                            {building.behaviorEmoji}
                                        </div>
                                    ) : !isGhosted && (
                                        <div
                                            className="absolute -top-1 -right-0 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold shadow-sm z-10"
                                            style={getBadgeStyle(score)}
                                        >
                                            {Math.round(score * 100)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {publicBuildings.map(building => {
                            const isSelected = selectedBuilding?.id === building.id;
                            const spriteTexture = {
                                [BUILDING_TYPES.PUSKESMAS]: textures.puskesmas,
                                [BUILDING_TYPES.MOSQUE]: textures.mosque,
                                [BUILDING_TYPES.SCHOOL]: textures.school,
                                [BUILDING_TYPES.TK]: textures.tk,
                                [BUILDING_TYPES.BALAI_DESA]: textures.balaiDesa,
                                [BUILDING_TYPES.KANTOR_DESA]: textures.office,
                                [BUILDING_TYPES.RUMAH_DINAS]: textures.rumahDinas,
                                [BUILDING_TYPES.MARKET]: textures.market,
                                [BUILDING_TYPES.WATERFALL]: textures.forest,
                                [BUILDING_TYPES.SUNGAI]: textures.river,
                                [BUILDING_TYPES.LAPANGAN]: textures.lapangan,
                                [BUILDING_TYPES.ALUN_ALUN]: textures.alun_alun,
                                [BUILDING_TYPES.POSYANDU]: textures.posyandu,
                                [BUILDING_TYPES.WELL]: textures.well,
                                [BUILDING_TYPES.MCK]: textures.mck,
                                [BUILDING_TYPES.APOTEK]: textures.puskesmas,
                                [BUILDING_TYPES.TOKO_KELONTONG]: textures.market,
                                [BUILDING_TYPES.KB_POST]: textures.posyandu,
                                [BUILDING_TYPES.POLINDES]: textures.polindes,
                                [BUILDING_TYPES.PUSTU]: textures.pustu,
                                [BUILDING_TYPES.WARUNG]: textures.market,
                                [BUILDING_TYPES.PLAYGROUND]: textures.playground,
                                [BUILDING_TYPES.TPU]: textures.tpu,
                                [BUILDING_TYPES.PAMSIMAS]: textures.pamsimas,
                                [BUILDING_TYPES.BANK_SAMPAH]: textures.bankSampah,
                                [BUILDING_TYPES.POS_GIZI]: textures.posGizi,
                                [BUILDING_TYPES.RTK]: textures.rtk,
                                [BUILDING_TYPES.TOGA]: textures.toga,
                                [BUILDING_TYPES.IKS_SCOREBOARD]: textures.iks_scoreboard,
                                [BUILDING_TYPES.DASHAT]: textures.posyandu,
                                [BUILDING_TYPES.POS_UKK]: textures.posyandu,
                                [BUILDING_TYPES.HUTAN_LINDUNG]: textures.hutan_lindung,
                                [BUILDING_TYPES.SUNGAI_CIKAPAS]: textures.sungai_cikapas,
                                [BUILDING_TYPES.GAPURA_DESA]: textures.gapura_desa,
                                [BUILDING_TYPES.SAWAH_BERUNDAK]: textures.sawah_berundak,
                            }[building.type] || textures.house;

                            const isLandmark = [
                                BUILDING_TYPES.HUTAN_LINDUNG, BUILDING_TYPES.SUNGAI_CIKAPAS,
                                BUILDING_TYPES.GAPURA_DESA, BUILDING_TYPES.SAWAH_BERUNDAK, BUILDING_TYPES.TOGA
                            ].includes(building.type);

                            return (
                                <div
                                    key={building.id}
                                    onClick={() => onSelectBuilding(building)}
                                    className="absolute cursor-pointer transition-all duration-300 group"
                                    style={{
                                        left: building.x * TILE_SIZE - (TILE_SIZE * (isLandmark ? 2.0 : 0.8)),
                                        top: building.y * TILE_SIZE - (TILE_SIZE * (isLandmark ? 4.0 : 1.5)),
                                        width: isLandmark ? TILE_SIZE * 5 : (building.type === BUILDING_TYPES.MCK ? TILE_SIZE * 4 : TILE_SIZE * 3),
                                        height: isLandmark ? TILE_SIZE * 5 : (building.type === BUILDING_TYPES.MCK ? TILE_SIZE * 4 : TILE_SIZE * 3),
                                        zIndex: isSelected ? 301 : 15 + building.y,
                                        transform: isSelected ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
                                        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                                        opacity: isLandmark ? 0.9 : 1
                                    }}
                                    title={building.name}
                                >
                                    <div className="relative w-full h-full flex flex-col justify-end items-center">
                                        <img src={spriteTexture} alt={building.name} className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:-translate-y-3" style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.3))' }} />
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap overflow-visible pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-slate-900 shadow-xl text-white text-[10px] px-2 py-1 rounded-md border border-white/20 font-bold uppercase tracking-wider">
                                                {building.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 100%)' }} />

                        {(() => {
                            let tint = 'transparent';
                            if (time >= 300 && time < 600) tint = 'rgba(255, 182, 193, 0.15)';
                            else if (time >= 900 && time < 1080) tint = 'rgba(255, 140, 0, 0.2)';
                            else if (time >= 1140 || time < 300) tint = 'rgba(0, 0, 50, 0.4)';

                            return (
                                <div className="absolute inset-0 pointer-events-none transition-colors duration-[5000ms]"
                                    style={{ backgroundColor: tint, mixBlendMode: 'overlay', zIndex: 150 }}
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>


            {birds.map(bird => (
                <div key={bird.id} className="absolute z-10 pointer-events-none animate-fly" style={{ top: `${bird.startY}%`, '--speed': `${bird.speed}s`, opacity: 0.15 }}>
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="black" strokeWidth="2"><path d="M0,10 Q10,0 20,10 Q30,0 40,10" /></svg>
                </div>
            ))}

            {hoveredBuilding && (
                <div className="fixed pointer-events-none z-tooltip bg-slate-900/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200" style={{ left: window.innerWidth / 2 - 140, bottom: '40px', width: '280px' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            {hoveredBuilding.familyId ? <HomeIcon size={16} /> : <Building size={16} />}
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{hoveredBuilding.type?.replace(/_/g, ' ')}</h5>
                            <p className="text-sm font-black text-white leading-tight">{hoveredBuilding.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapCanvas;
