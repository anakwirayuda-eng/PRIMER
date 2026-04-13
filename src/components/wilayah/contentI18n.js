function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function translateWilayahString(t, key, fallback, options = {}) {
    if (typeof t !== 'function') return fallback;
    const value = t(key, { ...options, defaultValue: fallback });
    if (value == null || value === key) return fallback;
    return value;
}

function getDialogKey(dialog, index) {
    const trigger = String(dialog?.trigger || '').trim();
    if (!trigger) return `dialog_${index}`;
    return trigger.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export function localizeWilayahLayerMeta(layerId, meta, t) {
    if (!meta) return meta;
    const baseKey = `wilayahContent.layerMeta.${layerId}`;
    return {
        ...meta,
        label: translateWilayahString(t, `${baseKey}.label`, meta.label),
        subtitle: translateWilayahString(t, `${baseKey}.subtitle`, meta.subtitle),
        tooltip: translateWilayahString(t, `${baseKey}.tooltip`, meta.tooltip),
        legendItems: Array.isArray(meta.legendItems)
            ? meta.legendItems.map((item, index) => ({
                ...item,
                label: translateWilayahString(t, `${baseKey}.legendItems.${index}.label`, item.label)
            }))
            : meta.legendItems
    };
}

export function localizeBuildingScene(sceneId, scene, t) {
    if (!scene) return scene;

    const baseKey = `wilayahContent.buildingScenes.${sceneId}`;
    return {
        ...scene,
        title: translateWilayahString(t, `${baseKey}.title`, scene.title),
        subtitle: translateWilayahString(t, `${baseKey}.subtitle`, scene.subtitle),
        ambience: translateWilayahString(t, `${baseKey}.ambience`, scene.ambience),
        stations: Array.isArray(scene.stations)
            ? scene.stations.map((station, stationIndex) => {
                const stationKey = `${baseKey}.stations.${station.id || stationIndex}`;
                return {
                    ...station,
                    label: translateWilayahString(t, `${stationKey}.label`, station.label),
                    description: translateWilayahString(t, `${stationKey}.description`, station.description),
                    actions: Array.isArray(station.actions)
                        ? station.actions.map((action, actionIndex) => ({
                            ...action,
                            label: translateWilayahString(
                                t,
                                `${stationKey}.actions.${action.id || actionIndex}.label`,
                                action.label
                            )
                        }))
                        : station.actions,
                    findings: Array.isArray(station.findings)
                        ? station.findings.map((finding, findingIndex) => ({
                            ...finding,
                            text: translateWilayahString(
                                t,
                                `${stationKey}.findings.${findingIndex}.text`,
                                finding.text
                            )
                        }))
                        : station.findings
                };
            })
            : scene.stations,
        npcs: Array.isArray(scene.npcs)
            ? scene.npcs.map((npc, npcIndex) => {
                const npcKey = `${baseKey}.npcs.${npc.id || npcIndex}`;
                return {
                    ...npc,
                    name: translateWilayahString(t, `${npcKey}.name`, npc.name),
                    role: translateWilayahString(t, `${npcKey}.role`, npc.role),
                    greeting: translateWilayahString(t, `${npcKey}.greeting`, npc.greeting),
                    dialogs: Array.isArray(npc.dialogs)
                        ? npc.dialogs.map((dialog, dialogIndex) => {
                            const dialogKey = `${npcKey}.dialogs.${getDialogKey(dialog, dialogIndex)}`;
                            return {
                                ...dialog,
                                text: translateWilayahString(t, `${dialogKey}.text`, dialog.text),
                                choices: Array.isArray(dialog.choices)
                                    ? dialog.choices.map((choice, choiceIndex) => ({
                                        ...choice,
                                        text: translateWilayahString(
                                            t,
                                            `${dialogKey}.choices.${choiceIndex}.text`,
                                            choice.text
                                        )
                                    }))
                                    : dialog.choices
                            };
                        })
                        : npc.dialogs
                };
            })
            : scene.npcs,
        completionReward: isPlainObject(scene.completionReward)
            ? {
                ...scene.completionReward,
                message: translateWilayahString(
                    t,
                    `${baseKey}.completionReward.message`,
                    scene.completionReward.message
                )
            }
            : scene.completionReward
    };
}
