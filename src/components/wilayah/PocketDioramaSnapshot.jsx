import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getBuildingInsetUrl } from './constants.js';
import { translateWilayahString } from './contentI18n.js';

function getFocusBuilding(mapData, selectedBuildingId) {
    if (!Array.isArray(mapData?.buildings) || mapData.buildings.length === 0) return null;
    if (selectedBuildingId) {
        const selected = mapData.buildings.find((building) => building.id === selectedBuildingId);
        if (selected) return selected;
    }
    return mapData.buildings.find((building) => !building.familyId) || mapData.buildings[0] || null;
}

const SNAPSHOT_MODE_FALLBACKS = {
    mobile: {
        label: 'Mobile Snapshot',
        descriptor: 'Bottom-sheet safe',
    },
    gpuSafe: {
        label: 'GPU Safe Snapshot',
        descriptor: 'No WebGL',
    },
    standard: {
        label: 'Inspector Snapshot',
        descriptor: 'Static inspector',
    }
};

export default function PocketDioramaSnapshot({
    mapData,
    selectedBuildingId = null,
    modeVariant = 'standard',
}) {
    const { t } = useTranslation();
    const tr = (key, fallback, options = {}) => translateWilayahString(t, key, fallback, options);

    const focusBuilding = useMemo(
        () => getFocusBuilding(mapData, selectedBuildingId),
        [mapData, selectedBuildingId]
    );

    if (!mapData?.scopeMeta) {
        return null;
    }

    const width = Math.max(1, mapData.width || 1);
    const height = Math.max(1, mapData.height || 1);
    const buildingCount = mapData.scopeMeta.buildingCount || mapData.buildings?.length || 0;
    const houseCount = mapData.scopeMeta.houseCount || 0;
    const normalizedModeVariant = SNAPSHOT_MODE_FALLBACKS[modeVariant] ? modeVariant : 'standard';
    const modeCopy = SNAPSHOT_MODE_FALLBACKS[normalizedModeVariant];
    const modeLabel = tr(
        `wilayahContent.ui.dioramaInspector.modeLabels.${normalizedModeVariant}`,
        modeCopy.label
    );
    const modeDescriptor = tr(
        `wilayahContent.ui.dioramaInspector.modeDescriptors.${normalizedModeVariant}`,
        modeCopy.descriptor
    );
    const nodeCountText = tr('wilayahContent.ui.dioramaInspector.metricNodes', '{{count}} titik', {
        count: buildingCount,
    });
    const houseCountText = tr('wilayahContent.ui.dioramaInspector.metricHouses', '{{count}} rumah', {
        count: houseCount,
    });
    const snapshotAriaLabel = tr('wilayahContent.ui.dioramaInspector.snapshotAriaLabel', 'Snapshot {{label}}', {
        label: mapData.scopeMeta.label,
    });
    const snapshotSummary = tr(
        'wilayahContent.ui.dioramaInspector.snapshotSummary',
        'Snapshot ini menjaga konteks RW/bangunan tetap terbaca tanpa mengaktifkan render WebGL di inspector.'
    );
    const focusLabel = tr('wilayahContent.ui.dioramaInspector.focusLabel', 'Fokus Inspector');
    const metricMode = tr('wilayahContent.ui.dioramaInspector.metricMode', 'Mode');
    const metricModeSnapshot = tr('wilayahContent.ui.dioramaInspector.metricModeSnapshot', 'Snapshot');
    const metricRender = tr('wilayahContent.ui.dioramaInspector.metricRender', 'Render');
    const metricRenderSafe = tr('wilayahContent.ui.dioramaInspector.metricRenderSafe', 'GPU Aman');
    const scopeKindLabel = tr(
        `wilayahContent.ui.dioramaInspector.scopeKinds.${String(mapData.scopeMeta.kind || 'scope')}`,
        String(mapData.scopeMeta.kind || 'scope')
    );

    return (
        <div className="space-y-3 sm:space-y-4" data-testid="pocket-diorama-snapshot">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">{modeLabel}</p>
                    <p className="mt-1 truncate text-xs font-bold text-white/60">{mapData.scopeMeta.label}</p>
                </div>
                <div className="self-start rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                    {modeDescriptor}
                </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30">
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.6px)',
                        backgroundSize: '14px 14px',
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-400/10 to-transparent" />

                <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
                    <div className="relative aspect-[4/3] min-h-[208px] sm:min-h-[228px]">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full"
                            role="img"
                            aria-label={snapshotAriaLabel}
                        >
                            <defs>
                                <linearGradient id="snapshot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0f172a" />
                                    <stop offset="100%" stopColor="#172554" />
                                </linearGradient>
                                <pattern id="snapshot-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="0.4" />
                                </pattern>
                            </defs>
                            <rect x="0" y="0" width="100" height="100" fill="url(#snapshot-bg)" />
                            <rect x="0" y="0" width="100" height="100" fill="url(#snapshot-grid)" />

                            {Array.isArray(mapData.buildings) && mapData.buildings.map((building) => {
                                const x = (building.x / width) * 100;
                                const y = (building.y / height) * 100;
                                const isHouse = Boolean(building.familyId);
                                const isSelected = building.id === selectedBuildingId;
                                const fill = isSelected
                                    ? '#fbbf24'
                                    : isHouse
                                        ? '#67e8f9'
                                        : '#c084fc';

                                if (isHouse) {
                                    return (
                                        <g key={building.id || `${building.type}-${building.x}-${building.y}`}>
                                            {isSelected && (
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="4.8"
                                                    fill="none"
                                                    stroke="rgba(251,191,36,0.6)"
                                                    strokeWidth="0.9"
                                                />
                                            )}
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={isSelected ? '2.6' : '1.9'}
                                                fill={fill}
                                                opacity={isSelected ? '1' : '0.88'}
                                            />
                                        </g>
                                    );
                                }

                                const rectWidth = isSelected ? 7.5 : 6;
                                const rectHeight = isSelected ? 5.4 : 4.4;
                                return (
                                    <g key={building.id || `${building.type}-${building.x}-${building.y}`}>
                                        {isSelected && (
                                            <rect
                                                x={x - rectWidth / 2 - 0.8}
                                                y={y - rectHeight / 2 - 0.8}
                                                width={rectWidth + 1.6}
                                                height={rectHeight + 1.6}
                                                rx="2.6"
                                                fill="none"
                                                stroke="rgba(251,191,36,0.58)"
                                                strokeWidth="0.9"
                                            />
                                        )}
                                        <rect
                                            x={x - rectWidth / 2}
                                            y={y - rectHeight / 2}
                                            width={rectWidth}
                                            height={rectHeight}
                                            rx="2.2"
                                            fill={fill}
                                            opacity={isSelected ? '1' : '0.9'}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-transparent px-4 pb-3 pt-10">
                            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                                <span>{nodeCountText}</span>
                                <span>{houseCountText}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex min-h-[188px] flex-col justify-between gap-4 border-t border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 sm:min-h-[220px] sm:p-5 lg:border-l lg:border-t-0">
                        <div className="space-y-3">
                            <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                                {scopeKindLabel}
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-black leading-snug text-white sm:text-[15px]">
                                    {focusBuilding?.name || mapData.scopeMeta.label}
                                </h4>
                                <p className="text-xs font-medium leading-relaxed text-white/55">
                                    {snapshotSummary}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {focusBuilding && (
                                <div className="flex items-center gap-3.5 rounded-[20px] border border-white/10 bg-black/20 p-3.5 shadow-inner shadow-black/20">
                                    <img
                                        src={getBuildingInsetUrl(focusBuilding.type)}
                                        alt={focusBuilding.name || focusBuilding.type}
                                        className="h-16 w-16 shrink-0 object-contain drop-shadow-xl"
                                    />
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                                            {focusLabel}
                                        </div>
                                        <div className="mt-1 text-xs font-bold leading-snug text-white/80">
                                            {focusBuilding.name || focusBuilding.type}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                                        {metricMode}
                                    </div>
                                    <div className="mt-1 text-[11px] font-bold text-white/75">
                                        {metricModeSnapshot}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                                        {metricRender}
                                    </div>
                                    <div className="mt-1 text-[11px] font-bold text-white/75">
                                        {metricRenderSafe}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
