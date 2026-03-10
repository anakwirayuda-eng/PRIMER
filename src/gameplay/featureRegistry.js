/**
 * @reflection
 * [IDENTITY]: featureRegistry.js
 * [PURPOSE]: Manifest of critical gameplay features for regression testing.
 * [STATE]: Stable
 * [ANCHOR]: FEATURE_REGISTRY
 */

export const FEATURE_REGISTRY = [
    {
        id: 'WILAYAH_IKS_BOARD',
        page: 'WilayahPage',
        required: true,
        selector: '[data-testid="wilayah-iks-board"]',
        purpose: 'Village statistics and IKS Board must be present.'
    },
    {
        id: 'DASHBOARD_STATS',
        page: 'DashboardPage',
        required: true,
        selector: '[data-testid="dashboard-stats"]',
        purpose: 'Main KPI statistics must be visible.'
    },
    {
        id: 'MAIA_CODEX_ENTRY',
        page: 'WikiPage',
        required: true,
        selector: '[data-testid="maia-codex"]',
        purpose: 'Clinical education / MAIA Codex must be accessible.'
    },
    {
        id: 'CLINICAL_EMR_SIDEBAR',
        page: 'ClinicalPage',
        required: true,
        selector: '[data-testid="clinical-sidebar"]',
        purpose: 'MAIA decision support and reasoning clues must render.'
    }
];
