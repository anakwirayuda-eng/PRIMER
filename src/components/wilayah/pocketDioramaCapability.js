export function resolvePocketDioramaCapability({
    hasScopeData = false,
    canUse3D = false,
    isCompactHud = false,
    showShowcaseModal = false,
}) {
    if (!hasScopeData) return 'off';
    if (showShowcaseModal) return 'snapshot';
    if (canUse3D && !isCompactHud) return 'live';
    return 'snapshot';
}
